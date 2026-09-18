import { useEffect, useState } from 'react'
import { WORD, WORD_GUESSES } from '../game/arcade'
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
  const out = guesses.length >= WORD_GUESSES

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const submit = () => {
    if (draft.length !== LEN || out || solved) return
    play('tap')
    setGuesses([...guesses, draft])
    setDraft('')
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
        {Array.from({ length: WORD_GUESSES }, (_, r) => {
          const g = guesses[r] ?? (r === guesses.length && !solved && !out ? draft : '')
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

      {!solved && !out && (
        <div className="wb-keys">
          {ROWS.map((row, i) => (
            <div className="wb-keyrow" key={i}>
              {i === 2 && (
                <button className="wb-key wide" onClick={submit} disabled={draft.length !== LEN}>
                  ENTER
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
        <span className="big-count">{Math.max(0, WORD_GUESSES - guesses.length)}</span> guesses left ·{' '}
        {LEN} letters
        {out && !solved && (
          <>
            <span className="warnline">Out of guesses — the machine clears itself, no penalty.</span>
            <button className="btn ghost" onClick={() => setGuesses([])}>
              Clear and retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}
