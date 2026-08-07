import { Briefcase, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import type { RecordType } from "@/types"

interface RecordTypeToggleProps {
  value: RecordType
  onChange: (type: RecordType) => void
  className?: string
}

const OPTIONS: { value: RecordType; icon: typeof Briefcase; labelKey: string }[] = [
  { value: "work", icon: Briefcase, labelKey: "type.work" },
  { value: "meet", icon: Users, labelKey: "type.meet" },
]

export function RecordTypeToggle({ value, onChange, className }: RecordTypeToggleProps) {
  const { t } = useTranslation()
  const selectedIndex = value === "meet" ? 1 : 0

  return (
    <div
      role="radiogroup"
      aria-label={t("type.label")}
      className={cn(
        "relative grid h-11 grid-cols-2 rounded-md border border-input bg-muted/60 p-1",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)]
          rounded-sm bg-primary shadow-xs transition-transform duration-200
          ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${selectedIndex * 100}%)` }}
      />
      {OPTIONS.map(({ value: optionValue, icon: Icon, labelKey }) => {
        const isSelected = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(optionValue)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-2 rounded-sm",
              "text-sm font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isSelected
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {t(labelKey)}
          </button>
        )
      })}
    </div>
  )
}
