// SQL, Level 3: Changing data and building tables. Lessons 13 to 18
// (CREATE TABLE, INSERT, UPDATE and DELETE, constraints, ALTER and DROP, the build-the-duuka project).
// Prose uses double-quoted strings. SQL code uses plain template literals.
// Expected outputs come from plain JavaScript data, never from the SQL itself. Every run starts with a fresh
// database, so a lesson that changes data shows the change by running a SELECT in the same run.
import { DUUKA, DUUKA_B, PRODUCTS, PRODUCTS_B, CUSTOMERS, CUSTOMERS_B, SUPPLIERS, SUPPLIERS_B, SUPPLIER_COLS, SUP, SUP_B, tbl, tables, tableScript, productView, customerView, allCustomers, changed } from './shared.js';

const LEVEL = 'Level 3: Changing data and building tables';

const INFO_COLS = ['cid', 'name', 'type', 'notnull', 'dflt_value', 'pk']; // what PRAGMA table_info prints
const info = (rows) => tbl(INFO_COLS, rows);

// ---- practice tables used only in this level ----
const MEMBERS_SQL = "CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT UNIQUE, joined TEXT DEFAULT '2026-11-01', points INTEGER DEFAULT 0 CHECK (points >= 0));";
const MEMBERS = `${MEMBERS_SQL}\nINSERT INTO members (name, phone) VALUES ('Amina', '0700 000 101');`;
const MEMBER_COLS = ['id', 'name', 'phone', 'joined', 'points'];

const LOANS_SQL = "CREATE TABLE loans (id INTEGER PRIMARY KEY, customer TEXT NOT NULL, amount INTEGER NOT NULL, status TEXT DEFAULT 'open');";
const LOANS_A = LOANS_SQL;
const LOANS_B = `${LOANS_SQL}\nINSERT INTO loans (customer, amount, status) VALUES ('Grace', 20000, 'paid');`;

// A tiny shop made by the project lesson: the schema the learner builds in step 1.
const SHOP_SQL = "CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, price INTEGER NOT NULL CHECK (price > 0), stock INTEGER NOT NULL DEFAULT 0);";
const shopSetup = (rows) => `${SHOP_SQL}\nINSERT INTO products (name, price, stock) VALUES\n${rows.map((r) => `  ('${r[0]}', ${r[1]}, ${r[2]})`).join(',\n')};`;
const SHOP_A = [['Sugar 1kg', 4500, 20], ['Rice 1kg', 3800, 35], ['Soap bar', 1500, 40]];
const SHOP_B = [['Beans 1kg', 4200, 14], ['Bread loaf', 3500, 0], ['Pencil', 300, 200], ['Notebook', 1500, 45]];
const SHOP_COLS = ['id', 'name', 'price', 'stock'];
const shopRows = (rows) => rows.map((r, i) => [i + 1, r[0], r[1], r[2]]);

