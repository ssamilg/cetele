import type { TimeRecord } from "@/types"

export function exportToCsv(entries: TimeRecord[]): void {
  const rows = [
    ["Title", "Description", "Start", "End", "Duration (min)"],
    ...entries.map((e) => [
      e.taskName,
      e.description,
      e.startTime.toISOString(),
      e.endTime.toISOString(),
      String(Math.round(e.duration / 60)),
    ]),
  ]
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `timetrack-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
