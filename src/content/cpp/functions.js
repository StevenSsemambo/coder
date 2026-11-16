// C++, Level 3: Functions. Lessons 10 to 12 (functions, parameters and scope, recursion).
import { progFn, prog, HEAD, IO_FMT } from './shared.js';

const LEVEL = 'Level 3: Functions';

export const functionLessons = [
  // ================================================================== 10
  {
    id: 'cpp-functions',
    level: LEVEL,
    minutes: 26,
    title: 'Functions: write it once, use it many times',
    summary: 'Defining and calling functions, parameters, return values, prototypes and bool functions',
    blocks: [
      {
        t: 'story',
        title: 'The recipe card',
        text: 'Mama Rose has a **recipe card** pinned above the grill: “How to make a rolex”. When a helper joins her, she does not explain the whole recipe again. She just says “Make a rolex” and the helper follows the card. If she changes the recipe, she changes the card **once**, and every helper uses the new version.\n\nA **function** is a recipe card for your program: a named block of code that you write once and **call** as many times as you like.',
      },
      { t: 'p', text: 'You have been using one function since lesson 1: `main`. Now you will write your own. This one only **does** something, so its type is `void` (“gives nothing back”).' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void welcome() {
    cout << "Karibu to Mama Rose's stand" << endl;
    cout << "Today's special: rolex" << endl;
}

int main() {
    welcome();
    cout << "---" << endl;
    welcome();
    return 0;
}
`,
        output: "Karibu to Mama Rose's stand\nToday's special: rolex\n---\nKaribu to Mama Rose's stand\nToday's special: rolex",
      },
      { t: 'analogy', text: 'A recipe card has three things: a **name** (how to make a rolex), the **ingredients** it needs (eggs, a chapati), and the **result** you get (a finished rolex). A function has the same three: its name, its **parameters** (the ingredients it needs) and its **return value** (the result it gives back).' },
      { t: 'h', text: 'Parameters and return values' },
      { t: 'p', text: 'Here is a function that needs one ingredient, the quantity, and gives back one result, the cost. The word before the name, `int`, is the **return type**. The word `return` hands the result back to whoever called the function.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int cost(int qty) {
    return qty * 3000;
}

int main() {
    cout << "2 rolex cost " << cost(2) << " UGX" << endl;
    cout << "5 rolex cost " << cost(5) << " UGX" << endl;
    return 0;
}
`,
        output: '2 rolex cost 6000 UGX\n5 rolex cost 15000 UGX',
      },
      {
        t: 'list',
        items: [
          '`int` (before the name) is the **return type**: what kind of value comes back. Use `void` when nothing comes back.',
          '`cost` is the function’s name. Choose a name that says what it does.',
          '`(int qty)` is the **parameter list**: each ingredient has a type and a name. Several parameters are separated by commas.',
          '`return qty * 3000;` sends the answer back and ends the function immediately.',
          '`cost(2)` is the **call**. The `2` is the **argument**: it is copied into the parameter `qty`.',
        ],
      },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int twice(int x) {
    return 2 * x;
}

int main() {
    cout << twice(4) << " " << twice(twice(2)) << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['8 8', '8 4', '4 8', '8 16'],
        answer: 0,
        explain: '`twice(4)` is 8. In `twice(twice(2))` the inner call runs first: `twice(2)` is 4, and then `twice(4)` is 8. A call is just a value, so you can use it anywhere a number fits.',
      },
      { t: 'h', text: 'Several parameters, and more than one return' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int bigger(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int main() {
    cout << bigger(3, 9) << endl;
    cout << bigger(12, 4) << endl;
    return 0;
}
`,
        output: '9\n12',
      },
      { t: 'p', text: 'The first `return` that runs **ends the function** straight away. When `a > b` is true the function returns `a` and never reaches the last line.' },
      { t: 'h', text: 'Functions that answer yes or no' },
      { t: 'p', text: 'A function whose return type is `bool` answers a yes/no question. Give it a name that reads like a question, such as `isEven`. Then the `if` that uses it reads like English.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

bool isEven(int n) {
    return n % 2 == 0;
}

int main() {
    if (isEven(10)) {
        cout << "10 is even" << endl;
    }
    if (!isEven(7)) {
        cout << "7 is odd" << endl;
    }
    return 0;
}
`,
        output: '10 is even\n7 is odd',
      },
      { t: 'h', text: 'A function that gives back a decimal' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
#include <iomanip>
using namespace std;

double average(int a, int b) {
    return (a + b) / 2.0;
}

int main() {
    cout << fixed << setprecision(2);
    cout << "Average: " << average(3, 4) << endl;
    return 0;
}
`,
        output: 'Average: 3.50',
      },
      { t: 'h', text: 'Where to write your functions' },
      { t: 'p', text: 'The computer reads the file from the top. A function must be **known** before the line that calls it. There are two ways: write the function **above** `main` (what we did so far), or put a short announcement, a **prototype**, above `main` and the full function below it. A prototype is the first line of the function followed by a semicolon.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int cost(int qty);

int main() {
    cout << "Cost: " << cost(3) << endl;
    return 0;
}

int cost(int qty) {
    return qty * 3000;
}
`,
        output: 'Cost: 9000',
      },
      { t: 'tip', text: 'Honest warning: the practice runner in this app is lenient and runs a call that comes **before** the function’s definition even without a prototype. A real C++ compiler refuses that. Always put the function above `main`, or write a prototype.' },
      {
        t: 'fill',
        prompt: 'Fill the gap with the return type of the function. It gives back a whole number.',
        template: String.raw`#include <iostream>
using namespace std;

___ cost(int qty) {
    return qty * 3000;
}

int main() {
    cout << cost(2) << endl;
    return 0;
}
`,
        blanks: [{ options: ['int', 'void', 'bool'], answer: 'int' }],
        output: '6000',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int cost(int qty) {
    int total = qty * 3000;
}

int main() {
    cout << cost(2) << endl;
    return 0;
}
`,
        question: 'This program stops with an error. What is wrong?',
        options: ['The function promises an int but never returns one', 'qty must be a double', 'cost cannot be used inside cout', 'main must come first'],
        answer: 0,
        explain: 'The return type `int` is a promise: “I will hand back a whole number”. The function worked out `total` but never sent it back with `return`. Add `return total;`.',
        fixed: String.raw`#include <iostream>
using namespace std;

int cost(int qty) {
    int total = qty * 3000;
    return total;
}

int main() {
    cout << cost(2) << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: progFn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    cout << add(1) << endl;`),
            why: 'The function needs **two** ingredients, but the call gave only one. The number of arguments must match the number of parameters.',
            right: progFn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    cout << add(1, 2) << endl;`),
          },
          {
            wrong: progFn(String.raw`int add(a, b) {
    return a + b;
}`, String.raw`    cout << add(1, 2) << endl;`),
            why: 'Every parameter needs its own type: `int a, int b`. Writing `int` once for both does not work either.',
            right: progFn(String.raw`int add(int a, int b) {
    return a + b;
}`, String.raw`    cout << add(1, 2) << endl;`),
          },
          {
            wrong: progFn(String.raw`void report() {
    return 5;
}`, String.raw`    report();`),
            why: 'A `void` function gives nothing back, so it may not return a value. If it should hand back a number, change `void` to `int`.',
            right: progFn(String.raw`int report() {
    return 5;
}`, String.raw`    cout << report() << endl;`),
          },
          {
            logic: true,
            wrong: progFn(String.raw`int cost(int qty) {
    return qty * 3000;
}`, String.raw`    cost(2);`),
            why: 'The function runs and works out 6000, but nobody uses the answer, so nothing is printed and no error appears. A returned value must be printed or stored: `cout << cost(2);` or `int c = cost(2);`.',
            right: progFn(String.raw`int cost(int qty) {
    return qty * 3000;
}`, String.raw`    cout << cost(2) << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'What does `return` do inside a function?', options: ['Sends a value back and ends the function', 'Prints a value', 'Starts the function again', 'Declares a variable'], answer: 0, explain: '`return` hands the answer to the caller and stops the function right there. Nothing after it in that function runs.' },
      { t: 'quiz', question: 'Which return type is right for a function that answers “is this number prime?”', options: ['bool', 'void', 'char', 'double'], answer: 0, explain: 'A yes/no answer is a `bool`: true for yes and false for no.' },
      {
        t: 'recap',
        items: [
          'A function is a named block of code. Write it once, call it many times.',
          '`returnType name(parameters) { ... return value; }`. Use `void` when nothing comes back.',
          'The arguments in the call are copied into the parameters, in order. The count must match.',
          '`return` ends the function immediately. Use `bool` for yes/no answers.',
          'A function must be known before it is called: write it above `main` or use a prototype.',
        ],
        memory: 'Name, ingredients, result.',
      },
    ],
    exercises: [
      {
        id: 'cpp10-cost',
        title: 'The cost function',
        prompt: 'Write a function `int cost(int qty)` that returns the cost of `qty` rolex at 3000 shillings each. In `main`, read the quantity and print: `Cost: 6000` (for 2 rolex).',
        starter: progFn(String.raw`// Write the function cost here, above main
`, String.raw`    // Read qty, call cost(qty) and print Cost: ...`),
        tests: [
          { input: '2', expected: 'Cost: 6000' },
          { input: '5', expected: 'Cost: 15000' },
          { input: '0', expected: 'Cost: 0', hidden: true },
          { input: '11', expected: 'Cost: 33000', hidden: true },
        ],
        hints: [
          'The function needs one `int` parameter and returns an `int`: `int cost(int qty) { ... }`.',
          'Inside the function write `return qty * 3000;`. In `main`, read `qty` with `cin` and print `cost(qty)`.',
          'A similar example: `int twice(int x) { return 2 * x; }` and then `cout << twice(4);` prints 8.',
        ],
      },
      {
        id: 'cpp10-bigger',
        title: 'Which is bigger?',
        prompt: 'Write a function `int bigger(int a, int b)` that returns the larger of two numbers. In `main`, read two numbers and print: `Bigger: 9`.',
        starter: progFn(String.raw`// Write the function bigger here, above main
`, String.raw`    // Read two numbers, print Bigger: ...`),
        tests: [
          { input: '3 9', expected: 'Bigger: 9' },
          { input: '12 4', expected: 'Bigger: 12' },
          { input: '5 5', expected: 'Bigger: 5', hidden: true },
          { input: '-3 -8', expected: 'Bigger: -3', hidden: true },
        ],
        hints: [
          'The function takes two `int` parameters and returns an `int`.',
          'Inside: `if (a > b) { return a; }` and then `return b;` on the next line.',
          'A similar example: a function `smaller(a, b)` would use `if (a < b) { return a; } return b;`',
        ],
      },
      {
        id: 'cpp10-prime',
        title: 'Is it prime?',
        prompt: 'A prime number is a whole number greater than 1 that divides evenly only by 1 and itself (2, 3, 5, 7, 11 ...). Write a function `bool isPrime(int n)`. In `main`, read a number and print `Prime` or `Not prime`.',
        starter: progFn(String.raw`// Write the bool function isPrime here, above main
`, String.raw`    // Read n and print Prime or Not prime`),
        tests: [
          { input: '7', expected: 'Prime' },
          { input: '12', expected: 'Not prime' },
          { input: '2', expected: 'Prime', hidden: true },
          { input: '1', expected: 'Not prime', hidden: true },
          { input: '97', expected: 'Prime', hidden: true },
          { input: '91', expected: 'Not prime', hidden: true },
        ],
        hints: [
          'If `n` is less than 2, return `false` straight away. Otherwise try to divide it by every number from 2 up to n - 1.',
          'Loop `for (int i = 2; i < n; i++)`. If `n % i == 0` you found a divisor, so `return false;`. If the loop finishes, `return true;`.',
          'A similar example: `bool isEven(int n) { return n % 2 == 0; }`. Here the answer needs a loop before the final `return true;`.',
        ],
      },
    ],
  },

  // ================================================================== 11
  {
    id: 'cpp-scope',
    level: LEVEL,
    minutes: 26,
    title: 'Parameters, scope and default arguments',
    summary: 'Copies of values, local and global variables, static, and default arguments',
    blocks: [
      {
        t: 'story',
        title: 'Whose notebook is it?',
        text: 'Mama Rose has a **personal notebook** in her apron, and a **price board** on the wall. Her helper Amina also has her own notebook. Amina cannot read Mama Rose’s notebook, and when Amina scribbles in hers, Mama Rose’s does not change. But **everybody** can read the price board.\n\nVariables live in the same way. Some belong to one function only (**local**). Some are shared by the whole program (**global**). The area where a variable can be used is called its **scope**.',
      },
      { t: 'h', text: 'A parameter is a copy' },
      { t: 'p', text: 'When you call a function, the argument’s **value is copied** into the parameter. The function changes its own copy only. Run this and watch the two numbers.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void bump(int x) {
    x = x + 10;
    cout << "inside: " << x << endl;
}

int main() {
    int a = 5;
    bump(a);
    cout << "outside: " << a << endl;
    return 0;
}
`,
        output: 'inside: 15\noutside: 5',
      },
      { t: 'p', text: 'To get a changed value **out** of a function, return it and store it: `a = bump(a);`. (Later in this track you will also meet references, which let a function change the caller’s variable directly.)' },
      { t: 'h', text: 'Local variables' },
      { t: 'p', text: 'A variable declared inside a function exists only while that function runs. The parameters are local too. Other functions cannot see them, even if they have the same name.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int x = 1;

void f() {
    int x = 2;
    cout << x << " ";
}

int main() {
    f();
    cout << x << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['2 1', '1 1', '2 2', '1 2'],
        answer: 0,
        explain: 'The function has its own local `x` (2). That local one **hides** the global `x` inside `f`, so `f` prints 2. In `main` the global `x` is still 1. This hiding is called **shadowing**.',
      },
      { t: 'h', text: 'Global variables' },
      { t: 'p', text: 'A variable declared **outside** every function is global: all functions can use it. It is handy for something the whole program shares, like a count of customers served. Use globals sparingly: when many functions can change a value, it is hard to find out who changed it.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int served = 0;

void serveCustomer() {
    served++;
}

int main() {
    serveCustomer();
    serveCustomer();
    serveCustomer();
    cout << "Served: " << served << endl;
    return 0;
}
`,
        output: 'Served: 3',
      },
      { t: 'h', text: 'static: a local variable that remembers' },
      { t: 'p', text: 'A normal local variable is created fresh at every call and forgotten at the end. Put `static` in front and it is created **once** and keeps its value between calls, but it is still visible only inside its function.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void tick() {
    static int n = 0;
    n++;
    cout << n << " ";
}

int main() {
    tick();
    tick();
    tick();
    cout << endl;
    return 0;
}
`,
        output: '1 2 3',
      },
      { t: 'h', text: 'Default arguments' },
      { t: 'p', text: 'You can give a parameter a **default value**. If the caller leaves that argument out, the default is used. Default parameters must come **last** in the list.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int fee(int amount, int percent = 10) {
    return amount * percent / 100;
}

int main() {
    cout << fee(1000) << endl;
    cout << fee(1000, 5) << endl;
    return 0;
}
`,
        output: '100\n50',
      },
      { t: 'tip', text: 'In a real C++ program the default value is usually written in the prototype (`int fee(int amount, int percent = 10);`), not in the function below it. This app’s practice runner only understands defaults written in the function definition, so in these lessons write the full function **above** `main`, as above.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so that tick() remembers its count between calls and prints 1 2 3.',
        template: String.raw`#include <iostream>
using namespace std;

void tick() {
    ___ int n = 0;
    n++;
    cout << n << " ";
}

int main() {
    tick();
    tick();
    tick();
    cout << endl;
    return 0;
}
`,
        blanks: [{ options: ['static', 'const', 'global'], answer: 'static' }],
        output: '1 2 3',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

void makeSecret() {
    int secret = 42;
}

int main() {
    makeSecret();
    cout << secret << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['secret is a local variable of makeSecret, so main cannot see it', 'secret must be a double', 'makeSecret must return a bool', 'cout cannot print numbers'],
        answer: 0,
        explain: 'A variable declared inside a function exists only inside it. When `makeSecret` ends, `secret` is gone, and `main` has never heard of it. Return the value instead: `int makeSecret() { return 42; }`.',
        fixed: String.raw`#include <iostream>
using namespace std;

int makeSecret() {
    return 42;
}

int main() {
    cout << makeSecret() << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: progFn(String.raw`void addTip(int total) {
    total = total + 500;
}`, String.raw`    int total = 3000;
    addTip(total);
    cout << total << endl;`),
            why: 'The function changed its **copy**, so `total` in `main` is still 3000 and no error appears. Return the new value and store it: `total = addTip(total);`.',
            right: progFn(String.raw`int addTip(int total) {
    return total + 500;
}`, String.raw`    int total = 3000;
    total = addTip(total);
    cout << total << endl;`),
          },
          {
            wrong: progFn(String.raw`int price() {
    int rate = 10;
    return 3000;
}`, String.raw`    cout << price() * rate << endl;`),
            why: '`rate` belongs to the function `price` only. `main` cannot use it. Declare `rate` in `main`, or make the value a global if both really need it.',
            right: progFn(String.raw`int price() {
    return 3000;
}`, String.raw`    int rate = 10;
    cout << price() * rate << endl;`),
          },
          {
            logic: true,
            wrong: progFn(String.raw`int served = 0;

void serve() {
    int served = 0;
    served++;
}`, String.raw`    serve();
    serve();
    cout << served << endl;`),
            why: 'Inside `serve` the line `int served = 0;` creates a **new local** variable that hides the global one. The global `served` is never touched and stays 0. Remove the `int` so the function uses the global.',
            right: progFn(String.raw`int served = 0;

void serve() {
    served++;
}`, String.raw`    serve();
    serve();
    cout << served << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'A function changes its parameter. What happens to the caller’s variable?', options: ['Nothing, the function only changed a copy', 'It changes too', 'The program stops with an error', 'It becomes zero'], answer: 0, explain: 'The argument’s value was copied into the parameter. Changing the copy never touches the original.' },
      { t: 'quiz', question: 'What does `static` do to a local variable?', options: ['It keeps its value between calls', 'It makes it global', 'It makes it a constant', 'It hides it from the function'], answer: 0, explain: 'A `static` local is created once and remembers its value from one call to the next, but only its own function can see it.' },
      {
        t: 'recap',
        items: [
          'Arguments are **copied** into parameters. To get a result out, `return` it.',
          'A local variable lives inside its function only. A global variable is declared outside all functions.',
          'A local with the same name as a global **hides** it inside the function (shadowing).',
          '`static` makes a local variable remember its value between calls.',
          'A default argument (`int percent = 10`) is used when the caller leaves it out. Defaults go last.',
        ],
        memory: 'Copies in, return out.',
      },
    ],
    exercises: [
      {
        id: 'cpp11-fee',
        title: 'The fee with a default',
        prompt: 'Write `int fee(int amount, int percent = 10)` that returns `amount * percent / 100`. Read an amount and print two lines, one with the default percent and one with 5 percent:\n\n`Fee: 100`\n`Fee at 5%: 50`\n\n(for an amount of 1000)',
        starter: progFn(String.raw`// Write fee here, above main, with a default for percent
`, String.raw`    // Read amount, print both fee lines`),
        tests: [
          { input: '1000', expected: 'Fee: 100\nFee at 5%: 50' },
          { input: '20000', expected: 'Fee: 2000\nFee at 5%: 1000' },
          { input: '0', expected: 'Fee: 0\nFee at 5%: 0', hidden: true },
        ],
        hints: [
          'Write the default in the parameter list: `int percent = 10`. The function returns `amount * percent / 100`.',
          'Call it twice: `fee(amount)` uses the default, and `fee(amount, 5)` gives 5 percent.',
          'A similar example: `int total(int price, int qty = 1) { return price * qty; }` then `total(500)` is 500 and `total(500, 3)` is 1500.',
        ],
      },
      {
        id: 'cpp11-served',
        title: 'Customers served today',
        prompt: 'Use two **global** variables, `served` and `earned`, and a function `void sale(int amount)` that adds one to `served` and adds `amount` to `earned`. In `main`, read sale amounts until you read 0, calling `sale` for each. Then print:\n\n`Served: 3`\n`Earned: 9000`',
        starter: progFn(String.raw`// Declare the globals served and earned, then write sale(int amount)
`, String.raw`    // Read amounts until 0, call sale for each, then print the two lines`),
        tests: [
          { input: '3000 1000 5000 0', expected: 'Served: 3\nEarned: 9000' },
          { input: '2500 0', expected: 'Served: 1\nEarned: 2500' },
          { input: '0', expected: 'Served: 0\nEarned: 0', hidden: true },
        ],
        hints: [
          'Declare `int served = 0;` and `int earned = 0;` above the functions, outside everything.',
          'Inside `sale`: `served++;` and `earned += amount;`. Do not write `int` in front of them there, or you create new local variables.',
          'In `main`: read the first amount, `while (amount != 0) { sale(amount); cin >> amount; }`, then print.',
        ],
      },
      {
        id: 'cpp11-newprice',
        title: 'The discounted price',
        prompt: 'Write a function `int discounted(int price)` that returns the price after a 10 percent discount (`price * 90 / 100`). In `main`, read a price and print the original and the new price. The original must **not** change:\n\n`Original: 5000`\n`Now: 4500`',
        starter: progFn(String.raw`// Write discounted here, above main
`, String.raw`    // Read price, print Original: and Now:`),
        tests: [
          { input: '5000', expected: 'Original: 5000\nNow: 4500' },
          { input: '1200', expected: 'Original: 1200\nNow: 1080' },
          { input: '0', expected: 'Original: 0\nNow: 0', hidden: true },
        ],
        hints: [
          'The function returns `price * 90 / 100`. It does not print anything itself.',
          'In `main`, store the answer in a **new** variable: `int now = discounted(price);` so `price` keeps its value.',
          'A similar example: `int doubled = twice(x);` leaves `x` unchanged and puts the result in `doubled`.',
        ],
      },
    ],
  },

  // ================================================================== 12
  {
    id: 'cpp-recursion',
    level: LEVEL,
    minutes: 26,
    title: 'Recursion: a function that calls itself',
    summary: 'Base case, recursive case, tracing the calls, and the limits of recursion',
    blocks: [
      {
        t: 'story',
        title: 'The pile of trays',
        text: 'A tall pile of trays stands on Mama Rose’s table and she wants to know how many trays are in it. She cannot see all of them at once. So she does something clever. She takes the top tray off, and asks her helper: “**How many trays are left in the pile?**” Then she adds 1 for the tray she is holding.\n\nHer helper does exactly the same: takes a tray, asks the next helper, adds 1. This continues until a helper faces an **empty table** and says “Zero.” Then every helper, in turn, adds 1 and passes the answer back.\n\nThe same question was asked again and again, about a slightly smaller pile. That is **recursion**: a function that solves a problem by calling **itself** on a smaller version of the problem.',
      },
      { t: 'p', text: 'Every recursive function needs two parts:' },
      {
        t: 'list',
        items: [
          'The **base case**: the situation so small that the function answers directly, with no further call (the empty table).',
          'The **recursive case**: the function calls itself with a **smaller** problem, and uses the answer (“take one tray, ask the next helper, add 1”).',
        ],
      },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int countTrays(int n) {
    if (n == 0) {
        return 0;
    }
    return 1 + countTrays(n - 1);
}

int main() {
    cout << "Trays: " << countTrays(5) << endl;
    return 0;
}
`,
        output: 'Trays: 5',
      },
      { t: 'h', text: 'Watching the calls' },
      { t: 'p', text: 'This function prints on the way **in** (before the call) and on the way **out** (after it). Predict what it prints before you run it.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

void show(int n) {
    if (n == 0) {
        return;
    }
    cout << n << " ";
    show(n - 1);
    cout << n << " ";
}

int main() {
    show(3);
    cout << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['3 2 1 1 2 3', '3 2 1', '1 2 3 3 2 1', '3 3 2 2 1 1'],
        answer: 0,
        explain: '`show(3)` prints 3, then calls `show(2)`, which prints 2 and calls `show(1)`, which prints 1 and calls `show(0)`. That call returns at once (the base case). Now the calls finish in reverse order: `show(1)` prints its second 1, then `show(2)` prints 2, then `show(3)` prints 3. First all the “in” prints, then all the “out” prints.',
      },
      { t: 'h', text: 'Adding up and counting down' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int sumTo(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sumTo(n - 1);
}

int main() {
    cout << sumTo(4) << endl;
    return 0;
}
`,
        output: '10',
      },
      { t: 'p', text: '`sumTo(4)` is `4 + sumTo(3)`, which is `4 + 3 + sumTo(2)`, and so on until `sumTo(0)` is 0. The answers travel back: 0, then 1, 3, 6 and finally 10.' },
      { t: 'h', text: 'Factorial' },
      { t: 'p', text: 'The factorial of 5, written 5!, is 5 × 4 × 3 × 2 × 1 = 120. It fits recursion perfectly: `5! = 5 × 4!`, and `0! = 1` is the base case.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}

int main() {
    cout << fact(5) << " " << fact(10) << endl;
    return 0;
}
`,
        output: '120 3628800',
      },
      { t: 'tip', text: 'Factorials grow very quickly. An `int` can only hold about 2 billion, and 13! is already more than 6 billion. In this app a number that does not fit in an `int` stops the program with an overflow error (a real computer would silently print a wrong number). Stay at 12 or below with `int`.' },
      { t: 'h', text: 'Two calls at once: Fibonacci' },
      { t: 'p', text: 'The Fibonacci numbers go 0, 1, 1, 2, 3, 5, 8, 13 ... Each one is the sum of the two before it. The function calls itself **twice**.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

int main() {
    for (int i = 0; i <= 8; i++) {
        cout << fib(i) << " ";
    }
    cout << endl;
    return 0;
}
`,
        output: '0 1 1 2 3 5 8 13 21',
      },
      { t: 'h', text: 'Recursion or a loop?' },
      { t: 'p', text: 'Everything in this lesson could also be written with a loop. Recursion shines when the problem naturally contains a smaller copy of itself. But every call uses some of the computer’s memory, so a very deep chain can run out of room (a **stack overflow**). The practice runner in this app allows only a few hundred nested calls, so keep the numbers small in your tests.' },
      {
        t: 'fill',
        prompt: 'Fill the gap with the base case: when n is zero the sum is zero.',
        template: String.raw`#include <iostream>
using namespace std;

int sumTo(int n) {
    if (n ___ 0) {
        return 0;
    }
    return n + sumTo(n - 1);
}

int main() {
    cout << sumTo(4) << endl;
    return 0;
}
`,
        blanks: [{ options: ['==', '>', '!='], answer: '==' }],
        output: '10',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int fact(int n) {
    return n * fact(n - 1);
}

int main() {
    cout << fact(4) << endl;
    return 0;
}
`,
        question: 'This program stops with an error about calls. What is missing?',
        options: ['A base case that stops the calls', 'A global variable', 'A loop', 'The type double'],
        answer: 0,
        explain: 'Without a base case nothing stops the chain: `fact(4)` calls `fact(3)`, then `fact(2)`, `fact(1)`, `fact(0)`, `fact(-1)` and on and on until the computer runs out of room. Always write the base case first.',
        fixed: String.raw`#include <iostream>
using namespace std;

int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}

int main() {
    cout << fact(4) << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: progFn(String.raw`int sumTo(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sumTo(n + 1);
}`, String.raw`    cout << sumTo(3) << endl;`),
            why: 'The recursive call goes the **wrong way**: `n + 1` moves away from the base case 0, so the calls never stop. Each call must make the problem **smaller**.',
            right: progFn(String.raw`int sumTo(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sumTo(n - 1);
}`, String.raw`    cout << sumTo(3) << endl;`),
          },
          {
            logic: true,
            wrong: progFn(String.raw`int sumTo(int n) {
    if (n == 0) {
        return 1;
    }
    return n + sumTo(n - 1);
}`, String.raw`    cout << sumTo(4) << endl;`),
            why: 'The base case returns the wrong value. The sum of nothing is 0, not 1, so every answer is one too big (11 instead of 10) and no error appears. Check the base case with the smallest inputs first.',
            right: progFn(String.raw`int sumTo(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sumTo(n - 1);
}`, String.raw`    cout << sumTo(4) << endl;`),
          },
          {
            wrong: progFn(String.raw`int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, String.raw`    cout << fact(13) << endl;`),
            why: '13! is 6,227,020,800, which does not fit in an `int` (the limit is about 2.1 billion). The app stops with an overflow error. Use smaller numbers, or `long long` for bigger answers.',
            right: progFn(String.raw`long long fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, String.raw`    cout << fact(13) << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'What is the job of the base case?', options: ['To stop the recursion by answering directly', 'To start the recursion', 'To print the result', 'To make the function faster'], answer: 0, explain: 'The base case is the situation where the function does **not** call itself. Without it the calls would never end.' },
      { t: 'quiz', question: 'In `int sumTo(int n)`, which call moves towards the base case n == 0?', options: ['sumTo(n - 1)', 'sumTo(n + 1)', 'sumTo(n)', 'sumTo(n * 2)'], answer: 0, explain: 'Each call must make the problem smaller. Subtracting 1 brings n closer to 0 every time, while the other calls move away from it or stay the same.' },
      {
        t: 'recap',
        items: [
          'Recursion: a function solves a problem by calling itself on a smaller one.',
          'Every recursive function needs a **base case** (no call) and a **recursive case** (a smaller call).',
          'Each call must move towards the base case, or the calls never stop.',
          'Factorials and Fibonacci numbers grow fast: watch the size of `int`.',
          'Very deep recursion runs out of room. The app allows only a few hundred nested calls.',
        ],
        memory: 'Base case first, then shrink.',
      },
    ],
    exercises: [
      {
        id: 'cpp12-factorial',
        title: 'Factorial',
        prompt: 'Write a **recursive** function `int fact(int n)`. Read a number from 0 to 12 and print its factorial like this: `Factorial: 120` (for 5). Remember that 0! is 1.',
        starter: progFn(String.raw`// Write the recursive function fact here, above main
`, String.raw`    // Read n, print Factorial: ...`),
        tests: [
          { input: '5', expected: 'Factorial: 120' },
          { input: '0', expected: 'Factorial: 1' },
          { input: '1', expected: 'Factorial: 1', hidden: true },
          { input: '10', expected: 'Factorial: 3628800', hidden: true },
          { input: '12', expected: 'Factorial: 479001600', hidden: true },
        ],
        hints: [
          'The base case: when `n` is 0 or 1, return 1.',
          'The recursive case: return `n * fact(n - 1)`.',
          'A similar example is `sumTo` in this lesson: it returned `n + sumTo(n - 1)`. Here you multiply instead of add.',
        ],
      },
      {
        id: 'cpp12-fib',
        title: 'Fibonacci',
        prompt: 'Write a **recursive** function `int fib(int n)`. Read n (from 0 to 20) and print the n-th Fibonacci number like this: `Fib: 55` (for 10). The sequence starts 0, 1, 1, 2, 3, 5, 8 ...',
        starter: progFn(String.raw`// Write the recursive function fib here, above main
`, String.raw`    // Read n, print Fib: ...`),
        tests: [
          { input: '10', expected: 'Fib: 55' },
          { input: '6', expected: 'Fib: 8' },
          { input: '0', expected: 'Fib: 0', hidden: true },
          { input: '1', expected: 'Fib: 1', hidden: true },
          { input: '20', expected: 'Fib: 6765', hidden: true },
        ],
        hints: [
          'The base case: when `n` is 0 or 1, the answer is `n` itself.',
          'The recursive case: add the two numbers before: `fib(n - 1) + fib(n - 2)`.',
          'The lesson’s Fibonacci example prints the first nine numbers. Here you read n and print only one of them.',
        ],
      },
      {
        id: 'cpp12-gcd',
        title: 'The greatest common divisor',
        prompt: 'The **greatest common divisor** (GCD) of two numbers is the biggest number that divides both. Euclid found a recursive rule: `gcd(a, b)` is `a` when `b` is 0, and otherwise it is `gcd(b, a % b)`. Write `int gcd(int a, int b)` recursively. Read two numbers and print: `GCD: 6` (for 48 and 18).',
        starter: progFn(String.raw`// Write the recursive function gcd here, above main
`, String.raw`    // Read a and b, print GCD: ...`),
        tests: [
          { input: '48 18', expected: 'GCD: 6' },
          { input: '17 5', expected: 'GCD: 1' },
          { input: '100 75', expected: 'GCD: 25', hidden: true },
          { input: '7 0', expected: 'GCD: 7', hidden: true },
        ],
        hints: [
          'The base case: `if (b == 0) { return a; }`.',
          'The recursive case: `return gcd(b, a % b);`. The second number gets smaller every time, so the calls end.',
          'Trace 48 and 18: `gcd(48, 18)`, then `gcd(18, 12)`, then `gcd(12, 6)`, then `gcd(6, 0)` which returns 6.',
        ],
      },
    ],
  },
];
