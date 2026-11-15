// Reference solutions for Python exercises from Level 6 on (lesson 36 and later).
// Every exercise must have one, and it must pass all its tests. The starter code must NOT pass.

import { level6Solution as L6 } from '../src/content/py/level6b.js';
import { level7Solution as L7 } from '../src/content/py/level7a.js';

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

  // ---- lesson 42: Big-O
  'py41-linear': `def count_steps(items, target):
    steps = 0
    for item in items:
        steps += 1
        if item == target:
            break
    return steps

items = [int(x) for x in input().split()]
target = int(input())
print(count_steps(items, target))
`,
  'py41-guesses': `n = int(input())
steps = 0
while n > 0:
    n = n // 2
    steps += 1
print(steps)
`,
  'py41-duplicates': `numbers = input().split()
seen = set()
found = False
for n in numbers:
    if n in seen:
        found = True
    seen.add(n)
print("Duplicates" if found else "All different")
`,

  // ---- lesson 43: searching, hashing, recursion
  'py42-binary': `def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

items = [int(x) for x in input().split()]
target = int(input())
print(binary_search(items, target))
`,
  'py42-shelf': `shelves = int(input())
words = input().split()
for word in words:
    total = sum(ord(ch) for ch in word)
    print(word, total % shelves)
`,
  'py42-fib': `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(int(input())))
`,

  // ---- lesson 44: stacks, queues, linked lists
  'py43-brackets': `text = input()
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
ok = True
for ch in text:
    if ch in "([{":
        stack.append(ch)
    elif ch in pairs:
        if not stack or stack.pop() != pairs[ch]:
            ok = False
            break
if stack:
    ok = False
print("Balanced" if ok else "Not balanced")
`,
  'py43-queue': `from collections import deque

n = int(input())
line = deque()
for i in range(n):
    command = input().split()
    if command[0] == "join":
        line.append(command[1])
    elif command[0] == "serve":
        if line:
            print("Serving", line.popleft())
        else:
            print("Nobody waiting")
print(f"Still waiting: {len(line)}")
`,
  'py43-linked': `${L7.NODE_LIST}

    def to_text(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return " -> ".join(values)

chain = LinkedList()
for value in input().split():
    chain.add_front(value)
print(chain.to_text())
`,
};
