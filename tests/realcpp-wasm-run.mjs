// Runs one compiled WebAssembly program with the process's own stdin, stdout and stderr (used by realcpp.mjs).
import { readFileSync } from 'node:fs';
import { WASI } from 'node:wasi';

const wasi = new WASI({ version: 'preview1', args: ['program'], env: {}, stdin: 0, stdout: 1, stderr: 2, returnOnExit: true });
const module = await WebAssembly.compile(readFileSync(process.argv[2]));
const instance = await WebAssembly.instantiate(module, { wasi_snapshot_preview1: wasi.wasiImport });
process.exitCode = wasi.start(instance);
