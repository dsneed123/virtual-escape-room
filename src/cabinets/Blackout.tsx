import { useEffect } from 'react'
import { LIGHTS_START } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

export default function Blackout({ onWin, won }: GameProps) {
  const [grid, setGrid] = useScratch<number[][]>('blackout', LIGHTS_START)
  const lit = grid.flat().filter(Boolean).length
  const solved = lit === 25

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const press = (r: number, c: number) => {
    if (won) return
    play('tap')
    setGrid((g) =>
      g.map((row, rr) =>
        row.map((v, cc) => (Math.abs(rr - r) + Math.abs(cc - c) <= 1 && (rr === r || cc === c) ? (v ? 0 : 1) : v)),
      ),
    )
  }

  return (
    <div className="game-wrap">
      <div className="lights-grid">
        {grid.map((row, r) =>
          row.map((v, c) => (
            <button
              key={`${r},${c}`}
              className={`bulb${v ? ' on' : ''}`}
              onClick={() => press(r, c)}
              aria-label={`bulb row ${r + 1} column ${c + 1}, ${v ? 'on' : 'off'}`}
            >
              {v ? '☀' : '·'}
            </button>
          )),
        )}
      </div>
      <div className="game-status">
        <span className="big-count">{lit}</span> of 25 lit
        <button className="btn ghost" style={{ marginLeft: 16 }} onClick={() => setGrid(LIGHTS_START)}>
          Start over
        </button>
      </div>
    </div>
  )
}
