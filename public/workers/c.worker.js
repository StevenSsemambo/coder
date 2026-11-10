/* SayMaCoder C worker (JSCPP, a C/C++ teaching-subset interpreter written in JavaScript).
 * Source is normalised on the main thread before it is sent here. */
importScripts('../vendor/jscpp.js');

const MAX_OUTPUT = 20000; // characters

self.onmessage = (ev) => {
  const { type, id, code, stdin, timeoutMs } = ev.data;
  if (type !== 'run') return;

  let total = 0;
  let truncated = false;
  const write = (text) => {
    if (truncated) return;
    if (total + text.length > MAX_OUTPUT) {
      text = text.slice(0, MAX_OUTPUT - total);
      truncated = true;
      self.postMessage({ type: 'truncated', id });
    }
    total += text.length;
    if (text) self.postMessage({ type: 'chunk', id, stream: 'out', text });
  };

  let error = null;
  try {
    JSCPP.run(code, stdin || '', { stdio: { write }, maxTimeout: timeoutMs || 8000 });
  } catch (e) {
    error = String((e && e.message) || e);
  }
  self.postMessage({ type: 'result', id, error });
};

self.postMessage({ type: 'ready' });
