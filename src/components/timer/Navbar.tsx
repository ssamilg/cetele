import { Clock, Play, Square, TimerIcon } from "lucide-react"
import { formatClock } from "@/lib/formatters"
import { useTimerStore, CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/store/useTimerStore"
import type { Currency } from "@/store/useTimerStore"
import { useElapsed } from "@/hooks/useElapsed"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NavbarProps {
  onStartStop: () => void
  onManualEntry: () => void
}

const CURRENCIES: Currency[] = ["USD", "EUR", "TRY"]

export function Navbar({ onStartStop, onManualEntry }: NavbarProps) {
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const currency = useTimerStore((s) => s.currency)
  const setCurrency = useTimerStore((s) => s.setCurrency)
  const elapsed = useElapsed(activeTask?.startTime ?? null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <Clock className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Çetele</span>
        </div>

        <div className="flex items-center gap-3">
        {isRunning && activeTask && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1.5">
                <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />
                <span className="max-w-48 truncate">{activeTask.taskName}</span>
              </Badge>
              <span className="font-mono text-sm font-medium tabular-nums">
                {formatClock(elapsed)}
              </span>
            </div>
          )}

          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={onStartStop}
            className="gap-1.5"
          >
            {isRunning ? (
              <>
                <Square className="size-3.5 fill-current" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="ring-1 ring-primary"
            size="sm"
            onClick={onManualEntry}
            aria-label="Log time manually"
          >
            <TimerIcon className="size-4" />
            +
          </Button>
        </div>

        <div className="flex items-center justify-end gap-2 flex-1">
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="font-medium">{CURRENCY_SYMBOLS[c]}</span>
                    {CURRENCY_LABELS[c]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
