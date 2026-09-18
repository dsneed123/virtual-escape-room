import { useEffect, useState } from 'react'
import { CARS } from '../game/arcade'
import type { Car } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const N = 6
const COLOURS: Record<string, string> = {
  X: '#ff4d6d', A: '#4cc9f0', B: '#8b7cf6', C: '#ffd166', D: '#4fd8c4',
  E: '#f6a94b', F: '#90be6d', G: '#c77dff', H: '#5390d9', I: '#f9844a',
}

const occupy = (cars: Car[]) => {
  const g: (string | null)[][] = Array.from({ length: N }, () => Array(N).fill(null))
  for (const car of cars)
    for (let i = 0; i < car.len; i++) {
      const r = car.dir === 'v' ? car.r + i : car.r
      const c = car.dir === 'h' ? car.c + i : car.c
      if (r < 0 || r >= N || c < 0 || c >= N || g[r][c]) return null
      g[r][c] = car.id
    }
  return g
}

export default function ParkingJam({ onWin, won }: GameProps) {
  const [cars, setCars] = useScratch<Car[]>('jam.cars', CARS)
  const [moves, setMoves] = useScratch<number>('jam.moves', 0)
  const [sel, setSel] = useState<string | null>(null)

  const x = cars.find((c) => c.id === 'X')!
  const solved = x.c + x.len >= N

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const shift = (d: number) => {
    if (!sel || won) return
    const next = cars.map((c) => ({ ...c }))
    const car = next.find((c) => c.id === sel)!
    if (car.dir === 'h') car.c += d
    else car.r += d
    if (car.r < 0 || car.c < 0) return
    if (!occupy(next)) {
      play('error')
      return
    }
    play('tap')
    setCars(next)
    setMoves(moves + 1)
  }

  const selected = cars.find((c) => c.id === sel)

  return (
    <div className="game-wrap">
      <div className="jam-wrap">
        <div className="jam-grid">
          {Array.from({ length: N * N }, (_, i) => (
            <span key={i} className="jam-slot" style={{ gridColumn: (i % N) + 1, gridRow: Math.floor(i / N) + 1 }} />
          ))}
          {cars.map((car) => (
            <button
              key={car.id}
              className={`jam-car${car.id === sel ? ' sel' : ''}${car.id === 'X' ? ' hero' : ''}`}
              style={{
                background: COLOURS[car.id] ?? '#777',
                gridColumn: `${car.c + 1} / span ${car.dir === 'h' ? car.len : 1}`,
                gridRow: `${car.r + 1} / span ${car.dir === 'v' ? car.len : 1}`,
              }}
              onClick={() => {
                if (won) return
                play('tap')
                setSel(car.id)
              }}
              aria-label={`vehicle ${car.id}`}
            >
              {car.id === 'X' ? 'OUT ▶' : ''}
            </button>
          ))}
          <div className="jam-exit" aria-hidden>
            EXIT ▶
          </div>
        </div>
      </div>

      <div className="jam-controls">
        <span className="note">{selected ? `Vehicle ${selected.id} selected` : 'Click a vehicle to pick it up'}</span>
        <div className="jam-arrows">
          <button className="btn" disabled={!selected || selected.dir !== 'v'} onClick={() => shift(-1)}>
            ▲
          </button>
          <button className="btn" disabled={!selected || selected.dir !== 'h'} onClick={() => shift(-1)}>
            ◀
          </button>
          <button className="btn" disabled={!selected || selected.dir !== 'h'} onClick={() => shift(1)}>
            ▶
          </button>
          <button className="btn" disabled={!selected || selected.dir !== 'v'} onClick={() => shift(1)}>
            ▼
          </button>
        </div>
      </div>

      <div className="game-status">
        <span className="big-count">{moves}</span> moves made · it can be done in 20
        <button
          className="btn ghost"
          onClick={() => {
            setCars(CARS)
            setMoves(0)
            setSel(null)
          }}
        >
          Reset the car park
        </button>
      </div>
    </div>
  )
}
