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
      setupAudioContextListeners()
    } catch (error) {
      return null
    }
  }
  return audioContext
}

/**
 * 设置 AudioContext 用户交互监听器，用于恢复被暂停的音频
 * iOS Safari 在用户交互前不允许播放音频
 */
function setupAudioContextListeners() {
  if (isAudioContextInitialized || !audioContext) return

  isAudioContextInitialized = true

  const handleUserInteraction = () => {
    if (!hasUserInteracted && audioContext) {
      hasUserInteracted = true
      // iOS Safari 必须：同步恢复 AudioContext
      // 注意：不能使用 await，必须在同步代码路径中调用 resume()
      // WebKit Bug 修复：在某些版本的 Safari 中，必须通过用户交互事件处理程序直接调用 resume
      const resumeContext = () => {
        if (audioContext && audioContext.state === 'suspended') {
          audioContext.resume().catch(() => {})
        }
      }

      resumeContext()
    }
  }

  // iOS Safari 优先监听 touchstart 事件（在捕获阶段）
  // touchstart 比 click 更早触发，更适合音频初始化
  // 使用 once: true 避免重复监听 touchstart
  document.addEventListener('touchstart', handleUserInteraction, { 
    capture: true, 
    passive: true,
    once: true 
  })
  
  // 其他事件继续监听（不设置 once）
  const events = ['touchend', 'click', 'keydown', 'pointerdown']
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { capture: true, passive: true })
  })
}

/**
 * 确保 AudioContext 处于运行状态
 * 这是播放音频前的必要检查，特别是在 iOS 上
 */
export async function ensureAudioContextRunning() {
  const ctx = getAudioContext()
  if (!ctx) return false

  // iOS 上即使用户交互过，AudioContext 有时仍然处于 suspended
  // 需要再次尝试恢复
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
      hasUserInteracted = true
      return true
    } catch (error) {
      // 恢复失败，返回 false 但继续允许播放
      // （某些情况下即使返回失败，音频仍可能播放）
      return false
    }
  }

  return true
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
    return true
  } catch (error) {
    return false
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
  }
}

