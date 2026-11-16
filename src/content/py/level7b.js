// Python, Level 7 (Data and algorithms), part B: CSV and data cleaning, sales analyzer project.
// Lessons 45 and 46. Exercise ids use the lesson number minus one (py44-, py45-).
// CSV text is read from a string with io.StringIO or from a list of lines, so no files are needed.

const LEVEL = 'Level 7: Data and algorithms';

const DATA = `day,item,qty,price
2026-11-02, Sugar ,3,"UGX 4,500"
2026-11-02,rice,2,"3,000"
2026-11-03,SALT,10,800
2026-11-03,tea,x,500
2026-11-04,rice,5,
2026-11-02,sugar,1,4500
2026-11-04,tea,4,500`;

const SALE = `@dataclass
class Sale:
    day: str
    item: str
    qty: int
    price: int

    @property
    def money(self) -> int:
        return self.qty * self.price

def parse_int(text: str, what: str) -> int:
    try:
        return int(text.strip())
    except ValueError:
        raise ValueError(f"bad {what}")

def parse_money(text: str) -> int:
    digits = text.replace("UGX", "").replace(",", "").strip()
    try:
        return int(digits)
    except ValueError:
        raise ValueError("bad price")`;

const CLEAN = `def clean(lines):
    sales, errors = [], []
    seen = set()
    for number, row in enumerate(csv.DictReader(lines), start=2):
        try:
            sale = Sale(
                row["day"].strip(),
                row["item"].strip().lower(),
                parse_int(row["qty"], "quantity"),
                parse_money(row["price"]),
            )
        except ValueError as e:
            errors.append(f"line {number}: {e}")
            continue
        key = (sale.day, sale.item)
        if key in seen:
            errors.append(f"line {number}: duplicate")
            continue
        seen.add(key)
        sales.append(sale)
    return sales, errors`;

const CLEAN_STUB = `def clean(lines):
    # read the rows with csv.DictReader, build Sale objects, skip bad rows and duplicates
    # return (sales, errors); an error looks like "line 5: bad quantity"
    sales, errors = [], []
    return sales, errors`;

const ANALYZE = `def analyze(sales):
    by_item = Counter()
    by_day = Counter()
    for s in sales:
        by_item[s.item] += s.money
        by_day[s.day] += s.money
    return by_item, by_day`;

const REPORT = `def report(sales, errors):
    if sales:
        by_item, by_day = analyze(sales)
        print("Revenue by item:")
        for item, money in by_item.most_common():
            print(f"{item}: {money:,}")
        print(f"Total: {sum(by_item.values()):,}")
        best_day, best = by_day.most_common(1)[0]
        print(f"Best day: {best_day} ({best:,})")
    else:
        print("No valid sales")
    print(f"Skipped rows: {len(errors)}")
    for e in errors:
        print(f"  {e}")`;

