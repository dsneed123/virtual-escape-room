import { useEffect } from 'react'
import { PIPE_MASK, PIPE_SCRAMBLE } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const N = 6
const UP = 1, RIGHT = 2, DOWN = 4, LEFT = 8

const rotate = (mask: number, times: number) => {
  let v = mask
  for (let i = 0; i < ((times % 4) + 4) % 4; i++) v = ((v << 1) | (v >> 3)) & 15
  return v
}

const armCount = (m: number) => [UP, RIGHT, DOWN, LEFT].filter((b) => m & b).length

function powered(turns: number[][]) {
  const live = Array.from({ length: N }, () => Array(N).fill(false))
  const stack: [number, number][] = [[0, 0]]
  live[0][0] = true
  while (stack.length) {
    const [r, c] = stack.pop()!
    const m = rotate(PIPE_MASK[r][c], turns[r][c])
    const steps: [number, number, number, number][] = [
      [-1, 0, UP, DOWN],
      [0, 1, RIGHT, LEFT],
      [1, 0, DOWN, UP],
      [0, -1, LEFT, RIGHT],
    ]
    for (const [dr, dc, mine, theirs] of steps) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= N || nc < 0 || nc >= N || live[nr][nc]) continue
      if (!(m & mine)) continue
      if (!(rotate(PIPE_MASK[nr][nc], turns[nr][nc]) & theirs)) continue
      live[nr][nc] = true
      stack.push([nr, nc])
    }
  }
  return live
}

export default function CircuitCity({ onWin, won }: GameProps) {
  const [turns, setTurns] = useScratch<number[][]>('circuit.turns', PIPE_SCRAMBLE)
  const live = powered(turns)
  const lit = live.flat().filter(Boolean).length
  const bulbs: [number, number][] = []
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) if (armCount(PIPE_MASK[r][c]) === 1 && !(r === 0 && c === 0)) bulbs.push([r, c])
  const bulbsLit = bulbs.filter(([r, c]) => live[r][c]).length
  const solved = lit === N * N

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const spin = (r: number, c: number) => {
    if (won) return
    play('tap')
    setTurns((t) => t.map((row, rr) => row.map((v, cc) => (rr === r && cc === c ? (v + 1) % 4 : v))))
  }

  return (
    <div className="game-wrap">
      <div className="pipe-grid">
        {Array.from({ length: N }, (_, r) =>
          Array.from({ length: N }, (_, c) => {
            const m = rotate(PIPE_MASK[r][c], turns[r][c])
            const on = live[r][c]
            const isSrc = r === 0 && c === 0
            const isBulb = armCount(PIPE_MASK[r][c]) === 1 && !isSrc
            return (
              <button
                key={`${r},${c}`}
                className={`pipe${on ? ' live' : ''}`}
                onClick={() => spin(r, c)}
                aria-label={`junction row ${r + 1} column ${c + 1}`}
              >
                {(m & UP) !== 0 && <i className="arm up" />}
                {(m & RIGHT) !== 0 && <i className="arm right" />}
                {(m & DOWN) !== 0 && <i className="arm down" />}
                {(m & LEFT) !== 0 && <i className="arm left" />}
                {isSrc && <span className="node plug">⚡</span>}
                {isBulb && <span className={`node bulb${on ? ' on' : ''}`}>●</span>}
                {!isSrc && !isBulb && <span className="node hub" />}
              </button>
            )
          }),
        )}
      </div>
      <div className="game-status">
        <span className="big-count">{bulbsLit}</span> of {bulbs.length} bulbs lit
        <button className="btn ghost" onClick={() => setTurns(PIPE_SCRAMBLE)}>
          Put it back how you found it
        </button>
      </div>
    </div>
  )
}
