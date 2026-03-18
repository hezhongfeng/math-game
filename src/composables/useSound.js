// 音效管理器 - 使用Web Audio API合成音效
import { ref, onMounted } from 'vue'

// 单例模式
const audioContext = ref(null)
const isInitialized = ref(false)

/**
 * 初始化AudioContext (处理iOS兼容)
 */
export function initAudio() {
  if (isInitialized.value) return
  
  try {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    // iOS需要用户交互后才能resume
    if (audioContext.value.state === 'suspended') {
      document.addEventListener('touchstart', () => {
        audioContext.value?.resume()
      }, { once: true })
    }
    isInitialized.value = true
  } catch (e) {
    console.warn('Web Audio API not supported:', e)
  }
}

/**
 * 播放合成音效
 * @param {number} frequency - 频率(Hz)
 * @param {number} duration - 时长(ms)
 * @param {string} type - 波形类型 'sine'|'triangle'|'square'
 * @param {number} volume - 音量 0-1
 */
export function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  if (!audioContext.value) return
  
  const ctx = audioContext.value
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = type
  oscillator.frequency.value = frequency
  
  const now = ctx.currentTime
  const durationSec = duration / 1000
  
  gainNode.gain.setValueAtTime(volume, now)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationSec)
  
  oscillator.start(now)
  oscillator.stop(now + durationSec)
}

/**
 * 播放按钮点击音效
 */
export function playClick() {
  playTone(800, 80, 'sine', 0.25)
}

/**
 * 播放数字键盘音效
 */
export function playKeyPress() {
  playTone(600, 60, 'sine', 0.2)
}

/**
 * 播放正确答案音效
 */
export function playCorrect() {
  if (!audioContext.value) return
  // 双音升调
  playTone(880, 100, 'sine', 0.3)
  setTimeout(() => playTone(1320, 150, 'sine', 0.3), 80)
}

/**
 * 播放错误答案音效
 */
export function playWrong() {
  playTone(200, 300, 'triangle', 0.3)
}

/**
 * 播放题目出现音效
 */
export function playQuestion() {
  playTone(440, 100, 'sine', 0.15)
}

/**
 * 播放返回音效
 */
export function playBack() {
  playTone(500, 100, 'sine', 0.2)
}

/**
 * 播放胜利音效 - 上升和弦
 */
export function playVictory() {
  if (!audioContext.value) return
  // C5 -> E5 -> G5 -> C6 上升
  playTone(523, 120, 'sine', 0.25)
  setTimeout(() => playTone(659, 120, 'sine', 0.25), 100)
  setTimeout(() => playTone(784, 150, 'sine', 0.25), 200)
  setTimeout(() => playTone(1047, 250, 'sine', 0.3), 300)
}

/**
 * 播放解锁音效 - 叮咚声
 */
export function playUnlock() {
  if (!audioContext.value) return
  // 两个高音叮咚
  playTone(1200, 80, 'sine', 0.3)
  setTimeout(() => playTone(1600, 200, 'sine', 0.3), 120)
}

export function useSound() {
  onMounted(() => {
    initAudio()
  })
  
  return {
    playClick,
    playKeyPress,
    playCorrect,
    playWrong,
    playQuestion,
    playBack,
    playVictory,
    playUnlock
  }
}
