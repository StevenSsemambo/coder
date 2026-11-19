// SQL, Level 5: Market-ready SQL. Lessons 26 to 29 (schema design, indexes, views, transactions).
// Prose uses double-quoted strings. SQL code uses plain template literals.
// Expected outputs are computed from plain JavaScript data (see world.js), never from the SQL itself.
import { DUUKA_R, DUUKA_R_B, tbl, tables, tableScript, changed } from './shared.js';
import { WA, WB, byCustomer, orderTotal, cmp, sum, uniq } from './world.js';

const LEVEL = 'Level 5: Market-ready SQL';

/** What the app prints for EXPLAIN QUERY PLAN: one column of readable text. */
const plan = (...lines) => tbl(['plan'], lines.map((l) => [l]));

// ---------------------------------------------------------------- lesson 26: one messy sheet
const MESSY_COLS = ['id', 'customer', 'phone', 'product', 'price', 'qty'];
const MESSY_A = [
  [1, 'Amina Nakato', '0700 000 101', 'Sugar 1kg', 4500, 2],
  [2, 'Amina Nakato', '0700 000 101', 'Rice 1kg', 3800, 1],
  [3, 'Brian Okello', '0700 000 102', 'Sugar 1kg', 4500, 1],
  [4, 'Grace Atim', '0700 000 103', 'Soap bar', 1500, 3],
  [5, 'Brian Okello', '0700 000 102', 'Soap bar', 1500, 2],
  [6, 'Amina Nakato', '0700 000 101', 'Soap bar', 1500, 1],
];
const MESSY_B = [
  [1, 'Sarah Auma', '0700 000 201', 'Beans 1kg', 4200, 2],
  [2, 'Sarah Auma', '0700 000 201', 'Pencil', 300, 10],
  [3, 'Peter Ssemwogerere', '0700 000 202', 'Beans 1kg', 4200, 1],
  [4, 'Ruth Nabirye', '0700 000 203', 'Pencil', 300, 4],
  [5, 'Peter Ssemwogerere', '0700 000 202', 'Notebook', 1500, 3],
];
const MESSY_SQL = 'id INTEGER PRIMARY KEY, customer TEXT, phone TEXT, product TEXT, price INTEGER, qty INTEGER';
const messy = (rows) => tableScript('messy_sales', MESSY_SQL, rows);
/** distinct (customer, phone) sorted by name, with the ids 1, 2, 3... that INSERT ... SELECT DISTINCT ... ORDER BY gives. */
const customersOf = (rows) => uniq(rows.map((r) => `${r[1]}|${r[2]}`)).map((k) => k.split('|')).sort((a, b) => cmp(a[0], b[0])).map((c, i) => [i + 1, c[0], c[1]]);
const productsOf = (rows) => uniq(rows.map((r) => `${r[3]}|${r[4]}`)).map((k) => k.split('|')).sort((a, b) => cmp(a[0], b[0])).map((p, i) => [i + 1, p[0], Number(p[1])]);
const CUSTOMER_TABLE = 'CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, phone TEXT);';
const prebuilt = (rows) =>
  `${messy(rows)}\n\n${tableScript('customers', 'id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, phone TEXT', customersOf(rows))}\n\n${tableScript('products', 'id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, price INTEGER NOT NULL', productsOf(rows))}`;

// ---------------------------------------------------------------- lesson 28: a saved question
const VIEW_TOTALS = 'CREATE VIEW order_totals AS\nSELECT o.id AS order_id, SUM(i.qty * p.price) AS total\nFROM orders o\nJOIN order_items i ON i.order_id = o.id\nJOIN products p ON p.id = i.product_id\nGROUP BY o.id;';
const totals = (W) => W.O.map((o) => [o[0], orderTotal(W, o[0])]);

// ---------------------------------------------------------------- lesson 29: a mobile money wallet
const ACC_SQL = 'id INTEGER PRIMARY KEY, owner TEXT NOT NULL, balance INTEGER NOT NULL CHECK (balance >= 0)';
const ACC_A = [[1, 'Amina', 50000], [2, 'Brian', 20000]];
const ACC_B = [[1, 'Sarah', 30000], [2, 'Peter', 10000]];
const accSetup = (rows) => tableScript('accounts', ACC_SQL, rows);
const owners = (rows) => tbl(['owner', 'balance'], rows.map((r) => [r[1], r[2]]));
/** the accounts after moving `amount` from account 1 to account 2 */
const moved = (rows, amount) => rows.map((r) => [r[0], r[1], r[0] === 1 ? r[2] - amount : r[0] === 2 ? r[2] + amount : r[2]]);

