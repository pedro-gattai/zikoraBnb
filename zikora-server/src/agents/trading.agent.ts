import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { BlockchainService } from '../blockchain/blockchain.service';
import { MarketDataService } from '../market-data/market-data.service';
import { LlmService, ClassifiedIntent } from '../llm/llm.service';
import { TxAction, TxStep } from '../store/store.service';
import { resolveToken } from '../config/tokens';
import { AgentResponse } from './router.agent';

const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const DEFAULT_SLIPPAGE_BPS = 100; // 1%

@Injectable()
export class TradingAgent {
  private readonly logger = new Logger(TradingAgent.name);

  constructor(
    private blockchain: BlockchainService,
    private marketData: MarketDataService,
    private llm: LlmService,
  ) {}

  async handle(
    message: string,
    intent: ClassifiedIntent,
    wallet: string,
  ): Promise<AgentResponse> {
    const { params } = intent;
    const fromSymbol = params.fromToken?.toUpperCase();
    const toSymbol = params.toToken?.toUpperCase();
    const amount = params.amount;

    if (!fromSymbol || !toSymbol || !amount) {
      const content = await this.llm.generateResponse(
        `You are Zikora's Trading Agent. The user wants to do a swap but didn't provide all required details. Ask them to specify: the token to sell, the token to buy, and the amount. Be friendly and give an example like "swap 10 USDT for BNB".`,
        message,
      );
      return { role: 'assistant', content, agent: 'trading' };
    }

    const fromToken = resolveToken(fromSymbol);
    const toToken = resolveToken(toSymbol);

    if (!fromToken || !toToken) {
      return {
        role: 'assistant',
        content: `I couldn't resolve one of the tokens. Currently supported tokens: BNB, WBNB, USDT, USDC. You asked to swap ${fromSymbol} → ${toSymbol}.`,
        agent: 'trading',
      };
    }

    const amountIn = ethers.parseUnits(amount, fromToken.decimals);
    const isBNBIn = fromSymbol === 'BNB';
    const routerAddress = this.blockchain.addresses.pancakeRouter;

    try {
      // Check user's wallet balance
      let balance: bigint;
      if (isBNBIn) {
        balance = await this.marketData.getBNBBalance(wallet);
      } else {
        balance = await this.marketData.getTokenBalance(
          fromToken.address,
          wallet,
        );
      }

      if (amountIn > balance) {
        const formatted = ethers.formatUnits(balance, fromToken.decimals);
        return {
          role: 'assistant',
          content: `Insufficient ${fromSymbol} balance. You have ${formatted} ${fromSymbol} but requested ${amount} ${fromSymbol}.`,
          agent: 'trading',
          reasoning: `Balance check failed: wallet has ${formatted}, requested ${amount}`,
        };
      }

      // Get quote
      const tokenInAddr = isBNBIn ? WBNB : fromToken.address;
      const tokenOutAddr =
        toSymbol === 'BNB' ? WBNB : toToken.address;

      const quoteOut = await this.marketData.getQuote(
        tokenInAddr,
        tokenOutAddr,
        amountIn,
      );

      if (quoteOut === 0n) {
        return {
          role: 'assistant',
          content: `I couldn't get a price quote for ${fromSymbol} → ${toSymbol}. The pool might not exist or have insufficient liquidity.`,
          agent: 'trading',
          reasoning: 'QuoterV2 returned 0 — no valid pool found',
        };
      }

      const amountOutMin =
        quoteOut - (quoteOut * BigInt(DEFAULT_SLIPPAGE_BPS)) / 10000n;
      const expectedOut = ethers.formatUnits(quoteOut, toToken.decimals);
      const minOut = ethers.formatUnits(amountOutMin, toToken.decimals);

      // Build TxAction steps
      const steps: TxStep[] = [];

      // Step 1: Approve (if not BNB native and allowance insufficient)
      if (!isBNBIn) {
        const allowance = await this.blockchain.getAllowance(
          fromToken.address,
          wallet,
          routerAddress,
        );
        if (allowance < amountIn) {
          steps.push({
            to: fromToken.address,
            data: this.blockchain.encodeApprove(routerAddress, amountIn),
            value: '0',
            description: `Approve ${amount} ${fromSymbol} for PancakeSwap Router`,
          });
        }
      }

      // Step 2: Swap
      const swapData = this.blockchain.encodeSwap({
        tokenIn: tokenInAddr,
        tokenOut: tokenOutAddr,
        fee: 2500,
        recipient: wallet,
        amountIn,
        amountOutMinimum: amountOutMin,
      });

      steps.push({
        to: routerAddress,
        data: swapData,
        value: isBNBIn ? amountIn.toString() : '0',
        description: `Swap ${amount} ${fromSymbol} for ~${Number(expectedOut).toFixed(4)} ${toSymbol}`,
      });

      const reasoning = `Swap ${amount} ${fromSymbol} → ${toSymbol} via PancakeSwap V3.\nExpected output: ${expectedOut} ${toSymbol}\nMinimum output (${DEFAULT_SLIPPAGE_BPS / 100}% slippage): ${minOut} ${toSymbol}\nWallet balance sufficient. Transaction prepared for signing.`;

      const txAction: TxAction = {
        type: 'swap',
        summary: `Swap ${amount} ${fromSymbol} for ~${Number(expectedOut).toFixed(4)} ${toSymbol}`,
        steps,
        details: {
          fromToken: fromSymbol,
          toToken: toSymbol,
          fromAmount: amount,
          toAmount: Number(expectedOut).toFixed(4),
          protocol: 'PancakeSwap V3',
          slippageBps: DEFAULT_SLIPPAGE_BPS,
        },
      };

      return {
        role: 'assistant',
        content: `Ready to swap **${amount} ${fromSymbol}** for ~**${Number(expectedOut).toFixed(4)} ${toSymbol}** via PancakeSwap V3.\n\nMinimum output: ${minOut} ${toSymbol} (${DEFAULT_SLIPPAGE_BPS / 100}% max slippage)\n\nPlease sign the transaction to proceed.`,
        agent: 'trading',
        reasoning,
        txAction,
      };
    } catch (err) {
      this.logger.error('Swap preparation failed', err);
      const errorMsg = err.reason || err.message || 'Unknown error';
      return {
        role: 'assistant',
        content: `Failed to prepare swap of ${amount} ${fromSymbol} → ${toSymbol}: ${errorMsg}`,
        agent: 'trading',
        reasoning: `Swap preparation failed: ${errorMsg}`,
      };
    }
  }
}
