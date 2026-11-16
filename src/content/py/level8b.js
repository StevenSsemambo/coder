// Python, Level 8 (Building real products), part B: APIs and JSON (simulated), logging and debugging, Duuka Manager project.
// Lessons 50 to 52. Exercise ids use the lesson number minus one (py49-, py50-, py51-).
// The browser has no network, so APIs are taught with a pretend server (fake_api) that returns (status, JSON text).

import { level8Solution as A } from './level8a.js';

const LEVEL = 'Level 8: Building real products';

const FAKE_API = `ITEMS = [
    {"id": 1, "name": "sugar", "price": 4500},
    {"id": 2, "name": "rice", "price": 3000},
    {"id": 3, "name": "tea", "price": 500},
]

def fake_api(method, url):
    """A pretend server: returns (status code, JSON text)."""
    parts = urlparse(url)
    if method == "GET" and parts.path == "/v1/items":
        page = int(parse_qs(parts.query).get("page", ["1"])[0])
        chunk = ITEMS[(page - 1) * 2 : page * 2]
        return 200, json.dumps({"items": chunk, "page": page})
    if method == "GET" and parts.path.startswith("/v1/items/"):
        item_id = int(parts.path.rsplit("/", 1)[1])
        for item in ITEMS:
            if item["id"] == item_id:
                return 200, json.dumps(item)
        return 404, json.dumps({"error": "no such item"})
    return 400, json.dumps({"error": "bad request"})`;

const API_CLIENT = `class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(f"{status}: {message}")
        self.status = status

def get_json(url):
    status, text = fake_api("GET", url)
    data = json.loads(text)
    if status != 200:
        raise ApiError(status, data.get("error", "unknown"))
    return data`;

const LOG_SETUP = `import logging
import sys

logging.disable(logging.NOTSET)  # make sure logging is switched on
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)
log = logging.getLogger("duuka")`;

const APP_HEADER = `import argparse
import contextlib
import io
import logging
import sqlite3
import sys

logging.disable(logging.NOTSET)  # make sure logging is switched on
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="LOG %(message)s", force=True)
log = logging.getLogger("duuka")`;

const APP_STOCK = `${A.STOCK_HEAD}
${A.STOCK_SELL}
${A.STOCK_LOW}`;

const APP_REPORT = `def report(stock):
    rows = stock.con.execute("SELECT item, qty, price FROM stock ORDER BY item").fetchall()
    for item, qty, price in rows:
        print(f"{item}: {qty} x {price:,} = {qty * price:,}")
    total = sum(qty * price for _, qty, price in rows)
    print(f"Stock value: {total:,}")`;

const parserFn = (extra) => `def build_parser():
    parser = argparse.ArgumentParser(prog="duuka")
    sub = parser.add_subparsers(dest="command", required=True)
    add = sub.add_parser("add")
    add.add_argument("item")
    add.add_argument("qty", type=int)
    add.add_argument("price", type=int)
    sell = sub.add_parser("sell")
    sell.add_argument("item")
    sell.add_argument("qty", type=int)
    sub.add_parser("report")
    low = sub.add_parser("low")
    low.add_argument("--limit", type=int, default=10)
${extra}    return parser`;

const runFn = (extra) => `def run(argv, stock):
    """Run one command. Returns 0 when it worked, 1 for a shop problem, 2 for a bad command."""
    errors = io.StringIO()
    with contextlib.redirect_stderr(errors):
        try:
            args = build_parser().parse_args(argv)
        except SystemExit:
            print("Error: bad command")
            return 2
    log.info("%s", " ".join(argv))
    try:
        if args.command == "add":
            stock.add(args.item, args.qty, args.price)
            print(f"Added {args.qty} x {args.item}")
        elif args.command == "sell":
            stock.sell(args.item, args.qty)
            print(f"Sold {args.qty} x {args.item}, left {stock.qty(args.item)}")
        elif args.command == "report":
            report(stock)
${extra}        elif args.command == "low":
            names = stock.low_items(args.limit)
            print("Low: " + (", ".join(names) if names else "none"))
    except UnknownItem as e:
        print(f"Error: unknown item {e}")
        return 1
    except OutOfStock as e:
        print(f"Error: only {e} left")
        return 1
    return 0`;

const VALUE_PARSER_STUB = `    # add the "value" command here: it takes one item name
`;
const VALUE_PARSER = `    value = sub.add_parser("value")
    value.add_argument("item")
`;
const VALUE_RUN_STUB = `        # handle the "value" command here
`;
const VALUE_RUN = `        elif args.command == "value":
            row = stock.con.execute("SELECT qty, price FROM stock WHERE item = ?", (args.item,)).fetchone()
            if row is None:
                raise UnknownItem(args.item)
            print(f"{args.item}: {row[0]} x {row[1]:,} = {row[0] * row[1]:,}")
`;

const APP_BASE = `${APP_HEADER}\n\n${APP_STOCK}\n\n${APP_REPORT}\n\n${parserFn('')}\n\n${runFn('')}`;

