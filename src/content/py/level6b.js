// Python, Level 6 (Writing Python like a professional), part B: type hints and clean code, regular expressions, ledger project.
// Lessons 39 to 41. Exercise ids use the lesson number minus one (py38-, py39-, py40-).
// In template literals a regular-expression backslash is written \\d (two backslashes).

const LEVEL = 'Level 6: Writing Python like a professional';

const LEDGER_CORE = `class LedgerError(Exception):
    pass

class InvalidAmount(LedgerError):
    pass

class UnknownCustomer(LedgerError):
    pass

class OverPayment(LedgerError):
    pass

@dataclass
class Customer:
    name: str
    owed: int = 0

class Ledger:
    def __init__(self):
        self.customers: dict[str, Customer] = {}

    def _find(self, name: str) -> Customer:
        if name not in self.customers:
            raise UnknownCustomer(name)
        return self.customers[name]

    def credit(self, name: str, amount: int) -> None:
        if amount <= 0:
            raise InvalidAmount(amount)
        customer = self.customers.setdefault(name, Customer(name))
        customer.owed += amount

    def pay(self, name: str, amount: int) -> None:
        if amount <= 0:
            raise InvalidAmount(amount)
        customer = self._find(name)
        if amount > customer.owed:
            raise OverPayment(amount - customer.owed)
        customer.owed -= amount

    @property
    def total_owed(self) -> int:
        return sum(c.owed for c in self.customers.values())`;

const SESSION = `@contextmanager
def ledger_session():
    print("=== Ledger open ===")
    try:
        yield
    finally:
        print("=== Ledger closed ===")`;

const PROCESS = `def process(ledger, line):
    m = re.fullmatch(r"(credit|pay) ([A-Za-z]+) (-?\\d+)", line)
    if not m:
        print("Error: bad command")
        return
    action, name, amount = m.group(1), m.group(2), int(m.group(3))
    try:
        if action == "credit":
            ledger.credit(name, amount)
        else:
            ledger.pay(name, amount)
        print(f"{name} owes {ledger.customers[name].owed}")
    except InvalidAmount:
        print("Error: amount must be positive")
    except UnknownCustomer as e:
        print(f"Error: unknown customer {e}")
    except OverPayment as e:
        print(f"Error: {name} paid {e} too much")`;

const COMMANDS = `credit Amina 5000
pay Amina 2000
pay Zed 100
credit Okello -50
pay Amina 9000
hello
credit Okello 3000`;

