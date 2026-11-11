// Python, Level 5 (Pro Python): collections, dates, zip/generators, testing, sales report project.
// In template literals a Python newline escape is written \\n.

const LEVEL = 'Level 5: Pro Python';

const ANALYZE = `def analyze(lines):
    by_item = defaultdict(int)
    by_day = defaultdict(int)
    for line in lines:
        day, item, qty, price = line.split(",")
        money = int(qty) * int(price)
        by_item[item] += money
        by_day[day] += money
    return by_item, by_day`;

const REPORT = `def report(lines):
    by_item, by_day = analyze(lines)
    print("Revenue by item:")
    ranking = sorted(by_item.items(), key=lambda pair: pair[1], reverse=True)
    for item, money in ranking:
        print(f"{item}: {money:,}")
    print(f"Total: {sum(by_item.values()):,}")
    best = max(by_day, key=by_day.get)
    weekday = date.fromisoformat(best).strftime("%A")
    print(f"Best day: {weekday} {best} ({by_day[best]:,})")`;

const DATA = `2026-11-02,sugar,3,4500
2026-11-02,rice,2,3000
2026-11-03,sugar,1,4500
2026-11-03,salt,10,800
2026-11-04,rice,5,3000
2026-11-04,tea,4,500`;

export const level5 = [
  // ------------------------------------------------------------------ 30
  {
    id: 'py-collections',
    level: LEVEL,
    minutes: 16,
    title: 'Counting and grouping like a pro',
    summary: 'Counter, most_common and defaultdict',
    blocks: [
      {
        t: 'story',
        title: 'Who comes most often?',
        text: 'Mama Rose writes down the name of every customer who walks in. At the end of the week she wants to know: who came most often? Counting by hand with a dictionary works (you did it in Level 2), but it takes five lines every time.\n\nPython has a toolbox called `collections` with tools built for exactly this job.',
      },
      {
        t: 'code',
        text: `from collections import Counter\n\nwords = "the cat and the dog and the bird".split()\ncounts = Counter(words)\nprint(counts["the"])\nprint(counts["zebra"])\nprint(counts.most_common(2))`,
        output: "3\n0\n[('the', 3), ('and', 2)]",
      },
      {
        t: 'list',
        items: ['`Counter(list)` counts how many times each item appears.', 'Asking for something that is not there gives 0, not an error.', '`most_common(n)` gives the top n as a list of (item, count) pairs, biggest first.'],
      },
      { t: 'analogy', text: 'A Counter is a tally board at a football match: every time a name is called, one more stick is added. You never have to ask “is this name on the board yet?”' },
      { t: 'h', text: 'Grouping with defaultdict' },
      { t: 'p', text: 'Another common job: adding up money per district. With a normal dictionary you must first check whether the district is already there. A `defaultdict(int)` starts every new key at 0 for you:' },
      {
        t: 'code',
        text: `from collections import defaultdict\n\nsales = [("Kampala", 5000), ("Gulu", 2000), ("Kampala", 3000)]\ntotals = defaultdict(int)\nfor district, amount in sales:\n    totals[district] += amount\nprint(dict(totals))`,
        output: "{'Kampala': 8000, 'Gulu': 2000}",
      },
      { t: 'p', text: 'Use `defaultdict(list)` when each key should collect a LIST of things:' },
      {
        t: 'code',
        text: `from collections import defaultdict\n\npeople = [("Kampala", "Amina"), ("Gulu", "Okello"), ("Kampala", "Zed")]\nby_town = defaultdict(list)\nfor town, name in people:\n    by_town[town].append(name)\nprint(dict(by_town))`,
        output: "{'Kampala': ['Amina', 'Zed'], 'Gulu': ['Okello']}",
      },
      { t: 'try', code: `from collections import Counter\n\nvotes = ["A", "B", "A", "C", "A", "B"]\nprint(Counter(votes).most_common(1))\nprint(Counter("banana"))\n`, output: "[('A', 3)]\nCounter({'a': 3, 'n': 2, 'b': 1})" },
      { t: 'p', text: 'A Counter can even count the letters inside a word. Try your own name.' },
      {
        t: 'predict',
        code: `from collections import Counter\nc = Counter(["x", "y", "x"])\nprint(c["x"] + c["z"])`,
        question: 'What does this print?',
        options: ['2', '3', 'an error'],
        answer: 0,
        explain: 'x appears twice and the missing z counts as 0, so 2 + 0 = 2.',
      },
      {
        t: 'fill',
        prompt: 'Print the single most common item.',
        template: `from collections import Counter\nc = Counter("aabbb")\nprint(c.___(1))`,
        blanks: [{ options: ['most_common', 'top', 'biggest'], answer: 'most_common' }],
        output: "[('b', 3)]",
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: borrow Counter, count the letters of "aab", print how many a there are.',
        lines: [`from collections import Counter`, `c = Counter("aab")`, `print(c["a"])`],
        output: '2',
      },
      {
        t: 'bug',
        code: `totals = {}\ntotals["Gulu"] += 2000\nprint(totals)`,
        question: 'This crashes with a KeyError. Why?',
        options: ['Gulu is not in the dictionary yet, so there is nothing to add to', 'You cannot use += on a dictionary', 'totals must be a list'],
        answer: 0,
        explain: 'A normal dictionary cannot add to a key that does not exist. A defaultdict(int) creates it at 0 for you.',
        fixed: `from collections import defaultdict\n\ntotals = defaultdict(int)\ntotals["Gulu"] += 2000\nprint(dict(totals))`,
      },
      {
        t: 'mistakes',
        items: [{ wrong: `from collections import Counter\nprint(Counter(["a", "b"]).most_common)`, why: 'Without brackets you get the method itself, not the answer. Call it: most_common(1).', right: `from collections import Counter\nprint(Counter(["a", "b"]).most_common(1))`, logic: true }],
      },
      {
        t: 'recap',
        items: ['`Counter(items)` counts. A missing item counts 0.', '`most_common(n)` gives the top n pairs.', '`defaultdict(int)` adds up per key with no setup. `defaultdict(list)` collects lists.', 'Wrap with `dict(...)` to print a clean dictionary.'],
        memory: 'Counter = tally board. defaultdict = a drawer that appears when needed.',
      },
    ],
    exercises: [
      {
        id: 'py30-words',
        title: 'Most common word',
        prompt: 'Read one line of words. Print the most common word and how many times it appears, like `the: 3`.',
        starter: 'from collections import Counter\n\nline = input()\n# Print the most common word and its count\n',
        sampleInput: 'the cat and the dog and the bird',
        usesInput: true,
        tests: [
          { input: 'the cat and the dog and the bird', expected: 'the: 3' },
          { input: 'go go go stop', expected: 'go: 3' },
          { input: 'a b b', expected: 'b: 2', hidden: true },
        ],
        hints: [
          'Cut the line into words, count them, ask for the top one.',
          '`counts = Counter(line.split())` then `counts.most_common(1)` gives a list with one pair in it.',
          'Take the pair with `[0]` and unpack it: `word, n = counts.most_common(1)[0]`.',
        ],
      },
      {
        id: 'py30-group',
        title: 'Total per district',
        prompt: 'Add up the sales per district and print each district (alphabetical order) like:\n\n`Gulu: 6000`\n`Kampala: 8000`\n`Mbale: 1500`',
        starter: 'from collections import defaultdict\n\nsales = [("Kampala", 5000), ("Gulu", 2000), ("Kampala", 3000), ("Mbale", 1500), ("Gulu", 4000)]\n# Add up per district and print them alphabetically\n',
        tests: [{ expected: 'Gulu: 6000\nKampala: 8000\nMbale: 1500' }],
        hints: [
          'Make a defaultdict(int) and add each amount to its district.',
          '`totals[district] += amount` inside a loop over `sales`.',
          'Finish with `for district in sorted(totals):` and print `f"{district}: {totals[district]}"`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 31
  {
    id: 'py-dates',
    level: LEVEL,
    minutes: 16,
    title: 'Dates and time',
    summary: 'date, timedelta, weekdays, formatting and counting days',
    blocks: [
      {
        t: 'story',
        title: 'When is the rent due?',
        text: 'Almost every real app deals with dates: a school fee due in 30 days, a loan that ends on a given day, the weekday of a market. Dates are tricky for humans (how many days is it from the 11th of November to Christmas?), but the computer counts them perfectly.',
      },
      {
        t: 'code',
        text: `from datetime import date\n\ntoday = date(2026, 11, 11)\nprint(today)\nprint(today.year, today.month, today.day)\nprint(today.strftime("%A"))`,
        output: '2026-11-11\n2026 11 11\nWednesday',
      },
      { t: 'p', text: '`date(year, month, day)` builds a date. `strftime` (“string from time”) turns it into text. The little codes say what to show:' },
      {
        t: 'list',
        items: ['`%A` weekday name (Wednesday)', '`%d` day, `%m` month number, `%Y` four-digit year', '`%B` month name (November), `%b` short (Nov)'],
      },
      { t: 'code', text: `from datetime import date\n\nd = date(2026, 12, 25)\nprint(d.strftime("%d %B %Y"))\nprint(d.strftime("%d/%m/%Y"))`, output: '25 December 2026\n25/12/2026' },
      { t: 'h', text: 'Adding and subtracting days' },
      {
        t: 'code',
        text: `from datetime import date, timedelta\n\ntoday = date(2026, 11, 11)\nprint(today + timedelta(days=30))\n\nchristmas = date(2026, 12, 25)\nprint((christmas - today).days)`,
        output: '2026-12-11\n44',
      },
      { t: 'analogy', text: 'A `timedelta` is a length of time, like a piece of string cut to “30 days”. Add it to a date to walk forward; subtract two dates and you get the string between them.' },
      { t: 'h', text: 'Reading a date from text' },
      {
        t: 'code',
        text: `from datetime import date, datetime\n\nprint(date.fromisoformat("2026-03-08"))\nd = datetime.strptime("08/03/2026", "%d/%m/%Y").date()\nprint(d.strftime("%A"))`,
        output: '2026-03-08\nSunday',
      },
      { t: 'p', text: '`date.fromisoformat` reads the standard `YYYY-MM-DD` form. For other layouts, `strptime` takes the text and the pattern that describes it.' },
      { t: 'try', code: `from datetime import date, timedelta\n\nstart = date(2026, 1, 31)\nfor i in range(3):\n    print(start + timedelta(days=i * 7))\n`, output: '2026-01-31\n2026-02-07\n2026-02-14' },
      { t: 'p', text: 'Change start to your birthday this year and see what weekday it falls on with `strftime("%A")`.' },
      {
        t: 'predict',
        code: `from datetime import date\n\nprint((date(2026, 3, 1) - date(2026, 1, 1)).days)`,
        question: 'What does this print?',
        options: ['59', '60', '2'],
        answer: 0,
        explain: 'January has 31 days and February 2026 has 28, so 31 + 28 = 59 days from 1 January to 1 March.',
      },
      {
        t: 'fill',
        prompt: 'Which unit of time moves the date 10 days forward?',
        template: `from datetime import date, timedelta\n\nprint(date(2026, 1, 1) + timedelta(___=10))`,
        blanks: [{ options: ['days', 'day', 'daily'], answer: 'days' }],
        output: '2026-01-11',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: borrow date and timedelta, make a date, print one week later.',
        lines: [`from datetime import date, timedelta`, `d = date(2026, 5, 1)`, `print(d + timedelta(days=7))`],
        output: '2026-05-08',
      },
      {
        t: 'bug',
        code: `from datetime import date\n\nprint(date(2026, 13, 1))`,
        question: 'This crashes with a ValueError. Why?',
        options: ['There is no month number 13', 'date needs a weekday', 'The year is too big'],
        answer: 0,
        explain: 'Months go from 1 to 12. Python checks real calendars, so impossible dates like 31 February are refused too.',
        fixed: `from datetime import date\n\nprint(date(2026, 12, 1))`,
      },
      {
        t: 'mistakes',
        items: [{ wrong: `from datetime import date\n\nprint(date(2026, 12, 25) - date(2026, 11, 11))`, why: 'No error, but the answer is printed as a long sentence like “44 days, 0:00:00”. To get a plain number use .days.', right: `from datetime import date\n\nprint((date(2026, 12, 25) - date(2026, 11, 11)).days)`, logic: true }],
      },
      {
        t: 'recap',
        items: ['`date(2026, 11, 11)` builds a date. `date.fromisoformat("2026-11-11")` reads one.', '`strftime("%A %d %B %Y")` formats a date as text.', '`date + timedelta(days=30)` moves forward; `date2 - date1` gives a timedelta, and `.days` is the number.', '`datetime.strptime(text, pattern)` reads other layouts.'],
        memory: 'timedelta = a piece of string cut to a length of time.',
      },
    ],
    exercises: [
      {
        id: 'py31-due',
        title: 'Fee due in 30 days',
        prompt: 'Read a date like `2026-11-11` (year-month-day). Print the date 30 days later like `Due: 2026-12-11`.',
        starter: 'from datetime import date, timedelta\n\ntext = input()\n# Print the date 30 days later like: Due: 2026-12-11\n',
        sampleInput: '2026-11-11',
        usesInput: true,
        tests: [
          { input: '2026-11-11', expected: 'Due: 2026-12-11' },
          { input: '2026-01-15', expected: 'Due: 2026-02-14' },
          { input: '2026-12-20', expected: 'Due: 2027-01-19', hidden: true },
        ],
        hints: [
          'Turn the text into a date first, then add 30 days.',
          '`start = date.fromisoformat(text)` then `start + timedelta(days=30)`.',
          'A date prints as 2026-12-11 by itself, so `print("Due:", due)` is enough.',
        ],
      },
      {
        id: 'py31-days',
        title: 'Days between',
        prompt: 'Read two dates (one per line, `YYYY-MM-DD`). Print how many days from the first to the second, like `59 days`.',
        starter: 'from datetime import date\n\nfirst = input()\nsecond = input()\n# Print the number of days between them, like: 59 days\n',
        sampleInput: '2026-01-01\n2026-03-01',
        usesInput: true,
        tests: [
          { input: '2026-01-01\n2026-03-01', expected: '59 days' },
          { input: '2026-11-01\n2026-11-11', expected: '10 days' },
          { input: '2026-12-25\n2026-12-31', expected: '6 days', hidden: true },
        ],
        hints: [
          'Read both as dates, subtract, and keep only the number of days.',
          '`a = date.fromisoformat(first)`, same for second, then `(b - a).days`.',
          'Print with an f-string: `f"{number} days"`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 32
  {
    id: 'py-iteration',
    level: LEVEL,
    minutes: 18,
    title: 'Loops like a pro: zip and generators',
    summary: 'zip two lists, enumerate, yield and lazy sequences',
    blocks: [
      {
        t: 'story',
        title: 'Names and scores, side by side',
        text: 'Mama Rose has two lists: the names of her helpers and how many sales each made. They are separate lists, but the first name goes with the first score, the second with the second.\n\nWalking down two lists at once is like a zip on a jacket: the teeth meet in pairs.',
      },
      {
        t: 'code',
        text: `names = ["Amina", "Okello", "Zed"]\nscores = [80, 65, 90]\nfor name, score in zip(names, scores):\n    print(f"{name}: {score}")`,
        output: 'Amina: 80\nOkello: 65\nZed: 90',
      },
      { t: 'p', text: '`zip` stops at the shorter list. To build a dictionary from two lists, zip them and wrap with `dict`:' },
      { t: 'code', text: `names = ["Amina", "Okello"]\nscores = [80, 65]\nprint(dict(zip(names, scores)))`, output: "{'Amina': 80, 'Okello': 65}" },
      { t: 'h', text: 'enumerate: a counter that comes free' },
      { t: 'code', text: `for number, name in enumerate(["Amina", "Okello"], start=1):\n    print(number, name)`, output: '1 Amina\n2 Okello' },
      { t: 'h', text: 'Generators: produce one at a time with yield' },
      { t: 'p', text: 'A normal function ends with `return`. A **generator** uses `yield`: it hands out one value, then PAUSES, and continues from the same spot when the loop asks for the next one.' },
      {
        t: 'code',
        text: `def countdown(n):\n    while n > 0:\n        yield n\n        n = n - 1\n\nfor x in countdown(3):\n    print(x)\nprint("Lift off!")`,
        output: '3\n2\n1\nLift off!',
      },
      { t: 'analogy', text: 'A generator is a boda rider who takes ONE passenger at a time. A `return` function is a bus that must load everyone first. If there are a million passengers, the boda never needs a million seats at once.' },
      {
        t: 'code',
        text: `def evens(limit):\n    for n in range(2, limit + 1, 2):\n        yield n\n\nprint(list(evens(10)))\nprint(sum(n * n for n in range(1, 4)))`,
        output: '[2, 4, 6, 8, 10]\n14',
      },
      { t: 'p', text: '`list(generator)` collects everything at once. The last line uses a **generator expression**: like a list comprehension, but with no brackets and nothing built in memory. 1 + 4 + 9 = 14.' },
      { t: 'try', code: `def squares(n):\n    for i in range(1, n + 1):\n        yield i * i\n\nfor s in squares(5):\n    print(s)\n`, output: '1\n4\n9\n16\n25' },
      { t: 'p', text: 'Change squares into cubes (`i * i * i`).' },
      {
        t: 'predict',
        code: `a = [1, 2, 3]\nb = ["x", "y"]\nprint(list(zip(a, b)))`,
        question: 'What does this print?',
        options: ["[(1, 'x'), (2, 'y')]", "[(1, 'x'), (2, 'y'), (3, None)]", 'an error'],
        answer: 0,
        explain: 'zip stops when the shorter list runs out, so the 3 has no partner and is left out.',
      },
      {
        t: 'fill',
        prompt: 'Which word makes a function a generator?',
        template: `def three():\n    for i in range(3):\n        ___ i\n\nprint(list(three()))`,
        blanks: [{ options: ['yield', 'return', 'give'], answer: 'yield' }],
        output: '[0, 1, 2]',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines to walk down two lists together and print each pair.',
        lines: [`names = ["A", "B"]`, `ages = [len(n) * 10 for n in names]`, `for n, a in zip(names, ages):`, `    print(n, a)`],
        output: 'A 10\nB 10',
      },
      {
        t: 'bug',
        code: `def numbers():\n    yield 1\n    yield 2\n\nprint(numbers()[0])`,
        question: 'This crashes with a TypeError. Why?',
        options: ['A generator gives values one at a time; it cannot be indexed', 'yield cannot be used twice', 'numbers needs a parameter'],
        answer: 0,
        explain: 'A generator is not a list. Loop over it, or turn it into a list first with list(numbers()).',
        fixed: `def numbers():\n    yield 1\n    yield 2\n\nprint(list(numbers())[0])`,
      },
      {
        t: 'mistakes',
        items: [{ wrong: `def numbers():\n    yield 1\n    yield 2\n\nprint(numbers())`, why: 'No error, but it prints something like <generator object numbers at 0x...> because nothing has been asked for yet. Loop over it or use list(...).', right: `def numbers():\n    yield 1\n    yield 2\n\nprint(list(numbers()))`, logic: true }],
      },
      {
        t: 'recap',
        items: ['`zip(a, b)` walks two lists together and stops at the shorter one.', '`dict(zip(keys, values))` builds a dictionary from two lists.', '`enumerate(items, start=1)` gives a counter for free.', '`yield` makes a generator: it produces one value at a time, then pauses.', 'Use `list(generator)` to see all the values.'],
        memory: 'zip = jacket teeth. yield = one passenger at a time.',
      },
    ],
    exercises: [
      {
        id: 'py32-zip',
        title: 'Names with scores',
        prompt: 'Print each helper with their score, one per line, like `Amina: 80`.',
        starter: 'names = ["Amina", "Okello", "Nakato"]\nscores = [80, 65, 92]\n# Print each name with its score, like: Amina: 80\n',
        tests: [{ expected: 'Amina: 80\nOkello: 65\nNakato: 92' }],
        hints: [
          'You need to look at the two lists together.',
          '`for name, score in zip(names, scores):`',
          'Print `f"{name}: {score}"` inside the loop.',
        ],
      },
      {
        id: 'py32-gen',
        title: 'Even numbers generator',
        prompt: 'Finish the generator `evens(limit)` so it yields every even number from 2 up to and including the limit. The program prints them as a list.',
        starter: 'def evens(limit):\n    # yield 2, 4, 6 ... up to the limit\n    pass\n\nprint(list(evens(int(input()))))\n',
        sampleInput: '10',
        usesInput: true,
        tests: [
          { input: '10', expected: '[2, 4, 6, 8, 10]' },
          { input: '5', expected: '[2, 4]' },
          { input: '1', expected: '[]', hidden: true },
        ],
        hints: [
          'A loop with `range` can step by 2.',
          '`for n in range(2, limit + 1, 2):`',
          'Inside the loop write `yield n`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 33
  {
    id: 'py-testing',
    level: LEVEL,
    minutes: 16,
    title: 'Testing: prove your code works',
    summary: 'assert, edge cases and test-first thinking',
    blocks: [
      {
        t: 'story',
        title: 'The shopkeeper who counts the change twice',
        text: 'Mama Rose counts the change twice before handing it over, because a mistake costs money and trust. Programmers do the same: they write small checks that prove the code does what they said.\n\nThese checks are called **tests**. Professional developers write them all the time; this is what makes a big program safe to change.',
      },
      {
        t: 'code',
        text: `def is_even(n):\n    return n % 2 == 0\n\nassert is_even(4)\nassert not is_even(7)\nprint("All tests passed")`,
        output: 'All tests passed',
      },
      {
        t: 'list',
        items: ['`assert condition` does nothing if the condition is True.', 'If the condition is False it STOPS with an `AssertionError`.', 'So a program that prints “All tests passed” proves every assert was True.'],
      },
      { t: 'analogy', text: 'An assert is a smoke detector: silent while everything is fine, loud the moment something burns.' },
      { t: 'h', text: 'Seeing a failed test' },
      {
        t: 'code',
        text: `def double(n):\n    return n + 2\n\ntry:\n    assert double(5) == 10, "double(5) should be 10"\nexcept AssertionError as e:\n    print("FAILED:", e)`,
        output: 'FAILED: double(5) should be 10',
      },
      { t: 'p', text: 'The message after the comma explains what went wrong. Here the function is wrong: it ADDS 2 instead of multiplying. The test caught the bug before any customer did.' },
      { t: 'h', text: 'Edge cases: the strange inputs' },
      { t: 'p', text: 'Good testers do not only try the normal case. They try the awkward ones: zero, empty, the biggest, the smallest.' },
      {
        t: 'code',
        text: `def average(numbers):\n    if len(numbers) == 0:\n        return 0\n    return sum(numbers) / len(numbers)\n\nassert average([2, 4]) == 3\nassert average([5]) == 5\nassert average([]) == 0\nprint("All tests passed")`,
        output: 'All tests passed',
      },
      { t: 'tip', text: 'Many professionals write the tests FIRST. The tests describe what the function must do. Then they write the function until every test passes.' },
      { t: 'try', code: `def is_even(n):\n    return n % 2 == 0\n\nassert is_even(0), "zero is even"\nassert is_even(-4), "negative numbers too"\nassert not is_even(1)\nprint("All tests passed")\n`, output: 'All tests passed' },
      { t: 'p', text: 'Zero and negative numbers are edge cases. Add one more awkward input of your own, then break the function on purpose (change `==` to `!=`) and watch the test catch it.' },
      {
        t: 'predict',
        code: `assert 2 + 2 == 4\nassert "a" in "cat"\nprint("done")`,
        question: 'What does this print?',
        options: ['done', 'AssertionError', 'nothing'],
        answer: 0,
        explain: 'Both conditions are True, so the asserts pass silently and the program carries on to print done.',
      },
      {
        t: 'fill',
        prompt: 'Which word checks a condition and stops if it is false?',
        template: `___ 1 + 1 == 2\nprint("ok")`,
        blanks: [{ options: ['assert', 'check', 'must'], answer: 'assert' }],
        output: 'ok',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines: define the function, then show what it gives for 4.',
        lines: [`def triple(n):`, `    return n * 3`, `print(triple(4))`],
        output: '12',
      },
      {
        t: 'bug',
        code: `def add(a, b):\n    return a - b\n\nassert add(2, 3) == 5\nprint("ok")`,
        question: 'The assert fails. What is wrong?',
        options: ['The function subtracts instead of adding', 'assert cannot compare numbers', 'print is in the wrong place'],
        answer: 0,
        explain: 'The test did its job: it exposed that add uses a minus sign. Fix the function, not the test.',
        fixed: `def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nprint("ok")`,
      },
      {
        t: 'mistakes',
        items: [{ wrong: `def add(a, b):\n    return a + b\n\nassert add(2, 3)\nprint("ok")`, why: 'No error, but this test is weak: any non-zero result counts as True, so it would pass even for a wrong answer like 7. Compare with the exact expected value: assert add(2, 3) == 5.', right: `def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nprint("ok")`, logic: true }],
      },
      {
        t: 'recap',
        items: ['`assert condition, "message"` stops with an error if the condition is False.', 'Silence means success. Print “All tests passed” at the end.', 'Test normal cases AND edge cases: zero, empty, biggest, smallest.', 'When a test fails, the bug is usually in the function, not the test.', 'Write tests first and the function after.'],
        memory: 'assert = smoke detector: silent when safe.',
      },
    ],
    exercises: [
      {
        id: 'py33-phone',
        title: 'Valid phone number',
        prompt: 'Finish `is_valid_phone(number)`. A valid Ugandan number is text with exactly 10 characters, all digits, starting with `07`. When all the asserts pass the program prints `All tests passed`.',
        starter: 'def is_valid_phone(number):\n    # True only for 10 digits starting with 07\n    return False\n\nassert is_valid_phone("0772123456")\nassert not is_valid_phone("077212345")\nassert not is_valid_phone("0172123456")\nassert not is_valid_phone("07721234ab")\nprint("All tests passed")\n',
        tests: [{ expected: 'All tests passed' }],
        hints: [
          'There are three rules. A number must follow all of them.',
          'The length is `len(number) == 10`, the digits check is `number.isdigit()`, and the start is `number.startswith("07")`.',
          'Combine with `and`: `return len(number) == 10 and number.isdigit() and number.startswith("07")`.',
        ],
      },
      {
        id: 'py33-leap',
        title: 'Leap year',
        prompt: 'Finish `is_leap(year)`. A leap year is divisible by 4, except century years, which must be divisible by 400. When all the asserts pass the program prints `All tests passed`.',
        starter: 'def is_leap(year):\n    # divisible by 4, except centuries unless divisible by 400\n    return False\n\nassert is_leap(2024)\nassert not is_leap(2026)\nassert not is_leap(2100)\nassert is_leap(2000)\nprint("All tests passed")\n',
        tests: [{ expected: 'All tests passed' }],
        hints: [
          'Two rules: one for years divisible by 4 and an exception for centuries.',
          'A year is leap if it is divisible by 400, OR divisible by 4 but NOT by 100.',
          '`return year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)`',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 34
  {
    id: 'py-project-report',
    level: LEVEL,
    minutes: 35,
    title: 'Project: the weekly sales report',
    summary: 'Parse a sales log and write a clean report with totals, ranking and best day',
    blocks: [
      {
        t: 'story',
        title: 'What every owner wants on Monday',
        text: 'Every Monday morning, a shop owner asks three questions: How much did we earn? Which item brings the most money? Which day was our best?\n\nA sales log is just lines of text, like `2026-11-02,sugar,3,4500`: date, item, how many, price each. Your job is to turn the log into a clean report. This is exactly the work of a data analyst, and you already know all the tools.',
      },
      { t: 'h', text: 'Step 1: read the log and add things up' },
      {
        t: 'project',
        title: 'analyze',
        text: 'Each line is cut into four parts. The money for the line is quantity times price. We add it to the total of that item and the total of that day with `defaultdict`.',
        code: `from collections import defaultdict\n\nDATA = """${DATA}"""\n\n${ANALYZE}\n\nby_item, by_day = analyze(DATA.splitlines())\nprint(dict(by_item))\nprint(dict(by_day))\n`,
        output: "{'sugar': 18000, 'rice': 21000, 'salt': 8000, 'tea': 2000}\n{'2026-11-02': 19500, '2026-11-03': 12500, '2026-11-04': 17000}",
      },
      { t: 'h', text: 'Step 2: the report' },
      {
        t: 'project',
        title: 'report',
        text: 'Now we rank the items with `sorted` and `lambda`, format money with commas, and find the best day with `max`. The weekday name comes from `date` and `strftime`.',
        code: `from collections import defaultdict\nfrom datetime import date\n\nDATA = """${DATA}"""\n\n${ANALYZE}\n\n${REPORT}\n\nreport(DATA.splitlines())\n`,
        output: 'Revenue by item:\nrice: 21,000\nsugar: 18,000\nsalt: 8,000\ntea: 2,000\nTotal: 49,000\nBest day: Monday 2026-11-02 (19,500)',
      },
      { t: 'h', text: 'Step 3: protect it with tests' },
      {
        t: 'project',
        title: 'Tests for the analyzer',
        text: 'Before trusting the report, check the analyzer with tiny logs where we know the answer by heart.',
        code: `from collections import defaultdict\n\n${ANALYZE}\n\nitems, days = analyze(["2026-01-01,tea,2,500"])\nassert items["tea"] == 1000\nassert days["2026-01-01"] == 1000\n\nitems, days = analyze([])\nassert len(items) == 0\nprint("All tests passed")\n`,
        output: 'All tests passed',
      },
      {
        t: 'recap',
        items: ['`split(",")` and `int()` turn a text log into numbers.', '`defaultdict(int)` adds up per item and per day.', '`sorted(..., key=lambda ...)` ranks; `max(dict, key=dict.get)` finds the best key.', '`date.fromisoformat(...).strftime("%A")` turns a date text into a weekday.', 'Small tests make a report you can trust.', 'You can now read data, analyze it and present it: the heart of real programs.'],
        memory: 'Parse → add up → rank → report → test.',
      },
    ],
    exercises: [
      {
        id: 'py34-report',
        title: 'Write the report',
        prompt: 'The log is read for you and `analyze` is finished. Write the report. First line `Revenue by item:`, then each item with its money (biggest first, with commas like `21,000`), then `Total: 49,000`, then `Best day: Monday 2026-11-02 (19,500)` with the weekday name, the date and that day’s money.',
        starter: `from collections import defaultdict\nfrom datetime import date\n\n${ANALYZE}\n\nn = int(input())\nlines = [input() for i in range(n)]\nby_item, by_day = analyze(lines)\n# Print the report\n`,
        sampleInput: `6\n${DATA}`,
        usesInput: true,
        tests: [
          { input: `6\n${DATA}`, expected: 'Revenue by item:\nrice: 21,000\nsugar: 18,000\nsalt: 8,000\ntea: 2,000\nTotal: 49,000\nBest day: Monday 2026-11-02 (19,500)', name: 'A full week' },
          { input: '2\n2026-11-05,rice,1,3000\n2026-11-06,rice,2,3000', expected: 'Revenue by item:\nrice: 9,000\nTotal: 9,000\nBest day: Friday 2026-11-06 (6,000)', name: 'One item' },
          { input: '3\n2026-12-24,tea,10,500\n2026-12-25,salt,5,800\n2026-12-25,tea,1,500', expected: 'Revenue by item:\ntea: 5,500\nsalt: 4,000\nTotal: 9,500\nBest day: Thursday 2026-12-24 (5,000)', hidden: true },
        ],
        hints: [
          'Three parts: rank the items, print the total, find the best day.',
          'Rank with `sorted(by_item.items(), key=lambda pair: pair[1], reverse=True)`. Best day: `best = max(by_day, key=by_day.get)`. Use `{money:,}` to put commas in numbers.',
          'A similar example: the lesson’s Step 2, the `report` function. The weekday is `date.fromisoformat(best).strftime("%A")`.',
        ],
      },
    ],
  },
];

export const level5Solution = { ANALYZE, REPORT, DATA };
