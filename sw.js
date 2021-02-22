console.log('service worker running');

var cacheName = '/srixon-v2';
var contentToCache = [
'../index.html',
'../categories.html',

'../categories/accessories.html',
'../categories/balls.html',
'../categories/clubs.html',
'../categories/demoday.html',
'../categories/gloves.html',
'../categories/golf-bags.html',
'../categories/headwear.html',
'../categories/travel-gear.html',

'../products/clubs/Custom-Shafts-v2.pdf'
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Fetched resource '+e.request.url);
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});