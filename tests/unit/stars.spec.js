import { describe, expect, test } from 'vitest'
import { getRatingText, getStarCount } from '../../src/utils/stars'

describe('stars', () => {
  test('maps accuracy thresholds to star counts', () => {
    expect(getStarCount(69)).toBe(0)
    expect(getStarCount(70)).toBe(1)
    expect(getStarCount(80)).toBe(2)
    expect(getStarCount(90)).toBe(3)
    expect(getStarCount(95)).toBe(4)
    expect(getStarCount(100)).toBe(5)
  })

  test('maps accuracy thresholds to rating text', () => {
    expect(getRatingText(69)).toBe('加油！')
    expect(getRatingText(70)).toBe('再来！')
    expect(getRatingText(80)).toBe('不错！')
    expect(getRatingText(90)).toBe('很好！')
    expect(getRatingText(95)).toBe('真棒！')
    expect(getRatingText(100)).toBe('太棒了！')
  })
})
