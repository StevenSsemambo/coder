// C++ Pro, Level 1: Real strings and vectors. Lesson 5 (struct, vector of structs, enum class).
import { progPro, progProFn } from './shared.js';

const LEVEL = 'Level 1: Real strings and vectors';
const INC_S = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';
const PS = (body) => progPro(body, INC_S);
const PSF = (above, body) => progProFn(above, body, INC_S);

export const structsLesson = {
  id: 'cppp-structs',
  level: LEVEL,
  minutes: 32,
  title: 'struct and enum class: your own types',
  summary: 'Grouping facts into one type, lists of structs, sorting them by a field, and named choices with enum class',
  blocks: [
    {
      t: 'story',
      title: 'The menu card',
      text: 'Each line of Mama Rose’s menu has several facts that **belong together**: the dish’s **name**, its **price**, and whether it is **available** today. So far you could only keep them in separate lists: one vector of names, one vector of prices, one of availability, and you had to make sure that “position 2” meant the same dish in all three. One slip, and the price of the rolex ends up next to the name of the soda.\n\nC++ lets you **make your own type** that holds the facts together: a **`struct`**. One `Item` holds a name and a price. A vector of `Item`s is then a menu.',
    },
    { t: 'p', text: 'A `struct` is described **above `main`**, with its **fields**. After that, `Item` can be used like any other type. The dot `.` reaches one field. Notice the semicolon after the closing bracket.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

struct Item {
    string name;
    int price;
};

int main() {
    Item soda = {"Soda", 1500};
    cout << soda.name << ": " << soda.price << endl;
    soda.price = 2000;
    cout << soda.name << ": " << soda.price << endl;
    return 0;
}
`,
      output: 'Soda: 1500\nSoda: 2000',
    },
    { t: 'analogy', text: 'A `struct` is like a **printed form** with named blanks: “Name: ____  Price: ____”. The struct is the blank form (the type). Each `Item` you create is one filled-in copy of the form.' },
    {
      t: 'list',
      items: [
        '`struct Item { string name; int price; };` describes the form. **The semicolon after the `}` is required.**',
        '`Item soda = {"Soda", 1500};` fills it in, **in the order the fields were written**.',
        '`soda.price` reads or changes one field.',
        '`Item b = a;` makes a **separate copy** of every field, just like copying an `int`.',
      ],
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

struct Item {
    string name;
    int price;
};

int main() {
    Item a = {"Tea", 1000};
    Item b = a;
    b.price = 1500;
    cout << a.price << " " << b.price << endl;
    return 0;
}
`,
      question: 'What does this program print?',
      options: ['1000 1500', '1500 1500', '1000 1000', '1500 1000'],
      answer: 0,
      explain: '`Item b = a;` copies all the fields into a **new** `Item`. Changing `b.price` afterwards does not affect `a`. (To share one item under two names you would use a reference, from the last lesson.)',
    },
    { t: 'h', text: 'A menu: a vector of structs' },
    { t: 'p', text: 'A `vector<Item>` holds many items. You can fill it with a list of lists, add to it with `push_back({...})`, and visit every item with a **`const &` range-for** (the read-only habit from the last lesson).' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Item {
    string name;
    int price;
};

int main() {
    vector<Item> menu = {{"Rolex", 3000}, {"Chapati", 1000}, {"Soda", 1500}};
    menu.push_back({"Tea", 1000});
    int total = 0;
    for (const Item &it : menu) {
        cout << it.name << " " << it.price << endl;
        total += it.price;
    }
    cout << "Menu worth: " << total << endl;
    return 0;
}
`,
      output: 'Rolex 3000\nChapati 1000\nSoda 1500\nTea 1000\nMenu worth: 6500',
    },
    { t: 'h', text: 'Structs and functions' },
    { t: 'p', text: 'A struct can be a function’s parameter (use `const Item &` to read it without copying) and a function’s return value.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Item {
    string name;
    int price;
};

Item makeItem(string name, int price) {
    Item it;
    it.name = name;
    it.price = price;
    return it;
}

void show(const Item &it) {
    cout << it.name << " costs " << it.price << " UGX" << endl;
}

int worth(const vector<Item> &items) {
    int total = 0;
    for (const Item &it : items) {
        total += it.price;
    }
    return total;
}

int main() {
    vector<Item> menu;
    menu.push_back(makeItem("Rolex", 3000));
    menu.push_back(makeItem("Soda", 1500));
    for (const Item &it : menu) {
        show(it);
    }
    cout << "Worth: " << worth(menu) << endl;
    return 0;
}
`,
      output: 'Rolex costs 3000 UGX\nSoda costs 1500 UGX\nWorth: 4500',
    },
    { t: 'h', text: 'Sorting structs by a field' },
    { t: 'p', text: 'This is where lambdas shine. Tell `sort` which **field** to compare, and the whole items are rearranged. (Here every price is different. If two items could have the same price, use `stable_sort` so that equal ones keep their order.)' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

struct Item {
    string name;
    int price;
};

int main() {
    vector<Item> menu = {{"Rolex", 3000}, {"Chapati", 1000}, {"Soda", 1500}};
    sort(menu.begin(), menu.end(), [](const Item &a, const Item &b) {
        return a.price < b.price;
    });
    for (const Item &it : menu) {
        cout << it.name << " ";
    }
    cout << endl;
    return 0;
}
`,
      output: 'Chapati Soda Rolex',
    },
    { t: 'h', text: 'Default values for fields' },
    { t: 'p', text: 'A field can have a **default value** written right in the struct. Then an `Order` you create without filling it in starts with sensible values, instead of unpredictable junk.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

struct Order {
    string customer = "walk-in";
    int qty = 1;
    bool paid = false;
};

int main() {
    Order o;
    cout << o.customer << " " << o.qty << " " << o.paid << endl;
    o.qty = 3;
    o.paid = true;
    cout << o.customer << " " << o.qty << " " << o.paid << endl;
    return 0;
}
`,
      output: 'walk-in 1 0\nwalk-in 3 1',
    },
    { t: 'h', text: 'enum class: names for a fixed set of choices' },
    { t: 'p', text: 'Sometimes a value can be only one of a small set of choices: a dish is a Food or a Drink; a mark is a Fail, Pass, Merit or Distinction. Using numbers like 0, 1, 2 for those is easy to get wrong. An **`enum class`** gives each choice a **name**, and the compiler stops you using a wrong one. You write the type name, then `::`, then the choice.' },
    {
      t: 'try',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

enum class Kind { Food, Drink };

string label(Kind k) {
    switch (k) {
        case Kind::Food:
            return "food";
        case Kind::Drink:
            return "drink";
    }
    return "?";
}

int main() {
    Kind k = Kind::Drink;
    cout << label(k) << endl;
    cout << label(Kind::Food) << endl;
    return 0;
}
`,
      output: 'drink\nfood',
    },
    {
      t: 'predict',
      code: String.raw`#include <iostream>
using namespace std;

enum class Level { Low, Mid, High };

int main() {
    Level l = Level::High;
    cout << static_cast<int>(l) << endl;
    return 0;
}
`,
      question: 'An `enum class` stores each choice as a number behind the scenes, counting from 0. What does this program print?',
      options: ['2', '1', '0', '3'],
      answer: 0,
      explain: 'Low is 0, Mid is 1 and High is 2. `static_cast<int>(l)` asks for that hidden number. You normally never need the number: you use the names.',
    },
    {
      t: 'fill',
      prompt: 'Fill the gap with the symbol that reaches one field of a struct.',
      template: String.raw`#include <iostream>
#include <string>
using namespace std;

struct Item {
    string name;
    int price;
};

int main() {
    Item it = {"Soda", 1500};
    cout << it___price << endl;
    return 0;
}
`,
      blanks: [{ options: ['.', '->', '::'], answer: '.' }],
      output: '1500',
    },
    {
      t: 'bug',
      code: String.raw`#include <iostream>
#include <string>
using namespace std;

struct Item {
    string name;
    int price;
}

int main() {
    Item it = {"Soda", 1500};
    cout << it.name << endl;
    return 0;
}
`,
      question: 'This program does not compile. What is missing?',
      options: ['A semicolon after the closing bracket of the struct', 'A return statement inside the struct', 'The word new before Item', 'Brackets after the name Item'],
      answer: 0,
      explain: 'A struct definition ends with `};`, a semicolon after the `}`. Forgetting it is the most common struct mistake, and the compiler’s message usually points at the line **after** it.',
      fixed: String.raw`#include <iostream>
