// PHP, Level 5: Market-ready PHP. Lessons 25 to 27 (web requests, forms and validation, security).
// There is no web server in the app, so requests are simulated with plain arrays and text.
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money } from './shared.js';

const LEVEL = 'Level 5: Market-ready PHP';
const lines = (a) => a.join('\n') + '\n';

// ---- expected outputs for lesson 25 ----
const STATUS_TEXT = { 200: 'OK', 201: 'Created', 404: 'Not Found', 405: 'Method Not Allowed' };
const ROUTES = { '/balance': ['GET', 200], '/deposit': ['POST', 201], '/withdraw': ['POST', 200], '/transactions': ['GET', 200] };
const routeStatus = (method, path) => (!ROUTES[path] ? 404 : ROUTES[path][0] === method ? ROUTES[path][1] : 405);
const requestLines = (line) => {
  const [method, target] = line.split(' ');
  const [path, qs = ''] = target.split('?');
  return [`${method} ${path}`, ...[...new URLSearchParams(qs)].map(([k, v]) => `  ${k} = ${v}`)];
};

// ---- expected outputs for lesson 26 ----
const validateDeposit = (name, amount, phone) => {
  const errors = [];
  const n = name.trim();
  if (n === '') errors.push('name: Name is required');
  else if ([...n].length > 40) errors.push('name: Name is too long');
  if (!/^(0|[1-9]\d*)$/.test(amount) || Number(amount) < 1000 || Number(amount) > 5000000) errors.push('amount: Amount must be a whole number from 1,000 to 5,000,000');
  if (!/^0\d{9}$/.test(phone)) errors.push('phone: Phone must be 10 digits starting with 0');
  return errors.length ? out(...errors) : `OK: ${n} deposits UGX ${money(Number(amount))} from ${phone}\n`;
};

// ---- expected outputs for lesson 27 ----
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

