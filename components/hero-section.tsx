import { ChatMock } from "@/components/chat-mock"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pb-32 md:pt-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">
        {/* Left text column */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
            DeFi at Your Command
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#A8A4B8] md:text-xl">
            Connect your wallet. Type what you want. Zikora executes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <a
              href="#"
              className="inline-flex items-center rounded-xl bg-[#FF6B2C] px-7 py-3 font-heading text-sm font-semibold text-[#12121A] transition-all duration-200 hover:bg-[#FF8F5C] hover:shadow-[0_0_24px_rgba(255,107,44,0.35)] active:scale-[0.98]"
            >
              Launch App
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-xl border border-border bg-transparent px-7 py-3 font-heading text-sm font-semibold text-foreground transition-all duration-200 hover:border-[#FF6B2C]/30 active:scale-[0.98]"
            >
              Read Docs
            </a>
          </div>
        </div>

        {/* Right: Chat mock */}
        <div className="flex flex-1 items-center justify-center">
          <ChatMock />
        </div>
      </div>
    </section>
  )
}
