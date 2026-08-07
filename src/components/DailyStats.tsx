import { Clock, ListChecks, Wallet } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { ALL_DAYS_KEY, formatDate, formatDuration, toDateKey, todayDateKey } from "@/lib/formatters"
import { useTimerStore, CURRENCY_SYMBOLS } from "@/store/useTimerStore"
import type { Currency } from "@/store/useTimerStore"
import { cn } from "@/lib/utils"

function formatEarned(totalSeconds: number, hourlyRate: number, currency: Currency): string {
  const amount = (totalSeconds / 3600) * hourlyRate
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${CURRENCY_SYMBOLS[currency]}${formatted}`
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  iconClassName?: string
}

function StatCard({ icon, label, value, iconClassName }: StatCardProps) {
  return (
    <Card className="gap-0 py-4 shadow-sm md:py-5">
      <CardContent className="flex items-center gap-3.5 px-4 md:gap-4 md:px-5">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          {icon}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          <span className="truncate text-xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

interface DailyStatsProps {
  selectedDayKey: string
}

export function DailyStats({ selectedDayKey }: DailyStatsProps) {
  const { t } = useTranslation()
  const records = useTimerStore((s) => s.records)
  const hourlyRate = useTimerStore((s) => s.hourlyRate)
  const currency = useTimerStore((s) => s.currency)

  const filteredRecords = selectedDayKey === ALL_DAYS_KEY
    ? records
    : records.filter((r) => toDateKey(r.startTime) === selectedDayKey)

  const totalSeconds = filteredRecords.reduce((sum, r) => sum + r.duration, 0)
  const taskCount = filteredRecords.length

  const todayKey = todayDateKey()
  let hoursLabel = t("stats.hours")
  let tasksLabel = t("stats.tasks")
  let earnedLabel = t("stats.earned")

  if (selectedDayKey === ALL_DAYS_KEY) {
    hoursLabel = t("stats.hours_all")
    tasksLabel = t("stats.tasks_all")
    earnedLabel = t("stats.earned_all")
  } else if (selectedDayKey === todayKey) {
    hoursLabel = t("stats.hours_today")
    tasksLabel = t("stats.tasks_today")
    earnedLabel = t("stats.earned_today")
  } else {
    const [y, m, d] = selectedDayKey.split("-").map(Number)
    const dayLabel = formatDate(new Date(y, m - 1, d))
    hoursLabel = t("stats.hours_day", { date: dayLabel })
    tasksLabel = t("stats.tasks_day", { date: dayLabel })
    earnedLabel = t("stats.earned_day", { date: dayLabel })
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4",
        hourlyRate > 0 ? "lg:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      <StatCard
        icon={<Clock className="size-5" />}
        label={hoursLabel}
        value={totalSeconds > 0 ? formatDuration(totalSeconds) : "—"}
        iconClassName="bg-primary/10 text-primary"
      />
      <StatCard
        icon={<ListChecks className="size-5" />}
        label={tasksLabel}
        value={taskCount > 0 ? String(taskCount) : "—"}
        iconClassName="bg-blue-500/10 text-blue-500"
      />
      {hourlyRate > 0 && (
        <StatCard
          icon={<Wallet className="size-5" />}
          label={earnedLabel}
          value={totalSeconds > 0 ? formatEarned(totalSeconds, hourlyRate, currency) : "—"}
          iconClassName="bg-green-500/10 text-green-500"
        />
      )}
    </div>
  )
}
