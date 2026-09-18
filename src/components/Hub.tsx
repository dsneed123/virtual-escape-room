import { CABINETS } from '../game/arcade'
import type { Token } from '../game/state'
import { play } from '../game/audio'

interface Props {
  tokens: Token[]
  onOpen: (id: string) => void
}

export default function Hub({ tokens, onOpen }: Props) {
  const has = (id: string) => tokens.some((t) => t.id === id)
  const all = tokens.length >= CABINETS.length

  return (
    <div className="hub">
      <div className="hub-head">
        <h2>THE ARCADE FLOOR</h2>
        <p className="note">
          Eight machines, played in any order you like. Beat one, take its token. Stuck? Walk away and come back —
          nothing here locks you out.
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
            <div className="cab-name">PRIZE COUNTER</div>
            <div className="cab-game">{all ? 'Cash in and get out' : `Bring me all eight tokens`}</div>
          </div>
          <div className="cab-foot">
            <span className="cab-score">
              {tokens.length} / {CABINETS.length} TOKENS
            </span>
            {all ? <span className="cab-play">OPEN ▶</span> : <span className="cab-token">🔒</span>}
          </div>
        </button>
      </div>
    </div>
  )
}
