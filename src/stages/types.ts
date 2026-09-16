import type { StageDef } from '../game/content'

export interface StageProps {
  def: StageDef
  onSolved: (word: string) => void
  readOnly?: boolean
}
