import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { ADDRESSES, ChainAddresses } from '../config/addresses';
import ERC20Abi from '../abis/ERC20.json';
import PancakeV3QuoterAbi from '../abis/PancakeV3Quoter.json';
import PancakeV3RouterAbi from '../abis/PancakeV3Router.json';
import VTokenAbi from '../abis/VToken.json';
import VenusComptrollerAbi from '../abis/VenusComptroller.json';
import ZikoraRouterAbi from '../abis/ZikoraRouter.json';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  provider: ethers.JsonRpcProvider;
  addresses: ChainAddresses;
  chainId: number;

  private routerIface: ethers.Interface;
  private erc20Iface: ethers.Interface;
  private vTokenIface: ethers.Interface;
  private zikoraRouterIface: ethers.Interface;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const rpcUrl =
      this.config.get<string>('BSC_RPC_URL') ||
      'https://data-seed-prebsc-1-s1.bnbchain.org:8545';
    this.chainId = Number(this.config.get<string>('CHAIN_ID') || '97');
    this.addresses = ADDRESSES[this.chainId] || ADDRESSES[97];

    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    this.routerIface = new ethers.Interface(PancakeV3RouterAbi);
    this.erc20Iface = new ethers.Interface(ERC20Abi);
    this.vTokenIface = new ethers.Interface(VTokenAbi);
    this.zikoraRouterIface = new ethers.Interface(ZikoraRouterAbi);

    this.logger.log(`Connected to chain ${this.chainId} via ${rpcUrl} (read-only)`);
  }

  getERC20(tokenAddress: string): ethers.Contract {
    return new ethers.Contract(tokenAddress, ERC20Abi, this.provider);
  }

  getQuoter(): ethers.Contract {
    return new ethers.Contract(
      this.addresses.pancakeQuoter,
      PancakeV3QuoterAbi,
      this.provider,
    );
  }

  getVToken(vTokenAddress: string): ethers.Contract {
    return new ethers.Contract(vTokenAddress, VTokenAbi, this.provider);
  }

  getComptroller(): ethers.Contract {
    return new ethers.Contract(
      this.addresses.venusComptroller,
      VenusComptrollerAbi,
      this.provider,
    );
  }

  // --- Encoding helpers (return calldata for frontend signing) ---

  encodeApprove(spender: string, amount: bigint): string {
    return this.erc20Iface.encodeFunctionData('approve', [spender, amount]);
  }

  async getAllowance(
    tokenAddress: string,
    owner: string,
    spender: string,
  ): Promise<bigint> {
    const erc20 = this.getERC20(tokenAddress);
    return erc20.allowance(owner, spender);
  }

  encodeSwap(params: {
    tokenIn: string;
    tokenOut: string;
    fee: number;
    recipient: string;
    amountIn: bigint;
    amountOutMinimum: bigint;
  }): string {
    const deadline = Math.floor(Date.now() / 1000) + 1800; // 30 min
    return this.routerIface.encodeFunctionData('exactInputSingle', [
      {
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        fee: params.fee,
        recipient: params.recipient,
        deadline,
        amountIn: params.amountIn,
        amountOutMinimum: params.amountOutMinimum,
        sqrtPriceLimitX96: 0,
      },
    ]);
  }

  encodeVenusMint(amount: bigint): string {
    return this.vTokenIface.encodeFunctionData('mint', [amount]);
  }

  encodeVenusRedeemUnderlying(amount: bigint): string {
    return this.vTokenIface.encodeFunctionData('redeemUnderlying', [amount]);
  }

  // --- ZikoraRouter encoding helpers ---

  encodeZikoraSwap(params: {
    tokenIn: string;
    tokenOut: string;
    poolFee: number;
    amountIn: bigint;
    amountOutMin: bigint;
  }): string {
    return this.zikoraRouterIface.encodeFunctionData('swapExactInput', [
      params.tokenIn,
      params.tokenOut,
      params.poolFee,
      params.amountIn,
      params.amountOutMin,
    ]);
  }

  encodeZikoraSwapBNB(params: {
    tokenOut: string;
    poolFee: number;
    amountOutMin: bigint;
  }): string {
    return this.zikoraRouterIface.encodeFunctionData('swapExactInputBNB', [
      params.tokenOut,
      params.poolFee,
      params.amountOutMin,
    ]);
  }

  encodeZikoraSupply(
    vToken: string,
    underlying: string,
    amount: bigint,
  ): string {
    return this.zikoraRouterIface.encodeFunctionData('supplyToVenus', [
      vToken,
      underlying,
      amount,
    ]);
  }

  encodeZikoraRedeem(
    vToken: string,
    underlying: string,
    redeemAmount: bigint,
    vTokenAmount: bigint,
  ): string {
    return this.zikoraRouterIface.encodeFunctionData('redeemFromVenus', [
      vToken,
      underlying,
      redeemAmount,
      vTokenAmount,
    ]);
  }
}
