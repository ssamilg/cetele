import { useState } from "react"
import { Navbar } from "@/components/timer/Navbar"
import { TaskFormModal } from "@/components/timer/TaskFormModal"
import { GoogleOAuthModal } from "@/components/sync/GoogleOAuthModal"
import { WorkLogTable } from "@/components/logs/WorkLogTable"
import { EditEntryModal } from "@/components/logs/EditEntryModal"
import { useTimerStore } from "@/store/useTimerStore"
import type { TimeRecord } from "@/types"

export function App() {
  const records = useTimerStore((s) => s.records)
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const startTimer = useTimerStore((s) => s.startTimer)
  const stopTimer = useTimerStore((s) => s.stopTimer)
  const updateEntry = useTimerStore((s) => s.updateEntry)
  const deleteEntry = useTimerStore((s) => s.deleteEntry)

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState<"start" | "stop">("start")
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeRecord | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleStartStopClick = () => {
    setTaskModalMode(isRunning ? "stop" : "start")
    setTaskModalOpen(true)
  }

  const handleStart = (taskName: string, description: string) => {
    startTimer(taskName, description)
    setTaskModalOpen(false)
  }

  const handleStop = (taskName: string, description: string) => {
    stopTimer(taskName, description)
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
    <div className="min-h-svh bg-background">
      <Navbar
        onStartStop={handleStartStopClick}
        onSync={() => setGoogleModalOpen(true)}
      />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Time Log</h1>
            <p className="text-sm text-muted-foreground">
              Track and review all your logged work sessions.
            </p>
          </div>

          <WorkLogTable entries={records} onEdit={handleEditEntry} />
        </div>
      </main>

      <TaskFormModal
        open={taskModalOpen}
        mode={taskModalMode}
        onStart={handleStart}
        onStop={handleStop}
        onCancel={() => setTaskModalOpen(false)}
      />

      <GoogleOAuthModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSynced={() => setGoogleModalOpen(false)}
      />

      <EditEntryModal
        open={editModalOpen}
        entry={editingEntry}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        onCancel={() => { setEditModalOpen(false); setEditingEntry(null) }}
      />
    </div>
  )
}
