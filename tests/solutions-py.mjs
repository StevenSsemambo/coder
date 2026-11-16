// Reference solutions for Python exercises from Level 6 on (lesson 36 and later).
// Every exercise must have one, and it must pass all its tests. The starter code must NOT pass.

import { level6Solution as L6 } from '../src/content/py/level6b.js';
import { level7Solution as L7 } from '../src/content/py/level7a.js';
import { level7bSolution as L7B } from '../src/content/py/level7b.js';
import { level8Solution as L8 } from '../src/content/py/level8a.js';
import { level8bSolution as L8B } from '../src/content/py/level8b.js';
import { level9aSolution as L9A } from '../src/content/py/level9a.js';

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

  // ---- lesson 45: CSV and data cleaning
  'py44-total': `import csv

n = int(input())
lines = [input() for i in range(n)]
total = 0
for row in csv.DictReader(lines):
    total += int(row["qty"]) * int(row["price"])
print(f"Revenue: {total:,}")
`,
  'py44-clean': `import csv

n = int(input())
lines = [input() for i in range(n)]
for name, price in csv.reader(lines):
    digits = price.replace("UGX", "").replace(",", "").strip()
    amount = int(digits) if digits else 0
    print(f"{name.strip().title()}: {amount:,}")
`,
  'py44-dedupe': `n = int(input())
lines = [input() for i in range(n)]
seen = set()
removed = 0
for line in lines:
    date, item, qty = line.split(",")
    key = (date, item)
    if key in seen:
        removed += 1
        continue
    seen.add(key)
    print(line)
print(f"Removed: {removed}")
`,

  // ---- lesson 46: project, the sales analyzer pipeline
  'py45-clean': `import csv
from collections import Counter
from dataclasses import dataclass

${L7B.SALE}

${L7B.CLEAN}

${L7B.ANALYZE}

${L7B.REPORT}

n = int(input())
lines = [input() for i in range(n)]
sales, errors = clean(lines)
report(sales, errors)
`,

  // ---- lesson 47: modules and packages
  'py46-package': `${L8.MAKE_PACKAGE}

make_package("tillkit", {
    "__init__.py": "",
    "money.py": """def fmt(amount):
    return f"UGX {amount:,}"
""",
    "tools.py": """def line_total(qty, price):
    return qty * price
""",
})

from tillkit.money import fmt
from tillkit.tools import line_total

qty = int(input())
price = int(input())
print(fmt(line_total(qty, price)))
`,
  'py46-guard': `${L8.MAKE_MODULE}

make_module("greeter_ex", """def greet(name):
    return "Welcome, " + name

if __name__ == "__main__":
    print(greet("test"))
""")

import greeter_ex

print(greeter_ex.greet(input()))
`,
  'py46-writemod': `${L8.MAKE_MODULE}

make_module("taxes", """def with_vat(price, percent=18):
    return price + price * percent // 100
""")

import taxes

price = int(input())
print(taxes.with_vat(price))
print(taxes.with_vat(price, 10))
`,

  // ---- lesson 48: command-line apps
  'py47-parse': `import argparse
import contextlib
import io

${L8.SAFE_PARSE}

parser = argparse.ArgumentParser(prog="duuka")
parser.add_argument("item")
parser.add_argument("--qty", type=int, default=1)
parser.add_argument("--vat", action="store_true")

args, problem = safe_parse(parser, input().split())
if args is None:
    print("Bad command")
else:
    print("Item:", args.item)
    print("Qty:", args.qty)
    print("VAT:", "yes" if args.vat else "no")
`,
  'py47-subcommands': `import argparse
import contextlib
import io

${L8.SAFE_PARSE}

parser = argparse.ArgumentParser(prog="duuka")
sub = parser.add_subparsers(dest="command", required=True)
add = sub.add_parser("add")
add.add_argument("item")
add.add_argument("--qty", type=int, default=1)
sub.add_parser("total")

PRICES = {"sugar": 4500, "rice": 3000, "tea": 500}
cart = {}

n = int(input())
for i in range(n):
    args, problem = safe_parse(parser, input().split())
    if args is None:
        print("Bad command")
        continue
    if args.command == "add":
        if args.item not in PRICES:
            print(f"Unknown item: {args.item}")
        else:
            cart[args.item] = cart.get(args.item, 0) + args.qty
            print(f"Added {args.qty} x {args.item}")
    else:
        total = sum(PRICES[item] * qty for item, qty in cart.items())
        print(f"Total: {total:,}")
`,
  'py47-config': `import json

DEFAULTS = {"vat_percent": 18, "currency": "UGX", "shop": "Duuka"}

user = json.loads(input())
config = {**DEFAULTS, **user}
print(config["shop"], config["currency"], config["vat_percent"])
`,

  // ---- lesson 49: SQLite from Python
  'py48-low': `import sqlite3

${L8.STOCK_HEAD}
${L8.STOCK_LOW}

stock = Stock()
for item, qty in [("sugar", 50), ("rice", 30), ("tea", 100), ("salt", 8), ("oil", 12)]:
    stock.add(item, qty, 1000)

limit = int(input())
names = stock.low_items(limit)
if names:
    for name in names:
        print(name)
else:
    print("Nothing is low")
`,
  'py48-sell': `import sqlite3

${L8.STOCK_HEAD}
${L8.STOCK_SELL}

stock = Stock()
stock.add("sugar", 50, 4500)
stock.add("salt", 8, 800)
stock.add("tea", 100, 500)

n = int(input())
for i in range(n):
    _, item, qty = input().split()
    qty = int(qty)
    try:
        stock.sell(item, qty)
        print(f"Sold {qty} x {item}, left {stock.qty(item)}")
    except UnknownItem:
        print(f"Error: unknown item {item}")
    except OutOfStock as e:
        print(f"Error: only {e} {item} left")
`,
  'py48-injection': `import sqlite3

con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE stock (item TEXT, qty INTEGER)")
con.executemany("INSERT INTO stock VALUES (?, ?)", [("sugar", 50), ("rice", 30), ("tea", 100), ("salt", 8), ("oil", 12)])

name = input()
rows = con.execute("SELECT item FROM stock WHERE item = ?", (name,)).fetchall()
print(len(rows))
`,

  // ---- lesson 50: APIs and JSON (simulated)
  'py49-json': `import json

order = json.loads(input())
total = 0
for item in order["items"]:
    total += item["qty"] * item["price"]
print(f"Total: {total:,}")
`,
  'py49-client': `import json
from urllib.parse import urlparse, parse_qs

${L8B.FAKE_API}

class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(f"{status}: {message}")
        self.status = status

def get_json(url):
    status, text = fake_api("GET", url)
    data = json.loads(text)
    if status != 200:
        raise ApiError(status, data["error"])
    return data

n = int(input())
for i in range(n):
    item_id = input()
    try:
        print(get_json(f"https://api.duuka.ug/v1/items/{item_id}")["name"])
    except ApiError as e:
        print("Error", e.status)
`,
  'py49-retry': `import json

class ApiError(Exception):
    def __init__(self, status):
        super().__init__(status)
        self.status = status

def with_retries(call, attempts=3):
    status = None
    for attempt in range(1, attempts + 1):
        status, text = call()
        if status == 200:
            return json.loads(text), attempt
        if status < 500:
            raise ApiError(status)
    raise ApiError(status)

statuses = iter(input().split())

def call():
    status = int(next(statuses))
    return status, '{"ok": true}' if status == 200 else '{"error": "x"}'

try:
    data, used = with_retries(call)
    print("OK, attempts used:", used)
except ApiError as e:
    print("Failed:", e.status)
`,

  // ---- lesson 51: logging, debugging, measuring
  'py50-log': `${L8B.LOG_SETUP}

def process(amount):
    if amount <= 0:
        log.error("invalid amount: %s", amount)
        return
    log.info("sale recorded: %s", amount)
    if amount > 1000000:
        log.warning("large sale: %s", amount)

n = int(input())
for i in range(n):
    process(int(input()))
`,
  'py50-counted': `def counted(func):
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@counted
def square(x):
    return x * x

n = int(input())
for i in range(n):
    square(i)
print(square.calls)
`,
  'py50-cheapest': `def cheapest(items):
    """items is a list of (name, price). Return the name of the cheapest item."""
    best = items[0]
    for name, price in items:
        if price < best[1]:
            best = (name, price)
    return best[0]

n = int(input())
items = []
for i in range(n):
    name, price = input().split()
    items.append((name, int(price)))
print(cheapest(items))
`,

  // ---- lesson 52: project, Duuka Manager
  'py51-manager': `${L8B.APP_HEADER}
logging.disable(logging.CRITICAL)

${L8B.APP_STOCK}

${L8B.APP_REPORT}

${L8B.parserFn(L8B.VALUE_PARSER)}

${L8B.runFn(L8B.VALUE_RUN)}

n = int(input())
stock = Stock()
for i in range(n):
    run(input().split(), stock)
`,

  // ---- lesson 53: concurrency with asyncio
  'py52-gather': `import asyncio

PRICES = {"sugar": 4500, "rice": 3000, "tea": 500}

async def get_price(item):
    await asyncio.sleep(0)
    return PRICES.get(item)

async def fetch_all(items):
    return await asyncio.gather(*[get_price(item) for item in items])

items = input().split()
prices = await fetch_all(items)
for item, price in zip(items, prices):
    print(f"{item}: {price if price is not None else 'not found'}")
`,
  'py52-workers': `import asyncio

async def worker(name, steps):
    for i in range(1, steps + 1):
        print(name, "step", i)
        await asyncio.sleep(0)

a, b = [int(x) for x in input().split()]
await asyncio.gather(worker("A", a), worker("B", b))
`,
  'py52-timeout': `import asyncio

async def slow_call(delay):
    await asyncio.sleep(delay)
    return "done"

async def call_with_limit(delay, limit):
    try:
        return await asyncio.wait_for(slow_call(delay), timeout=limit)
    except asyncio.TimeoutError:
        return "timeout"

delay, limit = [float(x) for x in input().split()]
print(await call_with_limit(delay, limit))
`,

  // ---- lesson 54: a web backend from scratch
  'py53-route': `${L9A.MINI_APP}

app = MiniApp()
${L9A.ITEMS3}

${L9A.LIST_ROUTE}

${L9A.GET_ROUTE}

n = int(input())
for i in range(n):
    print(*app.handle("GET", input()))
`,
  'py53-validate': `import json

${L9A.MINI_APP}

app = MiniApp()
${L9A.ITEMS2}

@app.route("POST", "/items")
def create_item(request):
${L9A.POST_BODY}

n = int(input())
for i in range(n):
    print(*app.handle("POST", "/items", json.loads(input())))
`,
  'py53-auth': `${L9A.MINI_APP}

app = MiniApp()

${L9A.REQUIRES_KEY}

@app.route("GET", "/report")
@requires_key
def report(request):
    return 200, {"total": 12000}

n = int(input())
for i in range(n):
    line = input()
    headers = {} if line == "-" else {"x-api-key": line}
    print(*app.handle("GET", "/report", headers=headers))
`,

  // ---- lesson 55: packaging and versions
  'py54-toml': `import tomllib

n = int(input())
text = "\\n".join(input() for i in range(n))
project = tomllib.loads(text)["project"]
print(project["name"], project["version"])
print("Dependencies:", len(project.get("dependencies", [])))
`,
  'py54-version': `${L9A.PARSE_VERSION}

versions = input().split()
ordered = sorted(versions, key=parse_version)
print("Newest:", ordered[-1])
print("Order:", " < ".join(ordered))
`,
  'py54-entry': `${L8.MAKE_PACKAGE}

make_package("shopapp", {
    "__init__.py": "",
    "tools.py": """def greet():
    return "Welcome to the shop"

def total():
    return 42
""",
})

def load_entry_point(spec):
    module_name, function_name = spec.split(":")
    module = importlib.import_module(module_name)
    return getattr(module, function_name)

function = load_entry_point(input())
print(function())
`,
};
