'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/use-chat'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatWelcome } from './chat-welcome'
import { LoadingDots } from '@/components/shared/loading-dots'
import { AntIcon } from '@/components/zikora-logo'

export function ChatContainer() {
  const { messages, isLoading, send, signTxAction } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <ChatWelcome onPromptClick={send} />
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSignTxAction={signTxAction}
              />
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-slide-up">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <AntIcon className="w-4 h-auto" />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-secondary px-4 py-3">
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSend={send} disabled={isLoading} />
    </div>
  )
}
