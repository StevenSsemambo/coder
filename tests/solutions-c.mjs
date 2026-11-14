// Reference solutions for the C course (see docs/C-TRACK.md). Every C exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
import { prog } from '../src/content/c/shared.js';

const C = (body) => prog(body);

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
