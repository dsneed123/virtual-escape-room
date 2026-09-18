import { CODE, CODE_CLUES, CODE_FREE_GUESSES } from '../game/arcade'
import { useCooldown } from './useCooldown'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { GameProps } from './types'

interface Row {
  guess: string
  inPlace: number
  moved: number
}

function judge(guess: string): { inPlace: number; moved: number } {
  const g = guess.split('')
  const s = CODE.split('')
  let inPlace = 0
  for (let i = 0; i < 4; i++)
    if (g[i] === s[i]) {
      inPlace++
      g[i] = 'x'
      s[i] = 'y'
    }
  let moved = 0
  for (let i = 0; i < 4; i++) {
    if (g[i] === 'x') continue
    const j = s.indexOf(g[i])
    if (j >= 0) {
      moved++
      s[j] = 'y'
    }
  }
  return { inPlace, moved }
}

export function verdict({ inPlace, moved }: { inPlace: number; moved: number }) {
  if (!inPlace && !moved) return 'nothing correct'
  const bits: string[] = []
  if (inPlace) bits.push(`${inPlace} correct and in the right place`)
  if (moved) bits.push(`${moved} correct but in the wrong place`)
  return bits.join(' · ')
}

export default function CodeBreaker({ onWin, won }: GameProps) {
  const [rows, setRows] = useScratch<Row[]>('code.rows', [])
  const [draft, setDraft] = useScratch<string>('code.draft', '')
  const { cooling, register, clear } = useCooldown('code', CODE_FREE_GUESSES)

  const submit = () => {
    if (draft.length !== 4 || won || cooling) return
    const { inPlace, moved } = judge(draft)
    setRows([...rows, { guess: draft, inPlace, moved }])
    setDraft('')
    if (inPlace === 4) {
      onWin()
      return
    }
    play('tap')
    register()
  }

  return (
    <div className="game-wrap">
      <div className="code-sheet">
        <div className="code-head">THE MACHINE&rsquo;S OWN ATTEMPTS, EARLIER TONIGHT</div>
        {CODE_CLUES.map((c) => (
          <div className="code-row given" key={c.guess}>
            <span className="code-digits">{c.guess}</span>
            <span className="code-verdict">{verdict(c)}</span>
          </div>
        ))}
        {rows.length > 0 && <div className="code-head">YOURS</div>}
        {rows.map((r, i) => (
          <div className={`code-row${r.inPlace === 4 ? ' solved' : ''}`} key={i}>
            <span className="code-digits">{r.guess}</span>
            <span className="code-verdict">{r.inPlace === 4 ? 'THAT IS THE CODE' : verdict(r)}</span>
          </div>
        ))}
      </div>

      {!won && (
        <>
          <div className="code-entry">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`code-slot${draft[i] ? ' full' : ''}`}>
                {draft[i] ?? '·'}
              </span>
            ))}
          </div>
          <div className="code-pad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((n) => (
              <button
                key={n}
                className="btn"
                disabled={draft.length >= 4}
                onClick={() => {
                  play('tap')
                  setDraft(draft + n)
                }}
              >
                {n}
              </button>
            ))}
            <button className="btn ghost" onClick={() => setDraft(draft.slice(0, -1))} disabled={!draft}>
              ⌫
            </button>
            <button className="btn primary" onClick={submit} disabled={draft.length !== 4 || cooling > 0}>
              {cooling ? `WAIT ${cooling}s` : 'TRY IT'}
            </button>
          </div>
        </>
      )}

      <div className="game-status">
        <span className="big-count">{rows.length}</span> guess{rows.length === 1 ? '' : 'es'} · unlimited
        {cooling > 0 && <span className="warnline">MACHINE COOLING — {cooling}s</span>}
        <button
          className="btn ghost"
          onClick={() => {
            setRows([])
            clear()
          }}
        >
          Clear your attempts
        </button>
      </div>
    </div>
  )
}
