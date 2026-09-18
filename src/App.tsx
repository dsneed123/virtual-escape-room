import { useEffect, useRef, useState } from 'react'
import Hud from './components/Hud'
import Hub from './components/Hub'
import Nudges from './components/Nudges'
import PasswordGame from './components/PasswordGame'
import {
  Briefing,
  Complete,
  Expired,
  HINT_RULE,
  PauseModal,
  ResetModal,
  TeamSelect,
  TokenModal,
} from './components/Screens'
import { TIGER_WIN, CABINETS, TICKET_TARGET } from './game/arcade'
import { play, setMuted } from './game/audio'
import { clearScratch } from './game/scratch'
import { tensionOf, TOTAL_MS, useSession } from './game/state'
import NeonFlow from './cabinets/NeonFlow'
import WordBlaster from './cabinets/WordBlaster'
import MineCart from './cabinets/MineCart'
import PixelPainter from './cabinets/PixelPainter'
import CodeBreaker from './cabinets/CodeBreaker'
import ParkingJam from './cabinets/ParkingJam'
import CircuitCity from './cabinets/CircuitCity'
import Blackout from './cabinets/Blackout'
import Stacker from './cabinets/Stacker'
import CrateCrusher from './cabinets/CrateCrusher'
import NumberCrunch from './cabinets/NumberCrunch'
import { installDevTools } from './game/dev'
import type { GameProps } from './cabinets/types'
import type { ComponentType } from 'react'

const GAMES: Record<string, ComponentType<GameProps>> = {
  flow: NeonFlow,
  word: WordBlaster,
  mine: MineCart,
  pixel: PixelPainter,
  code: CodeBreaker,
  jam: ParkingJam,
  circuit: CircuitCity,
  blackout: Blackout,
  stack: Stacker,
  crate: CrateCrusher,
  sudoku: NumberCrunch,
}

const WARN_AT = [30, 15, 5, 1]

