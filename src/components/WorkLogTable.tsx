import { Clock, FileText, CreditCard as Edit2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { WorkEntry } from "@/types"

interface WorkLogTableProps {
  entries: WorkEntry[]
  onEdit: (entry: WorkEntry) => void
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDateTime(date: Date): string {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function WorkLogTable({ entries, onEdit }: WorkLogTableProps) {
  if (entries.length === 0) {
    return (
      <Empty className="border-dashed border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock />
          </EmptyMedia>
          <EmptyTitle>No time entries yet</EmptyTitle>
          <EmptyDescription>
            Start a task using the timer in the navbar to begin tracking your work.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const totalSeconds = entries.reduce((sum, e) => sum + e.duration, 0)

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[260px] pl-4">Task</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="w-[160px]">Started</TableHead>
            <TableHead className="w-[160px]">Stopped</TableHead>
            <TableHead className="w-[100px]">Duration</TableHead>
            <TableHead className="w-[60px] text-right pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.slice().reverse().map((entry) => (
            <TableRow key={entry.id} className="group cursor-pointer hover:bg-muted/50" onClick={() => onEdit(entry)}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-2 shrink-0 rounded-full bg-primary/70" />
                  <span className="font-medium text-sm">{entry.title}</span>
                </div>
              </TableCell>
              <TableCell>
                {entry.description ? (
                  <span className="text-sm text-muted-foreground line-clamp-2 max-w-72">
                    {entry.description}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground/50 italic flex items-center gap-1">
                    <FileText className="size-3" />
                    No description
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{formatTime(entry.startTime)}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(entry.startTime).split(",")[0]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{formatTime(entry.endTime)}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(entry.endTime).split(",")[0]}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono text-xs">
                  {formatDuration(entry.duration)}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-4">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => { e.stopPropagation(); onEdit(entry) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label="Edit entry"
                >
                  <Edit2 className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {entries.length > 0 && (
          <tfoot>
            <tr className="border-t bg-muted/20">
              <td colSpan={4} className="px-4 py-3 text-sm text-muted-foreground">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </td>
              <td className="px-2 py-3" colSpan={2}>
                <Badge variant="outline" className="font-mono text-xs">
                  Total: {formatDuration(totalSeconds)}
                </Badge>
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  )
}
