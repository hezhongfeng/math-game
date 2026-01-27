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
 * 
 * iOS Safari 26.2 增强：扩大事件监听器覆盖范围
 */
function setupAudioContextListeners() {
  if (isAudioContextInitialized || !audioContext) return

  isAudioContextInitialized = true

  const handleUserInteraction = () => {
    if (!hasUserInteracted && audioContext) {
      hasUserInteracted = true
      // iOS Safari 必须：同步恢复 AudioContext
      // 注意：不能使用 await，必须在同步代码路径中调用 resume()
      // WebKit Bug 修复：在某些版本的 Safari 中，必须通过用户交互事件处理程序直接调用 resume()
      const resumeContext = () => {
        if (audioContext && audioContext.state === 'suspended') {
          audioContext.resume().catch(() => {})
        }
      }

      resumeContext()
    }
  }

  // iOS Safari 26.2 增强：监听更多事件类型，确保捕获早期交互
  // 使用 { once: false } 以便多次尝试恢复（某些 Safari 版本需要多次触发）
  const events = [
    'touchstart',  // 最早触发的触摸事件
    'touchmove',   // 触摸移动也可能触发
    'touchend',    // 触摸结束
    'click',       // 点击事件
    'mousedown',   // 鼠标按下（桌面模式）
    'mouseup',     // 鼠标释放
    'keydown',     // 键盘按下
    'keyup',       // 键盘释放
    'pointerdown', // 指针事件
    'pointerup'    // 指针释放
  ]
  
  // 在捕获阶段监听所有事件，passive: true 优化性能
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { 
      capture: true, 
      passive: true,
      once: false  // 不设置 once，允许多次触发
    })
  })
  
  // iOS Safari 26.2 关键增强：在 window 上也监听，扩大覆盖范围
  events.forEach(event => {
    window.addEventListener(event, handleUserInteraction, { 
      capture: true, 
      passive: true,
      once: false
    })
  })
}

/**
 * 确保 AudioContext 处于运行状态
 * 这是播放音频前的必要检查，特别是在 iOS 上
 * 
 * iOS Safari 26.2 关键修复：添加状态轮询，确保 resume 完成
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
      
      // iOS Safari 26.2 关键修复：等待状态实际变为 running
      // 某些版本的 Safari 中，resume() 返回后状态可能不会立即变更
      await waitForAudioContextRunning(ctx, 500)
      
      return ctx.state === 'running'
    } catch (error) {
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
    const startTime = Date.now()
    
    // 如果已经是 running，立即返回
    if (ctx.state === 'running') {
      resolve(true)
      return
    }
    
    // 状态变化监听器
    const checkState = () => {
      const elapsed = Date.now() - startTime
      
      if (ctx.state === 'running') {
        resolve(true)
      } else if (elapsed >= timeout) {
        // 超时，但不一定失败
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
