// C, Level 2 (continued): lessons 7 to 10 (for, while, nested loops, the till project).
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog } from './shared.js';

const LEVEL = 'Level 2: Decisions and loops';

const table = (n) => Array.from({ length: 12 }, (_, i) => `${n} x ${i + 1} = ${n * (i + 1)}`).join('\n');

export const loopLessons = [
  // ================================================================== 7
  {
    id: 'c-loops',
    level: LEVEL,
    minutes: 22,
    title: 'Repeating with for',
    summary: 'The for loop: counting, totals, counting down and stepping',
    blocks: [
      {
        t: 'story',
        title: 'Counting the mandazi',
        text: 'Mama Rose fries mandazi and puts ten in each tray. To check the tray she points at each one and counts: one, two, three, all the way to ten. She does the same small job again and again, and she knows exactly when to stop.\n\nA computer is brilliant at that. The loop that counts for you is called `for`.',
      },
      { t: 'p', text: 'Press **Run** to see a `for` loop count from 1 to 5.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int i;
    for (i = 1; i <= 5; i++) {
        printf("%d\n", i);
    }
    return 0;
}
`,
        output: '1\n2\n3\n4\n5',
      },
      { t: 'analogy', text: 'A `for` loop is a person walking up a staircase. The first part says which step to start on. The second part says when to stop climbing. The third part says how big each step is. At every step the body of the loop is done once.' },
      { t: 'h', text: 'The three parts' },
      {
        t: 'list',
        items: [
          '`i = 1` runs **once**, at the very start. It is where you begin.',
          '`i <= 5` is checked **before every round**. When it becomes false, the loop ends.',
          '`i++` runs **after every round** and adds 1 to `i`.',
          'The three parts are separated by **semicolons**, not commas.',
        ],
      },
      {
        t: 'predict',
        code: prog(String.raw`    int i;
    for (i = 0; i < 3; i++) {
        printf("%d\n", i);
    }`),
        question: 'What does this program print?',
        options: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3', '3'],
        answer: 0,
        explain: 'It starts at 0. The check is `i < 3`, so when `i` reaches 3 the check is false and the loop ends **before** printing 3. Starting at 0 and using `<` is how programmers often repeat something exactly 3 times.',
      },
      { t: 'h', text: 'Keeping a running total' },
      { t: 'p', text: 'A loop can read data too. This program reads how many marks there are, then reads each mark and adds it to `total`. Notice that `total` starts at 0, like an empty tin before you start collecting coins.' },
      {
        t: 'try',
        stdin: '3 70 85 60',
        code: String.raw`#include <stdio.h>

int main() {
    int n, i, mark, total = 0;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        scanf("%d", &mark);
        total = total + mark;
    }
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Total: 215',
      },
      { t: 'h', text: 'Counting down and in bigger steps' },
      { t: 'p', text: 'The loop does not have to count up by one. Use `i--` to count down, or `i -= 5` to take steps of 5.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int i;
    for (i = 10; i >= 0; i -= 5) {
        printf("%d\n", i);
    }
    return 0;
}
`,
        output: '10\n5\n0',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop prints 1, 2 and 3 (one step at a time).',
        template: prog(String.raw`    int i;
    for (i = 1; i <= 3; ___) {
        printf("%d\n", i);
    }`),
        blanks: [{ options: ['i++', 'i += 2', 'i += 3'], answer: 'i++' }],
        output: '1\n2\n3',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int i;
    for (i = 1, i <= 3, i++) {
        printf("%d\n", i);
    }`),
        question: 'This program refuses to run (“Parsing Failure”). What is wrong?',
        options: ['The three parts of `for` must be separated by semicolons, not commas', 'The loop variable must be called `n`', 'printf cannot be used inside a loop', 'The loop must start at 0'],
        answer: 0,
        explain: 'Inside `for ( ... )` the three parts are separated by two semicolons: `for (i = 1; i <= 3; i++)`. Commas mean something else in C.',
        fixed: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        printf("%d\n", i);
    }`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++);
    {
        printf("Hello\n");
    }`),
            why: 'The semicolon straight after the brackets is an **empty** loop body. The loop spins three times doing nothing, and then the curly brackets run once. You get one Hello instead of three.',
            right: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        printf("Hello\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int i;
    for (i = 1; i < 3; i++) {
        printf("%d\n", i);
    }`),
            why: 'The aim was to print 1, 2 and 3, but `<` stops **before** 3. This “off by one” mistake is the most common loop bug. Use `<=` to include the last number.',
            right: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        printf("%d\n", i);
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++)
        printf("Mandazi ");
        printf("done\n");`),
            why: 'Without curly brackets a loop repeats only the **one** statement right after it. The second printf runs once, after the loop. When the body has more than one statement, always use curly brackets.',
            right: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        printf("Mandazi ");
    }
    printf("done\n");`),
          },
        ],
      },
      { t: 'quiz', question: 'How many times does the body of `for (i = 0; i < 10; i++)` run?', options: ['10 times', '9 times', '11 times', 'Forever'], answer: 0, explain: 'i takes the values 0, 1, 2, ... 9. That is ten values, so ten rounds. The loop stops when i reaches 10 because `10 < 10` is false.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 4): the bulk price list',
        text: 'Students often buy mandazi in bulk. This loop prints a price list from 1 to 5 mandazi at 500 shillings each. Change the price or the number of rows.',
        code: String.raw`#include <stdio.h>

