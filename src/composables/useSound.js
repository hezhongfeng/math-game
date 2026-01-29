import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useToast } from './useToast'
import { getAudioContext, forceInitializeAudioContext, ensureAudioContextRunning } from '../utils/audioContext'
import { AUDIO_FREQUENCIES, AUDIO_PARAMS } from '../config/constants'

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
  const { error: showError } = useToast()

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
  function playSound(type) {
    if (!isEnabled.value) {
      return
    }

    const ctx = getAudioContext()
    if (!ctx) {
      return
    }

    // iOS Safari 关键修复：必须在同步代码中恢复 AudioContext
    ensureAudioContextSync()

    try {
      switch (type) {
        case 'correct':
          playCorrectSound()
          break
        case 'wrong':
          playWrongSound()
          break
        case 'win':
          playWinSound()
          break
        case 'click':
          playClickSound()
          break
        default:
          break
      }
    } catch (error) {
      console.error(`音效播放异常: ${type}`, error)
    }
  }

  /**
   * 创建并播放音符的通用函数
   * @param {number} frequency - 频率
   * @param {number} duration - 持续时间
   * @param {number} gain - 音量
   * @param {string} type - 波形类型
   * @param {number} delay - 延迟时间（毫秒）
   */
  async function playNote(frequency, duration, gain, type = 'sine', delay = 0) {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    try {
      await ensureAudioContextRunning()
      const ctx = getAudioContext()
      if (!ctx || ctx.state !== 'running') {
        return // AudioContext 不可用，跳过播放
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      const now = ctx.currentTime
      osc.type = type
      osc.frequency.setValueAtTime(frequency, now)
      gainNode.gain.setValueAtTime(gain, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)
      osc.start(now)
      osc.stop(now + duration)
    } catch (error) {
      console.error('音符播放失败:', error)
    }
  }

  /**
   * 正确音效 - 重构后的简化版本
   */
  function playCorrectSound() {
    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.correct

    // 播放三个音符序列
    playNote(freq.note1, 0.1, params.gain)
    playNote(freq.note2, 0.1, params.gain, 'sine', 100)
    playNote(freq.note3, 0.2, params.gain, 'sine', 150)
    playNote(freq.note4, 0.1, params.gain, 'sine', params.delay1)
    playNote(freq.note5, params.envelope, params.gain, 'sine', params.delay2)
  }

  /**
   * 胜利音效 - 重构后的简化版本
   */
  function playWinSound() {
    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.win
    const notes = [freq.note1, freq.note2, freq.note3, freq.note5]

    notes.forEach((noteFreq, index) => {
      playNote(noteFreq, params.noteDuration, params.gain, 'sine', index * params.noteDuration * 1000)
    })
  }

  /**
   * 错误音效 - 重构后的简化版本
   */
  function playWrongSound() {
    const freq = AUDIO_FREQUENCIES.wrong
    const params = AUDIO_PARAMS.wrong

    // 使用 playNote 但需要特殊处理频率变化
    playNoteWithFrequencyRamp(freq.start, freq.end, params.duration, params.gain, 'sawtooth')
  }

  /**
   * 点击音效 - 重构后的简化版本
   */
  function playClickSound() {
    const freq = AUDIO_FREQUENCIES.click
    const params = AUDIO_PARAMS.click

    playNote(freq, params.duration, params.gain, 'sine')
  }

  /**
   * 播放带频率变化的音符
   */
  async function playNoteWithFrequencyRamp(startFreq, endFreq, duration, gain, type = 'sine') {
    try {
      await ensureAudioContextRunning()
      const ctx = getAudioContext()
      if (!ctx || ctx.state !== 'running') {
        return
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      const now = ctx.currentTime
      osc.type = type
      osc.frequency.setValueAtTime(startFreq, now)
      osc.frequency.linearRampToValueAtTime(endFreq, now + duration)
      gainNode.gain.setValueAtTime(gain, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)
      osc.start(now)
      osc.stop(now + duration)
    } catch (error) {
      console.error('频率变化音符播放失败:', error)
    }
  }

  return {
    isEnabled,
    playSound,
    forceInitializeAudioContext
  }
}