export const level7b = [
  // ------------------------------------------------------------------ 45
  {
    id: 'py-csv',
    level: LEVEL,
    minutes: 22,
    title: 'Messy spreadsheets: CSV and data cleaning',
    summary: 'The csv module, DictReader, cleaning text into numbers, removing duplicates',
    blocks: [
      {
        t: 'story',
        title: 'Three shops, three messy files',
        text: 'Mama Rose now has three shops. Every Friday each shop manager sends her a sales file exported from Excel. Manager one writes “UGX 4,500”. Manager two leaves the price blank when he forgets. Manager three types ` Sugar ` with spaces around it, and sometimes sends the same row twice.\n\nReal data is always messy. A programmer who can read a spreadsheet file AND clean it is worth a lot, because everything else (reports, charts, apps) depends on clean data first.',
      },
      { t: 'p', text: 'A CSV file (“comma separated values”) is simply text where each line is a row and commas separate the columns. Every spreadsheet program can export one. Python reads it with the `csv` module. To keep things simple we read from a text string using `io.StringIO`, which pretends to be a file.' },
      {
        t: 'code',
        text: `import csv\nimport io\n\nDATA = """item,qty,price\nsugar,3,4500\nrice,2,3000\n"""\n\nfor row in csv.reader(io.StringIO(DATA)):\n    print(row)`,
        output: "['item', 'qty', 'price']\n['sugar', '3', '4500']\n['rice', '2', '3000']",
      },
      { t: 'p', text: '`DictReader` is nicer: it uses the first row as column names, and gives every row as a dictionary.' },
      {
        t: 'code',
        text: `import csv\nimport io\n\nDATA = """item,qty,price\nsugar,3,4500\nrice,2,3000\n"""\n\nrows = list(csv.DictReader(io.StringIO(DATA)))\nprint(rows[0]["item"], rows[0]["price"])\nprint(type(rows[0]["price"]).__name__)`,
        output: 'sugar 4500\nstr',
      },
      { t: 'tip', text: 'Everything read from a CSV is TEXT, even the numbers. You must convert with `int()` yourself. This is the source of many beginner bugs.' },
      {
        t: 'predict',
        code: `import csv\nimport io\n\nrows = list(csv.DictReader(io.StringIO("qty\\n3\\n4")))\nprint(rows[0]["qty"] + rows[1]["qty"])`,
        question: 'What does this print?',
        options: ['7', '34', 'an error'],
        answer: 1,
        explain: 'The values are text, and adding text joins it together: "3" + "4" is "34". Convert with int() first to get 7.',
      },
      { t: 'h', text: 'Why not just split on commas?' },
      { t: 'p', text: 'Because a value can contain a comma, if it is wrapped in quotes. `split` does not understand that; the `csv` module does.' },
      {
        t: 'code',
        text: `import csv\n\nline = '"Mama Rose, Kampala",5'\nprint(line.split(","))\nprint(next(csv.reader([line])))`,
        output: "['\"Mama Rose', ' Kampala\"', '5']\n['Mama Rose, Kampala', '5']",
      },
      { t: 'h', text: 'Cleaning: turn messy text into numbers' },
      {
        t: 'code',
        text: `def clean_money(text):\n    digits = text.replace("UGX", "").replace(",", "").strip()\n    return int(digits) if digits else 0\n\nprint(clean_money(" UGX 4,500 "))\nprint(clean_money("3000"))\nprint(clean_money(""))`,
        output: '4500\n3000\n0',
      },
      { t: 'p', text: 'Four tools do most of the cleaning: `strip()` removes spaces at the edges, `lower()` or `title()` makes names consistent, `replace()` removes junk such as commas and “UGX”, and `int()` finally makes a number.' },
      {
        t: 'fill',
        prompt: 'Remove the thousands comma so that int() can read the price.',
        template: `text = "4,500"\nprint(int(text.replace(",", ___)))`,
        blanks: [{ options: ['""', '" "', 'None'], answer: '""' }],
        output: '4500',
      },
      {
        t: 'bug',
        code: `price = "4,500"\nprint(int(price) + 500)`,
        question: 'This crashes with a ValueError. Why?',
        options: ['int() cannot read a comma inside the text', 'You cannot add 500 to a number', 'price must be a list'],
        answer: 0,
        explain: 'int() only accepts digits (and a minus sign). Take the comma out first with replace.',
        fixed: `price = "4,500"\nprint(int(price.replace(",", "")) + 500)`,
      },
      { t: 'h', text: 'Do not crash on one bad row: collect the problems' },
      { t: 'p', text: 'When a file has 10,000 rows, one bad row must not stop everything. Keep the good rows, and keep a list of the bad ones so someone can fix them.' },
      {
        t: 'try',
        code: `import csv\nimport io\n\nDATA = """item,qty\nsugar,3\nrice,two\ntea,5\n"""\n\ngood, bad = [], []\nfor row in csv.DictReader(io.StringIO(DATA)):\n    try:\n        row["qty"] = int(row["qty"])\n        good.append(row)\n    except ValueError:\n        bad.append(row["item"])\n\nprint(len(good), "good rows")\nprint("bad rows:", bad)\n`,
        output: "2 good rows\nbad rows: ['rice']",
      },
      { t: 'h', text: 'Duplicates: keep the first, remember what you saw' },
      {
        t: 'code',
        text: `rows = [("2026-11-02", "sugar"), ("2026-11-02", "rice"), ("2026-11-02", "sugar")]\n\nseen = set()\nkept = []\nfor row in rows:\n    if row in seen:\n        continue\n    seen.add(row)\n    kept.append(row)\n\nprint(len(kept))\nprint(kept)`,
        output: "2\n[('2026-11-02', 'sugar'), ('2026-11-02', 'rice')]",
      },
      { t: 'p', text: 'A set makes each check O(1) (you learned this in the Big-O lesson). Finally, writing a CSV is just as easy:' },
      {
        t: 'code',
        text: `import csv\nimport io\n\nout = io.StringIO()\nwriter = csv.writer(out, lineterminator="\\n")\nwriter.writerow(["item", "total"])\nwriter.writerow(["sugar", 13500])\nprint(out.getvalue().strip())`,
        output: 'item,total\nsugar,13500',
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: `import csv\nimport io\n\nrows = list(csv.DictReader(io.StringIO("qty\\n3\\n4")))\ntotal = rows[0]["qty"] + rows[1]["qty"]\nprint(total)`,
            why: 'CSV values are text, so “+” joins them into 34 instead of adding. Convert each one with int() before adding.',
            right: `import csv\nimport io\n\nrows = list(csv.DictReader(io.StringIO("qty\\n3\\n4")))\ntotal = int(rows[0]["qty"]) + int(rows[1]["qty"])\nprint(total)`,
            logic: true,
          },
          {
            wrong: `line = '"Mama Rose, Kampala",5'\nname, qty = line.split(",")\nprint(name)`,
            why: 'split cuts at the comma inside the quotes too, giving three pieces, so unpacking into two names fails. Let the csv module read the line.',
            right: `import csv\n\nline = '"Mama Rose, Kampala",5'\nname, qty = next(csv.reader([line]))\nprint(name)`,
          },
          {
            wrong: `import csv\nimport io\n\nfor row in csv.DictReader(io.StringIO("item, qty\\nsugar, 3")):\n    print(row["qty"])`,
            why: 'The header is `item, qty` with a space, so the column is really named “ qty”. Tell the reader to ignore spaces after commas with skipinitialspace=True.',
            right: `import csv\nimport io\n\nfor row in csv.DictReader(io.StringIO("item, qty\\nsugar, 3"), skipinitialspace=True):\n    print(row["qty"])`,
          },
        ],
      },
      {
        t: 'recap',
        items: ['A CSV is text: one row per line, columns separated by commas. Use the `csv` module, not `split`.', '`DictReader` gives every row as a dictionary keyed by the header names.', 'Everything from a CSV is text. Clean with `strip`, `lower`, `replace`, then convert with `int`.', 'Collect bad rows in a list instead of crashing.', 'Remove duplicates by remembering what you have seen in a set.'],
        memory: 'Read it, clean it, skip the bad rows, drop the duplicates.',
      },
    ],
    exercises: [
      {
        id: 'py44-total',
        title: 'Total revenue from a CSV',
        prompt: 'Read a number `n`, then `n` lines of CSV (the first line is the header `item,qty,price`). Print the total revenue (quantity times price, added up for every row) with commas, like `Revenue: 19,500`.',
        starter: 'import csv\n\nn = int(input())\nlines = [input() for i in range(n)]\n# read the rows with csv.DictReader and add up qty * price\nprint("Revenue: 0")\n',
        sampleInput: '3\nitem,qty,price\nsugar,3,4500\nrice,2,3000',
        usesInput: true,
        tests: [
          { input: '3\nitem,qty,price\nsugar,3,4500\nrice,2,3000', expected: 'Revenue: 19,500' },
          { input: '2\nitem,qty,price\ntea,4,500', expected: 'Revenue: 2,000' },
          { input: '4\nitem,qty,price\nsalt,10,800\noil,1,12000\ntea,2,500', expected: 'Revenue: 21,000', hidden: true },
        ],
        hints: [
          '`csv.DictReader(lines)` accepts a list of lines. Loop over it to get one dictionary per row.',
          'The values are text. Use `int(row["qty"]) * int(row["price"])` and add it to a running total.',
          'Print the answer with `f"Revenue: {total:,}"` to get the commas.',
        ],
      },
      {
        id: 'py44-clean',
        title: 'Clean the price list',
        prompt: 'Read `n`, then `n` CSV lines of `name,price` (no header). Names may have spaces around them, prices may be like `UGX 4,500`, or blank. For each line print the name in Title Case, a colon, and the price as a number with commas. A blank price becomes 0.\n\nExample: `" sugar ","UGX 4,500"` prints `Sugar: 4,500`.',
        starter: 'import csv\n\nn = int(input())\nlines = [input() for i in range(n)]\nfor name, price in csv.reader(lines):\n    # clean the name and the price, then print them\n    print(name, price)\n',
        sampleInput: '3\n" sugar ","UGX 4,500"\nrice,"UGX 3,000"\ntea,',
        usesInput: true,
        tests: [
          { input: '3\n" sugar ","UGX 4,500"\nrice,"UGX 3,000"\ntea,', expected: 'Sugar: 4,500\nRice: 3,000\nTea: 0' },
          { input: '2\n  beans  ,1200\nsalt,800', expected: 'Beans: 1,200\nSalt: 800' },
          { input: '1\n" matooke ","1,250"', expected: 'Matooke: 1,250', hidden: true },
        ],
        hints: [
          'Clean the name with `name.strip().title()`.',
          'For the price: remove `UGX` and the commas, then `strip()`. If nothing is left, the price is 0, otherwise use `int(...)`.',
          'Print with `f"{clean_name}: {amount:,}"`. The lesson’s `clean_money` function does the price part.',
        ],
      },
      {
        id: 'py44-dedupe',
        title: 'Remove duplicate rows',
        prompt: 'Read `n`, then `n` lines of `date,item,qty`. Two lines are duplicates when they have the same date AND item. Print the lines to keep (the first of each, in the original order), then `Removed: N` with the number of lines you dropped.',
        starter: 'n = int(input())\nlines = [input() for i in range(n)]\n# keep the first line of each (date, item) pair\nfor line in lines:\n    print(line)\nprint("Removed: 0")\n',
        sampleInput: '4\n2026-11-02,sugar,3\n2026-11-02,rice,2\n2026-11-02,sugar,3\n2026-11-03,sugar,1',
        usesInput: true,
        tests: [
          { input: '4\n2026-11-02,sugar,3\n2026-11-02,rice,2\n2026-11-02,sugar,3\n2026-11-03,sugar,1', expected: '2026-11-02,sugar,3\n2026-11-02,rice,2\n2026-11-03,sugar,1\nRemoved: 1' },
          { input: '2\n2026-11-02,tea,1\n2026-11-03,tea,1', expected: '2026-11-02,tea,1\n2026-11-03,tea,1\nRemoved: 0' },
          { input: '3\n2026-11-02,tea,1\n2026-11-02,tea,9\n2026-11-02,tea,1', expected: '2026-11-02,tea,1\nRemoved: 2', hidden: true },
        ],
        hints: [
          'Split each line on commas. The first two parts (date and item) are the “key”.',
          'Keep a `seen` set of keys. If the key is already in it, count the line as removed; otherwise add the key and print the line.',
          '`date, item, qty = line.split(",")` then `key = (date, item)`. Same pattern as the duplicate example in the lesson.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 46
  {
    id: 'py-project-analyzer',
    level: LEVEL,
    minutes: 40,
    title: 'Project: the sales analyzer pipeline',
    summary: 'A reusable pipeline: read a messy CSV, clean it, analyze it, report it, and test it',
    blocks: [
      {
        t: 'story',
        title: 'One pipeline for every shop',
        text: 'Every Friday three messy files arrive. Doing the same cleaning by hand each week is slow and full of mistakes. The professional answer is a pipeline: data goes in at one end, passes through the same stations in the same order, and a report comes out at the other end. Today’s files, next month’s files, another shop’s files: same pipeline.\n\nYour stations are: CLEAN (fix and filter the rows), ANALYZE (add things up), REPORT (print it nicely). Each station is a small function that does one job, which also makes each one easy to test.',
      },
      { t: 'p', text: 'Here is Friday’s file. It has a header, extra spaces, a price written as `UGX 4,500`, a quantity that says `x`, a blank price and a repeated row:' },
      { t: 'code', text: DATA },
      { t: 'h', text: 'Station 1: clean' },
      {
        t: 'project',
        title: 'Clean the rows',
        text: 'A dataclass holds one good sale. Two small helpers turn text into numbers and raise a clear error when they cannot. `clean` reads the file, builds the sales, and collects the bad and duplicate rows in an error list with their line numbers (line 1 is the header).',
        code: `import csv\nfrom dataclasses import dataclass\n\nDATA = """${DATA}"""\n\n${SALE}\n\n${CLEAN}\n\nsales, errors = clean(DATA.splitlines())\nprint(len(sales), "good rows")\nprint(errors)\n`,
        output: "4 good rows\n['line 5: bad quantity', 'line 6: bad price', 'line 7: duplicate']",
      },
      { t: 'h', text: 'Station 2: analyze' },
      {
        t: 'project',
        title: 'Add things up',
        text: 'A `Counter` adds money per item and per day. Because `money` is a property of `Sale`, the analyzer stays short.',
        code: `import csv\nfrom collections import Counter\nfrom dataclasses import dataclass\n\nDATA = """${DATA}"""\n\n${SALE}\n\n${CLEAN}\n\n${ANALYZE}\n\nsales, errors = clean(DATA.splitlines())\nby_item, by_day = analyze(sales)\nprint(dict(by_item))\nprint(dict(by_day))\n`,
        output: "{'sugar': 13500, 'rice': 6000, 'salt': 8000, 'tea': 2000}\n{'2026-11-02': 19500, '2026-11-03': 8000, '2026-11-04': 2000}",
      },
      { t: 'h', text: 'Station 3: report' },
      {
        t: 'project',
        title: 'The report',
        text: 'The report ranks the items, finds the best day and lists every skipped row, so the shop manager knows exactly what to fix. It also copes with a file where nothing is valid.',
        code: `import csv\nfrom collections import Counter\nfrom dataclasses import dataclass\n\nDATA = """${DATA}"""\n\n${SALE}\n\n${CLEAN}\n\n${ANALYZE}\n\n${REPORT}\n\nsales, errors = clean(DATA.splitlines())\nreport(sales, errors)\n`,
        output: 'Revenue by item:\nsugar: 13,500\nsalt: 8,000\nrice: 6,000\ntea: 2,000\nTotal: 29,500\nBest day: 2026-11-02 (19,500)\nSkipped rows: 3\n  line 5: bad quantity\n  line 6: bad price\n  line 7: duplicate',
      },
      { t: 'h', text: 'Station 4: protect it with tests' },
      {
        t: 'project',
        title: 'Tests for the pipeline',
        text: 'Small files where you know the answer by heart catch mistakes before the shop owner does.',
        code: `import csv\nfrom dataclasses import dataclass\n\n${SALE}\n\n${CLEAN}\n\nassert parse_money("UGX 4,500") == 4500\ntry:\n    parse_money("")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("a blank price should fail")\n\nsales, errors = clean(["day,item,qty,price", "2026-01-01,tea,2,500", "2026-01-01,tea,9,500"])\nassert len(sales) == 1\nassert sales[0].money == 1000\nassert errors == ["line 3: duplicate"]\nprint("All tests passed")\n`,
        output: 'All tests passed',
      },
      {
        t: 'recap',
        items: ['A pipeline is small stations in a fixed order: clean, analyze, report.', 'Each station does one job, so each can be tested alone.', 'Bad rows are collected with their line numbers instead of crashing the program.', 'A dataclass with a property (`money`) keeps the analysis code short.', 'The same pipeline works for next week’s file and for another shop’s file.', 'Reading, cleaning, analyzing and reporting messy data is the core of data work in every language.'],
        memory: 'Clean → analyze → report → test.',
      },
    ],
    exercises: [
      {
        id: 'py45-clean',
        title: 'Write the clean station',
        prompt: 'The analyzer and the report are finished. Write `clean(lines)`. It reads the CSV lines (first line is the header `day,item,qty,price`) and returns `(sales, errors)`.\n\nFor each row build a `Sale` with the day and item stripped (item in lowercase), the quantity via `parse_int(..., "quantity")` and the price via `parse_money`. If a helper raises `ValueError`, add `line N: message` to `errors` (N counts from 2, because line 1 is the header) and skip the row. If the same (day, item) was already kept, add `line N: duplicate` and skip it.',
        starter: `import csv\nfrom collections import Counter\nfrom dataclasses import dataclass\n\n${SALE}\n\n${CLEAN_STUB}\n\n${ANALYZE}\n\n${REPORT}\n\nn = int(input())\nlines = [input() for i in range(n)]\nsales, errors = clean(lines)\nreport(sales, errors)\n`,
        sampleInput: `8\n${DATA}`,
        usesInput: true,
        tests: [
          {
            input: `8\n${DATA}`,
            expected: 'Revenue by item:\nsugar: 13,500\nsalt: 8,000\nrice: 6,000\ntea: 2,000\nTotal: 29,500\nBest day: 2026-11-02 (19,500)\nSkipped rows: 3\n  line 5: bad quantity\n  line 6: bad price\n  line 7: duplicate',
            name: 'Friday’s messy file',
          },
          {
            input: '2\nday,item,qty,price\n2026-12-01,tea,2,500',
            expected: 'Revenue by item:\ntea: 1,000\nTotal: 1,000\nBest day: 2026-12-01 (1,000)\nSkipped rows: 0',
            name: 'A tiny clean file',
          },
          {
            input: '3\nday,item,qty,price\n2026-12-01,tea,two,500\n2026-12-02,oil,1,UGX',
            expected: 'No valid sales\nSkipped rows: 2\n  line 2: bad quantity\n  line 3: bad price',
            hidden: true,
          },
          {
            input: '3\nday,item,qty,price\n2026-12-01,Tea,2,500\n2026-12-01, tea ,9,900',
            expected: 'Revenue by item:\ntea: 1,000\nTotal: 1,000\nBest day: 2026-12-01 (1,000)\nSkipped rows: 1\n  line 3: duplicate',
            hidden: true,
          },
        ],
        hints: [
          'Use `enumerate(csv.DictReader(lines), start=2)` so each row comes with its line number. Keep two lists, `sales` and `errors`, and a `seen` set.',
          'Build the `Sale` inside a `try:` block and catch `ValueError as e`, then add `f"line {number}: {e}"` to `errors` and `continue`.',
          'After the sale is built, make the key `(sale.day, sale.item)`. If it is in `seen`, add `f"line {number}: duplicate"` and `continue`; otherwise add the key to `seen` and the sale to `sales`. Station 1 in the lesson is the full answer to compare with.',
        ],
      },
    ],
  },
];

export const level7bSolution = { DATA, SALE, CLEAN, ANALYZE, REPORT };
