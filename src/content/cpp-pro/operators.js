// C++ Pro, Level 2: Classes and objects. Lesson 10 (operator overloading).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_O = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';
const INC_OF = INC_O + '\n#include <iomanip>';
const PO = (body) => progPro(body, INC_O);
const POF = (above, body, inc = INC_O) => progProFn(above, body, inc);

const MONEY = String.raw`class Money {
    int ugx;
public:
    Money(int u = 0) : ugx(u) {}
    int value() const { return ugx; }
    Money operator+(const Money &o) const { return Money(ugx + o.ugx); }
    Money &operator+=(const Money &o) {
        ugx += o.ugx;
        return *this;
    }
    bool operator==(const Money &o) const { return ugx == o.ugx; }
    bool operator<(const Money &o) const { return ugx < o.ugx; }
};

ostream &operator<<(ostream &out, const Money &m) {
    out << m.value() << " UGX";
    return out;
}`;

export const operatorsLesson = {
  id: 'cppp-operators',
  level: LEVEL,
  minutes: 32,
  title: 'Operator overloading: teaching your types to + and <',
  summary: 'Making + == < += and << work for your own classes, so objects read like ordinary numbers',
  blocks: [
    {
      t: 'story',
      title: 'Adding money, not just numbers',
      text: 'Mama Rose’s program has a class `Money` for shillings. It would be nice to write `a + b` to add two amounts, `a < b` to compare them, and `cout << a` to print one, exactly as with plain numbers. But C++ only knows how to add `int`s. It has no idea what it means to add two `Money` objects.\n\nThe good news: **you can teach it.** In C++ every operator (`+`, `==`, `<`, `<<` and many more) is just a function with a special name, like `operator+`. When you write that function for your class, the operator works on your objects. This is called **operator overloading**.',
    },
    { t: 'p', text: 'An operator function for `+` takes the **right-hand** object as its parameter, and the **left-hand** object is the one the method is called on. It should **return a new object** with the answer and leave both of the originals alone.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

class Money {
    int ugx;
public:
    Money(int u = 0) : ugx(u) {}
    int value() const { return ugx; }
    Money operator+(const Money &o) const {
        return Money(ugx + o.ugx);
    }
};

int main() {
    Money a(3000), b(1500);
    Money c = a + b;
    cout << c.value() << endl;
    return 0;
}
`,
      output: '4500',
    },
    {
      t: 'list',
      items: [
        '`a + b` is read by C++ as `a.operator+(b)`. Writing that method makes `+` work.',
        'Make it `const` and take the argument as `const &`: it only **reads** both objects.',
        '`operator==` and `operator<` return a `bool`. `operator+=` changes the left object, so it is **not** `const`, and it returns `*this` (the object itself) so that calls can be chained.',
        'For printing, `cout << m` needs `operator<<`. It cannot be a method of your class (the left side is `cout`), so it is an ordinary function that takes an `ostream &` and the object, writes to the stream, and **returns the stream**.',
        'Keep the meaning **natural**. `+` should add, `==` should compare. Never make `+` do something surprising.',
      ],
    },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

` + MONEY + String.raw`

int main() {
    Money a(3000), b(1500);
    cout << a + b << endl;
    cout << (a == b) << " " << (b < a) << endl;
    return 0;
}
`,
      output: '4500 UGX\n0 1',
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

` + MONEY + String.raw`

int main() {
    Money a(100);
    a += Money(50);
    a += Money(25);
    cout << a << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['175 UGX', '100 UGX', '25 UGX', '150 UGX'],
      answer: 0,
      explain: '`a += Money(50)` changes `a` to 150, and `a += Money(25)` changes it to 175. The `<<` function then prints the value followed by “ UGX”.',
    },
    { t: 'h', text: 'A reward: sort and compare for free' },
    { t: 'p', text: 'Once your class has `operator<`, the **standard algorithms work on it**: `sort`, `max_element`, `min_element` and the `std::map` you will meet later all compare with `<`. You taught the type to compare, and a whole library can now use it.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

` + MONEY + String.raw`

int main() {
    vector<Money> v = {Money(3000), Money(1000), Money(2000)};
    sort(v.begin(), v.end());
    for (const Money &m : v) {
        cout << m << endl;
    }
    cout << "Biggest: " << *max_element(v.begin(), v.end()) << endl;
    return 0;
}
`,
      output: '1000 UGX\n2000 UGX\n3000 UGX\nBiggest: 3000 UGX',
    },
    { t: 'tip', text: 'You only have to write `<` and `==`. Everything else can be built from them: `a > b` is `b < a`, and `a != b` is `!(a == b)`. In this course we use C++17, so write the operators you actually need.' },
    { t: 'h', text: 'Do not overdo it' },
    {
      t: 'list',
      items: [
        'Overload an operator only when its meaning is **obvious** to anyone who reads the code: adding money, comparing times, printing an object.',
        'If you cannot explain the operator in one plain sentence, write a **named method** instead (`add`, `isBefore`, `toString`).',
        'Operators keep their usual priority and cannot be invented: you cannot make a new operator, and you cannot change `+` for plain numbers.',
      ],
    },
    {
      t: 'fill',
      prompt: 'Fill the gap with the operator that this method defines, so that a < b works.',
      template: String.raw`#include <iostream>
using namespace std;

class Money {
    int u;
public:
    Money(int x) : u(x) {}
    bool operator___(const Money &o) const {
        return u < o.u;
    }
};

int main() {
    Money a(1), b(2);
    cout << (a < b) << endl;
    return 0;
}
`,
      blanks: [{ options: ['<', '==', '+'], answer: '<' }],
      output: '1',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
    ostream &operator<<(ostream &out) const {
        out << ugx << " UGX";
        return out;
    }
};

int main() {
    Money m(500);
    cout << m << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['Written as a method, operator<< would need the Money object on the LEFT of <<, but cout is on the left', 'The word UGX cannot be printed', 'Money needs a default constructor', 'ostream cannot be returned'],
      answer: 0,
      explain: 'For a method, `a << b` means `a.operator<<(b)`, so the object on the left must be the class. In `cout << m` the left side is `cout`. So `operator<<` for printing must be an ordinary function outside the class that takes `(ostream &out, const Money &m)`.',
      fixed: String.raw`#include <iostream>
using namespace std;

class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
};

ostream &operator<<(ostream &out, const Money &m) {
    out << m.value() << " UGX";
    return out;
}

int main() {
    Money m(500);
    cout << m << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
};`, String.raw`    Money a(1), b(2);
    Money c = a + b;
    cout << c.value() << endl;`),
          why: 'C++ does not know how to add two `Money` objects until you write `operator+` for the class. Operators are not defined for your own types automatically.',
          right: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
    Money operator+(const Money &o) const { return Money(ugx + o.ugx); }
};`, String.raw`    Money a(1), b(2);
    Money c = a + b;
    cout << c.value() << endl;`),
        },
        {
          wrong: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
};`, String.raw`    vector<Money> v = {Money(2), Money(1)};
    sort(v.begin(), v.end());
    cout << v[0].value() << endl;`),
          why: '`sort` compares items with `<`, and `Money` has no `operator<`. Add `bool operator<(const Money &o) const { return ugx < o.ugx; }` and the same program works.',
          right: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
    bool operator<(const Money &o) const { return ugx < o.ugx; }
};`, String.raw`    vector<Money> v = {Money(2), Money(1)};
    sort(v.begin(), v.end());
    cout << v[0].value() << endl;`),
        },
        {
          logic: true,
          wrong: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    bool operator==(const Money &o) const { return this == &o; }
};`, String.raw`    Money a(500), b(500);
    cout << (a == b ? "equal" : "different") << endl;`),
          why: '`this == &o` asks “are these the very same object in memory?”, which is false for two separate objects even when they hold the same amount. It prints different. Compare the **values**: `ugx == o.ugx`.',
          right: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    bool operator==(const Money &o) const { return ugx == o.ugx; }
};`, String.raw`    Money a(500), b(500);
    cout << (a == b ? "equal" : "different") << endl;`),
        },
        {
          logic: true,
          wrong: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
    Money operator+(const Money &o) {
        ugx += o.ugx;
        return *this;
    }
};`, String.raw`    Money a(100), b(50);
    Money c = a + b;
    cout << a.value() << " " << c.value() << endl;`),
          why: 'This `+` **changes the left operand** `a` as a side effect, so after `c = a + b` the original `a` is 150. Surprising behaviour like this makes code very hard to trust. A `+` must build and return a **new** object and leave both operands alone. (The version that changes the left side is `+=`.)',
          right: POF(String.raw`class Money {
    int ugx;
public:
    Money(int u) : ugx(u) {}
    int value() const { return ugx; }
    Money operator+(const Money &o) const {
        return Money(ugx + o.ugx);
    }
};`, String.raw`    Money a(100), b(50);
    Money c = a + b;
    cout << a.value() << " " << c.value() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'How does C++ read `a + b` when a and b are objects of your class?', options: ['As a.operator+(b)', 'As operator+(a) with b ignored', 'As a.add(b)', 'It cannot be used with objects'], answer: 0, explain: 'The left operand is the object the method runs on, and the right operand is the argument. That is why `operator+` takes just one parameter when written inside the class.' },
    { t: 'quiz', question: 'Why must `operator<<` for printing be written outside the class?', options: ['Because cout, not your object, is on its left side', 'Because it must be private', 'Because classes cannot print', 'Because it returns an int'], answer: 0, explain: 'A method is called on the object on the **left** of the operator. In `cout << m` that is `cout`, so the function must be an ordinary one that receives the stream and the object.' },
    {
      t: 'recap',
      items: [
        'An operator is a function with a special name: `operator+`, `operator==`, `operator<`, `operator<<`. Writing it teaches your class to use that operator.',
        '`+`, `==`, `<` should be `const` and take `const &`. `+` returns a **new** object. `+=` changes the left object and returns `*this`.',
        '`cout << m` needs a free function `ostream &operator<<(ostream &out, const Money &m)` that returns the stream.',
        'With `operator<` your type works with `sort`, `max_element` and (later) `map` and `set`.',
        'Keep the meaning obvious. If it is not, write a named method instead.',
      ],
      memory: 'a + b means a.operator+(b).',
    },
  ],
  exercises: [
    {
      id: 'cppp10-money',
      title: 'Money that adds up',
      prompt: 'Write a class `Money` with `operator+`, `operator<` and a printing `operator<<` that writes the amount followed by ` UGX`. Read amounts until the input ends. Add them all up using `+`, find the biggest using `<`, and print:\n\n`Total: 4500 UGX`\n`Biggest: 3000 UGX`',
      starter: POF('// Write the class Money and its operators here\n', '    // Read amounts, add them with +, find the biggest with <'),
      tests: [
        { input: '3000 1500', expected: 'Total: 4500 UGX\nBiggest: 3000 UGX' },
        { input: '5', expected: 'Total: 5 UGX\nBiggest: 5 UGX', hidden: true },
        { input: '100 200 300', expected: 'Total: 600 UGX\nBiggest: 300 UGX', hidden: true },
        { input: '10 90 10', expected: 'Total: 110 UGX\nBiggest: 90 UGX', hidden: true },
      ],
      hints: [
        'Give `Money` a constructor `Money(int u = 0)`, so `Money total;` starts at 0 and you can write `total = total + Money(x);`.',
        '`bool operator<(const Money &o) const` compares the two amounts. Keep a `Money biggest;` and replace it whenever `biggest < current`.',
        'Print with `cout << "Total: " << total << endl;`. The `<<` function you wrote adds the ` UGX`.',
      ],
    },
    {
      id: 'cppp10-fraction',
      title: 'Fractions',
      prompt: 'Write a class `Fraction` made from a numerator and a denominator (positive). It must **reduce itself** to lowest terms (use a gcd function), and have `operator+`, `operator*` and a printing `operator<<` that writes `a/b`. Read four numbers `a b c d` (the fractions a/b and c/d) and print:\n\n`Sum: 5/6`\n`Product: 1/6`\n\n(for `1 2 1 3`)',
      starter: POF('// Write the class Fraction and its operators here\n', '    // Read a b c d, print the sum and the product'),
      tests: [
        { input: '1 2 1 3', expected: 'Sum: 5/6\nProduct: 1/6' },
        { input: '1 4 1 4', expected: 'Sum: 1/2\nProduct: 1/16', hidden: true },
        { input: '2 4 1 2', expected: 'Sum: 1/1\nProduct: 1/4', hidden: true },
        { input: '3 5 2 3', expected: 'Sum: 19/15\nProduct: 2/5', hidden: true },
      ],
      hints: [
        'Write a helper `int gcd(int a, int b)` (the recursive one from Part A works). The constructor divides both numbers by `gcd(num, den)`.',
        'The sum of a/b and c/d is `(a*d + c*b) / (b*d)`. The product is `(a*c) / (b*d)`. Return a new `Fraction`, which reduces itself in the constructor.',
        'Print with a free function `operator<<(ostream &out, const Fraction &f)` that writes `numerator()`, a slash, and `denominator()`.',
      ],
    },
    {
      id: 'cppp10-time',
      title: 'The clock',
      prompt: 'Write a class `Time` made from hours and minutes (a 24-hour clock). It has `Time operator+(int minutes) const`, which returns the time that many minutes later (wrapping past midnight), and a printing `operator<<` that writes `HH:MM` with leading zeros. Read `h m add` (a time and the minutes to add) and print the new time:\n\n`10:15`   (for `9 30 45`)',
      starter: POF('// Write the class Time and its operators here\n', '    // Read h, m and the minutes to add, print the new time', INC_OF),
      tests: [
        { input: '9 30 45', expected: '10:15' },
        { input: '23 50 20', expected: '00:10' },
        { input: '0 0 0', expected: '00:00', hidden: true },
        { input: '8 5 1440', expected: '08:05', hidden: true },
        { input: '12 0 90', expected: '13:30', hidden: true },
      ],
      hints: [
        'Store the time as total minutes since midnight in the constructor: `(h * 60 + m) % (24 * 60)`.',
        '`operator+(int minutes)` returns `Time(0, total + minutes)`: let the constructor do the wrapping, and make sure it keeps the remainder in the range 0 to 1439.',
        'Print with `setfill(\'0\') << setw(2)` for the hours, a colon, and the same for the minutes (include `<iomanip>`).',
      ],
    },
    {
      id: 'cppp10-sort',
      title: 'Sort the amounts',
      prompt: 'Write a class `Money` with `operator<` (and a `value()` method). Read amounts until the input ends into a `vector<Money>`, sort it **with the standard `sort`** (no hand-written loops), and print them in order on one line after `Sorted:`:\n\n`Sorted: 1000 2000 3000`',
      starter: POF('// Write the class Money here\n', '    // Read amounts into a vector<Money>, sort it, print it'),
      tests: [
        { input: '3000 1000 2000', expected: 'Sorted: 1000 2000 3000' },
        { input: '5', expected: 'Sorted: 5', hidden: true },
        { input: '9 9 1', expected: 'Sorted: 1 9 9', hidden: true },
        { input: '500 100 300 200 400', expected: 'Sorted: 100 200 300 400 500', hidden: true },
      ],
      hints: [
        'Add `bool operator<(const Money &other) const { return amount < other.amount; }` to the class. Then `sort(v.begin(), v.end());` works on a `vector<Money>`.',
        'A constructor `Money(int a)` lets you write `v.push_back(Money(x));`.',
        'Print `Sorted:` and then each value, with a space in front of each one.',
      ],
    },
  ],
};
