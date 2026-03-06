const CACHE = 'krystallon-v4';
const SHELL = ['./index.html', './manifest.json', './logo.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ποτέ cache για API calls
  if(e.request.url.includes('/api/')){
    e.respondWith(fetch(e.request));
    return;
  }
  // App shell — cache first
  e.respondWith(
    caches.match(e.request).then(c => c || fetch(e.request))
      .catch(() => caches.match('./index.html'))
  );
});
