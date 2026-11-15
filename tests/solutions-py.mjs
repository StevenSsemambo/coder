// Reference solutions for Python exercises from Level 6 on (lesson 36 and later).
// Every exercise must have one, and it must pass all its tests. The starter code must NOT pass.

import { level6Solution as L6 } from '../src/content/py/level6b.js';

export const pySolutions = {
  // ---- lesson 36: decorators
  'py35-discount': `def make_discount(percent):
    def apply(price):
        return price - price * percent // 100
    return apply

percent = int(input())
price = int(input())
discount = make_discount(percent)
print(discount(price))
`,
  'py35-announce': `def announce(func):
    def wrapper(*args, **kwargs):
        print("Selling...")
        return func(*args, **kwargs)
    return wrapper

@announce
def sell(item):
    print(f"Sold {item}")

sell(input())
`,
  'py35-positive': `def positive_only(func):
    def wrapper(amount):
        if amount <= 0:
            print("Amount must be positive")
            return None
        return func(amount)
    return wrapper

@positive_only
def send(amount):
    print(f"Sent {amount}")

send(int(input()))
`,

  // ---- lesson 37: context managers and custom errors
  'py36-guard': `from contextlib import contextmanager

@contextmanager
def shop_hours():
    print("Opening shop")
    try:
        yield
    finally:
        print("Closing shop")

try:
    with shop_hours():
        print(100 // int(input()))
except ZeroDivisionError:
    print("Cannot divide")
`,
  'py36-withdraw': `class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(amount - balance)
    return balance - amount

balance = int(input())
amount = int(input())
try:
    print("New balance:", withdraw(balance, amount))
except InsufficientFunds as e:
    print("Short by", e)
`,

  // ---- lesson 38: special methods, properties
  'py37-str': `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __str__(self):
        return f"{self.name} - UGX {self.price:,}"

name = input()
price = int(input())
print(Product(name, price))
`,
  'py37-basket': `class Basket:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

    def __len__(self):
        return len(self.items)

    @property
    def total(self):
        return sum(price for name, price in self.items)

basket = Basket()
n = int(input())
for i in range(n):
    name, price = input().split()
    basket.add(name, int(price))
print("Items:", len(basket))
print("Total:", basket.total)
`,
  'py37-wallet': `class Wallet:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = value

wallet = Wallet(int(input()))
new = int(input())
try:
    wallet.balance = new
    print("Balance:", wallet.balance)
except ValueError as e:
    print(e)
except AttributeError:
    print("No setter yet")
`,

  // ---- lesson 39: type hints, guard clauses, clean code
  'py38-hints': `def average(marks: list[int]) -> float:
    """Return the average of the marks."""
    return sum(marks) / len(marks)

marks = [int(x) for x in input().split()]
print(average.__annotations__)
print("Docstring:", "yes" if average.__doc__ else "no")
print(average(marks))
`,
  'py38-grade': `def grade(marks):
    if marks < 0 or marks > 100:
        raise ValueError("Marks must be between 0 and 100")
    if marks >= 80:
        return "A"
    if marks >= 50:
        return "Pass"
    return "Fail"

marks = int(input())
try:
    print(grade(marks))
except ValueError:
    print("Invalid marks")
`,
  'py38-basket': `def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(add_item(input()))
print(add_item(input()))
`,

  // ---- lesson 40: regular expressions
  'py39-extract': String.raw`import re

sms = input()
m = re.search(r"UGX ([\d,]+) from \w+ (07\d{8})", sms)
amount = m.group(1).replace(",", "")
phone = m.group(2)
print(f"Amount: {amount}")
print(f"From: {phone}")
`,
  'py39-validate': String.raw`import re

n = int(input())
for i in range(n):
    number = input()
    if re.fullmatch(r"(07|\+2567)\d{8}", number):
        print("valid")
    else:
        print("invalid")
`,
  'py39-hide': String.raw`import re

text = input()
print(re.sub(r"(07\d{2})\d{6}", r"\1******", text))
`,

  // ---- lesson 41: project, the customer ledger
  'py40-ledger': `import re
from contextlib import contextmanager
from dataclasses import dataclass

${L6.LEDGER_CORE}

${L6.SESSION}

${L6.PROCESS}

n = int(input())
ledger = Ledger()
with ledger_session():
    for _ in range(n):
        line = input()
        process(ledger, line)
    print(f"Total owed: {ledger.total_owed}")
`,
};
