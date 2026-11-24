// C++ Pro, Level 2: Classes and objects. Lesson 14 (project: an object-oriented shop).
import { progProFn } from './shared.js';

const LEVEL = 'Level 2: Classes and objects';
const INC_SH = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';

const HEAD = String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

`;

const INVENTORY = String.raw`class Product {
    string name;
    int stock;
    int price;
public:
    Product(string n, int s, int p) : name(n), stock(s), price(p) {}
    string getName() const { return name; }
    int getStock() const { return stock; }
    int getPrice() const { return price; }
    void add(int qty) { stock += qty; }
    void take(int qty) { stock -= qty; }
};

class Inventory {
    vector<Product> products;
    int find(const string &name) const {
        for (int i = 0; i < products.size(); i++) {
            if (products[i].getName() == name) {
                return i;
            }
        }
        return -1;
    }
public:
    void stock(const string &name, int qty, int price) {
        int i = find(name);
        if (i < 0) {
            products.push_back(Product(name, qty, price));
        } else {
            products[i].add(qty);
        }
    }
    bool exists(const string &name) const { return find(name) >= 0; }
    int left(const string &name) const {
        int i = find(name);
        return i < 0 ? 0 : products[i].getStock();
    }
    int priceOf(const string &name) const {
        int i = find(name);
        return i < 0 ? 0 : products[i].getPrice();
    }
    void sell(const string &name, int qty) {
        int i = find(name);
        if (i >= 0) {
            products[i].take(qty);
        }
    }
};

`;

const CART = String.raw`struct Line {
    string name;
    int qty;
    int price;
};

class Cart {
    vector<Line> lines;
public:
    void add(const string &name, int qty, int price) {
        lines.push_back({name, qty, price});
    }
    bool empty() const { return lines.empty(); }
    int subtotal() const {
        int sum = 0;
        for (const Line &l : lines) {
            sum += l.qty * l.price;
        }
        return sum;
    }
    const vector<Line> &all() const { return lines; }
    void clear() { lines.clear(); }
};

`;

const DISCOUNT = String.raw`class Discount {
public:
    virtual int apply(int price) const = 0;
    virtual ~Discount() {}
};

class NoDiscount : public Discount {
public:
    int apply(int price) const override { return price; }
};

class PercentOff : public Discount {
    int percent;
public:
    PercentOff(int p = 0) : percent(p) {}
    int apply(int price) const override { return price * (100 - percent) / 100; }
};

class FlatOff : public Discount {
    int amount;
public:
    FlatOff(int a = 0) : amount(a) {}
    int apply(int price) const override {
        int result = price - amount;
        return result < 0 ? 0 : result;
    }
};

