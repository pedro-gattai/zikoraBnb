import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { TradingAgent } from './trading.agent';
import { YieldAgent } from './yield.agent';
import { AnalyticsAgent } from './analytics.agent';
import { StoreService, AgentType, ChatMessage, TxResult, TxAction } from '../store/store.service';

export interface AgentResponse {
  role: 'assistant';
  content: string;
  agent: AgentType;
  reasoning?: string;
  txResult?: TxResult;
  txAction?: TxAction;
}

@Injectable()
export class RouterAgent {
  private readonly logger = new Logger(RouterAgent.name);

  constructor(
    private llm: LlmService,
    private tradingAgent: TradingAgent,
    private yieldAgent: YieldAgent,
    private analyticsAgent: AnalyticsAgent,
    private store: StoreService,
  ) {}

  async handleMessage(
    message: string,
    walletAddress?: string,
  ): Promise<AgentResponse> {
    const wallet = walletAddress || 'anonymous';

    // Store user message
    this.store.addChatMessage(wallet, {
      id: this.genId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Classify intent
    const intent = await this.llm.classifyIntent(message);
    this.logger.log(
      `Classified: agent=${intent.agent}, intent=${intent.intent}`,
    );

    // Require wallet for trading and yield operations
    if (
      (intent.agent === 'trading' || intent.agent === 'yield') &&
      (!walletAddress || walletAddress === 'anonymous')
    ) {
      const response: AgentResponse = {
        role: 'assistant',
        content:
          'Please connect your wallet first. I need your wallet address to prepare transactions for you to sign.',
        agent: 'router',
      };
      this.store.addChatMessage(wallet, {
        id: this.genId(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        agent: response.agent,
      });
      return response;
    }

    let response: AgentResponse;

    try {
      switch (intent.agent) {
        case 'trading':
          response = await this.tradingAgent.handle(message, intent, wallet);
          break;
        case 'yield':
          response = await this.yieldAgent.handle(message, intent, wallet);
          break;
        case 'analytics':
          response = await this.analyticsAgent.handle(message, intent, wallet);
          break;
        default:
          response = await this.handleGeneral(message);
          break;
      }
    } catch (err) {
      this.logger.error(`Agent ${intent.agent} failed`, err);
      response = {
        role: 'assistant',
        content: `I encountered an error processing your request: ${err.message}. Please try again.`,
        agent: 'router',
      };
    }

    // Store assistant message
    this.store.addChatMessage(wallet, {
      id: this.genId(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      agent: response.agent,
      reasoning: response.reasoning,
      txResult: response.txResult,
      txAction: response.txAction,
    });

    return response;
  }

  private async handleGeneral(message: string): Promise<AgentResponse> {
    const content = await this.llm.generateResponse(
      `You are Zikora, a friendly DeFAI assistant on BNB Chain. You help users with token swaps (PancakeSwap V3), lending/earning yield (Venus Protocol), and portfolio analytics. Keep responses concise and helpful. If the user asks about something you can help with, guide them on how to phrase their request.`,
      message,
    );
    return { role: 'assistant', content, agent: 'router' };
  }

  private genId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
}
