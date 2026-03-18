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

const SOUND_COOLDOWN_MS = {
  click: 30,
  clickSubmit: 45,
  clickDelete: 38,
  correct: 90,
  wrong: 120,
  win: 450
}

const soundLastPlayedAt = new Map()

/**
 * 音效播放 Composable
 * 使用 Web Audio API 生成音效
 *
 * iOS Safari 兼容性说明：
 * - 在 iOS 上，AudioContext 需要在用户交互后才能播放声音
 * - 使用 ensureAudioContextRunning() 确保播放前恢复
 * - 必须在同步代码路径中调用 resume()，不能使用 await
 */
export function useSound() {
  const settingsStore = useSettingsStore()
  const isEnabled = computed(() => settingsStore.soundEnabled)

  /**
   * 同步恢复 AudioContext
   * iOS Safari 要求必须在同步代码中调用 resume()
   */
  function ensureAudioContextSync() {
    const ctx = getAudioContext()
    if (!ctx) {
      return false
    }

    if (ctx.state === 'suspended') {
      // 同步调用 resume，不等待结果
      // iOS Safari 要求 resume() 在用户交互的同步调用栈中
      ctx.resume().catch(() => {
        // 忽略恢复失败
      })
      return true
    }

    return true
  }

  /**
   * 播放音效
   * @param {string} type - 音效类型: 'correct', 'wrong', 'win', 'click'
   */
  function playSound(type, options = {}) {
    if (!isEnabled.value) {
      return
    }

    const ctx = getAudioContext()
    if (!ctx) {
      return
    }

    // iOS Safari 关键修复：必须在同步代码中恢复 AudioContext
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
   * 音效触发限速，避免连点导致“糊音”和性能抖动
   */
  function isThrottled(type, options = {}) {
    const keyKind = options.keyKind || 'default'
    const limiterKey = type === 'click' ? `click:${keyKind}` : type
    const now = Date.now()

    let cooldown = SOUND_COOLDOWN_MS[type] || 20
    if (type === 'click' && keyKind === 'submit') {
      cooldown = SOUND_COOLDOWN_MS.clickSubmit
    } else if (type === 'click' && keyKind === 'delete') {
      cooldown = SOUND_COOLDOWN_MS.clickDelete
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
   * @returns {Promise<AudioContext|null>}
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
   * 在时间轴上调度音符，避免 setTimeout 带来的节奏抖动
   * @param {AudioContext} ctx - 音频上下文
   * @param {number} startTime - 开始时间（秒）
   * @param {number} frequency - 频率（Hz）
   * @param {number} duration - 持续时间（秒）
   * @param {number} gain - 最大音量
   * @param {Object} options - 额外音色参数
   */
  function scheduleNote(ctx, startTime, frequency, duration, gain, options = {}) {
    const outputNode = getAudioOutputNode(ctx)
    if (!outputNode) {
      return
    }

    const wave = options.wave || 'sine'
    const detune = options.detune || 0
    const attack = Math.max(0.004, Math.min(duration * 0.32, options.attack ?? 0.01))
    const release = Math.max(0.018, Math.min(duration * 0.9, options.release ?? duration * 0.66))
    const endTime = startTime + duration
    const releaseStart = Math.max(startTime + attack + 0.006, endTime - release)

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(outputNode)

    const safeGain = Math.max(gain, 0.0001)

    osc.type = wave
    if (detune !== 0) {
      osc.detune.setValueAtTime(detune, startTime)
    }
    osc.frequency.setValueAtTime(frequency, startTime)
    gainNode.gain.setValueAtTime(0.0001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(safeGain, startTime + attack)
    gainNode.gain.setValueAtTime(safeGain, releaseStart)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

    osc.start(startTime)
    osc.stop(endTime)
  }

  /**
   * 正确音效 - 重构后的简化版本
   */
  async function playCorrectSound(options = {}) {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.correct
    const intensity = getIntensityMultiplier(options.intensity)
    const startTime = ctx.currentTime + 0.01
    const duration = params.noteDuration
    const gain = params.gain * intensity

    // 正确反馈：更短的双音上扬，清晰但不打扰
    scheduleNote(ctx, startTime, freq.note2, duration, gain, {
      wave: 'triangle',
      attack: 0.007,
      release: duration * 0.78
    })
    scheduleNote(ctx, startTime + params.interval, freq.note5, duration * 1.05, gain * 0.92, {
      wave: 'sine',
      attack: 0.007,
      release: duration * 0.8
    })
  }

  /**
   * 胜利音效 - 重构后的简化版本
   */
  async function playWinSound(options = {}) {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.win
    const stars = Math.max(0, Math.min(5, options.stars ?? 3))
    const intensity = getIntensityMultiplier(options.intensity || (stars >= 4 ? 'strong' : 'medium'))
    const startTime = ctx.currentTime + 0.01
    const noteDuration = stars === 0 ? params.noteDuration * 0.86 : params.noteDuration
    const step = params.interval
    const gain = params.gain * intensity
    const winPatterns = {
      0: [freq.note2],
      1: [freq.note1, freq.note3],
      2: [freq.note1, freq.note2, freq.note3],
      3: [freq.note1, freq.note2, freq.note3, freq.note5],
      4: [freq.note1, freq.note2, freq.note3, freq.note4, freq.note5],
      5: [freq.note1, freq.note2, freq.note3, freq.note4, freq.note5]
    }

    const notes = winPatterns[stars] || winPatterns[3]
    notes.forEach((noteFreq, index) => {
      scheduleNote(ctx, startTime + index * step, noteFreq, noteDuration, gain * (0.84 + index * 0.025), {
        wave: index < notes.length - 1 ? 'triangle' : 'sine',
        attack: 0.008,
        release: noteDuration * 0.82
      })
    })

    if (stars >= 3) {
      const tailBase = stars >= 5 ? freq.note5 * 0.56 : freq.note3
      scheduleNote(ctx, startTime + notes.length * step, tailBase, params.tailDuration, gain * (stars >= 5 ? 0.44 : 0.38), {
        wave: 'triangle',
        attack: 0.01,
        release: params.tailDuration * 0.84
      })
    }

    if (stars === 5) {
      const accentStart = startTime + (notes.length - 1) * step + 0.01
      scheduleNote(ctx, accentStart, freq.note5 * 2, noteDuration * 0.32, gain * 0.1, {
        wave: 'sine',
        attack: 0.005,
        release: noteDuration * 0.3
      })
    }
  }

  /**
   * 错误音效 - 重构后的简化版本
   */
  async function playWrongSound(options = {}) {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const freq = AUDIO_FREQUENCIES.wrong
    const params = AUDIO_PARAMS.wrong
    const intensity = getIntensityMultiplier(options.intensity)
    const startTime = ctx.currentTime + 0.01

    // 错误反馈：短下行 + 轻尾音，避免刺耳报警感
    scheduleFrequencyRampNote(
      ctx,
      startTime,
      freq.start,
      freq.end,
      params.duration,
      params.gain * intensity,
      'triangle'
    )

    scheduleNote(ctx, startTime + params.duration * 0.6, freq.end * 0.92, params.tailDuration, params.gain * 0.4 * intensity, {
      wave: 'triangle',
      attack: 0.008,
      release: params.tailDuration * 0.8
    })
  }

  /**
   * 点击音效 - 重构后的简化版本
   */
  async function playClickSound(options = {}) {
    const ctx = await getReadyAudioContext()
    if (!ctx) {
      return
    }

    const freq = AUDIO_FREQUENCIES.click
    const params = AUDIO_PARAMS.click
    const keyKind = options.keyKind || 'default'
    const startTime = ctx.currentTime + 0.005
    const intensity = getIntensityMultiplier(options.intensity || (keyKind === 'submit' ? 'strong' : 'medium'))
    const subtleDetune = getSubtleDetune()

    if (keyKind === 'digit') {
      const digit = Number.isInteger(options.digit) ? options.digit : 0
      const safeDigit = Math.max(0, Math.min(9, digit))
      const digitFreq = freq.digits[safeDigit] || freq.default
      // 数字键：短、干净、单层 triangle，不叠和声
      scheduleNote(ctx, startTime, digitFreq, params.duration, params.gain * intensity, {
        wave: 'triangle',
        detune: subtleDetune,
        attack: 0.006,
        release: params.duration * 0.82
      })
      return
    }

    if (keyKind === 'delete') {
      const deleteParams = AUDIO_PARAMS.clickDelete
      // 删除键：短下滑，语义清晰
      scheduleFrequencyRampNote(
        ctx,
        startTime,
        freq.deleteStart,
        freq.deleteEnd,
        deleteParams.duration,
        deleteParams.gain * intensity,
        'sine'
      )
      return
    }

    if (keyKind === 'submit') {
      const submitParams = AUDIO_PARAMS.clickSubmit
      // 提交键：双音上扬，总时长约 90ms
      scheduleNote(ctx, startTime, freq.submit1, submitParams.noteDuration, submitParams.gain * intensity, {
        wave: 'sine',
        attack: 0.007,
        release: submitParams.noteDuration * 0.78
      })
      scheduleNote(
        ctx,
        startTime + submitParams.interval,
        freq.submit2,
        submitParams.noteDuration,
        submitParams.gain * 0.95 * intensity,
        {
          wave: 'triangle',
          attack: 0.007,
          release: submitParams.noteDuration * 0.8
        }
      )
      return
    }

    // 通用点击：极轻瞬态 + 主体音
    scheduleNote(
      ctx,
      startTime,
      900,
      params.transientDuration,
      params.transientGain * intensity,
      { wave: 'sine', attack: 0.004, release: params.transientDuration * 0.8 }
    )
    scheduleNote(ctx, startTime, freq.default, params.duration, params.gain * intensity, {
      wave: 'triangle',
      detune: subtleDetune,
      attack: 0.006,
      release: params.duration * 0.8
    })
  }

  /**
   * 播放带频率变化的音符（用于错误提示）
   */
  function scheduleFrequencyRampNote(ctx, startTime, startFreq, endFreq, duration, gain, type = 'sine') {
    const outputNode = getAudioOutputNode(ctx)
    if (!outputNode) {
      return
    }

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(outputNode)

    const safeGain = Math.max(gain, 0.0001)

    const attack = Math.max(0.006, duration * 0.24)
    const endTime = startTime + duration

    osc.type = type
    osc.frequency.setValueAtTime(startFreq, startTime)
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 80), endTime)
    gainNode.gain.setValueAtTime(0.0001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(safeGain, startTime + attack)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)
    osc.start(startTime)
    osc.stop(endTime)
  }

  /**
   * 为重复点击注入非常轻微的音高随机性，降低“机械感”
   * @returns {number}
   */
  function getSubtleDetune() {
    return (Math.random() * 8) - 4
  }

  /**
   * 音效强度：用于和触觉反馈强度保持一致
   * @param {'light'|'medium'|'strong'|undefined} intensity
   * @returns {number}
   */
  function getIntensityMultiplier(intensity) {
    if (intensity === 'light') return 0.84
    if (intensity === 'strong') return 1.14
    return 1
  }

  return {
    isEnabled,
    playSound,
    forceInitializeAudioContext
  }
}
