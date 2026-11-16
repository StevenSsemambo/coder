// C++, Level 2: Decisions and loops. Lesson 5 (switch, nested decisions, bool).
import { prog, HEAD } from './shared.js';

const LEVEL = 'Level 2: Decisions and loops';

export const switchLessons = [
  // ================================================================== 5
  {
    id: 'cpp-switch',
    level: LEVEL,
    minutes: 24,
    title: 'switch, nested decisions and bool',
    summary: 'Choosing between many exact values, decisions inside decisions, and true/false variables',
    blocks: [
      {
        t: 'story',
        title: 'Numbers on the chalkboard',
        text: 'The lunch queue at the stand got so long that Mama Rose put **numbers** next to the menu: 1 for rolex, 2 for chapati, 3 for soda. Now a customer just shouts a number, and Mama Rose jumps straight to the right item. She does not ask “Is it a rolex? Is it a chapati? Is it a soda?” one question at a time.\n\nC++ has a tool that jumps straight to the right place: `switch`. It is perfect when **one value** is compared with many **exact** choices.',
      },
      { t: 'p', text: 'Run the program, then change the Input to 1, 3 and 9 and run it again.' },
      {
        t: 'try',
        stdin: '2',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int choice;
    cin >> choice;
    switch (choice) {
        case 1:
            cout << "Rolex: 3000 UGX" << endl;
            break;
        case 2:
            cout << "Chapati: 1000 UGX" << endl;
            break;
        case 3:
            cout << "Soda: 1500 UGX" << endl;
            break;
        default:
            cout << "No such item" << endl;
    }
    return 0;
}
`,
        output: 'Chapati: 1000 UGX',
      },
      {
        t: 'list',
        items: [
          '`switch (choice)` names the value to look at, inside round brackets.',
          '`case 2:` is a label. If `choice` is 2, the computer jumps to this line and runs from here.',
          '`break;` leaves the switch. Without it the computer keeps running into the next case (see below).',
          '`default:` runs when no case matches, like the final `else`.',
        ],
      },
      { t: 'h', text: 'What happens without break' },
      { t: 'analogy', text: 'Think of water running down a staircase. A `case` is a step you step onto. The water keeps flowing down to the next step, and the next, until it hits a wall. The wall is `break`. If you forget the wall, the water goes all the way down.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n = 1;
    switch (n) {
        case 1:
            cout << "one" << endl;
        case 2:
            cout << "two" << endl;
            break;
        case 3:
            cout << "three" << endl;
    }
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['one\ntwo', 'one', 'one\ntwo\nthree', 'two'],
        answer: 0,
        explain: 'n is 1, so the computer jumps to `case 1` and prints “one”. There is no `break`, so it runs on into `case 2` and prints “two”. Then `break` stops it, so “three” is never reached. This “falling through” is the most common switch mistake.',
      },
      { t: 'h', text: 'Falling through on purpose' },
      { t: 'p', text: 'Sometimes you **want** two cases to share the same answer. Leave out the `break` between them. A `switch` also works on a `char`: the case values are written in single quotes.' },
      {
        t: 'try',
        stdin: 'C',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    char grade;
    cin >> grade;
    switch (grade) {
        case 'A':
            cout << "Excellent" << endl;
            break;
        case 'B':
        case 'C':
            cout << "Good" << endl;
            break;
        default:
            cout << "Work harder" << endl;
    }
    return 0;
}
`,
        output: 'Good',
      },
      { t: 'tip', text: 'A `switch` works on whole numbers and single characters only, and every `case` must be one exact value. It cannot test a range such as “marks of 50 or more”, and it cannot use decimals. For ranges, use `if` and `else if`.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so choosing 1 prints only Rolex.',
        stdin: '1',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    switch (n) {
        case 1:
            cout << "Rolex" << endl;
            ___;
        case 2:
            cout << "Chapati" << endl;
            break;
    }
    return 0;
}
`,
        blanks: [{ options: ['break', 'continue', 'stop'], answer: 'break' }],
        output: 'Rolex',
      },
      { t: 'h', text: 'Decisions inside decisions' },
      { t: 'p', text: 'The block of an `if` can contain another `if`. This is called **nesting**. The inner question is only asked when the outer answer was yes. Indent each level by four spaces so you can see which question belongs to which.' },
      {
        t: 'try',
        stdin: '60 80',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int marks, attendance;
    cin >> marks >> attendance;
    if (marks >= 50) {
        if (attendance >= 75) {
            cout << "Pass: ready for the exam" << endl;
        } else {
            cout << "Pass, but attendance is low" << endl;
        }
    } else {
        cout << "Fail" << endl;
    }
    return 0;
}
`,
        output: 'Pass: ready for the exam',
      },
      { t: 'h', text: 'bool: a box for yes or no' },
      { t: 'p', text: 'A comparison gives `true` or `false`, and you can keep the answer in a `bool` variable with a clear name. Printing a `bool` with `cout` shows `1` for true and `0` for false.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << (5 > 3) << (5 < 3) << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['10', 'truefalse', '53', '01'],
        answer: 0,
        explain: '`5 > 3` is true, which prints as 1. `5 < 3` is false, which prints as 0. So you see 10. (The brackets matter: without them `<<` would be mixed up with `<`.)',
      },
      {
        t: 'try',
        stdin: '17',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int age;
    cin >> age;
    bool isAdult = age >= 18;
    if (isAdult) {
        cout << "Adult fare: 2000" << endl;
    } else {
        cout << "Child fare: 1000" << endl;
    }
    return 0;
}
`,
        output: 'Child fare: 1000',
      },
      {
        t: 'bug',
        stdin: '1',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    switch (n) {
        case 1
            cout << "Rolex" << endl;
            break;
        default:
            cout << "No such item" << endl;
    }
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['The label case 1 needs a colon: case 1:', 'default must come first', 'n must be a char', 'break cannot be used in a switch'],
        answer: 0,
        explain: 'Every `case` label ends with a colon, never a semicolon. The colon says “the code for this choice starts below”.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    switch (n) {
        case 1:
            cout << "Rolex" << endl;
            break;
        default:
            cout << "No such item" << endl;
    }
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            stdin: '1',
            wrong: prog(String.raw`    int n;
    cin >> n;
    switch (n) {
        case 1:
            cout << "Rolex" << endl;
        case 2:
            cout << "Chapati" << endl;
    }`),
            why: 'No `break` after `case 1`. The program prints Rolex **and** Chapati for choice 1, and no error appears. End every case with `break;` unless you are sharing on purpose.',
            right: prog(String.raw`    int n;
    cin >> n;
    switch (n) {
        case 1:
            cout << "Rolex" << endl;
            break;
        case 2:
            cout << "Chapati" << endl;
            break;
    }`),
          },
          {
            stdin: '1',
            wrong: prog(String.raw`    int n;
    cin >> n;
    switch n {
        case 1:
            cout << "Rolex" << endl;
            break;
    }`),
            why: 'The value after `switch` must be inside round brackets: `switch (n)`.',
            right: prog(String.raw`    int n;
    cin >> n;
    switch (n) {
        case 1:
            cout << "Rolex" << endl;
            break;
    }`),
          },
          {
            stdin: 'A',
            wrong: prog(String.raw`    char grade;
    cin >> grade;
    switch (grade) {
        case A:
            cout << "Excellent" << endl;
            break;
    }`),
            why: 'A letter value needs single quotes: `\'A\'`. Without quotes, C++ thinks A is the name of a variable and cannot find it.',
            right: prog(String.raw`    char grade;
    cin >> grade;
    switch (grade) {
        case 'A':
            cout << "Excellent" << endl;
            break;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'Which job is `switch` NOT suitable for?', options: ['Marks of 50 or more are a pass', 'Day number 1 to 7 gives the weekday name', 'A menu where 1, 2, 3 choose an item', 'The letter A, B or C gives a grade comment'], answer: 0, explain: '“50 or more” is a **range**, and `case` can only match one exact value at a time. Use `if (marks >= 50)` for ranges.' },
      { t: 'quiz', question: 'In a switch, what does `default:` do?', options: ['Runs when no case matches', 'Runs first, before every case', 'Stops the program', 'Repeats the last case'], answer: 0, explain: '`default` is the catch-all, like the final `else` of an if ladder. It runs only when none of the cases matched.' },
      {
        t: 'recap',
        items: [
          '`switch (value) { case 1: ... break; default: ... }` jumps to the matching case.',
          'End every case with `break;`, or the program falls through into the next one.',
          'A switch works on whole numbers and single characters, never on ranges or decimals.',
          'An `if` can sit inside another `if`: indent each level.',
          '`bool` holds true or false. `cout` prints them as 1 and 0.',
        ],
        memory: 'Case is a step, break is the wall.',
      },
    ],
    exercises: [
      {
        id: 'cpp5-menu',
        title: 'The numbered menu',
        prompt: 'Read the menu number and print the item and its price. Use a `switch`.\n\n1: `Rolex: 3000 UGX`\n2: `Chapati: 1000 UGX`\n3: `Soda: 1500 UGX`\n4: `Tea: 1000 UGX`\n\nAny other number: `No such item`',
        starter: prog('    // Read the menu number and use a switch\n'),
        tests: [
          { input: '1', expected: 'Rolex: 3000 UGX' },
          { input: '3', expected: 'Soda: 1500 UGX' },
          { input: '4', expected: 'Tea: 1000 UGX', hidden: true },
          { input: '9', expected: 'No such item', hidden: true },
          { input: '0', expected: 'No such item', hidden: true },
        ],
        hints: [
          'Read one `int`, then write `switch (choice)` with a `case` for each of 1, 2, 3 and 4, and a `default`.',
          'Every case ends with `break;`. The `default` case prints `No such item`.',
          'A similar example: `case 1: cout << "Mon" << endl; break; case 2: cout << "Tue" << endl; break; default: cout << "?" << endl;`',
        ],
      },
      {
        id: 'cpp5-day',
        title: 'Name the day',
        prompt: 'Read a day number from 1 to 7 and print the weekday name. 1 is Monday and 7 is Sunday. For any other number print `Invalid day`.',
        starter: prog('    // Read the day number, print the weekday name\n'),
        tests: [
          { input: '1', expected: 'Monday' },
          { input: '5', expected: 'Friday' },
          { input: '7', expected: 'Sunday', hidden: true },
          { input: '8', expected: 'Invalid day', hidden: true },
          { input: '0', expected: 'Invalid day', hidden: true },
        ],
        hints: [
          'Use a `switch` with seven cases, and a `default` for everything else.',
          'Each case prints one name and ends with `break;`: `case 1: cout << "Monday" << endl; break;`',
          'A similar example: `case 1: cout << "January" << endl; break;` and so on for months 2 to 12.',
        ],
      },
      {
        id: 'cpp5-calc',
        title: 'A pocket calculator',
        prompt: 'Read two whole numbers and an operator (`+`, `-`, `*` or `/`), typed like `12 + 5`, and print `Result: 17`.\n\n* For `/` use whole-number division. If the second number is 0, print `Cannot divide by zero`.\n* For any other operator, print `Unknown operator`.',
        starter: prog('    // int a, b; char op; read them as: cin >> a >> op >> b;\n'),
        tests: [
          { input: '12 + 5', expected: 'Result: 17' },
          { input: '9 / 2', expected: 'Result: 4' },
          { input: '3 * 7', expected: 'Result: 21' },
          { input: '10 - 25', expected: 'Result: -15', hidden: true },
          { input: '8 / 0', expected: 'Cannot divide by zero', hidden: true },
          { input: '4 % 2', expected: 'Unknown operator', hidden: true },
        ],
        hints: [
          'Read with `cin >> a >> op >> b;` (op is a `char`), then `switch (op)` with cases such as `case \'+\':`.',
          'For `/`, first check `if (b == 0)` and print the warning, otherwise print the division. The `default` case prints `Unknown operator`.',
          'A similar example: `case \'+\': cout << "Result: " << a + b << endl; break;` Do the same for the other operators.',
        ],
      },
    ],
  },
];
