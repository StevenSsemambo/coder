// C++ Pro, Level 3: Generic and modern C++. Lesson 16 (map, set, pair, stack, queue, unordered_map).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 3: Generic and modern C++';
const INC_M = '#include <iostream>\n#include <string>\n#include <vector>\n#include <map>\n#include <set>\n#include <stack>\n#include <queue>\n#include <unordered_map>';
const PM = (body) => progPro(body, INC_M);
const PMF = (above, body, inc = INC_M) => progProFn(above, body, inc);

export const containersLesson = {
  id: 'cppp-containers',
  level: LEVEL,
  minutes: 34,
  title: 'The standard containers: map, set, stack and queue',
  summary: 'Counting with a map, keeping unique sorted values in a set, last-in-first-out with a stack, first-in-first-out with a queue',
  blocks: [
    {
      t: 'story',
      title: 'Which word does the shop hear most?',
      text: 'Mama Rose listens to what customers ask for all day and wants to know which words come up most. With a `vector` you would search the list **for every word**, which is slow and clumsy. What she needs is a **lookup table**: give it a word, and it tells you the number next to it.\n\nThe standard library has ready-made containers for exactly such jobs: a **`map`** (a lookup table), a **`set`** (a collection with no duplicates), a **`stack`** (last in, first out) and a **`queue`** (first in, first out). All of them are templates, so they work with any type.',
    },
    { t: 'h', text: 'map: look things up by a key' },
    { t: 'p', text: 'A `map<string, int>` stores **pairs**: a **key** (the word) and a **value** (the count). `m[key]` finds the value for a key, and **creates it as 0** if the key is new, which makes counting very short. A map always keeps its keys **in sorted order**, so looping over it gives the words alphabetically.' },
    {
      t: 'try',
      stdin: 'rolex soda rolex tea rolex soda',
      code: String.raw`#include <iostream>
#include <string>
#include <map>
using namespace std;

int main() {
    map<string, int> count;
    string word;
    while (cin >> word) {
        count[word]++;
    }
    for (const auto &entry : count) {
        cout << entry.first << ": " << entry.second << endl;
    }
    return 0;
}
`,
      output: 'rolex: 3\nsoda: 2\ntea: 1',
    },
    {
      t: 'list',
      items: [
        '`m[key] = value;` stores a value, or replaces it. `m[key]++` adds 1 (starting from 0 if the key is new).',
        'Each entry is a **pair**: `entry.first` is the key and `entry.second` is the value. `for (const auto &entry : m)` visits them **in key order**.',
        '`m.count(key)` is 1 if the key exists and 0 if not. `m.find(key)` gives an iterator, or `m.end()` if it is missing. `m.erase(key)` removes it. `m.size()` counts the keys.',
        '**Careful:** `m[key]` on a key that is **not there creates it**. To only check, use `count` or `find`.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> m;
    m["a"] = 1;
    m["a"]++;
    m["b"];
    cout << m.size() << " " << m["a"] << " " << m["b"] << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['2 2 0', '1 2 0', '2 1 0', '2 2 1'],
      answer: 0,
      explain: '`m["a"] = 1` then `m["a"]++` makes a = 2. The lonely `m["b"];` **creates** b with the default value 0, so the map has two keys (size 2) and b is 0.',
    },
    { t: 'h', text: 'set: unique values, kept sorted' },
    { t: 'p', text: 'A `set` is like a map with **only keys**. Adding a value that is already there does nothing, and the values come out **sorted**. That makes it perfect for “remove the duplicates”.' },
    {
      t: 'try',
      stdin: '5 3 9 3 5 1',
      code: String.raw`#include <iostream>
#include <set>
using namespace std;

int main() {
    set<int> unique;
    int x;
    while (cin >> x) {
        unique.insert(x);
    }
    for (int n : unique) {
        cout << n << " ";
    }
    cout << endl;
    cout << "Distinct: " << unique.size() << " Has 9: " << unique.count(9) << endl;
    return 0;
}
`,
      output: '1 3 5 9\nDistinct: 4 Has 9: 1',
    },
    { t: 'h', text: 'stack: the last one in is the first one out' },
    { t: 'p', text: 'The standard `stack<T>` has `push`, `top` (look at the newest), `pop` (remove it, and it **returns nothing**), `empty` and `size`. Never call `top` or `pop` on an empty stack: check `empty()` first. A stack is the natural tool for “matching pairs”, such as brackets.' },
    {
      t: 'try',
      stdin: '(()[])',
      code: String.raw`#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    string text;
    cin >> text;
    stack<char> open;
    bool ok = true;
    for (char c : text) {
        if (c == '(' || c == '[') {
            open.push(c);
        } else {
            if (open.empty()) {
                ok = false;
                break;
            }
            char top = open.top();
            open.pop();
            if ((c == ')' && top != '(') || (c == ']' && top != '[')) {
                ok = false;
                break;
            }
        }
    }
    if (!open.empty()) {
        ok = false;
    }
    cout << (ok ? "Balanced" : "Not balanced") << endl;
    return 0;
}
`,
      output: 'Balanced',
    },
    { t: 'h', text: 'queue: first come, first served' },
    { t: 'p', text: 'A `queue<T>` is the line at the till: `push` joins at the back, `front` looks at the person at the front, and `pop` removes them. Again `pop` returns nothing, and you must not touch an empty queue.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <queue>
#include <string>
using namespace std;

int main() {
    queue<string> line;
    line.push("Amina");
    line.push("Peter");
    line.push("Kato");
    cout << "Serving " << line.front() << endl;
    line.pop();
    cout << "Next " << line.front() << ", waiting: " << line.size() << endl;
    return 0;
}
`,
      output: 'Serving Amina\nNext Peter, waiting: 2',
    },
    { t: 'h', text: 'unordered_map: fast lookup, no order' },
    { t: 'p', text: '`unordered_map` is a lookup table that is usually **faster** than `map` for finding one key, but it keeps its keys in **no particular order**. The order can even differ between computers. So: use it for looking things up, and **never print by looping over it** if the order matters (use `map` for that).' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> price;
    price["rolex"] = 3000;
    price["soda"] = 1500;
    string wanted = "soda";
    if (price.count(wanted) > 0) {
        cout << wanted << " costs " << price[wanted] << endl;
    }
    cout << "tea known: " << price.count("tea") << endl;
    return 0;
}
`,
      output: 'soda costs 1500\ntea known: 0',
    },
    { t: 'h', text: 'Which container?' },
    {
      t: 'list',
      items: [
        '`vector`: an ordered list, fast to add at the end and to reach by position. **Your default choice.**',
        '`map`: look up a value by a **key**, keys kept **sorted**. `unordered_map`: the same but faster and **unordered**.',
        '`set`: only keys, **no duplicates**, sorted.',
        '`stack`: only the newest matters (undo, matching brackets). `queue`: only the oldest matters (a waiting line).',
      ],
    },
    {
      t: 'fill',
      prompt: 'Fill the gap with the method that tells how many times a key is in a map (0 or 1).',
      template: String.raw`#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> m;
    m["a"] = 1;
    cout << m.___("a") << m.___("b") << endl;
    return 0;
}
`,
      blanks: [
        { options: ['count', 'add', 'has'], answer: 'count' },
        { options: ['count', 'add', 'has'], answer: 'count' },
      ],
      output: '10',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <map>
#include <string>
using namespace std;

int lookup(const map<string, int> &m, const string &key) {
    return m[key];
}

int main() {
    map<string, int> m;
    m["a"] = 5;
    cout << lookup(m, "a") << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['The [] operator may create a missing key, so it cannot be used on a const map', 'The key must be an int', 'lookup must return a string', 'A map cannot be passed by reference'],
      answer: 0,
      explain: '`m[key]` can **insert** a new entry, which changes the map, and the parameter is `const`. For a read-only lookup use `find` or `count`: `auto it = m.find(key); return it == m.end() ? 0 : it->second;`.',
      fixed: String.raw`#include <iostream>
#include <map>
#include <string>
using namespace std;

int lookup(const map<string, int> &m, const string &key) {
    auto it = m.find(key);
    return it == m.end() ? 0 : it->second;
}

int main() {
    map<string, int> m;
    m["a"] = 5;
    cout << lookup(m, "a") << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PM(String.raw`    set<int> s;
    s.push_back(5);
    cout << s.size() << endl;`),
          why: 'A `set` has no `push_back`, because it decides the position itself (sorted). Its method is `insert`: `s.insert(5);`.',
          right: PM(String.raw`    set<int> s;
    s.insert(5);
    cout << s.size() << endl;`),
        },
        {
          wrong: PM(String.raw`    stack<int> s;
    s.push(1);
    cout << s[0] << endl;`),
          why: 'A `stack` only lets you see the **top**. It has no `[]`, no loop over its contents. Use `s.top()`.',
          right: PM(String.raw`    stack<int> s;
    s.push(1);
    cout << s.top() << endl;`),
        },
        {
          wrong: PM(String.raw`    queue<int> q;
    q.push_front(1);
    cout << q.size() << endl;`),
          why: 'A `queue` adds only at the **back** (`push`) and removes only from the **front** (`pop`). There is no `push_front`.',
          right: PM(String.raw`    queue<int> q;
    q.push(1);
    cout << q.size() << endl;`),
        },
        {
          logic: true,
          wrong: PM(String.raw`    map<string, int> stock;
    if (stock["tea"] == 0) {
        cout << "out of tea" << endl;
    }
    cout << stock.size() << endl;`),
          why: 'The check `stock["tea"]` **created** a `tea` entry with value 0, so the map now holds one item even though nobody stocked tea. No error appears. To only ask, use `stock.count("tea")`.',
          right: PM(String.raw`    map<string, int> stock;
    if (stock.count("tea") == 0) {
        cout << "out of tea" << endl;
    }
    cout << stock.size() << endl;`),
        },
        {
          logic: true,
          wrong: PM(String.raw`    map<string, int> m = {{"a", 1}, {"b", 2}};
    for (auto entry : m) {
        entry.second = 100;
    }
    cout << m["a"] << " " << m["b"] << endl;`),
          why: '`auto entry` is a **copy** of each pair, so changing it changes nothing in the map and it still prints 1 2. To change the values in place, loop with a reference: `for (auto &entry : m)`.',
          right: PM(String.raw`    map<string, int> m = {{"a", 1}, {"b", 2}};
    for (auto &entry : m) {
        entry.second = 100;
    }
    cout << m["a"] << " " << m["b"] << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'In what order does a `for` loop over a `map<string, int>` visit the keys?', options: ['Sorted by key', 'In the order they were inserted', 'Random order each time', 'Reverse order'], answer: 0, explain: 'A `map` keeps its keys sorted. (An `unordered_map` does not, which is why you should not print from one.)' },
    { t: 'quiz', question: 'Which container fits “undo the last action, then the one before it”?', options: ['stack', 'queue', 'set', 'map'], answer: 0, explain: 'Undo goes back from the newest action, so last in, first out. A stack.' },
    {
      t: 'recap',
      items: [
        '`map<K, V>`: key to value, **sorted by key**. `m[key]++` counts. `m[key]` **creates** a missing key, so use `count` or `find` to only ask.',
        '`set<T>`: unique values, sorted. `insert`, `count`, `erase`. `unordered_map` is faster but unordered: never print from it.',
        '`stack<T>`: `push`, `top`, `pop`, `empty`. `queue<T>`: `push`, `front`, `pop`, `empty`. `pop` returns nothing, and never use `top` or `front` on an empty one.',
        'Each map entry is a pair: `entry.first` (key), `entry.second` (value). Loop with `const auto &` to read, `auto &` to change.',
        'Default to `vector`. Pick the container by the **question** you ask most: look up, no duplicates, newest first, oldest first.',
      ],
      memory: 'Ask the question, pick the container.',
    },
  ],
  exercises: [
    {
      id: 'cppp16-wordcount',
      title: 'Word counts, alphabetical',
      prompt: 'Read words until the input ends and print how many times each word appears, one per line, **in alphabetical order**: `rolex: 3`',
      starter: PMF('// Count the words with a map\n', '    // Read words until the input ends'),
      tests: [
        { input: 'rolex soda rolex tea rolex soda', expected: 'rolex: 3\nsoda: 2\ntea: 1' },
        { input: 'karibu', expected: 'karibu: 1', hidden: true },
        { input: 'b a b a c', expected: 'a: 2\nb: 2\nc: 1', hidden: true },
        { input: 'Zebra apple Zebra', expected: 'Zebra: 2\napple: 1', hidden: true },
      ],
      hints: [
        'Use `map<string, int> count;` and `count[word]++;` for every word you read.',
        'A `map` is already sorted by key, so looping over it gives the alphabetical order.',
        'Print with `for (const auto &entry : count) { cout << entry.first << ": " << entry.second << endl; }`.',
      ],
    },
    {
      id: 'cppp16-distinct',
      title: 'Distinct and sorted',
      prompt: 'Read whole numbers until the input ends. Print the **distinct** numbers in increasing order on one line, separated by spaces, and then how many distinct numbers there were:\n\n`1 3 5 9`\n`Distinct: 4`',
      starter: PMF('// Use a set\n', '    // Read numbers until the input ends'),
      tests: [
        { input: '5 3 9 3 5 1', expected: '1 3 5 9\nDistinct: 4' },
        { input: '7', expected: '7\nDistinct: 1', hidden: true },
        { input: '2 2 2', expected: '2\nDistinct: 1', hidden: true },
        { input: '-1 0 -1 10 0', expected: '-1 0 10\nDistinct: 3', hidden: true },
      ],
      hints: [
        'A `set<int>` ignores duplicates and keeps its values sorted, so `insert` every number you read.',
        'Loop over the set to print it. Put a space between the numbers.',
        'The number of distinct values is `s.size()`.',
      ],
    },
    {
      id: 'cppp16-brackets',
      title: 'Balanced brackets',
      prompt: 'Read one word made only of the characters `(`, `)`, `[`, `]`, `{` and `}`. Print `Balanced` if every bracket is closed by the right kind in the right order, otherwise `Not balanced`. The empty case does not occur.',
      starter: PMF('// Use a stack\n', '    // Read the word and check the brackets'),
      tests: [
        { input: '(()[])', expected: 'Balanced' },
        { input: '([)]', expected: 'Not balanced' },
        { input: '{[()]}', expected: 'Balanced', hidden: true },
        { input: '(((', expected: 'Not balanced', hidden: true },
        { input: '))', expected: 'Not balanced', hidden: true },
        { input: '{}[]()', expected: 'Balanced', hidden: true },
      ],
      hints: [
        'Push every opening bracket onto a `stack<char>`. For a closing bracket, the stack must not be empty and its top must be the matching opener.',
        'When it matches, `pop` it. If it does not match (or the stack is empty), the answer is `Not balanced` straight away.',
        'At the end the stack must be empty: any opener left over means `Not balanced`.',
      ],
    },
    {
      id: 'cppp16-queue',
      title: 'The waiting line',
      prompt: 'Simulate the line at the till with a `queue`. Read commands until the input ends: `arrive NAME` (joins the back, prints nothing), `serve` (prints `Serving NAME` for the person at the front and removes them, or `Nobody waiting` if the line is empty) and `size` (prints `Waiting: N`).',
      starter: PMF('// Use a queue\n', '    // Read commands until the input ends'),
      tests: [
        { input: 'arrive amina arrive peter size serve serve serve size', expected: 'Waiting: 2\nServing amina\nServing peter\nNobody waiting\nWaiting: 0' },
        { input: 'serve', expected: 'Nobody waiting', hidden: true },
        { input: 'arrive a serve arrive b arrive c serve size', expected: 'Serving a\nServing b\nWaiting: 1', hidden: true },
      ],
      hints: [
        'Keep a `queue<string> line;`. `arrive` is `line.push(name)`.',
        '`serve`: if `line.empty()` print `Nobody waiting`; otherwise print `Serving ` and `line.front()`, then `line.pop()`.',
        '`size` prints `Waiting: ` and `line.size()`.',
      ],
    },
  ],
};
