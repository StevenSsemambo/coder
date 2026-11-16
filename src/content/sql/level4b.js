// SQL, Level 4: Many tables (continued). Lessons 23 to 25 (subqueries, many-to-many and self joins, the statement project).
// Prose uses double-quoted strings. SQL code uses plain template literals.
// Expected outputs are computed from plain JavaScript data (see world.js), never from the SQL itself.
import { DUUKA_R, DUUKA_R_B, tbl, tables, tableScript } from './shared.js';
import { WA, WB, byCustomer, byProduct, orderTotal, cmp, sum, uniq } from './world.js';

const LEVEL = 'Level 4: Many tables';

const pair = (fn) => [
  { input: DUUKA_R, expected: fn(WA) },
  { input: DUUKA_R_B, expected: fn(WB), hidden: true, name: 'A different shop' },
];
const avgPrice = (W) => sum(W.P, (p) => p[3]) / W.P.length;
const orderTotals = (W) => W.O.map((o) => orderTotal(W, o[0]));

// Staff, for the self-join in lesson 24: boss_id points at another row of the SAME table.
const STAFF_A = [[1, 'Nakato', null], [2, 'Ivan', 1], [3, 'Mercy', 1], [4, 'Peter', 2]];
const STAFF_B = [[1, 'Sarah', null], [2, 'Joel', 1], [3, 'Ruth', 2]];
const staffSetup = (rows) => tableScript('staff', 'id INTEGER PRIMARY KEY, name TEXT, boss_id INTEGER REFERENCES staff(id)', rows);
const bossOf = (rows, s) => (s[2] === null ? null : rows.find((r) => r[0] === s[2])[1]);

