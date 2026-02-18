import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { MarketDataService } from '../market-data/market-data.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { getTokens } from '../config/tokens';

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  price: number;
  change24h: number;
}

export interface Position {
  id: string;
  protocol: string;
  type: 'lending' | 'liquidity' | 'staking';
  token: string;
  amount: string;
  valueUsd: number;
  apy: number;
  earnings: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private marketData: MarketDataService,
    private blockchain: BlockchainService,
    private config: ConfigService,
  ) {}

  async getPortfolio(walletAddress?: string) {
    const vaultAddress =
      walletAddress || this.config.get<string>('VAULT_ADDRESS');

    if (!vaultAddress) {
      return {
        totalValueUsd: 0,
        change24h: 0,
        change24hPercent: 0,
        tokens: [],
        positions: [],
        chartData: [],
      };
    }

    const tokens: TokenBalance[] = [];
    const positions: Position[] = [];
    let totalValueUsd = 0;

    // Fetch token balances
    const tokenMetas = getTokens(this.blockchain.chainId);
    for (const [symbol, token] of Object.entries(tokenMetas)) {
      if (symbol === 'WBNB') continue;

      try {
        let balance: bigint;
        if (symbol === 'BNB') {
          balance = await this.marketData.getBNBBalance(vaultAddress);
        } else {
          balance = await this.marketData.getTokenBalance(
            token.address,
            vaultAddress,
          );
        }

        if (balance > 0n) {
          const formatted = ethers.formatUnits(balance, token.decimals);
          const price = await this.marketData.getTokenPriceUsd(token.address);
          const balanceUsd = Number(formatted) * price;
          totalValueUsd += balanceUsd;

          tokens.push({
            symbol,
            name: token.name,
            balance: Number(formatted).toFixed(4),
            balanceUsd,
            price,
            change24h: 0, // Would need historical data
          });
        }
      } catch (err) {
        this.logger.warn(`Failed to fetch balance for ${symbol}`, err);
      }
    }

    // Fetch Venus positions
    for (const [symbol, token] of Object.entries(tokenMetas)) {
      if (!token.vToken) continue;

      try {
        const { underlyingBalance } = await this.marketData.getVenusBalance(
          token.vToken,
          vaultAddress,
        );

        if (underlyingBalance > 0n) {
          const formatted = ethers.formatUnits(
            underlyingBalance,
            token.decimals,
          );
          const price = await this.marketData.getTokenPriceUsd(token.address);
          const valueUsd = Number(formatted) * price;
          const apy = await this.marketData.getVenusAPY(token.vToken);
          totalValueUsd += valueUsd;

          positions.push({
            id: `venus-${symbol.toLowerCase()}`,
            protocol: 'Venus Protocol',
            type: 'lending',
            token: symbol,
            amount: Number(formatted).toFixed(4),
            valueUsd,
            apy,
            earnings: 0, // Would need historical tracking
          });
        }
      } catch (err) {
        this.logger.warn(`Failed to fetch Venus position for ${symbol}`, err);
      }
    }

    // Generate simple chart data (last 7 days, flat for now)
    const chartData: ChartDataPoint[] = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      chartData.push({
        date: date.toISOString().split('T')[0],
        value: totalValueUsd,
      });
    }

    return {
      totalValueUsd,
      change24h: 0,
      change24hPercent: 0,
      tokens,
      positions,
      chartData,
    };
  }
}
