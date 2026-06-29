import { describe, expect, test } from 'vitest'
import { DIFFICULTY_GROUPS, TOTAL_LEVELS, getDifficultyById } from '../../src/config/difficulty'

describe('difficulty config', () => {
  test('exposes 26 ordered levels with the two new capstone stages', () => {
    const questionCounts = Array.from({ length: TOTAL_LEVELS }, (_, index) => {
      return getDifficultyById(index + 1).questionCount
    })

    expect(TOTAL_LEVELS).toBe(26)
    expect(questionCounts).toEqual([
      20, 20, 24, 24, 24, 30, 30, 24,
      24, 28, 28, 30, 28, 28, 30, 32,
      32, 32, 32, 32, 32, 32, 36, 36,
      40, 40
    ])

    expect(getDifficultyById(17).stage).toBe('withinTenMixed')
    expect(getDifficultyById(17).description).toBe('10 以内综合')
    expect(getDifficultyById(18).description).toBe('十几加几')
    expect(getDifficultyById(21).description).toBe('20 以内凑十加法')
    expect(getDifficultyById(23).description).toBe('20 以内破十减法')
    expect(getDifficultyById(25).description).toBe('找缺数')
    expect(getDifficultyById(26).stage).toBe('withinTwentyMixedAdvanced')
    expect(getDifficultyById(26).description).toBe('20 以内综合进阶')
  })

  test('difficulty groups cover every level exactly once in order', () => {
    const flattened = DIFFICULTY_GROUPS.flatMap((group) => group.levels)

    expect(flattened).toEqual(Array.from({ length: TOTAL_LEVELS }, (_, index) => index + 1))
  })
})
