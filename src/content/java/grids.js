// Java, Level 2, lesson 13: Two-dimensional arrays.
import { prog, progM, imp, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const ARR = imp('java.util.Arrays');
const P = (body) => prog(body);
const PA = (body) => prog(body, ARR);
const S = (body) => prog(body, SCAN);
const MA = (methods, body) => progM(methods, body, ARR);

export const gridsLesson = {
  id: 'j-2d',
  level: LEVEL,
  minutes: 30,
  title: 'Two-dimensional arrays: tables',
  summary: 'Arrays of arrays: rows and columns, totals, grids from input, jagged rows, and a game board',
  blocks: [
    {
      t: 'story',
      title: 'The chart comes off the wall',
      text: 'In lesson 8 you filled the SACCO’s wall chart: members down the side, months across the top. But the chart only existed while the program ran: the numbers were read and forgotten. What if Mama Rose wants to ask the chart questions afterwards? “What did member 2 pay in March?” “Which month had the lowest total?”\n\nFor that the program must **keep the whole table in memory**. A table has two directions, so Java uses an array of arrays, a **two-dimensional array**. The first index picks the **row** and the second picks the **column**, just as you read a square on the chart.',
    },
    { t: 'h', text: 'Creating and reading a 2D array' },
    {
      t: 'list',
      items: [
        '**With values:** `int[][] grid = {{1, 2, 3}, {4, 5, 6}};` Each inner pair of braces is one **row**.',
        '**Empty, with sizes:** `int[][] chart = new int[3][4];` is 3 rows and 4 columns, all zeros.',
        '**One square:** `grid[1][2]` is row 1, column 2. Both indexes start at 0.',
        '**Sizes:** `grid.length` is the number of **rows**. `grid[0].length` is the number of **columns** (the length of the first row).',
      ],
    },
    {
      t: 'try',
      code: PA(String.raw`        int[][] grid = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(grid[1][2]);
        System.out.println(grid.length);
        System.out.println(grid[0].length);
        grid[0][0] = 10;
        System.out.println(Arrays.deepToString(grid));`),
      output: '6\n2\n3\n[[10, 2, 3], [4, 5, 6]]',
    },
    { t: 'analogy', text: 'Think of a block of flats. The building has floors (rows), and each floor has doors (columns). To visit a family you say the floor first and then the door: “floor 1, door 2”. `grid[1][2]` is exactly that address. And just like a real building, `grid[1]` on its own is **a whole floor**: a one-dimensional array that you can loop over or pass to a method.' },
    {
      t: 'predict',
      code: P(String.raw`        int[][] g = new int[2][3];
        g[1][2] = 7;
        System.out.println(g[0].length + " " + g.length + " " + g[1][2]);`),
      question: 'What does this program print?',
      options: ['3 2 7', '2 3 7', '3 2 0', '2 2 7'],
      answer: 0,
      explain: '`new int[2][3]` makes 2 rows of 3 columns. g[0].length is the row length, 3. g.length is the number of rows, 2. And g[1][2] is the square we set to 7.',
    },
    { t: 'h', text: 'Visiting every square: nested loops again' },
    { t: 'p', text: 'To go through a table you need a loop inside a loop, as in lesson 8: the outer loop runs over the rows, the inner loop over the columns. Now the numbers stay in memory, so we can add up the **rows** (the members) and the **columns** (the months) separately. The chart is the one from the Village SACCO wall.' },
    {
      t: 'try',
      code: P(String.raw`        int[][] chart = {
            {10000, 20000, 15000, 5000},
            {30000, 0, 0, 10000},
            {5000, 5000, 5000, 5000}
        };
        for (int r = 0; r < chart.length; r++) {
            int total = 0;
            for (int c = 0; c < chart[r].length; c++) {
                total += chart[r][c];
            }
            System.out.println("Member " + (r + 1) + ": " + total);
        }
        for (int c = 0; c < chart[0].length; c++) {
            int total = 0;
            for (int r = 0; r < chart.length; r++) {
                total += chart[r][c];
            }
            System.out.print(total + " ");
        }
        System.out.println();`),
      output: 'Member 1: 50000\nMember 2: 40000\nMember 3: 20000\n45000 25000 20000 20000',
    },
    { t: 'tip', text: 'For row totals the **outer loop is the row**. For column totals you swap the loops: the **outer loop is the column** and the inner loop goes down the rows. Always say aloud “for each row…” or “for each column…” before you write the loops.' },
    { t: 'h', text: 'Filling a table from input' },
    { t: 'p', text: 'Read the number of rows and columns first, create the table of that size, and fill it with two loops. The input comes one row after another, which matches the order of the loops.' },
    {
      t: 'try',
      stdin: '2 3\n1 2 3\n4 5 6',
      code: prog(String.raw`        Scanner in = new Scanner(System.in);
        int rows = in.nextInt();
        int cols = in.nextInt();
        int[][] grid = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                grid[r][c] = in.nextInt();
            }
        }
        System.out.println(Arrays.deepToString(grid));`, imp('java.util.Scanner', 'java.util.Arrays')),
      output: '[[1, 2, 3], [4, 5, 6]]',
    },
    { t: 'h', text: 'Rows of different lengths' },
    { t: 'p', text: 'A 2D array is really an array whose boxes are arrays, so the rows need **not** all be the same length. Write `new int[4][]` to create 4 rows that are not built yet (each is `null`), and then create every row yourself with its own length. This is called a **jagged array**. Pascal’s triangle is a classic example: row `i` has `i + 1` numbers, and each inner number is the sum of the two above it.' },
    {
      t: 'try',
      code: PA(String.raw`        int[][] t = new int[4][];
        for (int i = 0; i < 4; i++) {
            t[i] = new int[i + 1];
            t[i][0] = 1;
            t[i][i] = 1;
            for (int j = 1; j < i; j++) {
                t[i][j] = t[i - 1][j - 1] + t[i - 1][j];
            }
        }
        for (int i = 0; i < 4; i++) {
            System.out.println(Arrays.toString(t[i]));
        }`),
      output: '[1]\n[1, 1]\n[1, 2, 1]\n[1, 3, 3, 1]',
    },
    { t: 'h', text: 'A game board: char grids' },
    { t: 'p', text: 'A table does not have to hold numbers. A noughts-and-crosses (tic-tac-toe) board is a 3 by 3 grid of `char`. Here we print it, and then check whether X has won along the main diagonal, from the top-left corner to the bottom-right corner.' },
    {
      t: 'try',
      code: P(String.raw`        char[][] board = {
            {'X', 'O', 'X'},
            {'O', 'X', 'O'},
            {' ', ' ', 'X'}
        };
        for (int r = 0; r < 3; r++) {
            System.out.println(board[r][0] + "|" + board[r][1] + "|" + board[r][2]);
        }
        if (board[0][0] == 'X' && board[1][1] == 'X' && board[2][2] == 'X') {
            System.out.println("X wins on the diagonal");
        }`),
      output: 'X|O|X\nO|X|O\n | |X\nX wins on the diagonal',
    },
    { t: 'h', text: 'Rows as arrays: passing a row to a method' },
    { t: 'p', text: 'Because `grid[r]` is a whole one-dimensional array, you can hand it to any method that takes an `int[]`. This lets you reuse the methods you wrote in the last two lessons.' },
    {
      t: 'try',
      code: MA(
        String.raw`    static int sum(int[] row) {
        int total = 0;
        for (int x : row) {
            total += x;
        }
        return total;
    }`,
        String.raw`        int[][] chart = {{10000, 20000}, {30000, 5000}};
        for (int r = 0; r < chart.length; r++) {
            System.out.println("Row " + r + ": " + sum(chart[r]));
        }
        System.out.println(Arrays.toString(chart[1]));`,
      ),
      output: 'Row 0: 30000\nRow 1: 35000\n[30000, 5000]',
    },
    {
      t: 'fill',
      prompt: 'Choose the row number so that the program prints **5**, the first number of the third row.',
      template: P(String.raw`        int[][] grid = {{1, 2}, {3, 4}, {5, 6}};
        System.out.println(grid[___][0]);`),
      blanks: [{ options: ['2', '1', '3'], answer: '2' }],
      output: '5',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: create the grid, set a square, use it, and print it. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        int[][] g = new int[2][2];`,
        String.raw`        g[0][0] = 5;`,
        String.raw`        g[1][1] = g[0][0] + 1;`,
        String.raw`        System.out.println(g[1][1]);`,
        ...TAIL,
      ],
      output: '6',
    },
    {
      t: 'bug',
      code: P(String.raw`        int[][] g = new int[2][3];
        g[0, 1] = 5;
        System.out.println(g[0][1]);`),
      question: 'The compiler complains about `g[0, 1]`. What is the mistake?',
      options: ['Each index needs its own pair of square brackets: g[0][1]', 'A 2D array must be created with braces', 'The row number must come second', 'The array needs three dimensions'],
      answer: 0,
      explain: 'Java has no comma-separated index. A 2D array is an array of arrays, so you pick the row with one pair of brackets and then the column with another: g[0][1].',
      fixed: P(String.raw`        int[][] g = new int[2][3];
        g[0][1] = 5;
        System.out.println(g[0][1]);`),
    },
    {
      t: 'quiz',
      question: 'For `int[][] g = new int[3][5];`, what is `g.length`?',
      options: ['3, the number of rows', '5, the number of columns', '15, the number of squares', '8'],
      answer: 0,
      explain: 'g.length counts the rows. g[0].length counts the columns of the first row, which is 5. The number of squares is 3 × 5 = 15, but Java does not store that number.',
    },
    {
      t: 'quiz',
      question: 'In `chart[2][1]`, which index is the row?',
      options: ['The first one, 2', 'The second one, 1', 'Neither. It is the sum', 'It depends on the array'],
      answer: 0,
      explain: 'The first pair of brackets picks the row, and the second picks the column, like “floor 2, door 1”.',
    },
    {
      t: 'quiz',
      question: 'You want the total of every COLUMN of a table. Which loop is the outer loop?',
      options: ['The loop over the columns', 'The loop over the rows', 'It makes no difference', 'Neither. You cannot do it'],
      answer: 0,
      explain: 'Each column total is built by going down one column. So the outer loop picks the column and the inner loop runs through the rows.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: P(String.raw`        int[][] g = new int[2][3];
        g[3][0] = 1;
        System.out.println(g[0][0]);`),
          why: 'The table has only 2 rows, numbered 0 and 1, so row 3 does not exist and the program stops with an ArrayIndexOutOfBoundsException. Remember: the first index is the row, and it must be below `g.length`.',
          right: P(String.raw`        int[][] g = new int[2][3];
        g[1][0] = 1;
        System.out.println(g[1][0]);`),
        },
        {
          wrong: P(String.raw`        int[][] g = new int[3][];
        g[0][0] = 1;
        System.out.println(g[0][0]);`),
          why: '`new int[3][]` creates three rows that are not built yet: each is null. Putting a value into a row that does not exist stops the program with a NullPointerException. Create the row first: `g[0] = new int[4];`.',
          right: P(String.raw`        int[][] g = new int[3][];
        g[0] = new int[4];
        g[0][0] = 1;
        System.out.println(g[0][0]);`),
        },
        {
          logic: true,
          wrong: P(String.raw`        int[][] g = {{1, 2, 3}, {4, 5, 6}};
        int total = 0;
        for (int r = 0; r < g.length; r++) {
            for (int c = 0; c < g.length; c++) {
                total += g[r][c];
            }
        }
        System.out.println(total);`),
          why: 'The inner loop uses `g.length` (2 rows) as the number of columns, so it skips the last column. This prints 12 instead of 21. The number of columns is `g[r].length`.',
          right: P(String.raw`        int[][] g = {{1, 2, 3}, {4, 5, 6}};
        int total = 0;
        for (int r = 0; r < g.length; r++) {
            for (int c = 0; c < g[r].length; c++) {
                total += g[r][c];
            }
        }
        System.out.println(total);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A 2D array is an array of arrays: `int[][] g = new int[rows][cols];`. `g[r][c]` is row r, column c.',
        '`g.length` is the number of rows. `g[r].length` is the number of columns of row r.',
        'Visit every square with a loop inside a loop. Row totals: rows outside. Column totals: columns outside.',
        'Rows may have different lengths (jagged), but each row must be created before use.',
        '`g[r]` is a whole row, a normal array you can give to a method. `Arrays.deepToString` prints a table.',
      ],
      memory: 'Floor first, door second.',
    },
  ],
  exercises: [
    {
      id: 'j13-grid-total',
      title: 'Total and largest',
      prompt: 'The first line holds the number of rows and columns. Then come the numbers of the table, row by row. Print the total of all the squares and the largest square:\n\n`Total: 21`\n`Largest: 6`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read rows and cols, then fill a 2D array and go through it\n', SCAN),
      sampleInput: '2 3\n1 2 3\n4 5 6',
      usesInput: true,
      tests: [
        { input: '2 3\n1 2 3\n4 5 6', expected: 'Total: 21\nLargest: 6' },
        { input: '1 1\n-4', expected: 'Total: -4\nLargest: -4' },
        { input: '3 2\n1 9 2 8 3 7', expected: 'Total: 30\nLargest: 9', hidden: true },
      ],
      hints: [
        'Create `int[][] g = new int[rows][cols];` and fill it with two nested loops using `in.nextInt()`.',
        'Start `largest` with `g[0][0]` (not with 0), then compare every square with it.',
        'You can add to the total and update the largest in the same pair of loops after the table is filled.',
      ],
    },
    {
      id: 'j13-row-totals',
      title: 'Totals per member',
      prompt: 'Read rows and columns, then the table (each row is one member, each column a month). Print every member’s total, then the best member:\n\n`Member 1: 50000`\n`Member 2: 40000`\n`Best: Member 1`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Fill the table, then total every row and find the largest total\n', SCAN),
      sampleInput: '2 4\n10000 20000 15000 5000\n30000 0 0 10000',
      usesInput: true,
      tests: [
        { input: '2 4\n10000 20000 15000 5000\n30000 0 0 10000', expected: 'Member 1: 50000\nMember 2: 40000\nBest: Member 1' },
        { input: '3 2\n1 1\n5 5\n3 3', expected: 'Member 1: 2\nMember 2: 10\nMember 3: 6\nBest: Member 2' },
        { input: '1 3\n7 8 9', expected: 'Member 1: 24\nBest: Member 1', hidden: true },
      ],
      hints: [
        'Row totals: the outer loop is the row. Create `int total = 0;` inside it.',
        'Keep `bestTotal` and `bestMember` as you go. If this member’s total is bigger than `bestTotal`, update both.',
        'Print each member inside the outer loop, and the best member after both loops: `"Best: Member " + bestMember`.',
      ],
    },
    {
      id: 'j13-col-totals',
      title: 'Totals per month',
      prompt: 'Read rows and columns, then the table. Print the total of every **column** on one line, separated by spaces: `45000 25000 20000 20000`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Fill the table, then total every column\n', SCAN),
      sampleInput: '3 4\n10000 20000 15000 5000\n30000 0 0 10000\n5000 5000 5000 5000',
      usesInput: true,
      tests: [
        { input: '3 4\n10000 20000 15000 5000\n30000 0 0 10000\n5000 5000 5000 5000', expected: '45000 25000 20000 20000' },
        { input: '2 2\n1 2\n3 4', expected: '4 6' },
        { input: '1 3\n9 8 7', expected: '9 8 7', hidden: true },
      ],
      hints: [
        'This time the **outer loop is the column** and the inner loop goes down the rows.',
        '`for (int c = 0; c < cols; c++) { int total = 0; for (int r = 0; r < rows; r++) { total += g[r][c]; } ... }`',
        'Print each total followed by a space, and end with `System.out.println();`',
      ],
    },
    {
      id: 'j13-transpose',
      title: 'Turn the table on its side',
      prompt: 'Read rows and columns, then the table. Print its **transpose**: the table with rows and columns swapped, so that it has `cols` rows and `rows` columns. Separate numbers with single spaces. For the table `1 2 3 / 4 5 6` print `1 4 / 2 5 / 3 6` on three lines.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Fill the table, then print column 0 as the first line, column 1 as the second, ...\n', SCAN),
      sampleInput: '2 3\n1 2 3\n4 5 6',
      usesInput: true,
      tests: [
        { input: '2 3\n1 2 3\n4 5 6', expected: '1 4\n2 5\n3 6' },
        { input: '1 3\n7 8 9', expected: '7\n8\n9' },
        { input: '2 2\n1 2\n3 4', expected: '1 3\n2 4', hidden: true },
      ],
      hints: [
        'Line number c of the answer is made of column c of the original table: `g[0][c]`, `g[1][c]`, `g[2][c]` ...',
        'The outer loop runs over the columns, and the inner loop over the rows. Print each number followed by a space.',
        'After each inner loop, call `System.out.println();` to end the line.',
      ],
    },
    {
      id: 'j13-diagonal',
      title: 'The two diagonals',
      prompt: 'Read n and then an n by n table. Print the sum of the main diagonal (top-left to bottom-right) and the sum of the other diagonal (top-right to bottom-left):\n\n`Main: 15`\n`Other: 15`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Fill an n by n table, then add up the two diagonals\n', SCAN),
      sampleInput: '3\n2 7 6\n9 5 1\n4 3 8',
      usesInput: true,
      tests: [
        { input: '3\n2 7 6\n9 5 1\n4 3 8', expected: 'Main: 15\nOther: 15' },
        { input: '2\n1 2\n3 4', expected: 'Main: 5\nOther: 5' },
        { input: '1\n9', expected: 'Main: 9\nOther: 9', hidden: true },
        { input: '3\n1 2 3\n4 5 6\n7 8 9', expected: 'Main: 15\nOther: 15', hidden: true },
      ],
      hints: [
        'The main diagonal squares are `g[i][i]` for i = 0, 1, 2, ... You need only one loop.',
        'The other diagonal squares are `g[i][n - 1 - i]`.',
        'One loop `for (int i = 0; i < n; i++)` can add to both sums.',
      ],
    },
  ],
};
