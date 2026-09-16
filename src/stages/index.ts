import Stage1 from './Stage1'
import Stage2 from './Stage2'
import Stage3 from './Stage3'
import Stage4 from './Stage4'
import Stage5 from './Stage5'
import Stage6 from './Stage6'
import Stage7 from './Stage7'
import type { StageProps } from './types'
import type { ComponentType } from 'react'

export const STAGE_BODIES: Record<number, ComponentType<StageProps>> = {
  1: Stage1,
  2: Stage2,
  3: Stage3,
  4: Stage4,
  5: Stage5,
  6: Stage6,
  7: Stage7,
}
