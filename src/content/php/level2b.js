// PHP, Level 2: Loops and arrays. Lessons 11 to 13 (array functions, map/filter, the daily summary project).
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, txInput, summaryLines, ranking, boothFee } from './shared.js';

const LEVEL = 'Level 2: Loops and arrays';

// Sample day used by several tests: [name, service, amount]
const DAY = [
  ['Amina', 'withdraw', 120000],
  ['Brian', 'deposit', 35000],
  ['Grace', 'withdraw', 800000],
  ['Amina', 'deposit', 50000],
  ['Dan', 'deposit', 15000],
];

export const level2b = [
  // ================================================================== 11
  {
    id: 'php-array-fn',
    level: LEVEL,
    minutes: 28,
    title: 'Array functions',
    summary: 'Totals, highest and lowest, searching, sorting and slicing lists',
    blocks: [
      {
        t: 'story',
        title: 'Closing the books',
        text: "At six o'clock Nambi closes the booth and counts the day. How many customers? What was the total? The biggest withdrawal? Who were the three best customers? She used to do it on the back of an exercise book, and some days the numbers did not agree.\n\nPHP has a toolbox for arrays so you never have to write these loops by hand. This lesson is the toolbox. You will open it every working day.",
      },
      { t: 'h', text: 'Totals, highest and lowest' },
      {
        t: 'try',
        code: php`<?php
$amounts = [120000, 35000, 800000, 50000];
echo "Count: ", count($amounts), "\n";
echo "Total: ", number_format(array_sum($amounts)), "\n";
echo "Average: ", number_format(array_sum($amounts) / count($amounts)), "\n";
echo "Highest: ", number_format(max($amounts)), "\n";
echo "Lowest: ", number_format(min($amounts)), "\n";
`,
        output: out('Count: 4', 'Total: 1,005,000', 'Average: 251,250', 'Highest: 800,000', 'Lowest: 35,000'),
      },
      { t: 'p', text: '`max` and `min` (which you met for two numbers) also accept a whole array. There is no built-in “average”: it is the sum divided by the count.' },
      { t: 'h', text: 'Is it there? Where is it?' },
      {
        t: 'try',
        code: php`<?php
$networks = ["mtn", "airtel", "africell"];
var_dump(in_array("airtel", $networks));
var_dump(in_array("orange", $networks));
echo array_search("africell", $networks), "\n";
var_dump(array_search("orange", $networks));
`,
        output: out('bool(true)', 'bool(false)', '2', 'bool(false)'),
      },
      { t: 'p', text: '`in_array` answers yes or no. `array_search` gives the **index** (or the key) where the value is, or `false` if it is not there. Add `true` as a third argument to compare strictly, with the same rule as `===`:' },
      {
        t: 'try',
        code: php`<?php
var_dump(in_array("1", [1, 2, 3]));
var_dump(in_array("1", [1, 2, 3], true));
`,
        output: out('bool(true)', 'bool(false)'),
      },
      { t: 'h', text: 'Sorting' },
      {
        t: 'try',
        code: php`<?php
$amounts = [50000, 10000, 30000];
sort($amounts);
echo implode(", ", $amounts), "\n";
rsort($amounts);
echo implode(", ", $amounts), "\n";
`,
        output: out('10000, 30000, 50000', '50000, 30000, 10000'),
      },
      { t: 'p', text: '`sort` puts the smallest first, `rsort` the biggest first. When the array has keys that matter (names, for example), use the versions that **keep the keys**: `asort` and `arsort` sort by value, `ksort` and `krsort` sort by key.' },
      {
        t: 'try',
        code: php`<?php
$totals = ["Brian" => 35000, "Amina" => 170000, "Grace" => 800000];
arsort($totals);
foreach ($totals as $name => $total) {
    echo $name, ": ", number_format($total), "\n";
}
ksort($totals);
echo implode(", ", array_keys($totals)), "\n";
`,
        output: out('Grace: 800,000', 'Amina: 170,000', 'Brian: 35,000', 'Amina, Brian, Grace'),
      },
      { t: 'tip', text: "`array_keys($a)` gives the keys and `array_values($a)` gives the values, each as a plain list. Sorting changes the array itself and returns `true`, so write `sort($a);` and not `$a = sort($a);`. Sorting is stable: values that are equal stay in the order they had, which is why sorting by name first and then by value gives “biggest first, ties by name”." },
      { t: 'h', text: 'Cutting and joining' },
      {
        t: 'try',
        code: php`<?php
$top = array_slice([800000, 170000, 35000, 15000], 0, 3);
echo implode(", ", $top), "\n";
$all = array_merge([1, 2], [3, 4]);
echo implode(", ", array_reverse($all)), "\n";
echo implode(", ", array_unique(["mtn", "airtel", "mtn"])), "\n";
echo implode(" ", range(1, 5)), "\n";
echo implode(", ", range(10000, 50000, 10000)), "\n";
`,
        output: out('800000, 170000, 35000', '4, 3, 2, 1', 'mtn, airtel', '1 2 3 4 5', '10000, 20000, 30000, 40000, 50000'),
      },
      {
        t: 'list',
        items: [
          '`array_slice($a, $start, $length)` takes a piece. If there are fewer values than you ask for, you simply get what there is.',
          '`array_merge($a, $b)` joins lists. `array_reverse($a)` turns one around.',
          '`array_unique($a)` removes repeats and keeps the first of each.',
          '`range(1, 5)` or `range(10000, 50000, 10000)` makes a list of numbers for you.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
$a = [3, 1, 2];
sort($a);
echo $a[0], $a[2];
`,
        question: 'What does this program print?',
        options: ['13', '31', '12', '32'],
        answer: 0,
        explain: 'After sort the array is [1, 2, 3]. $a[0] is 1 and $a[2] is 3, and echo prints them one after the other: 13.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that adds up all the values of an array.',
        template: php`<?php
$notes = [5, 10, 20];
echo ___($notes), "\n";
`,
        blanks: [{ options: ['array_sum', 'count', 'max'], answer: 'array_sum' }],
        output: '35\n',
      },
      {
        t: 'bug',
        code: php`<?php
echo array_sum(5), "\n";
`,
        question: 'This program stops with a “TypeError”. What is wrong?',
        options: ['array_sum needs an array, and 5 is a single number', 'array_sum can only add two numbers', 'echo cannot print a sum', 'The 5 must be written in quotes'],
        answer: 0,
        explain: 'The array functions work on arrays. A single number is not a list, so PHP 8 stops with a TypeError that names the function and says what it received. Put the value in an array: [5].',
        fixed: php`<?php
echo array_sum([5]), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program sorts three amounts and prints them from smallest to biggest.',
        lines: ['<?php', '$a = [30, 10, 20];', 'sort($a);', 'echo implode(", ", $a), "\\n";'],
        output: '10, 20, 30\n',
      },
      {
        t: 'quiz',
        question: 'Which function sorts by value, biggest first, and keeps the keys?',
        options: ['arsort', 'rsort', 'ksort', 'sort'],
        answer: 0,
        explain: 'a means “keep the association between key and value”, r means reversed (biggest first). arsort is both. rsort has the order but throws the keys away, ksort sorts by key, and sort is smallest first without keys.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$a = [3, 1, 2];
$sorted = sort($a);
echo count($sorted);`, why: 'sort changes $a itself and returns only true. $sorted is a bool, and count() stops with a TypeError.', right: php`<?php
$a = [3, 1, 2];
sort($a);
echo count($a);` },
          { wrong: php`<?php
echo max([]);`, why: 'The highest of nothing does not exist. PHP 8 stops with a ValueError. Check that the array has something in it before asking for max or min.', right: php`<?php
$a = [];
echo count($a) > 0 ? max($a) : "no amounts";` },
          { wrong: php`<?php
$networks = ["mtn", "airtel"];
if (array_search("mtn", $networks)) {
    echo "found";
} else {
    echo "not found";
}`, why: 'No error, but a wrong answer: mtn is at index 0, and 0 counts as false in an if. array_search returns false only when the value is missing, so compare with !== false.', right: php`<?php
$networks = ["mtn", "airtel"];
if (array_search("mtn", $networks) !== false) {
    echo "found";
} else {
    echo "not found";
}`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`count`, `array_sum`, `max`, `min` give the numbers of the day. Average = `array_sum($a) / count($a)`.',
          '`in_array` asks yes or no (add `true` for strict). `array_search` gives the index, or `false`, so compare with `!== false`.',
          '`sort`/`rsort` for values, `asort`/`arsort` keep keys, `ksort`/`krsort` by key. They change the array and return `true`.',
          '`array_slice`, `array_merge`, `array_reverse`, `array_unique`, `range`, `array_keys`, `array_values`.',
        ],
        memory: 'sum, max, min, count. sort and keep keys with a. search can return 0.',
      },
    ],
    exercises: [
      {
        id: 'php11-stats',
        title: 'The numbers of the day',
        prompt: 'The input is ONE line of amounts separated by commas. Print:\n\n`Count: 4`\n`Total: UGX 1,005,000`\n`Average: UGX 251,250`\n`Highest: UGX 800,000`\n`Lowest: UGX 35,000`\n\nThe average is rounded to a whole shilling by number_format.',
        starter: php`<?php
$parts = explode(",", trim(fgets(STDIN)));
`,
        usesInput: true,
        sampleInput: '120000,35000,800000,50000\n',
        tests: [
          { input: '120000,35000,800000,50000\n', expected: out('Count: 4', 'Total: UGX 1,005,000', 'Average: UGX 251,250', 'Highest: UGX 800,000', 'Lowest: UGX 35,000') },
          { input: '5000\n', expected: out('Count: 1', 'Total: UGX 5,000', 'Average: UGX 5,000', 'Highest: UGX 5,000', 'Lowest: UGX 5,000'), hidden: true, name: 'One amount' },
          { input: '1000,2000,2000\n', expected: out('Count: 3', 'Total: UGX 5,000', 'Average: UGX 1,667', 'Highest: UGX 2,000', 'Lowest: UGX 1,000'), hidden: true, name: 'An average that is rounded' },
        ],
        hints: [
          'explode gave you pieces of text. Turn them into whole numbers (a loop with (int), or you can let array_sum, max and min work on them).',
          'count, array_sum, max and min give four of the lines. The average is array_sum($amounts) / count($amounts).',
          'Put number_format around every amount, and "UGX " in front. Count has no commas and no UGX.',
        ],
      },
      {
        id: 'php11-top3',
        title: 'The three biggest',
        prompt: 'The first input line is N, then N amounts, one per line. Print the three biggest, biggest first, as `1. UGX 800,000`. If there are fewer than three amounts, print as many as there are.',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$amounts = [];
for ($i = 0; $i < $n; $i++) {
    $amounts[] = (int) trim(fgets(STDIN));
}
`,
        usesInput: true,
        sampleInput: '4\n120000\n35000\n800000\n50000\n',
        tests: [
          { input: '4\n120000\n35000\n800000\n50000\n', expected: out('1. UGX 800,000', '2. UGX 120,000', '3. UGX 50,000') },
          { input: '2\n10000\n5000\n', expected: out('1. UGX 10,000', '2. UGX 5,000'), hidden: true, name: 'Fewer than three' },
          { input: '5\n1000\n1000\n1000\n1000\n1000\n', expected: out('1. UGX 1,000', '2. UGX 1,000', '3. UGX 1,000'), hidden: true, name: 'All equal' },
        ],
        hints: [
          'rsort puts the biggest first.',
          'array_slice($amounts, 0, 3) takes the first three (or fewer, if there are not three).',
          'foreach with $i => $amount, and print $i + 1 for the position.',
        ],
      },
      {
        id: 'php11-leaderboard',
        title: 'Best customers',
        prompt: 'The first input line is N, then N transactions as `name,service,amount`. Add up what each customer moved in total (deposits and withdrawals both count) and print the customers from the biggest total to the smallest. If two customers have the same total, the name that comes first in the alphabet goes first.\n\n`1. Grace: UGX 800,000`',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$totals = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
}
`,
        usesInput: true,
        sampleInput: txInput(DAY),
        tests: [
          { input: txInput(DAY), expected: out(...ranking(DAY).map(([name, total], i) => `${i + 1}. ${name}: UGX ${money(total)}`)) },
          {
            input: txInput([['Eve', 'deposit', 50000], ['Dan', 'withdraw', 50000], ['Eve', 'deposit', 10000], ['Dan', 'deposit', 10000]]),
            expected: out('1. Dan: UGX 60,000', '2. Eve: UGX 60,000'),
            hidden: true,
            name: 'A tie',
          },
          { input: txInput([['Aisha', 'deposit', 5000]]), expected: '1. Aisha: UGX 5,000', hidden: true, name: 'One customer' },
        ],
        hints: [
          'The tally pattern: $totals[$name] = ($totals[$name] ?? 0) + (int) $parts[2]; with the name from $parts[0].',
          'Sort by name first with ksort, then by value with arsort. Equal totals stay in alphabetical order because sorting is stable.',
          'foreach ($totals as $name => $total) with a position counter that starts at 1.',
        ],
      },
      {
        id: 'php11-unique-sorted',
        title: 'Which networks?',
        prompt: 'The input is ONE line of network names separated by commas, with repeats (`mtn,airtel,mtn,africell,airtel`). Print each network once, in alphabetical order, with how many different ones there are:\n\n`Networks (3): africell, airtel, mtn`',
        starter: php`<?php
$networks = explode(",", trim(fgets(STDIN)));
`,
        usesInput: true,
        sampleInput: 'mtn,airtel,mtn,africell,airtel\n',
        tests: [
          { input: 'mtn,airtel,mtn,africell,airtel\n', expected: 'Networks (3): africell, airtel, mtn' },
          { input: 'airtel\n', expected: 'Networks (1): airtel', hidden: true, name: 'One network' },
          { input: 'mtn,mtn,mtn\n', expected: 'Networks (1): mtn', hidden: true, name: 'All the same' },
        ],
        hints: [
          'array_unique removes the repeats.',
          'sort puts what is left in alphabetical order (and numbers the list from 0 again).',
          'count gives how many, implode(", ", ...) joins them. Print "Networks (", the count, "): " and the list.',
        ],
      },
    ],
  },

  // ================================================================== 12
  {
    id: 'php-map-filter',
    level: LEVEL,
    minutes: 28,
    title: 'Map, filter, reduce',
    summary: 'Arrow functions, and transforming, selecting and sorting lists in one line',
    blocks: [
      {
        t: 'story',
        title: 'The same job for every note',
        text: "The network announces a small levy on every withdrawal. Nambi has twenty withdrawals on her list, and each one needs the same little calculation. She could do it twenty times by hand, or write the rule once and say “do this to every one”.\n\nThat is the idea of this lesson. You write a tiny function with no name, an **arrow function**, and hand it to `array_map`, `array_filter` or `usort`. They apply it to the whole list for you.",
      },
      { t: 'h', text: 'An arrow function' },
      { t: 'p', text: 'An arrow function starts with `fn`, lists its inputs in brackets, then `=>` and the **one expression** it gives back. There is no `return` and no curly brackets.' },
      {
        t: 'try',
        code: php`<?php
$amounts = [50000, 120000, 800000];
$fees = array_map(fn($amount) => intdiv($amount, 100), $amounts);
echo implode(", ", $fees), "\n";
`,
        output: '500, 1200, 8000\n',
      },
      { t: 'p', text: '`array_map` takes the function first and the array second, and gives back a **new** array with the function’s result for every value. The old array is untouched. An arrow function can read variables from outside it:' },
      {
        t: 'try',
        code: php`<?php
$rate = 2;
$doubled = array_map(fn($x) => $x * $rate, [10, 20]);
echo implode(", ", $doubled), "\n";
echo implode(", ", array_map("ucfirst", ["mtn", "airtel"])), "\n";
`,
        output: out('20, 40', 'Mtn, Airtel'),
      },
      { t: 'p', text: 'You can also give the **name** of an existing function as text, like `"ucfirst"` or `"trim"`.' },
      { t: 'h', text: 'array_filter: keep what passes' },
      {
        t: 'try',
        code: php`<?php
$amounts = [120000, 35000, 800000, 50000];
$big = array_filter($amounts, fn($a) => $a >= 100000);
print_r($big);
$big = array_values($big);
echo $big[1], "\n";
`,
        output: out('Array', '(', '    [0] => 120000', '    [2] => 800000', ')', '800000'),
      },
      { t: 'p', text: '`array_filter` keeps the values for which the function says `true`. Look at the keys in the output: it **keeps the original keys** (0 and 2). Wrap the result in `array_values` when you need a list numbered from 0 again.' },
      { t: 'h', text: 'array_reduce: many values into one' },
      {
        t: 'try',
        code: php`<?php
$total = array_reduce([100, 250, 75], fn($carry, $a) => $carry + $a, 0);
echo $total, "\n";
`,
        output: '425\n',
      },
      { t: 'p', text: 'The function gets the **running result** (`$carry`) and the next value. The last argument, 0, is where the running result starts. For plain adding, `array_sum` is shorter. `array_reduce` earns its place when each step needs more than an addition.' },
      { t: 'h', text: 'usort: sort in your own way' },
      { t: 'p', text: '`sort` only knows numbers and words. To sort **records**, tell PHP how to compare two of them. The function receives two records and answers a number: negative if the first should come first, 0 if equal, positive if the second should. The spaceship operator `<=>` gives exactly that:' },
      {
        t: 'try',
        code: php`<?php
echo 5 <=> 9, " ", 9 <=> 9, " ", 9 <=> 5, "\n";
$records = [
    ["name" => "Amina", "amount" => 120000],
    ["name" => "Grace", "amount" => 800000],
    ["name" => "Brian", "amount" => 35000],
];
usort($records, fn($a, $b) => $b["amount"] <=> $a["amount"]);
foreach ($records as $r) {
    echo $r["name"], ": ", number_format($r["amount"]), "\n";
}
`,
        output: out('-1 0 1', 'Grace: 800,000', 'Amina: 120,000', 'Brian: 35,000'),
      },
      { t: 'p', text: 'Writing `$b <=> $a` (swapped) puts the biggest first. To break ties, add `?:` and a second comparison: `$b["amount"] <=> $a["amount"] ?: $a["name"] <=> $b["name"]`. If the first comparison gives 0 (“equal”), the part after `?:` decides.' },
      { t: 'h', text: 'array_column: one field of every record' },
      {
        t: 'try',
        code: php`<?php
$records = [
    ["name" => "Amina", "amount" => 120000],
    ["name" => "Grace", "amount" => 800000],
    ["name" => "Brian", "amount" => 35000],
];
echo implode(", ", array_column($records, "name")), "\n";
echo array_sum(array_column($records, "amount")), "\n";
`,
        output: out('Amina, Grace, Brian', '955000'),
      },
      {
        t: 'predict',
        code: php`<?php
echo array_sum(array_map(fn($x) => $x * 2, [1, 2, 3]));
`,
        question: 'What does this program print?',
        options: ['12', '6', '14', '123'],
        answer: 0,
        explain: 'array_map doubles every value: [2, 4, 6]. array_sum adds them: 12. Read it from the inside out.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that makes a new array by applying a rule to every value.',
        template: php`<?php
echo implode(", ", ___(fn($x) => $x * 2, [1, 2, 3])), "\n";
`,
        blanks: [{ options: ['array_map', 'array_filter', 'array_sum'], answer: 'array_map' }],
        output: '2, 4, 6\n',
      },
      {
        t: 'bug',
        code: php`<?php
$doubled = array_map(fn($x) => return $x * 2, [1, 2]);
echo implode(", ", $doubled), "\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['An arrow function gives back its expression by itself: return must not be written', 'array_map needs the array first', 'fn must be written function', 'implode cannot join a doubled array'],
        answer: 0,
        explain: 'In an arrow function, whatever comes after => IS the result. return is for ordinary functions with curly brackets (lesson 14). Writing it here is a syntax error.',
        fixed: php`<?php
$doubled = array_map(fn($x) => $x * 2, [1, 2]);
echo implode(", ", $doubled), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program keeps only the even numbers and prints them.',
        lines: ['<?php', '$a = [1, 2, 3, 4];', '$even = array_filter($a, fn($x) => $x % 2 === 0);', 'echo implode(", ", $even), "\\n";'],
        output: '2, 4\n',
      },
      {
        t: 'quiz',
        question: 'array_filter keeps the original keys of the values it keeps. Which function numbers the result from 0 again?',
        options: ['array_values', 'array_keys', 'array_unique', 'sort_keys'],
        answer: 0,
        explain: 'array_values throws the keys away and gives a fresh list numbered 0, 1, 2 …. array_keys gives the keys themselves, as a list.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$d = array_map([1, 2, 3], fn($x) => $x * 2);`, why: 'The arguments are swapped. array_map wants the function first and the array second, and PHP 8 stops with a TypeError.', right: php`<?php
$d = array_map(fn($x) => $x * 2, [1, 2, 3]);` },
          { wrong: php`<?php
$d = array_filter([1, 2, 3], fn($x) => { return $x > 1; });`, why: 'An arrow function has no curly brackets. Write the expression after =>.', right: php`<?php
$d = array_filter([1, 2, 3], fn($x) => $x > 1);` },
          { wrong: php`<?php
$big = array_filter([35000, 120000], fn($a) => $a >= 100000);
echo $big[0];`, why: 'No fatal error, but a warning “Undefined array key 0” and an empty line: array_filter kept the key 1, not 0. Use array_values, or foreach.', right: php`<?php
$big = array_values(array_filter([35000, 120000], fn($a) => $a >= 100000));
echo $big[0];`, logic: true },
          { wrong: php`<?php
$total = 0;
array_map(fn($a) => $total += $a, [100, 200]);
echo $total;`, why: 'No error, but it prints 0. An arrow function takes a copy of outside variables, so it cannot change $total. Use array_sum or array_reduce, which give the result back.', right: php`<?php
echo array_sum([100, 200]);`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`fn($x) => expression` is a tiny function. The expression is the result, and it can read outside variables (as a copy).',
          '`array_map(fn, $a)` transforms every value. `array_filter($a, fn)` keeps the ones that pass, with their old keys. `array_values` renumbers.',
          '`array_reduce($a, fn($carry, $x) => ..., $start)` folds a list into one value.',
          '`usort($a, fn($x, $y) => $x["k"] <=> $y["k"])` sorts records. Swap x and y for biggest first; add `?:` for tie-breaks.',
          '`array_column($records, "field")` pulls one field out of every record.',
        ],
        memory: 'map changes, filter keeps, reduce folds, usort with <=>.',
      },
    ],
    exercises: [
      {
        id: 'php12-fees',
        title: 'The network levy',
        prompt: 'A made-up levy: for each withdrawal the network takes 2% of the amount (that is amount × 2 ÷ 100), **rounded up** to a whole shilling, and never less than 500. The first input line is N, then N amounts. Print every fee in one line, then the total:\n\n`Fees: 2,400, 701, 500`\n`Total fees: UGX 3,601`',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$amounts = [];
for ($i = 0; $i < $n; $i++) {
    $amounts[] = (int) trim(fgets(STDIN));
}
`,
        usesInput: true,
        sampleInput: '3\n120000\n35001\n20000\n',
        tests: [
          { input: '3\n120000\n35001\n20000\n', expected: out('Fees: 2,400, 701, 500', 'Total fees: UGX 3,601') },
          { input: '1\n100\n', expected: out('Fees: 500', 'Total fees: UGX 500'), hidden: true, name: 'The minimum applies' },
          { input: '2\n25000\n25001\n', expected: out('Fees: 500, 501', 'Total fees: UGX 1,001'), hidden: true, name: 'Rounding up at the edge' },
        ],
        hints: [
          'array_map with an arrow function turns the amounts into fees.',
          'For one amount: max(500, (int) ceil($amount * 2 / 100)). Multiply first, then divide, so the numbers stay exact.',
          'Format every fee with number_format (array_map again, or a loop), join with implode(", ", ...), and print the total with array_sum.',
        ],
      },
      {
        id: 'php12-big-sum',
        title: 'Big withdrawals',
        prompt: 'The first input line is N, then N transactions as `name,service,amount`. Count the **withdrawals of 100,000 or more** and add them up:\n\n`Big withdrawals: 2`\n`Total: UGX 920,000`',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$transactions = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $transactions[] = ["name" => $parts[0], "service" => $parts[1], "amount" => (int) $parts[2]];
}
`,
        usesInput: true,
        sampleInput: txInput([...DAY.slice(0, 3), ['Amina', 'deposit', 150000]]),
        tests: [
          { input: txInput([...DAY.slice(0, 3), ['Amina', 'deposit', 150000]]), expected: out('Big withdrawals: 2', 'Total: UGX 920,000') },
          { input: txInput([['Brian', 'deposit', 500000], ['Dan', 'withdraw', 99999]]), expected: out('Big withdrawals: 0', 'Total: UGX 0'), hidden: true, name: 'No big withdrawals' },
          { input: txInput([['Eve', 'withdraw', 100000]]), expected: out('Big withdrawals: 1', 'Total: UGX 100,000'), hidden: true, name: 'Exactly 100,000' },
        ],
        hints: [
          'array_filter with an arrow function that checks both the service and the amount (use &&).',
          'count() of the filtered array is the number of big withdrawals.',
          'array_column($big, "amount") gives the amounts, and array_sum adds them (an empty list adds up to 0).',
        ],
      },
      {
        id: 'php12-sort-records',
        title: 'The day, biggest first',
        prompt: 'The first input line is N, then N transactions as `name,service,amount`. Print them from the biggest amount to the smallest. When two have the same amount, the name that comes first in the alphabet goes first.\n\n`Grace withdraw UGX 800,000`',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$transactions = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $transactions[] = ["name" => $parts[0], "service" => $parts[1], "amount" => (int) $parts[2]];
}
`,
        usesInput: true,
        sampleInput: txInput([...DAY.slice(0, 3), ['Dan', 'deposit', 120000]]),
        tests: [
          {
            input: txInput([...DAY.slice(0, 3), ['Dan', 'deposit', 120000]]),
            expected: out('Grace withdraw UGX 800,000', 'Amina withdraw UGX 120,000', 'Dan deposit UGX 120,000', 'Brian deposit UGX 35,000'),
          },
          { input: txInput([['Aisha', 'deposit', 5000]]), expected: 'Aisha deposit UGX 5,000', hidden: true, name: 'One transaction' },
          {
            input: txInput([['Zed', 'deposit', 5000], ['Amy', 'withdraw', 5000], ['Mia', 'deposit', 5000]]),
            expected: out('Amy withdraw UGX 5,000', 'Mia deposit UGX 5,000', 'Zed deposit UGX 5,000'),
            hidden: true,
            name: 'All equal, so by name',
          },
        ],
        hints: [
          'usort sorts the records. The function gets two of them, $a and $b.',
          'Biggest first: $b["amount"] <=> $a["amount"]. For ties add ?: and compare the names the normal way: $a["name"] <=> $b["name"].',
          'After sorting, foreach and print name, service and the amount with number_format.',
        ],
      },
    ],
  },

  // ================================================================== 13
  {
    id: 'php-daily-summary',
    level: LEVEL,
    minutes: 35,
    title: "Project: the daily summary",
    summary: 'Level 2 together: read a day of transactions and print the booth’s closing report',
    blocks: [
      {
        t: 'story',
        title: 'Closing time, done by the machine',
        text: "Friday, six o'clock. Nambi's nephew has typed the day's transactions into the laptop, one line each: name, service, amount. Nambi does not want a list. She wants the report she used to write in her exercise book: how many, how much came in, how much went out, what she earned in fees, who the biggest customer was, and who came.\n\nIn lesson 7 the receipt handled one customer, and the fee rule was copied three times. Today the rule is written **once**, inside a loop that handles a whole day. You will build the program in four steps, and you can run every one.",
      },
      { t: 'h', text: 'One more tool: unpacking an array' },
      { t: 'p', text: 'Each input line looks like `Amina,withdraw,120000`. After `explode` you have an array of three pieces. PHP can drop them straight into three variables:' },
      {
        t: 'try',
        code: php`<?php
[$name, $service, $amount] = explode(",", "Amina,withdraw,120000");
echo $name, " / ", $service, " / ", $amount, "\n";
`,
        output: 'Amina / withdraw / 120000\n',
      },
      { t: 'p', text: 'The input is: first a line with how many transactions there are, then that many lines. The program keeps them as a list of records, like in lesson 10.' },
      { t: 'h', text: 'Step 1: read the day, count it' },
      {
        t: 'project',
        title: 'Summary, step 1: read and count',
        stdin: txInput(DAY),
        code: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

echo "DAILY SUMMARY - NAMBI'S MONEY BOOTH\n";
echo "Transactions : ", count($txs), "\n";
`,
        output: out(...summaryLines(DAY).slice(0, 2)),
      },
      { t: 'h', text: 'Step 2: money in, money out' },
      { t: 'p', text: 'One loop over the records. Deposits and withdrawals each have a counter and a running total. The loop is the same for 5 transactions or 5,000.' },
      {
        t: 'project',
        title: 'Summary, step 2: deposits and withdrawals',
        stdin: txInput(DAY),
        code: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$deposits = 0;
$depositTotal = 0;
$withdrawals = 0;
$withdrawalTotal = 0;
foreach ($txs as $tx) {
    if ($tx["service"] === "deposit") {
        $deposits++;
        $depositTotal += $tx["amount"];
    } else {
        $withdrawals++;
        $withdrawalTotal += $tx["amount"];
    }
}

echo "DAILY SUMMARY - NAMBI'S MONEY BOOTH\n";
echo "Transactions : ", count($txs), "\n";
echo "Deposits     : ", $deposits, " (UGX ", number_format($depositTotal), ")\n";
echo "Withdrawals  : ", $withdrawals, " (UGX ", number_format($withdrawalTotal), ")\n";
`,
        output: out(...summaryLines(DAY).slice(0, 4)),
      },
      { t: 'h', text: 'Step 3: the fees, written once' },
      { t: 'p', text: 'Deposits are free. Each withdrawal pays 1,000, 2,000 or 3,500 (the made-up table from lesson 7). The if / elseif / else chain now sits inside the loop, once, not copied once per customer.' },
      {
        t: 'project',
        title: 'Summary, step 3: fees earned',
        stdin: txInput(DAY),
        code: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$deposits = 0;
$depositTotal = 0;
$withdrawals = 0;
$withdrawalTotal = 0;
$fees = 0;
foreach ($txs as $tx) {
    if ($tx["service"] === "deposit") {
        $deposits++;
        $depositTotal += $tx["amount"];
    } else {
        $withdrawals++;
        $withdrawalTotal += $tx["amount"];
        if ($tx["amount"] <= 50000) {
            $fees += 1000;
        } elseif ($tx["amount"] <= 200000) {
            $fees += 2000;
        } else {
            $fees += 3500;
        }
    }
}

echo "DAILY SUMMARY - NAMBI'S MONEY BOOTH\n";
echo "Transactions : ", count($txs), "\n";
echo "Deposits     : ", $deposits, " (UGX ", number_format($depositTotal), ")\n";
echo "Withdrawals  : ", $withdrawals, " (UGX ", number_format($withdrawalTotal), ")\n";
echo "Fees earned  : UGX ", number_format($fees), "\n";
`,
        output: out(...summaryLines(DAY).slice(0, 5)),
      },
      { t: 'h', text: 'Step 4: the biggest, and who came' },
      { t: 'p', text: 'The biggest transaction: start with the first one and replace it whenever a bigger one turns up (the first of equal ones wins). The customers: `array_column` pulls out every name, `array_unique` removes repeats, `sort` puts them in order.' },
      {
        t: 'project',
        title: 'Summary, step 4: the finished report',
        stdin: txInput(DAY),
        code: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$deposits = 0;
$depositTotal = 0;
$withdrawals = 0;
$withdrawalTotal = 0;
$fees = 0;
$biggest = $txs[0];
foreach ($txs as $tx) {
    if ($tx["service"] === "deposit") {
        $deposits++;
        $depositTotal += $tx["amount"];
    } else {
        $withdrawals++;
        $withdrawalTotal += $tx["amount"];
        if ($tx["amount"] <= 50000) {
            $fees += 1000;
        } elseif ($tx["amount"] <= 200000) {
            $fees += 2000;
        } else {
            $fees += 3500;
        }
    }
    if ($tx["amount"] > $biggest["amount"]) {
        $biggest = $tx;
    }
}

$names = array_unique(array_column($txs, "name"));
sort($names);

echo "DAILY SUMMARY - NAMBI'S MONEY BOOTH\n";
echo "Transactions : ", count($txs), "\n";
echo "Deposits     : ", $deposits, " (UGX ", number_format($depositTotal), ")\n";
echo "Withdrawals  : ", $withdrawals, " (UGX ", number_format($withdrawalTotal), ")\n";
echo "Fees earned  : UGX ", number_format($fees), "\n";
echo "Biggest      : ", $biggest["name"], " (UGX ", number_format($biggest["amount"]), ")\n";
echo "Customers    : ", implode(", ", $names), "\n";
`,
        output: out(...summaryLines(DAY)),
      },
      { t: 'p', text: 'It is your program now. Change the input: a day with only deposits, or one with a single customer, and read the report.' },
      {
        t: 'try',
        stdin: txInput([['Eve', 'withdraw', 250000], ['Eve', 'deposit', 10000]]),
        code: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$deposits = 0;
$depositTotal = 0;
$withdrawals = 0;
$withdrawalTotal = 0;
$fees = 0;
$biggest = $txs[0];
foreach ($txs as $tx) {
    if ($tx["service"] === "deposit") {
        $deposits++;
        $depositTotal += $tx["amount"];
    } else {
        $withdrawals++;
        $withdrawalTotal += $tx["amount"];
        if ($tx["amount"] <= 50000) {
            $fees += 1000;
        } elseif ($tx["amount"] <= 200000) {
            $fees += 2000;
        } else {
            $fees += 3500;
        }
    }
    if ($tx["amount"] > $biggest["amount"]) {
        $biggest = $tx;
    }
}

$names = array_unique(array_column($txs, "name"));
sort($names);

echo "DAILY SUMMARY - NAMBI'S MONEY BOOTH\n";
echo "Transactions : ", count($txs), "\n";
echo "Deposits     : ", $deposits, " (UGX ", number_format($depositTotal), ")\n";
echo "Withdrawals  : ", $withdrawals, " (UGX ", number_format($withdrawalTotal), ")\n";
echo "Fees earned  : UGX ", number_format($fees), "\n";
echo "Biggest      : ", $biggest["name"], " (UGX ", number_format($biggest["amount"]), ")\n";
echo "Customers    : ", implode(", ", $names), "\n";
`,
        output: out(...summaryLines([['Eve', 'withdraw', 250000], ['Eve', 'deposit', 10000]])),
      },
      {
        t: 'predict',
        code: php`<?php
[$a, $b] = explode(",", "mtn,airtel");
echo $b, " then ", $a, "\n";
`,
        question: 'What does this program print?',
        options: ['airtel then mtn', 'mtn then airtel', 'mtn,airtel then mtn,airtel', 'Nothing: you cannot unpack an array'],
        answer: 0,
        explain: 'explode gives ["mtn", "airtel"]. The first piece goes into $a and the second into $b, so echo prints the second one first: airtel then mtn.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that cuts the line at every comma.',
        template: php`<?php
[$name, $amount] = ___(",", "Amina,5000");
echo $name, ": ", $amount, "\n";
`,
        blanks: [{ options: ['explode', 'implode', 'trim'], answer: 'explode' }],
        output: 'Amina: 5000\n',
      },
      {
        t: 'bug',
        code: php`<?php
$txs = [100, 200];
$total = 0;
foreach ($txs $tx) {
    $total += $tx;
}
echo $total, "\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['The word as is missing: foreach ($txs as $tx)', 'foreach needs a counter', 'total must be written in capitals', 'The array needs keys'],
        answer: 0,
        explain: 'foreach reads like English: “for each of $txs, as $tx”. Without the word as, PHP finds a variable where it expected the word and stops.',
        fixed: php`<?php
$txs = [100, 200];
$total = 0;
foreach ($txs as $tx) {
    $total += $tx;
}
echo $total, "\n";
`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$tx = ["Amina", "withdraw", 120000];
echo $tx["amount"];`, why: 'No fatal error, but a warning “Undefined array key "amount"”. This list has only numbered positions. Records need keys, as in $txs[] = ["name" => ..., "amount" => ...].', right: php`<?php
$tx = ["name" => "Amina", "service" => "withdraw", "amount" => 120000];
echo $tx["amount"];`, logic: true },
          { wrong: php`<?php
$count = 0;
foreach ([5, 6, 7] as $x) {
    $count = 0;
    $count++;
}
echo $count;`, why: 'No error, but it prints 1. The counter is set back to 0 in every round. Counters must be created before the loop, never inside it.', right: php`<?php
$count = 0;
foreach ([5, 6, 7] as $x) {
    $count++;
}
echo $count;`, logic: true },
          { wrong: php`<?php
$txs = [["amount" => 5]];
$biggest = $txs[1];
echo $biggest["amount"];`, why: 'With one record the only index is 0. $txs[1] does not exist: PHP warns, and then reading a key of nothing warns again, and prints nothing.', right: php`<?php
$txs = [["amount" => 5]];
$biggest = $txs[0];
echo $biggest["amount"];`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'A report is the same loop over many records: counters before the loop, work inside it, printing after it.',
          '`[$a, $b, $c] = explode(",", $line);` unpacks pieces into variables.',
          'A list of records (`["name" => ..., "amount" => ...]`) plus `foreach`, `array_column`, `array_unique` and `sort` can answer most questions about a day of data.',
          'The fee rule is written once, inside the loop. In Level 3 you will give it a name and a home of its own: a function.',
        ],
        memory: 'Counters before the loop. Work inside. Print after.',
      },
    ],
    exercises: [
      {
        id: 'php13-summary',
        title: 'The daily summary',
        prompt: 'Build the whole closing report from the input: the first line is N, then N transactions as `name,service,amount` (`deposit` or `withdraw`). Print exactly the report of the lesson:\n\n`DAILY SUMMARY - NAMBI\'S MONEY BOOTH`\n`Transactions : 5`\n`Deposits     : 3 (UGX 100,000)`\n`Withdrawals  : 2 (UGX 920,000)`\n`Fees earned  : UGX 5,500`\n`Biggest      : Grace (UGX 800,000)`\n`Customers    : Amina, Brian, Dan, Grace`\n\nFees: deposits free; withdrawals up to 50,000 cost 1,000, up to 200,000 cost 2,000, above that 3,500. If two transactions share the biggest amount, the first one wins.',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}
`,
        usesInput: true,
        sampleInput: txInput(DAY),
        tests: [
          { input: txInput(DAY), expected: out(...summaryLines(DAY)) },
          { input: txInput([['Eve', 'withdraw', 250000]]), expected: out(...summaryLines([['Eve', 'withdraw', 250000]])), hidden: true, name: 'One withdrawal' },
          { input: txInput([['Dan', 'deposit', 15000], ['Dan', 'deposit', 20000]]), expected: out(...summaryLines([['Dan', 'deposit', 15000], ['Dan', 'deposit', 20000]])), hidden: true, name: 'Only deposits' },
          {
            input: txInput([['Zed', 'withdraw', 50000], ['Amy', 'withdraw', 50000], ['Mia', 'deposit', 50000]]),
            expected: out(...summaryLines([['Zed', 'withdraw', 50000], ['Amy', 'withdraw', 50000], ['Mia', 'deposit', 50000]])),
            hidden: true,
            name: 'The biggest is a tie',
          },
        ],
        hints: [
          'Go step by step as in the lesson: counters before the loop, the work inside a foreach, printing after.',
          'Withdrawals add to the count, the total and the fees. Deposits add to their own count and total only. Start $biggest as $txs[0] and replace it when an amount is strictly bigger.',
          'For the customers: array_unique(array_column($txs, "name")), then sort, then implode(", ", ...).',
        ],
      },
      {
        id: 'php13-ranking',
        title: 'Customers and visits',
        prompt: 'Same input as the summary. For every customer print their total and how many transactions they made, best total first (ties: name A to Z):\n\n`1. Grace: UGX 800,000 (1 tx)`\n`2. Amina: UGX 170,000 (2 tx)`',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}
`,
        usesInput: true,
        sampleInput: txInput(DAY),
        tests: [
          {
            input: txInput(DAY),
            expected: out(...ranking(DAY).map(([name, total], i) => `${i + 1}. ${name}: UGX ${money(total)} (${DAY.filter((t) => t[0] === name).length} tx)`)),
          },
          { input: txInput([['Aisha', 'deposit', 5000]]), expected: '1. Aisha: UGX 5,000 (1 tx)', hidden: true, name: 'One customer' },
          {
            input: txInput([['Eve', 'deposit', 30000], ['Dan', 'withdraw', 20000], ['Dan', 'deposit', 10000], ['Eve', 'deposit', 0]]),
            expected: out('1. Dan: UGX 30,000 (2 tx)', '2. Eve: UGX 30,000 (2 tx)'),
            hidden: true,
            name: 'A tie, and a zero amount',
          },
        ],
        hints: [
          'Two tallies with the name as the key: one for the total money, one for the number of transactions.',
          'ksort($totals) and then arsort($totals) gives best total first, ties A to Z. Use the keys of $totals to look up the counts.',
          'foreach ($totals as $name => $total) with a position counter starting at 1, and print the count from the other array.',
        ],
      },
      {
        id: 'php13-fee-report',
        title: 'The fee report',
        prompt: 'Same input as the summary. Group the transactions by the fee they paid (deposits pay 0) and print one line per fee that occurred, from the smallest fee to the biggest, then the total:\n\n`Fee UGX 0 x 3 = UGX 0`\n`Fee UGX 2,000 x 1 = UGX 2,000`\n`Fee UGX 3,500 x 1 = UGX 3,500`\n`Total fees: UGX 5,500`',
        starter: php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}
