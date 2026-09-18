import { useState } from 'react'
import { CABINETS, TICKET_TARGET } from '../game/arcade'
import type { Cabinet } from '../game/arcade'
import { clock, TOTAL_MS } from '../game/state'
import type { Team } from '../game/state'

export const HINT_RULE = (
  <div className="hint-box">
    <b>STUCK?</b>
    <br />
    Every machine has <b>two free nudges</b> from BUZZ built into it — use them, they cost nothing and he enjoys it.
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
      <div className="tag">GUS&rsquo;S GALACTIC ARCADE &mdash; CLOSED FOR THE NIGHT</div>
      <h1>SEATTLE VS. SJC</h1>
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

const BRIEF = [
  'It is eleven at night, the shutters are down, and nobody told the staff you were still in here.',
  'Gus’s Galactic Arcade closed four hours ago. The lights are still on, the machines are still humming, and the only thing moving is BUZZ — the animatronic bee above the prize counter, who has decided this is the most fun he has had in about nine years.',
  'BUZZ’s terms are simple. Every machine you beat pays out tickets — the long nasty ones pay more. Get fifteen tickets, take them to the shutter keypad, satisfy every rule it throws at you, and the shutters go up. You do not have to beat all eleven, and you almost certainly do not have time to.',
  'Twelve machines in forty-five minutes is not a one-person job and BUZZ knows it. Crowd the screen, argue, and hand the mouse around — the rooms that split the work beat the rooms that watch one person click.',
  'There is a catch, because there is always a catch. At forty-five minutes the night cleaner runs the floor buffer, the power browns out, and every machine resets itself. BUZZ finds this extremely funny.',
  'The other office is locked in an identical arcade on the other side of the country, on the identical twelve machines. BUZZ is talking to them too. He is telling them you are doing badly.',
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
  const add = () => {
    const v = name.trim().slice(0, 18)
    if (!v || crew.length >= 12) return
    onCrew([...crew, v])
    setName('')
  }
  return (
    <div className="stage" style={{ maxWidth: 1040 }}>
      <div className="stage-head">
        <span className="stage-index">BUZZ WOULD LIKE A WORD</span>
        <h1 className="stage-title">{team} ARCADE</h1>
      </div>

      <div className="panel">
        <h3 className="panel-title">How you ended up here</h3>
        <div className="brief" style={{ fontSize: '1.08rem' }}>
          {BRIEF.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="cols" style={{ marginTop: 18 }}>
        <div className="panel">
          <h3 className="panel-title">The rules, such as they are</h3>
          <ul className="mono-list">
            <li>
              <b>Eleven machines, any order.</b> Give up on one, go and play another, come back later. Nothing ever
              locks you out.
            </li>
            <li>
              <b>Split up.</b> Two or three people reading a board out loud beats one person clicking in silence. Every
              machine says which parts can be shared out.
            </li>
            <li>
              <b>Beat a machine, take its token.</b> Tokens collect in the bar at the top of the screen.
            </li>
            <li>
              <b>Every machine explains itself</b> and carries two free nudges from BUZZ if you stall.
            </li>
            <li>
              <b>Pass the mouse.</b> Whoever is driving hands over after every token — the name in the top bar is
              whose turn it is.
            </li>
            <li>
              <b>{TICKET_TARGET} tickets unlock the shutter keypad</b> — ten escalating rules, each one breaking the
              last, and that is the way out. Harder machines pay more tickets, so you choose the route.
            </li>
            <li>
              <b>Forty-five minutes.</b> The clock starts when you press the button, so press it together with the
              other arcade.
            </li>
          </ul>
        </div>
        <div className="panel">
          <h3 className="panel-title">What is on the floor tonight</h3>
          <div className="machine-list">
            {CABINETS.map((c) => (
              <div key={c.id}>
                <b>{c.name}</b>
                <span>{c.game}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h3 className="panel-title">Who is in the room? — everybody takes a turn on the mouse</h3>
        <p className="note" style={{ marginTop: 0 }}>
          Add everyone here. After every machine you beat, BUZZ hands the mouse to the next person on the list, so
          nobody ends up watching for forty-five minutes. Optional, but the game is far better with it.
        </p>
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
              {i === 0 && <span className="crew-first">1st on the mouse</span>}
              {c} <span className="crew-x">✕</span>
            </button>
          ))}
          {crew.length === 0 && <span className="note">Nobody added yet — you can still play, you just organise the swaps yourselves.</span>}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>{HINT_RULE}</div>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <button className="btn primary big" onClick={onBegin}>
          INSERT COIN &mdash; START
        </button>
        <p className="note" style={{ marginTop: 12 }}>
          Wait for your game master&rsquo;s signal. Both arcades should start together.
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
      <div className="brief" style={{ margin: '26px auto', maxWidth: '72ch', textAlign: 'left' }}>
        <p>
          The tokens drop through the slot, something heavy clunks behind the wall, and the shutters grind up about
          four feet before sticking. It will do.
        </p>
        <p>
          BUZZ waves a small felt arm as you duck underneath. &ldquo;Come back any time,&rdquo; he says. &ldquo;I mean
          that. I am here constantly.&rdquo;
        </p>
        <p>
          Somewhere on the other side of the country an identical arcade is still lit up, and an identical bee is
          being extremely annoying about it.
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
        The floor buffer starts up at {clock(TOTAL_MS)}, the lights dip, and every machine resets with a sad little
        chime. BUZZ laughs for eleven straight seconds.
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
