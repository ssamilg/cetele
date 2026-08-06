import i18n from "@/i18n"

function appLocale(): string {
  return i18n.language?.startsWith("tr") ? "tr-TR" : "en-US"
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function todayDateKey(): string {
  return toDateKey(new Date())
}

export const ALL_DAYS_KEY = "all"

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(appLocale(), {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

export function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString(appLocale(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString(appLocale(), { month: "short", day: "numeric" })
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString(appLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateTime(date: Date): string {
  return (
    date.toLocaleDateString(appLocale(), {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(appLocale(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  )
}

export function formatSessionDateRange(start: Date, end: Date): string {
  const locale = appLocale()
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  let result = ""
  if (sameDay) {
    result = start.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } else {
    const sameYear = start.getFullYear() === end.getFullYear()
    if (sameYear) {
      const startStr = start.toLocaleDateString(locale, { month: "short", day: "numeric" })
      const endStr = end.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      result = `${startStr} - ${endStr}`
    } else {
      const opts = { month: "short" as const, day: "numeric" as const, year: "numeric" as const }
      result = `${start.toLocaleDateString(locale, opts)} - ${end.toLocaleDateString(locale, opts)}`
    }
  }
  return result
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const uh = i18n.t("fmt.h")
  const um = i18n.t("fmt.m")
  const us = i18n.t("fmt.s")
  let out = ""
  if (h > 0) {
    const parts = [`${h}${uh}`]
    if (m > 0) {
      parts.push(`${m}${um}`)
    } else if (s > 0) {
      parts.push(`${s}${us}`)
    }
    out = parts.join(" ")
  } else if (m > 0) {
    out = s > 0 ? `${m}${um} ${s}${us}` : `${m}${um}`
  } else {
    out = `${s}${us}`
  }
  return out
}

export function formatClock(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const sec = seconds % 60
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":")
}
