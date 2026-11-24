// C++ Pro, Level 2: Classes and objects. Lesson 8 (constructors, destructors, lifetimes, static, const members).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_K = '#include <iostream>\n#include <string>\n#include <vector>';
const INC_KM = INC_K + '\n#include <cmath>\n#include <iomanip>';
const PK = (body) => progPro(body, INC_K);
const PKF = (above, body, inc = INC_K) => progProFn(above, body, inc);

export const constructorsLesson = {
  id: 'cppp-constructors',
  level: LEVEL,
  minutes: 32,
  title: 'Constructors, destructors and the life of an object',
  summary: 'Setting objects up properly, tidying up when they end, initializer lists, const members and static members',
  blocks: [
    {
      t: 'story',
      title: 'A helper’s first and last day',
      text: 'When a new helper joins the stand, Mama Rose does the same things every time: gives her an apron, writes her name on the roster, and shows her the till. On her **last day**, she hands the apron back and the till is counted. Nobody forgets, because it is part of the routine of **starting** and **finishing** the job.\n\nIn C++ every object has the same routine. A **constructor** runs automatically when an object is **born**, and sets it up properly. A **destructor** runs automatically when the object **ends**, and tidies up. You never call either of them yourself.',
    },
    { t: 'h', text: 'Constructors' },
    { t: 'p', text: 'A constructor has the **same name as the class** and **no return type**. A class can have **several** constructors with different parameters, and C++ picks the one that matches how you create the object. The part after the colon, `: name(n), price(p)`, is the **initializer list**: it sets the members **before** the constructor body runs.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Item {
    string name;
    int price;
public:
    Item() : name("unnamed"), price(0) {}
    Item(string n, int p) : name(n), price(p) {}
    void show() const {
        cout << name << " " << price << endl;
    }
};

int main() {
    Item a;
    Item b("Soda", 1500);
    a.show();
    b.show();
    return 0;
}
`,
      output: 'unnamed 0\nSoda 1500',
    },
    {
      t: 'list',
      items: [
        'A constructor with **no parameters** is the **default constructor**. It is used for `Item a;`. If you write **no** constructor at all, C++ makes an empty default one for you. As soon as you write **any** constructor, it does not.',
        'The **initializer list** (`: name(n), price(p)`) is the proper place to set members. It is the **only** way to set `const` members and reference members, and it avoids creating a member and then overwriting it.',
        'Members are always initialized in the order they are **declared in the class**, not the order in the list.',
        'You can also give members **default values** right in the class (`int qty = 1;`). A constructor that does not mention them uses those values.',
      ],
    },
    { t: 'h', text: 'Destructors and the end of life' },
    { t: 'p', text: 'A destructor has the class name with a **`~`** in front, and no parameters. It runs when the object **goes out of scope**: at the closing bracket of the block where it was created. Printing a message in both shows exactly when each thing is born and dies.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Visitor {
    string name;
public:
    Visitor(string n) : name(n) {
        cout << "Hello " << name << endl;
    }
    ~Visitor() {
        cout << "Bye " << name << endl;
    }
};

int main() {
    Visitor a("Amina");
    {
        Visitor b("Peter");
        cout << "inside" << endl;
    }
    cout << "outside" << endl;
    return 0;
}
`,
      output: 'Hello Amina\nHello Peter\ninside\nBye Peter\noutside\nBye Amina',
    },
    { t: 'p', text: 'Peter’s block ended first, so Peter was destroyed first. Amina lives until the end of `main`. With several objects in the **same** block, they die in **reverse order of their birth**, like a stack of plates: the last plate put on is the first one taken off.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Mark {
    string id;
public:
    Mark(string i) : id(i) { cout << "make " << id << endl; }
    ~Mark() { cout << "drop " << id << endl; }
};

int main() {
    Mark a("a");
    Mark b("b");
    cout << "end" << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['make a\nmake b\nend\ndrop b\ndrop a', 'make a\nmake b\nend\ndrop a\ndrop b', 'make a\nmake b\ndrop b\ndrop a\nend', 'end\nmake a\nmake b\ndrop b\ndrop a'],
      answer: 0,
      explain: 'Objects are built in the order they are written (a, then b). At the end of `main` they are destroyed in the **opposite** order: b first, then a.',
    },
    { t: 'p', text: 'Why do destructors matter? Later you will meet objects that **own** something: memory they asked for, or a file they opened. The destructor is the place that gives it back, automatically, even if the function ends early. This idea is called **RAII** and is the most important C++ habit. You will use it in the memory lesson.' },
    { t: 'h', text: 'const members and static members' },
    { t: 'p', text: 'A `const` member can be set once, in the initializer list, and never changed afterwards. Good for something like a ticket number. A **`static`** member belongs to the **class**, not to any one object: all objects share the same one. It is how a class can count its own objects. (`static inline` lets you give it its starting value right where it is declared.)' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

class Ticket {
    static inline int issued = 0;
    const int id;
public:
    Ticket() : id(++issued) {}
    int number() const {
        return id;
    }
    static int total() {
        return issued;
    }
};

int main() {
    Ticket a, b, c;
    cout << a.number() << b.number() << c.number() << " " << Ticket::total() << endl;
    return 0;
}
`,
      output: '123 3',
    },
    { t: 'tip', text: 'A `static` method such as `total()` is called through the **class name**, `Ticket::total()`, because it does not need any particular object. It can only use `static` members.' },
    {
      t: 'fill',
      prompt: 'Fill the gap with the symbol that marks a destructor.',
      template: String.raw`#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "make" << endl; }
    ___A() { cout << "drop" << endl; }
};

int main() {
    A a;
    return 0;
}
`,
      blanks: [{ options: ['~', '!', '-'], answer: '~' }],
      output: 'make\ndrop',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

class Ticket {
    const int id;
public:
    Ticket(int i) {
        id = i;
    }
    int number() const { return id; }
};

int main() {
    Ticket t(7);
    cout << "Ticket " << t.number() << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['A const member cannot be assigned in the constructor body: it must be set in the initializer list', 'id must be public', 'number() cannot be const', 'The constructor needs a return type'],
      answer: 0,
      explain: 'By the time the constructor body runs, the `const` member `id` has already been created, and a const thing cannot be assigned. Set it while it is being created, in the initializer list: `Ticket(int i) : id(i) {}`.',
      fixed: String.raw`#include <iostream>
using namespace std;

class Ticket {
    const int id;
public:
    Ticket(int i) : id(i) {}
    int number() const { return id; }
};

int main() {
    Ticket t(7);
    cout << "Ticket " << t.number() << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PK(String.raw`    class Item {
        string name;
    public:
        Item(string n, int p) : name(n) {}
        void show() const { cout << name << endl; }
    };
    Item a("Soda");
    a.show();`),
          why: 'The only constructor needs **two** arguments (a name and a price), but the object was made with one. The arguments you give must match one of the constructors.',
          right: PK(String.raw`    class Item {
        string name;
    public:
        Item(string n, int p) : name(n) {}
        void show() const { cout << name << endl; }
    };
    Item a("Soda", 1500);
    a.show();`),
        },
        {
          wrong: PK(String.raw`    class Item {
    public:
        void show() const { cout << "item" << endl; }
    };
    Item a();
    a.show();`),
          why: 'This is a famous C++ trap, called the “most vexing parse”. `Item a();` does **not** make an object: it declares a **function** named `a` that returns an `Item`. To make an object with the default constructor, write `Item a;` with no brackets.',
          right: PK(String.raw`    class Item {
    public:
        void show() const { cout << "item" << endl; }
    };
    Item a;
    a.show();`),
        },
        {
          wrong: PK(String.raw`    class Point {
        int x, y;
    public:
        Point(int x, int y) : x(x), y(y) {}
    };
    Point p;
    cout << "made" << endl;`),
          why: 'Once you write any constructor, C++ stops giving you the empty default one. `Point p;` needs a constructor with no parameters. Either add one, or create the point with its two values.',
          right: PK(String.raw`    class Point {
        int x, y;
    public:
        Point(int x, int y) : x(x), y(y) {}
    };
    Point p(1, 2);
    cout << "made" << endl;`),
        },
        {
          logic: true,
          wrong: PKF(String.raw`class Ticket {
    int issued = 0;
    int id;
public:
    Ticket() : id(++issued) {}
    int number() const { return id; }
};`, String.raw`    Ticket a, b, c;
    cout << a.number() << b.number() << c.number() << endl;`),
          why: 'The counter `issued` is not `static`, so **every ticket has its own** copy, each starting at 0. Every ticket becomes number 1: the program prints 111, not 123. Make it `static inline int issued = 0;` so that all tickets share one counter.',
          right: PKF(String.raw`class Ticket {
    static inline int issued = 0;
    int id;
public:
    Ticket() : id(++issued) {}
    int number() const { return id; }
};`, String.raw`    Ticket a, b, c;
    cout << a.number() << b.number() << c.number() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'Three objects are created in one block, in the order a, b, c. In which order are they destroyed?', options: ['c, b, a', 'a, b, c', 'In any order', 'All at the same time'], answer: 0, explain: 'The most recently created object is destroyed first, like a stack. That way an object can safely rely on the older objects that were made before it.' },
    { t: 'quiz', question: 'Where must a `const` member be given its value?', options: ['In the constructor’s initializer list', 'In the constructor body', 'In main', 'In the destructor'], answer: 0, explain: 'A const member is created already holding its value, so the value must be given as it is created: in the initializer list or as a default member value.' },
    {
      t: 'recap',
      items: [
        'A **constructor** (class name, no return type) runs when an object is created. A class can have several. Write the **initializer list** `: a(x), b(y)` to set members.',
        'If you write no constructor you get an empty default one. If you write any, you do not, so add `Item() {}` if you still need `Item a;`.',
        'A **destructor** (`~ClassName()`) runs when the object goes out of scope. Objects in one block die in **reverse** order of creation.',
        '`const` members must be set in the initializer list. A `static` member is shared by the whole class: `static inline int count = 0;`, used as `Ticket::total()`.',
        '`Item a();` declares a function, not an object. Write `Item a;`.',
      ],
      memory: 'Born in order, gone in reverse.',
    },
  ],
  exercises: [
    {
      id: 'cppp8-greeter',
      title: 'Hello and goodbye',
      prompt: 'Write a class `Greeter` that is made from a name. Its constructor prints `Hello NAME` and its destructor prints `Bye NAME`. In `main`, read **three names** and create three `Greeter` objects, one per name, **in the order the names were typed**. After creating all three, print `end`. For `a b c` the output is:\n\n`Hello a`\n`Hello b`\n`Hello c`\n`end`\n`Bye c`\n`Bye b`\n`Bye a`',
      starter: PKF('// Write the class Greeter here, above main\n', '    // Read three names, make three Greeter objects, print end'),
      tests: [
        { input: 'a b c', expected: 'Hello a\nHello b\nHello c\nend\nBye c\nBye b\nBye a' },
        { input: 'Amina Peter Kato', expected: 'Hello Amina\nHello Peter\nHello Kato\nend\nBye Kato\nBye Peter\nBye Amina', hidden: true },
        { input: 'x x y', expected: 'Hello x\nHello x\nHello y\nend\nBye y\nBye x\nBye x', hidden: true },
      ],
      hints: [
        'Store the name in a private member. The constructor prints with `cout << "Hello " << name << endl;` and the destructor (`~Greeter()`) prints `Bye`.',
        'In `main`, read the three names first (`string n1, n2, n3; cin >> n1 >> n2 >> n3;`), then make `Greeter g1(n1); Greeter g2(n2); Greeter g3(n3);` in that order.',
        'Do not print the goodbyes yourself. Print `end` and then just let `main` finish: the destructors run automatically, in reverse order.',
      ],
    },
    {
      id: 'cppp8-ticket',
      title: 'Numbered tickets',
      prompt: 'Write a class `Ticket` that numbers itself: the first ticket made is number 1, the next number 2, and so on, using a `static` counter. It has `number() const` and a `static int total()` giving how many tickets have been made. Read a number `n`, make `n` tickets (one at a time), and print `Ticket K` for each one, then `Issued: N`:\n\n`Ticket 1`\n`Ticket 2`\n`Ticket 3`\n`Issued: 3`',
      starter: PKF('// Write the class Ticket here, above main\n', '    // Read n, make n tickets, print each number, then Issued:'),
      tests: [
        { input: '3', expected: 'Ticket 1\nTicket 2\nTicket 3\nIssued: 3' },
        { input: '1', expected: 'Ticket 1\nIssued: 1', hidden: true },
        { input: '0', expected: 'Issued: 0', hidden: true },
        { input: '5', expected: 'Ticket 1\nTicket 2\nTicket 3\nTicket 4\nTicket 5\nIssued: 5', hidden: true },
      ],
      hints: [
        'Use `static inline int issued = 0;` in the class, and a `const int id;` that is set in the constructor’s initializer list with `id(++issued)`.',
        '`static int total() { return issued; }` is called as `Ticket::total()`.',
        'In `main`, loop `n` times, create `Ticket t;` inside the loop (it ends at the end of each round, but the counter keeps going), and print `"Ticket " << t.number()`.',
      ],
    },
    {
      id: 'cppp8-path',
      title: 'The delivery path',
      prompt: 'Write a class `Point` with a default constructor (0, 0), a constructor from `x` and `y`, and a method `double distanceTo(const Point &other) const`. Read points (an `x` and a `y` each) until the input ends, keep them in a `vector<Point>`, and print how many there were and the length of the path that visits them in the order given:\n\n`Points: 3`\n`Path length: 9.00`\n\n(for `0 0 3 4 3 0`)',
      starter: PKF('// Write the class Point here, above main\n', '    // Read the points, add up the distances between neighbours', INC_KM),
      tests: [
        { input: '0 0 3 4 3 0', expected: 'Points: 3\nPath length: 9.00' },
        { input: '0 0 3 4', expected: 'Points: 2\nPath length: 5.00', hidden: true },
        { input: '1 1', expected: 'Points: 1\nPath length: 0.00', hidden: true },
        { input: '0 0 0 0 0 0', expected: 'Points: 3\nPath length: 0.00', hidden: true },
      ],
      hints: [
        'The distance between two points is `sqrt(dx * dx + dy * dy)` (include `<cmath>`).',
        'Read with `while (cin >> x >> y) { points.push_back(Point(x, y)); }`.',
        'Add up `points[i - 1].distanceTo(points[i])` for `i` from 1, and print with `cout << fixed << setprecision(2);`.',
      ],
    },
  ],
};
