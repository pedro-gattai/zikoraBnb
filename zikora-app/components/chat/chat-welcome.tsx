import { AntIcon } from '@/components/zikora-logo'
import { Button } from '@/components/ui/button'
import { QUICK_PROMPTS } from '@/lib/constants'
import { ArrowLeftRight, TrendingUp, BarChart3, Search } from 'lucide-react'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trading: ArrowLeftRight,
  yield: TrendingUp,
  analytics: BarChart3,
}

interface ChatWelcomeProps {
  onPromptClick: (prompt: string) => void
}

export function ChatWelcome({ onPromptClick }: ChatWelcomeProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-full bg-primary/10 p-4">
          <AntIcon className="w-10 h-auto" />
        </div>
        <h2 className="font-heading text-xl font-bold">Welcome to Zikora</h2>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Your AI-powered DeFi assistant for BNB Chain. Ask me to swap tokens,
          manage yield positions, or analyze your portfolio.
        </p>
      </div>

      <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
        {QUICK_PROMPTS.map((item) => {
          const Icon = ICONS[item.agent] || Search
          return (
            <Button
              key={item.label}
              variant="outline"
              className="btn-interactive h-auto flex-col items-start gap-1 p-3 text-left"
              onClick={() => onPromptClick(item.prompt)}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {item.label}
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1">
                {item.prompt}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
