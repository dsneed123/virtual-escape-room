import { MASTERMIND_CODE, MASTERMIND_COLOURS, MASTERMIND_GUESSES } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

interface Row {
  guess: number[]
  exact: number
  loose: number
}

function score(guess: number[]): { exact: number; loose: number } {
  const code = [...MASTERMIND_CODE]
  const g = [...guess]
  let exact = 0
  for (let i = 0; i < 4; i++)
    if (g[i] === code[i]) {
      exact++
      code[i] = -1
      g[i] = -2
    }
  let loose = 0
  for (let i = 0; i < 4; i++) {
    const j = code.indexOf(g[i])
    if (g[i] >= 0 && j >= 0) {
      loose++
      code[j] = -1
    }
  }
  return { exact, loose }
}

export default function CodeBreaker({ onWin, won }: GameProps) {
  const [rows, setRows] = useScratch<Row[]>('code.rows', [])
  const [draft, setDraft] = useScratch<number[]>('code.draft', [])
  const out = rows.length >= MASTERMIND_GUESSES

  const submit = () => {
    if (draft.length !== 4 || won || out) return
    const { exact, loose } = score(draft)
    setRows([...rows, { guess: draft, exact, loose }])
    setDraft([])
    if (exact === 4) onWin()
    else play(rows.length + 1 >= MASTERMIND_GUESSES ? 'error' : 'tap')
  }

  return (
    <div className="game-wrap">
      <div className="mm-board">
        {rows.map((row, i) => (
          <div className="mm-row" key={i}>
            <span className="mm-num">{String(i + 1).padStart(2, '0')}</span>
            {row.guess.map((g, j) => (
              <span key={j} className="mm-peg" style={{ background: MASTERMIND_COLOURS[g] }} />
            ))}
            <span className="mm-dots">
              {Array.from({ length: row.exact }, (_, k) => (
                <i key={`e${k}`} className="dot exact" title="right colour, right slot" />
              ))}
              {Array.from({ length: row.loose }, (_, k) => (
                <i key={`l${k}`} className="dot loose" title="right colour, wrong slot" />
              ))}
              {row.exact + row.loose === 0 && <em>nothing</em>}
            </span>
          </div>
        ))}
        {rows.length === 0 && <p className="game-msg">No guesses yet. Build one below.</p>}
      </div>

      {!won && !out && (
        <div className="mm-entry">
          <div className="mm-slots">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className="mm-slot"
                style={draft[i] != null ? { background: MASTERMIND_COLOURS[draft[i]] } : undefined}
                onClick={() => setDraft(draft.filter((_, j) => j !== i))}
                aria-label={`slot ${i + 1}`}
              />
            ))}
          </div>
          <div className="mm-palette">
            {MASTERMIND_COLOURS.map((c, i) => (
              <button
                key={i}
                className="mm-chip"
                style={{ background: c }}
                disabled={draft.length >= 4}
                onClick={() => {
                  play('tap')
                  setDraft([...draft, i])
                }}
                aria-label={`colour ${i + 1}`}
              />
            ))}
          </div>
          <button className="btn primary" disabled={draft.length !== 4} onClick={submit}>
            Submit guess
          </button>
        </div>
      )}

      <div className="game-status">
        <span className="big-count">{MASTERMIND_GUESSES - rows.length}</span> guesses left
        {out && !won && (
          <>
            <span className="warnline">Out of guesses — the machine resets itself, no penalty.</span>
            <button className="btn ghost" onClick={() => setRows([])}>
              Reset the machine
            </button>
          </>
        )}
      </div>
    </div>
  )
}
