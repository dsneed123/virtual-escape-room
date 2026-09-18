import { useEffect, useRef, useState } from 'react'
import { CABINETS, TICKET_TARGET } from '../game/arcade'
import type { Token } from '../game/state'
import { clock } from '../game/state'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'

const letters = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '')
const digitsOf = (s: string) => (s.match(/\d/g) ?? []).map(Number)

function roman(n: number): string {
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  let left = n
  for (const [v, sym] of table) while (left >= v) { out += sym; left -= v }
  return out
}

interface Rule {
  n: number
  text: (ctx: Ctx) => string
  ok: (pw: string, ctx: Ctx) => boolean
}

interface Ctx {
  order: typeof CABINETS
  word: string
  best: number
  target: number
}

const RULES: Rule[] = [
  { n: 1, text: () => 'At least 15 characters. RAJA counts.', ok: (pw) => pw.length >= 15 },
  { n: 2, text: () => 'Must contain a number. RAJA is not negotiating on this.', ok: (pw) => /\d/.test(pw) },
  { n: 3, text: () => 'Must contain a capital letter.', ok: (pw) => /[A-Z]/.test(pw) },
  { n: 4, text: () => 'Must contain one of these: ! ? * #', ok: (pw) => /[!?*#]/.test(pw) },
  {
    n: 5,
    text: () => 'Must contain the name of a machine you beat tonight (letters only — spaces and numbers do not count).',
    ok: (pw, ctx) => ctx.order.some((c) => letters(pw).includes(letters(c.name))),
  },
  {
    n: 6,
    text: () => 'Must contain the name of the tiger. He is standing right there and he can read.',
    ok: (pw) => letters(pw).includes('RAJA'),
  },
  {
    n: 7,
    text: (ctx) =>
      `Must contain your ${ctx.order.length} tokens, in one run, ordered by each machine's HIGH SCORE, lowest first. The scores are on the ticket beside you.`,
    ok: (pw, ctx) => letters(pw).includes(ctx.word),
  },
  {
    n: 8,
    text: (ctx) => `Must contain the biggest high score on the floor (${ctx.best.toLocaleString()}) — digits only, no comma.`,
    ok: (pw, ctx) => pw.includes(String(ctx.best)),
  },
  {
    n: 9,
    text: (ctx) =>
      `RAJA is a traditionalist. The number of tickets he asked you for must appear as a Roman numeral, spelled properly (${ctx.target} of them).`,
    ok: (pw, ctx) => letters(pw).includes(roman(ctx.target)),
  },
  {
    n: 10,
    text: () => 'Right. Last one. All the digits in your password must add up to exactly 25.',
    ok: (pw) => digitsOf(pw).reduce((a, b) => a + b, 0) === 25,
  },
]

export default function PasswordGame({ tokens, onEscape }: { tokens: Token[]; onEscape: () => void }) {
  const [pw, setPw] = useScratch<string>('password.value', '')
  const [shake, setShake] = useState(false)
  const solvedOnce = useRef(false)

  // only the machines this team actually beat, in high-score order
  const order = CABINETS.filter((c) => tokens.some((t) => t.id === c.id)).sort((a, b) => a.score - b.score)
  const fastestToken = [...tokens].sort((a, b) => a.at - b.at)[0]
  const fastest = CABINETS.find((c) => c.id === fastestToken?.id)?.name
  const ctx: Ctx = {
    order,
    word: order.map((c) => c.token).join(''),
    best: Math.max(...CABINETS.map((c) => c.score)),
    target: TICKET_TARGET,
  }

  const states = RULES.map((r) => r.ok(pw, ctx))
  // reveal one rule at a time, exactly like the original: the next rule appears
  // only once everything above it is satisfied
  let revealed = 0
  while (revealed < RULES.length && states[revealed]) revealed++
  revealed = Math.min(RULES.length, revealed + 1)
  const all = states.every(Boolean)

  useEffect(() => {
    if (all && !solvedOnce.current) {
      solvedOnce.current = true
      play('solve')
      onEscape()
    }
  }, [all, onEscape])

  const visible = RULES.slice(0, revealed)
    .map((r, i) => ({ rule: r, ok: states[i] }))
    .reverse()

  return (
    <div className="pw-room">
      <div className="cols">
        <div className="panel pw-main">
          <h3 className="panel-title">The shutter keypad — RAJA is reading over your shoulder</h3>
          <p className="note" style={{ marginTop: 0 }}>
            Type a password. Every time you satisfy a rule the next one appears, and the new one will almost certainly
            break something you had already got right. That is the game.
          </p>
          <textarea
            className={`pw-input${shake ? ' bad' : ''}`}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            spellCheck={false}
            rows={3}
            placeholder="start typing…"
            aria-label="password"
          />
          <div className="pw-meta">
            <span>{pw.length} characters</span>
            <span>digits add up to {digitsOf(pw).reduce((a, b) => a + b, 0)}</span>
            <span>
              rule {Math.min(revealed, RULES.length)} of {RULES.length}
            </span>
            <button
              className="btn ghost"
              onClick={() => {
                setPw('')
                setShake(true)
                window.setTimeout(() => setShake(false), 400)
              }}
            >
              Clear
            </button>
          </div>

          <div className="pw-rules">
            {visible.map(({ rule, ok }) => (
              <div key={rule.n} className={`pw-rule${ok ? ' ok' : ''}`}>
                <span className="pw-num">RULE {rule.n}</span>
                <span className="pw-text">{rule.text(ctx)}</span>
                <span className="pw-mark">{ok ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3 className="panel-title">Your ticket — what you beat, by high score</h3>
          <table className="pw-ticket">
            <tbody>
              {order.map((c) => {
                const t = tokens.find((x) => x.id === c.id)
                return (
                  <tr key={c.id}>
                    <td className="pw-tok">{c.token}</td>
                    <td>{c.name}</td>
                    <td className="pw-score">{c.score.toLocaleString()}</td>
                    <td className="pw-when">{t ? clock(t.at) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="note" style={{ marginBottom: 0 }}>
            Last column is the clock when you beat each machine.
            {fastest && ` Quickest tonight: ${fastest}.`}
          </p>
        </div>
      </div>
    </div>
  )
}
