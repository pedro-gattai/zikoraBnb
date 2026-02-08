import { cn } from '@/lib/utils'
import { type ChatMessage as ChatMessageType, type TxAction } from '@/types'
import { AgentBadge } from '@/components/shared/agent-badge'
import { ChatReasoning } from './chat-reasoning'
import { ChatTxResult } from './chat-tx-result'
import { ChatTxAction } from './chat-tx-action'
import { AntIcon } from '@/components/zikora-logo'

interface ChatMessageProps {
  message: ChatMessageType
  onSignTxAction?: (messageId: string, txAction: TxAction) => void
}

export function ChatMessage({ message, onSignTxAction }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : isSystem
              ? 'bg-destructive/20 text-destructive'
              : 'bg-secondary',
        )}
      >
        {isUser ? (
          <span className="text-xs font-bold">U</span>
        ) : (
          <AntIcon className="w-4 h-auto" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex max-w-[80%] flex-col',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        {message.agent && !isUser && (
          <div className="mb-1">
            <AgentBadge agent={message.agent} />
          </div>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-md'
              : isSystem
                ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-md'
                : 'bg-secondary text-foreground rounded-tl-md',
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {message.txAction && (
          <ChatTxAction
            txAction={message.txAction}
            txStatus={message.txStatus}
            txHash={message.txHash}
            txError={message.txError}
            onSign={() => onSignTxAction?.(message.id, message.txAction!)}
          />
        )}
        {message.txResult && <ChatTxResult result={message.txResult} />}
        {message.reasoning && <ChatReasoning reasoning={message.reasoning} />}

        <span className="mt-1 text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}
