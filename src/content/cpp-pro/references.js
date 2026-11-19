// C++ Pro, Level 1: Real strings and vectors. Lesson 4 (references, const references).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 1: Real strings and vectors';
const INC_R = '#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n#include <utility>';
const PR = (body) => progPro(body, INC_R);
const PRF = (above, body) => progProFn(above, body, INC_R);

export const referencesLesson = {
  id: 'cppp-references',
  level: LEVEL,
  minutes: 30,
  title: 'References: a second name for the same thing',
  summary: 'References, passing by reference, const references for big things, and changing items inside a loop',
  blocks: [
    {
      t: 'story',
      title: 'Two names, one tin',
      text: 'Mama Rose’s cash tin has a second name. Her children call her **Mama**, her customers call her **Mama Rose**, but there is only **one** woman. If a customer hands money to “Mama Rose”, the children’s “Mama” has it too, because it is the same person with two names.\n\nA **reference** in C++ is exactly that: a **second name for a variable that already exists**. Whatever you do through the new name happens to the original. This is the neat, modern way to let a function change the caller’s variable, and the way to hand over big things without copying them.',
    },
    { t: 'p', text: 'A reference is declared with an `&` after the type. You must say what it is a name for **at the moment you create it**.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

int main() {
    int stock = 20;
    int &s = stock;
    cout << "stock: " << stock << ", s: " << s << endl;
    s = 15;
    cout << "stock: " << stock << ", s: " << s << endl;
    return 0;
}
`,
      output: 'stock: 20, s: 20\nstock: 15, s: 15',
    },
    {
      t: 'list',
      items: [
        '`int &s = stock;` makes `s` another name for `stock`. They are the **same box**, not two boxes that hold equal numbers.',
        'A reference **must be set when it is created**: `int &s;` alone is an error. And it **cannot be changed later** to name something else.',
        'There is no “empty” reference: it always names a real variable. (A pointer can be empty; a reference cannot.)',
        'The `&` here is part of the **type** (“reference to int”). It is not the “address of” `&` from the pointers lesson, even though it looks the same.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a = 1;
    int b = 2;
    int &r = a;
    r = b;
    r = 10;
    cout << a << " " << b << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['10 2', '2 10', '10 10', '1 2'],
      answer: 0,
      explain: '`r` is a second name for `a`. The line `r = b;` does **not** make `r` name `b` (a reference can never be changed). It copies the value of `b` into the box that `r` names, which is `a`, so `a` becomes 2. Then `r = 10;` makes `a` equal to 10. The variable `b` was never touched. So it prints 10 2.',
    },
    { t: 'h', text: 'Passing by reference' },
    { t: 'p', text: 'In lesson 11 of Part A a function got a **copy** of its argument and could not change yours. If a parameter is a **reference**, the function works on the **real variable**. No `&` is needed in the call, and no `*` inside the function. It reads just like normal code.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
using namespace std;

void addTip(int &total) {
    total = total + 500;
}

int main() {
    int bill = 3000;
    addTip(bill);
    cout << "Bill: " << bill << endl;
    return 0;
}
`,
      output: 'Bill: 3500',
    },
    { t: 'p', text: 'Swapping two values is now this short. (C++ even has it ready-made: `swap(a, b);` from `<utility>`.)' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <utility>
using namespace std;

void exchange(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 3, b = 8;
    exchange(a, b);
    cout << "a = " << a << ", b = " << b << endl;
    swap(a, b);
    cout << "a = " << a << ", b = " << b << endl;
    return 0;
}
`,
      output: 'a = 8, b = 3\na = 3, b = 8',
    },
    { t: 'h', text: 'const references: look but do not touch' },
    { t: 'p', text: 'Passing a long string or a big vector **by value** copies every character or value, which is slow. Passing it by reference avoids the copy. If the function only needs to **read** it, say so with `const`: `const string &name`. The compiler then refuses any line that tries to change it. This is the standard way to write a function that reads a big thing, and you will see it everywhere in C++ code.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

void minMax(const vector<int> &v, int &lowest, int &highest) {
    lowest = v[0];
    highest = v[0];
    for (int x : v) {
        if (x < lowest) {
            lowest = x;
        }
        if (x > highest) {
            highest = x;
        }
    }
}

void greet(const string &name) {
    cout << "Karibu, " << name << "!" << endl;
}

int main() {
    vector<int> sales = {4, 9, 2, 7};
    int low, high;
    minMax(sales, low, high);
    cout << "Min: " << low << endl;
    cout << "Max: " << high << endl;
    greet("Mama Rose");
    return 0;
}
`,
      output: 'Min: 2\nMax: 9\nKaribu, Mama Rose!',
    },
    { t: 'tip', text: 'A handy rule: **read-only and big** (string, vector) means `const T &`. **Read-only and small** (int, double, char) means a plain copy. **The function must change the original** means `T &`.' },
    { t: 'h', text: 'References inside loops' },
    { t: 'p', text: 'In `for (int n : v)` the variable `n` is a **copy** of each value, so changing it changes nothing in the vector. Write `for (int &n : v)` and `n` becomes a **name for the real value**, so changes stick.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    for (int n : v) {
        n *= 2;
    }
    for (int &n : v) {
        n += 1;
    }
    for (int n : v) {
        cout << n << " ";
    }
    cout << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['2 3 4', '3 5 7', '1 2 3', '2 4 6'],
      answer: 0,
      explain: 'The first loop doubles **copies**, so the vector stays 1 2 3. The second loop uses `int &n`, so each real value gets 1 added: 2 3 4. The last loop only prints them.',
    },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

void shout(string &s) {
    for (char &c : s) {
        c = toupper(c);
    }
}

int main() {
    vector<string> names = {"amina", "peter"};
    for (string &name : names) {
        shout(name);
    }
    for (const string &name : names) {
        cout << name << endl;
    }
    return 0;
}
`,
      output: 'AMINA\nPETER',
    },
    { t: 'p', text: 'The last loop shows the habit to build: when you only **read** each item of a vector of strings, write `for (const string &x : v)` (or `for (const auto &x : v)`). It never copies anything and it cannot change anything by accident.' },
    { t: 'h', text: 'References and pointers' },
    {
      t: 'list',
      items: [
        'A **reference** is a name for a variable: it must be set at creation, never changes, never empty, and used like a normal variable. It is the **first choice** in modern C++.',
        'A **pointer** (Part A, lesson 18) holds an address: it can be empty, can be changed to point elsewhere, and needs `*` to use. You need it for things references cannot do, such as memory you create yourself (lesson 18 of this course).',
      ],
    },
    {
      t: 'fill',
      prompt: 'Fill the gap so the function changes the bill in main, and the program prints 3500.',
      template: String.raw`#include <iostream>
using namespace std;

void addTip(int ___ total) {
    total = total + 500;
}

int main() {
    int bill = 3000;
    addTip(bill);
    cout << bill << endl;
    return 0;
}
`,
      blanks: [{ options: ['&', '*', '#'], answer: '&' }],
      output: '3500',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

void addTip(int &total) {
    total = total + 500;
}

int main() {
    addTip(3000);
    cout << "done" << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['A reference parameter needs a real variable to be a name for, and 3000 is only a value', 'addTip must return an int', 'total must be a pointer', 'cout cannot print “done”'],
      answer: 0,
      explain: 'A reference is a second name for something that exists. The number `3000` is just a value with no box of its own, so there is nothing to be a name for. Make a variable first: `int bill = 3000; addTip(bill);`.',
      fixed: String.raw`#include <iostream>
using namespace std;

void addTip(int &total) {
    total = total + 500;
}

int main() {
    int bill = 3000;
    addTip(bill);
    cout << bill << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PR(String.raw`    int x = 5;
    int &r;
    r = x;
    cout << r << endl;`),
          why: 'A reference must be set when it is created: `int &r = x;`. It can never be set later, because a reference cannot be empty.',
          right: PR(String.raw`    int x = 5;
    int &r = x;
    cout << r << endl;`),
        },
        {
          wrong: PRF(String.raw`void addExclamation(const string &s) {
    s += "!";
}`, String.raw`    string word = "Karibu";
    addExclamation(word);
    cout << word << endl;`),
          why: 'The parameter is `const`, a promise not to change it, and `s += "!"` changes it. The compiler enforces the promise. Remove `const` (and keep the `&`) if the function is supposed to change the string.',
          right: PRF(String.raw`void addExclamation(string &s) {
    s += "!";
}`, String.raw`    string word = "Karibu";
    addExclamation(word);
    cout << word << endl;`),
        },
        {
          wrong: PR(String.raw`    int &r = 5;
    cout << r << endl;`),
          why: 'A (non-const) reference needs a real variable to name, and `5` is only a value. Use a variable: `int x = 5; int &r = x;`.',
          right: PR(String.raw`    int x = 5;
    int &r = x;
    cout << r << endl;`),
        },
        {
          logic: true,
          wrong: PRF(String.raw`void addTip(int total) {
    total = total + 500;
}`, String.raw`    int bill = 3000;
    addTip(bill);
    cout << bill << endl;`),
          why: 'Without the `&` the function gets a **copy**, so `bill` is still 3000 and no error appears. Write `int &total`.',
          right: PRF(String.raw`void addTip(int &total) {
    total = total + 500;
}`, String.raw`    int bill = 3000;
    addTip(bill);
    cout << bill << endl;`),
        },
        {
          logic: true,
          wrong: PR(String.raw`    vector<int> v = {1, 2, 3};
    for (int n : v) {
        n *= 10;
    }
    cout << v[0] << " " << v[1] << " " << v[2] << endl;`),
          why: 'The loop variable `n` is a **copy** of each value, so `v` is unchanged and still prints 1 2 3. To change the vector itself, write `for (int &n : v)`.',
          right: PR(String.raw`    vector<int> v = {1, 2, 3};
    for (int &n : v) {
        n *= 10;
    }
    cout << v[0] << " " << v[1] << " " << v[2] << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'After `int x = 1; int &r = x; r = 7;`, what is x?', options: ['7', '1', '8', 'It is an error'], answer: 0, explain: '`r` is another name for `x`, so assigning through `r` changes `x` itself.' },
    { t: 'quiz', question: 'A function only needs to READ a long string. Which parameter is the best choice?', options: ['const string &s', 'string s', 'string &s', 'int s'], answer: 0, explain: '`const string &s` avoids copying the long string and promises (and enforces) that the function will not change it. `string &s` would allow accidental changes, and `string s` copies it.' },
    {
      t: 'recap',
      items: [
        'A reference (`int &r = x;`) is a second name for an existing variable. It must be set when created and never changes.',
        'A `&` parameter lets a function change the caller’s variable, with no `*` and no `&` in the call. C++ also has `swap(a, b)` ready-made.',
        'Use `const T &` to read a big thing (string, vector) without copying it. The compiler stops accidental changes.',
        '`for (int &n : v)` changes the real values. `for (int n : v)` works on copies. For read-only loops write `for (const auto &x : v)`.',
        'A reference needs a real variable: you cannot bind a normal reference to a plain value such as 3000.',
      ],
      memory: 'Same box, second name.',
    },
  ],
  exercises: [
    {
      id: 'cppp4-swap',
      title: 'Swap with references',
      prompt: 'Write `void exchange(int &x, int &y)` that swaps its two arguments. In `main`, read two numbers, print them, swap them with your function, and print them again:\n\n`Before: 3 8`\n`After: 8 3`',
      starter: progProFn('// Write the function exchange here, above main\n', '    // Read a and b, print Before:, swap, print After:', INC_R),
      tests: [
        { input: '3 8', expected: 'Before: 3 8\nAfter: 8 3' },
        { input: '5 5', expected: 'Before: 5 5\nAfter: 5 5' },
        { input: '-2 9', expected: 'Before: -2 9\nAfter: 9 -2', hidden: true },
        { input: '0 100', expected: 'Before: 0 100\nAfter: 100 0', hidden: true },
      ],
      hints: [
        'Both parameters are references: `int &x, int &y`. Inside the function they are used like normal variables.',
        'Use a temporary box: `int temp = x; x = y; y = temp;`.',
        'Call it with plain variables: `exchange(a, b);`. No `&` and no `*` are needed.',
      ],
    },
    {
      id: 'cppp4-stats',
      title: 'Two answers from one function',
      prompt: 'Write `void stats(const vector<int> &v, int &total, int &highest)` that works out the total and the highest value of a (non-empty) vector. In `main`, read numbers until the input ends and print:\n\n`Total: 22`\n`Highest: 9`',
      starter: progProFn('// Write the function stats here, above main\n', '    // Read the numbers into a vector, call stats, print the two answers', INC_R),
      tests: [
        { input: '4 9 2 7', expected: 'Total: 22\nHighest: 9' },
        { input: '5', expected: 'Total: 5\nHighest: 5' },
        { input: '-1 -5', expected: 'Total: -6\nHighest: -1', hidden: true },
        { input: '10 20 30', expected: 'Total: 60\nHighest: 30', hidden: true },
      ],
      hints: [
        'The vector is read-only and can be big, so it is `const vector<int> &v`. The two answers are plain `int &` references that the function fills in.',
        'Start `total = 0;` and `highest = v[0];`, then loop over the vector updating both.',
        'In `main`, make two `int` variables and call `stats(v, total, highest);`, then print them.',
      ],
    },
    {
      id: 'cppp4-double',
      title: 'Double them all',
      prompt: 'Write `void doubleAll(vector<int> &v)` that doubles every value **in the vector itself**. In `main`, read numbers until the input ends, call it, and print the values separated by spaces. For `1 2 3` print: `2 4 6`',
      starter: progProFn('// Write the function doubleAll here, above main\n', '    // Read the numbers, call doubleAll, print them', INC_R),
      tests: [
        { input: '1 2 3', expected: '2 4 6' },
        { input: '0 5', expected: '0 10', hidden: true },
        { input: '-4', expected: '-8', hidden: true },
        { input: '7 7 7 7', expected: '14 14 14 14', hidden: true },
      ],
      hints: [
        'The parameter is a reference to the whole vector: `vector<int> &v`, so changes inside the function stay.',
        'Loop with a reference to each value: `for (int &n : v) { n = n * 2; }`.',
        'Print with a space between values.',
      ],
    },
    {
      id: 'cppp4-shout',
      title: 'Shout in place',
      prompt: 'Write `void shout(string &s)` that changes the text **in place** to capital letters. In `main`, read a whole line, call `shout`, and print the result. For `mama rose` print: `MAMA ROSE`',
      starter: progProFn('// Write the function shout here, above main\n', '    // Read a line with getline, call shout, print it', INC_R),
      tests: [
        { input: 'mama rose', expected: 'MAMA ROSE' },
        { input: 'a1 b2', expected: 'A1 B2' },
        { input: 'ALREADY', expected: 'ALREADY', hidden: true },
        { input: 'karibu sana!', expected: 'KARIBU SANA!', hidden: true },
      ],
      hints: [
        'The parameter is a reference, so the function changes the real string: `string &s`.',
        'Loop over the characters with a **reference**: `for (char &c : s) { c = toupper(c); }`.',
        'Read the line with `getline(cin, line);` and print `line` after calling `shout(line);`.',
      ],
    },
  ],
};
