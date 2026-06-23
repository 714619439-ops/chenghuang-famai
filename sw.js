/* =============================================
   城隍法脉疗愈 · Service Worker
   离线缓存，支持PWA安装到桌面
   ============================================= */

const CACHE_NAME = 'chenghuang-famai-v1';

const PRECACHE_URLS = [
  'index.html',
  'all-si.html',
  'about.html',
  'protect-youth.html',
  'rituals.html',
  'prayer-generator.html',
  'contact.html',
  'css/style.css',
  'js/data.js',
  'js/main.js',
  'manifest.json'
];

// 安装阶段：预缓存核心页面
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// 拦截请求：缓存优先，网络后备
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(networkResponse) {
        // 仅缓存同源请求
        if (networkResponse && networkResponse.status === 200 &&
            new URL(event.request.url).origin === self.location.origin) {
          var responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(function() {
        // 离线时返回友好提示
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
