// Python, Level 9 (Capstones and the path forward), part B: where to go next, and the final capstone.
// Lessons 56 and 57. Exercise ids use the lesson number minus one (py55-, py56-).
// Everything runs on the standard library only, so it works offline.

const LEVEL = 'Level 9: Capstones and the path forward';

const sellBody = (body) => `    def sell(self, item, qty, customer=None):
${body}`;

const SELL_REAL = sellBody(`        if qty <= 0:
            raise BusinessError("quantity must be positive")
        with self.con:
            have, price = self.product(item)
            if have < qty:
                raise OutOfStock(f"only {have} {item} left")
            total = qty * price
            self.con.execute("UPDATE products SET qty = qty - ? WHERE item = ?", (qty, item))
            self.con.execute(
                "INSERT INTO sales (item, qty, total, customer) VALUES (?, ?, ?, ?)",
                (item, qty, total, customer),
            )
            if customer is not None:
                self.con.execute(
                    "INSERT INTO customers VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET owed = owed + excluded.owed",
                    (customer, total),
                )
        return total`);

const SELL_STUB = sellBody(`        # 1. refuse a quantity of 0 or less: raise BusinessError("quantity must be positive")
        # 2. inside "with self.con:" look the product up with self.product(item)
        # 3. if there is not enough, raise OutOfStock(f"only {have} {item} left")
        # 4. take qty out of the stock and record the sale (item, qty, total, customer)
        # 5. if a customer name was given, add the total to what that customer owes
        # 6. return the total
        pass`);

const businessCode = (sell) => `import json
import sqlite3

class BusinessError(Exception):
    pass

class UnknownItem(BusinessError):
    pass

class OutOfStock(BusinessError):
    pass

class UnknownCustomer(BusinessError):
    pass

class OverPayment(BusinessError):
    pass

class Business:
    def __init__(self):
        self.con = sqlite3.connect(":memory:")
        self.con.executescript("""
            CREATE TABLE products (item TEXT PRIMARY KEY, qty INTEGER NOT NULL, price INTEGER NOT NULL);
            CREATE TABLE customers (name TEXT PRIMARY KEY, owed INTEGER NOT NULL DEFAULT 0);
            CREATE TABLE sales (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, qty INTEGER, total INTEGER, customer TEXT);
        """)

    def add_product(self, item, qty, price):
        with self.con:
            self.con.execute(
                "INSERT INTO products VALUES (?, ?, ?) "
                "ON CONFLICT(item) DO UPDATE SET qty = qty + excluded.qty, price = excluded.price",
                (item, qty, price),
            )

    def product(self, item):
        row = self.con.execute("SELECT qty, price FROM products WHERE item = ?", (item,)).fetchone()
        if row is None:
            raise UnknownItem(f"unknown item {item}")
        return row

${sell}

    def pay(self, name, amount):
        if amount <= 0:
            raise BusinessError("amount must be positive")
        with self.con:
            row = self.con.execute("SELECT owed FROM customers WHERE name = ?", (name,)).fetchone()
            if row is None:
                raise UnknownCustomer(f"unknown customer {name}")
            if amount > row[0]:
                raise OverPayment(f"{name} owes only {row[0]}")
            self.con.execute("UPDATE customers SET owed = owed - ? WHERE name = ?", (amount, name))
        return row[0] - amount

    def summary(self):
        q = self.con.execute
        return {
            "cash_sales": q("SELECT COALESCE(SUM(total), 0) FROM sales WHERE customer IS NULL").fetchone()[0],
            "credit_sales": q("SELECT COALESCE(SUM(total), 0) FROM sales WHERE customer IS NOT NULL").fetchone()[0],
            "outstanding": q("SELECT COALESCE(SUM(owed), 0) FROM customers").fetchone()[0],
        }

    def export(self):
        products = [dict(zip(("item", "qty", "price"), row))
                    for row in self.con.execute("SELECT item, qty, price FROM products ORDER BY item")]
        customers = [{"name": n, "owed": o}
                     for n, o in self.con.execute("SELECT name, owed FROM customers ORDER BY name")]
        return {"products": products, "customers": customers, "summary": self.summary()}`;

