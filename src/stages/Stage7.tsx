import AnswerLock from '../components/AnswerLock'
import { S7_GRID, S7_HOLES } from '../game/content'
import { useScratch } from '../game/scratch'
import { play } from '../game/audio'
import type { StageProps } from './types'

const rotCW = ([r, c]: [number, number]): [number, number] => [c, 5 - r]

function holesAt(turns: number): string[] {
  let cells = S7_HOLES.map((h) => [...h] as [number, number])
  for (let i = 0; i < ((turns % 4) + 4) % 4; i++) cells = cells.map(rotCW)
  return cells.map(([r, c]) => `${r},${c}`)
}

export default function Stage7({ def, onSolved, readOnly }: StageProps) {
  const [turns, setTurns] = useScratch<number>('s7.turns', 2)
  const open = new Set(holesAt(turns))
  const turn = (d: number) => {
    if (readOnly) return
    play('reveal')
    setTurns((t) => (((t + d) % 4) + 4) % 4)
  }

  return (
    <>
      <div className="cols">
        <div className="panel" style={{ flex: '0 0 auto' }}>
          <h3 className="panel-title">Plate 12 — lattice under mask</h3>
          <div className="plate-frame">
            <div className="grille">
              {S7_GRID.map((row, r) =>
                row.split('').map((ch, c) => (
                  <div key={`${r},${c}`} className={`g${open.has(`${r},${c}`) ? ' open' : ''}`}>
                    {ch}
                  </div>
                )),
              )}
            </div>
          </div>
          <div className="pivot">
            <button className="btn" type="button" onClick={() => turn(-1)} aria-label="turn the mask anticlockwise">
              &#8634;
            </button>
            <div className="pin" title="the mask is pinned at its centre">
              &#9679;
            </div>
            <button className="btn" type="button" onClick={() => turn(1)} aria-label="turn the mask clockwise">
              &#8635;
            </button>
            <span className="note">MASK SEATED AT POSITION {turns + 1} OF 4</span>
          </div>
        </div>

        <div className="stack" style={{ flex: '1 1 320px' }}>
          <div className="panel">
            <h3 className="panel-title">Case note</h3>
            <p style={{ marginTop: 0 }}>
              A brass mask sits over the lattice, pinned through its centre so it turns. Six windows, thirty-six
              letters underneath, and it was found sitting wherever the last person left it — not necessarily where
              Vance started it.
            </p>
            <p style={{ marginBottom: 0 }}>
              What shows through, across all four seatings, is one sentence. It does not begin where the mask is
              sitting right now.
            </p>
          </div>
          <div className="panel">
            <h3 className="panel-title">Reading order</h3>
            <p style={{ margin: 0 }}>
              Read each seating the way you read anything else: left to right, top to bottom. Then turn the mask
              with the arrows and read the next six.
            </p>
          </div>
        </div>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
