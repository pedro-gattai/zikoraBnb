"use client"

import { useRef } from "react"
import { Eye, ArrowLeftRight, Layers, Landmark } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const features = [
  {
    icon: Eye,
    title: "Portfolio at a Glance",
    description: "Check your balances, token prices, and P&L \u2014 just ask.",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap in Seconds",
    description: "Trade any BEP-20 token with a single message. Best routes via DEX aggregation.",
  },
  {
    icon: Layers,
    title: "Stake & Earn",
    description: "Stake your tokens directly from the chat. Track rewards in real time.",
  },
  {
    icon: Landmark,
    title: "Lend & Borrow",
    description: "Supply assets or take loans through DeFi protocols. All via conversation.",
  },
]

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.1 })

  return (
    <section ref={ref} id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="font-mono text-xs font-normal uppercase tracking-[0.25em] text-muted-foreground">
            Features
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">
            Everything you need. One chat.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6B2C]/30 hover:shadow-[0_0_30px_rgba(255,107,44,0.08)] ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: inView ? `${150 + i * 100}ms` : "0ms",
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A8A4B8]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
