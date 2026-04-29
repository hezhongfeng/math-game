import { onMounted, onUnmounted, ref } from 'vue'
import {
  AUDIO_COOLDOWNS,
  AUDIO_ENGINE,
  AUDIO_FREQUENCIES,
  AUDIO_PARAMS,
  GAME_CONFIG
} from '../config/constants'

const audioContext = ref(null)
const masterGainNode = ref(null)
const lowpassNode = ref(null)
const isInitialized = ref(false)
const soundLastPlayedAt = new Map()
const praiseAudioBuffers = new Map()
const praiseAudioLoading = new Map()
let currentPraiseSource = null
let praisePlaybackToken = 0
let visibilityChangeHandler = null

const PRAISE_AUDIO_SOURCES = {
  newBest: '/audio/praise/new-best.mp3',
  perfect: '/audio/praise/perfect.mp3',
  greatPass: '/audio/praise/great-pass.mp3',
  pass: '/audio/praise/pass.mp3',
  tryAgain: '/audio/praise/try-again.mp3',
  reviewPerfect: '/audio/praise/review-perfect.mp3',
  reviewMore: '/audio/praise/review-more.mp3'
}

function createAudioGraph(ctx) {
  const masterGain = ctx.createGain()
  const lowpass = ctx.createBiquadFilter()

  lowpass.type = 'lowpass'
  lowpass.frequency.value = AUDIO_ENGINE.FILTER_FREQUENCY
  lowpass.Q.value = 0.0001

  masterGain.gain.value = AUDIO_ENGINE.MASTER_GAIN

  masterGain.connect(lowpass)
  lowpass.connect(ctx.destination)

  masterGainNode.value = masterGain
  lowpassNode.value = lowpass
}

function warmupAudioContext(ctx) {
  if (!masterGainNode.value) {
    return
  }

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const now = ctx.currentTime

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(440, now)
  gainNode.gain.setValueAtTime(AUDIO_ENGINE.WARMUP_GAIN, now)

  oscillator.connect(gainNode)
  gainNode.connect(masterGainNode.value)

  oscillator.start(now)
  oscillator.stop(now + 0.01)
}

async function decodeAudioData(ctx, audioData) {
  return ctx.decodeAudioData(audioData)
}

async function loadPraiseAudioBuffer(key) {
  if (praiseAudioBuffers.has(key)) {
    return praiseAudioBuffers.get(key)
  }

  if (praiseAudioLoading.has(key)) {
    return praiseAudioLoading.get(key)
  }

  const source = PRAISE_AUDIO_SOURCES[key]
  const ctx = audioContext.value

  if (!source || !ctx || typeof window === 'undefined' || !window.fetch) {
    return null
  }

  const loading = window.fetch(source)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`加载鼓励语音失败: ${source}`)
      }

      return response.arrayBuffer()
    })
    .then((audioData) => decodeAudioData(ctx, audioData))
    .then((buffer) => {
      praiseAudioBuffers.set(key, buffer)
      praiseAudioLoading.delete(key)
      return buffer
    })
    .catch((error) => {
      praiseAudioLoading.delete(key)
      console.error('加载本地鼓励语音失败:', error)
      return null
    })

  praiseAudioLoading.set(key, loading)
  return loading
}

function preloadPraiseAudio() {
  Object.keys(PRAISE_AUDIO_SOURCES).forEach((key) => {
    loadPraiseAudioBuffer(key)
  })
}

function resumeAudioContext() {
  const ctx = audioContext.value
  if (!ctx) {
    return
  }

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {
      // 忽略恢复失败，避免打断主流程
    })
  }
}

/**
 * 初始化 AudioContext，并建立统一输出总线
 */
export function initAudio() {
  if (isInitialized.value) {
    resumeAudioContext()
    return
  }

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    audioContext.value = ctx
    createAudioGraph(ctx)
    warmupAudioContext(ctx)

    if (ctx.state === 'suspended') {
      document.addEventListener('touchstart', () => {
        ctx.resume().catch(() => {})
      }, { once: true, passive: true })
    }

    visibilityChangeHandler = () => {
      if (!masterGainNode.value) {
        return
      }

      const targetGain = document.hidden ? AUDIO_ENGINE.MASTER_GAIN * 0.55 : AUDIO_ENGINE.MASTER_GAIN
      masterGainNode.value.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.04)
    }
    document.addEventListener('visibilitychange', visibilityChangeHandler)

    preloadPraiseAudio()

    isInitialized.value = true
  } catch (error) {
    console.warn('Web Audio API not supported:', error)
  }
}

