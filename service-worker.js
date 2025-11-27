
const CACHE_NAME = 'norway-trip-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/icon-192x192.png',
  './images/icon-512x512.png',
  // 如果您有使用外部字體或額外的CSS/JS文件，也請將它們加入這裡
];

// 安裝 Service Worker 並快取所有資產
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求，嘗試從快取中獲取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中找到，則回傳快取的資源
        if (response) {
          return response;
        }
        // 否則，進行網路請求
        return fetch(event.request);
      })
  );
});

// 清理舊的快取版本
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});