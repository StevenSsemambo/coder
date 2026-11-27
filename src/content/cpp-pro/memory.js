// C++ Pro, Level 3: Generic and modern C++. Lesson 18 (new/delete, ownership, RAII, smart pointers).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 3: Generic and modern C++';
const INC_MEM = '#include <iostream>\n#include <string>\n#include <vector>\n#include <memory>\n#include <utility>';
const INC_MEMF = INC_MEM + '\n#include <iomanip>';
const PMEM = (body) => progPro(body, INC_MEM);
const PMEMF = (above, body, inc = INC_MEM) => progProFn(above, body, inc);

const TAG = String.raw`class Tag {
    string name;
public:
    Tag(string n) : name(n) { cout << "make " << name << endl; }
    ~Tag() { cout << "free " << name << endl; }
    string getName() const { return name; }
};`;

export const memoryLesson = {
  id: 'cppp-memory',
  level: LEVEL,
  minutes: 36,
  title: 'Memory and ownership: new, delete and smart pointers',
  summary: 'The stack and the heap, who is responsible for giving memory back, and unique_ptr and shared_ptr doing it for you',
  blocks: [
    {
      t: 'story',
      title: 'Who gives the stall key back?',
      text: 'Most things in a C++ program live in a place that **tidies itself**: a variable made inside a function disappears when the function ends. This place is called the **stack**. But sometimes you need something to live **longer** than the function that made it, or to be created **while the program runs**, in a number you did not know in advance. For that, you **rent** space from the **heap**, with `new`.\n\nRenting comes with a duty: the space must be **given back** with `delete`, exactly once. Forget, and the space is lost until the program ends (a **leak**). Give it back twice, or use it after giving it back, and the program can crash. The question “**who is responsible for giving it back?**” is called **ownership**, and good C++ is about making the answer obvious.',
    },
    { t: 'p', text: 'Compare a stack object with a heap object. The class below announces when it is made and when it is freed.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

` + TAG + String.raw`

int main() {
    Tag a("stack");
    Tag *b = new Tag("heap");
    cout << "using " << a.getName() << " and " << b->getName() << endl;
    delete b;
    cout << "end" << endl;
    return 0;
}
`,
      output: 'make stack\nmake heap\nusing stack and heap\nfree heap\nend\nfree stack',
    },
    {
      t: 'list',
      items: [
        '`new Tag("heap")` makes the object on the heap and gives back a **pointer** to it. `delete b;` runs its destructor and returns the space.',
        'The stack object `a` is freed **automatically** at the end of `main`. The heap object lives until **you** say `delete`.',
        '**Forgetting `delete`** is a leak: the destructor never runs, and the space is lost. **Deleting twice**, or using the pointer afterwards, is a serious bug.',
        'So: **do not use `new` and `delete` by hand in modern C++.** Use ordinary variables, `vector` and `string` (which look after their own memory), and **smart pointers** when you need the heap.',
      ],
    },
    { t: 'h', text: 'unique_ptr: exactly one owner' },
    { t: 'p', text: 'A **`unique_ptr<T>`** owns one heap object and **deletes it automatically** when the `unique_ptr` itself ends. You create it with `make_unique<T>(...)`. There is **no `delete` to forget**. This idea, that an object **owns** a resource and gives it back in its destructor, is called **RAII**.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <memory>
using namespace std;

` + TAG + String.raw`

int main() {
    {
        auto p = make_unique<Tag>("owned");
        cout << "inside " << p->getName() << endl;
    }
    cout << "after" << endl;
    return 0;
}
`,
      output: 'make owned\ninside owned\nfree owned\nafter',
    },
    { t: 'p', text: 'There is only **one** owner, so a `unique_ptr` **cannot be copied**. It can be **moved** with `std::move`, which hands ownership to someone else, and the old one becomes empty.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <memory>
#include <utility>
using namespace std;

` + TAG + String.raw`

int main() {
    auto p = make_unique<Tag>("gift");
    auto q = move(p);
    if (!p) {
        cout << "p is empty" << endl;
    }
    cout << "q owns " << q->getName() << endl;
    return 0;
}
`,
      output: 'make gift\np is empty\nq owns gift\nfree gift',
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
#include <memory>
using namespace std;

` + TAG + String.raw`

int main() {
    auto a = make_unique<Tag>("a");
    auto b = make_unique<Tag>("b");
    cout << "end" << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['make a\nmake b\nend\nfree b\nfree a', 'make a\nmake b\nend\nfree a\nfree b', 'make a\nmake b\nfree b\nfree a\nend', 'end\nmake a\nmake b'],
      answer: 0,
      explain: 'Smart pointers are ordinary variables, so they are destroyed in **reverse order** of creation at the end of `main`, and each one frees what it owns: b first, then a.',
    },
    { t: 'h', text: 'shared_ptr: several owners' },
    { t: 'p', text: 'Sometimes several parts of a program really do share one object, and it should be freed when the **last** one lets go. A **`shared_ptr<T>`** keeps a **counter**: copying it adds one, and each one that ends subtracts one. When the count reaches 0, the object is freed. `use_count()` shows the counter. Use `shared_ptr` only when ownership is really shared: `unique_ptr` is the default.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <memory>
using namespace std;

` + TAG + String.raw`

int main() {
    auto a = make_shared<Tag>("shared");
    {
        auto b = a;
        cout << "count " << a.use_count() << endl;
    }
    cout << "count " << a.use_count() << endl;
    return 0;
}
`,
      output: 'make shared\ncount 2\ncount 1\nfree shared',
    },
    { t: 'h', text: 'Smart pointers and polymorphism' },
    { t: 'p', text: 'In lesson 12 you stored shapes in a `vector<Shape *>` and had to `delete` each one. With `unique_ptr` the vector **owns** the shapes, and they are freed **by themselves**. This is how modern C++ keeps a list of different objects.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
#include <memory>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() {}
};

class Square : public Shape {
    double s;
public:
    Square(double side) : s(side) {}
    double area() const override { return s * s; }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

int main() {
    vector<unique_ptr<Shape>> shapes;
    shapes.push_back(make_unique<Square>(3));
    shapes.push_back(make_unique<Rect>(2, 5));
    double total = 0;
    for (const auto &s : shapes) {
        total += s->area();
    }
    cout << "Total: " << total << endl;
    return 0;
}
`,
      output: 'Total: 19',
    },
    { t: 'tip', text: 'Rules of thumb for memory: (1) use plain variables, `vector` and `string` first. (2) When you need an object on the heap, or polymorphism, use `make_unique`. (3) Use `shared_ptr` only for really shared ownership. (4) Never `delete` something you did not create with `new`, and never delete twice. (5) Raw `new`/`delete` belong to old code.' },
    {
      t: 'fill',
      prompt: 'Fill the gap so the Tag is created and owned by a unique_ptr.',
      template: String.raw`#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Tag {
public:
    Tag(string n) { cout << "make " << n << endl; }
    ~Tag() { cout << "free" << endl; }
};

int main() {
    auto p = ___<Tag>("x");
    return 0;
}
`,
      blanks: [{ options: ['make_unique', 'new', 'unique'], answer: 'make_unique' }],
      output: 'make x\nfree',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Tag {
public:
    Tag() { cout << "make" << endl; }
    ~Tag() { cout << "free" << endl; }
};

int main() {
    auto a = make_unique<Tag>();
    auto b = a;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['A unique_ptr has exactly one owner, so it cannot be copied', 'make_unique needs an argument', 'Tag needs a destructor', 'b must be declared with new'],
      answer: 0,
      explain: 'If two `unique_ptr`s held the same object, both would try to free it. So copying is forbidden. Hand it over with `auto b = move(a);` (and then `a` is empty), or use a `shared_ptr` if both really should own it.',
      fixed: String.raw`#include <iostream>
#include <string>
#include <memory>
#include <utility>
using namespace std;

class Tag {
public:
    Tag() { cout << "make" << endl; }
    ~Tag() { cout << "free" << endl; }
};

int main() {
    auto a = make_unique<Tag>();
    auto b = move(a);
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PMEM(String.raw`    unique_ptr<int> p = new int(5);
    cout << *p << endl;`),
          why: 'A `unique_ptr` must be built on purpose, not by a plain assignment from a raw pointer. Use `make_unique`: `auto p = make_unique<int>(5);`.',
          right: PMEM(String.raw`    auto p = make_unique<int>(5);
    cout << *p << endl;`),
        },
        {
          wrong: PMEMF(TAG, String.raw`    auto a = make_unique<Tag>("a");
    auto b = a;
    cout << "ok" << endl;`),
          why: 'The same rule as in the bug: one owner only, so a `unique_ptr` cannot be copied. Use `move(a)` to hand it over.',
          right: PMEMF(TAG, String.raw`    auto a = make_unique<Tag>("a");
    auto b = move(a);
    cout << "ok" << endl;`),
        },
        {
          logic: true,
          wrong: PMEMF(TAG, String.raw`    Tag *t = new Tag("lost");
    cout << "using " << t->getName() << endl;`),
          why: 'There is no `delete t;`, so the destructor **never runs** (no “free lost” line) and the space is leaked. No error appears. Use `auto t = make_unique<Tag>("lost");` and the tidy-up becomes automatic.',
          right: PMEMF(TAG, String.raw`    auto t = make_unique<Tag>("lost");
    cout << "using " << t->getName() << endl;`),
        },
        {
          logic: true,
          wrong: PMEM(String.raw`    struct B;
    struct A {
        shared_ptr<B> other;
        ~A() { cout << "free A" << endl; }
    };
    struct B {
        shared_ptr<A> other;
        ~B() { cout << "free B" << endl; }
    };
    auto a = make_shared<A>();
    auto b = make_shared<B>();
    a->other = b;
    b->other = a;
    cout << "end" << endl;`),
          why: 'A owns B and B owns A, a **cycle**, so each count stays at 1 forever. Neither is ever freed: no “free” lines appear, and the memory leaks. The fix is to make one direction a **`weak_ptr`**, a non-owning observer that does not add to the count.',
          right: PMEM(String.raw`    struct B;
    struct A {
        shared_ptr<B> other;
        ~A() { cout << "free A" << endl; }
    };
    struct B {
        weak_ptr<A> other;
        ~B() { cout << "free B" << endl; }
    };
    auto a = make_shared<A>();
    auto b = make_shared<B>();
    a->other = b;
    b->other = a;
    cout << "end" << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'What does a `unique_ptr` do when it goes out of scope?', options: ['Deletes the object it owns, automatically', 'Nothing: you must delete', 'Copies the object', 'Prints an error'], answer: 0, explain: 'Freeing the object is its job. That is RAII: the resource is tied to the life of an ordinary variable.' },
    { t: 'quiz', question: 'When is the object inside a `shared_ptr` freed?', options: ['When the last shared_ptr that owns it ends', 'When the first one ends', 'Never', 'When you call delete'], answer: 0, explain: 'The counter goes down each time an owner ends. At zero, the object is freed.' },
    {
      t: 'recap',
      items: [
        'The stack tidies itself. The heap is rented with `new` and **must be given back** exactly once. Forget it and you leak, delete twice and you crash.',
        '**Ownership** says who must free something. **RAII**: an object owns a resource and releases it in its destructor.',
        '`make_unique<T>(...)` gives a `unique_ptr`: one owner, freed automatically, **cannot be copied**, can be moved with `std::move`.',
        '`make_shared<T>(...)` gives a `shared_ptr`: a counter of owners (`use_count()`), freed when the last owner ends. A cycle of shared_ptrs leaks: break it with `weak_ptr`.',
        'Prefer plain variables, `vector` and `string`. A `vector<unique_ptr<Base>>` is the modern list of polymorphic objects.',
      ],
      memory: 'The owner gives the key back.',
    },
  ],
  exercises: [
    {
      id: 'cppp18-move',
      title: 'Hand over the object',
      prompt: 'Write a class `Tag` made from a name: its constructor prints `make NAME` and its destructor prints `free NAME`. Write a function `void consume(unique_ptr<Tag> t)` that prints `consuming` and then ends (so the tag is freed when the function ends). In `main`, read a name, create the tag with `make_unique`, pass it to `consume` with `move`, and then print `after`. For `amina`:\n\n`make amina`\n`consuming`\n`free amina`\n`after`',
      starter: PMEMF('// Write the class Tag and the function consume here\n', '    // Read a name, make the tag, move it into consume, print after'),
      tests: [
        { input: 'amina', expected: 'make amina\nconsuming\nfree amina\nafter' },
        { input: 'x', expected: 'make x\nconsuming\nfree x\nafter', hidden: true },
        { input: 'Peter', expected: 'make Peter\nconsuming\nfree Peter\nafter', hidden: true },
      ],
      hints: [
        'The function takes the `unique_ptr` **by value**: `void consume(unique_ptr<Tag> t)`. When the function ends, its parameter is destroyed, and so the tag.',
        'In `main`: `auto t = make_unique<Tag>(name); consume(move(t)); cout << "after" << endl;`.',
        'Do not print `free` yourself: it comes from the destructor.',
      ],
    },
    {
      id: 'cppp18-shapes',
      title: 'Shapes without delete',
      prompt: 'Write an abstract base class `Shape` (`virtual double area() const = 0;` and a virtual destructor) and the classes `Square` (one side) and `Rect` (width and height). Read lines until the input ends: `square S` or `rect W H`. Keep the shapes in a `vector<unique_ptr<Shape>>` (**no `delete` anywhere**), and print `Shapes: N` and `Total area: A` with **two decimals**, for example:\n\n`Shapes: 2`\n`Total area: 19.00`',
      starter: PMEMF('// Write the Shape classes here\n', '    // Read the shapes into a vector of unique_ptr', INC_MEMF),
      tests: [
        { input: 'square 3 rect 2 5', expected: 'Shapes: 2\nTotal area: 19.00' },
        { input: 'rect 1 1', expected: 'Shapes: 1\nTotal area: 1.00', hidden: true },
        { input: '', expected: 'Shapes: 0\nTotal area: 0.00', hidden: true },
        { input: 'square 2 square 2 square 2', expected: 'Shapes: 3\nTotal area: 12.00', hidden: true },
      ],
      hints: [
        'Make the base class abstract and give it a `virtual ~Shape() {}`.',
        'Add shapes with `shapes.push_back(make_unique<Square>(s));` and `make_unique<Rect>(w, h)`.',
        'Add up `s->area()` in a loop over the vector and print with `cout << fixed << setprecision(2);`.',
      ],
    },
    {
      id: 'cppp18-shared',
      title: 'Counting the owners',
      prompt: 'Write a class `Tag` made from a name (constructor prints `make NAME`, destructor prints `free NAME`). Read a name and create **one** tag with `make_shared`. Keep a `vector<shared_ptr<Tag>>` of extra owners. Then read commands until the input ends: `share` (adds one more owner of the same tag), `drop` (removes the last extra owner, if any) and `count` (prints `Owners: N`, counting every owner including your first pointer). At the end print `end`. The tag is freed automatically afterwards. For `amina` then `share share count drop count`:\n\n`make amina`\n`Owners: 3`\n`Owners: 2`\n`end`\n`free amina`',
      starter: PMEMF('// Write the class Tag here\n', '    // Read the name, make the shared tag, process the commands'),
      tests: [
        { input: 'amina share share count drop count', expected: 'make amina\nOwners: 3\nOwners: 2\nend\nfree amina' },
        { input: 'x count', expected: 'make x\nOwners: 1\nend\nfree x', hidden: true },
        { input: 'x drop count share count', expected: 'make x\nOwners: 1\nOwners: 2\nend\nfree x', hidden: true },
        { input: 'kato share drop drop count', expected: 'make kato\nOwners: 1\nend\nfree kato', hidden: true },
      ],
      hints: [
        '`auto first = make_shared<Tag>(name);` and `vector<shared_ptr<Tag>> extra;`.',
        '`share` is `extra.push_back(first);` and `drop` is `extra.pop_back();` (only when `extra` is not empty). `first.use_count()` already counts every owner.',
        'Print `end` after the loop. Do not print `free` yourself: the destructor does when the last owner goes away.',
      ],
    },
    {
      id: 'cppp18-pool',
      title: 'The object pool',
      prompt: 'Write a class `Tag` (a name; the destructor prints `free NAME`) and a class `Pool` that owns a `vector<unique_ptr<Tag>>`. Read commands until the input ends: `add NAME` (adds a tag, prints `Added NAME`), `remove NAME` (removes the **first** tag with that name, which frees it at once, or prints `No such tag`) and `list` (prints `Tags: A B C` in order, or `Tags:` when empty). At the end, **free all the remaining tags in the reverse order they were added** (so each prints `free NAME`), after printing `closing`.',
      starter: PMEMF('// Write the classes Tag and Pool here\n', '    // Read the commands until the input ends, then close the pool'),
      tests: [
        { input: 'add a add b add c list remove b list', expected: 'Added a\nAdded b\nAdded c\nTags: a b c\nfree b\nTags: a c\nclosing\nfree c\nfree a' },
        { input: 'remove z list', expected: 'No such tag\nTags:\nclosing', hidden: true },
        { input: 'add x remove x list', expected: 'Added x\nfree x\nTags:\nclosing', hidden: true },
        { input: 'add p add q', expected: 'Added p\nAdded q\nclosing\nfree q\nfree p', hidden: true },
      ],
      hints: [
        'Keep `vector<unique_ptr<Tag>> tags;` in `Pool`. `add` uses `tags.push_back(make_unique<Tag>(name));`.',
        '`remove` finds the first matching tag and calls `tags.erase(tags.begin() + i);`. Erasing a `unique_ptr` destroys its tag, so `free NAME` is printed right then.',
        'At the end of input print `closing`, then free from the back: `while (!tags.empty()) { tags.pop_back(); }`. Do this **yourself** so that the order is exactly the reverse of adding.',
      ],
    },
  ],
};
