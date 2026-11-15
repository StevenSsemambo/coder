// Java, Level 1, lesson 4: Operators and expressions.
import { prog, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 1: Getting started';

export const operatorsLesson = {
  id: 'j-operators',
  level: LEVEL,
  minutes: 25,
  title: 'Operators and expressions',
  summary: 'Arithmetic, integer division and the remainder, precedence, casting, shortcuts, overflow and the Math class',
  blocks: [
    {
      t: 'story',
      title: 'Sharing the maize',
      text: 'After the harvest, the Village SACCO receives 17 sacks of maize from the group farm. There are 5 members. Mama Rose does the sum on her fingers: “Three sacks each, and two sacks left over for the group store.”\n\nShe did two different calculations without noticing: **how many whole sacks each** (17 shared by 5 is 3) and **what is left over** (2). A computer can do both, but you must ask for each one with the right symbol. Those symbols are called **operators**.',
    },
    { t: 'h', text: 'The arithmetic operators' },
    {
      t: 'list',
      items: [
        '`+` add, `-` subtract, `*` multiply (the star, not an x).',
        '`/` divide.',
        '`%` the **remainder** after dividing. It is called “modulo”, and it has nothing to do with percentages.',
      ],
    },
    { t: 'p', text: 'A piece of code that works out a value, such as `17 / 5`, is called an **expression**. Run this and compare the three answers.' },
    {
      t: 'try',
      code: prog(String.raw`        int sacks = 17;
        int members = 5;
        System.out.println(sacks / members);
        System.out.println(sacks % members);
        System.out.println(sacks / 5.0);`),
      output: '3\n2\n3.4',
    },
    { t: 'h', text: 'Integer division cuts the decimals off' },
    { t: 'p', text: 'When **both** numbers are whole numbers (`int`), Java gives a **whole number** answer and throws away the part after the decimal point. It does not round, it just cuts. So `17 / 5` is 3, not 3.4. If **either** number has a decimal point (a `double`), Java divides properly and gives a decimal answer: `17 / 5.0` is 3.4.' },
    { t: 'analogy', text: 'It is like sharing sacks with no cutting allowed. 17 sacks among 5 people: each person gets 3 whole sacks (that is `/`), and 2 sacks are left over because they cannot be split (that is `%`). The remainder is exactly the leftover.' },
    {
      t: 'predict',
      code: prog(String.raw`        System.out.println(7 / 2);
        System.out.println(7 % 2);
        System.out.println(7 / 2.0);`),
      question: 'What does this program print?',
      options: ['3\n1\n3.5', '3.5\n1\n3.5', '4\n1\n3.5', '3\n3\n3.5'],
      answer: 0,
      explain: '7 / 2 is integer division: 3 with the decimals cut off. 7 % 2 is the remainder: 1. 7 / 2.0 has a decimal number in it, so Java does a proper division and gives 3.5.',
    },
    { t: 'h', text: 'A very useful job for / and %: counting notes' },
    { t: 'p', text: 'A member withdraws 37,500 shillings. How many 10,000 notes does the cashier hand out, and how much is left to pay in smaller money? Integer division and the remainder answer both questions.' },
    {
      t: 'try',
      code: prog(String.raw`        int amount = 37500;
        int notes = amount / 10000;
        int rest = amount % 10000;
        System.out.println("Notes: " + notes);
        System.out.println("Rest: " + rest);`),
      output: 'Notes: 3\nRest: 7500',
    },
    { t: 'h', text: 'Who goes first? Precedence' },
    { t: 'p', text: 'Just as in mathematics, `*`, `/` and `%` are done **before** `+` and `-`. Brackets `( )` are done first of all. When in doubt, add brackets: they also make your code easier to read.' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println(7 + 3 * 2);
        System.out.println((7 + 3) * 2);
        System.out.println(2 + 3 * 4 - 6 / 2);`),
      output: '13\n20\n11',
    },
    { t: 'h', text: 'Casting: changing the type of a value' },
    { t: 'p', text: 'Sometimes you hold whole numbers but need a decimal answer. Put the new type in brackets in front of a value to **cast** it. Casting `(double)` first makes the division a proper one. Casting `(int)` cuts the decimals off a double (it does not round).' },
    {
      t: 'try',
      code: prog(String.raw`        int total = 17;
        int count = 5;
        double wrong = total / count;
        double right = (double) total / count;
        System.out.println(wrong);
        System.out.println(right);
        System.out.println((int) 9.99);`),
      output: '3.0\n3.4\n9',
    },
    { t: 'tip', text: 'Look at `double wrong = total / count;`. The division happens first, with two ints, so the answer is already cut to 3. Only then is it stored in the double as 3.0. The type of the variable on the left cannot rescue a division that already lost its decimals. Cast **before** dividing.' },
    { t: 'h', text: 'Shortcuts' },
    {
      t: 'list',
      items: [
        '`x += 5;` means `x = x + 5;`. The same idea works for `-=`, `*=`, `/=` and `%=`.',
        '`x++;` adds 1 and `x--;` takes away 1. They are used all the time for counting.',
      ],
    },
    {
      t: 'try',
      code: prog(String.raw`        int savings = 100000;
        savings += 5000;
        savings -= 2000;
        savings *= 2;
        System.out.println(savings);
        int visits = 0;
        visits++;
        visits++;
        visits--;
        System.out.println(visits);`),
      output: '206000\n1',
    },
    { t: 'h', text: 'When a number is too big for its box' },
    { t: 'p', text: 'An `int` can hold numbers only up to 2,147,483,647. Go one past the top and the value does not stop: it **wraps around** to the lowest number, with no error and no warning. Programs that handle large amounts of money must use `long` instead.' },
    {
      t: 'try',
      code: prog(String.raw`        int big = Integer.MAX_VALUE;
        System.out.println(big);
        big = big + 1;
        System.out.println(big);
        long safe = 2147483647L + 1;
        System.out.println(safe);`),
      output: '2147483647\n-2147483648\n2147483648',
    },
    { t: 'h', text: 'The Math class: ready-made tools' },
    { t: 'p', text: 'Java comes with a toolbox called `Math`. You use a tool by writing `Math.`, then its name, then the values in brackets. Notice that `Math.pow` and `Math.sqrt` give a `double` answer.' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println(Math.max(3, 9));
        System.out.println(Math.min(3, 9));
        System.out.println(Math.abs(-4));
        System.out.println(Math.pow(2, 10));
        System.out.println(Math.sqrt(144));
        System.out.println(Math.round(2.4));
        System.out.println(Math.round(2.5));`),
      output: '9\n3\n4\n1024.0\n12.0\n2\n3',
    },
    { t: 'h', text: 'Two surprises worth knowing now' },
    { t: 'p', text: '**First: + joins text from left to right.** As soon as one side of a `+` is text, the other side is turned into text too and joined, not added. So the order and the brackets matter.' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println("Total: " + 5 + 3);
        System.out.println("Total: " + (5 + 3));
        System.out.println(5 + 3 + " total");`),
      output: 'Total: 53\nTotal: 8\n8 total',
    },
    { t: 'p', text: '**Second: decimal numbers are only approximately stored.** Computers keep a `double` in binary, and some simple decimals such as 0.1 cannot be stored exactly. Never use `double` to keep money you must count to the last shilling. Use whole shillings in an `int` or `long` (and, later in this course, the `BigDecimal` class).' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println(0.1 + 0.2);`),
      output: '0.30000000000000004',
    },
    {
      t: 'fill',
      prompt: 'Choose the operator that prints the **remainder** when 17 sacks are shared among 5 members. The program should print 2.',
      template: prog(String.raw`        System.out.println(17 ___ 5);`),
      blanks: [{ options: ['%', '/', '*'], answer: '%' }],
      output: '2',
    },
    {
      t: 'fill',
      prompt: 'Choose the cast so that the average is a proper decimal division. The program should print **3.4**.',
      template: prog(String.raw`        int total = 17;
        int count = 5;
        double average = (___) total / count;
        System.out.println(average);`),
      blanks: [{ options: ['double', 'int', 'String'], answer: 'double' }],
      output: '3.4',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the only order that works: each calculation needs the variable made by the line before it. The first line and the last two (the closing brackets) are in the right place for you to find.',
      lines: [
        HEAD,
        String.raw`        int amount = 37500;`,
        String.raw`        int notes = amount / 10000;`,
        String.raw`        int rest = amount - notes * 10000;`,
        String.raw`        System.out.println("Notes: " + notes);`,
        String.raw`        System.out.println("Rest: " + rest);`,
        ...TAIL,
      ],
      output: 'Notes: 3\nRest: 7500',
    },
    {
      t: 'bug',
      code: prog(String.raw`        int total = 25;
        int average = total / 2.0;
        System.out.println(average);`),
      question: 'The compiler refuses this program with “possible lossy conversion from double to int”. What does that mean?',
      options: ['25 / 2.0 is a double (12.5), and an int box cannot keep the decimals', 'The number 25 is too large', 'The operator / cannot be used with an int', 'println cannot print an int'],
      answer: 0,
      explain: 'Dividing by 2.0 makes the answer a double, 12.5. Java refuses to squeeze it into an int, because the .5 would be lost without you noticing. Make the variable a double, or cast on purpose with (int).',
      fixed: prog(String.raw`        int total = 25;
        double average = total / 2.0;
        System.out.println(average);`),
    },
    {
      t: 'quiz',
      question: 'What does `9 / 2` give when both numbers are ints?',
      options: ['4', '4.5', '5', '4.0'],
      answer: 0,
      explain: 'Both numbers are whole, so Java does integer division and cuts off the .5. It does not round up to 5. For 4.5 you would write 9 / 2.0.',
    },
    {
      t: 'quiz',
      question: 'What is the value of `20 % 6`?',
      options: ['2', '3', '3.33', '14'],
      answer: 0,
      explain: '20 divided by 6 is 3 whole times (3 × 6 = 18), and 20 - 18 leaves 2. The % operator gives exactly that leftover.',
    },
    {
      t: 'quiz',
      question: 'Which type should hold the total of a very large group fund, such as 5 billion shillings?',
      options: ['long', 'int', 'char', 'boolean'],
      answer: 0,
      explain: 'An int stops at about 2.1 billion and wraps around silently past that. A long holds numbers up to about 9 quintillion.',
    },
    {
      t: 'mistakes',
      items: [
        {
          logic: true,
          wrong: prog(String.raw`        double average = (10 + 15) / 2;
        System.out.println(average);`),
          why: 'This prints 12.0, not 12.5. Both numbers in the division are ints, so the .5 was cut off before the answer reached the double. Divide by 2.0 instead.',
          right: prog(String.raw`        double average = (10 + 15) / 2.0;
        System.out.println(average);`),
        },
        {
          logic: true,
          wrong: prog(String.raw`        System.out.println("Sum: " + 5 + 3);`),
          why: 'This prints Sum: 53. Because the left side is text, the 5 and the 3 are joined as text one after the other. Put the addition in brackets: `"Sum: " + (5 + 3)`.',
          right: prog(String.raw`        System.out.println("Sum: " + (5 + 3));`),
        },
        {
          wrong: prog(String.raw`        int half = 5000 / 2.5;
        System.out.println(half);`),
          why: 'Dividing by 2.5 gives a double, and an int variable cannot keep a double. The compiler stops with “possible lossy conversion”. Use a double variable.',
          right: prog(String.raw`        double half = 5000 / 2.5;
        System.out.println(half);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        '`+ - * / %`: `%` is the remainder. `*`, `/` and `%` come before `+` and `-`; brackets come first.',
        'int divided by int gives an int: the decimals are cut off. Use a double (or a cast before dividing) for a decimal answer.',
        '`(double) x` and `(int) x` cast. `+=`, `-=`, `++` and `--` are shortcuts.',
        'An int that goes past 2,147,483,647 wraps around silently. Use `long` for big numbers.',
        'Text on either side of `+` makes it join, not add. Decimals are approximate, so keep money in whole shillings.',
      ],
      memory: 'Slash shares, percent leaves what is left.',
    },
  ],
  exercises: [
    {
      id: 'j4-interest',
      title: 'Interest at 5%',
      prompt: 'A member has `200000` shillings in a savings account that earns **5%** interest. The variable `savings` is given as a `double`. Print the interest and the new balance on two lines:\n\n`Interest: 10000.0`\n`New balance: 210000.0`',
      starter: prog('        double savings = 200000;\n        // Work out the interest (5%), then print both lines\n'),
      tests: [{ expected: 'Interest: 10000.0\nNew balance: 210000.0' }],
      hints: [
        '5% means 5 out of every 100. So the interest is `savings * 5 / 100`, or `savings * 0.05`.',
        'Store it: `double interest = savings * 5 / 100;` and the new balance is `savings + interest`.',
        'Print with `System.out.println("Interest: " + interest);` and then `System.out.println("New balance: " + (savings + interest));`. The brackets matter because of the text before the +.',
      ],
    },
    {
      id: 'j4-notes',
      title: 'Count the notes',
      prompt: 'A member withdraws `87500` shillings. The cashier pays as many 10,000 notes as possible. Print how many notes, and how much is left, exactly like this:\n\n`Notes: 8`\n`Rest: 7500`',
      starter: prog('        int amount = 87500;\n        // Use / and % to find the notes and the rest, then print\n'),
      tests: [{ expected: 'Notes: 8\nRest: 7500' }],
      hints: [
        'Think of the sacks of maize: how many whole 10,000s fit in 87500 is a job for integer division, and what remains is a job for the remainder.',
        '`int notes = amount / 10000;` and `int rest = amount % 10000;`',
        'Print each with its label: `System.out.println("Notes: " + notes);` and `System.out.println("Rest: " + rest);`',
      ],
    },
    {
      id: 'j4-average',
      title: 'The average of two marks',
      prompt: 'A member took two test marks: `71` and `84`, stored as ints. Print their average **with the decimal part**, exactly: `Average: 77.5`',
      starter: prog('        int first = 71;\n        int second = 84;\n        // Work out the average as a double, then print\n'),
      tests: [{ expected: 'Average: 77.5' }],
      hints: [
        'Adding gives 155. Dividing 155 by 2 with two ints would cut off the .5. You need a decimal division.',
        'Make one side a double: divide by `2.0`, or cast first with `(double)`.',
        '`double average = (first + second) / 2.0;` then `System.out.println("Average: " + average);`',
      ],
    },
  ],
};
