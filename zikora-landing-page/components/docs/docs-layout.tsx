"use client"

import { useState } from "react"
import { List } from "lucide-react"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[1200px] gap-10 px-6 py-12">
      {/* Desktop sidebar */}
      <aside className="hidden md:block sticky top-24 h-[calc(100vh-8rem)] w-[220px] shrink-0">
        <DocsSidebar />
      </aside>

      {/* Content */}
      <div className="min-w-0 max-w-[720px] flex-1">{children}</div>

      {/* Mobile floating button */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B2C] text-[#12121A] shadow-lg md:hidden"
            aria-label="Table of contents"
          >
            <List className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] bg-background border-border p-0 pt-10">
          <DocsSidebar onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
