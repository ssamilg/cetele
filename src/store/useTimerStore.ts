import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import i18n from "@/i18n"
import { createIdbStorage } from "@/lib/db"
import { syncLogsToSheet, GoogleSheetsError } from "@/lib/googleSheets"
import type { ActiveTask, RecordType, TimeRecord, TimerState } from "@/types"
import { normalizeRecordType } from "@/types"

export type Currency = "USD" | "EUR" | "TRY"
export const CURRENCY_LABELS: Record<Currency, string> = { USD: "USD", EUR: "EUR", TRY: "TL" }
export const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", TRY: "₺" }

interface TimerStoreState {
  records: TimeRecord[]
  timer: TimerState
}

interface SyncStoreState {
  googleAccessToken: string | null
  spreadsheetId: string | null
}

interface PrefsStoreState {
  hourlyRate: number
  currency: Currency
}

type PersistedState = TimerStoreState & Pick<SyncStoreState, "spreadsheetId"> & PrefsStoreState

interface TimerStoreActions {
  startTimer: (taskName: string, description?: string, type?: RecordType) => void
  updateActiveTask: (taskName: string, description: string, type: RecordType) => void
  stopTimer: (details: {
    taskName: string
    description: string
    type: RecordType
    startTime: Date
    endTime: Date
  }) => void
  addEntry: (entry: TimeRecord) => void
  updateEntry: (entry: TimeRecord) => void
  deleteEntry: (id: string) => void
  setGoogleAccessToken: (token: string | null) => void
  setSpreadsheetId: (id: string | null) => void
  setHourlyRate: (rate: number) => void
  setCurrency: (currency: Currency) => void
}

type TimerStore = TimerStoreState & SyncStoreState & PrefsStoreState & TimerStoreActions

const initialTimer: TimerState = {
  isRunning: false,
  activeTask: null,
}

function isClientError(err: unknown): boolean {
  return err instanceof GoogleSheetsError && err.status >= 400 && err.status < 500
}

let backgroundSheetSyncTimer: ReturnType<typeof setTimeout> | null = null
const BACKGROUND_SHEET_SYNC_MS = 3000

export function cancelDebouncedBackgroundSheetSync(): void {
  if (backgroundSheetSyncTimer !== null) {
    clearTimeout(backgroundSheetSyncTimer)
    backgroundSheetSyncTimer = null
  }
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => {
      const disconnectGoogle = () => {
        sessionStorage.removeItem("cetele-google-token")
        set({ googleAccessToken: null })
        toast.error(i18n.t("toast.sync_expired"), { duration: 6000 })
      }

      const handleSyncError = (err: unknown) => {
        if (isClientError(err)) {
          disconnectGoogle()
        } else {
          toast.error(i18n.t("toast.sync_background_failed"))
        }
      }

      const queueBackgroundSheetSync = () => {
        if (backgroundSheetSyncTimer !== null) {
          clearTimeout(backgroundSheetSyncTimer)
        }
        backgroundSheetSyncTimer = setTimeout(() => {
          backgroundSheetSyncTimer = null
          const state = get()
          if (!state.googleAccessToken || !state.spreadsheetId) return
          void syncLogsToSheet(
            state.records,
            state.googleAccessToken,
            state.spreadsheetId,
            state.hourlyRate,
            state.currency,
          ).catch(handleSyncError)
        }, BACKGROUND_SHEET_SYNC_MS)
      }

      return ({
      records: [],
      timer: initialTimer,
      googleAccessToken: sessionStorage.getItem("cetele-google-token"),
      spreadsheetId: null,
      hourlyRate: 0,
      currency: "USD" as Currency,

      startTimer: (taskName, description = "", type = "work") => {
        const activeTask: ActiveTask = {
          taskName,
          description,
          type: normalizeRecordType(type),
          startTime: new Date(),
        }
        set({ timer: { isRunning: true, activeTask } })
      },

      updateActiveTask: (taskName, description, type) => {
        const state = get()
        if (!state.timer.activeTask) {
          return
        }
        set({
          timer: {
            isRunning: true,
            activeTask: {
              ...state.timer.activeTask,
              taskName,
              description,
              type: normalizeRecordType(type),
            },
          },
        })
      },

      stopTimer: ({ taskName, description, type, startTime, endTime }) => {
        const state = get()
        if (!state.timer.activeTask) {
          return
        }

        const duration = Math.max(
          0,
          Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
        )
        const entry: TimeRecord = {
          id: crypto.randomUUID(),
          taskName,
          description,
          type: normalizeRecordType(type),
          startTime,
          endTime,
          duration,
        }

        const updatedRecords = [...state.records, entry]
        set({ records: updatedRecords, timer: initialTimer })

        if (state.googleAccessToken && state.spreadsheetId) {
          queueBackgroundSheetSync()
        }
      },

      addEntry: (entry) => {
        const state = get()
        const updatedRecords = [...state.records, entry]
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          queueBackgroundSheetSync()
        }
      },

      updateEntry: (entry) => {
        const state = get()
        const updatedRecords = state.records.map((r) => (r.id === entry.id ? entry : r))
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          queueBackgroundSheetSync()
        }
      },

      deleteEntry: (id) => {
        const state = get()
        const updatedRecords = state.records.filter((r) => r.id !== id)
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          queueBackgroundSheetSync()
        }
      },

      setGoogleAccessToken: (token) => {
        if (token) {
          sessionStorage.setItem("cetele-google-token", token)
        } else {
          sessionStorage.removeItem("cetele-google-token")
        }
        set({ googleAccessToken: token })
      },

      setSpreadsheetId: (id) => {
        set({ spreadsheetId: id })
      },

      setHourlyRate: (rate) => {
        set({ hourlyRate: rate })
      },

      setCurrency: (currency) => {
        set({ currency })
      },
    })},
    {
      name: "cetele-store",
      storage: createIdbStorage<PersistedState>(() => {
        toast.error(i18n.t("toast.save_failed"))
      }),
      partialize: (state): PersistedState => ({
        records: state.records,
        timer: state.timer,
        spreadsheetId: state.spreadsheetId,
        hourlyRate: state.hourlyRate,
        currency: state.currency,
      }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<PersistedState>
        const records = (stored.records ?? []).map((record) => ({
          ...record,
          type: normalizeRecordType(record.type),
        }))
        const activeTask = stored.timer?.activeTask
          ? {
              ...stored.timer.activeTask,
              type: normalizeRecordType(stored.timer.activeTask.type),
            }
          : null
        const timer = stored.timer
          ? { ...stored.timer, activeTask }
          : current.timer

        return {
          ...current,
          ...stored,
          records,
          timer,
        }
      },
    },
  ),
)
