/* SayMaCoder: runs "full C" programs on picoc compiled to WebAssembly (see tools/picoc-wasm/README.md).
 *
 * ONE classic script, used by the worker (cx.worker.js) and by the tests (tests/run.mjs), so the tests run the
 * very same code the app runs. It provides a tiny WASI layer with an in-memory file system: programs can use
 * fopen, fprintf, fgets and friends on files that live only for the duration of one run.
 *
 *   CX.run(module, { source, stdin, files, onStdout, onStderr, maxFileBytes })
 *     -> { exitCode, stdout, stderr, files, trap }
 *   `module` is a compiled WebAssembly.Module. `files` is { "name.txt": "text" } to start with.
 */
(function (root) {
  'use strict';

  const ERRNO = { OK: 0, BADF: 8, EXIST: 20, INVAL: 28, ISDIR: 31, NOENT: 44, NOSYS: 52, NOTDIR: 54, NOTCAPABLE: 76, NOSPC: 51 };
  const enc = new TextEncoder();

  class ExitSignal {
    constructor(code) {
      this.code = code;
    }
  }

  function normPath(p) {
    const parts = [];
    for (const seg of String(p).split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') parts.pop();
      else parts.push(seg);
    }
    return parts.join('/');
  }

  function run(module, opts = {}) {
    const source = opts.source || '';
    const maxFileBytes = opts.maxFileBytes || 4 * 1024 * 1024;
    const stdinBytes = enc.encode(opts.stdin || '');
    let stdinPos = 0;

    // The in-memory file system: path (no leading slash) -> { data: Uint8Array, size }
    const fs = new Map();
    const putFile = (name, text) => {
      const data = typeof text === 'string' ? enc.encode(text) : text;
      fs.set(normPath(name), { data, size: data.length });
    };
    putFile('main.c', source);
    for (const [name, text] of Object.entries(opts.files || {})) putFile(name, text);

    // File descriptors. 0, 1, 2 are the console; 3 is the preopened root directory.
    const fds = new Map();
    fds.set(0, { kind: 'stdin' });
    fds.set(1, { kind: 'stdout' });
    fds.set(2, { kind: 'stderr' });
    fds.set(3, { kind: 'dir', path: '' });
    let nextFd = 4;

    const out = { 1: '', 2: '' };
    const decoders = { 1: new TextDecoder(), 2: new TextDecoder() };
    const emit = (fd, bytes) => {
      const text = decoders[fd].decode(bytes, { stream: true });
      if (!text) return;
      out[fd] += text;
      const cb = fd === 1 ? opts.onStdout : opts.onStderr;
      if (cb) cb(text);
    };

    let memory = null;
    const view = () => new DataView(memory.buffer);
    const u8 = () => new Uint8Array(memory.buffer);
    const str = (ptr, len) => new TextDecoder().decode(u8().subarray(ptr, ptr + len));

    const args = ['picoc', '/main.c'];
    const env = ['STACKSIZE=1000000'];
    const packStrings = (list, ptrsAt, bufAt) => {
      const dv = view();
      let p = bufAt;
      list.forEach((s, i) => {
        dv.setUint32(ptrsAt + i * 4, p, true);
        const bytes = enc.encode(s + '\0');
        u8().set(bytes, p);
        p += bytes.length;
      });
    };
    const sizes = (list) => list.reduce((n, s) => n + enc.encode(s).length + 1, 0);

    const grow = (file, need) => {
      if (need > maxFileBytes) return false;
      if (need > file.data.length) {
        const bigger = new Uint8Array(Math.max(need, file.data.length * 2, 64));
        bigger.set(file.data.subarray(0, file.size));
        file.data = bigger;
      }
      return true;
    };

    const wasi = {
      args_sizes_get(argcPtr, sizePtr) {
        const dv = view();
        dv.setUint32(argcPtr, args.length, true);
        dv.setUint32(sizePtr, sizes(args), true);
        return ERRNO.OK;
      },
      args_get(argvPtr, bufPtr) {
        packStrings(args, argvPtr, bufPtr);
        return ERRNO.OK;
      },
      environ_sizes_get(countPtr, sizePtr) {
        const dv = view();
        dv.setUint32(countPtr, env.length, true);
        dv.setUint32(sizePtr, sizes(env), true);
        return ERRNO.OK;
      },
      environ_get(envPtr, bufPtr) {
        packStrings(env, envPtr, bufPtr);
        return ERRNO.OK;
      },
      clock_time_get(id, precision, outPtr) {
        const ns = BigInt(Math.round((typeof performance !== 'undefined' ? performance.timeOrigin + performance.now() : Date.now()) * 1e6));
        view().setBigUint64(outPtr, ns, true);
        return ERRNO.OK;
      },
      random_get(ptr, len) {
        const a = u8();
        for (let i = 0; i < len; i++) a[ptr + i] = Math.floor(Math.random() * 256);
        return ERRNO.OK;
      },
      proc_exit(code) {
        throw new ExitSignal(code);
      },
      fd_prestat_get(fd, outPtr) {
        if (fd !== 3) return ERRNO.BADF;
        const dv = view();
        dv.setUint8(outPtr, 0);
        dv.setUint32(outPtr + 4, 1, true); // name "/"
        return ERRNO.OK;
      },
      fd_prestat_dir_name(fd, ptr, len) {
        if (fd !== 3) return ERRNO.BADF;
        u8()[ptr] = 47; // "/"
        return ERRNO.OK;
      },
      fd_fdstat_get(fd, outPtr) {
        const f = fds.get(fd);
        if (!f) return ERRNO.BADF;
        const dv = view();
        const type = f.kind === 'dir' ? 3 : f.kind === 'file' ? 4 : 2; // directory, regular file, character device
        dv.setUint8(outPtr, type);
        dv.setUint16(outPtr + 2, 0, true);
        dv.setBigUint64(outPtr + 8, 0xffffffffffffffffn, true); // all rights
        dv.setBigUint64(outPtr + 16, 0xffffffffffffffffn, true);
        return ERRNO.OK;
      },
      fd_fdstat_set_flags() {
        return ERRNO.OK;
      },
      fd_filestat_get(fd, outPtr) {
        const f = fds.get(fd);
        if (!f) return ERRNO.BADF;
        const dv = view();
        for (let i = 0; i < 64; i += 8) dv.setBigUint64(outPtr + i, 0n, true);
        dv.setUint8(outPtr + 16, f.kind === 'dir' ? 3 : f.kind === 'file' ? 4 : 2);
        dv.setBigUint64(outPtr + 32, BigInt(f.kind === 'file' ? f.file.size : 0), true);
        return ERRNO.OK;
      },
      path_filestat_get(fd, flags, pathPtr, pathLen, outPtr) {
        const p = normPath(str(pathPtr, pathLen));
        const dv = view();
        for (let i = 0; i < 64; i += 8) dv.setBigUint64(outPtr + i, 0n, true);
        if (p === '') {
          dv.setUint8(outPtr + 16, 3);
          return ERRNO.OK;
        }
        const file = fs.get(p);
        if (!file) return ERRNO.NOENT;
        dv.setUint8(outPtr + 16, 4);
        dv.setBigUint64(outPtr + 32, BigInt(file.size), true);
        return ERRNO.OK;
      },
      path_open(dirfd, dirflags, pathPtr, pathLen, oflags, rightsBase, rightsInh, fdflags, outPtr) {
        const dir = fds.get(dirfd);
        if (!dir || dir.kind !== 'dir') return ERRNO.BADF;
        const p = normPath(dir.path + '/' + str(pathPtr, pathLen));
        const CREAT = 1;
        const DIRECTORY = 2;
        const EXCL = 4;
        const TRUNC = 8;
        if (oflags & DIRECTORY || p === '') {
          fds.set(nextFd, { kind: 'dir', path: p });
          view().setUint32(outPtr, nextFd++, true);
          return ERRNO.OK;
        }
        let file = fs.get(p);
        if (!file) {
          if (!(oflags & CREAT)) return ERRNO.NOENT;
          file = { data: new Uint8Array(64), size: 0 };
          fs.set(p, file);
        } else if (oflags & CREAT && oflags & EXCL) {
          return ERRNO.EXIST;
        }
        if (oflags & TRUNC) file.size = 0;
        const APPEND = 1;
        fds.set(nextFd, { kind: 'file', file, pos: 0, append: !!(Number(fdflags) & APPEND) });
        view().setUint32(outPtr, nextFd++, true);
        return ERRNO.OK;
      },
      path_unlink_file(fd, pathPtr, pathLen) {
        const p = normPath(str(pathPtr, pathLen));
        return fs.delete(p) ? ERRNO.OK : ERRNO.NOENT;
      },
      path_rename(fd, oldPtr, oldLen, fd2, newPtr, newLen) {
        const a = normPath(str(oldPtr, oldLen));
        const b = normPath(str(newPtr, newLen));
        const file = fs.get(a);
        if (!file) return ERRNO.NOENT;
        fs.delete(a);
        fs.set(b, file);
        return ERRNO.OK;
      },
      path_create_directory() {
        return ERRNO.NOSYS;
      },
      path_remove_directory() {
        return ERRNO.NOSYS;
      },
      fd_readdir() {
        return ERRNO.NOSYS;
      },
      fd_close(fd) {
        if (fd < 3) return ERRNO.OK;
        return fds.delete(fd) ? ERRNO.OK : ERRNO.BADF;
      },
      fd_sync() {
        return ERRNO.OK;
      },
      fd_datasync() {
        return ERRNO.OK;
      },
      fd_advise() {
        return ERRNO.OK;
      },
      fd_seek(fd, offset, whence, outPtr) {
        const f = fds.get(fd);
        if (!f) return ERRNO.BADF;
        if (f.kind !== 'file') return 70; // ESPIPE
        const off = Number(offset);
        const base = whence === 0 ? 0 : whence === 1 ? f.pos : f.file.size;
        const target = base + off;
        if (target < 0) return ERRNO.INVAL;
        f.pos = target;
        view().setBigUint64(outPtr, BigInt(target), true);
        return ERRNO.OK;
      },
      fd_tell(fd, outPtr) {
        const f = fds.get(fd);
        if (!f || f.kind !== 'file') return ERRNO.BADF;
        view().setBigUint64(outPtr, BigInt(f.pos), true);
        return ERRNO.OK;
      },
      fd_write(fd, iovs, iovsLen, nwrittenPtr) {
        const f = fds.get(fd);
        if (!f) return ERRNO.BADF;
        const dv = view();
        let total = 0;
        for (let i = 0; i < iovsLen; i++) {
          const ptr = dv.getUint32(iovs + i * 8, true);
          const len = dv.getUint32(iovs + i * 8 + 4, true);
          const chunk = u8().slice(ptr, ptr + len);
          if (f.kind === 'stdout') emit(1, chunk);
          else if (f.kind === 'stderr') emit(2, chunk);
          else if (f.kind === 'file') {
            if (f.append) f.pos = f.file.size;
            if (!grow(f.file, f.pos + len)) return ERRNO.NOSPC;
            f.file.data.set(chunk, f.pos);
            f.pos += len;
            if (f.pos > f.file.size) f.file.size = f.pos;
          } else return ERRNO.BADF;
          total += len;
        }
        dv.setUint32(nwrittenPtr, total, true);
        return ERRNO.OK;
      },
      fd_read(fd, iovs, iovsLen, nreadPtr) {
        const f = fds.get(fd);
        if (!f) return ERRNO.BADF;
        const dv = view();
        let total = 0;
        for (let i = 0; i < iovsLen; i++) {
          const ptr = dv.getUint32(iovs + i * 8, true);
          const len = dv.getUint32(iovs + i * 8 + 4, true);
          let n = 0;
          if (f.kind === 'stdin') {
            n = Math.min(len, stdinBytes.length - stdinPos);
            u8().set(stdinBytes.subarray(stdinPos, stdinPos + n), ptr);
            stdinPos += n;
          } else if (f.kind === 'file') {
            n = Math.max(0, Math.min(len, f.file.size - f.pos));
            u8().set(f.file.data.subarray(f.pos, f.pos + n), ptr);
            f.pos += n;
          } else return ERRNO.BADF;
          total += n;
          if (n < len) break;
        }
        dv.setUint32(nreadPtr, total, true);
        return ERRNO.OK;
      },
    };

    let exitCode = 0;
    let trap = null;
    try {
      const instance = new WebAssembly.Instance(module, {
        wasi_snapshot_preview1: new Proxy(wasi, {
          get: (t, name) => t[name] || (() => ERRNO.NOSYS),
        }),
        // picoc_exit ends the program. Any other C function the libc does not provide (tmpfile, ...) becomes a stub that returns 0.
        env: new Proxy(
          {
            picoc_exit(code) {
              throw new ExitSignal(code);
            },
          },
          { get: (t, name) => t[name] || (() => 0) },
        ),
      });
      memory = instance.exports.memory;
      instance.exports._start();
    } catch (e) {
      if (e instanceof ExitSignal) exitCode = e.code;
      else {
        exitCode = 1;
        const msg = String((e && e.message) || e);
        trap = /memory|allocation|out of/i.test(msg)
          ? 'The program used too much memory (a function calling itself for ever, or a loop that calls malloc without stopping).'
          : /null function|signature mismatch/i.test(msg)
            ? 'The program crashed: it used a file that failed to open (fopen returned NULL).'
            : /unreachable|call stack|stack/i.test(msg)
              ? 'The program crashed (too many nested calls or a fatal error).'
              : msg;
      }
    }
    // Flush any partial UTF-8 sequence.
    for (const fd of [1, 2]) {
      const rest = decoders[fd].decode();
      if (rest) {
        out[fd] += rest;
        (fd === 1 ? opts.onStdout : opts.onStderr)?.(rest);
      }
    }
    const files = {};
    for (const [name, f] of fs) if (name !== 'main.c') files[name] = new TextDecoder().decode(f.data.subarray(0, f.size));
    return { exitCode, stdout: out[1], stderr: out[2], files, trap };
  }

  root.CX = { run };
})(typeof self !== 'undefined' ? self : globalThis);
