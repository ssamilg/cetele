import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Play, Pencil, Trash2, Clock, TimerIcon } from "lucide-react"
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
  mode: "start" | "edit" | "manual"
  entry?: TimeRecord | null
  onStart?: (taskName: string, description: string) => void
  onSave?: (entry: TimeRecord) => void
  onDelete?: (id: string) => void
  onCancel: () => void
}


function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function toTimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function combineDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  return new Date(`${dateStr}T${timeStr}`)
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
  const { t } = useTranslation()
  const isEdit = mode === "edit"
  const isManual = mode === "manual"
  const isEditLike = isEdit || isManual

  const QUICK_SPANS = [
    { label: t("modal.quick_5min"), minutes: 5 },
    { label: t("modal.quick_15min"), minutes: 15 },
    { label: t("modal.quick_30min"), minutes: 30 },
    { label: t("modal.quick_1hr"), minutes: 60 },
  ]

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDateInput, setStartDateInput] = useState("")
  const [startTimeInput, setStartTimeInput] = useState("")
  const [endDateInput, setEndDateInput] = useState("")
  const [endTimeInput, setEndTimeInput] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!open) return
    if (isEdit && entry) {
      setTitle(entry.taskName)
      setDescription(entry.description)
      setStartDateInput(toDateInputValue(entry.startTime))
      setStartTimeInput(toTimeInputValue(entry.startTime))
      setEndDateInput(toDateInputValue(entry.endTime))
      setEndTimeInput(toTimeInputValue(entry.endTime))
      setDeleteConfirm(false)
    } else if (isManual) {
      setTitle("")
      setDescription("")
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      setStartDateInput(toDateInputValue(oneHourAgo))
      setStartTimeInput(toTimeInputValue(oneHourAgo))
      setEndDateInput(toDateInputValue(now))
      setEndTimeInput(toTimeInputValue(now))
    } else {
      setTitle("")
      setDescription("")
    }
  }, [open, isEdit, isManual, entry])

  const editedStartTime = isEditLike ? combineDateTime(startDateInput, startTimeInput) : null
  const editedEndTime = isEditLike ? combineDateTime(endDateInput, endTimeInput) : null
  const isTimeValid =
    !isEditLike ||
    (editedStartTime !== null &&
      editedEndTime !== null &&
      editedEndTime.getTime() > editedStartTime.getTime())
  const editedDuration =
    editedStartTime && editedEndTime
      ? Math.max(0, Math.floor((editedEndTime.getTime() - editedStartTime.getTime()) / 1000))
      : 0


  const applyQuickSpan = (minutes: number) => {
    const start = combineDateTime(startDateInput, startTimeInput)
    if (!start) return
    const end = new Date(start.getTime() + minutes * 60 * 1000)
    setEndDateInput(toDateInputValue(end))
    setEndTimeInput(toTimeInputValue(end))
  }

  const handleSubmit = () => {
    if (!title.trim() || !isTimeValid) return
    if (mode === "start") {
      onStart?.(title.trim(), description.trim())
    } else if (isEdit && entry && editedStartTime && editedEndTime) {
      onSave?.({
        ...entry,
        taskName: title.trim(),
        description: description.trim(),
        startTime: editedStartTime,
        endTime: editedEndTime,
        duration: editedDuration,
      })
    } else if (isManual && editedStartTime && editedEndTime) {
      onSave?.({
        id: crypto.randomUUID(),
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
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEdit && (
                <>
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                    <Pencil className="size-4 text-primary" />
                  </div>
                  {t("modal.edit_title")}
                </>
              )}
              {isManual && (
                <>
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                    <TimerIcon className="size-4 text-primary" />
                  </div>
                  {t("modal.manual_title")}
                </>
              )}
              {mode === "start" && (
                <>
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                    <Play className="size-4 text-primary fill-primary" />
                  </div>
                  {t("modal.start_title")}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEdit && t("modal.edit_desc")}
              {isManual && t("modal.manual_desc")}
              {mode === "start" && t("modal.start_desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {isEditLike && (
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label>{t("modal.label_started")}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={startDateInput}
                        onChange={(e) => setStartDateInput(e.target.value)}
                        className="flex-1 dark:[color-scheme:dark]"
                      />
                      <Input
                        type="time"
                        value={startTimeInput}
                        onChange={(e) => setStartTimeInput(e.target.value)}
                        className="w-28 dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="grid grid-cols-4 gap-2">
                      {QUICK_SPANS.map(({ label, minutes }) => (
                        <Button
                          key={minutes}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyQuickSpan(minutes)}
                          className="w-full"
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>{t("modal.label_stopped")}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={endDateInput}
                        onChange={(e) => setEndDateInput(e.target.value)}
                        className="flex-1 dark:[color-scheme:dark]"
                      />
                      <Input
                        type="time"
                        value={endTimeInput}
                        onChange={(e) => setEndTimeInput(e.target.value)}
                        className="w-28 dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {isTimeValid && editedDuration > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{t("modal.label_duration")}</span>
                      <Badge variant="secondary" className="ml-auto font-mono text-xs">
                        {formatDuration(editedDuration)}
                      </Badge>
                    </div>
                  )}

                  {!isTimeValid && startDateInput && endDateInput && (
                    <p className="text-xs text-destructive">{t("modal.time_error")}</p>
                  )}
                </div>

                <Separator />
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-title">{t("modal.label_title")} <span className="text-destructive">*</span></Label>
              <Input
                id="task-title"
                placeholder={t("modal.placeholder_title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
                autoFocus={!isEdit}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-desc">{t("modal.label_description")}</Label>
              <Textarea
                id="task-desc"
                placeholder={t("modal.placeholder_desc")}
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
                {t("modal.btn_delete")}
              </Button>
            )}
            <Button variant="outline" onClick={onCancel}>
              {t("modal.btn_cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !isTimeValid}
              className="gap-1.5"
            >
              {isEdit && (
                <>
                  <Pencil className="size-3.5" />
                  {t("modal.btn_save")}
                </>
              )}
              {isManual && (
                <>
                  <TimerIcon className="size-3.5" />
                  {t("modal.btn_log")}
                </>
              )}
              {mode === "start" && (
                <>
                  <Play className="size-3.5 fill-current" />
                  {t("modal.btn_start")}
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
              <AlertDialogTitle>{t("modal.delete_confirm_title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("modal.delete_confirm_desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("modal.delete_confirm_cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("modal.delete_confirm_action")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
