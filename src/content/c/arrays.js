// C, Level 4: Arrays and strings, part 1. Lessons 16 to 19 (arrays, array algorithms, arrays and functions, 2D arrays).
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog } from './shared.js';

const LEVEL = 'Level 4: Arrays and strings';

/** A whole program with functions above main (see functions.js). */
const fn = (fns, body, inc = '#include <stdio.h>') => `${inc}\n\n${fns ? fns + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

export const arrayLessons = [
  // ================================================================== 16
  {
    id: 'c-arrays',
    level: LEVEL,
    minutes: 26,
    title: 'Arrays: many values, one name',
    summary: 'Declaring arrays, indexes that start at 0, loops over arrays and reading data into them',
    blocks: [
      {
        t: 'story',
        title: 'The class register',
        text: 'A lecturer has 40 students and wants to store their marks. Should she make 40 variables called `mark1`, `mark2`, `mark3`...? Imagine writing a program that adds up all forty of them!\n\nA real register is one **page with numbered rows**. Row 1 holds the first student’s mark, row 2 the second, and so on. In C that page is called an **array**: one name, many numbered boxes.',
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int marks[5] = {70, 85, 60, 90, 45};
    printf("First: %d\n", marks[0]);
    printf("Last: %d\n", marks[4]);
    return 0;
}
`,
        output: 'First: 70\nLast: 45',
      },
      { t: 'analogy', text: 'An array is a row of lockers in a school corridor. All the lockers are the same size (the same type), they sit side by side, and each has a number painted on it. The number is called the **index**. You open a locker by name and number: `marks[2]`.' },
      {
        t: 'list',
        items: [
          '`int marks[5]` makes 5 boxes of type `int`. The number in square brackets is the **size**.',
          'The index of the **first** box is **0**, not 1. The index of the last box is size minus 1 (here 4).',
          '`marks[2]` is the third box. You can read it and change it like any variable: `marks[2] = 65;`.',
          'In `int marks[5] = {70, 85}` the missing boxes are filled with 0.',
        ],
      },
      {
        t: 'predict',
        code: prog(String.raw`    int a[5] = {10, 20};
    printf("%d\n", a[1] + a[4]);`),
        question: 'What does this program print?',
        options: ['20', '30', '10', '0'],
        answer: 0,
        explain: 'The list gives only two values: a[0] is 10 and a[1] is 20. The three missing boxes become 0, so a[4] is 0 and the sum is 20 + 0.',
      },
      { t: 'h', text: 'Arrays and loops belong together' },
      { t: 'p', text: 'Because the index is just a number, a `for` loop can walk down the whole array. This is the pattern you will use again and again: loop `i` from 0 up to **size minus 1**.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int marks[5] = {70, 85, 60, 90, 45};
    int i, total = 0;
    for (i = 0; i < 5; i++) {
        total = total + marks[i];
    }
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Total: 350',
      },
      { t: 'h', text: 'Reading data into an array' },
      { t: 'p', text: 'Use `scanf` with `&marks[i]`, exactly like an ordinary variable. This program reads how many prices there are, stores them, and then prints them from the last to the first.' },
      {
        t: 'try',
        stdin: '4 500 1000 2500 300',
        code: String.raw`#include <stdio.h>

int main() {
    int prices[20];
    int n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &prices[i]);
    }
    for (i = n - 1; i >= 0; i--) {
        printf("%d\n", prices[i]);
    }
    return 0;
}
`,
        output: '300\n2500\n1000\n500',
      },
      { t: 'tip', text: 'You do not always know in advance how many values you will get, so make the array **bigger than you need** (here 20) and use a separate variable (`n`) for how many you actually used.' },
      {
        t: 'fill',
        prompt: 'Fill the gap with the index of the **last** box of this 4-box array.',
        template: prog(String.raw`    int a[4] = {5, 6, 7, 8};
    printf("%d\n", a[___]);`),
        blanks: [{ options: ['3', '4', '0'], answer: '3' }],
        output: '8',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int a[3] = {1, 2, 3};
    printf("%d\n", a[3]);`),
        question: 'This program stops with “index out of bound”. What is wrong?',
        options: ['An array of 3 boxes has indexes 0, 1 and 2 only. There is no a[3]', 'The array needs 4 values', 'printf cannot print array values', 'Arrays must start at index 1'],
        answer: 0,
        explain: 'The valid indexes of an array of size 3 are 0, 1 and 2. This practice runner stops with an error when you go outside. A real C compiler does **not** warn you: it reads whatever happens to be next in memory, which is much worse because the program seems to work. Always check your last index.',
        fixed: prog(String.raw`    int a[3] = {1, 2, 3};
    printf("%d\n", a[2]);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int a[5] = {1, 2, 3, 4, 5};
    int i;
    for (i = 0; i <= 5; i++) {
        printf("%d\n", a[i]);
    }`),
            why: 'The loop goes up to **and including** 5, but the last valid index is 4. The classic fix: for an array of size n, use `i < n`, never `i <= n`.',
            right: prog(String.raw`    int a[5] = {1, 2, 3, 4, 5};
    int i;
    for (i = 0; i < 5; i++) {
        printf("%d\n", a[i]);
    }`),
          },
          {
            wrong: prog(String.raw`    int a[3];
    printf("%d\n", a[0]);`),
            why: 'A new array has no values until you put some in. Real C would print a random leftover number; this runner stops with an error. Give every box a value before you read it: `int a[3] = {0};` fills every box with 0.',
            right: prog(String.raw`    int a[3] = {0};
    printf("%d\n", a[0]);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int marks[3] = {70, 85, 60};
    printf("First student: %d\n", marks[1]);`),
            why: 'Indexes start at 0, so `marks[1]` is the **second** student. The first student is `marks[0]`. Counting from 0 feels odd at first; it will become second nature.',
            right: prog(String.raw`    int marks[3] = {70, 85, 60};
    printf("First student: %d\n", marks[0]);`),
          },
        ],
      },
      { t: 'quiz', question: 'An array is declared as `int a[10];`. What is the index of its last box?', options: ['9', '10', '11', '1'], answer: 0, explain: 'Ten boxes numbered 0 to 9. The last index is always the size minus 1.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 11): the week’s sales',
        text: 'The duuka’s sales for each day of the week are stored in an array. One loop prints them and adds them up.',
        code: String.raw`#include <stdio.h>

int main() {
    int sales[7] = {12000, 8500, 9000, 15000, 22000, 31000, 18000};
    int day, total = 0;
    for (day = 0; day < 7; day++) {
        printf("Day %d: %d\n", day + 1, sales[day]);
        total = total + sales[day];
    }
    printf("Week total: %d\n", total);
    return 0;
}
`,
        output: 'Day 1: 12000\nDay 2: 8500\nDay 3: 9000\nDay 4: 15000\nDay 5: 22000\nDay 6: 31000\nDay 7: 18000\nWeek total: 115500',
      },
      {
        t: 'recap',
        items: ['`type name[size];` makes `size` boxes. Indexes run from **0 to size - 1**.', 'Loop with `for (i = 0; i < size; i++)` to visit every box.', 'Read with `scanf("%d", &a[i]);`. Give every box a value before you read it.', 'Going outside the array is a serious bug. Real C does not stop you.'],
        memory: 'Zero to size minus one.',
      },
    ],
    exercises: [
      {
        id: 'c16-reverse',
        title: 'Print in reverse',
        prompt: 'The first number is how many numbers follow. Read them into an array and print them in **reverse order**, one per line.',
        starter: prog('    int a[50];\n    int n, i;\n    // Read n, then n numbers, then print them backwards\n'),
        sampleInput: '4 10 20 30 40',
        usesInput: true,
        tests: [
          { input: '4 10 20 30 40', expected: '40\n30\n20\n10' },
          { input: '1 7', expected: '7' },
          { input: '5 1 2 3 4 5', expected: '5\n4\n3\n2\n1', hidden: true },
        ],
        hints: [
          'Use one loop to read the numbers into `a[i]`, and a second loop to print them.',
          'The second loop starts at the last index and counts down: `for (i = n - 1; i >= 0; i--)`.',
          'A similar example: this lesson’s prices program reads `n` prices and prints them backwards. Yours is the same with different numbers.',
        ],
      },
      {
        id: 'c16-average',
        title: 'Average of the marks',
        prompt: 'The first number is how many marks follow. Read them into an array and print their average with 2 decimals, like `Average: 72.50`.',
        starter: prog('    int marks[50];\n    int n, i, total = 0;\n    // Read n, then the marks, then print the average\n'),
        sampleInput: '4 70 85 60 75',
        usesInput: true,
        tests: [
          { input: '4 70 85 60 75', expected: 'Average: 72.50' },
          { input: '3 50 60 70', expected: 'Average: 60.00' },
          { input: '2 99 100', expected: 'Average: 99.50', hidden: true },
        ],
        hints: [
          'Add all marks into a `total` while you loop. Divide by `n` at the end.',
          'Use `total / (float)n` or `total / (n * 1.0)` so the decimals are kept. Print with `%.2f`.',
          'A similar example: lesson 7 added up marks in a loop. Now the marks sit in an array as well.',
        ],
      },
      {
        id: 'c16-count',
        title: 'How many passed?',
        prompt: 'The first number is how many marks follow. Read them into an array. Print how many are **50 or more**, like `Passed: 3`.',
        starter: prog('    int marks[50];\n    int n, i, passed = 0;\n    // Read n, then the marks, then count the passes\n'),
        sampleInput: '5 70 45 50 30 88',
        usesInput: true,
        tests: [
          { input: '5 70 45 50 30 88', expected: 'Passed: 3' },
          { input: '2 10 20', expected: 'Passed: 0' },
          { input: '3 50 50 50', expected: 'Passed: 3', name: 'Exactly 50 passes', hidden: true },
        ],
        hints: [
          'Loop through the array and use an `if` to decide whether each mark counts.',
          'Inside the loop: `if (marks[i] >= 50) { passed++; }`.',
          'A similar example: counting the even numbers in an array uses `if (a[i] % 2 == 0) { count++; }`.',
        ],
      },
    ],
  },

  // ================================================================== 17
  {
    id: 'c-array-algos',
    level: LEVEL,
    minutes: 28,
    title: 'Array algorithms: largest, search and sort',
    summary: 'Finding the biggest and smallest value, searching for a value and sorting with bubble sort',
    blocks: [
      {
        t: 'story',
        title: 'Finding the cheapest tomatoes',
        text: 'At the market Namukasa walks along the stalls looking for the cheapest tomatoes. She does not remember every price. She remembers only **the best price so far**. At each new stall she compares: if this one is cheaper, it becomes the new best.\n\nThat simple idea, “remember the best so far”, solves a huge number of problems. In this lesson you learn three classic array algorithms: finding the largest, searching, and sorting.',
      },
      { t: 'h', text: '1. Largest value' },
      { t: 'p', text: 'Start by assuming the **first** element is the largest. Then compare every other element with it and take over whenever you find a bigger one.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int a[6] = {40, 95, 12, 77, 95, 8};
    int i, largest = a[0];
    for (i = 1; i < 6; i++) {
        if (a[i] > largest) {
            largest = a[i];
        }
    }
    printf("Largest: %d\n", largest);
    return 0;
}
`,
        output: 'Largest: 95',
      },
      { t: 'tip', text: 'Why start `largest` at `a[0]` and not at 0? If all the numbers are negative, 0 would be “larger” than all of them and the answer would be wrong. Starting with a real element is always safe. The smallest value works the same way with `<`.' },
      { t: 'h', text: '2. Searching' },
      { t: 'p', text: 'To find where a value is, check each box in turn (a **linear search**). Remember the position when you find it, and stop.' },
      {
        t: 'try',
        stdin: '77',
        code: String.raw`#include <stdio.h>

int main() {
    int a[6] = {40, 95, 12, 77, 95, 8};
    int i, target, found = -1;
    scanf("%d", &target);
    for (i = 0; i < 6; i++) {
        if (a[i] == target) {
            found = i;
            break;
        }
    }
    if (found == -1) {
        printf("Not found\n");
    } else {
        printf("Found at %d\n", found);
    }
    return 0;
}
`,
        output: 'Found at 3',
      },
      { t: 'p', text: 'The variable `found` starts at -1. No real index is negative, so -1 is a safe way to say “not found yet”.' },
      { t: 'h', text: '3. Sorting with bubble sort' },
      { t: 'p', text: 'Bubble sort looks at **neighbours**. If a pair is in the wrong order, it swaps them. After one full pass the biggest value has “bubbled” to the end. Repeat the passes until everything is in order.' },
      { t: 'analogy', text: 'Picture people standing in a line, ordered by height. Each person looks at the person next to them and swaps places if the taller one is in front. The tallest person slowly moves to the back of the line, like a bubble rising in a bottle.' },
      { t: 'p', text: 'To swap two boxes you need a **temporary** variable. If you write `a[i] = a[j]; a[j] = a[i];` you lose the old value of `a[i]` and both boxes end up the same.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int a[5] = {50, 20, 40, 10, 30};
    int i, pass, temp;
    for (pass = 0; pass < 4; pass++) {
        for (i = 0; i < 4 - pass; i++) {
            if (a[i] > a[i + 1]) {
                temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
            }
        }
    }
    for (i = 0; i < 5; i++) {
        printf("%d\n", a[i]);
    }
    return 0;
}
`,
        output: '10\n20\n30\n40\n50',
      },
      {
        t: 'predict',
        code: prog(String.raw`    int a[3] = {3, 1, 2};
    int i, temp;
    for (i = 0; i < 2; i++) {
        if (a[i] > a[i + 1]) {
            temp = a[i];
            a[i] = a[i + 1];
            a[i + 1] = temp;
        }
    }
    printf("%d\n%d\n%d\n", a[0], a[1], a[2]);`),
        question: 'This is ONE pass of bubble sort over {3, 1, 2}. What does it print?',
        options: ['1\n2\n3', '3\n1\n2', '1\n3\n2', '2\n1\n3'],
        answer: 0,
        explain: 'The pair (3, 1) is out of order, so they swap and the array is {1, 3, 2}. The next pair (3, 2) is also out of order, so they swap and the array is {1, 2, 3}. The big 3 has bubbled to the end.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap to finish the swap of `x` and `y` using the temporary variable.',
        template: prog(String.raw`    int x = 1, y = 2, temp;
    temp = x;
    x = y;
    y = ___;
    printf("%d %d\n", x, y);`),
        blanks: [{ options: ['temp', 'x', '0'], answer: 'temp' }],
        output: '2 1',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int a[2] = {5, 9};
    temp = a[0];
    a[0] = a[1];
    a[1] = temp;`),
        question: 'This program stops because `temp` does not exist. What is missing?',
        options: ['A declaration of the temporary variable: `int temp;`', 'A semicolon after the array', 'The array needs three boxes', 'The swap must use `==`'],
        answer: 0,
        explain: 'Every variable, even a short-lived helper like `temp`, must be declared with its type before first use.',
        fixed: prog(String.raw`    int a[2] = {5, 9};
    int temp;
    temp = a[0];
    a[0] = a[1];
    a[1] = temp;`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int a[3] = {-5, -2, -9};
    int i, largest = 0;
    for (i = 0; i < 3; i++) {
        if (a[i] > largest) {
            largest = a[i];
        }
    }
    printf("Largest: %d\n", largest);`),
            why: 'Starting at 0 gives the answer 0, which is not even in the array: all the numbers are negative. Start with the **first element**: `largest = a[0];`.',
            right: prog(String.raw`    int a[3] = {-5, -2, -9};
    int i, largest = a[0];
    for (i = 1; i < 3; i++) {
        if (a[i] > largest) {
            largest = a[i];
        }
    }
    printf("Largest: %d\n", largest);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[2] = {5, 9};
    a[0] = a[1];
    a[1] = a[0];
    printf("%d %d\n", a[0], a[1]);`),
            why: 'The first line overwrites `a[0]`, so its old value (5) is gone. Both boxes now hold 9. A swap needs a temporary variable to hold the first value while you overwrite it.',
            right: prog(String.raw`    int a[2] = {5, 9};
    int temp = a[0];
    a[0] = a[1];
    a[1] = temp;
    printf("%d %d\n", a[0], a[1]);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[3] = {4, 8, 6};
    int i, target = 6;
    for (i = 0; i < 3; i++) {
        if (a[i] == target) {
            printf("Found\n");
        } else {
            printf("Not found\n");
        }
    }`),
            why: 'The `else` runs for every box that is **not** the target, so “Not found” is printed even though the value is there. Decide **after** the loop, using a variable like `found`, whether it was found.',
            right: prog(String.raw`    int a[3] = {4, 8, 6};
    int i, target = 6, found = 0;
    for (i = 0; i < 3; i++) {
        if (a[i] == target) {
            found = 1;
        }
    }
    if (found == 1) {
        printf("Found\n");
    } else {
        printf("Not found\n");
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'After one full pass of bubble sort over an array, what is true?', options: ['The largest value is in its final place at the end', 'The whole array is sorted', 'The smallest value has moved to the end', 'Nothing has changed'], answer: 0, explain: 'One pass carries the biggest value all the way to the last box. That is why each following pass can stop one box earlier.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 12): the best and the worst day',
        text: 'This program finds the best and the worst sales day of the week.',
        code: String.raw`#include <stdio.h>

int main() {
    int sales[7] = {12000, 8500, 9000, 15000, 22000, 31000, 18000};
    int day, best = 0, worst = 0;
    for (day = 1; day < 7; day++) {
        if (sales[day] > sales[best]) {
            best = day;
        }
        if (sales[day] < sales[worst]) {
            worst = day;
        }
    }
    printf("Best day: %d (%d)\n", best + 1, sales[best]);
    printf("Worst day: %d (%d)\n", worst + 1, sales[worst]);
    return 0;
}
`,
        output: 'Best day: 6 (31000)\nWorst day: 2 (8500)',
      },
      {
        t: 'recap',
        items: ['**Largest**: start with `a[0]`, then replace it whenever a bigger value turns up.', '**Search**: check each box, remember where it was found (use -1 for “not found”).', '**Bubble sort**: compare neighbours and swap with a temporary variable, pass after pass.', 'Decide “not found” only **after** the loop has finished.'],
        memory: 'Best so far, then compare.',
      },
    ],
    exercises: [
      {
        id: 'c17-minmax',
        title: 'Smallest and largest',
        prompt: 'The first number is how many numbers follow. Read them into an array and print the smallest and the largest like this:\n\n`Min: 8`\n`Max: 95`',
        starter: prog('    int a[50];\n    int n, i;\n    // Read n numbers, then find the smallest and the largest\n'),
        sampleInput: '6 40 95 12 77 95 8',
        usesInput: true,
        tests: [
          { input: '6 40 95 12 77 95 8', expected: 'Min: 8\nMax: 95' },
          { input: '1 5', expected: 'Min: 5\nMax: 5' },
          { input: '3 -5 -2 -9', expected: 'Min: -9\nMax: -2', hidden: true },
        ],
        hints: [
          'Keep two variables, `min` and `max`, and start both at `a[0]`.',
          'Loop from index 1. If `a[i] < min` update `min`; if `a[i] > max` update `max`.',
          'A similar example: the largest-value program in this lesson. The smallest uses `<` instead of `>`.',
        ],
      },
      {
        id: 'c17-search',
        title: 'Where is it?',
        prompt: 'The first number is how many numbers follow, then the numbers, then the **target** to look for. Print `Found at <index>` for the first match (index counting from 0) or `Not found`.',
        starter: prog('    int a[50];\n    int n, i, target, found = -1;\n    // Read n, the numbers, then the target, and search\n'),
        sampleInput: '5 10 20 30 20 10 30',
        usesInput: true,
        tests: [
          { input: '5 10 20 30 20 10 30', expected: 'Found at 2' },
          { input: '4 5 6 7 8 9', expected: 'Not found' },
          { input: '3 4 4 4 4', expected: 'Found at 0', name: 'Report the first match', hidden: true },
        ],
        hints: [
          'Read the numbers first, **then** read the target. Loop through and compare.',
          'When `a[i] == target`, store `found = i;` and `break;` so later matches do not replace it. After the loop print based on `found`.',
          'A similar example: this lesson’s search program, but there the target was typed first.',
        ],
      },
      {
        id: 'c17-sort',
        title: 'Sort the numbers',
        prompt: 'The first number is how many numbers follow. Read them, sort them from **smallest to largest** (use bubble sort) and print them one per line.',
        starter: prog('    int a[50];\n    int n, i, pass, temp;\n    // Read n numbers, sort them, print them\n'),
        sampleInput: '5 50 20 40 10 30',
        usesInput: true,
        tests: [
          { input: '5 50 20 40 10 30', expected: '10\n20\n30\n40\n50' },
          { input: '1 9', expected: '9' },
          { input: '4 3 3 1 2', expected: '1\n2\n3\n3', name: 'Repeated values', hidden: true },
          { input: '3 -1 -5 0', expected: '-5\n-1\n0', hidden: true },
        ],
        hints: [
          'Two loops: an outer loop for the passes, an inner loop that compares neighbours `a[i]` and `a[i + 1]`.',
          'If `a[i] > a[i + 1]`, swap them with `temp`. The outer loop runs `n - 1` times and the inner runs `n - 1 - pass` times.',
          'A similar example: this lesson’s bubble sort sorts exactly 5 numbers. Replace the fixed 5 with `n`.',
        ],
      },
    ],
  },

  // ================================================================== 18
  {
    id: 'c-array-fn',
    level: LEVEL,
    minutes: 24,
    title: 'Arrays and functions',
    summary: 'Passing an array to a function, why the function can change the original, and returning results',
    blocks: [
      {
        t: 'story',
        title: 'Handing over the register',
        text: 'Last lesson you saw that a function gets a **photocopy** of a number. An array is different. When the lecturer hands the whole class register to her teaching assistant, she does **not** photocopy 40 pages. She hands over the real book. If the assistant corrects a mark, the correction is in the lecturer’s book too.\n\nC treats arrays the same way, and understanding that one fact will save you hours of confusion.',
      },
      { t: 'h', text: 'Passing an array in' },
      { t: 'p', text: 'The parameter is written with empty square brackets: `int a[]`. A function cannot tell how long the array is, so you pass the **size** as a second parameter.' },
      {
        t: 'try',
        code: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[4] = {70, 85, 60, 90};
    printf("Total: %d\n", sum(marks, 4));`),
        output: 'Total: 305',
      },
      { t: 'tip', text: 'When you call the function, write only the **name** of the array: `sum(marks, 4)`. No square brackets, no type.' },
      { t: 'h', text: 'The function works on the real array' },
      {
        t: 'try',
        code: fn(String.raw`void double_all(int a[], int n) {
    int i;
    for (i = 0; i < n; i++) {
        a[i] = a[i] * 2;
    }
}`, String.raw`    int prices[3] = {500, 1000, 2500};
    int i;
    double_all(prices, 3);
    for (i = 0; i < 3; i++) {
        printf("%d\n", prices[i]);
    }`),
        output: '1000\n2000\n5000',
      },
      { t: 'analogy', text: 'A single number is passed like a photocopy. An array is passed like the **key to the locker row**: the function can open the same lockers you can, so anything it changes inside them is changed for everybody.' },
      {
        t: 'predict',
        code: fn(String.raw`void reset(int a[]) {
    a[0] = 0;
}`, String.raw`    int x[2] = {5, 6};
    reset(x);
    printf("%d %d\n", x[0], x[1]);`),
        question: 'What does this program print?',
        options: ['0 6', '5 6', '0 0', '5 0'],
        answer: 0,
        explain: 'The function received the real array, not a copy, so `a[0] = 0;` changed the caller’s `x[0]`. A plain `int` parameter would have stayed unchanged.',
      },
      { t: 'h', text: 'Functions that answer questions about an array' },
      {
        t: 'try',
        code: fn(String.raw`int count_above(int a[], int n, int limit) {
    int i, count = 0;
    for (i = 0; i < n; i++) {
        if (a[i] > limit) {
            count++;
        }
    }
    return count;
}`, String.raw`    int marks[6] = {70, 45, 85, 30, 60, 92};
    printf("Above 60: %d\n", count_above(marks, 6, 60));`),
        output: 'Above 60: 3',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the function receives the array. (Remember the empty square brackets.)',
        template: fn(String.raw`int first(int a___) {
    return a[0];
}`, String.raw`    int x[3] = {9, 8, 7};
    printf("%d\n", first(x));`),
        blanks: [{ options: ['[]', '()', '{}'], answer: '[]' }],
        output: '9',
      },
      {
        t: 'bug',
        code: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[3] = {1, 2, 3};
    printf("%d\n", sum(marks));`),
        question: 'This program stops with an error about `sum`. What is wrong with the call?',
        options: ['The size is missing: `sum` needs both the array and its size', 'marks must be a float array', 'sum must be called as `sum[marks]`', 'The array must be global'],
        answer: 0,
        explain: 'The function was written with two parameters, `a` and `n`, so the call must give two arguments: `sum(marks, 3)`. The array does not carry its own length, so you always pass it.',
        fixed: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[3] = {1, 2, 3};
    printf("%d\n", sum(marks, 3));`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[3] = {1, 2, 3};
    printf("%d\n", sum(marks[], 3));`),
            why: 'In the **call** you write only the name `marks`. The square brackets belong in the function’s parameter list and in the declaration, not in the call.',
            right: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[3] = {1, 2, 3};
    printf("%d\n", sum(marks, 3));`),
          },
          {
            logic: true,
            wrong: fn(String.raw`void sort_two(int a[]) {
    int temp;
    if (a[0] > a[1]) {
        temp = a[0];
        a[0] = a[1];
        a[1] = temp;
    }
}`, String.raw`    int x[2] = {9, 4};
    int original = x[0];
    sort_two(x);
    printf("x[0] is now %d, not %d\n", x[0], original);`),
            why: 'This is not a bug in the program, it is a surprise for beginners: the function changed the caller’s array. If you need the original order afterwards, make a copy of the array first.',
            right: fn(String.raw`void sort_two(int a[]) {
    int temp;
    if (a[0] > a[1]) {
        temp = a[0];
        a[0] = a[1];
        a[1] = temp;
    }
}`, String.raw`    int x[2] = {9, 4};
    int copy[2] = {9, 4};
    sort_two(x);
    printf("Sorted: %d %d, original: %d %d\n", x[0], x[1], copy[0], copy[1]);`),
          },
          {
            logic: true,
            wrong: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i <= n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[4] = {1, 2, 3, 4};
    printf("%d\n", sum(marks, 3));`),
            why: 'With `i <= n` the loop reads one box too many. For `sum(marks, 3)` the function adds four values, so the answer is 10 instead of 6. The loop must stop **before** `n`: `i < n`.',
            right: fn(String.raw`int sum(int a[], int n) {
    int i, total = 0;
    for (i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`, String.raw`    int marks[4] = {1, 2, 3, 4};
    printf("%d\n", sum(marks, 3));`),
          },
        ],
      },
      { t: 'quiz', question: 'A function receives `int a[]` and sets `a[0] = 99;`. What happens to the caller’s array?', options: ['Its first box becomes 99', 'Nothing: the function worked on a copy', 'The program refuses to run', 'The whole array becomes 99'], answer: 0, explain: 'Arrays are not copied when passed to a function. The function and the caller share the same boxes.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 13): sales functions',
        text: 'Two functions answer questions about the week’s sales: the total and the number of days above a target.',
        code: String.raw`#include <stdio.h>

int total(int a[], int n) {
    int i, sum = 0;
    for (i = 0; i < n; i++) {
        sum = sum + a[i];
    }
    return sum;
}

int days_above(int a[], int n, int target) {
    int i, count = 0;
    for (i = 0; i < n; i++) {
        if (a[i] >= target) {
            count++;
        }
    }
    return count;
}

int main() {
    int sales[7] = {12000, 8500, 9000, 15000, 22000, 31000, 18000};
    printf("Total: %d\n", total(sales, 7));
    printf("Days with 15000 or more: %d\n", days_above(sales, 7, 15000));
    return 0;
}
`,
        output: 'Total: 115500\nDays with 15000 or more: 4',
      },
      {
        t: 'recap',
        items: ['Write `int a[]` in the parameter list and pass the **size** as another parameter.', 'Call with just the name: `sum(marks, 4)`.', 'The function shares the **real** array, so it can change the caller’s values.', 'Loop with `i < n`, never `i <= n`.'],
        memory: 'Arrays are shared, numbers are copied.',
      },
    ],
    exercises: [
      {
        id: 'c18-average',
        title: 'An average function',
        prompt: 'Complete `average(a, n)` so it returns the average of the first `n` numbers as a `float`. The program reads `n` and the numbers, and prints like `Average: 72.50`.',
        starter: fn(String.raw`float average(int a[], int n) {
    // add up the numbers and divide by n
}`, String.raw`    int a[50];
    int n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
    printf("Average: %.2f\n", average(a, n));`),
        sampleInput: '4 70 85 60 75',
        usesInput: true,
        tests: [
          { input: '4 70 85 60 75', expected: 'Average: 72.50' },
          { input: '3 50 60 70', expected: 'Average: 60.00' },
          { input: '1 99', expected: 'Average: 99.00', hidden: true },
        ],
        hints: [
          'Inside the function loop through `a`, add each value to a total, and `return` the total divided by `n`.',
          'Make the division keep decimals: `return total / (float)n;`.',
          'A similar example: `sum(a, n)` in this lesson returns the total. Divide that total by `n`.',
        ],
      },
      {
        id: 'c18-countabove',
        title: 'Count above a limit',
        prompt: 'Complete `count_above(a, n, limit)` so it returns how many of the first `n` numbers are **bigger than** `limit`. The program reads `n`, the numbers and the limit, and prints `Above: 3`.',
        starter: fn(String.raw`int count_above(int a[], int n, int limit) {
    // count the numbers bigger than limit
}`, String.raw`    int a[50];
    int n, i, limit;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
    scanf("%d", &limit);
    printf("Above: %d\n", count_above(a, n, limit));`),
        sampleInput: '6 70 45 85 30 60 92 60',
        usesInput: true,
        tests: [
          { input: '6 70 45 85 30 60 92 60', expected: 'Above: 3' },
          { input: '3 1 2 3 5', expected: 'Above: 0' },
          { input: '3 5 5 5 5', expected: 'Above: 0', name: 'Equal does not count', hidden: true },
          { input: '2 9 8 0', expected: 'Above: 2', hidden: true },
        ],
        hints: [
          'Loop through the array and count the values that pass the test, as in the project step.',
          'Inside the loop: `if (a[i] > limit) { count++; }`. After the loop `return count;`.',
          'A similar example: `days_above` in the project step. Note that one used `>=`; this exercise needs `>`.',
        ],
      },
      {
        id: 'c18-double',
        title: 'Double every value',
        prompt: 'Complete the `void` function `double_all(a, n)` so it **doubles every value in the array itself**. The program reads the numbers, calls it, and prints the changed array one number per line.',
        starter: fn(String.raw`void double_all(int a[], int n) {
    // double every value in a
}`, String.raw`    int a[50];
    int n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
    double_all(a, n);
    for (i = 0; i < n; i++) {
        printf("%d\n", a[i]);
    }`),
        sampleInput: '3 500 1000 2500',
        usesInput: true,
        tests: [
          { input: '3 500 1000 2500', expected: '1000\n2000\n5000' },
          { input: '1 7', expected: '14' },
          { input: '4 0 -1 5 10', expected: '0\n-2\n10\n20', hidden: true },
        ],
        hints: [
          'The function works on the real array, so no `return` is needed. Just change each box.',
          'Loop `i` from 0 to `n - 1` and write `a[i] = a[i] * 2;`.',
          'A similar example: the `double_all` function earlier in this lesson. Write it yourself without looking.',
        ],
      },
    ],
  },

  // ================================================================== 19
  {
    id: 'c-2d',
    level: LEVEL,
    minutes: 26,
    title: 'Two-dimensional arrays',
    summary: 'Tables of values: rows and columns, nested loops and row totals',
    blocks: [
      {
        t: 'story',
        title: 'The marks sheet',
        text: 'A lecturer’s marks sheet is a **table**. Down the side are the students. Across the top are the subjects. To find Amina’s mark in Mathematics you go to **her row** and the **Mathematics column**.\n\nA one-dimensional array is one row of lockers. A **two-dimensional array** is a whole wall of lockers, with rows and columns. You name a box with two numbers: `marks[row][column]`.',
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int marks[3][2] = {
        {70, 85},
        {60, 90},
        {45, 50}
    };
    printf("Student 2, subject 1: %d\n", marks[1][0]);
    printf("Student 3, subject 2: %d\n", marks[2][1]);
    return 0;
}
`,
        output: 'Student 2, subject 1: 60\nStudent 3, subject 2: 50',
      },
      {
        t: 'list',
        items: [
          '`int marks[3][2]` has **3 rows** and **2 columns**: 6 boxes.',
          'The **first** number is the row, the **second** is the column. Both start at 0.',
          'Each inner pair of curly brackets `{70, 85}` is one row.',
          'Missing values are filled with 0, just like in a one-dimensional array.',
        ],
      },
      { t: 'h', text: 'Visiting every box: loops inside loops' },
      { t: 'p', text: 'You already know how to do this from lesson 9. The **outer** loop picks the row and the **inner** loop walks along the columns of that row.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int row, col;
    for (row = 0; row < 3; row++) {
        for (col = 0; col < 3; col++) {
            printf("%d", m[row][col]);
            if (col < 2) {
                printf(" ");
            }
        }
        printf("\n");
    }
    return 0;
}
`,
        output: '1 2 3\n4 5 6\n7 8 9',
      },
      {
        t: 'predict',
        code: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\n", m[1][2] - m[0][1]);`),
        question: 'What does this program print?',
        options: ['4', '3', '2', '5'],
        answer: 0,
        explain: '`m[1][2]` is row 1, column 2: the value 6. `m[0][1]` is row 0, column 1: the value 2. So 6 − 2 = 4. Remember: row first, column second, both counted from 0.',
      },
      { t: 'h', text: 'Row totals' },
      { t: 'p', text: 'To total each student’s marks, reset a total to 0 **at the start of each row**, add the columns, and print at the end of the row.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int marks[3][2] = {{70, 85}, {60, 90}, {45, 50}};
    int s, c, total;
    for (s = 0; s < 3; s++) {
        total = 0;
        for (c = 0; c < 2; c++) {
            total = total + marks[s][c];
        }
        printf("Student %d: %d\n", s + 1, total);
    }
    return 0;
}
`,
        output: 'Student 1: 155\nStudent 2: 150\nStudent 3: 95',
      },
      { t: 'h', text: 'Reading a table from the keyboard' },
      {
        t: 'try',
        stdin: '2 3 1 2 3 4 5 6',
        code: String.raw`#include <stdio.h>

int main() {
    int m[10][10];
    int rows, cols, i, j;
    scanf("%d %d", &rows, &cols);
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            scanf("%d", &m[i][j]);
        }
    }
    printf("Last: %d\n", m[rows - 1][cols - 1]);
    return 0;
}
`,
        output: 'Last: 6',
      },
      {
        t: 'fill',
        prompt: 'The table has 3 rows and 4 columns. Fill the gap with the number of columns to complete the declaration.',
        template: prog(String.raw`    int t[3][___] = {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}};
    printf("%d\n", t[2][3]);`),
        blanks: [{ options: ['4', '3', '2'], answer: '4' }],
        output: '12',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int m[2][2] = {{1, 2}, {3, 4}};
    printf("%d\n", m[2][0]);`),
        question: 'This program stops with “index out of bound”. What is wrong?',
        options: ['A table with 2 rows has rows 0 and 1 only: there is no row 2', 'The table must be 3 by 3', 'printf cannot print a table value', 'The second index must be 1'],
        answer: 0,
        explain: 'With 2 rows the valid row numbers are 0 and 1. Both indexes must stay inside their own limits: rows below the number of rows, columns below the number of columns.',
        fixed: prog(String.raw`    int m[2][2] = {{1, 2}, {3, 4}};
    printf("%d\n", m[1][0]);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int i, j, total = 0;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 3; j++) {
            total = total + m[i][j];
        }
        printf("Row %d: %d\n", i + 1, total);
    }`),
            why: '`total` is set to 0 only once, before the loops, so the second row’s total includes the first row too (Row 2 shows 21 instead of 15). Reset `total = 0;` at the **start of every row**.',
            right: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int i, j, total;
    for (i = 0; i < 2; i++) {
        total = 0;
        for (j = 0; j < 3; j++) {
            total = total + m[i][j];
        }
        printf("Row %d: %d\n", i + 1, total);
    }`),
          },
          {
            wrong: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int i, j;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 3; j++) {
            printf("%d\n", m[j][i]);
        }
    }`),
            why: 'The indexes are swapped: `j` runs to 2 but the first index (rows) only goes to 1, so the program steps outside the table. Row first, column second: `m[i][j]`.',
            right: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int i, j;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 3; j++) {
            printf("%d\n", m[i][j]);
        }
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\n", m[3][2]);`),
            why: 'A common mix-up: `[2][3]` in the declaration means 2 rows and 3 columns, so `m[3][2]` is **not** the corner. The last box is `m[1][2]` (last row, last column).',
            right: prog(String.raw`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\n", m[1][2]);`),
          },
        ],
      },
      { t: 'quiz', question: 'An array is declared `int t[4][5];`. How many boxes does it have?', options: ['20', '9', '4', '5'], answer: 0, explain: 'Rows times columns: 4 × 5 = 20 boxes.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 14): stock by shelf',
        text: 'The duuka has 3 shelves with 4 products each. The table holds how many of each are in stock. This program totals every shelf.',
        code: String.raw`#include <stdio.h>

int main() {
    int stock[3][4] = {
        {20, 15, 8, 30},
        {12, 0, 25, 6},
        {40, 22, 10, 9}
    };
    int shelf, item, total;
    for (shelf = 0; shelf < 3; shelf++) {
        total = 0;
        for (item = 0; item < 4; item++) {
            total = total + stock[shelf][item];
        }
        printf("Shelf %d: %d items\n", shelf + 1, total);
    }
    return 0;
}
`,
        output: 'Shelf 1: 73 items\nShelf 2: 43 items\nShelf 3: 81 items',
      },
      {
        t: 'recap',
        items: ['`type name[rows][columns];` is a table. Index with `[row][column]`, both from 0.', 'Visit every box with nested loops: rows outside, columns inside.', 'Reset any per-row total at the **start of each row**.', 'A 4 by 5 table has 20 boxes.'],
        memory: 'Row first, then column.',
      },
    ],
    exercises: [
      {
        id: 'c19-rowsums',
        title: 'Row totals',
        prompt: 'The first two numbers are the number of rows and columns. Then come the values, row by row. Print the total of each row on its own line like `Row 1: 6`.',
        starter: prog('    int m[10][10];\n    int rows, cols, i, j, total;\n    // Read the table, then print each row total\n'),
        sampleInput: '2 3 1 2 3 4 5 6',
        usesInput: true,
        tests: [
          { input: '2 3 1 2 3 4 5 6', expected: 'Row 1: 6\nRow 2: 15' },
          { input: '1 1 9', expected: 'Row 1: 9' },
          { input: '3 2 5 5 0 0 1 2', expected: 'Row 1: 10\nRow 2: 0\nRow 3: 3', hidden: true },
        ],
        hints: [
          'Read the table with two nested loops, then walk it again to add up each row.',
          'For each row set `total = 0;`, add `m[i][j]` for every column, and print the row total after the inner loop.',
          'A similar example: the “Row totals” program in this lesson, but with fixed sizes.',
        ],
      },
      {
        id: 'c19-diagonal',
        title: 'The diagonal',
        prompt: 'The first number N is the size of a square table (N rows and N columns). Read the table and print the sum of its **main diagonal** (top-left to bottom-right) like `Diagonal: 15`.',
        starter: prog('    int m[10][10];\n    int n, i, j, total = 0;\n    // Read the N by N table, then add up the diagonal\n'),
        sampleInput: '3 1 2 3 4 5 6 7 8 9',
        usesInput: true,
        tests: [
          { input: '3 1 2 3 4 5 6 7 8 9', expected: 'Diagonal: 15' },
          { input: '1 7', expected: 'Diagonal: 7' },
          { input: '2 5 9 9 5', expected: 'Diagonal: 10', hidden: true },
        ],
        hints: [
          'The diagonal boxes are the ones where the row number equals the column number: `m[0][0]`, `m[1][1]`, ...',
          'You do not need nested loops to add them: one loop with `total = total + m[i][i];`.',
          'A similar example: the diagonal of a 3 by 3 table of 1 to 9 is 1 + 5 + 9.',
        ],
      },
      {
        id: 'c19-transpose',
        title: 'Flip the table',
        prompt: 'The first two numbers are rows and columns, followed by the table. Print its **transpose**: the table with rows and columns swapped. Separate numbers in a line with a single space.',
        starter: prog('    int m[10][10];\n    int rows, cols, i, j;\n    // Read the table, then print it with rows and columns swapped\n'),
        sampleInput: '2 3 1 2 3 4 5 6',
        usesInput: true,
        tests: [
          { input: '2 3 1 2 3 4 5 6', expected: '1 4\n2 5\n3 6' },
          { input: '1 2 7 8', expected: '7\n8' },
          { input: '2 2 1 2 3 4', expected: '1 3\n2 4', hidden: true },
        ],
        hints: [
          'The transposed table has `cols` rows and `rows` columns. Loop `j` from 0 to `cols - 1` on the outside.',
          'Inside, loop `i` from 0 to `rows - 1` and print `m[i][j]`: you walk down a column of the original while printing along a row.',
          'Print a space between numbers but not after the last one: `if (i < rows - 1) { printf(" "); }`, then `\\n` after the inner loop.',
        ],
      },
    ],
  },
];
