// Every sound is synthesised in the browser — no audio files, no external services.
type Cue = 'start' | 'solve' | 'error' | 'warn' | 'escape' | 'expired' | 'tap' | 'reveal'

let ctx: AudioContext | null = null
let muted = false

export const setMuted = (v: boolean) => {
  muted = v
}

function ac(): AudioContext | null {
  if (muted) return null
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!C) return null
    ctx = new C()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface ToneOpts {
  freq: number
  dur: number
  delay?: number
  type?: OscillatorType
  gain?: number
  sweep?: number
}

function tone(c: AudioContext, { freq, dur, delay = 0, type = 'sine', gain = 0.16, sweep }: ToneOpts) {
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const amp = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(40, sweep), t0 + dur)
  amp.gain.setValueAtTime(0.0001, t0)
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(amp).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function noise(c: AudioContext, dur: number, gain = 0.09) {
  const frames = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, frames, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
  const src = c.createBufferSource()
  const amp = c.createGain()
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900
  amp.gain.value = gain
  src.buffer = buf
  src.connect(filter).connect(amp).connect(c.destination)
  src.start()
}

/** A single note, used by the memory-pad cabinet. */
export function toneOut(freq: number, dur = 0.25) {
  const c = ac()
  if (!c) return
  tone(c, { freq, dur, type: 'triangle', gain: 0.14 })
}

export function play(cue: Cue) {
  const c = ac()
  if (!c) return
  switch (cue) {
    case 'tap':
      tone(c, { freq: 420, dur: 0.05, type: 'square', gain: 0.045 })
      break
    case 'start':
      ;[196, 262, 392].forEach((f, i) => tone(c, { freq: f, dur: 0.5, delay: i * 0.13, type: 'triangle', gain: 0.13 }))
      noise(c, 0.5, 0.05)
      break
    case 'solve':
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(c, { freq: f, dur: 0.42, delay: i * 0.075, type: 'triangle', gain: 0.12 }),
      )
      break
    case 'reveal':
      tone(c, { freq: 320, dur: 0.6, type: 'sine', gain: 0.08, sweep: 620 })
      break
    case 'error':
      tone(c, { freq: 150, dur: 0.26, type: 'sawtooth', gain: 0.1, sweep: 82 })
      noise(c, 0.16, 0.04)
      break
    case 'warn':
      ;[0, 0.22].forEach((d) => tone(c, { freq: 740, dur: 0.14, delay: d, type: 'square', gain: 0.075 }))
      break
    case 'escape':
      ;[261.6, 329.6, 392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(c, { freq: f, dur: 1.1, delay: i * 0.1, type: 'triangle', gain: 0.11 }),
      )
      break
    case 'expired':
      ;[0, 0.36, 0.72].forEach((d) => tone(c, { freq: 138, dur: 0.5, delay: d, type: 'sawtooth', gain: 0.12, sweep: 96 }))
      break
  }
}