`,
        usesInput: true,
        sampleInput: txInput(DAY),
        tests: [
          { input: txInput(DAY), expected: feeReport(DAY) },
          { input: txInput([['Dan', 'deposit', 15000]]), expected: out('Fee UGX 0 x 1 = UGX 0', 'Total fees: UGX 0'), hidden: true, name: 'Only a deposit' },
          {
            input: txInput([['A', 'withdraw', 50000], ['B', 'withdraw', 50001], ['C', 'withdraw', 200000], ['D', 'withdraw', 200001], ['E', 'withdraw', 10000]]),
            expected: feeReport([['A', 'withdraw', 50000], ['B', 'withdraw', 50001], ['C', 'withdraw', 200000], ['D', 'withdraw', 200001], ['E', 'withdraw', 10000]]),
            hidden: true,
            name: 'Every edge of the fee table',
          },
        ],
        hints: [
          'Work out the fee of each transaction (the if / elseif / else chain, once, inside the loop).',
          'Tally by fee: $bands[$fee] = ($bands[$fee] ?? 0) + 1; then ksort($bands) puts the smallest fee first.',
          'For every band print the fee, how many, and fee times count. Keep a running total of the fees for the last line.',
        ],
      },
    ],
  },
];

// Expected output of php13-fee-report, built from the data in plain JavaScript.
function feeReport(txs) {
  const bands = new Map();
  for (const [, service, amount] of txs) {
    const fee = boothFee(service, amount);
    bands.set(fee, (bands.get(fee) || 0) + 1);
  }
  const keys = [...bands.keys()].sort((a, b) => a - b);
  let total = 0;
  const lines = keys.map((fee) => {
    total += fee * bands.get(fee);
    return `Fee UGX ${money(fee)} x ${bands.get(fee)} = UGX ${money(fee * bands.get(fee))}`;
  });
  return out(...lines, `Total fees: UGX ${money(total)}`);
}
