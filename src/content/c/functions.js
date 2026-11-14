// C, Level 3: Functions. Lessons 11 to 15 (functions, parameters and scope, recursion, Mobile Money project, debugging).
// Prose uses single-quoted strings. C code uses String.raw so that \n stays a backslash-n.

const LEVEL = 'Level 3: Functions';

/** A whole program: `fns` are the functions (and prototypes) above main, `body` goes inside main. */
const fn = (fns, body, inc = '#include <stdio.h>') => `${inc}\n\n${fns ? fns + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

export const functionLessons = [
  // ================================================================== 11
  {
    id: 'c-functions',
    level: LEVEL,
    minutes: 24,
    title: 'Functions: write once, use many times',
    summary: 'Defining and calling functions, return values, void and prototypes',
    blocks: [
      {
        t: 'story',
        title: 'Mama Rose’s recipe card',
        text: 'Mama Rose does not rewrite the rolex recipe every morning. She keeps **one card**. Her helpers read the card and follow it, ten times a day, and when she improves the recipe she changes the card once.\n\nA **function** is a recipe card for a program. You write the steps once, give them a name, and then use the name whenever you need those steps. You have been using functions from day one: `printf` and `scanf` are cards somebody else wrote.',
      },
      { t: 'p', text: 'Here is a function of our own. It prints a line of dashes, and `main` uses it twice. `void` means “this function does a job but gives nothing back”.' },
      {
        t: 'try',
        code: fn(String.raw`void line() {
    printf("--------\n");
}`, String.raw`    line();
    printf("Welcome\n");
    line();`),
        output: '--------\nWelcome\n--------',
      },
      { t: 'p', text: 'Most functions **give a value back**. The type before the name says what kind of value, and `return` hands it over.' },
      {
        t: 'try',
        stdin: '7',
        code: fn(String.raw`int square(int n) {
    return n * n;
}`, String.raw`    int x;
    scanf("%d", &x);
    printf("%d\n", square(x));`),
        output: '49',
      },
      { t: 'analogy', text: 'A function is like a small machine in a workshop. You put ingredients in at the top (the **parameters**), the machine does its work, and a finished product comes out at the bottom (the **return value**). The caller does not need to know how the machine works inside.' },
      { t: 'h', text: 'The parts of a function' },
      {
        t: 'list',
        items: [
          '`int` is the **return type**: what kind of value comes back. Use `void` when nothing comes back.',
          '`square` is the **name**. Choose a name that says what the function does.',
          '`(int n)` is the **parameter list**: what the function needs. It can be empty, or hold several, like `(int a, int b)`.',
          '`return n * n;` sends the answer back and ends the function immediately.',
          'Each parameter needs **its own type**: `(int a, int b)`, never `(int a, b)`.',
        ],
      },
      {
        t: 'predict',
        code: fn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    printf("%d\n", add(add(1, 2), 3));`),
        question: 'What does this program print?',
        options: ['6', '3', '12', 'add'],
        answer: 0,
        explain: 'The inner call `add(1, 2)` is worked out first and gives 3. The outer call then becomes `add(3, 3)`, which gives 6. A call can be used anywhere a value is allowed, even as the argument of another call.',
      },
      { t: 'h', text: 'Prototypes: telling main about a function in advance' },
      { t: 'p', text: 'It is neat to keep `main` at the top and the functions below it, so a reader meets the big picture first. For that, put a one-line **prototype** (the function’s first line, ending with a semicolon) above `main`. It tells the computer “this function exists, here is what it takes and gives”.' },
      {
        t: 'try',
        stdin: '4',
        code: String.raw`#include <stdio.h>

int twice(int n);

int main() {
    int x;
    scanf("%d", &x);
    printf("Double: %d\n", twice(x));
    return 0;
}

int twice(int n) {
    return n * 2;
}
`,
        output: 'Double: 8',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that sends the answer back from the function.',
        template: fn(String.raw`int cube(int n) {
    ___ n * n * n;
}`, String.raw`    printf("%d\n", cube(3));`),
        blanks: [{ options: ['return', 'print', 'void'], answer: 'return' }],
        output: '27',
      },
      {
        t: 'bug',
        code: fn(String.raw`int add(int a, b) {
    return a + b;
}`, String.raw`    printf("%d\n", add(2, 3));`),
        question: 'This program refuses to run (“Parsing Failure”). What is wrong?',
        options: ['Every parameter needs its own type: `int a, int b`', 'A function cannot have two parameters', 'add must be written with a capital A', 'The function must be written below main'],
        answer: 0,
        explain: 'In a parameter list each name needs its type in front of it. `(int a, int b)` is right. `(int a, b)` leaves `b` without a type.',
        fixed: fn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    printf("%d\n", add(2, 3));`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: fn(String.raw`int sign(int x) {
    if (x > 0) {
        return 1;
    }
}`, String.raw`    printf("%d\n", sign(-5));`),
            why: 'When `x` is not positive the function reaches its closing bracket without a `return`, so there is no answer to give back. Make sure **every path** through a non-void function ends in a `return`.',
            right: fn(String.raw`int sign(int x) {
    if (x > 0) {
        return 1;
    }
    return 0;
}`, String.raw`    printf("%d\n", sign(-5));`),
          },
          {
            wrong: fn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    printf("%d\n", add(1));`),
            why: 'The function wants **two** values but the call gives only one. The number of arguments must match the number of parameters.',
            right: fn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    printf("%d\n", add(1, 2));`),
          },
          {
            logic: true,
            wrong: fn(String.raw`int square(int n) {
    return n * n;
}`, String.raw`    int x = 5;
    square(x);
    printf("%d\n", x);`),
            why: 'Calling `square(x)` works out 25 and then throws the answer away, because nothing catches it. `x` is still 5. Catch the result: `x = square(x);` or print it directly.',
            right: fn(String.raw`int square(int n) {
    return n * n;
}`, String.raw`    int x = 5;
    x = square(x);
    printf("%d\n", x);`),
          },
        ],
      },
      { t: 'quiz', question: 'What does `void` mean in front of a function name?', options: ['The function gives no value back', 'The function has no name', 'The function cannot be called', 'The function returns 0'], answer: 0, explain: '`void` means “nothing”. A `void` function does a job (like printing a line) but there is no value to catch.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 7): a banner and a line total',
        text: 'Two small functions make the till code easier to read. `banner` prints the heading and `line_total` multiplies price by quantity.',
        stdin: '1500 4',
        code: String.raw`#include <stdio.h>

