const CACHE_NAME = "meteo-pisticci-v16";

const urlsToCache = [
  "/manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {

  if (
    event.request.url.includes("retestazionimeteo.altervista.org") ||
    event.request.url.includes("meteonetwork.eu") ||
    event.request.url.includes("api.allorigins.win") ||
    event.request.url.includes("api.weather.com") ||
    event.request.url.includes("/api/marconia")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});
