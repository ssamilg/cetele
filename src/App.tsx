import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Download, Sheet } from "lucide-react"
import { Navbar } from "@/components/timer/Navbar"
import { TaskFormModal } from "@/components/timer/TaskFormModal"
import { GoogleOAuthModal } from "@/components/sync/GoogleOAuthModal"
import { DailyStats } from "@/components/DailyStats"
import { DayFilter } from "@/components/DayFilter"
import { WorkLogTable } from "@/components/table/WorkLogTable"
import { LandingPage } from "@/components/LandingPage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { exportToCsv } from "@/lib/exporters"
import { ALL_DAYS_KEY, toDateKey, todayDateKey } from "@/lib/formatters"
import {
  useTimerStore,
  CURRENCY_SYMBOLS,
  cancelDebouncedBackgroundSheetSync,
} from "@/store/useTimerStore"
import type { TimeRecord } from "@/types"

const APP_ENTERED_STORAGE_KEY = "cetele-app-entered"

function readAppEnteredFromStorage(): boolean {
  let entered = false
  try {
    entered = localStorage.getItem(APP_ENTERED_STORAGE_KEY) === "1"
  } catch {
    entered = false
  }
  return entered
}

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

  const { t } = useTranslation()
  const [isAppEntered, setIsAppEntered] = useState(readAppEnteredFromStorage)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [manualModalOpen, setManualModalOpen] = useState(false)
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeRecord | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedDayKey, setSelectedDayKey] = useState(ALL_DAYS_KEY)

  const filteredRecords = useMemo(
    () =>
      selectedDayKey === ALL_DAYS_KEY
        ? records
        : records.filter((r) => toDateKey(r.startTime) === selectedDayKey),
    [records, selectedDayKey],
  )

  useEffect(() => {
    return () => {
      cancelDebouncedBackgroundSheetSync()
    }
  }, [])

  useEffect(() => {
    if (selectedDayKey === ALL_DAYS_KEY) {
      return
    }
    const todayKey = todayDateKey()
    if (selectedDayKey === todayKey) {
      return
    }
    const hasDay = records.some((r) => toDateKey(r.startTime) === selectedDayKey)
    if (!hasDay) {
      setSelectedDayKey(ALL_DAYS_KEY)
    }
  }, [records, selectedDayKey])

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

  const handleLandingEnter = () => {
    try {
      localStorage.setItem(APP_ENTERED_STORAGE_KEY, "1")
    } catch {
    }
    setIsAppEntered(true)
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
          <LandingPage onEnter={handleLandingEnter} />
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

      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col px-4 py-6 pb-16 md:px-6 md:pt-8">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{t("app.title")}</h1>
              <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
                {t("app.description")}
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2 md:shrink-0">
              <div
                className="flex h-8 items-center overflow-hidden rounded-md border border-border
                  bg-background text-sm transition-[box-shadow,border-color]
                  focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
              >
                <span
                  className="flex h-full items-center border-r border-border px-2.5
                    text-muted-foreground select-none"
                  aria-hidden="true"
                >
                  {CURRENCY_SYMBOLS[currency]}
                </span>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  aria-label={t("app.rate_aria")}
                  value={hourlyRate || ""}
                  onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                  className="h-full w-20 rounded-none border-0 px-2 shadow-none
                    focus-visible:ring-0
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span
                  className="flex h-full items-center border-l border-border px-2
                    text-xs text-muted-foreground select-none"
                  aria-hidden="true"
                >
                  {t("app.rate_suffix")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    exportToCsv(records, hourlyRate, currency)
                    toast.success(t("toast.export_success"))
                  } catch {
                    toast.error(t("toast.export_failed"))
                  }
                }}
                className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700
                  dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
              >
                <Download className="size-3.5" />
                {t("app.export")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGoogleModalOpen(true)}
                className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700
                  dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-300"
              >
                <Sheet className="size-3.5" />
                {t("app.sync_sheets")}
              </Button>
            </div>
          </div>

          <DailyStats selectedDayKey={selectedDayKey} />
          <div className="flex flex-col gap-6">
            <DayFilter
              records={records}
              selectedDayKey={selectedDayKey}
              onSelectDay={setSelectedDayKey}
            />
            <WorkLogTable
              entries={filteredRecords}
              onEdit={handleEditEntry}
              hourlyRate={hourlyRate}
              emptyTitle={
                selectedDayKey !== ALL_DAYS_KEY && records.length > 0
                  ? t("day_filter.empty_day_title")
                  : undefined
              }
              emptyDescription={
                selectedDayKey !== ALL_DAYS_KEY && records.length > 0
                  ? t("day_filter.empty_day_desc")
                  : undefined
              }
            />
          </div>
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

        <footer
          className="fixed inset-x-0 bottom-0 z-40 flex h-9 items-center border-t border-border
            bg-card/95 px-3 backdrop-blur-md supports-backdrop-filter:bg-card/80 md:px-6"
        >
          <span className="flex-1 text-xs text-muted-foreground tabular-nums">v1.0</span>
          <span className="text-xs text-muted-foreground">
            {t("app.footer_made_by")}{" "}
            <a
              href="https://ssamilg.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              SSG
            </a>
            {" "}{t("app.footer_with_love")}
          </span>
          <span className="flex-1" />
        </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
