# The SQL track: SQL from Zero (SQLite)

Course id `sql-start`, language id `sql`. Files: `src/content/sql/` (lessons and practice data),
`src/content/sql-course.js` (the course list), `tests/solutions-sql.mjs` (reference solutions).
Owner: the SQL account.

Running project: **Nakato's Duuka**, a small shop beside a Ugandan campus gate. Learners meet its
stock book in lesson 1 (the `products` and `customers` tables) and finish by designing, building and
querying the whole shop database, including sales and a Mobile Money ledger.

## Roadmap

`[x]` written and tested, `[ ]` still to write. Lesson ids never change once published (students'
progress is saved under them). Exercise ids start with `sql<lesson number>-`.

**Level 1: Reading data**
- [x] 1. `sql-tables` Tables and your first query (`SELECT * FROM`, rows, columns, several queries)
- [x] 2. `sql-columns` Choosing columns (`AS`, `DISTINCT`)
- [x] 3. `sql-where` Filtering rows (`=`, `<>`, `<`, `AND`, `OR`, `NOT`, `IN`, `BETWEEN`)
- [x] 4. `sql-text-null` Text patterns and missing values (`LIKE`, `%`, `_`, `IS NULL`, why `= NULL` fails)
- [x] 5. `sql-sort` Sorting and paging (`ORDER BY`, `DESC`, `LIMIT`, `OFFSET`)
- [x] 6. `sql-calc` Calculations and functions (`+ - * /`, integer division, `ROUND`, `UPPER`, `LENGTH`, `||`, `CASE`, `COALESCE`)
- [x] 7. `sql-pricelist` Project: Nakato's price list and low-stock report

**Level 2: Summaries**
- [x] 8. `sql-aggregates` `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` (and `COUNT(*)` vs `COUNT(column)`)
- [x] 9. `sql-group` `GROUP BY`
- [x] 10. `sql-having` `HAVING`, and the order of a query (`WHERE` before `GROUP BY` before `HAVING`)
- [x] 11. `sql-dates` Dates and times (`date`, `strftime`, grouping by month)
- [x] 12. `sql-daily-report` Project: the daily sales report (needs the `sales` table, see "Data")

**Level 3: Changing data and building tables**
- [x] 13. `sql-create` `CREATE TABLE`, data types in SQLite
- [x] 14. `sql-insert` `INSERT` (one row, many rows, naming columns)
- [x] 15. `sql-update-delete` `UPDATE`, `DELETE` (and the danger of forgetting `WHERE`)
- [x] 16. `sql-constraints` `PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`
- [x] 17. `sql-alter` `ALTER TABLE`, `DROP TABLE`
- [x] 18. `sql-build-duuka` Project: build the duuka database from nothing

**Level 4: Many tables**
- [ ] 19. `sql-relations` Why split tables; one-to-many; foreign keys (and `PRAGMA foreign_keys = ON`)
- [ ] 20. `sql-inner-join` `INNER JOIN`
- [ ] 21. `sql-left-join` `LEFT JOIN`, finding rows with no match
- [ ] 22. `sql-join-agg` Joins plus `GROUP BY`; joining three tables
- [ ] 23. `sql-subqueries` Subqueries (`IN (SELECT ...)`, in `FROM`, correlated)
- [ ] 24. `sql-many-to-many` Many-to-many and junction tables; self joins
- [ ] 25. `sql-statement` Project: a customer statement

**Level 5: Market-ready SQL**
- [ ] 26. `sql-design` Designing a schema: normalisation in plain words, avoiding repeated data
- [ ] 27. `sql-indexes` Indexes and `EXPLAIN QUERY PLAN`
- [ ] 28. `sql-views` Views
- [ ] 29. `sql-transactions` Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) with a Mobile Money transfer
- [ ] 30. `sql-cte-window` `WITH` (CTEs), window functions (`ROW_NUMBER`, running totals)
- [ ] 31. `sql-triggers-upsert` Triggers, `INSERT ... ON CONFLICT`, `RETURNING`
- [ ] 32. `sql-from-apps` Using SQL from an app (SQL injection and parameters, in plain words; no runtime needed)
- [ ] 33. `sql-capstone` Capstone: the Mobile Money ledger

