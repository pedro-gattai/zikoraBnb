"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"

const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description: "Link your Web3 wallet securely with one click.",
  },
  {
    number: "02",
    title: "Chat Your Command",
    description: "Type what you want in plain English. Zikora understands.",
  },
  {
    number: "03",
    title: "Zikora Executes",
    description: "Transactions are built, signed, and confirmed. Done.",
  },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.1 })

  return (
    <section ref={ref} id="how-it-works" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="font-mono text-xs font-normal uppercase tracking-[0.25em] text-muted-foreground">
            How It Works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">
            Three steps. Zero complexity.
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Dashed connector line — desktop only */}
          <div
            className="absolute left-0 right-0 top-10 hidden h-px border-t border-dashed border-border md:block"
            aria-hidden="true"
            style={{ marginLeft: "calc(100% / 6)", marginRight: "calc(100% / 6)" }}
          />

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center text-center transition-all duration-700 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: inView ? `${200 + i * 150}ms` : "0ms" }}
              >
                <span
                  className="font-heading text-4xl font-extrabold text-[#FF6B2C] md:text-5xl"
                  style={{ fontStretch: "normal", transform: "none", fontWeight: 800 }}
                >
                  {step.number}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#A8A4B8]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
