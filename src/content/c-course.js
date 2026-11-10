// C course (draft pack aligned to a Structured Programming module).
// NOTE: the lesson order and topics are a first draft. They must be mapped to the official
// module outline before this pack is used for assessed work.
//
// Lesson blocks: { t: 'p' | 'code' | 'list' | 'tip', ... }. `code` blocks use String.raw so
// that \n stays a backslash-n in the displayed C code.

const skeleton = (body) => String.raw`#include <stdio.h>

int main() {
${body}
    return 0;
}
`;

const table = (n) => Array.from({ length: 12 }, (_, i) => `${n} x ${i + 1} = ${n * (i + 1)}`).join('\n');

export const cCourse = {
  id: 'c-structured',
  language: 'c',
  title: 'Structured Programming in C',
  subtitle: 'Draft pack for the Structured Programming module',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'c-first',
      title: 'Your first C program',
      summary: 'main, printf, new lines and semicolons',
      blocks: [
        { t: 'p', text: 'Every C program starts at a function called `main`. The computer runs the statements inside `main` one by one, from top to bottom.' },
        {
          t: 'code',
          text: String.raw`#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}`,
        },
        { t: 'p', text: 'Read it line by line:' },
        {
          t: 'list',
          items: [
            '`#include <stdio.h>` lets you use `printf`, the function that prints to the screen.',
            '`int main()` is where the program starts. The curly brackets `{ }` hold the program.',
            '`printf("...")` prints the text between the quotes. `\\n` moves to a new line.',
            'Every statement ends with a semicolon `;`.',
            '`return 0;` tells the computer the program finished well.',
          ],
        },
        { t: 'tip', text: 'C is strict: a missing `;` or `}` stops the whole program. When that happens, read the error card. SayMaCoder explains it in plain words.' },
      ],
      exercises: [
        {
          id: 'c1-hello',
          title: 'Hello, Uganda',
          prompt: 'Write a program that prints exactly: `Hello, Uganda!`',
          starter: skeleton('    // Print the greeting here\n'),
          tests: [{ expected: 'Hello, Uganda!' }],
          hints: [
            'Use `printf` to print text. The text goes inside double quotes.',
            'Inside `main`, write one `printf` line and end it with a semicolon. Your program needs `#include <stdio.h>` at the top.',
            'A similar example: `printf("Good morning!\\n");` prints Good morning! Now change the text so it matches exactly, including the capital H, the comma and the exclamation mark.',
          ],
        },
        {
          id: 'c1-twolines',
          title: 'Two lines',
          prompt: 'Print these two lines, one under the other:\n\n`Welcome to C`\n`Let\'s learn together`',
          starter: skeleton('    // Print two lines\n'),
          tests: [{ expected: "Welcome to C\nLet's learn together" }],
          hints: [
            'Each `printf` prints what is inside its quotes. To jump to the next line, put `\\n` at the end of the text.',
            'You can use two `printf` statements, or one `printf` with `\\n` in the middle.',
            'A similar example: `printf("Red\\n"); printf("Green\\n");` prints Red, then Green on the next line.',
          ],
        },
        {
          id: 'c1-triangle',
          title: 'Star triangle',
          prompt: 'Print this triangle of stars:\n\n`*`\n`**`\n`***`',
          starter: skeleton('    // Print the triangle\n'),
          tests: [{ expected: '*\n**\n***' }],
          hints: [
            'Print one row at a time. Each row is its own `printf` that ends with `\\n`.',
            'Row 1 has one star, row 2 has two, row 3 has three. Remember the `\\n` after each row.',
            'A similar example: `printf("#\\n"); printf("##\\n");` prints a two-row triangle of # signs.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'c-variables',
      title: 'Variables and input',
      summary: 'int, float, scanf and arithmetic',
      blocks: [
        { t: 'p', text: 'A variable is a named box that stores a value. You must say what type of value it holds:' },
        {
          t: 'list',
          items: ['`int` for whole numbers, like 25 or -3', '`float` for decimals, like 3.14', '`char` for one character, like \'A\''],
        },
        {
          t: 'code',
          text: String.raw`int age = 20;
float price = 2500.50;
printf("Age: %d\n", age);
printf("Price: %.2f\n", price);`,
        },
        { t: 'p', text: 'The codes inside `printf` mark where a value goes: `%d` for an int, `%f` for a float (`%.2f` shows two decimals) and `%c` for a char.' },
        { t: 'p', text: 'To read a number typed by the user, use `scanf` and put `&` in front of the variable name:' },
        {
          t: 'code',
          text: String.raw`int a;
scanf("%d", &a);`,
        },
        { t: 'p', text: 'The arithmetic operators are `+`, `-`, `*`, `/` and `%` (the remainder). Careful: `7 / 2` is `3` because both numbers are integers. Use `7 / 2.0` to get 3.5.' },
        { t: 'tip', text: 'In these exercises, type the input values in the Input box. Separate them with spaces or put each on its own line.' },
      ],
      exercises: [
        {
          id: 'c2-sum',
          title: 'Add two numbers',
          prompt: 'Read two whole numbers and print their sum like this: `Sum: 8`',
          starter: skeleton('    int a, b;\n    // Read a and b with scanf, then print the sum\n'),
          sampleInput: '3 5',
          usesInput: true,
          tests: [
            { input: '3 5', expected: 'Sum: 8' },
            { input: '10 20', expected: 'Sum: 30' },
            { input: '-4 9', expected: 'Sum: 5', hidden: true },
          ],
          hints: [
            'Use one `scanf` to read both numbers. The format is `"%d %d"` and each variable gets an `&`.',
            '`scanf("%d %d", &a, &b);` reads both. Then print with `printf("Sum: %d\\n", a + b);`.',
            'A similar example that multiplies: `scanf("%d %d", &x, &y); printf("Product: %d\\n", x * y);` Change the operator and the label.',
          ],
        },
        {
          id: 'c2-change',
          title: 'Shop change',
          prompt: 'An item costs `price` shillings and the customer pays `paid` shillings. Read `price` then `paid` and print the change like this: `Change: 1500`',
          starter: skeleton('    int price, paid;\n    // Read both numbers, then print the change\n'),
          sampleInput: '3500 5000',
          usesInput: true,
          tests: [
            { input: '3500 5000', expected: 'Change: 1500' },
            { input: '800 1000', expected: 'Change: 200' },
            { input: '1200 2000', expected: 'Change: 800', hidden: true },
          ],
          hints: [
            'Change is what the customer paid minus the price.',
            'Read with `scanf("%d %d", &price, &paid);` and print `paid - price`.',
            'A similar example: a bus fare of 2000 paid with 5000 leaves `5000 - 2000`. Print it with `printf("Change: %d\\n", paid - price);`.',
          ],
        },
        {
          id: 'c2-average',
          title: 'Average of three',
          prompt: 'Read three whole numbers and print their average with two decimals, like this: `Average: 5.67`',
          starter: skeleton('    int a, b, c;\n    float average;\n    // Read the numbers, calculate the average, print it\n'),
          sampleInput: '3 4 10',
          usesInput: true,
          tests: [
            { input: '3 4 10', expected: 'Average: 5.67' },
            { input: '10 10 10', expected: 'Average: 10.00' },
            { input: '1 2 2', expected: 'Average: 1.67', hidden: true },
          ],
          hints: [
            'Add the three numbers and divide by 3. Remember that dividing two ints cuts off the decimals.',
            'Divide by `3.0` instead of `3` so the answer keeps its decimals: `average = (a + b + c) / 3.0;`',
            'A similar example: `half = n / 2.0;` keeps decimals, and `printf("%.2f\\n", half);` prints two decimals.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'c-decisions',
      title: 'Making decisions',
      summary: 'if, else, comparisons and the remainder operator',
      blocks: [
        { t: 'p', text: 'Programs decide what to do with `if` and `else`. The condition goes in round brackets and the code to run goes in curly brackets.' },
        {
          t: 'code',
          text: String.raw`if (marks >= 50) {
    printf("Pass\n");
} else {
    printf("Fail\n");
}`,
        },
        {
          t: 'list',
          items: [
            'Comparisons: `==` equal, `!=` not equal, `<`, `>`, `<=`, `>=`.',
            'Combine conditions with `&&` (and) and `||` (or).',
            'Use `else if` to check several cases in order. The first one that is true wins.',
            '`n % 2 == 0` is true when n is even, because the remainder after dividing by 2 is 0.',
          ],
        },
        { t: 'tip', text: 'A single `=` stores a value. Two `==` compare values. Mixing them up is one of the most common beginner mistakes.' },
      ],
      exercises: [
        {
          id: 'c3-passfail',
          title: 'Pass or fail',
          prompt: 'Read a mark. Print `Pass` if it is 50 or more, otherwise print `Fail`.',
          starter: skeleton('    int marks;\n    // Read the mark and decide\n'),
          sampleInput: '75',
          usesInput: true,
          tests: [
            { input: '75', expected: 'Pass' },
            { input: '49', expected: 'Fail' },
            { input: '50', expected: 'Pass', name: 'Exactly 50' },
          ],
          hints: [
            'You need an `if` with the condition `marks >= 50` and an `else`.',
            'Read with `scanf("%d", &marks);` then `if (marks >= 50) { ... } else { ... }`.',
            'A similar example: `if (age >= 18) { printf("Adult\\n"); } else { printf("Minor\\n"); }`',
          ],
        },
        {
          id: 'c3-evenodd',
          title: 'Even or odd',
          prompt: 'Read a whole number. Print `Even` if it is even, otherwise print `Odd`.',
          starter: skeleton('    int n;\n    // Read n and decide\n'),
          sampleInput: '7',
          usesInput: true,
          tests: [
            { input: '4', expected: 'Even' },
            { input: '7', expected: 'Odd' },
            { input: '0', expected: 'Even', name: 'Zero' },
            { input: '-3', expected: 'Odd', hidden: true },
          ],
          hints: [
            'An even number leaves a remainder of 0 when divided by 2. The remainder operator is `%`.',
            'Check `n % 2 == 0`. Careful: use two equals signs to compare.',
            'A similar example: `if (n % 5 == 0) { printf("Multiple of 5\\n"); }` Use the same idea with 2.',
          ],
        },
        {
          id: 'c3-grade',
          title: 'Grade',
          prompt: 'Read a mark and print its grade like `Grade: B`.\n\n80 or more is A, 70 to 79 is B, 60 to 69 is C, 50 to 59 is D, below 50 is F.',
          starter: skeleton('    int marks;\n    // Read the mark and print the grade\n'),
          sampleInput: '72',
          usesInput: true,
          tests: [
            { input: '85', expected: 'Grade: A' },
            { input: '72', expected: 'Grade: B' },
            { input: '61', expected: 'Grade: C' },
            { input: '50', expected: 'Grade: D' },
            { input: '30', expected: 'Grade: F' },
            { input: '80', expected: 'Grade: A', name: 'Exactly 80', hidden: true },
          ],
          hints: [
            'Use a chain: `if`, then `else if` for each grade, then a final `else` for F.',
            'Check from the highest grade down: `if (marks >= 80)`, `else if (marks >= 70)`, and so on. Because the checks run in order, you only need `>=`.',
            'A similar example: `if (km >= 100) { printf("Far\\n"); } else if (km >= 10) { printf("Medium\\n"); } else { printf("Near\\n"); }`',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'c-loops',
      title: 'Repeating with loops',
      summary: 'for and while loops',
      blocks: [
        { t: 'p', text: 'A loop repeats code. A `for` loop is the best choice when you know how many times to repeat.' },
        {
          t: 'code',
          text: String.raw`int i;
for (i = 1; i <= 5; i++) {
    printf("%d\n", i);
}`,
        },
        {
          t: 'list',
          items: [
            '`i = 1` runs once at the start.',
            '`i <= 5` is checked before every round. When it is false, the loop ends.',
            '`i++` runs after every round and adds 1 to i.',
          ],
        },
        { t: 'p', text: 'To add up numbers, keep a running total that starts at 0:' },
        {
          t: 'code',
          text: String.raw`int total = 0;
for (i = 1; i <= 5; i++) {
    total = total + i;
}`,
        },
        { t: 'tip', text: 'If your program never stops, the loop condition never becomes false. Check that the loop variable really changes.' },
      ],
      exercises: [
        {
          id: 'c4-count',
          title: 'Count to N',
          prompt: 'Read a number N and print the numbers from 1 to N, each on its own line.',
          starter: skeleton('    int n, i;\n    // Read n, then loop from 1 to n\n'),
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
          starter: skeleton('    int n, i, total = 0;\n    // Read n, add 1 to n into total, print it\n'),
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
          starter: skeleton('    int n, i;\n    // Read n, then print the table\n'),
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
      ],
    },
  ],
};
