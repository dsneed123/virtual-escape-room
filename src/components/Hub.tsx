import { CABINETS, TICKET_TARGET } from '../game/arcade'
import type { Token } from '../game/state'
import { play } from '../game/audio'

interface Props {
  tokens: Token[]
  onOpen: (id: string) => void
}

export default function Hub({ tokens, onOpen }: Props) {
  const has = (id: string) => tokens.some((t) => t.id === id)
  const tix = CABINETS.filter((c) => has(c.id)).reduce((n, c) => n + c.tickets, 0)
  const all = tix >= TICKET_TARGET

  return (
    <div className="hub">
      <div className="hub-head">
        <h2><span className="paw">🐾</span>THE TIGER CAGE<span className="paw">🐾</span></h2>
        <p className="note">
          Eleven machines, any order. You do <b>not</b> have to beat them all — the shutter opens at{' '}
          <b>{TICKET_TARGET} tickets</b>, and the longer, nastier machines pay out more. Pick your route. Stuck on one?
          Walk away, nothing locks you out.
        </p>
      </div>

      <div className="cab-grid">
        {CABINETS.map((cab) => (
          <button
            key={cab.id}
            className={`cab${has(cab.id) ? ' beaten' : ''}`}
            onClick={() => {
              play('tap')
              onOpen(cab.id)
            }}
          >
            <div className="cab-screen">
              <div className="cab-name">{cab.name}</div>
              <div className="cab-game">{cab.game}</div>
            </div>
            <div className="cab-time">
              <span>⏱ {cab.minutes}</span>
              <span className="cab-tix">🎟 {cab.tickets} ticket{cab.tickets === 1 ? '' : 's'}</span>
            </div>
            <div className="cab-foot">
              <span className="cab-score">HI {cab.score.toLocaleString()}</span>
              {has(cab.id) ? <span className="cab-token">🪙 {cab.token}</span> : <span className="cab-play">PLAY ▶</span>}
            </div>
          </button>
        ))}

        <button
          className={`cab prize${all ? ' ready' : ' locked'}`}
          onClick={() => {
            if (!all) return
            play('tap')
            onOpen('prize')
          }}
          disabled={!all}
        >
          <div className="cab-screen">
            <div className="cab-name">THE SHUTTER</div>
            <div className="cab-game">
              {all ? 'Ten rules and you are out' : `${TICKET_TARGET - tix} more ticket${TICKET_TARGET - tix === 1 ? '' : 's'} and it opens`}
            </div>
          </div>
          <div className="cab-foot">
            <span className="cab-score">
              🎟 {tix} / {TICKET_TARGET} TICKETS
            </span>
            {all ? <span className="cab-play">OPEN ▶</span> : <span className="cab-token">🔒</span>}
          </div>
        </button>
      </div>
    </div>
  )
}
