import i18n from "@/i18n"

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

export function formatDateTime(date: Date): string {
  return (
    date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  )
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const uh = i18n.t("fmt.h")
  const um = i18n.t("fmt.m")
  const us = i18n.t("fmt.s")
  if (h > 0) return `${h}${uh} ${m}${um}`
  if (m > 0) return `${m}${um} ${s}${us}`
  return `${s}${us}`
}

export function formatClock(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
}
