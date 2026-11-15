// Runs the SHIPPED Java worker (public/workers/java.worker.js) inside a Node thread, so the tests exercise exactly
// the code the app runs. Loaded by tests/java-node.mjs; not meant to be run by hand.
import { parentPort, workerData } from 'node:worker_threads';
import fs from 'node:fs';

const root = workerData.root;
globalThis.self = globalThis;
globalThis.__JAVA_BASE__ = `${root}/public/java/`;
const realFetch = globalThis.fetch;
globalThis.fetch = async (u, o) => (typeof u === 'string' && !/^https?:/.test(u) ? new Response(fs.readFileSync(u)) : realFetch(u, o));
globalThis.importScripts = (u) => (0, eval)(fs.readFileSync(u, 'utf8'));
globalThis.postMessage = (m) => parentPort.postMessage(m);
(0, eval)(fs.readFileSync(`${root}/public/workers/java.worker.js`, 'utf8'));
parentPort.on('message', (data) => self.onmessage({ data }));
