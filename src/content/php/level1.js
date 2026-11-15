// PHP, Level 1: First scripts. Lessons 1 to 3 (your first script, variables and types, strings).
// Prose uses double-quoted strings. PHP code uses the php`...` tag (String.raw), see shared.js.
// Expected outputs are plain JavaScript strings, never produced by running the PHP.
import { php, out, ucwords } from './shared.js';

const LEVEL = 'Level 1: First scripts';

export const level1 = [
  // ================================================================== 1
  {
    id: 'php-first',
    level: LEVEL,
    minutes: 18,
    title: 'Your first script',
    summary: 'The <?php tag, echo, text in quotes, the semicolon and comments',
    blocks: [
      {
        t: 'story',
        title: 'The long queue',
        text: "Nambi runs a Mobile Money booth in Mukono trading centre. Every customer who deposits or withdraws gets a paper receipt, and Nambi writes each one by hand: the name, the amount, the fee, the total. On a busy Friday the queue reaches the road, and her wrist hurts by lunchtime.\n\nHer nephew, who studies computer science, says: “Auntie, a program can print that receipt in a blink, the same way every time, with no spelling mistakes.” Over this course you will build that program, one piece at a time, in a language called PHP. Today you write the first line.",
      },
      { t: 'p', text: "PHP is one of the most widely used languages on the web. WordPress, a tool that runs a huge number of websites, is written in it. Press **Run** and watch your first PHP program speak." },
      {
        t: 'try',
        code: php`<?php
echo "NAMBI'S MONEY BOOTH\n";
`,
        output: "NAMBI'S MONEY BOOTH\n",
      },
      { t: 'h', text: 'Five things to notice' },
      {
        t: 'list',
        items: [
          '`<?php` opens PHP mode. Every PHP file starts with it, on the very first line.',
          '`echo` means “print this”.',
          'Text goes inside quotes: `"like this"`. Programmers call text a **string**.',
          '`\\n` inside the quotes means “start a new line”. Without it, the next echo continues on the same line.',
          'The semicolon `;` ends the instruction, like the full stop at the end of a sentence.',
        ],
      },
      { t: 'tip', text: "PHP normally runs on a web server and sends its output to a browser. This app has no web server, so what `echo` prints appears in the Output panel. Everything you learn here works the same on a real server." },
      { t: 'p', text: 'Many `echo` lines in a row print one after the other. This is the top of a real receipt:' },
      {
        t: 'try',
        code: php`<?php
echo "NAMBI'S MONEY BOOTH\n";
echo "Mukono Trading Centre\n";
echo "Thank you for banking with us!\n";
`,
        output: out("NAMBI'S MONEY BOOTH", 'Mukono Trading Centre', 'Thank you for banking with us!'),
      },
      {
        t: 'predict',
        code: php`<?php
echo "Nambi";
echo "Booth";
`,
        question: 'There is no \\n in either echo. What does this program print?',
        options: ['NambiBooth', 'Nambi\nBooth', 'Nambi Booth', 'echo "Nambi"; echo "Booth";'],
        answer: 0,
        explain: 'echo prints exactly what is inside the quotes, nothing more. No space and no new line were typed, so the two words are glued together. Add \\n (or a space) yourself when you want one.',
      },
      { t: 'h', text: 'Comments: notes for humans' },
      { t: 'p', text: 'PHP ignores everything after `//` or `#` on a line, and everything between `/*` and `*/`. Use comments to explain your program to the person who reads it next, which is often you in two weeks.' },
      {
        t: 'try',
        code: php`<?php
// this is a comment: PHP skips it
# this one is skipped too
/* and this one
   can run over many lines */
echo "Only this line prints.\n";
`,
        output: 'Only this line prints.\n',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that prints text.',
        template: php`<?php
___ "Hello, Nambi!\n";
`,
        blanks: [{ options: ['echo', 'say', 'show'], answer: 'echo' }],
        output: 'Hello, Nambi!\n',
      },
      {
        t: 'bug',
        code: php`<?php
echo "Welcome to the booth\n"
echo "Open from 8am to 8pm\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['The first echo line has no semicolon at the end', 'echo must be written in capital letters', 'The \\n must be removed from the first line', 'The second line needs a question mark'],
        answer: 0,
        explain: 'Without the semicolon, PHP thinks the first echo continues onto the next line, finds a second `echo` where it did not expect one, and gives up. The error message names the line where PHP got lost, so look at the end of the line just above it.',
        fixed: php`<?php
echo "Welcome to the booth\n";
echo "Open from 8am to 8pm\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program prints the welcome line first and the thank-you line second.',
        lines: ['<?php', 'echo "Welcome!\\n";', 'echo "Thank you!\\n";'],
        output: 'Welcome!\nThank you!\n',
      },
      {
        t: 'quiz',
        question: 'What ends an instruction (a statement) in PHP?',
        options: ['A semicolon ;', 'A full stop .', 'The word end', 'A blank line'],
        answer: 0,
        explain: 'PHP does not care about blank lines or spaces between instructions. Only the semicolon tells it where one instruction stops and the next one starts.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo "Hello"`, why: 'The last instruction has no semicolon. PHP reaches the end of the file still waiting for it.', right: php`<?php
echo "Hello";` },
          { wrong: php`<?php
echo "Hello';`, why: 'The text opened with a double quote and closed with a single quote, so PHP never finds the end of the text.', right: php`<?php
echo "Hello";` },
          { wrong: php`<?php
echo Hello;`, why: 'Text must be inside quotes. Without them PHP looks for something named Hello, finds nothing, and stops with “Undefined constant”.', right: php`<?php
echo "Hello";` },
          { wrong: php`echo "Hello";`, why: 'No error, but the file does not start with <?php, so PHP treats everything as plain text and prints the line as it is, instead of running it.', right: php`<?php
echo "Hello";`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'A PHP file starts with `<?php`.',
          '`echo "text";` prints text. `\\n` inside the quotes starts a new line.',
          'Every instruction ends with a semicolon `;`.',
          'Comments (`//`, `#`, `/* */`) are notes that PHP ignores.',
          'Error messages say which line PHP got lost on. The mistake is usually on that line or the one above.',
        ],
        memory: '<?php opens it. echo prints it. ; ends it.',
      },
    ],
    exercises: [
      {
        id: 'php1-hello',
        title: 'Say hello to Mukono',
        prompt: 'Print exactly this line: `Hello, Mukono!`',
        starter: php`<?php
// Print: Hello, Mukono!
`,
        tests: [{ input: '', expected: 'Hello, Mukono!' }],
        hints: [
          'You need the word that prints text, then the text in double quotes, then a semicolon.',
          'echo "..."; with the greeting between the quotes. Match capital letters and punctuation exactly.',
          'A similar example: `echo "Hello, Nambi!\\n";` prints Hello, Nambi!. Yours prints Hello, Mukono!',
        ],
      },
      {
        id: 'php1-header',
        title: 'The top of the receipt',
        prompt: "Print these three lines, one per line:\n\n`NAMBI'S MONEY BOOTH`\n`Mukono Trading Centre`\n`Open 8am to 8pm`",
        starter: php`<?php
// Use one echo per line. Do not forget \n and the semicolons.
`,
        tests: [{ input: '', expected: out("NAMBI'S MONEY BOOTH", 'Mukono Trading Centre', 'Open 8am to 8pm') }],
        hints: [
          'Three lines means three echo instructions, and each text ends with \\n so the next one starts on a new line.',
          'echo "first line\\n"; then the same pattern for the second and the third line.',
          'A similar example: `echo "Welcome!\\n"; echo "Thank you!\\n";` prints two lines. Yours needs three.',
        ],
      },
      {
        id: 'php1-fix',
        title: 'Fix the opening hours',
        prompt: 'This program does not run. Fix it so it prints:\n\n`Opening hours`\n`Monday to Saturday`\n`8am to 8pm`',
        starter: php`<?php
echo "Opening hours\n"
echo "Monday to Saturday\n"
echo "8am to 8pm\n"
`,
        tests: [{ input: '', expected: out('Opening hours', 'Monday to Saturday', '8am to 8pm') }],
        hints: [
          'Run it first and read the error. It names a line and says what PHP did not expect.',
          'Every instruction must end with the same small character. Look at the end of each line.',
          'Each of the three echo lines needs a semicolon ; right after the closing quote.',
        ],
      },
    ],
  },

  // ================================================================== 2
  {
    id: 'php-vars',
    level: LEVEL,
    minutes: 22,
    title: 'Variables and types',
    summary: 'Naming a value with $, the types string, int, float and bool, and reading input',
    blocks: [
      {
        t: 'story',
        title: 'The labelled tins',
        text: "Under Nambi's counter are three tins. One is labelled MTN, one AIRTEL, one CASH. She never opens a tin to guess what is inside: she reads the label. When she takes out 20,000 shillings the label stays the same, and only what is inside changes.\n\nA variable is exactly that: a **label** on a place that holds a value. In PHP the label always starts with a dollar sign: `$balance`.",
      },
      { t: 'p', text: 'You make a variable by writing its label, an equals sign, and the value. Then you can use the label anywhere you need the value.' },
      {
        t: 'try',
        code: php`<?php
$customer = "Amina";
$amount = 50000;
echo "Customer: ", $customer, "\n";
echo "Amount: ", $amount, "\n";
`,
        output: out('Customer: Amina', 'Amount: 50000'),
      },
      { t: 'p', text: "Notice that `echo` can print several things in one go if you put commas between them. The `=` sign does not mean “is equal to” here. It means “put the value on the right into the tin on the left”." },
      { t: 'h', text: 'The rules for names' },
      {
        t: 'list',
        items: [
          'A variable name starts with `$`, then a letter or an underscore, then any letters, digits or underscores: `$balance`, `$fee_2`, `$_temp`.',
          'No spaces and no dashes: `$my fee` and `$my-fee` do not work. Use `$my_fee` or `$myFee`.',
          'Capital letters matter: `$Amount` and `$amount` are two different tins.',
          'The `$` is part of the label only. You never put it in front of a value.',
        ],
      },
      { t: 'p', text: 'A tin can be refilled. The old value is gone the moment you put a new one in:' },
      {
        t: 'try',
        code: php`<?php
$balance = 100000;
echo "Before: ", $balance, "\n";
$balance = 80000;
echo "After: ", $balance, "\n";
`,
        output: out('Before: 100000', 'After: 80000'),
      },
      {
        t: 'predict',
        code: php`<?php
$a = 5;
$b = $a;
$a = 10;
echo $b;
`,
        question: 'What does this program print?',
        options: ['5', '10', '15', '$b'],
        answer: 0,
        explain: '`$b = $a;` copies the value 5 into $b at that moment. Changing $a to 10 afterwards does not reach back into $b. A copy is a copy.',
      },
      { t: 'h', text: 'Types: what kind of thing is in the tin?' },
      {
        t: 'list',
        items: [
          '**string**: text, like `"Amina"`.',
          '**int**: a whole number, like `50000`. No quotes, no commas, no spaces.',
          '**float**: a number with a decimal point, like `2.5`.',
          '**bool**: only `true` or `false`.',
          '**null**: “nothing”, the empty tin.',
        ],
      },
      { t: 'p', text: '`var_dump()` shows both the value and its type. It is the best friend of every PHP programmer. Notice that the number after `string` counts the characters.' },
      {
        t: 'try',
        code: php`<?php
var_dump("Amina");
var_dump(50000);
var_dump(2.5);
var_dump(true);
var_dump(null);
`,
        output: out('string(5) "Amina"', 'int(50000)', 'float(2.5)', 'bool(true)', 'NULL'),
      },
      { t: 'h', text: 'Asking the user for a value' },
      { t: 'p', text: "Programs become useful when they read input. `fgets(STDIN)` reads one line from the Input box under the code. The line ends with an invisible new-line character, so wrap it in `trim()` to remove it." },
      {
        t: 'try',
        stdin: 'Nakato\n',
        code: php`<?php
$name = trim(fgets(STDIN));
echo "Welcome, ", $name, "!\n";
`,
        output: 'Welcome, Nakato!\n',
      },
      { t: 'p', text: 'Input always arrives as text. To use it as a number, put `(int)` in front, which means “turn this into a whole number”.' },
      {
        t: 'try',
        stdin: '75000\n',
        code: php`<?php
$amount = (int) trim(fgets(STDIN));
echo "Double: ", $amount * 2, "\n";
`,
        output: 'Double: 150000\n',
      },
      {
        t: 'fill',
        stdin: 'Brian\n',
        prompt: 'Fill the gap with the function that removes the invisible new line from the input.',
        template: php`<?php
$name = ___(fgets(STDIN));
echo "Hello, ", $name, "!\n";
`,
        blanks: [{ options: ['trim', 'strlen', 'count'], answer: 'trim' }],
        output: 'Hello, Brian!\n',
      },
      {
        t: 'bug',
        code: php`<?php
name = "Nambi";
echo "Hello, ", $name, "\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['The first variable is missing its $ in front', 'Strings must use single quotes', 'echo cannot take a comma', 'Variable names must be written in capital letters'],
        answer: 0,
        explain: 'Without the dollar sign, `name` is not a variable. PHP sees a plain word followed by `=` and does not know what to do. Every variable needs its `$`, both when you fill it and when you use it.',
        fixed: php`<?php
$name = "Nambi";
echo "Hello, ", $name, "\n";
`,
      },
      { t: 'p', text: 'One more thing to see with your own eyes. When you misspell a variable, PHP does not stop. It prints a **warning** and carries on with an empty value, which is easy to miss. Read the warning: it names the variable that does not exist.' },
      {
        t: 'try',
        code: php`<?php
$name = "Nambi";
echo $nmae;
echo "\nDone\n";
`,
        output: '\nWarning: Undefined variable $nmae in main.php on line 3\n\nDone\n',
      },
      {
        t: 'quiz',
        question: 'Which of these is a valid variable name?',
        options: ['$total_fee', 'total_fee', '$2nd_fee', '$total fee'],
        answer: 0,
        explain: 'A variable starts with $ and then a letter or underscore. `total_fee` has no $, `$2nd_fee` starts with a digit after the $, and `$total fee` has a space.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$total = 50 000;`, why: 'A number is written as one piece. The space makes PHP think there are two separate things.', right: php`<?php
$total = 50000;` },
          { wrong: php`<?php
name = "Amina";`, why: 'The variable has no $ in front of its name.', right: php`<?php
$name = "Amina";` },
          { wrong: php`<?php
$name = Amina;
echo $name;`, why: 'Text needs quotes. Without them PHP looks for something called Amina and stops with “Undefined constant”.', right: php`<?php
$name = "Amina";
echo $name;` },
          { wrong: php`<?php
$total = 5;
echo $Total;`, why: 'No error stops the program, only a warning, because capital letters matter: $Total is a different, empty variable from $total.', right: php`<?php
$total = 5;
echo $total;`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'A variable is a label that holds a value: `$name = "Amina";`. It always starts with `$`.',
          'Types: string (text), int (whole number), float (decimal), bool (true/false), null (nothing).',
          '`var_dump($x)` shows the value and its type.',
          '`trim(fgets(STDIN))` reads one line of input. Add `(int)` in front when you need a number.',
          'A misspelled variable gives a **warning** and an empty value. Read warnings.',
        ],
        memory: 'A $variable is a labelled tin. var_dump looks inside.',
      },
    ],
    exercises: [
      {
        id: 'php2-greet',
        title: 'Welcome the customer',
        prompt: "Read the customer's name from the input. Print `Hello, NAME! Welcome to Nambi's booth.` with the real name in place of NAME.",
        starter: php`<?php
// 1. Read the name with trim(fgets(STDIN)) and keep it in a variable.
// 2. Print the welcome line.
`,
        usesInput: true,
        sampleInput: 'Amina\n',
        tests: [
          { input: 'Amina\n', expected: "Hello, Amina! Welcome to Nambi's booth." },
          { input: 'Ssali Joseph\n', expected: "Hello, Ssali Joseph! Welcome to Nambi's booth.", hidden: true, name: 'A name with two words' },
        ],
        hints: [
          'First put the input into a variable, for example $name = trim(fgets(STDIN));',
          'Then echo the pieces in order: the text before the name, the variable, the text after. Separate the pieces with commas.',
          'A similar example: `echo "Welcome, ", $name, "!\\n";` Yours has different words around the name.',
        ],
      },
      {
        id: 'php2-deposit',
        title: 'Record a deposit',
        prompt: 'The input has two lines: the customer name, then the amount (a whole number). Print one line like `Amina deposited UGX 50000`. Do not add commas to the number yet.',
        starter: php`<?php
// Line 1 of the input is the name, line 2 is the amount.
`,
        usesInput: true,
        sampleInput: 'Amina\n50000\n',
        tests: [
          { input: 'Amina\n50000\n', expected: 'Amina deposited UGX 50000' },
          { input: 'Brian\n1200\n', expected: 'Brian deposited UGX 1200', hidden: true, name: 'Another customer' },
        ],
        hints: [
          'Read the input twice: one trim(fgets(STDIN)) for the name, one for the amount. Each goes into its own variable.',
          'Print the name, then the text " deposited UGX ", then the amount, with commas between the pieces.',
          'A similar example: `echo $shop, " sold ", $count, " eggs\\n";` Yours has a name, a word and an amount.',
        ],
      },
      {
        id: 'php2-swap',
        title: 'Swap the tins',
        prompt: "Nambi put the MTN float in the Airtel tin and the other way round. The input has two numbers, the first for MTN and the second for Airtel. Print them as they were found, then swap them using a third variable, and print again:\n\n`Before: mtn=A airtel=B`\n`After: mtn=B airtel=A`",
        starter: php`<?php
$mtn = (int) trim(fgets(STDIN));
$airtel = (int) trim(fgets(STDIN));
echo "Before: mtn=", $mtn, " airtel=", $airtel, "\n";
// Swap the two values. You need a third variable to hold one of them for a moment.
`,
        usesInput: true,
        sampleInput: '30000\n80000\n',
        tests: [
          { input: '30000\n80000\n', expected: out('Before: mtn=30000 airtel=80000', 'After: mtn=80000 airtel=30000') },
          { input: '5\n9\n', expected: out('Before: mtn=5 airtel=9', 'After: mtn=9 airtel=5'), hidden: true, name: 'Small numbers' },
        ],
        hints: [
          'If you write $mtn = $airtel; first, the old MTN value is lost. Save it somewhere before that.',
          'Three steps: copy $mtn into $spare, copy $airtel into $mtn, copy $spare into $airtel.',
          'After the three steps, print the After line the same way the Before line was printed.',
        ],
      },
    ],
  },

  // ================================================================== 3
  {
    id: 'php-strings',
    level: LEVEL,
    minutes: 24,
    title: 'Strings',
    summary: 'Quotes, joining text, and the string functions every receipt needs',
    blocks: [
      {
        t: 'story',
        title: 'Names, phone numbers and receipts',
        text: "Customers write their own names on Nambi's form. Some press the caps lock, some leave spaces at the end, and some names carry letters that older programs mangle, like the Luganda ŋ. On the receipt Nambi also does not want to print a whole phone number: she shows only the beginning and the end, so a stranger who picks up the paper cannot call the customer.\n\nAll of that is work on **strings**, the programmer's word for text. PHP comes with a big toolbox for it, and you will meet the most useful tools today.",
      },
      { t: 'h', text: 'Double quotes and single quotes' },
      { t: 'p', text: 'Both make a string, but they behave differently. Double quotes look inside the text for `$variables` and `\\n`. Single quotes print everything exactly as typed.' },
      {
        t: 'try',
        code: php`<?php
$name = "Nakato";
echo "Hello $name\n";
echo 'Hello $name\n';
`,
        output: 'Hello Nakato\nHello $name\\n',
      },
      { t: 'p', text: 'The first line was filled in and ended with a new line. The second one printed the dollar sign and the backslash letters as they are. Use double quotes when you want variables or `\\n` inside.' },
      { t: 'h', text: 'Joining strings' },
      { t: 'p', text: 'The dot `.` glues strings together. This is called **concatenation**. To put a variable next to other letters inside double quotes, wrap it in curly brackets so PHP knows where its name stops.' },
      {
        t: 'try',
        code: php`<?php
$first = "Nakato";
$last = "Ssali";
echo $first . " " . $last . "\n";
echo "Hello, {$first}s!\n";
`,
        output: out('Nakato Ssali', 'Hello, Nakatos!'),
      },
      {
        t: 'predict',
        code: php`<?php
echo "5" . "3";
`,
        question: 'The dot joins text. What does this program print?',
        options: ['53', '8', '5 3', '3'],
        answer: 0,
        explain: 'The dot never does arithmetic. It glues the text "5" and the text "3" into "53". To add numbers you use + (you will meet it in the lesson on numbers).',
      },
      { t: 'h', text: 'The toolbox' },
      {
        t: 'list',
        items: [
          '`strlen($s)`: how many characters.',
          '`strtoupper($s)` and `strtolower($s)`: all capitals, all small letters.',
          '`ucfirst($s)`: first letter a capital. `ucwords($s)`: first letter of every word.',
          '`trim($s)`: remove spaces and new lines from both ends.',
          '`str_replace($old, $new, $s)`: swap one piece of text for another.',
          '`str_repeat($s, $times)`: repeat a string. Perfect for lines of dashes on a receipt.',
        ],
      },
      {
        t: 'try',
        code: php`<?php
echo strlen("Mukono"), "\n";
echo strtoupper("booth"), "\n";
echo ucfirst("nambi"), "\n";
echo ucwords("nambi's money booth"), "\n";
echo "[" . trim("  Amina  ") . "]\n";
echo str_replace("Mukono", "Kampala", "Booth in Mukono"), "\n";
echo str_repeat("=", 10), "\n";
`,
        output: out('6', 'BOOTH', 'Nambi', "Nambi's Money Booth", '[Amina]', 'Booth in Kampala', '=========='),
      },
      { t: 'h', text: 'Cutting out a piece' },
      { t: 'p', text: '`substr($s, $start, $length)` cuts out a piece. Counting starts at **0**, not 1, so the first character is at position 0. A negative start counts from the end. `strpos($s, $find)` tells you where a piece starts.' },
      {
        t: 'try',
        code: php`<?php
$phone = "0772123456";
echo substr($phone, 0, 4), "\n";
echo substr($phone, -3), "\n";
echo strpos($phone, "21"), "\n";
`,
        output: out('0772', '456', '3'),
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints the name in capital letters.',
        template: php`<?php
echo ___("nambi"), "\n";
`,
        blanks: [{ options: ['strtoupper', 'ucfirst', 'strlen'], answer: 'strtoupper' }],
        output: 'NAMBI\n',
      },
      { t: 'h', text: 'Letters that take more than one byte' },
      { t: 'p', text: "The letter ŋ in Luganda is stored with two bytes. `strlen()` counts bytes, so it says 2. The `mb_` versions (the “mb” means multibyte) count real letters. Whenever a name can contain letters outside A to Z, prefer `mb_strlen`, `mb_strtoupper` and `mb_substr`." },
      {
        t: 'try',
        code: php`<?php
echo strlen("ŋ"), "\n";
echo mb_strlen("ŋ"), "\n";
`,
        output: out('2', '1'),
      },
      {
        t: 'bug',
        code: php`<?php
$name = "Nakato";
echo "Hello, " $name . "\n";
`,
        question: 'This program stops with a “syntax error”. What is wrong?',
        options: ['There is no dot (or comma) between "Hello, " and $name', 'Variables cannot be used inside echo', 'The text must use single quotes', '\\n cannot be joined to a variable'],
        answer: 0,
        explain: 'Two pieces side by side need something between them. A dot joins them into one string, a comma makes echo print them one after the other. With nothing between them PHP does not know what you want.',
        fixed: php`<?php
$name = "Nakato";
echo "Hello, " . $name . "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program builds the receipt line and then prints it.',
        lines: ['<?php', '$name = "Amina";', '$line = "Customer: " . $name;', 'echo $line . "\\n";'],
        output: 'Customer: Amina\n',
      },
      {
        t: 'quiz',
        question: 'Which kind of quotes lets you put a $variable inside the text and have PHP fill it in?',
        options: ['Double quotes "..."', "Single quotes '...'", 'Both of them', 'Neither of them'],
        answer: 0,
        explain: 'Double quotes make PHP look inside the text for variables and special characters such as \\n. Single quotes keep every character exactly as typed.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo 'It's open';`, why: 'The apostrophe in It\'s ends the single-quoted text too early. Put the text inside double quotes instead.', right: php`<?php
echo "It's open";` },
          { wrong: php`<?php
$name = "Nakato";
echo "Hello, " + $name;`, why: 'The plus sign is for arithmetic, not for joining text. PHP 8 stops with an error because "Hello, " is not a number. Joining is done with the dot.', right: php`<?php
$name = "Nakato";
echo "Hello, " . $name;` },
          { wrong: php`<?php
echo substr("0772123456", 1, 3);`, why: 'No error, but substr counts from 0. Position 1 is the second character, so you get 772 and not 077. To start at the beginning use 0.', right: php`<?php
echo substr("0772123456", 0, 3);`, logic: true },
          { wrong: php`<?php
$name = "Nakato";
echo 'Hello $name';`, why: 'No error, but single quotes do not fill in variables, so the program prints the dollar sign and the word name.', right: php`<?php
$name = "Nakato";
echo "Hello $name";`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'Double quotes fill in `$variables` and `\\n`. Single quotes keep the text exactly as typed.',
          'The dot `.` joins strings. `echo a, b;` prints them one after the other.',
          '`strlen`, `strtoupper`, `strtolower`, `ucfirst`, `ucwords`, `trim`, `str_replace`, `str_repeat`.',
          '`substr($s, start, length)` cuts a piece. Counting starts at 0. A negative start counts from the end.',
          'For names with letters like ŋ use the `mb_` functions.',
        ],
        memory: 'Dot joins. Double quotes fill in. Count from 0.',
      },
    ],
    exercises: [
      {
        id: 'php3-shout',
        title: 'Shout the name',
        prompt: 'Read a name from the input. Print the name in capital letters, then how many letters it has, in this form:\n\n`NAKATO has 6 letters`',
        starter: php`<?php
$name = trim(fgets(STDIN));
// Print NAME-IN-CAPITALS has N letters
`,
        usesInput: true,
        sampleInput: 'Nakato\n',
        tests: [
          { input: 'Nakato\n', expected: 'NAKATO has 6 letters' },
          { input: 'amina\n', expected: 'AMINA has 5 letters', hidden: true, name: 'Small letters' },
          { input: 'Ssali\n', expected: 'SSALI has 5 letters', hidden: true, name: 'Another name' },
        ],
        hints: [
          'Two functions do the work: one makes capital letters, one counts the letters.',
          'strtoupper($name) gives the capitals and strlen($name) gives the count. Print them with the words between.',
          'A similar example: `echo strtoupper($shop), " sells ", strlen($item), " items\\n";`',
        ],
      },
      {
        id: 'php3-tidy',
        title: 'Tidy the name',
        prompt: 'Customers type their names in all sorts of ways. Read one line, remove the spaces around it, and print it with each word starting with a capital letter and the rest in small letters.\n\n`  nAKATO sSALI  ` becomes `Nakato Ssali`',
        starter: php`<?php
$raw = fgets(STDIN);
// trim it, make everything small, then capitalise each word, then print
`,
        usesInput: true,
        sampleInput: '  nAKATO sSALI  \n',
        tests: [
          { input: '  nAKATO sSALI  \n', expected: ucwords('nakato ssali') },
          { input: 'AMINA\n', expected: 'Amina', hidden: true, name: 'One word in capitals' },
          { input: '   brian kato mugisha\n', expected: ucwords('brian kato mugisha'), hidden: true, name: 'Three words' },
        ],
        hints: [
          'Three steps in order: remove the spaces at the ends, turn every letter small, then capitalise each word.',
          'trim(...) first, then strtolower(...), then ucwords(...). You can nest them: one function call inside another.',
          'A similar example: `echo ucfirst(strtolower(trim($word)));` capitalises one word. Yours needs the function for every word.',
        ],
      },
      {
        id: 'php3-mask',
        title: 'Hide the middle of a phone number',
        prompt: 'Read a 10-digit phone number. Print the first 4 digits, then three stars, then the last 3 digits.\n\n`0772123456` becomes `0772***456`',
        starter: php`<?php
$phone = trim(fgets(STDIN));
// first 4 digits + *** + last 3 digits
`,
        usesInput: true,
        sampleInput: '0772123456\n',
        tests: [
          { input: '0772123456\n', expected: '0772***456' },
          { input: '0701987654\n', expected: '0701***654', hidden: true, name: 'Another number' },
        ],
        hints: [
          'You need two pieces of the number and some stars in between. substr cuts pieces out.',
          'substr($phone, 0, 4) is the first four digits. A negative start, like -3, counts from the end.',
          'Join the pieces with dots: substr($phone, 0, 4) . "***" . substr($phone, -3)',
        ],
      },
    ],
  },
];
