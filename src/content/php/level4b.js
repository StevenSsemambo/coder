// PHP, Level 4: Objects. Lessons 22 to 24 (interfaces, traits and enums; exceptions; the Wallet project).
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, boothFee, walletSession, WALLET_LIB, walletMain } from './shared.js';

const LEVEL = 'Level 4: Objects';
const lines = (a) => a.join('\n') + '\n';

// Stage 1 and 2 of the wallet project (the full program is WALLET_LIB + walletMain()).
const PARSE = php`
function parseAmount(string $text): int {
    if (!ctype_digit($text)) {
        throw new InvalidAmountException("Not a whole number: " . $text);
    }
    return (int) $text;
}
`;
const STAGE1 =
  php`<?php
declare(strict_types=1);

class InvalidAmountException extends InvalidArgumentException {}

final class Wallet {
    private int $balance = 0;

    public function balance(): int {
        return $this->balance;
    }

    public function deposit(int $amount): void {
        if ($amount <= 0) {
            throw new InvalidAmountException("Amount must be above zero");
        }
        $this->balance += $amount;
    }
}
` +
  PARSE +
  php`
$wallet = new Wallet();
while (($line = fgets(STDIN)) !== false) {
    $parts = preg_split('/\s+/', trim($line));
    $command = strtolower($parts[0]);
    if ($command === "") {
        continue;
    }
    try {
        if ($command === "deposit") {
            $amount = parseAmount($parts[1] ?? "");
            $wallet->deposit($amount);
            echo "Deposited UGX ", number_format($amount), ". Balance: UGX ", number_format($wallet->balance()), "\n";
        } elseif ($command === "balance") {
            echo "Balance: UGX ", number_format($wallet->balance()), "\n";
        } else {
            echo "Unknown command: ", $command, "\n";
        }
    } catch (InvalidAmountException $e) {
        echo "Declined: ", $e->getMessage(), "\n";
    }
}
`;
const STAGE2 =
  php`<?php
declare(strict_types=1);

class InvalidAmountException extends InvalidArgumentException {}

class InsufficientFundsException extends RuntimeException {
    public function __construct(public readonly int $missing) {
        parent::__construct("Short by UGX " . number_format($missing));
    }
}

final class Wallet {
    private int $balance = 0;

    public function balance(): int {
        return $this->balance;
    }

    public function deposit(int $amount): void {
        $this->requirePositive($amount);
        $this->balance += $amount;
    }

    public function withdraw(int $amount): int {
        $this->requirePositive($amount);
        $fee = self::feeFor($amount);
        $needed = $amount + $fee;
        if ($needed > $this->balance) {
            throw new InsufficientFundsException($needed - $this->balance);
        }
        $this->balance -= $needed;
        return $fee;
    }

    private function requirePositive(int $amount): void {
        if ($amount <= 0) {
            throw new InvalidAmountException("Amount must be above zero");
        }
    }

    private static function feeFor(int $amount): int {
        if ($amount <= 50000) {
            return 1000;
        }
        return $amount <= 200000 ? 2000 : 3500;
    }
}
` +
  PARSE +
  php`
$wallet = new Wallet();
while (($line = fgets(STDIN)) !== false) {
    $parts = preg_split('/\s+/', trim($line));
    $command = strtolower($parts[0]);
    if ($command === "") {
        continue;
    }
    try {
        if ($command === "deposit") {
            $amount = parseAmount($parts[1] ?? "");
            $wallet->deposit($amount);
            echo "Deposited UGX ", number_format($amount), ". Balance: UGX ", number_format($wallet->balance()), "\n";
        } elseif ($command === "withdraw") {
            $amount = parseAmount($parts[1] ?? "");
            $fee = $wallet->withdraw($amount);
            echo "Withdrew UGX ", number_format($amount), " (fee UGX ", number_format($fee), "). Balance: UGX ", number_format($wallet->balance()), "\n";
        } elseif ($command === "balance") {
            echo "Balance: UGX ", number_format($wallet->balance()), "\n";
        } else {
            echo "Unknown command: ", $command, "\n";
        }
    } catch (InvalidAmountException | InsufficientFundsException $e) {
        echo "Declined: ", $e->getMessage(), "\n";
    }
}
`;

const S1 = ['deposit 50000', 'deposit 20000', 'balance', 'deposit abc', 'deposit 0'];
const S2 = ['deposit 50000', 'withdraw 30000', 'withdraw 90000', 'withdraw 0', 'balance'];
const S3 = ['deposit 50000', 'withdraw 30000', 'deposit 100000', 'withdraw 120000', 'withdraw 900000', 'statement', 'balance'];

// For exercise php24-summary: the library with a gap where the learner writes two methods.
const LIB_WITH_GAP = WALLET_LIB.replace('    private function requirePositive', '    // write count() and feesPaid() here\n\n    private function requirePositive');

