// C++ Pro, Level 2: Classes and objects. Lesson 13 (design: composition or inheritance?).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_D = '#include <iostream>\n#include <string>\n#include <vector>';
const INC_DF = INC_D + '\n#include <iomanip>';
const PD = (body) => progPro(body, INC_D);
const PDF = (above, body, inc = INC_D) => progProFn(above, body, inc);

const ORDER = String.raw`class Customer {
    string name;
public:
    Customer(string n) : name(n) {}
    string getName() const { return name; }
};

class Line {
    string item;
    int qty, price;
public:
    Line(string i, int q, int p) : item(i), qty(q), price(p) {}
    string text() const { return item + " x" + to_string(qty); }
    int amount() const { return qty * price; }
};

class Order {
    Customer customer;
    vector<Line> lines;
public:
    Order(string who) : customer(who) {}
    void add(string item, int qty, int price) {
        lines.push_back(Line(item, qty, price));
    }
    int total() const {
        int sum = 0;
        for (const Line &l : lines) {
            sum += l.amount();
        }
        return sum;
    }
    void print() const {
        cout << "Order for " << customer.getName() << endl;
        for (const Line &l : lines) {
            cout << "  " << l.text() << " = " << l.amount() << endl;
        }
        cout << "Total: " << total() << endl;
    }
};`;

