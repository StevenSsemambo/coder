// SQL, Level 2: Summaries. Lessons 8 to 12 (aggregates, GROUP BY, HAVING, dates, the daily report project).
// Prose uses double-quoted strings. SQL code uses plain template literals.
// Expected outputs come from plain JavaScript data (sums, counts, groups), never from the SQL itself.
import { DUUKA, DUUKA_B, DUUKA_S, DUUKA_S_B, PRODUCTS, PRODUCTS_B, CUSTOMERS, CUSTOMERS_B, SALES, SALES_B, tbl, productView, salesView, allSales } from './shared.js';

const LEVEL = 'Level 2: Summaries';

// product row: 0 id, 1 name, 2 category, 3 price, 4 stock, 5 supplier
// sale row:    0 id, 1 sale_date, 2 product_id, 3 qty, 4 amount, 5 method
const sum = (rows, f) => rows.reduce((n, r) => n + f(r), 0);
const avg = (rows, f) => sum(rows, f) / rows.length;
const cmp = (a, b) => (a === b ? 0 : a === null ? -1 : b === null ? 1 : a < b ? -1 : 1); // NULL sorts first, like SQLite
/** [key, rows] pairs, in key order (NULL first). */
const groups = (rows, key) => {
  const m = new Map();
  for (const r of rows) {
    const k = key(r);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return [...m.entries()].sort(([a], [b]) => cmp(a, b));
};
const addDays = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

export const level2 = [
  // ================================================================== 8
  {
    id: 'sql-aggregates',
    level: LEVEL,
    minutes: 22,
    title: 'Totals and averages',
    summary: 'Count rows, add them up, find the smallest, biggest and the average',
    blocks: [
      {
        t: 'story',
        title: 'The landlord’s questions',
        text: "So far Nakato's questions were about single products: which ones, in what order. But now the landlord asks different questions. “How many products do you sell? How many items are on your shelves in total? What is your cheapest price and your highest?”\n\nNone of these is about one row. Each answer is ONE number worked out from MANY rows. SQL calls the tools for this **aggregate functions**.",
      },
      {
        t: 'list',
        items: [
          '`COUNT(*)` counts rows.',
          '`SUM(column)` adds the values up.',
          '`AVG(column)` is the average.',
          '`MIN(column)` and `MAX(column)` are the smallest and the biggest.',
        ],
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT COUNT(*) AS items FROM products;\n',
        output: tbl(['items'], [[PRODUCTS.length]]),
      },
      { t: 'p', text: 'Several aggregates can sit in one query. The whole table collapses into **one row** of answers.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT COUNT(*) AS items, SUM(stock) AS units, MIN(price) AS cheapest, MAX(price) AS dearest\nFROM products;\n',
        output: tbl(['items', 'units', 'cheapest', 'dearest'], [[PRODUCTS.length, sum(PRODUCTS, (r) => r[4]), Math.min(...PRODUCTS.map((r) => r[3])), Math.max(...PRODUCTS.map((r) => r[3]))]]),
      },
      { t: 'p', text: '`WHERE` still works first: it picks the rows, then the aggregate works on only those. An average usually has a long tail of decimals, so wrap it in `ROUND`.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "SELECT COUNT(*) AS n, ROUND(AVG(price)) AS avg_price\nFROM products\nWHERE category = 'Food';\n",
        output: (() => {
          const food = PRODUCTS.filter((r) => r[2] === 'Food');
          return tbl(['n', 'avg_price'], [[food.length, Math.round(avg(food, (r) => r[3]))]]);
        })(),
      },
      { t: 'analogy', text: "An aggregate is like the total line at the bottom of a shopping receipt. Many lines above, one number below. The WHERE part decides which lines are on the receipt." },
      { t: 'h', text: 'COUNT(*) and COUNT(column) are not the same' },
      { t: 'p', text: '`COUNT(*)` counts every row. `COUNT(supplier)` counts only the rows where `supplier` is NOT empty. NULLs are skipped by every aggregate except `COUNT(*)`.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT COUNT(*) AS all_rows, COUNT(supplier) AS with_supplier FROM products;\n',
        output: tbl(['all_rows', 'with_supplier'], [[PRODUCTS.length, PRODUCTS.filter((r) => r[5] !== null).length]]),
      },
      {
        t: 'predict',
        stdin: DUUKA,
        code: "SELECT COUNT(*) AS a, COUNT(supplier) AS b FROM products WHERE category = 'Airtime';\n",
        question: 'There is exactly one Airtime product, and its supplier box is empty. What does this show?',
        options: [tbl(['a', 'b'], [[1, 0]]), tbl(['a', 'b'], [[1, 1]]), tbl(['a', 'b'], [[0, 0]]), tbl(['a', 'b'], [[0, 1]])],
        answer: 0,
        explain: '`COUNT(*)` counts the row: 1. `COUNT(supplier)` skips it because the supplier is NULL: 0.',
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap so the query adds up the stock of the School products.',
        template: "SELECT ___(stock) AS units FROM products WHERE category = 'School';\n",
        blanks: [{ options: ['SUM', 'COUNT', 'MAX'], answer: 'SUM' }],
        output: tbl(['units'], [[sum(PRODUCTS.filter((r) => r[2] === 'School'), (r) => r[4])]]),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'SELECT COUNT(*) FROM products WHERE price > AVG(price);\n',
        question: 'This fails with “misuse of aggregate: AVG()”. Why?',
        options: [
          'WHERE checks rows one by one, before any average exists',
          'AVG only works on text',
          'COUNT(*) cannot be used with WHERE',
          'price cannot be compared to a number',
        ],
        answer: 0,
        explain: 'WHERE looks at each row on its own, before any totals are worked out, so it cannot use one. Compare with a fixed number instead. (Level 4 shows how to compare with an average, and the next lessons show HAVING.)',
        fixed: 'SELECT COUNT(*) FROM products WHERE price > 3000;\n',
      },
      {
        t: 'quiz',
        question: 'The supplier column has 3 empty boxes among 12 rows. What does `COUNT(supplier)` give?',
        options: ['9', '12', '3', '0'],
        answer: 0,
        explain: 'COUNT(column) counts only the filled boxes: 12 - 3 = 9.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT COUNT(*) FROM products WHERE price > AVG(price);', why: 'An aggregate cannot be used inside WHERE.', right: 'SELECT COUNT(*) FROM products WHERE price > 3000;', stdin: DUUKA },
          { wrong: 'SELECT COUNT(supplier) AS products FROM products;', why: 'You wanted to count products, but COUNT(supplier) skips the empty supplier boxes: 9, not 12. No error, just the wrong number.', right: 'SELECT COUNT(*) AS products FROM products;', logic: true, stdin: DUUKA },
          { wrong: 'SELECT SUM(stock) FROM product;', why: 'The table is called products.', right: 'SELECT SUM(stock) FROM products;', stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          'Aggregates turn many rows into one answer: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.',
          '`WHERE` picks the rows first, then the aggregate works on those rows.',
          '`COUNT(*)` counts rows. `COUNT(column)` skips NULLs, and so do `SUM`, `AVG`, `MIN`, `MAX`.',
          'Aggregates cannot go inside `WHERE`. Wrap `AVG` in `ROUND` for tidy numbers.',
        ],
        memory: 'Many rows in, one number out.',
      },
    ],
    exercises: [
      {
        id: 'sql8-food-count',
        title: 'How many food items?',
        prompt: 'Show how many products are in the category `Food`, headed `n`.',
        starter: "-- How many Food products? Heading: n\nSELECT name FROM products;\n",
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['n'], [[PRODUCTS.filter((r) => r[2] === 'Food').length]]) },
          { input: DUUKA_B, expected: tbl(['n'], [[PRODUCTS_B.filter((r) => r[2] === 'Food').length]]), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'You want ONE number, so use an aggregate that counts rows. Filter the rows with WHERE.',
          "`SELECT COUNT(*) AS n FROM products WHERE category = 'Food';`",
          "A similar example: `SELECT COUNT(*) AS n FROM customers WHERE town = 'Jinja';` counts the customers from Jinja. Yours counts Food products.",
        ],
      },
      {
        id: 'sql8-food-stats',
        title: 'Food price summary',
        prompt: 'For the `Food` products show three numbers in this order: the lowest price headed `cheapest`, the highest price headed `dearest`, and the average price rounded to a whole number headed `average`.',
        starter: '-- cheapest, dearest, average (rounded) price of Food products\nSELECT price FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          {
            input: DUUKA,
            expected: (() => { const f = PRODUCTS.filter((r) => r[2] === 'Food'); return tbl(['cheapest', 'dearest', 'average'], [[Math.min(...f.map((r) => r[3])), Math.max(...f.map((r) => r[3])), Math.round(avg(f, (r) => r[3]))]]); })(),
          },
          {
            input: DUUKA_B,
            expected: (() => { const f = PRODUCTS_B.filter((r) => r[2] === 'Food'); return tbl(['cheapest', 'dearest', 'average'], [[Math.min(...f.map((r) => r[3])), Math.max(...f.map((r) => r[3])), Math.round(avg(f, (r) => r[3]))]]); })(),
            hidden: true,
            name: 'A different shop',
          },
        ],
        hints: [
          'Three aggregates in one SELECT, separated by commas. Rounding goes around the average.',
          '`MIN(price) AS cheapest, MAX(price) AS dearest, ROUND(AVG(price)) AS average`',
          'A similar example: `SELECT MIN(stock) AS lowest, MAX(stock) AS highest FROM products;` Yours uses price, adds an average, and filters to Food.',
        ],
      },
      {
        id: 'sql8-household',
        title: 'Household stock check',
        prompt: 'For the `Household` products show the total stock headed `units`, and how many of them have a supplier recorded headed `with_supplier`.',
        starter: '-- units (total stock) and with_supplier (how many have a supplier) for Household\nSELECT stock FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: (() => { const h = PRODUCTS.filter((r) => r[2] === 'Household'); return tbl(['units', 'with_supplier'], [[sum(h, (r) => r[4]), h.filter((r) => r[5] !== null).length]]); })() },
          { input: DUUKA_B, expected: (() => { const h = PRODUCTS_B.filter((r) => r[2] === 'Household'); return tbl(['units', 'with_supplier'], [[sum(h, (r) => r[4]), h.filter((r) => r[5] !== null).length]]); })(), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'One aggregate adds up, another counts only the filled boxes of one column.',
          "`SUM(stock) AS units, COUNT(supplier) AS with_supplier`, then `FROM products WHERE category = 'Household'`.",
          "A similar example: `SELECT SUM(price) AS total, COUNT(supplier) AS known FROM products;` Yours sums stock and filters to Household.",
        ],
      },
    ],
  },

  // ================================================================== 9
  {
    id: 'sql-group',
    level: LEVEL,
    minutes: 24,
    title: 'Totals for each group',
    summary: 'Use GROUP BY to work out a total for every category, supplier or town',
    blocks: [
      {
        t: 'story',
        title: 'One total for each shelf',
        text: "“Nakato, how many products do you have in each category?” That is not one number, it is one number per category: Food, Household, School, Airtime. Nakato makes piles on the counter, one pile per category, and counts each pile.\n\nIn SQL the piles are made with `GROUP BY`. It puts rows with the same value into the same group, and then every aggregate is worked out once per group.",
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT category, COUNT(*) AS items\nFROM products\nGROUP BY category\nORDER BY category;\n',
        output: tbl(['category', 'items'], groups(PRODUCTS, (r) => r[2]).map(([k, g]) => [k, g.length])),
      },
      { t: 'analogy', text: "GROUP BY is making piles. Every row goes onto the pile of its category. Then COUNT counts one pile, SUM adds up one pile. You get one answer row per pile." },
      { t: 'p', text: 'You can use several aggregates at once, and `WHERE` still runs first, before the piles are made.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT category, SUM(stock) AS units, MAX(price) AS dearest\nFROM products\nWHERE stock > 0\nGROUP BY category\nORDER BY category;\n',
        output: tbl(['category', 'units', 'dearest'], groups(PRODUCTS.filter((r) => r[4] > 0), (r) => r[2]).map(([k, g]) => [k, sum(g, (r) => r[4]), Math.max(...g.map((r) => r[3]))])),
      },
      { t: 'tip', text: 'Every plain column in SELECT (here `category`) must be in GROUP BY. SQLite will not stop you if you forget, but the answer for that column is then a random pick. Always check.' },
      { t: 'h', text: 'What about empty boxes?' },
      { t: 'p', text: 'NULL values are not thrown away. They form a group of their own. Here the products with no supplier become one pile, and NULL sorts to the top.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT supplier, COUNT(*) AS items\nFROM products\nGROUP BY supplier\nORDER BY supplier;\n',
        output: tbl(['supplier', 'items'], groups(PRODUCTS, (r) => r[5]).map(([k, g]) => [k, g.length])),
      },
      {
        t: 'predict',
        stdin: DUUKA,
        code: 'SELECT town, COUNT(*) AS n FROM customers GROUP BY town ORDER BY town;\n',
        question: 'Two customers live in Kampala, and the other four live in four different towns. What does this show?',
        options: [
          tbl(['town', 'n'], [['Gulu', 1], ['Jinja', 1], ['Kampala', 2], ['Mbale', 1], ['Mbarara', 1]]),
          tbl(['town', 'n'], [['Gulu', 1], ['Jinja', 1], ['Kampala', 1], ['Mbale', 1], ['Mbarara', 1]]),
          tbl(['town', 'n'], [['Kampala', 6]]),
          tbl(['town', 'n'], [['Kampala', 2], ['Gulu', 1], ['Jinja', 1], ['Mbale', 1], ['Mbarara', 1]]),
        ],
        answer: 0,
        explain: 'One row per town, with the number of customers in it. Kampala has 2. `ORDER BY town` puts the towns in A to Z order.',
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap so the stock is added up for each category.',
        template: 'SELECT category, SUM(stock) AS units FROM products GROUP BY ___ ORDER BY category;\n',
        blanks: [{ options: ['category', 'name', 'price'], answer: 'category' }],
        output: tbl(['category', 'units'], groups(PRODUCTS, (r) => r[2]).map(([k, g]) => [k, sum(g, (r) => r[4])])),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'SELECT category, COUNT(*) FROM products GROUP category;\n',
        question: 'This query fails with a syntax error near category. What is missing?',
        options: ['The word BY after GROUP', 'A comma after GROUP', 'The word ALL after COUNT', 'Brackets around category'],
        answer: 0,
        explain: 'The words go together: `GROUP BY`, just like `ORDER BY`.',
        fixed: 'SELECT category, COUNT(*) FROM products GROUP BY category;\n',
      },
      {
        t: 'quiz',
        question: 'What does GROUP BY do?',
        options: [
          'Puts rows with the same value into one group, so each aggregate is worked out once per group',
          'Sorts the rows from A to Z',
          'Removes the rows that do not match a test',
          'Joins two tables together',
        ],
        answer: 0,
        explain: 'Sorting is ORDER BY and picking rows is WHERE. GROUP BY makes the piles that aggregates work on.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT category, COUNT(*) FROM products GROUP category;', why: 'It is GROUP BY, two words.', right: 'SELECT category, COUNT(*) FROM products GROUP BY category;', stdin: DUUKA },
          { wrong: 'SELECT category, COUNT(*) AS n FROM products;', why: 'You forgot GROUP BY. SQLite does not complain: it counts the WHOLE table and shows just one category name. A wrong answer with no error.', right: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category;', logic: true, stdin: DUUKA },
          { wrong: 'SELECT category, COUNT(*) FROM products GROUP BY category WHERE stock > 0;', why: 'WHERE comes BEFORE GROUP BY, because it picks the rows that go into the piles.', right: 'SELECT category, COUNT(*) FROM products WHERE stock > 0 GROUP BY category;', stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          '`GROUP BY column` makes one group per value; aggregates are then worked out per group.',
          'Every plain column in SELECT should be in GROUP BY.',
          'NULLs form their own group.',
          'Order of the parts: SELECT, FROM, WHERE, GROUP BY, ORDER BY.',
        ],
        memory: 'GROUP BY = make piles, then total each pile.',
      },
    ],
    exercises: [
      {
        id: 'sql9-per-category',
        title: 'Products per category',
        prompt: 'Show each `category` and how many products it has, headed `n`. Order by category from A to Z.',
        starter: '-- category and n (number of products), ordered by category\nSELECT category FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['category', 'n'], groups(PRODUCTS, (r) => r[2]).map(([k, g]) => [k, g.length])) },
          { input: DUUKA_B, expected: tbl(['category', 'n'], groups(PRODUCTS_B, (r) => r[2]).map(([k, g]) => [k, g.length])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'One row per category means GROUP BY category. Count the rows in each group.',
          '`SELECT category, COUNT(*) AS n FROM products GROUP BY category ORDER BY category;`',
          'A similar example: `SELECT town, COUNT(*) AS n FROM customers GROUP BY town;` counts customers per town. Yours counts products per category.',
        ],
      },
      {
        id: 'sql9-supplier-stock',
        title: 'Stock per supplier',
        prompt: 'For products that DO have a supplier, show each `supplier` and the total stock supplied, headed `units`. Order by supplier from A to Z.',
        starter: '-- supplier and units (total stock), only products with a supplier, ordered by supplier\nSELECT supplier FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['supplier', 'units'], groups(PRODUCTS.filter((r) => r[5] !== null), (r) => r[5]).map(([k, g]) => [k, sum(g, (r) => r[4])])) },
          { input: DUUKA_B, expected: tbl(['supplier', 'units'], groups(PRODUCTS_B.filter((r) => r[5] !== null), (r) => r[5]).map(([k, g]) => [k, sum(g, (r) => r[4])])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'WHERE removes the rows with no supplier before the piles are made. Then SUM the stock in each pile.',
          '`WHERE supplier IS NOT NULL GROUP BY supplier`, with `SUM(stock) AS units` in the SELECT part.',
          'A similar example: `SELECT category, SUM(price) AS total FROM products WHERE stock > 0 GROUP BY category;` Yours groups by supplier and sums stock.',
        ],
      },
      {
        id: 'sql9-towns',
        title: 'Where do customers live?',
        prompt: 'Show each `town` and the number of customers living there, headed `n`. Put the town with the MOST customers first. When two towns tie, order them A to Z.',
        starter: '-- town and n, most customers first, ties A to Z\nSELECT town FROM customers;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          {
            input: DUUKA,
            expected: tbl(['town', 'n'], groups(CUSTOMERS, (r) => r[3]).map(([k, g]) => [k, g.length]).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))),
          },
          {
            input: DUUKA_B,
            expected: tbl(['town', 'n'], groups(CUSTOMERS_B, (r) => r[3]).map(([k, g]) => [k, g.length]).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))),
            hidden: true,
            name: 'A different shop',
          },
        ],
        hints: [
          'GROUP BY town and COUNT. Then sort by the count, biggest first, and use the town to break ties.',
          '`ORDER BY n DESC, town`. You can sort by the nickname n.',
          'A similar example: `ORDER BY units DESC, supplier` sorts by a nicknamed total, and then by name. Yours sorts by n.',
        ],
      },
    ],
  },

  // ================================================================== 10
  {
    id: 'sql-having',
    level: LEVEL,
    minutes: 24,
    title: 'Filtering groups with HAVING',
    summary: 'Keep only the groups that pass a test, and learn the order of a whole query',
    blocks: [
      {
        t: 'story',
        title: 'Only the big shelves',
        text: "Nakato wants to rearrange her duuka. “Show me only the categories that have more than 2 products.” First she makes her piles, one per category. Only then can she look at the piles and keep the big ones.\n\nThis is a new kind of filter. `WHERE` drops rows BEFORE the piles are made. To drop whole piles AFTER, SQL has `HAVING`.",
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT category, COUNT(*) AS items\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 2\nORDER BY category;\n',
        output: tbl(['category', 'items'], groups(PRODUCTS, (r) => r[2]).filter(([, g]) => g.length > 2).map(([k, g]) => [k, g.length])),
      },
      { t: 'analogy', text: "WHERE is the doorman at the shop door: he decides which customers (rows) come in. HAVING is the manager at the till, who looks at each group of customers after shopping and says: “Only groups that spent over 100,000 get a gift.” Different moment, different question." },
      { t: 'p', text: 'You can use both in one query: `WHERE` first drops the rows, then the piles are made, then `HAVING` drops piles.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT category, SUM(stock) AS units\nFROM products\nWHERE stock > 0\nGROUP BY category\nHAVING SUM(stock) > 90\nORDER BY category;\n',
        output: tbl(['category', 'units'], groups(PRODUCTS.filter((r) => r[4] > 0), (r) => r[2]).map(([k, g]) => [k, sum(g, (r) => r[4])]).filter((r) => r[1] > 90)),
      },
      { t: 'h', text: 'The order of a whole query' },
      { t: 'p', text: 'Now you know all the parts. They always come in the same order. Put these lines of one query in the right order:' },
      {
        t: 'reorder',
        stdin: DUUKA,
        prompt: 'Put the lines in the right order.',
        lines: ['SELECT category, COUNT(*) AS n', 'FROM products', 'WHERE stock > 0', 'GROUP BY category', 'HAVING COUNT(*) >= 2', 'ORDER BY n DESC, category;'],
        output: (() => {
          const g = groups(PRODUCTS.filter((r) => r[4] > 0), (r) => r[2]).map(([k, rows]) => [k, rows.length]).filter((r) => r[1] >= 2);
          return tbl(['category', 'n'], g.sort((a, b) => b[1] - a[1] || cmp(a[0], b[0])));
        })(),
      },
      { t: 'tip', text: 'SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. Say it like a song until it sticks.' },
      {
        t: 'predict',
        stdin: DUUKA,
        code: 'SELECT category FROM products GROUP BY category HAVING MAX(price) < 6000 ORDER BY category;\n',
        question: 'Which categories have NO product that costs 6000 or more?',
        options: [
          tbl(['category'], [['Airtime'], ['Household'], ['School']]),
          tbl(['category'], [['Food']]),
          tbl(['category'], [['Airtime'], ['Food'], ['Household'], ['School']]),
          tbl(['category'], [['Household'], ['School']]),
        ],
        answer: 0,
        explain: 'HAVING MAX(price) < 6000 keeps a category only when its most expensive product is below 6000. Food has Matooke at 15000, so it is dropped. Airtime (5000), Household (3500) and School (1200) stay.',
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap so only categories with at least 3 products are kept.',
        template: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category ___ COUNT(*) >= 3 ORDER BY category;\n',
        blanks: [{ options: ['HAVING', 'WHERE', 'AND'], answer: 'HAVING' }],
        output: tbl(['category', 'n'], groups(PRODUCTS, (r) => r[2]).filter(([, g]) => g.length >= 3).map(([k, g]) => [k, g.length])),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'SELECT category, COUNT(*) AS n FROM products WHERE COUNT(*) > 2 GROUP BY category;\n',
        question: 'This fails with “misuse of aggregate: COUNT()”. What is the fix?',
        options: ['Use HAVING (after GROUP BY) to test a count', 'Remove GROUP BY', 'Write COUNT in small letters', 'Use ORDER BY instead of WHERE'],
        answer: 0,
        explain: 'A count only exists after the groups are made, and WHERE runs before. Tests on aggregates belong in HAVING.',
        fixed: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category HAVING COUNT(*) > 2;\n',
      },
      {
        t: 'quiz',
        question: 'Which runs FIRST?',
        options: ['WHERE', 'HAVING', 'They run at the same time', 'ORDER BY'],
        answer: 0,
        explain: 'WHERE picks the rows, GROUP BY makes the piles, HAVING picks the piles, and ORDER BY sorts what is left.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT category, COUNT(*) AS n FROM products WHERE COUNT(*) > 2 GROUP BY category;', why: 'Aggregates cannot be tested in WHERE.', right: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category HAVING COUNT(*) > 2;', stdin: DUUKA },
          { wrong: 'SELECT category FROM products HAVING COUNT(*) > 2 GROUP BY category;', why: 'HAVING comes AFTER GROUP BY, never before.', right: 'SELECT category FROM products GROUP BY category HAVING COUNT(*) > 2;', stdin: DUUKA },
          { wrong: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category HAVING COUNT(*) > 2;', why: 'You wanted categories with AT LEAST 2 products. “More than 2” skips the categories that have exactly 2. No error, just a missing row.', right: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category HAVING COUNT(*) >= 2;', logic: true, stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          '`WHERE` drops rows before grouping. `HAVING` drops groups after grouping.',
          'Tests on `COUNT`, `SUM`, `AVG`, `MIN` or `MAX` belong in `HAVING`.',
          'The order never changes: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.',
        ],
        memory: 'WHERE for rows, HAVING for groups.',
      },
    ],
    exercises: [
      {
        id: 'sql10-big-categories',
        title: 'Busy shelves',
        prompt: 'Show each `category` that has at least 3 products, with its number of products headed `n`. Order by category.',
        starter: '-- Categories with at least 3 products: category, n\nSELECT category, COUNT(*) AS n FROM products GROUP BY category;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['category', 'n'], groups(PRODUCTS, (r) => r[2]).filter(([, g]) => g.length >= 3).map(([k, g]) => [k, g.length])) },
          { input: DUUKA_B, expected: tbl(['category', 'n'], groups(PRODUCTS_B, (r) => r[2]).filter(([, g]) => g.length >= 3).map(([k, g]) => [k, g.length])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The starter makes one row per category. You need to drop the small piles.',
          '`HAVING COUNT(*) >= 3`, after GROUP BY. Then add ORDER BY category.',
          'A similar example: `GROUP BY town HAVING COUNT(*) > 1` keeps towns with more than one customer. Yours keeps categories with at least 3 products.',
        ],
      },
      {
        id: 'sql10-rich-suppliers',
        title: 'Biggest suppliers',
        prompt: 'The stock value of a product is `price * stock`. Show each supplier (ignore products with no supplier) whose products have a TOTAL stock value of MORE than 100000, with the total headed `value`. Biggest value first.',
        starter: '-- supplier and value (total of price * stock), more than 100000, biggest first\nSELECT supplier FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          {
            input: DUUKA,
            expected: tbl(['supplier', 'value'], groups(PRODUCTS.filter((r) => r[5] !== null), (r) => r[5]).map(([k, g]) => [k, sum(g, (r) => r[3] * r[4])]).filter((r) => r[1] > 100000).sort((a, b) => b[1] - a[1])),
          },
          {
            input: DUUKA_B,
            expected: tbl(['supplier', 'value'], groups(PRODUCTS_B.filter((r) => r[5] !== null), (r) => r[5]).map(([k, g]) => [k, sum(g, (r) => r[3] * r[4])]).filter((r) => r[1] > 100000).sort((a, b) => b[1] - a[1])),
            hidden: true,
            name: 'A different shop',
          },
        ],
        hints: [
          'WHERE removes the products without a supplier, GROUP BY supplier makes the piles, HAVING keeps the rich ones.',
          '`SUM(price * stock) AS value`, then `HAVING SUM(price * stock) > 100000 ORDER BY value DESC`.',
          'A similar example: `GROUP BY category HAVING SUM(stock) > 90` keeps categories with a big total stock. Yours multiplies price by stock and groups by supplier.',
        ],
      },
      {
        id: 'sql10-cheap-categories',
        title: 'Budget categories',
        prompt: 'Show each `category` whose AVERAGE price is under 5000, with that average rounded to a whole number headed `avg_price`. Order by category.',
        starter: '-- category and avg_price (rounded), only categories whose average price is under 5000\nSELECT category FROM products GROUP BY category;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['category', 'avg_price'], groups(PRODUCTS, (r) => r[2]).filter(([, g]) => avg(g, (r) => r[3]) < 5000).map(([k, g]) => [k, Math.round(avg(g, (r) => r[3]))])) },
          { input: DUUKA_B, expected: tbl(['category', 'avg_price'], groups(PRODUCTS_B, (r) => r[2]).filter(([, g]) => avg(g, (r) => r[3]) < 5000).map(([k, g]) => [k, Math.round(avg(g, (r) => r[3]))])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Work out the average per category. Show it rounded, but test the real average in HAVING.',
          '`ROUND(AVG(price)) AS avg_price` in SELECT, and `HAVING AVG(price) < 5000` after GROUP BY.',
          'A similar example: `HAVING MIN(stock) > 10` keeps groups whose smallest stock is above 10. Yours tests the average price.',
        ],
      },
    ],
  },

  // ================================================================== 11
  {
    id: 'sql-dates',
    level: LEVEL,
    minutes: 24,
    title: 'Dates and sales over time',
    summary: 'Store dates as text the right way, filter by date, add days, and total by month',
    blocks: [
      {
        t: 'story',
        title: 'The sales book',
        text: "Nakato keeps a second book: the sales book. Each line is one sale: the date, which product, how many, how much money, and how the customer paid (cash or mobile money). At the end of the month her sister asks, “How much did we take in November?”\n\nDates are the most common source of mistakes in a database, so this lesson starts with one rule.",
      },
      { t: 'tip', text: 'Write dates as `YYYY-MM-DD`: year, then month, then day, like `2026-11-03`. Then alphabetical order IS date order, and every date tool in SQLite understands them. A date like `03/11/2026` breaks both.' },
      { t: 'p', text: 'The sales table has these columns: `id`, `sale_date`, `product_id`, `qty`, `amount` (shillings paid) and `method`.' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: 'SELECT * FROM sales;\n',
        output: allSales(),
      },
      { t: 'p', text: 'A date is text, so it goes in single quotes. Use `=`, `BETWEEN`, `<` or `>` just like with other values:' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: "SELECT id, sale_date, amount FROM sales WHERE sale_date BETWEEN '2026-11-09' AND '2026-11-10';\n",
        output: salesView(['id', 'sale_date', 'amount'], SALES.filter((r) => r[1] >= '2026-11-09' && r[1] <= '2026-11-10')),
      },
      { t: 'h', text: 'Date tools' },
      { t: 'p', text: '`date(d, \'+7 day\')` moves a date forward (use a minus for backward). `strftime(format, d)` picks a part of a date: `%Y` is the year, `%m` the month, `%d` the day.' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: "SELECT sale_date, date(sale_date, '+7 day') AS pay_by FROM sales WHERE id IN (1, 7, 14);\n",
        output: tbl(['sale_date', 'pay_by'], SALES.filter((r) => [1, 7, 14].includes(r[0])).map((r) => [r[1], addDays(r[1], 7)])),
      },
      { t: 'h', text: 'Totals by month' },
      { t: 'p', text: '`strftime(\'%Y-%m\', sale_date)` turns `2026-11-03` into `2026-11`. Group by that, and you get one row per month. This is how every monthly report in the world is made.' },
      {
        t: 'try',
        stdin: DUUKA_S,
        code: "SELECT strftime('%Y-%m', sale_date) AS month, COUNT(*) AS n, SUM(amount) AS revenue\nFROM sales\nGROUP BY month\nORDER BY month;\n",
        output: tbl(['month', 'n', 'revenue'], groups(SALES, (r) => r[1].slice(0, 7)).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])])),
      },
      {
        t: 'predict',
        code: "SELECT strftime('%Y-%m', '2026-12-25') AS m;\n",
        question: 'What does this show?',
        options: [tbl(['m'], [['2026-12']]), tbl(['m'], [['2026-25']]), tbl(['m'], [['12-2026']]), tbl(['m'], [['2026']])],
        answer: 0,
        explain: '`%Y` is the year (2026), a dash, and `%m` is the month (12). The day is not asked for, so it disappears.',
      },
      {
        t: 'fill',
        stdin: DUUKA_S,
        prompt: 'Fill the gap so the sales are counted for each month.',
        template: "SELECT strftime('%Y-%m', sale_date) AS month, COUNT(*) AS n FROM sales GROUP BY ___ ORDER BY month;\n",
        blanks: [{ options: ['month', 'sale_date', 'method'], answer: 'month' }],
        output: tbl(['month', 'n'], groups(SALES, (r) => r[1].slice(0, 7)).map(([k, g]) => [k, g.length])),
      },
      {
        t: 'bug',
        code: "SELECT date('2026-11-03' '+7 day') AS next_week;\n",
        question: 'This fails with a syntax error. What is missing?',
        options: ['A comma between the date and \'+7 day\'', 'Brackets around the whole thing', 'The word FROM', 'A second semicolon'],
        answer: 0,
        explain: 'A function\'s inputs are separated by commas: `date(\'2026-11-03\', \'+7 day\')`.',
        fixed: "SELECT date('2026-11-03', '+7 day') AS next_week;\n",
      },
      {
        t: 'quiz',
        question: 'Why should dates be written as 2026-11-03 and not 03/11/2026?',
        options: [
          'So that alphabetical order is date order and SQLite date tools understand them',
          'Because slashes are not allowed in SQL',
          'Because the day must come first',
          'It makes no difference',
        ],
        answer: 0,
        explain: 'With year first, sorting and BETWEEN work correctly, and `date()` and `strftime()` can read the value.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: "SELECT date('2026-11-03' '+7 day');", why: 'The two inputs of a function need a comma between them.', right: "SELECT date('2026-11-03', '+7 day');", stdin: DUUKA_S },
          { wrong: 'SELECT id FROM sales WHERE sale_date = 2026-11-03;', why: 'Without quotes SQL does the subtraction 2026 - 11 - 3 = 2012 and finds no date equal to that number. No error, no rows.', right: "SELECT id FROM sales WHERE sale_date = '2026-11-03';", logic: true, stdin: DUUKA_S },
          { wrong: "SELECT id FROM sales WHERE sale_date = '03/11/2026';", why: 'The dates in this table are written year-month-day, so this text matches nothing. No error, no rows.', right: "SELECT id FROM sales WHERE sale_date = '2026-11-03';", logic: true, stdin: DUUKA_S },
        ],
      },
      {
        t: 'recap',
        items: [
          'Write dates as `YYYY-MM-DD`, in quotes.',
          'Filter with `=`, `BETWEEN`, `<`, `>`.',
          '`date(d, \'+7 day\')` moves a date. `strftime(\'%Y-%m\', d)` picks out the year and month.',
          'Group by `strftime(\'%Y-%m\', date)` for a monthly report.',
        ],
        memory: 'Year first, always. YYYY-MM-DD.',
      },
    ],
    exercises: [
      {
        id: 'sql11-range',
        title: 'The middle week',
        prompt: 'Show `id`, `sale_date` and `amount` of the sales from `2026-11-03` to `2026-11-10`, both days included.',
        starter: '-- id, sale_date, amount of sales from 2026-11-03 to 2026-11-10 (both included)\nSELECT id, sale_date, amount FROM sales;\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: salesView(['id', 'sale_date', 'amount'], SALES.filter((r) => r[1] >= '2026-11-03' && r[1] <= '2026-11-10')) },
          { input: DUUKA_S_B, expected: salesView(['id', 'sale_date', 'amount'], SALES_B.filter((r) => r[1] >= '2026-11-03' && r[1] <= '2026-11-10')), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'A date is text, so put it in quotes. BETWEEN includes both ends.',
          "`WHERE sale_date BETWEEN '2026-11-03' AND '2026-11-10'`",
          "A similar example: `WHERE sale_date >= '2026-12-01'` keeps the sales from the 1st of December on. Yours keeps a range.",
        ],
      },
      {
        id: 'sql11-monthly',
        title: 'Month by month',
        prompt: 'Show a monthly report: the month written like `2026-11` headed `month`, the number of sales headed `n`, and the total `amount` headed `revenue`. Order by month.',
        starter: '-- month, n (number of sales), revenue (total amount), ordered by month\nSELECT sale_date FROM sales;\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['month', 'n', 'revenue'], groups(SALES, (r) => r[1].slice(0, 7)).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])])) },
          { input: DUUKA_S_B, expected: tbl(['month', 'n', 'revenue'], groups(SALES_B, (r) => r[1].slice(0, 7)).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          "Turn each date into its year-month with strftime, then group by that nickname.",
          "`strftime('%Y-%m', sale_date) AS month, COUNT(*) AS n, SUM(amount) AS revenue ... GROUP BY month ORDER BY month`",
          "A similar example: `strftime('%Y', sale_date) AS year, SUM(amount) AS total ... GROUP BY year` gives one row per year. Yours uses year and month together.",
        ],
      },
      {
        id: 'sql11-pay-by',
        title: 'Payment reminders',
        prompt: 'For the sales with an `amount` of 6000 or more, show `sale_date`, a column `pay_by` that is the sale date plus 7 days, and `amount`. Keep the table\'s own order.',
        starter: '-- sale_date, pay_by (sale_date plus 7 days), amount, for amounts of 6000 or more\nSELECT sale_date, amount FROM sales;\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['sale_date', 'pay_by', 'amount'], SALES.filter((r) => r[4] >= 6000).map((r) => [r[1], addDays(r[1], 7), r[4]])) },
          { input: DUUKA_S_B, expected: tbl(['sale_date', 'pay_by', 'amount'], SALES_B.filter((r) => r[4] >= 6000).map((r) => [r[1], addDays(r[1], 7), r[4]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'date() moves a date. Give the new column a name with AS.',
          "`date(sale_date, '+7 day') AS pay_by`, placed between sale_date and amount, and `WHERE amount >= 6000`.",
          "A similar example: `date(sale_date, '-1 day') AS day_before` moves a date back by one day. Yours moves forward 7.",
        ],
      },
    ],
  },

  // ================================================================== 12
  {
    id: 'sql-daily-report',
    level: LEVEL,
    minutes: 26,
    title: 'Project: the daily sales report',
    summary: 'Build three reports with GROUP BY, HAVING and ORDER BY: by payment method, best days, good days',
    blocks: [
      {
        t: 'story',
        title: 'Closing the shop',
        text: "At closing time, Nakato's sister wants three answers. How much came in by cash, by MTN mobile money and by Airtel? Which were the three best days? And on which days did the shop take at least 15,000 shillings?\n\nYou have everything you need: aggregates, `GROUP BY`, `HAVING`, and sorting. Each report is one query.",
      },
      { t: 'h', text: 'Report 1: money by payment method' },
      {
        t: 'project',
        title: 'Revenue by method',
        stdin: DUUKA_S,
        code: 'SELECT method, COUNT(*) AS n, SUM(amount) AS total\nFROM sales\nGROUP BY method\nORDER BY total DESC;\n',
        output: tbl(['method', 'n', 'total'], groups(SALES, (r) => r[5]).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])]).sort((a, b) => b[2] - a[2])),
      },
      { t: 'h', text: 'Report 2: the three best days' },
      {
        t: 'project',
        title: 'Best days',
        stdin: DUUKA_S,
        code: 'SELECT sale_date, SUM(amount) AS takings\nFROM sales\nGROUP BY sale_date\nORDER BY takings DESC\nLIMIT 3;\n',
        output: tbl(['sale_date', 'takings'], groups(SALES, (r) => r[1]).map(([k, g]) => [k, sum(g, (r) => r[4])]).sort((a, b) => b[1] - a[1]).slice(0, 3)),
      },
      { t: 'h', text: 'Report 3: the good days' },
      { t: 'p', text: 'Only days that took at least 15,000 shillings, in date order. A test on a total is a job for `HAVING`.' },
      {
        t: 'project',
        title: 'Good days',
        stdin: DUUKA_S,
        code: 'SELECT sale_date, COUNT(*) AS sales, SUM(amount) AS takings\nFROM sales\nGROUP BY sale_date\nHAVING SUM(amount) >= 15000\nORDER BY sale_date;\n',
        output: tbl(['sale_date', 'sales', 'takings'], groups(SALES, (r) => r[1]).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])]).filter((r) => r[2] >= 15000)),
      },
      {
        t: 'quiz',
        question: 'In Report 3, which part decides which DAYS are kept?',
        options: ['HAVING SUM(amount) >= 15000', 'GROUP BY sale_date', 'ORDER BY sale_date', 'COUNT(*) AS sales'],
        answer: 0,
        explain: 'GROUP BY makes one pile per day. HAVING then keeps the piles whose total is big enough.',
      },
      {
        t: 'recap',
        items: [
          'A report is: pick rows (`WHERE`), make piles (`GROUP BY`), total them (aggregates), keep good piles (`HAVING`), sort and cut (`ORDER BY`, `LIMIT`).',
          'You can group by a column you did not total, like the payment method or the date.',
          'Level 2 is done: you can summarise any table. Next: changing data and building your own tables.',
        ],
        memory: 'Piles, totals, filter the piles, sort.',
      },
    ],
    exercises: [
      {
        id: 'sql12-by-method',
        title: 'How did they pay?',
        prompt: 'Show each payment `method`, the number of sales headed `n` and the total `amount` headed `total`. Put the method with the biggest total first.',
        starter: '-- method, n, total, biggest total first\nSELECT method FROM sales;\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['method', 'n', 'total'], groups(SALES, (r) => r[5]).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])]).sort((a, b) => b[2] - a[2])) },
          { input: DUUKA_S_B, expected: tbl(['method', 'n', 'total'], groups(SALES_B, (r) => r[5]).map(([k, g]) => [k, g.length, sum(g, (r) => r[4])]).sort((a, b) => b[2] - a[2])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'One row per method: GROUP BY method. Then two aggregates, and sort by the total.',
          '`COUNT(*) AS n, SUM(amount) AS total ... GROUP BY method ORDER BY total DESC`',
          'A similar example: `SELECT town, COUNT(*) AS n FROM customers GROUP BY town ORDER BY n DESC;` Yours groups sales by method.',
        ],
      },
      {
        id: 'sql12-top-days',
        title: 'The best three days',
        prompt: 'Show the 3 days with the biggest takings: `sale_date` and the total `amount` of that day headed `takings`. Biggest first.',
        starter: '-- The 3 best days: sale_date and takings\nSELECT sale_date, amount FROM sales;\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['sale_date', 'takings'], groups(SALES, (r) => r[1]).map(([k, g]) => [k, sum(g, (r) => r[4])]).sort((a, b) => b[1] - a[1]).slice(0, 3)) },
          { input: DUUKA_S_B, expected: tbl(['sale_date', 'takings'], groups(SALES_B, (r) => r[1]).map(([k, g]) => [k, sum(g, (r) => r[4])]).sort((a, b) => b[1] - a[1]).slice(0, 3)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'One pile per day, total each pile, sort the piles by that total, keep three.',
          '`SUM(amount) AS takings ... GROUP BY sale_date ORDER BY takings DESC LIMIT 3`',
          'A similar example: `GROUP BY method ORDER BY n DESC LIMIT 1` finds the most used payment method. Yours groups by day and keeps three.',
        ],
      },
      {
        id: 'sql12-good-days',
        title: 'The good days',
        prompt: 'Show `sale_date` and `takings` (the total amount of that day) for the days that took at least 15000, in date order.',
        starter: '-- Days with takings of at least 15000, in date order\nSELECT sale_date, SUM(amount) AS takings FROM sales GROUP BY sale_date;\n',
        usesInput: true,
        sampleInput: DUUKA_S,
        tests: [
          { input: DUUKA_S, expected: tbl(['sale_date', 'takings'], groups(SALES, (r) => r[1]).map(([k, g]) => [k, sum(g, (r) => r[4])]).filter((r) => r[1] >= 15000)) },
          { input: DUUKA_S_B, expected: tbl(['sale_date', 'takings'], groups(SALES_B, (r) => r[1]).map(([k, g]) => [k, sum(g, (r) => r[4])]).filter((r) => r[1] >= 15000)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The starter already gives the takings per day. Keep only the big piles, then sort.',
          '`HAVING SUM(amount) >= 15000`, then `ORDER BY sale_date`.',
          'A similar example: `HAVING COUNT(*) > 2` keeps the groups with more than two rows. Yours tests the total amount.',
        ],
      },
    ],
  },
];
