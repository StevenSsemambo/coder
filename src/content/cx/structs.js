// C, Part 2, Level 1: Your own data types. Lessons 1 to 5 (struct, arrays of structs, structs and functions, enum, union).
// Runs on picoc (WebAssembly), see tools/picoc-wasm/README.md. Struct, union and enum definitions must be global.
// C code uses String.raw so \n stays a backslash-n. Prose strings are single-quoted.
import { inc } from '../c/shared.js';

const LEVEL = 'Level 1: Your own data types';
const IO = inc('stdio');
const STR = inc('stdio', 'string');

/** A whole program: `top` (structs, functions) above main, `body` inside main. */
const P = (top, body, incl = IO) => `${incl}\n\n${top ? top + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

const ITEM = String.raw`struct Item {
    char name[20];
    int price;
    int stock;
};`;

export const structLessons = [
  // ================================================================== 1
  {
    id: 'cx-struct',
    level: LEVEL,
    minutes: 28,
    title: 'Structures: your own data type',
    summary: 'Group a name, a price and a stock into one variable with struct',
    blocks: [
      {
        t: 'story',
        title: 'Rose’s index cards',
        text: 'Mama Rose keeps a card for every item in her duuka. Each card has the same three lines: the **name**, the **price** and how many are **in stock**. She never writes the price of sugar on one card and the stock of sugar on another. One item, one card, everything together.\n\nSo far your C programs kept such facts in separate arrays: one for names, one for prices, one for stock. They had to be kept in step by hand, and one slip put the price of tea on the soap. C lets you make a **card** of your own: it is called a **struct** (short for structure).',
      },
      { t: 'h', text: 'Defining a struct' },
      { t: 'p', text: 'A struct definition describes what is on the card. It does **not** make a card yet: it makes a new **type**, like `int` but made by you. Write it above `main`, ending with a semicolon after the closing bracket.' },
      {
        t: 'try',
        code: P(ITEM, String.raw`    struct Item card;
    strcpy(card.name, "Sugar");
    card.price = 5000;
    card.stock = 12;
    printf("%s costs %d, %d in stock\n", card.name, card.price, card.stock);`, STR),
        output: 'Sugar costs 5000, 12 in stock',
      },
      { t: 'p', text: '`struct Item card;` makes one card called `card`. The lines inside are its **members**. You reach a member with a **dot**: `card.price`. A member behaves exactly like an ordinary variable of its type: you can print it, add to it or send it to `scanf`.' },
      { t: 'tip', text: 'A text member is an array of characters, so you cannot write `card.name = "Sugar";`. Fill it with `strcpy(card.name, "Sugar");` as you did with plain strings (add `#include <string.h>`).' },
      { t: 'h', text: 'Filling a card at birth' },
      { t: 'p', text: 'You can write the values in curly brackets when you create the card, **in the same order** as the members were defined. Members you leave out start at 0.' },
      {
        t: 'try',
        code: P(ITEM, String.raw`    struct Item a = {"Sugar", 5000, 12};
    struct Item b = {"Soap", 1500};
    printf("%s %d %d\n", a.name, a.price, a.stock);
    printf("%s %d %d\n", b.name, b.price, b.stock);`),
        output: 'Sugar 5000 12\nSoap 1500 0',
      },
      { t: 'analogy', text: 'A struct is a **photocopied form**. The definition is the blank form with its boxes: Name, Price, Stock. Every variable you declare is one filled-in copy of that form. Filling in one copy never changes another.' },
      { t: 'h', text: 'Copying a whole card' },
      { t: 'p', text: 'Unlike an array, a struct can be copied with a single `=`. Every member is copied. The copy is a separate card: changing it leaves the original alone.' },
      {
        t: 'try',
        code: P(ITEM, String.raw`    struct Item a = {"Sugar", 5000, 12};
    struct Item b = a;
    b.price = 5500;
    printf("a: %d\n", a.price);
    printf("b: %d\n", b.price);`),
        output: 'a: 5000\nb: 5500',
      },
      {
        t: 'predict',
        code: P(String.raw`struct Point {
    int x;
    int y;
};`, String.raw`    struct Point p = {3, 4};
    struct Point q = p;
    q.x = 10;
    printf("%d %d\n", p.x, q.x);`),
        question: 'What does this program print?',
        options: ['3 10', '10 10', '3 3', '10 3'],
        answer: 0,
        explain: '`q = p` makes a separate copy, so changing `q.x` does not touch `p.x`. `p.x` stays 3 and `q.x` becomes 10.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the operator that reaches a member of a struct **variable**.',
        template: P(String.raw`struct Point {
    int x;
    int y;
};`, String.raw`    struct Point p = {3, 4};
    printf("%d\n", p___x + p___y);`),
        blanks: [{ options: ['.', '->', ':'], answer: '.' }, { options: ['.', '->', ':'], answer: '.' }],
        output: '7',
      },
      {
        t: 'bug',
        code: P(ITEM, String.raw`    struct Item card = {"Sugar", 5000, 12};
    printf("%d\n", card.cost);`),
        question: 'The program stops with an error. What is wrong?',
        options: ['The struct has no member called `cost` (it is `price`)', 'A struct cannot be printed', 'card needs a semicolon', 'The name must be 12 letters'],
        answer: 0,
        explain: 'You can only use members that the definition lists: `name`, `price` and `stock`. A mis-spelt member name is an error, so check the spelling against the struct.',
        fixed: P(ITEM, String.raw`    struct Item card = {"Sugar", 5000, 12};
    printf("%d\n", card.price);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: String.raw`#include <stdio.h>

struct Point {
    int x;
    int y;
}

int main() {
    struct Point p = {1, 2};
    printf("%d\n", p.x);
    return 0;
}
`,
            why: 'A struct definition ends with `};`. The semicolon after the closing bracket is easy to forget, and then the program cannot be read.',
            right: String.raw`#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    struct Point p = {1, 2};
    printf("%d\n", p.x);
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: P(ITEM, String.raw`    struct Item card;
    card.name = "Sugar";
    printf("%s\n", card.name);`),
            why: 'A real C compiler refuses `card.name = "Sugar";` because an array cannot be assigned. (This app is more relaxed and lets it through, but the code would not compile elsewhere.) Copy text into an array with `strcpy`.',
            right: P(ITEM, String.raw`    struct Item card;
    strcpy(card.name, "Sugar");
    printf("%s\n", card.name);`, STR),
          },
          {
            logic: true,
            wrong: P(String.raw`struct Point {
    int x;
    int y;
};`, String.raw`    struct Point a = {1, 2};
    struct Point b = {1, 2};
    if (a == b) {
        printf("same\n");
    }`),
            why: 'You cannot compare two structs with `==`. Compare them member by member: `a.x == b.x && a.y == b.y`.',
            right: P(String.raw`struct Point {
    int x;
    int y;
};`, String.raw`    struct Point a = {1, 2};
    struct Point b = {1, 2};
    if (a.x == b.x && a.y == b.y) {
        printf("same\n");
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'A variable `card` is a struct with a member `price`. How do you read the price?', options: ['card.price', 'card->price', 'card:price', 'price.card'], answer: 0, explain: 'A dot joins a struct **variable** to its member. (The arrow `->` is for pointers to structs, which come in lesson 3.)' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 1): the item card',
        text: 'The program reads one item (name, price and stock) into a struct and prints the card and the **value of the stock** (price times stock). Try `Sugar 5000 12`, then your own item.',
        stdin: 'Sugar 5000 12',
        code: String.raw`#include <stdio.h>

struct Item {
    char name[20];
    int price;
    int stock;
};

int main() {
    struct Item card;
    scanf("%s %d %d", card.name, &card.price, &card.stock);
    printf("Item:  %s\n", card.name);
    printf("Price: %d\n", card.price);
    printf("Stock: %d\n", card.stock);
    printf("Value: %d\n", card.price * card.stock);
    return 0;
}
`,
        output: 'Item:  Sugar\nPrice: 5000\nStock: 12\nValue: 60000',
      },
      {
        t: 'recap',
        items: ['`struct Name { ...members... };` defines a new type, above `main`, ending with `};`.', '`struct Name card;` makes one variable. A dot reaches a member: `card.price`.', '`struct Item a = {"Sugar", 5000, 12};` fills it in member order; the rest start at 0.', '`b = a;` copies every member. The copy is independent.', 'Text members need `strcpy`; two structs are compared member by member, never with `==`.'],
        memory: 'One thing, one card.',
      },
    ],
    exercises: [
      {
        id: 'cx1-card',
        title: 'Print the card',
        prompt: 'Read an item (name, price, stock) into a `struct Item` and print one line: `Sugar: 12 x 5000 = 60000` (name, stock, price, and stock times price).',
        starter: P(ITEM, String.raw`    struct Item card;
    scanf("%s %d %d", card.name, &card.price, &card.stock);
    // print the line`),
        sampleInput: 'Sugar 5000 12',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12', expected: 'Sugar: 12 x 5000 = 60000' },
          { input: 'Soap 1500 0', expected: 'Soap: 0 x 1500 = 0' },
          { input: 'Rice 4200 7', expected: 'Rice: 7 x 4200 = 29400', hidden: true },
        ],
        hints: [
          'The members are `card.name`, `card.stock` and `card.price`.',
          'Use `printf("%s: %d x %d = %d\\n", ...)` with four values after the text.',
          'A similar example: the project step in this lesson prints the same members on four lines.',
        ],
      },
      {
        id: 'cx1-dearer',
        title: 'Which is dearer?',
        prompt: 'Read two items (name and price each) into two structs. Print the **name of the dearer one**. If the prices are equal, print the first.',
        starter: String.raw`#include <stdio.h>

struct Item {
    char name[20];
    int price;
};

int main() {
    struct Item a, b;
    scanf("%s %d", a.name, &a.price);
    scanf("%s %d", b.name, &b.price);
    // print the name of the dearer item
    return 0;
}
`,
        sampleInput: 'Sugar 5000\nSoap 1500',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000\nSoap 1500', expected: 'Sugar' },
          { input: 'Tea 800\nCoffee 2500', expected: 'Coffee' },
          { input: 'Salt 700\nSoap 700', expected: 'Salt', hidden: true },
        ],
        hints: [
          'Compare the two prices with `if (b.price > a.price)`.',
          'Print `b.name` when b is dearer, otherwise `a.name`.',
          'A similar example: two numbers compared with `if` in the decisions lesson. Here the numbers are members.',
        ],
      },
      {
        id: 'cx1-average',
        title: 'Student record',
        prompt: 'A `struct Student` holds a name and three marks. Read them and print the name and the **average** with one decimal place, as `Amina: 72.3` for marks 70, 75 and 72.',
        starter: String.raw`#include <stdio.h>

struct Student {
    char name[20];
    int m1;
    int m2;
    int m3;
};

int main() {
    struct Student s;
    scanf("%s %d %d %d", s.name, &s.m1, &s.m2, &s.m3);
    // print the name and the average
    return 0;
}
`,
        sampleInput: 'Amina 70 75 72',
        usesInput: true,
        tests: [
          { input: 'Amina 70 75 72', expected: 'Amina: 72.3' },
          { input: 'Kato 100 100 100', expected: 'Kato: 100.0' },
          { input: 'Zawadi 50 61 40', expected: 'Zawadi: 50.3', hidden: true },
        ],
        hints: [
          'Add the three marks and divide by 3.0 (not 3) so the answer keeps its decimals.',
          'Print with `%.1f` for one decimal place.',
          'A similar example: the average of three numbers in the first level of the course.',
        ],
      },
    ],
  },

  // ================================================================== 2
  {
    id: 'cx-struct-array',
    level: LEVEL,
    minutes: 30,
    title: 'Arrays of structures and typedef',
    summary: 'A whole shelf of item cards: typedef, loops, searching and sorting records',
    blocks: [
      {
        t: 'story',
        title: 'The shelf of cards',
        text: 'One card is useful. Rose has forty. Forty separate variables would be silly, but an **array** of cards is exactly right: `struct Item shelf[40];` is a shelf with forty cards, and a loop can visit each one.\n\nThis is how nearly every real program stores a list of records: students in a class, patients in a clinic, products in a shop.',
      },
      { t: 'h', text: 'typedef: a shorter name' },
      { t: 'p', text: 'Writing `struct Item` every time gets tiring. `typedef` gives the type a shorter name. After `typedef struct { ... } Item;` you can write just `Item card;`.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
    int stock;
} Item;`, String.raw`    Item shelf[3] = {
        {"Sugar", 5000, 12},
        {"Soap", 1500, 40},
        {"Tea", 800, 25}
    };
    int i;
    for (i = 0; i < 3; i++) {
        printf("%d. %s (%d)\n", i + 1, shelf[i].name, shelf[i].price);
    }`),
        output: '1. Sugar (5000)\n2. Soap (1500)\n3. Tea (800)',
      },
      { t: 'p', text: '`shelf[i]` is one whole card and `shelf[i].price` is one member of it. The brackets come first, then the dot. Everything you know about loops over arrays works here.' },
      { t: 'h', text: 'Total, search and the cheapest' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
    int stock;
} Item;`, String.raw`    Item shelf[3] = {{"Sugar", 5000, 12}, {"Soap", 1500, 40}, {"Tea", 800, 25}};
    int i, total = 0, cheapest = 0;
    for (i = 0; i < 3; i++) {
        total = total + shelf[i].price * shelf[i].stock;
        if (shelf[i].price < shelf[cheapest].price) {
            cheapest = i;
        }
    }
    printf("Stock value: %d\n", total);
    printf("Cheapest: %s\n", shelf[cheapest].name);`),
        output: 'Stock value: 140000\nCheapest: Tea',
      },
      { t: 'p', text: 'To search by name use `strcmp` (it gives 0 when two strings are equal), exactly as in the strings lesson:' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[3] = {{"Sugar", 5000}, {"Soap", 1500}, {"Tea", 800}};
    char wanted[20] = "Soap";
    int i, found = -1;
    for (i = 0; i < 3; i++) {
        if (strcmp(shelf[i].name, wanted) == 0) {
            found = i;
        }
    }
    if (found >= 0) {
        printf("%s costs %d\n", shelf[found].name, shelf[found].price);
    } else {
        printf("Not on the shelf\n");
    }`, STR),
        output: 'Soap costs 1500',
      },
      { t: 'h', text: 'Sorting records' },
      { t: 'p', text: 'You can sort cards with any sort you know. The trick: swap **whole cards**, not just the member you compare. A single `=` swaps every member together, so a name can never be separated from its price.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item s[3] = {{"Sugar", 5000}, {"Soap", 1500}, {"Tea", 800}};
    int i, j;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2 - i; j++) {
            if (s[j].price > s[j + 1].price) {
                Item temp = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp;
            }
        }
    }
    for (i = 0; i < 3; i++) {
        printf("%s %d\n", s[i].name, s[i].price);
    }`),
        output: 'Tea 800\nSoap 1500\nSugar 5000',
      },
      { t: 'tip', text: 'In this app, count the cards with a named constant (`#define COUNT 3`) or a variable. The usual trick `sizeof(shelf) / sizeof(shelf[0])` gives the wrong answer for arrays of structs here.' },
      {
        t: 'predict',
        code: P(String.raw`typedef struct {
    char name[10];
    int qty;
} Line;`, String.raw`    Line order[3] = {{"Egg", 6}, {"Milk", 2}, {"Bread", 1}};
    int i, total = 0;
    for (i = 0; i < 3; i++) {
        total = total + order[i].qty;
    }
    printf("%d %s\n", total, order[1].name);`),
        question: 'What does this program print?',
        options: ['9 Milk', '9 Egg', '3 Milk', '6 Milk'],
        answer: 0,
        explain: 'The quantities are 6 + 2 + 1 = 9. `order[1]` is the **second** card (counting starts at 0), so its name is Milk.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the loop finds the **dearest** item.',
        template: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[3] = {{"Tea", 800}, {"Sugar", 5000}, {"Soap", 1500}};
    int i, best = 0;
    for (i = 1; i < 3; i++) {
        if (s[i].price ___ s[best].price) {
            best = i;
        }
    }
    printf("%s\n", s[best].name);`),
        blanks: [{ options: ['>', '<', '=='], answer: '>' }],
        output: 'Sugar',
      },
      {
        t: 'bug',
        code: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[2] = {{"Tea", 800}, {"Soap", 1500}};
    int i;
    for (i = 0; i < 2; i++) {
        printf("%d\n", s.price[i]);
    }`),
        question: 'The program stops with an error. What is wrong?',
        options: ['The brackets go on the array and then the dot: `s[i].price`', 'The loop must start at 1', 'Item must be written in capitals', 'price must be a text member'],
        answer: 0,
        explain: '`s` is the whole array, so it has no member `price`. First pick one card with `s[i]`, **then** take its member: `s[i].price`.',
        fixed: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[2] = {{"Tea", 800}, {"Soap", 1500}};
    int i;
    for (i = 0; i < 2; i++) {
        printf("%d\n", s[i].price);
    }`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[2] = {{"Tea", 800}, {"Soap", 1500}};
    if (s[0].price > s[1].price) {
        int temp = s[0].price;
        s[0].price = s[1].price;
        s[1].price = temp;
    }
    printf("%s %d\n", s[0].name, s[0].price);`),
            why: 'Only the **prices** were swapped, so the names stay where they were: this prints `Tea 800` after the swap, but the card says Tea costs 800 only by luck. With other data the tea would get the soap’s price. Swap the whole cards: `Item temp = s[0]; s[0] = s[1]; s[1] = temp;`.',
            right: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[2] = {{"Tea", 800}, {"Soap", 1500}};
    if (s[0].price > s[1].price) {
        Item temp = s[0];
        s[0] = s[1];
        s[1] = temp;
    }
    printf("%s %d\n", s[0].name, s[0].price);`),
          },
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[2] = {{"Tea", 800}, {"Soap", 1500}};
    if (s[0].name == "Tea") {
        printf("found\n");
    }`, STR),
            why: '`==` between two strings compares **addresses**, not letters, so it is almost never true. Compare text with `strcmp(s[0].name, "Tea") == 0`.',
            right: P(String.raw`typedef struct {
    char name[10];
    int price;
} Item;`, String.raw`    Item s[2] = {{"Tea", 800}, {"Soap", 1500}};
    if (strcmp(s[0].name, "Tea") == 0) {
        printf("found\n");
    }`, STR),
          },
          {
            wrong: String.raw`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point

int main() {
    Point p = {1, 2};
    printf("%d\n", p.x);
    return 0;
}
`,
            why: 'A `typedef struct { ... } Name;` also ends with a semicolon, after the **new name**.',
            right: String.raw`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main() {
    Point p = {1, 2};
    printf("%d\n", p.x);
    return 0;
}
`,
          },
        ],
      },
      { t: 'quiz', question: 'What does `typedef struct { int a; } Box;` let you write?', options: ['Box b;', 'struct b;', 'typedef b;', 'Box.a;'], answer: 0, explain: '`Box` is now a type name, so `Box b;` makes a variable `b` of that type, with no need to write `struct`.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 2): the shelf',
        text: 'The program reads three items (name, price, stock), then prints the shelf **cheapest first** and the total value of the stock. Try `Sugar 5000 12`, `Soap 1500 40`, `Tea 800 25` (one per line).',
        stdin: 'Sugar 5000 12\nSoap 1500 40\nTea 800 25',
        code: String.raw`#include <stdio.h>

#define COUNT 3

typedef struct {
    char name[20];
    int price;
    int stock;
} Item;

int main() {
    Item shelf[COUNT];
    int i, j, total = 0;
    for (i = 0; i < COUNT; i++) {
        scanf("%s %d %d", shelf[i].name, &shelf[i].price, &shelf[i].stock);
        total = total + shelf[i].price * shelf[i].stock;
    }
    for (i = 0; i < COUNT - 1; i++) {
        for (j = 0; j < COUNT - 1 - i; j++) {
            if (shelf[j].price > shelf[j + 1].price) {
                Item temp = shelf[j];
                shelf[j] = shelf[j + 1];
                shelf[j + 1] = temp;
            }
        }
    }
    for (i = 0; i < COUNT; i++) {
        printf("%-6s %5d %3d\n", shelf[i].name, shelf[i].price, shelf[i].stock);
    }
    printf("Stock value: %d\n", total);
    return 0;
}
`,
        output: 'Tea      800  25\nSoap    1500  40\nSugar   5000  12\nStock value: 140000',
      },
      {
        t: 'recap',
        items: ['`typedef struct { ... } Name;` lets you write `Name x;` without the word `struct`.', 'An array of structs is a shelf of cards: `shelf[i]` is a card, `shelf[i].price` is a member.', 'Search text members with `strcmp`, never `==`.', 'Sort by swapping **whole cards** with one `=`.', 'Keep the number of cards in a `#define` or a variable.'],
        memory: 'Pick the card, then the member.',
      },
    ],
    exercises: [
      {
        id: 'cx2-total',
        title: 'The shelf total',
        prompt: 'Read 3 items (name, price and stock each) and print the total value of all stock, as `Total: 140000`.',
        starter: String.raw`#include <stdio.h>

typedef struct {
    char name[20];
    int price;
    int stock;
} Item;

int main() {
    Item shelf[3];
    int i, total = 0;
    // read the 3 items, add up price * stock
    printf("Total: %d\n", total);
    return 0;
}
`,
        sampleInput: 'Sugar 5000 12\nSoap 1500 40\nTea 800 25',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12\nSoap 1500 40\nTea 800 25', expected: 'Total: 140000' },
          { input: 'A 1 1\nB 2 2\nC 3 3', expected: 'Total: 14' },
          { input: 'X 100 0\nY 0 100\nZ 50 2', expected: 'Total: 100', hidden: true },
        ],
        hints: [
          'A loop that runs 3 times: `scanf("%s %d %d", shelf[i].name, &shelf[i].price, &shelf[i].stock);`',
          'In the same loop add `shelf[i].price * shelf[i].stock` to `total`.',
          'A similar example: the project step in this lesson totals the stock while reading the cards.',
        ],
      },
      {
        id: 'cx2-find',
        title: 'Find an item',
        prompt: 'Read 3 items (name and price), then read a name to look for. Print `Soap costs 1500` if the name is on the shelf, or `Not found` if not.',
        starter: String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int price;
} Item;

