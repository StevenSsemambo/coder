// PHP, Level 5 (part 3): lessons 31 to 33 (project structure and tests, a simulated Mobile Money collection, the capstone).
// Expected outputs are plain JavaScript, never produced by running the PHP.
// The HMAC signatures below were computed once with Node's crypto (HMAC-SHA256, secret "booth-secret").
import { php, out, money } from './shared.js';

const LEVEL = 'Level 5: Market-ready PHP';
const lines = (a) => a.join('\n') + '\n';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

// ---- lesson 31 models ----
const classPath = (cls) => (cls.startsWith('Booth\\') ? 'src/' + cls.slice('Booth\\'.length).replaceAll('\\', '/') + '.php' : 'not ours');
const feeOld = (a) => (a <= 50000 ? 1000 : a <= 200000 ? 2000 : 3500);
const testRun = (cases) => {
  let passed = 0;
  const res = cases.map((c) => {
    const [name, amount, expected] = c.split('|');
    const got = feeOld(Number(amount));
    if (got === Number(expected)) {
      passed++;
      return `ok - ${name}`;
    }
    return `FAIL - ${name} (expected ${Number(expected)}, got ${got})`;
  });
  return out(...res, `${passed} passed, ${cases.length - passed} failed`);
};

// ---- lesson 32 models ----
const SIG = {
  hello: 'ce0f05ca79f0d2b62465688284547ce5fc71285e45867df2bb2a1cb478739ecb',
  r1ok: 'a67891a3bd67906d016aaa93e59101323f5a3e59689baba1fd6964a114238f54',
  r2failed: '519f9f9ed71314105705893ab8c363e26f13083cebcd7c17aebadae22af30404',
  r2ok: '7934051c09880ffb66b8ebc3a755d46c4821adc1dc5d731cfcad9acab976f8bf',
};
const BODY = {
  r1ok: '{"ref":"r1","status":"SUCCESSFUL"}',
  r1failed: '{"ref":"r1","status":"FAILED"}',
  r2failed: '{"ref":"r2","status":"FAILED"}',
  r2ok: '{"ref":"r2","status":"SUCCESSFUL"}',
};
const HOOK_SIGS = { 'r1:SUCCESSFUL': SIG.r1ok, 'r2:FAILED': SIG.r2failed, 'r2:SUCCESSFUL': SIG.r2ok };
const momoModel = (cmds) => {
  const payments = new Map();
  let balance = 0;
  const res = [];
  const webhook = (ref, status) => {
    const p = payments.get(ref);
    if (!p) return `Unknown reference ${ref}`;
    if (!['PENDING', 'SUCCESSFUL', 'FAILED'].includes(status)) return `Invalid status ${status}`;
    if (!(p.status === 'PENDING' && status !== 'PENDING')) return `Ignored ${ref} (already ${p.status})`;
    p.status = status;
    if (status === 'SUCCESSFUL') {
      balance += p.amount;
      return `Credited UGX ${money(p.amount)} for ${ref}`;
    }
    return `Failed ${ref}`;
  };
  for (const c of cmds) {
    const w = c.split(' ');
    if (w[0] === 'pay') {
      if (payments.has(w[1])) res.push(`Already requested ${w[1]} (${payments.get(w[1]).status})`);
      else {
        payments.set(w[1], { phone: w[2], amount: Number(w[3]), status: 'PENDING' });
        res.push(`Requested ${w[1]}: UGX ${money(Number(w[3]))} from ${w[2]} (PENDING)`);
      }
    } else if (w[0] === 'webhook') res.push(webhook(w[1], w[2]));
    else if (w[0] === 'hook') {
      if (HOOK_SIGS[`${w[2]}:${w[3]}`] !== w[1]) res.push('Rejected: bad signature');
      else res.push(webhook(w[2], w[3]));
    } else if (w[0] === 'balance') res.push(`Balance: UGX ${money(balance)}`);
  }
  return out(...res);
};
const transitions = (pairs) =>
  out(
    ...pairs.map((p) => {
      const [a, b] = p.split(' ');
      const ok = ['PENDING', 'SUCCESSFUL', 'FAILED'];
      if (!ok.includes(a) || !ok.includes(b)) return 'unknown status';
      return `${a} -> ${b}: ${a === 'PENDING' && b !== 'PENDING' ? 'allowed' : 'not allowed'}`;
    })
  );
const sigCheck = (ls) => out(...ls.map((l) => { const i = l.indexOf(' '); const sig = l.slice(0, i); const body = l.slice(i + 1); const found = Object.entries(BODY).find(([, b]) => b === body); return found && SIG[found[0]] === sig ? 'valid' : 'invalid'; }));

// ---- lesson 33 model ----
const WH = {
  w1: ['{"ref":"w1","name":"Amina","amount":50000}', '01c44737993d719d4b54f60e2fe242b16b0b1cc18c2d9879a008d4147bad4ec1'],
  bx: ['{"ref":"<b>x</b>","name":"Amina","amount":20000}', '9021962f15de06b94ed685950b9df98b74061e546225519b0634b34bae2b4f12'],
  w3: ['{"ref":"w3","name":"Ghost","amount":1000}', '942b126d319ff28de0c22f88e41172d1527ec2adc57505239647ed472e96070e'],
  w4: ['{"ref":"w4","name":"Brian","amount":30000}', 'e7fec875c5124604516060cdf8ee074abf9a91545db5839ec8889c09076092a1'],
};
const whLine = (k) => `POST /webhook ${WH[k][1]} ${WH[k][0]}`;
const WH_BY_BODY = Object.fromEntries(Object.values(WH));

const boothModel = (input, o = {}) => {
  const feeFor = o.fees === 'new' ? (a) => (a <= 20000 ? 500 : a <= 100000 ? 1500 : 3000) : (a) => (a <= 50000 ? 1000 : a <= 200000 ? 2000 : 3500);
  const escRef = o.escape === false ? (s) => s : esc;
  const accounts = new Map();
  const txs = [];
  const res = [];
  const known = { '/accounts': 'POST', '/deposit': 'POST', '/withdraw': 'POST', '/webhook': 'POST', '/balance': 'GET', '/statement': 'GET' };
  if (o.transactions) known['/transactions'] = 'GET';
  const fail = (status, error, extra = {}) => {
    throw { status, body: { error, ...extra } };
  };
  const bodyOf = (text) => {
    let d;
    try {
      d = JSON.parse(text);
    } catch {
      fail(400, 'Invalid JSON');
    }
    if (typeof d !== 'object' || d === null) fail(400, 'Invalid JSON');
    return d;
  };
  const nameOf = (d) => {
    if (typeof d.name !== 'string' || !/^[A-Za-z]{2,20}$/.test(d.name)) fail(422, 'Name must be 2 to 20 letters');
    return d.name;
  };
  const amountOf = (d) => {
    if (typeof d.amount !== 'number' || !Number.isInteger(d.amount)) fail(422, 'Amount must be a whole number');
    return d.amount;
  };
  const balanceOf = (name) => {
    if (!accounts.has(name)) fail(404, 'Unknown account');
    return accounts.get(name);
  };
  const deposit = (name, amount, ref) => {
    if (amount <= 0) fail(422, 'Amount must be above zero');
    balanceOf(name);
    if (ref !== null && txs.some((t) => t.ref === ref)) return false;
    txs.push({ name, kind: 'deposit', amount, fee: 0, ref });
    accounts.set(name, accounts.get(name) + amount);
    return true;
  };
  const credit = (d) => {
    const name = nameOf(d);
    const amount = amountOf(d);
    const ref = d.ref === undefined || d.ref === null ? null : d.ref;
    if (ref !== null && typeof ref !== 'string') fail(422, 'ref must be text');
    const created = deposit(name, amount, ref);
    return [created ? 201 : 200, { status: created ? 'credited' : 'duplicate', balance: accounts.get(name) }];
  };
  const queryName = (q) => {
    const n = q.get('name');
    if (n === null || n === '') fail(422, 'Name is required');
    return n;
  };
  for (const line of input) {
    const [method, target, ...restParts] = line.split(' ');
    const rest = restParts.join(' ');
    const [path, qs = ''] = target.split('?');
    const q = new URLSearchParams(qs);
    let sig = '';
    let bodyText = rest;
    if (path === '/webhook') {
      const i = rest.indexOf(' ');
      sig = i < 0 ? rest : rest.slice(0, i);
      bodyText = i < 0 ? '' : rest.slice(i + 1);
    }
    let status;
    let body;
    let headers = {};
    try {
      if (!known[path]) fail(404, 'Not found');
      if (known[path] !== method) {
        headers = { Allow: known[path] };
        fail(405, 'Method not allowed');
      }
      if (path === '/accounts') {
        const name = nameOf(bodyOf(bodyText));
        if (accounts.has(name)) fail(409, 'Account exists');
        accounts.set(name, 0);
        [status, body] = [201, { name }];
      } else if (path === '/deposit') [status, body] = credit(bodyOf(bodyText));
      else if (path === '/withdraw') {
        const d = bodyOf(bodyText);
        const name = nameOf(d);
        const amount = amountOf(d);
        if (amount <= 0) fail(422, 'Amount must be above zero');
        const bal = balanceOf(name);
        const fee = feeFor(amount);
        const needed = amount + fee;
        if (needed > bal) fail(409, `Short by UGX ${money(needed - bal)}`, { missing: needed - bal });
        txs.push({ name, kind: 'withdraw', amount, fee, ref: null });
        accounts.set(name, bal - needed);
        [status, body] = [200, { balance: accounts.get(name), fee }];
      } else if (path === '/webhook') {
        if (WH_BY_BODY[bodyText] === undefined || WH_BY_BODY[bodyText] !== sig) fail(401, 'Bad signature');
        const d = bodyOf(bodyText);
        if (typeof d.ref !== 'string' || d.ref === '') fail(422, 'ref is required');
        [status, body] = credit(d);
      } else if (path === '/balance') {
        const name = queryName(q);
        [status, body] = [200, { name, balance: balanceOf(name) }];
      } else if (path === '/statement') {
        const name = queryName(q);
        balanceOf(name);
        let html = `<h1>Statement for ${esc(name)}</h1>\n<ul>\n`;
        for (const t of txs.filter((x) => x.name === name)) {
          let l = `${t.kind} ${money(t.amount)}`;
          if (t.fee > 0) l += ` (fee ${money(t.fee)})`;
          if (t.ref !== null) l += ` ref ${escRef(t.ref)}`;
          html += `<li>${l}</li>\n`;
        }
        html += '</ul>\n';
        res.push(`200 ${html.trimEnd()}`);
        res.push('  Content-Type: text/html');
        continue;
      } else if (path === '/transactions') {
        const name = queryName(q);
        const limitText = q.has('limit') ? q.get('limit') : '5';
        if (!/^-?\d+$/.test(limitText) || Number(limitText) < 1 || Number(limitText) > 50) fail(422, 'Invalid limit');
        balanceOf(name);
        const list = txs.filter((x) => x.name === name).reverse().slice(0, Number(limitText)).map((t) => ({ kind: t.kind, amount: t.amount, fee: t.fee }));
        [status, body] = [200, { name, transactions: list }];
      }
    } catch (e) {
      if (e && e.status) [status, body] = [e.status, e.body];
      else throw e;
    }
    res.push(`${status} ${JSON.stringify(body)}`);
    for (const [k, v] of Object.entries(headers)) res.push(`  ${k}: ${v}`);
  }
  return out(...res);
};

