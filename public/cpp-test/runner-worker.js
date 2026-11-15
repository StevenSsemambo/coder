// Runner worker for the C++ phone test: runs ONE compiled WebAssembly program with a small WASI layer
// (stdout, stderr, stdin from a string, clock, random). The page creates a new runner for every run and
// terminates it after a time limit, which is the only reliable way to stop a program that never ends.

class ExitError extends Error {
  constructor(code) { super('exit ' + code); this.code = code; }
}

const MAX_OUTPUT = 1 << 20;

self.onmessage = async (e) => {
  const { wasm, stdin } = e.data;
  const t0 = performance.now();
  const decoder = [new TextDecoder(), new TextDecoder(), new TextDecoder()];
  const outText = ['', '', ''];
  const stubbed = [];
  let memory = null;
  try {
    const module = await WebAssembly.compile(wasm);
    const mem = () => new DataView(memory.buffer);
    const u8 = () => new Uint8Array(memory.buffer);
    const input = new TextEncoder().encode(stdin || '');
    let inPos = 0;
    const wasi = {
      args_sizes_get(argc, size) { const v = mem(); v.setUint32(argc, 0, true); v.setUint32(size, 0, true); return 0; },
      args_get() { return 0; },
      environ_sizes_get(count, size) { const v = mem(); v.setUint32(count, 0, true); v.setUint32(size, 0, true); return 0; },
      environ_get() { return 0; },
      clock_res_get(id, ptr) { mem().setBigUint64(ptr, 1000n, true); return 0; },
      clock_time_get(id, precision, ptr) {
        const ns = id === 0 ? BigInt(Date.now()) * 1000000n : BigInt(Math.floor(performance.now() * 1e6));
        mem().setBigUint64(ptr, ns, true);
        return 0;
      },
      random_get(ptr, len) {
        const a = u8().subarray(ptr, ptr + len);
        for (let i = 0; i < len; i += 65536) crypto.getRandomValues(a.subarray(i, Math.min(len, i + 65536)));
        return 0;
      },
      fd_write(fd, iovs, n, written) {
        if (fd !== 1 && fd !== 2) return 8;
        const v = mem();
        let total = 0;
        for (let i = 0; i < n; i++) {
          const ptr = v.getUint32(iovs + i * 8, true);
          const len = v.getUint32(iovs + i * 8 + 4, true);
          if (outText[fd].length < MAX_OUTPUT) outText[fd] += decoder[fd].decode(u8().subarray(ptr, ptr + len), { stream: true });
          total += len;
        }
        v.setUint32(written, total, true);
        return 0;
      },
      fd_read(fd, iovs, n, nread) {
        if (fd !== 0) return 8;
        const v = mem();
        let total = 0;
        for (let i = 0; i < n; i++) {
          const ptr = v.getUint32(iovs + i * 8, true);
          const len = v.getUint32(iovs + i * 8 + 4, true);
          const chunk = input.subarray(inPos, inPos + len);
          u8().set(chunk, ptr);
          inPos += chunk.length;
          total += chunk.length;
          if (chunk.length < len) break;
        }
        v.setUint32(nread, total, true);
        return 0;
      },
      fd_close() { return 0; },
      fd_seek() { return 70; },
      fd_fdstat_get(fd, ptr) {
        if (fd > 2) return 8;
        const v = mem();
        v.setUint8(ptr, 2);
        v.setUint16(ptr + 2, 0, true);
        v.setBigUint64(ptr + 8, 0xffffffffffffffffn, true);
        v.setBigUint64(ptr + 16, 0xffffffffffffffffn, true);
        return 0;
      },
      fd_fdstat_set_flags() { return 0; },
      fd_filestat_get(fd, ptr) {
        if (fd > 2) return 8;
        u8().fill(0, ptr, ptr + 64);
        u8()[ptr + 16] = 2;
        return 0;
      },
      fd_prestat_get() { return 8; },
      fd_prestat_dir_name() { return 8; },
      proc_exit(code) { throw new ExitError(code); },
      sched_yield() { return 0; },
    };
    const needed = WebAssembly.Module.imports(module);
    const foreign = needed.filter((i) => i.module !== 'wasi_snapshot_preview1').map((i) => i.module + '.' + i.name);
    if (foreign.length) throw new Error('The program needs imports this runner does not provide: ' + foreign.join(', '));
    for (const imp of needed) {
      if (!wasi[imp.name]) {
        wasi[imp.name] = () => { stubbed.push(imp.name); return 52; };
      }
    }
    const instance = await WebAssembly.instantiate(module, { wasi_snapshot_preview1: wasi });
    memory = instance.exports.memory;
    let code = 0;
    try {
      instance.exports._start();
    } catch (ex) {
      if (ex instanceof ExitError) code = ex.code; else throw ex;
    }
    self.postMessage({ ok: true, code, ms: Math.round(performance.now() - t0), stdout: outText[1], stderr: outText[2], stubbed: [...new Set(stubbed)] });
  } catch (ex) {
    self.postMessage({ ok: false, ms: Math.round(performance.now() - t0), stdout: outText[1], stderr: outText[2], message: String(ex && ex.message || ex), stubbed: [...new Set(stubbed)] });
  }
};
