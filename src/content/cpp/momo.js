// C++, Level 3: Functions. Lesson 13, the project: a Mobile Money kiosk.
import { prog, progFn } from './shared.js';

const LEVEL = 'Level 3: Functions';

const FEE = String.raw`int withdrawFee(int amount) {
    if (amount <= 10000) {
        return 300;
    } else if (amount <= 50000) {
        return 700;
    }
    return 1500;
}`;

const PIECE1 = String.raw`#include <iostream>
using namespace std;

int withdrawFee(int amount) {
    if (amount <= 10000) {
        return 300;
    } else if (amount <= 50000) {
        return 700;
    }
    return 1500;
}

int main() {
    int amount;
    cin >> amount;
    while (amount != 0) {
        cout << amount << " costs " << withdrawFee(amount) << " to withdraw" << endl;
        cin >> amount;
    }
    return 0;
}
`;

const PIECE2 = String.raw`#include <iostream>
using namespace std;

int withdrawFee(int amount) {
    if (amount <= 10000) {
        return 300;
    } else if (amount <= 50000) {
        return 700;
    }
    return 1500;
}

void showBalance(int balance) {
    cout << "Balance: " << balance << endl;
}

int main() {
    int balance, command, amount, fee;
    cin >> balance;
    cin >> command;
    while (command != 0) {
        switch (command) {
            case 1:
                cin >> amount;
                balance += amount;
                cout << "Deposited: " << amount << endl;
                break;
            case 2:
                cin >> amount;
                fee = withdrawFee(amount);
                if (amount + fee <= balance) {
                    balance -= amount + fee;
                    cout << "Withdrew: " << amount << " (fee " << fee << ")" << endl;
                } else {
                    cout << "Insufficient funds" << endl;
                }
                break;
            case 3:
                showBalance(balance);
                break;
            default:
                cout << "Unknown command" << endl;
        }
        cin >> command;
    }
    cout << "Goodbye" << endl;
    return 0;
}
`;

const PIECE3 = String.raw`#include <iostream>
using namespace std;

int transactions = 0;

int withdrawFee(int amount) {
    if (amount <= 10000) {
        return 300;
    } else if (amount <= 50000) {
        return 700;
    }
    return 1500;
}

void showBalance(int balance) {
    cout << "Balance: " << balance << endl;
}

int main() {
    int balance, command, amount, fee;
    cin >> balance;
    cin >> command;
    while (command != 0) {
        switch (command) {
            case 1:
                cin >> amount;
                balance += amount;
                transactions++;
                cout << "Deposited: " << amount << endl;
                break;
            case 2:
                cin >> amount;
                fee = withdrawFee(amount);
                if (amount + fee <= balance) {
                    balance -= amount + fee;
                    transactions++;
                    cout << "Withdrew: " << amount << " (fee " << fee << ")" << endl;
                } else {
                    cout << "Insufficient funds" << endl;
                }
                break;
            case 3:
                showBalance(balance);
                break;
            default:
                cout << "Unknown command" << endl;
        }
        cin >> command;
    }
    cout << "Goodbye" << endl;
    cout << "Transactions: " << transactions << endl;
    return 0;
}
`;

