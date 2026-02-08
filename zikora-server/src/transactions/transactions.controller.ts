import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  getTransactions(@Query('address') address: string) {
    return this.transactionsService.getTransactions(address);
  }

  @Post()
  reportTransaction(
    @Body()
    body: {
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
    },
  ) {
    return this.transactionsService.reportTransaction(body);
  }
}
