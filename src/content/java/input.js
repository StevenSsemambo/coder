// Java, Level 1, lesson 5: Reading input with Scanner (and printing neatly with printf).
import { prog, imp, HEAD_SCAN, TAIL } from './shared.js';

const LEVEL = 'Level 1: Getting started';
const SCAN = imp('java.util.Scanner');
const S = (body) => prog(body, SCAN);

export const inputLesson = {
  id: 'j-input',
  level: LEVEL,
  minutes: 25,
  title: 'Reading input with Scanner',
  summary: 'Scanner, nextInt, nextDouble, next and nextLine, the nextLine trap, and neat output with printf',
  blocks: [
    {
      t: 'story',
      title: 'The window at the SACCO office',
      text: 'On deposit day a queue forms at the small window. Mama Rose does not know in advance who will come or how much they will bring. So she asks each person: “Your name? How much today?” She listens to the answer, writes it down, and prints a receipt.\n\nUp to now your programs knew everything in advance, because every value was typed into the code. A real program must **ask** and **listen**. In Java, the tool for listening is called a `Scanner`.',
    },
    { t: 'h', text: 'Where do I type the answers?' },
    { t: 'p', text: 'On a laptop, the user types in a black console window. In SayMaCoder, the **Input** box under the editor plays that role. Type the values there before you press **Run**: one per line, or separated by spaces. Your program reads them one after the other, in order. (The app does not echo what you typed into the output, so the output shows only what your program prints.)' },
    { t: 'h', text: 'Three steps to read input' },
    {
      t: 'list',
      items: [
        '**1. Import the tool.** The first line of the file is `import java.util.Scanner;`. Scanner lives in a part of Java called `java.util`, and you must borrow it before use.',
        '**2. Create a Scanner** that listens to the keyboard: `Scanner in = new Scanner(System.in);`. `in` is just a variable name; you can choose another.',
        '**3. Read values** with its methods, one per value.',
      ],
    },
    {
      t: 'list',
      items: [
        '`in.nextInt()` reads a whole number (`int`).',
        '`in.nextDouble()` reads a number with a decimal point (`double`).',
        '`in.next()` reads **one word** (up to the next space or new line) as a `String`.',
        '`in.nextLine()` reads **a whole line**, spaces included, as a `String`.',
      ],
    },
    { t: 'p', text: 'The Input box already contains `Amina 150000`. Press **Run**, then change the name and the amount and run again.' },
    {
      t: 'try',
      stdin: 'Amina 150000',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        System.out.println("Enter name and deposit:");
        String name = in.next();
        int deposit = in.nextInt();
        System.out.println("Received " + deposit + " from " + name);`),
      output: 'Enter name and deposit:\nReceived 150000 from Amina',
    },
    { t: 'analogy', text: 'Think of the input as a queue of words and numbers waiting at the window. Each `next...` call serves the next person in the queue. If the queue is empty, or the next person is not what you asked for (you asked for a number and a name arrived), Java stops with an error.' },
    {
      t: 'try',
      stdin: '2.5 4',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        double rate = in.nextDouble();
        int years = in.nextInt();
        System.out.println(rate * years);`),
      output: '10.0',
    },
    { t: 'h', text: 'A whole line with spaces: nextLine' },
    { t: 'p', text: '`next()` stops at the first space, so it reads only “Amina”. To read a full name such as “Amina Nakato”, use `nextLine()`.' },
    {
      t: 'try',
      stdin: 'Amina Nakato',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        String full = in.nextLine();
        System.out.println("Hello, " + full + "!");`),
      output: 'Hello, Amina Nakato!',
    },
    { t: 'h', text: 'The nextLine trap' },
    { t: 'p', text: 'This surprises almost every beginner. When you type `3` and press Enter, the input holds **3 and an end-of-line mark**. `nextInt()` takes the 3 but **leaves the end-of-line mark behind**. The next `nextLine()` finds that mark straight away and returns an **empty line**. Predict what happens.' },
    {
      t: 'predict',
      stdin: '3\nAmina Nakato',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int count = in.nextInt();
        String line = in.nextLine();
        System.out.println("[" + line + "]");`),
      question: 'The input is the number 3 on the first line and Amina Nakato on the second line. What does the program print?',
      options: ['[]', '[Amina Nakato]', '[3]', 'It stops with an error'],
      answer: 0,
      explain: 'nextInt() read the 3 and stopped just before the end of the first line. nextLine() then read the rest of that first line, which is nothing, so line is empty. The name is still waiting. The cure is one extra nextLine() to throw away the leftover.',
    },
    {
      t: 'try',
      stdin: '3\nAmina Nakato',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int count = in.nextInt();
        in.nextLine();
        String line = in.nextLine();
        System.out.println("[" + line + "]");`),
      output: '[Amina Nakato]',
    },
    { t: 'tip', text: 'The rule: **after `nextInt()`, `nextDouble()` or `next()`, add one extra `in.nextLine();` before you read a whole line.** If you read the whole line first, as in the earlier example, there is no trap.' },
    { t: 'h', text: 'Neat output with printf' },
    { t: 'p', text: '`System.out.printf` prints a **pattern** with holes, and then fills the holes with your values in order. This gives you control over decimals and widths, which `println` and `+` do not.' },
    {
      t: 'list',
      items: [
        '`%d` a whole number. `%,d` adds thousands commas (in English style).',
        '`%.2f` a decimal number with exactly 2 digits after the point.',
        '`%s` text. `%-8s` pads the text on the right to a width of 8.',
        '`%n` a new line, and `%%` a real percent sign.',
      ],
    },
    {
      t: 'try',
      code: prog(String.raw`        String name = "Amina";
        int deposit = 1250000;
        double rate = 2.5;
        System.out.printf("Member: %s%n", name);
        System.out.printf("Deposit: UGX %,d%n", deposit);
        System.out.printf("Rate: %.2f%%%n", rate);
        System.out.printf("%-8s|%8.2f|%n", "Rice", 3500.5);`),
      output: 'Member: Amina\nDeposit: UGX 1,250,000\nRate: 2.50%\nRice    | 3500.50|',
    },
    {
      t: 'predict',
      code: prog(String.raw`        System.out.printf("%.2f%n", 3.14159);`),
      question: 'What does this program print?',
      options: ['3.14', '3.1', '3.14159', '3.15'],
      answer: 0,
      explain: '%.2f means “a decimal number with exactly 2 digits after the point”. 3.14159 is cut to two digits: 3.14.',
    },
    { t: 'tip', text: 'The thousands comma in `%,d` follows the language settings of the computer that runs the program. On most phones and laptops set to English it is a comma, but some countries use a dot or a space. SayMaCoder always uses the English style.' },
    {
      t: 'project',
      title: 'Village SACCO, step 1: the deposit slip',
      text: 'Our running project begins. The program asks for a member’s name, member number and deposit, and prints a slip. We will keep growing this program through the course.',
      stdin: 'Amina 1042 150000',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        String name = in.next();
        int number = in.nextInt();
        int amount = in.nextInt();
        System.out.println("=== Village SACCO ===");
        System.out.printf("Member: %s (No. %d)%n", name, number);
        System.out.printf("Deposit: UGX %,d%n", amount);
        System.out.println("Thank you!");`),
      output: '=== Village SACCO ===\nMember: Amina (No. 1042)\nDeposit: UGX 150,000\nThank you!',
    },
    {
      t: 'fill',
      stdin: '20 30',
      prompt: 'Choose the right Scanner method to read each whole number. With the input `20 30`, the program should print **50**.',
      template: S(String.raw`        Scanner in = new Scanner(System.in);
        int a = in.___();
        int b = in.___();
        System.out.println(a + b);`),
      blanks: [
        { options: ['nextInt', 'next', 'nextDouble'], answer: 'nextInt' },
        { options: ['nextInt', 'next', 'nextDouble'], answer: 'nextInt' },
      ],
      output: '50',
    },
    {
      t: 'reorder',
      stdin: '3500 5000',
      prompt: 'The input is the price (3500) and then the money paid (5000). Put the lines in the right order so the program prints the change. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD_SCAN,
        String.raw`        Scanner in = new Scanner(System.in);`,
        String.raw`        int price = in.nextInt();`,
        String.raw`        int paid = in.nextInt();`,
        String.raw`        int change = paid - price;`,
        String.raw`        System.out.println("Change: " + change);`,
        ...TAIL,
      ],
      output: 'Change: 1500',
    },
    {
      t: 'bug',
      stdin: '5',
      code: prog(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n * 2);`),
      question: 'The compiler says “cannot find symbol: class Scanner”. What is missing?',
      options: ['The line import java.util.Scanner; at the top of the file', 'A semicolon after main', 'The word public before Scanner', 'A second Scanner'],
      answer: 0,
      explain: 'Scanner is not part of the tiny set of words Java knows automatically. You must borrow it with an import line at the top, before the class.',
      fixed: S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n * 2);`),
    },
    {
      t: 'quiz',
      question: 'Which method reads a whole line of text, including the spaces?',
      options: ['nextLine()', 'next()', 'nextInt()', 'nextDouble()'],
      answer: 0,
      explain: 'next() stops at the first space, so it reads one word. nextLine() reads to the end of the line, spaces included.',
    },
    {
      t: 'quiz',
      question: 'You read a number with `nextInt()` and then you want to read a whole line. What do you add in between?',
      options: ['An extra in.nextLine(); to throw away the leftover end of line', 'Nothing. It always works', 'A second nextInt()', 'The word final'],
      answer: 0,
      explain: 'nextInt() leaves the end-of-line mark in the input. One extra nextLine() eats it, so that the next nextLine() reads the real line.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: prog(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n);`),
          why: 'The import line is missing, so the compiler cannot find `Scanner`. Add `import java.util.Scanner;` as the very first line.',
          stdin: '5',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n);`),
        },
        {
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n);`),
          why: 'The program asks for a whole number, but the input holds the word abc. Java stops with an InputMismatchException. Type a number in the Input box, or read the word with `next()` and check it before you use it.',
          stdin: 'abc',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        String word = in.next();
        System.out.println(word);`),
        },
        {
          logic: true,
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        int count = in.nextInt();
        String name = in.nextLine();
        System.out.println("Name: " + name);`),
          why: 'This runs, but it prints `Name: ` with nothing after it. The nextLine() grabbed the empty end of the first line. Add an extra `in.nextLine();` after reading the number.',
          stdin: '3\nAmina Nakato',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        int count = in.nextInt();
        in.nextLine();
        String name = in.nextLine();
        System.out.println("Name: " + name);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'Start the file with `import java.util.Scanner;` and create `Scanner in = new Scanner(System.in);`.',
        '`nextInt()` reads a whole number, `nextDouble()` a decimal, `next()` one word, `nextLine()` a whole line.',
        'After `nextInt()`, `nextDouble()` or `next()`, add one extra `in.nextLine();` before reading a whole line.',
        '`printf` fills a pattern: `%d` whole number, `%.2f` two decimals, `%s` text, `%n` new line.',
        'In SayMaCoder the Input box is the keyboard. Type your values there before pressing Run.',
      ],
      memory: 'Import it, create it, serve the queue one at a time.',
    },
  ],
  exercises: [
    {
      id: 'j5-deposit',
      title: 'Receive a deposit',
      prompt: 'Read a member’s name (one word) and a deposit (a whole number). Print: `Received 150000 from Amina` (using the values that were typed).',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the name and the deposit, then print the sentence\n', SCAN),
      sampleInput: 'Amina 150000',
      usesInput: true,
      tests: [
        { input: 'Amina 150000', expected: 'Received 150000 from Amina' },
        { input: 'Joel 5000', expected: 'Received 5000 from Joel' },
        { input: 'Mary 25000', expected: 'Received 25000 from Mary', hidden: true },
      ],
      hints: [
        'The name comes first and is one word: use `next()`. The deposit is a whole number: use `nextInt()`. Read them in the order they are typed.',
        '`String name = in.next();` then `int deposit = in.nextInt();`',
        'Print with `System.out.println("Received " + deposit + " from " + name);`',
      ],
    },
    {
      id: 'j5-change',
      title: 'Give the change',
      prompt: 'Read the price and then the money paid (both whole numbers). Print the change like this: `Change: 1500`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read price and paid, then print the change\n', SCAN),
      sampleInput: '3500 5000',
      usesInput: true,
      tests: [
        { input: '3500 5000', expected: 'Change: 1500' },
        { input: '12000 20000', expected: 'Change: 8000' },
        { input: '750 750', expected: 'Change: 0', hidden: true },
      ],
      hints: [
        'Read two ints. The first one typed is the price, the second is the money paid.',
        '`int price = in.nextInt();` and `int paid = in.nextInt();`. The change is `paid - price`.',
        'Print with `System.out.println("Change: " + (paid - price));`. The brackets are needed, otherwise the numbers are joined as text.',
      ],
    },
    {
      id: 'j5-average',
      title: 'Average of three marks',
      prompt: 'Read three whole-number marks and print their average with **exactly two decimals**, like this: `Average: 82.33`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read three marks, then print the average with two decimals\n', SCAN),
      sampleInput: '70 85 92',
      usesInput: true,
      tests: [
        { input: '70 85 92', expected: 'Average: 82.33' },
        { input: '60 60 60', expected: 'Average: 60.00' },
        { input: '50 75 100', expected: 'Average: 75.00', hidden: true },
      ],
      hints: [
        'Add the three marks and divide by 3.0 so that the division is a proper decimal division, not integer division.',
        '`double average = (a + b + c) / 3.0;` after reading the three ints.',
        'For two decimals use printf: `System.out.printf("Average: %.2f%n", average);`',
      ],
    },
    {
      id: 'j5-fullname',
      title: 'Name and age',
      prompt: 'The first input line is a **full name with a space** and the second line is the age. Print: `Amina Nakato is 34 years old.`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the full name (a whole line), then the age\n', SCAN),
      sampleInput: 'Amina Nakato\n34',
      usesInput: true,
      tests: [
        { input: 'Amina Nakato\n34', expected: 'Amina Nakato is 34 years old.' },
        { input: 'Joel Okello\n21', expected: 'Joel Okello is 21 years old.' },
        { input: 'Mary Atim\n45', expected: 'Mary Atim is 45 years old.', hidden: true },
      ],
      hints: [
        'The name has a space inside, so `next()` would read only the first word. Which method reads a whole line?',
        'Read the name first with `in.nextLine()`, and then the age with `in.nextInt()`. Because the line is read first, there is no trap.',
        '`String name = in.nextLine();` then `int age = in.nextInt();` then `System.out.println(name + " is " + age + " years old.");`',
      ],
    },
  ],
};