export const level5 = [
  // ================================================================== 25
  {
    id: 'php-requests',
    level: LEVEL,
    minutes: 32,
    title: 'How the web works for PHP',
    summary: 'Requests and responses, URLs and query strings, $_GET and $_POST, status codes and a tiny router',
    blocks: [
      {
        t: 'story',
        title: 'Nambi on the phone',
        text: "Until now Nambi's program only ran at the booth, on the nephew's laptop. Now her customers want to check their balance from their own phones, from home. That is a different world: the customer's phone and Nambi's computer never meet. They talk through the internet, in a fixed language called **HTTP**.\n\nThe phone sends a **request**: “please GET /balance for Amina”. A program on Nambi's server (yours, in PHP) reads the request, does the work, and sends back a **response**: “200 OK, her balance is 50,000”. That is nearly all of web programming, and PHP was born for it.",
      },
      { t: 'h', text: 'What a request and a response contain' },
      {
        t: 'list',
        items: [
          'A request has a **method** (`GET` to read, `POST` to send something new, and a few more), a **URL** (a path like `/balance` plus an optional query like `?name=Amina`), **headers** (small notes about the sender) and sometimes a **body** (the data, for example form fields or JSON).',
          'A response has a **status code** (a number: 200 fine, 404 not found), **headers**, and a **body** (the page, or JSON, that the phone shows).',
          'A GET only **reads**; it must never change anything. Changes go in POST (or PUT, PATCH, DELETE).',
        ],
      },
      { t: 'p', text: 'On a real web server a PHP script gets the request already unpacked into special variables called **superglobals**, and sends the response with functions like `header()`. A script on a real server looks like this (it is shown, not run, because this app has no web server):' },
      {
        t: 'code',
        text: `<?php
// public/index.php on a real server (this block is only shown, not run)
$name = $_GET["name"] ?? "guest";          // from ?name=Amina in the URL
$method = $_SERVER["REQUEST_METHOD"];      // "GET" or "POST"

header("Content-Type: application/json");  // a response header
http_response_code(200);                   // the status code
echo json_encode(["hello" => $name]);      // the response body`,
      },
      { t: 'tip', text: "Because the app has no web server, in this level **requests are simulated**: a request is a line of text or an array, and a response is a status number plus a body that your program returns and prints. Everything you learn here carries over to a real server unchanged. Only the very last step (`header()` and the superglobals being filled in for you) is done by the server." },
      { t: 'h', text: 'Taking a URL apart' },
      {
        t: 'try',
        code: php`<?php
$url = "https://booth.ug/pay?name=Amina+B&amount=50000#top";
$parts = parse_url($url);
echo $parts["host"], " ", $parts["path"], "\n";
parse_str($parts["query"], $query);
echo $query["name"], " ", $query["amount"], "\n";
`,
        output: out('booth.ug /pay', 'Amina B 50000'),
      },
      { t: 'p', text: '`parse_url` cuts a URL into its parts (scheme, host, path, query, fragment). `parse_str` turns a query string into an array, **decoding** it: `+` and `%20` become a space. It needs two arguments: the text, and the variable where the array is stored.' },
      { t: 'h', text: 'Making a URL: encoding' },
      { t: 'p', text: 'Characters like `&`, `=`, `?` and spaces have a meaning in a URL. To send them as plain data they must be **encoded**. `http_build_query` builds a whole query string from an array and does the encoding for you:' },
      {
        t: 'try',
        code: php`<?php
echo http_build_query(["name" => "Amina B", "amount" => 50000]), "\n";
echo urlencode("a&b=c"), "\n";
echo "/pay?" . http_build_query(["note" => "Ssali & Sons"]), "\n";
`,
        output: out('name=Amina+B&amount=50000', 'a%26b%3Dc', '/pay?note=Ssali+%26+Sons'),
      },
      { t: 'h', text: '$_GET and $_POST' },
      { t: 'p', text: '`$_GET` holds the query string, `$_POST` holds the body of a form, and `$_SERVER["REQUEST_METHOD"]` says which method was used. They are ordinary arrays available **everywhere**, even inside functions. A real server fills them in; here we fill them in ourselves to practise:' },
      {
        t: 'try',
        code: php`<?php
$_SERVER["REQUEST_METHOD"] = "POST";
$_GET = ["ref" => "7"];
$_POST = ["amount" => "50000"];

function describe(): string {
    return $_SERVER["REQUEST_METHOD"] . " ref=" . ($_GET["ref"] ?? "-") . " amount=" . ($_POST["amount"] ?? "-");
}

echo describe(), "\n";
`,
        output: 'POST ref=7 amount=50000\n',
      },
      { t: 'tip', text: 'Everything in `$_GET` and `$_POST` arrives as **text**, never as a number, and the person on the other end can send **anything**: a missing field, a very long one, even an array (`name[]=x`). Lessons 26 and 27 are about handling that safely.' },
      { t: 'h', text: 'A first router' },
      { t: 'p', text: 'A **router** looks at the method and the path and decides what to do. `match (true)` lets each arm be a condition. Remember the codes: 404 when the path does not exist, 405 when the path exists but the method is wrong.' },
      {
        t: 'try',
        code: php`<?php
function route(string $method, string $path): array {
    return match (true) {
        $method === "GET" && $path === "/balance" => [200, "Balance"],
        $method === "POST" && $path === "/deposit" => [201, "Deposit created"],
        in_array($path, ["/balance", "/deposit"], true) => [405, "Method not allowed"],
        default => [404, "Not found"],
    };
}

foreach ([["GET", "/balance"], ["POST", "/deposit"], ["GET", "/deposit"], ["GET", "/nope"]] as [$method, $path]) {
    [$status, $text] = route($method, $path);
    echo $method, " ", $path, " -> ", $status, " ", $text, "\n";
}
`,
        output: out('GET /balance -> 200 Balance', 'POST /deposit -> 201 Deposit created', 'GET /deposit -> 405 Method not allowed', 'GET /nope -> 404 Not found'),
      },
      {
        t: 'list',
        items: [
          '**2xx** success: `200 OK`, `201 Created` (something new was made).',
          '**4xx** the client did something wrong: `400 Bad Request`, `401 Unauthorized` (who are you?), `403 Forbidden` (not allowed), `404 Not Found`, `405 Method Not Allowed`, `409 Conflict`, `422 Unprocessable` (the data is invalid).',
          '**5xx** the server failed: `500 Internal Server Error`. The customer did nothing wrong.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
parse_str("a=1&b=2&b2=3", $o);
echo $o["b"] + $o["b2"];
`,
        question: 'What does this program print?',
        options: ['5', '23', '3', '12'],
        answer: 0,
        explain: 'parse_str gives an array with keys a, b and b2. The values are the strings "2" and "3", and + turns them into numbers: 2 + 3 = 5.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that turns a query string into an array.',
        template: php`<?php
___("amount=5000", $q);
echo $q["amount"], "\n";
`,
        blanks: [{ options: ['parse_str', 'parse_url', 'urlencode'], answer: 'parse_str' }],
        output: '5000\n',
      },
      {
        t: 'bug',
        code: php`<?php
parse_str("name=Amina");
echo "done\n";
`,
        question: 'This program stops with an “ArgumentCountError”. What is wrong?',
        options: ['parse_str needs a second argument: the variable where it stores the array', 'parse_str cannot read names', 'The text needs a question mark in front', 'echo must come first'],
        answer: 0,
        explain: 'Since PHP 8 parse_str(text, result) must be given both arguments. The result comes back through the second variable, not as a return value.',
        fixed: php`<?php
parse_str("name=Amina", $result);
echo $result["name"], "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: define a function that reads $_GET, fill in $_GET, then use the function.',
        lines: ['<?php', 'function who(): string {', '    return $_GET["name"] ?? "guest";', '}', '$_GET = ["name" => "Amina"];', '$greeting = "Hello " . who();', 'echo $greeting, "\\n";'],
        output: 'Hello Amina\n',
      },
      {
        t: 'quiz',
        question: 'What type are the values in $_GET and $_POST?',
        options: ['Always text (strings), even when they look like numbers', 'Numbers when they look like numbers', 'Booleans', 'Whatever the form said'],
        answer: 0,
        explain: 'A request is just text. "50000" is the string "50000" until your program converts it, and only after checking that it really is a number (lesson 26).',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$_POST = ["amount" => "50000"];
var_dump($_POST["amount"] === 50000);`, why: 'It prints bool(false). The value is the text "50000", not the number 50000, so === says they differ. Convert and validate first.', right: php`<?php
$_POST = ["amount" => "50000"];
var_dump((int) $_POST["amount"] === 50000);`, logic: true },
          { wrong: php`<?php
$_GET = [];
echo $_GET["q"];`, why: 'No fatal error, but a warning “Undefined array key”. A visitor may leave any field out. Always read with ?? and a fallback.', right: php`<?php
$_GET = [];
echo $_GET["q"] ?? "nothing";`, logic: true },
          { wrong: php`<?php
parse_str("name=Ssali & Sons", $q);
echo $q["name"];`, why: 'No error, but it prints “Ssali ”. The & inside the value ended the pair, so “Sons” became a key of its own. Encode values with urlencode or http_build_query before putting them in a URL.', right: php`<?php
parse_str("name=" . urlencode("Ssali & Sons"), $q);
echo $q["name"];`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          'A web request has a method, a URL (path + query), headers and maybe a body; a response has a status code, headers and a body.',
          '`parse_url` cuts a URL up, `parse_str` turns a query string into an array, `http_build_query` and `urlencode` encode data for a URL.',
          '`$_GET`, `$_POST`, `$_SERVER` are superglobals filled in by a real web server. All values are text, and the visitor controls them.',
          'A router chooses what to do from the method and path: 404 for an unknown path, 405 for a wrong method. Status codes: 2xx fine, 4xx the client’s fault, 5xx the server’s fault.',
        ],
        memory: 'Request in, response out. All input is text. 404 path, 405 method.',
      },
    ],
    exercises: [
      {
        id: 'php25-parse-request',
        title: 'Read the request line',
        prompt: 'Read request lines like `POST /deposit?ref=7&name=Amina+B` until the input ends. For each, print `POST /deposit` and then one line per query parameter in the order given, as two spaces, the key, ` = ` and the decoded value:\n\n`POST /deposit`\n`  ref = 7`\n`  name = Amina B`\n\nA request with no query prints only the first line.',
        starter: php`<?php
while (($line = fgets(STDIN)) !== false) {
    [$method, $target] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['GET /balance?name=Amina', 'POST /deposit?ref=7&name=Amina+B&note=hello%20world', 'GET /transactions']),
        tests: [
          { input: lines(['GET /balance?name=Amina', 'POST /deposit?ref=7&name=Amina+B&note=hello%20world', 'GET /transactions']), expected: out(...['GET /balance?name=Amina', 'POST /deposit?ref=7&name=Amina+B&note=hello%20world', 'GET /transactions'].flatMap(requestLines)) },
          { input: 'GET /health\n', expected: 'GET /health', hidden: true, name: 'No query' },
          { input: lines(['POST /pay?note=Ssali+%26+Sons&amount=5000']), expected: out(...requestLines('POST /pay?note=Ssali+%26+Sons&amount=5000')), hidden: true, name: 'An encoded ampersand' },
        ],
        hints: [
          'parse_url($target) gives an array with "path" and, only when there is one, "query".',
          'if (isset($parts["query"])) { parse_str($parts["query"], $params); ... }',
          'foreach ($params as $key => $value) and print two spaces, the key, " = " and the value.',
        ],
      },
      {
        id: 'php25-router',
        title: 'A router with status text',
        prompt: 'The booth has four routes: `GET /balance` (200), `POST /deposit` (201), `POST /withdraw` (200) and `GET /transactions` (200). A known path with the wrong method gives 405, an unknown path 404. Write `statusText(int $code): string` (`OK`, `Created`, `Not Found`, `Method Not Allowed`) and `route(string $method, string $path): int`. Read lines `METHOD /path` and print `GET /balance -> 200 OK`.',
        starter: php`<?php
function statusText(int $code): string {
    // the words for 200, 201, 404 and 405
    return "";
}

function route(string $method, string $path): int {
    // the status for this method and path
    return 0;
}

while (($line = fgets(STDIN)) !== false) {
    [$method, $path] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['GET /balance', 'POST /deposit', 'GET /deposit', 'GET /nope']),
        tests: [
          { input: lines(['GET /balance', 'POST /deposit', 'GET /deposit', 'GET /nope']), expected: out(...['GET /balance', 'POST /deposit', 'GET /deposit', 'GET /nope'].map((l) => { const [m, p] = l.split(' '); const s = routeStatus(m, p); return `${l} -> ${s} ${STATUS_TEXT[s]}`; })) },
          { input: lines(['POST /withdraw', 'POST /balance', 'GET /transactions', 'POST /transactions']), expected: out(...['POST /withdraw', 'POST /balance', 'GET /transactions', 'POST /transactions'].map((l) => { const [m, p] = l.split(' '); const s = routeStatus(m, p); return `${l} -> ${s} ${STATUS_TEXT[s]}`; })), hidden: true, name: 'The other routes' },
          { input: lines(['DELETE /withdraw', 'GET /']), expected: out('DELETE /withdraw -> 405 Method Not Allowed', 'GET / -> 404 Not Found'), hidden: true, name: 'Odd requests' },
        ],
        hints: [
          'statusText: match ($code) { 200 => "OK", 201 => "Created", 404 => "Not Found", 405 => "Method Not Allowed" }',
          'Keep a table of the routes: path => [method, status]. If the path is not in the table return 404; if the method differs return 405; otherwise the status in the table.',
          'Print $method, " ", $path, " -> ", the status, " ", and statusText(status).',
        ],
      },
      {
        id: 'php25-build-url',
        title: 'Build the link',
        prompt: 'The first input line is a path, for example `/pay`. Every other line is `key=value` (split at the **first** `=`; the value may contain spaces, `&` or `=`). Print the full link with the query built by `http_build_query`: `/pay?name=Amina+B&amount=50000`. With no key-value lines, print only the path.',
        starter: php`<?php
$base = trim(fgets(STDIN));
$params = [];
while (($line = fgets(STDIN)) !== false) {
    $line = rtrim($line, "\r\n");
}
`,
        usesInput: true,
        sampleInput: lines(['/pay', 'name=Amina B', 'amount=50000']),
        tests: [
          { input: lines(['/pay', 'name=Amina B', 'amount=50000']), expected: '/pay?' + new URLSearchParams([['name', 'Amina B'], ['amount', '50000']]).toString() },
          { input: '/health\n', expected: '/health', hidden: true, name: 'No parameters' },
          { input: lines(['/search', 'q=Ssali & Sons', 'expr=1+1=2']), expected: '/search?' + new URLSearchParams([['q', 'Ssali & Sons'], ['expr', '1+1=2']]).toString(), hidden: true, name: 'Characters that need encoding' },
        ],
        hints: [
          'explode("=", $line, 2) splits at the first = only, so the value keeps any later = signs.',
          'Skip empty lines. Store each pair with $params[$key] = $value;',
          'If $params is empty print $base alone, otherwise $base . "?" . http_build_query($params).',
        ],
      },
    ],
  },

  // ================================================================== 26
  {
    id: 'php-forms',
    level: LEVEL,
    minutes: 32,
    title: 'Forms and validation',
    summary: 'Never trust input: trimming, filter_var, whitelists, and collecting error messages per field',
    blocks: [
      {
        t: 'story',
        title: 'The customer who typed 12o000',
        text: "Amina opens the booth's web form on her phone. In the amount box she types `12o000`, with a letter o instead of a zero. The old program turned it into the number 12 and happily deposited 12 shillings. Another customer left the name empty. A third pasted 4,000 words into it.\n\nOnce the booth is on the internet, **every** piece of input is untrusted: it may be a typo, a missing field, or on purpose a trick. The rule of professional programmers is simple: **validate everything that comes in, on the server**. A browser may check the form too, but a browser check is only a courtesy to the customer; anyone can bypass it.",
      },
      { t: 'h', text: 'filter_var: checking one value' },
      {
        t: 'try',
        code: php`<?php
var_dump(filter_var("120000", FILTER_VALIDATE_INT));
var_dump(filter_var("12o000", FILTER_VALIDATE_INT));
var_dump(filter_var("a@b.ug", FILTER_VALIDATE_EMAIL));
var_dump(filter_var("500", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1000]]));
`,
        output: out('int(120000)', 'bool(false)', 'string(6) "a@b.ug"', 'bool(false)'),
      },
      {
        t: 'list',
        items: [
          '`filter_var($value, FILTER_VALIDATE_INT)` gives the number as an `int`, or `false` when the text is not a whole number.',
          'Options go inside an `"options"` array: `["options" => ["min_range" => 1000, "max_range" => 5000000]]`.',
          '`FILTER_VALIDATE_EMAIL` checks the shape of an email address.',
          'The failure signal is `false`, and 0 is a valid number that is also falsy: always test with `=== false`.',
        ],
      },
      { t: 'h', text: 'Validate a whole form: collect the errors' },
      { t: 'p', text: 'Do not stop at the first problem. Collect **every** error, keyed by field, so the customer can fix everything in one go. A good validator **returns** the clean data and the list of errors, and does not print anything itself:' },
      {
        t: 'try',
        code: php`<?php
function validate(array $input): array {
    $errors = [];

    $name = trim($input["name"] ?? "");
    if ($name === "") {
        $errors["name"] = "Name is required";
    } elseif (mb_strlen($name) > 40) {
        $errors["name"] = "Name is too long";
    }

    $amount = filter_var($input["amount"] ?? "", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1000, "max_range" => 5000000]]);
    if ($amount === false) {
        $errors["amount"] = "Amount must be a whole number from 1,000 to 5,000,000";
    }

    return [["name" => $name, "amount" => $amount], $errors];
}

foreach ([["name" => " Amina ", "amount" => "50000"], ["name" => "  ", "amount" => "12o000"]] as $input) {
    [$clean, $errors] = validate($input);
    if ($errors === []) {
        echo "OK: ", $clean["name"], " ", $clean["amount"], "\n";
    } else {
        foreach ($errors as $field => $message) {
            echo $field, ": ", $message, "\n";
        }
    }
}
`,
        output: out('OK: Amina 50000', 'name: Name is required', 'amount: Amount must be a whole number from 1,000 to 5,000,000'),
      },
      { t: 'h', text: 'A whitelist for choices' },
      { t: 'p', text: 'When a field must be one of a few values (the service), never use the text directly. Let an **enum** decide: `tryFrom` returns the case or `null`, which is the whole whitelist check in one line (lesson 22):' },
      {
        t: 'try',
        code: php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
}

foreach (["deposit", "loan", "WITHDRAW"] as $text) {
    $service = Service::tryFrom(strtolower(trim($text)));
    echo $text, ": ", $service === null ? "not allowed" : $service->name, "\n";
}
`,
        output: out('deposit: Deposit', 'loan: not allowed', 'WITHDRAW: Withdraw'),
      },
      {
        t: 'list',
        items: [
          '**Trim** text first (`trim`), then check it is not empty, then check its length with `mb_strlen` (so Luganda letters count once).',
          '**Validate, do not “clean up”.** Reject bad input with a message; do not silently change it into something else.',
          'Check **type**: a field may arrive as an array (`name[]=x`). `trim()` on an array stops the program, so check `is_string` first.',
          'Validate on the **server**, always. Browser checks are only for the customer’s comfort.',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
var_dump(filter_var("0", FILTER_VALIDATE_INT));
`,
        question: 'What does this program print?',
        options: ['int(0)', 'bool(false)', 'NULL', 'string(1) "0"'],
        answer: 0,
        explain: '“0” is a perfectly good whole number, so filter_var returns the int 0. Be careful: 0 is falsy in an if, which is why the failure test must be === false.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the filter that accepts only whole numbers.',
        template: php`<?php
var_dump(filter_var("120000", ___));
`,
        blanks: [{ options: ['FILTER_VALIDATE_INT', 'FILTER_VALIDATE_EMAIL', 'FILTER_VALIDATE_BOOLEAN'], answer: 'FILTER_VALIDATE_INT' }],
        output: 'int(120000)\n',
      },
      {
        t: 'bug',
        code: php`<?php
$input = ["name" => ["a", "b"]];
echo trim($input["name"]), "\n";
`,
        question: 'This program stops with a “TypeError”. What happened?',
        options: ['The name arrived as an array, and trim() only accepts text', 'trim cannot be used on names', 'The array must be sorted first', 'echo cannot print a name'],
        answer: 0,
        explain: 'A visitor can send name[]=a&name[]=b and PHP then gives you an array. Always check the type of untrusted input before using a text function on it.',
        fixed: php`<?php
$input = ["name" => ["a", "b"]];
$name = is_string($input["name"] ?? null) ? trim($input["name"]) : "";
echo $name === "" ? "invalid" : $name, "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order so the program trims the input, validates it, and prints the result.',
        lines: ['<?php', '$input = ["amount" => " 5000 "];', '$raw = trim($input["amount"]);', '$amount = filter_var($raw, FILTER_VALIDATE_INT);', 'if ($amount === false) {', '    echo "invalid\\n";', '} else { echo "ok ", $amount, "\\n"; }'],
        output: 'ok 5000\n',
      },
      {
        t: 'quiz',
        question: 'The browser form already checks the amount. Why must the server check it again?',
        options: ['Anyone can send a request without using the form, so the browser check can be bypassed', 'Browsers do not know about numbers', 'PHP is faster at checking', 'It is only a habit'],
        answer: 0,
        explain: 'A request is just text sent over the internet. A person (or a program) can send any request they like without ever opening your form. Only the server’s checks are real.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
if (!filter_var("0", FILTER_VALIDATE_INT)) {
    echo "invalid";
} else {
    echo "ok";
}`, why: 'No error, but 0 is reported invalid. The valid result 0 is falsy, so !0 is true. Compare with === false.', right: php`<?php
if (filter_var("0", FILTER_VALIDATE_INT) === false) {
    echo "invalid";
} else {
    echo "ok";
}`, logic: true },
          { wrong: php`<?php
var_dump(filter_var("5", FILTER_VALIDATE_INT, ["min_range" => 1000]));`, why: 'No error, but it prints int(5): the limit was silently ignored. Options must be wrapped in an "options" key: ["options" => ["min_range" => 1000]].', right: php`<?php
var_dump(filter_var("5", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1000]]));`, logic: true },
          { wrong: php`<?php
