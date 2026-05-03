import type { TimeRecord } from "@/types"
import { formatDuration, formatSessionDateRange, formatTimeShort } from "@/lib/formatters"
import type { Currency } from "@/store/useTimerStore"
import { CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/store/useTimerStore"

export function exportToCsv(entries: TimeRecord[], hourlyRate = 0, currency: Currency = "USD"): void {
  const hasRate = hourlyRate > 0
  const earnedLabel = `Earned (${CURRENCY_LABELS[currency]})`
  const headers = [
    "Task",
    "Description",
    "Date",
    "Started",
    "Stopped",
    "Duration",
    ...(hasRate ? [earnedLabel] : []),
  ]
  const rows = entries.map((e) => {
    const earned = hasRate
      ? `${CURRENCY_SYMBOLS[currency]}${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((e.duration / 3600) * hourlyRate)}`
      : null
    return [
      e.taskName,
      e.description,
      formatSessionDateRange(e.startTime, e.endTime),
      formatTimeShort(e.startTime),
      formatTimeShort(e.endTime),
      formatDuration(e.duration),
      ...(hasRate ? [earned!] : []),
    ]
  })

  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `cetele-logs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