const COMMANDS_CODE = `COMMANDS = {}

def command(name):
    def register(func):
        COMMANDS[name] = func
        return func
    return register

@command("add")
def cmd_add(shop, item, qty, price):
    shop.add_product(item, int(qty), int(price))
    return f"Added {qty} x {item}"

@command("sell")
def cmd_sell(shop, item, qty, *rest):
    customer = None
    if rest:
        if len(rest) != 2 or rest[0] != "credit":
            raise BusinessError("usage: sell ITEM QTY [credit NAME]")
        customer = rest[1]
    total = shop.sell(item, int(qty), customer)
    how = f"on credit to {customer}" if customer else "for cash"
    return f"Sold {qty} x {item} {how}: {total:,}"

@command("pay")
def cmd_pay(shop, name, amount):
    left = shop.pay(name, int(amount))
    return f"{name} now owes {left:,}"

@command("summary")
def cmd_summary(shop):
    s = shop.summary()
    return f"Cash {s['cash_sales']:,} | Credit {s['credit_sales']:,} | Owed {s['outstanding']:,}"

@command("export")
def cmd_export(shop):
    return json.dumps(shop.export(), sort_keys=True)

def run_line(shop, line):
    words = line.split()
    if not words or words[0] not in COMMANDS:
        return "Error: unknown command"
    try:
        return COMMANDS[words[0]](shop, *words[1:])
    except BusinessError as e:
        return f"Error: {e}"
    except (TypeError, ValueError):
        return "Error: bad arguments"`;

const SCRIPT = `add sugar 50 4500
add rice 30 3000
sell sugar 2
sell rice 5 credit Amina
sell sugar 100
sell mango 1
pay Amina 5000
pay Amina 99999
pay Zed 1
sell sugar x
dance
summary`;

const SCRIPT_OUTPUT = 'Added 50 x sugar\nAdded 30 x rice\nSold 2 x sugar for cash: 9,000\nSold 5 x rice on credit to Amina: 15,000\nError: only 48 sugar left\nError: unknown item mango\nAmina now owes 10,000\nError: Amina owes only 10000\nError: unknown customer Zed\nError: bad arguments\nError: unknown command\nCash 9,000 | Credit 15,000 | Owed 10,000';