export const level3 = [
  // ================================================================== 13
  {
    id: 'sql-create',
    level: LEVEL,
    minutes: 22,
    title: 'Creating your own table',
    summary: 'Design a table with CREATE TABLE: choose columns, data types and a primary key',
    blocks: [
      {
        t: 'story',
        title: 'A new page for the book',
        text: "Nakato's shop is growing. She keeps buying from the same few suppliers and she always forgets their phone numbers. “I need a new page in my book,” she says, “just for suppliers.” She takes a fresh page and, before writing a single name, draws the headings across the top: name, town, phone.\n\nUntil now you only READ tables other people made. Now you will make one. The first step is the same as Nakato's: draw the headings, leave the lines empty.",
      },
      { t: 'p', text: '`CREATE TABLE` gives the table a name, then lists each column with its **data type**. The list goes in brackets, with commas between columns.' },
      {
        t: 'try',
        code: "CREATE TABLE suppliers (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  town TEXT,\n  phone TEXT\n);\nSELECT name FROM sqlite_master WHERE type = 'table';\n",
        output: tbl(['name'], [['suppliers']]),
      },
      { t: 'tip', text: "`CREATE TABLE` prints nothing: it just does it. To check, we asked SQLite for its list of tables. `sqlite_master` is a table SQLite keeps about itself. A new table is EMPTY, like a page with only headings." },
      {
        t: 'try',
        code: 'CREATE TABLE suppliers (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  town TEXT,\n  phone TEXT\n);\nSELECT * FROM suppliers;\n',
        output: tbl(SUPPLIER_COLS, []),
      },
      { t: 'h', text: 'Data types' },
      {
        t: 'list',
        items: [
          '`INTEGER`: whole numbers (an amount in shillings, a count).',
          '`REAL`: numbers with decimals (a weight like 2.5).',
          '`TEXT`: words and anything that is a label, dates included.',
          '`PRIMARY KEY`: the column that gives every row its own number. `INTEGER PRIMARY KEY` numbers itself 1, 2, 3...',
        ],
      },
      { t: 'p', text: 'Ask SQLite how it understood the table. `PRAGMA table_info(tablename);` lists the columns, their types, and which one is the primary key (`pk` is 1).' },
      {
        t: 'try',
        code: 'CREATE TABLE suppliers (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  town TEXT,\n  phone TEXT\n);\nPRAGMA table_info(suppliers);\n',
        output: info([[0, 'id', 'INTEGER', 0, null, 1], [1, 'name', 'TEXT', 0, null, 0], [2, 'town', 'TEXT', 0, null, 0], [3, 'phone', 'TEXT', 0, null, 0]]),
      },
      { t: 'analogy', text: "Designing a table is like ruling a page before you write. A good design asks: what headings do I need, and what kind of thing goes under each one? Numbers you add up are INTEGER. Names, towns and phone numbers are TEXT. The id column is the line number of the page: it is how you point at exactly one row." },
      { t: 'p', text: 'One thing you have not met yet: `INSERT INTO` puts a row into a table. The next lesson teaches it. For now, just read the next example.' },
      {
        t: 'predict',
        code: "CREATE TABLE contacts (phone INTEGER);\nINSERT INTO contacts VALUES ('0700123456');\nSELECT phone FROM contacts;\n",
        question: 'A phone number is saved into an INTEGER column. What does SELECT show?',
        options: [
          tables(changed(1), tbl(['phone'], [[700123456]])),
          tables(changed(1), tbl(['phone'], [['0700123456']])),
          tables(changed(1), tbl(['phone'], [[0]])),
          tables(changed(1), tbl(['phone'], [[null]])),
        ],
        answer: 0,
        explain: 'An INTEGER column turns text that looks like a number into a real number, and a real number has no leading zero. The 0 at the front is lost forever. That is why phone numbers are TEXT: you never add them up, and the leading zero matters.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap: the name of a tool is words, so which type should the column have?',
        template: 'CREATE TABLE tools (name ___, qty INTEGER);\nPRAGMA table_info(tools);\n',
        blanks: [{ options: ['TEXT', 'INTEGER', 'REAL'], answer: 'TEXT' }],
        output: info([[0, 'name', 'TEXT', 0, null, 0], [1, 'qty', 'INTEGER', 0, null, 0]]),
      },
      {
        t: 'bug',
        code: 'CREATE TABLE suppliers (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  town TEXT,\n);\n',
        question: 'This fails with a syntax error near the closing bracket. What is wrong?',
        options: ['There is a comma after the last column', 'PRIMARY KEY must be on the last line', 'TEXT cannot be used twice', 'The table needs a semicolon inside the brackets'],
        answer: 0,
        explain: 'Commas go BETWEEN columns, never after the last one. The same rule as in SELECT.',
        fixed: 'CREATE TABLE suppliers (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  town TEXT\n);\n',
      },
      {
        t: 'quiz',
        question: 'Which type is best for a phone number like 0700 123 456?',
        options: ['TEXT, because you never add phone numbers up and the leading zero must stay', 'INTEGER, because it is made of digits', 'REAL, because it is long', 'PRIMARY KEY'],
        answer: 0,
        explain: 'Ask: will I do arithmetic on it? If not, and it is a label (phone, code, date, name), use TEXT.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'CREATE TABLE suppliers (id INTEGER PRIMARY KEY, name TEXT, town TEXT,);', why: 'A comma after the last column.', right: 'CREATE TABLE suppliers (id INTEGER PRIMARY KEY, name TEXT, town TEXT);' },
          { wrong: 'CREATE TABLE products (id INTEGER);', why: 'A table called products already exists in this database, and a name can only be used once.', right: 'CREATE TABLE IF NOT EXISTS products (id INTEGER);', stdin: DUUKA },
          { wrong: 'CREATE TABLE contacts (name TEXT, phone INTEGER);', why: 'No error now, but the phone column will quietly drop every leading zero later. Make it TEXT.', right: 'CREATE TABLE contacts (name TEXT, phone TEXT);', logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`CREATE TABLE name (column type, column type, ...);` makes an empty table. Commas between columns only.',
          'Types: `INTEGER` for whole numbers, `REAL` for decimals, `TEXT` for words, dates and phone numbers.',
          '`INTEGER PRIMARY KEY` numbers the rows by itself and gives every row its own id.',
          '`PRAGMA table_info(name);` shows how SQLite understood your table. `IF NOT EXISTS` avoids the “already exists” error.',
        ],
        memory: 'Draw the headings first. Phone numbers are TEXT.',
      },
    ],
    exercises: [
      {
        id: 'sql13-suppliers',
        title: 'Draw the suppliers page',
        prompt: 'Create a table `suppliers` with the columns `id` (INTEGER PRIMARY KEY), `name` (TEXT), `town` (TEXT). Then show its structure with `PRAGMA table_info(suppliers);`.',
        starter: '-- Create the suppliers table: id INTEGER PRIMARY KEY, name TEXT, town TEXT\n\n-- Then show its structure\nPRAGMA table_info(suppliers);\n',
        tests: [
          { input: '', expected: info([[0, 'id', 'INTEGER', 0, null, 1], [1, 'name', 'TEXT', 0, null, 0], [2, 'town', 'TEXT', 0, null, 0]]) },
          { input: "CREATE TABLE other (a TEXT);", expected: info([[0, 'id', 'INTEGER', 0, null, 1], [1, 'name', 'TEXT', 0, null, 0], [2, 'town', 'TEXT', 0, null, 0]]), hidden: true, name: 'A database that already has another table' },
        ],
        hints: [
          'CREATE TABLE, the table name, then the columns in brackets with commas between them.',
          'Column order: id, name, town. The first one is `id INTEGER PRIMARY KEY`.',
          'A similar example: `CREATE TABLE tools (id INTEGER PRIMARY KEY, name TEXT, qty INTEGER);` Yours has town instead of qty.',
        ],
      },
      {
        id: 'sql13-expenses',
        title: 'A page for expenses',
        prompt: 'Create a table `expenses` with `id` (INTEGER PRIMARY KEY), `item` (TEXT), `cost` (INTEGER) and `spent_on` (TEXT, for the date). Then show every row of it with `SELECT * FROM expenses;` (it is empty, so you see only the headings).',
        starter: '-- Create the expenses table, then select everything from it\n',
        tests: [
          { input: '', expected: tbl(['id', 'item', 'cost', 'spent_on'], []) },
          { input: DUUKA, expected: tbl(['id', 'item', 'cost', 'spent_on'], []), hidden: true, name: 'A database with other tables' },
        ],
        hints: [
          'First CREATE TABLE with four columns, then a normal SELECT.',
          '`CREATE TABLE expenses (id INTEGER PRIMARY KEY, item TEXT, cost INTEGER, spent_on TEXT);` and then `SELECT * FROM expenses;`',
          'A similar example: `CREATE TABLE notes (id INTEGER PRIMARY KEY, body TEXT); SELECT * FROM notes;` Yours has four columns.',
        ],
      },
      {
        id: 'sql13-all-tables',
        title: 'Add a page and count the pages',
        prompt: 'The database already has tables. Create one more table `notes` with `id` (INTEGER PRIMARY KEY) and `body` (TEXT). Then list the names of ALL tables with `SELECT name FROM sqlite_master WHERE type = \'table\' ORDER BY name;`.',
        starter: "-- Create notes, then list all table names (A to Z)\n",
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['name'], [['customers'], ['notes'], ['products']]) },
          { input: DUUKA_B, expected: tbl(['name'], [['customers'], ['notes'], ['products']]), hidden: true, name: 'Another shop' },
        ],
        hints: [
          'Two statements: one CREATE TABLE and one SELECT from sqlite_master.',
          "`CREATE TABLE notes (id INTEGER PRIMARY KEY, body TEXT);` and then `SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;`",
          'A similar example: after `CREATE TABLE tools (...)` the same SELECT would list customers, products and tools.',
        ],
      },
    ],
  },

  // ================================================================== 14
  {
    id: 'sql-insert',
    level: LEVEL,
    minutes: 24,
    title: 'Adding rows with INSERT',
    summary: 'Put new rows into a table: one row, many rows, and what happens to the columns you leave out',
    blocks: [
      {
        t: 'story',
        title: 'A new supplier walks in',
        text: "A man from Mukono brings Nakato samples of exercise books. “I can supply you every month,” he says. She likes the price and writes him on the suppliers page: name, town, phone. She does not write a line number: the lines of her book are numbered already.\n\nThe SQL for writing a new line is `INSERT INTO`. The suppliers table below already has three suppliers.",
      },
      { t: 'p', text: 'Name the table, name the columns you will fill, then give the `VALUES` in the same order. Text goes in single quotes. Then a `SELECT` to see the result.' },
      {
        t: 'try',
        stdin: SUP,
        code: "INSERT INTO suppliers (name, town, phone)\nVALUES ('Mukono Paper', 'Mukono', '0700 100 004');\nSELECT * FROM suppliers;\n",
        output: tables(changed(1), tbl(SUPPLIER_COLS, [...SUPPLIERS, [4, 'Mukono Paper', 'Mukono', '0700 100 004']])),
      },
      { t: 'tip', text: 'See the `(1 row changed)` line? That is SQL telling you how many rows the INSERT added. And look at the id: we never wrote it. `INTEGER PRIMARY KEY` gave the new row the next free number, 4.' },
      { t: 'h', text: 'Many rows at once, and columns you skip' },
      { t: 'p', text: 'Put several brackets after VALUES, separated by commas. A column you do not mention becomes `NULL` (empty), unless the table gave it a default.' },
      {
        t: 'try',
        stdin: SUP,
        code: "INSERT INTO suppliers (name, town)\nVALUES ('Fresh Dairy', 'Mbarara'), ('Nile Millers', 'Jinja');\nSELECT * FROM suppliers WHERE id > 3;\n",
        output: tables(changed(2), tbl(SUPPLIER_COLS, [[4, 'Fresh Dairy', 'Mbarara', null], [5, 'Nile Millers', 'Jinja', null]])),
      },
      { t: 'p', text: 'If you give a value for EVERY column, in the table\'s own order, you may leave out the column names. It is shorter, but risky: if the table ever changes, your INSERT breaks. Naming the columns is safer.' },
      {
        t: 'try',
        stdin: SUP,
        code: "INSERT INTO suppliers VALUES (10, 'Lake Fish', 'Entebbe', '0700 100 010');\nSELECT * FROM suppliers WHERE id = 10;\n",
        output: tables(changed(1), tbl(SUPPLIER_COLS, [[10, 'Lake Fish', 'Entebbe', '0700 100 010']])),
      },
      { t: 'analogy', text: "INSERT is writing a new line at the bottom of the page. The column names are the headings you are writing under. If you skip a heading, that box stays empty. If you make a mistake in the middle of a line, the whole line is refused, nothing half-written is left behind." },
      {
        t: 'predict',
        stdin: SUP,
        code: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy', 'Mbarara');\nSELECT id, name FROM suppliers WHERE name = 'Fresh Dairy';\n",
        question: 'The table has ids 1, 2 and 3. We did not write an id. What does the SELECT show?',
        options: [
          tables(changed(1), tbl(['id', 'name'], [[4, 'Fresh Dairy']])),
          tables(changed(1), tbl(['id', 'name'], [[null, 'Fresh Dairy']])),
          tables(changed(1), tbl(['id', 'name'], [[1, 'Fresh Dairy']])),
          tables(changed(1), tbl(['id', 'name'], [[0, 'Fresh Dairy']])),
        ],
        answer: 0,
        explain: 'An INTEGER PRIMARY KEY column that is left out is filled with one more than the biggest id so far. The biggest was 3, so the new row gets 4.',
      },
      {
        t: 'fill',
        stdin: SUP,
        prompt: 'Fill the gap: the values for the two named columns must be inside brackets.',
        template: "INSERT INTO suppliers (name, town) VALUES ___;\nSELECT name, town FROM suppliers WHERE id = 4;\n",
        blanks: [{ options: ["('Fresh Dairy', 'Mbarara')", "'Fresh Dairy', 'Mbarara'", '(name, town)'], answer: "('Fresh Dairy', 'Mbarara')" }],
        output: tables(changed(1), tbl(['name', 'town'], [['Fresh Dairy', 'Mbarara']])),
      },
      {
        t: 'bug',
        stdin: SUP,
        code: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy');\n",
        question: 'This fails with “1 values for 2 columns”. What is wrong?',
        options: ['Two columns are named but only one value is given', 'VALUES must be written in small letters', 'The id is missing', 'Text cannot be inserted'],
        answer: 0,
        explain: 'Every column you name needs exactly one value, in the same order.',
        fixed: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy', 'Mbarara');\n",
      },
      {
        t: 'quiz',
        question: 'You INSERT a row but leave out the phone column, and the table gave phone no default. What is saved in phone?',
        options: ['NULL (an empty box)', 'The text “phone”', '0', 'An empty text with no letters'],
        answer: 0,
        explain: 'A column you do not mention is NULL, unless the table says otherwise with DEFAULT (lesson 16).',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy');", why: 'Two columns, one value. The counts must match.', right: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy', 'Mbarara');", stdin: SUP },
          { wrong: "INSERT INTO suppliers (name, town) VALUES ('Mbarara', 'Fresh Dairy');", why: 'The values are in the wrong order: the town went into the name column and the name into the town column. No error, just wrong data saved.', right: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy', 'Mbarara');", logic: true, stdin: SUP },
          { wrong: "INSERT INTO suppliers (name, town) VALUES (Fresh Dairy, 'Mbarara');", why: 'Text needs single quotes.', right: "INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy', 'Mbarara');", stdin: SUP },
          { wrong: "INSERT INTO suppliers VALUES (1, 'Fresh Dairy', 'Mbarara', '0700 100 009');", why: 'There is already a supplier with id 1. Two rows cannot share a primary key.', right: "INSERT INTO suppliers VALUES (9, 'Fresh Dairy', 'Mbarara', '0700 100 009');", stdin: SUP },
        ],
      },
      {
        t: 'recap',
        items: [
          '`INSERT INTO table (columns) VALUES (values);` adds one row. Several brackets add several rows.',
          'Values go in the same order as the named columns, and the counts must match.',
          'A column you skip is NULL (or its default). An `INTEGER PRIMARY KEY` skipped is numbered automatically.',
          'SQL tells you `(N rows changed)`. Follow every INSERT with a SELECT to see the result.',
        ],
        memory: 'Name the columns, match the values, then check with a SELECT.',
      },
    ],
    exercises: [
      {
        id: 'sql14-add-one',
        title: 'Welcome, Mukono Paper',
        prompt: 'Add a supplier with the name `Mukono Paper` and the town `Mukono` (leave id and phone out). Then show every supplier with `SELECT * FROM suppliers;`.',
        starter: "-- Add the supplier, then show the table\n\nSELECT * FROM suppliers;\n",
        usesInput: true,
        sampleInput: SUP,
        tests: [
          { input: SUP, expected: tables(changed(1), tbl(SUPPLIER_COLS, [...SUPPLIERS, [SUPPLIERS.length + 1, 'Mukono Paper', 'Mukono', null]])) },
          { input: SUP_B, expected: tables(changed(1), tbl(SUPPLIER_COLS, [...SUPPLIERS_B, [SUPPLIERS_B.length + 1, 'Mukono Paper', 'Mukono', null]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'INSERT INTO, the table, the two column names in brackets, VALUES, and the two values in brackets.',
          "`INSERT INTO suppliers (name, town) VALUES ('Mukono Paper', 'Mukono');`",
          "A similar example: `INSERT INTO customers (name, town) VALUES ('Sam', 'Gulu');` adds a customer. Yours adds a supplier.",
        ],
      },
      {
        id: 'sql14-add-many',
        title: 'Two at once',
        prompt: 'Add TWO suppliers with ONE INSERT statement: `Fresh Dairy` from `Mbarara`, and `Nile Millers` from `Jinja`. Then show `name` and `town` of all suppliers ordered by name.',
        starter: '-- One INSERT with two rows, then show name and town ordered by name\n',
        usesInput: true,
        sampleInput: SUP,
        tests: [
          { input: SUP, expected: tables(changed(2), tbl(['name', 'town'], [...SUPPLIERS, [0, 'Fresh Dairy', 'Mbarara'], [0, 'Nile Millers', 'Jinja']].map((r) => [r[1], r[2]]).sort((a, b) => (a[0] < b[0] ? -1 : 1)))) },
          { input: SUP_B, expected: tables(changed(2), tbl(['name', 'town'], [...SUPPLIERS_B, [0, 'Fresh Dairy', 'Mbarara'], [0, 'Nile Millers', 'Jinja']].map((r) => [r[1], r[2]]).sort((a, b) => (a[0] < b[0] ? -1 : 1)))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'After VALUES, write two brackets separated by a comma.',
          "`INSERT INTO suppliers (name, town) VALUES ('Fresh Dairy', 'Mbarara'), ('Nile Millers', 'Jinja');` then `SELECT name, town FROM suppliers ORDER BY name;`",
          "A similar example: `VALUES ('A', 'X'), ('B', 'Y')` adds two rows in one statement. Yours has the two suppliers.",
        ],
      },
      {
        id: 'sql14-new-product',
        title: 'A new product on the shelf',
        prompt: 'Add a product to `products`, giving a value for EVERY column in the table\'s order: id `13`, name `Salt 500g`, category `Food`, price `1000`, stock `40`, supplier `NULL`. Then show `name` and `price` of the product with id 13.',
        starter: "-- Insert the new product with all six values, then select name and price where id = 13\n",
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tables(changed(1), tbl(['name', 'price'], [['Salt 500g', 1000]])) },
          { input: DUUKA_B, expected: tables(changed(1), tbl(['name', 'price'], [['Salt 500g', 1000]])), hidden: true, name: 'Another shop' },
        ],
        hints: [
          'Six values in the same order as the columns: id, name, category, price, stock, supplier. NULL has no quotes.',
          "`INSERT INTO products VALUES (13, 'Salt 500g', 'Food', 1000, 40, NULL);`",
          "A similar example: `INSERT INTO customers VALUES (7, 'Sam', '0700 000 107', 'Gulu');` gives all four columns of a customer. Yours has six.",
        ],
      },
    ],
  },

  // ================================================================== 15
  {
    id: 'sql-update-delete',
    level: LEVEL,
    minutes: 26,
    title: 'Changing and removing rows',
    summary: 'UPDATE changes values, DELETE removes rows, and a forgotten WHERE changes everything',
    blocks: [
      {
        t: 'story',
        title: 'Prices go up',
        text: "The price of sugar and rice goes up at the market, so every food item in the duuka must cost 10 percent more. Nakato does not rewrite her whole book. She goes line by line through the Food lines and crosses out each price and writes the new one. Later, when the milk supplier closes, she crosses out the whole milk line.\n\nChanging a value is `UPDATE`. Removing a row is `DELETE`. Both are powerful, and both need great care.",
      },
      { t: 'p', text: '`UPDATE table SET column = new value WHERE which rows`. The new value can be worked out from the old one.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "UPDATE products SET price = price * 110 / 100 WHERE category = 'Food';\nSELECT name, price FROM products WHERE category = 'Food';\n",
        output: tables(changed(PRODUCTS.filter((r) => r[2] === 'Food').length), tbl(['name', 'price'], PRODUCTS.filter((r) => r[2] === 'Food').map((r) => [r[1], (r[3] * 110) / 100]))),
      },
      { t: 'p', text: 'Several columns can be changed in one go, separated by commas.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "UPDATE products SET stock = stock + 50, supplier = 'Fresh Dairy' WHERE id = 9;\nSELECT name, stock, supplier FROM products WHERE id = 9;\n",
        output: tables(changed(1), tbl(['name', 'stock', 'supplier'], [['Milk 500ml', 50, 'Fresh Dairy']])),
      },
      { t: 'h', text: 'DELETE' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'DELETE FROM products WHERE stock = 0;\nSELECT COUNT(*) AS left_over FROM products;\n',
        output: tables(changed(PRODUCTS.filter((r) => r[4] === 0).length), tbl(['left_over'], [[PRODUCTS.filter((r) => r[4] !== 0).length]])),
      },
      { t: 'h', text: 'The most dangerous mistake in SQL' },
      { t: 'p', text: 'Leave out the `WHERE`, and the command applies to EVERY row. No warning, no question. Look at what happens to the whole shop.' },
      {
        t: 'predict',
        stdin: DUUKA,
        code: 'UPDATE products SET price = 0;\nSELECT COUNT(*) AS free_items FROM products WHERE price = 0;\n',
        question: 'Someone forgets the WHERE part. How many products are now free?',
        options: [
          tables(changed(12), tbl(['free_items'], [[12]])),
          tables(changed(1), tbl(['free_items'], [[1]])),
          tables(changed(0), tbl(['free_items'], [[0]])),
          tables(changed(12), tbl(['free_items'], [[0]])),
        ],
        answer: 0,
        explain: 'Without WHERE, SET applies to every row: all 12 products are now priced at 0. SQL says `(12 rows changed)`, but nobody told it that was a mistake.',
      },
      { t: 'tip', text: 'A safety habit used by professionals: write the WHERE first. Even better, run the same WHERE in a `SELECT` first to SEE which rows it will touch. Only then turn it into an UPDATE or DELETE. Check the `(N rows changed)` line: if N is much bigger than you expected, something is wrong.' },
      { t: 'analogy', text: "UPDATE and DELETE without WHERE is like announcing “Everyone in the shop, leave!” when you only meant to ask one person to step out. SQL obeys the words you wrote, not the ones you meant." },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap so the price of the product with id 1 is changed to 4800.',
        template: 'UPDATE products ___ price = 4800 WHERE id = 1;\nSELECT name, price FROM products WHERE id = 1;\n',
        blanks: [{ options: ['SET', 'TO', 'CHANGE'], answer: 'SET' }],
        output: tables(changed(1), tbl(['name', 'price'], [['Sugar 1kg', 4800]])),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'UPDATE products price = 4800 WHERE id = 1;\n',
        question: 'This fails with a syntax error near price. What is missing?',
        options: ['The word SET before the column', 'The word TABLE after UPDATE', 'Quotes around 4800', 'A FROM part'],
        answer: 0,
        explain: 'UPDATE has a fixed shape: `UPDATE table SET column = value WHERE ...`.',
        fixed: 'UPDATE products SET price = 4800 WHERE id = 1;\n',
      },
      {
        t: 'quiz',
        question: 'You run `DELETE FROM products;` with no WHERE. What happens?',
        options: ['Every row of the table is deleted', 'Nothing, SQL asks you to confirm', 'Only the first row is deleted', 'SQL shows an error'],
        answer: 0,
        explain: 'No question is asked. The table stays, but it is empty.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'UPDATE products SET price = 0;', why: 'No WHERE: every product is now free. SQL happily says (12 rows changed).', right: 'UPDATE products SET price = 0 WHERE id = 9;', logic: true, stdin: DUUKA },
          { wrong: 'DELETE * FROM products WHERE stock = 0;', why: 'DELETE does not take columns. It removes whole rows: `DELETE FROM`.', right: 'DELETE FROM products WHERE stock = 0;', stdin: DUUKA },
          { wrong: 'UPDATE products SET category = Household WHERE id = 1;', why: 'Text needs single quotes. Without them SQL looks for a column named Household.', right: "UPDATE products SET category = 'Household' WHERE id = 1;", stdin: DUUKA },
          { wrong: 'UPDATE products SET price = 4800 WHERE;', why: 'WHERE needs a test after it.', right: 'UPDATE products SET price = 4800 WHERE id = 1;', stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          '`UPDATE table SET column = value WHERE ...;` changes rows. The new value may use the old one: `stock = stock + 50`.',
          '`DELETE FROM table WHERE ...;` removes whole rows.',
          'No WHERE means EVERY row. Write the WHERE first and test it with a SELECT.',
          'Read the `(N rows changed)` line: it is your safety check.',
        ],
        memory: 'No WHERE, no mercy. SELECT first, then UPDATE or DELETE.',
      },
    ],
    exercises: [
      {
        id: 'sql15-school-sale',
        title: 'School term sale',
        prompt: 'Give every product in the category `School` a 10 percent discount by setting `price = price * 90 / 100`. Then show `name` and `price` of the School products.',
        starter: "-- Take 10 percent off every School product, then show name and price of School products\n",
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tables(changed(2), tbl(['name', 'price'], PRODUCTS.filter((r) => r[2] === 'School').map((r) => [r[1], (r[3] * 90) / 100]))) },
          { input: DUUKA_B, expected: tables(changed(2), tbl(['name', 'price'], PRODUCTS_B.filter((r) => r[2] === 'School').map((r) => [r[1], (r[3] * 90) / 100]))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'UPDATE, then SET with a calculation that uses the old price, then WHERE to limit it to School.',
          "`UPDATE products SET price = price * 90 / 100 WHERE category = 'School';` and then a SELECT.",
          "A similar example: `UPDATE products SET stock = stock + 10 WHERE category = 'Food';` adds 10 to the stock of food. Yours reduces the price of School.",
        ],
      },
      {
        id: 'sql15-restock',
        title: 'Restock the low shelves',
        prompt: 'Add 30 to the stock of every product that has fewer than 20 in stock. Then show `name` and `stock` of ALL products ordered by `id`.',
        starter: '-- Add 30 to the stock of products with fewer than 20, then show name and stock of all products by id\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tables(changed(PRODUCTS.filter((r) => r[4] < 20).length), tbl(['name', 'stock'], PRODUCTS.map((r) => [r[1], r[4] < 20 ? r[4] + 30 : r[4]]))) },
          { input: DUUKA_B, expected: tables(changed(PRODUCTS_B.filter((r) => r[4] < 20).length), tbl(['name', 'stock'], PRODUCTS_B.map((r) => [r[1], r[4] < 20 ? r[4] + 30 : r[4]]))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'One UPDATE that uses the old stock in the new value, with a WHERE for the low ones. Then a SELECT.',
          '`UPDATE products SET stock = stock + 30 WHERE stock < 20;`',
          "A similar example: `UPDATE products SET price = price - 100 WHERE price > 5000;` lowers the expensive prices. Yours raises the low stock.",
        ],
      },
      {
        id: 'sql15-clear-out',
        title: 'Clear out the empty shelves',
        prompt: 'Delete every product that is out of stock (`stock` is 0). Then show how many products are left, headed `left_over`.',
        starter: '-- Delete the out-of-stock products, then count what is left (heading: left_over)\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tables(changed(PRODUCTS.filter((r) => r[4] === 0).length), tbl(['left_over'], [[PRODUCTS.filter((r) => r[4] !== 0).length]])) },
          { input: DUUKA_B, expected: tables(changed(PRODUCTS_B.filter((r) => r[4] === 0).length), tbl(['left_over'], [[PRODUCTS_B.filter((r) => r[4] !== 0).length]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'DELETE FROM the table, with a WHERE for the empty shelves. Then a COUNT.',
          '`DELETE FROM products WHERE stock = 0;` and then `SELECT COUNT(*) AS left_over FROM products;`',
          "A similar example: `DELETE FROM customers WHERE town = 'Gulu';` removes the customers from Gulu. Yours removes products with no stock.",
        ],
      },
    ],
  },

  // ================================================================== 16
  {
    id: 'sql-constraints',
    level: LEVEL,
    minutes: 26,
    title: 'Rules that protect your data',
    summary: 'NOT NULL, UNIQUE, DEFAULT and CHECK: let the table refuse bad data',
    blocks: [
      {
        t: 'story',
        title: 'The loyalty book',
        text: "Nakato starts a loyalty book: every regular customer gets points. Within a week the book is a mess. One member has no name. Two members have the same phone number. One has minus 40 points. “I cannot check every line myself,” she sighs.\n\nA database can do that checking for her. You write the rules once, in `CREATE TABLE`, and from then on SQLite REFUSES any row that breaks a rule. These rules are called **constraints**.",
      },
      {
        t: 'list',
        items: [
          '`NOT NULL`: this box may never be empty.',
          '`UNIQUE`: no two rows may have the same value here.',
          '`DEFAULT value`: if you do not give a value, use this one.',
          '`CHECK (test)`: the value must pass this test.',
          '`PRIMARY KEY`: unique, and it identifies the row.',
        ],
      },
      {
        t: 'try',
        code: "CREATE TABLE members (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  phone TEXT UNIQUE,\n  joined TEXT DEFAULT '2026-11-01',\n  points INTEGER DEFAULT 0 CHECK (points >= 0)\n);\nINSERT INTO members (name, phone) VALUES ('Amina', '0700 000 101');\nINSERT INTO members (name, phone, points) VALUES ('Brian', '0700 000 102', 5);\nSELECT * FROM members;\n",
        output: tables(changed(1), changed(1), tbl(MEMBER_COLS, [[1, 'Amina', '0700 000 101', '2026-11-01', 0], [2, 'Brian', '0700 000 102', '2026-11-01', 5]])),
      },
      { t: 'p', text: 'Read the result. Amina has `joined` and `points` even though we never gave them: the DEFAULTs filled them in. Brian has 5 points because we gave a value, which replaces the default.' },
      {
        t: 'predict',
        stdin: MEMBERS,
        code: "INSERT INTO members (name) VALUES ('Brian');\nSELECT name, joined, points FROM members WHERE id = 2;\n",
        question: 'Brian is added with only a name. What are his joined date and points?',
        options: [
          tables(changed(1), tbl(['name', 'joined', 'points'], [['Brian', '2026-11-01', 0]])),
          tables(changed(1), tbl(['name', 'joined', 'points'], [['Brian', null, null]])),
          tables(changed(1), tbl(['name', 'joined', 'points'], [['Brian', '', 0]])),
          tables(changed(1), tbl(['name', 'joined', 'points'], [['Brian', '2026-11-01', null]])),
        ],
        answer: 0,
        explain: 'Both columns have a DEFAULT, so a missing value is replaced by it, not by NULL. (The phone is NULL: UNIQUE allows several empty values.)',
      },
      { t: 'h', text: 'When a rule is broken' },
      { t: 'p', text: 'SQLite stops with an error and changes NOTHING. The bad row never enters the table.' },
      {
        t: 'bug',
        stdin: MEMBERS,
        code: "INSERT INTO members (phone) VALUES ('0700 000 999');\n",
        question: 'This fails with “NOT NULL constraint failed: members.name”. What is wrong?',
        options: ['The name is required and was not given', 'The phone is too long', 'The id is missing', 'members is not a table'],
        answer: 0,
        explain: 'The name column was created with NOT NULL, so a row without a name is refused.',
        fixed: "INSERT INTO members (name, phone) VALUES ('Joseph', '0700 000 999');\n",
      },
      {
        t: 'bug',
        stdin: MEMBERS,
        code: 'UPDATE members SET points = points - 10 WHERE id = 1;\n',
        question: 'Amina has 0 points. This fails with “CHECK constraint failed: points >= 0”. Why?',
        options: ['0 minus 10 is minus 10, and the table only allows 0 or more', 'You cannot UPDATE points', 'WHERE id = 1 is wrong', 'Points must be TEXT'],
        answer: 0,
        explain: 'The CHECK rule says points must stay at 0 or above. The new value would be -10, so the update is refused.',
        fixed: 'UPDATE members SET points = points + 10 WHERE id = 1;\n',
      },
      { t: 'analogy', text: "Constraints are the rules written on the first page of the book: “Every line must have a name. No two lines may share a phone number. Points can never go below zero.” Then the book itself, not Nakato, refuses to accept anything that breaks them." },
      {
        t: 'fill',
        prompt: 'Fill the gap so a badge starts at level 1 when no level is given.',
        template: "CREATE TABLE badges (id INTEGER PRIMARY KEY, label TEXT, level INTEGER ___ 1);\nINSERT INTO badges (label) VALUES ('Bronze');\nSELECT * FROM badges;\n",
        blanks: [{ options: ['DEFAULT', 'DEFAULTS', 'SET'], answer: 'DEFAULT' }],
        output: tables(changed(1), tbl(['id', 'label', 'level'], [[1, 'Bronze', 1]])),
      },
      {
        t: 'quiz',
        question: 'Which constraint makes sure two members can never share the same phone number?',
        options: ['UNIQUE', 'NOT NULL', 'DEFAULT', 'CHECK'],
        answer: 0,
        explain: 'UNIQUE refuses a value that already exists in another row. NOT NULL only forbids empty boxes.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: "INSERT INTO members (name, phone) VALUES ('Joseph', '0700 000 101');", why: 'Amina already has that phone number, and the phone column is UNIQUE.', right: "INSERT INTO members (name, phone) VALUES ('Joseph', '0700 000 103');", stdin: MEMBERS },
          { wrong: "INSERT INTO members (phone) VALUES ('0700 000 150');", why: 'The name column is NOT NULL, so a row without a name is refused.', right: "INSERT INTO members (name, phone) VALUES ('Sam', '0700 000 150');", stdin: MEMBERS },
          { wrong: "INSERT INTO members (name, points) VALUES ('Sam', -5);", why: 'The CHECK rule forbids points below 0.', right: "INSERT INTO members (name, points) VALUES ('Sam', 5);", stdin: MEMBERS },
        ],
      },
      {
        t: 'recap',
        items: [
          'Constraints are rules written in `CREATE TABLE`: `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`, `PRIMARY KEY`.',
          'A broken rule stops the statement with an error and changes nothing.',
          '`DEFAULT` fills in a missing value. Giving a value replaces it.',
          'Rules in the table are stronger than rules in your head: they work even when you are tired.',
        ],
        memory: 'Let the table say no.',
      },
    ],
    exercises: [
      {
        id: 'sql16-loans-table',
        title: 'The loans table',
        prompt: 'Create a table `loans` with: `id` INTEGER PRIMARY KEY, `customer` TEXT that may not be empty, `amount` INTEGER that may not be empty, and `status` TEXT that is `open` when not given. Then show its structure with `PRAGMA table_info(loans);`.',
        starter: "-- Create loans: id (primary key), customer (required), amount (required), status (default 'open')\n\nPRAGMA table_info(loans);\n",
        tests: [
          { input: '', expected: info([[0, 'id', 'INTEGER', 0, null, 1], [1, 'customer', 'TEXT', 1, null, 0], [2, 'amount', 'INTEGER', 1, null, 0], [3, 'status', 'TEXT', 0, "'open'", 0]]) },
          { input: 'CREATE TABLE other (a TEXT);', expected: info([[0, 'id', 'INTEGER', 0, null, 1], [1, 'customer', 'TEXT', 1, null, 0], [2, 'amount', 'INTEGER', 1, null, 0], [3, 'status', 'TEXT', 0, "'open'", 0]]), hidden: true, name: 'A database that already has another table' },
        ],
        hints: [
          'Put the constraint words after the type: `customer TEXT NOT NULL`, and the default with `DEFAULT`.',
          "`status TEXT DEFAULT 'open'` (the default text needs quotes).",
          "A similar example: `CREATE TABLE tools (id INTEGER PRIMARY KEY, name TEXT NOT NULL, qty INTEGER DEFAULT 0);`",
        ],
      },
      {
        id: 'sql16-new-loan',
        title: 'Record a loan',
        prompt: 'The `loans` table exists. Add a loan for `Amina` of `50000` (do NOT give an id or a status: the table fills them). Then show all loans with `SELECT * FROM loans;`.',
        starter: '-- Insert the loan (customer and amount only), then show all loans\n',
        usesInput: true,
        sampleInput: LOANS_A,
        tests: [
          { input: LOANS_A, expected: tables(changed(1), tbl(['id', 'customer', 'amount', 'status'], [[1, 'Amina', 50000, 'open']])) },
          { input: LOANS_B, expected: tables(changed(1), tbl(['id', 'customer', 'amount', 'status'], [[1, 'Grace', 20000, 'paid'], [2, 'Amina', 50000, 'open']])), hidden: true, name: 'A table that already has a loan' },
        ],
        hints: [
          'Name only the two columns you give. The table fills the rest.',
          "`INSERT INTO loans (customer, amount) VALUES ('Amina', 50000);` and then a SELECT.",
          "A similar example: `INSERT INTO members (name) VALUES ('Sam');` lets the table fill the other columns. Yours gives two columns.",
        ],
      },
      {
        id: 'sql16-members',
        title: 'Two more members',
        prompt: 'The `members` table exists. Use TWO separate INSERT statements: add `Brian` with `5` points, and add `Grace` and give her no points (the default will do). Then show `name` and `points` of all members ordered by id.',
        starter: '-- Two INSERT statements, then show name and points ordered by id\n',
        usesInput: true,
        sampleInput: MEMBERS,
        tests: [
          { input: MEMBERS, expected: tables(changed(1), changed(1), tbl(['name', 'points'], [['Amina', 0], ['Brian', 5], ['Grace', 0]])) },
          { input: `${MEMBERS_SQL}\nINSERT INTO members (name, points) VALUES ('Sam', 12);`, expected: tables(changed(1), changed(1), tbl(['name', 'points'], [['Sam', 12], ['Brian', 5], ['Grace', 0]])), hidden: true, name: 'A different set of members' },
        ],
        hints: [
          'Two INSERTs: one gives name and points, the other gives only the name.',
          "`INSERT INTO members (name, points) VALUES ('Brian', 5);` and `INSERT INTO members (name) VALUES ('Grace');`",
          "A similar example: `INSERT INTO badges (label) VALUES ('Bronze');` leaves level to its default.",
        ],
      },
    ],
  },

  // ================================================================== 17
  {
    id: 'sql-alter',
    level: LEVEL,
    minutes: 22,
    title: 'Changing a table after you made it',
    summary: 'ALTER TABLE to add, rename and drop columns, and DROP TABLE to remove a table',
    blocks: [
      {
        t: 'story',
        title: 'We need email addresses',
        text: "A customer asks, “Can you send me a message when the oil is back?” Nakato realises her customers page has no place for an email address. She does not want to copy the whole page into a new book. She just draws one more heading on the right and leaves the boxes empty.\n\nThat is `ALTER TABLE`: change the shape of a table that already holds data.",
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'ALTER TABLE customers ADD COLUMN email TEXT;\nSELECT name, email FROM customers WHERE id <= 2;\n',
        output: tbl(['name', 'email'], CUSTOMERS.filter((r) => r[0] <= 2).map((r) => [r[1], null])),
      },
      { t: 'p', text: 'The new column is empty (NULL) for every existing row. Fill it with UPDATE, which you know from lesson 15.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "ALTER TABLE customers ADD COLUMN email TEXT;\nUPDATE customers SET email = 'amina@example.com' WHERE id = 1;\nSELECT name, email FROM customers WHERE id <= 2;\n",
        output: tables(changed(1), tbl(['name', 'email'], [['Amina Nakato', 'amina@example.com'], ['Brian Okello', null]])),
      },
      { t: 'h', text: 'Renaming and dropping' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'ALTER TABLE products RENAME COLUMN stock TO in_stock;\nSELECT name, in_stock FROM products WHERE id <= 3;\n',
        output: tbl(['name', 'in_stock'], PRODUCTS.filter((r) => r[0] <= 3).map((r) => [r[1], r[4]])),
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'ALTER TABLE products DROP COLUMN supplier;\nSELECT * FROM products WHERE id = 1;\n',
        output: tbl(['id', 'name', 'category', 'price', 'stock'], [PRODUCTS[0].slice(0, 5)]),
      },
      { t: 'h', text: 'Removing a whole table' },
      { t: 'p', text: '`DROP TABLE` throws the table away, rows and all. `IF EXISTS` stops the error when it is already gone.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "DROP TABLE IF EXISTS customers;\nSELECT name FROM sqlite_master WHERE type = 'table';\n",
        output: tbl(['name'], [['products']]),
      },
      { t: 'tip', text: 'In this app every run starts with a fresh database, so nothing here is ever really lost. In a real database, `DROP TABLE` and `DROP COLUMN` are permanent. Professionals make a copy (a backup) before they run them.' },
      {
        t: 'predict',
        stdin: DUUKA,
        code: 'ALTER TABLE products ADD COLUMN barcode TEXT;\nSELECT COUNT(barcode) AS with_barcode, COUNT(*) AS all_rows FROM products;\n',
        question: 'A column is added to a table that already has 12 rows. What does the SELECT show?',
        options: [tbl(['with_barcode', 'all_rows'], [[0, 12]]), tbl(['with_barcode', 'all_rows'], [[12, 12]]), tbl(['with_barcode', 'all_rows'], [[0, 0]]), tbl(['with_barcode', 'all_rows'], [[12, 0]])],
        answer: 0,
        explain: 'The 12 rows are still there. The new box is NULL in all of them, and COUNT(column) skips NULLs, so 0 have a barcode.',
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap to rename the column `phone` of the customers table to `mobile`.',
        template: 'ALTER TABLE customers RENAME COLUMN phone ___ mobile;\nSELECT name, mobile FROM customers WHERE id = 1;\n',
        blanks: [{ options: ['TO', 'AS', 'INTO'], answer: 'TO' }],
        output: tbl(['name', 'mobile'], [['Amina Nakato', '0700 000 101']]),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'ALTER products ADD COLUMN barcode TEXT;\n',
        question: 'This fails with a syntax error near products. What is missing?',
        options: ['The word TABLE after ALTER', 'The word FROM', 'A type for products', 'Brackets around barcode'],
        answer: 0,
        explain: 'The command is `ALTER TABLE`, two words, just like `CREATE TABLE`.',
        fixed: 'ALTER TABLE products ADD COLUMN barcode TEXT;\n',
      },
      {
        t: 'quiz',
        question: 'What does `DROP TABLE IF EXISTS notes;` do when there is no table called notes?',
        options: ['Nothing, and no error', 'It creates the table', 'An error “no such table”', 'It deletes another table'],
        answer: 0,
        explain: 'IF EXISTS makes the command safe to run again and again.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'ALTER products ADD COLUMN barcode TEXT;', why: 'It is ALTER TABLE.', right: 'ALTER TABLE products ADD COLUMN barcode TEXT;', stdin: DUUKA },
          { wrong: 'DROP TABLE customer;', why: 'The table is called customers, with an s. SQL says “no such table”.', right: 'DROP TABLE customers;', stdin: DUUKA },
          { wrong: 'ALTER TABLE products ADD COLUMN barcode TEXT NOT NULL;', why: 'The 12 existing rows would have an empty barcode, which NOT NULL forbids. A new required column needs a DEFAULT.', right: "ALTER TABLE products ADD COLUMN barcode TEXT NOT NULL DEFAULT 'none';", stdin: DUUKA },
          { wrong: 'DROP TABLE IF EXIST customers;', why: 'The words are IF EXISTS, with an S.', right: 'DROP TABLE IF EXISTS customers;', stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          '`ALTER TABLE t ADD COLUMN name type;` adds a column that is NULL for every existing row.',
          '`ALTER TABLE t RENAME COLUMN old TO new;` and `ALTER TABLE t DROP COLUMN name;` rename and remove a column.',
          'A new `NOT NULL` column needs a `DEFAULT`.',
          '`DROP TABLE [IF EXISTS] t;` deletes the table and all its rows. In a real database that is permanent.',
        ],
        memory: 'ALTER reshapes the table. DROP removes it. Back up first.',
      },
    ],
    exercises: [
      {
        id: 'sql17-add-email',
        title: 'Room for email addresses',
        prompt: 'Add a column `email` (TEXT) to the `customers` table. Then show `name` and `email` of all customers ordered by `id`.',
        starter: '-- Add the email column, then show name and email ordered by id\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['name', 'email'], CUSTOMERS.map((r) => [r[1], null])) },
          { input: DUUKA_B, expected: tbl(['name', 'email'], CUSTOMERS_B.map((r) => [r[1], null])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'ALTER TABLE, the table name, ADD COLUMN, the name and the type.',
          '`ALTER TABLE customers ADD COLUMN email TEXT;` then `SELECT name, email FROM customers ORDER BY id;`',
          'A similar example: `ALTER TABLE products ADD COLUMN barcode TEXT;` adds a barcode column. Yours adds email to customers.',
        ],
      },
      {
        id: 'sql17-rename',
        title: 'A better column name',
        prompt: 'Rename the column `stock` of the `products` table to `quantity`. Then show `name` and `quantity` of the products in the category `School`.',
        starter: '-- Rename stock to quantity, then show name and quantity of School products\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['name', 'quantity'], PRODUCTS.filter((r) => r[2] === 'School').map((r) => [r[1], r[4]])) },
          { input: DUUKA_B, expected: tbl(['name', 'quantity'], PRODUCTS_B.filter((r) => r[2] === 'School').map((r) => [r[1], r[4]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'ALTER TABLE ... RENAME COLUMN old TO new.',
          "`ALTER TABLE products RENAME COLUMN stock TO quantity;` and then `SELECT name, quantity FROM products WHERE category = 'School';`",
          'A similar example: `ALTER TABLE customers RENAME COLUMN phone TO mobile;` renames one column. Yours renames stock.',
        ],
      },
      {
        id: 'sql17-drop',
        title: 'Remove the customers page',
        prompt: 'Remove the `customers` table, written so that it does NOT fail if the table is already gone. Then list the names of all tables with `SELECT name FROM sqlite_master WHERE type = \'table\' ORDER BY name;`.',
        starter: "-- Drop the customers table safely, then list the table names\n",
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['name'], [['products']]) },
          { input: DUUKA_B, expected: tbl(['name'], [['products']]), hidden: true, name: 'Another shop' },
          { input: 'CREATE TABLE products (id INTEGER);', expected: tbl(['name'], [['products']]), hidden: true, name: 'A database with no customers table' },
        ],
        hints: [
          'DROP TABLE, and one more word that makes it safe when the table does not exist.',
          "`DROP TABLE IF EXISTS customers;` then the SELECT from sqlite_master.",
          'A similar example: `DROP TABLE IF EXISTS notes;` removes notes if it is there. Yours removes customers.',
        ],
      },
    ],
  },

  // ================================================================== 18
  {
    id: 'sql-build-duuka',
    level: LEVEL,
    minutes: 30,
    title: 'Project: build the duuka database',
    summary: 'Create a table with rules, fill it, record a sale, and tidy up: all from an empty database',
    blocks: [
      {
        t: 'story',
        title: 'Day one',
        text: "A new shop opens next to the bus park. Its owner has no database at all. “Build me the stock book from nothing,” she says. “It must refuse a product with no name. It must refuse a price of zero. And it must never let me add the same product twice.”\n\nYou now know how to do all of that. This project does it in four steps: design, fill, sell, check.",
      },
      { t: 'h', text: 'Step 1: design the table and fill it' },
      { t: 'p', text: 'The rules go in `CREATE TABLE`: the name is required and unique, the price is required and must be above zero, the stock is required and starts at 0.' },
      {
        t: 'project',
        title: 'Create and fill products',
        code: "CREATE TABLE products (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  price INTEGER NOT NULL CHECK (price > 0),\n  stock INTEGER NOT NULL DEFAULT 0\n);\nINSERT INTO products (name, price, stock) VALUES\n  ('Sugar 1kg', 4500, 20),\n  ('Rice 1kg', 3800, 35),\n  ('Soap bar', 1500, 40);\nSELECT * FROM products;\n",
        output: tables(changed(3), tbl(SHOP_COLS, shopRows(SHOP_A))),
      },
      { t: 'h', text: 'Step 2: record a sale' },
      { t: 'p', text: 'A customer buys 2 bags of sugar. Two things must happen: a new sales table records it, and the stock of sugar goes down by 2.' },
      {
        t: 'project',
        title: 'Sell two sugars',
        stdin: shopSetup(SHOP_A),
        code: "CREATE TABLE sales (\n  id INTEGER PRIMARY KEY,\n  product_id INTEGER NOT NULL,\n  qty INTEGER NOT NULL CHECK (qty > 0),\n  sold_on TEXT DEFAULT '2026-11-15'\n);\nINSERT INTO sales (product_id, qty) VALUES (1, 2);\nUPDATE products SET stock = stock - 2 WHERE id = 1;\nSELECT name, stock FROM products ORDER BY id;\n",
        output: tables(changed(1), changed(1), tbl(['name', 'stock'], [['Sugar 1kg', 18], ['Rice 1kg', 35], ['Soap bar', 40]])),
      },
      { t: 'h', text: 'Step 3: the table protects itself' },
      { t: 'p', text: 'A shop assistant tries to add Rice again by mistake. The table refuses. This is what your rules are for.' },
      {
        t: 'bug',
        stdin: shopSetup(SHOP_A),
        code: "INSERT INTO products (name, price) VALUES ('Rice 1kg', 3800);\n",
        question: 'This fails with “UNIQUE constraint failed: products.name”. Why is that good?',
        options: ['The table refuses a second Rice 1kg, so the stock book cannot get duplicates', 'It is a mistake in SQL itself', 'It deletes the first Rice', 'It changes the price'],
        answer: 0,
        explain: 'The UNIQUE rule on name did its job. Without it the shop would have two Rice lines and the stock counts would be wrong.',
        fixed: "INSERT INTO products (name, price) VALUES ('Salt 500g', 1000);\n",
      },
      { t: 'h', text: 'Step 4: end of day cleanup' },
      {
        t: 'project',
        title: 'Remove sold-out products',
        stdin: "CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, price INTEGER NOT NULL CHECK (price > 0), stock INTEGER NOT NULL DEFAULT 0);\nINSERT INTO products (name, price, stock) VALUES ('Sugar 1kg', 4500, 20), ('Milk 500ml', 1800, 0), ('Soap bar', 1500, 40);",
        code: 'DELETE FROM products WHERE stock = 0;\nSELECT name, stock FROM products ORDER BY id;\n',
        output: tables(changed(1), tbl(['name', 'stock'], [['Sugar 1kg', 20], ['Soap bar', 40]])),
      },
      {
        t: 'quiz',
        question: 'Which line of the table design makes it refuse a product with a price of 0?',
        options: ['price INTEGER NOT NULL CHECK (price > 0)', 'name TEXT NOT NULL UNIQUE', 'stock INTEGER NOT NULL DEFAULT 0', 'id INTEGER PRIMARY KEY'],
        answer: 0,
        explain: 'NOT NULL forbids an empty price, and CHECK (price > 0) forbids zero and negative prices.',
      },
      {
        t: 'recap',
        items: [
          'A good table is designed with rules (`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`) so it refuses bad data by itself.',
          'A sale is two changes: a new row in `sales`, and an `UPDATE` of the stock.',
          'Always name the columns in `INSERT`, and always use `WHERE` with `UPDATE` and `DELETE`.',
          'Level 3 is done: you can build and change a database. Next: many tables that work together.',
        ],
        memory: 'Design, fill, change, protect.',
      },
    ],
    exercises: [
      {
        id: 'sql18-build',
        title: 'Build a tools shop',
        prompt: 'Create a table `tools` with: `id` INTEGER PRIMARY KEY, `name` TEXT that is required and unique, `price` INTEGER that is required and must be greater than 0, and `qty` INTEGER that is required and starts at 0. Insert two tools in ONE statement: `Hammer` priced `15000` with qty `10`, and `Saw` priced `22000` with qty `4`. Then show all rows of `tools`.',
        starter: '-- Create tools with its rules, insert Hammer and Saw in one INSERT, then show the table\n',
        tests: [
          { input: '', expected: tables(changed(2), tbl(['id', 'name', 'price', 'qty'], [[1, 'Hammer', 15000, 10], [2, 'Saw', 22000, 4]])) },
          { input: DUUKA, expected: tables(changed(2), tbl(['id', 'name', 'price', 'qty'], [[1, 'Hammer', 15000, 10], [2, 'Saw', 22000, 4]])), hidden: true, name: 'A database with other tables' },
        ],
        hints: [
          'Think in two parts: CREATE TABLE with four columns and their rules, then one INSERT with two brackets of values.',
          "`price INTEGER NOT NULL CHECK (price > 0)` and `qty INTEGER NOT NULL DEFAULT 0`, and `name TEXT NOT NULL UNIQUE`.",
          "A similar example: `CREATE TABLE badges (id INTEGER PRIMARY KEY, label TEXT NOT NULL UNIQUE, level INTEGER DEFAULT 1);` Yours has more rules.",
        ],
      },
      {
        id: 'sql18-sell',
        title: 'Sell three rice',
        prompt: 'The `products` table from the project exists. A customer buys 3 of `Rice 1kg`: take 3 away from its stock. Then show `name` and `stock` of all products ordered by id. (Use the shop\'s own rice if it has one.)',
        starter: '-- Reduce the stock of Rice 1kg by 3, then show name and stock of all products by id\n',
        usesInput: true,
        sampleInput: shopSetup(SHOP_A),
        tests: [
          { input: shopSetup(SHOP_A), expected: tables(changed(1), tbl(['name', 'stock'], SHOP_A.map((r) => [r[0], r[0] === 'Rice 1kg' ? r[2] - 3 : r[2]]))) },
          { input: shopSetup([['Rice 1kg', 3800, 10], ['Beans 1kg', 4200, 14]]), expected: tables(changed(1), tbl(['name', 'stock'], [['Rice 1kg', 7], ['Beans 1kg', 14]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'UPDATE with a calculation from the old stock, and a WHERE that picks the rice by name.',
          "`UPDATE products SET stock = stock - 3 WHERE name = 'Rice 1kg';`",
          "A similar example: `UPDATE products SET stock = stock - 1 WHERE name = 'Soap bar';` sells one soap. Yours sells 3 rice.",
        ],
      },
      {
        id: 'sql18-tidy',
        title: 'End-of-day tidy up',
        prompt: 'In the `products` table of this small shop, delete every product that is out of stock (stock is 0). Then show how many products remain, headed `remaining`, and the total stock of those, headed `units`.',
        starter: '-- Delete the sold-out products, then show remaining (how many) and units (total stock)\n',
        usesInput: true,
        sampleInput: shopSetup(SHOP_B),
        tests: [
          { input: shopSetup(SHOP_B), expected: tables(changed(SHOP_B.filter((r) => r[2] === 0).length), tbl(['remaining', 'units'], [[SHOP_B.filter((r) => r[2] !== 0).length, SHOP_B.reduce((n, r) => n + r[2], 0)]])) },
          { input: shopSetup(SHOP_A), expected: tables(changed(0), tbl(['remaining', 'units'], [[3, 95]])), hidden: true, name: 'A shop with nothing sold out' },
        ],
        hints: [
          'First a DELETE with a WHERE. Then one SELECT that has a COUNT and a SUM.',
          '`DELETE FROM products WHERE stock = 0;` then `SELECT COUNT(*) AS remaining, SUM(stock) AS units FROM products;`',
          "A similar example: `SELECT COUNT(*) AS n, SUM(price) AS total FROM products;` gives a count and a sum together. Yours counts rows and sums stock.",
        ],
      },
    ],
  },
];
