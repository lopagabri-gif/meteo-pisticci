const CACHE_NAME = "meteo-pisticci-v3";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", event => {

if(
event.request.url.includes("retestazionimeteo.altervista.org") ||
event.request.url.includes("meteonetwork.eu") ||
event.request.url.includes("api.allorigins.win")
){
event.respondWith(fetch(event.request));
return;
}

event.respondWith(
caches.match(event.request)
.then(response => {
return response || fetch(event.request);
})
);

});
