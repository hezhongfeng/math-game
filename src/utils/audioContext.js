/**
 * AudioContext 管理工具
 * 共享的 AudioContext 初始化和恢复逻辑
 */

let audioContext = null
let isAudioContextInitialized = false

/**
 * 获取或初始化 AudioContext
 * @returns {AudioContext|null}
 */
export function getAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      setupAudioContextListeners()
    } catch (error) {
      return null
    }
  }
  return audioContext
}

/**
 * 设置 AudioContext 用户交互监听器，用于恢复被暂停的音频
 */
function setupAudioContextListeners() {
  if (isAudioContextInitialized || !audioContext) return

  isAudioContextInitialized = true

  const handleUserInteraction = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
      } catch (error) {
        // 恢复失败继续使用
      }
    }
  }

  // 监听用户交互事件
  const events = ['touchstart', 'touchend', 'click', 'keydown']
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { once: true })
  })
}

/**
 * 确保 AudioContext 处于运行状态
 */
export async function ensureAudioContextRunning() {
  const ctx = getAudioContext()
  if (!ctx) return false

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
      return true
    } catch (error) {
      return false
    }
  }

  return true
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
  }
}
