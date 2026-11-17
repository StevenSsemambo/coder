// PHP, Level 3: Functions. Lessons 14 to 16 (functions, types and arguments, scope).
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, txInput, boothFee } from './shared.js';

const LEVEL = 'Level 3: Functions';

const DAY = [
  ['Amina', 'withdraw', 120000],
  ['Brian', 'deposit', 35000],
  ['Grace', 'withdraw', 800000],
  ['Amina', 'deposit', 50000],
  ['Dan', 'deposit', 15000],
];

export const level3 = [
  // ================================================================== 14
  {
    id: 'php-functions',
    level: LEVEL,
    minutes: 28,
    title: 'Functions',
    summary: 'Write a rule once, give it a name, and use it everywhere',
    blocks: [
      {
        t: 'story',
        title: 'The fee rule on three sticky notes',
        text: "In lesson 7 the fee rule was copied three times, once for each customer. Last week Nambi's nephew changed the middle fee from 2,000 to 2,500 in two places and forgot the third. One customer was charged less than the others, and nobody noticed until the evening count did not match.\n\nThe cure is old and simple: write the rule **once**, give it a **name**, and say the name wherever you need it. In PHP that is a **function**. If the rule changes, you change it in one place.",
      },
      {
        t: 'try',
        code: php`<?php
function greet($name) {
    echo "Welcome to Nambi's booth, ", $name, "!\n";
}

greet("Amina");
greet("Brian");
`,
        output: out("Welcome to Nambi's booth, Amina!", "Welcome to Nambi's booth, Brian!"),
      },
      {
        t: 'list',
        items: [
          '`function greet($name) { ... }` **defines** the function. Nothing runs yet.',
          '`$name` is a **parameter**: a variable that gets its value each time the function is called.',
          '`greet("Amina");` **calls** the function. `"Amina"` is the **argument**, the value that goes into `$name`.',
          'Call it as many times as you like, with different arguments.',
        ],
      },
      { t: 'h', text: 'return: handing a value back' },
      { t: 'p', text: '`echo` shows something on the screen and that is the end of it. Most functions should instead **return** a value: they give the answer back to the code that called them, which can then store it, calculate with it or print it.' },
      {
        t: 'try',
        code: php`<?php
function triple($x) {
    return $x * 3;
}

$a = triple(4);
echo $a, " ", triple(10), " ", triple(2) + 1, "\n";
`,
        output: '12 30 7\n',
      },
      { t: 'p', text: 'A call to a function that returns a value can stand anywhere a value could: in a variable, inside `echo`, inside a sum. Here is the fee rule from lesson 7, written once. `return` also **ends the function at once**, so the long if / elseif chain turns into a short list of early exits:' },
      {
        t: 'try',
        code: php`<?php
function fee($service, $amount) {
    if ($service === "deposit") {
        return 0;
    }
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

echo "Withdraw 30,000: fee UGX ", number_format(fee("withdraw", 30000)), "\n";
echo "Withdraw 120,000: fee UGX ", number_format(fee("withdraw", 120000)), "\n";
echo "Withdraw 800,000: fee UGX ", number_format(fee("withdraw", 800000)), "\n";
echo "Deposit 800,000: fee UGX ", number_format(fee("deposit", 800000)), "\n";
`,
        output: out('Withdraw 30,000: fee UGX 1,000', 'Withdraw 120,000: fee UGX 2,000', 'Withdraw 800,000: fee UGX 3,500', 'Deposit 800,000: fee UGX 0'),
      },
      { t: 'h', text: 'Two values back, and functions that use functions' },
      { t: 'p', text: 'A function returns **one** value, but that value can be an array. Unpack it with the brackets from lesson 13:' },
      {
        t: 'try',
        code: php`<?php
function lowHigh($list) {
    return [min($list), max($list)];
}

[$low, $high] = lowHigh([120000, 35000, 800000]);
echo "Low ", number_format($low), ", high ", number_format($high), "\n";
`,
        output: 'Low 35,000, high 800,000\n',
      },
      { t: 'p', text: 'Functions can call other functions. Small functions that each do one job are the secret of programs that stay readable:' },
      {
        t: 'try',
        code: php`<?php
function fee($service, $amount) {
    if ($service === "deposit") {
        return 0;
    }
    return $amount <= 50000 ? 1000 : ($amount <= 200000 ? 2000 : 3500);
}

function receiptLine($label, $amount) {
    return $label . ": UGX " . number_format($amount) . "\n";
}

echo receiptLine("Amount", 120000);
echo receiptLine("Fee", fee("withdraw", 120000));
`,
        output: out('Amount: UGX 120,000', 'Fee: UGX 2,000'),
      },
      { t: 'tip', text: 'Give a function a name that says what it does, usually a verb or a question: `fee`, `receiptLine`, `isBig`. A function that returns `true` or `false` is nicely named with `is` or `has` at the front. Define each name only once in a program.' },
      {
        t: 'predict',
        code: php`<?php
function shout() {
    echo "a";
}
$x = shout();
var_dump($x);
`,
        question: 'shout() has no return. What does the program print?',
        options: ['aNULL', 'a', 'NULL', 'abool(false)'],
        answer: 0,
        explain: 'The call prints “a”. A function without a return gives back null, so $x holds null and var_dump prints NULL. Both come out on the screen: aNULL.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that starts a function definition.',
        template: php`<?php
___ triple($x) {
    return $x * 3;
}
echo triple(5), "\n";
`,
        blanks: [{ options: ['function', 'def', 'fn'], answer: 'function' }],
        output: '15\n',
      },
      {
        t: 'bug',
        code: php`<?php
function fee($amount) {
    return 1000;
}
echo fees(5000), "\n";
`,
        question: 'This program stops with “Call to undefined function”. What is wrong?',
        options: ['The call says fees, but the function is named fee', 'A function cannot return a number', 'echo cannot print a function result', 'The function needs two parameters'],
        answer: 0,
        explain: 'PHP only knows the names you defined. fees and fee are different names, so it cannot find fees. A single letter off is the most common reason for this error.',
        fixed: php`<?php
function fee($amount) {
    return 1000;
}
echo fee(5000), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program defines triple, calls it for 4, and prints the result.',
        lines: ['<?php', 'function triple($x) {', '    return $x * 3;', '}', '$n = 4;', '$result = triple($n);', 'echo $result, "\\n";'],
        output: '12\n',
      },
      {
        t: 'quiz',
        question: 'What is the difference between echo and return inside a function?',
        options: ['echo shows text on the screen; return hands a value back to the code that called the function', 'They are the same thing', 'return shows text, echo hides it', 'echo ends the function, return does not'],
        answer: 0,
        explain: 'echo only prints. return gives the value to whoever called the function, so it can be stored or calculated with, and it ends the function immediately.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
function triple($x) {
    echo $x * 3;
}
$y = triple(4) + 1;
echo $y;`, why: 'No error, but it prints 121. echo shows 12, then triple returns nothing (null), so $y is null + 1 = 1. Use return when the answer is needed by the caller.', right: php`<?php
function triple($x) {
    return $x * 3;
}
$y = triple(4) + 1;
echo $y;`, logic: true },
          { wrong: php`<?php
function fee($amount) {
    return 1000;
}
function fee($amount) {
    return 2000;
}
echo fee(5);`, why: 'A name can be defined only once. PHP stops with “Cannot redeclare fee()”. This is also how the three-copies problem shows itself: two definitions, which one is right?', right: php`<?php
function fee($amount) {
    return 2000;
}
echo fee(5);` },
          { wrong: php`<?php
function fee($service, $amount) {
    return 1000;
}
echo fee("withdraw");`, why: 'The function wants two arguments and was given one. PHP 8 stops with an ArgumentCountError.', right: php`<?php
function fee($service, $amount) {
    return 1000;
}
echo fee("withdraw", 5000);` },
          { wrong: php`<?php
function makeFee() {
    $fee = 1000;
}
makeFee();
echo $fee;`, why: 'No fatal error, but a warning “Undefined variable $fee”. A variable made inside a function belongs to that function and disappears when it ends. Return it instead (lesson 16 explains why).', right: php`<?php
function makeFee() {
    return 1000;
}
$fee = makeFee();
echo $fee;`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`function name($a, $b) { ... }` defines. `name(1, 2)` calls. Define once, call many times.',
          '`return value;` hands the answer back and ends the function. No return means null.',
          '`echo` only prints; `return` gives the caller a value it can use.',
          'Return an array to give back several values, and unpack it with `[$a, $b] = ...`.',
          'One rule, one function: when the rule changes, you change one place.',
        ],
        memory: 'Define once. Call often. return gives the value back.',
      },
    ],
    exercises: [
      {
        id: 'php14-fee',
        title: 'The fee function',
        prompt: 'Finish the function `fee($service, $amount)` so it returns the booth fee (deposits free; withdrawals up to 50,000 cost 1,000, up to 200,000 cost 2,000, above that 3,500). The program reads the service and the amount and prints, for example, `Fee: UGX 2,000`.',
        starter: php`<?php
function fee($service, $amount) {
    // return the fee
}

$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: 'withdraw\n120000\n',
        tests: [
          { input: 'withdraw\n120000\n', expected: `Fee: UGX ${money(boothFee('withdraw', 120000))}` },
          { input: 'deposit\n500000\n', expected: 'Fee: UGX 0', hidden: true, name: 'Deposits are free' },
          { input: 'withdraw\n50000\n', expected: 'Fee: UGX 1,000', hidden: true, name: 'Exactly 50,000' },
          { input: 'withdraw\n50001\n', expected: 'Fee: UGX 2,000', hidden: true, name: 'Just over 50,000' },
          { input: 'withdraw\n200001\n', expected: 'Fee: UGX 3,500', hidden: true, name: 'Over 200,000' },
        ],
        hints: [
          'Inside the function, return as soon as you know the answer. The first check is whether the service is "deposit".',
          'Then check $amount <= 50000, then $amount <= 200000. After those, the fee is 3500.',
          'Outside the function, print "Fee: UGX " and number_format(fee($service, $amount)).',
        ],
      },
      {
        id: 'php14-statement',
        title: 'The statement',
        prompt: 'The function `fee` is already written. Write a function `total($service, $amount)` that returns the amount plus its fee. The first input line is N, then N transactions as `name,service,amount`. Print one line per transaction and a last line with the fees earned:\n\n`Amina: UGX 120,000 + fee UGX 2,000 = UGX 122,000`\n`Fees earned: UGX 5,500`',
        starter: php`<?php
function fee($service, $amount) {
    if ($service === "deposit") {
        return 0;
    }
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

// write total() here

$n = (int) trim(fgets(STDIN));
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
}
`,
        usesInput: true,
        sampleInput: txInput(DAY),
        tests: [
          {
            input: txInput(DAY),
            expected: out(
              ...DAY.map(([n, s, a]) => `${n}: UGX ${money(a)} + fee UGX ${money(boothFee(s, a))} = UGX ${money(a + boothFee(s, a))}`),
              `Fees earned: UGX ${money(DAY.reduce((t, [, s, a]) => t + boothFee(s, a), 0))}`
            ),
          },
          { input: txInput([['Eve', 'deposit', 10000]]), expected: out('Eve: UGX 10,000 + fee UGX 0 = UGX 10,000', 'Fees earned: UGX 0'), hidden: true, name: 'One deposit' },
          {
            input: txInput([['Zed', 'withdraw', 50000], ['Amy', 'withdraw', 250000]]),
            expected: out('Zed: UGX 50,000 + fee UGX 1,000 = UGX 51,000', 'Amy: UGX 250,000 + fee UGX 3,500 = UGX 253,500', 'Fees earned: UGX 4,500'),
            hidden: true,
            name: 'Two withdrawals',
          },
        ],
        hints: [
          'total can call fee: return $amount + fee($service, $amount);',
          'The starter reads each line into $name, $service and $amount. Inside the loop print the line, and add the fee to a running total you keep before the loop.',
          'The amount from explode is text. Turn it into a number with (int) before you use it.',
        ],
      },
      {
        id: 'php14-lowhigh',
        title: 'Low, high and the gap',
        prompt: 'Write the function `lowHigh($list)` that returns `[lowest, highest]`. The input is ONE line of amounts separated by commas. Print:\n\n`Low: UGX 35,000`\n`High: UGX 800,000`\n`Gap: UGX 765,000`',
        starter: php`<?php
function lowHigh($list) {
    // return [lowest, highest]
}

$amounts = [];
foreach (explode(",", trim(fgets(STDIN))) as $part) {
    $amounts[] = (int) $part;
}
`,
        usesInput: true,
        sampleInput: '120000,35000,800000,50000\n',
        tests: [
          { input: '120000,35000,800000,50000\n', expected: out('Low: UGX 35,000', 'High: UGX 800,000', 'Gap: UGX 765,000') },
          { input: '5000\n', expected: out('Low: UGX 5,000', 'High: UGX 5,000', 'Gap: UGX 0'), hidden: true, name: 'One amount' },
          { input: '10,20,15\n', expected: out('Low: UGX 10', 'High: UGX 20', 'Gap: UGX 10'), hidden: true, name: 'Small numbers' },
        ],
        hints: [
          'The function can be one line: return [min($list), max($list)];',
          'Unpack the answer: [$low, $high] = lowHigh($amounts);',
          'The gap is $high - $low. Use number_format on all three.',
        ],
      },
      {
        id: 'php14-discount',
        title: 'The loyalty discount',
        prompt: 'Write the function `discount($amount, $percent)` that returns the amount after taking off the percentage, **rounded down** to a whole shilling. The input has two lines: the amount and the percentage. Print `Pay: UGX 85,000`.\n\nUse whole-number maths so nothing is rounded the wrong way: amount × (100 − percent) ÷ 100.',
        starter: php`<?php
function discount($amount, $percent) {
    // return the amount to pay
}

$amount = (int) trim(fgets(STDIN));
$percent = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '100000\n15\n',
        tests: [
          { input: '100000\n15\n', expected: 'Pay: UGX 85,000' },
          { input: '12345\n10\n', expected: `Pay: UGX ${money(Math.floor((12345 * 90) / 100))}`, hidden: true, name: 'Rounded down' },
          { input: '50000\n0\n', expected: 'Pay: UGX 50,000', hidden: true, name: 'No discount' },
          { input: '80000\n100\n', expected: 'Pay: UGX 0', hidden: true, name: 'Everything off' },
        ],
        hints: [
          'amount × (100 − percent) gives a number that is 100 times too big.',
          'intdiv($amount * (100 - $percent), 100) divides and throws away the fraction.',
          'return that from the function, then print "Pay: UGX " and number_format of the call.',
        ],
      },
    ],
  },

  // ================================================================== 15
  {
    id: 'php-types',
    level: LEVEL,
    minutes: 30,
    title: 'Types and arguments',
    summary: 'Say what a function accepts and returns, defaults, named arguments, and strict types',
    blocks: [
      {
        t: 'story',
        title: 'The customer who typed words',
        text: "Brian is at the booth. The nephew's program asks for the amount and Brian, trying to be helpful, types “twenty thousand”. The program happily calculates a fee for… nothing, prints a receipt for UGX 0, and Brian walks away confused.\n\nA function can protect itself. If you say “this parameter must be a whole number”, PHP refuses anything else with a clear message, at the moment of the mistake, not three screens later. Writing down what goes in and what comes out is called using **types**.",
      },
      { t: 'p', text: 'Put the type before the parameter, and the return type after the brackets, with a colon:' },
      {
        t: 'try',
        code: php`<?php
function addFee(int $amount, int $fee): int {
    return $amount + $fee;
}

echo addFee(120000, 2000), "\n";
`,
        output: '122000\n',
      },
      {
        t: 'list',
        items: [
          'The types you will use most: `int`, `float`, `string`, `bool`, `array`.',
          '`void` as a return type means “returns nothing”.',
          '`?int` means “an int **or** null”. The question mark makes a type optional.',
          'Types are a promise you can read at a glance, and PHP checks the promise for you.',
        ],
      },
      { t: 'p', text: 'By default PHP is **friendly**: if you give it text that looks like a number where a number is needed, it converts it quietly:' },
      {
        t: 'try',
        code: php`<?php
function addFee(int $amount, int $fee): int {
    return $amount + $fee;
}

echo addFee("120000", 2000), "\n";
`,
        output: '122000\n',
      },
      { t: 'p', text: 'And it only refuses when the text cannot be a number at all (“abc” would stop the program with a TypeError). If you would rather PHP be **strict**, so that the text "120000" is refused too, put this as the very first line after `<?php`:' },
      {
        t: 'try',
        code: php`<?php
declare(strict_types=1);

function addFee(int $amount, int $fee): int {
    return $amount + $fee;
}

echo addFee(120000, 2000), "\n";
echo addFee((int) "120000", 2000), "\n";
`,
        output: out('122000', '122000'),
      },
      { t: 'tip', text: 'Everything that arrives with `fgets` is text. Under `strict_types=1`, that text must be turned into a number with `(int)` before it goes to an `int` parameter. Strict types catch more mistakes early, so serious projects start every file with that line.' },
      { t: 'h', text: 'Default values' },
      { t: 'p', text: 'Give a parameter a value with `=` and callers may leave it out. Put parameters with defaults **last**.' },
      {
        t: 'try',
        code: php`<?php
function fee(int $amount, string $service = "withdraw"): int {
    if ($service === "deposit") {
        return 0;
    }
    return $amount <= 50000 ? 1000 : ($amount <= 200000 ? 2000 : 3500);
}

echo fee(120000), " ", fee(120000, "deposit"), "\n";
`,
        output: '2000 0\n',
      },
      { t: 'h', text: 'Named arguments' },
      { t: 'p', text: 'You can write the parameter name in the call. Then the order does not matter, and you can skip the ones you do not need to change. It also makes a call readable: `commas: false` says more than a lonely `false`.' },
      {
        t: 'try',
        code: php`<?php
function money(int $amount, string $currency = "UGX", bool $commas = true): string {
    $shown = $commas ? number_format($amount) : (string) $amount;
    return $currency . " " . $shown;
}

echo money(1500000), "\n";
echo money(1500000, commas: false), "\n";
echo money(currency: "KES", amount: 2500), "\n";
`,
        output: out('UGX 1,500,000', 'UGX 1500000', 'KES 2,500'),
      },
      { t: 'h', text: 'A function that may say “no answer”' },
      { t: 'p', text: 'When the input might be bad, let the function return `null` and say so with `?int`. The caller must then check. This is the first step of validating input, which Level 5 builds on:' },
      {
        t: 'try',
        code: php`<?php
function parseAmount(string $text): ?int {
    $t = trim($text);
    if (!ctype_digit($t)) {
        return null;
    }
    return (int) $t;
}

var_dump(parseAmount("120000"));
var_dump(parseAmount("twenty thousand"));
`,
        output: out('int(120000)', 'NULL'),
      },
      { t: 'p', text: '`ctype_digit` is true only when the text is made of digits and nothing else (and not empty).' },
      {
        t: 'predict',
        code: php`<?php
function double_it(int $x): int {
    return $x * 2;
}
echo double_it("21");
`,
        question: 'There is no strict_types line. What happens?',
        options: ['42', 'TypeError', '21', '2121'],
        answer: 0,
        explain: 'In the default (friendly) mode PHP converts the text "21" to the number 21 because it looks exactly like a whole number, and the function returns 42. With declare(strict_types=1) the same call would be a TypeError.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the return type of a function that gives back text.',
        template: php`<?php
function label(int $n): ___ {
    return "No. " . $n;
}
echo label(7), "\n";
`,
        blanks: [{ options: ['string', 'int', 'void'], answer: 'string' }],
        output: 'No. 7\n',
      },
      {
        t: 'bug',
        code: php`<?php
function addFee(int $amount, int $fee): int {
    return $amount + $fee;
}
echo addFee("abc", 5), "\n";
`,
        question: 'This program stops with a “TypeError”. What is wrong?',
        options: ['"abc" is not a whole number, and the parameter is declared int', 'addFee has too many parameters', 'The return type must be string', 'echo cannot print an int'],
        answer: 0,
        explain: 'The parameter promises an int. "abc" cannot be converted to one, so PHP refuses it and names the function and the argument. That is the type doing its job.',
        fixed: php`<?php
function addFee(int $amount, int $fee): int {
    return $amount + $fee;
}
echo addFee(500, 5), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: strict types first, then the function, then the call.',
        lines: ['<?php', 'declare(strict_types=1);', 'function half(int $n): int {', '    return intdiv($n, 2);', '}', '$n = 9;', 'echo half($n), "\\n";'],
        output: '4\n',
      },
      {
        t: 'quiz',
        question: 'With declare(strict_types=1), what does a call with the text "5" do when the parameter is int?',
        options: ['It stops with a TypeError', 'It converts the text to 5', 'It uses 0', 'It skips the function'],
        answer: 0,
        explain: 'Strict mode refuses any value of the wrong type, even text that looks like a number. Convert on purpose with (int).',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo "start\n";
declare(strict_types=1);`, why: 'declare(strict_types=1) must be the very first statement of the file, before any echo. PHP stops with a fatal error.', right: php`<?php
declare(strict_types=1);
echo "start\n";` },
          { wrong: php`<?php
declare(strict_types=1);
function triple(int $x): int {
    return $x * 3;
}
echo triple("4");`, why: 'Strict types refuse the text "4" for an int. Text that comes from input must be converted with (int) first.', right: php`<?php
declare(strict_types=1);
function triple(int $x): int {
    return $x * 3;
}
echo triple((int) "4");` },
          { wrong: php`<?php
function f(int $x): int {
    return "abc";
}
echo f(1);`, why: 'The function promises to return an int, but returns text that is not a number. PHP stops with a TypeError about the return value.', right: php`<?php
function f(int $x): int {
    return $x + 1;
}
echo f(1);` },
          { wrong: php`<?php
function money(int $amount, string $currency = "UGX") {
    return $currency . " " . $amount;
}
echo money(amount: 5, curency: "KES");`, why: 'A named argument must match a parameter name exactly. “curency” has a letter missing, so PHP stops with “Unknown named parameter”.', right: php`<?php
function money(int $amount, string $currency = "UGX") {
    return $currency . " " . $amount;
}
echo money(amount: 5, currency: "KES");` },
        ],
      },
      {
        t: 'recap',
        items: [
          '`function f(int $a, string $b = "x"): int` declares parameter types, a default, and the return type. `void` means nothing returned; `?int` means int or null.',
          'By default PHP converts text like "5" to 5. `declare(strict_types=1);` as the first line turns that off, so you must convert with `(int)`.',
          'Parameters with defaults go last. Named arguments (`commas: false`) let you skip defaults and read well.',
          'A function that can fail to produce an answer returns `?type`, and the caller checks for `null`.',
        ],
        memory: 'Types are promises. strict_types goes first. Defaults go last.',
      },
    ],
    exercises: [
      {
        id: 'php15-parse-amount',
        title: 'Good amount or not?',
        prompt: 'Write `parseAmount(string $text): ?int`: it returns the whole number if the text is only digits (after trimming), and `null` otherwise. Then read lines until the input ends. For a good amount print `UGX 120,000`; for a bad one print `Invalid: ` followed by the text.',
        starter: php`<?php
declare(strict_types=1);

function parseAmount(string $text): ?int {
    // return the number, or null
    return null;
}

while (($line = fgets(STDIN)) !== false) {
    $text = trim($line);
}
`,
        usesInput: true,
        sampleInput: '120000\n12k\n-5\n5000\n',
        tests: [
          { input: '120000\n12k\n-5\n5000\n', expected: out('UGX 120,000', 'Invalid: 12k', 'Invalid: -5', 'UGX 5,000') },
          { input: '25\n', expected: 'UGX 25', hidden: true, name: 'One good amount' },
          { input: 'abc\n12.5\n007\n', expected: out('Invalid: abc', 'Invalid: 12.5', 'UGX 7'), hidden: true, name: 'Decimals are not whole' },
        ],
        hints: [
          'ctype_digit($t) is true when the text has only digits and is not empty.',
          'If it is not all digits, return null. Otherwise return (int) $t.',
          'In the loop: $amount = parseAmount($text); check for null with ===, then print the right line.',
        ],
      },
      {
        id: 'php15-money-format',
        title: 'Money, three ways',
        prompt: 'Write `money(int $amount, string $currency = "UGX", bool $commas = true): string`. It returns the currency, a space and the amount (with commas, unless `$commas` is false). Read an amount and print three lines, calling it with named arguments where useful:\n\n`UGX 1,500,000`\n`UGX 1500000`\n`KES 1,500,000`',
        starter: php`<?php
function money(int $amount, string $currency = "UGX", bool $commas = true): string {
    // build the text
    return "";
}

$amount = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '1500000\n',
        tests: [
          { input: '1500000\n', expected: out('UGX 1,500,000', 'UGX 1500000', 'KES 1,500,000') },
          { input: '999\n', expected: out('UGX 999', 'UGX 999', 'KES 999'), hidden: true, name: 'Small amount' },
          { input: '1000\n', expected: out('UGX 1,000', 'UGX 1000', 'KES 1,000'), hidden: true, name: 'Exactly one thousand' },
        ],
        hints: [
          'Inside the function: $commas ? number_format($amount) : (string) $amount.',
          'Return $currency . " " . the shown amount.',
          'Calls: money($amount), money($amount, commas: false), money($amount, currency: "KES").',
        ],
      },
      {
        id: 'php15-clamp',
        title: 'Keep it in range',
        prompt: 'Write `clamp(int $value, int $min = 0, int $max = 100): int` that returns the value, but not below `$min` and not above `$max`. Read a value and print three lines: `clamp($v)`, then with a maximum of 50 (using the named argument `max:`), then with a minimum of 10 and a maximum of 20.',
        starter: php`<?php
function clamp(int $value, int $min = 0, int $max = 100): int {
    // keep the value between min and max
    return $value;
}

$v = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '150\n',
        tests: [
          { input: '150\n', expected: out('100', '50', '20') },
          { input: '-5\n', expected: out('0', '0', '10'), hidden: true, name: 'Below the minimum' },
          { input: '30\n', expected: out('30', '30', '20'), hidden: true, name: 'Inside the range' },
          { input: '15\n', expected: out('15', '15', '15'), hidden: true, name: 'Inside every range' },
        ],
        hints: [
          'max($min, $value) lifts a too-small value; min($max, ...) cuts a too-big one.',
          'return min($max, max($min, $value));',
          'Calls: clamp($v), clamp($v, max: 50), clamp($v, 10, 20). Print each with a new line.',
        ],
      },
      {
        id: 'php15-strict-fee',
        title: 'Strict fee',
        prompt: 'The file uses `declare(strict_types=1)` and the typed function `fee(string $service, int $amount): int` is written. The program must read the service and the amount and print `Fee: UGX 2,000`. Careful: the text from `fgets` has to be converted before it goes to an `int` parameter.',
        starter: php`<?php
declare(strict_types=1);

function fee(string $service, int $amount): int {
    if ($service === "deposit") {
        return 0;
    }
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

$service = strtolower(trim(fgets(STDIN)));
$amountText = trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: 'withdraw\n120000\n',
        tests: [
          { input: 'withdraw\n120000\n', expected: 'Fee: UGX 2,000' },
          { input: 'DEPOSIT\n999999\n', expected: 'Fee: UGX 0', hidden: true, name: 'Capitals and a deposit' },
          { input: 'withdraw\n300000\n', expected: 'Fee: UGX 3,500', hidden: true, name: 'A big withdrawal' },
        ],
        hints: [
          '$amountText is a string. In strict mode a string cannot go into an int parameter.',
          'Convert it on purpose: $amount = (int) $amountText;',
          'Print "Fee: UGX " and number_format(fee($service, $amount)).',
        ],
      },
    ],
  },

  // ================================================================== 16
  {
    id: 'php-scope',
    level: LEVEL,
    minutes: 28,
    title: 'Scope, static and references',
    summary: 'Who can see which variable, how a function remembers, and how it changes the caller’s variable',
    blocks: [
      {
        t: 'story',
        title: "Nambi's two drawers",
        text: "Nambi keeps two drawers: the booth's cash drawer, and a small tin under the counter that is hers alone. When she sends her nephew to fetch change, he may only open the cash drawer she hands him. He cannot see what is in her tin, and what he writes on his own notepad stays on his notepad.\n\nPHP works the same way. Inside a function you have a **private notepad**: your own variables. You cannot see the variables of the main program, and the main program cannot see yours. This is not a nuisance. It is what lets a hundred functions each use a variable called `$total` without ever disturbing each other.",
      },
      {
        t: 'try',
        code: php`<?php
$fee = 1000;

function showFee() {
    echo "Inside: ", isset($fee) ? "I can see it" : "I cannot see it", "\n";
}

showFee();
echo "Outside: ", $fee, "\n";
`,
        output: out('Inside: I cannot see it', 'Outside: 1000'),
      },
      { t: 'p', text: 'The way in is a **parameter**, the way out is `return`. Everything a function needs arrives as an argument, and everything it produces leaves as its return value:' },
      {
        t: 'try',
        code: php`<?php
function addFee(int $amount, int $fee): int {
    return $amount + $fee;
}

$fee = 2000;
echo addFee(120000, $fee), "\n";
`,
        output: '122000\n',
      },
      { t: 'tip', text: 'PHP has a `global` keyword that lets a function reach into the main program. Avoid it. A function that only uses its parameters can be understood, tested and reused on its own; one that reaches outside cannot.' },
      { t: 'h', text: 'static: a function that remembers' },
      { t: 'p', text: 'Normally a function starts fresh on every call and forgets everything when it ends. A variable marked `static` is created once and **keeps its value between calls**. Perfect for a ticket counter:' },
      {
        t: 'try',
        code: php`<?php
function nextTicket() {
    static $last = 0;
    $last++;
    return $last;
}

echo nextTicket(), nextTicket(), nextTicket(), "\n";
`,
        output: '123\n',
      },
      { t: 'h', text: 'References: changing the caller’s variable' },
      { t: 'p', text: 'Arguments are normally **copies**: the function gets its own copy of the value, and changing it does not touch the caller’s variable. Put `&` before a parameter and the function gets the **variable itself** instead:' },
      {
        t: 'try',
        code: php`<?php
function addToTotal(int $amount, int &$total): void {
    $total += $amount;
}

$day = 0;
addToTotal(120000, $day);
addToTotal(35000, $day);
echo $day, "\n";
`,
        output: '155000\n',
      },
      { t: 'p', text: 'It also works for arrays, which are copied by default:' },
      {
        t: 'try',
        code: php`<?php
function addCopy(array $list) {
    $list[] = "Brian";
}
function addRef(array &$list) {
    $list[] = "Grace";
}

$customers = ["Amina"];
addCopy($customers);
echo count($customers), "\n";
addRef($customers);
echo count($customers), "\n";
`,
        output: out('1', '2'),
      },
      { t: 'tip', text: 'References are a sharp tool: a call that quietly changes your variable is easy to miss. Prefer to return the new value (`$customers = withCustomer($customers, "Grace");`) and keep `&` for the few cases where it is clearly the better way.' },
      { t: 'h', text: 'Anonymous functions that share a variable' },
      { t: 'p', text: 'In lesson 12 an arrow function could not change `$total`. A function written with the word `function` and no name can use `use` to bring in outside variables, and `use (&$total)` shares the variable itself:' },
      {
        t: 'try',
        code: php`<?php
$total = 0;
$add = function (int $amount) use (&$total): void {
    $total += $amount;
};
$add(100);
$add(250);
echo $total, "\n";
`,
        output: '350\n',
      },
      {
        t: 'predict',
        code: php`<?php
function counter() {
    static $n = 0;
    $n += 10;
    return $n;
}
counter();
counter();
echo counter();
`,
        question: 'What does this program print?',
        options: ['30', '10', '20', '0'],
        answer: 0,
        explain: 'The static variable keeps its value between calls: 10 after the first call, 20 after the second, 30 after the third. The echo prints the result of the third call.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that makes a variable keep its value between calls.',
        template: php`<?php
function visit() {
    ___ $count = 0;
    $count++;
    echo $count, "\n";
}
visit();
visit();
visit();
`,
        blanks: [{ options: ['static', 'global', 'const'], answer: 'static' }],
        output: out('1', '2', '3'),
      },
      {
        t: 'bug',
        code: php`<?php
function addTo(int $amount, int &$total): void {
    $total += $amount;
}
addTo(100, 0);
`,
        question: 'This program stops with an error about “passed by reference”. What is wrong?',
        options: ['A by-reference parameter needs a variable, not the plain number 0', 'void functions cannot change anything', 'The & must be on the amount', 'The function must return the total'],
        answer: 0,
        explain: 'A reference points at a variable. The number 0 is just a value with no place to live, so there is nothing to change. Pass a variable instead.',
        fixed: php`<?php
function addTo(int $amount, int &$total): void {
    $total += $amount;
}
$t = 0;
addTo(100, $t);
echo $t, "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the ticket function remembers its last number and the program prints 1 and then 2.',
        lines: ['<?php', 'function nextTicket() {', '    static $last = 0;', '    $last++;', '    return $last;', '}', 'echo nextTicket(), nextTicket(), "\\n";'],
        output: '12\n',
      },
      {
        t: 'quiz',
        question: 'A variable is created inside a function without static. What happens to it when the function ends?',
        options: ['It disappears; the next call starts fresh', 'It stays and the main program can read it', 'It stays and the next call can read it', 'It becomes a constant'],
        answer: 0,
        explain: 'Local variables live only while the function runs. To keep a value, return it, store it in a static variable, or hand the function a reference.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$rate = 2;
function twice($x) {
    return $x * $rate;
}
echo twice(5);`, why: 'No fatal error, but a warning “Undefined variable $rate”, and the answer is 0. The function cannot see $rate. Pass it as a parameter.', right: php`<?php
function twice($x, $rate) {
    return $x * $rate;
}
echo twice(5, 2);`, logic: true },
          { wrong: php`<?php
function nextTicket() {
    $last = 0;
    $last++;
    return $last;
}
echo nextTicket(), nextTicket(), nextTicket();`, why: 'No error, but it prints 111. Without static, $last starts at 0 on every call, so every ticket is number 1.', right: php`<?php
function nextTicket() {
    static $last = 0;
    $last++;
    return $last;
}
echo nextTicket(), nextTicket(), nextTicket();`, logic: true },
          { wrong: php`<?php
function addTo(int $amount, int $total): void {
    $total += $amount;
}
$day = 0;
addTo(5, $day);
echo $day;`, why: 'No error, but it prints 0. The function worked on a copy of $day. Add & before $total in the parameter list, or return the new total.', right: php`<?php
function addTo(int $amount, int $total): int {
    return $total + $amount;
}
$day = 0;
$day = addTo(5, $day);
echo $day;`, logic: true },
          { wrong: php`<?php
$total = 0;
$add = function (int $amount) use ($total): void {
    $total += $amount;
};
$add(5);
echo $total;`, why: 'No error, but it prints 0. use ($total) hands the function a copy. Write use (&$total) to share the variable.', right: php`<?php
$total = 0;
$add = function (int $amount) use (&$total): void {
    $total += $amount;
};
$add(5);
echo $total;`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'Variables inside a function are private. In through parameters, out through `return`.',
          '`static $n = 0;` keeps a value between calls (counters, caches).',
          '`&$param` gives the function the caller’s own variable, so it can change it. Without `&` the function gets a copy.',
          '`function () use ($x)` copies an outside variable; `use (&$x)` shares it.',
          'Prefer parameters and `return` over references and `global`. They are easier to read and to test.',
        ],
        memory: 'Private notepad. static remembers. & shares the variable.',
      },
    ],
    exercises: [
      {
        id: 'php16-tickets',
        title: 'Tickets by service',
        prompt: 'Write `nextTicket(string $service): string` so every service has its own numbering, using a `static` array. The input is a list of services, one per line (`deposit` or `withdraw`). For each customer print their ticket: the first letter of the service in capitals, a dash, and the number so far for **that service**.\n\n`D-1`\n`W-1`\n`D-2`',
        starter: php`<?php
function nextTicket(string $service): string {
    // keep a count for each service
    return "";
}

while (($line = fgets(STDIN)) !== false) {
    $service = strtolower(trim($line));
}
`,
        usesInput: true,
        sampleInput: 'deposit\nwithdraw\ndeposit\n',
        tests: [
          { input: 'deposit\nwithdraw\ndeposit\n', expected: out('D-1', 'W-1', 'D-2') },
          { input: 'withdraw\nwithdraw\nwithdraw\n', expected: out('W-1', 'W-2', 'W-3'), hidden: true, name: 'One service only' },
          { input: 'deposit\nwithdraw\nwithdraw\ndeposit\nwithdraw\n', expected: out('D-1', 'W-1', 'W-2', 'D-2', 'W-3'), hidden: true, name: 'Mixed' },
        ],
        hints: [
          'static $counts = []; keeps the array between calls.',
          '$counts[$service] = ($counts[$service] ?? 0) + 1; then return strtoupper($service[0]) . "-" . $counts[$service];',
          'In the loop, print nextTicket($service) followed by a new line.',
        ],
      },
      {
        id: 'php16-add-total',
        title: 'Total and count in one call',
        prompt: 'Write `addTo(int $amount, int &$total, int &$count): void`, which adds the amount to the total and 1 to the count (both variables belong to the caller). The input is a list of amounts, one per line. Print:\n\n`Count: 3`\n`Total: UGX 205,000`',
        starter: php`<?php
function addTo(int $amount, int &$total, int &$count): void {
    // update the caller's variables
}

$total = 0;
$count = 0;
while (($line = fgets(STDIN)) !== false) {
    $amount = (int) trim($line);
}
`,
        usesInput: true,
        sampleInput: '120000\n35000\n50000\n',
        tests: [
          { input: '120000\n35000\n50000\n', expected: out('Count: 3', 'Total: UGX 205,000') },
          { input: '5000\n', expected: out('Count: 1', 'Total: UGX 5,000'), hidden: true, name: 'One amount' },
          { input: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', expected: out('Count: 10', 'Total: UGX 55'), hidden: true, name: 'Ten small amounts' },
        ],
        hints: [
          'Inside the function, change the parameters directly: $total += $amount; and $count++;',
          'Because of the & the changes land in the variables you passed.',
          'In the loop call addTo($amount, $total, $count). After the loop print both lines.',
        ],
      },
      {
        id: 'php16-swap',
        title: 'Swap two values',
        prompt: 'Write `swap(&$a, &$b)` that exchanges the two variables it is given. The input has two lines, the first and the second value (whole numbers). Print their values before and after the swap:\n\n`Before: 5 and 9`\n`After: 9 and 5`',
        starter: php`<?php
function swap(&$a, &$b) {
    // exchange the two values
}

$x = (int) trim(fgets(STDIN));
$y = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '5\n9\n',
        tests: [
          { input: '5\n9\n', expected: out('Before: 5 and 9', 'After: 9 and 5') },
          { input: '7\n7\n', expected: out('Before: 7 and 7', 'After: 7 and 7'), hidden: true, name: 'Equal values' },
          { input: '-3\n100\n', expected: out('Before: -3 and 100', 'After: 100 and -3'), hidden: true, name: 'A negative number' },
        ],
        hints: [
          'To swap you need a third variable to hold one value for a moment: $temp = $a;',
          'Then $a = $b; and $b = $temp;',
          'Print the Before line, call swap($x, $y), then print the After line.',
        ],
      },
      {
        id: 'php16-total-fees',
        title: 'A pure function',
        prompt: 'Write the function `totalFees(array $txs): int` that adds up the booth fee of every transaction in the list it is given. It must **not** use any variable from outside; everything arrives as the parameter. A transaction is `["service" => ..., "amount" => ...]`. The first input line is N, then N lines `name,service,amount`. Print `Fees earned: UGX 5,500`.',
        starter: php`<?php
function totalFees(array $txs): int {
    // add up the fee of every transaction
    return 0;
}

$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["service" => $service, "amount" => (int) $amount];
}
`,
        usesInput: true,
        sampleInput: txInput(DAY),
        tests: [
          { input: txInput(DAY), expected: `Fees earned: UGX ${money(DAY.reduce((t, [, s, a]) => t + boothFee(s, a), 0))}` },
          { input: txInput([['Eve', 'deposit', 10000]]), expected: 'Fees earned: UGX 0', hidden: true, name: 'Only a deposit' },
          { input: txInput([['A', 'withdraw', 50000], ['B', 'withdraw', 50001], ['C', 'withdraw', 200001]]), expected: 'Fees earned: UGX 6,500', hidden: true, name: 'Every band' },
        ],
        hints: [
          'Inside totalFees, make a $sum = 0 and foreach over $txs.',
          'Work out each fee from $tx["service"] and $tx["amount"] and add it to $sum. Then return $sum.',
          'Outside, print "Fees earned: UGX " and number_format(totalFees($txs)).',
        ],
      },
    ],
  },
];
