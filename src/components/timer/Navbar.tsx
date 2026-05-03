import { Play, Square, TimerIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import logo from "@/assets/logo.webp"
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
  const { t, i18n } = useTranslation()
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const currency = useTimerStore((s) => s.currency)
  const setCurrency = useTimerStore((s) => s.setCurrency)
  const elapsed = useElapsed(activeTask?.startTime ?? null)

  const activeLang = i18n.language.startsWith("tr") ? "tr" : "en"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <img
            src={logo}
            alt=""
            className="min-h-10 h-10 w-auto max-h-10 object-contain shrink-0"
          />
          <span className="text-xl font-semibold tracking-tight">Çetele</span>
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
            className="ring-1 ring-primary"
            onClick={onManualEntry}
            aria-label={t("nav.manual_entry_aria")}
          >
            <TimerIcon className="size-4" />+
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => i18n.changeLanguage(activeLang === "en" ? "tr" : "en")}
            aria-label="Toggle language"
            className="w-9 text-xs font-semibold"
          >
            {activeLang.toUpperCase()}
          </Button>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
