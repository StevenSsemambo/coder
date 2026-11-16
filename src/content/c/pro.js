// C, Level 6: Beyond the basics. Lessons 26 to 29 (bits and number bases, macros and sizeof,
// number algorithms, sorting and searching). All of it runs on the built-in interpreter.
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
// Never give a #define name that also appears inside quoted text (see docs/C-TRACK.md).
import { prog, inc } from './shared.js';

const LEVEL = 'Level 6: Beyond the basics';

/** A whole program with extra top-level code (macros, functions) above main. */
const fn = (fns, body, incl = '#include <stdio.h>') => `${incl}\n\n${fns ? fns + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

export const proLessons = [
  // ================================================================== 26
  {
    id: 'c-bits',
    level: LEVEL,
    minutes: 28,
    title: 'Bits and number bases',
    summary: 'Binary, hexadecimal and the bitwise operators: & | ^ ~ << >>',
    blocks: [
      {
        t: 'story',
        title: 'Eight switches',
        text: 'Inside every phone is a tiny board of switches, each one **on** or **off**. Eight switches make a **byte**, and the pattern of on and off is how the phone stores a number, a letter or a colour.\n\nSo far you have written numbers like `13`. The phone stores 13 as the switches `00001101`. In this lesson you learn to read those switches, and to flip them yourself with C’s **bitwise operators**. Programmers who write drivers, games, network code and file formats use them every day.',
      },
      { t: 'h', text: 'Counting in binary' },
      { t: 'p', text: 'We count in tens because we have ten fingers. A computer has two states, so it counts in **twos**. Each switch (a **bit**) is worth double the one to its right: 128, 64, 32, 16, 8, 4, 2, 1. So `00001101` means 8 + 4 + 1 = 13.' },
      {
        t: 'try',
        code: prog(String.raw`    int n = 13;
    int i;
    printf("%d in binary: ", n);
    for (i = 7; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
    }
    printf("\n");`),
        output: '13 in binary: 00001101',
      },
      { t: 'p', text: 'That loop used two of the new operators. `n >> i` slides the bits of `n` to the right by `i` places, and `& 1` keeps only the last bit. Here are all six:' },
      {
        t: 'list',
        items: [
          '`a & b` AND: a bit is 1 only if it is 1 in **both**.',
          '`a | b` OR: a bit is 1 if it is 1 in **either**.',
          '`a ^ b` XOR: a bit is 1 if the two bits are **different**.',
          '`~a` NOT: flips every bit.',
          '`a << n` slides the bits left by n places (multiplies by 2, n times).',
          '`a >> n` slides the bits right by n places (divides by 2, n times, dropping the remainder).',
        ],
      },
      {
        t: 'try',
        code: prog(String.raw`    int a = 12;   /* 1100 */
    int b = 10;   /* 1010 */
    printf("a & b = %d\n", a & b);
    printf("a | b = %d\n", a | b);
    printf("a ^ b = %d\n", a ^ b);
    printf("1 << 3 = %d\n", 1 << 3);
    printf("40 >> 2 = %d\n", 40 >> 2);`),
        output: 'a & b = 8\na | b = 14\na ^ b = 6\n1 << 3 = 8\n40 >> 2 = 10',
      },
      { t: 'analogy', text: 'Line the two numbers up like two rows of light switches. **AND** keeps a light on only where both rows are on. **OR** keeps it on where either row is on. **XOR** keeps it on where the rows disagree.' },
      { t: 'tip', text: '`&` and `&&` are different. `&&` asks a yes or no question about two conditions. `&` works on every bit of two numbers. Likewise `|` and `||`.' },
      { t: 'h', text: 'Two everyday tricks' },
      { t: 'p', text: 'The last bit of a number tells you if it is odd, so `n & 1` is 1 for an odd number and 0 for an even one. And you can pack several yes or no answers into one number, one bit each: these are called **flags**.' },
      {
        t: 'try',
        code: prog(String.raw`    int can_read = 1;     /* bit 0 */
    int can_write = 2;    /* bit 1 */
    int can_run = 4;      /* bit 2 */
    int perm = can_read | can_run;
    printf("perm = %d\n", perm);
    if (perm & can_write) {
        printf("May write\n");
    } else {
        printf("May not write\n");
    }
    printf("Odd? %d\n", 7 & 1);`),
        output: 'perm = 5\nMay not write\nOdd? 1',
      },
      {
        t: 'predict',
        code: prog(String.raw`    printf("%d\n", 6 & 3);`),
        question: 'What does this program print? (6 is 110 and 3 is 011.)',
        options: ['2', '7', '3', '1'],
        answer: 0,
        explain: 'Line up 110 and 011. Only the middle bit is 1 in both, so the answer is 010, which is 2.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program tests the **last bit** and says this number is even.',
        template: prog(String.raw`    int n = 6;
    if (n ___ 1) {
        printf("odd\n");
    } else {
        printf("even\n");
    }`),
        blanks: [{ options: ['&', '&&', '|'], answer: '&' }],
        output: 'even',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int n = 13;
    printf("%d\n", n & mask);`),
        question: 'This program stops with an error about `mask`. What is wrong?',
        options: ['`mask` was never declared, so give it a value first', 'You cannot use & with printf', 'n must be a float', 'The number 13 is too big'],
        answer: 0,
        explain: 'C needs every variable declared before it is used. Add `int mask = 4;` above the `printf` and the program runs.',
        fixed: prog(String.raw`    int n = 13;
    int mask = 4;
    printf("%d\n", n & mask);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    printf("%d\n", 2 ^ 3);`),
            why: 'In C, `^` is XOR, **not** “to the power of”. This prints `1`, not 8. For powers of two use a shift: `1 << 3` is 8.',
            right: prog(String.raw`    printf("%d\n", 1 << 3);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int n = 6;
    if (n & 1 == 0) {
        printf("even\n");
    } else {
        printf("odd\n");
    }`),
            why: '`==` is stronger than `&`, so C works out `1 == 0` first (that is 0), then `n & 0` (always 0). The test is never true and this prints `odd`. Put brackets round the bit operation: `(n & 1) == 0`.',
            right: prog(String.raw`    int n = 6;
    if ((n & 1) == 0) {
        printf("even\n");
    } else {
        printf("odd\n");
    }`),
          },
          {
            wrong: prog(String.raw`    int x = 5;
    printf("%d\n", x ~ 1);`),
            why: '`~` is a **one-operand** operator: it flips the bits of the number after it (`~x`). Between two numbers, you want `^` (XOR), `&` or `|`.',
            right: prog(String.raw`    int x = 5;
    printf("%d\n", x ^ 1);`),
          },
        ],
      },
      { t: 'quiz', question: 'What is `1 << 4`?', options: ['16', '4', '14', '8'], answer: 0, explain: 'Each shift left doubles the number: 1, 2, 4, 8, 16. Shifting left by 4 means multiplying by 2 four times.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 19): the switchboard',
        text: 'A program that shows a number as eight switches and counts how many are on. Try 13, then 255 and 64.',
        stdin: '13',
        code: String.raw`#include <stdio.h>

int main() {
    int n, i, ones = 0;
    scanf("%d", &n);
    printf("Binary: ");
    for (i = 7; i >= 0; i--) {
        int bit = (n >> i) & 1;
        printf("%d", bit);
        ones = ones + bit;
    }
    printf("\n");
    printf("Switches on: %d\n", ones);
    return 0;
}
`,
        output: 'Binary: 00001101\nSwitches on: 3',
      },
      {
        t: 'recap',
        items: ['Binary counts in twos: 128, 64, 32, 16, 8, 4, 2, 1.', '`&` AND, `|` OR, `^` XOR, `~` NOT, `<<` and `>>` slide the bits.', '`(n >> i) & 1` reads bit number i.', '`n & 1` is 1 for an odd number. `^` is XOR, not a power.', 'Put brackets round bit operations when you compare them.'],
        memory: 'Shift it, mask it.',
      },
    ],
    exercises: [
      {
        id: 'c26-binary',
        title: 'Show the switches',
        prompt: 'Read a number from 0 to 255 and print it as **eight binary digits** on one line, for example `00001101` for 13.',
        starter: prog(String.raw`    int n;
    scanf("%d", &n);
    // print the 8 bits, highest first`),
        sampleInput: '13',
        usesInput: true,
        tests: [
          { input: '13', expected: '00001101' },
          { input: '255', expected: '11111111' },
          { input: '0', expected: '00000000', hidden: true },
          { input: '128', expected: '10000000', hidden: true },
        ],
        hints: [
          'Use a `for` loop that counts **down** from 7 to 0.',
          'Bit number `i` of `n` is `(n >> i) & 1`. Print it with `%d`, with no space and no newline until the loop ends.',
          'A similar example: the first `try` block in this lesson prints the bits of 13. Do the same for a number the user types.',
        ],
      },
      {
        id: 'c26-count',
        title: 'Count the ones',
        prompt: 'Read a number from 0 to 255 and print how many of its eight bits are 1, as `Ones: 3` (for 13).',
        starter: prog(String.raw`    int n, i, ones = 0;
    scanf("%d", &n);
    // count the bits that are 1
    printf("Ones: %d\n", ones);`),
        sampleInput: '13',
        usesInput: true,
        tests: [
          { input: '13', expected: 'Ones: 3' },
          { input: '255', expected: 'Ones: 8' },
          { input: '0', expected: 'Ones: 0', hidden: true },
          { input: '64', expected: 'Ones: 1', hidden: true },
        ],
        hints: [
          'Look at each of the eight bits, one after another, in a loop.',
          'Inside the loop, add `(n >> i) & 1` to `ones`.',
          'A similar example: the project step in this lesson already counts the switches that are on.',
        ],
      },
      {
        id: 'c26-pow2',
        title: 'Power of two?',
        prompt: 'Read a positive number. Print `Yes` if it is a power of two (1, 2, 4, 8, 16, …) and `No` if not. Hint: a power of two has exactly one bit set, and then `n & (n - 1)` is 0.',
        starter: prog(String.raw`    int n;
    scanf("%d", &n);
    // print Yes or No`),
        sampleInput: '16',
        usesInput: true,
        tests: [
          { input: '16', expected: 'Yes' },
          { input: '12', expected: 'No' },
          { input: '1', expected: 'Yes', hidden: true },
          { input: '96', expected: 'No', hidden: true },
        ],
        hints: [
          'Take 8 (1000) and 7 (0111): they share no bits, so `8 & 7` is 0.',
          'Test `(n & (n - 1)) == 0`. Keep the brackets.',
          'A similar example: the even-or-odd test in this lesson also uses `&` inside an `if`.',
        ],
      },
    ],
  },

  // ================================================================== 27
  {
    id: 'c-macros',
    level: LEVEL,
    minutes: 26,
    title: 'Macros, constants and sizeof',
    summary: '#define, const, macros with a parameter, and how much memory each type uses',
    blocks: [
      {
        t: 'story',
        title: 'The price on the board',
        text: 'Mama Rose sells a rolex for 3,000 shillings. The price appears in the till, the receipt, the daily report and the stock check: forty places. When the price goes up to 3,500, she must find all forty. If she misses one, the receipt and the till disagree and an argument starts.\n\nThe cure is to write the price **once**, give it a name, and use the name everywhere. C gives you two ways to do it, and a third tool, the **macro**, that goes further.',
      },
      { t: 'h', text: 'Named constants: #define and const' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

#define PRICE 3000
#define PLATE_SIZE 4

int main() {
    int total = PRICE * PLATE_SIZE;
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Total: 12000',
      },
      { t: 'p', text: '`#define NAME value` is handled before the program is compiled: every `NAME` is replaced by `value`, like find-and-replace. There is **no** `=` and **no** semicolon. Programmers write these names in CAPITALS so that they stand out.' },
      { t: 'p', text: 'The second way is the `const` keyword: `const int VAT = 18;` makes a real variable that you promise never to change. Real C refuses to compile a program that changes it.' },
      {
        t: 'try',
        code: prog(String.raw`    const int VAT = 18;
    int price = 5000;
    int vat = price * VAT / 100;
    printf("VAT: %d\n", vat);
    printf("Total: %d\n", price + vat);`),
        output: 'VAT: 900\nTotal: 5900',
      },
      { t: 'tip', text: 'Honest note: the interpreter in this app does **not** stop you changing a `const`. A real C compiler does, so never rely on it. Another difference: `#define` replaces the name everywhere, even inside quoted text. So never give a macro a name that also appears in a message you print.' },
      { t: 'h', text: 'Macros with a parameter' },
      { t: 'p', text: 'A macro can take a parameter, and then it looks like a function. It is replaced by its text **before** the program runs, so the safest habit is to put **brackets round every use of the parameter and round the whole thing**.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

#define SQUARE(x) ((x) * (x))
#define BAD_SQUARE(x) x * x

int main() {
    printf("%d\n", SQUARE(2 + 3));
    printf("%d\n", BAD_SQUARE(2 + 3));
    return 0;
}
`,
        output: '25\n11',
      },
      { t: 'analogy', text: 'A macro is a **rubber stamp**. Where you write `BAD_SQUARE(2 + 3)` the stamp pastes the text `2 + 3 * 2 + 3`, and the multiplication happens first: 2 + 6 + 3 = 11. With brackets in the stamp, the pasted text is `((2 + 3) * (2 + 3))`, which is 25.' },
      { t: 'h', text: 'sizeof: how much memory?' },
      { t: 'p', text: '`sizeof` tells you how many **bytes** (groups of eight switches) a type or a variable takes. It also gives the length of an array, because the whole array divided by one element is the number of elements.' },
      {
        t: 'try',
        code: prog(String.raw`    int scores[] = {60, 75, 82, 90, 55};
    printf("char: %d byte\n", (int)sizeof(char));
    printf("int: %d bytes\n", (int)sizeof(int));
    printf("double: %d bytes\n", (int)sizeof(double));
    printf("Scores: %d\n", (int)(sizeof(scores) / sizeof(scores[0])));`),
        output: 'char: 1 byte\nint: 4 bytes\ndouble: 8 bytes\nScores: 5',
      },
      { t: 'tip', text: 'The `(int)` in front of `sizeof` turns its answer into a plain `int` so that `%d` prints it correctly. The sizes shown (1, 4, 8) are what you get on nearly every phone and laptop today.' },
      {
        t: 'predict',
        code: String.raw`#include <stdio.h>

#define DOUBLE(x) x * 2

int main() {
    printf("%d\n", DOUBLE(3 + 4));
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['11', '14', '7', '10'],
        answer: 0,
        explain: 'The macro pastes `3 + 4 * 2`. Multiplication goes first: 4 * 2 = 8, then 3 + 8 = 11. Brackets round `x` would have given 14.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap to name the constant with a macro.',
        template: String.raw`#include <stdio.h>

#___ RATE 5

int main() {
    printf("%d\n", RATE * 10);
    return 0;
}
`,
        blanks: [{ options: ['define', 'include', 'const'], answer: 'define' }],
        output: '50',
      },
      {
        t: 'bug',
        code: String.raw`#include <stdio.h>

#define MAX 3;

int main() {
    int marks[MAX] = {50, 60, 70};
    printf("%d\n", marks[0]);
    return 0;
}
`,
        question: 'This program stops with a parsing error. What is wrong?',
        options: ['There is a semicolon after the value in the `#define` line', 'MAX must be written in small letters', 'The array needs four boxes', 'printf cannot print marks[0]'],
        answer: 0,
        explain: 'A macro is copied as text, so the `;` is copied too and `int marks[MAX]` becomes `int marks[3;]`. Never end a `#define` line with a semicolon.',
        fixed: String.raw`#include <stdio.h>

#define MAX 3

int main() {
    int marks[MAX] = {50, 60, 70};
    printf("%d\n", marks[0]);
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: String.raw`#include <stdio.h>

#define N = 5

int main() {
    int a[N];
    a[0] = 1;
    printf("%d\n", a[0]);
    return 0;
}
`,
            why: 'There is no `=` in a `#define`. The text `= 5` is pasted into `int a[= 5]`, which is nonsense. Write `#define N 5`.',
            right: String.raw`#include <stdio.h>

#define N 5

int main() {
    int a[N];
    a[0] = 1;
    printf("%d\n", a[0]);
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: String.raw`#include <stdio.h>

#define TRIPLE(x) x * 3

int main() {
    printf("%d\n", TRIPLE(1 + 1));
    return 0;
}
`,
            why: 'The stamp pastes `1 + 1 * 3`, which is 4, not 6. Put brackets round the parameter and the whole macro.',
            right: String.raw`#include <stdio.h>

#define TRIPLE(x) ((x) * 3)

int main() {
    printf("%d\n", TRIPLE(1 + 1));
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: prog(String.raw`    char name[20] = "Kato";
    printf("%d\n", (int)sizeof(name));`, inc('stdio', 'string')),
            why: '`sizeof` gives the size of the **whole box** (20 bytes), not the length of the text inside it (4). For the length of a string use `strlen(name)`.',
            right: prog(String.raw`    char name[20] = "Kato";
    printf("%d\n", (int)strlen(name));`, inc('stdio', 'string')),
          },
        ],
      },
      { t: 'quiz', question: 'Which line is correct?', options: ['#define LIMIT 100', '#define LIMIT = 100;', 'define LIMIT 100', '#define LIMIT := 100'], answer: 0, explain: 'A `#define` has a hash, the word define, a name and a value. No `=`, no semicolon.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 20): prices in one place',
        text: 'The VAT rate is written once, as a named constant, and the program works out the tax and the total for any price. Try 5000 and then 12000.',
        stdin: '5000',
        code: String.raw`#include <stdio.h>

#define VAT_RATE 18

int main() {
    int price, vat;
    scanf("%d", &price);
    vat = price * VAT_RATE / 100;
    printf("VAT: %d\n", vat);
    printf("Total: %d\n", price + vat);
    return 0;
}
`,
        output: 'VAT: 900\nTotal: 5900',
      },
      {
        t: 'recap',
        items: ['`#define NAME value` pastes the value wherever the name appears. No `=`, no semicolon.', '`const int N = 5;` is a variable you promise not to change.', 'A macro with a parameter needs brackets round the parameter **and** round the whole macro.', '`sizeof` gives bytes: `char` 1, `int` 4, `double` 8. `sizeof(a) / sizeof(a[0])` is an array’s length.'],
        memory: 'Name it once, bracket it twice.',
      },
    ],
    exercises: [
      {
        id: 'c27-circle',
        title: 'Area of a circle',
        prompt: 'The starter has a macro `PI`. Read a radius as a `float` and print the area `PI * r * r` with two decimals, as `Area: 12.57` (for 2).',
        starter: String.raw`#include <stdio.h>

#define PI 3.14159

int main() {
    float r;
    scanf("%f", &r);
    // print the area with 2 decimals
    return 0;
}
`,
        sampleInput: '2',
        usesInput: true,
        tests: [
          { input: '2', expected: 'Area: 12.57' },
          { input: '1', expected: 'Area: 3.14' },
          { input: '10', expected: 'Area: 314.16', hidden: true },
        ],
        hints: [
          'Use the name `PI` like a number. It is replaced by 3.14159.',
          '`printf("Area: %.2f\\n", PI * r * r);`',
          'A similar example: the `PRICE * PLATE_SIZE` try block in this lesson uses macro names in a sum.',
        ],
      },
      {
        id: 'c27-cube',
        title: 'Write a macro',
        prompt: 'Write the macro `CUBE(x)` so that `CUBE(n)` is `n` times itself three times. The program reads `n` and prints `Cube: 27` (for 3). Remember the brackets.',
        starter: String.raw`#include <stdio.h>

#define CUBE(x)

int main() {
    int n;
    scanf("%d", &n);
    printf("Cube: %d\n", CUBE(n));
    return 0;
}
`,
        sampleInput: '3',
        usesInput: true,
        tests: [
          { input: '3', expected: 'Cube: 27' },
          { input: '-2', expected: 'Cube: -8' },
          { input: '0', expected: 'Cube: 0', hidden: true },
        ],
        hints: [
          'The macro text goes after `CUBE(x)` on the same line.',
          'Multiply three copies of `x`: `((x) * (x) * (x))`.',
          'A similar example: `#define SQUARE(x) ((x) * (x))` in this lesson. Add one more factor.',
        ],
      },
      {
        id: 'c27-rolex',
        title: 'The rolex bill',
        prompt: 'A rolex costs `PRICE` shillings. If a customer buys `DISCOUNT_AT` plates or more, the bill gets 10% off. Read the number of plates and print `Total: 13500` (for 5 plates, because 15000 minus 10% is 13500). The constants are in the starter.',
        starter: String.raw`#include <stdio.h>

#define PRICE 3000
#define DISCOUNT_AT 5

int main() {
    int plates, total;
    scanf("%d", &plates);
    // work out total, with 10% off when plates >= DISCOUNT_AT
    printf("Total: %d\n", total);
    return 0;
}
`,
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: 'Total: 13500' },
          { input: '2', expected: 'Total: 6000' },
          { input: '10', expected: 'Total: 27000', hidden: true },
          { input: '4', expected: 'Total: 12000', hidden: true },
        ],
        hints: [
          'Start with `total = plates * PRICE;`.',
          'Then, `if (plates >= DISCOUNT_AT)`, take off a tenth: `total = total - total / 10;`.',
          'A similar example: the VAT project step in this lesson also adds a percentage to a price.',
        ],
      },
    ],
  },

  // ================================================================== 28
  {
    id: 'c-number-algos',
    level: LEVEL,
    minutes: 30,
    title: 'Number detective: classic algorithms',
    summary: 'Digit sums, reversing, GCD, prime numbers and Fibonacci: four loops every programmer knows',
    blocks: [
      {
        t: 'story',
        title: 'The math club puzzle',
        text: 'The campus math club runs a puzzle night. Questions on the board: “What is the sum of the digits of 4821?” “Is 29 prime?” “What is the biggest number that divides both 48 and 18?” Nobody wins by guessing, and nobody wins by working one number by hand all night either. The winners write a small loop that works for **any** number.\n\nThese loops have names and every programmer meets them: they are the exercises job interviewers love. You already own the tools: `%`, `/` and a `while` loop.',
      },
      { t: 'h', text: 'Taking a number apart' },
      { t: 'p', text: 'The last digit of `n` is `n % 10`. Throw it away with `n / 10`. Repeat until nothing is left.' },
      {
        t: 'try',
        code: prog(String.raw`    int n = 4821, sum = 0;
    while (n > 0) {
        sum = sum + n % 10;
        n = n / 10;
    }
    printf("Digit sum: %d\n", sum);`),
        output: 'Digit sum: 15',
      },
      { t: 'p', text: 'Build a new number from the digits as you peel them off, and you get the number **reversed**: multiply what you have by 10, then add the digit.' },
      {
        t: 'try',
        code: prog(String.raw`    int n = 1234, reversed = 0;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n = n / 10;
    }
    printf("Reversed: %d\n", reversed);`),
        output: 'Reversed: 4321',
      },
      { t: 'h', text: 'The greatest common divisor' },
      { t: 'p', text: 'Euclid, more than two thousand years ago, found a shortcut: the biggest number dividing `a` and `b` is the same as the biggest number dividing `b` and the **remainder** of `a / b`. Repeat until the remainder is 0, and the last non-zero number is the answer.' },
      {
        t: 'try',
        code: prog(String.raw`    int a = 48, b = 18;
    while (b != 0) {
        int rest = a % b;
        a = b;
        b = rest;
    }
    printf("GCD: %d\n", a);`),
        output: 'GCD: 6',
      },
      { t: 'analogy', text: 'Tiling a floor 48 by 18 with square tiles: the biggest square that fits **without cutting** is 6 by 6. Euclid’s loop finds that tile without trying every size.' },
      { t: 'h', text: 'Is it prime?' },
      { t: 'p', text: 'A **prime** has exactly two divisors: 1 and itself. To test `n`, try dividing by 2, 3, 4, … If any divides evenly, it is not prime. You only need to try divisors up to the **square root** of `n`, which you can write without any library as `i * i <= n`.' },
      {
        t: 'try',
        code: prog(String.raw`    int n = 29, i, prime = 1;
    if (n < 2) {
        prime = 0;
    }
    for (i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            prime = 0;
        }
    }
    if (prime) {
        printf("%d is prime\n", n);
    } else {
        printf("%d is not prime\n", n);
    }`),
        output: '29 is prime',
      },
      { t: 'tip', text: 'The variable `prime` is a **flag**: it starts as 1 (“yes, probably prime”), and any divisor we find flips it to 0. The number 1 is not prime, which is why `n < 2` is handled first.' },
      { t: 'h', text: 'Fibonacci numbers' },
      { t: 'p', text: 'Start with 0 and 1. Each new number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13, … Keep the last two in variables and slide them along.' },
      {
        t: 'try',
        code: prog(String.raw`    int a = 0, b = 1, i;
    for (i = 0; i < 10; i++) {
        printf("%d ", a);
        int next = a + b;
        a = b;
        b = next;
    }
    printf("\n");`),
        output: '0 1 1 2 3 5 8 13 21 34',
      },
      {
        t: 'predict',
        code: prog(String.raw`    int n = 305, sum = 0;
    while (n > 0) {
        sum = sum + n % 10;
        n = n / 10;
    }
    printf("%d\n", sum);`),
        question: 'What does this program print?',
        options: ['8', '305', '35', '5'],
        answer: 0,
        explain: 'The digits peel off as 5, then 0, then 3. Add them: 5 + 0 + 3 = 8.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program discovers that 7 is prime.',
        template: prog(String.raw`    int n = 7, i, prime = 1;
    for (i = 2; i < n; i++) {
        if (n % i ___ 0) {
            prime = 0;
        }
    }
    if (prime) {
        printf("Prime\n");
    } else {
        printf("Not prime\n");
    }`),
        blanks: [{ options: ['==', '!=', '='], answer: '==' }],
        output: 'Prime',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int a = 48, b = 18;
    while (b != 0) {
        t = a % b;
        a = b;
        b = t;
    }
    printf("GCD: %d\n", a);`),
        question: 'This program stops with an error about `t`. What is wrong?',
        options: ['`t` is used without being declared: write `int t = a % b;`', 'A while loop cannot use %', 'b must be bigger than a', 'The loop should be a for loop'],
        answer: 0,
        explain: 'Every variable must be declared with its type. Making it `int t = a % b;` inside the loop fixes it.',
        fixed: prog(String.raw`    int a = 48, b = 18;
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    printf("GCD: %d\n", a);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int n = 4;
    if (n % 2 = 0) {
        printf("even\n");
    }`),
            why: 'One `=` stores a value; two `==` compare. Inside an `if`, you almost always want `==`.',
            right: prog(String.raw`    int n = 4;
    if (n % 2 == 0) {
        printf("even\n");
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int n = 1, i, prime = 1;
    for (i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            prime = 0;
        }
    }
    printf("%d\n", prime);`),
            why: 'For 1 the loop never runs, so `prime` stays 1 and the program says “prime”. But 1 is **not** prime. Set `prime = 0` first when `n < 2`.',
            right: prog(String.raw`    int n = 1, i, prime = 1;
    if (n < 2) {
        prime = 0;
    }
    for (i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            prime = 0;
        }
    }
    printf("%d\n", prime);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a = 0, b = 1, i;
    for (i = 0; i < 6; i++) {
        printf("%d ", a);
        a = b;
        b = a + b;
    }`),
            why: 'After `a = b`, the old `a` is lost, so `a + b` is wrong. This prints `0 1 2 4 8 16`. Save the sum first in a spare variable: `int next = a + b;`, then move `a` and `b`.',
            right: prog(String.raw`    int a = 0, b = 1, i;
    for (i = 0; i < 6; i++) {
        printf("%d ", a);
        int next = a + b;
        a = b;
        b = next;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'What is the greatest common divisor of 12 and 18?', options: ['6', '3', '2', '36'], answer: 0, explain: '12 = 2 × 2 × 3 and 18 = 2 × 3 × 3. They share 2 × 3 = 6, and nothing bigger divides both.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 21): the lucky receipt',
        text: 'Every receipt has a number. A receipt is **lucky** if its number reads the same backwards (a palindrome). The program reports the digit sum, the reversed number and whether it is lucky. Try 12321, then 1234.',
        stdin: '12321',
        code: String.raw`#include <stdio.h>

int main() {
    int number, n, sum = 0, reversed = 0;
    scanf("%d", &number);
    n = number;
    while (n > 0) {
        sum = sum + n % 10;
        reversed = reversed * 10 + n % 10;
        n = n / 10;
    }
    printf("Digit sum: %d\n", sum);
    printf("Reversed: %d\n", reversed);
    if (reversed == number) {
        printf("Lucky receipt!\n");
    } else {
        printf("Not lucky\n");
    }
    return 0;
}
`,
        output: 'Digit sum: 9\nReversed: 12321\nLucky receipt!',
      },
      {
        t: 'recap',
        items: ['`n % 10` is the last digit, `n / 10` removes it. Loop while `n > 0`.', 'Reverse: `reversed = reversed * 10 + digit`.', 'GCD (Euclid): replace `(a, b)` with `(b, a % b)` until `b` is 0.', 'Prime: try divisors while `i * i <= n`, and remember 1 is not prime.', 'Fibonacci: keep two numbers and slide them along, using a spare variable.'],
        memory: 'Peel, test, slide.',
      },
    ],
    exercises: [
      {
        id: 'c28-digitsum',
        title: 'Sum of the digits',
        prompt: 'Read a positive number and print the sum of its digits, as `Sum: 15` (for 4821).',
        starter: prog(String.raw`    int n, sum = 0;
    scanf("%d", &n);
    // add up the digits
    printf("Sum: %d\n", sum);`),
        sampleInput: '4821',
        usesInput: true,
        tests: [
          { input: '4821', expected: 'Sum: 15' },
          { input: '7', expected: 'Sum: 7' },
          { input: '1000', expected: 'Sum: 1', hidden: true },
          { input: '99999', expected: 'Sum: 45', hidden: true },
        ],
        hints: [
          'Use a `while (n > 0)` loop.',
          'In each turn: add `n % 10` to `sum`, then do `n = n / 10;`.',
          'A similar example: the first `try` block of this lesson does it for 4821.',
        ],
      },
      {
        id: 'c28-gcd',
        title: 'Greatest common divisor',
        prompt: 'Read two positive numbers and print their greatest common divisor, as `GCD: 6` (for 48 and 18). Use Euclid’s method.',
        starter: prog(String.raw`    int a, b;
    scanf("%d %d", &a, &b);
    // Euclid's loop
    printf("GCD: %d\n", a);`),
        sampleInput: '48 18',
        usesInput: true,
        tests: [
          { input: '48 18', expected: 'GCD: 6' },
          { input: '7 13', expected: 'GCD: 1' },
          { input: '100 25', expected: 'GCD: 25', hidden: true },
          { input: '17 17', expected: 'GCD: 17', hidden: true },
        ],
        hints: [
          'Loop while `b` is not 0.',
          'Inside: `int rest = a % b; a = b; b = rest;`',
          'A similar example: the GCD `try` block in this lesson. Use numbers from `scanf` instead of 48 and 18.',
        ],
      },
      {
        id: 'c28-prime',
        title: 'Prime or not?',
        prompt: 'Read a whole number (0 or more). Print `Prime` if it is a prime number and `Not prime` if not. Remember that 0 and 1 are not prime and 2 is.',
        starter: prog(String.raw`    int n;
    scanf("%d", &n);
    // print Prime or Not prime`),
        sampleInput: '29',
        usesInput: true,
        tests: [
          { input: '29', expected: 'Prime' },
          { input: '30', expected: 'Not prime' },
          { input: '1', expected: 'Not prime', hidden: true },
          { input: '2', expected: 'Prime', hidden: true },
          { input: '0', expected: 'Not prime', hidden: true },
        ],
        hints: [
          'Use a flag `prime` that starts at 1. Set it to 0 straight away if `n < 2`.',
          'Loop `i` from 2 while `i * i <= n`. If `n % i == 0`, set the flag to 0.',
          'A similar example: the prime `try` block in this lesson tests 29 the same way.',
        ],
      },
      {
        id: 'c28-fib',
        title: 'Fibonacci numbers',
        prompt: 'Read how many Fibonacci numbers to show (at least 1) and print them on one line separated by single spaces, starting 0 1 1 2 …. For 6 print `0 1 1 2 3 5`. No space after the last number.',
        starter: prog(String.raw`    int n, i;
    scanf("%d", &n);
    // print n Fibonacci numbers`),
        sampleInput: '6',
        usesInput: true,
        tests: [
          { input: '6', expected: '0 1 1 2 3 5' },
          { input: '1', expected: '0' },
          { input: '10', expected: '0 1 1 2 3 5 8 13 21 34', hidden: true },
        ],
        hints: [
          'Keep two variables `a = 0` and `b = 1`. Print `a` in every turn of a loop that runs `n` times.',
          'Print a space **before** every number except the first: `if (i > 0) printf(" ");`. Then `printf("%d", a);` and slide the pair along.',
          'A similar example: the Fibonacci `try` block in this lesson. Change the fixed 10 into `n` and fix the spaces.',
        ],
      },
    ],
  },

  // ================================================================== 29
  {
    id: 'c-sorting',
    level: LEVEL,
    minutes: 30,
    title: 'Sorting and searching',
    summary: 'Selection sort, insertion sort and binary search: ordering data and finding it fast',
    blocks: [
      {
        t: 'story',
        title: 'The dictionary trick',
        text: 'To find “Nakato” in a printed class list you do not read from the first name. You open the book in the middle, see “Mugisha”, and know Nakato must be **later**. You open the later half in the middle, and so on. In a list of a thousand names you find anyone in about ten looks.\n\nThat trick, **binary search**, only works because the list is **sorted**. In lesson 17 you met one way to sort (bubble sort). This lesson gives you two more and then the fast search.',
      },
      { t: 'h', text: 'Selection sort: pick the smallest' },
      { t: 'p', text: 'Find the smallest number in the list and put it first. Then find the smallest in the rest and put it second. Keep going. Each pass **selects** the next smallest.' },
      {
        t: 'try',
        code: prog(String.raw`    int a[5] = {64, 25, 12, 22, 11};
    int i, j, smallest, temp;
    for (i = 0; i < 4; i++) {
        smallest = i;
        for (j = i + 1; j < 5; j++) {
            if (a[j] < a[smallest]) {
                smallest = j;
            }
        }
        temp = a[i];
        a[i] = a[smallest];
        a[smallest] = temp;
    }
    for (i = 0; i < 5; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");`),
        output: '11 12 22 25 64',
      },
      { t: 'analogy', text: 'Like lining up students by height: scan the whole crowd, pull out the shortest and send them to the front; scan the rest, pull out the next shortest, and so on.' },
      { t: 'h', text: 'Insertion sort: slot it in' },
      { t: 'p', text: 'Treat the left part of the list as already sorted. Take the next number (the **key**), shift every bigger number one place to the right, and drop the key into the gap. It is how most people sort a hand of playing cards.' },
      {
        t: 'try',
        code: prog(String.raw`    int a[5] = {9, 4, 7, 1, 6};
    int i, j, key;
    for (i = 1; i < 5; i++) {
        key = a[i];
        j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
    for (i = 0; i < 5; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");`),
        output: '1 4 6 7 9',
      },
      { t: 'h', text: 'Binary search: halve the problem' },
      { t: 'p', text: 'Keep two markers, `low` and `high`, around the part of the list that might hold the target. Look at the middle. If the middle is too small, the target is on the right, so move `low` past the middle. If too big, move `high` before the middle. Stop when you find it, or when the markers cross.' },
      {
        t: 'try',
        code: prog(String.raw`    int a[7] = {11, 12, 22, 25, 40, 64, 90};
    int target = 25;
    int low = 0, high = 6, found = -1;
    while (low <= high) {
        int mid = (low + high) / 2;
        printf("Looking at position %d\n", mid);
        if (a[mid] == target) {
            found = mid;
            break;
        } else if (a[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    if (found >= 0) {
        printf("Found at position %d\n", found);
    } else {
        printf("Not found\n");
    }`),
        output: 'Looking at position 3\nFound at position 3',
      },
      { t: 'tip', text: 'Binary search needs a **sorted** list. On an unsorted list it can say “not found” for a number that is really there. For 1,000 names it needs at most 10 looks; for a million names, at most 20.' },
      {
        t: 'predict',
        code: prog(String.raw`    int a[3] = {3, 1, 2};
    int smallest = 0, j, temp;
    for (j = 1; j < 3; j++) {
        if (a[j] < a[smallest]) {
            smallest = j;
        }
    }
    temp = a[0];
    a[0] = a[smallest];
    a[smallest] = temp;
    printf("%d %d %d\n", a[0], a[1], a[2]);`),
        question: 'This is the **first pass** of selection sort. What does it print?',
        options: ['1 3 2', '1 2 3', '3 1 2', '2 1 3'],
        answer: 0,
        explain: 'The smallest number, 1, is at position 1. It swaps with the number at position 0 (the 3), giving 1 3 2. One pass puts only the first number in place.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop finds the **smallest** number.',
        template: prog(String.raw`    int a[4] = {30, 10, 40, 20};
    int i, smallest = 0;
    for (i = 1; i < 4; i++) {
        if (a[i] ___ a[smallest]) {
            smallest = i;
        }
    }
    printf("%d\n", a[smallest]);`),
        blanks: [{ options: ['<', '>', '=='], answer: '<' }],
        output: '10',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int a[3] = {5, 2, 8};
    int i, j;
    for (i = 0; i < 2; i++) {
        for (j = i + 1; j < 3; j++) {
            if (a[j] < a[i]) {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
    }
    printf("%d %d %d\n", a[0], a[1], a[2]);`),
        question: 'This program stops with an error about `temp`. What is wrong?',
        options: ['`temp` was never declared: add `int temp;`', 'The inner loop must start at 0', 'a must have four numbers', 'You cannot compare two array elements'],
        answer: 0,
        explain: 'The swap needs a spare box called `temp`, and every variable must be declared. Add `int temp;` next to `int i, j;`.',
        fixed: prog(String.raw`    int a[3] = {5, 2, 8};
    int i, j, temp;
    for (i = 0; i < 2; i++) {
        for (j = i + 1; j < 3; j++) {
            if (a[j] < a[i]) {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
    }
    printf("%d %d %d\n", a[0], a[1], a[2]);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int a[5] = {40, 10, 30, 20, 50};
    int low = 0, high = 4, found = -1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] == 20) {
            found = mid;
            break;
        } else if (a[mid] < 20) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    printf("%d\n", found);`),
            why: 'The list is **not sorted**. The middle value, 30, is bigger than 20, so the search throws away the right half, but 20 is at position 3, on the right. It prints `-1` for a number that is there. Sort first, then search.',
            right: prog(String.raw`    int a[5] = {10, 20, 30, 40, 50};
    int low = 0, high = 4, found = -1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] == 20) {
            found = mid;
            break;
        } else if (a[mid] < 20) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    printf("%d\n", found);`),
          },
          {
            wrong: prog(String.raw`    int a[3] = {2, 1, 3};
    int i, j, temp;
    for (i = 0; i < 3; i++) {
        for (j = i + 1; j <= 3; j++) {
            if (a[j] < a[i]) {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
    }
    printf("%d\n", a[0]);`),
            why: 'With `j <= 3` the loop reads `a[3]`, which does not exist (the boxes are 0, 1 and 2). This app stops with an error; real C carries on silently with a garbage value, which is worse. Use `j < 3`.',
            right: prog(String.raw`    int a[3] = {2, 1, 3};
    int i, j, temp;
    for (i = 0; i < 3; i++) {
        for (j = i + 1; j < 3; j++) {
            if (a[j] < a[i]) {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
    }
    printf("%d\n", a[0]);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[5] = {10, 20, 30, 40, 50};
    int low = 0, high = 4;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] < 50) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }
    printf("done\n");`),
            why: 'Writing `low = mid` instead of `low = mid + 1` means that once `low` and `mid` are the same position, nothing changes and the loop runs forever. Always move past the middle you have just checked.',
            right: prog(String.raw`    int a[5] = {10, 20, 30, 40, 50};
    int low = 0, high = 4;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] < 50) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    printf("done\n");`),
          },
        ],
      },
      { t: 'quiz', question: 'About how many looks does binary search need to find a name in a sorted list of 1,000 names?', options: ['About 10', 'About 500', 'About 100', '1,000'], answer: 0, explain: 'Every look halves the list: 1000, 500, 250, 125, 62, 31, 15, 7, 3, 1. Ten halvings are enough, which is why binary search is so fast.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 22): the sorted price list',
        text: 'Five prices come in, in any order. Sort them with selection sort and print the cheapest, the dearest and the whole sorted list. Try 4500 1200 3000 800 2500.',
        stdin: '4500 1200 3000 800 2500',
        code: String.raw`#include <stdio.h>

int main() {
    int p[5];
    int i, j, smallest, temp;
    for (i = 0; i < 5; i++) {
        scanf("%d", &p[i]);
    }
    for (i = 0; i < 4; i++) {
        smallest = i;
        for (j = i + 1; j < 5; j++) {
            if (p[j] < p[smallest]) {
                smallest = j;
            }
        }
        temp = p[i];
        p[i] = p[smallest];
        p[smallest] = temp;
    }
    printf("Cheapest: %d\n", p[0]);
    printf("Dearest: %d\n", p[4]);
    printf("Sorted:");
    for (i = 0; i < 5; i++) {
        printf(" %d", p[i]);
    }
    printf("\n");
    return 0;
}
`,
        output: 'Cheapest: 800\nDearest: 4500\nSorted: 800 1200 2500 3000 4500',
      },
      {
        t: 'recap',
        items: ['Selection sort: find the smallest of the rest, swap it into place, repeat.', 'Insertion sort: take the next number, shift bigger ones right, drop it in the gap.', 'Binary search: check the middle, throw away half. The list **must be sorted**.', 'Move `low = mid + 1` or `high = mid - 1`, never just `mid`.', 'A swap needs a spare variable, declared first.'],
        memory: 'Sort first, then halve.',
      },
    ],
    exercises: [
      {
        id: 'c29-selection',
        title: 'Sort five numbers',
        prompt: 'Read five whole numbers and print them from smallest to biggest on one line, separated by single spaces (no space after the last). For 5 3 9 1 7 print `1 3 5 7 9`.',
        starter: prog(String.raw`    int a[5];
    int i, j, smallest, temp;
    for (i = 0; i < 5; i++) {
        scanf("%d", &a[i]);
    }
    // sort a, then print it`),
        sampleInput: '5 3 9 1 7',
        usesInput: true,
        tests: [
          { input: '5 3 9 1 7', expected: '1 3 5 7 9' },
          { input: '1 2 3 4 5', expected: '1 2 3 4 5' },
          { input: '9 8 7 6 5', expected: '5 6 7 8 9', hidden: true },
          { input: '4 4 2 4 2', expected: '2 2 4 4 4', hidden: true },
        ],
        hints: [
          'Use two loops: the outer one picks the position `i`, the inner one finds the smallest from `i + 1` to the end.',
          'After the inner loop, swap `a[i]` and `a[smallest]` using `temp`.',
          'A similar example: the selection sort `try` block in this lesson. Then print with `if (i > 0) printf(" ");` before each number except the first.',
        ],
      },
      {
        id: 'c29-bsearch',
        title: 'Find it fast',
        prompt: 'The sorted list `{3, 8, 15, 22, 37, 41, 56}` is in the starter. Read a number and use **binary search** to find it. Print `Position: 3` (for 22) or `Not found`.',
        starter: prog(String.raw`    int a[7] = {3, 8, 15, 22, 37, 41, 56};
    int target, low = 0, high = 6, found = -1;
    scanf("%d", &target);
    // binary search, then print the answer`),
        sampleInput: '22',
        usesInput: true,
        tests: [
          { input: '22', expected: 'Position: 3' },
          { input: '3', expected: 'Position: 0' },
          { input: '56', expected: 'Position: 6', hidden: true },
          { input: '10', expected: 'Not found', hidden: true },
        ],
        hints: [
          'Loop `while (low <= high)`. In each turn work out `int mid = (low + high) / 2;`.',
          'If `a[mid] == target`, remember `found = mid` and `break`. If it is smaller, `low = mid + 1`. Otherwise `high = mid - 1`.',
          'A similar example: the binary search `try` block in this lesson. Take out the printing of each look and print `Position:` or `Not found` at the end.',
        ],
      },
      {
        id: 'c29-top3',
        title: 'The top three',
        prompt: 'Read six exam marks and print the three highest, biggest first, one per line: `1st: 91`, `2nd: 85`, `3rd: 78` (for 62 91 78 55 85 70). No two marks are the same.',
        starter: prog(String.raw`    int m[6];
    int i, j, biggest, temp;
    for (i = 0; i < 6; i++) {
        scanf("%d", &m[i]);
    }
    // put the biggest marks first, then print three lines`),
        sampleInput: '62 91 78 55 85 70',
        usesInput: true,
        tests: [
          { input: '62 91 78 55 85 70', expected: '1st: 91\n2nd: 85\n3rd: 78' },
          { input: '10 20 30 40 50 60', expected: '1st: 60\n2nd: 50\n3rd: 40' },
          { input: '99 1 2 3 4 5', expected: '1st: 99\n2nd: 5\n3rd: 4', hidden: true },
        ],
        hints: [
          'Selection sort works for this too: for the first three positions, find the **biggest** of the rest and swap it in.',
          'It is the same as the lesson’s selection sort, with `>` instead of `<`. You only need the outer loop to run three times (`i < 3`).',
          'A similar example: the project step in this lesson sorts five prices from smallest. Flip the comparison to sort from biggest.',
        ],
      },
    ],
  },
];
