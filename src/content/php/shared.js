// PHP course helpers. Expected outputs are computed here in plain JavaScript (never by running the PHP),
// so every lesson compares the PHP against an independent calculation.
//
// `php` is String.raw: PHP code can be written with its backslashes as they are (\n stays \n) and with $variables.
// Do not use backticks or ${ inside PHP code in these files.
export const php = String.raw;

/** Lines joined with newlines, ending with a newline (what echo "...\n" lines print). */
export const out = (...lines) => lines.join('\n') + '\n';

/** 1234567 -> "1,234,567" (what number_format() prints). */
export const money = (n) => Math.round(n).toLocaleString('en-US');

/** ucwords() for plain names: first letter of each space-separated word in capitals, the rest unchanged. */
export const ucwords = (s) => s.split(' ').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');

// ---- Nambi's Money Booth: the course project (the fee table is made up for teaching) --------------------------------
export const BOOTH = "NAMBI'S MONEY BOOTH";

/** Fee table of the booth. Deposits are free. Withdrawals: up to 50,000 -> 1,000; up to 200,000 -> 2,000; above -> 3,500. */
export const boothFee = (service, amount) => (service === 'deposit' ? 0 : amount <= 50000 ? 1000 : amount <= 200000 ? 2000 : 3500);

export const RECEIPT_WIDTH = 32;
const EQ = '='.repeat(RECEIPT_WIDTH);
const DASH = '-'.repeat(RECEIPT_WIDTH);

export const receiptHeader = () => out(EQ, ` ${BOOTH} - MUKONO`, EQ);

/** The three input lines of the receipt programs: name, service, amount. */
export const receiptInput = (name, service, amount) => `${name}\n${service}\n${amount}\n`;

/** The finished receipt, built independently of the PHP. */
export function receipt(name, service, amount) {
  const s = service.toLowerCase();
  const fee = boothFee(s, amount);
  return (
    receiptHeader() +
    out(
      `Customer : ${ucwords(name)}`,
      `Service  : ${s[0].toUpperCase() + s.slice(1)}`,
      `Amount   : UGX ${money(amount)}`,
      `Fee      : UGX ${money(fee)}`,
      DASH,
      `TOTAL    : UGX ${money(amount + fee)}`,
      'Thank you! Come again.',
    )
  );
}

// ---- Level 2 helpers ---------------------------------------------------------------------------------------------------
/** "name,service,amount" lines, one per transaction, as the daily-summary programs read them (after the count line). */
export const txInput = (txs) => `${txs.length}\n` + txs.map((t) => t.join(',')).join('\n') + '\n';

/** The same lines without the count line (for programs that read until the end of the input). */
export const txRows = (txs) => txs.map((t) => t.join(',')).join('\n') + '\n';

/** Rank customers by total money moved: highest first, ties by name A to Z. Returns [[name, total], ...]. */
export function ranking(txs) {
  const totals = new Map();
  for (const [name, , amount] of txs) totals.set(name, (totals.get(name) || 0) + amount);
  return [...totals.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

/** The daily summary of the project lesson, as an array of lines (so each project step can be checked against a prefix). */
export function summaryLines(txs) {
  const dep = txs.filter((t) => t[1] === 'deposit');
  const wd = txs.filter((t) => t[1] !== 'deposit');
  const sum = (l) => l.reduce((s, t) => s + t[2], 0);
  const fees = txs.reduce((s, t) => s + boothFee(t[1], t[2]), 0);
  let big = txs[0];
  for (const t of txs) if (t[2] > big[2]) big = t;
  const names = [...new Set(txs.map((t) => t[0]))].sort();
  return [
    `DAILY SUMMARY - ${BOOTH}`,
    `Transactions : ${txs.length}`,
    `Deposits     : ${dep.length} (UGX ${money(sum(dep))})`,
    `Withdrawals  : ${wd.length} (UGX ${money(sum(wd))})`,
    `Fees earned  : UGX ${money(fees)}`,
    `Biggest      : ${big[0]} (UGX ${money(big[2])})`,
    `Customers    : ${names.join(', ')}`,
  ];
}
