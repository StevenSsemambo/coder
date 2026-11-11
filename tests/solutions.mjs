// Reference solutions used by the tests. Every exercise must have one, and it must pass all its tests.
// Starter code must NOT pass (otherwise an exercise could be "completed" without doing anything).

const C = (body) => `#include <stdio.h>\n\nint main() {\n${body}\n    return 0;\n}\n`;

import { level3Solution as L3 } from '../src/content/py/level3-b.js';

const py25 = () => `import json\n\n${L3.PRODUCT}\n\n${L3.SHOP_BASE}\n\n${L3.SHOP_SAVE}\n\nshop = Shop()\nshop.add_product("Sugar", 4500, 20)\nshop.add_product("Rice", 3000, 15)\nshop.sell(input(), int(input()))\nshop.save("duuka.json")\n\ntomorrow = Shop()\ntomorrow.load("duuka.json")\ntomorrow.report()\n`;

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

  'py11-firstlast': 'items = ["rice", "beans", "sugar", "salt"]\nprint("First:", items[0])\nprint("Last:", items[-1])\n',
  'py11-total': 'sales = [12000, 8500, 20000]\nprint("Total:", sum(sales))\nprint("Biggest:", max(sales))\n',
  'py12-stock': 'stock = ["rice", "beans"]\nstock.append("sugar")\nstock.remove("rice")\nprint(stock)\n',
  'py12-expensive': 'prices = [1200, 7000, 5500, 800, 9000]\ncount = 0\nfor p in prices:\n    if p > 5000:\n        count = count + 1\nprint("Expensive items:", count)\n',
  'py12-average': 'scores = [60, 75, 90, 55]\nprint("Average:", sum(scores) / len(scores))\n',
  'py13-lookup': 'prices = {"sugar": 4500, "rice": 3000, "salt": 800}\nitem = input()\nif item in prices:\n    print(f"{item} costs {prices[item]}")\nelse:\n    print("Not sold here")\n',
  'py13-votes': 'votes = ["A", "B", "A", "C", "A", "B"]\ncounts = {}\nfor v in votes:\n    if v in counts:\n        counts[v] = counts[v] + 1\n    else:\n        counts[v] = 1\nfor name, n in counts.items():\n    print(f"{name}: {n}")\n',
  'py14-area': 'def area(length, width):\n    return length * width\n\nlength = int(input())\nwidth = int(input())\nprint("Area:", area(length, width))\n',
  'py14-grade': 'def grade(marks):\n    if marks >= 80:\n        return "A"\n    elif marks >= 70:\n        return "B"\n    elif marks >= 60:\n        return "C"\n    else:\n        return "F"\n\nmarks = int(input())\nprint("Grade:", grade(marks))\n',
  'py15-age': 'try:\n    age = int(input())\n    print(f"Next year you will be {age + 1}")\nexcept ValueError:\n    print("Please type a number")\n',
  'py15-divide': 'a = int(input())\nb = int(input())\ntry:\n    print(a / b)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\n',
  'py16-sumuntil': 'total = 0\nwhile True:\n    n = int(input())\n    if n == 0:\n        break\n    total = total + n\nprint("Total:", total)\n',
  'py16-menu': 'while True:\n    choice = input()\n    if choice == "1":\n        print("Hello")\n    elif choice == "2":\n        print("Goodbye")\n        break\n    else:\n        print("Invalid")\n',
  'py17-stock': `stock = {"sugar": 20, "rice": 15, "salt": 40}\nprices = {"sugar": 4500, "rice": 3000, "salt": 800}\nsales_total = 0\n\ndef show_stock():\n    for item, qty in stock.items():\n        print(f"{item}: {qty}")\n\ndef sell(item, quantity):\n    if item not in stock:\n        print("We do not sell that")\n        return 0\n    if stock[item] < quantity:\n        print("Not enough stock")\n        return 0\n    stock[item] = stock[item] - quantity\n    return prices[item] * quantity\n\nwhile True:\n    print("1. Show stock  2. Sell  3. Close shop")\n    choice = input()\n    if choice == "1":\n        show_stock()\n    elif choice == "2":\n        item = input()\n        try:\n            quantity = int(input())\n            sales_total = sales_total + sell(item, quantity)\n        except ValueError:\n            print("Please type a number")\n    elif choice == "3":\n        break\n    else:\n        print("Invalid choice")\nprint(f"Shop closed. Sales today: {sales_total}")\n`,

  'py18-sms': 'sms = input()\nname, amount, city = sms.split(",")\nprint(f"{name} sent {int(amount):,} from {city}")\n',
  'py18-money': 'price = int(input())\nprint(f"UGX {price:,}")\n',
  'py19-unique': 'visitors = ["Amina", "Okello", "Amina", "Nakato", "Okello", "Zed"]\nprint("Unique visitors:", len(set(visitors)))\n',
  'py19-common': 'monday = {"Amina", "Zed", "Okello"}\ntuesday = {"Nakato", "Amina", "Zed"}\nprint(sorted(monday & tuesday))\n',
  'py20-circle': 'import math\nr = float(input())\nprint(f"Area: {math.pi * r ** 2:.2f}")\n',
  'py20-dice': 'import random\n\nrandom.seed(3)\nfor i in range(3):\n    print(random.randint(1, 6))\n',
  'py21-discount': 'prices = [1000, 2500, 4000]\nprint([p * 9 // 10 for p in prices])\n',
  'py21-cheap': 'prices = {"sugar": 4500, "rice": 3000, "salt": 800, "tea": 500}\nprint([item for item, price in prices.items() if price < 3000])\n',
  'py22-notes': 'with open("list.txt", "w") as f:\n    f.write("milk\\neggs\\nbread\\n")\n\nnumber = 1\nwith open("list.txt") as f:\n    for line in f:\n        print(f"{number}. {line.strip()}")\n        number = number + 1\n',
  'py22-total': 'with open("sales.txt", "w") as f:\n    f.write("sugar,4500\\nrice,3000\\nsalt,800\\ntea,500\\n")\n\ntotal = 0\nwith open("sales.txt") as f:\n    for line in f:\n        name, price = line.strip().split(",")\n        total = total + int(price)\nprint("Total:", total)\n',
  'py22-diary': 'text = input()\nwith open("diary.txt", "w") as f:\n    f.write(text + "\\n")\nwith open("diary.txt") as f:\n    print("Saved:", f.read().strip())\n',
  'py23-save': 'import json\n\nstock = {"sugar": 20, "rice": 15}\nwith open("stock.json", "w") as f:\n    json.dump(stock, f)\nwith open("stock.json") as f:\n    loaded = json.load(f)\nloaded["sugar"] = loaded["sugar"] + 5\nprint("Sugar now:", loaded["sugar"])\n',
  'py23-parse': 'import json\n\ndata = json.loads(input())\nprint(f"{data[\'name\']} sent {data[\'amount\']}")\n',
  'py24-wallet': 'class Wallet:\n    def __init__(self, balance):\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance = self.balance + amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print("Not enough money")\n        else:\n            self.balance = self.balance - amount\n\nwallet = Wallet(int(input()))\nwallet.deposit(int(input()))\nwallet.withdraw(int(input()))\nprint("Balance:", wallet.balance)\n',
  'py24-product': 'class Product:\n    def __init__(self, name, price, stock):\n        self.name = name\n        self.price = price\n        self.stock = stock\n\n    def total_value(self):\n        return self.price * self.stock\n\nname = input()\nprice = int(input())\nstock = int(input())\np = Product(name, price, stock)\nprint(f"{p.name} stock is worth {p.total_value()}")\n',
  'py25-shop': py25(),
};
