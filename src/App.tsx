import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { TaskFormModal } from "@/components/TaskFormModal"
import { GoogleOAuthModal } from "@/components/GoogleOAuthModal"
import { WorkLogTable } from "@/components/WorkLogTable"
import { EditEntryModal } from "@/components/EditEntryModal"
import type { ActiveTask, WorkEntry } from "@/types"

function exportToCsv(entries: WorkEntry[]) {
  const rows = [
    ["Title", "Description", "Start", "End", "Duration (min)"],
    ...entries.map((e) => [
      e.title,
      e.description,
      e.startTime.toISOString(),
      e.endTime.toISOString(),
      String(Math.round(e.duration / 60)),
    ]),
  ]
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `timetrack-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [entries, setEntries] = useState<WorkEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState<"start" | "stop">("start")
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning && activeTask && !taskModalOpen) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - activeTask.startTime.getTime()) / 1000))
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (!isRunning) setElapsed(0)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, activeTask, taskModalOpen])

  const handleStartStopClick = () => {
    if (isRunning) {
      setTaskModalMode("stop")
    } else {
      setTaskModalMode("start")
    }
    setTaskModalOpen(true)
  }

  const handleStart = (title: string, description: string) => {
    const task: ActiveTask = { title, description, startTime: new Date() }
    setActiveTask(task)
    setIsRunning(true)
    setElapsed(0)
    setTaskModalOpen(false)
  }

  const handleStop = (title: string, description: string) => {
    if (!activeTask) return
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - activeTask.startTime.getTime()) / 1000)
    const entry: WorkEntry = {
      id: crypto.randomUUID(),
      title,
      description,
      startTime: activeTask.startTime,
      endTime,
      duration,
    }
    setEntries((prev) => [...prev, entry])
    setIsRunning(false)
    setActiveTask(null)
    setElapsed(0)
    setTaskModalOpen(false)
  }

  const handleEditEntry = (entry: WorkEntry) => {
    setEditingEntry(entry)
    setEditModalOpen(true)
  }

  const handleSaveEntry = (entry: WorkEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)))
    setEditModalOpen(false)
    setEditingEntry(null)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setEditModalOpen(false)
    setEditingEntry(null)
  }

  const handleExport = () => {
    exportToCsv(entries)
  }

  return (
    <div className="min-h-svh bg-background">
      <Navbar
        isRunning={isRunning}
        elapsed={elapsed}
        activeTitle={activeTask?.title ?? null}
        onStartStop={handleStartStopClick}
        onExport={handleExport}
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

          <WorkLogTable entries={entries} onEdit={handleEditEntry} />
        </div>
      </main>

      <TaskFormModal
        open={taskModalOpen}
        mode={taskModalMode}
        activeTask={activeTask}
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
