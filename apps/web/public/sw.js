const CACHE = "ayusetu-shell-v3";
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(["/icon.svg"])));
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api") || url.pathname === "/healthz" || event.request.method !== "GET") {
    return;
  }
  // Bypass service worker cache for documents and dynamic chunks to prevent stale chunk errors
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.includes('/assets/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then(r => r ?? new Response("Offline: open this screen once while connected.", { status: 503 })))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    })).catch(() => new Response("Offline", { status: 503 }))
  );
});
