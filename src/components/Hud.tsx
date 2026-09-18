import { CABINETS } from '../game/arcade'
import { clock, TOTAL_MS } from '../game/state'
import type { Session } from '../game/state'

interface Props {
  session: Session
  remaining: number
  elapsed: number
  onPause: () => void
  onHub: () => void
  onReset: () => void
  onMute: () => void
}

export default function Hud({ session, remaining, elapsed, onPause, onHub, onReset, onMute }: Props) {
  const over = session.status === 'overtime' || session.status === 'expired'
  const display =
    session.status === 'escaped'
      ? clock(session.completionMs ?? elapsed)
      : over
        ? `+${clock(elapsed - TOTAL_MS)}`
        : clock(remaining)

  return (
    <header className="hud">
      <button className="hud-team" onClick={onHub} title="back to the arcade floor">
        {session.team}
      </button>

      <div className="hud-tokens" aria-label={`${session.tokens.length} of 8 tokens`}>
        {CABINETS.map((c) => {
          const has = session.tokens.some((t) => t.id === c.id)
          return (
            <span key={c.id} className={`coin${has ? ' got' : ''}`} title={c.name}>
              {has ? c.token : '·'}
            </span>
          )
        })}
      </div>

      <div className={`timer${over ? ' over' : ''}`} aria-label="time remaining">
        {display}
      </div>

      <div className="hud-tools">
        <button className="btn ghost" onClick={onHub}>
          Floor
        </button>
        <button
          className="btn ghost"
          onClick={onPause}
          disabled={session.status !== 'running' && session.status !== 'overtime'}
        >
          Pause
        </button>
        <button className={`btn ghost${session.muted ? '' : ' on'}`} onClick={onMute}>
          {session.muted ? 'Sound off' : 'Sound on'}
        </button>
        <button className="btn ghost danger" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  )
}
