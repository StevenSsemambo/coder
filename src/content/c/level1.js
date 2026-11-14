// C, Level 1: Getting started. Lessons 1 to 4.
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog, HEAD } from './shared.js';

const LEVEL = 'Level 1: Getting started';

export const level1 = [
  // ================================================================== 1
  {
    id: 'c-think',
    level: LEVEL,
    minutes: 15,
    title: 'From problem to program',
    summary: 'Algorithms, the three building blocks, and planning before typing',
    blocks: [
      {
        t: 'story',
        title: 'The boda rider’s fare',
        text: 'At the campus gate, a boda rider is asked “How much to Wandegeya?” a hundred times a day. He never panics. In his head he does the same few steps: count the kilometres, multiply by his rate, and never charge less than 2,000 shillings.\n\nHe has a **method**. A computer cannot guess a method; you must give it every step, in order, with nothing missing. A method written as clear steps is called an **algorithm**. Turning the algorithm into instructions a computer understands is called **programming**.',
      },
      { t: 'p', text: 'This course teaches **structured programming** in the C language. “Structured” means two simple promises: build every program from just **three building blocks**, and cut a big job into **small jobs**. Programs written this way are easy to read, easy to test and easy to fix.' },
      { t: 'analogy', text: 'Think of building a house from blocks. The whole house is made from only three kinds of block, however big it is. Learn the three blocks and you can build anything, from a tiny calculator to a banking system.' },
      { t: 'h', text: 'The three building blocks' },
      {
        t: 'list',
        items: [
          '**Sequence**: do the steps one after another, in order. (Weigh the sugar, then pour it, then stir.)',
          '**Selection**: choose between paths. (If the customer paid enough, give change, otherwise ask for more money.)',
          '**Repetition**: do something again and again. (Serve every customer in the queue.)',
        ],
      },
      { t: 'h', text: 'Plan first, in pseudocode' },
      { t: 'p', text: 'Before you type, plan in plain words. A plan written in simple English-like steps is called **pseudocode**. Here is the rider’s method. It uses all three ideas the computer needs: steps in order, a decision, and a calculation.' },
      { t: 'code', text: 'START\n    read km\n    fare = km * 1000\n    if fare is less than 2000\n        fare = 2000\n    show fare\nSTOP' },
      { t: 'p', text: 'Pseudocode is **not** C. A computer cannot run it. It is a plan for a human. Now the same plan written in C. Do not worry about every word yet; by the end of the course you will be able to write programs like this one in your sleep. Press **Run**, then change the 1 in the Input box to 5 and run it again.' },
      {
        t: 'try',
        stdin: '1',
        code: String.raw`#include <stdio.h>

int main() {
    int km, fare;
    scanf("%d", &km);
    fare = km * 1000;
    if (fare < 2000) {
        fare = 2000;
    }
    printf("Fare: %d\n", fare);
    return 0;
}
`,
        output: 'Fare: 2000',
      },
      {
        t: 'predict',
        stdin: '5',
        code: String.raw`#include <stdio.h>

int main() {
    int km, fare;
    scanf("%d", &km);
    fare = km * 1000;
    if (fare < 2000) {
        fare = 2000;
    }
    printf("Fare: %d\n", fare);
    return 0;
}
`,
        question: 'The passenger rides 5 km. What does the program print?',
        options: ['Fare: 5000', 'Fare: 2000', 'Fare: 5', 'Fare: 1000'],
        answer: 0,
        explain: '5 km gives a fare of 5 × 1000 = 5000. That is not less than 2000, so the decision does nothing and 5000 is printed.',
      },
      { t: 'h', text: 'Cut big jobs into small jobs' },
      { t: 'p', text: 'No one builds the whole Campus Duuka program in one go. You start from the big picture and keep splitting it until every piece is small enough to write in a few lines. This is called **top-down design**.' },
      {
        t: 'list',
        items: [
          '**Run the Campus Duuka**: the big job.',
          'Record a sale, check the stock, print the daily report: three medium jobs.',
          'Recording a sale means: read the item, read the quantity, work out the total: small jobs you can code today.',
        ],
      },
      { t: 'p', text: 'Later in the course each small job becomes a **function**, a named, reusable piece of the program.' },
      {
        t: 'reorder',
        prompt: 'The computer follows the lines from top to bottom. Put these lines in an order that prints the three steps of making tea **in the right order**. The first line is the top of every C program.',
        lines: [HEAD, String.raw`    printf("1. Boil the water\n");`, String.raw`    printf("2. Add the tea leaves\n");`, String.raw`    printf("3. Pour into a cup\n");`, '    return 0;', '}'],
        output: '1. Boil the water\n2. Add the tea leaves\n3. Pour into a cup',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: prog(String.raw`    print("Fare: 2000");`), why: 'Pseudocode words such as print and show are not C. In C the instruction is `printf`, and `\\n` ends the line.', right: prog(String.raw`    printf("Fare: 2000\n");`) },
          {
            logic: true,
            wrong: prog(String.raw`    int km = 0;
    int fare;
    fare = km * 1000;
    km = 5;
    printf("Fare: %d\n", fare);`),
            why: 'Sequence matters. The fare was worked out while `km` was still 0, and only afterwards did `km` become 5. The program prints 0 and is “working” exactly as written. Put the steps in the order the real job needs.',
            right: prog(String.raw`    int km = 5;
    int fare;
    fare = km * 1000;
    printf("Fare: %d\n", fare);`),
          },
        ],
      },
      { t: 'quiz', question: 'A program must serve every customer in the queue until the queue is empty. Which building block is that?', options: ['Repetition', 'Sequence', 'Selection', 'Pseudocode'], answer: 0, explain: 'Doing something again and again is repetition, also called a loop. You will meet loops in Level 2.' },
      { t: 'quiz', question: 'A program must print a receipt only if the customer paid enough. Which building block is that?', options: ['Selection', 'Repetition', 'Sequence', 'Top-down design'], answer: 0, explain: 'Choosing between paths based on a question is selection. In C it is written with `if`.' },
      {
        t: 'recap',
        items: ['An algorithm is a clear list of steps that solves a problem.', 'Every structured program is built from three blocks: sequence, selection and repetition.', 'Plan in pseudocode first. It is for people, not for the computer.', 'Cut a big job into small jobs, then write each small job.'],
        memory: 'Plan on paper, build with three blocks, in small pieces.',
      },
    ],
    exercises: [
      {
        id: 'c0-plan',
        title: 'The sale in four steps',
        prompt: 'Write a program that prints these four steps of a sale, one under the other:\n\n`1. Take the order`\n`2. Work out the total`\n`3. Receive the money`\n`4. Give the change`',
        starter: prog('    // Print the four steps\n'),
        tests: [{ expected: '1. Take the order\n2. Work out the total\n3. Receive the money\n4. Give the change' }],
        hints: [
          'Each line needs its own `printf`, and each one ends with `\\n` to move to the next line.',
          'Copy the text exactly, including the number, the full stop and the capital letters: `printf("1. Take the order\\n");`',
          'A similar example: `printf("A. Wake up\\n"); printf("B. Wash\\n");` prints two lines. Write four lines for the sale.',
        ],
      },
      {
        id: 'c0-order',
        title: 'Fix the order',
        prompt: 'This program is meant to print the steps of washing your hands, but the lines are in the wrong order. **Rearrange the printf lines** so it prints:\n\n`1. Wet your hands`\n`2. Add soap`\n`3. Rub for 20 seconds`\n`4. Rinse`',
        starter: prog(String.raw`    printf("3. Rub for 20 seconds\n");
    printf("1. Wet your hands\n");
    printf("4. Rinse\n");
    printf("2. Add soap\n");`),
        tests: [{ expected: '1. Wet your hands\n2. Add soap\n3. Rub for 20 seconds\n4. Rinse' }],
        hints: [
          'The computer runs the lines from top to bottom, so the order of the lines is the order of the output.',
          'Look at the number at the start of each text. The line that prints 1 must be first, then 2, then 3, then 4.',
          'A similar example: to print `A` then `B`, write `printf("A\\n");` first and `printf("B\\n");` second.',
        ],
      },
    ],
  },

  // ================================================================== 2
  {
    id: 'c-first',
    level: LEVEL,
    minutes: 18,
    title: 'Your first C program',
    summary: 'main, printf, new lines, special characters and comments',
    blocks: [
      {
        t: 'story',
        title: 'The welcome board at the gate',
        text: 'Every campus has a signboard at the gate. The signwriter paints “Welcome” once, and everyone who walks past can read it. Words appear because someone put them there.\n\nYour first C program does the same job: it puts words on the screen. Nearly every programmer in the world started with exactly this program, so you are in good company.',
      },
      { t: 'p', text: 'Every C program starts at a function called `main`. The computer runs the statements inside `main` one by one, from top to bottom. Press **Run** to see this one work.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
`,
        output: 'Hello, world!',
      },
      { t: 'analogy', text: 'The line `#include <stdio.h>` is like borrowing a toolbox from a neighbour. The tool called `printf` lives in the toolbox named `stdio.h`, so you must borrow it first. `main` is the front door: the computer always walks into your program through it.' },
      { t: 'h', text: 'Read it line by line' },
      {
        t: 'list',
        items: [
          '`#include <stdio.h>` borrows the toolbox that contains `printf`.',
          '`int main()` is where the program starts. The curly brackets `{ }` hold the program.',
          '`printf("...")` prints the text between the quotes.',
          '`\\n` moves to a new line. It is two keys, a backslash and the letter n, but it counts as one special character.',
          'Every statement ends with a semicolon `;`.',
          '`return 0;` tells the computer the program finished well.',
        ],
      },
      { t: 'h', text: 'New lines are your job' },
      { t: 'p', text: 'C never starts a new line by itself. Each `printf` prints exactly the text you give it, so you must write `\\n` yourself.' },
      {
        t: 'predict',
        code: prog(String.raw`    printf("Karibu ");
    printf("to ");
    printf("campus\n");`),
        question: 'What does this program print?',
        options: ['Karibu to campus', 'Karibu\nto\ncampus', 'Karibu to\ncampus', 'Nothing, because there is no \\n after the first printf'],
        answer: 0,
        explain: 'There is no `\\n` after “Karibu ” or “to ”, so everything stays on one line. Only the last `printf` ends the line.',
      },
      { t: 'h', text: 'Special characters' },
      { t: 'list', items: ['`\\n` a new line', '`\\t` a tab (a wide gap)', '`\\"` a double quote inside the text', '`\\\\` a backslash', '`%%` a percent sign (you will see why in the next lesson)'] },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    printf("Name:\tRose\n");
    printf("Rose says \"Karibu!\"\n");
    printf("Folder: C:\\Duuka\n");
    return 0;
}
`,
        output: 'Name:\tRose\nRose says "Karibu!"\nFolder: C:\\Duuka',
      },
      { t: 'h', text: 'Comments: notes for people' },
      { t: 'p', text: 'Anything after `//` on a line, or between `/*` and `*/`, is a **comment**. The computer ignores it. Use comments to explain your thinking to the next person who reads your code, who is often you in two weeks.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    // This line is a comment: the computer skips it
    /* A comment can also
       run over several lines */
    printf("Comments are free\n");
    return 0;
}
`,
        output: 'Comments are free',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the second word starts on a new line.',
        template: prog(String.raw`    printf("Karibu___");
    printf("to campus\n");`),
        blanks: [{ options: ['\\n', '/n', '\\t'], answer: '\\n' }],
        output: 'Karibu\nto campus',
      },
      {
        t: 'bug',
        code: prog(String.raw`    printf("Hello, Uganda!\n")`),
        question: 'This program refuses to run and the error says “Parsing Failure”. What is wrong?',
        options: ['The printf line is missing its semicolon', 'printf must be written in capital letters', 'The text must not contain a comma', 'return 0; is missing'],
        answer: 0,
        explain: 'Every C statement ends with a semicolon. Without it the computer cannot tell where the statement stops, so it cannot even read the program. A missing `;` is the most common beginner mistake.',
        fixed: prog(String.raw`    printf("Hello, Uganda!\n");`),
      },
      {
        t: 'mistakes',
        items: [
          { wrong: prog(String.raw`    printf("Hi\n")`), why: 'No semicolon at the end of the statement. C stops with a parsing error. Look at the end of the line the error points to, and at the line above it.', right: prog(String.raw`    printf("Hi\n");`) },
          { wrong: prog(String.raw`    Printf("Hi\n");`), why: 'C is case sensitive: `Printf` and `printf` are different words. The computer has never heard of `Printf`. Write all the letters of `printf` in lower case.', right: prog(String.raw`    printf("Hi\n");`) },
          { wrong: '\nint main() {\n    printf("Hi\\n");\n    return 0;\n}\n', why: 'Without `#include <stdio.h>` the computer does not know `printf`: you forgot to borrow the toolbox.', right: prog(String.raw`    printf("Hi\n");`) },
          { logic: true, wrong: prog(String.raw`    printf("Total: ");
    printf("5000");`), why: 'This runs, but both pieces stick together on one line and the next output would join onto the end of it. Finish a line with `\\n`.', right: prog(String.raw`    printf("Total: ");
    printf("5000\n");`) },
        ],
      },
      { t: 'quiz', question: 'Where does a C program start running?', options: ['At `int main()`', 'At `#include <stdio.h>`', 'At the first `printf`', 'At `return 0;`'], answer: 0, explain: 'The computer always enters through `main`. The `#include` lines are processed first, but your own statements start at the top of `main`.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 1): the banner',
        text: 'Every shop has a sign. This program prints the banner for your project, the Campus Duuka. Change the text, then run it again.',
        code: String.raw`#include <stdio.h>

int main() {
    printf("================\n");
    printf("  CAMPUS DUUKA\n");
    printf("  Open 7am - 9pm\n");
    printf("================\n");
    return 0;
}
`,
        output: '================\n  CAMPUS DUUKA\n  Open 7am - 9pm\n================',
      },
      {
        t: 'recap',
        items: ['A C program starts at `main` and runs top to bottom.', '`printf("text")` prints text. You write `\\n` for a new line.', 'Every statement ends with `;`. C is case sensitive.', '`//` and `/* */` are comments for people. The computer skips them.'],
        memory: 'Include, main, printf, semicolon.',
      },
    ],
    exercises: [
      {
        id: 'c1-hello',
        title: 'Hello, Uganda',
        prompt: 'Write a program that prints exactly: `Hello, Uganda!`',
        starter: prog('    // Print the greeting here\n'),
        tests: [{ expected: 'Hello, Uganda!' }],
        hints: [
          'Use `printf` to print text. The text goes inside double quotes.',
          'Inside `main`, write one `printf` line and end it with a semicolon. Your program needs `#include <stdio.h>` at the top.',
          'A similar example: `printf("Good morning!\\n");` prints Good morning! Now change the text so it matches exactly, including the capital H, the comma and the exclamation mark.',
        ],
      },
      {
        id: 'c1-twolines',
        title: 'Two lines',
        prompt: 'Print these two lines, one under the other:\n\n`Welcome to C`\n`Let\'s learn together`',
        starter: prog('    // Print two lines\n'),
        tests: [{ expected: "Welcome to C\nLet's learn together" }],
        hints: [
          'Each `printf` prints what is inside its quotes. To jump to the next line, put `\\n` at the end of the text.',
          'You can use two `printf` statements, or one `printf` with `\\n` in the middle.',
          'A similar example: `printf("Red\\n"); printf("Green\\n");` prints Red, then Green on the next line.',
        ],
      },
      {
        id: 'c1-triangle',
        title: 'Star triangle',
        prompt: 'Print this triangle of stars:\n\n`*`\n`**`\n`***`',
        starter: prog('    // Print the triangle\n'),
        tests: [{ expected: '*\n**\n***' }],
        hints: [
          'Print one row at a time. Each row is its own `printf` that ends with `\\n`.',
          'Row 1 has one star, row 2 has two, row 3 has three. Remember the `\\n` after each row.',
          'A similar example: `printf("#\\n"); printf("##\\n");` prints a two-row triangle of # signs.',
        ],
      },
      {
        id: 'c1-quote',
        title: 'Quotes and backslashes',
        prompt: 'Print these two lines exactly, including the quotation marks and the backslash:\n\n`Rose says "Karibu!"`\n`C:\\Duuka`',
        starter: prog('    // Careful: a quote or a backslash inside the text needs a backslash in front\n'),
        tests: [{ expected: 'Rose says "Karibu!"\nC:\\Duuka' }],
        hints: [
          'A double quote inside the text would end the text too early. Write `\\"` to print a quote.',
          'A backslash is also special, so to print one you write two: `\\\\`.',
          'A similar example: `printf("He said \\"Hi\\"\\n");` prints He said "Hi", and `printf("D:\\\\Photos\\n");` prints D:\\Photos.',
        ],
      },
    ],
  },

  // ================================================================== 3
  {
    id: 'c-variables',
    level: LEVEL,
    minutes: 22,
    title: 'Variables and input',
    summary: 'int, float and char, printf codes, scanf and the & sign',
    blocks: [
      {
        t: 'story',
        title: 'Change at the cashier',
        text: 'Aisha buys a notebook for 3,500 shillings and pays with a 5,000 note. The cashier works out her change in her head and says “1,500.” That is easy for one customer.\n\nNow imagine a program serving a hundred customers. It must **remember** the price, remember what was paid, and use both to work out the change. Programs remember things in **variables**: named places that hold a value.',
      },
      { t: 'analogy', text: 'A variable is a **labelled container**, and in C the shape of the container matters. A sack holds whole matooke, a jerrycan holds liquid, a small tin holds one coin. You choose the container when you create it (this is called the **type**) and you cannot pour water into a sack. In C: `int` is the sack for whole numbers, `float` is the jerrycan for numbers with decimals, `char` is the tin for a single character.' },
      {
        t: 'list',
        items: ['`int` for whole numbers, like 25 or -3', '`float` for numbers with decimals, like 3.14 or 2500.50', '`char` for one character, written in single quotes, like \'A\''],
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int age = 20;
    float price = 2500.50;
    char grade = 'A';
    printf("Age: %d\n", age);
    printf("Price: %.2f\n", price);
    printf("Grade: %c\n", grade);
    return 0;
}
`,
        output: 'Age: 20\nPrice: 2500.50\nGrade: A',
      },
      { t: 'p', text: 'The codes inside `printf` mark where a value goes, and they must match the type:' },
      { t: 'list', items: ['`%d` for an `int`', '`%f` for a `float`. `%.2f` shows exactly two decimals.', '`%c` for a `char`', '`%s` for a piece of text (you will use it later)'] },
      { t: 'tip', text: 'A code that does not match the type is a bug, even on the day it happens to print something sensible. Always match them: `%d` with `int`, `%f` with `float`, `%c` with `char`.' },
      { t: 'h', text: 'Changing a variable' },
      {
        t: 'predict',
        code: prog(String.raw`    int stock = 20;
    stock = stock - 5;
    printf("%d\n", stock);`),
        question: 'What does this print?',
        options: ['15', '20', '5', 'stock'],
        answer: 0,
        explain: 'The container `stock` held 20. Then it was refilled with its old value minus 5, so it now holds 15. A single `=` means “put this value in the container”, not “is equal to”.',
      },
      { t: 'h', text: 'Choosing names' },
      { t: 'list', items: ['Use letters, digits and the underscore `_`. No spaces.', 'A name cannot start with a digit: `2cups` is not allowed, `cups2` is.', 'Capital letters matter: `Price` and `price` are two different variables.', 'Choose names that say what is inside: `total_fee` is better than `x`.'] },
      { t: 'h', text: 'Reading input with scanf' },
      { t: 'p', text: 'To read a number typed by the user, use `scanf`. It uses the same codes as `printf`, and you put an **`&`** in front of the variable name. The `&` means “the address of”: `scanf` needs to know **where** the container is, so it can put the number inside.' },
      {
        t: 'try',
        stdin: '3500 5000',
        code: String.raw`#include <stdio.h>

int main() {
    int price, paid;
    scanf("%d %d", &price, &paid);
    printf("Change: %d\n", paid - price);
    return 0;
}
`,
        output: 'Change: 1500',
      },
      { t: 'tip', text: 'In this app, type the input values in the Input box before you press Run. Separate several numbers with spaces or put each on its own line.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program reads the age and prints the age next year.',
        stdin: '19',
        template: prog(String.raw`    int age;
    scanf("%d", ___);
    printf("%d\n", age + 1);`),
        blanks: [{ options: ['&age', 'age', '*age'], answer: '&age' }],
        output: '20',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int price = 3500;
    printf("Total: %d\n", total);`),
        question: 'This program stops with an error: “variable total does not exist”. Why?',
        options: ['`total` was never created: it needs a declaration such as `int total;`', 'printf cannot print numbers', '3500 is too big for an int', 'Variable names must be in capital letters'],
        answer: 0,
        explain: 'C wants to know about every variable before you use it. The program created `price` but then asked for `total`, which does not exist anywhere. Declare it first, give it a value, then use it.',
        fixed: prog(String.raw`    int price = 3500;
    int total = price;
    printf("Total: %d\n", total);`),
      },
      {
        t: 'mistakes',
        items: [
          { stdin: '5', wrong: prog(String.raw`    int a;
    scanf("%d", a);
    printf("%d\n", a);`), why: 'The `&` is missing. Without it `scanf` does not know where `a` lives, and the program stops. Always write `&a`.', right: prog(String.raw`    int a;
    scanf("%d", &a);
    printf("%d\n", a);`) },
          { wrong: prog(String.raw`    int a;
    printf("%d\n", a);`), why: '`a` was created but never given a value, so it holds nothing useful. A real C program would print a random leftover number; this app stops you so you notice. Give every variable a value before you use it.', right: prog(String.raw`    int a = 0;
    printf("%d\n", a);`) },
          { logic: true, wrong: prog(String.raw`    float price = 2.5;
    printf("%d\n", price);`), why: 'The code `%d` is for an `int`, but `price` is a `float`. A real C program prints a strange number here. Use `%f` (or `%.2f`) for a `float`.', right: prog(String.raw`    float price = 2.5;
    printf("%.2f\n", price);`) },
        ],
      },
      { t: 'quiz', question: 'Which type is the best container for the price 2500.50?', options: ['float', 'int', 'char', 'printf'], answer: 0, explain: 'The price has a decimal part, so it needs a `float`. An `int` would throw the .50 away.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 2): a price tag',
        text: 'The till reads the number of items and the price of one item, and works out the total. Press Run, then try other numbers in the Input box.',
        stdin: '3 2500',
        code: String.raw`#include <stdio.h>

int main() {
    int quantity, price;
    scanf("%d %d", &quantity, &price);
    printf("Total: %d\n", quantity * price);
    return 0;
}
`,
        output: 'Total: 7500',
      },
      {
        t: 'recap',
        items: ['A variable is a labelled container. Its type decides what fits inside.', '`int` whole numbers (`%d`), `float` decimals (`%f`), `char` one character (`%c`).', '`=` puts a value in a variable. `scanf("%d", &x)` reads one from the user.', 'Declare a variable before use, and give it a value before you read it.'],
        memory: 'Type, name, value; and & before scanf.',
      },
    ],
    exercises: [
      {
        id: 'c2-sum',
        title: 'Add two numbers',
        prompt: 'Read two whole numbers and print their sum like this: `Sum: 8`',
        starter: prog('    int a, b;\n    // Read a and b with scanf, then print the sum\n'),
        sampleInput: '3 5',
        usesInput: true,
        tests: [
          { input: '3 5', expected: 'Sum: 8' },
          { input: '10 20', expected: 'Sum: 30' },
          { input: '-4 9', expected: 'Sum: 5', hidden: true },
        ],
        hints: [
          'Use one `scanf` to read both numbers. The format is `"%d %d"` and each variable gets an `&`.',
          '`scanf("%d %d", &a, &b);` reads both. Then print with `printf("Sum: %d\\n", a + b);`.',
          'A similar example that multiplies: `scanf("%d %d", &x, &y); printf("Product: %d\\n", x * y);` Change the operator and the label.',
        ],
      },
      {
        id: 'c2-change',
        title: 'Shop change',
        prompt: 'An item costs `price` shillings and the customer pays `paid` shillings. Read `price` then `paid` and print the change like this: `Change: 1500`',
        starter: prog('    int price, paid;\n    // Read both numbers, then print the change\n'),
        sampleInput: '3500 5000',
        usesInput: true,
        tests: [
          { input: '3500 5000', expected: 'Change: 1500' },
          { input: '800 1000', expected: 'Change: 200' },
          { input: '1200 2000', expected: 'Change: 800', hidden: true },
        ],
        hints: [
          'Change is what the customer paid minus the price.',
          'Read with `scanf("%d %d", &price, &paid);` and print `paid - price`.',
          'A similar example: a bus fare of 2000 paid with 5000 leaves `5000 - 2000`. Print it with `printf("Change: %d\\n", paid - price);`.',
        ],
      },
      {
        id: 'c2-average',
        title: 'Average of three',
        prompt: 'Read three whole numbers and print their average with two decimals, like this: `Average: 5.67`',
        starter: prog('    int a, b, c;\n    float average;\n    // Read the numbers, calculate the average, print it\n'),
        sampleInput: '3 4 10',
        usesInput: true,
        tests: [
          { input: '3 4 10', expected: 'Average: 5.67' },
          { input: '10 10 10', expected: 'Average: 10.00' },
          { input: '1 2 2', expected: 'Average: 1.67', hidden: true },
        ],
        hints: [
          'Add the three numbers and divide by 3. Remember that dividing two ints cuts off the decimals.',
          'Divide by `3.0` instead of `3` so the answer keeps its decimals: `average = (a + b + c) / 3.0;`',
          'A similar example: `half = n / 2.0;` keeps decimals, and `printf("%.2f\\n", half);` prints two decimals.',
        ],
      },
    ],
  },

  // ================================================================== 4
  {
    id: 'c-types',
    level: LEVEL,
    minutes: 25,
    title: 'Numbers, characters and operators',
    summary: 'Integer division, the remainder, casting, ASCII, constants and shortcuts',
    blocks: [
      {
        t: 'story',
        title: 'Sharing the taxi fare',
        text: 'Three friends share a 17,000 shilling taxi. “17,000 divided by 3,” says one, and types it into a program. The program answers **5666**. “That is not right,” says another, “three times 5666 is 16,998. Two shillings are missing!”\n\nThe program is not wrong. It divided **whole numbers**, and whole-number division does not make fractions. Understanding exactly how C treats numbers will save you from a hundred silent mistakes.',
      },
      { t: 'analogy', text: 'Share 17 mandazi among 3 children. Each child gets **5 whole mandazi** and **2 are left over**. In C, `17 / 3` gives the 5 (division of whole numbers keeps only the whole part) and `17 % 3` gives the 2 (the **remainder**). Together they tell the complete story.' },
      { t: 'h', text: 'Division and remainder' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    printf("%d each\n", 17000 / 3);
    printf("%d left over\n", 17000 % 3);
    return 0;
}
`,
        output: '5666 each\n2 left over',
      },
      {
        t: 'predict',
        code: prog(String.raw`    printf("%d %d\n", 10 / 4, 10 % 4);`),
        question: 'What does this print?',
        options: ['2 2', '2.5 2', '3 2', '2 0'],
        answer: 0,
        explain: 'Dividing two whole numbers keeps only the whole part: 10 / 4 is 2. The remainder of 10 divided by 4 is 2 (4 goes in twice, 2 are left).',
      },
      { t: 'tip', text: 'The remainder `%` is more useful than it looks. `n % 2 == 0` tests for an even number, `n % 10` gives the last digit of a number, and `minutes % 60` gives the minutes left after taking out whole hours.' },
      { t: 'h', text: 'Getting the decimals back' },
      { t: 'p', text: 'If **either** number in a division has a decimal point, C keeps the decimals. You can write `7 / 2.0`, or turn a variable into a decimal for one calculation with a **cast**: `(float)a / b`. The cast in front of `a` says “treat this as a float, just here”.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int a = 7, b = 2;
    printf("%d\n", a / b);
    printf("%.2f\n", a / 2.0);
    printf("%.2f\n", (float)a / b);
    return 0;
}
`,
        output: '3\n3.50\n3.50',
      },
      { t: 'h', text: 'Order of calculation' },
      { t: 'p', text: 'C follows the school rules: `*`, `/` and `%` happen before `+` and `-`, and brackets go first. When two operators have the same rank, C goes from left to right. When in doubt, add brackets: they never hurt.' },
      {
        t: 'predict',
        code: prog(String.raw`    printf("%d %d\n", 2 + 3 * 4, (2 + 3) * 4);`),
        question: 'What does this print?',
        options: ['14 20', '20 20', '14 14', '20 14'],
        answer: 0,
        explain: 'Multiplication goes first: 3 * 4 is 12, plus 2 is 14. In the second one the brackets force 2 + 3 to happen first: 5 * 4 is 20.',
      },
      { t: 'h', text: 'Shortcuts' },
      { t: 'p', text: 'Changing a variable using its own value is so common that C has shortcuts. `x += 5` means `x = x + 5`. The same works for `-=`, `*=`, `/=` and `%=`. Adding or subtracting exactly 1 is even shorter: `x++` and `x--`.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int x = 10;
    x += 5;
    x -= 3;
    x *= 2;
    x /= 4;
    x++;
    printf("%d\n", x);
    return 0;
}
`,
        output: '7',
      },
      { t: 'h', text: 'Characters are numbers' },
      { t: 'p', text: 'Inside the computer every character is stored as a number, its **ASCII code**: `A` is 65, `B` is 66, `a` is 97, and the digit `0` is 48. That means you can do sums with characters. A lower case letter is exactly **32** more than its capital.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    char c = 'a';
    printf("%c has code %d\n", c, c);
    printf("Next letter: %c\n", c + 1);
    c = c - 32;
    printf("Capital: %c\n", c);
    return 0;
}
`,
        output: 'a has code 97\nNext letter: b\nCapital: A',
      },
      { t: 'p', text: 'This is why `%c` and `%d` can both print the same `char`: `%c` shows the character, `%d` shows its code.' },
      { t: 'h', text: 'Named constants' },
      { t: 'p', text: 'If the VAT rate is 18 and appears in forty places, changing it means forty edits and one forgotten one. Give the number a name. Write `#define VAT 18` above `main` (no `=` and no semicolon), then use `VAT` everywhere. `const int VAT = 18;` inside `main` also works.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>
#define VAT 18

int main() {
    int price = 1000;
    printf("Price plus tax: %d\n", price + price * VAT / 100);
    return 0;
}
`,
        output: 'Price plus tax: 1180',
      },
      { t: 'tip', text: 'A real C compiler refuses to build a program that changes a `const`. The runtime in this app is lenient and lets it through, so treat `const` as a promise you keep yourself. Also, an `int` holds numbers up to about 2,000,000,000. Real C silently wraps around to a wrong number past that; this app stops with an error to help you notice.' },
      { t: 'fill', prompt: 'Fill the gap so the program prints the remainder of 17 divided by 3.', template: prog(String.raw`    printf("%d\n", 17 ___ 3);`), blanks: [{ options: ['%', '/', '*'], answer: '%' }], output: '2' },
      {
        t: 'bug',
        code: prog(String.raw`    char grade = A;
    printf("%c\n", grade);`),
        question: 'This program stops with “variable A does not exist”. What is wrong?',
        options: ['A single character must be written in single quotes: \'A\'', 'The type char cannot hold letters', 'printf cannot print a char', 'The variable must be called A'],
        answer: 0,
        explain: 'Without quotes C thinks `A` is the name of a variable, and there is none. Single quotes mark one character: `\'A\'`. (Double quotes are for whole pieces of text.)',
        fixed: prog(String.raw`    char grade = 'A';
    printf("%c\n", grade);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int a = 3, b = 4;
    float average = (a + b) / 2;
    printf("%.2f\n", average);`),
            why: '(3 + 4) / 2 is a division of two whole numbers, so C keeps only the 3 and throws away the .5. The result is stored as a float afterwards, but it is already too late. Make one side a decimal: `/ 2.0`.',
            right: prog(String.raw`    int a = 3, b = 4;
    float average = (a + b) / 2.0;
    printf("%.2f\n", average);`),
          },
          { logic: true, wrong: prog(String.raw`    int percent = 45 / 60 * 100;
    printf("%d\n", percent);`), why: 'C works from left to right. `45 / 60` is 0 in whole numbers, and 0 times 100 is still 0. Multiply first and divide last: `45 * 100 / 60` gives 75.', right: prog(String.raw`    int percent = 45 * 100 / 60;
    printf("%d\n", percent);`) },
          { wrong: prog(String.raw`    char c = "A";
    printf("%c\n", c);`), why: 'Double quotes make a piece of text, which is a different thing from a single character. A `char` holds one character in single quotes.', right: prog(String.raw`    char c = 'A';
    printf("%c\n", c);`) },
        ],
      },
      { t: 'quiz', question: 'Which operator gives the remainder of a division?', options: ['%', '/', '#', '&'], answer: 0, explain: 'The percent sign is the remainder (modulus) operator. `/` gives the whole-number quotient.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 3): share the bill',
        text: 'Friends share a bill. The program reads the total and the number of friends, then shows each share and how much is left over.',
        stdin: '17000 3',
        code: String.raw`#include <stdio.h>

int main() {
    int fare, friends;
    scanf("%d %d", &fare, &friends);
    printf("%d each, %d left over\n", fare / friends, fare % friends);
    return 0;
}
`,
        output: '5666 each, 2 left over',
      },
      {
        t: 'recap',
        items: ['Whole-number division keeps the whole part. `%` gives the remainder.', 'One decimal in a division keeps the decimals: `7 / 2.0` or `(float)a / b`.', 'Multiplication and division go before addition and subtraction. Use brackets to be sure.', 'A `char` is a number: `\'A\'` is 65, and a lower case letter is 32 more than its capital.', '`#define` or `const` gives a number a name. `x += 5` and `x++` are shortcuts.'],
        memory: 'Whole numbers stay whole.',
      },
    ],
    exercises: [
      {
        id: 'c2t-minutes',
        title: 'Hours and minutes',
        prompt: 'Read a number of minutes and print it as hours and minutes, like this:\n\n`2 hours 15 minutes`\n\nfor an input of `135`. Use `/` and `%`.',
        starter: prog('    int minutes;\n    // Read the minutes, then print hours and minutes\n'),
        sampleInput: '135',
        usesInput: true,
        tests: [
          { input: '135', expected: '2 hours 15 minutes' },
          { input: '60', expected: '1 hours 0 minutes' },
          { input: '45', expected: '0 hours 45 minutes', hidden: true },
          { input: '500', expected: '8 hours 20 minutes', hidden: true },
        ],
        hints: [
          'There are 60 minutes in an hour. Whole hours come from a division, the leftover minutes from the remainder.',
          'Hours: `minutes / 60`. Minutes left: `minutes % 60`. Print both in one `printf` with two `%d` codes.',
          'A similar example: `printf("%d days %d hours\\n", h / 24, h % 24);` turns hours into days and hours.',
        ],
      },
      {
        id: 'c2t-vat',
        title: 'Price with VAT',
        prompt: 'Read a price (it may have decimals) and print the total with 18% VAT added, with two decimals, like this:\n\n`Total: 2950.00`\n\nfor a price of `2500`. Multiply the price by `1.18`.',
        starter: prog('    float price;\n    // Read the price, add 18% VAT, print the total\n'),
        sampleInput: '2500',
        usesInput: true,
        tests: [
          { input: '2500', expected: 'Total: 2950.00' },
          { input: '1000', expected: 'Total: 1180.00' },
          { input: '10000', expected: 'Total: 11800.00', hidden: true },
        ],
        hints: [
          'Use a `float` for the price, read it with `%f`, and print with `%.2f`.',
          'Adding 18% is the same as multiplying by 1.18: `price * 1.18`.',
          'A similar example: `scanf("%f", &x); printf("Double: %.2f\\n", x * 2);` reads a decimal and prints it doubled.',
        ],
      },
      {
        id: 'c2t-letter',
        title: 'Small to capital',
        prompt: 'Read one lower case letter and print its capital, like this: `Q` for an input of `q`.\n\nHint: a capital letter is 32 less than the matching lower case letter.',
        starter: prog('    char letter;\n    // Read the letter, convert it, print it\n'),
        sampleInput: 'q',
        usesInput: true,
        tests: [
          { input: 'q', expected: 'Q' },
          { input: 'a', expected: 'A' },
          { input: 'z', expected: 'Z', hidden: true },
          { input: 'm', expected: 'M', hidden: true },
        ],
        hints: [
          'Read one character with `scanf(" %c", &letter);` (the space before `%c` skips blanks).',
          'Characters are numbers, so you can subtract: `letter - 32` is the capital. Print it with `%c`.',
          'A similar example: `printf("%c\\n", letter + 1);` prints the next letter of the alphabet.',
        ],
      },
      {
        id: 'c2t-digits',
        title: 'Split off the last digit',
        prompt: 'Read a whole number and print its last digit and the number without that digit:\n\n`Last digit: 5`\n`Rest: 482`\n\nfor an input of `4825`.',
        starter: prog('    int n;\n    // Read n, then print the last digit and the rest\n'),
        sampleInput: '4825',
        usesInput: true,
        tests: [
          { input: '4825', expected: 'Last digit: 5\nRest: 482' },
          { input: '90', expected: 'Last digit: 0\nRest: 9' },
          { input: '7', expected: 'Last digit: 7\nRest: 0', hidden: true },
          { input: '123456', expected: 'Last digit: 6\nRest: 12345', hidden: true },
        ],
        hints: [
          'Dividing by 10 removes the last digit, and the remainder after dividing by 10 *is* the last digit.',
          'Last digit: `n % 10`. Rest of the number: `n / 10`. Print each on its own line.',
          'A similar example: for 76, `76 % 10` is 6 and `76 / 10` is 7.',
        ],
      },
    ],
  },
];
