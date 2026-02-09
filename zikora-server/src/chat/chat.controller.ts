import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(ThrottlerGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string; walletAddress?: string }) {
    return this.chatService.handleMessage(body.message, body.walletAddress);
  }
}
