import { group, vigenere } from '../game/crypto'
import { useScratch } from '../game/scratch'

interface Props {
  id: string
  title: string
  cipher: string
  readOnly?: boolean
  note?: string
}

export default function Decoder({ id, title, cipher, readOnly, note }: Props) {
  const [key, setKey] = useScratch<string>(`key.${id}`, '')
  const out = key.trim() ? vigenere(cipher, key) : ''

  return (
    <div className="panel">
      <h3 className="panel-title">{title}</h3>
      <div className="cipher-out" style={{ color: 'var(--dim)' }}>
        {group(cipher)}
      </div>
      <div style={{ margin: '14px 0 8px' }}>
        <div className="lock-label" style={{ marginBottom: 6 }}>
          KEY
        </div>
        <input
          className="key-input"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="ENTER A KEY"
          disabled={readOnly}
          autoComplete="off"
          spellCheck={false}
          aria-label={`${title} key`}
        />
      </div>
      <div className="lock-label" style={{ marginBottom: 6 }}>
        OUTPUT
      </div>
      <div className="cipher-out">{out || <span style={{ color: 'var(--dimmer)' }}>— NO KEY —</span>}</div>
      {note && (
        <p className="note" style={{ marginBottom: 0, marginTop: 10 }}>
          {note}
        </p>
      )}
    </div>
  )
}
