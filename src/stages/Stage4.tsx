import type React from 'react'
import AnswerLock from '../components/AnswerLock'
import { S4_CRATES, S4_ORDER } from '../game/content'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { StageProps } from './types'

export default function Stage4({ def, onSolved, readOnly }: StageProps) {
  const [lit, setLit] = useScratch<string[]>('s4.lit', [])
  const toggle = (id: string) => {
    if (readOnly) return
    play('tap')
    setLit((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))
  }
  const rowProps = (id: string) => ({
    className: `pick${lit.includes(id) ? ' lit' : ''}`,
    role: 'button',
    tabIndex: readOnly ? -1 : 0,
    'aria-pressed': lit.includes(id),
    onKeyDown: (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.currentTarget.click()
      }
    },
    onClick: () => toggle(id),
  })

  return (
    <>
      <div className="panel" style={{ marginBottom: 18 }}>
        <h3 className="panel-title">Requisition order 44-C — filed by H. VANCE against himself</h3>
        <ol className="mono-list" style={{ columns: 2, fontSize: '1.02rem' }}>
          {S4_ORDER.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ol>
        <p className="note" style={{ marginBottom: 0 }}>
          Clicking a crate highlights it in all three ledgers at once. Split the ledgers between you.
        </p>
      </div>

      <div className="cols">
        <div className="panel">
          <h3 className="panel-title">Ledger I — crate manifest</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Crate</th>
                <th>Label</th>
                <th className="num">Mass</th>
                <th>Seal</th>
              </tr>
            </thead>
            <tbody>
              {S4_CRATES.map((c) => (
                <tr key={c.id} {...rowProps(c.id)}>
                  <td style={{ color: 'var(--dim)' }}>{c.id}</td>
                  <td style={{ letterSpacing: '0.1em' }}>{c.label}</td>
                  <td className="num">{c.mass} kg</td>
                  <td>{c.seal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3 className="panel-title">Ledger II — thermal record</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Crate</th>
                <th className="num">CP1</th>
                <th className="num">CP2</th>
                <th className="num">CP3</th>
              </tr>
            </thead>
            <tbody>
              {[...S4_CRATES]
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((c) => (
                  <tr key={c.id} {...rowProps(c.id)}>
                    <td style={{ color: 'var(--dim)' }}>{c.id}</td>
                    {c.temps.map((t, i) => (
                      <td key={i} className="num">
                        {t.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="note" style={{ marginBottom: 0 }}>All readings in °C.</p>
        </div>

        <div className="panel">
          <h3 className="panel-title">Ledger III — handling &amp; bays</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Crate</th>
                <th>Signed for by</th>
                <th>Bays held</th>
              </tr>
            </thead>
            <tbody>
              {[...S4_CRATES]
                .sort((a, b) => a.handler.localeCompare(b.handler) || a.id.localeCompare(b.id))
                .map((c) => (
                  <tr key={c.id} {...rowProps(c.id)}>
                    <td style={{ color: 'var(--dim)' }}>{c.id}</td>
                    <td>{c.handler}</td>
                    <td>{c.bays.join(' · ')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