int main() {
    Item shelf[3];
    char wanted[20];
    int i, found = -1;
    for (i = 0; i < 3; i++) {
        scanf("%s %d", shelf[i].name, &shelf[i].price);
    }
    scanf("%s", wanted);
    // search, then print the answer
    return 0;
}
`,
        sampleInput: 'Sugar 5000\nSoap 1500\nTea 800\nSoap',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000\nSoap 1500\nTea 800\nSoap', expected: 'Soap costs 1500' },
          { input: 'Sugar 5000\nSoap 1500\nTea 800\nSalt', expected: 'Not found' },
          { input: 'Sugar 5000\nSoap 1500\nTea 800\nTea', expected: 'Tea costs 800', hidden: true },
        ],
        hints: [
          'Loop over the 3 cards. When `strcmp(shelf[i].name, wanted) == 0`, remember `found = i`.',
          'After the loop: `if (found >= 0)` print the name and price of `shelf[found]`, otherwise print `Not found`.',
          'A similar example: the search `try` block in this lesson.',
        ],
      },
      {
        id: 'cx2-sort',
        title: 'Cheapest first',
        prompt: 'Read 4 items (name and price) and print them **cheapest first**, one per line as `Tea 800`. Prices are all different.',
        starter: String.raw`#include <stdio.h>

