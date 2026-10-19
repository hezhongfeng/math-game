import { describe, expect, test, vi } from 'vitest'
import { TOTAL_LEVELS, getDifficultyById } from '../../src/config/difficulty'
import { checkAnswer, generateQuestions, getQuestionKey } from '../../src/utils/generator'
import { getQuestionSkill } from '../../src/utils/questionSkills'

function withSeed(seed, run) {
  let state = seed
  const random = vi.spyOn(Math, 'random').mockImplementation(() => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  })
  try {
    return run()
  } finally {
    random.mockRestore()
  }
}

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

  test('mixes weak questions and variants into half of a normal round', () => {
    const questions = generateQuestions({
      range: [0, 10],
      operation: 'add',
      questionCount: 20
    }, {
      weakQuestions: [
        {
          operand1: 2,
          operand2: 3,
          operator: '+',
          answer: 5,
          result: 5,
          missingPart: 'answer',
          wrongCount: 2,
          slowCount: 0,
          correctStreak: 0
        },
        {
          operand1: 4,
          operand2: 1,
          operator: '+',
          answer: 5,
          result: 5,
          missingPart: 'answer',
          wrongCount: 0,
          slowCount: 2,
          correctStreak: 0
        }
      ]
    })

    const weakReviews = questions.filter((question) => question.isWeakReview)

    expect(questions).toHaveLength(20)
    expect(weakReviews).toHaveLength(10)
    expect(weakReviews.filter((question) => question.weakReason === 'mistake')).toHaveLength(5)
    expect(weakReviews.filter((question) => question.weakReason === 'slow')).toHaveLength(5)
    expect(weakReviews.some((question) => (
      question.operand1 === 2 && question.operand2 === 3 && question.weakReviewKind === 'exact'
    ))).toBe(true)
    expect(weakReviews.some((question) => question.weakReviewKind === 'variant')).toBe(true)
  })

  test('returns mastered weak questions to low-frequency normal sampling', () => {
    const questions = generateQuestions({
      range: [0, 10],
      operation: 'add',
      questionCount: 20
    }, {
      weakQuestions: [
        {
          operand1: 2,
          operand2: 3,
          operator: '+',
          answer: 5,
          result: 5,
          missingPart: 'answer',
          wrongCount: 2,
          slowCount: 0,
          correctStreak: 3
        }
      ]
    })

    expect(questions.filter((question) => question.isWeakReview)).toHaveLength(0)
  })

  test.each([
    [12, { operand1: 6, operand2: 4, operator: '+', answer: 10 }, { bondDirect: 6, bondGap: 18, bondSubtract: 6 }],
    [17, { operand1: 4, operand2: 5, operator: '+', answer: 5, result: 9, missingPart: 'operand2' }, { direct: 16, gap: 8, split: 8 }],
    [26, { operand1: 9, operand2: 8, operator: '+', answer: 17 }, { direct: 16, bridge: 10, blank: 8, bond: 6 }]
  ])('level %i protects teaching quotas when one ability has many mistakes', (id, source, counts) => {
    for (let seed = 1; seed <= 20; seed++) {
      const questions = withSeed(seed, () => generateQuestions(getDifficultyById(id), {
        weakQuestions: [{ ...source, wrongCount: 10 }]
      }))
      Object.entries(counts).forEach(([bucket, count]) => {
        expect(questions.filter((q) => q.mixBucket === bucket)).toHaveLength(count)
      })
      const reviews = questions.filter((q) => q.isWeakReview)
      expect(reviews.length).toBeGreaterThan(0)
      expect(reviews.length).toBeLessThanOrEqual(counts[id === 12 ? 'bondDirect' : id === 17 ? 'gap' : 'bridge'])
      expect(reviews.every((q) => getQuestionSkill(q) === getQuestionSkill(source))).toBe(true)
    }
  })

  test('preserves small, medium and large subtraction quotas during adaptive review', () => {
    const source = { operand1: 9, operand2: 6, operator: '-', answer: 3, wrongCount: 8 }
    for (let seed = 1; seed <= 20; seed++) {
      const questions = withSeed(seed, () => generateQuestions(getDifficultyById(16), { weakQuestions: [source] }))
      expect(questions.filter((q) => q.operand2 <= 2)).toHaveLength(12)
      expect(questions.filter((q) => q.operand2 >= 3 && q.operand2 <= 5)).toHaveLength(12)
      expect(questions.filter((q) => q.operand2 >= 6)).toHaveLength(8)
    }
  })

  test('reaches the 50% target when weak records cover all current abilities', () => {
    for (let id = 1; id <= TOTAL_LEVELS; id += 1) {
      const difficulty = getDifficultyById(id)
      const baseQuestions = generateQuestions(difficulty)
      const weakQuestions = baseQuestions.map((question, index) => ({
        ...question,
        wrongCount: index % 2 === 0 ? 1 : 0,
        slowCount: index % 2 === 1 ? 1 : 0,
        correctStreak: 0
      }))
      const questions = generateQuestions(difficulty, { weakQuestions })

      expect(questions, `level ${id}`).toHaveLength(difficulty.questionCount)
      expect(
        questions.filter((question) => question.isWeakReview),
        `level ${id}`
      ).toHaveLength(Math.ceil(difficulty.questionCount * 0.5))
    }
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

  test.each([12, 20])('level %i tests ten relationships without a constant answer', (id) => {
    const difficulty = getDifficultyById(id)
    for (let seed = 1; seed <= 20; seed++) {
      const questions = withSeed(seed, () => generateQuestions(difficulty))
      expect(questions).toHaveLength(difficulty.questionCount)
      expect(questions.filter((q) => q.answer === 10)).toHaveLength(Math.floor(difficulty.questionCount * 0.2))
      expect(new Set(questions.map((q) => q.answer)).size).toBeGreaterThanOrEqual(8)
      expect(questions.some((q) => q.missingPart === 'operand2')).toBe(true)
      expect(questions.some((q) => q.missingPart === 'operand1')).toBe(id === 20)
      questions.forEach((question) => {
        expect(question.operand1).toBeGreaterThanOrEqual(1)
        expect(question.operand2).toBeGreaterThanOrEqual(1)
        if (question.operator === '+') {
          expect(question.result).toBe(10)
        } else {
          expect(question.operand1).toBe(10)
          expect(question.missingPart).toBe('answer')
        }
      })
    }
  })

  test('keeps arithmetic and level bounds valid even with obsolete weak records', () => {
    for (let id = 1; id <= TOTAL_LEVELS; id++) {
      const difficulty = getDifficultyById(id)
      const max = difficulty.range[1]
      const weakQuestions = [{
        operand1: max, operand2: max, operator: '+', answer: max * 2,
        wrongCount: 3, correctStreak: 0
      }]
      for (let seed = 1; seed <= 20; seed++) {
        const questions = withSeed(seed, () => generateQuestions(difficulty, { weakQuestions }))
        expect(questions, `level ${id}, seed ${seed}`).toHaveLength(difficulty.questionCount)
        questions.forEach((q, index) => {
          const result = q.operator === '+' ? q.operand1 + q.operand2 : q.operand1 - q.operand2
          expect(q.result).toBe(result)
          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(max)
          expect(q.answer).toBe(q.missingPart === 'answer' ? result : q[q.missingPart])
          expect(q.id).toBe(index + 1)
        })
      }
    }
  })

  test.each([8, 13])('level %i includes equal-addend right-side blanks', (id) => {
    const observed = new Set()
    for (let seed = 1; seed <= 40; seed++) {
      withSeed(seed, () => generateQuestions(getDifficultyById(id))).forEach((q) => {
        if (q.missingPart === 'operand2') observed.add(`${q.operand1}+?=${q.result}`)
      })
    }
    expect(observed.has('1+?=2')).toBe(true)
    expect(observed.has('2+?=4')).toBe(true)
    if (id === 13) expect(observed.has('5+?=10')).toBe(true)
  })

  test.each([
    [16, ['9-6', '10-9', '10-10']],
    [18, ['16+3', '10+9']],
    [19, ['18-7', '19-9']],
    [21, ['8+7', '9+9']],
    [23, ['13-8', '14-6', '17-9']]
  ])('level %i covers larger steps after its introductory questions', (id, expected) => {
    const observed = new Set()
    for (let seed = 1; seed <= 40; seed++) {
      const questions = withSeed(seed, () => generateQuestions(getDifficultyById(id)))
      questions.forEach((q) => observed.add(`${q.operand1}${q.operator}${q.operand2}`))
      if (id === 21) {
        expect(questions.filter((q) => Math.min(q.operand1, q.operand2) >= 6).length).toBeGreaterThanOrEqual(8)
        questions.forEach((q) => {
          expect(q.operand1).toBeLessThan(10)
          expect(q.operand2).toBeLessThan(10)
          expect(q.answer).toBeGreaterThan(10)
        })
      }
      if (id === 23) {
        expect(questions.filter((q) => q.operand2 >= 8).length).toBeGreaterThanOrEqual(8)
        questions.forEach((q) => {
          expect(q.operand1).toBeGreaterThan(10)
          expect(q.operand2).toBeLessThan(10)
          expect(q.answer).toBeLessThan(10)
        })
      }
    }
    expected.forEach((expression) => expect(observed.has(expression), expression).toBe(true))
  })

  test('rejects old weak questions outside the current stage, including in mixed bond levels', () => {
    const cases = [
      [8, { operand1: 2, operand2: 3, operator: '+', result: 5, missingPart: 'operand1', answer: 2 }],
      [12, { operand1: 10, operand2: 0, operator: '+', answer: 10 }],
      [20, { operand1: 4, operand2: 2, operator: '+', answer: 6 }],
      [21, { operand1: 10, operand2: 2, operator: '+', answer: 12 }],
      [23, { operand1: 10, operand2: 4, operator: '-', answer: 6 }]
    ]
    cases.forEach(([id, question]) => {
      const questions = generateQuestions(getDifficultyById(id), {
        weakQuestions: [{ ...question, wrongCount: 2 }]
      })
      expect(questions.some((q) => q.isWeakReview), `level ${id}`).toBe(false)
      expect(questions.some((q) => getQuestionKey(q) === getQuestionKey(question))).toBe(false)
    })
  })

  test('spaces repeated questions in both fresh and adaptive rounds', () => {
    for (let id = 1; id <= TOTAL_LEVELS; id++) {
      const difficulty = getDifficultyById(id)
      for (let seed = 1; seed <= 20; seed++) {
        withSeed(seed, () => {
          const fresh = generateQuestions(difficulty)
          const adaptive = generateQuestions(difficulty, {
            weakQuestions: [{ ...fresh[0], wrongCount: 1 }]
          })
          for (const questions of [fresh, adaptive]) {
            questions.forEach((q, index) => {
              if (index) expect(getQuestionKey(q), `level ${id}, seed ${seed}`).not.toBe(getQuestionKey(questions[index - 1]))
            })
          }
          const reviews = adaptive.filter((q) => q.isWeakReview)
          expect(reviews.length).toBeGreaterThan(0)
          expect(reviews.length).toBeLessThanOrEqual(Math.ceil(difficulty.questionCount * 0.5))
          expect(reviews.every((q) => getQuestionSkill(q) === getQuestionSkill(fresh[0]))).toBe(true)
        })
      }
    }
  })

  test.each([8, 19, 21, 23])('level %i separates repeated questions by at least three other questions', (id) => {
    for (let seed = 1; seed <= 20; seed++) {
      const questions = withSeed(seed, () => generateQuestions(getDifficultyById(id)))
      const lastSeen = new Map()
      questions.forEach((q, index) => {
        const key = getQuestionKey(q)
        if (lastSeen.has(key)) expect(index - lastSeen.get(key)).toBeGreaterThan(3)
        lastSeen.set(key, index)
      })
    }
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
