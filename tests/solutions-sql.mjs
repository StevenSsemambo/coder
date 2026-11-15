// Reference solutions for the SQL course (see docs/SQL-TRACK.md). Every SQL exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
export const sqlSolutions = {
  // Level 1: Reading data
  'sql1-products': 'SELECT * FROM products;',
  'sql1-customers': 'SELECT * FROM customers;',
  'sql1-both': 'SELECT * FROM customers;\nSELECT * FROM products;',
  'sql2-list': 'SELECT name, price FROM products;',
  'sql2-alias': 'SELECT name AS Item, stock AS Remaining FROM products;',
  'sql2-categories': 'SELECT DISTINCT category FROM products;',
  'sql3-cheap': 'SELECT name, price FROM products WHERE price < 2000;',
  'sql3-school': "SELECT name, stock FROM products WHERE category = 'School' AND stock > 50;",
  'sql3-trouble': 'SELECT name, stock, price FROM products WHERE stock = 0 OR price > 10000;',
};
