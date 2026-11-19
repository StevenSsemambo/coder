// C++ Pro, Level 1: Real strings and vectors. Lesson 2 (std::vector).
import { progPro } from './shared.js';

const LEVEL = 'Level 1: Real strings and vectors';
const INC_V = '#include <iostream>\n#include <string>\n#include <vector>';
const INC_VF = '#include <iostream>\n#include <string>\n#include <vector>\n#include <iomanip>';
const PV = (body) => progPro(body, INC_V);

export const vectorsLesson = {
  id: 'cppp-vectors',
  level: LEVEL,
  minutes: 30,
  title: 'Real vectors: std::vector',
  summary: 'Lists that grow and shrink: push_back, size, range-for, insert, erase and tables made of vectors',
  blocks: [
    {
      t: 'story',
      title: 'Takings with no fixed size',
      text: 'In Part A, Mama Rose recorded a week of takings in an **array**: `int sales[7]`. That worked while every week had 7 days. Then she opened for a **public holiday** and sold on 8 days. Then she wanted to record **every single customer’s payment**, and nobody knows in advance how many customers will come.\n\nAn array has a size that is fixed when you write the program. Real C++ has a list that **grows and shrinks while the program runs**: **`std::vector`**. Think of a train: you can couple one more carriage on the end whenever you need it, or take the last one off.',
    },
    { t: 'tip', text: 'Always `#include` the header of **everything you use** (`<vector>` for `vector`, `<string>` for `string`, `<algorithm>` for `sort`). Some compilers quietly let you forget one, because another header happens to include it for you. Then the very same program stops compiling on a different computer. A correct include line is the only safe habit.' },
    { t: 'p', text: 'You write `#include <vector>`, and the type of the things inside goes in angle brackets: `vector<int>` is a list of whole numbers, `vector<string>` is a list of strings. Press **Run**.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> sales = {12000, 8500, 15000};
    sales.push_back(9000);
    cout << "Days: " << sales.size() << endl;
    cout << "First: " << sales[0] << " Last: " << sales.back() << endl;
    return 0;
}
`,
      output: 'Days: 4\nFirst: 12000 Last: 9000',
    },
    {
      t: 'list',
      items: [
        '`vector<int> sales = {12000, 8500, 15000};` makes a vector and starts it with some values. `vector<int> v;` makes an empty one.',
        '`v.push_back(x)` adds `x` at the **end**. `v.pop_back()` removes the last value.',
        '`v.size()` is how many values it holds right now. `v.empty()` is true when there are none.',
        '`v[i]` is the value at position `i`, counting from 0 like an array. `v.front()` and `v.back()` are the first and the last.',
        '`v.clear()` removes everything.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    v.push_back(4);
    v.pop_back();
    v.pop_back();
    cout << v.size() << " " << v.back() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['2 2', '3 3', '2 3', '4 4'],
      answer: 0,
      explain: 'The vector starts as 1 2 3, becomes 1 2 3 4 after `push_back(4)`, and then loses its last two values: 1 2. So the size is 2 and the last value (`back()`) is 2.',
    },
    { t: 'h', text: 'Reading until the input ends' },
    { t: 'p', text: 'Because a vector can grow, you do not need to know how many numbers are coming. `while (cin >> x)` keeps reading numbers until the input **runs out**, and each one goes into the vector with `push_back`. Run it with the Input shown, then change the numbers.' },
    {
      t: 'try',
      stdin: '4 9 2 7',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    int total = 0;
    for (int n : v) {
        total += n;
    }
    cout << "Count: " << v.size() << endl;
    cout << "Total: " << total << endl;
    return 0;
}
`,
      output: 'Count: 4\nTotal: 22',
    },
    { t: 'p', text: 'The loop `for (int n : v)` is a **range-for**: it gives you each value of `v` in turn, with no index to manage. Use `auto` when you do not want to write the type: `for (auto n : v)` works for any vector.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> menu = {"Rolex", "Chapati", "Soda"};
    menu.push_back("Tea");
    for (auto item : menu) {
        cout << "- " << item << endl;
    }
    return 0;
}
`,
      output: '- Rolex\n- Chapati\n- Soda\n- Tea',
    },
    { t: 'h', text: 'Making a vector of a given size' },
    { t: 'p', text: '`vector<int> zeros(5, 0);` makes five values, all 0: the **number of values**, then the **starting value**. With only a number, `vector<int> v(5);` makes five zeros. But look out: **round brackets and curly brackets mean different things**.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> a(3);
    vector<int> b{3};
    cout << a.size() << " " << b.size() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['3 1', '3 3', '1 1', '1 3'],
      answer: 0,
      explain: '`a(3)` with round brackets means “three values”, so the size is 3. `b{3}` with curly brackets means “a list containing the value 3”, so the size is 1. The two look almost the same, and they do very different things.',
    },
    { t: 'h', text: 'Inserting and removing in the middle' },
    { t: 'p', text: '`v.insert(v.begin() + i, x)` puts `x` at position `i` and pushes the rest along. `v.erase(v.begin() + i)` removes the value at position `i`. (`v.begin()` is the start of the vector; adding `i` moves along to position `i`.) These are slower than `push_back` on very big vectors, because everything after the position has to shuffle along.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30, 40};
    v.insert(v.begin() + 1, 99);
    v.erase(v.begin() + 3);
    for (int n : v) {
        cout << n << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: '10 99 20 40',
    },
    { t: 'h', text: 'Tables: a vector of vectors' },
    { t: 'p', text: 'A vector can hold vectors, which gives a table whose rows can even have different lengths. `vector<vector<int>> grid(2, vector<int>(3, 0));` makes 2 rows of 3 zeros. Cells are `grid[row][column]`, as with arrays.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> grid(2, vector<int>(3, 0));
    grid[1][2] = 5;
    for (int r = 0; r < grid.size(); r++) {
        for (int c = 0; c < grid[r].size(); c++) {
            cout << grid[r][c] << " ";
        }
        cout << endl;
    }
    return 0;
}
`,
      output: '0 0 0\n0 0 5',
    },
    { t: 'h', text: 'Going outside the vector' },
    { t: 'p', text: '`v[i]` does **not** check that `i` is valid. If it is not, the program reads memory that is not part of the vector, and what happens is unpredictable. `v.at(i)` **does** check. In ordinary C++ a bad `at(i)` throws an exception that your program can catch; the practice compiler in this app is built without exceptions, so there the program simply **stops**. Either way it is much better than quietly using wrong data.' },
    {
      t: 'fill',
      prompt: 'Fill the gaps so the program adds 10 and then 20 at the end of the vector.',
      template: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    v.___(10);
    v.___(20);
    cout << v.size() << " " << v.back() << endl;
    return 0;
}
`,
      blanks: [
        { options: ['push_back', 'add', 'append'], answer: 'push_back' },
        { options: ['push_back', 'add', 'append'], answer: 'push_back' },
      ],
      output: '2 20',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 6, 7};
    cout << v.at(5) << endl;
    return 0;
}
`,
      question: 'This program stops without printing a number. Why?',
      options: ['The vector has 3 values, so position 5 does not exist', 'at() can only read the first value', 'A vector cannot hold the number 7', 'cout cannot print vector values'],
      answer: 0,
      explain: 'The valid positions are 0, 1 and 2. `at(5)` checks the position, finds it outside the vector, and stops the program (in ordinary C++ it would throw an `out_of_range` exception). Check the size first, for example `if (i < v.size())`.',
      fixed: String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 6, 7};
    if (v.size() > 5) {
        cout << v.at(5) << endl;
    } else {
        cout << "no such position" << endl;
    }
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PV(String.raw`    vector<int> v = {1, 2, "three"};
    cout << v.size() << endl;`),
          why: 'A `vector<int>` holds only `int`s, and `"three"` is text. All the values in a vector must have the same type.',
          right: PV(String.raw`    vector<int> v = {1, 2, 3};
    cout << v.size() << endl;`),
        },
        {
          wrong: PV(String.raw`    vector<int> v = {1, 2, 3};
    cout << v.length() << endl;`),
          why: 'A vector has no `length()`. Its number of values is `size()`. (`length()` belongs to strings; `size()` works on both.)',
          right: PV(String.raw`    vector<int> v = {1, 2, 3};
    cout << v.size() << endl;`),
        },
        {
          wrong: PV(String.raw`    vector<int> v;
    v.push_back(1, 2);
    cout << v.size() << endl;`),
          why: '`push_back` adds **one** value at a time. To add two values, call it twice: `v.push_back(1);` and then `v.push_back(2);`.',
          right: PV(String.raw`    vector<int> v;
    v.push_back(1);
    v.push_back(2);
    cout << v.size() << endl;`),
        },
        {
          wrong: PV(String.raw`    vector<int> v = {1, 2, 3};
    int i = 3;
    cout << v.at(i) << endl;`),
          why: 'The last valid position of a 3-value vector is 2. Asking `at(3)` stops the program. Positions go from 0 to `size() - 1`.',
          right: PV(String.raw`    vector<int> v = {1, 2, 3};
    int i = 2;
    cout << v.at(i) << endl;`),
        },
        {
          logic: true,
          wrong: PV(String.raw`    vector<int> v{3};
    cout << v.size() << endl;`),
          why: 'This was meant to make three values, but **curly** brackets make a list holding the single value 3, so the size is 1. No error appears. For three values use round brackets: `vector<int> v(3);`.',
          right: PV(String.raw`    vector<int> v(3);
    cout << v.size() << endl;`),
        },
        {
          logic: true,
          wrong: PV(String.raw`    vector<int> v(3);
    v.push_back(7);
    cout << v[0] << " " << v.size() << endl;`),
          why: '`vector<int> v(3)` already holds **three zeros**, and `push_back(7)` adds the 7 **after** them. So `v[0]` is 0 and the size is 4. If you want to start empty, write `vector<int> v;`.',
          right: PV(String.raw`    vector<int> v;
    v.push_back(7);
    cout << v[0] << " " << v.size() << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'Which expression is the LAST value of the vector `v` (which is not empty)?', options: ['v.back()', 'v[v.size()]', 'v.end()', 'v[-1]'], answer: 0, explain: '`v.back()` is the last value. `v[v.size()]` is one past the end, and `v[-1]` is not valid in C++.' },
    { t: 'quiz', question: 'What does `vector<int> v(4, 9);` make?', options: ['Four values, each equal to 9', 'Two values, 4 and 9', 'One value, 49', 'Nine values, each equal to 4'], answer: 0, explain: 'With two numbers in round brackets, the first is **how many** and the second is the **starting value**: 9, 9, 9, 9.' },
    {
      t: 'recap',
      items: [
        '`vector<T>` (with `#include <vector>`) is a list that grows and shrinks: `push_back`, `pop_back`, `size`, `empty`, `back`, `clear`.',
        'Positions start at 0. `v[i]` does not check the position; `v.at(i)` does (and stops the program here).',
        '`while (cin >> x) v.push_back(x);` reads numbers until the input ends. `for (auto n : v)` visits every value.',
        '`insert(v.begin() + i, x)` and `erase(v.begin() + i)` change the middle.',
        '`vector<int> v(3)` means three values, `vector<int> v{3}` means one value, 3. `vector<vector<int>>` makes a table.',
      ],
      memory: 'A train you can add carriages to.',
    },
  ],
  exercises: [
    {
      id: 'cppp2-numbers',
      title: 'Count, total, average',
      prompt: 'Read whole numbers until the input ends. Print how many there were, their total, and their average with **two decimals**:\n\n`Count: 4`\n`Total: 22`\n`Average: 5.50`\n\n(at least one number is always given)',
      starter: progPro('    // Read numbers into a vector until the input ends\n', INC_VF),
      tests: [
        { input: '4 9 2 7', expected: 'Count: 4\nTotal: 22\nAverage: 5.50' },
        { input: '10', expected: 'Count: 1\nTotal: 10\nAverage: 10.00' },
        { input: '1 2 2', expected: 'Count: 3\nTotal: 5\nAverage: 1.67', hidden: true },
        { input: '5 5 5 5 5', expected: 'Count: 5\nTotal: 25\nAverage: 5.00', hidden: true },
      ],
      hints: [
        'Read with `while (cin >> x) { v.push_back(x); }`, then add the values up with a range-for loop.',
        'The count is `v.size()`. The average must keep its decimals: `(double)total / v.size()`.',
        'Print the average with `cout << fixed << setprecision(2);` first (the starter already includes `<iomanip>`).',
      ],
    },
    {
      id: 'cppp2-top2',
      title: 'The two best days',
      prompt: 'Read **n** (at least 2) and then **n** sales. Print the **largest** and the **second largest** value. If the largest value appears twice, both count, so the second largest is the same number:\n\n`Largest: 9`\n`Second: 7`',
      starter: progPro('    // Read n and the sales into a vector. Find the two biggest\n', INC_V),
      tests: [
        { input: '5 4 9 2 7 5', expected: 'Largest: 9\nSecond: 7' },
        { input: '2 3 8', expected: 'Largest: 8\nSecond: 3' },
        { input: '3 6 6 1', expected: 'Largest: 6\nSecond: 6', hidden: true },
        { input: '4 1 2 3 4', expected: 'Largest: 4\nSecond: 3', hidden: true },
      ],
      hints: [
        'Read n, then read n numbers with `push_back`. You can walk the vector once and keep two variables, `first` and `second`.',
        'Start both with a very small number. For each value `x`: if `x > first`, then the old `first` becomes `second` and `x` becomes `first`; otherwise if `x > second`, then `x` becomes `second`.',
        'Duplicates work automatically: the second 6 is not bigger than `first`, but it is bigger than `second`.',
      ],
    },
    {
      id: 'cppp2-reverse',
      title: 'Words backwards',
      prompt: 'Read words until the input ends (separated by spaces or new lines). Print them in **reverse order** on one line, separated by single spaces. For `Mama Rose sells rolex` print: `rolex sells Rose Mama`',
      starter: progPro('    // Read words into a vector<string>, print them backwards\n', INC_V),
      tests: [
        { input: 'Mama Rose sells rolex', expected: 'rolex sells Rose Mama' },
        { input: 'one', expected: 'one' },
        { input: 'a b c', expected: 'c b a', hidden: true },
        { input: 'karibu to campus', expected: 'campus to karibu', hidden: true },
      ],
      hints: [
        '`while (cin >> word)` reads one word at a time (it splits at spaces and new lines) until the input ends. Put each into a `vector<string>`.',
        'Print from the last index to the first: `for (int i = words.size() - 1; i >= 0; i--)`.',
        'Put a space **between** words, not after the last one. For example print the first one without a space and every other one with a space in front.',
      ],
    },
    {
      id: 'cppp2-unique',
      title: 'Remove the duplicates',
      prompt: 'Read whole numbers until the input ends. Print them on one line, separated by spaces, but keep **only the first** appearance of each number and keep their order. For `1 2 2 3 1` print: `1 2 3`',
      starter: progPro('    // Keep the first appearance of every number\n', INC_V),
      tests: [
        { input: '1 2 2 3 1', expected: '1 2 3' },
        { input: '5 5 5', expected: '5' },
        { input: '3 1 2', expected: '3 1 2', hidden: true },
        { input: '9 8 9 8 7 7', expected: '9 8 7', hidden: true },
      ],
      hints: [
        'Keep a second vector, `unique`, that starts empty. For every number you read, look through `unique` to see whether it is already there.',
        'If it is not there, `push_back` it. Use a `bool found = false;` that you set to true inside the searching loop.',
        'At the end print the `unique` vector with spaces between the values.',
      ],
    },
  ],
};
