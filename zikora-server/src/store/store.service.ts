import { Injectable } from '@nestjs/common';

export type AgentType = 'router' | 'trading' | 'yield' | 'analytics';

export interface TxStep {
  to: string;
  data: string;
  value: string;
  description: string;
}

export interface TxAction {
  type: 'swap' | 'supply' | 'redeem';
  summary: string;
  steps: TxStep[];
  details: {
    fromToken?: string;
    toToken?: string;
    fromAmount?: string;
    toAmount?: string;
    protocol?: string;
    slippageBps?: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: AgentType;
  reasoning?: string;
  txResult?: TxResult;
  txAction?: TxAction;
}

export interface TxResult {
  hash: string;
  status: 'success' | 'failed' | 'pending';
  type: 'swap' | 'supply' | 'redeem' | 'approve';
  summary: string;
  details: {
    fromToken?: string;
    toToken?: string;
    fromAmount?: string;
    toAmount?: string;
    protocol?: string;
  };
}

export interface Transaction {
  id: string;
  hash: string;
  type: 'swap' | 'supply' | 'redeem' | 'approve' | 'deposit' | 'withdraw';
  status: 'success' | 'failed' | 'pending';
  agent: AgentType;
  timestamp: Date;
  summary: string;
  details: {
    fromToken?: string;
    toToken?: string;
    fromAmount?: string;
    toAmount?: string;
    protocol?: string;
  };
  gasUsed?: string;
  gasCostUsd?: number;
}

@Injectable()
export class StoreService {
  private transactions = new Map<string, Transaction[]>();
  private chatHistory = new Map<string, ChatMessage[]>();

  addTransaction(wallet: string, tx: Transaction): void {
    const key = wallet.toLowerCase();
    if (!this.transactions.has(key)) this.transactions.set(key, []);
    this.transactions.get(key).unshift(tx);
  }

  getTransactions(wallet: string): Transaction[] {
    return this.transactions.get(wallet.toLowerCase()) || [];
  }

  addChatMessage(wallet: string, msg: ChatMessage): void {
    const key = wallet.toLowerCase();
    if (!this.chatHistory.has(key)) this.chatHistory.set(key, []);
    this.chatHistory.get(key).push(msg);
  }

  getChatHistory(wallet: string): ChatMessage[] {
    return this.chatHistory.get(wallet.toLowerCase()) || [];
  }
}
