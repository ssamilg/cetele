import { Clock, ListChecks, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDuration } from "@/lib/formatters"
import { useTimerStore } from "@/store/useTimerStore"

function isToday(date: Date): boolean {
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

function formatEarnedToday(totalSeconds: number, hourlyRate: number): string {
  const amount = (totalSeconds / 3600) * hourlyRate
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount)
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  iconClassName?: string
}

function StatCard({ icon, label, value, iconClassName }: StatCardProps) {
  return (
    <Card className="gap-0 py-5">
      <CardContent className="flex items-center gap-4 px-5">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
          {icon}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </span>
          <span className="text-xl font-semibold tracking-tight truncate">{value}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function DailyStats() {
  const records = useTimerStore((s) => s.records)
  const hourlyRate = useTimerStore((s) => s.hourlyRate)

  const todayRecords = records.filter((r) => isToday(r.startTime))
  const totalSeconds = todayRecords.reduce((sum, r) => sum + r.duration, 0)
  const taskCount = todayRecords.length

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={<Clock className="size-5" />}
        label="Hours Today"
        value={totalSeconds > 0 ? formatDuration(totalSeconds) : "—"}
        iconClassName="bg-primary/10 text-primary"
      />
      <StatCard
        icon={<ListChecks className="size-5" />}
        label="Tasks Today"
        value={taskCount > 0 ? String(taskCount) : "—"}
        iconClassName="bg-violet-500/10 text-violet-500"
      />
      <StatCard
        icon={<DollarSign className="size-5" />}
        label="Earned Today"
        value={hourlyRate > 0 && totalSeconds > 0 ? formatEarnedToday(totalSeconds, hourlyRate) : "—"}
        iconClassName="bg-green-500/10 text-green-500"
      />
    </div>
  )
}
