// C++, Level 2: Decisions and loops. Lesson 4 so far (see docs/CPP-TRACK.md for the roadmap).
import { prog, HEAD } from './shared.js';

const LEVEL = 'Level 2: Decisions and loops';

export const level2 = [
  // ================================================================== 4
  {
    id: 'cpp-decide',
    level: LEVEL,
    minutes: 24,
    title: 'Making decisions',
    summary: 'if, else, else if, comparisons, && || ! and the ? : shortcut',
    blocks: [
      {
        t: 'story',
        title: 'Enough money?',
        text: 'A rolex costs 3000 shillings. A student hands Mama Rose some money. She does not think about it for long: **if** the money is 3000 or more, she hands over the rolex. **Otherwise** she says “Add a little more.”\n\nThat choice between two paths is the second building block of every program, **selection**. In C++ it is written with `if` and `else`.',
      },
      { t: 'p', text: 'Read the program below. The condition `paid >= 3000` is a question. If the answer is yes, the first block runs. If the answer is no, the `else` block runs. Run it, then change the Input to 2000 and run again.' },
      {
        t: 'try',
        stdin: '5000',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int paid;
    cin >> paid;
    if (paid >= 3000) {
        cout << "Here is your rolex" << endl;
    } else {
        cout << "Add a little more" << endl;
    }
    return 0;
}
`,
        output: 'Here is your rolex',
      },
      { t: 'h', text: 'The comparison operators' },
      {
        t: 'list',
        items: [
          '`==` equal to. (Two equal signs! One `=` stores a value; two `==` ask a question.)',
          '`!=` not equal to',
          '`<` less than, `>` greater than',
          '`<=` less than or equal to, `>=` greater than or equal to',
        ],
      },
      { t: 'p', text: 'A comparison gives a yes or no answer. C++ calls these `true` and `false`, and the type that holds them is `bool`. (In the example further down, the person types 1 for “yes, I have a card” and the program turns that into a `bool` with `card == 1`.)' },
      { t: 'h', text: 'More than two paths: else if' },
      { t: 'p', text: 'Use `else if` to add more questions. C++ asks them from the top and runs **only the first block whose answer is yes**, then skips the rest. That is why you always put the strictest condition first.' },
      {
        t: 'try',
        stdin: '75',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int marks;
    cin >> marks;
    if (marks >= 80) {
        cout << "Grade A" << endl;
    } else if (marks >= 70) {
        cout << "Grade B" << endl;
    } else if (marks >= 60) {
        cout << "Grade C" << endl;
    } else {
        cout << "Grade F" << endl;
    }
    return 0;
}
`,
        output: 'Grade B',
      },
      {
        t: 'predict',
        stdin: '85',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int marks;
    cin >> marks;
    if (marks >= 60) {
        cout << "Grade C" << endl;
    } else if (marks >= 80) {
        cout << "Grade A" << endl;
    }
    return 0;
}
`,
        question: 'The student scores 85. What does this program print?',
        options: ['Grade C', 'Grade A', 'Grade C and Grade A', 'Nothing'],
        answer: 0,
        explain: 'C++ checks `marks >= 60` first. 85 is more than 60, so that block runs and the rest of the ladder is skipped. The `>= 80` question is never asked. Put the strictest condition first.',
      },
      { t: 'h', text: 'Combining questions: && || !' },
      {
        t: 'list',
        items: [
          '`&&` means **and**. Both sides must be true.',
          '`||` means **or**. At least one side must be true.',
          '`!` means **not**. It flips true to false and false to true.',
        ],
      },
      { t: 'analogy', text: 'A boda boda rider gives a student discount **if** the passenger has a student card **and** it is before 6 pm. Two questions, joined by “and”. If either answer is no, no discount.' },
      {
        t: 'try',
        stdin: '17 1',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int age, card;
    cin >> age >> card;
    bool hasCard = (card == 1);
    if (age < 18 && hasCard) {
        cout << "Discount fare" << endl;
    } else {
        cout << "Full fare" << endl;
    }
    return 0;
}
`,
        output: 'Discount fare',
      },
      { t: 'h', text: 'A short way to choose a value: ? :' },
      { t: 'p', text: 'When a decision just picks between **two values**, the conditional operator `? :` is shorter. Read `condition ? value if true : value if false`.' },
      {
        t: 'try',
        stdin: '7',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << (n % 2 == 0 ? "Even" : "Odd") << endl;
    return 0;
}
`,
        output: 'Odd',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints Pass only when the marks are 50 or more. The marks typed in the Input box are 40, so it must print Fail.',
        stdin: '40',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int marks;
    cin >> marks;
    if (marks ___ 50) {
        cout << "Pass" << endl;
    } else {
        cout << "Fail" << endl;
    }
    return 0;
}
`,
        blanks: [{ options: ['>=', '=>', '='], answer: '>=' }],
        output: 'Fail',
      },
      {
        t: 'bug',
        stdin: '3500',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int paid;
    cin >> paid;
    if paid >= 3000 {
        cout << "Here is your rolex" << endl;
    }
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['The condition after if must be inside round brackets ( )', 'There must be an else', 'paid must be a double', 'The number 3000 needs quotes'],
        answer: 0,
        explain: 'In C++ the condition always sits inside round brackets: `if (paid >= 3000)`. The curly brackets `{ }` hold the lines to run.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int paid;
    cin >> paid;
    if (paid >= 3000) {
        cout << "Here is your rolex" << endl;
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
            stdin: '40',
            wrong: prog(String.raw`    int marks;
    cin >> marks;
    if (marks = 50) {
        cout << "Exactly 50" << endl;
    } else {
        cout << "Not 50" << endl;
    }`),
            why: 'One `=` **stores** 50 into marks and the condition is then “true”. The program prints “Exactly 50” for every student, and marks silently became 50. Use `==` to ask a question.',
            right: prog(String.raw`    int marks;
    cin >> marks;
    if (marks == 50) {
        cout << "Exactly 50" << endl;
    } else {
        cout << "Not 50" << endl;
    }`),
          },
          {
            stdin: '15',
            wrong: prog(String.raw`    int age;
    cin >> age;
    if (age > 12 && < 20) {
        cout << "Teenager" << endl;
    }`),
            why: 'Each side of `&&` must be a **complete** question. “< 20” alone is not a question about anything. Write the variable again: `age > 12 && age < 20`.',
            right: prog(String.raw`    int age;
    cin >> age;
    if (age > 12 && age < 20) {
        cout << "Teenager" << endl;
    }`),
          },
          {
            logic: true,
            stdin: '30',
            wrong: prog(String.raw`    int marks;
    cin >> marks;
    if (marks >= 50);
    {
        cout << "Pass" << endl;
    }`),
            why: 'The semicolon straight after the condition ends the `if` with an empty body. The block under it is then always run, so every student “passes”. No semicolon after the closing bracket of `if (...)`.',
            right: prog(String.raw`    int marks;
    cin >> marks;
    if (marks >= 50) {
        cout << "Pass" << endl;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'Which condition is true only when n is between 1 and 10, including both ends?', options: ['n >= 1 && n <= 10', 'n >= 1 || n <= 10', 'n > 1 && n < 10', '1 <= n <= 10'], answer: 0, explain: '`&&` needs both questions to be true. With `||` every number would pass. And `1 <= n <= 10` does not do what you hope in C++.' },
      { t: 'quiz', question: 'Which operator asks “are these two values equal?”', options: ['==', '=', '=>', '!='], answer: 0, explain: '`==` asks the question. A single `=` stores a value, which is a very different job.' },
      {
        t: 'recap',
        items: [
          '`if (condition) { ... } else { ... }` chooses a path. The condition is inside round brackets.',
          'Compare with `==  !=  <  >  <=  >=`. A single `=` stores, it does not ask.',
          '`else if` makes a ladder. Only the **first** true block runs, so put the strictest question first.',
          '`&&` is and, `||` is or, `!` is not. Each side must be a complete question.',
          '`condition ? a : b` picks one of two values.',
        ],
        memory: 'Double equals asks; single equals stores.',
      },
    ],
    exercises: [
      {
        id: 'cpp4-passfail',
        title: 'Pass or fail',
        prompt: 'Read a mark. If it is **50 or more** print `Pass`, otherwise print `Fail`.',
        starter: prog('    // Read marks, print Pass or Fail\n'),
        tests: [
          { input: '65', expected: 'Pass' },
          { input: '49', expected: 'Fail' },
          { input: '50', expected: 'Pass', hidden: true },
          { input: '0', expected: 'Fail', hidden: true },
        ],
        hints: [
          'Read the mark into an `int`, then use `if (marks >= 50)` with an `else`.',
          'Print `Pass` in the `if` block and `Fail` in the `else` block, each with its own `cout << "..." << endl;`.',
          'A similar example: `if (age >= 18) { cout << "Adult" << endl; } else { cout << "Minor" << endl; }`',
        ],
      },
      {
        id: 'cpp4-evenodd',
        title: 'Even or odd',
        prompt: 'Read a whole number. Print `Even` if it divides by 2 with nothing left over, otherwise print `Odd`.',
        starter: prog('    // Read n, print Even or Odd\n'),
        tests: [
          { input: '8', expected: 'Even' },
          { input: '7', expected: 'Odd' },
          { input: '0', expected: 'Even', hidden: true },
          { input: '101', expected: 'Odd', hidden: true },
        ],
        hints: [
          'A number is even when the leftover after dividing by 2 is zero. The leftover operator is `%`.',
          'The condition is `n % 2 == 0`. Remember two equal signs.',
          'A similar example: `if (n % 5 == 0) { cout << "Divisible by 5" << endl; }`',
        ],
      },
      {
        id: 'cpp4-fare',
        title: 'The boda fare',
        prompt: 'A boda rider charges **1000 shillings per kilometre**, but never less than **2000**. Read the distance in kilometres (a whole number) and print the fare like this: `Fare: 2000`',
        starter: prog('    // Read km, work out the fare, print Fare: ...\n'),
        tests: [
          { input: '1', expected: 'Fare: 2000' },
          { input: '5', expected: 'Fare: 5000' },
          { input: '2', expected: 'Fare: 2000', hidden: true },
          { input: '12', expected: 'Fare: 12000', hidden: true },
        ],
        hints: [
          'First work out `km * 1000`. Then check whether it is less than 2000 and, if so, use 2000 instead.',
          'Store the fare in a variable: `int fare = km * 1000;` then `if (fare < 2000) { fare = 2000; }`, then print it.',
          'A similar example: a minimum order of 500: `int cost = items * 100; if (cost < 500) { cost = 500; }`',
        ],
      },
    ],
  },
];
