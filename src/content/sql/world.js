// Expected-answer helpers for Level 4. Everything here is plain JavaScript over the practice data (never SQL),
// so lessons compare the SQL against an independent calculation.
import { PRODUCTS, PRODUCTS_B, CUSTOMERS, CUSTOMERS_B, ORDERS, ORDERS_B, ITEMS, ITEMS_B } from './shared.js';

export const cmp = (a, b) => (a === b ? 0 : a === null ? -1 : b === null ? 1 : a < b ? -1 : 1);
export const sum = (rows, f) => rows.reduce((n, r) => n + f(r), 0);
export const uniq = (xs) => [...new Set(xs)];

/** One shop's data, linked up. product row: id, name, category, price, stock, supplier. customer row: id, name, phone, town. */
const world = (P, C, O, I) => {
  const prod = Object.fromEntries(P.map((r) => [r[0], r]));
  const cust = Object.fromEntries(C.map((r) => [r[0], r]));
  const order = Object.fromEntries(O.map((r) => [r[0], r]));
  const lines = I.map((i) => {
    const o = order[i[1]];
    const p = prod[i[2]];
    return { id: i[0], order: o, product: p, customer: cust[o[1]], qty: i[3], total: i[3] * p[3] };
  });
  return { P, C, O, I, prod, cust, order, lines };
};
export const WA = world(PRODUCTS, CUSTOMERS, ORDERS, ITEMS);
export const WB = world(PRODUCTS_B, CUSTOMERS_B, ORDERS_B, ITEMS_B);

/** [customer row, lines of that customer], for every customer, in customer-id order (no lines for one who never ordered). */
export const byCustomer = (W) => W.C.map((c) => [c, W.lines.filter((l) => l.customer[0] === c[0])]);
/** order total for every order id. */
export const orderTotal = (W, orderId) => sum(W.lines.filter((l) => l.order[0] === orderId), (l) => l.total);
/** [product row, lines selling it], for every product. */
export const byProduct = (W) => W.P.map((p) => [p, W.lines.filter((l) => l.product[0] === p[0])]);
