import { useEffect, useState } from "react"
import { Play, Pencil, Trash2, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/formatters"
import type { TimeRecord } from "@/types"

interface TaskFormModalProps {
  open: boolean
  mode: "start" | "edit"
  entry?: TimeRecord | null
  onStart?: (taskName: string, description: string) => void
  onSave?: (entry: TimeRecord) => void
  onDelete?: (id: string) => void
  onCancel: () => void
}

function toTimeInputValue(date: Date): string {
  return date.toTimeString().slice(0, 5)
}

function applyTimeToDate(original: Date, timeInput: string): Date {
  const [hours, minutes] = timeInput.split(":").map(Number)
  const result = new Date(original)
  result.setHours(hours, minutes, 0, 0)
  return result
}

export function TaskFormModal({
  open,
  mode,
  entry,
  onStart,
  onSave,
  onDelete,
  onCancel,
}: TaskFormModalProps) {
  const isEdit = mode === "edit"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTimeInput, setStartTimeInput] = useState("")
  const [endTimeInput, setEndTimeInput] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!open) return
    if (isEdit && entry) {
      setTitle(entry.taskName)
      setDescription(entry.description)
      setStartTimeInput(toTimeInputValue(entry.startTime))
      setEndTimeInput(toTimeInputValue(entry.endTime))
      setDeleteConfirm(false)
    } else {
      setTitle("")
      setDescription("")
    }
  }, [open, isEdit, entry])

  const editedStartTime =
    isEdit && entry && startTimeInput ? applyTimeToDate(entry.startTime, startTimeInput) : null
  const editedEndTime =
    isEdit && entry && endTimeInput ? applyTimeToDate(entry.endTime, endTimeInput) : null
  const isTimeValid =
    !isEdit ||
    (editedStartTime !== null &&
      editedEndTime !== null &&
      editedEndTime.getTime() > editedStartTime.getTime())
  const editedDuration =
    editedStartTime && editedEndTime
      ? Math.max(0, Math.floor((editedEndTime.getTime() - editedStartTime.getTime()) / 1000))
      : 0

  const handleSubmit = () => {
    if (!title.trim() || !isTimeValid) return
    if (!isEdit) {
      onStart?.(title.trim(), description.trim())
    } else if (entry && editedStartTime && editedEndTime) {
      onSave?.({
        ...entry,
        taskName: title.trim(),
        description: description.trim(),
        startTime: editedStartTime,
        endTime: editedEndTime,
        duration: editedDuration,
      })
    }
  }

  const handleDelete = () => {
    if (entry) onDelete?.(entry.id)
    setDeleteConfirm(false)
  }

  return (
    <>
      <Dialog open={open && !deleteConfirm} onOpenChange={(o) => { if (!o) onCancel() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEdit ? (
                <>
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                    <Pencil className="size-4 text-primary" />
                  </div>
                  Edit Entry
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
              {isEdit
                ? "Modify the task details for this time entry."
                : "Enter the task details to begin tracking your time."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {isEdit && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-start">Start Time</Label>
                    <Input
                      id="edit-start"
                      type="time"
                      value={startTimeInput}
                      onChange={(e) => setStartTimeInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-end">End Time</Label>
                    <Input
                      id="edit-end"
                      type="time"
                      value={endTimeInput}
                      onChange={(e) => setEndTimeInput(e.target.value)}
                    />
                  </div>
                </div>

                {isTimeValid && editedDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <Badge variant="secondary" className="ml-auto font-mono text-xs">
                      {formatDuration(editedDuration)}
                    </Badge>
                  </div>
                )}

                {!isTimeValid && startTimeInput && endTimeInput && (
                  <p className="text-xs text-destructive">End time must be after start time.</p>
                )}

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
                autoFocus={!isEdit}
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
            {isEdit && (
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirm(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 mr-auto"
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !isTimeValid}
              className="gap-1.5"
            >
              {isEdit ? (
                <>
                  <Pencil className="size-3.5" />
                  Save Changes
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

      {isEdit && (
        <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete entry?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this time entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
