// Python, Level 8 (Building real products), part A: modules and packages, command-line apps, SQLite from Python.
// Lessons 47 to 49. Exercise ids use the lesson number minus one (py46-, py47-, py48-).
// The browser has no file manager, so lessons write module files with Python and then import them.
// argparse exits the program on bad input (SystemExit), so every example here catches it.

const LEVEL = 'Level 8: Building real products';

const MAKE_MODULE = `import importlib
import os
import sys

def make_module(name, text):
    """Write name.py, forget any old copy, and get Python ready to import it."""
    sys.modules.pop(name, None)
    with open(name + ".py", "w") as f:
        f.write(text)
    importlib.invalidate_caches()`;

const MAKE_PACKAGE = `import importlib
import os
import sys

def make_package(name, files):
    """Write a folder of files that Python can import as a package."""
    for old in [k for k in sys.modules if k == name or k.startswith(name + ".")]:
        del sys.modules[old]
    os.makedirs(name, exist_ok=True)
    for filename, text in files.items():
        with open(name + "/" + filename, "w") as f:
            f.write(text)
    importlib.invalidate_caches()`;

const SAFE_PARSE = `def safe_parse(parser, argv):
    """Return (args, "") or (None, the error message). Never exits the program."""
    errors = io.StringIO()
    with contextlib.redirect_stderr(errors):
        try:
            return parser.parse_args(argv), ""
        except SystemExit:
            return None, errors.getvalue().strip().splitlines()[-1]`;

const STOCK_HEAD = `class OutOfStock(Exception):
    pass

class UnknownItem(Exception):
    pass

class Stock:
    def __init__(self):
        self.con = sqlite3.connect(":memory:")
        self.con.execute("CREATE TABLE stock (item TEXT PRIMARY KEY, qty INTEGER NOT NULL, price INTEGER NOT NULL)")

    def add(self, item, qty, price):
        with self.con:
            self.con.execute(
                "INSERT INTO stock VALUES (?, ?, ?) "
                "ON CONFLICT(item) DO UPDATE SET qty = qty + excluded.qty, price = excluded.price",
                (item, qty, price),
            )

    def qty(self, item):
        row = self.con.execute("SELECT qty FROM stock WHERE item = ?", (item,)).fetchone()
        if row is None:
            raise UnknownItem(item)
        return row[0]`;

const STOCK_SELL = `
    def sell(self, item, qty):
        with self.con:
            have = self.qty(item)
            if have < qty:
                raise OutOfStock(have)
            self.con.execute("UPDATE stock SET qty = qty - ? WHERE item = ?", (qty, item))`;

const STOCK_LOW = `
    def low_items(self, limit):
        rows = self.con.execute("SELECT item FROM stock WHERE qty < ? ORDER BY item", (limit,))
        return [r[0] for r in rows]`;

const STOCK_SELL_STUB = `
    def sell(self, item, qty):
        # check the item exists and there is enough, then take qty away (inside "with self.con:")
        # raise OutOfStock(how_many_are_left) when there is not enough
        pass`;

const STOCK_LOW_STUB = `
    def low_items(self, limit):
        # return the names of items with qty below limit, in alphabetical order
        return []`;

