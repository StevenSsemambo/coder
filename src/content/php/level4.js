// PHP, Level 4: Objects. Lessons 19 to 21 (classes, encapsulation, inheritance).
// Expected outputs are plain JavaScript, never produced by running the PHP.
import { php, out, money, boothFee, sendFee } from './shared.js';

const LEVEL = 'Level 4: Objects';

export const level4 = [
  // ================================================================== 19
  {
    id: 'php-classes',
    level: LEVEL,
    minutes: 30,
    title: 'Classes and objects',
    summary: 'A blueprint for things that have data and can do things: properties, methods, new and $this',
    blocks: [
      {
        t: 'story',
        title: 'The customer card',
        text: "Every regular at Nambi's booth has a card in a box: name, phone, balance. When Amina deposits, Nambi finds her card and changes the balance. In a program you could keep each customer as a record, an associative array like in lesson 10. It works, until the day somebody types `$c[\"balanse\"]` and a new, wrong key quietly appears next to the real one.\n\nIt would be better if the card itself knew what belongs on it, and knew how to deposit and describe itself. That is a **class**: a blueprint that bundles **data** (properties) with the **actions** that belong to it (methods). Each real card made from the blueprint is an **object**.",
      },
      {
        t: 'try',
        code: php`<?php
class Customer {
    public string $name = "";
    public int $balance = 0;
}

$a = new Customer();
$a->name = "Amina";
$a->balance = 50000;
echo $a->name, " has UGX ", number_format($a->balance), "\n";
`,
        output: 'Amina has UGX 50,000\n',
      },
      {
        t: 'list',
        items: [
          '`class Customer { ... }` is the blueprint. It does nothing by itself.',
          '`new Customer()` makes one object from the blueprint. Make as many as you like.',
          '`$a->name` reads or changes a **property** of that object. The arrow `->` means “belonging to”.',
          'Properties have types, just like parameters in lesson 15.',
        ],
      },
      { t: 'h', text: 'The constructor and methods' },
      { t: 'p', text: 'A **constructor** is the special method `__construct`. It runs when you say `new` and sets the object up. A **method** is a function that lives inside a class. Inside a method, `$this` means “this very object”:' },
      {
        t: 'try',
        code: php`<?php
class Customer {
    public string $name;
    public int $balance;

    public function __construct(string $name, int $balance = 0) {
        $this->name = $name;
        $this->balance = $balance;
    }

    public function deposit(int $amount): void {
        $this->balance += $amount;
    }

    public function describe(): string {
        return $this->name . ": UGX " . number_format($this->balance);
    }
}

$a = new Customer("Amina", 50000);
$b = new Customer("Brian");
$a->deposit(20000);
echo $a->describe(), "\n";
echo $b->describe(), "\n";
`,
        output: out('Amina: UGX 70,000', 'Brian: UGX 0'),
      },
      { t: 'p', text: 'Each object has its **own** copy of the properties: depositing for Amina did not touch Brian. Writing the same name three times (property, parameter, assignment) is boring, so PHP 8 has a shortcut called **constructor promotion**. Put `public` in front of the parameter and PHP declares the property and fills it for you:' },
      {
        t: 'try',
        code: php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}

    public function deposit(int $amount): void {
        $this->balance += $amount;
    }

    public function describe(): string {
        return $this->name . ": UGX " . number_format($this->balance);
    }
}

$a = new Customer("Amina", 50000);
$a->deposit(20000);
echo $a->describe(), "\n";
`,
        output: 'Amina: UGX 70,000\n',
      },
      { t: 'h', text: 'Many objects, and returning $this' },
      { t: 'p', text: 'Objects go into arrays like any value, and you can sort them by a property with `usort`:' },
      {
        t: 'try',
        code: php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}
}

$list = [new Customer("Amina", 70000), new Customer("Brian", 15000), new Customer("Grace", 800000)];
usort($list, fn($x, $y) => $y->balance <=> $x->balance);
foreach ($list as $c) {
    echo $c->name, ": ", number_format($c->balance), "\n";
}
`,
        output: out('Grace: 800,000', 'Amina: 70,000', 'Brian: 15,000'),
      },
      { t: 'p', text: 'A method that ends with `return $this;` lets you chain calls, one after another on the same object:' },
      {
        t: 'try',
        code: php`<?php
class Till {
    private int $total = 0;

    public function add(int $amount): static {
        $this->total += $amount;
        return $this;
    }

    public function total(): int {
        return $this->total;
    }
}

$till = new Till();
echo $till->add(5000)->add(12000)->add(3000)->total(), "\n";
`,
        output: '20000\n',
      },
      { t: 'h', text: 'Objects are handles, not copies' },
      { t: 'p', text: 'In lesson 16 an array was copied when you gave it to a function. An **object** is different: a variable holds a **handle** to the object, and copying the variable copies the handle. Both names then point to the same object. To get a separate object you must ask with `clone`:' },
      {
        t: 'try',
        code: php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}
}

function zeroIt(Customer $c): void {
    $c->balance = 0;
}

