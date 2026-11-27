// C++ Pro, Level 3: Generic and modern C++. Lesson 15 (templates).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 3: Generic and modern C++';
const INC_T = '#include <iostream>\n#include <string>\n#include <vector>';
const PT = (body) => progPro(body, INC_T);
const PTF = (above, body, inc = INC_T) => progProFn(above, body, inc);

export const templatesLesson = {
  id: 'cppp-templates',
  level: LEVEL,
  minutes: 32,
  title: 'Templates: write it once, for any type',
  summary: 'Function templates, class templates, passing a rule to a template, and how the compiler stamps out each version',
  blocks: [
    {
      t: 'story',
      title: 'One tray for anything',
      text: 'Mama Rose has a tray for her rolex. Then she buys a second tray for chapatis, a third for eggs, a fourth for sodas. They are **all the same tray**: only the thing it carries is different. She would rather buy **one design** and say “a tray of ___” each time.\n\nThat is a **template**. Until now, if you wanted a function `biggest` for `int`s and another for `string`s, you had to write it twice. A template is a **recipe with a blank for the type**: you write the code once, and the compiler **stamps out** a real version for every type you use.',
    },
    { t: 'p', text: 'A function template starts with `template <typename T>`: “here is a recipe for any type `T`”. Inside, `T` is used like an ordinary type. When you call the function, the compiler **works out `T` from the arguments** and builds the version it needs.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}

int main() {
    cout << biggest(3, 7) << " " << biggest(2.5, 1.5) << " " << biggest(string("kiwi"), string("fig")) << endl;
    return 0;
}
`,
      output: '7 2.5 kiwi',
    },
    { t: 'analogy', text: 'A template is a **cookie cutter**, not a cookie. Nothing is baked until you press it into some dough. `biggest(3, 7)` presses it into `int` dough and makes `int biggest(int, int)`. `biggest(2.5, 1.5)` presses it into `double` dough. The compiler bakes only the cookies you actually use.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

template <typename T>
T twice(T x) {
    return x + x;
}

int main() {
    cout << twice(21) << " " << twice(string("ab")) << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['42 abab', '42 ab', '21 abab', '42 2ab'],
      answer: 0,
      explain: 'For `int`, `x + x` adds: 21 + 21 = 42. For `string`, `+` joins: "ab" + "ab" = "abab". The same text of the template works for both types, because both support `+`.',
    },
    {
      t: 'list',
      items: [
        '`template <typename T>` (you may also see `class T`, which means the same) introduces the blank `T`.',
        'The compiler **deduces** `T` from the arguments. Both arguments of `biggest(a, b)` must give the **same** `T`. You can also say it yourself: `biggest<double>(3, 4.5)`.',
        'A template only works for types that support **every operation it uses**. `biggest` needs `>`, `twice` needs `+`. A type without it gives a compile error at the call.',
        'The compiler checks the template when you **use** it. Errors can look long, but the first line usually names the operation that is missing.',
      ],
    },
    { t: 'h', text: 'Class templates' },
    { t: 'p', text: 'A whole **class** can be a template too. This is how `vector<int>` and `vector<string>` are the same code. Here is a `Box` that holds one value of any type. In the class, `T` is used for the member and for the methods’ types.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
    void set(T v) { value = v; }
};

int main() {
    Box<int> a(5);
    Box<string> b("rolex");
    Box<double> c(2.5);
    a.set(a.get() + 1);
    cout << a.get() << " " << b.get() << " " << c.get() << endl;
    return 0;
}
`,
      output: '6 rolex 2.5',
    },
    { t: 'p', text: 'For a class template you write the type in angle brackets when you create the object: `Box<int>`. In lesson 13 you built a `Stack` on top of a `vector<int>`. Make it a template, and one `Stack` serves every type.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

template <typename T>
class Stack {
    vector<T> items;
public:
    void push(const T &x) { items.push_back(x); }
    bool pop() {
        if (items.empty()) {
            return false;
        }
        items.pop_back();
        return true;
    }
    T top() const { return items.back(); }
    bool empty() const { return items.empty(); }
    int size() const { return items.size(); }
};

int main() {
    Stack<int> numbers;
    Stack<string> words;
    numbers.push(1);
    numbers.push(2);
    words.push("karibu");
    words.push("sana");
    cout << numbers.top() << " " << words.top() << " " << numbers.size() << endl;
    return 0;
}
`,
      output: '2 sana 2',
    },
    { t: 'h', text: 'Passing a rule to a template' },
    { t: 'p', text: 'A template can take **more than one blank**, and one of them can be “any function or lambda”. `countIf` counts the values that pass a test, whatever the type of the values and whatever the test is. This is how the standard algorithms (`count_if`, `sort` with a rule) are written.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

template <typename T, typename F>
int countIf(const vector<T> &v, F pred) {
    int n = 0;
    for (const T &x : v) {
        if (pred(x)) {
            n++;
        }
    }
    return n;
}

int main() {
    vector<int> nums = {1, 2, 3, 4, 5, 6};
    vector<string> words = {"fig", "banana", "kiwi"};
    cout << countIf(nums, [](int x) { return x % 2 == 0; }) << " ";
    cout << countIf(words, [](const string &w) { return w.length() > 3; }) << endl;
    return 0;
}
`,
      output: '3 2',
    },
    { t: 'tip', text: 'Templates are resolved **while compiling**, so there is no slowdown when the program runs. The price is that the whole template must be visible where it is used. That is why template code normally sits in the same file (or header) as the code that uses it.' },
    {
      t: 'fill',
      prompt: 'Fill the gap with the word that declares a type blank.',
      template: String.raw`#include <iostream>
using namespace std;

template <___ T>
T twice(T x) {
    return x + x;
}

int main() {
    cout << twice(4) << endl;
    return 0;
}
`,
      blanks: [{ options: ['typename', 'int', 'void'], answer: 'typename' }],
      output: '8',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
using namespace std;

template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}

int main() {
    cout << biggest(3, 4.5) << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['The two arguments suggest different types (int and double), but T must be one type', 'biggest must return a double', 'The template needs two blanks', 'cout cannot print a double'],
      answer: 0,
      explain: 'The first argument says `T` is `int` and the second says `T` is `double`, and the compiler will not guess. Make them the same type, `biggest(3.0, 4.5)`, or say which one you want: `biggest<double>(3, 4.5)`.',
      fixed: String.raw`#include <iostream>
using namespace std;

template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}

int main() {
    cout << biggest<double>(3, 4.5) << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PTF(String.raw`template <typename T>
class Stack {
    vector<T> items;
public:
    void push(const T &x) { items.push_back(x); }
};`, String.raw`    Stack s;
    s.push(1);
    cout << "ok" << endl;`),
          why: 'A class template needs its **type in angle brackets**, because the compiler cannot guess it from nothing. Write `Stack<int> s;`.',
          right: PTF(String.raw`template <typename T>
class Stack {
    vector<T> items;
public:
    void push(const T &x) { items.push_back(x); }
};`, String.raw`    Stack<int> s;
    s.push(1);
    cout << "ok" << endl;`),
        },
        {
          wrong: PTF(String.raw`template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}

struct Point {
    int x;
};`, String.raw`    Point p{1}, q{2};
    biggest(p, q);
    cout << "ok" << endl;`),
          why: '`biggest` uses `>`, and a `Point` cannot be compared with `>`. A template works only for types that support the operations it uses. Give `Point` an `operator>` (lesson 10) or choose another type.',
          right: PTF(String.raw`template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}

struct Point {
    int x;
    bool operator>(const Point &o) const { return x > o.x; }
};`, String.raw`    Point p{1}, q{2};
    biggest(p, q);
    cout << "ok" << endl;`),
        },
        {
          wrong: PT(String.raw`    cout << biggest(3, 7) << endl;`).replace('int main() {', 'T biggest(T a, T b) {\n    return a > b ? a : b;\n}\n\nint main() {'),
          why: 'The function uses `T`, but there is no `template <typename T>` line above it, so `T` means nothing. The recipe must start with the template line.',
          right: PT(String.raw`    cout << biggest(3, 7) << endl;`).replace('int main() {', 'template <typename T>\nT biggest(T a, T b) {\n    return a > b ? a : b;\n}\n\nint main() {'),
        },
        {
          logic: true,
          wrong: PTF(String.raw`template <typename T>
T middle(T a, T b) {
    return (a + b) / 2;
}`, String.raw`    cout << middle(3, 4) << endl;`),
          why: 'For `int` the division `/ 2` throws the .5 away, so `middle(3, 4)` is 3, not 3.5. A template does **exactly what the code says for each type**. If you want a decimal answer, use `middle(3.0, 4.0)`.',
          right: PTF(String.raw`template <typename T>
T middle(T a, T b) {
    return (a + b) / 2;
}`, String.raw`    cout << middle(3.0, 4.0) << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'What happens at `biggest(3, 7)` when `biggest` is a function template?', options: ['The compiler works out T is int and builds an int version', 'The program picks a type while running', 'It always uses double', 'It is an error: templates need <int>'], answer: 0, explain: 'The compiler deduces `T` from the arguments and stamps out the matching version at compile time.' },
    { t: 'quiz', question: 'Why can `biggest(string("a"), string("b"))` work but `biggest(p, q)` fail for a plain struct Point?', options: ['string supports >, Point does not', 'Strings are faster', 'Structs cannot be passed', 'Templates only accept built-in types'], answer: 0, explain: 'A template needs every operation it uses to exist for the chosen type. Teach `Point` the operator with operator overloading and the same template works.' },
    {
      t: 'recap',
      items: [
        '`template <typename T>` before a function or class makes `T` a blank for a type. The compiler stamps out a real version for each type you use.',
        'Function templates deduce `T` from the arguments (both must agree), or you say it: `biggest<double>(3, 4.5)`.',
        'Class templates need the type in angle brackets: `Stack<int>`, `Box<string>`.',
        'A template works only for types that support the operations it uses. A lambda can be passed as a template parameter (`countIf`).',
        'Templates cost nothing at run time, and `vector`, `map` and the algorithms are all templates.',
      ],
      memory: 'A cookie cutter, pressed into any dough.',
    },
  ],
  exercises: [
    {
      id: 'cppp15-extremes',
      title: 'Smallest and largest of anything',
      prompt: 'Write two function templates, `smallest(const vector<T> &)` and `largest(const vector<T> &)`, that work for any type that can be compared with `<`. Read a count `n` and `n` whole numbers, then a count `m` and `m` words. Print:\n\n`Ints: 1 9`\n`Words: apple pear`\n\n(the smallest and the largest number, and the first and the last word in dictionary order)',
      starter: PTF('// Write the function templates smallest and largest here\n', '    // Read the numbers and the words, call the templates on both'),
      tests: [
        { input: '3 5 1 9 3 pear apple fig', expected: 'Ints: 1 9\nWords: apple pear' },
        { input: '1 7 1 solo', expected: 'Ints: 7 7\nWords: solo solo', hidden: true },
        { input: '4 -3 0 12 -8 2 kiwi banana', expected: 'Ints: -8 12\nWords: banana kiwi', hidden: true },
      ],
      hints: [
        'Start with `template <typename T> T smallest(const vector<T> &v) { T best = v[0]; for (const T &x : v) { if (x < best) best = x; } return best; }`.',
        '`largest` is the same with `>`. The same two functions serve a `vector<int>` and a `vector<string>`.',
        'Read the first group into a `vector<int>` and the second into a `vector<string>`, then print `smallest(...)` and `largest(...)` for each.',
      ],
    },
    {
      id: 'cppp15-pair',
      title: 'A pair of anything',
      prompt: 'Write a class template `Pair<A, B>` that holds a `first` of type `A` and a `second` of type `B`, with `getFirst() const`, `getSecond() const` and a method `Pair<B, A> swapped() const` that returns the pair the other way round. Read pairs of a **number** and a **word** until the input ends, and print each swapped as `(word, number)`, for example: `(rolex, 3)`',
      starter: PTF('// Write the class template Pair here\n', '    // Read number and word pairs, print each swapped'),
      tests: [
        { input: '3 rolex 5 soda', expected: '(rolex, 3)\n(soda, 5)' },
        { input: '1 a', expected: '(a, 1)', hidden: true },
        { input: '10 karibu 20 sana 30 asante', expected: '(karibu, 10)\n(sana, 20)\n(asante, 30)', hidden: true },
      ],
      hints: [
        'Declare `template <typename A, typename B> class Pair { A first; B second; public: Pair(A a, B b) : first(a), second(b) {} ... };`.',
        'The swapped pair is `Pair<B, A>(second, first)`. Write the return type exactly as `Pair<B, A>`.',
        'In `main`, create `Pair<int, string> p(number, word);` and print with `p.swapped().getFirst()` and `p.swapped().getSecond()`.',
      ],
    },
    {
      id: 'cppp15-stacks',
      title: 'Two stacks, one class',
      prompt: 'Write a class template `Stack<T>` (built on a `vector<T>`, with `push`, `pop`, `top`, `empty`). Read words until the input ends. Push every word onto a `Stack<string>` and its **length** onto a `Stack<int>`. Then pop everything off, and print the words (last typed first) on one line and the lengths (last first) on the next, separated by spaces. For `a bb ccc`:\n\n`ccc bb a`\n`3 2 1`',
      starter: PTF('// Write the class template Stack here\n', '    // Push every word and its length, then pop them all'),
      tests: [
        { input: 'a bb ccc', expected: 'ccc bb a\n3 2 1' },
        { input: 'karibu', expected: 'karibu\n6', hidden: true },
        { input: 'one two three four', expected: 'four three two one\n4 5 3 3', hidden: true },
      ],
      hints: [
        'Copy the `Stack` from the lesson. `pop` should only remove, and `top` should give the last value, as in the real C++ `stack`.',
        'Make two stacks: `Stack<string> words; Stack<int> lengths;`, and push `w` and `w.length()` for every word `w` you read.',
        'To print, loop `while (!words.empty()) { print words.top(); words.pop(); }`, then the same for the lengths.',
      ],
    },
    {
      id: 'cppp15-countif',
      title: 'Count what passes',
      prompt: 'Write a function template `countIf(const vector<T> &v, F pred)` that counts the values for which `pred(value)` is true. Read a count `n` and `n` whole numbers, then a count `m` and `m` words. Print how many numbers are **greater than 10** and how many words are **longer than 3 letters**:\n\n`Big numbers: 2`\n`Long words: 1`',
      starter: PTF('// Write the function template countIf here\n', '    // Read the numbers and the words, count with two lambdas'),
      tests: [
        { input: '4 5 20 11 3 2 fig banana', expected: 'Big numbers: 2\nLong words: 1' },
        { input: '1 10 1 abc', expected: 'Big numbers: 0\nLong words: 0', hidden: true },
        { input: '3 100 200 300 3 abcd efghi jk', expected: 'Big numbers: 3\nLong words: 2', hidden: true },
      ],
      hints: [
        'Use two blanks: `template <typename T, typename F> int countIf(const vector<T> &v, F pred)`. Loop over `v` and add 1 when `pred(x)` is true.',
        'Call it with a lambda: `countIf(nums, [](int x) { return x > 10; })`.',
        'For words use `[](const string &w) { return w.length() > 3; }`.',
      ],
    },
  ],
};
