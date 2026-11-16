// C, Part 2, Level 2: Memory you control. Lessons 6 to 10 (malloc and free, calloc and realloc, linked lists,
// list operations, strings and tables in dynamic memory). Runs on picoc (WebAssembly).
// Limits worth knowing (docs/CX-TRACK.md): write `p = a + 1; p->x`, not `(a + 1)->x`; no function pointers.
import { inc } from '../c/shared.js';

const LEVEL = 'Level 2: Memory you control';
const IO = inc('stdio');
const MEM = inc('stdio', 'stdlib');
const MEMSTR = inc('stdio', 'stdlib', 'string');

/** A whole program: `top` (structs, functions) above main, `body` inside main. */
const P = (top, body, incl = MEM) => `${incl}\n\n${top ? top + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

const NODE = String.raw`typedef struct Node {
    int value;
    struct Node *next;
} Node;`;

const PUSH = String.raw`Node *add_front(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    n->value = value;
    n->next = head;
    return n;
}`;

const PRINT = String.raw`void print_list(Node *head) {
    Node *p;
    for (p = head; p != NULL; p = p->next) {
        printf("%d ", p->value);
    }
    printf("\n");
}`;

const FREEALL = String.raw`void free_list(Node *head) {
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}`;

export const memoryLessons = [
  // ================================================================== 6
  {
    id: 'cx-malloc',
    level: LEVEL,
    minutes: 30,
    title: 'Dynamic memory: malloc and free',
    summary: 'Ask for exactly the memory you need while the program runs, and give it back',
    blocks: [
      {
        t: 'story',
        title: 'Booking the hall',
        text: 'Kato is organising a graduation party. He does not know how many guests will come, and he must book the hall **today**. If he books for 20 and 80 turn up, people stand outside. If he books for 500 and 20 come, he has wasted money.\n\nUp to now every array in your programs had a size fixed **when you wrote the program**. `int marks[30];` means 30, always. But often the right size is only known **while the program runs**: after the user types how many students there are. C’s answer is **dynamic memory**: ask the computer for exactly the space you need, use it, and **hand it back** when you are done.',
      },
      { t: 'h', text: 'malloc: ask for memory' },
      { t: 'p', text: '`malloc(bytes)` (from `stdlib.h`) reserves that many bytes and gives you the **address** of the block. Store the address in a pointer. To ask for room for `n` ints, multiply: `n * sizeof(int)`. After that you use the pointer exactly like an array.' },
      {
        t: 'try',
        code: P('', String.raw`    int n = 5;
    int i;
    int *a = (int *)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) {
        a[i] = i * i;
    }
    for (i = 0; i < n; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");
    free(a);`),
        output: '0 1 4 9 16',
      },
      { t: 'p', text: '`free(a)` gives the block back so that other parts of the program (or other programs) can use it. **Every `malloc` must have a matching `free`.** A program that forgets has a **memory leak**: it holds more and more memory until it slows down or is stopped. On a phone with little memory this matters a lot.' },
      { t: 'analogy', text: 'malloc is **renting** a locker, free is **returning the key**. The address is the locker number. If you lose the number before returning the key, nobody else can ever use that locker.' },
      { t: 'h', text: 'Always check the answer' },
      { t: 'p', text: 'If there is no memory left, `malloc` returns `NULL` (the “nothing” address). A careful program checks before using the block.' },
      {
        t: 'try',
        code: P('', String.raw`    int *a = (int *)malloc(3 * sizeof(int));
    if (a == NULL) {
        printf("Out of memory\n");
        return 1;
    }
    a[0] = 10;
    a[1] = 20;
    a[2] = 30;
    printf("%d\n", a[0] + a[1] + a[2]);
    free(a);`),
        output: '60',
      },
      { t: 'h', text: 'Memory for one struct' },
      { t: 'p', text: 'You can also ask for room for one struct, or many. Since you hold a **pointer** to the card, use the arrow to reach its members (lesson 3).' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item *p = (Item *)malloc(sizeof(Item));
    strcpy(p->name, "Sugar");
    p->price = 5000;
    printf("%s costs %d\n", p->name, p->price);
    free(p);`, MEMSTR),
        output: 'Sugar costs 5000',
      },
      { t: 'tip', text: 'Write `sizeof(Item)` or `sizeof(int)` instead of a number like 24 or 4. The compiler knows the real size on every machine, and the code keeps working when you add a member to the struct.' },
      {
        t: 'predict',
        code: P('', String.raw`    int *a = (int *)malloc(4 * sizeof(int));
    int i, total = 0;
    for (i = 0; i < 4; i++) {
        a[i] = i + 1;
    }
    for (i = 0; i < 4; i++) {
        total = total + a[i];
    }
    printf("%d\n", total);
    free(a);`),
        question: 'What does this program print?',
        options: ['10', '4', '6', '1234'],
        answer: 0,
        explain: 'The four boxes hold 1, 2, 3 and 4. Their total is 1 + 2 + 3 + 4 = 10.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that **reserves** memory.',
        template: P('', String.raw`    int *a = (int *)___(3 * sizeof(int));
    a[0] = 7;
    printf("%d\n", a[0]);
    free(a);`),
        blanks: [{ options: ['malloc', 'free', 'strcpy'], answer: 'malloc' }],
        output: '7',
      },
      {
        t: 'bug',
        code: P('', String.raw`    int *a;
    *a = 5;
    printf("%d\n", *a);`),
        question: 'The program stops with an error about a NULL pointer. What is wrong?',
        options: ['`a` was never given a block of memory: call `malloc` first', 'The array needs a size inside the brackets', 'printf cannot print a pointer', 'free must come first'],
        answer: 0,
        explain: 'A pointer is only an address. `int *a;` makes the pointer but it points nowhere, so `*a` has no box to use. Give it memory first: `a = (int *)malloc(sizeof(int));`.',
        fixed: P('', String.raw`    int *a = (int *)malloc(sizeof(int));
    a[0] = 5;
    printf("%d\n", a[0]);
    free(a);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: String.raw`#include <stdio.h>

int main() {
    int *a = (int *)malloc(3 * sizeof(int));
    a[0] = 1;
    printf("%d\n", a[0]);
    free(a);
    return 0;
}
`,
            why: '`malloc` and `free` live in `stdlib.h`, and the program did not include it, so it does not know them. Add `#include <stdlib.h>` at the top.',
            right: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int *a = (int *)malloc(3 * sizeof(int));
    a[0] = 1;
    printf("%d\n", a[0]);
    free(a);
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: P('', String.raw`    int n = 100;
    int *a = (int *)malloc(n);
    a[99] = 1;
    printf("%d\n", a[99]);
    free(a);`),
            why: '`malloc(n)` asks for `n` **bytes**, not `n` ints. An int is 4 bytes, so this block is four times too small and writing `a[99]` goes **past its end**, damaging other memory (real C does not warn you). Multiply: `malloc(n * sizeof(int))`.',
            right: P('', String.raw`    int n = 100;
    int *a = (int *)malloc(n * sizeof(int));
    a[99] = 1;
    printf("%d\n", a[99]);
    free(a);`),
          },
          {
            logic: true,
            wrong: P('', String.raw`    int i;
    for (i = 0; i < 1000; i++) {
        int *p = (int *)malloc(1000 * sizeof(int));
        p[0] = i;
    }
    printf("done\n");`),
            why: 'Each turn of the loop reserves 4,000 bytes and never returns them, and the pointer `p` is lost at the end of the turn. This is a **memory leak**: 4 million bytes are held and nobody can use them. Call `free(p);` before the end of the loop body.',
            right: P('', String.raw`    int i;
    for (i = 0; i < 1000; i++) {
        int *p = (int *)malloc(1000 * sizeof(int));
        p[0] = i;
        free(p);
    }
    printf("done\n");`),
          },
        ],
      },
      { t: 'quiz', question: 'What does `malloc` return when there is not enough memory?', options: ['NULL', '0 bytes', 'The old block', 'It crashes at once'], answer: 0, explain: '`malloc` returns `NULL`, and the program should check for it before using the pointer.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 6): the price list of any size',
        text: 'The first number is how many prices follow. The program reserves **exactly** that much memory, reads the prices and prints the total, the highest price and the average. Try `4` then `5000 1500 800 2500`, then a different list.',
        stdin: '4\n5000 1500 800 2500',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i, total = 0, highest;
    int *price;
    scanf("%d", &n);
    price = (int *)malloc(n * sizeof(int));
    if (price == NULL) {
        printf("Out of memory\n");
        return 1;
    }
    for (i = 0; i < n; i++) {
        scanf("%d", &price[i]);
        total = total + price[i];
    }
    highest = price[0];
    for (i = 1; i < n; i++) {
        if (price[i] > highest) {
            highest = price[i];
        }
    }
    printf("Total: %d\n", total);
    printf("Highest: %d\n", highest);
    printf("Average: %.1f\n", (double)total / n);
    free(price);
    return 0;
}
`,
        output: 'Total: 9800\nHighest: 5000\nAverage: 2450.0',
      },
      {
        t: 'recap',
        items: ['`#include <stdlib.h>` for `malloc` and `free`.', '`p = (int *)malloc(n * sizeof(int));` reserves room for n ints; use `p[i]` like an array.', 'Check for `NULL` before using the block.', '**Every malloc needs a free.** A block you lose track of is a memory leak.', 'Use `sizeof(type)` and multiply by the count: `malloc(n)` alone asks for n **bytes**.'],
        memory: 'Rent it, use it, return it.',
      },
    ],
    exercises: [
      {
        id: 'cx6-squares',
        title: 'Squares on demand',
        prompt: 'Read a number `n`. Reserve room for `n` ints with `malloc`, store the squares 1, 4, 9, … of 1 to n, then print them on one line separated by single spaces (no space after the last). Free the memory.',
        starter: P('', String.raw`    int n, i;
    scanf("%d", &n);
    // malloc, fill with squares, print, free`),
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: '1 4 9 16 25' },
          { input: '1', expected: '1' },
          { input: '8', expected: '1 4 9 16 25 36 49 64', hidden: true },
        ],
        hints: [
          '`int *a = (int *)malloc(n * sizeof(int));`',
          'Fill `a[i] = (i + 1) * (i + 1);` in a loop. Print with `if (i > 0) printf(" ");` before each number but the first.',
          'A similar example: the first `try` block in this lesson. Finish with `free(a);`.',
        ],
      },
      {
        id: 'cx6-reverse',
        title: 'Backwards',
        prompt: 'Read `n`, then `n` whole numbers into memory you reserve with `malloc`. Print the numbers in **reverse** order, one line, separated by single spaces.',
        starter: P('', String.raw`    int n, i;
    scanf("%d", &n);
    // reserve memory, read n numbers, print them backwards, free`),
        sampleInput: '4\n10 20 30 40',
        usesInput: true,
        tests: [
          { input: '4\n10 20 30 40', expected: '40 30 20 10' },
          { input: '1\n7', expected: '7' },
          { input: '5\n1 2 3 4 5', expected: '5 4 3 2 1', hidden: true },
        ],
        hints: [
          'Reserve `n * sizeof(int)` bytes and read each number into `a[i]` with `scanf("%d", &a[i]);`.',
          'Print with a loop that starts at `n - 1` and counts **down** to 0.',
          'A similar example: the price-list project step in this lesson reads into reserved memory.',
        ],
      },
      {
        id: 'cx6-card',
        title: 'A card on the heap',
        prompt: 'Define `Item` (name up to 20 letters, price). Reserve one `Item` with `malloc`, read a name and a price into it through the pointer, and print `Sugar costs 5000`. Free the memory.',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[20];
    int price;
} Item;

