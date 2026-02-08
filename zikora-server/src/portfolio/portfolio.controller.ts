import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  async getPortfolio(@Query('address') address: string) {
    return this.portfolioService.getPortfolio(address);
  }
}
