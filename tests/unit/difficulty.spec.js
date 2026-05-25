import { describe, expect, test } from 'vitest'
import { TOTAL_LEVELS, getDifficultyById } from '../../src/config/difficulty'

describe('difficulty config', () => {
  test('uses the expanded per-level question counts', () => {
    const questionCounts = Array.from({ length: TOTAL_LEVELS }, (_, index) => {
      return getDifficultyById(index + 1).questionCount
    })

    expect(questionCounts).toEqual([
      20, 20, 24, 24, 24, 30, 30, 24,
      24, 28, 28, 30, 28, 28, 30, 32,
      32, 32, 32, 32, 32, 36, 36, 40
    ])
  })
})