export const momoLessons = [
  // ================================================================== 13
  {
    id: 'cpp-momo',
    level: LEVEL,
    minutes: 32,
    title: 'Project: the Mobile Money kiosk',
    summary: 'Build a wallet program from small functions: fees, deposits, withdrawals, balance and a transaction count',
    blocks: [
      {
        t: 'story',
        title: 'The kiosk next door',
        text: 'Mama Rose’s cousin Peter runs a **mobile money kiosk** next to the rolex stand. People come to deposit, to withdraw and to check their balance, and Peter keeps getting the withdrawal fees wrong when it is busy. He wants a program to do the thinking.\n\nThis time you will not write one long `main`. You will build the program from **small functions that each do one job**, the way real software is built.',
      },
      { t: 'h', text: 'Plan first' },
      {
        t: 'list',
        items: [
          '1. A function `withdrawFee(amount)` that works out the fee: up to 10,000 costs 300, up to 50,000 costs 700, anything above costs 1,500.',
          '2. A function `showBalance(balance)` that prints the balance.',
          '3. A loop that reads commands: 1 deposit, 2 withdraw, 3 balance, 0 stop. A `switch` picks the job.',
          '4. A withdrawal works only if the balance covers the amount **plus** the fee.',
          '5. A global counter for the transactions that succeeded.',
        ],
      },
      { t: 'h', text: 'Piece 1: the fee function' },
      { t: 'p', text: 'Always build and test the smallest piece first. Here the fee function is tested alone with a sentinel loop. Run it, then try amounts around the limits, such as 10000 and 10001.' },
      {
        t: 'project',
        title: 'Kiosk piece 1: the fee function',
        text: 'The input is amounts ended by 0.',
        stdin: '5000 10000 25000 80000 0',
        code: PIECE1,
        output: '5000 costs 300 to withdraw\n10000 costs 300 to withdraw\n25000 costs 700 to withdraw\n80000 costs 1500 to withdraw',
      },
      { t: 'tip', text: 'Notice the shape of `withdrawFee`: each `if` that matches ends the function with `return`, so the checks never overlap. The last `return 1500;` handles everything bigger.' },
      { t: 'h', text: 'Piece 2: the wallet loop' },
      { t: 'p', text: 'Now the kiosk itself. The first number is the starting balance. After that come commands: `1 5000` is a deposit of 5000, `2 10000` is a withdrawal of 10000, `3` shows the balance and `0` ends. Everything that is not 0 to 3 is reported as unknown. A withdrawal is checked with `amount + fee <= balance` before any money moves.' },
      {
        t: 'project',
        title: 'Kiosk piece 2: deposits, withdrawals and balance',
        text: 'Try withdrawing more than the balance, and an unknown command such as 7.',
        stdin: '20000 1 5000 2 10000 3 2 50000 7 0',
        code: PIECE2,
        output: 'Deposited: 5000\nWithdrew: 10000 (fee 300)\nBalance: 14700\nInsufficient funds\nUnknown command\nGoodbye',
      },
      { t: 'h', text: 'Piece 3: counting transactions' },
      { t: 'p', text: 'Peter also wants to know how many transactions **succeeded**. That number belongs to the whole program, so it is a **global** variable (lesson 11). It goes up after every successful deposit and withdrawal, but not after a refused withdrawal.' },
      {
        t: 'project',
        title: 'The finished kiosk',
        text: 'Compare the last line with piece 2. A refused withdrawal does not count.',
        stdin: '20000 1 5000 2 10000 3 2 50000 7 0',
        code: PIECE3,
        output: 'Deposited: 5000\nWithdrew: 10000 (fee 300)\nBalance: 14700\nInsufficient funds\nUnknown command\nGoodbye\nTransactions: 2',
      },
      { t: 'h', text: 'What you used' },
      {
        t: 'list',
        items: [
          'Lesson 10: functions with parameters and return values (`withdrawFee`, `showBalance`).',
          'Lesson 11: a global counter that every part of the program can reach.',
          'Lesson 5: `switch` to pick the command, with `default` for unknown ones.',
          'Lesson 7: a sentinel `while` loop that ends at 0.',
          'Lesson 4: `if` and `else if` for the fee bands and the balance check.',
        ],
      },
      { t: 'tip', text: 'Why functions help: when Peter changes the fee bands, you change `withdrawFee` in **one place**. The wallet loop does not change at all. Small functions with one job each are easier to test, to read and to fix.' },
      { t: 'quiz', question: 'Why does the withdrawal check `amount + fee <= balance` and not just `amount <= balance`?', options: ['The customer must also be able to pay the fee', 'The fee is added to the deposit', 'A switch cannot compare numbers', 'To make the number bigger'], answer: 0, explain: 'The fee is taken from the same balance as the amount. If only the amount were checked, the balance could go below zero after the fee is charged.' },
      {
        t: 'recap',
        items: [
          'Break a program into small functions that each do one job, and test each piece alone first.',
          'A fee function with `if` / `else if` and several `return`s is easy to read and to change.',
          'A global variable suits something the whole program shares, like a transaction count.',
          'Check that an action is possible (enough money) **before** changing anything.',
          'Read the input in exactly the order it is typed.',
        ],
        memory: 'One function, one job.',
      },
    ],
    exercises: [
      {
        id: 'cpp13-fee',
        title: 'The fee function',
        prompt: 'Write `int withdrawFee(int amount)`: up to **10000** costs **300**, up to **50000** costs **700**, anything above costs **1500**. Read an amount and print: `Fee: 300`.',
        starter: progFn(String.raw`// Write withdrawFee here, above main
`, String.raw`    // Read amount, print Fee: ...`),
        tests: [
          { input: '5000', expected: 'Fee: 300' },
          { input: '25000', expected: 'Fee: 700' },
          { input: '80000', expected: 'Fee: 1500' },
          { input: '10000', expected: 'Fee: 300', hidden: true },
          { input: '10001', expected: 'Fee: 700', hidden: true },
          { input: '50000', expected: 'Fee: 700', hidden: true },
          { input: '50001', expected: 'Fee: 1500', hidden: true },
        ],
        hints: [
          'Check the smallest band first: `if (amount <= 10000) { return 300; }`.',
          'Then `else if (amount <= 50000) { return 700; }`, and finish with `return 1500;` for everything bigger.',
          'The limits themselves belong to the lower band, so use `<=`, not `<`.',
        ],
      },
      {
        id: 'cpp13-wallet',
        title: 'Build the kiosk',
        prompt: 'Build the Mobile Money kiosk. The input is the starting **balance**, then commands, ended by `0`:\n\n* `1 amount` deposit: add it and print `Deposited: amount`\n* `2 amount` withdraw: the fee is 300 up to 10000, 700 up to 50000, otherwise 1500. If `amount + fee` is **more than the balance** print `Insufficient funds`, otherwise take it out and print `Withdrew: amount (fee f)`\n* `3` print `Balance: b`\n* any other command: print `Unknown command`\n\nWhen `0` is read print `Goodbye`, then `Transactions: n` (the number of **successful** deposits and withdrawals). Use functions and a global counter.',
        starter: progFn(String.raw`// Globals and functions go here, above main
`, String.raw`    // Read the balance, then commands until 0`),
        tests: [
          { input: '20000 1 5000 2 10000 3 2 50000 7 0', expected: 'Deposited: 5000\nWithdrew: 10000 (fee 300)\nBalance: 14700\nInsufficient funds\nUnknown command\nGoodbye\nTransactions: 2' },
          { input: '100000 2 60000 3 0', expected: 'Withdrew: 60000 (fee 1500)\nBalance: 38500\nGoodbye\nTransactions: 1' },
          { input: '1000 2 1000 0', expected: 'Insufficient funds\nGoodbye\nTransactions: 0', hidden: true },
          { input: '0 5 0', expected: 'Unknown command\nGoodbye\nTransactions: 0', hidden: true },
          { input: '5000 2 4700 3 0', expected: 'Withdrew: 4700 (fee 300)\nBalance: 0\nGoodbye\nTransactions: 1', hidden: true },
          { input: '300 1 200 1 300 3 0', expected: 'Deposited: 200\nDeposited: 300\nBalance: 800\nGoodbye\nTransactions: 2', hidden: true },
        ],
        hints: [
          'Follow the three pieces from the lesson: the `withdrawFee` function, the sentinel loop with a `switch`, and the global `transactions` counter.',
          'Declare `int amount, fee;` **before** the loop (not inside a `case`) and read the first command before the `while`. Read the next command at the end of each round.',
          'The check is `if (amount + fee <= balance)`. Only inside that `if` do you take the money out and add 1 to `transactions`.',
        ],
      },
    ],
  },
];