const SCRIPT = `add sugar 50 4500
add rice 30 3000
sell sugar 5
sell rice 99
sell mango 1
low --limit 40
report
dance`;

export const level8b = [
  // ------------------------------------------------------------------ 50
  {
    id: 'py-api',
    level: LEVEL,
    minutes: 24,
    title: 'Programs that talk to programs: APIs and JSON',
    summary: 'JSON, URLs, status codes, a pretend server, error handling, paging and retries',
    blocks: [
      {
        t: 'story',
        title: 'The waiter between two kitchens',
        text: 'Mama Rose wants her shop program to check whether a customer’s Mobile Money payment arrived. The payment company is a different business with its own computers. She cannot walk into their kitchen. But she can send a request through a waiter: “Has payment 123 arrived?” and the waiter comes back with an answer: “Yes, 25,000 shillings.”\n\nThat waiter is an API. Your program sends a request to an address (a URL), and gets a response made of a status code (did it work?) and some data, almost always written as JSON. Weather apps, maps, Mobile Money, social media: all of them are APIs.',
      },
      { t: 'p', text: 'IMPORTANT, and honest: this app works offline, so it cannot make real network calls (Python’s `urllib.request` would fail here). To still teach you everything that matters, we use a PRETEND server called `fake_api`. It receives a method and a URL and gives back `(status, json_text)`, exactly the shape a real response has. On a real computer you would swap that one function for a real request, and every other line you write today stays the same.' },
      { t: 'h', text: 'JSON: the language of APIs' },
      { t: 'p', text: 'JSON is text that describes data using the same shapes as Python dictionaries, lists, numbers and text. `json.dumps` turns Python into JSON text, and `json.loads` turns JSON text back into Python. Notice how `True` and `None` become `true` and `null`.' },
      {
        t: 'code',
        text: `import json\n\norder = {"item": "sugar", "qty": 3, "paid": True, "note": None}\ntext = json.dumps(order)\nprint(text)\nback = json.loads(text)\nprint(back["qty"] + 1)`,
        output: '{"item": "sugar", "qty": 3, "paid": true, "note": null}\n4',
      },
      {
        t: 'predict',
        code: `import json\n\nprint(json.dumps({"ok": True, "n": None}))`,
        question: 'What does this print?',
        options: ['{"ok": True, "n": None}', '{"ok": true, "n": null}', "{'ok': true, 'n': null}"],
        answer: 1,
        explain: 'JSON has its own spelling: true, false and null (all lower case), and text always uses double quotes.',
      },
      { t: 'h', text: 'Anatomy of an address' },
      {
        t: 'code',
        text: `from urllib.parse import urlparse, parse_qs, urlencode\n\nurl = "https://api.duuka.ug/v1/items?page=2&limit=10"\nparts = urlparse(url)\nprint(parts.netloc)\nprint(parts.path)\nprint(parse_qs(parts.query))\nprint(urlencode({"q": "brown sugar", "page": 1}))`,
        output: "api.duuka.ug\n/v1/items\n{'page': ['2'], 'limit': ['10']}\nq=brown+sugar&page=1",
      },
      { t: 'p', text: 'The host (`api.duuka.ug`) says WHO to ask, the path (`/v1/items`) says WHAT you want, and the query (`?page=2&limit=10`) adds details. `urlencode` builds the query safely, turning spaces into `+`.' },
      { t: 'h', text: 'Status codes: did it work?' },
      {
        t: 'list',
        items: [
          '`200` OK. `201` Created.',
          '`400` Bad request: you asked wrongly.',
          '`404` Not found: no such thing.',
          '`429` Too many requests: slow down.',
          '`500`, `503` The server has a problem. Try again later.',
        ],
      },
      { t: 'p', text: 'Codes from 200 to 299 mean success, 400 to 499 mean YOUR request was wrong (do not repeat it unchanged), and 500 or more mean the SERVER failed (trying again may help). Now meet the pretend server:' },
      {
        t: 'code',
        text: `import json\nfrom urllib.parse import urlparse, parse_qs\n\n${FAKE_API}\n\nprint(fake_api("GET", "https://api.duuka.ug/v1/items/2"))\nprint(fake_api("GET", "https://api.duuka.ug/v1/items/99"))\nprint(fake_api("GET", "https://api.duuka.ug/v1/nothing"))`,
        output: '(200, \'{"id": 2, "name": "rice", "price": 3000}\')\n(404, \'{"error": "no such item"}\')\n(400, \'{"error": "bad request"}\')',
      },
      { t: 'h', text: 'A client that checks before it trusts' },
      { t: 'p', text: 'Never use the body of a response before checking the status. A 404 body is an error message, not an item. We wrap that check in one function that raises your own error (Level 6).' },
      {
        t: 'code',
        text: `import json\nfrom urllib.parse import urlparse, parse_qs\n\n${FAKE_API}\n\n${API_CLIENT}\n\nprint(get_json("https://api.duuka.ug/v1/items/2")["name"])\ntry:\n    get_json("https://api.duuka.ug/v1/items/99")\nexcept ApiError as e:\n    print("Failed ->", e)`,
        output: 'rice\nFailed -> 404: no such item',
      },
      { t: 'h', text: 'Pages: big lists arrive in pieces' },
      { t: 'p', text: 'A server will not send 100,000 items in one go. It sends a page at a time, and you keep asking for the next page until it comes back empty.' },
      {
        t: 'code',
        text: `import json\nfrom urllib.parse import urlparse, parse_qs\n\n${FAKE_API}\n\n${API_CLIENT}\n\nnames = []\npage = 1\nwhile True:\n    data = get_json(f"https://api.duuka.ug/v1/items?page={page}")\n    if not data["items"]:\n        break\n    names += [item["name"] for item in data["items"]]\n    page += 1\nprint(names)`,
        output: "['sugar', 'rice', 'tea']",
      },
      { t: 'h', text: 'Retries: servers have bad moments' },
      { t: 'p', text: 'A 503 means “I am busy, try again”. A good client tries a few times before giving up, but it NEVER retries a 4xx error, because asking the same wrong question again cannot work. To practise, we build a server that fails on purpose (a closure from Level 6 remembers how many calls it has had):' },
      {
        t: 'code',
        text: `import json\n\nclass ApiError(Exception):\n    pass\n\ndef make_flaky(fail_times):\n    state = {"calls": 0}\n    def call():\n        state["calls"] += 1\n        if state["calls"] <= fail_times:\n            return 503, '{"error": "busy"}'\n        return 200, '{"ok": true}'\n    return call\n\ndef with_retries(call, attempts=3):\n    for attempt in range(1, attempts + 1):\n        status, text = call()\n        if status == 200:\n            return json.loads(text), attempt\n        print("attempt", attempt, "failed with", status)\n    raise ApiError("gave up")\n\ndata, used = with_retries(make_flaky(2))\nprint(data, used)`,
        output: "attempt 1 failed with 503\nattempt 2 failed with 503\n{'ok': True} 3",
      },
      { t: 'tip', text: 'Never write secret keys or passwords inside your program file. Real API keys go in settings or environment variables (Lesson 48), because code gets shared and keys get stolen.' },
      {
        t: 'fill',
        prompt: 'Turn the JSON text into a Python dictionary.',
        template: `import json\n\ntext = '{"qty": 3}'\ndata = json.___(text)\nprint(data["qty"])`,
        blanks: [{ options: ['loads', 'load', 'parse'], answer: 'loads' }],
        output: '3',
      },
      {
        t: 'bug',
        code: `import json\n\ndata = json.loads("{'qty': 3}")\nprint(data["qty"])`,
        question: 'This crashes with a JSONDecodeError. Why?',
        options: ['JSON requires double quotes around text, single quotes are not valid', 'qty must be written with a capital', 'loads only works on lists'],
        answer: 0,
        explain: 'JSON is stricter than Python. Keys and text must use double quotes. Single quotes make the text invalid JSON.',
        fixed: `import json\n\ndata = json.loads('{"qty": 3}')\nprint(data["qty"])`,
      },
      {
        t: 'quiz',
        question: 'A request gets the status 404. What should a careful client do?',
        options: ['Report the problem. Asking again unchanged cannot help', 'Retry it five times', 'Treat the body as normal data'],
        answer: 0,
        explain: '4xx means the request itself was wrong or the thing does not exist. Retrying is for 5xx errors, where the server may recover.',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import json\nfrom urllib.parse import urlparse, parse_qs\n\n${FAKE_API}\n\nstatus, text = fake_api("GET", "https://api.duuka.ug/v1/items/99")\ndata = json.loads(text)\nprint(data["name"])`,
            why: 'It used the body without checking the status. A 404 body only holds an error message, so there is no "name". Check `status == 200` first.',
            right: `import json\nfrom urllib.parse import urlparse, parse_qs\n\n${FAKE_API}\n\nstatus, text = fake_api("GET", "https://api.duuka.ug/v1/items/99")\ndata = json.loads(text)\nif status == 200:\n    print(data["name"])\nelse:\n    print("Problem:", data["error"])`,
          },
          {
            wrong: `import json\n\nprint(json.dumps({"tags": {"fresh", "local"}}))`,
            why: 'JSON has no sets. Convert to a list first, and sort it if you want the same order every time.',
            right: `import json\n\nprint(json.dumps({"tags": sorted({"fresh", "local"})}))`,
          },
          {
            wrong: `for attempt in range(1, 4):\n    status = 404\n    print("attempt", attempt, "got", status)\n    if status == 200:\n        break`,
            why: 'A 404 will answer 404 every time. Retrying it three times just wastes time. Only retry when the status is 500 or more.',
            right: `for attempt in range(1, 4):\n    status = 404\n    print("attempt", attempt, "got", status)\n    if status < 500:\n        break`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['An API is a waiter between programs: a request goes out, a status code and (usually) JSON come back.', '`json.dumps` makes JSON text, `json.loads` reads it. JSON spells `true`, `false`, `null` and needs double quotes.', 'A URL has a host (who), a path (what) and a query (details). `urllib.parse` takes them apart and builds them.', '2xx is success, 4xx means your request was wrong, 5xx means the server failed.', 'Check the status BEFORE using the body, page through big lists, and retry only on 5xx errors.', 'This app has no network, so a pretend server stands in. On a real computer you replace it with a real request.'],
        memory: 'Request out, status and JSON back. Check the status, then trust the body.',
      },
    ],
    exercises: [
      {
        id: 'py49-json',
        title: 'Add up the order',
        prompt: 'Read one line of JSON describing an order, like `{"items": [{"name": "sugar", "qty": 2, "price": 4500}]}`. Print `Total:` and the sum of quantity times price for every item, with commas.',
        starter: 'import json\n\norder = json.loads(input())\n# add up qty * price for every item\nprint("Total: 0")\n',
        sampleInput: '{"items": [{"name": "sugar", "qty": 2, "price": 4500}, {"name": "rice", "qty": 1, "price": 3000}]}',
        usesInput: true,
        tests: [
          { input: '{"items": [{"name": "sugar", "qty": 2, "price": 4500}, {"name": "rice", "qty": 1, "price": 3000}]}', expected: 'Total: 12,000' },
          { input: '{"items": [{"name": "tea", "qty": 10, "price": 500}]}', expected: 'Total: 5,000' },
          { input: '{"items": []}', expected: 'Total: 0', hidden: true },
          { input: '{"items": [{"name": "oil", "qty": 3, "price": 12500}, {"name": "salt", "qty": 4, "price": 800}]}', expected: 'Total: 40,700', hidden: true },
        ],
        hints: [
          '`json.loads` already gave you a dictionary. `order["items"]` is a list of dictionaries.',
          'Loop over `order["items"]` and add `item["qty"] * item["price"]` to a total.',
          'Print with `print(f"Total: {total:,}")`.',
        ],
      },
      {
        id: 'py49-client',
        title: 'Look up items safely',
        prompt: 'The pretend server and `ApiError` are ready. Write `get_json(url)`: call `fake_api("GET", url)`, turn the text into a dictionary with `json.loads`, and if the status is not 200 raise `ApiError(status, message)` using the `"error"` text from the body. Otherwise return the dictionary. The program reads item numbers and prints each name, or `Error 404`.',
        starter: `import json\nfrom urllib.parse import urlparse, parse_qs\n\n${FAKE_API}\n\nclass ApiError(Exception):\n    def __init__(self, status, message):\n        super().__init__(f"{status}: {message}")\n        self.status = status\n\ndef get_json(url):\n    # call fake_api, check the status, return the data or raise ApiError\n    pass\n\nn = int(input())\nfor i in range(n):\n    item_id = input()\n    try:\n        print(get_json(f"https://api.duuka.ug/v1/items/{item_id}")["name"])\n    except ApiError as e:\n        print("Error", e.status)\n`,
        sampleInput: '3\n1\n99\n3',
        usesInput: true,
        tests: [
          { input: '3\n1\n99\n3', expected: 'sugar\nError 404\ntea' },
          { input: '2\n2\n2', expected: 'rice\nrice' },
          { input: '1\n7', expected: 'Error 404', hidden: true },
        ],
        hints: [
          'Start with `status, text = fake_api("GET", url)` and `data = json.loads(text)`.',
          'If `status != 200`, `raise ApiError(status, data["error"])`.',
          'Otherwise `return data`. The lesson’s `get_json` is almost exactly this.',
        ],
      },
      {
        id: 'py49-retry',
        title: 'Retry only when it can help',
        prompt: 'Write `with_retries(call, attempts=3)`. `call()` returns `(status, text)`. Try up to `attempts` times. On status 200 return `(json.loads(text), attempt_number)`. If the status is below 500 (a 4xx), raise `ApiError(status)` at once, no retry. If every attempt got a 5xx, raise `ApiError(last_status)`.',
        starter: 'import json\n\nclass ApiError(Exception):\n    def __init__(self, status):\n        super().__init__(status)\n        self.status = status\n\ndef with_retries(call, attempts=3):\n    # try call() up to `attempts` times; see the task for the rules\n    pass\n\nstatuses = iter(input().split())\n\ndef call():\n    status = int(next(statuses))\n    return status, \'{"ok": true}\' if status == 200 else \'{"error": "x"}\'\n\ntry:\n    data, used = with_retries(call)\n    print("OK, attempts used:", used)\nexcept ApiError as e:\n    print("Failed:", e.status)\n',
        sampleInput: '503 503 200',
        usesInput: true,
        tests: [
          { input: '503 503 200', expected: 'OK, attempts used: 3' },
          { input: '503 503 503', expected: 'Failed: 503' },
          { input: '404', expected: 'Failed: 404' },
          { input: '200', expected: 'OK, attempts used: 1', hidden: true },
          { input: '500 429', expected: 'Failed: 429', hidden: true },
        ],
        hints: [
          'Loop `for attempt in range(1, attempts + 1):` and call `call()` each time.',
          'If the status is 200, `return json.loads(text), attempt`. If it is below 500, `raise ApiError(status)` straight away.',
          'After the loop ends (every try was a 5xx) `raise ApiError(status)` with the last status you saw.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 51
  {
    id: 'py-logging',
    level: LEVEL,
    minutes: 22,
    title: 'Finding bugs: logging, debugging and measuring',
    summary: 'The logging module, assert, reading errors, counting calls and measuring time',
    blocks: [
      {
        t: 'story',
        title: 'The mystery on Tuesday',
        text: 'Last Tuesday the till showed a total that was 8,000 shillings too high. Nobody knows why. The program did not crash and it left no trace of what it did. Mama Rose’s shop keeps a paper receipt roll for exactly this reason: when something goes wrong, you read the roll.\n\nA program needs a roll too. It is called a LOG. A good log tells you what happened, in what order, and how serious it was, even when you were not watching. This lesson also gives you the habits professionals use to hunt bugs, and how to measure whether code is fast without guessing.',
      },
      { t: 'h', text: 'Why not just print?' },
      { t: 'p', text: '`print` is fine while learning. But printed messages cannot be switched off, have no importance level, cannot be sent to a file by changing one line, and are easy to leave behind by accident. The `logging` module fixes all of that. Every message has a level, from least to most serious: DEBUG, INFO, WARNING, ERROR, CRITICAL. You choose the lowest level you want to see.' },
      {
        t: 'code',
        text: `${LOG_SETUP}\n\nlog.debug("this is hidden")\nlog.info("sale recorded: %s", 4500)\nlog.warning("sugar is running low")\nlog.error("payment failed")`,
        output: 'INFO: sale recorded: 4500\nWARNING: sugar is running low\nERROR: payment failed',
      },
      { t: 'p', text: 'The DEBUG line did not appear because we set the level to INFO. Write values into the message with `%s` and pass them as extra arguments (`log.info("sale: %s", amount)`), not with an f-string. Python then only builds the text when the message is really going to be shown. In a real program the same setup can send the log to a file, and a format with `%(asctime)s` adds the time of every message.' },
      {
        t: 'predict',
        code: `import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.WARNING, format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("duuka")\n\nlog.info("sale")\nlog.warning("low")\nlog.error("down")`,
        question: 'What is printed?',
        options: ['INFO: sale\nWARNING: low\nERROR: down', 'WARNING: low\nERROR: down', 'ERROR: down'],
        answer: 1,
        explain: 'The level is WARNING, so only WARNING and anything more serious (ERROR, CRITICAL) is shown. INFO is below the line.',
      },
      {
        t: 'list',
        items: [
          '`DEBUG` details for you, while hunting a bug.',
          '`INFO` normal events: a sale was recorded.',
          '`WARNING` something odd, but the program carries on: stock is low.',
          '`ERROR` something failed: a payment was refused.',
          '`CRITICAL` the program may not be able to continue.',
        ],
      },
      {
        t: 'quiz',
        question: 'Which level suits “the disk is 90 percent full, but everything still works”?',
        options: ['WARNING', 'DEBUG', 'CRITICAL'],
        answer: 0,
        explain: 'Something needs attention soon, but nothing has failed yet. That is a warning.',
      },
      { t: 'tip', text: 'Inside an `except` block, `log.exception("what failed")` records the message AND the full error trace. That single line saves hours later.' },
      { t: 'h', text: 'A bug-hunter’s habits' },
      {
        t: 'list',
        items: [
          'READ the error. The LAST line names the error and says why. The line above it shows which of your lines caused it.',
          'Make the bug small. Copy the failing part into a tiny test with fixed values.',
          'Check what you believe with `assert`. If a belief is wrong, the program stops right there, at the true source.',
          'Change one thing at a time, then test again.',
          'Explain the code out loud to someone (or a rubber duck). You will often hear the bug yourself.',
        ],
      },
      {
        t: 'code',
        text: `def average(marks):\n    assert len(marks) > 0, "marks must not be empty"\n    return sum(marks) / len(marks)\n\ntry:\n    average([])\nexcept AssertionError as e:\n    print("caught:", e)\nprint(average([60, 70]))`,
        output: 'caught: marks must not be empty\n65.0',
      },
      { t: 'p', text: 'An `assert` states something that MUST be true. Use it for mistakes in your own code. For wrong input from users, raise a proper error (Level 6), because assertions can be switched off.' },
      {
        t: 'fill',
        prompt: 'Record a serious failure in the log.',
        template: `${LOG_SETUP}\n\nlog.___("payment failed")`,
        blanks: [{ options: ['error', 'info', 'debug'], answer: 'error' }],
        output: 'ERROR: payment failed',
      },
      {
        t: 'bug',
        code: `prices = [50, 40]\ntotal = sum(prices)\nassert total == 100, f"total was {total}"\nprint("Total is fine")`,
        question: 'The assert stops the program. What is it telling you?',
        options: ['The total is 90, not the 100 the program expected, so the data or the sum is wrong', 'assert cannot be used with sum', 'The message needs single quotes'],
        answer: 0,
        explain: 'The assert caught a belief that was false. The message even tells you the real value. Now you know where to look: the prices list.',
        fixed: `prices = [50, 50]\ntotal = sum(prices)\nassert total == 100, f"total was {total}"\nprint("Total is fine")`,
      },
      { t: 'h', text: 'Measuring: how many times did it run?' },
      { t: 'p', text: 'Programmers do not guess which part is slow. They measure first. A reliable way is to COUNT how many times a function is called. A decorator (Level 6) can keep that count on the function itself:' },
      {
        t: 'code',
        text: `from functools import lru_cache\n\ndef counted(func):\n    def wrapper(*args):\n        wrapper.calls += 1\n        return func(*args)\n    wrapper.calls = 0\n    return wrapper\n\n@counted\ndef slow_fib(n):\n    return n if n < 2 else slow_fib(n - 1) + slow_fib(n - 2)\n\n@lru_cache(maxsize=None)\ndef fast_fib(n):\n    return n if n < 2 else fast_fib(n - 1) + fast_fib(n - 2)\n\nprint(slow_fib(10), slow_fib.calls)\nprint(fast_fib(10), fast_fib.cache_info().misses)`,
        output: '55 177\n55 11',
      },
      { t: 'p', text: 'The same answer needed 177 calls one way and only 11 the other. You can also measure time with `time.perf_counter()`. Time depends on the phone, so numbers differ on every run. That is fine for comparing two versions on the SAME phone. Try it below (your numbers will be different):' },
      {
        t: 'try',
        code: `import time\n\ndef total_of(n):\n    return sum(i * i for i in range(n))\n\nstart = time.perf_counter()\nanswer = total_of(200000)\nelapsed = time.perf_counter() - start\nprint("answer:", answer)\nprint(f"took {elapsed:.4f} seconds")\n`,
      },
      { t: 'tip', text: 'Python also ships `timeit` (repeats a small test many times) and `cProfile` (shows which functions take the most time) for bigger investigations. The rule stays the same: measure first, then change one thing, then measure again.' },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import logging\n\nlogging.getLogger("duuka").info("hello")`,
            why: 'Nothing appears, because logging was never set up and the default level is WARNING. Call `logging.basicConfig(level=logging.INFO)` once, at the start.',
            right: `import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)\nlogging.getLogger("duuka").info("hello")`,
            logic: true,
          },
          {
            wrong: `import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("duuka")\n\ntry:\n    int("abc")\nexcept Exception:\n    pass\nprint("carrying on")`,
            why: 'The error is swallowed in silence: no message, no trace. Next week nobody will know why a value is missing. At least log it.',
            right: `import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("duuka")\n\ntry:\n    int("abc")\nexcept ValueError as e:\n    log.error("could not read the number: %s", e)\nprint("carrying on")`,
            logic: true,
          },
          {
            wrong: `import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("duuka")\n\namount = 4500\nlog.info(f"sale recorded: {amount}")`,
            why: 'It works, but the f-string builds the text even when the message is thrown away. Pass the value separately with %s.',
            right: `import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("duuka")\n\namount = 4500\nlog.info("sale recorded: %s", amount)`,
            logic: true,
          },
        ],
      },
      {
        t: 'recap',
        items: ['A log is a receipt roll for your program. Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL.', 'Set it up once with `logging.basicConfig`, then write `log.info("text %s", value)`.', 'Never swallow an error silently. Log it with `log.error` or `log.exception`.', 'Debug in small steps: read the error, shrink the problem, check beliefs with `assert`, change one thing at a time.', 'Measure before you optimise: count calls, or time with `time.perf_counter()` on the same phone.'],
        memory: 'Log it, assert it, measure it. Never guess.',
      },
    ],
    exercises: [
      {
        id: 'py50-log',
        title: 'Write the receipt roll',
        prompt: 'Finish `process(amount)`. For an amount of 0 or less, write an ERROR log `invalid amount: N` and stop. Otherwise write an INFO log `sale recorded: N`, and if the amount is also more than 1,000,000, a WARNING log `large sale: N` after it. Use `log.info("... %s", amount)` style.',
        starter: `${LOG_SETUP}\n\ndef process(amount):\n    # write the right log messages here\n    pass\n\nn = int(input())\nfor i in range(n):\n    process(int(input()))\n`,
        sampleInput: '3\n4500\n2000000\n-5',
        usesInput: true,
        tests: [
          { input: '3\n4500\n2000000\n-5', expected: 'INFO: sale recorded: 4500\nINFO: sale recorded: 2000000\nWARNING: large sale: 2000000\nERROR: invalid amount: -5' },
          { input: '1\n1000000', expected: 'INFO: sale recorded: 1000000' },
          { input: '2\n0\n12', expected: 'ERROR: invalid amount: 0\nINFO: sale recorded: 12', hidden: true },
        ],
        hints: [
          'Check the bad case first. If `amount <= 0`, log the error and `return`.',
          '`log.error("invalid amount: %s", amount)` for the bad case and `log.info("sale recorded: %s", amount)` for a good one.',
          'After the INFO line, `if amount > 1000000:` and `log.warning("large sale: %s", amount)`.',
        ],
      },
      {
        id: 'py50-counted',
        title: 'Count the calls',
        prompt: 'Write the `counted` decorator. It wraps a function and keeps a counter in `wrapper.calls` (starting at 0) that goes up by 1 every time the function is called. The program calls `square` n times and prints how many calls were counted.',
        starter: 'def counted(func):\n    # return a wrapper that adds 1 to wrapper.calls every time it runs\n    return func\n\n@counted\ndef square(x):\n    return x * x\n\nn = int(input())\nfor i in range(n):\n    square(i)\nprint(square.calls)\n',
        sampleInput: '3',
        usesInput: true,
        tests: [
          { input: '3', expected: '3' },
          { input: '5', expected: '5' },
          { input: '0', expected: '0', hidden: true },
        ],
        hints: [
          'A function is an object, so it can have attributes: `wrapper.calls = 0` right after you define the wrapper.',
          'Inside the wrapper add 1 with `wrapper.calls += 1`, then `return func(*args, **kwargs)`.',
          'Finish with `return wrapper`. The lesson’s `counted` decorator is exactly this.',
        ],
      },
      {
        id: 'py50-cheapest',
        title: 'Hunt the bug',
        prompt: 'This program should print the name of the CHEAPEST item (if two cost the same, the first one). It prints the wrong one. Find the bug and fix it. Hint: read the function slowly and ask what each line really does.',
        starter: 'def cheapest(items):\n    """items is a list of (name, price). Return the name of the cheapest item."""\n    best = items[0]\n    for name, price in items:\n        if price > best[1]:\n            best = (name, price)\n    return best[0]\n\nn = int(input())\nitems = []\nfor i in range(n):\n    name, price = input().split()\n    items.append((name, int(price)))\nprint(cheapest(items))\n',
        sampleInput: '3\nsugar 4500\nrice 3000\ntea 500',
        usesInput: true,
        tests: [
          { input: '3\nsugar 4500\nrice 3000\ntea 500', expected: 'tea' },
          { input: '2\nsalt 800\noil 12000', expected: 'salt' },
          { input: '3\na 5\nb 5\nc 9', expected: 'a', hidden: true },
          { input: '1\nbeans 1200', expected: 'beans', hidden: true },
        ],
        hints: [
          'Try the first example by hand. At each step, which item does `best` point to?',
          'The comparison replaces `best` whenever a price is bigger. Is that what “cheapest” needs?',
          'Change `>` to `<`. A strict `<` also keeps the FIRST item when two prices are equal.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 52
  {
    id: 'py-project-duuka',
    level: LEVEL,
    minutes: 45,
    title: 'Project: Duuka Manager',
    summary: 'A real command-line shop manager: SQLite stock, subcommands, logging and tests',
    blocks: [
      {
        t: 'story',
        title: 'A program you could really ship',
        text: 'It is time to put Level 8 together. Duuka Manager is a command-line shop tool. You type `add sugar 50 4500` to receive stock, `sell sugar 5` to sell, `low --limit 40` to see what is running out, and `report` for the value of everything on the shelves.\n\nIt keeps its data in SQLite, understands commands with argparse, writes an audit trail with logging, reports problems with your own errors, and has tests so you can change it without fear. This is the shape of real software, in about 120 lines.',
      },
      { t: 'h', text: 'Step 1: the stock, and a report' },
      {
        t: 'project',
        title: 'The Stock class and the report',
        text: 'The database work is hidden inside the `Stock` class from Lesson 49. A separate `report` function prints a row per item and the total value of the shelves.',
        code: `import sqlite3\n\n${APP_STOCK}\n\n${APP_REPORT}\n\nstock = Stock()\nstock.add("sugar", 50, 4500)\nstock.add("rice", 30, 3000)\nstock.sell("sugar", 5)\nreport(stock)\n`,
        output: 'rice: 30 x 3,000 = 90,000\nsugar: 45 x 4,500 = 202,500\nStock value: 292,500',
      },
      { t: 'h', text: 'Step 2: the command-line interface' },
      {
        t: 'project',
        title: 'Commands, errors and the audit trail',
        text: '`build_parser` describes the commands. `run(argv, stock)` does one command and returns a code: 0 for success, 1 for a shop problem (unknown item, not enough stock), 2 for a command that makes no sense. Each valid command is logged first. We feed it a little script of commands, one per line, including a bad one at the end.',
        code: `${APP_HEADER}\n\n${APP_STOCK}\n\n${APP_REPORT}\n\n${parserFn('')}\n\n${runFn('')}\n\nSCRIPT = """${SCRIPT}"""\n\nstock = Stock()\nfor line in SCRIPT.splitlines():\n    run(line.split(), stock)\n`,
        output: 'LOG add sugar 50 4500\nAdded 50 x sugar\nLOG add rice 30 3000\nAdded 30 x rice\nLOG sell sugar 5\nSold 5 x sugar, left 45\nLOG sell rice 99\nError: only 30 left\nLOG sell mango 1\nError: unknown item mango\nLOG low --limit 40\nLow: rice\nLOG report\nrice: 30 x 3,000 = 90,000\nsugar: 45 x 4,500 = 202,500\nStock value: 292,500\nError: bad command',
      },
      { t: 'p', text: 'On a real computer the bottom of the file would be `sys.exit(run(sys.argv[1:], Stock()))`, and you would type the commands in a terminal. The rest is identical.' },
      { t: 'h', text: 'Step 3: tests that protect you' },
      {
        t: 'project',
        title: 'Tests for the manager',
        text: 'A tiny helper runs a command and captures what it prints. We silence the log during tests with `logging.disable`. Every rule above becomes an assert. If someone breaks the program next month, the tests say so at once.',
        code: `${APP_HEADER}\n\n${APP_STOCK}\n\n${APP_REPORT}\n\n${parserFn('')}\n\n${runFn('')}\n\nlogging.disable(logging.CRITICAL)\n\ndef run_capture(argv, stock):\n    out = io.StringIO()\n    with contextlib.redirect_stdout(out):\n        code = run(argv, stock)\n    return code, out.getvalue().strip()\n\nstock = Stock()\nassert run_capture(["add", "tea", "10", "500"], stock) == (0, "Added 10 x tea")\nassert run_capture(["sell", "tea", "4"], stock) == (0, "Sold 4 x tea, left 6")\ncode, text = run_capture(["sell", "tea", "99"], stock)\nassert code == 1 and text == "Error: only 6 left"\ncode, text = run_capture(["sell", "mango", "1"], stock)\nassert code == 1 and "unknown item" in text\nassert run_capture(["add", "tea", "x", "5"], stock)[0] == 2\nassert stock.qty("tea") == 6\nprint("All tests passed")\nlogging.disable(logging.NOTSET)\n`,
        output: 'All tests passed',
      },
      {
        t: 'recap',
        items: ['Modules and a clear layout keep each job in its own room.', 'argparse subcommands turn typed words into checked values.', 'SQLite with `?` placeholders and `with con:` keeps data safe and consistent.', 'Your own errors (`UnknownItem`, `OutOfStock`) become friendly messages and exit codes.', 'Logging leaves an audit trail, and tests protect everything you built.', 'You have built the skeleton of real software. Level 9 shows how it is packaged, how it can do many things at once, and where to go next.'],
        memory: 'Parse it, store it safely, log it, test it.',
      },
    ],
    exercises: [
      {
        id: 'py51-manager',
        title: 'Add the value command',
        prompt: 'Add one more command to Duuka Manager: `value ITEM` prints one line for that item in the same format as the report, like `sugar: 45 x 4,500 = 202,500`. An unknown item prints `Error: unknown item NAME` (raise `UnknownItem(item)` and let the existing code handle it). You need to do two things: add a `value` subcommand to `build_parser` (it takes one `item`), and handle it in `run`. A `value` command with no item is a bad command (that already works once the parser knows `value`). The program reads `n` and then `n` commands.',
        starter: `${APP_HEADER}\nlogging.disable(logging.CRITICAL)\n\n${APP_STOCK}\n\n${APP_REPORT}\n\n${parserFn(VALUE_PARSER_STUB)}\n\n${runFn(VALUE_RUN_STUB)}\n\nn = int(input())\nstock = Stock()\nfor i in range(n):\n    run(input().split(), stock)\n`,
        sampleInput: '4\nadd sugar 50 4500\nsell sugar 5\nvalue sugar\nvalue mango',
        usesInput: true,
        tests: [
          { input: '4\nadd sugar 50 4500\nsell sugar 5\nvalue sugar\nvalue mango', expected: 'Added 50 x sugar\nSold 5 x sugar, left 45\nsugar: 45 x 4,500 = 202,500\nError: unknown item mango' },
          { input: '2\nvalue tea\nadd tea 2 500', expected: 'Error: unknown item tea\nAdded 2 x tea' },
          { input: '2\nadd tea 2 500\nvalue', expected: 'Added 2 x tea\nError: bad command', hidden: true },
          { input: '3\nadd rice 3 3000\nvalue rice\nlow --limit 5', expected: 'Added 3 x rice\nrice: 3 x 3,000 = 9,000\nLow: rice', hidden: true },
        ],
        hints: [
          'In `build_parser`, copy the way `sell` is made: `value = sub.add_parser("value")` and `value.add_argument("item")`.',
          'In `run`, add an `elif args.command == "value":` branch before the `low` branch.',
          'Look the row up with `stock.con.execute("SELECT qty, price FROM stock WHERE item = ?", (args.item,)).fetchone()`. If it is `None`, `raise UnknownItem(args.item)`. Otherwise print `f"{args.item}: {row[0]} x {row[1]:,} = {row[0] * row[1]:,}"`.',
        ],
      },
    ],
  },
];

export const level8bSolution = { APP_HEADER, APP_STOCK, APP_REPORT, parserFn, runFn, VALUE_PARSER, VALUE_RUN, FAKE_API, LOG_SETUP };
