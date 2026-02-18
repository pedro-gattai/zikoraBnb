import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { BlockchainService } from '../blockchain/blockchain.service';
import { getTokens, mapTokenAddress } from '../config/tokens';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  private cache = new Map<string, CacheEntry<any>>();

  // BSC produces ~3s blocks, ~28800 blocks/day, ~10512000/year
  private readonly BLOCKS_PER_YEAR = 10512000;

  constructor(private blockchain: BlockchainService) {}

  async getTokenPriceUsd(tokenAddress: string): Promise<number> {
    const lower = tokenAddress.toLowerCase();
    const usdt = this.blockchain.addresses.USDT.toLowerCase();
    const usdc = this.blockchain.addresses.USDC.toLowerCase();

    // Stablecoins = $1
    if (lower === usdt || lower === usdc) return 1.0;

    const cacheKey = `price:${lower}`;
    const cached = this.getFromCache<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const quoter = this.blockchain.getQuoter();
      // Quote 1 token against USDT
      const decimals = await this.getDecimals(tokenAddress);
      const amountIn = ethers.parseUnits('1', decimals);

      const result = await quoter.quoteExactInputSingle.staticCall({
        tokenIn: tokenAddress,
        tokenOut: this.blockchain.addresses.USDT,
        amountIn,
        fee: 2500,
        sqrtPriceLimitX96: 0,
      });

      const price = Number(ethers.formatUnits(result.amountOut, 18));
      this.setCache(cacheKey, price, 60_000); // 60s TTL
      return price;
    } catch (err) {
      this.logger.warn(`Price fetch failed for ${tokenAddress}, trying fee 500`);
      try {
        const quoter = this.blockchain.getQuoter();
        const decimals = await this.getDecimals(tokenAddress);
        const amountIn = ethers.parseUnits('1', decimals);

        const result = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: tokenAddress,
          tokenOut: this.blockchain.addresses.USDT,
          amountIn,
          fee: 500,
          sqrtPriceLimitX96: 0,
        });

        const price = Number(ethers.formatUnits(result.amountOut, 18));
        this.setCache(cacheKey, price, 60_000);
        return price;
      } catch {
        this.logger.warn(
          `Testnet price failed for ${tokenAddress}, trying mainnet fallback`,
        );
        return this.getMainnetPriceFallback(tokenAddress, cacheKey);
      }
    }
  }

  private async getMainnetPriceFallback(
    testnetTokenAddress: string,
    cacheKey: string,
  ): Promise<number> {
    const quoter = this.blockchain.getMainnetQuoter();
    if (!quoter) return 0;

    const mapped = mapTokenAddress(
      testnetTokenAddress,
      this.blockchain.chainId,
      56,
    );
    if (!mapped) {
      this.logger.warn(`No mainnet mapping for ${testnetTokenAddress}`);
      return 0;
    }

    const mainnetUsdt = '0x55d398326f99059fF775485246999027B3197955';
    const amountIn = ethers.parseUnits('1', mapped.decimals);
    const feeTiers = [2500, 500, 100];

    for (const fee of feeTiers) {
      try {
        const result = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: mapped.address,
          tokenOut: mainnetUsdt,
          amountIn,
          fee,
          sqrtPriceLimitX96: 0,
        });

        const price = Number(ethers.formatUnits(result.amountOut, 18));
        this.logger.log(
          `Mainnet fallback price for ${testnetTokenAddress}: $${price.toFixed(2)} (fee ${fee})`,
        );
        this.setCache(cacheKey, price, 60_000);
        return price;
      } catch {
        continue;
      }
    }

    this.logger.error(
      `Mainnet fallback also failed for ${testnetTokenAddress}`,
    );
    return 0;
  }

  async getVenusAPY(vTokenAddress: string): Promise<number> {
    const cacheKey = `apy:${vTokenAddress.toLowerCase()}`;
    const cached = this.getFromCache<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const vToken = this.blockchain.getVToken(vTokenAddress);
      const supplyRatePerBlock: bigint = await vToken.supplyRatePerBlock();
      // APY = (supplyRatePerBlock * blocksPerYear) / 1e18 * 100
      const apy =
        (Number(supplyRatePerBlock) * this.BLOCKS_PER_YEAR) / 1e18 * 100;
      this.setCache(cacheKey, apy, 300_000); // 5min TTL
      return apy;
    } catch (err) {
      this.logger.error(`Venus APY fetch failed for ${vTokenAddress}`, err);
      return 0;
    }
  }

  async getVenusBalance(
    vTokenAddress: string,
    wallet: string,
  ): Promise<{ vTokenBalance: bigint; underlyingBalance: bigint }> {
    try {
      const vToken = this.blockchain.getVToken(vTokenAddress);
      const vTokenBalance: bigint = await vToken.balanceOf(wallet);
      let underlyingBalance = 0n;
      if (vTokenBalance > 0n) {
        underlyingBalance = await vToken.balanceOfUnderlying.staticCall(wallet);
      }
      return { vTokenBalance, underlyingBalance };
    } catch {
      return { vTokenBalance: 0n, underlyingBalance: 0n };
    }
  }

  async getTokenBalance(
    tokenAddress: string,
    wallet: string,
  ): Promise<bigint> {
    try {
      const erc20 = this.blockchain.getERC20(tokenAddress);
      return await erc20.balanceOf(wallet);
    } catch {
      return 0n;
    }
  }

  async getBNBBalance(wallet: string): Promise<bigint> {
    try {
      return await this.blockchain.provider.getBalance(wallet);
    } catch {
      return 0n;
    }
  }

  async getDecimals(tokenAddress: string): Promise<number> {
    // Check known tokens first
    const known = Object.values(getTokens(this.blockchain.chainId)).find(
      (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
    );
    if (known) return known.decimals;

    try {
      const erc20 = this.blockchain.getERC20(tokenAddress);
      return Number(await erc20.decimals());
    } catch {
      return 18;
    }
  }

  async getVTokenExchangeRate(vTokenAddress: string): Promise<bigint> {
    try {
      const vToken = this.blockchain.getVToken(vTokenAddress);
      return await vToken.exchangeRateStored();
    } catch {
      // Default exchange rate: 2e16 (0.02 in 18 decimals) — Venus initial rate
      return 200000000000000n;
    }
  }

  async getQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    fee = 2500,
  ): Promise<bigint> {
    try {
      const quoter = this.blockchain.getQuoter();
      const result = await quoter.quoteExactInputSingle.staticCall({
        tokenIn,
        tokenOut,
        amountIn,
        fee,
        sqrtPriceLimitX96: 0,
      });
      return result.amountOut;
    } catch {
      return 0n;
    }
  }

  private getFromCache<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  private setCache<T>(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}
