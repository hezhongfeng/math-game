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

    expect(updated).toBe(true)
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

    expect(updated).toBe(false)
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
})
