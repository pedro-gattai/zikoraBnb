interface DocsSectionProps {
  id: string
  title: string
  children: React.ReactNode
}

export function DocsSection({ id, title, children }: DocsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10 pb-6">
      <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-6 space-y-6 text-[#A8A4B8] leading-relaxed">{children}</div>
    </section>
  )
}
