import { useCallback, useEffect, useRef, useState } from 'react'

export const TOTAL_MS = 45 * 60 * 1000
const KEY = 'mrdn.session.v3'

export type Team = 'SEATTLE' | 'SJC'
export type Status = 'select' | 'briefing' | 'running' | 'paused' | 'expired' | 'overtime' | 'escaped'

export interface Solve {
  stage: number
  fragment: string
  at: number // elapsed ms when solved
}

export interface Session {
  team: Team | null
  status: Status
  stage: number // 0..6 = puzzles 1..7, 7 = meta
  solves: Solve[]
  startedAt: number | null
  pausedTotal: number
  pausedAt: number | null
  completionMs: number | null
  muted: boolean
}

const fresh: Session = {
  team: null,
  status: 'select',
  stage: 0,
  solves: [],
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
    /* private mode — the game still runs, it just will not survive a refresh */
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
  const ref = useRef(session)
  ref.current = session

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

  // another tab / window on the same machine should not fight over the session
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) setSession(JSON.parse(e.newValue) as Session)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const elapsed = elapsedOf(session, now)
  const remaining = Math.max(0, TOTAL_MS - elapsed)

  useEffect(() => {
    if (session.status === 'running' && remaining <= 0) update({ status: 'expired' })
  }, [remaining, session.status, update])

  const start = useCallback(
    (team: Team) => update({ team, status: 'briefing', startedAt: null }),
    [update],
  )

  const beginRun = useCallback(
    () => update({ status: 'running', startedAt: Date.now(), pausedTotal: 0, pausedAt: null }),
    [update],
  )

  const pause = useCallback(
    () => update((s) => (s.status === 'running' ? { status: 'paused', pausedAt: Date.now() } : {})),
    [update],
  )

  const resume = useCallback(
    () =>
      update((s) =>
        s.pausedAt
          ? {
              status: TOTAL_MS - elapsedOf(s, Date.now()) <= 0 ? 'overtime' : s.status === 'paused' ? 'running' : s.status,
              pausedTotal: s.pausedTotal + (Date.now() - s.pausedAt),
              pausedAt: null,
            }
          : {},
      ),
    [update],
  )

  const solve = useCallback(
    (stage: number, fragment: string) =>
      update((s) => {
        if (s.solves.some((x) => x.stage === stage)) return {}
        const at = elapsedOf(s, Date.now())
        const solves = [...s.solves, { stage, fragment, at }]
        const done = stage === 8
        return {
          solves,
          stage: done ? 7 : Math.max(s.stage, stage),
          status: done ? 'escaped' : s.status,
          completionMs: done ? at : s.completionMs,
        }
      }),
    [update],
  )

  const goto = useCallback((stage: number) => update({ stage }), [update])
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    setSession(fresh)
  }, [])

  return {
    session,
    now,
    elapsed,
    remaining,
    update,
    start,
    beginRun,
    pause,
    resume,
    solve,
    goto,
    reset,
  }
}

export function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
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
