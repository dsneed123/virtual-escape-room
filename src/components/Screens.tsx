import { useState } from 'react'
import { CABINETS, TICKET_TARGET } from '../game/arcade'
import type { Cabinet } from '../game/arcade'
import { clock, TOTAL_MS } from '../game/state'
import type { Team } from '../game/state'

export const HINT_RULE = (
  <div className="hint-box">
    <b>STUCK?</b>
    <br />
    Every machine has <b>two free nudges</b> from RAJA built into it — use them, they cost nothing and he enjoys it.
    You can also walk away, play a different machine, and come back.
    <div style={{ marginTop: 8 }}>
      Properly stuck? You get <b>2 real hints</b> for the whole night, from an actual human. Message your game master
      on Slack like this:
    </div>
    <div style={{ marginTop: 8, fontSize: '1.05rem' }}>
      <span className="kbd">SEATTLE — HINT 1 — PIXEL PAINTER</span>
    </div>
  </div>
)

export function TeamSelect({ onPick }: { onPick: (t: Team) => void }) {
  return (
    <div className="title-screen">
      <div className="tag">🐅 THE TIGER ARCADE &mdash; CLOSED FOR THE NIGHT</div>
      <h1>🐯 SEATTLE VS. SJC</h1>
      <p className="note" style={{ letterSpacing: '0.26em', marginTop: 18 }}>
        WHICH ARCADE ARE YOU LOCKED IN?
      </p>
      <div className="vs">
        <button className="team-card seattle" onClick={() => onPick('SEATTLE')}>
          SEATTLE
          <small>INSERT COIN</small>
        </button>
        <span className="sep">VS</span>
        <button className="team-card sjc" onClick={() => onPick('SJC')}>
          SJC
          <small>INSERT COIN</small>
        </button>
      </div>
      <p className="note" style={{ maxWidth: '62ch' }}>
        One computer, one screen, the whole room around it. Your arcade is stored on this machine only — the other
        office cannot see a thing you do, and you cannot see them. First room out wins.
      </p>
    </div>
  )
}

const SETUP = [
  {
    key: 'mute',
    title: 'MUTE YOURSELVES',
    body: 'Kill your mic in the Slack huddle. The other den must not hear a word you say for the next forty-five minutes.',
  },
  {
    key: 'operator',
    title: 'VOTE FOR AN OPERATOR',
    body: 'One person drives the keyboard and mouse. Everyone else is a brain, not a driver. Put their name in below — you can swap them whenever you like.',
  },
  {
    key: 'screen',
    title: 'GET IT ON THE BIG SCREEN',
    body: 'Share the screen to the TV if the room has one, so all of you can see the machine instead of three of you leaning over a laptop.',
  },
  {
    key: 'plan',
    title: 'AGREE A PLAN',
    body: 'You need 15 tickets, not every machine. Look at the floor, pick your route, and split the work — the room that argues at the screen beats the room that watches one person click.',
  },
]

