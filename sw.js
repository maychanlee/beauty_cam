const CACHE_NAME = 'beauty-cam-v3';

const ASSETS_TO_CACHE = [
  '/beauty-cam/',
  '/beauty-cam/index.html',
  '/beauty-cam/manifest.json',
  '/beauty-cam/icon-192.png',
  '/beauty-cam/icon-512.png'
];

// TensorFlow.js and model files - cached on first use
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.17.0/dist/tf-backend-webgl.min.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.5/dist/face-landmarks-detection.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache local assets immediately
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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

// Cache-first strategy for everything
// CDN files get cached on first successful fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache CDN resources and model files for offline use
        if (response.ok && (
          event.request.url.includes('cdn.jsdelivr.net') ||
          event.request
