import { describe, expect, test } from 'vitest'
import { getResultBallRows, getResultBallStageClass } from '../../src/utils/exploreStage'

describe('exploreStage', () => {
  test('clamps result ball rows to the decimal grid height', () => {
    expect(getResultBallRows(1)).toBe(1)
    expect(getResultBallRows(10)).toBe(1)
    expect(getResultBallRows(11)).toBe(2)
    expect(getResultBallRows(100)).toBe(10)
    expect(getResultBallRows(1000)).toBe(10)
  })

  test('maps row counts to responsive stage shape classes', () => {
    expect(getResultBallStageClass(20)).toBe('result-ball-shell--wide')
    expect(getResultBallStageClass(21)).toBe('result-ball-shell--landscape')
    expect(getResultBallStageClass(50)).toBe('result-ball-shell--landscape')
    expect(getResultBallStageClass(51)).toBe('result-ball-shell--square')
    expect(getResultBallStageClass(1000)).toBe('result-ball-shell--square')
  })
})