$input = ["name" => "   "];
if ($input["name"] === "") {
    echo "missing";
} else {
    echo "ok";
}`, why: 'No error, but a name of three spaces counts as present. Trim first, then compare: trim($input["name"]) === "".', right: php`<?php
$input = ["name" => "   "];
if (trim($input["name"]) === "") {
    echo "missing";
} else {
    echo "ok";
}`, logic: true },
          { wrong: php`<?php
enum Service: string {
    case Deposit = "deposit";
}
echo Service::from("loan")->name;`, why: 'from() stops with a ValueError for an unknown value, so one wrong request would crash the page. For input from outside use tryFrom() and check for null.', right: php`<?php
enum Service: string {
    case Deposit = "deposit";
}
echo Service::tryFrom("loan")?->name ?? "not allowed";` },
        ],
      },
      {
        t: 'recap',
        items: [
          'All input is untrusted. Validate on the server, collect **every** error by field, and return clean data plus the errors list.',
          '`trim`, then required, then `mb_strlen`. Check `is_string` before text functions: input can be an array.',
          '`filter_var($v, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 9]])` returns the number or `false`: test with `=== false`.',
          'A whitelist (`Enum::tryFrom`) is the safest check for a fixed set of choices.',
        ],
        memory: 'Trust nothing. Trim, check, collect errors. === false.',
      },
    ],
    exercises: [
      {
        id: 'php26-validate-deposit',
        title: 'Validate the deposit form',
        prompt: 'The input has three lines: name, amount, phone. Validate like the lesson, collecting every error, in this order:\n\n- **name**: trimmed; empty → `name: Name is required`; longer than 40 characters → `name: Name is too long`\n- **amount**: a whole number from 1,000 to 5,000,000 → otherwise `amount: Amount must be a whole number from 1,000 to 5,000,000`\n- **phone**: ten digits starting with 0 → otherwise `phone: Phone must be 10 digits starting with 0`\n\nIf there are errors print them (one per line). If not, print `OK: Amina deposits UGX 50,000 from 0772123456`.',
        starter: php`<?php
