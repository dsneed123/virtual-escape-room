import { useEffect } from 'react'
import { SOKOBAN_LEVEL } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

interface Pos { r: number; c: number }
interface Board { p: Pos; crates: Pos[] }

const WALLS = new Set<string>()
const TARGETS: Pos[] = []
const START: Board = { p: { r: 0, c: 0 }, crates: [] }
SOKOBAN_LEVEL.forEach((row, r) =>
  row.split('').forEach((ch, c) => {
    if (ch === '#') WALLS.add(`${r},${c}`)
    if (ch === 'T') TARGETS.push({ r, c })
    if (ch === 'B') START.crates.push({ r, c })
    if (ch === 'P') START.p = { r, c }
  }),
)
const H = SOKOBAN_LEVEL.length
const W = SOKOBAN_LEVEL[0].length
const at = (list: Pos[], r: number, c: number) => list.some((x) => x.r === r && x.c === c)

export default function CrateCrusher({ onWin, won }: GameProps) {
  const [board, setBoard] = useScratch<Board>('crate.board', START)
  const [history, setHistory] = useScratch<Board[]>('crate.history', [])
  const done = board.crates.filter((c) => at(TARGETS, c.r, c.c)).length
  const solved = done === TARGETS.length

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const step = (dr: number, dc: number) => {
    if (won) return
    const nr = board.p.r + dr
    const nc = board.p.c + dc
    if (WALLS.has(`${nr},${nc}`)) return
    let crates = board.crates
    if (at(crates, nr, nc)) {
      const br = nr + dr
      const bc = nc + dc
      if (WALLS.has(`${br},${bc}`) || at(crates, br, bc)) {
        play('error')
        return
      }
      crates = crates.map((x) => (x.r === nr && x.c === nc ? { r: br, c: bc } : x))
    }
    play('tap')
    setHistory([...history.slice(-60), board])
    setBoard({ p: { r: nr, c: nc }, crates })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
      }
      const d = map[e.key]
      if (!d) return
      e.preventDefault()
      step(d[0], d[1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const undo = () => {
    if (!history.length) return
    setBoard(history[history.length - 1])
    setHistory(history.slice(0, -1))
  }

  return (
    <div className="game-wrap">
      <div className="soko-grid" style={{ gridTemplateColumns: `repeat(${W}, var(--soko-size))` }}>
        {Array.from({ length: H * W }, (_, i) => {
          const r = Math.floor(i / W)
          const c = i % W
          const wall = WALLS.has(`${r},${c}`)
          const target = at(TARGETS, r, c)
          const crate = at(board.crates, r, c)
          const player = board.p.r === r && board.p.c === c
          return (
            <div key={i} className={`soko${wall ? ' wall' : ''}${target ? ' target' : ''}`}>
              {crate && <span className={`crate${target ? ' home' : ''}`}>▩</span>}
              {player && <span className="robot">🤖</span>}
              {!crate && !player && target && <span className="spot">◎</span>}
            </div>
          )
        })}
      </div>

      <div className="jam-arrows">
        <button className="btn" onClick={() => step(-1, 0)}>▲</button>
        <button className="btn" onClick={() => step(0, -1)}>◀</button>
        <button className="btn" onClick={() => step(0, 1)}>▶</button>
        <button className="btn" onClick={() => step(1, 0)}>▼</button>
      </div>

      <div className="game-status">
        <span className="big-count">{done}</span> of {TARGETS.length} crates parked
        <button className="btn ghost" onClick={undo} disabled={!history.length}>Undo</button>
        <button className="btn ghost" onClick={() => { setBoard(START); setHistory([]) }}>Reset</button>
        <span className="note">Arrow keys work too</span>
      </div>
    </div>
  )
}
