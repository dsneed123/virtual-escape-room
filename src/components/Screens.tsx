import { useState } from 'react'
import { INTRO, STAGES, WHOS_WHO } from '../game/content'
import { BEATS, OUTRO_ENC } from '../game/beats'
import { rv } from '../game/crypto'
import { clock, TOTAL_MS } from '../game/state'
import type { Team } from '../game/state'

export const HINT_RULE = (
  <div className="hint-box">
    <b>STUCK?</b>
    <br />
    Each door has <b>two free nudges</b> from CONTROL built into it — use those first, they cost you nothing but
    seconds and they never hand over the answer.
    <div style={{ marginTop: 8 }}>
      Still stuck? You have <b>2 real hints</b> for the whole game, and they come from a human. Message your game
      master on Slack like this:
    </div>
    <div style={{ marginTop: 8, fontSize: '1.05rem' }}>
      <span className="kbd">SEATTLE — HINT 1 — PUZZLE 4</span>
    </div>
    <div style={{ marginTop: 6, color: 'var(--dimmer)' }}>
      Spend them well. Nothing in here strictly needs one, which Vance would very much want you to know.
    </div>
  </div>
)

export function TeamSelect({ onPick }: { onPick: (t: Team) => void }) {
  return (
    <div className="title-screen">
      <div className="tag">THE MERIDIAN BEQUEST</div>
      <h1>SEATTLE VS. SJC</h1>
      <p className="note" style={{ letterSpacing: '0.26em', marginTop: 18 }}>
        CHOOSE YOUR TEAM
      </p>
      <div className="vs">
        <button className="team-card seattle" onClick={() => onPick('SEATTLE')}>
          SEATTLE
          <small>STATION ONE</small>
        </button>
        <span className="sep">VS</span>
        <button className="team-card sjc" onClick={() => onPick('SJC')}>
          SJC
          <small>STATION TWO</small>
        </button>
      </div>
      <p className="note" style={{ maxWidth: '62ch' }}>
        Pick the office you are actually sitting in. One computer, one screen, one team, everybody arguing at the
        same monitor. Your choice is stored on this machine only — the other office cannot see a thing you do.
      </p>
    </div>
  )
}