## How SQL runs in the app (tested, not assumed)

SQL runs on **SQLite 3.54.1 compiled to WebAssembly (sql.js)**: about 700 KB (`sql-wasm.js` plus
`sql-wasm.wasm`), shipped with the app and precached like the C interpreter. No separate download,
works with no internet. It runs in a Web Worker (`public/workers/sql.worker.js`).

The engine is one small file, `public/workers/sqlcore.js`. The worker and the Node tests both load
that same file, so what the tests prove is what ships. Rules:

- **The "input" of a SQL run is the practice database.** It is a `CREATE TABLE` and `INSERT` script
  that runs first, silently, on a fresh in-memory database. Then the learner's SQL runs. Every run
  starts from a brand new database, so a learner can never leave the practice data broken. In an
  exercise write `usesInput: true`, `sampleInput: <setup script>`, and give each test its own `input`
  (a different shop in the hidden test catches answers that hard-code the visible result).
- **Output is plain text**, so the existing grader, `try`, `predict`, `fill`, `reorder` and `bug`
  blocks work unchanged. A query that returns rows prints a table: header, a dashed line, one line per
  row, left-aligned, no trailing spaces, `NULL` for missing values, `(0 rows)` when nothing matches.
  `INSERT`, `UPDATE` and `DELETE` print `(N rows changed)`. `CREATE`, `DROP` and `ALTER` print nothing.
  Several queries print several tables with a blank line between. At most 200 rows are shown.
- **Expected outputs are built from JavaScript data with `tbl()`** (`src/content/sql/shared.js`), never
  by running the SQL. The test "lesson table helper matches the app's table format" keeps `tbl()` and
  the engine in step.
- Lessons that change data show the change by running a `SELECT` in the same run, because every run starts from a
  fresh database. Exercises that build tables need no input at all (leave `usesInput` off); hidden tests can still
  pass a setup script to prove the answer does not depend on an empty database. `PRAGMA table_info(t)` prints the
  columns, types, `notnull`, default and `pk`, and is the way to grade a `CREATE TABLE`.
- An error stops the run at that statement. Output printed before the error is kept. Error messages are
  translated by the `sql-*` rules in `src/lib/errors.js` (English and Kiswahili).
- A runaway query (for example an endless recursive `WITH`) is stopped by the 8 second backstop in
  `src/lib/runners.js`, the same as an endless Python loop. This is not covered by an automated test,
  because a synchronous endless loop would hang the test run itself.

### What works (each line was run on the shipped engine)

`SELECT`, `WHERE`, `ORDER BY`, `LIMIT`/`OFFSET`, `GROUP BY`/`HAVING`, `DISTINCT`, `INNER`, `LEFT`,
`RIGHT` and `FULL` joins, subqueries, `WITH` and `WITH RECURSIVE`, window functions, `CASE`, `COALESCE`,
`group_concat`, `date()` and `strftime()`, JSON functions, views, triggers, indexes and
`EXPLAIN QUERY PLAN`, `ALTER TABLE` (add and drop column), `INSERT ... RETURNING`, `ON CONFLICT`
(upsert), `BEGIN`/`COMMIT`/`ROLLBACK`, `PRAGMA table_info`, `sqlite_master`, `CHECK`, `PRIMARY KEY`,
`NOT NULL`, `UNIQUE`, `DEFAULT`, `FOREIGN KEY`.

### What differs from other databases (say so honestly in lessons where it matters)

- **Foreign keys are OFF by default in SQLite.** A learner must write `PRAGMA foreign_keys = ON;` at the
  top of the run for `FOREIGN KEY` to be enforced (tested: without it a row pointing at a missing parent
  is accepted). Lesson 19 teaches this. Decide before writing it whether the practice database turns it on.
