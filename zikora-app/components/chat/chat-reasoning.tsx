'use client'

import { useState } from 'react'
import { ChevronDown, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatReasoning({ reasoning }: { reasoning: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2 rounded-lg border border-border bg-secondary/30">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Brain className="h-3.5 w-3.5" />
        <span className="font-medium">Agent Reasoning</span>
        <ChevronDown
          className={cn(
            'ml-auto h-3.5 w-3.5 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {reasoning}
          </p>
        </div>
      )}
    </div>
  )
}
