// PHP, Level 5 (part 2): lessons 28 to 30 (files and JSON, PDO with SQLite, a JSON API).
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, WALLET_LIB } from './shared.js';

const LEVEL = 'Level 5: Market-ready PHP';
const lines = (a) => a.join('\n') + '\n';

// ---- lesson 28 models ----
const ledgerTotals = (cmds) => {
  const totals = new Map();
  for (const c of cmds) {
    const [, name, amount] = c.split(' ');
    totals.set(name, (totals.get(name) || 0) + Number(amount));
  }
  return out(...[...totals].map(([n, t]) => `${n}: UGX ${money(t)}`));
};
const statementOf = (text) => {
  let d;
  try {
    d = JSON.parse(text);
  } catch {
    return 'Invalid JSON\n';
  }
  if (typeof d !== 'object' || d === null || Array.isArray(d)) return 'Invalid JSON\n';
  let net = 0;
  const rows = [];
  for (const t of d.transactions || []) {
    if (t.type === 'deposit') {
      net += t.amount;
      rows.push(`+ ${money(t.amount)}`);
    } else {
      net -= t.amount;
      rows.push(`- ${money(t.amount)}`);
    }
  }
  return out(`Statement for ${d.name}`, ...rows, `Net: ${money(net)}`);
};
const jsonOut = (rowsIn) => {
  const customers = rowsIn.map((r) => {
    const [name, amount] = r.split(',');
    return { name, amount: Number(amount) };
  });
  return JSON.stringify({ count: customers.length, total: customers.reduce((s, c) => s + c.amount, 0), customers }, null, 4) + '\n';
};

// ---- lesson 29 models ----
const ledger29 = (cmds) => {
  const bal = new Map();
  const res = [];
  for (const c of cmds) {
    const [cmd, name, amount] = c.split(' ');
    if (cmd === 'deposit') bal.set(name, (bal.get(name) || 0) + Number(amount));
    else if (cmd === 'withdraw') bal.set(name, (bal.get(name) || 0) - Number(amount));
    else if (cmd === 'report') {
      if (bal.size === 0) res.push('No transactions');
      else for (const n of [...bal.keys()].sort()) res.push(`${n}: UGX ${money(bal.get(n))}`);
    }
  }
  return out(...res);
};
const transfer29 = (cmds) => {
  const acct = new Map();
  const res = [];
  for (const c of cmds) {
    const [cmd, a, b, c3] = c.split(' ');
    if (cmd === 'open') {
      acct.set(a, Number(b));
      res.push(`Opened ${a}`);
    } else if (cmd === 'transfer') {
      const amount = Number(c3);
      if (amount > 0 && acct.has(a) && acct.has(b) && acct.get(a) >= amount) {
        acct.set(a, acct.get(a) - amount);
        acct.set(b, acct.get(b) + amount);
        res.push(`Transferred UGX ${money(amount)} from ${a} to ${b}`);
      } else res.push('Transfer refused');
    } else if (cmd === 'balances') {
      for (const n of [...acct.keys()].sort()) res.push(`${n} ${money(acct.get(n))}`);
    }
  }
  return out(...res);
};
const CUSTOMERS = [['Amina Nakato', 'Mukono'], ['Brian Ssali', 'Kampala'], ['Grace Namukasa', 'Mukono'], ['Dan Okello', 'Jinja']];
const search29 = (terms) =>
  out(
    ...terms.map((t) => {
      const l = t.toLowerCase();
      const names = CUSTOMERS.filter(([n, town]) => n.toLowerCase().includes(l) || town.toLowerCase().includes(l)).map(([n]) => n).sort();
      return `${t} -> ${names.length ? names.join(', ') : 'No match'}`;
    })
  );

// ---- lesson 30 models ----
const API_KNOWN = { '/balance': 'GET', '/deposit': 'POST', '/withdraw': 'POST', '/transactions': 'GET' };
const feeFor = (a) => (a <= 50000 ? 1000 : a <= 200000 ? 2000 : 3500);
const apiSession = (input, known = API_KNOWN) => {
  let balance = 0;
  const history = [];
  const res = [];
  for (const line of input) {
    const [method, path, ...rest] = line.split(' ');
    const bodyText = rest.join(' ');
    const reply = (status, body, headers = {}) => {
      res.push(`${status} ${JSON.stringify(body)}`);
      for (const [k, v] of Object.entries(headers)) res.push(`  ${k}: ${v}`);
    };
    if (!known[path]) {
      reply(404, { error: 'Not found' });
      continue;
    }
    if (known[path] !== method) {
      reply(405, { error: 'Method not allowed' }, { Allow: known[path] });
      continue;
    }
    if (path === '/balance') {
      reply(200, { balance });
      continue;
    }
    if (path === '/transactions') {
      reply(200, { transactions: history });
      continue;
    }
    let d;
    try {
      d = JSON.parse(bodyText);
    } catch {
      reply(400, { error: 'Invalid JSON' });
      continue;
    }
    if (typeof d !== 'object' || d === null) {
      reply(400, { error: 'Invalid JSON' });
      continue;
    }
    if (typeof d.amount !== 'number' || !Number.isInteger(d.amount)) {
      reply(422, { error: 'Amount must be a whole number' });
      continue;
    }
    if (d.amount <= 0) {
      reply(422, { error: 'Amount must be above zero' });
      continue;
    }
    if (path === '/deposit') {
      balance += d.amount;
      history.push({ kind: 'deposit', amount: d.amount, fee: 0 });
      reply(201, { balance });
    } else {
      const fee = feeFor(d.amount);
      const needed = d.amount + fee;
      if (needed > balance) reply(409, { error: `Short by UGX ${money(needed - balance)}`, missing: needed - balance });
      else {
        balance -= needed;
        history.push({ kind: 'withdraw', amount: d.amount, fee });
        reply(200, { balance, fee });
      }
    }
  }
  return out(...res);
};
const validInt = (s, min, max) => /^-?\d+$/.test(s) && Number(s) >= min && Number(s) <= max;
const paginate30 = (targets) =>
  out(
    ...targets.map((t) => {
      const [path, qs = ''] = t.split('?');
      if (path !== '/customers') return `404 ${JSON.stringify({ error: 'Not found' })}`;
      const q = new URLSearchParams(qs);
      const page = q.has('page') ? q.get('page') : '1';
      const per = q.has('per_page') ? q.get('per_page') : '3';
      if (!validInt(page, 1, Infinity)) return `422 ${JSON.stringify({ error: 'Invalid page' })}`;
      if (!validInt(per, 1, 5)) return `422 ${JSON.stringify({ error: 'Invalid per_page' })}`;
      const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const p = Number(page);
      const n = Number(per);
      return `200 ${JSON.stringify({ page: p, per_page: n, total: 10, items: all.slice((p - 1) * n, p * n) })}`;
    })
  );
const servicesApi = (input) =>
  out(
    ...input.flatMap((l) => {
      const [m, p] = l.split(' ');
      if (p === '/health') return m === 'GET' ? ['200 {"status":"ok"}'] : ['405 {"error":"Method not allowed"}', '  Allow: GET'];
      if (p === '/services') return m === 'GET' ? ['200 {"services":["deposit","withdraw","send"]}'] : ['405 {"error":"Method not allowed"}', '  Allow: GET'];
      return ['404 {"error":"Not found"}'];
    })
  );

