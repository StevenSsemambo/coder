// C++ Pro, Level 2: Classes and objects. Lesson 11 (inheritance).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_I = '#include <iostream>\n#include <string>\n#include <vector>';
const PI = (body) => progPro(body, INC_I);
const PIF = (above, body, inc = INC_I) => progProFn(above, body, inc);

const STAFF = String.raw`class Employee {
protected:
    string name;
    int pay;
public:
    Employee(string n, int p) : name(n), pay(p) {}
    string getName() const { return name; }
    int monthlyPay() const { return pay; }
};

class Cashier : public Employee {
    int tills;
public:
    Cashier(string n, int p, int t) : Employee(n, p), tills(t) {}
    int bonus() const { return tills * 1000; }
};`;

export const inheritanceLesson = {
  id: 'cppp-inheritance',
  level: LEVEL,
  minutes: 32,
  title: 'Inheritance: reuse a class and extend it',
  summary: 'Base and derived classes, protected, calling base constructors, overriding, and the order objects are built and destroyed',
  blocks: [
    {
      t: 'story',
      title: 'The staff of the stand',
      text: 'Mama Rose now has staff. Every employee has a **name** and a **monthly pay**. A **cashier** is an employee who also handles tills and earns a bonus for each one. A **cook** is an employee who also has a speciality. She does not want to write “name and pay” again for every job. She wants to say: “a cashier is an employee, **plus** a few extra things.”\n\nThat is **inheritance**. A **derived** class (Cashier) starts with everything its **base** class (Employee) has, and adds or changes only what is different. It models an **“is-a”** relationship: a cashier **is an** employee.',
    },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

` + STAFF + String.raw`

int main() {
    Cashier c("Amina", 300000, 3);
    cout << c.getName() << " earns " << c.monthlyPay() << " plus bonus " << c.bonus() << endl;
    return 0;
}
`,
      output: 'Amina earns 300000 plus bonus 3000',
    },
    {
      t: 'list',
      items: [
        '`class Cashier : public Employee` means “a Cashier **is an** Employee”. Everything public in `Employee` is public in `Cashier` too. (Use `public` here; it is almost always what you want.)',
        'The derived constructor **must build the base part first**, by calling a base constructor in its initializer list: `Employee(n, p)`. Without this, C++ tries the default base constructor and complains if there is none.',
        '`protected:` is between private and public: members that **derived classes** may use but **outside code** may not.',
        'A derived class has **no access** to the base class’s `private` members. If a derived class needs them, make them `protected` or give the base a public method.',
      ],
    },
    { t: 'analogy', text: 'A derived class is like a **specialised version of a form**. The base form (name, pay) is printed first, and the cashier form adds an extra box at the bottom. You get everything on the first part without rewriting it.' },
    { t: 'h', text: 'Built from the bottom up, destroyed from the top down' },
    { t: 'p', text: 'When you create a derived object, the **base part is constructed first**, then the derived part. When it is destroyed, it goes in the **reverse** order: the derived part is destroyed first and the base part last. This keeps every layer safe, because a layer can always rely on the layers beneath it.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base" << endl; }
    ~Base() { cout << "~Base" << endl; }
};

class Derived : public Base {
public:
    Derived() { cout << "Derived" << endl; }
    ~Derived() { cout << "~Derived" << endl; }
};

int main() {
    Derived d;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['Base\nDerived\n~Derived\n~Base', 'Derived\nBase\n~Base\n~Derived', 'Base\nDerived\n~Base\n~Derived', 'Derived\n~Derived'],
      answer: 0,
      explain: 'Construction goes **base first**: Base, then Derived. Destruction goes in reverse: ~Derived first, then ~Base.',
    },
    { t: 'h', text: 'Overriding: same name, new behaviour' },
    { t: 'p', text: 'A derived class can write a method with the **same name** as one in the base. Called on a derived object, the derived version wins. The base version is still reachable by naming the class: `Employee::describe()`. This is handy for extending what the base does instead of replacing it.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
protected:
    string name;
public:
    Employee(string n) : name(n) {}
    string describe() const { return name + " (employee)"; }
};

class Cook : public Employee {
public:
    Cook(string n) : Employee(n) {}
    string describe() const { return Employee::describe() + ", cook"; }
};

int main() {
    Cook c("Peter");
    cout << c.describe() << endl;
    return 0;
}
`,
      output: 'Peter (employee), cook',
    },
    { t: 'p', text: 'There is a catch, and it is the subject of the **next lesson**. Look at what happens when a function receives the **base type** but is handed a derived object.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
public:
    string title() const { return "Employee"; }
};

class Cashier : public Employee {
public:
    string title() const { return "Cashier"; }
};

void show(const Employee &e) {
    cout << e.title() << endl;
}

int main() {
    Cashier c;
    show(c);
    cout << c.title() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['Employee\nCashier', 'Cashier\nCashier', 'Employee\nEmployee', 'Cashier\nEmployee'],
      answer: 0,
      explain: 'This is the surprise. Inside `show`, the object is seen **as an Employee**, and without extra help C++ calls the **Employee** version of `title()`, even though the real object is a Cashier. Only the direct call `c.title()` finds the Cashier version. The fix is the keyword `virtual`, in the next lesson.',
    },
    { t: 'h', text: 'Is-a, or something else?' },
    { t: 'p', text: 'Use inheritance only when the sentence “a Cashier **is an** Employee” is really true, **everywhere** you could use an Employee. “A Till is an Employee” is false, and so is “an Order is a list of items”: there the relationship is “**has a**”, and you store one object **inside** another instead. Lesson 13 is about choosing between the two.' },
    {
      t: 'fill',
      prompt: 'Fill the gap so that a Cashier is a public Employee, and main may call getName().',
      template: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
    string name;
public:
    Employee(string n) : name(n) {}
    string getName() const { return name; }
};

class Cashier : ___ Employee {
public:
    Cashier(string n) : Employee(n) {}
};

int main() {
    Cashier c("Amina");
    cout << c.getName() << endl;
    return 0;
}
`,
      blanks: [{ options: ['public', 'private', 'virtual'], answer: 'public' }],
      output: 'Amina',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
    string name;
public:
    Employee(string n) : name(n) {}
    string getName() const { return name; }
};

class Cashier : public Employee {
    int tills;
public:
    Cashier(int t) : tills(t) {}
    int count() const { return tills; }
};

int main() {
    Cashier c(3);
    cout << c.count() << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['Employee has no default constructor, so Cashier must call Employee(n) in its initializer list', 'tills must be public', 'count() cannot be const', 'A derived class cannot have a constructor'],
      answer: 0,
      explain: 'Every Cashier contains an Employee part, and it has to be built too. `Employee` can only be built from a name, and the `Cashier` constructor did not say which. Give it the name, and pass it on: `Cashier(string n, int t) : Employee(n), tills(t) {}`.',
      fixed: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
    string name;
public:
    Employee(string n) : name(n) {}
    string getName() const { return name; }
};

class Cashier : public Employee {
    int tills;
public:
    Cashier(string n, int t) : Employee(n), tills(t) {}
    int count() const { return tills; }
};

int main() {
    Cashier c("Amina", 3);
    cout << c.count() << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PIF(STAFF, String.raw`    Cashier c("Amina", 300000, 3);
    cout << c.pay << endl;`),
          why: '`pay` is `protected`: derived classes may use it, but code **outside** the family (like `main`) may not. Use the public method `monthlyPay()`.',
          right: PIF(STAFF, String.raw`    Cashier c("Amina", 300000, 3);
    cout << c.monthlyPay() << endl;`),
        },
        {
          wrong: PI(String.raw`    class Employee {
        int secret = 42;
    };
    class Cashier : public Employee {
    public:
        int peek() const { return secret; }
    };
    Cashier c;
    cout << c.peek() << endl;`),
          why: '`secret` is `private` in `Employee`, and **even derived classes** cannot see a base’s private members. Make it `protected` if derived classes need it, or give `Employee` a public getter.',
          right: PI(String.raw`    class Employee {
    protected:
        int secret = 42;
    };
    class Cashier : public Employee {
    public:
        int peek() const { return secret; }
    };
    Cashier c;
    cout << c.peek() << endl;`),
        },
        {
          wrong: PI(String.raw`    class Animal {
    public:
        string sound() const { return "..."; }
    };
    class Dog : Animal {
    public:
        string bark() const { return "Woof"; }
    };
    Dog d;
    cout << d.sound() << endl;`),
          why: 'Without the word `public`, a `class` inherits **privately** by default, so everything from `Animal` becomes private inside `Dog` and outside code cannot call `d.sound()`. Write `class Dog : public Animal`.',
          right: PI(String.raw`    class Animal {
    public:
        string sound() const { return "..."; }
    };
    class Dog : public Animal {
    public:
        string bark() const { return "Woof"; }
    };
    Dog d;
    cout << d.sound() << endl;`),
        },
        {
          logic: true,
          wrong: PI(String.raw`    class Employee {
    public:
        string title() const { return "Employee"; }
    };
    class Cashier : public Employee {
    public:
        string title() const { return "Cashier"; }
    };
    Cashier c;
    const Employee &e = c;
    cout << e.title() << endl;`),
          why: 'The reference `e` is typed as `Employee`, so without `virtual` the **Employee** version is called, even though the object really is a Cashier. The program prints Employee, with no error. The next lesson fixes this with `virtual`.',
          right: PI(String.raw`    class Employee {
    public:
        string title() const { return "Employee"; }
    };
    class Cashier : public Employee {
    public:
        string title() const { return "Cashier"; }
    };
    Cashier c;
    cout << c.title() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'Who can use a `protected` member of Employee?', options: ['Employee and the classes derived from it', 'Anyone', 'Only Employee itself', 'Only main'], answer: 0, explain: '`protected` opens a member to the class **and its descendants**, but not to the outside world.' },
    { t: 'quiz', question: 'A Cashier object is created. Which constructor runs first?', options: ['Employee’s (the base)', 'Cashier’s (the derived)', 'Both at once', 'It depends on the compiler'], answer: 0, explain: 'The base part is always built first, so that the derived part can rely on it being ready.' },
    {
      t: 'recap',
      items: [
        '`class Cashier : public Employee` makes a Cashier **an** Employee, with all its public and protected members, plus its own.',
        'The derived constructor calls the base constructor in its initializer list: `Cashier(...) : Employee(n, p), tills(t) {}`.',
        '`protected` members are open to derived classes but closed to the outside. Private members of the base stay private from the derived class too.',
        'Objects are built base first and destroyed derived first. A derived method can reuse the base one with `Employee::describe()`.',
        'Without `virtual`, a call through a **base** reference or pointer uses the **base** version. Lesson 12 fixes that.',
      ],
      memory: 'A cashier is an employee, plus extras.',
    },
  ],
  exercises: [
    {
      id: 'cppp11-vehicles',
      title: 'Boda, taxi and lorry',
      prompt: 'Write a base class `Vehicle` made from a **kind** (text), a **name** and a number of **wheels**, and three derived classes `Boda` (2 wheels), `Taxi` (4 wheels) and `Lorry` (6 wheels), each with its own `int fare(int km) const`:\n\n* boda: 2000 plus 1000 per km\n* taxi: 5000 plus 1500 per km\n* lorry: 10000 plus 2500 per km\n\nRead `kind name km` triples until the input ends, make the right object, and print `NAME (KIND, W wheels): FARE`, for example: `amina (boda, 2 wheels): 7000`',
      starter: PIF('// Write Vehicle, Boda, Taxi and Lorry here\n', '    // Read kind, name and km, make the right vehicle, print the line'),
      tests: [
        { input: 'boda amina 5 taxi peter 10', expected: 'amina (boda, 2 wheels): 7000\npeter (taxi, 4 wheels): 20000' },
        { input: 'boda a 0', expected: 'a (boda, 2 wheels): 2000', hidden: true },
        { input: 'taxi b 1', expected: 'b (taxi, 4 wheels): 6500', hidden: true },
        { input: 'lorry c 2', expected: 'c (lorry, 6 wheels): 15000', hidden: true },
      ],
      hints: [
        '`Vehicle` keeps `kind`, `name` and `wheels` (protected or private with getters). Each derived constructor calls `Vehicle(kind, name, wheels)` in its initializer list.',
        'Each derived class has its own `fare(int km) const`: for example `return 2000 + 1000 * km;` in `Boda`.',
        'In `main`, use `if (kind == "boda") { Boda v(name); cout << ... v.fare(km); }` and so on. Make a shared function for the description, or write the line three times.',
      ],
    },
    {
      id: 'cppp11-staff',
      title: 'Who earns what',
      prompt: 'Write a base class `Employee` (a name and a base pay of **300000**) and two derived classes: `Cashier`, which earns **1000 more for each till** it handles, and `Manager`, which earns **20000 more for each team member**. Read lines of the form `cashier NAME TILLS` or `manager NAME TEAM` until the input ends, and print `NAME earns PAY`, for example: `amina earns 303000`',
      starter: PIF('// Write Employee, Cashier and Manager here\n', '    // Read the lines, make the right employee, print the pay'),
      tests: [
        { input: 'cashier amina 3 manager peter 5', expected: 'amina earns 303000\npeter earns 400000' },
        { input: 'cashier kato 0', expected: 'kato earns 300000', hidden: true },
        { input: 'manager jo 0 cashier li 10', expected: 'jo earns 300000\nli earns 310000', hidden: true },
        { input: 'manager big 12', expected: 'big earns 540000', hidden: true },
      ],
      hints: [
        '`Employee` has a constructor from the name, a `getName() const` and a `pay() const` returning 300000.',
        '`Cashier` and `Manager` call `Employee(name)` in their initializer lists, store their extra number, and each write their own `total() const`.',
        'In `main`, read the kind, the name and the number, then make a `Cashier` or a `Manager` and print `getName() << " earns " << total()`.',
      ],
    },
    {
      id: 'cppp11-layers',
      title: 'Layered greetings',
      prompt: 'Write three classes in a chain: `Person` (made from a name), `Student` (derived from `Person`) and `Prefect` (derived from `Student`). Each constructor prints its class name and the person’s name, and each destructor prints a `~` in front of them. Read a name, create a `Prefect`, and print `done`. For `Amina` the output is:\n\n`Person Amina`\n`Student Amina`\n`Prefect Amina`\n`done`\n`~Prefect Amina`\n`~Student Amina`\n`~Person Amina`',
      starter: PIF('// Write Person, Student and Prefect here\n', '    // Read a name, create a Prefect, print done'),
      tests: [
        { input: 'Amina', expected: 'Person Amina\nStudent Amina\nPrefect Amina\ndone\n~Prefect Amina\n~Student Amina\n~Person Amina' },
        { input: 'Kato', expected: 'Person Kato\nStudent Kato\nPrefect Kato\ndone\n~Prefect Kato\n~Student Kato\n~Person Kato', hidden: true },
      ],
      hints: [
        '`Person(string n) : name(n) { cout << "Person " << name << endl; }`. Keep the name in a `protected` member so the derived classes can print it.',
        '`Student(string n) : Person(n) { ... }` and `Prefect(string n) : Student(n) { ... }`: each one passes the name down to the layer below.',
        'Write a destructor in each class. You do not call them: they run by themselves in the reverse order at the end of `main`.',
      ],
    },
  ],
};
