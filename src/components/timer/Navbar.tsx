import { Clock, Play, Square } from "lucide-react"
import { formatClock } from "@/lib/formatters"
import { useTimerStore } from "@/store/useTimerStore"
import { useElapsed } from "@/hooks/useElapsed"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"

interface NavbarProps {
  onStartStop: () => void
}

export function Navbar({ onStartStop }: NavbarProps) {
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const elapsed = useElapsed(activeTask?.startTime ?? null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <Clock className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Çetele</span>
        </div>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-3 flex-1">
          {isRunning && activeTask && (
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant="default" className="gap-1.5 shrink-0">
                <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />
                Working on
              </Badge>
              <span className="text-sm text-muted-foreground truncate max-w-48">{activeTask.taskName}</span>
            </div>
          )}
          {isRunning && (
            <span className="font-mono text-sm font-medium tabular-nums">
              {formatClock(elapsed)}
            </span>
          )}
          {!isRunning && (
            <span className="text-sm text-muted-foreground">No active task</span>
          )}
        </div>

        <div className="flex items-center gap-2">
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

          <Separator orientation="vertical" className="h-5" />

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
