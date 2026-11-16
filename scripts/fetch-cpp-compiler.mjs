// Puts the C++ compiler (LLVM/Clang built for WebAssembly, npm package @yowasp/clang) into the built site,
// next to the phone test page, so that a phone downloads it from the SAME address as the page instead of from a
// third-party CDN. Runs automatically after `npm run build` (npm "postbuild"). Nothing is added to git.
//
// The files are stored gzipped (about 27 MB instead of 105 MB). The page unpacks them in the browser with
// DecompressionStream, and keeps the small gzipped copy in Cache Storage for offline use.
// Set SKIP_CPP_COMPILER=1 to skip this step. If the download fails the build still succeeds (a warning is printed)
// and the test page falls back to a CDN.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const VERSION = '22.0.0-git20542-10'; // keep in sync with VERSION in public/cpp-test/test.js
const OUT = 'dist/cpp-test/compiler';

if (process.env.SKIP_CPP_COMPILER) {
  console.log('C++ compiler: skipped (SKIP_CPP_COMPILER is set)');
  process.exit(0);
}
if (!existsSync('dist/cpp-test')) {
  console.log('C++ compiler: dist/cpp-test not found, nothing to do');
  process.exit(0);
}

let tmp = '';
try {
  tmp = mkdtempSync(join(tmpdir(), 'yowasp-clang-'));
  execFileSync('npm', ['pack', `@yowasp/clang@${VERSION}`, '--silent', '--pack-destination', tmp], { stdio: ['ignore', 'ignore', 'inherit'] });
  const tgz = readdirSync(tmp).find((f) => f.endsWith('.tgz'));
  if (!tgz) throw new Error('npm pack produced no file');
  execFileSync('tar', ['-xzf', join(tmp, tgz), '-C', tmp]);
  const gen = join(tmp, 'package', 'gen');
  mkdirSync(join(OUT, 'gen'), { recursive: true });
  let raw = 0;
  let packed = 0;
  for (const name of readdirSync(gen)) {
    const data = readFileSync(join(gen, name));
    const gz = gzipSync(data, { level: 9 });
    writeFileSync(join(OUT, 'gen', name + '.gz'), gz);
    raw += data.length;
    packed += gz.length;
  }
  writeFileSync(join(OUT, 'VERSION.txt'), `@yowasp/clang ${VERSION}\n`);
  writeFileSync(join(OUT, 'NOTICE.txt'), [
    `This folder contains @yowasp/clang ${VERSION} (https://yowasp.org/, https://www.npmjs.com/package/@yowasp/clang),`,
    'LLVM, Clang and LLD built for WebAssembly by the YoWASP project.',
    'LLVM is licensed under the Apache License 2.0 with LLVM Exceptions (https://llvm.org/LICENSE.txt).',
    'The files are gzip-compressed copies of the unmodified files from the npm package.',
    '',
  ].join('\n'));
  console.log(`C++ compiler: added ${(packed / 1e6).toFixed(1)} MB (gzipped from ${(raw / 1e6).toFixed(1)} MB) to ${OUT}`);
} catch (e) {
  console.warn(`C++ compiler: could not be prepared (${e.message}). The phone test page will fall back to a CDN.`);
} finally {
  if (tmp) rmSync(tmp, { recursive: true, force: true });
}
