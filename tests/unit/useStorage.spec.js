import { beforeEach, describe, expect, test, vi } from 'vitest'

const STORAGE_KEY = 'math-game-data'

function createStorageMock(initialData = null) {
  let store = {}

  if (initialData !== null) {
    store[STORAGE_KEY] = initialData
  }

  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
}

async function loadUseStorage() {
  vi.resetModules()
  return import('../../src/composables/useStorage.js')
}

describe('useStorage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  test('updates best score and unlocks completed difficulties', async () => {
    vi.stubGlobal('localStorage', createStorageMock())

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()

    const updated = storage.updateBestScore(16, {
      score: 90,
      correctCount: 9,
      totalCount: 10,
      accuracy: 90,
      duration: 25,
      completedAt: '2026-03-25T00:00:00.000Z',
      incorrectQuestions: []
    })

    expect(updated).toMatchObject({
      isNewBest: true,
      isLeaderboard: false,
      leaderboardRank: null
    })
    expect(storage.getBestScore(16)).toMatchObject({
      score: 90,
      accuracy: 90,
      duration: 25
    })
    expect(storage.getCompletedDifficulties()).toEqual([16])
  })

  test('does not replace a stronger best score with a weaker result', async () => {
    vi.stubGlobal('localStorage', createStorageMock())

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()

    storage.updateBestScore(5, {
      score: 120,
      correctCount: 12,
      totalCount: 12,
      accuracy: 100,
      duration: 20,
      completedAt: '2026-03-25T00:00:00.000Z',
      incorrectQuestions: []
    })

    const updated = storage.updateBestScore(5, {
      score: 100,
      correctCount: 10,
      totalCount: 12,
      accuracy: 83,
      duration: 18,
      completedAt: '2026-03-25T00:05:00.000Z',
      incorrectQuestions: []
    })

    expect(updated).toMatchObject({
      isNewBest: false,
      isLeaderboard: false,
      leaderboardRank: null
    })
    expect(storage.getBestScore(5)).toMatchObject({
      score: 120,
      accuracy: 100,
      duration: 20
    })
  })

  test('falls back to default data when stored JSON is invalid', async () => {
    vi.stubGlobal('localStorage', createStorageMock('{bad json'))

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()

    expect(storage.getAllBestScores()).toEqual({})
    expect(storage.getCompletedDifficulties()).toEqual([])
  })

  test('normalizes legacy stats before updating results', async () => {
    const legacyData = JSON.stringify({
      bestScores: {},
      leaderboards: {},
      progress: {},
      stats: {
        totalAnswers: 3,
        totalCorrect: 2
      }
    })
    vi.stubGlobal('localStorage', createStorageMock(legacyData))

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()

    expect(() => storage.updateBestScore(8, {
      score: 0,
      correctCount: 0,
      totalCount: 1,
      accuracy: 0,
      duration: 12,
      durationMs: 12000,
      completedAt: '2026-03-25T00:10:00.000Z',
      incorrectQuestions: [
        {
          operand1: 2,
          operand2: 3,
          operator: '+',
          userAnswer: 4
        }
      ]
    })).not.toThrow()

    expect(storage.stats.value).toMatchObject({
      totalAnswers: 4,
      totalCorrect: 2,
      mistakeLedger: {
        '2+3': {
          count: 1,
          lastAnswer: 4
        }
      },
      difficultyStats: {
        8: {
          totalPlayed: 1
        }
      }
    })
  })

  test('tracks wrong and slow questions and lowers weight after fast review answers', async () => {
    vi.stubGlobal('localStorage', createStorageMock())

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()
    const completedAt = '2026-03-25T00:10:00.000Z'

    storage.updateBestScore(8, {
      score: 20,
      correctCount: 2,
      totalCount: 3,
      accuracy: 67,
      duration: 12,
      durationMs: 12000,
      completedAt,
      incorrectQuestions: [
        {
          operand1: 2,
          operand2: 3,
          operator: '+',
          result: 5,
          missingPart: 'answer',
          answer: 5,
          userAnswer: 4
        }
      ],
      questionResults: [
        {
          operand1: 1,
          operand2: 1,
          operator: '+',
          result: 2,
          missingPart: 'answer',
          answer: 2,
          userAnswer: 2,
          isCorrect: true,
          answerDurationMs: 2000
        },
        {
          operand1: 4,
          operand2: 1,
          operator: '+',
          result: 5,
          missingPart: 'answer',
          answer: 5,
          userAnswer: 5,
          isCorrect: true,
          answerDurationMs: 8000
        },
        {
          operand1: 2,
          operand2: 3,
          operator: '+',
          result: 5,
          missingPart: 'answer',
          answer: 5,
          userAnswer: 4,
          isCorrect: false,
          answerDurationMs: 2000
        }
      ]
    })

    let weakQuestions = storage.getWeakQuestions(8)
    const wrongQuestion = weakQuestions.find((question) => question.operand1 === 2)
    const slowQuestion = weakQuestions.find((question) => question.operand1 === 4)

    expect(weakQuestions).toHaveLength(2)
    expect(wrongQuestion).toMatchObject({ wrongCount: 1, slowCount: 0, priority: 3 })
    expect(slowQuestion).toMatchObject({ wrongCount: 0, slowCount: 1, priority: 2 })
    expect(storage.stats.value.difficultyStats[8]).toMatchObject({
      avgResponseTimeMs: 5000,
      responseSampleCount: 2
    })

    const fastReviewResult = {
      score: 10,
      correctCount: 1,
      totalCount: 1,
      accuracy: 100,
      duration: 2,
      durationMs: 2000,
      completedAt,
      incorrectQuestions: [],
      questionResults: [
        {
          operand1: 2,
          operand2: 3,
          operator: '+',
          result: 5,
          missingPart: 'answer',
          answer: 5,
          userAnswer: 5,
          isCorrect: true,
          answerDurationMs: 2000
        }
      ]
    }

    storage.updatePracticeStats(8, fastReviewResult)
    storage.updatePracticeStats(8, fastReviewResult)
    storage.updatePracticeStats(8, fastReviewResult)
    weakQuestions = storage.getWeakQuestions(8)

    expect(weakQuestions.find((question) => question.operand1 === 2)).toMatchObject({
      correctStreak: 3,
      priority: 3 / 64
    })
    expect(storage.stats.value).toMatchObject({
      totalAnswers: 3,
      totalCorrect: 2
    })
    expect(storage.stats.value.difficultyStats[8]).toMatchObject({
      responseSampleCount: 2,
      totalPlayed: 1
    })
  })

  test('filters leaderboards to the requested question count', async () => {
    const storedData = JSON.stringify({
      bestScores: {},
      leaderboards: {
        3: [
          { durationMs: 12000, completedAt: '2026-03-25T00:00:00.000Z', totalCount: 20 },
          { durationMs: 9000, completedAt: '2026-03-25T00:01:00.000Z', totalCount: 10 },
          { durationMs: 7000, completedAt: '2026-03-25T00:02:00.000Z' }
        ]
      },
      progress: {},
      stats: {}
    })
    vi.stubGlobal('localStorage', createStorageMock(storedData))

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()

    expect(storage.getLeaderboard(3, 20)).toEqual([
      { durationMs: 12000, completedAt: '2026-03-25T00:00:00.000Z', totalCount: 20 }
    ])
  })

  test('adds leaderboard entries only against matching question counts', async () => {
    const storedData = JSON.stringify({
      bestScores: {},
      leaderboards: {
        4: [
          { durationMs: 10000, completedAt: '2026-03-25T00:00:00.000Z', totalCount: 12 },
          { durationMs: 18000, completedAt: '2026-03-25T00:01:00.000Z', totalCount: 10 }
        ]
      },
      progress: {},
      stats: {}
    })
    vi.stubGlobal('localStorage', createStorageMock(storedData))

    const { useStorage } = await loadUseStorage()
    const storage = useStorage()

    const updated = storage.updateBestScore(4, {
      score: 100,
      correctCount: 10,
      totalCount: 10,
      accuracy: 100,
      duration: 15,
      durationMs: 15000,
      completedAt: '2026-03-25T00:05:00.000Z',
      incorrectQuestions: []
    })

    expect(updated).toMatchObject({
      isLeaderboard: true,
      leaderboardRank: 1
    })
    expect(storage.getLeaderboard(4, 10)).toEqual([
      { durationMs: 15000, completedAt: '2026-03-25T00:05:00.000Z', totalCount: 10 },
      { durationMs: 18000, completedAt: '2026-03-25T00:01:00.000Z', totalCount: 10 }
    ])
  })
})