function getReadyAudioContext() {
  initAudio()
  const ctx = audioContext.value
  if (!ctx || !masterGainNode.value) {
    return null
  }

  resumeAudioContext()
  return ctx
}

function shouldThrottle(key) {
  const now = Date.now()
  const lastTime = soundLastPlayedAt.get(key) || 0
  const cooldown = AUDIO_COOLDOWNS[key] || 0

  if (now - lastTime < cooldown) {
    return true
  }

  soundLastPlayedAt.set(key, now)
  return false
}

function scheduleTone(ctx, options) {
  if (!masterGainNode.value) {
    return
  }

  const {
    frequency,
    startTime = ctx.currentTime,
    duration = 0.05,
    gain = 0.05,
    type = 'sine',
    attack = 0.003,
    release = 0.02,
    endFrequency = null
  } = options

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const endTime = startTime + duration
  const safeGain = Math.max(gain, 0.0001)
  const safeAttack = Math.max(attack, 0.002)
  const safeRelease = Math.max(release, 0.01)
  const releaseStart = Math.max(startTime + safeAttack, endTime - safeRelease)

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startTime)

  if (typeof endFrequency === 'number') {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 80), endTime)
  }

  gainNode.gain.setValueAtTime(0.0001, startTime)
  gainNode.gain.exponentialRampToValueAtTime(safeGain, startTime + safeAttack)
  gainNode.gain.setValueAtTime(safeGain, releaseStart)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

  oscillator.connect(gainNode)
  gainNode.connect(masterGainNode.value)

  oscillator.start(startTime)
  oscillator.stop(endTime)
}

function scheduleSequence(ctx, notes, params, startTime = ctx.currentTime + 0.006) {
  notes.forEach((frequency, index) => {
    const stepRatio = params.stepGainRatio || 1
    scheduleTone(ctx, {
      frequency,
      startTime: startTime + (params.interval || 0.05) * index,
      duration: params.duration,
      gain: params.gain * Math.pow(stepRatio, index),
      type: params.type,
      attack: params.attack,
      release: params.release
    })
  })
}

function withTinyVariation(frequency) {
  const ratio = 1 + ((Math.random() * 2 - 1) * 0.006)
  return frequency * ratio
}

function stopLocalPraise() {
  praisePlaybackToken += 1

  if (currentPraiseSource) {
    try {
      currentPraiseSource.stop()
    } catch {
      // 已经停止的 source 无需处理
    }
    currentPraiseSource = null
  }
}

function schedulePraiseBuffer(ctx, buffer, token) {
  if (token !== praisePlaybackToken) {
    return null
  }

  if (!buffer || !masterGainNode.value) {
    return false
  }

  stopLocalPraise()

  const source = ctx.createBufferSource()
  const gainNode = ctx.createGain()
  const now = ctx.currentTime

  source.buffer = buffer
  gainNode.gain.setValueAtTime(0.86, now)
  gainNode.gain.setTargetAtTime(0.0001, now + Math.max(buffer.duration - 0.08, 0.05), 0.03)
  source.connect(gainNode)
  gainNode.connect(masterGainNode.value)
  source.onended = () => {
    if (currentPraiseSource === source) {
      currentPraiseSource = null
    }
  }
  currentPraiseSource = source
  source.start(now + 0.01)
  return true
}

async function playLocalPraise(key) {
  const ctx = getReadyAudioContext()

  if (!ctx) {
    return
  }

  resumeAudioContext()
  const token = praisePlaybackToken
  const buffer = praiseAudioBuffers.get(key) || await loadPraiseAudioBuffer(key)

  const didSchedule = schedulePraiseBuffer(ctx, buffer, token)

  if (didSchedule === false) {
    console.error('播放本地鼓励语音失败:', key)
  }
}

