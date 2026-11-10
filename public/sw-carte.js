const CACHE_NAME = "rziza-carte-v1";
const CACHE_URLS = [
  "/carte",
  "/carte/",
  "/carte.html",
  "/carte.webmanifest",
  "/sw-carte.js",
  "/products.js",
  "/rziza-house.vcf",
  "/favicon-48.png",
  "/apple-touch-icon.png",
  "/images/logo-mark.png",
  "/images/contact.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS)).catch(() => undefined).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const shouldCache = [
    "/carte",
    "/carte/",
    "/carte.html",
    "/carte.webmanifest",
    "/sw-carte.js",
    "/products.js",
    "/rziza-house.vcf",
    "/favicon-48.png",
    "/apple-touch-icon.png",
    "/images/logo-mark.png",
    "/images/contact.jpg",
  ].includes(pathname);

  if (!shouldCache) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (["/carte", "/carte/", "/carte.html"].includes(pathname)) {
            return caches.match("/carte.html") || caches.match("/carte") || caches.match("/carte/");
          }
          return caches.match(request, { ignoreSearch: true }) || caches.match("/carte.html");
        });
    }),
  );
});
