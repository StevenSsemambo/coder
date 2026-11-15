// C, Level 7: Putting it together. Lessons 30 to 32 (text algorithms, recursion in depth, the stock system capstone).
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog, inc } from './shared.js';

const LEVEL = 'Level 7: Putting it together';

/** A whole program with functions above main. */
const fn = (fns, body, incl = '#include <stdio.h>') => `${incl}\n\n${fns ? fns + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

const STR = inc('stdio', 'string');
const CT = inc('stdio', 'string', 'ctype');

export const level7Lessons = [
  // ================================================================== 30
  {
    id: 'c-text-algos',
    level: LEVEL,
    minutes: 30,
    title: 'Text detective: algorithms on strings',
    summary: 'Counting vowels, reversing, palindromes and a Caesar cipher, using only loops over characters',
    blocks: [
      {
        t: 'story',
        title: 'The secret note',
        text: 'Two friends at campus pass notes in class. To stop the lecturer reading them, they shift every letter three places along the alphabet: `a` becomes `d`, `b` becomes `e`. Julius Caesar did exactly the same to protect his army’s messages, two thousand years ago, and the trick still carries his name.\n\nA string in C is just an array of characters ending in `\\0`, so any question about text becomes a loop over the boxes. In this lesson you answer four classic questions about words.',
      },
      { t: 'h', text: 'Counting: how many vowels?' },
      {
        t: 'try',
        code: prog(String.raw`    char word[20] = "campus";
    int i, vowels = 0;
    for (i = 0; word[i] != '\0'; i++) {
        char c = word[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    printf("Vowels: %d\n", vowels);`),
        output: 'Vowels: 2',
      },
      { t: 'h', text: 'Reversing in place' },
      { t: 'p', text: 'Keep one finger at the front (`i`) and one at the back (`j`). Swap what they point at, then move both fingers towards the middle. Stop when they meet.' },
      {
        t: 'try',
        code: prog(String.raw`    char word[20] = "kampala";
    int i = 0, j = strlen(word) - 1;
    while (i < j) {
        char temp = word[i];
        word[i] = word[j];
        word[j] = temp;
        i++;
        j--;
    }
    printf("%s\n", word);`, STR),
        output: 'alapmak',
      },
      { t: 'h', text: 'Palindromes' },
      { t: 'p', text: 'A **palindrome** reads the same both ways: `level`, `radar`, `mum`. Compare the first character with the last, the second with the second last, and so on. One mismatch is enough to say no.' },
      {
        t: 'try',
        code: prog(String.raw`    char s[20] = "level";
    int i, len = strlen(s), same = 1;
    for (i = 0; i < len / 2; i++) {
        if (s[i] != s[len - 1 - i]) {
            same = 0;
        }
    }
    if (same) {
        printf("Palindrome\n");
    } else {
        printf("Not a palindrome\n");
    }`, STR),
        output: 'Palindrome',
      },
      { t: 'h', text: 'The Caesar cipher' },
      { t: 'p', text: 'Letters are numbers (lesson 4). `c - \'a\'` gives the letter’s place in the alphabet (0 for `a`, 25 for `z`). Add the shift, use `% 26` to wrap round from `z` back to `a`, and add `\'a\'` to get a letter again.' },
      {
        t: 'try',
        code: prog(String.raw`    char word[20] = "xyz";
    int i, shift = 3;
    for (i = 0; word[i] != '\0'; i++) {
        char c = (word[i] - 'a' + shift) % 26 + 'a';
        printf("%c", c);
    }
    printf("\n");`),
        output: 'abc',
      },
      { t: 'analogy', text: 'The alphabet is a clock with 26 hours. Shifting `z` forward by 3 goes past the end and starts again at `a`, exactly as 11 o’clock plus 3 hours is 2 o’clock. The `% 26` is the clock face.' },
      { t: 'tip', text: 'Strings are walked with `word[i] != \'\\0\'` as the loop test. That works for any length and never reads past the end.' },
      {
        t: 'predict',
        code: prog(String.raw`    char word[10] = "ab";
    int i;
    for (i = 0; word[i] != '\0'; i++) {
        printf("%c", (word[i] - 'a' + 1) % 26 + 'a');
    }
    printf("\n");`),
        question: 'What does this program print?',
        options: ['bc', 'ab', 'cd', 'ba'],
        answer: 0,
        explain: 'Each letter moves one place along the alphabet: `a` becomes `b`, `b` becomes `c`.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop notices a **mismatch** between a character and its mirror.',
        template: prog(String.raw`    char s[20] = "level";
    int i, len = strlen(s), same = 1;
    for (i = 0; i < len / 2; i++) {
        if (s[i] ___ s[len - 1 - i]) {
            same = 0;
        }
    }
    if (same) {
        printf("Palindrome\n");
    } else {
        printf("Not a palindrome\n");
    }`, STR),
        blanks: [{ options: ['!=', '==', '<='], answer: '!=' }],
        output: 'Palindrome',
      },
      {
        t: 'bug',
        code: prog(String.raw`    char s[20] = "radar";
    int i, same = 1;
    for (i = 0; i < len / 2; i++) {
        if (s[i] != s[len - 1 - i]) {
            same = 0;
        }
    }
    printf("%d\n", same);`),
        question: 'This program stops with an error about `len`. What is wrong?',
        options: ['`len` was never declared or given a value: use `int len = strlen(s);` (and include string.h)', 'A char array cannot hold five letters', 'The loop must start at 1', 'You cannot compare two characters'],
        answer: 0,
        explain: 'The program uses `len` without ever making it. Declare it with `int len = strlen(s);` and add `#include <string.h>`.',
        fixed: prog(String.raw`    char s[20] = "radar";
    int i, len = strlen(s), same = 1;
    for (i = 0; i < len / 2; i++) {
        if (s[i] != s[len - 1 - i]) {
            same = 0;
        }
    }
    printf("%d\n", same);`, STR),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    char c = 'z';
    printf("%c\n", c + 3);`),
            why: 'Without the `% 26` wrap-round, `z` plus 3 is not `c`: it is the next character in the ASCII table, a curly bracket `}`. Use `(c - \'a\' + 3) % 26 + \'a\'`.',
            right: prog(String.raw`    char c = 'z';
    printf("%c\n", (c - 'a' + 3) % 26 + 'a');`),
          },
          {
            wrong: prog(String.raw`    char c = 'e';
    if (c == a || c == i) {
        printf("vowel\n");
    }`),
            why: 'Without quotes, `a` and `i` are taken to be **variable names**, and no such variables exist. A single character goes in single quotes: `\'a\'`.',
            right: prog(String.raw`    char c = 'e';
    if (c == 'a' || c == 'e') {
        printf("vowel\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    char word[20] = "Uganda";
    int i, vowels = 0;
    for (i = 0; word[i] != '\0'; i++) {
        char c = word[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    printf("%d\n", vowels);`),
            why: 'The capital `U` of “Uganda” is not the letter `u`, so it is not counted: this prints 2, not 3. Convert each letter to lowercase first with `tolower` (from `ctype.h`).',
            right: prog(String.raw`    char word[20] = "Uganda";
    int i, vowels = 0;
    for (i = 0; word[i] != '\0'; i++) {
        char c = tolower(word[i]);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    printf("%d\n", vowels);`, CT),
          },
        ],
      },
      { t: 'quiz', question: 'With a shift of 2, what does `\'a\'` become?', options: ['`c`', '`b`', '`y`', '`d`'], answer: 0, explain: '`a` is place 0. Adding 2 gives place 2, which is `c`.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 23): the secret price code',
        text: 'Nakato writes her wholesale prices in a code so that customers cannot read them. The program reads a lowercase word and prints it shifted by 3. Try `campus`, then `zebra`.',
        stdin: 'campus',
        code: String.raw`#include <stdio.h>

int main() {
    char word[30];
    int i;
    scanf("%s", word);
    for (i = 0; word[i] != '\0'; i++) {
        printf("%c", (word[i] - 'a' + 3) % 26 + 'a');
    }
    printf("\n");
    return 0;
}
`,
        output: 'fdpsxv',
      },
      {
        t: 'recap',
        items: ['Loop over a string with `for (i = 0; s[i] != \'\\0\'; i++)`.', 'Reverse with two fingers (`i` and `j`) that swap and move towards each other.', 'A palindrome: compare `s[i]` with `s[len - 1 - i]`.', 'Caesar: `(c - \'a\' + shift) % 26 + \'a\'`.', 'Use `tolower` before comparing letters when case should not matter.'],
        memory: 'A string is a row of boxes: walk it.',
      },
    ],
    exercises: [
      {
        id: 'c30-vowels',
        title: 'Count the vowels',
        prompt: 'Read one word (letters only, any mix of capitals and small letters) and print how many vowels (a, e, i, o, u) it has, as `Vowels: 3` (for `Uganda`).',
        starter: CT + String.raw`

int main() {
    char word[50];
    int i, vowels = 0;
    scanf("%s", word);
    // count the vowels
    printf("Vowels: %d\n", vowels);
    return 0;
}
`,
        sampleInput: 'Uganda',
        usesInput: true,
        tests: [
          { input: 'Uganda', expected: 'Vowels: 3' },
          { input: 'rhythm', expected: 'Vowels: 0' },
          { input: 'EDUCATION', expected: 'Vowels: 5', hidden: true },
        ],
        hints: [
          'Loop until you reach `\'\\0\'`. Look at each letter in turn.',
          'Make the letter lowercase with `char c = tolower(word[i]);` and then compare with `\'a\'`, `\'e\'`, `\'i\'`, `\'o\'`, `\'u\'` using `||`.',
          'A similar example: the first `try` block in this lesson counts the vowels of one fixed word.',
        ],
      },
      {
        id: 'c30-reverse',
        title: 'Reverse a word',
        prompt: 'Read one word and print it backwards, as `alapmak` (for `kampala`).',
        starter: STR + String.raw`

int main() {
    char word[50];
    scanf("%s", word);
    // reverse the word, then print it
    printf("%s\n", word);
    return 0;
}
`,
        sampleInput: 'kampala',
        usesInput: true,
        tests: [
          { input: 'kampala', expected: 'alapmak' },
          { input: 'a', expected: 'a' },
          { input: 'jinja', expected: 'ajnij', hidden: true },
        ],
        hints: [
          'Use two positions: `i` at the start and `j = strlen(word) - 1` at the end.',
          'While `i < j`, swap `word[i]` and `word[j]` with a spare `char`, then `i++` and `j--`.',
          'A similar example: the reversing `try` block in this lesson.',
        ],
      },
      {
        id: 'c30-palin',
        title: 'Palindrome?',
        prompt: 'Read one word. Print `Yes` if it is a palindrome (the same forwards and backwards) and `No` if not.',
        starter: STR + String.raw`

int main() {
    char s[50];
    scanf("%s", s);
    // print Yes or No
    return 0;
}
`,
        sampleInput: 'level',
        usesInput: true,
        tests: [
          { input: 'level', expected: 'Yes' },
          { input: 'campus', expected: 'No' },
          { input: 'noon', expected: 'Yes', hidden: true },
          { input: 'x', expected: 'Yes', hidden: true },
        ],
        hints: [
          'Compare the first letter with the last, the second with the second last, and so on.',
          'Loop `i` from 0 while `i < len / 2` and compare `s[i]` with `s[len - 1 - i]`. One mismatch means No.',
          'A similar example: the palindrome `try` block in this lesson. Print Yes or No instead of the longer messages.',
        ],
      },
      {
        id: 'c30-caesar',
        title: 'Secret code',
        prompt: 'Read a word made of small letters and a shift number. Print the word with every letter moved that many places along the alphabet, wrapping from `z` round to `a`. For `xyz` and 3 the answer is `abc`.',
        starter: STR + String.raw`

int main() {
    char word[50];
    int shift, i;
    scanf("%s %d", word, &shift);
    // print the shifted word
    return 0;
}
`,
        sampleInput: 'xyz 3',
        usesInput: true,
        tests: [
          { input: 'xyz 3', expected: 'abc' },
          { input: 'campus 3', expected: 'fdpsxv' },
          { input: 'abc 0', expected: 'abc', hidden: true },
          { input: 'hello 13', expected: 'uryyb', hidden: true },
        ],
        hints: [
          'Walk the word. For each letter you work out a new letter and print it with `%c`.',
          'The new letter is `(word[i] - \'a\' + shift) % 26 + \'a\'`. Print a newline when the loop is over.',
          'A similar example: the project step in this lesson shifts by a fixed 3. Use the number the user types.',
        ],
      },
    ],
  },

  // ================================================================== 31
  {
    id: 'c-recursion-deep',
    level: LEVEL,
    minutes: 28,
    title: 'Recursion in depth',
    summary: 'Powers, digits, binary and Tower of Hanoi: problems that become simple when a function calls itself',
    blocks: [
      {
        t: 'story',
        title: 'The queue at the bank',
        text: 'You join a long bank queue and ask the person in front: “How many people are before you?” They do not count. They ask the person in front of **them** the same question, and that one asks the next, all the way to the front, where the answer is “none”. Each person then adds one and passes the answer back.\n\nThat is **recursion**: a job is solved by handing a smaller copy of the same job to yourself, until the job is so small that the answer is obvious (the **base case**). You met it with factorials in lesson 13. Now you will use it to solve problems that are hard with loops.',
      },
      { t: 'h', text: 'Powers' },
      { t: 'p', text: '2 to the power 10 is 2 times (2 to the power 9). And 2 to the power 0 is 1. Those two sentences are the whole program.' },
      {
        t: 'try',
        code: fn(String.raw`int power(int base, int exp) {
    if (exp == 0) {
        return 1;
    }
    return base * power(base, exp - 1);
}`, String.raw`    printf("%d\n", power(2, 10));`),
        output: '1024',
      },
      { t: 'h', text: 'Digits and binary' },
      { t: 'p', text: 'The digit sum of 4821 is the last digit (1) plus the digit sum of what is left (482). A number below 10 is its own digit sum.' },
      {
        t: 'try',
        code: fn(String.raw`int digit_sum(int n) {
    if (n < 10) {
        return n;
    }
    return digit_sum(n / 10) + n % 10;
}`, String.raw`    printf("%d\n", digit_sum(4821));`),
        output: '15',
      },
      { t: 'p', text: 'Writing a number in binary is recursive too: first write the binary of `n / 2`, then write the last bit `n % 2`. The order of the two lines is the whole trick: the recursive call goes **first**, so the bits come out in the right order.' },
      {
        t: 'try',
        code: fn(String.raw`void binary(int n) {
    if (n > 1) {
        binary(n / 2);
    }
    printf("%d", n % 2);
}`, String.raw`    binary(13);
    printf("\n");`),
        output: '1101',
      },
      { t: 'analogy', text: 'Russian dolls: to find the smallest doll, open the doll, and look in the next doll, and so on, until a doll has nothing inside. On the way back you carry the answer out of each doll in turn.' },
      { t: 'h', text: 'The Tower of Hanoi' },
      { t: 'p', text: 'A monk must move a pile of disks from peg A to peg C, one at a time, never putting a bigger disk on a smaller. To move `n` disks you move `n - 1` out of the way, move the big one, then move the `n - 1` back on top. So the number of moves for `n` disks is twice the moves for `n - 1`, plus one.' },
      {
        t: 'try',
        code: fn(String.raw`int moves(int n) {
    if (n == 0) {
        return 0;
    }
    return 2 * moves(n - 1) + 1;
}`, String.raw`    int n;
    for (n = 1; n <= 5; n++) {
        printf("%d disks: %d moves\n", n, moves(n));
    }`),
        output: '1 disks: 1 moves\n2 disks: 3 moves\n3 disks: 7 moves\n4 disks: 15 moves\n5 disks: 31 moves',
      },
      { t: 'tip', text: 'Every recursive function needs (1) a **base case** that answers directly, and (2) a recursive case that moves **closer** to the base case. If either is missing, the function calls itself forever.' },
      {
        t: 'predict',
        code: fn(String.raw`int f(int n) {
    if (n < 10) {
        return n;
    }
    return f(n / 10) + n % 10;
}`, String.raw`    printf("%d\n", f(345));`),
        question: 'What does this program print?',
        options: ['12', '3', '345', '54'],
        answer: 0,
        explain: '`f(345)` is `f(34) + 5`, and `f(34)` is `f(3) + 4`, and `f(3)` is 3. So 3 + 4 + 5 = 12.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap to make the **base case**: any number to the power 0 is 1.',
        template: fn(String.raw`int power(int base, int exp) {
    if (exp ___ 0) {
        return 1;
    }
    return base * power(base, exp - 1);
}`, String.raw`    printf("%d\n", power(2, 3));`),
        blanks: [{ options: ['==', '!=', '>'], answer: '==' }],
        output: '8',
      },
      {
        t: 'bug',
        code: fn(String.raw`int power(int b, int e) {
    if (e == 0) {
        return 1;
    }
    return base * power(b, e - 1);
}`, String.raw`    printf("%d\n", power(2, 4));`),
        question: 'This program stops with an error about `base`. What is wrong?',
        options: ['The parameter is called `b`, so `base` does not exist: write `b * power(b, e - 1)`', 'A function cannot call itself', 'e must be a float', 'The base case should return 0'],
        answer: 0,
        explain: 'The function’s parameter is named `b`, but the last line uses `base`. A typo in a name is a classic bug. Use `b * power(b, e - 1)`.',
        fixed: fn(String.raw`int power(int b, int e) {
    if (e == 0) {
        return 1;
    }
    return b * power(b, e - 1);
}`, String.raw`    printf("%d\n", power(2, 4));`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: fn(String.raw`int count_down(int n) {
    return count_down(n - 1);
}`, String.raw`    printf("%d\n", count_down(3));`),
            why: 'There is **no base case**, so the function calls itself for ever until the computer runs out of memory. Always write the stopping case first: `if (n == 0) return 0;`.',
            right: fn(String.raw`int count_down(int n) {
    if (n == 0) {
        return 0;
    }
    return count_down(n - 1);
}`, String.raw`    printf("%d\n", count_down(3));`),
          },
          {
            wrong: fn(String.raw`int sum_to(int n) {
    if (n == 0) {
        return 0
    }
    return n + sum_to(n - 1);
}`, String.raw`    printf("%d\n", sum_to(4));`),
            why: 'The `return 0` line is missing its semicolon, so the program does not even start. Every statement ends with `;`.',
            right: fn(String.raw`int sum_to(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sum_to(n - 1);
}`, String.raw`    printf("%d\n", sum_to(4));`),
          },
          {
            logic: true,
            wrong: fn(String.raw`void binary(int n) {
    printf("%d", n % 2);
    if (n > 1) {
        binary(n / 2);
    }
}`, String.raw`    binary(13);
    printf("\n");`),
            why: 'Printing the bit **before** the recursive call writes the bits from the end to the start: this prints `1011` for 13. Put the recursive call first, then print.',
            right: fn(String.raw`void binary(int n) {
    if (n > 1) {
        binary(n / 2);
    }
    printf("%d", n % 2);
}`, String.raw`    binary(13);
    printf("\n");`),
          },
        ],
      },
      { t: 'quiz', question: 'How many moves does the Tower of Hanoi need for 3 disks?', options: ['7', '6', '8', '9'], answer: 0, explain: 'moves(1) = 1, moves(2) = 2 × 1 + 1 = 3, moves(3) = 2 × 3 + 1 = 7.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 24): the receipt check digit',
        text: 'Every receipt number gets a **check digit**: add the digits, and if the answer has more than one digit, add **its** digits, until one digit is left. A function that calls itself is perfect. Try 9875 and then 99.',
        stdin: '9875',
        code: String.raw`#include <stdio.h>

int check_digit(int n) {
    int sum = 0;
    if (n < 10) {
        return n;
    }
    while (n > 0) {
        sum = sum + n % 10;
        n = n / 10;
    }
    return check_digit(sum);
}

int main() {
    int receipt;
    scanf("%d", &receipt);
    printf("Check digit: %d\n", check_digit(receipt));
    return 0;
}
`,
        output: 'Check digit: 2',
      },
      {
        t: 'recap',
        items: ['A recursive function needs a **base case** and a step that gets closer to it.', 'Power: `b * power(b, e - 1)`, with `power(b, 0)` equal to 1.', 'Digits: `f(n / 10)` and `n % 10`. Binary: the recursive call goes **before** the print.', 'Tower of Hanoi: `moves(n) = 2 * moves(n - 1) + 1`.', 'No base case means an endless chain of calls.'],
        memory: 'Stop first, then shrink.',
      },
    ],
    exercises: [
      {
        id: 'c31-power',
        title: 'Power by recursion',
        prompt: 'Complete the recursive function `power(base, exp)`. The program reads a base and an exponent (0 or more) and prints `Result: 1024` (for 2 and 10).',
        starter: fn(String.raw`int power(int base, int exp) {
    // base case, then the recursive case
}`, String.raw`    int b, e;
    scanf("%d %d", &b, &e);
    printf("Result: %d\n", power(b, e));`),
        sampleInput: '2 10',
        usesInput: true,
        tests: [
          { input: '2 10', expected: 'Result: 1024' },
          { input: '5 0', expected: 'Result: 1' },
          { input: '3 4', expected: 'Result: 81', hidden: true },
          { input: '-2 3', expected: 'Result: -8', hidden: true },
        ],
        hints: [
          'The stopping case: when `exp` is 0 the answer is 1.',
          'Otherwise the answer is `base * power(base, exp - 1)`.',
          'A similar example: `power` in this lesson. Write it again from memory.',
        ],
      },
      {
        id: 'c31-binary',
        title: 'Binary by recursion',
        prompt: 'Complete the recursive function `binary(n)` that prints the binary form of a number, with no spaces. The program reads a number (0 or more) and prints it followed by a newline. For 13 it prints `1101`, and for 0 it prints `0`.',
        starter: fn(String.raw`void binary(int n) {
    // print the binary digits of n
}`, String.raw`    int n;
    scanf("%d", &n);
    binary(n);
    printf("\n");`),
        sampleInput: '13',
        usesInput: true,
        tests: [
          { input: '13', expected: '1101' },
          { input: '0', expected: '0' },
          { input: '8', expected: '1000', hidden: true },
          { input: '255', expected: '11111111', hidden: true },
        ],
        hints: [
          'If `n` is bigger than 1, first call `binary(n / 2)`.',
          'After that, print the last bit: `printf("%d", n % 2);`',
          'A similar example: the `binary` function in this lesson. Write it again.',
        ],
      },
      {
        id: 'c31-sumarr',
        title: 'Sum an array by recursion',
        prompt: 'Complete `sum(a, n)`, which returns the sum of the first `n` numbers of the array `a` using recursion (no loop). The program reads five numbers and prints `Total: 15` (for 1 2 3 4 5).',
        starter: fn(String.raw`int sum(int a[], int n) {
    // no loops: use recursion
}`, String.raw`    int a[5], i;
    for (i = 0; i < 5; i++) {
        scanf("%d", &a[i]);
    }
    printf("Total: %d\n", sum(a, 5));`),
        sampleInput: '1 2 3 4 5',
        usesInput: true,
        tests: [
          { input: '1 2 3 4 5', expected: 'Total: 15' },
          { input: '10 0 0 0 5', expected: 'Total: 15' },
          { input: '-1 -2 -3 -4 -5', expected: 'Total: -15', hidden: true },
        ],
        hints: [
          'With 0 numbers the sum is 0.',
          'Otherwise it is the last of the `n` numbers, `a[n - 1]`, plus the sum of the first `n - 1`.',
          'A similar example: `digit_sum` in this lesson adds one piece to the answer for a smaller problem.',
        ],
      },
    ],
  },

  // ================================================================== 32
  {
    id: 'c-stock-system',
    level: LEVEL,
    minutes: 35,
    title: 'Capstone: the Duuka stock system',
    summary: 'A menu-driven program that combines arrays, loops, decisions and validation',
    blocks: [
      {
        t: 'story',
        title: 'Nakato’s stock book',
        text: 'Nakato’s duuka sells four items. Each evening she writes the stock in a book, crosses out what sold and adds what the supplier brought. One night she sold the last bag of sugar twice, to two customers, because her book was wrong. Both left angry.\n\nYou can now build her a program that **refuses** to sell what is not there. It uses everything from this course: arrays, loops, decisions, constants and a menu that runs until she chooses to stop. It is the same shape as a real application: show a menu, read a choice, act, repeat.',
      },
      { t: 'h', text: 'Step 1: the data' },
      { t: 'p', text: 'Two **parallel arrays** hold the prices and the stock of the same four items: box 0 of each array describes item 1, box 1 describes item 2, and so on. A named constant says how many items there are, so that adding an item later changes one line.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int price[ITEMS] = {3000, 1500, 2500, 800};
    int stock[ITEMS] = {10, 20, 5, 30};
    int i;
    for (i = 0; i < ITEMS; i++) {
        printf("Item %d: price %d, stock %d\n", i + 1, price[i], stock[i]);
    }
    return 0;
}
`,
        output: 'Item 1: price 3000, stock 10\nItem 2: price 1500, stock 20\nItem 3: price 2500, stock 5\nItem 4: price 800, stock 30',
      },
      { t: 'h', text: 'Step 2: the sale, with checks' },
      { t: 'p', text: 'Before selling, the program checks two things: the item number is real, and the stock is enough. Only if both are true does it change the arrays. Checks like these are called **validation**.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int price[ITEMS] = {3000, 1500, 2500, 800};
    int stock[ITEMS] = {10, 20, 5, 30};
    int code = 3, qty = 8;
    if (code < 1 || code > ITEMS) {
        printf("No such item\n");
    } else if (qty > stock[code - 1]) {
        printf("Not enough stock\n");
    } else {
        stock[code - 1] = stock[code - 1] - qty;
        printf("Sold for %d\n", qty * price[code - 1]);
    }
    return 0;
}
`,
        output: 'Not enough stock',
      },
      { t: 'analogy', text: 'A bouncer at a door checks the guest list **before** letting anyone in. The checks come first, and the action (changing the stock) happens only for guests who pass every check.' },
      { t: 'tip', text: 'Item number 3 lives in box 2 (`code - 1`), because arrays count from 0 but people count from 1. Forgetting the `- 1` is the most common bug in programs like this.' },
      {
        t: 'predict',
        code: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 2, qty = 5;
    if (qty > stock[code - 1]) {
        printf("Not enough stock\n");
    } else {
        stock[code - 1] = stock[code - 1] - qty;
        printf("Left: %d\n", stock[code - 1]);
    }
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['Left: 4', 'Not enough stock', 'Left: 9', 'Left: 2'],
        answer: 0,
        explain: 'Item 2 is in box 1, which holds 9. We want 5, and 5 is not more than 9, so the sale goes through: 9 - 5 = 4 are left.',
      },
      { t: 'h', text: 'Step 3: the menu loop' },
      { t: 'p', text: 'A menu is a `do while` loop (lesson 8): it runs at least once and repeats until the user chooses 0. Inside, an `if` chain picks the action. The numbers are read from the input box, one after another, so you can test with a whole list of commands at once.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 25): the stock system',
        text: 'The commands are: 1 shows the stock, 2 sells (item number then quantity), 3 restocks (item number then quantity), 0 quits. The input below shows the stock, sells 3 of item 1, tries to sell 9 of item 3 (only 5 in stock), restocks item 3 with 10 and tries item 9, which does not exist. Change the commands and watch what happens.',
        stdin: '1\n2 1 3\n2 3 9\n3 3 10\n2 9 1\n0',
        code: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int price[ITEMS] = {3000, 1500, 2500, 800};
    int stock[ITEMS] = {10, 20, 5, 30};
    int choice, code, qty, i, income = 0;
    do {
        scanf("%d", &choice);
        if (choice == 1) {
            for (i = 0; i < ITEMS; i++) {
                printf("Item %d: price %d, stock %d\n", i + 1, price[i], stock[i]);
            }
        } else if (choice == 2) {
            scanf("%d %d", &code, &qty);
            if (code < 1 || code > ITEMS) {
                printf("No such item\n");
            } else if (qty > stock[code - 1]) {
                printf("Not enough stock\n");
            } else {
                stock[code - 1] = stock[code - 1] - qty;
                income = income + qty * price[code - 1];
                printf("Sold. Income so far: %d\n", income);
            }
        } else if (choice == 3) {
            scanf("%d %d", &code, &qty);
            stock[code - 1] = stock[code - 1] + qty;
            printf("Restocked item %d: %d\n", code, stock[code - 1]);
        }
    } while (choice != 0);
    printf("Closing income: %d\n", income);
    return 0;
}
`,
        output: 'Item 1: price 3000, stock 10\nItem 2: price 1500, stock 20\nItem 3: price 2500, stock 5\nItem 4: price 800, stock 30\nSold. Income so far: 9000\nNot enough stock\nRestocked item 3: 15\nNo such item\nClosing income: 9000',
      },
      {
        t: 'bug',
        code: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int stock[ITEMS] = {10, 20, 5, 30};
    int code = 2, qty = 3;
    stock[code - 1] = stock[code - 1] - qty
    printf("Left: %d\n", stock[code - 1]);
    return 0;
}
`,
        question: 'This program does not start. What is wrong?',
        options: ['The line that changes the stock has no semicolon at the end', 'The array has too many boxes', 'ITEMS must be written in small letters', 'qty must be a float'],
        answer: 0,
        explain: 'Every statement ends with `;`. The line `stock[code - 1] = stock[code - 1] - qty` is missing it, so the parser cannot tell where it ends.',
        fixed: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int stock[ITEMS] = {10, 20, 5, 30};
    int code = 2, qty = 3;
    stock[code - 1] = stock[code - 1] - qty;
    printf("Left: %d\n", stock[code - 1]);
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 1;
    printf("%d\n", stock[code]);
    return 0;
}
`,
            why: 'Item 1 lives in box 0. `stock[code]` with `code = 1` reads item 2 and prints `9` instead of `4`. A person says “item 1” but the computer needs `stock[code - 1]`.',
            right: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 1;
    printf("%d\n", stock[code - 1]);
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 3, qty = 5;
    stock[code - 1] = stock[code - 1] - qty;
    if (stock[code - 1] < 0) {
        printf("Oops, negative stock\n");
    }
    return 0;
}
`,
            why: 'The stock is changed **before** the check, so by the time the program notices there is not enough, it has already sold what it did not have. Check first, change afterwards.',
            right: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 3, qty = 5;
    if (qty > stock[code - 1]) {
        printf("Not enough stock\n");
    } else {
        stock[code - 1] = stock[code - 1] - qty;
    }
    return 0;
}
`,
          },
          {
            wrong: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 4;
    printf("%d\n", stock[code - 1]);
    return 0;
}
`,
            why: 'There are only three boxes (0, 1, 2) and `code - 1` is 3. This app stops with an error; real C carries on silently and prints a garbage number, which is why the program must **validate** `code` (`code < 1 || code > ITEMS`) before using it.',
            right: String.raw`#include <stdio.h>

int main() {
    int stock[3] = {4, 9, 2};
    int code = 3;
    printf("%d\n", stock[code - 1]);
    return 0;
}
`,
          },
        ],
      },
      { t: 'quiz', question: 'In the stock program, why is the item number checked **before** the stock is changed?', options: ['So that a bad number cannot damage the arrays', 'Because C requires it', 'To make the program faster', 'So the menu can quit'], answer: 0, explain: 'Using an out-of-range number would read or change memory that is not part of the array. Validating first protects the data.' },
      {
        t: 'recap',
        items: ['Parallel arrays: box `i` of each array describes the same item.', 'Use a named constant (`#define ITEMS 4`) for the size.', 'People count from 1, arrays from 0: use `code - 1`.', 'Validate first (`code` in range, enough stock), change after.', 'A menu is a `do while` loop with an `if` chain; the loop ends when the user chooses 0.'],
        memory: 'Check the door, then open it.',
      },
    ],
    exercises: [
      {
        id: 'c32-sell',
        title: 'Sell safely',
        prompt: 'The program has four items in stock. Read an item number and a quantity. If the item number is not between 1 and 4, print `No such item`. If the quantity is more than the stock, print `Not enough stock`. Otherwise print `Sold: ` followed by the amount to pay (price times quantity), like `Sold: 6000` for 2 of item 1.',
        starter: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int price[ITEMS] = {3000, 1500, 2500, 800};
    int stock[ITEMS] = {10, 20, 5, 30};
    int code, qty;
    scanf("%d %d", &code, &qty);
    // validate, then print the result
    return 0;
}
`,
        sampleInput: '1 2',
        usesInput: true,
        tests: [
          { input: '1 2', expected: 'Sold: 6000' },
          { input: '3 6', expected: 'Not enough stock' },
          { input: '0 1', expected: 'No such item', hidden: true },
          { input: '5 1', expected: 'No such item', hidden: true },
          { input: '4 30', expected: 'Sold: 24000', hidden: true },
        ],
        hints: [
          'Check the item number first: `if (code < 1 || code > ITEMS)`.',
          'Next `else if (qty > stock[code - 1])`. The last `else` is the sale: `printf("Sold: %d\\n", qty * price[code - 1]);`.',
          'A similar example: the second `try` block of this lesson has the same three checks.',
        ],
      },
      {
        id: 'c32-restock',
        title: 'The supplier’s delivery',
        prompt: 'Four items start with stock `10 20 5 30`. Read a number `n` and then `n` deliveries, each an item number (1 to 4) and a quantity. Add every delivery to the stock, then print the total stock of all items on one line, as `Total stock: 80`. With no deliveries (`n` is 0) the total is 65.',
        starter: String.raw`#include <stdio.h>

#define ITEMS 4

int main() {
    int stock[ITEMS] = {10, 20, 5, 30};
    int n, i, code, qty, total = 0;
    scanf("%d", &n);
    // read and apply the n deliveries
    // add up all the stock
    printf("Total stock: %d\n", total);
    return 0;
}
`,
        sampleInput: '2\n3 10\n1 5',
        usesInput: true,
        tests: [
          { input: '2\n3 10\n1 5', expected: 'Total stock: 80' },
          { input: '0', expected: 'Total stock: 65' },
          { input: '1\n4 100', expected: 'Total stock: 165', hidden: true },
        ],
        hints: [
          'A loop that runs `n` times reads `scanf("%d %d", &code, &qty);` each time.',
          'Inside it: `stock[code - 1] = stock[code - 1] + qty;`.',
          'Afterwards a second loop adds every `stock[i]` into `total`.',
        ],
      },
      {
        id: 'c32-menu',
        title: 'A tiny menu',
        prompt: 'Build a menu. Read commands until 0. Command 1 means “add 1 customer”, command 2 means “add 1 sale”, command 3 prints `Customers: X Sales: Y` with the totals so far. When the command is 0, print `Bye` and stop.',
        starter: prog(String.raw`    int choice, customers = 0, sales = 0;
    // read commands in a loop until 0`),
        sampleInput: '1\n1\n2\n3\n0',
        usesInput: true,
        tests: [
          { input: '1\n1\n2\n3\n0', expected: 'Customers: 2 Sales: 1\nBye' },
          { input: '0', expected: 'Bye' },
          { input: '2\n2\n2\n3\n1\n3\n0', expected: 'Customers: 0 Sales: 3\nCustomers: 1 Sales: 3\nBye', hidden: true },
        ],
        hints: [
          'A `do { ... } while (choice != 0);` loop reads at least one command.',
          'Inside the loop: `scanf("%d", &choice);`, then an `if` for 1, an `else if` for 2 and one for 3.',
          'After the loop print `Bye`. Careful: the loop also runs for the final 0, so make sure 0 itself does not print anything inside the loop.',
        ],
      },
    ],
  },
];