// The wallet API (lesson 30). `extraKnown` and `extraArms` are the parts the learner adds in the exercise.
const apiCode = (full) => php`
function reply(int $status, array $body, array $headers = []): array {
    return ["status" => $status, "headers" => $headers, "body" => json_encode($body)];
}

function readAmount(string $bodyText): int {
    $data = json_decode($bodyText, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($data)) {
        throw new JsonException("Body must be a JSON object");
    }
    $amount = $data["amount"] ?? null;
    if (!is_int($amount)) {
        throw new InvalidAmountException("Amount must be a whole number");
    }
    return $amount;
}

function handle(Wallet $wallet, string $method, string $path, string $bodyText): array {
    $known = [
        "/balance" => "GET",
        "/deposit" => "POST",${full ? `
        "/withdraw" => "POST",
        "/transactions" => "GET",` : `
        // add /withdraw (POST) and /transactions (GET) here`}
    ];
    if (!isset($known[$path])) {
        return reply(404, ["error" => "Not found"]);
    }
    if ($known[$path] !== $method) {
        return reply(405, ["error" => "Method not allowed"], ["Allow" => $known[$path]]);
    }
    try {
        return match ($path) {
            "/balance" => reply(200, ["balance" => $wallet->balance()]),
            "/deposit" => (function () use ($wallet, $bodyText) {
                $wallet->deposit(readAmount($bodyText));
                return reply(201, ["balance" => $wallet->balance()]);
            })(),${full ? `
            "/withdraw" => (function () use ($wallet, $bodyText) {
                $fee = $wallet->withdraw(readAmount($bodyText));
                return reply(200, ["balance" => $wallet->balance(), "fee" => $fee]);
            })(),
            "/transactions" => reply(200, ["transactions" => array_map(
                fn(Transaction $t) => ["kind" => $t->kind->value, "amount" => $t->amount, "fee" => $t->fee],
                $wallet->history()
            )]),` : `
            // add the two new arms here`}
            default => reply(500, ["error" => "Server error"]),
        };
    } catch (JsonException) {
        return reply(400, ["error" => "Invalid JSON"]);
    } catch (InvalidAmountException $e) {
        return reply(422, ["error" => $e->getMessage()]);
    } catch (InsufficientFundsException $e) {
        return reply(409, ["error" => $e->getMessage(), "missing" => $e->missing]);
    }
}
`;
const API_MAIN = php`
$wallet = new Wallet();
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$method, $path, $bodyText] = array_pad(explode(" ", $line, 3), 3, "");
    $response = handle($wallet, $method, $path, $bodyText);
    echo $response["status"], " ", $response["body"], "\n";
    foreach ($response["headers"] as $name => $value) {
        echo "  ", $name, ": ", $value, "\n";
    }
}
`;
const API_DEMO = ['GET /balance', 'POST /deposit {"amount":50000}', 'POST /withdraw {"amount":20000}', 'GET /transactions', 'POST /deposit {"amount":-5}', 'POST /deposit {"amount":"50"}', 'POST /deposit {oops', 'POST /withdraw {"amount":900000}', 'GET /deposit', 'GET /loans'];

// Shared database setup shown in the PDO lesson.
const DB_OPEN = php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
`;

