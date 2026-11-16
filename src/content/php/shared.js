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
