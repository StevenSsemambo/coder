/* SayMaCoder SQL worker (SQLite compiled to WebAssembly by sql.js). Works with no internet.
 * stdin carries the practice database (see sqlcore.js). */
importScripts('../vendor/sqljs/sql-wasm.js', 'sqlcore.js');

self.onmessage = (ev) => {
  const { type, id, code, stdin } = ev.data;
  if (type !== 'run') return;
  ready.then(
    (SQL) => {
      const res = self.SQLCore.runSql(SQL, stdin, code);
      if (res.stdout) self.postMessage({ type: 'chunk', id, stream: 'out', text: res.stdout });
      self.postMessage({ type: 'result', id, error: res.error });
    },
    (e) => self.postMessage({ type: 'result', id, error: 'SQLite could not start: ' + ((e && e.message) || e) }),
  );
};

const ready = initSqlJs({ locateFile: (file) => '../vendor/sqljs/' + file });
ready.then(
  () => self.postMessage({ type: 'ready' }),
  (e) => self.postMessage({ type: 'init-error', message: 'SQLite could not start: ' + ((e && e.message) || e) }),
);