export const designLesson = {
  id: 'cppp-design',
  level: LEVEL,
  minutes: 32,
  title: 'Design with objects: has-a, is-a, and small classes',
  summary: 'Building classes out of other classes, why composition usually beats inheritance, and the habits of good class design',
  blocks: [
    {
      t: 'story',
      title: 'What is an order made of?',
      text: 'Mama Rose wants to design her shop software. Someone says: “An order **is a** list of items, so let `Order` inherit from `vector`!” Someone else says: “An order **has** a customer and **has** some lines.” Which is right?\n\nThe second person. A good test: say the sentence aloud. “A cashier **is an** employee” is true everywhere. “An order **is a** vector of items” is not true: an order also has a customer, a total, a date, and you do **not** want anyone to call `pop_back()` or `sort()` on an order. When the honest sentence is “**has a**”, you do not inherit. You **keep the other object inside** your class as a member. This is **composition**.',
    },
    { t: 'p', text: 'Here an `Order` is **built out of** a `Customer` and a list of `Line`s. Every class has **one job** and hides its own details. The order asks each line for its amount instead of reaching inside it.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

` + ORDER + String.raw`

int main() {
    Order o("Amina");
    o.add("Rolex", 2, 3000);
    o.add("Soda", 1, 1500);
    o.print();
    return 0;
}
`,
      output: 'Order for Amina\n  Rolex x2 = 6000\n  Soda x1 = 1500\nTotal: 7500',
    },
    { t: 'analogy', text: 'A bicycle **has** two wheels, a frame and a chain. It does not **inherit** from a wheel. You build it from parts, and each part is a complete thing with its own job. If you replace the chain with a better one, the bicycle still works.' },
    {
      t: 'list',
      items: [
        '**Composition** (“has-a”): a class keeps other objects as **members**. The parts are built before the whole and destroyed after it. Members that have no default constructor must be set in the **initializer list**: `Order(string who) : customer(who) {}`.',
        '**Inheritance** (“is-a”): use it when the derived class can be used **anywhere** the base is expected, **and** you want polymorphism (lesson 12).',
        '**When in doubt, compose.** It is looser: you can swap a part without breaking the outside, and the outside only sees the methods you choose to expose.',
      ],
    },
    { t: 'h', text: 'Do not expose what you build on' },
    { t: 'p', text: 'A **stack** (last in, first out) can be built on a `vector`. But a stack is **not a vector**: nobody should be able to insert in the middle of it. So the stack **has** a vector, **hides** it, and offers only the stack operations.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

class Stack {
    vector<int> items;
public:
    void push(int x) { items.push_back(x); }
    bool pop() {
        if (items.empty()) {
            return false;
        }
        items.pop_back();
        return true;
    }
    int top() const { return items.back(); }
    bool empty() const { return items.empty(); }
    int size() const { return items.size(); }
};

int main() {
    Stack s;
    s.push(1);
    s.push(2);
    s.push(3);
    s.pop();
    cout << s.top() << " " << s.size() << endl;
    return 0;
}
`,
      output: '2 2',
    },
    { t: 'h', text: 'When “is-a” is a trap' },
    { t: 'p', text: 'A square **is a** rectangle in mathematics. But in a program, a rectangle lets you set the width and the height **separately**, and a square cannot honour that. Watch what a function that expects any rectangle gets when you hand it a square.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

class Rectangle {
protected:
    int w = 0, h = 0;
public:
    virtual void setWidth(int x) { w = x; }
    virtual void setHeight(int y) { h = y; }
    int area() const { return w * h; }
    virtual ~Rectangle() {}
};

class Square : public Rectangle {
public:
    void setWidth(int x) override { w = h = x; }
    void setHeight(int y) override { w = h = y; }
};

int stretch(Rectangle &r) {
    r.setWidth(5);
    r.setHeight(2);
    return r.area();
}

int main() {
    Rectangle r;
    Square s;
    cout << stretch(r) << " " << stretch(s) << endl;
    return 0;
}
`,
      question: 'The function `stretch` sets the width to 5 and the height to 2. What does the program print?',
      options: ['10 4', '10 10', '4 4', '10 25'],
      answer: 0,
      explain: 'For the real Rectangle: 5 × 2 = 10. For the Square, each setter changes **both** sides, so after `setWidth(5)` it is 5 by 5, and after `setHeight(2)` it is 2 by 2. The area is 4. Code that works for every Rectangle breaks for a Square, so a Square **is not substitutable** for a Rectangle here, and inheritance was the wrong tool. Two separate `Shape`s with an `area()` would be a better design.',
    },
    { t: 'h', text: 'Habits of good class design' },
    {
      t: 'list',
      items: [
        '**One class, one job.** If you cannot describe a class in one sentence without the word “and”, split it.',
        '**Hide the details.** Keep members private. Other code asks the class to do things, and never reaches into its parts.',
        '**Prefer composition.** Use inheritance for a true “is-a” that you will use polymorphically, and keep the family tree **shallow**.',
        '**Depend on an abstract interface**, not a concrete class: a `Cart` that uses a `Discount` works with any discount, today’s and tomorrow’s.',
        '**Name by what it is.** `Order`, `Line`, `Customer` are nouns that match the shop. Methods are verbs: `add`, `total`, `print`.',
      ],
    },
    { t: 'p', text: 'The last habit in action. A `Cart` is given a **discount rule** (any class from the abstract `Discount` family) and uses it without caring which one it is. The cart **does not own** the rule, so it keeps a **pointer** to it. The rule must live at least as long as the cart.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

class Discount {
public:
    virtual int apply(int price) const = 0;
    virtual ~Discount() {}
};

class PercentOff : public Discount {
    int p;
public:
    PercentOff(int percent) : p(percent) {}
    int apply(int price) const override { return price * (100 - p) / 100; }
};

class FlatOff : public Discount {
    int f;
public:
    FlatOff(int flat) : f(flat) {}
    int apply(int price) const override { return price > f ? price - f : 0; }
};

class Cart {
    int subtotal = 0;
    const Discount *rule;
public:
    Cart(const Discount *r) : rule(r) {}
    void add(int amount) { subtotal += amount; }
    int total() const { return rule->apply(subtotal); }
};

int main() {
    PercentOff tenPercent(10);
    FlatOff fiveHundred(500);
    Cart a(&tenPercent), b(&fiveHundred);
    a.add(3000);
    a.add(2000);
    b.add(3000);
    b.add(2000);
    cout << a.total() << " " << b.total() << endl;
    return 0;
}
`,
      output: '4500 4500',
    },
    {
      t: 'fill',
      prompt: 'Fill the gap so the member Customer is built with the given name in the initializer list.',
      template: String.raw`#include <iostream>
#include <string>
using namespace std;

class Customer {
    string name;
public:
    Customer(string n) : name(n) {}
    string getName() const { return name; }
};

class Order {
    Customer customer;
public:
    Order(string who) : customer___ {}
    void print() const { cout << customer.getName() << endl; }
};

int main() {
    Order o("Amina");
    o.print();
    return 0;
}
`,
      blanks: [{ options: ['(who)', ' = who', '.name'], answer: '(who)' }],
      output: 'Amina',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Customer {
    string name;
public:
    Customer(string n) : name(n) {}
};

class Order {
    Customer customer;
public:
    Order(string who) {
        customer = Customer(who);
    }
};

int main() {
    Order o("Amina");
    cout << "ok" << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['The member Customer has no default constructor, but the Order constructor body runs after members are already built', 'Customer cannot be copied', 'Order needs a destructor', 'who must be a Customer'],
      answer: 0,
      explain: 'Before the body of `Order`’s constructor runs, every member is **already built**, using its default constructor, and `Customer` has none. Build the member with the right value **in the initializer list**: `Order(string who) : customer(who) {}`.',
      fixed: String.raw`#include <iostream>
#include <string>
using namespace std;

class Customer {
    string name;
public:
    Customer(string n) : name(n) {}
};

class Order {
    Customer customer;
public:
    Order(string who) : customer(who) {}
};

int main() {
    Order o("Amina");
    cout << "ok" << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PDF(ORDER, String.raw`    Order o("Amina");
    cout << o.customer.getName() << endl;`),
          why: '`customer` is a **private** member of `Order`, so code outside cannot reach into it. That is the point: the order decides what to show. Add a method such as `print()` or `customerName()` if the outside needs it.',
          right: PDF(ORDER, String.raw`    Order o("Amina");
    o.print();`),
        },
        {
          wrong: PDF(String.raw`class Discount {
public:
    virtual int apply(int price) { return price; }
};

class Cart {
    const Discount *rule;
public:
    Cart(const Discount *r) : rule(r) {}
    int total() const { return rule->apply(100); }
};`, String.raw`    Discount d;
    Cart c(&d);
    cout << c.total() << endl;`),
          why: 'The cart promises, with `const Discount *`, not to change the discount it uses. But `apply` is **not** a `const` method, so it might change it, and the compiler refuses. A method that only reads should be marked `const`: `virtual int apply(int price) const`.',
          right: PDF(String.raw`class Discount {
public:
    virtual int apply(int price) const { return price; }
};

class Cart {
    const Discount *rule;
public:
    Cart(const Discount *r) : rule(r) {}
    int total() const { return rule->apply(100); }
};`, String.raw`    Discount d;
    Cart c(&d);
    cout << c.total() << endl;`),
        },
        {
          logic: true,
          wrong: PDF(String.raw`class Customer {
    string name;
public:
    Customer(string n) : name(n) {}
    void rename(string n) { name = n; }
    string getName() const { return name; }
};

class Order {
    Customer customer;
public:
    Order(Customer c) : customer(c) {}
    string who() const { return customer.getName(); }
};`, String.raw`    Customer c("Amina");
    Order o(c);
    c.rename("Peter");
    cout << o.who() << endl;`),
          why: 'The `Order` keeps its **own copy** of the customer, made when the order was created. Renaming the original afterwards does not affect it, so this prints Amina. Whether that is what you want is a **design decision**. If the order must follow the original, keep a pointer or reference to it instead of a copy.',
          right: PDF(String.raw`class Customer {
    string name;
public:
    Customer(string n) : name(n) {}
    void rename(string n) { name = n; }
    string getName() const { return name; }
};

class Order {
    const Customer &customer;
public:
    Order(const Customer &c) : customer(c) {}
    string who() const { return customer.getName(); }
};`, String.raw`    Customer c("Amina");
    Order o(c);
    c.rename("Peter");
    cout << o.who() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'Which relationship is “has-a”, so it should be a member and not inheritance?', options: ['An Order has a Customer', 'A Cashier is an Employee', 'A Dog is an Animal', 'A Circle is a Shape'], answer: 0, explain: 'The other three are “is-a” and fit inheritance (with `virtual` when you use them polymorphically). An order **contains** a customer.' },
    { t: 'quiz', question: 'A member object has no default constructor. Where must it be given its value?', options: ['In the initializer list of the containing class’s constructor', 'In the constructor body', 'In main only', 'In the destructor'], answer: 0, explain: 'Members are built **before** the constructor body runs, so a member that needs arguments must get them in the initializer list.' },
    {
      t: 'recap',
      items: [
        '**Has-a** means composition: keep the other object as a **member**. **Is-a** means inheritance, and only when the derived class works **everywhere** the base does.',
        'Members that need constructor arguments are built in the **initializer list**.',
        'Hide what you build on: a `Stack` that has a `vector` exposes only `push`, `pop`, `top`.',
        'Square-from-Rectangle shows that “is-a” in mathematics can be wrong in code: if callers break, inheritance is the wrong tool.',
        'One class, one job. Hide details. Prefer composition. Depend on an abstract interface (a `const Discount *` works with any discount).',
      ],
      memory: 'A bicycle has wheels; it is not a wheel.',
    },
  ],
  exercises: [
    {
      id: 'cppp13-stack',
      title: 'Build a stack',
      prompt: 'Write a class `Stack` that **has** a `vector<int>` (do not inherit) and exposes only `push(int)`, `bool pop()`, `int top() const`, `bool empty() const` and `int size() const`. Read commands until the input ends: `push N`, `pop` (prints `Empty` if there is nothing to remove), `top` (prints the top value, or `Empty`) and `size` (prints `Size: K`).',
      starter: PDF('// Write the class Stack here, above main\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'push 1 push 2 push 3 top pop top size', expected: '3\n2\nSize: 2' },
        { input: 'pop top size', expected: 'Empty\nEmpty\nSize: 0', hidden: true },
        { input: 'push 5 pop pop size', expected: 'Empty\nSize: 0', hidden: true },
        { input: 'push 9 top push 4 top size', expected: '9\n4\nSize: 2', hidden: true },
      ],
      hints: [
        'Keep a private `vector<int> items;`. `push` uses `push_back`, `pop` uses `pop_back` after checking that the vector is not empty.',
        '`top()` returns `items.back()`. Check `empty()` in `main` before calling it, so the program never reads an empty vector.',
        'In `main`: `if (cmd == "top") { if (s.empty()) cout << "Empty" << endl; else cout << s.top() << endl; }`.',
      ],
    },
    {
      id: 'cppp13-library',
      title: 'The lending library',
      prompt: 'A `Book` has a title and knows whether it is **available**. A `Library` **has** a `vector<Book>`. Read commands until the input ends (titles are one word):\n\n* `add TITLE`: adds an available book, prints `Added TITLE`\n* `borrow TITLE`: if the book exists and is available prints `Borrowed TITLE`; if it exists but is out prints `TITLE is out`; if it does not exist prints `No such book`\n* `return TITLE`: if the book exists and is out prints `Returned TITLE`, otherwise `Cannot return TITLE`\n* `count`: prints `Available: N` (how many books are in)',
      starter: PDF('// Write the classes Book and Library here\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'add dune add emma borrow dune borrow dune count return dune count', expected: 'Added dune\nAdded emma\nBorrowed dune\ndune is out\nAvailable: 1\nReturned dune\nAvailable: 2' },
        { input: 'borrow zzz return zzz count', expected: 'No such book\nCannot return zzz\nAvailable: 0', hidden: true },
        { input: 'add a return a borrow a return a return a', expected: 'Added a\nCannot return a\nBorrowed a\nReturned a\nCannot return a', hidden: true },
      ],
      hints: [
        '`Book` keeps `title` and `available` (start `true`) with methods `isAvailable()`, `take()` and `giveBack()`. `Library` keeps the `vector<Book>` privately.',
        'Give `Library` methods that **do the work** (`borrow(title)`, `giveBack(title)`) and return an answer, and keep the searching loop inside the library.',
        'A search helper such as `int find(const string &title) const` (returning -1 when missing) keeps the other methods short.',
      ],
    },
    {
      id: 'cppp13-cart',
      title: 'The shopping cart',
      prompt: 'A `Cart` **has** a `vector` of lines (name, quantity, price each). Read commands until the input ends:\n\n* `add NAME QTY PRICE`: adds a line, or **adds to the quantity** if that name is already in the cart (the price stays the first one given)\n* `remove NAME`: removes the whole line if it exists (nothing printed)\n* `total`: prints `Total: T`\n* `show`: prints one `NAME xQTY` line per item, in the order they were first added, or `Empty` if the cart is empty',
      starter: PDF('// Write your classes here\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'add rolex 2 3000 add soda 1 1500 add rolex 1 9999 show total', expected: 'rolex x3\nsoda x1\nTotal: 10500' },
        { input: 'show total', expected: 'Empty\nTotal: 0', hidden: true },
        { input: 'add a 1 10 add b 2 20 remove a show total', expected: 'b x2\nTotal: 40', hidden: true },
        { input: 'add a 1 10 remove zzz show', expected: 'a x1', hidden: true },
      ],
      hints: [
        'Make a small `Line` class or struct (`name`, `qty`, `price`), and let `Cart` own a `vector<Line>` privately.',
        '`add` first searches for the name. If found, add to its `qty`; otherwise `push_back` a new line. Keep this logic **inside** the cart.',
        '`remove` can build a new vector without the removed line, or use `erase(begin() + i)` after finding its index.',
      ],
    },
    {
      id: 'cppp13-classroom',
      title: 'The classroom',
      prompt: 'A `Student` has a name and a list of marks. A `Classroom` **has** a `vector<Student>`. Read commands until the input ends:\n\n* `student NAME`: adds a student (prints nothing)\n* `mark NAME M`: adds the mark `M` to that student (prints nothing). If the student does not exist print `No such student`\n* `report`: prints one line per student in the order added, `NAME: AVERAGE` with **two decimals** (a student with no marks has average `0.00`), and then `Class average: AVERAGE`, the average of **all marks of everyone** (`0.00` if there are none)',
      starter: PDF('// Write the classes Student and Classroom here\n', '    // Read commands until the input ends', INC_DF),
      tests: [
        { input: 'student amina student peter mark amina 80 mark amina 90 mark peter 70 report', expected: 'amina: 85.00\npeter: 70.00\nClass average: 80.00' },
        { input: 'mark kato 5 student kato report', expected: 'No such student\nkato: 0.00\nClass average: 0.00', hidden: true },
        { input: 'student a mark a 1 mark a 2 student b report', expected: 'a: 1.50\nb: 0.00\nClass average: 1.50', hidden: true },
        { input: 'report', expected: 'Class average: 0.00', hidden: true },
      ],
      hints: [
        '`Student` keeps `name` and a `vector<int> marks`, with `addMark`, `total()`, `count()` and `average()` (0 when empty).',
        '`Classroom` keeps the students privately and offers `addStudent`, `addMark(name, m)` (returns whether the student was found), and a `report()`.',
        'The class average is **all marks together**, not the average of the averages: add up every student’s total and count, then divide once.',
      ],
    },
  ],
};
