// C++ Pro, Level 1: Real strings and vectors. Lesson 6 (project: Mama Rose's ledger).
import { progProFn } from './shared.js';

const LEVEL = 'Level 1: Real strings and vectors';
const INC_L = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';

const HEAD = String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Entry {
    string customer;
    int amount;
};

int grandTotal(const vector<Entry> &ledger) {
    int total = 0;
    for (const Entry &e : ledger) {
        total += e.amount;
    }
    return total;
}
`;

const PIECE1 = HEAD + String.raw`
int main() {
    vector<Entry> ledger;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "add") {
            string customer;
            int amount;
            cin >> customer >> amount;
            ledger.push_back({customer, amount});
            cout << "Added " << customer << " " << amount << endl;
        } else if (cmd == "total") {
            cout << "Total: " << grandTotal(ledger) << endl;
        }
    }
    cout << "Entries: " << ledger.size() << endl;
    return 0;
}
`;

const PIECE2 = HEAD + String.raw`
int totalFor(const vector<Entry> &ledger, const string &customer) {
    int total = 0;
    for (const Entry &e : ledger) {
        if (e.customer == customer) {
            total += e.amount;
        }
    }
    return total;
}

int main() {
    vector<Entry> ledger;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "add") {
            string customer;
            int amount;
            cin >> customer >> amount;
            ledger.push_back({customer, amount});
            cout << "Added " << customer << " " << amount << endl;
        } else if (cmd == "total") {
            cout << "Total: " << grandTotal(ledger) << endl;
        } else if (cmd == "who") {
            string customer;
            cin >> customer;
            cout << customer << ": " << totalFor(ledger, customer) << endl;
        }
    }
    cout << "Entries: " << ledger.size() << endl;
    return 0;
}
`;

const PIECE3 = String.raw`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

struct Entry {
    string customer;
    int amount;
};

int grandTotal(const vector<Entry> &ledger) {
    int total = 0;
    for (const Entry &e : ledger) {
        total += e.amount;
    }
    return total;
}

int totalFor(const vector<Entry> &ledger, const string &customer) {
    int total = 0;
    for (const Entry &e : ledger) {
        if (e.customer == customer) {
            total += e.amount;
        }
    }
    return total;
}

void listBiggestFirst(const vector<Entry> &ledger) {
    if (ledger.empty()) {
        cout << "No entries" << endl;
        return;
    }
    vector<Entry> sorted = ledger;
    stable_sort(sorted.begin(), sorted.end(), [](const Entry &a, const Entry &b) {
        return a.amount > b.amount;
    });
    for (const Entry &e : sorted) {
        cout << e.customer << " " << e.amount << endl;
    }
}

