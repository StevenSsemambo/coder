# picoc.wasm: the "full C" runtime

The C course (lessons 1 to 32) runs on JSCPP, a small teaching interpreter that cannot do structs, `malloc` or
files. The second C course (`c-advanced`) runs on **picoc** compiled to WebAssembly (560 KB, offline, no server).

* `src/` is [picoc](https://github.com/jpoirier/picoc) (BSD licence, commit `a97d94f`) with our patches:
  * No `setjmp`/`longjmp` (WASI has none): errors and `exit` call the JS import `env.picoc_exit`.
  * Error messages go to stderr; `fopen`, `fgets`, `fscanf` and friends use the in-memory file system in
    `public/workers/cxcore.js`.
  * **Struct initialisers** `struct P p = {1, "x", 3};` (also nested, and arrays of structs). Upstream cannot.
  * **Several members on one line** `int x, y;` inside a struct. Upstream cannot.
  * **Typedef'd names in `for`** `for (Node *p = head; ...)`. Upstream left the `;` unread.
  * **Array initialiser count pass** (a nested initialiser crashed picoc's stack check in skip mode).
  * **`const`, `volatile`, `restrict`** are skipped by the lexer (they are not enforced).
  * Removed `unistd.h` and readline.
* `picoc.wasm` is the committed build. `scripts/prepare-runtimes.mjs` copies it to `public/vendor/picoc.wasm`.
* `build.sh` rebuilds it (see the top of the file for the sysroot download).
* `public/workers/cxcore.js` is the tiny WASI layer (console and an in-memory file system). It is one file used by the
  worker and by `tests/run.mjs`, so the tests run the same code as the app.

What picoc cannot do (verified by hand, listed in `docs/C-TRACK.md`): function pointers, struct/union
**definitions inside functions** (they must be global), and anything needing a real OS (`fork`, sockets, `system`).
