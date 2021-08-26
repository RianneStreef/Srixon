console.log("service worker running");

var cacheName = "/srixon-v5.4";
var contentToCache = [
  // "../index.html",
  // "../categories.html",
  // "../categories/golf-bags.html",
  // "../products/golf-bags/srixon-tour-staff.html",
  // "../products/golf-bags/tour-cart.html",
  // "../products/golf-bags/tour-stand.html",
];

caches.keys().then(function (names) {
  for (let name of names) caches.delete(name);
  console.log("caches deleted");
});

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