$input = [
    "name" => fgets(STDIN),
    "amount" => fgets(STDIN),
    "phone" => fgets(STDIN),
];
`,
        usesInput: true,
        sampleInput: lines(['Amina', '50000', '0772123456']),
        tests: [
          { input: lines(['Amina', '50000', '0772123456']), expected: validateDeposit('Amina', '50000', '0772123456') },
          { input: lines(['   ', '12o000', '077212345']), expected: validateDeposit('   ', '12o000', '077212345'), hidden: true, name: 'Everything wrong' },
          { input: lines(['  Grace  ', '5000001', '0772123456']), expected: validateDeposit('  Grace  ', '5000001', '0772123456'), hidden: true, name: 'Amount too big' },
          { input: lines(['A'.repeat(41), '1000', '0701234567']), expected: validateDeposit('A'.repeat(41), '1000', '0701234567'), hidden: true, name: 'A name that is too long' },
          { input: lines(['Dan', '999', '0701234567']), expected: validateDeposit('Dan', '999', '0701234567'), hidden: true, name: 'Just under the minimum' },
        ],
        hints: [
          'Trim every value first: $name = trim($input["name"]); and the same for the others.',
          'For the amount: filter_var($amount, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1000, "max_range" => 5000000]]) === false means an error. For the phone: preg_match(\'/^0[0-9]{9}$/\', $phone) !== 1.',
          'Collect messages in an array keyed by field; if it is empty print the OK line with number_format, otherwise print each "field: message".',
        ],
      },
      {
        id: 'php26-service-form',
        title: 'Service and amount',
        prompt: 'Read lines `service,amount`. The service must be one of `deposit`, `withdraw` or `send` (letters in any case, spaces around are fine): use a backed enum and `tryFrom`. The amount must be a whole number above 0 (`filter_var` with `min_range` 1). For a good line print `Send UGX 12,000`; otherwise print one line for each problem: `service: Unknown service "loan"` (with the text typed, trimmed) and/or `amount: Invalid amount`.',
        starter: php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
    case Send = "send";
}

while (($line = fgets(STDIN)) !== false) {
    [$service, $amount] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['send,12000', 'loan,5000', 'deposit,abc']),
        tests: [
          { input: lines(['send,12000', 'loan,5000', 'deposit,abc']), expected: out('Send UGX 12,000', 'service: Unknown service "loan"', 'amount: Invalid amount') },
          { input: lines([' WITHDRAW , 500 ', 'loan,0']), expected: out('Withdraw UGX 500', 'service: Unknown service "loan"', 'amount: Invalid amount'), hidden: true, name: 'Spaces, capitals and zero' },
          { input: lines(['pay,x']), expected: out('service: Unknown service "pay"', 'amount: Invalid amount'), hidden: true, name: 'Both wrong' },
        ],
        hints: [
          'Trim both parts first. Service::tryFrom(strtolower($service)) gives a case or null.',
          'filter_var($amount, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]) gives the number or false.',
          'Collect error lines (service first, then amount). With no errors print $case->name, " UGX " and number_format($amount).',
        ],
      },
      {
        id: 'php26-form-errors',
        title: 'Required fields',
        prompt: 'Write `required(array $input, array $fields): array` that returns the list of missing fields: a field is missing when it is absent or blank after trimming. The first input line lists the required fields separated by commas. The other lines are `key=value` pairs of ONE form. Print `Missing: name, phone` (in the order of the required list) or `All fields present`.',
        starter: php`<?php
