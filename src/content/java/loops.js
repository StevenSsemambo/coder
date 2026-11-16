// Java, Level 2, lesson 7: Repeating with loops.
import { prog, imp, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const S = (body) => prog(body, SCAN);

export const loopsLesson = {
  id: 'j-loops',
  level: LEVEL,
  minutes: 30,
  title: 'Repeating with loops',
  summary: 'while, for and do-while, counting, running totals, break and continue',
  blocks: [
    {
      t: 'story',
      title: 'A hundred and twenty receipts',
      text: 'On the last Saturday of the month Mama Rose must write a receipt for every one of the 120 members. If she had to write out each instruction separately (“take the first member, write the receipt, take the second member, write the receipt…”) she would never finish.\n\nSo she makes one rule: **“For every member in the list, write a receipt.”** One rule, repeated 120 times. A computer is happiest doing exactly this, and a Java **loop** is how you say it. Repetition is the third building block of every program, after sequence and selection.',
    },
    { t: 'h', text: 'while: repeat as long as a question is true' },
    { t: 'p', text: 'A `while` loop asks a question, like an `if`. If the answer is yes, it runs the block and then **asks again**. It stops as soon as the answer is no. Here a member saves 30,000 shillings a month until she has at least 100,000.' },
    {
      t: 'try',
      code: prog(String.raw`        int month = 1;
        int savings = 0;
        while (savings < 100000) {
            savings += 30000;
            System.out.println("Month " + month + ": " + savings);
            month++;
        }`),
      output: 'Month 1: 30000\nMonth 2: 60000\nMonth 3: 90000\nMonth 4: 120000',
    },
    { t: 'analogy', text: 'A loop is a cook stirring a pot of posho. “Is it thick enough yet? No. Stir. Is it thick enough yet? No. Stir. Is it thick enough yet? Yes. Stop.” The question is checked **before every stir**, and the stirring must really make the pot thicker, otherwise the cook stirs forever.' },
    { t: 'tip', text: 'Something **inside** the loop must change what the question depends on. In the example, `savings += 30000;` moves savings closer to 100000. If nothing changes, the question stays true forever: an **infinite loop**. In SayMaCoder the app stops a runaway program after a few seconds.' },
    { t: 'h', text: 'for: when you know how many times' },
    { t: 'p', text: 'Counting loops are so common that Java has a shorter form. The header of a `for` has three parts, separated by **semicolons**:' },
    {
      t: 'list',
      items: [
        '**start**: `int i = 1` runs once, before the first round. It creates the counter.',
        '**question**: `i <= 5` is checked before every round. The loop continues while it is true.',
        '**step**: `i++` runs after every round, to move the counter on.',
      ],
    },
    {
      t: 'try',
      code: prog(String.raw`        for (int i = 1; i <= 5; i++) {
            System.out.println(i + " x 7 = " + (i * 7));
        }`),
      output: '1 x 7 = 7\n2 x 7 = 14\n3 x 7 = 21\n4 x 7 = 28\n5 x 7 = 35',
    },
    {
      t: 'predict',
      code: prog(String.raw`        for (int i = 0; i < 3; i++) {
            System.out.println(i);
        }`),
      question: 'What does this program print?',
      options: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3', '1\n2'],
      answer: 0,
      explain: 'The counter starts at 0. The loop runs while i < 3, so the rounds are for 0, 1 and 2. When i becomes 3, the question is false and the loop stops without running for 3. Starting at 0 and using < is the standard way to repeat exactly N times.',
    },
    { t: 'h', text: 'The running total: the most useful loop pattern' },
    { t: 'p', text: 'Create a variable **before** the loop, and add to it **inside** the loop. After the loop, the variable holds the answer. Programmers call it an **accumulator**.' },
    {
      t: 'try',
      code: prog(String.raw`        int total = 0;
        for (int i = 1; i <= 10; i++) {
            total += i;
        }
        System.out.println("Sum of 1 to 10: " + total);`),
      output: 'Sum of 1 to 10: 55',
    },
    { t: 'p', text: 'Now a real job: read how many deposits there are, then read each deposit and add it up. The input is `3`, then the three amounts.' },
    {
      t: 'try',
      stdin: '3\n20000\n35000\n15000',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int amount = in.nextInt();
            sum += amount;
        }
        System.out.println("Total: " + sum);`),
      output: 'Total: 70000',
    },
    { t: 'h', text: 'do-while: at least once' },
    { t: 'p', text: 'A `do-while` loop runs the block **first** and asks the question **afterwards**. Use it when the block must happen at least once, such as asking for a PIN. Notice the semicolon after the closing `while (...)`.' },
    {
      t: 'try',
      stdin: '1111 2222 1234',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int pin;
        do {
            System.out.println("Enter PIN:");
            pin = in.nextInt();
        } while (pin != 1234);
        System.out.println("Welcome");`),
      output: 'Enter PIN:\nEnter PIN:\nEnter PIN:\nWelcome',
    },
    { t: 'h', text: 'break and continue' },
    {
      t: 'list',
      items: [
        '`break;` leaves the loop immediately.',
        '`continue;` skips the rest of this round and goes straight to the next one.',
      ],
    },
    { t: 'p', text: 'A very common pattern is to read numbers until the user types a **sentinel**, a special value that means “stop”. Here a negative number ends the list.' },
    {
      t: 'try',
      stdin: '10 20 30 -1',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int sum = 0;
        while (true) {
            int x = in.nextInt();
            if (x < 0) {
                break;
            }
            sum += x;
        }
        System.out.println("Sum: " + sum);`),
      output: 'Sum: 60',
    },
    {
      t: 'try',
      code: prog(String.raw`        for (int i = 1; i <= 6; i++) {
            if (i == 3) {
                continue;
            }
            System.out.print(i + " ");
        }
        System.out.println();`),
      output: '1 2 4 5 6',
    },
    { t: 'h', text: 'Which loop do I choose?' },
    {
      t: 'list',
      items: [
        '**for**: you know how many times, or you are counting.',
        '**while**: you repeat until something happens, and you may not repeat at all.',
        '**do-while**: you repeat until something happens, and the block must run at least once.',
      ],
    },
    {
      t: 'fill',
      prompt: 'Choose the comparison so that the loop prints the numbers **1 to 5**, including 5.',
      template: prog(String.raw`        for (int i = 1; i ___ 5; i++) {
            System.out.println(i);
        }`),
      blanks: [{ options: ['<=', '<', '>='], answer: '<=' }],
      output: '1\n2\n3\n4\n5',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to add up the numbers 1 to 5. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        int total = 0;`,
        String.raw`        for (int i = 1; i <= 5; i++) {`,
        String.raw`            total += i;`,
        String.raw`        }`,
        String.raw`        System.out.println("Total: " + total);`,
        ...TAIL,
      ],
      output: 'Total: 15',
    },
    {
      t: 'bug',
      code: prog(String.raw`        for (int i = 0, i < 3; i++) {
            System.out.println(i);
        }`),
      question: 'The compiler refuses this loop. What is the mistake?',
      options: ['The three parts of a for header are separated by semicolons, not commas', 'The loop variable must be called x', 'println cannot be used in a loop', 'The loop needs the word while'],
      answer: 0,
      explain: 'The header of a for loop has start; question; step. After int i = 0 there must be a semicolon, but there is a comma.',
      fixed: prog(String.raw`        for (int i = 0; i < 3; i++) {
            System.out.println(i);
        }`),
    },
    {
      t: 'quiz',
      question: 'How many times does the body of `for (int i = 1; i <= 4; i++)` run?',
      options: ['4', '3', '5', 'Forever'],
      answer: 0,
      explain: 'i takes the values 1, 2, 3 and 4, and the loop stops when i becomes 5. That is four rounds.',
    },
    {
      t: 'quiz',
      question: 'Which loop always runs its block at least once?',
      options: ['do-while', 'while', 'for', 'none of them'],
      answer: 0,
      explain: 'do-while runs the block first and checks the question afterwards. while and for check first, so they may not run at all.',
    },
    {
      t: 'quiz',
      question: 'What does `continue;` do inside a loop?',
      options: ['Skips the rest of this round and starts the next round', 'Leaves the loop completely', 'Ends the program', 'Does nothing'],
      answer: 0,
      explain: 'continue jumps to the next round. break is the one that leaves the loop.',
    },
    {
      t: 'mistakes',
      items: [
        {
          logic: true,
          wrong: prog(String.raw`        int count = 1;
        while (count <= 3) {
            System.out.println(count);
        }`),
          why: 'Nothing inside the loop changes `count`, so the question `count <= 3` stays true forever. The program prints 1 again and again until the app stops it. Add `count++;` inside the loop.',
          right: prog(String.raw`        int count = 1;
        while (count <= 3) {
            System.out.println(count);
            count++;
        }`),
        },
        {
          logic: true,
          wrong: prog(String.raw`        for (int i = 1; i < 5; i++) {
            System.out.println(i);
        }`),
          why: 'The loop stops when i reaches 5, so it prints only 1 to 4. To include 5, use `i <= 5`. This kind of mistake, one round too few or too many, is called an off-by-one error.',
          right: prog(String.raw`        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }`),
        },
        {
          logic: true,
          wrong: prog(String.raw`        for (int i = 0; i < 3; i++); {
            System.out.println("Hi");
        }`),
          why: 'The semicolon right after the for header is an empty loop body. The loop spins three times doing nothing, and then the block runs **once**. This prints Hi one time, not three times. Never put `;` straight after `for (...)`.',
          right: prog(String.raw`        for (int i = 0; i < 3; i++) {
            System.out.println("Hi");
        }`),
        },
        {
          wrong: prog(String.raw`        for (int i = 0; i < 3; i++) {
        }
        System.out.println(i);`),
          why: 'The counter `i` exists only inside the loop. After the closing bracket it is gone, so Java cannot find it. A variable can be used only inside the curly brackets where it was created: this rule is called **scope**.',
          right: prog(String.raw`        int i;
        for (i = 0; i < 3; i++) {
        }
        System.out.println(i);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        '`while (question) { ... }` repeats while the question is true. Something inside must change the answer.',
        '`for (start; question; step) { ... }` is for counting. `for (int i = 0; i < n; i++)` repeats exactly n times.',
        '`do { ... } while (question);` always runs the block at least once.',
        'A running total: create the variable before the loop, add to it inside. `break` leaves, `continue` skips to the next round.',
        'A variable created inside a loop is gone after it (scope). Watch for off-by-one errors.',
      ],
      memory: 'Ask, do, change, ask again.',
    },
  ],
  exercises: [
    {
      id: 'j7-countdown',
      title: 'The countdown',
      prompt: 'Print the numbers from 5 down to 1, one per line, and then the word `Go!`.',
      starter: prog('        // Count down with a for loop, then print Go!\n'),
      tests: [{ expected: '5\n4\n3\n2\n1\nGo!' }],
      hints: [
        'A loop can count down: start at 5, keep going while the counter is at least 1, and take 1 away each time with `i--`.',
        '`for (int i = 5; i >= 1; i--) { System.out.println(i); }`',
        'After the closing bracket of the loop, add `System.out.println("Go!");` once.',
      ],
    },
    {
      id: 'j7-sum-n',
      title: 'Sum from 1 to n',
      prompt: 'Read a whole number n. Print the sum of all the numbers from 1 to n, like this: `Sum: 55`. If n is 0 the sum is 0.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n, then add up 1 to n with a loop\n', SCAN),
      sampleInput: '10',
      usesInput: true,
      tests: [
        { input: '10', expected: 'Sum: 55' },
        { input: '100', expected: 'Sum: 5050' },
        { input: '1', expected: 'Sum: 1', hidden: true },
        { input: '0', expected: 'Sum: 0', hidden: true },
      ],
      hints: [
        'Use a running total: a variable `sum` that starts at 0 before the loop.',
        '`for (int i = 1; i <= n; i++) { sum += i; }`',
        'Print after the loop: `System.out.println("Sum: " + sum);`. When n is 0 the loop does not run at all, and the sum stays 0.',
      ],
    },
    {
      id: 'j7-table',
      title: 'A times table',
      prompt: 'Read a number and print its times table from 1 to 10, one line each, like this for 7:\n\n`7 x 1 = 7`\n`7 x 2 = 14`\n`...`\n`7 x 10 = 70`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the number, then loop from 1 to 10\n', SCAN),
      sampleInput: '7',
      usesInput: true,
      tests: [
        { input: '7', expected: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70' },
        { input: '12', expected: '12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60\n12 x 6 = 72\n12 x 7 = 84\n12 x 8 = 96\n12 x 9 = 108\n12 x 10 = 120', hidden: true },
      ],
      hints: [
        'A for loop counting i from 1 to 10 gives you the second number of every line.',
        'Inside the loop, print the number, the counter and their product, joined with `+`. The product needs brackets: `(n * i)`.',
        '`System.out.println(n + " x " + i + " = " + (n * i));`',
      ],
    },
    {
      id: 'j7-deposits',
      title: 'The day’s deposits',
      prompt: 'The first number is how many deposits were made today. Then come the deposits. Print the total and the largest deposit:\n\n`Total: 70000`\n`Largest: 35000`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n, then n deposits. Keep a total and the largest so far.\n', SCAN),
      sampleInput: '3\n20000\n35000\n15000',
      usesInput: true,
      tests: [
        { input: '3\n20000\n35000\n15000', expected: 'Total: 70000\nLargest: 35000' },
        { input: '1\n5000', expected: 'Total: 5000\nLargest: 5000' },
        { input: '4\n100\n900\n300\n900', expected: 'Total: 2200\nLargest: 900', hidden: true },
      ],
      hints: [
        'You need two variables before the loop: `sum` starting at 0 and `largest` starting at 0 (all deposits are positive).',
        'Inside the loop, read an amount, add it to `sum`, and if it is bigger than `largest`, store it in `largest`.',
        '`if (amount > largest) { largest = amount; }` inside the loop. Print both after the loop.',
      ],
    },
    {
      id: 'j7-pin',
      title: 'Count the attempts',
      prompt: 'A member types numbers until she types the correct PIN, `1234`. Read numbers until you see 1234, then print how many attempts she needed, like this: `Attempts: 3`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Keep reading until the number is 1234, counting the attempts\n', SCAN),
      sampleInput: '1111 2222 1234',
      usesInput: true,
      tests: [
        { input: '1111 2222 1234', expected: 'Attempts: 3' },
        { input: '1234', expected: 'Attempts: 1' },
        { input: '5 1234', expected: 'Attempts: 2', hidden: true },
      ],
      hints: [
        'The member must try at least once, so a do-while fits. Keep a counter `attempts` that starts at 0.',
        'In the loop: read a number into `pin` and add 1 to `attempts`. The loop continues while `pin != 1234`.',
        'Declare `int pin;` before the loop so that the loop condition can see it. Print `"Attempts: " + attempts` afterwards.',
      ],
    },
  ],
};
