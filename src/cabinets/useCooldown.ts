import { useEffect, useState } from 'react'
import { useScratch } from '../game/scratch'

/**
 * Nothing on this floor caps your attempts. Guess as much as you like — but if you
 * start hammering a machine to brute force it, it slows down on you. The count is
 * persisted so a refresh does not wipe the throttle.
 */
export function useCooldown(key: string, free: number) {
  const [count, setCount] = useScratch<number>(`cool.${key}`, 0)
  const [until, setUntil] = useScratch<number>(`coolUntil.${key}`, 0)
  const [, tick] = useState(0)

  useEffect(() => {
    if (until <= Date.now()) return
    const id = window.setInterval(() => {
      tick((n) => n + 1)
      if (Date.now() >= until) window.clearInterval(id)
    }, 250)
    return () => window.clearInterval(id)
  }, [until])

  const cooling = Math.max(0, Math.ceil((until - Date.now()) / 1000))

  /** call on every attempt; returns the wait imposed afterwards, in seconds */
  const register = () => {
    const n = count + 1
    setCount(n)
    if (n < free) return 0
    const wait = Math.min(15, 2 + (n - free) * 2)
    setUntil(Date.now() + wait * 1000)
    return wait
  }

  const clear = () => {
    setCount(0)
    setUntil(0)
  }

  return { cooling, register, clear, attempts: count, free }
}
