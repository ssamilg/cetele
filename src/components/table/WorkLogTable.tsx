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
import { formatDuration, formatSessionDateRange, formatTimeShort } from "@/lib/formatters"
import { useTimerStore, CURRENCY_SYMBOLS } from "@/store/useTimerStore"
import type { TimeRecord } from "@/types"
import type { Currency } from "@/store/useTimerStore"

interface WorkLogTableProps {
  entries: TimeRecord[]
  onEdit: (entry: TimeRecord) => void
  hourlyRate?: number
}

function formatEarned(totalSeconds: number, hourlyRate: number, currency: Currency): string {
  const amount = (totalSeconds / 3600) * hourlyRate
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${CURRENCY_SYMBOLS[currency]}${formatted}`
}

export function WorkLogTable({ entries, onEdit, hourlyRate = 0 }: WorkLogTableProps) {
  const { t } = useTranslation()
  const currency = useTimerStore((s) => s.currency)

  if (entries.length === 0) {
    return (
      <Empty className="border-dashed border bg-card rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock />
          </EmptyMedia>
          <EmptyTitle>{t("table.empty_title")}</EmptyTitle>
          <EmptyDescription>{t("table.empty_desc")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const totalSeconds = entries.reduce((sum, e) => sum + e.duration, 0)

  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-xl border bg-card">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b border-border">
            <TableHead className="w-[220px] pl-4 text-foreground font-semibold">{t("table.col_task")}</TableHead>
            <TableHead className="w-[260px] text-foreground font-semibold">{t("table.col_description")}</TableHead>
            <TableHead className="w-[150px] text-foreground font-semibold">{t("table.col_date")}</TableHead>
            <TableHead className="w-[90px] text-foreground font-semibold">{t("table.col_started")}</TableHead>
            <TableHead className="w-[90px] text-foreground font-semibold">{t("table.col_stopped")}</TableHead>
            <TableHead className="w-[100px] text-foreground font-semibold">{t("table.col_duration")}</TableHead>
            {hourlyRate > 0 && (
              <TableHead className="w-[100px] text-foreground font-semibold">{t("table.col_earned")}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.slice().reverse().map((entry) => (
            <TableRow
              key={entry.id}
              className="group cursor-pointer hover:bg-muted/50"
              onClick={() => onEdit(entry)}
            >
              <TableCell className="py-4">
                <div className="flex items-center">
                  <div className="flex size-2 shrink-0 rounded-full bg-primary/70" />
                  <span className="font-medium text-sm">{entry.taskName}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                {entry.description ? (
                  <span className="text-sm text-muted-foreground/50 line-clamp-2 max-w-72">
                    {entry.description}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileText className="size-3" />
                    {t("table.no_description")}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm py-4 text-muted-foreground">
                {formatSessionDateRange(entry.startTime, entry.endTime)}
              </TableCell>
              <TableCell className="text-sm py-4 font-mono tabular-nums">
                {formatTimeShort(entry.startTime)}
              </TableCell>
              <TableCell className="text-sm py-4 font-mono tabular-nums">
                {formatTimeShort(entry.endTime)}
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary" className="font-mono text-xs">
                  {formatDuration(entry.duration)}
                </Badge>
              </TableCell>
              {hourlyRate > 0 && (
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs text-green-600 border-green-300
                      dark:text-green-400 dark:border-green-800"
                  >
                    {formatEarned(entry.duration, hourlyRate, currency)}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted/20 hover:bg-muted/20">
            <TableCell colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
              {t("table.entry_count", { count: entries.length })}
            </TableCell>
            <TableCell className="py-3">
              <Badge variant="outline" className="font-mono text-xs">
                {formatDuration(totalSeconds)}
              </Badge>
            </TableCell>
            {hourlyRate > 0 && (
              <TableCell className="py-3">
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-green-600 border-green-300
                    dark:text-green-400 dark:border-green-800"
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
