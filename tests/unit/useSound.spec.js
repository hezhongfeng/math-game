import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
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
    createBufferSource: vi.fn(() => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null })),
    decodeAudioData: vi.fn(async () => ({ duration: 1 })),
    close: vi.fn(async () => { ctx.state = 'closed' }),
    resume: vi.fn(() => {
      if (options.resumeError) return Promise.reject(options.resumeError)
      return resumePromise.then(() => {
        if (ctx.state !== 'closed' && !options.stayInterrupted) ctx.state = 'running'
      })
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

  const createdContexts = []
  class MockAudioContext {
    constructor() {
      const context = createdContexts.length === 0 ? mockContext : createMockAudioContext('running').ctx
      createdContexts.push(context)
      return context
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
    createdContexts,
    resolveResume,
    soundModule: await import('../../src/composables/useSound')
  }
}

const registeredListeners = []
const soundWrappers = []

beforeEach(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  for (const target of [document, window]) {
    const add = target.addEventListener.bind(target)
    vi.spyOn(target, 'addEventListener').mockImplementation((event, handler, options) => {
      registeredListeners.push({ target, event, handler, options })
      add(event, handler, options)
    })
  }
})

afterEach(() => {
  soundWrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  registeredListeners.splice(0).forEach(({ target, event, handler, options }) => {
    target.removeEventListener(event, handler, options)
  })
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.resetModules()
  delete document.hidden
  delete window.AudioContext
  delete window.webkitAudioContext
  delete window.fetch
})

function setPageHidden(hidden) {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('useSound audio interruption recovery', () => {
  test('rebuilds a seemingly running context before the first foreground button handler', async () => {
    const { mockContext, createdContexts, soundModule } = await loadSoundModule()
    soundModule.initAudio()
    setPageHidden(true)
    soundModule.playKeyPress()
    setPageHidden(false)
    expect(createdContexts).toHaveLength(1)
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1)

    const button = document.createElement('button')
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      soundModule.playKeyPress()
    })
    document.body.append(button)
    try {
      button.click()
      expect(createdContexts).toHaveLength(2)
      expect(mockContext.close).toHaveBeenCalledTimes(1)
      expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
      button.click()
      expect(createdContexts).toHaveLength(2)
    } finally {
      button.remove()
    }
  })

  test('bounds a hanging resume and discards its delayed feedback after recovery', async () => {
    vi.useFakeTimers()
    const { mockContext, createdContexts, resolveResume, soundModule } = await loadSoundModule('interrupted')
    soundModule.playKeyPress()
    await vi.advanceTimersByTimeAsync(801)
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1)

    document.dispatchEvent(new Event('click'))
    soundModule.playClick()
    expect(createdContexts).toHaveLength(2)
    expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
    resolveResume()
    await vi.advanceTimersByTimeAsync(1)
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1)
    expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
  })

  test('retries within a gesture if resume resolves without actually running', async () => {
    const { createdContexts, resolveResume, soundModule } = await loadSoundModule('interrupted', { stayInterrupted: true })
    soundModule.playKeyPress()
    resolveResume()
    await flushPromises()
    expect(createdContexts[0].createOscillator).toHaveBeenCalledTimes(1)
    document.dispatchEvent(new Event('touchend'))
    soundModule.playKeyPress()
    expect(createdContexts).toHaveLength(2)
    expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
  })

  test('recovers on the next gesture after a rejected resume', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { createdContexts, soundModule } = await loadSoundModule('interrupted', { resumeError: new Error('interrupted') })
    soundModule.playKeyPress()
    await flushPromises()
    document.dispatchEvent(new Event('click'))
    soundModule.playClick()
    expect(createdContexts).toHaveLength(2)
    expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
  })

  test('keeps recovery pending when recreating the audio device fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { createdContexts, soundModule } = await loadSoundModule()
    soundModule.initAudio()
    const AudioContext = window.AudioContext
    window.AudioContext = class { constructor() { throw new Error('device unavailable') } }
    setPageHidden(true)
    setPageHidden(false)
    expect(() => document.dispatchEvent(new Event('click'))).not.toThrow()
    soundModule.playKeyPress()
    expect(createdContexts).toHaveLength(1)

    window.AudioContext = AudioContext
    document.dispatchEvent(new Event('click'))
    soundModule.playKeyPress()
    expect(createdContexts).toHaveLength(2)
    expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
  })

  test('rebuilds once per background cycle across touchend and click events', async () => {
    const { createdContexts, soundModule } = await loadSoundModule()
    soundModule.initAudio()
    for (let cycle = 0; cycle < 3; cycle += 1) {
      setPageHidden(true)
      setPageHidden(false)
      document.dispatchEvent(new Event('touchend'))
      document.dispatchEvent(new Event('click'))
      soundModule.playKeyPress()
      expect(createdContexts).toHaveLength(cycle + 2)
      expect(createdContexts[cycle].close).toHaveBeenCalledTimes(1)
      expect(createdContexts[cycle + 1].createOscillator).toHaveBeenCalledTimes(2)
    }
  })

  test('recovers after pagehide and a cached pageshow without visibilitychange', async () => {
    const { createdContexts, soundModule } = await loadSoundModule()
    soundModule.initAudio()
    window.dispatchEvent(new Event('pagehide'))
    const pageShow = new Event('pageshow')
    Object.defineProperty(pageShow, 'persisted', { value: true })
    window.dispatchEvent(pageShow)
    document.dispatchEvent(new Event('click'))
    soundModule.playKeyPress()
    expect(createdContexts).toHaveLength(2)
    expect(createdContexts[1].createOscillator).toHaveBeenCalledTimes(2)
  })

  test('retains shared recovery handlers until the last consumer unmounts', async () => {
    const { createdContexts, soundModule } = await loadSoundModule()
    const Consumer = { setup() { soundModule.useSound(); return () => null } }
    const first = mount(Consumer)
    const second = mount(Consumer)
    soundWrappers.push(first, second)
    first.unmount()
    setPageHidden(true)
    setPageHidden(false)
    document.dispatchEvent(new Event('click'))
    expect(createdContexts).toHaveLength(2)
    second.unmount()
    setPageHidden(true)
    setPageHidden(false)
    document.dispatchEvent(new Event('click'))
    expect(createdContexts).toHaveLength(2)
  })

  test('discards delayed praise while keeping decoded audio reusable after unlocking', async () => {
    const { createdContexts, soundModule } = await loadSoundModule()
    soundModule.initAudio()
    let finishDownload
    const downloaded = new Promise((resolve) => { finishDownload = resolve })
    window.fetch = vi.fn(async () => ({ ok: true, arrayBuffer: () => downloaded }))
    soundModule.playResultPraise({ accuracy: 100 })
    await flushPromises()
    setPageHidden(true)
    setPageHidden(false)
    document.dispatchEvent(new Event('click'))
    finishDownload(new ArrayBuffer(8))
    await flushPromises()
    expect(createdContexts[0].createBufferSource).not.toHaveBeenCalled()
    expect(createdContexts[1].createBufferSource).not.toHaveBeenCalled()

    soundModule.playResultPraise({ accuracy: 100 })
    await flushPromises()
    expect(createdContexts[1].createBufferSource).toHaveBeenCalledTimes(1)
    const downloadCount = window.fetch.mock.calls.length
    setPageHidden(true)
    expect(createdContexts[1].createBufferSource.mock.results[0].value.stop).toHaveBeenCalledTimes(1)
    setPageHidden(false)
    document.dispatchEvent(new Event('click'))
    soundModule.playResultPraise({ accuracy: 100 })
    await flushPromises()
    expect(createdContexts[2].createBufferSource).toHaveBeenCalledTimes(1)
    expect(window.fetch).toHaveBeenCalledTimes(downloadCount)
  })

  test('resumes interrupted audio context when playing a sound after foregrounding', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('interrupted')

    soundModule.playClick()
    resolveResume()
    await flushPromises()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })

  test('waits for interrupted audio context to resume before scheduling sound', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('interrupted')

    soundModule.playClick()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1)

    resolveResume()
    await flushPromises()

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
    await flushPromises()

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
    await flushPromises()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })

  test('resumes interrupted audio context on pageshow after returning to the app', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('running')

    soundModule.initAudio()
    mockContext.state = 'interrupted'
    window.dispatchEvent(new Event('pageshow'))
    resolveResume()
    await flushPromises()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })

  test('resumes suspended audio context on the next user interaction', async () => {
    const { mockContext, resolveResume, soundModule } = await loadSoundModule('suspended')

    soundModule.initAudio()
    document.dispatchEvent(new Event('click'))
    resolveResume()
    await flushPromises()

    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })

  test('recreates a closed audio context before playing again', async () => {
    vi.resetModules()

    const firstAudio = createMockAudioContext('closed')
    const secondAudio = createMockAudioContext('running')
    const contexts = [firstAudio.ctx, secondAudio.ctx]
    let createCount = 0

    class MockAudioContext {
      constructor() {
        const ctx = contexts[createCount]
        createCount += 1
        return ctx
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

    const soundModule = await import('../../src/composables/useSound')
    soundModule.initAudio()
    soundModule.playClick()
    await flushPromises()

    expect(createCount).toBe(2)
    expect(firstAudio.ctx.createOscillator).toHaveBeenCalledTimes(1)
    expect(secondAudio.ctx.createOscillator).toHaveBeenCalledTimes(2)
  })
})
