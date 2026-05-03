import { Play, Square, TimerIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import logo from "@/assets/logo.webp"
import { formatClock } from "@/lib/formatters"
import { useTimerStore } from "@/store/useTimerStore"
import { useElapsed } from "@/hooks/useElapsed"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavbarSettingsMenu } from "@/components/timer/NavbarSettingsMenu"

interface NavbarProps {
  onStartStop: () => void
  onManualEntry: () => void
}

export function Navbar({ onStartStop, onManualEntry }: NavbarProps) {
  const { t } = useTranslation()
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const elapsed = useElapsed(activeTask?.startTime ?? null)

  return (
    <header className="sticky top-0 z-50 w-full min-w-0 border-b border-border bg-card">
      <div className="flex h-14 min-h-14 min-w-0 items-center gap-2 px-3 md:gap-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <img
            src={logo}
            alt=""
            className="min-h-10 h-10 w-auto max-h-10 object-contain shrink-0"
          />
          <span className="truncate text-xl font-semibold tracking-tight">Çetele</span>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-1.5 md:gap-2">
          {isRunning && activeTask && (
            <div className="flex max-w-[min(50vw,14rem)] min-w-0 items-center gap-1.5 md:max-w-56">
              <Badge variant="default" className="min-w-0 max-w-full gap-1.5">
                <span className="size-1.5 shrink-0 rounded-full bg-primary-foreground animate-pulse" />
                <span className="min-w-0 truncate">{activeTask.taskName}</span>
              </Badge>
              <span className="font-mono text-sm font-medium tabular-nums shrink-0">
                {formatClock(elapsed)}
              </span>
            </div>
          )}
          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={onStartStop}
            className="shrink-0 gap-1.5"
          >
            {isRunning ? (
              <>
                <Square className="size-3.5 fill-current" />
                {t("nav.stop")}
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                {t("nav.start")}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="shrink-0 ring-1 ring-primary"
            onClick={onManualEntry}
            aria-label={t("nav.manual_entry_aria")}
          >
            <TimerIcon className="size-4" />+
          </Button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end">
          <NavbarSettingsMenu />
        </div>
      </div>
    </header>
  )
}
