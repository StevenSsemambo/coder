// C++, Level 2: Decisions and loops. Lessons 6 to 8 (for, while, nested loops).
import { prog, HEAD, HEAD_FMT, IO_FMT } from './shared.js';

const LEVEL = 'Level 2: Decisions and loops';

export const loopLessons = [
  // ================================================================== 6
  {
    id: 'cpp-loops',
    level: LEVEL,
    minutes: 24,
    title: 'Repeating with for',
    summary: 'The for loop: start, condition, step. Counting up, counting down, totals and tables',
    blocks: [
      {
        t: 'story',
        title: 'Ten rolex for the hostel',
        text: 'A hostel orders **ten rolex** at once. Mama Rose does the same steps ten times: crack the eggs, fry, roll. She does not give herself ten separate sets of instructions. She tells herself “do this ten times” and keeps count on her fingers.\n\nThe third building block of every program is **repetition**. In C++ the `for` loop is the tool for “do this a known number of times”.',
      },
      { t: 'p', text: 'A `for` loop has three parts inside its round brackets, separated by **semicolons**:' },
      {
        t: 'list',
        items: [
          '**Start:** `int i = 1;` creates a counter called `i` and starts it at 1.',
          '**Keep going while:** `i <= 3;` is checked before every round. When it is false, the loop ends.',
          '**Step:** `i++` runs after every round. It adds 1 to the counter.',
        ],
      },
      { t: 'analogy', text: 'Climbing stairs: you start on step 1, you keep climbing while you have not passed step 3, and after each step you move up by one.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        cout << "Frying rolex number " << i << endl;
    }
    cout << "All done" << endl;
    return 0;
}
`,
        output: 'Frying rolex number 1\nFrying rolex number 2\nFrying rolex number 3\nAll done',
      },
      { t: 'p', text: 'The lines inside the curly brackets are the **body**. They run once per round. “All done” is after the loop, so it runs once, at the end.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 2; i <= 10; i += 2) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['2 4 6 8 10', '2 4 6 8', '1 2 3 4 5', '2 3 4 5 6 7 8 9 10'],
        answer: 0,
        explain: 'The counter starts at 2 and grows by 2 each round (`i += 2`). The loop stops when `i <= 10` becomes false, and 10 is still allowed because of `<=`. So it prints 2 4 6 8 10.',
      },
      { t: 'h', text: 'Adding things up: the accumulator' },
      { t: 'p', text: 'A very common job is to add up many values. Make a variable called `total` that starts at 0 **before** the loop, and add to it in every round. Change the Input to 10 and run again.' },
      {
        t: 'try',
        stdin: '4',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n, total = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    cout << "Sum: " << total << endl;
    return 0;
}
`,
        output: 'Sum: 10',
      },
      { t: 'h', text: 'Counting down' },
      { t: 'p', text: 'To count down, start high, keep going while the counter is above the end, and use `i--` to subtract 1 each round.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 3; i >= 1; i--) {
        cout << i << endl;
    }
    cout << "Go!" << endl;
    return 0;
}
`,
        output: '3\n2\n1\nGo!',
      },
      { t: 'h', text: 'A times table' },
      {
        t: 'try',
        stdin: '7',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 5; i++) {
        cout << n << " x " << i << " = " << n * i << endl;
    }
    return 0;
}
`,
        output: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35',
      },
      { t: 'tip', text: 'A counter declared inside the `for` brackets (`int i = 1`) exists **only inside that loop**. After the closing bracket it is gone, so two loops in a row can each have their own `i`.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop prints the numbers 1 to 5.',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = ___; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
`,
        blanks: [{ options: ['1', '0', '5'], answer: '1' }],
        output: '1 2 3 4 5',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 1, i <= 3, i++) {
        cout << i << endl;
    }
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['The three parts of the for must be separated by semicolons, not commas', 'The counter must be called count', 'cout cannot be used inside a loop', 'The loop needs an else'],
        answer: 0,
        explain: 'The three parts of a `for` are separated by **semicolons**: `for (int i = 1; i <= 3; i++)`. Commas have a different meaning in C++.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        cout << i << endl;
    }
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int count = 0;
    for (int i = 10; i > 0; i++) {
        count++;
    }`),
            why: 'The counter goes **up** (`i++`) but the loop wants it to stay above 0, so the condition is true forever. This is an **infinite loop**. The app stops it after a few seconds, but on a real computer it would run until you close it. Count down with `i--`.',
            right: prog(String.raw`    int count = 0;
    for (int i = 10; i > 0; i--) {
        count++;
    }`),
          },
          {
            logic: true,
            stdin: '3',
            wrong: prog(String.raw`    int n;
    cin >> n;
    for (int i = 1; i < n; i++) {
        cout << i << endl;
    }`),
            why: 'This is called an **off-by-one** mistake. With `<` the loop stops **before** reaching n, so for n = 3 it prints only 1 and 2. Use `<=` to include n.',
            right: prog(String.raw`    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << i << endl;
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    for (int i = 1; i <= 3; i++);
    {
        cout << "Hello" << endl;
    }`),
            why: 'The semicolon straight after the brackets ends the loop with an empty body. The loop counts to 3 and does nothing, then “Hello” is printed **once**. Never put `;` after `for (...)`.',
            right: prog(String.raw`    for (int i = 1; i <= 3; i++) {
        cout << "Hello" << endl;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'How many times does the body of `for (int i = 0; i < 4; i++)` run?', options: ['4', '3', '5', '0'], answer: 0, explain: 'The counter takes the values 0, 1, 2 and 3. At 4 the condition `i < 4` is false and the loop stops. That is four rounds.' },
      { t: 'quiz', question: 'Which loop prints 5 4 3 2 1?', options: ['for (int i = 5; i >= 1; i--)', 'for (int i = 5; i <= 1; i--)', 'for (int i = 1; i <= 5; i++)', 'for (int i = 5; i >= 1; i++)'], answer: 0, explain: 'Start at 5, keep going while the counter is 1 or more, and subtract 1 each round. The second one never starts, and the last one never stops.' },
      {
        t: 'recap',
        items: [
          '`for (start; keep going while; step)` repeats its body a known number of times.',
          'The three parts are separated by semicolons. No semicolon after the closing bracket.',
          'To add up values, make a `total` that starts at 0 before the loop.',
          'Count up with `i++`, count down with `i--`. `<` and `<=` differ by one round.',
        ],
        memory: 'Start, while, step: separated by semicolons.',
      },
    ],
    exercises: [
      {
        id: 'cpp6-count',
        title: 'Count to n',
        prompt: 'Read a number n and print the numbers from 1 to n, one per line.',
        starter: prog('    // Read n, print 1 to n\n'),
        tests: [
          { input: '3', expected: '1\n2\n3' },
          { input: '5', expected: '1\n2\n3\n4\n5' },
          { input: '1', expected: '1', hidden: true },
        ],
        hints: [
          'Read n into an `int`, then write a `for` loop whose counter goes from 1 to n.',
          'Use `i <= n` so that n itself is printed, and print each number with `cout << i << endl;`',
          'A similar example: `for (int i = 1; i <= 3; i++) { cout << "Hi" << endl; }` prints Hi three times.',
        ],
      },
      {
        id: 'cpp6-sum',
        title: 'The sum of the first n numbers',
        prompt: 'Read a number n and print the sum of 1 + 2 + ... + n like this: `Sum: 10` (for n = 4).',
        starter: prog('    // Read n, add 1 to n, print Sum: ...\n'),
        tests: [
          { input: '4', expected: 'Sum: 10' },
          { input: '10', expected: 'Sum: 55' },
          { input: '1', expected: 'Sum: 1', hidden: true },
          { input: '100', expected: 'Sum: 5050', hidden: true },
        ],
        hints: [
          'Make a variable `total` that starts at 0. Then loop `i` from 1 to n and add `i` to `total` in every round.',
          'Print only **after** the loop, so the answer appears once: `cout << "Sum: " << total << endl;`',
          'A similar example: `int total = 0; for (int i = 1; i <= 3; i++) { total += 5; }` adds 5 three times and gives 15.',
        ],
      },
      {
        id: 'cpp6-table',
        title: 'The times table',
        prompt: 'Read a number n and print its times table from 1 to 12, one line each, like this for n = 3:\n\n`3 x 1 = 3`\n`3 x 2 = 6`\n`...`\n`3 x 12 = 36`',
        starter: prog('    // Read n, print the table from 1 to 12\n'),
        tests: [
          { input: '3', expected: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n3 x 11 = 33\n3 x 12 = 36' },
          { input: '12', expected: '12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60\n12 x 6 = 72\n12 x 7 = 84\n12 x 8 = 96\n12 x 9 = 108\n12 x 10 = 120\n12 x 11 = 132\n12 x 12 = 144', hidden: true },
        ],
        hints: [
          'Loop a counter `i` from 1 to 12. In every round print one line of the table.',
          'Each line has the shape `n x i = n * i`, so: `cout << n << " x " << i << " = " << n * i << endl;`',
          'A similar example: `for (int i = 1; i <= 3; i++) { cout << 10 << " + " << i << " = " << 10 + i << endl; }`',
        ],
      },
    ],
  },

  // ================================================================== 7
  {
    id: 'cpp-while',
    level: LEVEL,
    minutes: 26,
    title: 'while, do while, break and continue',
    summary: 'Repeating when you do not know how many times: queues, sentinels and checking input',
    blocks: [
      {
        t: 'story',
        title: 'The queue that never ends',
        text: 'At lunch time the queue at the stand keeps changing. Some days there are 8 customers, some days 40. Mama Rose cannot say “I will serve exactly ten people”. She says “I will keep serving **while** there is someone in the queue.”\n\nA `for` loop is perfect when you know the count. When you do **not**, you use a `while` loop: it repeats as long as a condition stays true.',
      },
      { t: 'p', text: 'A `while` loop checks its condition **before** every round. If the condition is false the very first time, the body never runs at all.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int stock = 3;
    while (stock > 0) {
        cout << "Sold one, left: " << stock - 1 << endl;
        stock--;
    }
    cout << "Sold out" << endl;
    return 0;
}
`,
        output: 'Sold one, left: 2\nSold one, left: 1\nSold one, left: 0\nSold out',
      },
      { t: 'tip', text: 'Something **inside** the loop must eventually make the condition false. Here it is `stock--`. If you forget it, the loop never ends: an infinite loop.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n = 3;
    while (n > 0) {
        cout << n << " ";
        n--;
    }
    cout << "Go!" << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['3 2 1 Go!', '3 2 1 0 Go!', '2 1 0 Go!', 'Go!'],
        answer: 0,
        explain: 'The loop runs for n = 3, 2 and 1. When n becomes 0 the condition `n > 0` is false and the loop stops without printing 0. Then “Go!” is printed.',
      },
      { t: 'h', text: 'The sentinel loop' },
      { t: 'p', text: 'You can let the **user** decide when to stop. They type values, and a special value, called a **sentinel**, means “that is all”. Here the prices end with 0. Notice that the program reads once **before** the loop and once **at the end of every round**.' },
      {
        t: 'try',
        stdin: '3000 1000 1500 0',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int price, total = 0;
    cin >> price;
    while (price != 0) {
        total += price;
        cin >> price;
    }
    cout << "Total: " << total << endl;
    return 0;
}
`,
        output: 'Total: 5500',
      },
      { t: 'h', text: 'do while: at least once' },
      { t: 'p', text: 'A `do while` loop checks its condition **after** the body, so the body always runs at least once. That is perfect for asking for input until it is valid. Mind the semicolon after the closing `while (...)`.' },
      {
        t: 'try',
        stdin: '150 -3 72',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int marks;
    do {
        cin >> marks;
        if (marks < 0 || marks > 100) {
            cout << "Invalid, try again" << endl;
        }
    } while (marks < 0 || marks > 100);
    cout << "Mark accepted: " << marks << endl;
    return 0;
}
`,
        output: 'Invalid, try again\nInvalid, try again\nMark accepted: 72',
      },
      { t: 'h', text: 'break and continue' },
      {
        t: 'list',
        items: [
          '`break;` leaves the loop immediately.',
          '`continue;` skips the rest of this round and goes straight to the next one.',
        ],
      },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i == 4) {
            break;
        }
        cout << i << " ";
    }
    cout << endl;
    for (int i = 1; i <= 6; i++) {
        if (i % 2 == 0) {
            continue;
        }
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
`,
        output: '1 2 3\n1 3 5',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop keeps going while there is stock.',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int stock = 3;
    while (stock ___ 0) {
        cout << stock << " ";
        stock--;
    }
    cout << "Sold out" << endl;
    return 0;
}
`,
        blanks: [{ options: ['>', '<', '=='], answer: '>' }],
        output: '3 2 1 Sold out',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n = 3, total = 0;
    while n > 0 {
        total += n;
        n--;
    }
    cout << total << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['The condition of a while must be inside round brackets', 'total must be a double', 'n-- is not allowed', 'while needs an else'],
        answer: 0,
        explain: 'Just like `if`, the condition of a `while` always sits inside round brackets: `while (n > 0)`.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int n = 3, total = 0;
    while (n > 0) {
        total += n;
        n--;
    }
    cout << total << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int n = 3, total = 0;
    while (n > 0) {
        total += n;
    }`),
            why: 'Nothing inside the loop changes `n`, so `n > 0` stays true forever: an **infinite loop**. Every `while` body needs something that moves it towards the end, like `n--;`.',
            right: prog(String.raw`    int n = 3, total = 0;
    while (n > 0) {
        total += n;
        n--;
    }`),
          },
          {
            logic: true,
            stdin: '5 6 0',
            wrong: prog(String.raw`    int p, count = 0;
    do {
        cin >> p;
        count++;
    } while (p != 0);
    cout << "Items: " << count << endl;`),
            why: 'The sentinel 0 is not an item, but this loop counts it too. For the input 5 6 0 it prints 3 instead of 2. With a sentinel, use the “read first, then `while (p != 0)`, then read again” pattern.',
            right: prog(String.raw`    int p, count = 0;
    cin >> p;
    while (p != 0) {
        count++;
        cin >> p;
    }
    cout << "Items: " << count << endl;`),
          },
          {
            stdin: '5',
            wrong: prog(String.raw`    int n;
    cin >> n;
    do {
        n--;
    } while (n > 0)
    cout << n << endl;`),
            why: 'A `do while` needs a semicolon after its closing `while (...)`. It is the one loop that ends with a semicolon.',
            right: prog(String.raw`    int n;
    cin >> n;
    do {
        n--;
    } while (n > 0);
    cout << n << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'Which loop always runs its body at least once?', options: ['do while', 'while', 'for', 'None of them'], answer: 0, explain: '`do while` checks its condition after the body, so the body runs once before any check. `while` and `for` check first.' },
      { t: 'quiz', question: 'You do not know how many numbers the user will type. Which loop is the natural choice?', options: ['while (with a sentinel)', 'for with a fixed count', 'switch', 'if'], answer: 0, explain: 'A `while` loop repeats until a condition changes, so it fits “until the user types 0”. A `for` loop fits when the count is known in advance.' },
      {
        t: 'recap',
        items: [
          '`while (condition) { ... }` repeats while the condition is true, checking first. Something inside must change the condition.',
          'A sentinel is a special value (like 0) that means stop. Read before the loop and again at the end of each round.',
          '`do { ... } while (condition);` runs at least once. It ends with a semicolon.',
          '`break;` leaves the loop. `continue;` jumps to the next round.',
        ],
        memory: 'Known count: for. Unknown count: while.',
      },
    ],
    exercises: [
      {
        id: 'cpp7-total',
        title: 'Add until zero',
        prompt: 'Read numbers one after another until you read 0. Print their total like this: `Total: 5500`. The 0 itself is not part of the total.',
        starter: prog('    // Read numbers until 0, print Total: ...\n'),
        tests: [
          { input: '3000 1000 1500 0', expected: 'Total: 5500' },
          { input: '10 20 0', expected: 'Total: 30' },
          { input: '0', expected: 'Total: 0', hidden: true },
          { input: '7 0', expected: 'Total: 7', hidden: true },
        ],
        hints: [
          'Read the first number before the loop. Loop `while (number != 0)`, add to the total, and read the next number at the end of the round.',
          'The reading at the end of the loop is the part people forget. Without it, the loop never ends.',
          'A similar example: `cin >> x; while (x != 0) { count++; cin >> x; }` counts how many numbers were typed before the 0.',
        ],
      },
      {
        id: 'cpp7-digits',
        title: 'How many digits?',
        prompt: 'Read a whole number (1 or more) and print how many digits it has, like this: `Digits: 4` (for 4057).\n\nIdea: dividing a whole number by 10 cuts off its last digit.',
        starter: prog('    // Count the digits of n\n'),
        tests: [
          { input: '4057', expected: 'Digits: 4' },
          { input: '7', expected: 'Digits: 1' },
          { input: '100000', expected: 'Digits: 6', hidden: true },
          { input: '99', expected: 'Digits: 2', hidden: true },
        ],
        hints: [
          'Keep a counter that starts at 0. While `n > 0`, add 1 to the counter and cut a digit off with `n = n / 10;`.',
          'For 4057: 4057 becomes 405, then 40, then 4, then 0. That is four rounds, so four digits.',
          'A similar example: `while (n >= 2) { n = n / 2; steps++; }` counts how many times a number can be halved.',
        ],
      },
      {
        id: 'cpp7-doubling',
        title: 'Savings that double',
        prompt: 'Mama Rose starts a savings jar with **1000** shillings. Every day the amount **doubles**. Read a target amount and print how many days it takes to **reach or pass** the target, like this: `Days: 3` (for a target of 5000).\n\nIf the jar already has enough (target 1000 or less), print `Days: 0`.',
        starter: prog('    // Read the target, double the money every day\n'),
        tests: [
          { input: '5000', expected: 'Days: 3' },
          { input: '2000', expected: 'Days: 1' },
          { input: '1000', expected: 'Days: 0', hidden: true },
          { input: '1000000', expected: 'Days: 10', hidden: true },
        ],
        hints: [
          'Start `money` at 1000 and `days` at 0. Keep going `while (money < target)`.',
          'In each round do two things: `money = money * 2;` and `days++;`. Print the days after the loop.',
          'A similar example: `while (weight < 100) { weight += 5; weeks++; }` counts the weeks until a weight is reached.',
        ],
      },
    ],
  },

  // ================================================================== 8
  {
    id: 'cpp-nested',
    level: LEVEL,
    minutes: 26,
    title: 'Loops inside loops',
    summary: 'Nested loops for grids, triangles and tidy tables, with setw',
    blocks: [
      {
        t: 'story',
        title: 'Rows of chapati on the grill',
        text: 'Mama Rose’s big grill holds **3 rows** with **4 chapatis in each row**. To check the grill she looks along the first row, from the first chapati to the last, then goes to the next row, and so on. For every row she does a **full pass** along the row.\n\nThat is a **nested loop**: a loop inside a loop. The outer loop picks the row. The inner loop walks along that row.',
      },
      { t: 'analogy', text: 'A clock. The minute hand goes all the way round (60 minutes) for **every single step** of the hour hand. The slow hand is the outer loop, the fast hand is the inner loop.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 4; col++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
`,
        output: '****\n****\n****',
      },
      { t: 'p', text: 'Read it slowly. For `row = 1`, the inner loop prints four stars, one per column. Then `cout << endl;` moves to the next line. Then `row` becomes 2, and the whole inner loop starts again. The body of the inner loop ran 3 × 4 = **12 times** in total.' },
      { t: 'h', text: 'Making the inner loop depend on the outer one' },
      { t: 'p', text: 'If the inner loop’s limit uses the outer counter, each row has a different length. This makes a triangle.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= row; col++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
`,
        output: '*\n**\n***',
      },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << i * j << " ";
        }
        cout << endl;
    }
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['1 2 3\n2 4 6', '1 2 3\n1 2 3', '1 2\n2 4\n3 6', '2 4 6\n1 2 3'],
        answer: 0,
        explain: 'For i = 1 the inner loop prints 1×1, 1×2, 1×3 = 1 2 3. For i = 2 it prints 2×1, 2×2, 2×3 = 2 4 6. After each inner loop, `endl` starts a new line.',
      },
      { t: 'h', text: 'Tidy columns with setw' },
      { t: 'p', text: 'Numbers of different lengths make a table look crooked. `setw(4)` (from `<iomanip>`) means “print the **next** value in a box 4 characters wide, pushed to the right”. Every column then lines up.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    for (int r = 1; r <= 3; r++) {
        for (int c = 1; c <= 3; c++) {
            cout << setw(4) << r * c;
        }
        cout << endl;
    }
    return 0;
}
`,
        output: '   1   2   3\n   2   4   6\n   3   6   9',
      },
      { t: 'tip', text: '`setw` only affects the **next** value, so you write it again for every value. Use a width that is a little bigger than the longest number.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints a triangle of stars with 1, then 2, then 3 stars.',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int r = 1; r <= 3; r++) {
        for (int c = 1; c <= ___; c++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
`,
        blanks: [{ options: ['r', '3', '1'], answer: 'r' }],
        output: '*\n**\n***',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int row = 1; row <= 2; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#";
        }
        cout << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['A closing curly bracket is missing: the outer loop is never closed', 'cout cannot print #', 'The inner loop must use row', 'endl must be in quotes'],
        answer: 0,
        explain: 'Every `{` needs its own `}`. Here the outer `for` is never closed before `return 0;`, so the brackets do not match. Indenting each level neatly makes this easy to spot.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    for (int row = 1; row <= 2; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#";
        }
        cout << endl;
    }
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    for (int row = 1; row <= 2; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#" << endl;
        }
    }`),
            why: '`endl` is **inside** the inner loop, so every `#` gets its own line: six lines instead of two rows of three. Put `endl` after the inner loop, inside the outer one.',
            right: prog(String.raw`    for (int row = 1; row <= 2; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#";
        }
        cout << endl;
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    for (int row = 1; row <= 2; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#";
        }
    }
    cout << endl;`),
            why: 'This time `endl` is **after both loops**. All six `#` appear on one line. The new line has to happen once per row.',
            right: prog(String.raw`    for (int row = 1; row <= 2; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#";
        }
        cout << endl;
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    for (int i = 1; i <= 3; i++) {
        for (i = 1; i <= 3; i++) {
            cout << "#";
        }
        cout << endl;
    }`),
            why: 'Both loops use the **same counter** `i`. When the inner loop finishes, it has pushed `i` to 4, so the outer loop stops after one row. Give each loop its own name, like `row` and `col`.',
            right: prog(String.raw`    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 3; col++) {
            cout << "#";
        }
        cout << endl;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'An outer loop runs 5 times and the inner loop runs 4 times for each of those. How many times does the inner body run in total?', options: ['20', '9', '5', '4'], answer: 0, explain: 'The inner loop runs completely for every round of the outer loop, so you multiply: 5 × 4 = 20.' },
      { t: 'quiz', question: 'Where must `cout << endl;` go to print a grid with one row per line?', options: ['After the inner loop, inside the outer loop', 'Inside the inner loop', 'After both loops', 'Before both loops'], answer: 0, explain: 'You want one new line **per row**: after the inner loop has finished a row, but still inside the outer loop so it repeats for every row.' },
      {
        t: 'recap',
        items: [
          'A nested loop is a loop inside a loop. The inner loop runs fully for every round of the outer loop.',
          'Total rounds = outer rounds × inner rounds.',
          'Use `endl` after the inner loop (once per row).',
          'Make the inner limit depend on the outer counter to get triangles.',
          '`setw(n)` aligns the next value in a column n characters wide. Give each loop its own counter name.',
        ],
        memory: 'Outer picks the row, inner walks along it.',
      },
    ],
    exercises: [
      {
        id: 'cpp8-rectangle',
        title: 'A rectangle of hashes',
        prompt: 'Read the number of **rows** and the number of **columns**, and print a rectangle made of `#`. For `2 5` the output is:\n\n`#####`\n`#####`',
        starter: prog('    // Read rows and cols, print the rectangle\n'),
        tests: [
          { input: '2 5', expected: '#####\n#####' },
          { input: '3 3', expected: '###\n###\n###' },
          { input: '1 4', expected: '####', hidden: true },
          { input: '4 1', expected: '#\n#\n#\n#', hidden: true },
        ],
        hints: [
          'Use two loops. The outer loop counts the rows and the inner loop counts the columns.',
          'Print one `#` per inner round with no `endl`. After the inner loop, print `endl` to finish the row.',
          'A similar example is the star rectangle in this lesson: change the numbers 3 and 4 into the values you read.',
        ],
      },
      {
        id: 'cpp8-triangle',
        title: 'A triangle of stars',
        prompt: 'Read a number n and print a triangle of stars with n rows. Row 1 has one star, row 2 has two stars, and so on. For n = 4:\n\n`*`\n`**`\n`***`\n`****`',
        starter: prog('    // Read n, print the triangle\n'),
        tests: [
          { input: '4', expected: '*\n**\n***\n****' },
          { input: '2', expected: '*\n**' },
          { input: '1', expected: '*', hidden: true },
          { input: '6', expected: '*\n**\n***\n****\n*****\n******', hidden: true },
        ],
        hints: [
          'The outer loop goes from 1 to n. The inner loop must print as many stars as the current row number.',
          'Make the inner loop run `col <= row`, so row 3 prints 3 stars.',
          'A similar example is the triangle in this lesson: it used the number 3. Use n there instead.',
        ],
      },
      {
        id: 'cpp8-grid',
        title: 'The multiplication grid',
        prompt: 'Read a number n and print an n by n multiplication grid. Every number sits in a column **4 characters wide** (use `setw(4)`). For n = 3:\n\n`   1   2   3`\n`   2   4   6`\n`   3   6   9`',
        starter: prog('    // Read n, print the grid with setw(4)\n', IO_FMT),
        tests: [
          { input: '3', expected: '   1   2   3\n   2   4   6\n   3   6   9' },
          { input: '4', expected: '   1   2   3   4\n   2   4   6   8\n   3   6   9  12\n   4   8  12  16', hidden: true },
          { input: '1', expected: '   1', hidden: true },
        ],
        hints: [
          'Two nested loops from 1 to n. The number in each cell is `row * col`.',
          'Print each cell with `cout << setw(4) << row * col;` and no `endl`. After the inner loop, print `endl`.',
          'A similar example is the setw grid in this lesson: it was 3 by 3. Replace the 3 with n.',
        ],
      },
    ],
  },
];
