import { Injectable } from '@nestjs/common';
import { RouterAgent } from '../agents/router.agent';

@Injectable()
export class ChatService {
  constructor(private router: RouterAgent) {}

  async handleMessage(message: string, walletAddress?: string) {
    return this.router.handleMessage(message, walletAddress);
  }
}
