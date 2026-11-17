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

// ---- Level 3 helpers: the Mobile Money fee calculator (made-up fee tables, for teaching only) ----------------------
/** Made-up "send money" fee: up to 5,000 -> 100; 30,000 -> 300; 100,000 -> 700; 500,000 -> 1,500; 2,000,000 -> 2,500; above -> 4,000. */
export const sendFee = (a) => (a <= 5000 ? 100 : a <= 30000 ? 300 : a <= 100000 ? 700 : a <= 500000 ? 1500 : a <= 2000000 ? 2500 : 4000);
/** Made-up 0.5% levy on withdrawals only, rounded up to a whole shilling (integer maths: amount * 5 / 1000). */
export const levy = (type, a) => (type === 'withdraw' ? Math.ceil((a * 5) / 1000) : 0);
export const momoFee = (type, a) => (type === 'send' ? sendFee(a) : type === 'withdraw' ? boothFee('withdraw', a) : 0);

/** Parse one `type,amount` input line the way the project does; null when it is not valid. */
export function parseMomoLine(raw) {
  const parts = raw.trim().split(',');
  if (parts.length !== 2) return null;
  const type = parts[0].trim().toLowerCase();
  const text = parts[1].trim();
  if (!['send', 'withdraw', 'pay'].includes(type) || !/^\d+$/.test(text) || Number(text) === 0) return null;
  return [type, Number(text)];
}

export const MOMO_RULE = '-'.repeat(47);
const col = (type, amount, fee, lv, total) =>
  `${type.padEnd(9)} ${amount.padStart(10)} ${fee.padStart(7)} ${lv.padStart(6)} ${total.padStart(11)}`;
export const momoHeader = () => [col('Type', 'Amount', 'Fee', 'Levy', 'Total'), MOMO_RULE];

/** The statement of the project lesson, as lines. `summary` adds the closing lines. Blank input lines are ignored. */
export function momoStatement(inputLines, summary = true) {
  const lines = momoHeader();
  let valid = 0;
  let invalid = 0;
  let fees = 0;
  let levies = 0;
  for (const raw of inputLines) {
    const line = raw.trim();
    if (line === '') continue;
    const p = parseMomoLine(line);
    if (!p) {
      lines.push(`Invalid: ${line}`);
      invalid++;
      continue;
    }
    const [type, amount] = p;
    const f = momoFee(type, amount);
    const l = levy(type, amount);
    valid++;
    fees += f;
    levies += l;
    lines.push(col(type[0].toUpperCase() + type.slice(1), money(amount), money(f), money(l), money(amount + f + l)));
  }
  if (summary) lines.push(MOMO_RULE, `Valid: ${valid}, invalid: ${invalid}`, `Fees collected : UGX ${money(fees)}`, `Levy collected : UGX ${money(levies)}`);
  return lines;
}

/** The PHP function library of the Mobile Money project (lesson 18 and its exercises), as one piece of PHP code. */
export const MOMO_LIB = php`<?php
declare(strict_types=1);

function sendFee(int $amount): int {
    if ($amount <= 5000) {
        return 100;
    }
    if ($amount <= 30000) {
        return 300;
    }
    if ($amount <= 100000) {
        return 700;
    }
    if ($amount <= 500000) {
        return 1500;
    }
    if ($amount <= 2000000) {
        return 2500;
    }
    return 4000;
}

function withdrawFee(int $amount): int {
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

function fee(string $type, int $amount): int {
    return match ($type) {
        "send" => sendFee($amount),
        "withdraw" => withdrawFee($amount),
        default => 0,
    };
}

function levy(string $type, int $amount): int {
    return $type === "withdraw" ? (int) ceil($amount * 5 / 1000) : 0;
}

function parseAmount(string $text): ?int {
    $t = trim($text);
    return ctype_digit($t) ? (int) $t : null;
}

function parseLine(string $line): ?array {
    $parts = explode(",", $line);
    if (count($parts) !== 2) {
        return null;
    }
    $type = strtolower(trim($parts[0]));
    $amount = parseAmount($parts[1]);
    if (!in_array($type, ["send", "withdraw", "pay"], true) || $amount === null || $amount === 0) {
        return null;
    }
    return [$type, $amount];
}

function money(int $n): string {
    return number_format($n);
}
`;
