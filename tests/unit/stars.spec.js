import { describe, expect, test } from 'vitest'
import { getRatingText, getStarCount } from '../../src/utils/stars'

describe('stars', () => {
  test('maps accuracy thresholds to star counts', () => {
    expect(getStarCount(59)).toBe(0)
    expect(getStarCount(60)).toBe(1)
    expect(getStarCount(70)).toBe(2)
    expect(getStarCount(80)).toBe(3)
    expect(getStarCount(90)).toBe(4)
    expect(getStarCount(98)).toBe(5)
  })

  test('maps accuracy thresholds to rating text', () => {
    expect(getRatingText(59)).toBe('再接再厉！')
    expect(getRatingText(60)).toBe('继续加油！')
    expect(getRatingText(70)).toBe('进步明显！')
    expect(getRatingText(80)).toBe('表现很棒！')
    expect(getRatingText(90)).toBe('非常优秀！')
    expect(getRatingText(98)).toBe('太棒了！')
  })
})
