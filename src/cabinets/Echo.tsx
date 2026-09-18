import { useCallback, useEffect, useRef, useState } from 'react'
import { SIMON_SEQUENCE } from '../game/arcade'
import { useScratch } from '../game/scratch'
import { play, toneOut } from '../game/audio'
import type { GameProps } from './types'

const PADS = ['#ff4d6d', '#4fd8c4', '#ffd166', '#8b7cf6']
const NOTES = [261.6, 329.6, 392.0, 523.3]
const TARGET = 8

export default function Echo({ onWin, won }: GameProps) {
  const [round, setRound] = useScratch<number>('echo.round', 3)
  const [flash, setFlash] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input'>('idle')
  const [entered, setEntered] = useState<number[]>([])
  const [msg, setMsg] = useState('')
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const show = useCallback(
    (len: number) => {
      clearTimers()
      setEntered([])
      setMsg('')
      setPhase('showing')
      const speed = len >= 7 ? 440 : len >= 5 ? 540 : 640
      SIMON_SEQUENCE.slice(0, len).forEach((pad, i) => {
        timers.current.push(
          window.setTimeout(() => {
            setFlash(pad)
            toneOut(NOTES[pad], 0.26)
          }, i * speed + 400),
        )
        timers.current.push(window.setTimeout(() => setFlash(null), i * speed + 400 + speed * 0.6))
      })
      timers.current.push(window.setTimeout(() => setPhase('input'), len * speed + 500))
    },
    [],
  )

  const hit = (pad: number) => {
    if (phase !== 'input' || won) return
    toneOut(NOTES[pad], 0.22)
    setFlash(pad)
    window.setTimeout(() => setFlash(null), 160)
    const next = [...entered, pad]
    const want = SIMON_SEQUENCE.slice(0, round)
    if (pad !== want[next.length - 1]) {
      play('error')
      setPhase('idle')
      setEntered([])
      setMsg('Wrong pad. Same round again — nothing lost but pride.')
      return
    }
    setEntered(next)
    if (next.length === want.length) {
      setPhase('idle')
      if (round >= TARGET) {
        onWin()
      } else {
        setRound(round + 1)
        setMsg(`Round ${round} clear. Now ${round + 1}.`)
      }
    }
  }

  return (
    <div className="game-wrap">
      <div className="echo-pads">
        {PADS.map((colour, i) => (
          <button
            key={i}
            className={`pad${flash === i ? ' lit' : ''}`}
            style={{ '--pad': colour } as React.CSSProperties}
            disabled={phase !== 'input' || won}
            onClick={() => hit(i)}
            aria-label={`pad ${i + 1}`}
          />
        ))}
      </div>
      <div className="game-status">
        <span className="big-count">{round}</span> of {TARGET} in the sequence
        <span className="dots" aria-hidden>
          {Array.from({ length: round }, (_, i) => (
            <i key={i} className={i < entered.length ? 'done' : ''} />
          ))}
        </span>
        <button className="btn primary" disabled={phase === 'showing' || won} onClick={() => show(round)}>
          {phase === 'input' ? 'Replay it' : 'Show the sequence'}
        </button>
        {round > 3 && (
          <button className="btn ghost" disabled={phase === 'showing'} onClick={() => { setRound(3); setEntered([]); setMsg('') }}>
            Back to round 3
          </button>
        )}
      </div>
      {msg && <p className="game-msg">{msg}</p>}
      {phase === 'showing' && <p className="game-msg">Watch…</p>}
      {phase === 'input' && <p className="game-msg accent">Your turn — press them back in order.</p>}
    </div>
  )
}
