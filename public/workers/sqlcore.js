/* SayMaCoder SQL core: runs a learner's SQL on SQLite (sql.js) and turns every result into plain text.
 * Shared by the browser worker (sql.worker.js) and the Node tests, so what the tests prove is what ships.
 *
 * The "stdin" of a SQL run is the DATABASE SETUP: a script of CREATE TABLE and INSERT statements that
 * runs first, silently, on a fresh in-memory database. Then the learner's SQL runs, and its output is:
 *   - a text table for every statement that returns rows (SELECT, PRAGMA, ...),
 *   - "(0 rows)" under the header when a SELECT finds nothing,
 *   - EXPLAIN QUERY PLAN prints just one column, "plan" (the readable text), because SQLite's own id, parent and
 *     "notused" columns are internal numbers that change between versions and teach nothing,
 *   - "(N rows changed)" after INSERT, UPDATE, DELETE.
 * Every learner gets a brand new database on every run, so nothing is ever left broken.
 */
(function (root) {
  var MAX_ROWS = 200; // rows shown per result
  var MAX_CHARS = 20000; // whole output

  function cell(v) {
    if (v === null || v === undefined) return 'NULL';
    if (v instanceof Uint8Array) return '<blob ' + v.length + ' bytes>';
    return String(v);
  }

  /** columns: [name], rows: [[value]]. Left-aligned columns, a dashed line under the header, no trailing spaces. */
  function formatTable(columns, rows) {
    var shown = rows.length > MAX_ROWS ? rows.slice(0, MAX_ROWS) : rows;
    var text = shown.map(function (r) { return r.map(cell); });
    var widths = columns.map(function (c, i) {
      var w = String(c).length;
      for (var k = 0; k < text.length; k++) if (text[k][i].length > w) w = text[k][i].length;
      return w;
    });
    var line = function (cells) {
      return cells.map(function (c, i) { return c + ' '.repeat(widths[i] - c.length); }).join(' | ').replace(/\s+$/, '');
    };
    var out = [line(columns.map(String)), widths.map(function (w) { return '-'.repeat(w); }).join('-+-')];
    if (!text.length) out.push('(0 rows)');
    for (var j = 0; j < text.length; j++) out.push(line(text[j]));
    if (rows.length > MAX_ROWS) out.push('... ' + (rows.length - MAX_ROWS) + ' more rows not shown');
    return out.join('\n');
  }

  var CHANGES = /^\s*(insert|update|delete|replace)\b/i;

  /**
   * SQL: the initialised sql.js module. setup: database script (may be empty). code: the learner's SQL.
   * Returns { stdout, error }. error is the SQLite message (for example "no such table: pupils").
   */
  function runSql(SQL, setup, code) {
    var db = new SQL.Database();
    var blocks = [];
    var error = null;
    try {
      if (setup && String(setup).trim()) {
        try {
          db.exec(setup);
        } catch (e) {
          return { stdout: '', error: 'The practice database could not be built: ' + ((e && e.message) || e) };
        }
      }
      var it = db.iterateStatements(String(code || ''));
      var step = it.next();
      while (!step.done) {
        var stmt = step.value;
        var sqlText = stmt.getSQL ? stmt.getSQL() : '';
        var cols = stmt.getColumnNames();
        if (cols.length) {
          var rows = [];
          while (stmt.step()) rows.push(stmt.get());
          var detail = cols.indexOf('detail');
          if (/^\s*explain\s+query\s+plan\b/i.test(sqlText) && detail >= 0) {
            rows = rows.map(function (r) { return [r[detail]]; });
            cols = ['plan'];
          }
          blocks.push(formatTable(cols, rows));
        } else {
          stmt.step();
          if (CHANGES.test(sqlText)) {
            var n = db.getRowsModified();
            blocks.push('(' + n + (n === 1 ? ' row' : ' rows') + ' changed)');
          }
        }
        stmt.free();
        step = it.next();
      }
    } catch (e) {
      error = String((e && e.message) || e);
    } finally {
      try { db.close(); } catch (e) { /* ignore */ }
    }
    var stdout = blocks.join('\n\n');
    if (stdout.length > MAX_CHARS) stdout = stdout.slice(0, MAX_CHARS);
    return { stdout: stdout ? stdout + '\n' : '', error: error };
  }

  var api = { formatTable: formatTable, runSql: runSql, MAX_ROWS: MAX_ROWS };
  root.SQLCore = api;
})(typeof self !== 'undefined' ? self : this);
