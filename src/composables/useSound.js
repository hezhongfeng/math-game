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

// 外部音频播放器
const victoryAudio = ref(null)
const unlockAudio = ref(null)

/**
 * 加载外部音效
 */
export function loadExternalSounds() {
  victoryAudio.value = new Audio('/sounds/victory.mp3')
  unlockAudio.value = new Audio('/sounds/unlock.mp3')
  
  // 预加载
  victoryAudio.value.preload = 'auto'
  unlockAudio.value.preload = 'auto'
}

/**
 * 播放胜利音效
 */
export function playVictory() {
  victoryAudio.value?.play().catch(e => console.warn('victory sound failed:', e))
}

/**
 * 播放解锁音效
 */
export function playUnlock() {
  unlockAudio.value?.play().catch(e => console.warn('unlock sound failed:', e))
}

export function useSound() {
  onMounted(() => {
    initAudio()
    loadExternalSounds()
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
