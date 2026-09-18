import { useEffect, useState } from 'react'
import { NONOGRAM } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const N = 10
const PIC = NONOGRAM.picture.map((r) => r.split('').map(Number))

const runs = (arr: number[]) => {
  const res: number[] = []
  let n = 0
  for (const v of arr) {
    if (v === 1) n++
    else if (n) {
      res.push(n)
      n = 0
    }
  }
  if (n) res.push(n)
  return res.length ? res : [0]
}
const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i])

export default function PixelPainter({ onWin, won }: GameProps) {
  // 0 blank, 1 filled, 2 marked-empty
  const [cells, setCells] = useScratch<number[][]>(
    'pixel.cells',
    Array.from({ length: N }, () => Array(N).fill(0)),
  )
  const [markMode, setMarkMode] = useState(false)

  const filled = cells.map((row) => row.map((v) => (v === 1 ? 1 : 0)))
  const rowOk = filled.map((row, r) => same(runs(row), NONOGRAM.rows[r]))
  const colOk = Array.from({ length: N }, (_, c) => same(runs(filled.map((row) => row[c])), NONOGRAM.cols[c]))
  const solved = filled.every((row, r) => row.every((v, c) => v === PIC[r][c]))

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const click = (r: number, c: number) => {
    if (won) return
    play('tap')
    setCells((g) =>
      g.map((row, rr) =>
        row.map((v, cc) => {
          if (rr !== r || cc !== c) return v
          if (markMode) return v === 2 ? 0 : 2
          return v === 1 ? 0 : 1
        }),
      ),
    )
  }

  const maxRow = Math.max(...NONOGRAM.rows.map((r) => r.length))
  const maxCol = Math.max(...NONOGRAM.cols.map((c) => c.length))

  return (
    <div className="game-wrap">
      <div className="mine-bar">
        <button className={`btn ${markMode ? 'primary' : 'ghost'}`} onClick={() => setMarkMode(!markMode)}>
          {markMode ? '✕ Marking blanks' : '■ Filling squares'}
        </button>
        <span className="note">
          {rowOk.filter(Boolean).length}/{N} rows and {colOk.filter(Boolean).length}/{N} columns match
        </span>
      </div>

      <div className="nono" style={{ gridTemplateColumns: `calc(${maxRow} * var(--px-size) * 0.62) repeat(${N}, var(--px-size))` }}>
        <div className="nono-corner" style={{ height: `calc(${maxCol} * var(--px-size) * 0.55)` }} />
        {NONOGRAM.cols.map((clue, c) => (
          <div key={`c${c}`} className={`nono-clue col${colOk[c] ? ' ok' : ''}`}>
            {clue.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        ))}
        {cells.map((row, r) => (
          <div key={`r${r}`} style={{ display: 'contents' }}>
            <div className={`nono-clue row${rowOk[r] ? ' ok' : ''}`}>
              {NONOGRAM.rows[r].map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
            {row.map((v, c) => (
              <button
                key={c}
                className={`px${v === 1 ? ' on' : v === 2 ? ' no' : ''}`}
                onClick={() => click(r, c)}
                aria-label={`row ${r + 1} column ${c + 1}`}
              >
                {v === 2 ? '·' : ''}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="game-status">
        <button className="btn ghost" onClick={() => setCells(Array.from({ length: N }, () => Array(N).fill(0)))}>
          Wipe the canvas
        </button>
      </div>
    </div>
  )
}
