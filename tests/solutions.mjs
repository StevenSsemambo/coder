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

  'py0-first': 'print("I can code!")\n',
  'py1-twolines': 'print("Welcome to my shop")\nprint("We sell fresh eggs")\n',
  'py2-comment': 'print("Welcome")\n# print("Test message, remove me")\nprint("Goodbye")\n',
  'py3-jar': 'item = "Soap"\nprice = 2500\nprint(item, "costs", price)\n',
  'py3-swap': 'drink = "Water"\nprint(drink)\ndrink = "Juice"\nprint(drink)\n',
  'py4-types': 'print(type(100))\nprint(type("100"))\n',
  'py4-total': 'quantity = "3"\nprice = 2000\nprint(int(quantity) * price)\n',
  'py5-change': 'price = 3500\npaid = 5000\nchange = paid - price\nprint("Change:", change)\n',
  'py5-sweets': 'print("Each child gets:", 23 // 5)\nprint("Left over:", 23 % 5)\n',
  'py6-card': 'name = "Amina"\namount = 15000\nprint(f"You have sent {amount} to {name}")\n',
  'py6-shout': 'word = "kampala"\nprint(f"{word.upper()} has {len(word)} letters")\n',
  'py7-age': 'age = int(input())\nprint(f"Next year you will be {age + 1}")\n',
  'py8-fare': 'offer = int(input())\nif offer >= 3000:\n    print("Hop on!")\nelse:\n    print("Add some more")\n',
  'py8-grade': 'marks = int(input())\nif marks >= 80:\n    print("Grade A")\nelif marks >= 70:\n    print("Grade B")\nelif marks >= 60:\n    print("Grade C")\nelif marks >= 50:\n    print("Grade D")\nelse:\n    print("Grade F")\n',
  'py9-countdown': 'n = int(input())\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("Go!")\n',
  'py10-till': `print("=== Mama Rose's Duuka ===")\nitem = input()\nprice = int(input())\nquantity = int(input())\npaid = int(input())\ntotal = price * quantity\nprint(f"Item: {item}")\nprint(f"Total: {total}")\nif paid < total:\n    print(f"Not enough money. Short by {total - paid}")\nelse:\n    print(f"Change: {paid - total}")\n`,
};
