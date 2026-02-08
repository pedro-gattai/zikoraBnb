import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module';
import { RouterAgent } from './router.agent';
import { TradingAgent } from './trading.agent';
import { YieldAgent } from './yield.agent';
import { AnalyticsAgent } from './analytics.agent';

@Module({
  imports: [MarketDataModule],
  providers: [RouterAgent, TradingAgent, YieldAgent, AnalyticsAgent],
  exports: [RouterAgent],
})
export class AgentsModule {}
