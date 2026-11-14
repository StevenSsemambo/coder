// Prepares the offline runtimes that SayMaCoder ships:
//   - Pyodide (Python on WebAssembly) copied into public/pyodide
//   - JSCPP (C interpreter) bundled for the browser into public/vendor/jscpp.js
// Also writes src/generated/pack-info.json so the UI can show real pack sizes.
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = (p) => join(root, 'node_modules', p);

// ---- Pyodide ---------------------------------------------------------------
// This Pyodide version only runs in a MODULE worker, so the ES-module loader (pyodide.mjs) is used.
const PY_FILES = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];
mkdirSync(join(root, 'public/pyodide'), { recursive: true });
const pyFiles = PY_FILES.map((name) => {
  copyFileSync(nm(`pyodide/${name}`), join(root, 'public/pyodide', name));
  return { name, size: statSync(nm(`pyodide/${name}`)).size };
});
const pyVersion = JSON.parse(readFileSync(nm('pyodide/package.json'), 'utf8')).version;

// ---- JSCPP (C interpreter) -------------------------------------------------
// JSCPP depends on a few Node built-ins that the browser does not have.
// Provide tiny shims so it bundles into a single classic-script file.
const SHIMS = {
  util: 'module.exports = { inspect: (v) => String(v), format: (...a) => a.join(" ") };',
  stream: 'module.exports = { Stream: function Stream() {} };',
  fs: 'module.exports = {};',
  readline: 'module.exports = {};',
};
// Small fixes to JSCPP so common student programs behave like real C. Each patch must match
// exactly once; if the library changes and a patch no longer applies, the build stops loudly
// instead of silently shipping a runtime that behaves differently.
const PATCHES = [
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'puts() must print a trailing newline, as in C',
    find: 'const _puts = function (rt, _this, charPtr) {\n            const print_mask = rt.makeCharArrayFromString("%s");',
    replace: 'const _puts = function (rt, _this, charPtr) {\n            const print_mask = rt.makeCharArrayFromString("%s\\n");',
  },
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'scanf("%c", &ch) must store the character code into a char variable',
    find: 'new_value = rt.val(pointer.t.targetType, value, true);',
    replace: 'new_value = rt.val(pointer.t.targetType, typeof value === "string" ? value.charCodeAt(0) : value, true);',
  },
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'whitespace before a conversion, as in scanf(" %c", &ch), must skip any amount of whitespace (including none)',
    find: 'replace = _regslashs(pre) + replace;',
    replace: String.raw`replace = (pre && /^\s+$/.test(pre) ? '\\s*' : _regslashs(pre)) + replace;`,
  },
  {
    // `&a[i]` reaches scanf as an array-style pointer with a position. The library only knew how to fill a
    // whole char buffer (for %s), so scanf("%d", &a[i]) failed with "Memory overflow". Reading into array
    // elements is how every arrays lesson reads its data. Three small patches work together:
    //   1. %c hands its character over marked as a character, so it can be told apart from %s
    //   2. scanf unwraps that mark
    //   3. a pointer to ONE array element (a numeric array, a %c, or any position after the first) stores one value
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'scanf("%c", ...) must mark its value as a single character',
    find: 'case "%c":\n                    ret = _get_char(pre, next);',
    replace: 'case "%c":\n                    ret = { __ch: _get_char(pre, next) };',
  },
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'scanf must unwrap a value that was marked as a single character',
    find: 'const _set_pointer_value = function (pointer, value) {\n            try {',
    replace:
      'const _set_pointer_value = function (pointer, value) {\n' +
      '            let isChar = false;\n' +
      '            if (value !== null && typeof value === "object" && "__ch" in value) {\n' +
      '                isChar = true;\n' +
      '                value = value.__ch;\n' +
      '            }\n' +
      '            try {',
  },
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'scanf("%d", &a[i]) and scanf(" %c", &s[i]) must store the value into that one array element',
    find: 'else if (rt.isArrayType(pointer)) {\n                    const src_array = rt.makeCharArrayFromString(value);',
    replace:
      'else if (rt.isArrayType(pointer) && (isChar || pointer.v.position > 0 || typeof value !== "string" || !rt.isCharType(pointer.t.eleType))) {\n' +
      '                    const slot = pointer.v.target[pointer.v.position];\n' +
      '                    const stored = rt.val(pointer.t.eleType, typeof value === "string" ? value.charCodeAt(0) : value, true);\n' +
      '                    return slot.v = stored.v;\n' +
      '                }\n' +
      '                else if (rt.isArrayType(pointer)) {\n' +
      '                    const src_array = rt.makeCharArrayFromString(value);',
  },
];
const countOf = (text, part) => text.split(part).length - 1;

mkdirSync(join(root, 'public/vendor'), { recursive: true });
await build({
  entryPoints: [nm('JSCPP/lib/commonjs.js')],
  bundle: true,
  format: 'iife',
  globalName: 'JSCPP',
  platform: 'browser',
  minify: true,
  outfile: join(root, 'public/vendor/jscpp.js'),
  logLevel: 'warning',
  plugins: [
    {
      name: 'node-shims',
      setup(b) {
        b.onResolve({ filter: /^(util|stream|fs|readline)$/ }, (a) => ({ path: a.path, namespace: 'shim' }));
        b.onLoad({ filter: /.*/, namespace: 'shim' }, (a) => ({ contents: SHIMS[a.path], loader: 'js' }));

        b.onLoad({ filter: /JSCPP[\\/]lib[\\/]includes[\\/]cstdio\.js$/ }, (a) => {
          // The library ships with Windows (CRLF) line endings; normalise so patches match everywhere.
          let text = readFileSync(a.path, 'utf8').replace(/\r\n/g, '\n');
          for (const p of PATCHES.filter((x) => x.file.test(a.path.replace(/\\/g, '/')))) {
            const n = countOf(text, p.find);
            if (n !== 1) throw new Error(`JSCPP patch no longer applies (${n} matches): ${p.why}`);
            text = text.replace(p.find, () => p.replace);
          }
          return { contents: text, loader: 'js', resolveDir: dirname(a.path) };
        });
      },
    },
  ],
});
const cSize = statSync(join(root, 'public/vendor/jscpp.js')).size;

// ---- Pack info for the UI ---------------------------------------------------
mkdirSync(join(root, 'src/generated'), { recursive: true });
const info = {
  python: {
    version: pyVersion,
    files: pyFiles,
    totalBytes: pyFiles.reduce((n, f) => n + f.size, 0),
  },
  c: { bundledBytes: cSize },
};
writeFileSync(join(root, 'src/generated/pack-info.json'), JSON.stringify(info, null, 2));
console.log(`runtimes ready: python ${(info.python.totalBytes / 1048576).toFixed(1)} MB, c ${(cSize / 1024).toFixed(0)} KB`);
