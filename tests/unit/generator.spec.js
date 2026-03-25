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
})
