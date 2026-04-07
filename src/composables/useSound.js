import { onMounted, ref } from 'vue'
import {
  AUDIO_COOLDOWNS,
  AUDIO_ENGINE,
  AUDIO_FREQUENCIES,
  AUDIO_PARAMS
} from '../config/constants'

const audioContext = ref(null)
const masterGainNode = ref(null)
const lowpassNode = ref(null)
const isInitialized = ref(false)
const soundLastPlayedAt = new Map()
let cachedSpeechVoice = null

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

    document.addEventListener('visibilitychange', () => {
      if (!masterGainNode.value) {
        return
      }

      const targetGain = document.hidden ? AUDIO_ENGINE.MASTER_GAIN * 0.55 : AUDIO_ENGINE.MASTER_GAIN
      masterGainNode.value.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.04)
    })

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

function getSpeechVoice() {
  if (cachedSpeechVoice) {
    return cachedSpeechVoice
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null
  }

  const voices = window.speechSynthesis.getVoices()
  const preferredVoice = voices.find((voice) => (
    voice.lang?.startsWith('zh') && /female|xiao|mei|ting|hui/i.test(voice.name)
  )) || voices.find((voice) => voice.lang?.startsWith('zh')) || null

  cachedSpeechVoice = preferredVoice
  return preferredVoice
}

function speakPraise(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
    return
  }

  if (shouldThrottle('praise')) {
    return
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = getSpeechVoice()

    utterance.lang = voice?.lang || 'zh-CN'
    utterance.voice = voice
    utterance.rate = 1
    utterance.pitch = 1.08
    utterance.volume = 0.8

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  } catch (error) {
    console.error('播放鼓励语音失败:', error)
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

export function playPraise(text = '太棒了') {
  speakPraise(text)
}

export function useSound() {
  onMounted(() => {
    initAudio()

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
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
    playPraise
  }
}
