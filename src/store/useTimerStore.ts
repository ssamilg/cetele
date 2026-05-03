import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import { createIdbStorage } from "@/lib/db"
import { syncLogsToSheet } from "@/lib/googleSheets"
import type { ActiveTask, TimeRecord, TimerState } from "@/types"

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
}

type PersistedState = TimerStoreState & Pick<SyncStoreState, "spreadsheetId"> & PrefsStoreState

interface TimerStoreActions {
  startTimer: (taskName: string, description: string) => void
  stopTimer: (taskName: string, description: string) => void
  updateEntry: (entry: TimeRecord) => void
  deleteEntry: (id: string) => void
  setGoogleAccessToken: (token: string | null) => void
  setSpreadsheetId: (id: string | null) => void
  setHourlyRate: (rate: number) => void
}

type TimerStore = TimerStoreState & SyncStoreState & PrefsStoreState & TimerStoreActions

const initialTimer: TimerState = {
  isRunning: false,
  activeTask: null,
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      records: [],
      timer: initialTimer,
      googleAccessToken: sessionStorage.getItem("cetele-google-token"),
      spreadsheetId: null,
      hourlyRate: 0,

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
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate,
          ).catch(() => {
            toast.error("Background sync failed, but local data is safe")
          })
        }
      },

      updateEntry: (entry) => {
        const state = get()
        const updatedRecords = state.records.map((r) => (r.id === entry.id ? entry : r))
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          syncLogsToSheet(
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate,
          ).catch(() => {
            toast.error("Background sync failed, but local data is safe")
          })
        }
      },

      deleteEntry: (id) => {
        const state = get()
        const updatedRecords = state.records.filter((r) => r.id !== id)
        set({ records: updatedRecords })
        if (state.googleAccessToken && state.spreadsheetId) {
          syncLogsToSheet(
            updatedRecords, state.googleAccessToken, state.spreadsheetId, state.hourlyRate,
          ).catch(() => {
            toast.error("Background sync failed, but local data is safe")
          })
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
    }),
    {
      name: "cetele-store",
      storage: createIdbStorage<PersistedState>(() => {
        toast.error("Failed to save time record locally")
      }),
      partialize: (state): PersistedState => ({
        records: state.records,
        timer: state.timer,
        spreadsheetId: state.spreadsheetId,
        hourlyRate: state.hourlyRate,
      }),
    },
  ),
)
