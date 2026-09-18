import { useEffect, useState } from 'react'
import { CABINETS } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'

const REJECT = [
  'BUZZ: "Nope. That spells nothing. Try again."',
  'BUZZ: "The machine made a noise. The noise means no."',
  'BUZZ: "Wrong. And I was rooting for you, genuinely."',
  'BUZZ: "That is not a word, and I have read three."',
]

export default function PrizeCounter({ onEscape }: { onEscape: () => void }) {
  const [slots, setSlots] = useScratch<(string | null)[]>('prize.slots', Array(CABINETS.length).fill(null))
  const [msg, setMsg] = useState('')
  const [bad, setBad] = useState(false)

  // a slot list saved by an older build may be the wrong length
  useEffect(() => {
    if (slots.length !== CABINETS.length) setSlots(Array(CABINETS.length).fill(null))
  }, [slots.length, setSlots])

  const order = [...CABINETS].sort((a, b) => a.score - b.score)
  const answer = order.map((c) => c.id)
  const full = slots.length === CABINETS.length && slots.every(Boolean)
  const cabOf = (id: string) => CABINETS.find((c) => c.id === id)!

  const place = (id: string) => {
    play('tap')
    setSlots((s) => {
      const next = [...s]
      const i = next.indexOf(null)
      if (i >= 0) next[i] = id
      return next
    })
  }
  const lift = (i: number) => {
    play('tap')
    setSlots((s) => s.map((v, j) => (j === i ? null : v)))
  }

  const cash = () => {
    if (!full) return
    if (slots.length === answer.length && slots.every((id, i) => id === answer[i])) {
      play('solve')
      onEscape()
      return
    }
    play('error')
    setBad(true)
    setMsg(REJECT[Math.floor(Math.random() * REJECT.length)])
    window.setTimeout(() => setBad(false), 450)
  }

  const word = slots.map((id) => (id ? cabOf(id).token : '_')).join('')

  return (
    <div className="prize-room">
      <div className="cols">
        <div className="panel">
          <h3 className="panel-title">Your {CABINETS.length} tokens</h3>
          <div className="token-tray">
            {CABINETS.map((c) => (
              <button
                key={c.id}
                className={`token${slots.includes(c.id) ? ' used' : ''}`}
                onClick={() => place(c.id)}
                disabled={slots.includes(c.id)}
              >
                <span className="token-letter">{c.token}</span>
                <span className="token-from">{c.name}</span>
              </button>
            ))}
          </div>
          <p className="note" style={{ marginBottom: 0 }}>
            Click a token to drop it into the next empty slot. Click a slot to take it back out.
          </p>
        </div>

        <div className="panel">
          <h3 className="panel-title">BUZZ, from behind the counter</h3>
          <p style={{ marginTop: 0, fontSize: '1.06rem' }}>
            &ldquo;{CABINETS.length} tokens, {CABINETS.length} letters, and you want the door. Fine. But I am not
            letting anybody out who just jams them in any old order.&rdquo;
          </p>
          <p style={{ fontSize: '1.06rem' }}>
            &ldquo;Every machine on this floor has been showing you its high score all night. Every single one. Line
            the tokens up the way the machines rank themselves &mdash; worst score first, best score last &mdash; and
            read what you get.&rdquo;
          </p>
          <p className="note" style={{ marginBottom: 0 }}>
            The scores are on the cabinets back on the floor, and on the token slots below.
          </p>
        </div>
      </div>

      <div className={`prize-slots${bad ? ' bad' : ''}`}>
        {slots.map((id, i) => (
          <button key={i} className={`prize-slot${id ? ' full' : ''}`} onClick={() => id && lift(i)}>
            <span className="slot-num">{i + 1}</span>
            {id ? (
              <>
                <span className="token-letter">{cabOf(id).token}</span>
                <span className="token-from">{cabOf(id).name}</span>
              </>
            ) : (
              <span className="token-letter dim">?</span>
            )}
          </button>
        ))}
      </div>

      <div className="prize-actions">
        <div className="prize-word">{word}</div>
        <button className="btn primary big" disabled={!full} onClick={cash}>
          CASH IN
        </button>
        <button className="btn ghost" onClick={() => setSlots(Array(CABINETS.length).fill(null))}>
          Clear
        </button>
      </div>
      {msg && <p className="game-msg warn">{msg}</p>}
    </div>
  )
}
