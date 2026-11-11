// Python, Level 4 (Smarter Programs): sorting, flexible functions, inheritance, Mobile Money project.
// In template literals a Python newline escape is written \\n.

const LEVEL = 'Level 4: Smarter Programs';

const ACCOUNT = `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        self.balance = self.balance + amount
        self.history.append(f"+{amount}")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Not enough money")
            return
        self.balance = self.balance - amount
        self.history.append(f"-{amount}")`;

const SAVINGS = `class SavingsAccount(Account):
    def add_interest(self, percent):
        interest = self.balance * percent // 100
        self.deposit(interest)`;

export const level4 = [
  // ------------------------------------------------------------------ 26
  {
    id: 'py-sorting',
    level: LEVEL,
    minutes: 16,
    title: 'Sorting: put things in order',
    summary: 'sorted, reverse, key, lambda and ranking a dictionary',
    blocks: [
      {
        t: 'story',
        title: 'The leaderboard',
        text: 'At the end of the month, Mama Rose wants to know which of her helpers sold the most. She has a list of sales, in the order they were written down: Amina, Okello, Nakato, Zed. She needs the BEST first.\n\nSorting is how a program puts things in order. Done by hand it takes ages. In Python it is one word.',
      },
      { t: 'code', text: `prices = [4500, 800, 3000, 500]\nprint(sorted(prices))\nprint(sorted(prices, reverse=True))\nprint(prices)`, output: '[500, 800, 3000, 4500]\n[4500, 3000, 800, 500]\n[4500, 800, 3000, 500]' },
      {
        t: 'list',
        items: ['`sorted(list)` gives a NEW list, smallest first. The original is unchanged.', '`reverse=True` puts the biggest first.', 'Text sorts alphabetically: `sorted(["tea", "rice", "salt"])` gives rice, salt, tea.', '`list.sort()` sorts the list itself and returns nothing.'],
      },
      { t: 'h', text: 'Sort by something else: key' },
      { t: 'p', text: 'What if you want the SHORTEST words first? Tell `sorted` what to measure with `key`:' },
      { t: 'code', text: `words = ["banana", "fig", "apple"]\nprint(sorted(words, key=len))`, output: "['fig', 'apple', 'banana']" },
      { t: 'analogy', text: '`key` is the measuring tape. Without it, people line up by name. With `key=height`, they line up by height. The people stay the same, only the thing you measure changes.' },
      { t: 'h', text: 'lambda: a tiny throw-away function' },
      { t: 'p', text: 'A list of items with prices is a list of pairs. To sort by the price (the second thing in each pair), write a tiny function without a name, called a **lambda**: `lambda item: item[1]` means “given an item, measure its second part”.' },
      {
        t: 'code',
        text: `items = [("sugar", 4500), ("rice", 3000), ("salt", 800)]\nby_price = sorted(items, key=lambda item: item[1])\nprint(by_price)`,
        output: "[('salt', 800), ('rice', 3000), ('sugar', 4500)]",
      },
      { t: 'h', text: 'Ranking a dictionary' },
      {
        t: 'code',
        text: `sales = {"Amina": 45000, "Okello": 82000, "Nakato": 61000}\nranking = sorted(sales.items(), key=lambda pair: pair[1], reverse=True)\nfor place, (name, total) in enumerate(ranking, 1):\n    print(f"{place}. {name} {total}")`,
        output: '1. Okello 82000\n2. Nakato 61000\n3. Amina 45000',
      },
      { t: 'p', text: '`enumerate(list, 1)` hands you a counter starting at 1 together with each item. That is the neat way to number a list.' },
      { t: 'try', code: `names = ["Zed", "amina", "Okello"]\nprint(sorted(names))\nprint(sorted(names, key=str.lower))\n`, output: "['Okello', 'Zed', 'amina']\n['amina', 'Okello', 'Zed']" },
      { t: 'p', text: 'Capital letters sort before small letters, which surprises many people. `key=str.lower` fixes it. Try your own names.' },
      {
        t: 'predict',
        code: `nums = [3, 1, 2]\nresult = nums.sort()\nprint(result)`,
        question: 'What does this print?',
        options: ['[1, 2, 3]', 'None', '[3, 1, 2]'],
        answer: 1,
        explain: '`sort()` changes the list itself and returns nothing (None). To get a sorted list back, use `sorted(nums)`.',
      },
      {
        t: 'fill',
        prompt: 'Sort the words so the LONGEST comes first.',
        template: `words = ["fig", "banana", "apple"]\nprint(sorted(words, key=len, ___=True))`,
        blanks: [{ options: ['reverse', 'reversed', 'down'], answer: 'reverse' }],
        output: "['banana', 'apple', 'fig']",
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: make the list, sort it from biggest to smallest, and print it.',
        lines: [`scores = [60, 90, 75]`, `best_first = sorted(scores, reverse=True)`, `print(best_first)`],
        output: '[90, 75, 60]',
      },
      {
        t: 'bug',
        code: `prices = [4500, 800, 3000]\nprices = prices.sort()\nprint(prices[0])`,
        question: 'This crashes with a TypeError. Why?',
        options: ['sort() returns None, so prices became None', 'sort needs a key', 'prices[0] is not allowed'],
        answer: 0,
        explain: '`prices.sort()` already sorted the list and returned None. Writing `prices = ...` threw the list away.',
        fixed: `prices = [4500, 800, 3000]\nprices.sort()\nprint(prices[0])`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `names = ["Zed", "amina"]\nprint(sorted(names))`, why: 'No error, but "Zed" comes before "amina" because capital letters sort first. If you wanted a normal alphabet order, add key=str.lower.', right: `names = ["Zed", "amina"]\nprint(sorted(names, key=str.lower))`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: ['`sorted(x)` gives a new sorted list. `x.sort()` changes x and returns None.', '`reverse=True` puts the biggest first.', '`key=` says what to measure. `lambda item: item[1]` measures the second part.', '`sorted(d.items(), key=..., reverse=True)` ranks a dictionary.', '`enumerate(list, 1)` numbers a list from 1.'],
        memory: 'sorted + key = the measuring tape.',
      },
    ],
    exercises: [
      {
        id: 'py26-top',
        title: 'Top three sellers',
        prompt: 'Print the three best sellers, best first, numbered from 1, like:\n\n`1. Okello`\n`2. Nakato`\n`3. Amina`',
        starter: 'sales = {"Amina": 45000, "Okello": 82000, "Nakato": 61000, "Zed": 12000}\n# Print the top 3 names, best first, numbered from 1\n',
        tests: [{ expected: '1. Okello\n2. Nakato\n3. Amina' }],
        hints: [
          'Sort the dictionary’s items by the total, biggest first.',
          '`ranking = sorted(sales.items(), key=lambda pair: pair[1], reverse=True)`, then use only the first three with `ranking[:3]`.',
          'A similar example: the leaderboard in the lesson, which uses `enumerate(ranking, 1)` to number the lines.',
        ],
      },
      {
        id: 'py26-cheapest',
        title: 'Cheapest first',
        prompt: 'Print the item names from cheapest to most expensive, separated by comma and space:\n\n`tea, salt, rice, sugar`',
        starter: 'items = [("sugar", 4500), ("rice", 3000), ("salt", 800), ("tea", 500)]\n# Sort by price and print the names joined with ", "\n',
        tests: [{ expected: 'tea, salt, rice, sugar' }],
        hints: [
          'Sort the pairs by their price (second part), then pick out only the names.',
          '`ordered = sorted(items, key=lambda item: item[1])`, then build a list of the names with a loop or list comprehension.',
          'Then `", ".join(names)` glues the list into one line.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 27
  {
    id: 'py-args',
    level: LEVEL,
    minutes: 16,
    title: 'Flexible functions: defaults, names and many values',
    summary: 'Default values, keyword arguments, *args and returning several values',
    blocks: [
      {
        t: 'story',
        title: 'The boda fare',
        text: 'A boda rider charges 2000 shillings per trip by default. Most customers just say “Town, please” and pay 2000. Some say “Town, but I am in a hurry” and pay extra.\n\nA good function works the same way: it has a **default** that works most of the time, and you only mention the extras when you need them.',
      },
      {
        t: 'code',
        text: `def fare(distance, rate=500):\n    return distance * rate\n\nprint(fare(4))\nprint(fare(4, 800))\nprint(fare(4, rate=1000))`,
        output: '2000\n3200\n4000',
      },
      {
        t: 'list',
        items: ['`rate=500` gives the value a default. If you leave it out, 500 is used.', 'Values with a default must come AFTER those without one.', 'You can name a value when calling: `fare(4, rate=1000)`. Named values can come in any order, and make the call easier to read.'],
      },
      { t: 'analogy', text: 'Ordering a cup of tea: “tea” alone gives you the usual (one sugar). “Tea, sugar=3” changes just that one detail. Everything else stays at the default.' },
      { t: 'h', text: 'Any number of values: *args' },
      { t: 'p', text: 'What if you do not know how many values will come? A star before the name collects them all into a tuple:' },
      {
        t: 'code',
        text: `def total(*prices):\n    return sum(prices)\n\nprint(total(1000, 2500))\nprint(total(500, 500, 500, 500))\nprint(total())`,
        output: '3500\n2000\n0',
      },
      { t: 'h', text: 'Giving back several values' },
      { t: 'p', text: 'A function can `return` several things at once. They arrive as a tuple, and you can unpack them straight into separate names:' },
      {
        t: 'code',
        text: `def smallest_and_biggest(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = smallest_and_biggest([40, 5, 90])\nprint("Low:", low)\nprint("High:", high)`,
        output: 'Low: 5\nHigh: 90',
      },
      { t: 'try', code: `def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Amina"))\nprint(greet("Okello", "Oli otya"))\nprint(greet(greeting="Welcome", name="Zed"))\n`, output: 'Hello, Amina!\nOli otya, Okello!\nWelcome, Zed!' },
      { t: 'p', text: 'Add a third greeting in a language you know.' },
      {
        t: 'predict',
        code: `def add(a, b=10):\n    return a + b\n\nprint(add(5))\nprint(add(5, 1))`,
        question: 'What does this print?',
        options: ['15\n6', '5\n1', '15\n15'],
        answer: 0,
        explain: 'The first call uses the default b = 10, so 5 + 10 = 15. The second gives b = 1, so 5 + 1 = 6.',
      },
      {
        t: 'fill',
        prompt: 'Make the function collect any number of values.',
        template: `def count(___items):\n    return len(items)\n\nprint(count("a", "b", "c"))`,
        blanks: [{ options: ['*', '**', '&'], answer: '*' }],
        output: '3',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines to define a function with a default and call it.',
        lines: [`def area(width, height=2):`, `    return width * height`, `print(area(5))`],
        output: '10',
      },
      {
        t: 'bug',
        code: `def fare(rate=500, distance):\n    return distance * rate\n\nprint(fare(distance=4))`,
        question: 'This stops with a SyntaxError. Why?',
        options: ['A value with a default must come after the ones without', 'fare is a reserved word', 'distance cannot be named'],
        answer: 0,
        explain: 'Python needs the plain values first and the defaults last, otherwise it cannot know which value you meant.',
        fixed: `def fare(distance, rate=500):\n    return distance * rate\n\nprint(fare(distance=4))`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item("rice"))\nprint(add_item("tea"))`, why: 'No error, but the default list is created ONCE and shared by every call, so the second call prints [\'rice\', \'tea\']. Use None as the default and make a new list inside.', right: `def add_item(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket\n\nprint(add_item("rice"))\nprint(add_item("tea"))`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: ['`def f(a, b=10):` b has a default. Defaults go last.', 'Name a value when calling: `f(3, b=7)`.', '`*args` collects any number of values into a tuple.', '`return a, b` gives back two things. Unpack with `x, y = f()`.', 'Never use an empty list as a default value.'],
        memory: 'Defaults are the usual order. Names change one detail.',
      },
    ],
    exercises: [
      {
        id: 'py27-discount',
        title: 'Discount with a default',
        prompt: 'Finish `discount(price, percent=10)`. It returns the price after taking off the percent (whole shillings, use `//`). The program reads a price, then prints the price with the default discount, and with a 25% discount.',
        starter: 'def discount(price, percent=10):\n    # return the price after taking off the percent\n    pass\n\nprice = int(input())\nprint(discount(price))\nprint(discount(price, percent=25))\n',
        sampleInput: '10000',
        usesInput: true,
        tests: [
          { input: '10000', expected: '9000\n7500' },
          { input: '2000', expected: '1800\n1500' },
          { input: '5000', expected: '4500\n3750', hidden: true },
        ],
        hints: [
          'The amount taken off is the price times the percent, divided by 100.',
          '`return price - price * percent // 100`',
          'A similar example: `def fare(distance, rate=500): return distance * rate` in the lesson.',
        ],
      },
      {
        id: 'py27-stats',
        title: 'Min, max and average',
        prompt: 'Finish `stats(numbers)`. It returns three values: the smallest, the biggest and the average. The program reads numbers on one line and prints:\n\n`Min: 2`\n`Max: 9`\n`Average: 5.0`',
        starter: 'def stats(numbers):\n    # return the smallest, the biggest and the average\n    pass\n\nnumbers = [int(x) for x in input().split()]\nlow, high, average = stats(numbers)\nprint("Min:", low)\nprint("Max:", high)\nprint("Average:", average)\n',
        sampleInput: '2 9 4',
        usesInput: true,
        tests: [
          { input: '2 9 4', expected: 'Min: 2\nMax: 9\nAverage: 5.0' },
          { input: '10 20', expected: 'Min: 10\nMax: 20\nAverage: 15.0' },
          { input: '7 7 7', expected: 'Min: 7\nMax: 7\nAverage: 7.0', hidden: true },
        ],
        hints: [
          'You already know functions for the smallest, the biggest, the total and the count.',
          'Return three things separated by commas: `return min(numbers), max(numbers), sum(numbers) / len(numbers)`.',
          'A similar example: `return min(numbers), max(numbers)` in the lesson.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 28
  {
    id: 'py-inheritance',
    level: LEVEL,
    minutes: 20,
    title: 'Inheritance: children get the parent’s skills',
    summary: 'Extending a class, super(), overriding methods',
    blocks: [
      {
        t: 'story',
        title: 'A family of accounts',
        text: 'Mobile Money has a normal account: you can deposit and withdraw. A **savings account** can do all of that too, plus one extra thing: it earns interest.\n\nIt would be silly to copy all the normal-account code again. Instead, the savings account says: “I am a normal account, AND I can do this extra thing.” This is called **inheritance**. The child inherits everything the parent can do.',
      },
      {
        t: 'code',
        text: `class Account:\n    def __init__(self, balance):\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance = self.balance + amount\n\nclass SavingsAccount(Account):\n    def add_interest(self, percent):\n        self.deposit(self.balance * percent // 100)\n\nsavings = SavingsAccount(10000)\nsavings.add_interest(10)\nsavings.deposit(500)\nprint(savings.balance)`,
        output: '11500',
      },
      {
        t: 'list',
        items: ['`class SavingsAccount(Account):` means SavingsAccount is built on Account.', 'The child has every method of the parent: `__init__` and `deposit` came for free.', 'The child adds its own methods: `add_interest`.', 'The parent is called the **base class**, the child the **subclass**.'],
      },
      { t: 'analogy', text: 'A child inherits the family name and the family land from the parents, then adds their own skills. The child does not have to buy the land again.' },
      { t: 'h', text: 'Changing what the parent does: overriding' },
      { t: 'p', text: 'A child can replace a method with its own version. And `super()` lets the child still use the parent’s version as a starting point:' },
      {
        t: 'code',
        text: `class Vehicle:\n    def __init__(self, name, wheels):\n        self.name = name\n        self.wheels = wheels\n\n    def describe(self):\n        return f"{self.name} has {self.wheels} wheels"\n\nclass Boda(Vehicle):\n    def __init__(self):\n        super().__init__("Boda boda", 2)\n\nclass Taxi(Vehicle):\n    def __init__(self):\n        super().__init__("Taxi", 4)\n\n    def describe(self):\n        return super().describe() + " and carries 14 people"\n\nprint(Boda().describe())\nprint(Taxi().describe())`,
        output: 'Boda boda has 2 wheels\nTaxi has 4 wheels and carries 14 people',
      },
      { t: 'p', text: '`super()` means “my parent”. `super().__init__("Boda boda", 2)` sets up the parent’s facts so the Boda does not repeat them. In Taxi, `describe` is **overridden**: it first asks the parent for the usual sentence and then adds more.' },
      { t: 'try', code: `class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n\nclass Fish(Animal):\n    pass\n\nfor pet in [Dog(), Fish()]:\n    print(pet.speak())\n`, output: 'Woof\n...' },
      { t: 'p', text: 'The Fish has no `speak` of its own, so it uses the parent’s. The Dog replaced it. Add a Cat.' },
      {
        t: 'predict',
        code: `class A:\n    def hi(self):\n        return "A"\n\nclass B(A):\n    pass\n\nprint(B().hi())`,
        question: 'What does this print?',
        options: ['A', 'B', 'an error'],
        answer: 0,
        explain: 'B inherits everything from A, so B().hi() finds the method in A and returns "A".',
      },
      {
        t: 'fill',
        prompt: 'Make Dog a child of Animal.',
        template: `class Animal:\n    def eat(self):\n        return "nom"\n\nclass Dog(___):\n    pass\n\nprint(Dog().eat())`,
        blanks: [{ options: ['Animal', 'Dog', 'self'], answer: 'Animal' }],
        output: 'nom',
      },
      {
        t: 'quiz',
        question: 'Which first line makes Eagle a child of Bird?',
        options: ['class Eagle(Bird):', 'class Bird(Eagle):', 'class Eagle.Bird:'],
        answer: 0,
        explain: 'The parent goes in brackets after the child’s name: `class Child(Parent):`.',
      },
      {
        t: 'bug',
        code: `class Vehicle:\n    def __init__(self, name):\n        self.name = name\n\nclass Boda(Vehicle):\n    def __init__(self):\n        self.wheels = 2\n\nprint(Boda().name)`,
        question: 'This crashes with an AttributeError. Why?',
        options: ['Boda’s __init__ replaced the parent’s and never set the name', 'wheels cannot be 2', 'Boda must not inherit'],
        answer: 0,
        explain: 'When the child defines its own `__init__`, the parent’s one does NOT run unless you call it with `super().__init__(...)`.',
        fixed: `class Vehicle:\n    def __init__(self, name):\n        self.name = name\n\nclass Boda(Vehicle):\n    def __init__(self):\n        super().__init__("Boda")\n        self.wheels = 2\n\nprint(Boda().name)`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `class Vehicle:\n    def __init__(self, name, wheels):\n        self.name = name\n        self.wheels = wheels\n\nclass Taxi(Vehicle):\n    def __init__(self):\n        Vehicle.__init__()\n\nTaxi()`, why: 'Calling the parent’s setup by hand forgets self. The modern and safer way is super().__init__(...), which also supplies self for you.', right: `class Vehicle:\n    def __init__(self, name, wheels):\n        self.name = name\n        self.wheels = wheels\n\nclass Taxi(Vehicle):\n    def __init__(self):\n        super().__init__("Taxi", 4)\n\nprint(Taxi().name)` },
        ],
      },
      {
        t: 'recap',
        items: ['`class Child(Parent):` the child inherits all of the parent’s methods.', 'The child can add new methods and override old ones.', '`super()` means “my parent”: use it to run the parent’s version.', 'If the child has its own `__init__`, call `super().__init__(...)` to set up the parent’s facts.'],
        memory: 'Inheritance = the child gets the family land for free.',
      },
    ],
    exercises: [
      {
        id: 'py28-savings',
        title: 'Savings with interest',
        prompt: 'Finish `add_interest` in `SavingsAccount`. It adds `percent` percent of the balance (whole shillings, use `//`) by using the inherited `deposit`. The program reads a balance, adds 10% interest, then deposits 1000 and prints the balance.',
        starter: 'class Account:\n    def __init__(self, balance):\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance = self.balance + amount\n\nclass SavingsAccount(Account):\n    def add_interest(self, percent):\n        # work out the interest and deposit it\n        pass\n\nsavings = SavingsAccount(int(input()))\nsavings.add_interest(10)\nsavings.deposit(1000)\nprint("Balance:", savings.balance)\n',
        sampleInput: '10000',
        usesInput: true,
        tests: [
          { input: '10000', expected: 'Balance: 12000' },
          { input: '5000', expected: 'Balance: 6500' },
          { input: '2000', expected: 'Balance: 3200', hidden: true },
        ],
        hints: [
          'The interest is the balance times the percent divided by 100.',
          '`interest = self.balance * percent // 100`, then give it to `self.deposit(...)`.',
          'A similar example: the lesson’s add_interest, which calls `self.deposit` for you.',
        ],
      },
      {
        id: 'py28-vehicles',
        title: 'Build the Boda',
        prompt: 'Taxi is finished. Finish `Boda` so it is a Vehicle called `Boda boda` with 2 wheels, and the program prints:\n\n`Boda boda has 2 wheels`\n`Taxi has 4 wheels`',
        starter: 'class Vehicle:\n    def __init__(self, name, wheels):\n        self.name = name\n        self.wheels = wheels\n\n    def describe(self):\n        return f"{self.name} has {self.wheels} wheels"\n\nclass Taxi(Vehicle):\n    def __init__(self):\n        super().__init__("Taxi", 4)\n\nclass Boda(Vehicle):\n    # give Boda its own __init__ that sets the name and the wheels\n    pass\n\nprint(Boda().describe())\nprint(Taxi().describe())\n',
        tests: [{ expected: 'Boda boda has 2 wheels\nTaxi has 4 wheels' }],
        hints: [
          'Copy the way Taxi does it.',
          'Give Boda an `__init__(self)` method.',
          'Inside it write `super().__init__("Boda boda", 2)`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 29
  {
    id: 'py-project-momo',
    level: LEVEL,
    minutes: 30,
    title: 'Project: Mobile Money simulator',
    summary: 'Accounts, savings accounts, history and a command reader, all in one program',
    blocks: [
      {
        t: 'story',
        title: 'Your own mini Mobile Money',
        text: 'Every day millions of people in Uganda send and receive money from a phone. Behind it is a program very much like the one you are about to build: accounts that hold money, rules that refuse to overdraw, a history of every move, and a savings account that earns interest.\n\nYou already know every piece. Let us put them together.',
      },
      { t: 'h', text: 'Step 1: the Account with history' },
      {
        t: 'project',
        title: 'Account',
        text: 'Every deposit and withdrawal is noted in a history list. A withdrawal that is too big is refused and changes nothing.',
        code: `${ACCOUNT}\n\nacc = Account("Amina", 5000)\nacc.deposit(2000)\nacc.withdraw(1500)\nacc.withdraw(99999)\nprint(acc.balance)\nprint(acc.history)\n`,
        output: "Not enough money\n5500\n['+2000', '-1500']",
      },
      { t: 'h', text: 'Step 2: the SavingsAccount' },
      {
        t: 'project',
        title: 'SavingsAccount',
        text: 'The savings account inherits everything and adds interest. Notice that the interest also lands in the history, because it uses the inherited `deposit`.',
        code: `${ACCOUNT}\n\n${SAVINGS}\n\nsave = SavingsAccount("Okello", 20000)\nsave.add_interest(5)\nsave.withdraw(3000)\nprint(save.balance)\nprint(save.history)\n`,
        output: "18000\n['+1000', '-3000']",
      },
      { t: 'h', text: 'Step 3: a command reader' },
      {
        t: 'project',
        title: 'Reading commands',
        text: 'A real phone app takes commands. We will read lines like `deposit 5000` or `withdraw 2000`, split them, and decide what to do. Notice how a dictionary of accounts, a loop, and `split` work together, like the shop in Level 3.',
        code: `${ACCOUNT}\n\n${SAVINGS}\n\ncommands = ["deposit 5000", "withdraw 2000", "interest 10", "withdraw 99999", "balance"]\nacc = SavingsAccount("Amina", 1000)\nfor line in commands:\n    parts = line.split()\n    action = parts[0]\n    if action == "deposit":\n        acc.deposit(int(parts[1]))\n    elif action == "withdraw":\n        acc.withdraw(int(parts[1]))\n    elif action == "interest":\n        acc.add_interest(int(parts[1]))\n    elif action == "balance":\n        print("Balance:", acc.balance)\nprint(acc.history)\n`,
        output: "Not enough money\nBalance: 4400\n['+5000', '-2000', '+400']",
      },
      {
        t: 'recap',
        items: ['One class for each kind of thing: `Account`, and `SavingsAccount` that inherits from it.', 'The history list records every change, and the program refuses impossible withdrawals.', '`split()` and `if/elif` turn a line of text into an action.', 'This is how real money apps are structured, with a lot more safety on top.'],
        memory: 'Classes for things, functions for actions, lists for history.',
      },
    ],
    exercises: [
      {
        id: 'py29-momo',
        title: 'Run the commands',
        prompt: 'The accounts are written. Finish the loop. It reads commands until it meets the word `done`:\n\n`deposit N` adds N, `withdraw N` takes out N, `interest N` adds N percent interest, and `balance` prints `Balance: ` and the balance. At the end print the history list.',
        starter: `${ACCOUNT}\n\n${SAVINGS}\n\nacc = SavingsAccount("Amina", 1000)\nwhile True:\n    line = input()\n    if line == "done":\n        break\n    # split the line and do what it says\n\nprint(acc.history)\n`,
        sampleInput: 'deposit 5000\nwithdraw 2000\ninterest 10\nbalance\ndone',
        usesInput: true,
        tests: [
          { input: 'deposit 5000\nwithdraw 2000\ninterest 10\nbalance\ndone', expected: "Balance: 4400\n['+5000', '-2000', '+400']" },
          { input: 'withdraw 5000\nbalance\ndone', expected: "Not enough money\nBalance: 1000\n[]", name: 'Refused withdrawal' },
          { input: 'interest 50\ndeposit 100\nbalance\ndone', expected: "Balance: 1600\n['+500', '+100']", hidden: true },
        ],
        hints: [
          'Cut the line into the command word and the number.',
          '`parts = line.split()` then `action = parts[0]`. Use if/elif on the action and `int(parts[1])` for the number.',
          'A similar example: the lesson’s Step 3 loop, which handles deposit, withdraw, interest and balance.',
        ],
      },
    ],
  },
];

export const level4Solution = { ACCOUNT, SAVINGS };
