// Python, Level 7 (Data and algorithms), part A: Big-O, searching and hashing and recursion, stacks and queues.
// Lessons 42 to 44. Exercise ids use the lesson number minus one (py41-, py42-, py43-).
// We count steps instead of timing programs, so every output is the same on every phone.

const LEVEL = 'Level 7: Data and algorithms';

const NODE_LIST = `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def add_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node`;

export const level7a = [
  // ------------------------------------------------------------------ 42
  {
    id: 'py-bigo',
    level: LEVEL,
    minutes: 20,
    title: 'How fast is fast? Big-O in plain words',
    summary: 'Count steps and see how the work grows: O(1), O(n), O(log n), O(n squared)',
    blocks: [
      {
        t: 'story',
        title: 'Finding Amina’s page',
        text: 'Mama Rose’s credit book has 1,000 pages, one customer per page. Amina walks in. Method one: start at page 1 and flip, flip, flip until you find her. That could be 1,000 flips. Method two: the book is in alphabetical order, so open it in the middle, see whether Amina comes before or after, and throw away the half that cannot hold her. Repeat. You never need more than 10 flips.\n\nWith 10 customers the two methods feel the same. With 1,000,000 customers, one method answers at once and the other makes the customer leave. Programmers have a way to talk about this difference. It is called Big-O, and you do not need any hard maths to use it.',
      },
      { t: 'p', text: 'Different phones run at different speeds, so we do not measure seconds. We COUNT STEPS, and we ask one question: when the data gets bigger, how fast does the number of steps grow?' },
      { t: 'h', text: 'Method one: look at every item' },
      {
        t: 'code',
        text: `def linear_steps(items, target):\n    steps = 0\n    for item in items:\n        steps += 1\n        if item == target:\n            break\n    return steps\n\nnumbers = list(range(1, 1001))\nprint(linear_steps(numbers, 1))\nprint(linear_steps(numbers, 500))\nprint(linear_steps(numbers, 1000))`,
        output: '1\n500\n1000',
      },
      { t: 'p', text: 'In the worst case we look at ALL n items. Double the data and the work doubles. We call this O(n), said “order n” or “linear”.' },
      { t: 'h', text: 'Method two: halve the problem each time' },
      {
        t: 'code',
        text: `def binary_steps(items, target):\n    low, high = 0, len(items) - 1\n    steps = 0\n    while low <= high:\n        steps += 1\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return steps\n        if items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return steps\n\nnumbers = list(range(1, 1001))\nprint(binary_steps(numbers, 500))\nprint(binary_steps(numbers, 1000))\nprint(binary_steps(numbers, 1))`,
        output: '1\n10\n9',
      },
      { t: 'p', text: 'This only works because the list is SORTED. Each step throws away half of what is left. This is O(log n), said “order log n”. Look how slowly the work grows:' },
      {
        t: 'code',
        text: `for n in (10, 1000, 1000000):\n    print(n, "items ->", n, "steps vs", n.bit_length(), "steps")`,
        output: '10 items -> 10 steps vs 4 steps\n1000 items -> 1000 steps vs 10 steps\n1000000 items -> 1000000 steps vs 20 steps',
      },
      { t: 'analogy', text: 'Guessing a number between 1 and 1,000,000 by always guessing the middle takes at most 20 guesses. Guessing 1, 2, 3, 4… could take a million. The first friend is O(log n). The second is O(n).' },
      { t: 'h', text: 'The names you will hear' },
      {
        t: 'list',
        items: [
          '`O(1)` constant: the same work however big the data is. Looking up `prices["sugar"]` in a dictionary, or `items[3]` in a list.',
          '`O(log n)`: halving each time. Binary search.',
          '`O(n)`: one pass over the data. A `for` loop, `sum`, `max`, or `x in my_list`.',
          '`O(n²)`: a loop inside a loop. Comparing every item with every other item.',
        ],
      },
      { t: 'h', text: 'The danger: a loop inside a loop' },
      {
        t: 'code',
        text: `def count_pairs(items):\n    steps = 0\n    for a in items:\n        for b in items:\n            steps += 1\n    return steps\n\nprint(count_pairs(range(10)))\nprint(count_pairs(range(100)))`,
        output: '100\n10000',
      },
      { t: 'p', text: '10 times more data made 100 times more work! With 100,000 customers that nested loop would do ten billion steps. Spotting a hidden loop inside a loop is the most useful Big-O skill you can have.' },
      {
        t: 'predict',
        code: `def count_pairs(items):\n    steps = 0\n    for a in items:\n        for b in items:\n            steps += 1\n    return steps\n\nprint(count_pairs(range(20)))`,
        question: 'How many steps does the nested loop take for 20 items?',
        options: ['40', '400', '20'],
        answer: 1,
        explain: '20 times 20 is 400. The outer loop runs 20 times and for each of those the inner loop runs 20 times.',
      },
      {
        t: 'try',
        code: `names = ["Amina", "Okello", "Zed"]\nname_set = set(names)\n\nprint("Zed" in names)\nprint("Zed" in name_set)\n`,
        output: 'True\nTrue',
      },
      { t: 'tip', text: 'Both lines print True, but they are not equal in cost. `in` on a list checks one item after another: O(n). `in` on a set or a dictionary jumps straight to the answer: O(1). If you check membership many times, turn the list into a set first.' },
      {
        t: 'quiz',
        question: 'A program is O(n²) and takes 1 second for 1,000 items. About how long for 2,000 items?',
        options: ['About 2 seconds', 'About 4 seconds', 'About 1 second'],
        answer: 1,
        explain: 'Double the data in an n-squared program and the work becomes 2 x 2 = 4 times bigger.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `def find(items, target):\n    low, high = 0, len(items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(find([50, 10, 90, 30], 10))`,
            why: 'Binary search needs a SORTED list. On an unsorted list it throws away the wrong half and says -1 even though 10 is there. Sort first, or use a plain loop.',
            right: `def find(items, target):\n    low, high = 0, len(items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(find(sorted([50, 10, 90, 30]), 10))`,
            logic: true,
          },
          {
            wrong: `seen = []\nfor n in [4, 8, 4, 9]:\n    if n in seen:\n        print("Duplicate:", n)\n    seen.append(n)`,
            why: 'It works, but `n in seen` on a list is a hidden loop, so the whole thing is O(n²). Use a set for `seen` and each check becomes instant.',
            right: `seen = set()\nfor n in [4, 8, 4, 9]:\n    if n in seen:\n        print("Duplicate:", n)\n    seen.add(n)`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['Do not time your program. Count the steps and watch how they grow with the data.', 'O(1) constant, O(log n) halving, O(n) one pass, O(n²) a loop inside a loop.', 'Binary search is O(log n), but only on a sorted list.', 'A dictionary or set lookup is O(1). `x in list` is O(n).', 'Watch out for hidden loops inside loops.'],
        memory: 'Big-O = how the work grows when the data grows.',
      },
    ],
    exercises: [
      {
        id: 'py41-linear',
        title: 'Count the steps',
        prompt: 'Write `count_steps(items, target)`. It returns how many items you look at, from the start, until you find the target. If the target is not in the list you look at every item.',
        starter: 'def count_steps(items, target):\n    # return how many items are looked at until target is found\n    return 0\n\nitems = [int(x) for x in input().split()]\ntarget = int(input())\nprint(count_steps(items, target))\n',
        sampleInput: '4 8 15 16 23 42\n15',
        usesInput: true,
        tests: [
          { input: '4 8 15 16 23 42\n15', expected: '3' },
          { input: '4 8 15\n99', expected: '3' },
          { input: '7\n7', expected: '1', hidden: true },
          { input: '5 6\n6', expected: '2', hidden: true },
        ],
        hints: [
          'Loop over the items and add 1 to a counter for every item you look at.',
          'Stop the loop with `break` as soon as the item equals the target. If you never break, the counter equals the length.',
          'A similar example: `steps = 0` then `for item in items:` then `steps += 1` then `if item == target: break`, and finally `return steps`.',
        ],
      },
      {
        id: 'py41-guesses',
        title: 'The guessing game',
        prompt: 'I think of a number from 1 to n. You always guess the middle of what is left, and I say higher or lower. Read n and print the WORST-CASE number of guesses.\n\n(For 10 the answer is 4, for 1000 it is 10.)',
        starter: 'n = int(input())\n# keep halving n and count how many times you can do it\nprint(0)\n',
        sampleInput: '1000',
        usesInput: true,
        tests: [
          { input: '10', expected: '4' },
          { input: '1000', expected: '10' },
          { input: '1000000', expected: '20', hidden: true },
          { input: '7', expected: '3', hidden: true },
        ],
        hints: [
          'Each guess cuts the remaining numbers in half. How many times can you halve n before nothing is left?',
          'Use a `while n > 0:` loop. Inside it do `n = n // 2` and add 1 to a counter.',
          'A similar example: for n = 8 the loop gives 8, 4, 2, 1, so the counter ends at 4. The result is the counter.',
        ],
      },
      {
        id: 'py41-duplicates',
        title: 'Any duplicates?',
        prompt: 'Read a line of numbers. Print `Duplicates` if any number appears more than once, otherwise `All different`. Use a set so the program stays fast, even for a million numbers.',
        starter: 'numbers = input().split()\n# remember what you have seen in a set\nprint("All different")\n',
        sampleInput: '4 8 15 8',
        usesInput: true,
        tests: [
          { input: '4 8 15 8', expected: 'Duplicates' },
          { input: '1 2 3 4', expected: 'All different' },
          { input: '5', expected: 'All different', hidden: true },
          { input: '9 9', expected: 'Duplicates', hidden: true },
        ],
        hints: [
          'Make an empty set. Go through the numbers one by one.',
          'If the number is already in the set, you found a duplicate. Otherwise add it to the set.',
          'A shortcut that also works: a set has no repeats, so compare `len(set(numbers))` with `len(numbers)`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 43
  {
    id: 'py-search-hash',
    level: LEVEL,
    minutes: 24,
    title: 'Finding things fast: binary search, hashing and recursion',
    summary: 'Binary search, how a dictionary really works, recursion in depth and memoization',
    blocks: [
      {
        t: 'story',
        title: 'The librarian who never searches',
        text: 'In a small school library there are 5 shelves. The librarian has a rule: add up the letters of a book’s title, divide by 5, and the leftover tells you the shelf. When a book comes in she does not search anything. She calculates the shelf and puts the book there. When a student asks for it, she calculates the same shelf and walks straight to it.\n\nThat is exactly how a Python dictionary finds `prices["sugar"]` in one jump. The rule is called a hash function. In this lesson you will build binary search, build a tiny dictionary yourself, and meet recursion in depth.',
      },
      { t: 'h', text: 'Binary search, finished' },
      {
        t: 'code',
        text: `def binary_search(items, target):\n    low, high = 0, len(items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprices = [500, 800, 1200, 3000, 4500, 7000]\nprint(binary_search(prices, 3000))\nprint(binary_search(prices, 999))`,
        output: '3\n-1',
      },
      { t: 'p', text: 'It returns the position of the target, or `-1` when it is not there. Python already ships a tested version in the `bisect` module:' },
      {
        t: 'code',
        text: `import bisect\n\nprices = [500, 800, 1200, 3000, 4500, 7000]\nprint(bisect.bisect_left(prices, 3000))`,
        output: '3',
      },
      { t: 'h', text: 'Hashing: a rule that turns a word into a shelf' },
      {
        t: 'code',
        text: `def shelf_for(word, shelves):\n    return sum(ord(ch) for ch in word) % shelves\n\nfor word in ("sugar", "salt", "rice", "tea", "oil"):\n    print(word, shelf_for(word, 5))`,
        output: 'sugar 1\nsalt 1\nrice 4\ntea 4\noil 4',
      },
      { t: 'p', text: '`ord(ch)` is the number code of a letter. We add the codes and keep the remainder after dividing by the number of shelves. The same word ALWAYS gives the same shelf. Notice that `sugar` and `salt` both landed on shelf 1: a collision. Real hash tables handle that by letting each shelf (called a bucket) hold a small list. Here is a tiny dictionary built that way:' },
      {
        t: 'code',
        text: `class ShopTable:\n    def __init__(self, size=5):\n        self.buckets = [[] for _ in range(size)]\n\n    def _index(self, key):\n        return sum(ord(ch) for ch in key) % len(self.buckets)\n\n    def put(self, key, value):\n        bucket = self.buckets[self._index(key)]\n        for pair in bucket:\n            if pair[0] == key:\n                pair[1] = value\n                return\n        bucket.append([key, value])\n\n    def get(self, key):\n        for k, v in self.buckets[self._index(key)]:\n            if k == key:\n                return v\n        return None\n\ntable = ShopTable()\ntable.put("sugar", 4500)\ntable.put("salt", 800)\ntable.put("sugar", 4700)\nprint(table.get("sugar"))\nprint(table.get("salt"))\nprint(table.get("tea"))\nprint(len(table.buckets[1]))`,
        output: '4700\n800\nNone\n2',
      },
      { t: 'analogy', text: 'The hash function is the librarian’s rule. The bucket is the shelf. Finding a book means calculating the shelf (one step) and then scanning the few books on that shelf, which is much shorter than scanning the whole library.' },
      { t: 'p', text: 'This is why a dictionary key must be hashable, meaning it cannot change after you use it. A tuple can be a key. A list cannot, because if it changed, its shelf would change and the book would be lost.' },
      {
        t: 'bug',
        code: `prices = {["sugar", "white"]: 4500}\nprint(prices)`,
        question: 'This crashes with “unhashable type: list”. Why?',
        options: ['A list can change, so Python cannot give it a fixed shelf', 'A dictionary can only have one key', 'Lists cannot hold text'],
        answer: 0,
        explain: 'Dictionary keys must never change, otherwise the key would end up on the wrong shelf. Tuples cannot change, so they are allowed.',
        fixed: `prices = {("sugar", "white"): 4500}\nprint(prices)`,
      },
      { t: 'h', text: 'Recursion in depth' },
      { t: 'p', text: 'You met recursion in the Level 3 lessons: a function that calls itself. It always needs a base case (when to stop) and a step towards that base case.' },
      {
        t: 'code',
        text: `def countdown(n):\n    if n == 0:\n        print("Go!")\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)`,
        output: '3\n2\n1\nGo!',
      },
      {
        t: 'predict',
        code: `def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)\n\nprint(total(4))`,
        question: 'What does this print?',
        options: ['4', '10', '24'],
        answer: 1,
        explain: 'total(4) is 4 + total(3), which is 4 + 3 + 2 + 1 + 0 = 10.',
      },
      { t: 'h', text: 'When recursion is wasteful: memoization' },
      { t: 'p', text: 'The Fibonacci numbers (0, 1, 1, 2, 3, 5, 8…) add the two before. The obvious recursive version recalculates the same values again and again. Let us count how many times the function is called:' },
      {
        t: 'code',
        text: `calls = 0\n\ndef fib(n):\n    global calls\n    calls += 1\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(15))\nprint(calls)`,
        output: '610\n1973',
      },
      { t: 'p', text: '1,973 calls to find the 15th number! The fix is memoization: write answers down in a dictionary and look them up before working them out again.' },
      {
        t: 'code',
        text: `memo = {}\ncalls = 0\n\ndef fib(n):\n    global calls\n    calls += 1\n    if n in memo:\n        return memo[n]\n    result = n if n < 2 else fib(n - 1) + fib(n - 2)\n    memo[n] = result\n    return result\n\nprint(fib(15))\nprint(calls)`,
        output: '610\n29',
      },
      { t: 'p', text: 'From 1,973 calls down to 29. Python has a decorator (Level 6!) that does the same for you:' },
      {
        t: 'code',
        text: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(50))`,
        output: '12586269025',
      },
      { t: 'tip', text: 'Without the cache, `fib(50)` would need billions of calls and never finish on a phone. With it, the answer is instant.' },
      { t: 'p', text: 'Python also protects you from a function that never stops calling itself:' },
      {
        t: 'try',
        code: `def forever(n):\n    return forever(n + 1)\n\ntry:\n    forever(0)\nexcept RecursionError:\n    print("Too deep!")\n`,
        output: 'Too deep!',
      },
      {
        t: 'fill',
        prompt: 'Finish the hash rule: the remainder after dividing by the number of shelves.',
        template: `def shelf_for(word, shelves):\n    return sum(ord(ch) for ch in word) ___ shelves\n\nprint(shelf_for("sugar", 5))`,
        blanks: [{ options: ['%', '//', '*'], answer: '%' }],
        output: '1',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `def countdown(n):\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)`,
            why: 'No base case, so the function calls itself for ever until Python stops it with a RecursionError. Always decide when to stop.',
            right: `def countdown(n):\n    if n == 0:\n        print("Go!")\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)`,
          },
          {
            wrong: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef total(nums):\n    return sum(nums)\n\nprint(total([1, 2, 3]))`,
            why: 'The cache stores arguments as dictionary keys, and a list is not hashable. Pass a tuple instead.',
            right: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef total(nums):\n    return sum(nums)\n\nprint(total((1, 2, 3)))`,
          },
          {
            wrong: `prices = [100, 200, 300]\nlow, high = 0, 2\nmid = (low + high) / 2\nprint(prices[mid])`,
            why: 'A single slash gives a float (1.0), and a list position must be a whole number. Use `//` for the middle.',
            right: `prices = [100, 200, 300]\nlow, high = 0, 2\nmid = (low + high) // 2\nprint(prices[mid])`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['Binary search needs a sorted list and runs in O(log n). The `bisect` module has a tested version.', 'A hash function turns a key into a bucket number, so a dictionary finds things in one jump.', 'Dictionary keys must be unchangeable: tuples yes, lists no.', 'Recursion needs a base case and a step towards it.', 'Memoization (`dict` or `@lru_cache`) saves answers so they are never worked out twice.'],
        memory: 'Hash = calculate the shelf. Memoize = write the answer down.',
      },
    ],
    exercises: [
      {
        id: 'py42-binary',
        title: 'Write binary search',
        prompt: 'Write `binary_search(items, target)` for a SORTED list. Return the position of the target, or `-1` if it is not there. Use the halving method, not `list.index`.',
        starter: 'def binary_search(items, target):\n    # keep low and high and look at the middle each time\n    return -1\n\nitems = [int(x) for x in input().split()]\ntarget = int(input())\nprint(binary_search(items, target))\n',
        sampleInput: '500 800 1200 3000 4500 7000\n3000',
        usesInput: true,
        tests: [
          { input: '500 800 1200 3000 4500 7000\n3000', expected: '3' },
          { input: '500 800 1200 3000 4500 7000\n999', expected: '-1' },
          { input: '5\n5', expected: '0', hidden: true },
          { input: '1 2 3 4\n4', expected: '3', hidden: true },
        ],
        hints: [
          'Keep two positions, `low = 0` and `high = len(items) - 1`, and repeat while `low <= high`.',
          'Look at `mid = (low + high) // 2`. If the item there equals the target, return `mid`. If it is smaller, move `low` to `mid + 1`; otherwise move `high` to `mid - 1`.',
          'The lesson has a full `binary_search` function. Compare your loop with it line by line.',
        ],
      },
      {
        id: 'py42-shelf',
        title: 'Which shelf?',
        prompt: 'Read the number of shelves, then a line of words. For each word print the word and its shelf number, using the rule: add the `ord` of every letter, then take the remainder after dividing by the number of shelves.\n\nFor `5` shelves and `sugar salt rice` the output is `sugar 1`, `salt 1`, `rice 4`.',
        starter: 'shelves = int(input())\nwords = input().split()\nfor word in words:\n    # work out the shelf and print the word and the shelf\n    print(word, 0)\n',
        sampleInput: '5\nsugar salt rice',
        usesInput: true,
        tests: [
          { input: '5\nsugar salt rice', expected: 'sugar 1\nsalt 1\nrice 4' },
          { input: '5\ntea oil', expected: 'tea 4\noil 4' },
          { input: '7\nmatooke beans tea', expected: 'matooke 3\nbeans 3\ntea 6', hidden: true },
        ],
        hints: [
          'For one word you need the sum of `ord(ch)` for every letter `ch` in it.',
          '`total = sum(ord(ch) for ch in word)` and then `total % shelves`.',
          'Print them together: `print(word, total % shelves)`.',
        ],
      },
      {
        id: 'py42-fib',
        title: 'A Fibonacci that finishes',
        prompt: 'Write `fib(n)` with memoization (a dictionary or `@lru_cache`) and print the n-th Fibonacci number, where `fib(0)` is 0 and `fib(1)` is 1. It must be fast even for n = 80.',
        starter: 'def fib(n):\n    # remember answers you already worked out\n    return 0\n\nprint(fib(int(input())))\n',
        sampleInput: '10',
        usesInput: true,
        tests: [
          { input: '10', expected: '55' },
          { input: '50', expected: '12586269025' },
          { input: '80', expected: '23416728348467685', hidden: true },
        ],
        hints: [
          'Without memory this recursion repeats the same work billions of times. Remember each answer.',
          'The easiest way: put `from functools import lru_cache` at the top and `@lru_cache(maxsize=None)` above `def fib`.',
          'The recursive rule is `if n < 2: return n` and otherwise `return fib(n - 1) + fib(n - 2)`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 44
  {
    id: 'py-structures',
    level: LEVEL,
    minutes: 24,
    title: 'Piles, lines and chains: stacks, queues and linked lists',
    summary: 'Last-in-first-out stacks, first-come-first-served queues and linked lists',
    blocks: [
      {
        t: 'story',
        title: 'Plates and boda stage',
        text: 'At a wedding the cook stacks clean plates in a pile. When someone needs a plate they take the TOP one, which is the last plate that was put on. Last in, first out.\n\nAt the boda boda stage the riders wait in a line. The rider who arrived FIRST is the one who gets the next passenger. First in, first out.\n\nThese two shapes appear everywhere in software. The “undo” button is a pile of your last actions. A print job list, or a line of customers waiting for an agent, is a queue. They are called a stack and a queue.',
      },
      { t: 'h', text: 'Stack: a Python list is enough' },
      {
        t: 'code',
        text: `stack = []\nstack.append("plate 1")\nstack.append("plate 2")\nstack.append("plate 3")\nprint(stack.pop())\nprint(stack.pop())\nprint(stack)`,
        output: "plate 3\nplate 2\n['plate 1']",
      },
      { t: 'p', text: '`append` puts something on top and `pop()` takes the top one off. Both are O(1). Your browser’s Back button is a stack of the pages you visited.' },
      {
        t: 'predict',
        code: `s = []\ns.append(1)\ns.append(2)\ns.append(3)\ns.pop()\ns.append(4)\nprint(s.pop(), s.pop(), s.pop())`,
        question: 'What does this print?',
        options: ['4 2 1', '3 2 1', '1 2 4'],
        answer: 0,
        explain: 'After the first pop the stack is [1, 2]. Adding 4 gives [1, 2, 4]. Then the three pops take 4, then 2, then 1.',
      },
      { t: 'h', text: 'A classic job for a stack: matching brackets' },
      { t: 'p', text: 'Is `(a + b) * [c]` written correctly? Every opening bracket must be closed by the matching one, in the right order. Walk along the text: push every opener, and when you meet a closer, the top of the pile must be its partner.' },
      {
        t: 'code',
        text: `def balanced(text):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in text:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack\n\nprint(balanced("(a + b) * [c]"))\nprint(balanced("(a + b]"))\nprint(balanced("((a)"))`,
        output: 'True\nFalse\nFalse',
      },
      { t: 'h', text: 'Queue: use deque' },
      { t: 'p', text: 'A list is slow at removing from the FRONT (every other item has to shuffle along). Python has a tool made for lines, `deque`, where both ends are O(1).' },
      {
        t: 'code',
        text: `from collections import deque\n\nqueue = deque()\nqueue.append("Amina")\nqueue.append("Okello")\nqueue.append("Zed")\nprint(queue.popleft())\nprint(queue)`,
        output: "Amina\ndeque(['Okello', 'Zed'])",
      },
      { t: 'analogy', text: 'A stack is a pile of plates: you only touch the top. A queue is a line at the agent’s kiosk: people join at the back and leave from the front.' },
      { t: 'h', text: 'A linked list: a chain of nodes' },
      { t: 'p', text: 'A list keeps its items side by side. A linked list is a chain: each item (a node) holds its value and a link to the next node. The last node links to `None`.' },
      {
        t: 'code',
        text: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\nfirst = Node("Amina")\nsecond = Node("Okello")\nthird = Node("Zed")\nfirst.next = second\nsecond.next = third\n\ncurrent = first\nwhile current is not None:\n    print(current.value)\n    current = current.next`,
        output: 'Amina\nOkello\nZed',
      },
      { t: 'p', text: 'Now let us wrap the chain in a class. Adding at the front is O(1), you only change two links. We also make the list loopable with `__iter__` (Level 6 special methods) and a generator (Level 5):' },
      {
        t: 'code',
        text: `${NODE_LIST}\n\n    def __iter__(self):\n        current = self.head\n        while current:\n            yield current.value\n            current = current.next\n\nchain = LinkedList()\nchain.add_front("Zed")\nchain.add_front("Okello")\nchain.add_front("Amina")\nprint(list(chain))`,
        output: "['Amina', 'Okello', 'Zed']",
      },
      { t: 'tip', text: 'In everyday Python a normal list or a `deque` is almost always the best choice. Linked lists matter because they teach you how links and chains work, and because the same idea powers trees, graphs and many files and databases.' },
      {
        t: 'fill',
        prompt: 'Serve the person who has waited the longest.',
        template: `from collections import deque\n\nq = deque(["Amina", "Okello"])\nprint(q.___())`,
        blanks: [{ options: ['popleft', 'pop', 'remove'], answer: 'popleft' }],
        output: 'Amina',
      },
      {
        t: 'bug',
        code: `stack = []\nprint(stack.pop())`,
        question: 'This crashes with “pop from empty list”. What is the right fix?',
        options: ['Check that the stack is not empty before popping', 'Use append instead of pop', 'Make the stack a string'],
        answer: 0,
        explain: 'You cannot take a plate from an empty pile. Check first with `if stack:`.',
        fixed: `stack = []\nif stack:\n    print(stack.pop())\nelse:\n    print("Nothing to undo")`,
      },
      {
        t: 'quiz',
        question: 'Which structure fits an “undo” button best?',
        options: ['A stack', 'A queue', 'A set'],
        answer: 0,
        explain: 'Undo reverses your LAST action first. Last in, first out is a stack.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `line = ["Amina", "Okello", "Zed"]\nprint("Serving", line.pop())`,
            why: '`pop()` takes from the END, so Zed (who arrived last) is served first. For a queue take from the front, with `deque.popleft()`.',
            right: `from collections import deque\n\nline = deque(["Amina", "Okello", "Zed"])\nprint("Serving", line.popleft())`,
            logic: true,
          },
          {
            wrong: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\na = Node(1)\nb = Node(2)\na.next = b\ncurrent = a\nwhile current is not None:\n    print(current.value)`,
            why: 'The loop never moves forward: `current = current.next` is missing, so it prints 1 for ever.',
            right: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\na = Node(1)\nb = Node(2)\na.next = b\ncurrent = a\nwhile current is not None:\n    print(current.value)\n    current = current.next`,
            logic: true,
          },
          {
            wrong: `from collections import deque\n\nq = deque()\nprint(q.popleft())`,
            why: 'Serving an empty line crashes with IndexError. Check `if q:` first.',
            right: `from collections import deque\n\nq = deque()\nif q:\n    print(q.popleft())\nelse:\n    print("Nobody waiting")`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['A stack is last in, first out: `append` and `pop()` on a list.', 'A queue is first in, first out: use `deque` with `append` and `popleft()`.', 'Matching brackets is the classic stack problem.', 'A linked list is a chain of nodes, each pointing to the next.', 'Always check that a stack or queue is not empty before taking from it.'],
        memory: 'Stack = plates (top first). Queue = boda stage (first first).',
      },
    ],
    exercises: [
      {
        id: 'py43-brackets',
        title: 'Are the brackets right?',
        prompt: 'Read one line. Print `Balanced` if every `(`, `[` and `{` is closed by the right partner in the right order, otherwise print `Not balanced`. Use a stack.',
        starter: 'text = input()\npairs = {")": "(", "]": "[", "}": "{"}\n# push the openers, check the closers\nprint("Balanced")\n',
        sampleInput: '(a + b) * [c]',
        usesInput: true,
        tests: [
          { input: '(a + b) * [c]', expected: 'Balanced' },
          { input: '(a + b]', expected: 'Not balanced' },
          { input: '((a)', expected: 'Not balanced', hidden: true },
          { input: '{[()]}', expected: 'Balanced', hidden: true },
          { input: ')(', expected: 'Not balanced', hidden: true },
        ],
        hints: [
          'Use a list as a stack. Push every opening bracket onto it.',
          'When you see a closing bracket, the top of the stack must be its partner (use the `pairs` dictionary). If the stack is empty or the top is wrong, it is not balanced.',
          'At the end the stack must be empty too. The lesson’s `balanced` function does exactly this, then you print the right word.',
        ],
      },
      {
        id: 'py43-queue',
        title: 'The agent’s queue',
        prompt: 'Read a number `n`, then `n` commands: `join NAME` puts a person at the back of the line, and `serve` serves the person at the front, printing `Serving NAME`. If nobody is waiting, `serve` prints `Nobody waiting`. At the end print `Still waiting: N`.',
        starter: 'from collections import deque\n\nn = int(input())\nline = deque()\nfor i in range(n):\n    command = input().split()\n    # handle join and serve\nprint(f"Still waiting: {len(line)}")\n',
        sampleInput: '5\njoin Amina\njoin Okello\nserve\nserve\nserve',
        usesInput: true,
        tests: [
          { input: '5\njoin Amina\njoin Okello\nserve\nserve\nserve', expected: 'Serving Amina\nServing Okello\nNobody waiting\nStill waiting: 0' },
          { input: '4\njoin Zed\njoin Mary\njoin Jo\nserve', expected: 'Serving Zed\nStill waiting: 2' },
          { input: '2\nserve\njoin A', expected: 'Nobody waiting\nStill waiting: 1', hidden: true },
        ],
        hints: [
          '`command[0]` is `join` or `serve`. For `join`, the name is `command[1]`.',
          'For `join` do `line.append(command[1])`. For `serve`, check `if line:` and then use `line.popleft()`.',
          'If the line is empty when you serve, print `Nobody waiting` instead.',
        ],
      },
      {
        id: 'py43-linked',
        title: 'Walk the chain',
        prompt: `The linked list below can add numbers at the front. Finish \`to_text\` so it returns all the values from the head to the end, joined with \` -> \`.\n\nFor the numbers 1 2 3 (added one after another at the front) the chain is \`3 -> 2 -> 1\`.`,
        starter: `${NODE_LIST}\n\n    def to_text(self):\n        # walk from the head and join the values with " -> "\n        return ""\n\nchain = LinkedList()\nfor value in input().split():\n    chain.add_front(value)\nprint(chain.to_text())\n`,
        sampleInput: '1 2 3',
        usesInput: true,
        tests: [
          { input: '1 2 3', expected: '3 -> 2 -> 1' },
          { input: '5', expected: '5' },
          { input: '10 20 30 40', expected: '40 -> 30 -> 20 -> 10', hidden: true },
        ],
        hints: [
          'Start with `current = self.head` and keep going while `current is not None`.',
          'Collect each `current.value` into a Python list, then move on with `current = current.next`.',
          'At the end `return " -> ".join(values)`. The lesson’s `__iter__` shows the same walk.',
        ],
      },
    ],
  },
];

export const level7Solution = { NODE_LIST };