function required(array $input, array $fields): array {
    // return the names of the fields that are absent or blank
    return [];
}

$fields = explode(",", trim(fgets(STDIN)));
$input = [];
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
}
`,
        usesInput: true,
        sampleInput: lines(['name,amount,phone', 'name=Amina', 'amount=  ', 'extra=1']),
        tests: [
          { input: lines(['name,amount,phone', 'name=Amina', 'amount=  ', 'extra=1']), expected: 'Missing: amount, phone' },
          { input: lines(['name,phone', 'name=Dan', 'phone=0772123456']), expected: 'All fields present', hidden: true, name: 'Nothing missing' },
          { input: lines(['a,b,c', 'c=1']), expected: 'Missing: a, b', hidden: true, name: 'Order of the required list' },
        ],
        hints: [
          'For every required field: $value = $input[$field] ?? ""; it is missing when trim($value) === "".',
          'Return the missing names as an array; implode(", ", ...) joins them for printing.',
          'Build $input from the lines with explode("=", $line, 2).',
        ],
      },
    ],
  },

  // ================================================================== 27
  {
    id: 'php-security',
    level: LEVEL,
    minutes: 34,
    title: 'Keeping it safe',
    summary: 'Cross-site scripting, SQL injection, password hashing and comparing secrets',
    blocks: [
      {
        t: 'story',
        title: 'FREE MONEY',
        text: "The shop has a screen that shows the names of the customers who just paid. One afternoon the screen shows, in huge flashing letters, “FREE MONEY AT THE BOOTH NEXT DOOR”. A customer typed that, with a bit of HTML around it, as his **name**, and the page printed it exactly as typed, so the browser obeyed it. With a little more skill he could have stolen other customers' sessions.\n\nMoney software is a target. Four habits stop most attacks: **escape what you print**, **separate data from SQL**, **hash passwords**, and **compare secrets carefully**. Each is only a few lines of PHP.",
      },
      { t: 'h', text: 'Output escaping (against XSS)' },
      { t: 'p', text: 'When you put user text into a web page, the browser cannot tell the difference between your HTML and the visitor’s. `htmlspecialchars` turns the characters that have a meaning in HTML (`<` `>` `&` and quotes) into harmless codes. This attack is called **cross-site scripting**, XSS.' },
      {
        t: 'try',
        code: php`<?php
