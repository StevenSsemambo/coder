// Java, Level 2, lesson 10: Recursion.
import { progM, imp } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const M = (methods, body) => progM(methods, body);
const MS = (methods, body) => progM(methods, body, SCAN);

export const recursionLesson = {
  id: 'j-recursion',
  level: LEVEL,
  minutes: 32,
  title: 'Recursion: a method that calls itself',
  summary: 'Base case and recursive case, the call stack, factorial, Fibonacci, and what a missing base case looks like',
  blocks: [
    {
      t: 'story',
      title: 'How many people are in front of me?',
      text: 'Amina arrives at the SACCO window and the queue is long. She cannot see the front, so she taps the woman ahead of her: “How many people are in front of you?” That woman does not know either, so she taps the person ahead of her and asks **the very same question**. And so on, all the way to the first person in the queue, who says: “Nobody. Zero.”\n\nNow the answers travel back down the line: “zero”, then “one”, then “two”… Each person adds one to the answer she got and passes it back. When it reaches Amina, she knows her place. Nobody needed a clever plan. Everybody used **the same rule** on a **smaller** queue, and the first person knew the answer without asking. That is recursion.',
    },
    { t: 'h', text: 'What recursion is' },
    { t: 'p', text: 'A **recursive** method is a method that **calls itself** to solve a smaller version of the same problem. Every recursive method needs two parts:' },
    {
      t: 'list',
      items: [
        '**The base case**: the simplest version of the problem, which the method answers directly, without calling itself. (The first person in the queue.)',
        '**The recursive case**: the method calls itself with a **smaller** problem, and uses that answer to build its own. (Everybody else.)',
      ],
    },
    { t: 'p', text: 'Here is the simplest example: counting down. The base case is 0, where it says Go!. Otherwise it prints the number and counts down from one less.' },
    {
      t: 'try',
      code: M(
        String.raw`    static void countdown(int n) {
        if (n == 0) {
            System.out.println("Go!");
            return;
        }
        System.out.println(n);
        countdown(n - 1);
    }`,
        String.raw`        countdown(3);`,
      ),
      output: '3\n2\n1\nGo!',
    },
    { t: 'h', text: 'Factorial: an answer built on the way back' },
    { t: 'p', text: 'The **factorial** of a number n, written n!, is n × (n − 1) × … × 1. So 5! is 5 × 4 × 3 × 2 × 1 = 120. Notice that 5! = 5 × 4!. A factorial is a number times a **smaller factorial**, and 1! is simply 1. That is a base case and a recursive case.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }`,
        String.raw`        System.out.println(factorial(5));
        System.out.println(factorial(1));`,
      ),
      output: '120\n1',
    },
    { t: 'h', text: 'What the computer does: the call stack' },
    { t: 'p', text: 'Each call to a method gets its own copy of the parameters and variables. The computer keeps the unfinished calls **piled up, like plates**: a new call goes on top, and only when the top call finishes is it removed, and the call below continues. This pile is called the **call stack**. The next program prints a line when each call starts and when it finishes, so you can watch the pile grow and shrink.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int factorial(int n) {
        System.out.println("start factorial(" + n + ")");
        if (n <= 1) {
            return 1;
        }
        int result = n * factorial(n - 1);
        System.out.println("factorial(" + n + ") returns " + result);
        return result;
    }`,
        String.raw`        factorial(3);`,
      ),
      output: 'start factorial(3)\nstart factorial(2)\nstart factorial(1)\nfactorial(2) returns 2\nfactorial(3) returns 6',
    },
    { t: 'analogy', text: 'The plates are the unfinished questions in the queue. factorial(3) cannot finish until factorial(2) answers, and factorial(2) cannot finish until factorial(1) answers. The first plate to be **removed** is the top one, factorial(1), and then the answers flow back down the pile: 2, then 6.' },
    {
      t: 'predict',
      code: M(
        String.raw`    static void show(int n) {
        if (n == 0) {
            return;
        }
        show(n - 1);
        System.out.print(n + " ");
    }`,
        String.raw`        show(3);
        System.out.println();`,
      ),
      question: 'What does this program print? Notice that the print comes AFTER the recursive call.',
      options: ['1 2 3', '3 2 1', '3 2 1 0', '0 1 2 3'],
      answer: 0,
      explain: 'show(3) first calls show(2), which first calls show(1), which first calls show(0) and that returns at once. Only then does show(1) print 1, then show(2) prints 2, then show(3) prints 3. The work after the call happens on the way back, so the order is reversed compared with countdown.',
    },
    { t: 'h', text: 'Fibonacci: two recursive calls' },
    { t: 'p', text: 'In the Fibonacci sequence every number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13… Two base cases (fib(0) is 0 and fib(1) is 1) and a recursive case with **two** calls.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }`,
        String.raw`        for (int i = 0; i < 10; i++) {
            System.out.print(fib(i) + " ");
        }
        System.out.println();`,
      ),
      output: '0 1 1 2 3 5 8 13 21 34',
    },
    { t: 'tip', text: 'This version of Fibonacci repeats the same work many times (fib(5) calls fib(3) twice, and so on), so it becomes very slow for numbers above about 40. Programmers fix this with a loop or by remembering earlier answers. We come back to speed later in this course.' },
    { t: 'h', text: 'Loop or recursion?' },
    { t: 'p', text: 'Anything you can do with recursion, you can do with a loop, and a loop is usually simpler and faster for plain counting. Recursion is at its best when a problem **contains smaller copies of itself**: a folder that contains folders, a family tree, a maze, or splitting a list in halves. You will meet these later in the course, and recursion will make them far shorter to write.' },
    { t: 'h', text: 'When the base case is missing' },
    { t: 'p', text: 'Without a base case, or with a base case that is never reached, a method calls itself forever. Each call piles another plate on the stack until the computer has no room left. Java stops the program with a **StackOverflowError**. In this app you will see the report and the program stops. (On a laptop, Java lets a program catch this error, but we treat it as a bug to fix, not to hide.)' },
    {
      t: 'fill',
      prompt: 'Choose the comparison for the base case so that `factorial(5)` prints **120**.',
      template: M(
        String.raw`    static int factorial(int n) {
        if (n ___ 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }`,
        String.raw`        System.out.println(factorial(5));`,
      ),
      blanks: [{ options: ['<=', '>', '>='], answer: '<=' }],
      output: '120',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to define `factorial` and print `factorial(5)`. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'public class Main {',
        '    static int factorial(int n) {',
        '        if (n <= 1) {',
        '            return 1;',
        '        }',
        '        return n * factorial(n - 1);',
        '    }',
        '    public static void main(String[] args) {',
        '        System.out.println(factorial(5));',
        '    }',
        '}',
      ],
      output: '120',
    },
    {
      t: 'bug',
      code: M(
        String.raw`    static int sumTo(int n) {
        if (n == 0) {
            return 0;
        }
        sumTo(n - 1) + n;
    }`,
        String.raw`        System.out.println(sumTo(4));`,
      ),
      question: 'The compiler complains about the line `sumTo(n - 1) + n;`. What is the mistake?',
      options: ['The value of the sum is calculated but never returned. It needs return in front', 'sumTo cannot call itself', 'The base case should be n == 1', 'main must be the first method'],
      answer: 0,
      explain: 'A calculation on its own line is not a statement: Java has no use for a value that is thrown away. The method must hand its answer back with `return sumTo(n - 1) + n;`.',
      fixed: M(
        String.raw`    static int sumTo(int n) {
        if (n == 0) {
            return 0;
        }
        return sumTo(n - 1) + n;
    }`,
        String.raw`        System.out.println(sumTo(4));`,
      ),
    },
    {
      t: 'quiz',
      question: 'What is the base case of a recursive method?',
      options: ['The simple case that it answers directly, without calling itself', 'The line where it calls itself', 'The first line of main', 'The case that causes an error'],
      answer: 0,
      explain: 'The base case is where the recursion stops. Every chain of calls must reach a base case, otherwise it never ends.',
    },
    {
      t: 'quiz',
      question: 'With the method from this lesson, what is `factorial(4)`?',
      options: ['24', '10', '16', '4'],
      answer: 0,
      explain: '4! = 4 × 3 × 2 × 1 = 24. The method computes 4 × factorial(3), which is 4 × 6.',
    },
    {
      t: 'quiz',
      question: 'What happens when a recursive method has no base case?',
      options: ['It keeps calling itself until the call stack is full, and the program stops with a StackOverflowError', 'It returns 0', 'It runs once and stops quietly', 'Java adds a base case for you'],
      answer: 0,
      explain: 'Every call waits on the stack for the next one. With no base case the stack grows until there is no room, and Java stops the program.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: M(
            String.raw`    static int factorial(int n) {
        return n * factorial(n - 1);
    }`,
            String.raw`        System.out.println(factorial(5));`,
          ),
          why: 'There is no base case, so factorial calls itself again and again, with 5, 4, 3, 2, 1, 0, -1 … and never stops. The call stack fills up and Java reports a StackOverflowError. Add `if (n <= 1) { return 1; }` first.',
          right: M(
            String.raw`    static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }`,
            String.raw`        System.out.println(factorial(5));`,
          ),
        },
        {
          wrong: M(
            String.raw`    static void countdown(int n) {
        if (n == 0) {
            System.out.println("Go!");
            return;
        }
        System.out.println(n);
        countdown(n + 1);
    }`,
            String.raw`        countdown(3);`,
          ),
          why: 'The call uses `n + 1`, so the number grows away from the base case 0 and never reaches it. Each recursive call must move **closer** to the base case: use `n - 1`.',
          right: M(
            String.raw`    static void countdown(int n) {
        if (n == 0) {
            System.out.println("Go!");
            return;
        }
        System.out.println(n);
        countdown(n - 1);
    }`,
            String.raw`        countdown(3);`,
          ),
        },
        {
          wrong: M(
            String.raw`    static int factorial(int n) {
        if (n == 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }`,
            String.raw`        System.out.println(factorial(0));`,
          ),
          why: 'The base case only catches n == 1. Starting from 0 the calls go 0, -1, -2 … and skip it for ever. Use `n <= 1` so that every small value is covered. Always ask: which inputs can reach the method, and does every one of them reach a base case?',
          right: M(
            String.raw`    static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }`,
            String.raw`        System.out.println(factorial(0));`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A recursive method calls itself to solve a smaller version of the same problem.',
        'It needs a **base case** (answered directly) and a **recursive case** that moves closer to it.',
        'The call stack piles unfinished calls like plates. Work placed after the call happens on the way back.',
        'No base case, or one that is never reached, ends in a StackOverflowError.',
        'Use a loop for simple counting. Use recursion when a problem contains smaller copies of itself.',
      ],
      memory: 'Know when to stop, and always take a smaller step.',
    },
  ],
  exercises: [
    {
      id: 'j10-sum-rec',
      title: 'Sum with recursion',
      prompt: 'Complete the recursive method `sumTo` that returns 1 + 2 + … + n. `main` reads n and prints `Sum: 10` (for 4). The sum of nothing (n = 0) is 0.',
      starter: MS(
        String.raw`    static int sumTo(int n) {
        // Base case, then the recursive case
        return -1;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println("Sum: " + sumTo(n));`,
      ),
      sampleInput: '4',
      usesInput: true,
      tests: [
        { input: '4', expected: 'Sum: 10' },
        { input: '100', expected: 'Sum: 5050' },
        { input: '1', expected: 'Sum: 1', hidden: true },
        { input: '0', expected: 'Sum: 0', hidden: true },
      ],
      hints: [
        'The base case: the sum of nothing (n is 0) is 0.',
        'The recursive case: the sum up to n is n plus the sum up to n - 1.',
        '`if (n == 0) { return 0; } return n + sumTo(n - 1);`',
      ],
    },
    {
      id: 'j10-power',
      title: 'Power by recursion',
      prompt: 'Complete the recursive method `power` that returns `base` multiplied by itself `exp` times. `main` reads the base and the exponent and prints, for `2 10`: `2^10 = 1024`. Anything to the power 0 is 1.',
      starter: MS(
        String.raw`    static int power(int base, int exp) {
        // Base case: exp is 0. Recursive case: one multiplication less
        return -1;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int base = in.nextInt();
        int exp = in.nextInt();
        System.out.println(base + "^" + exp + " = " + power(base, exp));`,
      ),
      sampleInput: '2 10',
      usesInput: true,
      tests: [
        { input: '2 10', expected: '2^10 = 1024' },
        { input: '5 0', expected: '5^0 = 1' },
        { input: '3 4', expected: '3^4 = 81' },
        { input: '7 1', expected: '7^1 = 7', hidden: true },
      ],
      hints: [
        'The base case is `exp == 0`, where the answer is 1.',
        'Otherwise base^exp is base multiplied by base^(exp - 1).',
        '`if (exp == 0) { return 1; } return base * power(base, exp - 1);`',
      ],
    },
    {
      id: 'j10-digits',
      title: 'Count the digits',
      prompt: 'Complete the recursive method `countDigits` that returns how many digits a positive whole number has. `main` prints `Digits: 5` for 12345. Hint: dividing by 10 removes the last digit.',
      starter: MS(
        String.raw`    static int countDigits(int n) {
        // A number below 10 has one digit. Otherwise it has one more than n / 10
        return 0;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println("Digits: " + countDigits(n));`,
      ),
      sampleInput: '12345',
      usesInput: true,
      tests: [
        { input: '12345', expected: 'Digits: 5' },
        { input: '7', expected: 'Digits: 1' },
        { input: '100', expected: 'Digits: 3', hidden: true },
        { input: '999999', expected: 'Digits: 6', hidden: true },
      ],
      hints: [
        'Base case: a number smaller than 10 has exactly one digit.',
        'Recursive case: n has one digit more than n / 10 (integer division throws the last digit away).',
        '`if (n < 10) { return 1; } return 1 + countDigits(n / 10);`',
      ],
    },
    {
      id: 'j10-fib',
      title: 'Fibonacci',
      prompt: 'Complete the recursive method `fib`. `fib(0)` is 0, `fib(1)` is 1, and every later value is the sum of the two before it. `main` prints `Fib: 13` for 7.',
      starter: MS(
        String.raw`    static int fib(int n) {
        // Two base cases are in one: n is 0 or 1. Then two recursive calls
        return -1;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println("Fib: " + fib(n));`,
      ),
      sampleInput: '7',
      usesInput: true,
      tests: [
        { input: '7', expected: 'Fib: 13' },
        { input: '0', expected: 'Fib: 0' },
        { input: '1', expected: 'Fib: 1', hidden: true },
        { input: '10', expected: 'Fib: 55', hidden: true },
        { input: '15', expected: 'Fib: 610', hidden: true },
      ],
      hints: [
        'When n is 0 or 1 the answer is n itself. That covers both base cases.',
        'Otherwise add the two previous values: `fib(n - 1)` and `fib(n - 2)`.',
        '`if (n <= 1) { return n; } return fib(n - 1) + fib(n - 2);`',
      ],
    },
    {
      id: 'j10-gcd',
      title: 'Greatest common divisor',
      prompt: 'Euclid’s method finds the greatest common divisor (the biggest number that divides both) with a neat recursion: the gcd of `a` and `b` is the gcd of `b` and `a % b`, and when `b` is 0 the answer is `a`. Complete `gcd`. `main` prints `GCD: 6` for `48 18`.',
      starter: MS(
        String.raw`    static int gcd(int a, int b) {
        // Base case: b is 0. Recursive case: gcd(b, a % b)
        return 0;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        System.out.println("GCD: " + gcd(a, b));`,
      ),
      sampleInput: '48 18',
      usesInput: true,
      tests: [
        { input: '48 18', expected: 'GCD: 6' },
        { input: '17 5', expected: 'GCD: 1' },
        { input: '100 75', expected: 'GCD: 25' },
        { input: '7 0', expected: 'GCD: 7', hidden: true },
        { input: '1071 462', expected: 'GCD: 21', hidden: true },
      ],
      hints: [
        'When `b` is 0, nothing is left to divide, and the answer is `a`.',
        'Otherwise the problem shrinks: ask for the gcd of `b` and `a % b`.',
        '`if (b == 0) { return a; } return gcd(b, a % b);`',
      ],
    },
  ],
};
