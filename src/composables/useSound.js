import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import {
  getAudioContext,
  getAudioOutputNode,
  forceInitializeAudioContext,
  ensureAudioContextRunning,
  warmupAudioContext
} from '../utils/audioContext'
import { AUDIO_FREQUENCIES, AUDIO_PARAMS } from '../config/constants'

// 音效冷却时间配置（毫秒）- 简单版
const SOUND_COOLDOWN_MS = {
  digit: 24,      // 数字键点击
  click: 30,      // 通用点击
  delete: 42,     // 删除键
  submit: 54,     // 提交键
  correct: 100,   // 正确反馈
  wrong: 120,     // 错误反馈
  win: 300        // 胜利音效
}

const soundLastPlayedAt = new Map()

/**
 * 简单音效播放器 - 回归纯净好听的音效设计
 */
export function useSound() {
  const settingsStore = useSettingsStore()
  const isEnabled = computed(() => settingsStore.soundEnabled)

  /**
   * 同步恢复 AudioContext
   */
  function ensureAudioContextSync() {
    const ctx = getAudioContext()
    if (!ctx) {
      return false
    }

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {
        // 忽略恢复失败
      })
      return true
    }

    return true
  }

  /**
   * 播放音效
   */
  function playSound(type, options = {}) {
    if (!isEnabled.value) {
      return
    }

    const ctx = getAudioContext()
    if (!ctx) {
      return
    }

    // 恢复 AudioContext
    ensureAudioContextSync()
    warmupAudioContext()

    if (isThrottled(type, options)) {
      return
    }

    try {
      switch (type) {
        case 'correct':
          void playCorrectSound(options)
          break
        case 'wrong':
          void playWrongSound(options)
          break
        case 'win':
          void playWinSound(options)
          break
        case 'click':
          void playClickSound(options)
          break
        default:
          break
      }
    } catch (error) {
      console.error(`音效播放异常: ${type}`, error)
    }
  }

  /**
   * 音效触发限速
   */
  function isThrottled(type, options = {}) {
    const keyKind = options.keyKind || 'default'
    const limiterKey = type === 'click' ? `click:${keyKind}` : type
    const now = Date.now()

    let cooldown = SOUND_COOLDOWN_MS[type] || 30
    if (type === 'click') {
      cooldown = SOUND_COOLDOWN_MS[keyKind] || SOUND_COOLDOWN_MS.click
    }

    const lastTime = soundLastPlayedAt.get(limiterKey) || 0
    if (now - lastTime < cooldown) {
      return true
    }

    soundLastPlayedAt.set(limiterKey, now)
    return false
  }

  /**
   * 准备可用的 AudioContext
   */
  async function getReadyAudioContext() {
    const isReady = await ensureAudioContextRunning()
    const ctx = getAudioContext()
    if (!isReady || !ctx || ctx.state !== 'running') {
      return null
    }
    return ctx
  }

  /**
   * 播放简单音符
   */
  function playSimpleNote(ctx, startTime, frequency, duration, gain, wave = 'sine') {
    const outputNode = getAudioOutputNode(ctx)
    if (!outputNode) {
      return
    }

    const attack = Math.max(0.003, duration * 0.18)
    const release = Math.max(0.008, duration * 0.32)
    const endTime = startTime + duration
    const releaseStart = Math.max(startTime + attack, endTime - release)

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(outputNode)

    const safeGain = Math.max(gain, 0.0001)

    osc.type = wave
    osc.frequency.setValueAtTime(frequency, startTime)
    gainNode.gain.setValueAtTime(0.0001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(safeGain, startTime + attack)
    gainNode.gain.setValueAtTime(safeGain, releaseStart)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

    osc.start(startTime)
    osc.stop(endTime)
  }

  /**
   * 播放下滑音符
   */
  function playSlideNote(ctx, startTime, startFreq, endFreq, duration, gain, wave = 'sine') {
    const outputNode = getAudioOutputNode(ctx)
    if (!outputNode) {
      return
    }

    const attack = Math.max(0.005, duration * 0.15)
    const endTime = startTime + duration

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(outputNode)

    const safeGain = Math.max(gain, 0.0001)

    osc.type = wave
    osc.frequency.setValueAtTime(startFreq, startTime)
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 100), endTime)
    gainNode.gain.setValueAtTime(0.0001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(safeGain, startTime + attack)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

    osc.start(startTime)
    osc.stop(endTime)
  }

  // ========== 音效播放函数 ==========

  async function playCorrectSound() {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.correct
    const startTime = ctx.currentTime + 0.01

    // 更明亮一点的双音上扬，保留简洁但增加“答对了”的开心感
    playSimpleNote(ctx, startTime, freq.note1, params.duration, params.gain, params.wave)
    playSimpleNote(ctx, startTime + params.interval, freq.note2, params.duration, params.gain * 0.92, 'sine')
  }

  async function playWrongSound() {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const freq = AUDIO_FREQUENCIES.wrong
    const params = AUDIO_PARAMS.wrong
    const startTime = ctx.currentTime + 0.01

    // 更钝的低频下滑，避免刺耳和“报警器”感
    playSlideNote(ctx, startTime, freq.start, freq.end, params.duration, params.gain, params.wave)
    playSimpleNote(ctx, startTime + params.duration * 0.55, freq.end, params.duration * 0.45, params.gain * 0.38, 'sine')
  }

  async function playClickSound(options = {}) {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const keyKind = options.keyKind || 'default'
    const startTime = ctx.currentTime + 0.005

    if (keyKind === 'digit') {
      const params = AUDIO_PARAMS.digit

      playSimpleNote(
        ctx,
        startTime,
        AUDIO_FREQUENCIES.digit,
        params.duration,
        params.gain,
        params.wave
      )
      return
    }

    if (keyKind === 'delete') {
      const freq = AUDIO_FREQUENCIES.click.delete
      const params = AUDIO_PARAMS.delete
      
      playSlideNote(ctx, startTime, freq.start, freq.end, params.duration, params.gain, params.wave)
      return
    }

    if (keyKind === 'submit') {
      const freq = AUDIO_FREQUENCIES.click.submit
      const params = AUDIO_PARAMS.submit
      
      playSimpleNote(ctx, startTime, freq.note1, params.duration, params.gain, params.wave)
      playSimpleNote(ctx, startTime + params.interval, freq.note2, params.duration, params.gain * 0.9, params.wave)
      return
    }

    // 通用点击
    const params = AUDIO_PARAMS.click

    playSimpleNote(
      ctx,
      startTime,
      AUDIO_FREQUENCIES.click.default,
      params.duration,
      params.gain,
      params.wave
    )
  }

  async function playWinSound(options = {}) {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const stars = Math.max(0, Math.min(5, options.stars ?? 3))
    const freq = AUDIO_FREQUENCIES.win
    const params = AUDIO_PARAMS.win
    const startTime = ctx.currentTime + 0.01

    // 根据星星数量播放不同长度的音阶
    const noteCount = Math.min(stars + 1, 5) // 1-5个音符
    
    for (let i = 0; i < noteCount; i++) {
      const noteFreq = freq.scale[i] || freq.scale[0]
      const noteStartTime = startTime + i * params.interval
      const noteGain = params.gain * (0.9 + i * 0.05)
      
      playSimpleNote(ctx, noteStartTime, noteFreq, params.noteDuration, noteGain, params.wave)
    }
  }

  return {
    isEnabled,
    playSound,
    forceInitializeAudioContext
  }
}
