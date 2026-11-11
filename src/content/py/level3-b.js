// Python, Level 3 (Real Programs), part B: files, JSON, classes and the shop that remembers.
// NOTE: inside these template literals a Python newline escape is written \\n (so the Python text contains \n).

const LEVEL = 'Level 3: Real Programs';

// Shared pieces of the capstone project, so each step shows exactly the same code.
const PRODUCT = `class Product:
    def __init__(self, name, price, stock):
        self.name = name
        self.price = price
        self.stock = stock

    def sell(self, quantity):
        if quantity > self.stock:
            return 0
        self.stock = self.stock - quantity
        return self.price * quantity

    def to_dict(self):
        return {"name": self.name, "price": self.price, "stock": self.stock}`;

const SHOP_BASE = `class Shop:
    def __init__(self):
        self.products = {}
        self.sales_total = 0

    def add_product(self, name, price, stock):
        self.products[name] = Product(name, price, stock)

    def sell(self, name, quantity):
        if name not in self.products:
            print("We do not sell that")
            return
        earned = self.products[name].sell(quantity)
        if earned == 0:
            print("Not enough stock")
        self.sales_total = self.sales_total + earned

    def report(self):
        for name in self.products:
            product = self.products[name]
            print(f"{product.name}: {product.stock} left")
        print(f"Sales today: {self.sales_total}")`;

const SHOP_SAVE = `    def save(self, filename):
        products = [self.products[name].to_dict() for name in self.products]
        data = {"sales_total": self.sales_total, "products": products}
        with open(filename, "w") as f:
            json.dump(data, f)

    def load(self, filename):
        with open(filename) as f:
            data = json.load(f)
        self.sales_total = data["sales_total"]
        self.products = {}
        for item in data["products"]:
            self.add_product(item["name"], item["price"], item["stock"])`;

const SHOP_STUBS = `    def save(self, filename):
        # write sales_total and every product (use to_dict) to the file as JSON
        pass

    def load(self, filename):
        # read the file and rebuild sales_total and products (use add_product)
        pass`;

