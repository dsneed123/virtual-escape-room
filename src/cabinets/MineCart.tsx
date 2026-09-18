import { useEffect, useState } from 'react'
import { MINES } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const N = 9
const isMine = (r: number, c: number) => MINES.some(([mr, mc]) => mr === r && mc === c)

const counts = Array.from({ length: N }, (_, r) =>
  Array.from({ length: N }, (_, c) => {
    if (isMine(r, c)) return -1
    let n = 0
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++)
        if (isMine(r + dr, c + dc)) n++
    return n
  }),
)

export default function MineCart({ onWin, won }: GameProps) {
  const [open, setOpen] = useScratch<string[]>('mine.open', [])
  const [flags, setFlags] = useScratch<string[]>('mine.flags', [])
  const [flagMode, setFlagMode] = useState(false)
  const [booms, setBooms] = useScratch<number>('mine.booms', 0)
  const [lockUntil, setLockUntil] = useState(0)
  const [, tick] = useState(0)

  useEffect(() => {
    if (lockUntil <= Date.now()) return
    const id = window.setInterval(() => {
      tick((n) => n + 1)
      if (Date.now() >= lockUntil) window.clearInterval(id)
    }, 250)
    return () => window.clearInterval(id)
  }, [lockUntil])

  const locked = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000))
  const safeTotal = N * N - MINES.length
  const opened = open.length
  const solved = opened >= safeTotal

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const dig = (r: number, c: number) => {
    if (won || locked) return
    const k = `${r},${c}`
    if (flagMode) {
      play('tap')
      setFlags((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]))
      return
    }
    if (flags.includes(k) || open.includes(k)) return
    if (counts[r][c] === -1) {
      play('error')
      setBooms(booms + 1)
      setFlags((f) => [...f, k])
      setLockUntil(Date.now() + 10000)
      return
    }
    play('tap')
    // flood fill from any zero
    const found = new Set(open)
    const stack = [[r, c]]
    while (stack.length) {
      const [rr, cc] = stack.pop()!
      if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue
      const key = `${rr},${cc}`
      if (found.has(key) || counts[rr][cc] === -1) continue
      found.add(key)
      if (counts[rr][cc] !== 0) continue
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) stack.push([rr + dr, cc + dc])
    }
    setOpen([...found])
  }

  return (
    <div className="game-wrap">
      <div className="mine-bar">
        <button className={`btn ${flagMode ? 'primary' : 'ghost'}`} onClick={() => setFlagMode(!flagMode)}>
          {flagMode ? '⚑ Flag mode ON' : '⛏ Dig mode'}
        </button>
        <span className="note">
          {MINES.length - flags.length} sticks unflagged · {booms} bang{booms === 1 ? '' : 's'} so far
        </span>
        {locked > 0 && <span className="warnline">CART DERAILED — back in {locked}s</span>}
      </div>

      <div className={`mine-grid${locked ? ' frozen' : ''}`}>
        {counts.map((row, r) =>
          row.map((v, c) => {
            const k = `${r},${c}`
            const isOpen = open.includes(k)
            const isFlag = flags.includes(k)
            return (
              <button
                key={k}
                className={`tile${isOpen ? ' open' : ''}${isFlag ? ' flag' : ''}`}
                data-n={isOpen ? v : undefined}
                onClick={() => dig(r, c)}
                aria-label={`row ${r + 1} column ${c + 1}`}
              >
                {isOpen ? (v === 0 ? '' : v) : isFlag ? '⚑' : ''}
              </button>
            )
          }),
        )}
      </div>

      <div className="game-status">
        <span className="big-count">{opened}</span> of {safeTotal} safe tiles dug
        <button className="btn ghost" onClick={() => { setOpen([]); setFlags([]); setBooms(0) }}>
          Start over
        </button>
      </div>
    </div>
  )
}
