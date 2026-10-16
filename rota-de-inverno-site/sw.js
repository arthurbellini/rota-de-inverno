/* Service worker — permite usar o site sem internet durante a viagem.
   Mude VERSION a cada publicação para renovar os arquivos. */
const VERSION = "v20261016";
const CORE_CACHE = "core-" + VERSION;
const IMG_CACHE = "imagens-v1";
const STATIC_CACHE = "externos-v1";
const MAX_IMAGES = 220;

const CORE = [
  "./", "index.html", "manifest.webmanifest",
  "css/styles.css?v=20261016",
  "js/data.js?v=20261016", "js/images-data.js?v=20261016", "js/images-extra-data.js?v=20261016",
  "js/app.js?v=20261016", "js/sections.js?v=20261016", "js/pwa.js?v=20261016",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"
];
const EXTERNAL = [
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
];
const IMAGE_HOSTS = ["upload.wikimedia.org", "thumb.wikimedia.org"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const core = await caches.open(CORE_CACHE);
    await core.addAll(CORE);
    const ext = await caches.open(STATIC_CACHE);
    await Promise.all(EXTERNAL.map((u) => fetch(u).then((r) => r.ok && ext.put(u, r)).catch(() => {})));
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keep = [CORE_CACHE, IMG_CACHE, STATIC_CACHE];
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

async function trimImages() {
  const cache = await caches.open(IMG_CACHE);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_IMAGES; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Páginas: rede primeiro (para receber atualizações), cache como reserva.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CORE_CACHE);
        cache.put("index.html", fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match("index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  // Fotos do Wikimedia: cache primeiro; só guarda respostas válidas.
  if (IMAGE_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(IMG_CACHE);
      const hit = await cache.match(req.url);
      if (hit) return hit;
      try {
        const res = await fetch(req.url, { mode: "cors" });
        if (res.ok) { cache.put(req.url, res.clone()); trimImages(); }
        return res;
      } catch (e) {
        return Response.error();
      }
    })());
    return;
  }

  // Mapas: sempre rede (sem cache).
  if (url.hostname.endsWith("tile.openstreetmap.org")) return;

  // Arquivos do próprio site e bibliotecas externas: cache primeiro.
  if (url.origin === location.origin || ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"].includes(url.hostname)) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) {
          const cache = await caches.open(url.origin === location.origin ? CORE_CACHE : STATIC_CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch (e) {
        return Response.error();
      }
    })());
  }
});