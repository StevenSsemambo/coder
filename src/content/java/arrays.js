// Java, Level 2, lesson 11: Arrays.
import { prog, progM, imp, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const ARR = imp('java.util.Arrays');
const BOTH = imp('java.util.Scanner', 'java.util.Arrays');
const P = (body) => prog(body);
const PA = (body) => prog(body, ARR);
const S = (body) => prog(body, SCAN);
const SA = (body) => prog(body, BOTH);
const M = (methods, body) => progM(methods, body);

export const arraysLesson = {
  id: 'j-arrays',
  level: LEVEL,
  minutes: 32,
  title: 'Arrays: many values in a row',
  summary: 'Creating arrays, indexes from 0, length, loops over arrays, copies, and arrays in methods',
  blocks: [
    {
      t: 'story',
      title: 'The wall of pigeonholes',
      text: 'Behind the counter at the SACCO office is a wooden wall of pigeonholes, twelve of them in a row, numbered **0, 1, 2 … 11**. Each hole holds one envelope for one member’s passbook. When Mama Rose wants the passbook for hole 7, she walks straight to hole 7. She does not search.\n\nUntil now every value in your programs needed its own variable. For 120 members you would need 120 names. An **array** is the pigeonhole wall of Java: **one name for a row of numbered boxes**, all holding the same type of thing.',
    },
    { t: 'h', text: 'Creating an array' },
    {
      t: 'list',
      items: [
        '**With values you already know:** `int[] marks = {70, 85, 92};` The square brackets after the type mean “an array of”.',
        '**Empty, with a size:** `int[] deposits = new int[5];` creates 5 boxes. Every box starts with a default value: `0` for numbers, `false` for booleans, `null` for text and other objects.',
        '**Text:** `String[] names = {"Amina", "Joel", "Mary"};`',
      ],
    },
    { t: 'h', text: 'Index and length' },
    { t: 'p', text: 'Each box has a number, the **index**. The first box has index **0**, not 1. You reach a box by writing the array name and the index in square brackets: `marks[0]`. The size is `marks.length`. (It is written **without** brackets after `length`.) The last box has index `marks.length - 1`.' },
    {
      t: 'try',
      code: P(String.raw`        int[] marks = {70, 85, 92};
        System.out.println(marks[0]);
        marks[1] = 90;
        System.out.println(marks[1]);
        System.out.println(marks.length);
        System.out.println(marks[marks.length - 1]);`),
      output: '70\n90\n3\n92',
    },
    { t: 'analogy', text: 'Index 0 means “zero steps from the start”. The first pigeonhole is zero steps from the left end of the wall, the second is one step away, and so on. That is why the last of 12 holes is number 11. Counting from 0 feels strange for a week and natural for the rest of your life.' },
    { t: 'h', text: 'Going through an array with a loop' },
    { t: 'p', text: 'Arrays and loops belong together. A `for` loop with an index visits every box. When you only need each value, and not its position, the **for-each** loop is shorter: read `for (int d : deposits)` as “for each int d in deposits”.' },
    {
      t: 'try',
      code: P(String.raw`        int[] deposits = {20000, 35000, 15000};
        int total = 0;
        for (int i = 0; i < deposits.length; i++) {
            total += deposits[i];
        }
        System.out.println("Total: " + total);
        int count = 0;
        for (int d : deposits) {
            if (d >= 20000) {
                count++;
            }
        }
        System.out.println("Big deposits: " + count);`),
      output: 'Total: 70000\nBig deposits: 2',
    },
    { t: 'p', text: '`Arrays.toString(...)` turns a whole array into text for printing, and it shows the default values of a new array. Remember the import line at the top for `java.util.Arrays`.' },
    {
      t: 'try',
      code: PA(String.raw`        int[] a = new int[3];
        double[] b = new double[2];
        boolean[] c = new boolean[2];
        String[] d = new String[2];
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(b));
        System.out.println(Arrays.toString(c));
        System.out.println(Arrays.toString(d));
        a[1] = 7;
        System.out.println(Arrays.toString(a));`),
      output: '[0, 0, 0]\n[0.0, 0.0]\n[false, false]\n[null, null]\n[0, 7, 0]',
    },
    { t: 'h', text: 'Filling an array from input' },
    { t: 'p', text: 'You rarely know the values in advance. First read **how many**, then create an array of that size, and fill it with a loop. This is the standard shape of an array program.' },
    {
      t: 'try',
      stdin: '4\n20000 35000 15000 5000',
      code: SA(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] deposits = new int[n];
        for (int i = 0; i < n; i++) {
            deposits[i] = in.nextInt();
        }
        System.out.println(Arrays.toString(deposits));
        System.out.println("Last: " + deposits[n - 1]);`),
      output: '[20000, 35000, 15000, 5000]\nLast: 5000',
    },
    { t: 'h', text: 'An array is a reference, not a copy' },
    { t: 'p', text: 'Here is the surprise of arrays. A variable such as `a` does not hold the boxes themselves. It holds the **address** of the pigeonhole wall. Writing `int[] b = a;` copies the **address**, so both names point to the **same** wall. Changing it through one name changes it for both. Predict what is printed.' },
    {
      t: 'predict',
      code: P(String.raw`        int[] a = {1, 2, 3};
        int[] b = a;
        a[0] = 99;
        System.out.println(b[0]);`),
      question: 'What does this program print?',
      options: ['99', '1', '0', 'It is an error'],
      answer: 0,
      explain: 'b = a does not copy the boxes. It makes b another name for the same array. So when a[0] changes to 99, b[0] shows 99 as well. To get a real, independent copy, use Arrays.copyOf.',
    },
    {
      t: 'try',
      code: PA(String.raw`        int[] a = {1, 2, 3};
        int[] copy = Arrays.copyOf(a, a.length);
        a[0] = 99;
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(copy));`),
      output: '[99, 2, 3]\n[1, 2, 3]',
    },
    { t: 'h', text: 'Arrays in methods' },
    { t: 'p', text: 'Because an array variable holds an address, a method that receives an array can **change the original**. This is different from the plain `int` in lesson 9, where the method only changed its own copy. The method below adds a bonus to every deposit in the caller’s array, and returns nothing.' },
    {
      t: 'try',
      code: M(
        String.raw`    static void addBonus(int[] deposits, int bonus) {
        for (int i = 0; i < deposits.length; i++) {
            deposits[i] += bonus;
        }
    }`,
        String.raw`        int[] d = {20000, 35000, 15000};
        addBonus(d, 1000);
        System.out.println(d[0] + " " + d[1] + " " + d[2]);`,
      ),
      output: '21000 36000 16000',
    },
    { t: 'tip', text: 'An array has a **fixed size**. Once created with `new int[5]`, it always has exactly 5 boxes: you cannot add a sixth. When you need a list that grows and shrinks, Java has `ArrayList`, which comes in lesson 28.' },
    {
      t: 'fill',
      prompt: 'Choose the index of the **last** box so the program prints **92**.',
      template: P(String.raw`        int[] marks = {70, 85, 92};
        System.out.println(marks[___]);`),
      blanks: [{ options: ['marks.length - 1', 'marks.length', 'marks.length + 1'], answer: 'marks.length - 1' }],
      output: '92',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: each line needs the one before it. The program prints the first box plus the length. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        int n = 3;`,
        String.raw`        int[] a = new int[n];`,
        String.raw`        a[0] = 7;`,
        String.raw`        System.out.println(a[0] + a.length);`,
        ...TAIL,
      ],
      output: '10',
    },
    {
      t: 'bug',
      code: P(String.raw`        int[] marks = {70, 85, 92};
        System.out.println(marks.length());`),
      question: 'The compiler says “cannot find symbol: method length()”. What is the mistake?',
      options: ['For an array, length has no brackets. It is marks.length', 'The array must be created with new', 'length must start with a capital L', 'println cannot print a length'],
      answer: 0,
      explain: 'An array’s size is a value stored inside the array, so you write marks.length with no brackets. (A String is different: it has a method, so you write text.length() with brackets. Easy to mix up!)',
      fixed: P(String.raw`        int[] marks = {70, 85, 92};
        System.out.println(marks.length);`),
    },
    {
      t: 'quiz',
      question: 'An array has 5 boxes. What is the index of the LAST box?',
      options: ['4', '5', '6', '0'],
      answer: 0,
      explain: 'The indexes are 0, 1, 2, 3 and 4. The last index is always length - 1.',
    },
    {
      t: 'quiz',
      question: 'What does `new int[4]` contain right after it is created?',
      options: ['Four zeros', 'Four empty strings', 'Nothing. You must fill it first', 'Four random numbers'],
      answer: 0,
      explain: 'Java sets every box of a new int array to 0 (false for a boolean array, null for objects such as Strings).',
    },
    {
      t: 'quiz',
      question: '`int[] b = a;` where a is an array. How many arrays exist now?',
      options: ['One array with two names', 'Two separate arrays', 'Zero. It is an error', 'It depends on the length'],
      answer: 0,
      explain: 'The assignment copies the address, not the boxes. Both variables point to the same array.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: P(String.raw`        int[] a = {1, 2, 3};
        System.out.println(a[3]);`),
          why: 'The array has three boxes with indexes 0, 1 and 2. Box 3 does not exist, so the program stops with an ArrayIndexOutOfBoundsException. The last valid index is `a.length - 1`.',
          right: P(String.raw`        int[] a = {1, 2, 3};
        System.out.println(a[2]);`),
        },
        {
          wrong: P(String.raw`        int[] a = {5, 6, 7};
        for (int i = 0; i <= a.length; i++) {
            System.out.println(a[i]);
        }`),
          why: 'With `i <= a.length` the loop also runs for i = 3, and a[3] does not exist. The program prints 5, 6, 7 and then stops with an error. Use `i < a.length`.',
          right: P(String.raw`        int[] a = {5, 6, 7};
        for (int i = 0; i < a.length; i++) {
            System.out.println(a[i]);
        }`),
        },
        {
          wrong: P(String.raw`        int[] a = {1, 2.5, 3};
        System.out.println(a[1]);`),
          why: 'All the boxes of an int array must hold ints. 2.5 is a double, so Java refuses to squeeze it in. Use a `double[]` array, or whole numbers.',
          right: P(String.raw`        double[] a = {1, 2.5, 3};
        System.out.println(a[1]);`),
        },
        {
          logic: true,
          wrong: P(String.raw`        int[] a = {1, 2, 3};
        int[] backup = a;
        a[0] = 99;
        System.out.println(backup[0]);`),
          why: 'The programmer wanted a safe copy, but `backup = a` only gave the same array a second name. The program prints 99 instead of 1. Make a real copy with `Arrays.copyOf(a, a.length)`.',
          right: PA(String.raw`        int[] a = {1, 2, 3};
        int[] backup = Arrays.copyOf(a, a.length);
        a[0] = 99;
        System.out.println(backup[0]);`),
        },
        {
          logic: true,
          wrong: P(String.raw`        int[] a = {1, 2, 3};
        System.out.println(a);`),
          why: 'Printing an array directly does not show its values. It prints a code such as `[I@6d06d69c`, the type and the address. To see the values, use `Arrays.toString(a)`.',
          right: PA(String.raw`        int[] a = {1, 2, 3};
        System.out.println(Arrays.toString(a));`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'An array is one name for a fixed row of boxes of the same type. Indexes start at 0, and the last is `length - 1`.',
        'Create with `int[] a = {1, 2, 3};` or `new int[5]` (filled with 0, false or null). The size is `a.length`, with no brackets.',
        'Loop with `for (int i = 0; i < a.length; i++)` or for-each: `for (int x : a)`.',
        '`int[] b = a;` is the same array with a second name. `Arrays.copyOf` makes a real copy. A method can change the caller’s array.',
        'Going past the end stops the program with ArrayIndexOutOfBoundsException. `Arrays.toString` prints the values.',
      ],
      memory: 'Count from zero, stop before length.',
    },
  ],
  exercises: [
    {
      id: 'j11-marks',
      title: 'Marks report',
      prompt: 'The first number is how many marks there are, then come the marks. Store them in an array and print the average (two decimals) and the highest mark:\n\n`Average: 82.33`\n`Highest: 92`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n, create an array of n ints, fill it, then work out the average and the highest\n', SCAN),
      sampleInput: '3\n70 85 92',
      usesInput: true,
      tests: [
        { input: '3\n70 85 92', expected: 'Average: 82.33\nHighest: 92' },
        { input: '1\n50', expected: 'Average: 50.00\nHighest: 50' },
        { input: '4\n10 20 30 40', expected: 'Average: 25.00\nHighest: 40', hidden: true },
      ],
      hints: [
        'Read n, then `int[] marks = new int[n];` and fill it in a loop with `marks[i] = in.nextInt();`',
        'Go through the array once: add every mark to a `sum`, and keep the biggest in `highest` (start it with `marks[0]`).',
        'Average = `sum / (double) n`. Print it with `System.out.printf("Average: %.2f%n", average);`',
      ],
    },
    {
      id: 'j11-reverse',
      title: 'Backwards',
      prompt: 'Read n and then n numbers. Print them in **reverse order** on one line, separated by single spaces. For `5 1 2 3 4 5` the output is `5 4 3 2 1`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the numbers into an array, then print from the last to the first\n', SCAN),
      sampleInput: '5\n1 2 3 4 5',
      usesInput: true,
      tests: [
        { input: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
        { input: '3\n10 20 30', expected: '30 20 10' },
        { input: '1\n7', expected: '7', hidden: true },
      ],
      hints: [
        'Store all the numbers first. Then loop **downwards**: start at index `n - 1` and go down to 0.',
        '`for (int i = n - 1; i >= 0; i--)`',
        'Print each number followed by a space with `System.out.print(a[i] + " ");` then finish with `System.out.println();`.',
      ],
    },
    {
      id: 'j11-above-average',
      title: 'Above the average',
      prompt: 'Read n and then n deposits. Count how many deposits are **above** the average of all the deposits, and print `Above average: 2`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Fill the array, work out the average, then count the deposits above it\n', SCAN),
      sampleInput: '4\n10 20 30 40',
      usesInput: true,
      tests: [
        { input: '4\n10 20 30 40', expected: 'Above average: 2' },
        { input: '3\n5 5 5', expected: 'Above average: 0' },
        { input: '5\n1 2 3 4 100', expected: 'Above average: 1', hidden: true },
      ],
      hints: [
        'This needs two passes over the array: one to find the average, one to count. That is why you must store the numbers.',
        'Average as a double: `double avg = sum / (double) n;`',
        'Second loop: `for (int d : deposits) { if (d > avg) { count++; } }`',
      ],
    },
    {
      id: 'j11-squares',
      title: 'Table of squares',
      prompt: 'Read n. Create an array of n ints where box `i` holds `i * i`, then print the whole array on one line separated by spaces. For `5` the output is `0 1 4 9 16`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Make an array of n squares, then print it\n', SCAN),
      sampleInput: '5',
      usesInput: true,
      tests: [
        { input: '5', expected: '0 1 4 9 16' },
        { input: '1', expected: '0' },
        { input: '8', expected: '0 1 4 9 16 25 36 49', hidden: true },
      ],
      hints: [
        'Create `int[] squares = new int[n];` and fill it with a loop: the value of box i is i * i.',
        '`for (int i = 0; i < n; i++) { squares[i] = i * i; }`',
        'Print with a second loop, `System.out.print(squares[i] + " ");`, and a final `System.out.println();`.',
      ],
    },
    {
      id: 'j11-bonus-method',
      title: 'Bonus for every member',
      prompt: 'The method `addBonus` should add `bonus` to **every** box of the array it receives. Complete it. After the call, `main` prints the changed deposits: `21000 36000 16000`.',
      starter: M(
        String.raw`    static void addBonus(int[] deposits, int bonus) {
        // Add the bonus to every deposit in the array
    }`,
        String.raw`        int[] d = {20000, 35000, 15000};
        addBonus(d, 1000);
        System.out.println(d[0] + " " + d[1] + " " + d[2]);`,
      ),
      tests: [{ expected: '21000 36000 16000' }],
      hints: [
        'The method receives the address of the same array that main uses, so changing the boxes changes them for main too.',
        'Loop over the indexes: `for (int i = 0; i < deposits.length; i++)`',
        '`deposits[i] += bonus;` or `deposits[i] = deposits[i] + bonus;` inside the loop. The method does not need to return anything.',
      ],
    },
  ],
};
