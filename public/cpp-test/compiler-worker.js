// Compiler worker for the C++ phone test (docs/CPP-TRACK.md, "Phone test").
// Loads @yowasp/clang (LLVM built for WebAssembly) from a base URL, keeps every downloaded file in Cache Storage so
// that the next run works with the network off, and compiles C++ to a .wasm program.
//
// Two ways to load:
//  * gz = true  (this website): every file is stored on the site as NAME.gz. Only the small gzipped file is
//    downloaded and cached (about 27 MB in total); it is unpacked in memory with DecompressionStream.
//  * gz = false (a CDN): the plain files are downloaded and cached (about 105 MB).
//
// The compiler's bundle.js is fetched as TEXT, its import.meta.url is replaced by the real base URL, and it is then
// imported from a Blob. This way every file the compiler asks for goes through the cached fetch below.

const CACHE = 'cpp-compiler-test-v2';
const IDLE_MS = 90 * 1000; // a download that receives no data for this long is given up
let runClang = null;
let Exit = null;
let useGz = false;
const files = {}; // name -> { from: 'cache' | 'network', bytes, ms, stored, error }
let cacheDisabledReason = '';

const post = (m, t) => self.postMessage(m, t || []);
const text = new TextDecoder();

function mimeFor(url) {
  if (url.endsWith('.wasm')) return 'application/wasm';
  if (url.endsWith('.js')) return 'text/javascript';
  return 'application/octet-stream';
}

async function looksGzipped(blob) {
  const head = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
  return head[0] === 0x1f && head[1] === 0x8b;
}

// Turns the stored bytes into the Response the compiler expects (unpacking gzip when needed).
async function toResponse(blob, url) {
  const headers = { 'content-type': mimeFor(url) };
  if (useGz && (await looksGzipped(blob))) {
    return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip')), { headers });
  }
  return new Response(blob, { headers });
}

function installCachedFetch() {
  const realFetch = self.fetch.bind(self);
  self.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const name = url.split('/').pop();
    const key = useGz ? url + '.gz' : url;
    const host = new URL(key).host;
    let cache = null;
    try { cache = await caches.open(CACHE); } catch (e) { cacheDisabledReason = String(e && e.message || e); }
    if (cache) {
      const hit = await cache.match(key);
      if (hit) {
        const blob = await hit.blob();
        files[name] = { from: 'cache', bytes: blob.size, ms: 0 };
        return toResponse(blob, url);
      }
    }
    const t0 = performance.now();
    const ac = new AbortController();
    let idle = 0;
    const arm = () => { clearTimeout(idle); idle = setTimeout(() => ac.abort(), IDLE_MS); };
    arm();
    let res;
    try {
      res = await realFetch(key, { ...(init || {}), signal: ac.signal });
    } catch (e) {
      clearTimeout(idle);
      throw new Error(`Could not download ${name} from ${host}: ${e && e.name === 'AbortError' ? 'no data for ' + IDLE_MS / 1000 + ' s' : (e && e.message || e)}`);
    }
    if (!res.ok) {
      clearTimeout(idle);
      throw new Error(`Download failed (HTTP ${res.status}) for ${name} from ${host}`);
    }
    const reader = res.body.getReader();
    const chunks = [];
    let loaded = 0;
    let lastPost = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        arm();
        chunks.push(value);
        loaded += value.length;
        const now = performance.now();
        if (now - lastPost > 400) { lastPost = now; post({ type: 'progress', name, loaded }); }
      }
    } catch (e) {
      clearTimeout(idle);
      throw new Error(`The download of ${name} from ${host} stopped after ${(loaded / 1e6).toFixed(1)} MB: ${e && e.name === 'AbortError' ? 'no data for ' + IDLE_MS / 1000 + ' s' : (e && e.message || e)}`);
    }
    clearTimeout(idle);
    const blob = new Blob(chunks, { type: 'application/octet-stream' });
    const entry = { from: 'network', bytes: loaded, ms: Math.round(performance.now() - t0), stored: false };
    files[name] = entry;
    post({ type: 'progress', name, loaded, done: true });
    if (cache) {
      try {
        await cache.put(key, new Response(blob, { headers: { 'content-type': 'application/octet-stream' } }));
        entry.stored = true;
      } catch (e) {
        entry.error = String(e && e.message || e);
      }
    }
    return toResponse(blob, url);
  };
}

const outCollector = () => {
  const parts = [];
  return { fn: (bytes) => { if (bytes) parts.push(text.decode(bytes, { stream: true })); }, text: () => parts.join('') };
};

self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.cmd === 'init') {
      const t0 = performance.now();
      useGz = !!m.gz;
      installCachedFetch();
      const bundleUrl = m.base + 'bundle.js';
      const res = await self.fetch(bundleUrl);
      const src = (await res.text()).replaceAll('import.meta.url', JSON.stringify(bundleUrl));
      const blobUrl = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      const mod = await import(blobUrl);
      runClang = mod.runClang;
      Exit = mod.Exit;
      const tImport = performance.now();
      // "--version" makes the compiler download and compile all its WebAssembly modules, but compiles no C++.
      const out = outCollector();
      await runClang(['clang++', '--version'], {}, { stdout: out.fn, stderr: out.fn });
      post({
        type: 'init-done',
        ms: Math.round(performance.now() - t0),
        importMs: Math.round(tImport - t0),
        version: out.text().split('\n')[0],
        files,
        gz: useGz,
        cacheDisabledReason,
      });
    } else if (m.cmd === 'compile') {
      const t0 = performance.now();
      const out = outCollector();
      const err = outCollector();
      try {
        const result = await runClang(['clang++', ...m.args, 'main.cc', '-o', 'main.wasm'], { 'main.cc': m.source }, { stdout: out.fn, stderr: err.fn });
        const bytes = result['main.wasm'];
        const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        post({ type: 'compiled', id: m.id, ok: true, ms: Math.round(performance.now() - t0), size: copy.byteLength, wasm: copy, stderr: err.text() }, [copy]);
      } catch (ex) {
        if (Exit && ex instanceof Exit) {
          post({ type: 'compiled', id: m.id, ok: false, ms: Math.round(performance.now() - t0), stderr: err.text() + out.text(), exitCode: ex.code });
        } else {
          throw ex;
        }
      }
    }
  } catch (ex) {
    post({ type: 'error', id: m.id, message: String(ex && ex.message || ex) });
  }
};
