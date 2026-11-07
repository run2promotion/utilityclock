const CACHE_NAME = "utilityclock-static-v5";
const CORE_PRECACHE_URLS = [
  "/",
  "/en",
  "/en/timer",
  "/en/alarm",
  "/en/stopwatch",
  "/en/world-clock",
  "/en/date-calendar",
  "/en/calculators",
  "/en/productivity",
  "/en/converters",
  "/en/finance",
  "/en/text",
  "/en/calendar",
  "/en/calendar/hindu-calendar",
  "/en/calendar/gujarati-calendar",
  "/en/panchang",
  "/en/festivals",
  "/en/devotional",
  "/en/astrology",
  "/en/love-tools",
  "/favicon.svg",
  "/favicon.ico",
  "/site.webmanifest",
  "/sounds/alarm.wav",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_PRECACHE_URLS))
      .catch((err) => {
        // Log pre-cache error in dev, but continue service worker activation
        console.warn("PWA pre-cache warning:", err);
      }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Never cache API, ads, or telemetry
  if (url.pathname.startsWith("/api/")) return;

  // 1. Navigation (HTML document requests): Network-first with offline cached page fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedMatch = await caches.match(event.request);
          if (cachedMatch) return cachedMatch;
          const fallbackHome = await caches.match("/en");
          return fallbackHome || Response.error();
        }),
    );
    return;
  }

  // 2. Static assets & media (JS, CSS, fonts, icons, WAV audio): Cache-first with network fallback
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".wav") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".webmanifest");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      }),
    );
  }
});
