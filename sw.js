// ============================================
// Beauty Cam - Service Worker
// Makes the app work 100% offline after first load
// ============================================

const CACHE_NAME = 'beauty-cam-v2';

// All files that need to be cached for offline use
const ASSETS_TO_CACHE = [
  '/beauty-cam/',
  '/beauty-cam/index.html',
  '/beauty-cam/manifest.json',
  '/beauty-cam/icon-192.png',
  '/beauty-cam/icon-512.png'
];

// Install event: cache all app files on first visit
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// Activate event: clean up any old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event: serve from cache first (offline-first strategy)
// If the file is in cache, return it instantly (works offline)
// If not in cache, try the network (only happens on first load)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
