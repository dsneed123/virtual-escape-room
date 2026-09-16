import AnswerLock from '../components/AnswerLock'
import { S2_ROWS } from '../game/content'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { StageProps } from './types'

export default function Stage2({ def, onSolved, readOnly }: StageProps) {
  const [lit, setLit] = useScratch<string[]>('s2.lit', [])

  return (
    <>
      <div className="cols">
        <div className="panel" style={{ flex: '2 1 560px' }}>
          <h3 className="panel-title">Intercept log — recovered order</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Burst</th>
                <th>Heard at</th>
                <th>Callsign</th>
                <th className="num">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {S2_ROWS.map((r) => (
                <tr
                  key={r.id}
                  className={`pick${lit.includes(r.id) ? ' lit' : ''}`}
                  onClick={() => {
                    if (readOnly) return
                    play('tap')
                    setLit((l) => (l.includes(r.id) ? l.filter((x) => x !== r.id) : [...l, r.id]))
                  }}
                >
                  <td style={{ color: 'var(--dim)' }}>{r.id}</td>
                  <td>{r.t}</td>
                  <td style={{ letterSpacing: '0.1em' }}>{r.call}</td>
                  <td className="num">{r.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel" style={{ flex: '1 1 320px' }}>
          <h3 className="panel-title">Recorder certificate</h3>
          <p>
            <b>UNIT:</b> ARRAY WESTWARD EAR / RECORDER 4
            <br />
            <b>CARRIER:</b> held steady all night. The unit steps the carrier by the same amount for every burst it
            takes, in the order it hears them.
            <br />
            <b>FAULT:</b> the unit wrote the bursts to tape in the order it recovered them from its own buffer.
          </p>
          <div className="hint-box">
            Vance, in the margin of the certificate:
            <br />
            <b>&ldquo;The carrier never lies. Where it runs long, it is counting something, and it is always counting
            inside a name.&rdquo;</b>
          </div>
          <p className="note" style={{ marginBottom: 0 }}>
            Click any row to mark it. The team can work the table in parallel.
          </p>
        </div>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
