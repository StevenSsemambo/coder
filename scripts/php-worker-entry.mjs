// Entry point of the PHP worker. scripts/prepare-runtimes.mjs bundles this file (and PHP's JavaScript
// loader) into public/workers/php.worker.js. The big WebAssembly file is NOT inside the bundle: it is
// part of the optional "PHP pack" in public/php/ and is found through locateFile below.
import { PHP } from '@php-wasm/universal';
import { loadWebRuntime } from '@php-wasm/web';
import { createPhp, runPhp } from '../src/lib/phpcore.mjs';

const packURL = (name) => new URL('../php/' + name, self.location.href).href;

let phpPromise = null;
function init() {
  if (!phpPromise) {
    phpPromise = createPhp({
      PHP,
      loadRuntime: () =>
        loadWebRuntime('8.3', {
          emscriptenOptions: {
            processId: 1,
            // the loader asks for "./php_8_3.wasm"; serve it from the pack folder
            locateFile: (path) => packURL(String(path).split('/').pop()),
          },
        }),
    });
  }
  return phpPromise;
}

init().then(
  () => self.postMessage({ type: 'ready' }),
  (e) => self.postMessage({ type: 'init-error', message: 'PHP could not start: ' + String((e && e.message) || e) }),
);

self.onmessage = async (ev) => {
  const { type, id, code, stdin } = ev.data;
  if (type !== 'run') return;
  let php;
  try {
    php = await init();
  } catch (e) {
    self.postMessage({ type: 'result', id, error: 'PHP could not start: ' + String((e && e.message) || e) });
    return;
  }
  const res = await runPhp(php, code, stdin);
  if (res.stdout) self.postMessage({ type: 'chunk', id, stream: 'out', text: res.stdout });
  self.postMessage({ type: 'result', id, error: res.error });
};
