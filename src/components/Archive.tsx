import { useState } from 'react'
import { STAGES } from '../game/content'
import type { Solve } from '../game/state'
import { STAGE_BODIES } from '../stages'

interface Props {
  solves: Solve[]
  onClose: () => void
}

export default function Archive({ solves, onClose }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const done = STAGES.filter((s) => solves.some((x) => x.stage === s.n) && s.n <= 7)
  const Body = open ? STAGE_BODIES[open] : null
  const openDef = STAGES.find((s) => s.n === open)

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet wide">
        <div className="kicker">RECOVERY ARCHIVE</div>
        <h2>FRAGMENTS &amp; PLATES</h2>
        <p className="note">
          Everything a door gave up stays here. Plates can be reopened at any time — nothing you found is ever taken
          away from you.
        </p>

        <table className="data" style={{ fontSize: '1.05rem', marginTop: 10 }}>
          <thead>
            <tr>
              <th>Door</th>
              <th>Channel</th>
              <th>Fragment</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {done.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--dimmer)' }}>
                  No doors opened yet.
                </td>
              </tr>
            )}
            {done.map((s) => (
              <tr key={s.n}>
                <td>
                  {s.n} · {s.title}
                </td>
                <td style={{ color: 'var(--accent)', letterSpacing: '0.16em' }}>{s.channel}</td>
                <td style={{ letterSpacing: '0.22em' }}>{solves.find((x) => x.stage === s.n)?.fragment}</td>
                <td className="num">
                  <button className="btn ghost" onClick={() => setOpen(open === s.n ? null : s.n)}>
                    {open === s.n ? 'Close plate' : 'Reopen plate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {Body && openDef && (
          <div style={{ marginTop: 22, borderTop: '1px solid var(--line)', paddingTop: 18 }}>
            <div className="kicker">DOOR {openDef.n} — {openDef.title}</div>
            <Body def={openDef} onSolved={() => {}} readOnly />
          </div>
        )}

        <div className="sheet-actions">
          <button className="btn primary" onClick={onClose}>
            Back to the door
          </button>
        </div>
      </div>
    </div>
  )
}
