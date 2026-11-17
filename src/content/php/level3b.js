// PHP, Level 3: Functions. Lessons 17 and 18 (string tools, the Mobile Money fee calculator project).
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, MOMO_LIB, momoStatement, momoFee, levy, sendFee } from './shared.js';

const LEVEL = 'Level 3: Functions';

// ---- helpers for the expected outputs of lesson 17 ----
const cols = (a, b) => `${a.padEnd(12)} ${b.padStart(10)}`;
const NETWORKS = (p) => (/^0\d{9}$/.test(p) ? (['077', '078', '076'].includes(p.slice(0, 3)) ? 'MTN' : ['070', '075', '074'].includes(p.slice(0, 3)) ? 'Airtel' : 'other') : 'invalid');
const normalise = (p) => {
  const d = p.replace(/\D/g, '');
  return d.startsWith('0') ? '256' + d.slice(1) : d;
};

// The library up to (not including) the functions the learner writes in exercise php18-quote.
const LIB_SEND_WITHDRAW = MOMO_LIB.slice(0, MOMO_LIB.indexOf('function fee('));

const SAMPLE_LINES = ['send,120000', 'withdraw,120000', 'bad', 'pay, 5000'];
const VALID_LINES = ['send,120000', 'withdraw,120000', 'pay,5000', 'send,2500'];
const lines = (a) => a.join('\n') + '\n';

