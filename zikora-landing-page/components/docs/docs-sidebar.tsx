"use client"

import { useActiveSection } from "@/hooks/use-active-section"
import { ScrollArea } from "@/components/ui/scroll-area"

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "quickstart", label: "Quick Start" },
  { id: "architecture", label: "Architecture" },
  { id: "agents", label: "AI Agents" },
  { id: "tokens", label: "Supported Tokens" },
  { id: "contracts", label: "Contract Addresses" },
  { id: "api", label: "API Reference" },
  { id: "security", label: "Security" },
  { id: "faq", label: "FAQ" },
]

const sectionIds = sections.map((s) => s.id)

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const activeId = useActiveSection(sectionIds)

  return (
    <ScrollArea className="h-full">
      <nav className="space-y-1 py-4">
        <p className="mb-4 px-3 font-mono text-xs font-normal uppercase tracking-[0.2em] text-muted-foreground">
          Contents
        </p>
        {sections.map((section) => {
          const isActive = activeId === section.id
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={onNavigate}
              className={`block border-l-2 px-3 py-1.5 text-sm transition-colors duration-200 ${
                isActive
                  ? "border-[#FF6B2C] font-medium text-[#FF6B2C]"
                  : "border-transparent text-[#A8A4B8] hover:text-foreground"
              }`}
            >
              {section.label}
            </a>
          )
        })}
      </nav>
    </ScrollArea>
  )
}
