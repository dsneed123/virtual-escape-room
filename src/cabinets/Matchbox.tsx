import { useEffect, useState } from 'react'
import { MEMORY_DECK } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

export default function Matchbox({ onWin, won }: GameProps) {
  const [matched, setMatched] = useScratch<number[]>('match.done', [])
  const [flipped, setFlipped] = useState<number[]>([])
  const [tries, setTries] = useScratch<number>('match.tries', 0)
  const solved = matched.length === MEMORY_DECK.length

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  useEffect(() => {
    if (flipped.length !== 2) return
    const [a, b] = flipped
    if (MEMORY_DECK[a] === MEMORY_DECK[b]) {
      play('tap')
      setMatched((m) => [...m, a, b])
      setFlipped([])
      return
    }
    const id = window.setTimeout(() => setFlipped([]), 900)
    return () => window.clearTimeout(id)
  }, [flipped, setMatched])

  const click = (i: number) => {
    if (won || matched.includes(i) || flipped.includes(i) || flipped.length === 2) return
    play('tap')
    if (flipped.length === 1) setTries(tries + 1)
    setFlipped([...flipped, i])
  }

  return (
    <div className="game-wrap">
      <div className="match-grid">
        {MEMORY_DECK.map((icon, i) => {
          const up = matched.includes(i) || flipped.includes(i)
          return (
            <button
              key={i}
              className={`card${up ? ' up' : ''}${matched.includes(i) ? ' done' : ''}`}
              onClick={() => click(i)}
              aria-label={up ? `card ${i + 1}, ${icon}` : `card ${i + 1}, face down`}
            >
              {up ? icon : '?'}
            </button>
          )
        })}
      </div>
      <div className="game-status">
        <span className="big-count">{matched.length / 2}</span> of 8 pairs · {tries} flips
        <button className="btn ghost" onClick={() => { setMatched([]); setFlipped([]); setTries(0) }}>
          Shuffle back over
        </button>
      </div>
    </div>
  )
}
