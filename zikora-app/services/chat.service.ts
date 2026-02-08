import { type ChatMessage } from '@/types'
import { isUsingMock, apiFetch } from './api'
import { getMockResponse } from '@/mocks/chat.mock'

export async function sendMessage(
  message: string,
  _walletAddress?: string,
): Promise<Omit<ChatMessage, 'id' | 'timestamp'>> {
  if (isUsingMock) {
    const mock = await getMockResponse(message)
    return {
      role: 'assistant',
      content: mock.content,
      agent: mock.agent,
      reasoning: mock.reasoning,
      txResult: mock.txResult,
      txAction: mock.txAction,
    }
  }

  return apiFetch<Omit<ChatMessage, 'id' | 'timestamp'>>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, walletAddress: _walletAddress }),
  })
}
