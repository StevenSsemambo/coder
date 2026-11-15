// Java, Level 1, lesson 2: Your first program.
// In prose, \\n is how a backslash-n is shown to the learner. In Java code (String.raw) \n stays as typed.
import { prog, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 1: Getting started';

export const firstLesson = {
  id: 'j-first',
  level: LEVEL,
  minutes: 20,
  title: 'Your first program',
  summary: 'class, main, print and println, special characters, comments, and how to read an error',
  blocks: [
    {
      t: 'story',
      title: 'The signboard at the SACCO gate',
      text: 'The Village SACCO has a plank over its door. A signwriter painted “Karibu” on it once, and now everyone who walks past can read it. The words are on the plank because somebody put them there.\n\nYour first Java program does the same job: it puts words on the screen. Every Java programmer in the world started with a program like this one, so you are in good company.',
    },
    { t: 'p', text: 'Here is the smallest useful Java program. Read it once, then press **Run**.' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println("Hello, world!");`),
      output: 'Hello, world!',
    },
    { t: 'h', text: 'Every line explained' },
    {
      t: 'list',
      items: [
        '`public class Main {` Every Java program lives inside a **class**. Think of it as the box that holds your program. `Main` is the name we chose, and the curly bracket `{` opens the box.',
        '`public static void main(String[] args) {` The **front door**. The JVM always starts running your program at `main`. For now, copy this line exactly. Lessons 9 and 16 explain every word in it.',
        '`System.out.println("Hello, world!");` The line that does the work. It **prints** the text inside the quotes and then moves to a new line.',
        '`}` and `}` Each closing curly bracket closes the box that was opened above it: first `main`, then the class.',
      ],
    },
    { t: 'analogy', text: 'Think of the Village SACCO building. The class is the whole building. `main` is the front door. Everything the JVM does starts when it walks in through the front door, and then it follows the instructions inside, from top to bottom.' },
    { t: 'tip', text: 'Curly brackets always come in pairs. When you type `{`, type the matching `}` straight away, and put your statements in between. Missing brackets are one of the most common beginner errors.' },
    { t: 'h', text: 'print and println' },
    { t: 'p', text: '`println` prints the text and then moves to a new line (the `ln` means “line”). `print` prints the text and stays on the same line, so the next thing continues right after it. Run this and look at where the lines break.' },
    {
      t: 'try',
      code: prog(String.raw`        System.out.print("Village ");
        System.out.print("SACCO");
        System.out.println(" members");
        System.out.println("Karibu");`),
      output: 'Village SACCO members\nKaribu',
    },
    {
      t: 'predict',
      code: prog(String.raw`        System.out.print("A");
        System.out.println("B");
        System.out.print("C");
        System.out.println("D");`),
      question: 'What does this program print?',
      options: ['AB\nCD', 'A\nB\nC\nD', 'ABCD', 'AB\nC\nD'],
      answer: 0,
      explain: 'print stays on the line, so A is followed by B on the same line. println then ends the line. The same happens with C and D, so the output is AB on the first line and CD on the second.',
    },
    {
      t: 'fill',
      prompt: 'Complete the program so that it prints **Karibu,Amina** on ONE line.',
      template: prog(String.raw`        System.out.___("Karibu,");
        System.out.println("Amina");`),
      blanks: [{ options: ['print', 'println', 'Print'], answer: 'print' }],
      output: 'Karibu,Amina',
    },
    { t: 'h', text: 'Special characters' },
    { t: 'p', text: 'Some characters cannot be typed directly inside text. Java uses a backslash `\\` followed by a letter to write them. These are called **escape sequences**.' },
    {
      t: 'list',
      items: [
        '`\\n` starts a new line.',
        '`\\t` is a tab, a wide gap.',
        '`\\"` prints a double quote. Without the backslash, the quote would end the text.',
        '`\\\\` prints one backslash (the first one tells Java the second is just a backslash).',
      ],
    },
    {
      t: 'try',
      code: prog(String.raw`        System.out.println("Name:\tAmina");
        System.out.println("She said \"Karibu\"");
        System.out.println("Folder: C:\\SACCO\\members");
        System.out.println("Line one\nLine two");`),
      output: 'Name:\tAmina\nShe said "Karibu"\nFolder: C:\\SACCO\\members\nLine one\nLine two',
    },
    {
      t: 'fill',
      prompt: 'Complete the escape so that the program prints a **tab** between the words.',
      template: prog(String.raw`        System.out.println("Name:___Amina");`),
      blanks: [{ options: ['\\t', '\\n', '\\q'], answer: '\\t' }],
      output: 'Name:\tAmina',
    },
    { t: 'h', text: 'Comments: notes for people' },
    { t: 'p', text: 'A **comment** is a note for the human reader. The computer ignores it completely. Use `//` for a note that runs to the end of the line, and `/* ... */` for a note that covers several lines. Good programmers write comments to explain **why**, not to repeat what the code already says.' },
    {
      t: 'try',
      code: prog(String.raw`        // This line is ignored by the computer
        System.out.println("Visible");   // a comment can follow code
        /* A comment can also
           cover many lines */
        System.out.println("Also visible");`),
      output: 'Visible\nAlso visible',
    },
    { t: 'h', text: 'Reading an error message' },
    { t: 'p', text: 'You will make mistakes, every programmer does, all day long. The skill is to **read the message**. A compiler error looks like this:' },
    { t: 'code', text: 'Main.java:3: error: cannot find symbol' },
    { t: 'p', text: 'It tells you three things: the file (`Main.java`), the **line number** (`3`), and what is wrong. SayMaCoder also shows it as a plain-language card with a likely cause and a fix. Look at the line it points to, and also at the line just above it: a missing `;` or bracket is often reported on the line after the real mistake.' },
    {
      t: 'bug',
      code: prog(String.raw`        System.out.printn("Hello");`),
      question: 'The compiler says “cannot find symbol” for this program. What is the cause?',
      options: ['printn is a spelling mistake. The method is println', 'The text needs single quotes', 'The class has the wrong name', 'There is a semicolon too many'],
      answer: 0,
      explain: 'Java does not know a method called printn, so it cannot find the symbol. The method you want is println, with an l. Spelling matters, and so do capital letters.',
      fixed: prog(String.raw`        System.out.println("Hello");`),
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order so the program prints the agenda of a SACCO meeting from 1 to 4. The first line (the class and `main`) and the last two (the closing brackets) are in the right place for you to find.',
      lines: [
        HEAD,
        String.raw`        System.out.println("1. Call the meeting to order");`,
        String.raw`        System.out.println("2. Read the last minutes");`,
        String.raw`        System.out.println("3. Collect the deposits");`,
        String.raw`        System.out.println("4. Close with a prayer");`,
        ...TAIL,
      ],
      output: '1. Call the meeting to order\n2. Read the last minutes\n3. Collect the deposits\n4. Close with a prayer',
    },
    {
      t: 'quiz',
      question: 'Which statement prints the text and then moves to a new line?',
      options: ['System.out.println("Hi");', 'System.out.print("Hi");', 'System.out.Println("Hi");', 'System.print("Hi");'],
      answer: 0,
      explain: 'println (small p, then ln for “line”) prints and ends the line. print stays on the same line. Println with a capital P does not exist, and System.print does not exist either.',
    },
    {
      t: 'quiz',
      question: 'What does `\\n` do inside the text of a println?',
      options: ['Starts a new line', 'Prints the letter n', 'Prints a tab', 'Ends the program'],
      answer: 0,
      explain: 'The backslash tells Java the next letter is special. \\n means “new line”, \\t means “tab”. So "A\\nB" prints A and B on two lines.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: prog(String.raw`        System.out.println("Karibu);`),
          why: 'The text is missing its closing double quote, so Java reads on and on looking for the end of it. The compiler reports an unclosed string literal. Every opening quote needs a closing quote.',
          right: prog(String.raw`        System.out.println("Karibu");`),
        },
        {
          wrong: prog(String.raw`        System.out.println('Karibu');`),
          why: 'Text in Java goes in **double** quotes. Single quotes are for exactly one character, so Java complains about an unclosed character literal.',
          right: prog(String.raw`        System.out.println("Karibu");`),
        },
        {
          logic: true,
          wrong: prog(String.raw`        System.out.print("Name: Amina");
        System.out.print("Age: 34");`),
          why: 'This program is valid but the output is NameAge glued together: `Name: AminaAge: 34`. When each piece belongs on its own line, use println, or add \\n.',
          right: prog(String.raw`        System.out.println("Name: Amina");
        System.out.println("Age: 34");`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A Java program lives in a class. Your program starts at `public static void main(String[] args)`.',
        '`println` prints and moves to a new line. `print` stays on the same line.',
        'Special characters use a backslash: `\\n` new line, `\\t` tab, `\\"` a quote, `\\\\` a backslash.',
        '`//` and `/* */` are comments. The computer ignores them.',
        'Read the compiler message: the line number and the words tell you where and what.',
      ],
      memory: 'Class is the building, main is the door, println does the talking.',
    },
  ],
  exercises: [
    {
      id: 'j2-notice',
      title: 'The notice board',
      prompt: 'Print this notice on three lines:\n\n`NOTICE`\n`Meeting on Saturday at 10am`\n`Bring your passbook`',
      starter: prog('        // Print the three lines of the notice\n'),
      tests: [{ expected: 'NOTICE\nMeeting on Saturday at 10am\nBring your passbook' }],
      hints: [
        'Use one `System.out.println(...)` for each line. They run from top to bottom.',
        'Copy each line exactly, including capital letters and the digits: `System.out.println("NOTICE");`',
        'A similar example: `System.out.println("Day one");` then `System.out.println("Day two");` prints two lines. Write three statements for the notice.',
      ],
    },
    {
      id: 'j2-quotes',
      title: 'Quotes and a folder path',
      prompt: 'Print these two lines exactly:\n\n`The treasurer said "Karibu" to everyone.`\n`Path: C:\\SACCO\\members`',
      starter: prog('        // Use \\" for a quote and \\\\ for a backslash\n'),
      tests: [{ expected: 'The treasurer said "Karibu" to everyone.\nPath: C:\\SACCO\\members' }],
      hints: [
        'A double quote inside text needs a backslash in front of it: `\\"`. A backslash itself is written as two: `\\\\`.',
        'The first line is `System.out.println("The treasurer said \\"Karibu\\" to everyone.");`',
        'For the second line, write each backslash twice inside the text: `System.out.println("Path: C:\\\\SACCO\\\\members");` Java turns each pair into one backslash when it prints.',
      ],
    },
    {
      id: 'j2-oneline',
      title: 'Everything on one line',
      prompt: 'This program prints the words on three separate lines. **Change it** so it prints everything on **one line**, exactly: `Village SACCO`',
      starter: prog(String.raw`        System.out.println("Village");
        System.out.println(" ");
        System.out.println("SACCO");`),
      tests: [{ expected: 'Village SACCO' }],
      hints: [
        '`println` always moves to a new line after printing. Which method stays on the same line?',
        'Change `println` to `print` on the lines that should not end the line.',
        'A similar example: `System.out.print("Good");` followed by `System.out.print("bye");` prints Goodbye on one line. You may keep the last one as `println`.',
      ],
    },
  ],
};
