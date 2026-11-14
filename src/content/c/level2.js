// C, Level 2: Decisions and loops. Lessons 5 and 6 (decisions, logic). Loops are still in legacy.js.
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog } from './shared.js';

const LEVEL = 'Level 2: Decisions and loops';

export const level2 = [
  // ================================================================== 5
  {
    id: 'c-decisions',
    level: LEVEL,
    minutes: 20,
    title: 'Making decisions',
    summary: 'if, else, else if, comparisons and the remainder operator',
    blocks: [
      {
        t: 'story',
        title: 'The guard at the gate',
        text: 'The guard at the campus gate does not think much. He looks at your card. If it is a student card, he lets you in. Otherwise he sends you to the office.\n\nEvery program that is any use does the same thing: it looks at a value and picks one path. In C that job belongs to `if` and `else`.',
      },
      { t: 'p', text: 'The condition goes in round brackets. The code to run goes in curly brackets. Press **Run**, then change the mark in the input box and run it again.' },
      {
        t: 'try',
        stdin: '65',
        code: String.raw`#include <stdio.h>

int main() {
    int marks;
    scanf("%d", &marks);
    if (marks >= 50) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }
    return 0;
}
`,
        output: 'Pass',
      },
      { t: 'analogy', text: 'Think of a fork in the road. The condition is the signpost. If it says “true”, you take the `if` road. If it says “false”, you take the `else` road. You never walk both, and after the fork both roads meet again.' },
      { t: 'h', text: 'Comparisons' },
      {
        t: 'list',
        items: [
          '`==` equal to, `!=` not equal to',
          '`<` less than, `>` greater than',
          '`<=` less than or equal to, `>=` greater than or equal to',
          'A comparison is either true or false. That is all `if` needs.',
        ],
      },
      {
        t: 'predict',
        code: prog(String.raw`    int stock = 12;
    if (stock < 10) {
        printf("Order more\n");
    } else {
        printf("Enough\n");
    }`),
        question: 'What does this program print?',
        options: ['Enough', 'Order more', 'Enough\nOrder more', 'Nothing'],
        answer: 0,
        explain: '12 is not less than 10, so the condition is false and the computer takes the `else` road. Only one of the two roads is ever walked.',
      },
      { t: 'h', text: 'Many roads: else if' },
      { t: 'p', text: 'When there are more than two choices, chain them with `else if`. The computer checks them from the top, and the **first true one wins**. The rest are skipped.' },
      {
        t: 'try',
        stdin: '5',
        code: String.raw`#include <stdio.h>

int main() {
    int gb;
    scanf("%d", &gb);
    if (gb >= 10) {
        printf("Large bundle\n");
    } else if (gb >= 3) {
        printf("Medium bundle\n");
    } else {
        printf("Small bundle\n");
    }
    return 0;
}
`,
        output: 'Medium bundle',
      },
      { t: 'p', text: 'Because the first true one wins, **the order matters**. Look at this one carefully.' },
      {
        t: 'predict',
        code: prog(String.raw`    int marks = 85;
    if (marks >= 50) {
        printf("Pass\n");
    } else if (marks >= 80) {
        printf("Distinction\n");
    }`),
        question: 'A student has 85 marks. What does this program print?',
        options: ['Distinction', 'Pass', 'Pass\nDistinction', 'Nothing'],
        answer: 1,
        explain: '85 is at least 50, so the first condition is true and the computer stops there. The `else if` for 80 is never looked at. Always put the **strictest** check first.',
      },
      { t: 'h', text: 'The remainder operator in decisions' },
      { t: 'p', text: '`%` gives what is left over after dividing. A number is a multiple of 5 when `n % 5 == 0`. Even numbers leave 0 when divided by 2. The ATM below only has 10,000 notes, so it can only pay out multiples of 10,000.' },
      {
        t: 'try',
        stdin: '30000',
        code: String.raw`#include <stdio.h>

int main() {
    int amount;
    scanf("%d", &amount);
    if (amount % 10000 == 0) {
        printf("The ATM can pay this\n");
    } else {
        printf("Choose another amount\n");
    }
    return 0;
}
`,
        output: 'The ATM can pay this',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints the message only when marks is exactly 50.',
        template: prog(String.raw`    int marks = 50;
    if (marks ___ 50) {
        printf("Exactly fifty\n");
    }`),
        blanks: [{ options: ['==', '!=', '<'], answer: '==' }],
        output: 'Exactly fifty',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int marks = 40;
    if (marks >= 50) {
        printf("Pass\n");
    } else (marks < 50) {
        printf("Fail\n");
    }`),
        question: 'This program refuses to run (“Parsing Failure”). What is wrong?',
        options: ['`else` never takes a condition in brackets', 'The word Fail must be in capitals', 'marks must be declared as float', 'There must be a semicolon after the `if` line'],
        answer: 0,
        explain: '`else` means “in every other case”, so it has no condition. If you want another test, write `else if (...)`. If you want the leftover case, write plain `else`.',
        fixed: prog(String.raw`    int marks = 40;
    if (marks >= 50) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int marks = 60;
    if marks >= 50 {
        printf("Pass\n");
    }`),
            why: 'The condition must be inside round brackets: `if (marks >= 50)`. Without them C cannot read the line.',
            right: prog(String.raw`    int marks = 60;
    if (marks >= 50) {
        printf("Pass\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int marks = 40;
    if (marks = 50) {
        printf("Pass\n");
    }`),
            why: 'A single `=` **stores** 50 into marks, and 50 counts as true, so this prints Pass for everybody and even changes marks. To compare, write two: `==`. This is the most famous C mistake.',
            right: prog(String.raw`    int marks = 40;
    if (marks == 50) {
        printf("Pass\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int marks = 40;
    if (marks >= 50);
    {
        printf("Pass\n");
    }`),
            why: 'The semicolon after the brackets ends the `if` right there with an empty body. The curly brackets then always run, so 40 marks prints Pass. Never put `;` straight after `if (...)`.',
            right: prog(String.raw`    int marks = 40;
    if (marks >= 50) {
        printf("Pass\n");
    }`),
          },
        ],
      },
      {
        t: 'quiz',
        question: 'A mark of 80 or more is an A, 70 or more is a B, anything else is a C. In which order should the checks be written?',
        options: ['`>= 80` first, then `>= 70`, then `else`', '`>= 70` first, then `>= 80`, then `else`', 'Any order works the same', '`else` first'],
        answer: 0,
        explain: 'Start with the strictest check. If `>= 70` came first, a mark of 90 would be caught by it and wrongly become a B.',
      },
      {
        t: 'project',
        title: 'The Campus Duuka (step 2): the discount',
        text: 'Customers who spend 50,000 shillings or more get 10% off. Try 60000 and then 20000 in the input box.',
        stdin: '60000',
        code: String.raw`#include <stdio.h>

int main() {
    int total, discount = 0, pay;
    scanf("%d", &total);
    if (total >= 50000) {
        discount = total / 10;
    }
    pay = total - discount;
    printf("Total: %d\n", total);
    printf("Discount: %d\n", discount);
    printf("Pay: %d\n", pay);
    return 0;
}
`,
        output: 'Total: 60000\nDiscount: 6000\nPay: 54000',
      },
      {
        t: 'recap',
        items: ['`if (condition) { ... } else { ... }` picks one road.', 'Compare with `==`, `!=`, `<`, `>`, `<=`, `>=`. One `=` stores, two `==` compare.', 'In an `else if` chain the first true condition wins, so put the strictest first.', '`n % 2 == 0` tests for even, `n % 5 == 0` for a multiple of 5.'],
        memory: 'One equals stores, two equals compare.',
      },
    ],
    exercises: [
      {
        id: 'c3-passfail',
        title: 'Pass or fail',
        prompt: 'Read a mark. Print `Pass` if it is 50 or more, otherwise print `Fail`.',
        starter: prog('    int marks;\n    // Read the mark and decide\n'),
        sampleInput: '75',
        usesInput: true,
        tests: [
          { input: '75', expected: 'Pass' },
          { input: '49', expected: 'Fail' },
          { input: '50', expected: 'Pass', name: 'Exactly 50' },
        ],
        hints: [
          'You need an `if` with the condition `marks >= 50` and an `else`.',
          'Read with `scanf("%d", &marks);` then `if (marks >= 50) { ... } else { ... }`.',
          'A similar example: `if (age >= 18) { printf("Adult\\n"); } else { printf("Minor\\n"); }`',
        ],
      },
      {
        id: 'c3-evenodd',
        title: 'Even or odd',
        prompt: 'Read a whole number. Print `Even` if it is even, otherwise print `Odd`.',
        starter: prog('    int n;\n    // Read n and decide\n'),
        sampleInput: '7',
        usesInput: true,
        tests: [
          { input: '4', expected: 'Even' },
          { input: '7', expected: 'Odd' },
          { input: '0', expected: 'Even', name: 'Zero' },
          { input: '-3', expected: 'Odd', hidden: true },
        ],
        hints: [
          'An even number leaves a remainder of 0 when divided by 2. The remainder operator is `%`.',
          'Check `n % 2 == 0`. Careful: use two equals signs to compare.',
          'A similar example: `if (n % 5 == 0) { printf("Multiple of 5\\n"); }` Use the same idea with 2.',
        ],
      },
      {
        id: 'c3-sign',
        title: 'Positive, negative or zero',
        prompt: 'Read a whole number. Print `Positive`, `Negative` or `Zero`.',
        starter: prog('    int n;\n    // Read n and decide\n'),
        sampleInput: '-4',
        usesInput: true,
        tests: [
          { input: '8', expected: 'Positive' },
          { input: '-4', expected: 'Negative' },
          { input: '0', expected: 'Zero' },
          { input: '1', expected: 'Positive', hidden: true },
        ],
        hints: [
          'There are three outcomes, so you need `if`, `else if` and `else`.',
          'Test `n > 0` first, then `n < 0`. Whatever is left must be zero, so that can be the plain `else`.',
          'A similar example: `if (t > 30) { printf("Hot\\n"); } else if (t < 15) { printf("Cold\\n"); } else { printf("Fine\\n"); }`',
        ],
      },
      {
        id: 'c3-grade',
        title: 'Grade',
        prompt: 'Read a mark and print its grade like `Grade: B`.\n\n80 or more is A, 70 to 79 is B, 60 to 69 is C, 50 to 59 is D, below 50 is F.',
        starter: prog('    int marks;\n    // Read the mark and print the grade\n'),
        sampleInput: '72',
        usesInput: true,
        tests: [
          { input: '85', expected: 'Grade: A' },
          { input: '72', expected: 'Grade: B' },
          { input: '61', expected: 'Grade: C' },
          { input: '50', expected: 'Grade: D' },
          { input: '30', expected: 'Grade: F' },
          { input: '80', expected: 'Grade: A', name: 'Exactly 80', hidden: true },
        ],
        hints: [
          'Use a chain: `if`, then `else if` for each grade, then a final `else` for F.',
          'Check from the highest grade down: `if (marks >= 80)`, `else if (marks >= 70)`, and so on. Because the checks run in order, you only need `>=`.',
          'A similar example: `if (km >= 100) { printf("Far\\n"); } else if (km >= 10) { printf("Medium\\n"); } else { printf("Near\\n"); }`',
        ],
      },
    ],
  },

  // ================================================================== 6
  {
    id: 'c-logic',
    level: LEVEL,
    minutes: 22,
    title: 'Combining conditions, switch and ?:',
    summary: '&&, || and !, the switch statement and the short ?: decision',
    blocks: [
      {
        t: 'story',
        title: 'Mama Rose’s rolex stand',
        text: 'Mama Rose has two rules. “Students get a discount, **but only if** they show their ID.” And, “You get a free chilli sauce if you are a regular customer **or** you buy three rolex.”\n\nSee the words **but only if** and **or**? Real decisions combine several small questions. C has three little words for that: `&&`, `||` and `!`.',
      },
      {
        t: 'list',
        items: [
          '`&&` means **and**. Both sides must be true.',
          '`||` means **or**. At least one side must be true.',
          '`!` means **not**. It flips true to false and false to true.',
        ],
      },
      {
        t: 'try',
        stdin: '20 1',
        code: String.raw`#include <stdio.h>

int main() {
    int age, hasId;
    scanf("%d %d", &age, &hasId);
    if (age >= 18 && hasId == 1) {
        printf("Allowed in\n");
    } else {
        printf("Not allowed\n");
    }
    return 0;
}
`,
        output: 'Allowed in',
      },
      { t: 'tip', text: 'Try the input `20 0` and `15 1`. With `&&` **both** must be true, so either one failing is enough to send you down the `else` road.' },
      {
        t: 'predict',
        code: prog(String.raw`    int x = 10;
    if (!(x > 5)) {
        printf("small\n");
    } else {
        printf("big\n");
    }`),
        question: 'What does this print?',
        options: ['big', 'small', 'big\nsmall', 'Nothing'],
        answer: 0,
        explain: '`x > 5` is true. The `!` flips it to false, so the `if` road is skipped and the `else` road prints big.',
      },
      { t: 'h', text: 'Checking a range' },
      { t: 'p', text: 'To check that a value lies **between** two limits, write both comparisons and join them with `&&`. A mark must be from 0 to 100:' },
      {
        t: 'try',
        stdin: '105',
        code: String.raw`#include <stdio.h>

int main() {
    int marks;
    scanf("%d", &marks);
    if (marks >= 0 && marks <= 100) {
        printf("Valid mark\n");
    } else {
        printf("Invalid mark\n");
    }
    return 0;
}
`,
        output: 'Invalid mark',
      },
      {
        t: 'fill',
        prompt: 'Take a jacket if it is raining **or** it is cold. It is not raining but it is cold. Fill the gap.',
        template: prog(String.raw`    int rain = 0;
    int cold = 1;
    if (rain ___ cold) {
        printf("Take a jacket\n");
    }`),
        blanks: [{ options: ['||', '&&', '=='], answer: '||' }],
        output: 'Take a jacket',
      },
      { t: 'h', text: 'switch: choosing from a menu' },
      { t: 'p', text: 'When one variable can have several exact values, a long `else if` chain gets tiring. `switch` is made for menus. Each `case` is one choice, `break` leaves the switch, and `default` catches everything else. This is the shape of a Mobile Money menu.' },
      {
        t: 'try',
        stdin: '2',
        code: String.raw`#include <stdio.h>

int main() {
    int choice;
    scanf("%d", &choice);
    switch (choice) {
        case 1:
            printf("Send money\n");
            break;
        case 2:
            printf("Check balance\n");
            break;
        case 3:
            printf("Buy airtime\n");
            break;
        default:
            printf("Invalid choice\n");
    }
    return 0;
}
`,
        output: 'Check balance',
      },
      { t: 'p', text: 'Now see what happens when `break` is forgotten. The computer jumps to the matching `case` and then keeps running **downwards** through the next ones until it meets a `break` or the end.' },
      {
        t: 'predict',
        code: prog(String.raw`    int choice = 1;
    switch (choice) {
        case 1:
            printf("Send money\n");
        case 2:
            printf("Check balance\n");
        default:
            printf("Invalid choice\n");
    }`),
        question: 'There is no `break` anywhere. What does this program print?',
        options: ['Send money', 'Send money\nCheck balance\nInvalid choice', 'Send money\nCheck balance', 'Invalid choice'],
        answer: 1,
        explain: 'It lands on `case 1`, prints, and falls through into `case 2` and then `default` because nothing stops it. Almost always you want a `break` at the end of every case.',
      },
      { t: 'h', text: 'The short decision: ?:' },
      { t: 'p', text: '`condition ? value1 : value2` is a tiny `if` that produces a value. If the condition is true you get `value1`, otherwise `value2`. It is handy when you just need to pick a number.' },
      {
        t: 'try',
        stdin: '9',
        code: String.raw`#include <stdio.h>

int main() {
    int age, fee;
    scanf("%d", &age);
    fee = age < 12 ? 500 : 1000;
    printf("Fee: %d\n", fee);
    return 0;
}
`,
        output: 'Fee: 500',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int age = 20;
    int hasId = 1;
    if (age >= 18 and hasId == 1) {
        printf("Allowed in\n");
    }`),
        question: 'This program refuses to run. What is wrong?',
        options: ['C has no word `and`: you must write `&&`', 'hasId must be a char', 'The `if` needs an `else`', 'Numbers cannot be compared'],
        answer: 0,
        explain: 'In C the “and” operator is the two symbols `&&` and “or” is `||`. Words like `and` and `or` mean nothing to the computer.',
        fixed: prog(String.raw`    int age = 20;
    int hasId = 1;
    if (age >= 18 && hasId == 1) {
        printf("Allowed in\n");
    }`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int marks = 150;
    if (0 <= marks <= 100) {
        printf("Valid mark\n");
    } else {
        printf("Invalid mark\n");
    }`),
            why: 'Maths allows `0 <= marks <= 100` but C does not read it that way. `0 <= marks` becomes 1 (true), and then `1 <= 100` is true, so even 150 is called valid. Write each comparison and join them: `marks >= 0 && marks <= 100`.',
            right: prog(String.raw`    int marks = 150;
    if (marks >= 0 && marks <= 100) {
        printf("Valid mark\n");
    } else {
        printf("Invalid mark\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int choice = 1;
    switch (choice) {
        case 1:
            printf("Send money\n");
        case 2:
            printf("Check balance\n");
    }`),
            why: 'No `break`, so choice 1 also prints the text for choice 2. Put `break;` at the end of each case.',
            right: prog(String.raw`    int choice = 1;
    switch (choice) {
        case 1:
            printf("Send money\n");
            break;
        case 2:
            printf("Check balance\n");
            break;
    }`),
          },
          {
            wrong: prog(String.raw`    char grade = 'A';
    switch (grade) {
        case A:
            printf("Excellent\n");
            break;
    }`),
            why: 'A character in a `case` needs single quotes: `case \'A\'`. Without them C looks for a variable called A and cannot find it.',
            right: prog(String.raw`    char grade = 'A';
    switch (grade) {
        case 'A':
            printf("Excellent\n");
            break;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'When is `a > 0 || b > 0` true?', options: ['When at least one of a and b is positive', 'Only when both are positive', 'Only when neither is positive', 'Never'], answer: 0, explain: '`||` means or. It is false only when **both** sides are false.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 3): the menu',
        text: 'The duuka sells three things. The customer types the item number and how many they want. Try `1 4` and `3 2`.',
        stdin: '2 3',
        code: String.raw`#include <stdio.h>

int main() {
    int item, qty, price = 0;
    scanf("%d %d", &item, &qty);
    switch (item) {
        case 1:
            printf("Mandazi\n");
            price = 500;
            break;
        case 2:
            printf("Tea\n");
            price = 1000;
            break;
        case 3:
            printf("Rolex\n");
            price = 2500;
            break;
        default:
            printf("No such item\n");
    }
    printf("Total: %d\n", price * qty);
    return 0;
}
`,
        output: 'Tea\nTotal: 3000',
      },
      {
        t: 'recap',
        items: ['`&&` and, `||` or, `!` not. Join comparisons; never chain them like maths (`0 <= x <= 100`).', '`switch` picks one `case` for exact values. End every case with `break`, and add a `default`.', '`condition ? a : b` picks a value in one line.'],
        memory: 'Both for and, either for or, break to stop.',
      },
    ],
    exercises: [
      {
        id: 'c6-leap',
        title: 'Leap year',
        prompt: 'Read a year. A year is a leap year if it divides by 4, **except** years that divide by 100, unless they also divide by 400.\n\nPrint `Leap year` or `Not a leap year`.',
        starter: prog('    int y;\n    // Read y and decide\n'),
        sampleInput: '2024',
        usesInput: true,
        tests: [
          { input: '2024', expected: 'Leap year' },
          { input: '2023', expected: 'Not a leap year' },
          { input: '1900', expected: 'Not a leap year', name: 'Divides by 100 only' },
          { input: '2000', expected: 'Leap year', name: 'Divides by 400', hidden: true },
        ],
        hints: [
          'You need to combine conditions with `&&` and `||`. Think: (divides by 4 **and** not by 100) **or** divides by 400.',
          'Write `y % 4 == 0 && y % 100 != 0` in one bracket, then `||` and `y % 400 == 0`. Put the whole thing inside the `if (...)`.',
          'A similar example: `if ((n % 3 == 0 && n % 2 != 0) || n == 0)` is true for odd multiples of 3, or zero.',
        ],
      },
      {
        id: 'c6-day',
        title: 'Day of the week',
        prompt: 'Read a number from 1 to 7 and print the day: 1 is `Monday` and 7 is `Sunday`. Any other number prints `Invalid day`. Use `switch`.',
        starter: prog('    int day;\n    // Read day and print its name\n'),
        sampleInput: '3',
        usesInput: true,
        tests: [
          { input: '1', expected: 'Monday' },
          { input: '3', expected: 'Wednesday' },
          { input: '7', expected: 'Sunday' },
          { input: '8', expected: 'Invalid day' },
          { input: '0', expected: 'Invalid day', hidden: true },
          { input: '5', expected: 'Friday', hidden: true },
        ],
        hints: [
          'A `switch` on `day` with one `case` for each number from 1 to 7 and a `default` for the rest.',
          'Each case prints one name and ends with `break;`. The names are Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.',
          'A similar example: `switch (n) { case 1: printf("One\\n"); break; case 2: printf("Two\\n"); break; default: printf("Many\\n"); }`',
        ],
      },
      {
        id: 'c6-bigger',
        title: 'The bigger number',
        prompt: 'Read two whole numbers and print the bigger one like this: `Bigger: 9`. If they are equal, print that number.',
        starter: prog('    int a, b;\n    // Read a and b and print the bigger one\n'),
        sampleInput: '4 9',
        usesInput: true,
        tests: [
          { input: '4 9', expected: 'Bigger: 9' },
          { input: '12 3', expected: 'Bigger: 12' },
          { input: '5 5', expected: 'Bigger: 5', name: 'Equal' },
          { input: '-2 -7', expected: 'Bigger: -2', hidden: true },
        ],
        hints: [
          'Compare `a` and `b`. You can use `if`/`else`, or the short form `a > b ? a : b`.',
          'Store the answer in a variable, for example `big = a > b ? a : b;`, then print it with `printf("Bigger: %d\\n", big);`.',
          'A similar example: `cheap = p1 < p2 ? p1 : p2;` picks the smaller of two prices.',
        ],
      },
    ],
  },
];