// ---- the capstone program, built from parts so lessons and exercises show the same code ----
const feeCode = (fees) =>
  fees === 'new'
    ? php`        if ($amount <= 20000) {
            return 500;
        }
        return $amount <= 100000 ? 1500 : 3000;`
    : php`        if ($amount <= 50000) {
            return 1000;
        }
        return $amount <= 200000 ? 2000 : 3500;`;

export const boothData = (o = {}) => php`<?php
declare(strict_types=1);

const WEBHOOK_SECRET = "booth-secret";

class UnknownAccountException extends RuntimeException {}
class DuplicateAccountException extends RuntimeException {}
class InvalidAmountException extends InvalidArgumentException {}

class InsufficientFundsException extends RuntimeException {
    public function __construct(public readonly int $missing) {
        parent::__construct("Short by UGX " . number_format($missing));
    }
}

final class Ledger {
    public function __construct(private PDO $db) {
        $this->db->exec("create table accounts (name text primary key, balance integer not null check (balance >= 0))");
        $this->db->exec("create table tx (id integer primary key autoincrement, name text not null, kind text not null, amount integer not null, fee integer not null default 0, ref text unique)");
    }

    public function open(string $name): void {
        $stmt = $this->db->prepare("insert or ignore into accounts (name, balance) values (?, 0)");
        $stmt->execute([$name]);
        if ($stmt->rowCount() !== 1) {
            throw new DuplicateAccountException("Account exists");
        }
    }

    public function balance(string $name): int {
        $stmt = $this->db->prepare("select balance from accounts where name = ?");
        $stmt->execute([$name]);
        $balance = $stmt->fetchColumn();
        if ($balance === false) {
            throw new UnknownAccountException("Unknown account");
        }
        return (int) $balance;
    }

    /** Returns false when this reference was already processed (the deposit is NOT made twice). */
    public function deposit(string $name, int $amount, ?string $ref = null): bool {
        if ($amount <= 0) {
            throw new InvalidAmountException("Amount must be above zero");
        }
        $this->balance($name);
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("insert or ignore into tx (name, kind, amount, ref) values (?, 'deposit', ?, ?)");
            $stmt->execute([$name, $amount, $ref]);
            if ($stmt->rowCount() !== 1) {
                $this->db->rollBack();
                return false;
            }
            $this->db->prepare("update accounts set balance = balance + ? where name = ?")->execute([$amount, $name]);
            $this->db->commit();
            return true;
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /** Returns the fee. */
    public function withdraw(string $name, int $amount): int {
        if ($amount <= 0) {
            throw new InvalidAmountException("Amount must be above zero");
        }
        $balance = $this->balance($name);
        $fee = self::feeFor($amount);
        $needed = $amount + $fee;
        if ($needed > $balance) {
            throw new InsufficientFundsException($needed - $balance);
        }
        $this->db->beginTransaction();
        try {
            $this->db->prepare("insert into tx (name, kind, amount, fee) values (?, 'withdraw', ?, ?)")->execute([$name, $amount, $fee]);
            $this->db->prepare("update accounts set balance = balance - ? where name = ?")->execute([$needed, $name]);
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
        return $fee;
    }

    public function history(string $name): array {
        $stmt = $this->db->prepare("select kind, amount, fee, ref from tx where name = ? order by id");
        $stmt->execute([$name]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private static function feeFor(int $amount): int {
${feeCode(o.fees)}
    }
}
`;