typedef struct {
    char name[20];
    int price;
} Item;

int main() {
    Item s[4];
    int i, j;
    for (i = 0; i < 4; i++) {
        scanf("%s %d", s[i].name, &s[i].price);
    }
    // sort by price, then print
    return 0;
}
`,
        sampleInput: 'Sugar 5000\nSoap 1500\nTea 800\nRice 4200',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000\nSoap 1500\nTea 800\nRice 4200', expected: 'Tea 800\nSoap 1500\nRice 4200\nSugar 5000' },
          { input: 'A 1\nB 2\nC 3\nD 4', expected: 'A 1\nB 2\nC 3\nD 4' },
          { input: 'W 40\nX 30\nY 20\nZ 10', expected: 'Z 10\nY 20\nX 30\nW 40', hidden: true },
        ],
        hints: [
          'Use bubble sort: two loops, comparing `s[j].price` with `s[j + 1].price`.',
          'When they are out of order swap the **whole cards**: `Item temp = s[j]; s[j] = s[j + 1]; s[j + 1] = temp;`',
          'A similar example: the sorting `try` block in this lesson.',
        ],
      },
    ],
  },

  // ================================================================== 3
  {
    id: 'cx-struct-fn',
    level: LEVEL,
    minutes: 30,
    title: 'Structures and functions',
    summary: 'Send cards to functions, return them, and change them through a pointer with ->',
    blocks: [
      {
        t: 'story',
        title: 'Sending the card to the till',
        text: 'Rose’s son runs the till. When a customer buys sugar, he does not need the whole shop: he needs **that one card**. If Rose hands him the card itself, he can scribble on it and the stock is updated. If she hands him a **photocopy**, he can scribble all he likes and her original stays unchanged.\n\nThat is the difference between passing a struct **by value** (a photocopy) and passing a **pointer** to it (the real card). Both are useful, and now you know the tools to choose.',
      },
      { t: 'h', text: 'By value: the function gets a copy' },
      { t: 'p', text: 'A struct is passed to a function like an `int`: the function works on a **copy**. That is perfect for functions that only look at the card, such as printing it or working out a value.' },
      {
        t: 'try',
        code: P(ITEM + String.raw`

