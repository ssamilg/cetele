import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createIdbStorage } from "@/lib/db"
import type { ActiveTask, TimeRecord, TimerState } from "@/types"

interface TimerStoreState {
  records: TimeRecord[]
  timer: TimerState
}

interface TimerStoreActions {
  startTimer: (taskName: string, description: string) => void
  stopTimer: (taskName: string, description: string) => void
  updateEntry: (entry: TimeRecord) => void
  deleteEntry: (id: string) => void
}

type TimerStore = TimerStoreState & TimerStoreActions

const initialTimer: TimerState = {
  isRunning: false,
  activeTask: null,
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      records: [],
      timer: initialTimer,

      startTimer: (taskName, description) => {
        const activeTask: ActiveTask = { taskName, description, startTime: new Date() }
        set({ timer: { isRunning: true, activeTask } })
      },

      stopTimer: (taskName, description) => {
        set((state) => {
          if (!state.timer.activeTask) return state
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
          return { records: [...state.records, entry], timer: initialTimer }
        })
      },

      updateEntry: (entry) => {
        set((state) => ({
          records: state.records.map((r) => (r.id === entry.id ? entry : r)),
        }))
      },

      deleteEntry: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }))
      },
    }),
    {
      name: "cetele-store",
      storage: createIdbStorage<TimerStoreState>(),
      partialize: (state): TimerStoreState => ({
        records: state.records,
        timer: state.timer,
      }),
    },
  ),
)
