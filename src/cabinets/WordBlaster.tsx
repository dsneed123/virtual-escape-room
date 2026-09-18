import { useEffect, useState } from 'react'
import { WORD, WORD_FREE_GUESSES } from '../game/arcade'
import { useCooldown } from './useCooldown'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
const LEN = WORD.length

function mark(guess: string): ('hit' | 'near' | 'miss')[] {
  const res: ('hit' | 'near' | 'miss')[] = Array(LEN).fill('miss')
  const left = WORD.split('')
  for (let i = 0; i < LEN; i++)
    if (guess[i] === WORD[i]) {
      res[i] = 'hit'
      left[i] = '·'
    }
  for (let i = 0; i < LEN; i++) {
    if (res[i] === 'hit') continue
    const j = left.indexOf(guess[i])
    if (j >= 0) {
      res[i] = 'near'
      left[j] = '·'
    }
  }
  return res
}

export default function WordBlaster({ onWin, won }: GameProps) {
  const [guesses, setGuesses] = useScratch<string[]>('word.guesses', [])
  const [draft, setDraft] = useState('')
  const solved = guesses.includes(WORD)
  const { cooling, register, clear } = useCooldown('word', WORD_FREE_GUESSES)

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const submit = () => {
    if (draft.length !== LEN || solved || cooling) return
    play(draft === WORD ? 'solve' : 'tap')
    setGuesses([...guesses, draft])
    setDraft('')
    if (draft !== WORD) register()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter') submit()
      else if (e.key === 'Backspace') setDraft((d) => d.slice(0, -1))
      else if (/^[a-zA-Z]$/.test(e.key)) setDraft((d) => (d.length < LEN ? d + e.key.toUpperCase() : d))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // grey out letters already proved absent — the only help the machine gives
  const dead = new Set<string>()
  for (const g of guesses) {
    const m = mark(g)
    g.split('').forEach((ch, i) => {
      if (m[i] === 'miss' && !WORD.includes(ch)) dead.add(ch)
    })
  }

  return (
    <div className="game-wrap">
      <div className="wb-board">
        {Array.from({ length: Math.max(6, guesses.length + 1) }, (_, r) => {
          const g = guesses[r] ?? (r === guesses.length && !solved ? draft : '')
          const live = r === guesses.length
          const marks = guesses[r] ? mark(guesses[r]) : []
          return (
            <div className="wb-row" key={r}>
              {Array.from({ length: LEN }, (_, c) => (
                <span key={c} className={`wb-cell ${guesses[r] ? marks[c] : live && g[c] ? 'draft' : ''}`}>
                  {g[c] ?? ''}
                </span>
              ))}
            </div>
          )
        })}
      </div>

      {!solved && (
        <div className="wb-keys">
          {ROWS.map((row, i) => (
            <div className="wb-keyrow" key={i}>
              {i === 2 && (
                <button className="wb-key wide" onClick={submit} disabled={draft.length !== LEN || cooling > 0}>
                  {cooling ? `${cooling}s` : 'ENTER'}
                </button>
              )}
              {row.split('').map((k) => (
                <button
                  key={k}
                  className={`wb-key${dead.has(k) ? ' dead' : ''}`}
                  onClick={() => setDraft((d) => (d.length < LEN ? d + k : d))}
                >
                  {k}
                </button>
              ))}
              {i === 2 && (
                <button className="wb-key wide" onClick={() => setDraft((d) => d.slice(0, -1))}>
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="game-status">
        <span className="big-count">{guesses.length}</span> guess{guesses.length === 1 ? '' : 'es'} · {LEN} letters ·
        unlimited
        {cooling > 0 && <span className="warnline">MACHINE COOLING — {cooling}s</span>}
        <button
          className="btn ghost"
          onClick={() => {
            setGuesses([])
            clear()
          }}
        >
          Wipe the board
        </button>
      </div>
    </div>
  )
}
