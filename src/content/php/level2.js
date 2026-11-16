// PHP, Level 2: Loops and arrays. Lessons 8 to 10 (loops, arrays, associative arrays).
// Prose uses double-quoted strings. PHP code uses the php`...` tag (String.raw), see shared.js.
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money } from './shared.js';

const LEVEL = 'Level 2: Loops and arrays';

export const level2 = [
  // ================================================================== 8
  {
    id: 'php-loops',
    level: LEVEL,
    minutes: 26,
    title: 'Loops',
    summary: 'for, while, break and continue, and reading input until it ends',
    blocks: [
      {
        t: 'story',
        title: 'The numbered tickets',
        text: "On Fridays the queue at Nambi's booth reaches the road, so she hands out numbered tickets to keep it fair. Ticket 1, ticket 2, ticket 3 … by lunchtime her hand is tired and she has written the same word two hundred times.\n\nA computer never gets tired of repeating. A **loop** tells it: “do this again and again, and stop when I say so.” With loops, a program of ten lines can do the work of ten thousand.",
      },
      {
        t: 'try',
        code: php`<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Ticket ", $i, "\n";
}
`,
        output: out('Ticket 1', 'Ticket 2', 'Ticket 3', 'Ticket 4', 'Ticket 5'),
      },
      { t: 'h', text: 'Inside the brackets of for' },
      {
        t: 'list',
        items: [
          '`$i = 1` runs **once**, before the first round. It makes the counter.',
          '`$i <= 5` is checked **before every round**. While it is true, the round runs. When it turns false, the loop ends.',
          '`$i++` runs **after every round**. It is short for `$i = $i + 1`.',
          'The three parts are separated by semicolons `;`, not commas.',
        ],
      },
      { t: 'p', text: 'The step can be anything. Here the counter jumps by 10,000 each round:' },
      {
        t: 'try',
        code: php`<?php
for ($amount = 10000; $amount <= 50000; $amount += 10000) {
    echo "UGX ", number_format($amount), "\n";
}
`,
        output: out('UGX 10,000', 'UGX 20,000', 'UGX 30,000', 'UGX 40,000', 'UGX 50,000'),
      },
      {
        t: 'predict',
        code: php`<?php
for ($i = 10; $i > 0; $i -= 3) {
    echo $i, " ";
}
`,
        question: 'The counter goes down this time. What does the program print?',
        options: ['10 7 4 1', '10 7 4 1 -2', '7 4 1', '10 9 8 7'],
        answer: 0,
        explain: 'It starts at 10 and takes away 3 each round: 10, 7, 4, 1. After 1 the counter becomes -2, and -2 > 0 is false, so the loop stops before printing it.',
      },
      { t: 'h', text: 'while: repeat until something changes' },
      { t: 'p', text: 'Use `for` when you know how many rounds you want. Use `while` when you only know the **condition**. Nambi puts 50,000 shillings in a savings group that doubles it every month. How many months until she passes a million?' },
      {
        t: 'try',
        code: php`<?php
$savings = 50000;
$months = 0;
while ($savings < 1000000) {
    $savings *= 2;
    $months++;
}
echo $months, " months: UGX ", number_format($savings), "\n";
`,
        output: '5 months: UGX 1,600,000\n',
      },
      { t: 'tip', text: 'A loop whose condition never turns false runs forever. The usual cause is forgetting to change the variable the condition looks at. If this happens here, the app stops your program after about 8 seconds and tells you.' },
      { t: 'h', text: 'break and continue' },
      { t: 'p', text: '`continue` skips the rest of this round and jumps to the next one. `break` leaves the loop completely.' },
      {
        t: 'try',
        code: php`<?php
for ($i = 1; $i <= 10; $i++) {
    if ($i % 2 === 0) {
        continue;
    }
    if ($i > 7) {
        break;
    }
    echo $i, "\n";
}
`,
        output: out('1', '3', '5', '7'),
      },
      { t: 'h', text: 'Reading input until it ends' },
      { t: 'p', text: "Often you do not know how many lines of input there will be. `fgets(STDIN)` gives back `false` when the input is finished, so a `while` loop can read until then. Keep the `!== false` in the condition: a line that looks empty is still a line, and `trim` is done inside the loop." },
      {
        t: 'try',
        stdin: 'Amina\nBrian\nGrace\n',
        code: php`<?php
while (($line = fgets(STDIN)) !== false) {
    echo "Hello, ", trim($line), "!\n";
}
`,
        output: out('Hello, Amina!', 'Hello, Brian!', 'Hello, Grace!'),
      },
      { t: 'p', text: 'Or the first line can say how many lines follow. Then an ordinary `for` loop is enough:' },
      {
        t: 'try',
        stdin: '3\nAmina\nBrian\nGrace\n',
        code: php`<?php
$count = (int) trim(fgets(STDIN));
for ($i = 1; $i <= $count; $i++) {
    $name = trim(fgets(STDIN));
    echo $i, ". ", $name, "\n";
}
`,
        output: out('1. Amina', '2. Brian', '3. Grace'),
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop prints 1, 2 and 3 (and keeps going while the counter is not past 3).',
        template: php`<?php
for ($i = 1; $i ___ 3; $i++) {
    echo $i, "\n";
}
`,
        blanks: [{ options: ['<=', '>=', '==='], answer: '<=' }],
        output: out('1', '2', '3'),
      },
      {
        t: 'bug',
        code: php`<?php
for ($i = 1, $i <= 3, $i++) {
    echo "Ticket ", $i, "\n";
}
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['The three parts of the for must be separated by semicolons, not commas', 'echo cannot be used inside a loop', 'The counter must be named $x', 'The loop needs the word then'],
        answer: 0,
        explain: 'A for loop has exactly three parts, and they are separated by semicolons: start; condition; step. Commas are used elsewhere (in echo, in function calls), which is why the mix-up is so common.',
        fixed: php`<?php
for ($i = 1; $i <= 3; $i++) {
    echo "Ticket ", $i, "\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program adds up 1 + 2 + 3 + 4 and prints the total.',
        lines: ['<?php', '$total = 0;', 'for ($i = 1; $i <= 4; $i++) {', '    $total += $i;', '}', 'echo $total, "\\n";'],
        output: '10\n',
      },
      {
        t: 'quiz',
        question: 'You want to repeat something exactly 20 times. Which loop is the most natural?',
        options: ['for', 'while, because it is shorter', 'break', 'none: you must type the line 20 times'],
        answer: 0,
        explain: 'for keeps the counter, the limit and the step together in one line, which is perfect when you know how many rounds you want. while is better when you only know the condition to stop.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
for ($i = 1, $i <= 3, $i++) {
    echo $i;
}`, why: 'The parts of a for loop are separated by semicolons.', right: php`<?php
for ($i = 1; $i <= 3; $i++) {
    echo $i;
}` },
          { wrong: php`<?php
for ($i = 1; $i <= 3; $i++) {
    echo $i;`, why: 'The curly bracket that opens the loop body is never closed.', right: php`<?php
for ($i = 1; $i <= 3; $i++) {
    echo $i;
}` },
          { wrong: php`<?php
$i = 1;
while ($i <= 3) {
    echo $i;
}`, why: 'The counter never changes, so the condition stays true forever and the loop never ends. The program has to change the variable the condition looks at.', right: php`<?php
$i = 1;
while ($i <= 3) {
    echo $i;
    $i++;
}`, logic: true },
          { wrong: php`<?php
for ($i = 1; $i < 5; $i++) {
    echo "Ticket ", $i, "\n";
}`, why: 'No error, but it prints only 4 tickets. Using < instead of <= stops one round early. Count the first and last values when you check a loop.', right: php`<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Ticket ", $i, "\n";
}`, logic: true },
          { wrong: php`<?php
for ($i = 1; $i <= 3; $i++);
{
    echo "Ticket ", $i, "\n";
}`, why: 'The semicolon right after the brackets ends the loop with an empty body. The block below runs once, after the loop, and prints Ticket 4.', right: php`<?php
for ($i = 1; $i <= 3; $i++) {
    echo "Ticket ", $i, "\n";
}`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`for (start; condition; step) { ... }` repeats while the condition is true.',
          '`while (condition) { ... }` repeats while the condition is true. Something inside must change it, or the loop never ends.',
          '`continue` skips to the next round. `break` leaves the loop.',
          '`while (($line = fgets(STDIN)) !== false) { ... }` reads every line of input.',
          'When a loop prints one round too many or too few, check `<` against `<=` and the first value.',
        ],
        memory: 'for knows how many. while knows when to stop. break leaves.',
      },
    ],
    exercises: [
      {
        id: 'php8-tickets',
        title: 'Print the tickets',
        prompt: 'The input is one number N. Print `Ticket 1`, `Ticket 2`, and so on up to `Ticket N`, one per line.',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '3\n',
        tests: [
          { input: '3\n', expected: out('Ticket 1', 'Ticket 2', 'Ticket 3') },
          { input: '1\n', expected: 'Ticket 1', hidden: true, name: 'Just one' },
          { input: '10\n', expected: out(...Array.from({ length: 10 }, (_, i) => `Ticket ${i + 1}`)), hidden: true, name: 'Ten tickets' },
        ],
        hints: [
          'You know how many rounds you want, so a for loop is the natural choice.',
          'Count from 1 up to and including $n: for ($i = 1; $i <= $n; $i++) { ... }',
          'Inside the loop print the word Ticket, a space, and the counter, then a new line.',
        ],
      },
      {
        id: 'php8-doubling',
        title: 'How long to reach the target?',
        prompt: 'A savings group doubles the money every month. The input has two lines: the starting amount and the target. Print how many months it takes to reach **at least** the target, and the amount at that time, with commas:\n\n`Months: 5`\n`Savings: UGX 1,600,000`\n\nIf the start is already at the target, it takes 0 months.',
        starter: php`<?php
$savings = (int) trim(fgets(STDIN));
$target = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '50000\n1000000\n',
        tests: [
          { input: '50000\n1000000\n', expected: out('Months: 5', 'Savings: UGX 1,600,000') },
          { input: '300000\n300000\n', expected: out('Months: 0', 'Savings: UGX 300,000'), hidden: true, name: 'Already there' },
          { input: '1\n100\n', expected: out('Months: 7', 'Savings: UGX 128'), hidden: true, name: 'Small numbers' },
          { input: '40000\n80000\n', expected: out('Months: 1', 'Savings: UGX 80,000'), hidden: true, name: 'Hits the target exactly' },
        ],
        hints: [
          'You do not know how many months it takes, only when to stop, so use a while loop.',
          'Keep a $months counter. While $savings is less than $target: double the savings and add 1 to $months.',
          'Print after the loop ends. Use number_format for the savings.',
        ],
      },
      {
        id: 'php8-day-total',
        title: 'Add up the day',
        prompt: 'The input is a list of amounts, one per line, as many as the day had. Some lines are 0 or empty (a customer who changed their mind): skip those. Print how many amounts were counted and their total, with commas:\n\n`Counted: 3`\n`Total: UGX 70,000`',
        starter: php`<?php
// read until there are no more lines
`,
        usesInput: true,
        sampleInput: '20000\n0\n35000\n\n15000\n',
        tests: [
          { input: '20000\n0\n35000\n\n15000\n', expected: out('Counted: 3', 'Total: UGX 70,000') },
          { input: '120000\n', expected: out('Counted: 1', 'Total: UGX 120,000'), hidden: true, name: 'One amount' },
          { input: '0\n\n0\n', expected: out('Counted: 0', 'Total: UGX 0'), hidden: true, name: 'Nothing to count' },
          { input: '5000\n5000\n5000\n5000\n', expected: out('Counted: 4', 'Total: UGX 20,000'), hidden: true, name: 'Four equal amounts' },
        ],
        hints: [
          'Read with while (($line = fgets(STDIN)) !== false). You do not know how many lines there are.',
          'Turn the trimmed line into a number with (int). If it is 0 (an empty line also becomes 0), use continue to skip it.',
          'Keep two variables: a counter and a total. Add to them only for the amounts that were not skipped. Print both after the loop.',
        ],
      },
      {
        id: 'php8-float',
        title: "Pay until the float runs out",
        prompt: 'Nambi starts the day with a float (cash in the drawer). The first input line is the float, and every other line is a withdrawal request. She pays each request in order, but the moment one request is **bigger than what is left in the drawer**, she stops and pays no more (even if a later, smaller one would fit). Print:\n\n`Paid: 3 withdrawals`\n`Float left: UGX 120,000`',
        starter: php`<?php
$float = (int) trim(fgets(STDIN));
// the other lines are the requests
`,
        usesInput: true,
        sampleInput: '500000\n200000\n150000\n30000\n400000\n10000\n',
        tests: [
          { input: '500000\n200000\n150000\n30000\n400000\n10000\n', expected: out('Paid: 3 withdrawals', 'Float left: UGX 120,000') },
          { input: '100000\n100000\n', expected: out('Paid: 1 withdrawals', 'Float left: UGX 0'), hidden: true, name: 'Uses the whole float' },
          { input: '50000\n60000\n10000\n', expected: out('Paid: 0 withdrawals', 'Float left: UGX 50,000'), hidden: true, name: 'The first one is too big' },
          { input: '300000\n100000\n100000\n100000\n', expected: out('Paid: 3 withdrawals', 'Float left: UGX 0'), hidden: true, name: 'Every request is paid' },
        ],
        hints: [
          'Read the float first, then read the requests with a while loop until there are no more lines.',
          'For each request: if it is more than the float, use break. Otherwise take it away from the float and add 1 to a counter.',
          'After the loop print the counter and the float left. Write "withdrawals" in the plural every time, as in the examples.',
        ],
      },
    ],
  },

  // ================================================================== 9
  {
    id: 'php-arrays',
    level: LEVEL,
    minutes: 28,
    title: 'Arrays',
    summary: 'Lists of values: creating, reading, adding, looping with foreach, explode and implode',
    blocks: [
      {
        t: 'story',
        title: "Nambi's drawer",
        text: "In Nambi's cash drawer the notes sit in slots: 50,000 in the first, 20,000 in the second, 10,000 in the third, and so on. She does not give each slot its own name. She says “the first slot”, “the third slot”. At the end of the day she also keeps a list of all customers served.\n\nUntil now, every value had its own variable. For a list of twenty customers that would mean twenty variables. An **array** keeps many values under one name, in order, and a loop can then walk through them.",
      },
      {
        t: 'try',
        code: php`<?php
$customers = ["Amina", "Brian", "Grace"];
echo $customers[0], "\n";
echo $customers[2], "\n";
echo count($customers), "\n";
`,
        output: out('Amina', 'Grace', '3'),
      },
      { t: 'p', text: 'Square brackets make the list. Each value has a position number called its **index**. Counting starts at **0**, just like `substr`: the first customer is `$customers[0]`, the third is `$customers[2]`. `count()` tells you how many values there are.' },
      { t: 'p', text: 'Add to the end with empty brackets `[]`, and change a value by assigning to its index:' },
      {
        t: 'try',
        code: php`<?php
$customers = ["Amina", "Brian"];
$customers[] = "Grace";
$customers[0] = "Aisha";
echo implode(", ", $customers), "\n";
echo count($customers), "\n";
`,
        output: out('Aisha, Brian, Grace', '3'),
      },
      { t: 'p', text: '`implode($glue, $array)` joins all values into one string with your separator between them.' },
      { t: 'h', text: 'foreach: visit every value' },
      { t: 'p', text: 'Most of the time you do not need the index at all, you just want each value in turn. `foreach` does exactly that, with no counter to get wrong:' },
      {
        t: 'try',
        code: php`<?php
$notes = [50000, 20000, 10000];
$total = 0;
foreach ($notes as $note) {
    $total += $note;
    echo "Note: ", number_format($note), "\n";
}
echo "Total: ", number_format($total), "\n";
`,
        output: out('Note: 50,000', 'Note: 20,000', 'Note: 10,000', 'Total: 80,000'),
      },
      { t: 'p', text: 'When you also need the position, write `$index => $value`:' },
      {
        t: 'try',
        code: php`<?php
$customers = ["Amina", "Brian", "Grace"];
foreach ($customers as $i => $name) {
    echo $i + 1, ". ", $name, "\n";
}
`,
        output: out('1. Amina', '2. Brian', '3. Grace'),
      },
      { t: 'h', text: 'Peeking inside an array' },
      { t: 'p', text: '`echo` cannot print a whole array. To look at one while you are working, use `print_r()` (or `var_dump()`). The numbers in square brackets are the indexes.' },
      {
        t: 'try',
        code: php`<?php
$customers = ["Amina", "Brian"];
print_r($customers);
`,
        output: out('Array', '(', '    [0] => Amina', '    [1] => Brian', ')'),
      },
      { t: 'h', text: 'explode: from a line of text to an array' },
      { t: 'p', text: 'Input often arrives as one line with values separated by commas, like `Amina,withdraw,120000`. `explode(",", $line)` cuts the text at every comma and gives you an array of the pieces. It is the opposite of `implode`.' },
      {
        t: 'try',
        code: php`<?php
$line = "Amina,withdraw,120000";
$parts = explode(",", $line);
echo $parts[0], " did a ", $parts[1], " of UGX ", number_format((int) $parts[2]), "\n";
echo count($parts), "\n";
echo implode(" | ", $parts), "\n";
`,
        output: out('Amina did a withdraw of UGX 120,000', '3', 'Amina | withdraw | 120000'),
      },
      {
        t: 'predict',
        code: php`<?php
$a = [10, 20, 30];
echo $a[1] + $a[2];
`,
        question: 'What does this program print?',
        options: ['50', '40', '30', '60'],
        answer: 0,
        explain: 'Index 1 is the second value (20) and index 2 is the third (30). 20 + 30 = 50. Counting from 0 is the part that trips everybody up at first.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the loop that visits every value of an array.',
        template: php`<?php
$notes = [5, 10];
___ ($notes as $note) {
    echo $note, "\n";
}
`,
        blanks: [{ options: ['foreach', 'for', 'while'], answer: 'foreach' }],
        output: out('5', '10'),
      },
      {
        t: 'bug',
        code: php`<?php
$names = ["Amina" "Brian", "Grace"];
echo count($names), "\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['A comma is missing between "Amina" and "Brian"', 'Arrays must use curly brackets', 'count cannot be used on names', 'The first item must be a number'],
        answer: 0,
        explain: 'Items in an array are separated by commas. With no comma between the first two, PHP sees two pieces of text side by side and does not know what you mean.',
        fixed: php`<?php
$names = ["Amina", "Brian", "Grace"];
echo count($names), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program makes a list of two items, adds a third, and prints how many there are.',
        lines: ['<?php', '$items = ["sugar", "rice"];', '$items[] = "soap";', 'echo count($items), "\\n";'],
        output: '3\n',
      },
      {
        t: 'quiz',
        question: 'What is the index of the FIRST value in an array?',
        options: ['0', '1', '-1', 'It has no index'],
        answer: 0,
        explain: 'Counting in PHP (and in almost every language) starts at 0. An array of 3 values has the indexes 0, 1 and 2, and no index 3.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$names = ["Amina" "Brian"];`, why: 'A comma is missing between the items.', right: php`<?php
$names = ["Amina", "Brian"];` },
          { wrong: php`<?php
echo count("Amina");`, why: 'count() counts the items of an array. “Amina” is text, so PHP 8 stops with a TypeError.', right: php`<?php
echo count(["Amina"]);` },
          { wrong: php`<?php
$names = ["Amina", "Brian"];
echo $names[2];`, why: 'No error stops the program, only a warning “Undefined array key 2”, because with two items the indexes are 0 and 1. The last index is count minus one.', right: php`<?php
$names = ["Amina", "Brian"];
echo $names[1];`, logic: true },
          { wrong: php`<?php
$names = ["Amina", "Brian"];
echo $names;`, why: 'echo cannot print a whole array. PHP warns “Array to string conversion” and prints the word Array. Use implode to join the items, or print_r to look inside.', right: php`<?php
$names = ["Amina", "Brian"];
echo implode(", ", $names);`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`$list = ["a", "b", "c"];` makes an array. Indexes start at 0. `count($list)` says how many.',
          '`$list[] = "d";` adds at the end. `$list[0] = "x";` changes the first value.',
          '`foreach ($list as $item)` visits every value. `foreach ($list as $i => $item)` gives the index too.',
          '`implode(", ", $list)` joins to text. `explode(",", $text)` cuts text into an array. `print_r($list)` shows what is inside.',
          'The last valid index is `count($list) - 1`.',
        ],
        memory: 'Index from 0. foreach visits all. explode cuts. implode joins.',
      },
    ],
    exercises: [
      {
        id: 'php9-roll-call',
        title: 'Roll call',
        prompt: 'The input is a list of customer names, one per line. Print how many there are and the names joined with a comma and a space:\n\n`Customers (3): Amina, Brian, Grace`',
        starter: php`<?php
$names = [];
// read every line of input into the array
`,
        usesInput: true,
        sampleInput: 'Amina\nBrian\nGrace\n',
        tests: [
          { input: 'Amina\nBrian\nGrace\n', expected: 'Customers (3): Amina, Brian, Grace' },
          { input: 'Aisha\n', expected: 'Customers (1): Aisha', hidden: true, name: 'One customer' },
          { input: 'Dan\nEve\nFaith\nGideon\nHope\n', expected: 'Customers (5): Dan, Eve, Faith, Gideon, Hope', hidden: true, name: 'Five customers' },
        ],
        hints: [
          'Read with while (($line = fgets(STDIN)) !== false) and add each trimmed line to the array with $names[] = ...',
          'After the loop, count($names) is the number of customers and implode(", ", $names) joins them.',
          'Print the pieces in this order: "Customers (", the count, "): ", the joined names.',
        ],
      },
      {
        id: 'php9-numbered',
        title: 'A numbered list',
        prompt: 'The input is ONE line with customer names separated by commas, like `Amina,Brian,Grace`. Print them as a numbered list:\n\n`1. Amina`\n`2. Brian`\n`3. Grace`',
        starter: php`<?php
$line = trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: 'Amina,Brian,Grace\n',
        tests: [
          { input: 'Amina,Brian,Grace\n', expected: out('1. Amina', '2. Brian', '3. Grace') },
          { input: 'Aisha\n', expected: '1. Aisha', hidden: true, name: 'One name' },
          { input: 'Dan,Eve,Faith,Gideon\n', expected: out('1. Dan', '2. Eve', '3. Faith', '4. Gideon'), hidden: true, name: 'Four names' },
        ],
        hints: [
          'Cut the line into an array of names with explode.',
          'foreach with $i => $name gives you the position and the name together.',
          'The list starts at 1 but indexes start at 0, so print $i + 1.',
        ],
      },
      {
        id: 'php9-banknotes',
        title: 'Count the banknotes',
        prompt: 'Nambi pays out with notes of 50,000, 20,000, 10,000, 5,000, 2,000 and 1,000 (biggest first). Read an amount and print how many of each note she needs, using as few notes as possible. Skip notes that are not needed. If a remainder below 1,000 is left, print it last.\n\n`UGX 50,000 x 3`\n`UGX 20,000 x 1`\n`Left over: UGX 500`',
        starter: php`<?php
$amount = (int) trim(fgets(STDIN));
$notes = [50000, 20000, 10000, 5000, 2000, 1000];
`,
        usesInput: true,
        sampleInput: '187000\n',
        tests: [
          { input: '187000\n', expected: out('UGX 50,000 x 3', 'UGX 20,000 x 1', 'UGX 10,000 x 1', 'UGX 5,000 x 1', 'UGX 2,000 x 1') },
          { input: '187500\n', expected: out('UGX 50,000 x 3', 'UGX 20,000 x 1', 'UGX 10,000 x 1', 'UGX 5,000 x 1', 'UGX 2,000 x 1', 'Left over: UGX 500'), hidden: true, name: 'With a remainder' },
          { input: '1000\n', expected: 'UGX 1,000 x 1', hidden: true, name: 'A single note' },
          { input: '99000\n', expected: out('UGX 50,000 x 1', 'UGX 20,000 x 2', 'UGX 5,000 x 1', 'UGX 2,000 x 2'), hidden: true, name: 'Several kinds, some skipped' },
          { input: '300\n', expected: 'Left over: UGX 300', hidden: true, name: 'Less than one note' },
        ],
        hints: [
          'Go through the notes from the biggest to the smallest with foreach. For each note find how many fit into what is left.',
          'intdiv($left, $note) is how many of that note. Then $left %= $note keeps what remains. Print only when the count is above 0.',
          'After the loop, if $left is more than 0, print the Left over line.',
        ],
      },
      {
        id: 'php9-reverse',
        title: 'Newest first',
        prompt: 'The first input line is N, then N amounts, one per line. Print the amounts in **reverse order**, on one line, separated by spaces.\n\nFor `3`, `100`, `250`, `75` print `75 250 100`.',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$amounts = [];
// read the N amounts into the array, then print them backwards
`,
        usesInput: true,
        sampleInput: '3\n100\n250\n75\n',
        tests: [
          { input: '3\n100\n250\n75\n', expected: '75 250 100' },
          { input: '1\n5000\n', expected: '5000', hidden: true, name: 'One amount' },
          { input: '5\n10\n20\n30\n40\n50\n', expected: '50 40 30 20 10', hidden: true, name: 'Five amounts' },
        ],
        hints: [
          'Fill the array with a for loop of N rounds, one fgets per round.',
          'The last index is count($amounts) - 1. A for loop can count downwards from there to 0.',
          'Collect the printed pieces in a second array and join them with implode(" ", ...), or print a space only between items.',
        ],
      },
    ],
  },

  // ================================================================== 10
  {
    id: 'php-assoc',
    level: LEVEL,
    minutes: 28,
    title: 'Associative arrays',
    summary: 'Arrays with names instead of numbers, counting with them, and lists of records',
    blocks: [
      {
        t: 'story',
        title: 'The price list on the wall',
        text: "On Nambi's wall hangs a price list: sugar 4,500, rice 3,000, soap 2,500. A customer asks “how much is the rice?” and nobody answers “the second item”. They look up the **name** and read the price next to it.\n\nAn **associative array** works like that price list. Instead of numbered positions it has **keys** (names) and each key points to a **value**. The arrow `=>` joins them.",
      },
      {
        t: 'try',
        code: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000, "soap" => 2500];
echo $prices["rice"], "\n";
$prices["salt"] = 1000;
$prices["sugar"] = 4800;
echo count($prices), "\n";
echo $prices["sugar"], "\n";
`,
        output: out('3000', '4', '4800'),
      },
      { t: 'p', text: 'To read a value you give its key in square brackets. Assigning to a key that does not exist yet adds it, and assigning to an existing key replaces the value. Keys that are text need quotes, like any text.' },
      {
        t: 'try',
        code: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000, "soap" => 2500];
foreach ($prices as $item => $price) {
    echo ucfirst($item), ": UGX ", number_format($price), "\n";
}
`,
        output: out('Sugar: UGX 4,500', 'Rice: UGX 3,000', 'Soap: UGX 2,500'),
      },
      { t: 'p', text: '`foreach ($array as $key => $value)` gives both. Items stay in the order they were added.' },
      { t: 'h', text: 'Is the key there?' },
      { t: 'p', text: 'Reading a key that does not exist gives a warning and an empty value. Ask first with `isset()`, or give a fallback with `??`, which you met in lesson 6:' },
      {
        t: 'try',
        code: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000];
var_dump(isset($prices["rice"]));
var_dump(isset($prices["salt"]));
echo $prices["salt"] ?? "not stocked", "\n";
`,
        output: out('bool(true)', 'bool(false)', 'not stocked'),
      },
      { t: 'h', text: 'Counting things (the tally pattern)' },
      { t: 'p', text: 'A very common job: how many times does each word appear? Use the word as the key and the count as the value. `($counts[$word] ?? 0) + 1` means “the count so far, or 0 if I have not seen this word yet, plus one”.' },
      {
        t: 'try',
        stdin: 'mtn\nairtel\nmtn\nmtn\nairtel\n',
        code: php`<?php
$counts = [];
while (($line = fgets(STDIN)) !== false) {
    $network = trim($line);
    $counts[$network] = ($counts[$network] ?? 0) + 1;
}
foreach ($counts as $network => $n) {
    echo $network, ": ", $n, "\n";
}
`,
        output: out('mtn: 3', 'airtel: 2'),
      },
      { t: 'h', text: 'A list of records' },
      { t: 'p', text: 'The values of an array can themselves be arrays. A list of associative arrays is how programs keep **records**, such as the day’s transactions. Each record has the same keys, and a `foreach` visits one record at a time.' },
      {
        t: 'try',
        code: php`<?php
$transactions = [
    ["name" => "Amina", "type" => "withdraw", "amount" => 120000],
    ["name" => "Brian", "type" => "deposit", "amount" => 35000],
];
foreach ($transactions as $tx) {
    echo $tx["name"], " ", $tx["type"], " UGX ", number_format($tx["amount"]), "\n";
}
echo count($transactions), "\n";
`,
        output: out('Amina withdraw UGX 120,000', 'Brian deposit UGX 35,000', '2'),
      },
      { t: 'tip', text: "To remove a key, use `unset($prices[\"salt\"]);`. And a key can hold any value, including another array, so records can have lists inside them." },
      {
        t: 'predict',
        code: php`<?php
$stock = ["sugar" => 12, "rice" => 0];
$stock["rice"] += 20;
$stock["soap"] = 5;
echo $stock["rice"] + count($stock);
`,
        question: 'What does this program print?',
        options: ['23', '20', '3', '25'],
        answer: 0,
        explain: 'rice becomes 0 + 20 = 20. soap is added, so the array has 3 keys (sugar, rice, soap). 20 + 3 = 23.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the key that finds the price of rice.',
        template: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000];
echo $prices[___], "\n";
`,
        blanks: [{ options: ['"rice"', 'rice', '1'], answer: '"rice"' }],
        output: '3000\n',
      },
      {
        t: 'bug',
        code: php`<?php
$prices = ["sugar" => 4500, "rice" = 3000];
echo count($prices), "\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['The second pair uses = where the arrow => is needed', 'Keys cannot be text', 'count cannot be used on prices', 'The array needs curly brackets'],
        answer: 0,
        explain: 'Inside an array, a key and its value are joined by the arrow `=>`. A single `=` is for putting a value into a variable, and PHP does not accept it here.',
        fixed: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000];
echo count($prices), "\n";
`,
      },
      {
        t: 'quiz',
        question: 'What does `$prices["salt"] ?? 0` give when there is no "salt" key?',
        options: ['0, quietly, with no warning', 'A warning and an empty value', 'It stops the program', 'null'],
        answer: 0,
        explain: 'The ?? operator is made for exactly this: if the key is missing it gives the fallback and does not complain. That is what makes the tally pattern work.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$prices = ["sugar" = 4500];`, why: 'Key and value are joined by the arrow =>, not by =.', right: php`<?php
$prices = ["sugar" => 4500];` },
          { wrong: php`<?php
$prices = ["sugar" => 4500];
echo $prices[sugar];`, why: 'A text key needs quotes. Without them PHP looks for a constant named sugar and stops with “Undefined constant”.', right: php`<?php
$prices = ["sugar" => 4500];
echo $prices["sugar"];` },
          { wrong: php`<?php
$prices = ["sugar" => 4500];
echo $prices["salt"];`, why: 'No fatal error, but a warning “Undefined array key”, and nothing is printed. Check with isset or use ?? with a fallback.', right: php`<?php
$prices = ["sugar" => 4500];
echo $prices["salt"] ?? "not stocked";`, logic: true },
          { wrong: php`<?php
$counts = [];
$counts["mtn"]++;
echo $counts["mtn"];`, why: 'PHP warns “Undefined array key” first, because the key did not exist yet, and only then counts. The tally pattern with ?? avoids the warning.', right: php`<?php
$counts = [];
$counts["mtn"] = ($counts["mtn"] ?? 0) + 1;
echo $counts["mtn"];`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`["key" => value]` makes an associative array. Read with `$a["key"]`, add or change with `$a["key"] = ...`.',
          '`foreach ($a as $key => $value)` visits every pair, in the order they were added.',
          '`isset($a["key"])` asks if a key exists. `$a["key"] ?? fallback` reads it safely.',
          'Tally: `$counts[$word] = ($counts[$word] ?? 0) + 1;`.',
          'A list of associative arrays is a list of records: `$tx["name"]`, `$tx["amount"]`.',
        ],
        memory: 'key => value. ?? is the safety net. A list of those is records.',
      },
    ],
    exercises: [
      {
        id: 'php10-price-check',
        title: 'Price check',
        prompt: 'The shop sells sugar (4,500), rice (3,000), soap (2,500) and salt (1,000). Read an item name and print `Rice: UGX 3,000` (first letter in a capital, price with commas). If the shop does not sell it, print `Not stocked: oil` with the word that was asked for.',
        starter: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000, "soap" => 2500, "salt" => 1000];
$item = strtolower(trim(fgets(STDIN)));
`,
        usesInput: true,
        sampleInput: 'rice\n',
        tests: [
          { input: 'rice\n', expected: 'Rice: UGX 3,000' },
          { input: 'Sugar\n', expected: 'Sugar: UGX 4,500', hidden: true, name: 'A capital letter in the input' },
          { input: 'oil\n', expected: 'Not stocked: oil', hidden: true, name: 'Not on the list' },
          { input: 'SALT\n', expected: 'Salt: UGX 1,000', hidden: true, name: 'All capitals' },
        ],
        hints: [
          'The starter already makes the input small letters, so you can use it as a key.',
          'Ask first with isset($prices[$item]). If it is there, print the item and its price, otherwise print the Not stocked line.',
          'ucfirst($item) gives the capital letter and number_format($prices[$item]) the commas.',
        ],
      },
      {
        id: 'php10-tally',
        title: 'Count the networks',
        prompt: 'The input is a list of network names, one per line (`mtn`, `airtel`, …), one for each customer served. Print how many customers each network had, one network per line, in the order each network first appeared:\n\n`mtn: 3`\n`airtel: 2`',
        starter: php`<?php
$counts = [];
`,
        usesInput: true,
        sampleInput: 'mtn\nairtel\nmtn\nmtn\nairtel\n',
        tests: [
          { input: 'mtn\nairtel\nmtn\nmtn\nairtel\n', expected: out('mtn: 3', 'airtel: 2') },
          { input: 'airtel\n', expected: 'airtel: 1', hidden: true, name: 'One customer' },
          { input: 'africell\nmtn\nafricell\nairtel\nmtn\nafricell\n', expected: out('africell: 3', 'mtn: 2', 'airtel: 1'), hidden: true, name: 'Three networks' },
        ],
        hints: [
          'Read every line, trim it, and use the network name as the key of the array.',
          'The tally pattern: $counts[$network] = ($counts[$network] ?? 0) + 1;',
          'After the loop, a foreach with $network => $n prints each pair as "network: n".',
        ],
      },
      {
        id: 'php10-stock-value',
        title: 'Value of the stock',
        prompt: 'The prices are fixed in the program. The input has three numbers: how many bags of sugar, rice and soap are in the shop (one per line). Print one line for each item and then the total value of the stock, with commas:\n\n`Sugar: 12 x UGX 4,500 = UGX 54,000`\n`Rice: 8 x UGX 3,000 = UGX 24,000`\n`Soap: 20 x UGX 2,500 = UGX 50,000`\n`Stock value: UGX 128,000`',
        starter: php`<?php
$prices = ["sugar" => 4500, "rice" => 3000, "soap" => 2500];
$quantities = [];
foreach ($prices as $item => $price) {
    $quantities[$item] = (int) trim(fgets(STDIN));
}
`,
        usesInput: true,
        sampleInput: '12\n8\n20\n',
        tests: [
          {
            input: '12\n8\n20\n',
            expected: out(`Sugar: 12 x UGX ${money(4500)} = UGX ${money(12 * 4500)}`, `Rice: 8 x UGX ${money(3000)} = UGX ${money(8 * 3000)}`, `Soap: 20 x UGX ${money(2500)} = UGX ${money(20 * 2500)}`, `Stock value: UGX ${money(12 * 4500 + 8 * 3000 + 20 * 2500)}`),
          },
          {
            input: '0\n1\n0\n',
            expected: out('Sugar: 0 x UGX 4,500 = UGX 0', 'Rice: 1 x UGX 3,000 = UGX 3,000', 'Soap: 0 x UGX 2,500 = UGX 0', 'Stock value: UGX 3,000'),
            hidden: true,
            name: 'Mostly empty shelves',
          },
        ],
        hints: [
          'The starter has already read the quantities into an array that uses the same keys as the prices.',
          'Loop over $prices with $item => $price. The line value is $price * $quantities[$item].',
          'Keep a $total that grows by the line value each round, and print it after the loop. ucfirst($item) gives the capital letter.',
        ],
      },
      {
        id: 'php10-big-ones',
        title: 'The big transactions',
        prompt: 'The first input line is N. The next N lines are transactions in the form `name,service,amount`. Print the transactions of **100,000 or more** in the order they came, as `Amina: UGX 120,000`. If there is none, print `No big transactions`.',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$transactions = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $transactions[] = ["name" => $parts[0], "service" => $parts[1], "amount" => (int) $parts[2]];
}
`,
        usesInput: true,
        sampleInput: '4\nAmina,withdraw,120000\nBrian,deposit,35000\nGrace,withdraw,800000\nDan,deposit,99999\n',
        tests: [
          { input: '4\nAmina,withdraw,120000\nBrian,deposit,35000\nGrace,withdraw,800000\nDan,deposit,99999\n', expected: out('Amina: UGX 120,000', 'Grace: UGX 800,000') },
          { input: '2\nBrian,deposit,35000\nDan,deposit,99999\n', expected: 'No big transactions', hidden: true, name: 'Nothing big' },
          { input: '3\nEve,deposit,100000\nFaith,withdraw,100000\nHope,deposit,100001\n', expected: out('Eve: UGX 100,000', 'Faith: UGX 100,000', 'Hope: UGX 100,001'), hidden: true, name: 'Exactly 100,000 counts' },
        ],
        hints: [
          'The starter has already built the list of records. Loop over it and look at $tx["amount"].',
          'Print the matching ones inside the loop, and remember with a counter or a true/false variable that you printed at least one.',
          'After the loop, if nothing was printed, print No big transactions.',
        ],
      },
    ],
  },
];
