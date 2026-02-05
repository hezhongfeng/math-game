import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// 注册 Service Worker (PWA 支持)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker 注册成功:', registration.scope)
        
        // 监听 Service Worker 更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              console.log('[PWA] 发现新版本')
              
              // 可以在这里显示更新提示
              if (confirm('发现新版本！是否立即更新？')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' })
                window.location.reload()
              }
            }
          })
        })
      })
      .catch((error) => {
        console.log('[PWA] Service Worker 注册失败:', error)
      })
    
    // 监听 Service Worker 消息
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        console.log('[PWA] 收到更新消息')
      }
    })
  })
}

// PWA 安装提示
let deferredPrompt

window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止默认的迷你信息栏
  e.preventDefault()
  // 保存事件以便稍后触发
  deferredPrompt = e
  console.log('[PWA] 可以安装应用')
})

// 导出安装函数
export function installPWA() {
  if (!deferredPrompt) {
    console.log('[PWA] 无法安装')
    return false
  }
  
  deferredPrompt.prompt()
  
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] 用户接受了安装')
    } else {
      console.log('[PWA] 用户拒绝了安装')
    }
    deferredPrompt = null
  })
  
  return true
}