export default function App() {
  const { session, elapsed, remaining, start, beginRun, pause, resume, award, finish, goto, adjust, reset, update } =
    useSession()
  const [resetting, setResetting] = useState(false)
  const [tokenWon, setTokenWon] = useState<string | null>(null)
  const warned = useRef<number[]>([])
  const ended = useRef('')

  const tension = tensionOf(remaining)
  const running = session.status === 'running' || session.status === 'overtime' || session.status === 'paused'

  useEffect(() => {
    document.body.dataset.team = session.team ?? ''
    document.body.dataset.tension = running ? tension : 'calm'
  }, [session.team, tension, running])

  useEffect(() => setMuted(session.muted), [session.muted])

  useEffect(() => {
    installDevTools({ award, finish, goto, reset, adjust })
  }, [award, finish, goto, reset, adjust])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setResetting(false)
      if (e.ctrlKey && e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault()
        adjust(e.key === 'ArrowUp' ? 1 : -1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [adjust])

  useEffect(() => {
    if (session.status !== 'running') return
    const mins = remaining / 60000
    for (const t of WARN_AT) {
      if (mins <= t && mins > t - 0.05 && !warned.current.includes(t)) {
        warned.current.push(t)
        play('warn')
      }
    }
  }, [remaining, session.status])

  useEffect(() => {
    if (session.status === 'escaped' && ended.current !== 'escaped') {
      ended.current = 'escaped'
      play('escape')
    }
    if (session.status === 'expired' && ended.current !== 'expired') {
      ended.current = 'expired'
      play('expired')
    }
  }, [session.status])

  if (!session.team || session.status === 'select') {
    return (
      <div className="app">
        <TeamSelect
          onPick={(t) => {
            play('tap')
            start(t)
          }}
        />
      </div>
    )
  }

  if (session.status === 'briefing') {
    return (
      <div className="app">
        <Briefing
          team={session.team}
          onBegin={() => {
            play('start')
            beginRun()
          }}
          onChangeTeam={() => update({ team: null, status: 'select' })}
        />
      </div>
    )
  }

  const hud = (
    <Hud
      session={session}
      remaining={remaining}
      elapsed={elapsed}
      onPause={pause}
      onHub={() => goto('hub')}
      onReset={() => setResetting(true)}
      onMute={() => update({ muted: !session.muted })}
    />
  )

  const modals = (
    <>
      {resetting && (
        <ResetModal
          onCancel={() => setResetting(false)}
          onConfirm={() => {
            clearScratch()
            reset()
            setResetting(false)
            warned.current = []
            ended.current = ''
          }}
        />
      )}
      {session.status === 'paused' && !tokenWon && <PauseModal onResume={resume} />}
    </>
  )

  if (session.status === 'escaped') {
    return (
      <div className="app">
        {hud}
        <Complete
          team={session.team}
          ms={session.completionMs ?? elapsed}
          over={(session.completionMs ?? 0) > TOTAL_MS}
        />
        {modals}
      </div>
    )
  }

  if (session.status === 'expired') {
    return (
      <div className="app">
        {hud}
        <Expired team={session.team} tokens={session.tokens.length} onContinue={() => update({ status: 'overtime' })} />
        {modals}
      </div>
    )
  }

  const ticketsHeld = CABINETS.filter((c) => session.tokens.some((t) => t.id === c.id)).reduce((n, c) => n + c.tickets, 0)
  const cab = CABINETS.find((c) => c.id === session.view)
  const Game = cab ? GAMES[cab.id] : null
  const wonThis = cab ? session.tokens.some((t) => t.id === cab.id) : false

  return (
    <div className="app">
      {hud}

      <main className="stage">
        {session.view === 'hub' && <Hub tokens={session.tokens} onOpen={goto} />}

        {session.view === 'prize' && ticketsHeld >= TICKET_TARGET && (
          <>
            <div className="stage-head">
              <button className="btn ghost" onClick={() => goto('hub')}>
                ◀ Back to the floor
              </button>
              <div>
                <h1 className="stage-title">THE SHUTTER KEYPAD</h1>
                <div className="stage-sub">TEN RULES BETWEEN YOU AND THE STREET</div>
              </div>
            </div>
            <PasswordGame tokens={session.tokens} onEscape={finish} />
          </>
        )}

        {cab && Game && (
          <>
            <div className="stage-head">
              <button className="btn ghost" onClick={() => goto('hub')}>
                ◀ Back to the floor
              </button>
              <div>
                <h1 className="stage-title">{cab.name}</h1>
                <div className="stage-sub">{cab.game.toUpperCase()}</div>
              </div>
              <div className="channel">{wonThis ? `🪙 TOKEN ${cab.token}` : `HI ${cab.score.toLocaleString()}`}</div>
            </div>

            <p className="brief">{cab.blurb}</p>

            <Nudges stage={cab.id} objective={cab.howto} nudges={cab.nudges} />

            <div className={`cabinet-frame${wonThis ? ' beaten' : ''}`}>
              <Game
                won={wonThis}
                onWin={() => {
                  if (wonThis) return
                  play('solve')
                  award(cab.id)
                  setTokenWon(cab.id)
                }}
              />
              {wonThis && (
                <div className="beaten-banner">
                  🪙 BEATEN — token {cab.token} is yours. Play it again if you like; it changes nothing.
                </div>
              )}
            </div>

            <div style={{ marginTop: 22, maxWidth: 680 }}>{HINT_RULE}</div>
          </>
        )}
      </main>

      {tokenWon && (
        <TokenModal
          cabinet={CABINETS.find((c) => c.id === tokenWon)!}
          quip={TIGER_WIN[CABINETS.findIndex((c) => c.id === tokenWon) % TIGER_WIN.length]}
          tickets={CABINETS.filter((c) => session.tokens.some((t) => t.id === c.id)).reduce((n, c) => n + c.tickets, 0)}
          team={session.team}
          onContinue={() => {
            setTokenWon(null)
            goto('hub')
          }}
        />
      )}
      {modals}
    </div>
  )
}
