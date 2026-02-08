import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';

@Injectable()
export class TransactionsService {
  constructor(private store: StoreService) {}

  getTransactions(address: string) {
    if (!address) return [];
    return this.store.getTransactions(address);
  }

  reportTransaction(body: {
    walletAddress: string;
    hash: string;
    type: 'swap' | 'supply' | 'redeem' | 'approve';
    status: 'success' | 'failed';
    summary: string;
    details?: {
      fromToken?: string;
      toToken?: string;
      fromAmount?: string;
      toAmount?: string;
      protocol?: string;
    };
    gasUsed?: string;
  }) {
    if (!body.walletAddress || !body.hash) {
      return { ok: false };
    }

    this.store.addTransaction(body.walletAddress, {
      id: body.hash.slice(0, 10) + Date.now().toString(36),
      hash: body.hash,
      type: body.type,
      status: body.status,
      agent: 'trading',
      timestamp: new Date(),
      summary: body.summary,
      details: body.details || {},
      gasUsed: body.gasUsed,
    });

    return { ok: true };
  }
}