export const level4b = [
  // ================================================================== 23
  {
    id: 'sql-subqueries',
    level: LEVEL,
    minutes: 28,
    title: 'Queries inside queries',
    summary: 'Use the answer of one query inside another: above-average prices, IN, NOT IN, EXISTS',
    blocks: [
      {
        t: 'story',
        title: 'Above average',
        text: "“Which products cost more than the average price?” the landlord asks. Nakato knows the trick from lesson 8: first she works out the average price, then she goes through the list and keeps what is above it. Two steps, and the second step needs the answer of the first.\n\nIn SQL you can put the first step INSIDE the second, in brackets. A query inside a query is called a **subquery**.",
      },
      { t: 'p', text: 'Remember that `WHERE price > AVG(price)` is an error: aggregates cannot be used in WHERE. A subquery is the way around it, because the brackets finish the average first.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products)\nORDER BY price DESC;\n',
        output: tbl(['name', 'price'], WA.P.filter((p) => p[3] > avgPrice(WA)).map((p) => [p[1], p[3]]).sort((a, b) => b[1] - a[1])),
      },
      { t: 'analogy', text: "A subquery is a sticky note inside a recipe. The recipe says “use the amount on the note”, and the note says how much rice one person eats. SQL reads the note first, gets one answer, and uses it where the brackets are." },
      { t: 'h', text: 'IN and NOT IN with a list from another table' },
      { t: 'p', text: 'A subquery can return a whole column of values, and `IN` checks whether a value is in that list. No join needed.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'SELECT name FROM customers\nWHERE id IN (SELECT customer_id FROM orders)\nORDER BY name;\n',
        output: tbl(['name'], WA.C.filter((c) => WA.O.some((o) => o[1] === c[0])).map((c) => [c[1]]).sort((a, b) => cmp(a[0], b[0]))),
      },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'SELECT name FROM customers\nWHERE id NOT IN (SELECT customer_id FROM orders)\nORDER BY name;\n',
        output: tbl(['name'], WA.C.filter((c) => !WA.O.some((o) => o[1] === c[0])).map((c) => [c[1]]).sort((a, b) => cmp(a[0], b[0]))),
      },
      { t: 'h', text: 'A trap: NOT IN and NULL' },
      {
        t: 'predict',
        code: 'SELECT 1 AS r WHERE 5 NOT IN (1, NULL);\n',
        question: '5 is not 1, and NULL means unknown. What does this show?',
        options: [tbl(['r'], []), tbl(['r'], [[1]]), tbl(['r'], [[5]]), tbl(['r'], [[null]])],
        answer: 0,
        explain: 'Is 5 different from an UNKNOWN value? SQL cannot say yes, so the answer is not “true” and the row is dropped. If the list inside a NOT IN contains even one NULL, NOT IN finds nothing. Add `WHERE column IS NOT NULL` inside the brackets when the column can be empty.',
      },
      { t: 'h', text: 'A subquery in FROM, and EXISTS' },
      { t: 'p', text: 'A subquery in FROM is a temporary table you build on the spot. Give it a nickname. Here: first the total of each order, then the average of those totals.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'SELECT ROUND(AVG(t.total)) AS avg_order\nFROM (\n  SELECT o.id, SUM(i.qty * p.price) AS total\n  FROM orders o\n  JOIN order_items i ON i.order_id = o.id\n  JOIN products p ON p.id = i.product_id\n  GROUP BY o.id\n) t;\n',
        output: tbl(['avg_order'], [[Math.round(sum(orderTotals(WA), (x) => x) / WA.O.length)]]),
      },
      { t: 'p', text: '`EXISTS` asks “is there at least one row?” and the inner query may look at the outer row. Here: customers who have at least one order paid by Airtel.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: "SELECT c.name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id AND o.method = 'Airtel'\n);\n",
        output: tbl(['name'], WA.C.filter((c) => WA.O.some((o) => o[1] === c[0] && o[3] === 'Airtel')).map((c) => [c[1]])),
      },
      {
        t: 'fill',
        stdin: DUUKA_R,
        prompt: 'Fill the gap so the query keeps the products that cost more than the average price.',
        template: 'SELECT name FROM products WHERE price > (SELECT ___(price) FROM products) ORDER BY name;\n',
        blanks: [{ options: ['AVG', 'SUM', 'COUNT'], answer: 'AVG' }],
        output: tbl(['name'], WA.P.filter((p) => p[3] > avgPrice(WA)).map((p) => [p[1]]).sort((a, b) => cmp(a[0], b[0]))),
      },
      {
        t: 'bug',
        stdin: DUUKA_R,
        code: 'SELECT name FROM customers WHERE id IN (SELECT id, name FROM customers);\n',
        question: 'This fails with “sub-select returns 2 columns - expected 1”. What is wrong?',
        options: ['IN needs a list of single values, so the inner query may select only one column', 'IN cannot be used on customers', 'The inner query needs a WHERE', 'name cannot be used twice'],
        answer: 0,
        explain: 'IN compares one value with a list of values, so the brackets must return exactly one column.',
        fixed: 'SELECT name FROM customers WHERE id IN (SELECT id FROM customers);\n',
      },
      {
        t: 'quiz',
        question: 'Why can `WHERE price > (SELECT AVG(price) FROM products)` work when `WHERE price > AVG(price)` cannot?',
        options: ['The brackets work out the average first, as a single value, before WHERE checks any row', 'Brackets make SQL faster', 'AVG is allowed only in brackets', 'There is no difference'],
        answer: 0,
        explain: 'The subquery runs first and produces ONE number. WHERE then compares each price with that number.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT name FROM products WHERE price > AVG(price);', why: 'An aggregate cannot be used directly in WHERE.', right: 'SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products);', stdin: DUUKA_R },
          { wrong: 'SELECT name FROM customers WHERE id IN (SELECT id, name FROM customers);', why: 'The inner query returns two columns. IN needs exactly one.', right: 'SELECT name FROM customers WHERE id IN (SELECT id FROM customers);', stdin: DUUKA_R },
          { wrong: 'SELECT name FROM customers WHERE id = (SELECT customer_id FROM orders);', why: 'The inner query returns MANY ids but `=` expects one. SQLite does not complain: it quietly takes only the first. You get one customer instead of all who ordered. Use IN.', right: 'SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders);', logic: true, stdin: DUUKA_R },
        ],
      },
      {
        t: 'recap',
        items: [
          'A **subquery** is a query in brackets inside another query. It runs first.',
          'One value: `WHERE price > (SELECT AVG(price) FROM products)`. A list of values: `WHERE id IN (SELECT ...)`.',
          'A subquery in `FROM` is a temporary table; give it a nickname.',
          '`NOT IN` finds nothing if the list contains a NULL. `EXISTS` asks whether any matching row exists.',
        ],
        memory: 'Brackets run first. One column for IN. Beware NULL in NOT IN.',
      },
    ],
    exercises: [
      {
        id: 'sql23-above-average',
        title: 'Premium products',
        prompt: 'Show the `name` and `price` of every product that costs MORE than the average price of all products, ordered by name.',
        starter: '-- name and price of products priced above the average, ordered by name\nSELECT name, price FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['name', 'price'], W.P.filter((p) => p[3] > avgPrice(W)).map((p) => [p[1], p[3]]).sort((a, b) => cmp(a[0], b[0])))),
        hints: [
          'Compare the price with a number that is worked out by a query in brackets.',
          '`WHERE price > (SELECT AVG(price) FROM products)` then `ORDER BY name`.',
          'A similar example: `WHERE stock < (SELECT AVG(stock) FROM products)` keeps the products with below-average stock. Yours compares the price.',
        ],
      },
      {
        id: 'sql23-sold-products',
        title: 'Products that sell',
        prompt: 'Using a subquery with `IN`, show the `name` of every product that appears in at least one row of `order_items`, ordered by name.',
        starter: '-- Names of products that have been sold, using IN (SELECT ...), ordered by name\nSELECT name FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['name'], byProduct(W).filter(([, ls]) => ls.length).map(([p]) => [p[1]]).sort((a, b) => cmp(a[0], b[0])))),
        hints: [
          'The order_items table has a product_id column: that is your list of sold products.',
          '`WHERE id IN (SELECT product_id FROM order_items)`, then `ORDER BY name`.',
          'A similar example: `WHERE id IN (SELECT customer_id FROM orders)` keeps the customers who ordered. Yours keeps the products that were sold.',
        ],
      },
      {
        id: 'sql23-avg-order',
        title: 'The average order',
        prompt: 'What is the average value of an order? First work out the total of each order (quantity times price of its items) in a subquery in FROM with the nickname `t`, then show the average of those totals rounded to a whole number, headed `avg_order`.',
        starter: '-- avg_order: the average of the order totals, rounded\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['avg_order'], [[Math.round(sum(orderTotals(W), (x) => x) / W.O.length)]])),
        hints: [
          'Inside the brackets: join orders, order_items and products, and GROUP BY the order to get one total per order.',
          '`SELECT o.id, SUM(i.qty * p.price) AS total ... GROUP BY o.id` goes in brackets after FROM, nicknamed t. The outer query is `SELECT ROUND(AVG(t.total)) AS avg_order`.',
          'A similar example: `SELECT MAX(t.n) FROM (SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id) t;` finds the biggest number of orders any customer placed. Yours averages order totals.',
        ],
      },
    ],
  },

  // ================================================================== 24
  {
    id: 'sql-many-to-many',
    level: LEVEL,
    minutes: 26,
    title: 'Many-to-many and self joins',
    summary: 'See why order_items exists, answer questions across it, and join a table to itself',
    blocks: [
      {
        t: 'story',
        title: 'The order that holds many things',
        text: "One order can contain many products: sugar, rice and soap. And one product can appear in many orders. So where should Nakato write which product is in which order? In the orders table? There is room for only one product per line. In the products table? Same problem.\n\nShe needs a third page where each line says: “order 7 contains product 12, quantity 2”. One line for every pair. That third page is the `order_items` table you have been using, and it is called a **junction table** (or link table). It turns one many-to-many relation into two one-to-many relations.",
      },
      { t: 'analogy', text: "Think of a wedding guest list. One table of guests, one table of tables. Each guest could sit at different tables at different events, and each table seats many guests. The seating chart, with one line per (guest, table), is the junction." },
      { t: 'p', text: 'To answer questions that cross the junction, join through it. Which orders contained a Soap bar?' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: "SELECT o.id AS order_id\nFROM orders o\nJOIN order_items i ON i.order_id = o.id\nJOIN products p ON p.id = i.product_id\nWHERE p.name = 'Soap bar'\nORDER BY o.id;\n",
        output: tbl(['order_id'], uniq(WA.lines.filter((l) => l.product[1] === 'Soap bar').map((l) => l.order[0])).sort((a, b) => a - b).map((x) => [x])),
      },
      { t: 'p', text: 'And the other way round: what is inside order 7?' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'SELECT p.name, i.qty\nFROM order_items i\nJOIN products p ON p.id = i.product_id\nWHERE i.order_id = 7\nORDER BY i.id;\n',
        output: tbl(['name', 'qty'], WA.lines.filter((l) => l.order[0] === 7).map((l) => [l.product[1], l.qty])),
      },
      { t: 'p', text: 'How many DIFFERENT customers bought each product? `COUNT(DISTINCT ...)` counts each value once, even if it repeats.' },
      {
        t: 'try',
        stdin: DUUKA_R,
        code: 'SELECT p.name, COUNT(DISTINCT o.customer_id) AS buyers\nFROM products p\nJOIN order_items i ON i.product_id = p.id\nJOIN orders o ON o.id = i.order_id\nGROUP BY p.id\nORDER BY buyers DESC, p.name;\n',
        output: tbl(['name', 'buyers'], byProduct(WA).filter(([, ls]) => ls.length).map(([p, ls]) => [p[1], uniq(ls.map((l) => l.customer[0])).length]).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))),
      },
      { t: 'h', text: 'Joining a table to itself' },
      { t: 'p', text: 'Sometimes a table points at ITSELF. Nakato\'s staff table has a `boss_id` that holds the id of another staff member. To show each person next to their boss\'s name, join the table to itself, using two different nicknames: one for the person (`s`) and one for the boss (`b`).' },
      {
        t: 'try',
        stdin: tableScript('staff', 'id INTEGER PRIMARY KEY, name TEXT, boss_id INTEGER REFERENCES staff(id)', STAFF_A),
        code: 'SELECT s.name AS staff, b.name AS boss\nFROM staff s\nLEFT JOIN staff b ON s.boss_id = b.id\nORDER BY s.id;\n',
        output: tbl(['staff', 'boss'], STAFF_A.map((s) => [s[1], bossOf(STAFF_A, s)])),
      },
      {
        t: 'predict',
        stdin: staffSetup(STAFF_A),
        code: 'SELECT s.name AS staff, b.name AS boss\nFROM staff s\nLEFT JOIN staff b ON s.boss_id = b.id\nWHERE s.id = 1;\n',
        question: 'Nakato (id 1) is the owner and her boss_id is empty. What does this show?',
        options: [tbl(['staff', 'boss'], [['Nakato', null]]), tbl(['staff', 'boss'], [['Nakato', 'Nakato']]), tbl(['staff', 'boss'], []), tbl(['staff', 'boss'], [['Nakato', 'Ivan']])],
        answer: 0,
        explain: 'The owner has no boss, so there is no matching row for her on the right-hand side: the LEFT JOIN keeps her with NULL for the boss. An INNER JOIN would have dropped her.',
      },
      {
        t: 'fill',
        stdin: staffSetup(STAFF_A),
        prompt: 'Fill the gap: which column of the person points at the boss\'s id?',
        template: 'SELECT s.name AS staff, b.name AS boss FROM staff s LEFT JOIN staff b ON s.___ = b.id ORDER BY s.id;\n',
        blanks: [{ options: ['boss_id', 'id', 'name'], answer: 'boss_id' }],
        output: tbl(['staff', 'boss'], STAFF_A.map((s) => [s[1], bossOf(STAFF_A, s)])),
      },
      {
        t: 'bug',
        stdin: staffSetup(STAFF_A),
        code: 'SELECT name, name FROM staff JOIN staff ON boss_id = id;\n',
        question: 'This fails with “ambiguous column name”. What is the fix?',
        options: ['Give the two copies of the table different nicknames, and use them', 'Remove the JOIN', 'Use INNER JOIN instead', 'Write staff three times'],
        answer: 0,
        explain: 'When a table is joined to itself, SQL cannot tell the two copies apart unless each has its own nickname.',
        fixed: 'SELECT s.name, b.name FROM staff s JOIN staff b ON s.boss_id = b.id;\n',
      },
      {
        t: 'quiz',
        question: 'Which table is the junction between orders and products?',
        options: ['order_items', 'customers', 'orders', 'staff'],
        answer: 0,
        explain: 'Each order_items row says which product is in which order, and how many. It links the two tables that would otherwise be many-to-many.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT name, name FROM staff JOIN staff ON boss_id = id;', why: 'Two copies of the same table with no nicknames.', right: 'SELECT s.name, b.name FROM staff s JOIN staff b ON s.boss_id = b.id;', stdin: staffSetup(STAFF_A) },
          { wrong: 'SELECT s.name AS staff, b.name AS boss FROM staff s INNER JOIN staff b ON s.boss_id = b.id;', why: 'The owner has no boss, so an INNER JOIN drops her from the list. Use LEFT JOIN to keep everyone.', right: 'SELECT s.name AS staff, b.name AS boss FROM staff s LEFT JOIN staff b ON s.boss_id = b.id;', logic: true, stdin: staffSetup(STAFF_A) },
          { wrong: 'SELECT s.name AS staff, b.name AS boss FROM staff s LEFT JOIN staff b ON s.id = b.boss_id;', why: 'The match is the wrong way round: it shows each person with someone who works FOR them. The boss link is `s.boss_id = b.id`.', right: 'SELECT s.name AS staff, b.name AS boss FROM staff s LEFT JOIN staff b ON s.boss_id = b.id;', logic: true, stdin: staffSetup(STAFF_A) },
        ],
      },
      {
        t: 'recap',
        items: [
          'Many-to-many needs a **junction table** with one row per pair: `order_items` links orders and products.',
          'Cross the junction by joining through it: orders, then order_items, then products.',
          '`COUNT(DISTINCT x)` counts each value once.',
          'A table that points at itself is joined to itself with two nicknames. Use LEFT JOIN to keep the top of the tree.',
        ],
        memory: 'Many-to-many: add a third table. Self join: two nicknames.',
      },
    ],
    exercises: [
      {
        id: 'sql24-airtime-buyers',
        title: 'Who buys airtime?',
        prompt: 'Show the `name` of every customer who has ever bought a product in the category `Airtime`, each name once, ordered by name.',
        starter: '-- Distinct customer names who bought any Airtime product, ordered by name\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['name'], uniq(W.lines.filter((l) => l.product[2] === 'Airtime').map((l) => l.customer[1])).sort(cmp).map((n) => [n]))),
        hints: [
          'Follow the chain from customers to products and filter on the category. A customer may buy more than once.',
          "`FROM customers c JOIN orders o ... JOIN order_items i ... JOIN products p ... WHERE p.category = 'Airtime'`, with `SELECT DISTINCT c.name`.",
          "A similar example: `WHERE p.category = 'School'` would find the school-supply buyers. Yours looks for Airtime.",
        ],
      },
      {
        id: 'sql24-order-contents',
        title: 'What is in each order',
        prompt: 'For every order show `order_id`, the number of different products in it headed `products`, and the total quantity headed `units`. Order by `order_id`.',
        starter: '-- order_id, products (count of items), units (sum of qty), ordered by order_id\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['order_id', 'products', 'units'], W.O.map((o) => { const ls = W.lines.filter((l) => l.order[0] === o[0]); return [o[0], ls.length, sum(ls, (l) => l.qty)]; }))),
        hints: [
          'Only order_items is needed. Group its rows by the order.',
          '`SELECT order_id, COUNT(*) AS products, SUM(qty) AS units FROM order_items GROUP BY order_id ORDER BY order_id;`',
          'A similar example: `SELECT product_id, SUM(qty) AS units FROM order_items GROUP BY product_id;` totals the units per product. Yours groups by order and also counts.',
        ],
      },
      {
        id: 'sql24-bosses',
        title: 'Who is the boss?',
        prompt: 'The `staff` table has `id`, `name` and `boss_id`. Show each person as `staff` and the name of their boss as `boss`; for the person with no boss show `nobody`. Order by the person\'s id.',
        starter: "-- staff and boss (nobody if there is no boss), ordered by staff id\n",
        usesInput: true,
        sampleInput: staffSetup(STAFF_A),
        tests: [
          { input: staffSetup(STAFF_A), expected: tbl(['staff', 'boss'], STAFF_A.map((s) => [s[1], bossOf(STAFF_A, s) ?? 'nobody'])) },
          { input: staffSetup(STAFF_B), expected: tbl(['staff', 'boss'], STAFF_B.map((s) => [s[1], bossOf(STAFF_B, s) ?? 'nobody'])), hidden: true, name: 'A different team' },
        ],
        hints: [
          'Join the staff table to itself with two nicknames. A person with no boss must still appear.',
          "`FROM staff s LEFT JOIN staff b ON s.boss_id = b.id` and `COALESCE(b.name, 'nobody') AS boss`.",
          "A similar example: `COALESCE(supplier, 'unknown')` replaced a missing supplier in lesson 6. Yours replaces the missing boss.",
        ],
      },
    ],
  },

  // ================================================================== 25
  {
    id: 'sql-statement',
    level: LEVEL,
    minutes: 30,
    title: 'Project: the customer statement',
    summary: 'Build a customer statement, a summary of every customer, and a best-seller report from four linked tables',
    blocks: [
      {
        t: 'story',
        title: 'Grace asks for her statement',
        text: "Grace, Nakato's best customer, asks: “Can I see everything I bought, with the dates and the money, and a total at the bottom?” Banks call this a statement. Nakato's sister also wants one summary for the whole shop: every customer, how many orders, how much spent, even the ones who spent nothing.\n\nBoth need data from four linked tables. You now have every tool: joins, LEFT JOIN, aggregates, grouping and sorting.",
      },
      { t: 'h', text: 'Report 1: a statement for customer 3' },
      { t: 'p', text: 'Every item she bought with the date, quantity and line total, in date order, followed by a second query for the grand total.' },
      {
        t: 'project',
        title: 'Statement for Grace',
        stdin: DUUKA_R,
        code: 'SELECT o.order_date, p.name, i.qty, i.qty * p.price AS line_total\nFROM orders o\nJOIN order_items i ON i.order_id = o.id\nJOIN products p ON p.id = i.product_id\nWHERE o.customer_id = 3\nORDER BY o.order_date, i.id;\n\nSELECT SUM(i.qty * p.price) AS total\nFROM orders o\nJOIN order_items i ON i.order_id = o.id\nJOIN products p ON p.id = i.product_id\nWHERE o.customer_id = 3;\n',
        output: tables(
          tbl(['order_date', 'name', 'qty', 'line_total'], WA.lines.filter((l) => l.customer[0] === 3).sort((a, b) => cmp(a.order[2], b.order[2]) || a.id - b.id).map((l) => [l.order[2], l.product[1], l.qty, l.total])),
          tbl(['total'], [[sum(WA.lines.filter((l) => l.customer[0] === 3), (l) => l.total)]]),
        ),
      },
      { t: 'h', text: 'Report 2: every customer, even those who never ordered' },
      { t: 'p', text: 'Start from customers and use LEFT JOIN all the way, so nobody is lost. `COUNT(DISTINCT o.id)` counts each order once, even though it has several items. `COALESCE(..., 0)` turns the empty total into 0.' },
      {
        t: 'project',
        title: 'Customer summary',
        stdin: DUUKA_R,
        code: 'SELECT c.name,\n       COUNT(DISTINCT o.id) AS orders,\n       COALESCE(SUM(i.qty * p.price), 0) AS spent\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nLEFT JOIN order_items i ON i.order_id = o.id\nLEFT JOIN products p ON p.id = i.product_id\nGROUP BY c.id\nORDER BY spent DESC, c.name;\n',
        output: tbl(['name', 'orders', 'spent'], byCustomer(WA).map(([c, ls]) => [c[1], uniq(ls.map((l) => l.order[0])).length, sum(ls, (l) => l.total)]).sort((a, b) => b[2] - a[2] || cmp(a[0], b[0]))),
      },
      { t: 'h', text: 'Report 3: the best seller' },
      {
        t: 'project',
        title: 'Best-selling product',
        stdin: DUUKA_R,
        code: 'SELECT p.name, SUM(i.qty) AS units\nFROM products p\nJOIN order_items i ON i.product_id = p.id\nGROUP BY p.id\nORDER BY units DESC\nLIMIT 1;\n',
        output: tbl(['name', 'units'], byProduct(WA).filter(([, ls]) => ls.length).map(([p, ls]) => [p[1], sum(ls, (l) => l.qty)]).sort((a, b) => b[1] - a[1]).slice(0, 1)),
      },
      {
        t: 'quiz',
        question: 'In Report 2, why is it `COUNT(DISTINCT o.id)` and not `COUNT(o.id)`?',
        options: [
          'After joining the items, an order with 3 items appears 3 times, and DISTINCT counts each order once',
          'DISTINCT makes the query faster',
          'COUNT(o.id) is not allowed with LEFT JOIN',
          'There is no difference',
        ],
        answer: 0,
        explain: 'Joining to order_items multiplies each order by its number of items. Counting the order ids without DISTINCT would count the same order again for each item.',
      },
      {
        t: 'recap',
        items: [
          'A statement lists lines (JOIN across the chain), then a total (the same joins with SUM).',
          'To include rows with nothing to show, start from the parent and use LEFT JOIN all the way down, then COALESCE the empty totals to 0.',
          'Joining a child table repeats the parent row once per child: use `COUNT(DISTINCT ...)` to count the parents.',
          'Level 4 is done: you can combine any number of tables. Next: designing a database well, speed, and safety.',
        ],
        memory: 'JOIN the chain. LEFT JOIN to keep everyone. DISTINCT when joins multiply rows.',
      },
    ],
    exercises: [
      {
        id: 'sql25-statement',
        title: 'Grace\'s statement',
        prompt: 'Show the statement of customer `3`: for every item they bought, `order_date`, product `name`, `qty` and `line_total` (price times quantity). Order by `order_date`, then by the item `id`.',
        starter: '-- order_date, name, qty, line_total for customer 3, ordered by order_date then item id\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['order_date', 'name', 'qty', 'line_total'], W.lines.filter((l) => l.customer[0] === 3).sort((a, b) => cmp(a.order[2], b.order[2]) || a.id - b.id).map((l) => [l.order[2], l.product[1], l.qty, l.total]))),
        hints: [
          'Join orders, order_items and products, then keep only customer 3.',
          '`WHERE o.customer_id = 3 ORDER BY o.order_date, i.id`',
          "A similar example: the courses of student 5 with the year: `SELECT e.year, c.title FROM enrolments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = 5 ORDER BY e.year;` Yours has one more link in the chain and also needs quantity times price.",
        ],
      },
      {
        id: 'sql25-summary',
        title: 'Everyone, even the quiet ones',
        prompt: 'Show every customer\'s `name`, the number of orders they placed headed `orders`, and the total money they spent headed `spent` (0 for a customer with no orders). Biggest `spent` first; when two tie, order by name.',
        starter: '-- name, orders, spent for ALL customers (0 if none), biggest spent first, ties by name\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['name', 'orders', 'spent'], byCustomer(W).map(([c, ls]) => [c[1], uniq(ls.map((l) => l.order[0])).length, sum(ls, (l) => l.total)]).sort((a, b) => b[2] - a[2] || cmp(a[0], b[0])))),
        hints: [
          'Start at customers and LEFT JOIN orders, order_items and products so nobody disappears.',
          '`COUNT(DISTINCT o.id) AS orders` and `COALESCE(SUM(i.qty * p.price), 0) AS spent`, then `GROUP BY c.id`.',
          "A similar example: every class with its number of pupils, even an empty class: `SELECT c.name, COUNT(p.id) AS pupils FROM classes c LEFT JOIN pupils p ON p.class_id = c.id GROUP BY c.id;` Yours does this over four tables and adds a total with COALESCE.",
        ],
      },
      {
        id: 'sql25-best-seller',
        title: 'The best seller',
        prompt: 'Show the single best-selling product: its `name` and the total number of units sold headed `units`.',
        starter: '-- The best-selling product: name and units\n',
        usesInput: true,
        sampleInput: DUUKA_R,
        tests: pair((W) => tbl(['name', 'units'], byProduct(W).filter(([, ls]) => ls.length).map(([p, ls]) => [p[1], sum(ls, (l) => l.qty)]).sort((a, b) => b[1] - a[1]).slice(0, 1))),
        hints: [
          'Join products to order_items, add up the quantities per product, sort, and keep one row.',
          '`SUM(i.qty) AS units ... GROUP BY p.id ORDER BY units DESC LIMIT 1`',
          'A similar example: `GROUP BY method ORDER BY n DESC LIMIT 1` finds the most used payment method. Yours finds the product with the most units.',
        ],
      },
    ],
  },
];
