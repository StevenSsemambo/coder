// C++ Pro, Level 1: Real strings and vectors. Lesson 1 (std::string).
import { progPro, INC_STR } from './shared.js';

const LEVEL = 'Level 1: Real strings and vectors';
const INC_CT = '#include <iostream>\n#include <string>\n#include <cctype>';

export const stringsLesson = {
  id: 'cppp-strings',
  level: LEVEL,
  minutes: 30,
  title: 'Real strings: std::string',
  summary: 'Text that grows by itself: joining, reading lines, characters, find and substr, and comparing',
  blocks: [
    {
      t: 'story',
      title: 'A name that does not fit',
      text: 'In Part A, Mama Rose’s receipts stored every customer’s name in a row of `char` boxes. She had to decide **in advance** how many boxes a name needs. Then one day a customer called Nakato Namukasa Josephine Mbabazi arrived, and the name did not fit. The program had no room, and it either cut the name short or broke.\n\nReal C++ has a type made for text: **`std::string`**. A `string` is like an **elastic bag**: it grows to hold whatever you put in, and shrinks when you take something out. It also knows its own length, and it can be joined, compared and searched with ordinary-looking code.',
    },
    { t: 'p', text: 'From this lesson on you are using **real C++**, the same language professionals use, running through a real compiler. You write `#include <string>` to use the `string` type. Press **Run** and look at how two pieces of text are joined with `+`.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string shop = "Mama Rose";
    string dish = "rolex";
    string sign = shop + " sells " + dish;
    cout << sign << endl;
    cout << "Length: " << sign.length() << endl;
    return 0;
}
`,
      output: 'Mama Rose sells rolex\nLength: 21',
    },
    {
      t: 'list',
      items: [
        '`string shop = "Mama Rose";` makes a string and starts it with text in double quotes.',
        '`a + b` joins two texts into a new one. `a += b` adds `b` to the end of `a`.',
        '`s.length()` (or `s.size()`) is the number of characters. The **brackets are needed**: it is a call, not a value.',
        '`s[0]` is the first character, `s[1]` the second. Counting starts at 0, as with arrays.',
        '`a == b` tells you whether two strings hold exactly the same text. Unlike `char` arrays, it just works.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string a = "ab";
    string b = a + "cd";
    a += "!";
    cout << a << " " << b << " " << b.length() << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['ab! abcd 4', 'ab!cd abcd 4', 'ab abcd 4', 'ab! abcd! 5'],
      answer: 0,
      explain: '`b = a + "cd"` builds a **new** string, "abcd", from the old `a`. Then `a += "!"` changes only `a`, which becomes "ab!". The string `b` is its own copy and stays "abcd", with length 4.',
    },
    { t: 'h', text: 'Reading text from the keyboard' },
    { t: 'p', text: '`cin >> word` reads **one word**: it stops at the first space. To read a **whole line** including its spaces, use `getline(cin, line)`. Run this one with “Mama Rose” in the Input box, then try changing it.' },
    {
      t: 'try',
      stdin: 'Mama Rose',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    cout << "Hello, " << line << "!" << endl;
    return 0;
}
`,
      output: 'Hello, Mama Rose!',
    },
    {
      t: 'try',
      stdin: 'Amina Nakato',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string first, last;
    cin >> first >> last;
    cout << last << ", " << first << endl;
    return 0;
}
`,
      output: 'Nakato, Amina',
    },
    { t: 'p', text: 'There is one trap when you read a **number** and then a **line**. After `cin >> qty` the Enter key you pressed is still waiting in the input, so the next `getline` would read that empty rest of the line. The fix is `cin.ignore();`, which throws away that one leftover character. (In Part A this could not be run, and now it can.)' },
    {
      t: 'try',
      stdin: '3\nMama Rose',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    int qty;
    string name;
    cin >> qty;
    cin.ignore();
    getline(cin, name);
    cout << qty << " rolex for " << name << endl;
    return 0;
}
`,
      output: '3 rolex for Mama Rose',
    },
    { t: 'h', text: 'Looking at the characters' },
    { t: 'p', text: 'You can walk along a string with an index, or more simply with a **range-for loop**: `for (char c : text)` gives you each character in turn. The `<cctype>` tools you met in Part A (`toupper`, `isalpha`, ...) work on single characters.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string word = "education";
    int vowels = 0;
    for (char c : word) {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    cout << "Vowels: " << vowels << endl;
    return 0;
}
`,
      output: 'Vowels: 5',
    },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string name = "mama rose";
    name[0] = toupper(name[0]);
    for (int i = 1; i < name.length(); i++) {
        if (name[i - 1] == ' ') {
            name[i] = toupper(name[i]);
        }
    }
    cout << name << endl;
    return 0;
}
`,
      output: 'Mama Rose',
    },
    { t: 'tip', text: 'Unlike a `char` array, you can **change a letter in a string** (`name[0] = ...`) even after reading it from the keyboard. That was not possible in the practice runner of Part A.' },
    { t: 'h', text: 'Searching and cutting: find and substr' },
    {
      t: 'list',
      items: [
        '`s.find("rolex")` gives the **position** where the text is first found, or the special value `string::npos` when it is **not** there.',
        '`s.substr(start, length)` cuts out a piece. `s.substr(start)` with no length cuts from `start` to the end.',
      ],
    },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string email = "amina@mail.com";
    size_t at = email.find('@');
    if (at != string::npos) {
        cout << "User: " << email.substr(0, at) << endl;
        cout << "Domain: " << email.substr(at + 1) << endl;
    } else {
        cout << "Not an email" << endl;
    }
    return 0;
}
`,
      output: 'User: amina\nDomain: mail.com',
    },
    { t: 'tip', text: '`find` does **not** return -1 when it fails. It returns `string::npos`, a huge number, so always compare with `string::npos`. And `substr` stops the program if `start` is past the end of the string, so check first. (In larger C++ programs it throws an exception instead. The practice compiler in this app is built without exceptions, so there the program simply stops.)' },
    { t: 'h', text: 'Comparing words' },
    { t: 'p', text: 'You can compare strings with `==`, `!=`, `<` and `>`. “Smaller” means earlier in the dictionary order of the **character codes**. In those codes every capital letter comes **before** every small letter.' },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string a = "apple", b = "banana", c = "Zebra";
    cout << (a < b) << (c < a) << endl;
    return 0;
}
`,
      question: 'What does this program print? (true prints as 1 and false as 0)',
      options: ['11', '10', '01', '00'],
      answer: 0,
      explain: '"apple" comes before "banana", so `a < b` is true (1). And "Zebra" starts with a **capital** Z, which has a smaller code than the small letter a, so `c < a` is also true (1). To sort names without caring about capitals, change them all to the same case first.',
    },
    { t: 'h', text: 'Building text from numbers' },
    { t: 'p', text: '`to_string(42)` turns a number into text, and `string(10, \'-\')` makes ten dashes. Together with `+` they build neat lines, such as a receipt row.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    int qty = 3;
    int price = 1500;
    string line = "Soda x" + to_string(qty) + " = " + to_string(qty * price);
    cout << line << endl;
    cout << string(10, '-') << endl;
    return 0;
}
`,
      output: 'Soda x3 = 4500\n----------',
    },
    {
      t: 'fill',
      prompt: 'Fill the gap so the program reads a whole line, spaces included.',
      stdin: 'Mama Rose',
      template: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string line;
    getline(cin, ___);
    cout << "You typed: " << line << endl;
    return 0;
}
`,
      blanks: [{ options: ['line', 'cin', '"line"'], answer: 'line' }],
      output: 'You typed: Mama Rose',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string greeting = "Hello, " + "world";
    cout << greeting << endl;
    return 0;
}
`,
      question: 'This program does not compile. Why?',
      options: ['Two quoted texts cannot be added with +: at least one side must be a string', 'The text needs single quotes', 'string cannot hold a comma', 'cout cannot print a string'],
      answer: 0,
      explain: 'A quoted text like `"Hello, "` is an old-style `char` array, not a `string`, and two of those cannot be added. Make one side a real string: `string("Hello, ") + "world"`, or simply write `"Hello, world"` as one piece. (In `shop + " sells " + dish` it works because `shop` is a `string`.)',
      fixed: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string greeting = string("Hello, ") + "world";
    cout << greeting << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progPro(String.raw`    string s = 'Mama';
    cout << s << endl;`),
          why: 'Single quotes are for **one** character (`\'M\'`). Text of several characters needs double quotes: `"Mama"`.',
          right: progPro(String.raw`    string s = "Mama";
    cout << s << endl;`),
        },
        {
          wrong: progPro(String.raw`    string s = "Kampala";
    cout << s.length << endl;`),
          why: '`length` is a **call**, so it needs its brackets: `s.length()`. Without them the compiler sees a method with no call.',
          right: progPro(String.raw`    string s = "Kampala";
    cout << s.length() << endl;`),
        },
        {
          wrong: progPro(String.raw`    string s = "Jinja";
    cout << s.substr(10) << endl;`),
          why: 'The string has only 5 characters, so a start of 10 is past its end. A real C++ program with exceptions would throw `out_of_range`; here the program just stops. Always check the position first, for example `if (pos <= s.length())`.',
          right: progPro(String.raw`    string s = "Jinja";
    size_t pos = 10;
    if (pos <= s.length()) {
        cout << s.substr(pos) << endl;
    } else {
        cout << "too short" << endl;
    }`),
        },
        {
          logic: true,
          stdin: '5\nMama Rose',
          wrong: progPro(String.raw`    int qty;
    string name;
    cin >> qty;
    getline(cin, name);
    cout << qty << " for [" << name << "]" << endl;`),
          why: 'After `cin >> qty` the Enter key is still in the input, so `getline` reads that leftover empty line and the name is empty: `5 for []`. No error appears. Add `cin.ignore();` between them.',
          right: progPro(String.raw`    int qty;
    string name;
    cin >> qty;
    cin.ignore();
    getline(cin, name);
    cout << qty << " for [" << name << "]" << endl;`),
        },
        {
          logic: true,
          stdin: 'Mama Rose',
          wrong: progPro(String.raw`    string name;
    cin >> name;
    cout << "Hello, " << name << "!" << endl;`),
          why: '`cin >>` stops at the first space, so only “Mama” was read and the program prints `Hello, Mama!`. To read the whole line use `getline(cin, name);`.',
          right: progPro(String.raw`    string name;
    getline(cin, name);
    cout << "Hello, " << name << "!" << endl;`),
        },
        {
          logic: true,
          wrong: progPro(String.raw`    string email = "nomail.com";
    if (email.find('@')) {
        cout << "Has @" << endl;
    } else {
        cout << "No @" << endl;
    }`),
          why: '`find` returns `string::npos` (a huge, **non-zero** number) when the character is missing, and non-zero counts as true. So this prints `Has @` for text without one. (It would also say “No @” when the @ is at position 0.) Compare with `string::npos` explicitly.',
          right: progPro(String.raw`    string email = "nomail.com";
    if (email.find('@') != string::npos) {
        cout << "Has @" << endl;
    } else {
        cout << "No @" << endl;
    }`),
        },
      ],
    },
    { t: 'quiz', question: 'What does `s.length()` give for `string s = "Kampala";`?', options: ['7', '8', '6', '1'], answer: 0, explain: 'Seven characters. A `string` has no hidden end marker to count (that was a feature of `char` arrays), so the length is just the number of characters.' },
    { t: 'quiz', question: 'Which line reads a whole line of text, spaces included, into the string `text`?', options: ['getline(cin, text);', 'cin >> text;', 'cin.getline(text);', 'text = cin;'], answer: 0, explain: '`cin >> text` stops at the first space. `getline(cin, text)` reads up to the end of the line.' },
    {
      t: 'recap',
      items: [
        '`#include <string>` gives you `string`: text that grows by itself and knows its length (`s.length()`).',
        'Join with `+` and `+=`. At least one side of a `+` must be a `string`, not two quoted texts.',
        '`cin >> word` reads one word. `getline(cin, line)` reads a whole line. After `cin >> number`, use `cin.ignore();` before `getline`.',
        '`find` gives a position or `string::npos`. `substr(start, length)` cuts a piece, and `start` must not be past the end.',
        'Compare with `==` and `<`. Capital letters sort before small ones. `to_string(n)` turns a number into text.',
      ],
      memory: 'An elastic bag of characters.',
    },
  ],
  exercises: [
    {
      id: 'cppp1-welcome',
      title: 'A proper welcome',
      prompt: 'Read a **first name** and a **last name** (two words). Print a welcome and the total number of letters in both names, like this:\n\n`Welcome, Amina Nakato!`\n`Letters: 11`',
      starter: progPro('    // Read first and last name, print the welcome and the letters\n'),
      tests: [
        { input: 'Amina Nakato', expected: 'Welcome, Amina Nakato!\nLetters: 11' },
        { input: 'Peter Kato', expected: 'Welcome, Peter Kato!\nLetters: 9' },
        { input: 'Jo Li', expected: 'Welcome, Jo Li!\nLetters: 4', hidden: true },
      ],
      hints: [
        'Declare two strings and read them with `cin >> first >> last;`.',
        'The number of letters is `first.length() + last.length()`. The space between the names does not count.',
        'Print with `cout << "Welcome, " << first << " " << last << "!" << endl;`.',
      ],
    },
    {
      id: 'cppp1-words',
      title: 'Count the words',
      prompt: 'Read a whole **line** of text. The words are separated by **single spaces**, with no space at the start or the end, and the line is never empty. Print the number of words, like this: `Words: 4` (for `Mama Rose sells rolex`).',
      starter: progPro('    // Read a line with getline, count the words\n'),
      tests: [
        { input: 'Mama Rose sells rolex', expected: 'Words: 4' },
        { input: 'Karibu', expected: 'Words: 1' },
        { input: 'a b c d e f', expected: 'Words: 6', hidden: true },
        { input: 'one two', expected: 'Words: 2', hidden: true },
      ],
      hints: [
        'Read the line with `getline(cin, line);`. With single spaces, the number of words is the number of spaces plus one.',
        'Start `int words = 1;` and add 1 to it every time you meet a space: `for (char c : line) { if (c == \' \') words++; }`.',
        'Print `Words: ` followed by the count after the loop.',
      ],
    },
    {
      id: 'cppp1-email',
      title: 'Split the email',
      prompt: 'Read an email address (one word). If it contains `@`, print the part before it and the part after it:\n\n`User: amina`\n`Domain: mail.com`\n\nIf there is no `@`, print `Not an email`.',
      starter: progPro('    // Read the address, find the @, cut the two parts with substr\n'),
      tests: [
        { input: 'amina@mail.com', expected: 'User: amina\nDomain: mail.com' },
        { input: 'kato@gmail.com', expected: 'User: kato\nDomain: gmail.com' },
        { input: 'nomail.com', expected: 'Not an email', hidden: true },
        { input: 'a@b', expected: 'User: a\nDomain: b', hidden: true },
      ],
      hints: [
        'Use `size_t at = email.find(\'@\');`. If `at == string::npos` the @ is missing.',
        'The user is `email.substr(0, at)`: start at 0 and take `at` characters.',
        'The domain starts just **after** the @: `email.substr(at + 1)` takes everything to the end.',
      ],
    },
    {
      id: 'cppp1-initials',
      title: 'Initials',
      prompt: 'Read a full name on one line (two or more words, single spaces). Print the **initials**, each capital letter followed by a dot, like this: `A.N.J.` (for `Amina Nakato Joy`). The names start with a capital letter already.',
      starter: progPro('    // Read the whole line, collect the first letter of each word\n'),
      tests: [
        { input: 'Amina Nakato Joy', expected: 'A.N.J.' },
        { input: 'Peter Kato', expected: 'P.K.' },
        { input: 'Mary', expected: 'M.', hidden: true },
        { input: 'Ruth Akello Ouma Peace', expected: 'R.A.O.P.', hidden: true },
      ],
      hints: [
        'Read the line with `getline`, and build the answer in a second `string out = "";`.',
        'A letter is the first of a word when it is the very first character, or when the character before it is a space.',
        'Add it with `out += line[i];` and then `out += \'.\';`. Print `out` after the loop.',
      ],
    },
  ],
};
