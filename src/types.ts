export interface WorkEntry {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  duration: number // in seconds
}

export interface ActiveTask {
  title: string
  description: string
  startTime: Date
}
