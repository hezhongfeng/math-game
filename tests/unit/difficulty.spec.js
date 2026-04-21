import { describe, expect, test } from 'vitest'
import { DIFFICULTY_GROUPS, TOTAL_LEVELS, getDifficultyById } from '../../src/config/difficulty'

describe('difficulty config', () => {
  test('defines a continuous 24-level mainline', () => {
    expect(TOTAL_LEVELS).toBe(24)

    for (let id = 1; id <= TOTAL_LEVELS; id += 1) {
      const difficulty = getDifficultyById(id)

      expect(difficulty).toBeTruthy()
      expect(difficulty.id).toBe(id)
      expect(difficulty.name).toBe(String(id))
    }
  })

  test('groups cover every level once', () => {
    const groupedIds = DIFFICULTY_GROUPS.flatMap((group) => group.levels)
    const sortedIds = [...groupedIds].sort((left, right) => left - right)

    expect(new Set(groupedIds).size).toBe(TOTAL_LEVELS)
    expect(sortedIds).toEqual(Array.from({ length: TOTAL_LEVELS }, (_, index) => index + 1))
  })
})
