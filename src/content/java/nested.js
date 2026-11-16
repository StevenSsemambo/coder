// Java, Level 2, lesson 8: Loops inside loops.
import { prog, imp, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const S = (body) => prog(body, SCAN);

export const nestedLesson = {
  id: 'j-nested',
  level: LEVEL,
  minutes: 28,
  title: 'Loops inside loops',
  summary: 'Nested loops for rows and columns: patterns, tables, totals per member, and labelled break',
  blocks: [
    {
      t: 'story',
      title: 'The deposit chart on the wall',
      text: 'On the wall of the SACCO office hangs a big chart. Each **row** is a member. Each **column** is a month. In every square, Mama Rose writes what that member deposited that month.\n\nTo fill the chart she works row by row: “Take the first member. Fill in all of her months, January to December. Then take the second member, and fill in all of her months…” She has **a loop (the months) inside a loop (the members)**. Java can do exactly the same.',
    },
    { t: 'h', text: 'A loop inside a loop' },
    { t: 'p', text: 'Put one loop inside the block of another. For **every single round of the outer loop**, the inner loop runs **completely**, from its start to its end. Press **Run** and look at how the stars form three rows of five.' },
    {
      t: 'try',
      code: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 5; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
      output: '*****\n*****\n*****',
    },
    { t: 'p', text: 'The inner loop uses `print`, so the five stars stay on one line. When the inner loop has finished, `System.out.println();` with nothing inside the brackets just moves to the next line, and the outer loop starts the next row.' },
    { t: 'analogy', text: 'A clock is a nested loop. The minute hand goes all the way round (60 steps) for every **one** step of the hour hand. The minute hand is the inner loop, and the hour hand is the outer loop. If the hour hand takes 12 steps and the minute hand 60 steps each time, the minute hand moves 12 × 60 = 720 times in total.' },
    { t: 'h', text: 'Making the inner loop depend on the outer one' },
    { t: 'p', text: 'The inner loop can use the outer counter. If the number of stars in a row equals the row number, the picture becomes a triangle. Predict it before you run it.' },
    {
      t: 'predict',
      code: prog(String.raw`        for (int row = 1; row <= 4; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
      question: 'What does this program print?',
      options: ['*\n**\n***\n****', '****\n****\n****\n****', '****\n***\n**\n*', '*\n*\n*\n*'],
      answer: 0,
      explain: 'In row 1 the inner loop runs once (col goes from 1 to 1), in row 2 twice, in row 3 three times, and in row 4 four times. So the rows have 1, 2, 3 and 4 stars.',
    },
    { t: 'h', text: 'Tables with neat columns' },
    { t: 'p', text: 'A multiplication table is a nested loop too: the outer counter is the row, the inner counter the column, and each square holds `row * col`. `printf("%4d", ...)` prints each number in a field 4 characters wide, so the columns line up.' },
    {
      t: 'try',
      code: prog(String.raw`        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 4; j++) {
                System.out.printf("%4d", i * j);
            }
            System.out.println();
        }`),
      output: '   1   2   3   4\n   2   4   6   8\n   3   6   9  12',
    },
    {
      t: 'predict',
      code: prog(String.raw`        int count = 0;
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 4; j++) {
                count++;
            }
        }
        System.out.println(count);`),
      question: 'What does this program print?',
      options: ['12', '7', '4', '3'],
      answer: 0,
      explain: 'The inner body runs 4 times for each of the 3 rounds of the outer loop: 3 × 4 = 12. To count the work of a nested loop, multiply the number of rounds.',
    },
    { t: 'h', text: 'A real job: totals per member' },
    { t: 'p', text: 'The input holds the deposits of 3 members over 4 months, member by member. For each member we add up her four numbers and print the total. Notice where `total` is created: **inside the outer loop**, so that it starts again from 0 for every member.' },
    {
      t: 'project',
      title: 'Village SACCO, step 2: totals per member',
      text: 'We now read a grid of deposits and report each member’s total. This is the heart of the monthly report that Mama Rose does by hand.',
      stdin: '10000 20000 15000 5000\n30000 0 0 10000\n5000 5000 5000 5000',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int members = 3;
        int months = 4;
        for (int m = 1; m <= members; m++) {
            int total = 0;
            for (int k = 1; k <= months; k++) {
                total += in.nextInt();
            }
            System.out.println("Member " + m + ": " + total);
        }`),
      output: 'Member 1: 50000\nMember 2: 40000\nMember 3: 20000',
    },
    { t: 'h', text: 'break and continue in nested loops' },
    { t: 'p', text: 'A plain `break` leaves **only the inner loop**: the outer loop carries on with its next round. Look at this program: when `col` reaches 2, the inner loop stops, but every row still prints its first column.' },
    {
      t: 'predict',
      code: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 3; col++) {
                if (col == 2) {
                    break;
                }
                System.out.print(row + "," + col + " ");
            }
        }
        System.out.println();`),
      question: 'What does this program print?',
      options: ['1,1 2,1 3,1', '1,1 1,2 1,3', '1,1', '1,1 2,1 3,1 3,2'],
      answer: 0,
      explain: 'In every row the inner loop prints column 1, and as soon as col is 2 it breaks out of the inner loop only. The outer loop then goes on to the next row. So we see 1,1 then 2,1 then 3,1.',
    },
    { t: 'p', text: 'To leave **both** loops at once, put a label in front of the outer loop (a name followed by a colon) and write `break label;`. Here we stop at the first pair whose product is 4.' },
    {
      t: 'try',
      code: prog(String.raw`        outer:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i * j == 4) {
                    System.out.println("Found " + i + " x " + j);
                    break outer;
                }
            }
        }`),
      output: 'Found 2 x 2',
    },
    {
      t: 'fill',
      prompt: 'Choose the limit of the inner loop so that each row has as many stars as its row number. The program should print a triangle of 3 rows.',
      template: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= ___; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
      blanks: [{ options: ['row', '5', 'rows'], answer: 'row' }],
      output: '*\n**\n***',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to print 2 rows of 3 hash signs. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        for (int row = 1; row <= 2; row++) {`,
        String.raw`            for (int col = 1; col <= 3; col++) {`,
        String.raw`                System.out.print("#");`,
        String.raw`            }`,
        String.raw`            System.out.println();`,
        String.raw`        }`,
        ...TAIL,
      ],
      output: '###\n###',
    },
    {
      t: 'bug',
      code: prog(String.raw`        for (int i = 1; i <= 2; i++) {
            for (int i = 1; i <= 3; i++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
      question: 'The compiler says “variable i is already defined”. What is the mistake?',
      options: ['Both loops use the counter name i, and the inner loop must have its own name', 'A for loop cannot be inside another for loop', 'println must come before the inner loop', 'The loops need a label'],
      answer: 0,
      explain: 'While the outer loop is running, `i` already exists. The inner loop tries to create a second `i`, which would be confusing, so Java refuses. Give each loop its own counter: i and j, or row and col.',
      fixed: prog(String.raw`        for (int i = 1; i <= 2; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
    },
    {
      t: 'quiz',
      question: 'How many times does the body of the inner loop run in total?\n`for (int i = 0; i < 4; i++) { for (int j = 0; j < 5; j++) { ... } }`',
      options: ['20', '9', '5', '4'],
      answer: 0,
      explain: 'The inner loop runs 5 times for each of the 4 rounds of the outer loop: 4 × 5 = 20.',
    },
    {
      t: 'quiz',
      question: 'What does `System.out.println();` with nothing in the brackets do?',
      options: ['Moves to a new line', 'Prints the word null', 'Causes an error', 'Prints a space'],
      answer: 0,
      explain: 'With no text, println prints nothing and ends the line. It is the standard way to finish a row after an inner loop that used print.',
    },
    {
      t: 'quiz',
      question: 'A plain `break;` inside the inner of two loops. What does it leave?',
      options: ['Only the inner loop', 'Both loops', 'Only the outer loop', 'The whole program'],
      answer: 0,
      explain: 'break leaves the loop it is directly inside. To leave both, use a label: break outer;',
    },
    {
      t: 'mistakes',
      items: [
        {
          logic: true,
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        int total = 0;
        for (int m = 1; m <= 3; m++) {
            for (int k = 1; k <= 2; k++) {
                total += in.nextInt();
            }
            System.out.println("Member " + m + ": " + total);
        }`),
          why: 'The variable `total` is created **outside** the outer loop, so it keeps growing from one member to the next: member 2 shows member 1’s money added in. Create it inside the outer loop so that it starts again at 0 for each member.',
          stdin: '10 20 30 40 50 60',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        for (int m = 1; m <= 3; m++) {
            int total = 0;
            for (int k = 1; k <= 2; k++) {
                total += in.nextInt();
            }
            System.out.println("Member " + m + ": " + total);
        }`),
        },
        {
          logic: true,
          wrong: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 4; col++) {
                System.out.print("*");
            }
        }`),
          why: 'Nothing ends the line after each row, so all twelve stars appear in one long row. Add `System.out.println();` after the inner loop, still inside the outer loop.',
          right: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 4; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
        },
        {
          logic: true,
          wrong: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col < row; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
          why: 'The inner loop uses `col < row` instead of `col <= row`, so every row has one star too few, and the first row is empty. This is an off-by-one error again, now in a nested loop.',
          right: prog(String.raw`        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A loop inside a loop: the inner loop runs completely for every round of the outer loop.',
        'Total rounds = outer rounds × inner rounds. Use `print` in the inner loop and `println()` after it to end each row.',
        'The inner loop can use the outer counter (a triangle). Each loop needs its own counter name.',
        'Create a total inside the outer loop when each row needs its own total.',
        '`break` leaves only the inner loop. `break label;` leaves the labelled loop.',
      ],
      memory: 'Outer is the clock hour, inner is the minute hand.',
    },
  ],
  exercises: [
    {
      id: 'j8-rectangle',
      title: 'A rectangle of hashes',
      prompt: 'Read the number of rows and then the number of columns. Print a rectangle made of `#`. For `2 5` the output is:\n\n`#####`\n`#####`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read rows and cols, then use two loops\n', SCAN),
      sampleInput: '2 5',
      usesInput: true,
      tests: [
        { input: '2 5', expected: '#####\n#####' },
        { input: '3 2', expected: '##\n##\n##' },
        { input: '1 1', expected: '#', hidden: true },
      ],
      hints: [
        'The outer loop counts the rows. The inner loop prints one `#` for each column.',
        'After the inner loop, end the row with `System.out.println();`',
        '`for (int r = 0; r < rows; r++) { for (int c = 0; c < cols; c++) { System.out.print("#"); } System.out.println(); }`',
      ],
    },
    {
      id: 'j8-triangle',
      title: 'A triangle of stars',
      prompt: 'Read a number n and print a triangle of n rows: the first row has one star, the second two stars, and so on. For `4`:\n\n`*`\n`**`\n`***`\n`****`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n, then print the triangle\n', SCAN),
      sampleInput: '4',
      usesInput: true,
      tests: [
        { input: '4', expected: '*\n**\n***\n****' },
        { input: '1', expected: '*' },
        { input: '6', expected: '*\n**\n***\n****\n*****\n******', hidden: true },
      ],
      hints: [
        'The number of stars in a row equals the row number. So the inner loop must depend on the outer counter.',
        'Outer: `for (int row = 1; row <= n; row++)`. Inner: `for (int col = 1; col <= row; col++)`',
        'Print one `*` with `print` inside the inner loop, and call `System.out.println();` after it.',
      ],
    },
    {
      id: 'j8-table',
      title: 'A multiplication table',
      prompt: 'Read a number n and print an n by n multiplication table. Print every number with `printf("%3d", ...)` so that the columns line up, and end each row with a new line. For `3`:\n\n`  1  2  3`\n`  2  4  6`\n`  3  6  9`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n, then print the table with printf("%3d", ...)\n', SCAN),
      sampleInput: '3',
      usesInput: true,
      tests: [
        { input: '3', expected: '  1  2  3\n  2  4  6\n  3  6  9' },
        { input: '1', expected: '  1' },
        { input: '4', expected: '  1  2  3  4\n  2  4  6  8\n  3  6  9 12\n  4  8 12 16', hidden: true },
      ],
      hints: [
        'The outer loop is the row i and the inner loop is the column j. Each square holds `i * j`.',
        'Inside the inner loop: `System.out.printf("%3d", i * j);` Each number takes exactly 3 characters.',
        'After the inner loop add `System.out.println();` to finish the row. Both loops run from 1 to n.',
      ],
    },
    {
      id: 'j8-sacco-totals',
      title: 'Totals per member and for the group',
      prompt: 'The first line holds the number of members and the number of months. Then come the deposits, member by member. Print each member’s total, and then the group total:\n\n`Member 1: 50000`\n`Member 2: 40000`\n`Member 3: 20000`\n`Group total: 110000`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read members and months, then the deposits. Keep a total per member and one for the group.\n', SCAN),
      sampleInput: '3 4\n10000 20000 15000 5000\n30000 0 0 10000\n5000 5000 5000 5000',
      usesInput: true,
      tests: [
        { input: '3 4\n10000 20000 15000 5000\n30000 0 0 10000\n5000 5000 5000 5000', expected: 'Member 1: 50000\nMember 2: 40000\nMember 3: 20000\nGroup total: 110000' },
        { input: '1 2\n700 300', expected: 'Member 1: 1000\nGroup total: 1000' },
        { input: '2 3\n1 2 3\n4 5 6', expected: 'Member 1: 6\nMember 2: 15\nGroup total: 21', hidden: true },
      ],
      hints: [
        'Two loops: the outer one over the members, the inner one over the months. Create `groupTotal` before both loops.',
        'Inside the outer loop create `int total = 0;` so that every member starts again at 0. In the inner loop add `in.nextInt()` to it.',
        'After the inner loop print `"Member " + m + ": " + total` and add `total` to `groupTotal`. After both loops print the group total.',
      ],
    },
  ],
};
