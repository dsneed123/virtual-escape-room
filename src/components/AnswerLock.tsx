import { useEffect, useState } from 'react'
import { matches, norm, rv } from '../game/crypto'
import { play } from '../game/audio'

const REJECTIONS = [
  'THE LOCK DOES NOT MOVE.',
  'REJECTED. THE PLATE RESETS ITSELF.',
  'NO. SOMETHING IN THE MECHANISM DECLINES.',
  'INCORRECT. THE DOOR STAYS SHUT.',
  'THE SLOT SWALLOWS IT AND GIVES NOTHING BACK.',
]

export function useLock(hash: string, frag: string, onSolved: (word: string) => void) {
  const [msg, setMsg] = useState('')
  const [bad, setBad] = useState(false)
  const [wrong, setWrong] = useState(0)
  const [coolUntil, setCoolUntil] = useState(0)
  const [, tick] = useState(0)

  useEffect(() => {
    if (coolUntil <= Date.now()) return
    const id = window.setInterval(() => {
      tick((n) => n + 1)
      if (Date.now() >= coolUntil) window.clearInterval(id)
    }, 250)
    return () => window.clearInterval(id)
  }, [coolUntil])

  const cooling = Math.max(0, Math.ceil((coolUntil - Date.now()) / 1000))

  const submit = (raw: string): boolean => {
    if (cooling) return false
    const value = norm(raw)
    if (!value) return false
    if (matches(value, hash)) {
      play('solve')
      setMsg('')
      setBad(false)
      onSolved(rv(frag))
      return true
    }
    play('error')
    const n = wrong + 1
    setWrong(n)
    setBad(true)
    window.setTimeout(() => setBad(false), 450)
    if (n >= 3) {
      const wait = n >= 7 ? 25 : n >= 5 ? 15 : 8
      setCoolUntil(Date.now() + wait * 1000)
      setMsg(`${REJECTIONS[n % REJECTIONS.length]} THE MECHANISM IS HOT.`)
    } else {
      setMsg(REJECTIONS[n % REJECTIONS.length])
    }
    return false
  }

  return { submit, msg, bad, cooling }
}

interface Props {
  label: string
  placeholder: string
  hash: string
  frag: string
  onSolved: (word: string) => void
}

export default function AnswerLock({ label, placeholder, hash, frag, onSolved }: Props) {
  const [value, setValue] = useState('')
  const { submit, msg, bad, cooling } = useLock(hash, frag, onSolved)

  return (
    <form
      className={`lock${bad ? ' bad' : ''}`}
      onSubmit={(e) => {
        e.preventDefault()
        if (submit(value)) setValue('')
      }}
    >
      <span className="lock-label">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={cooling ? `LOCKED FOR ${cooling}s` : placeholder}
        disabled={cooling > 0}
        autoComplete="off"
        spellCheck={false}
        aria-label={label}
      />
      <button className="btn primary" type="submit" disabled={cooling > 0}>
        {cooling ? `WAIT ${cooling}s` : 'SUBMIT'}
      </button>
      <div className={`lock-msg${cooling ? ' cool' : ''}`}>{cooling ? `MECHANISM COOLING — ${cooling}s` : msg}</div>
    </form>
  )
}