export function Briefing({ team, onBegin, onChangeTeam }: { team: Team; onBegin: () => void; onChangeTeam: () => void }) {
  return (
    <div className="stage" style={{ maxWidth: 980 }}>
      <div className="stage-head">
        <span className="stage-index">CONTROL — BRIEFING, SUCH AS IT IS</span>
        <h1 className="stage-title">STATION {team}</h1>
      </div>
      <div className="panel">
        <h3 className="panel-title">Eyes only — the {team} office</h3>
        <div className="brief" style={{ fontSize: '1.08rem' }}>
          {INTRO.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div className="cols" style={{ marginTop: 18 }}>
        <div className="panel">
          <h3 className="panel-title">Who and what you are dealing with</h3>
          <dl className="whoswho">
            {WHOS_WHO.map(([term, gloss]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{gloss}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="panel">
          <h3 className="panel-title">Standing orders</h3>
          <ul className="mono-list">
            <li>Eight doors, forty-five minutes. The clock starts when you press the button, so press it together.</li>
            <li>Every door tells you plainly what it wants from you, and carries two free nudges if you stall.</li>
            <li>Each door gives up one fragment word. ARCHIVE at the top keeps every word and every plate you have
              opened — nothing is ever taken away from you.</li>
            <li>The other office is on the same doors right now. You cannot hear them. This is deliberate and, frankly,
              kinder.</li>
            <li>Get out, then send your time to your game master and be unbearable about it.</li>
          </ul>
        </div>
        <div style={{ flex: '1 1 340px' }}>{HINT_RULE}</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 34 }}>
        <button className="btn primary big" onClick={onBegin}>
          START THE CLOCK
        </button>
        <p className="note" style={{ marginTop: 12 }}>
          Wait for your game master&rsquo;s signal. Both offices should start together, or one of you will be very
          smug for entirely the wrong reason.
        </p>
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={onChangeTeam}>
          Wrong station? Go back
        </button>
      </div>
    </div>
  )
}

export function Complete({ team, ms, over }: { team: Team; ms: number; over: boolean }) {
  return (
    <div className="end">
      <div className="kicker" style={{ color: 'var(--accent)', letterSpacing: '0.34em' }}>
        MERIDIAN CLOSED
      </div>
      <h1>ESCAPE COMPLETE</h1>
      <div className="teamline">TEAM: {team}</div>
      <div className="time">{clock(ms)}</div>
      {over && (
        <p style={{ color: 'var(--danger)', letterSpacing: '0.2em' }}>
          COMPLETED AFTER THE FORTY-FIVE MINUTE MARK
        </p>
      )}
      <div className="brief" style={{ margin: '26px auto', maxWidth: '78ch', textAlign: 'left' }}>
        {OUTRO_ENC.map(rv).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="slack">
        <b style={{ letterSpacing: '0.2em' }}>SEND YOUR COMPLETION TIME TO THE GAME MASTER ON SLACK</b>
        <div style={{ fontSize: '1.3rem', marginTop: 10, color: 'var(--accent)' }}>
          {team} — ESCAPED — {clock(ms)}
        </div>
        <p className="note" style={{ marginBottom: 0 }}>
          This machine has no idea what the other office did, and never will. Your game master compares the two times
          and calls it.
        </p>
      </div>
    </div>
  )
}

export function Expired({ team, stage, onContinue }: { team: Team; stage: number; onContinue: () => void }) {
  const reached = STAGES.find((s) => s.n === stage + 1)
  return (
    <div className="end expired">
      <h1>TIME&rsquo;S UP</h1>
      <div className="teamline">TEAM: {team}</div>
      <div className="time" style={{ color: 'var(--danger)' }}>
        {clock(0)}
      </div>
      <p style={{ letterSpacing: '0.16em' }}>
        The archive finished filing itself away at {clock(TOTAL_MS)}. Vance did warn you. He was insufferable about
        it, but he did warn you.
      </p>
      <p className="note">
        You reached door {Math.min(stage + 1, 8)} — {reached?.title ?? 'THE MERIDIAN LOCK'}.
      </p>
      <div className="slack">
        <b style={{ letterSpacing: '0.2em' }}>REPORT TO YOUR GAME MASTER ON SLACK</b>
        <div style={{ fontSize: '1.2rem', marginTop: 10, color: 'var(--warn)' }}>
          {team} — TIME EXPIRED — REACHED DOOR {Math.min(stage + 1, 8)}
        </div>
      </div>
      <div style={{ marginTop: 30 }}>
        <button className="btn" onClick={onContinue}>
          KEEP WORKING (UNRANKED)
        </button>
      </div>
    </div>
  )
}

export function ResetModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const [word, setWord] = useState('')
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="sheet" style={{ maxWidth: 620 }}>
        <div className="kicker" style={{ color: 'var(--danger)' }}>
          DESTRUCTIVE
        </div>
        <h2>RESET THE OPERATION</h2>
        <p>
          This wipes the team selection, every fragment recovered, every working note, and the clock. It cannot be
          undone. Use it only between games.
        </p>
        <p className="note">Type RESET to confirm.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (word.trim().toUpperCase() === 'RESET') onConfirm()
          }}
        >
        <input
          className="key-input"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="RESET"
          autoFocus
          spellCheck={false}
        />
        <div className="sheet-actions">
          <button className="btn ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn danger" type="submit" disabled={word.trim().toUpperCase() !== 'RESET'}>
            Wipe and restart
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}

export function PauseModal({ onResume }: { onResume: () => void }) {
  return (
    <div className="overlay">
      <div className="sheet" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div className="kicker">CLOCK HELD</div>
        <h2>PAUSED</h2>
        <p className="note">
          Clock stopped, plates covered, nobody is losing a second. Go and get coffee.
        </p>
        <div className="sheet-actions" style={{ justifyContent: 'center' }}>
          <button className="btn primary big" onClick={onResume}>
            RESUME
          </button>
        </div>
      </div>
    </div>
  )
}

export function BeatModal({ stage, word, onContinue }: { stage: number; word: string; onContinue: () => void }) {
  const def = STAGES.find((s) => s.n === stage)!
  return (
    <div className="overlay">
      <div className="sheet" style={{ maxWidth: 760 }}>
        <div className="kicker">DOOR {stage} OPEN — FRAGMENT RECOVERED</div>
        <div className="fragment-word">{word}</div>
        <div className="brief">
          {(BEATS[stage - 1] ?? []).map(rv).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="note">
          Filed to the archive under channel {def.channel}. Vance numbered every door for a reason, and he was not
          being decorative.
        </p>
        <div className="sheet-actions">
          <button className="btn primary big" onClick={onContinue} autoFocus>
            NEXT DOOR
          </button>
        </div>
      </div>
    </div>
  )
}
