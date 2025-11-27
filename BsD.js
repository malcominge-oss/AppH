// ===============================
// SERVICE WORKER COMPLETO OFFLINE
// ===============================

const CACHE_NAME = "cache-app-v3";

const FILES_TO_CACHE = [
  "index.html",
  "indice.html",
  "pag2.html",

  "fst.html",
  "fst2.html",
  "fst3.html",
  "fst4.html",
  "fst5.html",
  "fst6.html",
  "fst7.html",

  "BD.js",
  "BsD.js",
  "qwer.js",

  "style.css",
  "style3.css"
];

// =====================================
// INSTALACIÓN: Guardar archivos en caché
// =====================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

// =====================================
// ACTIVACIÓN: Limpiar cachés viejas
// =====================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// =====================================
// FETCH con fallback
// - Si hay caché: usa caché
// - Si hay internet: usa red
// - Si falla todo: regresa index.html
// =====================================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        return cached || fetch(event.request);
      })
      .catch(() => caches.match("index.html"))
  );
});
