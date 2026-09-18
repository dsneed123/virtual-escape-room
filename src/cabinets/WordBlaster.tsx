import { useEffect, useState } from 'react'
import { WORDS, WORD_GUESSES } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

function mark(guess: string, answer: string): ('hit' | 'near' | 'miss')[] {
  const res: ('hit' | 'near' | 'miss')[] = Array(5).fill('miss')
  const left = answer.split('')
  for (let i = 0; i < 5; i++)
    if (guess[i] === answer[i]) {
      res[i] = 'hit'
      left[i] = '·'
    }
  for (let i = 0; i < 5; i++) {
    if (res[i] === 'hit') continue
    const j = left.indexOf(guess[i])
    if (j >= 0) {
      res[i] = 'near'
      left[j] = '·'
    }
  }
  return res
}

function Board({ answer, guesses }: { answer: string; guesses: string[] }) {
  const done = guesses.includes(answer)
  const rows = Array.from({ length: WORD_GUESSES }, (_, i) => guesses[i] ?? '')
  return (
    <div className={`wb-board${done ? ' done' : ''}`}>
      {rows.map((g, r) => {
        const marks = g ? mark(g, answer) : []
        const dim = done && guesses.indexOf(answer) < r
        return (
          <div className="wb-row" key={r} style={dim ? { opacity: 0.25 } : undefined}>
            {Array.from({ length: 5 }, (_, c) => (
              <span key={c} className={`wb-cell ${g ? marks[c] : ''}`}>
                {g[c] ?? ''}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default function WordBlaster({ onWin, won }: GameProps) {
  const [guesses, setGuesses] = useScratch<string[]>('word.guesses', [])
  const [draft, setDraft] = useState('')
  const solved = WORDS.every((w) => guesses.includes(w))
  const out = guesses.length >= WORD_GUESSES

  useEffect(() => {
    if (solved && !won) onWin()
  }, [solved, won, onWin])

  const submit = () => {
    if (draft.length !== 5 || out || solved) return
    play('tap')
    setGuesses([...guesses, draft])
    setDraft('')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter') submit()
      else if (e.key === 'Backspace') setDraft((d) => d.slice(0, -1))
      else if (/^[a-zA-Z]$/.test(e.key)) setDraft((d) => (d.length < 5 ? d + e.key.toUpperCase() : d))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="game-wrap">
      <div className="wb-boards">
        {WORDS.map((w) => (
          <Board key={w} answer={w} guesses={guesses} />
        ))}
      </div>

      {!solved && !out && (
        <>
          <div className="wb-draft">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="wb-cell draft">
                {draft[i] ?? ''}
              </span>
            ))}
          </div>
          <div className="wb-keys">
            {ROWS.map((row, i) => (
              <div className="wb-keyrow" key={i}>
                {i === 2 && (
                  <button className="wb-key wide" onClick={submit} disabled={draft.length !== 5}>
                    ENTER
                  </button>
                )}
                {row.split('').map((k) => (
                  <button
                    key={k}
                    className="wb-key"
                    onClick={() => setDraft((d) => (d.length < 5 ? d + k : d))}
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
        </>
      )}

      <div className="game-status">
        <span className="big-count">{Math.max(0, WORD_GUESSES - guesses.length)}</span> guesses left for both words
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
