import { describe, expect, test } from 'vitest'
import { getResultPraiseText } from '../../src/composables/useSound'

describe('useSound result praise', () => {
  test('prioritizes new best praise for normal rounds', () => {
    expect(getResultPraiseText({
      accuracy: 100,
      isNewBest: true,
      isReviewRound: false
    })).toBe('新纪录！真厉害！')
  })

  test('uses review-round praise without new best wording', () => {
    expect(getResultPraiseText({
      accuracy: 100,
      isNewBest: true,
      isReviewRound: true
    })).toBe('复习完成，越来越熟了！')

    expect(getResultPraiseText({
      accuracy: 80,
      isReviewRound: true
    })).toBe('再练一次，会更熟！')
  })

  test('maps normal round accuracy to short child-friendly praise', () => {
    expect(getResultPraiseText({ accuracy: 100 })).toBe('太棒了，全部答对！')
    expect(getResultPraiseText({ accuracy: 92 })).toBe('真厉害，过关啦！')
    expect(getResultPraiseText({ accuracy: 85 })).toBe('过关啦，继续挑战！')
    expect(getResultPraiseText({ accuracy: 84 })).toBe('没关系，再试一次！')
  })
})
