// C++, Level 5: Pointers. Lesson 18, the last lesson of Part A.
//
// Practice-runner limits that shape this lesson (see docs/CPP-TRACK.md):
//  * a pointer cannot be printed (cout << p fails) and null pointers do not run (no nullptr, NULL, p == 0)
//  * pointers to pointers (int **) crash the interpreter
//  * *p++ without brackets is not understood; (*p)++ is
//  * there is no std::swap and no references, so the lesson writes its own exchange function
import { prog, progFn } from './shared.js';

const LEVEL = 'Level 5: Pointers';

export const pointerLessons = [
  // ================================================================== 18
  {
    id: 'cpp-pointers',
    level: LEVEL,
    minutes: 32,
    title: 'Pointers: variables that hold addresses',
    summary: 'The address-of operator, dereferencing, pointers as function parameters, pointers and arrays',
    blocks: [
      {
        t: 'story',
        title: 'The cash tin at kiosk 7',
        text: 'Mama Rose keeps the day’s cash in a tin, and the tin sits in the drawer of **kiosk number 7**. Her cousin Peter must add the tips to the tin. Mama Rose does not hand Peter a **copy** of the tin, because money put in a copy would not reach the real one. She writes a note: “**The tin is at kiosk 7.**” Peter follows the note, opens the drawer, and puts the money in the **real tin**.\n\nThat note is exactly what a **pointer** is. The tin is a variable. Kiosk 7 is its **address**. The note holding the address is the pointer. Anyone who has the note can go to the address and change the real thing.',
      },
      { t: 'p', text: 'Every variable lives somewhere in the computer’s memory, and that place has an **address**. A **pointer** is a variable whose value is the address of another variable. Press **Run** and follow the three steps: make a tin, make a note that points to it, change the tin **through the note**.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int stock = 20;
    int *p = &stock;
    cout << "stock: " << stock << endl;
    cout << "via p: " << *p << endl;
    *p = 15;
    cout << "stock now: " << stock << endl;
    return 0;
}
`,
        output: 'stock: 20\nvia p: 20\nstock now: 15',
      },
      {
        t: 'list',
        items: [
          '`int *p` declares a **pointer to an int**: a note that can hold the address of an `int` variable.',
          '`&stock` means “**the address of** `stock`”. The `&` (ampersand) turns a variable into its address. So `int *p = &stock;` writes the address of `stock` on the note.',
          '`*p` means “**go to the address in `p` and use what is there**”. This is called **dereferencing**. You can read it (`cout << *p`) or change it (`*p = 15;`).',
          'The star has two jobs: in `int *p` it says “this is a pointer”, and in `*p = 15` it says “go to the address”.',
        ],
      },
      { t: 'analogy', text: 'Think of **`&`** as “read me the plot number of this house” and **`*`** as “now go to that plot number and walk in”. The pointer itself is only the piece of paper with the plot number. Changing what is written on the paper moves the pointer to another house, while changing what is **inside** the house is done with `*`.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a = 1;
    int b = 2;
    int *p = &a;
    *p = *p + b;
    p = &b;
    *p = 10;
    cout << a << " " << b << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['3 10', '1 10', '3 2', '10 2'],
        answer: 0,
        explain: 'First `p` points at `a`, so `*p = *p + b` makes `a` equal to 1 + 2 = 3. Then `p = &b` moves the note to point at `b` (this changes the pointer, not `a`). The last line, `*p = 10`, now changes `b` to 10. So `a` is 3 and `b` is 10.',
      },
      { t: 'h', text: 'Pointers let a function change the caller’s variable' },
      { t: 'p', text: 'In lesson 11 you learned that a function receives a **copy** of its arguments, so it cannot change your variables. A pointer fixes that. If you hand the function the **address**, it can visit the real variable. Pass the address with `&`, and use `*` inside the function.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void addTip(int *total) {
    *total = *total + 500;
}

int main() {
    int bill = 3000;
    addTip(&bill);
    cout << "Bill: " << bill << endl;
    return 0;
}
`,
        output: 'Bill: 3500',
      },
      { t: 'p', text: 'The classic example is **swapping** two values. A function that received copies could never swap the originals, but with pointers it can.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void exchange(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main() {
    int a = 3, b = 8;
    exchange(&a, &b);
    cout << "a = " << a << ", b = " << b << endl;
    return 0;
}
`,
        output: 'a = 8, b = 3',
      },
      { t: 'tip', text: 'Real C++ has two tidier tools for this job: **references** (`int &total`) and a ready-made `swap`. You will meet them in Part B. The practice runner in this app cannot run them yet, which is why we write `exchange` ourselves. Pointers are still worth knowing well: they are everywhere in real C++ code.' },
      { t: 'h', text: 'Getting more than one answer out of a function' },
      { t: 'p', text: 'A function can `return` only **one** value. Pointers give it extra “outlets”: the caller passes the addresses of its own variables, and the function fills them in. Here one function finds the smallest **and** the biggest value of an array.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void minMax(int a[], int n, int *lowest, int *highest) {
    *lowest = a[0];
    *highest = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *lowest) {
            *lowest = a[i];
        }
        if (a[i] > *highest) {
            *highest = a[i];
        }
    }
}

int main() {
    int sales[4] = {4, 9, 2, 7};
    int low, high;
    minMax(sales, 4, &low, &high);
    cout << "Min: " << low << endl;
    cout << "Max: " << high << endl;
    return 0;
}
`,
        output: 'Min: 2\nMax: 9',
      },
      { t: 'h', text: 'Pointers and arrays' },
      { t: 'p', text: 'The name of an array is really the **address of its first box**. So you can store it in a pointer. Adding 1 to a pointer moves it to the **next box**, however big the box is. That gives a second way to write `a[i]`: `*(p + i)`.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[4] = {10, 20, 30, 40};
    int *p = a;
    for (int i = 0; i < 4; i++) {
        cout << *(p + i) << " ";
    }
    cout << endl;
    cout << a[2] << " " << *(a + 2) << " " << p[2] << endl;
    return 0;
}
`,
        output: '10 20 30 40\n30 30 30',
      },
      { t: 'analogy', text: 'A row of lockers numbered from 0. The pointer is your finger on one locker. `p + 1` slides your finger to the **next** locker, `p + 2` two lockers on. And `p++` moves your finger one locker along for good.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[3] = {5, 6, 7};
    int *p = a;
    p++;
    cout << *p << " " << *(p + 1) << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['6 7', '5 6', '6 6', '7 7'],
        answer: 0,
        explain: '`p` first points at the box holding 5. After `p++` it points at the box holding 6, so `*p` is 6. And `*(p + 1)` is the next box after that: 7.',
      },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int sum(int *a, int n) {
    int total = 0;
    int *p = a;
    for (int i = 0; i < n; i++) {
        total += *p;
        p++;
    }
    return total;
}

int main() {
    int sales[4] = {1, 2, 3, 4};
    cout << "Sum: " << sum(sales, 4) << endl;
    return 0;
}
`,
        output: 'Sum: 10',
      },
      { t: 'p', text: 'This is the secret behind lesson 15: when you passed `int a[]` to a function, the function really received an **address**, a pointer to the first box. That is why it worked on the real array and not on a copy.' },
      { t: 'h', text: 'Safety rules for pointers' },
      {
        t: 'list',
        items: [
          '**Give a pointer an address before you use it with `*`.** A pointer with no address points to a random place.',
          '**Stay inside the array.** `p + 5` on a 3-box array walks off the end. In this app that stops the program. In real C++ it silently reads or damages other memory.',
          '**Match the types.** An `int *` points to an `int`, a `double *` to a `double`.',
        ],
      },
      { t: 'tip', text: 'Real C++ also has a special **null pointer** value, `nullptr`, which means “points at nothing”, and good programs check for it before using a pointer. The practice runner in this app cannot run `nullptr`, and it cannot print an address either, so no program in this lesson uses them. Remember the idea, because you will need it in real projects.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so that p holds the address of x. The program must print 5.',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int x = 5;
    int *p = ___x;
    cout << *p << endl;
    return 0;
}
`,
        blanks: [{ options: ['&', '*', '#'], answer: '&' }],
        output: '5',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int *p;
    *p = 10;
    cout << "done" << endl;
    return 0;
}
`,
        question: 'This program stops with an error. Why?',
        options: ['p was never given an address, so *p points to nowhere in particular', 'A pointer cannot hold the number 10', 'cout cannot be used with pointers', 'The star must go after the p'],
        answer: 0,
        explain: '`int *p;` makes a note with **nothing written on it**. Then `*p = 10;` goes to “the address on the note” and writes there. This app stops you. A real C++ program would write 10 to a random place in memory, which can crash the program or damage something else. Always point `p` at a real variable first.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int x = 0;
    int *p = &x;
    *p = 10;
    cout << x << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int x = 5;
    int *p = x;
    cout << *p << endl;`),
            why: 'A pointer holds an **address**, not a number. `x` is the number 5, but `&x` is where x lives. Write `int *p = &x;`.',
            right: prog(String.raw`    int x = 5;
    int *p = &x;
    cout << *p << endl;`),
          },
          {
            wrong: prog(String.raw`    int x = 5;
    int *p = &x;
    p = 10;
    cout << x << endl;`),
            why: '`p = 10;` tries to put the number 10 on the **note** (the address). To change the value **at** the address, use the star: `*p = 10;`.',
            right: prog(String.raw`    int x = 5;
    int *p = &x;
    *p = 10;
    cout << x << endl;`),
          },
          {
            wrong: progFn(String.raw`void exchange(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}`, String.raw`    int a = 3, b = 8;
    exchange(a, b);
    cout << a << " " << b << endl;`),
            why: 'The function expects two **addresses**, but the call gave it two numbers. Pass the addresses with `&`: `exchange(&a, &b);`.',
            right: progFn(String.raw`void exchange(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}`, String.raw`    int a = 3, b = 8;
    exchange(&a, &b);
    cout << a << " " << b << endl;`),
          },
          {
            wrong: prog(String.raw`    int a[3] = {1, 2, 3};
    int *p = a;
    cout << *(p + 5) << endl;`),
            why: 'The array has boxes 0, 1 and 2. `p + 5` is five boxes along, far past the end. The app stops this. A real program would happily read whatever happens to be in that memory.',
            right: prog(String.raw`    int a[3] = {1, 2, 3};
    int *p = a;
    cout << *(p + 2) << endl;`),
          },
          {
            logic: true,
            wrong: progFn(String.raw`void exchange(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}`, String.raw`    int a = 3, b = 8;
    exchange(a, b);
    cout << a << " " << b << endl;`),
            why: 'This runs without any error, but it prints `3 8`: nothing was swapped. The function swapped its own **copies**. To change the originals the function needs their addresses: `int *x, int *y`.',
            right: progFn(String.raw`void exchange(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}`, String.raw`    int a = 3, b = 8;
    exchange(&a, &b);
    cout << a << " " << b << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'What does `&x` give you?', options: ['The address of x', 'The value of x', 'A copy of x', 'The size of x'], answer: 0, explain: '`&` is the “address of” operator. `&x` is the place in memory where `x` lives, the number on the note.' },
      { t: 'quiz', question: 'After `int *p = &x;`, what does `*p = 7;` do?', options: ['Changes x to 7', 'Changes p to 7', 'Makes a new variable called 7', 'Prints 7'], answer: 0, explain: '`*p` means “the variable at the address in p”, which is `x`. So `*p = 7;` is the same as `x = 7;`.' },
      { t: 'tip', text: '**You have finished Part A of C++ from Zero.** You can write complete programs with input and output, decisions, loops, functions, recursion, arrays, tables, text and pointers. These are the foundations that everything else in C++ is built on. Part B (strings, vectors, references, classes, templates and the standard library) needs a real C++ compiler, which this app does not have yet.' },
      {
        t: 'recap',
        items: [
          'Every variable has an **address**. `&x` gives it. A pointer is a variable that holds an address: `int *p = &x;`.',
          '`*p` goes to the address and uses the value there: read it or change it (`*p = 7;`).',
          'Pass `&variable` to a function with pointer parameters, and the function can change the real variable.',
          'An array’s name is the address of its first box. `p + 1` is the next box, and `*(p + i)` is the same as `p[i]`.',
          'Give a pointer an address before you use it, stay inside the array, and match the types.',
        ],
        memory: '& is the address, * is the visit.',
      },
    ],
    exercises: [
      {
        id: 'cpp18-swap',
        title: 'Swap two numbers',
        prompt: 'Write `void exchange(int *x, int *y)` that swaps the two numbers it points to. In `main`, read two numbers, print them, swap them with your function, and print them again:\n\n`Before: 3 8`\n`After: 8 3`',
        starter: progFn(String.raw`// Write the function exchange here, above main
`, String.raw`    // Read a and b, print Before:, call exchange(&a, &b), print After:`),
        tests: [
          { input: '3 8', expected: 'Before: 3 8\nAfter: 8 3' },
          { input: '5 5', expected: 'Before: 5 5\nAfter: 5 5' },
          { input: '-2 9', expected: 'Before: -2 9\nAfter: 9 -2', hidden: true },
          { input: '0 100', expected: 'Before: 0 100\nAfter: 100 0', hidden: true },
        ],
        hints: [
          'The function takes two **pointers**: `int *x, int *y`. Inside it, `*x` and `*y` are the real numbers.',
          'Use a temporary variable: `int temp = *x;` then `*x = *y;` then `*y = temp;`.',
          'In `main`, send the addresses: `exchange(&a, &b);`. Print `Before` first, because the call changes `a` and `b`.',
        ],
      },
      {
        id: 'cpp18-tax',
        title: 'Add VAT to the price',
        prompt: 'Write `void addVat(int *price)` that changes the price it points to by adding 18 percent VAT: the new price is `price * 118 / 100`. In `main`, read a price, call the function, and print: `Price with VAT: 5900` (for a price of 5000).',
        starter: progFn(String.raw`// Write the function addVat here, above main
`, String.raw`    // Read price, call addVat(&price), print Price with VAT: ...`),
        tests: [
          { input: '5000', expected: 'Price with VAT: 5900' },
          { input: '1000', expected: 'Price with VAT: 1180' },
          { input: '12500', expected: 'Price with VAT: 14750', hidden: true },
          { input: '0', expected: 'Price with VAT: 0', hidden: true },
        ],
        hints: [
          'The parameter is a pointer: `int *price`. Inside the function the real price is `*price`.',
          'Write `*price = *price * 118 / 100;` so that the original variable in `main` changes.',
          'In `main`, call `addVat(&price);` and then print `price`. The function itself prints nothing and returns nothing.',
        ],
      },
      {
        id: 'cpp18-minmax',
        title: 'Two answers from one function',
        prompt: 'Read **n** (at most 10) and then **n** numbers. Write `void minMax(int a[], int n, int *lowest, int *highest)` that finds the smallest and the biggest number and stores them through the two pointers. Print:\n\n`Min: 2`\n`Max: 9`',
        starter: progFn(String.raw`// Write the function minMax here, above main
`, String.raw`    // Read n and the numbers, call minMax, print Min: and Max:`),
        tests: [
          { input: '4 4 9 2 7', expected: 'Min: 2\nMax: 9' },
          { input: '1 5', expected: 'Min: 5\nMax: 5' },
          { input: '3 -1 -5 -3', expected: 'Min: -5\nMax: -1', hidden: true },
          { input: '2 8 8', expected: 'Min: 8\nMax: 8', hidden: true },
        ],
        hints: [
          'Start both answers with the first number: `*lowest = a[0]; *highest = a[0];`. Then loop from index 1.',
          'Inside the loop compare with the stored answers: `if (a[i] < *lowest) { *lowest = a[i]; }` and the same for the highest.',
          'In `main`, make two plain `int` variables and call `minMax(a, n, &low, &high);`, then print them.',
        ],
      },
      {
        id: 'cpp18-reverse',
        title: 'Reverse with two pointers',
        prompt: 'Read **n** (at most 10) and then **n** numbers. Reverse the array **in place** using two pointers, one starting at the first box and one at the last. Move them towards each other, swapping the values they point to, until they meet. Print the reversed numbers separated by spaces. For `5` then `1 2 3 4 5` print: `5 4 3 2 1`',
        starter: progFn(String.raw`// You may write an exchange(int *x, int *y) function here
`, String.raw`    // Read n and the numbers, reverse them with two pointers, print them`),
        tests: [
          { input: '5 1 2 3 4 5', expected: '5 4 3 2 1' },
          { input: '4 9 8 7 6', expected: '6 7 8 9' },
          { input: '1 7', expected: '7', hidden: true },
          { input: '2 3 4', expected: '4 3', hidden: true },
          { input: '6 1 1 2 2 3 3', expected: '3 3 2 2 1 1', hidden: true },
        ],
        hints: [
          'Make two pointers: `int *left = a;` points at the first box and `int *right = a + n - 1;` points at the last.',
          'Loop `while (left < right)`: swap the two values (`exchange(left, right);`), then `left++;` and `right--;`.',
          'The loop ends when the pointers meet or cross. Then print the array normally with a `for` loop.',
        ],
      },
    ],
  },
];
