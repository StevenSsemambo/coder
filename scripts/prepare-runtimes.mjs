// Prepares the offline runtimes that SayMaCoder ships:
//   - Pyodide (Python on WebAssembly) copied into public/pyodide
//   - JSCPP (C interpreter) bundled for the browser into public/vendor/jscpp.js
//   - sql.js (SQLite on WebAssembly, about 0.7 MB) copied into public/vendor/sqljs
// Also writes src/generated/pack-info.json so the UI can show real pack sizes.
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
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
  {
    // JSCPP ignores `static` on local variables, so a static counter restarted from its start value on every call.
    // This keeps one variable per declaration: the first time the declaration runs it is created (a static with no
    // value starts at 0, as in C); every later time the very same variable is put back in scope.
    file: /JSCPP\/lib\/interpreter\.js$/,
    why: 'static local variables must keep their value between calls',
    find:
      '                        if ((init == null)) {\n' +
      '                            init = rt.defaultValue(type, true);\n' +
      '                        }\n' +
      '                        else {\n' +
      '                            init = yield* interp.visit(interp, init.Expression);\n' +
      '                        }\n' +
      '                        rt.defVar(name, type, init);',
    replace:
      '                        const isStatic = Array.isArray(s.DeclarationSpecifiers) && s.DeclarationSpecifiers.includes("static");\n' +
      '                        if (isStatic && s.__statics && s.__statics[name]) {\n' +
      '                            rt.scope[rt.scope.length - 1].variables[name] = s.__statics[name];\n' +
      '                            continue;\n' +
      '                        }\n' +
      '                        if ((init == null)) {\n' +
      '                            init = isStatic ? rt.cast(type, rt.val(rt.intTypeLiteral, 0)) : rt.defaultValue(type, true);\n' +
      '                        }\n' +
      '                        else {\n' +
      '                            init = yield* interp.visit(interp, init.Expression);\n' +
      '                        }\n' +
      '                        rt.defVar(name, type, init);\n' +
      '                        if (isStatic) {\n' +
      '                            s.__statics = s.__statics || {};\n' +
      '                            s.__statics[name] = rt.scope[rt.scope.length - 1].variables[name];\n' +
      '                        }',
  },
  {
    // `int a[5] = {10, 20};` must give 10, 20, 0, 0, 0. JSCPP left the missing elements without a value (reading one stopped
    // the program) and turned `{5}` into -1, 0, 0... Pad the list with zeros first, which is what C does. A flat list for a 2D
    // array ({1,2,3,4}) is cut into rows, as C does (brace elision).
    file: /JSCPP\/lib\/interpreter\.js$/,
    why: 'array initialiser lists with fewer values than the array size must fill the rest with zeros',
    find:
      '            const curDim = dimensions[0];\n' +
      '            if (init) {\n',
    replace:
      '            const curDim = dimensions[0];\n' +
      '            if (init && init.type === "Initializer_array" && init.Initializers != null && dimensions.length === 2 && init.Initializers.length > 0 && init.Initializers.every((e) => e.type === "Initializer_expr" && !("shorthand" in e))) {\n' +
      '                const rows = [];\n' +
      '                for (let r = 0; r < init.Initializers.length; r += dimensions[1]) {\n' +
      '                    rows.push({ type: "Initializer_array", Initializers: init.Initializers.slice(r, r + dimensions[1]) });\n' +
      '                }\n' +
      '                init.Initializers = rows;\n' +
      '            }\n' +
      '            if (init && init.type === "Initializer_array" && init.Initializers != null && init.Initializers.length > 0 && init.Initializers.length < curDim) {\n' +
      '                const padded = init.Initializers.slice();\n' +
      '                while (padded.length < curDim) {\n' +
      '                    padded.push(dimensions.length > 1 ? { type: "Initializer_array", Initializers: [{ type: "Initializer_expr", shorthand: this.rt.val(type, 0) }] } : { type: "Initializer_expr", shorthand: this.rt.val(type, 0) });\n' +
      '                }\n' +
      '                init.Initializers = padded;\n' +
      '            }\n' +
      '            if (init) {\n',
  },
  {
    // strcmp ran past the end of the text (it never stopped at the terminating zero), so comparing two EQUAL strings
    // crashed with "overflow of NaN". It also mixed up the two start positions.
    file: /JSCPP\/lib\/includes\/cstring\.js$/,
    why: 'strcmp must stop at the end of the string, so equal strings give 0',
    find:
      '                while ((i < srcarr.length) && (j < destarr.length) && (srcarr[i].v === destarr[i].v)) {\n' +
      '                    i++;\n' +
      '                    j++;\n' +
      '                }\n' +
      '                return rt.val(rt.intTypeLiteral, destarr[i].v - srcarr[i].v);',
    replace:
      '                while ((i < srcarr.length) && (j < destarr.length) && (srcarr[i].v === destarr[j].v) && (srcarr[i].v !== 0)) {\n' +
      '                    i++;\n' +
      '                    j++;\n' +
      '                }\n' +
      '                return rt.val(rt.intTypeLiteral, (j < destarr.length ? destarr[j].v : 0) - (i < srcarr.length ? srcarr[i].v : 0));',
  },
  {
    // strncmp compared whole strings (it stopped counting too late) and ignored the length.
    file: /JSCPP\/lib\/includes\/cstring\.js$/,
    why: 'strncmp must compare at most n characters and stop at the end of the string',
    find:
      '                while ((n > 0) && (i < srcarr.length) && (j < destarr.length) && (srcarr[i].v === destarr[i].v)) {\n' +
      '                    i++;\n' +
      '                    j++;\n' +
      '                    n--;\n' +
      '                }\n' +
      '                return rt.val(rt.intTypeLiteral, destarr[i].v - srcarr[i].v);',
    replace:
      '                while ((n > 0) && (i < srcarr.length) && (j < destarr.length) && (srcarr[i].v === destarr[j].v) && (srcarr[i].v !== 0)) {\n' +
      '                    i++;\n' +
      '                    j++;\n' +
      '                    n--;\n' +
      '                }\n' +
      '                if (n <= 0) {\n' +
      '                    return rt.val(rt.intTypeLiteral, 0);\n' +
      '                }\n' +
      '                return rt.val(rt.intTypeLiteral, (j < destarr.length ? destarr[j].v : 0) - (i < srcarr.length ? srcarr[i].v : 0));',
  },
  {
    // strcpy stored plain values in the destination, which cannot be assigned to later:
    //   strcpy(b, a); b[0] = 'X';   stopped with "'a'(char) is not a left value".
    file: /JSCPP\/lib\/includes\/shared\/cstring_strcpy\.js$/,
    why: 'characters copied by strcpy must stay assignable',
    find: '            destarr[j] = rt.clone(srcarr[i]);',
    replace: '            destarr[j] = rt.val(srcarr[i].t, srcarr[i].v, true);',
  },
  {
    file: /JSCPP\/lib\/includes\/shared\/cstring_strcpy\.js$/,
    why: 'the closing zero written by strcpy must stay assignable too (strcat adds to it)',
    find: '            destarr[j] = rt.val(rt.charTypeLiteral, 0);',
    replace: '            destarr[j] = rt.val(rt.charTypeLiteral, 0, true);',
  },
  {
    file: /JSCPP\/lib\/includes\/cstring\.js$/,
    why: 'characters copied by strncpy (and strncat) must stay assignable',
    find: '                    destarr[j] = rt.clone(srcarr[i]);',
    replace: '                    destarr[j] = rt.val(srcarr[i].t, srcarr[i].v, true);',
  },
  {
    // Words read with scanf("%s", s) were stored as plain values, so a later  s[0] = toupper(s[0]);  stopped with
    // "'u'(char) is not a left value". Store each character as a box that can be assigned to.
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'characters read into a char array by scanf must stay assignable',
    find: '                                return pointer.v.target[i] = src_array.v.target[i];',
    replace: '                                return pointer.v.target[i] = src_array.v.target[i] === undefined ? undefined : rt.val(src_array.v.target[i].t, src_array.v.target[i].v, true);',
  },
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'characters read by gets must stay assignable',
    find: '                    destArray[i] = rt.val(rt.charTypeLiteral, return_value.charCodeAt(i));',
    replace: '                    destArray[i] = rt.val(rt.charTypeLiteral, return_value.charCodeAt(i), true);',
  },
  {
    file: /JSCPP\/lib\/includes\/cstdio\.js$/,
    why: 'the closing zero written by gets must stay assignable',
    find: '            destArray[return_value.length] = rt.val(rt.charTypeLiteral, 0);',
    replace: '            destArray[return_value.length] = rt.val(rt.charTypeLiteral, 0, true);',
  },
  // Pointer operators in JSCPP's defaults.js: != and the comparisons returned the wrong kind of value or looked up a
  // handler that does not exist, and += / -= called a missing one. Pointer loops (p != end, p < a + n) need them.
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p != q on pointers must work (it looked up a handler that does not exist)',
    find: '                return !rt.types["pointer"].handlers["=="].default(rt, l, r);',
    replace: '                return rt.val(rt.boolTypeLiteral, !rt.types["pointer"].handlers["o(==)"].default(rt, l, r).v);',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p < q on pointers must give a value the program can test',
    find: '                        return l.v.position < r.v.position;',
    replace: '                        return rt.val(rt.boolTypeLiteral, l.v.position < r.v.position);',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p > q on pointers must give a value the program can test',
    find: '                        return l.v.position > r.v.position;',
    replace: '                        return rt.val(rt.boolTypeLiteral, l.v.position > r.v.position);',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p <= q on pointers must give a value the program can test',
    find: '                        return l.v.position <= r.v.position;',
    replace: '                        return rt.val(rt.boolTypeLiteral, l.v.position <= r.v.position);',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p >= q on pointers must give a value the program can test',
    find: '                        return l.v.position >= r.v.position;',
    replace: '                        return rt.val(rt.boolTypeLiteral, l.v.position >= r.v.position);',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'q - p on pointers into the same array must give a number',
    find: '                            return l.v.position - r.v.position;',
    replace: '                            return rt.val(rt.intTypeLiteral, l.v.position - r.v.position);',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p += n on a pointer must move it',
    find: '                r = rt.types["pointer_array"].handlers["o(+)"].default(rt, l, r);\n                return rt.types["pointer"].handlers["="].default(rt, l, r);',
    replace: '                r = rt.types["pointer_array"].handlers["o(+)"].default(rt, l, r);\n                l.v = r.v;\n                return l;',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p -= n on a pointer must move it',
    find: '                r = rt.types["pointer_array"].handlers["o(-)"].default(rt, l, r);\n                return rt.types["pointer"].handlers["="].default(rt, l, r);',
    replace: '                r = rt.types["pointer_array"].handlers["o(-)"].default(rt, l, r);\n                l.v = r.v;\n                return l;',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p++ on a pointer must move only that pointer (it moved every pointer sharing the array, so int *p = a; p++ changed a)',
    find:
      '                    if (dummy) {\n' +
      '                        return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position++));\n' +
      '                    }\n' +
      '                    else {\n' +
      '                        l.v.position++;\n' +
      '                        return l;\n' +
      '                    }',
    replace:
      '                    if (dummy) {\n' +
      '                        const before = rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position));\n' +
      '                        l.v = rt.makeArrayPointerValue(l.v.target, l.v.position + 1);\n' +
      '                        return before;\n' +
      '                    }\n' +
      '                    else {\n' +
      '                        l.v = rt.makeArrayPointerValue(l.v.target, l.v.position + 1);\n' +
      '                        return l;\n' +
      '                    }',
  },
  {
    file: /JSCPP\/lib\/defaults\.js$/,
    why: 'p-- on a pointer must move only that pointer (it moved every pointer sharing the array, so int *p = a; p++ changed a)',
    find:
      '                    if (dummy) {\n' +
      '                        return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position--));\n' +
      '                    }\n' +
      '                    else {\n' +
      '                        l.v.position--;\n' +
      '                        return l;\n' +
      '                    }',
    replace:
      '                    if (dummy) {\n' +
      '                        const before = rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position));\n' +
      '                        l.v = rt.makeArrayPointerValue(l.v.target, l.v.position - 1);\n' +
      '                        return before;\n' +
      '                    }\n' +
      '                    else {\n' +
      '                        l.v = rt.makeArrayPointerValue(l.v.target, l.v.position - 1);\n' +
      '                        return l;\n' +
      '                    }',
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

        b.onLoad({ filter: /JSCPP[\\/]lib[\\/](includes[\\/]cstdio|includes[\\/]cstring|includes[\\/]shared[\\/]cstring_strcpy|interpreter|defaults)\.js$/ }, (a) => {
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

// ---- sql.js (SQLite) ---------------------------------------------------------
// Small enough to ship with the app (cached on first visit, like the C interpreter).
mkdirSync(join(root, 'public/vendor/sqljs'), { recursive: true });
const sqlFiles = ['sql-wasm.js', 'sql-wasm.wasm'].map((name) => {
  copyFileSync(nm(`sql.js/dist/${name}`), join(root, 'public/vendor/sqljs', name));
  return { name, size: statSync(nm(`sql.js/dist/${name}`)).size };
});
const sqlBytes = sqlFiles.reduce((n, f) => n + f.size, 0);

// ---- PHP (optional pack) ------------------------------------------------------
// Real PHP 8.3 on WebAssembly (@php-wasm). The worker (small) is bundled into public/workers/php.worker.js and is
// precached with the app. The one big WebAssembly file goes to public/php/ and is a download in Settings (like Python).
// Only PHP's "asyncify" build is shipped: it works in every browser; the faster "jspi" build needs a new Chrome and
// would double the download.
mkdirSync(join(root, 'public/php'), { recursive: true });
// the folder name carries the PHP patch version (for example 8_3_36), so find it instead of hard-coding it
const phpAsyncify = nm('@php-wasm/web-8-3/asyncify');
const phpPatchDir = readdirSync(phpAsyncify).find((d) => /^8_3_\d+$/.test(d));
if (!phpPatchDir) throw new Error('PHP 8.3 WebAssembly build not found in @php-wasm/web-8-3');
const phpWasmSrc = join(phpAsyncify, phpPatchDir, 'php_8_3.wasm');
copyFileSync(phpWasmSrc, join(root, 'public/php/php_8_3.wasm'));
const phpWasmSize = statSync(phpWasmSrc).size;

const phpStubs = {
  name: 'php-stubs',
  setup(b) {
    // PHP's loader asks "is JSPI available?". Always answer no, so the asyncify build is used everywhere.
    b.onResolve({ filter: /^wasm-feature-detect$/ }, () => ({ path: 'wfd', namespace: 'php-stub' }));
    b.onLoad({ filter: /^wfd$/, namespace: 'php-stub' }, () => ({
      contents: 'export const jspi = async () => false; export const exceptions = async () => true; export const simd = async () => true;',
      loader: 'js',
    }));
    // Keep only PHP 8.3: every other PHP version is replaced by an empty module (they would add hundreds of MB).
    b.onResolve({ filter: /^@php-wasm\/web-[0-9]-[0-9]$/ }, (a) => (a.path === '@php-wasm/web-8-3' ? undefined : { path: a.path, namespace: 'php-stub' }));
    // Node-only imports and optional extras that the browser never uses (intl extension, ICU data).
    b.onResolve({ filter: /^worker_threads$|\.(so|la|dat)(\?url)?$/ }, (a) => ({ path: a.path, namespace: 'php-stub' }));
    b.onLoad({ filter: /.*/, namespace: 'php-stub' }, (a) => ({
      contents: /^@php-wasm\/web-/.test(a.path)
        ? 'export const getPHPLoaderModule = async () => { throw new Error("This PHP version is not included."); }; export const getIntlExtensionPath = async () => "";'
        : 'export default ""; export const receiveMessageOnPort = undefined;',
      loader: 'js',
    }));
    // The asyncify loader imports its wasm file by name ("./8_3_36/php_8_3.wasm"). Give it a plain file name;
    // php.worker.js turns that into the pack URL (see scripts/php-worker-entry.mjs).
    b.onResolve({ filter: /\.wasm$/ }, () => ({ path: 'php_8_3.wasm', namespace: 'php-wasm-name' }));
    b.onLoad({ filter: /.*/, namespace: 'php-wasm-name' }, () => ({ contents: 'export default "php_8_3.wasm";', loader: 'js' }));
  },
};
await build({
  entryPoints: [join(root, 'scripts/php-worker-entry.mjs')],
  outfile: join(root, 'public/workers/php.worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  logLevel: 'error',
  plugins: [phpStubs],
  define: { 'process.env.VITEST': 'undefined', 'process.env.NODE_ENV': '"production"' },
});
const phpWorkerSize = statSync(join(root, 'public/workers/php.worker.js')).size;

// ---- Pack info for the UI ---------------------------------------------------
mkdirSync(join(root, 'src/generated'), { recursive: true });
const info = {
  python: {
    version: pyVersion,
    files: pyFiles,
    totalBytes: pyFiles.reduce((n, f) => n + f.size, 0),
  },
  c: { bundledBytes: cSize },
  sql: { bundledBytes: sqlBytes },
  php: {
    version: '8.3',
    files: [{ name: 'php_8_3.wasm', size: phpWasmSize }],
    totalBytes: phpWasmSize,
    workerBytes: phpWorkerSize,
  },
};
writeFileSync(join(root, 'src/generated/pack-info.json'), JSON.stringify(info, null, 2));
console.log(`runtimes ready: python ${(info.python.totalBytes / 1048576).toFixed(1)} MB, c ${(cSize / 1024).toFixed(0)} KB, sql ${(sqlBytes / 1024).toFixed(0)} KB, php ${(phpWasmSize / 1048576).toFixed(1)} MB (+ worker ${(phpWorkerSize / 1024).toFixed(0)} KB)`);
