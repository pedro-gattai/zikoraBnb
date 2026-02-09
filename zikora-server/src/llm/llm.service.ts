import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';

export interface ClassifiedIntent {
  agent: 'trading' | 'yield' | 'analytics' | 'general';
  intent: string;
  params: Record<string, string>;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private model: GenerativeModel | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    } else {
      this.logger.warn('GEMINI_API_KEY not set — LLM will use fallback');
    }
  }

  async classifyIntent(message: string): Promise<ClassifiedIntent> {
    if (!this.model) return this.fallbackClassify(message);

    try {
      const result = await this.model.generateContent({
        systemInstruction: `You are the Zikora router. Classify the user's DeFi intent into JSON.
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
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 256 },
      });

      const text = result.response.text();
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
    if (!this.model) {
      return 'I understand your request. Let me process that for you.';
    }

    try {
      const contents: Content[] = [];
      if (context) {
        contents.push({ role: 'user', parts: [{ text: context }] });
        contents.push({
          role: 'model',
          parts: [{ text: 'I have the context. What would you like to know?' }],
        });
      }
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const result = await this.model.generateContent({
        systemInstruction: systemPrompt,
        contents,
        generationConfig: { maxOutputTokens: 1024 },
      });

      return result.response.text();
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
