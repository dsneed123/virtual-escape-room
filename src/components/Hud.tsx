import { clock } from '../game/state'
import type { Session } from '../game/state'
import { TOTAL_MS } from '../game/state'

interface Props {
  session: Session
  remaining: number
  elapsed: number
  onPause: () => void
  onArchive: () => void
  onMachine: () => void
  onReset: () => void
  onMute: () => void
  machineUnlocked: boolean
}

export default function Hud({
  session,
  remaining,
  elapsed,
  onPause,
  onArchive,
  onMachine,
  onReset,
  onMute,
  machineUnlocked,
}: Props) {
  const over = session.status === 'overtime' || session.status === 'expired'
  const display =
    session.status === 'escaped'
      ? clock(session.completionMs ?? elapsed)
      : over
        ? `+${clock(elapsed - TOTAL_MS)}`
        : clock(remaining)
  const solved = new Set(session.solves.map((s) => s.stage))

  return (
    <header className="hud">
      <div className="hud-team">{session.team}</div>

      <div className="hud-pips" aria-label="progress">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className={`pip${n === 8 ? ' meta' : ''}${solved.has(n) ? ' done' : ''}${
              !solved.has(n) && session.stage + 1 === n ? ' here' : ''
            }`}
            title={`Door ${n}`}
          />
        ))}
      </div>

      <div className={`timer${over ? ' over' : ''}`} aria-label="time remaining">
        {display}
      </div>

      <div className="hud-tools">
        <button className="btn ghost" onClick={onArchive}>
          Archive
        </button>
        {machineUnlocked && (
          <button className="btn ghost" onClick={onMachine}>
            Machine
          </button>
        )}
        <button className="btn ghost" onClick={onPause} disabled={session.status !== 'running' && session.status !== 'overtime'}>
          Pause
        </button>
        <button className={`btn ghost${session.muted ? '' : ' on'}`} onClick={onMute} title="sound on/off">
          {session.muted ? 'Sound off' : 'Sound on'}
        </button>
        <button className="btn ghost danger" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  )
}