export function playClick() {
  if (shouldThrottle('click')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleTone(ctx, {
    frequency: withTinyVariation(AUDIO_FREQUENCIES.click),
    startTime: ctx.currentTime + 0.004,
    ...AUDIO_PARAMS.click
  })
}

export function playKeyPress() {
  if (shouldThrottle('key')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleTone(ctx, {
    frequency: withTinyVariation(AUDIO_FREQUENCIES.key),
    startTime: ctx.currentTime + 0.004,
    ...AUDIO_PARAMS.key
  })
}

export function playDelete() {
  if (shouldThrottle('delete')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleTone(ctx, {
    frequency: AUDIO_FREQUENCIES.delete.start,
    endFrequency: AUDIO_FREQUENCIES.delete.end,
    startTime: ctx.currentTime + 0.004,
    ...AUDIO_PARAMS.delete
  })
}

export function playSubmit() {
  if (shouldThrottle('submit')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleSequence(ctx, AUDIO_FREQUENCIES.submit, AUDIO_PARAMS.submit)
}

export function playCorrect() {
  if (shouldThrottle('correct')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  const startTime = ctx.currentTime + 0.006
  scheduleSequence(ctx, AUDIO_FREQUENCIES.correct, AUDIO_PARAMS.correct, startTime)

  const finalIndex = AUDIO_FREQUENCIES.correct.length - 1
  const finalStart = startTime + AUDIO_PARAMS.correct.interval * finalIndex
  const finalNote = AUDIO_FREQUENCIES.correct[finalIndex]

  scheduleTone(ctx, {
    frequency: finalNote,
    startTime: finalStart + 0.012,
    duration: AUDIO_PARAMS.correct.sparkleDuration,
    gain: AUDIO_PARAMS.correct.sparkleGain,
    type: AUDIO_PARAMS.correct.sparkleType,
    attack: 0.003,
    release: 0.04
  })
}

export function playWrong() {
  if (shouldThrottle('wrong')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleSequence(ctx, AUDIO_FREQUENCIES.wrong, AUDIO_PARAMS.wrong)
}

export function playQuestion() {
  if (shouldThrottle('question')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleTone(ctx, {
    frequency: AUDIO_FREQUENCIES.question,
    startTime: ctx.currentTime + 0.004,
    ...AUDIO_PARAMS.question
  })
}

export function playBack() {
  if (shouldThrottle('back')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleTone(ctx, {
    frequency: AUDIO_FREQUENCIES.back.start,
    endFrequency: AUDIO_FREQUENCIES.back.end,
    startTime: ctx.currentTime + 0.004,
    ...AUDIO_PARAMS.back
  })
}

export function playVictory() {
  if (shouldThrottle('victory')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleSequence(ctx, AUDIO_FREQUENCIES.victory, AUDIO_PARAMS.victory, ctx.currentTime + 0.008)
}

export function playUnlock() {
  if (shouldThrottle('unlock')) {
    return
  }

  const ctx = getReadyAudioContext()
  if (!ctx) {
    return
  }

  scheduleSequence(ctx, AUDIO_FREQUENCIES.unlock, AUDIO_PARAMS.unlock, ctx.currentTime + 0.008)
}

/**
 * 停止正在播放或排队的鼓励语音
 */
export function stopPraise() {
  stopLocalPraise()
}

/**
 * 根据结算结果选择一句主反馈语音
 * @param {Object} result - 结算反馈参数
 * @returns {string} 主反馈语音文案
 */
export function getResultPraiseText(result = {}) {
  const accuracy = result.accuracy || 0

  if (result.isNewBest && !result.isReviewRound) {
    return '新纪录！真厉害！'
  }

  if (result.isReviewRound) {
    return accuracy >= 100 ? '复习完成，越来越熟了！' : '再练一次，会更熟！'
  }

  if (accuracy >= 100) {
    return '太棒了，全部答对！'
  }

  if (accuracy >= 90) {
    return '真厉害，过关啦！'
  }

  if (accuracy >= GAME_CONFIG.PASS_ACCURACY) {
    return '过关啦，继续挑战！'
  }

  return '没关系，再试一次！'
}

/**
 * 根据结算结果选择本地鼓励语音资源键
 * @param {Object} result - 结算反馈参数
 * @returns {string} 本地语音资源键
 */
export function getResultPraiseKey(result = {}) {
  const accuracy = result.accuracy || 0

  if (result.isNewBest && !result.isReviewRound) {
    return 'newBest'
  }

  if (result.isReviewRound) {
    return accuracy >= 100 ? 'reviewPerfect' : 'reviewMore'
  }

  if (accuracy >= 100) {
    return 'perfect'
  }

  if (accuracy >= 90) {
    return 'greatPass'
  }

  if (accuracy >= GAME_CONFIG.PASS_ACCURACY) {
    return 'pass'
  }

  return 'tryAgain'
}

/**
 * 播放结算主反馈语音
 * @param {Object} result - 结算反馈参数
 */
export function playResultPraise(result = {}) {
  playLocalPraise(getResultPraiseKey(result))
}

export function useSound() {
  onMounted(() => {
    initAudio()
  })

  onUnmounted(() => {
    if (visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler)
      visibilityChangeHandler = null
    }
  })

  return {
    playClick,
    playKeyPress,
    playDelete,
    playSubmit,
    playCorrect,
    playWrong,
    playQuestion,
    playBack,
    playVictory,
    playUnlock,
    stopPraise,
    playResultPraise
  }
}
