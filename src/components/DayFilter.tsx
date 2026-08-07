import { useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { formatDate, toDateKey, todayDateKey, ALL_DAYS_KEY } from "@/lib/formatters"
import type { TimeRecord } from "@/types"

export { ALL_DAYS_KEY }

interface DaySummary {
  key: string
  date: Date
}

interface DayFilterProps {
  records: TimeRecord[]
  selectedDayKey: string
  onSelectDay: (key: string) => void
}

function buildDaySummaries(records: TimeRecord[]): {
  prevDays: DaySummary[]
  today: DaySummary
} {
  const todayKey = todayDateKey()
  const byDay = new Map<string, Date>()

  for (const record of records) {
    const key = toDateKey(record.startTime)
    if (!byDay.has(key)) {
      byDay.set(
        key,
        new Date(
          record.startTime.getFullYear(),
          record.startTime.getMonth(),
          record.startTime.getDate(),
        ),
      )
    }
  }

  const now = new Date()
  const today: DaySummary = {
    key: todayKey,
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  }

  const prevDays = Array.from(byDay.entries())
    .filter(([key]) => key !== todayKey)
    .map(([key, date]) => ({ key, date }))
    .sort((a, b) => a.key.localeCompare(b.key))

  return { prevDays, today }
}

export function DayFilter({
  records,
  selectedDayKey,
  onSelectDay,
}: DayFilterProps) {
  const { t } = useTranslation()
  const selectedRef = useRef<HTMLButtonElement>(null)

  const { prevDays, today } = useMemo(() => buildDaySummaries(records), [records])

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" })
  }, [selectedDayKey, prevDays.length])

  return (
    <div
      role="toolbar"
      aria-label={t("day_filter.aria")}
      className="flex min-w-0 items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]"
    >
      <div className="ml-auto flex items-center gap-1.5">
        {prevDays.map((day) => {
          const isSelected = day.key === selectedDayKey
          return (
            <Button
              key={day.key}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              aria-pressed={isSelected}
              onClick={() => onSelectDay(day.key)}
              className="shrink-0"
            >
              {formatDate(day.date)}
            </Button>
          )
        })}
        {prevDays.length > 0 && (
          <span
            aria-hidden="true"
            className="mx-0.5 h-4 w-px shrink-0 bg-border"
          />
        )}
        <Button
          ref={selectedDayKey === today.key ? selectedRef : undefined}
          type="button"
          size="sm"
          variant={selectedDayKey === today.key ? "default" : "outline"}
          aria-pressed={selectedDayKey === today.key}
          onClick={() => onSelectDay(today.key)}
          className="shrink-0"
        >
          {t("day_filter.today")}
        </Button>
        <Button
          ref={selectedDayKey === ALL_DAYS_KEY ? selectedRef : undefined}
          type="button"
          size="sm"
          variant={selectedDayKey === ALL_DAYS_KEY ? "default" : "outline"}
          aria-pressed={selectedDayKey === ALL_DAYS_KEY}
          onClick={() => onSelectDay(ALL_DAYS_KEY)}
          className="shrink-0"
        >
          {t("day_filter.all")}
        </Button>
      </div>
    </div>
  )
}
