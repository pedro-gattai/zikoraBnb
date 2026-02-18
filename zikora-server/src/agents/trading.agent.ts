import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { BlockchainService } from '../blockchain/blockchain.service';
import { MarketDataService } from '../market-data/market-data.service';
import { LlmService, ClassifiedIntent } from '../llm/llm.service';
import { TxAction, TxStep } from '../store/store.service';
import { resolveToken } from '../config/tokens';
import { AgentResponse } from './router.agent';
const DEFAULT_SLIPPAGE_BPS = 100; // 1%
const ZIKORA_FEE_BPS = 10; // 0.10% protocol fee

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

    const fromToken = resolveToken(fromSymbol, this.blockchain.chainId);
    const toToken = resolveToken(toSymbol, this.blockchain.chainId);

    if (!fromToken || !toToken) {
      return {
        role: 'assistant',
        content: `I couldn't resolve one of the tokens. Currently supported tokens: BNB, WBNB, USDT, USDC. You asked to swap ${fromSymbol} → ${toSymbol}.`,
        agent: 'trading',
      };
    }

    const amountIn = ethers.parseUnits(amount, fromToken.decimals);
    const isBNBIn = fromSymbol === 'BNB';
    const zikoraRouter = this.blockchain.addresses.zikoraRouter;

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

      // Get quote — adjust for ZikoraRouter fee (0.10%)
      const wbnb = this.blockchain.addresses.WBNB;
      const tokenInAddr = isBNBIn ? wbnb : fromToken.address;
      const tokenOutAddr =
        toSymbol === 'BNB' ? wbnb : toToken.address;

      const netAmountIn = (amountIn * 9990n) / 10000n; // amount after 0.10% fee
      const quoteOut = await this.marketData.getQuote(
        tokenInAddr,
        tokenOutAddr,
        netAmountIn,
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
      const feeAmount = ethers.formatUnits(amountIn - netAmountIn, fromToken.decimals);

      // Build TxAction steps
      const steps: TxStep[] = [];

      // Step 1: Approve ZikoraRouter (if not BNB native and allowance insufficient)
      if (!isBNBIn) {
        const allowance = await this.blockchain.getAllowance(
          fromToken.address,
          wallet,
          zikoraRouter,
        );
        if (allowance < amountIn) {
          steps.push({
            to: fromToken.address,
            data: this.blockchain.encodeApprove(zikoraRouter, amountIn),
            value: '0',
            description: `Approve ${amount} ${fromSymbol} for Zikora Router`,
          });
        }
      }

      // Step 2: Swap via ZikoraRouter
      if (isBNBIn) {
        const swapData = this.blockchain.encodeZikoraSwapBNB({
          tokenOut: tokenOutAddr,
          poolFee: 2500,
          amountOutMin: amountOutMin,
        });
        steps.push({
          to: zikoraRouter,
          data: swapData,
          value: amountIn.toString(),
          description: `Swap ${amount} ${fromSymbol} for ~${Number(expectedOut).toFixed(4)} ${toSymbol} via Zikora`,
        });
      } else {
        const swapData = this.blockchain.encodeZikoraSwap({
          tokenIn: tokenInAddr,
          tokenOut: tokenOutAddr,
          poolFee: 2500,
          amountIn,
          amountOutMin: amountOutMin,
        });
        steps.push({
          to: zikoraRouter,
          data: swapData,
          value: '0',
          description: `Swap ${amount} ${fromSymbol} for ~${Number(expectedOut).toFixed(4)} ${toSymbol} via Zikora`,
        });
      }

      const reasoning = `Swap ${amount} ${fromSymbol} → ${toSymbol} via Zikora Router (PancakeSwap V3).\nProtocol fee: 0.10% (${feeAmount} ${fromSymbol})\nExpected output: ${expectedOut} ${toSymbol}\nMinimum output (${DEFAULT_SLIPPAGE_BPS / 100}% slippage): ${minOut} ${toSymbol}\nWallet balance sufficient. Transaction prepared for signing.`;

      const txAction: TxAction = {
        type: 'swap',
        summary: `Swap ${amount} ${fromSymbol} for ~${Number(expectedOut).toFixed(4)} ${toSymbol}`,
        steps,
        details: {
          fromToken: fromSymbol,
          toToken: toSymbol,
          fromAmount: amount,
          toAmount: Number(expectedOut).toFixed(4),
          protocol: 'Zikora Router (PancakeSwap V3)',
          slippageBps: DEFAULT_SLIPPAGE_BPS,
        },
      };

      return {
        role: 'assistant',
        content: `Ready to swap **${amount} ${fromSymbol}** for ~**${Number(expectedOut).toFixed(4)} ${toSymbol}** via Zikora Router.\n\nProtocol fee: 0.10% (${feeAmount} ${fromSymbol})\nMinimum output: ${minOut} ${toSymbol} (${DEFAULT_SLIPPAGE_BPS / 100}% max slippage)\n\nPlease sign the transaction to proceed.`,
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
