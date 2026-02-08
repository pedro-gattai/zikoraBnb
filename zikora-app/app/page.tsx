'use client'

import { AppShell } from '@/components/layout/app-shell'
import { ChatContainer } from '@/components/chat/chat-container'

export default function ChatPage() {
  return (
    <AppShell>
      <ChatContainer />
    </AppShell>
  )
}
