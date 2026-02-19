export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* Radial orange glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,107,44,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[640px] flex-col items-center text-center">
        <h2
          className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl"
          style={{ fontStretch: "normal", fontWeight: 700 }}
        >
          Why click when you can chat?
        </h2>

        <a
          href="https://zikora-app.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center rounded-xl bg-[#FF6B2C] px-9 py-4 font-heading text-base font-semibold text-[#12121A] transition-all duration-200 hover:bg-[#FF8F5C] hover:shadow-[0_0_24px_rgba(255,107,44,0.35)] active:scale-[0.98]"
        >
          Launch App
        </a>

        <p className="mt-5 text-sm text-muted-foreground">
          Just connect your wallet and start chatting.
        </p>
      </div>
    </section>
  )
}
