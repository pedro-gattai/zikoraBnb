import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { MarketDataService } from '../market-data/market-data.service';
import { LlmService, ClassifiedIntent } from '../llm/llm.service';
import { TOKENS } from '../config/tokens';
import { AgentResponse } from './router.agent';

@Injectable()
export class AnalyticsAgent {
  private readonly logger = new Logger(AnalyticsAgent.name);

  constructor(
    private marketData: MarketDataService,
    private llm: LlmService,
  ) {}

  async handle(
    message: string,
    intent: ClassifiedIntent,
    wallet: string,
  ): Promise<AgentResponse> {
    if (!wallet || wallet === 'anonymous') {
      return {
        role: 'assistant',
        content:
          'Please connect your wallet so I can analyze your portfolio.',
        agent: 'analytics',
      };
    }

    try {
      const summary = await this.buildPortfolioSummary(wallet);

      const content = await this.llm.generateResponse(
        `You are Zikora's Analytics Agent. Analyze the user's DeFi portfolio and provide insights. Be concise and data-driven. Include specific numbers. If they ask for recommendations, suggest concrete actions based on the data.`,
        message,
        `Portfolio summary for wallet ${wallet}:\n${summary}`,
      );

      return {
        role: 'assistant',
        content,
        agent: 'analytics',
        reasoning: `Portfolio analysis:\n${summary}`,
      };
    } catch (err) {
      this.logger.error('Analytics failed', err);
      return {
        role: 'assistant',
        content: `I had trouble fetching portfolio data: ${err.message}`,
        agent: 'analytics',
      };
    }
  }

  async buildPortfolioSummary(walletAddress: string): Promise<string> {
    const lines: string[] = [];
    let totalUsd = 0;

    for (const [symbol, token] of Object.entries(TOKENS)) {
      if (symbol === 'WBNB') continue;

      let balance: bigint;
      if (symbol === 'BNB') {
        balance = await this.marketData.getBNBBalance(walletAddress);
      } else {
        balance = await this.marketData.getTokenBalance(
          token.address,
          walletAddress,
        );
      }

      if (balance > 0n) {
        const formatted = ethers.formatUnits(balance, token.decimals);
        const price = await this.marketData.getTokenPriceUsd(token.address);
        const valueUsd = Number(formatted) * price;
        totalUsd += valueUsd;
        lines.push(
          `${symbol}: ${Number(formatted).toFixed(4)} ($${valueUsd.toFixed(2)}) @ $${price.toFixed(2)}`,
        );
      }
    }

    for (const [symbol, token] of Object.entries(TOKENS)) {
      if (!token.vToken) continue;
      const { underlyingBalance } = await this.marketData.getVenusBalance(
        token.vToken,
        walletAddress,
      );
      if (underlyingBalance > 0n) {
        const formatted = ethers.formatUnits(underlyingBalance, token.decimals);
        const price = await this.marketData.getTokenPriceUsd(token.address);
        const valueUsd = Number(formatted) * price;
        const apy = await this.marketData.getVenusAPY(token.vToken);
        totalUsd += valueUsd;
        lines.push(
          `Venus v${symbol}: ${Number(formatted).toFixed(4)} ($${valueUsd.toFixed(2)}) — ${apy.toFixed(2)}% APY`,
        );
      }
    }

    lines.unshift(`Total portfolio value: $${totalUsd.toFixed(2)}`);
    return lines.join('\n');
  }
}
