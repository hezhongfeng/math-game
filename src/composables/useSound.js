import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useToast } from './useToast'

/**
 * 音效播放 Composable
 * 使用 Web Audio API 生成音效
 */
export function useSound() {
  const settingsStore = useSettingsStore()
  const isEnabled = computed(() => settingsStore.soundEnabled)
  const { error: showError } = useToast()
  let audioContext = null

  /**
   * 初始化 AudioContext
   */
  function initAudioContext() {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
      } catch (error) {
        console.error('AudioContext 初始化失败:', error)
        showError('音频功能初始化失败')
        return null
      }
    }
    return audioContext
  }

  /**
   * 播放音效
   * @param {string} type - 音效类型: 'correct', 'wrong', 'win', 'click'
   */
  function playSound(type) {
    if (!isEnabled.value) return

    const ctx = initAudioContext()
    if (!ctx) return

    // 恢复 AudioContext（某些浏览器需要用户交互后才能播放）
    try {
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
    } catch (error) {
      console.error('恢复 AudioContext 失败:', error)
    }

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
  }

  /**
   * 正确音效
   */
  function playCorrectSound(ctx, oscillator, gainNode, now) {
    // 第一声
    oscillator.frequency.setValueAtTime(523.25, now) // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    oscillator.start(now)
    oscillator.stop(now + 0.4)

    // 第二声
    setTimeout(() => {
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      const t = ctx.currentTime
      osc2.frequency.setValueAtTime(783.99, t) // G5
      osc2.frequency.setValueAtTime(987.77, t + 0.1) // B5
      gain2.gain.setValueAtTime(0.3, t)
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.3)
      osc2.start(t)
      osc2.stop(t + 0.3)
    }, 150)

    // 第三声
    setTimeout(() => {
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      const t = ctx.currentTime
      osc3.frequency.setValueAtTime(1046.50, t) // C6
      osc3.type = 'sine'
      gain3.gain.setValueAtTime(0.3, t)
      gain3.gain.exponentialRampToValueAtTime(0.01, t + 0.4)
      osc3.start(t)
      osc3.stop(t + 0.4)
    }, 300)
  }

  /**
   * 错误音效
   */
  function playWrongSound(ctx, oscillator, gainNode, now) {
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(200, now)
    oscillator.frequency.linearRampToValueAtTime(100, now + 0.3)
    gainNode.gain.setValueAtTime(0.2, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    oscillator.start(now)
    oscillator.stop(now + 0.4)
  }

  /**
   * 胜利音效
   */
  function playWinSound(ctx, _oscillator, _gainNode, _now) {
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5 E5 G5 C6
    const duration = 0.15

    notes.forEach((freq, index) => {
      setTimeout(() => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        const t = ctx.currentTime
        osc.frequency.setValueAtTime(freq, t)
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.25, t)
        gain.gain.exponentialRampToValueAtTime(0.01, t + duration)
        osc.start(t)
        osc.stop(t + duration)
      }, index * duration * 1000)
    })
  }

  /**
   * 点击音效
   */
  function playClickSound(ctx, oscillator, gainNode, now) {
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, now)
    gainNode.gain.setValueAtTime(0.1, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
    oscillator.start(now)
    oscillator.stop(now + 0.05)
  }

  return {
    isEnabled,
    playSound
  }
}
