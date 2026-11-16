// SQL, Level 5: Market-ready SQL (continued). Lessons 30 to 33 (CTEs and window functions, triggers and upsert,
// SQL from apps and injection, the Mobile Money ledger capstone).
// Prose uses double-quoted strings. SQL code uses plain template literals.
// Expected outputs are computed from plain JavaScript data, never from the SQL itself.
import { DUUKA_S, DUUKA_S_B, PRODUCTS, PRODUCTS_B, SALES, SALES_B, tbl, tables, tableScript, changed } from './shared.js';
import { cmp, sum } from './world.js';

const LEVEL = 'Level 5: Market-ready SQL';

// ---------------------------------------------------------------- lesson 30
/** [[date, takings]] in date order. sale row: 0 id, 1 sale_date, 2 product_id, 3 qty, 4 amount, 5 method */
const daily = (S) => {
  const m = new Map();
  for (const r of S) m.set(r[1], (m.get(r[1]) || 0) + r[4]);
  return [...m.entries()].sort((a, b) => cmp(a[0], b[0]));
};
const running = (S) => { let t = 0; return daily(S).map(([d, x]) => [d, x, (t += x)]); };
const change = (S) => daily(S).map(([d, x], i, a) => [d, x, i === 0 ? null : x - a[i - 1][1]]);
const topPerCategory = (P) => [...new Set(P.map((p) => p[2]))].sort(cmp).map((c) => { const best = P.filter((p) => p[2] === c).sort((a, b) => b[3] - a[3])[0]; return [c, best[1], best[3]]; });
const DAILY_CTE = 'WITH daily AS (\n  SELECT sale_date, SUM(amount) AS takings\n  FROM sales\n  GROUP BY sale_date\n)';

// ---------------------------------------------------------------- lesson 31
const ITEMS_A = [[1, 'Sugar', 4500], [2, 'Rice', 3800]];
const ITEMS_B = [[1, 'Beans', 4200], [2, 'Pencil', 300], [3, 'Notebook', 1500]];
const itemsSetup = (rows) => `${tableScript('items', 'id INTEGER PRIMARY KEY, name TEXT UNIQUE, price INTEGER', rows)}\n\nCREATE TABLE price_log (id INTEGER PRIMARY KEY, item_id INTEGER, old_price INTEGER, new_price INTEGER);`;
const STOCK_A = [['Rice', 35], ['Sugar', 20]];
const STOCK_B = [['Beans', 14], ['Pencil', 200]];
const stockSetup = (rows, withLog = false) => `${tableScript('stock', 'item TEXT PRIMARY KEY, qty INTEGER NOT NULL', rows)}${withLog ? '\n\nCREATE TABLE stock_log (id INTEGER PRIMARY KEY, item TEXT, old_qty INTEGER, new_qty INTEGER);' : ''}`;

// ---------------------------------------------------------------- lesson 32
const USERS_A = [[1, 'Amina', 'a1'], [2, 'Brian', 'b2'], [3, 'Grace', 'g3'], [4, "O'Brien", 'o4']];
const USERS_B = [[1, 'Sarah', 's1'], [2, 'Ruth', 'r2']];
const usersSetup = (rows) => tableScript('users', 'id INTEGER PRIMARY KEY, name TEXT, secret TEXT', rows);
const INPUTS_A = [[1, 'Amina'], [2, "x' OR '1'='1"], [3, 'Joe; DROP TABLE t'], [4, 'Mary Ann'], [5, "O'Brien"], [6, 'John3']];
const INPUTS_B = [[1, 'Sarah'], [2, 'Peter Pan'], [3, 'a=b'], [4, 'Ruth;']];
const inputsSetup = (rows) => tableScript('inputs', 'id INTEGER PRIMARY KEY, v TEXT', rows);
const clean = (v) => (/^[A-Za-z ]*$/.test(v) ? 1 : 0);
const formSetup = (name, secret) => `CREATE TABLE form (name TEXT, secret TEXT);\nINSERT INTO form VALUES ('${name}', '${secret}');`;

// ---------------------------------------------------------------- lesson 33
const LEDGER_SCHEMA = `CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  owner TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0)
);
CREATE TABLE transfers (
  id INTEGER PRIMARY KEY,
  from_id INTEGER NOT NULL REFERENCES accounts(id),
  to_id INTEGER NOT NULL REFERENCES accounts(id),
  amount INTEGER NOT NULL CHECK (amount > 0),
  made_on TEXT NOT NULL,
  CHECK (from_id <> to_id)
);`;
const VIEW_ACTIVITY = `CREATE VIEW account_activity AS
SELECT from_id AS account_id, id AS transfer_id, made_on, -amount AS signed_amount FROM transfers
UNION ALL
SELECT to_id, id, made_on, amount FROM transfers;`;
// accounts: [id, owner, phone, balance]; transfers: [id, from, to, amount, made_on]
const L_ACC_A = [[1, 'Amina', '0700 000 101', 75000], [2, 'Brian', '0700 000 102', 70000], [3, 'Grace', '0700 000 103', 25000]];
const L_TR_A = [[1, 1, 2, 30000, '2026-11-10'], [2, 2, 3, 10000, '2026-11-11'], [3, 3, 1, 5000, '2026-11-12']];
const L_ACC_B = [[1, 'Sarah', '0700 000 201', 40000], [2, 'Peter', '0700 000 202', 25000], [3, 'Ruth', '0700 000 203', 5000]];
const L_TR_B = [[1, 1, 2, 10000, '2026-12-01'], [2, 2, 3, 5000, '2026-12-02']];
const sqlStr = (v) => (typeof v === 'number' ? String(v) : `'${v}'`);
const ledger = (acc, tr, withView = false) =>
  `${LEDGER_SCHEMA}\nINSERT INTO accounts (id, owner, phone, balance) VALUES\n${acc.map((r) => `  (${r.map(sqlStr).join(', ')})`).join(',\n')};\nINSERT INTO transfers (id, from_id, to_id, amount, made_on) VALUES\n${tr.map((r) => `  (${r.map(sqlStr).join(', ')})`).join(',\n')};${withView ? `\n\n${VIEW_ACTIVITY}` : ''}`;
const LEDGER_START = `${LEDGER_SCHEMA}\nINSERT INTO accounts (owner, phone, balance) VALUES\n  ('Amina', '0700 000 101', 100000),\n  ('Brian', '0700 000 102', 50000),\n  ('Grace', '0700 000 103', 20000);`;
const activity = (tr, id) => tr.flatMap((t) => [[t[0], t[4], t[1], -t[3]], [t[0], t[4], t[2], t[3]]]).filter((a) => a[2] === id).sort((a, b) => cmp(a[1], b[1]) || a[0] - b[0]);
const netOf = (acc, tr) => acc.map((a) => [a[1], sum(activity(tr, a[0]), (x) => x[3])]);

