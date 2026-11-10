// Reference solutions used by the tests. Every exercise must have one, and it must pass all its tests.
// Starter code must NOT pass (otherwise an exercise could be "completed" without doing anything).

const C = (body) => `#include <stdio.h>\n\nint main() {\n${body}\n    return 0;\n}\n`;

export const solutions = {
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

  'py1-hello': 'print("Hello, Uganda!")\n',
  'py1-greet': 'name = input()\nprint("Hello, " + name + "!")\n',
  'py1-area': 'length = int(input())\nwidth = int(input())\nprint("Area:", length * width)\n',
  'py2-passfail': 'marks = int(input())\nif marks >= 50:\n    print("Pass")\nelse:\n    print("Fail")\n',
  'py2-sumn': 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint("Sum:", total)\n',
  'py2-stars': 'n = int(input())\nfor i in range(1, n + 1):\n    print("*" * i)\n',
};