export const level9b = [
  // ------------------------------------------------------------------ 56
  {
    id: 'py-next',
    level: LEVEL,
    minutes: 24,
    title: 'Where to go next: data, automation, web and AI',
    summary: 'Four roads after this course, each with a working first step and the tools to learn next',
    blocks: [
      {
        t: 'story',
        title: 'Four roads from the shop door',
        text: 'Mama Rose’s nephew has finished all the lessons. He stands at the door of the shop and asks the question every learner asks: “I can write Python now. What do I DO with it?”\n\nThe honest answer is that there are four wide roads, and every one of them uses what you already know. You do not have to choose forever. Most developers walk two or three of them in a career. In this lesson you take one real, working first step on each road using only what comes with Python, and you learn the tools that people use when they go further.',
      },
      { t: 'h', text: 'Road 1: Data, answering questions with numbers' },
      { t: 'p', text: 'Shops, schools, clinics and farms are full of numbers nobody has looked at properly. A data person asks questions: which week sells best, who owes the most, is business getting better? Python’s `statistics` module is the gentle first step. The giant libraries you learn next are `pandas` (tables), `NumPy` (fast numbers) and `matplotlib` (charts).' },
      {
        t: 'code',
        text: `import statistics\n\nsales = [4500, 3000, 500, 3000, 12000, 3000]\nprint(round(statistics.mean(sales), 2))\nprint(statistics.median(sales))\nprint(statistics.mode(sales))\nprint(round(statistics.stdev(sales), 1))`,
        output: '4333.33\n3000.0\n3000\n3970.7',
      },
      { t: 'p', text: 'Look at the first two numbers. The AVERAGE sale is 4,333 but the MIDDLE sale is 3,000. One big sale of 12,000 pulls the average up. A careful data person reports both, and knows which one describes a “typical” customer. The last number, the standard deviation, says how spread out the sales are.' },
      {
        t: 'predict',
        code: `import statistics\n\nprint(statistics.median([5, 1, 3]))`,
        question: 'What does this print?',
        options: ['3', '1', '3.0'],
        answer: 0,
        explain: 'median sorts the numbers (1, 3, 5) and takes the middle one, which is 3. With an even number of values it averages the two middle ones, which gives a float such as 2.5.',
      },
      { t: 'h', text: 'Road 2: Automation, make the computer do the boring work' },
      { t: 'p', text: 'Renaming 500 photos, sorting a messy downloads folder, sending the same report every Friday: all of it can be a ten-line Python script. You already have the tools: loops, text handling, `re` (Lesson 40), `csv` (Lesson 45). The module `pathlib` treats file names as objects. Here we sort a list of file names by type:' },
      {
        t: 'code',
        text: `from collections import defaultdict\nfrom pathlib import PurePosixPath\n\nfiles = ["report.pdf", "photo1.jpg", "notes.txt", "photo2.jpg", "sales.csv"]\ngroups = defaultdict(list)\nfor name in files:\n    groups[PurePosixPath(name).suffix].append(name)\n\nfor ext in sorted(groups):\n    print(ext, groups[ext])`,
        output: ".csv ['sales.csv']\n.jpg ['photo1.jpg', 'photo2.jpg']\n.pdf ['report.pdf']\n.txt ['notes.txt']",
      },
      { t: 'p', text: 'On a real computer the very next step is to replace the list with the real folder (`Path(".").iterdir()`) and move each file. People also schedule such scripts to run by themselves every night. Learn next: `pathlib`, `shutil`, `schedule`, and how to read and write Excel files with `openpyxl`.' },
      { t: 'h', text: 'Road 3: Web, build things people use in a browser' },
      { t: 'p', text: 'In Lesson 54 you built the heart of a backend yourself. Real projects use a framework that does it faster and safer: `Flask` (small and friendly), `FastAPI` (modern, checks your data for you) or `Django` (everything included). You will also meet HTML, CSS and JavaScript for the part that runs in the browser, and databases such as PostgreSQL for data that must never be lost. Uganda needs web builders for Mobile Money services, school systems and online shops that work on slow connections.' },
      { t: 'h', text: 'Road 4: AI, teach the computer to find patterns' },
      { t: 'p', text: 'AI sounds mysterious, but the first idea is small: turn text into numbers and measure how alike two pieces of text are. This toy version counts shared words (called Jaccard similarity). Real systems use far richer numbers, but they ask the same question.' },
      {
        t: 'code',
        text: `def words(text):\n    return set(text.lower().split())\n\ndef similarity(a, b):\n    wa, wb = words(a), words(b)\n    return len(wa & wb) / len(wa | wb)\n\nprint(similarity("cheap sugar in kampala", "sugar is cheap in jinja"))\nprint(similarity("fresh matooke today", "sugar is cheap in jinja"))`,
        output: '0.5\n0.0',
      },
      { t: 'p', text: 'Half of the words are shared in the first pair, none in the second. When you go further you will call AI services through APIs, exactly like Lesson 50 (send a request, check the status, read the JSON), and learn libraries such as `scikit-learn` for classic machine learning. The strongest AI skill is not the library. It is knowing how to check whether an answer is true.' },
      {
        t: 'quiz',
        question: 'A shopkeeper wants to know which weeks of the year sell the most, and whether sales are growing. Which road is this?',
        options: ['Data', 'Automation', 'Web'],
        answer: 0,
        explain: 'Asking questions of numbers and finding patterns is data work. Automation would be a script that does the same task for you every week, and web would be putting the answers on a page.',
      },
      {
        t: 'fill',
        prompt: 'Find the most common word.',
        template: `from collections import Counter\n\nwords = "sugar rice sugar tea sugar rice".split()\nprint(Counter(words).___(1))`,
        blanks: [{ options: ['most_common', 'top', 'max'], answer: 'most_common' }],
        output: "[('sugar', 3)]",
      },
      {
        t: 'bug',
        code: `import statistics\n\nsales = []\nprint(statistics.mean(sales))`,
        question: 'This stops with “mean requires at least one data point”. What is the right fix?',
        options: ['Check that the list is not empty before taking the mean', 'Use a tuple instead of a list', 'Import math as well'],
        answer: 0,
        explain: 'An average of nothing does not exist. A guard clause (Lesson 39) handles the empty case before the calculation.',
        fixed: `import statistics\n\nsales = []\nif sales:\n    print(statistics.mean(sales))\nelse:\n    print("No sales yet")`,
      },
      { t: 'h', text: 'Habits that make a developer' },
      {
        t: 'list',
        items: [
          'BUILD things for real people: the shop next door, your school, your family business. Finished small projects teach more than ten courses.',
          'READ other people’s code. Open source projects on GitHub are free lessons from experts.',
          'WRITE tests and small commits as you go. It feels slow and saves you weeks.',
          'Keep a portfolio of 3 to 5 finished projects with a clear README. Employers and clients look at what you built.',
          'TEACH what you learn to someone else. Explaining is the fastest way to find what you do not really understand.',
          'Be patient. Everyone who is good at this was once stuck on exactly the problems you are stuck on.',
        ],
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `print(0.1 + 0.2 == 0.3)`,
            why: 'Decimal fractions are stored approximately, so the sum is 0.30000000000000004 and not exactly 0.3. Compare with `math.isclose`, or work in whole shillings.',
            right: `import math\n\nprint(math.isclose(0.1 + 0.2, 0.3))`,
            logic: true,
          },
          {
            wrong: `sales = [4500, 3000, 500, 3000, 12000, 3000]\nprint("Typical sale:", sum(sales) / len(sales))`,
            why: 'One huge sale drags the average up to 4,333, which is higher than most customers actually spend. The median shows the typical sale better.',
            right: `import statistics\n\nsales = [4500, 3000, 500, 3000, 12000, 3000]\nprint("Typical sale:", statistics.median(sales))`,
            logic: true,
          },
          {
            wrong: `sales = []\nprint(sum(sales) / len(sales))`,
            why: 'An empty list has length 0, and dividing by 0 crashes. Always decide what should happen when there is no data.',
            right: `sales = []\nprint(sum(sales) / len(sales) if sales else 0)`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['Data: ask questions of numbers. First step `statistics`, then `pandas`, `NumPy`, `matplotlib`.', 'Automation: scripts that do boring work. First step `pathlib`, `re`, `csv`, then `shutil` and `schedule`.', 'Web: backends and sites. You built the core in Lesson 54. Next `Flask`, `FastAPI` or `Django`, plus HTML, CSS and JavaScript.', 'AI: patterns in text and numbers, services reached through APIs. Start with ideas like similarity, then `scikit-learn`.', 'Report the median and the average, never trust a float for exact money, and handle the empty case.', 'Build real things for real people, read code, test, teach, and keep a portfolio.'],
        memory: 'Pick a road, build something real, show it to a real person.',
      },
    ],
    exercises: [
      {
        id: 'py55-stats',
        title: 'Describe the sales',
        prompt: 'Read a line of whole numbers. Print three lines: `Mean:` with 2 decimal places, `Median:` with 1 decimal place, and `Mode:` (the most common number). Use the `statistics` module.',
        starter: 'import statistics\n\nnumbers = [int(x) for x in input().split()]\n# print the mean, the median and the mode\nprint("Mean: ?")\n',
        sampleInput: '4500 3000 500 3000 12000 3000',
        usesInput: true,
        tests: [
          { input: '4500 3000 500 3000 12000 3000', expected: 'Mean: 4333.33\nMedian: 3000.0\nMode: 3000' },
          { input: '2 2 3 10', expected: 'Mean: 4.25\nMedian: 2.5\nMode: 2' },
          { input: '7', expected: 'Mean: 7.00\nMedian: 7.0\nMode: 7', hidden: true },
        ],
        hints: [
          '`statistics.mean(numbers)`, `statistics.median(numbers)` and `statistics.mode(numbers)` do the work.',
          'Format the mean with `{mean:.2f}` and the median with `{median:.1f}` inside an f-string.',
          '`print(f"Mean: {mean:.2f}")`, then the same idea for the median, and `print(f"Mode: {mode}")`.',
        ],
      },
      {
        id: 'py55-group',
        title: 'Tidy the downloads folder',
        prompt: 'Read `n`, then `n` file names. Count the files of each type and print one line per type, like `.jpg: 2`, sorted by the type text. A file with no extension counts under `(none)`. Use `PurePosixPath(name).suffix` to get the type (it is empty when there is none).',
        starter: 'from collections import Counter\nfrom pathlib import PurePosixPath\n\nn = int(input())\nnames = [input() for i in range(n)]\n# count the files by type and print one line per type\nprint("?")\n',
        sampleInput: '5\nreport.pdf\nphoto1.jpg\nnotes.txt\nphoto2.jpg\nREADME',
        usesInput: true,
        tests: [
          { input: '5\nreport.pdf\nphoto1.jpg\nnotes.txt\nphoto2.jpg\nREADME', expected: '(none): 1\n.jpg: 2\n.pdf: 1\n.txt: 1' },
          { input: '3\na.csv\nb.csv\nc.csv', expected: '.csv: 3' },
          { input: '2\nMakefile\nLICENSE', expected: '(none): 2', hidden: true },
        ],
        hints: [
          'Make the type of each name with `PurePosixPath(name).suffix or "(none)"`. An empty text counts as false, so `or` picks `(none)`.',
          'A `Counter` of those types gives you the counts.',
          'Loop over `sorted(counter)` and print `f"{kind}: {counter[kind]}"`.',
        ],
      },
      {
        id: 'py55-similar',
        title: 'How alike are two sentences?',
        prompt: 'Read two sentences. Treat each as a SET of lower-case words. Print `Similarity:` followed by the number of shared words divided by the number of different words in both together (the Jaccard similarity), with 2 decimal places.',
        starter: 'a = input()\nb = input()\n# make a set of lower-case words for each sentence, then compare them\nprint("Similarity: ?")\n',
        sampleInput: 'cheap sugar in kampala\nsugar is cheap in jinja',
        usesInput: true,
        tests: [
          { input: 'cheap sugar in kampala\nsugar is cheap in jinja', expected: 'Similarity: 0.50' },
          { input: 'fresh matooke today\nsugar is cheap in jinja', expected: 'Similarity: 0.00' },
          { input: 'Sugar sugar SUGAR\nsugar', expected: 'Similarity: 1.00', hidden: true },
          { input: 'tea and rice\nrice and beans', expected: 'Similarity: 0.50', hidden: true },
        ],
        hints: [
          'A set removes repeats, and `text.lower().split()` gives the words. Make one set for each sentence.',
          'Shared words are `wa & wb`, and all different words together are `wa | wb`.',
          'Divide `len(wa & wb)` by `len(wa | wb)` and print it with `:.2f`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 57
  {
    id: 'py-capstone',
    level: LEVEL,
    minutes: 50,
    title: 'Final capstone: the Duuka business system',
    summary: 'A complete small business system: stock, cash and credit sales, payments, commands, JSON export and tests',
    blocks: [
      {
        t: 'story',
        title: 'Everything you have learned, in one shop',
        text: 'This is the last project, and the biggest. Mama Rose’s shop now sells for cash and on credit. She needs one system that keeps the stock, records every sale, remembers who owes what, takes payments, tells her the day’s totals, and can export everything so another program can use it.\n\nNo new Python is taught here. Everything is something you already know: classes and custom errors (Level 6), SQLite with transactions (Lesson 49), decorators that register commands (Lesson 36 and 54), JSON (Lesson 50), and tests (Lesson 52). Read it as a professional would read a colleague’s code. If a part looks unfamiliar, the lesson it came from is named.',
      },
      { t: 'h', text: 'Step 1: the Business class' },
      { t: 'p', text: 'Three tables: products, customers and sales. A sale touches several tables, so it runs inside ONE transaction: either the stock goes down, the sale is written and the customer’s debt is updated, or none of it happens. A family of errors (Lesson 37) describes everything that can go wrong. Study `sell` and `pay` closely.' },
      {
        t: 'project',
        title: 'The business and its rules',
        text: 'Cash sales have no customer; credit sales name one. Notice how every rule is checked BEFORE any data is changed, and how `with self.con:` rolls everything back if a rule fails halfway.',
        code: `${businessCode(SELL_REAL)}\n\nshop = Business()\nshop.add_product("sugar", 50, 4500)\nshop.add_product("rice", 30, 3000)\nprint(shop.sell("sugar", 2))\nprint(shop.sell("rice", 5, "Amina"))\nprint(shop.pay("Amina", 5000))\nprint(shop.summary())\ntry:\n    shop.sell("sugar", 100)\nexcept OutOfStock as e:\n    print("Refused:", e)\nprint(shop.product("sugar"))\n`,
        output: "9000\n15000\n10000\n{'cash_sales': 9000, 'credit_sales': 15000, 'outstanding': 10000}\nRefused: only 48 sugar left\n(48, 4500)",
      },
      { t: 'h', text: 'Step 2: commands, registered with a decorator' },
      { t: 'p', text: 'A `@command("sell")` decorator writes each command function into a dictionary, the same trick as the routes in Lesson 54. `run_line` looks the command up, runs it, and turns every business error into a friendly line. A mistake in the typed command can never crash the program.' },
      {
        t: 'project',
        title: 'The command line of the shop',
        text: 'We feed the system a day’s worth of commands, including several that are deliberately wrong: too much stock, an unknown item, an unknown customer, a bad number, a command that does not exist.',
        code: `${businessCode(SELL_REAL)}\n\n${COMMANDS_CODE}\n\nSCRIPT = """${SCRIPT}"""\n\nshop = Business()\nfor line in SCRIPT.splitlines():\n    print(run_line(shop, line))\n`,
        output: SCRIPT_OUTPUT,
      },
      { t: 'h', text: 'Step 3: export, and prove it with tests' },
      { t: 'p', text: 'The export turns the whole business into JSON text that any other program can read (Lesson 50). The tests then check the rules that matter most, including that a failed sale leaves the stock untouched.' },
      {
        t: 'project',
        title: 'Export and tests',
        text: 'We export, read the JSON back, and then check the rules with asserts. If anyone changes the system next month and breaks a rule, the tests say so at once.',
        code: `${businessCode(SELL_REAL)}\n\n${COMMANDS_CODE}\n\nshop = Business()\nfor line in ["add sugar 50 4500", "add rice 30 3000", "sell sugar 2", "sell rice 5 credit Amina"]:\n    run_line(shop, line)\n\ndata = json.loads(run_line(shop, "export"))\nprint([p["item"] for p in data["products"]])\nprint(data["customers"])\nprint(data["summary"]["outstanding"])\n\nassert run_line(shop, "sell sugar 100") == "Error: only 48 sugar left"\nassert shop.product("sugar") == (48, 4500)\nassert run_line(shop, "sell sugar 0") == "Error: quantity must be positive"\nassert run_line(shop, "pay Amina 99999") == "Error: Amina owes only 15000"\nassert run_line(shop, "pay Amina 15000") == "Amina now owes 0"\nassert shop.summary()["outstanding"] == 0\nassert run_line(shop, "dance") == "Error: unknown command"\nprint("All tests passed")\n`,
        output: "['rice', 'sugar']\n[{'name': 'Amina', 'owed': 15000}]\n15000\nAll tests passed",
      },
      { t: 'h', text: 'What you have built' },
      {
        t: 'list',
        items: [
          'Level 6 skills: custom errors, decorators, special structure, clean code.',
          'Level 7 skills: data you can trust and reason about.',
          'Level 8 skills: a database, a command interface, logging ideas and tests.',
          'Level 9 skills: JSON export, packaging ideas and a plan for what comes next.',
          'A complete, tested, understandable system that a real shop could use.',
        ],
      },
      {
        t: 'recap',
        items: ['Put each business rule in one place, check it BEFORE changing data, and wrap multi-table changes in one transaction.', 'A family of custom errors lets one `except` produce friendly messages.', 'A decorator-built registry makes it easy to add a new command.', 'Export to JSON so other programs can use your data, and write tests for the rules that matter.', 'You started with `print("Hello")`. You now build, test and explain real software. Keep building for the people around you.'],
        memory: 'Check first, change together, explain clearly, test the rules.',
      },
    ],
    exercises: [
      {
        id: 'py56-capstone',
        title: 'Write the sale',
        prompt: 'Everything in the business system works except `Business.sell`, which is the heart of it. Write it, following the numbered steps in the comments. A sale with no customer is a cash sale. A sale with a customer name is on credit: that customer’s debt goes up by the total (create the customer if they are new). Everything must happen inside one `with self.con:` block, so a refused sale changes nothing. The program reads `n` commands and prints what the business answers.',
        starter: `${businessCode(SELL_STUB)}\n\n${COMMANDS_CODE}\n\nn = int(input())\nshop = Business()\nfor i in range(n):\n    print(run_line(shop, input()))\n`,
        sampleInput: `12\n${SCRIPT}`,
        usesInput: true,
        tests: [
          { input: `12\n${SCRIPT}`, expected: SCRIPT_OUTPUT, name: 'A busy day' },
          { input: '4\nadd tea 10 500\nsell tea 3 credit Mary\nsell tea 8\nsummary', expected: 'Added 10 x tea\nSold 3 x tea on credit to Mary: 1,500\nError: only 7 tea left\nCash 0 | Credit 1,500 | Owed 1,500', name: 'Credit then too much' },
          { input: '5\nadd oil 5 12000\nsell oil 2 credit Jo\nsell oil 3 credit Jo\nsell oil 1\nsummary', expected: 'Added 5 x oil\nSold 2 x oil on credit to Jo: 24,000\nSold 3 x oil on credit to Jo: 36,000\nError: only 0 oil left\nCash 0 | Credit 60,000 | Owed 60,000', hidden: true },
          { input: '3\nadd salt 4 800\nsell salt 0\nsell salt 2 cash Bob', expected: 'Added 4 x salt\nError: quantity must be positive\nError: usage: sell ITEM QTY [credit NAME]', hidden: true },
        ],
        hints: [
          'Start with the guard: `if qty <= 0:` raise `BusinessError("quantity must be positive")`. Then open `with self.con:`.',
          'Inside the block: `have, price = self.product(item)` (it raises `UnknownItem` for you), refuse with `OutOfStock(f"only {have} {item} left")` when `have < qty`, then `total = qty * price`.',
          'Then an UPDATE on `products`, an INSERT into `sales` (with `customer`, which may be `None`), and for a credit sale `INSERT INTO customers VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET owed = owed + excluded.owed`. Finally `return total`. The project’s Step 1 shows the full method.',
        ],
      },
    ],
  },
];

export const level9bSolution = { SELL_REAL, businessCode, COMMANDS_CODE };
