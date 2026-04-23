import { describe, expect, test } from 'vitest'
import { getResultPraiseKey, getResultPraiseText } from '../../src/composables/useSound'

describe('useSound result praise', () => {
  test('prioritizes new best praise for normal rounds', () => {
    const result = {
      accuracy: 100,
      isNewBest: true,
      isReviewRound: false
    }

    expect(getResultPraiseText(result)).toBe('新纪录！真厉害！')
    expect(getResultPraiseKey(result)).toBe('newBest')
  })

  test('uses review-round praise without new best wording', () => {
    const perfectReview = {
      accuracy: 100,
      isNewBest: true,
      isReviewRound: true
    }
    const moreReview = {
      accuracy: 80,
      isReviewRound: true
    }

    expect(getResultPraiseText(perfectReview)).toBe('复习完成，越来越熟了！')
    expect(getResultPraiseKey(perfectReview)).toBe('reviewPerfect')
    expect(getResultPraiseText(moreReview)).toBe('再练一次，会更熟！')
    expect(getResultPraiseKey(moreReview)).toBe('reviewMore')
  })

  test('maps normal round accuracy to short child-friendly praise', () => {
    expect(getResultPraiseText({ accuracy: 100 })).toBe('太棒了，全部答对！')
    expect(getResultPraiseKey({ accuracy: 100 })).toBe('perfect')
    expect(getResultPraiseText({ accuracy: 92 })).toBe('真厉害，过关啦！')
    expect(getResultPraiseKey({ accuracy: 92 })).toBe('greatPass')
    expect(getResultPraiseText({ accuracy: 85 })).toBe('过关啦，继续挑战！')
    expect(getResultPraiseKey({ accuracy: 85 })).toBe('pass')
    expect(getResultPraiseText({ accuracy: 84 })).toBe('没关系，再试一次！')
    expect(getResultPraiseKey({ accuracy: 84 })).toBe('tryAgain')
  })
})
