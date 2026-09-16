import AnswerLock from '../components/AnswerLock'
import { S1_GATES, S1_NOTES, S1_ROSTER, S1_TIMES } from '../game/content'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { StageProps } from './types'

const MARKS = ['', '✓', '✕']

function Grid({ id, cols, readOnly }: { id: string; cols: string[]; readOnly?: boolean }) {
  const [marks, setMarks] = useScratch<Record<string, number>>(`s1.${id}`, {})
  const rows = S1_ROSTER.slice(0, 5).map((r) => r.name)
  return (
    <table className="lgrid">
      <thead>
        <tr>
          <th />
          {cols.map((c) => (
            <th key={c} className="vert">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r}>
            <th style={{ textAlign: 'right' }}>{r}</th>
            {cols.map((c) => {
              const k = `${r}|${c}`
              const v = marks[k] ?? 0
              return (
                <td key={c}>
                  <button
                    type="button"
                    className={v === 1 ? 'yes' : v === 2 ? 'no' : ''}
                    aria-label={`${r} ${c}`}
                    onClick={() => {
                      if (readOnly) return
                      play('tap')
                      setMarks((m) => ({ ...m, [k]: ((m[k] ?? 0) + 1) % 3 }))
                    }}
                  >
                    {MARKS[v]}
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Stage1({ def, onSolved, readOnly }: StageProps) {
  return (
    <>
      <div className="cols">
        <div className="panel" style={{ flex: '0 1 340px' }}>
          <h3 className="panel-title">Personnel on station</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Codename</th>
                <th className="num">Clearance seal</th>
              </tr>
            </thead>
            <tbody>
              {S1_ROSTER.map((r) => (
                <tr key={r.name}>
                  <td style={{ color: r.name === '[SEALED]' ? 'var(--dimmer)' : undefined }}>{r.name}</td>
                  <td className="num" style={{ color: 'var(--dim)' }}>
                    {r.seal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note" style={{ marginBottom: 0 }}>
            One sealed record. CONTROL will not open it.
          </p>
        </div>

        <div className="panel" style={{ flex: '0 1 420px' }}>
          <h3 className="panel-title">Gate recorder — 9 NOV</h3>
          <p className="note" style={{ marginTop: 0 }}>
            Five departures. One per gate. The recorder kept the times but lost the names.
          </p>
          <div className="cols" style={{ gap: 10 }}>
            <div>
              <div className="lock-label" style={{ marginBottom: 6 }}>
                GATES IN SERVICE
              </div>
              {S1_GATES.map((g) => (
                <div key={g} style={{ fontSize: '1.15rem', letterSpacing: '0.12em' }}>
                  {g}
                </div>
              ))}
            </div>
            <div>
              <div className="lock-label" style={{ marginBottom: 6 }}>
                TIMES LOGGED
              </div>
              {S1_TIMES.map((t) => (
                <div key={t} style={{ fontSize: '1.15rem', letterSpacing: '0.12em' }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="hint-box" style={{ marginTop: 14 }}>
            <b>TIME STANDARD NOTICE</b>
            <br />
            The DOCK and WEST gates are wired to Array Standard, which runs <b>eight minutes ahead</b> of station
            time. Every other gate logs station time. The recorder writes down whatever the gate tells it.
          </div>
        </div>

        <div className="panel" style={{ flex: '1 1 380px' }}>
          <h3 className="panel-title">Forensic notes</h3>
          <ol className="mono-list">
            {S1_NOTES.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h3 className="panel-title">Working grid — click a cell to mark it ✓ or ✕</h3>
        <div className="cols" style={{ gap: 40 }}>
          <div style={{ flex: '0 0 auto' }}>
            <Grid id="gate" cols={S1_GATES} readOnly={readOnly} />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <Grid id="time" cols={S1_TIMES} readOnly={readOnly} />
          </div>
        </div>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
