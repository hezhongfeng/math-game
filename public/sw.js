/**
 * 数学运算游戏 - Service Worker
 * 提供离线缓存和 PWA 支持
 */

// 每次更新时递增版本号
const CACHE_VERSION = 'v2'
const CACHE_NAME = `math-game-${CACHE_VERSION}`
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
]

// 安装 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] 安装中...', CACHE_VERSION)
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 缓存静态资源')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] 安装完成，跳过等待')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] 缓存失败:', error)
      })
  )
})

// 激活 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] 激活中...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] 删除旧缓存:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] 激活完成')
        return self.clients.claim()
      })
  )
})

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return
  }
  
  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return
  }
  
  // 跳过 API 请求
  if (url.pathname.startsWith('/api/')) {
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // 返回缓存的内容
        if (cachedResponse) {
          // 后台更新缓存
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone()
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseToCache)
                  })
              }
            })
            .catch(() => {
              // 网络请求失败，使用缓存
            })
          
          return cachedResponse
        }
        
        // 没有缓存，从网络获取
        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse
            }
            
            // 缓存新的资源
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache)
              })
            
            return networkResponse
          })
          .catch((error) => {
            console.error('[SW] 获取失败:', error)
            
            // 如果是页面请求，返回离线页面
            if (request.mode === 'navigate') {
              return caches.match('/index.html')
            }
            
            throw error
          })
      })
  )
})

// 处理消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// 后台同步（可选）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scores') {
    console.log('[SW] 后台同步分数')
    // 可以在这里同步分数到服务器
  }
})
