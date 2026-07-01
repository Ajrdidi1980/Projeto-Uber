const CACHE_NAME = "controle-v4";

self.addEventListener("install", (event) => {
  console.log("🔥 SW instalado");

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🔥 SW ativado");

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );

  self.clients.claim();
});
