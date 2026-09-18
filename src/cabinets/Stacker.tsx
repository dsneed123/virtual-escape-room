import { useEffect, useState } from 'react'
import { HANOI_DISCS } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const START: number[][] = [Array.from({ length: HANOI_DISCS }, (_, i) => HANOI_DISCS - i), [], []]

export default function Stacker({ onWin, won }: GameProps) {
  const [pegs, setPegs] = useScratch<number[][]>('stack.pegs', START)
  const [moves, setMoves] = useScratch<number>('stack.moves', 0)
  const [held, setHeld] = useState<number | null>(null)
  const solved = pegs[2].length === HANOI_DISCS

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const tap = (i: number) => {
    if (won) return
    if (held == null) {
      if (!pegs[i].length) return
      play('tap')
      setHeld(i)
      return
    }
    if (held === i) {
      setHeld(null)
      return
    }
    const disc = pegs[held][pegs[held].length - 1]
    const top = pegs[i][pegs[i].length - 1]
    if (top != null && top < disc) {
      play('error')
      setHeld(null)
      return
    }
    play('tap')
    setPegs(pegs.map((p, j) => (j === held ? p.slice(0, -1) : j === i ? [...p, disc] : p)))
    setMoves(moves + 1)
    setHeld(null)
  }

  return (
    <div className="game-wrap">
      <div className="pegs">
        {pegs.map((peg, i) => (
          <button key={i} className={`peg${held === i ? ' held' : ''}`} onClick={() => tap(i)} aria-label={`peg ${i + 1}`}>
            <span className="peg-rod" />
            <span className="peg-discs">
              {peg.map((d, j) => (
                <span
                  key={j}
                  className={`disc${held === i && j === peg.length - 1 ? ' lifted' : ''}`}
                  style={{ width: `${30 + d * 14}%`, background: `hsl(${180 + d * 28} 70% 55%)` }}
                >
                  {d}
                </span>
              ))}
            </span>
            <span className="peg-base">{['LEFT', 'MIDDLE', 'RIGHT'][i]}</span>
          </button>
        ))}
      </div>
      <div className="game-status">
        <span className="big-count">{moves}</span> moves · 31 is perfect
        {held != null && <span className="game-msg accent">Holding a disc — click another peg to drop it</span>}
        <button className="btn ghost" onClick={() => { setPegs(START); setMoves(0); setHeld(null) }}>
          Start over
        </button>
      </div>
    </div>
  )
}