int value(struct Item it) {
    return it.price * it.stock;
}

void show(struct Item it) {
    printf("%s: %d x %d\n", it.name, it.stock, it.price);
}`, String.raw`    struct Item a = {"Sugar", 5000, 12};
    show(a);
    printf("Value: %d\n", value(a));`),
        output: 'Sugar: 12 x 5000\nValue: 60000',
      },
      { t: 'p', text: 'A function can also **return** a struct. This is how you write a function that builds a card:' },
      {
        t: 'try',
        code: P(String.raw`struct Point {
    int x;
    int y;
};

struct Point make(int x, int y) {
    struct Point p;
    p.x = x;
    p.y = y;
    return p;
}`, String.raw`    struct Point a = make(3, 4);
    printf("%d %d\n", a.x, a.y);`),
        output: '3 4',
      },
      { t: 'h', text: 'By pointer: the function changes the real card' },
      { t: 'p', text: 'To change the caller’s card, send its **address** with `&` and receive it in a **pointer** parameter. Through a pointer to a struct you reach a member with an **arrow**: `p->price`. (It means the same as `(*p).price`, just easier to read.)' },
      {
        t: 'try',
        code: P(ITEM + String.raw`

void sell(struct Item *p, int qty) {
    p->stock = p->stock - qty;
}`, String.raw`    struct Item a = {"Sugar", 5000, 12};
    sell(&a, 5);
    printf("%d left\n", a.stock);`),
        output: '7 left',
      },
      { t: 'analogy', text: 'The **dot** is for the card in your hand. The **arrow** is for a card you only have the **shelf address** of: you must first walk to the address (follow the pointer) and then read the member.' },
      {
        t: 'try',
        code: P(String.raw`struct Point {
    int x;
    int y;
};

void by_value(struct Point p) {
    p.x = 99;
}

void by_pointer(struct Point *p) {
    p->x = 99;
}`, String.raw`    struct Point a = {1, 2};
    by_value(a);
    printf("after by_value: %d\n", a.x);
    by_pointer(&a);
    printf("after by_pointer: %d\n", a.x);`),
        output: 'after by_value: 1\nafter by_pointer: 99',
      },
      { t: 'tip', text: 'Rule of thumb: if the function only **reads** the card, pass it by value (or as a `const` pointer for big cards). If it must **change** the card, pass a pointer.' },
      {
        t: 'predict',
        code: P(String.raw`struct Box {
    int n;
};

void grow(struct Box *b) {
    b->n = b->n * 2;
}`, String.raw`    struct Box a = {5};
    grow(&a);
    grow(&a);
    printf("%d\n", a.n);`),
        question: 'What does this program print?',
        options: ['20', '5', '10', '25'],
        answer: 0,
        explain: 'The function receives the address of `a`, so it changes the real box each time: 5, then 10, then 20.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap. `p` is a **pointer** to a struct, so which operator reaches the member?',
        template: P(String.raw`struct Box {
    int n;
};

void show(struct Box *p) {
    printf("%d\n", p___n);
}`, String.raw`    struct Box a = {7};
    show(&a);`),
        blanks: [{ options: ['->', '.', ':'], answer: '->' }],
        output: '7',
      },
      {
        t: 'bug',
        code: P(String.raw`struct Box {
    int n;
};

void grow(struct Box *b) {
    b.n = b.n * 2;
}`, String.raw`    struct Box a = {5};
    grow(&a);
    printf("%d\n", a.n);`),
        question: 'The program stops with an error. What is wrong?',
        options: ['`b` is a pointer, so the members need an arrow: `b->n`', 'The function must return a struct', 'a needs the & operator in the declaration', 'n must be a float'],
        answer: 0,
        explain: 'A dot is for a struct variable. `b` holds an address, so you must follow it with an arrow: `b->n = b->n * 2;`.',
        fixed: P(String.raw`struct Box {
    int n;
};

