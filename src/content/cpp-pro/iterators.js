// C++ Pro, Level 3: Generic and modern C++. Lesson 17 (iterators, more algorithms, lambda captures).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 3: Generic and modern C++';
const INC_IT = '#include <iostream>\n#include <string>\n#include <vector>\n#include <map>\n#include <algorithm>\n#include <numeric>\n#include <iterator>';
const PIT = (body) => progPro(body, INC_IT);
const PITF = (above, body, inc = INC_IT) => progProFn(above, body, inc);

export const iteratorsLesson = {
  id: 'cppp-iterators',
  level: LEVEL,
  minutes: 34,
  title: 'Iterators, algorithms and lambdas in depth',
  summary: 'Walking any container with iterators, erasing safely, transform, any_of, and lambdas that capture variables',
  blocks: [
    {
      t: 'story',
      title: 'A finger on the shelf',
      text: 'Mama Rose’s storeroom has shelves, boxes and a hanging rack. Different furniture, but the **job is the same**: “start at the beginning, look at each thing, stop at the end”. She does not need a different way of walking for each. She puts a **finger** on the first item and moves it along.\n\nAn **iterator** is that finger. It points at one item in a container, you can move it with `++`, and `*it` is the item it points at. Because every standard container (`vector`, `set`, `map`, ...) offers iterators the **same way**, the algorithms (`sort`, `find`, `count`, ...) work with all of them.',
    },
    { t: 'p', text: '`v.begin()` is a finger on the first item. `v.end()` is a finger placed **just past the last** item: it marks “nothing more”, and you must never dereference it. Here is a loop written with iterators, the way the range-for loop actually works inside.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30};
    for (auto it = v.begin(); it != v.end(); ++it) {
        cout << "item " << (it - v.begin()) << " is " << *it << endl;
    }
    return 0;
}
`,
      output: 'item 0 is 10\nitem 1 is 20\nitem 2 is 30',
    },
    {
      t: 'list',
      items: [
        '`auto it = v.begin();` makes an iterator (use `auto`: the real type is long and ugly).',
        '`*it` is the item. `++it` moves to the next. `it != v.end()` is the standard stopping test. **Do not use `<`** (not every container allows it).',
        'For a `vector` only, `it - v.begin()` is the position, and `it + 2` jumps ahead.',
        'For a `map`, an item is a pair, and you write `it->first` and `it->second` (the arrow is a shortcut for `(*it).first`).',
      ],
    },
    { t: 'h', text: 'Erasing while you walk' },
    { t: 'p', text: 'You must not erase from a container with a range-for loop, because the container changes under the loop’s feet. With iterators there is a safe pattern: `erase` **returns the next iterator**, so you only move forward yourself when you did **not** erase.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock = {{"egg", 12}, {"tea", 1}, {"soda", 7}, {"salt", 0}};
    for (auto it = stock.begin(); it != stock.end();) {
        if (it->second < 2) {
            it = stock.erase(it);
        } else {
            ++it;
        }
    }
    for (const auto &entry : stock) {
        cout << entry.first << " " << entry.second << endl;
    }
    return 0;
}
`,
      output: 'egg 12\nsoda 7',
    },
    { t: 'h', text: 'Removing many items from a vector: erase-remove' },
    { t: 'p', text: 'To delete every item that matches from a `vector`, C++ programmers use a two-step idiom. `remove` / `remove_if` **shuffles the keepers to the front** and returns an iterator to where the rubbish begins (it does not shrink the vector). Then `erase` cuts the rubbish off.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5, 6};
    v.erase(remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 1; }), v.end());
    for (int x : v) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: '2 4 6',
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 2, 1};
    v.erase(remove(v.begin(), v.end(), 2), v.end());
    for (int x : v) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['1 3 1', '1 2 3 2 1', '3', '1 1 3'],
      answer: 0,
      explain: '`remove` moves the values that are **not** 2 to the front, keeping their order (1, 3, 1), and `erase` then cuts off the leftover tail. The order of the keepers is preserved.',
    },
    { t: 'h', text: 'More algorithms' },
    { t: 'p', text: '`transform` applies a function to every item and writes the answers somewhere (`back_inserter` adds them to the end of a vector). `copy_if` keeps the items that pass a test. `any_of`, `all_of` and `none_of` answer yes/no about the whole range. `unique` (after `sort`) removes neighbours that are equal.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>
using namespace std;

int main() {
    vector<int> v = {3, -1, 4, -1, 5, 3, 3};
    vector<int> squares;
    transform(v.begin(), v.end(), back_inserter(squares), [](int x) { return x * x; });
    cout << squares.front() << " " << squares.back() << endl;
    cout << any_of(v.begin(), v.end(), [](int x) { return x < 0; }) << all_of(v.begin(), v.end(), [](int x) { return x < 0; }) << endl;
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    for (int x : v) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: '9 9\n10\n-1 3 4 5',
    },
    { t: 'h', text: 'Lambdas that remember: captures' },
    { t: 'p', text: 'A lambda can use variables from the code around it, if you list them in the square brackets: the **capture list**. `[limit]` takes a **copy** of `limit`. `[&total]` takes a **reference**, so the lambda can change the real `total`. `[=]` copies everything it uses, and `[&]` references everything it uses.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> sales = {12000, 8500, 15000, 9000};
    int limit = 10000;
    int big = count_if(sales.begin(), sales.end(), [limit](int s) { return s > limit; });
    int total = 0;
    for_each(sales.begin(), sales.end(), [&total](int s) { total += s; });
    cout << big << " above " << limit << ", total " << total << endl;
    return 0;
}
`,
      output: '2 above 10000, total 44500',
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a = 0, b = 0;
    auto f = [a, &b]() mutable {
        a++;
        b++;
    };
    f();
    f();
    cout << a << " " << b << endl;
    return 0;
}
`,
      question: 'What does this program print? (`mutable` lets the lambda change its own copies.)',
      options: ['0 2', '2 2', '0 0', '2 0'],
      answer: 0,
      explain: '`a` was captured **by value**, so the lambda works on its own private copy, and the real `a` stays 0. `b` was captured **by reference**, so both calls change the real `b`, and it becomes 2.',
    },
    {
      t: 'fill',
      prompt: 'Fill the gap with the iterator that marks the end of the vector, so the loop prints every item.',
      template: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {4, 5, 6};
    for (auto it = v.begin(); it != v.___(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    return 0;
}
`,
      blanks: [{ options: ['end', 'begin', 'size'], answer: 'end' }],
      output: '4 5 6',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    for (auto it = v.begin(); it < v.size(); ++it) {
        cout << *it << endl;
    }
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['An iterator cannot be compared with a number: compare it with v.end()', 'auto cannot be used for iterators', 'The loop must count down', 'cout cannot print *it'],
      answer: 0,
      explain: 'An iterator is a finger on an item, not a number, and `v.size()` is a number. The loop test is `it != v.end()`, which compares two fingers.',
      fixed: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    for (auto it = v.begin(); it != v.end(); ++it) {
        cout << *it << endl;
    }
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PIT(String.raw`    vector<int> v = {1, 2, 3, 4};
    int threshold = 2;
    int n = count_if(v.begin(), v.end(), [](int x) { return x > threshold; });
    cout << n << endl;`),
          why: 'A lambda cannot see the variables around it unless you **capture** them. `threshold` is not in the square brackets. Write `[threshold](int x) { ... }`.',
          right: PIT(String.raw`    vector<int> v = {1, 2, 3, 4};
    int threshold = 2;
    int n = count_if(v.begin(), v.end(), [threshold](int x) { return x > threshold; });
    cout << n << endl;`),
        },
        {
          wrong: PIT(String.raw`    vector<int> v = {1, 2, 3};
    vector<int> doubled;
    auto it = transform(v.begin(), v.end(), doubled.begin(), [](int x) { return x * 2; }, 5);
    cout << doubled.size() << endl;`),
          why: '`transform` takes **four** things: where to start, where to stop, where to write, and the function. This call gave one too many. (And writing into `doubled.begin()` of an empty vector is also wrong: use `back_inserter(doubled)`.)',
          right: PIT(String.raw`    vector<int> v = {1, 2, 3};
    vector<int> doubled;
    transform(v.begin(), v.end(), back_inserter(doubled), [](int x) { return x * 2; });
    cout << doubled.size() << endl;`),
        },
        {
          logic: true,
          wrong: PIT(String.raw`    vector<int> v = {1, 2, 3, 4, 5};
    remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
    cout << v.size() << endl;`),
          why: '`remove_if` only **moves** the keepers to the front; it never shrinks the vector. Without the `erase` step the size is still 5. No error appears. Write `v.erase(remove_if(...), v.end());`.',
          right: PIT(String.raw`    vector<int> v = {1, 2, 3, 4, 5};
    v.erase(remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());
    cout << v.size() << endl;`),
        },
        {
          logic: true,
          wrong: PIT(String.raw`    vector<int> v = {5, 10, 15};
    int limit = 7;
    auto big = [limit](int x) { return x > limit; };
    limit = 12;
    cout << count_if(v.begin(), v.end(), big) << endl;`),
          why: '`[limit]` copies `limit` **at the moment the lambda is made** (7), so changing `limit` to 12 afterwards has no effect, and it counts 10 and 15 (two). If the lambda should see later changes, capture by reference: `[&limit]`.',
          right: PIT(String.raw`    vector<int> v = {5, 10, 15};
    int limit = 7;
    auto big = [&limit](int x) { return x > limit; };
    limit = 12;
    cout << count_if(v.begin(), v.end(), big) << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'What is `v.end()` for a vector?', options: ['A marker just past the last item, never to be dereferenced', 'The last item', 'The number of items', 'The first item'], answer: 0, explain: '`end()` marks “nothing more”. You compare with it, but you never use `*v.end()`.' },
    { t: 'quiz', question: 'How do you delete every item that matches a test from a vector?', options: ['v.erase(remove_if(v.begin(), v.end(), test), v.end())', 'remove_if(v.begin(), v.end(), test)', 'v.clear(test)', 'a range-for that calls erase'], answer: 0, explain: '`remove_if` moves the keepers forward, and `erase` cuts off what is left. Neither works alone.' },
    {
      t: 'recap',
      items: [
        'An iterator is a finger on an item: `*it` is the item, `++it` moves on, `v.end()` is past the last item. Loop with `it != v.end()`. For a map, `it->first` and `it->second`.',
        'Erase while walking with `it = c.erase(it)` (only `++it` when you did not erase). Delete many items from a vector with **erase-remove**.',
        '`transform` (with `back_inserter`), `copy_if`, `count_if`, `any_of`, `all_of`, `unique` (after `sort`), `for_each` and `accumulate` work on every container.',
        'A lambda captures by copy (`[x]`, `[=]`) or by reference (`[&x]`, `[&]`). A copy is frozen at the moment the lambda is made. A `mutable` lambda may change its own copies.',
        'Iterators let the same algorithm work on a vector, a set and a map.',
      ],
      memory: 'A finger on the shelf.',
    },
  ],
  exercises: [
    {
      id: 'cppp17-odds',
      title: 'Keep the odd ones',
      prompt: 'Read whole numbers until the input ends. **Remove all the even numbers** from the vector using erase-remove, and print the numbers that are left on one line, separated by spaces. If nothing is left, print `none`.',
      starter: PITF('// Use erase and remove_if\n', '    // Read the numbers, remove the even ones, print the rest'),
      tests: [
        { input: '1 2 3 4 5 6', expected: '1 3 5' },
        { input: '2 4 6', expected: 'none', hidden: true },
        { input: '7', expected: '7', hidden: true },
        { input: '10 11 12 13 14 15', expected: '11 13 15', hidden: true },
      ],
      hints: [
        'Read into a `vector<int>`. Then `v.erase(remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());`.',
        'Check `v.empty()` before printing: if it is empty print `none`.',
        'Print the remaining values with a space between them.',
      ],
    },
    {
      id: 'cppp17-squares',
      title: 'Squares of the positives',
      prompt: 'Read whole numbers until the input ends. Using `copy_if` and `transform` (or one of them with a good lambda), build the **squares of the positive numbers only** and print them on one line separated by spaces, in the original order. If there are no positive numbers print `none`.',
      starter: PITF('// Use copy_if and transform with back_inserter\n', '    // Read the numbers, keep the positive ones, square them'),
      tests: [
        { input: '3 -1 4 -1 5', expected: '9 16 25' },
        { input: '-5 0 -2', expected: 'none', hidden: true },
        { input: '2', expected: '4', hidden: true },
        { input: '0 1 -1 2', expected: '1 4', hidden: true },
      ],
      hints: [
        'Make a second vector for the positives: `copy_if(v.begin(), v.end(), back_inserter(positives), [](int x) { return x > 0; });`.',
        'Then `transform(positives.begin(), positives.end(), back_inserter(squares), [](int x) { return x * x; });`.',
        'Zero is not positive. If `squares` is empty print `none`.',
      ],
    },
    {
      id: 'cppp17-threshold',
      title: 'Above the limit',
      prompt: 'The first number is a **limit**. The rest are sales. Using a lambda that **captures** the limit, count how many sales are strictly **above** it, and add up those sales. Print:\n\n`Count: 2`\n`Sum: 27000`\n\n(for `10000 12000 8500 15000 9000`)',
      starter: PITF('// Use a lambda with a capture list\n', '    // Read the limit and the sales'),
      tests: [
        { input: '10000 12000 8500 15000 9000', expected: 'Count: 2\nSum: 27000' },
        { input: '5 1 2 3', expected: 'Count: 0\nSum: 0', hidden: true },
        { input: '0 4 5 6', expected: 'Count: 3\nSum: 15', hidden: true },
        { input: '100 100 101', expected: 'Count: 1\nSum: 101', hidden: true },
      ],
      hints: [
        'Read the limit first, then the sales into a vector until the input ends.',
        'Count with `count_if(v.begin(), v.end(), [limit](int s) { return s > limit; })`.',
        'Add the sales with a loop, or with `for_each` and a lambda that captures `total` by reference: `[&total, limit](int s) { if (s > limit) total += s; }`.',
      ],
    },
    {
      id: 'cppp17-prune',
      title: 'Prune the rare words',
      prompt: 'Read lines of the form `word count` until the input ends and store them in a `map<string, int>` (a repeated word replaces the old count). Then **erase every word whose count is less than 3** with the iterator-erase pattern, and print the remaining words in alphabetical order as `word: count`. If none is left print `none`.',
      starter: PITF('// Use it = m.erase(it) inside an iterator loop\n', '    // Read the pairs, prune the map, print it'),
      tests: [
        { input: 'rolex 5 soda 2 tea 3', expected: 'rolex: 5\ntea: 3' },
        { input: 'a 1 b 2', expected: 'none', hidden: true },
        { input: 'z 9 a 9', expected: 'a: 9\nz: 9', hidden: true },
        { input: 'x 1 x 7', expected: 'x: 7', hidden: true },
      ],
      hints: [
        'Read with `while (cin >> word >> count) { m[word] = count; }`.',
        'Loop `for (auto it = m.begin(); it != m.end();)`. If `it->second < 3` do `it = m.erase(it);` else `++it;`.',
        'Print with `for (const auto &entry : m)`, and `none` if `m.empty()`.',
      ],
    },
  ],
};
