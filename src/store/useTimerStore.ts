import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import i18n from "@/i18n"
import { createIdbStorage } from "@/lib/db"
import { syncLogsToSheet, GoogleSheetsError } from "@/lib/googleSheets"
import type { ActiveTask, TimeRecord, TimerState } from "@/types"

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
  startTimer: (taskName: string, description: string) => void
  stopTimer: (taskName: string, description: string) => void
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

      return ({
      records: [],
      timer: initialTimer,
      googleAccessToken: sessionStorage.getItem("cetele-google-token"),
      spreadsheetId: null,
      hourlyRate: 0,
      currency: "USD" as Currency,

      startTimer: (taskName, description) => {
        const activeTask: ActiveTask = { taskName, description, startTime: new Date() }
        set({ timer: { isRunning: true, activeTask } })
      },

      stopTimer: (taskName, description) => {
        const state = get()
        if (!state.timer.activeTask) return

        const endTime = new Date()
        const duration = Math.floor(
          (endTime.getTime() - state.timer.activeTask.startTime.getTime()) / 1000,
        )
        const entry: TimeRecord = {
          id: crypto.randomUUID(),
          taskName,
          description,
          startTime: state.timer.activeTask.startTime,
          endTime,
          duration,
        }

        const updatedRecords = [...state.records, entry]
        set({ records: updatedRecords, timer: initialTimer })

        if (state.googleAccessToken && state.spreadsheetId) {
          syncLogsToSheet(
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate, state.currency,
          ).catch(handleSyncError)
        }
      },

      addEntry: (entry) => {
        const state = get()
        const updatedRecords = [...state.records, entry]
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          syncLogsToSheet(
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate, state.currency,
          ).catch(handleSyncError)
        }
      },

      updateEntry: (entry) => {
        const state = get()
        const updatedRecords = state.records.map((r) => (r.id === entry.id ? entry : r))
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          syncLogsToSheet(
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate, state.currency,
          ).catch(handleSyncError)
        }
      },

      deleteEntry: (id) => {
        const state = get()
        const updatedRecords = state.records.filter((r) => r.id !== id)
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          syncLogsToSheet(
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate, state.currency,
          ).catch(handleSyncError)
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
    },
  ),
)
