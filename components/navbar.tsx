"use client"

import { useState, useEffect } from "react"
import { ZikoraLogo } from "@/components/zikora-logo"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-[#1A1A26]/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <ZikoraLogo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-[#A8A4B8] transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#"
            className="inline-flex items-center rounded-xl bg-[#FF6B2C] px-5 py-2.5 font-heading text-sm font-semibold text-[#12121A] transition-all duration-200 hover:bg-[#FF8F5C] hover:shadow-[0_0_20px_rgba(255,107,44,0.3)] active:scale-[0.98]"
          >
            Launch App
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-[#1A1A26]/95 backdrop-blur-lg px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-sans text-base text-[#A8A4B8] transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#FF6B2C] px-5 py-2.5 font-heading text-sm font-semibold text-[#12121A] transition-all duration-200 hover:bg-[#FF8F5C] active:scale-[0.98]"
            >
              Launch App
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
