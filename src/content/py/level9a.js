// Python, Level 9 (Capstones and the path forward), part A: concurrency (asyncio), a web backend built from scratch, packaging.
// Lessons 53 to 55. Exercise ids use the lesson number minus one (py52-, py53-, py54-).
// The editor runs code with runPythonAsync, so top-level `await` works and asyncio.run() does not.
// Threads, Flask and pip are not available in the browser, so those ideas are taught with working stand-ins.

import { level8Solution as A } from './level8a.js';

const LEVEL = 'Level 9: Capstones and the path forward';

const MINI_APP = `import json
import re

class HttpError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status

class MiniApp:
    def __init__(self):
        self.routes = []

    def route(self, method, pattern):
        regex = re.compile("^" + re.sub(r"<(\\w+)>", r"(?P<\\1>[^/]+)", pattern) + "$")
        def decorator(func):
            self.routes.append((method, regex, func))
            return func
        return decorator

    def handle(self, method, path, body=None, headers=None):
        request = {"body": body or {}, "headers": headers or {}}
        for route_method, regex, func in self.routes:
            match = regex.match(path)
            if route_method == method and match:
                try:
                    status, data = func(request, **match.groupdict())
                except HttpError as e:
                    return e.status, json.dumps({"error": str(e)})
                return status, json.dumps(data)
        return 404, json.dumps({"error": "not found"})`;

const ITEMS2 = `ITEMS = {
    1: {"id": 1, "name": "sugar", "price": 4500},
    2: {"id": 2, "name": "rice", "price": 3000},
}`;

const ITEMS3 = `ITEMS = {
    1: {"id": 1, "name": "sugar", "price": 4500},
    2: {"id": 2, "name": "rice", "price": 3000},
    3: {"id": 3, "name": "tea", "price": 500},
}`;

const LIST_ROUTE = `@app.route("GET", "/items")
def list_items(request):
    return 200, list(ITEMS.values())`;

const GET_ROUTE = `@app.route("GET", "/items/<item_id>")
def get_item(request, item_id):
    if not item_id.isdigit():
        raise HttpError(400, "id must be a number")
    item = ITEMS.get(int(item_id))
    if item is None:
        raise HttpError(404, "no such item")
    return 200, item`;

const POST_BODY = `    body = request["body"]
    name = body.get("name")
    price = body.get("price")
    if not isinstance(name, str) or not name.strip():
        raise HttpError(400, "name is required")
    if not isinstance(price, int) or price <= 0:
        raise HttpError(400, "price must be a positive whole number")
    new_id = max(ITEMS) + 1
    ITEMS[new_id] = {"id": new_id, "name": name.strip(), "price": price}
    return 201, ITEMS[new_id]`;

const REQUIRES_KEY = `def requires_key(func):
    def wrapper(request, **params):
        if request["headers"].get("x-api-key") != "duuka-key":
            raise HttpError(401, "missing or wrong key")
        return func(request, **params)
    return wrapper`;

const PARSE_VERSION = `def parse_version(text):
    return tuple(int(part) for part in text.split("."))`;

