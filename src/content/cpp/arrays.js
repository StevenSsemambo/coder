// C++, Level 4: Arrays and text. Lessons 14 to 16 (arrays, array algorithms, 2D arrays).
import { prog, progFn, IO_FMT } from './shared.js';

const LEVEL = 'Level 4: Arrays and text';

export const arrayLessons = [
  // ================================================================== 14
  {
    id: 'cpp-arrays',
    level: LEVEL,
    minutes: 26,
    title: 'Arrays: many values, one name',
    summary: 'Declaring, filling, reading and looping over arrays, and staying inside the boundaries',
    blocks: [
      {
        t: 'story',
        title: 'A week of takings',
        text: 'At the end of every day Mama Rose writes down how much money the stand made. After five days she has five numbers. To work out the total she would need five variables: `day1`, `day2`, `day3`, `day4`, `day5`. And for a whole month? Thirty variables with thirty names, and thirty lines to add them up.\n\nThere is a better way. She takes **one long strip of paper** with numbered boxes and writes one day’s takings in each box. One strip, one name, many boxes. In C++ that strip is called an **array**.',
      },
      { t: 'p', text: 'An array is a row of variables of the **same type**, stored side by side under **one name**. Each box is reached by its number, called its **index**. Press **Run** to read some boxes.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int sales[5] = {12000, 8500, 15000, 9000, 11000};
    cout << "First day: " << sales[0] << endl;
    cout << "Third day: " << sales[2] << endl;
    cout << "Last day: " << sales[4] << endl;
    return 0;
}
`,
        output: 'First day: 12000\nThird day: 15000\nLast day: 11000',
      },
      { t: 'analogy', text: 'In Kampala’s shopping arcades the entrance level is called the **ground floor**, the next one up is the first floor. Counting starts at **zero**. Array boxes are numbered the same way: the first box is number **0**, the second is number 1, and an array of 5 boxes ends at number **4**.' },
      {
        t: 'list',
        items: [
          '`int sales[5]` makes 5 `int` boxes under the name `sales`. The number in the square brackets is the **size**.',
          '`{12000, 8500, ...}` fills the boxes in order when you create the array.',
          '`sales[2]` is the box with index 2, which is the **third** box. Use it like any variable: read it, print it, or assign to it.',
          'The valid indexes are `0` up to `size - 1`. There is no `sales[5]` in an array of size 5.',
        ],
      },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[4] = {10, 20, 30, 40};
    a[1] = a[3] - a[0];
    cout << a[1] << " " << a[0] + a[2] << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['30 40', '20 40', '30 60', '10 30'],
        answer: 0,
        explain: '`a[3] - a[0]` is 40 - 10 = 30, and that is stored in box 1, replacing the 20. Then the program prints `a[1]` (now 30) and `a[0] + a[2]` (10 + 30 = 40).',
      },
      { t: 'h', text: 'Arrays and loops belong together' },
      { t: 'p', text: 'The real power of an array is that the index can be a **variable**. A `for` loop can then visit every box with a few lines, whether there are 5 boxes or 5,000. Keep the size in a `const` so that it is written in one place only.' },
      {
        t: 'try',
        stdin: '12000 8500 15000 9000 11000',
        code: String.raw`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    const int N = 5;
    int sales[N];
    int total = 0;
    for (int i = 0; i < N; i++) {
        cin >> sales[i];
        total += sales[i];
    }
    cout << fixed << setprecision(2);
    cout << "Total: " << total << endl;
    cout << "Average: " << (double)total / N << endl;
    return 0;
}
`,
        output: 'Total: 55500\nAverage: 11100.00',
      },
      { t: 'tip', text: 'The loop runs `i` from **0** while `i < N`. That visits boxes 0, 1, 2, 3 and 4, exactly N boxes. Writing `i < N` (not `i <= N`) is the standard way to loop over an array.' },
      { t: 'h', text: 'Boxes you did not fill' },
      { t: 'p', text: 'If you give fewer values than the size, the remaining boxes are set to **0**. So `{0}` is a quick way to start every box at zero. (An array created with **no** braces at all contains junk, so always give it a starting value or fill it before you read it.)' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int stock[5] = {7, 3};
    for (int i = 0; i < 5; i++) {
        cout << stock[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
        output: '7 3 0 0 0',
      },
      { t: 'h', text: 'Staying inside the boundaries' },
      { t: 'p', text: 'Asking for a box that does not exist, such as `sales[5]` in an array of size 5, is one of the most common bugs in programming. The practice runner in this app **stops with a message** so you can find the mistake. A real C++ program does **not** stop: it reads or writes some other part of the computer’s memory, and the result can be wrong answers, crashes, or even security holes. So make the boundaries a habit.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so that the loop prints all five numbers and no more.',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[5] = {2, 4, 6, 8, 10};
    for (int i = 0; i ___ 5; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
        blanks: [{ options: ['<', '<=', '>'], answer: '<' }],
        output: '2 4 6 8 10',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[3] = {5, 6, 7};
    for (int i = 0; i <= 3; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
        question: 'This program stops with an error. Why?',
        options: ['The loop goes to index 3, but an array of size 3 only has indexes 0, 1 and 2', 'a must be declared as a double', 'cout cannot print array elements', 'The loop should count down'],
        answer: 0,
        explain: 'With `i <= 3` the loop also visits `a[3]`, a box that does not exist. The valid indexes are 0 to size - 1. Use `i < 3`.',
        fixed: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[3] = {5, 6, 7};
    for (int i = 0; i < 3; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int a[3] = 1, 2, 3;
    cout << a[0] << endl;`),
            why: 'The starting values of an array must be inside **curly brackets**: `{1, 2, 3}`.',
            right: prog(String.raw`    int a[3] = {1, 2, 3};
    cout << a[0] << endl;`),
          },
          {
            wrong: prog(String.raw`    int a[3] = {1, 2, 3};
    a[3] = 9;
    cout << a[0] << endl;`),
            why: 'The last box of an array of size 3 is `a[2]`. Writing to `a[3]` goes outside the array. The app stops it, but a real program would silently overwrite something else.',
            right: prog(String.raw`    int a[3] = {1, 2, 3};
    a[2] = 9;
    cout << a[0] << endl;`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[4] = {1, 2, 3, 4};
    int total = 0;
    for (int i = 0; i < 4; i++) {
        total += a[i];
    }
    cout << "Average: " << total / 4 << endl;`),
            why: 'The total is 10, and `10 / 4` between two whole numbers is 2, not 2.5. No error appears. Divide by `4.0` or cast: `(double)total / 4`.',
            right: prog(String.raw`    int a[4] = {1, 2, 3, 4};
    int total = 0;
    for (int i = 0; i < 4; i++) {
        total += a[i];
    }
    cout << "Average: " << (double)total / 4 << endl;`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[3] = {5, 6, 7};
    cout << "First: " << a[1] << endl;`),
            why: 'Counting starts at 0, so the **first** value is `a[0]`. `a[1]` is the second one (6). No error appears, which makes this mistake hard to spot.',
            right: prog(String.raw`    int a[3] = {5, 6, 7};
    cout << "First: " << a[0] << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'What is the index of the LAST box in `int days[7]`?', options: ['6', '7', '8', '1'], answer: 0, explain: 'Seven boxes are numbered 0 to 6. The last index is always the size minus one.' },
      { t: 'quiz', question: 'What does `int a[5] = {1, 2};` put in `a[4]`?', options: ['0', '2', 'Junk', 'An error'], answer: 0, explain: 'Boxes without a starting value are set to 0 when you give a (shorter) list in curly brackets.' },
      {
        t: 'recap',
        items: [
          'An array holds many values of one type under one name: `int sales[5];`.',
          'Boxes are numbered from **0**. Valid indexes are 0 to size - 1.',
          '`{1, 2, 3}` gives starting values. Missing ones become 0.',
          'Loop with `for (int i = 0; i < N; i++)`, and keep the size in a `const`.',
          'Going outside the array is a bug. The app stops you, a real program does not.',
        ],
        memory: 'Start at zero, stop before the size.',
      },
    ],
    exercises: [
      {
        id: 'cpp14-total',
        title: 'The week’s takings',
        prompt: 'Read **5** daily sales into an array. Print the total and the average with two decimals, like this:\n\n`Total: 55500`\n`Average: 11100.00`',
        starter: prog('    // Read 5 sales into an array, print Total: and Average:\n', IO_FMT),
        tests: [
          { input: '12000 8500 15000 9000 11000', expected: 'Total: 55500\nAverage: 11100.00' },
          { input: '1 2 2 3 4', expected: 'Total: 12\nAverage: 2.40' },
          { input: '0 0 0 0 0', expected: 'Total: 0\nAverage: 0.00', hidden: true },
          { input: '1 1 1 1 2', expected: 'Total: 6\nAverage: 1.20', hidden: true },
        ],
        hints: [
          'Make an array of 5 boxes, and a loop `for (int i = 0; i < 5; i++)` that reads `cin >> sales[i];` and adds it to `total`.',
          'The average needs decimals: `(double)total / 5`. Print with `cout << fixed << setprecision(2);`.',
          'A similar example: `int a[3]; for (int i = 0; i < 3; i++) { cin >> a[i]; }` reads three numbers into the array.',
        ],
      },
      {
        id: 'cpp14-reverse',
        title: 'Backwards',
        prompt: 'Read a number **n** (at most 10), then **n** numbers. Print the numbers in **reverse order** on one line, separated by spaces. For `3` then `2 5 9` print: `9 5 2`',
        starter: prog('    // Read n, then n numbers into an array, print them in reverse\n'),
        tests: [
          { input: '3 2 5 9', expected: '9 5 2' },
          { input: '1 7', expected: '7' },
          { input: '5 1 2 3 4 5', expected: '5 4 3 2 1', hidden: true },
          { input: '4 -1 0 8 3', expected: '3 8 0 -1', hidden: true },
        ],
        hints: [
          'Make the array big enough for the largest case, `int a[10];`, and read only n values into the first n boxes.',
          'To print backwards, start the loop at the last index: `for (int i = n - 1; i >= 0; i--)`.',
          'A similar example: `for (int i = 4; i >= 0; i--) { cout << a[i] << " "; }` prints a 5-box array from the end.',
        ],
      },
      {
        id: 'cpp14-above',
        title: 'Above average',
        prompt: 'Read **5** numbers. Print how many of them are **strictly greater than the average** of the five, like this: `Above average: 2`.',
        starter: prog('    // Read 5 numbers, count how many are above the average\n'),
        tests: [
          { input: '10 20 30 40 50', expected: 'Above average: 2' },
          { input: '5 5 5 5 5', expected: 'Above average: 0' },
          { input: '1 2 3 4 100', expected: 'Above average: 1', hidden: true },
          { input: '9 1 1 1 1', expected: 'Above average: 1', hidden: true },
        ],
        hints: [
          'You must go through the numbers **twice**: first to read them and find the total, then again to compare each with the average. That is why you need an array.',
          'The average is `total / 5.0`. After you know it, loop again and add 1 to a counter whenever `a[i] > average`.',
          'The total of `10 20 30 40 50` is 150 and the average is 30. Only 40 and 50 are above it, so the answer is 2.',
        ],
      },
    ],
  },

  // ================================================================== 15
  {
    id: 'cpp-array-algos',
    level: LEVEL,
    minutes: 28,
    title: 'Arrays and functions: finding, searching, sorting',
    summary: 'Passing arrays to functions, finding the biggest and smallest, searching, reversing and bubble sort',
    blocks: [
      {
        t: 'story',
        title: 'Which day was the best?',
        text: 'On Sunday evening Mama Rose looks at the week’s takings and asks four questions. **Which day was the best? Which was the worst? Did I ever earn exactly 15,000? Can I list the days from the lowest to the highest?**\n\nEvery one of those questions is answered by walking along the array in a particular way. They are the classic array algorithms, and almost every program that handles lists uses them.',
      },
      { t: 'h', text: 'Giving an array to a function' },
      { t: 'p', text: 'To pass an array, write `int a[]` (empty square brackets) in the parameter list and give just the **name** in the call. A function does **not** know how long the array is, so also pass the size as a second parameter.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int maxOf(int a[], int n) {
    int best = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}

int main() {
    int sales[5] = {12000, 8500, 15000, 9000, 11000};
    cout << "Best day: " << maxOf(sales, 5) << endl;
    return 0;
}
`,
        output: 'Best day: 15000',
      },
      { t: 'p', text: 'Look at how `maxOf` finds the biggest value. It starts by assuming the **first** box is the best. Then it visits the other boxes and replaces `best` every time it meets a bigger value. To find the smallest, change `>` to `<`.' },
      { t: 'tip', text: 'Start with `a[0]`, not with 0. If all numbers were negative, a starting value of 0 would never be beaten and you would wrongly report 0 as the biggest.' },
      { t: 'h', text: 'Arrays are not copied' },
      { t: 'p', text: 'In lesson 11 you learned that a function gets a **copy** of a number. An array is different: the function works on the **real array**, so changes made inside the function are still there when it ends. (That is also why it is cheap: a big array is not duplicated.)' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

void zeroFirst(int a[]) {
    a[0] = 99;
}

int main() {
    int a[3] = {1, 2, 3};
    zeroFirst(a);
    cout << a[0] << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['99', '1', '0', 'It stops with an error'],
        answer: 0,
        explain: 'The function received the array itself, not a copy. So `a[0] = 99;` changed the original, and `main` prints 99. (A plain `int` parameter would have stayed unchanged.)',
      },
      { t: 'h', text: 'Linear search' },
      { t: 'p', text: 'To find out whether a value is in an array, check the boxes one after another. A common convention is to return the **index** where you found it, and **-1** (an index that can never exist) when it is not there.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int indexOf(int a[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (a[i] == target) {
            return i;
        }
    }
    return -1;
}

