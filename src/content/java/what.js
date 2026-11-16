// Java, Level 1, lesson 1: What Java is.
// Prose uses single-quoted strings. Java code uses String.raw so that \n stays a backslash-n.
import { prog } from './shared.js';

const LEVEL = 'Level 1: Getting started';

export const whatLesson = {
  id: 'j-what',
  level: LEVEL,
  minutes: 15,
  title: 'What Java is',
  summary: 'Source code, the compiler, bytecode and the JVM, and what you will build',
  blocks: [
    {
      t: 'story',
      title: 'Mama Rose’s notebook',
      text: 'Every month, Mama Rose, the treasurer of the Village SACCO, sits with a thick notebook. A hundred and twenty members, a deposit from each, a loan repayment from some. Adding it all up takes her two nights, and one wrong digit means starting again.\n\nHer nephew Joel studies computing. “Aunty,” he says, “a program could do this in one second.” A **program** is a list of instructions that a computer follows exactly, in order, without getting tired. Java is one of the languages we use to write such lists. By the end of this course you will have built Mama Rose’s system yourself.',
    },
    { t: 'p', text: 'Java first appeared in 1995 and is still one of the most used languages in the world. It runs behind Android apps, banking and payment systems, large company websites, and games such as Minecraft (Java Edition). People pick it for one big reason: a Java program written once can run on very different computers.' },
    { t: 'h', text: 'From your words to a running program' },
    { t: 'p', text: 'A computer cannot read what you type. It only understands numbers. So Java does the translation in **two steps**, and knowing them will save you hours of confusion later.' },
    {
      t: 'list',
      items: [
        '**1. You write source code.** Plain text, kept in a file that ends in `.java`. Humans can read it.',
        '**2. The compiler (`javac`) checks it and translates it into bytecode.** If you made a spelling or grammar mistake, the compiler stops here and tells you the line. Nothing runs yet.',
        '**3. The Java Virtual Machine (the JVM) runs the bytecode.** The JVM is a small program installed on the computer. It reads the bytecode and carries out the instructions.',
      ],
    },
    { t: 'analogy', text: 'Think of a letter written in Luganda for a friend in Mombasa. A translator turns it into Swahili (that is the compiler making bytecode). The friend reads the Swahili (that is the JVM running it). The same Swahili letter can be read by anybody in town who knows Swahili, whatever phone they own. Bytecode is the “Swahili”: it is the same everywhere, and every computer with a JVM can read it.' },
    { t: 'p', text: 'Here is a real Java program. Do not worry about what each word means yet; lesson 2 explains every line. Press **Run**. The first time, the app takes a few seconds because it really does compile your program, exactly as a laptop would. Later runs are fast.' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println("Karibu to the Village SACCO!");`),
      output: 'Karibu to the Village SACCO!',
    },
    { t: 'p', text: 'Two things happened behind that button. The compiler checked your program and made bytecode, then the JVM ran it. If you want to see the compiler at work, delete the `;` at the end of the `System.out.println` line and press **Run** again. The compiler refuses and tells you the line number. That is a **compile-time error**, and it is a friend: it catches mistakes before your program can do any harm.' },
    {
      t: 'quiz',
      question: 'Which tool turns your Java source code into bytecode?',
      options: ['The compiler, javac', 'The JVM', 'The keyboard', 'The input box'],
      answer: 0,
      explain: 'javac is the Java compiler. It reads your .java file, checks it, and writes bytecode. The JVM comes after: it runs the bytecode.',
    },
    {
      t: 'quiz',
      question: 'Joel writes a Java program on his laptop. His cousin has a different kind of computer with a JVM installed. What does the cousin need to run the program?',
      options: ['The bytecode. Any computer with a JVM can run it', 'Joel’s exact laptop', 'A new program written from scratch', 'The same make of keyboard'],
      answer: 0,
      explain: 'This is the big idea of Java. Bytecode is the same everywhere, and the JVM on each computer knows how to run it. Programmers say “write once, run anywhere”.',
    },
    { t: 'h', text: 'What you will do in this course' },
    {
      t: 'list',
      items: [
        'Write programs that **read** what the user types and **print** answers. This is how real Java works behind the scenes of apps and websites.',
        'Learn Java in six steps: first steps, loops and arrays, objects, collections, safe and tested code, and finally a complete system.',
        'Build the **Village SACCO** step by step: members, savings, loans, reports.',
      ],
    },
    { t: 'tip', text: 'In this app your programs print text. Windows, buttons and pictures (Swing and JavaFX) cannot run inside the app, so we only read about them at the end of the course. The part you learn here, the language itself, is exactly the same.' },
    {
      t: 'predict',
      code: prog(String.raw`        System.out.println("Deposit received");
        System.out.println("Thank you");`),
      question: 'What does this program print?',
      options: ['Deposit received\nThank you', 'Thank you\nDeposit received', 'Deposit receivedThank you', 'Nothing. It has an error'],
      answer: 0,
      explain: 'The JVM runs the lines from top to bottom, and each println prints its text and then moves to a new line. So Deposit received comes first, then Thank you on the next line.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: prog(String.raw`        System.out.println("Karibu")`),
          why: 'The compiler stops at the end of the line: `\';\' expected`. Every statement in Java ends with a semicolon. It is like the full stop of a sentence.',
          right: prog(String.raw`        System.out.println("Karibu");`),
        },
        {
          wrong: prog(String.raw`        system.out.println("Karibu");`),
          why: 'Java cares about capital letters. The tool is called `System` with a capital S. With a small s, Java looks for something called “system” and cannot find it.',
          right: prog(String.raw`        System.out.println("Karibu");`),
        },
        {
          wrong: prog(String.raw`        System.out.Println("Karibu");`),
          why: 'The printing method is `println` with a small p. `Println` is a different, unknown name, so the compiler says it cannot find the symbol.',
          right: prog(String.raw`        System.out.println("Karibu");`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A program is a list of instructions a computer follows exactly, in order.',
        'You write source code in a `.java` file. The compiler `javac` checks it and turns it into bytecode.',
        'The JVM runs the bytecode. Any computer with a JVM can run it, which is why Java runs almost everywhere.',
        'Capital letters matter, and a statement ends with `;`.',
      ],
      memory: 'Write it, compile it, run it on the JVM.',
    },
  ],
  exercises: [
    {
      id: 'j1-hello',
      title: 'Say hello',
      prompt: 'Print exactly this line: `Hello, Uganda!`',
      starter: prog('        // Write your println here\n'),
      tests: [{ expected: 'Hello, Uganda!' }],
      hints: [
        'The instruction that prints a line is `System.out.println(...)`. Put the text you want inside the brackets, in double quotes.',
        'Write it inside the curly brackets of `main`: `System.out.println("Hello, Uganda!");` and do not forget the `;` at the end.',
        'A similar example: `System.out.println("Good morning");` prints Good morning. Copy the exact capital letters, comma and exclamation mark of the sentence you were given.',
      ],
    },
    {
      id: 'j1-sacco',
      title: 'The SACCO signboard',
      prompt: 'Print the signboard of the Village SACCO on three lines:\n\n`Village SACCO`\n`Save together, grow together`\n`Karibu!`',
      starter: prog('        // Print the three lines of the signboard\n'),
      tests: [{ expected: 'Village SACCO\nSave together, grow together\nKaribu!' }],
      hints: [
        'Each line needs its own `System.out.println(...)`. The program runs them from top to bottom.',
        'Write three statements, one for each line of the signboard, each ending with `;`.',
        'A similar example for two lines: `System.out.println("Line one");` then `System.out.println("Line two");`. Copy your three lines exactly, including the comma and the exclamation mark.',
      ],
    },
  ],
};
