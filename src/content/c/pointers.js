// C, Level 5: Pointers. Lessons 23 to 25 (addresses and pointers, pointers and functions, pointers with arrays and strings).
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.
import { prog, inc } from './shared.js';

const LEVEL = 'Level 5: Pointers';

/** A whole program with functions above main (see functions.js). */
const fn = (fns, body, incl = '#include <stdio.h>') => `${incl}\n\n${fns ? fns + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

const CTYPE = inc('stdio', 'ctype');

export const pointerLessons = [
  // ================================================================== 23
  {
    id: 'c-pointers',
    level: LEVEL,
    minutes: 28,
    title: 'Addresses and pointers',
    summary: 'The address of a variable, pointer variables, and reading and changing a value through a pointer',
    blocks: [
      {
        t: 'story',
        title: 'The account number',
        text: 'Kato wants his sister to pay his school fees from his Mobile Money account. He does not hand her the whole phone. He gives her the **account number**. With the number she can find the account, check what is inside, and even add or remove money.\n\nEvery variable in your program lives at an **address** in the computer’s memory, like an account lives at an account number. A **pointer** is a variable whose value is **an address**: the account number of another variable. It lets one part of the program reach a variable that belongs somewhere else.',
      },
      { t: 'h', text: 'Two new symbols' },
      {
        t: 'list',
        items: [
          '`&x` means “the **address of** x”.',
          '`int *p` makes a pointer variable called `p` that can hold the address of an `int`. The star in a **declaration** says “this is a pointer”.',
          '`*p` (the star in an **expression**) means “go to the address in p and use the value **there**”. This is called **dereferencing**.',
        ],
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int x = 10;
    int *p = &x;
    printf("x = %d\n", x);
    printf("*p = %d\n", *p);
    *p = 25;
    printf("x = %d\n", x);
    return 0;
}
`,
        output: 'x = 10\n*p = 10\nx = 25',
      },
      { t: 'analogy', text: 'The pointer `p` is a piece of paper with the **house number** of x written on it. `*p` means “walk to that house and look inside”, and `*p = 25;` means “walk to that house and **change** what is inside”. The paper itself is not the house.' },
      { t: 'tip', text: 'In real programs you can print an address with `%p`, but the number looks like `0x7ffe5c3a91b4` and changes every time you run. This practice runner does not print addresses, and you do not need to see them: what matters is **following** the pointer.' },
      {
        t: 'predict',
        code: prog(String.raw`    int x = 5;
    int *p = &x;
    *p = *p + 3;
    printf("%d\n", x);`),
        question: 'What does this program print?',
        options: ['8', '5', '3', '&x'],
        answer: 0,
        explain: '`*p` is x itself. So `*p = *p + 3;` reads 5, adds 3 and stores 8 back **into x**. Nothing was assigned to x by name, yet x changed. That is the power of a pointer.',
      },
      {
        t: 'predict',
        code: prog(String.raw`    int a = 4;
    int *p = &a;
    int *q = &a;
    *p = *p + 1;
    *q = *q * 2;
    printf("%d\n", a);`),
        question: 'Two pointers hold the address of the same variable `a`. What does this program print?',
        options: ['10', '5', '8', '9'],
        answer: 0,
        explain: '`p` and `q` both lead to `a`. The first line makes a 5, the second doubles that same variable to 10. Two pointers can reach one variable.',
      },
      { t: 'h', text: 'A pointer must match its target' },
      { t: 'p', text: 'A pointer to an `int` points only at `int` variables, a pointer to a `float` only at `float` variables. The type tells the computer how to read the bytes at that address.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    float price = 2.5;
    float *p = &price;
    *p = *p * 2;
    printf("Price: %.1f\n", price);
    return 0;
}
`,
        output: 'Price: 5.0',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the symbol that gives the **address** of x.',
        template: prog(String.raw`    int x = 7;
    int *p = ___x;
    printf("%d\n", *p);`),
        blanks: [{ options: ['&', '*', '%'], answer: '&' }],
        output: '7',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int x = 5;
    int *p = x;
    printf("%d\n", *p);`),
        question: 'This program stops with an error about casting an `int` to a pointer. What is wrong?',
        options: ['A pointer must be given an **address**: `&x`, not the value x', 'The pointer must be a float', 'printf cannot print *p', 'x must be declared after p'],
        answer: 0,
        explain: '`x` is the number 5. A pointer holds an address, so you must write `&x` (the address of x). Putting a plain number in a pointer would make it point at a random place in memory.',
        fixed: prog(String.raw`    int x = 5;
    int *p = &x;
    printf("%d\n", *p);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int *p;
    *p = 7;
    printf("%d\n", *p);`),
            why: '`p` was never given an address, so it points at **nowhere in particular**. Writing through it stores 7 in a random place in memory: real C may crash, or worse, appear to work. This runner stops you with an error. Always point a pointer at a real variable before you use `*p`.',
            right: prog(String.raw`    int x;
    int *p = &x;
    *p = 7;
    printf("%d\n", *p);`),
          },
          {
            wrong: prog(String.raw`    float f = 1.5;
    int *p = &f;
    printf("%d\n", *p);`),
            why: '`p` is a pointer to an `int` but `f` is a `float`. The types must match. Use `float *p = &f;`.',
            right: prog(String.raw`    float f = 1.5;
    float *p = &f;
    printf("%.1f\n", *p);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a = 1, b = 2;
    int *p = &a;
    p = &b;
    *p = 9;
    printf("%d %d\n", a, b);`),
            why: 'A pointer can be **re-pointed**. After `p = &b;` the pointer leads to `b`, so `*p = 9;` changes b and leaves a alone: this prints `1 9`. If you wanted to change a, do it **before** re-pointing.',
            right: prog(String.raw`    int a = 1, b = 2;
    int *p = &a;
    *p = 9;
    p = &b;
    printf("%d %d\n", a, b);`),
          },
        ],
      },
      { t: 'quiz', question: 'If `p` holds the address of `x`, what does `*p` mean?', options: ['The value stored in x', 'The address of x', 'The address of p', 'The size of x'], answer: 0, explain: '`*p` follows the address in `p` and gives you what is stored there, which is x itself.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 17): the stock counter',
        text: 'The stock of sodas is changed only through a pointer, the way a function will soon do it.',
        code: String.raw`#include <stdio.h>

int main() {
    int stock = 20;
    int *p = &stock;
    printf("Stock: %d\n", *p);
    *p = *p - 5;
    printf("After selling 5: %d\n", stock);
    *p = *p + 12;
    printf("After delivery: %d\n", stock);
    return 0;
}
`,
        output: 'Stock: 20\nAfter selling 5: 15\nAfter delivery: 27',
      },
      {
        t: 'recap',
        items: ['`&x` is the address of x. `int *p = &x;` makes a pointer to x.', '`*p` follows the pointer: it is the variable p points to, to read or to change.', 'The pointer’s type must match the target’s type.', 'Never use `*p` before p holds a real address.'],
        memory: 'And is the address, star is the value.',
      },
    ],
    exercises: [
      {
        id: 'c23-double',
        title: 'Double it through a pointer',
        prompt: 'Read a number `x`. Using the pointer `p`, **double** it without writing `x` on the left of an assignment. Then print `Doubled: 14` (for 7).',
        starter: prog('    int x;\n    int *p = &x;\n    // Read x, then double it using only *p\n'),
        sampleInput: '7',
        usesInput: true,
        tests: [
          { input: '7', expected: 'Doubled: 14' },
          { input: '0', expected: 'Doubled: 0' },
          { input: '-5', expected: 'Doubled: -10', hidden: true },
        ],
        hints: [
          'The pointer `p` already points at `x`, so `*p` is x. You can read x into the pointer with `scanf("%d", p);` (no `&`, because `p` is already an address).',
          'Write `*p = *p * 2;` and print `x` (or `*p`).',
          'A similar example: this lesson’s stock program changes `stock` with `*p = *p - 5;`.',
        ],
      },
      {
        id: 'c23-bigger0',
        title: 'Zero the bigger one',
        prompt: 'Read two numbers `x` and `y`. Make the pointer `big` point at the **larger** one (if they are equal, point at `x`). Then set that variable to 0 **through the pointer** and print both like `5 0`.',
        starter: prog('    int x, y;\n    int *big;\n    // Read x and y, point big at the larger one, set it to 0\n'),
        sampleInput: '5 9',
        usesInput: true,
        tests: [
          { input: '5 9', expected: '5 0' },
          { input: '8 2', expected: '0 2' },
          { input: '4 4', expected: '0 4', name: 'Equal: point at x' },
          { input: '-3 -7', expected: '0 -7', hidden: true },
        ],
        hints: [
          'Use an `if` to choose which address goes into `big`: `big = &x;` or `big = &y;`.',
          'After choosing, `*big = 0;` changes whichever variable it points at. Then print `x` and `y`.',
          'A similar example: the “re-pointing” mistake in this lesson shows `p = &b;` moving a pointer from one variable to another.',
        ],
      },
      {
        id: 'c23-vat',
        title: 'Add the VAT through a pointer',
        prompt: 'Read a price in whole shillings. Using a pointer to it, add **18% VAT** (use whole-number arithmetic: add `price * 18 / 100`). Print `With VAT: 1180` (for 1000).',
        starter: prog('    int price;\n    int *p = &price;\n    // Read the price, then add 18% VAT through p\n'),
        sampleInput: '1000',
        usesInput: true,
        tests: [
          { input: '1000', expected: 'With VAT: 1180' },
          { input: '500', expected: 'With VAT: 590' },
          { input: '250', expected: 'With VAT: 295', hidden: true },
          { input: '100', expected: 'With VAT: 118', hidden: true },
        ],
        hints: [
          'Read the price with `scanf("%d", p);`. The pointer already holds the address.',
          'Then `*p = *p + *p * 18 / 100;`. Multiply first, then divide, so no digits are lost.',
          'A similar example: `*p = *p - 5;` in the project step subtracts from the stock through the pointer.',
        ],
      },
    ],
  },

  // ================================================================== 24
  {
    id: 'c-ptr-fn',
    level: LEVEL,
    minutes: 26,
    title: 'Pointers and functions',
    summary: 'Letting a function change the caller’s variables: swap and functions with several results',
    blocks: [
      {
        t: 'story',
        title: 'The photocopy problem',
        text: 'In lesson 12 you learned that a function gets a **photocopy** of each number. That is why a function called `swap` could not swap the caller’s variables: it swapped its own copies.\n\nBut if you hand the function the **address** of the variable instead of a copy, the function can walk to that address and change the real thing. A pointer parameter is the key to a function that must change its caller’s variables, or give back **more than one answer**.',
      },
      { t: 'p', text: 'First, the problem again. This swap works on copies and fails:' },
      {
        t: 'try',
        code: fn(String.raw`void swap_fail(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}`, String.raw`    int x = 3, y = 8;
    swap_fail(x, y);
    printf("%d %d\n", x, y);`),
        output: '3 8',
      },
      { t: 'p', text: 'Now the real swap. The parameters are `int *a` and `int *b` (addresses). The call passes `&x` and `&y`. Inside, `*a` and `*b` are the caller’s own variables.' },
      {
        t: 'try',
        code: fn(String.raw`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, String.raw`    int x = 3, y = 8;
    swap(&x, &y);
    printf("%d %d\n", x, y);`),
        output: '8 3',
      },
      { t: 'analogy', text: 'Giving a function a number is giving it a photocopy of your form. Giving it a pointer is giving it **your address** along with permission to go inside and rearrange the furniture. Be careful whom you give it to!' },
      {
        t: 'list',
        items: ['In the function’s parameter list, write `int *name`.', 'In the call, send the address: `&variable`.', 'Inside the function, use `*name` to reach the caller’s variable.', 'The function is usually `void`, because the answers come back through the pointers.'],
      },
      {
        t: 'predict',
        code: fn(String.raw`void increase(int *p) {
    *p = *p + 10;
}`, String.raw`    int n = 5;
    increase(&n);
    increase(&n);
    printf("%d\n", n);`),
        question: 'What does this program print?',
        options: ['25', '15', '5', '10'],
        answer: 0,
        explain: 'Each call walks to `n` and adds 10 **to the real variable**: 5, then 15, then 25.',
      },
      { t: 'h', text: 'Many answers from one function' },
      { t: 'p', text: 'A function can `return` only one value. With pointer parameters it can hand back as many results as you like: you give it empty variables to fill.' },
      {
        t: 'try',
        code: fn(String.raw`void min_max(int a, int b, int *small, int *big) {
    if (a < b) {
        *small = a;
        *big = b;
    } else {
        *small = b;
        *big = a;
    }
}`, String.raw`    int lo, hi;
    min_max(7, 3, &lo, &hi);
    printf("Smaller: %d, bigger: %d\n", lo, hi);`),
        output: 'Smaller: 3, bigger: 7',
      },
      { t: 'tip', text: 'You already use this idea every day: `scanf("%d", &x);` works because you pass the **address** of x, so that `scanf` can put the number into your variable. That is why `scanf` needs the `&` and `printf` does not.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so the function receives the **address** of `n`.',
        template: fn(String.raw`void increase(int *p) {
    *p = *p + 10;
}`, String.raw`    int n = 5;
    increase(___n);
    printf("%d\n", n);`),
        blanks: [{ options: ['&', '*', '#'], answer: '&' }],
        output: '15',
      },
      {
        t: 'bug',
        code: fn(String.raw`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, String.raw`    int x = 3, y = 8;
    swap(x, y);
    printf("%d %d\n", x, y);`),
        question: 'This program stops with an error about casting an `int` to a pointer. What is wrong with the call?',
        options: ['The function wants addresses, so call `swap(&x, &y)`', 'The function must be written below main', 'swap must return an int', 'x and y must be floats'],
        answer: 0,
        explain: 'The function’s parameters are pointers, so the call must supply addresses: `&x` and `&y`. Passing the plain numbers does not give the function anything to follow.',
        fixed: fn(String.raw`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, String.raw`    int x = 3, y = 8;
    swap(&x, &y);
    printf("%d %d\n", x, y);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: fn(String.raw`void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}`, String.raw`    int x = 1, y = 2;
    swap(x, y);
    printf("%d %d\n", x, y);`),
            why: 'No stars and no `&`: the function swaps its photocopies and the caller sees nothing, so this prints `1 2`. To change the caller’s variables the parameters must be pointers.',
            right: fn(String.raw`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, String.raw`    int x = 1, y = 2;
    swap(&x, &y);
    printf("%d %d\n", x, y);`),
          },
          {
            wrong: fn(String.raw`void set_five(int n) {
    *n = 5;
}`, String.raw`    int x = 1;
    set_five(x);
    printf("%d\n", x);`),
            why: 'A star in front of something that is not a pointer is meaningless: `n` is just a number. Make the parameter `int *n` and call `set_five(&x)`.',
            right: fn(String.raw`void set_five(int *n) {
    *n = 5;
}`, String.raw`    int x = 1;
    set_five(&x);
    printf("%d\n", x);`),
          },
          {
            wrong: fn(String.raw`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, String.raw`    int x = 1, y = 2;
    swap(&x);
    printf("%d %d\n", x, y);`),
            why: 'The function has **two** parameters but the call gives one address. Every parameter needs its own argument.',
            right: fn(String.raw`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, String.raw`    int x = 1, y = 2;
    swap(&x, &y);
    printf("%d %d\n", x, y);`),
          },
        ],
      },
      { t: 'quiz', question: 'Why does `scanf("%d", &age);` need the `&`?', options: ['scanf needs the address of age so it can store the number there', 'To make the number positive', 'Because age is a float', 'It does not, it is optional'], answer: 0, explain: '`scanf` is a function that must change your variable, so it needs a pointer to it. `&age` is exactly that pointer.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 18): the change maker',
        text: 'One function works out two things at once: how many 1,000 shilling notes fit into an amount, and what is left over. Try 7500 and 12900.',
        stdin: '7500',
        code: String.raw`#include <stdio.h>

void make_change(int amount, int *notes, int *left) {
    *notes = amount / 1000;
    *left = amount % 1000;
}

int main() {
    int amount, notes, left;
    scanf("%d", &amount);
    make_change(amount, &notes, &left);
    printf("Notes of 1000: %d\n", notes);
    printf("Left over: %d\n", left);
    return 0;
}
`,
        output: 'Notes of 1000: 7\nLeft over: 500',
      },
      {
        t: 'recap',
        items: ['To let a function change a caller’s variable: parameter `int *p`, call with `&x`, change with `*p`.', 'A function can give back several results through several pointer parameters.', '`scanf` works the same way, which is why it needs `&`.', 'Forgetting a star or an `&` is the most common pointer mistake.'],
        memory: 'Address out, star in.',
      },
    ],
    exercises: [
      {
        id: 'c24-swap',
        title: 'Swap two numbers',
        prompt: 'Complete the function `swap` so that it swaps the two numbers the caller passes. The program reads `x` and `y` and prints `After: 8 3` (for 3 and 8).',
        starter: fn(String.raw`void swap(int *a, int *b) {
    // swap the two values
}`, String.raw`    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("After: %d %d\n", x, y);`),
        sampleInput: '3 8',
        usesInput: true,
        tests: [
          { input: '3 8', expected: 'After: 8 3' },
          { input: '5 5', expected: 'After: 5 5' },
          { input: '-1 20', expected: 'After: 20 -1', hidden: true },
        ],
        hints: [
          'You need a temporary variable to hold one value while you overwrite it.',
          '`int temp = *a; *a = *b; *b = temp;`',
          'A similar example: the swap function in this lesson is exactly this one. Write it again from memory.',
        ],
      },
      {
        id: 'c24-divmod',
        title: 'Quotient and remainder',
        prompt: 'Complete `divide(a, b, q, r)` so that it stores the quotient `a / b` in `*q` and the remainder `a % b` in `*r`. The program reads two numbers (the second is never 0) and prints two lines: `Quotient: 3` and `Remainder: 1` (for 10 and 3).',
        starter: fn(String.raw`void divide(int a, int b, int *q, int *r) {
    // store the quotient and the remainder
}`, String.raw`    int a, b, q, r;
    scanf("%d %d", &a, &b);
    divide(a, b, &q, &r);
    printf("Quotient: %d\n", q);
    printf("Remainder: %d\n", r);`),
        sampleInput: '10 3',
        usesInput: true,
        tests: [
          { input: '10 3', expected: 'Quotient: 3\nRemainder: 1' },
          { input: '20 5', expected: 'Quotient: 4\nRemainder: 0' },
          { input: '7 10', expected: 'Quotient: 0\nRemainder: 7', hidden: true },
        ],
        hints: [
          'The function has two result parameters, `q` and `r`, both pointers.',
          'Write the quotient through `q` and the remainder through `r`.',
          'A similar example: `make_change` in the project step also stores a division and a remainder through two pointers.',
        ],
      },
      {
        id: 'c24-minmax',
        title: 'Smallest and biggest of three',
        prompt: 'Complete `min_max3(a, b, c, small, big)` so it stores the smallest and the largest of three numbers through its two pointers. The program prints `Smallest: 2` and `Biggest: 9` (for 5 2 9).',
        starter: fn(String.raw`void min_max3(int a, int b, int c, int *small, int *big) {
    // store the smallest in *small and the biggest in *big
}`, String.raw`    int a, b, c, s, g;
    scanf("%d %d %d", &a, &b, &c);
    min_max3(a, b, c, &s, &g);
    printf("Smallest: %d\n", s);
    printf("Biggest: %d\n", g);`),
        sampleInput: '5 2 9',
        usesInput: true,
        tests: [
          { input: '5 2 9', expected: 'Smallest: 2\nBiggest: 9' },
          { input: '1 1 1', expected: 'Smallest: 1\nBiggest: 1' },
          { input: '-4 0 -9', expected: 'Smallest: -9\nBiggest: 0', hidden: true },
        ],
        hints: [
          'Start by assuming `a` is both the smallest and the biggest, then compare with `b` and `c`.',
          'Set `*small = a; *big = a;` first. Then for each of `b` and `c`: if it is smaller than `*small`, replace it; if it is bigger than `*big`, replace it.',
          'A similar example: `min_max` in this lesson does the same for two numbers. Extend it to three.',
        ],
      },
    ],
  },

  // ================================================================== 25
  {
    id: 'c-ptr-arrays',
    level: LEVEL,
    minutes: 30,
    title: 'Pointers, arrays and strings',
    summary: 'Why an array name is an address, pointer arithmetic, walking arrays and strings with pointers',
    blocks: [
      {
        t: 'story',
        title: 'The master key',
        text: 'A row of lockers has a master key that opens the first locker. To reach the third locker, you walk two lockers along from the first. You do not need a separate key for each locker: you need the first one and a **step count**.\n\nThis is how C really stores an array. The **name of an array is the address of its first box**, and `a[2]` is just shorthand for “start at the first box and step two boxes along”. Pointers and arrays are two views of the same thing.',
      },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int a[4] = {10, 20, 30, 40};
    int *p = a;
    printf("%d\n", *p);
    printf("%d\n", *(p + 2));
    printf("%d\n", p[3]);
    return 0;
}
`,
        output: '10\n30\n40',
      },
      {
        t: 'list',
        items: [
          '`int *p = a;` makes `p` point at the **first** box of `a` (no `&` needed, the name already is an address).',
          '`p + 1` is the address of the **next** box, whatever the type. C steps the right number of bytes for you.',
          '`*(p + 2)` is the third box. It means exactly the same as `a[2]`, and you can even write `p[2]`.',
          '`p++` moves the pointer to the next box.',
        ],
      },
      { t: 'analogy', text: 'The pointer is a finger. `p + 1` is “one box further to the right”, and `*` means “look at what is in the box under the finger”. `p++` slides the finger along the row.' },
      {
        t: 'predict',
        code: prog(String.raw`    int a[3] = {5, 6, 7};
    int *p = a;
    p++;
    printf("%d\n", *p + *(p + 1));`),
        question: 'What does this program print?',
        options: ['13', '11', '12', '18'],
        answer: 0,
        explain: 'After `p++` the pointer is on the second box (6). `*(p + 1)` is the box after that (7). So the sum is 6 + 7 = 13.',
      },
      { t: 'h', text: 'Walking an array with a pointer' },
      { t: 'p', text: 'You can visit every box by moving a pointer until it reaches the address just **past** the last box. Keep the end address in its own pointer variable and compare with `!=`.' },
      {
        t: 'try',
        code: String.raw`#include <stdio.h>

int main() {
    int a[4] = {10, 20, 30, 40};
    int *p = a;
    int *end = a + 4;
    int total = 0;
    while (p != end) {
        total = total + *p;
        p++;
    }
    printf("Total: %d\n", total);
    return 0;
}
`,
        output: 'Total: 100',
      },
      { t: 'h', text: 'Strings and pointers' },
      { t: 'p', text: 'A string is an array of characters ending in `\'\\0\'`, so a `char *` can walk along it. Here is `strlen` written by hand. The function receives `char *s`, the address of the first letter.' },
      {
        t: 'try',
        stdin: 'Entebbe',
        code: String.raw`#include <stdio.h>

int my_strlen(char *s) {
    int n = 0;
    while (*s != '\0') {
        n++;
        s++;
    }
    return n;
}

int main() {
    char word[30];
    scanf("%s", word);
    printf("Length: %d\n", my_strlen(word));
    return 0;
}
`,
        output: 'Length: 7',
      },
      { t: 'p', text: 'Because the function holds the address of the real letters, it can also change them. This one turns a word into capitals:' },
      {
        t: 'try',
        stdin: 'jinja',
        code: String.raw`#include <stdio.h>
#include <ctype.h>

void shout(char *s) {
    while (*s != '\0') {
        *s = toupper(*s);
        s++;
    }
}

int main() {
    char word[30];
    scanf("%s", word);
    shout(word);
    printf("%s\n", word);
    return 0;
}
`,
        output: 'JINJA',
      },
      { t: 'tip', text: 'Writing `char *s = "Kampala";` is allowed and is a common way to hold fixed text, but you must **never change** the letters of such a literal (real programs crash when they try). If you need text you can edit, use a `char` array: `char s[] = "Kampala";`.' },
      {
        t: 'fill',
        prompt: 'Fill the gap with the number that reaches the **third** box (the value 6) from the start.',
        template: prog(String.raw`    int a[3] = {4, 5, 6};
    int *p = a;
    printf("%d\n", *(p + ___));`),
        blanks: [{ options: ['2', '3', '1'], answer: '2' }],
        output: '6',
      },
      {
        t: 'bug',
        code: prog(String.raw`    int a[3] = {4, 5, 6};
    int *p = a;
    printf("%d\n", *(p + 5));`),
        question: 'This program stops with “index out of bound”. What is wrong?',
        options: ['`p + 5` steps far past the end of a 3-box array', 'p must point at the last box first', 'printf cannot print through a pointer', 'The array must hold five numbers'],
        answer: 0,
        explain: 'The valid steps from the start of a 3-box array are 0, 1 and 2. Going outside is as wrong with pointers as with an index. Real C does not warn you: it reads whatever memory is there.',
        fixed: prog(String.raw`    int a[3] = {4, 5, 6};
    int *p = a;
    printf("%d\n", *(p + 2));`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: prog(String.raw`    int a[2] = {5, 6};
    int *p = a;
    *p++;
    printf("%d\n", a[0]);`),
            why: 'The `++` binds to the **pointer**, not to the value. `*p++` moves the pointer to the next box and leaves the 5 alone, so this prints 5. To add 1 to the value, use brackets: `(*p)++`.',
            right: prog(String.raw`    int a[2] = {5, 6};
    int *p = a;
    (*p)++;
    printf("%d\n", a[0]);`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[2] = {1, 2};
    int *b = a;
    b[0] = 99;
    printf("%d\n", a[0]);`),
            why: '`int *b = a;` does **not** copy the array. It makes `b` another name for the same boxes, so changing `b[0]` changes `a[0]` as well (99, not 1). To make a real copy you need a second array and a loop.',
            right: prog(String.raw`    int a[2] = {1, 2};
    int b[2];
    int i;
    for (i = 0; i < 2; i++) {
        b[i] = a[i];
    }
    b[0] = 99;
    printf("%d\n", a[0]);`),
          },
          {
            wrong: prog(String.raw`    int a[3] = {1, 2, 3};
    int *p = a;
    int *end = a + 3;
    int total = 0;
    while (p != end) {
        total = total + *p;
        p++;
    }
    p--;
    p--;
    p--;
    p--;
    printf("%d %d\n", total, *p);`),
            why: 'The pointer was stepped back one box **before** the start of the array, where no box exists. Make sure a pointer always stays between the first box and one past the last, and only dereference it (`*p`) when it is on a real box.',
            right: prog(String.raw`    int a[3] = {1, 2, 3};
    int *p = a;
    int *end = a + 3;
    int total = 0;
    while (p != end) {
        total = total + *p;
        p++;
    }
    p--;
    printf("%d %d\n", total, *p);`),
          },
        ],
      },
      { t: 'quiz', question: 'Which expression means exactly the same as `a[i]`?', options: ['*(a + i)', '*a + i', '&a[i]', 'a + i'], answer: 0, explain: '`a[i]` is defined as `*(a + i)`: start at the first box, step i boxes along, and look inside. (`a + i` alone is the **address** of that box.)' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 19): the sale price list',
        text: 'The duuka puts everything on sale. A function walks along the price array with a pointer and takes 10% off each price. The function changes the real prices.',
        code: String.raw`#include <stdio.h>

void discount(int *prices, int n, int percent) {
    int *end = prices + n;
    while (prices != end) {
        *prices = *prices - *prices * percent / 100;
        prices++;
    }
}

int main() {
    int prices[4] = {2500, 1000, 500, 4000};
    int i;
    discount(prices, 4, 10);
    for (i = 0; i < 4; i++) {
        printf("%d\n", prices[i]);
    }
    return 0;
}
`,
        output: '2250\n900\n450\n3600',
      },
      {
        t: 'recap',
        items: ['An array name is the address of its first box. `a[i]` means `*(a + i)`.', '`p + 1` is the next box, `p++` moves the pointer on, `*p` is the box it is on.', 'To walk an array, keep an `end` pointer and loop `while (p != end)`.', '`int *b = a;` shares the boxes, it does not copy them. Never step outside the array.'],
        memory: 'The array name is the address of the first box.',
      },
    ],
    exercises: [
      {
        id: 'c25-sumptr',
        title: 'Sum with a pointer',
        prompt: 'The first number is how many numbers follow. Read them into the array, then add them up by **walking a pointer** along the array. Print `Total: 100`.',
        starter: prog('    int a[50];\n    int n, i, total = 0;\n    int *p = a;\n    // Read n numbers into a, then add them up using the pointer p\n'),
        sampleInput: '4 10 20 30 40',
        usesInput: true,
        tests: [
          { input: '4 10 20 30 40', expected: 'Total: 100' },
          { input: '1 7', expected: 'Total: 7' },
          { input: '3 -5 5 9', expected: 'Total: 9', hidden: true },
        ],
        hints: [
          'Read with a normal loop `scanf("%d", &a[i]);`. Then make the pointer visit the boxes.',
          'Set `int *end = a + n;` then `while (p != end) { total = total + *p; p++; }`.',
          'A similar example: the walking program in this lesson totals a fixed array exactly like this.',
        ],
      },
      {
        id: 'c25-strlen',
        title: 'Your own strlen',
        prompt: 'Complete `my_strlen(s)` so that it returns the number of characters in the string, by walking a pointer until the ending zero. The program reads a word and prints `Length: 7` (for Entebbe).',
        starter: fn(String.raw`int my_strlen(char *s) {
    // count the characters
}`, String.raw`    char word[50];
    scanf("%s", word);
    printf("Length: %d\n", my_strlen(word));`),
        sampleInput: 'Entebbe',
        usesInput: true,
        tests: [
          { input: 'Entebbe', expected: 'Length: 7' },
          { input: 'a', expected: 'Length: 1' },
          { input: 'Mukono', expected: 'Length: 6', hidden: true },
        ],
        hints: [
          'Keep a counter. Move `s` along the string until `*s` is the ending character `\'\\0\'`.',
          '`while (*s != \'\\0\') { n++; s++; }` then `return n;`.',
          'A similar example: `my_strlen` in this lesson. Write it again without looking.',
        ],
      },
      {
        id: 'c25-flip',
        title: 'Reverse in place with two pointers',
        prompt: 'The first number is how many numbers follow. Read them into an array and **reverse the array itself** using two pointers: one at the first box, one at the last. Swap the values they point at, then move them towards each other until they meet. Print the array one number per line.',
        starter: prog('    int a[50];\n    int n, i, temp;\n    int *left, *right;\n    // Read the numbers, reverse them in place, print them\n'),
        sampleInput: '4 10 20 30 40',
        usesInput: true,
        tests: [
          { input: '4 10 20 30 40', expected: '40\n30\n20\n10' },
          { input: '1 7', expected: '7' },
          { input: '5 1 2 3 4 5', expected: '5\n4\n3\n2\n1', hidden: true },
          { input: '2 8 9', expected: '9\n8', hidden: true },
        ],
        hints: [
          'Start `left = a;` and `right = a + n - 1;`. Repeat while `left < right`.',
          'Inside the loop swap `*left` and `*right` with `temp`, then do `left++;` and `right--;`.',
          'A similar example: lesson 17 swapped two boxes with a temporary variable. Here the boxes are reached through pointers.',
        ],
      },
      {
        id: 'c25-copy',
        title: 'Copy a string',
        prompt: 'Complete `copy(dest, src)` so it copies the text from `src` into `dest`, character by character, including the ending zero. Do not use `strcpy`. The program reads a word and prints `Copy: Jinja`.',
        starter: fn(String.raw`void copy(char *dest, char *src) {
    // copy every character and then the ending zero
}`, String.raw`    char a[50], b[50];
    scanf("%s", a);
    copy(b, a);
    printf("Copy: %s\n", b);`),
        sampleInput: 'Jinja',
        usesInput: true,
        tests: [
          { input: 'Jinja', expected: 'Copy: Jinja' },
          { input: 'a', expected: 'Copy: a' },
          { input: 'Entebbe', expected: 'Copy: Entebbe', hidden: true },
        ],
        hints: [
          'Walk both pointers together. At each step copy the letter under `src` to the place under `dest`.',
          '`while (*src != \'\\0\') { *dest = *src; dest++; src++; }`',
          'Do not forget the ending zero: after the loop write `*dest = \'\\0\';`, or the copy will not be a proper string.',
        ],
      },
    ],
  },
];
