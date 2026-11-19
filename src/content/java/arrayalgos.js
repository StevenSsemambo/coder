// Java, Level 2, lesson 12: Array algorithms (search, min and max, counting, swapping, sorting).
import { prog, progM, imp, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const ARR = imp('java.util.Arrays');
const P = (body) => prog(body);
const PA = (body) => prog(body, ARR);
const S = (body) => prog(body, SCAN);
const M = (methods, body) => progM(methods, body);
const MA = (methods, body) => progM(methods, body, ARR);

export const arrayAlgosLesson = {
  id: 'j-array-algos',
  level: LEVEL,
  minutes: 35,
  title: 'Array algorithms: search, count and sort',
  summary: 'Linear and binary search, minimum and maximum, counting with an array, swapping, and sorting',
  blocks: [
    {
      t: 'story',
      title: 'The top savers board',
      text: 'At the end of the year the SACCO puts up a board: **the members with the highest savings**, in order. To make it, Mama Rose needs to do three things with her list of balances: **find** a particular member, **find the biggest** balance, and **put the whole list in order**.\n\nThese jobs, and a few more, appear in almost every program that holds lists. Programmers call a clear, step-by-step recipe for such a job an **algorithm**. In this lesson you will write the classics, and understand them well enough to invent your own.',
    },
    { t: 'h', text: 'Searching: linear search' },
    { t: 'p', text: 'The simplest way to find a value is to look at every box, one after another, until you meet it. Return its **index**, or `-1` if the loop ends and it was not there. `-1` is a good “not found” signal, because no real index is negative.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int indexOf(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) {
                return i;
            }
        }
        return -1;
    }`,
        String.raw`        int[] ids = {1042, 1101, 1007, 1233};
        System.out.println(indexOf(ids, 1007));
        System.out.println(indexOf(ids, 5000));`,
      ),
      output: '2\n-1',
    },
    { t: 'analogy', text: 'Linear search is looking for a name in an unsorted pile of passbooks: you pick them up one by one. If the pile has 1,000 passbooks you might need 1,000 looks. Binary search, below, is how you use a dictionary instead: you open in the middle and throw half away at every step.' },
    { t: 'h', text: 'Minimum, maximum and the “best so far” pattern' },
    { t: 'p', text: 'To find the biggest value, keep a variable `best` that holds the biggest **seen so far**. Start it with the **first element**, not with 0, and compare every other element with it. (If you started with 0, a list of only negative numbers would give the wrong answer.)' },
    {
      t: 'try',
      code: M(
        String.raw`    static int max(int[] a) {
        int best = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > best) {
                best = a[i];
            }
        }
        return best;
    }

    static int min(int[] a) {
        int best = a[0];
        for (int x : a) {
            if (x < best) {
                best = x;
            }
        }
        return best;
    }`,
        String.raw`        int[] temps = {-5, -2, -9, -4};
        System.out.println("Max: " + max(temps));
        System.out.println("Min: " + min(temps));`,
      ),
      output: 'Max: -2\nMin: -9',
    },
    { t: 'h', text: 'Counting with an array: a tally' },
    { t: 'p', text: 'To count how many times each value occurs, make an array with one box per possible value, and add 1 to the right box for each item. A survey asks members to rate the SACCO from 1 to 5. The rating minus 1 is the index of its tally box.' },
    {
      t: 'try',
      code: PA(String.raw`        int[] ratings = {5, 3, 5, 4, 1, 5, 3};
        int[] counts = new int[5];
        for (int r : ratings) {
            counts[r - 1]++;
        }
        System.out.println(Arrays.toString(counts));
        for (int i = 0; i < counts.length; i++) {
            System.out.println((i + 1) + " stars: " + counts[i]);
        }`),
      output: '[1, 0, 2, 1, 3]\n1 stars: 1\n2 stars: 0\n3 stars: 2\n4 stars: 1\n5 stars: 3',
    },
    { t: 'h', text: 'Swapping two boxes' },
    { t: 'p', text: 'Most sorting is built from one small move: **swap** two boxes. You need a spare variable to hold one value while the other moves, exactly as in lesson 3. Here is a swap, and reversing a whole array by swapping the first with the last, the second with the second last, and so on.' },
    {
      t: 'try',
      code: PA(String.raw`        int[] a = {1, 2, 3, 4, 5};
        for (int i = 0; i < a.length / 2; i++) {
            int j = a.length - 1 - i;
            int temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        System.out.println(Arrays.toString(a));`),
      output: '[5, 4, 3, 2, 1]',
    },
    { t: 'h', text: 'Sorting: selection sort' },
    { t: 'p', text: 'Here is a sorting recipe a person could follow with a row of cards. **Find the smallest card in the whole row and swap it into the first place. Then find the smallest in the rest, and swap it into the second place. Carry on until the row is in order.** This is **selection sort**. The part of the array before position `i` is already sorted, and every round makes it one box longer.' },
    {
      t: 'predict',
      code: PA(String.raw`        int[] a = {3, 1, 2};
        int min = 0;
        for (int j = 1; j < a.length; j++) {
            if (a[j] < a[min]) {
                min = j;
            }
        }
        int temp = a[0];
        a[0] = a[min];
        a[min] = temp;
        System.out.println(Arrays.toString(a));`),
      question: 'This is the FIRST round of selection sort. What does it print?',
      options: ['[1, 3, 2]', '[1, 2, 3]', '[3, 1, 2]', '[2, 1, 3]'],
      answer: 0,
      explain: 'The smallest value is 1, at index 1. The round swaps it with the box at index 0, so 3 and 1 change places: [1, 3, 2]. The array is not fully sorted yet: more rounds are needed for the rest.',
    },
    {
      t: 'try',
      code: MA(
        String.raw`    static void selectionSort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) {
                    min = j;
                }
            }
            int temp = a[i];
            a[i] = a[min];
            a[min] = temp;
        }
    }`,
        String.raw`        int[] a = {64, 25, 12, 22, 11};
        selectionSort(a);
        System.out.println(Arrays.toString(a));`,
      ),
      output: '[11, 12, 22, 25, 64]',
    },
    { t: 'tip', text: 'Another famous recipe is **bubble sort**: walk along the row and swap any two neighbours that are in the wrong order, and repeat until a whole walk needs no swaps. Both recipes work, and both are slow for very long lists. Writing them yourself is the best way to understand sorting, but in real programs you use the tested, fast one that Java gives you.' },
    {
      t: 'try',
      code: PA(String.raw`        int[] a = {64, 25, 12, 22, 11};
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));
        String[] names = {"Mary", "Amina", "Joel"};
        Arrays.sort(names);
        System.out.println(Arrays.toString(names));`),
      output: '[11, 12, 22, 25, 64]\n[Amina, Joel, Mary]',
    },
    { t: 'h', text: 'Binary search: halving the problem' },
    { t: 'p', text: 'If the array is **already sorted**, you can search much faster. Look at the middle box. If it is the target, you are done. If the target is bigger, it can only be in the upper half; if smaller, in the lower half. Throw the other half away and repeat. Each step halves the work: a sorted list of a million items needs only about 20 looks.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int binarySearch(int[] a, int target) {
        int low = 0;
        int high = a.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (a[mid] == target) {
                return mid;
            }
            if (a[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }`,
        String.raw`        int[] sorted = {11, 12, 22, 25, 64, 90};
        System.out.println(binarySearch(sorted, 25));
        System.out.println(binarySearch(sorted, 13));`,
      ),
      output: '3\n-1',
    },
    {
      t: 'fill',
      prompt: 'Choose the missing part of the swap so that the program reverses the pair and prints **[3, 2, 1]**.',
      template: PA(String.raw`        int[] a = {1, 2, 3};
        int i = 0;
        int j = 2;
        int temp = a[i];
        a[i] = ___;
        a[j] = temp;
        System.out.println(Arrays.toString(a));`),
      blanks: [{ options: ['a[j]', 'temp', 'a[i]'], answer: 'a[j]' }],
      output: '[3, 2, 1]',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to swap the two values and print them. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        int[] a = {5, 9};`,
        String.raw`        int temp = a[0];`,
        String.raw`        a[0] = a[1];`,
        String.raw`        a[1] = temp;`,
        String.raw`        System.out.println(a[0] + " " + a[1]);`,
        ...TAIL,
      ],
      output: '9 5',
    },
    {
      t: 'bug',
      code: P(String.raw`        int[] a = {3, 1, 2};
        a.sort();
        System.out.println(a[0]);`),
      question: 'The compiler says “cannot find symbol: method sort()”. What is the mistake?',
      options: ['An array has no sort method. Use Arrays.sort(a), with the import', 'sort needs a capital S', 'The array must be created with new', 'The array must be sorted before it is sorted'],
      answer: 0,
      explain: 'Arrays are not objects with their own tools. The helper class `Arrays` (from java.util) has the tools: `Arrays.sort(a)`. Do not forget `import java.util.Arrays;` at the top.',
      fixed: PA(String.raw`        int[] a = {3, 1, 2};
        Arrays.sort(a);
        System.out.println(a[0]);`),
    },
    {
      t: 'quiz',
      question: 'A linear search method returns -1. What does that tell the caller?',
      options: ['The target is not in the array', 'The target is the first element', 'The array is empty of negative numbers', 'The method has a bug'],
      answer: 0,
      explain: 'Real indexes are 0 or more, so -1 is a safe way of saying “not found”.',
    },
    {
      t: 'quiz',
      question: 'Why must an array be sorted before you use binary search?',
      options: ['Throwing half away is only safe if you know which half the target is in', 'Binary search cannot read unsorted numbers', 'Sorted arrays are shorter', 'Java refuses to run it otherwise'],
      answer: 0,
      explain: 'Looking at the middle box tells you which half to keep only if the numbers are in order. In an unsorted array the middle tells you nothing.',
    },
    {
      t: 'quiz',
      question: 'To find the largest value, `best` should start as…',
      options: ['the first element of the array', 'zero', 'the length of the array', '-1'],
      answer: 0,
      explain: 'The first element is always a real candidate. Starting at 0 gives the wrong answer for a list of negative numbers.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: P(String.raw`        int[] a = {3, 1, 2};
        Arrays.sort(a);
        System.out.println(a[0]);`),
          why: 'The import line is missing, so Java cannot find the name `Arrays`. Add `import java.util.Arrays;` as the first line of the file.',
          right: PA(String.raw`        int[] a = {3, 1, 2};
        Arrays.sort(a);
        System.out.println(a[0]);`),
        },
        {
          logic: true,
          wrong: P(String.raw`        int[] a = {5, 9};
        a[0] = a[1];
        a[1] = a[0];
        System.out.println(a[0] + " " + a[1]);`),
          why: 'The first line overwrites a[0] with 9, and the old 5 is gone for ever. Both boxes end up holding 9. Save one value in a spare variable first: `int temp = a[0];`.',
          right: P(String.raw`        int[] a = {5, 9};
        int temp = a[0];
        a[0] = a[1];
        a[1] = temp;
        System.out.println(a[0] + " " + a[1]);`),
        },
        {
          logic: true,
          wrong: M(
            String.raw`    static int indexOf(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) {
                return i;
            } else {
                return -1;
            }
        }
        return -1;
    }`,
            String.raw`        int[] ids = {1042, 1101, 1007};
        System.out.println(indexOf(ids, 1007));`,
          ),
          why: 'The else returns -1 as soon as the **first** box is not the target, so the loop never looks at the others. This prints -1 although 1007 is in the array. “Not found” can only be decided **after** the loop has looked at everything.',
          right: M(
            String.raw`    static int indexOf(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) {
                return i;
            }
        }
        return -1;
    }`,
            String.raw`        int[] ids = {1042, 1101, 1007};
        System.out.println(indexOf(ids, 1007));`,
          ),
        },
        {
          logic: true,
          wrong: P(String.raw`        int[] temps = {-5, -2, -9};
        int best = 0;
        for (int t : temps) {
            if (t > best) {
                best = t;
            }
        }
        System.out.println(best);`),
          why: 'The biggest value is -2, but this prints 0. The “best so far” started at 0, which is bigger than every temperature, so it was never replaced. Start with the first element: `int best = temps[0];`.',
          right: P(String.raw`        int[] temps = {-5, -2, -9};
        int best = temps[0];
        for (int t : temps) {
            if (t > best) {
                best = t;
            }
        }
        System.out.println(best);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'Linear search checks every box and returns the index, or -1 after the loop if it was not found.',
        'Minimum and maximum: start “best so far” with the first element and compare the rest.',
        'A tally array counts: `counts[value]++`. A swap needs a spare variable.',
        'Selection sort repeats “find the smallest of the rest, swap it into place”. In real code use `Arrays.sort(a)`.',
        'Binary search needs a sorted array and halves the search every step.',
      ],
      memory: 'Look at each, keep the best, swap through a spare.',
    },
  ],
  exercises: [
    {
      id: 'j12-search',
      title: 'Find the member',
      prompt: 'The first number is how many member numbers there are, then come the member numbers, and the last number is the one to look for. Print `Found at index 2` or `Not found`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n and the n member numbers, then the target, and search\n', SCAN),
      sampleInput: '4\n1042 1101 1007 1233\n1007',
      usesInput: true,
      tests: [
        { input: '4\n1042 1101 1007 1233\n1007', expected: 'Found at index 2' },
        { input: '4\n1042 1101 1007 1233\n5000', expected: 'Not found' },
        { input: '1\n77\n77', expected: 'Found at index 0', hidden: true },
        { input: '3\n5 5 5\n5', expected: 'Found at index 0', hidden: true },
      ],
      hints: [
        'Store the n numbers in an array, then read the target after the loop.',
        'Use `int found = -1;` and a loop that sets `found = i` and stops (`break`) when `ids[i] == target`.',
        'After the loop: `if (found >= 0) { System.out.println("Found at index " + found); } else { System.out.println("Not found"); }`',
      ],
    },
    {
      id: 'j12-min-max',
      title: 'Lowest and highest',
      prompt: 'Read n and then n whole numbers (they may be negative). Print the smallest and the largest:\n\n`Min: -9`\n`Max: -2`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read n numbers into an array, then find the minimum and the maximum\n', SCAN),
      sampleInput: '4\n-5 -2 -9 -4',
      usesInput: true,
      tests: [
        { input: '4\n-5 -2 -9 -4', expected: 'Min: -9\nMax: -2' },
        { input: '3\n10 20 30', expected: 'Min: 10\nMax: 30' },
        { input: '1\n8', expected: 'Min: 8\nMax: 8', hidden: true },
      ],
      hints: [
        'Keep two variables, `min` and `max`, and start both with the first number of the array.',
        'Then go through the rest: if a number is smaller than `min`, store it; if it is bigger than `max`, store it.',
        'Do not start with 0: that breaks for lists of only negative or only positive numbers.',
      ],
    },
    {
      id: 'j12-sort',
      title: 'Put them in order',
      prompt: 'Read n and then n whole numbers. Print them **sorted from the smallest to the largest**, on one line, separated by spaces: `11 12 22 25 64`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the numbers, sort them, then print them\n', SCAN),
      sampleInput: '5\n64 25 12 22 11',
      usesInput: true,
      tests: [
        { input: '5\n64 25 12 22 11', expected: '11 12 22 25 64' },
        { input: '3\n3 2 1', expected: '1 2 3' },
        { input: '4\n5 5 1 5', expected: '1 5 5 5', hidden: true },
        { input: '1\n9', expected: '9', hidden: true },
      ],
      hints: [
        'Fill an array, then sort it. You may write selection sort yourself, or use `Arrays.sort(a)` from `java.util.Arrays` (do not forget the import).',
        'For `Arrays.sort`, the first two lines of the file are `import java.util.Scanner;` and `import java.util.Arrays;`',
        'Print with a loop: `System.out.print(a[i] + " ");` and end with `System.out.println();`',
      ],
    },
    {
      id: 'j12-top3',
      title: 'The top three savers',
      prompt: 'Read n (at least 3) and then n savings. Print the three **largest**, from the biggest to the smallest: `Top 3: 500 400 300`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the savings, sort them, then print the last three from the end\n', SCAN),
      sampleInput: '5\n100 500 300 200 400',
      usesInput: true,
      tests: [
        { input: '5\n100 500 300 200 400', expected: 'Top 3: 500 400 300' },
        { input: '3\n1 2 3', expected: 'Top 3: 3 2 1' },
        { input: '6\n9 9 8 7 7 1', expected: 'Top 3: 9 9 8', hidden: true },
      ],
      hints: [
        'Sort the array in ascending order. The biggest values are then at the end.',
        'The last box is `a[n - 1]`, the one before is `a[n - 2]`, and then `a[n - 3]`.',
        '`System.out.println("Top 3: " + a[n - 1] + " " + a[n - 2] + " " + a[n - 3]);`',
      ],
    },
    {
      id: 'j12-bands',
      title: 'Marks in bands',
      prompt: 'Read n and then n marks (0 to 100). Count how many marks fall in each band and print the five lines below. A is 80 to 100, B is 70 to 79, C is 60 to 69, D is 50 to 59 and F is below 50.\n\n`A: 2`\n`B: 1`\n`C: 1`\n`D: 1`\n`F: 1`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Use an array of 5 counters, one for each band\n', SCAN),
      sampleInput: '6\n85 72 65 90 40 55',
      usesInput: true,
      tests: [
        { input: '6\n85 72 65 90 40 55', expected: 'A: 2\nB: 1\nC: 1\nD: 1\nF: 1' },
        { input: '3\n100 80 79', expected: 'A: 2\nB: 1\nC: 0\nD: 0\nF: 0' },
        { input: '2\n0 49', expected: 'A: 0\nB: 0\nC: 0\nD: 0\nF: 2', hidden: true },
        { input: '4\n50 59 60 69', expected: 'A: 0\nB: 0\nC: 2\nD: 2\nF: 0', hidden: true },
      ],
      hints: [
        'Make `int[] counts = new int[5];` where box 0 counts A, box 1 counts B, and so on.',
        'For every mark, decide its band with an else-if chain, and add 1 to the right box, for example `counts[0]++;`',
        'Print the five lines with a `String[] letters = {"A", "B", "C", "D", "F"};` and a loop: `System.out.println(letters[i] + ": " + counts[i]);`',
      ],
    },
  ],
};
