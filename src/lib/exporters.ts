import type { TimeRecord } from "@/types"
import { formatDateTime, formatDuration } from "@/lib/formatters"

export function exportToCsv(entries: TimeRecord[], hourlyRate = 0): void {
  const hasRate = hourlyRate > 0
  const headers = ["Task", "Description", "Started", "Stopped", "Duration", ...(hasRate ? ["Earned (USD)"] : [])]
  const rows = entries.map((e) => {
    const earned = hasRate
      ? `$${((e.duration / 3600) * hourlyRate).toFixed(2)}`
      : null
    return [
      e.taskName,
      e.description,
      formatDateTime(e.startTime),
      formatDateTime(e.endTime),
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
