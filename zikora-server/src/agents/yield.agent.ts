import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { BlockchainService } from '../blockchain/blockchain.service';
import { MarketDataService } from '../market-data/market-data.service';
import { LlmService, ClassifiedIntent } from '../llm/llm.service';
import { TxAction, TxStep } from '../store/store.service';
import { resolveToken, TOKENS } from '../config/tokens';
import { AgentResponse } from './router.agent';

@Injectable()
export class YieldAgent {
  private readonly logger = new Logger(YieldAgent.name);

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
    const action = intent.params.action?.toLowerCase();

    if (
      !action ||
      action === 'info' ||
      action === 'check' ||
      /apy|yield|rate|earn/.test(message.toLowerCase())
    ) {
      return this.handleYieldInfo(message);
    }

    if (action === 'supply' || action === 'lend' || action === 'deposit') {
      return this.handleSupply(message, intent, wallet);
    }

    if (action === 'redeem' || action === 'withdraw') {
      return this.handleRedeem(message, intent, wallet);
    }

    return this.handleYieldInfo(message);
  }

  private async handleYieldInfo(message: string): Promise<AgentResponse> {
    const yields: string[] = [];
    for (const [symbol, token] of Object.entries(TOKENS)) {
      if (token.vToken) {
        const apy = await this.marketData.getVenusAPY(token.vToken);
        yields.push(`${symbol}: ${apy.toFixed(2)}% APY`);
      }
    }

    const context = `Current Venus Protocol supply APYs on BSC:\n${yields.join('\n')}`;

    const content = await this.llm.generateResponse(
      `You are Zikora's Yield Agent. Provide helpful information about Venus Protocol yields. Include the current APYs in your response. Be concise.`,
      message,
      context,
    );

    return {
      role: 'assistant',
      content,
      agent: 'yield',
      reasoning: `Fetched Venus APYs: ${yields.join(', ')}`,
    };
  }

  private async handleSupply(
    message: string,
    intent: ClassifiedIntent,
    wallet: string,
  ): Promise<AgentResponse> {
    const tokenSymbol = (
      intent.params.fromToken ||
      intent.params.token ||
      'USDT'
    ).toUpperCase();
    const amount = intent.params.amount;

    if (!amount) {
      return {
        role: 'assistant',
        content: `How much ${tokenSymbol} would you like to supply to Venus? For example: "supply 100 USDT to Venus"`,
        agent: 'yield',
      };
    }

    const token = resolveToken(tokenSymbol);
    if (!token || !token.vToken) {
      return {
        role: 'assistant',
        content: `${tokenSymbol} is not supported for Venus lending. Supported tokens: ${Object.entries(TOKENS).filter(([, t]) => t.vToken).map(([s]) => s).join(', ')}`,
        agent: 'yield',
      };
    }

    try {
      const amountWei = ethers.parseUnits(amount, token.decimals);

      // Check user wallet balance
      const balance = await this.marketData.getTokenBalance(
        token.address,
        wallet,
      );
      if (amountWei > balance) {
        const formatted = ethers.formatUnits(balance, token.decimals);
        return {
          role: 'assistant',
          content: `Insufficient ${tokenSymbol} balance. You have ${formatted} ${tokenSymbol}.`,
          agent: 'yield',
          reasoning: `Balance ${formatted} < requested ${amount}`,
        };
      }

      const apy = await this.marketData.getVenusAPY(token.vToken);

      // Build TxAction steps
      const steps: TxStep[] = [];

      // Step 1: Approve vToken to spend user's tokens
      const allowance = await this.blockchain.getAllowance(
        token.address,
        wallet,
        token.vToken,
      );
      if (allowance < amountWei) {
        steps.push({
          to: token.address,
          data: this.blockchain.encodeApprove(token.vToken, amountWei),
          value: '0',
          description: `Approve ${amount} ${tokenSymbol} for Venus Protocol`,
        });
      }

      // Step 2: Mint vTokens (supply)
      steps.push({
        to: token.vToken,
        data: this.blockchain.encodeVenusMint(amountWei),
        value: '0',
        description: `Supply ${amount} ${tokenSymbol} to Venus (${apy.toFixed(2)}% APY)`,
      });

      const reasoning = `Supplying ${amount} ${tokenSymbol} to Venus Protocol.\nCurrent APY: ${apy.toFixed(2)}%\nWallet balance sufficient. Transaction prepared for signing.`;

      const txAction: TxAction = {
        type: 'supply',
        summary: `Supply ${amount} ${tokenSymbol} to Venus (${apy.toFixed(2)}% APY)`,
        steps,
        details: {
          fromToken: tokenSymbol,
          fromAmount: amount,
          protocol: 'Venus Protocol',
        },
      };

      return {
        role: 'assistant',
        content: `Ready to supply **${amount} ${tokenSymbol}** to Venus Protocol at **${apy.toFixed(2)}% APY**.\n\nPlease sign the transaction to proceed.`,
        agent: 'yield',
        reasoning,
        txAction,
      };
    } catch (err) {
      this.logger.error('Venus supply preparation failed', err);
      return {
        role: 'assistant',
        content: `Failed to prepare Venus supply of ${amount} ${tokenSymbol}: ${err.reason || err.message}`,
        agent: 'yield',
        reasoning: `Supply preparation failed: ${err.message}`,
      };
    }
  }

  private async handleRedeem(
    message: string,
    intent: ClassifiedIntent,
    wallet: string,
  ): Promise<AgentResponse> {
    const tokenSymbol = (
      intent.params.fromToken ||
      intent.params.token ||
      'USDT'
    ).toUpperCase();
    const amount = intent.params.amount;

    if (!amount) {
      return {
        role: 'assistant',
        content: `How much ${tokenSymbol} would you like to redeem from Venus? For example: "redeem 50 USDT from Venus"`,
        agent: 'yield',
      };
    }

    const token = resolveToken(tokenSymbol);
    if (!token || !token.vToken) {
      return {
        role: 'assistant',
        content: `${tokenSymbol} is not supported for Venus redemption.`,
        agent: 'yield',
      };
    }

    try {
      const amountWei = ethers.parseUnits(amount, token.decimals);

      // Check Venus position
      const { underlyingBalance } = await this.marketData.getVenusBalance(
        token.vToken,
        wallet,
      );

      if (amountWei > underlyingBalance) {
        const formatted = ethers.formatUnits(underlyingBalance, token.decimals);
        return {
          role: 'assistant',
          content: `Insufficient Venus position. Supplied: ${formatted} ${tokenSymbol}, Requested: ${amount} ${tokenSymbol}`,
          agent: 'yield',
          reasoning: `Venus position (${formatted}) < requested redeem (${amount})`,
        };
      }

      const reasoning = `Redeeming ${amount} ${tokenSymbol} from Venus Protocol.\nCurrent position: ${ethers.formatUnits(underlyingBalance, token.decimals)} ${tokenSymbol}\nTransaction prepared for signing.`;

      // Build TxAction — redeem doesn't need approval
      const steps: TxStep[] = [
        {
          to: token.vToken,
          data: this.blockchain.encodeVenusRedeemUnderlying(amountWei),
          value: '0',
          description: `Redeem ${amount} ${tokenSymbol} from Venus`,
        },
      ];

      const txAction: TxAction = {
        type: 'redeem',
        summary: `Redeem ${amount} ${tokenSymbol} from Venus`,
        steps,
        details: {
          toToken: tokenSymbol,
          toAmount: amount,
          protocol: 'Venus Protocol',
        },
      };

      return {
        role: 'assistant',
        content: `Ready to redeem **${amount} ${tokenSymbol}** from Venus Protocol.\n\nPlease sign the transaction to proceed.`,
        agent: 'yield',
        reasoning,
        txAction,
      };
    } catch (err) {
      this.logger.error('Venus redeem preparation failed', err);
      return {
        role: 'assistant',
        content: `Failed to prepare Venus redeem of ${amount} ${tokenSymbol}: ${err.reason || err.message}`,
        agent: 'yield',
        reasoning: `Redeem preparation failed: ${err.message}`,
      };
    }
  }
}
