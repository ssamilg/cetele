import { Fragment } from "react"
import { Clock, FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { useTranslation } from "react-i18next"
import {
  formatDate,
  formatDuration,
  formatSessionDateRange,
  formatTimeShort,
  toDateKey,
  todayDateKey,
} from "@/lib/formatters"
import { useTimerStore, CURRENCY_SYMBOLS } from "@/store/useTimerStore"
import type { TimeRecord } from "@/types"
import type { Currency } from "@/store/useTimerStore"

interface WorkLogTableProps {
  entries: TimeRecord[]
  onEdit: (entry: TimeRecord) => void
  hourlyRate?: number
  emptyTitle?: string
  emptyDescription?: string
}

interface DayGroup {
  key: string
  date: Date
  entries: TimeRecord[]
  totalSeconds: number
}

function formatEarned(totalSeconds: number, hourlyRate: number, currency: Currency): string {
  const amount = (totalSeconds / 3600) * hourlyRate
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${CURRENCY_SYMBOLS[currency]}${formatted}`
}

function groupEntriesByDay(entries: TimeRecord[]): DayGroup[] {
  const groups = new Map<string, DayGroup>()

  for (const entry of entries.slice().reverse()) {
    const key = toDateKey(entry.startTime)
    const existing = groups.get(key)
    if (existing) {
      existing.entries.push(entry)
      existing.totalSeconds += entry.duration
    } else {
      groups.set(key, {
        key,
        date: new Date(
          entry.startTime.getFullYear(),
          entry.startTime.getMonth(),
          entry.startTime.getDate(),
        ),
        entries: [entry],
        totalSeconds: entry.duration,
      })
    }
  }

  return Array.from(groups.values())
}

export function WorkLogTable({
  entries,
  onEdit,
  hourlyRate = 0,
  emptyTitle,
  emptyDescription,
}: WorkLogTableProps) {
  const { t } = useTranslation()
  const currency = useTimerStore((s) => s.currency)
  const todayKey = todayDateKey()
  const columnCount = hourlyRate > 0 ? 7 : 6

  if (entries.length === 0) {
    return (
      <Empty className="rounded-xl border border-dashed bg-card py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle ?? t("table.empty_title")}</EmptyTitle>
          <EmptyDescription>{emptyDescription ?? t("table.empty_desc")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const dayGroups = groupEntriesByDay(entries)
  const totalSeconds = entries.reduce((sum, e) => sum + e.duration, 0)

  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[220px] pl-4 font-semibold text-foreground">
              {t("table.col_task")}
            </TableHead>
            <TableHead className="w-[260px] font-semibold text-foreground">
              {t("table.col_description")}
            </TableHead>
            <TableHead className="w-[150px] font-semibold text-foreground">
              {t("table.col_date")}
            </TableHead>
            <TableHead className="w-[90px] font-semibold text-foreground">
              {t("table.col_started")}
            </TableHead>
            <TableHead className="w-[90px] font-semibold text-foreground">
              {t("table.col_stopped")}
            </TableHead>
            <TableHead className="w-[100px] font-semibold text-foreground">
              {t("table.col_duration")}
            </TableHead>
            {hourlyRate > 0 && (
              <TableHead className="w-[100px] font-semibold text-foreground">
                {t("table.col_earned")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dayGroups.map((group) => {
            const dayLabel = group.key === todayKey
              ? t("day_filter.today")
              : formatDate(group.date)

            return (
              <Fragment key={group.key}>
                <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={Math.max(columnCount - 2, 1)} className="py-2.5 pl-4">
                    <span className="text-xs font-semibold tracking-wide text-foreground uppercase">
                      {dayLabel}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant="secondary" className="rounded-md font-mono text-xs tabular-nums">
                      {formatDuration(group.totalSeconds)}
                    </Badge>
                  </TableCell>
                  {hourlyRate > 0 && (
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className="rounded-md font-mono text-xs tabular-nums text-green-600
                          border-green-300 dark:text-green-400 dark:border-green-800"
                      >
                        {formatEarned(group.totalSeconds, hourlyRate, currency)}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
                {group.entries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    tabIndex={0}
                    className="group cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
                      focus-visible:ring-inset"
                    onClick={() => onEdit(entry)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onEdit(entry)
                      }
                    }}
                  >
                    <TableCell className="py-3.5 pl-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{entry.taskName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      {entry.description ? (
                        <span className="line-clamp-2 max-w-72 text-sm text-muted-foreground">
                          {entry.description}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground/70">
                          <FileText className="size-3" />
                          {t("table.no_description")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {formatSessionDateRange(entry.startTime, entry.endTime)}
                    </TableCell>
                    <TableCell className="py-3.5 font-mono text-sm tabular-nums">
                      {formatTimeShort(entry.startTime)}
                    </TableCell>
                    <TableCell className="py-3.5 font-mono text-sm tabular-nums">
                      {formatTimeShort(entry.endTime)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Badge variant="secondary" className="rounded-md font-mono text-xs tabular-nums">
                        {formatDuration(entry.duration)}
                      </Badge>
                    </TableCell>
                    {hourlyRate > 0 && (
                      <TableCell className="py-3.5">
                        <Badge
                          variant="outline"
                          className="rounded-md font-mono text-xs tabular-nums text-green-600
                            border-green-300 dark:text-green-400 dark:border-green-800"
                        >
                          {formatEarned(entry.duration, hourlyRate, currency)}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </Fragment>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted/20 hover:bg-muted/20">
            <TableCell colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
              {t("table.entry_count", { count: entries.length })}
            </TableCell>
            <TableCell className="py-3">
              <Badge variant="outline" className="rounded-md font-mono text-xs tabular-nums">
                {formatDuration(totalSeconds)}
              </Badge>
            </TableCell>
            {hourlyRate > 0 && (
              <TableCell className="py-3">
                <Badge
                  variant="outline"
                  className="rounded-md font-mono text-xs tabular-nums text-green-600
                    border-green-300 dark:text-green-400 dark:border-green-800"
                >
                  {formatEarned(totalSeconds, hourlyRate, currency)}
                </Badge>
              </TableCell>
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
