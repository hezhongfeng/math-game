import { describe, expect, test } from 'vitest'
import { getQuestionSkill } from '../../src/utils/questionSkills'

const question = (operand1, operator, operand2, extra = {}) => ({ operand1, operator, operand2, ...extra })

describe('question abilities', () => {
  test('separates bridge-ten, teen arithmetic, and making ten', () => {
    expect(getQuestionSkill(question(8, '+', 5))).toBe(getQuestionSkill(question(9, '+', 7)))
    expect(getQuestionSkill(question(8, '+', 5))).not.toBe(getQuestionSkill(question(13, '+', 2)))
    expect(getQuestionSkill(question(8, '+', 2))).not.toBe(getQuestionSkill(question(8, '+', 5)))
    expect(getQuestionSkill(question(13, '-', 8))).toBe(getQuestionSkill(question(17, '-', 9)))
    expect(getQuestionSkill(question(13, '-', 8))).not.toBe(getQuestionSkill(question(10, '-', 8)))
  })

  test('separates number ranges and blank positions, and derives skills from the expression', () => {
    expect(getQuestionSkill(question(1, '+', 1))).toBe(getQuestionSkill(question(2, '+', 2)))
    expect(getQuestionSkill(question(2, '+', 2))).not.toBe(getQuestionSkill(question(3, '+', 1)))
    expect(getQuestionSkill(question(2, '+', 1))).not.toBe(getQuestionSkill(question(8, '+', 1)))
    expect(getQuestionSkill(question(6, '+', 4, { missingPart: 'operand1' })))
      .not.toBe(getQuestionSkill(question(6, '+', 4, { missingPart: 'operand2' })))
    expect(getQuestionSkill(question(6, '+', 4, { missingPart: 'operand2' })))
      .not.toBe(getQuestionSkill(question(3, '+', 4, { missingPart: 'operand2' })))
    expect(getQuestionSkill(question(8, '+', 5, { skillId: 'wrong-tag', answer: 99 })))
      .toBe(getQuestionSkill(question(8, '+', 5)))
  })

  test.each([null, {}, question(1, '*', 2), question(-1, '+', 2), question(2, '-', 5)])('rejects invalid arithmetic %j', (value) => {
    expect(getQuestionSkill(value)).toBe('unknown')
  })
})
