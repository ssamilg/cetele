import { useEffect, useState } from "react"
import { CreditCard as Edit2, Trash2 } from "lucide-react"
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
import type { WorkEntry } from "@/types"

interface EditEntryModalProps {
  open: boolean
  entry: WorkEntry | null
  onSave: (entry: WorkEntry) => void
  onDelete: (id: string) => void
  onCancel: () => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

export function EditEntryModal({ open, entry, onSave, onDelete, onCancel }: EditEntryModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open && entry) {
      setTitle(entry.title)
      setDescription(entry.description)
      setDeleteConfirm(false)
    }
  }, [open, entry])

  const handleSave = () => {
    if (!entry || !title.trim()) return
    onSave({
      ...entry,
      title: title.trim(),
      description: description.trim(),
    })
  }

  const handleDelete = () => {
    if (!entry) return
    onDelete(entry.id)
    setDeleteConfirm(false)
  }

  if (!entry) return null

  return (
    <>
      <Dialog open={open && !deleteConfirm} onOpenChange={(o) => { if (!o) onCancel() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Edit2 className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              Edit Entry
            </DialogTitle>
            <DialogDescription>
              Modify the task details for this time entry.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Entry metadata */}
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium">{formatTime(entry.startTime)}</span>
                  <span className="text-muted-foreground/70">{formatDateTime(entry.startTime)}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">Stopped</span>
                  <span className="font-medium">{formatTime(entry.endTime)}</span>
                  <span className="text-muted-foreground/70">{formatDateTime(entry.endTime)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirm(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 mr-auto"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
