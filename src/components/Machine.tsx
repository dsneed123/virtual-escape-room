import Decoder from './Decoder'
import { META_CIPHER, S5_SEGMENT_A, S5_SEGMENT_B } from '../game/content'

export default function Machine({ metaReached, onClose }: { metaReached: boolean; onClose: () => void }) {
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet wide">
        <div className="kicker">BENCH EQUIPMENT</div>
        <h2>THE VANCE MACHINE</h2>
        <p className="note">
          Keyed decoding, letters only. It will answer any key you give it, correct or not.
        </p>
        <div className="cols" style={{ marginTop: 14 }}>
          <Decoder id="s5a" title="Segment I" cipher={S5_SEGMENT_A} />
          <Decoder id="s5b" title="Segment II" cipher={S5_SEGMENT_B} />
          {metaReached && <Decoder id="meta" title="Terminal block" cipher={META_CIPHER} />}
        </div>
        <div className="sheet-actions">
          <button className="btn primary" onClick={onClose}>
            Back to the door
          </button>
        </div>
      </div>
    </div>
  )
}
