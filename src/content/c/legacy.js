// Old-format drafts of the Level 2 lessons (decisions, loops). They still work and keep their exercise ids.
// They are replaced by rich-format lessons when Level 2 is written (see docs/C-TRACK.md).
import { skeleton } from './shared.js';

const table = (n) => Array.from({ length: 12 }, (_, i) => `${n} x ${i + 1} = ${n * (i + 1)}`).join('\n');

export const legacyLessons = [
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
];
