// ============================================================
// FITTRACK PRO — Service Worker
// Caches all app assets for offline use
// ============================================================

const CACHE_NAME = 'fittrack-v23';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/config.js',
  '/js/data.js',
  '/js/recipes.js',
  '/js/app.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k!==CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for YouTube (videos need internet), cache-first for app shell
  if (e.request.url.includes('youtube.com') || e.request.url.includes('youtu.be')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return resp;
      });
    })
  );
});