void banner() {
    printf("=== CAMPUS DUUKA ===\n");
}

int line_total(int price, int qty) {
    return price * qty;
}

int main() {
    int price, qty;
    banner();
    scanf("%d %d", &price, &qty);
    printf("Total: %d\n", line_total(price, qty));
    return 0;
}
`,
        output: '=== CAMPUS DUUKA ===\nTotal: 6000',
      },
      {
        t: 'recap',
        items: ['A function is a named block of steps: `type name(parameters) { ... }`.', '`return value;` sends an answer back. `void` functions send nothing back.', 'The call must give the same number of arguments as the function has parameters.', 'A prototype above `main` lets you write the functions below it.'],
        memory: 'Name it, give it, return it.',
      },
    ],
    exercises: [
      {
        id: 'c11-square',
        title: 'The square function',
        prompt: 'Complete the function `square` so that it returns `n` times `n`. The program reads a number and prints `Square: 49` (for 7).',
        starter: fn(String.raw`int square(int n) {
    // return n times n
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Square: %d\n", square(n));`),
        sampleInput: '7',
        usesInput: true,
        tests: [
          { input: '7', expected: 'Square: 49' },
          { input: '0', expected: 'Square: 0' },
          { input: '-3', expected: 'Square: 9', hidden: true },
        ],
        hints: [
          'The function must give an answer back. The word for that is `return`.',
          'Write `return n * n;` inside the function.',
          'A similar example: `int twice(int n) { return n * 2; }` gives back double its input.',
        ],
      },
      {
        id: 'c11-max3',
        title: 'The biggest of three',
        prompt: 'Write the function `bigger(a, b)` that returns the larger of two numbers. Use it to print the biggest of three numbers like this: `Max: 9`.',
        starter: fn(String.raw`int bigger(int a, int b) {
    // return the larger of a and b
}`, String.raw`    int x, y, z;
    scanf("%d %d %d", &x, &y, &z);
    // Use bigger() to find the largest of x, y and z
`),
        sampleInput: '4 9 2',
        usesInput: true,
        tests: [
          { input: '4 9 2', expected: 'Max: 9' },
          { input: '10 3 7', expected: 'Max: 10' },
          { input: '1 2 8', expected: 'Max: 8' },
          { input: '-5 -2 -9', expected: 'Max: -2', hidden: true },
        ],
        hints: [
          'Inside `bigger`, compare `a` and `b` with an `if`, and `return` the larger one.',
          'To get the biggest of three, ask for the bigger of the first two, then the bigger of that and the third: `bigger(bigger(x, y), z)`.',
          'A similar example: `int smaller(int a, int b) { if (a < b) { return a; } return b; }`',
        ],
      },
      {
        id: 'c11-stars',
        title: 'A row of stars',
        prompt: 'Complete the `void` function `stars(n)` so that it prints `n` stars on one line, followed by a new line. The program reads `n` and calls it. For 4 it prints `****`.',
        starter: fn(String.raw`void stars(int n) {
    // print n stars, then a new line
}`, String.raw`    int n;
    scanf("%d", &n);
    stars(n);
    printf("Done\n");`),
        sampleInput: '4',
        usesInput: true,
        tests: [
          { input: '4', expected: '****\nDone' },
          { input: '1', expected: '*\nDone' },
          { input: '6', expected: '******\nDone', hidden: true },
        ],
        hints: [
          'Use a `for` loop inside the function that runs `n` times and prints one star each time.',
          'After the loop, print `\\n`. A `void` function needs no `return`.',
          'A similar example: `void dashes(int k) { int i; for (i = 0; i < k; i++) { printf("-"); } printf("\\n"); }`',
        ],
      },
    ],
  },

  // ================================================================== 12
  {
    id: 'c-params',
    level: LEVEL,
    minutes: 26,
    title: 'Parameters, scope, global and static variables',
    summary: 'Where variables live, who can see them, and how long they last',
    blocks: [
      {
        t: 'story',
        title: 'What happens in the kitchen',
        text: 'Mama Rose’s kitchen has its own sugar tin and its own knife. The cashier has her own tin for coins. Neither of them walks into the other’s area to use things. But the **price board** on the wall is for everybody.\n\nProgram variables work the same way. A variable made inside a function belongs to that function only. A variable declared outside every function, like the price board, can be seen by all of them.',
      },
      { t: 'h', text: 'Parameters are photocopies' },
      { t: 'p', text: 'When you call a function, C hands it a **copy** of each value. The function can scribble on its copy as much as it likes: the original does not change. This is called passing **by value**.' },
      {
        t: 'try',
        code: fn(String.raw`void bump(int x) {
    x = x + 1;
    printf("Inside: %d\n", x);
}`, String.raw`    int a = 1;
    bump(a);
    printf("Outside: %d\n", a);`),
        output: 'Inside: 2\nOutside: 1',
      },
      { t: 'analogy', text: 'You give the printer shop a **photocopy** of your form. They can write all over it, but your original stays clean in your bag.' },
      { t: 'h', text: 'Scope: who can see a variable' },
      {
        t: 'list',
        items: [
          'A **local** variable (made inside a function, or inside `{ }`) exists only there. It is created when the function starts and disappears when it ends.',
          'A **global** variable (made outside all functions) can be used by every function below it.',
          'If a local variable has the same name as a global one, the local one **hides** the global one inside that function.',
        ],
      },
      { t: 'tip', text: 'In real C, a function cannot see the local variables of the function that called it. This practice runner is more relaxed and sometimes lets it peek, but a real compiler (and your exam) will refuse. Never rely on it: pass values in as parameters.' },
      {
        t: 'predict',
        code: fn(String.raw`int x = 10;

void show() {
    int x = 5;
    printf("%d\n", x);
}`, String.raw`    show();
    printf("%d\n", x);`),
        question: 'What does this program print?',
        options: ['5\n10', '10\n10', '5\n5', '10\n5'],
        answer: 0,
        explain: 'Inside `show` the local `x` (5) hides the global `x`. In `main` there is no local `x`, so it uses the global one (10).',
      },
      { t: 'h', text: 'Global variables: use sparingly' },
      { t: 'p', text: 'A global variable keeps its value between calls, which is handy for something shared like a shop’s sales total. The danger is that any function can change it, so bugs are harder to find. Keep globals for things that are truly shared.' },
      {
        t: 'try',
        code: fn(String.raw`int sales = 0;

void record_sale(int amount) {
    sales = sales + amount;
}`, String.raw`    record_sale(2500);
    record_sale(1000);
    printf("Sales today: %d\n", sales);`),
        output: 'Sales today: 3500',
      },
      { t: 'h', text: 'static: a local variable with a memory' },
      { t: 'p', text: 'A normal local variable is born fresh on every call. Put `static` in front and it is created **once** and remembers its value between calls, yet it stays private to its function. This is perfect for a ticket number counter.' },
      {
        t: 'try',
        code: fn(String.raw`void visit() {
    static int count = 0;
    count++;
    printf("Visit %d\n", count);
}`, String.raw`    visit();
    visit();
    visit();`),
        output: 'Visit 1\nVisit 2\nVisit 3',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the counter remembers its value and prints Visit 1, Visit 2, Visit 3.',
        template: fn(String.raw`void visit() {
    ___ int n = 0;
    n++;
    printf("Visit %d\n", n);
}`, String.raw`    visit();
    visit();
    visit();`),
        blanks: [{ options: ['static', 'const', 'auto'], answer: 'static' }],
        output: 'Visit 1\nVisit 2\nVisit 3',
      },
      {
        t: 'bug',
        code: fn('', String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        int square = i * i;
    }
    printf("%d\n", square);`),
        question: 'This program stops with an error saying `square` does not exist. Why?',
        options: ['`square` was made inside the loop’s curly brackets, so it disappears when the loop ends', 'square must be a float', 'printf cannot print a variable', 'The loop must start at 0'],
        answer: 0,
        explain: 'A variable lives only inside the pair of curly brackets where it was made. Outside them it does not exist. To use the value afterwards, declare the variable **before** the loop: `int square;`, and assign to it inside.',
        fixed: fn('', String.raw`    int i, square = 0;
    for (i = 1; i <= 3; i++) {
        square = i * i;
    }
    printf("%d\n", square);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: fn('', String.raw`    int i;
    for (i = 1; i <= 3; i++) {
        int bonus = 100;
    }
    printf("%d\n", bonus);`),
            why: '`bonus` was made inside the loop’s curly brackets and is gone once the loop ends. Declare it before the loop if you need it afterwards.',
            right: fn('', String.raw`    int i;
    int bonus = 100;
    for (i = 1; i <= 3; i++) {
        bonus = bonus + 1;
    }
    printf("%d\n", bonus);`),
          },
          {
            logic: true,
            wrong: fn(String.raw`void swap(int a, int b) {
    int t = a;
    a = b;
    b = t;
}`, String.raw`    int x = 1, y = 2;
    swap(x, y);
    printf("%d %d\n", x, y);`),
            why: 'The function swaps its two **copies**, then they vanish. `x` and `y` in `main` are untouched and it prints `1 2`. Changing the caller’s variables needs pointers (Level 5).',
            right: fn(String.raw`int bigger(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}`, String.raw`    int x = 1, y = 2;
    printf("%d\n", bigger(x, y));`),
          },
          {
            logic: true,
            wrong: fn(String.raw`int count = 0;

void hit() {
    int count = 0;
    count++;
}`, String.raw`    hit();
    hit();
    printf("%d\n", count);`),
            why: 'Writing `int count` inside `hit` makes a **new** local variable that hides the global one. The global `count` never changes and the program prints 0. Remove the word `int` so the function uses the global.',
            right: fn(String.raw`int count = 0;

void hit() {
    count++;
}`, String.raw`    hit();
    hit();
    printf("%d\n", count);`),
          },
        ],
      },
      { t: 'quiz', question: 'A function changes its parameter `x` from 1 to 99. What is the caller’s own variable afterwards?', options: ['Still 1: the function worked on a copy', '99', 'Undefined', '0'], answer: 0, explain: 'Parameters are passed by value, so the function only ever sees a copy.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 8): receipts and sales',
        text: 'A `static` counter gives each receipt its own number, and a global total keeps the day’s sales.',
        code: String.raw`#include <stdio.h>

int sales = 0;

int next_receipt() {
    static int number = 0;
    number++;
    return number;
}

void sell(int amount) {
    int r = next_receipt();
    sales = sales + amount;
    printf("Receipt %d: %d\n", r, amount);
}

int main() {
    sell(2500);
    sell(1000);
    sell(4000);
    printf("Sales today: %d\n", sales);
    return 0;
}
`,
        output: 'Receipt 1: 2500\nReceipt 2: 1000\nReceipt 3: 4000\nSales today: 7500',
      },
      {
        t: 'recap',
        items: ['Arguments are **copied** into parameters. The function cannot change the caller’s variables.', 'Local variables live inside their function only. Globals are visible everywhere below them.', 'A local with the same name as a global hides it.', '`static` makes a local variable remember its value between calls.'],
        memory: 'Local is private, global is shared, static remembers.',
      },
    ],
    exercises: [
      {
        id: 'c12-fee',
        title: 'Mobile Money fee',
        prompt: 'Complete the function `fee(amount)` that returns the withdrawal fee: **100** for amounts up to 5000, **500** for amounts up to 50000, and **1000** for anything bigger.\n\nThe program prints `Fee: 500` (for 20000).',
        starter: fn(String.raw`int fee(int amount) {
    // return the fee
}`, String.raw`    int amount;
    scanf("%d", &amount);
    printf("Fee: %d\n", fee(amount));`),
        sampleInput: '20000',
        usesInput: true,
        tests: [
          { input: '3000', expected: 'Fee: 100' },
          { input: '20000', expected: 'Fee: 500' },
          { input: '80000', expected: 'Fee: 1000' },
          { input: '5000', expected: 'Fee: 100', name: 'Exactly 5000', hidden: true },
          { input: '50000', expected: 'Fee: 500', name: 'Exactly 50000', hidden: true },
        ],
        hints: [
          'Use an `if` chain inside the function and `return` a number in each branch.',
          'Check the smallest limit first: `if (amount <= 5000) return 100;` then `if (amount <= 50000) return 500;` and finally `return 1000;`.',
          'A similar example: `if (km <= 5) { return 2000; } if (km <= 20) { return 5000; } return 10000;`',
        ],
      },
      {
        id: 'c12-ticket',
        title: 'Queue tickets',
        prompt: 'The function `next_ticket()` must give out ticket numbers 1, 2, 3 and so on, remembering the last one between calls (use `static`). The program reads how many tickets to give and prints each one like `Ticket 1`.',
        starter: fn(String.raw`int next_ticket() {
    // give out 1, 2, 3, ... remembering the last number
}`, String.raw`    int n, i, t;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        t = next_ticket();
        printf("Ticket %d\n", t);
    }`),
        sampleInput: '3',
        usesInput: true,
        tests: [
          { input: '3', expected: 'Ticket 1\nTicket 2\nTicket 3' },
          { input: '1', expected: 'Ticket 1' },
          { input: '5', expected: 'Ticket 1\nTicket 2\nTicket 3\nTicket 4\nTicket 5', hidden: true },
        ],
        hints: [
          'The function needs a variable that is **not** reset on every call. That is what `static` is for.',
          'Inside the function: `static int last = 0;` then `last++;` then `return last;`.',
          'A similar example: `int next_id() { static int id = 100; id++; return id; }` gives 101, 102, 103...',
        ],
      },
      {
        id: 'c12-power',
        title: 'Power',
        prompt: 'Complete `power(base, exp)` so it returns `base` multiplied by itself `exp` times. The program reads two numbers and prints `Power: 1024` (for 2 and 10).',
        starter: fn(String.raw`int power(int base, int exp) {
    // multiply base by itself exp times
}`, String.raw`    int b, e;
    scanf("%d %d", &b, &e);
    printf("Power: %d\n", power(b, e));`),
        sampleInput: '2 10',
        usesInput: true,
        tests: [
          { input: '2 10', expected: 'Power: 1024' },
          { input: '3 4', expected: 'Power: 81' },
          { input: '5 0', expected: 'Power: 1', name: 'Anything to the power 0' },
          { input: '7 1', expected: 'Power: 7', hidden: true },
        ],
        hints: [
          'Start a result at 1 and multiply it by `base` once for every round of a loop.',
          '`int result = 1; int i; for (i = 0; i < exp; i++) { result = result * base; } return result;`',
          'A similar example: adding `step` to a total `times` times gives `step * times`. Here you multiply instead of add, and start at 1 instead of 0.',
        ],
      },
    ],
  },

  // ================================================================== 13
  {
    id: 'c-recursion',
    level: LEVEL,
    minutes: 26,
    title: 'Recursion: a function that calls itself',
    summary: 'Base case, recursive case, and how the calls stack up',
    blocks: [
      {
        t: 'story',
        title: 'How many people are in front of me?',
        text: 'You are standing in a long queue at the bank and want to know your position. You cannot see the front. So you ask the person ahead of you, “How many people are in front of you?” and add one. That person asks the one ahead of **them**, and so on, until somebody at the very front says “Nobody, I am first.”\n\nThen the answers travel back down the queue, each person adding one. The question was passed on again and again, with the same wording, to a slightly smaller queue. That is **recursion**.',
      },
      { t: 'p', text: 'A recursive function solves a problem by calling **itself** on a smaller version of the same problem. It always needs two things:' },
      {
        t: 'list',
        items: ['A **base case**: the easy situation where it answers directly and stops (“I am first in the queue”).', 'A **recursive case**: it calls itself with a **smaller** problem and uses the answer.'],
      },
      {
        t: 'try',
        stdin: '5',
        code: fn(String.raw`int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("%d! = %d\n", n, fact(n));`),
        output: '5! = 120',
      },
      { t: 'analogy', text: 'Think of Russian nesting dolls. To find out how many dolls there are, open the big one: it holds a smaller doll with the same puzzle inside. You keep opening until you reach the tiny solid doll (the base case), then count back out.' },
      {
        t: 'predict',
        code: fn(String.raw`void countdown(int n) {
    if (n == 0) {
        printf("Go!\n");
        return;
    }
    printf("%d\n", n);
    countdown(n - 1);
}`, String.raw`    countdown(3);`),
        question: 'What does this program print?',
        options: ['3\n2\n1\nGo!', 'Go!\n1\n2\n3', '3\n2\n1', 'Go!'],
        answer: 0,
        explain: 'Each call prints its own number **first** and then calls itself with a smaller number. When `n` reaches 0 the base case prints Go! and stops.',
      },
      { t: 'p', text: 'Now move the `printf` to **after** the recursive call. The order flips, because the printing waits until the deeper calls have finished.' },
      {
        t: 'predict',
        code: fn(String.raw`void show(int n) {
    if (n == 0) {
        return;
    }
    show(n - 1);
    printf("%d\n", n);
}`, String.raw`    show(3);`),
        question: 'What does this program print?',
        options: ['1\n2\n3', '3\n2\n1', '3', '0\n1\n2\n3'],
        answer: 0,
        explain: '`show(3)` first calls `show(2)`, which first calls `show(1)`, which first calls `show(0)`. Only when the deepest call returns does `show(1)` print 1, then `show(2)` prints 2, then `show(3)` prints 3.',
      },
      { t: 'h', text: 'Another example: adding digits' },
      { t: 'p', text: 'The digit sum of 1234 is 4 plus the digit sum of 123. The smaller problem is “the same number without its last digit”, and the base case is a number with only one digit.' },
      {
        t: 'try',
        stdin: '1234',
        code: fn(String.raw`int digit_sum(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + digit_sum(n / 10);
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Digit sum: %d\n", digit_sum(n));`),
        output: 'Digit sum: 10',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the recursive call works on a **smaller** number.',
        template: fn(String.raw`int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n ___ 1);
}`, String.raw`    printf("%d\n", fact(4));`),
        blanks: [{ options: ['-', '+', '*'], answer: '-' }],
        output: '24',
      },
      {
        t: 'bug',
        code: fn(String.raw`int fact(int n) {
    return n * fact(n - 1);
}`, String.raw`    printf("%d\n", fact(4));`),
        question: 'This program stops with an error about the call stack. What is missing?',
        options: ['A base case, so it keeps calling itself forever', 'A semicolon after the function', 'The parameter should be a float', 'The function should be void'],
        answer: 0,
        explain: 'Without a base case nothing ever stops the calls: `fact(4)` calls `fact(3)`, then `fact(2)`, `fact(1)`, `fact(0)`, `fact(-1)`... until the computer runs out of room (a **stack overflow**). Always write the base case first.',
        fixed: fn(String.raw`int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, String.raw`    printf("%d\n", fact(4));`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: fn(String.raw`int sum_to(int n) {
    return n + sum_to(n - 1);
}`, String.raw`    printf("%d\n", sum_to(3));`),
            why: 'There is no base case, so the calls never stop. Add `if (n == 0) { return 0; }` at the top.',
            right: fn(String.raw`int sum_to(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sum_to(n - 1);
}`, String.raw`    printf("%d\n", sum_to(3));`),
          },
          {
            logic: true,
            wrong: fn(String.raw`int fact(int n) {
    if (n <= 1) {
        return 0;
    }
    return n * fact(n - 1);
}`, String.raw`    printf("%d\n", fact(4));`),
            why: 'The base case returns 0 instead of 1. Every answer is then multiplied by 0, so the program prints 0 for everything. The base case value must fit the maths: 1 is the “do nothing” number for multiplication.',
            right: fn(String.raw`int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, String.raw`    printf("%d\n", fact(4));`),
          },
          {
            wrong: fn(String.raw`int sum_to(int n) {
    if (n == 0) {
        return 0;
    }
    n + sum_to(n - 1);
}`, String.raw`    printf("%d\n", sum_to(3));`),
            why: 'The recursive line forgot the word `return`, so the answer is worked out and then thrown away. A recursive case must `return` what it computes.',
            right: fn(String.raw`int sum_to(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sum_to(n - 1);
}`, String.raw`    printf("%d\n", sum_to(3));`),
          },
        ],
      },
      { t: 'quiz', question: 'What is the job of the base case?', options: ['To stop the recursion by answering directly', 'To start the recursion', 'To print the result', 'To make the function faster'], answer: 0, explain: 'The base case is the situation where the function does not call itself. Without it the calls would never end.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 9): the tray pyramid',
        text: 'Mama Rose stacks mandazi trays in a pyramid: the top row has 1 tray, the next 2, and so on. How many trays are in a pyramid of 4 rows? A recursive function counts them: the bottom row plus the pyramid above it.',
        code: String.raw`#include <stdio.h>

int trays(int rows) {
    if (rows == 0) {
        return 0;
    }
    return rows + trays(rows - 1);
}

int main() {
    printf("4 rows need %d trays\n", trays(4));
    return 0;
}
`,
        output: '4 rows need 10 trays',
      },
      {
        t: 'recap',
        items: ['A recursive function calls itself on a smaller problem.', 'It needs a **base case** (stop) and a **recursive case** (smaller call).', 'Always make sure each call moves **towards** the base case.', 'No base case means the calls never end and the program stops with a stack error.'],
        memory: 'Base case first, then shrink.',
      },
    ],
    exercises: [
      {
        id: 'c13-factorial',
        title: 'Factorial',
        prompt: 'Complete the recursive function `fact(n)`. The factorial of n is n × (n-1) × ... × 1, and `fact(0)` is 1. The program prints like `Factorial: 120` (for 5).',
        starter: fn(String.raw`int fact(int n) {
    // base case, then the recursive case
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Factorial: %d\n", fact(n));`),
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: 'Factorial: 120' },
          { input: '1', expected: 'Factorial: 1' },
          { input: '0', expected: 'Factorial: 1', name: 'Zero' },
          { input: '8', expected: 'Factorial: 40320', hidden: true },
        ],
        hints: [
          'The base case: when `n` is 0 or 1 the answer is 1.',
          'Otherwise the answer is `n` times the factorial of `n - 1`: `return n * fact(n - 1);`.',
          'A similar example: `int sum_to(int n) { if (n == 0) { return 0; } return n + sum_to(n - 1); }` adds instead of multiplies.',
        ],
      },
      {
        id: 'c13-sumto',
        title: 'Add 1 to N by recursion',
        prompt: 'Complete the recursive function `sum_to(n)` that returns 1 + 2 + ... + n. Do **not** use a loop. The program prints like `Sum: 15` (for 5).',
        starter: fn(String.raw`int sum_to(int n) {
    // base case, then the recursive case
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Sum: %d\n", sum_to(n));`),
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: 'Sum: 15' },
          { input: '1', expected: 'Sum: 1' },
          { input: '0', expected: 'Sum: 0', hidden: true },
          { input: '100', expected: 'Sum: 5050', hidden: true },
        ],
        hints: [
          'The sum of 1 to 0 is 0. That is the base case.',
          'The sum of 1 to `n` is `n` plus the sum of 1 to `n - 1`.',
          'A similar example: the digit sum in this lesson also adds a small piece (the last digit) to a smaller call.',
        ],
      },
      {
        id: 'c13-fib',
        title: 'Fibonacci',
        prompt: 'The Fibonacci numbers go 0, 1, 1, 2, 3, 5, 8, ... Each one is the sum of the two before it. Complete the recursive function `fib(n)` (`fib(0)` is 0 and `fib(1)` is 1). The program prints like `Fib: 55` (for 10).',
        starter: fn(String.raw`int fib(int n) {
    // two base cases, then the recursive case
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Fib: %d\n", fib(n));`),
        sampleInput: '10',
        usesInput: true,
        tests: [
          { input: '10', expected: 'Fib: 55' },
          { input: '0', expected: 'Fib: 0' },
          { input: '1', expected: 'Fib: 1' },
          { input: '7', expected: 'Fib: 13', hidden: true },
        ],
        hints: [
          'There are two base cases: `fib(0)` is 0 and `fib(1)` is 1. You can write them together: `if (n < 2) { return n; }`.',
          'Otherwise add the two previous numbers: `return fib(n - 1) + fib(n - 2);`.',
          'A similar example: `trays(rows)` in the project step adds the current row to a call on the smaller pyramid. Here you add **two** smaller calls.',
        ],
      },
    ],
  },

  // ================================================================== 14
  {
    id: 'c-momo',
    level: LEVEL,
    minutes: 30,
    title: 'Project: a Mobile Money menu',
    summary: 'Use functions, a global balance, a switch and a loop to build a working Mobile Money menu',
    blocks: [
      {
        t: 'story',
        title: 'Kato at the kiosk',
        text: 'Kato runs a Mobile Money kiosk at the campus gate. All day people ask him to deposit, withdraw and check their balance. He wants a small program that shows a menu and does what the customer asks, and charges the right fee on withdrawals.\n\nLast level you built the till with one long `main`. This time you split the job into **functions**, one per task, so that `main` reads like a menu.',
      },
      { t: 'h', text: 'Plan' },
      {
        t: 'list',
        items: ['`balance` is a **global** variable, because every function needs it.', '`fee(amount)` returns the withdrawal fee (100, 500 or 1000).', '`deposit(amount)` adds money and says so.', '`withdraw(amount)` checks amount **plus fee** against the balance, and only then takes the money.', '`show()` prints the balance.', '`main` loops: read a choice, `switch` on it, call the right function, stop at 0.'],
      },
      {
        t: 'project',
        title: 'Piece 1: the helper functions',
        text: 'First test the functions alone, without the menu. The customer starts with 20,000 shillings.',
        code: String.raw`#include <stdio.h>

int balance = 20000;

int fee(int amount) {
    if (amount <= 5000) {
        return 100;
    }
    if (amount <= 50000) {
        return 500;
    }
    return 1000;
}

void deposit(int amount) {
    balance = balance + amount;
    printf("Deposited %d\n", amount);
}

void withdraw(int amount) {
    int total = amount + fee(amount);
    if (total > balance) {
        printf("Not enough balance\n");
    } else {
        balance = balance - total;
        printf("Withdrew %d (fee %d)\n", amount, fee(amount));
    }
}

void show() {
    printf("Balance: %d\n", balance);
}

int main() {
    deposit(5000);
    withdraw(3000);
    show();
    return 0;
}
`,
        output: 'Deposited 5000\nWithdrew 3000 (fee 100)\nBalance: 21900',
      },
      { t: 'p', text: 'Now put the menu on top. Because the functions do the work, `main` stays short and easy to read. The input is a list of `choice` (and `amount` for choices 1 and 2). A 0 ends the program.' },
      {
        t: 'project',
        title: 'The finished Mobile Money menu',
        text: 'The input `1 5000  2 3000  2 30000  3  0` deposits 5000, withdraws 3000, tries to withdraw 30000, shows the balance and quits.',
        stdin: '1 5000 2 3000 2 30000 3 0',
        code: String.raw`#include <stdio.h>

int balance = 20000;

int fee(int amount) {
    if (amount <= 5000) {
        return 100;
    }
    if (amount <= 50000) {
        return 500;
    }
    return 1000;
}

void deposit(int amount) {
    balance = balance + amount;
    printf("Deposited %d\n", amount);
}

void withdraw(int amount) {
    int total = amount + fee(amount);
    if (total > balance) {
        printf("Not enough balance\n");
    } else {
        balance = balance - total;
        printf("Withdrew %d (fee %d)\n", amount, fee(amount));
    }
}

void show() {
    printf("Balance: %d\n", balance);
}

int main() {
    int choice, amount;
    scanf("%d", &choice);
    while (choice != 0) {
        switch (choice) {
            case 1:
                scanf("%d", &amount);
                deposit(amount);
                break;
            case 2:
                scanf("%d", &amount);
                withdraw(amount);
                break;
            case 3:
                show();
                break;
            default:
                printf("Invalid choice\n");
        }
        scanf("%d", &choice);
    }
    return 0;
}
`,
        output: 'Deposited 5000\nWithdrew 3000 (fee 100)\nNot enough balance\nBalance: 21900',
      },
      {
        t: 'predict',
        stdin: '2 20000 3 0',
        code: String.raw`#include <stdio.h>

int balance = 20000;

void withdraw(int amount) {
    int fee = 500;
    if (amount + fee > balance) {
        printf("Not enough balance\n");
    } else {
        balance = balance - amount - fee;
        printf("Done\n");
    }
}

int main() {
    int choice, amount;
    scanf("%d", &choice);
    while (choice != 0) {
        if (choice == 2) {
            scanf("%d", &amount);
            withdraw(amount);
        } else {
            printf("Balance: %d\n", balance);
        }
        scanf("%d", &choice);
    }
    return 0;
}
`,
        question: 'The balance is 20,000 and the customer withdraws 20,000 (the fee is 500). Then they check the balance. What is printed?',
        options: ['Not enough balance\nBalance: 20000', 'Done\nBalance: 0', 'Done\nBalance: -500', 'Balance: 20000'],
        answer: 0,
        explain: 'The withdrawal needs 20,000 + 500 = 20,500, which is more than the balance, so it is refused and the balance stays 20,000. Always check the amount **plus the fee**, not just the amount.',
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            stdin: '1 1000 3 0',
            wrong: String.raw`#include <stdio.h>

int balance = 0;

void deposit(int amount) {
    int balance = 0;
    balance = balance + amount;
}

int main() {
    int choice, amount;
    scanf("%d", &choice);
    while (choice != 0) {
        if (choice == 1) {
            scanf("%d", &amount);
            deposit(amount);
        } else {
            printf("Balance: %d\n", balance);
        }
        scanf("%d", &choice);
    }
    return 0;
}
`,
            why: 'Writing `int balance` inside `deposit` makes a new local variable that hides the global one. The deposit is added to the copy that disappears, and the menu still shows 0. Leave out the `int` so the function uses the global.',
            right: String.raw`#include <stdio.h>

int balance = 0;

void deposit(int amount) {
    balance = balance + amount;
}

int main() {
    int choice, amount;
    scanf("%d", &choice);
    while (choice != 0) {
        if (choice == 1) {
            scanf("%d", &amount);
            deposit(amount);
        } else {
            printf("Balance: %d\n", balance);
        }
        scanf("%d", &choice);
    }
    return 0;
}
`,
          },
        ],
      },
      { t: 'quiz', question: 'Why is `balance` declared as a global variable in this project?', options: ['Because several functions must read and change the same value', 'Because C only allows integers to be global', 'Because main cannot have variables', 'To make the program faster'], answer: 0, explain: '`deposit`, `withdraw` and `show` all need the same balance. A global variable is shared by all functions below it. (Later, with pointers, you will learn a safer way.)' },
      {
        t: 'recap',
        items: ['Split a program into functions, one job each. `main` then reads like a plan.', 'A global variable is shared state: use it only for things every function truly needs.', 'Check the amount **plus the fee** before taking money out.', 'A `while` loop with a `switch` inside is the classic menu shape.'],
        memory: 'One job per function.',
      },
    ],
    exercises: [
      {
        id: 'c14-airtime',
        title: 'Airtime wallet',
        prompt: 'Read the starting balance. Then read commands until 0:\n\n`1 amount` buys airtime. If the amount is more than the balance print `Not enough balance`, otherwise subtract it and print `Bought <amount>`.\n`2` prints `Balance: <balance>`.\n\nUse functions `buy(amount)` and `show()` and a global `balance`.',
        starter: fn(String.raw`int balance;

void buy(int amount) {
    // check, subtract and print
}

void show() {
    // print the balance
}`, String.raw`    int choice, amount;
    scanf("%d", &balance);
    scanf("%d", &choice);
    while (choice != 0) {
        // 1 amount: buy, 2: show
        scanf("%d", &choice);
    }`),
        sampleInput: '10000 1 2000 2 1 9000 2 0',
        usesInput: true,
        tests: [
          { input: '10000 1 2000 2 1 9000 2 0', expected: 'Bought 2000\nBalance: 8000\nNot enough balance\nBalance: 8000' },
          { input: '500 2 0', expected: 'Balance: 500' },
          { input: '1000 1 1000 2 0', expected: 'Bought 1000\nBalance: 0', name: 'Spend everything', hidden: true },
          { input: '300 0', expected: '', name: 'Quit at once', hidden: true },
        ],
        hints: [
          'Inside the loop, use an `if` (or `switch`) on `choice`. For choice 1 you must read the amount first.',
          '`buy`: `if (amount > balance) { printf("Not enough balance\\n"); } else { balance = balance - amount; printf("Bought %d\\n", amount); }`',
          'A similar example: the `withdraw` function in this lesson. Yours has no fee, so it is a little simpler.',
        ],
      },
    ],
  },

  // ================================================================== 15
  {
    id: 'c-debug',
    level: LEVEL,
    minutes: 26,
    title: 'Finding bugs: errors, dry runs and testing',
    summary: 'The three kinds of error, tracing a program by hand and choosing good test cases',
    blocks: [
      {
        t: 'story',
        title: 'The till that gave the wrong change',
        text: 'On Friday the campus duuka’s new till gave a student 500 shillings too little change. Mama Rose did not throw the till away. She sat down with the program, followed it step by step with a pencil, and found the line that was wrong.\n\nProgrammers spend more time **finding** mistakes than writing code. The good news is that finding bugs is a skill with clear methods, and you are about to learn them.',
      },
      { t: 'h', text: 'Three kinds of error' },
      {
        t: 'list',
        items: [
          '**Syntax error**: you broke the grammar of C (a missing `;`, a missing bracket, a word the computer does not know). The program will not even start, and the message names a line.',
          '**Runtime error**: the program starts but crashes in the middle (for example dividing by zero or a function that never ends).',
          '**Logic error**: the program runs happily and prints a **wrong answer**. No message appears. These are the hardest to find.',
        ],
      },
      {
        t: 'bug',
        code: fn('', String.raw`    int price = 500;
    total = price * 2;
    printf("%d\n", total);`),
        question: 'This program will not run and complains that `total` does not exist. What kind of mistake is it?',
        options: ['A variable was used without being declared first', 'A divide-by-zero crash', 'A logic error in the maths', 'A missing return'],
        answer: 0,
        explain: 'Every variable must be declared (`int total;`) before it is used. The message points at the line that uses it, which is where to start looking.',
        fixed: fn('', String.raw`    int price = 500;
    int total;
    total = price * 2;
    printf("%d\n", total);`),
      },
      {
        t: 'bug',
        code: fn('', String.raw`    int people = 0;
    int share = 6000 / people;
    printf("%d\n", share);`),
        question: 'This program starts, then stops with an error while running. What happened?',
        options: ['It divided by zero, which is impossible', 'It forgot a semicolon', 'The variable share is too long', 'Nothing: it is a logic error'],
        answer: 0,
        explain: 'Dividing by 0 has no answer, so the program stops while it is running. This is a **runtime** error. The fix is to check before dividing: `if (people > 0) { ... }`.',
        fixed: fn('', String.raw`    int people = 3;
    int share = 6000 / people;
    printf("%d\n", share);`),
      },
      { t: 'h', text: 'Logic errors: the quiet ones' },
      { t: 'p', text: 'This program has no syntax or runtime error. Can you spot why its answer is wrong?' },
      {
        t: 'predict',
        code: fn('', String.raw`    float average = (85 + 80) / 2;
    printf("%.1f\n", average);`),
        question: 'The correct average of 85 and 80 is 82.5. What does this program print?',
        options: ['82.0', '82.5', '83.0', '165.0'],
        answer: 0,
        explain: '`(85 + 80) / 2` is a division of two **integers**, so C throws away the .5 **before** storing the result into a float. Fix it by making one side a decimal: `(85 + 80) / 2.0`.',
      },
      { t: 'h', text: 'The dry run: be the computer' },
      { t: 'p', text: 'When the answer is wrong, do not guess. Follow the program with a pencil, line by line, and write down the value of every variable after each step. This table is called a **trace table**. Here it is for a program that adds the doubles of 1 to 4:' },
      {
        t: 'code',
        text: String.raw`int i, total = 0;
for (i = 1; i <= 4; i++) {
    total = total + i * 2;
}

 i | total
---+------
 1 |   2
 2 |   6
 3 |  12
 4 |  20`,
      },
      {
        t: 'predict',
        code: fn('', String.raw`    int i, total = 0;
    for (i = 1; i <= 4; i++) {
        total = total + i * 2;
    }
    printf("%d\n", total);`),
        question: 'Using the trace table above, what does the program print?',
        options: ['20', '10', '12', '8'],
        answer: 0,
        explain: 'The last row of the trace table shows total = 20 when i = 4, and then the loop ends and 20 is printed.',
      },
      { t: 'h', text: 'Print debugging: ask the program what it is thinking' },
      { t: 'p', text: 'Add temporary `printf` lines that show the values you are unsure about. Run it, read the values, find where reality stops matching your idea, and then **delete** the debug lines.' },
      {
        t: 'try',
        stdin: '3 70 85 60',
        code: String.raw`#include <stdio.h>

int main() {
    int n, i, mark, total = 0;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        scanf("%d", &mark);
        total = total + mark;
        printf("DEBUG: i=%d mark=%d total=%d\n", i, mark, total);
    }
    printf("Average: %d\n", total / n);
    return 0;
}
`,
        output: 'DEBUG: i=1 mark=70 total=70\nDEBUG: i=2 mark=85 total=155\nDEBUG: i=3 mark=60 total=215\nAverage: 71',
      },
      { t: 'h', text: 'Testing: try to break your own program' },
      {
        t: 'list',
        items: ['**Normal** values: the ones you expect (a mark of 65).', '**Boundary** values: exactly on the edge (49, 50 and 51 when the pass mark is 50). Most bugs hide here.', '**Strange** values: zero, a negative number, the biggest or smallest allowed value.', 'Work out the **expected** answer by hand **before** you run the program.'],
      },
      {
        t: 'try',
        code: fn(String.raw`int discount(int total) {
    if (total >= 5000) {
        return total / 10;
    }
    return 0;
}`, String.raw`    printf("%d\n", discount(4999));
    printf("%d\n", discount(5000));
    printf("%d\n", discount(5001));`),
        output: '0\n500\n500',
      },
      {
        t: 'fill',
        prompt: 'A student with exactly 50 marks should pass. Fill the gap with the right comparison.',
        template: fn('', String.raw`    int marks = 50;
    if (marks ___ 50) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }`),
        blanks: [{ options: ['>=', '>', '<'], answer: '>=' }],
        output: 'Pass',
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: fn('', String.raw`    int a = 7, b = 2;
    float result = a / b;
    printf("%.1f\n", result);`),
            why: 'Integer divided by integer is an integer: 7 / 2 is 3, so you get 3.0 instead of 3.5. Make one side a decimal: `a / 2.0`, or cast: `(float)a / b`.',
            right: fn('', String.raw`    int a = 7, b = 2;
    float result = (float)a / b;
    printf("%.1f\n", result);`),
          },
          {
            logic: true,
            wrong: fn('', String.raw`    int i;
    for (i = 1; i < 5; i++) {
        printf("%d\n", i);
    }`),
            why: 'The aim was to print 1 to 5 but `i < 5` stops at 4: an off-by-one mistake. A trace table makes it obvious: the loop never runs with i = 5. Check the **last** round when you test loops.',
            right: fn('', String.raw`    int i;
    for (i = 1; i <= 5; i++) {
        printf("%d\n", i);
    }`),
          },
          {
            wrong: fn('', String.raw`    int total;
    total = total + 500;
    printf("%d\n", total);`),
            why: '`total` was never given a starting value, so the first `total + 500` has nothing to add to. Real C would print a random number; this runner stops with an error. Always start variables with a value: `int total = 0;`.',
            right: fn('', String.raw`    int total = 0;
    total = total + 500;
    printf("%d\n", total);`),
          },
        ],
      },
      { t: 'quiz', question: 'A program runs without any error message but prints the wrong total. What kind of error is it?', options: ['A logic error', 'A syntax error', 'A runtime error', 'A hardware error'], answer: 0, explain: 'The computer did exactly what you wrote, but what you wrote was not what you meant. Only testing and tracing find these.' },
      {
        t: 'project',
        title: 'The Campus Duuka (step 10): test the discount',
        text: 'A good test prints the answers for the boundary values. Change the function and watch the results change. This is how you would check the discount rule from the till.',
        code: String.raw`#include <stdio.h>

int pay(int total) {
    int discount = 0;
    if (total >= 5000) {
        discount = total / 10;
    }
    return total - discount;
}

int main() {
    printf("4999 -> %d\n", pay(4999));
    printf("5000 -> %d\n", pay(5000));
    printf("20000 -> %d\n", pay(20000));
    printf("0 -> %d\n", pay(0));
    return 0;
}
`,
        output: '4999 -> 4999\n5000 -> 4500\n20000 -> 18000\n0 -> 0',
      },
      {
        t: 'recap',
        items: ['Syntax errors stop the program from starting, runtime errors crash it halfway, logic errors give wrong answers silently.', 'A **dry run** with a trace table shows what the program really does.', '`printf` lines are a quick way to look inside a running program. Remove them afterwards.', 'Test **boundary** values and strange values, and know the expected answer before you run.'],
        memory: 'Trace it, print it, test the edges.',
      },
    ],
    exercises: [
      {
        id: 'c15-fixavg',
        title: 'Fix the average',
        prompt: 'This program should read three whole-number marks and print their average with two decimals, like `Average: 82.33`. It has a logic error. Find it and fix it.',
        starter: String.raw`#include <stdio.h>

int main() {
    int a, b, c;
    float average;
    scanf("%d %d %d", &a, &b, &c);
    average = (a + b + c) / 3;
    printf("Average: %.2f\n", average);
    return 0;
}
`,
        sampleInput: '85 80 82',
        usesInput: true,
        tests: [
          { input: '85 80 82', expected: 'Average: 82.33' },
          { input: '60 70 80', expected: 'Average: 70.00' },
          { input: '50 51 51', expected: 'Average: 50.67', hidden: true },
        ],
        hints: [
          'Run the program with 85 80 82. Work out by hand what the average should be, then compare with what it prints.',
          'The sum is divided by an **integer** 3, so the decimals are thrown away before the answer is stored.',
          'Divide by `3.0` instead of `3`. A similar example: `half = total / 2.0;` keeps the .5.',
        ],
      },
      {
        id: 'c15-fixloop',
        title: 'Fix the countdown',
        prompt: 'This program should read N and print N, N-1, ... down to 1, each on its own line. It has an off-by-one mistake. Fix it.',
        starter: String.raw`#include <stdio.h>

int main() {
    int n, i;
    scanf("%d", &n);
    for (i = n; i > 1; i--) {
        printf("%d\n", i);
    }
    return 0;
}
`,
        sampleInput: '4',
        usesInput: true,
        tests: [
          { input: '4', expected: '4\n3\n2\n1' },
          { input: '1', expected: '1' },
          { input: '3', expected: '3\n2\n1', hidden: true },
        ],
        hints: [
          'Run it with 3. Which number is missing from the end?',
          'The loop stops before it prints 1. Look at the comparison in the middle of the `for`.',
          'Change `i > 1` to `i >= 1`. A similar example: `for (i = 10; i >= 7; i--)` prints 10, 9, 8 and 7.',
        ],
      },
      {
        id: 'c15-fixgrade',
        title: 'Fix the pass mark',
        prompt: 'This program reads a mark and should print `Pass` for 50 or more and `Fail` for less than 50. It gets the boundary wrong. Fix it.',
        starter: String.raw`#include <stdio.h>

int main() {
    int marks;
    scanf("%d", &marks);
    if (marks > 50) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }
    return 0;
}
`,
        sampleInput: '50',
        usesInput: true,
        tests: [
          { input: '50', expected: 'Pass', name: 'Exactly on the boundary' },
          { input: '49', expected: 'Fail' },
          { input: '51', expected: 'Pass' },
          { input: '0', expected: 'Fail', hidden: true },
          { input: '100', expected: 'Pass', hidden: true },
        ],
        hints: [
          'Test the boundary: what does the program print for exactly 50?',
          'A mark of 50 should pass, but `marks > 50` is false for 50.',
          'Change `>` to `>=`. A similar example: “18 or older may enter” is `age >= 18`, not `age > 18`.',
        ],
      },
    ],
  },
];
