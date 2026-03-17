/**
 * AudioContext 管理工具
 * 共享的 AudioContext 初始化和恢复逻辑
 *
 * iOS Safari 限制：
 * - AudioContext 创建后处于 suspended 状态
 * - 必须通过用户交互（touchstart, click等）来恢复
 * - 需要主动处理状态恢复
 */

let audioContext = null
let isAudioContextInitialized = false
let hasUserInteracted = false
let compressorNode = null
let masterGainNode = null
let hasWarmUpPlayed = false
const FOREGROUND_MASTER_GAIN = 0.85
const BACKGROUND_MASTER_GAIN = 0.4

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
 * 构建统一音频输出链路
 * Oscillator -> Compressor -> Master Gain -> Destination
 * 作用：避免多音同时播放时出现突兀失真和削波
 * @param {AudioContext} ctx
 */
function setupAudioGraph(ctx) {
  if (compressorNode && masterGainNode) {
    return
  }

  compressorNode = ctx.createDynamicsCompressor()
  masterGainNode = ctx.createGain()

  compressorNode.threshold.setValueAtTime(-18, ctx.currentTime)
  compressorNode.knee.setValueAtTime(18, ctx.currentTime)
  compressorNode.ratio.setValueAtTime(3, ctx.currentTime)
  compressorNode.attack.setValueAtTime(0.003, ctx.currentTime)
  compressorNode.release.setValueAtTime(0.15, ctx.currentTime)
  masterGainNode.gain.setValueAtTime(FOREGROUND_MASTER_GAIN, ctx.currentTime)

  compressorNode.connect(masterGainNode)
  masterGainNode.connect(ctx.destination)
}

/**
 * 获取统一输出节点，供音效模块连接
 * @param {AudioContext|null} ctx
 * @returns {AudioNode|null}
 */
export function getAudioOutputNode(ctx = null) {
  const audioCtx = ctx || getAudioContext()
  if (!audioCtx) {
    return null
  }

  if (!compressorNode || !masterGainNode) {
    setupAudioGraph(audioCtx)
  }

  return compressorNode || audioCtx.destination
}

/**
 * 设置 AudioContext 用户交互监听器，用于恢复被暂停的音频
 * iOS Safari 在用户交互前不允许播放音频
 */
function setupAudioContextListeners() {
  if (isAudioContextInitialized || !audioContext) return

  isAudioContextInitialized = true

  const handleUserInteraction = (event) => {
    if (!hasUserInteracted && audioContext) {
      hasUserInteracted = true
      // iOS Safari 必须：同步恢复 AudioContext
      // 注意：不能使用 await，必须在同步代码路径中调用 resume()
      // WebKit Bug 修复：在某些版本的 Safari 中，必须通过用户交互事件处理程序直接调用 resume()
      const resumeContext = () => {
        if (audioContext && audioContext.state === 'suspended') {
          // 检测微信浏览器
          const isWeChat = /MicroMessenger/i.test(navigator.userAgent)
          
          if (isWeChat) {
            // 微信浏览器特殊处理：立即恢复 + 播放测试音
            audioContext.resume()
              .then(() => {
                // 微信需要立即播放一个声音才能解锁音频
                playWeChatUnlockSound()
                warmupAudioContext()
              })
              .catch((error) => {
                console.warn('微信浏览器 AudioContext 恢复失败:', error)
              })
          } else {
            // 普通浏览器
            audioContext.resume().catch((error) => {
              console.warn('AudioContext 恢复失败:', error)
            })
            warmupAudioContext()
          }
        }
      }

      resumeContext()
    }
  }

  // 精简事件类型，保留关键交互事件
  // 使用 { once: true } 首次交互后自动移除监听，优化性能
  const events = [
    'touchstart',  // 最早触发的触摸事件（移动端）
    'click',       // 点击事件（通用）
    'keydown'      // 键盘按下（桌面端辅助功能）
  ]
  
  // 在 document 上监听关键事件，passive: true 优化性能
  // 注意：移除 once: true，因为 iOS Safari 可能在切换应用后再次暂停 AudioContext
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, {
      capture: true,
      passive: true
    })
  })

  document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })
}

/**
 * 页面可见性联动：
 * - 后台时降低主输出，避免切换应用后突然大音量
 * - 回到前台时恢复默认输出并尝试恢复 AudioContext
 */
