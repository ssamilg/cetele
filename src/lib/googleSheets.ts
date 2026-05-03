import type { TimeRecord } from "@/types"
import { formatDateTime, formatDuration } from "@/lib/formatters"
import type { Currency } from "@/store/useTimerStore"
import { CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/store/useTimerStore"

export class GoogleSheetsError extends Error {
  readonly status: number
  constructor(status: number, statusText: string) {
    super(`Google Sheets API error: ${status} ${statusText}`)
    this.name = "GoogleSheetsError"
    this.status = status
  }
}

const BASE_HEADERS = ["Task", "Description", "Started", "Stopped", "Duration"]

function buildRows(records: TimeRecord[], hourlyRate: number, currency: Currency): string[][] {
  const hasRate = hourlyRate > 0
  return records.map((r) => {
    const earned = hasRate
      ? `${CURRENCY_SYMBOLS[currency]}${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((r.duration / 3600) * hourlyRate)}`
      : null
    return [
      r.taskName,
      r.description || "No description",
      formatDateTime(r.startTime),
      formatDateTime(r.endTime),
      formatDuration(r.duration),
      ...(hasRate ? [earned!] : []),
    ]
  })
}

async function sheetsRequest(
  url: string,
  method: string,
  token: string,
  body?: unknown,
): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new GoogleSheetsError(response.status, response.statusText)
  }
}

export async function createCeteleSheet(token: string): Promise<string> {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties: { title: "Cetele Logs" } }),
  })

  if (!response.ok) {
    throw new GoogleSheetsError(response.status, response.statusText)
  }

  const data = (await response.json()) as { spreadsheetId: string }
  return data.spreadsheetId
}

export async function syncLogsToSheet(
  records: TimeRecord[],
  token: string,
  sheetId: string,
  hourlyRate = 0,
  currency: Currency = "USD",
): Promise<void> {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`
  const earnedHeader = `Earned (${CURRENCY_LABELS[currency]})`
  const headers = hourlyRate > 0 ? [...BASE_HEADERS, earnedHeader] : BASE_HEADERS

  await sheetsRequest(`${base}/values/A1:Z:clear`, "POST", token)

  await sheetsRequest(`${base}/values/A1?valueInputOption=USER_ENTERED`, "PUT", token, {
    values: [headers, ...buildRows(records, hourlyRate, currency)],
  })
}