export const level3b = [
  // ================================================================== 17
  {
    id: 'php-strings-pro',
    level: LEVEL,
    minutes: 30,
    title: 'Formatting text and checking it',
    summary: 'sprintf and printf, aligned columns, str_pad, str_contains and a first look at preg_match',
    blocks: [
      {
        t: 'story',
        title: 'The receipt that would not line up',
        text: "Nambi's nephew prints a receipt. The item names are short or long, the prices have three digits or seven, and the right-hand column looks like a staircase. Nambi squints: “Is that 4,500 or 45,000?”\n\nA receipt must line up. And the phone numbers on it must be real: a customer who types 077212345 (a digit missing) should be told at once, not after the money was sent to nowhere. This lesson gives you two sets of tools: tools to **format** text exactly, and tools to **check** it.",
      },
      { t: 'h', text: 'sprintf and printf: a template with holes' },
      { t: 'p', text: '`sprintf` builds text from a template. Each `%` is a hole that a value fills. `printf` does the same and prints straight away.' },
      {
        t: 'try',
        code: php`<?php
$name = "Amina";
$amount = 120000;
echo sprintf("%s paid UGX %s", $name, number_format($amount)), "\n";
printf("%05d\n", 42);
printf("%.2f\n", 3.14159);
`,
        output: out('Amina paid UGX 120,000', '00042', '3.14'),
      },
      {
        t: 'list',
        items: [
          '`%s` takes text, `%d` takes a whole number, `%f` takes a decimal number.',
          '`%05d` means “a whole number, at least 5 characters wide, padded with zeros”: 42 becomes 00042.',
          '`%.2f` means “a decimal number with 2 digits after the point”.',
          '`%-12s` means “text, at least 12 characters wide, **left**-aligned”. Without the minus sign it is right-aligned.',
          'Each hole uses the next value, in order. Too few values is an error.',
        ],
      },
      { t: 'p', text: 'Widths are how receipts line up:' },
      {
        t: 'try',
        code: php`<?php
printf("%-12s %10s\n", "Item", "UGX");
printf("%-12s %10s\n", "Sugar", number_format(4500));
printf("%-12s %10s\n", "Rice", number_format(3000));
`,
        output: out(cols('Item', 'UGX'), cols('Sugar', '4,500'), cols('Rice', '3,000')),
      },
      { t: 'h', text: 'str_pad: pad one piece of text' },
      {
        t: 'try',
        code: php`<?php
echo str_pad("Rice", 10, "."), "3,000\n";
echo str_pad("42", 6, "0", STR_PAD_LEFT), "\n";
echo str_pad("Total", 11, "*", STR_PAD_BOTH), "\n";
`,
        output: out('Rice......3,000', '000042', '***Total***'),
      },
      { t: 'p', text: '`str_pad($text, $width, $fill, $where)` adds the fill character until the text is as wide as asked. By default it pads on the right; `STR_PAD_LEFT` pads on the left and `STR_PAD_BOTH` on both sides.' },
      { t: 'h', text: 'Is this inside that?' },
      {
        t: 'try',
        code: php`<?php
$number = "0772123456";
var_dump(str_starts_with($number, "077"));
var_dump(str_ends_with($number, "56"));
var_dump(str_contains($number, "212"));
`,
        output: out('bool(true)', 'bool(true)', 'bool(true)'),
      },
      { t: 'h', text: 'preg_match: describing a shape' },
      { t: 'p', text: 'To check that text has a certain **shape** (ten digits, starting with 0) you write a **pattern**, called a regular expression, between slashes. `preg_match` answers 1 for “matches” and 0 for “does not”.' },
      {
        t: 'list',
        items: [
          '`^` is the start of the text and `$` is the end. Together they mean “the whole text must look like this”.',
          '`[0-9]` is one digit, and `\\d` means the same. `\\D` is one character that is NOT a digit.',
          '`{9}` means “exactly nine of the thing before it”. `+` means “one or more”.',
        ],
      },
      {
        t: 'try',
        code: php`<?php
function isPhone(string $p): bool {
    return preg_match('/^0[0-9]{9}$/', $p) === 1;
}

var_dump(isPhone("0772123456"));
var_dump(isPhone("077212345"));
var_dump(isPhone("07721234AB"));
`,
        output: out('bool(true)', 'bool(false)', 'bool(false)'),
      },
      { t: 'p', text: 'Round brackets in a pattern **capture** a piece into an array you give as the third argument. And `preg_replace` replaces whatever matches, which is a quick way to clean up messy input:' },
      {
        t: 'try',
        code: php`<?php
if (preg_match('/^(\d{3})(\d{3})(\d{4})$/', "0772123456", $m)) {
    echo $m[1], "-", $m[2], "-", $m[3], "\n";
}
echo preg_replace('/\D/', '', "+256 772-123 456"), "\n";
`,
        output: out('077-212-3456', '256772123456'),
      },
      { t: 'tip', text: "Use single quotes for patterns: a backslash such as `\\d` stays as it is. Patterns are a big subject. These few pieces already check most of what you will meet at a booth (phone numbers, amounts, ids). The prefixes used in the exercises are for practice: real number plans change." },
      {
        t: 'predict',
        code: php`<?php
printf("%05d", 7);
`,
        question: 'What does this program print?',
        options: ['00007', '7', '70000', '0007'],
        answer: 0,
        explain: '%05d means a whole number at least 5 characters wide, padded with zeros on the left, so 7 becomes 00007.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that builds text from a template (without printing it).',
        template: php`<?php
echo ___("%.2f", 2.5), "\n";
`,
        blanks: [{ options: ['sprintf', 'strlen', 'trim'], answer: 'sprintf' }],
        output: '2.50\n',
      },
      {
        t: 'bug',
        code: php`<?php
echo sprintf("%s paid %s", "Amina"), "\n";
`,
        question: 'This program stops with an “ArgumentCountError”. What is wrong?',
        options: ['The template has two holes but only one value is given', 'sprintf cannot print text', '%s must be written %t', 'echo cannot take a comma'],
        answer: 0,
        explain: 'Every % in the template needs a value. With two holes and one value, PHP stops and tells you how many it needed.',
        fixed: php`<?php
echo sprintf("%s paid %s", "Amina", "5,000"), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program works out the total and prints one formatted line.',
        lines: ['<?php', '$name = "Amina";', '$amount = 120000;', '$fee = 2000;', '$total = $amount + $fee;', '$text = sprintf("%s pays UGX %s", $name, number_format($total));', 'echo $text, "\\n";'],
        output: 'Amina pays UGX 122,000\n',
      },
      {
        t: 'quiz',
        question: 'What does "%-10s" do in a printf template?',
        options: ['Shows text at least 10 characters wide, aligned to the left', 'Shows text at most 10 characters long', 'Takes away 10 characters', 'Shows a negative number'],
        answer: 0,
        explain: 'The number is the width. The minus sign says the text sticks to the left and the spaces go on the right. Without the minus the text is aligned to the right.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo sprintf("%s paid %s", "Amina");`, why: 'Two holes, one value: PHP 8 stops with an ArgumentCountError.', right: php`<?php
echo sprintf("%s paid %s", "Amina", "5,000");` },
          { wrong: php`<?php
printf("%d", 2.99);`, why: 'No error, but it prints 2. %d cuts the decimals off instead of rounding. Use round first, or %.0f.', right: php`<?php
printf("%d", round(2.99));`, logic: true },
          { wrong: php`<?php
echo preg_match('/[0-9]{10}/', "x0772123456y");`, why: 'It prints 1 even though the text has letters around the number. Without ^ and $ the pattern only has to appear somewhere inside. Anchor it: /^[0-9]{10}$/.', right: php`<?php
echo preg_match('/^[0-9]{10}$/', "x0772123456y");`, logic: true },
          { wrong: php`<?php
if (preg_match('/^\d+$/', "123") === true) {
    echo "digits";
} else {
    echo "not digits";
}`, why: 'preg_match gives back the number 1, never true, so the strict check === true is always false. Compare with === 1.', right: php`<?php
if (preg_match('/^\d+$/', "123") === 1) {
    echo "digits";
} else {
    echo "not digits";
}`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`sprintf("%s %d %.2f", ...)` builds text; `printf` prints it. `%05d` pads with zeros, `%-12s` left-aligns in 12 characters, `%10s` right-aligns.',
          '`str_pad($text, $width, $fill, STR_PAD_LEFT)` pads one piece of text.',
          '`str_starts_with`, `str_ends_with`, `str_contains` answer yes or no.',
          '`preg_match(\'/^0[0-9]{9}$/\', $text) === 1` checks a shape. Anchor with `^` and `$`. `preg_replace(\'/\\D/\', \'\', $t)` strips what is not a digit.',
        ],
        memory: 'Holes in a template. Widths line things up. ^ and $ anchor a pattern.',
      },
    ],
    exercises: [
      {
        id: 'php17-receipt-lines',
        title: 'A receipt that lines up',
        prompt: 'The first input line is N, then N items as `item,price`. Print each item with the name left-aligned in 14 characters, a space, and the price (with commas) right-aligned in 10 characters. Then a line of 25 dashes and a `TOTAL` line formatted the same way.\n\nFor `Sugar,4500` the line is `Sugar` + 9 spaces + 1 space + `4,500` padded on the left to 10.',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$total = 0;
for ($i = 0; $i < $n; $i++) {
    [$item, $price] = explode(",", trim(fgets(STDIN)));
}
`,
        usesInput: true,
        sampleInput: '3\nSugar,4500\nRice,3000\nSoap,2500\n',
        tests: [
          {
            input: '3\nSugar,4500\nRice,3000\nSoap,2500\n',
            expected: out(...[['Sugar', 4500], ['Rice', 3000], ['Soap', 2500]].map(([a, b]) => `${a.padEnd(14)} ${money(b).padStart(10)}`), '-'.repeat(25), `${'TOTAL'.padEnd(14)} ${money(10000).padStart(10)}`),
          },
          { input: '1\nCooking oil,1250000\n', expected: out(`${'Cooking oil'.padEnd(14)} ${money(1250000).padStart(10)}`, '-'.repeat(25), `${'TOTAL'.padEnd(14)} ${money(1250000).padStart(10)}`), hidden: true, name: 'A big price' },
          { input: '2\nSalt,1000\nTea,500\n', expected: out(`${'Salt'.padEnd(14)} ${'1,000'.padStart(10)}`, `${'Tea'.padEnd(14)} ${'500'.padStart(10)}`, '-'.repeat(25), `${'TOTAL'.padEnd(14)} ${'1,500'.padStart(10)}`), hidden: true, name: 'Short prices' },
        ],
        hints: [
          'printf("%-14s %10s\\n", $item, number_format((int) $price)) prints one line.',
          'Keep a running $total of the prices inside the loop.',
          'After the loop: echo str_repeat("-", 25), "\\n"; and printf the TOTAL line the same way.',
        ],
      },
      {
        id: 'php17-phone-check',
        title: 'Which network?',
        prompt: 'Read phone numbers, one per line, until the input ends. A number is valid when it is exactly ten digits and starts with 0. For a valid one print the number, a colon, a space and the network: `MTN` for the prefixes 077, 078, 076; `Airtel` for 070, 075, 074; `other` for any other prefix. For an invalid one print `0772123: invalid` (with the text that was typed).\n\n(These prefixes are for practice. Real number plans change.)',
        starter: php`<?php
while (($line = fgets(STDIN)) !== false) {
    $phone = trim($line);
}
`,
        usesInput: true,
        sampleInput: '0772123456\n0701234567\n0392123456\n12345\n',
        tests: [
          { input: '0772123456\n0701234567\n0392123456\n12345\n', expected: out(...['0772123456', '0701234567', '0392123456', '12345'].map((p) => `${p}: ${NETWORKS(p)}`)) },
          { input: '0782345678\n0751111111\n07721234AB\n', expected: out(...['0782345678', '0751111111', '07721234AB'].map((p) => `${p}: ${NETWORKS(p)}`)), hidden: true, name: 'More prefixes and a letter' },
          { input: '1772123456\n07721234567\n0741234567\n', expected: out(...['1772123456', '07721234567', '0741234567'].map((p) => `${p}: ${NETWORKS(p)}`)), hidden: true, name: 'Must start with 0 and be exactly ten digits' },
        ],
        hints: [
          'First check the shape: preg_match(\'/^0[0-9]{9}$/\', $phone) === 1. If it fails, print the invalid line.',
          'substr($phone, 0, 3) is the prefix. in_array($prefix, ["077", "078", "076"], true) tells MTN.',
          'A match expression or an if / elseif chain gives MTN, Airtel or other. Print "$phone: network".',
        ],
      },
      {
        id: 'php17-normalise',
        title: 'International format',
        prompt: 'Read phone numbers, one per line, written in any style (`0772 123 456`, `+256772123456`, `0701-234-567`). Print each one as digits only in international format: remove everything that is not a digit; if it starts with 0, replace that 0 with 256.',
        starter: php`<?php
while (($line = fgets(STDIN)) !== false) {
    $phone = trim($line);
}
`,
        usesInput: true,
        sampleInput: '0772 123 456\n+256772123456\n0701-234-567\n',
        tests: [
          { input: '0772 123 456\n+256772123456\n0701-234-567\n', expected: out(...['0772 123 456', '+256772123456', '0701-234-567'].map(normalise)) },
          { input: '256751111111\n', expected: '256751111111', hidden: true, name: 'Already international' },
          { input: '(0392) 123 456\n0 772 000 000\n', expected: out(...['(0392) 123 456', '0 772 000 000'].map(normalise)), hidden: true, name: 'Brackets and spaces' },
        ],
        hints: [
          'preg_replace(\'/\\D/\', \'\', $phone) removes every character that is not a digit.',
          'If str_starts_with($digits, "0"), the new number is "256" . substr($digits, 1).',
          'Print the result of each line followed by a new line.',
        ],
      },
      {
        id: 'php17-tx-ids',
        title: 'Transaction lines',
        prompt: 'Read lines `id,name,amount` until the input ends. Print each one in a single `sprintf` template: `TX-` and the id padded with zeros to 6 digits, two spaces, the name left-aligned in 8 characters, a space, `UGX `, and the amount with commas.\n\n`TX-000042  Amina    UGX 120,000`',
        starter: php`<?php
while (($line = fgets(STDIN)) !== false) {
    [$id, $name, $amount] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: '42,Amina,120000\n7,Brian,35000\n',
        tests: [
          {
            input: '42,Amina,120000\n7,Brian,35000\n',
            expected: out(`TX-000042  ${'Amina'.padEnd(8)} UGX ${money(120000)}`, `TX-000007  ${'Brian'.padEnd(8)} UGX ${money(35000)}`),
          },
          { input: '123456,Grace,800000\n', expected: `TX-123456  ${'Grace'.padEnd(8)} UGX ${money(800000)}`, hidden: true, name: 'A six-digit id' },
          { input: '1,Christopher,1000\n', expected: `TX-000001  Christopher UGX 1,000`, hidden: true, name: 'A name longer than 8' },
        ],
        hints: [
          'The template is "TX-%06d  %-8s UGX %s\\n".',
          'The id and the amount arrive as text. Give %d a number: (int) $id.',
          'printf("TX-%06d  %-8s UGX %s\\n", (int) $id, $name, number_format((int) $amount));',
        ],
      },
    ],
  },

  // ================================================================== 18
  {
    id: 'php-fees',
    level: LEVEL,
    minutes: 40,
    title: 'Project: Mobile Money fee calculator',
    summary: 'Level 3 together: small typed functions, validation, a tidy statement and a summary',
    blocks: [
      {
        t: 'story',
        title: 'Everybody asks the same question',
        text: "All day customers ask Nambi the same thing: “If I send 120,000, how much will it cost me?” She works it out from the board on the wall, and she is sometimes wrong when the queue is long.\n\nToday you build what her nephew promised: a **fee calculator**. It reads a list of requests such as `send,120000` or `withdraw,50000`, checks each one, works out the fee and the levy, and prints a statement that lines up, with a summary at the end.\n\nThe fee tables here are made up for teaching. Real Mobile Money prices change, so a real product keeps them in one place that is easy to update, which is exactly what functions give you.",
      },
      { t: 'h', text: 'The rules' },
      {
        t: 'list',
        items: [
          'Three kinds of request: `send`, `withdraw`, `pay` (paying a shop).',
          '**Send** fee: up to 5,000 costs 100; up to 30,000 costs 300; up to 100,000 costs 700; up to 500,000 costs 1,500; up to 2,000,000 costs 2,500; more costs 4,000.',
          '**Withdraw** fee: the booth table from before (1,000 / 2,000 / 3,500). **Pay** has no fee.',
          '**Levy** (a made-up tax): 0.5% of the amount on withdrawals only, rounded **up** to a whole shilling. Nothing on send or pay.',
          'The customer pays the amount plus the fee plus the levy.',
        ],
      },
      { t: 'h', text: 'Step 1: the functions, and one request' },
      { t: 'p', text: 'Every rule gets its own small function with typed parameters and a typed result (and `declare(strict_types=1)` on top). The main program is only a few lines because the thinking lives in the functions. The levy uses integer maths, `$amount * 5 / 1000`, then rounds up with `ceil`.' },
      {
        t: 'project',
        title: 'Calculator, step 1: functions and one request',
        stdin: 'withdraw,120000\n',
        code:
          MOMO_LIB +
          php`
$parts = explode(",", trim(fgets(STDIN)));
$type = strtolower(trim($parts[0]));
$amount = (int) $parts[1];
$fee = fee($type, $amount);
$levy = levy($type, $amount);
echo "Fee: UGX ", money($fee), "\n";
echo "Levy: UGX ", money($levy), "\n";
echo "Total: UGX ", money($amount + $fee + $levy), "\n";
`,
        output: out('Fee: UGX 2,000', 'Levy: UGX 600', 'Total: UGX 122,600'),
      },
      { t: 'h', text: 'Step 2: many requests, in a table' },
      { t: 'p', text: 'Now a loop reads every line, and `printf` with widths makes the table line up. For now the input is trusted to be correct.' },
      {
        t: 'project',
        title: 'Calculator, step 2: the statement',
        stdin: lines(VALID_LINES),
        code:
          MOMO_LIB +
          php`
printf("%-9s %10s %7s %6s %11s\n", "Type", "Amount", "Fee", "Levy", "Total");
echo str_repeat("-", 47), "\n";
while (($line = fgets(STDIN)) !== false) {
    [$type, $amount] = explode(",", trim($line));
    $amount = (int) $amount;
    $fee = fee($type, $amount);
    $levy = levy($type, $amount);
    printf("%-9s %10s %7s %6s %11s\n", ucfirst($type), money($amount), money($fee), money($levy), money($amount + $fee + $levy));
}
`,
        output: out(...momoStatement(VALID_LINES, false)),
      },
      { t: 'h', text: 'Step 3: check the input' },
      { t: 'p', text: 'Real input is messy. `parseLine` returns `[type, amount]` or `null`, so the loop can print `Invalid: ...` for a bad line and move on with `continue`. Blank lines are ignored. Notice how the validation rules (a known type, digits only, not zero, exactly two parts) all live in one function.' },
      {
        t: 'project',
        title: 'Calculator, step 3: validation',
        stdin: lines(SAMPLE_LINES),
        code:
          MOMO_LIB +
          php`
printf("%-9s %10s %7s %6s %11s\n", "Type", "Amount", "Fee", "Levy", "Total");
echo str_repeat("-", 47), "\n";
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    $parsed = parseLine($line);
    if ($parsed === null) {
        echo "Invalid: ", $line, "\n";
        continue;
    }
    [$type, $amount] = $parsed;
    $fee = fee($type, $amount);
    $levy = levy($type, $amount);
    printf("%-9s %10s %7s %6s %11s\n", ucfirst($type), money($amount), money($fee), money($levy), money($amount + $fee + $levy));
}
`,
        output: out(...momoStatement(SAMPLE_LINES, false)),
      },
      { t: 'h', text: 'Step 4: the summary' },
      { t: 'p', text: 'Counters before the loop, updated inside it, printed after it: the same pattern as the daily summary of lesson 13.' },
      {
        t: 'project',
        title: 'Calculator, step 4: the finished program',
        stdin: lines(SAMPLE_LINES),
        code:
          MOMO_LIB +
          php`
printf("%-9s %10s %7s %6s %11s\n", "Type", "Amount", "Fee", "Levy", "Total");
echo str_repeat("-", 47), "\n";
$valid = 0;
$invalid = 0;
$fees = 0;
$levies = 0;
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    $parsed = parseLine($line);
    if ($parsed === null) {
        echo "Invalid: ", $line, "\n";
        $invalid++;
        continue;
    }
    [$type, $amount] = $parsed;
    $fee = fee($type, $amount);
    $levy = levy($type, $amount);
    $valid++;
    $fees += $fee;
    $levies += $levy;
    printf("%-9s %10s %7s %6s %11s\n", ucfirst($type), money($amount), money($fee), money($levy), money($amount + $fee + $levy));
}
echo str_repeat("-", 47), "\n";
echo "Valid: ", $valid, ", invalid: ", $invalid, "\n";
echo "Fees collected : UGX ", money($fees), "\n";
echo "Levy collected : UGX ", money($levies), "\n";
`,
        output: out(...momoStatement(SAMPLE_LINES)),
      },
      { t: 'p', text: 'It is yours to change. When Nambi hears that the send fee for 5,001 to 30,000 went up to 350, you now change **one number in one function**. Try other requests below:' },
      {
        t: 'try',
        stdin: lines(['withdraw,12345', 'send,5000', 'send,5001', 'Transfer,500', 'pay,0']),
        code:
          MOMO_LIB +
          php`
printf("%-9s %10s %7s %6s %11s\n", "Type", "Amount", "Fee", "Levy", "Total");
echo str_repeat("-", 47), "\n";
$valid = 0;
$invalid = 0;
$fees = 0;
$levies = 0;
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    $parsed = parseLine($line);
    if ($parsed === null) {
        echo "Invalid: ", $line, "\n";
        $invalid++;
        continue;
    }
    [$type, $amount] = $parsed;
    $fee = fee($type, $amount);
    $levy = levy($type, $amount);
    $valid++;
    $fees += $fee;
    $levies += $levy;
    printf("%-9s %10s %7s %6s %11s\n", ucfirst($type), money($amount), money($fee), money($levy), money($amount + $fee + $levy));
}
echo str_repeat("-", 47), "\n";
echo "Valid: ", $valid, ", invalid: ", $invalid, "\n";
echo "Fees collected : UGX ", money($fees), "\n";
echo "Levy collected : UGX ", money($levies), "\n";
`,
        output: out(...momoStatement(['withdraw,12345', 'send,5000', 'send,5001', 'Transfer,500', 'pay,0'])),
      },
      {
        t: 'predict',
        code: php`<?php
echo match ("pay") {
    "send" => 1,
    default => 0,
}, "\n";
`,
        question: 'What does this program print?',
        options: ['0', '1', 'pay', 'Nothing'],
        answer: 0,
        explain: '"pay" is not "send", so match falls to the default arm, which gives 0. This is how fee() gives pay requests a fee of 0.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the arm that catches every value no other arm matched.',
        template: php`<?php
echo match ("transfer") {
    "send" => "ok",
    ___ => "unknown",
}, "\n";
`,
        blanks: [{ options: ['default', 'else', 'other'], answer: 'default' }],
        output: 'unknown\n',
      },
      {
        t: 'bug',
        code: php`<?php
declare(strict_types=1);
function fee(string $type, int $amount): int {
    return $type === "send" ? 300 : 0;
}
echo fee(5000, "send"), "\n";
`,
        question: 'This program stops with a “TypeError”. What is wrong?',
        options: ['The arguments are in the wrong order: the type comes first, then the amount', 'fee must return a string', 'strict_types cannot be used with match', 'The word send needs a capital'],
        answer: 0,
        explain: 'The function wants a string and then an int. The call gives an int first, and under strict types PHP refuses it and says which argument was wrong. Named arguments (fee(type: "send", amount: 5000)) make this mistake impossible.',
        fixed: php`<?php
declare(strict_types=1);
function fee(string $type, int $amount): int {
    return $type === "send" ? 300 : 0;
}
echo fee("send", 5000), "\n";
`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo match ("transfer") {
    "send" => 1,
    "withdraw" => 2,
};`, why: 'With no default arm and no match, PHP stops with an UnhandledMatchError. Always think about “what if it is none of these?”.', right: php`<?php
echo match ("transfer") {
    "send" => 1,
    "withdraw" => 2,
    default => 0,
};` },
          { wrong: php`<?php
printf("%-9s %10s\n", "Send");`, why: 'Two holes and one value: ArgumentCountError. Count the % signs and the values.', right: php`<?php
printf("%-9s %10s\n", "Send", "120,000");` },
          { wrong: php`<?php
echo (int) (12345 * 0.005);`, why: 'It prints 61. (int) cuts the decimals off, but the levy must be rounded UP, which is 62. Use ceil, and integer maths to avoid tiny decimal errors: ceil(12345 * 5 / 1000).', right: php`<?php
echo (int) ceil(12345 * 5 / 1000);`, logic: true },
          { wrong: php`<?php
declare(strict_types=1);
$parsed = null;
if ($parsed === null) {
    echo "Invalid\n";
}
[$type, $amount] = $parsed;
echo strtoupper($type), "\n";`, why: 'After printing Invalid the program carries on and unpacks null, so $type is null and strtoupper stops with a TypeError. After handling a bad line you must continue (in a loop) or use else.', right: php`<?php
declare(strict_types=1);
$parsed = null;
if ($parsed === null) {
    echo "Invalid\n";
} else {
    [$type, $amount] = $parsed;
    echo strtoupper($type), "\n";
}` },
        ],
      },
      {
        t: 'recap',
        items: [
          'Split the job into small typed functions: one rule, one function (`sendFee`, `levy`, `parseLine`, `money`).',
          'The main program reads, calls the functions, and prints. The thinking lives in the functions, so a changed price is a one-line change.',
          'Validate input in one function that returns `null` for bad input; the loop prints `Invalid` and `continue`s.',
          '`printf` with widths makes a table line up. Always count the holes and the values.',
          'Level 4 gives these functions and the data they work on a shared home: a class.',
        ],
        memory: 'Small typed functions. Validate once. Print a tidy table.',
      },
    ],
    exercises: [
      {
        id: 'php18-send-fee',
        title: 'The send fee',
        prompt: 'Write `sendFee(int $amount): int`: up to 5,000 costs 100; up to 30,000 costs 300; up to 100,000 costs 700; up to 500,000 costs 1,500; up to 2,000,000 costs 2,500; anything more costs 4,000. The program reads an amount and prints `Fee: UGX 700`.',
        starter: php`<?php
declare(strict_types=1);

function sendFee(int $amount): int {
    // return the fee
    return 0;
}

$amount = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '60000\n',
        tests: [
          { input: '60000\n', expected: `Fee: UGX ${money(sendFee(60000))}` },
          ...[5000, 5001, 30000, 30001, 100000, 100001, 500000, 500001, 2000000, 2000001].map((a) => ({
            input: `${a}\n`,
            expected: `Fee: UGX ${money(sendFee(a))}`,
            hidden: true,
            name: `Amount ${money(a)}`,
          })),
        ],
        hints: [
          'Use early returns: if ($amount <= 5000) { return 100; } and so on, smallest limit first.',
          'After the last check, return 4000.',
          'Print "Fee: UGX " and number_format(sendFee($amount)).',
        ],
      },
      {
        id: 'php18-quote',
        title: 'A quote for one request',
        prompt: '`sendFee` and `withdrawFee` are written. You write `fee(string $type, int $amount): int` (use `match`: send, withdraw, and everything else is 0) and `levy(string $type, int $amount): int` (0.5% of a withdrawal rounded up, 0 for the others). The input is one line `type,amount`. Print:\n\n`Fee: UGX 2,000`\n`Levy: UGX 600`\n`Total: UGX 122,600`',
        starter:
          LIB_SEND_WITHDRAW +
          php`// write fee() and levy() here

$parts = explode(",", trim(fgets(STDIN)));
$type = strtolower(trim($parts[0]));
$amount = (int) $parts[1];
`,
        usesInput: true,
        sampleInput: 'withdraw,120000\n',
        tests: [
          { input: 'withdraw,120000\n', expected: out(...quote('withdraw', 120000)) },
          { input: 'send,120000\n', expected: out(...quote('send', 120000)), hidden: true, name: 'Send has no levy' },
          { input: 'pay,5000\n', expected: out(...quote('pay', 5000)), hidden: true, name: 'Pay is free' },
          { input: 'withdraw,12345\n', expected: out(...quote('withdraw', 12345)), hidden: true, name: 'The levy rounds up' },
          { input: 'withdraw,40000\n', expected: out(...quote('withdraw', 40000)), hidden: true, name: 'A small withdrawal' },
        ],
        hints: [
          'fee: return match ($type) { "send" => sendFee($amount), "withdraw" => withdrawFee($amount), default => 0 };',
          'levy: for "withdraw" it is (int) ceil($amount * 5 / 1000), otherwise 0.',
          'Print Fee, Levy and Total (amount + fee + levy), each with number_format.',
        ],
      },
      {
        id: 'php18-statement',
        title: 'The whole statement',
        prompt: 'The whole function library of the lesson is in the starter (including `parseLine`). Read lines until the input ends and print the statement exactly as in the lesson: the header and a line of 47 dashes, one table row per valid request, `Invalid: ` and the line for each invalid one (blank lines are ignored), a second line of 47 dashes, then `Valid: 3, invalid: 1`, `Fees collected : UGX 3,500` and `Levy collected : UGX 600`.\n\nThe row format is `printf("%-9s %10s %7s %6s %11s\\n", ...)` with the type in capitals-first form and every number with commas.',
        starter:
          MOMO_LIB +
          php`
// read the lines, print the table and the summary
`,
        usesInput: true,
        sampleInput: lines(SAMPLE_LINES),
        tests: [
          { input: lines(SAMPLE_LINES), expected: out(...momoStatement(SAMPLE_LINES)) },
          { input: lines(VALID_LINES), expected: out(...momoStatement(VALID_LINES)), hidden: true, name: 'All valid' },
          {
            input: 'send,100\n\ntransfer,500\nsend,0\nsend,12k\nsend,5,6\n  WITHDRAW , 50000 \n',
            expected: out(...momoStatement(['send,100', '', 'transfer,500', 'send,0', 'send,12k', 'send,5,6', '  WITHDRAW , 50000 '])),
            hidden: true,
            name: 'Blank and invalid lines, odd spacing',
          },
          { input: 'withdraw,2000000\n', expected: out(...momoStatement(['withdraw,2000000'])), hidden: true, name: 'One big withdrawal' },
          { input: 'oops\n', expected: out(...momoStatement(['oops'])), hidden: true, name: 'Nothing valid' },
        ],
        hints: [
          'Print the header with printf and a line of 47 dashes with str_repeat before the loop.',
          'In the loop: trim, skip blank lines with continue, call parseLine. If it gives null print "Invalid: " and the line, count it, and continue. Otherwise unpack with [$type, $amount] = $parsed and print the row.',
          'Counters ($valid, $invalid, $fees, $levies) go before the loop. After it print the dashes and the three summary lines with money().',
        ],
      },
    ],
  },
];

// Expected output of php18-quote, built from the data in plain JavaScript.
function quote(type, amount) {
  const f = momoFee(type, amount);
  const l = levy(type, amount);
  return [`Fee: UGX ${money(f)}`, `Levy: UGX ${money(l)}`, `Total: UGX ${money(amount + f + l)}`];
}
