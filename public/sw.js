// Offline support.
// Network first: the page, config.js, the manifest and this file, so a corrected schedule always wins.
// Cache first: fonts, images and icons, in a versioned cache. Change VERSION when you replace any of them.
// Scripts and styles: network first too, so page, code and styles always match after an update.
// On a slow line the saved copy is used after a few seconds, and offline it is used at once.
// Videos and HEAD requests (the clock check) are never touched.

const VERSION = "poster-v4";
const STATIC = `recharge-static-${VERSION}`;
const PAGES = `recharge-pages-${VERSION}`;
const CONFIG_PATH = new URL("./config.js", self.location).pathname;

const PRECACHE = [
  "./",
  "./config.js",
  "./manifest.webmanifest",
  "./assets/css/site.css",
  "./assets/css/poster.css",
  "./assets/fonts/montserrat-900.woff2",
  "./assets/fonts/montserrat-800.woff2",
  "./assets/fonts/arizonia-400.woff2",
  "./assets/img/paper.webp",
  "./assets/js/app.js",
  "./assets/js/state.js",
  "./assets/js/clock.js",
  "./assets/js/i18n.js",
  "./assets/js/format.js",
  "./assets/js/console.js",
  "./assets/js/programme.js",
  "./assets/js/calendar.js",
  "./assets/js/speakers.js",
  "./assets/js/theme.js",
  "./assets/i18n/en.js",
  "./assets/i18n/sw.js",
  "./assets/i18n/ki.js",
  "./assets/fonts/anton-400.woff2",
  "./assets/fonts/alegreya-sans-400.woff2",
  "./assets/fonts/alegreya-sans-700.woff2",
  "./assets/img/church-logo-160.webp",
  "./assets/img/church-logo-480.webp",
  "./assets/icons/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const statics = await caches.open(STATIC);
      await Promise.all(
        PRECACHE.map((url) => {
          const isPage = url === "./" || url.endsWith("config.js") || url.endsWith(".webmanifest");
          return (isPage ? pages : statics).add(new Request(url, { cache: "reload" })).catch(() => {});
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([STATIC, PAGES]);
      for (const key of await caches.keys()) if (!keep.has(key)) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

async function networkFirst(request, { cacheName = PAGES, key = request, wait = 4000 } = {}) {
  const cache = await caches.open(cacheName);
  const fromCache = async () => {
    const hit = await cache.match(key, { ignoreSearch: true });
    if (hit) return hit;
    if (request.mode === "navigate") return (await cache.match("./")) || null;
    return null;
  };
  const network = fetch(request, { cache: "no-store" }).then((res) => {
    if (res.ok) cache.put(key, res.clone());
    return res;
  });
  // Slow line: after `wait` ms fall back to the saved copy if there is one; the network copy still updates the cache.
  const slow = new Promise((resolve) => setTimeout(() => fromCache().then((hit) => hit && resolve(hit)), wait));
  network.catch(() => {});
  try {
    return await Promise.race([network, slow]);
  } catch {
    return (await fromCache()) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const fresh = await fetch(request);
  if (fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  const path = url.pathname;

  if (path.includes("/assets/video/") || request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, { key: "./" }));
  } else if (path === CONFIG_PATH || path === self.location.pathname || path.endsWith(".webmanifest")) {
    event.respondWith(networkFirst(request));
  } else if (/\/assets\/(fonts|img|icons|speakers)\//.test(path)) {
    event.respondWith(cacheFirst(request));
  } else if (/\.(js|css)$/.test(path)) {
    event.respondWith(networkFirst(request, { cacheName: STATIC }));
  }
});
