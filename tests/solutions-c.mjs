// Reference solutions for the C course (see docs/C-TRACK.md). Every C exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
import { prog } from '../src/content/c/shared.js';

const C = (body) => prog(body);
const F = (fns, body) => `#include <stdio.h>\n\n${fns}\n\nint main() {\n${body}\n    return 0;\n}\n`;

export const cSolutions = {
  'c1-hello': C('    printf("Hello, Uganda!\\n");'),
  'c1-twolines': C('    printf("Welcome to C\\n");\n    printf("Let\'s learn together\\n");'),
  'c1-triangle': C('    printf("*\\n");\n    printf("**\\n");\n    printf("***\\n");'),
  'c2-sum': C('    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("Sum: %d\\n", a + b);'),
  'c2-change': C('    int price, paid;\n    scanf("%d %d", &price, &paid);\n    printf("Change: %d\\n", paid - price);'),
  'c2-average': C('    int a, b, c;\n    float average;\n    scanf("%d %d %d", &a, &b, &c);\n    average = (a + b + c) / 3.0;\n    printf("Average: %.2f\\n", average);'),
  'c3-passfail': C('    int marks;\n    scanf("%d", &marks);\n    if (marks >= 50) {\n        printf("Pass\\n");\n    } else {\n        printf("Fail\\n");\n    }'),
  'c3-evenodd': C('    int n;\n    scanf("%d", &n);\n    if (n % 2 == 0) {\n        printf("Even\\n");\n    } else {\n        printf("Odd\\n");\n    }'),
  'c3-grade': C('    int marks;\n    scanf("%d", &marks);\n    if (marks >= 80) {\n        printf("Grade: A\\n");\n    } else if (marks >= 70) {\n        printf("Grade: B\\n");\n    } else if (marks >= 60) {\n        printf("Grade: C\\n");\n    } else if (marks >= 50) {\n        printf("Grade: D\\n");\n    } else {\n        printf("Grade: F\\n");\n    }'),
  'c4-count': C('    int n, i;\n    scanf("%d", &n);\n    for (i = 1; i <= n; i++) {\n        printf("%d\\n", i);\n    }'),
  'c4-sum': C('    int n, i, total = 0;\n    scanf("%d", &n);\n    for (i = 1; i <= n; i++) {\n        total = total + i;\n    }\n    printf("Sum: %d\\n", total);'),
  'c4-table': C('    int n, i;\n    scanf("%d", &n);\n    for (i = 1; i <= 12; i++) {\n        printf("%d x %d = %d\\n", n, i, n * i);\n    }'),

  // Level 3: functions (lessons 11 to 15)
  'c11-square': F(String.raw`int square(int n) {
    return n * n;
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Square: %d\n", square(n));`),
  'c11-max3': F(String.raw`int bigger(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}`, String.raw`    int x, y, z;
    scanf("%d %d %d", &x, &y, &z);
    printf("Max: %d\n", bigger(bigger(x, y), z));`),
  'c11-stars': F(String.raw`void stars(int n) {
    int i;
    for (i = 0; i < n; i++) {
        printf("*");
    }
    printf("\n");
}`, String.raw`    int n;
    scanf("%d", &n);
    stars(n);
    printf("Done\n");`),
  'c12-fee': F(String.raw`int fee(int amount) {
    if (amount <= 5000) {
        return 100;
    }
    if (amount <= 50000) {
        return 500;
    }
    return 1000;
}`, String.raw`    int amount;
    scanf("%d", &amount);
    printf("Fee: %d\n", fee(amount));`),
  'c12-ticket': F(String.raw`int next_ticket() {
    static int last = 0;
    last++;
    return last;
}`, String.raw`    int n, i, t;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        t = next_ticket();
        printf("Ticket %d\n", t);
    }`),
  'c12-power': F(String.raw`int power(int base, int exp) {
    int result = 1, i;
    for (i = 0; i < exp; i++) {
        result = result * base;
    }
    return result;
}`, String.raw`    int b, e;
    scanf("%d %d", &b, &e);
    printf("Power: %d\n", power(b, e));`),
  'c13-factorial': F(String.raw`int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Factorial: %d\n", fact(n));`),
  'c13-sumto': F(String.raw`int sum_to(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sum_to(n - 1);
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Sum: %d\n", sum_to(n));`),
  'c13-fib': F(String.raw`int fib(int n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`, String.raw`    int n;
    scanf("%d", &n);
    printf("Fib: %d\n", fib(n));`),
  'c14-airtime': F(String.raw`int balance;

void buy(int amount) {
    if (amount > balance) {
        printf("Not enough balance\n");
    } else {
        balance = balance - amount;
        printf("Bought %d\n", amount);
    }
}

void show() {
    printf("Balance: %d\n", balance);
}`, String.raw`    int choice, amount;
    scanf("%d", &balance);
    scanf("%d", &choice);
    while (choice != 0) {
        if (choice == 1) {
            scanf("%d", &amount);
            buy(amount);
        } else if (choice == 2) {
            show();
        }
        scanf("%d", &choice);
    }`),
  'c15-fixavg': String.raw`#include <stdio.h>

int main() {
    int a, b, c;
    float average;
    scanf("%d %d %d", &a, &b, &c);
    average = (a + b + c) / 3.0;
    printf("Average: %.2f\n", average);
    return 0;
}
`,
  'c15-fixloop': String.raw`#include <stdio.h>

int main() {
    int n, i;
    scanf("%d", &n);
    for (i = n; i >= 1; i--) {
        printf("%d\n", i);
    }
    return 0;
}
`,
  'c15-fixgrade': String.raw`#include <stdio.h>

int main() {
    int marks;
    scanf("%d", &marks);
    if (marks >= 50) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }
    return 0;
}
`,

  // Level 2: loops (lessons 7 to 10)
  'c7-evens': C(String.raw`    int n, i;
    scanf("%d", &n);
    for (i = 2; i <= n; i += 2) {
        printf("%d\n", i);
    }`),
  'c7-total': C(String.raw`    int n, i, mark, total = 0;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        scanf("%d", &mark);
        total = total + mark;
    }
    printf("Total: %d\n", total);`),
  'c8-sum0': C(String.raw`    int x, total = 0;
    scanf("%d", &x);
    while (x != 0) {
        total = total + x;
        scanf("%d", &x);
    }
    printf("Total: %d\n", total);`),
  'c8-digits': C(String.raw`    int n, count = 0;
    scanf("%d", &n);
    while (n > 0) {
        n = n / 10;
        count++;
    }
    printf("Digits: %d\n", count);`),
  'c8-save': C(String.raw`    int goal, weekly, saved = 0, weeks = 0;
    scanf("%d %d", &goal, &weekly);
    while (saved < goal) {
        saved = saved + weekly;
        weeks++;
    }
    printf("Weeks: %d\n", weeks);`),
  'c9-square': C(String.raw`    int n, row, col;
    scanf("%d", &n);
    for (row = 1; row <= n; row++) {
        for (col = 1; col <= n; col++) {
            printf("#");
        }
        printf("\n");
    }`),
  'c9-stairs': C(String.raw`    int n, i, j;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= i; j++) {
            printf("%d", i);
        }
        printf("\n");
    }`),
  'c9-grid': C(String.raw`    int n, i, j;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            printf("%d", i * j);
            if (j < n) {
                printf(" ");
            }
        }
        printf("\n");
    }`),
  'c10-till': C(String.raw`    int price, items = 0, total = 0, discount = 0;
    scanf("%d", &price);
    while (price != 0) {
        items++;
        total = total + price;
        scanf("%d", &price);
    }
    if (total >= 10000) {
        discount = total / 10;
    }
    printf("Items: %d\n", items);
    printf("Total: %d\n", total);
    printf("Discount: %d\n", discount);
    printf("Pay: %d\n", total - discount);`),

  // Level 2: new exercises
  'c3-sign': C(String.raw`    int n;
    scanf("%d", &n);
    if (n > 0) {
        printf("Positive\n");
    } else if (n < 0) {
        printf("Negative\n");
    } else {
        printf("Zero\n");
    }`),
  'c6-leap': C(String.raw`    int y;
    scanf("%d", &y);
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        printf("Leap year\n");
    } else {
        printf("Not a leap year\n");
    }`),
  'c6-day': C(String.raw`    int day;
    scanf("%d", &day);
    switch (day) {
        case 1: printf("Monday\n"); break;
        case 2: printf("Tuesday\n"); break;
        case 3: printf("Wednesday\n"); break;
        case 4: printf("Thursday\n"); break;
        case 5: printf("Friday\n"); break;
        case 6: printf("Saturday\n"); break;
        case 7: printf("Sunday\n"); break;
        default: printf("Invalid day\n");
    }`),
  'c6-bigger': C(String.raw`    int a, b, big;
    scanf("%d %d", &a, &b);
    big = a > b ? a : b;
    printf("Bigger: %d\n", big);`),

  // Level 1: new exercises
  'c0-plan': C(String.raw`    printf("1. Take the order\n");
    printf("2. Work out the total\n");
    printf("3. Receive the money\n");
    printf("4. Give the change\n");`),
  'c0-order': C(String.raw`    printf("1. Wet your hands\n");
    printf("2. Add soap\n");
    printf("3. Rub for 20 seconds\n");
    printf("4. Rinse\n");`),
  'c1-quote': C(String.raw`    printf("Rose says \"Karibu!\"\n");
    printf("C:\\Duuka\n");`),
  'c2t-minutes': C(String.raw`    int minutes;
    scanf("%d", &minutes);
    printf("%d hours %d minutes\n", minutes / 60, minutes % 60);`),
  'c2t-vat': C(String.raw`    float price;
    scanf("%f", &price);
    printf("Total: %.2f\n", price * 1.18);`),
  'c2t-letter': C(String.raw`    char letter;
    scanf(" %c", &letter);
    printf("%c\n", letter - 32);`),
  'c2t-digits': C(String.raw`    int n;
    scanf("%d", &n);
    printf("Last digit: %d\n", n % 10);
    printf("Rest: %d\n", n / 10);`),
};