export function Briefing({
  team,
  crew,
  onCrew,
  onBegin,
  onChangeTeam,
}: {
  team: Team
  crew: string[]
  onCrew: (c: string[]) => void
  onBegin: () => void
  onChangeTeam: () => void
}) {
  const [name, setName] = useState('')
  const [done, setDone] = useState<string[]>([])
  const ready = SETUP.every((s) => done.includes(s.key))
  const add = () => {
    const v = name.trim().slice(0, 18)
    if (!v || crew.length >= 12) return
    onCrew([...crew, v])
    setName('')
  }

  return (
    <div className="stage" style={{ maxWidth: 940 }}>
      <div className="stage-head">
        <span className="stage-index">RAJA THE TIGER WOULD LIKE A WORD</span>
        <h1 className="stage-title">{team} ARCADE</h1>
      </div>

      <div className="stripes" />
      <div className="panel hook">
        <p className="hook-line">
          🐅 You are locked in the Tiger Arcade. The machines still work.
        </p>
        <p>
          Beat them for tickets. Get <b>{TICKET_TARGET} tickets</b> to the shutter keypad and you are out — the power
          dies at forty-five minutes. The other office is locked in an identical arcade. First room out wins.
        </p>
      </div>

      <div className="raja">
        <span className="raja-face">🐯</span>
        <span className="raja-line">
          &ldquo;I am RAJA. I run this floor, I count the tickets, and I have absolutely nowhere else to be.&rdquo;
        </span>
      </div>

      <h3 className="setup-head">BEFORE THE CLOCK STARTS — tick all four</h3>
      <div className="setup">
        {SETUP.map((step, i) => {
          const on = done.includes(step.key)
          return (
            <button
              key={step.key}
              className={`setup-step${on ? ' done' : ''}`}
              onClick={() => setDone(on ? done.filter((d) => d !== step.key) : [...done, step.key])}
            >
              <span className="setup-box">{on ? '✓' : i + 1}</span>
              <span>
                <b>{step.title}</b>
                <span className="setup-body">{step.body}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h3 className="panel-title">Who is in the room? — first name added is your operator</h3>
        <form
          className="crew-add"
          onSubmit={(e) => {
            e.preventDefault()
            add()
          }}
        >
          <input
            className="key-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="NAME"
            maxLength={18}
            aria-label="crew member name"
          />
          <button className="btn" type="submit" disabled={!name.trim() || crew.length >= 12}>
            Add
          </button>
        </form>
        <div className="crew-list">
          {crew.map((c, i) => (
            <button key={`${c}-${i}`} className="crew-chip" onClick={() => onCrew(crew.filter((_, j) => j !== i))}>
              {i === 0 && <span className="crew-first">OPERATOR</span>}
              {c} <span className="crew-x">✕</span>
            </button>
          ))}
          {crew.length === 0 && (
            <span className="note">
              Optional — but if you add everyone, RAJA offers the controls to the next person after every machine.
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>{HINT_RULE}</div>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <button className="btn primary big" onClick={onBegin} disabled={!ready}>
          {ready ? 'INSERT COIN — START' : `TICK ALL FOUR FIRST (${done.length}/4)`}
        </button>
        <p className="note" style={{ marginTop: 12 }}>
          Wait for your game master&rsquo;s signal. Both arcades start together.
        </p>
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={onChangeTeam}>
          Wrong arcade? Go back
        </button>
      </div>
    </div>
  )
}

export function TokenModal({
  cabinet,
  quip,
  tickets,
  team,
  nextDriver,
  onContinue,
}: {
  cabinet: Cabinet
  quip: string
  tickets: number
  team: Team
  nextDriver: string | null
  onContinue: () => void
}) {
  return (
    <div className="overlay">
      <div className="sheet" style={{ maxWidth: 640, textAlign: 'center' }}>
        <div className="kicker">{cabinet.name} — BEATEN</div>
        <div className="token-pop">🪙</div>
        <div className="fragment-word">{cabinet.token}</div>
        <p style={{ fontSize: '1.08rem' }}>&ldquo;{quip}&rdquo;</p>
        <div className="token-tix">
          +{cabinet.tickets} ticket{cabinet.tickets === 1 ? '' : 's'}
        </div>
        <p className="note">
          {team} has 🎟 {tickets} of {TICKET_TARGET}.{' '}
          {tickets >= TICKET_TARGET
            ? 'That is enough — the shutter keypad is unlocked.'
            : `${TICKET_TARGET - tickets} to go.`}
        </p>
        {nextDriver && (
          <div className="pass-mouse">
            🖱 PASS THE MOUSE TO <b>{nextDriver}</b>
          </div>
        )}
        <div className="sheet-actions" style={{ justifyContent: 'center' }}>
          <button className="btn primary big" onClick={onContinue} autoFocus>
            BACK TO THE FLOOR
          </button>
        </div>
      </div>
    </div>
  )
}

export function Complete({ team, crew, ms, over }: { team: Team; crew: string[]; ms: number; over: boolean }) {
  return (
    <div className="end">
      <div className="kicker" style={{ color: 'var(--accent)', letterSpacing: '0.34em' }}>
        THE SHUTTERS GO UP
      </div>
      <h1>YOU&rsquo;RE OUT</h1>
      <div className="teamline">TEAM: {team}</div>
      {crew.length > 0 && <div className="crewline">{crew.join(' · ')}</div>}
      <div className="time">{clock(ms)}</div>
      {over && (
        <p style={{ color: 'var(--danger)', letterSpacing: '0.2em' }}>FINISHED AFTER THE FORTY-FIVE MINUTE MARK</p>
      )}
      <div className="brief" style={{ margin: '22px auto', maxWidth: '62ch' }}>
        <p>
          The shutters grind up about four feet and stick. It will do. RAJA the tiger waves an enormous felt paw as
          you duck underneath. 🐅
        </p>
      </div>
      <div className="slack">
        <b style={{ letterSpacing: '0.2em' }}>SEND YOUR TIME TO THE GAME MASTER ON SLACK</b>
        <div style={{ fontSize: '1.3rem', marginTop: 10, color: 'var(--accent)' }}>
          {team} — OUT — {clock(ms)}
          {crew.length > 0 && ` — ${crew.length} on the crew`}
        </div>
        <p className="note" style={{ marginBottom: 0 }}>
          This machine has no idea how the other arcade did. Your game master compares the two and calls it.
        </p>
      </div>
    </div>
  )
}

export function Expired({ team, tokens, onContinue }: { team: Team; tokens: number; onContinue: () => void }) {
  return (
    <div className="end expired">
      <h1>BROWNOUT</h1>
      <div className="teamline">TEAM: {team}</div>
      <div className="time" style={{ color: 'var(--danger)' }}>
        {clock(0)}
      </div>
      <p style={{ letterSpacing: '0.16em' }}>
        The power dies at {clock(TOTAL_MS)} and every machine resets. You are still in the arcade.
      </p>
      <p className="note">
        You got {tokens} of {CABINETS.length} tokens.
      </p>
      <div className="slack">
        <b style={{ letterSpacing: '0.2em' }}>REPORT TO YOUR GAME MASTER ON SLACK</b>
        <div style={{ fontSize: '1.2rem', marginTop: 10, color: 'var(--warn)' }}>
          {team} — TIME UP — {tokens}/{CABINETS.length} TOKENS
        </div>
      </div>
      <div style={{ marginTop: 30 }}>
        <button className="btn" onClick={onContinue}>
          KEEP PLAYING ANYWAY (UNRANKED)
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
        <h2>WIPE THE ARCADE</h2>
        <p>
          This clears the team, every token, every half-finished machine and the clock. It cannot be undone. Use it
          between games, not during one.
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
              Wipe it
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
        <p className="note">Machines covered, clock stopped, nobody is losing a second. Go and get a drink.</p>
        <div className="sheet-actions" style={{ justifyContent: 'center' }}>
          <button className="btn primary big" onClick={onResume}>
            RESUME
          </button>
        </div>
      </div>
    </div>
  )
}
