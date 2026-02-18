import { type ChatMessage } from '@/types'
import { apiFetch } from './api'

export async function sendMessage(
  message: string,
  _walletAddress?: string,
): Promise<Omit<ChatMessage, 'id' | 'timestamp'>> {
  return apiFetch<Omit<ChatMessage, 'id' | 'timestamp'>>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, walletAddress: _walletAddress }),
  })
}
