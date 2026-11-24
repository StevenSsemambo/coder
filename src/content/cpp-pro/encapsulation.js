// C++ Pro, Level 2: Classes and objects. Lesson 9 (encapsulation and class invariants).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_E = '#include <iostream>\n#include <string>\n#include <vector>';
const INC_EF = INC_E + '\n#include <iomanip>\n#include <algorithm>';
const PE = (body) => progPro(body, INC_E);
const PEF = (above, body, inc = INC_E) => progProFn(above, body, inc);

const WALLET = String.raw`class Wallet {
    int balance = 0;
public:
    bool deposit(int amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }
    bool withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
    int getBalance() const {
        return balance;
    }
};`;

export const encapsulationLesson = {
  id: 'cppp-encapsulation',
  level: LEVEL,
  minutes: 32,
  title: 'Encapsulation: an object that protects itself',
  summary: 'Invariants, validated changes, const correctness, and why handing out references to private data breaks everything',
  blocks: [
    {
      t: 'story',
      title: 'The float must never go negative',
      text: 'At the Mobile Money kiosk, the **float** (the cash the kiosk holds for customers) has rules. It can never go below zero. A deposit must be a positive amount. Peter once typed a withdrawal of **minus 5000** by mistake, and the kiosk’s float suddenly **grew** by 5000. Nobody noticed for a week.\n\nThe cure is not “be more careful”. The cure is to build a wallet that **refuses** a wrong request, every time, no matter who calls it. A fact that must **always** be true about an object is called a **class invariant**. Keeping the data `private` and letting it change only through methods that check the rules is called **encapsulation**.',
    },
    { t: 'p', text: 'This `Wallet` has one invariant: **the balance is never negative.** Every way of changing the balance checks the rule first, and says whether the change was accepted.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

` + WALLET + String.raw`

int main() {
    Wallet w;
    cout << (w.deposit(5000) ? "ok" : "rejected") << endl;
    cout << (w.deposit(-10) ? "ok" : "rejected") << endl;
    cout << (w.withdraw(9000) ? "ok" : "rejected") << endl;
    cout << (w.withdraw(2000) ? "ok" : "rejected") << endl;
    cout << "Balance: " << w.getBalance() << endl;
    return 0;
}
`,
      output: 'ok\nrejected\nrejected\nok\nBalance: 3000',
    },
    { t: 'analogy', text: 'Think of the **cashier’s window** at a bank. You do not reach over the counter and take money from the safe. You **tell the cashier** what you want, and the cashier checks the rules (do you have the money? is it a valid amount?) and then does it, or politely refuses. The window is the public interface, and the safe behind it is private.' },
    {
      t: 'list',
      items: [
        '**Keep data `private`.** Then no outside code can break the rules by writing to it directly.',
        '**Every change goes through a method that checks the invariant** and says whether it accepted the change (`bool`, or a clear answer).',
        '**Offer actions, not raw setters.** `withdraw(500)` is an action that knows the rules. `setBalance(-500)` hands the rules away.',
        '**Getters should be `const`.** A method that only reads must promise it will not change the object.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

class Percent {
    int value = 0;
public:
    void set(int v) {
        if (v < 0) {
            value = 0;
        } else if (v > 100) {
            value = 100;
        } else {
            value = v;
        }
    }
    int get() const { return value; }
};

int main() {
    Percent p;
    p.set(150);
    cout << p.get() << " ";
    p.set(-5);
    cout << p.get() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['100 0', '150 -5', '100 -5', '150 0'],
      answer: 0,
      explain: 'Whatever value is given, `set` forces it into the legal range 0 to 100 (this is called **clamping**). So 150 becomes 100 and -5 becomes 0. The invariant “the value is between 0 and 100” can never be broken from outside.',
    },
    { t: 'h', text: 'Constructors cannot say no' },
    { t: 'p', text: 'A constructor has no return value, so it cannot answer “rejected”. (Ordinary C++ would throw an exception here, but this app’s compiler has none.) The simple, safe answers are: **make the object valid anyway** (clamp the value), or give the class a **separate method** that returns a clear answer. In the optional lesson later you will meet `std::optional`, another neat way.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

class Mark {
    int score;
public:
    Mark(int s) {
        if (s < 0) {
            score = 0;
        } else if (s > 100) {
            score = 100;
        } else {
            score = s;
        }
    }
    int get() const { return score; }
};

int main() {
    Mark a(75), b(130), c(-20);
    cout << a.get() << " " << b.get() << " " << c.get() << endl;
    return 0;
}
`,
      output: '75 100 0',
    },
    { t: 'h', text: 'Tell, don’t ask' },
    { t: 'p', text: 'Compare two ways to take money out. The first **asks** the object for its data and then **decides itself** what to do. The rules now live in the caller and every caller must remember them. The second **tells** the object what to do, and the object applies its own rules in one place.' },
    {
      t: 'list',
      items: [
        '**Asking (fragile):** `if (w.getBalance() >= 500) { w.setBalance(w.getBalance() - 500); }` If one caller forgets the `if`, the invariant is gone.',
        '**Telling (robust):** `w.withdraw(500);` The rule is written once, inside `Wallet`, and cannot be skipped.',
      ],
    },
    { t: 'h', text: 'Do not leak a way in' },
    { t: 'p', text: 'It is easy to destroy encapsulation by accident. If a method **returns a (non-const) reference** to a private member, outside code can now write to it freely, and the invariant is gone, even though the member is still “private”.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

class Leaky {
    int v = 1;
public:
    int &ref() { return v; }
    int get() const { return v; }
};

int main() {
    Leaky l;
    l.ref() = 99;
    cout << l.get() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['99', '1', '0', 'It does not compile'],
      answer: 0,
      explain: '`ref()` returns a reference to the private `v`, which is a second name for it, so `l.ref() = 99;` writes straight into the private data. If you must return something big, return a `const` reference (read only), or a copy.',
    },
    { t: 'h', text: 'const correctness' },
    { t: 'p', text: 'An object that is `const` may only use its `const` methods. That is why read-only methods must be marked `const`: otherwise you could not call them on a `const Wallet` or through a `const Wallet &` parameter, which is how most functions receive objects.' },
    {
      t: 'fill',
      prompt: 'Fill the gap so the getter promises not to change the object.',
      template: String.raw`#include <iostream>
using namespace std;

class Box {
    int v = 7;
public:
    int get() ___ {
        return v;
    }
};

void show(const Box &b) {
    cout << b.get() << endl;
}

int main() {
    Box b;
    show(b);
    return 0;
}
`,
      blanks: [{ options: ['const', 'static', 'final'], answer: 'const' }],
      output: '7',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

` + WALLET + String.raw`

void bonus(const Wallet &w) {
    w.deposit(100);
}

int main() {
    Wallet w;
    bonus(w);
    cout << w.getBalance() << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['The parameter is const, and deposit is not a const method (it changes the wallet)', 'deposit needs a second argument', 'Wallet cannot be passed to a function', 'getBalance cannot be called in main'],
      answer: 0,
      explain: 'The function promised, with `const Wallet &`, not to change the wallet. `deposit` changes it, so it is not allowed. The fix is to take the wallet **without** `const` (`Wallet &w`), because this function really does need to change it.',
      fixed: String.raw`#include <iostream>
using namespace std;

` + WALLET + String.raw`

void bonus(Wallet &w) {
    w.deposit(100);
}

int main() {
    Wallet w;
    bonus(w);
    cout << w.getBalance() << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PE(String.raw`    class Box {
        int v = 1;
    public:
        int &ref() const { return v; }
    };
    Box b;
    cout << b.ref() << endl;`),
          why: 'A `const` method promises not to change the object, so it may not hand out a **modifiable** reference to a member. Return a `const int &`, or a copy (`int`).',
          right: PE(String.raw`    class Box {
        int v = 1;
    public:
        int ref() const { return v; }
    };
    Box b;
    cout << b.ref() << endl;`),
        },
        {
          wrong: PEF(WALLET, String.raw`    const Wallet w;
    w.deposit(500);
    cout << w.getBalance() << endl;`),
          why: 'A `const` object can only call `const` methods, and `deposit` changes the wallet. If the wallet must change, it cannot be `const`.',
          right: PEF(WALLET, String.raw`    Wallet w;
    w.deposit(500);
    cout << w.getBalance() << endl;`),
        },
        {
          logic: true,
          wrong: PE(String.raw`    class Wallet {
        int balance = 0;
    public:
        void setBalance(int b) { balance = b; }
        int getBalance() const { return balance; }
    };
    Wallet w;
    w.setBalance(-500);
    cout << w.getBalance() << endl;`),
          why: 'A raw setter lets anyone put **any** number in, including a negative balance, and the invariant is broken without any error. Replace `setBalance` with actions that check their rules, such as `deposit` and `withdraw`.',
          right: PEF(WALLET, String.raw`    Wallet w;
    w.deposit(500);
    w.withdraw(2000);
    cout << w.getBalance() << endl;`),
        },
        {
          logic: true,
          wrong: PE(String.raw`    class Wallet {
        int balance = 100;
    public:
        bool withdraw(int amount) {
            balance -= amount;
            if (balance < 0) {
                return false;
            }
            return true;
        }
        int getBalance() const { return balance; }
    };
    Wallet w;
    w.withdraw(500);
    cout << w.getBalance() << endl;`),
          why: 'This checks the rule **after** the damage is done. The method says “false” but has already subtracted, so the balance is -400. Always **check first**, then change.',
          right: PE(String.raw`    class Wallet {
        int balance = 100;
    public:
        bool withdraw(int amount) {
            if (amount > balance) {
                return false;
            }
            balance -= amount;
            return true;
        }
        int getBalance() const { return balance; }
    };
    Wallet w;
    w.withdraw(500);
    cout << w.getBalance() << endl;`),
        },
        {
          logic: true,
          wrong: PE(String.raw`    class Basket {
        vector<int> items;
    public:
        vector<int> getItems() const { return items; }
        int count() const { return items.size(); }
    };
    Basket b;
    b.getItems().push_back(5);
    cout << b.count() << endl;`),
          why: '`getItems()` returns a **copy** of the vector, so `push_back` changes a temporary copy that disappears at once. The basket stays empty (count 0) and no error appears. Give the class an `add(int)` method that changes its own vector.',
          right: PE(String.raw`    class Basket {
        vector<int> items;
    public:
        void add(int x) { items.push_back(x); }
        int count() const { return items.size(); }
    };
    Basket b;
    b.add(5);
    cout << b.count() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'What is a class invariant?', options: ['A fact that must always be true about an object', 'A method that never changes', 'A private member', 'A constant value'], answer: 0, explain: 'An invariant is a rule such as “the balance is never negative” that every method must keep true. Encapsulation is how a class guarantees it.' },
    { t: 'quiz', question: 'Which design is better for taking money from a wallet?', options: ['wallet.withdraw(500), which checks the rule inside', 'wallet.setBalance(wallet.getBalance() - 500)', 'making the balance public', 'a global variable'], answer: 0, explain: 'Telling the object what to do keeps the rule in one place. With get and set, every caller must remember to check, and one forgetful caller breaks the invariant.' },
    {
      t: 'recap',
      items: [
        'A **class invariant** is a rule that must always be true. **Encapsulation** keeps the data private so only the class’s own methods can change it.',
        'Offer **actions** that check their rules (`withdraw`), not raw setters. **Check first, then change.** Tell the object what to do.',
        'A constructor cannot refuse, so make the object valid (clamp) or provide a method that returns an answer.',
        'Mark read-only methods **`const`**, take read-only parameters as `const &`, and never return a non-const reference or pointer to private data.',
        'Returning a copy lets the caller change only the copy. Provide a method that changes the real thing.',
      ],
      memory: 'Tell the cashier, do not reach into the safe.',
    },
  ],
  exercises: [
    {
      id: 'cppp9-wallet',
      title: 'The guarded wallet',
      prompt: 'Write a class `Wallet` that starts at 0 and keeps its own rules. Read commands until the input ends:\n\n* `dep N`: if `N` is 0 or less print `Invalid amount`, otherwise add it and print `OK`\n* `wd N`: if `N` is 0 or less print `Invalid amount`; else if it is more than the balance print `Insufficient funds`; else if the total withdrawn so far plus `N` would be **more than 50000** print `Daily limit reached`; otherwise take it out and print `OK`\n* `bal`: print `Balance: B`\n\nFailed requests change nothing.',
      starter: PEF('// Write the class Wallet here, above main\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'dep 100000 wd 30000 wd 30000 bal', expected: 'OK\nOK\nDaily limit reached\nBalance: 70000' },
        { input: 'dep 0 bal', expected: 'Invalid amount\nBalance: 0', hidden: true },
        { input: 'wd 5', expected: 'Insufficient funds', hidden: true },
        { input: 'dep 60000 wd 50000 wd 1 bal', expected: 'OK\nOK\nDaily limit reached\nBalance: 10000', hidden: true },
        { input: 'dep 10 wd -5', expected: 'OK\nInvalid amount', hidden: true },
      ],
      hints: [
        'Keep the balance and the total withdrawn today as private members. Add `deposit` and `withdraw` methods that return an answer (a `bool`, an `int` code, or an `enum class`).',
        'In `withdraw`, check in this order: amount at most 0, amount over the balance, then `withdrawnToday + amount > 50000`. Only after all checks pass, change the numbers.',
        'In `main`, print the message that matches the answer. A refused request must leave both numbers untouched.',
      ],
    },
    {
      id: 'cppp9-percent',
      title: 'A value that stays in range',
      prompt: 'Write a class `Percent` whose value is **always between 0 and 100**. It has `set(int)`, `add(int)` (which may be negative) and `get() const`, and clamps to the range in every case. Read commands until the input ends: `set N`, `add N` and `show`, which prints `Percent: N`. It starts at 0.',
      starter: PEF('// Write the class Percent here, above main\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'set 150 show add -30 show add -100 show', expected: 'Percent: 100\nPercent: 70\nPercent: 0' },
        { input: 'show', expected: 'Percent: 0', hidden: true },
        { input: 'set 40 add 70 show', expected: 'Percent: 100', hidden: true },
        { input: 'set -7 show add 5 show', expected: 'Percent: 0\nPercent: 5', hidden: true },
      ],
      hints: [
        'Make `set` the only place that stores the value, and let it clamp: below 0 becomes 0, above 100 becomes 100.',
        '`add(int n)` can simply call `set(value + n)`, so the clamping rule is written only once.',
        '`get()` is a read-only method, so make it `const`.',
      ],
    },
    {
      id: 'cppp9-marks',
      title: 'The mark book',
      prompt: 'Write a class `MarkBook` that stores marks but accepts **only marks from 0 to 100**. `bool add(int)` refuses others. It also has `count()`, `average()` (a `double`, 0 when empty) and `highest()` (0 when empty), all `const`. Read marks until the input ends. For a refused mark print `Rejected M`. At the end print:\n\n`Count: 3`\n`Average: 90.00`\n`Highest: 100`',
      starter: PEF('// Write the class MarkBook here, above main\n', '    // Read marks until the input ends', INC_EF),
      tests: [
        { input: '80 90 100', expected: 'Count: 3\nAverage: 90.00\nHighest: 100' },
        { input: '50 150 70 -3', expected: 'Rejected 150\nRejected -3\nCount: 2\nAverage: 60.00\nHighest: 70' },
        { input: '101', expected: 'Rejected 101\nCount: 0\nAverage: 0.00\nHighest: 0', hidden: true },
        { input: '0 100', expected: 'Count: 2\nAverage: 50.00\nHighest: 100', hidden: true },
      ],
      hints: [
        'Keep the marks in a private `vector<int>`. `add(int m)` returns `false` (and stores nothing) unless `0 <= m && m <= 100`.',
        '`average()` must handle the empty case first (return 0). Otherwise divide the total by the count using a `double`.',
        'Print with `cout << fixed << setprecision(2);` before the average.',
      ],
    },
    {
      id: 'cppp9-shelf',
      title: 'The shelf',
      prompt: 'A shelf holds **at most 100 items**. Write a class `Shelf` with `bool add(int n)` (refuses if the total would pass 100), `bool remove(int n)` (refuses if there are fewer than `n` items) and `items() const`. Read commands until the input ends: `add N` prints `Added` or `Shelf full`, `remove N` prints `Removed` or `Not enough`, and `show` prints `Items: K`. A refused request changes nothing.',
      starter: PEF('// Write the class Shelf here, above main\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'add 60 add 50 show remove 20 show remove 90 show', expected: 'Added\nShelf full\nItems: 60\nRemoved\nItems: 40\nNot enough\nItems: 40' },
        { input: 'show', expected: 'Items: 0', hidden: true },
        { input: 'add 100 add 1 show', expected: 'Added\nShelf full\nItems: 100', hidden: true },
        { input: 'remove 1 add 5 remove 5 show', expected: 'Not enough\nAdded\nRemoved\nItems: 0', hidden: true },
      ],
      hints: [
        'Keep the count private, and make the limit a `static const int` or a constant at the top of the class.',
        '`add(n)`: if `count + n > 100` return `false`, otherwise add and return `true`. `remove(n)`: if `n > count` return `false`.',
        'In `main`, read the command word, then the number for `add` and `remove`, and print the message that matches the answer.',
      ],
    },
  ],
};
