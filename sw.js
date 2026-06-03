const CACHE_NAME = 'rinconcito-v6';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './rex.html',
  './chorejas.html',
  './mininos.html',
  './corolla.html',
  './mojack.html',
  './manifest.json',
  './images/logo.png',
  './images/logo-small.png',
  './images/logo-wide.png',
  './images/bg.png',
  './images/splash.png',
  './images/title.png',
  './images/footer.png',
  './images/gameover.png',
  './images/paused.png',
  './images/store.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo cachear recursos del mismo origen
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});
