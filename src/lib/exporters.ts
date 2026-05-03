import type { TimeRecord } from "@/types"
import { formatDateTime, formatDuration } from "@/lib/formatters"

export function exportToCsv(entries: TimeRecord[]): void {
  const rows = [
    ["Task", "Description", "Started", "Stopped", "Duration"],
    ...entries.map((e) => [
      e.taskName,
      e.description,
      formatDateTime(e.startTime),
      formatDateTime(e.endTime),
      formatDuration(e.duration),
    ]),
  ]
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `cetele-logs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