int main() {
    int sales[5] = {12000, 8500, 15000, 9000, 11000};
    cout << indexOf(sales, 5, 15000) << endl;
    cout << indexOf(sales, 5, 7000) << endl;
    return 0;
}
`,
        output: '2\n-1',
      },
      { t: 'tip', text: 'The `return -1;` goes **after** the loop. If you put it inside the loop, the function gives up after the very first box that does not match. This is in the mistake museum below.' },
      {
        t: 'fill',
        prompt: 'Fill the gap so the search finds the number 7. It sits at index 3.',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[5] = {4, 9, 2, 7, 5};
    for (int i = 0; i < 5; i++) {
        if (a[i] ___ 7) {
            cout << i << endl;
            break;
        }
    }
    return 0;
}
`,
        blanks: [{ options: ['==', '=', '!='], answer: '==' }],
        output: '3',
      },
      { t: 'h', text: 'Reversing in place' },
      { t: 'p', text: 'To reverse an array, swap the first box with the last, the second with the second-last, and so on, until the two ends meet in the middle. Swapping needs a third, temporary variable.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    for (int i = 0, j = 4; i < j; i++, j--) {
        int temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    for (int i = 0; i < 5; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
        output: '5 4 3 2 1',
      },
      { t: 'h', text: 'Bubble sort' },
      { t: 'analogy', text: 'Imagine a row of people and you want them in order of height. You walk along the row and, for every neighbouring pair, if the left person is taller you swap them. After one walk, the **tallest** person has “bubbled” to the end of the row. Repeat the walk (ignoring the people already at the end) and the next tallest settles, and so on.' },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a[5] = {5, 1, 4, 2, 3};
    for (int i = 0; i < 4; i++) {
        if (a[i] > a[i + 1]) {
            int temp = a[i];
            a[i] = a[i + 1];
            a[i + 1] = temp;
        }
    }
    for (int i = 0; i < 5; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
        question: 'This is ONE walk along the row. What does it print?',
        options: ['1 4 2 3 5', '1 2 3 4 5', '5 1 4 2 3', '1 5 4 2 3'],
        answer: 0,
        explain: 'The 5 is compared with 1 and swaps, then with 4 and swaps, then with 2 and swaps, then with 3 and swaps. The 5 travelled all the way to the end. The rest moved one place left. One walk is not enough to sort everything, which is why we repeat it.',
      },
      { t: 'p', text: 'Wrap that walk in an outer loop that repeats it, and make each walk one box shorter (the end is already settled). Here the sort is a function, and since arrays are not copied, the original array ends up sorted.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

void bubbleSort(int a[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        for (int i = 0; i < n - 1 - pass; i++) {
            if (a[i] > a[i + 1]) {
                int temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
            }
        }
    }
}

int main() {
    int sales[5] = {12000, 8500, 15000, 9000, 11000};
    bubbleSort(sales, 5);
    for (int i = 0; i < 5; i++) {
        cout << sales[i] << " ";
    }
    cout << endl;
    return 0;
}
`,
        output: '8500 9000 11000 12000 15000',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int maxOf(int a[]) {
    int best = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}

int main() {
    int a[3] = {4, 9, 2};
    cout << maxOf(a) << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['The function uses n, but an array does not carry its size, so n was never passed in', 'maxOf must return void', 'The array must be global', 'best must be a double'],
        answer: 0,
        explain: 'A function cannot ask an array how long it is. The size must be passed as a **second parameter**: `int maxOf(int a[], int n)`, and called as `maxOf(a, 3)`.',
        fixed: String.raw`#include <iostream>
using namespace std;

int maxOf(int a[], int n) {
    int best = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}

int main() {
    int a[3] = {4, 9, 2};
    cout << maxOf(a, 3) << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: progFn(String.raw`int maxOf(int a[], int n) {
    int best = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}`, String.raw`    int a[3] = {-5, -2, -9};
    cout << maxOf(a, 3) << endl;`),
            why: '`best` starts at 0, and none of the negative numbers beats 0, so the function reports 0, a value that is not even in the array. Start with `a[0]`.',
            right: progFn(String.raw`int maxOf(int a[], int n) {
    int best = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}`, String.raw`    int a[3] = {-5, -2, -9};
    cout << maxOf(a, 3) << endl;`),
          },
          {
            logic: true,
            wrong: progFn(String.raw`int indexOf(int a[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (a[i] == target) {
            return i;
        } else {
            return -1;
        }
    }
    return -1;
}`, String.raw`    int a[4] = {4, 9, 2, 7};
    cout << indexOf(a, 4, 7) << endl;`),
            why: 'The `else` returns -1 as soon as the **first** box does not match, so the search gives up after one look. It reports -1 even though 7 is at index 3. Only return -1 after the whole loop.',
            right: progFn(String.raw`int indexOf(int a[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (a[i] == target) {
            return i;
        }
    }
    return -1;
}`, String.raw`    int a[4] = {4, 9, 2, 7};
    cout << indexOf(a, 4, 7) << endl;`),
          },
          {
            wrong: prog(String.raw`    int a[3] = {3, 1, 2};
    for (int i = 0; i < 3; i++) {
        if (a[i] > a[i + 1]) {
            int temp = a[i];
            a[i] = a[i + 1];
            a[i + 1] = temp;
        }
    }`),
            why: 'When `i` is 2, `a[i + 1]` is `a[3]`, a box that does not exist. When you compare a neighbour, the loop must stop one step **earlier**: `i < 2`, or `i < n - 1`.',
            right: prog(String.raw`    int a[3] = {3, 1, 2};
    for (int i = 0; i < 2; i++) {
        if (a[i] > a[i + 1]) {
            int temp = a[i];
            a[i] = a[i + 1];
            a[i + 1] = temp;
        }
    }`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int a[2] = {1, 2};
    a[0] = a[1];
    a[1] = a[0];
    cout << a[0] << " " << a[1] << endl;`),
            why: 'This was meant to swap the two values, but the first line destroys the old `a[0]` before it is saved, so both boxes end up as 2. A swap always needs a temporary variable: `int temp = a[0]; a[0] = a[1]; a[1] = temp;`.',
            right: prog(String.raw`    int a[2] = {1, 2};
    int temp = a[0];
    a[0] = a[1];
    a[1] = temp;
    cout << a[0] << " " << a[1] << endl;`),
          },
        ],
      },
      { t: 'quiz', question: 'A search function returns -1. What does that mean?', options: ['The value was not found', 'The value was found at the end', 'The array is empty', 'The index is negative zero'], answer: 0, explain: 'No array has an index -1, so -1 is a safe way to say “not found”. It is a convention that many programs share.' },
      { t: 'quiz', question: 'Why must you pass the size of an array to a function?', options: ['The function cannot find out the array’s length by itself', 'To make the array bigger', 'Because arrays are copied', 'Because the size is always 10'], answer: 0, explain: 'Only the beginning of the array is handed over. The function has no way of knowing where it ends, so you tell it.' },
      {
        t: 'recap',
        items: [
          'Pass an array with `int a[]` and the name, and pass the **size** separately. The function works on the real array.',
          'Biggest or smallest: start with `a[0]`, compare the rest, and keep the best.',
          'Linear search: return the index when found, and `-1` **after** the loop when not found.',
          'Reverse by swapping from both ends. A swap needs a temporary variable.',
          'Bubble sort: repeat walks that swap neighbours that are out of order. Each walk is one box shorter.',
        ],
        memory: 'Pass the array and its size.',
      },
    ],
    exercises: [
      {
        id: 'cpp15-maxmin',
        title: 'Best and worst day',
        prompt: 'Read **n** (at most 10) and then **n** sales. Print the biggest, the smallest and the **position** (counting from 1) of the biggest. If the biggest appears more than once, give the first position. For example, for `5` then `4 9 2 7 5`:\n\n`Max: 9`\n`Min: 2`\n`Best position: 2`',
        starter: prog('    // Read n, then n numbers. Print Max, Min and Best position\n'),
        tests: [
          { input: '5 4 9 2 7 5', expected: 'Max: 9\nMin: 2\nBest position: 2' },
          { input: '1 7', expected: 'Max: 7\nMin: 7\nBest position: 1' },
          { input: '4 -5 -2 -9 -2', expected: 'Max: -2\nMin: -9\nBest position: 2', hidden: true },
          { input: '3 8 8 1', expected: 'Max: 8\nMin: 1\nBest position: 1', hidden: true },
        ],
        hints: [
          'Start with `max = a[0]`, `min = a[0]` and `pos = 0`. Then loop from index 1.',
          'When `a[i] > max`, update `max` **and** `pos = i;`. Use `>` (not `>=`) so that the first position is kept. When `a[i] < min`, update `min`.',
          'Print `pos + 1`, because the position counts from 1 while indexes count from 0.',
        ],
      },
      {
        id: 'cpp15-search',
        title: 'Look it up',
        prompt: 'Read **n** (at most 10), then **n** numbers, then a **target**. Print where the target is, counting positions from 1, or say it is missing:\n\n`Found at position 4`\n`Not found`\n\nIf the target appears several times, print the first position.',
        starter: prog('    // Read n, n numbers and the target. Search for it\n'),
        tests: [
          { input: '5 4 9 2 7 5 7', expected: 'Found at position 4' },
          { input: '3 1 2 3 9', expected: 'Not found' },
          { input: '4 6 6 6 6 6', expected: 'Found at position 1', hidden: true },
          { input: '1 5 5', expected: 'Found at position 1', hidden: true },
          { input: '4 1 2 3 4 4', expected: 'Found at position 4', hidden: true },
        ],
        hints: [
          'Read the n numbers into an array first, then read the target into a separate variable.',
          'Loop through the boxes. When `a[i] == target`, print `i + 1` and stop (`break` or `return`).',
          'Use a variable such as `found = false` before the loop. If it is still false after the loop, print `Not found`.',
        ],
      },
      {
        id: 'cpp15-sort',
        title: 'Lowest to highest',
        prompt: 'Read **n** (at most 10) and then **n** numbers. Print them **sorted from the smallest to the biggest**, separated by spaces. For `5` then `5 1 4 2 3` print: `1 2 3 4 5`',
        starter: prog('    // Read n and the numbers. Sort them (bubble sort) and print\n'),
        tests: [
          { input: '5 5 1 4 2 3', expected: '1 2 3 4 5' },
          { input: '3 9 9 1', expected: '1 9 9' },
          { input: '1 7', expected: '7', hidden: true },
          { input: '6 -1 0 -5 3 2 2', expected: '-5 -1 0 2 2 3', hidden: true },
        ],
        hints: [
          'Use two loops: an outer loop for the passes and an inner loop that compares each neighbouring pair.',
          'Inside the inner loop: `if (a[i] > a[i + 1])` swap them with a temporary variable. The inner loop should stop at `i < n - 1`.',
          'Write the sort as a function `void bubbleSort(int a[], int n)` like in the lesson, or put it straight into `main`.',
        ],
      },
    ],
  },

  // ================================================================== 16
  {
    id: 'cpp-2d',
    level: LEVEL,
    minutes: 26,
    title: 'Tables: two-dimensional arrays',
    summary: 'Rows and columns, nested loops over a table, row and column totals, and tables in functions',
    blocks: [
      {
        t: 'story',
        title: 'Three stalls, four days',
        text: 'Mama Rose’s two cousins have opened stalls too, so now there are **three stalls**, and she records the sales of **four days** for each. One long strip of boxes is not a good fit any more. She needs a **table**: a row for each stall and a column for each day.\n\nA table in C++ is a **two-dimensional array**: an array whose boxes are themselves arrays. You pick a cell with **two** numbers: the row first, then the column.',
      },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int sales[3][4] = {
        {12, 8, 15, 9},
        {7, 10, 6, 14},
        {11, 13, 5, 16}
    };
    cout << "Stall 1, day 1: " << sales[0][0] << endl;
    cout << "Stall 2, day 3: " << sales[1][2] << endl;
    cout << "Stall 3, day 4: " << sales[2][3] << endl;
    return 0;
}
`,
        output: 'Stall 1, day 1: 12\nStall 2, day 3: 6\nStall 3, day 4: 16',
      },
      {
        t: 'list',
        items: [
          '`int sales[3][4]` is a table with **3 rows** and **4 columns**: the first number is the rows, the second the columns.',
          'The inner curly brackets `{12, 8, 15, 9}` fill one **row** each.',
          '`sales[1][2]` means row index 1 (the second row), column index 2 (the third column). **Row first, column second.** Both start at 0.',
        ],
      },
      {
        t: 'predict',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
    cout << g[1][2] << " " << g[0][1] << endl;
    return 0;
}
`,
        question: 'What does this program print?',
        options: ['6 2', '3 5', '5 3', '6 5'],
        answer: 0,
        explain: '`g[1][2]` is row 1 (the second row, `{4, 5, 6}`) and column 2 (the third value): 6. `g[0][1]` is row 0 (`{1, 2, 3}`), column 1: 2.',
      },
      { t: 'h', text: 'Two loops for two dimensions' },
      { t: 'p', text: 'To visit every cell you need a **nested loop** (lesson 8): the outer loop walks the rows and the inner loop walks the columns of that row. Here the cells are read from the keyboard and printed back as a neat table with `setw`.' },
      {
        t: 'try',
        stdin: '12 8 15 9 7 10 6 14',
        code: String.raw`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int t[2][4];
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 4; c++) {
            cin >> t[r][c];
        }
    }
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 4; c++) {
            cout << setw(4) << t[r][c];
        }
        cout << endl;
    }
    return 0;
}
`,
        output: '  12   8  15   9\n   7  10   6  14',
      },
      { t: 'h', text: 'Row totals and column totals' },
      { t: 'p', text: 'A **row total** adds the cells of one row: the inner loop adds, and the total is reset to 0 **at the start of every row**. A **column total** is the same idea with the loops the other way round: the outer loop picks the column.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int sales[3][4] = {{12, 8, 15, 9}, {7, 10, 6, 14}, {11, 13, 5, 16}};
    for (int r = 0; r < 3; r++) {
        int total = 0;
        for (int c = 0; c < 4; c++) {
            total += sales[r][c];
        }
        cout << "Stall " << r + 1 << ": " << total << endl;
    }
    for (int c = 0; c < 4; c++) {
        int total = 0;
        for (int r = 0; r < 3; r++) {
            total += sales[r][c];
        }
        cout << "Day " << c + 1 << ": " << total << endl;
    }
    return 0;
}
`,
        output: 'Stall 1: 44\nStall 2: 37\nStall 3: 45\nDay 1: 30\nDay 2: 31\nDay 3: 26\nDay 4: 39',
      },
      { t: 'h', text: 'Tables in functions' },
      { t: 'p', text: 'When a function receives a table, it must be told the **number of columns** in the parameter: `int t[][4]`. The row count can be left empty, but pass it as a separate parameter like the size of a one-dimensional array. Just like 1D arrays, a table is **not copied**.' },
      {
        t: 'try',
        code: String.raw`#include <iostream>
using namespace std;

int grandTotal(int t[][4], int rows) {
    int total = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < 4; c++) {
            total += t[r][c];
        }
    }
    return total;
}

int main() {
    int sales[3][4] = {{12, 8, 15, 9}, {7, 10, 6, 14}, {11, 13, 5, 16}};
    cout << "All stalls: " << grandTotal(sales, 3) << endl;
    return 0;
}
`,
        output: 'All stalls: 126',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so the program prints the cell in the second row and third column (the number 6).',
        template: String.raw`#include <iostream>
using namespace std;

int main() {
    int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
    cout << g[___][2] << endl;
    return 0;
}
`,
        blanks: [{ options: ['1', '2', '0'], answer: '1' }],
        output: '6',
      },
      {
        t: 'bug',
        code: String.raw`#include <iostream>
using namespace std;

int total(int t[][]) {
    return t[0][0] + t[1][1];
}

int main() {
    int g[2][2] = {{1, 2}, {3, 4}};
    cout << total(g) << endl;
    return 0;
}
`,
        question: 'This program refuses to run. What is wrong?',
        options: ['A table parameter must state its number of columns: int t[][2]', 'The function must return void', 'g must be declared as a one-dimensional array', 'The table needs three rows'],
        answer: 0,
        explain: 'To find cell `t[r][c]` the computer must know how long each row is, that is, the number of columns. Only the first (row) size may be left empty: `int t[][2]`.',
        fixed: String.raw`#include <iostream>
using namespace std;

int total(int t[][2]) {
    return t[0][0] + t[1][1];
}

int main() {
    int g[2][2] = {{1, 2}, {3, 4}};
    cout << total(g) << endl;
    return 0;
}
`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: prog(String.raw`    int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
    cout << g[2][0] << endl;`),
            why: 'A table with 2 rows has rows 0 and 1. `g[2][0]` asks for a third row that does not exist. The row index goes first and must be less than the number of **rows**.',
            right: prog(String.raw`    int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
    cout << g[1][0] << endl;`),
          },
          {
            wrong: prog(String.raw`    int g[2][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    cout << g[0][0] << endl;`),
            why: 'The table was declared with 2 rows but three rows of values were given. The number of rows in the braces must not be more than the declared size.',
            right: prog(String.raw`    int g[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    cout << g[0][0] << endl;`),
          },
          {
            logic: true,
            wrong: prog(String.raw`    int g[2][2] = {{1, 2}, {3, 4}};
    int total = 0;
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 2; c++) {
            total += g[r][c];
        }
        cout << "Row " << r + 1 << ": " << total << endl;
    }`),
            why: '`total` is created **before** the row loop, so it keeps growing from row to row. The second row prints 10 (the running total), not 7. Put `int total = 0;` inside the outer loop, so each row starts again from zero.',
            right: prog(String.raw`    int g[2][2] = {{1, 2}, {3, 4}};
    for (int r = 0; r < 2; r++) {
        int total = 0;
        for (int c = 0; c < 2; c++) {
            total += g[r][c];
        }
        cout << "Row " << r + 1 << ": " << total << endl;
    }`),
          },
        ],
      },
      { t: 'quiz', question: 'In `int t[3][5]`, how many cells are there in total?', options: ['15', '8', '35', '3'], answer: 0, explain: 'Three rows of five cells each: 3 × 5 = 15.' },
      { t: 'quiz', question: 'Which expression is the cell in the first row and the last column of `int t[3][5]`?', options: ['t[0][4]', 't[1][5]', 't[4][0]', 't[0][5]'], answer: 0, explain: 'Row first, column second, both counted from 0. The first row is index 0 and the last of five columns is index 4.' },
      {
        t: 'recap',
        items: [
          'A table is a two-dimensional array: `int t[rows][columns];`.',
          'A cell is `t[row][column]`, row first. Both indexes start at 0.',
          'Visit every cell with a nested loop: the outer loop for rows, the inner loop for columns.',
          'For a row total, reset the total to 0 at the start of **each** row.',
          'A function receiving a table must state the number of columns: `int t[][4]`.',
        ],
        memory: 'Row first, column second.',
      },
    ],
    exercises: [
      {
        id: 'cpp16-stalls',
        title: 'Stall totals',
        prompt: 'Read the sales of **3 stalls** over **4 days**: 12 numbers, stall by stall. Print each stall’s total and then the grand total:\n\n`Stall 1: 10`\n`Stall 2: 26`\n`Stall 3: 42`\n`All stalls: 78`\n\n(for the numbers 1 to 12)',
        starter: prog('    // Read a 3 by 4 table, print the row totals and the grand total\n'),
        tests: [
          { input: '1 2 3 4 5 6 7 8 9 10 11 12', expected: 'Stall 1: 10\nStall 2: 26\nStall 3: 42\nAll stalls: 78' },
          { input: '5 5 5 5 1 1 1 1 2 2 2 2', expected: 'Stall 1: 20\nStall 2: 4\nStall 3: 8\nAll stalls: 32' },
          { input: '0 0 0 0 0 0 0 0 0 0 0 0', expected: 'Stall 1: 0\nStall 2: 0\nStall 3: 0\nAll stalls: 0', hidden: true },
        ],
        hints: [
          'Use `int t[3][4];` and a nested loop to read the cells: the outer loop is the stall, the inner loop is the day.',
          'To total a row, put `int total = 0;` inside the outer loop (so it restarts for each stall), add the cells in the inner loop, then print it. Also add it to a grand total.',
          'Print the stall number as `r + 1` because the rows are counted from 0.',
        ],
      },
      {
        id: 'cpp16-diagonal',
        title: 'The diagonal',
        prompt: 'Read a **3 by 3** table (9 numbers). Print the sum of the **main diagonal**: the cells from the top-left to the bottom-right. For the numbers 1 to 9 print: `Diagonal: 15` (because 1 + 5 + 9).',
        starter: prog('    // Read a 3 by 3 table, print the sum of the diagonal\n'),
        tests: [
          { input: '1 2 3 4 5 6 7 8 9', expected: 'Diagonal: 15' },
          { input: '2 0 0 0 3 0 0 0 4', expected: 'Diagonal: 9' },
          { input: '9 9 9 9 9 9 9 9 9', expected: 'Diagonal: 27', hidden: true },
          { input: '1 0 0 0 0 0 0 0 1', expected: 'Diagonal: 2', hidden: true },
        ],
        hints: [
          'The diagonal cells are the ones where the row index equals the column index: `t[0][0]`, `t[1][1]`, `t[2][2]`.',
          'You can read the table with a nested loop, and then add the diagonal with a **single** loop: `total += t[i][i];`.',
          'A similar example: `for (int i = 0; i < 3; i++) { total += t[i][2 - i]; }` adds the other diagonal.',
        ],
      },
      {
        id: 'cpp16-transpose',
        title: 'Turn the table around',
        prompt: 'Read a table with **2 rows and 3 columns** (6 numbers). Print its **transpose**: the rows become columns, so you print **3 lines of 2 numbers**, separated by a space. For `1 2 3` and `4 5 6` print:\n\n`1 4`\n`2 5`\n`3 6`',
        starter: prog('    // Read a 2 by 3 table, print it turned around (3 lines)\n'),
        tests: [
          { input: '1 2 3 4 5 6', expected: '1 4\n2 5\n3 6' },
          { input: '9 8 7 6 5 4', expected: '9 6\n8 5\n7 4', hidden: true },
          { input: '0 0 0 1 1 1', expected: '0 1\n0 1\n0 1', hidden: true },
        ],
        hints: [
          'Read the table as 2 rows by 3 columns. To print it turned around, make the **outer** loop go over the 3 columns and the **inner** loop over the 2 rows.',
          'Print `t[r][c]` followed by a space, and print `endl` after each inner loop finishes.',
          'The cell printed first on the second line is `t[0][1]`, then `t[1][1]`.',
        ],
      },
    ],
  },
];
