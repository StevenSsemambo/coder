// C++, Level 4: Arrays and text. Lesson 17 (text as char arrays, <cstring>, <cctype>).
//
// Practice-runner limits that shape this lesson (see docs/CPP-TRACK.md):
//  * an array filled by cin >> or cin.getline cannot be changed letter by letter, so input text is only
//    read, tested and printed; changing letters is shown on arrays created from a string literal
//  * cin.ignore() is not available
//  * arrays of strings cannot be started from a list of string literals
import { prog, IO_STR } from './shared.js';

const LEVEL = 'Level 4: Arrays and text';

export const textLessons = [
  // ================================================================== 17
  {
    id: 'cpp-cstrings',
    level: LEVEL,
    minutes: 30,
    title: 'Text as arrays of characters',
    summary: 'char arrays, the end marker, cin and getline, strlen, strcpy, strcat, strcmp and toupper',
    blocks: [
      {
        t: 'story',
        title: 'Names on the receipt',
        text: 'Every receipt at the stand has the customer’s **name** at the top. “Amina”, “Mama Rose”, “Kato”. A name is just a **row of letters**, and you already know how to hold a row of things in one name: an array. So text in C++ can be an **array of `char`**.\n\nThis lesson shows how that works, and how to read it, measure it, compare it and change it.',
      },
      { t: 'tip', text: 'Honest note: this old style of text (`char` arrays) comes from the C language and is still everywhere in real code, so every C++ programmer must understand it. Modern C++ also has a much friendlier type called `std::string`, which you will meet in Part B of this course. The practice runner inside this app cannot run `std::string` yet, so here we learn the `char` array way.' },
      { t: 'p', text: 'You can start a `char` array from text in double quotes. The `[]` with nothing inside lets the computer count the letters for you.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char shop[] = "Mama Rose";
    cout << shop << endl;
    cout << "Length: " << strlen(shop) << endl;
    cout << "First letter: " << shop[0] << endl;
    return 0;
}
`,
        output: 'Mama Rose\nLength: 9\nFirst letter: M',
      },
      { t: 'analogy', text: 'Picture the letters as **beads on a string**. How does the computer know where the string of beads ends? There is a special **knot** after the last letter. It is the character `\'\\0\'` (called the **null character**), and it is added for you automatically. Every text needs room for its knot, so a word of 7 letters needs an array of at least 8 boxes.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char s[] = "Kampala";
    cout << strlen(s) << " " << sizeof(s) << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['7 8', '7 7', '8 8', '8 7'],
        answer: 0,
        explain: '`strlen` counts the letters before the knot: 7. `sizeof` is the size of the whole array, which also includes the knot: 8 boxes.',
      },
      { t: 'h', text: 'Reading text from the keyboard' },
      { t: 'p', text: '`cin >> name` reads **one word**: it stops at the first space. To read a **whole line** with spaces, use `cin.getline(name, 40)`. The 40 is the biggest number of boxes it may fill, which protects the array from overflowing.' },
      {
        t: 'try',
        stdin: 'Amina',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    char name[20];
    cin >> name;
    cout << "Receipt for " << name << endl;
    return 0;
}
`,
        output: 'Receipt for Amina',
      },
      {
        t: 'try',
        stdin: 'Mama Rose',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    char name[40];
    cin.getline(name, 40);
    cout << "Receipt for " << name << endl;
    return 0;
}
`,
        output: 'Receipt for Mama Rose',
      },
      { t: 'tip', text: 'Honest limit of the practice runner: once a `char` array has been filled by `cin`, this runner will not let you change its letters one by one (a real C++ compiler would). So in the exercises you will read, test and print the text, and the lesson shows letter-changing on arrays created from quoted text.' },
      { t: 'h', text: 'Walking along the letters' },
      { t: 'p', text: 'Because the text ends with the knot, you can walk along it with a `for` loop that stops when it meets `\'\\0\'`. This counts the vowels in a word.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    char word[] = "education";
    int vowels = 0;
    for (int i = 0; word[i] != '\0'; i++) {
        char c = word[i];
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
      { t: 'h', text: 'Testing and changing letters: <cctype>' },
      { t: 'p', text: 'The `<cctype>` library has ready-made character tools: `isalpha(c)` (is it a letter?), `isdigit(c)` (a digit?), `isspace(c)` (a space?), `toupper(c)` and `tolower(c)` (change the case). Use the `is...` functions **inside an `if`**; do not print their result directly, because real C++ may print a number other than 1 for “yes”.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <cctype>
using namespace std;

int main() {
    char s[] = "mama rose 2026";
    int letters = 0, digits = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        if (isalpha(s[i])) {
            letters++;
        } else if (isdigit(s[i])) {
            digits++;
        }
    }
    cout << "Letters: " << letters << endl;
    cout << "Digits: " << digits << endl;
    for (int i = 0; s[i] != '\0'; i++) {
        s[i] = toupper(s[i]);
    }
    cout << s << endl;
    return 0;
}
`,
        output: 'Letters: 8\nDigits: 4\nMAMA ROSE 2026',
      },
      { t: 'h', text: 'Copying, joining and comparing: <cstring>' },
      {
        t: 'list',
        items: [
          '`strlen(s)` the number of letters in `s`.',
          '`strcpy(dest, src)` copies the text of `src` into `dest`. You **cannot** write `dest = "text"` for an array.',
          '`strcat(dest, src)` adds the text of `src` to the end of `dest`. `dest` must have room for both.',
          '`strcmp(a, b)` compares two texts. It gives **0** when they are exactly the same, a negative number when `a` comes before `b` in the alphabet, and a positive number when `a` comes after.',
        ],
      },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char full[30];
    strcpy(full, "Mama ");
    strcat(full, "Rose");
    cout << full << endl;
    if (strcmp(full, "Mama Rose") == 0) {
        cout << "Same name" << endl;
    }
    if (strcmp("apple", "banana") < 0) {
        cout << "apple comes first" << endl;
    }
    return 0;
}
`,
        output: 'Mama Rose\nSame name\napple comes first',
      },
      { t: 'tip', text: 'Never compare two texts with `==`. For arrays, `a == b` asks “are these the same **place in memory**?”, not “do they contain the same letters?”, so it is almost always false. Always use `strcmp(a, b) == 0`.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints Same when the two words are equal. The words typed in the Input box are both rose.',
        stdin: 'rose rose',
        template: String.raw`#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char a[20], b[20];
    cin >> a >> b;
    if (strcmp(a, b) ___ 0) {
        cout << "Same" << endl;
    } else {
        cout << "Different" << endl;
    }
    return 0;
}
`,
        blanks: [{ options: ['==', '!=', '<'], answer: '==' }],
        output: 'Same',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    char city[] = "Kampala";
    cout << strlen(city) << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['strlen lives in the <cstring> library, which was never included', 'city must have a size', 'strlen only works on numbers', 'cout cannot print numbers'],
        answer: 0,
        explain: 'Like `cout` needs `<iostream>`, the text tools need their own library: `#include <cstring>` for `strlen`, `strcpy`, `strcat` and `strcmp`, and `#include <cctype>` for `toupper`, `isalpha` and the others.',
        fixed: String.raw`#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char city[] = "Kampala";
    cout << strlen(city) << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            stdin: 'rose rose',
            wrong: prog(String.raw`    char a[20], b[20];
    cin >> a >> b;
    if (a == b) {
        cout << "Same" << endl;
    } else {
        cout << "Different" << endl;
    }`, IO_STR),
            why: 'Both words are “rose”, but `a == b` compares the **places in memory** of two different arrays, so it says Different. No error appears. Use `strcmp(a, b) == 0`.',
            right: prog(String.raw`    char a[20], b[20];
    cin >> a >> b;
    if (strcmp(a, b) == 0) {
        cout << "Same" << endl;
    } else {
        cout << "Different" << endl;
    }`, IO_STR),
          },
          {
            logic: true,
            stdin: 'Mama Rose',
            wrong: prog(String.raw`    char name[40];
    cin >> name;
    cout << "Receipt for " << name << endl;`, IO_STR),
            why: '`cin >>` stops at the first space, so only “Mama” was read. The program prints `Receipt for Mama`. To read a whole line use `cin.getline(name, 40);`.',
            right: prog(String.raw`    char name[40];
    cin.getline(name, 40);
    cout << "Receipt for " << name << endl;`, IO_STR),
          },
          {
            logic: true,
            stdin: '5\nMama Rose',
            wrong: prog(String.raw`    int qty;
    char name[40];
    cin >> qty;
    cin.getline(name, 40);
    cout << qty << " for [" << name << "]" << endl;`, IO_STR),
            why: 'After `cin >> qty` the Enter key you pressed is still waiting in the input. `cin.getline` reads that leftover empty line and stops, so the name is empty: `5 for []`. The safest fix is to read the **name first**, then the number. (Real C++ programs often write `cin.ignore();` between them, but this app cannot run that.)',
            right: prog(String.raw`    int qty;
    char name[40];
    cin.getline(name, 40);
    cin >> qty;
    cout << qty << " for [" << name << "]" << endl;`, IO_STR),
          },
          {
            wrong: prog(String.raw`    char first = "K";
    cout << first << endl;`, IO_STR),
            why: 'A single character is written with **single** quotes: `\'K\'`. Double quotes make a whole text (with its knot at the end), which cannot be stored in one `char` box.',
            right: prog(String.raw`    char first = 'K';
    cout << first << endl;`, IO_STR),
          },
        ],
      },
      { t: 'quiz', question: 'Which function compares two texts?', options: ['strcmp', 'strlen', 'strcat', 'strcpy'], answer: 0, explain: '`strcmp(a, b)` returns 0 when the texts are equal. `strlen` measures, `strcat` joins and `strcpy` copies.' },
      { t: 'quiz', question: 'How many boxes does `char word[] = "rolex";` use?', options: ['6', '5', '7', '1'], answer: 0, explain: 'Five letters plus the knot (`\'\\0\'`) make six boxes. `strlen(word)` is 5 but `sizeof(word)` is 6.' },
      {
        t: 'recap',
        items: [
          'Text is an array of `char`, ended by a hidden knot, the null character `\'\\0\'`.',
          '`cin >> name` reads one word. `cin.getline(name, size)` reads a whole line.',
          'Walk along text with `for (int i = 0; s[i] != \'\\0\'; i++)`.',
          '`<cstring>`: `strlen`, `strcpy`, `strcat`, `strcmp`. `<cctype>`: `isalpha`, `isdigit`, `toupper`, `tolower`.',
          'Compare texts with `strcmp(a, b) == 0`, never with `==`. A single letter uses single quotes.',
        ],
        memory: 'Beads on a string, with a knot.',
      },
    ],
    exercises: [
      {
        id: 'cpp17-vowels',
        title: 'Count the vowels',
        prompt: 'Read **one word** (letters only, no spaces) and print how many vowels (`a e i o u`, small **or capital**) it contains, like this: `Vowels: 5` (for `education`).',
        starter: prog('    // Read a word into a char array and count its vowels\n', IO_STR),
        tests: [
          { input: 'education', expected: 'Vowels: 5' },
          { input: 'rhythm', expected: 'Vowels: 0' },
          { input: 'AEIOU', expected: 'Vowels: 5', hidden: true },
          { input: 'Kampala', expected: 'Vowels: 3', hidden: true },
        ],
        hints: [
          'Declare `char w[30];` and read it with `cin >> w;`. Then loop `for (int i = 0; w[i] != \'\\0\'; i++)`.',
          'To handle capital letters too, first make the letter small: `char c = tolower(w[i]);` and then compare `c` with the five vowels.',
          'Keep a counter, add 1 when `c == \'a\' || c == \'e\' || ...`, and print it after the loop.',
        ],
      },
      {
        id: 'cpp17-upper',
        title: 'Shout it',
        prompt: 'Read a **whole line** of text and print it in **capital letters**. Letters change, and spaces, digits and punctuation stay the same. For `Mama Rose` print: `MAMA ROSE`.\n\n(Remember: in this app you cannot change a text that `cin` filled, so print each letter as you go.)',
        starter: prog('    // Read a line with cin.getline and print it in capitals\n', IO_STR),
        tests: [
          { input: 'Mama Rose', expected: 'MAMA ROSE' },
          { input: 'karibu 2026!', expected: 'KARIBU 2026!' },
          { input: 'ALREADY CAPS', expected: 'ALREADY CAPS', hidden: true },
          { input: 'a', expected: 'A', hidden: true },
        ],
        hints: [
          'Read the line with `cin.getline(s, 100);` into `char s[100];`.',
          'Loop along the letters until `\'\\0\'`. For each letter print `(char)toupper(s[i])`. The `(char)` makes it print as a letter, not as a number.',
          'Print `endl` once, **after** the loop.',
        ],
      },
      {
        id: 'cpp17-palindrome',
        title: 'Reads the same both ways',
        prompt: 'A **palindrome** reads the same forwards and backwards, like `level` or `abba`. Read one word (small letters) and print `Palindrome` or `Not palindrome`.',
        starter: prog('    // Read a word and decide if it is a palindrome\n', IO_STR),
        tests: [
          { input: 'level', expected: 'Palindrome' },
          { input: 'rolex', expected: 'Not palindrome' },
          { input: 'a', expected: 'Palindrome', hidden: true },
          { input: 'abba', expected: 'Palindrome', hidden: true },
          { input: 'abca', expected: 'Not palindrome', hidden: true },
        ],
        hints: [
          'Find the length with `strlen(w)`. Compare the first letter with the last, the second with the second-last, and so on.',
          'Loop `for (int i = 0; i < n / 2; i++)`. The partner of letter `i` is `w[n - 1 - i]`. If they differ, the word is not a palindrome.',
          'Use a variable such as `bool same = true;` and set it to `false` when you find a pair that does not match. Print the answer after the loop.',
        ],
      },
      {
        id: 'cpp17-login',
        title: 'The login check',
        prompt: 'Mama Rose’s till has a secret login. The username is `rose` and the password is `karibu`. Read two words (the username, then the password). Print `Welcome` when **both** are correct, otherwise `Access denied`. Capital letters count as different.',
        starter: prog('    // Read username and password, compare with strcmp\n', IO_STR),
        tests: [
          { input: 'rose karibu', expected: 'Welcome' },
          { input: 'rose Karibu', expected: 'Access denied' },
          { input: 'peter karibu', expected: 'Access denied', hidden: true },
          { input: 'peter wrong', expected: 'Access denied', hidden: true },
        ],
        hints: [
          'Declare two arrays, for example `char user[20], pass[20];`, and read them with `cin >> user >> pass;`.',
          'Compare each with `strcmp(user, "rose") == 0` and `strcmp(pass, "karibu") == 0`.',
          'Join the two checks with `&&`, because **both** must be right.',
        ],
      },
    ],
  },
];
