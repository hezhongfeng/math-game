/**
 * 数学游戏 Service Worker
 * 提供离线缓存支持
 */

const CACHE_NAME = 'math-game-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/manifest.json'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.log('缓存静态资源失败:', err);
      })
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 网络优先，离线回退缓存
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // 只处理 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过非同源请求
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 网络请求成功，更新缓存
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 缓存也没有，返回离线页面或错误
          return new Response('离线模式暂不可用', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
          });
        });
      })
  );
});
