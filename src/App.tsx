import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { Download, Sheet } from "lucide-react"
import { Navbar } from "@/components/timer/Navbar"
import { TaskFormModal } from "@/components/timer/TaskFormModal"
import { GoogleOAuthModal } from "@/components/sync/GoogleOAuthModal"
import { DailyStats } from "@/components/DailyStats"
import { WorkLogTable } from "@/components/logs/WorkLogTable"
import { LandingPage } from "@/components/LandingPage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { exportToCsv } from "@/lib/exporters"
import { useTimerStore, CURRENCY_SYMBOLS } from "@/store/useTimerStore"
import type { TimeRecord } from "@/types"

export function App() {
  const records = useTimerStore((s) => s.records)
  const isRunning = useTimerStore((s) => s.timer.isRunning)
  const activeTask = useTimerStore((s) => s.timer.activeTask)
  const startTimer = useTimerStore((s) => s.startTimer)
  const stopTimer = useTimerStore((s) => s.stopTimer)
  const addEntry = useTimerStore((s) => s.addEntry)
  const updateEntry = useTimerStore((s) => s.updateEntry)
  const deleteEntry = useTimerStore((s) => s.deleteEntry)
  const hourlyRate = useTimerStore((s) => s.hourlyRate)
  const setHourlyRate = useTimerStore((s) => s.setHourlyRate)
  const currency = useTimerStore((s) => s.currency)

  const [isAppEntered, setIsAppEntered] = useState(false)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [manualModalOpen, setManualModalOpen] = useState(false)
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

  const handleSaveManualEntry = (entry: TimeRecord) => {
    addEntry(entry)
    setManualModalOpen(false)
  }

  return (
    <AnimatePresence mode="wait">
      {!isAppEntered ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <LandingPage onEnter={() => setIsAppEntered(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-svh bg-background flex flex-col"
        >
      <Navbar onStartStop={handleStartStopClick} onManualEntry={() => setManualModalOpen(true)} />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8 pb-16 flex flex-col">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Time Log</h1>
              <p className="text-sm text-muted-foreground">
                Track and review all your logged work sessions.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center rounded-md border border-border overflow-hidden h-8 text-sm bg-background">
                <span className="px-2.5 text-muted-foreground border-r border-border h-full flex items-center select-none">
                  {CURRENCY_SYMBOLS[currency]}
                </span>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={hourlyRate || ""}
                  onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                  className="w-20 border-0 rounded-none h-full shadow-none px-2 focus-visible:ring-0
                    [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="px-2 text-muted-foreground border-l border-border h-full flex items-center text-xs select-none">
                  /hr
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    exportToCsv(records, hourlyRate, currency)
                    toast.success("Logs exported as CSV")
                  } catch {
                    toast.error("Failed to export logs")
                  }
                }}
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

          <DailyStats />
          <WorkLogTable entries={records} onEdit={handleEditEntry} hourlyRate={hourlyRate} />
        </div>
      </main>

      <TaskFormModal
        open={taskModalOpen}
        mode="start"
        onStart={handleStart}
        onCancel={() => setTaskModalOpen(false)}
      />

      <TaskFormModal
        open={manualModalOpen}
        mode="manual"
        onSave={handleSaveManualEntry}
        onCancel={() => setManualModalOpen(false)}
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

        <footer className="fixed bottom-0 inset-x-0 h-9 border-t border-border bg-card flex items-center px-6">
          <span className="flex-1 text-xs text-muted-foreground">v1.0</span>
          <span className="text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://ssamilg.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              SSG
            </a>
            {" "}with ❤️
          </span>
          <span className="flex-1" />
        </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
