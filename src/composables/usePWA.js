import { ref, onMounted, onUnmounted } from 'vue'

/**
 * PWA 功能组合式函数
 * 提供安装提示、在线状态、更新检测等功能
 */

// 全局状态
const isInstallable = ref(false)
const isOnline = ref(navigator.onLine)
const isStandalone = ref(
  typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
)
const updateAvailable = ref(false)

// 私有变量
let deferredPrompt = null
let updateCallbacks = new Set()  // 使用 Set 支持多个回调
let listenerCount = 0           // 引用计数，跟踪有多少组件在使用

// 事件处理器（定义为常量，便于添加和移除）
const handleBeforeInstallPrompt = (e) => {
  e.preventDefault()
  deferredPrompt = e
  isInstallable.value = true
  console.log('[PWA] 应用可以安装')
}

const handleAppInstalled = () => {
  deferredPrompt = null
  isInstallable.value = false
  console.log('[PWA] 应用已安装')
}

const handleOnline = () => {
  isOnline.value = true
  console.log('[PWA] 已连接到网络')
}

const handleOffline = () => {
  isOnline.value = false
  console.log('[PWA] 网络已断开')
}

const handleServiceWorkerMessage = (event) => {
  if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
    updateAvailable.value = true
    // 调用所有注册的回调
    updateCallbacks.forEach(callback => callback())
  }
}

/**
 * 添加全局事件监听器（只添加一次）
 */
function addGlobalListeners() {
  if (listenerCount === 0) {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage)
    }
  }
  listenerCount++
}

/**
 * 移除全局事件监听器（当没有组件使用时）
 */
function removeGlobalListeners() {
  listenerCount--
  if (listenerCount === 0) {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage)
    }
  }
}

/**
 * 使用 PWA 功能
 * @returns {Object} PWA 状态和操作方法
 */
export function usePWA() {
  // 安装应用
  const install = async () => {
    if (!deferredPrompt) {
      console.log('[PWA] 无法安装应用')
      return { success: false, error: 'Not installable' }
    }

    deferredPrompt.prompt()

    try {
      const choiceResult = await deferredPrompt.userChoice
      const success = choiceResult.outcome === 'accepted'
      
      if (success) {
        console.log('[PWA] 用户接受了安装')
        isInstallable.value = false
      } else {
        console.log('[PWA] 用户拒绝了安装')
      }

      deferredPrompt = null
      return { success, outcome: choiceResult.outcome }
    } catch (error) {
      console.error('[PWA] 安装失败:', error)
      return { success: false, error }
    }
  }

  // 更新应用
  const update = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  // 设置更新回调（支持多个回调）
  const onUpdate = (callback) => {
    updateCallbacks.add(callback)
    // 返回取消注册函数
    return () => updateCallbacks.delete(callback)
  }

  // 生命周期
  onMounted(() => {
    addGlobalListeners()
  })

  onUnmounted(() => {
    removeGlobalListeners()
  })

  return {
    // 状态
    isInstallable,
    isOnline,
    isStandalone,
    updateAvailable,
    
    // 方法
    install,
    update,
    onUpdate,
  }
}

/**
 * 分享功能
 * @param {Object} options 分享选项
 * @returns {Promise<boolean>} 是否分享成功
 */
export async function share(options = {}) {
  const shareData = {
    title: options.title || '数学运算游戏',
    text: options.text || '来挑战数学运算游戏，训练你的思维能力！',
    url: options.url || window.location.href,
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return true
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[PWA] 分享失败:', error)
      }
      return false
    }
  } else {
    // 复制到剪贴板
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      return true
    } catch (error) {
      console.error('[PWA] 复制失败:', error)
      return false
    }
  }
}

/**
 * 震动反馈
 * @param {number|number[]} pattern 震动模式
 */
export function vibrate(pattern = 10) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}
