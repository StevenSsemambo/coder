// Java, Level 1, lesson 3: Variables and types.
import { prog, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 1: Getting started';

export const variablesLesson = {
  id: 'j-variables',
  level: LEVEL,
  minutes: 22,
  title: 'Variables and types',
  summary: 'int, double, boolean, char, long and String, naming, changing values, and constants',
  blocks: [
    {
      t: 'story',
      title: 'The passbook envelopes',
      text: 'In the Village SACCO office there is a shelf of small envelopes, one for each member. Each envelope has a label on the front: **Amina Nakato**. Inside is her money. When Amina saves 25,000 shillings, Mama Rose opens that envelope and adds the money. The label stays the same, and the amount inside changes.\n\nA **variable** is exactly that: an envelope in the computer’s memory with a **name** on the front and a **value** inside. The value can change while the program runs. The name stays.',
    },
    { t: 'p', text: 'Java is strict about one thing: every envelope can hold **only one kind of thing**. An envelope made for whole numbers cannot hold a name. The kind of thing is called the **type**, and you choose it when you create the variable.' },
    { t: 'h', text: 'The six types you will use most' },
    {
      t: 'list',
      items: [
        '`int` : whole numbers such as 120 or -5. Up to about 2 billion. `int members = 120;`',
        '`long` : very large whole numbers. Write an `L` at the end of the number. `long total = 5000000000L;`',
        '`double` : numbers with a decimal point. `double rate = 0.15;`',
        '`boolean` : exactly two values, `true` or `false`. `boolean paid = true;`',
        '`char` : exactly one character, in **single** quotes. `char grade = \'A\';`',
        '`String` : text, in **double** quotes. Note the capital S. `String name = "Amina";`',
      ],
    },
    { t: 'analogy', text: 'Think of different containers in the market. A jerrycan holds liquid, an egg tray holds eggs, a sack holds maize. You cannot pour maize into an egg tray. In the same way an `int` envelope accepts whole numbers only, and the compiler will refuse anything else.' },
    { t: 'h', text: 'Creating a variable' },
    { t: 'p', text: 'Creating a variable has two parts: **declare** it (say its type and name) and **assign** it (put a value in with a single `=`). You can do both in one line. The `=` here does not mean “equals” as in mathematics. It means “**store the value on the right into the variable on the left**”.' },
    {
      t: 'try',
      code: prog(String.raw`        String name = "Amina Nakato";
        int age = 34;
        double savings = 150000.5;
        boolean active = true;
        char grade = 'A';
        System.out.println(name);
        System.out.println(age);
        System.out.println(savings);
        System.out.println(active);
        System.out.println(grade);`),
      output: 'Amina Nakato\n34\n150000.5\ntrue\nA',
    },
    { t: 'h', text: 'Joining text and values with +' },
    { t: 'p', text: 'Inside `println`, the `+` sign **joins** text and values into one longer piece of text. This is how you build a sentence from variables.' },
    {
      t: 'try',
      code: prog(String.raw`        String name = "Amina Nakato";
        int age = 34;
        System.out.println(name + " is " + age + " years old.");`),
      output: 'Amina Nakato is 34 years old.',
    },
    { t: 'h', text: 'Changing a value' },
    { t: 'p', text: 'To change a variable, assign again. You do **not** write the type the second time, because the envelope already exists. The right side is worked out first, and then it is stored. So `savings = savings + 25000;` means “take what is in savings, add 25000, and store the answer back in savings”.' },
    {
      t: 'try',
      code: prog(String.raw`        int savings = 100000;
        System.out.println("Before: " + savings);
        savings = savings + 25000;
        System.out.println("After: " + savings);`),
      output: 'Before: 100000\nAfter: 125000',
    },
    {
      t: 'predict',
      code: prog(String.raw`        int a = 10;
        int b = a;
        a = 20;
        System.out.println(a + " " + b);`),
      question: 'What does this program print?',
      options: ['20 10', '20 20', '10 10', '10 20'],
      answer: 0,
      explain: '`int b = a;` copies the value 10 into b. After that, b has its own 10. When `a = 20;` runs, only a changes. So a is 20 and b is still 10.',
    },
    { t: 'h', text: 'Choosing good names' },
    {
      t: 'list',
      items: [
        'A name uses letters, digits and the underscore `_`, and **cannot start with a digit**. No spaces.',
        'Java is **case sensitive**: `savings`, `Savings` and `SAVINGS` are three different variables.',
        'You cannot use Java’s own words, such as `int`, `class`, `public` or `true`.',
        'By convention, names start with a small letter and join words with capitals: `memberName`, `totalSavings`. This style is called **camelCase**.',
        'Pick names that say what is inside: `loanBalance` is far better than `x`. Your future self will thank you.',
      ],
    },
    { t: 'h', text: 'Constants with final' },
    { t: 'p', text: 'Some values must never change while the program runs, such as the price of one share in the SACCO. Put the word `final` before the type and Java will refuse any later change. By convention constants are written in CAPITAL LETTERS.' },
    {
      t: 'try',
      code: prog(String.raw`        final int SHARE_PRICE = 20000;
        long groupFund = 5000000000L;
        System.out.println("One share costs " + SHARE_PRICE);
        System.out.println("Group fund: " + groupFund);`),
      output: 'One share costs 20000\nGroup fund: 5000000000',
    },
    { t: 'tip', text: 'Java can also work out the type for you with the word `var`, for example `var count = 5;`. Beginners learn faster by writing the type out, so this course does that for now.' },
    {
      t: 'fill',
      prompt: 'Choose the right type for each variable so that the program prints **Joel: 45000**.',
      template: prog(String.raw`        ___ memberName = "Joel";
        ___ balance = 45000;
        System.out.println(memberName + ": " + balance);`),
      blanks: [
        { options: ['String', 'int', 'char'], answer: 'String' },
        { options: ['int', 'String', 'boolean'], answer: 'int' },
      ],
      output: 'Joel: 45000',
    },
    {
      t: 'reorder',
      prompt: 'Each line uses a variable that an earlier line created. Put the lines in the only order that works. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        int price = 5000;`,
        String.raw`        int total = price * 2;`,
        String.raw`        int fee = total / 10;`,
        String.raw`        int payable = total + fee;`,
        String.raw`        System.out.println("Payable: " + payable);`,
        ...TAIL,
      ],
      output: 'Payable: 11000',
    },
    {
      t: 'bug',
      code: prog(String.raw`        int age = "34";
        System.out.println(age);`),
      question: 'The compiler refuses this program. Why?',
      options: ['An int variable cannot hold text. "34" in quotes is a String', 'age is a reserved word', 'println cannot print numbers', 'The semicolon is missing'],
      answer: 0,
      explain: 'The double quotes make "34" a piece of text, even though it looks like a number. An int envelope accepts only whole numbers. Remove the quotes and 34 becomes a number.',
      fixed: prog(String.raw`        int age = 34;
        System.out.println(age);`),
    },
    {
      t: 'quiz',
      question: 'Which type is best for a member’s savings of 125000 shillings?',
      options: ['int', 'String', 'char', 'boolean'],
      answer: 0,
      explain: 'Savings is a whole number of shillings, so int fits. A String would hold it as text, so you could not add to it. A char holds one character, and a boolean only true or false.',
    },
    {
      t: 'quiz',
      question: 'Which of these is a valid variable name?',
      options: ['memberName', 'member name', '2members', 'class'],
      answer: 0,
      explain: 'A name cannot contain a space, cannot start with a digit, and cannot be one of Java’s own words (class is one). memberName follows every rule and uses the camelCase style.',
    },
    {
      t: 'quiz',
      question: 'Which type holds exactly one character, such as the letter A?',
      options: ['char', 'String', 'int', 'double'],
      answer: 0,
      explain: 'char holds one character, written in single quotes: \'A\'. A String holds any amount of text, in double quotes: "A".',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: prog(String.raw`        System.out.println(total);
        int total = 5000;`),
          why: 'Java reads from top to bottom. When it reaches the println, no variable called total exists yet, so the compiler says it cannot find the symbol. Create the variable first, then use it.',
          right: prog(String.raw`        int total = 5000;
        System.out.println(total);`),
        },
        {
          wrong: prog(String.raw`        int balance;
        System.out.println(balance);`),
          why: 'The envelope was created but nothing was ever put inside. Java does not let you read a local variable that has no value yet: “variable balance might not have been initialized”. Give it a value when you create it.',
          right: prog(String.raw`        int balance = 0;
        System.out.println(balance);`),
        },
        {
          wrong: prog(String.raw`        string name = "Amina";
        System.out.println(name);`),
          why: 'The type is `String` with a **capital** S. With a small s, Java looks for a type called string, and there is none.',
          right: prog(String.raw`        String name = "Amina";
        System.out.println(name);`),
        },
        {
          wrong: prog(String.raw`        final int SHARE_PRICE = 20000;
        SHARE_PRICE = 25000;
        System.out.println(SHARE_PRICE);`),
          why: 'A variable marked `final` is a constant: it gets one value and keeps it. Assigning again is an error. If the value must change, remove `final`.',
          right: prog(String.raw`        int sharePrice = 20000;
        sharePrice = 25000;
        System.out.println(sharePrice);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A variable is a named envelope in memory. It has a type, a name and a value.',
        'Types: `int` and `long` for whole numbers, `double` for decimals, `boolean` for true or false, `char` for one character, `String` for text.',
        'Create with `type name = value;`. Change later with `name = newValue;`, with no type.',
        '`+` inside println joins text and values. `final` makes a constant.',
        'Names are case sensitive, cannot have spaces, and read best in camelCase.',
      ],
      memory: 'Type, name, value: the envelope, its label and what is inside.',
    },
  ],
  exercises: [
    {
      id: 'j3-passbook',
      title: 'Amina’s passbook',
      prompt: 'Create three variables (a `String` for the name, an `int` for the age and an `int` for the savings) and print the passbook on three lines:\n\n`Member: Amina Nakato`\n`Age: 34`\n`Savings: 150000`',
      starter: prog('        // Create name, age and savings, then print the three lines\n'),
      tests: [{ expected: 'Member: Amina Nakato\nAge: 34\nSavings: 150000' }],
      hints: [
        'Create the variables first: `String name = "Amina Nakato";` then the two int variables.',
        'Join text and a variable with `+`: `System.out.println("Member: " + name);`',
        'A similar example: `String town = "Gulu"; int distance = 340; System.out.println("Town: " + town);` prints Town: Gulu. Do the same for the age and the savings.',
      ],
    },
    {
      id: 'j3-swap',
      title: 'Swap two values',
      prompt: 'Two members’ savings were recorded in the wrong places. The program below has `a` holding 100 and `b` holding 200. **Swap** them so that it prints `a=200 b=100`. You may add a third variable.',
      starter: prog(String.raw`        int a = 100;
        int b = 200;
        // Swap a and b here
        System.out.println("a=" + a + " b=" + b);`),
      tests: [{ expected: 'a=200 b=100' }],
      hints: [
        'If you write `a = b;` straight away, the old value of a is lost. Save it somewhere first.',
        'Use a third variable: `int temp = a;` then `a = b;` then `b = temp;`',
        'The three steps in order: store a in temp, copy b into a, copy temp into b. Place them between the two int lines and the println.',
      ],
    },
    {
      id: 'j3-update',
      title: 'Update the balance',
      prompt: 'A member starts with a balance of `100000`. She deposits `25000`, then withdraws `10000`. Use one variable and change it with assignments. Print the final line exactly: `Balance: 115000`',
      starter: prog('        int balance = 100000;\n        // Add the deposit, subtract the withdrawal, then print\n'),
      tests: [{ expected: 'Balance: 115000' }],
      hints: [
        'Change the variable by assigning it a new value worked out from the old one.',
        'The deposit is `balance = balance + 25000;` and the withdrawal is `balance = balance - 10000;`',
        'After the two assignments, print with `System.out.println("Balance: " + balance);`',
      ],
    },
  ],
};
