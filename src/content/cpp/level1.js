// C++, Level 1: Getting started. Lessons 1 to 3.
// Prose uses single-quoted strings. C++ code uses String.raw so that \n stays a backslash-n.
import { prog, HEAD, IO_FMT } from './shared.js';

const LEVEL = 'Level 1: Getting started';

export const level1 = [
  // ================================================================== 1
  {
    id: 'cpp-first',
    level: LEVEL,
    minutes: 18,
    title: 'Your first C++ program',
    summary: 'main, cout, new lines, special characters and comments',
    blocks: [
      {
        t: 'story',
        title: 'The chalkboard menu',
        text: 'Mama Rose sells rolex (a chapati rolled around an egg omelette) beside the campus gate. Every morning she writes her menu on a chalkboard: the dish, the price, “Karibu!”. She writes it **once**, and every student who walks past can read it.\n\nYour first C++ program does the same job. It puts words on the screen so that people can read them. Almost every programmer in the world started with a program just like this one.',
      },
      { t: 'p', text: 'Every C++ program starts at a function called `main`. The computer runs the lines inside `main` one by one, from top to bottom. Press **Run** to see this one work.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, world!" << endl;
    return 0;
}
`,
        output: 'Hello, world!',
      },
      { t: 'analogy', text: 'Think of `#include <iostream>` as borrowing a toolbox from a neighbour. The tool called `cout` lives in the toolbox named `iostream`, so you must borrow it first. `main` is the front door: the computer always walks into your program through it. And `cout` is a loudspeaker: whatever you push towards it with `<<` comes out on the screen.' },
      { t: 'h', text: 'Read it line by line' },
      {
        t: 'list',
        items: [
          '`#include <iostream>` borrows the toolbox that contains `cout` (the name means “input and output stream”).',
          '`using namespace std;` tells the computer that the tools come from the **standard** shelf, so you can write `cout` and not `std::cout`. Always write it under the includes.',
          '`int main()` is where the program starts. The curly brackets `{ }` hold the program.',
          '`cout << "..."` prints the text between the quotes. The arrows `<<` point at the screen, the direction the text travels.',
          '`endl` ends the line, like pressing Enter.',
          'Every statement ends with a semicolon `;`.',
          '`return 0;` tells the computer the program finished well.',
        ],
      },
      { t: 'h', text: 'You can chain things with <<' },
      { t: 'p', text: 'One `cout` can print many pieces, joined by `<<`. Text goes in quotes. Numbers do not need quotes. Press **Run** and look at how the pieces join.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Rolex" << " with " << 2 << " eggs" << endl;
    cout << "Price: " << 3000 << " UGX\n";
    return 0;
}
`,
        output: 'Rolex with 2 eggs\nPrice: 3000 UGX',
      },
      { t: 'p', text: 'There are two ways to end a line: `endl` and the special characters `\\n` inside the quotes. Both move to the next line. This course uses `endl` most of the time because it is easy to see.' },
      { t: 'h', text: 'New lines are your job' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Karibu ";
    cout << "to ";
    cout << "campus" << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['Karibu to campus', 'Karibu\nto\ncampus', 'Karibu to\ncampus', 'Nothing, because there is no endl after the first cout'],
        answer: 0,
        explain: 'C++ never starts a new line by itself. There is no `endl` after “Karibu ” or “to ”, so everything stays on one line. Only the last `cout` ends the line.',
      },
      { t: 'h', text: 'Special characters' },
      { t: 'list', items: ['`\\n` a new line', '`\\t` a tab (a wide gap)', '`\\\"` a double quote inside the text', '`\\\\` a backslash'] },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Name:\tRose\n";
    cout << "Rose says \"Karibu!\"\n";
    cout << "Folder: C:\\Duuka\n";
    return 0;
}
`,
        output: 'Name:\tRose\nRose says "Karibu!"\nFolder: C:\\Duuka',
      },
      { t: 'h', text: 'Comments: notes for people' },
      { t: 'p', text: 'Two slashes `//` start a comment that lasts to the end of the line. `/*` and `*/` wrap a longer comment. The computer ignores comments completely. They are notes for the next human who reads your code, and that human is often **you**, next week.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    // This line is a note for people
    cout << "Open for business" << endl; // this prints the sign
    /* A longer note
       can use two lines */
    cout << "Closed on Sunday" << endl;
    return 0;
}
`,
        output: 'Open for business\nClosed on Sunday',
      },
      {
        t: 'fill',
        prompt: 'Fill the gaps so the program prints Karibu.',
        template: String.raw`#include <___>
using namespace std;

int main() {
    ___ << "Karibu" << endl;
    return 0;
}
`,
        blanks: [
          { options: ['iostream', 'stdio.h', 'cout'], answer: 'iostream' },
          { options: ['cout', 'cin', 'print'], answer: 'cout' },
        ],
        output: 'Karibu',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to Mama Rose's stand" << endl
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['A semicolon is missing at the end of the cout line', 'endl is spelled wrongly', 'main must be written with a capital M', 'There are too many quotes'],
        answer: 0,
        explain: 'Every statement ends with `;`. Without it the computer cannot tell where the `cout` statement stops and `return 0;` starts. The error message often points at the line **after** the missing semicolon.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to Mama Rose's stand" << endl;
    return 0;
}
`,
      },
      {
        t: 'reorder',
        prompt: 'The computer follows the lines from top to bottom. Put these lines in an order that prints the three steps of making a rolex **in the right order**. The first line is the top of every C++ program.',
        lines: [HEAD, String.raw`    cout << "1. Beat the eggs" << endl;`, String.raw`    cout << "2. Fry the omelette" << endl;`, String.raw`    cout << "3. Roll it in a chapati" << endl;`, '    return 0;', '}'],
        output: '1. Beat the eggs\n2. Fry the omelette\n3. Roll it in a chapati',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: prog(String.raw`    Cout << "Hi" << endl;`), why: 'C++ is **case-sensitive**. `cout` and `Cout` are different names, and only `cout` exists.', right: prog(String.raw`    cout << "Hi" << endl;`) },
          {
            wrong: String.raw`using namespace std;

int main() {
    cout << "Hi" << endl;
    return 0;
}
`,
            why: 'The program never borrowed the toolbox. Without `#include <iostream>` the computer has never heard of `cout`.',
            right: prog(String.raw`    cout << "Hi" << endl;`),
          },
          { wrong: prog(String.raw`    cout << "Hi << endl;`), why: 'The text between quotes was never closed. Every opening `"` needs a closing `"`.', right: prog(String.raw`    cout << "Hi" << endl;`) },
          {
            logic: true,
            wrong: prog(String.raw`    cout << "Rolex";
    cout << "Chapati";`),
            why: 'Nothing is wrong for the computer, and the program runs. It prints `RolexChapati` on one line, because no `endl` was written. Add `endl` after each item to put each on its own line.',
            right: prog(String.raw`    cout << "Rolex" << endl;
    cout << "Chapati" << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'Which pair of symbols sends text to the screen with cout?', options: ['<<', '>>', '==', '->'], answer: 0, explain: 'The arrows `<<` point from your text towards `cout`, the screen. (The opposite arrows `>>` are used for reading input, which you will meet in the next lesson.)' },
      { t: 'quiz', question: 'What does `return 0;` at the end of main tell the computer?', options: ['The program finished well', 'Print the number 0', 'Start the program again', 'Delete the program'], answer: 0, explain: 'A returned 0 is the computer’s way of saying “everything went fine”. It prints nothing.' },
      {
        t: 'recap',
        items: [
          'A C++ program starts at `main`. Inside it, lines run from top to bottom.',
          '`#include <iostream>` and `using namespace std;` go at the top of the programs in this course.',
          '`cout << ... << endl;` prints. Chain pieces with `<<`.',
          'Every statement ends with `;`. C++ is case-sensitive.',
          '`//` starts a comment for people.',
        ],
        memory: 'Include, using, main, cout, semicolon.',
      },
    ],
    exercises: [
      {
        id: 'cpp1-hello',
        title: 'Hello, Uganda',
        prompt: 'Write a program that prints exactly:\n\n`Hello, Uganda!`',
        starter: prog('    // Print Hello, Uganda! here\n'),
        tests: [{ expected: 'Hello, Uganda!' }],
        hints: [
          'Use `cout` to print. The text goes inside double quotes, and the line ends with a semicolon.',
          'Copy the text exactly, including the comma, the capital letters and the exclamation mark: `cout << "Hello, Uganda!" << endl;`',
          'A similar example: `cout << "Welcome to campus" << endl;` prints Welcome to campus. Change the text to Hello, Uganda!',
        ],
      },
      {
        id: 'cpp1-menu',
        title: 'The chalkboard menu',
        prompt: 'Print Mama Rose’s menu, one item per line, exactly like this:\n\n`Mama Rose’s Rolex Stand`\n`Rolex: 3000 UGX`\n`Chapati: 1000 UGX`\n\n(The apostrophe in Rose’s is the plain one on your keyboard: `\'`.)',
        starter: prog('    // Print the three lines of the menu\n'),
        tests: [{ expected: "Mama Rose's Rolex Stand\nRolex: 3000 UGX\nChapati: 1000 UGX" }],
        hints: [
          'You need three lines of output, so use three `cout` statements, each ending with `endl`.',
          'The text goes between double quotes, so a single quote (apostrophe) inside it needs no special care: `cout << "Mama Rose\'s Rolex Stand" << endl;`',
          'A similar example: `cout << "Pen: 500 UGX" << endl; cout << "Book: 2000 UGX" << endl;` prints two lines. Write three lines for the menu.',
        ],
      },
      {
        id: 'cpp1-board',
        title: 'The signboard',
        prompt: 'Use `\\t` (tab) and `\\"` (a quote inside text) to print exactly these three lines. The gaps after `Item:` and `Price:` are one tab each.\n\n`Item:` TAB `Rolex`\n`Price:` TAB `3000`\n`Rose says "Karibu!"`',
        starter: prog('    // Print the three lines of the signboard\n'),
        tests: [{ expected: 'Item:\tRolex\nPrice:\t3000\nRose says "Karibu!"' }],
        hints: [
          'A tab is written `\\t` inside the quotes, for example `"Item:\\tRolex"`.',
          'To print a double quote inside text, put a backslash before it: `\\"`. The last line is `cout << "Rose says \\"Karibu!\\"" << endl;`',
          'A similar example: `cout << "Name:\\tAmina\\n";` prints Name:, a tab, then Amina. Do the same for Item and Price.',
        ],
      },
    ],
  },

  // ================================================================== 2
  {
    id: 'cpp-vars',
    level: LEVEL,
    minutes: 22,
    title: 'Variables and input',
    summary: 'int, double and char variables, assignment, and reading input with cin',
    blocks: [
      {
        t: 'story',
        title: 'Mama Rose’s notebook',
        text: 'Mama Rose keeps a small notebook. One column says **quantity**, the next says **price**, and the last says **total**. When a customer asks for 3 rolex, she writes 3 under quantity, 3000 under price, and works out the total.\n\nEach column has a **label** and holds **one value**. In C++ we call such a labelled place a **variable**. Without variables a program could print things, but it could never remember anything.',
      },
      { t: 'analogy', text: 'A variable is a **box with a label**. The label is the name (`quantity`). The box can hold only one kind of thing: a box made for whole numbers cannot hold a decimal, and a box made for one letter cannot hold a long sentence. You choose the kind of box when you create it.' },
      { t: 'h', text: 'The kinds of box (types)' },
      {
        t: 'list',
        items: [
          '`int` holds whole numbers: `3`, `-20`, `3000`. Use it for counts and for UGX amounts.',
          '`double` holds numbers with a decimal point: `2.5`, `0.07`.',
          '`char` holds one single character, written in single quotes: `\'A\'`, `\'7\'`.',
          '`bool` holds `true` or `false`. You will use it in the lesson on decisions.',
        ],
      },
      { t: 'p', text: 'Creating a variable is called **declaring** it. Putting a value in it is called **assigning**. You can do both in one line. After that you can use the name instead of the value.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int price = 3000;
    int quantity = 2;
    int total = price * quantity;
    cout << "Total: " << total << " UGX" << endl;
    return 0;
}
`,
        output: 'Total: 6000 UGX',
      },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int b = a;
    a = 9;
    cout << a << " " << b << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['9 5', '9 9', '5 9', '5 5'],
        answer: 0,
        explain: '`b = a` copies the **value** 5 into b’s own box. When a later becomes 9, b’s box is not affected. Assigning replaces what was in the box; it never links two boxes together.',
      },
      { t: 'h', text: 'Reading input with cin' },
      { t: 'p', text: 'Programs become useful when they read what the user types. `cin` is the opposite of `cout`: it reads from the keyboard. The arrows point the other way, `>>`, because the value travels **into** the variable. You can read several values with one `cin` by chaining `>>`.' },
      {
        t: 'try',
        stdin: '3 2500',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int quantity, price;
    cin >> quantity >> price;
    cout << "Total: " << quantity * price << " UGX" << endl;
    return 0;
}
`,
        output: 'Total: 7500 UGX',
      },
      { t: 'tip', text: 'In this app the **Input** box below the editor is your keyboard. Type the values there, separated by a space or a new line, and then press Run. Change 3 2500 to other numbers and run again.' },
      { t: 'h', text: 'Decimals and neat money' },
      { t: 'p', text: 'A `double` can hold decimals. To print it with exactly two digits after the point, add `fixed << setprecision(2)` to the `cout`. You need `#include <iomanip>` for that. Use `int` for UGX (shillings have no small coins today) and `double` when decimals are the point, such as kilograms.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double kilos = 2.5;
    double rate = 4000;
    cout << fixed << setprecision(2);
    cout << "Cost: " << kilos * rate << " UGX" << endl;
    return 0;
}
`,
        output: 'Cost: 10000.00 UGX',
      },
      { t: 'tip', text: 'Names should say what the box holds: `quantity` and `price` are better than `a` and `b`. A name may use letters, digits and `_`, but it cannot start with a digit and cannot contain spaces. Names are case-sensitive: `price` and `Price` are two different boxes.' },
      {
        t: 'fill',
        prompt: 'Fill the gaps so the program reads two numbers and prints their sum.',
        stdin: '3 4',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin ___ a ___ b;
    cout << a + b << endl;
    return 0;
}
`,
        blanks: [
          { options: ['>>', '<<', '->'], answer: '>>' },
          { options: ['>>', '<<', '->'], answer: '>>' },
        ],
        output: '7',
      },
      {
        t: 'reorder',
        prompt: 'The two boxes are already declared in the first block. Put the lines in order so the program **reads** a price and a quantity, **works out** the total, and then **prints** it.',
        stdin: '2500 3',
        lines: [HEAD + '\n    int price, quantity;', '    cin >> price >> quantity;', '    int total = price * quantity;', '    cout << total << endl;', '    return 0;', '}'],
        output: '7500',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int quantity = 3;
    cout << Quantity * 2500 << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['The variable is written quantity in one place and Quantity in the other', 'You cannot multiply by 2500', 'quantity must be a double', 'The cout line needs a comma'],
        answer: 0,
        explain: 'C++ is case-sensitive, so `quantity` and `Quantity` are two different names. The computer has never heard of `Quantity`. Copy variable names exactly.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int quantity = 3;
    cout << quantity * 2500 << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: prog(String.raw`    cout << total << endl;`), why: 'The variable `total` was never declared. A variable must be created before it is used.', right: prog(String.raw`    int total = 6000;
    cout << total << endl;`) },
          { wrong: prog(String.raw`    int quantity = 3
    cout << quantity << endl;`), why: 'The declaration is missing its semicolon.', right: prog(String.raw`    int quantity = 3;
    cout << quantity << endl;`) },
          {
            stdin: '3',
            wrong: prog(String.raw`    int quantity;
    cin << quantity;
    cout << quantity << endl;`),
            why: 'The arrows point the wrong way. `cout` uses `<<` (value travels to the screen). `cin` uses `>>` (value travels into the variable).',
            right: prog(String.raw`    int quantity;
    cin >> quantity;
    cout << quantity << endl;`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int kilos = 2.5;
    cout << kilos << endl;`),
            why: 'An `int` box cannot hold decimals, so the .5 is simply cut off and the program prints 2. No error appears, which is what makes this mistake dangerous. Use `double` for decimals.',
            right: prog(String.raw`    double kilos = 2.5;
    cout << kilos << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'Which type would you choose to store the weight 3.75 kg of sugar?', options: ['double', 'int', 'char', 'bool'], answer: 0, explain: '`double` holds numbers with a decimal point. An `int` would cut the .75 off.' },
      { t: 'quiz', question: 'Which line reads a number from the keyboard into the variable `age`?', options: ['cin >> age;', 'cin << age;', 'cout >> age;', 'age >> cin;'], answer: 0, explain: '`cin >> age;` sends the typed value into the variable `age`. The arrows point the way the value travels.' },
      {
        t: 'recap',
        items: [
          'A variable is a labelled box. Choose its type when you declare it: `int`, `double`, `char`, `bool`.',
          '`int total = 6000;` declares and assigns in one line. `=` copies the value from right to left.',
          '`cin >> a >> b;` reads values into variables. `cout << a << b;` prints them. The arrows show the direction.',
          'For neat decimals: `#include <iomanip>` and `cout << fixed << setprecision(2);`.',
          'Names are case-sensitive and must be declared before use.',
        ],
        memory: 'cout << goes out; cin >> comes in.',
      },
    ],
    exercises: [
      {
        id: 'cpp2-sum',
        title: 'Add two numbers',
        prompt: 'Read two whole numbers and print their sum like this: `Sum: 7`',
        starter: prog('    // Declare two int variables, read them, print Sum: ...\n'),
        tests: [
          { input: '3 4', expected: 'Sum: 7' },
          { input: '10 25', expected: 'Sum: 35' },
          { input: '-4 9', expected: 'Sum: 5', hidden: true },
        ],
        hints: [
          'Declare two `int` variables, read them with `cin >> a >> b;` and print the result of `a + b`.',
          'The output must start with the exact words `Sum: ` (with the colon and a space), then the number: `cout << "Sum: " << a + b << endl;`',
          'A similar example for the difference: `int x, y; cin >> x >> y; cout << "Difference: " << x - y << endl;`',
        ],
      },
      {
        id: 'cpp2-change',
        title: 'Change at the stand',
        prompt: 'A customer buys one rolex. Read the **price** and the **amount paid** (two whole numbers) and print the change like this: `Change: 800`',
        starter: prog('    // Read price and paid, print the change\n'),
        tests: [
          { input: '3000 5000', expected: 'Change: 2000' },
          { input: '2200 3000', expected: 'Change: 800' },
          { input: '1200 2000', expected: 'Change: 800', hidden: true },
        ],
        hints: [
          'Read two `int` values with one `cin`. The change is the amount paid minus the price.',
          'Order matters when you read: the price comes first, the amount paid second. The output is `cout << "Change: " << paid - price << endl;`',
          'A similar example: `int cost, budget; cin >> cost >> budget; cout << "Left: " << budget - cost << endl;`',
        ],
      },
      {
        id: 'cpp2-average',
        title: 'Class average',
        prompt: 'Read three whole marks and print their average with **two digits after the decimal point**, like this: `Average: 1.67`\n\nHint: dividing by `3.0` (not `3`) keeps the decimals. You need `#include <iomanip>`.',
        starter: prog('    // Read three marks, print Average: with two decimals\n', IO_FMT),
        tests: [
          { input: '70 80 90', expected: 'Average: 80.00' },
          { input: '1 2 2', expected: 'Average: 1.67' },
          { input: '55 60 66', expected: 'Average: 60.33', hidden: true },
        ],
        hints: [
          'Read three `int` marks. Add them, then divide by `3.0`. Put the answer in a `double` variable.',
          'Before printing, write `cout << fixed << setprecision(2);` once, then `cout << "Average: " << average << endl;`',
          'A similar example: `double half = (a + b) / 2.0;` keeps the .5 for two numbers. Do the same with three numbers and `3.0`.',
        ],
      },
    ],
  },

  // ================================================================== 3
  {
    id: 'cpp-types',
    level: LEVEL,
    minutes: 22,
    title: 'Numbers, characters and operators',
    summary: 'Integer division, %, casting, shortcuts, characters and const',
    blocks: [
      {
        t: 'story',
        title: 'Twenty-three sweets',
        text: 'Mama Rose has 23 sweets to share equally among 5 children. Each child gets 4 sweets, and 3 sweets are left over. Nobody cuts a sweet into pieces to give each child 4.6.\n\nC++ divides whole numbers **the same way**. If both numbers are `int`, the answer is a whole number and the leftover is thrown away. A second operator, `%`, gives you the leftover instead.',
      },
      { t: 'p', text: 'The arithmetic operators are `+` add, `-` subtract, `*` multiply, `/` divide and `%` remainder. Press **Run** to see the sweets shared.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int sweets = 23;
    int children = 5;
    cout << "Each child gets: " << sweets / children << endl;
    cout << "Left over: " << sweets % children << endl;
    return 0;
}
`,
        output: 'Each child gets: 4\nLeft over: 3',
      },
      { t: 'h', text: 'Whole-number division and decimal division' },
      { t: 'p', text: 'If **both** numbers are `int`, `/` gives a whole number. If **either** one is a `double`, `/` keeps the decimals.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << 7 / 2 << " " << 7 % 2 << " " << 7 / 2.0 << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['3 1 3.5', '3.5 1 3.5', '3 1 3', '4 1 3.5'],
        answer: 0,
        explain: '`7 / 2` has two whole numbers, so it is 3 (the .5 is dropped). `7 % 2` is the remainder, 1. `7 / 2.0` has a decimal number in it, so the answer keeps its decimals: 3.5.',
      },
      { t: 'h', text: 'Casting: asking for decimals' },
      { t: 'p', text: 'What if your numbers are `int` variables but you want a decimal answer? Put `(double)` in front of **one** of them. This is called a **cast**: it makes a decimal copy of the value for that calculation only.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int total = 7;
    int people = 2;
    cout << fixed << setprecision(2);
    cout << "Each pays: " << (double)total / people << endl;
    return 0;
}
`,
        output: 'Each pays: 3.50',
      },
      { t: 'tip', text: 'The cast must happen **before** the division. `(double)total / people` casts first, then divides, and gives 3.50. But `(double)(total / people)` divides the whole numbers first (answer 3) and only then makes it a decimal, so you get 3.00. This mistake is in the mistake museum below.' },
      { t: 'h', text: 'Order of operations' },
      { t: 'p', text: 'Multiplication, division and `%` happen before addition and subtraction, just like in mathematics. Use brackets when you want a different order.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << 2 + 3 * 4 << " " << (2 + 3) * 4 << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['14 20', '20 20', '14 14', '20 14'],
        answer: 0,
        explain: 'Multiplication comes first: 3 * 4 = 12, then 2 + 12 = 14. In the second one the brackets force 2 + 3 = 5 first, then 5 * 4 = 20.',
      },
      { t: 'h', text: 'Shortcuts' },
      { t: 'p', text: 'Changing a variable is so common that C++ has shortcuts: `x += 5` means `x = x + 5`. The same idea works for `-=`, `*=`, `/=` and `%=`. And `x++` adds 1, `x--` subtracts 1.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int stock = 20;
    stock -= 3;
    stock++;
    stock *= 2;
    cout << "Stock: " << stock << endl;
    return 0;
}
`,
        output: 'Stock: 36',
      },
      { t: 'h', text: 'Characters are numbers in disguise' },
      { t: 'p', text: 'A `char` is stored as a number, its **ASCII code**: `\'A\'` is 65, `\'B\'` is 66 and so on. Casting a `char` to `int` shows the number, and adding 1 moves to the next letter.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    char grade = 'A';
    cout << grade << endl;
    cout << (int)grade << endl;
    grade = grade + 1;
    cout << grade << endl;
    return 0;
}
`,
        output: 'A\n65\nB',
      },
      { t: 'h', text: 'const: a number that must not change' },
      { t: 'p', text: 'If a value should never change while the program runs (a tax rate, the number of days in a week), declare it with `const` and give it a CAPITAL name. Then it has one name and one place to change.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    const int VAT = 18;
    int price = 5000;
    cout << "VAT: " << price * VAT / 100 << endl;
    return 0;
}
`,
        output: 'VAT: 900',
      },
      { t: 'tip', text: 'Honest warning: a real C++ compiler **refuses** to build a program that tries to change a `const`. The practice runner inside this app is looser and would let it through. Never rely on that: treat a `const` as locked.' },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int total = 500;
    int count = 0;
    cout << "Average: " << total / count << endl;
    return 0;
}
`,
        question: 'This program stops with an error. Why?',
        options: ['It divides by zero, which is not allowed', 'total is too small', 'count must be a double', 'The text “Average” must be in single quotes'],
        answer: 0,
        explain: 'Dividing a whole number by zero has no answer, so the program stops. Real programs check that the divisor is not zero first (you will learn the `if` for that in the next lessons).',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int total = 500;
    int count = 2;
    cout << "Average: " << total / count << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int a = 5;
    int b = 2;
    cout << (a + b) / 2 << endl;`),
            why: 'Both numbers are `int`, so the .5 is dropped. The program prints 3 instead of 3.5, and no error appears. Divide by `2.0`.',
            right: prog(String.raw`    int a = 5;
    int b = 2;
    cout << (a + b) / 2.0 << endl;`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int total = 7;
    int people = 2;
    cout << (double)(total / people) << endl;`),
            why: 'The cast came too late. `total / people` was already worked out as the whole number 3, and only then was it made a decimal. Cast **one number** before the division: `(double)total / people`.',
            right: prog(String.raw`    int total = 7;
    int people = 2;
    cout << (double)total / people << endl;`),
          },
          { wrong: prog(String.raw`    int x = 5
    x += 2;
    cout << x << endl;`), why: 'The first line is missing its semicolon.', right: prog(String.raw`    int x = 5;
    x += 2;
    cout << x << endl;`) },
          {
            logic: true,
            wrong: prog(String.raw`    int minutes = 135;
    cout << minutes / 60 << " hours " << minutes / 60 << " minutes" << endl;`),
            why: 'The second number must be the **leftover** minutes, so it needs `%`, not `/`. The program prints 2 hours 2 minutes instead of 2 hours 15 minutes.',
            right: prog(String.raw`    int minutes = 135;
    cout << minutes / 60 << " hours " << minutes % 60 << " minutes" << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'What is 17 % 5 in C++?', options: ['2', '3', '3.4', '12'], answer: 0, explain: '17 divided by 5 is 3 whole times (15), and 2 is left over. `%` gives that leftover: 2.' },
      { t: 'quiz', question: 'Which line prints 2.5 for the whole numbers 5 and 2?', options: ['cout << (double)5 / 2;', 'cout << 5 / 2;', 'cout << (double)(5 / 2);', 'cout << 5 % 2;'], answer: 0, explain: 'Only the first one makes a number decimal **before** the division. `5 / 2` gives 2, `(double)(5 / 2)` gives 2 as a decimal, and `5 % 2` gives the leftover, 1.' },
      {
        t: 'recap',
        items: [
          'Two `int` values divide into a whole number. Use `%` for the leftover.',
          'For a decimal answer, make **one** side a decimal before dividing: `7 / 2.0` or `(double)total / people`.',
          'Brackets change the order. `+=`, `-=`, `*=`, `++` and `--` are shortcuts for changing a variable.',
          'A `char` is a number (ASCII): `(int)\'A\'` is 65.',
          '`const` names a fixed value. Treat it as locked.',
        ],
        memory: '/ cuts, % keeps the leftover.',
      },
    ],
    exercises: [
      {
        id: 'cpp3-sweets',
        title: 'Share the sweets',
        prompt: 'Read the number of **sweets** and the number of **children** and print:\n\n`Each: 4`\n`Left over: 3`\n\n(for 23 sweets and 5 children)',
        starter: prog('    // Read sweets and children, print Each: and Left over:\n'),
        tests: [
          { input: '23 5', expected: 'Each: 4\nLeft over: 3' },
          { input: '30 6', expected: 'Each: 5\nLeft over: 0' },
          { input: '7 10', expected: 'Each: 0\nLeft over: 7', hidden: true },
        ],
        hints: [
          'Read two `int` values. `/` gives how many each child gets, and `%` gives how many are left over.',
          'Print two lines: `cout << "Each: " << sweets / children << endl;` and then the same with `"Left over: "` and `%`.',
          'A similar example: with `int eggs, trays; cin >> eggs >> trays;` the whole trays are `eggs / 30` and the extra eggs are `eggs % 30`.',
        ],
      },
      {
        id: 'cpp3-minutes',
        title: 'Minutes to hours',
        prompt: 'Read a number of minutes and print it as hours and minutes, like this:\n\n`2 hours 15 minutes`\n\n(for 135 minutes)',
        starter: prog('    // Read minutes, print hours and minutes\n'),
        tests: [
          { input: '135', expected: '2 hours 15 minutes' },
          { input: '60', expected: '1 hours 0 minutes' },
          { input: '45', expected: '0 hours 45 minutes', hidden: true },
          { input: '500', expected: '8 hours 20 minutes', hidden: true },
        ],
        hints: [
          'There are 60 minutes in an hour. The whole hours come from `/ 60`, and the leftover minutes come from `% 60`.',
          'Print both in one `cout`: `cout << minutes / 60 << " hours " << minutes % 60 << " minutes" << endl;`',
          'A similar example: for seconds, `cout << secs / 60 << " min " << secs % 60 << " sec" << endl;`.',
        ],
      },
      {
        id: 'cpp3-vat',
        title: 'Price with VAT',
        prompt: 'The VAT rate is 18 percent. Declare it as `const int VAT = 18;`. Read a price (a whole number of UGX) and print:\n\n`VAT: 900`\n`Total: 5900`\n\n(for a price of 5000)',
        starter: prog('    // const int VAT = 18; read the price, print VAT: and Total:\n'),
        tests: [
          { input: '5000', expected: 'VAT: 900\nTotal: 5900' },
          { input: '12500', expected: 'VAT: 2250\nTotal: 14750' },
          { input: '1000', expected: 'VAT: 180\nTotal: 1180', hidden: true },
        ],
        hints: [
          'The VAT amount is `price * VAT / 100`. The total is the price plus the VAT amount.',
          'Store the VAT amount in an `int` variable first, so you can print it and also add it: `int vat = price * VAT / 100;`',
          'A similar example for a 10 percent discount: `const int OFF = 10; int cut = price * OFF / 100; cout << "Pay: " << price - cut << endl;`',
        ],
      },
    ],
  },
];
