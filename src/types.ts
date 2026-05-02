export interface TimeRecord {
  id: string
  taskName: string
  description: string
  startTime: Date
  endTime: Date
  duration: number
}

export interface ActiveTask {
  taskName: string
  description: string
  startTime: Date
}

export interface TimerState {
  isRunning: boolean
  activeTask: ActiveTask | null
}
