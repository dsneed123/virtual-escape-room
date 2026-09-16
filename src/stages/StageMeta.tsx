import AnswerLock from '../components/AnswerLock'
import Decoder from '../components/Decoder'
import { META_CIPHER, META_NOTE, STAGES } from '../game/content'
import type { Solve } from '../game/state'
import type { StageProps } from './types'

interface Props extends StageProps {
  solves: Solve[]
}

export default function StageMeta({ def, onSolved, readOnly, solves }: Props) {
  const rows = STAGES.slice(0, 7).map((s) => ({
    n: s.n,
    title: s.title,
    channel: s.channel,
    word: solves.find((x) => x.stage === s.n)?.fragment ?? '—',
  }))

  return (
    <>
      <div className="cols">
        <div className="panel" style={{ flex: '1 1 460px' }}>
          <h3 className="panel-title">Unsealed note — found in the slot</h3>
          {META_NOTE.map((line, i) => (
            <p key={i} style={{ marginTop: i === 0 ? 0 : undefined, fontSize: '1.05rem' }}>
              {line}
            </p>
          ))}
        </div>

        <div className="panel" style={{ flex: '1 1 380px' }}>
          <h3 className="panel-title">Everything you are carrying — every door, its channel, its word</h3>
          <table className="data" style={{ fontSize: '1.1rem' }}>
            <thead>
              <tr>
                <th>Door</th>
                <th>Channel</th>
                <th>Fragment</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n}>
                  <td style={{ color: 'var(--dim)' }}>
                    {r.n} · {r.title}
                  </td>
                  <td style={{ color: 'var(--accent)', letterSpacing: '0.16em' }}>{r.channel}</td>
                  <td style={{ letterSpacing: '0.2em' }}>{r.word}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cols" style={{ marginTop: 18 }}>
        <Decoder
          id="meta"
          title="Vance machine — terminal block"
          cipher={META_CIPHER}
          readOnly={readOnly}
          note="The eighth door takes a phrase, not a word."
        />
        <div className="panel" style={{ flex: '1 1 320px' }}>
          <h3 className="panel-title">The slot</h3>
          <p style={{ marginTop: 0 }}>
            No channel of its own, no plate to read. A slot at chest height, the machine on the bench beside it,
            and an archive quietly filing itself into oblivion somewhere below your feet.
          </p>
          <p style={{ marginBottom: 0 }}>
            Whatever the machine hands back when it is keyed correctly is exactly what the slot is waiting to
            hear. Type that.
          </p>
        </div>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