export const level5b = [
  // ================================================================== 30
  {
    id: 'sql-cte-window',
    level: LEVEL,
    minutes: 30,
    title: 'WITH and window functions',
    summary: 'Name a step with WITH, then number, rank and total rows without collapsing them',
    blocks: [
      {
        t: 'story',
        title: 'The running total',
        text: "At the end of each day Nakato writes the day's takings in her book and, beside it, the total so far this month. Her sister asks, “Which product is the most expensive in each category?” Both questions have something in common: GROUP BY would collapse the rows into one per day or per category, but here every row must STAY, with an extra number computed from its neighbours.\n\nThis lesson has two tools. `WITH` gives a name to a step of a query so a long query reads top to bottom. **Window functions** work out a number across a group of rows without collapsing them.",
      },
      { t: 'p', text: '`WITH name AS ( query )` defines a temporary named result that the main query can use like a table. It is the tidy way to write a subquery in FROM.' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: `${DAILY_CTE}\nSELECT sale_date, takings\nFROM daily\nWHERE takings > 15000\nORDER BY sale_date;\n`,
        output: tbl(['sale_date', 'takings'], daily(SALES).filter((d) => d[1] > 15000)),
      },
      { t: 'h', text: 'A running total with OVER' },
      { t: 'p', text: 'A window function ends with `OVER (...)`. `SUM(takings) OVER (ORDER BY sale_date)` adds up the takings from the first day to this day: a running total. Every day keeps its own row.' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: `${DAILY_CTE}\nSELECT sale_date, takings,\n       SUM(takings) OVER (ORDER BY sale_date) AS running\nFROM daily\nORDER BY sale_date;\n`,
        output: tbl(['sale_date', 'takings', 'running'], running(SALES)),
      },
      { t: 'analogy', text: "A normal SUM with GROUP BY is a total at the bottom of the page. A window function is a running balance printed on every line of a bank statement: each line keeps its own amount and also shows the total up to that line." },
      { t: 'h', text: 'Numbering inside groups: PARTITION BY' },
      { t: 'p', text: '`ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC)` numbers the rows 1, 2, 3... separately inside each category, most expensive first. Put the numbering in a WITH, then keep only number 1 to get the top product of each category.' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: 'WITH ranked AS (\n  SELECT category, name, price,\n         ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn\n  FROM products\n)\nSELECT category, name, price\nFROM ranked\nWHERE rn = 1\nORDER BY category;\n',
        output: tbl(['category', 'name', 'price'], topPerCategory(PRODUCTS)),
      },
      { t: 'h', text: 'Looking at the previous row: LAG' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: `${DAILY_CTE}\nSELECT sale_date, takings,\n       takings - LAG(takings) OVER (ORDER BY sale_date) AS change\nFROM daily\nORDER BY sale_date;\n`,
        output: tbl(['sale_date', 'takings', 'change'], change(SALES)),
      },
      { t: 'p', text: '`LAG(x)` is the value of x on the previous row. The first day has no previous day, so its change is NULL. A WITH can also repeat itself: a `WITH RECURSIVE` query builds rows from its own output, for example counting.' },
      {
        t: 'try',
        code: 'WITH RECURSIVE nums(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM nums WHERE n < 5\n)\nSELECT n FROM nums;\n',
        output: tbl(['n'], [[1], [2], [3], [4], [5]]),
      },
      { t: 'tip', text: 'A recursive WITH needs a stopping rule (here `WHERE n < 5`). Without one it runs forever. The app stops a runaway query after a few seconds, but a real database server would not.' },
      {
        t: 'predict',
        code: 'SELECT v, RANK() OVER (ORDER BY v DESC) AS rk, ROW_NUMBER() OVER (ORDER BY v DESC) AS rn\nFROM (SELECT 10 AS v UNION ALL SELECT 10 UNION ALL SELECT 5) t\nORDER BY rn;\n',
        question: 'Two rows tie with the value 10 and one has 5. What do RANK and ROW_NUMBER give?',
        options: [
          tbl(['v', 'rk', 'rn'], [[10, 1, 1], [10, 1, 2], [5, 3, 3]]),
          tbl(['v', 'rk', 'rn'], [[10, 1, 1], [10, 2, 2], [5, 3, 3]]),
          tbl(['v', 'rk', 'rn'], [[10, 1, 1], [10, 1, 2], [5, 2, 3]]),
          tbl(['v', 'rk', 'rn'], [[10, 1, 1], [10, 1, 1], [5, 2, 2]]),
        ],
        answer: 0,
        explain: 'ROW_NUMBER always counts 1, 2, 3, no ties allowed. RANK gives tied rows the same rank (1 and 1) and then skips: the next rank is 3, as in a race where two runners tie for first.',
      },
      {
        t: 'fill',
        stdin: DUUKA_S,
        prompt: 'Fill the gap so the numbering restarts for each category.',
        template: "SELECT category, name, ROW_NUMBER() OVER (___ BY category ORDER BY price DESC, name) AS rn\nFROM products\nWHERE category = 'School';\n",
        blanks: [{ options: ['PARTITION', 'GROUP', 'ORDER'], answer: 'PARTITION' }],
        output: tbl(['category', 'name', 'rn'], PRODUCTS.filter((p) => p[2] === 'School').sort((a, b) => b[3] - a[3] || cmp(a[1], b[1])).map((p, i) => [p[2], p[1], i + 1])),
      },
      {
        t: 'bug',
        stdin: DUUKA_S,
        code: 'SELECT name FROM products WHERE ROW_NUMBER() OVER (ORDER BY price DESC) = 1;\n',
        question: 'This fails with “misuse of window function ROW_NUMBER()”. What is the fix?',
        options: ['Work the number out in a WITH, then filter it in the outer query', 'Write ROW_NUMBER in small letters', 'Remove ORDER BY', 'Use HAVING instead of WHERE'],
        answer: 0,
        explain: 'WHERE runs before window functions exist. Compute the number in a WITH (or subquery), then filter on that column outside.',
        fixed: 'WITH r AS (SELECT name, ROW_NUMBER() OVER (ORDER BY price DESC) AS rn FROM products)\nSELECT name FROM r WHERE rn = 1;\n',
      },
      {
        t: 'quiz',
        question: 'What does PARTITION BY do inside OVER (...)?',
        options: ['Restarts the numbering or total for each group, without collapsing rows', 'Deletes rows that are duplicates', 'Sorts the final result', 'Joins two tables'],
        answer: 0,
        explain: 'PARTITION BY is like GROUP BY for window functions: each group is worked out separately, but every row stays in the result.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT name FROM products WHERE ROW_NUMBER() OVER (ORDER BY price DESC) = 1;', why: 'A window function cannot be used in WHERE.', right: 'WITH r AS (SELECT name, ROW_NUMBER() OVER (ORDER BY price DESC) AS rn FROM products)\nSELECT name FROM r WHERE rn = 1;', stdin: DUUKA_S },
          { wrong: 'SELECT name, ROW_NUMBER() OVER (ORDER BY price DESC) AS rn FROM products WHERE rn = 1;', why: 'The nickname rn does not exist yet when WHERE runs. Put the numbering in a WITH and filter outside.', right: 'WITH r AS (SELECT name, ROW_NUMBER() OVER (ORDER BY price DESC) AS rn FROM products)\nSELECT name, rn FROM r WHERE rn = 1;', stdin: DUUKA_S },
          { wrong: `${DAILY_CTE}\nSELECT sale_date, takings, SUM(takings) OVER () AS running FROM daily;`, why: 'OVER () with no ORDER BY adds up ALL the days on every row, so the “running” total is the same big number everywhere. No error, wrong answer. Add ORDER BY sale_date inside OVER.', right: `${DAILY_CTE}\nSELECT sale_date, takings, SUM(takings) OVER (ORDER BY sale_date) AS running FROM daily;`, logic: true, stdin: DUUKA_S },
        ],
      },
      {
        t: 'recap',
        items: [
          '`WITH name AS (query)` names a step so the main query reads clearly. `WITH RECURSIVE` repeats a step and needs a stopping rule.',
          'A **window function** works across rows without collapsing them: `SUM(x) OVER (ORDER BY d)` is a running total.',
          '`PARTITION BY` restarts the calculation for each group. `ROW_NUMBER`, `RANK` number rows; `LAG` reads the previous row.',
          'Window functions cannot go in WHERE: compute them in a WITH, then filter outside.',
        ],
        memory: 'WITH names a step. OVER keeps every row and adds a number.',
      },
    ],
    exercises: [
      {
        id: 'sql30-running',
        title: 'Takings so far',
        prompt: 'Show each day\'s `sale_date`, `takings` (total amount of that day) and `running` (the total of all takings up to and including that day). One row per day, in date order.',
        starter: '-- sale_date, takings, running (running total of takings), one row per day, in date order\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['sale_date', 'takings', 'running'], running(SALES)) },
          { input: DUUKA_S_B, expected: tbl(['sale_date', 'takings', 'running'], running(SALES_B)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'First total each day in a WITH, then add a window SUM on top of that.',
          '`WITH daily AS (SELECT sale_date, SUM(amount) AS takings FROM sales GROUP BY sale_date)`',
          'Then `SELECT sale_date, takings, SUM(takings) OVER (ORDER BY sale_date) AS running FROM daily ORDER BY sale_date;`',
        ],
      },
      {
        id: 'sql30-top-per-category',
        title: 'The priciest in each category',
        prompt: 'Show the most expensive product of each category: `category`, `name` and `price`, ordered by category.',
        starter: '-- The most expensive product of each category: category, name, price, ordered by category\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['category', 'name', 'price'], topPerCategory(PRODUCTS)) },
          { input: DUUKA_S_B, expected: tbl(['category', 'name', 'price'], topPerCategory(PRODUCTS_B)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Number the products inside each category, most expensive first, in a WITH. Then keep number 1.',
          '`ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn`',
          'A similar example: lesson 30 does exactly this. Write it from memory, then compare.',
        ],
      },
      {
        id: 'sql30-change',
        title: 'Better or worse than yesterday?',
        prompt: 'Show each day\'s `sale_date`, `takings` and `change` (takings minus the previous day\'s takings; NULL for the first day), in date order.',
        starter: '-- sale_date, takings, change (compared with the previous day), in date order\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['sale_date', 'takings', 'change'], change(SALES)) },
          { input: DUUKA_S_B, expected: tbl(['sale_date', 'takings', 'change'], change(SALES_B)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Use the daily totals in a WITH, and the window function that looks at the previous row.',
          '`takings - LAG(takings) OVER (ORDER BY sale_date) AS change`',
          'A similar example: `LAG(price) OVER (ORDER BY id)` is the price on the previous row. Yours subtracts it from takings.',
        ],
      },
    ],
  },

  // ================================================================== 31
  {
    id: 'sql-triggers-upsert',
    level: LEVEL,
    minutes: 28,
    title: 'Upsert, RETURNING and triggers',
    summary: 'Insert or update in one step, get the new row back, and make the database act by itself',
    blocks: [
      {
        t: 'story',
        title: 'Insert it, unless it is already there',
        text: "A delivery arrives: 10 sacks of sugar and 5 packs of salt. For each item Nakato asks herself: do I already have a line for it? If yes, she adds to the quantity. If not, she writes a new line. Today that is two steps: look, then decide. But between her look and her decision, someone else might write the line, and she would create a duplicate.\n\nSQL can do “update it if it exists, otherwise insert it” in ONE step. It is called an **upsert**. And when she changes a price, she wants a note written automatically in a price history, without having to remember. That is a **trigger**.",
      },
      { t: 'p', text: '`ON CONFLICT(column) DO UPDATE SET ...` says: if this INSERT would break the UNIQUE rule on that column, update the existing row instead. `excluded.price` is the value you tried to insert.' },
      {
        t: 'try',
        stdin: itemsSetup(ITEMS_A),
        code: "INSERT INTO items (name, price) VALUES ('Sugar', 5000)\nON CONFLICT(name) DO UPDATE SET price = excluded.price;\nINSERT INTO items (name, price) VALUES ('Salt', 1000)\nON CONFLICT(name) DO UPDATE SET price = excluded.price;\nSELECT name, price FROM items ORDER BY id;\n",
        output: tables(changed(1), changed(1), tbl(['name', 'price'], [['Sugar', 5000], ['Rice', 3800], ['Salt', 1000]])),
      },
      { t: 'p', text: 'Sugar existed, so its price was updated. Salt did not, so a new row was inserted. Same statement, two outcomes. Now ask the database to hand the new row back with `RETURNING`:' },
      {
        t: 'try',
        stdin: itemsSetup(ITEMS_A),
        code: "INSERT INTO items (name, price) VALUES ('Salt', 1000)\nRETURNING id, name;\n",
        output: tbl(['id', 'name'], [[3, 'Salt']]),
      },
      { t: 'tip', text: '`RETURNING` saves a second query. It is how an app learns the id that the database just gave to a new row.' },
      { t: 'p', text: 'If you only want to skip a duplicate quietly, use `INSERT OR IGNORE`. It reports `(0 rows changed)` when it skipped.' },
      {
        t: 'try',
        stdin: itemsSetup(ITEMS_A),
        code: "INSERT OR IGNORE INTO items (name, price) VALUES ('Sugar', 1);\nSELECT COUNT(*) AS n FROM items;\n",
        output: tables(changed(0), tbl(['n'], [[2]])),
      },
      { t: 'h', text: 'Triggers: the database acts by itself' },
      { t: 'analogy', text: "A trigger is a tripwire. You set it once: “whenever someone changes a price, write down the old and the new price.” After that, nobody has to remember. Every UPDATE of price, from any app, trips the wire, and the note is written." },
      {
        t: 'try',
        stdin: itemsSetup(ITEMS_A),
        code: "CREATE TRIGGER log_price\nAFTER UPDATE OF price ON items\nBEGIN\n  INSERT INTO price_log (item_id, old_price, new_price)\n  VALUES (OLD.id, OLD.price, NEW.price);\nEND;\nUPDATE items SET price = 4800 WHERE name = 'Sugar';\nSELECT item_id, old_price, new_price FROM price_log;\n",
        output: tables(changed(1), tbl(['item_id', 'old_price', 'new_price'], [[1, 4500, 4800]])),
      },
      { t: 'list', items: ['`AFTER UPDATE OF price ON items`: when to fire (AFTER or BEFORE; INSERT, UPDATE or DELETE).', '`OLD.column` is the value before the change, `NEW.column` the value after (OLD exists for UPDATE and DELETE, NEW for INSERT and UPDATE).', 'The body goes between `BEGIN` and `END;`, and each statement inside ends with its own semicolon.'] },
      {
        t: 'predict',
        stdin: itemsSetup(ITEMS_A),
        code: "INSERT INTO items (name, price) VALUES ('Rice', 4000)\nON CONFLICT(name) DO NOTHING;\nSELECT price FROM items WHERE name = 'Rice';\n",
        question: 'Rice already exists at 3800. The INSERT says DO NOTHING on a conflict. What is Rice\'s price afterwards?',
        options: [tables(changed(0), tbl(['price'], [[3800]])), tables(changed(1), tbl(['price'], [[4000]])), tables(changed(1), tbl(['price'], [[3800]])), tables(changed(0), tbl(['price'], [[4000]]))],
        answer: 0,
        explain: 'DO NOTHING keeps the existing row untouched. Nothing is changed, so the price stays 3800 and SQL reports (0 rows changed).',
      },
      {
        t: 'fill',
        stdin: itemsSetup(ITEMS_A),
        prompt: 'Fill the gap so an existing item gets its price updated.',
        template: "INSERT INTO items (name, price) VALUES ('Rice', 4000)\nON CONFLICT(name) DO ___ SET price = excluded.price;\nSELECT name, price FROM items ORDER BY id;\n",
        blanks: [{ options: ['UPDATE', 'REPLACE', 'CHANGE'], answer: 'UPDATE' }],
        output: tables(changed(1), tbl(['name', 'price'], [['Sugar', 4500], ['Rice', 4000]])),
      },
      {
        t: 'bug',
        stdin: itemsSetup(ITEMS_A),
        code: 'CREATE TRIGGER log_price\nAFTER UPDATE OF price ON items\nBEGIN\n  INSERT INTO price_log (item_id, old_price, new_price)\n  VALUES (OLD.id, OLD.price, NEW.price);\n',
        question: 'This fails with “incomplete input”. What is missing?',
        options: ['The closing END; of the trigger body', 'A WHERE after the trigger', 'The word FOR EACH', 'A second INSERT'],
        answer: 0,
        explain: 'A trigger body starts with BEGIN and must close with END;, just like the brackets must close in CREATE TABLE.',
        fixed: 'CREATE TRIGGER log_price\nAFTER UPDATE OF price ON items\nBEGIN\n  INSERT INTO price_log (item_id, old_price, new_price)\n  VALUES (OLD.id, OLD.price, NEW.price);\nEND;\n',
      },
      {
        t: 'quiz',
        question: 'Inside a trigger on UPDATE, what are OLD.price and NEW.price?',
        options: ['The price before the change and the price after it', 'The cheapest and the dearest price', 'Two different tables', 'The first and the last row'],
        answer: 0,
        explain: 'OLD is the row as it was, NEW is the row as it will be. A price-history trigger needs both.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: "INSERT INTO items (name, price) VALUES ('Sugar', 5000) ON CONFLICT(price) DO UPDATE SET price = excluded.price;", why: 'ON CONFLICT must name a column that is PRIMARY KEY or UNIQUE. price is neither, so SQLite refuses.', right: "INSERT INTO items (name, price) VALUES ('Sugar', 5000) ON CONFLICT(name) DO UPDATE SET price = excluded.price;", stdin: itemsSetup(ITEMS_A) },
          { wrong: "INSERT INTO items (name, price) VALUES ('Sugar', 5000);", why: 'A plain INSERT of a name that exists breaks the UNIQUE rule and stops with an error. Use an upsert.', right: "INSERT INTO items (name, price) VALUES ('Sugar', 5000) ON CONFLICT(name) DO UPDATE SET price = excluded.price;", stdin: itemsSetup(ITEMS_A) },
          { wrong: "INSERT OR REPLACE INTO items (name, price) VALUES ('Sugar', 5000);", why: 'REPLACE deletes the old Sugar row and inserts a brand new one, which gets a NEW id (3, not 1). Any other table that pointed at Sugar\'s id is now broken. No error. Use ON CONFLICT ... DO UPDATE, which changes the row in place.', right: "INSERT INTO items (name, price) VALUES ('Sugar', 5000) ON CONFLICT(name) DO UPDATE SET price = excluded.price;", logic: true, stdin: itemsSetup(ITEMS_A) },
        ],
      },
      {
        t: 'recap',
        items: [
          '**Upsert**: `INSERT ... ON CONFLICT(col) DO UPDATE SET x = excluded.x` updates if the row exists, inserts if not. `DO NOTHING` skips.',
          '`RETURNING col, ...` hands back the row an INSERT, UPDATE or DELETE just touched.',
          '`INSERT OR IGNORE` skips duplicates quietly. Avoid `INSERT OR REPLACE`: it deletes and re-creates the row, changing its id.',
          '**Triggers** run by themselves after or before a change; `OLD` and `NEW` are the row before and after. They end with `END;`.',
        ],
        memory: 'Upsert: update or insert in one step. A trigger is a tripwire.',
      },
    ],
    exercises: [
      {
        id: 'sql31-stock-in',
        title: 'A delivery arrives',
        prompt: 'The table `stock(item, qty)` has `item` as its primary key. Record a delivery of 10 `Sugar` and 5 `Salt` with ONE upsert statement for each: if the item exists, ADD the delivered quantity to `qty`, otherwise insert it. Then show `item` and `qty` of all items ordered by item.',
        starter: '-- Two upserts (Sugar 10, Salt 5), adding to qty when the item exists; then show item, qty ordered by item\n',
        usesInput: true,
        sampleInput: stockSetup(STOCK_A),
        tests: [
          { input: stockSetup(STOCK_A), expected: tables(changed(1), changed(1), tbl(['item', 'qty'], [['Rice', 35], ['Salt', 5], ['Sugar', 30]])) },
          { input: stockSetup(STOCK_B), expected: tables(changed(1), changed(1), tbl(['item', 'qty'], [['Beans', 14], ['Pencil', 200], ['Salt', 5], ['Sugar', 10]])), hidden: true, name: 'A shop without sugar' },
        ],
        hints: [
          'INSERT with ON CONFLICT on the primary key, and an update that adds the new quantity to the old.',
          "`INSERT INTO stock (item, qty) VALUES ('Sugar', 10) ON CONFLICT(item) DO UPDATE SET qty = qty + excluded.qty;`",
          'Do the same for Salt with 5, then `SELECT item, qty FROM stock ORDER BY item;`',
        ],
      },
      {
        id: 'sql31-trigger',
        title: 'Log every stock change',
        prompt: 'The tables `stock(item, qty)` and `stock_log(id, item, old_qty, new_qty)` exist. Create a trigger named `log_stock` that fires AFTER an UPDATE OF `qty` ON `stock` and inserts `item`, `OLD.qty` and `NEW.qty` into `stock_log` (columns `item`, `old_qty`, `new_qty`). Then run `UPDATE stock SET qty = qty + 5 WHERE qty < 30;` and show `item`, `old_qty`, `new_qty` from `stock_log`.',
        starter: '-- Create the trigger log_stock, run the UPDATE, then show the log (item, old_qty, new_qty)\n',
        usesInput: true,
        sampleInput: stockSetup(STOCK_A, true),
        tests: [
          { input: stockSetup(STOCK_A, true), expected: tables(changed(1), tbl(['item', 'old_qty', 'new_qty'], [['Sugar', 20, 25]])) },
          { input: stockSetup(STOCK_B, true), expected: tables(changed(1), tbl(['item', 'old_qty', 'new_qty'], [['Beans', 14, 19]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The trigger body is one INSERT between BEGIN and END;. Use OLD.qty and NEW.qty for the two quantities.',
          '`CREATE TRIGGER log_stock AFTER UPDATE OF qty ON stock BEGIN INSERT INTO stock_log (item, old_qty, new_qty) VALUES (OLD.item, OLD.qty, NEW.qty); END;`',
          'A similar example: the lesson\'s log_price trigger records the old and new price. Yours records the old and new qty.',
        ],
      },
      {
        id: 'sql31-returning',
        title: 'Which id did Salt get?',
        prompt: 'Add an item with the name `Salt` and the price `1000` to `items`, and use `RETURNING` to show its new `id` and `name`.',
        starter: '-- Insert Salt (price 1000) and return id and name\n',
        usesInput: true,
        sampleInput: itemsSetup(ITEMS_A),
        tests: [
          { input: itemsSetup(ITEMS_A), expected: tbl(['id', 'name'], [[3, 'Salt']]) },
          { input: itemsSetup(ITEMS_B), expected: tbl(['id', 'name'], [[4, 'Salt']]), hidden: true, name: 'A table with more items' },
        ],
        hints: [
          'A normal INSERT, with one more clause at the end that names the columns you want back.',
          "`INSERT INTO items (name, price) VALUES ('Salt', 1000) RETURNING id, name;`",
          'A similar example: `UPDATE items SET price = price + 100 RETURNING name, price;` returns each changed row. Yours returns the inserted row.',
        ],
      },
    ],
  },

  // ================================================================== 32
  {
    id: 'sql-from-apps',
    level: LEVEL,
    minutes: 26,
    title: 'SQL from apps: injection and safety',
    summary: 'See how gluing text into a query lets an attacker rewrite it, and how professionals prevent that',
    blocks: [
      {
        t: 'story',
        title: 'The login box',
        text: "Nakato's website has a login box. When someone types a name, the website builds a SQL query by gluing the name into a piece of text: `SELECT * FROM users WHERE name = '` plus whatever was typed plus `'`. It works perfectly for “Amina”. Then a stranger types something strange, and suddenly the website shows him every user in the database.\n\nThis is called **SQL injection**, and it is one of the most common ways that real systems have been broken. You do not need to be a hacker to understand it. You only need to see what the glued text looks like.",
      },
      { t: 'p', text: 'This app cannot run a website, but SQL can build the same text with `||`. Here is the query the website builds for a normal user:' },
      {
        t: 'try',
        code: "SELECT 'SELECT * FROM users WHERE name = ''' || 'Amina' || ''';' AS query_text;\n",
        output: tbl(['query_text'], [["SELECT * FROM users WHERE name = 'Amina';"]]),
      },
      { t: 'p', text: 'Now the stranger types: `x\' OR \'1\'=\'1`. Look at the text the website builds:' },
      {
        t: 'try',
        code: "SELECT 'SELECT * FROM users WHERE name = ''' || 'x'' OR ''1''=''1' || ''';' AS query_text;\n",
        output: tbl(['query_text'], [["SELECT * FROM users WHERE name = 'x' OR '1'='1';"]]),
      },
      { t: 'p', text: 'The stranger\'s quote mark closed the text early, and what followed became part of the SQL. `\'1\'=\'1\'` is always true, so the WHERE keeps every row. This is what the database now runs:' },
      {
        t: 'try',
        stdin: usersSetup(USERS_A),
        code: "SELECT name, secret FROM users WHERE name = 'x' OR '1'='1';\n",
        output: tbl(['name', 'secret'], USERS_A.map((u) => [u[1], u[2]])),
      },
      { t: 'analogy', text: "Imagine a form that says “Pay to the order of ______”. A fraudster writes: “Nobody, and also pay all the money in the account to me.” If the bank reads whatever is written in the blank as part of its instructions, it obeys. The fix is for the bank to treat the blank as a NAME only, never as instructions." },
      { t: 'h', text: 'The real defence: parameters' },
      { t: 'p', text: 'Professional code never glues text into SQL. It writes the query once with a placeholder, like `SELECT * FROM users WHERE name = ?`, and passes the typed value separately. The database then treats the value as a plain piece of data, never as SQL. For example, Python\'s `sqlite3` module writes `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))`. Every serious language and library has this feature, and it is the first rule of writing SQL in an app.' },
      { t: 'list', items: ['**Parameters (placeholders)**: the real defence. Always use them.', '**Validation**: also check that input looks like what you expect (a name has letters and spaces).', '**Least privilege**: the account the website uses should only be allowed what it needs, never to drop tables.', '**Backups**: keep copies, so that a mistake or an attack can be undone.'] },
      { t: 'p', text: 'Validation is a second layer. SQLite can test a text against a pattern with `GLOB`. `NOT GLOB \'*[^A-Za-z ]*\'` is true when the text has no character other than letters and spaces.' },
      {
        t: 'try',
        stdin: inputsSetup(INPUTS_A),
        code: "SELECT id, v, v NOT GLOB '*[^A-Za-z ]*' AS is_clean\nFROM inputs\nORDER BY id;\n",
        output: tbl(['id', 'v', 'is_clean'], INPUTS_A.map((r) => [r[0], r[1], clean(r[1])])),
      },
      { t: 'tip', text: 'Notice that O\'Brien, a perfectly honest surname, fails the validation because of the apostrophe. Validation alone rejects real people. That is why parameters, which handle every character safely, are the real defence, and validation is only an extra check.' },
      {
        t: 'predict',
        stdin: usersSetup(USERS_A),
        code: "SELECT COUNT(*) AS n FROM users WHERE name = 'zzz' OR '1' = '1';\n",
        question: 'There is no user called zzz, and the table has 4 users. How many rows does the test keep?',
        options: [tbl(['n'], [[4]]), tbl(['n'], [[0]]), tbl(['n'], [[1]]), tbl(['n'], [[3]])],
        answer: 0,
        explain: 'WHERE keeps a row if the whole test is true. `name = \'zzz\'` is false, but `OR \'1\' = \'1\'` is always true, so EVERY row passes: all 4.',
      },
      {
        t: 'fill',
        stdin: inputsSetup(INPUTS_A),
        prompt: 'Fill the gap so only inputs made of letters and spaces are listed.',
        template: "SELECT v FROM inputs WHERE v ___ GLOB '*[^A-Za-z ]*' ORDER BY id;\n",
        blanks: [{ options: ['NOT', '!', 'NO'], answer: 'NOT' }],
        output: tbl(['v'], INPUTS_A.filter((r) => clean(r[1])).map((r) => [r[1]])),
      },
      {
        t: 'bug',
        stdin: usersSetup(USERS_A),
        code: "SELECT * FROM users WHERE name = 'O'Brien';\n",
        question: 'This fails with a syntax error near Brien, with no attacker involved. What happened?',
        options: ['The apostrophe in the name ended the text early', 'There is no user called Brien', 'SELECT * is not allowed', 'The name must be in capital letters'],
        answer: 0,
        explain: 'Inside SQL text, one quote mark ends the text. To write a real apostrophe you double it: O\'\'Brien. Gluing user input would break for every honest O\'Brien, which is also why parameters matter.',
        fixed: "SELECT * FROM users WHERE name = 'O''Brien';\n",
      },
      {
        t: 'quiz',
        question: 'What is the best defence against SQL injection?',
        options: ['Parameters: pass typed values separately from the SQL', 'Hide the login page', 'Make passwords longer', 'Use capital letters in the SQL'],
        answer: 0,
        explain: 'With parameters, the typed text can never become part of the SQL, whatever characters it contains.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: "SELECT * FROM users WHERE name = 'O'Brien';", why: 'An apostrophe in the middle of text ends the text early. Double it.', right: "SELECT * FROM users WHERE name = 'O''Brien';", stdin: usersSetup(USERS_A) },
          { wrong: "SELECT name FROM users WHERE name = 'zzz' OR '1' = '1';", why: 'This is what an injected login produces: no real name matched, yet every user is returned. No error. A website using this query would let a stranger in.', right: "SELECT name FROM users WHERE name = 'Amina';", logic: true, stdin: usersSetup(USERS_A) },
          { wrong: "SELECT name FROM users WHERE name = 'Amina' -- ' AND secret = 'wrong';", why: 'The two dashes start a comment, so the password check after them is ignored: Amina is returned although the secret is wrong. An attacker types the name plus the dashes. No error.', right: "SELECT name FROM users WHERE name = 'Amina' AND secret = 'wrong';", logic: true, stdin: usersSetup(USERS_A) },
        ],
      },
      {
        t: 'recap',
        items: [
          '**SQL injection**: user input glued into SQL text can close the text early and add SQL of the attacker\'s choice.',
          'The real defence is **parameters** (placeholders): the query and the values travel separately, so values are never read as SQL.',
          'Extra layers: validate input, give the app\'s database account only the rights it needs, keep backups.',
          'Never build SQL by joining text with user input. Never trust anything typed into a form.',
        ],
        memory: 'Never glue input into SQL. Use parameters.',
      },
    ],
    exercises: [
      {
        id: 'sql32-build-text',
        title: 'What the website builds',
        prompt: 'The table `form` has one row with a `name` and a `secret` that a visitor typed. Build the query text the insecure website would create, as ONE column headed `query_text`, looking like: `SELECT * FROM users WHERE name = \'Grace\' AND secret = \'abc\';` (use the real values from the form, joined with `||`).',
        starter: "-- query_text: SELECT * FROM users WHERE name = '<name>' AND secret = '<secret>';  built from the form row\n",
        usesInput: true,
        sampleInput: formSetup('Grace', 'abc'),
        tests: [
          { input: formSetup('Grace', 'abc'), expected: tbl(['query_text'], [["SELECT * FROM users WHERE name = 'Grace' AND secret = 'abc';"]]) },
          { input: formSetup('Ruth', 'xyz'), expected: tbl(['query_text'], [["SELECT * FROM users WHERE name = 'Ruth' AND secret = 'xyz';"]]), hidden: true, name: 'A different visitor' },
        ],
        hints: [
          'Join pieces of text with ||. A quote mark inside text is written doubled: \'\' .',
          "`'SELECT * FROM users WHERE name = ''' || name || ''' AND secret = ''' || secret || ''';' AS query_text`",
          'Put `FROM form` after it. The doubled quotes inside the text become single quotes in the result.',
        ],
      },
      {
        id: 'sql32-injected-count',
        title: 'How bad is it?',
        prompt: 'Show how many users the injected condition `name = \'zzz\' OR \'1\' = \'1\'` would return from `users`, headed `n`.',
        starter: '-- n: the number of users returned by WHERE name = \'zzz\' OR \'1\' = \'1\'\n',
        usesInput: true,
        sampleInput: usersSetup(USERS_A),
        tests: [
          { input: usersSetup(USERS_A), expected: tbl(['n'], [[USERS_A.length]]) },
          { input: usersSetup(USERS_B), expected: tbl(['n'], [[USERS_B.length]]), hidden: true, name: 'A smaller site' },
        ],
        hints: [
          'Count the rows that pass that exact WHERE test.',
          "`SELECT COUNT(*) AS n FROM users WHERE name = 'zzz' OR '1' = '1';`",
          'It equals the number of rows in the table, because the second half of the OR is always true.',
        ],
      },
      {
        id: 'sql32-clean-inputs',
        title: 'Check what was typed',
        prompt: 'The table `inputs(id, v)` holds typed text. Show `id`, `v` and `is_clean`, which is 1 when `v` contains only letters and spaces and 0 otherwise (use `NOT GLOB \'*[^A-Za-z ]*\'`). Order by id.',
        starter: '-- id, v, is_clean (1 when v has only letters and spaces, else 0), ordered by id\n',
        usesInput: true,
        sampleInput: inputsSetup(INPUTS_A),
        tests: [
          { input: inputsSetup(INPUTS_A), expected: tbl(['id', 'v', 'is_clean'], INPUTS_A.map((r) => [r[0], r[1], clean(r[1])])) },
          { input: inputsSetup(INPUTS_B), expected: tbl(['id', 'v', 'is_clean'], INPUTS_B.map((r) => [r[0], r[1], clean(r[1])])), hidden: true, name: 'Different inputs' },
        ],
        hints: [
          'A test like `v NOT GLOB \'...\'` gives 1 or 0, so you can select it like a column and name it with AS.',
          "`SELECT id, v, v NOT GLOB '*[^A-Za-z ]*' AS is_clean FROM inputs ORDER BY id;`",
          'The pattern `[^A-Za-z ]` means “any character that is not a letter or a space”, and the stars allow anything around it.',
        ],
      },
    ],
  },

  // ================================================================== 33
  {
    id: 'sql-capstone',
    level: LEVEL,
    minutes: 40,
    title: 'Capstone: the Mobile Money ledger',
    summary: 'Design, protect, move money safely and report on a mobile money wallet, using everything you have learnt',
    blocks: [
      {
        t: 'story',
        title: 'Your own mobile money service',
        text: "Uganda moves a huge share of its money through mobile money. Behind every “You have sent 30,000 to Brian” is a database much like the one you are about to build. It must never lose a shilling, never let a balance go negative, never send money to an account that does not exist, and always be able to show who sent what to whom.\n\nThis is the last project of the course. It uses design, constraints, foreign keys, transactions, views, window functions and joins. Take your time, and read each result.",
      },
      { t: 'h', text: 'Step 1: design with rules' },
      { t: 'p', text: 'Two tables. `accounts` holds the people and their balances. `transfers` records every movement: who sent (`from_id`), who received (`to_id`), how much and when. The rules protect the data: a balance can never be negative, an amount must be positive, a phone number is never repeated, and nobody can send money to themselves. Both foreign keys point at `accounts`.' },
      {
        t: 'project',
        title: 'Create the ledger and open three accounts',
        code: `PRAGMA foreign_keys = ON;\n${LEDGER_SCHEMA}\nINSERT INTO accounts (owner, phone, balance) VALUES\n  ('Amina', '0700 000 101', 100000),\n  ('Brian', '0700 000 102', 50000),\n  ('Grace', '0700 000 103', 20000);\nSELECT * FROM accounts;\n`,
        output: tables(changed(3), tbl(['id', 'owner', 'phone', 'balance'], [[1, 'Amina', '0700 000 101', 100000], [2, 'Brian', '0700 000 102', 50000], [3, 'Grace', '0700 000 103', 20000]])),
      },
      { t: 'h', text: 'Step 2: a safe transfer' },
      { t: 'p', text: 'Amina sends 30,000 to Brian. Three things must happen together or not at all: take it from Amina, give it to Brian, and write the record. That is one transaction. Afterwards check that the total money in the system has not changed.' },
      {
        t: 'project',
        title: 'Transfer 30000 from Amina to Brian',
        stdin: LEDGER_START,
        code: "PRAGMA foreign_keys = ON;\nBEGIN;\nUPDATE accounts SET balance = balance - 30000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 30000 WHERE id = 2;\nINSERT INTO transfers (from_id, to_id, amount, made_on)\nVALUES (1, 2, 30000, '2026-11-10');\nCOMMIT;\nSELECT owner, balance FROM accounts ORDER BY id;\nSELECT SUM(balance) AS total FROM accounts;\n",
        output: tables(changed(1), changed(1), changed(1), tbl(['owner', 'balance'], [['Amina', 70000], ['Brian', 80000], ['Grace', 20000]]), tbl(['total'], [[170000]])),
      },
      { t: 'p', text: 'The total is 170,000 before and after: not a shilling was lost. Now the safety net. A transfer to an account that does not exist must be refused by the foreign key.' },
      {
        t: 'bug',
        stdin: LEDGER_START,
        code: "PRAGMA foreign_keys = ON;\nINSERT INTO transfers (from_id, to_id, amount, made_on)\nVALUES (1, 99, 500, '2026-11-11');\n",
        question: 'This fails with “FOREIGN KEY constraint failed”. Which rule stopped it?',
        options: ['to_id 99 is not the id of any account', 'The amount is too small', 'Amina has no money', 'The date is wrong'],
        answer: 0,
        explain: 'The foreign key on to_id demands a real account. There is no account 99, so the database refused to record a transfer to nobody.',
        fixed: "PRAGMA foreign_keys = ON;\nINSERT INTO transfers (from_id, to_id, amount, made_on)\nVALUES (1, 2, 500, '2026-11-11');\n",
      },
      { t: 'h', text: 'Step 3: one view for the whole history' },
      { t: 'p', text: 'Each transfer is money OUT for the sender and money IN for the receiver. A view can list both sides as one stream of “account, date, signed amount”. `UNION ALL` stacks the rows of two queries into one result (plain `UNION` would also remove duplicate rows).' },
      {
        t: 'predict',
        code: 'SELECT 1 AS a UNION SELECT 1;\n',
        question: 'UNION removes duplicate rows. What does this show?',
        options: [tbl(['a'], [[1]]), tbl(['a'], [[1], [1]]), tbl(['a'], [[2]]), tbl(['a'], [])],
        answer: 0,
        explain: 'Both queries give the row 1, and UNION keeps only one copy. With UNION ALL you would get the row twice. For a ledger you want UNION ALL: two different transfers with the same amount are still two transfers.',
      },
      {
        t: 'project',
        title: 'Statement with a running net total',
        stdin: ledger(L_ACC_A, L_TR_A),
        code: `${VIEW_ACTIVITY}\n\nSELECT made_on, signed_amount,\n       SUM(signed_amount) OVER (ORDER BY made_on, transfer_id) AS net_so_far\nFROM account_activity\nWHERE account_id = 1\nORDER BY made_on, transfer_id;\n`,
        output: tbl(['made_on', 'signed_amount', 'net_so_far'], (() => { let t = 0; return activity(L_TR_A, 1).map((a) => [a[1], a[3], (t += a[3])]); })()),
      },
      { t: 'p', text: 'Amina sent 30,000 (shown as -30000) and later received 5,000 from Grace: her net movement is -25,000. A last report: the net movement of every account, from the view.' },
      {
        t: 'project',
        title: 'Net movement per account',
        stdin: ledger(L_ACC_A, L_TR_A, true),
        code: 'SELECT a.owner, SUM(v.signed_amount) AS net\nFROM account_activity v\nJOIN accounts a ON a.id = v.account_id\nGROUP BY a.id\nORDER BY net DESC;\n',
        output: tbl(['owner', 'net'], netOf(L_ACC_A, L_TR_A).sort((a, b) => b[1] - a[1])),
      },
      {
        t: 'quiz',
        question: 'Why are the debit, the credit and the transfer record all inside ONE transaction?',
        options: ['So that either all three happen or none does, and no money is lost or invented', 'Because SQL allows only three statements', 'To make the query faster', 'So that the balances go negative'],
        answer: 0,
        explain: 'A transaction is all-or-nothing. If anything fails halfway, ROLLBACK undoes the pieces already done.',
      },
      {
        t: 'recap',
        items: [
          'You designed tables with rules (`NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`, foreign keys) so they refuse bad data themselves.',
          'You moved money in a transaction and checked that the total did not change.',
          'You used a view, `UNION ALL` and a window function to report the history.',
          'You can now read, summarise, link, change, design, speed up, protect and report on a relational database. That is the whole SQL course.',
        ],
        memory: 'Design with rules. Change in transactions. Report with views and joins.',
      },
    ],
    exercises: [
      {
        id: 'sql33-transfer',
        title: 'Send 7000 from account 2 to account 3',
        prompt: 'The ledger exists with its accounts and past transfers. In ONE transaction (with foreign keys on): subtract 7000 from account `2`, add 7000 to account `3`, and record the transfer in `transfers` (from 2, to 3, amount 7000, date `2026-11-20`). Commit. Then show `owner` and `balance` of all accounts ordered by id.',
        starter: '-- PRAGMA foreign_keys = ON; then a transaction: debit account 2, credit account 3, insert the transfer, commit; then show owner and balance ordered by id\n',
        usesInput: true,
        sampleInput: ledger(L_ACC_A, L_TR_A),
        tests: [
          { input: ledger(L_ACC_A, L_TR_A), expected: tables(changed(1), changed(1), changed(1), tbl(['owner', 'balance'], L_ACC_A.map((a) => [a[1], a[0] === 2 ? a[3] - 7000 : a[0] === 3 ? a[3] + 7000 : a[3]]))) },
          { input: ledger(L_ACC_B, L_TR_B), expected: tables(changed(1), changed(1), changed(1), tbl(['owner', 'balance'], L_ACC_B.map((a) => [a[1], a[0] === 2 ? a[3] - 7000 : a[0] === 3 ? a[3] + 7000 : a[3]]))), hidden: true, name: 'A different ledger' },
        ],
        hints: [
          'Three data changes between BEGIN and COMMIT: two UPDATEs on accounts and one INSERT into transfers.',
          "`INSERT INTO transfers (from_id, to_id, amount, made_on) VALUES (2, 3, 7000, '2026-11-20');`",
          'The step 2 project of the lesson does the same for accounts 1 and 2. Change the ids, the amount and the date.',
        ],
      },
      {
        id: 'sql33-activity-view',
        title: 'The activity view',
        prompt: 'Create the view `account_activity` with the columns `account_id`, `transfer_id`, `made_on` and `signed_amount` (money OUT of the sender is negative, money IN for the receiver is positive; stack the two sides with UNION ALL). Then show `made_on` and `signed_amount` for account `2`, ordered by `made_on`, then `transfer_id`.',
        starter: '-- Create the view account_activity, then show made_on and signed_amount for account 2 ordered by made_on, transfer_id\n',
        usesInput: true,
        sampleInput: ledger(L_ACC_A, L_TR_A),
        tests: [
          { input: ledger(L_ACC_A, L_TR_A), expected: tbl(['made_on', 'signed_amount'], activity(L_TR_A, 2).map((a) => [a[1], a[3]])) },
          { input: ledger(L_ACC_B, L_TR_B), expected: tbl(['made_on', 'signed_amount'], activity(L_TR_B, 2).map((a) => [a[1], a[3]])), hidden: true, name: 'A different ledger' },
        ],
        hints: [
          'Two SELECTs from transfers joined by UNION ALL: one for the sender (negative amount) and one for the receiver (positive).',
          '`SELECT from_id AS account_id, id AS transfer_id, made_on, -amount AS signed_amount FROM transfers UNION ALL SELECT to_id, id, made_on, amount FROM transfers`',
          'Wrap it in `CREATE VIEW account_activity AS ...;` and then select from the view with `WHERE account_id = 2`.',
        ],
      },
      {
        id: 'sql33-net',
        title: 'Net movement per account',
        prompt: 'The view `account_activity` already exists. Show each account\'s `owner` and its total `signed_amount` headed `net`, biggest net first; when two tie, order by owner.',
        starter: '-- owner and net (total of signed_amount), biggest net first, ties by owner\n',
        usesInput: true,
        sampleInput: ledger(L_ACC_A, L_TR_A, true),
        tests: [
          { input: ledger(L_ACC_A, L_TR_A, true), expected: tbl(['owner', 'net'], netOf(L_ACC_A, L_TR_A).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))) },
          { input: ledger(L_ACC_B, L_TR_B, true), expected: tbl(['owner', 'net'], netOf(L_ACC_B, L_TR_B).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))), hidden: true, name: 'A different ledger' },
        ],
        hints: [
          'Join the view to accounts to get the owner, group by account, and add up the signed amounts.',
          '`SELECT a.owner, SUM(v.signed_amount) AS net FROM account_activity v JOIN accounts a ON a.id = v.account_id GROUP BY a.id`',
          'Finish with `ORDER BY net DESC, a.owner;`',
        ],
      },
    ],
  },
];