function handleVisibilityChange() {
  if (!audioContext || !masterGainNode) {
    return
  }

  const now = audioContext.currentTime

  if (document.hidden) {
    masterGainNode.gain.cancelScheduledValues(now)
    masterGainNode.gain.setTargetAtTime(BACKGROUND_MASTER_GAIN, now, 0.06)
    return
  }

  masterGainNode.gain.cancelScheduledValues(now)
  masterGainNode.gain.setTargetAtTime(FOREGROUND_MASTER_GAIN, now, 0.08)

  if (hasUserInteracted && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {
      // 交由后续用户交互再次恢复
    })
  }
}

/**
 * 确保 AudioContext 处于运行状态
 * 这是播放音频前的必要检查，特别是在 iOS 上
 */
export async function ensureAudioContextRunning() {
  const ctx = getAudioContext()
  if (!ctx) {
    console.warn('AudioContext 不存在，无法恢复')
    return false
  }

  // iOS 上即使用户交互过，AudioContext 有时仍然处于 suspended
  // 需要再次尝试恢复
  if (ctx.state === 'suspended') {
    try
    {
      await ctx.resume()
      hasUserInteracted = true

      // 等待状态实际变为 running
      // 某些版本的 Safari 中，resume() 返回后状态可能不会立即变更
      await waitForAudioContextRunning(ctx, 500)
      warmupAudioContext()
      
      return ctx.state === 'running'
    } catch (error) {
      console.error('AudioContext 恢复异常:', error)
      // 恢复失败，返回 false 但继续允许播放
      // （某些情况下即使返回失败，音频仍可能播放）
      return false
    }
  }
  
  return true
}

/**
 * 等待 AudioContext 状态变为 running
 * @param {AudioContext} ctx - AudioContext 实例
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<boolean>} - 是否成功变为 running 状态
 */
function waitForAudioContextRunning(ctx, timeout = 500) {
  return new Promise((resolve) => {
    // 如果已经是 running，立即返回
    if (ctx.state === 'running') {
      resolve(true)
      return
    }

    let checkCount = 0
    const startTime = Date.now()

    // 状态变化监听器
    const checkState = () => {
      const elapsed = Date.now() - startTime
      checkCount++

      if (ctx.state === 'running') {
        resolve(true)
      } else if (elapsed >= timeout) {
        // 超时
        console.warn(`AudioContext 状态轮询超时，最终状态: ${ctx.state}`)
        resolve(false)
      } else {
        // 继续检查
        setTimeout(checkState, 10)
      }
    }

    // 开始轮询
    checkState()
  })
}

/**
 * 强制初始化 AudioContext 并尝试恢复
 * 用于在应用启动或路由变化时调用
 */
export async function forceInitializeAudioContext() {
  const ctx = getAudioContext()
  if (!ctx) return false

  // 尝试恢复 AudioContext，无论当前状态如何
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
 * 静默预热音频链路，降低首次真实音效丢失概率
 */
export function warmupAudioContext() {
  if (!audioContext || audioContext.state !== 'running' || hasWarmUpPlayed) {
    return false
  }

  try {
    const outputNode = getAudioOutputNode(audioContext)
    if (!outputNode) {
      return false
    }

    const now = audioContext.currentTime + 0.001
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(outputNode)

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
 * 微信浏览器解锁音频（必须播放一个声音）
 */
function playWeChatUnlockSound() {
  try {
    if (!audioContext || audioContext.state !== 'running') return
    const outputNode = getAudioOutputNode(audioContext)
    if (!outputNode) return
    
    // 创建一个极短的声音来解锁微信音频
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(outputNode)
    
    // 设置频率（不可听范围或极短）
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.01)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.01) // 10ms，几乎不可听
  } catch (error) {
    console.warn('微信音频解锁音播放失败:', error)
  }
}

/**
 * 关闭 AudioContext
 */
export function closeAudioContext() {
  if (audioContext) {
    try {
      audioContext.close()
    } catch (error) {
      // 关闭失败忽略
    }
    audioContext = null
    isAudioContextInitialized = false
    hasUserInteracted = false
    compressorNode = null
    masterGainNode = null
    hasWarmUpPlayed = false
  }
}
