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
      console.error('AudioContext 创建失败:', error)
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
              })
              .catch((error) => {
                console.warn('微信浏览器 AudioContext 恢复失败:', error)
              })
          } else {
            // 普通浏览器
            audioContext.resume().catch((error) => {
              console.warn('AudioContext 恢复失败:', error)
            })
          }
        }
      }

      resumeContext()
    }
  }

  // 监听更多事件类型，确保捕获早期交互
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
  
  // 在 window 上也监听，扩大覆盖范围
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
    
    // 创建一个极短的声音来解锁微信音频
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
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
  }
}
