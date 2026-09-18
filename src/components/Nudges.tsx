import { useScratch } from '../game/scratch'
import { play } from '../game/audio'

/**
 * Free, in-fiction nudges. They point at where to look and never hand over an
 * answer — the two real hints still come from the game master on Slack.
 */
export default function Nudges({ stage, objective, nudges }: { stage: string; objective: string; nudges: string[] }) {
  const [shown, setShown] = useScratch<number>(`nudge.${stage}`, 0)
  const [folded, setFolded] = useScratch<boolean>(`nudgefold.${stage}`, false)

  return (
    <div className="objective">
      <div className="objective-main">
        <div className="objective-label">YOUR JOB</div>
        <p className="objective-text">{objective}</p>
      </div>

      {shown > 0 && !folded && (
        <ol className="nudge-list">
          {nudges.slice(0, shown).map((n, i) => (
            <li key={i}>
              <span className="nudge-tag">TIGER, NUDGE {i + 1}</span>
              {n}
            </li>
          ))}
        </ol>
      )}

      <div className="nudge-actions">
        {shown < nudges.length && (
          <button
            className="btn ghost nudge-btn nudge-ask"
            onClick={() => {
              play('tap')
              setShown((s) => s + 1)
              setFolded(false)
            }}
          >
            {shown === 0
              ? 'Stuck? Ask the tiger for a nudge (free)'
              : `Ask again — nudge ${shown + 1} of ${nudges.length}`}
          </button>
        )}
        {shown > 0 && (
          <button className="btn ghost nudge-btn" onClick={() => setFolded(!folded)}>
            {folded ? `Show ${shown === 1 ? 'the nudge' : 'both nudges'} again` : 'Hide nudges'}
          </button>
        )}
      </div>
    </div>
  )
}
