import { describe, expect, test } from 'vitest'
import { checkAnswer, generateQuestions } from '../../src/utils/generator'

describe('generator', () => {
  test('subtract questions always keep non-negative results', () => {
    const questions = generateQuestions({
      range: [0, 20],
      operation: 'subtract',
      questionCount: 16
    })

    expect(questions).toHaveLength(16)

    questions.forEach((question) => {
      expect(question.operator).toBe('-')
      expect(question.operand1).toBeGreaterThanOrEqual(question.operand2)
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.missingPart).toBe('answer')
      expect(question.result).toBe(question.answer)
    })
  })

  test('missingAddStart only generates left-missing addition questions', () => {
    const questions = generateQuestions({
      range: [0, 5],
      operation: 'missingAddStart',
      questionCount: 8
    })

    expect(questions).toHaveLength(8)

    questions.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand1')
      expect(question.result).toBe(question.operand1 + question.operand2)
      expect(question.answer).toBe(question.operand1)
      expect(question.result).toBeLessThanOrEqual(5)
    })
  })

  test('missingAddMixed keeps answers and display data aligned', () => {
    const questions = generateQuestions({
      range: [0, 20],
      operation: 'missingAddMixed',
      questionCount: 12
    })

    expect(questions).toHaveLength(12)

    questions.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(['operand1', 'operand2']).toContain(question.missingPart)
      expect(question.result).toBe(question.operand1 + question.operand2)

      if (question.missingPart === 'operand1') {
        expect(question.answer).toBe(question.operand1)
      } else {
        expect(question.answer).toBe(question.operand2)
      }
    })
  })

  test('gap stages only generate right-side missing addend questions', () => {
    const questions = generateQuestions({
      range: [0, 5],
      operation: 'missingAddMixed',
      stage: 'gapWithinFive',
      questionCount: 12
    })

    expect(questions).toHaveLength(12)

    questions.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand2')
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
      expect(question.result).toBeLessThanOrEqual(5)
      expect(question.answer).toBe(question.operand2)
    })
  })

  test('makeTenBridge focuses on non-zero pairs that make 10', () => {
    const questions = generateQuestions({
      range: [0, 10],
      operation: 'add',
      stage: 'makeTenBridge',
      questionCount: 16
    })

    expect(questions).toHaveLength(16)

    questions.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.answer).toBe(10)
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
    })
  })

  test('subtractFromTen keeps subtraction near 10 before borrow practice', () => {
    const questions = generateQuestions({
      range: [0, 20],
      operation: 'subtract',
      stage: 'subtractFromTen',
      questionCount: 16
    })

    expect(questions).toHaveLength(16)

    questions.forEach((question) => {
      expect(question.operator).toBe('-')
      expect(question.operand1).toBeLessThanOrEqual(12)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeLessThanOrEqual(5)
      expect(question.answer).toBeGreaterThanOrEqual(5)
    })
  })

  test('checkAnswer validates missing-number questions against the real answer', () => {
    const question = {
      operand1: 3,
      operand2: 2,
      operator: '+',
      result: 5,
      missingPart: 'operand1',
      answer: 3
    }

    expect(checkAnswer(question, 3)).toBe(true)
    expect(checkAnswer(question, 2)).toBe(false)
  })

  test('withinTenMixed keeps the planned 16/8/8 blend across direct, gap, and split prompts', () => {
    const questions = generateQuestions({
      range: [0, 10],
      operation: 'mixed',
      stage: 'withinTenMixed',
      questionCount: 32
    })

    expect(questions).toHaveLength(32)

    const direct = questions.filter((question) => question.mixBucket === 'direct')
    const gap = questions.filter((question) => question.mixBucket === 'gap')
    const split = questions.filter((question) => question.mixBucket === 'split')

    expect(direct).toHaveLength(16)
    expect(gap).toHaveLength(8)
    expect(split).toHaveLength(8)

    direct.forEach((question) => {
      expect(question.missingPart).toBe('answer')
      expect(['+', '-']).toContain(question.operator)
      expect(question.result).toBe(question.answer)
    })

    gap.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand2')
      expect(question.result).toBeLessThanOrEqual(10)
      expect(question.answer).toBe(question.operand2)
    })

    split.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand1')
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
      expect(question.result).toBeLessThanOrEqual(10)
      expect(question.answer).toBe(question.operand1)
    })
  })

  test('withinTwentyMixedAdvanced keeps the planned 16/10/8/6 blend across direct, bridge, blank, and bond prompts', () => {
    const questions = generateQuestions({
      range: [0, 20],
      operation: 'mixed',
      stage: 'withinTwentyMixedAdvanced',
      questionCount: 40
    })

    expect(questions).toHaveLength(40)

    const direct = questions.filter((question) => question.mixBucket === 'direct')
    const bridge = questions.filter((question) => question.mixBucket === 'bridge')
    const blank = questions.filter((question) => question.mixBucket === 'blank')
    const bond = questions.filter((question) => question.mixBucket === 'bond')

    expect(direct).toHaveLength(16)
    expect(bridge).toHaveLength(10)
    expect(blank).toHaveLength(8)
    expect(bond).toHaveLength(6)

    direct.forEach((question) => {
      expect(question.missingPart).toBe('answer')
      expect(question.result).toBe(question.answer)
      expect(question.answer).toBeLessThanOrEqual(20)
    })

    bridge.forEach((question) => {
      expect(question.missingPart).toBe('answer')
      expect(['+', '-']).toContain(question.operator)
      expect(question.answer).toBeLessThanOrEqual(20)
    })

    blank.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand2')
      expect(question.result).toBeLessThanOrEqual(20)
      expect(question.answer).toBe(question.operand2)
    })

    bond.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('answer')
      expect(question.answer).toBe(10)
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
    })
  })
})
