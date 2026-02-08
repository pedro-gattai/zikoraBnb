import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string; walletAddress?: string }) {
    return this.chatService.handleMessage(body.message, body.walletAddress);
  }
}
