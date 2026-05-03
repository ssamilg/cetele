import { useState } from "react"
import { Download, Sheet } from "lucide-react"
import { Navbar } from "@/components/timer/Navbar"
import { TaskFormModal } from "@/components/timer/TaskFormModal"
import { GoogleOAuthModal } from "@/components/sync/GoogleOAuthModal"
import { WorkLogTable } from "@/components/logs/WorkLogTable"
import { Button } from "@/components/ui/button"
import { exportToCsv } from "@/lib/exporters"
import { useTimerStore } from "@/store/useTimerStore"
import type { TimeRecord } from "@/types"

export function App() {
  const records = useTimerStore((s) => s.records)
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const startTimer = useTimerStore((s) => s.startTimer)
  const stopTimer = useTimerStore((s) => s.stopTimer)
  const updateEntry = useTimerStore((s) => s.updateEntry)
  const deleteEntry = useTimerStore((s) => s.deleteEntry)

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeRecord | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleStartStopClick = () => {
    if (isRunning && activeTask) {
      stopTimer(activeTask.taskName, activeTask.description)
    } else {
      setTaskModalOpen(true)
    }
  }

  const handleStart = (taskName: string, description: string) => {
    startTimer(taskName, description)
    setTaskModalOpen(false)
  }

  const handleEditEntry = (entry: TimeRecord) => {
    setEditingEntry(entry)
    setEditModalOpen(true)
  }

  const handleSaveEntry = (entry: TimeRecord) => {
    updateEntry(entry)
    setEditModalOpen(false)
    setEditingEntry(null)
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
    setEditModalOpen(false)
    setEditingEntry(null)
  }

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <Navbar onStartStop={handleStartStopClick} />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Time Log</h1>
              <p className="text-sm text-muted-foreground">
                Track and review all your logged work sessions.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCsv(records)}
                className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700
                  dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
              >
                <Download className="size-3.5" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGoogleModalOpen(true)}
                className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700
                  dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-300"
              >
                <Sheet className="size-3.5" />
                Sync Sheets
              </Button>
            </div>
          </div>

          <WorkLogTable entries={records} onEdit={handleEditEntry} />
        </div>
      </main>

      <TaskFormModal
        open={taskModalOpen}
        mode="start"
        onStart={handleStart}
        onCancel={() => setTaskModalOpen(false)}
      />

      <GoogleOAuthModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
      />

      <TaskFormModal
        open={editModalOpen}
        mode="edit"
        entry={editingEntry}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        onCancel={() => { setEditModalOpen(false); setEditingEntry(null) }}
      />
    </div>
  )
}
