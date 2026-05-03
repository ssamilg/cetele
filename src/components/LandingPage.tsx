import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import logo from "@/assets/logo.webp"

interface LandingPageProps {
  onEnter: () => void
}

const ORB_CONFIG = [
  { size: "w-[700px] h-[700px]", color: "bg-violet-600/25", top: "-15%", left: "-10%", duration: 9, delay: 0 },
  { size: "w-[550px] h-[550px]", color: "bg-blue-600/20", top: "55%", left: "55%", duration: 11, delay: 3 },
  { size: "w-[450px] h-[450px]", color: "bg-indigo-500/20", top: "35%", left: "15%", duration: 13, delay: 5 },
  { size: "w-[300px] h-[300px]", color: "bg-violet-400/15", top: "5%", left: "65%", duration: 7, delay: 1 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const wordVariants = {
  hidden: { opacity: 0, y: 48, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
})

export function LandingPage({ onEnter }: LandingPageProps) {
  const { t } = useTranslation()

  const headlineWords = [t("landing.word1"), t("landing.word2"), t("landing.word3")]

  const features = [
    { icon: "⚡", label: t("landing.feature_timer") },
    { icon: "☁️", label: t("landing.feature_sheets") },
    { icon: "💰", label: t("landing.feature_earnings") },
    { icon: "📊", label: t("landing.feature_analytics") },
  ]

  return (
    <div className="relative min-h-svh bg-[#060912] flex flex-col items-center justify-center overflow-hidden">
      {ORB_CONFIG.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.size} ${orb.color}`}
          style={{ top: orb.top, left: orb.left }}
          animate={{ y: [0, -40, 0], scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060912_100%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex items-center justify-center gap-4"
        >
          <img
            src={logo}
            alt=""
            className="min-h-14 h-14 w-auto max-h-14 object-contain shrink-0"
          />
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Çetele
          </span>
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-[clamp(4rem,12vw,8rem)] font-black tracking-tighter text-white leading-[0.9] mb-8"
        >
          {headlineWords.map((w, i) => (
            <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.2em] last:mr-0">
              {i === headlineWords.length - 1 ? (
                <span className="bg-linear-to-br from-violet-400 via-fuchsia-300 to-blue-400 bg-clip-text text-transparent">
                  {w}
                </span>
              ) : (
                w
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          {...fadeUp(0.75)}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-lg leading-relaxed font-light"
        >
          {t("landing.subtitle1")}
          <br />
          <span className="text-slate-500">{t("landing.subtitle2")}</span>
        </motion.p>

        <motion.div
          {...fadeUp(0.95)}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-14"
        >
          {features.map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                text-slate-300 border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm
                shadow-inner shadow-slate-900/50"
            >
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </motion.div>

        <motion.div {...fadeUp(1.1)}>
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="relative cursor-pointer group px-10 py-4 rounded-2xl font-semibold text-lg
              text-white bg-linear-to-r from-violet-600 to-blue-600
              shadow-[0_0_40px_rgba(124,58,237,0.45)]
              hover:shadow-[0_0_65px_rgba(124,58,237,0.65)]
              transition-shadow duration-300 overflow-hidden"
          >
            <span
              className="absolute inset-0 bg-linear-to-r from-violet-400/20 to-blue-400/20
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative flex items-center gap-3">
              {t("landing.cta")}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        <motion.p {...fadeUp(1.3)} className="mt-8 text-xs text-slate-600">
          {t("landing.privacy")}
        </motion.p>
      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-px
          bg-linear-to-r from-transparent via-violet-500/30 to-transparent"
      />
    </div>
  )
}