int main() {
    Item *p;
    // reserve, read through the pointer, print, free
    return 0;
}
`,
        sampleInput: 'Sugar 5000',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000', expected: 'Sugar costs 5000' },
          { input: 'Tea 800', expected: 'Tea costs 800' },
          { input: 'Rice 4200', expected: 'Rice costs 4200', hidden: true },
        ],
        hints: [
          '`p = (Item *)malloc(sizeof(Item));`',
          'Read with `scanf("%s %d", p->name, &p->price);`. The name is an array, so it needs no `&`.',
          'A similar example: the `Item *p` try block in this lesson. End with `free(p);`.',
        ],
      },
    ],
  },

  // ================================================================== 7
  {
    id: 'cx-resize',
    level: LEVEL,
    minutes: 30,
    title: 'calloc, realloc and the growing array',
    summary: 'Zeroed memory, and arrays that grow while the program runs',
    blocks: [
      {
        t: 'story',
        title: 'The notebook that fills up',
        text: 'Nakato writes every sale in a notebook. When the last page fills she does not throw everything away: she buys a **bigger notebook**, copies the old pages across and keeps writing. She does the same each time it fills, and she is never short of pages.\n\nA program can do exactly this with an array. `realloc` makes a block bigger (or smaller), **keeping what was already in it**. With it you can read numbers until the user says stop, without knowing in advance how many there will be.',
      },
      { t: 'h', text: 'calloc: memory that starts at zero' },
      { t: 'p', text: '`calloc(count, size)` is like `malloc` but it takes the count and the size separately and fills the block with **zeros**. `malloc` leaves the old contents lying around, so a new block from `malloc` holds rubbish until you write to it.' },
      {
        t: 'try',
        code: P('', String.raw`    int *counts = (int *)calloc(5, sizeof(int));
    int i;
    for (i = 0; i < 5; i++) {
        printf("%d ", counts[i]);
    }
    printf("\n");
    free(counts);`),
        output: '0 0 0 0 0',
      },
      { t: 'h', text: 'realloc: change the size' },
      { t: 'p', text: '`realloc(pointer, newBytes)` gives you a block of the new size containing the **old values**. It may have to move the data to a new place, so **always store the result back into the pointer**.' },
      {
        t: 'try',
        code: P('', String.raw`    int *a = (int *)malloc(3 * sizeof(int));
    int i;
    for (i = 0; i < 3; i++) {
        a[i] = (i + 1) * 10;
    }
    a = (int *)realloc(a, 6 * sizeof(int));
    for (i = 3; i < 6; i++) {
        a[i] = (i + 1) * 10;
    }
    for (i = 0; i < 6; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");
    free(a);`),
        output: '10 20 30 40 50 60',
      },
      { t: 'h', text: 'A list that grows by itself' },
      { t: 'p', text: 'Real programs wrap this idea in a struct holding the pointer, how many items are **used** (`size`) and how many fit (`capacity`). When the array is full, `add` doubles the capacity. Doubling means growth steps get rarer, and it is the same trick used inside Python lists and C++ vectors.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    int *data;
    int size;
    int capacity;
} List;

void add(List *l, int value) {
    if (l->size == l->capacity) {
        l->capacity = l->capacity * 2;
        l->data = (int *)realloc(l->data, l->capacity * sizeof(int));
    }
    l->data[l->size] = value;
    l->size++;
}`, String.raw`    List l;
    int i;
    l.size = 0;
    l.capacity = 2;
    l.data = (int *)malloc(l.capacity * sizeof(int));
    for (i = 1; i <= 7; i++) {
        add(&l, i * 10);
    }
    printf("size %d, capacity %d\n", l.size, l.capacity);
    printf("last: %d\n", l.data[l.size - 1]);
    free(l.data);`),
        output: 'size 7, capacity 8\nlast: 70',
      },
      { t: 'analogy', text: 'Capacity is the **number of pages in the notebook**; size is the **number of pages written on**. When size catches up with capacity, buy a notebook twice as big.' },
      { t: 'tip', text: 'Never keep using the **old** pointer after a `realloc`: the data may have moved. Always write `a = realloc(a, ...)`. (Careful programmers use a second pointer so they can still `free` the old block if `realloc` returns `NULL`.)' },
      {
        t: 'predict',
        code: P(String.raw`typedef struct {
    int *data;
    int size;
    int capacity;
} List;

void add(List *l, int value) {
    if (l->size == l->capacity) {
        l->capacity = l->capacity * 2;
        l->data = (int *)realloc(l->data, l->capacity * sizeof(int));
    }
    l->data[l->size] = value;
    l->size++;
}`, String.raw`    List l;
    int i;
    l.size = 0;
    l.capacity = 1;
    l.data = (int *)malloc(sizeof(int));
    for (i = 0; i < 5; i++) {
        add(&l, i);
    }
    printf("%d %d\n", l.size, l.capacity);`),
        question: 'The capacity starts at 1 and doubles whenever the list is full. What does this program print?',
        options: ['5 8', '5 5', '5 4', '5 6'],
        answer: 0,
        explain: 'The capacity grows 1, 2, 4, 8 as the list fills. After 5 items the size is 5 and the capacity is 8.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that **resizes** a block and keeps its contents.',
        template: P('', String.raw`    int *a = (int *)malloc(2 * sizeof(int));
    a[0] = 1;
    a[1] = 2;
    a = (int *)___(a, 4 * sizeof(int));
    a[2] = 3;
    printf("%d %d %d\n", a[0], a[1], a[2]);
    free(a);`),
        blanks: [{ options: ['realloc', 'malloc', 'calloc'], answer: 'realloc' }],
        output: '1 2 3',
      },
      {
        t: 'bug',
        code: P(String.raw`typedef struct {
    int *data;
    int size;
} List;

void add(List *l, int value) {
    l.data[l.size] = value;
    l.size++;
}`, String.raw`    List l;
    l.size = 0;
    l.data = (int *)malloc(4 * sizeof(int));
    add(&l, 9);
    printf("%d\n", l.size);
    free(l.data);`),
        question: 'The program stops with an error inside `add`. What is wrong?',
        options: ['`l` is a pointer inside `add`, so the members need arrows: `l->data`, `l->size`', 'The list needs a bigger capacity', 'realloc must be called first', 'size must be a double'],
        answer: 0,
        explain: '`add` receives the **address** of the list, so inside it `l` is a pointer and members are reached with `->`. In `main` the variable `l` is a real struct, so there the dot is right.',
        fixed: P(String.raw`typedef struct {
    int *data;
    int size;
} List;

void add(List *l, int value) {
    l->data[l->size] = value;
    l->size++;
}`, String.raw`    List l;
    l.size = 0;
    l.data = (int *)malloc(4 * sizeof(int));
    add(&l, 9);
    printf("%d\n", l.size);
    free(l.data);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: P('', String.raw`    int *a = (int *)calloc(5 * sizeof(int));
    printf("%d\n", a[0]);
    free(a);`),
            why: '`calloc` takes **two** values: how many, and the size of each. Write `calloc(5, sizeof(int))`.',
            right: P('', String.raw`    int *a = (int *)calloc(5, sizeof(int));
    printf("%d\n", a[0]);
    free(a);`),
          },
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    int *data;
    int size;
    int capacity;
} List;

void add(List *l, int value) {
    if (l->size == l->capacity) {
        l->data = (int *)realloc(l->data, l->capacity * 2 * sizeof(int));
    }
    l->data[l->size] = value;
    l->size++;
}`, String.raw`    List l;
    l.size = 0;
    l.capacity = 2;
    l.data = (int *)malloc(2 * sizeof(int));
    add(&l, 1);
    add(&l, 2);
    add(&l, 3);
    add(&l, 4);
    add(&l, 5);
    printf("%d\n", l.size);
    free(l.data);`),
            why: 'The block was made bigger but the **capacity** was never updated, so the list thinks it is still full and reallocates on every single `add` (and with a different size each time). Always update `l->capacity` when you grow the block.',
            right: P(String.raw`typedef struct {
    int *data;
    int size;
    int capacity;
} List;

void add(List *l, int value) {
    if (l->size == l->capacity) {
        l->capacity = l->capacity * 2;
        l->data = (int *)realloc(l->data, l->capacity * sizeof(int));
    }
    l->data[l->size] = value;
    l->size++;
}`, String.raw`    List l;
    l.size = 0;
    l.capacity = 2;
    l.data = (int *)malloc(2 * sizeof(int));
    add(&l, 1);
    add(&l, 2);
    add(&l, 3);
    add(&l, 4);
    add(&l, 5);
    printf("%d\n", l.size);
    free(l.data);`),
          },
          {
            logic: true,
            wrong: P('', String.raw`    int *a = (int *)malloc(3 * sizeof(int));
    a[0] = 42;
    free(a);
    printf("%d\n", a[0]);`),
            why: 'After `free(a)` the block belongs to the system again. Reading it afterwards is a **use after free**: it may still show 42 today and rubbish tomorrow, and real programs have been attacked this way. Do not touch memory after freeing it. Good practice: set `a = NULL;` right after `free(a);`.',
            right: P('', String.raw`    int *a = (int *)malloc(3 * sizeof(int));
    a[0] = 42;
    printf("%d\n", a[0]);
    free(a);
    a = NULL;`),
          },
        ],
      },
      { t: 'quiz', question: 'What does `realloc` do when it cannot grow the block in place?', options: ['It moves the data to a bigger block and returns the new address', 'It crashes the program', 'It keeps the old block unchanged and ignores the request', 'It clears the data'], answer: 0, explain: '`realloc` may allocate a new block, copy the old contents across, free the old block and return the new address. That is why you must store the result.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 7): today’s sales, no limit',
        text: 'The cashier types the amount of each sale and ends with 0. There is no limit on how many sales come in, so the list grows by itself. The program prints the number of sales, the total and the biggest sale. Try `4500 3000 1200 7800 600 0`.',
        stdin: '4500 3000 1200 7800 600 0',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
    int capacity;
} List;

