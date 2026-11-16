// PHP, Level 1: First scripts. Lessons 4 to 7 (numbers, decisions, logic and match, the receipt project).
// Prose uses double-quoted strings. PHP code uses the php`...` tag (String.raw), see shared.js.
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, boothFee, receipt, receiptHeader, receiptInput } from './shared.js';

const LEVEL = 'Level 1: First scripts';

// What the receipt looks like line by line (so each project step can be checked against the right part).
const R = receipt('amina', 'withdraw', 120000).split('\n');
const part = (from, to) => R.slice(from, to).join('\n') + '\n';

export const level1b = [
  // ================================================================== 4
  {
    id: 'php-numbers',
    level: LEVEL,
    minutes: 24,
    title: 'Numbers and operators',
    summary: 'Arithmetic, whole-number division, rounding and number_format for shillings',
    blocks: [
      {
        t: 'story',
        title: 'Change, shares and fees',
        text: "A customer buys airtime for 13,500 and pays with a 20,000 note. What is the change? Three friends deposit together and need to split 100,000 fairly: what does each get, and how many shillings are left over? The booth charges a fee of 2% on every transaction, but never less than 500 shillings.\n\nEvery one of these questions is arithmetic, and a computer is very good at arithmetic. It never forgets to carry the one, and it never gets tired on a Friday afternoon.",
      },
      { t: 'p', text: 'PHP has two kinds of numbers: **int** (whole numbers like `50000`) and **float** (numbers with a decimal point like `2.5`). The usual operators work on both:' },
      {
        t: 'try',
        code: php`<?php
$deposit = 50000;
$fee = 1000;
echo $deposit + $fee, "\n";
echo $deposit - $fee, "\n";
echo $deposit * 2, "\n";
echo $deposit / 4, "\n";
echo $deposit % 30000, "\n";
echo 2 ** 10, "\n";
`,
        output: out('51000', '49000', '100000', '12500', '20000', '1024'),
      },
      {
        t: 'list',
        items: [
          '`+` add, `-` subtract, `*` multiply, `/` divide.',
          '`%` is the **remainder** after dividing: `50000 % 30000` is 20000. People call it “modulo”.',
          '`**` is the power: `2 ** 10` is 2 times itself 10 times.',
          'Commas are never part of a number in code: write `50000`, not `50,000`.',
        ],
      },
      { t: 'h', text: 'Division has two faces' },
      { t: 'p', text: 'The `/` operator gives a whole number when the division is exact and a float when it is not. When you want a whole number of shillings, use `intdiv()`, and use `%` to get what is left over.' },
      {
        t: 'try',
        code: php`<?php
var_dump(10 / 2);
var_dump(7 / 2);
echo intdiv(7, 2), "\n";
echo 7 % 2, "\n";
`,
        output: out('int(5)', 'float(3.5)', '3', '1'),
      },
      { t: 'p', text: 'Operators have an order, like in school: `*` `/` `%` first, then `+` `-`. Brackets go first of all.' },
      {
        t: 'try',
        code: php`<?php
echo 2 + 3 * 4, "\n";
echo (2 + 3) * 4, "\n";
`,
        output: out('14', '20'),
      },
      {
        t: 'predict',
        code: php`<?php
$x = 10;
$x += 5;
$x *= 2;
echo $x;
`,
        question: '`$x += 5` is a short way to write `$x = $x + 5`. What does this program print?',
        options: ['30', '20', '25', '15'],
        answer: 0,
        explain: 'Step by step: $x starts at 10. `+= 5` makes it 15. `*= 2` doubles it to 30. The short forms `+=`, `-=`, `*=`, `/=` change the variable in place.',
      },
      { t: 'h', text: 'Rounding and friends' },
      {
        t: 'try',
        code: php`<?php
echo round(2.5), "\n";
echo round(3.14159, 2), "\n";
echo floor(7.9), "\n";
echo ceil(7.1), "\n";
echo abs(-500), "\n";
echo max(3, 9, 4), "\n";
echo min(3, 9, 4), "\n";
`,
        output: out('3', '3.14', '7', '8', '500', '9', '3'),
      },
      {
        t: 'list',
        items: [
          '`round($x, $places)` rounds to the nearest. `floor` always goes down, `ceil` always goes up.',
          '`abs` removes a minus sign. `max` and `min` pick the biggest and smallest of the values you give.',
        ],
      },
      { t: 'p', text: 'To show money with commas, `number_format()` is the tool. Give it a second number to choose how many decimal places to show.' },
      {
        t: 'try',
        code: php`<?php
echo number_format(1234567), "\n";
echo number_format(1234.5678, 2), "\n";
echo "UGX " . number_format(50000) . "\n";
`,
        output: out('1,234,567', '1,234.57', 'UGX 50,000'),
      },
      { t: 'p', text: "Now a real booth calculation. The fee is 1% of the amount, rounded **up** to the next shilling. The amount arrives as input, so it is turned into a number with `(int)` first." },
      {
        t: 'try',
        stdin: '123456\n',
        code: php`<?php
$amount = (int) trim(fgets(STDIN));
$fee = ceil($amount * 0.01);
echo "Fee: ", number_format($fee), "\n";
echo "Total: ", number_format($amount + $fee), "\n";
`,
        output: out('Fee: 1,235', 'Total: 124,691'),
      },
      { t: 'h', text: 'A warning about decimals' },
      { t: 'p', text: 'Computers store decimal numbers in binary, and some simple decimals cannot be stored exactly. So `0.1 + 0.2` is very slightly more than 0.3, and comparing them with `==` says they are different! This is true in every programming language, not only PHP. Because of it, programs that handle money keep amounts in whole shillings (or whole cents) and round at the end.' },
      {
        t: 'try',
        code: php`<?php
echo 0.1 + 0.2, "\n";
var_dump(0.1 + 0.2 == 0.3);
`,
        output: out('0.3', 'bool(false)'),
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that divides and throws away the remainder.',
        template: php`<?php
echo ___(7, 2), "\n";
`,
        blanks: [{ options: ['intdiv', 'round', 'abs'], answer: 'intdiv' }],
        output: '3\n',
      },
      {
        t: 'bug',
        code: php`<?php
$people = 0;
echo 100000 / $people, "\n";
`,
        question: 'This program stops with an error. What is the problem?',
        options: ['Dividing by zero has no answer, so PHP stops', 'The number 100000 needs a comma', 'echo cannot print the result of a division', 'The variable must be named $number'],
        answer: 0,
        explain: 'You cannot share money among zero people: the result does not exist. PHP stops with “Division by zero”. In real programs you check for zero before dividing, which you will learn in the lesson on decisions.',
        fixed: php`<?php
$people = 4;
echo 100000 / $people, "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program works out the change from a 20,000 note and prints it.',
        lines: ['<?php', '$paid = 20000;', '$change = $paid - 13500;', 'echo "Change: ", $change, "\\n";'],
        output: 'Change: 6500\n',
      },
      {
        t: 'quiz',
        question: 'What does `17 % 5` give?',
        options: ['2', '3', '3.4', '12'],
        answer: 0,
        explain: '17 divided by 5 goes 3 times (that makes 15) and 2 is left over. The % operator gives that leftover, 2. It is perfect for “how many are left after sharing equally?”.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$total = 1,000;`, why: 'Commas cannot be part of a number in code. Write the number as one piece.', right: php`<?php
$total = 1000;` },
          { wrong: php`<?php
echo (2 + 3;`, why: 'The opening bracket was never closed. Every ( needs its ).', right: php`<?php
echo (2 + 3);` },
          { wrong: php`<?php
echo 10 / 4;`, why: 'No error, but the answer is 2.5, and you cannot give a customer half a share if you meant whole shillings. For a whole number use intdiv.', right: php`<?php
echo intdiv(10, 4);`, logic: true },
          { wrong: php`<?php
$a = 10;
$b = 20;
echo $a + $b / 2;`, why: 'No error, but the division happens first, so you get 10 + 10 = 20, not the average 15. Use brackets to say what goes first.', right: php`<?php
$a = 10;
$b = 20;
echo ($a + $b) / 2;`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`+ - * /` as usual, `%` gives the remainder, `**` is the power. `intdiv(a, b)` divides without decimals.',
          '`*` `/` `%` come before `+` `-`. Use brackets to be sure.',
          '`+=`, `-=`, `*=` and `++` change a variable in place.',
          '`round`, `floor`, `ceil`, `abs`, `max`, `min`. `number_format($n)` puts commas in shillings.',
          'Decimals can be very slightly off. Keep money in whole shillings.',
        ],
        memory: 'intdiv shares. % keeps the leftover. number_format dresses the number.',
      },
    ],
    exercises: [
      {
        id: 'php4-change',
        title: 'Give the change',
        prompt: 'The input has two lines: the price of the item, then the amount the customer paid (both whole numbers). Print the change in the form `Change: UGX 6,500`, with commas.',
        starter: php`<?php
$price = (int) trim(fgets(STDIN));
$paid = (int) trim(fgets(STDIN));
// work out the change and print it with number_format
`,
        usesInput: true,
        sampleInput: '13500\n20000\n',
        tests: [
          { input: '13500\n20000\n', expected: `Change: UGX ${money(20000 - 13500)}` },
          { input: '2750\n5000\n', expected: `Change: UGX ${money(5000 - 2750)}`, hidden: true, name: 'Small amounts' },
          { input: '80000\n100000\n', expected: `Change: UGX ${money(100000 - 80000)}`, hidden: true, name: 'Bigger amounts' },
        ],
        hints: [
          'The change is what is left after taking the price away from what was paid.',
          '$change = $paid - $price; then print it. number_format($change) adds the commas.',
          'A similar example: `echo "Total: UGX " . number_format($a + $b) . "\\n";` Yours subtracts.',
        ],
      },
      {
        id: 'php4-share',
        title: 'Share the deposit',
        prompt: 'The input has two lines: a total amount of shillings and the number of friends sharing it (both whole numbers). Print how much each friend gets and how much is left over, with commas:\n\n`Each gets: UGX 33,333`\n`Left over: UGX 1`',
        starter: php`<?php
$total = (int) trim(fgets(STDIN));
$friends = (int) trim(fgets(STDIN));
// each share is a whole number of shillings
`,
        usesInput: true,
        sampleInput: '100000\n3\n',
        tests: [
          { input: '100000\n3\n', expected: out(`Each gets: UGX ${money(Math.floor(100000 / 3))}`, `Left over: UGX ${money(100000 % 3)}`) },
          { input: '250000\n4\n', expected: out(`Each gets: UGX ${money(250000 / 4)}`, 'Left over: UGX 0'), hidden: true, name: 'An exact split' },
          { input: '7\n2\n', expected: out('Each gets: UGX 3', 'Left over: UGX 1'), hidden: true, name: 'Tiny amount' },
        ],
        hints: [
          'Two numbers are needed: how many whole shillings each person gets, and what remains.',
          'intdiv($total, $friends) is the share. $total % $friends is the leftover.',
          'A similar example: `echo intdiv(17, 5), " ", 17 % 5;` prints 3 and 2. Yours uses the two variables.',
        ],
      },
      {
        id: 'php4-fee',
        title: "Nambi's fee",
        prompt: 'The booth charges a fee of 2% of the amount, rounded **up** to the next whole shilling, but never less than 500. Read the amount and print the fee and the total (amount plus fee), with commas:\n\n`Fee: UGX 2,470`\n`Total: UGX 125,926`',
        starter: php`<?php
$amount = (int) trim(fgets(STDIN));
// fee = 2% of the amount, rounded up, but at least 500
`,
        usesInput: true,
        sampleInput: '123456\n',
        tests: [
          { input: '123456\n', expected: out(`Fee: UGX ${money(Math.ceil((123456 * 2) / 100))}`, `Total: UGX ${money(123456 + Math.ceil((123456 * 2) / 100))}`) },
          { input: '10000\n', expected: out('Fee: UGX 500', 'Total: UGX 10,500'), hidden: true, name: 'The minimum fee' },
          { input: '75000\n', expected: out('Fee: UGX 1,500', 'Total: UGX 76,500'), hidden: true, name: 'An exact percentage' },
          { input: '250000\n', expected: out('Fee: UGX 5,000', 'Total: UGX 255,000'), hidden: true, name: 'A large amount' },
        ],
        hints: [
          'Two ideas to combine: rounding up, and “at least 500”. One function rounds up, another picks the bigger of two values.',
          'ceil($amount * 0.02) is the rounded-up 2%. max(500, ...) makes sure the fee is never below 500.',
          'A similar example: `$fee = max(100, ceil($x * 0.05));` Yours uses 500 and 2 percent. Print with number_format.',
        ],
      },
    ],
  },

  // ================================================================== 5
  {
    id: 'php-decide',
    level: LEVEL,
    minutes: 24,
    title: 'Decisions',
    summary: 'if, elseif and else, comparing values, and why === beats ==',
    blocks: [
      {
        t: 'story',
        title: 'Can I take 80,000?',
        text: "A customer leans over the counter: “I want to withdraw 80,000.” Nambi checks her phone. The customer has only 65,000. “Sorry, not enough.” Another customer asks for 40,000 and gets it at once.\n\nNambi did not follow different instructions for each customer. She followed **one rule**: if the amount is not more than the balance, pay out, otherwise decline. A program makes the same kind of decision with `if`.",
      },
      {
        t: 'try',
        code: php`<?php
$balance = 65000;
$amount = 80000;
if ($amount <= $balance) {
    echo "Approved\n";
} else {
    echo "Declined: not enough balance\n";
}
`,
        output: 'Declined: not enough balance\n',
      },
      { t: 'p', text: 'The condition goes in brackets after `if`. If it is true, the instructions inside the first pair of curly brackets run. If not, the ones after `else` run. Only one of the two groups ever runs.' },
      { t: 'h', text: 'Comparing values' },
      {
        t: 'list',
        items: [
          '`<` less than, `>` greater than, `<=` less than or equal, `>=` greater than or equal.',
          '`===` is “exactly equal”, `!==` is “not exactly equal”.',
          '`==` and `!=` are looser versions. Prefer the three-character ones.',
          'A single `=` is never a comparison. It puts a value into a variable.',
        ],
      },
      { t: 'p', text: 'When there are more than two outcomes, add `elseif` in between. PHP tests the conditions from top to bottom and runs only the **first** one that is true. Here the booth picks a withdrawal fee (these fees are made up for teaching; real operators publish their own).' },
      {
        t: 'try',
        stdin: '120000\n',
        code: php`<?php
$amount = (int) trim(fgets(STDIN));
if ($amount <= 5000) {
    $fee = 0;
} elseif ($amount <= 50000) {
    $fee = 1000;
} elseif ($amount <= 200000) {
    $fee = 2000;
} else {
    $fee = 3500;
}
echo "Fee: ", $fee, "\n";
`,
        output: 'Fee: 2000\n',
      },
      { t: 'tip', text: 'Order matters in an elseif chain. A big amount like 120,000 is also “less than 200,000”, but the chain stops at the first true condition, so the conditions must go from the smallest limit to the largest.' },
      { t: 'h', text: '== or ===?' },
      { t: 'p', text: '`===` asks “same value AND same type?”. `==` is more relaxed and converts types before it compares, which sometimes surprises. Use `===` unless you have a reason not to.' },
      {
        t: 'try',
        code: php`<?php
var_dump(5 == "5");
var_dump(5 === "5");
var_dump("abc" == 0);
`,
        output: out('bool(true)', 'bool(false)', 'bool(false)'),
      },
      {
        t: 'predict',
        code: php`<?php
$stock = 0;
if ($stock > 0) {
    echo "In stock\n";
} elseif ($stock === 0) {
    echo "Sold out\n";
} else {
    echo "Check the book\n";
}
`,
        question: 'What does this program print?',
        options: ['Sold out', 'In stock', 'Check the book', 'Nothing'],
        answer: 0,
        explain: 'The first condition, 0 > 0, is false, so PHP moves on. The second one, 0 === 0, is true, so it prints Sold out and skips the rest of the chain.',
      },
      {
        t: 'fill',
        prompt: 'The customer wants 40,000 and has 65,000. Fill the gap with the comparison that approves a withdrawal when the amount is not more than the balance.',
        template: php`<?php
$balance = 65000;
$amount = 40000;
if ($amount ___ $balance) {
    echo "Approved\n";
} else {
    echo "Declined\n";
}
`,
        blanks: [{ options: ['<=', '>=', '==='], answer: '<=' }],
        output: 'Approved\n',
      },
      {
        t: 'bug',
        code: php`<?php
$balance = 5000;
if ($balance > 0) {
    echo "Has money\n";
else {
    echo "Empty\n";
}
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['The first curly bracket is never closed before else', 'else must be written with a capital E', 'The condition must be in square brackets', 'There must be a semicolon after the word if'],
        answer: 0,
        explain: 'Every `{` needs a matching `}`. The first block opened after the if condition was never closed, so PHP meets `else` in the middle of it and gets lost. Close the block with `}` just before `else`.',
        fixed: php`<?php
$balance = 5000;
if ($balance > 0) {
    echo "Has money\n";
} else {
    echo "Empty\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order. There are 9 people in the queue, so the program should tell Nambi to open a second counter.',
        lines: ['<?php', '$queue = 9;', 'if ($queue > 5) {', '    echo "Open a second counter\\n";', '} else {', '    echo "One counter is enough\\n";', '}'],
        output: 'Open a second counter\n',
      },
      {
        t: 'quiz',
        question: 'Which operator checks “exactly equal: same value and same type”?',
        options: ['===', '==', '=', '=>'],
        answer: 0,
        explain: 'A single = puts a value into a variable and => is used in arrays. == compares after converting types, and === compares without converting, which is safer.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$amount = 5000;
if ($amount => 5000) {
    echo "Big";
}`, why: 'The arrow => is not a comparison. “Greater than or equal” is written with the arrow the other way: >=.', right: php`<?php
$amount = 5000;
if ($amount >= 5000) {
    echo "Big";
}` },
          { wrong: php`<?php
$a = 3;
if ($a > 5) {
    echo "big";
} else ($a < 3) {
    echo "small";
}`, why: 'else never takes a condition. For another condition use elseif.', right: php`<?php
$a = 3;
if ($a > 5) {
    echo "big";
} elseif ($a < 3) {
    echo "small";
}` },
          { wrong: php`<?php
$balance = 0;
if ($balance = 100) {
    echo "Rich";
}`, why: 'No error, and that is the danger: a single = puts 100 into $balance and the condition is then true. To compare, use ===.', right: php`<?php
$balance = 0;
if ($balance === 100) {
    echo "Rich";
}`, logic: true },
          { wrong: php`<?php
$amount = 120000;
if ($amount <= 200000) {
    echo "Fee 2000";
} elseif ($amount <= 50000) {
    echo "Fee 1000";
}`, why: 'No error, but 120,000 is less than 200,000 so the first branch wins, and for a small amount like 30,000 it would also say 2000. Start with the smallest limit.', right: php`<?php
$amount = 120000;
if ($amount <= 50000) {
    echo "Fee 1000";
} elseif ($amount <= 200000) {
    echo "Fee 2000";
}`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`if (condition) { ... } elseif (condition) { ... } else { ... }`. Only the first true branch runs.',
          'Compare with `<`, `>`, `<=`, `>=`, `===`, `!==`. A single `=` is for putting values in variables, never for comparing.',
          'In an elseif chain, put the smallest limit first.',
          'Prefer `===` to `==`.',
          'Every `{` needs its `}`.',
        ],
        memory: 'if asks. else answers no. === compares. = stores.',
      },
    ],
    exercises: [
      {
        id: 'php5-withdraw',
        title: 'Approve the withdrawal',
        prompt: 'The input has two lines: the balance, then the amount the customer wants to withdraw. If the amount is not more than the balance, print `Approved. New balance: UGX 25,000` (with the balance left after paying, with commas). Otherwise print `Declined: not enough balance`.',
        starter: php`<?php
$balance = (int) trim(fgets(STDIN));
$amount = (int) trim(fgets(STDIN));
// decide, then print
`,
        usesInput: true,
        sampleInput: '65000\n40000\n',
        tests: [
          { input: '65000\n40000\n', expected: `Approved. New balance: UGX ${money(65000 - 40000)}` },
          { input: '65000\n80000\n', expected: 'Declined: not enough balance', hidden: true, name: 'Too much' },
          { input: '50000\n50000\n', expected: 'Approved. New balance: UGX 0', hidden: true, name: 'Exactly the whole balance' },
        ],
        hints: [
          'One if/else with two outcomes. The condition compares the amount with the balance.',
          'if ($amount <= $balance) { ... } else { ... }. Be careful with the equal case: taking exactly the whole balance is allowed.',
          'Inside the first block print the new balance: number_format($balance - $amount).',
        ],
      },
      {
        id: 'php5-send-fee',
        title: 'The send-money fee',
        prompt: "Nambi's send-money fee (made up for teaching): up to 10,000 costs 500; up to 100,000 costs 1,500; up to 1,000,000 costs 3,000; anything above costs 5,000. Read the amount and print `Send fee: UGX 1,500` with the right fee, with commas.",
        starter: php`<?php
$amount = (int) trim(fgets(STDIN));
// pick the fee with an if / elseif / else chain
`,
        usesInput: true,
        sampleInput: '45000\n',
        tests: [
          { input: '45000\n', expected: 'Send fee: UGX 1,500' },
          { input: '8000\n', expected: 'Send fee: UGX 500', hidden: true, name: 'Small amount' },
          { input: '10000\n', expected: 'Send fee: UGX 500', hidden: true, name: 'Exactly the first limit' },
          { input: '10001\n', expected: 'Send fee: UGX 1,500', hidden: true, name: 'One shilling over the first limit' },
          { input: '450000\n', expected: 'Send fee: UGX 3,000', hidden: true, name: 'Middle band' },
          { input: '2500000\n', expected: 'Send fee: UGX 5,000', hidden: true, name: 'Above the last limit' },
        ],
        hints: [
          'Four fees mean an if, two elseif and an else. Put the smallest limit first.',
          'if ($amount <= 10000) { $fee = 500; } elseif ($amount <= 100000) { ... } and so on, ending with else.',
          'After the chain, print: echo "Send fee: UGX ", number_format($fee), "\\n";',
        ],
      },
      {
        id: 'php5-queue',
        title: 'Read the queue',
        prompt: 'Read how many people are waiting. Print one of these three lines:\n\n`Short queue` for 3 people or fewer\n`Normal queue` for 4 to 8 people\n`Long queue: open a second counter` for more than 8',
        starter: php`<?php
$waiting = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '5\n',
        tests: [
          { input: '5\n', expected: 'Normal queue' },
          { input: '2\n', expected: 'Short queue', hidden: true, name: 'A few people' },
          { input: '3\n', expected: 'Short queue', hidden: true, name: 'The edge of short' },
          { input: '4\n', expected: 'Normal queue', hidden: true, name: 'The start of normal' },
          { input: '8\n', expected: 'Normal queue', hidden: true, name: 'The edge of normal' },
          { input: '15\n', expected: 'Long queue: open a second counter', hidden: true, name: 'A long queue' },
        ],
        hints: [
          'Three outcomes: if, elseif, else.',
          'if ($waiting <= 3) ... elseif ($waiting <= 8) ... else ... Check the edges: 3 and 8 belong to the lower group.',
          'Each branch just echoes its line. Remember the \\n at the end of each echo.',
        ],
      },
    ],
  },

  // ================================================================== 6
  {
    id: 'php-logic',
    level: LEVEL,
    minutes: 26,
    title: 'Logic, match and defaults',
    summary: 'Combining conditions with && || !, the match expression, ?: and ??',
    blocks: [
      {
        t: 'story',
        title: 'Three keys to open the safe',
        text: "Nambi's rule for a big withdrawal has three parts: the customer's balance must cover the amount, the PIN must be correct, and the daily limit must not be broken. If **any** one of them fails, the answer is no. All three must be true together.\n\nIn English you join conditions with “and” and “or”. PHP has symbols for them, and a few more tools for the moments when an `if` chain starts to look like a tangled rope.",
      },
      { t: 'h', text: 'And, or, not' },
      {
        t: 'list',
        items: [
          '`&&` means AND: true only when both sides are true.',
          '`||` means OR: true when at least one side is true.',
          '`!` means NOT: it flips true to false and false to true.',
          '`&&` is stronger than `||`, like `*` is stronger than `+`. Use brackets when you mix them.',
        ],
      },
      {
        t: 'try',
        code: php`<?php
$balance = 90000;
$amount = 50000;
$pinOk = true;
if ($amount <= $balance && $pinOk) {
    echo "Approved\n";
} else {
    echo "Declined\n";
}
`,
        output: 'Approved\n',
      },
      {
        t: 'try',
        code: php`<?php
$day = "Sunday";
$isWeekend = $day === "Saturday" || $day === "Sunday";
if (!$isWeekend) {
    echo "Booth opens at 7am\n";
} else {
    echo "Booth opens at 9am\n";
}
`,
        output: 'Booth opens at 9am\n',
      },
      { t: 'p', text: 'A condition is itself a value: `true` or `false`. You can keep it in a variable (like `$isWeekend`) and read it later. Variables that hold a true/false answer are usually named like a question: `$isWeekend`, `$pinOk`.' },
      {
        t: 'predict',
        code: php`<?php
var_dump(true && false || true);
`,
        question: '`&&` is stronger than `||`. What does this program print?',
        options: ['bool(true)', 'bool(false)', 'NULL', 'int(1)'],
        answer: 0,
        explain: '`&&` goes first: (true && false) is false. Then false || true is true. Without that rule you could think the answer is false. When in doubt, add brackets.',
      },
      { t: 'h', text: 'match: a tidy way to choose' },
      { t: 'p', text: 'When you compare ONE value against many fixed choices, a long elseif chain gets heavy. `match` gives a value back and is much easier to read. It compares strictly (like `===`), and `default` catches everything else.' },
      {
        t: 'try',
        code: php`<?php
$network = "airtel";
$colour = match ($network) {
    "mtn" => "yellow",
    "airtel" => "red",
    default => "unknown",
};
echo "Network colour: ", $colour, "\n";
`,
        output: 'Network colour: red\n',
      },
      { t: 'tip', text: 'If no arm matches and there is no `default`, PHP stops with an UnhandledMatchError. That is on purpose: it is better to find out about a case you forgot than to carry on with a wrong answer.' },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that starts a match expression.',
        template: php`<?php
$network = "mtn";
echo ___ ($network) {
    "mtn" => "yellow",
    default => "other",
};
`,
        blanks: [{ options: ['match', 'switch', 'if'], answer: 'match' }],
        output: 'yellow',
      },
      {
        t: 'bug',
        code: php`<?php
$network = "africell";
echo match ($network) {
    "mtn" => "yellow",
    "airtel" => "red",
};
`,
        question: 'This program stops with an “Unhandled match case” error. What is the fix?',
        options: ['Add a default arm for networks that are not listed', 'Remove the quotes around the network', 'Replace match with the word echo', 'Add a semicolon after each arm'],
        answer: 0,
        explain: 'The value "africell" is not one of the listed arms, and match refuses to guess. A `default =>` arm says what to do for everything else.',
        fixed: php`<?php
$network = "africell";
echo match ($network) {
    "mtn" => "yellow",
    "airtel" => "red",
    default => "other",
};
`,
      },
      { t: 'h', text: 'Two small shortcuts' },
      { t: 'p', text: 'The **ternary** `condition ? a : b` is a one-line if/else that gives back a value. The **null coalescing** operator `a ?? b` gives `a` if it exists, otherwise `b`. In the example below the prices sit in an **array**, a list of named values. You will learn arrays in the next level; for now read it as a price list.' },
      {
        t: 'try',
        code: php`<?php
$stock = 0;
echo $stock > 0 ? "In stock" : "Sold out", "\n";
$prices = ["sugar" => 4500, "rice" => 3000];
$item = "salt";
echo $prices[$item] ?? "not stocked", "\n";
echo $prices["rice"] ?? "not stocked", "\n";
`,
        output: out('Sold out', 'not stocked', '3000'),
      },
      {
        t: 'quiz',
        question: 'Which operator means AND in PHP?',
        options: ['&&', '||', '!', '=>'],
        answer: 0,
        explain: '&& is AND (both must be true), || is OR (one is enough) and ! is NOT. The arrow => is used in arrays and match arms.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$x = 7;
if ($x > 5 && < 10) {
    echo "in range";
}`, why: 'Each side of && needs a complete condition. The second one forgot to say what is being compared.', right: php`<?php
$x = 7;
if ($x > 5 && $x < 10) {
    echo "in range";
}` },
          { wrong: php`<?php
$x = 7;
if (5 < $x < 10) {
    echo "in range";
}`, why: 'Unlike in maths class, you cannot chain comparisons. Write two conditions and join them with &&.', right: php`<?php
$x = 7;
if (5 < $x && $x < 10) {
    echo "in range";
}` },
          { wrong: php`<?php
$name = "africell";
echo match ($name) {
    "mtn" => "yellow",
    "airtel" => "red",
};`, why: 'No arm matches and there is no default, so PHP stops with an error.', right: php`<?php
$name = "africell";
echo match ($name) {
    "mtn" => "yellow",
    "airtel" => "red",
    default => "other",
};` },
          { wrong: php`<?php
$n = "mtn";
switch ($n) {
    case "mtn":
        echo "yellow\n";
    case "airtel":
        echo "red\n";
}`, why: 'No error, but without break a switch keeps running into the next case, so MTN prints yellow AND red. This is why match is safer.', right: php`<?php
$n = "mtn";
switch ($n) {
    case "mtn":
        echo "yellow\n";
        break;
    case "airtel":
        echo "red\n";
        break;
}`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`&&` AND, `||` OR, `!` NOT. `&&` goes before `||`; use brackets when mixing.',
          'A condition is a value (`true` or `false`) that you can keep in a variable.',
          '`match ($x) { a => ..., default => ... }` picks one result for one value and never falls through.',
          '`cond ? a : b` is a one-line if/else. `a ?? b` means “a, or b if a is missing”.',
          '`switch` works too, but it needs `break` after each case.',
        ],
        memory: 'AND needs both. OR needs one. match always needs a default.',
      },
    ],
    exercises: [
      {
        id: 'php6-safe',
        title: 'Open the safe',
        prompt: 'The input has four lines: the balance, the amount wanted, the PIN typed, and how much was already withdrawn today. The correct PIN is `4821` and the daily limit is 2,000,000 (made up for teaching). Check in this order and print only the first problem found:\n\n`Wrong PIN`\n`Not enough balance`\n`Daily limit reached` (when the amount plus today\'s total goes above 2,000,000)\n\nIf all is well, print `Approved`.',
        starter: php`<?php
$balance = (int) trim(fgets(STDIN));
$amount = (int) trim(fgets(STDIN));
$pin = trim(fgets(STDIN));
$usedToday = (int) trim(fgets(STDIN));
// the correct PIN is "4821" and the daily limit is 2000000
`,
        usesInput: true,
        sampleInput: '500000\n100000\n4821\n0\n',
        tests: [
          { input: '500000\n100000\n4821\n0\n', expected: 'Approved' },
          { input: '500000\n100000\n1234\n0\n', expected: 'Wrong PIN', hidden: true, name: 'Wrong PIN' },
          { input: '50000\n100000\n4821\n0\n', expected: 'Not enough balance', hidden: true, name: 'Not enough money' },
          { input: '5000000\n300000\n4821\n1800000\n', expected: 'Daily limit reached', hidden: true, name: 'Over the daily limit' },
          { input: '5000000\n200000\n4821\n1800000\n', expected: 'Approved', hidden: true, name: 'Exactly on the daily limit' },
          { input: '10\n100000\n0000\n0\n', expected: 'Wrong PIN', hidden: true, name: 'Two problems: the first one wins' },
        ],
        hints: [
          'Check the problems in the order given, with if and elseif, and end with else for Approved.',
          'The PIN is text, so compare with === "4821". The limit check is $usedToday + $amount > 2000000.',
          'Order: if ($pin !== "4821") ... elseif ($amount > $balance) ... elseif ($usedToday + $amount > 2000000) ... else ...',
        ],
      },
      {
        id: 'php6-counter',
        title: 'Which counter?',
        prompt: 'The booth has a counter for each network. Read a network name and print `Counter 1 (yellow)` for mtn, `Counter 2 (red)` for airtel and `Counter 3 (other)` for any other word. Capital letters in the input must not matter: `MTN` works too. Use match.',
        starter: php`<?php
$network = strtolower(trim(fgets(STDIN)));
`,
        usesInput: true,
        sampleInput: 'airtel\n',
        tests: [
          { input: 'airtel\n', expected: 'Counter 2 (red)' },
          { input: 'mtn\n', expected: 'Counter 1 (yellow)', hidden: true, name: 'MTN' },
          { input: 'MTN\n', expected: 'Counter 1 (yellow)', hidden: true, name: 'Capital letters' },
          { input: 'Africell\n', expected: 'Counter 3 (other)', hidden: true, name: 'Another network' },
        ],
        hints: [
          'match compares one value against several fixed choices and gives back a result. Do not forget default.',
          'echo match ($network) { "mtn" => "...", "airtel" => "...", default => "..." }; followed by a new line.',
          'The starter already makes the input small letters, so you can compare with "mtn" and "airtel".',
        ],
      },
      {
        id: 'php6-open',
        title: 'Is the booth open?',
        prompt: 'The booth is open Monday to Saturday from 8 to 19 (8am to 7:59pm), and on Sunday from 10 to 15. Read the day name (`Monday`, `Sunday`, and so on) and the hour (0 to 23) and print `Open` or `Closed`.',
        starter: php`<?php
$day = trim(fgets(STDIN));
$hour = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: 'Monday\n9\n',
        tests: [
          { input: 'Monday\n9\n', expected: 'Open' },
          { input: 'Monday\n7\n', expected: 'Closed', hidden: true, name: 'Before opening' },
          { input: 'Saturday\n19\n', expected: 'Open', hidden: true, name: 'Last open hour' },
          { input: 'Saturday\n20\n', expected: 'Closed', hidden: true, name: 'After closing' },
          { input: 'Sunday\n9\n', expected: 'Closed', hidden: true, name: 'Sunday morning' },
          { input: 'Sunday\n10\n', expected: 'Open', hidden: true, name: 'Sunday opening' },
          { input: 'Sunday\n15\n', expected: 'Open', hidden: true, name: 'Sunday last hour' },
          { input: 'Sunday\n16\n', expected: 'Closed', hidden: true, name: 'Sunday afternoon' },
        ],
        hints: [
          'Two different rules: one for Sunday, one for the other days. Start with if ($day === "Sunday").',
          'Inside each branch combine two conditions with &&, for example $hour >= 10 && $hour <= 15.',
          'You can keep the answer in a variable such as $open (true or false) and print Open or Closed at the end with a ternary.',
        ],
      },
    ],
  },

  // ================================================================== 7
  {
    id: 'php-receipt',
    level: LEVEL,
    minutes: 30,
    title: "Project: Nambi's receipt",
    summary: 'Put Level 1 together: read a transaction, work out the fee, print a tidy receipt',
    blocks: [
      {
        t: 'story',
        title: 'The first printed receipt',
        text: "On Friday afternoon Nambi's nephew brings a laptop and a small printer. He types three lines of input, the customer's name, the service and the amount, and out comes a tidy receipt. The first customer, Amina, withdraws 120,000. Nambi reads the paper twice. “The fee is right,” she says. “The name has a capital letter. The numbers have commas. Do it again!”\n\nYou already know every tool you need: reading input, strings, numbers, decisions. Today you put them together into one real program, one step at a time. Press Run on each step and compare it with the step before.",
      },
      { t: 'h', text: 'Step 1: the header' },
      { t: 'p', text: 'A line of 32 equals signs, the booth name, another line. `str_repeat` builds the line so you do not have to count the signs yourself.' },
      {
        t: 'project',
        title: 'Receipt, step 1: the header',
        code: php`<?php
$line = str_repeat("=", 32);
echo $line, "\n";
echo " NAMBI'S MONEY BOOTH - MUKONO\n";
echo $line, "\n";
`,
        output: receiptHeader(),
      },
      { t: 'h', text: 'Step 2: read the transaction and show it' },
      { t: 'p', text: 'The program reads three lines: the name, the service (`deposit` or `withdraw`) and the amount. Names and services are tidied up, so `amina` becomes `Amina` and `WITHDRAW` becomes `Withdraw`. The amount becomes a whole number and gets its commas.' },
      {
        t: 'project',
        title: 'Receipt, step 2: the customer lines',
        stdin: receiptInput('amina', 'withdraw', 120000),
        code: php`<?php
$name = trim(fgets(STDIN));
$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));

$line = str_repeat("=", 32);
echo $line, "\n";
echo " NAMBI'S MONEY BOOTH - MUKONO\n";
echo $line, "\n";
echo "Customer : ", ucwords($name), "\n";
echo "Service  : ", ucfirst($service), "\n";
echo "Amount   : UGX ", number_format($amount), "\n";
`,
        output: part(0, 6),
      },
      { t: 'h', text: 'Step 3: the fee and the total' },
      { t: 'p', text: 'Deposits are free. Withdrawals pay 1,000 up to 50,000, then 2,000 up to 200,000, then 3,500 (a made-up table). The total is the amount plus the fee. This is an if / elseif / else chain, and the smallest limit goes first.' },
      {
        t: 'project',
        title: 'Receipt, step 3: the fee',
        stdin: receiptInput('amina', 'withdraw', 120000),
        code: php`<?php
$name = trim(fgets(STDIN));
$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));

if ($service === "deposit") {
    $fee = 0;
} elseif ($amount <= 50000) {
    $fee = 1000;
} elseif ($amount <= 200000) {
    $fee = 2000;
} else {
    $fee = 3500;
}
$total = $amount + $fee;

$line = str_repeat("=", 32);
echo $line, "\n";
echo " NAMBI'S MONEY BOOTH - MUKONO\n";
echo $line, "\n";
echo "Customer : ", ucwords($name), "\n";
echo "Service  : ", ucfirst($service), "\n";
echo "Amount   : UGX ", number_format($amount), "\n";
echo "Fee      : UGX ", number_format($fee), "\n";
echo str_repeat("-", 32), "\n";
echo "TOTAL    : UGX ", number_format($total), "\n";
`,
        output: part(0, 9),
      },
      { t: 'h', text: 'Step 4: the finished receipt' },
      { t: 'p', text: 'One last line to thank the customer. This is the whole program, and it is yours to change: try other names, `deposit`, or an amount of exactly 50,000.' },
      {
        t: 'project',
        title: 'Receipt, step 4: the finished receipt',
        stdin: receiptInput('amina', 'withdraw', 120000),
        code: php`<?php
$name = trim(fgets(STDIN));
$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));

if ($service === "deposit") {
    $fee = 0;
} elseif ($amount <= 50000) {
    $fee = 1000;
} elseif ($amount <= 200000) {
    $fee = 2000;
} else {
    $fee = 3500;
}
$total = $amount + $fee;

$line = str_repeat("=", 32);
echo $line, "\n";
echo " NAMBI'S MONEY BOOTH - MUKONO\n";
echo $line, "\n";
echo "Customer : ", ucwords($name), "\n";
echo "Service  : ", ucfirst($service), "\n";
echo "Amount   : UGX ", number_format($amount), "\n";
echo "Fee      : UGX ", number_format($fee), "\n";
echo str_repeat("-", 32), "\n";
echo "TOTAL    : UGX ", number_format($total), "\n";
echo "Thank you! Come again.\n";
`,
        output: receipt('amina', 'withdraw', 120000),
      },
      {
        t: 'try',
        stdin: receiptInput('Ssali Joseph', 'DEPOSIT', 35000),
        code: php`<?php
$name = trim(fgets(STDIN));
$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));

if ($service === "deposit") {
    $fee = 0;
} elseif ($amount <= 50000) {
    $fee = 1000;
} elseif ($amount <= 200000) {
    $fee = 2000;
} else {
    $fee = 3500;
}
$total = $amount + $fee;

$line = str_repeat("=", 32);
echo $line, "\n";
echo " NAMBI'S MONEY BOOTH - MUKONO\n";
echo $line, "\n";
echo "Customer : ", ucwords($name), "\n";
echo "Service  : ", ucfirst($service), "\n";
echo "Amount   : UGX ", number_format($amount), "\n";
echo "Fee      : UGX ", number_format($fee), "\n";
echo str_repeat("-", 32), "\n";
echo "TOTAL    : UGX ", number_format($total), "\n";
echo "Thank you! Come again.\n";
`,
        output: receipt('Ssali Joseph', 'deposit', 35000),
      },
      {
        t: 'predict',
        code: php`<?php
$service = "deposit";
$amount = 250000;
if ($service === "deposit") {
    $fee = 0;
} elseif ($amount <= 50000) {
    $fee = 1000;
} else {
    $fee = 3500;
}
echo $fee;
`,
        question: 'A customer deposits 250,000. What fee does this program print?',
        options: ['0', '1000', '3500', '250000'],
        answer: 0,
        explain: 'The chain stops at the first true condition, and the very first one asks “is this a deposit?”. It is, so the fee is 0 and the other branches are never looked at, however big the amount is.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that puts commas in the amount, as on the receipt.',
        template: php`<?php
$amount = 120000;
echo "Amount   : UGX ", ___($amount), "\n";
`,
        blanks: [{ options: ['number_format', 'strlen', 'trim'], answer: 'number_format' }],
        output: 'Amount   : UGX 120,000\n',
      },
      {
        t: 'bug',
        code: php`<?php
$amount = 120000;
$fee = 2000;
$total = $amount + fee;
echo number_format($total), "\n";
`,
        question: 'This program stops with “Undefined constant”. What is wrong?',
        options: ['fee is missing its $ in front, so PHP does not see the variable', 'number_format cannot print a total', 'The amount is too big for PHP', 'The semicolons are in the wrong place'],
        answer: 0,
        explain: 'Without the dollar sign PHP looks for a constant (a fixed name) called fee, finds none and stops. Every variable needs its $ every time you use it, not only when you create it.',
        fixed: php`<?php
$amount = 120000;
$fee = 2000;
$total = $amount + $fee;
echo number_format($total), "\n";
`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo number_format("ten thousand");`, why: 'number_format needs a number, and “ten thousand” is text that PHP cannot turn into one. Convert input with (int) first, and never trust it blindly.', right: php`<?php
echo number_format(10000);` },
          { wrong: php`<?php
$fee = 2000;
echo 'Fee: UGX $fee';`, why: 'No error, but single quotes do not fill in variables, so the receipt would print the dollar sign and the word fee.', right: php`<?php
$fee = 2000;
echo "Fee: UGX $fee";`, logic: true },
          { wrong: php`<?php
echo "Customer : ", "Amina";
echo "Service  : ", "Deposit";`, why: 'No error, but there is no \\n at the end of the first echo, so both pieces end up on one line of the receipt.', right: php`<?php
echo "Customer : ", "Amina", "\n";
echo "Service  : ", "Deposit", "\n";`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'A real program is small steps in order: read, decide, calculate, print.',
          'Tidy the input first: `trim`, `strtolower`, `ucwords`, `(int)`.',
          'Use `number_format` for shillings and `str_repeat` for lines.',
          'Run after every step. If something breaks, the last step you added is the suspect.',
          'You will copy this code a lot. Level 3 (functions) shows how to write it once.',
        ],
        memory: 'Read. Decide. Calculate. Print. Run after each step.',
      },
    ],
    exercises: [
      {
        id: 'php7-receipt',
        title: "Print Nambi's receipt",
        prompt: 'Read three lines: the customer name, the service (`deposit` or `withdraw`, in any capital letters) and the amount. Print the full receipt exactly as in the lesson: header, customer, service, amount, fee, a line of 32 dashes, the total and the thank-you line.\n\nFees: deposits are free. Withdrawals: up to 50,000 cost 1,000; up to 200,000 cost 2,000; above that 3,500.',
        starter: php`<?php
$name = trim(fgets(STDIN));
$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));
// work out the fee and the total, then print the receipt
`,
        usesInput: true,
        sampleInput: receiptInput('amina', 'withdraw', 120000),
        tests: [
          { input: receiptInput('amina', 'withdraw', 120000), expected: receipt('amina', 'withdraw', 120000) },
          { input: receiptInput('Brian Kato', 'deposit', 35000), expected: receipt('Brian Kato', 'deposit', 35000), hidden: true, name: 'A deposit' },
          { input: receiptInput('grace', 'WITHDRAW', 50000), expected: receipt('grace', 'withdraw', 50000), hidden: true, name: 'Exactly 50,000' },
          { input: receiptInput('ssali joseph', 'withdraw', 200001), expected: receipt('ssali joseph', 'withdraw', 200001), hidden: true, name: 'One shilling over 200,000' },
          { input: receiptInput('Nakato', 'Deposit', 1250000), expected: receipt('Nakato', 'deposit', 1250000), hidden: true, name: 'A big deposit' },
        ],
        hints: [
          'Follow the four steps of the lesson: the fee chain first, then the total, then print line by line.',
          'The fee: deposit is 0, then amounts up to 50000, up to 200000, and the rest. Print every line with echo and end it with \\n.',
          'Look at the expected output carefully: the labels are padded so the colons line up ("Customer : ", "Service  : ", "Amount   : UGX ").',
        ],
      },
      {
        id: 'php7-three-fees',
        title: 'Three fees and their total',
        prompt: "The input has three withdrawal amounts, one per line. For each print `UGX 120,000 -> fee UGX 2,000` (amount, arrow, fee, with commas), then on a last line print the total of the three fees: `Total fees: UGX 4,000`. Use the withdrawal fees of the receipt: up to 50,000 cost 1,000; up to 200,000 cost 2,000; above that 3,500.\n\nYou will write the same if-chain three times. That is normal for now; in Level 3 you will learn to write it once.",
        starter: php`<?php
$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));
$c = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '120000\n30000\n500000\n',
        tests: [
          {
            input: '120000\n30000\n500000\n',
            expected: out(`UGX ${money(120000)} -> fee UGX ${money(boothFee('withdraw', 120000))}`, `UGX ${money(30000)} -> fee UGX ${money(boothFee('withdraw', 30000))}`, `UGX ${money(500000)} -> fee UGX ${money(boothFee('withdraw', 500000))}`, `Total fees: UGX ${money(boothFee('withdraw', 120000) + boothFee('withdraw', 30000) + boothFee('withdraw', 500000))}`),
          },
          {
            input: '50000\n50001\n200000\n',
            expected: out(`UGX ${money(50000)} -> fee UGX ${money(boothFee('withdraw', 50000))}`, `UGX ${money(50001)} -> fee UGX ${money(boothFee('withdraw', 50001))}`, `UGX ${money(200000)} -> fee UGX ${money(boothFee('withdraw', 200000))}`, `Total fees: UGX ${money(boothFee('withdraw', 50000) + boothFee('withdraw', 50001) + boothFee('withdraw', 200000))}`),
            hidden: true,
            name: 'Edges of the bands',
          },
        ],
        hints: [
          'Work out one fee first. Then repeat the same chain for the second and the third amount, with new variable names for the fees.',
          'Keep three fee variables, for example $feeA, $feeB and $feeC, so that you can add them up at the end.',
          'Print the three lines with number_format on both the amount and the fee. The last line prints $feeA + $feeB + $feeC.',
        ],
      },
    ],
  },
];