#include <string>
using namespace std;

struct Item {
    string name;
    int price;
};

int main() {
    Item it = {"Soda", 1500};
    cout << it.name << endl;
    return 0;
}
`,
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    Item it = {"Soda", 1500};
    cout << it.cost << endl;`),
          why: 'There is no field called `cost`; the field is `price`. The compiler knows exactly which fields the struct has, and field names must match exactly.',
          right: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    Item it = {"Soda", 1500};
    cout << it.price << endl;`),
        },
        {
          wrong: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    Item it = {1500, "Soda"};
    cout << it.name << endl;`),
          why: 'The values in the braces fill the fields **in order**: first the name, then the price. Here a number was offered for the name and text for the price.',
          right: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    Item it = {"Soda", 1500};
    cout << it.name << endl;`),
        },
        {
          wrong: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    Item a = {"Soda", 1500};
    Item b = {"Soda", 1500};
    if (a == b) {
        cout << "same" << endl;
    }`),
          why: 'C++ does not know how to compare two of **your** types with `==`. (You can teach it later with operator overloading.) Compare the fields: `a.name == b.name && a.price == b.price`.',
          right: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    Item a = {"Soda", 1500};
    Item b = {"Soda", 1500};
    if (a.name == b.name && a.price == b.price) {
        cout << "same" << endl;
    }`),
        },
        {
          wrong: PSF(String.raw`enum class Kind { Food, Drink };`, String.raw`    Kind k = Drink;
    cout << "ok" << endl;`),
          why: 'The choices of an `enum class` are **inside** the type, so you must write the type name and `::` before them: `Kind::Drink`.',
          right: PSF(String.raw`enum class Kind { Food, Drink };`, String.raw`    Kind k = Kind::Drink;
    cout << "ok" << endl;`),
        },
        {
          logic: true,
          wrong: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    vector<Item> menu = {{"Rolex", 3000}, {"Soda", 1500}};
    for (Item it : menu) {
        it.price += 100;
    }
    cout << menu[0].price << " " << menu[1].price << endl;`),
          why: 'The loop variable `it` is a **copy** of each item, so the menu is unchanged and still prints 3000 1500. No error appears. To change the real items, write `for (Item &it : menu)`.',
          right: PSF(String.raw`struct Item {
    string name;
    int price;
};`, String.raw`    vector<Item> menu = {{"Rolex", 3000}, {"Soda", 1500}};
    for (Item &it : menu) {
        it.price += 100;
    }
    cout << menu[0].price << " " << menu[1].price << endl;`),
        },
      ],
    },
    { t: 'quiz', question: 'Which line makes `it` a separate copy of `soda`, so that changing `it` does not change `soda`?', options: ['Item it = soda;', 'Item &it = soda;', 'Item it == soda;', 'Item it -> soda;'], answer: 0, explain: '`Item it = soda;` copies every field. `Item &it = soda;` would be a second name for the very same item.' },
    { t: 'quiz', question: 'Why is `enum class Kind { Food, Drink };` better than using 0 for food and 1 for drink?', options: ['The names say what they mean and the compiler stops wrong values', 'It uses less memory', 'It makes the program faster', 'It lets you do arithmetic on the choices'], answer: 0, explain: 'With names such as `Kind::Drink` your code explains itself, and a number that is not one of the choices cannot sneak in by mistake.' },
    {
      t: 'recap',
      items: [
        '`struct Item { string name; int price; };` makes your own type. Put it above `main`, and do not forget the final `;`.',
        '`Item a = {"Soda", 1500};` fills the fields in order. `a.price` reaches one field. `Item b = a;` makes a separate copy.',
        'A `vector<Item>` is a list of records. Read it with `for (const Item &it : v)` and change it with `for (Item &it : v)`.',
        'Sort structs by a field with a lambda: `[](const Item &a, const Item &b) { return a.price < b.price; }`. You cannot compare two structs with `==` directly.',
        '`enum class Kind { Food, Drink };` names a fixed set of choices, used as `Kind::Drink`. Field defaults (`int qty = 1;`) avoid junk values.',
      ],
      memory: 'A printed form with named blanks.',
    },
  ],
  exercises: [
    {
      id: 'cppp5-menu',
      title: 'Cheapest and priciest',
      prompt: 'Read dishes until the input ends. Each dish is a **name** (one word) followed by a **price**. Store them in a `vector` of a struct, then print the cheapest and the most expensive dish. If two dishes tie, print the **first** one that was typed:\n\n`Cheapest: Chapati (1000)`\n`Priciest: Rolex (3000)`',
      starter: PSF('// Define the struct here, above main\n', '    // Read name and price pairs until the input ends'),
      tests: [
        { input: 'Rolex 3000 Chapati 1000 Soda 1500', expected: 'Cheapest: Chapati (1000)\nPriciest: Rolex (3000)' },
        { input: 'Tea 800', expected: 'Cheapest: Tea (800)\nPriciest: Tea (800)', hidden: true },
        { input: 'A 5 B 5', expected: 'Cheapest: A (5)\nPriciest: A (5)', hidden: true },
        { input: 'Soda 1500 Tea 1000 Rolex 3000 Egg 500', expected: 'Cheapest: Egg (500)\nPriciest: Rolex (3000)', hidden: true },
      ],
      hints: [
        'Make `struct Dish { string name; int price; };` and read with `while (cin >> name >> price) { dishes.push_back({name, price}); }`.',
        'Keep the index (or a copy) of the cheapest and of the priciest dish so far, starting with the first one.',
        'To keep the **first** one on ties, replace only when the new price is strictly smaller (or strictly bigger).',
      ],
    },
    {
      id: 'cppp5-receipt',
      title: 'The receipt',
      prompt: 'Read order lines until the input ends. Each line is a **name**, a **quantity** and a **price each**, for example `Rolex 2 3000`. Print one line per item and then the total:\n\n`Rolex x2 = 6000`\n`Soda x1 = 1500`\n`Total: 7500`',
      starter: PSF('// Define the struct for one order line here\n', '    // Read name, quantity and price until the input ends'),
      tests: [
        { input: 'Rolex 2 3000 Soda 1 1500', expected: 'Rolex x2 = 6000\nSoda x1 = 1500\nTotal: 7500' },
        { input: 'Tea 3 1000', expected: 'Tea x3 = 3000\nTotal: 3000', hidden: true },
        { input: 'A 1 10 B 2 20 C 3 30', expected: 'A x1 = 10\nB x2 = 40\nC x3 = 90\nTotal: 140', hidden: true },
      ],
      hints: [
        'Use a struct with three fields: `string name; int qty; int price;`. Read with `while (cin >> name >> qty >> price)`.',
        'The amount for one line is `qty * price`. Add it to a `total` as you print.',
        'Print each line as `name`, then `" x"`, then `qty`, then `" = "`, then the amount. Print the total after the loop.',
      ],
    },
    {
      id: 'cppp5-sortprice',
      title: 'Cheapest first',
      prompt: 'Read dishes until the input ends (name and price pairs). Print the **names** on one line, separated by spaces, ordered by **price**, cheapest first. Dishes with the same price keep the order in which they were typed. For `Rolex 3000 Chapati 1000 Soda 1500` print: `Chapati Soda Rolex`',
      starter: PSF('// Define the struct, read the dishes, sort them by price\n', '    // ...'),
      tests: [
        { input: 'Rolex 3000 Chapati 1000 Soda 1500', expected: 'Chapati Soda Rolex' },
        { input: 'A 5 B 5 C 1', expected: 'C A B', hidden: true },
        { input: 'Only 100', expected: 'Only', hidden: true },
        { input: 'X 20 Y 10 Z 20 W 10', expected: 'Y W X Z', hidden: true },
      ],
      hints: [
        'Read the dishes into a `vector` of your struct, then call `stable_sort` with a lambda that compares the `price` fields.',
        'The lambda is `[](const Dish &a, const Dish &b) { return a.price < b.price; }`. `stable_sort` keeps equal prices in their typed order.',
        'Print just the names, with a space between them.',
      ],
    },
    {
      id: 'cppp5-grade',
      title: 'Name the grade',
      prompt: 'Make an `enum class Grade { Fail, Pass, Merit, Distinction };` and a function `string gradeName(Grade g)` that uses a `switch`. Read a mark and decide the grade: **below 50** is Fail, **50 to 69** is Pass, **70 to 84** is Merit, and **85 or more** is Distinction. Print the name, for example: `Merit`',
      starter: PSF('// Write the enum class and the functions here\n', '    // Read the mark, decide the Grade, print its name'),
      tests: [
        { input: '49', expected: 'Fail' },
        { input: '50', expected: 'Pass' },
        { input: '75', expected: 'Merit' },
        { input: '69', expected: 'Pass', hidden: true },
        { input: '70', expected: 'Merit', hidden: true },
        { input: '85', expected: 'Distinction', hidden: true },
        { input: '100', expected: 'Distinction', hidden: true },
      ],
      hints: [
        'Write a function `Grade gradeOf(int mark)` with `if` / `else if` that returns `Grade::Fail`, `Grade::Pass` and so on.',
        'Then `string gradeName(Grade g)` with a `switch (g)` and a `case Grade::Pass:` for each choice that returns the text.',
        'In `main`: read the mark, call `gradeName(gradeOf(mark))` and print the result.',
      ],
    },
  ],
};
