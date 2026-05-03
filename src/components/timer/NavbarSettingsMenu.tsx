import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/providers/theme-provider"
import { useTimerStore, CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/store/useTimerStore"
import type { Currency } from "@/store/useTimerStore"

const CURRENCIES: Currency[] = ["USD", "EUR", "TRY"]

export function NavbarSettingsMenu() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const currency = useTimerStore((s) => s.currency)
  const setCurrency = useTimerStore((s) => s.setCurrency)
  const langValue = i18n.language.startsWith("tr") ? "tr" : "en"

  const themeRadioValue =
    theme === "light" || theme === "dark"
      ? theme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("settings.aria")} className="shrink-0">
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("settings.language")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={langValue} onValueChange={(v) => i18n.changeLanguage(v)}>
          <DropdownMenuRadioItem value="en">{t("settings.lang_en")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="tr">{t("settings.lang_tr")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("settings.currency")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={(v) => setCurrency(v as Currency)}
        >
          {CURRENCIES.map((c) => (
            <DropdownMenuRadioItem key={c} value={c}>
              <span className="flex items-center gap-2">
                <span className="font-medium tabular-nums">{CURRENCY_SYMBOLS[c]}</span>
                {CURRENCY_LABELS[c]}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("settings.theme")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={themeRadioValue}
          onValueChange={(v) => setTheme(v as "light" | "dark")}
        >
          <DropdownMenuRadioItem value="light">{t("settings.theme_light")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">{t("settings.theme_dark")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