void add(List *l, int value) {
    if (l->size == l->capacity) {
        l->capacity = l->capacity * 2;
        l->data = (int *)realloc(l->data, l->capacity * sizeof(int));
    }
    l->data[l->size] = value;
    l->size++;
}

int main() {
    List sales;
    int amount, i, total = 0, biggest = 0;
    sales.size = 0;
    sales.capacity = 2;
    sales.data = (int *)malloc(sales.capacity * sizeof(int));
    scanf("%d", &amount);
    while (amount != 0) {
        add(&sales, amount);
        scanf("%d", &amount);
    }
    for (i = 0; i < sales.size; i++) {
        total = total + sales.data[i];
        if (sales.data[i] > biggest) {
            biggest = sales.data[i];
        }
    }
    printf("Sales: %d\n", sales.size);
    printf("Total: %d\n", total);
    printf("Biggest: %d\n", biggest);
    free(sales.data);
    return 0;
}
`,
        output: 'Sales: 5\nTotal: 17100\nBiggest: 7800',
      },
      {
        t: 'recap',
        items: ['`calloc(count, size)` reserves **zeroed** memory; `malloc` leaves rubbish.', '`p = realloc(p, newBytes)` resizes a block and keeps the old values. Store the result!', 'A growing array keeps `data`, `size` (used) and `capacity` (room); when full, double the capacity.', 'Inside a function that gets a pointer to the list, use `l->size`; in `main`, with the variable, use `l.size`.', 'Never use a block after `free`. Set the pointer to `NULL` afterwards.'],
        memory: 'Full? Double it.',
      },
    ],
    exercises: [
      {
        id: 'cx7-collect',
        title: 'Until zero',
        prompt: 'Read whole numbers until you read 0. Store them in a growing array (start with room for 2 and double when full). Then print the **count** and the **largest** number, as `Count: 5` and `Largest: 30`. The first number is never 0.',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int size = 0, capacity = 2, n, i, largest;
    int *a = (int *)malloc(capacity * sizeof(int));
    scanf("%d", &n);
    // while n is not 0: grow if full, store, read the next number
    // then find the largest
    printf("Count: %d\n", size);
    printf("Largest: %d\n", largest);
    free(a);
    return 0;
}
`,
        sampleInput: '12 7 30 4 9 0',
        usesInput: true,
        tests: [
          { input: '12 7 30 4 9 0', expected: 'Count: 5\nLargest: 30' },
          { input: '5 0', expected: 'Count: 1\nLargest: 5' },
          { input: '1 2 3 4 5 6 7 8 9 10 11 0', expected: 'Count: 11\nLargest: 11', hidden: true },
        ],
        hints: [
          'Loop `while (n != 0)`. Inside: if `size == capacity`, double `capacity` and `realloc`.',
          'Then `a[size] = n; size++;` and read the next number with `scanf("%d", &n);`.',
          'After the loop set `largest = a[0]` and compare the others in a `for` loop. A similar example: the project step in this lesson.',
        ],
      },
      {
        id: 'cx7-buckets',
        title: 'Counting marks',
        prompt: 'Read `n` marks, each between 0 and 4. Use `calloc` to reserve 5 counters (all zero), add one to the counter of every mark you read, and print the five counters on one line separated by spaces. For `6` and `0 1 1 4 1 0` print `2 3 0 0 1`.',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i, mark;
    scanf("%d", &n);
    // reserve 5 zeroed counters with calloc, count the marks, print the counters
    return 0;
}
`,
        sampleInput: '6\n0 1 1 4 1 0',
        usesInput: true,
        tests: [
          { input: '6\n0 1 1 4 1 0', expected: '2 3 0 0 1' },
          { input: '3\n4 4 4', expected: '0 0 0 0 3' },
          { input: '1\n2', expected: '0 0 1 0 0', hidden: true },
        ],
        hints: [
          '`int *count = (int *)calloc(5, sizeof(int));` starts all five counters at 0.',
          'For each mark read, add one to its counter: `count[mark]++;`',
          'Print the five counters with a space between them, then `free(count);`.',
        ],
      },
      {
        id: 'cx7-capacity',
        title: 'How big did it get?',
        prompt: 'A list starts with capacity 1 and doubles whenever it is full. Read `n` and add `n` items (the values do not matter), then print `Capacity: 8` for 5 items. Use a real `realloc` each time the list grows.',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i, size = 0, capacity = 1;
    int *a = (int *)malloc(capacity * sizeof(int));
    scanf("%d", &n);
    // add n items, doubling the capacity with realloc when the list is full
    printf("Capacity: %d\n", capacity);
    free(a);
    return 0;
}
`,
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: 'Capacity: 8' },
          { input: '1', expected: 'Capacity: 1' },
          { input: '4', expected: 'Capacity: 4', hidden: true },
          { input: '9', expected: 'Capacity: 16', hidden: true },
        ],
        hints: [
          'In a loop that runs `n` times, check `if (size == capacity)` first.',
          'When full: `capacity = capacity * 2; a = (int *)realloc(a, capacity * sizeof(int));`',
          'Then store an item (`a[size] = i; size++;`). A similar example: the `add` function in this lesson.',
        ],
      },
    ],
  },

  // ================================================================== 8
  {
    id: 'cx-linked',
    level: LEVEL,
    minutes: 32,
    title: 'Linked lists',
    summary: 'Nodes that point at the next node: a list with no fixed size and no copying',
    blocks: [
      {
        t: 'story',
        title: 'The treasure hunt',
        text: 'In a treasure hunt each clue tells you where to find the **next** clue, and the last clue says “you are done”. Nobody gives you all the locations at once, and adding a new clue means changing only where **one** clue points.\n\nA **linked list** works like that. Each item (a **node**) holds a value **and the address of the next node**. The list is just a chain of nodes, with no fixed size and nothing to copy when you add one. It is the first of the famous **data structures**, and it is built from the two tools you now have: structs and pointers.',
      },
      { t: 'h', text: 'A node' },
      {
        t: 'p',
        text: 'A node is a struct with a value and a pointer to **another node of the same kind**. The last node points to `NULL`, which means “no next node”. A separate pointer, the **head**, holds the address of the first node. Lose the head and you lose the list.',
      },
      {
        t: 'try',
        code: P(NODE, String.raw`    Node *a = (Node *)malloc(sizeof(Node));
    Node *b = (Node *)malloc(sizeof(Node));
    Node *c = (Node *)malloc(sizeof(Node));
    Node *p;
    a->value = 10;
    b->value = 20;
    c->value = 30;
    a->next = b;
    b->next = c;
    c->next = NULL;
    for (p = a; p != NULL; p = p->next) {
        printf("%d ", p->value);
    }
    printf("\n");
    free(a);
    free(b);
    free(c);`),
        output: '10 20 30',
      },
      { t: 'p', text: 'The `for` loop is the standard way to **walk a list**: start at the head, stop when the pointer becomes `NULL`, and in each step follow `p = p->next`.' },
      { t: 'analogy', text: 'The list is a **chain of paper slips**. Each slip has a number written on it and the address of the next slip. You hold only the first slip (the head) and follow the addresses.' },
      { t: 'h', text: 'Adding at the front' },
      { t: 'p', text: 'To add a node at the front: make a new node, point its `next` at the **old head**, and return the new node as the **new head**. No other node moves. This is quick however long the list is.' },
      {
        t: 'try',
        code: P(NODE + '\n\n' + PUSH + '\n\n' + PRINT, String.raw`    Node *head = NULL;
    head = add_front(head, 1);
    head = add_front(head, 2);
    head = add_front(head, 3);
    print_list(head);`),
        output: '3 2 1',
      },
      { t: 'p', text: 'The newest value is at the front, so the list prints **backwards** from the order of insertion. That is how a **stack** (last in, first out) works.' },
      { t: 'h', text: 'Counting, summing and freeing' },
      { t: 'p', text: 'Every job on a list is a walk: count the nodes, add the values, look for the biggest. When you finish, **free every node**, one by one. You must save `head->next` **before** you free the node, because after `free` you may not read it.' },
      {
        t: 'try',
        code: P(NODE + '\n\n' + PUSH + '\n\n' + FREEALL, String.raw`    Node *head = NULL;
    Node *p;
    int count = 0, sum = 0;
    head = add_front(head, 5);
    head = add_front(head, 8);
    head = add_front(head, 2);
    for (p = head; p != NULL; p = p->next) {
        count++;
        sum = sum + p->value;
    }
    printf("%d nodes, sum %d\n", count, sum);
    free_list(head);`),
        output: '3 nodes, sum 15',
      },
      { t: 'tip', text: 'In this app, write `typedef struct Node { ... struct Node *next; } Node;`. Inside the struct the new name `Node` does not exist yet, so the pointer is declared `struct Node *next;`.' },
      {
        t: 'predict',
        code: P(NODE + '\n\n' + PUSH + '\n\n' + PRINT, String.raw`    Node *head = NULL;
    int i;
    for (i = 1; i <= 4; i++) {
        head = add_front(head, i * 10);
    }
    print_list(head);`),
        question: 'What does this program print?',
        options: ['40 30 20 10', '10 20 30 40', '40', '10'],
        answer: 0,
        explain: 'Each `add_front` puts the new node before the others, so the last value added (40) is first.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the member that moves to the **next node**.',
        template: P(NODE, String.raw`    Node a;
    Node b;
    Node *p;
    a.value = 1;
    b.value = 2;
    a.next = &b;
    b.next = NULL;
    for (p = &a; p != NULL; p = p->___) {
        printf("%d ", p->value);
    }
    printf("\n");`),
        blanks: [{ options: ['next', 'value', 'head'], answer: 'next' }],
        output: '1 2',
      },
      {
        t: 'bug',
        code: P(NODE, String.raw`    Node a;
    Node b;
    Node *p;
    a.value = 1;
    b.value = 2;
    a.next = &b;
    b.next = NULL;
    p = &a;
    printf("%d\n", p.next->value);`),
        question: 'The program stops with an error. What is wrong?',
        options: ['`p` is a pointer, so write `p->next` (an arrow), not `p.next`', 'b.next must not be NULL', 'a.value must be set last', 'A pointer cannot point to a struct'],
        answer: 0,
        explain: '`p` holds an address, so you reach its members with `->`. `p->next->value` reads “the value of the node after the one p points to”.',
        fixed: P(NODE, String.raw`    Node a;
    Node b;
    Node *p;
    a.value = 1;
    b.value = 2;
    a.next = &b;
    b.next = NULL;
    p = &a;
    printf("%d\n", p->next->value);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(NODE + '\n\n' + PUSH, String.raw`    Node *head = NULL;
    head = add_front(head, 1);
    head = add_front(head, 2);
    while (head != NULL) {
        printf("%d ", head->value);
        head = head->next;
    }
    printf("\n");`),
            why: 'It prints correctly, but walking with `head` itself **loses the start of the list**: at the end `head` is `NULL` and the nodes can never be freed (a memory leak). Walk with a second pointer: `Node *p = head;` and move `p`.',
            right: P(NODE + '\n\n' + PUSH + '\n\n' + FREEALL, String.raw`    Node *head = NULL;
    Node *p;
    head = add_front(head, 1);
    head = add_front(head, 2);
    for (p = head; p != NULL; p = p->next) {
        printf("%d ", p->value);
    }
    printf("\n");
    free_list(head);`),
          },
          {
            logic: true,
            wrong: P(NODE, String.raw`    Node *head = (Node *)malloc(sizeof(Node));
    head->value = 1;
    printf("%d\n", head->value);
    free(head);`),
            why: 'The program never gave `head->next` a value. A new block from `malloc` holds rubbish, so `next` is not `NULL` and a loop walking this list would run off into random memory. **Always set `next = NULL`** (or the real next node) when you create a node.',
            right: P(NODE, String.raw`    Node *head = (Node *)malloc(sizeof(Node));
    head->value = 1;
    head->next = NULL;
    printf("%d\n", head->value);
    free(head);`),
          },
          {
            wrong: P(NODE, String.raw`    Node n;
    n.value = 5;
    n.next = NULL;
    printf("%d\n", n->value);`),
            why: '`n` is a struct **variable**, so the member is reached with a dot: `n.value`. The arrow is only for pointers.',
            right: P(NODE, String.raw`    Node n;
    n.value = 5;
    n.next = NULL;
    printf("%d\n", n.value);`),
          },
        ],
      },
      { t: 'quiz', question: 'What does the **last** node of a linked list point to?', options: ['NULL', 'The first node', 'Itself', '0 bytes of memory'], answer: 0, explain: '`NULL` means “no next node”. Every walk over a list stops when the pointer becomes NULL.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 8): the receipt roll',
        text: 'Each sale is added to the **front** of a list, so the **newest sale is always first**. The cashier types amounts and ends with 0. The program prints the sales newest first, then the number of sales and their total. Try `4500 3000 1200 0`.',
        stdin: '4500 3000 1200 0',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *add_front(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    n->value = value;
    n->next = head;
    return n;
}

void free_list(Node *head) {
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}

int main() {
    Node *head = NULL;
    Node *p;
    int amount, count = 0, total = 0;
    scanf("%d", &amount);
    while (amount != 0) {
        head = add_front(head, amount);
        scanf("%d", &amount);
    }
    printf("Newest first:");
    for (p = head; p != NULL; p = p->next) {
        printf(" %d", p->value);
        count++;
        total = total + p->value;
    }
    printf("\n");
    printf("%d sales, total %d\n", count, total);
    free_list(head);
    return 0;
}
`,
        output: 'Newest first: 1200 3000 4500\n3 sales, total 8700',
      },
      {
        t: 'recap',
        items: ['A node is a struct with a value and a pointer to the next node: `struct Node *next;`.', 'The **head** pointer holds the first node; the last node’s `next` is `NULL`.', 'Walk with `for (p = head; p != NULL; p = p->next)` using a second pointer.', 'Add at the front: new node → `next = head`, then return the new node as the head.', 'Free every node, saving `next` **before** the `free`.'],
        memory: 'Follow the arrows until NULL.',
      },
    ],
    exercises: [
      {
        id: 'cx8-print',
        title: 'Stack of numbers',
        prompt: 'The helper functions `add_front` and `print_list` are written for you. Read `n`, then `n` numbers, add each to the **front** of the list, and print the list on one line.',
        starter: P(NODE + '\n\n' + PUSH + '\n\n' + PRINT, String.raw`    Node *head = NULL;
    int n, i, value;
    scanf("%d", &n);
    // read n numbers, add each to the front, print the list`),
        sampleInput: '4\n10 20 30 40',
        usesInput: true,
        tests: [
          { input: '4\n10 20 30 40', expected: '40 30 20 10 ' },
          { input: '1\n7', expected: '7 ' },
          { input: '3\n1 2 3', expected: '3 2 1 ', hidden: true },
        ],
        hints: [
          'A `for` loop that runs `n` times, reading each number with `scanf("%d", &value);`.',
          'Then `head = add_front(head, value);`.',
          'After the loop call `print_list(head);`. (It prints a space after every number, and the test expects it.)',
        ],
      },
      {
        id: 'cx8-sum',
        title: 'Sum the list',
        prompt: 'Complete the function `sum_list`, which walks the list and returns the **sum of all values**. The program reads `n` numbers into a list and prints `Sum: 60`.',
        starter: P(NODE + '\n\n' + PUSH + '\n\n' + String.raw`int sum_list(Node *head) {
    // walk the list and add up the values
}`, String.raw`    Node *head = NULL;
    int n, i, value;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &value);
        head = add_front(head, value);
    }
    printf("Sum: %d\n", sum_list(head));`),
        sampleInput: '3\n10 20 30',
        usesInput: true,
        tests: [
          { input: '3\n10 20 30', expected: 'Sum: 60' },
          { input: '1\n5', expected: 'Sum: 5' },
          { input: '4\n-1 -2 7 10', expected: 'Sum: 14', hidden: true },
        ],
        hints: [
          'Start with `int total = 0;` and a pointer `Node *p = head;`.',
          'Loop while `p != NULL`: add `p->value` to the total and move on with `p = p->next;`.',
          'Finish with `return total;`. A similar example: the count and sum `try` block in this lesson.',
        ],
      },
      {
        id: 'cx8-largest',
        title: 'The biggest node',
        prompt: 'Complete `largest`, which returns the biggest value in a list (the list has at least one node). The program reads `n` numbers and prints `Largest: 40`.',
        starter: P(NODE + '\n\n' + PUSH + '\n\n' + String.raw`int largest(Node *head) {
    // return the biggest value in the list
}`, String.raw`    Node *head = NULL;
    int n, i, value;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &value);
        head = add_front(head, value);
    }
    printf("Largest: %d\n", largest(head));`),
        sampleInput: '4\n10 40 20 30',
        usesInput: true,
        tests: [
          { input: '4\n10 40 20 30', expected: 'Largest: 40' },
          { input: '1\n-8', expected: 'Largest: -8' },
          { input: '5\n3 9 9 2 1', expected: 'Largest: 9', hidden: true },
        ],
        hints: [
          'Start with `int best = head->value;`.',
          'Walk from `head->next` (or from `head`): whenever `p->value > best`, update `best`.',
          'Return `best`. A similar example: finding the largest number in an array, but following `next` instead of adding to an index.',
        ],
      },
    ],
  },

  // ================================================================== 9
  {
    id: 'cx-list-ops',
    level: LEVEL,
    minutes: 32,
    title: 'List operations: append, search, delete',
    summary: 'Add at the end, find a value, remove a node, and build a queue',
    blocks: [
      {
        t: 'story',
        title: 'The queue at the till',
        text: 'At the till, new customers join at the **back** and are served from the **front**. If the shop used a list that only grows at the front, the newest customer would be served first and everyone else would walk out.\n\nTo model a real queue you need more operations: **add at the end**, **find** a customer, **remove** one who leaves. In this lesson you build them. Together with last lesson’s they make a toolbox that you will meet again in every language.',
      },
      { t: 'h', text: 'Adding at the end' },
      { t: 'p', text: 'To add at the end, walk to the **last node** (the one whose `next` is `NULL`) and hang the new node there. An empty list is a special case: the new node simply **becomes** the head.' },
      {
        t: 'try',
        code: P(NODE + '\n\n' + PRINT + '\n\n' + String.raw`Node *append(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    Node *p;
    n->value = value;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}`, String.raw`    Node *head = NULL;
    head = append(head, 1);
    head = append(head, 2);
    head = append(head, 3);
    print_list(head);`),
        output: '1 2 3',
      },
      { t: 'p', text: 'Look at the loop: `while (p->next != NULL)` stops **on the last node**, not after it. That is what you need, because you must change the last node’s `next`.' },
      { t: 'h', text: 'Searching' },
      { t: 'p', text: '`find` walks the list and returns the node holding the value, or `NULL` if it is not there. Callers test the answer with `if (node != NULL)`.' },
      {
        t: 'try',
        code: P(NODE + '\n\n' + String.raw`Node *append(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    Node *p;
    n->value = value;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}

Node *find(Node *head, int value) {
    Node *p;
    for (p = head; p != NULL; p = p->next) {
        if (p->value == value) {
            return p;
        }
    }
    return NULL;
}`, String.raw`    Node *head = NULL;
    head = append(head, 5);
    head = append(head, 8);
    head = append(head, 13);
    if (find(head, 8) != NULL) {
        printf("8 is in the list\n");
    }
    if (find(head, 9) == NULL) {
        printf("9 is not\n");
    }`),
        output: '8 is in the list\n9 is not',
      },
      { t: 'h', text: 'Deleting a node' },
      { t: 'p', text: 'To remove a node you must change the `next` of the node **before** it so that it jumps over the victim, and then free the victim. So while walking, keep two pointers: `p` (the current node) and `prev` (the one before it). Removing the **first** node is a special case, because nothing is before it: the head itself moves on.' },
      {
        t: 'try',
        code: P(NODE + '\n\n' + PRINT + '\n\n' + String.raw`Node *append(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    Node *p;
    n->value = value;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}

Node *remove_value(Node *head, int value) {
    Node *prev = NULL;
    Node *p = head;
    while (p != NULL) {
        if (p->value == value) {
            if (prev == NULL) {
                head = p->next;
            } else {
                prev->next = p->next;
            }
            free(p);
            return head;
        }
        prev = p;
        p = p->next;
    }
    return head;
}`, String.raw`    Node *head = NULL;
    int i;
    for (i = 1; i <= 4; i++) {
        head = append(head, i);
    }
    head = remove_value(head, 3);
    print_list(head);
    head = remove_value(head, 1);
    print_list(head);`),
        output: '1 2 4\n2 4',
      },
      { t: 'analogy', text: 'Removing a bead from a **necklace**: you cannot just throw it away, you must tie the bead before it to the bead after it. If you remove the first bead, the necklace simply starts at the second.' },
      { t: 'tip', text: 'When deleting, **free the node last**, after you have used `p->next`. After `free(p)` you may not read `p->next` any more.' },
      {
        t: 'predict',
        code: P(NODE + '\n\n' + PRINT + '\n\n' + String.raw`Node *append(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    Node *p;
    n->value = value;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}`, String.raw`    Node *head = NULL;
    head = append(head, 7);
    head = append(head, 3);
    head = append(head, 9);
    print_list(head);`),
        question: 'What does this program print?',
        options: ['7 3 9', '9 3 7', '7', '9'],
        answer: 0,
        explain: '`append` puts each new value at the **end**, so the order of the list is the order of insertion: 7, 3, 9. (`add_front` would have printed it backwards.)',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so `p` stops on the **last** node (the one that has no node after it).',
        template: P(NODE, String.raw`    Node a;
    Node b;
    Node *p = &a;
    a.value = 1;
    b.value = 2;
    a.next = &b;
    b.next = NULL;
    while (p->next ___ NULL) {
        p = p->next;
    }
    printf("%d\n", p->value);`),
        blanks: [{ options: ['!=', '==', '<'], answer: '!=' }],
        output: '2',
      },
      {
        t: 'bug',
        code: P(NODE, String.raw`    Node a;
    Node b;
    Node *p;
    int total = 0;
    a.value = 4;
    b.value = 6;
    a.next = &b;
    b.next = NULL;
    for (p = &a; p != NULL; p = p->next) {
        total = total + p.value;
    }
    printf("%d\n", total);`),
        question: 'The program stops with an error. What is wrong?',
        options: ['`p` is a pointer, so write `p->value`', 'total must be a pointer', 'The loop must start at b', 'NULL cannot be used in a for loop'],
        answer: 0,
        explain: 'Inside the loop `p` points at a node, so its members need an arrow: `p->value`.',
        fixed: P(NODE, String.raw`    Node a;
    Node b;
    Node *p;
    int total = 0;
    a.value = 4;
    b.value = 6;
    a.next = &b;
    b.next = NULL;
    for (p = &a; p != NULL; p = p->next) {
        total = total + p->value;
    }
    printf("%d\n", total);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(NODE, String.raw`    Node a;
    Node b;
    Node *p = &a;
    a.value = 1;
    b.value = 2;
    a.next = &b;
    b.next = NULL;
    while (p != NULL) {
        p = p->next;
    }
    printf("%d\n", p->value);`),
            why: 'The loop ends when `p` is `NULL`, and then the program reads `p->value`: that is **following a NULL pointer**. To end up on the last node, test `p->next != NULL`, not `p != NULL`.',
            right: P(NODE, String.raw`    Node a;
    Node b;
    Node *p = &a;
    a.value = 1;
    b.value = 2;
    a.next = &b;
    b.next = NULL;
    while (p->next != NULL) {
        p = p->next;
    }
    printf("%d\n", p->value);`),
          },
          {
            logic: true,
            wrong: P(NODE + '\n\n' + String.raw`Node *remove_first(Node *head) {
    free(head);
    return head->next;
}`, String.raw`    Node *head = (Node *)malloc(sizeof(Node));
    head->value = 1;
    head->next = NULL;
    head = remove_first(head);`),
            why: 'The program frees the node and **then** reads `head->next`. After `free` the memory is no longer yours. Save what you need first: `Node *rest = head->next; free(head); return rest;`.',
            right: P(NODE + '\n\n' + String.raw`Node *remove_first(Node *head) {
    Node *rest = head->next;
    free(head);
    return rest;
}`, String.raw`    Node *head = (Node *)malloc(sizeof(Node));
    head->value = 1;
    head->next = NULL;
    head = remove_first(head);`),
          },
          {
            wrong: P(NODE, String.raw`    Node *head = NULL;
    Node *n = (Node *)malloc(sizeof(Node));
    n->value = 1;
    n.next = head;
    printf("%d\n", n->value);
    free(n);`),
            why: '`n` is a pointer, so `n.next` must be `n->next`.',
            right: P(NODE, String.raw`    Node *head = NULL;
    Node *n = (Node *)malloc(sizeof(Node));
    n->value = 1;
    n->next = head;
    printf("%d\n", n->value);
    free(n);`),
          },
        ],
      },
      { t: 'quiz', question: 'Why does deleting a node need a `prev` pointer?', options: ['The node before it must be re-linked to the node after it', 'To count the nodes', 'To free the head', 'Because NULL cannot be freed'], answer: 0, explain: 'A node only knows the **next** node, not the one before it. So while walking you remember the previous node, and you change its `next` to skip the removed one.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 9): the till queue',
        text: 'Customers `join` at the back and are `serve`d from the front. `show` prints who is waiting. Commands come one per line and end with `quit`. Try the input as it is, then invent your own.',
        stdin: 'join Amina\njoin Kato\njoin Zawadi\nserve\nshow\njoin Bob\nserve\nshow\nquit',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Customer {
    char name[20];
    struct Customer *next;
} Customer;

Customer *join(Customer *head, char name[]) {
    Customer *c = (Customer *)malloc(sizeof(Customer));
    Customer *p;
    strcpy(c->name, name);
    c->next = NULL;
    if (head == NULL) {
        return c;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = c;
    return head;
}

Customer *serve(Customer *head) {
    Customer *rest;
    if (head == NULL) {
        printf("Nobody is waiting\n");
        return NULL;
    }
    printf("Serving %s\n", head->name);
    rest = head->next;
    free(head);
    return rest;
}

void show(Customer *head) {
    Customer *p;
    printf("Waiting:");
    for (p = head; p != NULL; p = p->next) {
        printf(" %s", p->name);
    }
    printf("\n");
}

int main() {
    Customer *queue = NULL;
    char command[20];
    char name[20];
    scanf("%s", command);
    while (strcmp(command, "quit") != 0) {
        if (strcmp(command, "join") == 0) {
            scanf("%s", name);
            queue = join(queue, name);
        } else if (strcmp(command, "serve") == 0) {
            queue = serve(queue);
        } else if (strcmp(command, "show") == 0) {
            show(queue);
        }
        scanf("%s", command);
    }
    while (queue != NULL) {
        queue = serve(queue);
    }
    return 0;
}
`,
        output: 'Serving Amina\nWaiting: Kato Zawadi\nServing Kato\nWaiting: Zawadi Bob\nServing Zawadi\nServing Bob',
      },
      {
        t: 'recap',
        items: ['Append: walk until `p->next == NULL`, then hang the new node there. An empty list: the new node becomes the head.', 'Search: walk the list, return the node or `NULL`.', 'Delete: keep `prev` and `p`; re-link `prev->next = p->next`, then free `p`. Deleting the first node moves the head.', 'Never read a node after you freed it.', 'A **queue** adds at the back and removes at the front; a **stack** adds and removes at the front.'],
        memory: 'Tie the bead before it to the bead after it.',
      },
    ],
    exercises: [
      {
        id: 'cx9-append',
        title: 'In order',
        prompt: 'Complete `append`, which adds a value at the **end** of the list and returns the head. The program reads `n` numbers and prints the list in the **same order** as they were typed.',
        starter: P(NODE + '\n\n' + PRINT + '\n\n' + String.raw`Node *append(Node *head, int value) {
    // add a new node with this value at the end
}`, String.raw`    Node *head = NULL;
    int n, i, value;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &value);
        head = append(head, value);
    }
    print_list(head);`),
        sampleInput: '4\n10 20 30 40',
        usesInput: true,
        tests: [
          { input: '4\n10 20 30 40', expected: '10 20 30 40 ' },
          { input: '1\n5', expected: '5 ' },
          { input: '3\n9 1 5', expected: '9 1 5 ', hidden: true },
        ],
        hints: [
          'Make the new node: `malloc`, set `value`, set `next = NULL`.',
          'If `head == NULL`, return the new node. Otherwise walk with `while (p->next != NULL)`.',
          'Set `p->next = n;` and return `head`. A similar example: `append` in this lesson.',
        ],
      },
      {
        id: 'cx9-delete',
        title: 'Remove a customer number',
        prompt: 'The list functions `append`, `print_list` and `remove_value` are partly written. Complete `remove_value`, which removes the **first** node holding the value and returns the head. The program reads `n` numbers, then a value to remove, and prints what is left (the list is never empty after the removal).',
        starter: P(NODE + '\n\n' + PRINT + '\n\n' + String.raw`Node *append(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    Node *p;
    n->value = value;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}

Node *remove_value(Node *head, int value) {
    // find the node, re-link around it, free it
}`, String.raw`    Node *head = NULL;
    int n, i, value;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &value);
        head = append(head, value);
    }
    scanf("%d", &value);
    head = remove_value(head, value);
    print_list(head);`),
        sampleInput: '4\n1 2 3 4\n3',
        usesInput: true,
        tests: [
          { input: '4\n1 2 3 4\n3', expected: '1 2 4 ' },
          { input: '3\n5 6 7\n5', expected: '6 7 ' },
          { input: '3\n5 6 7\n9', expected: '5 6 7 ', hidden: true },
          { input: '3\n5 6 7\n7', expected: '5 6 ', hidden: true },
        ],
        hints: [
          'Walk with two pointers: `prev` (starts `NULL`) and `p` (starts at `head`).',
          'When `p->value == value`: if `prev == NULL` the head moves (`head = p->next`), else `prev->next = p->next`. Then `free(p)` and return `head`.',
          'If you reach the end without finding it, return `head` unchanged. A similar example: `remove_value` in this lesson.',
        ],
      },
      {
        id: 'cx9-reverse',
        title: 'Reverse the list',
        prompt: 'Complete `reverse`, which turns the list around **by changing the `next` pointers** (no new nodes) and returns the new head. The program reads `n` numbers and prints the reversed list. Hint: walk the list keeping `prev` (starts `NULL`); for each node save `next`, point it back at `prev`, then move both forward.',
        starter: P(NODE + '\n\n' + PRINT + '\n\n' + String.raw`Node *append(Node *head, int value) {
    Node *n = (Node *)malloc(sizeof(Node));
    Node *p;
    n->value = value;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}

Node *reverse(Node *head) {
    // turn the pointers around
}`, String.raw`    Node *head = NULL;
    int n, i, value;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &value);
        head = append(head, value);
    }
    head = reverse(head);
    print_list(head);`),
        sampleInput: '4\n1 2 3 4',
        usesInput: true,
        tests: [
          { input: '4\n1 2 3 4', expected: '4 3 2 1 ' },
          { input: '1\n9', expected: '9 ' },
          { input: '3\n5 6 7', expected: '7 6 5 ', hidden: true },
        ],
        hints: [
          'Use `Node *prev = NULL;` and `Node *p = head;`.',
          'In the loop: `Node *next = p->next; p->next = prev; prev = p; p = next;`',
          'When `p` is `NULL`, `prev` is the new head: `return prev;`.',
        ],
      },
    ],
  },

  // ================================================================== 10
  {
    id: 'cx-text-memory',
    level: LEVEL,
    minutes: 30,
    title: 'Strings and tables in dynamic memory',
    summary: 'Arrays of strings, strings that are exactly as long as they need to be, and tables of any size',
    blocks: [
      {
        t: 'story',
        title: 'Names of any length',
        text: 'The registrar of a big school asks you to store student names. Some names are `Jo`, others are `Nakitende Namukwaya Sarah`. If every name gets a `char name[50]` box, short names waste space and a very long name overflows it. A program that keeps **ten thousand** names would waste megabytes.\n\nWith dynamic memory each name gets **exactly** the space it needs. In this lesson you also learn two ways of storing a **table** of values, such as a class register, when you do not know the number of rows and columns until the program runs.',
      },
      { t: 'h', text: 'A list of strings' },
      { t: 'p', text: 'A `char *` is a pointer to the first letter of a string. An **array of `char *`** is a list of strings, each of any length. Text written in double quotes already lives somewhere in memory, so a `char *` can simply point at it:' },
      {
        t: 'try',
        code: P('', String.raw`    char *names[3] = {"Amina", "Kato", "Nakitende Sarah"};
    int i;
    for (i = 0; i < 3; i++) {
        printf("%d: %s\n", i + 1, names[i]);
    }`, IO),
        output: '1: Amina\n2: Kato\n3: Nakitende Sarah',
      },
      { t: 'h', text: 'A string that is exactly long enough' },
      { t: 'p', text: 'To store text you have **typed in**, reserve `strlen(text) + 1` bytes: the letters, **plus one byte for the end marker** `\\0`. Then copy with `strcpy`. Forgetting the `+ 1` is one of the most famous bugs in C.' },
      {
        t: 'try',
        code: P(String.raw`char *copy_text(char *text) {
    char *copy = (char *)malloc(strlen(text) + 1);
    strcpy(copy, text);
    return copy;
}`, String.raw`    char *a = copy_text("Sugar");
    char *b = copy_text("Nakitende Namukwaya");
    printf("%s (%d letters)\n", a, (int)strlen(a));
    printf("%s (%d letters)\n", b, (int)strlen(b));
    free(a);
    free(b);`, MEMSTR),
        output: 'Sugar (5 letters)\nNakitende Namukwaya (19 letters)',
      },
      { t: 'analogy', text: 'The `+ 1` is the **full stop at the end of a sentence**. “Sugar” is five letters, but the computer needs a sixth box to know where the word stops.' },
      { t: 'h', text: 'A struct with a text pointer' },
      { t: 'p', text: 'A struct can hold a `char *` instead of a fixed array. You then `malloc` the text **separately**, and you must `free` the **text first, then the struct**.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char *name;
    int price;
} Item;

Item *make_item(char *name, int price) {
    Item *it = (Item *)malloc(sizeof(Item));
    it->name = (char *)malloc(strlen(name) + 1);
    strcpy(it->name, name);
    it->price = price;
    return it;
}

void free_item(Item *it) {
    free(it->name);
    free(it);
}`, String.raw`    Item *a = make_item("Sugar", 5000);
    printf("%s %d\n", a->name, a->price);
    free_item(a);`, MEMSTR),
        output: 'Sugar 5000',
      },
      { t: 'tip', text: 'Free in the **opposite order** you reserved. If you free the struct first, you lose the only pointer to the text, and the text can never be freed.' },
      { t: 'h', text: 'A table of any size' },
      { t: 'p', text: 'A table with `r` rows and `c` columns can be stored as **one block** of `r * c` ints. The item in row `i`, column `j` is at position `i * c + j`. That needs a single `malloc` and a single `free`.' },
      {
        t: 'try',
        code: P('', String.raw`    int rows = 3, cols = 4, i, j;
    int *t = (int *)malloc(rows * cols * sizeof(int));
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            t[i * cols + j] = (i + 1) * (j + 1);
        }
    }
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            printf("%3d", t[i * cols + j]);
        }
        printf("\n");
    }
    free(t);`),
        output: '  1  2  3  4\n  2  4  6  8\n  3  6  9 12',
      },
      {
        t: 'predict',
        code: P('', String.raw`    char *word = (char *)malloc(strlen("Kampala") + 1);
    strcpy(word, "Kampala");
    word[3] = 'x';
    printf("%s\n", word);
    free(word);`, MEMSTR),
        question: 'What does this program print?',
        options: ['Kamxala', 'Kampala', 'Kamx', 'Kxmpala'],
        answer: 0,
        explain: 'The copy is yours (it lives in memory you reserved), so you can change it. Position 3 (the fourth letter, `p`) becomes `x`.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that **copies** the text into the new memory (the room was already reserved with `strlen("Kato") + 1`: the letters **and the end marker**).',
        template: P('', String.raw`    char *s = (char *)malloc(strlen("Kato") + 1);
    ___(s, "Kato");
    printf("%s\n", s);
    free(s);`, MEMSTR),
        blanks: [{ options: ['strcpy', 'strlen', 'free'], answer: 'strcpy' }],
        output: 'Kato',
      },
      {
        t: 'bug',
        code: P('', String.raw`    char *s = (char *)malloc(20);
    printf("%s\n", s_copy);`, MEMSTR),
        question: 'The program stops with an error. What is wrong?',
        options: ['`s_copy` does not exist: the variable is called `s`', 'malloc needs a second argument', 'You cannot print a pointer', 'The block is too small'],
        answer: 0,
        explain: 'The error message names a variable that was never declared. A misspelled name is among the most common beginner errors; check each name against the declaration.',
        fixed: P('', String.raw`    char *s = (char *)malloc(20);
    strcpy(s, "hello");
    printf("%s\n", s);
    free(s);`, MEMSTR),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P('', String.raw`    char *s = (char *)malloc(strlen("Kampala"));
    strcpy(s, "Kampala");
    printf("%s\n", s);
    free(s);`, MEMSTR),
            why: '`strlen("Kampala")` is 7, but the copy needs **8** bytes (the end marker too). `strcpy` writes one byte beyond the block, damaging whatever sits next to it, and real C gives no warning. Always `strlen(text) + 1`.',
            right: P('', String.raw`    char *s = (char *)malloc(strlen("Kampala") + 1);
    strcpy(s, "Kampala");
    printf("%s\n", s);
    free(s);`, MEMSTR),
          },
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    char *name;
} Person;`, String.raw`    Person p;
    strcpy(p.name, "Amina");
    printf("%s\n", p.name);`, MEMSTR),
            why: '`p.name` is only a pointer and it points nowhere yet: there is no memory to copy the letters into. First reserve it: `p.name = (char *)malloc(strlen("Amina") + 1);`.',
            right: P(String.raw`typedef struct {
    char *name;
} Person;`, String.raw`    Person p;
    p.name = (char *)malloc(strlen("Amina") + 1);
    strcpy(p.name, "Amina");
    printf("%s\n", p.name);
    free(p.name);`, MEMSTR),
          },
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    char *name;
} Person;`, String.raw`    Person *p = (Person *)malloc(sizeof(Person));
    p->name = (char *)malloc(10);
    strcpy(p->name, "Amina");
    free(p);`, MEMSTR),
            why: 'Only the struct was freed. The 10 bytes holding the name are now lost for good (a leak), because the pointer to them was inside the struct that was freed. Free the name **first**: `free(p->name); free(p);`.',
            right: P(String.raw`typedef struct {
    char *name;
} Person;`, String.raw`    Person *p = (Person *)malloc(sizeof(Person));
    p->name = (char *)malloc(10);
    strcpy(p->name, "Amina");
    free(p->name);
    free(p);`, MEMSTR),
          },
        ],
      },
      { t: 'quiz', question: 'You want a copy of the string `text`. How many bytes do you reserve?', options: ['strlen(text) + 1', 'strlen(text)', 'sizeof(text)', 'strlen(text) - 1'], answer: 0, explain: 'The letters take `strlen(text)` bytes and the end marker takes one more.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 10): the customer register',
        text: 'The first number is how many customers. Each name is stored in a string that is **exactly as long as the name**, and the register is printed in alphabetical order. Try `4` then `Kato`, `Amina`, `Zawadi`, `Bob` (one per line).',
        stdin: '4\nKato\nAmina\nZawadi\nBob',
        code: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int n, i, j;
    char word[100];
    char **names;
    scanf("%d", &n);
    names = (char **)malloc(n * sizeof(char *));
    for (i = 0; i < n; i++) {
        scanf("%s", word);
        names[i] = (char *)malloc(strlen(word) + 1);
        strcpy(names[i], word);
    }
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - 1 - i; j++) {
            if (strcmp(names[j], names[j + 1]) > 0) {
                char *temp = names[j];
                names[j] = names[j + 1];
                names[j + 1] = temp;
            }
        }
    }
    for (i = 0; i < n; i++) {
        printf("%d. %s\n", i + 1, names[i]);
        free(names[i]);
    }
    free(names);
    return 0;
}
`,
        output: '1. Amina\n2. Bob\n3. Kato\n4. Zawadi',
      },
      {
        t: 'recap',
        items: ['`char *names[3] = {"Amina", "Kato", ...};` is a list of strings of any length.', 'A copy of a string needs `strlen(text) + 1` bytes (the end marker!).', 'A struct holding `char *name` needs the text reserved **separately**; free the text, **then** the struct.', 'A table of r × c numbers can be one block: item (i, j) is at `i * c + j`.', 'Sort a list of strings by swapping the **pointers**, not the letters.'],
        memory: 'Letters plus one.',
      },
    ],
    exercises: [
      {
        id: 'cx10-join',
        title: 'Join two words',
        prompt: 'Read two words. Reserve **exactly** enough memory for the first word, a dash and the second word (and the end marker), build the joined word in it and print it, as `Kampala-Road`. Free the memory.',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    char a[50];
    char b[50];
    char *joined;
    scanf("%s %s", a, b);
    // reserve, build, print, free
    return 0;
}
`,
        sampleInput: 'Kampala Road',
        usesInput: true,
        tests: [
          { input: 'Kampala Road', expected: 'Kampala-Road' },
          { input: 'a b', expected: 'a-b' },
          { input: 'Nakitende Sarah', expected: 'Nakitende-Sarah', hidden: true },
        ],
        hints: [
          'You need `strlen(a) + 1 + strlen(b) + 1` bytes: both words, the dash and the end marker.',
          'Build it with `strcpy(joined, a); strcat(joined, "-"); strcat(joined, b);`',
          'Print with `printf("%s\\n", joined);` and then `free(joined);`.',
        ],
      },
      {
        id: 'cx10-longest',
        title: 'The longest name',
        prompt: 'Read `n`, then `n` names. Store each in memory of exactly the right size. Print the **longest** name (the first one if there is a tie), then free everything.',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int n, i, best = 0;
    char word[100];
    char **names;
    scanf("%d", &n);
    names = (char **)malloc(n * sizeof(char *));
    // read and store each name, find the longest, print it, free everything
    return 0;
}
`,
        sampleInput: '4\nKato\nNakitende\nAmina\nBob',
        usesInput: true,
        tests: [
          { input: '4\nKato\nNakitende\nAmina\nBob', expected: 'Nakitende' },
          { input: '2\nAnn\nBob', expected: 'Ann' },
          { input: '3\nZi\nXyz\nQw', expected: 'Xyz', hidden: true },
        ],
        hints: [
          'For each name: `scanf("%s", word);` then `names[i] = (char *)malloc(strlen(word) + 1); strcpy(names[i], word);`',
          'Keep the index of the longest so far: when `strlen(names[i]) > strlen(names[best])`, set `best = i;`.',
          'Print `names[best]`, then free every `names[i]` in a loop and finally `free(names);`.',
        ],
      },
      {
        id: 'cx10-table',
        title: 'The times table',
        prompt: 'Read the number of rows and columns. Reserve one block for the whole table and fill item (i, j) with `i * j` for i from 1 to rows and j from 1 to columns. Then print the **sum of all the items**, as `Sum: 36` (for 3 rows and 3 columns).',
        starter: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int rows, cols, i, j, sum = 0;
    int *t;
    scanf("%d %d", &rows, &cols);
    // reserve rows * cols ints, fill, add up, free
    printf("Sum: %d\n", sum);
    return 0;
}
`,
        sampleInput: '3 3',
        usesInput: true,
        tests: [
          { input: '3 3', expected: 'Sum: 36' },
          { input: '1 5', expected: 'Sum: 15' },
          { input: '4 2', expected: 'Sum: 30', hidden: true },
        ],
        hints: [
          '`t = (int *)malloc(rows * cols * sizeof(int));`',
          'The item in row `i` (starting at 1) and column `j` (starting at 1) is stored at `t[(i - 1) * cols + (j - 1)]` and holds `i * j`.',
          'Add each item to `sum` as you store it, then `free(t);`. A similar example: the table `try` block in this lesson.',
        ],
      },
    ],
  },
];
