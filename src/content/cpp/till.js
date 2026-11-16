// C++, Level 2: Decisions and loops. Lesson 9, the project: Mama Rose's till.
import { prog, IO_FMT } from './shared.js';

const LEVEL = 'Level 2: Decisions and loops';

const PIECE1 = String.raw`#include <iostream>
using namespace std;

int main() {
    int item, qty, price, total = 0;
    cin >> item;
    while (item != 0) {
        cin >> qty;
        price = 0;
        switch (item) {
            case 1:
                price = 3000;
                break;
            case 2:
                price = 1000;
                break;
            case 3:
                price = 1500;
                break;
            case 4:
                price = 1000;
                break;
            default:
                cout << "No such item" << endl;
        }
        total += price * qty;
        cin >> item;
    }
    cout << "Total: " << total << endl;
    return 0;
}
`;

const PIECE2 = String.raw`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int item, qty, price, total = 0;
    cin >> item;
    while (item != 0) {
        cin >> qty;
        price = 0;
        bool known = true;
        switch (item) {
            case 1:
                price = 3000;
                cout << setw(10) << "Rolex";
                break;
            case 2:
                price = 1000;
                cout << setw(10) << "Chapati";
                break;
            case 3:
                price = 1500;
                cout << setw(10) << "Soda";
                break;
            case 4:
                price = 1000;
                cout << setw(10) << "Tea";
                break;
            default:
                known = false;
                cout << "No such item" << endl;
        }
        if (known) {
            cout << setw(4) << qty << setw(8) << price * qty << endl;
            total += price * qty;
        }
        cin >> item;
    }
    cout << "Total: " << total << endl;
    return 0;
}
`;

const PIECE3 = String.raw`#include <iostream>
using namespace std;

int main() {
    int item, qty, price, total = 0, paid;
    cin >> item;
    while (item != 0) {
        cin >> qty;
        price = 0;
        switch (item) {
            case 1:
                price = 3000;
                break;
            case 2:
                price = 1000;
                break;
            case 3:
                price = 1500;
                break;
            case 4:
                price = 1000;
                break;
            default:
                cout << "No such item" << endl;
        }
        total += price * qty;
        cin >> item;
    }
    cin >> paid;

    int discount = 0;
    bool bigSpender = total >= 10000;
    if (bigSpender) {
        discount = total / 10;
    }
    int toPay = total - discount;

    cout << "Total: " << total << endl;
    cout << "Discount: " << discount << endl;
    cout << "To pay: " << toPay << endl;
    if (paid >= toPay) {
        cout << "Change: " << paid - toPay << endl;
    } else {
        cout << "Short by: " << toPay - paid << endl;
    }
    return 0;
}
`;