export const level3b = [
  // ------------------------------------------------------------------ 22
  {
    id: 'py-files',
    level: LEVEL,
    minutes: 18,
    title: 'Files: write it down and read it back',
    summary: 'Saving text to a file, reading it, appending, and missing files',
    blocks: [
      {
        t: 'story',
        title: 'The ledger that remembers',
        text: 'Mama Rose’s variables vanish the moment the program ends, like words spoken in the wind. But her paper ledger is still there tomorrow morning, because she WROTE IT DOWN.\n\nPrograms do the same with **files**: they write information down so it can be read later, even by another program.',
      },
      { t: 'tip', text: 'In this app, files live in a temporary space that is cleared after every Run. So always WRITE the file first and READ it in the same program. On a real computer, the file stays on the disk after the program ends.' },
      { t: 'code', text: `with open("notes.txt", "w") as f:\n    f.write("Hello file\\n")\nwith open("notes.txt") as f:\n    print(f.read().strip())`, output: 'Hello file' },
      {
        t: 'list',
        items: ['`open("notes.txt", "w")` opens a file for **w**riting. It ERASES the old contents.', '`"a"` opens for **a**ppending: new text is added at the end.', '`"r"` (or nothing) opens for **r**eading.', '`\\n` inside text means “start a new line”. `write` does NOT add it for you.'],
      },
      { t: 'analogy', text: '`with open(...) as f:` is like opening a drawer, taking what you need, and the drawer closes by itself when you leave the indented block. You can never forget to close it.' },
      { t: 'h', text: 'Adding to a file and reading it line by line' },
      {
        t: 'code',
        text: `with open("sales.txt", "w") as f:\n    f.write("sugar,4500\\n")\n    f.write("rice,3000\\n")\nwith open("sales.txt", "a") as f:\n    f.write("salt,800\\n")\nwith open("sales.txt") as f:\n    for line in f:\n        print(line.strip())`,
        output: 'sugar,4500\nrice,3000\nsalt,800',
      },
      { t: 'p', text: 'A `for` loop over the file gives one line at a time. Each line still ends with a newline, so we `strip()` it. Now combine files with the text tools from the last lesson:' },
      {
        t: 'code',
        text: `with open("sales.txt", "w") as f:\n    f.write("sugar,4500\\n")\n    f.write("rice,3000\\n")\n    f.write("salt,800\\n")\ntotal = 0\nwith open("sales.txt") as f:\n    for line in f:\n        name, price = line.strip().split(",")\n        total = total + int(price)\nprint("Total:", total)`,
        output: 'Total: 8300',
      },
      { t: 'try', code: `with open("diary.txt", "w") as f:\n    f.write("Monday: sold 12 loaves\\n")\nwith open("diary.txt", "a") as f:\n    f.write("Tuesday: sold 9 loaves\\n")\nwith open("diary.txt") as f:\n    print(f.read().strip())\n`, output: 'Monday: sold 12 loaves\nTuesday: sold 9 loaves' },
      { t: 'p', text: 'Add a Wednesday line and run it again.' },
      { t: 'h', text: 'When the file is not there' },
      { t: 'p', text: 'Reading a file that does not exist crashes with a `FileNotFoundError`. You already know the safety net for this:' },
      { t: 'code', text: `try:\n    with open("missing.txt") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("No such file yet")`, output: 'No such file yet' },
      {
        t: 'predict',
        code: `with open("a.txt", "w") as f:\n    f.write("one")\nwith open("a.txt", "w") as f:\n    f.write("two")\nwith open("a.txt") as f:\n    print(f.read())`,
        question: 'What does this print?',
        options: ['onetwo', 'two', 'one'],
        answer: 1,
        explain: 'Opening with "w" ERASES the file first. The second open wiped out one, so only two is left. Use "a" to add instead.',
      },
      {
        t: 'fill',
        prompt: 'Which mode lets the program write the file?',
        template: `with open("n.txt", "___") as f:\n    f.write("hi")\nwith open("n.txt") as f:\n    print(f.read())`,
        blanks: [{ options: ['w', 'r', 'read'], answer: 'w' }],
        output: 'hi',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: write ok into a file, then open it again and print it.',
        lines: [`with open("t.txt", "w") as f:`, `    f.write("ok")`, `with open("t.txt") as f:`, `    print(f.read())`],
        output: 'ok',
      },
      {
        t: 'bug',
        code: `f = open("data.txt", "w")\nf.write("hello")\nprint(f.read())`,
        question: 'This crashes. Why?',
        options: ['The file was opened for writing, so it cannot be read', 'write needs a number', 'print cannot read files'],
        answer: 0,
        explain: 'A file opened with "w" is for writing only. Close it and open it again for reading.',
        fixed: `with open("data.txt", "w") as f:\n    f.write("hello")\nwith open("data.txt") as f:\n    print(f.read())`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `with open("log.txt", "w") as f:\n    f.write("first\\n")\nwith open("log.txt", "w") as f:\n    f.write("second\\n")`,
            why: 'No error, but the second "w" erased the first line. To ADD to a file, open it with "a".',
            right: `with open("log.txt", "w") as f:\n    f.write("first\\n")\nwith open("log.txt", "a") as f:\n    f.write("second\\n")`,
            logic: true,
          },
          {
            wrong: `with open("list.txt", "w") as f:\n    f.write("milk")\n    f.write("eggs")`,
            why: 'No error, but write does not add a new line, so the file holds the single line milkeggs. Finish each line with \\n.',
            right: `with open("list.txt", "w") as f:\n    f.write("milk\\n")\n    f.write("eggs\\n")`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['`with open(name, "w") as f:` writes (erasing), `"a"` appends, `"r"` reads.', '`f.write(text)` does not add a new line. Add `\\n` yourself.', '`for line in f:` reads line by line. `line.strip()` removes the newline.', 'A missing file raises FileNotFoundError: catch it with try/except.'],
        memory: 'with open = a drawer that closes itself.',
      },
    ],
    exercises: [
      {
        id: 'py22-notes',
        title: 'Number the shopping list',
        prompt: 'The program writes a shopping list to a file. Read the file back and print each line with a number in front:\n\n`1. milk`\n`2. eggs`\n`3. bread`',
        starter: 'with open("list.txt", "w") as f:\n    f.write("milk\\neggs\\nbread\\n")\n\n# Read the file and print each line with a number, like: 1. milk\n',
        tests: [{ expected: '1. milk\n2. eggs\n3. bread' }],
        hints: [
          'Open the file for reading and loop over it, keeping a counter that starts at 1.',
          '`number = 1`, then `for line in f:` print `f"{number}. {line.strip()}"` and add 1 to number.',
          'A similar example: `for line in f: print(line.strip())` prints every line without the extra newline.',
        ],
      },
      {
        id: 'py22-total',
        title: 'Total the sales file',
        prompt: 'The program writes a sales file. Read it back and add up all the prices. Each line looks like `sugar,4500`. Print:\n\n`Total: 8800`',
        starter: 'with open("sales.txt", "w") as f:\n    f.write("sugar,4500\\nrice,3000\\nsalt,800\\ntea,500\\n")\n\n# Read the file and add up the prices\n',
        tests: [{ expected: 'Total: 8800' }],
        hints: [
          'Each line has a name and a price separated by a comma. Cut each line and keep the price.',
          'For each line: `name, price = line.strip().split(",")`, then add `int(price)` to a total that starts at 0.',
          'A similar example: the lesson’s total program that adds up the prices from the file.',
        ],
      },
      {
        id: 'py22-diary',
        title: 'Write a diary line',
        prompt: 'Read one line of text, save it into `diary.txt`, then read the file back and print `Saved: ` followed by the text.',
        starter: '# Read the line, write it to diary.txt, then read it back\n',
        sampleInput: 'Met Amina',
        usesInput: true,
        tests: [
          { input: 'Met Amina', expected: 'Saved: Met Amina' },
          { input: 'Sold 3 loaves', expected: 'Saved: Sold 3 loaves' },
          { input: 'Rain today', expected: 'Saved: Rain today', hidden: true },
        ],
        hints: [
          'Two steps: open with "w" and write the text, then open for reading and print what you read.',
          'Write `text + "\\n"` so the line ends properly. Read with `f.read().strip()`.',
          'A similar example: `with open("a.txt", "w") as f:` and `f.write("hi")`, then open it again and print `f.read()`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 23
  {
    id: 'py-json',
    level: LEVEL,
    minutes: 15,
    title: 'Saving real data: JSON',
    summary: 'Turning dictionaries and lists into text and back',
    blocks: [
      {
        t: 'story',
        title: 'Mama Rose’s stock is a dictionary',
        text: 'Mama Rose’s stock lives in a Python dictionary. A file can only hold TEXT. So how does she save a dictionary into a file and get the same dictionary back tomorrow?\n\nShe uses a common language that both people and programs understand: **JSON**. It writes dictionaries and lists as plain text. Almost every app and website in the world uses it to send data around.',
      },
      { t: 'code', text: `import json\n\nstock = {"sugar": 20, "rice": 15}\ntext = json.dumps(stock)\nprint(text)\nprint(type(text))`, output: "{\"sugar\": 20, \"rice\": 15}\n<class 'str'>" },
      { t: 'p', text: '`json.dumps` turns Python data into JSON TEXT (the **s** stands for string). `json.loads` turns the text back into real Python data:' },
      { t: 'code', text: `import json\n\ndata = json.loads('{"name": "Amina", "owes": 0}')\nprint(data["name"])\nprint(data["owes"] + 500)`, output: 'Amina\n500' },
      { t: 'h', text: 'Straight into a file' },
      { t: 'p', text: 'To work with files directly, drop the **s**: `json.dump(data, f)` writes into the file and `json.load(f)` reads from it:' },
      {
        t: 'code',
        text: `import json\n\nstock = {"sugar": 20, "rice": 15}\nwith open("stock.json", "w") as f:\n    json.dump(stock, f)\nwith open("stock.json") as f:\n    loaded = json.load(f)\nprint(loaded["sugar"])`,
        output: '20',
      },
      { t: 'analogy', text: 'JSON is like packing your goods into standard boxes before a bus trip. The bus (the file) only carries boxes. At the other end, the shopkeeper unpacks the boxes and gets the very same goods back.' },
      { t: 'try', code: `import json\n\ncustomers = [{"name": "Amina", "owes": 0}, {"name": "Okello", "owes": 2500}]\nprint(json.dumps(customers))\nprint(json.dumps({"a": 1}, indent=2))\n`, output: '[{"name": "Amina", "owes": 0}, {"name": "Okello", "owes": 2500}]\n{\n  "a": 1\n}' },
      { t: 'p', text: '`indent=2` makes the text pretty and easy for people to read. A list of dictionaries (like the customers above) is the most common shape of real data.' },
      {
        t: 'predict',
        code: `import json\nd = json.loads('{"n": 5}')\nprint(d["n"] + 1)`,
        question: 'What does this print?',
        options: ['5', '6', 'an error'],
        answer: 1,
        explain: 'loads turned the text back into a real dictionary, so d["n"] is the number 5, and 5 + 1 is 6.',
      },
      {
        t: 'quiz',
        question: 'Which function turns a Python dictionary into JSON text?',
        options: ['json.dumps', 'json.loads', 'json.open'],
        answer: 0,
        explain: 'dumps = “dump to string”. loads does the opposite: “load from string”.',
      },
      {
        t: 'fill',
        prompt: 'Which function makes JSON text from the dictionary?',
        template: `import json\ntext = json.___({"a": 1})\nprint(text)`,
        blanks: [{ options: ['dumps', 'loads', 'print'], answer: 'dumps' }],
        output: '{"a": 1}',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: make JSON text, turn it back into data, print the number.',
        lines: [`import json`, `text = json.dumps({"a": 1})`, `data = json.loads(text)`, `print(data["a"])`],
        output: '1',
      },
      {
        t: 'bug',
        code: `import json\nprint(json.loads("not json"))`,
        question: 'This crashes with a JSONDecodeError. Why?',
        options: ['The text is not valid JSON', 'loads needs a file, not text', 'print cannot show text'],
        answer: 0,
        explain: 'loads only understands text that is written as JSON. Plain words are not. Real JSON uses curly brackets, quotes and colons.',
        fixed: `import json\nprint(json.loads('{"ok": true}'))`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `import json\nprint(json.dumps({"a": 1})["a"])`, why: 'dumps gives TEXT, not a dictionary, so you cannot look up a key in it. Turn it back with loads first.', right: `import json\nprint(json.loads(json.dumps({"a": 1}))["a"])` },
          { wrong: `print(json.dumps({}))`, why: 'The json toolbox was never borrowed. Start with import json.', right: `import json\nprint(json.dumps({}))` },
        ],
      },
      {
        t: 'recap',
        items: ['JSON writes dictionaries and lists as plain text.', '`dumps` / `loads` work with text. `dump` / `load` work with files.', 'Save: `json.dump(data, f)`. Load: `data = json.load(f)`.', 'You get the same data back.'],
        memory: 'JSON = standard boxes for the bus trip.',
      },
    ],
    exercises: [
      {
        id: 'py23-save',
        title: 'Save and reload the stock',
        prompt: 'Save the `stock` dictionary into `stock.json`, load it back into a new variable called `loaded`, add 5 to the sugar, and print:\n\n`Sugar now: 25`',
        starter: 'import json\n\nstock = {"sugar": 20, "rice": 15}\n# 1. Save stock into stock.json\n# 2. Load it back into a variable called loaded\n# 3. Add 5 to loaded["sugar"] and print: Sugar now: 25\n',
        tests: [{ expected: 'Sugar now: 25' }],
        hints: [
          'Writing a file and reading it back, using the JSON tools that work with files.',
          'Save with `json.dump(stock, f)` inside `with open("stock.json", "w") as f:`. Load with `json.load(f)` inside a read `with`.',
          'A similar example: the lesson’s program that dumps `stock` to `stock.json` and loads it as `loaded`.',
        ],
      },
      {
        id: 'py23-parse',
        title: 'Read a JSON message',
        prompt: 'One line of input is a JSON message like `{"name": "Amina", "amount": 5000}`. Print:\n\n`Amina sent 5000`',
        starter: 'import json\n\n# Read the JSON line and print the sentence\n',
        sampleInput: '{"name": "Amina", "amount": 5000}',
        usesInput: true,
        tests: [
          { input: '{"name": "Amina", "amount": 5000}', expected: 'Amina sent 5000' },
          { input: '{"name": "Okello", "amount": 1200}', expected: 'Okello sent 1200' },
          { input: '{"amount": 800, "name": "Zed"}', expected: 'Zed sent 800', hidden: true },
        ],
        hints: [
          'The input is JSON TEXT. Turn it into a dictionary first.',
          '`data = json.loads(input())`, then use `data["name"]` and `data["amount"]`.',
          'In an f-string with double quotes outside, use single quotes inside the brackets: `f"{data[\'name\']}"`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 24
  {
    id: 'py-classes',
    level: LEVEL,
    minutes: 22,
    title: 'Classes: blueprints for real things',
    summary: 'class, __init__, self, methods, and making many objects',
    blocks: [
      {
        t: 'story',
        title: 'One blueprint, many boda bodas',
        text: 'A factory has ONE blueprint for a boda boda. Every motorcycle built from it has the same parts, but its own number plate, its own colour and its own owner. Change the plate on one boda and the others are not affected.\n\nIn Python the blueprint is called a **class**, and every thing built from it is an **object**.',
      },
      { t: 'p', text: 'Mama Rose’s shop is full of products. Each one has a name, a price and a stock. Instead of juggling separate jars and dictionaries, we make one blueprint called `Product`:' },
      {
        t: 'code',
        text: `class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\nsugar = Product("Sugar", 4500)\nprint(sugar.name)\nprint(sugar.price)`,
        output: 'Sugar\n4500',
      },
      {
        t: 'list',
        items: ['`class Product:` starts the blueprint.', '`__init__` runs automatically when an object is built. It sets up the object’s own facts.', '`self` means “this particular object”. `self.name = name` stores the name INSIDE the object.', '`Product("Sugar", 4500)` builds a new object from the blueprint.'],
      },
      { t: 'analogy', text: 'When the factory stamps a plate on a boda, `self` is the word that means “THIS boda, the one in front of me”. Without `self` the factory would not know which motorcycle to put the plate on.' },
      { t: 'h', text: 'Objects can DO things: methods' },
      { t: 'p', text: 'A function inside a class is called a **method**. It can use and change the object’s own facts:' },
      {
        t: 'code',
        text: `class Product:\n    def __init__(self, name, price, stock):\n        self.name = name\n        self.price = price\n        self.stock = stock\n\n    def sell(self, quantity):\n        if quantity > self.stock:\n            return 0\n        self.stock = self.stock - quantity\n        return self.price * quantity\n\nsugar = Product("Sugar", 4500, 20)\nprint(sugar.sell(3))\nprint(sugar.stock)`,
        output: '13500\n17',
      },
      { t: 'p', text: 'Every object has its OWN facts. Selling sugar does not touch the rice:' },
      {
        t: 'try',
        code: `class Product:\n    def __init__(self, name, price, stock):\n        self.name = name\n        self.price = price\n        self.stock = stock\n\n    def sell(self, quantity):\n        if quantity > self.stock:\n            return 0\n        self.stock = self.stock - quantity\n        return self.price * quantity\n\nsugar = Product("Sugar", 4500, 20)\nrice = Product("Rice", 3000, 15)\nsugar.sell(3)\nprint(sugar.stock)\nprint(rice.stock)\n`,
        output: '17\n15',
      },
      { t: 'p', text: 'Make a third product and sell some of it.' },
      {
        t: 'predict',
        code: `class Dog:\n    def __init__(self, name):\n        self.name = name\n\nd = Dog("Rex")\nprint(d.name)`,
        question: 'What does this print?',
        options: ['Dog', 'Rex', 'name'],
        answer: 1,
        explain: 'The object d was built with the name Rex, and d.name reads that fact back.',
      },
      {
        t: 'predict',
        code: `class Counter:\n    def __init__(self):\n        self.n = 0\n\n    def add(self):\n        self.n = self.n + 1\n\na = Counter()\nb = Counter()\na.add()\na.add()\nb.add()\nprint(a.n, b.n)`,
        question: 'What does this print?',
        options: ['3 3', '2 1', '1 2'],
        answer: 1,
        explain: 'a and b are separate objects with their own n. a was added to twice and b once.',
      },
      {
        t: 'fill',
        prompt: 'What is the special method name that sets up a new object?',
        template: `class Box:\n    def ___(self, size):\n        self.size = size\n\nb = Box(5)\nprint(b.size)`,
        blanks: [{ options: ['__init__', 'init', 'start'], answer: '__init__' }],
        output: '5',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: define the blueprint, build a cat called Tom, and print its name.',
        lines: [`class Cat:`, `    def __init__(self, name):`, `        self.name = name`, `c = Cat("Tom")`, `print(c.name)`],
        output: 'Tom',
      },
      {
        t: 'bug',
        code: `class Cat:\n    def __init__(self, name):\n        name = name\n\nc = Cat("Tom")\nprint(c.name)`,
        question: 'This crashes with an AttributeError. Why?',
        options: ['name was never stored on self, so the object has no name', 'Cat needs brackets after it', 'print cannot read c.name'],
        answer: 0,
        explain: 'name = name only copies the value to a temporary jar inside the method. To keep it in the object you must write self.name = name.',
        fixed: `class Cat:\n    def __init__(self, name):\n        self.name = name\n\nc = Cat("Tom")\nprint(c.name)`,
      },
      {
        t: 'mistakes',
        items: [{ wrong: `class A:\n    def hi():\n        print("Hi")\n\nA().hi()`, why: 'Every method automatically receives the object as its first value. If you forget to list self, Python complains about a surprise extra value.', right: `class A:\n    def hi(self):\n        print("Hi")\n\nA().hi()` }],
      },
      {
        t: 'recap',
        items: ['A class is a blueprint; objects are built from it: `Product("Sugar", 4500, 20)`.', '`__init__(self, ...)` sets up each object’s own facts with `self.name = name`.', 'Methods are functions inside the class. Their first value is always `self`.', 'Every object keeps its own facts.'],
        memory: 'Class = the blueprint. Object = the boda. self = THIS one.',
      },
    ],
    exercises: [
      {
        id: 'py24-wallet',
        title: 'Mobile Money wallet',
        prompt: 'Finish the `Wallet` class. `deposit` adds money. `withdraw` takes money out, but if there is not enough it must print `Not enough money` and change nothing. The program reads the starting balance, a deposit and a withdrawal, then prints the balance.',
        starter: 'class Wallet:\n    def __init__(self, balance):\n        self.balance = balance\n\n    def deposit(self, amount):\n        # add the amount to the balance\n        pass\n\n    def withdraw(self, amount):\n        # take the amount out if there is enough, otherwise print "Not enough money"\n        pass\n\nwallet = Wallet(int(input()))\nwallet.deposit(int(input()))\nwallet.withdraw(int(input()))\nprint("Balance:", wallet.balance)\n',
        sampleInput: '1000\n500\n300',
        usesInput: true,
        tests: [
          { input: '1000\n500\n300', expected: 'Balance: 1200' },
          { input: '1000\n0\n2000', expected: 'Not enough money\nBalance: 1000', name: 'Withdrawing too much' },
          { input: '5000\n1000\n7000', expected: 'Not enough money\nBalance: 6000', hidden: true },
        ],
        hints: [
          'The balance is a fact stored in the object, so use `self.balance` in both methods.',
          'deposit: `self.balance = self.balance + amount`. withdraw: use `if amount > self.balance:` to decide.',
          'A similar example: in the lesson, `sell` reduces `self.stock` only when there is enough.',
        ],
      },
      {
        id: 'py24-product',
        title: 'Worth of the stock',
        prompt: 'Finish the method `total_value` so it returns the price times the stock. The program reads a name, a price and a stock, and prints for example:\n\n`Sugar stock is worth 90000`',
        starter: 'class Product:\n    def __init__(self, name, price, stock):\n        self.name = name\n        self.price = price\n        self.stock = stock\n\n    def total_value(self):\n        # return price times stock\n        pass\n\nname = input()\nprice = int(input())\nstock = int(input())\np = Product(name, price, stock)\nprint(f"{p.name} stock is worth {p.total_value()}")\n',
        sampleInput: 'Sugar\n4500\n20',
        usesInput: true,
        tests: [
          { input: 'Sugar\n4500\n20', expected: 'Sugar stock is worth 90000' },
          { input: 'Rice\n3000\n15', expected: 'Rice stock is worth 45000' },
          { input: 'Salt\n800\n40', expected: 'Salt stock is worth 32000', hidden: true },
        ],
        hints: [
          'The method can read the object’s own facts through `self`.',
          'Replace `pass` with a `return` of `self.price` times `self.stock`.',
          'A similar example: `return self.price * quantity` inside the lesson’s sell method.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 25
  {
    id: 'py-project-saved',
    level: LEVEL,
    minutes: 35,
    title: 'Project: the Duuka that remembers',
    summary: 'Classes and JSON files together: a shop that saves and reloads itself',
    blocks: [
      {
        t: 'story',
        title: 'Tomorrow morning',
        text: 'Mama Rose closes the shop. The program ends, and every variable disappears. Tomorrow morning she will open the program again, and it must remember yesterday’s stock and sales.\n\nYou now have every tool: classes to organise the shop, and files with JSON to remember it. Let us build the final version, step by step.',
      },
      { t: 'h', text: 'Step 1: the Product blueprint' },
      {
        t: 'project',
        title: 'Product with a to_dict method',
        text: 'A Product can sell itself. The new `to_dict` method packs its facts into a dictionary, ready to be saved as JSON.',
        code: `${PRODUCT}\n\nsugar = Product("Sugar", 4500, 20)\nprint(sugar.sell(3))\nprint(sugar.to_dict())\n`,
        output: "13500\n{'name': 'Sugar', 'price': 4500, 'stock': 17}",
      },
      { t: 'h', text: 'Step 2: the Shop that owns the products' },
      {
        t: 'project',
        title: 'The Shop class',
        text: 'A second class, `Shop`, holds a dictionary of products and the day’s sales total. It sells, and it prints a report.',
        code: `${PRODUCT}\n\n${SHOP_BASE}\n\nshop = Shop()\nshop.add_product("Sugar", 4500, 20)\nshop.add_product("Rice", 3000, 15)\nshop.sell("Sugar", 3)\nshop.sell("Tea", 1)\nshop.report()\n`,
        output: 'We do not sell that\nSugar: 17 left\nRice: 15 left\nSales today: 13500',
      },
      { t: 'h', text: 'Step 3: save, close, and open again' },
      {
        t: 'project',
        title: 'The shop that remembers',
        text: '`save` packs everything into a JSON file. Then we create a BRAND NEW shop called `tomorrow`, with no products at all, and `load` brings yesterday back. Watch the stock and the sales total survive.',
        code: `import json\n\n${PRODUCT}\n\n${SHOP_BASE}\n\n${SHOP_SAVE}\n\nshop = Shop()\nshop.add_product("Sugar", 4500, 20)\nshop.add_product("Rice", 3000, 15)\nshop.sell("Sugar", 3)\nshop.sell("Tea", 1)\nshop.report()\nshop.save("duuka.json")\n\nprint("--- next morning ---")\ntomorrow = Shop()\ntomorrow.load("duuka.json")\ntomorrow.sell("Rice", 20)\ntomorrow.report()\n`,
        output: 'We do not sell that\nSugar: 17 left\nRice: 15 left\nSales today: 13500\n--- next morning ---\nNot enough stock\nSugar: 17 left\nRice: 15 left\nSales today: 13500',
      },
      {
        t: 'recap',
        items: ['Classes organise a program: `Product` for one item, `Shop` for the whole business.', 'Each class keeps its own facts and has its own methods.', '`to_dict` and JSON turn objects into text that a file can hold.', 'Saving and loading is how a program remembers between runs. This is how real apps work.', 'You have now built a real, object-oriented program that saves its data.'],
        memory: 'Objects do the work. JSON in a file is their memory.',
      },
      { t: 'tip', text: 'Remember: in this app the file is cleared after each Run, so the save and the load happen in the same program. On a real computer, the `load` could run days later in a completely separate run.' },
    ],
    exercises: [
      {
        id: 'py25-shop',
        title: 'Finish save and load',
        prompt: 'The `Product` and `Shop` classes are written, but `save` and `load` do nothing yet. Finish them:\n\n`save(filename)` writes the sales total and every product (use `to_dict`) into the file as JSON. `load(filename)` reads the file and rebuilds `sales_total` and `products` (use `add_product`).\n\nThe program sells one item, saves, loads into a new shop and prints its report.',
        starter: `import json\n\n${PRODUCT}\n\n${SHOP_BASE}\n\n${SHOP_STUBS}\n\nshop = Shop()\nshop.add_product("Sugar", 4500, 20)\nshop.add_product("Rice", 3000, 15)\nshop.sell(input(), int(input()))\nshop.save("duuka.json")\n\ntomorrow = Shop()\ntomorrow.load("duuka.json")\ntomorrow.report()\n`,
        sampleInput: 'Sugar\n3',
        usesInput: true,
        tests: [
          { input: 'Sugar\n3', expected: 'Sugar: 17 left\nRice: 15 left\nSales today: 13500', name: 'Sell some sugar' },
          { input: 'Rice\n15', expected: 'Sugar: 20 left\nRice: 0 left\nSales today: 45000', name: 'Sell all the rice' },
          { input: 'Tea\n1', expected: 'We do not sell that\nSugar: 20 left\nRice: 15 left\nSales today: 0', name: 'Unknown item', hidden: true },
        ],
        hints: [
          'save: put the sales total and the list of product dictionaries into ONE dictionary, then write it with `json.dump`.',
          'Make the list with `[self.products[name].to_dict() for name in self.products]`. load: read with `json.load`, then rebuild every product.',
          'In load, start with `self.products = {}`, then loop over `data["products"]` calling `self.add_product(item["name"], item["price"], item["stock"])`.',
        ],
      },
    ],
  },
];

export const level3Solution = { PRODUCT, SHOP_BASE, SHOP_SAVE };