export const boothHttp = (o = {}) => {
  const transactions = o.transactions !== false;
  const escape = o.escape !== false;
  return php`
function reply(int $status, array $body, array $headers = []): array {
    return ["status" => $status, "headers" => $headers, "body" => json_encode($body)];
}

function e(string $text): string {
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

function bodyOf(string $text): array {
    $data = json_decode($text, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($data)) {
        throw new JsonException("Body must be a JSON object");
    }
    return $data;
}

function nameOf(array $data): string {
    $name = $data["name"] ?? null;
    if (!is_string($name) || preg_match('/^[A-Za-z]{2,20}$/', $name) !== 1) {
        throw new InvalidArgumentException("Name must be 2 to 20 letters");
    }
    return $name;
}

function amountOf(array $data): int {
    $amount = $data["amount"] ?? null;
    if (!is_int($amount)) {
        throw new InvalidAmountException("Amount must be a whole number");
    }
    return $amount;
}

function queryName(array $query): string {
    $name = $query["name"] ?? null;
    if (!is_string($name) || $name === "") {
        throw new InvalidArgumentException("Name is required");
    }
    return $name;
}

function openAccount(Ledger $ledger, string $bodyText): array {
    $name = nameOf(bodyOf($bodyText));
    $ledger->open($name);
    return reply(201, ["name" => $name]);
}

function credit(Ledger $ledger, array $data): array {
    $name = nameOf($data);
    $amount = amountOf($data);
    $ref = $data["ref"] ?? null;
    if ($ref !== null && !is_string($ref)) {
        throw new InvalidArgumentException("ref must be text");
    }
    $created = $ledger->deposit($name, $amount, $ref);
    return reply($created ? 201 : 200, ["status" => $created ? "credited" : "duplicate", "balance" => $ledger->balance($name)]);
}

function withdrawFrom(Ledger $ledger, string $bodyText): array {
    $data = bodyOf($bodyText);
    $name = nameOf($data);
    $fee = $ledger->withdraw($name, amountOf($data));
    return reply(200, ["balance" => $ledger->balance($name), "fee" => $fee]);
}

function receiveWebhook(Ledger $ledger, array $headers, string $bodyText): array {
    $expected = hash_hmac("sha256", $bodyText, WEBHOOK_SECRET);
    if (!hash_equals($expected, $headers["X-Signature"] ?? "")) {
        return reply(401, ["error" => "Bad signature"]);
    }
    $data = bodyOf($bodyText);
    if (!is_string($data["ref"] ?? null) || $data["ref"] === "") {
        throw new InvalidArgumentException("ref is required");
    }
    return credit($ledger, $data);
}

function showBalance(Ledger $ledger, array $query): array {
    $name = queryName($query);
    return reply(200, ["name" => $name, "balance" => $ledger->balance($name)]);
}

function statement(Ledger $ledger, array $query): array {
    $name = queryName($query);
    $ledger->balance($name);
    $html = "<h1>Statement for " . e($name) . "</h1>\n<ul>\n";
    foreach ($ledger->history($name) as $row) {
        $line = $row["kind"] . " " . number_format($row["amount"]);
        if ($row["fee"] > 0) {
            $line .= " (fee " . number_format($row["fee"]) . ")";
        }
        if ($row["ref"] !== null) {
            $line .= " ref " . ${escape ? 'e($row["ref"])' : '$row["ref"]'};
        }
        $html .= "<li>" . $line . "</li>\n";
    }
    $html .= "</ul>\n";
    return ["status" => 200, "headers" => ["Content-Type" => "text/html"], "body" => $html];
}
${transactions ? php`
function transactions(Ledger $ledger, array $query): array {
    $name = queryName($query);
    $limit = filter_var($query["limit"] ?? "5", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 50]]);
    if ($limit === false) {
        throw new InvalidArgumentException("Invalid limit");
    }
    $ledger->balance($name);
    $latest = array_slice(array_reverse($ledger->history($name)), 0, $limit);
    $list = array_map(fn(array $r) => ["kind" => $r["kind"], "amount" => $r["amount"], "fee" => $r["fee"]], $latest);
    return reply(200, ["name" => $name, "transactions" => $list]);
}
` : ''}
function handle(Ledger $ledger, string $method, string $path, array $query, array $headers, string $bodyText): array {
    $known = [
        "/accounts" => "POST",
        "/deposit" => "POST",
        "/withdraw" => "POST",
        "/webhook" => "POST",
        "/balance" => "GET",
        "/statement" => "GET",${transactions ? `
        "/transactions" => "GET",` : `
        // a new route goes here`}
    ];
    if (!isset($known[$path])) {
        return reply(404, ["error" => "Not found"]);
    }
    if ($known[$path] !== $method) {
        return reply(405, ["error" => "Method not allowed"], ["Allow" => $known[$path]]);
    }
    try {
        return match ($path) {
            "/accounts" => openAccount($ledger, $bodyText),
            "/deposit" => credit($ledger, bodyOf($bodyText)),
            "/withdraw" => withdrawFrom($ledger, $bodyText),
            "/webhook" => receiveWebhook($ledger, $headers, $bodyText),
            "/balance" => showBalance($ledger, $query),
            "/statement" => statement($ledger, $query),${transactions ? `
            "/transactions" => transactions($ledger, $query),` : `
            // and its arm goes here`}
            default => reply(500, ["error" => "Server error"]),
        };
    } catch (JsonException) {
        return reply(400, ["error" => "Invalid JSON"]);
    } catch (InvalidArgumentException $e) {
        return reply(422, ["error" => $e->getMessage()]);
    } catch (UnknownAccountException $e) {
        return reply(404, ["error" => $e->getMessage()]);
    } catch (DuplicateAccountException $e) {
        return reply(409, ["error" => $e->getMessage()]);
    } catch (InsufficientFundsException $e) {
        return reply(409, ["error" => $e->getMessage(), "missing" => $e->missing]);
    }
}
`;
};

export const BOOTH_MAIN = php`
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$ledger = new Ledger($db);

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$method, $target, $rest] = array_pad(explode(" ", $line, 3), 3, "");
    $parts = parse_url($target);
    $path = $parts["path"] ?? "";
    parse_str($parts["query"] ?? "", $query);
    $headers = [];
    $bodyText = $rest;
    if ($path === "/webhook") {
        [$signature, $bodyText] = array_pad(explode(" ", $rest, 2), 2, "");
        $headers["X-Signature"] = $signature;
    }
    $response = handle($ledger, $method, $path, $query, $headers, $bodyText);
    echo $response["status"], " ", rtrim($response["body"]), "\n";
    foreach ($response["headers"] as $name => $value) {
        echo "  ", $name, ": ", $value, "\n";
    }
}
`;
export const boothApp = (o = {}) => boothData(o) + boothHttp(o) + BOOTH_MAIN;

const CAPSTONE = [
  'POST /accounts {"name":"Amina"}',
  'POST /accounts {"name":"Amina"}',
  'POST /accounts {"name":"A1"}',
  'POST /accounts {"name":"Brian"}',
  'POST /deposit {"name":"Amina","amount":100000}',
  whLine('w1'),
  whLine('w1'),
  `POST /webhook ${WH.w1[1]} ${WH.w4[0]}`,
  whLine('bx'),
  whLine('w3'),
  'POST /withdraw {"name":"Amina","amount":30000}',
  'POST /withdraw {"name":"Brian","amount":500}',
  'POST /withdraw {oops',
  'GET /balance?name=Amina',
  'GET /statement?name=Amina',
  'GET /balance?name=Nobody',
  'DELETE /balance',
];
const SESSION_B = [
  'POST /accounts {"name":"Amina"}',
  'POST /deposit {"name":"Amina","amount":300000}',
  'POST /withdraw {"name":"Amina","amount":15000}',
  'POST /withdraw {"name":"Amina","amount":60000}',
  'POST /withdraw {"name":"Amina","amount":150000}',
  'POST /withdraw {"name":"Amina","amount":250000}',
  'GET /balance?name=Amina',
];
const SESSION_T = [
  'POST /accounts {"name":"Amina"}',
  'POST /deposit {"name":"Amina","amount":100000}',
  'POST /withdraw {"name":"Amina","amount":30000}',
  'POST /deposit {"name":"Amina","amount":5000,"ref":"x1"}',
  'POST /withdraw {"name":"Amina","amount":1000}',
  'GET /transactions?name=Amina&limit=2',
  'GET /transactions?name=Amina',
  'GET /transactions?name=Amina&limit=0',
  'GET /transactions?name=Amina&limit=abc',
  'GET /transactions?name=Ghost',
  'GET /transactions',
];
const SESSION_E = [
  'POST /accounts {"name":"Amina"}',
  whLine('bx'),
  whLine('w1'),
  'GET /statement?name=Amina',
];

export const level5c = [
  // ================================================================== 31
  {
    id: 'php-structure',
    level: LEVEL,
    minutes: 34,
    title: 'Structure, autoloading and tests',
    summary: 'Namespaces, autoloading, project layout, Composer in plain words, and a tiny test runner',
    blocks: [
      {
        t: 'story',
        title: 'One file, 900 lines',
        text: "Nambi's nephew joins the project. Both edit the same file `booth.php`, now 900 lines long. Twice his change overwrote yours. A function called `fee()` appears twice, once for Mobile Money and once for the shop, and PHP refuses to run: “Cannot redeclare fee()”.\n\nA program that will live for years needs **structure**: each class in its own file, names kept apart by **namespaces**, files loaded automatically by an **autoloader**, outside code managed by **Composer**, and **tests** that say loudly when a change breaks something. This lesson is the difference between a script and a project.",
      },
      { t: 'h', text: 'Namespaces: surnames for your classes' },
      { t: 'p', text: 'Two Amina Nakatos can live in one country if one is “Amina of Mukono” and the other “Amina of Jinja”. A **namespace** is that “of Mukono”. The full name of a class is its namespace plus its short name, and `use` lets you write the short name:' },
      {
        t: 'try',
        code: php`<?php
namespace Booth\Money {
    class Fee {
        public static function forAmount(int $amount): int {
            return $amount <= 50000 ? 1000 : 2000;
        }
    }
}

namespace Shop\Money {
    class Fee {
        public static function forAmount(int $amount): int {
            return 0;
        }
    }
}

namespace {
    use Booth\Money\Fee;

    echo Fee::class, "\n";
    echo Fee::forAmount(30000), "\n";
    echo \Shop\Money\Fee::forAmount(30000), "\n";
    echo strlen("Mukono"), "\n";
}
`,
        output: out('Booth\\Money\\Fee', '1000', '0', '6'),
      },
      {
        t: 'list',
        items: [
          'The two `Fee` classes do not clash: their full names are `Booth\\Money\\Fee` and `Shop\\Money\\Fee`.',
          '`use Booth\\Money\\Fee;` makes `Fee` mean that one in this file. A leading backslash (`\\Shop\\Money\\Fee`) writes the full name from the root.',
          'Inside a namespace, PHP looks for a class in **that namespace** first. Built-in classes need a backslash (`new \\DateTime`) or a `use DateTime;`. Built-in **functions** (`strlen`) work without one.',
          'Normally a file has **one** namespace, declared on its first line: `namespace Booth\\Money;`. The braces form above is only so one lesson file can show several.',
        ],
      },
      { t: 'h', text: 'Autoloading: PHP fetches the file for you' },
      { t: 'p', text: 'Without an autoloader you write `require "src/Money/Fee.php";` for every class, and forget one. An **autoloader** is a function PHP calls the first time it meets a class it does not know. The standard convention (called **PSR-4**) maps the namespace to folders: `Booth\\Money\\Fee` lives in `src/Money/Fee.php`. The block below creates that file, registers an autoloader, and shows when it runs:' },
      {
        t: 'try',
        code: php`<?php
mkdir("src/Money", 0777, true);
file_put_contents("src/Money/Fee.php", <<<'PHP'
<?php
declare(strict_types=1);

namespace Booth\Money;

final class Fee {
    public static function forAmount(int $amount): int {
        return $amount <= 50000 ? 1000 : 2000;
    }
}
PHP);

spl_autoload_register(function (string $class): void {
    $prefix = "Booth\\";
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $file = "src/" . str_replace("\\", "/", substr($class, strlen($prefix))) . ".php";
    echo "[autoload ", $class, "]\n";
    if (file_exists($file)) {
        require $file;
    }
});

use Booth\Money\Fee;

echo "before\n";
echo Fee::forAmount(30000), "\n";
echo Fee::forAmount(90000), "\n";
var_dump(class_exists("Booth\\Money\\Missing"));
`,
        output: out('before', '[autoload Booth\\Money\\Fee]', '1000', '2000', '[autoload Booth\\Money\\Missing]', 'bool(false)'),
      },
      { t: 'tip', text: 'Look at the order: “before” prints, and the autoloader runs only when `Fee` is first **used**, once. The second call does not load it again. The missing class made the autoloader run too, found no file and PHP answered `false`. This is why big applications start fast: only the classes a request really needs are loaded.' },
      { t: 'h', text: 'Composer, in plain words' },
      { t: 'p', text: '**Composer** is PHP’s package manager. Instead of copying other people’s code into your project, you name what you need in a file called `composer.json`, and Composer downloads it (and what *it* needs) into a folder `vendor/`, and writes a ready-made autoloader. Composer needs internet and a terminal, so it cannot run inside this app; you will use it on your own computer. This is what it looks like (shown, not run):' },
      {
        t: 'code',
        text: `// composer.json (your project's description)
{
    "name": "nambi/booth",
    "require": {
        "php": ">=8.2"
    },
    "autoload": {
        "psr-4": { "Booth\\\\": "src/" }
    }
}

// in a terminal, in the project folder:
//   composer install        download what composer.json (and composer.lock) ask for
//   composer require vlucas/phpdotenv    add one more package
//   composer dump-autoload  rebuild the autoloader after adding classes

