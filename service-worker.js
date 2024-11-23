const CACHE_NAME = 'stylist-reservation-cache';
const urlsToCache = [
  '/',
  '/styles.css',
  '/manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// リクエストのキャッシュまたはネットワークからの取得
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});