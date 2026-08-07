export type RecordType = "work" | "meet"

export const DEFAULT_RECORD_TYPE: RecordType = "work"
export const ALL_TYPES_KEY = "all" as const
export type TypeFilterKey = RecordType | typeof ALL_TYPES_KEY

export function normalizeRecordType(type: unknown): RecordType {
  let result: RecordType = DEFAULT_RECORD_TYPE
  if (type === "meet") {
    result = "meet"
  }
  return result
}

export interface TimeRecord {
  id: string
  taskName: string
  description: string
  type: RecordType
  startTime: Date
  endTime: Date
  duration: number
}

export interface ActiveTask {
  taskName: string
  description: string
  type: RecordType
  startTime: Date
}

export interface TimerState {
  isRunning: boolean
  activeTask: ActiveTask | null
}
