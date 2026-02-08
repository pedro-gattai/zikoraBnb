export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      <div className="h-2 w-2 rounded-full bg-primary animate-dot-1" />
      <div className="h-2 w-2 rounded-full bg-primary animate-dot-2" />
      <div className="h-2 w-2 rounded-full bg-primary animate-dot-3" />
    </div>
  )
}