- `=` on text is **case sensitive** (`'food' = 'Food'` is false), `LIKE` is case insensitive for English letters.
- `7 / 2` is `3` (integer division); `7 / 2.0` is `3.5`.
- SQLite types are flexible (a type name is a hint, not a rule). Teach the common types, say so once.
- No `TOP` (use `LIMIT`), no `AUTO_INCREMENT` (an `INTEGER PRIMARY KEY` numbers itself), no stored
  procedures, no users or `GRANT`. Teach `||` for joining text (it works in every database; with a NULL
  piece the result is NULL). This SQLite also has `CONCAT()`, which treats NULL as empty. Say when something
  works differently in MySQL or PostgreSQL, because learners will meet those next.
- Not available: FTS5 full-text search (`no such module: fts5`). Do not teach it.

## Data

`src/content/sql/shared.js` holds the practice data: `products` (12 rows, with `NULL` suppliers and one
out-of-stock item) and `customers` (6 rows), a second set of different rows for hidden tests
(`PRODUCTS_B`, `CUSTOMERS_B`), and helpers (`tbl`, `tableScript`, `duukaSetup`, `productView`, ...).
`sales` (15 rows, `SALES_B` for hidden tests) arrived in Level 2: `id, sale_date, product_id, qty, amount, method`.
`amount` is the UGX paid, so reports need no join until Level 4. Lessons 11 and 12 use `DUUKA_S` / `DUUKA_S_B`
(`duukaSetup(products, customers, sales)`); lessons 1 to 10 keep using `DUUKA` without sales. `suppliers` (3 rows, `SUPPLIERS_B` for hidden tests, `SUP`/`SUP_B` setups) arrived in lesson 14. Level 3 also defines
its own small tables (`members`, `loans`, the project's `products`) inside `level3.js`. Add new tables as new
exports and do not change existing rows, or finished lessons' expected outputs change. GROUP BY output is
compared with ORDER BY in every solution, never with the engine's natural group order.

## Lesson style for SQL

Same rules as every track (`docs/TRACKS.md`), plus:

- Every query shown must **run** on the practice data, and its output is in the lesson (`output`) so the
  tests prove it. Show the result right after the query, so the learner connects the words to the rows.
- Teach SQL as asking questions of a shop, not as syntax. Each lesson starts with a customer or Nakato
  asking something a real shopkeeper would ask.
- A `bug` block needs a real **error**. Mistakes that give a wrong answer but no error (`= NULL`, a
  missing comma that turns a column into a nickname, wrong capitals) go in `mistakes` with `logic: true`.
- Use `INTEGER` UGX amounts. Avoid decimals unless the lesson is about them.
- Write SQL keywords in capitals in lessons so they stand out from names, and say that SQL does not require it.
- Answers do not depend on row order unless the query has `ORDER BY`. Until lesson 5, only use queries whose
  order is the natural one, and say that order is not promised.

## Engine files touched by this track (all additive; engine owner please review)

- `public/workers/sqlcore.js`, `public/workers/sql.worker.js` (new).
- `scripts/prepare-runtimes.mjs`: copies `sql-wasm.js` and `sql-wasm.wasm` to `public/vendor/sqljs/`.
- `vite.config.js`: `wasm` added to the precache patterns so SQLite works offline (`pyodide/**` stays ignored).
- `package.json` and `package-lock.json`: `sql.js` and `@codemirror/lang-sql` (CI runs `npm ci`, so the lock file must ship).
- `src/lib/runners.js`, `editor.js`, `symbols.js`, `errors.js`; `src/ui/components.js` (the input box says
  "Practice database" for SQL), `lesson-blocks.js`, `views/exercise.js`, `views/learn.js` (one-line label changes).
- `tests/run.mjs` (SQL runner, 11 error cases, SQL engine checks), `tests/solutions.mjs` (one merge line),
  `src/content/index.js` (registry line).

## Engine requests (for the engine owner)

1. **A table viewer for the practice database.** The input box shows the setup script, which works but
   is noisy on a phone. A small "Tables" panel (one tab per table, built from `sqlite_master`) would let
   learners see the data without reading `INSERT` lines.
2. Real-phone test of the SQLite worker on low-end Android (so far only a simulated worker in Node).
3. Show query results as a real scrollable table instead of preformatted text (wide tables scroll sideways today).
