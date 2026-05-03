import type { TimeRecord } from "@/types"
import { formatDateTime, formatDuration } from "@/lib/formatters"

const BASE_HEADERS = ["Task", "Description", "Started", "Stopped", "Duration"]

function buildRows(records: TimeRecord[], hourlyRate: number): string[][] {
  const hasRate = hourlyRate > 0
  return records.map((r) => {
    const earned = hasRate ? ((r.duration / 3600) * hourlyRate).toFixed(2) : null
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
    throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`)
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
    throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as { spreadsheetId: string }
  return data.spreadsheetId
}

export async function syncLogsToSheet(
  records: TimeRecord[],
  token: string,
  sheetId: string,
  hourlyRate = 0,
): Promise<void> {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`
  const headers = hourlyRate > 0 ? [...BASE_HEADERS, "Earned (USD)"] : BASE_HEADERS

  await sheetsRequest(`${base}/values/A1:Z:clear`, "POST", token)

  await sheetsRequest(`${base}/values/A1?valueInputOption=USER_ENTERED`, "PUT", token, {
    values: [headers, ...buildRows(records, hourlyRate)],
  })
}
