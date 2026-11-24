// C++ Pro, Level 2: Classes and objects. Lesson 7 (classes, private/public, methods, const, this).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_C = '#include <iostream>\n#include <string>\n#include <vector>';
const PC = (body) => progPro(body, INC_C);
const PCF = (above, body) => progProFn(above, body, INC_C);

const TILL = String.raw`class Till {
private:
    int cash;
public:
    Till(int start) {
        cash = start;
    }
    void receive(int amount) {
        cash += amount;
    }
    bool payOut(int amount) {
        if (amount > cash) {
            return false;
        }
        cash -= amount;
        return true;
    }
    int balance() const {
        return cash;
    }
};`;

export const classesLesson = {
  id: 'cppp-classes',
  level: LEVEL,
  minutes: 32,
  title: 'Classes: data and the rules that protect it',
  summary: 'Bundling data with the functions that may use it, private and public, methods, const methods and this',
  blocks: [
    {
      t: 'story',
      title: 'The till with a locked drawer',
      text: 'Mama Rose used to keep the day’s cash in an open tin. Anyone could reach in and take money, and anyone could scribble a different total on the paper. So she bought a **till**: a drawer you cannot open directly. You press a **button**: “receive money”, “pay out”, “show balance”. The till makes sure it never pays out more than it holds.\n\nIn Level 1 you learned the `struct`, which keeps facts together. A **`class`** goes one step further. It keeps the data **and the functions that are allowed to use it** together, and it can **lock the data away** so that only those functions can touch it. The data is the drawer. The functions are the buttons. An actual till you create from the class is called an **object**.',
    },
    { t: 'p', text: 'Read this class slowly, then press **Run**. Everything under `private:` is the locked drawer, and everything under `public:` is the set of buttons that anyone may press.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

` + TILL + String.raw`

int main() {
    Till till(10000);
    till.receive(3000);
    if (till.payOut(5000)) {
        cout << "Paid 5000" << endl;
    }
    if (!till.payOut(20000)) {
        cout << "Not enough cash" << endl;
    }
    cout << "Balance: " << till.balance() << endl;
    return 0;
}
`,
      output: 'Paid 5000\nNot enough cash\nBalance: 8000',
    },
    { t: 'analogy', text: 'The class is the **design drawing** of a till. `Till till(10000);` is the shop building one real till from that drawing, with 10,000 shillings in it. You can build as many as you like from one drawing, and each has its **own** cash.' },
    {
      t: 'list',
      items: [
        '`class Till { ... };` describes the design. **Do not forget the `;` after the closing bracket.**',
        '`private:` members can be used **only inside the class**. `public:` members can be used from anywhere, for example from `main`.',
        'A function that belongs to a class is called a **method** (or member function). You call it with a dot: `till.receive(3000)`.',
        '`Till(int start)` has the **same name as the class** and no return type. It is the **constructor**: it runs when an object is created. (Next lesson covers constructors in detail.)',
        '`int balance() const` the word **`const` after the brackets** is a promise that this method only **reads** the object and never changes it.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

` + TILL + String.raw`

int main() {
    Till a(100);
    Till b(100);
    a.receive(50);
    b.payOut(30);
    cout << a.balance() << " " << b.balance() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['150 70', '120 120', '150 150', '100 100'],
      answer: 0,
      explain: '`a` and `b` are two separate tills built from the same class, each with its own `cash`. Receiving 50 changes only `a` (150), and paying out 30 changes only `b` (70).',
    },
    { t: 'h', text: 'struct or class?' },
    { t: 'p', text: 'A `struct` and a `class` are **almost the same thing** in C++. A struct can have methods too. The only difference is the **default**: members of a `struct` are `public` unless you say otherwise, and members of a `class` are `private`. By habit, programmers use `struct` for plain bundles of data, and `class` when the object protects its data and offers a set of operations.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

struct Box {
    int w, h;
    int area() const {
        return w * h;
    }
};

int main() {
    Box b = {3, 4};
    cout << b.area() << endl;
    return 0;
}
`,
      output: '12',
    },
    { t: 'h', text: 'Which object is “this”?' },
    { t: 'p', text: 'Inside a method, the name of a member (like `cash`) means “the member of **the object this method was called on**”. C++ calls that object **`this`**, and `this->cash` is another way to write `cash`. You need `this->` when a parameter has the **same name** as a member, so that the computer can tell the two apart.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Person {
    string name;
public:
    Person(string name) {
        this->name = name;
    }
    string hello() const {
        return "Hi, I am " + name;
    }
};

int main() {
    Person p("Amina");
    cout << p.hello() << endl;
    return 0;
}
`,
      output: 'Hi, I am Amina',
    },
    { t: 'tip', text: 'In `this->name = name;` the left side is the **member** and the right side is the **parameter**. Writing just `name = name;` would copy the parameter onto itself and leave the member untouched. A common habit is to give members a different style of name (like `name_`) so that this mix-up cannot happen.' },
    {
      t: 'fill',
      prompt: 'Fill the gap so that main is allowed to call the method size().',
      template: String.raw`#include <iostream>
using namespace std;

class Box {
___:
    int size() const {
        return 5;
    }
};

int main() {
    Box b;
    cout << b.size() << endl;
    return 0;
}
`,
      blanks: [{ options: ['public', 'private', 'protected'], answer: 'public' }],
      output: '5',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

` + TILL + String.raw`

int main() {
    Till till(10000);
    cout << till.cash << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['cash is private, so code outside the class cannot touch it', 'cash must be declared as a double', 'balance must be called first', 'A Till object cannot be printed'],
      answer: 0,
      explain: 'That is exactly what `private:` is for. The only way for `main` to learn the cash is through a public method such as `balance()`. The compiler refuses the line and so protects the data.',
      fixed: String.raw`#include <iostream>
using namespace std;

` + TILL + String.raw`

int main() {
    Till till(10000);
    cout << till.balance() << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PC(String.raw`    class Box {
    public:
        int size() const { return 5; }
    }
    Box b;
    cout << b.size() << endl;`),
          why: 'A class definition ends with `};`. The semicolon after the closing bracket is required, and forgetting it gives confusing messages that point at the **next** line.',
          right: PC(String.raw`    class Box {
    public:
        int size() const { return 5; }
    };
    Box b;
    cout << b.size() << endl;`),
        },
        {
          wrong: PCF(TILL, String.raw`    Till till;
    cout << till.balance() << endl;`),
          why: 'The only constructor needs a starting amount (`Till(int start)`), so an object cannot be created with no argument. Give it one: `Till till(10000);`.',
          right: PCF(TILL, String.raw`    Till till(10000);
    cout << till.balance() << endl;`),
        },
        {
          wrong: PCF(TILL, String.raw`    Till till(10000);
    receive(500);
    cout << till.balance() << endl;`),
          why: 'A method always works on **an object**, so it is called through one: `till.receive(500);`. On its own, `receive` is not a function the program knows.',
          right: PCF(TILL, String.raw`    Till till(10000);
    till.receive(500);
    cout << till.balance() << endl;`),
        },
        {
          wrong: PC(String.raw`    class Counter {
        int n = 0;
    public:
        int next() const {
            n = n + 1;
            return n;
        }
    };
    Counter c;
    cout << c.next() << endl;`),
          why: 'A method marked `const` promises not to change the object, and `n = n + 1;` changes it. The compiler enforces the promise. Remove `const` from methods that really change something.',
          right: PC(String.raw`    class Counter {
        int n = 0;
    public:
        int next() {
            n = n + 1;
            return n;
        }
    };
    Counter c;
    cout << c.next() << endl;`),
        },
        {
          logic: true,
          wrong: PC(String.raw`    class Till {
        int cash = 0;
    public:
        Till(int cash) { cash = cash; }
        int balance() const { return cash; }
    };
    Till till(10000);
    cout << till.balance() << endl;`),
          why: 'Inside the constructor, `cash = cash;` copies the **parameter** onto itself. The member `cash` was never set, so it stays 0 and the program prints 0 instead of 10000, with no error. Write `this->cash = cash;`.',
          right: PC(String.raw`    class Till {
        int cash = 0;
    public:
        Till(int cash) { this->cash = cash; }
        int balance() const { return cash; }
    };
    Till till(10000);
    cout << till.balance() << endl;`),
        },
        {
          logic: true,
          wrong: PC(String.raw`    class Till {
        int cash;
    public:
        Till(int start) { cash = start; }
        bool payOut(int amount) {
            if (amount > cash) {
                return false;
            }
            return true;
        }
        int balance() const { return cash; }
    };
    Till till(10000);
    till.payOut(4000);
    cout << till.balance() << endl;`),
          why: 'The method says “paid” but never takes the money out of `cash`, so the balance is still 10000. No error appears, because the code is valid. Test every method by checking what **changed**, not only what it returned.',
          right: PC(String.raw`    class Till {
        int cash;
    public:
        Till(int start) { cash = start; }
        bool payOut(int amount) {
            if (amount > cash) {
                return false;
            }
            cash -= amount;
            return true;
        }
        int balance() const { return cash; }
    };
    Till till(10000);
    till.payOut(4000);
    cout << till.balance() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'Which part of a class can code in `main` use directly?', options: ['The public part', 'The private part', 'Both parts', 'Neither part'], answer: 0, explain: '`public` members are the class’s buttons that anyone may use. `private` members are for the class’s own methods only.' },
    { t: 'quiz', question: 'What does `const` after a method’s brackets (`int balance() const`) mean?', options: ['The method promises not to change the object', 'The method returns a constant number', 'The method can be called only once', 'The method is private'], answer: 0, explain: 'It is a promise that is checked by the compiler: a `const` method may read the object but never change it. It also lets you call that method on `const` objects.' },
    {
      t: 'recap',
      items: [
        'A `class` bundles data with the **methods** that may use it. The class is the design, an **object** is one real thing built from it.',
        '`private:` members are usable only inside the class. `public:` members are the buttons that anyone can press. A class is private by default, a struct is public.',
        'Call a method through an object with a dot: `till.receive(500)`. Inside a method, `this` is that object, and `this->x` is the member `x`.',
        'A method that only reads should be `const`. The class definition ends with `};`.',
        'Hiding data behind methods lets the class protect its own rules, such as “never pay out more than the cash”.',
      ],
      memory: 'Data in a locked drawer, buttons outside.',
    },
  ],
  exercises: [
    {
      id: 'cppp7-counter',
      title: 'The clicker',
      prompt: 'Write a class `Counter` that starts at 0 and has `increment()`, `decrement()` (which never goes below 0), `reset()` and `value() const`. In `main`, read commands until the input ends: `inc`, `dec`, `reset`, and `show`, which prints `Count: N`.',
      starter: PCF('// Write the class Counter here, above main\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'inc inc show dec show dec dec show', expected: 'Count: 2\nCount: 1\nCount: 0' },
        { input: 'show', expected: 'Count: 0', hidden: true },
        { input: 'inc inc inc reset show', expected: 'Count: 0', hidden: true },
        { input: 'dec show inc show', expected: 'Count: 0\nCount: 1', hidden: true },
      ],
      hints: [
        'Keep one private `int count = 0;`. `increment()` adds 1, `reset()` sets it to 0, and `value()` returns it (make it `const`).',
        '`decrement()` should only subtract when `count > 0`, so the counter never goes negative.',
        'In `main`: `Counter c;` and `while (cin >> cmd) { if (cmd == "inc") c.increment(); ... }`.',
      ],
    },
    {
      id: 'cppp7-account',
      title: 'A tiny bank account',
      prompt: 'Write a class `Account` that starts with a balance of 0, with `deposit(int)`, `bool withdraw(int)` (which refuses when the balance is too small and changes nothing) and `balance() const`. Read commands until the input ends: `dep N` (prints nothing), `wd N` (prints `Done` or `Refused`) and `bal` (prints `Balance: B`).',
      starter: PCF('// Write the class Account here, above main\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'dep 5000 wd 2000 bal wd 9000 bal', expected: 'Done\nBalance: 3000\nRefused\nBalance: 3000' },
        { input: 'bal', expected: 'Balance: 0', hidden: true },
        { input: 'wd 1 bal', expected: 'Refused\nBalance: 0', hidden: true },
        { input: 'dep 10 wd 10 bal', expected: 'Done\nBalance: 0', hidden: true },
      ],
      hints: [
        'Keep the balance private. `deposit` adds to it, and `balance()` returns it.',
        '`withdraw(int amount)` returns `false` (and changes nothing) if `amount > balance`; otherwise it subtracts and returns `true`.',
        'In `main`: read a command word, then for `dep` and `wd` read the amount with a second `cin >> amount`.',
      ],
    },
    {
      id: 'cppp7-rectangle',
      title: 'Rectangles',
      prompt: 'Write a class `Rectangle` made from a width and a height, with the methods `area()`, `perimeter()` and `isSquare()`, all `const`. Read pairs of numbers (width, then height) until the input ends. For each pair print one line:\n\n`Area 12 Perimeter 14 Square no`',
      starter: PCF('// Write the class Rectangle here, above main\n', '    // Read width and height pairs until the input ends'),
      tests: [
        { input: '3 4 5 5', expected: 'Area 12 Perimeter 14 Square no\nArea 25 Perimeter 20 Square yes' },
        { input: '1 1', expected: 'Area 1 Perimeter 4 Square yes', hidden: true },
        { input: '2 7', expected: 'Area 14 Perimeter 18 Square no', hidden: true },
        { input: '10 10 1 2 6 6', expected: 'Area 100 Perimeter 40 Square yes\nArea 2 Perimeter 6 Square no\nArea 36 Perimeter 24 Square yes', hidden: true },
      ],
      hints: [
        'The constructor takes the width and the height and stores them in private members.',
        'The area is `w * h`, the perimeter is `2 * (w + h)`, and it is a square when `w == h`. Mark all three methods `const`.',
        'Read with `while (cin >> w >> h)`, make `Rectangle r(w, h);` and print one line per rectangle.',
      ],
    },
    {
      id: 'cppp7-stock',
      title: 'Selling from stock',
      prompt: 'Write a class `Product` with a name, a stock and a price. The input starts with `name stock price` (for example `Rolex 10 3000`), followed by commands until the input ends. The command `sell N` calls `int sell(int qty)`, which returns the money earned (`qty * price`) and reduces the stock, or returns -1 and changes nothing if there is not enough stock. Print `Sold N for R` or `Not enough stock`, and at the end print `Left: S`.',
      starter: PCF('// Write the class Product here, above main\n', '    // Read name, stock and price, then the sell commands'),
      tests: [
        { input: 'Rolex 10 3000 sell 4 sell 7 sell 6', expected: 'Sold 4 for 12000\nNot enough stock\nSold 6 for 18000\nLeft: 0' },
        { input: 'Tea 5 500', expected: 'Left: 5', hidden: true },
        { input: 'Soda 3 1500 sell 3', expected: 'Sold 3 for 4500\nLeft: 0', hidden: true },
        { input: 'Egg 2 400 sell 3 sell 1 sell 1 sell 1', expected: 'Not enough stock\nSold 1 for 400\nSold 1 for 400\nNot enough stock\nLeft: 0', hidden: true },
      ],
      hints: [
        'The constructor stores the name, stock and price. Add a `const` method `left()` that returns the stock.',
        '`sell(qty)`: if `qty > stock` return -1. Otherwise subtract `qty` from the stock and return `qty * price`.',
        'In `main`, read the three starting values, then `while (cin >> cmd >> qty)`, call `sell`, and print depending on whether the answer is -1.',
      ],
    },
  ],
};
