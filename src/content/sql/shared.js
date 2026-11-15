// Helpers and practice data shared by the SQL lessons.
//
// How SQL runs in this app (see public/workers/sqlcore.js): the "input" of a SQL run is the PRACTICE
// DATABASE, a CREATE TABLE and INSERT script that is run first on a fresh in-memory SQLite database.
// Then the learner's SQL runs, and every query prints a text table.
//
// Expected outputs in lessons and exercises are built with `tbl` from plain JavaScript data (filter, sort,
// sum, ...), NOT by running the solution query, so the tests compare SQL against an independent answer.

const cell = (v) => (v === null || v === undefined ? 'NULL' : String(v));

/** The table text the app prints for a query result. Must match formatTable in public/workers/sqlcore.js. */
export function tbl(columns, rows) {
  const text = rows.map((r) => r.map(cell));
  const widths = columns.map((c, i) => Math.max(String(c).length, ...text.map((r) => r[i].length)));
  const line = (cells) => cells.map((c, i) => c + ' '.repeat(widths[i] - c.length)).join(' | ').replace(/\s+$/, '');
  const out = [line(columns.map(String)), widths.map((w) => '-'.repeat(w)).join('-+-')];
  if (!text.length) out.push('(0 rows)');
  for (const r of text) out.push(line(r));
  return out.join('\n');
}

/** Several result tables printed one after another, as the app does (a blank line between them). */
export const tables = (...parts) => parts.join('\n\n');

const lit = (v) => (v === null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

/** A CREATE TABLE + INSERT script for one table. */
export function tableScript(name, columnsSql, rows) {
  return `CREATE TABLE ${name} (${columnsSql});\nINSERT INTO ${name} VALUES\n${rows.map((r) => `  (${r.map(lit).join(', ')})`).join(',\n')};`;
}

// ---- Nakato's Duuka: the running example of the SQL course ------------------------------------------
export const PRODUCT_COLS = ['id', 'name', 'category', 'price', 'stock', 'supplier'];
export const PRODUCTS = [
  [1, 'Sugar 1kg', 'Food', 4500, 20, 'Kakira Traders'],
  [2, 'Rice 1kg', 'Food', 3800, 35, 'Kampala Grains'],
  [3, 'Cooking oil 1L', 'Food', 7500, 12, 'Kampala Grains'],
  [4, 'Soap bar', 'Household', 1500, 40, 'Jinja Soaps'],
  [5, 'Matooke bunch', 'Food', 15000, 6, null],
  [6, 'Airtime card 5000', 'Airtime', 5000, 100, null],
  [7, 'Exercise book', 'School', 1200, 60, 'Mukono Paper'],
  [8, 'Biro pen', 'School', 500, 150, 'Mukono Paper'],
  [9, 'Milk 500ml', 'Food', 1800, 0, 'Fresh Dairy'],
  [10, 'Candle', 'Household', 1000, 25, 'Jinja Soaps'],
  [11, 'Toothpaste', 'Household', 3500, 18, null],
  [12, 'Maize flour 1kg', 'Food', 3200, 22, 'Kampala Grains'],
];
// A second shop with different rows: hidden tests use it so a query that only "hard-codes" the visible
// answer cannot pass.
export const PRODUCTS_B = [
  [1, 'Beans 1kg', 'Food', 4200, 14, 'Kampala Grains'],
  [2, 'Bread loaf', 'Food', 3500, 0, null],
  [3, 'Notebook', 'School', 1500, 45, 'Mukono Paper'],
  [4, 'Pencil', 'School', 300, 200, 'Mukono Paper'],
  [5, 'Washing powder', 'Household', 6500, 9, 'Jinja Soaps'],
  [6, 'Airtime card 1000', 'Airtime', 1000, 80, null],
  [7, 'Tomatoes basket', 'Food', 8000, 5, null],
  [8, 'Torch battery', 'Household', 2000, 30, 'Jinja Soaps'],
];

export const CUSTOMER_COLS = ['id', 'name', 'phone', 'town'];
export const CUSTOMERS = [
  [1, 'Amina Nakato', '0700 000 101', 'Kampala'],
  [2, 'Brian Okello', '0700 000 102', 'Gulu'],
  [3, 'Grace Atim', '0700 000 103', 'Jinja'],
  [4, 'Hassan Kato', '0700 000 104', 'Mbale'],
  [5, 'Irene Namutebi', '0700 000 105', 'Kampala'],
  [6, 'Joseph Mugisha', '0700 000 106', 'Mbarara'],
];
export const CUSTOMERS_B = [
  [1, 'Sarah Auma', '0700 000 201', 'Lira'],
  [2, 'Peter Ssemwogerere', '0700 000 202', 'Kampala'],
  [3, 'Ruth Nabirye', '0700 000 203', 'Jinja'],
  [4, 'David Opio', '0700 000 204', 'Soroti'],
];

const PRODUCT_SQL = 'id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER, stock INTEGER, supplier TEXT';
const CUSTOMER_SQL = 'id INTEGER PRIMARY KEY, name TEXT, phone TEXT, town TEXT';

/** The practice database for the lessons: products and customers. */
export const duukaSetup = (products = PRODUCTS, customers = CUSTOMERS) =>
  `${tableScript('products', PRODUCT_SQL, products)}\n\n${tableScript('customers', CUSTOMER_SQL, customers)}`;
export const DUUKA = duukaSetup();
export const DUUKA_B = duukaSetup(PRODUCTS_B, CUSTOMERS_B);

/** Expected table of chosen product columns (in the order given) for some rows. */
export const productView = (names, rows = PRODUCTS) => tbl(names, rows.map((r) => names.map((n) => r[PRODUCT_COLS.indexOf(n)])));
export const customerView = (names, rows = CUSTOMERS) => tbl(names, rows.map((r) => names.map((n) => r[CUSTOMER_COLS.indexOf(n)])));
export const allProducts = (rows = PRODUCTS) => tbl(PRODUCT_COLS, rows);
export const allCustomers = (rows = CUSTOMERS) => tbl(CUSTOMER_COLS, rows);