void grow(struct Box *b) {
    b->n = b->n * 2;
}`, String.raw`    struct Box a = {5};
    grow(&a);
    printf("%d\n", a.n);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(String.raw`struct Box {
    int n;
};

void grow(struct Box b) {
    b.n = b.n * 2;
}`, String.raw`    struct Box a = {5};
    grow(a);
    printf("%d\n", a.n);`),
            why: 'The function receives a **copy**, so it doubles the copy and the real box stays 5. To change the caller’s box, take `struct Box *b` and call `grow(&a)`.',
            right: P(String.raw`struct Box {
    int n;
};

void grow(struct Box *b) {
    b->n = b->n * 2;
}`, String.raw`    struct Box a = {5};
    grow(&a);
    printf("%d\n", a.n);`),
          },
          {
            wrong: P(String.raw`struct Box {
    int n;
};

void show(struct Box *b) {
    printf("%d\n", b->n);
}`, String.raw`    struct Box a = {5};
    show(a);`),
            why: 'The function wants an **address** (a pointer) but gets the box itself. Send the address with `&`: `show(&a)`. In C this is an error, and the message says that a number or struct was put where a pointer belongs.',
            right: P(String.raw`struct Box {
    int n;
};

void show(struct Box *b) {
    printf("%d\n", b->n);
}`, String.raw`    struct Box a = {5};
    show(&a);`),
          },
          {
            wrong: P(String.raw`struct Box {
    int n;
};`, String.raw`    struct Box a = {5};
    struct Box *p = &a;
    printf("%d\n", p.n);`),
            why: '`p` is a pointer, so `p.n` is wrong. Use `p->n` (or `(*p).n`).',
            right: P(String.raw`struct Box {
    int n;
};`, String.raw`    struct Box a = {5};
    struct Box *p = &a;
    printf("%d\n", p->n);`),
          },
        ],
      },
      { t: 'quiz', question: 'A function must **change** the stock of the caller’s card. What should its parameter be?', options: ['A pointer to the struct', 'A copy of the struct', 'An int', 'A char array'], answer: 0, explain: 'Only a pointer lets the function reach the **real** card. A copy changes nothing outside the function.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 3): selling at the till',
        text: 'A `sell` function takes a pointer to the card and a quantity. It refuses when there is not enough stock and returns 1 if the sale went through, 0 if not. Try selling 5 and then 9 of Sugar (12 in stock).',
        stdin: '5\n9',
        code: String.raw`#include <stdio.h>

typedef struct {
    char name[20];
    int price;
    int stock;
} Item;

int sell(Item *p, int qty) {
    if (qty > p->stock) {
        return 0;
    }
    p->stock = p->stock - qty;
    return 1;
}

int main() {
    Item sugar = {"Sugar", 5000, 12};
    int qty, i;
    for (i = 0; i < 2; i++) {
        scanf("%d", &qty);
        if (sell(&sugar, qty)) {
            printf("Sold %d, paid %d, %d left\n", qty, qty * sugar.price, sugar.stock);
        } else {
            printf("Cannot sell %d: only %d left\n", qty, sugar.stock);
        }
    }
    return 0;
}
`,
        output: 'Sold 5, paid 25000, 7 left\nCannot sell 9: only 7 left',
      },
      {
        t: 'recap',
        items: ['A struct passed **by value** is copied: the function cannot change the original.', 'A function may return a struct, so `make(3, 4)` can build a card.', 'To change the caller’s card, pass `&card` and take a **pointer** parameter.', 'Through a pointer use an arrow: `p->member`. On a variable use a dot: `card.member`.', 'Read-only function: by value. Changing function: by pointer.'],
        memory: 'Copy to look, pointer to change.',
      },
    ],
    exercises: [
      {
        id: 'cx3-value',
        title: 'Value of an item',
        prompt: 'Complete the function `value`, which takes a `struct Item` **by value** and returns price times stock. The program reads an item and prints `Value: 60000` (for Sugar 5000 12).',
        starter: String.raw`#include <stdio.h>

struct Item {
    char name[20];
    int price;
    int stock;
};

int value(struct Item it) {
    // return price times stock
}

int main() {
    struct Item a;
    scanf("%s %d %d", a.name, &a.price, &a.stock);
    printf("Value: %d\n", value(a));
    return 0;
}
`,
        sampleInput: 'Sugar 5000 12',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12', expected: 'Value: 60000' },
          { input: 'Soap 1500 0', expected: 'Value: 0' },
          { input: 'Tea 800 25', expected: 'Value: 20000', hidden: true },
        ],
        hints: [
          'The parameter `it` is a card: `it.price` and `it.stock` are its members.',
          '`return it.price * it.stock;`',
          'A similar example: the `value` function in this lesson.',
        ],
      },
      {
        id: 'cx3-restock',
        title: 'Restock through a pointer',
        prompt: 'Complete `restock`, which takes a **pointer** to an item and a number and adds it to the stock. The program reads an item and an amount, restocks and prints `Sugar now has 17`.',
        starter: String.raw`#include <stdio.h>

struct Item {
    char name[20];
    int price;
    int stock;
};

void restock(struct Item *p, int amount) {
    // add amount to the stock of the card p points to
}

int main() {
    struct Item a;
    int amount;
    scanf("%s %d %d %d", a.name, &a.price, &a.stock, &amount);
    restock(&a, amount);
    printf("%s now has %d\n", a.name, a.stock);
    return 0;
}
`,
        sampleInput: 'Sugar 5000 12 5',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12 5', expected: 'Sugar now has 17' },
          { input: 'Soap 1500 0 40', expected: 'Soap now has 40' },
          { input: 'Tea 800 25 0', expected: 'Tea now has 25', hidden: true },
        ],
        hints: [
          'Inside the function `p` is a pointer, so use an arrow for the member.',
          '`p->stock = p->stock + amount;`',
          'A similar example: the `sell` function in this lesson takes stock away; this one adds.',
        ],
      },
      {
        id: 'cx3-make',
        title: 'Build a card',
        prompt: 'Complete `make_item`, which returns a `struct Item` built from a name, a price and a stock. The program reads the three values, builds the card with your function and prints `Sugar 5000 12`.',
        starter: String.raw`#include <stdio.h>
#include <string.h>

struct Item {
    char name[20];
    int price;
    int stock;
};

struct Item make_item(char name[], int price, int stock) {
    struct Item it;
    // fill the card and return it
}

int main() {
    char name[20];
    int price, stock;
    scanf("%s %d %d", name, &price, &stock);
    struct Item a = make_item(name, price, stock);
    printf("%s %d %d\n", a.name, a.price, a.stock);
    return 0;
}
`,
        sampleInput: 'Sugar 5000 12',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12', expected: 'Sugar 5000 12' },
          { input: 'Tea 800 0', expected: 'Tea 800 0' },
          { input: 'Rice 4200 7', expected: 'Rice 4200 7', hidden: true },
        ],
        hints: [
          'Copy the text with `strcpy(it.name, name);`.',
          'Then set `it.price = price;` and `it.stock = stock;`.',
          'The last line is `return it;`. A similar example: the `make` function for a point in this lesson.',
        ],
      },
    ],
  },

  // ================================================================== 4
  {
    id: 'cx-enum',
    level: LEVEL,
    minutes: 24,
    title: 'Enumerations: named choices',
    summary: 'Give numbers meaningful names with enum, and use them with switch',
    blocks: [
      {
        t: 'story',
        title: 'Code 3 means what?',
        text: 'The school database says a student’s status is `2`. Does that mean “enrolled”, “graduated” or “suspended”? Nobody remembers. Someone wrote `if (status == 2)` and ten programmers later nobody dares to touch it.\n\nProgrammers solved this long ago: give each number a **name**. In C the tool is `enum` (short for enumeration): a list of named choices. The computer still stores plain numbers, but you and your teammates read words.',
      },
      { t: 'h', text: 'Defining an enum' },
      {
        t: 'try',
        code: P(String.raw`enum Status {
    ENROLLED,
    GRADUATED,
    SUSPENDED
};`, String.raw`    enum Status s = GRADUATED;
    printf("%d\n", s);
    printf("%d %d\n", ENROLLED, SUSPENDED);`),
        output: '1\n0 2',
      },
      { t: 'p', text: 'The names are numbered from 0 upwards, in order: `ENROLLED` is 0, `GRADUATED` is 1, `SUSPENDED` is 2. By tradition the names are written in CAPITALS. The variable `s` is an ordinary number that is meant to hold one of the names.' },
      { t: 'p', text: 'You can choose the numbers yourself. Later names continue counting from the last one you set:' },
      {
        t: 'try',
        code: P(String.raw`enum Grade {
    FAIL = 0,
    PASS = 50,
    CREDIT = 60,
    DISTINCTION = 75
};
enum Size {
    SMALL = 1,
    MEDIUM,
    LARGE
};`, String.raw`    printf("%d %d\n", PASS, DISTINCTION);
    printf("%d %d\n", MEDIUM, LARGE);`),
        output: '50 75\n2 3',
      },
      { t: 'h', text: 'enum and switch: made for each other' },
      { t: 'p', text: 'A `switch` that picks between named choices reads like English. Always include `break` after each case and a `default` for anything unexpected.' },
      {
        t: 'try',
        code: P(String.raw`enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };`, String.raw`    enum Day today = SAT;
    switch (today) {
        case SAT:
        case SUN:
            printf("Weekend\n");
            break;
        default:
            printf("Class day\n");
    }`),
        output: 'Weekend',
      },
      { t: 'p', text: 'Two names can share one action by stacking the `case` lines (like `SAT` and `SUN` above). And an enum fits neatly inside a struct, to describe the **state** of a record:' },
      {
        t: 'try',
        code: P(String.raw`enum Status { ACTIVE, CLOSED };

typedef struct {
    char name[20];
    enum Status status;
} Account;`, String.raw`    Account a = {"Amina", ACTIVE};
    Account b = {"Kato", CLOSED};
    Account list[2];
    int i;
    list[0] = a;
    list[1] = b;
    for (i = 0; i < 2; i++) {
        if (list[i].status == ACTIVE) {
            printf("%s is active\n", list[i].name);
        } else {
            printf("%s is closed\n", list[i].name);
        }
    }`),
        output: 'Amina is active\nKato is closed',
      },
      { t: 'tip', text: 'An enum is only a naming convenience. C does not stop you putting any number into an enum variable, so the safety comes from your habit of always using the names.' },
      {
        t: 'predict',
        code: P(String.raw`enum Level { LOW = 10, MID, HIGH };`, String.raw`    printf("%d %d\n", MID, HIGH);`),
        question: 'What does this program print?',
        options: ['11 12', '1 2', '10 11', '0 1'],
        answer: 0,
        explain: '`LOW` is set to 10. Counting continues from there, so `MID` is 11 and `HIGH` is 12.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints the name for the status, using `switch`.',
        template: P(String.raw`enum Status { ENROLLED, GRADUATED };`, String.raw`    enum Status s = GRADUATED;
    switch (s) {
        ___ ENROLLED:
            printf("Studying\n");
            break;
        case GRADUATED:
            printf("Done\n");
            break;
    }`),
        blanks: [{ options: ['case', 'if', 'else'], answer: 'case' }],
        output: 'Done',
      },
      {
        t: 'bug',
        code: P(String.raw`enum Status { ENROLLED, GRADUATED };`, String.raw`    enum Status s = Graduated;
    printf("%d\n", s);`),
        question: 'The program stops with an error. What is wrong?',
        options: ['The name is `GRADUATED` (capital letters); C is case-sensitive', 'An enum variable cannot be printed', 'enum must be written with a capital E', 'The enum needs a third name'],
        answer: 0,
        explain: 'C treats `Graduated` and `GRADUATED` as different names, and only the second exists. Copy names exactly as the enum lists them.',
        fixed: P(String.raw`enum Status { ENROLLED, GRADUATED };`, String.raw`    enum Status s = GRADUATED;
    printf("%d\n", s);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: String.raw`#include <stdio.h>

enum Color { RED, GREEN, BLUE }

int main() {
    enum Color c = GREEN;
    printf("%d\n", c);
    return 0;
}
`,
            why: 'Like a struct, an enum definition ends with `;` after the closing bracket.',
            right: String.raw`#include <stdio.h>

enum Color { RED, GREEN, BLUE };

int main() {
    enum Color c = GREEN;
    printf("%d\n", c);
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: P(String.raw`enum Day { MON, TUE, WED };`, String.raw`    enum Day d = MON;
    switch (d) {
        case MON:
            printf("Monday\n");
        case TUE:
            printf("Tuesday\n");
            break;
    }`),
            why: 'Without `break`, execution **falls through** into the next case: this prints `Monday` **and** `Tuesday`. End each case with `break;`.',
            right: P(String.raw`enum Day { MON, TUE, WED };`, String.raw`    enum Day d = MON;
    switch (d) {
        case MON:
            printf("Monday\n");
            break;
        case TUE:
            printf("Tuesday\n");
            break;
    }`),
          },
          {
            logic: true,
            wrong: P(String.raw`enum Status { ENROLLED, GRADUATED };`, String.raw`    int s = 1;
    if (s == 1) {
        printf("Graduated\n");
    }`),
            why: 'It works, but `1` means nothing to the next reader. This is exactly the problem enums solve: write `enum Status s = GRADUATED; if (s == GRADUATED)`.',
            right: P(String.raw`enum Status { ENROLLED, GRADUATED };`, String.raw`    enum Status s = GRADUATED;
    if (s == GRADUATED) {
        printf("Graduated\n");
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'In `enum Size { SMALL = 1, MEDIUM, LARGE };` what is the value of LARGE?', options: ['3', '2', '1', '0'], answer: 0, explain: '`SMALL` is 1, `MEDIUM` continues to 2 and `LARGE` to 3.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 4): the order status',
        text: 'Every order is in one of four states. The program reads a number (0 to 3), turns it into the named state and tells the customer what to expect. Try 0, 2 and 5.',
        stdin: '2',
        code: String.raw`#include <stdio.h>

enum State {
    PLACED,
    PACKED,
    SHIPPED,
    DELIVERED
};

int main() {
    int code;
    enum State s;
    scanf("%d", &code);
    s = code;
    switch (s) {
        case PLACED:
            printf("We received your order\n");
            break;
        case PACKED:
            printf("Your order is packed\n");
            break;
        case SHIPPED:
            printf("Your order is on the way\n");
            break;
        case DELIVERED:
            printf("Your order was delivered\n");
            break;
        default:
            printf("Unknown state\n");
    }
    return 0;
}
`,
        output: 'Your order is on the way',
      },
      {
        t: 'recap',
        items: ['`enum Name { A, B, C };` names the numbers 0, 1, 2.', 'You can set values (`A = 10`); later names count on from there.', 'Write the names in CAPITALS and always use them instead of bare numbers.', '`switch` with `case NAME:` and `break;` is the natural partner for an enum.', 'An enum fits inside a struct to describe the state of a record.'],
        memory: 'Names, not numbers.',
      },
    ],
    exercises: [
      {
        id: 'cx4-day',
        title: 'Weekend or class?',
        prompt: 'The enum `Day` is defined for you (MON = 0 to SUN = 6). Read a day number (0 to 6) and print `Weekend` for SAT and SUN, `Class day` for the others.',
        starter: String.raw`#include <stdio.h>

enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };

int main() {
    int n;
    enum Day d;
    scanf("%d", &n);
    d = n;
    // print Weekend or Class day
    return 0;
}
`,
        sampleInput: '5',
        usesInput: true,
        tests: [
          { input: '5', expected: 'Weekend' },
          { input: '6', expected: 'Weekend' },
          { input: '0', expected: 'Class day' },
          { input: '4', expected: 'Class day', hidden: true },
        ],
        hints: [
          'Use `if (d == SAT || d == SUN)`, or a `switch` with stacked cases.',
          'Print `Weekend` in the first branch and `Class day` in the `else`.',
          'A similar example: the weekend `switch` in this lesson.',
        ],
      },
      {
        id: 'cx4-grade',
        title: 'Grade names',
        prompt: 'The enum `Grade` is defined with FAIL, PASS, CREDIT and DISTINCTION as 0 to 3. Read a mark (0 to 100) and print its grade name: below 50 is `FAIL`, 50 to 59 `PASS`, 60 to 74 `CREDIT`, 75 or more `DISTINCTION`. Work out the enum value first, then print the name with a `switch`.',
        starter: String.raw`#include <stdio.h>

enum Grade { FAIL, PASS, CREDIT, DISTINCTION };

int main() {
    int mark;
    enum Grade g;
    scanf("%d", &mark);
    // set g from the mark, then switch on g to print its name
    return 0;
}
`,
        sampleInput: '68',
        usesInput: true,
        tests: [
          { input: '68', expected: 'CREDIT' },
          { input: '30', expected: 'FAIL' },
          { input: '50', expected: 'PASS', hidden: true },
          { input: '75', expected: 'DISTINCTION', hidden: true },
          { input: '100', expected: 'DISTINCTION', hidden: true },
        ],
        hints: [
          'An `if / else if` chain sets `g`: `if (mark >= 75) g = DISTINCTION;` and so on, down to `FAIL`.',
          'Then `switch (g)` with a `case` for each name, each ending with `break;`.',
          'A similar example: the order-status project step in this lesson.',
        ],
      },
      {
        id: 'cx4-account',
        title: 'Active accounts',
        prompt: 'An `Account` has a name and a `Status` (ACTIVE = 0 or CLOSED = 1). Read 3 accounts as a name and a status number, and print only the names of the ACTIVE ones, one per line. If none is active print `None`.',
        starter: String.raw`#include <stdio.h>

enum Status { ACTIVE, CLOSED };

typedef struct {
    char name[20];
    enum Status status;
} Account;

int main() {
    Account list[3];
    int i, code, count = 0;
    for (i = 0; i < 3; i++) {
        scanf("%s %d", list[i].name, &code);
        list[i].status = code;
    }
    // print the active ones
    return 0;
}
`,
        sampleInput: 'Amina 0\nKato 1\nZawadi 0',
        usesInput: true,
        tests: [
          { input: 'Amina 0\nKato 1\nZawadi 0', expected: 'Amina\nZawadi' },
          { input: 'A 1\nB 1\nC 1', expected: 'None' },
          { input: 'A 1\nB 0\nC 1', expected: 'B', hidden: true },
        ],
        hints: [
          'Loop over the 3 accounts and test `list[i].status == ACTIVE`.',
          'When it is true, print the name and add 1 to `count`.',
          'After the loop, `if (count == 0)` print `None`.',
        ],
      },
    ],
  },

  // ================================================================== 5
  {
    id: 'cx-union',
    level: LEVEL,
    minutes: 24,
    title: 'Unions and tagged data',
    summary: 'One box that holds one of several things, and how to remember which',
    blocks: [
      {
        t: 'story',
        title: 'The pigeonhole at reception',
        text: 'The school reception has one pigeonhole per student. A letter, a parcel or a message slip can go in it, but **only one at a time**, because the hole is only big enough for the largest of them. Rather than build three holes for each student, the school builds one.\n\nA C **union** is exactly this: one block of memory that can hold **one** of several different types. It saves memory, and it appears in file formats, network messages and many embedded systems.',
      },
      { t: 'h', text: 'A union shares its memory' },
      { t: 'p', text: 'A union is defined like a struct, but its members all live at the **same place**. Writing to one overwrites the others. The union is as big as its biggest member.' },
      {
        t: 'try',
        code: P(String.raw`union Number {
    int whole;
    char letter;
};`, String.raw`    union Number n;
    n.whole = 65;
    printf("%d\n", n.whole);
    printf("%c\n", n.letter);
    printf("size: %d\n", (int)sizeof(union Number));`),
        output: '65\nA\nsize: 4',
      },
      { t: 'p', text: 'The same switches were read two ways: as the number 65, and as the letter `A` (lesson 4 of the first course said a letter is just a number). The union is 4 bytes, the size of `int`, the larger member.' },
      { t: 'h', text: 'Remember which one it is: a tagged union' },
      { t: 'p', text: 'The union itself does **not** remember which member you stored last. Reading the wrong one gives nonsense. So programmers pair the union with a **tag** (an enum) inside a struct. The tag says what is currently in the box.' },
      {
        t: 'try',
        code: P(String.raw`enum Kind { WHOLE, DECIMAL };

union Value {
    int whole;
    double decimal;
};

typedef struct {
    enum Kind kind;
    union Value v;
} Entry;

void show(Entry e) {
    if (e.kind == WHOLE) {
        printf("whole %d\n", e.v.whole);
    } else {
        printf("decimal %.2f\n", e.v.decimal);
    }
}`, String.raw`    Entry a;
    Entry b;
    a.kind = WHOLE;
    a.v.whole = 7;
    b.kind = DECIMAL;
    b.v.decimal = 2.5;
    show(a);
    show(b);`),
        output: 'whole 7\ndecimal 2.50',
      },
      { t: 'analogy', text: 'The tag is the **label on the pigeonhole**: “letter” or “parcel”. Without the label you open the hole and have to guess what shape of thing you are holding.' },
      { t: 'tip', text: 'In this app, define a union (like a struct and an enum) **above `main`**. Inside the struct, `e.v.whole` reads as “the entry’s value, as a whole number”.' },
      {
        t: 'predict',
        code: P(String.raw`union Box {
    int a;
    int b;
};`, String.raw`    union Box x;
    x.a = 5;
    x.b = 9;
    printf("%d %d\n", x.a, x.b);`),
        question: 'What does this program print?',
        options: ['9 9', '5 9', '5 5', '9 5'],
        answer: 0,
        explain: '`a` and `b` share the same memory. Writing 9 into `b` overwrites the 5, so both names now read 9.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap. A union is as big as its **largest** member: an `int` (4 bytes) or a `double` (8 bytes)?',
        template: P(String.raw`union Value {
    int whole;
    double decimal;
};`, String.raw`    printf("%d\n", (int)sizeof(union Value) ___ 8);`),
        blanks: [{ options: ['==', '<', '>'], answer: '==' }],
        output: '1',
      },
      {
        t: 'bug',
        code: P(String.raw`union Number {
    int whole;
    char letter;
};`, String.raw`    union Number n;
    n.whole = 65;
    printf("%c\n", n->letter);`),
        question: 'The program stops with an error. What is wrong?',
        options: ['`n` is a union variable, so use a dot: `n.letter`', 'A union cannot hold a char', 'The int needs to be 66', 'printf cannot print a letter'],
        answer: 0,
        explain: 'Unions use the same member operators as structs: a **dot** for a variable and an **arrow** only for a pointer. `n` is a variable, so `n.letter`.',
        fixed: P(String.raw`union Number {
    int whole;
    char letter;
};`, String.raw`    union Number n;
    n.whole = 65;
    printf("%c\n", n.letter);`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(String.raw`union Value {
    int whole;
    double decimal;
};`, String.raw`    union Value v;
    v.decimal = 2.5;
    printf("%d\n", v.whole);`),
            why: 'The program stored a `double` but read the `int`. The bits of 2.5 are not the bits of any sensible whole number, so the output is meaningless. Keep a tag that says what you stored, and read that member only.',
            right: P(String.raw`union Value {
    int whole;
    double decimal;
};`, String.raw`    union Value v;
    v.decimal = 2.5;
    printf("%.1f\n", v.decimal);`),
          },
          {
            logic: true,
            wrong: P(String.raw`union Pair {
    int a;
    int b;
};`, String.raw`    union Pair p;
    p.a = 10;
    p.b = 20;
    printf("%d\n", p.a + p.b);`),
            why: 'If you wanted two separate numbers, this prints 40 (20 + 20) rather than 30, because `a` and `b` are the **same** memory. A union is only for “one of these”. For “all of these” use a **struct**.',
            right: P(String.raw`struct Pair {
    int a;
    int b;
};`, String.raw`    struct Pair p;
    p.a = 10;
    p.b = 20;
    printf("%d\n", p.a + p.b);`),
          },
          {
            wrong: String.raw`#include <stdio.h>

union Number {
    int whole;
    char letter;
}

int main() {
    union Number n;
    n.whole = 65;
    printf("%d\n", n.whole);
    return 0;
}
`,
            why: 'A union definition ends with `};`, just as a struct does.',
            right: String.raw`#include <stdio.h>

union Number {
    int whole;
    char letter;
};

int main() {
    union Number n;
    n.whole = 65;
    printf("%d\n", n.whole);
    return 0;
}
`,
          },
        ],
      },
      { t: 'quiz', question: 'What is a **tag** in a tagged union?', options: ['A separate member (usually an enum) that records which union member is in use', 'A comment above the union', 'The size of the union', 'A function that frees the union'], answer: 0, explain: 'The tag is stored next to the union, often in a struct, so the program knows which member it may safely read.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 5): prices of two kinds',
        text: 'Some items are priced **per piece** (a whole number of shillings), others **per kilo** (a decimal, like 2.5 kilos at 4200). A tagged union holds either kind and the program prints the bill for each. Try the input as it is.',
        stdin: '1 3000 4\n2 4200 2.5',
        code: String.raw`#include <stdio.h>

enum Kind { PIECE, KILO };

union Quantity {
    int pieces;
    double kilos;
};

typedef struct {
    enum Kind kind;
    int price;
    union Quantity qty;
} Sale;

double bill(Sale s) {
    if (s.kind == PIECE) {
        return s.price * s.qty.pieces;
    }
    return s.price * s.qty.kilos;
}

int main() {
    Sale s;
    int i, k;
    for (i = 0; i < 2; i++) {
        scanf("%d %d", &k, &s.price);
        if (k == 1) {
            s.kind = PIECE;
            scanf("%d", &s.qty.pieces);
        } else {
            s.kind = KILO;
            scanf("%lf", &s.qty.kilos);
        }
        printf("Bill: %.0f\n", bill(s));
    }
    return 0;
}
`,
        output: 'Bill: 12000\nBill: 10500',
      },
      {
        t: 'recap',
        items: ['A `union` is defined like a struct but all its members share **one** place in memory.', 'It is as big as its biggest member; writing one member overwrites the others.', 'Never read a member other than the one you stored last.', 'A **tagged union** is a struct holding an enum (the tag) and a union (the value).', 'For “all of these” use a struct; for “one of these” use a union.'],
        memory: 'One box, one thing, one label.',
      },
    ],
    exercises: [
      {
        id: 'cx5-size',
        title: 'How big is the box?',
        prompt: 'The union `Data` has an `int`, a `char` and a `double`. Print its size in bytes as `Size: 8`, and then the size of the **struct** `Pair` below as `Pair: 8` (it holds two ints). Use `sizeof` for both.',
        starter: String.raw`#include <stdio.h>

union Data {
    int i;
    char c;
    double d;
};

struct Pair {
    int a;
    int b;
};

int main() {
    // print the two sizes
    return 0;
}
`,
        sampleInput: '',
        usesInput: false,
        tests: [{ input: '', expected: 'Size: 8\nPair: 8' }],
        hints: [
          '`sizeof(union Data)` gives the size of the union in bytes.',
          'Wrap it in `(int)` so `%d` prints it: `printf("Size: %d\\n", (int)sizeof(union Data));`',
          'Do the same for `struct Pair` on the next line. A similar example: the size line in the first `try` block of this lesson.',
        ],
      },
      {
        id: 'cx5-kind',
        title: 'Whole or decimal',
        prompt: 'An `Entry` holds a tag and a value. Read a kind (1 for whole, 2 for decimal) and a number, store it in the entry, then print `Whole: 7` or `Decimal: 2.50` (two decimals). Read the whole number with `%d` and the decimal with `%lf`.',
        starter: String.raw`#include <stdio.h>

enum Kind { WHOLE, DECIMAL };

union Value {
    int whole;
    double decimal;
};

typedef struct {
    enum Kind kind;
    union Value v;
} Entry;

int main() {
    Entry e;
    int k;
    scanf("%d", &k);
    // read the number into the right member, then print it
    return 0;
}
`,
        sampleInput: '1 7',
        usesInput: true,
        tests: [
          { input: '1 7', expected: 'Whole: 7' },
          { input: '2 2.5', expected: 'Decimal: 2.50' },
          { input: '2 10', expected: 'Decimal: 10.00', hidden: true },
          { input: '1 -3', expected: 'Whole: -3', hidden: true },
        ],
        hints: [
          'If `k == 1`, set `e.kind = WHOLE;` and `scanf("%d", &e.v.whole);`. Otherwise use `DECIMAL` and `scanf("%lf", &e.v.decimal);`.',
          'Print by looking at `e.kind`, not at `k`.',
          'A similar example: the tagged `show` function in this lesson.',
        ],
      },
      {
        id: 'cx5-share',
        title: 'Same memory',
        prompt: 'The union `Pair` has two `int` members, `a` and `b`. Read two numbers: store the first in `a`, then the second in `b`, and print `a` and `b` as `a=9 b=9` (for 5 and 9) to show they share memory.',
        starter: String.raw`#include <stdio.h>

union Pair {
    int a;
    int b;
};

int main() {
    union Pair p;
    int x, y;
    scanf("%d %d", &x, &y);
    // store x in a, then y in b, then print both
    return 0;
}
`,
        sampleInput: '5 9',
        usesInput: true,
        tests: [
          { input: '5 9', expected: 'a=9 b=9' },
          { input: '1 2', expected: 'a=2 b=2' },
          { input: '7 7', expected: 'a=7 b=7', hidden: true },
        ],
        hints: [
          'Assign `p.a = x;` and then `p.b = y;`.',
          'Because the members share memory, the second write replaces the first.',
          'Print with `printf("a=%d b=%d\\n", p.a, p.b);`',
        ],
      },
    ],
  },
];
