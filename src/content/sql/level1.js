// SQL, Level 1: Reading data. Lessons 1 to 3 (tables and SELECT, choosing columns, filtering with WHERE).
// Prose uses double-quoted strings (so apostrophes are free; curly quotes are used inside the text).
// SQL code uses plain template literals (no backticks or dollar-brace inside the SQL).
//
// Expected outputs are computed from plain JavaScript data (see shared.js), never from the SQL itself.
import { DUUKA, DUUKA_B, PRODUCTS, PRODUCTS_B, CUSTOMERS, CUSTOMERS_B, tbl, tables, tableScript, productView, customerView, allProducts, allCustomers } from './shared.js';

const LEVEL = 'Level 1: Reading data';

const PUPILS = tableScript('pupils', 'name TEXT, age INTEGER', [['Amina', 12], ['Brian', 13], ['Grace', 11]]);

// What a dataset's rows look like after a JavaScript filter (the independent way of knowing the answer).
const np = (rows) => productView(['name', 'price'], rows);

export const level1 = [
  // ================================================================== 1
  {
    id: 'sql-tables',
    level: LEVEL,
    minutes: 18,
    title: 'Tables and your first query',
    summary: 'What a database is, tables, rows and columns, and SELECT * FROM',
    blocks: [
      {
        t: 'story',
        title: 'The stock book',
        text: "Nakato runs a small duuka near the campus gate. Every item she sells is written in a big exercise book: one line for sugar, one for rice, one for soap. Each line has the same boxes: the name, the price, how many are left.\n\nWhen her cousin asks, “How many tins of cooking oil do we have?”, she flips through the pages, runs her finger down the lines, and finds it. It takes a minute. Now imagine a book that answers in a blink, even with a million lines. That is a database, and the language you use to ask it questions is called SQL.",
      },
      { t: 'p', text: "Below is Nakato's stock book as a **table** inside a database. Press **Run** to ask for everything in it." },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT * FROM products;\n',
        output: allProducts(),
      },
      { t: 'analogy', text: "A table is one ruled page of the stock book. The **columns** are the headings that run across the top (name, price, stock). Each **row** is one line on the page: one product, with a value in every column. The whole database is the whole book: many pages, called tables." },
      { t: 'h', text: 'The words you need' },
      {
        t: 'list',
        items: [
          '**Table**: a set of rows that all have the same columns. Here: `products`.',
          '**Column**: one kind of fact, such as `name` or `price`. Every column has a name.',
          '**Row**: one thing, such as one product. Also called a **record**.',
          '**Query**: a question you ask the database, written in SQL.',
          '`SELECT` means “show me”. `*` means “every column”. `FROM products` says which table to look in.',
          'A query ends with a semicolon `;`.',
        ],
      },
      { t: 'tip', text: "Capital letters do not matter to SQL: `select * from products;` works too. Programmers usually write the SQL words (SELECT, FROM) in capitals so they stand out from the table and column names." },
      { t: 'p', text: 'A database can hold many tables. This one also has a `customers` table. Same question, different table:' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT * FROM customers;\n',
        output: allCustomers(),
      },
      {
        t: 'predict',
        stdin: PUPILS,
        code: 'SELECT * FROM pupils;\n',
        question: 'The pupils table has the columns name and age, and 3 rows. What does this query show?',
        options: [
          tbl(['name', 'age'], [['Amina', 12], ['Brian', 13], ['Grace', 11]]),
          tbl(['name', 'age'], []),
          tbl(['name', 'age'], [['Amina', 12]]),
          tbl(['age', 'name'], [[12, 'Amina'], [13, 'Brian'], [11, 'Grace']]),
        ],
        answer: 0,
        explain: 'The star `*` means every column, and a query with no filter returns every row. So you get both columns, in the order the table was made, and all 3 rows.',
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap so the query shows every column of the customers table.',
        template: 'SELECT ___ FROM customers;\n',
        blanks: [{ options: ['*', 'all', 'everything'], answer: '*' }],
        output: allCustomers(),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'SELECT * FORM customers;\n',
        question: 'This query fails with a “syntax error”. What is wrong?',
        options: ['FROM is misspelled as FORM', 'The table name must be in capitals', 'The star must be in quotes', 'There must be two semicolons'],
        answer: 0,
        explain: 'SQL only understands its words when they are spelled exactly. FORM is not a SQL word, so SQL gets lost at that spot. The error message points to it: `near "FORM"`.',
        fixed: 'SELECT * FROM customers;\n',
      },
      {
        t: 'quiz',
        question: 'In the products table, what is ONE ROW?',
        options: ['One product, with a value for every column', 'The word “price” at the top', 'The whole table', 'All the prices added together'],
        answer: 0,
        explain: 'Rows run left to right and each one describes a single thing. Columns run top to bottom and each one holds one kind of fact for every row.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT * FROM;', why: 'You forgot to say WHICH table. SQL needs a table name after FROM.', right: 'SELECT * FROM products;', stdin: DUUKA },
          { wrong: 'SELECT * FROM product;', why: 'The table is called products (with an s). One wrong letter and SQL says “no such table”.', right: 'SELECT * FROM products;', stdin: DUUKA },
          { wrong: 'SELECT * FROM products SELECT * FROM customers;', why: 'Two queries in one line need a semicolon between them. Without it, SQL thinks the second SELECT is part of the first one.', right: 'SELECT * FROM products;\nSELECT * FROM customers;', stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          'A database holds **tables**. A table has **columns** (headings) and **rows** (one thing per row).',
          '`SELECT * FROM tablename;` shows every column and every row of a table.',
          'SQL words are not case sensitive, but spelling is, and the query ends with `;`.',
          'Two queries can run one after the other if each ends with a semicolon.',
        ],
        memory: 'SELECT = show me. * = everything. FROM = where from.',
      },
    ],
    exercises: [
      {
        id: 'sql1-products',
        title: 'Open the stock book',
        prompt: 'Show every column and every row of the `products` table.',
        starter: '-- Write your query below. Do not forget the semicolon.\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: allProducts() },
          { input: DUUKA_B, expected: allProducts(PRODUCTS_B), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'You need SELECT, then a symbol that means “every column”, then FROM and the table name.',
          '`SELECT * FROM ...;` and put the table name where the dots are.',
          'A similar example: `SELECT * FROM customers;` shows the whole customers table. Yours is the same, for the table called products.',
        ],
      },
      {
        id: 'sql1-customers',
        title: 'Who are the customers?',
        prompt: 'Show every column and every row of the `customers` table.',
        starter: '-- Show the customers table\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: allCustomers() },
          { input: DUUKA_B, expected: allCustomers(CUSTOMERS_B), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The same kind of query as before, but for a different table.',
          '`SELECT * FROM` and then the name of the table that holds the customers.',
          'A similar example: `SELECT * FROM products;` shows the products table. Yours shows the table called customers.',
        ],
      },
      {
        id: 'sql1-both',
        title: 'Two queries, one run',
        prompt: 'First show the whole `customers` table, then show the whole `products` table. Write two queries, each ending with a semicolon. The results appear one after the other.',
        starter: '-- Query 1: customers\n\n-- Query 2: products\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tables(allCustomers(), allProducts()) },
          { input: DUUKA_B, expected: tables(allCustomers(CUSTOMERS_B), allProducts(PRODUCTS_B)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Write one complete query, end it with `;`, then write the second one.',
          'The customers query comes first, then the products query. Each starts with SELECT and ends with a semicolon.',
          'A similar example: `SELECT * FROM products;` on one line and `SELECT * FROM customers;` on the next runs both. Yours runs them the other way round.',
        ],
      },
    ],
  },

  // ================================================================== 2
  {
    id: 'sql-columns',
    level: LEVEL,
    minutes: 20,
    title: 'Choosing columns',
    summary: 'Pick the columns you want, give them nicknames with AS, and remove repeats with DISTINCT',
    blocks: [
      {
        t: 'story',
        title: 'The shelf price list',
        text: "Nakato wants to stick a price list on the shelf. Customers only need to see the item and the price. They do not need to know who her supplier is or how many are left in the store. So she copies just two columns from her book.\n\nSELECT * shows everything, which is fine for looking around. A real query usually asks only for the columns it needs.",
      },
      { t: 'p', text: 'Instead of `*`, list the column names you want, separated by commas.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT name, price FROM products;\n',
        output: productView(['name', 'price']),
      },
      { t: 'p', text: 'The columns appear in the order **you** list them, not the order of the table. Try swapping them.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT price, name FROM products;\n',
        output: productView(['price', 'name']),
      },
      { t: 'h', text: 'Giving a column a nickname with AS' },
      { t: 'p', text: 'You can rename a column in the result with `AS`. The table itself does not change. If the new name has spaces or brackets, put it in double quotes.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT name AS Item, price AS "Price (UGX)" FROM products;\n',
        output: tbl(['Item', 'Price (UGX)'], PRODUCTS.map((r) => [r[1], r[3]])),
      },
      { t: 'analogy', text: "AS is a sticker. You stick a new label on the column for this one report. The column in the table keeps its old name, like a jar of sugar that still holds sugar after you put “Sweet stuff” on a label for the customers." },
      { t: 'h', text: 'Removing repeats with DISTINCT' },
      { t: 'p', text: 'Nakato wants to know which categories she sells. Asking for `category` gives one line for every product, so “Food” appears again and again. `DISTINCT` keeps each different value only once.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT DISTINCT category FROM products;\n',
        output: tbl(['category'], [['Food'], ['Household'], ['Airtime'], ['School']]),
      },
      { t: 'tip', text: 'Until you learn ORDER BY (lesson 5), SQL does not promise any particular order of rows. Do not depend on it.' },
      {
        t: 'predict',
        stdin: DUUKA,
        code: 'SELECT DISTINCT town FROM customers;\n',
        question: 'Two customers live in Kampala. What does this query show?',
        options: [
          tbl(['town'], [['Kampala'], ['Gulu'], ['Jinja'], ['Mbale'], ['Mbarara']]),
          tbl(['town'], [['Kampala'], ['Gulu'], ['Jinja'], ['Mbale'], ['Kampala'], ['Mbarara']]),
          tbl(['town'], [['Kampala']]),
          tbl(['town'], [['Gulu'], ['Jinja'], ['Kampala'], ['Mbale'], ['Mbarara']]),
        ],
        answer: 0,
        explain: 'DISTINCT removes repeated values, so Kampala appears once. It does not sort. The towns come out in the order SQL first meets them.',
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Fill the gap so the query shows two columns: name and price.',
        template: 'SELECT ___ FROM products;\n',
        blanks: [{ options: ['name, price', 'name price', 'name; price'], answer: 'name, price' }],
        output: productView(['name', 'price']),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'SELECT name, price, FROM products;\n',
        question: 'This query fails with a syntax error near FROM. What is wrong?',
        options: ['There is a comma after the last column', 'FROM must come first', 'price is not allowed as a column name', 'The table name is missing'],
        answer: 0,
        explain: 'Commas go BETWEEN column names, never after the last one. SQL sees the comma and waits for another column, then meets FROM instead.',
        fixed: 'SELECT name, price FROM products;\n',
      },
      {
        t: 'quiz',
        question: 'Which word gives a column a new name in the result?',
        options: ['AS', 'IS', 'NAME', 'LIKE'],
        answer: 0,
        explain: '`SELECT price AS cost` shows the price column under the heading cost. Only the heading in the result changes.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT name price FROM products;', why: 'There is no comma, so SQL does not complain: it thinks price is a nickname for name. You get ONE column of names, headed “price”. No error, but the wrong answer.', right: 'SELECT name, price FROM products;', logic: true, stdin: DUUKA },
          { wrong: 'SELECT name, price, FROM products;', why: 'A comma after the last column. Commas go between columns only.', right: 'SELECT name, price FROM products;', stdin: DUUKA },
          { wrong: 'SELECT price AS Price (UGX) FROM products;', why: 'A nickname with spaces or brackets must be inside double quotes.', right: 'SELECT price AS "Price (UGX)" FROM products;', stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          'List the columns you want after SELECT, separated by commas. They appear in that order.',
          '`AS` gives a column a nickname in the result. Use double quotes if the nickname has spaces.',
          '`SELECT DISTINCT` shows each different value once.',
          'No comma after the last column. A missing comma between two columns does NOT give an error, it gives a wrong result.',
        ],
        memory: 'Ask only for what you need. Commas between, never after.',
      },
    ],
    exercises: [
      {
        id: 'sql2-list',
        title: 'The shelf price list',
        prompt: 'Show the `name` and the `price` of every product, in that order.',
        starter: '-- Show the name and price of every product\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: productView(['name', 'price']) },
          { input: DUUKA_B, expected: productView(['name', 'price'], PRODUCTS_B), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Write the two column names after SELECT, with a comma between them.',
          '`SELECT name, price FROM products;`',
          'A similar example: `SELECT name, phone FROM customers;` lists two columns of the customers table. Yours lists two columns of products.',
        ],
      },
      {
        id: 'sql2-alias',
        title: 'A report for the owner',
        prompt: 'Show every product\'s name headed `Item` and its stock headed `Remaining`, in that order. Use AS to rename the columns.',
        starter: '-- Rename the columns with AS\nSELECT name, stock FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['Item', 'Remaining'], PRODUCTS.map((r) => [r[1], r[4]])) },
          { input: DUUKA_B, expected: tbl(['Item', 'Remaining'], PRODUCTS_B.map((r) => [r[1], r[4]])), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Put AS and the new name right after each column you want to rename.',
          '`SELECT name AS Item, stock AS ...` and finish the second nickname and the rest of the query.',
          'A similar example: `SELECT price AS Cost FROM products;` shows prices under the heading Cost. Do that for both columns.',
        ],
      },
      {
        id: 'sql2-categories',
        title: 'What do we sell?',
        prompt: 'Show each different `category` of product once.',
        starter: '-- Each category only once\nSELECT category FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: tbl(['category'], [['Food'], ['Household'], ['Airtime'], ['School']]) },
          { input: DUUKA_B, expected: tbl(['category'], [['Food'], ['School'], ['Household'], ['Airtime']]), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The starter shows a category for every product, so repeats appear. One word after SELECT removes them.',
          'Add DISTINCT right after SELECT.',
          'A similar example: `SELECT DISTINCT supplier FROM products;` lists each supplier once. Yours lists each category once.',
        ],
      },
    ],
  },

  // ================================================================== 3
  {
    id: 'sql-where',
    level: LEVEL,
    minutes: 24,
    title: 'Filtering rows with WHERE',
    summary: 'Compare values, combine conditions with AND, OR, NOT, and use IN and BETWEEN',
    blocks: [
      {
        t: 'story',
        title: 'Anything for school under 2,000?',
        text: "A mother walks into Nakato's duuka. “Do you have anything for school that costs less than 2,000 shillings?” Nakato does not read out the whole stock book. Her eyes check each line with two questions: is it for school? is it under 2,000? Only the lines that pass both questions are read out.\n\nIn SQL, that checking is the job of `WHERE`. It keeps the rows that pass your test and drops the rest.",
      },
      { t: 'p', text: 'Put `WHERE` after the table name, followed by a test. Text must be inside **single quotes**. Numbers have no quotes.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "SELECT name, price FROM products WHERE category = 'School';\n",
        output: np(PRODUCTS.filter((r) => r[2] === 'School')),
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT name, price FROM products WHERE price < 2000;\n',
        output: np(PRODUCTS.filter((r) => r[3] < 2000)),
      },
      { t: 'h', text: 'The comparison signs' },
      {
        t: 'list',
        items: [
          '`=` equal to. (One equals sign, not two.)',
          '`<>` not equal to. (`!=` also works.)',
          '`<` less than, `>` greater than.',
          '`<=` less than or equal to, `>=` greater than or equal to.',
        ],
      },
      { t: 'h', text: 'Combining tests with AND, OR and NOT' },
      { t: 'analogy', text: "`AND` is a gate with two locks: both must open. `OR` is a gate with two doors: either one will do. `NOT` flips the answer: what used to pass is dropped, and what was dropped now passes." },
      {
        t: 'try',
        stdin: DUUKA,
        code: "SELECT name, price FROM products WHERE category = 'School' AND price < 1000;\n",
        output: np(PRODUCTS.filter((r) => r[2] === 'School' && r[3] < 1000)),
      },
      {
        t: 'predict',
        stdin: DUUKA,
        code: "SELECT name, price FROM products WHERE category = 'Food' OR price < 1000;\n",
        question: 'Which rows does this query keep?',
        options: [
          np(PRODUCTS.filter((r) => r[2] === 'Food' || r[3] < 1000)),
          np(PRODUCTS.filter((r) => r[2] === 'Food' && r[3] < 1000)),
          np(PRODUCTS.filter((r) => r[2] === 'Food')),
          np(PRODUCTS.filter((r) => r[3] < 1000)),
        ],
        answer: 0,
        explain: 'OR keeps a row when EITHER test is true: every Food product, plus the Biro pen because it costs less than 1,000. With AND, nothing would pass (no Food item costs under 1,000).',
      },
      { t: 'h', text: 'IN and BETWEEN: shortcuts' },
      { t: 'p', text: '`IN` checks against a list, instead of writing many `OR`s. `BETWEEN` checks a range, and **includes both ends**.' },
      {
        t: 'try',
        stdin: DUUKA,
        code: "SELECT name, category FROM products WHERE category IN ('Airtime', 'School');\n",
        output: productView(['name', 'category'], PRODUCTS.filter((r) => ['Airtime', 'School'].includes(r[2]))),
      },
      {
        t: 'try',
        stdin: DUUKA,
        code: 'SELECT name, price FROM products WHERE price BETWEEN 1000 AND 2000;\n',
        output: np(PRODUCTS.filter((r) => r[3] >= 1000 && r[3] <= 2000)),
      },
      {
        t: 'fill',
        stdin: DUUKA,
        prompt: 'Nakato wants the names of products that have run out (stock is 0). Fill the gap.',
        template: 'SELECT name FROM products WHERE stock ___ 0;\n',
        blanks: [{ options: ['=', '<>', '>'], answer: '=' }],
        output: productView(['name'], PRODUCTS.filter((r) => r[4] === 0)),
      },
      {
        t: 'bug',
        stdin: DUUKA,
        code: 'SELECT name FROM products WHERE category = Food;\n',
        question: 'This query fails with “no such column: Food”. What is wrong?',
        options: ['Text must be in single quotes', 'WHERE must come before FROM', 'The word Food is too short', 'category cannot be compared'],
        answer: 0,
        explain: 'Without quotes, SQL thinks Food is the name of a column. Text values always go inside single quotes: `\'Food\'`.',
        fixed: "SELECT name FROM products WHERE category = 'Food';\n",
      },
      {
        t: 'quiz',
        question: 'Does `price BETWEEN 1000 AND 2000` include a product that costs exactly 1,000 and one that costs exactly 2,000?',
        options: ['Yes, both ends are included', 'Only the 1,000 one', 'Only the 2,000 one', 'Neither'],
        answer: 0,
        explain: 'BETWEEN is the same as `price >= 1000 AND price <= 2000`. Both ends count.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: 'SELECT name FROM products WHERE category = Food;', why: 'Food without quotes is read as a column name.', right: "SELECT name FROM products WHERE category = 'Food';", stdin: DUUKA },
          { wrong: 'SELECT name FROM products WHERE price > 1000 AND < 2000;', why: 'Each side of AND must be a full test. `< 2000` alone has nothing to compare.', right: 'SELECT name FROM products WHERE price > 1000 AND price < 2000;', stdin: DUUKA },
          { wrong: "SELECT name FROM products WHERE category = 'food';", why: 'Text is compared letter by letter, capitals included, so “food” is not “Food”. No error: you just get no rows.', right: "SELECT name FROM products WHERE category = 'Food';", logic: true, stdin: DUUKA },
          { wrong: "SELECT name FROM products WHERE category = 'School' OR 'Food';", why: 'After OR you need a full test again. SQL does not complain, but it treats the lonely text as a false value, so you only get the School products.', right: "SELECT name FROM products WHERE category IN ('School', 'Food');", logic: true, stdin: DUUKA },
        ],
      },
      {
        t: 'recap',
        items: [
          '`WHERE` keeps the rows that pass a test. It goes after the table name.',
          'Text goes in single quotes and must match exactly, capitals included. Numbers have no quotes.',
          'Compare with `=`, `<>`, `<`, `>`, `<=`, `>=`.',
          '`AND` needs both tests true, `OR` needs one, `NOT` flips a test.',
          '`IN (...)` checks a list. `BETWEEN a AND b` checks a range and includes both ends.',
        ],
        memory: 'WHERE is the doorman: only rows that pass the test come in.',
      },
    ],
    exercises: [
      {
        id: 'sql3-cheap',
        title: 'Budget buys',
        prompt: 'Show the `name` and `price` of every product that costs less than 2000.',
        starter: '-- Name and price of products under 2000\nSELECT name, price FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: np(PRODUCTS.filter((r) => r[3] < 2000)) },
          { input: DUUKA_B, expected: np(PRODUCTS_B.filter((r) => r[3] < 2000)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'The starter shows every product. Add a WHERE part at the end, before the semicolon.',
          '`WHERE price < 2000`',
          'A similar example: `SELECT name FROM products WHERE stock > 50;` keeps products with more than 50 in stock. Yours tests the price.',
        ],
      },
      {
        id: 'sql3-school',
        title: 'Plenty of school supplies',
        prompt: 'Show the `name` and `stock` of every product in the category `School` that has MORE than 50 in stock.',
        starter: '-- School products with more than 50 in stock\nSELECT name, stock FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: productView(['name', 'stock'], PRODUCTS.filter((r) => r[2] === 'School' && r[4] > 50)) },
          { input: DUUKA_B, expected: productView(['name', 'stock'], PRODUCTS_B.filter((r) => r[2] === 'School' && r[4] > 50)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'You need two tests at once, joined by AND. One about the category, one about the stock.',
          "`WHERE category = 'School' AND stock > 50`",
          "A similar example: `WHERE category = 'Food' AND price < 4000` keeps cheap Food items. Yours uses School and stock.",
        ],
      },
      {
        id: 'sql3-trouble',
        title: 'Out of stock or too expensive',
        prompt: 'Show the `name`, `stock` and `price` of every product that is out of stock (stock is 0) OR costs more than 10000.',
        starter: '-- name, stock, price of products that are out of stock OR cost more than 10000\nSELECT name, stock, price FROM products;\n',
        usesInput: true,
        sampleInput: DUUKA,
        tests: [
          { input: DUUKA, expected: productView(['name', 'stock', 'price'], PRODUCTS.filter((r) => r[4] === 0 || r[3] > 10000)) },
          { input: DUUKA_B, expected: productView(['name', 'stock', 'price'], PRODUCTS_B.filter((r) => r[4] === 0 || r[3] > 10000)), hidden: true, name: 'A different shop' },
        ],
        hints: [
          'Either test is enough for a row to stay, so join the two tests with OR.',
          '`WHERE stock = 0 OR price > 10000`',
          "A similar example: `WHERE category = 'Airtime' OR stock > 90` keeps Airtime items and any heavily stocked item. Yours tests stock and price.",
        ],
      },
    ],
  },
];