`;

const MAIN1 = String.raw`int main() {
    Inventory inventory;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "stock") {
            string name;
            int qty, price;
            cin >> name >> qty >> price;
            inventory.stock(name, qty, price);
            cout << "Stocked " << name << " " << qty << endl;
        } else if (cmd == "left") {
            string name;
            cin >> name;
            cout << "Left: " << inventory.left(name) << endl;
        }
    }
    return 0;
}
`;

const MAIN2 = String.raw`int main() {
    Inventory inventory;
    Cart cart;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "stock") {
            string name;
            int qty, price;
            cin >> name >> qty >> price;
            inventory.stock(name, qty, price);
            cout << "Stocked " << name << " " << qty << endl;
        } else if (cmd == "buy") {
            string name;
            int qty;
            cin >> name >> qty;
            if (!inventory.exists(name)) {
                cout << "No such product " << name << endl;
            } else if (qty > inventory.left(name)) {
                cout << "Not enough " << name << endl;
            } else {
                cart.add(name, qty, inventory.priceOf(name));
                cout << "Added " << name << " x" << qty << endl;
            }
        } else if (cmd == "checkout") {
            if (cart.empty()) {
                cout << "Cart is empty" << endl;
            } else {
                for (const Line &l : cart.all()) {
                    cout << l.name << " x" << l.qty << " = " << l.qty * l.price << endl;
                    inventory.sell(l.name, l.qty);
                }
                cout << "Total: " << cart.subtotal() << endl;
                cart.clear();
            }
        } else if (cmd == "left") {
            string name;
            cin >> name;
            cout << "Left: " << inventory.left(name) << endl;
        }
    }
    return 0;
}
`;

const MAIN3 = String.raw`int main() {
    Inventory inventory;
    Cart cart;
    NoDiscount none;
    PercentOff percentRule;
    FlatOff flatRule;
    const Discount *rule = &none;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "stock") {
            string name;
            int qty, price;
            cin >> name >> qty >> price;
            inventory.stock(name, qty, price);
            cout << "Stocked " << name << " " << qty << endl;
        } else if (cmd == "discount") {
            string kind;
            cin >> kind;
            if (kind == "none") {
                rule = &none;
                cout << "Discount: none" << endl;
            } else if (kind == "percent") {
                int p;
                cin >> p;
                percentRule = PercentOff(p);
                rule = &percentRule;
                cout << "Discount: " << p << "%" << endl;
            } else if (kind == "flat") {
                int f;
                cin >> f;
                flatRule = FlatOff(f);
                rule = &flatRule;
                cout << "Discount: " << f << " off" << endl;
            }
        } else if (cmd == "buy") {
            string name;
            int qty;
            cin >> name >> qty;
            if (!inventory.exists(name)) {
                cout << "No such product " << name << endl;
            } else if (qty > inventory.left(name)) {
                cout << "Not enough " << name << endl;
            } else {
                cart.add(name, qty, inventory.priceOf(name));
                cout << "Added " << name << " x" << qty << endl;
            }
        } else if (cmd == "checkout") {
            if (cart.empty()) {
                cout << "Cart is empty" << endl;
            } else {
                for (const Line &l : cart.all()) {
                    cout << l.name << " x" << l.qty << " = " << l.qty * l.price << endl;
                    inventory.sell(l.name, l.qty);
                }
                int subtotal = cart.subtotal();
                int total = rule->apply(subtotal);
                cout << "Subtotal: " << subtotal << endl;
                cout << "Discount: " << subtotal - total << endl;
                cout << "Total: " << total << endl;
                cart.clear();
            }
        } else if (cmd == "left") {
            string name;
            cin >> name;
            cout << "Left: " << inventory.left(name) << endl;
        }
    }
    return 0;
}
`;

// The pieces of the finished shop, so the reference solution of the exercise can reuse them.
export const SHOP_PARTS = { HEAD, INVENTORY, CART, DISCOUNT, MAIN3 };

export const shopLesson = {
  id: 'cppp-shop',
  level: LEVEL,
  minutes: 40,
  title: 'Project: an object-oriented shop',
  summary: 'Combine classes, composition, inheritance and polymorphism into a working shop with stock, a cart and swappable discounts',
  blocks: [
    {
      t: 'story',
      title: 'The shop that grows',
      text: 'The rolex stand has become a small shop: it sells sodas, chapatis, eggs and tea, each with its own stock and price. Customers fill a cart, Mama Rose gives a discount on some days (10 percent off, or 500 shillings off), and at the end of the day she wants the stock to be right.\n\nThis is the project for Level 2. Instead of one big `main`, you will build the shop out of **small classes that each do one job**, and then **compose** them. You will use classes and constructors (lessons 7 and 8), encapsulation (9), inheritance and polymorphism for the discounts (11 and 12), and composition for everything else (13).',
    },
    { t: 'h', text: 'Plan first' },
    {
      t: 'list',
      items: [
        '`Product` (a name, a stock, a price) and `Inventory` (**has** a vector of products). The inventory is the only class that touches the stock numbers.',
        '`Cart` (**has** a vector of lines). A line is a name, a quantity and the price **at the moment it was bought**.',
        '`Discount`, an **abstract** class with `apply(price)`, and three kinds: `NoDiscount`, `PercentOff`, `FlatOff`. The shop uses a **pointer to the current rule** and never needs to know which kind it is.',
        'A command loop in `main`: `stock`, `buy`, `discount`, `checkout`, `left`, `quit`. `main` only reads commands and calls the objects.',
      ],
    },
    { t: 'h', text: 'Piece 1: the inventory' },
    { t: 'p', text: 'Start with the stock. `stock NAME QTY PRICE` adds a new product, or adds to the stock of an existing one (the price stays the first one given). `left NAME` reports what is on the shelf. Notice that `Inventory` hides the vector and the search, and the rest of the program only sees `stock`, `left`, `exists`, `priceOf` and `sell`.' },
    {
      t: 'project',
      title: 'Shop piece 1: stock and left',
      text: 'Press Run. Try stocking a new product, then asking for one that does not exist.',
      stdin: 'stock rolex 10 3000\nstock soda 5 1500\nstock rolex 5 9999\nleft rolex\nleft tea\nquit\n',
      code: HEAD + INVENTORY + MAIN1,
      output: 'Stocked rolex 10\nStocked soda 5\nStocked rolex 5\nLeft: 15\nLeft: 0',
    },
    { t: 'h', text: 'Piece 2: the cart and checkout' },
    { t: 'p', text: '`buy NAME QTY` first asks the inventory whether the product exists and whether there is enough on the shelf, and only then adds a line to the cart. `checkout` prints the lines, takes the goods **out of the inventory**, and empties the cart. A cart with nothing in it says so.' },
    {
      t: 'project',
      title: 'Shop piece 2: buy and checkout',
      text: 'Notice what happens to `left rolex` after the checkout.',
      stdin: 'stock rolex 10 3000\nstock soda 5 1500\nbuy rolex 2\nbuy soda 9\nbuy soda 1\nbuy tea 1\ncheckout\nleft rolex\nquit\n',
      code: HEAD + INVENTORY + CART + MAIN2,
      output: 'Stocked rolex 10\nStocked soda 5\nAdded rolex x2\nNot enough soda\nAdded soda x1\nNo such product tea\nrolex x2 = 6000\nsoda x1 = 1500\nTotal: 7500\nLeft: 8',
    },
    { t: 'h', text: 'Piece 3: discounts that can be swapped' },
    { t: 'p', text: 'Now the polymorphism. The shop keeps a `const Discount *rule` that points at the current discount. The `discount` command just **moves the pointer**. At checkout, `rule->apply(subtotal)` runs the right version without any `if` about the kind of discount. Adding a fourth kind of discount later means writing one new class and one new command, and **nothing else changes**.' },
    {
      t: 'project',
      title: 'The finished shop',
      text: 'Compare the two checkouts: the percentage discount and then the flat discount. The last checkout finds the cart empty.',
      stdin: 'stock rolex 10 3000\nstock soda 5 1500\ndiscount percent 10\nbuy rolex 2\nbuy soda 1\ncheckout\ndiscount flat 500\nbuy rolex 1\ncheckout\ncheckout\nquit\n',
      code: HEAD + INVENTORY + CART + DISCOUNT + MAIN3,
      output: 'Stocked rolex 10\nStocked soda 5\nDiscount: 10%\nAdded rolex x2\nAdded soda x1\nrolex x2 = 6000\nsoda x1 = 1500\nSubtotal: 7500\nDiscount: 750\nTotal: 6750\nDiscount: 500 off\nAdded rolex x1\nrolex x1 = 3000\nSubtotal: 3000\nDiscount: 500\nTotal: 2500\nCart is empty',
    },
    { t: 'h', text: 'What you used' },
    {
      t: 'list',
      items: [
        'Lessons 7 to 9: classes with private data and methods that protect it (`Inventory` is the only code that changes stock).',
        'Lesson 10: nothing here needs an operator, which is fine: use an operator only where it makes the code clearer.',
        'Lessons 11 and 12: `Discount` is an abstract class with three derived classes, used through a base pointer.',
        'Lesson 13: composition everywhere else: an `Inventory` **has** `Product`s, a `Cart` **has** `Line`s, and the shop **has** a rule.',
        'Level 1: vectors, structs, strings, references (`const &` parameters).',
      ],
    },
    { t: 'tip', text: 'Ideas to try after the exercises: stop a customer buying more than the shelf holds **across several `buy` commands** (the cart does not reserve stock yet), add a `remove NAME` command, add a fourth discount (“buy 3, get the cheapest free”), and a `report` command that shows the day’s sales.' },
    { t: 'quiz', question: 'Why does the shop keep a `const Discount *` instead of an `if` that checks which discount kind is active?', options: ['A new kind of discount needs a new class and no change to the checkout code', 'Pointers are faster than if statements', 'if statements cannot compare text', 'A discount cannot be copied'], answer: 0, explain: 'The checkout calls `rule->apply(...)` and the real object answers. The code that **uses** discounts never changes, however many kinds you add.' },
    {
      t: 'recap',
      items: [
        'Build the program from small classes that each do one job (`Inventory`, `Cart`, `Discount`) and keep `main` thin: it reads commands and calls objects.',
        'Composition for “has-a” (`Inventory` has `Product`s). Inheritance plus `virtual` for “is-a” that you want to swap (`Discount`).',
        'Let one class own each fact: only `Inventory` changes stock, so the number can never be wrong in two places.',
        'A pointer to an abstract base (`const Discount *`) lets you change behaviour by changing what it points at.',
        'Test each piece on its own before you add the next one.',
      ],
      memory: 'Small classes, one job each, composed.',
    },
  ],
  exercises: [
    {
      id: 'cppp14-shop',
      title: 'Build the shop',
      prompt: 'Build the shop. Read commands until `quit` or the end of the input:\n\n* `stock NAME QTY PRICE`: add a product, or add to its stock (the price stays the first one given). Prints `Stocked NAME QTY`\n* `discount none` prints `Discount: none`; `discount percent P` prints `Discount: P%`; `discount flat F` prints `Discount: F off`\n* `buy NAME QTY`: if the product does not exist print `No such product NAME`; if QTY is more than its stock print `Not enough NAME`; otherwise add to the cart and print `Added NAME xQTY`\n* `checkout`: if the cart is empty print `Cart is empty`. Otherwise print one `NAME xQTY = AMOUNT` line per cart line, then `Subtotal: S`, `Discount: D` (how much was taken off) and `Total: T`, reduce the stock, and empty the cart\n* `left NAME`: prints `Left: N` (0 if unknown)\n\nThe discount starts as none. A **percent** discount is `subtotal * (100 - P) / 100`; a **flat** discount never goes below 0.',
      starter: progProFn('// Write your classes here: Product, Inventory, Cart, Discount and its kinds\n', '    // Read commands until quit or the end of the input', INC_SH),
      tests: [
        { input: 'stock rolex 10 3000\nstock soda 5 1500\ndiscount percent 10\nbuy rolex 2\nbuy soda 1\ncheckout\ndiscount flat 500\nbuy rolex 1\ncheckout\ncheckout\nquit\n', expected: 'Stocked rolex 10\nStocked soda 5\nDiscount: 10%\nAdded rolex x2\nAdded soda x1\nrolex x2 = 6000\nsoda x1 = 1500\nSubtotal: 7500\nDiscount: 750\nTotal: 6750\nDiscount: 500 off\nAdded rolex x1\nrolex x1 = 3000\nSubtotal: 3000\nDiscount: 500\nTotal: 2500\nCart is empty' },
        { input: 'checkout\n', expected: 'Cart is empty' },
        { input: 'buy x 1\n', expected: 'No such product x', hidden: true },
        { input: 'stock a 3 100\nbuy a 4\nbuy a 3\ncheckout\nleft a\n', expected: 'Stocked a 3\nNot enough a\nAdded a x3\na x3 = 300\nSubtotal: 300\nDiscount: 0\nTotal: 300\nLeft: 0', hidden: true },
        { input: 'stock a 5 100\ndiscount flat 1000\nbuy a 1\ncheckout\ndiscount none\nbuy a 2\ncheckout\n', expected: 'Stocked a 5\nDiscount: 1000 off\nAdded a x1\na x1 = 100\nSubtotal: 100\nDiscount: 100\nTotal: 0\nDiscount: none\nAdded a x2\na x2 = 200\nSubtotal: 200\nDiscount: 0\nTotal: 200', hidden: true },
        { input: 'stock a 2 10\nstock a 3 99\nleft a\nleft b\n', expected: 'Stocked a 2\nStocked a 3\nLeft: 5\nLeft: 0', hidden: true },
      ],
      hints: [
        'Follow the three pieces of the lesson: `Product` and `Inventory` first, then `Cart`, then the `Discount` family with a `const Discount *rule` pointer in `main`.',
        'Make `Inventory` the only owner of the stock numbers (`stock`, `exists`, `left`, `priceOf`, `sell`), and give the cart lines the price at the moment of `buy`.',
        'For `discount percent P` and `discount flat F`, create the discount objects once in `main` and **move the pointer** to the right one. `checkout` calls `rule->apply(subtotal)` and prints `subtotal - total` as the discount.',
      ],
    },
    {
      id: 'cppp14-sales',
      title: 'The sales report',
      prompt: 'Record sales and report them. Read commands until the input ends:\n\n* `sale NAME QTY PRICE`: record one sale (nothing printed)\n* `report`: if there are no sales print `No sales`. Otherwise print one line per product, `NAME qty=Q revenue=R`, with the quantities and revenues **added up per product**, ordered by **revenue, biggest first** (products with the same revenue keep the order in which they first appeared). Then print `Total revenue: T` and `Best seller: NAME` (the product with the biggest revenue; the first one on a tie).',
      starter: progProFn('// Write your classes here\n', '    // Read commands until the input ends', INC_SH),
      tests: [
        { input: 'sale rolex 2 3000\nsale soda 1 1500\nsale rolex 1 3000\nreport\n', expected: 'rolex qty=3 revenue=9000\nsoda qty=1 revenue=1500\nTotal revenue: 10500\nBest seller: rolex' },
        { input: 'report\n', expected: 'No sales', hidden: true },
        { input: 'sale a 1 10\nsale b 1 10\nreport\n', expected: 'a qty=1 revenue=10\nb qty=1 revenue=10\nTotal revenue: 20\nBest seller: a', hidden: true },
        { input: 'sale tea 1 500\nsale rolex 1 3000\nsale tea 2 500\nreport\n', expected: 'rolex qty=1 revenue=3000\ntea qty=3 revenue=1500\nTotal revenue: 4500\nBest seller: rolex', hidden: true },
      ],
      hints: [
        'Make a small class (or struct) for one product’s totals (`name`, `qty`, `revenue`) and a `SalesLog` class that **has** a `vector` of them. `record(name, qty, price)` finds the product or adds a new one.',
        'For the report, copy the vector and use `stable_sort` with a lambda comparing `revenue` (biggest first). `stable_sort` keeps first-appearance order for ties.',
        'The best seller is simply the first line after sorting. Add up the total revenue as you print.',
      ],
    },
  ],
};