function e(string $text): string {
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

$name = '<script>steal()</script>';
echo "<p>Welcome, " . $name . "</p>\n";
echo "<p>Welcome, " . e($name) . "</p>\n";
`,
        output: out('<p>Welcome, <script>steal()</script></p>', '<p>Welcome, &lt;script&gt;steal()&lt;/script&gt;</p>'),
      },
      { t: 'tip', text: 'The first line is **dangerous**: it would run the visitor’s script in every browser that opens the page. The second shows the text as text. Make a habit: every value that came from outside goes through `e()` at the moment it is printed into HTML, and nowhere earlier. (Printing into JSON or a plain text file needs a different treatment: escape for the place where the text lands.)' },
      { t: 'h', text: 'SQL injection' },
      { t: 'p', text: 'If you build an SQL statement by gluing text together, the visitor can write SQL too. Here a login search is attacked with the input `x\' OR \'1\'=\'1`. The first query is glued (dangerous), the second uses a **prepared statement**, where the data travels separately and can never become SQL:' },
      {
        t: 'try',
        code: php`<?php
$db = new PDO("sqlite::memory:");
$db->exec("create table users(name text, secret text)");
$db->exec("insert into users values('amina','pin-1111'),('brian','pin-2222')");

$input = "x' OR '1'='1";

$unsafe = "select name from users where name = '" . $input . "'";
echo $unsafe, "\n";
echo count($db->query($unsafe)->fetchAll()), " rows\n";

$stmt = $db->prepare("select name from users where name = ?");
$stmt->execute([$input]);
echo count($stmt->fetchAll()), " rows\n";
`,
        output: out("select name from users where name = 'x' OR '1'='1'", '2 rows', '0 rows'),
      },
      { t: 'p', text: 'The glued query became `where name = \'x\' OR \'1\'=\'1\'`, which is true for every row: the attacker received the whole table. The prepared version looked for a user whose name is literally that odd text and found nobody. Lesson 29 makes prepared statements a daily habit.' },
      { t: 'h', text: 'Passwords: hash, never store' },
      { t: 'p', text: 'Never keep a password. Keep a **hash**: a scrambled version that cannot be turned back. `password_hash` adds a random **salt** and uses a deliberately slow algorithm, and `password_verify` checks a typed password against the hash:' },
      {
        t: 'try',
        code: php`<?php
$hash = password_hash("secret123", PASSWORD_DEFAULT);
echo strlen($hash), " ", str_starts_with($hash, '$2y$') ? "bcrypt" : "other", "\n";
var_dump(password_verify("secret123", $hash));
var_dump(password_verify("Secret123", $hash));
var_dump($hash === password_hash("secret123", PASSWORD_DEFAULT));
`,
        output: out('60 bcrypt', 'bool(true)', 'bool(false)', 'bool(false)'),
      },
      { t: 'p', text: 'Two hashes of the same password are different (each has its own salt), so you never compare hashes yourself: you always ask `password_verify`. Never use `md5` or `sha1` for passwords: they are fast, so attackers can try billions of guesses a second.' },
      { t: 'h', text: 'Comparing secrets' },
      { t: 'p', text: 'Tokens, signatures and API keys are secrets. Create them with `random_bytes` (real randomness, never `rand()`), and compare them with `hash_equals`, which takes the same time however many characters match and which compares as **text**, not as numbers:' },
      {
        t: 'try',
        code: php`<?php
$token = bin2hex(random_bytes(16));
echo strlen($token), "\n";
var_dump(hash_equals($token, $token));
var_dump(hash_equals($token, "guess"));
var_dump("0e1234" == "0e5678");
var_dump(hash_equals("0e1234", "0e5678"));
`,
        output: out('32', 'bool(true)', 'bool(false)', 'bool(true)', 'bool(false)'),
      },
      { t: 'p', text: 'See the last two lines: `"0e1234" == "0e5678"` is **true**, because PHP reads both as the number 0 in scientific notation. Comparing secrets with `==` can let a wrong value through. `hash_equals` (or `===`) cannot be fooled like that.' },
      {
        t: 'list',
        items: [
          '**Escape output** (`htmlspecialchars`) where it lands in a page. **Validate input** where it comes in (lesson 26).',
          '**Prepared statements** for every query with outside data. Never glue.',
          '**`password_hash`** and **`password_verify`**. Same error message for “no such user” and “wrong password”, so attackers learn nothing.',
          '**Do not show internal errors** to visitors (they show file names and queries). On a real server set `display_errors=Off` and write errors to a log; show the visitor a plain “Something went wrong”.',
          'Give each part the smallest power it needs (a database user that can only read what it must).',
        ],
      },
      {
        t: 'predict',
        code: php`<?php
echo htmlspecialchars("<b>");
`,
        question: 'What does this program print?',
        options: ['&lt;b&gt;', '<b>', 'b', '&amp;lt;b&amp;gt;'],
        answer: 0,
        explain: 'The characters < and > become &lt; and &gt;. A browser shows them as the text <b> instead of making the following text bold.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the function that makes text safe to print inside HTML.',
        template: php`<?php
echo ___("<i>hi</i>", ENT_QUOTES), "\n";
`,
        blanks: [{ options: ['htmlspecialchars', 'strtoupper', 'strlen'], answer: 'htmlspecialchars' }],
        output: '&lt;i&gt;hi&lt;/i&gt;\n',
      },
      {
        t: 'bug',
        code: php`<?php
var_dump(hash_equals(123, "123"));
`,
        question: 'This program stops with a “TypeError”. What is wrong?',
        options: ['hash_equals compares two texts, and 123 is a number', 'hash_equals needs three arguments', 'The strings are too short', 'var_dump cannot print a bool'],
        answer: 0,
        explain: 'Both arguments must be strings, which is part of what makes the comparison safe. Convert a number with (string) or use a text token in the first place.',
        fixed: php`<?php
var_dump(hash_equals("123", "123"));
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: register a password (store only the hash), then check a login attempt.',
        lines: ['<?php', '// store the hash, never the password', '$typed = "secret123";', '$hash = password_hash($typed, PASSWORD_DEFAULT);', '$attempt = "secret123";', '$ok = password_verify($attempt, $hash);', 'echo $ok ? "welcome" : "wrong", "\\n";'],
        output: 'welcome\n',
      },
      {
        t: 'quiz',
        question: 'Why is md5 a bad way to store passwords?',
        options: ['It is very fast, so attackers can try billions of guesses, and it has no salt', 'It makes the password longer', 'It only works for numbers', 'It cannot be used in PHP 8'],
        answer: 0,
        explain: 'Password hashing must be slow and salted on purpose. password_hash is built for that; md5 was built to be fast.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
$name = 'x" onfocus="steal()';
echo '<input value="' . $name . '">';`, why: 'No error, but the visitor’s quote closes the value and adds an event of his own: <input value="x" onfocus="steal()">. Escape with htmlspecialchars and ENT_QUOTES, so quotes become &quot;.', right: php`<?php
$name = 'x" onfocus="steal()';
echo '<input value="' . htmlspecialchars($name, ENT_QUOTES) . '">';`, logic: true },
          { wrong: php`<?php
echo md5("secret");`, why: 'No error, but md5 gives the same fixed hash for every “secret”, and attackers keep huge tables of such hashes. It is the wrong tool for passwords. Use password_hash.', right: php`<?php
echo strlen(password_hash("secret", PASSWORD_DEFAULT));`, logic: true },
          { wrong: php`<?php
var_dump("0e1234" == "0e5678");`, why: 'It prints bool(true). Both texts look like the number 0 in scientific notation, so == treats them as equal. Compare secrets with hash_equals or ===.', right: php`<?php
var_dump(hash_equals("0e1234", "0e5678"));`, logic: true },
          { wrong: php`<?php
echo htmlspecialchars(["<b>"]);`, why: 'htmlspecialchars needs text, and request data can arrive as an array. PHP 8 stops with a TypeError. Check is_string() before using text functions on input.', right: php`<?php
echo implode(", ", array_map("htmlspecialchars", ["<b>"]));` },
        ],
      },
      {
        t: 'recap',
        items: [
          '**XSS:** escape every outside value with `htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8")` when printing it into HTML.',
          '**SQL injection:** never glue input into SQL; use prepared statements and pass the data separately.',
          '**Passwords:** `password_hash` to store, `password_verify` to check; never md5/sha1; the same message for every login failure.',
          '**Secrets:** make them with `random_bytes`, compare with `hash_equals`, never with `==`. Do not show internal errors to visitors.',
        ],
        memory: 'Escape out. Prepare queries. Hash passwords. hash_equals for secrets.',
      },
    ],
    exercises: [
      {
        id: 'php27-escape',
        title: 'Safe customer list',
        prompt: 'The input is a list of customer names, one per line (they may contain `<`, `>`, `&` and quotes). Print an HTML list, with every name escaped by `htmlspecialchars` (flags `ENT_QUOTES | ENT_SUBSTITUTE`, encoding UTF-8):\n\n`<ul>`\n`<li>Amina</li>`\n`</ul>`',
        starter: php`<?php
echo "<ul>\n";
while (($line = fgets(STDIN)) !== false) {
    $name = rtrim($line, "\r\n");
}
echo "</ul>\n";
`,
        usesInput: true,
        sampleInput: lines(['Amina', '<b>FREE MONEY</b>', 'Ssali & Sons']),
        tests: [
          { input: lines(['Amina', '<b>FREE MONEY</b>', 'Ssali & Sons']), expected: out('<ul>', ...['Amina', '<b>FREE MONEY</b>', 'Ssali & Sons'].map((n) => `<li>${esc(n)}</li>`), '</ul>') },
          { input: lines([`O'Neil "Joe"`, '1 < 2 > 0']), expected: out('<ul>', ...[`O'Neil "Joe"`, '1 < 2 > 0'].map((n) => `<li>${esc(n)}</li>`), '</ul>'), hidden: true, name: 'Quotes and angle brackets' },
          { input: lines(['<script>steal()</script>']), expected: out('<ul>', '<li>&lt;script&gt;steal()&lt;/script&gt;</li>', '</ul>'), hidden: true, name: 'A script tag' },
        ],
        hints: [
          'Write a small function e(string $t): string that returns htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8").',
          'Inside the loop print "<li>" . e($name) . "</li>\\n".',
          'The starter already prints the <ul> and </ul> lines.',
        ],
      },
      {
        id: 'php27-login',
        title: 'Register and log in',
        prompt: 'Read commands `register name password` and `login name password` (no spaces inside the words). Keep an array name → password **hash** (never the password). `register`: print `Registered name`, or `Name taken` if it exists. `login`: print `Welcome name` when the password is right, otherwise **the same line for an unknown name and for a wrong password**: `Wrong name or password`.',
        starter: php`<?php
$users = [];
while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['register amina pass123', 'login amina pass123', 'login amina nope', 'login brian pass123']),
        tests: [
          { input: lines(['register amina pass123', 'login amina pass123', 'login amina nope', 'login brian pass123']), expected: out('Registered amina', 'Welcome amina', 'Wrong name or password', 'Wrong name or password') },
          { input: lines(['register dan x', 'register dan y', 'login dan y', 'login dan x']), expected: out('Registered dan', 'Name taken', 'Wrong name or password', 'Welcome dan'), hidden: true, name: 'Second registration is refused' },
          { input: lines(['login nobody secret']), expected: 'Wrong name or password', hidden: true, name: 'No users at all' },
        ],
        hints: [
          '$users[$name] = password_hash($password, PASSWORD_DEFAULT); stores the hash.',
          'For a login: isset($users[$name]) && password_verify($password, $users[$name]).',
          'Use one single echo for both failures, so the program cannot tell the visitor which part was wrong.',
        ],
      },
      {
        id: 'php27-token-check',
        title: 'Compare the tokens',
        prompt: 'Each input line has an expected token and a given token separated by a space. Print `valid` when they are exactly equal and `invalid` otherwise, using a comparison that cannot be fooled by number-looking texts like `0e1234` and `0e5678`.',
        starter: php`<?php
while (($line = fgets(STDIN)) !== false) {
    [$expected, $given] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: lines(['abc123 abc123', 'abc123 abc124']),
        tests: [
          { input: lines(['abc123 abc123', 'abc123 abc124']), expected: out('valid', 'invalid') },
          { input: lines(['0e1234 0e5678', '0e1234 0e1234']), expected: out('invalid', 'valid'), hidden: true, name: 'Texts that look like the number zero' },
          { input: lines(['123 0123', 'a1b2 A1B2']), expected: out('invalid', 'invalid'), hidden: true, name: 'Leading zero and capitals' },
        ],
        hints: [
          'Both parts are text already, so hash_equals($expected, $given) is allowed.',
          'It returns true only when every character is equal, so "0e1234" and "0e5678" are different.',
          'Print valid or invalid for each line.',
        ],
      },
    ],
  },
];
