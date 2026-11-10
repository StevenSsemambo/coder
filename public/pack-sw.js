/* Offline runtime packs: serves /pyodide/* from the "saymacoder-packs" cache (filled by Settings > Download).
 *
 * This file is pulled into the generated service worker with importScripts(), so its fetch listener
 * is registered synchronously while the service worker starts. That matters: the browser may stop an
 * idle service worker and restart it just to answer one request, and a listener that is registered
 * later would miss that request and let it fall through to the (absent) network.
 *
 * If a file is not in the cache, the page is told (see window.__packLog in main.js) so a failure is
 * diagnosable instead of silent.
 */
const PACK_CACHE = 'saymacoder-packs';

async function tellPages(message) {
  try {
    const pages = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    pages.forEach((page) => page.postMessage(message));
  } catch (_) {
    /* diagnostics only */
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !/\/pyodide\/[^/]+$/.test(url.pathname)) return;

  event.respondWith(
    (async () => {
      let cache;
      try {
        cache = await caches.open(PACK_CACHE);
        const hit = await cache.match(url.href);
        if (hit) return hit;
      } catch (error) {
        tellPages({ type: 'pack-error', url: url.pathname, error: String(error) });
      }
      // Not cached: fall back to the network (works while online, e.g. during the first download).
      try {
        return await fetch(request);
      } catch (error) {
        let keys = [];
        try {
          keys = cache ? (await cache.keys()).map((k) => new URL(k.url).pathname) : ['(no cache)'];
        } catch (_) {
          /* ignore */
        }
        tellPages({ type: 'pack-miss', url: url.pathname, mode: request.mode, destination: request.destination, keys });
        throw error;
      }
    })(),
  );
});
