export function AntIcon({ className = "w-7 h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="22" y1="12" x2="17" y2="1" stroke="#FF6B2C" strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="12" x2="39" y2="1" stroke="#FF6B2C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="20" r="11" fill="#FF6B2C" />
      <circle cx="28" cy="42" r="9" fill="#FF6B2C" />
      <circle cx="28" cy="68" r="15" fill="#FF6B2C" />
    </svg>
  )
}

export function ZikoraLogo() {
  return (
    <a href="#" className="flex items-center gap-2.5" aria-label="Zikora home">
      <AntIcon />
      <span className="font-heading text-foreground text-lg font-extrabold tracking-[0.35em]">
        ZIKORA
      </span>
    </a>
  )
}
