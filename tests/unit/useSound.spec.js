import { afterEach, describe, expect, test, vi } from 'vitest'
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

function createMockAudioContext(initialState = 'running', options = {}) {
  let resolveResumePromise = null
  const resumePromise = options.resumePromise || new Promise((resolve) => {
    resolveResumePromise = resolve
  })
  const createGainNode = () => ({
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn()
    },
    connect: vi.fn()
  })

  const ctx = {
    state: initialState,
    currentTime: 1,
    destination: {},
    createGain: vi.fn(() => createGainNode()),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass',
      frequency: { value: 0 },
      Q: { value: 0 },
      connect: vi.fn()
    })),
    createOscillator: vi.fn(() => ({
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    })),
    decodeAudioData: vi.fn(async () => ({})),
    resume: vi.fn(() => {
      ctx.state = 'running'
      return resumePromise
    })
  }

  return {
    ctx,
    resolveResume: () => {
      if (resolveResumePromise) {
        resolveResumePromise()
      }
    }
  }
}

async function loadSoundModule(initialState = 'running', options = {}) {
  vi.resetModules()

  const { ctx: mockContext, resolveResume } = createMockAudioContext(initialState, options)

  class MockAudioContext {
    constructor() {
      return mockContext
    }
  }

  Object.defineProperty(window, 'AudioContext', {
    configurable: true,
    writable: true,
    value: MockAudioContext
  })
  Object.defineProperty(window, 'webkitAudioContext', {
    configurable: true,
    writable: true,
    value: undefined
  })
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    writable: true,
    value: undefined
  })

  return {
    mockContext,
    resolveResume,
    soundModule: await import('../../src/composables/useSound')
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
  delete window.AudioContext
  delete window.webkitAudioContext
  delete window.fetch
})

describe('useSound audio interruption recovery', () => {
  test('resumes interrupted audio context when playing a sound after foregrounding', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('interrupted')

    soundModule.playClick()
    resolveResume()
    await Promise.resolve()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })

  test('waits for interrupted audio context to resume before scheduling sound', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('interrupted')

    soundModule.playClick()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1)

    resolveResume()
    await Promise.resolve()
    await Promise.resolve()

    expect(mockContext.createOscillator).toHaveBeenCalledTimes(2)
  })

  test('waits for an already initialized interrupted context before playing again', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('running')

    soundModule.initAudio()
    mockContext.state = 'interrupted'

    soundModule.playClick()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1)

    resolveResume()
    await Promise.resolve()
    await Promise.resolve()

    expect(mockContext.createOscillator).toHaveBeenCalledTimes(2)
  })

  test('resumes interrupted audio context when the page becomes visible again', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('running')

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false
    })

    soundModule.initAudio()
    mockContext.state = 'interrupted'
    document.dispatchEvent(new Event('visibilitychange'))
    resolveResume()
    await Promise.resolve()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })

  test('resumes interrupted audio context on pageshow after returning to the app', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('running')

    soundModule.initAudio()
    mockContext.state = 'interrupted'
    window.dispatchEvent(new Event('pageshow'))
    resolveResume()
    await Promise.resolve()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })
})
