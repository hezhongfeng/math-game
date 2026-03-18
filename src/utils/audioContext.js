/**
 * AudioContext 管理工具 - 简化纯净版
 * 
 * iOS Safari 限制：
 * - AudioContext 创建后处于 suspended 状态
 * - 必须通过用户交互来恢复
 * - 需要主动处理状态恢复
 */

let audioContext = null
let isAudioContextInitialized = false
let hasUserInteracted = false
let masterGainNode = null
let hasWarmUpPlayed = false

// 全局音频参数
const FOREGROUND_MASTER_GAIN = 0.8
const BACKGROUND_MASTER_GAIN = 0.3

/**
 * 获取或初始化 AudioContext
 * @returns {AudioContext|null}
 */
export function getAudioContext() {
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) {
        console.warn('AudioContext is not supported in this browser')
        return null
      }
      audioContext = new AudioContextClass()
      setupAudioGraph(audioContext)
      setupAudioContextListeners()
    } catch (error) {
      console.error('AudioContext 创建失败:', error)
      return null
    }
  }

  return audioContext
}

/**
 * 构建简单纯净的音频输出链路
 * Oscillator -> Master Gain -> Destination
 * 作用：提供清晰纯净的音效体验
 */
function setupAudioGraph(ctx) {
  if (masterGainNode) {
    return
  }

  const now = ctx.currentTime
  
  // 创建主增益节点
  masterGainNode = ctx.createGain()
  masterGainNode.gain.setValueAtTime(FOREGROUND_MASTER_GAIN, now)
  masterGainNode.connect(ctx.destination)
}

/**
 * 获取统一输出节点，供音效模块连接
 * 直接连接到主增益节点
 */
export function getAudioOutputNode(ctx = null) {
  const audioCtx = ctx || getAudioContext()
  if (!audioCtx) {
    return null
  }

  if (!masterGainNode) {
    setupAudioGraph(audioCtx)
  }

  return masterGainNode || audioCtx.destination
}


/**
 * 设置 AudioContext 用户交互监听器
 */
function setupAudioContextListeners() {
  if (isAudioContextInitialized || !audioContext) return

  isAudioContextInitialized = true

  const handleUserInteraction = (event) => {
    if (!hasUserInteracted && audioContext) {
      hasUserInteracted = true
      
      // 尝试恢复 AudioContext
      if (audioContext.state === 'suspended') {
        audioContext.resume()
          .then(() => {
            warmupAudioContext()
          })
          .catch((error) => {
            console.warn('AudioContext 恢复失败:', error)
          })
      }
    }
  }

  // 监听关键交互事件
  const events = [
    'touchstart',  // 移动端触摸事件
    'click',       // 通用点击事件
    'keydown'      // 桌面端键盘事件
  ]

  events.forEach(event => {
    document.addEventListener(event, () => {
      if (!hasUserInteracted && audioContext) {
        hasUserInteracted = true
        if (audioContext.state === 'suspended') {
          audioContext.resume().catch(() => {})
        }
      }
    }, {
      capture: true,
      passive: true
    })
  })

  document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })
}

/**
 * 页面可见性联动：后台时降低音量
 */
function handleVisibilityChange() {
  if (!audioContext || !masterGainNode) {
    return
  }

  const now = audioContext.currentTime

  if (document.hidden) {
    masterGainNode.gain.cancelScheduledValues(now)
    masterGainNode.gain.setTargetAtTime(BACKGROUND_MASTER_GAIN, now, 0.06)
  } else {
    masterGainNode.gain.cancelScheduledValues(now)
    masterGainNode.gain.setTargetAtTime(FOREGROUND_MASTER_GAIN, now, 0.08)
  }
}

/**
 * 确保 AudioContext 处于运行状态
 */
export async function ensureAudioContextRunning() {
  const ctx = getAudioContext()
  if (!ctx) {
    console.warn('AudioContext 不存在')
    return false
  }

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
      hasUserInteracted = true

      return true
    } catch (error) {
      console.error('AudioContext 恢复异常:', error)
      return false
    }
  }

  return true
}

/**
 * 静默预热音频链路
 */
export function warmupAudioContext() {
  if (!audioContext || audioContext.state !== 'running' || hasWarmUpPlayed) {
    return false
  }

  try {
    const now = audioContext.currentTime + 0.001
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(masterGainNode || audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(660, now)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.0002, now + 0.008)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

    oscillator.start(now)
    oscillator.stop(now + 0.02)

    hasWarmUpPlayed = true
    return true
  } catch (error) {
    return false
  }
}

/**
 * 强制初始化 AudioContext
 */
export async function forceInitializeAudioContext() {
  const ctx = getAudioContext()
  if (!ctx) return false

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    warmupAudioContext()
    return true
  } catch (error) {
    return false
  }
}

/**
 * 设置主音量
 */
export function setMasterVolume(volume) {
  if (!audioContext || !masterGainNode) return

  const safeVolume = Math.max(0, Math.min(1, volume))
  masterGainNode.gain.setValueAtTime(safeVolume, audioContext.currentTime)
}

/**
 * 关闭 AudioContext
 */
export function closeAudioContext() {
  if (audioContext) {
    try {
      audioContext.close()
    } catch (error) {
      // 忽略关闭失败
    }
    
    audioContext = null
    masterGainNode = null
    hasWarmUpPlayed = false
    hasUserInteracted = false
    isAudioContextInitialized = false
  }
}