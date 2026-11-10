// Optional runtime packs. The core app is small; heavy runtimes (Python) are downloaded once
// and kept in the browser's Cache Storage so they work with no internet afterwards.
import info from '../generated/pack-info.json';

export const PACK_CACHE = 'saymacoder-packs';

export const PACKS = {
  python: {
    id: 'python',
    name: 'Python runtime',
    files: info.python.files,
    bytes: info.python.totalBytes,
  },
};

const fileURL = (name) => new URL(`${import.meta.env.BASE_URL}pyodide/${name}`, document.baseURI).href;
export const cacheSupported = () => typeof caches !== 'undefined';

export const formatBytes = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export async function packStatus(id) {
  const pack = PACKS[id];
  if (!cacheSupported()) return { supported: false, installed: false, have: 0, total: pack.files.length };
  const cache = await caches.open(PACK_CACHE);
  let have = 0;
  for (const file of pack.files) if (await cache.match(fileURL(file.name))) have += 1;
  return { supported: true, installed: have === pack.files.length, have, total: pack.files.length };
}

/** Download a pack into the cache. onProgress receives a number from 0 to 1. */
export async function downloadPack(id, onProgress = () => {}) {
  const pack = PACKS[id];
  const cache = await caches.open(PACK_CACHE);
  let done = 0;
  for (const file of pack.files) {
    const url = fileURL(file.name);
    if (await cache.match(url)) {
      done += file.size;
      onProgress(Math.min(1, done / pack.bytes));
      continue;
    }
    const res = await fetch(url, { cache: 'reload' });
    if (!res.ok) throw new Error(`Download failed (${res.status}) for ${file.name}`);
    const reader = res.body.getReader();
    const chunks = [];
    for (;;) {
      const { done: finished, value } = await reader.read();
      if (finished) break;
      chunks.push(value);
      done += value.length;
      onProgress(Math.min(1, done / pack.bytes));
    }
    const type = res.headers.get('content-type') || 'application/octet-stream';
    await cache.put(url, new Response(new Blob(chunks, { type }), { status: 200, headers: { 'content-type': type } }));
  }
  onProgress(1);
}

export async function removePack(id) {
  const cache = await caches.open(PACK_CACHE);
  for (const file of PACKS[id].files) await cache.delete(fileURL(file.name));
}
