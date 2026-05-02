import { useEffect, useState } from "react"
import { Play, Square, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatClock, formatTime } from "@/lib/formatters"
import { useTimerStore } from "@/store/useTimerStore"
import { useElapsed } from "@/hooks/useElapsed"

interface TaskFormModalProps {
  open: boolean
  mode: "start" | "stop"
  onStart: (taskName: string, description: string) => void
  onStop: (taskName: string, description: string) => void
  onCancel: () => void
}

export function TaskFormModal({ open, mode, onStart, onStop, onCancel }: TaskFormModalProps) {
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const isStop = mode === "stop"
  const elapsed = useElapsed(isStop && open ? activeTask?.startTime ?? null : null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!open) return
    if (isStop && activeTask) {
      setTitle(activeTask.taskName)
      setDescription(activeTask.description)
    } else {
      setTitle("")
      setDescription("")
    }
  }, [open, isStop, activeTask])

  const stoppingAt = activeTask
    ? new Date(activeTask.startTime.getTime() + elapsed * 1000)
    : new Date()

  const handleSubmit = () => {
    if (!title.trim()) return
    if (mode === "start") {
      onStart(title.trim(), description.trim())
    } else {
      onStop(title.trim(), description.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isStop ? (
              <>
                <div className="flex size-7 items-center justify-center rounded-md bg-destructive/10">
                  <Square className="size-4 text-destructive fill-destructive" />
                </div>
                Stop Task
              </>
            ) : (
              <>
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                  <Play className="size-4 text-primary fill-primary" />
                </div>
                Start New Task
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isStop
              ? "Review and finalize the details before stopping the timer."
              : "Enter the task details to begin tracking your time."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isStop && activeTask && (
            <>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Session Time</span>
                  <Badge variant="secondary" className="ml-auto font-mono text-xs">
                    {formatClock(elapsed)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Started</span>
                    <span className="text-sm font-medium font-mono">{formatTime(activeTask.startTime)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Stopping at</span>
                    <span className="text-sm font-medium font-mono">{formatTime(stoppingAt)}</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="task-title"
              placeholder="What are you working on?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
              autoFocus={!isStop}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Optional notes or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={isStop ? "destructive" : "default"}
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="gap-1.5"
          >
            {isStop ? (
              <>
                <Square className="size-3.5 fill-current" />
                Stop & Save
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                Start Timer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
