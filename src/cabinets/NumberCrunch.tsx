import { useEffect, useState } from 'react'
import { SUDOKU_PUZZLE, SUDOKU_SOLUTION } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const boxOf = (i: number) => Math.floor(Math.floor(i / 6) / 2) * 2 + Math.floor((i % 6) / 3)

export default function NumberCrunch({ onWin, won }: GameProps) {
  const [cells, setCells] = useScratch<number[]>('sudoku.cells', SUDOKU_PUZZLE)
  const [sel, setSel] = useState<number | null>(null)
  const solved = cells.every((v, i) => v === SUDOKU_SOLUTION[i])

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const clash = cells.map((v, i) => {
    if (!v) return false
    for (let j = 0; j < 36; j++) {
      if (j === i || cells[j] !== v) continue
      const sameRow = Math.floor(i / 6) === Math.floor(j / 6)
      const sameCol = i % 6 === j % 6
      if (sameRow || sameCol || boxOf(i) === boxOf(j)) return true
    }
    return false
  })

  const put = (v: number) => {
    if (sel == null || won || SUDOKU_PUZZLE[sel]) return
    play('tap')
    setCells(cells.map((x, i) => (i === sel ? (x === v ? 0 : v) : x)))
  }

  return (
    <div className="game-wrap">
      <div className="sud-grid">
        {cells.map((v, i) => (
          <button
            key={i}
            className={`sud${SUDOKU_PUZZLE[i] ? ' given' : ''}${clash[i] ? ' clash' : ''}${sel === i ? ' sel' : ''}${
              i % 3 === 2 && i % 6 !== 5 ? ' box-r' : ''
            }${Math.floor(i / 6) % 2 === 1 && i < 30 ? ' box-b' : ''}`}
            onClick={() => setSel(i)}
            aria-label={`cell ${Math.floor(i / 6) + 1},${(i % 6) + 1}`}
          >
            {v || ''}
          </button>
        ))}
      </div>
      <div className="sud-pad">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button key={n} className="btn" onClick={() => put(n)} disabled={sel == null || !!SUDOKU_PUZZLE[sel ?? 0]}>
            {n}
          </button>
        ))}
        <button className="btn ghost" onClick={() => put(cells[sel ?? 0])} disabled={sel == null}>
          Clear
        </button>
      </div>
      <div className="game-status">
        <span className="big-count">{cells.filter(Boolean).length}</span> of 36 filled
        <button className="btn ghost" onClick={() => setCells(SUDOKU_PUZZLE)}>Start over</button>
      </div>
    </div>
  )
}
