import { useEffect, useState } from 'react'

/** `active` true iken geçen saniyeyi sayar (uzun süren yapay zekâ istekleri için). */
export function useElapsed(active: boolean) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!active) return setSeconds(0)
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [active])
  return seconds
}
