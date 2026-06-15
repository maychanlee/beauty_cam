// Service Worker - This is what makes the app work 100% offline
const CACHE_NAME = 'beauty-cam-v1';
const ASSETS_TO_CACHE = [
  '/beauty-cam/',
  '/beauty-cam/index.html',
  '/beauty-cam/manifest.json',
  '/beauty-cam/icon-192.png',
  '/beauty-cam/icon-512.png'
];

// Install: cache all app files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache first (offline-first strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
