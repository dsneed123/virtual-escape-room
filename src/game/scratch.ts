import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'mrdn.scratch.'
const SYNC = 'mrdn-scratch'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * Working notes (grid marks, highlights, tile placements, cipher keys) that survive a
 * refresh. The same key can be mounted twice at once — the decoder appears both on its
 * stage and inside the machine drawer — so writes are broadcast to every live copy.
 */
export function useScratch<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial))

  useEffect(() => {
    const sync = () => setValue(read(key, initial))
    const onCustom = (e: Event) => {
      const k = (e as CustomEvent<{ key: string }>).detail?.key
      if (k === key || k === '*') sync()
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFIX + key) sync()
    }
    window.addEventListener(SYNC, onCustom)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(SYNC, onCustom)
      window.removeEventListener('storage', onStorage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) =>
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(v))
          window.dispatchEvent(new CustomEvent(SYNC, { detail: { key } }))
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
    window.dispatchEvent(new CustomEvent(SYNC, { detail: { key: '*' } }))
  } catch {
    /* ignore */
  }
}