$a = new Customer("Amina", 50000);
$same = $a;
$copy = clone $a;
zeroIt($a);
echo $same->balance, " ", $copy->balance, "\n";
`,
        output: '0 50000\n',
      },
      { t: 'tip', text: "A class can also hold **constants** (`const MIN = 500;` read with `Customer::MIN`) and **static** methods (`public static function ...`, called as `Customer::name()`), which belong to the class itself and not to any one object. Use them for things that are the same for every customer." },
      {
        t: 'predict',
        code: php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}
}
$a = new Customer("Amina", 10);
$b = $a;
$b->balance = 99;
echo $a->balance;
`,
        question: 'What does this program print?',
        options: ['99', '10', '0', 'Nothing'],
        answer: 0,
        explain: '$b = $a copies the handle, not the object. $a and $b are two names for the same customer, so changing $b->balance changes what $a shows: 99. Use clone to get a real copy.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that makes a new object from a class.',
        template: php`<?php
class Customer {
    public function __construct(public string $name) {}
}
$c = ___ Customer("Amina");
echo $c->name, "\n";
`,
        blanks: [{ options: ['new', 'make', 'create'], answer: 'new' }],
        output: 'Amina\n',
      },
      {
        t: 'bug',
        code: php`<?php
class Customer {
    public function __construct(public string $name) {}
}
$c = new Customer("Amina");
$c->withdraw(500);
`,
        question: 'This program stops with “Call to undefined method”. What is wrong?',
        options: ['The class has no method called withdraw', 'withdraw needs two arguments', 'Objects cannot have methods', 'new must be written twice'],
        answer: 0,
        explain: 'You can only call methods the class defines. PHP names the class and the method it could not find, which usually points straight at a typo or a method you have not written yet.',
        fixed: php`<?php
class Customer {
    public function __construct(public string $name) {}
    public function withdraw(int $amount): void {
        echo $this->name, " withdraws ", $amount, "\n";
    }
}
$c = new Customer("Amina");
$c->withdraw(500);
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: the class, one new object, a value for its cash, then print it.',
        lines: ['<?php', 'class Booth {', '    public int $cash = 0;', '}', '$b = new Booth();', '$b->cash = 500000;', 'echo $b->cash, "\\n";'],
        output: '500000\n',
      },
      {
        t: 'quiz',
        question: 'Inside a method, what does $this mean?',
        options: ['The object the method was called on', 'The class itself', 'The last object that was made', 'A copy of the object'],
        answer: 0,
        explain: 'When you write $a->deposit(5), inside deposit $this is $a. When you write $b->deposit(5), it is $b. That is how one method works for every object.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
class Customer {
    public int $balance = 0;
    public function deposit(int $amount): void {
        $balance += $amount;
    }
}
$c = new Customer();
$c->deposit(500);
echo $c->balance;`, why: 'No fatal error, but a warning “Undefined variable $balance”, and the balance stays 0. Inside a method the object’s properties are reached with $this->, never as plain variables.', right: php`<?php
class Customer {
    public int $balance = 0;
    public function deposit(int $amount): void {
        $this->balance += $amount;
    }
}
$c = new Customer();
$c->deposit(500);
echo $c->balance;`, logic: true },
          { wrong: php`<?php
class Customer {
    public function __construct(public string $name) {}
}
$c = new Customer();`, why: 'The constructor needs a name and none was given. PHP 8 stops with an ArgumentCountError, just like a function called with too few arguments.', right: php`<?php
class Customer {
    public function __construct(public string $name) {}
}
$c = new Customer("Amina");` },
          { wrong: php`<?php
class Customer {
    public int $balance;
}
$c = new Customer();
echo $c->balance;`, why: 'A typed property with no starting value is “uninitialized”. Reading it before it is set stops the program with an Error. Give it a default (= 0) or set it in the constructor.', right: php`<?php
class Customer {
    public int $balance = 0;
}
$c = new Customer();
echo $c->balance;` },
          { wrong: php`<?php
class Customer {
    public function describe(): string {
        return "customer";
    }
}
echo Customer::describe();`, why: 'describe belongs to objects. Calling it on the class itself without an object stops with “Non-static method cannot be called statically”. Make an object first: (new Customer())->describe().', right: php`<?php
class Customer {
    public function describe(): string {
        return "customer";
    }
}
echo (new Customer())->describe();` },
          { wrong: php`<?php
$c = null;
echo $c->name;`, why: 'No fatal error, but a warning “Attempt to read property on null”. A variable that holds null has no properties. Check for null first, or use the null-safe arrow ?-> which gives null instead of a warning.', right: php`<?php
$c = null;
echo $c?->name ?? "no customer";`, logic: true },
        ],
      },
      {
        t: 'recap',
        items: [
          '`class Name { ... }` is a blueprint; `new Name(args)` makes an object; `$obj->property` and `$obj->method()` use it.',
          '`__construct` sets an object up. Constructor promotion (`public string $name` in the parameter list) declares and fills a property in one go.',
          'Inside a method `$this` is the object itself; properties are reached with `$this->`.',
          'Variables hold handles: `$b = $a` makes two names for one object, `clone $a` makes a real copy.',
          '`return $this;` allows chained calls. Constants and static methods belong to the class, not to one object.',
        ],
        memory: 'Class = blueprint. new = one card. $this = this card. clone = a real copy.',
      },
    ],
    exercises: [
      {
        id: 'php19-customer',
        title: 'The customer card',
        prompt: 'Write the class `Customer` with a promoted constructor (`name`, `balance`), a method `deposit(int $amount): void` and a method `describe(): string` that returns `Amina: UGX 70,000`. The input has three lines: the name, the starting balance and a deposit. Make the customer, deposit, and print the description.',
        starter: php`<?php
class Customer {
    // constructor, deposit(), describe()
}

$name = trim(fgets(STDIN));
$balance = (int) trim(fgets(STDIN));
$deposit = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: 'Amina\n50000\n20000\n',
        tests: [
          { input: 'Amina\n50000\n20000\n', expected: 'Amina: UGX 70,000' },
          { input: 'Brian\n0\n0\n', expected: 'Brian: UGX 0', hidden: true, name: 'Nothing at all' },
          { input: 'Grace\n999999\n1\n', expected: 'Grace: UGX 1,000,000', hidden: true, name: 'Up to a million' },
        ],
        hints: [
          'public function __construct(public string $name, public int $balance = 0) {} declares both properties.',
          'deposit: $this->balance += $amount; describe: return $this->name . ": UGX " . number_format($this->balance);',
          'Outside the class: $c = new Customer($name, $balance); $c->deposit($deposit); echo $c->describe(), "\\n";',
        ],
      },
      {
        id: 'php19-queue',
        title: 'Richest first',
        prompt: 'The `Customer` class is written. The first input line is N, then N lines `name,balance`. Make a Customer object for each, sort the objects from the biggest balance to the smallest (ties: name A to Z) and print `Grace: UGX 800,000` for each.',
        starter: php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}
}

$n = (int) trim(fgets(STDIN));
$customers = [];
`,
        usesInput: true,
        sampleInput: '3\nAmina,70000\nBrian,15000\nGrace,800000\n',
        tests: [
          { input: '3\nAmina,70000\nBrian,15000\nGrace,800000\n', expected: out('Grace: UGX 800,000', 'Amina: UGX 70,000', 'Brian: UGX 15,000') },
          { input: '1\nAisha,5000\n', expected: 'Aisha: UGX 5,000', hidden: true, name: 'One customer' },
          { input: '3\nZed,5000\nAmy,5000\nMia,9000\n', expected: out('Mia: UGX 9,000', 'Amy: UGX 5,000', 'Zed: UGX 5,000'), hidden: true, name: 'A tie goes by name' },
        ],
        hints: [
          'Read each line, explode it, and add new Customer($parts[0], (int) $parts[1]) to the array.',
          'usort($customers, fn($a, $b) => $b->balance <=> $a->balance ?: $a->name <=> $b->name);',
          'Then foreach and print $c->name, ": UGX ", number_format($c->balance).',
        ],
      },
      {
        id: 'php19-till',
        title: 'The chained till',
        prompt: 'Write the class `Till` with a method `add(int $amount): static` that adds to a total and returns `$this`, a method `total(): int` and a method `count(): int` (how many amounts were added). The input is a list of amounts, one per line, until the input ends. Add them all (a plain loop is fine) and print:\n\n`Count: 3`\n`Total: UGX 205,000`',
        starter: php`<?php
class Till {
    // add(), total(), count()
}

$till = new Till();
while (($line = fgets(STDIN)) !== false) {
    $amount = (int) trim($line);
}
`,
        usesInput: true,
        sampleInput: '120000\n35000\n50000\n',
        tests: [
          { input: '120000\n35000\n50000\n', expected: out('Count: 3', 'Total: UGX 205,000') },
          { input: '5000\n', expected: out('Count: 1', 'Total: UGX 5,000'), hidden: true, name: 'One amount' },
          { input: '1\n2\n3\n4\n5\n', expected: out('Count: 5', 'Total: UGX 15'), hidden: true, name: 'Five small amounts' },
        ],
        hints: [
          'The class needs two private properties with a starting value of 0: one for the total and one for the count.',
          'add: $this->total += $amount; $this->count++; return $this;',
          'In the loop call $till->add($amount). After the loop print $till->count() and number_format($till->total()).',
        ],
      },
    ],
  },

  // ================================================================== 20
  {
    id: 'php-encapsulation',
    level: LEVEL,
    minutes: 30,
    title: 'Protecting your data',
    summary: 'private and public, readonly, methods that guard the rules, __toString and static factories',
    blocks: [
      {
        t: 'story',
        title: 'The balance that went negative',
        text: "The nephew writes `$wallet->balance = 5000000;` while testing and forgets to remove the line. Next morning Nambi's real wallet shows five million shillings. Another day a typing slip makes a balance -500,000, and every later calculation is wrong.\n\nIf anyone can write to the balance, nobody can promise it is correct. The cure is called **encapsulation**: keep the data **private**, and let the outside world change it only through methods that check the rules. A wallet then simply **cannot** go negative, whoever uses it.",
      },
      {
        t: 'try',
        code: php`<?php
class Wallet {
    private int $balance = 0;

    public function deposit(int $amount): bool {
        if ($amount <= 0) {
            return false;
        }
        $this->balance += $amount;
        return true;
    }

    public function withdraw(int $amount): bool {
        if ($amount <= 0 || $amount > $this->balance) {
            return false;
        }
        $this->balance -= $amount;
        return true;
    }

    public function balance(): int {
        return $this->balance;
    }
}

$w = new Wallet();
$w->deposit(50000);
var_dump($w->withdraw(80000));
var_dump($w->withdraw(20000));
echo $w->balance(), "\n";
`,
        output: out('bool(false)', 'bool(true)', '30000'),
      },
      {
        t: 'list',
        items: [
          '`public` means anyone can use it. `private` means only code **inside the class** can.',
          'The balance is private, so the only ways to change it are `deposit` and `withdraw`, and both check the rules first.',
          'A method that only reads a private value, like `balance()`, is called a **getter**.',
          'The class now **guarantees** that its balance is never negative, and that is a promise the rest of the program does not have to re-check.',
        ],
      },
      { t: 'h', text: 'readonly: set once, never changed' },
      { t: 'p', text: 'Some data should never change after it is created: a receipt says what happened, and it must not be edited afterwards. Mark such properties `readonly`. They can be set once, in the constructor, and read by anyone:' },
      {
        t: 'try',
        code: php`<?php
final class Receipt {
    public function __construct(
        public readonly string $name,
        public readonly int $amount,
    ) {}
}

$r = new Receipt("Amina", 120000);
echo $r->name, " paid UGX ", number_format($r->amount), "\n";
`,
        output: 'Amina paid UGX 120,000\n',
      },
      { t: 'tip', text: '`final` in front of a class says “nobody may build on this class” (lesson 21 explains what building on a class means). Trying to change a readonly property later stops the program with an Error: that is the point.' },
      { t: 'h', text: 'Turning an object into text' },
      { t: 'p', text: 'The special method `__toString` tells PHP how to print an object. Then `echo $receipt` just works:' },
      {
        t: 'try',
        code: php`<?php
final class Receipt {
    public function __construct(
        public readonly string $name,
        public readonly int $amount,
    ) {}

    public function __toString(): string {
        return $this->name . " paid UGX " . number_format($this->amount);
    }
}

echo new Receipt("Brian", 35000), "\n";
`,
        output: 'Brian paid UGX 35,000\n',
      },
      { t: 'h', text: 'A named way to build an object' },
      { t: 'p', text: 'A **static factory** is a static method that builds an object from some other shape of data, here a line of input. It reads better than doing the exploding in the main program, and the class keeps the knowledge of its own format:' },
      {
        t: 'try',
        code: php`<?php
final class Receipt {
    public function __construct(
        public readonly string $name,
        public readonly int $amount,
    ) {}

    public static function fromLine(string $line): self {
        [$name, $amount] = explode(",", $line);
        return new self(trim($name), (int) $amount);
    }
}

$r = Receipt::fromLine("Grace, 800000");
echo $r->name, " ", $r->amount, "\n";
`,
        output: 'Grace 800000\n',
      },
      {
        t: 'predict',
        code: php`<?php
class Wallet {
    private int $balance = 0;
    public function deposit(int $amount): bool {
        if ($amount <= 0) {
            return false;
        }
        $this->balance += $amount;
        return true;
    }
    public function balance(): int {
        return $this->balance;
    }
}
$w = new Wallet();
$w->deposit(100);
$w->deposit(-5);
echo $w->balance();
`,
        question: 'What does this program print?',
        options: ['100', '95', '-5', '0'],
        answer: 0,
        explain: 'The first deposit is accepted. The second is rejected by the check ($amount <= 0), so the balance stays at 100. The rule lives inside the class, so it cannot be bypassed.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that lets a property be set once and never changed afterwards.',
        template: php`<?php
final class Receipt {
    public function __construct(public ___ int $amount) {}
}
$r = new Receipt(500);
echo $r->amount, "\n";
`,
        blanks: [{ options: ['readonly', 'static', 'const'], answer: 'readonly' }],
        output: '500\n',
      },
      {
        t: 'bug',
        code: php`<?php
class Wallet {
    private int $balance = 100;
}
$w = new Wallet();
echo $w->balance, "\n";
`,
        question: 'This program stops with “Cannot access private property”. What is wrong?',
        options: ['balance is private, so code outside the class may not read it', 'balance must be a string', 'new Wallet needs an argument', 'echo cannot print properties'],
        answer: 0,
        explain: 'That is exactly what private is for. If the outside world needs to read the value, give the class a getter method such as balance().',
        fixed: php`<?php
class Wallet {
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
        t: 'reorder',
        prompt: 'Put the lines in order: a class with a private balance and a getter, then make one and print it.',
        lines: ['<?php', 'class Wallet {', '    private int $balance = 70;', '    public function balance(): int { return $this->balance; }', '}', '$w = new Wallet();', 'echo $w->balance(), "\\n";'],
        output: '70\n',
      },
      {
        t: 'quiz',
        question: 'Why is the balance of a Wallet better kept private?',
        options: ['So only the Wallet’s own methods can change it, and they can enforce the rules', 'So it uses less memory', 'So it can be printed', 'Because public properties are not allowed'],
        answer: 0,
        explain: 'Private data can only change through the class’s own code, so the class can promise things (never negative, never above a limit) that outside code cannot break.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
final class Receipt {
    public function __construct(public readonly int $amount) {}
}
$r = new Receipt(500);
$r->amount = 900;`, why: 'A readonly property can be set once. Changing it later stops the program with “Cannot modify readonly property”. Build a new object instead.', right: php`<?php
final class Receipt {
    public function __construct(public readonly int $amount) {}
}
$r = new Receipt(500);
$r = new Receipt(900);
echo $r->amount;` },
          { wrong: php`<?php
class Wallet {
    private function audit(): string {
        return "ok";
    }
}
$w = new Wallet();
echo $w->audit();`, why: 'A private method can only be called from inside the class. Outside code gets “Call to private method”. Make it public, or add a public method that uses it.', right: php`<?php
class Wallet {
    private function audit(): string {
        return "ok";
    }
    public function check(): string {
        return $this->audit();
    }
}
$w = new Wallet();
echo $w->check();` },
          { wrong: php`<?php
class Wallet {
    private int $balance = 0;
    public function setBalance(int $b): void {
        $this->balance = $b;
    }
    public function balance(): int {
        return $this->balance;
    }
}
$w = new Wallet();
$w->setBalance(-500);
echo $w->balance();`, why: 'No error, but a private property with a setter that checks nothing is as unprotected as a public one: it prints -500. The methods that change data must enforce the rules.', right: php`<?php
class Wallet {
    private int $balance = 0;
    public function setBalance(int $b): void {
        if ($b >= 0) {
            $this->balance = $b;
        }
    }
    public function balance(): int {
        return $this->balance;
    }
}
$w = new Wallet();
$w->setBalance(-500);
echo $w->balance();`, logic: true },
          { wrong: php`<?php
class Receipt {
    public function __construct(public readonly $amount) {}
}`, why: 'A readonly property must have a type. PHP stops before running with a fatal error.', right: php`<?php
class Receipt {
    public function __construct(public readonly int $amount) {}
}` },
        ],
      },
      {
        t: 'recap',
        items: [
          '`private` data is reachable only from inside the class; `public` from everywhere. Start with private and open only what must be open.',
          'Methods that change data check the rules first, so the object can never be in a wrong state. A read-only method is a getter.',
          '`readonly` properties are set once in the constructor and never changed. Good for receipts and records of what happened.',
          '`__toString` lets you `echo` an object. A static factory (`Receipt::fromLine($line)`) builds an object from another shape of data.',
        ],
        memory: 'Private data, public methods that guard the rules. readonly for records.',
      },
    ],
    exercises: [
      {
        id: 'php20-wallet',
        title: 'A wallet with rules',
        prompt: 'Finish the class `Wallet`: `deposit(int $amount): bool` (rejects 0 and negative amounts), `withdraw(int $amount): bool` (rejects 0, negatives and more than the balance) and `balance(): int`. The input is a list of commands, one per line: `deposit 5000` or `withdraw 3000`. For each print `OK` or `Rejected`. At the end print `Balance: UGX 2,000`.',
        starter: php`<?php
class Wallet {
    private int $balance = 0;

    public function deposit(int $amount): bool {
        return false;
    }

    public function withdraw(int $amount): bool {
        return false;
    }

    public function balance(): int {
        return $this->balance;
    }
}

$wallet = new Wallet();
while (($line = fgets(STDIN)) !== false) {
    [$command, $amount] = explode(" ", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'deposit 5000\nwithdraw 3000\nwithdraw 9000\n',
        tests: [
          { input: 'deposit 5000\nwithdraw 3000\nwithdraw 9000\n', expected: out('OK', 'OK', 'Rejected', 'Balance: UGX 2,000') },
          { input: 'withdraw 100\ndeposit 0\ndeposit -5\n', expected: out('Rejected', 'Rejected', 'Rejected', 'Balance: UGX 0'), hidden: true, name: 'Everything rejected' },
          { input: 'deposit 1000\nwithdraw 1000\ndeposit 20000\n', expected: out('OK', 'OK', 'OK', 'Balance: UGX 20,000'), hidden: true, name: 'Withdraw the whole balance' },
        ],
        hints: [
          'deposit: if ($amount <= 0) return false; otherwise add to $this->balance and return true.',
          'withdraw: reject when $amount <= 0 or $amount > $this->balance. Otherwise subtract and return true.',
          'In the loop: $ok = $command === "deposit" ? $wallet->deposit((int) $amount) : $wallet->withdraw((int) $amount); then print OK or Rejected.',
        ],
      },
      {
        id: 'php20-receipt',
        title: 'The unchangeable receipt',
        prompt: 'Write `final class Receipt` with **readonly** promoted properties `name`, `service`, `amount`; a static factory `fromLine(string $line): self` (the line is `name,service,amount`); a method `fee(): int` (the booth fee: deposits free; withdrawals up to 50,000 cost 1,000, up to 200,000 cost 2,000, above 3,500) and `__toString(): string`. Read lines until the input ends and `echo` each receipt:\n\n`Amina: withdraw UGX 120,000, fee UGX 2,000, total UGX 122,000`',
        starter: php`<?php
final class Receipt {
    // readonly properties, fromLine(), fee(), __toString()
}

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
}
`,
        usesInput: true,
        sampleInput: 'Amina,withdraw,120000\nBrian,deposit,35000\n',
        tests: [
          {
            input: 'Amina,withdraw,120000\nBrian,deposit,35000\n',
            expected: out(
              `Amina: withdraw UGX ${money(120000)}, fee UGX ${money(boothFee('withdraw', 120000))}, total UGX ${money(120000 + boothFee('withdraw', 120000))}`,
              `Brian: deposit UGX ${money(35000)}, fee UGX 0, total UGX ${money(35000)}`
            ),
          },
          { input: 'Grace,withdraw,800000\n', expected: 'Grace: withdraw UGX 800,000, fee UGX 3,500, total UGX 803,500', hidden: true, name: 'A big withdrawal' },
          { input: 'Dan,withdraw,50000\nEve,withdraw,50001\n', expected: out('Dan: withdraw UGX 50,000, fee UGX 1,000, total UGX 51,000', 'Eve: withdraw UGX 50,001, fee UGX 2,000, total UGX 52,001'), hidden: true, name: 'Both sides of 50,000' },
        ],
        hints: [
          'public function __construct(public readonly string $name, public readonly string $service, public readonly int $amount) {}',
          'fromLine: explode the line, trim the pieces, and return new self(...) with (int) on the amount.',
          '__toString: return the whole text with number_format, using $this->fee() for the fee and $this->amount + $this->fee() for the total. Then echo Receipt::fromLine($line), "\\n";',
        ],
      },
      {
        id: 'php20-limit',
        title: 'A daily limit',
        prompt: 'Write `class DailyLimit` with a constructor taking the limit (`private int $limit`), a **private** property for how much has been used, `tryUse(int $amount): bool` (accepts only if the amount is above 0 and `used + amount` stays within the limit; then it is added to the used total) and `remaining(): int`. The first input line is the limit, the other lines are requested amounts. Print `Approved` or `Declined` for each and, at the end, `Remaining: UGX 100,000`.',
        starter: php`<?php
class DailyLimit {
    // limit, used, tryUse(), remaining()
}

$limit = (int) trim(fgets(STDIN));
`,
        usesInput: true,
        sampleInput: '500000\n300000\n150000\n100000\n',
        tests: [
          { input: '500000\n300000\n150000\n100000\n', expected: out('Approved', 'Approved', 'Declined', 'Remaining: UGX 50,000') },
          { input: '100000\n100000\n1\n', expected: out('Approved', 'Declined', 'Remaining: UGX 0'), hidden: true, name: 'Exactly the limit' },
          { input: '50000\n0\n-10\n20000\n', expected: out('Declined', 'Declined', 'Approved', 'Remaining: UGX 30,000'), hidden: true, name: 'Zero and negative amounts' },
        ],
        hints: [
          'Two private properties: the limit (promoted in the constructor) and $used = 0.',
          'tryUse: if ($amount <= 0 || $this->used + $amount > $this->limit) return false; otherwise $this->used += $amount; return true.',
          'remaining: return $this->limit - $this->used. In the main program read the other lines in a while loop.',
        ],
      },
    ],
  },

  // ================================================================== 21
  {
    id: 'php-inherit',
    level: LEVEL,
    minutes: 32,
    title: 'Inheritance',
    summary: 'Building one class on another: extends, parent::, protected, abstract classes and polymorphism',
    blocks: [
      {
        t: 'story',
        title: 'A family of services',
        text: "The booth started with deposits and withdrawals. Then came sending money, then paying shops, then buying airtime. Each service is a little different (its own fee rule), but each one has a customer, an amount, and needs a receipt line. Copying the whole class for every service would repeat everything, and a fix would need to be made in five places. You know that story from lesson 14.\n\nWith **inheritance** a class can start from another class and change only what is different. The first is the **parent**, the other the **child**. A child **is a** kind of parent: a withdrawal is a transaction.",
      },
      {
        t: 'try',
        code: php`<?php
class Transaction {
    public function __construct(protected string $name, protected int $amount) {}

    public function fee(): int {
        return 0;
    }

    public function describe(): string {
        return $this->name . ": UGX " . number_format($this->amount) . " + fee UGX " . number_format($this->fee());
    }
}

class Withdrawal extends Transaction {
    public function fee(): int {
        return $this->amount <= 50000 ? 1000 : ($this->amount <= 200000 ? 2000 : 3500);
    }
}

$t = new Transaction("Brian", 35000);
$w = new Withdrawal("Amina", 120000);
echo $t->describe(), "\n";
echo $w->describe(), "\n";
`,
        output: out('Brian: UGX 35,000 + fee UGX 0', 'Amina: UGX 120,000 + fee UGX 2,000'),
      },
      {
        t: 'list',
        items: [
          '`class Withdrawal extends Transaction` gives Withdrawal everything Transaction has: the constructor, `describe`, and the properties.',
          'The child **overrides** `fee`: its own version replaces the parent’s. `describe` was not changed, and it automatically uses the child’s `fee()` when called on a Withdrawal.',
          '`protected` means “this class and its children, but not the outside world”. It sits between private and public.',
        ],
      },
      { t: 'h', text: 'parent:: reaches the original' },
      { t: 'p', text: 'An overriding method can still call the parent’s version with `parent::`. Handy to **add** to what the parent does instead of replacing it:' },
      {
        t: 'try',
        code: php`<?php
class Transaction {
    public function __construct(protected string $name, protected int $amount) {}

    public function fee(): int {
        return 0;
    }

    public function describe(): string {
        return $this->name . ": UGX " . number_format($this->amount) . " + fee UGX " . number_format($this->fee());
    }
}

class Send extends Transaction {
    public function fee(): int {
        return 1500;
    }

    public function describe(): string {
        return "[SEND] " . parent::describe();
    }
}

echo (new Send("Grace", 120000))->describe(), "\n";
`,
        output: '[SEND] Grace: UGX 120,000 + fee UGX 1,500\n',
      },
      { t: 'p', text: 'If a child writes its own `__construct`, the parent’s constructor does **not** run on its own. Call `parent::__construct(...)` to set the inherited properties up.' },
      { t: 'h', text: 'abstract: a parent that is only a pattern' },
      { t: 'p', text: 'A plain `Transaction` with a fee of 0 is a bit odd: the booth never does a transaction that is not deposit, withdrawal, or send. Mark the parent `abstract`. It can no longer be created with `new`; it exists only to be built on. An `abstract` method has no body and **forces every child to write it**:' },
      {
        t: 'try',
        code: php`<?php
abstract class Transaction {
    public function __construct(protected string $name, protected int $amount) {}

    abstract public function fee(): int;

    public function total(): int {
        return $this->amount + $this->fee();
    }

    public function describe(): string {
        return $this->name . ": UGX " . number_format($this->total());
    }
}

class Deposit extends Transaction {
    public function fee(): int {
        return 0;
    }
}

class Withdrawal extends Transaction {
    public function fee(): int {
        return $this->amount <= 50000 ? 1000 : ($this->amount <= 200000 ? 2000 : 3500);
    }
}

$day = [new Deposit("Brian", 35000), new Withdrawal("Amina", 120000), new Withdrawal("Grace", 800000)];
$fees = 0;
foreach ($day as $tx) {
    echo $tx->describe(), "\n";
    $fees += $tx->fee();
}
echo "Fees: UGX ", number_format($fees), "\n";
`,
        output: out('Brian: UGX 35,000', 'Amina: UGX 122,000', 'Grace: UGX 803,500', 'Fees: UGX 5,500'),
      },
      { t: 'p', text: 'Look at the loop. It does not care whether `$tx` is a Deposit or a Withdrawal: it just calls `fee()` and `describe()`, and each object does the right thing for its own kind. That is called **polymorphism** (“many shapes”), and it is the real reward of inheritance: a new kind of transaction needs a new class and **no change** to the loop.' },
      { t: 'p', text: '`instanceof` asks what an object is:' },
      {
        t: 'try',
        code: php`<?php
abstract class Transaction {}
class Deposit extends Transaction {}
class Withdrawal extends Transaction {}

$d = new Deposit();
var_dump($d instanceof Transaction);
var_dump($d instanceof Withdrawal);
`,
        output: out('bool(true)', 'bool(false)'),
      },
      { t: 'tip', text: 'Inheritance says “is a”: a Withdrawal **is a** Transaction. When the relation is “has a” (a Wallet **has** a list of transactions) use a property that holds the other object instead. Do not inherit just to reuse a few lines; that makes programs hard to change. `final class` forbids any child, and `final` on a method forbids overriding it.' },
      {
        t: 'predict',
        code: php`<?php
class A {
    public function hi(): string {
        return "A";
    }
}
class B extends A {
    public function hi(): string {
        return parent::hi() . "B";
    }
}
echo (new B())->hi();
`,
        question: 'What does this program print?',
        options: ['AB', 'B', 'A', 'BA'],
        answer: 0,
        explain: 'B overrides hi, but parent::hi() runs the original first and gives "A". The child adds "B" after it: AB.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the word that makes Withdrawal a child of Transaction.',
        template: php`<?php
class Transaction {
    public function kind(): string {
        return "transaction";
    }
}
class Withdrawal ___ Transaction {}
echo (new Withdrawal())->kind(), "\n";
`,
        blanks: [{ options: ['extends', 'implements', 'inherits'], answer: 'extends' }],
        output: 'transaction\n',
      },
      {
        t: 'bug',
        code: php`<?php
abstract class Transaction {
    abstract public function fee(): int;
}
$t = new Transaction();
`,
        question: 'This program stops with “Cannot instantiate abstract class”. What is wrong?',
        options: ['An abstract class can never be created with new; only its children can', 'abstract methods cannot return int', 'The class needs a constructor', 'new must come before the class'],
        answer: 0,
        explain: 'An abstract class is an unfinished pattern: its abstract methods have no code. Create an object of a child class that finishes the job.',
        fixed: php`<?php
abstract class Transaction {
    abstract public function fee(): int;
}
class Deposit extends Transaction {
    public function fee(): int {
        return 0;
    }
}
$t = new Deposit();
echo $t->fee(), "\n";
`,
      },
      {
        t: 'reorder',
        prompt: 'Put the lines in order: a parent class, a child, one object, and a call to the inherited method.',
        lines: ['<?php', 'class Base {', '    public function name(): string { return "base"; }', '}', 'class Child extends Base {}', '$c = new Child();', 'echo $c->name(), "\\n";'],
        output: 'base\n',
      },
      {
        t: 'quiz',
        question: 'What does an abstract method force on every child class?',
        options: ['To write its own version of the method', 'To skip the method', 'To make the method private', 'Nothing: it is only a comment'],
        answer: 0,
        explain: 'An abstract method is a promise the children must keep: it has a name and a signature but no body. A child that does not write it cannot be used.',
      },
      {
        t: 'mistakes',
        items: [
          { wrong: php`<?php
abstract class Transaction {
    abstract public function fee(): int;
}
class Withdrawal extends Transaction {}`, why: 'Withdrawal does not write the abstract method fee(). PHP stops with a fatal error saying the class must implement it or be abstract itself.', right: php`<?php
abstract class Transaction {
    abstract public function fee(): int;
}
class Withdrawal extends Transaction {
    public function fee(): int {
        return 1000;
    }
}
echo (new Withdrawal())->fee();` },
          { wrong: php`<?php
class Transaction {
    public function __construct(protected string $name) {}
}
$t = new Transaction("Amina");
echo $t->name;`, why: 'protected properties are not reachable from outside the class and its children. PHP stops with “Cannot access protected property”. Add a public method that returns it.', right: php`<?php
class Transaction {
    public function __construct(protected string $name) {}
    public function name(): string {
        return $this->name;
    }
}
$t = new Transaction("Amina");
echo $t->name();` },
          { wrong: php`<?php
class Transaction {
    public function __construct(protected string $name) {}
}
class Send extends Transaction {
    public function __construct(private int $fee) {}
    public function label(): string {
        return $this->name;
    }
}
echo (new Send(100))->label();`, why: 'Send wrote its own constructor, so the parent’s constructor never ran and $name was never set. Reading it is an error. Call parent::__construct($name) inside the child constructor.', right: php`<?php
class Transaction {
    public function __construct(protected string $name) {}
}
class Send extends Transaction {
    public function __construct(string $name, private int $fee) {
        parent::__construct($name);
    }
    public function label(): string {
        return $this->name;
    }
}
echo (new Send("Amina", 100))->label();` },
          { wrong: php`<?php
final class Receipt {}
class SpecialReceipt extends Receipt {}`, why: 'A final class cannot be extended. PHP stops with a fatal error. Remove final, or use composition (a property that holds a Receipt).', right: php`<?php
class Receipt {}
class SpecialReceipt extends Receipt {}
echo "ok";` },
        ],
      },
      {
        t: 'recap',
        items: [
          '`class Child extends Parent` inherits everything; the child can **override** a method and reach the original with `parent::`.',
          '`protected` = this class and its children. A child with its own `__construct` must call `parent::__construct(...)`.',
          '`abstract class` cannot be created; `abstract function` has no body and every child must write it.',
          'Polymorphism: code that works with the parent type works with every child, each doing its own version.',
          'Inherit for “is a”. For “has a”, keep the other object in a property.',
        ],
        memory: 'Child is a Parent. override and parent::. abstract = a promise.',
      },
    ],
    exercises: [
      {
        id: 'php21-transactions',
        title: 'A new kind of transaction',
        prompt: 'The abstract class `Transaction` and the children `Deposit` (fee 0) and `Withdrawal` (booth fee) are written. Write the child `Send` (label `send`, fee: up to 5,000 costs 100; 30,000 → 300; 100,000 → 700; 500,000 → 1,500; 2,000,000 → 2,500; more 4,000). Then read lines `type,name,amount` (`deposit`, `withdraw`, `send`) and print `Amina (withdraw): UGX 120,000 + fee UGX 2,000`, and at the end `Fees earned: UGX 5,500`.',
        starter: php`<?php
abstract class Transaction {
    public function __construct(protected string $name, protected int $amount) {}

    abstract public function label(): string;
    abstract public function fee(): int;

    public function describe(): string {
        return $this->name . " (" . $this->label() . "): UGX " . number_format($this->amount) . " + fee UGX " . number_format($this->fee());
    }
}

class Deposit extends Transaction {
    public function label(): string {
        return "deposit";
    }
    public function fee(): int {
        return 0;
    }
}

class Withdrawal extends Transaction {
    public function label(): string {
        return "withdraw";
    }
    public function fee(): int {
        if ($this->amount <= 50000) {
            return 1000;
        }
        return $this->amount <= 200000 ? 2000 : 3500;
    }
}

// write class Send here

$day = [];
while (($line = fgets(STDIN)) !== false) {
    [$type, $name, $amount] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'withdraw,Amina,120000\ndeposit,Brian,35000\nsend,Grace,120000\n',
        tests: [
          {
            input: 'withdraw,Amina,120000\ndeposit,Brian,35000\nsend,Grace,120000\n',
            expected: out(
              `Amina (withdraw): UGX ${money(120000)} + fee UGX ${money(boothFee('withdraw', 120000))}`,
              `Brian (deposit): UGX ${money(35000)} + fee UGX 0`,
              `Grace (send): UGX ${money(120000)} + fee UGX ${money(sendFee(120000))}`,
              `Fees earned: UGX ${money(boothFee('withdraw', 120000) + sendFee(120000))}`
            ),
          },
          { input: 'send,Dan,5000\nsend,Eve,5001\n', expected: out('Dan (send): UGX 5,000 + fee UGX 100', 'Eve (send): UGX 5,001 + fee UGX 300', 'Fees earned: UGX 400'), hidden: true, name: 'Edge of the first send band' },
          { input: 'send,Zed,2000001\n', expected: out('Zed (send): UGX 2,000,001 + fee UGX 4,000', 'Fees earned: UGX 4,000'), hidden: true, name: 'The top send band' },
        ],
        hints: [
          'class Send extends Transaction with label() returning "send" and fee() with the bands (early returns, smallest first).',
          'In the loop choose the class: $tx = match ($type) { "deposit" => new Deposit($name, (int) $amount), "withdraw" => new Withdrawal(...), "send" => new Send(...) };',
          'Add each $tx to $day. After reading, foreach: print $tx->describe() and add $tx->fee() to a total. Print the total last.',
        ],
      },
      {
        id: 'php21-accounts',
        title: 'Savings, fixed and current',
        prompt: 'The abstract class `Account` is written: it holds the balance and gives `yearlyInterest()` as `intdiv(balance * rate(), 100)`. Write three children: `Savings` (rate 5), `FixedDeposit` (rate 12) and `Current` (rate 0). Read lines `kind,balance` (`savings`, `fixed`, `current`) and print `Savings: UGX 100,000 earns UGX 5,000 a year` (kinds start with a capital: Savings, Fixed, Current).',
        starter: php`<?php
abstract class Account {
    public function __construct(protected int $balance) {}

    abstract public function rate(): int;

    public function yearlyInterest(): int {
        return intdiv($this->balance * $this->rate(), 100);
    }

    public function balance(): int {
        return $this->balance;
    }
}

// write Savings, FixedDeposit and Current here

while (($line = fgets(STDIN)) !== false) {
    [$kind, $balance] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'savings,100000\nfixed,250000\ncurrent,40000\n',
        tests: [
          { input: 'savings,100000\nfixed,250000\ncurrent,40000\n', expected: out('Savings: UGX 100,000 earns UGX 5,000 a year', 'Fixed: UGX 250,000 earns UGX 30,000 a year', 'Current: UGX 40,000 earns UGX 0 a year') },
          { input: 'savings,12345\n', expected: `Savings: UGX 12,345 earns UGX ${money(Math.floor((12345 * 5) / 100))} a year`, hidden: true, name: 'Rounded down' },
          { input: 'fixed,1000000\nsavings,0\n', expected: out('Fixed: UGX 1,000,000 earns UGX 120,000 a year', 'Savings: UGX 0 earns UGX 0 a year'), hidden: true, name: 'A million and nothing' },
        ],
        hints: [
          'Each child has one method: public function rate(): int { return 5; } (12 and 0 for the others).',
          'match ($kind) { "savings" => new Savings((int) $balance), ... } makes the right object.',
          'ucfirst($kind) is the label. Print with number_format($account->balance()) and number_format($account->yearlyInterest()).',
        ],
      },
      {
        id: 'php21-vip',
        title: 'VIP customers',
        prompt: 'The class `Customer` is written. Write `VipCustomer extends Customer` that overrides `describe()` and uses `parent::describe()` to add ` (VIP)` at the end. Read lines `name,kind` (`regular` or `vip`) and print each description, for example `Amina` for a regular and `Brian (VIP)` for a VIP.',
        starter: php`<?php
class Customer {
    public function __construct(protected string $name) {}

    public function describe(): string {
        return $this->name;
    }
}

// write VipCustomer here

while (($line = fgets(STDIN)) !== false) {
    [$name, $kind] = explode(",", trim($line));
}
`,
        usesInput: true,
        sampleInput: 'Amina,regular\nBrian,vip\n',
        tests: [
          { input: 'Amina,regular\nBrian,vip\n', expected: out('Amina', 'Brian (VIP)') },
          { input: 'Grace,vip\n', expected: 'Grace (VIP)', hidden: true, name: 'Only a VIP' },
          { input: 'Dan,regular\nEve,regular\nFaith,vip\n', expected: out('Dan', 'Eve', 'Faith (VIP)'), hidden: true, name: 'Mixed' },
        ],
        hints: [
          'class VipCustomer extends Customer { public function describe(): string { ... } }',
          'Inside, return parent::describe() . " (VIP)";',
          'In the loop make the right object: $kind === "vip" ? new VipCustomer($name) : new Customer($name); then echo its describe().',
        ],
      },
    ],
  },
];
