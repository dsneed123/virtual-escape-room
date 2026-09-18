import { useEffect, useState } from 'react'
import { FLOW_ENDPOINTS, FLOW_SIZE } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const COLOURS = ['#ff3fa4', '#35e8d3', '#ffd166', '#8b7cf6', '#4cc9f0']
type Cell = [number, number]
const same = (a: Cell, b: Cell) => a[0] === b[0] && a[1] === b[1]
const adjacent = (a: Cell, b: Cell) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1
const isEnd = (k: number, cell: Cell) => FLOW_ENDPOINTS[k].some((e) => same(e as Cell, cell))

export default function NeonFlow({ onWin, won }: GameProps) {
  const [paths, setPaths] = useScratch<Cell[][]>('flow.paths', FLOW_ENDPOINTS.map(() => []))
  const [active, setActive] = useState<number | null>(null)

  const owner = (cell: Cell) => paths.findIndex((p) => p.some((c) => same(c, cell)))
  const complete = (k: number) => {
    const p = paths[k]
    return p.length >= 2 && isEnd(k, p[0]) && isEnd(k, p[p.length - 1]) && !same(p[0], p[p.length - 1])
  }
  const filled = paths.flat().length
  const solved = paths.every((_, k) => complete(k)) && filled === FLOW_SIZE * FLOW_SIZE

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const click = (cell: Cell) => {
    if (won) return
    const endOf = FLOW_ENDPOINTS.findIndex((pair) => pair.some((e) => same(e as Cell, cell)))

    // starting (or restarting) a colour from one of its dots
    if (endOf >= 0 && (active === null || active !== endOf || paths[endOf].length === 0)) {
      play('tap')
      setActive(endOf)
      setPaths(paths.map((p, i) => (i === endOf ? [cell] : p)))
      return
    }
    if (active === null) return

    const path = paths[active]
    if (!path.length) return

    // clicking back along the current path trims it
    const idx = path.findIndex((c) => same(c, cell))
    if (idx >= 0) {
      play('tap')
      setPaths(paths.map((p, i) => (i === active ? p.slice(0, idx + 1) : p)))
      return
    }

    const head = path[path.length - 1]
    if (!adjacent(head, cell)) return
    const taken = owner(cell)
    if (taken >= 0 && taken !== active) {
      play('error')
      return
    }
    if (isEnd(active, cell) === false && FLOW_ENDPOINTS.some((pair, i) => i !== active && pair.some((e) => same(e as Cell, cell)))) {
      play('error')
      return
    }
    play('tap')
    setPaths(paths.map((p, i) => (i === active ? [...p, cell] : p)))
  }

  return (
    <div className="game-wrap">
      <div className="flow-grid" style={{ gridTemplateColumns: `repeat(${FLOW_SIZE}, var(--flow-size))` }}>
        {Array.from({ length: FLOW_SIZE * FLOW_SIZE }, (_, i) => {
          const cell: Cell = [Math.floor(i / FLOW_SIZE), i % FLOW_SIZE]
          const k = FLOW_ENDPOINTS.findIndex((pair) => pair.some((e) => same(e as Cell, cell)))
          const own = owner(cell)
          const colour = k >= 0 ? COLOURS[k] : own >= 0 ? COLOURS[own] : undefined
          return (
            <button
              key={i}
              className={`flow${k >= 0 ? ' dot' : own >= 0 ? ' filled' : ''}${active !== null && own === active ? ' live' : ''}`}
              style={colour ? ({ '--flow-colour': colour } as React.CSSProperties) : undefined}
              onClick={() => click(cell)}
              aria-label={`cell ${cell[0] + 1},${cell[1] + 1}`}
            >
              {k >= 0 ? '●' : own >= 0 ? '■' : ''}
            </button>
          )
        })}
      </div>
      <div className="game-status">
        <span className="big-count">{paths.filter((_, k) => complete(k)).length}</span> of {FLOW_ENDPOINTS.length} wires
        joined · <span className="big-count">{filled}</span>/{FLOW_SIZE * FLOW_SIZE} squares covered
        <button className="btn ghost" onClick={() => { setPaths(FLOW_ENDPOINTS.map(() => [])); setActive(null) }}>
          Clear the board
        </button>
      </div>
      <p className="game-msg">
        Every square must end up covered — a wire that takes the short way round will leave gaps.
      </p>
    </div>
  )
}