export const level8a = [
  // ------------------------------------------------------------------ 47
  {
    id: 'py-packages',
    level: LEVEL,
    minutes: 22,
    title: 'Splitting a program into rooms: modules and packages',
    summary: 'Modules, import styles, packages, __init__.py and the main guard',
    blocks: [
      {
        t: 'story',
        title: 'The 1,500-line file',
        text: 'Mama Rose’s shop program has grown. The till, the stock, the customers’ credit and the reports all live in ONE file with 1,500 lines. To change the VAT rule her nephew scrolls for ten minutes. When two people edit the file on the same day, their work collides.\n\nA real shop is not one giant room. It has a stock room, a till, an office. Python lets you do the same: a MODULE is one file with related code, and a PACKAGE is a folder of modules. Every Python project you will ever read is built from them.',
      },
      { t: 'p', text: 'The browser has no file manager, so in this lesson Python will write the module files itself, and then we import them exactly as you would on a computer. The little helper below does the writing. You can ignore how it works for now: it only writes `name.py` and makes Python ready to import it.' },
      {
        t: 'code',
        text: `${MAKE_MODULE}\n\nmake_module("pricing", """VAT_PERCENT = 18\n\ndef with_vat(price):\n    return price + price * VAT_PERCENT // 100\n""")\n\nimport pricing\n\nprint(pricing.with_vat(1000))\nprint(pricing.VAT_PERCENT)`,
        output: '1180\n18',
      },
      { t: 'p', text: 'The file `pricing.py` is a module. `import pricing` runs the file once and gives you its names, reached with a dot: `pricing.with_vat`. There are three common ways to import:' },
      {
        t: 'code',
        text: `${MAKE_MODULE}\n\nmake_module("pricing", """def with_vat(price):\n    return price * 118 // 100\n""")\n\nimport pricing\nfrom pricing import with_vat\nimport pricing as p\n\nprint(pricing.with_vat(1000))\nprint(with_vat(1000))\nprint(p.with_vat(1000))`,
        output: '1180\n1180\n1180',
      },
      {
        t: 'list',
        items: [
          '`import pricing` keeps names tidy: you always see where `with_vat` comes from.',
          '`from pricing import with_vat` brings in just that one name.',
          '`import pricing as p` gives the module a shorter nickname.',
          'Avoid `from pricing import *`. It dumps every name into your file and hides where things come from.',
        ],
      },
      { t: 'h', text: 'The main guard: run it, or reuse it' },
      { t: 'p', text: 'Python sets a special name, `__name__`, inside every file. When a file is IMPORTED, its `__name__` is the file’s name. When it is RUN directly, its `__name__` is `"__main__"`. So you can write code that only runs when the file is started directly, and stays quiet when someone imports it.' },
      {
        t: 'code',
        text: `${MAKE_MODULE}\nimport runpy\n\nmake_module("greeter", """print("name is", __name__)\n\ndef greet(name):\n    return "Welcome, " + name\n\nif __name__ == "__main__":\n    print(greet("test run"))\n""")\n\nimport greeter\nprint("imported")\nrunpy.run_path("greeter.py", run_name="__main__")`,
        output: 'name is greeter\nimported\nname is __main__\nWelcome, test run',
      },
      { t: 'tip', text: 'On your own computer you put `if __name__ == "__main__":` at the bottom of your program file. The editor in this app starts your code in a slightly different way, so we practise the guard inside module files like the one above.' },
      {
        t: 'quiz',
        question: 'A module is imported twice in the same program. How many times does its top-level code run?',
        options: ['Once: Python remembers modules it already loaded', 'Twice, once per import', 'Never, imports only copy names'],
        answer: 0,
        explain: 'The first import runs the file and Python keeps the result. Every later import just reuses it. That is why a module’s top-level code should set things up, not do work.',
      },
      { t: 'h', text: 'Packages: a folder of modules' },
      { t: 'p', text: 'A package is a folder that contains modules and a file called `__init__.py`. That file runs when the package is imported, and it can pull in the most useful names so that users have a short way to reach them. Inside a package, modules reach their neighbours with a dot: `from .money import fmt` means “from the module `money` in this same package”.' },
      {
        t: 'code',
        text: `${MAKE_PACKAGE}\n\nmake_package("duukashop", {\n    "__init__.py": """from .money import fmt\n""",\n    "money.py": """def fmt(amount):\n    return f"UGX {amount:,}"\n""",\n    "till.py": """from .money import fmt\n\ndef receipt_line(item, qty, price):\n    return f"{item} x{qty} = {fmt(qty * price)}"\n""",\n})\n\nfrom duukashop import fmt\nfrom duukashop.till import receipt_line\n\nprint(fmt(4500))\nprint(receipt_line("sugar", 3, 4500))`,
        output: 'UGX 4,500\nsugar x3 = UGX 13,500',
      },
      { t: 'p', text: 'This is how a real project is laid out. Each file has one clear job:' },
      {
        t: 'list',
        items: [
          '`duuka/__init__.py` marks the folder as a package.',
          '`duuka/models.py` the data: Customer, Product.',
          '`duuka/storage.py` saving and loading.',
          '`duuka/cli.py` the commands the user types.',
          '`tests/` the tests, outside the package.',
          '`README.md` how to install and run it.',
        ],
      },
      { t: 'analogy', text: 'A package is a shop building. Each module is a room: the till room, the stock room, the office. `__init__.py` is the front door with the sign that tells visitors which rooms matter most.' },
      {
        t: 'fill',
        prompt: 'Import the right name from the module.',
        template: `${MAKE_MODULE}\n\nmake_module("pricing_c", """def with_vat(price):\n    return price * 118 // 100\n""")\n\nfrom pricing_c import ___\n\nprint(with_vat(1000))`,
        blanks: [{ options: ['with_vat', 'vat', 'add_vat'], answer: 'with_vat' }],
        output: '1180',
      },
      {
        t: 'bug',
        code: `${MAKE_MODULE}\n\nmake_module("pricing_b", """def with_vat(price):\n    return price * 118 // 100\n""")\n\nfrom pricing_b import with_vta\n\nprint(with_vta(1000))`,
        question: 'This stops with “cannot import name”. Why?',
        options: ['The name in the import is spelled differently from the one in the module', 'Modules cannot contain functions', 'The file must be called main.py'],
        answer: 0,
        explain: 'The module defines with_vat, but the import asks for with_vta. Import names must match exactly.',
        fixed: `${MAKE_MODULE}\n\nmake_module("pricing_b", """def with_vat(price):\n    return price * 118 // 100\n""")\n\nfrom pricing_b import with_vat\n\nprint(with_vat(1000))`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `${MAKE_MODULE}\n\nmake_module("tools_a", """print("Testing the tools...")\n\ndef double(x):\n    return x * 2\n""")\n\nimport tools_a\nprint(tools_a.double(4))`,
            why: 'The module does work at the top level (a test print), so merely importing it makes noise. Put such code under `if __name__ == "__main__":`.',
            right: `${MAKE_MODULE}\n\nmake_module("tools_a", """def double(x):\n    return x * 2\n\nif __name__ == "__main__":\n    print("Testing the tools...")\n""")\n\nimport tools_a\nprint(tools_a.double(4))`,
            logic: true,
          },
          {
            wrong: `${MAKE_MODULE}\n\nmake_module("pricing_d", """def with_vat(price):\n    return price * 118 // 100\n""")\n\nimport pricing_d\n\npricing_d = 1000\nprint(pricing_d.with_vat(1000))`,
            why: 'The variable `pricing_d` replaced the module, so the name now holds the number 1000. Never use a module’s name for a variable.',
            right: `${MAKE_MODULE}\n\nmake_module("pricing_d", """def with_vat(price):\n    return price * 118 // 100\n""")\n\nimport pricing_d\n\nprice = 1000\nprint(pricing_d.with_vat(price))`,
          },
          {
            wrong: `${MAKE_MODULE}\n\nmake_module("ping", """import pong\n\ndef a():\n    return "a"\n""")\nmake_module("pong", """import ping\n\nx = ping.a()\n""")\n\nimport ping`,
            why: 'A circular import: ping needs pong, and pong needs ping before ping has finished loading. Move the shared code into a third module, or let one side stop importing the other.',
            right: `${MAKE_MODULE}\n\nmake_module("ping", """def a():\n    return "a"\n""")\nmake_module("pong", """import ping\n\nx = ping.a()\n""")\n\nimport pong\nprint(pong.x)`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['A module is one `.py` file. `import name` runs it once and gives you its names.', '`import m`, `from m import name` and `import m as nick` are the three import styles. Avoid `import *`.', '`if __name__ == "__main__":` runs code only when the file is started directly, not when it is imported.', 'A package is a folder with `__init__.py`. Modules inside it import each other with `from .other import name`.', 'Give every file one job, and never let two modules import each other.'],
        memory: 'Module = a room. Package = the building. Main guard = a door that only opens for the owner.',
      },
    ],
    exercises: [
      {
        id: 'py46-package',
        title: 'Use the till package',
        prompt: 'A package called `tillkit` has been written for you. It has `tillkit.money.fmt(amount)` (formats money like `UGX 13,500`) and `tillkit.tools.line_total(qty, price)`. Import those two functions, read a quantity and a price, and print the formatted line total.',
        starter: `${MAKE_PACKAGE}\n\nmake_package("tillkit", {\n    "__init__.py": "",\n    "money.py": """def fmt(amount):\n    return f"UGX {amount:,}"\n""",\n    "tools.py": """def line_total(qty, price):\n    return qty * price\n""",\n})\n\n# import fmt and line_total from the package here\n\nqty = int(input())\nprice = int(input())\n# print the formatted total\n`,
        sampleInput: '3\n4500',
        usesInput: true,
        tests: [
          { input: '3\n4500', expected: 'UGX 13,500' },
          { input: '10\n800', expected: 'UGX 8,000' },
          { input: '1\n1250000', expected: 'UGX 1,250,000', hidden: true },
        ],
        hints: [
          'Each function lives in a different module of the package, so you need two import lines.',
          '`from tillkit.money import fmt` and `from tillkit.tools import line_total`.',
          'Then `print(fmt(line_total(qty, price)))`.',
        ],
      },
      {
        id: 'py46-guard',
        title: 'Keep the module quiet',
        prompt: 'The module text below prints a test line every time it is imported, so the program prints `Welcome, test` before the real greeting. Fix the module text with a main guard so that importing it prints nothing, and only `Welcome, NAME` appears.',
        starter: `${MAKE_MODULE}\n\nmake_module("greeter_ex", """def greet(name):\n    return "Welcome, " + name\n\nprint(greet("test"))\n""")\n\nimport greeter_ex\n\nprint(greeter_ex.greet(input()))\n`,
        sampleInput: 'Amina',
        usesInput: true,
        tests: [
          { input: 'Amina', expected: 'Welcome, Amina' },
          { input: 'Okello', expected: 'Welcome, Okello' },
          { input: 'Zed', expected: 'Welcome, Zed', hidden: true },
        ],
        hints: [
          'The line `print(greet("test"))` runs at the top level of the module, so it runs on import.',
          'Put it under `if __name__ == "__main__":` inside the module text.',
          'The last lines of the module text should be `if __name__ == "__main__":` and then, indented by 4 spaces, `print(greet("test"))`.',
        ],
      },
      {
        id: 'py46-writemod',
        title: 'Write the taxes module',
        prompt: 'Write the text of a module called `taxes` that has a function `with_vat(price, percent=18)`. It returns the price plus that percent (whole-number maths: `price + price * percent // 100`). The program imports it and prints the price with the normal 18% and then with 10%.',
        starter: `${MAKE_MODULE}\n\nmake_module("taxes", """# write with_vat(price, percent=18) here\n""")\n\nimport taxes\n\nprice = int(input())\nprint(taxes.with_vat(price))\nprint(taxes.with_vat(price, 10))\n`,
        sampleInput: '1000',
        usesInput: true,
        tests: [
          { input: '1000', expected: '1180\n1100' },
          { input: '5000', expected: '5900\n5500' },
          { input: '0', expected: '0\n0', hidden: true },
        ],
        hints: [
          'The text between the triple quotes is a normal Python file. Write a normal function in it.',
          'The second argument needs a default value: `def with_vat(price, percent=18):`.',
          'Body: `return price + price * percent // 100`. Remember to indent it by 4 spaces inside the text.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 48
  {
    id: 'py-cli',
    level: LEVEL,
    minutes: 22,
    title: 'Programs people type: command-line apps',
    summary: 'argparse: arguments, options, flags, subcommands, main(), config and menus',
    blocks: [
      {
        t: 'story',
        title: 'Mama Rose’s nephew and the black screen',
        text: 'Mama Rose’s nephew works at a software company in the city. He does not click buttons. He types short commands into a black window: `git commit`, `pip install`, `python report.py --week 3`. His fingers fly, and he can even run the same command 100 times in a row with a script.\n\nA command-line program receives the words typed after its name, understands them, and does the job. Python’s `argparse` module does the understanding for you: it reads the words, checks them, converts them to numbers, and writes a helpful error when something is wrong.',
      },
      { t: 'p', text: 'On a real computer, the words after the program name arrive in a list called `sys.argv`, and `parser.parse_args()` reads it for you. In this app there is no command window, so we hand `parse_args` the list of words ourselves. Everything else works exactly the same.' },
      {
        t: 'code',
        text: `import argparse\n\nparser = argparse.ArgumentParser(prog="duuka")\nparser.add_argument("item")\nparser.add_argument("--qty", type=int, default=1)\nparser.add_argument("--vat", action="store_true")\n\nargs = parser.parse_args(["sugar", "--qty", "3", "--vat"])\nprint(args.item, args.qty, args.vat)\nargs = parser.parse_args(["rice"])\nprint(args.item, args.qty, args.vat)`,
        output: 'sugar 3 True\nrice 1 False',
      },
      {
        t: 'list',
        items: [
          '`"item"` (no dashes) is a positional argument: it must be given, in order.',
          '`"--qty"` is an option with a value. `type=int` converts the text to a number. `default=1` is used when it is left out.',
          '`action="store_true"` makes a flag: `--vat` present means True, absent means False.',
          '`choices=[...]` only accepts the listed words. `"-p", "--pay"` gives an option a short and a long name.',
        ],
      },
      {
        t: 'code',
        text: `import argparse\n\nparser = argparse.ArgumentParser(prog="duuka")\nparser.add_argument("item")\nparser.add_argument("-p", "--pay", choices=["cash", "momo"], default="cash")\n\nprint(parser.parse_args(["tea", "-p", "momo"]).pay)\nprint(parser.parse_args(["tea"]).pay)`,
        output: 'momo\ncash',
      },
      { t: 'h', text: 'Subcommands: one program, many jobs' },
      { t: 'p', text: 'Tools like `git` have subcommands: `git add`, `git commit`. Each one has its own arguments. `add_subparsers` gives you the same. Use `dest="command"` so you can see which one was chosen.' },
      {
        t: 'code',
        text: `import argparse\n\nparser = argparse.ArgumentParser(prog="duuka")\nsub = parser.add_subparsers(dest="command", required=True)\n\nsell = sub.add_parser("sell")\nsell.add_argument("item")\nsell.add_argument("--qty", type=int, default=1)\nsub.add_parser("report")\n\nargs = parser.parse_args(["sell", "sugar", "--qty", "3"])\nprint(args.command, args.item, args.qty)\nargs = parser.parse_args(["report"])\nprint(args.command)`,
        output: 'sell sugar 3\nreport',
      },
      { t: 'h', text: 'When the words are wrong' },
      { t: 'p', text: 'If the user types something that does not fit, `argparse` prints a clear message and ENDS the program (it raises `SystemExit` with code 2). That is right for a real tool. But a program that wants to carry on, or a test, can catch it. This small helper does that, and keeps the error message so we can show it:' },
      {
        t: 'code',
        text: `import argparse\nimport contextlib\nimport io\n\n${SAFE_PARSE}\n\nparser = argparse.ArgumentParser(prog="duuka")\nparser.add_argument("item")\nparser.add_argument("--qty", type=int, default=1)\n\nargs, problem = safe_parse(parser, ["sugar", "--qty", "lots"])\nprint(args)\nprint(problem)`,
        output: "None\nduuka: error: argument --qty: invalid int value: 'lots'",
      },
      { t: 'tip', text: 'Never let an uncaught `SystemExit` happen in code you want to keep running. In a real tool you simply let it exit, which is what users expect.' },
      { t: 'h', text: 'A main() you can test' },
      { t: 'p', text: 'Put the real work in a function called `main(argv=None)`. A real program then ends with `sys.exit(main())`. Tests can call `main([...])` with any words they like, because the function never needs a real command window.' },
      {
        t: 'code',
        text: `import argparse\n\nPRICES = {"sugar": 4500, "rice": 3000}\n\ndef main(argv=None):\n    parser = argparse.ArgumentParser(prog="duuka")\n    parser.add_argument("item", choices=PRICES)\n    parser.add_argument("--qty", type=int, default=1)\n    args = parser.parse_args(argv)\n    print(f"Total: {PRICES[args.item] * args.qty:,}")\n    return 0\n\nmain(["sugar", "--qty", "2"])\nmain(["rice"])`,
        output: 'Total: 9,000\nTotal: 3,000',
      },
      { t: 'h', text: 'Settings: defaults with an override' },
      { t: 'p', text: 'Real tools have settings that users can change: the VAT rate, the currency, the shop name. Keep sensible defaults in a dictionary, and let a settings file (JSON) or an environment variable override them. `{**DEFAULTS, **user}` merges two dictionaries, with the second one winning.' },
      {
        t: 'code',
        text: `import json\nimport os\n\nDEFAULTS = {"vat_percent": 18, "currency": "UGX"}\nuser = json.loads('{"vat_percent": 10}')\nconfig = {**DEFAULTS, **user}\nprint(config)\nprint(int(os.environ.get("DUUKA_VAT", "18")))`,
        output: "{'vat_percent': 10, 'currency': 'UGX'}\n18",
      },
      { t: 'h', text: 'Or a menu, when the user is a person' },
      { t: 'p', text: 'A menu asks the user what to do, again and again, until they choose to quit. It suits shop assistants who do not like typing options.' },
      {
        t: 'try',
        code: `while True:\n    print("1) sell  2) report  0) quit")\n    choice = input()\n    if choice == "1":\n        print("Selling...")\n    elif choice == "2":\n        print("Report...")\n    elif choice == "0":\n        print("Goodbye")\n        break\n    else:\n        print("Please choose 1, 2 or 0")\n`,
        stdin: '1\n9\n0',
        output: '1) sell  2) report  0) quit\nSelling...\n1) sell  2) report  0) quit\nPlease choose 1, 2 or 0\n1) sell  2) report  0) quit\nGoodbye',
      },
      {
        t: 'predict',
        code: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("item")\nparser.add_argument("--qty", type=int, default=1)\n\nargs = parser.parse_args(["rice"])\nprint(args.qty + 1)`,
        question: 'What does this print?',
        options: ['2', '11', 'an error'],
        answer: 0,
        explain: '--qty was not given, so the default 1 is used. Because of type=int it is a number, and 1 + 1 is 2.',
      },
      {
        t: 'fill',
        prompt: 'Make --qty arrive as a whole number, so that doubling it gives 6.',
        template: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--qty", type=___, default=1)\n\nargs = parser.parse_args(["--qty", "3"])\nprint(args.qty * 2)`,
        blanks: [{ options: ['int', 'str', 'number'], answer: 'int' }],
        output: '6',
      },
      {
        t: 'bug',
        code: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--qty", type=int, default=1)\n\nargs = parser.parse_args(["--qty", "3"])\nprint(args.quantity)`,
        question: 'This crashes with “no attribute quantity”. Why?',
        options: ['The attribute is named after the option: args.qty', 'type=int cannot be used with --qty', 'parse_args needs more words'],
        answer: 0,
        explain: 'The result is named after the option you declared. --qty becomes args.qty. A different spelling does not exist.',
        fixed: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--qty", type=int, default=1)\n\nargs = parser.parse_args(["--qty", "3"])\nprint(args.qty)`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--qty", default=1)\n\nargs = parser.parse_args(["--qty", "3"])\nprint(args.qty * 2)`,
            why: 'Without `type=int` the value stays text, so `"3" * 2` gives `33`. Always say what type you expect.',
            right: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--qty", type=int, default=1)\n\nargs = parser.parse_args(["--qty", "3"])\nprint(args.qty * 2)`,
            logic: true,
          },
          {
            wrong: `import argparse\n\nparser = argparse.ArgumentParser(prog="duuka")\nsub = parser.add_subparsers()\nsub.add_parser("report")\n\nargs = parser.parse_args(["report"])\nprint(args.command)`,
            why: 'Without `dest="command"` the chosen subcommand is not stored anywhere, so `args.command` does not exist.',
            right: `import argparse\n\nparser = argparse.ArgumentParser(prog="duuka")\nsub = parser.add_subparsers(dest="command")\nsub.add_parser("report")\n\nargs = parser.parse_args(["report"])\nprint(args.command)`,
          },
          {
            wrong: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--vat", action="store_true", type=bool)`,
            why: 'A flag is just on or off, so it has no type. Remove `type=bool`.',
            right: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--vat", action="store_true")\nprint(parser.parse_args(["--vat"]).vat)`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['`argparse` reads the words after the program name, converts them and checks them.', 'Positional arguments are required. `--option value` is optional. `action="store_true"` makes a flag.', '`type=int` turns text into a number, `choices=[...]` limits the answers, `default=...` fills in blanks.', 'Subcommands (`add_subparsers(dest="command")`) give one program many jobs.', 'Bad input makes argparse exit with `SystemExit`. Catch it when you need the program to keep going.', 'Put the work in `main(argv=None)`, keep settings in a defaults dictionary, or offer a menu for non-typists.'],
        memory: 'Words in, checked values out. main() makes it testable.',
      },
    ],
    exercises: [
      {
        id: 'py47-parse',
        title: 'Teach the parser',
        prompt: 'The parser only knows the `item` so far. Add two more arguments: `--qty` (a whole number, default 1) and `--vat` (a flag). The program reads one command line and prints `Item:`, `Qty:` and `VAT:` (yes or no). If the words do not fit, it prints `Bad command`.',
        starter: `import argparse\nimport contextlib\nimport io\n\n${SAFE_PARSE}\n\nparser = argparse.ArgumentParser(prog="duuka")\nparser.add_argument("item")\n# add --qty (whole number, default 1) and --vat (a flag) here\n\nargs, problem = safe_parse(parser, input().split())\nif args is None:\n    print("Bad command")\nelse:\n    print("Item:", args.item)\n    print("Qty:", args.qty)\n    print("VAT:", "yes" if args.vat else "no")\n`,
        sampleInput: 'sugar --qty 3 --vat',
        usesInput: true,
        tests: [
          { input: 'sugar --qty 3 --vat', expected: 'Item: sugar\nQty: 3\nVAT: yes' },
          { input: 'rice', expected: 'Item: rice\nQty: 1\nVAT: no' },
          { input: 'tea --qty lots', expected: 'Bad command' },
          { input: 'oil --vat', expected: 'Item: oil\nQty: 1\nVAT: yes', hidden: true },
          { input: '--qty 2', expected: 'Bad command', hidden: true },
        ],
        hints: [
          'You need two more `parser.add_argument(...)` lines, after the one for `item`.',
          'For the quantity: `parser.add_argument("--qty", type=int, default=1)`.',
          'For the flag: `parser.add_argument("--vat", action="store_true")`.',
        ],
      },
      {
        id: 'py47-subcommands',
        title: 'Shopping cart commands',
        prompt: 'The parser understands `add ITEM [--qty N]` and `total`. Read `n`, then `n` command lines. For `add` of a known item (see `PRICES`) put it in the cart and print `Added N x ITEM`. For an item that is not in `PRICES` print `Unknown item: NAME`. For `total` print `Total: X` with commas (the sum of quantity times price for everything in the cart). Words that do not fit print `Bad command` (already done for you).',
        starter: `import argparse\nimport contextlib\nimport io\n\n${SAFE_PARSE}\n\nparser = argparse.ArgumentParser(prog="duuka")\nsub = parser.add_subparsers(dest="command", required=True)\nadd = sub.add_parser("add")\nadd.add_argument("item")\nadd.add_argument("--qty", type=int, default=1)\nsub.add_parser("total")\n\nPRICES = {"sugar": 4500, "rice": 3000, "tea": 500}\ncart = {}\n\nn = int(input())\nfor i in range(n):\n    args, problem = safe_parse(parser, input().split())\n    if args is None:\n        print("Bad command")\n        continue\n    # handle the add and total commands\n`,
        sampleInput: '5\nadd sugar --qty 2\nadd rice\nadd mango\ntotal\ndance',
        usesInput: true,
        tests: [
          { input: '5\nadd sugar --qty 2\nadd rice\nadd mango\ntotal\ndance', expected: 'Added 2 x sugar\nAdded 1 x rice\nUnknown item: mango\nTotal: 12,000\nBad command' },
          { input: '3\nadd tea --qty 4\nadd tea\ntotal', expected: 'Added 4 x tea\nAdded 1 x tea\nTotal: 2,500' },
          { input: '1\ntotal', expected: 'Total: 0', hidden: true },
        ],
        hints: [
          '`args.command` tells you which subcommand was typed: `"add"` or `"total"`.',
          'For `add`: if `args.item` is not in `PRICES`, print the unknown message. Otherwise `cart[args.item] = cart.get(args.item, 0) + args.qty` and print the added line.',
          'For `total`: `sum(PRICES[item] * qty for item, qty in cart.items())`, printed with `{total:,}`.',
        ],
      },
      {
        id: 'py47-config',
        title: 'Defaults and overrides',
        prompt: 'The shop has default settings. Read one line of JSON with the user’s own settings and merge them over the defaults (the user’s values win). Print the shop name, the currency and the VAT percent, separated by spaces.',
        starter: 'import json\n\nDEFAULTS = {"vat_percent": 18, "currency": "UGX", "shop": "Duuka"}\n\nuser = json.loads(input())\nconfig = DEFAULTS  # merge the user\'s settings over the defaults\nprint(config["shop"], config["currency"], config["vat_percent"])\n',
        sampleInput: '{"vat_percent": 10}',
        usesInput: true,
        tests: [
          { input: '{}', expected: 'Duuka UGX 18' },
          { input: '{"vat_percent": 10}', expected: 'Duuka UGX 10' },
          { input: '{"shop": "Mama Rose", "currency": "USh"}', expected: 'Mama Rose USh 18', hidden: true },
        ],
        hints: [
          'Two dictionaries can be joined into a new one, and the later one wins when a key is in both.',
          'Use `{**DEFAULTS, **user}`.',
          'Set `config = {**DEFAULTS, **user}` and leave the print line as it is.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 49
  {
    id: 'py-sqlite',
    level: LEVEL,
    minutes: 24,
    title: 'A real memory for your program: SQLite',
    summary: 'sqlite3: tables, safe queries with placeholders, transactions and a Stock class',
    blocks: [
      {
        t: 'story',
        title: 'From exercise book to database',
        text: 'Mama Rose’s stock list has grown to 3,000 items. In a CSV file she must read every line to find the price of sugar, and if the power goes off while she is saving, the whole file can be damaged. She needs a place that stores data safely, finds things fast, and never saves half a change.\n\nThat place is a database. Python comes with one built in: SQLite, the very same engine you used in the SQL course. The module is called `sqlite3`.',
      },
      { t: 'p', text: 'A database called `":memory:"` lives only while your program runs, which is perfect for learning and for tests. A name like `"shop.db"` would save to a file instead. Everything below works the same way for both.' },
      {
        t: 'code',
        text: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT PRIMARY KEY, qty INTEGER, price INTEGER)")\ncon.execute("INSERT INTO stock VALUES (?, ?, ?)", ("sugar", 50, 4500))\ncon.executemany("INSERT INTO stock VALUES (?, ?, ?)", [("rice", 30, 3000), ("tea", 100, 500)])\n\nfor row in con.execute("SELECT item, qty FROM stock ORDER BY item"):\n    print(row)`,
        output: "('rice', 30)\n('sugar', 50)\n('tea', 100)",
      },
      { t: 'p', text: 'Each row comes back as a tuple. The `?` signs are placeholders: the values go in a separate tuple, never inside the SQL text. `fetchone()` gives the next row (or `None`), `fetchall()` gives every row in a list.' },
      {
        t: 'predict',
        code: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t (n INTEGER)")\ncon.executemany("INSERT INTO t VALUES (?)", [(1,), (2,), (3,)])\nprint(con.execute("SELECT SUM(n) FROM t").fetchone())`,
        question: 'What does this print?',
        options: ['6', '(6,)', '[(6,)]'],
        answer: 1,
        explain: 'fetchone gives ONE row, and a row is a tuple, even when it has a single column. So you see (6,). Use fetchone()[0] to get the plain number.',
      },
      { t: 'h', text: 'Rows you can read by name' },
      {
        t: 'code',
        text: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.row_factory = sqlite3.Row\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER, price INTEGER)")\ncon.execute("INSERT INTO stock VALUES (?, ?, ?)", ("sugar", 50, 4500))\n\nrow = con.execute("SELECT * FROM stock WHERE item = ?", ("sugar",)).fetchone()\nprint(row["item"], row["qty"])\nprint(dict(row))`,
        output: "sugar 50\n{'item': 'sugar', 'qty': 50, 'price': 4500}",
      },
      { t: 'h', text: 'Why placeholders matter: SQL injection' },
      { t: 'p', text: 'Imagine a customer types the name `x\' OR \'1\'=\'1`. If you glue it into the SQL with an f-string, it becomes part of the command and matches every row. With a `?` placeholder the database treats it as plain text, whatever it contains.' },
      {
        t: 'code',
        text: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER)")\ncon.executemany("INSERT INTO stock VALUES (?, ?)", [("sugar", 50), ("rice", 30), ("tea", 100)])\n\nname = "x' OR '1'='1"\nunsafe = con.execute(f"SELECT item FROM stock WHERE item = '{name}'").fetchall()\nsafe = con.execute("SELECT item FROM stock WHERE item = ?", (name,)).fetchall()\nprint(len(unsafe), len(safe))`,
        output: '3 0',
      },
      { t: 'tip', text: 'Never build SQL by joining text with user input. This single habit prevents one of the most common ways that real apps get hacked.' },
      {
        t: 'quiz',
        question: 'Why do we write WHERE item = ? and pass the value separately?',
        options: ['So the value can never be mistaken for SQL commands', 'Because f-strings are slow', 'Because SQLite cannot read text values'],
        answer: 0,
        explain: 'The database receives the command and the data separately, so the data can never change what the command does.',
      },
      { t: 'h', text: 'Transactions: all or nothing' },
      { t: 'p', text: 'A transaction groups several changes so that either ALL of them are saved or NONE are. In Python, `with con:` is a transaction: it commits when the block finishes and rolls back if an error happens inside. Remember to `commit()` your setup first, because a rollback also undoes anything not yet committed.' },
      {
        t: 'code',
        text: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER)")\ncon.execute("INSERT INTO stock VALUES ('sugar', 50)")\ncon.commit()\n\ntry:\n    with con:\n        con.execute("UPDATE stock SET qty = qty - 10 WHERE item = 'sugar'")\n        raise RuntimeError("power cut")\nexcept RuntimeError:\n    print("rolled back")\nprint(con.execute("SELECT qty FROM stock").fetchone()[0])\n\nwith con:\n    con.execute("UPDATE stock SET qty = qty - 10 WHERE item = 'sugar'")\nprint(con.execute("SELECT qty FROM stock").fetchone()[0])`,
        output: 'rolled back\n50\n40',
      },
      { t: 'analogy', text: 'A transaction is paying at the till. Either the money changes hands AND the goods leave, or neither happens. You never walk away with half a sale.' },
      { t: 'h', text: 'Wrap it in a class' },
      { t: 'p', text: 'The rest of your program should not have to know SQL. Put the database work in a class with clear methods, and use the custom errors from Level 6 to report problems. `add` uses an “upsert”: insert a new item, or increase the quantity if it already exists.' },
      {
        t: 'code',
        text: `import sqlite3\n\n${STOCK_HEAD}\n${STOCK_SELL}\n${STOCK_LOW}\n\nstock = Stock()\nstock.add("sugar", 50, 4500)\nstock.add("rice", 8, 3000)\nstock.add("rice", 4, 3000)\nstock.sell("sugar", 5)\nprint(stock.qty("sugar"), stock.qty("rice"))\nprint(stock.low_items(20))\ntry:\n    stock.sell("rice", 99)\nexcept OutOfStock as e:\n    print("only", e, "left")\ntry:\n    stock.sell("mango", 1)\nexcept UnknownItem as e:\n    print("unknown", e)`,
        output: "45 12\n['rice']\nonly 12 left\nunknown mango",
      },
      {
        t: 'fill',
        prompt: 'List the items that have more than 40 in stock.',
        template: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER)")\ncon.executemany("INSERT INTO stock VALUES (?, ?)", [("sugar", 50), ("rice", 30), ("tea", 100)])\nprint(con.execute("SELECT item FROM stock WHERE qty > ? ORDER BY item", (___,)).fetchall())`,
        blanks: [{ options: ['40', '10', '100'], answer: '40' }],
        output: "[('sugar',), ('tea',)]",
      },
      {
        t: 'bug',
        code: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER, price INTEGER)")\ncon.execute("INSERT INTO stock VALUES (?, ?, ?)", ("sugar", 50))`,
        question: 'This stops with “Incorrect number of bindings”. Why?',
        options: ['Three placeholders but only two values were given', 'The table has too many columns', 'INSERT cannot use placeholders'],
        answer: 0,
        explain: 'Every ? needs exactly one value. Three question marks need three values in the tuple.',
        fixed: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER, price INTEGER)")\ncon.execute("INSERT INTO stock VALUES (?, ?, ?)", ("sugar", 50, 4500))\nprint(con.execute("SELECT COUNT(*) FROM stock").fetchone()[0])`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT)")\ncon.execute("INSERT INTO stock VALUES ('sugar')")\nname = "sugar"\nrows = con.execute(f"SELECT * FROM stock WHERE item = '{name}'").fetchall()\nprint(len(rows))`,
            why: 'It works for honest input, but building SQL with an f-string lets a clever user change the command. Use a `?` placeholder.',
            right: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT)")\ncon.execute("INSERT INTO stock VALUES ('sugar')")\nname = "sugar"\nrows = con.execute("SELECT * FROM stock WHERE item = ?", (name,)).fetchall()\nprint(len(rows))`,
            logic: true,
          },
          {
            wrong: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t (n INTEGER)")\ncon.executemany("INSERT INTO t VALUES (?)", [(1,), (2,), (3,)])\nrows = con.execute("SELECT n FROM t")\nprint(len(list(rows)))\nprint(len(list(rows)))`,
            why: 'A cursor can be read only once. The second `list(rows)` finds nothing left and gives 0. Use `fetchall()` to keep the rows in a list.',
            right: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t (n INTEGER)")\ncon.executemany("INSERT INTO t VALUES (?)", [(1,), (2,), (3,)])\nrows = con.execute("SELECT n FROM t").fetchall()\nprint(len(rows))\nprint(len(rows))`,
            logic: true,
          },
          {
            wrong: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t (name TEXT)")\ncon.execute("SELECT * FROM t WHERE name = ?", "abc")`,
            why: 'A single value must still be inside a tuple. A plain string is read letter by letter (3 values for 1 placeholder). Write `("abc",)` with the comma.',
            right: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t (name TEXT)")\nprint(con.execute("SELECT * FROM t WHERE name = ?", ("abc",)).fetchall())`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['`sqlite3.connect(":memory:")` makes a temporary database, a file name makes a saved one.', 'Always pass values with `?` placeholders and a tuple, never by gluing text into the SQL.', '`fetchone()` gives one row or `None`, `fetchall()` gives a list. Rows are tuples, or named rows with `sqlite3.Row`.', '`with con:` is a transaction: it commits at the end and rolls back on an error. Commit your setup first.', 'Wrap SQL in a class with clear methods and custom errors, so the rest of the program stays simple.'],
        memory: 'Placeholders for safety, transactions for all-or-nothing.',
      },
    ],
    exercises: [
      {
        id: 'py48-low',
        title: 'What is running low?',
        prompt: 'Finish `low_items(limit)` in the `Stock` class. It must return the names of the items whose quantity is below `limit`, in alphabetical order. The program prints each name on its own line, or `Nothing is low`.',
        starter: `import sqlite3\n\n${STOCK_HEAD}\n${STOCK_LOW_STUB}\n\nstock = Stock()\nfor item, qty in [("sugar", 50), ("rice", 30), ("tea", 100), ("salt", 8), ("oil", 12)]:\n    stock.add(item, qty, 1000)\n\nlimit = int(input())\nnames = stock.low_items(limit)\nif names:\n    for name in names:\n        print(name)\nelse:\n    print("Nothing is low")\n`,
        sampleInput: '40',
        usesInput: true,
        tests: [
          { input: '40', expected: 'oil\nrice\nsalt' },
          { input: '10', expected: 'salt' },
          { input: '1', expected: 'Nothing is low', hidden: true },
          { input: '101', expected: 'oil\nrice\nsalt\nsugar\ntea', hidden: true },
        ],
        hints: [
          'Use a SELECT on the `stock` table with a WHERE condition on `qty`.',
          '`self.con.execute("SELECT item FROM stock WHERE qty < ? ORDER BY item", (limit,))`. Remember the comma after `limit`.',
          'Turn the rows into names with `[row[0] for row in rows]` and return that list.',
        ],
      },
      {
        id: 'py48-sell',
        title: 'Sell safely',
        prompt: 'Finish `sell(item, qty)`. Inside `with self.con:` find how many you have (`self.qty(item)` raises `UnknownItem` for you). If there are fewer than `qty`, raise `OutOfStock(have)`. Otherwise take `qty` away with an UPDATE. The program reads `sell ITEM QTY` commands and reports what happened.',
        starter: `import sqlite3\n\n${STOCK_HEAD}\n${STOCK_SELL_STUB}\n\nstock = Stock()\nstock.add("sugar", 50, 4500)\nstock.add("salt", 8, 800)\nstock.add("tea", 100, 500)\n\nn = int(input())\nfor i in range(n):\n    _, item, qty = input().split()\n    qty = int(qty)\n    try:\n        stock.sell(item, qty)\n        print(f"Sold {qty} x {item}, left {stock.qty(item)}")\n    except UnknownItem:\n        print(f"Error: unknown item {item}")\n    except OutOfStock as e:\n        print(f"Error: only {e} {item} left")\n`,
        sampleInput: '3\nsell sugar 3\nsell salt 20\nsell mango 1',
        usesInput: true,
        tests: [
          { input: '3\nsell sugar 3\nsell salt 20\nsell mango 1', expected: 'Sold 3 x sugar, left 47\nError: only 8 salt left\nError: unknown item mango' },
          { input: '2\nsell tea 100\nsell tea 1', expected: 'Sold 100 x tea, left 0\nError: only 0 tea left', hidden: true },
          { input: '2\nsell sugar 10\nsell sugar 10', expected: 'Sold 10 x sugar, left 40\nSold 10 x sugar, left 30', hidden: true },
        ],
        hints: [
          'Start with `with self.con:` and then `have = self.qty(item)`.',
          '`if have < qty: raise OutOfStock(have)`.',
          'Then `self.con.execute("UPDATE stock SET qty = qty - ? WHERE item = ?", (qty, item))`. The lesson’s `Stock` class has the full version.',
        ],
      },
      {
        id: 'py48-injection',
        title: 'Close the back door',
        prompt: 'This program counts how many stock rows match the name a customer typed, but it builds the SQL with an f-string, which a clever customer can abuse. Change it to use a `?` placeholder so that `x\' OR \'1\'=\'1` matches nothing.',
        starter: 'import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE stock (item TEXT, qty INTEGER)")\ncon.executemany("INSERT INTO stock VALUES (?, ?)", [("sugar", 50), ("rice", 30), ("tea", 100), ("salt", 8), ("oil", 12)])\n\nname = input()\nrows = con.execute(f"SELECT item FROM stock WHERE item = \'{name}\'").fetchall()\nprint(len(rows))\n',
        sampleInput: "x' OR '1'='1",
        usesInput: true,
        tests: [
          { input: 'sugar', expected: '1' },
          { input: "x' OR '1'='1", expected: '0' },
          { input: 'rice', expected: '1', hidden: true },
          { input: "o'brien", expected: '0', hidden: true },
        ],
        hints: [
          'The SQL text must not contain the customer’s words at all.',
          'Use `WHERE item = ?` in the SQL and pass the name as a second argument.',
          '`con.execute("SELECT item FROM stock WHERE item = ?", (name,)).fetchall()`',
        ],
      },
    ],
  },
];

export const level8Solution = { MAKE_MODULE, MAKE_PACKAGE, SAFE_PARSE, STOCK_HEAD, STOCK_SELL, STOCK_LOW };