export const level9a = [
  // ------------------------------------------------------------------ 53
  {
    id: 'py-async',
    level: LEVEL,
    minutes: 24,
    title: 'Doing many things at once: concurrency with asyncio',
    summary: 'Waiting vs thinking, coroutines, gather, queues, timeouts and shared-state traps',
    blocks: [
      {
        t: 'story',
        title: 'The kiosk that never waits',
        text: 'Mama Rose runs a Mobile Money kiosk. When a customer pays, the confirmation takes five seconds to come back from the phone company. A slow shopkeeper stands and stares at the phone for five seconds, then serves the next customer. A clever one takes the next order while the first confirmation is “in the oven”, and comes back when it arrives.\n\nThe clever shopkeeper is not doing two things at the exact same moment. She just never wastes time WAITING. That is the heart of concurrency, and Python has a tool for it: `asyncio`.',
      },
      { t: 'h', text: 'Two kinds of slow' },
      {
        t: 'list',
        items: [
          'WAITING (called I/O-bound): the program sits idle while a network, a database or a file answers. `asyncio` shines here.',
          'THINKING (called CPU-bound): the program is busy calculating. Waiting-tricks do not help. You need more processors, which means separate processes.',
          'Threads are a third way: several workers in one program. In Python they take turns, so they also help mostly with waiting.',
        ],
      },
      { t: 'p', text: 'A browser tab cannot start new threads, so Python threads do not exist inside this app. Here is what happens if you try (on a normal computer this works):' },
      {
        t: 'code',
        text: `import threading\n\ntry:\n    threading.Thread(target=print).start()\nexcept RuntimeError as e:\n    print("No threads in the browser:", e)`,
        output: "No threads in the browser: can't start new thread",
      },
      { t: 'p', text: '`asyncio` does not need threads, so it works fine here. It runs many coroutines in ONE thread by letting each one say “I am waiting, someone else can go”.' },
      { t: 'h', text: 'Coroutines and await' },
      { t: 'p', text: 'A function written with `async def` is a coroutine function. Calling it does NOT run it; it gives you a coroutine object, like a sealed order slip. `await` is what actually runs it, and waits for the answer.' },
      {
        t: 'code',
        text: `import asyncio\n\nasync def greet(name):\n    await asyncio.sleep(0)\n    return f"Welcome, {name}"\n\ncoro = greet("Amina")\nprint(type(coro).__name__)\nprint(await coro)`,
        output: 'coroutine\nWelcome, Amina',
      },
      { t: 'tip', text: 'Notice `await` used at the top level, outside any function. This editor allows that. On a normal computer you would put the code in `async def main()` and finish with `asyncio.run(main())`. Inside this app, `asyncio.run` does not work, because the app is already running its own event loop.' },
      { t: 'h', text: 'gather: start them all together' },
      {
        t: 'code',
        text: `import asyncio\n\nasync def lookup(item, price):\n    await asyncio.sleep(0)\n    return f"{item}: {price}"\n\nresults = await asyncio.gather(lookup("sugar", 4500), lookup("rice", 3000), lookup("tea", 500))\nprint(results)`,
        output: "['sugar: 4500', 'rice: 3000', 'tea: 500']",
      },
      { t: 'p', text: '`asyncio.gather` starts all the coroutines and gives the answers back in the SAME order you listed them, no matter which finished first. Now watch how they take turns. Each `await asyncio.sleep(0)` means “I am happy to pause, let someone else go”:' },
      {
        t: 'code',
        text: `import asyncio\n\nasync def cook(name, steps):\n    for i in range(1, steps + 1):\n        print(name, "step", i)\n        await asyncio.sleep(0)\n\nawait asyncio.gather(cook("tea", 2), cook("rice", 3))`,
        output: 'tea step 1\nrice step 1\ntea step 2\nrice step 2\nrice step 3',
      },
      { t: 'analogy', text: 'One cook, two pots. Stir the tea, then the rice, then the tea again. Nobody waits idle while the other pot needs time. The `await` is the moment the cook turns to the other pot.' },
      { t: 'p', text: 'The real payoff is time. Three waits of a tenth of a second each cost 0.3 seconds one after another, but only about 0.1 seconds together:' },
      {
        t: 'code',
        text: `import asyncio\nimport time\n\nasync def slow(n):\n    await asyncio.sleep(0.1)\n    return n\n\nstart = time.perf_counter()\nfor n in range(3):\n    await slow(n)\none_by_one = time.perf_counter() - start\n\nstart = time.perf_counter()\nawait asyncio.gather(slow(0), slow(1), slow(2))\ntogether = time.perf_counter() - start\n\nprint("together was faster:", together < one_by_one)`,
        output: 'together was faster: True',
      },
      { t: 'h', text: 'A queue between a producer and a consumer' },
      { t: 'p', text: 'A queue lets one coroutine hand work to another. The producer puts orders in; the consumer takes them out. A `None` is a common “no more orders” sign.' },
      {
        t: 'code',
        text: `import asyncio\n\nqueue = asyncio.Queue()\n\nasync def producer():\n    for n in (1, 2, 3):\n        await queue.put(n)\n        print("put", n)\n        await asyncio.sleep(0)\n    await queue.put(None)\n\nasync def consumer():\n    while True:\n        n = await queue.get()\n        if n is None:\n            break\n        print("got", n)\n\nawait asyncio.gather(producer(), consumer())`,
        output: 'put 1\ngot 1\nput 2\ngot 2\nput 3\ngot 3',
      },
      { t: 'h', text: 'Do not wait for ever: timeouts' },
      {
        t: 'code',
        text: `import asyncio\n\ntry:\n    await asyncio.wait_for(asyncio.sleep(1), timeout=0.01)\nexcept asyncio.TimeoutError:\n    print("too slow, giving up")`,
        output: 'too slow, giving up',
      },
      { t: 'h', text: 'The trap: shared state' },
      { t: 'p', text: 'Two coroutines that read a value, pause, and then write it back can overwrite each other’s work. Two customers withdraw from the same balance. What do you expect?' },
      {
        t: 'predict',
        code: `import asyncio\n\nbalance = 100\n\nasync def withdraw(amount):\n    global balance\n    current = balance\n    await asyncio.sleep(0)\n    balance = current - amount\n\nawait asyncio.gather(withdraw(30), withdraw(50))\nprint(balance)`,
        question: 'What does this print? (100 minus 30 minus 50 should be 20.)',
        options: ['20', '50', '70'],
        answer: 1,
        explain: 'Both coroutines read 100 BEFORE either one wrote. The first wrote 70, then the second wrote 100 - 50 = 50 over it. A lost update! This is called a race condition.',
      },
      { t: 'p', text: 'The cure is a lock: only one coroutine at a time may be inside the protected block, so the read and the write happen together.' },
      {
        t: 'code',
        text: `import asyncio\n\nbalance = 100\nlock = asyncio.Lock()\n\nasync def withdraw(amount):\n    global balance\n    async with lock:\n        current = balance\n        await asyncio.sleep(0)\n        balance = current - amount\n\nawait asyncio.gather(withdraw(30), withdraw(50))\nprint(balance)`,
        output: '20',
      },
      {
        t: 'fill',
        prompt: 'Pause politely so that another coroutine can take a turn.',
        template: `import asyncio\n\nasync def tick():\n    print("tick")\n    await asyncio.___(0)\n    print("tock")\n\nawait tick()`,
        blanks: [{ options: ['sleep', 'gather', 'wait_for'], answer: 'sleep' }],
        output: 'tick\ntock',
      },
      {
        t: 'bug',
        code: `import asyncio\n\ndef slow(n):\n    return n\n\nprint(await asyncio.gather(slow(1), slow(2)))`,
        question: 'This crashes with “An asyncio.Future, a coroutine or an awaitable is required”. Why?',
        options: ['slow was written with def, not async def, so gather received plain numbers', 'gather cannot take two arguments', 'print cannot be used with await'],
        answer: 0,
        explain: 'gather wants coroutines it can run. A normal function just returns a number, and a number is not something you can await. Write async def.',
        fixed: `import asyncio\n\nasync def slow(n):\n    await asyncio.sleep(0)\n    return n\n\nprint(await asyncio.gather(slow(1), slow(2)))`,
      },
      {
        t: 'quiz',
        question: 'Which job does asyncio help with most?',
        options: ['Checking 50 prices on a server, where most of the time is spent waiting for answers', 'Multiplying a huge matrix of numbers', 'Sorting a list that is already in memory'],
        answer: 0,
        explain: 'asyncio fills waiting time with other work. Heavy calculations do not wait for anything, so they get no benefit.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import asyncio\nimport time\n\nasync def slow(n):\n    time.sleep(0.1)\n    return n\n\nstart = time.perf_counter()\nawait asyncio.gather(slow(0), slow(1), slow(2))\nprint("together was faster:", time.perf_counter() - start < 0.2)`,
            why: '`time.sleep` blocks the WHOLE program, so nobody else gets a turn and the three waits add up. Inside coroutines always use `await asyncio.sleep`.',
            right: `import asyncio\nimport time\n\nasync def slow(n):\n    await asyncio.sleep(0.1)\n    return n\n\nstart = time.perf_counter()\nawait asyncio.gather(slow(0), slow(1), slow(2))\nprint("together was faster:", time.perf_counter() - start < 0.25)`,
            logic: true,
          },
          {
            wrong: `import asyncio\n\nasync def main():\n    return "done"\n\nprint(asyncio.run(main()))`,
            why: 'On a normal computer this line is exactly right. In this app the editor already runs an event loop, so `asyncio.run` refuses. Here, simply write `await main()`.',
            right: `import asyncio\n\nasync def main():\n    return "done"\n\nprint(await main())`,
            logic: true,
          },
          {
            wrong: `import asyncio\n\nbalance = 100\n\nasync def withdraw(amount):\n    global balance\n    current = balance\n    await asyncio.sleep(0)\n    balance = current - amount\n\nawait asyncio.gather(withdraw(30), withdraw(50))\nprint(balance)`,
            why: 'The read and the write are separated by an await, so another coroutine can sneak in between. Protect shared state with `asyncio.Lock`.',
            right: `import asyncio\n\nbalance = 100\nlock = asyncio.Lock()\n\nasync def withdraw(amount):\n    global balance\n    async with lock:\n        current = balance\n        await asyncio.sleep(0)\n        balance = current - amount\n\nawait asyncio.gather(withdraw(30), withdraw(50))\nprint(balance)`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['Concurrency means never wasting time waiting. It is not the same as doing two things at the exact same moment.', '`async def` makes a coroutine. Calling it creates the order slip, `await` runs it.', '`asyncio.gather` runs many together and returns the answers in order. `asyncio.Queue` hands work from one to another.', '`asyncio.wait_for(..., timeout=...)` stops you waiting for ever.', 'Shared state plus an `await` in the middle makes race conditions. Use `asyncio.Lock`.', 'Waiting work suits asyncio. Heavy calculation needs separate processes. Threads and `asyncio.run` are for a normal computer, not this browser tab.'],
        memory: 'One cook, many pots. await = turn to the next pot.',
      },
    ],
    exercises: [
      {
        id: 'py52-gather',
        title: 'Look up all the prices together',
        prompt: 'The async function `get_price(item)` is ready. Finish `fetch_all(items)` so that it starts ALL the lookups together with `asyncio.gather` and returns the list of prices in the same order. The program then prints `item: price`, or `item: not found` when the price is `None`.',
        starter: 'import asyncio\n\nPRICES = {"sugar": 4500, "rice": 3000, "tea": 500}\n\nasync def get_price(item):\n    await asyncio.sleep(0)\n    return PRICES.get(item)\n\nasync def fetch_all(items):\n    # start every lookup together and return the answers in order\n    return []\n\nitems = input().split()\nprices = await fetch_all(items)\nfor item, price in zip(items, prices):\n    print(f"{item}: {price if price is not None else \'not found\'}")\n',
        sampleInput: 'sugar mango tea',
        usesInput: true,
        tests: [
          { input: 'sugar mango tea', expected: 'sugar: 4500\nmango: not found\ntea: 500' },
          { input: 'rice', expected: 'rice: 3000' },
          { input: 'tea tea sugar', expected: 'tea: 500\ntea: 500\nsugar: 4500', hidden: true },
        ],
        hints: [
          'Make one coroutine per item: `get_price(item)` for each item in the list.',
          '`await asyncio.gather(*[get_price(item) for item in items])`. The star unpacks the list into separate arguments.',
          'Return what gather gives you: `return await asyncio.gather(...)`.',
        ],
      },
      {
        id: 'py52-workers',
        title: 'Two cooks, one kitchen',
        prompt: 'The `worker(name, steps)` coroutine prints `NAME step I` for each step and then pauses with `await asyncio.sleep(0)`. At the moment the program runs worker A completely and THEN worker B. Change it so both run together, taking turns. For `2 3` the output must be `A step 1`, `B step 1`, `A step 2`, `B step 2`, `B step 3`.',
        starter: 'import asyncio\n\nasync def worker(name, steps):\n    for i in range(1, steps + 1):\n        print(name, "step", i)\n        await asyncio.sleep(0)\n\na, b = [int(x) for x in input().split()]\nawait worker("A", a)\nawait worker("B", b)\n',
        sampleInput: '2 3',
        usesInput: true,
        tests: [
          { input: '2 3', expected: 'A step 1\nB step 1\nA step 2\nB step 2\nB step 3' },
          { input: '1 1', expected: 'A step 1\nB step 1' },
          { input: '3 1', expected: 'A step 1\nB step 1\nA step 2\nA step 3', hidden: true },
        ],
        hints: [
          'Awaiting one worker and then the next makes them run one after the other.',
          'Hand both coroutines to `asyncio.gather` so they run together.',
          'Replace the two `await` lines with `await asyncio.gather(worker("A", a), worker("B", b))`.',
        ],
      },
      {
        id: 'py52-timeout',
        title: 'Do not wait for ever',
        prompt: 'The coroutine `slow_call(delay)` waits `delay` seconds and returns `done`. Write `call_with_limit(delay, limit)`. It must wait at most `limit` seconds, using `asyncio.wait_for`. Return the result, or the text `timeout` if it takes too long.',
        starter: 'import asyncio\n\nasync def slow_call(delay):\n    await asyncio.sleep(delay)\n    return "done"\n\nasync def call_with_limit(delay, limit):\n    # use asyncio.wait_for and catch asyncio.TimeoutError\n    return "done"\n\ndelay, limit = [float(x) for x in input().split()]\nprint(await call_with_limit(delay, limit))\n',
        sampleInput: '0 1',
        usesInput: true,
        tests: [
          { input: '0 1', expected: 'done' },
          { input: '0.3 0.02', expected: 'timeout' },
          { input: '0.2 0.01', expected: 'timeout', hidden: true },
        ],
        hints: [
          'Wrap the call in `try:` and catch `asyncio.TimeoutError` in an `except`.',
          '`return await asyncio.wait_for(slow_call(delay), timeout=limit)` inside the try.',
          'In the `except asyncio.TimeoutError:` block, `return "timeout"`.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 54
  {
    id: 'py-backend',
    level: LEVEL,
    minutes: 26,
    title: 'How a web backend thinks',
    summary: 'Requests, routes, handlers, status codes, validation and a login guard, built from scratch',
    blocks: [
      {
        t: 'story',
        title: 'Now you are the kitchen',
        text: 'Mama Rose’s cousin wants a website where customers can see the shop’s prices on their phones. In Lesson 50 your program was the customer: it sent requests to someone else’s server. Now you become the kitchen. You will write the program that WAITS for requests, decides what each one is asking for, and sends back an answer.\n\nThat program is called a backend. Real ones are built with frameworks such as Flask, FastAPI or Django. Those cannot be installed in this offline app, so we will build a tiny framework of our own, about 25 lines long. By the end you will understand what Flask does inside, because it works the same way.',
      },
      { t: 'h', text: 'The shape of every backend' },
      {
        t: 'list',
        items: [
          'A REQUEST arrives: a method (`GET`, `POST`, `DELETE`…), a path (`/items/2`), maybe headers and a body.',
          'A ROUTER looks for the route that matches the method and the path.',
          'A HANDLER function runs and decides what to answer.',
          'A RESPONSE goes back: a status code and (usually) JSON.',
        ],
      },
      { t: 'p', text: 'A route is registered with a decorator (Level 6!). The decorator does not change the function. It only writes it down in a list. Here is the whole router. Read it slowly; it is the most important code in this lesson. (A pattern like `/items/<item_id>` is turned into a regular expression, Lesson 40, that captures the `item_id` part.)' },
      {
        t: 'code',
        text: `${MINI_APP}\n\napp = MiniApp()\n\n@app.route("GET", "/hello/<name>")\ndef hello(request, name):\n    return 200, {"message": "Welcome, " + name}\n\nprint(app.handle("GET", "/hello/Amina"))\nprint(app.handle("GET", "/goodbye"))`,
        output: '(200, \'{"message": "Welcome, Amina"}\')\n(404, \'{"error": "not found"}\')',
      },
      { t: 'tip', text: 'In Flask the same thing looks like `@app.get("/hello/<name>")` above a function. The path pattern, the decorator and the (status, data) answer are the same ideas. Real frameworks add a real network server, speed, and many safety features on top.' },
      { t: 'h', text: 'Reading data: GET' },
      {
        t: 'code',
        text: `${MINI_APP}\n\napp = MiniApp()\n${ITEMS2}\n\n${LIST_ROUTE}\n\n${GET_ROUTE}\n\nprint(app.handle("GET", "/items/2"))\nprint(app.handle("GET", "/items/9"))\nprint(app.handle("GET", "/items/abc"))`,
        output: '(200, \'{"id": 2, "name": "rice", "price": 3000}\')\n(404, \'{"error": "no such item"}\')\n(400, \'{"error": "id must be a number"}\')',
      },
      { t: 'p', text: 'Three different answers from one route. A good backend picks the right status for each situation: `200` for success, `404` when the thing does not exist, `400` when the request itself is wrong. It never lets a wrong request crash the server.' },
      { t: 'h', text: 'Creating data: POST, and never trust the input' },
      { t: 'p', text: 'Anyone on the internet can send your server anything. So every value that arrives in a request must be checked before you use it. A new item needs a real name and a positive whole-number price. A success says `201 Created`.' },
      {
        t: 'code',
        text: `${MINI_APP}\n\napp = MiniApp()\n${ITEMS2}\n\n@app.route("POST", "/items")\ndef create_item(request):\n${POST_BODY}\n\nprint(app.handle("POST", "/items", {"name": "tea", "price": 500}))\nprint(app.handle("POST", "/items", {"name": "oil", "price": -5}))\nprint(app.handle("POST", "/items", {"price": 100}))\nprint(sorted(ITEMS))`,
        output: '(201, \'{"id": 3, "name": "tea", "price": 500}\')\n(400, \'{"error": "price must be a positive whole number"}\')\n(400, \'{"error": "name is required"}\')\n[1, 2, 3]',
      },
      { t: 'analogy', text: 'Validation is the guard at the shop door. Not everyone who knocks gets in, and nobody gets in with a weapon or a forged note. The cheapest time to stop a bad value is at the door, before it reaches the till.' },
      { t: 'h', text: 'A guard for private routes' },
      { t: 'p', text: 'Some routes, such as deleting an item, must be private. A decorator can guard them: it checks the request’s key before the handler runs. One decorator, many routes (the pattern from Lesson 36).' },
      {
        t: 'code',
        text: `${MINI_APP}\n\napp = MiniApp()\n${ITEMS2}\n\n${REQUIRES_KEY}\n\n@app.route("DELETE", "/items/<item_id>")\n@requires_key\ndef delete_item(request, item_id):\n    ITEMS.pop(int(item_id), None)\n    return 200, {"deleted": int(item_id)}\n\nprint(app.handle("DELETE", "/items/1"))\nprint(app.handle("DELETE", "/items/1", headers={"x-api-key": "duuka-key"}))\nprint(sorted(ITEMS))`,
        output: '(401, \'{"error": "missing or wrong key"}\')\n(200, \'{"deleted": 1}\')\n[2]',
      },
      { t: 'h', text: 'Things every backend developer remembers' },
      {
        t: 'list',
        items: [
          'Stateless: each request stands alone. Do not keep a customer’s data in a global variable. Keep it in a database (Lesson 49).',
          'Validate everything that comes in. Never build SQL from request text (Lesson 49).',
          '401 means “who are you?”, 403 means “I know you, but you may not”.',
          'Keep secrets (keys, passwords) out of your code. Use settings or environment variables (Lesson 48).',
          'Return the same JSON shape for every error, so a phone app can always read it.',
        ],
      },
      {
        t: 'fill',
        prompt: 'A new thing was created. Choose the right status code.',
        template: `def create():\n    return ___, {"id": 3}\n\nprint(create())`,
        blanks: [{ options: ['201', '200', '404'], answer: '201' }],
        output: "(201, {'id': 3})",
      },
      {
        t: 'bug',
        code: `${MINI_APP}\n\napp = MiniApp()\n\n@app.route("GET", "/ping")\ndef ping(request):\n    return {"ok": True}\n\nprint(app.handle("GET", "/ping"))`,
        question: 'This crashes inside handle. Why?',
        options: ['The handler must return a status AND the data, as a pair', 'ping is not a valid path', 'GET routes cannot return JSON'],
        answer: 0,
        explain: 'handle does `status, data = func(...)`, so every handler must return two things. Returning only the dictionary cannot be split into two values.',
        fixed: `${MINI_APP}\n\napp = MiniApp()\n\n@app.route("GET", "/ping")\ndef ping(request):\n    return 200, {"ok": True}\n\nprint(app.handle("GET", "/ping"))`,
      },
      {
        t: 'quiz',
        question: 'A customer asks for /items/999 and no such item exists. Which status fits best?',
        options: ['404 Not Found', '200 OK', '500 Server error'],
        answer: 0,
        explain: 'The request was fine, but the thing does not exist: 404. A 500 would mean YOUR program broke, which it did not.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `${MINI_APP}\n\napp = MiniApp()\n${ITEMS2}\n\n@app.route("GET", "/items/<item_id>")\ndef get_item(request, item_id):\n    return 200, ITEMS[int(item_id)]\n\nprint(app.handle("GET", "/items/abc"))`,
            why: 'The handler trusts the path. `abc` is not a number, so `int()` raises an error that nobody catches and the whole request crashes. Check first and answer with a 400.',
            right: `${MINI_APP}\n\napp = MiniApp()\n${ITEMS2}\n\n@app.route("GET", "/items/<item_id>")\ndef get_item(request, item_id):\n    if not item_id.isdigit():\n        raise HttpError(400, "id must be a number")\n    return 200, ITEMS[int(item_id)]\n\nprint(app.handle("GET", "/items/abc"))`,
          },
          {
            wrong: `${MINI_APP}\n\napp = MiniApp()\n\n@app.route("GET", "/items/<item_id>")\ndef get_item(request, item_id):\n    return 200, {"error": "no such item"}\n\nprint(app.handle("GET", "/items/9"))`,
            why: 'The message says “error” but the status says 200 (success). A phone app that only looks at the status will think everything is fine. Raise `HttpError(404, ...)` instead.',
            right: `${MINI_APP}\n\napp = MiniApp()\n\n@app.route("GET", "/items/<item_id>")\ndef get_item(request, item_id):\n    raise HttpError(404, "no such item")\n\nprint(app.handle("GET", "/items/9"))`,
            logic: true,
          },
          {
            wrong: `${MINI_APP}\n\napp = MiniApp()\nlast_customer = {}\n\n@app.route("POST", "/hello/<name>")\ndef hello(request, name):\n    last_customer["name"] = name\n    return 200, {"message": "Hi " + last_customer["name"]}\n\nprint(app.handle("POST", "/hello/Amina"))`,
            why: 'Keeping a customer in a global variable is dangerous on a real server: thousands of customers share it and overwrite each other. Keep per-request data in local variables and store lasting data in a database.',
            right: `${MINI_APP}\n\napp = MiniApp()\n\n@app.route("POST", "/hello/<name>")\ndef hello(request, name):\n    return 200, {"message": "Hi " + name}\n\nprint(app.handle("POST", "/hello/Amina"))`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['A backend turns requests (method, path, headers, body) into responses (status, JSON).', 'A router matches method and path to a handler. Routes are registered with a decorator.', 'Choose honest status codes: 200, 201, 400, 401, 404.', 'Validate every incoming value before you use it.', 'Guards (decorators) protect private routes. Each request stands alone: keep lasting data in a database.', 'Flask, FastAPI and Django are this same idea, grown up and fast.'],
        memory: 'Request in, router matches, handler decides, response out.',
      },
    ],
    exercises: [
      {
        id: 'py53-route',
        title: 'Add the single-item route',
        prompt: 'The router and the `GET /items` route are ready. Add the route `GET /items/<item_id>`. A path part that is not a whole number gives `HttpError(400, "id must be a number")`. An id that does not exist gives `HttpError(404, "no such item")`. Otherwise answer `200` and the item. The program reads `n` paths and prints each answer as `status body`.',
        starter: `${MINI_APP}\n\napp = MiniApp()\n${ITEMS3}\n\n${LIST_ROUTE}\n\n# add the route GET /items/<item_id> here\n\nn = int(input())\nfor i in range(n):\n    print(*app.handle("GET", input()))\n`,
        sampleInput: '3\n/items/2\n/items/9\n/items/abc',
        usesInput: true,
        tests: [
          { input: '3\n/items/2\n/items/9\n/items/abc', expected: '200 {"id": 2, "name": "rice", "price": 3000}\n404 {"error": "no such item"}\n400 {"error": "id must be a number"}' },
          { input: '1\n/items/3', expected: '200 {"id": 3, "name": "tea", "price": 500}' },
          { input: '2\n/items\n/nothing', expected: '200 [{"id": 1, "name": "sugar", "price": 4500}, {"id": 2, "name": "rice", "price": 3000}, {"id": 3, "name": "tea", "price": 500}]\n404 {"error": "not found"}', hidden: true },
        ],
        hints: [
          'Copy the shape of the `GET /items` route, but with the pattern `"/items/<item_id>"` and an extra parameter `item_id` in the function.',
          '`item_id` arrives as text. `item_id.isdigit()` tells you whether it is a whole number.',
          'Then `ITEMS.get(int(item_id))`. If it is `None`, raise the 404 error, otherwise `return 200, item`.',
        ],
      },
      {
        id: 'py53-validate',
        title: 'The guard at the door',
        prompt: 'Write the handler for `POST /items`. The body needs a `name` (a non-empty text, spaces do not count) and a `price` (a positive whole number). If the name is wrong raise `HttpError(400, "name is required")`, check the name first. If the price is wrong raise `HttpError(400, "price must be a positive whole number")`. Otherwise store the item with the next id (the biggest id plus one) and answer `201` with the new item (name trimmed). The program reads `n` JSON bodies.',
        starter: `import json\n\n${MINI_APP}\n\napp = MiniApp()\n${ITEMS2}\n\n@app.route("POST", "/items")\ndef create_item(request):\n    # check the name, check the price, then create the item\n    return 201, {}\n\nn = int(input())\nfor i in range(n):\n    print(*app.handle("POST", "/items", json.loads(input())))\n`,
        sampleInput: '4\n{"name": "tea", "price": 500}\n{"name": "  ", "price": 500}\n{"name": "oil", "price": -5}\n{"name": " salt ", "price": 800}',
        usesInput: true,
        tests: [
          { input: '4\n{"name": "tea", "price": 500}\n{"name": "  ", "price": 500}\n{"name": "oil", "price": -5}\n{"name": " salt ", "price": 800}', expected: '201 {"id": 3, "name": "tea", "price": 500}\n400 {"error": "name is required"}\n400 {"error": "price must be a positive whole number"}\n201 {"id": 4, "name": "salt", "price": 800}' },
          { input: '1\n{"name": "beans", "price": 1200}', expected: '201 {"id": 3, "name": "beans", "price": 1200}' },
          { input: '3\n{"price": 100}\n{"name": "oil", "price": "800"}\n{"name": "oil", "price": 0}', expected: '400 {"error": "name is required"}\n400 {"error": "price must be a positive whole number"}\n400 {"error": "price must be a positive whole number"}', hidden: true },
        ],
        hints: [
          'Get both values with `body.get("name")` and `body.get("price")`. `.get` gives `None` when a key is missing.',
          'The name is bad unless it is text with something in it: `not isinstance(name, str) or not name.strip()`. The price is bad unless it is a whole number above 0.',
          'The lesson’s `create_item` example is the full answer. Check the name BEFORE the price, as the task says.',
        ],
      },
      {
        id: 'py53-auth',
        title: 'Guard the report',
        prompt: 'Write the `requires_key` decorator. The wrapper must look at `request["headers"].get("x-api-key")`. If it is not exactly `duuka-key`, raise `HttpError(401, "missing or wrong key")`. Otherwise run the real handler. The program reads `n` lines; a line of `-` means no key was sent, anything else is the key.',
        starter: `${MINI_APP}\n\napp = MiniApp()\n\ndef requires_key(func):\n    # return a wrapper that checks the key before calling func\n    return func\n\n@app.route("GET", "/report")\n@requires_key\ndef report(request):\n    return 200, {"total": 12000}\n\nn = int(input())\nfor i in range(n):\n    line = input()\n    headers = {} if line == "-" else {"x-api-key": line}\n    print(*app.handle("GET", "/report", headers=headers))\n`,
        sampleInput: '3\n-\nwrong\nduuka-key',
        usesInput: true,
        tests: [
          { input: '3\n-\nwrong\nduuka-key', expected: '401 {"error": "missing or wrong key"}\n401 {"error": "missing or wrong key"}\n200 {"total": 12000}' },
          { input: '1\nduuka-key', expected: '200 {"total": 12000}' },
          { input: '2\nDUUKA-KEY\n-', expected: '401 {"error": "missing or wrong key"}\n401 {"error": "missing or wrong key"}', hidden: true },
        ],
        hints: [
          'A decorator is a function that returns a wrapper. The wrapper takes `request` and `**params`, like the handlers do.',
          'Inside the wrapper: `if request["headers"].get("x-api-key") != "duuka-key": raise HttpError(401, "missing or wrong key")`.',
          'If the key is fine, `return func(request, **params)`. Finish by returning `wrapper`. The lesson’s `requires_key` is the full answer.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 55
  {
    id: 'py-shipping',
    level: LEVEL,
    minutes: 24,
    title: 'Shipping your program: packaging and versions',
    summary: 'pyproject.toml, versions, entry points, archives, checksums and requirements',
    blocks: [
      {
        t: 'story',
        title: 'The nephew who wants to install Duuka',
        text: 'Mama Rose’s nephew runs a shop in Jinja and wants Duuka Manager on his computer. He asks four questions. Where do I get it? Which version is it? What else must I install first? And how do I know the file was not damaged or changed on the way?\n\nPackaging answers all four. It is the difference between “a program that works on my laptop” and “a product other people can install”. Real tools (`pip`, `venv`, `python -m build`) need a normal computer, so we cannot run them in this app. But everything they depend on is just files and text, and we CAN explore those.',
      },
      { t: 'h', text: 'The shape of a shippable project' },
      {
        t: 'list',
        items: [
          '`duuka/` the package: `__init__.py`, `cli.py`, `models.py`…',
          '`pyproject.toml` the label on the box: name, version, requirements, commands.',
          '`README.md` what it is and how to use it.',
          '`LICENSE` what other people are allowed to do with it.',
          '`tests/` the tests (Lesson 52).',
          '`CHANGELOG.md` what changed in each version.',
        ],
      },
      { t: 'h', text: 'pyproject.toml: the label on the box' },
      { t: 'p', text: 'This single file tells tools everything about your project. It is written in TOML, a friendly format, and Python reads it with the `tomllib` module.' },
      {
        t: 'code',
        text: `import tomllib\n\nTEXT = """[project]\nname = "duuka"\nversion = "1.2.0"\ndescription = "A shop manager for small businesses"\nrequires-python = ">=3.10"\ndependencies = ["rich>=13"]\n\n[project.scripts]\nduuka = "duuka.cli:main"\n"""\n\nproject = tomllib.loads(TEXT)["project"]\nprint(project["name"], project["version"])\nprint(project["dependencies"])\nprint(project["scripts"])`,
        output: "duuka 1.2.0\n['rich>=13']\n{'duuka': 'duuka.cli:main'}",
      },
      { t: 'h', text: 'Versions: say what changed' },
      { t: 'p', text: 'A version has three numbers, MAJOR.MINOR.PATCH. A PATCH change fixes a bug. A MINOR change adds something without breaking old users. A MAJOR change may break things, so people must read before upgrading. Be careful: version numbers must be compared as NUMBERS, not as text.' },
      {
        t: 'predict',
        code: `print(max("9.0", "10.0"))`,
        question: 'What does this print?',
        options: ['10.0', '9.0', 'an error'],
        answer: 1,
        explain: 'Text is compared letter by letter, and "9" comes after "1". So as text, "9.0" is bigger than "10.0". For versions you must compare numbers.',
      },
      {
        t: 'code',
        text: `${PARSE_VERSION}\n\nprint("1.10.0" > "1.9.0")\nprint(parse_version("1.10.0") > parse_version("1.9.0"))\nprint(sorted(["1.10.0", "1.2.5", "1.9.1"], key=parse_version))`,
        output: "False\nTrue\n['1.2.5', '1.9.1', '1.10.0']",
      },
      {
        t: 'quiz',
        question: 'You changed how a function works so that old programs using it will break. Which number do you raise?',
        options: ['MAJOR (the first)', 'MINOR (the middle)', 'PATCH (the last)'],
        answer: 0,
        explain: 'A change that can break existing users is a MAJOR change, for example 1.4.2 becomes 2.0.0. It warns everyone to read before they upgrade.',
      },
      { t: 'h', text: 'Entry points: how a typed command finds your code' },
      { t: 'p', text: 'In `pyproject.toml` we wrote `duuka = "duuka.cli:main"`. It means “when the user types `duuka`, import the module `duuka.cli` and call its function `main`”. The part before the colon is the module, the part after is the function. Here is the lookup, done by hand:' },
      {
        t: 'code',
        text: `${A.MAKE_PACKAGE}\n\nmake_package("duukacli", {\n    "__init__.py": """__version__ = '1.2.0'\n""",\n    "cli.py": """def main():\n    print("Duuka Manager 1.2.0")\n    return 0\n""",\n})\n\ndef load_entry_point(spec):\n    module_name, function_name = spec.split(":")\n    module = importlib.import_module(module_name)\n    return getattr(module, function_name)\n\nmain = load_entry_point("duukacli.cli:main")\nprint(main())`,
        output: 'Duuka Manager 1.2.0\n0',
      },
      { t: 'h', text: 'Archives and checksums' },
      { t: 'p', text: 'A package you send to someone is an archive: a zip file with your files inside (a “wheel” is exactly that, with a special layout). A checksum is a short fingerprint of a file. If even one letter changes on the way, the fingerprint changes, so the receiver can tell the file is damaged or tampered with.' },
      {
        t: 'code',
        text: `import hashlib\nimport io\nimport zipfile\n\nbuffer = io.BytesIO()\nwith zipfile.ZipFile(buffer, "w") as archive:\n    archive.writestr("duuka/__init__.py", "__version__ = '1.2.0'\\n")\n    archive.writestr("duuka/cli.py", "def main():\\n    return 0\\n")\n    archive.writestr("README.md", "# Duuka\\n")\n\nwith zipfile.ZipFile(io.BytesIO(buffer.getvalue())) as archive:\n    print(sorted(archive.namelist()))\n    print(archive.read("duuka/__init__.py").decode().strip())\n\nprint(hashlib.sha256(b"duuka").hexdigest()[:12])`,
        output: "['README.md', 'duuka/__init__.py', 'duuka/cli.py']\n__version__ = '1.2.0'\n1c95a75676d9",
      },
      { t: 'h', text: 'Requirements: what else must be installed' },
      { t: 'p', text: 'Your program uses other people’s libraries. A `requirements.txt` lists them, and “pins” the exact versions with `==` so that everyone gets the same behaviour. Each project should live in its own virtual environment (a private toolbox), so one project’s libraries never disturb another’s.' },
      {
        t: 'code',
        text: `REQUIREMENTS = """rich==13.7.1\nrequests>=2.31\n# testing tools\npytest==8.1.0\n"""\n\npins = {}\nfor line in REQUIREMENTS.splitlines():\n    line = line.strip()\n    if not line or line.startswith("#"):\n        continue\n    if "==" in line:\n        name, version = line.split("==")\n        pins[name] = version\nprint(pins)`,
        output: "{'rich': '13.7.1', 'pytest': '8.1.0'}",
      },
      { t: 'p', text: 'On a normal computer you would then run these (they do not work in this app):' },
      {
        t: 'list',
        items: [
          '`python -m venv .venv` makes the private toolbox.',
          '`pip install -r requirements.txt` installs the pinned libraries.',
          '`python -m build` builds the archive (the wheel).',
          '`pip install duuka-1.2.0-py3-none-any.whl` installs your product on the nephew’s computer. After that he can type `duuka`.',
        ],
      },
      {
        t: 'fill',
        prompt: 'Turn a version text into numbers so it can be compared.',
        template: `def parse_version(text):\n    return tuple(int(part) for part in text.___("."))\n\nprint(parse_version("1.10.0"))`,
        blanks: [{ options: ['split', 'join', 'strip'], answer: 'split' }],
        output: '(1, 10, 0)',
      },
      {
        t: 'bug',
        code: `import importlib\n\nfunction = importlib.import_module("json:dumps")\nprint(function({"ok": True}))`,
        question: 'This crashes with “No module named json:dumps”. Why?',
        options: ['The entry point string was never split at the colon into module and function', 'json cannot be imported', 'dumps is not a function'],
        answer: 0,
        explain: '"json:dumps" is a module part and a function part joined by a colon. import_module needs the module part alone, then getattr takes the function.',
        fixed: `import importlib\n\nmodule_name, function_name = "json:dumps".split(":")\nfunction = getattr(importlib.import_module(module_name), function_name)\nprint(function({"ok": True}))`,
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `print(sorted(["1.10.0", "1.9.0", "1.2.0"]))`,
            why: 'Sorting version numbers as TEXT puts 1.10.0 before 1.9.0. Convert each to a tuple of numbers with a key function.',
            right: `def parse_version(text):\n    return tuple(int(part) for part in text.split("."))\n\nprint(sorted(["1.10.0", "1.9.0", "1.2.0"], key=parse_version))`,
            logic: true,
          },
          {
            wrong: `def load_entry_point(spec):\n    module_name, function_name = spec.split(":")\n    return module_name, function_name\n\nprint(load_entry_point("json.dumps"))`,
            why: 'An entry point has a COLON between the module and the function. With a dot there is no colon to split on, so there is nothing to unpack.',
            right: `def load_entry_point(spec):\n    module_name, function_name = spec.split(":")\n    return module_name, function_name\n\nprint(load_entry_point("json:dumps"))`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['A shippable project has a package, `pyproject.toml`, a README, a LICENSE, tests and a changelog.', '`pyproject.toml` (read with `tomllib`) names the project, its version, its dependencies and its commands.', 'Versions are MAJOR.MINOR.PATCH. Compare them as numbers, never as text.', 'An entry point like `duuka.cli:main` is a module, a colon and a function.', 'A package is an archive; a checksum proves it was not changed on the way.', 'Pin your requirements, and give every project its own virtual environment.'],
        memory: 'Label the box, number the version, pin the tools, fingerprint the file.',
      },
    ],
    exercises: [
      {
        id: 'py54-toml',
        title: 'Read the label',
        prompt: 'Read `n`, then `n` lines of a `pyproject.toml` text (join them with new lines and read them with `tomllib.loads`). Print the project name and version on one line, and then `Dependencies:` and how many dependencies are listed (0 when there is no `dependencies` key).',
        starter: 'import tomllib\n\nn = int(input())\ntext = "\\n".join(input() for i in range(n))\n# read the text and print the name, the version and the number of dependencies\nprint("?")\n',
        sampleInput: '4\n[project]\nname = "duuka"\nversion = "1.2.0"\ndependencies = ["rich>=13", "requests"]',
        usesInput: true,
        tests: [
          { input: '4\n[project]\nname = "duuka"\nversion = "1.2.0"\ndependencies = ["rich>=13", "requests"]', expected: 'duuka 1.2.0\nDependencies: 2' },
          { input: '3\n[project]\nname = "tillkit"\nversion = "0.3.1"', expected: 'tillkit 0.3.1\nDependencies: 0' },
          { input: '4\n[project]\nname = "shopmap"\nversion = "2.0.0"\ndependencies = ["rich"]', expected: 'shopmap 2.0.0\nDependencies: 1', hidden: true },
        ],
        hints: [
          '`config = tomllib.loads(text)` gives you a dictionary. The details are under the key `"project"`.',
          '`project = config["project"]`, then `project["name"]` and `project["version"]`.',
          'For the count use `len(project.get("dependencies", []))`. The `.get` gives an empty list when the key is missing.',
        ],
      },
      {
        id: 'py54-version',
        title: 'Which version is newest?',
        prompt: 'Read a line of version numbers. Print `Newest:` and the newest one on the first line, and `Order:` followed by all of them from oldest to newest, joined with ` < ` on the second line. Compare versions as numbers, not as text.',
        starter: 'versions = input().split()\n# sort the versions as numbers, not as text\nordered = sorted(versions)\nprint("Newest:", ordered[-1])\nprint("Order:", " < ".join(ordered))\n',
        sampleInput: '1.10.0 1.2.5 1.9.1',
        usesInput: true,
        tests: [
          { input: '1.10.0 1.2.5 1.9.1', expected: 'Newest: 1.10.0\nOrder: 1.2.5 < 1.9.1 < 1.10.0' },
          { input: '2.0.0 1.99.99', expected: 'Newest: 2.0.0\nOrder: 1.99.99 < 2.0.0' },
          { input: '0.9.0', expected: 'Newest: 0.9.0\nOrder: 0.9.0', hidden: true },
        ],
        hints: [
          'Text sorting puts "1.10.0" before "1.9.1". Sort by numbers instead.',
          'Give `sorted` a `key` function that turns each version into a tuple of whole numbers: `tuple(int(p) for p in v.split("."))`.',
          'Then the newest is the last item of the sorted list. Keep the same two print lines.',
        ],
      },
      {
        id: 'py54-entry',
        title: 'Follow the entry point',
        prompt: 'A package `shopapp` has been written for you with a module `tools`. Write `load_entry_point(spec)`. It splits a spec like `shopapp.tools:greet` at the colon, imports the module with `importlib.import_module`, and returns the function with `getattr`. The program loads the entry point named on the input line and prints what calling it returns.',
        starter: `${A.MAKE_PACKAGE}\n\nmake_package("shopapp", {\n    "__init__.py": "",\n    "tools.py": """def greet():\n    return "Welcome to the shop"\n\ndef total():\n    return 42\n""",\n})\n\ndef load_entry_point(spec):\n    # split at the colon, import the module, return the function\n    return None\n\nfunction = load_entry_point(input())\nprint(function())\n`,
        sampleInput: 'shopapp.tools:greet',
        usesInput: true,
        tests: [
          { input: 'shopapp.tools:greet', expected: 'Welcome to the shop' },
          { input: 'shopapp.tools:total', expected: '42', hidden: true },
        ],
        hints: [
          '`module_name, function_name = spec.split(":")` gives you the two parts.',
          '`module = importlib.import_module(module_name)` loads the module.',
          '`return getattr(module, function_name)`. The lesson has the same function.',
        ],
      },
    ],
  },
];

export const level9aSolution = { MINI_APP, ITEMS2, ITEMS3, LIST_ROUTE, GET_ROUTE, POST_BODY, REQUIRES_KEY, PARSE_VERSION };
