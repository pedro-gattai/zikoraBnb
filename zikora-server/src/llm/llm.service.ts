import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export interface ClassifiedIntent {
  agent: 'trading' | 'yield' | 'analytics' | 'general';
  intent: string;
  params: Record<string, string>;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private client: Anthropic | null = null;
  private readonly model = 'claude-haiku-4-5-20251001';

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    } else {
      this.logger.warn('ANTHROPIC_API_KEY not set — LLM will use fallback');
    }
  }

  async classifyIntent(message: string): Promise<ClassifiedIntent> {
    if (!this.client) return this.fallbackClassify(message);

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 256,
        system: `You are the Zikora router. Classify the user's DeFi intent into JSON.
Return ONLY valid JSON with this schema:
{
  "agent": "trading" | "yield" | "analytics" | "general",
  "intent": "<short description>",
  "params": { "fromToken": "...", "toToken": "...", "amount": "...", "protocol": "...", "action": "..." }
}

Rules:
- "trading": any swap/trade/buy/sell request (e.g., "swap 10 USDT for BNB")
- "yield": supply/lend/deposit into Venus, redeem/withdraw from Venus, or ask about APY/yields
- "analytics": portfolio questions, balance checks, PnL, recommendations
- "general": greetings, help, or anything that doesn't fit the above
- Include relevant params extracted from the message. Omit params that aren't mentioned.`,
        messages: [{ role: 'user', content: message }],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ClassifiedIntent;
      }
    } catch (err) {
      this.logger.error('classifyIntent failed', err);
    }

    return this.fallbackClassify(message);
  }

  async generateResponse(
    systemPrompt: string,
    userMessage: string,
    context?: string,
  ): Promise<string> {
    if (!this.client) {
      return 'I understand your request. Let me process that for you.';
    }

    try {
      const messages: Anthropic.MessageParam[] = [];
      if (context) {
        messages.push({ role: 'user', content: context });
        messages.push({
          role: 'assistant',
          content: 'I have the context. What would you like to know?',
        });
      }
      messages.push({ role: 'user', content: userMessage });

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });

      return response.content[0].type === 'text'
        ? response.content[0].text
        : 'I encountered an issue generating a response. Please try again.';
    } catch (err) {
      this.logger.error('generateResponse failed', err);
      return 'I encountered an issue generating a response. Please try again.';
    }
  }

  private fallbackClassify(message: string): ClassifiedIntent {
    const lower = message.toLowerCase();
    if (/swap|trade|buy|sell|exchange|convert/.test(lower)) {
      return { agent: 'trading', intent: 'swap', params: {} };
    }
    if (/supply|lend|deposit.*venus|redeem|apy|yield|earn/.test(lower)) {
      return { agent: 'yield', intent: 'yield_action', params: {} };
    }
    if (/portfolio|balance|holdings|pnl|performance|recommend/.test(lower)) {
      return { agent: 'analytics', intent: 'portfolio_query', params: {} };
    }
    return { agent: 'general', intent: 'general', params: {} };
  }
}