export const level5b = [
  // ================================================================== 28
  {
    id: 'php-files-json',
    level: LEVEL,
    minutes: 32,
    title: 'Files, CSV and JSON',
    summary: 'Save and read text files, write and read CSV safely, and talk JSON like every web API does',
    blocks: [
      {
        t: 'story',
        title: 'The ledger that vanished',
        text: "Every program so far forgot everything the moment it ended. Nambi needs her day's transactions to still be there tomorrow. The simplest memory is a **file**. And when Nambi's program needs to talk to *another* program (a phone app, the mobile money company), the common language is **JSON**: plain text with a fixed shape that every language can read.\n\nIn this app a file lives only while your program runs (each run starts with an empty folder). On a real server the same code keeps the file for good.",
      },
      { t: 'h', text: 'Writing and reading a text file' },
      {
        t: 'try',
        code: php`<?php
$file = "ledger.txt";
file_put_contents($file, "Amina,50000\n");
file_put_contents($file, "Brian,20000\n", FILE_APPEND | LOCK_EX);

echo file_get_contents($file);
$rows = file($file, FILE_IGNORE_NEW_LINES);
echo count($rows), " rows\n";

unlink($file);
var_dump(file_exists($file));
`,
        output: out('Amina,50000', 'Brian,20000', '2 rows', 'bool(false)'),
      },
      {
        t: 'list',
        items: [
          '`file_put_contents($file, $text)` **replaces** the whole file. Add `FILE_APPEND` to add to the end. `LOCK_EX` stops two requests writing at the same moment.',
          '`file_get_contents($file)` reads everything as one text. `file($file, FILE_IGNORE_NEW_LINES)` gives an array of lines.',
          '`file_exists`, `unlink` (delete), `is_file`, `mkdir`, `scandir` are the other everyday tools.',
          'Reading a missing file gives a **warning** and `false`, not a crash. Check `file_exists` first, or test for `false`.',
        ],
      },
      { t: 'h', text: 'CSV: rows with commas inside' },
      { t: 'p', text: 'It is tempting to split a line with `explode(",")`. It breaks the moment a value contains a comma (“Ssali, Sons”). CSV has quoting rules for exactly this, and PHP knows them: `fputcsv` writes a row, `fgetcsv` reads one back.' },
      {
        t: 'try',
        code: php`<?php
$h = fopen("tx.csv", "w");
fputcsv($h, ["Amina", "Ssali, Sons", 50000]);
fputcsv($h, ["Brian", "plain", 20000]);
fclose($h);

echo file_get_contents("tx.csv");

$h = fopen("tx.csv", "r");
while (($row = fgetcsv($h)) !== false) {
    echo $row[0], " paid ", number_format((int) $row[2]), " (", $row[1], ")\n";
}
fclose($h);
`,
        output: out('Amina,"Ssali, Sons",50000', 'Brian,plain,20000', 'Amina paid 50,000 (Ssali, Sons)', 'Brian paid 20,000 (plain)'),
      },
      { t: 'tip', text: '`fgetcsv` returns **text** for every column (like all input), so convert numbers yourself. At the end of the file it returns `false`, which is why the loop tests `!== false`.' },
      { t: 'h', text: 'JSON: encode and decode' },
      { t: 'p', text: 'JSON has objects `{"name": "Amina"}`, lists `[1, 2]`, text, numbers, `true`, `false` and `null`. PHP arrays with names become JSON objects, and plain lists become JSON lists:' },
      {
        t: 'try',
        code: php`<?php
$account = ["name" => "Amina", "balance" => 50000, "vip" => true, "note" => null, "tags" => ["mukono"]];
echo json_encode($account), "\n";
echo json_encode($account, JSON_PRETTY_PRINT), "\n";
`,
        output: out('{"name":"Amina","balance":50000,"vip":true,"note":null,"tags":["mukono"]}', '{', '    "name": "Amina",', '    "balance": 50000,', '    "vip": true,', '    "note": null,', '    "tags": [', '        "mukono"', '    ]', '}'),
      },
      {
        t: 'try',
        code: php`<?php
$text = '{"name":"Amina","transactions":[{"amount":50000},{"amount":20000}]}';
$data = json_decode($text, true);
echo $data["name"], " ", count($data["transactions"]), " ", array_sum(array_column($data["transactions"], "amount")), "\n";
`,
        output: 'Amina 2 70000\n',
      },
      { t: 'p', text: 'The second argument `true` of `json_decode` means “give me arrays”. Without it you get objects (`$data->name`), which is a different way of working. In this course we always pass `true`.' },
      { t: 'h', text: 'When the JSON is broken' },
      { t: 'p', text: 'Anyone can send you broken JSON. By default `json_decode` quietly returns `null`, which is the same as the JSON text `null`. Professional code asks for an **exception** instead with the flag `JSON_THROW_ON_ERROR`:' },
      {
        t: 'try',
        code: php`<?php
try {
    json_decode("{bad", true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo "Invalid: ", $e->getMessage(), "\n";
}
var_dump(json_decode("{bad", true));
echo json_last_error_msg(), "\n";
`,
        output: out('Invalid: Syntax error', 'NULL', 'Syntax error'),
      },
      {
        t: 'list',
        items: [
          'A PHP array that is a **list** (keys 0, 1, 2…) becomes a JSON list; any other array becomes a JSON object. After `array_filter` the keys have gaps, so call `array_values` before `json_encode`.',
          'JSON text must use **double quotes**. `{\'a\': 1}` is not JSON.',
          '`json_encode` escapes `/` as `\\/` by default. It is harmless, and `JSON_UNESCAPED_SLASHES` turns it off.',
          'Money in JSON: send whole shillings as integers, never as floats.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
echo json_encode(["a" => 1, "b" => [true, null]]);
`,
        question: 'What does this program print?',
        options: ['{"a":1,"b":[true,null]}', '{a:1,b:[true,null]}', '{"a":1,"b":[1,]}', '["a",1]'],
        answer: 0,
        explain: 'Named keys make an object, the inner list stays a list, true and null keep their JSON spelling, and there are no spaces in the compact form.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap so json_decode gives an array.',
        template: php`<?php
$d = json_decode('{"name":"Amina"}', ___);
echo $d["name"], "\n";
`,
        blanks: [{ options: ['true', 'false', 'null'], answer: 'true' }],
        output: 'Amina\n',
      },
      {
        t: 'bug',
        code: php`<?php
$data = json_decode("{bad", true, 512, JSON_THROW_ON_ERROR);
echo "never reached\n";
`,
        question: 'This program stops with “JsonException: Syntax error”. What should the code do?',
        options: ['Catch JsonException and answer with a message', 'Remove the flag so the error disappears', 'Use single quotes', 'Call json_encode instead'],
        answer: 0,
        explain: 'Bad JSON is normal from the outside world, so expect it: wrap the decode in try/catch and tell the sender their JSON is invalid.',
        fixed: php`<?php
try {
    $data = json_decode("{bad", true, 512, JSON_THROW_ON_ERROR);
    echo "decoded\n";
} catch (JsonException) {
    echo "Invalid JSON\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: save an account as JSON, read it back, and print it.',
        lines: ['<?php', '$data = ["name" => "Amina", "balance" => 50000];', 'file_put_contents("acct.json", json_encode($data));', '$text = file_get_contents("acct.json");', '$back = json_decode($text, true);', 'echo $back["name"], " ", $back["balance"], "\\n";', 'unlink("acct.json");'],
        output: 'Amina 50000\n',
      },
      {
        t: 'quiz',
        question: 'json_decode is given text that is not valid JSON and no flags. What does it return?',
        options: ['null, silently', 'An empty array', 'false', 'It always throws'],
        answer: 0,
        explain: 'It returns null. Since valid JSON can also be the word null, the safe way to tell the difference is JSON_THROW_ON_ERROR.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
file_put_contents("log.txt", "first\n");
file_put_contents("log.txt", "second\n");
echo file_get_contents("log.txt");`, why: 'No error, but only “second” is left: the second call replaced the file. Add FILE_APPEND to keep adding lines.', right: php`<?php
file_put_contents("log.txt", "first\n");
file_put_contents("log.txt", "second\n", FILE_APPEND);
echo file_get_contents("log.txt");`, logic: true },
          { wrong: php`<?php
echo json_encode(array_filter([1, 0, 3]));`, why: 'It prints {"0":1,"2":3}, an object, because array_filter keeps the old keys and leaves a gap. Wrap it in array_values to get a list.', right: php`<?php
echo json_encode(array_values(array_filter([1, 0, 3])));`, logic: true },
          { wrong: php`<?php
$d = json_decode('{"a":1}');
echo $d["a"];`, why: 'Without the second argument true you get an object, and an object cannot be read like an array: “Cannot use object of type stdClass as array”.', right: php`<?php
$d = json_decode('{"a":1}', true);
echo $d["a"];` },
          { wrong: php`<?php
echo file_get_contents("missing.txt");`, why: 'No fatal error, just a warning and an empty result. A program that carries on may then work with nothing. Check file_exists first.', right: php`<?php
if (file_exists("missing.txt")) {
    echo file_get_contents("missing.txt");
} else {
    echo "no file yet";
}`, logic: true },
          { wrong: php`<?php
echo count(explode(",", 'Amina,"Ssali, Sons",50000'));`, why: 'It prints 4, but the row has 3 values: explode cut inside the quoted comma. Use str_getcsv or fgetcsv, which understand quotes.', right: php`<?php
echo count(str_getcsv('Amina,"Ssali, Sons",50000'));`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`file_put_contents` (with `FILE_APPEND | LOCK_EX`), `file_get_contents`, `file`, `file_exists`, `unlink`. A missing file is a warning, not a crash.',
          'CSV: always `fputcsv` and `fgetcsv` (or `str_getcsv`), never `explode(",")`. Every column comes back as text.',
          '`json_encode` / `json_decode($text, true)`; use `JSON_PRETTY_PRINT` for humans and `JSON_THROW_ON_ERROR` with a `catch (JsonException)` for input you do not control.',
          'A list needs keys 0..n-1 to become a JSON list: `array_values` after `array_filter`.',
        ],
        memory: 'Append, do not replace. CSV functions, not explode. Decode with true; throw on error.',
      },
    ],
    exercises: [
      {
        id: 'php28-ledger-file',
        title: 'Keep the ledger in a CSV file',
        prompt: 'Read lines `add name amount` (no spaces in names). Write every line as a row `name,amount` to a file `ledger.csv` using `fputcsv`. When the input ends, read the file back with `fgetcsv` and print the total for each name, in order of first appearance: `Amina: UGX 70,000`.',
        starter: php`<?php
$h = fopen("ledger.csv", "w");
while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
}
fclose($h);
`,
        usesInput: true,
        sampleInput: lines(['add Amina 50000', 'add Brian 20000', 'add Amina 20000']),
        tests: [
          { input: lines(['add Amina 50000', 'add Brian 20000', 'add Amina 20000']), expected: ledgerTotals(['add Amina 50000', 'add Brian 20000', 'add Amina 20000']) },
          { input: lines(['add Grace 1000000']), expected: ledgerTotals(['add Grace 1000000']), hidden: true, name: 'One customer' },
          { input: lines(['add Dan 5', 'add Eve 10', 'add Dan 7', 'add Eve 1', 'add Fay 3']), expected: ledgerTotals(['add Dan 5', 'add Eve 10', 'add Dan 7', 'add Eve 1', 'add Fay 3']), hidden: true, name: 'First-appearance order' },
        ],
        hints: [
          'Inside the loop: if (count($parts) === 3) { fputcsv($h, [$parts[1], $parts[2]]); } (skip blank lines).',
          'After fclose($h), open the file again with fopen("ledger.csv", "r") and loop with while (($row = fgetcsv($h)) !== false).',
          'Keep $totals[$row[0]] = ($totals[$row[0]] ?? 0) + (int) $row[1]; then print each with number_format.',
        ],
      },
      {
        id: 'php28-json-statement',
        title: 'A statement from JSON',
        prompt: 'The whole input is one JSON text, like `{"name":"Amina","transactions":[{"type":"deposit","amount":50000},{"type":"withdraw","amount":20000}]}`. Print `Statement for Amina`, then one line per transaction: `+ 50,000` for a deposit or `- 20,000` for a withdraw, then `Net: 30,000`. If the text is not valid JSON (or not a JSON object) print only `Invalid JSON`. Use `JSON_THROW_ON_ERROR`.',
        starter: php`<?php
$text = trim(stream_get_contents(STDIN));
`,
        usesInput: true,
        sampleInput: '{"name":"Amina","transactions":[{"type":"deposit","amount":50000},{"type":"withdraw","amount":20000}]}\n',
        tests: [
          { input: '{"name":"Amina","transactions":[{"type":"deposit","amount":50000},{"type":"withdraw","amount":20000}]}\n', expected: statementOf('{"name":"Amina","transactions":[{"type":"deposit","amount":50000},{"type":"withdraw","amount":20000}]}') },
          { input: '{"name":"Dan","transactions":[]}\n', expected: statementOf('{"name":"Dan","transactions":[]}'), hidden: true, name: 'No transactions' },
          { input: '{"name": "Eve", oops}\n', expected: 'Invalid JSON', hidden: true, name: 'Broken JSON' },
          { input: '{"name":"Grace","transactions":[{"type":"deposit","amount":1000000},{"type":"deposit","amount":2500},{"type":"withdraw","amount":500}]}\n', expected: statementOf('{"name":"Grace","transactions":[{"type":"deposit","amount":1000000},{"type":"deposit","amount":2500},{"type":"withdraw","amount":500}]}'), hidden: true, name: 'Several rows' },
        ],
        hints: [
          'try { $data = json_decode($text, true, 512, JSON_THROW_ON_ERROR); } catch (JsonException) { echo "Invalid JSON\\n"; exit; }',
          'Also check is_array($data) after decoding. Keep a running $net: add amounts for "deposit", subtract for anything else.',
          'Print "Statement for " . $data["name"], the rows while looping over $data["transactions"] ?? [], then "Net: " . number_format($net).',
        ],
      },
      {
        id: 'php28-json-out',
        title: 'Report as JSON',
        prompt: 'Read lines `name,amount`. Print one pretty-printed JSON object with three keys in this order: `count` (how many lines), `total` (sum of the amounts, an integer) and `customers` (a list of objects with `name` and `amount`, the amount as an integer). Use `JSON_PRETTY_PRINT`.',
        starter: php`<?php
$customers = [];
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
}
`,
        usesInput: true,
        sampleInput: lines(['Amina,50000', 'Brian,20000']),
        tests: [
          { input: lines(['Amina,50000', 'Brian,20000']), expected: jsonOut(['Amina,50000', 'Brian,20000']) },
          { input: '\n', expected: jsonOut([]), hidden: true, name: 'No customers' },
          { input: lines(['Grace,1000000']), expected: jsonOut(['Grace,1000000']), hidden: true, name: 'One customer' },
        ],
        hints: [
          'Skip empty lines. For each line: [$name, $amount] = explode(",", $line); and add ["name" => $name, "amount" => (int) $amount] to $customers.',
          'The amounts must be integers, or PHP would write them as text in quotes: use (int).',
          'echo json_encode(["count" => count($customers), "total" => array_sum(array_column($customers, "amount")), "customers" => $customers], JSON_PRETTY_PRINT), "\\n";',
        ],
      },
    ],
  },

  // ================================================================== 29
  {
    id: 'php-pdo',
    level: LEVEL,
    minutes: 36,
    title: 'Databases with PDO',
    summary: 'SQLite and PDO: tables, prepared statements, fetching rows, transactions and a repository class',
    blocks: [
      {
        t: 'story',
        title: 'Two clerks, one file',
        text: "Nambi hires a second clerk. Both write to `ledger.csv` at the same moment, and one clerk's line overwrites the other's. A file is fine for small notes; for money you need a **database**: a program built to store rows safely, find them fast, and let many people use it at once.\n\nPHP talks to databases through **PDO** (PHP Data Objects). The same PDO code works with MySQL, PostgreSQL and **SQLite**, a small database that lives in one file (or in memory). We use SQLite here because it needs no server, and it is the same SQL you will use on a real MySQL server at work.",
      },
      { t: 'h', text: 'Open, create, insert, read' },
      {
        t: 'try',
        code: DB_OPEN + php`
$db->exec("create table tx (id integer primary key autoincrement, name text not null, kind text not null, amount integer not null)");

$stmt = $db->prepare("insert into tx (name, kind, amount) values (:name, :kind, :amount)");
$stmt->execute([":name" => "Amina", ":kind" => "deposit", ":amount" => 50000]);
$stmt->execute(["name" => "Brian", "kind" => "deposit", "amount" => 20000]);
echo $db->lastInsertId(), "\n";

foreach ($db->query("select * from tx order by id") as $row) {
    echo $row["id"], " ", $row["name"], " ", number_format($row["amount"]), "\n";
}
`,
        output: out('2', '1 Amina 50,000', '2 Brian 20,000'),
      },
      {
        t: 'list',
        items: [
          '`new PDO("sqlite::memory:")` opens a database that lives in memory. A real file would be `"sqlite:booth.db"`; MySQL would be `"mysql:host=localhost;dbname=booth"` with a user and password.',
          '`ERRMODE_EXCEPTION` makes every database error a `PDOException` you can catch (this is the default in PHP 8, but say it anyway so the code explains itself). `FETCH_ASSOC` gives each row as a named array.',
          '`exec` runs SQL that returns no rows (create, insert). `query` runs a select. `prepare` + `execute` runs SQL with **placeholders**.',
          'Placeholders are `?` (by position) or `:name` (by name). The data travels **separately** from the SQL, so it can never be mistaken for SQL (lesson 27).',
          '`lastInsertId()` is the id the database just gave to the new row.',
        ],
      },
      { t: 'h', text: 'Asking questions: fetch, fetchAll, fetchColumn' },
      {
        t: 'try',
        code: DB_OPEN + php`
$db->exec("create table tx (id integer primary key autoincrement, name text not null, kind text not null, amount integer not null)");
$db->exec("insert into tx (name, kind, amount) values ('Amina','deposit',50000), ('Brian','deposit',20000), ('Amina','withdraw',10000)");

$stmt = $db->prepare("select sum(amount) from tx where kind = ?");
$stmt->execute(["deposit"]);
echo number_format((int) $stmt->fetchColumn()), "\n";

$rows = $db->query("select name, amount from tx order by amount desc")->fetchAll();
echo count($rows), " ", $rows[0]["name"], "\n";

$stmt = $db->prepare("select amount from tx where name = ? order by id");
$stmt->execute(["Amina"]);
echo implode(", ", $stmt->fetchAll(PDO::FETCH_COLUMN)), "\n";
`,
        output: out('70,000', '3 Amina', '50000, 10000'),
      },
      {
        t: 'list',
        items: [
          '`fetch()` gives the next row (or `false` at the end). `fetchAll()` gives every row as a list. `fetchColumn()` gives the first column of the next row: perfect for `count(*)` and `sum(...)`.',
          '`fetchAll(PDO::FETCH_COLUMN)` gives a plain list of one column’s values.',
          'Always let the **database** do the counting and summing (`sum`, `count`, `group by`) instead of loading every row into PHP.',
        ],
      },
      { t: 'h', text: 'Transactions: all or nothing' },
      { t: 'p', text: 'A transfer is two changes: money added to one account and taken from another. If the second fails after the first succeeded, money appears from nowhere. A **transaction** groups the changes: `commit()` makes all of them real, `rollBack()` cancels all of them. Here the table refuses a negative balance with a `check` rule, so a too-big transfer fails half-way and the rollback undoes the first half:' },
      {
        t: 'try',
        code: DB_OPEN + php`
$db->exec("create table acct (name text primary key, balance integer not null check (balance >= 0))");
$db->exec("insert into acct values ('amina', 50000), ('brian', 0)");

function transfer(PDO $db, string $from, string $to, int $amount): void {
    $db->beginTransaction();
    try {
        $give = $db->prepare("update acct set balance = balance + ? where name = ?");
        $give->execute([$amount, $to]);
        $take = $db->prepare("update acct set balance = balance - ? where name = ?");
        $take->execute([$amount, $from]);
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        throw $e;
    }
}

foreach ([20000, 40000] as $amount) {
    try {
        transfer($db, "amina", "brian", $amount);
        echo "ok\n";
    } catch (PDOException $e) {
        echo "Transfer refused\n";
    }
}

foreach ($db->query("select name, balance from acct order by name") as $r) {
    echo $r["name"], " ", $r["balance"], "\n";
}
`,
        output: out('ok', 'Transfer refused', 'amina 30000', 'brian 20000'),
      },
      { t: 'tip', text: 'Look at the second transfer: brian was **credited 40,000 first**, then the debit from amina failed. Without the transaction brian would keep money that amina never lost. After `rollBack` brian is back at 20,000. Also notice `catch (Throwable $e) { $db->rollBack(); throw $e; }`: undo, then pass the error on to whoever called.' },
      { t: 'h', text: 'A repository class' },
      { t: 'p', text: 'Scattering SQL all over the program is hard to change. Professional code puts the SQL in one class, a **repository**, and the rest of the program calls its methods (lesson 19 taught objects; this is a typical use):' },
      {
        t: 'try',
        code: php`<?php
final class LedgerRepository {
    public function __construct(private PDO $db) {
        $db->exec("create table if not exists tx (id integer primary key autoincrement, name text not null, kind text not null, amount integer not null)");
    }

    public function add(string $name, string $kind, int $amount): int {
        $stmt = $this->db->prepare("insert into tx (name, kind, amount) values (?, ?, ?)");
        $stmt->execute([$name, $kind, $amount]);
        return (int) $this->db->lastInsertId();
    }

    public function balanceOf(string $name): int {
        $stmt = $this->db->prepare("select coalesce(sum(case kind when 'deposit' then amount else -amount end), 0) from tx where name = ?");
        $stmt->execute([$name]);
        return (int) $stmt->fetchColumn();
    }

    public function names(): array {
        return $this->db->query("select distinct name from tx order by name")->fetchAll(PDO::FETCH_COLUMN);
    }
}

$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$repo = new LedgerRepository($db);
$repo->add("Amina", "deposit", 50000);
$repo->add("Brian", "deposit", 20000);
$repo->add("Amina", "withdraw", 20000);
foreach ($repo->names() as $name) {
    echo $name, " ", number_format($repo->balanceOf($name)), "\n";
}
echo $repo->balanceOf("Nobody"), "\n";
`,
        output: out('Amina 30,000', 'Brian 20,000', '0'),
      },
      {
        t: 'predict',
        code: php`<?php
$db = new PDO("sqlite::memory:");
$db->exec("create table t(n integer)");
$db->exec("insert into t values (5), (7)");
echo $db->query("select sum(n) from t")->fetchColumn();
`,
        question: 'What does this program print?',
        options: ['12', '5', '7', '2'],
        answer: 0,
        explain: 'sum(n) adds the column: 5 + 7 = 12. fetchColumn returns that single value.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the method that runs a prepared statement with its values.',
        template: php`<?php
$db = new PDO("sqlite::memory:");
$db->exec("create table t(kind text)");
$db->exec("insert into t values ('deposit')");
$stmt = $db->prepare("select count(*) from t where kind = ?");
$stmt->___(["deposit"]);
echo $stmt->fetchColumn(), "\n";
`,
        blanks: [{ options: ['execute', 'fetch', 'prepare'], answer: 'execute' }],
        output: '1\n',
      },
      {
        t: 'bug',
        code: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("insert into ledger values (1)");
echo "saved\n";
`,
        question: 'This program stops with “PDOException: no such table: ledger”. What is the fix?',
        options: ['Create the table before inserting into it', 'Remove setAttribute', 'Use query instead of exec', 'Add a semicolon'],
        answer: 0,
        explain: 'SQL cannot insert into a table that does not exist yet. The exception is useful: without it the failure would be silent.',
        fixed: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table ledger (n integer)");
$db->exec("insert into ledger values (1)");
echo "saved\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: open a database, create a table, insert with a prepared statement, read the value back.',
        lines: ['<?php', '$db = new PDO("sqlite::memory:");', '$db->exec("create table t(n integer)");', '$stmt = $db->prepare("insert into t values (?)");', '$stmt->execute([42]);', '$value = $db->query("select n from t")->fetchColumn();', 'echo $value, "\\n";'],
        output: '42\n',
      },
      {
        t: 'quiz',
        question: 'Why use `?` placeholders instead of putting the value into the SQL text?',
        options: ['The value is sent separately, so it can never be read as SQL', 'Placeholders run faster than numbers', 'SQL does not allow quotes', 'It makes the table smaller'],
        answer: 0,
        explain: 'With placeholders the database receives the SQL shape and the data separately. A name like O\'Neil or x\' OR \'1\'=\'1 stays plain data.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table c(name text)");
$name = "O'Neil";
$db->query("select * from c where name = '" . $name . "'");`, why: 'The apostrophe in O\'Neil ends the SQL text early and the rest is a syntax error (a PDOException). Worse, a clever visitor could use the same gap to run his own SQL. Always use placeholders.', right: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table c(name text)");
$stmt = $db->prepare("select * from c where name = ?");
$stmt->execute(["O'Neil"]);
echo count($stmt->fetchAll()), " rows";` },
          { wrong: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table c(name text)");
$stmt = $db->prepare("select * from ?");
$stmt->execute(["c"]);`, why: 'Placeholders stand for **values**, not for table or column names, so the database cannot even read this statement. If a table name must vary, choose it from a fixed list in your own code.', right: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table c(name text)");
$stmt = $db->prepare("select * from c where name = ?");
$stmt->execute(["x"]);
echo count($stmt->fetchAll()), " rows";` },
          { wrong: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table c(name text, town text)");
$stmt = $db->prepare("insert into c values (?, ?)");
$stmt->execute(["Amina"]);
echo $db->query("select count(*) from c where town is null")->fetchColumn(), " row without a town";`, why: 'Two placeholders but only one value, and SQLite does not complain: the missing value is stored as NULL, so you get a row with no town. Count your placeholders and your values.', right: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table c(name text, town text)");
$stmt = $db->prepare("insert into c values (?, ?)");
$stmt->execute(["Amina", "Mukono"]);
echo $db->query("select count(*) from c where town is null")->fetchColumn(), " rows without a town";`, logic: true },
          { wrong: php`<?php
$db = new PDO("sqlite::memory:");
echo count($db->query("select 1 as a")->fetchAll()[0]);`, why: 'It prints 2, not 1. Without a fetch mode each row holds every column twice: by name and by number. Set PDO::FETCH_ASSOC as the default, or pass it to fetchAll.', right: php`<?php
$db = new PDO("sqlite::memory:");
echo count($db->query("select 1 as a")->fetchAll(PDO::FETCH_ASSOC)[0]);`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`new PDO("sqlite::memory:")`, then set `ERRMODE_EXCEPTION` and `FETCH_ASSOC`. `exec` for changes, `query` for plain selects, `prepare` + `execute` for anything with outside data.',
          'Placeholders (`?` or `:name`) are for values only. Never glue input into SQL.',
          '`fetch`, `fetchAll`, `fetchColumn`; let the database `sum`, `count` and `group by`.',
          'A transaction (`beginTransaction`, `commit`, `rollBack`) makes several changes all-or-nothing. Undo, then rethrow.',
          'Put SQL in a repository class so the rest of the program does not know SQL.',
        ],
        memory: 'prepare, execute, fetch. Placeholders for values. Transaction = all or nothing.',
      },
    ],
    exercises: [
      {
        id: 'php29-ledger',
        title: 'Booth ledger in a database',
        prompt: 'Keep a table `tx (name, kind, amount)` in an in-memory SQLite database. Commands: `deposit name amount` and `withdraw name amount` insert a row (no output); `report` prints each customer’s balance (deposits minus withdrawals), ordered by name, as `Amina: UGX 30,000`, or `No transactions` when the table is empty. Use prepared statements and let SQL do the sum.',
        starter: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$db->exec("create table tx (id integer primary key autoincrement, name text not null, kind text not null, amount integer not null)");

while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['deposit Amina 50000', 'deposit Brian 20000', 'withdraw Amina 20000', 'report']),
        tests: [
          { input: lines(['deposit Amina 50000', 'deposit Brian 20000', 'withdraw Amina 20000', 'report']), expected: ledger29(['deposit Amina 50000', 'deposit Brian 20000', 'withdraw Amina 20000', 'report']) },
          { input: lines(['report']), expected: 'No transactions', hidden: true, name: 'Empty ledger' },
          { input: lines(['deposit Zed 1000', 'report', 'deposit Abe 5000', 'withdraw Zed 400', 'report']), expected: ledger29(['deposit Zed 1000', 'report', 'deposit Abe 5000', 'withdraw Zed 400', 'report']), hidden: true, name: 'Report twice, sorted by name' },
        ],
        hints: [
          'insert: $stmt = $db->prepare("insert into tx (name, kind, amount) values (?, ?, ?)"); $stmt->execute([$name, $kind, (int) $amount]);',
          'select name, sum(case kind when \'deposit\' then amount else -amount end) as balance from tx group by name order by name',
          'foreach over the rows and print $row["name"], ": UGX ", number_format($row["balance"]). If there are no rows print "No transactions".',
        ],
      },
      {
        id: 'php29-transfer',
        title: 'Safe transfers',
        prompt: 'Table `acct (name primary key, balance)` with a rule `check (balance >= 0)`. Commands: `open name amount` prints `Opened name`; `balances` prints `name 30,000` for each account ordered by name; `transfer from to amount` moves money **atomically** (credit first, then debit, inside a transaction) and prints `Transferred UGX 20,000 from amina to brian`. Print `Transfer refused` and change nothing when the amount is not above zero, either account does not exist (check `rowCount()`: an update that matches no row changes nothing, silently!) or the sender cannot afford it.',
        starter: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$db->exec("create table acct (name text primary key, balance integer not null check (balance >= 0))");

while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['open amina 50000', 'open brian 0', 'transfer amina brian 20000', 'transfer amina brian 40000', 'balances']),
        tests: [
          { input: lines(['open amina 50000', 'open brian 0', 'transfer amina brian 20000', 'transfer amina brian 40000', 'balances']), expected: transfer29(['open amina 50000', 'open brian 0', 'transfer amina brian 20000', 'transfer amina brian 40000', 'balances']) },
          { input: lines(['open amina 1000', 'transfer amina ghost 500', 'transfer ghost amina 500', 'transfer amina amina2 0', 'balances']), expected: transfer29(['open amina 1000', 'transfer amina ghost 500', 'transfer ghost amina 500', 'transfer amina amina2 0', 'balances']), hidden: true, name: 'Unknown accounts and zero amounts' },
          { input: lines(['open dan 300', 'open eve 700', 'transfer eve dan 700', 'transfer dan eve 1', 'transfer eve dan 0', 'balances']), expected: transfer29(['open dan 300', 'open eve 700', 'transfer eve dan 700', 'transfer dan eve 1', 'transfer eve dan 0', 'balances']), hidden: true, name: 'Draining an account to zero' },
        ],
        hints: [
          'Write transfer(PDO $db, string $from, string $to, int $amount): void. Throw an exception when $amount <= 0. Then beginTransaction().',
          'Inside try: credit $to, throw if rowCount() !== 1, debit $from, throw if rowCount() !== 1, then commit(). In catch (Throwable $e): rollBack() and throw $e again.',
          'In the main loop wrap the call in try { ...; echo "Transferred UGX ..."; } catch (Throwable) { echo "Transfer refused\\n"; }',
        ],
      },
      {
        id: 'php29-safe-search',
        title: 'Search without injection',
        prompt: 'The starter searches the customers table by gluing the term into the SQL, so the search `x\' OR \'1\'=\'1` returns everybody and a name like `O\'Neil` crashes it. Make it safe with a prepared statement. A customer matches when the term is part of the name **or** the town (any letter case). For each input line (the whole line is the term) print `term -> Amina Nakato, Grace Namukasa` (names ordered, joined with `, `) or `term -> No match`.',
        starter: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table customers (name text, town text)");
$db->exec("insert into customers values ('Amina Nakato','Mukono'),('Brian Ssali','Kampala'),('Grace Namukasa','Mukono'),('Dan Okello','Jinja')");

while (($line = fgets(STDIN)) !== false) {
    $term = trim($line);
    if ($term === "") {
        continue;
    }
    $sql = "select name from customers where name like '%" . $term . "%' or town like '%" . $term . "%' order by name";
    $names = $db->query($sql)->fetchAll(PDO::FETCH_COLUMN);
    echo $term, " -> ", $names === [] ? "No match" : implode(", ", $names), "\n";
}
`,
        usesInput: true,
        sampleInput: lines(['mukono', "x' OR '1'='1", 'brian']),
        tests: [
          { input: lines(['mukono', "x' OR '1'='1", 'brian']), expected: search29(['mukono', "x' OR '1'='1", 'brian']) },
          { input: lines(["O'Neil", 'JINJA', 'zzz']), expected: search29(["O'Neil", 'JINJA', 'zzz']), hidden: true, name: 'An apostrophe and capitals' },
          { input: lines(['an', "'; drop table customers; --"]), expected: search29(['an', "'; drop table customers; --"]), hidden: true, name: 'A destructive attempt' },
        ],
        hints: [
          '$stmt = $db->prepare("select name from customers where name like ? or town like ? order by name");',
          'The wildcards go in the **value**, not in the SQL: $like = "%" . $term . "%"; $stmt->execute([$like, $like]);',
          '$names = $stmt->fetchAll(PDO::FETCH_COLUMN); then print as before.',
        ],
      },
    ],
  },

  // ================================================================== 30
  {
    id: 'php-api',
    level: LEVEL,
    minutes: 38,
    title: 'Building a JSON API',
    summary: 'Routes, JSON bodies, status codes and clear error responses: the booth as a web service',
    blocks: [
      {
        t: 'story',
        title: 'The phone app',
        text: "Nambi's nephew is building a phone app for the booth. The app does not want web pages; it wants **data**. So Nambi's PHP becomes an **API** (Application Programming Interface): the app sends `POST /deposit {\"amount\": 50000}` and the server answers `201 {\"balance\": 50000}`. Same HTTP you met in lesson 25, with JSON in the body (lesson 28), and your Wallet class from Level 4 doing the real work.\n\nThe trick that makes an API easy to build **and easy to test** is to keep the heart of it a plain function: `handle(request)` returns a response array. It never reads `$_SERVER` or prints. A tiny file on the real server would translate between the server and that function, and your tests (and this app) call it directly.",
      },
      { t: 'h', text: 'The shape of an API function' },
      {
        t: 'try',
        code: php`<?php
function reply(int $status, array $body, array $headers = []): array {
    return ["status" => $status, "headers" => $headers, "body" => json_encode($body)];
}

function handle(string $method, string $path): array {
    return match (true) {
        $method === "GET" && $path === "/health" => reply(200, ["status" => "ok"]),
        $path === "/health" => reply(405, ["error" => "Method not allowed"], ["Allow" => "GET"]),
        default => reply(404, ["error" => "Not found"]),
    };
}

foreach ([["GET", "/health"], ["POST", "/health"], ["GET", "/loans"]] as [$method, $path]) {
    $r = handle($method, $path);
    echo $r["status"], " ", $r["body"], "\n";
}
`,
        output: out('200 {"status":"ok"}', '405 {"error":"Method not allowed"}', '404 {"error":"Not found"}'),
      },
      { t: 'p', text: 'On a real server, the one small file that connects the world to your function would look like this (shown, not run):' },
      {
        t: 'code',
        text: `<?php
// public/index.php on a real server (this block is only shown, not run)
require __DIR__ . "/../src/api.php";

$response = handle(
    $wallet,
    $_SERVER["REQUEST_METHOD"],
    parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH),
    file_get_contents("php://input")     // the raw JSON body
);

http_response_code($response["status"]);
header("Content-Type: application/json");
foreach ($response["headers"] as $name => $value) {
    header($name . ": " . $value);
}
echo $response["body"];`,
      },
      { t: 'h', text: 'The wallet API' },
      { t: 'p', text: 'Now the real thing. Every Wallet rule from Level 4 is reused unchanged; the API only translates **requests into method calls** and **exceptions into status codes**. The `Wallet`, its exceptions and `Transaction` are the classes you wrote in Level 4. Read the `catch` blocks at the bottom: they are the whole error policy of the API.' },
      {
        t: 'list',
        items: [
          '**404** unknown path; **405** known path, wrong method (with an `Allow` header saying which method works).',
          '**400** the body is not valid JSON (the sender made a basic mistake).',
          '**422** the JSON is fine but the **data** is not: a missing or wrong-type amount, or an amount that is not above zero (`InvalidAmountException`).',
          '**409** the request clashes with the current state: not enough money (`InsufficientFundsException`).',
          '**201** when something was created (a deposit), **200** for a normal success.',
        ],
      },
      {
        t: 'project',
        title: 'The wallet API',
        stdin: lines(API_DEMO),
        code: WALLET_LIB + apiCode(true) + API_MAIN,
        output: apiSession(API_DEMO),
      },
      {
        t: 'list',
        items: [
          '**Consistent errors.** Every error has the same shape: `{"error": "..."}` (plus helpful fields like `missing`). The phone app can show `error` to the customer without special cases.',
          '**Never leak internals.** The message “Short by UGX 5,000” is for customers. A database error text or a file path is for your log, not for the response (answer `500 {"error":"Server error"}` and log the detail).',
          '**GET never changes anything.** Deposit and withdraw are POST. A GET can be repeated, cached or triggered by a link, so it must be safe.',
          '**Validate the type.** JSON `"50"` (text) and `50` (number) differ; `is_int` catches the wrong one.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
echo json_encode(["ok" => true, "items" => []]);
`,
        question: 'What does this program print?',
        options: ['{"ok":true,"items":[]}', '{"ok":true,"items":{}}', '{"ok":1,"items":null}', '["ok",[]]'],
        answer: 0,
        explain: 'true stays true, and an empty PHP array becomes an empty JSON list [].',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the keyword that picks a status from the method.',
        template: php`<?php
$method = "POST";
$status = ___ ($method) {
    "GET" => 200,
    "POST" => 201,
};
echo $status, "\n";
`,
        blanks: [{ options: ['match', 'switch', 'if'], answer: 'match' }],
        output: '201\n',
      },
      {
        t: 'bug',
        code: php`<?php
$method = "DELETE";
echo match ($method) {
    "GET" => 200,
    "POST" => 201,
}, "\n";
`,
        question: 'This program stops with “UnhandledMatchError”. What is missing?',
        options: ['A default arm for every method that is not listed', 'A semicolon after each arm', 'The word break', 'Quotes around the numbers'],
        answer: 0,
        explain: 'match is strict: a value with no arm is an error. A router needs a default arm (here 405) so that unexpected methods get an answer instead of a crash.',
        fixed: php`<?php
$method = "DELETE";
echo match ($method) {
    "GET" => 200,
    "POST" => 201,
    default => 405,
}, "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: define a reply function, then build and print a response.',
        lines: ['<?php', 'function reply(int $status, array $body): string {', '    return $status . " " . json_encode($body);', '}', '$balance = 50000;', '$text = reply(200, ["balance" => $balance]);', 'echo $text, "\\n";'],
        output: '200 {"balance":50000}\n',
      },
      {
        t: 'quiz',
        question: 'A customer tries to withdraw more than the balance. Which status fits best in our API?',
        options: ['409 Conflict: the request clashes with the current balance', '200 OK with an error message inside', '404 Not Found', '500 Internal Server Error'],
        answer: 0,
        explain: 'The request was well-formed and the data was valid, but it cannot be done in the current state. 200 would tell the app “success”, 404 is for unknown paths, and 500 means our program failed, which it did not.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$data = json_decode('{"amount":"5000"}', true);
var_dump(is_int($data["amount"]));`, why: 'It prints bool(false): the JSON holds the text "5000" in quotes, not the number 5000. An API must decide: reject it (422) or convert it on purpose. Never assume the type.', right: php`<?php
$data = json_decode('{"amount":"5000"}', true);
echo is_int($data["amount"]) ? "ok" : "422 amount must be a number";`, logic: true },
          { wrong: php`<?php
function reply(int $status): array {
    echo $status;
}
reply(200);`, why: 'The function promises an array but returns nothing, so PHP stops with a TypeError. Build and return the response array; let the caller print.', right: php`<?php
function reply(int $status): array {
    return ["status" => $status];
}
echo reply(200)["status"];` },
          { wrong: php`<?php
echo json_encode(["name" => "Ssali / Sons"]);`, why: 'It prints {"name":"Ssali \\/ Sons"}: JSON escapes the slash by default. Any JSON reader understands it, but if you want it plain, add JSON_UNESCAPED_SLASHES.', right: php`<?php
echo json_encode(["name" => "Ssali / Sons"], JSON_UNESCAPED_SLASHES);`, logic: true },
          { wrong: php`<?php
var_dump(json_decode("{'a':1}", true));`, why: 'It prints NULL: JSON requires double quotes, so single quotes make the text invalid, and without JSON_THROW_ON_ERROR the failure is silent. Decode with the flag and answer 400.', right: php`<?php
var_dump(json_decode('{"a":1}', true));`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'Keep the API a plain function `handle(request) → response array` (status, headers, body). A tiny `index.php` connects it to a real server.',
          'Status codes: 200/201 success, 400 broken JSON, 404 unknown path, 405 wrong method (+ `Allow`), 409 clash with current state, 422 invalid data, 500 our fault.',
          'Turn exceptions into responses in one place (`catch` blocks). Every error has the same JSON shape and never leaks internals.',
          'GET reads, POST changes. Validate the JSON **type** of every field.',
        ],
        memory: 'handle() returns status + body. 400 bad JSON, 422 bad data, 409 clash.',
      },
    ],
    exercises: [
      {
        id: 'php30-services-api',
        title: 'Small API: health and services',
        prompt: 'Write `reply(int $status, array $body, array $headers = []): array` and a router. Each input line is `METHOD /path`. `GET /health` → `200 {"status":"ok"}`. `GET /services` → `200 {"services":["deposit","withdraw","send"]}`. Both paths with any other method → `405 {"error":"Method not allowed"}` followed by a line `  Allow: GET` (two spaces). Any other path → `404 {"error":"Not found"}`. Print `status body` for each request.',
        starter: php`<?php
function reply(int $status, array $body, array $headers = []): array {
    return ["status" => $status, "headers" => $headers, "body" => json_encode($body)];
}

while (($line = fgets(STDIN)) !== false) {
    [$method, $path] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['GET /health', 'GET /services', 'POST /services', 'GET /loans']),
        tests: [
          { input: lines(['GET /health', 'GET /services', 'POST /services', 'GET /loans']), expected: servicesApi(['GET /health', 'GET /services', 'POST /services', 'GET /loans']) },
          { input: lines(['DELETE /health', 'GET /']), expected: servicesApi(['DELETE /health', 'GET /']), hidden: true, name: 'Odd methods and paths' },
          { input: lines(['POST /health', 'GET /services', 'GET /services']), expected: servicesApi(['POST /health', 'GET /services', 'GET /services']), hidden: true, name: 'Repeated requests' },
        ],
        hints: [
          'Write handle(string $method, string $path): array that returns reply(...) arrays; use $paths = ["/health" => ..., "/services" => ...] to know which paths exist.',
          'Check the path first (404), then the method (405 with ["Allow" => "GET"]), then build the 200 body.',
          'Print $r["status"], " ", $r["body"], then a line "  Allow: GET" for each header: foreach ($r["headers"] as $name => $value) { echo "  ", $name, ": ", $value, "\\n"; }',
        ],
      },
      {
        id: 'php30-api-wallet',
        title: 'Finish the wallet API',
        prompt: 'The starter is the wallet API from the lesson with only `/balance` and `/deposit`. Add `POST /withdraw` (answers `200 {"balance":...,"fee":...}`; Wallet throws `InsufficientFundsException` for too little money, which already becomes a 409) and `GET /transactions` (answers `200 {"transactions":[{"kind":"deposit","amount":50000,"fee":0}]}`, kind taken from `$t->kind->value`). Add each route in **both** places: the `$known` table and the `match`.',
        starter: WALLET_LIB + apiCode(false) + API_MAIN,
        usesInput: true,
        sampleInput: lines(['POST /deposit {"amount":50000}', 'POST /withdraw {"amount":20000}', 'GET /transactions']),
        tests: [
          { input: lines(['POST /deposit {"amount":50000}', 'POST /withdraw {"amount":20000}', 'GET /transactions']), expected: apiSession(['POST /deposit {"amount":50000}', 'POST /withdraw {"amount":20000}', 'GET /transactions']) },
          { input: lines(API_DEMO), expected: apiSession(API_DEMO), hidden: true, name: 'The lesson session' },
          { input: lines(['GET /transactions', 'POST /transactions', 'GET /withdraw', 'POST /withdraw {"amount":0}', 'POST /withdraw']), expected: apiSession(['GET /transactions', 'POST /transactions', 'GET /withdraw', 'POST /withdraw {"amount":0}', 'POST /withdraw']), hidden: true, name: 'Wrong methods and bad bodies' },
          { input: lines(['POST /deposit {"amount":300000}', 'POST /withdraw {"amount":250000}', 'POST /withdraw {"amount":60000}', 'POST /withdraw {"amount":45000}', 'GET /transactions', 'GET /balance']), expected: apiSession(['POST /deposit {"amount":300000}', 'POST /withdraw {"amount":250000}', 'POST /withdraw {"amount":60000}', 'POST /withdraw {"amount":45000}', 'GET /transactions', 'GET /balance']), hidden: true, name: 'Fees and a refused withdrawal' },
        ],
        hints: [
          'In $known add "/withdraw" => "POST" and "/transactions" => "GET".',
          'In the match, /withdraw works like /deposit but calls $wallet->withdraw(readAmount($bodyText)), which returns the fee, and replies 200 with balance and fee.',
          '/transactions: reply(200, ["transactions" => array_map(fn(Transaction $t) => ["kind" => $t->kind->value, "amount" => $t->amount, "fee" => $t->fee], $wallet->history())])',
        ],
      },
      {
        id: 'php30-paginate',
        title: 'Pages of customers',
        prompt: 'There are 10 customers with ids 1 to 10. Each input line is a target like `/customers?page=2&per_page=3`. `page` (default 1) must be a whole number of at least 1, otherwise print `422 {"error":"Invalid page"}`. `per_page` (default 3) must be a whole number from 1 to 5, otherwise `422 {"error":"Invalid per_page"}` (check page first). Another path prints `404 {"error":"Not found"}`. A good request prints `200 {"page":2,"per_page":3,"total":10,"items":[4,5,6]}`. A page past the end has `"items":[]`.',
        starter: php`<?php
$ids = range(1, 10);
while (($line = fgets(STDIN)) !== false) {
    $parts = parse_url(trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['/customers?page=2&per_page=3', '/customers', '/customers?page=abc', '/loans']),
        tests: [
          { input: lines(['/customers?page=2&per_page=3', '/customers', '/customers?page=abc', '/loans']), expected: paginate30(['/customers?page=2&per_page=3', '/customers', '/customers?page=abc', '/loans']) },
          { input: lines(['/customers?page=4', '/customers?page=5&per_page=2', '/customers?per_page=9', '/customers?page=0']), expected: paginate30(['/customers?page=4', '/customers?page=5&per_page=2', '/customers?per_page=9', '/customers?page=0']), hidden: true, name: 'Edges of the range' },
          { input: lines(['/customers?page=x&per_page=x', '/customers?page=2&per_page=5', '/customers?page=1&per_page=1', '/customers?page=99']), expected: paginate30(['/customers?page=x&per_page=x', '/customers?page=2&per_page=5', '/customers?page=1&per_page=1', '/customers?page=99']), hidden: true, name: 'Page checked first, and a page past the end' },
        ],
        hints: [
          'parse_url gives "path" and maybe "query"; parse_str($parts["query"] ?? "", $q) fills $q (it may stay empty).',
          'filter_var($q["page"] ?? "1", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]) gives the number or false; per_page uses min_range 1 and max_range 5 with default "3".',
          'array_slice($ids, ($page - 1) * $perPage, $perPage) gives the items. Build the body with json_encode(["page" => ..., "per_page" => ..., "total" => count($ids), "items" => $items]).',
        ],
      },
    ],
  },
];

// Used by tests/solutions-php.mjs
export const API_SOLUTION = () => WALLET_LIB + apiCode(true) + API_MAIN;
