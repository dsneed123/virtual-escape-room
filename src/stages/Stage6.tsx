import { useLock } from '../components/AnswerLock'
import { S6_NOTES, S6_SEGMENTS, S6_TRAY } from '../game/content'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { StageProps } from './types'

const letterOf = (id: string) => S6_SEGMENTS.find((s) => s.id === id)?.letter ?? '?'

export default function Stage6({ def, onSolved, readOnly }: StageProps) {
  const [slots, setSlots] = useScratch<(string | null)[]>('s6.slots', Array(8).fill(null))
  const { submit, msg, bad, cooling } = useLock(def.hash, def.frag, onSolved)
  const assembled = slots.map((s) => (s ? letterOf(s) : '')).join('')
  const full = slots.every(Boolean)

  const place = (id: string) => {
    if (readOnly) return
    play('tap')
    setSlots((s) => {
      const next = [...s]
      const i = next.indexOf(null)
      if (i >= 0) next[i] = id
      return next
    })
  }
  const lift = (i: number) => {
    if (readOnly) return
    play('tap')
    setSlots((s) => s.map((v, j) => (j === i ? null : v)))
  }

  return (
    <>
      <div className="cols">
        <div className="panel" style={{ flex: '1 1 420px' }}>
          <h3 className="panel-title">Forensic notes on the splice</h3>
          <ol className="mono-list" style={{ fontSize: '1.02rem' }}>
            {S6_NOTES.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
        </div>

        <div className="panel" style={{ flex: '1 1 420px' }}>
          <h3 className="panel-title">Evidence 44-C — segments recovered</h3>
          <div className="tray">
            {S6_TRAY.map((id) => (
              <button
                type="button"
                key={id}
                className={`tile${slots.includes(id) ? ' placed' : ''}`}
                onClick={() => place(id)}
              >
                <div className="lt">&#9646;&#9646;</div>
                <div className="id">{id}</div>
              </button>
            ))}
          </div>
          <p className="note" style={{ marginBottom: 0, marginTop: 12 }}>
            Click a segment to drop it into the next open position. Click a placed segment to lift it out again. The
            frame letters are burned into the tape but will not read out until the splice is locked.
          </p>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h3 className="panel-title">Reel — rebuild the order</h3>
        <div className="slots">
          {slots.map((id, i) => (
            <button type="button" key={i} className={`slot${id ? ' full' : ''}`} onClick={() => id && lift(i)}>
              <div className="pos">{String(i + 1).padStart(2, '0')}</div>
              {id ? (
                <>
                  <div className="lt" style={{ fontSize: '1.4rem', color: 'var(--accent)' }}>
                    &#9646;&#9646;
                  </div>
                  <div className="id">{id}</div>
                </>
              ) : (
                <div style={{ fontSize: '1.4rem' }}>·</div>
              )}
            </button>
          ))}
        </div>

        {!readOnly && (
          <div className={`lock${bad ? ' bad' : ''}`} style={{ marginTop: 18 }}>
            <span className="lock-label">{def.prompt}</span>
            <div
              style={{
                flex: '1 1 260px',
                fontSize: '1.5rem',
                letterSpacing: '0.24em',
                color: full ? 'var(--accent)' : 'var(--dimmer)',
              }}
            >
              {slots.filter(Boolean).length} / 8 SPLICED
            </div>
            <button
              className="btn primary"
              type="button"
              disabled={!full || cooling > 0}
              onClick={() => submit(assembled)}
            >
              {cooling ? `WAIT ${cooling}s` : 'LOCK THE SPLICE'}
            </button>
            <button className="btn ghost" type="button" onClick={() => setSlots(Array(8).fill(null))}>
              CLEAR
            </button>
            <div className={`lock-msg${cooling ? ' cool' : ''}`}>
              {cooling ? `MECHANISM COOLING — ${cooling}s` : msg}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