export const level5a = [
  // ================================================================== 26
  {
    id: 'sql-design',
    level: LEVEL,
    minutes: 30,
    title: 'Designing tables well',
    summary: 'Spot a badly designed table and fix it: one fact in one place, linked by ids',
    blocks: [
      {
        t: 'story',
        title: 'Ivan\'s giant sheet',
        text: "Nakato's cousin Ivan keeps the sales of his own shop on ONE big sheet. Every line has the customer's name and phone, the product name and price, and the quantity. It looks simple. Then trouble starts. Amina bought three times, so her phone number is written three times. One day the price of sugar rises and Ivan changes it on one line, but forgets the others. Now sugar costs two different prices in the same book. When he deletes Grace's only sale by mistake, her phone number disappears from the shop forever.\n\nThe sheet is one table doing the work of three: customers, products and sales. Good database design is splitting it so that every fact lives in exactly one place.",
      },
      { t: 'p', text: 'This is Ivan\'s sheet, as a table called `messy_sales`:' },
      {
        t: 'try',
        stdin: messy(MESSY_A),
        code: 'SELECT * FROM messy_sales;\n',
        output: tbl(MESSY_COLS, MESSY_A),
      },
      {
        t: 'list',
        items: [
          '**Repeated data**: the same name, phone and price written again and again. Every copy is a chance for a typo.',
          '**Update trouble**: change a price in one row and the other rows still say the old one.',
          '**Delete trouble**: remove the last sale of a customer and you lose the customer\'s details too.',
          '**Insert trouble**: you cannot record a new product until somebody buys it.',
        ],
      },
      { t: 'p', text: 'Watch the update trouble happen. Sugar is on two lines. We change the price on only the first.' },
      {
        t: 'predict',
        stdin: messy(MESSY_A),
        code: "UPDATE messy_sales SET price = 4800 WHERE id = 1;\nSELECT DISTINCT product, price FROM messy_sales WHERE product = 'Sugar 1kg' ORDER BY price;\n",
        question: 'How many different prices does Sugar 1kg have now?',
        options: [
          tables(changed(1), tbl(['product', 'price'], [['Sugar 1kg', 4500], ['Sugar 1kg', 4800]])),
          tables(changed(1), tbl(['product', 'price'], [['Sugar 1kg', 4800]])),
          tables(changed(1), tbl(['product', 'price'], [['Sugar 1kg', 4500]])),
          tables(changed(2), tbl(['product', 'price'], [['Sugar 1kg', 4800]])),
        ],
        answer: 0,
        explain: 'Only row 1 was changed, row 3 still says 4500. The database now disagrees with itself, and nobody knows which price is true. This cannot happen when the price is stored in ONE place.',
      },
      { t: 'h', text: 'The three rules in plain words' },
      {
        t: 'list',
        items: [
          '**One table, one kind of thing.** Customers in one table, products in another, sales in a third.',
          '**One fact, one place.** A phone number is written once, in the customers table.',
          '**Link with ids.** A sale says “customer 2, product 1”, not the name and price again. (Database books call this normalisation.)',
        ],
      },
      { t: 'p', text: 'You can build the new tables from the old sheet with `INSERT ... SELECT`: it fills a table with the result of a query. `DISTINCT` removes the repeats. Start with the customers:' },
      {
        t: 'try',
        stdin: messy(MESSY_A),
        code: 'CREATE TABLE customers (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  phone TEXT\n);\nINSERT INTO customers (name, phone)\nSELECT DISTINCT customer, phone FROM messy_sales ORDER BY customer;\nSELECT * FROM customers;\n',
        output: tables(changed(customersOf(MESSY_A).length), tbl(['id', 'name', 'phone'], customersOf(MESSY_A))),
      },
      { t: 'analogy', text: "Moving from the giant sheet to separate tables is like a tidy kitchen: all the spices in one rack, all the plates in one cupboard. The recipe (a sale) only says “two spoons from the spice rack, position 3”. If a spice jar is refilled, every recipe is right at once." },
      {
        t: 'fill',
        stdin: messy(MESSY_A),
        prompt: 'Fill the gap so each customer appears only once.',
        template: 'SELECT ___ customer, phone FROM messy_sales ORDER BY customer;\n',
        blanks: [{ options: ['DISTINCT', 'UNIQUE', 'ONLY'], answer: 'DISTINCT' }],
        output: tbl(['customer', 'phone'], customersOf(MESSY_A).map((c) => [c[1], c[2]])),
      },
      {
        t: 'bug',
        stdin: `${messy(MESSY_A)}\n\n${CUSTOMER_TABLE}`,
        code: 'INSERT INTO customers (name, phone)\nSELECT DISTINCT customer FROM messy_sales;\n',
        question: 'This fails with “1 values for 2 columns”. What is wrong?',
        options: ['Two columns are filled but the SELECT gives only one', 'DISTINCT cannot be used in INSERT', 'The customers table has no rows', 'ORDER BY is missing'],
        answer: 0,
        explain: 'Like a plain INSERT, the number of columns you fill must equal the number of columns the SELECT returns.',
        fixed: 'INSERT INTO customers (name, phone)\nSELECT DISTINCT customer, phone FROM messy_sales;\n',
      },
      {
        t: 'quiz',
        question: 'Which is a sign of a badly designed table?',
        options: ['The same customer phone number is written on many rows', 'It has a primary key', 'Its columns have types', 'It has fewer than ten columns'],
        answer: 0,
        explain: 'A value repeated across rows is a fact stored in many places. Move it to its own table and point at it with an id.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'INSERT INTO customers (name, phone) SELECT DISTINCT customer FROM messy_sales;', why: 'Two columns are named, only one is selected.', right: 'INSERT INTO customers (name, phone) SELECT DISTINCT customer, phone FROM messy_sales;', stdin: `${messy(MESSY_A)}\n\n${CUSTOMER_TABLE}` },
          { wrong: 'INSERT INTO customers (name, phone) SELECT customer, phone FROM messy_sales;', why: 'Without DISTINCT, Amina is copied three times, but the name column is UNIQUE, so the table refuses the second copy.', right: 'INSERT INTO customers (name, phone) SELECT DISTINCT customer, phone FROM messy_sales;', stdin: `${messy(MESSY_A)}\n\n${CUSTOMER_TABLE}` },
          {
            wrong: 'CREATE TABLE sales (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO sales (id, customer_id, product_id, qty)\nSELECT m.id, c.id, p.id, m.qty\nFROM messy_sales m\nJOIN customers c ON c.phone = m.customer\nJOIN products p ON p.name = m.product;',
            why: 'The customers are matched on the wrong columns (phone against name), so no row matches and nothing is copied. SQL says (0 rows changed), no error. Always check the row count.',
            right: 'CREATE TABLE sales (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO sales (id, customer_id, product_id, qty)\nSELECT m.id, c.id, p.id, m.qty\nFROM messy_sales m\nJOIN customers c ON c.name = m.customer\nJOIN products p ON p.name = m.product;',
            logic: true,
            stdin: prebuilt(MESSY_A),
          },
        ],
      },
      {
        t: 'recap',
        items: [
          'Bad signs: repeated values, a table about several kinds of thing, facts you must change in many places.',
          'Split by kind of thing. Each fact in one place. Link with ids (primary key in the parent, foreign key in the child).',
          '`INSERT INTO t (cols) SELECT ...` moves existing data into a new table. `DISTINCT` removes repeats.',
          'After copying data, always check the `(N rows changed)` line and look at the result.',
        ],
        memory: 'One kind of thing per table. One fact in one place.',
      },
    ],
    exercises: [
      {
        id: 'sql26-customers',
        title: 'Move the customers out',
        prompt: 'Create a table `customers` with `id` INTEGER PRIMARY KEY, `name` TEXT NOT NULL UNIQUE and `phone` TEXT. Fill it from `messy_sales` with each customer once (name and phone), in order of name. Then show `SELECT * FROM customers ORDER BY id;`.',
        starter: '-- Create customers, fill it from messy_sales (each customer once, ordered by name), then show it\n',
        usesInput: true,
        sampleInput: messy(MESSY_A),
        tests: [
          { input: messy(MESSY_A), expected: tables(changed(customersOf(MESSY_A).length), tbl(['id', 'name', 'phone'], customersOf(MESSY_A))) },
          { input: messy(MESSY_B), expected: tables(changed(customersOf(MESSY_B).length), tbl(['id', 'name', 'phone'], customersOf(MESSY_B))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'CREATE TABLE first, then INSERT ... SELECT DISTINCT, then a plain SELECT.',
          '`INSERT INTO customers (name, phone) SELECT DISTINCT customer, phone FROM messy_sales ORDER BY customer;`',
          'A similar example: `INSERT INTO towns (name) SELECT DISTINCT town FROM customers;` fills a towns table once per town. Yours fills customers from messy_sales.',
        ],
      },
      {
        id: 'sql26-products',
        title: 'Move the products out',
        prompt: 'Create a table `products` with `id` INTEGER PRIMARY KEY, `name` TEXT NOT NULL UNIQUE and `price` INTEGER NOT NULL. Fill it from `messy_sales` with each product once (name and price), in order of name. Then show `SELECT * FROM products ORDER BY id;`.',
        starter: '-- Create products, fill it from messy_sales (each product once, ordered by name), then show it\n',
        usesInput: true,
        sampleInput: messy(MESSY_A),
        tests: [
          { input: messy(MESSY_A), expected: tables(changed(productsOf(MESSY_A).length), tbl(['id', 'name', 'price'], productsOf(MESSY_A))) },
          { input: messy(MESSY_B), expected: tables(changed(productsOf(MESSY_B).length), tbl(['id', 'name', 'price'], productsOf(MESSY_B))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The same recipe as for customers, with the product columns.',
          '`INSERT INTO products (name, price) SELECT DISTINCT product, price FROM messy_sales ORDER BY product;`',
          "A similar example: `INSERT INTO suppliers (name, town) SELECT DISTINCT supplier, town FROM purchases ORDER BY supplier;` fills a suppliers table once per supplier. Yours fills products from messy_sales with the name and price.",
        ],
      },
      {
        id: 'sql26-sales',
        title: 'Link the sales with ids',
        prompt: 'The `customers` and `products` tables are built. Create `sales` with `id` INTEGER PRIMARY KEY, `customer_id` INTEGER NOT NULL, `product_id` INTEGER NOT NULL and `qty` INTEGER NOT NULL. Fill it from `messy_sales` by joining to find the ids (match customers on name and products on name; keep the same sale id). Then show `customer`, `product` and `qty` of every sale (names, joined back) ordered by sale id.',
        starter: '-- Create sales, fill it with ids found by joining, then show customer, product, qty ordered by sale id\n',
        usesInput: true,
        sampleInput: prebuilt(MESSY_A),
        tests: [
          { input: prebuilt(MESSY_A), expected: tables(changed(MESSY_A.length), tbl(['customer', 'product', 'qty'], MESSY_A.map((r) => [r[1], r[3], r[5]]))) },
          { input: prebuilt(MESSY_B), expected: tables(changed(MESSY_B.length), tbl(['customer', 'product', 'qty'], MESSY_B.map((r) => [r[1], r[3], r[5]]))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'INSERT ... SELECT with two JOINs: one to customers on the name, one to products on the name. Select the sale id, the two new ids and the qty.',
          '`SELECT m.id, c.id, p.id, m.qty FROM messy_sales m JOIN customers c ON c.name = m.customer JOIN products p ON p.name = m.product`',
          'Then check by joining back: `SELECT c.name AS customer, p.name AS product, s.qty FROM sales s JOIN customers c ON c.id = s.customer_id JOIN products p ON p.id = s.product_id ORDER BY s.id;`',
        ],
      },
    ],
  },

  // ================================================================== 27
  {
    id: 'sql-indexes',
    level: LEVEL,
    minutes: 26,
    title: 'Indexes and making queries fast',
    summary: 'Read a query plan, create an index, and know which columns deserve one',
    blocks: [
      {
        t: 'story',
        title: 'Finding a word in a thick book',
        text: "A dictionary has ten thousand words. To find “mango” you do not read from page one. You jump to the M section, then narrow down. The alphabetical order is the dictionary's index. Without it you would have to read every word.\n\nYour database works the same way. With a few hundred rows nobody notices. With a few hundred thousand rows (a busy shop, a mobile money service), a query that reads every row is painfully slow. An **index** is a sorted list that lets SQLite jump straight to the rows it needs.",
      },
      { t: 'p', text: 'To see how SQLite will run a query, put `EXPLAIN QUERY PLAN` in front of it. The answer is a short sentence. `SCAN` means “read every row”. `SEARCH` means “jump using an index”.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: "EXPLAIN QUERY PLAN\nSELECT * FROM products WHERE category = 'Food';\n",
        output: plan('SCAN products'),
      },
      { t: 'p', text: 'Now create an index on the column used in WHERE, and ask again.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: "CREATE INDEX idx_products_category ON products(category);\nEXPLAIN QUERY PLAN\nSELECT * FROM products WHERE category = 'Food';\n",
        output: plan('SEARCH products USING INDEX idx_products_category (category=?)'),
      },
      { t: 'analogy', text: "An index is a second, sorted copy of ONE column, with a pointer back to each row, like the tabs on the side of a notebook. Looking up “Food” in the tabs is instant. But the tabs must be kept up to date every time a row is added, which is why you do not put tabs on every column." },
      { t: 'p', text: 'Some lookups are already fast without you doing anything. The primary key is always indexed:' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'EXPLAIN QUERY PLAN\nSELECT * FROM products WHERE id = 5;\n',
        output: plan('SEARCH products USING INTEGER PRIMARY KEY (rowid=?)'),
      },
      { t: 'h', text: 'Foreign keys need their own index' },
      { t: 'p', text: 'SQLite does NOT create an index for a foreign key column. The orders table is searched by `customer_id` all the time (every customer statement), so it deserves one.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'EXPLAIN QUERY PLAN\nSELECT * FROM orders WHERE customer_id = 3;\n',
        output: plan('SCAN orders'),
      },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'CREATE INDEX idx_orders_customer ON orders(customer_id);\nEXPLAIN QUERY PLAN\nSELECT * FROM orders WHERE customer_id = 3;\n',
        output: plan('SEARCH orders USING INDEX idx_orders_customer (customer_id=?)'),
      },
      { t: 'h', text: 'Two columns, and what an index cannot do' },
      { t: 'p', text: 'An index on two columns helps a query that tests both. And an index cannot help a search for text that starts with `%`, because the sorted order does not tell you where “anything then oil” is.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: "CREATE INDEX idx_products_cat_price ON products(category, price);\nEXPLAIN QUERY PLAN\nSELECT name FROM products WHERE category = 'Food' AND price > 4000;\n",
        output: plan('SEARCH products USING INDEX idx_products_cat_price (category=? AND price>?)'),
      },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: "CREATE INDEX idx_products_name ON products(name);\nEXPLAIN QUERY PLAN\nSELECT * FROM products WHERE name LIKE '%oil%';\n",
        output: plan('SCAN products'),
      },
      { t: 'tip', text: 'Index the columns that appear in WHERE, in JOIN ... ON (especially foreign keys), and in ORDER BY on big tables. Do not index everything: every index uses space and slows down INSERT, UPDATE and DELETE a little, because the index must be updated too.' },
      {
        t: 'predict',
        stdin: DUUKA_R,
        code: 'CREATE INDEX idx_products_stock ON products(stock);\nEXPLAIN QUERY PLAN\nSELECT * FROM products WHERE price > 3000;\n',
        question: 'There is an index on stock. The query filters on price. What does the plan say?',
        options: [plan('SCAN products'), plan('SEARCH products USING INDEX idx_products_stock (stock=?)'), plan('SEARCH products USING INTEGER PRIMARY KEY (rowid=?)'), plan('SEARCH products USING INDEX idx_products_price (price>?)')],
        answer: 0,
        explain: 'An index only helps queries that use ITS column. The index on stock is useless for a filter on price, so SQLite reads every row.',
      },
      {
        t: 'fill',
        stdin: DUUKA_R,
        prompt: 'Fill the gap with the column that the query filters on.',
        template: 'CREATE INDEX idx_orders_customer ON orders(___);\nEXPLAIN QUERY PLAN\nSELECT * FROM orders WHERE customer_id = 3;\n',
        blanks: [{ options: ['customer_id', 'id', 'method'], answer: 'customer_id' }],
        output: plan('SEARCH orders USING INDEX idx_orders_customer (customer_id=?)'),
      },
      {
        t: 'bug',
        stdin: DUUKA_R,
        code: "CREATE UNIQUE INDEX idx_customers_phone ON customers(phone);\nINSERT INTO customers VALUES (7, 'Sam', '0700 000 101', 'Gulu');\n",
        question: 'A UNIQUE index forbids the same phone twice. This fails with “UNIQUE constraint failed: customers.phone”. Why?',
        options: ['0700 000 101 already belongs to Amina', 'Sam is not a valid name', 'An index cannot be created before an INSERT', 'The id 7 is too big'],
        answer: 0,
        explain: 'A UNIQUE index is both a speed-up and a rule: no two rows may share the value. Amina already has this phone.',
        fixed: "CREATE UNIQUE INDEX idx_customers_phone ON customers(phone);\nINSERT INTO customers VALUES (7, 'Sam', '0700 000 107', 'Gulu');\n",
      },
      {
        t: 'quiz',
        question: 'Which columns deserve an index on a big table?',
        options: ['Columns used in WHERE, in JOIN ... ON, and in ORDER BY', 'Every column, always', 'Only the primary key', 'Columns that are never searched'],
        answer: 0,
        explain: 'Indexes speed up the lookups you actually do. Each one also costs space and a little time on every write, so choose the useful ones.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'CREATE INDEX idx_a ON products(category);\nCREATE INDEX idx_a ON products(price);', why: 'Two indexes cannot have the same name.', right: 'CREATE INDEX idx_a ON products(category);\nCREATE INDEX idx_b ON products(price);', stdin: DUUKA_R },
          { wrong: 'CREATE INDEX idx_colour ON products(colour);', why: 'The products table has no colour column.', right: 'CREATE INDEX idx_category ON products(category);', stdin: DUUKA_R },
          { wrong: "CREATE INDEX idx_products_name ON products(name);\nEXPLAIN QUERY PLAN SELECT * FROM products WHERE category = 'Food';", why: 'The index is on name, but the query filters on category, so the plan still says SCAN. No error, just no speed-up. Index the column you search by.', right: "CREATE INDEX idx_products_category ON products(category);\nEXPLAIN QUERY PLAN SELECT * FROM products WHERE category = 'Food';", logic: true, stdin: DUUKA_R },
        ],
      },
      {
        t: 'recap',
        items: [
          '`EXPLAIN QUERY PLAN` shows how a query will run: `SCAN` reads every row, `SEARCH ... USING INDEX` jumps.',
          '`CREATE INDEX name ON table(column);` makes lookups on that column fast. `CREATE UNIQUE INDEX` also forbids duplicates.',
          'The primary key is indexed for free. Foreign keys are not: index them.',
          'An index does not help `LIKE \'%...\'`. Too many indexes slow down writes.',
        ],
        memory: 'Index what you search by. SCAN is slow, SEARCH is fast.',
      },
    ],
    exercises: [
      {
        id: 'sql27-category-index',
        title: 'Speed up category searches',
        prompt: 'Create an index named `idx_products_category` on the `category` column of `products`. Then show the query plan of `SELECT * FROM products WHERE category = \'Food\';` with `EXPLAIN QUERY PLAN`.',
        starter: "-- Create idx_products_category, then show the plan of the Food query\n",
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: [
          { input: DUUKA_R, expected: plan('SEARCH products USING INDEX idx_products_category (category=?)') },
          { input: DUUKA_R_B, expected: plan('SEARCH products USING INDEX idx_products_category (category=?)'), hidden: true, name: 'Another shop' },
        ],
        hints: [
          'CREATE INDEX, then the index name, ON, the table and the column in brackets. Then EXPLAIN QUERY PLAN in front of the SELECT.',
          '`CREATE INDEX idx_products_category ON products(category);`',
          "A similar example: `CREATE INDEX idx_orders_method ON orders(method);` indexes the method column of orders. Yours indexes category.",
        ],
      },
      {
        id: 'sql27-fk-index',
        title: 'Index a foreign key',
        prompt: 'The `order_items` table is searched by `order_id` all the time. Create an index named `idx_items_order` on `order_items(order_id)`, then show the query plan of `SELECT * FROM order_items WHERE order_id = 7;`.',
        starter: '-- Create idx_items_order on order_items(order_id), then show the plan of the order 7 query\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: [
          { input: DUUKA_R, expected: plan('SEARCH order_items USING INDEX idx_items_order (order_id=?)') },
          { input: DUUKA_R_B, expected: plan('SEARCH order_items USING INDEX idx_items_order (order_id=?)'), hidden: true, name: 'Another shop' },
        ],
        hints: [
          'The same two steps as the previous exercise, with the other table and column.',
          '`CREATE INDEX idx_items_order ON order_items(order_id);`, then `EXPLAIN QUERY PLAN SELECT * FROM order_items WHERE order_id = 7;`',
          'A similar example: `CREATE INDEX idx_orders_customer ON orders(customer_id);` indexes the foreign key of orders. Yours indexes the foreign key of order_items.',
        ],
      },
      {
        id: 'sql27-unique-phone',
        title: 'No two customers share a phone',
        prompt: 'Create a UNIQUE index named `idx_customers_phone` on `customers(phone)`. Then list the names of all indexes in the database with `SELECT name FROM sqlite_master WHERE type = \'index\' ORDER BY name;`.',
        starter: "-- Create the unique index, then list index names\n",
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: [
          { input: DUUKA_R, expected: tbl(['name'], [['idx_customers_phone']]) },
          { input: DUUKA_R_B, expected: tbl(['name'], [['idx_customers_phone']]), hidden: true, name: 'Another shop' },
        ],
        hints: [
          'It is CREATE UNIQUE INDEX instead of CREATE INDEX. Then a SELECT from sqlite_master.',
          '`CREATE UNIQUE INDEX idx_customers_phone ON customers(phone);`',
          "Then `SELECT name FROM sqlite_master WHERE type = 'index' ORDER BY name;`",
        ],
      },
    ],
  },

  // ================================================================== 28
  {
    id: 'sql-views',
    level: LEVEL,
    minutes: 24,
    title: 'Views: saving a question',
    summary: 'Give a long query a name, and use it like a table',
    blocks: [
      {
        t: 'story',
        title: 'The query nobody wants to type again',
        text: "Every Monday Nakato's sister needs the total of each order. It takes a three-table join to get it, and every Monday she writes it again, and every second Monday she makes a small mistake in it. “Can the database just remember this question?” she asks.\n\nIt can. A **view** is a query with a name. After you create it you use it exactly like a table, and SQL runs the saved question behind the scenes.",
      },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: `${VIEW_TOTALS}\nSELECT * FROM order_totals ORDER BY order_id;\n`,
        output: tbl(['order_id', 'total'], totals(WA)),
      },
      { t: 'p', text: 'A view can be joined, filtered and sorted like any table. Here: the customer name of every order worth more than 12000.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: `${VIEW_TOTALS}\nSELECT c.name, t.total\nFROM order_totals t\nJOIN orders o ON o.id = t.order_id\nJOIN customers c ON c.id = o.customer_id\nWHERE t.total > 12000\nORDER BY t.order_id;\n`,
        output: tbl(['name', 'total'], totals(WA).filter(([, t]) => t > 12000).map(([id, t]) => [WA.cust[WA.order[id][1]][1], t])),
      },
      { t: 'analogy', text: "A view is a window, not a photograph. A photograph copies the shop on one day and goes out of date. A window shows the shop as it is right now. The view stores only the QUESTION. Each time you look through it, the answer is worked out again from the real tables." },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: `${VIEW_TOTALS}\nUPDATE products SET price = 5000 WHERE id = 1;\nSELECT total FROM order_totals WHERE order_id = 1;\n`,
        output: tables(changed(1), tbl(['total'], [[sum(WA.lines.filter((l) => l.order[0] === 1), (l) => (l.product[0] === 1 ? 5000 : l.product[3]) * l.qty)]])),
      },
      { t: 'p', text: 'Sugar became 5000, and order 1 (2 sugars and 1 airtime at 5000) is now worth 15000. The view needed no repair. To remove a view, `DROP VIEW`. This never touches the data in the tables.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: `${VIEW_TOTALS}\nDROP VIEW IF EXISTS order_totals;\nSELECT name FROM sqlite_master WHERE type = 'view';\n`,
        output: tbl(['name'], []),
      },
      {
        t: 'predict',
        stdin: DUUKA_R,
        code: 'CREATE VIEW low AS SELECT name, stock FROM products WHERE stock < 20;\nDELETE FROM products WHERE id = 3;\nSELECT COUNT(*) AS n FROM low;\n',
        question: 'Four products have fewer than 20 in stock, including Cooking oil (id 3). We create the view, delete the oil, then count the view. What is n?',
        options: [tables(changed(1), tbl(['n'], [[3]])), tables(changed(1), tbl(['n'], [[4]])), tables(changed(1), tbl(['n'], [[0]])), tables(changed(1), tbl(['n'], [[1]]))],
        answer: 0,
        explain: 'The view does not keep a copy. It asks the products table every time. With the oil gone, only three low-stock products are left.',
      },
      {
        t: 'fill',
        stdin: DUUKA_R,
        prompt: 'Fill the gap so the view contains only products that cost LESS than 2000.',
        template: 'CREATE VIEW cheap AS SELECT name, price FROM products WHERE price ___ 2000;\nSELECT * FROM cheap ORDER BY price, name;\n',
        blanks: [{ options: ['<', '>', '='], answer: '<' }],
        output: tbl(['name', 'price'], WA.P.filter((p) => p[3] < 2000).map((p) => [p[1], p[3]]).sort((a, b) => a[1] - b[1] || cmp(a[0], b[0]))),
      },
      {
        t: 'bug',
        stdin: DUUKA_R,
        code: "CREATE VIEW names AS SELECT id, name FROM products;\nINSERT INTO names VALUES (99, 'Salt');\n",
        question: 'This fails with “cannot modify names because it is a view”. What is the fix?',
        options: ['Insert into the real products table, not into the view', 'Write VIEW in capitals', 'Add WHERE to the INSERT', 'Create the view twice'],
        answer: 0,
        explain: 'A view holds no rows of its own, so there is nothing to insert into. Change the real table; the view will show the change.',
        fixed: "CREATE VIEW names AS SELECT id, name FROM products;\nINSERT INTO products (id, name, category, price, stock) VALUES (99, 'Salt', 'Food', 1000, 40);\n",
      },
      {
        t: 'quiz',
        question: 'What does a view store?',
        options: ['The query, not the data', 'A copy of the data from the day it was made', 'Only the column names', 'Nothing at all'],
        answer: 0,
        explain: 'Each time you read the view, the stored query is run on the current tables.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `${VIEW_TOTALS}\n${VIEW_TOTALS}`, why: 'A view with that name already exists.', right: `${VIEW_TOTALS.replace('CREATE VIEW', 'CREATE VIEW IF NOT EXISTS')}\n`, stdin: DUUKA_R },
          { wrong: "CREATE VIEW names AS SELECT id, name FROM products;\nINSERT INTO names VALUES (99, 'Salt');", why: 'You cannot add rows to a view.', right: "CREATE VIEW names AS SELECT id, name FROM products;\nINSERT INTO products (id, name, category, price, stock) VALUES (99, 'Salt', 'Food', 1000, 40);", stdin: DUUKA_R },
          { wrong: 'SELECT * FROM order_total;', why: 'The view is called order_totals, with an s (and it must be created first). SQL says “no such table”.', right: `${VIEW_TOTALS}\nSELECT * FROM order_totals;`, stdin: DUUKA_R },
        ],
      },
      {
        t: 'recap',
        items: [
          '`CREATE VIEW name AS SELECT ...;` saves a question under a name. Use it like a table.',
          'A view stores the query, not the data: it is always up to date.',
          'You cannot INSERT, UPDATE or DELETE rows in a view. Change the real tables.',
          '`DROP VIEW [IF EXISTS] name;` removes the view, never the data. Views hide long joins and keep reports consistent.',
        ],
        memory: 'A view is a window, not a photograph.',
      },
    ],
    exercises: [
      {
        id: 'sql28-customer-spend',
        title: 'A view of customer spending',
        prompt: 'Create a view `customer_spend` with two columns: `name` (the customer\'s name) and `spent` (total of quantity times price of everything they bought; only customers who ordered). Then show `SELECT * FROM customer_spend ORDER BY spent DESC;`.',
        starter: '-- Create the view customer_spend (name, spent), then show it, biggest spender first\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: [
          { input: DUUKA_R, expected: tbl(['name', 'spent'], byCustomer(WA).filter(([, ls]) => ls.length).map(([c, ls]) => [c[1], sum(ls, (l) => l.total)]).sort((a, b) => b[1] - a[1])) },
          { input: DUUKA_R_B, expected: tbl(['name', 'spent'], byCustomer(WB).filter(([, ls]) => ls.length).map(([c, ls]) => [c[1], sum(ls, (l) => l.total)]).sort((a, b) => b[1] - a[1])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Write the spending query first (you did in lesson 22), then put CREATE VIEW name AS in front of it.',
          '`CREATE VIEW customer_spend AS SELECT c.name AS name, SUM(i.qty * p.price) AS spent FROM customers c JOIN orders o ... GROUP BY c.id;`',
          "A similar example: `CREATE VIEW class_sizes AS SELECT class, COUNT(*) AS pupils FROM students GROUP BY class;` saves a grouped query under a name. Yours saves the spending query.",
        ],
      },
      {
        id: 'sql28-low-stock',
        title: 'The restock view',
        prompt: 'Create a view `low_stock` with the `name` and `stock` of the products that have fewer than 20 in stock. Then show `SELECT * FROM low_stock ORDER BY stock, name;`.',
        starter: '-- Create the view low_stock (name, stock for stock < 20), then show it ordered by stock, then name\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: [
          { input: DUUKA_R, expected: tbl(['name', 'stock'], WA.P.filter((p) => p[4] < 20).map((p) => [p[1], p[4]]).sort((a, b) => a[1] - b[1] || cmp(a[0], b[0]))) },
          { input: DUUKA_R_B, expected: tbl(['name', 'stock'], WB.P.filter((p) => p[4] < 20).map((p) => [p[1], p[4]]).sort((a, b) => a[1] - b[1] || cmp(a[0], b[0]))), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'CREATE VIEW low_stock AS, then a plain SELECT with a WHERE.',
          '`CREATE VIEW low_stock AS SELECT name, stock FROM products WHERE stock < 20;`',
          'A similar example: `CREATE VIEW cheap AS SELECT name, price FROM products WHERE price < 2000;` Yours filters on stock.',
        ],
      },
      {
        id: 'sql28-use-view',
        title: 'Use a view someone else made',
        prompt: 'The view `order_totals` (columns `order_id` and `total`) already exists. Use it to show the average order total rounded to a whole number, headed `avg_order`.',
        starter: '-- avg_order: the average of order_totals.total, rounded\n',
        usesInput: true,
        sampleInput: `${DUUKA_R}\n\n${VIEW_TOTALS}`,
        tests: [
          { input: `${DUUKA_R}\n\n${VIEW_TOTALS}`, expected: tbl(['avg_order'], [[Math.round(sum(totals(WA), (t) => t[1]) / WA.O.length)]]) },
          { input: `${DUUKA_R_B}\n\n${VIEW_TOTALS}`, expected: tbl(['avg_order'], [[Math.round(sum(totals(WB), (t) => t[1]) / WB.O.length)]]), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Treat the view like a table: select from it.',
          '`SELECT ROUND(AVG(total)) AS avg_order FROM order_totals;`',
          'A similar example: `SELECT COUNT(*) AS n FROM low_stock;` counts the rows of a view. Yours averages one of its columns.',
        ],
      },
    ],
  },

  // ================================================================== 29
  {
    id: 'sql-transactions',
    level: LEVEL,
    minutes: 28,
    title: 'Transactions: all or nothing',
    summary: 'Group changes so that either all of them happen or none does, with a mobile money transfer',
    blocks: [
      {
        t: 'story',
        title: 'The money that vanished',
        text: "Amina sends 10,000 shillings to Brian by mobile money. Two things must happen: 10,000 comes OUT of Amina's account, and 10,000 goes INTO Brian's. Suppose the phone network drops right after the first step. Amina's money is gone, and Brian never got it. Ten thousand shillings have vanished from the world.\n\nPeople would stop trusting the service within a day. The fix is a **transaction**: a group of changes that is treated as ONE. Either every change in the group happens, or none of them does.",
      },
      { t: 'p', text: 'Open a transaction with `BEGIN;`. Do the changes. Then `COMMIT;` to keep them all, or `ROLLBACK;` to throw them all away. The wallet table below holds two accounts that can never go below zero.' },
      {
        t: 'try',
        stdin: accSetup(ACC_A),
        code: 'BEGIN;\nUPDATE accounts SET balance = balance - 10000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 10000 WHERE id = 2;\nCOMMIT;\nSELECT owner, balance FROM accounts ORDER BY id;\n',
        output: tables(changed(1), changed(1), owners(moved(ACC_A, 10000))),
      },
      { t: 'analogy', text: "A transaction is writing in pencil on a draft. While you are writing, nobody has the final copy. If you are happy, COMMIT is going over the pencil in ink. If something goes wrong, ROLLBACK is rubbing it all out. The page is never left half-written." },
      { t: 'p', text: 'See ROLLBACK work. Inside the transaction the money has moved. After ROLLBACK it is as if nothing happened.' },
      {
        t: 'try',
        stdin: accSetup(ACC_A),
        code: 'BEGIN;\nUPDATE accounts SET balance = balance - 10000 WHERE id = 1;\nSELECT owner, balance FROM accounts ORDER BY id;\nROLLBACK;\nSELECT owner, balance FROM accounts ORDER BY id;\n',
        output: tables(changed(1), owners([[1, 'Amina', 40000], [2, 'Brian', 20000]]), owners(ACC_A)),
      },
      { t: 'tip', text: 'Without a transaction, every single statement is saved at once on its own. That is why money can vanish between two statements. Anything that must happen together (a transfer, a sale plus the stock change, an order plus its items) belongs in one transaction.' },
      { t: 'h', text: 'The check that catches lost money' },
      { t: 'p', text: 'In a transfer the total of all balances must NOT change: money only moves. A quick `SUM(balance)` before and after is a good alarm.' },
      {
        t: 'predict',
        stdin: accSetup(ACC_A),
        code: 'BEGIN;\nUPDATE accounts SET balance = balance - 10000 WHERE id = 1;\nCOMMIT;\nSELECT SUM(balance) AS total FROM accounts;\n',
        question: 'The accounts hold 50000 and 20000 (70000 in total). Only the debit is done and then COMMIT. What is the total?',
        options: [tables(changed(1), tbl(['total'], [[60000]])), tables(changed(1), tbl(['total'], [[70000]])), tables(changed(1), tbl(['total'], [[80000]])), tables(changed(2), tbl(['total'], [[60000]]))],
        answer: 0,
        explain: 'A transaction only guarantees all-or-nothing for what you put in it. You forgot the credit, so 10000 shillings have left the system. COMMIT made the mistake permanent. Always check that the total is unchanged.',
      },
      {
        t: 'fill',
        stdin: accSetup(ACC_A),
        prompt: 'The transfer was a mistake. Fill the gap to throw the changes away.',
        template: 'BEGIN;\nUPDATE accounts SET balance = balance - 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 5000 WHERE id = 2;\n___;\nSELECT owner, balance FROM accounts ORDER BY id;\n',
        blanks: [{ options: ['ROLLBACK', 'COMMIT', 'SAVE'], answer: 'ROLLBACK' }],
        output: tables(changed(1), changed(1), owners(ACC_A)),
      },
      {
        t: 'bug',
        stdin: accSetup(ACC_A),
        code: 'UPDATE accounts SET balance = balance - 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 5000 WHERE id = 2;\nCOMMIT;\n',
        question: 'This fails with “cannot commit - no transaction is active”. What is wrong?',
        options: ['BEGIN was never run, so there is no transaction to commit', 'COMMIT must be written twice', 'The balance cannot be changed', 'The two UPDATEs must be one statement'],
        answer: 0,
        explain: 'COMMIT ends a transaction, but none was started. Open one with BEGIN before the changes.',
        fixed: 'BEGIN;\nUPDATE accounts SET balance = balance - 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 5000 WHERE id = 2;\nCOMMIT;\n',
      },
      {
        t: 'quiz',
        question: 'What does ROLLBACK do?',
        options: ['Undoes every change since BEGIN', 'Saves every change since BEGIN', 'Deletes the table', 'Undoes only the last statement'],
        answer: 0,
        explain: 'ROLLBACK throws away everything done since BEGIN. COMMIT is its opposite: it makes all of it permanent.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'COMMIT;', why: 'There is no open transaction.', right: 'BEGIN;\nCOMMIT;', stdin: accSetup(ACC_A) },
          { wrong: 'BEGIN;\nBEGIN;', why: 'A transaction cannot start inside another one. Finish the first with COMMIT or ROLLBACK.', right: 'BEGIN;\nCOMMIT;', stdin: accSetup(ACC_A) },
          { wrong: 'BEGIN;\nUPDATE accounts SET balance = balance - 99999 WHERE id = 1;\nCOMMIT;', why: 'Amina has only 50000. The CHECK rule (balance can never be negative) refuses the debit with an error. In a real app you would catch the error and ROLLBACK so the transfer does not half-happen.', right: 'BEGIN;\nUPDATE accounts SET balance = balance - 9999 WHERE id = 1;\nUPDATE accounts SET balance = balance + 9999 WHERE id = 2;\nCOMMIT;', stdin: accSetup(ACC_A) },
          { wrong: 'BEGIN;\nUPDATE accounts SET balance = balance - 5000 WHERE id = 1;\nCOMMIT;', why: 'A transaction around only the debit is still a lost-money bug: nothing credits Brian. SQL does not complain. The transaction must contain BOTH halves.', right: 'BEGIN;\nUPDATE accounts SET balance = balance - 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 5000 WHERE id = 2;\nCOMMIT;', logic: true, stdin: accSetup(ACC_A) },
        ],
      },
      {
        t: 'recap',
        items: [
          'A **transaction** groups changes: all happen or none does. `BEGIN;` opens it, `COMMIT;` keeps the changes, `ROLLBACK;` undoes them.',
          'Put everything that must happen together inside one transaction, and include BOTH halves of a transfer.',
          'Without a transaction every statement is saved immediately and alone.',
          'Check the invariant (the total of the money) after a transfer. A CHECK rule stops a balance going negative.',
        ],
        memory: 'BEGIN, do all the changes, then COMMIT or ROLLBACK.',
      },
    ],
    exercises: [
      {
        id: 'sql29-transfer',
        title: 'Send 15000',
        prompt: 'Move 15000 from account `1` to account `2` safely: open a transaction, subtract from account 1, add to account 2, commit. Then show `owner` and `balance` of all accounts ordered by id.',
        starter: '-- A transaction: debit account 1 by 15000, credit account 2 by 15000, commit, then show owner and balance\n',
        usesInput: true,
        sampleInput: accSetup(ACC_A),
        tests: [
          { input: accSetup(ACC_A), expected: tables(changed(1), changed(1), owners(moved(ACC_A, 15000))) },
          { input: accSetup(ACC_B), expected: tables(changed(1), changed(1), owners(moved(ACC_B, 15000))), hidden: true, name: 'Different accounts' },
        ],
        hints: [
          'Four statements in a row: BEGIN, two UPDATEs, COMMIT. Then the SELECT.',
          '`UPDATE accounts SET balance = balance - 15000 WHERE id = 1;` and `UPDATE accounts SET balance = balance + 15000 WHERE id = 2;`',
          "A similar example: moving 500 litres from tank 1 to tank 2: `BEGIN; UPDATE tanks SET litres = litres - 500 WHERE id = 1; UPDATE tanks SET litres = litres + 500 WHERE id = 2; COMMIT;` Yours moves 15000 shillings between accounts.",
        ],
      },
      {
        id: 'sql29-undo',
        title: 'Look, then undo',
        prompt: 'Start a transaction, move 8000 from account 1 to account 2 (two UPDATEs), show `owner` and `balance` of all accounts ordered by id, then ROLLBACK, and show the same table again.',
        starter: '-- BEGIN, move 8000 from account 1 to 2, SELECT, ROLLBACK, SELECT (owner and balance, ordered by id)\n',
        usesInput: true,
        sampleInput: accSetup(ACC_A),
        tests: [
          { input: accSetup(ACC_A), expected: tables(changed(1), changed(1), owners(moved(ACC_A, 8000)), owners(ACC_A)) },
          { input: accSetup(ACC_B), expected: tables(changed(1), changed(1), owners(moved(ACC_B, 8000)), owners(ACC_B)), hidden: true, name: 'Different accounts' },
        ],
        hints: [
          'The same two UPDATEs as a transfer, but the transaction ends with the word that undoes it.',
          'BEGIN; two UPDATEs; SELECT owner, balance FROM accounts ORDER BY id; ROLLBACK; and the same SELECT again.',
          "A similar example: `BEGIN; UPDATE tanks SET litres = litres - 500 WHERE id = 1; SELECT * FROM tanks; ROLLBACK; SELECT * FROM tanks;` shows the change, then undoes it and shows again. Yours has both UPDATEs of a transfer.",
        ],
      },
      {
        id: 'sql29-total',
        title: 'Is any money missing?',
        prompt: 'Move 5000 from account 1 to account 2 inside a transaction (commit it). Then show the total of all balances headed `total`. It must equal the total before the transfer.',
        starter: '-- Transfer 5000 from account 1 to 2 in a transaction, then show SUM(balance) as total\n',
        usesInput: true,
        sampleInput: accSetup(ACC_A),
        tests: [
          { input: accSetup(ACC_A), expected: tables(changed(1), changed(1), tbl(['total'], [[sum(ACC_A, (r) => r[2])]])) },
          { input: accSetup(ACC_B), expected: tables(changed(1), changed(1), tbl(['total'], [[sum(ACC_B, (r) => r[2])]])), hidden: true, name: 'Different accounts' },
        ],
        hints: [
          'BEGIN, the two UPDATEs, COMMIT, then a SUM over the whole accounts table.',
          '`SELECT SUM(balance) AS total FROM accounts;` after the COMMIT.',
          'A similar example: `SELECT SUM(stock) AS units FROM products;` totals a column. Yours totals balance.',
        ],
      },
    ],
  },
];
