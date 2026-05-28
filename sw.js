importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB3KfNcPZb42EFNANr1vu5qLaBQJBSRXnU",
  authDomain: "meteo-pisticci.firebaseapp.com",
  projectId: "meteo-pisticci",
  storageBucket: "meteo-pisticci.firebasestorage.app",
  messagingSenderId: "383061112581",
  appId: "1:383061112581:web:c25eb6292342f96bcee96c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: '/manifest-icon-192.png'
    }
  );
});

const CACHE_NAME = "meteo-pisticci-v34";
const urlsToCache = ["/manifest.json"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (
    event.request.url.includes("retestazionimeteo.altervista.org") ||
    event.request.url.includes("meteonetwork.eu") ||
    event.request.url.includes("api.allorigins.win") ||
    event.request.url.includes("api.weather.com") ||
    event.request.url.includes("api.open-meteo.com") ||
    event.request.url.includes("marine-api.open-meteo.com") ||
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
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
