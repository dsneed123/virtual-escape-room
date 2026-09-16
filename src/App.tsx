import { useEffect, useRef, useState } from 'react'
import Hud from './components/Hud'
import Archive from './components/Archive'
import Machine from './components/Machine'
import { BeatModal, Briefing, Complete, Expired, HINT_RULE, PauseModal, ResetModal, TeamSelect } from './components/Screens'
import { STAGES } from './game/content'
import { play, setMuted } from './game/audio'
import { clearScratch } from './game/scratch'
import { STAGE_BODIES } from './stages'
import StageMeta from './stages/StageMeta'
import { tensionOf, TOTAL_MS, useSession } from './game/state'

const WARN_AT = [30, 15, 5, 1]

export default function App() {
  const { session, elapsed, remaining, start, beginRun, pause, resume, solve, reset, update } = useSession()
  const [archive, setArchive] = useState(false)
  const [machine, setMachine] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [beat, setBeat] = useState<{ stage: number; word: string } | null>(null)
  const warned = useRef<number[]>([])
  const ended = useRef<string>('')

  const tension = tensionOf(remaining)
  const running = session.status === 'running' || session.status === 'overtime' || session.status === 'paused'

  useEffect(() => {
    document.body.dataset.team = session.team ?? ''
    document.body.dataset.tension = running ? tension : 'calm'
  }, [session.team, tension, running])

  useEffect(() => setMuted(session.muted), [session.muted])

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
        />
      </div>
    )
  }

  const def = STAGES[Math.min(session.stage, 7)]
  const Body = STAGE_BODIES[def.n]
  const machineUnlocked = session.stage >= 4

  const hud = (
    <Hud
      session={session}
      remaining={remaining}
      elapsed={elapsed}
      onPause={pause}
      onArchive={() => setArchive(true)}
      onMachine={() => setMachine(true)}
      onReset={() => setResetting(true)}
      onMute={() => update({ muted: !session.muted })}
      machineUnlocked={machineUnlocked}
    />
  )

  const modals = (
    <>
      {archive && <Archive solves={session.solves} onClose={() => setArchive(false)} />}
      {machine && <Machine metaReached={session.stage >= 7} onClose={() => setMachine(false)} />}
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
    </>
  )

  if (session.status === 'escaped') {
    return (
      <div className="app">
        {hud}
        <Complete team={session.team} ms={session.completionMs ?? elapsed} over={(session.completionMs ?? 0) > TOTAL_MS} />
        {modals}
      </div>
    )
  }

  if (session.status === 'expired') {
    return (
      <div className="app">
        {hud}
        <Expired team={session.team} stage={session.stage} onContinue={() => update({ status: 'overtime' })} />
        {modals}
      </div>
    )
  }

  return (
    <div className="app">
      {hud}
      <main className="stage">
        <div className="stage-head">
          <span className="stage-index">DOOR {def.n} OF 8</span>
          <div>
            <h1 className="stage-title">{def.title}</h1>
            <div className="stage-sub">{def.subtitle}</div>
          </div>
          <div className="channel">{def.channel == null ? 'NO CHANNEL' : `CHANNEL ${def.channel}`}</div>
        </div>

        <div className="brief">
          {def.brief.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {def.n === 8 ? (
          <StageMeta
            def={def}
            solves={session.solves}
            onSolved={(word) => solve(8, word)}
          />
        ) : (
          <Body
            def={def}
            onSolved={(word) => {
              solve(def.n, word)
              setBeat({ stage: def.n, word })
            }}
          />
        )}

        <div style={{ marginTop: 26, maxWidth: 640 }}>{HINT_RULE}</div>
      </main>

      {beat && <BeatModal stage={beat.stage} word={beat.word} onContinue={() => setBeat(null)} />}
      {session.status === 'paused' && !beat && <PauseModal onResume={resume} />}
      {modals}
    </div>
  )
}
