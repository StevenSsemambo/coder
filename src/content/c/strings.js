// C, Level 4: Arrays and strings, part 2. Lessons 20 to 22 (strings, string.h and ctype.h, the class marks project).
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog, inc } from './shared.js';

const LEVEL = 'Level 4: Arrays and strings';

/** A whole program with functions above main (see functions.js). */
const fn = (fns, body, incl = '#include <stdio.h>') => `${incl}\n\n${fns ? fns + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

const STR = inc('stdio', 'string');
const CTYPE = inc('stdio', 'ctype');
const BOTH = inc('stdio', 'string', 'ctype');

/** One line of the marks table (matches printf("%-8s %4d %c\n")). */
const row = (name, mark, grade) => `${name.padEnd(8)} ${String(mark).padStart(4)} ${grade}`;

export const stringLessons = [
  // ================================================================== 20
  {
    id: 'c-strings',
    level: LEVEL,
    minutes: 28,
    title: 'Strings: text as an array of characters',
    summary: 'Characters, the terminating zero, reading words, and looping over text',
    blocks: [
      {
        t: 'story',
        title: 'The name on the receipt',
        text: 'When the duuka prints “Receipt for Amina”, that name is stored in the computer as a row of single letters: A, m, i, n, a. A word is just a **row of characters**.\n\nYou have just learned that a row of boxes is an array. So C has no special “text” type at all: a **string** is simply an array of `char`, with one extra secret at the end.',
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    char name[10] = "Amina";
    printf("Name: %s\n", name);
    printf("First letter: %c\n", name[0]);
    printf("Third letter: %c\n", name[2]);
    return 0;
}
`,
        output: 'Name: Amina\nFirst letter: A\nThird letter: i',
      },
      {
        t: 'list',
        items: [
          'A single character uses **single quotes**: `\'A\'`. Text uses **double quotes**: `"Amina"`.',
          '`%c` prints one character. `%s` prints a whole string.',
          'You can read and change one letter like any array box: `name[0] = \'E\';`.',
          'A string must have room for **one extra box** at the end. That box holds the special character `\'\\0\'` (a zero) which means “the text ends here”.',
        ],
      },
      { t: 'analogy', text: 'Think of beads on a string. Each bead is a letter, and the very last bead is a special **black bead** (`\'\\0\'`). The computer prints beads one by one until it meets the black bead, and then it stops. “Amina” is 5 letters, so it needs 6 boxes: five letters and the black bead.' },
      { t: 'h', text: 'Walking along a string' },
      { t: 'p', text: 'Because the text ends with `\'\\0\'`, you can find its length yourself: count the characters until you meet the black bead.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    char s[20] = "Entebbe";
    int i = 0;
    while (s[i] != '\0') {
        i++;
    }
    printf("Length: %d\n", i);
    return 0;
}
`,
        output: 'Length: 7',
      },
      {
        t: 'predict',
        code: prog(String.raw`    char word[10] = "Jinja";
    int i = 0, count = 0;
    while (word[i] != '\0') {
        if (word[i] == 'j') {
            count++;
        }
        i++;
    }
    printf("%d\n", count);`),
        question: 'How many times does the program count the letter j in “Jinja”?',
        options: ['1', '2', '0', '5'],
        answer: 0,
        explain: 'The word is J-i-n-j-a. Capital `\'J\'` is a different character from small `\'j\'`, so only the 4th letter matches. C is case sensitive even for letters inside text.',
      },
      { t: 'h', text: 'Reading words' },
      { t: 'p', text: '`scanf("%s", name)` reads one **word**: it stops at the first space. Notice that there is **no `&`** in front of `name`, because an array name already means “where the boxes are”.' },
      {
        t: 'try',
        stdin: 'Amina',
        code: String.raw`#include <stdio.h>

int main() {
    char name[30];
    printf("Your name? ");
    scanf("%s", name);
    printf("Hello, %s!\n", name);
    return 0;
}
`,
        output: 'Your name? Hello, Amina!',
      },
      { t: 'tip', text: 'To read a whole line with spaces, such as “Mama Rose”, this runner supports `gets(name);`. Real compilers have removed `gets` because it is unsafe (it cannot stop a long input from overflowing the array), and the safe replacement is `fgets`, which this runner does not have. Use `gets` only for practice here.' },
      { t: 'h', text: 'Letters are numbers' },
      { t: 'p', text: 'A `char` is really a small number: its ASCII code (lesson 4). So you can compare letters with `<=`, add to them, and subtract. The small letters `\'a\'` to `\'z\'` sit **32 above** the capitals `\'A\'` to `\'Z\'`. That lets you turn text into capitals yourself.' },
      {
        t: 'try',
        stdin: 'uganda',
        code: String.raw`#include <stdio.h>

int main() {
    char s[30];
    int i = 0;
    scanf("%s", s);
    while (s[i] != '\0') {
        if (s[i] >= 'a' && s[i] <= 'z') {
            s[i] = s[i] - 32;
        }
        i++;
    }
    printf("%s\n", s);
    return 0;
}
`,
        output: 'UGANDA',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the character that marks the end of a string.',
        template: prog(String.raw`    char s[10] = "Jinja";
    int i = 0;
    while (s[i] != ___) {
        i++;
    }
    printf("%d\n", i);`),
        blanks: [{ options: ["'\\0'", "'0'", "' '"], answer: "'\\0'" }],
        output: '5',
      },
      {
        t: 'bug',
        code: prog(String.raw`    char word[10] = 'Jinja';
    printf("%s\n", word);`),
        question: 'This program refuses to run (“Parsing Failure”). What is wrong?',
        options: ['Text must be in double quotes. Single quotes are only for one character', 'The array is too small', 'printf cannot print text', 'word must be an int array'],
        answer: 0,
        explain: 'Single quotes mean **one character** like `\'J\'`. A whole word needs double quotes: `"Jinja"`.',
        fixed: prog(String.raw`    char word[10] = "Jinja";
    printf("%s\n", word);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    char a[10] = "hi";
    char b[10] = "hi";
    if (a == b) {
        printf("same\n");
    } else {
        printf("different\n");
    }`),
            why: '`a == b` does not compare the letters. It asks whether the two arrays are the **same boxes in memory**, which they never are, so it says “different” for identical text. To compare text you need `strcmp` (next lesson).',
            right: prog(String.raw`    char a[10] = "hi";
    char b[10] = "hi";
    int i = 0, same = 1;
    while (a[i] != '\0' || b[i] != '\0') {
        if (a[i] != b[i]) {
            same = 0;
        }
        i++;
    }
    if (same == 1) {
        printf("same\n");
    } else {
        printf("different\n");
    }`),
          },
          {
            logic: true,
            stdin: 'Mama Rose',
            wrong: prog(String.raw`    char name[30];
    scanf("%s", name);
    printf("Hello, %s!\n", name);`),
            why: '`%s` stops at the first space, so the program only sees “Mama”. For a full name either read two words with two `%s`, or use `gets` for the whole line.',
            right: prog(String.raw`    char first[30], last[30];
    scanf("%s %s", first, last);
    printf("Hello, %s %s!\n", first, last);`),
          },
          {
            wrong: prog(String.raw`    char s[3] = {'a', 'b', 'c'};
    int i = 0;
    while (s[i] != '\0') {
        i++;
    }
    printf("%d\n", i);`),
            why: 'There is no black bead: the three boxes hold only `a`, `b` and `c`, so the loop keeps going past the end of the array. Always leave room for `\'\\0\'`: this array should have 4 boxes, or be written as `"abc"`.',
            right: prog(String.raw`    char s[4] = "abc";
    int i = 0;
    while (s[i] != '\0') {
        i++;
    }
    printf("%d\n", i);`),
          },
        ],
      },
      { t: 'quiz', question: 'How many boxes does the string `"Kampala"` need?', options: ['8', '7', '6', '9'], answer: 0, explain: 'Seven letters plus one box for the ending `\'\\0\'`: 8 boxes.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 15): a banner for any shop name',
        text: 'The program reads a shop name, prints it in capitals, and draws a line of equal signs exactly as long as the name.',
        stdin: 'Duuka',
        code: String.raw`#include <stdio.h>

int main() {
    char name[30];
    int i = 0, length;
    scanf("%s", name);
    while (name[i] != '\0') {
        if (name[i] >= 'a' && name[i] <= 'z') {
            name[i] = name[i] - 32;
        }
        i++;
    }
    length = i;
    printf("%s\n", name);
    for (i = 0; i < length; i++) {
        printf("=");
    }
    printf("\n");
    return 0;
}
`,
        output: 'DUUKA\n=====',
      },
      {
        t: 'recap',
        items: ['A string is a `char` array that ends with `\'\\0\'`: always allow one extra box.', 'Single quotes are for one `char`, double quotes for text. `%c` prints a char, `%s` a string.', '`scanf("%s", name)` reads one word and has no `&`. Loop `while (s[i] != \'\\0\')` to walk along the text.', 'You cannot compare strings with `==`. Letters are numbers: small letters are 32 above capitals.'],
        memory: 'Letters in a row, ending with a black bead.',
      },
    ],
    exercises: [
      {
        id: 'c20-length',
        title: 'Count the letters',
        prompt: 'Read one word and print how many characters it has, like `Length: 7`. Do not use any library function: count with a loop.',
        starter: prog('    char s[50];\n    int i = 0;\n    // Read a word and count its characters\n'),
        sampleInput: 'Entebbe',
        usesInput: true,
        tests: [
          { input: 'Entebbe', expected: 'Length: 7' },
          { input: 'a', expected: 'Length: 1' },
          { input: 'Mukono', expected: 'Length: 6', hidden: true },
        ],
        hints: [
          'Read the word with `scanf("%s", s);` (no `&`). Then count until you meet `\'\\0\'`.',
          '`while (s[i] != \'\\0\') { i++; }` leaves `i` equal to the length. Print `i`.',
          'A similar example: the “Entebbe” program in this lesson counts exactly like this, but with a fixed word.',
        ],
      },
      {
        id: 'c20-vowels',
        title: 'Count the vowels',
        prompt: 'Read one word and print how many vowels it has (a, e, i, o, u, in small **or** capital letters), like `Vowels: 3`.',
        starter: prog('    char s[50];\n    int i = 0, count = 0;\n    // Read a word and count its vowels\n'),
        sampleInput: 'Kampala',
        usesInput: true,
        tests: [
          { input: 'Kampala', expected: 'Vowels: 3' },
          { input: 'rhythm', expected: 'Vowels: 0' },
          { input: 'Education', expected: 'Vowels: 5' },
          { input: 'AEIOU', expected: 'Vowels: 5', hidden: true },
        ],
        hints: [
          'Walk along the word and, for each letter, check whether it is one of the vowels.',
          'Use `||` to join the checks: `if (c == \'a\' || c == \'e\' || ...)`. Remember the capitals too, or turn the letter into small letters first.',
          'A similar example: the Jinja program counted the letter j. You count five different letters instead.',
        ],
      },
      {
        id: 'c20-reverse',
        title: 'Write it backwards',
        prompt: 'Read one word and print it **backwards**, like `ajniJ` for `Jinja`. Print the letters one by one.',
        starter: prog('    char s[50];\n    int i, length = 0;\n    // Read a word, find its length, then print it backwards\n'),
        sampleInput: 'Jinja',
        usesInput: true,
        tests: [
          { input: 'Jinja', expected: 'ajniJ' },
          { input: 'a', expected: 'a' },
          { input: 'level', expected: 'level' },
          { input: 'Mbale', expected: 'elabM', hidden: true },
        ],
        hints: [
          'First find the length (count until `\'\\0\'`). Then loop from the last letter down to the first.',
          'The last letter is at index `length - 1`. `for (i = length - 1; i >= 0; i--) { printf("%c", s[i]); }`, then print a new line.',
          'A similar example: lesson 16 printed an array backwards with a countdown loop. A string is just a char array.',
        ],
      },
    ],
  },

  // ================================================================== 21
  {
    id: 'c-stringlib',
    level: LEVEL,
    minutes: 26,
    title: 'string.h and ctype.h: ready-made text tools',
    summary: 'strlen, strcpy, strcat, strcmp, and the character functions toupper, isdigit and friends',
    blocks: [
      {
        t: 'story',
        title: 'The Wi-Fi portal',
        text: 'The campus Wi-Fi asks for a username and a PIN. The computer has to check “is what you typed **exactly the same** as the saved text?” That question is so common that C ships a ready-made tool for it. Two toolboxes hold the tools for text: `string.h` (for whole strings) and `ctype.h` (for single characters).',
      },
      { t: 'h', text: 'string.h: tools for whole strings' },
      {
        t: 'list',
        items: [
          '`strlen(s)` gives the **length** of the text (without the ending zero).',
          '`strcpy(to, from)` **copies** text into a box that is big enough.',
          '`strcat(to, more)` **adds** more text onto the end.',
          '`strcmp(a, b)` **compares** two strings: it gives **0 when they are equal**, a negative number when `a` comes first in the dictionary, and a positive number when `a` comes later.',
        ],
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>
#include <string.h>

int main() {
    char full[30];
    strcpy(full, "Mama");
    strcat(full, " Rose");
    printf("%s has %d letters\n", full, (int)strlen(full));
    return 0;
}
`,
        output: 'Mama Rose has 9 letters',
      },
      { t: 'tip', text: '`strcpy` and `strcat` do not check the size of the destination. Always make the destination array **bigger** than the biggest text you will put into it, or you overwrite other things in memory. Real programs have been hacked this way.' },
      { t: 'h', text: 'Comparing text with strcmp' },
      {
        t: 'try',
        stdin: 'admin 1234',
        code: String.raw`#include <stdio.h>
#include <string.h>

int main() {
    char user[30], pin[30];
    scanf("%s %s", user, pin);
    if (strcmp(user, "admin") == 0 && strcmp(pin, "1234") == 0) {
        printf("Welcome\n");
    } else {
        printf("Access denied\n");
    }
    return 0;
}
`,
        output: 'Welcome',
      },
      {
        t: 'predict',
        code: prog(String.raw`    char a[20] = "apple";
    char b[20] = "banana";
    printf("%d\n", strcmp(a, b) < 0);`, STR),
        question: 'In the dictionary “apple” comes before “banana”. What does this program print?',
        options: ['1', '0', '-1', '5'],
        answer: 0,
        explain: '`strcmp(a, b)` is negative because `a` comes first. The comparison `< 0` is then true, and true prints as 1. Only the **sign** of the answer matters, so always compare it with 0 and never with 1 or -1.',
      },
      { t: 'h', text: 'ctype.h: tools for single characters' },
      {
        t: 'list',
        items: ['`toupper(c)` and `tolower(c)` give the capital or small version of a letter.', '`isdigit(c)` is true for `0` to `9`, `isalpha(c)` for letters, `isupper(c)` and `islower(c)` for capitals and small letters, `isspace(c)` for spaces.', 'They **return** the answer. `toupper(c);` on its own does not change `c`: store the result with `c = toupper(c);`.'],
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>
#include <ctype.h>

int main() {
    char s[20] = "Room12B";
    int i, digits = 0, letters = 0;
    for (i = 0; s[i] != '\0'; i++) {
        if (isdigit(s[i])) {
            digits++;
        } else if (isalpha(s[i])) {
            letters++;
        }
    }
    printf("Digits: %d, letters: %d\n", digits, letters);
    return 0;
}
`,
        output: 'Digits: 2, letters: 5',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that turns a small letter into a capital.',
        template: prog(String.raw`    char c = 'a';
    printf("%c\n", ___(c));`, CTYPE),
        blanks: [{ options: ['toupper', 'tolower', 'isupper'], answer: 'toupper' }],
        output: 'A',
      },
      {
        t: 'bug',
        code: prog(String.raw`    char s[10] = "Mbarara";
    printf("%d\n", strlen(s));`),
        question: 'This program stops because the computer does not know `strlen`. What is missing?',
        options: ['`#include <string.h>` at the top', '`#include <math.h>` at the top', 'A semicolon after strlen', 'The array must be bigger'],
        answer: 0,
        explain: 'Every tool lives in a toolbox (header). `strlen` is in `string.h`, so you must include it, just as `printf` needs `stdio.h`.',
        fixed: prog(String.raw`    char s[10] = "Mbarara";
    printf("%d\n", (int)strlen(s));`, STR),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    char a[20] = "Kato";
    char b[20] = "Rose";
    if (strcmp(a, b)) {
        printf("same\n");
    } else {
        printf("different\n");
    }`, STR),
            why: '`strcmp` gives **0 when the strings are equal**, and 0 counts as false. So `if (strcmp(a, b))` is true when they are **different**: the opposite of what you meant. Always write `strcmp(a, b) == 0` for “equal”.',
            right: prog(String.raw`    char a[20] = "Kato";
    char b[20] = "Rose";
    if (strcmp(a, b) == 0) {
        printf("same\n");
    } else {
        printf("different\n");
    }`, STR),
          },
          {
            logic: true,
            wrong: prog(String.raw`    char c = 'a';
    toupper(c);
    printf("%c\n", c);`, CTYPE),
            why: '`toupper` returns the capital letter but does not change `c`, so `c` is still `\'a\'`. Catch the answer: `c = toupper(c);`.',
            right: prog(String.raw`    char c = 'a';
    c = toupper(c);
    printf("%c\n", c);`, CTYPE),
          },
          {
            logic: true,
            wrong: prog(String.raw`    char a[20] = "admin";
    char b[20] = "Admin";
    if (strcmp(a, b) == 0) {
        printf("same\n");
    } else {
        printf("different\n");
    }`, STR),
            why: 'This is not an error, but a surprise: `strcmp` is **case sensitive**, so “admin” and “Admin” are different and this prints different. To ignore case, convert both to small letters first with `tolower`.',
            right: prog(String.raw`    char a[20] = "admin";
    char b[20] = "Admin";
    int i;
    for (i = 0; b[i] != '\0'; i++) {
        b[i] = tolower(b[i]);
    }
    if (strcmp(a, b) == 0) {
        printf("same\n");
    } else {
        printf("different\n");
    }`, BOTH),
          },
        ],
      },
      { t: 'quiz', question: 'What does `strcmp("Uganda", "Uganda")` return?', options: ['0', '1', '-1', '6'], answer: 0, explain: 'Equal strings give 0. That is the one value to test for: `strcmp(a, b) == 0`.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 16): the customer’s receipt line',
        text: 'The customer’s name is typed in small letters. The receipt makes the first letter a capital and builds the line using `strcpy` and `strcat`.',
        stdin: 'amina',
        code: String.raw`#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char name[30], line[60];
    scanf("%s", name);
    name[0] = toupper(name[0]);
    strcpy(line, "Receipt for ");
    strcat(line, name);
    printf("%s\n", line);
    printf("Line length: %d\n", (int)strlen(line));
    return 0;
}
`,
        output: 'Receipt for Amina\nLine length: 17',
      },
      {
        t: 'recap',
        items: ['`#include <string.h>` for `strlen`, `strcpy`, `strcat` and `strcmp`. `#include <ctype.h>` for `toupper`, `isdigit` and friends.', '`strcmp(a, b) == 0` means equal. Never use `==` on strings.', 'The destination of `strcpy` and `strcat` must be big enough.', 'Character functions give back a result: store it (`c = toupper(c);`).'],
        memory: 'Zero means the same.',
      },
    ],
    exercises: [
      {
        id: 'c21-login',
        title: 'The login check',
        prompt: 'Read a username and a PIN (two words). The right login is the username `admin` and the PIN `1234`. Print `Welcome` if both are right, otherwise `Access denied`.',
        starter: prog('    char user[30], pin[30];\n    // Read the two words and check them\n', STR),
        sampleInput: 'admin 1234',
        usesInput: true,
        tests: [
          { input: 'admin 1234', expected: 'Welcome' },
          { input: 'admin 0000', expected: 'Access denied' },
          { input: 'kato 1234', expected: 'Access denied' },
          { input: 'Admin 1234', expected: 'Access denied', name: 'Case matters', hidden: true },
        ],
        hints: [
          'Compare each word with `strcmp`. Remember what number `strcmp` gives when the words are equal.',
          'Use `&&` so that both checks must succeed: `strcmp(user, "admin") == 0 && strcmp(pin, "1234") == 0`.',
          'A similar example: the login program in this lesson. Your task is to write it yourself without looking.',
        ],
      },
      {
        id: 'c21-upper',
        title: 'Shout it',
        prompt: 'Read one word and print it in **capital letters**. Use `toupper`.',
        starter: prog('    char s[50];\n    int i;\n    // Read a word and print it in capitals\n', CTYPE),
        sampleInput: 'Kampala',
        usesInput: true,
        tests: [
          { input: 'Kampala', expected: 'KAMPALA' },
          { input: 'ABC', expected: 'ABC' },
          { input: 'jinja2', expected: 'JINJA2', hidden: true },
        ],
        hints: [
          'Walk along the word with a loop and change each letter.',
          'Inside the loop: `s[i] = toupper(s[i]);`. Print the whole word with `%s` after the loop.',
          'A similar example: this lesson’s `Room12B` program loops over a string with `for (i = 0; s[i] != \'\\0\'; i++)`.',
        ],
      },
      {
        id: 'c21-palindrome',
        title: 'Palindrome checker',
        prompt: 'A palindrome reads the same forwards and backwards (like `level`). Read one word and print `Palindrome` or `Not palindrome`.',
        starter: prog('    char s[50];\n    int i, n;\n    // Read a word, then compare its letters from both ends\n', STR),
        sampleInput: 'level',
        usesInput: true,
        tests: [
          { input: 'level', expected: 'Palindrome' },
          { input: 'Jinja', expected: 'Not palindrome' },
          { input: 'a', expected: 'Palindrome' },
          { input: 'abba', expected: 'Palindrome', hidden: true },
          { input: 'abca', expected: 'Not palindrome', hidden: true },
        ],
        hints: [
          'Compare the first letter with the last, the second with the second last, and so on, for half of the word.',
          'With `n = strlen(s)`, the partner of `s[i]` is `s[n - 1 - i]`. If any pair is different, it is not a palindrome.',
          'A similar example: a `found` flag like the one in the search program of lesson 17. Start with `ok = 1` and set it to 0 on the first mismatch.',
        ],
      },
    ],
  },

  // ================================================================== 22
  {
    id: 'c-marks',
    level: LEVEL,
    minutes: 34,
    title: 'Project: the class marks processor',
    summary: 'Combine arrays, strings, functions and loops to process a whole class’s marks',
    blocks: [
      {
        t: 'story',
        title: 'End of term at the department',
        text: 'It is the end of term. The lecturer has a list of students and their marks, and the head of department wants a report: every student’s grade, the class average, who scored highest and how many passed.\n\nBy hand this takes an afternoon and invites mistakes. You now know every tool needed to write a program that does it in a blink. This project joins them together.',
      },
      { t: 'h', text: 'Plan' },
      {
        t: 'list',
        items: [
          'Store the names in a table of text (`char names[10][20]`) and the marks in an array (`int marks[10]`). Student number `i` is `names[i]` and `marks[i]`.',
          'A function `grade(mark)` returns the letter: A for 80 or more, B 70, C 60, D 50, otherwise F.',
          'A loop reads the students, a second loop prints the table.',
          'Then compute the average, the highest mark (and whose it is) and the number of passes (50 or more).',
        ],
      },
      {
        t: 'project',
        title: 'Piece 1: the report table',
        text: 'The input is how many students, then a name and a mark for each: `4 Amina 82 Kato 45 Rose 67 Joel 91`.',
        stdin: '4 Amina 82 Kato 45 Rose 67 Joel 91',
        code: String.raw`#include <stdio.h>

char grade(int mark) {
    if (mark >= 80) {
        return 'A';
    }
    if (mark >= 70) {
        return 'B';
    }
    if (mark >= 60) {
        return 'C';
    }
    if (mark >= 50) {
        return 'D';
    }
    return 'F';
}

int main() {
    char names[10][20];
    int marks[10];
    int n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
    }
    printf("%-8s %4s %s\n", "Name", "Mark", "Grade");
    for (i = 0; i < n; i++) {
        printf("%-8s %4d %c\n", names[i], marks[i], grade(marks[i]));
    }
    return 0;
}
`,
        output: [`${'Name'.padEnd(8)} ${'Mark'.padStart(4)} Grade`, row('Amina', 82, 'A'), row('Kato', 45, 'F'), row('Rose', 67, 'C'), row('Joel', 91, 'A')].join('\n'),
      },
      { t: 'p', text: 'Now add the summary. While the program loops it keeps the total, the index of the best student and the number of passes. Notice that `best` stores a **position** (an index) so that it can print both the name and the mark.' },
      {
        t: 'project',
        title: 'The finished marks processor',
        text: 'Run it, then change the input: add a student, or change a mark to 50 to test the pass boundary.',
        stdin: '4 Amina 82 Kato 45 Rose 67 Joel 91',
        code: String.raw`#include <stdio.h>

char grade(int mark) {
    if (mark >= 80) {
        return 'A';
    }
    if (mark >= 70) {
        return 'B';
    }
    if (mark >= 60) {
        return 'C';
    }
    if (mark >= 50) {
        return 'D';
    }
    return 'F';
}

int main() {
    char names[10][20];
    int marks[10];
    int n, i, total = 0, best = 0, passed = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
    }
    printf("%-8s %4s %s\n", "Name", "Mark", "Grade");
    for (i = 0; i < n; i++) {
        printf("%-8s %4d %c\n", names[i], marks[i], grade(marks[i]));
        total = total + marks[i];
        if (marks[i] > marks[best]) {
            best = i;
        }
        if (marks[i] >= 50) {
            passed++;
        }
    }
    printf("Average: %.2f\n", total / (float)n);
    printf("Highest: %s (%d)\n", names[best], marks[best]);
    printf("Passed: %d\n", passed);
    return 0;
}
`,
        output: [`${'Name'.padEnd(8)} ${'Mark'.padStart(4)} Grade`, row('Amina', 82, 'A'), row('Kato', 45, 'F'), row('Rose', 67, 'C'), row('Joel', 91, 'A'), 'Average: 71.25', 'Highest: Joel (91)', 'Passed: 3'].join('\n'),
      },
      {
        t: 'predict',
        stdin: '3 Ann 70 Ben 70 Cy 50',
        code: String.raw`#include <stdio.h>

int main() {
    char names[10][20];
    int marks[10];
    int n, i, best = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
    }
    for (i = 0; i < n; i++) {
        if (marks[i] > marks[best]) {
            best = i;
        }
    }
    printf("%s\n", names[best]);
    return 0;
}
`,
        question: 'Ann and Ben both have 70, the highest mark. Which name does the program print?',
        options: ['Ann', 'Ben', 'Cy', 'Ann\nBen'],
        answer: 0,
        explain: 'The test is `marks[i] > marks[best]`, which is strictly bigger. Ben’s 70 is not bigger than Ann’s 70, so `best` stays on Ann, the first student with the top mark. Using `>=` would pick the last one instead.',
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            stdin: '2 Kato 40 Amina 90',
            wrong: String.raw`#include <stdio.h>

int main() {
    char names[10][20];
    int marks[10];
    int n, i, highest = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
        if (marks[i] > highest) {
            highest = marks[i];
        }
    }
    printf("%s %d\n", names[0], highest);
    return 0;
}
`,
            why: 'Keeping only the highest **mark** loses track of whose it is, so the program guesses `names[0]` and prints “Kato 90”, although Amina scored 90. Store the **index** of the best student instead: `best = i;`. Then both `names[best]` and `marks[best]` are right.',
            right: String.raw`#include <stdio.h>

int main() {
    char names[10][20];
    int marks[10];
    int n, i, best = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
        if (marks[i] > marks[best]) {
            best = i;
        }
    }
    printf("%s %d\n", names[best], marks[best]);
    return 0;
}
`,
          },
          {
            logic: true,
            stdin: '2 Amina 90 Kato 40',
            wrong: String.raw`#include <stdio.h>

int main() {
    int marks[10];
    char names[10][20];
    int n, i, total = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
        total = total + marks[i];
    }
    printf("Average: %.2f\n", total / n);
    return 0;
}
`,
            why: '`total / n` divides two integers, so the .5 is lost: 130 / 2 is 65 only by luck, but 131 / 2 would print 65.00 instead of 65.50. Make one side a decimal: `total / (float)n`.',
            right: String.raw`#include <stdio.h>

int main() {
    int marks[10];
    char names[10][20];
    int n, i, total = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d", names[i], &marks[i]);
        total = total + marks[i];
    }
    printf("Average: %.2f\n", total / (float)n);
    return 0;
}
`,
          },
        ],
      },
      { t: 'quiz', question: 'In this project, why does `best` store an index instead of the highest mark itself?', options: ['With the index you can look up both `names[best]` and `marks[best]`', 'Because marks cannot be compared', 'Because C cannot store a mark in a variable', 'To make the loop shorter'], answer: 0, explain: 'The names and marks are two parallel arrays, linked by the same index. The index is the key that finds the name and the mark of the same student.' },
      {
        t: 'recap',
        items: ['Parallel arrays: `names[i]` and `marks[i]` describe the same student.', 'A table of text is `char names[rows][length]`; read each name with `scanf("%s", names[i])`.', 'Keep running figures (total, passes, best index) while one loop goes through the data.', 'Compare with `>` to keep the **first** best, with `>=` to keep the **last**.'],
        memory: 'One loop, many answers.',
      },
    ],
    exercises: [
      {
        id: 'c22-stats',
        title: 'Class statistics',
        prompt: 'The first number is how many marks follow. Read them and print four lines:\n\n`Highest: 91`\n`Lowest: 45`\n`Average: 71.25`\n`Passed: 3`\n\nA mark of 50 or more is a pass. The average has 2 decimals.',
        starter: prog('    int marks[50];\n    int n, i, total = 0, passed = 0;\n    // Read the marks, then print the four lines\n'),
        sampleInput: '4 82 45 67 91',
        usesInput: true,
        tests: [
          { input: '4 82 45 67 91', expected: 'Highest: 91\nLowest: 45\nAverage: 71.25\nPassed: 3' },
          { input: '3 50 60 70', expected: 'Highest: 70\nLowest: 50\nAverage: 60.00\nPassed: 3' },
          { input: '1 40', expected: 'Highest: 40\nLowest: 40\nAverage: 40.00\nPassed: 0', hidden: true },
          { input: '2 49 50', expected: 'Highest: 50\nLowest: 49\nAverage: 49.50\nPassed: 1', name: 'Pass boundary', hidden: true },
        ],
        hints: [
          'One loop can do everything: read each mark, add it to `total`, update the highest and the lowest, and count the passes.',
          'Start `highest` and `lowest` with the first mark, then compare the rest. Print the average with `total / (float)n` and `%.2f`.',
          'A similar example: the finished marks processor in this lesson computes the same average and pass count.',
        ],
      },
      {
        id: 'c22-grades',
        title: 'How many of each grade?',
        prompt: 'The first number is how many marks follow. Grades: A is 80 or more, B 70 to 79, C 60 to 69, D 50 to 59, F below 50. Print how many students got each grade, in this form:\n\n`A: 2`\n`B: 0`\n`C: 1`\n`D: 0`\n`F: 1`',
        starter: prog('    int n, i, mark;\n    int a = 0, b = 0, c = 0, d = 0, f = 0;\n    // Read the marks, count each grade, print the five lines\n'),
        sampleInput: '4 82 45 67 91',
        usesInput: true,
        tests: [
          { input: '4 82 45 67 91', expected: 'A: 2\nB: 0\nC: 1\nD: 0\nF: 1' },
          { input: '5 80 79 70 60 50', expected: 'A: 1\nB: 2\nC: 1\nD: 1\nF: 0', name: 'Every boundary' },
          { input: '1 10', expected: 'A: 0\nB: 0\nC: 0\nD: 0\nF: 1', hidden: true },
        ],
        hints: [
          'For each mark use an `if` / `else if` chain, like the grade program in lesson 5, but add 1 to a counter instead of printing.',
          'Check from the top: `if (mark >= 80) { a++; } else if (mark >= 70) { b++; } ...`. Print all five counters at the end.',
          'A similar example: `c3-grade` printed a letter for one mark. Here the same chain adds to a counter for every mark.',
        ],
      },
    ],
  },
];