export const level4b = [
  // ================================================================== 22
  {
    id: 'php-interfaces',
    level: LEVEL,
    minutes: 32,
    title: 'Interfaces, traits and enums',
    summary: 'Promises between classes, sharing code without a parent, and a fixed list of allowed values',
    blocks: [
      {
        t: 'story',
        title: 'Different things that can all be printed',
        text: "The booth gets a small printer. It can print a receipt, a daily summary, an SMS text for the customer. They are not related: a receipt is not a kind of SMS. But the printer only needs to know one thing about each of them: “can you give me your text?”\n\nAn **interface** is exactly that: a list of methods a class promises to have, with no code in them. Any class that keeps the promise can be given to the printer, however different it is from the others. And when a value has only a few allowed possibilities (the services of the booth: deposit, withdraw, send) PHP offers an **enum**.",
      },
      {
        t: 'try',
        code: php`<?php
interface Printable {
    public function render(): string;
}

class Receipt implements Printable {
    public function __construct(private string $name, private int $amount) {}

    public function render(): string {
        return "RECEIPT " . $this->name . " UGX " . number_format($this->amount);
    }
}

class SmsMessage implements Printable {
    public function __construct(private string $phone, private string $text) {}

    public function render(): string {
        return "SMS to " . $this->phone . ": " . $this->text;
    }
}

function show(Printable $item): void {
    echo $item->render(), "\n";
}

show(new Receipt("Amina", 120000));
show(new SmsMessage("0772123456", "You paid UGX 120,000"));
`,
        output: out('RECEIPT Amina UGX 120,000', 'SMS to 0772123456: You paid UGX 120,000'),
      },
      {
        t: 'list',
        items: [
          '`interface Printable { ... }` lists method names, parameters and return types, with no bodies.',
          '`class Receipt implements Printable` promises to write **all** those methods. PHP checks the promise.',
          'A function that asks for a `Printable` accepts any object that keeps the promise. It needs to know nothing else about it.',
          'A class has **one** parent (`extends`) but may `implements` as many interfaces as it likes (separated by commas).',
        ],
      },
      { t: 'p', text: 'The difference from an abstract class (lesson 21): an abstract class shares code and a family (“is a”), an interface only describes **what an object can do** (“can be printed”). Different, unrelated classes can share an interface.' },
      { t: 'h', text: 'Traits: sharing code without a parent' },
      { t: 'p', text: 'Sometimes two unrelated classes need the same ready-made helper. A **trait** is a bundle of methods that you paste into a class with `use`:' },
      {
        t: 'try',
        code: php`<?php
trait FormatsMoney {
    protected function ugx(int $n): string {
        return "UGX " . number_format($n);
    }
}

class Receipt {
    use FormatsMoney;
    public function __construct(private int $amount) {}
    public function line(): string {
        return "Paid " . $this->ugx($this->amount);
    }
}

class Invoice {
    use FormatsMoney;
    public function __construct(private int $amount) {}
    public function line(): string {
        return "Owes " . $this->ugx($this->amount);
    }
}

echo (new Receipt(120000))->line(), "\n";
echo (new Invoice(35000))->line(), "\n";
`,
        output: out('Paid UGX 120,000', 'Owes UGX 35,000'),
      },
      { t: 'h', text: 'enum: a fixed list of possibilities' },
      { t: 'p', text: 'Until now the service of a transaction was a string, and a typo like `"widthraw"` would sneak in. An **enum** lists the only allowed values. Each one is a `case`. A **backed** enum gives every case a value (here a string) that you can convert to and from:' },
      {
        t: 'try',
        code: php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
    case Send = "send";

    public function label(): string {
        return ucfirst($this->value);
    }
}

echo Service::Send->value, "\n";
echo Service::from("withdraw")->label(), "\n";
var_dump(Service::tryFrom("loan"));
echo implode(", ", array_map(fn($s) => $s->name, Service::cases())), "\n";
`,
        output: out('send', 'Withdraw', 'NULL', 'Deposit, Withdraw, Send'),
      },
      {
        t: 'list',
        items: [
          '`Service::Send` is one case. `->value` is its text and `->name` its name.',
          '`Service::from("send")` turns text into the case, and stops with an error if there is no such case.',
          '`Service::tryFrom("loan")` gives `null` instead of an error: the way to check input.',
          '`Service::cases()` lists all the cases. Enums can have methods, like classes.',
        ],
      },
      { t: 'p', text: 'Enums and `match` (lesson 6) are made for each other. A `match` on `$this` that forgets a case stops with an error, so you notice at once when someone adds a new service:' },
      {
        t: 'try',
        code: php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
    case Send = "send";

    public function fee(int $amount): int {
        return match ($this) {
            self::Deposit => 0,
            self::Withdraw => $amount <= 50000 ? 1000 : ($amount <= 200000 ? 2000 : 3500),
            self::Send => 1500,
        };
    }
}

echo Service::Withdraw->fee(120000), " ", Service::Deposit->fee(5), "\n";
var_dump(Service::from("send") === Service::Send);
`,
        output: out('2000 0', 'bool(true)'),
      },
      { t: 'tip', text: 'Enum cases are single objects, so compare them with `===` (`$service === Service::Send`). Typing a parameter as `Service` instead of `string` means the function can only ever receive a valid service.' },
      {
        t: 'predict',
        code: php`<?php
enum Service: string {
    case Send = "send";
    case Pay = "pay";

    public function label(): string {
        return ucfirst($this->value);
    }
}
echo Service::from("send")->label();
`,
        question: 'What does this program print?',
        options: ['Send', 'send', 'Service', 'Nothing: from needs a number'],
        answer: 0,
        explain: 'from("send") finds the case whose value is "send", which is Service::Send. Its label() makes the first letter a capital: Send.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that says a class keeps the promises of an interface.',
        template: php`<?php
interface Printable {
    public function render(): string;
}
class Receipt ___ Printable {
    public function render(): string {
        return "RECEIPT";
    }
}
echo (new Receipt())->render(), "\n";
`,
        blanks: [{ options: ['implements', 'extends', 'uses'], answer: 'implements' }],
        output: 'RECEIPT\n',
      },
      {
        t: 'bug',
        code: php`<?php
enum Service: string {
    case Send = "send";
    case Pay = "pay";
}
echo Service::from("loan")->value, "\n";
`,
        question: 'This program stops with a “ValueError”. What is wrong?',
        options: ['"loan" is not one of the values of the enum, and from() refuses it', 'Enums cannot have values', 'echo cannot print an enum', 'The cases must be written in capitals'],
        answer: 0,
        explain: 'from() is strict: an unknown value is an error. When the text comes from a user, use tryFrom(), which gives null, and check it.',
        fixed: php`<?php
enum Service: string {
    case Send = "send";
    case Pay = "pay";
}
echo Service::tryFrom("loan")?->value ?? "unknown service", "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: an interface, a class that implements it, then use it.',
        lines: ['<?php', 'interface Greeter {', '    public function greet(): string;', '}', 'class Hello implements Greeter {', '    public function greet(): string { return "hello"; }', '}', 'echo (new Hello())->greet(), "\\n";'],
        output: 'hello\n',
      },
      {
        t: 'quiz',
        question: 'What is the main job of an interface?',
        options: ['To list the methods a class promises to have, so different classes can be used in the same way', 'To store data', 'To make a class faster', 'To stop a class from being created'],
        answer: 0,
        explain: 'An interface is a contract. The code that uses it only needs the contract, so any class that signs it can be plugged in.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
interface Printable {
    public function render(): string;
}
class Receipt implements Printable {}`, why: 'Receipt signed the contract but did not write render(). PHP stops with a fatal error that names the missing method.', right: php`<?php
interface Printable {
    public function render(): string;
}
class Receipt implements Printable {
    public function render(): string {
        return "RECEIPT";
    }
}
echo (new Receipt())->render();` },
          { wrong: php`<?php
enum Service: string {
    case Send = "send";
}
$s = new Service();`, why: 'Enum cases are a closed list: you cannot make new ones with new. Stops with “Cannot instantiate enum”. Use Service::Send or Service::from("send").', right: php`<?php
enum Service: string {
    case Send = "send";
}
$s = Service::from("send");
echo $s->name;` },
          { wrong: php`<?php
enum Service: string {
    case Send = "send";
}
echo Service::Send === "send" ? "same" : "different";`, why: 'No error, but it prints different. An enum case is an object, not a string, so it is never === to text. Compare ->value with the text, or compare two cases.', right: php`<?php
enum Service: string {
    case Send = "send";
}
echo Service::Send->value === "send" ? "same" : "different";`, logic: true },
          { wrong: php`<?php
enum Service: string {
    case Send;
}`, why: 'In a backed enum every case needs a value. PHP stops with a fatal error before running anything.', right: php`<?php
enum Service: string {
    case Send = "send";
}
echo Service::Send->value;` },
        ],
      },
      {
        t: 'recap',
        items: [
          '`interface` = a contract of method names. `class X implements Y` must write them all. A class may implement many interfaces.',
          '`trait` = a bundle of methods pasted into classes with `use`. Sharing code between unrelated classes.',
          '`enum Name: string { case A = "a"; ... }` = a closed list of allowed values, with methods. `from` is strict, `tryFrom` gives null.',
          'Use `match ($this)` inside an enum; compare cases with `===`.',
        ],
        memory: 'Interface = contract. Trait = pasted code. Enum = closed list.',
      },
    ],
    exercises: [
      {
        id: 'php22-service',
        title: 'The service enum',
        prompt: 'The enum `Service` has its cases. Write its method `fee(int $amount): int` with a `match` on `$this`: deposit 0; withdraw: up to 50,000 costs 1,000, up to 200,000 costs 2,000, above 3,500; send (a made-up rule): 1% of the amount rounded up, but at least 100. Read lines `service,amount` and print `Send: fee UGX 1,500`. For a service that does not exist print `Unknown service: loan`.',
        starter: php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
    case Send = "send";

    public function label(): string {
        return ucfirst($this->value);
    }

    // write fee() here
}

while (($line = fgets(STDIN)) !== false) {
    [$name, $amount] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'send,150000\nwithdraw,120000\nloan,5000\n',
        tests: [
          {
            input: 'send,150000\nwithdraw,120000\nloan,5000\n',
            expected: out(`Send: fee UGX ${money(Math.max(100, Math.ceil(150000 / 100)))}`, `Withdraw: fee UGX ${money(boothFee('withdraw', 120000))}`, 'Unknown service: loan'),
          },
          { input: 'deposit,999999\nsend,5000\n', expected: out('Deposit: fee UGX 0', 'Send: fee UGX 100'), hidden: true, name: 'Free deposit and the minimum' },
          { input: 'send,12301\nwithdraw,50001\n', expected: out(`Send: fee UGX ${money(Math.ceil(12301 / 100))}`, 'Withdraw: fee UGX 2,000'), hidden: true, name: 'Rounded up' },
        ],
        hints: [
          'return match ($this) { self::Deposit => 0, self::Withdraw => ..., self::Send => ... };',
          'Send: max(100, (int) ceil($amount / 100)). Withdraw: the same chain as the booth fee.',
          'In the loop: $service = Service::tryFrom($name); if it is null print the Unknown line, otherwise print $service->label(), ": fee UGX " and number_format($service->fee((int) $amount)).',
        ],
      },
      {
        id: 'php22-printable',
        title: 'Slip and SMS',
        prompt: 'The interface `Printable` and the class `Slip` are written. Write the class `SmsText implements Printable` (constructor: name, phone, amount) whose `render()` returns `SMS to 0772123456: Amina, you paid UGX 120,000`. Read lines `name,phone,amount`; for each, make a Slip and an SmsText, and print what both render (Slip first). A Slip renders `RECEIPT Amina UGX 120,000`.',
        starter: php`<?php
interface Printable {
    public function render(): string;
}

class Slip implements Printable {
    public function __construct(private string $name, private int $amount) {}

    public function render(): string {
        return "RECEIPT " . $this->name . " UGX " . number_format($this->amount);
    }
}

// write SmsText here

while (($line = fgets(STDIN)) !== false) {
    [$name, $phone, $amount] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'Amina,0772123456,120000\n',
        tests: [
          { input: 'Amina,0772123456,120000\n', expected: out('RECEIPT Amina UGX 120,000', 'SMS to 0772123456: Amina, you paid UGX 120,000') },
          { input: 'Brian,0701234567,35000\nGrace,0782345678,800000\n', expected: out('RECEIPT Brian UGX 35,000', 'SMS to 0701234567: Brian, you paid UGX 35,000', 'RECEIPT Grace UGX 800,000', 'SMS to 0782345678: Grace, you paid UGX 800,000'), hidden: true, name: 'Two customers' },
          { input: 'Dan,0751111111,500\n', expected: out('RECEIPT Dan UGX 500', 'SMS to 0751111111: Dan, you paid UGX 500'), hidden: true, name: 'A small amount' },
        ],
        hints: [
          'class SmsText implements Printable with a promoted constructor (name, phone, amount) and a render(): string method.',
          'A function show(Printable $p) { echo $p->render(), "\\n"; } prints anything printable.',
          'In the loop call show(new Slip($name, (int) $amount)); and then show(new SmsText($name, $phone, (int) $amount));',
        ],
      },
      {
        id: 'php22-trait',
        title: 'A shared helper',
        prompt: 'Write a trait `Money` with a method `ugx(int $n): string` returning `UGX 120,000`. Then write two classes that both `use` it: `Receipt` (its method `line()` returns `Receipt: Amina UGX 120,000`) and `Invoice` (its `line()` returns `Invoice: Amina UGX 120,000 due`). Read lines `name,amount` and print both lines for each customer.',
        starter: php`<?php
// write trait Money, class Receipt and class Invoice here

while (($line = fgets(STDIN)) !== false) {
    [$name, $amount] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'Amina,120000\n',
        tests: [
          { input: 'Amina,120000\n', expected: out('Receipt: Amina UGX 120,000', 'Invoice: Amina UGX 120,000 due') },
          { input: 'Brian,999\nGrace,1000\n', expected: out('Receipt: Brian UGX 999', 'Invoice: Brian UGX 999 due', 'Receipt: Grace UGX 1,000', 'Invoice: Grace UGX 1,000 due'), hidden: true, name: 'Two customers' },
          { input: 'Dan,0\n', expected: out('Receipt: Dan UGX 0', 'Invoice: Dan UGX 0 due'), hidden: true, name: 'Zero' },
        ],
        hints: [
          'trait Money { public function ugx(int $n): string { return "UGX " . number_format($n); } }',
          'Inside each class write use Money; and give it a constructor with the name and the amount.',
          'line(): return "Receipt: " . $this->name . " " . $this->ugx($this->amount); and the same with "Invoice: " and " due" at the end.',
        ],
      },
      {
        id: 'php22-status',
        title: 'Payment status',
        prompt: 'Write the backed enum `Status` with the cases `Pending` ("pending"), `Paid` ("paid") and `Failed` ("failed"), and a method `isFinal(): bool` (true for Paid and Failed, built with a `match`). Read statuses, one per line, and print `paid: final`, `pending: waiting` or, for text that is not a status, `maybe: unknown status`.',
        starter: php`<?php
// write enum Status here

while (($line = fgets(STDIN)) !== false) {
    $text = strtolower(trim($line));
}
`,
        usesInput: true,
        sampleInput: 'paid\npending\nmaybe\n',
        tests: [
          { input: 'paid\npending\nmaybe\n', expected: out('paid: final', 'pending: waiting', 'maybe: unknown status') },
          { input: 'FAILED\nPaid\n', expected: out('failed: final', 'paid: final'), hidden: true, name: 'Capitals in the input' },
          { input: 'pending\npending\n', expected: out('pending: waiting', 'pending: waiting'), hidden: true, name: 'Always waiting' },
        ],
        hints: [
          'enum Status: string { case Pending = "pending"; case Paid = "paid"; case Failed = "failed"; ... }',
          'isFinal: return match ($this) { self::Pending => false, self::Paid, self::Failed => true };',
          'In the loop: $status = Status::tryFrom($text); if it is null print "$text: unknown status", otherwise "final" or "waiting".',
        ],
      },
    ],
  },

  // ================================================================== 23
  {
    id: 'php-exceptions',
    level: LEVEL,
    minutes: 32,
    title: 'Exceptions',
    summary: 'throw, try, catch and finally, and your own exception classes for your own rules',
    blocks: [
      {
        t: 'story',
        title: 'The withdrawal that must not be ignored',
        text: "In lesson 20 the wallet said `false` when a withdrawal was refused. It was easy to forget to look at that `false`, and the nephew did: the customer got a receipt for money the wallet never had.\n\nAn **exception** cannot be ignored. When something goes wrong the code **throws** one, and the program jumps out of whatever it was doing and travels back up through the callers looking for code that said it can **catch** that kind of problem. If nobody does, the program stops with an error. A refused withdrawal becomes a loud, clear event instead of a quiet `false`.",
      },
      {
        t: 'try',
        code: php`<?php
function divide(int $a, int $b): int {
    if ($b === 0) {
        throw new InvalidArgumentException("Cannot divide by zero");
    }
    return intdiv($a, $b);
}

try {
    echo divide(10, 2), "\n";
    echo divide(10, 0), "\n";
    echo "not reached\n";
} catch (InvalidArgumentException $e) {
    echo "Error: ", $e->getMessage(), "\n";
}
echo "Program continues\n";
`,
        output: out('5', 'Error: Cannot divide by zero', 'Program continues'),
      },
      {
        t: 'list',
        items: [
          '`throw new SomeException("message");` raises the problem and leaves the function at once.',
          'Code that might throw goes in `try { ... }`. If a throw happens inside, the rest of the `try` is skipped.',
          '`catch (SomeException $e) { ... }` handles it. `$e->getMessage()` gives the text. After the catch the program carries on.',
          'PHP has ready-made exceptions: `InvalidArgumentException` (a bad value was given), `RuntimeException` (something went wrong while running), `DomainException`, `LogicException` and others.',
        ],
      },
      { t: 'h', text: 'Your own exceptions' },
      { t: 'p', text: 'A rule of your own deserves its own exception class: it extends `Exception` (or one of the ready-made ones) and can carry extra data. Catching it by name then says exactly what happened:' },
      {
        t: 'try',
        code: php`<?php
class InsufficientFundsException extends Exception {
    public function __construct(public readonly int $missing) {
        parent::__construct("Short by UGX " . number_format($missing));
    }
}

class Wallet {
    public function __construct(private int $balance) {}

    public function withdraw(int $amount): void {
        if ($amount > $this->balance) {
            throw new InsufficientFundsException($amount - $this->balance);
        }
        $this->balance -= $amount;
    }

    public function balance(): int {
        return $this->balance;
    }
}

$w = new Wallet(50000);
try {
    $w->withdraw(30000);
    $w->withdraw(30000);
} catch (InsufficientFundsException $e) {
    echo $e->getMessage(), " (", $e->missing, ")\n";
}
echo $w->balance(), "\n";
`,
        output: out('Short by UGX 10,000 (10000)', '20000'),
      },
      { t: 'h', text: 'finally: always runs' },
      { t: 'p', text: 'Code in `finally` runs whether the `try` succeeded, threw an exception that was caught, or threw one that was not (the program is leaving anyway). Perfect for cleaning up: closing the drawer, closing a file, writing the log line.' },
      {
        t: 'try',
        code: php`<?php
function process(int $amount): void {
    echo "Drawer opened\n";
    try {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Bad amount");
        }
        echo "Paid ", $amount, "\n";
    } finally {
        echo "Drawer closed\n";
    }
}

try {
    process(500);
    process(0);
} catch (InvalidArgumentException $e) {
    echo "Caught: ", $e->getMessage(), "\n";
}
`,
        output: out('Drawer opened', 'Paid 500', 'Drawer closed', 'Drawer opened', 'Drawer closed', 'Caught: Bad amount'),
      },
      { t: 'p', text: 'Notice the order: the drawer was closed **before** the catch in the main program ran. The exception travelled up from `process`, and `finally` got its say on the way.' },
      { t: 'h', text: 'Several kinds, and Throwable' },
      { t: 'p', text: 'You can have several `catch` blocks, or list kinds with `|`. PHP uses the **first** one that fits, so put the specific ones first and the general ones last. Real PHP errors such as a division by zero or a type error are `Error` objects, not `Exception` objects. Both are `Throwable`, the parent of everything that can be thrown:' },
      {
        t: 'try',
        code: php`<?php
function risky(int $n): int {
    if ($n === 1) {
        throw new InvalidArgumentException("one");
    }
    if ($n === 2) {
        throw new RuntimeException("two");
    }
    return intdiv(10, $n);
}

foreach ([1, 2, 0, 5] as $n) {
    try {
        echo risky($n), "\n";
    } catch (InvalidArgumentException | RuntimeException $e) {
        echo "Exception: ", $e->getMessage(), "\n";
    } catch (Throwable $e) {
        echo "Other: ", get_class($e), "\n";
    }
}
`,
        output: out('Exception: one', 'Exception: two', 'Other: DivisionByZeroError', '2'),
      },
      { t: 'tip', text: 'Do not catch an exception just to hide it. Catch it when you know what to do: show a message, try again, use a default, undo something. If you do not, let it travel up to code that does. Do not use exceptions for ordinary things that happen all the time; they are for things that should not happen.' },
      {
        t: 'predict',
        code: php`<?php
function f() {
    try {
        echo "a";
        throw new Exception("x");
        echo "b";
    } catch (Exception $e) {
        echo "c";
    } finally {
        echo "d";
    }
    echo "e";
}
f();
`,
        question: 'What does this program print?',
        options: ['acde', 'abcde', 'ace', 'acd'],
        answer: 0,
        explain: 'a is printed, then the throw skips b and jumps to the catch (c). finally always runs (d). The function then carries on after the whole try block (e).',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that starts the block handling a thrown exception.',
        template: php`<?php
try {
    throw new InvalidArgumentException("bad");
} ___ (InvalidArgumentException $e) {
    echo "caught ", $e->getMessage(), "\n";
}
`,
        blanks: [{ options: ['catch', 'except', 'handle'], answer: 'catch' }],
        output: 'caught bad\n',
      },
      {
        t: 'bug',
        code: php`<?php
throw "oops";
`,
        question: 'This program stops with “Can only throw objects”. What is wrong?',
        options: ['Only objects (like new Exception("oops")) can be thrown, not plain text', 'throw must be written in capitals', 'throw needs a try around it', 'The text needs single quotes'],
        answer: 0,
        explain: 'A thrown thing must be an exception object, because the catch needs a type to match and a message to read. Wrap the text: throw new Exception("oops");',
        fixed: php`<?php
try {
    throw new Exception("oops");
} catch (Exception $e) {
    echo $e->getMessage(), "\n";
}
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: throw inside a try, catch it, then carry on.',
        lines: ['<?php', 'try {', '    throw new Exception("stop");', '} catch (Exception $e) {', '    echo "caught: ", $e->getMessage(), "\\n";', '}', 'echo "done\\n";'],
        output: out('caught: stop', 'done'),
      },
      {
        t: 'quiz',
        question: 'When does the code in a finally block run?',
        options: ['Always: after the try, whether or not something was thrown', 'Only when an exception was thrown', 'Only when nothing was thrown', 'Never, it is only a comment'],
        answer: 0,
        explain: 'finally is for clean-up that must happen no matter what, so it runs after a normal finish, after a caught exception, and even when an exception is on its way up to a caller.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
echo "start\n";
throw new Exception("nobody catches this");`, why: 'An exception that nobody catches ends the program with “Fatal error: Uncaught Exception”. Everything before it was printed, nothing after it runs.', right: php`<?php
echo "start\n";
try {
    throw new Exception("somebody catches this");
} catch (Exception $e) {
    echo $e->getMessage(), "\n";
}` },
          { wrong: php`<?php
try {
    throw new InvalidArgumentException("bad");
} catch (Exception $e) {
    echo "general";
} catch (InvalidArgumentException $e) {
    echo "specific";
}`, why: 'No error, but it prints general. PHP uses the first catch that fits, and every InvalidArgumentException is also an Exception. Put the specific catch first.', right: php`<?php
try {
    throw new InvalidArgumentException("bad");
} catch (InvalidArgumentException $e) {
    echo "specific";
} catch (Exception $e) {
    echo "general";
}`, logic: true },
          { wrong: php`<?php
try {
    throw new Exception("disk full");
} catch (Exception $e) {
}
echo "saved";`, why: 'No error, but a lie: the empty catch swallows the problem and the program announces “saved”. A catch must do something sensible: report, undo, or pass the exception on.', right: php`<?php
try {
    throw new Exception("disk full");
} catch (Exception $e) {
    echo "not saved: ", $e->getMessage();
}`, logic: true },
          { wrong: php`<?php
throw InvalidArgumentException("bad");`, why: 'The word new is missing. PHP thinks InvalidArgumentException(...) is a function call and stops with “Call to undefined function”. An exception is an object: throw new ...', right: php`<?php
try {
    throw new InvalidArgumentException("bad");
} catch (InvalidArgumentException $e) {
    echo $e->getMessage();
}` },
        ],
      },
      {
        t: 'recap',
        items: [
          '`throw new XException("message")` raises a problem; `try { ... } catch (XException $e) { ... }` handles it; `$e->getMessage()` reads the text.',
          'Make your own exception classes for your own rules (`extends Exception`), and let them carry data in readonly properties.',
          '`finally` always runs: use it for clean-up. Catch the specific kinds first and the general ones last; `Throwable` catches everything, errors too.',
          'Never swallow an exception with an empty catch. Catch it only when you know what to do about it.',
        ],
        memory: 'throw raises. catch handles. finally always runs. Specific first.',
      },
    ],
    exercises: [
      {
        id: 'php23-handle',
        title: 'Handle the refusals',
        prompt: 'The wallet is written: it throws `InvalidArgumentException("Amount must be above zero")` and `InsufficientFundsException` (message `Short by UGX 10,000`). Read commands `deposit N` and `withdraw N`, one per line. For a command that works print `OK: balance UGX 20,000`; when it throws, print `Declined: ` and the exception message. Use `finally` to count every command, and at the end print `Attempts: 3`.',
        starter: php`<?php
class InsufficientFundsException extends Exception {
    public function __construct(public readonly int $missing) {
        parent::__construct("Short by UGX " . number_format($missing));
    }
}

class Wallet {
    private int $balance = 0;

    public function deposit(int $amount): void {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Amount must be above zero");
        }
        $this->balance += $amount;
    }

    public function withdraw(int $amount): void {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Amount must be above zero");
        }
        if ($amount > $this->balance) {
            throw new InsufficientFundsException($amount - $this->balance);
        }
        $this->balance -= $amount;
    }

    public function balance(): int {
        return $this->balance;
    }
}

$wallet = new Wallet();
$attempts = 0;
while (($line = fgets(STDIN)) !== false) {
    [$command, $amount] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'deposit 50000\nwithdraw 30000\nwithdraw 40000\n',
        tests: [
          { input: 'deposit 50000\nwithdraw 30000\nwithdraw 40000\n', expected: out('OK: balance UGX 50,000', 'OK: balance UGX 20,000', 'Declined: Short by UGX 20,000', 'Attempts: 3') },
          { input: 'deposit 0\nwithdraw 1\n', expected: out('Declined: Amount must be above zero', 'Declined: Short by UGX 1', 'Attempts: 2'), hidden: true, name: 'Everything declined' },
          { input: 'deposit 1000\n', expected: out('OK: balance UGX 1,000', 'Attempts: 1'), hidden: true, name: 'One command' },
        ],
        hints: [
          'Inside the loop: try { ... } catch (InvalidArgumentException | InsufficientFundsException $e) { ... } finally { $attempts++; }',
          'In the try: call deposit or withdraw depending on $command, then print "OK: balance UGX " and number_format($wallet->balance()).',
          'In the catch print "Declined: " and $e->getMessage(). After the loop print the attempts.',
        ],
      },
      {
        id: 'php23-parse-throw',
        title: 'A parser that throws',
        prompt: 'Write `parseAmount(string $text): int`. It returns the number when the text is only digits and is above 0. It throws `InvalidArgumentException("Not a whole number: abc")` (with the text) when it is not only digits, and `InvalidArgumentException("Amount must be above zero")` when it is 0. Read lines until the input ends; print `UGX 120,000` for a good one and `Error: ` and the message for a bad one.',
        starter: php`<?php
function parseAmount(string $text): int {
    // return the number, or throw
    return 0;
}

while (($line = fgets(STDIN)) !== false) {
    $text = trim($line);
}
`,
        usesInput: true,
        sampleInput: '120000\nabc\n0\n',
        tests: [
          { input: '120000\nabc\n0\n', expected: out('UGX 120,000', 'Error: Not a whole number: abc', 'Error: Amount must be above zero') },
          { input: '-5\n12.5\n', expected: out('Error: Not a whole number: -5', 'Error: Not a whole number: 12.5'), hidden: true, name: 'Negative and decimal' },
          { input: '1\n000\n', expected: out('UGX 1', 'Error: Amount must be above zero'), hidden: true, name: 'Zeros written out' },
        ],
        hints: [
          'if (!ctype_digit($text)) { throw new InvalidArgumentException("Not a whole number: " . $text); }',
          'Then $n = (int) $text; if ($n === 0) throw the “above zero” exception; otherwise return $n.',
          'In the loop use try / catch (InvalidArgumentException $e). Careful: echo "UGX ", parseAmount(...) prints the "UGX " before the call throws. Call parseAmount first and keep the result in a variable, then print.',
        ],
      },
      {
        id: 'php23-custom',
        title: 'Your own exception',
        prompt: 'The class `Atm` throws a `LimitExceededException` that does not exist yet. Write it: it extends `Exception`, takes `public readonly int $limit` in its constructor and passes the message `Limit of UGX 1,000,000 exceeded` (built from the limit with number_format) to the parent constructor. Read amounts, one per line: print `Approved UGX 500,000`, or `Declined: ` and the message.',
        starter: php`<?php
// write LimitExceededException here

class Atm {
    public function pay(int $amount): void {
        if ($amount > 1000000) {
            throw new LimitExceededException(1000000);
        }
    }
}

$atm = new Atm();
while (($line = fgets(STDIN)) !== false) {
    $amount = (int) trim($line);
}
`,
        usesInput: true,
        sampleInput: '500000\n2000000\n',
        tests: [
          { input: '500000\n2000000\n', expected: out('Approved UGX 500,000', 'Declined: Limit of UGX 1,000,000 exceeded') },
          { input: '1000000\n1000001\n', expected: out('Approved UGX 1,000,000', 'Declined: Limit of UGX 1,000,000 exceeded'), hidden: true, name: 'The edge' },
          { input: '1\n', expected: 'Approved UGX 1', hidden: true, name: 'One shilling' },
        ],
        hints: [
          'class LimitExceededException extends Exception with a promoted constructor: public function __construct(public readonly int $limit) { ... }',
          'Inside the constructor: parent::__construct("Limit of UGX " . number_format($limit) . " exceeded");',
          'In the loop: try { $atm->pay($amount); echo "Approved UGX ", number_format($amount), "\\n"; } catch (LimitExceededException $e) { echo "Declined: ", $e->getMessage(), "\\n"; }',
        ],
      },
    ],
  },

  // ================================================================== 24
  {
    id: 'php-wallet',
    level: LEVEL,
    minutes: 40,
    title: 'Project: the Wallet class',
    summary: 'Level 4 together: a protected wallet with a history, fees, exceptions and an enum, driven by commands',
    blocks: [
      {
        t: 'story',
        title: "Nambi's own wallet",
        text: "Nambi wants one more thing from her nephew: a **wallet** she can trust. It must never go negative. It must charge the booth fee on every withdrawal, remember every transaction so it can print a statement, and say **why** when it refuses something. And she wants to type simple commands: `deposit 50000`, `withdraw 30000`, `balance`, `statement`.\n\nEvery tool of this level goes into it: a class with a private balance (lesson 20), small classes for the records (19), an enum for the kind of transaction (22), your own exceptions (23), and a command loop that catches them. You will build it in three runs.",
      },
      { t: 'h', text: 'Step 1: a wallet that can take a deposit' },
      { t: 'p', text: 'The wallet keeps its balance private. `deposit` checks the rule and **throws** `InvalidAmountException` when the amount is not above zero. The command loop catches it and prints `Declined:` with the message. The function `parseAmount` throws the same exception for text that is not a number.' },
      {
        t: 'project',
        title: 'Wallet, step 1: deposit and balance',
        stdin: lines(S1),
        code: STAGE1,
        output: out(...walletSession(S1).lines),
      },
      { t: 'h', text: 'Step 2: withdrawals with a fee' },
      { t: 'p', text: 'A withdrawal costs the amount **plus** the booth fee, so the wallet must hold `amount + fee`. When it does not, `InsufficientFundsException` says how much is missing. The wallet keeps its two rules in small private methods (`requirePositive`, `feeFor`), so a rule is written in one place.' },
      {
        t: 'project',
        title: 'Wallet, step 2: withdraw and the fee',
        stdin: lines(S2),
        code: STAGE2,
        output: out(...walletSession(S2).lines),
      },
      { t: 'h', text: 'Step 3: the history and the statement' },
      { t: 'p', text: 'Every successful deposit or withdrawal is recorded as a `Transaction`: a small `readonly` object whose `kind` is an **enum** (`Kind::Deposit` or `Kind::Withdraw`). The wallet hands out its history, and `statement` prints it with the fees paid. Nobody outside can add to the history or change a record.' },
      {
        t: 'project',
        title: 'Wallet, step 3: the finished wallet',
        stdin: lines(S3),
        code: WALLET_LIB + walletMain(),
        output: out(...walletSession(S3).lines),
      },
      { t: 'p', text: 'Look at what the main program is: a loop that reads a command and calls a method. All the rules live in the classes. When Nambi asks for a daily limit, or a different fee, you open `Wallet` and change one place. Try other commands below:' },
      {
        t: 'try',
        stdin: lines(['statement', 'deposit 1000', 'withdraw 1000', 'withdraw abc', 'refund 500', 'deposit 300000', 'withdraw 250000', 'statement']),
        code: WALLET_LIB + walletMain(),
        output: out(...walletSession(['statement', 'deposit 1000', 'withdraw 1000', 'withdraw abc', 'refund 500', 'deposit 300000', 'withdraw 250000', 'statement']).lines),
      },
      {
        t: 'predict',
        code: php`<?php
final class Transaction {
    public function __construct(public readonly int $amount) {}
}
$t = new Transaction(500);
$u = $t;
echo $u->amount;
`,
        question: 'What does this program print?',
        options: ['500', '0', 'An error', 'Transaction'],
        answer: 0,
        explain: '$u is another handle on the same object, and its amount (set once in the constructor, never changed because it is readonly) is 500.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the keyword that makes the balance reachable only from inside the Wallet.',
        template: php`<?php
final class Wallet {
    ___ int $balance = 100;

    public function balance(): int {
        return $this->balance;
    }
}
echo (new Wallet())->balance(), "\n";
`,
        blanks: [{ options: ['private', 'readonly', 'abstract'], answer: 'private' }],
        output: '100\n',
      },
      {
        t: 'bug',
        code: php`<?php
final class Wallet {
    private int $balance = 100;
}
$w = new Wallet();
$w->balance = 5000000;
`,
        question: 'This program stops with “Cannot access private property”. What does that protect Nambi from?',
        options: ['Anyone writing a balance of their own choosing instead of going through deposit and withdraw', 'Printing the balance', 'Making more than one wallet', 'Using the word final'],
        answer: 0,
        explain: 'That error is the whole point of this level. With a public balance, one stray line gives the wallet five million shillings. With a private one the rules in deposit() and withdraw() cannot be skipped.',
        fixed: php`<?php
final class Wallet {
    private int $balance = 100;

    public function balance(): int {
        return $this->balance;
    }
}
$w = new Wallet();
echo $w->balance(), "\n";
`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
class Wallet {
    private int $balance = 0;
    public function withdraw(int $amount): void {
        $this->balance -= $amount;
    }
    public function balance(): int {
        return $this->balance;
    }
}
$w = new Wallet();
$w->withdraw(5000);
echo $w->balance();`, why: 'No error, but a wallet with a private balance that goes to -5000. Private data is only as safe as the methods that change it. withdraw must check the funds and throw.', right: php`<?php
class Wallet {
    private int $balance = 0;
    public function withdraw(int $amount): void {
        if ($amount > $this->balance) {
            throw new RuntimeException("Insufficient funds");
        }
        $this->balance -= $amount;
    }
    public function balance(): int {
        return $this->balance;
    }
}
$w = new Wallet();
try {
    $w->withdraw(5000);
} catch (RuntimeException $e) {
    echo $e->getMessage();
}`, logic: true },
          { wrong: php`<?php
class Wallet {
    private array $history = [];
    public function history(): array {
        return $this->history;
    }
}
$w = new Wallet();
$h = $w->history();
$h[] = "fake";
echo count($w->history());`, why: 'It prints 0, which is correct and shows something good: arrays are copied, so the outside world cannot edit the wallet’s history through the copy it received. (Objects inside the array would be shared handles, which is why Transaction is readonly.)', right: php`<?php
class Wallet {
    private array $history = [];
    public function history(): array {
        return $this->history;
    }
}
$w = new Wallet();
$h = $w->history();
$h[] = "fake";
echo count($w->history());`, logic: true },
          { wrong: php`<?php
class InvalidAmountException extends InvalidArgumentException {}
try {
    throw new InvalidAmountException("bad");
} catch (RuntimeException $e) {
    echo "caught";
}`, why: 'InvalidAmountException is an InvalidArgumentException, not a RuntimeException, so this catch does not fit and the exception goes uncaught. Catch the kind you throw (or a common parent).', right: php`<?php
class InvalidAmountException extends InvalidArgumentException {}
try {
    throw new InvalidAmountException("bad");
} catch (InvalidArgumentException $e) {
    echo "caught";
}` },
        ],
      },
      {
        t: 'recap',
        items: [
          'A good class owns its data (`private`), guards it with methods that check the rules and `throw` your own exceptions, and keeps records as `readonly` objects.',
          'Use an enum for a closed list (the kind of transaction). Use small private methods for each rule, so every rule exists once.',
          'The main program only reads commands, calls methods, and catches exceptions to print a clean message.',
          'Level 5 takes this wallet to the web: requests, forms, validation, security, files and a database.',
        ],
        memory: 'Private data. Rules in methods. Exceptions say why. Records are readonly.',
      },
    ],
    exercises: [
      {
        id: 'php24-session',
        title: 'The wallet session',
        prompt: 'The whole library of the project (the enum `Kind`, `Transaction`, the exceptions, `Wallet` and `parseAmount`) is in the starter. Write the **command loop**: read lines until the input ends, ignore blank lines, split on spaces (`preg_split(\'/\\s+/\', ...)`), make the command lowercase and handle `deposit N`, `withdraw N`, `balance` and `statement` exactly like the lesson. Print `Declined: ` and the message when an exception is caught, and `Unknown command: refund` for any other command.',
        starter:
          WALLET_LIB +
          php`
// write the command loop here
`,
        usesInput: true,
        sampleInput: lines(S3),
        tests: [
          { input: lines(S3), expected: out(...walletSession(S3).lines) },
          { input: lines(['statement', 'balance']), expected: out(...walletSession(['statement', 'balance']).lines), hidden: true, name: 'Nothing yet' },
          {
            input: lines(['deposit abc', 'deposit 0', 'withdraw 1', '', 'refund 500', 'DEPOSIT 5000', 'Withdraw 5000']),
            expected: out(...walletSession(['deposit abc', 'deposit 0', 'withdraw 1', '', 'refund 500', 'DEPOSIT 5000', 'Withdraw 5000']).lines),
            hidden: true,
            name: 'Bad input, blank lines and capitals',
          },
          { input: lines(['deposit 300000', 'withdraw 200000', 'withdraw 200000', 'withdraw 96000', 'statement']), expected: out(...walletSession(['deposit 300000', 'withdraw 200000', 'withdraw 200000', 'withdraw 96000', 'statement']).lines), hidden: true, name: 'Fees decide what is affordable' },
        ],
        hints: [
          '$wallet = new Wallet(); then while (($line = fgets(STDIN)) !== false) { ... } with preg_split and strtolower on the first word.',
          'Inside a try: if / elseif on $command. For deposit and withdraw use parseAmount($parts[1] ?? "") and then the wallet method; for withdraw the method returns the fee.',
          'catch (InvalidAmountException | InsufficientFundsException $e) { echo "Declined: ", $e->getMessage(), "\\n"; }. The statement walks $wallet->history() and uses $tx->kind->label() and $tx->fee.',
        ],
      },
      {
        id: 'php24-summary',
        title: 'Counting in the wallet',
        prompt: 'The project is in the starter and its command loop runs the commands silently. Add two public methods to `Wallet`: `count(Kind $kind): int` (how many transactions of that kind are in the history) and `feesPaid(): int` (the sum of all fees). The program already prints `Deposits: 2`, `Withdrawals: 1` and `Fees paid: UGX 1,000` by calling them.',
        starter:
          LIB_WITH_GAP +
          php`
$wallet = new Wallet();
while (($line = fgets(STDIN)) !== false) {
    $parts = preg_split('/\s+/', trim($line));
    try {
        if ($parts[0] === "deposit") {
            $wallet->deposit(parseAmount($parts[1] ?? ""));
        } elseif ($parts[0] === "withdraw") {
            $wallet->withdraw(parseAmount($parts[1] ?? ""));
        }
    } catch (InvalidAmountException | InsufficientFundsException $e) {
        // refused commands are not counted
    }
}
echo "Deposits: ", $wallet->count(Kind::Deposit), "\n";
echo "Withdrawals: ", $wallet->count(Kind::Withdraw), "\n";
echo "Fees paid: UGX ", number_format($wallet->feesPaid()), "\n";
`,
        usesInput: true,
        sampleInput: lines(['deposit 50000', 'withdraw 30000', 'deposit 20000', 'withdraw 900000']),
        tests: [
          { input: lines(['deposit 50000', 'withdraw 30000', 'deposit 20000', 'withdraw 900000']), expected: summaryFor(['deposit 50000', 'withdraw 30000', 'deposit 20000', 'withdraw 900000']) },
          { input: lines(['deposit 1000']), expected: summaryFor(['deposit 1000']), hidden: true, name: 'One deposit' },
          { input: lines(['deposit 300000', 'withdraw 40000', 'withdraw 100000', 'withdraw 150000', 'deposit 0']), expected: summaryFor(['deposit 300000', 'withdraw 40000', 'withdraw 100000', 'withdraw 150000', 'deposit 0']), hidden: true, name: 'Three withdrawals' },
          { input: '', expected: summaryFor([]), hidden: true, name: 'No commands' },
        ],
        hints: [
          'Both methods walk $this->history, which holds Transaction objects.',
          'count: loop and add 1 when $tx->kind === $kind. Enum cases are single objects, so === works.',
          'feesPaid: add up $tx->fee of every transaction and return the sum. Put both methods where the comment is.',
        ],
      },
      {
        id: 'php24-limit',
        title: 'A limit per withdrawal',
        prompt: 'Nambi adds a rule: **one withdrawal may not be above UGX 1,000,000.** The project (library and command loop) is in the starter; the loop already catches `LimitExceededException`, but that class does not exist and `Wallet::withdraw` does not check the limit. Write the exception (extends `RuntimeException`, message `Limit is UGX 1,000,000 per withdrawal`, built with number_format) and make `withdraw` throw it **after** the amount check and **before** the funds check.',
        starter:
          WALLET_LIB +
          walletMain('InvalidAmountException | InsufficientFundsException | LimitExceededException'),
        usesInput: true,
        sampleInput: lines(['deposit 5000000', 'withdraw 1200000', 'withdraw 1000000', 'balance']),
        tests: [
          { input: lines(['deposit 5000000', 'withdraw 1200000', 'withdraw 1000000', 'balance']), expected: out(...walletSession(['deposit 5000000', 'withdraw 1200000', 'withdraw 1000000', 'balance'], { limit: 1000000 }).lines) },
          { input: lines(['withdraw 1000001', 'withdraw 0']), expected: out(...walletSession(['withdraw 1000001', 'withdraw 0'], { limit: 1000000 }).lines), hidden: true, name: 'The limit is checked before the funds' },
          { input: lines(['deposit 9000000', 'withdraw 1000000', 'withdraw 1000000', 'statement']), expected: out(...walletSession(['deposit 9000000', 'withdraw 1000000', 'withdraw 1000000', 'statement'], { limit: 1000000 }).lines), hidden: true, name: 'Exactly the limit, twice' },
        ],
        hints: [
          'class LimitExceededException extends RuntimeException with a constructor that takes the limit and calls parent::__construct("Limit is UGX " . number_format($limit) . " per withdrawal");',
          'In Wallet::withdraw, right after requirePositive, add: if ($amount > 1000000) { throw new LimitExceededException(1000000); }',
          'Order matters: a withdrawal of 1,000,001 with an empty wallet must say the limit, not “Short by”.',
        ],
      },
    ],
  },
];

// Expected output of php24-summary, built from the data in plain JavaScript.
function summaryFor(commands) {
  const { history } = walletSession(commands);
  return out(
    `Deposits: ${history.filter((h) => h.kind === 'Deposit').length}`,
    `Withdrawals: ${history.filter((h) => h.kind === 'Withdraw').length}`,
    `Fees paid: UGX ${money(history.reduce((s, h) => s + h.fee, 0))}`
  );
}
