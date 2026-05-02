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
import type { ActiveTask } from "@/types"

interface TaskFormModalProps {
  open: boolean
  mode: "start" | "stop"
  activeTask: ActiveTask | null
  onStart: (title: string, description: string) => void
  onStop: (title: string, description: string) => void
  onCancel: () => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function formatDuration(start: Date, now: Date): string {
  const secs = Math.floor((now.getTime() - start.getTime()) / 1000)
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
}

export function TaskFormModal({ open, mode, activeTask, onStart, onStop, onCancel }: TaskFormModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (open) {
      setNow(new Date())
      if (mode === "stop" && activeTask) {
        setTitle(activeTask.title)
        setDescription(activeTask.description)
      } else {
        setTitle("")
        setDescription("")
      }
    }
  }, [open, mode, activeTask])

  useEffect(() => {
    if (!open || mode !== "stop") return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [open, mode])

  const handleSubmit = () => {
    if (!title.trim()) return
    if (mode === "start") {
      onStart(title.trim(), description.trim())
    } else {
      onStop(title.trim(), description.trim())
    }
  }

  const isStop = mode === "stop"

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
          {/* Time info in stop mode */}
          {isStop && activeTask && (
            <>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Session Time</span>
                  <Badge variant="secondary" className="ml-auto font-mono text-xs">
                    {formatDuration(activeTask.startTime, now)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Started</span>
                    <span className="text-sm font-medium font-mono">{formatTime(activeTask.startTime)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Stopping at</span>
                    <span className="text-sm font-medium font-mono">{formatTime(now)}</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Title */}
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

          {/* Description */}
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

        <DialogFooter className="gap-2 sm:gap-0">
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
