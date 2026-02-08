"use client"

import { useEffect, useState } from "react"
import { AntIcon } from "@/components/zikora-logo"

interface Message {
  role: "user" | "bot"
  text: string
}

const messages: Message[] = [
  { role: "user", text: "Swap 0.5 BNB to USDT" },
  { role: "bot", text: "Swapping 0.5 BNB \u2192 152.30 USDT via PancakeSwap. Confirm?" },
  { role: "user", text: "Yes" },
  { role: "bot", text: "\u2705 Done! Tx: 0x7f3a...e21b" },
]

export function ChatMock() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount < messages.length) {
      const timer = setTimeout(() => {
        setVisibleCount((c) => c + 1)
      }, 700 + visibleCount * 200)
      return () => clearTimeout(timer)
    }
  }, [visibleCount])

  return (
    <div className="relative w-full max-w-[420px]">
      {/* Radial glow behind the mock */}
      <div
        className="pointer-events-none absolute inset-0 -m-10 rounded-full opacity-60"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,44,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl">
        {/* Chat window header */}
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
          <AntIcon className="w-4 h-auto" />
          <span className="font-heading text-xs font-bold tracking-widest text-foreground">
            ZIKORA
          </span>
          <span className="ml-auto flex h-2 w-2 rounded-full bg-[#00E676]" />
          <span className="font-mono text-[10px] text-muted-foreground">Online</span>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-3">
          {messages.slice(0, visibleCount).map((msg, i) => (
            <div
              key={`msg-${msg.role}-${i}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {msg.role === "bot" && (
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]/10">
                  <AntIcon className="w-3 h-auto" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-[#FF6B2C] text-[#12121A] font-medium"
                    : "rounded-2xl rounded-bl-sm border border-border bg-card text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input mock */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5">
          <span className="text-sm text-muted-foreground">{"Type a command..."}</span>
        </div>
      </div>
    </div>
  )
}
