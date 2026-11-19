// C++ Pro, Level 1: Real strings and vectors. Lesson 3 (<algorithm>, lambdas as rules).
import { progPro } from './shared.js';

const LEVEL = 'Level 1: Real strings and vectors';
const INC_A = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <numeric>\n#include <functional>';
const PA = (body) => progPro(body, INC_A);

export const algorithmsLesson = {
  id: 'cppp-algorithms',
  level: LEVEL,
  minutes: 32,
  title: 'The algorithm library: sort, find, count and lambdas',
  summary: 'Sorting and searching in one line, iterators, min and max, accumulate, and writing your own sort rule with a lambda',
  blocks: [
    {
      t: 'story',
      title: 'Which day was the best, in one line?',
      text: 'On Sunday evening Mama Rose wants the week’s takings in order, the best day, the worst day, and whether she ever earned exactly 15,000. In Part A you wrote a **bubble sort** by hand, and a search loop by hand. Real C++ ships all of these jobs, already written, tested and fast, in the **algorithm library**: `#include <algorithm>`.\n\nProfessional C++ programmers do not rewrite a sort every time. They call `sort`. Your job is to know **what tools exist** and how to hand them your data.',
    },
    { t: 'p', text: 'Every algorithm needs to know **where your data starts and where it stops**. You tell it with two markers called **iterators**: `v.begin()` is the start of the vector, and `v.end()` is the spot **just after the last value**. “Sort everything between these two markers” is written `sort(v.begin(), v.end())`.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> sales = {12000, 8500, 15000, 9000, 11000};
    sort(sales.begin(), sales.end());
    for (int s : sales) {
        cout << s << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: '8500 9000 11000 12000 15000',
    },
    { t: 'tip', text: '`sort` rearranges the vector **itself**. It does not make a new sorted copy, and it returns nothing. If you want to keep the original order, copy the vector first: `vector<int> sorted = v; sort(sorted.begin(), sorted.end());`.' },
    { t: 'h', text: 'Choosing the order' },
    { t: 'p', text: 'By default `sort` puts the smallest first. A third argument says how to compare two values. `greater<int>()` (from `<functional>`) means “bigger first”. You can also write the rule yourself as a **lambda**: a small function with no name, written right where it is used. `[](int a, int b) { return a < b; }` reads “given two numbers `a` and `b`, answer: should `a` come first?”' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

int main() {
    vector<int> v = {5, 1, 4, 2, 3};
    sort(v.begin(), v.end(), greater<int>());
    for (int n : v) {
        cout << n << " ";
    }
    cout << endl;
    sort(v.begin(), v.end(), [](int a, int b) { return a < b; });
    for (int n : v) {
        cout << n << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: '5 4 3 2 1\n1 2 3 4 5',
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {3, 1, 2};
    sort(v.begin(), v.end());
    reverse(v.begin(), v.end());
    cout << v[0] << v[2] << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['31', '13', '32', '12'],
      answer: 0,
      explain: '`sort` makes it 1 2 3. Then `reverse` turns it around: 3 2 1. So `v[0]` is 3 and `v[2]` is 1, and they print side by side as 31.',
    },
    { t: 'h', text: 'Your own sorting rule: a lambda' },
    { t: 'p', text: 'A lambda lets you sort by **anything**. Here words are sorted by their length, shortest first. When two words have the same length, we want them to **keep the order they were in**, so we use `stable_sort`: it never swaps two items that compare as equal. (Plain `sort` makes no such promise, and could put equal items in a different order on different computers.)' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> words = {"banana", "fig", "apple", "kiwi", "plum"};
    stable_sort(words.begin(), words.end(), [](string a, string b) {
        return a.length() < b.length();
    });
    for (string w : words) {
        cout << w << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: 'fig kiwi plum apple banana',
    },
    { t: 'h', text: 'Searching and counting' },
    { t: 'p', text: '`find(begin, end, x)` looks for `x` and gives back an iterator to it, or `v.end()` when it is **not** there. To turn the iterator into a position, subtract the start: `it - v.begin()`. `count(begin, end, x)` says how many times `x` appears.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {4, 9, 2, 7, 2};
    auto it = find(v.begin(), v.end(), 7);
    if (it != v.end()) {
        cout << "7 is at index " << (it - v.begin()) << endl;
    }
    cout << "2 appears " << count(v.begin(), v.end(), 2) << " times" << endl;
    return 0;
}
`,
      output: '7 is at index 3\n2 appears 2 times',
    },
    { t: 'h', text: 'Biggest, smallest and the total' },
    { t: 'p', text: '`max_element` and `min_element` give back an **iterator** to the biggest and the smallest value, so put a `*` in front to get the value itself (just like a pointer). `accumulate` (from `<numeric>`) adds everything up, starting from the value you give it.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

int main() {
    vector<int> sales = {12000, 8500, 15000, 9000, 11000};
    auto best = max_element(sales.begin(), sales.end());
    cout << "Best: " << *best << " on day " << (best - sales.begin() + 1) << endl;
    cout << "Worst: " << *min_element(sales.begin(), sales.end()) << endl;
    cout << "Total: " << accumulate(sales.begin(), sales.end(), 0) << endl;
    return 0;
}
`,
      output: 'Best: 15000 on day 3\nWorst: 8500\nTotal: 55500',
    },
    { t: 'h', text: 'Fast searching in sorted data' },
    { t: 'p', text: 'In Part A you met **binary search**: in sorted data you can halve the search each time. The library does it for you: `binary_search(begin, end, x)` answers true or false. It **only works on sorted data**, so sort first.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {2, 4, 6, 8, 10};
    if (binary_search(v.begin(), v.end(), 6)) {
        cout << "found" << endl;
    } else {
        cout << "missing" << endl;
    }
    if (binary_search(v.begin(), v.end(), 7)) {
        cout << "found" << endl;
    } else {
        cout << "missing" << endl;
    }
    return 0;
}
`,
      output: 'found\nmissing',
    },
    {
      t: 'fill',
      prompt: 'Fill the gap so the whole vector is sorted, from the first value to the end.',
      template: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {5, 1, 4};
    sort(v.begin(), v.___());
    for (int n : v) {
        cout << n << " ";
    }
    cout << endl;
    return 0;
}
`,
      blanks: [{ options: ['end', 'begin', 'size'], answer: 'end' }],
      output: '1 4 5',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {3, 1, 2};
    sort(v);
    cout << v[0] << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['sort needs two iterators saying where to start and where to stop', 'sort only works on strings', 'v must be sorted before it can be sorted', 'the vector needs a size'],
      answer: 0,
      explain: 'The algorithms work on a **range**, and a range is given by two iterators: `sort(v.begin(), v.end())`. Giving just the vector is not enough information.',
      fixed: String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {3, 1, 2};
    sort(v.begin(), v.end());
    cout << v[0] << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PA(String.raw`    vector<int> v = {3, 1, 2};
    auto it = find(v.begin(), v.end());
    cout << (it - v.begin()) << endl;`),
          why: '`find` needs **three** things: where to start, where to stop, and **what to look for**. This call forgot the value. Write `find(v.begin(), v.end(), 2)`.',
          right: PA(String.raw`    vector<int> v = {3, 1, 2};
    auto it = find(v.begin(), v.end(), 2);
    cout << (it - v.begin()) << endl;`),
        },
        {
          wrong: PA(String.raw`    vector<int> v = {3, 1, 2};
    cout << max_element(v.begin(), v.end()) << endl;`),
          why: '`max_element` gives back an **iterator** (a marker for the position), not the value, and an iterator cannot be printed. Put a star in front to reach the value: `*max_element(...)`.',
          right: PA(String.raw`    vector<int> v = {3, 1, 2};
    cout << *max_element(v.begin(), v.end()) << endl;`),
        },
        {
          wrong: PA(String.raw`    vector<int> v = {3, 1, 2};
    auto sorted = sort(v.begin(), v.end());
    cout << sorted[0] << endl;`),
          why: '`sort` does not give back a sorted copy. It sorts `v` itself and returns nothing. Call it on its own line, and then use `v`.',
          right: PA(String.raw`    vector<int> v = {3, 1, 2};
    sort(v.begin(), v.end());
    cout << v[0] << endl;`),
        },
        {
          logic: true,
          wrong: PA(String.raw`    vector<double> v = {0.5, 0.5, 0.5};
    cout << accumulate(v.begin(), v.end(), 0) << endl;`),
          why: 'The starting value `0` is a whole number, so `accumulate` does its adding **in whole numbers** and throws away every .5. It prints 0, with no error. Start from a decimal: `0.0`.',
          right: PA(String.raw`    vector<double> v = {0.5, 0.5, 0.5};
    cout << accumulate(v.begin(), v.end(), 0.0) << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'What does `find(v.begin(), v.end(), x)` give back when `x` is NOT in the vector?', options: ['v.end()', '-1', '0', 'v.begin()'], answer: 0, explain: '`v.end()` is the marker just past the last value. `find` returns it to say “not found”, which is why you compare the answer with `v.end()`.' },
    { t: 'quiz', question: 'Which call sorts the vector `v` from the biggest to the smallest?', options: ['sort(v.begin(), v.end(), greater<int>());', 'sort(v.end(), v.begin());', 'reverse(v);', 'sort(v.begin(), v.end(), smaller<int>());'], answer: 0, explain: 'A third argument tells `sort` how to compare, and `greater<int>()` means “bigger first”. Swapping the markers (or giving only the vector) is not valid.' },
    {
      t: 'recap',
      items: [
        '`#include <algorithm>` gives ready-made tools. They work on a range given by two iterators: `v.begin()` and `v.end()` (just past the last value).',
        '`sort(begin, end)` sorts the vector itself. Add `greater<int>()` or a lambda to choose the order. Use `stable_sort` when equal items must keep their order.',
        '`find` and `count` search. `max_element` and `min_element` return iterators, so use `*` to get the value. `binary_search` needs sorted data.',
        '`accumulate` (in `<numeric>`) adds up. Start with `0.0` for decimals.',
        'A lambda `[](int a, int b) { return a < b; }` is a small unnamed function that you can hand to an algorithm as a rule.',
      ],
      memory: 'Two markers: begin and end.',
    },
  ],
  exercises: [
    {
      id: 'cppp3-sorted',
      title: 'Both ways',
      prompt: 'Read whole numbers until the input ends. Print them sorted from the smallest to the biggest on the first line, and from the biggest to the smallest on the second line, separated by spaces:\n\n`1 2 3 4 5`\n`5 4 3 2 1`',
      starter: progPro('    // Read numbers into a vector, sort them both ways\n', INC_A),
      tests: [
        { input: '5 1 4 2 3', expected: '1 2 3 4 5\n5 4 3 2 1' },
        { input: '9 9 1', expected: '1 9 9\n9 9 1' },
        { input: '7', expected: '7\n7', hidden: true },
        { input: '-2 5 0 -7', expected: '-7 -2 0 5\n5 0 -2 -7', hidden: true },
      ],
      hints: [
        'Read with `while (cin >> x) { v.push_back(x); }` and call `sort(v.begin(), v.end());` for the first line.',
        'For the second line you can sort again with `greater<int>()` as the third argument, or just print the sorted vector backwards.',
        'Put a space **between** values, and finish each line with `endl`. A space after the last value is fine too.',
      ],
    },
    {
      id: 'cppp3-median',
      title: 'The median',
      prompt: 'The **median** is the middle value of sorted numbers. If there is an even number of values, it is the average of the two middle ones. Read whole numbers until the input ends and print the median with **one decimal**: `Median: 3.0` (for `5 1 3`) and `Median: 2.5` (for `4 1 3 2`).',
      starter: progPro('    // Sort the numbers and find the middle\n', INC_A + '\n#include <iomanip>'),
      tests: [
        { input: '5 1 3', expected: 'Median: 3.0' },
        { input: '4 1 3 2', expected: 'Median: 2.5' },
        { input: '7', expected: 'Median: 7.0', hidden: true },
        { input: '10 20', expected: 'Median: 15.0', hidden: true },
        { input: '9 1 5 3 7 100', expected: 'Median: 6.0', hidden: true },
      ],
      hints: [
        'Sort the vector first. Let `n = v.size()`. If `n` is odd, the median is `v[n / 2]`.',
        'If `n` is even, it is the average of `v[n / 2 - 1]` and `v[n / 2]`. Divide by `2.0` to keep the .5.',
        'Print with `cout << fixed << setprecision(1);` before the median.',
      ],
    },
    {
      id: 'cppp3-mode',
      title: 'The most common number',
      prompt: 'Read whole numbers until the input ends. Print the number that appears **most often**, and how many times. If several numbers tie, print the **smallest** of them:\n\n`Mode: 3`\n`Count: 3`',
      starter: progPro('    // Which number appears most often?\n', INC_A),
      tests: [
        { input: '1 2 2 3 3 3', expected: 'Mode: 3\nCount: 3' },
        { input: '4 4 5 5', expected: 'Mode: 4\nCount: 2' },
        { input: '9', expected: 'Mode: 9\nCount: 1', hidden: true },
        { input: '8 1 8 1 2', expected: 'Mode: 1\nCount: 2', hidden: true },
      ],
      hints: [
        'For each value in the vector, `count(v.begin(), v.end(), value)` tells you how many times it appears.',
        'Keep the best value and the best count so far. Replace them only when the new count is **strictly bigger**.',
        'To make ties choose the smallest number, sort the vector first and use `>` (not `>=`): the smaller number is met first and keeps its place.',
      ],
    },
    {
      id: 'cppp3-bylength',
      title: 'Shortest word first',
      prompt: 'Read words until the input ends. Print them on one line, separated by spaces, ordered by **length**, shortest first. Words with the same length must keep the order in which they were typed. For `banana fig apple kiwi plum` print: `fig kiwi plum apple banana`',
      starter: progPro('    // Read the words, sort them by length (keep the order of equal ones)\n', INC_A),
      tests: [
        { input: 'banana fig apple kiwi plum', expected: 'fig kiwi plum apple banana' },
        { input: 'bb a cc', expected: 'a bb cc' },
        { input: 'x', expected: 'x', hidden: true },
        { input: 'ccc bb aa d', expected: 'd bb aa ccc', hidden: true },
      ],
      hints: [
        'Read the words with `while (cin >> w)` into a `vector<string>`.',
        'Use `stable_sort` with a lambda: `[](string a, string b) { return a.length() < b.length(); }`. `stable_sort` keeps equal-length words in their original order.',
        'Print the words with a space between them.',
      ],
    },
  ],
};
