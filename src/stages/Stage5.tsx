import AnswerLock from '../components/AnswerLock'
import Decoder from '../components/Decoder'
import { S5_SEGMENT_A, S5_SEGMENT_B } from '../game/content'
import type { StageProps } from './types'

export default function Stage5({ def, onSolved, readOnly }: StageProps) {
  return (
    <>
      <div className="cols">
        <Decoder
          id="s5a"
          title="Vance machine — segment I"
          cipher={S5_SEGMENT_A}
          readOnly={readOnly}
          note="Spacing was stripped by the machine. Read the output as a run of letters."
        />
        <Decoder id="s5b" title="Vance machine — segment II" cipher={S5_SEGMENT_B} readOnly={readOnly} />
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h3 className="panel-title">Bench notes</h3>
        <div className="cols">
          <p style={{ marginTop: 0 }}>
            The machine takes a key of any length and steps through it letter by letter. A wrong key produces
            confident nonsense — the machine has no opinion about whether you are right.
          </p>
          <div className="hint-box" style={{ flex: '1 1 340px' }}>
            Clipped to segment I, in Vance&rsquo;s hand:
            <br />
            <b>
              &ldquo;Key one is the chamber my survey never entered. I never wrote the second key down — I said it out
              loud, in the first half, to whoever got that far.&rdquo;
            </b>
          </div>
        </div>
        <p className="note" style={{ marginBottom: 0 }}>
          Earlier plates remain available in the ARCHIVE at the top of the screen.
        </p>
      </div>

      {!readOnly && (
        <AnswerLock label={def.prompt} placeholder={def.placeholder} hash={def.hash} frag={def.frag} onSolved={onSolved} />
      )}
    </>
  )
}
