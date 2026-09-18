import { useState } from 'react'
import { CABINETS, TICKET_TARGET } from '../game/arcade'
import type { Cabinet } from '../game/arcade'
import { clock, TOTAL_MS } from '../game/state'
import type { Team } from '../game/state'

export const HINT_RULE = (
  <div className="hint-box">
    <b>STUCK?</b>
    <br />
    Every machine has <b>two free nudges</b> from the tiger built into it — use them, they cost nothing and he enjoys it.
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
      <div className="title-tiger">🐅</div>
      <div className="tag">TIGER CAGE ARCADE &mdash; CLOSED FOR THE NIGHT</div>
      <h1>SEATTLE VS. SJC</h1>
      <p className="note" style={{ letterSpacing: '0.26em', marginTop: 18 }}>
        WHICH CAGE ARE YOU LOCKED IN?
      </p>
      <div className="vs">
        <button className="team-card seattle" onClick={() => onPick('SEATTLE')}>
          <span className="paw">🐯</span>
          SEATTLE
          <small>ORANGE TIGERS</small>
        </button>
        <span className="sep">VS</span>
        <button className="team-card sjc" onClick={() => onPick('SJC')}>
          <span className="paw">🐯</span>
          SJC
          <small>WHITE TIGERS</small>
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
    body: 'Kill your mic in the Slack huddle. The other cage must not hear a word you say for the next forty-five minutes.',
  },
  {
    key: 'operator',
    title: 'VOTE FOR AN OPERATOR',
    body: 'One person drives the keyboard and mouse — everyone else is a brain, not a driver. Swap whoever is driving whenever you feel like it.',
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
  onBegin,
  onChangeTeam,
}: {
  team: Team
  onBegin: () => void
  onChangeTeam: () => void
}) {

  return (
    <div className="stage" style={{ maxWidth: 940 }}>
      <div className="stage-head">
        <span className="stage-index">THE TIGER WOULD LIKE A WORD</span>
        <h1 className="stage-title">🐅 {team} CAGE</h1>
      </div>

      <div className="tiger-rail" style={{ borderRadius: 999, marginBottom: 18 }} />
      <div className="panel hook">
        <p className="hook-line">
          🐅 You are locked in the Tiger Cage. The machines still work.
        </p>
        <p>
          Beat them for tickets. Get <b>{TICKET_TARGET} tickets</b> to the shutter keypad and you are out — the power
          dies at forty-five minutes. The other office is locked in an identical cage. First room out wins.
        </p>
      </div>

      <div className="tiger">
        <span className="tiger-face">🐯</span>
        <span className="tiger-line">
          &ldquo;I am the tiger. I run this floor, I count the tickets, and I have absolutely nowhere else to be.&rdquo;
        </span>
      </div>

      <h3 className="setup-head">BEFORE YOU START</h3>
      <div className="setup">
        {SETUP.map((step, i) => (
          <div key={step.key} className="setup-step">
            <span className="setup-box">{i + 1}</span>
            <span>
              <b>{step.title}</b>
              <span className="setup-body">{step.body}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>{HINT_RULE}</div>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <button className="btn primary big" onClick={onBegin}>
          INSERT COIN — START
        </button>
        <p className="note" style={{ marginTop: 12 }}>
          Wait for your game master&rsquo;s signal. Both cages start together.
        </p>
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={onChangeTeam}>
          Wrong cage? Go back
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
  onContinue,
}: {
  cabinet: Cabinet
  quip: string
  tickets: number
  team: Team
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
        <div className="pass-mouse">🖱 GOOD MOMENT TO HAND THE MOUSE TO SOMEBODY ELSE</div>
        <div className="sheet-actions" style={{ justifyContent: 'center' }}>
          <button className="btn primary big" onClick={onContinue} autoFocus>
            BACK TO THE FLOOR
          </button>
        </div>
      </div>
    </div>
  )
}

export function Complete({ team, ms, over }: { team: Team; ms: number; over: boolean }) {
  return (
    <div className="end">
      <div className="kicker" style={{ color: 'var(--accent)', letterSpacing: '0.34em' }}>
        🐾 THE SHUTTERS GO UP 🐾
      </div>
      <h1>YOU&rsquo;RE OUT</h1>
      <div className="teamline">TEAM: {team}</div>
      <div className="time">{clock(ms)}</div>
      {over && (
        <p style={{ color: 'var(--danger)', letterSpacing: '0.2em' }}>FINISHED AFTER THE FORTY-FIVE MINUTE MARK</p>
      )}
      <div className="brief" style={{ margin: '22px auto', maxWidth: '62ch' }}>
        <p>
          The shutters grind up about four feet and stick. It will do. The tiger waves an enormous felt paw as
          you duck underneath. 🐅
        </p>
      </div>
      <div className="slack">
        <b style={{ letterSpacing: '0.2em' }}>SEND YOUR TIME TO THE GAME MASTER ON SLACK</b>
        <div style={{ fontSize: '1.3rem', marginTop: 10, color: 'var(--accent)' }}>
          {team} — OUT — {clock(ms)}
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