int main() {
    int qty;
    for (qty = 1; qty <= 5; qty++) {
        printf("%d mandazi: %d\n", qty, qty * 500);
    }
    return 0;
}
`,
        output: '1 mandazi: 500\n2 mandazi: 1000\n3 mandazi: 1500\n4 mandazi: 2000\n5 mandazi: 2500',
      },
      {
        t: 'recap',
        items: ['`for (start; check; step) { body }` repeats the body while the check is true.', 'The check happens before every round. `<` stops before the number, `<=` includes it.', 'Start a total at 0 and add to it inside the loop. Print it after the loop.', 'No semicolon straight after `for (...)`, and use curly brackets for more than one statement.'],
        memory: 'Start, check, step.',
      },
    ],
    exercises: [
      {
        id: 'c4-count',
        title: 'Count to N',
        prompt: 'Read a number N and print the numbers from 1 to N, each on its own line.',
        starter: prog('    int n, i;\n    // Read n, then loop from 1 to n\n'),
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: '1\n2\n3\n4\n5' },
          { input: '1', expected: '1' },
          { input: '3', expected: '1\n2\n3', hidden: true },
        ],
        hints: [
          'Use a `for` loop that starts at 1 and stops after n.',
          '`for (i = 1; i <= n; i++)` and print `i` followed by `\\n` inside the loop.',
          'A similar example: `for (i = 10; i >= 7; i--) { printf("%d\\n", i); }` counts down from 10 to 7. Yours counts up from 1 to n.',
        ],
      },
      {
        id: 'c4-sum',
        title: 'Sum to N',
        prompt: 'Read a number N and print the sum of 1 to N like this: `Sum: 15`',
        starter: prog('    int n, i, total = 0;\n    // Read n, add 1 to n into total, print it\n'),
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: 'Sum: 15' },
          { input: '10', expected: 'Sum: 55' },
          { input: '100', expected: 'Sum: 5050', hidden: true },
        ],
        hints: [
          'Keep a variable `total` that starts at 0 and add each number to it inside a loop.',
          'Inside the loop write `total = total + i;`. Print the total after the loop ends, not inside it.',
          'A similar example: to add only even numbers up to n, loop and add `i` when `i % 2 == 0`. Yours adds every number.',
        ],
      },
      {
        id: 'c4-table',
        title: 'Times table',
        prompt: 'Read a number N and print its times table from 1 to 12, one line each, like this:\n\n`7 x 1 = 7`\n`7 x 2 = 14`\n\n...up to `7 x 12 = 84`.',
        starter: prog('    int n, i;\n    // Read n, then print the table\n'),
        sampleInput: '7',
        usesInput: true,
        tests: [
          { input: '7', expected: table(7) },
          { input: '12', expected: table(12) },
          { input: '2', expected: table(2), hidden: true },
        ],
        hints: [
          'Loop i from 1 to 12 and print one line each time.',
          'Print three values in one line: `printf("%d x %d = %d\\n", n, i, n * i);`',
          'A similar example: `printf("%d + %d = %d\\n", a, b, a + b);` prints a sum line. Yours prints n, i and n * i.',
        ],
      },
      {
        id: 'c7-evens',
        title: 'Even numbers',
        prompt: 'Read a number N (at least 2) and print the even numbers from 2 up to N, each on its own line.',
        starter: prog('    int n, i;\n    // Read n, then print the even numbers up to n\n'),
        sampleInput: '10',
        usesInput: true,
        tests: [
          { input: '10', expected: '2\n4\n6\n8\n10' },
          { input: '7', expected: '2\n4\n6' },
          { input: '2', expected: '2', hidden: true },
        ],
        hints: [
          'Either loop over every number and print only the even ones, or step by 2.',
          'Start at 2 and add 2 each time: `for (i = 2; i <= n; i += 2)`.',
          'A similar example: `for (i = 5; i <= 20; i += 5) { printf("%d\\n", i); }` prints 5, 10, 15, 20.',
        ],
      },
      {
        id: 'c7-total',
        title: 'Add the marks',
        prompt: 'The first number is how many marks follow. Read them all and print the total like this: `Total: 215`',
        starter: prog('    int n, i, mark, total = 0;\n    // Read n, then read n marks and add them up\n'),
        sampleInput: '3 70 85 60',
        usesInput: true,
        tests: [
          { input: '3 70 85 60', expected: 'Total: 215' },
          { input: '1 99', expected: 'Total: 99' },
          { input: '4 10 20 30 40', expected: 'Total: 100', hidden: true },
        ],
        hints: [
          'Read n first. Then loop n times, reading one mark inside the loop.',
          'Inside the loop: `scanf("%d", &mark);` then `total = total + mark;`. Print the total after the loop.',
          'A similar example: read how many prices, then in a loop read each price and add it to a total.',
        ],
      },
    ],
  },

  // ================================================================== 8
  {
    id: 'c-while',
    level: LEVEL,
    minutes: 24,
    title: 'while, do while, break and continue',
    summary: 'Loops that run until something happens, loops that run at least once, and leaving a loop early',
    blocks: [
      {
        t: 'story',
        title: 'Saving for a phone',
        text: 'Kato wants a phone that costs 5,000 shillings more than he has. Every week he saves 1,500. He does not know in advance how many weeks it will take, so he just keeps saving **while** he has not reached the goal.\n\nWhen you do not know how many rounds you need, use a `while` loop. It repeats as long as its condition stays true.',
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int saved = 0, weeks = 0;
    while (saved < 5000) {
        saved = saved + 1500;
        weeks++;
    }
    printf("Weeks: %d\n", weeks);
    return 0;
}
`,
        output: 'Weeks: 4',
      },
      { t: 'analogy', text: 'A `while` loop is a security guard who asks the question **before** letting anyone in. If the answer is no, even the first round never happens. A `do while` loop is a guard who lets you in first and asks afterwards, so you always get at least one round.' },
      {
        t: 'predict',
        code: prog(String.raw`    int n = 10;
    do {
        printf("Once\n");
        n++;
    } while (n < 5);`),
        question: 'The condition `n < 5` is false from the start. What does this print?',
        options: ['Once', 'Nothing', 'Once\nOnce', 'Once forever'],
        answer: 0,
        explain: 'A `do while` loop runs its body first and checks the condition afterwards. The check fails, so the loop stops, but the body already ran once. A normal `while` with the same condition would print nothing.',
      },
      { t: 'h', text: 'Sentinel loops: stop when the user says so' },
      { t: 'p', text: 'Often the user keeps typing numbers and enters a special value, such as 0, to say “I am finished”. That special value is called a **sentinel**. Read the first number **before** the loop, and read the next one at the **bottom** of the loop.' },
      {
        t: 'try',
        stdin: '40 25 10 0',
        code: String.raw`#include <stdio.h>

int main() {
    int x, total = 0;
    scanf("%d", &x);
    while (x != 0) {
        total = total + x;
        scanf("%d", &x);
    }
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Total: 75',
      },
      { t: 'h', text: 'break and continue' },
      {
        t: 'list',
        items: ['`break` leaves the loop immediately.', '`continue` skips the rest of this round and goes on to the next one.'],
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int i;
    for (i = 1; i <= 100; i++) {
        if (i % 7 == 0) {
            printf("First multiple of 7: %d\n", i);
            break;
        }
    }
    return 0;
}
`,
        output: 'First multiple of 7: 7',
      },
      {
        t: 'predict',
        code: prog(String.raw`    int i;
    for (i = 1; i <= 5; i++) {
        if (i == 3) {
            continue;
        }
        printf("%d\n", i);
    }`),
        question: 'What does this program print?',
        options: ['1\n2\n4\n5', '1\n2', '1\n2\n3\n4\n5', '3'],
        answer: 0,
        explain: 'When `i` is 3 the `continue` skips the printf and jumps to the next round. So 3 is missing but the loop carries on to 4 and 5. A `break` would have stopped the whole loop instead.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop counts down 3, 2, 1.',
        template: prog(String.raw`    int n = 3;
    while (n ___ 0) {
        printf("%d\n", n);
        n--;
    }`),
        blanks: [{ options: ['>', '<', '=='], answer: '>' }],
        output: '3\n2\n1',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int n = 3;
    do {
        printf("%d\n", n);
        n--;
    } while (n > 0)`),
        question: 'This program refuses to run (“Parsing Failure”). What is wrong?',
        options: ['A `do while` loop must end with a semicolon after the condition', 'n cannot be decreased inside a loop', 'The condition must use `==`', 'do while needs curly brackets around the condition'],
        answer: 0,
        explain: 'The `do { ... } while (condition);` form is the one loop that ends with a semicolon, right after the closing round bracket.',
        fixed: prog(String.raw`    int n = 3;
    do {
        printf("%d\n", n);
        n--;
    } while (n > 0);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int n = 3;
    while (n > 0) {
        printf("%d\n", n);
    }`),
            why: 'Nothing inside the loop ever changes `n`, so `n > 0` stays true forever: an **infinite loop**. Every `while` body must change something the condition looks at. Add `n--;`.',
            right: prog(String.raw`    int n = 3;
    while (n > 0) {
        printf("%d\n", n);
        n--;
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int n = 3;
    while (n > 0);
    {
        printf("%d\n", n);
        n--;
    }`),
            why: 'The semicolon after `while (n > 0)` makes an empty body that never changes `n`, so the program hangs there. Never put `;` straight after `while (...)` (only the `do while` form ends with one).',
            right: prog(String.raw`    int n = 3;
    while (n > 0) {
        printf("%d\n", n);
        n--;
    }`),
          },
          {
            logic: true,
            stdin: '40 25 0',
            wrong: prog(String.raw`    int x = 1, count = 0;
    while (x != 0) {
        scanf("%d", &x);
        count++;
    }
    printf("Numbers: %d\n", count);`),
            why: 'The 0 that ends the list is read inside the loop and gets counted too, so the answer is one too big (3 instead of 2). Read the first value **before** the loop and the next value at the **end** of each round.',
            right: prog(String.raw`    int x, count = 0;
    scanf("%d", &x);
    while (x != 0) {
        count++;
        scanf("%d", &x);
    }
    printf("Numbers: %d\n", count);`),
          },
        ],
      },
      { t: 'quiz', question: 'Which loop always runs its body at least once?', options: ['`do { ... } while (...);`', '`while (...) { ... }`', '`for (...) { ... }`', 'None of them'], answer: 0, explain: 'Only `do while` checks the condition at the **bottom**, after the body has run once.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 5): the till adds up',
        text: 'The cashier types each price and finishes with 0. The program counts the items and adds them up. Try your own prices.',
        stdin: '2500 1000 500 0',
        code: String.raw`#include <stdio.h>

int main() {
    int price, items = 0, total = 0;
    scanf("%d", &price);
    while (price != 0) {
        items++;
        total = total + price;
        scanf("%d", &price);
    }
    printf("Items: %d\n", items);
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Items: 3\nTotal: 4000',
      },
      {
        t: 'recap',
        items: ['`while (condition)` checks first, so it may run zero times. `do { } while (condition);` checks last, so it runs at least once.', 'Every loop body must change something its condition depends on, or the loop never ends.', 'Sentinel pattern: read once before the loop, and read again at the bottom of the loop.', '`break` leaves the loop. `continue` jumps to the next round.'],
        memory: 'Change something, or loop forever.',
      },
    ],
    exercises: [
      {
        id: 'c8-sum0',
        title: 'Add until zero',
        prompt: 'Read whole numbers until you meet 0. Print their total like this: `Total: 75`. The 0 itself is not part of the total.',
        starter: prog('    int x, total = 0;\n    // Read numbers until 0 and add them up\n'),
        sampleInput: '40 25 10 0',
        usesInput: true,
        tests: [
          { input: '40 25 10 0', expected: 'Total: 75' },
          { input: '5 0', expected: 'Total: 5' },
          { input: '0', expected: 'Total: 0', name: 'Nothing to add' },
          { input: '1 2 3 4 0', expected: 'Total: 10', hidden: true },
        ],
        hints: [
          'Use a `while (x != 0)` loop. Read the first number before the loop.',
          'Inside the loop add `x` to `total`, then read the next number with `scanf` at the **bottom** of the loop.',
          'A similar example: count how many numbers were typed by adding `count++;` inside the same kind of loop.',
        ],
      },
      {
        id: 'c8-digits',
        title: 'Count the digits',
        prompt: 'Read a whole number that is at least 1. Print how many digits it has like this: `Digits: 4`.\n\nHint: dividing a number by 10 removes its last digit.',
        starter: prog('    int n, count = 0;\n    // Read n and count its digits\n'),
        sampleInput: '2500',
        usesInput: true,
        tests: [
          { input: '2500', expected: 'Digits: 4' },
          { input: '7', expected: 'Digits: 1' },
          { input: '90', expected: 'Digits: 2' },
          { input: '123456', expected: 'Digits: 6', hidden: true },
        ],
        hints: [
          'Repeat while `n` is bigger than 0. Each round, throw away the last digit and add 1 to a counter.',
          'Inside `while (n > 0)` do `n = n / 10;` and `count++;`. Integer division throws away the remainder.',
          'A similar example: `while (x >= 100) { x = x - 100; rounds++; }` counts how many 100s fit in x.',
        ],
      },
      {
        id: 'c8-save',
        title: 'Weeks to save',
        prompt: 'Read a goal and a weekly saving (both in shillings). Print how many weeks it takes to save at least the goal, like this: `Weeks: 4`.',
        starter: prog('    int goal, weekly, saved = 0, weeks = 0;\n    // Read goal and weekly, then count the weeks\n'),
        sampleInput: '5000 1500',
        usesInput: true,
        tests: [
          { input: '5000 1500', expected: 'Weeks: 4' },
          { input: '3000 1000', expected: 'Weeks: 3', name: 'Reaches the goal exactly' },
          { input: '1000 1000', expected: 'Weeks: 1', hidden: true },
          { input: '10000 300', expected: 'Weeks: 34', hidden: true },
        ],
        hints: [
          'Keep adding the weekly amount to `saved` while `saved` is still less than the goal.',
          '`while (saved < goal) { saved = saved + weekly; weeks++; }` then print `weeks`.',
          'A similar example: `while (water < 20) { water = water + 5; trips++; }` counts how many trips fill a 20 litre jerrycan.',
        ],
      },
    ],
  },

  // ================================================================== 9
  {
    id: 'c-nested',
    level: LEVEL,
    minutes: 24,
    title: 'Loops inside loops',
    summary: 'Nested loops: grids, triangles and tables',
    blocks: [
      {
        t: 'story',
        title: 'The lecture hall',
        text: 'A lecture hall has rows, and every row has seats. To count all the seats you walk along **row 1** from the first seat to the last, then **row 2**, then **row 3**.\n\nThe rows are one loop. The seats in a row are another loop **inside** it. That is a nested loop, and it is how programs draw grids, tables and patterns.',
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int row, col;
    for (row = 1; row <= 3; row++) {
        for (col = 1; col <= 4; col++) {
            printf("*");
        }
        printf("\n");
    }
    return 0;
}
`,
        output: '****\n****\n****',
      },
      { t: 'analogy', text: 'Think of a clock. The minute hand goes all the way round (60 minutes) for every single step of the hour hand. The **inner** loop finishes completely, then the **outer** loop takes one step, and the inner loop starts again from the beginning.' },
      {
        t: 'list',
        items: ['The outer loop picks the **row**.', 'The inner loop fills the **row**, one column at a time.', '`printf("\\n");` after the inner loop ends the row.', 'Use a **different variable** for each loop (`row` and `col`, or `i` and `j`).'],
      },
      {
        t: 'predict',
        code: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++) {
            printf("%d", j);
        }
        printf("\n");
    }`),
        question: 'What does this program print?',
        options: ['123\n123', '123', '111\n222', '12\n12'],
        answer: 0,
        explain: 'The outer loop runs twice. Each time, the inner loop prints 1, 2, 3 on one line (no `\\n` between), and then the `printf("\\n")` ends the line. So the line 123 appears twice.',
      },
      { t: 'h', text: 'When the inner loop depends on the outer one' },
      { t: 'p', text: 'The inner loop can use the outer variable in its condition. Here row 1 gets 1 star, row 2 gets 2 stars, row 3 gets 3, and so on: a triangle.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int i, j;
    for (i = 1; i <= 4; i++) {
        for (j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\n");
    }
    return 0;
}
`,
        output: '*\n**\n***\n****',
      },
      { t: 'h', text: 'Tables' },
      { t: 'p', text: 'A multiplication table is a grid too: row `i`, column `j`, value `i * j`.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int i, j;
    for (i = 1; i <= 3; i++) {
        printf("Row %d:", i);
        for (j = 1; j <= 4; j++) {
            printf(" %d", i * j);
        }
        printf("\n");
    }
    return 0;
}
`,
        output: 'Row 1: 1 2 3 4\nRow 2: 2 4 6 8\nRow 3: 3 6 9 12',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the inner loop prints as many # signs as the row number (a triangle).',
        template: prog(String.raw`    int i, j;
    for (i = 1; i <= 3; i++) {
        for (j = 1; j <= ___; j++) {
            printf("#");
        }
        printf("\n");
    }`),
        blanks: [{ options: ['i', '3', '1'], answer: 'i' }],
        output: '#\n##\n###',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++ {
            printf("*");
        }
        printf("\n");
    }`),
        question: 'This program refuses to run (“Parsing Failure”). What is wrong?',
        options: ['The inner `for` is missing its closing round bracket', 'You cannot put a loop inside a loop', 'Both loops must use the same variable', 'printf("\\n") is not allowed there'],
        answer: 0,
        explain: 'Look at `for (j = 1; j <= 3; j++ {`: the round bracket opened after `for` is never closed. With nested loops, count your brackets carefully, and indent the inner loop so you can see which closing `}` belongs to which loop.',
        fixed: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++) {
            printf("*");
        }
        printf("\n");
    }`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        for (i = 1; i <= 3; i++) {
            printf("*");
        }
        printf("\n");
    }`),
            why: 'Both loops share the variable `i`. The inner loop leaves `i` at 4, so the outer loop thinks it is finished after one row. You get only one row instead of three. Give each loop its own variable.',
            right: prog(String.raw`    int i, j;
    for (i = 1; i <= 3; i++) {
        for (j = 1; j <= 3; j++) {
            printf("*");
        }
        printf("\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++) {
            printf("*");
            printf("\n");
        }
    }`),
            why: 'The new line is inside the **inner** loop, so every star gets its own line. The new line belongs after the inner loop, but still inside the outer one.',
            right: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++) {
            printf("*");
        }
        printf("\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++) {
            printf("*");
        }
    }`),
            why: 'Nobody told the program to end each row, so all six stars run together on one line. Add `printf("\\n");` after the inner loop.',
            right: prog(String.raw`    int i, j;
    for (i = 1; i <= 2; i++) {
        for (j = 1; j <= 3; j++) {
            printf("*");
        }
        printf("\n");
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'The outer loop runs 4 times and the inner loop runs 5 times for each outer round. How many times does the innermost statement run in total?', options: ['20', '9', '4', '5'], answer: 0, explain: 'The inner loop finishes completely (5 rounds) for **every** outer round (4 of them), so 4 × 5 = 20.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 6): the bulk price chart',
        text: 'A grid of prices for the notice board: each row is a quantity, and each column is a price level of 500, 1000 or 1500 shillings per item.',
        code: String.raw`#include <stdio.h>

int main() {
    int qty, level;
    for (qty = 1; qty <= 3; qty++) {
        printf("Qty %d:", qty);
        for (level = 1; level <= 3; level++) {
            printf(" %d", qty * level * 500);
        }
        printf("\n");
    }
    return 0;
}
`,
        output: 'Qty 1: 500 1000 1500\nQty 2: 1000 2000 3000\nQty 3: 1500 3000 4500',
      },
      {
        t: 'recap',
        items: ['A loop inside a loop: the inner loop runs completely for every round of the outer loop.', 'Rows are the outer loop, columns are the inner loop. End each row with `printf("\\n");` **after** the inner loop.', 'Use a different variable for each loop.', 'If the inner limit uses the outer variable, you get a triangle.'],
        memory: 'Inner loop finishes first.',
      },
    ],
    exercises: [
      {
        id: 'c9-square',
        title: 'A square of hashes',
        prompt: 'Read a number N and print a square of `#` signs with N rows and N columns.\n\nFor 3 it prints:\n\n`###`\n`###`\n`###`',
        starter: prog('    int n, row, col;\n    // Read n and print the square\n'),
        sampleInput: '3',
        usesInput: true,
        tests: [
          { input: '3', expected: '###\n###\n###' },
          { input: '1', expected: '#' },
          { input: '4', expected: '####\n####\n####\n####', hidden: true },
        ],
        hints: [
          'You need two loops: one for the rows and one for the columns inside it.',
          'The outer loop runs n times. Inside it, an inner loop prints n hashes, and after the inner loop you print `\\n`.',
          'A similar example: two loops with `row <= 2` and `col <= 5` print two rows of five stars.',
        ],
      },
      {
        id: 'c9-stairs',
        title: 'Number stairs',
        prompt: 'Read a number N and print N rows. Row number `i` contains the digit `i` written `i` times.\n\nFor 4 it prints:\n\n`1`\n`22`\n`333`\n`4444`',
        starter: prog('    int n, i, j;\n    // Read n and print the stairs\n'),
        sampleInput: '4',
        usesInput: true,
        tests: [
          { input: '4', expected: '1\n22\n333\n4444' },
          { input: '1', expected: '1' },
          { input: '3', expected: '1\n22\n333', hidden: true },
        ],
        hints: [
          'Row `i` has `i` copies of the digit `i`. So the inner loop depends on the outer variable.',
          'Outer loop: `for (i = 1; i <= n; i++)`. Inner loop: `for (j = 1; j <= i; j++)` and print `i` with `%d`. End each row with `\\n`.',
          'A similar example: the triangle of stars in this lesson prints `*` where you need to print the number `i`.',
        ],
      },
      {
        id: 'c9-grid',
        title: 'Multiplication grid',
        prompt: 'Read a number N and print an N by N multiplication grid. Separate the numbers in a row with a single space, with no space at the end of the row.\n\nFor 3 it prints:\n\n`1 2 3`\n`2 4 6`\n`3 6 9`',
        starter: prog('    int n, i, j;\n    // Read n and print the grid\n'),
        sampleInput: '3',
        usesInput: true,
        tests: [
          { input: '3', expected: '1 2 3\n2 4 6\n3 6 9' },
          { input: '1', expected: '1' },
          { input: '4', expected: '1 2 3 4\n2 4 6 8\n3 6 9 12\n4 8 12 16', hidden: true },
        ],
        hints: [
          'The number in row `i` and column `j` is `i * j`. Use two loops from 1 to n.',
          'Print the number with `printf("%d", i * j);`. Print a space only when this is not the last column: `if (j < n) { printf(" "); }`. End the row after the inner loop.',
          'A similar example: to print `a,b,c` without a comma at the end, print the comma only when the item is not the last one.',
        ],
      },
    ],
  },

  // ================================================================== 10
  {
    id: 'c-till',
    level: LEVEL,
    minutes: 28,
    title: 'Project: the Campus Duuka till',
    summary: 'Put decisions and loops together to build a working shop till',
    blocks: [
      {
        t: 'story',
        title: 'Opening day at the duuka',
        text: 'The Campus Duuka opens on Monday and the queue is already long. Mama Rose does not want to add up prices on paper any more. She wants a till: it takes each item the customer buys, adds up the total, gives a discount to big spenders, and works out the change.\n\nYou already know everything needed. This lesson puts it together, one small piece at a time.',
      },
      { t: 'h', text: 'Plan first, then code' },
      { t: 'p', text: 'Remember lesson 1: break the problem into steps before writing any C.' },
      {
        t: 'list',
        items: ['1. Repeat: read an item number. Stop when it is 0.', '2. For each item, read how many, work out the price, add it to the total.', '3. If the total is 5,000 or more, give 10% off.', '4. Read the money paid and print the change.'],
      },
      { t: 'h', text: 'Piece 1: collecting the items' },
      { t: 'p', text: 'This is a sentinel loop (lesson 8) with a `switch` (lesson 6) inside it. The input is `item qty` pairs and a 0 at the end: `1 4  3 2  2 1  0` means 4 mandazi, 2 rolex and 1 tea.' },
      {
        t: 'project',
        title: 'Till piece 1: the total',
        text: 'Run it, then change the input.',
        stdin: '1 4 3 2 2 1 0',
        code: String.raw`#include <stdio.h>

int main() {
    int item, qty, price, total = 0;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        price = 0;
        switch (item) {
            case 1:
                price = 500;
                break;
            case 2:
                price = 1000;
                break;
            case 3:
                price = 2500;
                break;
            default:
                printf("No such item\n");
        }
        total = total + price * qty;
        scanf("%d", &item);
    }
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Total: 8000',
      },
      { t: 'h', text: 'Piece 2: the discount and the change' },
      { t: 'p', text: 'Add the decision from lesson 5 and read the money the customer paid. If the customer pays too little, the till says so instead of printing a negative change.' },
      {
        t: 'project',
        title: 'The finished till',
        text: 'The input ends with the amount paid: `1 4 3 2 2 1 0 10000`. Try paying only 5000.',
        stdin: '1 4 3 2 2 1 0 10000',
        code: String.raw`#include <stdio.h>

int main() {
    int item, qty, price, total = 0, discount = 0, pay, paid;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        price = 0;
        switch (item) {
            case 1:
                price = 500;
                break;
            case 2:
                price = 1000;
                break;
            case 3:
                price = 2500;
                break;
            default:
                printf("No such item\n");
        }
        total = total + price * qty;
        scanf("%d", &item);
    }
    if (total >= 5000) {
        discount = total / 10;
    }
    pay = total - discount;
    scanf("%d", &paid);
    printf("Total: %d\n", total);
    printf("Discount: %d\n", discount);
    printf("Pay: %d\n", pay);
    if (paid >= pay) {
        printf("Change: %d\n", paid - pay);
    } else {
        printf("Not enough money\n");
    }
    return 0;
}
`,
        output: 'Total: 8000\nDiscount: 800\nPay: 7200\nChange: 2800',
      },
      {
        t: 'predict',
        stdin: '1 2 0 500',
        code: String.raw`#include <stdio.h>

int main() {
    int item, qty, total = 0, pay, paid;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        total = total + 500 * qty;
        scanf("%d", &item);
    }
    pay = total;
    scanf("%d", &paid);
    if (paid >= pay) {
        printf("Change: %d\n", paid - pay);
    } else {
        printf("Not enough money\n");
    }
    return 0;
}
`,
        question: 'The customer buys 2 mandazi (500 each) and pays 500. What does the till print?',
        options: ['Not enough money', 'Change: 0', 'Change: -500', 'Total: 1000'],
        answer: 0,
        explain: 'The total is 1000 but only 500 was paid. `paid >= pay` is false, so the `else` road prints the warning. Always protect your program against a customer paying too little.',
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int item, qty, price = 0, total = 0;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        switch (item) {
            case 1:
                price = 500;
            case 2:
                price = 1000;
        }
        total = total + price * qty;
        scanf("%d", &item);
    }
    printf("Total: %d\n", total);`),
            stdin: '1 2 0',
            why: 'Without `break`, item 1 falls into case 2 and ends up priced 1000 instead of 500. Inside loops, a forgotten `break` in a `switch` quietly gives wrong totals.',
            right: prog(String.raw`    int item, qty, price = 0, total = 0;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        switch (item) {
            case 1:
                price = 500;
                break;
            case 2:
                price = 1000;
                break;
        }
        total = total + price * qty;
        scanf("%d", &item);
    }
    printf("Total: %d\n", total);`),
          },
          {
            logic: true,
            stdin: '1 2 0',
            wrong: prog(String.raw`    int item, qty, total = 0;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        total = 500 * qty;
        scanf("%d", &item);
    }
    printf("Total: %d\n", total);`),
            why: 'The line says `total = 500 * qty` instead of `total = total + 500 * qty`, so each customer item **replaces** the total instead of adding to it. The last item wins and the rest are forgotten.',
            right: prog(String.raw`    int item, qty, total = 0;
    scanf("%d", &item);
    while (item != 0) {
        scanf("%d", &qty);
        total = total + 500 * qty;
        scanf("%d", &item);
    }
    printf("Total: %d\n", total);`),
          },
        ],
      },
      { t: 'quiz', question: 'In the finished till, why is `price = 0;` written at the top of every round of the loop?', options: ['So that an unknown item adds 0 instead of reusing the last item’s price', 'Because C does not allow a price above 0', 'To make the loop stop', 'To print the price'], answer: 0, explain: 'If the customer types an item number that is not on the menu, `price` is never set in that round. Resetting it to 0 first means the unknown item adds nothing, rather than silently repeating the previous price.' },
      {
        t: 'recap',
        items: ['Plan in steps first, then write each step as a small piece of C.', 'A sentinel `while` loop collects items; a `switch` inside it finds each price.', 'Decisions after the loop handle the discount and the change.', 'Reset values that belong to one round (like `price`) at the start of that round.'],
        memory: 'Plan, loop, decide, print.',
      },
    ],
    exercises: [
      {
        id: 'c10-till',
        title: 'Shop till',
        prompt: 'Read item prices until you meet 0 (the 0 is not an item). Print four lines:\n\n`Items: <how many>`\n`Total: <sum of prices>`\n`Discount: <discount>`\n`Pay: <total minus discount>`\n\nThe discount is one tenth of the total (whole shillings) when the total is **10000 or more**, otherwise 0.',
        starter: prog('    int price, items = 0, total = 0, discount = 0;\n    // Read prices until 0, then print the four lines\n'),
        sampleInput: '6000 5000 0',
        usesInput: true,
        tests: [
          { input: '2500 1000 500 0', expected: 'Items: 3\nTotal: 4000\nDiscount: 0\nPay: 4000' },
          { input: '6000 5000 0', expected: 'Items: 2\nTotal: 11000\nDiscount: 1100\nPay: 9900' },
          { input: '0', expected: 'Items: 0\nTotal: 0\nDiscount: 0\nPay: 0', name: 'Empty basket', hidden: true },
          { input: '10000 0', expected: 'Items: 1\nTotal: 10000\nDiscount: 1000\nPay: 9000', name: 'Exactly 10000', hidden: true },
        ],
        hints: [
          'Use a sentinel loop to add up the prices and count the items. Then decide about the discount after the loop.',
          'Read the first price, `while (price != 0)`, count and add inside, and read the next price at the bottom. After the loop, `if (total >= 10000) { discount = total / 10; }`.',
          'A similar example: lesson 8 printed `Items` and `Total` from a loop like this. The new part is the `if` for the discount and the two extra lines.',
        ],
      },
    ],
  },
];
