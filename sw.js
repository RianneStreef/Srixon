console.log("service worker running");

var cacheName = "/srixon-v13";
var contentToCache = [
  "../index.html",
  "../categories.html",
  "../categories/golf-bags-v2.html",
  "../products/golf-bags/srixon-tour-staff-v2.html",
  "../products/golf-bags/tour-cart-v2.html",
  "../products/golf-bags/tour-stand-v2.html",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();

  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log("[Service Worker] Fetched resource " + e.request.url);
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log("[Service Worker] Fetching resource: " + e.request.url);
      return (
        r ||
        fetch(e.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            console.log(
              "[Service Worker] Caching new resource: " + e.request.url
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