// at the top of public/index.php:
require __DIR__ . "/../vendor/autoload.php";   // one line: every class loads itself`,
      },
      {
        t: 'list',
        items: [
          '`composer.lock` records the **exact** versions installed. Commit it, so every computer and the server run the same code.',
          'Do **not** commit the `vendor/` folder or your secrets. Add them to `.gitignore`.',
          'Before adding a package, ask: is it maintained, widely used, and worth the extra code you now depend on?',
        ],
      },
      { t: 'h', text: 'A project layout' },
      {
        t: 'code',
        text: `booth/
├── public/            the ONLY folder the web server shows to the world
│   └── index.php      the front door: builds the request, calls handle(), sends the response
├── src/               your classes, one per file, PSR-4 (Booth\\Money\\Fee -> src/Money/Fee.php)
├── tests/             tests that run without a browser
├── storage/           database file, logs (not public, not committed)
├── .env               secrets and settings for THIS computer (never committed)
├── composer.json
└── composer.lock`,
      },
      { t: 'p', text: 'Only `public/` is reachable from the internet, so a visitor can never ask for `.env` or `storage/booth.db`. Settings that change from computer to computer (database path, webhook secret) are read with `getenv("NAME")` instead of being typed into the code. In lesson 27 you saw why: code gets shared, secrets must not.' },
      { t: 'h', text: 'Tests: a safety net you can run in one second' },
      { t: 'p', text: 'Nambi changes a fee. Did she break the withdrawals? Checking by hand takes ten minutes and you will skip it. A **test** is a small program that calls your code with known inputs and compares the result with what you expect. Professionals use a tool called PHPUnit; the idea is the same as this tiny runner you can write in ten lines:' },
      {
        t: 'try',
        code: php`<?php
function fee(int $amount): int {
    return $amount <= 50000 ? 1000 : ($amount <= 200000 ? 2000 : 3500);
}

function check(string $name, mixed $expected, mixed $actual): bool {
    if ($expected === $actual) {
        echo "ok - ", $name, "\n";
        return true;
    }
    echo "FAIL - ", $name, " (expected ", var_export($expected, true), ", got ", var_export($actual, true), ")\n";
    return false;
}

$results = [
    check("small amount", 1000, fee(30000)),
    check("middle amount", 2000, fee(100000)),
    check("boundary 50,000", 1000, fee(50000)),
    check("big amount", 3000, fee(300000)),
];
$passed = count(array_filter($results));
echo $passed, " passed, ", count($results) - $passed, " failed\n";
`,
        output: out('ok - small amount', 'ok - middle amount', 'ok - boundary 50,000', 'FAIL - big amount (expected 3000, got 3500)', '3 passed, 1 failed'),
      },
      {
        t: 'list',
        items: [
          'Test the **edges**: exactly 50,000, one shilling above, zero, a negative, empty input. Bugs live on boundaries.',
          'Compare with `===`. With `==`, `"1" == "01"` passes a test that should fail.',
          'One failing line tells you **what** broke and **what you expected**. That is the whole value of a test.',
          'Write a test **when you find a bug**, so it can never come back unnoticed.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
namespace Booth\Money;

class Fee {}

echo Fee::class;
`,
        question: 'What does this program print?',
        options: ['Booth\\Money\\Fee', 'Fee', 'Booth/Money/Fee', '\\Fee'],
        answer: 0,
        explain: '`Fee::class` gives the **full** name: the namespace and the short name, separated by backslashes.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the keyword that brings a class from another namespace into this one.',
        template: php`<?php
namespace Booth\Money {
    class Fee {
        public static function of(): int {
            return 1000;
        }
    }
}

namespace App {
    ___ Booth\Money\Fee;
    echo Fee::of(), "\n";
}
`,
        blanks: [{ options: ['use', 'import', 'include'], answer: 'use' }],
        output: '1000\n',
      },
      {
        t: 'bug',
        code: php`<?php
namespace Booth\Money {
    class Fee {
        public static function of(): int {
            return 1000;
        }
    }
}

namespace App {
    echo Fee::of(), "\n";
}
`,
        question: 'This program stops with “Class "App\\Fee" not found”. What is wrong?',
        options: ['Inside namespace App, Fee means App\\Fee; it needs a use statement or the full name', 'The class must be written in capitals', 'static methods cannot be called', 'echo needs brackets'],
        answer: 0,
        explain: 'A short class name is searched **in the current namespace**. Add `use Booth\\Money\\Fee;` or write `\\Booth\\Money\\Fee::of()`.',
        fixed: php`<?php
namespace Booth\Money {
    class Fee {
        public static function of(): int {
            return 1000;
        }
    }
}

namespace App {
    use Booth\Money\Fee;

    echo Fee::of(), "\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: define a function, run one test of it, and print the verdict.',
        lines: ['<?php', 'function twice(int $n): int { return $n * 2; }', '$tests = 0;', '$tests++;', '$expected = 42;', '$result = twice(21);', 'echo $result === $expected ? "ok" : "FAIL", " (", $tests, " test)\\n";'],
        output: 'ok (1 test)\n',
      },
      {
        t: 'quiz',
        question: 'What does an autoloader do?',
        options: ['Loads a class’s file the first time the class is used', 'Loads every file in src/ when the program starts', 'Downloads packages from the internet', 'Runs the tests'],
        answer: 0,
        explain: 'PHP calls the autoloader only when it meets a class it does not know yet. Downloading packages is Composer’s job.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
namespace App;

echo (new DateTime("@0"))->format("Y");`, why: 'Inside namespace App, DateTime means App\\DateTime, which does not exist. Built-in classes need a leading backslash or a use statement.', right: php`<?php
namespace App;

echo (new \DateTime("@0"))->format("Y");` },
          { wrong: php`<?php
file_put_contents("helpers.php", '<?php function helper() { return 1; }');
require "helpers.php";
require "helpers.php";
echo helper();`, why: 'The second require loads the file again, so helper() is declared twice: “Cannot redeclare helper()”. Use require_once, or better, classes with an autoloader.', right: php`<?php
file_put_contents("helpers.php", '<?php function helper() { return 1; }');
require_once "helpers.php";
require_once "helpers.php";
echo helper();` },
          { wrong: php`<?php
echo "start\n";
namespace Booth;`, why: 'The namespace declaration must be the very first statement in the file (only declare() may come before it).', right: php`<?php
namespace Booth;

echo "start\n";` },
          { wrong: php`<?php
echo ("1" == "01") ? "same" : "different";`, why: 'It prints “same”. The loose == compares these texts as numbers. A test written with == would pass when it should fail; compare with ===.', right: php`<?php
echo ("1" === "01") ? "same" : "different";`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '**Namespaces** keep names apart: `namespace Booth\\Money;` on the first line, `use Booth\\Money\\Fee;` to use a class. Built-in classes need a leading backslash.',
          '**Autoloading (PSR-4):** one class per file, folder path = namespace; `spl_autoload_register` (or Composer’s `vendor/autoload.php`) loads files on first use.',
          '**Composer:** `composer.json` says what you need, `composer.lock` pins versions, `vendor/` is never committed. Only `public/` is shown to the world; secrets live in the environment.',
          '**Tests** call your code with known inputs and compare with `===`. Test the edges, and write a test for every bug you fix.',
        ],
        memory: 'Namespace = surname. Autoload = load on first use. Test the edges with ===.',
      },
    ],
    exercises: [
      {
        id: 'php31-autoload-path',
        title: 'Where does the class live?',
        prompt: 'Write `classToPath(string $class, string $prefix, string $baseDir): ?string` for a PSR-4 autoloader. If `$class` starts with `$prefix`, return `$baseDir` plus the rest of the class name with `\\` replaced by `/` plus `.php`; otherwise return `null`. The program uses prefix `Booth\\` and base `src/`. Read class names, one per line, and print the path or `not ours`.',
        starter: php`<?php
function classToPath(string $class, string $prefix, string $baseDir): ?string {
    // return the file path, or null when the class is not under the prefix
    return null;
}

while (($line = fgets(STDIN)) !== false) {
    $class = trim($line);
}
`,
        usesInput: true,
        sampleInput: lines(['Booth\\Money\\Fee', 'Other\\Thing', 'Booth\\Report\\Pdf\\Receipt']),
        tests: [
          { input: lines(['Booth\\Money\\Fee', 'Other\\Thing', 'Booth\\Report\\Pdf\\Receipt']), expected: out(...['Booth\\Money\\Fee', 'Other\\Thing', 'Booth\\Report\\Pdf\\Receipt'].map(classPath)) },
          { input: lines(['Booth\\Fee', 'BoothExtra\\Fee', 'Boot\\Fee']), expected: out(...['Booth\\Fee', 'BoothExtra\\Fee', 'Boot\\Fee'].map(classPath)), hidden: true, name: 'A prefix must match the whole first part' },
          { input: lines(['Booth\\A\\B\\C\\D']), expected: classPath('Booth\\A\\B\\C\\D'), hidden: true, name: 'Deep folders' },
        ],
        hints: [
          'str_starts_with($class, $prefix) tells you whether the class is under the prefix. The prefix `Booth\\` ends with a backslash, so `BoothExtra\\Fee` does not match.',
          'substr($class, strlen($prefix)) is the rest of the name. str_replace("\\\\", "/", $rest) turns backslashes into slashes.',
          'Return $baseDir . $rest . ".php", or null when the class does not start with the prefix. In the loop print the path, or "not ours" for null (use ?? ).',
        ],
      },
      {
        id: 'php31-test-runner',
        title: 'A tiny test runner',
        prompt: 'The starter has the `fee()` function of the booth (1,000 up to 50,000; 2,000 up to 200,000; 3,500 above). Write `check(string $name, int $expected, int $actual): bool` that prints `ok - name` or `FAIL - name (expected 2000, got 3500)` and returns whether it passed. Each input line is a test case `name|amount|expectedFee`: run `check` for it, then print the summary `2 passed, 1 failed`.',
        starter: php`<?php
function fee(int $amount): int {
    return $amount <= 50000 ? 1000 : ($amount <= 200000 ? 2000 : 3500);
}

$results = [];
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$name, $amount, $expected] = explode("|", $line);
}
`,
        usesInput: true,
        sampleInput: lines(['small|30000|1000', 'big|300000|3500', 'wrong|300000|2000']),
        tests: [
          { input: lines(['small|30000|1000', 'big|300000|3500', 'wrong|300000|2000']), expected: testRun(['small|30000|1000', 'big|300000|3500', 'wrong|300000|2000']) },
          { input: lines(['edge 50,000|50000|1000', 'edge 50,001|50001|2000', 'zero|0|1000']), expected: testRun(['edge 50,000|50000|1000', 'edge 50,001|50001|2000', 'zero|0|1000']), hidden: true, name: 'All pass, with spaces in the names' },
          { input: lines(['a|1|9', 'b|200000|2000']), expected: testRun(['a|1|9', 'b|200000|2000']), hidden: true, name: 'Failing first' },
        ],
        hints: [
          'check() compares with === and echoes the right line, then returns true or false.',
          'Collect the return values: $results[] = check($name, (int) $expected, fee((int) $amount));',
          '$passed = count(array_filter($results)); then print $passed, " passed, ", count($results) - $passed, " failed".',
        ],
      },
      {
        id: 'php31-namespaces',
        title: 'Two namespaces, one program',
        prompt: 'The starter has `Booth\\Money\\Fee` (public static `forAmount(int): int`: 1,000 up to 50,000, 2,000 up to 200,000, else 3,500). Write a class `Booth\\Report\\Receipt` in its own namespace block, using `use` to reach `Fee`, with `line(string $name, int $amount): string` that returns `Amina: UGX 50,000 (fee 1,000)`. The program reads lines `name amount` and prints each receipt line.',
        starter: php`<?php
namespace Booth\Money {
    final class Fee {
        public static function forAmount(int $amount): int {
            if ($amount <= 50000) {
                return 1000;
            }
            return $amount <= 200000 ? 2000 : 3500;
        }
    }
}

// write the namespace Booth\Report block with the class Receipt here

namespace {
    use Booth\Report\Receipt;

    $receipt = new Receipt();
    while (($line = fgets(STDIN)) !== false) {
        $parts = explode(" ", trim($line));
        if (count($parts) === 2) {
            echo $receipt->line($parts[0], (int) $parts[1]), "\n";
        }
    }
}
`,
        usesInput: true,
        sampleInput: lines(['Amina 50000', 'Brian 300000']),
        tests: [
          { input: lines(['Amina 50000', 'Brian 300000']), expected: out(`Amina: UGX 50,000 (fee ${money(feeOld(50000))})`, `Brian: UGX 300,000 (fee ${money(feeOld(300000))})`) },
          { input: lines(['Grace 120000', 'Dan 1000']), expected: out(`Grace: UGX 120,000 (fee ${money(feeOld(120000))})`, `Dan: UGX 1,000 (fee ${money(feeOld(1000))})`), hidden: true, name: 'The middle band' },
          { input: lines(['Eve 50001', 'Fay 200000', 'Gus 200001']), expected: out(`Eve: UGX 50,001 (fee ${money(feeOld(50001))})`, `Fay: UGX 200,000 (fee ${money(feeOld(200000))})`, `Gus: UGX 200,001 (fee ${money(feeOld(200001))})`), hidden: true, name: 'Band edges' },
        ],
        hints: [
          'Open a block: namespace Booth\\Report { ... } and put the class inside it.',
          'Inside that block write use Booth\\Money\\Fee; so the short name Fee works.',
          'return $name . ": UGX " . number_format($amount) . " (fee " . number_format(Fee::forAmount($amount)) . ")";',
        ],
      },
    ],
  },

  // ================================================================== 32
  {
    id: 'php-momo-api',
    level: LEVEL,
    minutes: 38,
    title: 'Mobile Money payments, safely',
    summary: 'Payment requests, pending states, webhooks, signatures and never crediting twice',
    blocks: [
      {
        t: 'story',
        title: 'The customer who paid twice',
        text: "Nambi's shop starts taking Mobile Money on its web page. The customer types her number, and the server asks the Mobile Money company to **request** the payment. The customer's phone shows “Pay UGX 50,000 to Nambi? Enter PIN”. She is in a taxi with a bad network. Nothing happens for two minutes. She presses the button again. A minute later **both** requests go through. Next, the company's server tells Nambi's server “payment r1 succeeded”, and because the network was slow, it tells her **twice**.\n\nPayments are different from other code: the answer is not instant, messages may arrive twice or out of order, and anybody on the internet can pretend to be the payment company. Four ideas make this safe: a **state machine**, **idempotency**, a **signature**, and **checking the amount** against your own records.",
      },
      {
        t: 'tip',
        text: 'Honest note: the real MTN MoMo and Airtel Money APIs need a developer account, keys, HTTPS and a server on the internet, so this app cannot call them. Everything here is a **simulation of the pattern**: the names, fields and signature scheme differ between providers (some sign their callbacks, some use a secret in the URL, some expect you to ask them for the status). When you integrate for real, read that provider’s current documentation, and keep the four ideas below.',
      },
      { t: 'h', text: 'The life of one payment' },
      { t: 'p', text: 'A payment is created as **PENDING** and ends as **SUCCESSFUL** or **FAILED**, and then it never changes again. Writing this rule once, in an enum, stops a late or repeated message from changing a finished payment:' },
      {
        t: 'try',
        code: php`<?php
enum Status: string {
    case Pending = "PENDING";
    case Successful = "SUCCESSFUL";
    case Failed = "FAILED";

    public function canMoveTo(self $next): bool {
        return $this === self::Pending && $next !== self::Pending;
    }
}

$tries = [
    [Status::Pending, Status::Successful],
    [Status::Pending, Status::Failed],
    [Status::Successful, Status::Failed],
    [Status::Failed, Status::Successful],
];
foreach ($tries as [$from, $to]) {
    echo $from->value, " -> ", $to->value, ": ", $from->canMoveTo($to) ? "allowed" : "not allowed", "\n";
}
`,
        output: out('PENDING -> SUCCESSFUL: allowed', 'PENDING -> FAILED: allowed', 'SUCCESSFUL -> FAILED: not allowed', 'FAILED -> SUCCESSFUL: not allowed'),
      },
      { t: 'h', text: 'Idempotency: the same request twice has the same effect as once' },
      { t: 'p', text: 'Your side creates a unique **reference** for each payment (the real APIs ask for one, usually a random UUID). If the same reference arrives again, you must not create a second payment, and if the same “succeeded” message arrives again, you must not credit twice. The reference is the key: look it up first.' },
      { t: 'h', text: 'Signatures: is this message really from the payment company?' },
      { t: 'p', text: 'Your webhook is just a web address. Anybody can send it `{"ref":"r1","status":"SUCCESSFUL"}` and hope Nambi hands over goods. The usual defence is a **shared secret** that only you and the company know. The sender computes an **HMAC**: a fingerprint of the message mixed with the secret, and sends it along; you compute the same and compare. A forger without the secret cannot produce it, and changing even one character of the message changes the fingerprint completely.' },
      {
        t: 'try',
        code: php`<?php
$secret = "booth-secret";
$signature = hash_hmac("sha256", "hello", $secret);
echo $signature, "\n";
echo strlen($signature), "\n";
`,
        output: out(SIG.hello, '64'),
      },
      {
        t: 'try',
        code: php`<?php
const SECRET = "booth-secret";

function verify(string $body, string $signature): bool {
    return hash_equals(hash_hmac("sha256", $body, SECRET), $signature);
}

$body = '{"ref":"r1","status":"SUCCESSFUL"}';
$signature = hash_hmac("sha256", $body, SECRET);

var_dump(verify($body, $signature));
var_dump(verify('{"ref":"r1","status":"FAILED"}', $signature));
var_dump(verify($body, "not-the-signature"));
`,
        output: out('bool(true)', 'bool(false)', 'bool(false)'),
      },
      { t: 'tip', text: 'Two details matter. Sign and check the **raw text** you received, exactly as it arrived (not a re-encoded copy: spaces and key order would change it). And compare with `hash_equals` (lesson 27). On a real server the raw body is `file_get_contents("php://input")`.' },
      { t: 'h', text: 'Putting it together' },
      { t: 'p', text: 'Below is a small Payments class and a command loop. `pay` makes a payment request, `hook` simulates the company’s signed callback, `balance` shows what Nambi has really received. Read the output line by line: the repeated request, the repeated callback, the forged callback, and the late “SUCCESSFUL” for a payment that already failed are all handled without crediting wrongly.' },
      {
        t: 'project',
        title: 'Payments: request, callback, never twice',
        stdin: lines([
          'pay r1 0772123456 50000',
          'pay r1 0772123456 50000',
          'balance',
          `hook ${SIG.r1ok} r1 SUCCESSFUL`,
          `hook ${SIG.r1ok} r1 SUCCESSFUL`,
          `hook ${SIG.r1ok} r2 FAILED`,
          'pay r2 0701234567 30000',
          `hook ${SIG.r2failed} r2 FAILED`,
          `hook ${SIG.r2ok} r2 SUCCESSFUL`,
          'balance',
        ]),
        code: php`<?php
const SECRET = "booth-secret";

enum Status: string {
    case Pending = "PENDING";
    case Successful = "SUCCESSFUL";
    case Failed = "FAILED";

    public function canMoveTo(self $next): bool {
        return $this === self::Pending && $next !== self::Pending;
    }
}

final class Payments {
    private array $payments = [];
    private int $balance = 0;

    public function request(string $ref, string $phone, int $amount): string {
        if (isset($this->payments[$ref])) {
            return "Already requested " . $ref . " (" . $this->payments[$ref]["status"]->value . ")";
        }
        $this->payments[$ref] = ["phone" => $phone, "amount" => $amount, "status" => Status::Pending];
        return "Requested " . $ref . ": UGX " . number_format($amount) . " from " . $phone . " (PENDING)";
    }

    public function webhook(string $ref, string $statusText): string {
        $payment = $this->payments[$ref] ?? null;
        if ($payment === null) {
            return "Unknown reference " . $ref;
        }
        $next = Status::tryFrom($statusText);
        if ($next === null) {
            return "Invalid status " . $statusText;
        }
        if (!$payment["status"]->canMoveTo($next)) {
            return "Ignored " . $ref . " (already " . $payment["status"]->value . ")";
        }
        $this->payments[$ref]["status"] = $next;
        if ($next === Status::Successful) {
            $this->balance += $payment["amount"];
            return "Credited UGX " . number_format($payment["amount"]) . " for " . $ref;
        }
        return "Failed " . $ref;
    }

    public function balance(): int {
        return $this->balance;
    }
}

$payments = new Payments();
while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
    if ($parts[0] === "pay" && count($parts) === 4) {
        echo $payments->request($parts[1], $parts[2], (int) $parts[3]), "\n";
    } elseif ($parts[0] === "hook" && count($parts) === 4) {
        [, $signature, $ref, $status] = $parts;
        $body = json_encode(["ref" => $ref, "status" => $status]);
        if (!hash_equals(hash_hmac("sha256", $body, SECRET), $signature)) {
            echo "Rejected: bad signature\n";
        } else {
            echo $payments->webhook($ref, $status), "\n";
        }
    } elseif ($parts[0] === "balance") {
        echo "Balance: UGX ", number_format($payments->balance()), "\n";
    }
}
`,
        output: momoModel([
          'pay r1 0772123456 50000',
          'pay r1 0772123456 50000',
          'balance',
          `hook ${SIG.r1ok} r1 SUCCESSFUL`,
          `hook ${SIG.r1ok} r1 SUCCESSFUL`,
          `hook ${SIG.r1ok} r2 FAILED`,
          'pay r2 0701234567 30000',
          `hook ${SIG.r2failed} r2 FAILED`,
          `hook ${SIG.r2ok} r2 SUCCESSFUL`,
          'balance',
        ]),
      },
      {
        t: 'list',
        items: [
          '**Never trust the callback’s amount or status blindly**: credit the amount **you** stored for that reference, as `Payments` does. A message that says “reference r1, UGX 9,000,000” must not change what Nambi believes she was owed.',
          '**Answer fast, work safely.** A real provider expects a quick `200` reply to its callback and will retry if you do not. That is another reason the same message can arrive twice.',
          '**Store everything** (reference, phone, amount, status, time) in the database (lesson 29) so a restart does not lose a pending payment. This lesson used an array so you can see the logic.',
          '**Log, do not print**, signatures and secrets. Never put the secret in the code you share: read it from the environment (`getenv`).',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
$a = hash_hmac("sha256", "pay", "k1");
$b = hash_hmac("sha256", "pay", "k1");
$c = hash_hmac("sha256", "pay", "k2");
var_dump($a === $b, $a === $c);
`,
        question: 'What does this program print?',
        options: ['bool(true)\nbool(false)', 'bool(true)\nbool(true)', 'bool(false)\nbool(false)', 'bool(false)\nbool(true)'],
        answer: 0,
        explain: 'The same message and the same secret always give the same fingerprint, and a different secret gives a completely different one. That is why a forger without the secret cannot sign.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that safely compares two signatures.',
        template: php`<?php
$expected = hash_hmac("sha256", "r1", "k");
$given = hash_hmac("sha256", "r1", "k");
var_dump(___($expected, $given));
`,
        blanks: [{ options: ['hash_equals', 'str_equals', 'equal_hash'], answer: 'hash_equals' }],
        output: 'bool(true)\n',
      },
      {
        t: 'bug',
        code: php`<?php
declare(strict_types=1);

function credit(int $amount): string {
    return "Credited " . $amount;
}

$fromJson = "50000";
echo credit($fromJson), "\n";
`,
        question: 'This program stops with a TypeError: credit() expects an int but got a string. What is the right fix?',
        options: ['Validate the text, then convert it with (int) before calling credit', 'Remove the type from the function', 'Use single quotes around 50000', 'Call credit twice'],
        answer: 0,
        explain: 'Money that arrives as text must be checked (ctype_digit or filter_var) and then converted deliberately. Removing types would hide the problem instead of fixing it.',
        fixed: php`<?php
declare(strict_types=1);

function credit(int $amount): string {
    return "Credited " . $amount;
}

$fromJson = "50000";
if (ctype_digit($fromJson)) {
    echo credit((int) $fromJson), "\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: build a message, sign it, and verify it the way a webhook receiver does.',
        lines: ['<?php', '$secret = "booth-secret";', '$body = json_encode(["ref" => "w1", "amount" => 50000]);', '$signature = hash_hmac("sha256", $body, $secret);', '$headers = ["X-Signature" => $signature];', '$valid = hash_equals(hash_hmac("sha256", $body, $secret), $headers["X-Signature"]);', 'echo $valid ? "accepted" : "rejected", "\\n";'],
        output: 'accepted\n',
      },
      {
        t: 'quiz',
        question: 'Why must a webhook handler be idempotent?',
        options: ['The provider may send the same callback more than once, and crediting twice creates money from nothing', 'Because PHP cannot read JSON twice', 'To make the response faster', 'Because signatures expire after one use'],
        answer: 0,
        explain: 'Networks fail and providers retry. The handler must give the same final result whether a message arrives once or five times.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$balance = 0;
foreach (["w1", "w1"] as $ref) {
    $balance += 50000;
}
echo $balance;`, why: 'No error, but the same reference was credited twice: 100,000 instead of 50,000. Remember which references you have already processed.', right: php`<?php
$balance = 0;
$seen = [];
foreach (["w1", "w1"] as $ref) {
    if (isset($seen[$ref])) {
        continue;
    }
    $seen[$ref] = true;
    $balance += 50000;
}
echo $balance;`, logic: true },
          { wrong: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->commit();`, why: 'commit() without beginTransaction() has nothing to commit: PDOException “There is no active transaction”. Every transaction starts with beginTransaction().', right: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->beginTransaction();
$db->commit();
echo "committed";` },
          { wrong: php`<?php
echo (int) ((0.1 + 0.7) * 10);`, why: 'It prints 7, not 8: decimal fractions cannot be stored exactly in floating point, and (int) cuts instead of rounding. Keep money in whole shillings (integers) and avoid float arithmetic.', right: php`<?php
echo intdiv(8 * 10, 10);`, logic: true },
          { wrong: php`<?php
$ref = '<b>x</b>';
echo "<li>" . $ref . "</li>";`, why: 'A reference or name that came from outside is printed raw into HTML, so a visitor’s tags run in the page. Escape it with htmlspecialchars (lesson 27).', right: php`<?php
$ref = '<b>x</b>';
echo "<li>" . htmlspecialchars($ref, ENT_QUOTES) . "</li>";`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'A payment is a **state machine**: PENDING, then SUCCESSFUL or FAILED, then final. Put the rule in one place (an enum method).',
          '**Idempotency:** key everything by a unique reference; a repeated request or callback must not create or credit twice.',
          '**Signatures:** `hash_hmac("sha256", $rawBody, $secret)` compared with `hash_equals`; secrets come from the environment.',
          'Credit the amount **you** recorded, keep money in whole shillings, store payments in the database, and read each provider’s real documentation before integrating.',
        ],
        memory: 'State machine. Reference = key. Sign raw body, hash_equals.',
      },
    ],
    exercises: [
      {
        id: 'php32-signature',
        title: 'Verify the callback',
        prompt: 'The secret is `booth-secret`. Each input line is `signature body` (split at the **first** space; the body has no spaces). Print `valid` when the signature equals the HMAC-SHA256 of the body (hex, lowercase) and `invalid` otherwise. Use `hash_hmac` and `hash_equals`.',
        starter: php`<?php
const SECRET = "booth-secret";

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    [$signature, $body] = explode(" ", $line, 2);
}
`,
        usesInput: true,
        sampleInput: lines([`${SIG.r1ok} ${BODY.r1ok}`, `${SIG.r1ok} ${BODY.r1failed}`]),
        tests: [
          { input: lines([`${SIG.r1ok} ${BODY.r1ok}`, `${SIG.r1ok} ${BODY.r1failed}`]), expected: sigCheck([`${SIG.r1ok} ${BODY.r1ok}`, `${SIG.r1ok} ${BODY.r1failed}`]) },
          { input: lines([`${SIG.r2failed} ${BODY.r2failed}`, `${SIG.r2ok} ${BODY.r2ok}`, `${SIG.r2ok} ${BODY.r2failed}`]), expected: sigCheck([`${SIG.r2failed} ${BODY.r2failed}`, `${SIG.r2ok} ${BODY.r2ok}`, `${SIG.r2ok} ${BODY.r2failed}`]), hidden: true, name: 'Several messages' },
          { input: lines([`abc ${BODY.r1ok}`, `${SIG.r1ok.toUpperCase()} ${BODY.r1ok}`]), expected: sigCheck([`abc ${BODY.r1ok}`, `${SIG.r1ok.toUpperCase()} ${BODY.r1ok}`]), hidden: true, name: 'A made-up signature and capital letters' },
        ],
        hints: [
          'The expected signature is hash_hmac("sha256", $body, SECRET). It is 64 lowercase hex characters.',
          'Compare with hash_equals($expected, $signature): both are text, and the comparison cannot be fooled.',
          'Print "valid" or "invalid" for each line.',
        ],
      },
      {
        id: 'php32-idempotent',
        title: 'Never credit twice',
        prompt: 'Write the payment tracker from the lesson yourself, without signatures. Commands: `pay ref phone amount` prints `Requested r1: UGX 50,000 from 0772123456 (PENDING)`, or `Already requested r1 (STATUS)` if the reference exists (nothing changes). `webhook ref STATUS` prints `Unknown reference r9` for an unknown reference, else `Invalid status X` unless the status is PENDING, SUCCESSFUL or FAILED, else `Ignored r1 (already SUCCESSFUL)` if the payment cannot move to that status (only PENDING can move, and only to SUCCESSFUL or FAILED), else for SUCCESSFUL `Credited UGX 50,000 for r1` (adding the amount stored for that reference) and for FAILED `Failed r1`. `balance` prints `Balance: UGX 50,000`.',
        starter: php`<?php
$payments = [];
$balance = 0;

while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['pay r1 0772123456 50000', 'pay r1 0772123456 50000', 'webhook r1 SUCCESSFUL', 'webhook r1 SUCCESSFUL', 'balance']),
        tests: [
          { input: lines(['pay r1 0772123456 50000', 'pay r1 0772123456 50000', 'webhook r1 SUCCESSFUL', 'webhook r1 SUCCESSFUL', 'balance']), expected: momoModel(['pay r1 0772123456 50000', 'pay r1 0772123456 50000', 'webhook r1 SUCCESSFUL', 'webhook r1 SUCCESSFUL', 'balance']) },
          { input: lines(['pay a 0700000001 1000', 'webhook a FAILED', 'webhook a SUCCESSFUL', 'pay a 0700000001 1000', 'balance']), expected: momoModel(['pay a 0700000001 1000', 'webhook a FAILED', 'webhook a SUCCESSFUL', 'pay a 0700000001 1000', 'balance']), hidden: true, name: 'A failed payment stays failed' },
          { input: lines(['webhook zz SUCCESSFUL', 'pay b 0700000002 2500', 'webhook b MAYBE', 'webhook b PENDING', 'webhook b SUCCESSFUL', 'pay c 0700000003 500', 'webhook c SUCCESSFUL', 'balance']), expected: momoModel(['webhook zz SUCCESSFUL', 'pay b 0700000002 2500', 'webhook b MAYBE', 'webhook b PENDING', 'webhook b SUCCESSFUL', 'pay c 0700000003 500', 'webhook c SUCCESSFUL', 'balance']), hidden: true, name: 'Unknown, invalid and pending messages' },
        ],
        hints: [
          'Keep $payments[$ref] = ["phone" => ..., "amount" => ..., "status" => "PENDING"]. A repeated pay finds isset($payments[$ref]) and changes nothing.',
          'For a webhook check in this order: unknown reference, invalid status (in_array against the three names), then whether the stored status is still "PENDING" and the new one is not "PENDING".',
          'Only a SUCCESSFUL move adds $payments[$ref]["amount"] to $balance. Use number_format for the amounts.',
        ],
      },
      {
        id: 'php32-state-machine',
        title: 'Allowed moves',
        prompt: 'Make a backed enum `Status` (PENDING, SUCCESSFUL, FAILED) with a method `canMoveTo(self $next): bool`: only PENDING may move, and only to SUCCESSFUL or FAILED. Each input line is `FROM TO`. If either word is not a status (use `tryFrom`) print `unknown status`; otherwise print `PENDING -> SUCCESSFUL: allowed` or `...: not allowed`.',
        starter: php`<?php
while (($line = fgets(STDIN)) !== false) {
    [$from, $to] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['PENDING SUCCESSFUL', 'SUCCESSFUL FAILED', 'PENDING DONE']),
        tests: [
          { input: lines(['PENDING SUCCESSFUL', 'SUCCESSFUL FAILED', 'PENDING DONE']), expected: transitions(['PENDING SUCCESSFUL', 'SUCCESSFUL FAILED', 'PENDING DONE']) },
          { input: lines(['PENDING PENDING', 'FAILED SUCCESSFUL', 'PENDING FAILED', 'FAILED FAILED']), expected: transitions(['PENDING PENDING', 'FAILED SUCCESSFUL', 'PENDING FAILED', 'FAILED FAILED']), hidden: true, name: 'Same-state and final moves' },
          { input: lines(['pending failed', 'X Y']), expected: transitions(['pending failed', 'X Y']), hidden: true, name: 'Names are exact' },
        ],
        hints: [
          'enum Status: string { case Pending = "PENDING"; case Successful = "SUCCESSFUL"; case Failed = "FAILED"; ... }',
          'canMoveTo: return $this === self::Pending && $next !== self::Pending;',
          'Status::tryFrom($from) and Status::tryFrom($to); if either is null print "unknown status", else use ->value and a ternary.',
        ],
      },
    ],
  },

  // ================================================================== 33
  {
    id: 'php-capstone',
    level: LEVEL,
    minutes: 45,
    title: "Capstone: Nambi's Booth, online",
    summary: 'One complete application: database ledger, JSON API, validation, safe HTML, signed callbacks and fees you can change in one place',
    blocks: [
      {
        t: 'story',
        title: 'Opening day',
        text: "Everything you learned comes together. Nambi's booth now has a small online service: customers have accounts, the phone app deposits and withdraws, the Mobile Money company calls a signed webhook when a customer pays, and Nambi opens a printable statement. Every piece is code you have already written in this level; this lesson is about seeing how the pieces **fit**.\n\nThe program has three layers, and each layer only talks to the one below it:",
      },
      {
        t: 'list',
        items: [
          '**Data layer** (`Ledger`): the only place with SQL. Knows accounts, transactions, fees and money rules. Uses prepared statements and transactions (lesson 29), and throws exceptions with clear names (Level 4).',
          '**HTTP layer** (`handle()` and its helpers): turns a request (method, path, query, headers, body) into a response array (lesson 30). Validates everything (lesson 26), escapes HTML (lesson 27), checks webhook signatures (lessons 27 and 32).',
          '**Front door** (the command loop at the bottom): on a real server this would be `public/index.php`; here it reads simulated requests. Swap it and the other two layers do not change.',
        ],
      },
      { t: 'h', text: 'Layer 1: the data layer' },
      { t: 'p', text: 'Read it slowly. Notice: balances are integers; an account can never go below zero because the database itself refuses (`check (balance >= 0)`); a deposit with a `ref` is stored with `insert or ignore` against a `unique` column, so a repeated reference is detected by the database and the deposit is **not** made twice; every change to two tables happens inside a transaction.' },
      { t: 'code', text: boothData().trim() },
      { t: 'h', text: 'Layer 2: the HTTP layer' },
      { t: 'p', text: 'Every route is a small function that reads the request, calls the ledger, and returns `reply(...)`. All error policy is in the `catch` blocks at the end of `handle()`: invalid JSON is 400, bad data 422, unknown account 404, clashes (existing account, not enough money) 409, a bad signature 401. Notice `statement()`: the reference text is printed into HTML, so it goes through `e()`.' },
      { t: 'code', text: boothHttp({ transactions: false }).trim() },
      { t: 'h', text: 'Run the whole application' },
      { t: 'p', text: 'The session below opens accounts, makes deposits and withdrawals, receives signed webhooks (one repeated, one forged, one for an account that does not exist, one with an HTML tag hidden in its reference), asks for a balance and a statement, and makes several mistakes on purpose. Run it and match each answer with the code above:' },
      {
        t: 'project',
        title: "Nambi's Booth: the finished service",
        stdin: lines(CAPSTONE),
        code: boothApp({ transactions: false }),
        output: boothModel(CAPSTONE, { transactions: false }),
      },
      {
        t: 'list',
        items: [
          '**Changing a rule is one edit.** Nambi changes the withdrawal fees: you change `feeFor()` and nothing else. That is what the layers buy you (you will do exactly this in the exercises).',
          '**Not in this program, but required before real customers:** logins and permissions for every route (who is allowed to withdraw from Amina’s account?), HTTPS, rate limits, a real database file with backups, logging that never records secrets, and the real provider’s APIs with their own signature rules. Software that moves money is never “finished”; it is maintained.',
          '**Next steps for you:** put it on a real server (a cheap PHP host or a small VPS), read about PHPUnit and Composer, and learn a framework such as Laravel, which gives you routing, validation, database tools and security helpers you now understand from the inside.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
$db = new PDO("sqlite::memory:");
$db->exec("create table t (ref text unique)");
$s = $db->prepare("insert or ignore into t values (?)");
$s->execute(["a"]);
echo $s->rowCount();
$s->execute(["a"]);
echo $s->rowCount();
`,
        question: 'What does this program print?',
        options: ['10', '11', '00', '01'],
        answer: 0,
        explain: 'The first insert adds a row (1). The second tries the same unique value; “or ignore” skips it without an error, so no row is changed (0). The ledger uses exactly this to detect a repeated reference.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the status that means “a new thing was created”.',
        template: php`<?php
function created(): int {
    return ___;
}
echo created(), "\n";
`,
        blanks: [{ options: ['201', '404', '409'], answer: '201' }],
        output: '201\n',
      },
      {
        t: 'bug',
        code: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table accounts (name text primary key, balance integer not null check (balance >= 0))");
$db->exec("insert into accounts values ('amina', 1000)");
$db->exec("update accounts set balance = balance - 5000 where name = 'amina'");
echo "done\n";
`,
        question: 'This program stops with a PDOException about a CHECK constraint. What does that tell you?',
        options: ['The database refused a balance below zero, which is exactly the safety net we want; the code should check first and answer 409', 'The table is broken', 'SQLite cannot subtract', 'The name must be in capitals'],
        answer: 0,
        explain: 'The `check` rule is the last line of defence. A good program checks the balance first (as Ledger::withdraw does) and answers with a friendly message; the database rule makes sure a bug can never create negative money.',
        fixed: php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table accounts (name text primary key, balance integer not null check (balance >= 0))");
$db->exec("insert into accounts values ('amina', 1000)");
$balance = (int) $db->query("select balance from accounts where name = 'amina'")->fetchColumn();
if (5000 > $balance) {
    echo "Short by UGX ", number_format(5000 - $balance), "\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order for the front door: read a request line, split it, handle it, and print the status.',
        lines: ['<?php', 'function handle(string $method, string $path): array { return ["status" => 200]; }', '$line = "GET /balance";', '[$method, $path] = explode(" ", $line);', '$response = handle($method, $path);', '$status = $response["status"];', 'echo $status, "\\n";'],
        output: '200\n',
      },
      {
        t: 'quiz',
        question: 'Why does the Ledger class contain all the SQL, instead of every route writing its own?',
        options: ['One place to change, test and secure; the HTTP layer never needs to know SQL', 'PHP does not allow SQL in functions', 'SQL runs faster inside classes', 'It makes the code longer on purpose'],
        answer: 0,
        explain: 'Layers keep each decision in one place. When the database, a fee or a rule changes, you edit one layer and the rest of the program stays untouched.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$ref = 'x" onmouseover="steal()';
echo '<li data-ref="' . $ref . '">paid</li>';`, why: 'The visitor’s quote closes the attribute and adds an event of his own. Whatever comes from outside is escaped when it is printed into HTML.', right: php`<?php
$ref = 'x" onmouseover="steal()';
echo '<li data-ref="' . htmlspecialchars($ref, ENT_QUOTES) . '">paid</li>';`, logic: true },
          { wrong: php`<?php
$secret = "booth-secret";
echo "Using secret " . $secret . "\n";`, why: 'Secrets must not be printed or logged, and should not be typed into code you share. Read it from the environment and never echo it.', right: php`<?php
$secret = getenv("WEBHOOK_SECRET") ?: "";
echo $secret === "" ? "No secret configured\n" : "Secret loaded\n";`, logic: true },
          { wrong: php`<?php
$balance = 10000;
$amount = "5000";
if ($amount > $balance) {
    echo "too much";
} else {
    echo "ok: " . ($balance - $amount);
}`, why: 'It works only by luck of PHP’s automatic text-to-number conversion. Input is validated and converted once, at the door (filter_var, then (int)); inside the program every amount is a real int, and strict_types will tell you when it is not.', right: php`<?php
$balance = 10000;
$amount = filter_var("5000", FILTER_VALIDATE_INT);
if ($amount === false) {
    echo "invalid";
} elseif ($amount > $balance) {
    echo "too much";
} else {
    echo "ok: " . ($balance - $amount);
}`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'Layers: **data** (SQL, money rules, exceptions) → **HTTP** (validation, status codes, escaping, signatures) → **front door** (the only part that knows about the server).',
          'Safety lives in several places at once: validation at the door, prepared statements, a `check` rule and unique column in the database, `hash_equals` on signatures, `htmlspecialchars` on output.',
          'A rule that changes (fees) should live in exactly one place.',
          'You can now read, write, test and structure real PHP. Next: a real server, Composer and PHPUnit, then a framework such as Laravel.',
        ],
        memory: 'Layers. Validate in, escape out. One rule, one place.',
      },
    ],
    exercises: [
      {
        id: 'php33-new-fees',
        title: 'Nambi changes the fees',
        prompt: 'Nambi announces new withdrawal fees: **500** for amounts up to 20,000; **1,500** up to 100,000; **3,000** above that. The whole program is in the starter. Change the fee rule (in exactly one place) and nothing else.',
        starter: boothApp({ transactions: false }),
        usesInput: true,
        sampleInput: lines(SESSION_B),
        tests: [
          { input: lines(SESSION_B), expected: boothModel(SESSION_B, { fees: 'new', transactions: false }) },
          { input: lines(['POST /accounts {"name":"Dan"}', 'POST /deposit {"name":"Dan","amount":200000}', 'POST /withdraw {"name":"Dan","amount":20000}', 'POST /withdraw {"name":"Dan","amount":20001}', 'POST /withdraw {"name":"Dan","amount":100000}', 'POST /withdraw {"name":"Dan","amount":100001}', 'GET /balance?name=Dan']), expected: boothModel(['POST /accounts {"name":"Dan"}', 'POST /deposit {"name":"Dan","amount":200000}', 'POST /withdraw {"name":"Dan","amount":20000}', 'POST /withdraw {"name":"Dan","amount":20001}', 'POST /withdraw {"name":"Dan","amount":100000}', 'POST /withdraw {"name":"Dan","amount":100001}', 'GET /balance?name=Dan'], { fees: 'new', transactions: false }), hidden: true, name: 'The edges of each band' },
          { input: lines(['POST /accounts {"name":"Eve"}', 'POST /deposit {"name":"Eve","amount":2000}', 'POST /withdraw {"name":"Eve","amount":1600}', 'POST /withdraw {"name":"Eve","amount":1500}', 'POST /withdraw {"name":"Eve","amount":1000}']), expected: boothModel(['POST /accounts {"name":"Eve"}', 'POST /deposit {"name":"Eve","amount":2000}', 'POST /withdraw {"name":"Eve","amount":1600}', 'POST /withdraw {"name":"Eve","amount":1500}', 'POST /withdraw {"name":"Eve","amount":1000}'], { fees: 'new', transactions: false }), hidden: true, name: 'Refusal messages use the new fee' },
        ],
        hints: [
          'Find the one function that decides the fee: private static function feeFor(int $amount) in the Ledger class.',
          'Change the limits and amounts there: up to 20,000 → 500, up to 100,000 → 1,500, otherwise 3,000.',
          'Nothing else needs to change: withdraw() and the refusal message both call feeFor().',
        ],
      },
      {
        id: 'php33-transactions-route',
        title: 'A new route: recent transactions',
        prompt: 'Add `GET /transactions?name=Amina&limit=2`. It answers `200 {"name":"Amina","transactions":[{"kind":"withdraw","amount":1000,"fee":1000},...]}` with the **latest** transactions first, at most `limit` of them (`limit` defaults to 5 and must be a whole number from 1 to 50, otherwise `422 {"error":"Invalid limit"}`). Validate in this order: the name (missing → the existing `Name is required` 422), then the limit, then whether the account exists (`404 Unknown account`). Add a `transactions()` function and the route in the two marked places.',
        starter: boothApp({ transactions: false }),
        usesInput: true,
        sampleInput: lines(SESSION_T),
        tests: [
          { input: lines(SESSION_T), expected: boothModel(SESSION_T, { transactions: true }) },
          { input: lines(['POST /accounts {"name":"Zed"}', 'GET /transactions?name=Zed', 'POST /deposit {"name":"Zed","amount":10}', 'GET /transactions?name=Zed&limit=50', 'GET /transactions?name=Zed&limit=51', 'POST /transactions {"name":"Zed"}']), expected: boothModel(['POST /accounts {"name":"Zed"}', 'GET /transactions?name=Zed', 'POST /deposit {"name":"Zed","amount":10}', 'GET /transactions?name=Zed&limit=50', 'GET /transactions?name=Zed&limit=51', 'POST /transactions {"name":"Zed"}'], { transactions: true }), hidden: true, name: 'Empty history, edges of the limit, wrong method' },
          { input: lines(['POST /accounts {"name":"Amy"}', 'POST /deposit {"name":"Amy","amount":9000}', 'POST /deposit {"name":"Amy","amount":8000}', 'POST /deposit {"name":"Amy","amount":7000}', 'GET /transactions?name=Amy&limit=2', 'GET /transactions?name=Amy&limit=1']), expected: boothModel(['POST /accounts {"name":"Amy"}', 'POST /deposit {"name":"Amy","amount":9000}', 'POST /deposit {"name":"Amy","amount":8000}', 'POST /deposit {"name":"Amy","amount":7000}', 'GET /transactions?name=Amy&limit=2', 'GET /transactions?name=Amy&limit=1'], { transactions: true }), hidden: true, name: 'Newest first' },
        ],
        hints: [
          'Copy the shape of showBalance(): $name = queryName($query); then validate the limit with filter_var($query["limit"] ?? "5", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 50]]) and throw new InvalidArgumentException("Invalid limit") when it is false.',
          '$ledger->balance($name) throws UnknownAccountException for a missing account, which handle() already turns into 404. Then array_slice(array_reverse($ledger->history($name)), 0, $limit) gives the newest first.',
          'Map each row to ["kind" => ..., "amount" => ..., "fee" => ...] (no ref), return reply(200, ["name" => $name, "transactions" => $list]), and add the path to $known and an arm to the match in handle().',
        ],
      },
      {
        id: 'php33-escape-statement',
        title: 'Fix the statement',
        prompt: 'A security reviewer found that `GET /statement` prints the transaction reference **unescaped**, so a webhook with the reference `<b>x</b>` puts live HTML in Nambi’s statement. Fix it so the reference is escaped with the existing `e()` function.',
        starter: boothApp({ transactions: false, escape: false }),
        usesInput: true,
        sampleInput: lines(SESSION_E),
        tests: [
          { input: lines(SESSION_E), expected: boothModel(SESSION_E, { transactions: false }) },
          { input: lines(['POST /accounts {"name":"Amina"}', whLine('w1'), whLine('bx'), 'GET /statement?name=Amina']), expected: boothModel(['POST /accounts {"name":"Amina"}', whLine('w1'), whLine('bx'), 'GET /statement?name=Amina'], { transactions: false }), hidden: true, name: 'A safe reference and a dangerous one' },
        ],
        hints: [
          'Find the line in statement() that appends " ref " and the reference to $line.',
          'The reference comes from outside, so it must go through the escaping helper before it is printed into HTML.',
          '$line .= " ref " . e($row["ref"]);',
        ],
      },
    ],
  },
];
