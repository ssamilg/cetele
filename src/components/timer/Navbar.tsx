import { Play, Square, TimerIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import logo from "@/assets/logo.webp"
import { formatClock } from "@/lib/formatters"
import { useTimerStore } from "@/store/useTimerStore"
import { useElapsed } from "@/hooks/useElapsed"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavbarSettingsMenu } from "@/components/timer/NavbarSettingsMenu"
import { cn } from "@/lib/utils"

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
    <header
      className="sticky top-0 z-50 w-full min-w-0 border-b border-border
        bg-card/95 backdrop-blur-md supports-backdrop-filter:bg-card/80"
    >
      <div
        className="grid min-w-0 grid-cols-[1fr_auto] gap-x-2 gap-y-2 px-3 py-2 md:flex md:h-14
          md:min-h-14 md:items-center md:gap-4 md:px-6 md:py-0"
      >
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2.5 md:order-1 md:min-w-0 md:flex-1">
          <img
            src={logo}
            alt=""
            className="min-h-9 h-9 w-auto max-h-9 object-contain shrink-0 md:min-h-10 md:h-10 md:max-h-10"
          />
          <span className="truncate text-lg font-semibold tracking-tight md:text-xl">
            Çetele
          </span>
        </div>

        <div
          className={cn(
            "col-span-2 row-start-2 flex min-w-0 items-center justify-center gap-1.5 md:order-2",
            "md:w-auto md:max-w-none md:flex-1 md:justify-center md:gap-2",
            isRunning && "rounded-lg bg-muted/50 px-1.5 py-1 md:px-2",
          )}
        >
          {isRunning && activeTask && (
            <div className="flex max-w-[min(50vw,14rem)] min-w-0 items-center gap-2 md:max-w-64">
              <Badge variant="default" className="min-w-0 max-w-full gap-1.5 rounded-md">
                <span className="size-1.5 shrink-0 rounded-full bg-primary-foreground animate-pulse" />
                <span className="min-w-0 truncate">{activeTask.taskName}</span>
              </Badge>
              <span
                className="font-mono text-sm font-semibold tabular-nums tracking-tight shrink-0
                  text-foreground md:text-base"
                aria-live="polite"
              >
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
            size="sm"
            className="shrink-0 ring-1 ring-primary bg-background"
            onClick={onManualEntry}
            aria-label={t("nav.manual_entry_aria")}
          >
            <TimerIcon className="size-4" />
            <span className="font-semibold leading-none">+</span>
          </Button>
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-end md:order-3 md:min-w-0 md:flex-1">
          <NavbarSettingsMenu />
        </div>
      </div>
    </header>
  )
}