int main() {
    vector<Entry> ledger;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "add") {
            string customer;
            int amount;
            cin >> customer >> amount;
            ledger.push_back({customer, amount});
            cout << "Added " << customer << " " << amount << endl;
        } else if (cmd == "total") {
            cout << "Total: " << grandTotal(ledger) << endl;
        } else if (cmd == "who") {
            string customer;
            cin >> customer;
            cout << customer << ": " << totalFor(ledger, customer) << endl;
        } else if (cmd == "list") {
            listBiggestFirst(ledger);
        } else {
            cout << "Unknown command: " << cmd << endl;
        }
    }
    cout << "Entries: " << ledger.size() << endl;
    return 0;
}
`;

export const ledgerLesson = {
  id: 'cppp-ledger',
  level: LEVEL,
  minutes: 38,
  title: 'Project: Mama Rose’s ledger',
  summary: 'Build a command-driven ledger from strings, vectors, structs, references and sorting, one function at a time',
  blocks: [
    {
      t: 'story',
      title: 'Closing the books',
      text: 'Every evening Mama Rose settles up. Some customers eat on credit, some pay in advance, and her old notebook is a mess of crossed-out lines. She wants a small program that works like a **ledger**: she types short commands such as `add amina 3000`, `total`, `who amina` or `list`, and the program keeps the records and answers.\n\nThis project uses everything from Level 1 of C++ Pro: **strings** to read commands, a **vector** of **structs** to store the records, **references** to pass them to functions without copying, and **sorting** for the list. You will build it in three pieces.',
    },
    { t: 'h', text: 'Plan first' },
    {
      t: 'list',
      items: [
        'A `struct Entry` with two fields: `customer` and `amount`. The ledger is a `vector<Entry>`.',
        'One small function per job: `grandTotal`, `totalFor`, `listBiggestFirst`. Each takes the ledger as a `const &`, because it only reads it.',
        'A loop in `main` that reads one **command word** at a time with `cin >> cmd` and chooses what to do with `if` / `else if`. It stops at `quit` or when the input ends.',
        'Unknown commands are reported, never ignored silently.',
      ],
    },
    { t: 'h', text: 'Piece 1: add and total' },
    { t: 'p', text: 'The command loop reads a word. For `add` it reads the customer and the amount that follow, and stores them. For `total` it calls a function. Notice how `main` stays short because the adding-up work lives in `grandTotal`.' },
    {
      t: 'project',
      title: 'Ledger piece 1: add and total',
      text: 'Press Run, then add more lines to the Input, or change the amounts.',
      stdin: 'add amina 3000\nadd peter 1000\nadd amina 500\ntotal\nquit\n',
      code: PIECE1,
      output: 'Added amina 3000\nAdded peter 1000\nAdded amina 500\nTotal: 4500\nEntries: 3',
    },
    { t: 'h', text: 'Piece 2: how much does one customer owe?' },
    { t: 'p', text: '`who NAME` adds up only the entries of one customer. That is a second function, `totalFor`, that takes the ledger **and** the name as read-only references. A customer who has no entries simply totals 0.' },
    {
      t: 'project',
      title: 'Ledger piece 2: who',
      text: 'Ask about a customer who is not in the ledger, such as kato.',
      stdin: 'add amina 3000\nadd peter 1000\nadd amina 500\nwho amina\nwho kato\nquit\n',
      code: PIECE2,
      output: 'Added amina 3000\nAdded peter 1000\nAdded amina 500\namina: 3500\nkato: 0\nEntries: 3',
    },
    { t: 'h', text: 'Piece 3: the list, biggest first' },
    { t: 'p', text: '`list` prints every entry, biggest amount first. The function works on a **sorted copy** (`vector<Entry> sorted = ledger;`), so the real ledger keeps its original order. It uses `stable_sort` so that entries with the same amount stay in the order they were added. An empty ledger prints `No entries`, and an unknown command is reported.' },
    {
      t: 'project',
      title: 'The finished ledger',
      text: 'Notice that amina and kato both have 3000: they stay in the order they were added.',
      stdin: 'add amina 3000\nadd peter 1000\nadd kato 3000\nlist\nhello\nquit\n',
      code: PIECE3,
      output: 'Added amina 3000\nAdded peter 1000\nAdded kato 3000\namina 3000\nkato 3000\npeter 1000\nUnknown command: hello\nEntries: 3',
    },
    { t: 'h', text: 'What you used' },
    {
      t: 'list',
      items: [
        'Lesson 1 (strings): reading words with `cin >>`, comparing a command with `==`.',
        'Lesson 2 (vectors): `push_back`, `size`, `empty`, and a range-for over the ledger.',
        'Lesson 3 (algorithms): `stable_sort` with a lambda, to order by amount.',
        'Lesson 4 (references): `const &` parameters that avoid copying, and a sorted **copy** that leaves the original alone.',
        'Lesson 5 (structs): `Entry` keeps a customer and an amount together.',
      ],
    },
    { t: 'tip', text: 'Ideas to try on your own after the exercises: add an `undo` command that removes the last entry (`pop_back`), a `best` command that prints the customer with the biggest total, and a `remove NAME` command that erases a customer’s entries.' },
    { t: 'quiz', question: 'Why does `listBiggestFirst` sort a COPY of the ledger instead of the ledger itself?', options: ['So the ledger keeps its original order for the other commands', 'Because sort cannot work on a const reference', 'Because copies sort faster', 'Because vectors cannot be sorted twice'], answer: 0, explain: 'The parameter is `const &`, a promise not to change the ledger, and sorting changes the order. Working on a copy keeps the promise, and the entries stay in the order they were added.' },
    {
      t: 'recap',
      items: [
        'Plan first: decide the data (`struct Entry`, `vector<Entry>`), then one small function per job, then the loop in `main`.',
        'A command loop reads a word with `cin >> cmd` and chooses with `if` / `else if`. Always handle the unknown command.',
        'Pass big things as `const &` when you only read them. Sort a copy when the original order matters.',
        '`stable_sort` keeps equal items in their original order.',
        'Test each piece on its own before you add the next one.',
      ],
      memory: 'One function, one job.',
    },
  ],
  exercises: [
    {
      id: 'cppp6-ledger',
      title: 'Build the ledger',
      prompt: 'Build the ledger. Read **commands** until `quit` or until the input ends:\n\n* `add NAME AMOUNT` stores an entry and prints `Added NAME AMOUNT`\n* `total` prints `Total: T` (the sum of all amounts, 0 if empty)\n* `who NAME` prints `NAME: T` (that customer’s total, 0 if none)\n* `list` prints each entry as `NAME AMOUNT`, biggest amount first, ties in the order they were added. If there are no entries print `No entries`\n* any other word prints `Unknown command: WORD`\n\nAt the end print `Entries: N` (how many entries were added).',
      starter: progProFn('// Define struct Entry and your functions here\n', '    // Read commands until quit or the end of the input', INC_L),
      tests: [
        { input: 'add amina 3000\nadd peter 1000\nadd kato 3000\nlist\nhello\nquit\n', expected: 'Added amina 3000\nAdded peter 1000\nAdded kato 3000\namina 3000\nkato 3000\npeter 1000\nUnknown command: hello\nEntries: 3' },
        { input: 'list\nquit\n', expected: 'No entries\nEntries: 0' },
        { input: 'add a 5\nadd a 7\nwho a\nwho b\ntotal\n', expected: 'Added a 5\nAdded a 7\na: 12\nb: 0\nTotal: 12\nEntries: 2', hidden: true },
        { input: 'add x 1\nquit\nadd y 2\n', expected: 'Added x 1\nEntries: 1', hidden: true },
        { input: 'total\nwho amina\nquit\n', expected: 'Total: 0\namina: 0\nEntries: 0', hidden: true },
        { input: 'add b 10\nadd a 20\nadd c 10\nlist\n', expected: 'Added b 10\nAdded a 20\nAdded c 10\na 20\nb 10\nc 10\nEntries: 3', hidden: true },
      ],
      hints: [
        'Follow the three pieces from the lesson: `struct Entry`, a command loop `while (cin >> cmd && cmd != "quit")`, and small functions `grandTotal`, `totalFor` and a list function.',
        'For `list`, copy the ledger (`vector<Entry> sorted = ledger;`), `stable_sort` the copy with a lambda that compares `a.amount > b.amount`, and print it. Check `ledger.empty()` first.',
        'The last line, `Entries: N`, is printed after the loop ends, whether it ended by `quit` or by the input running out.',
      ],
    },
    {
      id: 'cppp6-report',
      title: 'The customer report',
      prompt: 'Read entries until the input ends. Each entry is a **customer name** and an **amount** (for example `amina 3000`). Print one line per customer, in the order each customer **first appeared**, with their total and number of entries, and then two summary lines:\n\n`amina total=3500 entries=2`\n`peter total=1000 entries=1`\n`Customers: 2`\n`Grand total: 4500`\n\n(for the input `amina 3000 peter 1000 amina 500`)',
      starter: progProFn('// Define a struct for one customer\'s totals here\n', '    // Read the entries and group them by customer', INC_L),
      tests: [
        { input: 'amina 3000 peter 1000 amina 500', expected: 'amina total=3500 entries=2\npeter total=1000 entries=1\nCustomers: 2\nGrand total: 4500' },
        { input: 'kato 10', expected: 'kato total=10 entries=1\nCustomers: 1\nGrand total: 10', hidden: true },
        { input: 'a 1 b 2 c 3 a 4 b 5 c 6', expected: 'a total=5 entries=2\nb total=7 entries=2\nc total=9 entries=2\nCustomers: 3\nGrand total: 21', hidden: true },
        { input: 'x 5 x 5 x 5', expected: 'x total=15 entries=3\nCustomers: 1\nGrand total: 15', hidden: true },
      ],
      hints: [
        'Make a struct `Customer { string name; int total; int entries; };` and a `vector<Customer>` that starts empty.',
        'For each entry read, look through the vector for that name. If it is there, add to its `total` and `entries` (use a **reference** to the item). If it is not, `push_back` a new one.',
        'Print the customers in the vector order (which is the order they first appeared), and keep a grand total as you go.',
      ],
    },
  ],
};