export const level6b = [
  // ------------------------------------------------------------------ 39
  {
    id: 'py-typing',
    level: LEVEL,
    minutes: 20,
    title: 'Code the next person can read',
    summary: 'Type hints, docstrings, guard clauses and clean-code habits',
    blocks: [
      {
        t: 'story',
        title: 'The shop program nobody understands',
        text: 'Mama Rose’s nephew built the shop program two years ago. Now he has a new job, and her niece must fix one small bug. She opens the file and sees `def f(a, b, c):`. What is `a`? Money? A name? A list? She has to read the whole program to guess.\n\nThe next person to read your code is very often YOU, six months from now, and you will have forgotten everything. Professionals write code for people first and for the computer second. This lesson gives you the habits that make code easy to read and hard to break.',
      },
      { t: 'h', text: 'Type hints: say what goes in and what comes out' },
      { t: 'p', text: 'A type hint is a label you write after a name. `price: int` says “price is a whole number”. `-> int` after the brackets says “this function gives back a whole number”.' },
      {
        t: 'code',
        text: `def double(x: int) -> int:\n    return x * 2\n\nprint(double(21))\nprint(double("ab"))`,
        output: '42\nabab',
      },
      { t: 'p', text: 'Look at the second line of output! The hint said `int`, but Python happily doubled the text `"ab"`. Type hints are NOT rules that Python enforces. They are labels for people, and for tools such as editors and checkers (like `mypy`, which real teams run before shipping). If you must enforce a rule, you check it yourself.' },
      { t: 'p', text: 'Hints for lists, dictionaries and “maybe nothing”:' },
      {
        t: 'code',
        text: `def average(marks: list[int]) -> float:\n    return sum(marks) / len(marks)\n\ndef find_price(prices: dict[str, int], item: str) -> int | None:\n    return prices.get(item)\n\nprint(average([60, 70, 80]))\nprint(find_price({"sugar": 4500}, "tea"))`,
        output: '70.0\nNone',
      },
      { t: 'list', items: ['`list[int]` a list of whole numbers.', '`dict[str, int]` a dictionary with text keys and whole-number values.', '`int | None` a whole number OR nothing (read it as “maybe a number”).'] },
      { t: 'h', text: 'Docstrings: a note that travels with the function' },
      { t: 'p', text: 'A docstring is a piece of text in triple quotes, written on the first line inside a function. A comment (`#`) is for the person reading the code. A docstring is stored with the function, so tools and `help()` can show it.' },
      {
        t: 'code',
        text: `def change(price: int, paid: int) -> int:\n    """Return the change to give back. Raise ValueError if paid is too little."""\n    if paid < price:\n        raise ValueError("Paid is less than the price")\n    return paid - price\n\nprint(change.__doc__)\nprint(change(3500, 5000))`,
        output: 'Return the change to give back. Raise ValueError if paid is too little.\n1500',
      },
      { t: 'h', text: 'Guard clauses: deal with bad input first' },
      { t: 'p', text: 'Check for problems at the TOP of the function and leave straight away. The rest of the function can then assume everything is fine, and you avoid deep, tangled `if` blocks.' },
      {
        t: 'try',
        code: `def grade(marks: int) -> str:\n    if marks < 0 or marks > 100:\n        raise ValueError("Marks must be between 0 and 100")\n    if marks >= 80:\n        return "A"\n    if marks >= 50:\n        return "Pass"\n    return "Fail"\n\nfor m in (95, 60, 20):\n    print(m, grade(m))\n`,
        output: '95 A\n60 Pass\n20 Fail',
      },
      { t: 'h', text: 'Names and numbers that explain themselves' },
      { t: 'p', text: 'Compare these two. They give the same answer, but only one tells you what it is doing:' },
      {
        t: 'code',
        text: `def f(a, b):\n    return a * b * 118 // 100\n\nVAT_PERCENT = 18\n\ndef price_with_vat(unit_price: int, quantity: int) -> int:\n    """Total cost of an order, including VAT."""\n    subtotal = unit_price * quantity\n    return subtotal + subtotal * VAT_PERCENT // 100\n\nprint(f(2000, 5))\nprint(price_with_vat(2000, 5))`,
        output: '11800\n11800',
      },
      { t: 'list', items: ['Use full, clear names: `unit_price`, not `a`.', 'Write constants in CAPITAL_LETTERS at the top (`VAT_PERCENT`), so a number like 18 is never a mystery.', 'One function, one job. If you need “and” to describe it, split it in two.', 'Write a docstring on every function other people will use.'] },
      { t: 'analogy', text: 'Clean code is a tidy shop with labels on every shelf. The goods are the same as in a messy shop, but anyone, even a new worker on day one, can find the sugar.' },
      {
        t: 'predict',
        code: `def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item("rice"))\nprint(add_item("salt"))`,
        question: 'What does this print?',
        options: ["['rice']\n['salt']", "['rice']\n['rice', 'salt']", "['rice']\n['rice']"],
        answer: 1,
        explain: 'A default value like [] is created ONCE, when the function is defined, and then shared by every call. The second call adds to the same list. This is one of Python’s most famous traps.',
      },
      { t: 'p', text: 'The safe habit: use `None` as the default and create the fresh list inside the function.' },
      {
        t: 'try',
        code: `def add_item(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket\n\nprint(add_item("rice"))\nprint(add_item("salt"))\n`,
        output: "['rice']\n['salt']",
      },
      {
        t: 'bug',
        code: `def top_item(prices: dict[str, int]) -> str:\n    return max(prices, key=prices.get)\n\nprint(top_item({}))`,
        question: 'This crashes when the dictionary is empty. What is the best fix?',
        options: ['Add a guard clause at the top that handles an empty dictionary', 'Remove the type hints', 'Use min instead of max'],
        answer: 0,
        explain: 'max has nothing to choose from when the dictionary is empty. A guard clause deals with that case first and keeps the rest of the function simple.',
        fixed: `def top_item(prices: dict[str, int]) -> str:\n    if not prices:\n        return "none"\n    return max(prices, key=prices.get)\n\nprint(top_item({}))`,
      },
      {
        t: 'quiz',
        question: 'What does Python do if you call a function with an argument that does not match its type hint?',
        options: ['Nothing special: hints are labels, not rules', 'It raises a TypeError at once', 'It converts the value for you'],
        answer: 0,
        explain: 'Type hints help people and checking tools. Python itself ignores them when running, so enforce your rules with real checks.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `def double(x: int) -> int:\n    return x * 2\n\nprint(double("ab"))`,
            why: 'Believing the hint protects you. Python does not check hints, so text slips through and gives a strange answer. If the rule matters, check it.',
            right: `def double(x: int) -> int:\n    if not isinstance(x, int):\n        raise TypeError("x must be a whole number")\n    return x * 2\n\nprint(double(21))`,
            logic: true,
          },
          {
            wrong: `def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item("rice"))\nprint(add_item("salt"))`,
            why: 'A list as a default value is shared between calls, so the second customer sees the first one’s rice. Use `basket=None` and build a new list inside.',
            right: `def add_item(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket\n\nprint(add_item("rice"))\nprint(add_item("salt"))`,
            logic: true,
          },
          {
            wrong: `def f(a, b):\n    return a * b * 118 // 100\n\nprint(f(2000, 5))`,
            why: 'It works, but nobody knows what `a`, `b` or 118 mean. Clear names and a named constant cost nothing and save hours.',
            right: `VAT_PERCENT = 18\n\ndef price_with_vat(unit_price, quantity):\n    subtotal = unit_price * quantity\n    return subtotal + subtotal * VAT_PERCENT // 100\n\nprint(price_with_vat(2000, 5))`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['Type hints (`x: int`, `-> str`, `list[int]`, `int | None`) are labels for people and tools. Python does not enforce them.', 'A docstring in triple quotes explains a function and travels with it.', 'Guard clauses handle bad input first, at the top, and leave early.', 'Clear names, named constants and one job per function make code readable.', 'Never use a list or dictionary as a default argument: use `None` and create it inside.'],
        memory: 'Write for the next person. Label the shelves.',
      },
    ],
    exercises: [
      {
        id: 'py38-hints',
        title: 'Label the function',
        prompt: 'Make `average` easier to read. Add the type hints `marks: list[int]` and `-> float`, and give it a docstring (any sentence). The program prints the hints, whether a docstring exists, and the average.',
        starter: 'def average(marks):\n    return sum(marks) / len(marks)\n\nmarks = [int(x) for x in input().split()]\nprint(average.__annotations__)\nprint("Docstring:", "yes" if average.__doc__ else "no")\nprint(average(marks))\n',
        sampleInput: '60 70 80',
        usesInput: true,
        tests: [
          { input: '60 70 80', expected: "{'marks': list[int], 'return': <class 'float'>}\nDocstring: yes\n70.0" },
          { input: '100 50', expected: "{'marks': list[int], 'return': <class 'float'>}\nDocstring: yes\n75.0" },
          { input: '90', expected: "{'marks': list[int], 'return': <class 'float'>}\nDocstring: yes\n90.0", hidden: true },
        ],
        hints: [
          'A hint goes after the parameter name with a colon. The return hint goes after the closing bracket with an arrow.',
          'Write `def average(marks: list[int]) -> float:` and then a line of text in triple quotes as the first line inside.',
          'A similar example: `def total(prices: list[int]) -> int:` then `"""Add up the prices."""` then `return sum(prices)`.',
        ],
      },
      {
        id: 'py38-grade',
        title: 'Grade with guard clauses',
        prompt: 'Finish `grade(marks)`. First, a guard clause: marks below 0 or above 100 must `raise ValueError`. Then: 80 and above is `A`, 50 and above is `Pass`, anything else is `Fail`. The code below prints `Invalid marks` when the error is raised.',
        starter: 'def grade(marks):\n    # guard clause first: raise ValueError for marks below 0 or above 100\n    # then: 80 and above A, 50 and above Pass, otherwise Fail\n    return ""\n\nmarks = int(input())\ntry:\n    print(grade(marks))\nexcept ValueError:\n    print("Invalid marks")\n',
        sampleInput: '85',
        usesInput: true,
        tests: [
          { input: '85', expected: 'A' },
          { input: '60', expected: 'Pass' },
          { input: '30', expected: 'Fail' },
          { input: '101', expected: 'Invalid marks', hidden: true },
          { input: '-1', expected: 'Invalid marks', hidden: true },
          { input: '80', expected: 'A', hidden: true },
        ],
        hints: [
          'Do the check for impossible marks first, at the very top of the function.',
          '`if marks < 0 or marks > 100:` then `raise ValueError("Marks must be between 0 and 100")`.',
          'After the guard, use `if marks >= 80: return "A"`, then `if marks >= 50: return "Pass"`, then `return "Fail"`.',
        ],
      },
      {
        id: 'py38-basket',
        title: 'Fix the shared basket',
        prompt: 'This program adds one item to a fresh basket each time, but the second basket already contains the first item. Fix `add_item` so each call without a basket starts a NEW empty list.',
        starter: 'def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item(input()))\nprint(add_item(input()))\n',
        sampleInput: 'rice\nsalt',
        usesInput: true,
        tests: [
          { input: 'rice\nsalt', expected: "['rice']\n['salt']" },
          { input: 'tea\nsugar', expected: "['tea']\n['sugar']" },
          { input: 'milk\nmilk', expected: "['milk']\n['milk']", hidden: true },
        ],
        hints: [
          'The trouble is the `[]` in the function’s first line: it is created only once and shared.',
          'Change the default to `None`, then inside the function: `if basket is None:` and make `basket = []` there.',
          'A similar example: `def add_name(name, names=None):` then `if names is None:` then `names = []`, then `names.append(name)`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 40
  {
    id: 'py-regex',
    level: LEVEL,
    minutes: 22,
    title: 'Find patterns in text: regular expressions',
    summary: 'The re module: findall, search, fullmatch, sub, groups',
    blocks: [
      {
        t: 'story',
        title: '200 Mobile Money messages',
        text: 'At the end of the month Mama Rose has 200 Mobile Money messages on her phone. Each one looks like “You have received UGX 25,000 from Amina 0772123456.” She wants every amount and every phone number in a list. Reading 200 messages by eye would take an afternoon.\n\nThe amounts and the numbers all follow a pattern: “some digits, maybe commas” and “07 followed by eight digits”. Python has a small language just for describing patterns like that. It is called a regular expression, or regex, and the tool is the `re` module.',
      },
      { t: 'h', text: 'findall: collect every match' },
      {
        t: 'code',
        text: `import re\n\ntext = "Order 12 sold 3 bags at 4500 each"\nprint(re.findall(r"\\d+", text))`,
        output: "['12', '3', '4500']",
      },
      { t: 'p', text: '`\\d` means “one digit” and `+` means “one or more of the thing before”. So `\\d+` means “a run of digits”. The `r` before the quote is important: it makes a raw string, so Python leaves the backslash alone. Always write patterns as `r"..."`.' },
      { t: 'h', text: 'The pattern alphabet' },
      {
        t: 'list',
        items: [
          '`\\d` a digit. `\\w` a letter, digit or underscore. `\\s` a space.',
          '`.` any one character (except a new line).',
          '`+` one or more. `*` zero or more. `?` optional (zero or one).',
          '`{8}` exactly 8 times. `{2,4}` between 2 and 4 times.',
          '`[abc]` one of these characters. `[0-9]` one digit. `[\\d,]` a digit or a comma.',
          '`^` the start of the text. `$` the end.',
          '`( )` a group: remember this part so you can take it out later.',
        ],
      },
      { t: 'h', text: 'search and groups: pick out the parts you want' },
      {
        t: 'code',
        text: `import re\n\nsms = "You have received UGX 25,000 from Amina 0772123456. Balance UGX 80,500."\nmatch = re.search(r"received UGX ([\\d,]+) from (\\w+) (07\\d{8})", sms)\nprint(match.group(1))\nprint(match.group(2))\nprint(match.group(3))`,
        output: '25,000\nAmina\n0772123456',
      },
      { t: 'p', text: '`re.search` looks through the text for the first place the pattern fits. It gives back a match object, and `group(1)`, `group(2)` … return what each pair of brackets caught. If nothing fits, it gives back `None`, so always check before using the result.' },
      { t: 'analogy', text: 'A regex is a stencil. You hold the stencil over the text and slide it along until the holes line up with something. The brackets are the holes you want to see through.' },
      { t: 'h', text: 'fullmatch: is the WHOLE text valid?' },
      {
        t: 'code',
        text: `import re\n\ndef is_valid_phone(number):\n    return re.fullmatch(r"07\\d{8}", number) is not None\n\nprint(is_valid_phone("0772123456"))\nprint(is_valid_phone("077212345"))\nprint(is_valid_phone("0772123456 "))`,
        output: 'True\nFalse\nFalse',
      },
      { t: 'p', text: '`fullmatch` demands that the pattern covers the entire text, so it is perfect for checking input. The last number fails because of its extra space.' },
      { t: 'h', text: 'sub: find and replace with patterns' },
      {
        t: 'code',
        text: `import re\n\nprint(re.sub(r"\\s+", " ", "Sugar    4500   shop"))\nprint(re.sub(r"\\d", "#", "Call 0772123456"))\nprint(re.sub(r"(07\\d{2})\\d{6}", r"\\1******", "Call 0772123456"))`,
        output: 'Sugar 4500 shop\nCall ##########\nCall 0772******',
      },
      { t: 'p', text: 'In the last line, `\\1` in the replacement means “whatever group 1 caught”. We kept the first four digits and hid the rest: a real privacy habit in apps that show phone numbers.' },
      {
        t: 'try',
        code: `import re\n\nlog = "paid 5,000; paid 12,500; paid 800"\namounts = [int(a.replace(",", "")) for a in re.findall(r"[\\d,]+", log)]\nprint(amounts)\nprint(sum(amounts))\n`,
        output: '[5000, 12500, 800]\n18300',
      },
      {
        t: 'predict',
        code: `import re\nprint(re.findall(r"a\\d", "a1 b2 a33 a"))`,
        question: 'What does this print?',
        options: ["['a1', 'a3']", "['a1', 'a33']", "['a1', 'a3', 'a']"],
        answer: 0,
        explain: 'The pattern is “the letter a followed by ONE digit”. In a33 only the first 3 fits, so we get a3. The lonely a at the end has no digit after it.',
      },
      {
        t: 'fill',
        prompt: 'Choose the pattern that collects every whole number in the text.',
        template: `import re\nprint(re.findall(r"___", "x 12 y 345"))`,
        blanks: [{ options: ['\\d+', '\\d', '\\w+'], answer: '\\d+' }],
        output: "['12', '345']",
      },
      {
        t: 'bug',
        code: `import re\n\nmatch = re.search(r"\\d+", "no digits here")\nprint(match.group())`,
        question: 'This crashes with “NoneType has no attribute group”. Why?',
        options: ['search found no match and returned None', 'group needs a number inside the brackets', 'The pattern must not start with r'],
        answer: 0,
        explain: 'When the pattern does not fit anywhere, re.search returns None, and None has no group. Always check `if match:` first.',
        fixed: `import re\n\nmatch = re.search(r"\\d+", "no digits here")\nif match:\n    print(match.group())\nelse:\n    print("no number found")`,
      },
      {
        t: 'quiz',
        question: 'Why do we write patterns as r"..." (a raw string)?',
        options: ['So Python leaves backslashes like \\d alone for the regex engine', 'To make the pattern run faster', 'To make the search ignore capital letters'],
        answer: 0,
        explain: 'Without the r, Python tries to read \\b, \\n and friends as its own special characters before the regex ever sees them.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import re\n\nprint(re.findall("\\bcat\\b", "a cat sat"))`,
            why: 'No `r` before the quote. Python turns `\\b` into a backspace character, so the pattern looks for something that is not there and you get an empty list.',
            right: `import re\n\nprint(re.findall(r"\\bcat\\b", "a cat sat"))`,
            logic: true,
          },
          {
            wrong: `import re\n\nprint(re.match(r"\\d+", "Total 500"))`,
            why: '`re.match` only tries at the very START of the text, and “Total” is not a digit. Use `re.search` to look anywhere in the text.',
            right: `import re\n\nprint(re.search(r"\\d+", "Total 500").group())`,
            logic: true,
          },
          {
            wrong: `import re\n\nprint(re.search(r"<(.*)>", "<b>bold</b>").group(1))`,
            why: '`.*` is greedy: it grabs as much as it can, up to the LAST `>`. Add `?` to make it lazy and stop at the first `>`.',
            right: `import re\n\nprint(re.search(r"<(.*?)>", "<b>bold</b>").group(1))`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['Write patterns as raw strings: `r"..."`.', '`\\d` digit, `\\w` word character, `\\s` space, `+` one or more, `{8}` exactly eight, `[...]` one of.', '`findall` collects all matches. `search` finds the first and may give `None`. `fullmatch` checks the whole text.', 'Brackets make groups: `match.group(1)` takes out the part you want.', '`re.sub(pattern, replacement, text)` replaces patterns, and `\\1` re-uses a group.'],
        memory: 'A regex is a stencil for text. Raw string, check for None.',
      },
    ],
    exercises: [
      {
        id: 'py39-extract',
        title: 'Read the Mobile Money message',
        prompt: 'Read one message like `You have received UGX 25,000 from Amina 0772123456.` Print the amount as a plain number (no commas) and the phone number:\n\n`Amount: 25000`\n`From: 0772123456`',
        starter: 'import re\n\nsms = input()\n# find the amount and the phone number, then print them\n',
        sampleInput: 'You have received UGX 25,000 from Amina 0772123456.',
        usesInput: true,
        tests: [
          { input: 'You have received UGX 25,000 from Amina 0772123456.', expected: 'Amount: 25000\nFrom: 0772123456' },
          { input: 'You have received UGX 800 from Okello 0701000111.', expected: 'Amount: 800\nFrom: 0701000111' },
          { input: 'You have received UGX 1,250,000 from Zed 0755999888.', expected: 'Amount: 1250000\nFrom: 0755999888', hidden: true },
        ],
        hints: [
          'Use `re.search` with two groups: one for the amount, one for the phone number.',
          'Try `re.search(r"UGX ([\\d,]+) from \\w+ (07\\d{8})", sms)`, then `group(1)` and `group(2)`.',
          'Remove the commas with `.replace(",", "")` and print `f"Amount: {amount}"` and `f"From: {phone}"`.',
        ],
      },
      {
        id: 'py39-validate',
        title: 'Is this a Ugandan phone number?',
        prompt: 'Read a number `n`, then `n` phone numbers. A number is valid if it is `07` followed by 8 digits, OR `+2567` followed by 8 digits. Print `valid` or `invalid` for each one.',
        starter: 'import re\n\nn = int(input())\nfor i in range(n):\n    number = input()\n    # print valid or invalid\n    print("invalid")\n',
        sampleInput: '4\n0772123456\n077212345\n+256772123456\nabc',
        usesInput: true,
        tests: [
          { input: '4\n0772123456\n077212345\n+256772123456\nabc', expected: 'valid\ninvalid\nvalid\ninvalid' },
          { input: '2\n0701234567\n07012345678', expected: 'valid\ninvalid' },
          { input: '2\n0700000000\n+25677212345', expected: 'valid\ninvalid', hidden: true },
        ],
        hints: [
          'Use `re.fullmatch`, so the whole number must fit the pattern.',
          'Two choices can be written with `|` inside brackets: `(07|\\+2567)` then `\\d{8}`. The `+` needs a backslash because it is special.',
          '`if re.fullmatch(r"(07|\\+2567)\\d{8}", number):` print `valid`, otherwise print `invalid`.',
        ],
      },
      {
        id: 'py39-hide',
        title: 'Hide the phone numbers',
        prompt: 'Read one line of text. Replace every phone number (`07` and 8 more digits) with its first four digits followed by six stars, like `0772123456` becoming `0772******`. Print the changed line.',
        starter: 'import re\n\ntext = input()\n# hide the last six digits of every phone number\nprint(text)\n',
        sampleInput: 'Call 0772123456 or 0701000111 today',
        usesInput: true,
        tests: [
          { input: 'Call 0772123456 or 0701000111 today', expected: 'Call 0772****** or 0701****** today' },
          { input: 'No number here', expected: 'No number here' },
          { input: '0755999888', expected: '0755******', hidden: true },
        ],
        hints: [
          'This is a job for `re.sub`.',
          'Catch the first four digits in a group: `(07\\d{2})`, then the six digits you want to hide: `\\d{6}`.',
          '`re.sub(r"(07\\d{2})\\d{6}", r"\\1******", text)`. The `\\1` brings the first four digits back.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 41
  {
    id: 'py-project-ledger',
    level: LEVEL,
    minutes: 40,
    title: 'Project: the customer ledger',
    summary: 'A credit ledger with custom errors, a dataclass, regex and a safe session',
    blocks: [
      {
        t: 'story',
        title: 'Mama Rose lets people buy on credit',
        text: 'Regular customers often ask: “Can I pay you on Friday?” Mama Rose writes it in an exercise book: Amina owes 5,000. Then Amina pays 2,000. Then someone writes a wrong amount, a name is spelled differently, a page gets torn. Money mistakes make people angry.\n\nA ledger program must be strict: never accept a nonsense amount, never lose track of who owes what, and always say clearly what went wrong. This project uses everything from Level 6: your own errors, a dataclass, type hints, a property, regex for checking commands and a context manager that opens and closes the ledger safely.',
      },
      { t: 'h', text: 'Step 1: errors that say what happened' },
      {
        t: 'project',
        title: 'Errors and the customer',
        text: 'One parent error for the whole ledger, and a child for each kind of problem. A dataclass holds a customer’s name and what they owe.',
        code: `from dataclasses import dataclass\n\nclass LedgerError(Exception):\n    pass\n\nclass InvalidAmount(LedgerError):\n    pass\n\nclass UnknownCustomer(LedgerError):\n    pass\n\nclass OverPayment(LedgerError):\n    pass\n\n@dataclass\nclass Customer:\n    name: str\n    owed: int = 0\n\nc = Customer("Amina")\nprint(c)\nc.owed += 5000\nprint(c)\n`,
        output: "Customer(name='Amina', owed=0)\nCustomer(name='Amina', owed=5000)",
      },
      { t: 'h', text: 'Step 2: the Ledger, strict about every rule' },
      {
        t: 'project',
        title: 'The Ledger class',
        text: 'Guard clauses refuse bad amounts first. `pay` refuses unknown customers and payments bigger than the debt. `total_owed` is a property, so it is always fresh. Watch each error carry the useful number.',
        code: `from dataclasses import dataclass\n\n${LEDGER_CORE}\n\nledger = Ledger()\nledger.credit("Amina", 5000)\nledger.credit("Okello", 2000)\nledger.pay("Amina", 1500)\nprint(ledger.customers["Amina"].owed)\nprint(ledger.total_owed)\ntry:\n    ledger.pay("Zed", 100)\nexcept UnknownCustomer as e:\n    print("Unknown:", e)\ntry:\n    ledger.pay("Amina", 99999)\nexcept OverPayment as e:\n    print("Too much by", e)\ntry:\n    ledger.credit("Amina", -5)\nexcept InvalidAmount:\n    print("Invalid amount")\n`,
        output: '3500\n5500\nUnknown: Zed\nToo much by 96499\nInvalid amount',
      },
      { t: 'h', text: 'Step 3: read commands safely' },
      {
        t: 'project',
        title: 'Process commands',
        text: 'A regex checks the shape of each command line before we trust it. Then each kind of error is caught on its own, with its own clear message. A bad line never crashes the program.',
        code: `import re\nfrom dataclasses import dataclass\n\n${LEDGER_CORE}\n\n${PROCESS}\n\nCOMMANDS = """${COMMANDS}"""\n\nledger = Ledger()\nfor line in COMMANDS.splitlines():\n    process(ledger, line)\nprint(f"Total owed: {ledger.total_owed}")\n`,
        output: 'Amina owes 5000\nAmina owes 3000\nError: unknown customer Zed\nError: amount must be positive\nError: Amina paid 6000 too much\nError: bad command\nOkello owes 3000\nTotal owed: 6000',
      },
      { t: 'h', text: 'Step 4: open and close safely' },
      {
        t: 'project',
        title: 'A safe session',
        text: 'A context manager prints a header and a footer. Because of `finally`, the footer appears even if something unexpected crashes the middle.',
        code: `import re\nfrom contextlib import contextmanager\nfrom dataclasses import dataclass\n\n${LEDGER_CORE}\n\n${PROCESS}\n\n${SESSION}\n\nCOMMANDS = """${COMMANDS}"""\n\nledger = Ledger()\nwith ledger_session():\n    for line in COMMANDS.splitlines():\n        process(ledger, line)\n    print(f"Total owed: {ledger.total_owed}")\n`,
        output: '=== Ledger open ===\nAmina owes 5000\nAmina owes 3000\nError: unknown customer Zed\nError: amount must be positive\nError: Amina paid 6000 too much\nError: bad command\nOkello owes 3000\nTotal owed: 6000\n=== Ledger closed ===',
      },
      {
        t: 'recap',
        items: ['A parent error plus a child per problem makes failures easy to catch and easy to read.', 'A dataclass holds simple facts with almost no code.', 'Guard clauses and clear error messages keep money code strict.', 'A regex checks a command’s shape before the program trusts it.', 'A context manager with `finally` guarantees the clean-up step.', 'You now write Python the way a team would expect: clear, checked and safe.'],
        memory: 'Check the shape, guard the rules, name the errors, always clean up.',
      },
    ],
    exercises: [
      {
        id: 'py40-ledger',
        title: 'Run the ledger',
        prompt: 'The `Ledger` and the session are finished for you. Write the loop that processes each command line.\n\nA good command looks like `credit Amina 5000` or `pay Amina 2000` (a name with letters only, then a whole number, which may be negative). After a good command print `NAME owes X` with the new amount. For problems print:\n\n`Error: bad command` (the line does not fit the shape)\n`Error: amount must be positive`\n`Error: unknown customer NAME`\n`Error: NAME paid N too much` (N is how much more than the debt)\n\nThe total and the header and footer are printed for you.',
        starter: `import re\nfrom contextlib import contextmanager\nfrom dataclasses import dataclass\n\n${LEDGER_CORE}\n\n${SESSION}\n\nn = int(input())\nledger = Ledger()\nwith ledger_session():\n    for _ in range(n):\n        line = input()\n        # check the shape, run the command, print the result or the error\n    print(f"Total owed: {ledger.total_owed}")\n`,
        sampleInput: `7\n${COMMANDS}`,
        usesInput: true,
        tests: [
          {
            input: `7\n${COMMANDS}`,
            expected: '=== Ledger open ===\nAmina owes 5000\nAmina owes 3000\nError: unknown customer Zed\nError: amount must be positive\nError: Amina paid 6000 too much\nError: bad command\nOkello owes 3000\nTotal owed: 6000\n=== Ledger closed ===',
            name: 'A busy day',
          },
          {
            input: '3\ncredit Mary 1000\ncredit Mary 500\npay Mary 1500',
            expected: '=== Ledger open ===\nMary owes 1000\nMary owes 1500\nMary owes 0\nTotal owed: 0\n=== Ledger closed ===',
            name: 'Paid in full',
          },
          {
            input: '4\npay Jane 50\ncredit Jane 0\ncredit Jane abc\ncredit Jane 700',
            expected: '=== Ledger open ===\nError: unknown customer Jane\nError: amount must be positive\nError: bad command\nJane owes 700\nTotal owed: 700\n=== Ledger closed ===',
            hidden: true,
          },
        ],
        hints: [
          'First check the shape of the line with `re.fullmatch`. If it does not fit, print `Error: bad command` and move on to the next line.',
          'Pattern: `r"(credit|pay) ([A-Za-z]+) (-?\\d+)"`. The groups give the action, the name and the amount (turn the amount into an int).',
          'Then `try:` call `ledger.credit` or `ledger.pay`, print `f"{name} owes {ledger.customers[name].owed}"`, and add one `except` for each of the three error classes. The Step 3 project in the lesson does exactly this.',
        ],
      },
    ],
  },
];

export const level6Solution = { LEDGER_CORE, SESSION, PROCESS, COMMANDS };