export const projectLessons = [
  // ================================================================== 9
  {
    id: 'cpp-rolex',
    level: LEVEL,
    minutes: 30,
    title: 'Project: Mama Rose’s till',
    summary: 'Put switch, loops, bool and setw together to build a working till with a receipt',
    blocks: [
      {
        t: 'story',
        title: 'Opening day at the stand',
        text: 'The rolex stand is so busy that Mama Rose is tired of adding prices in her head and getting the change wrong. She wants a **till**: it takes each item a customer buys, adds up the total, gives a discount to big spenders, and works out the change.\n\nYou already know everything it needs: variables, `cin`, `switch`, loops, decisions and `bool`. This lesson puts them together **one small piece at a time**.',
      },
      { t: 'h', text: 'Plan first, then code' },
      { t: 'p', text: 'Good programmers write the plan in plain words before they type any C++. This is the plan for the till:' },
      {
        t: 'list',
        items: [
          '1. Repeat: read an item number. Stop when it is 0 (a sentinel).',
          '2. For each item, read how many, look up its price with a `switch`, add to the total.',
          '3. If the total is 10,000 or more, give 10% off.',
          '4. Read the money paid. Print the change, or how much is still missing.',
        ],
      },
      { t: 'p', text: 'The menu is: 1 Rolex 3000, 2 Chapati 1000, 3 Soda 1500, 4 Tea 1000.' },
      { t: 'h', text: 'Piece 1: collecting the items' },
      { t: 'p', text: 'This is a sentinel loop (lesson 7) with a `switch` (lesson 5) inside it. The input is pairs of `item quantity`, ended by a 0: `1 2  2 3  4 1  0` means 2 rolex, 3 chapati and 1 tea. Run it, then try an item number that is not on the menu.' },
      {
        t: 'project',
        title: 'Till piece 1: the total',
        text: 'Change the Input and run it again.',
        stdin: '1 2 2 3 4 1 0',
        code: PIECE1,
        output: 'Total: 10000',
      },
      { t: 'h', text: 'Piece 2: a receipt' },
      { t: 'p', text: 'A real till prints a receipt. Each line shows the item, the quantity and the amount, lined up in columns with `setw` (lesson 8). A `bool` called `known` makes sure an item that is not on the menu prints no receipt line and adds nothing.' },
      {
        t: 'project',
        title: 'Till piece 2: the receipt',
        text: 'Try adding an item number 9 to the input and watch what happens.',
        stdin: '1 2 2 3 4 1 0',
        code: PIECE2,
        output: '     Rolex   2    6000\n   Chapati   3    3000\n       Tea   1    1000\nTotal: 10000',
      },
      { t: 'h', text: 'Piece 3: discount and change' },
      { t: 'p', text: 'Now add the last two steps. A `bool` called `bigSpender` holds the answer to “is the total 10,000 or more?”. Then the money paid is read **after** the zero. If the customer pays too little, the till says how much is missing instead of printing a negative change.' },
      {
        t: 'project',
        title: 'The finished till',
        text: 'The input ends with the amount paid: `1 2  2 3  4 1  0  20000`. Try paying only 5000.',
        stdin: '1 2 2 3 4 1 0 20000',
        code: PIECE3,
        output: 'Total: 10000\nDiscount: 1000\nTo pay: 9000\nChange: 11000',
      },
      {
        t: 'reorder',
        prompt: 'The finished till works out its figures in a particular order. The boxes are already declared in the first block. Put the lines in the right order: the **discount** first, then the **amount to pay**, then **print** it. (Each step needs the one before it.)',
        lines: [
          `${IO_FMT.split('\n')[0]}\nusing namespace std;\n\nint main() {\n    int total = 12000, discount = 0, toPay = 0;`,
          '    discount = total / 10;',
          '    toPay = total - discount;',
          '    cout << toPay << endl;',
          '    return 0;',
          '}',
        ],
        output: '10800',
      },
      { t: 'h', text: 'What you used' },
      {
        t: 'list',
        items: [
          'Lesson 2: variables and `cin` to read the items.',
          'Lesson 4: `if` and `else` for the discount and the change.',
          'Lesson 5: `switch` for the menu and `bool` for yes/no answers.',
          'Lesson 7: a sentinel `while` loop that ends at 0.',
          'Lesson 8: `setw` for tidy columns.',
        ],
      },
      { t: 'tip', text: 'Ideas to try on your own after the exercises: add a fifth menu item, change the discount rule to 15% over 20,000, or print “Thank you, karibu again!” at the end.' },
      { t: 'quiz', question: 'In the finished till, why is the amount paid read AFTER the loop?', options: ['Because the input gives the items first, ended by 0, and then the money paid', 'Because cin cannot read inside a loop', 'Because paid must be a double', 'Because the switch needs it'], answer: 0, explain: 'The input format is: item and quantity pairs, then the sentinel 0, then the amount paid. The program must read the values in the same order they are typed.' },
      {
        t: 'recap',
        items: [
          'Write the plan in words first, then build the program one piece at a time.',
          'A sentinel loop reads items until a special value (0) appears.',
          '`switch` turns an item number into a price. `bool` names a yes/no answer such as `bigSpender`.',
          '`setw` lines up the columns of a receipt.',
          'Read the input in exactly the order it is typed.',
        ],
        memory: 'Plan, piece, test, repeat.',
      },
    ],
    exercises: [
      {
        id: 'cpp9-till',
        title: 'Build the till',
        prompt: 'Build Mama Rose’s till. The input is `item qty` pairs, then `0`, then the amount paid.\n\nMenu: 1 Rolex 3000, 2 Chapati 1000, 3 Soda 1500, 4 Tea 1000. For an item number not on the menu, print `No such item` and add nothing.\n\nAfter the loop print these lines. The discount is 10% of the total when the total is **10000 or more**, otherwise 0.\n\n`Total: ...`\n`Discount: ...`\n`To pay: ...`\n\nThen, if the money paid covers the amount to pay, print `Change: ...`, otherwise print `Short by: ...` (how much more is needed).',
        starter: prog('    // Read items until 0, then read the money paid\n'),
        tests: [
          { input: '1 2 2 3 4 1 0 20000', expected: 'Total: 10000\nDiscount: 1000\nTo pay: 9000\nChange: 11000' },
          { input: '2 3 0 5000', expected: 'Total: 3000\nDiscount: 0\nTo pay: 3000\nChange: 2000' },
          { input: '1 1 0 2000', expected: 'Total: 3000\nDiscount: 0\nTo pay: 3000\nShort by: 1000' },
          { input: '9 2 1 1 0 5000', expected: 'No such item\nTotal: 3000\nDiscount: 0\nTo pay: 3000\nChange: 2000', hidden: true },
          { input: '0 0', expected: 'Total: 0\nDiscount: 0\nTo pay: 0\nChange: 0', hidden: true },
          { input: '1 4 0 12000', expected: 'Total: 12000\nDiscount: 1200\nTo pay: 10800\nChange: 1200', hidden: true },
        ],
        hints: [
          'Follow the three pieces from the lesson: a sentinel `while` loop with a `switch` inside, then the discount, then the change.',
          'After the loop, read `paid`. Then `if (total >= 10000) { discount = total / 10; }`, and `toPay = total - discount`.',
          'For the last step: `if (paid >= toPay)` print the change `paid - toPay`, `else` print `Short by: ` and `toPay - paid`.',
        ],
      },
      {
        id: 'cpp9-daily',
        title: 'The day’s sales',
        prompt: 'At closing time Mama Rose reads the day’s sales. The input is the **number of sales n**, then n amounts. Print the total, the highest sale and the average with two decimals, like this:\n\n`Total: 12000`\n`Highest: 5000`\n`Average: 4000.00`\n\n(n is at least 1.)',
        starter: prog('    // Read n, then n sales. Print Total, Highest and Average\n', IO_FMT),
        tests: [
          { input: '3 3000 5000 4000', expected: 'Total: 12000\nHighest: 5000\nAverage: 4000.00' },
          { input: '4 1000 2500 500 2000', expected: 'Total: 6000\nHighest: 2500\nAverage: 1500.00' },
          { input: '1 7000', expected: 'Total: 7000\nHighest: 7000\nAverage: 7000.00', hidden: true },
          { input: '3 1000 1000 2000', expected: 'Total: 4000\nHighest: 2000\nAverage: 1333.33', hidden: true },
        ],
        hints: [
          'Use a `for` loop that runs n times. Inside, read one amount, add it to `total`, and compare it with `highest`.',
          'Set `highest = amount;` when `i == 1` (the first sale) or when `amount > highest`. That way you never compare against a made-up starting value.',
          'The average must keep its decimals: `(double)total / n`. Print with `cout << fixed << setprecision(2);` before it.',
        ],
      },
    ],
  },
];
