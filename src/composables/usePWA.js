import { ref, onMounted, onUnmounted } from 'vue'

/**
 * PWA 功能组合式函数
 * 提供安装提示、在线状态、更新检测等功能
 */

// 全局状态
const isInstallable = ref(false)
const isOnline = ref(navigator.onLine)
const isStandalone = ref(false)
const updateAvailable = ref(false)

let deferredPrompt = null
let updateCallback = null

/**
 * 使用 PWA 功能
 * @returns {Object} PWA 状态和操作方法
 */
export function usePWA() {
  // 检查是否以 standalone 模式运行
  const checkStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true
  }

  // 处理 beforeinstallprompt 事件
  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault()
    deferredPrompt = e
    isInstallable.value = true
    console.log('[PWA] 应用可以安装')
  }

  // 处理 appinstalled 事件
  const handleAppInstalled = () => {
    deferredPrompt = null
    isInstallable.value = false
    console.log('[PWA] 应用已安装')
  }

  // 处理在线状态变化
  const handleOnline = () => {
    isOnline.value = true
    console.log('[PWA] 已连接到网络')
  }

  const handleOffline = () => {
    isOnline.value = false
    console.log('[PWA] 网络已断开')
  }

  // 处理 Service Worker 更新
  const handleServiceWorkerUpdate = () => {
    updateAvailable.value = true
    if (updateCallback) {
      updateCallback()
    }
  }

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

  // 设置更新回调
  const onUpdate = (callback) => {
    updateCallback = callback
  }

  // 生命周期
  onMounted(() => {
    isStandalone.value = checkStandalone()

    // 监听安装事件
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // 监听网络状态
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 监听 Service Worker 更新
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          handleServiceWorkerUpdate()
        }
      })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
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
