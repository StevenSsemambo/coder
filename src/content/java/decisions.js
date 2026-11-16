// Java, Level 1, lesson 6: Decisions.
import { prog, imp, HEAD_SCAN, TAIL } from './shared.js';

const LEVEL = 'Level 1: Getting started';
const SCAN = imp('java.util.Scanner');
const S = (body) => prog(body, SCAN);

export const decisionsLesson = {
  id: 'j-decisions',
  level: LEVEL,
  minutes: 30,
  title: 'Making decisions',
  summary: 'if, else, else if, comparisons, && || !, comparing Strings, switch, and the ? : shortcut',
  blocks: [
    {
      t: 'story',
      title: 'Who can borrow?',
      text: 'The Village SACCO has rules for loans. “A member may borrow if she has saved at least 100,000 shillings **and** has been a member for at least 6 months.” When Amina asks for a loan, Mama Rose checks the rules, one question at a time, and then says yes or no.\n\nUntil now your programs did every step, every time. Real programs must **choose**: do this if something is true, do that if it is not. This is called **selection**, and it is the second of the three building blocks of every program.',
    },
    { t: 'h', text: 'if: do something only when a question is true' },
    { t: 'p', text: 'An `if` statement asks a yes-or-no question in brackets. If the answer is yes (`true`), the statements inside the curly brackets run. If the answer is no (`false`), they are skipped. Press **Run** with 65, then change the input to 40.' },
    {
      t: 'try',
      stdin: '65',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 50) {
            System.out.println("Pass");
        }
        System.out.println("Done");`),
      output: 'Pass\nDone',
    },
    { t: 'h', text: 'Comparison operators' },
    {
      t: 'list',
      items: [
        '`==` equal to. **Two** equals signs: it asks a question. A single `=` stores a value.',
        '`!=` not equal to.',
        '`<` less than, `>` greater than, `<=` less than or equal, `>=` greater than or equal.',
      ],
    },
    { t: 'p', text: 'A comparison gives a `boolean` answer: `true` or `false`. You can even print it.' },
    {
      t: 'try',
      code: prog(String.raw`        int savings = 80000;
        System.out.println(savings >= 100000);
        System.out.println(savings != 0);
        System.out.println(savings == 80000);
        System.out.println(!(savings > 5));`),
      output: 'false\ntrue\ntrue\nfalse',
    },
    { t: 'h', text: 'if and else: two paths' },
    { t: 'p', text: 'Add `else` for the other path, the one that runs when the question is false. Exactly **one** of the two paths always runs.' },
    {
      t: 'try',
      stdin: '45',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 50) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }`),
      output: 'Fail',
    },
    { t: 'h', text: 'else if: many paths' },
    { t: 'p', text: 'When there are more than two outcomes, chain the questions with `else if`. Java asks them **from the top, one by one, and takes the first path whose answer is true**. The rest are skipped. So the order of the questions matters.' },
    {
      t: 'try',
      stdin: '72',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 80) {
            System.out.println("Grade: A");
        } else if (marks >= 70) {
            System.out.println("Grade: B");
        } else if (marks >= 60) {
            System.out.println("Grade: C");
        } else if (marks >= 50) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }`),
      output: 'Grade: B',
    },
    { t: 'analogy', text: 'Think of a security guard at the SACCO gate checking a list from the top: “Staff? Go left. Member? Go right. Visitor? Sit down.” The moment one answer is yes, he sends you there and stops checking. A person who is both staff and a member still goes left, because the staff question came first.' },
    {
      t: 'predict',
      stdin: '59',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 80) {
            System.out.println("A");
        } else if (marks >= 60) {
            System.out.println("C");
        } else if (marks >= 50) {
            System.out.println("D");
        } else {
            System.out.println("F");
        }`),
      question: 'The input is 59. What does the program print?',
      options: ['D', 'C', 'F', 'A'],
      answer: 0,
      explain: '59 is not at least 80, and not at least 60. The third question (at least 50) is the first one that is true, so D is printed and the else is skipped.',
    },
    { t: 'h', text: 'Combining questions: && || !' },
    {
      t: 'list',
      items: [
        '`&&` means **and**: true only if **both** sides are true.',
        '`||` means **or**: true if **at least one** side is true.',
        '`!` means **not**: turns true into false and false into true.',
      ],
    },
    { t: 'p', text: 'Here is Mama Rose’s loan rule written in Java. The input is the savings and then the months of membership. Try `150000 8`, then `150000 3`, then `50000 12`.' },
    {
      t: 'try',
      stdin: '150000 8',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int savings = in.nextInt();
        int months = in.nextInt();
        if (savings >= 100000 && months >= 6) {
            System.out.println("Eligible");
        } else {
            System.out.println("Not eligible");
        }`),
      output: 'Eligible',
    },
    { t: 'h', text: 'Comparing text: use equals, not ==' },
    { t: 'p', text: 'For numbers, `==` works. For **text** it does not do what you expect. Between two Strings, `==` asks “are these the very same object in memory?”, not “do they have the same letters?”. A word typed by the user is always a new object. To compare the **letters**, use `.equals(...)`. To ignore capital letters, use `.equalsIgnoreCase(...)`.' },
    {
      t: 'predict',
      stdin: 'yes',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        String answer = in.next();
        if (answer == "yes") {
            System.out.println("same");
        } else {
            System.out.println("different");
        }
        System.out.println(answer.equals("yes"));`),
      question: 'The user types yes. What does the program print?',
      options: ['different\ntrue', 'same\ntrue', 'same\nfalse', 'different\nfalse'],
      answer: 0,
      explain: '== compares whether the two Strings are the same object. The word typed by the user is a new object, so the answer is false and “different” is printed. .equals compares the letters, and they match, so it prints true. Always use .equals for text.',
    },
    {
      t: 'try',
      stdin: 'Yes',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        String answer = in.next();
        if (answer.equalsIgnoreCase("yes")) {
            System.out.println("Approved");
        } else {
            System.out.println("Declined");
        }`),
      output: 'Approved',
    },
    { t: 'h', text: 'switch: choosing from a list of values' },
    { t: 'p', text: 'When you compare **one** value against many fixed choices, `switch` is tidier than a long `else if` chain. The arrow form `->` is short and safe: it runs only the matching line. A `default` handles everything else. Several values can share a line, separated by commas.' },
    {
      t: 'try',
      stdin: 'M',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        String code = in.next();
        switch (code) {
            case "S" -> System.out.println("Savings account");
            case "L", "M" -> System.out.println("Loan account");
            default -> System.out.println("Unknown account");
        }`),
      output: 'Loan account',
    },
    { t: 'p', text: 'A switch can also **produce a value**. This is called a switch expression, and it is a neat way to turn a number into a name.' },
    {
      t: 'try',
      stdin: '2',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int day = in.nextInt();
        String name = switch (day) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            default -> "Invalid day";
        };
        System.out.println(name);`),
      output: 'Tuesday',
    },
    { t: 'tip', text: 'Older Java code uses the classic form `case 1:` with a `break;` at the end of each case. If you forget a `break`, Java keeps running into the next case. You will see this style in old programs, so you should recognise it, but write the arrow form in your own code.' },
    { t: 'h', text: 'A one-line choice: the ? : operator' },
    { t: 'p', text: 'When a decision just picks between two **values**, the conditional operator is a short way to write it: `condition ? valueIfTrue : valueIfFalse`.' },
    {
      t: 'try',
      stdin: '-5',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int balance = in.nextInt();
        String status = (balance >= 0) ? "OK" : "Overdrawn";
        System.out.println(status);`),
      output: 'Overdrawn',
    },
    { t: 'tip', text: 'Always use curly brackets `{ }` after `if` and `else`, even for one statement. Without them, only the **first** statement belongs to the `if`, and adding a second line later is a classic source of bugs.' },
    {
      t: 'fill',
      stdin: '50',
      prompt: 'Choose the comparison so that a mark of **exactly 50 passes**. With the input 50, the program should print **Pass**.',
      template: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks ___ 50) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }`),
      blanks: [{ options: ['>=', '=>', '='], answer: '>=' }],
      output: 'Pass',
    },
    {
      t: 'fill',
      stdin: '150000 3',
      prompt: 'Choose the operator so that the member needs **both** conditions. With 150000 saved and only 3 months, the program should print **Not eligible**.',
      template: S(String.raw`        Scanner in = new Scanner(System.in);
        int savings = in.nextInt();
        int months = in.nextInt();
        if (savings >= 100000 ___ months >= 6) {
            System.out.println("Eligible");
        } else {
            System.out.println("Not eligible");
        }`),
      blanks: [{ options: ['&&', '||', '!'], answer: '&&' }],
      output: 'Not eligible',
    },
    {
      t: 'reorder',
      stdin: '40',
      prompt: 'Put the lines in the right order to make a pass-or-fail program. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD_SCAN,
        String.raw`        Scanner in = new Scanner(System.in);`,
        String.raw`        int marks = in.nextInt();`,
        String.raw`        if (marks >= 50) {`,
        String.raw`            System.out.println("Pass");`,
        String.raw`        } else {`,
        String.raw`            System.out.println("Fail");`,
        String.raw`        }`,
        ...TAIL,
      ],
      output: 'Fail',
    },
    {
      t: 'bug',
      stdin: '50',
      code: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks = 50) {
            System.out.println("Exactly 50");
        }`),
      question: 'The compiler says “incompatible types: int cannot be converted to boolean”. What is the mistake?',
      options: ['A single = stores a value. The question needs ==', 'The if needs a semicolon', 'marks should be a String', 'println cannot be inside an if'],
      answer: 0,
      explain: 'A single = is an assignment: it stores 50 in marks. An if needs a true or false question, and a number is not one. Two equals signs, ==, ask the question “is it equal to?”.',
      fixed: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks == 50) {
            System.out.println("Exactly 50");
        }`),
    },
    {
      t: 'quiz',
      question: 'What is the value of `5 > 3 && 2 > 4`?',
      options: ['false', 'true', '5', 'It is an error'],
      answer: 0,
      explain: '&& needs both sides to be true. 5 > 3 is true, but 2 > 4 is false, so the whole thing is false.',
    },
    {
      t: 'quiz',
      question: 'The user types a word. How do you check that it holds the letters yes, ignoring capital letters?',
      options: ['answer.equalsIgnoreCase("yes")', 'answer == "yes"', 'answer = "yes"', 'answer.yes()'],
      answer: 0,
      explain: 'For text, use .equals or .equalsIgnoreCase. == compares objects, not letters, and a single = stores a value instead of asking a question.',
    },
    {
      t: 'quiz',
      question: 'In an else if chain, the marks are 85 and the first two conditions are `marks >= 50` then `marks >= 80`. Which branch runs?',
      options: ['The first one (>= 50), because it is true first', 'The second one (>= 80), because it fits better', 'Both branches run', 'Neither runs'],
      answer: 0,
      explain: 'Java takes the first true question and skips the rest. 85 is at least 50, so the first branch runs, and the more precise question is never reached. Put the narrowest condition first.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks = 50) {
            System.out.println("Exactly 50");
        }`),
          why: 'A single `=` stores a value, and an `if` needs a true-or-false question. Use `==` to compare.',
          stdin: '50',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks == 50) {
            System.out.println("Exactly 50");
        }`),
        },
        {
          logic: true,
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 50) {
            System.out.println("D");
        } else if (marks >= 80) {
            System.out.println("A");
        }`),
          why: 'This prints D for a mark of 85. The question `marks >= 50` is true first, so the branch for 80 is never reached. Always put the narrowest, highest condition first.',
          stdin: '85',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 80) {
            System.out.println("A");
        } else if (marks >= 50) {
            System.out.println("D");
        }`),
        },
        {
          logic: true,
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 50); {
            System.out.println("Pass");
        }`),
          why: 'The semicolon after the brackets ends the if. The block in curly brackets is no longer part of it, so it runs for everybody. With 40 marks this prints Pass. Never put a `;` right after an `if (...)`.',
          stdin: '40',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 50) {
            System.out.println("Pass");
        }`),
        },
        {
          logic: true,
          wrong: S(String.raw`        Scanner in = new Scanner(System.in);
        String word = in.next();
        if (word == "yes") {
            System.out.println("Approved");
        } else {
            System.out.println("Declined");
        }`),
          why: 'The user typed yes, but this prints Declined. `==` asks whether the two Strings are the same object, and they are not. Use `word.equals("yes")` to compare the letters.',
          stdin: 'yes',
          right: S(String.raw`        Scanner in = new Scanner(System.in);
        String word = in.next();
        if (word.equals("yes")) {
            System.out.println("Approved");
        } else {
            System.out.println("Declined");
        }`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        '`if (question) { ... } else if (question) { ... } else { ... }`: Java takes the **first** true path and skips the rest.',
        'Comparisons: `==  !=  <  >  <=  >=`. A single `=` stores a value. `&&` is and, `||` is or, `!` is not.',
        'Compare text with `.equals(...)` or `.equalsIgnoreCase(...)`, never with `==`.',
        '`switch` with arrows picks from a list of values. `? :` picks between two values in one line.',
        'Always use curly brackets, and never put a `;` straight after `if (...)`.',
      ],
      memory: 'Ask from the top, take the first yes, and equals for words.',
    },
  ],
  exercises: [
    {
      id: 'j6-passfail',
      title: 'Pass or fail',
      prompt: 'Read a mark. Print `Pass` if it is 50 or more, otherwise print `Fail`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the mark, then decide\n', SCAN),
      sampleInput: '65',
      usesInput: true,
      tests: [
        { input: '65', expected: 'Pass' },
        { input: '49', expected: 'Fail' },
        { input: '50', expected: 'Pass', hidden: true },
        { input: '0', expected: 'Fail', hidden: true },
      ],
      hints: [
        'Read the mark as an int. The question to ask is whether it is at least 50.',
        '`if (marks >= 50) { ... } else { ... }`. Put the Pass line in the first block and the Fail line in the second.',
        'A mark of exactly 50 must pass, so use `>=` and not `>`.',
      ],
    },
    {
      id: 'j6-grade',
      title: 'The grade',
      prompt: 'Read a mark and print its grade like this: `Grade: B`.\n\n80 or more is A, 70 or more is B, 60 or more is C, 50 or more is D, and anything lower is F.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the mark, then print the grade with else if\n', SCAN),
      sampleInput: '72',
      usesInput: true,
      tests: [
        { input: '85', expected: 'Grade: A' },
        { input: '72', expected: 'Grade: B' },
        { input: '60', expected: 'Grade: C' },
        { input: '55', expected: 'Grade: D' },
        { input: '49', expected: 'Grade: F' },
        { input: '80', expected: 'Grade: A', hidden: true },
        { input: '70', expected: 'Grade: B', hidden: true },
        { input: '50', expected: 'Grade: D', hidden: true },
      ],
      hints: [
        'Use an `else if` chain. Java takes the first true question, so start with the highest mark.',
        'Ask `marks >= 80` first, then `marks >= 70`, then `>= 60`, then `>= 50`, and finish with a plain `else` for F.',
        'Each branch prints one line, for example `System.out.println("Grade: A");`',
      ],
    },
    {
      id: 'j6-loan',
      title: 'Loan decision',
      prompt: 'The input is the member’s savings and then her months of membership. A loan is approved only if she has saved **at least 100000** AND has been a member for **at least 6 months**. Print `Loan approved` or `Loan refused`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read savings and months, then decide with &&\n', SCAN),
      sampleInput: '150000 8',
      usesInput: true,
      tests: [
        { input: '150000 8', expected: 'Loan approved' },
        { input: '150000 3', expected: 'Loan refused' },
        { input: '50000 12', expected: 'Loan refused' },
        { input: '100000 6', expected: 'Loan approved', hidden: true },
        { input: '99999 6', expected: 'Loan refused', hidden: true },
        { input: '100000 5', expected: 'Loan refused', hidden: true },
      ],
      hints: [
        'Read two ints: first the savings, then the months. Both conditions must be true together.',
        'Join the two questions with `&&`: `savings >= 100000 && months >= 6`',
        'The exact values 100000 and 6 are allowed, so use `>=` for both.',
      ],
    },
    {
      id: 'j6-day',
      title: 'Meeting day',
      prompt: 'The SACCO meets on Saturdays. Read a day number from 1 to 7 (1 is Monday, 7 is Sunday). Print the day name: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday` or `Sunday`. For any other number print `Invalid day`. Use a `switch`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the day number, then use switch\n', SCAN),
      sampleInput: '6',
      usesInput: true,
      tests: [
        { input: '1', expected: 'Monday' },
        { input: '6', expected: 'Saturday' },
        { input: '9', expected: 'Invalid day' },
        { input: '3', expected: 'Wednesday', hidden: true },
        { input: '7', expected: 'Sunday', hidden: true },
        { input: '0', expected: 'Invalid day', hidden: true },
      ],
      hints: [
        'A `switch` on the day number, with one `case` for each number from 1 to 7 and a `default` for everything else.',
        'The arrow form: `case 1 -> System.out.println("Monday");` and `default -> System.out.println("Invalid day");`',
        'Write seven cases (2 is Tuesday, 3 Wednesday, 4 Thursday, 5 Friday, 6 Saturday, 7 Sunday) and then the default.',
      ],
    },
  ],
};
