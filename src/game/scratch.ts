import { useCallback, useState } from 'react'

const PREFIX = 'mrdn.scratch.'

/** Working notes (grid marks, highlights, tile placements) that survive a refresh. */
export function useScratch<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  const set = useCallback(
    (next: T | ((prev: T) => T)) =>
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(v))
        } catch {
          /* ignore */
        }
        return v
      }),
    [key],
  )

  return [value, set] as const
}

export function clearScratch() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
