import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useToast } from './useToast'
import { getAudioContext } from '../utils/audioContext'
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
    if (!ctx) return false

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
    if (!isEnabled.value) return

    const ctx = getAudioContext()
    if (!ctx) return

    // iOS Safari 关键修复：必须在同步代码中恢复 AudioContext
    ensureAudioContextSync()

    try {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      const now = ctx.currentTime

      switch (type) {
        case 'correct':
          // 正确音效：上升的三声"叮叮叮"
          playCorrectSound(ctx, oscillator, gainNode, now)
          break
        case 'wrong':
          // 错误音效：低沉的"嗡"声
          playWrongSound(ctx, oscillator, gainNode, now)
          break
        case 'win':
          // 胜利音效：欢快的音阶
          playWinSound(ctx, oscillator, gainNode, now)
          break
        case 'click':
          // 点击音效：短促的"嗒"声
          playClickSound(ctx, oscillator, gainNode, now)
          break
        default:
          break
      }
    } catch (error) {
      // 音频播放出错，静默处理（iOS 上可能发生）
    }
  }

  /**
   * 正确音效
   */
  function playCorrectSound(ctx, oscillator, gainNode, now) {
    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.correct

    // 第一声
    oscillator.frequency.setValueAtTime(freq.note1, now)
    oscillator.frequency.setValueAtTime(freq.note2, now + 0.1)
    oscillator.frequency.setValueAtTime(freq.note3, now + 0.2)
    gainNode.gain.setValueAtTime(params.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.envelope)
    oscillator.start(now)
    oscillator.stop(now + params.envelope)

    // 第二声
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        const t = ctx.currentTime
        osc2.frequency.setValueAtTime(freq.note3, t)
        osc2.frequency.setValueAtTime(freq.note4, t + 0.1)
        gain2.gain.setValueAtTime(params.gain, t)
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.3)
        osc2.start(t)
        osc2.stop(t + 0.3)
      } catch (error) {
        // 延时音效播放失败，继续进行
      }
    }, params.delay1)

    // 第三声
    setTimeout(() => {
      try {
        const osc3 = ctx.createOscillator()
        const gain3 = ctx.createGain()
        osc3.connect(gain3)
        gain3.connect(ctx.destination)
        const t = ctx.currentTime
        osc3.frequency.setValueAtTime(freq.note5, t)
        osc3.type = 'sine'
        gain3.gain.setValueAtTime(params.gain, t)
        gain3.gain.exponentialRampToValueAtTime(0.01, t + params.envelope)
        osc3.start(t)
        osc3.stop(t + params.envelope)
      } catch (error) {
        // 延时音效播放失败，继续进行
      }
    }, params.delay2)
  }

  /**
   * 错误音效
   */
  function playWrongSound(ctx, oscillator, gainNode, now) {
    const freq = AUDIO_FREQUENCIES.wrong
    const params = AUDIO_PARAMS.wrong

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(freq.start, now)
    oscillator.frequency.linearRampToValueAtTime(freq.end, now + params.duration)
    gainNode.gain.setValueAtTime(params.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.duration)
    oscillator.start(now)
    oscillator.stop(now + params.duration)
  }

  /**
   * 胜利音效
   */
  function playWinSound(ctx, _oscillator, _gainNode, _now) {
    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.win
    const notes = [freq.note1, freq.note2, freq.note3, freq.note5]

    notes.forEach((noteFreq, index) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          const t = ctx.currentTime
          osc.frequency.setValueAtTime(noteFreq, t)
          osc.type = 'sine'
          gain.gain.setValueAtTime(params.gain, t)
          gain.gain.exponentialRampToValueAtTime(0.01, t + params.noteDuration)
          osc.start(t)
          osc.stop(t + params.noteDuration)
        } catch (error) {
          // 延时音效播放失败，继续进行
        }
      }, index * params.noteDuration * 1000)
    })
  }

  /**
   * 点击音效
   */
  function playClickSound(ctx, oscillator, gainNode, now) {
    const freq = AUDIO_FREQUENCIES.click
    const params = AUDIO_PARAMS.click

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(freq, now)
    gainNode.gain.setValueAtTime(params.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.duration)
    oscillator.start(now)
    oscillator.stop(now + params.duration)
  }

  return {
    isEnabled,
    playSound
  }
}
