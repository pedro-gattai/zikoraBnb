import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainModule } from './blockchain/blockchain.module';
import { MarketDataModule } from './market-data/market-data.module';
import { LlmModule } from './llm/llm.module';
import { AgentsModule } from './agents/agents.module';
import { StoreModule } from './store/store.module';
import { ChatModule } from './chat/chat.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StoreModule,
    BlockchainModule,
    MarketDataModule,
    LlmModule,
    AgentsModule,
    ChatModule,
    PortfolioModule,
    TransactionsModule,
  ],
})
export class AppModule {}
