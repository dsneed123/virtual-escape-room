import AnswerLock from '../components/AnswerLock'
import { S3_GRID, S3_ROOMS, S3_ROUTE, S3_START } from '../game/content'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { StageProps } from './types'

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

function Compass() {
  return (
    <div className="compass" aria-label="compass rose as printed on plate nine">
      <span style={{ bottom: 6, left: '50%', transform: 'translateX(-50%)', color: 'var(--accent)', fontWeight: 700 }} aria-label="north — printed at the foot of the plate">N</span>
      <span style={{ top: 6, left: '50%', transform: 'translateX(-50%)' }} aria-label="south — printed at the head of the plate">S</span>
      <span style={{ left: 8, top: '50%', transform: 'translateY(-50%)' }} aria-label="east — printed at the left of the plate">E</span>
      <span style={{ right: 8, top: '50%', transform: 'translateY(-50%)' }} aria-label="west — printed at the right of the plate">W</span>
      <div className="needle" />
    </div>
  )
}

export default function Stage3({ def, onSolved, readOnly }: StageProps) {
  const [lit, setLit] = useScratch<string[]>('s3.lit', [])

  return (
    <>
      <div className="cols">
        <div className="panel" style={{ flex: '0 0 auto' }}>
          <h3 className="panel-title">Plate 9 — sublevel survey</h3>
          <div className="map-axis map-axis-x">
            {COLS.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            <div className="map-axis map-axis-y">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
                <div key={r}>{r}</div>
              ))}
            </div>
            <div className="map">
              {S3_ROOMS.map((room) => (
                <div
                  key={room.name}
                  className="room"
                  style={{
                    gridColumn: `${room.c1} / ${room.c2 + 1}`,
                    gridRow: `${room.r1} / ${room.r2 + 1}`,
                    position: 'relative',
                  }}
                >
                  <span>{room.name}</span>
                </div>
              ))}
              {S3_GRID.map((row, r) =>
                row.split('').map((ch, c) => {
                  const key = `${COLS[c]}${r + 1}`
                  const isStart = S3_START.c === c + 1 && S3_START.r === r + 1
                  return (
                    <button
                      type="button"
                      key={key}
                      className={`cell${lit.includes(key) ? ' lit' : ''}${isStart ? ' start' : ''}`}
                      style={{ gridColumn: c + 1, gridRow: r + 1 }}
                      title={key}
                      onClick={() => {
                        if (readOnly) return
                        play('tap')
                        setLit((l) => (l.includes(key) ? l.filter((x) => x !== key) : [...l, key]))
                      }}
                    >
                      {ch}
                    </button>
                  )
                }),
              )}
            </div>
          </div>
          <p className="note" style={{ marginBottom: 0 }}>
            Click any cell to mark it while you trace. The ringed cell is the start of the route.
          </p>
        </div>

        <div className="stack" style={{ flex: '1 1 320px' }}>
          <div className="panel">
            <h3 className="panel-title">Orientation</h3>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
              <Compass />
              <div style={{ flex: '1 1 180px' }}>
                <p style={{ marginTop: 0 }}>
                  <b>PLATE 9</b> — drawn by H. Vance. Orientation exactly as printed; do not reorient the plate.
                </p>
                <p className="note" style={{ marginBottom: 0 }}>
                  Every plate in this file is walked by its own rose.
                </p>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Route walked — 9 NOV</h3>
            <p className="note" style={{ marginTop: 0 }}>
              START: <span className="kbd">E4</span> &nbsp;·&nbsp; TERMINUS: <span className="kbd">SUBVAULT</span>
            </p>
            <ol className="mono-list" style={{ columns: 2, fontSize: '1.05rem', letterSpacing: '0.1em' }}>
              {S3_ROUTE.map((step, i) => (
                <li key={i} style={{ color: step === 'MARK' ? 'var(--accent)' : undefined }}>
                  {step}
                </li>
              ))}
            </ol>
            <p className="note" style={{ marginBottom: 0 }}>
              A number is a count of cells. MARK records the letter you are standing on.
            </p>
          </div>
        </div>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
