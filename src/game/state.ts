import { useCallback, useEffect, useState } from 'react'

export const TOTAL_MS = 45 * 60 * 1000
const KEY = 'arcade.session.v1'

export type Team = 'SEATTLE' | 'SJC'
export type Status = 'select' | 'briefing' | 'running' | 'paused' | 'expired' | 'overtime' | 'escaped'

export interface Token {
  id: string
  at: number
}

export interface Session {
  team: Team | null
  crew: string[]
  driver: number
  status: Status
  view: string // 'hub' | cabinet id | 'prize'
  tokens: Token[]
  startedAt: number | null
  pausedTotal: number
  pausedAt: number | null
  completionMs: number | null
  muted: boolean
  resumeTo?: Status
}

const fresh: Session = {
  team: null,
  crew: [],
  driver: 0,
  status: 'select',
  view: 'hub',
  tokens: [],
  startedAt: null,
  pausedTotal: 0,
  pausedAt: null,
  completionMs: null,
  muted: false,
}

function load(): Session {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fresh
    const parsed = { ...fresh, ...(JSON.parse(raw) as Partial<Session>) }
    if (parsed.status === 'paused' && parsed.pausedAt == null) parsed.pausedAt = Date.now()
    return parsed
  } catch {
    return fresh
  }
}

function save(s: Session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* private mode — play continues, it just will not survive a refresh */
  }
}

export function elapsedOf(s: Session, now: number): number {
  if (!s.startedAt) return 0
  if (s.completionMs != null) return s.completionMs
  const frozen = s.pausedAt ? now - s.pausedAt : 0
  return Math.max(0, now - s.startedAt - s.pausedTotal - frozen)
}

export function useSession() {
  const [session, setSession] = useState<Session>(load)
  const [now, setNow] = useState(() => Date.now())

  const update = useCallback((patch: Partial<Session> | ((s: Session) => Partial<Session>)) => {
    setSession((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      save(next)
      return next
    })
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return
      try {
        setSession(e.newValue ? (JSON.parse(e.newValue) as Session) : fresh)
      } catch {
        /* a half-written value from another tab — keep what we have */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const elapsed = elapsedOf(session, now)
  const remaining = Math.max(0, TOTAL_MS - elapsed)

  useEffect(() => {
    if (session.status === 'running' && remaining <= 0) update({ status: 'expired' })
  }, [remaining, session.status, update])

  const start = useCallback((team: Team) => update({ team, status: 'briefing', startedAt: null }), [update])

  const setCrew = useCallback((crew: string[]) => update({ crew: crew.slice(0, 12) }), [update])

  /** Hand the mouse to the next person in the room after every token. */
  const passMouse = useCallback(() => update((s) => ({ driver: s.crew.length ? (s.driver + 1) % s.crew.length : 0 })), [update])

  const beginRun = useCallback(
    () => update({ status: 'running', startedAt: Date.now(), pausedTotal: 0, pausedAt: null, view: 'hub' }),
    [update],
  )

  const pause = useCallback(
    () =>
      update((s) =>
        s.status === 'running' || s.status === 'overtime'
          ? { status: 'paused', pausedAt: Date.now(), resumeTo: s.status }
          : {},
      ),
    [update],
  )

  const resume = useCallback(
    () =>
      update((s) =>
        s.pausedAt
          ? {
              status:
                s.status !== 'paused'
                  ? s.status
                  : TOTAL_MS - elapsedOf(s, Date.now()) <= 0
                    ? 'overtime'
                    : (s.resumeTo ?? 'running'),
              pausedTotal: s.pausedTotal + (Date.now() - s.pausedAt),
              pausedAt: null,
            }
          : {},
      ),
    [update],
  )

  const award = useCallback(
    (id: string) =>
      update((s) =>
        s.tokens.some((t) => t.id === id) ? {} : { tokens: [...s.tokens, { id, at: elapsedOf(s, Date.now()) }] },
      ),
    [update],
  )

  const finish = useCallback(
    () => update((s) => ({ status: 'escaped', completionMs: elapsedOf(s, Date.now()) })),
    [update],
  )

  const goto = useCallback((view: string) => update({ view }), [update])

  /** Host correction for wall-clock loss (laptop sleep, crash). Minutes may be negative. */
  const adjust = useCallback(
    (minutes: number) => update((s) => ({ pausedTotal: Math.max(-TOTAL_MS, s.pausedTotal + minutes * 60000) })),
    [update],
  )

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    setSession(fresh)
  }, [])

  return {
    session, now, elapsed, remaining, update, start, setCrew, passMouse,
    beginRun, pause, resume, award, finish, goto, adjust, reset,
  }
}

export function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export type Tension = 'calm' | 'raised' | 'high' | 'critical' | 'final'

export function tensionOf(remaining: number): Tension {
  const min = remaining / 60000
  if (min > 30) return 'calm'
  if (min > 15) return 'raised'
  if (min > 5) return 'high'
  if (min > 1) return 'critical'
  return 'final'
}
