// C++ Pro, Level 2: Classes and objects. Lesson 12 (virtual functions, abstract classes, polymorphism).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_P = '#include <iostream>\n#include <string>\n#include <vector>\n#include <iomanip>';
const PP = (body) => progPro(body, INC_P);
const PPF = (above, body, inc = INC_P) => progProFn(above, body, inc);

const DISHES = String.raw`class Dish {
public:
    virtual string name() const { return "dish"; }
    virtual int price() const { return 0; }
    virtual ~Dish() {}
};

class Rolex : public Dish {
public:
    string name() const override { return "Rolex"; }
    int price() const override { return 3000; }
};

class Soda : public Dish {
public:
    string name() const override { return "Soda"; }
    int price() const override { return 1500; }
};`;

export const polymorphismLesson = {
  id: 'cppp-polymorphism',
  level: LEVEL,
  minutes: 34,
  title: 'Polymorphism: one call, many behaviours',
  summary: 'virtual functions, override, abstract classes, and working with different objects through one base type',
  blocks: [
    {
      t: 'story',
      title: 'One order, every dish its own way',
      text: 'When a customer shouts “**make it!**”, the cook does not need to know in advance what is on the order. A rolex gets cracked eggs and a chapati. A soda just gets opened. The word is the same, and **each dish knows how to prepare itself**.\n\nThis is **polymorphism** (“many forms”): you write code that works with a general idea (a `Dish`), and when the program runs, each real object (a `Rolex`, a `Soda`) does the right thing for itself. It is what makes inheritance truly powerful. In the last lesson you saw it fail: a function that received the base type used the **base** version. The cure is one keyword: **`virtual`**.',
    },
    { t: 'p', text: 'Mark a base method `virtual`, and a call through a **base reference or pointer** will choose the version of the **real object** while the program runs. In the derived class, write `override` after the method: it asks the compiler to **check** that you really are overriding something.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

` + DISHES + String.raw`

void show(const Dish &d) {
    cout << d.name() << " " << d.price() << endl;
}

int main() {
    Rolex r;
    Soda s;
    show(r);
    show(s);
    return 0;
}
`,
      output: 'Rolex 3000\nSoda 1500',
    },
    {
      t: 'list',
      items: [
        '`virtual` in the base class: “decide **which version to run** when the program runs, by looking at the real object”.',
        '`override` in the derived class: “I mean to replace a base method”. If the signature does not match exactly (a missing `const`, a different parameter), the compiler **refuses**, instead of silently making a new unrelated method.',
        'It works through a **reference** (`const Dish &`) or a **pointer** (`Dish *`) to the base. It does not work on a plain copy (see the slicing example below).',
        'A class meant to be used through its base should have a **`virtual` destructor**, so that deleting a derived object through a base pointer destroys all of it properly.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

` + DISHES + String.raw`

int main() {
    Rolex r;
    Dish copy = r;
    cout << copy.name() << " " << r.name() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['dish Rolex', 'Rolex Rolex', 'dish dish', 'Rolex dish'],
      answer: 0,
      explain: '`Dish copy = r;` makes a brand-new **Dish** and copies only the Dish part of `r` into it. The Rolex part is **sliced off**. `copy` is a real Dish, so it says “dish”. To keep the real behaviour, always use a **reference or a pointer** to the original.',
    },
    { t: 'h', text: 'Abstract classes: a contract with no body' },
    { t: 'p', text: 'Sometimes the base class has no sensible version of a method. What is the area of a generic “Shape”? You can say so by making it **pure virtual**: `virtual double area() const = 0;`. A class with a pure virtual method is **abstract**: you cannot create an object of it, only objects of derived classes that **fill in** every pure virtual method. It acts as a **contract** (an interface): “anything that wants to be a Shape must be able to say its area and its name”.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() {}
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    string name() const override { return "Circle"; }
};

void report(const Shape &s) {
    cout << s.name() << " " << s.area() << endl;
}

int main() {
    cout << fixed << setprecision(2);
    Rectangle rect(3, 4);
    Circle circle(2);
    const Shape *shapes[] = {&rect, &circle};
    for (const Shape *s : shapes) {
        report(*s);
    }
    return 0;
}
`,
      output: 'Rectangle 12.00\nCircle 12.57',
    },
    { t: 'p', text: 'The array holds **pointers to the base type**, and each pointer actually points to a different kind of shape. The loop does not know or care which is which. Add a `Triangle` tomorrow and this loop, and `report`, need **no change at all**. That is the real value of polymorphism.' },
    { t: 'h', text: 'A list of different things from the input' },
    { t: 'p', text: 'When you do not know **how many** objects the input will contain, you must create them while the program runs. `new Rectangle(3, 4)` creates one and gives back a **pointer** to it; `delete p;` gives it back when you are done. (This is the old-fashioned way. The memory lesson later shows the modern, safer one: smart pointers. For now, remember: **every `new` needs a `delete`**, and the base class needs the virtual destructor.)' },
    {
      t: 'try',
      stdin: 'rect 3 4 circle 2',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() {}
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    string name() const override { return "Circle"; }
};

int main() {
    vector<Shape *> shapes;
    string kind;
    while (cin >> kind) {
        if (kind == "rect") {
            double w, h;
            cin >> w >> h;
            shapes.push_back(new Rectangle(w, h));
        } else if (kind == "circle") {
            double r;
            cin >> r;
            shapes.push_back(new Circle(r));
        }
    }
    cout << fixed << setprecision(2);
    double total = 0;
    for (const Shape *s : shapes) {
        cout << s->name() << " area " << s->area() << endl;
        total += s->area();
    }
    cout << "Total area " << total << endl;
    for (Shape *s : shapes) {
        delete s;
    }
    return 0;
}
`,
      output: 'Rectangle area 12.00\nCircle area 12.57\nTotal area 24.57',
    },
    {
      t: 'fill',
      prompt: 'Fill the gap with the keyword that lets a call through a base reference choose the real object’s version.',
      template: String.raw`#include <iostream>
#include <string>
using namespace std;

class Animal {
public:
    ___ string sound() const { return "..."; }
};

class Dog : public Animal {
public:
    string sound() const override { return "Woof"; }
};

void speak(const Animal &a) {
    cout << a.sound() << endl;
}

int main() {
    Dog d;
    speak(d);
    return 0;
}
`,
      blanks: [{ options: ['virtual', 'static', 'const'], answer: 'virtual' }],
      output: 'Woof',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
};

int main() {
    Shape s;
    cout << "made a shape" << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['Shape is abstract (it has a pure virtual method), so no object of it can be created', 'area must return an int', 'Shape needs a constructor', 'virtual cannot be used with const'],
      answer: 0,
      explain: 'A class with `= 0` methods is only a contract. It has no code for `area()`, so there is nothing sensible to build. Create a **derived** class that implements `area()` and make objects of that.',
      fixed: String.raw`#include <iostream>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
};

class Square : public Shape {
    double side;
public:
    Square(double s) : side(s) {}
    double area() const override { return side * side; }
};

int main() {
    Square s(2);
    cout << s.area() << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PP(String.raw`    class Animal {
    public:
        virtual string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string sound() override { return "Woof"; }
    };
    Dog d;
    cout << d.sound() << endl;`),
          why: 'The base method is `const`, but this one is not, so it is **not the same method**, and `override` makes the compiler say so. Without `override` this mistake compiles silently and the base version runs. Match the signature exactly: `string sound() const override`.',
          right: PP(String.raw`    class Animal {
    public:
        virtual string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string sound() const override { return "Woof"; }
    };
    Dog d;
    cout << d.sound() << endl;`),
        },
        {
          wrong: PP(String.raw`    class Shape {
    public:
        virtual double area() const = 0;
    };
    class Square : public Shape {
        double side = 2;
    public:
        double perimeter() const { return 4 * side; }
    };
    Square s;
    cout << s.perimeter() << endl;`),
          why: '`Square` never provided `area()`, so it is still abstract, and no `Square` object can be made. A derived class must override **every** pure virtual method before it can be instantiated.',
          right: PP(String.raw`    class Shape {
    public:
        virtual double area() const = 0;
    };
    class Square : public Shape {
        double side = 2;
    public:
        double area() const override { return side * side; }
        double perimeter() const { return 4 * side; }
    };
    Square s;
    cout << s.perimeter() << endl;`),
        },
        {
          logic: true,
          wrong: PP(String.raw`    class Animal {
    public:
        string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string sound() const { return "Woof"; }
    };
    Dog d;
    const Animal &a = d;
    cout << a.sound() << endl;`),
          why: 'The base method is **not `virtual`**, so the call through the `Animal` reference uses the Animal version and prints `...`. No error appears, and the Dog never gets to speak. Add `virtual` to the base method.',
          right: PP(String.raw`    class Animal {
    public:
        virtual string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string sound() const override { return "Woof"; }
    };
    Dog d;
    const Animal &a = d;
    cout << a.sound() << endl;`),
        },
        {
          logic: true,
          wrong: PP(String.raw`    class Animal {
    public:
        virtual string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string sound() const override { return "Woof"; }
    };
    Dog d;
    Animal a = d;
    cout << a.sound() << endl;`),
          why: '`Animal a = d;` **slices**: it copies only the Animal part into a brand-new Animal, so `a.sound()` is the Animal version. Use a reference (`const Animal &a = d;`) or a pointer to keep the real object.',
          right: PP(String.raw`    class Animal {
    public:
        virtual string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string sound() const override { return "Woof"; }
    };
    Dog d;
    const Animal &a = d;
    cout << a.sound() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'What does `virtual` do?', options: ['The version of the real object is chosen when the program runs', 'It makes the method run faster', 'It makes the method private', 'It stops the method being overridden'], answer: 0, explain: 'A `virtual` call looks at the **actual object** behind a base reference or pointer and runs its version.' },
    { t: 'quiz', question: 'What is true of a class with a pure virtual method (`= 0`)?', options: ['You cannot create objects of it, only of derived classes that implement the method', 'It cannot have any other methods', 'It cannot be used as a base class', 'It must have no constructor'], answer: 0, explain: 'It is abstract: a contract. Derived classes must fill in every pure virtual method before objects of them can exist.' },
    {
      t: 'recap',
      items: [
        '`virtual` in the base + a call through a **base reference or pointer** = the real object’s version runs (polymorphism). Add `override` in the derived class so the compiler checks the signature.',
        '`= 0` makes a method **pure virtual**, so the class is **abstract**: an interface that cannot be instantiated and must be implemented by derived classes.',
        'Never copy into a base object (`Animal a = d;`): it **slices** off the derived part. Use references or pointers.',
        'A base class used polymorphically needs a **virtual destructor**.',
        'Objects whose number is not known are made with `new` and given back with `delete` (smart pointers later make this safe).',
      ],
      memory: 'Same call, the real object answers.',
    },
  ],
  exercises: [
    {
      id: 'cppp12-shapes',
      title: 'Total area',
      prompt: 'Write an **abstract** base class `Shape` (with `area() const` and `name() const`) and the derived classes `Rectangle`, `Circle` and `Triangle`. Read lines until the input ends: `rect W H`, `circle R` or `tri B H` (a triangle from its base and height). Keep the shapes in a `vector<Shape *>` and print each as `NAME area A`, then `Total area T`, with **two decimals** (use 3.14159 for pi). Delete the shapes at the end.\n\n`Rectangle area 12.00`\n`Circle area 12.57`\n`Total area 24.57`',
      starter: PPF('// Write Shape, Rectangle, Circle and Triangle here\n', '    // Read the lines, make the shapes, print the areas'),
      tests: [
        { input: 'rect 3 4 circle 2', expected: 'Rectangle area 12.00\nCircle area 12.57\nTotal area 24.57' },
        { input: 'tri 4 5', expected: 'Triangle area 10.00\nTotal area 10.00', hidden: true },
        { input: 'rect 1 1 rect 2 2', expected: 'Rectangle area 1.00\nRectangle area 4.00\nTotal area 5.00', hidden: true },
        { input: 'circle 1', expected: 'Circle area 3.14\nTotal area 3.14', hidden: true },
      ],
      hints: [
        'Make the base methods pure virtual (`= 0`) and the destructor `virtual`. Each derived class overrides both methods with `override`.',
        'Read the kind, then the numbers it needs, and `push_back(new Rectangle(w, h))` (and so on) into a `vector<Shape *>`.',
        'Loop over the vector calling `s->name()` and `s->area()` (the **real** shape answers). Print with `cout << fixed << setprecision(2);`, add up the total, and `delete` each shape at the end.',
      ],
    },
    {
      id: 'cppp12-payroll',
      title: 'Different ways to be paid',
      prompt: 'Write an abstract class `Worker` (a name and a pure virtual `int pay() const`) with three derived classes:\n\n* `Salaried`: a fixed monthly amount\n* `Hourly`: a rate times the hours worked\n* `Commission`: a base amount plus **5 percent** of the sales (use whole-number maths: `sales * 5 / 100`)\n\nRead lines: `salaried NAME AMOUNT`, `hourly NAME RATE HOURS` or `commission NAME BASE SALES` until the input ends. Print `NAME: PAY` for each and then `Total: T`.',
      starter: PPF('// Write the Worker classes here\n', '    // Read the lines, make the workers, print the pay and the total'),
      tests: [
        { input: 'salaried amina 300000 hourly peter 5000 40 commission kato 100000 2000000', expected: 'amina: 300000\npeter: 200000\nkato: 200000\nTotal: 700000' },
        { input: 'hourly jo 1000 0', expected: 'jo: 0\nTotal: 0', hidden: true },
        { input: 'commission li 50000 100', expected: 'li: 50005\nTotal: 50005', hidden: true },
        { input: 'salaried a 1 salaried b 2', expected: 'a: 1\nb: 2\nTotal: 3', hidden: true },
      ],
      hints: [
        'The base has `virtual int pay() const = 0;` and a virtual destructor. Each derived class overrides `pay()`.',
        'Keep the workers in a `vector<Worker *>` so that one loop can print them all, whatever kind each one is.',
        'Add up the total by calling `w->pay()` in the loop, and `delete` every worker at the end.',
      ],
    },
    {
      id: 'cppp12-notify',
      title: 'One message, three channels',
      prompt: 'Write an abstract class `Notifier` with a pure virtual `string format(const string &msg) const`, and three derived classes: `Sms` (adds `[SMS] ` in front), `Email` (adds `[Email] ` in front and ` -- Mama Rose` at the end) and `WhatsApp` (adds `[WA] ` in front). Write a function `void deliver(const Notifier &n, const string &msg)` that prints the formatted message. Read lines of the form `channel word` (the message is one word) until the input ends, and deliver each one through the right object, for example: `[SMS] karibu`',
      starter: PPF('// Write the Notifier classes and deliver here\n', '    // Read the channel and the message, deliver it'),
      tests: [
        { input: 'sms karibu email asante wa hello', expected: '[SMS] karibu\n[Email] asante -- Mama Rose\n[WA] hello' },
        { input: 'email a', expected: '[Email] a -- Mama Rose', hidden: true },
        { input: 'wa x wa y', expected: '[WA] x\n[WA] y', hidden: true },
      ],
      hints: [
        'The function `deliver` must take the **base** type by reference: `const Notifier &n`. It calls `n.format(msg)`, and the right version runs.',
        'In `main`, make the right derived object depending on the channel word (`Sms s; deliver(s, msg);`).',
        'Each derived `format` builds its text with `+`. Remember to mark them `const override`.',
      ],
    },
    {
      id: 'cppp12-discount',
      title: 'Discounts as objects',
      prompt: 'Write an abstract class `Discount` with `virtual int apply(int price) const = 0;` and three derived classes: `NoDiscount` (price unchanged), `PercentOff` (made from a percentage, takes that percent off, using whole-number maths `price * (100 - p) / 100`) and `FlatOff` (made from an amount, never going below 0). Read lines `none PRICE`, `percent P PRICE` or `flat F PRICE` until the input ends and print the final price of each, for example: `4500`',
      starter: PPF('// Write the Discount classes here\n', '    // Read the lines, choose the discount, print the final price'),
      tests: [
        { input: 'none 5000 percent 10 5000 flat 500 5000', expected: '5000\n4500\n4500' },
        { input: 'flat 9000 100', expected: '0', hidden: true },
        { input: 'percent 50 3000 percent 0 3000', expected: '1500\n3000', hidden: true },
        { input: 'none 0', expected: '0', hidden: true },
      ],
      hints: [
        'Each discount class overrides `apply`. `FlatOff` returns the price minus the amount, but never less than 0.',
        'Write `int finalPrice(const Discount &d, int price)` or call `d.apply(price)` directly on the object you created.',
        'Read the kind first. For `percent` and `flat` read the number next, then the price; for `none` read only the price.',
      ],
    },
  ],
};
