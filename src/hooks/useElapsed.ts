import { useEffect, useState } from "react"

export function useElapsed(startTime: Date | null): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) {
      setElapsed(0)
      return
    }
    setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startTime])

  return elapsed
}
