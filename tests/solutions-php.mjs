// Reference solutions for the PHP course (see docs/PHP-TRACK.md). Every PHP exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
import { MOMO_LIB, WALLET_LIB, walletMain } from '../src/content/php/shared.js';
import { API_SOLUTION } from '../src/content/php/level5b.js';

const php = String.raw;

export const phpSolutions = {
  // Level 1: First scripts
  'php1-hello': php`<?php
echo "Hello, Mukono!\n";
`,
  'php1-header': php`<?php
echo "NAMBI'S MONEY BOOTH\n";
echo "Mukono Trading Centre\n";
echo "Open 8am to 8pm\n";
`,
  'php1-fix': php`<?php
echo "Opening hours\n";
echo "Monday to Saturday\n";
echo "8am to 8pm\n";
`,
  'php2-greet': php`<?php
$name = trim(fgets(STDIN));
echo "Hello, ", $name, "! Welcome to Nambi's booth.\n";
`,
  'php2-deposit': php`<?php
$name = trim(fgets(STDIN));
$amount = trim(fgets(STDIN));
echo $name, " deposited UGX ", $amount, "\n";
`,
  'php2-swap': php`<?php
$mtn = (int) trim(fgets(STDIN));
$airtel = (int) trim(fgets(STDIN));
echo "Before: mtn=", $mtn, " airtel=", $airtel, "\n";
$spare = $mtn;
$mtn = $airtel;
$airtel = $spare;
echo "After: mtn=", $mtn, " airtel=", $airtel, "\n";
`,
  'php3-shout': php`<?php
$name = trim(fgets(STDIN));
echo strtoupper($name), " has ", strlen($name), " letters\n";
`,
  'php3-tidy': php`<?php
$raw = fgets(STDIN);
echo ucwords(strtolower(trim($raw))), "\n";
`,
  'php3-mask': php`<?php
$phone = trim(fgets(STDIN));
echo substr($phone, 0, 4) . "***" . substr($phone, -3), "\n";
`,

  'php4-change': php`<?php
$price = (int) trim(fgets(STDIN));
$paid = (int) trim(fgets(STDIN));
$change = $paid - $price;
echo "Change: UGX ", number_format($change), "\n";
`,
  'php4-share': php`<?php
$total = (int) trim(fgets(STDIN));
$friends = (int) trim(fgets(STDIN));
echo "Each gets: UGX ", number_format(intdiv($total, $friends)), "\n";
echo "Left over: UGX ", number_format($total % $friends), "\n";
`,
  'php4-fee': php`<?php
$amount = (int) trim(fgets(STDIN));
$fee = max(500, ceil($amount * 0.02));
echo "Fee: UGX ", number_format($fee), "\n";
echo "Total: UGX ", number_format($amount + $fee), "\n";
`,
  'php5-withdraw': php`<?php
$balance = (int) trim(fgets(STDIN));
$amount = (int) trim(fgets(STDIN));
if ($amount <= $balance) {
    echo "Approved. New balance: UGX ", number_format($balance - $amount), "\n";
} else {
    echo "Declined: not enough balance\n";
}
`,
  'php5-send-fee': php`<?php
$amount = (int) trim(fgets(STDIN));
if ($amount <= 10000) {
    $fee = 500;
} elseif ($amount <= 100000) {
    $fee = 1500;
} elseif ($amount <= 1000000) {
    $fee = 3000;
} else {
    $fee = 5000;
}
echo "Send fee: UGX ", number_format($fee), "\n";
`,
  'php5-queue': php`<?php
$waiting = (int) trim(fgets(STDIN));
if ($waiting <= 3) {
    echo "Short queue\n";
} elseif ($waiting <= 8) {
    echo "Normal queue\n";
} else {
    echo "Long queue: open a second counter\n";
}
`,
  'php6-safe': php`<?php
$balance = (int) trim(fgets(STDIN));
$amount = (int) trim(fgets(STDIN));
$pin = trim(fgets(STDIN));
$usedToday = (int) trim(fgets(STDIN));
if ($pin !== "4821") {
    echo "Wrong PIN\n";
} elseif ($amount > $balance) {
    echo "Not enough balance\n";
} elseif ($usedToday + $amount > 2000000) {
    echo "Daily limit reached\n";
} else {
    echo "Approved\n";
}
`,
  'php6-counter': php`<?php
$network = strtolower(trim(fgets(STDIN)));
echo match ($network) {
    "mtn" => "Counter 1 (yellow)",
    "airtel" => "Counter 2 (red)",
    default => "Counter 3 (other)",
}, "\n";
`,
  'php6-open': php`<?php
$day = trim(fgets(STDIN));
$hour = (int) trim(fgets(STDIN));
if ($day === "Sunday") {
    $open = $hour >= 10 && $hour <= 15;
} else {
    $open = $hour >= 8 && $hour <= 19;
}
echo $open ? "Open" : "Closed", "\n";
`,
  'php7-receipt': php`<?php
$name = trim(fgets(STDIN));
$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));

if ($service === "deposit") {
    $fee = 0;
} elseif ($amount <= 50000) {
    $fee = 1000;
} elseif ($amount <= 200000) {
    $fee = 2000;
} else {
    $fee = 3500;
}
$total = $amount + $fee;

$line = str_repeat("=", 32);
echo $line, "\n";
echo " NAMBI'S MONEY BOOTH - MUKONO\n";
echo $line, "\n";
echo "Customer : ", ucwords($name), "\n";
echo "Service  : ", ucfirst($service), "\n";
echo "Amount   : UGX ", number_format($amount), "\n";
echo "Fee      : UGX ", number_format($fee), "\n";
echo str_repeat("-", 32), "\n";
echo "TOTAL    : UGX ", number_format($total), "\n";
echo "Thank you! Come again.\n";
`,
  'php7-three-fees': php`<?php
$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));
$c = (int) trim(fgets(STDIN));

if ($a <= 50000) {
    $feeA = 1000;
} elseif ($a <= 200000) {
    $feeA = 2000;
} else {
    $feeA = 3500;
}
if ($b <= 50000) {
    $feeB = 1000;
} elseif ($b <= 200000) {
    $feeB = 2000;
} else {
    $feeB = 3500;
}
if ($c <= 50000) {
    $feeC = 1000;
} elseif ($c <= 200000) {
    $feeC = 2000;
} else {
    $feeC = 3500;
}
echo "UGX ", number_format($a), " -> fee UGX ", number_format($feeA), "\n";
echo "UGX ", number_format($b), " -> fee UGX ", number_format($feeB), "\n";
echo "UGX ", number_format($c), " -> fee UGX ", number_format($feeC), "\n";
echo "Total fees: UGX ", number_format($feeA + $feeB + $feeC), "\n";
`,

  // Level 2: Loops and arrays
  'php8-tickets': php`<?php
$n = (int) trim(fgets(STDIN));
for ($i = 1; $i <= $n; $i++) {
    echo "Ticket ", $i, "\n";
}
`,
  'php8-doubling': php`<?php
$savings = (int) trim(fgets(STDIN));
$target = (int) trim(fgets(STDIN));
$months = 0;
while ($savings < $target) {
    $savings *= 2;
    $months++;
}
echo "Months: ", $months, "\n";
echo "Savings: UGX ", number_format($savings), "\n";
`,
  'php8-day-total': php`<?php
$count = 0;
$total = 0;
while (($line = fgets(STDIN)) !== false) {
    $amount = (int) trim($line);
    if ($amount === 0) {
        continue;
    }
    $count++;
    $total += $amount;
}
echo "Counted: ", $count, "\n";
echo "Total: UGX ", number_format($total), "\n";
`,
  'php8-float': php`<?php
$float = (int) trim(fgets(STDIN));
$paid = 0;
while (($line = fgets(STDIN)) !== false) {
    $request = (int) trim($line);
    if ($request > $float) {
        break;
    }
    $float -= $request;
    $paid++;
}
echo "Paid: ", $paid, " withdrawals\n";
echo "Float left: UGX ", number_format($float), "\n";
`,
  'php9-roll-call': php`<?php
$names = [];
while (($line = fgets(STDIN)) !== false) {
    $names[] = trim($line);
}
echo "Customers (", count($names), "): ", implode(", ", $names), "\n";
`,
  'php9-numbered': php`<?php
$line = trim(fgets(STDIN));
$names = explode(",", $line);
foreach ($names as $i => $name) {
    echo $i + 1, ". ", $name, "\n";
}
`,
  'php9-banknotes': php`<?php
$amount = (int) trim(fgets(STDIN));
$notes = [50000, 20000, 10000, 5000, 2000, 1000];
$left = $amount;
foreach ($notes as $note) {
    $how = intdiv($left, $note);
    if ($how > 0) {
        echo "UGX ", number_format($note), " x ", $how, "\n";
    }
    $left %= $note;
}
if ($left > 0) {
    echo "Left over: UGX ", number_format($left), "\n";
}
`,
  'php9-reverse': php`<?php
$n = (int) trim(fgets(STDIN));
$amounts = [];
for ($i = 0; $i < $n; $i++) {
    $amounts[] = trim(fgets(STDIN));
}
$parts = [];
for ($i = count($amounts) - 1; $i >= 0; $i--) {
    $parts[] = $amounts[$i];
}
echo implode(" ", $parts), "\n";
`,
  'php10-price-check': php`<?php
$prices = ["sugar" => 4500, "rice" => 3000, "soap" => 2500, "salt" => 1000];
$item = strtolower(trim(fgets(STDIN)));
if (isset($prices[$item])) {
    echo ucfirst($item), ": UGX ", number_format($prices[$item]), "\n";
} else {
    echo "Not stocked: ", $item, "\n";
}
`,
  'php10-tally': php`<?php
$counts = [];
while (($line = fgets(STDIN)) !== false) {
    $network = trim($line);
    $counts[$network] = ($counts[$network] ?? 0) + 1;
}
foreach ($counts as $network => $n) {
    echo $network, ": ", $n, "\n";
}
`,
  'php10-stock-value': php`<?php
$prices = ["sugar" => 4500, "rice" => 3000, "soap" => 2500];
$quantities = [];
foreach ($prices as $item => $price) {
    $quantities[$item] = (int) trim(fgets(STDIN));
}
$total = 0;
foreach ($prices as $item => $price) {
    $value = $price * $quantities[$item];
    $total += $value;
    echo ucfirst($item), ": ", $quantities[$item], " x UGX ", number_format($price), " = UGX ", number_format($value), "\n";
}
echo "Stock value: UGX ", number_format($total), "\n";
`,
  'php10-big-ones': php`<?php
$n = (int) trim(fgets(STDIN));
$transactions = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $transactions[] = ["name" => $parts[0], "service" => $parts[1], "amount" => (int) $parts[2]];
}
$found = false;
foreach ($transactions as $tx) {
    if ($tx["amount"] >= 100000) {
        echo $tx["name"], ": UGX ", number_format($tx["amount"]), "\n";
        $found = true;
    }
}
if (!$found) {
    echo "No big transactions\n";
}
`,

  'php11-stats': php`<?php
$parts = explode(",", trim(fgets(STDIN)));
$amounts = [];
foreach ($parts as $p) {
    $amounts[] = (int) $p;
}
echo "Count: ", count($amounts), "\n";
echo "Total: UGX ", number_format(array_sum($amounts)), "\n";
echo "Average: UGX ", number_format(array_sum($amounts) / count($amounts)), "\n";
echo "Highest: UGX ", number_format(max($amounts)), "\n";
echo "Lowest: UGX ", number_format(min($amounts)), "\n";
`,
  'php11-top3': php`<?php
$n = (int) trim(fgets(STDIN));
$amounts = [];
for ($i = 0; $i < $n; $i++) {
    $amounts[] = (int) trim(fgets(STDIN));
}
rsort($amounts);
foreach (array_slice($amounts, 0, 3) as $i => $amount) {
    echo $i + 1, ". UGX ", number_format($amount), "\n";
}
`,
  'php11-leaderboard': php`<?php
$n = (int) trim(fgets(STDIN));
$totals = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $totals[$parts[0]] = ($totals[$parts[0]] ?? 0) + (int) $parts[2];
}
ksort($totals);
arsort($totals);
$place = 1;
foreach ($totals as $name => $total) {
    echo $place, ". ", $name, ": UGX ", number_format($total), "\n";
    $place++;
}
`,
  'php11-unique-sorted': php`<?php
$networks = explode(",", trim(fgets(STDIN)));
$unique = array_unique($networks);
sort($unique);
echo "Networks (", count($unique), "): ", implode(", ", $unique), "\n";
`,
  'php12-fees': php`<?php
$n = (int) trim(fgets(STDIN));
$amounts = [];
for ($i = 0; $i < $n; $i++) {
    $amounts[] = (int) trim(fgets(STDIN));
}
$fees = array_map(fn($a) => max(500, (int) ceil($a * 2 / 100)), $amounts);
echo "Fees: ", implode(", ", array_map(fn($f) => number_format($f), $fees)), "\n";
echo "Total fees: UGX ", number_format(array_sum($fees)), "\n";
`,
  'php12-big-sum': php`<?php
$n = (int) trim(fgets(STDIN));
$transactions = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $transactions[] = ["name" => $parts[0], "service" => $parts[1], "amount" => (int) $parts[2]];
}
$big = array_filter($transactions, fn($tx) => $tx["service"] === "withdraw" && $tx["amount"] >= 100000);
echo "Big withdrawals: ", count($big), "\n";
echo "Total: UGX ", number_format(array_sum(array_column($big, "amount"))), "\n";
`,
  'php12-sort-records': php`<?php
$n = (int) trim(fgets(STDIN));
$transactions = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $transactions[] = ["name" => $parts[0], "service" => $parts[1], "amount" => (int) $parts[2]];
}
usort($transactions, fn($a, $b) => $b["amount"] <=> $a["amount"] ?: $a["name"] <=> $b["name"]);
foreach ($transactions as $tx) {
    echo $tx["name"], " ", $tx["service"], " UGX ", number_format($tx["amount"]), "\n";
}
`,
  'php13-summary': php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$deposits = 0;
$depositTotal = 0;
$withdrawals = 0;
$withdrawalTotal = 0;
$fees = 0;
$biggest = $txs[0];
foreach ($txs as $tx) {
    if ($tx["service"] === "deposit") {
        $deposits++;
        $depositTotal += $tx["amount"];
    } else {
        $withdrawals++;
        $withdrawalTotal += $tx["amount"];
        if ($tx["amount"] <= 50000) {
            $fees += 1000;
        } elseif ($tx["amount"] <= 200000) {
            $fees += 2000;
        } else {
            $fees += 3500;
        }
    }
    if ($tx["amount"] > $biggest["amount"]) {
        $biggest = $tx;
    }
}
$names = array_unique(array_column($txs, "name"));
sort($names);
echo "DAILY SUMMARY - NAMBI'S MONEY BOOTH\n";
echo "Transactions : ", count($txs), "\n";
echo "Deposits     : ", $deposits, " (UGX ", number_format($depositTotal), ")\n";
echo "Withdrawals  : ", $withdrawals, " (UGX ", number_format($withdrawalTotal), ")\n";
echo "Fees earned  : UGX ", number_format($fees), "\n";
echo "Biggest      : ", $biggest["name"], " (UGX ", number_format($biggest["amount"]), ")\n";
echo "Customers    : ", implode(", ", $names), "\n";
`,
  'php13-ranking': php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$totals = [];
$counts = [];
foreach ($txs as $tx) {
    $totals[$tx["name"]] = ($totals[$tx["name"]] ?? 0) + $tx["amount"];
    $counts[$tx["name"]] = ($counts[$tx["name"]] ?? 0) + 1;
}
ksort($totals);
arsort($totals);
$place = 1;
foreach ($totals as $name => $total) {
    echo $place, ". ", $name, ": UGX ", number_format($total), " (", $counts[$name], " tx)\n";
    $place++;
}
`,
  'php13-fee-report': php`<?php
$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["name" => $name, "service" => $service, "amount" => (int) $amount];
}

$bands = [];
$totalFees = 0;
foreach ($txs as $tx) {
    if ($tx["service"] === "deposit") {
        $fee = 0;
    } elseif ($tx["amount"] <= 50000) {
        $fee = 1000;
    } elseif ($tx["amount"] <= 200000) {
        $fee = 2000;
    } else {
        $fee = 3500;
    }
    $bands[$fee] = ($bands[$fee] ?? 0) + 1;
    $totalFees += $fee;
}
ksort($bands);
foreach ($bands as $fee => $count) {
    echo "Fee UGX ", number_format($fee), " x ", $count, " = UGX ", number_format($fee * $count), "\n";
}
echo "Total fees: UGX ", number_format($totalFees), "\n";
`,

  // Level 3: Functions
  'php14-fee': php`<?php
function fee($service, $amount) {
    if ($service === "deposit") {
        return 0;
    }
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

$service = strtolower(trim(fgets(STDIN)));
$amount = (int) trim(fgets(STDIN));
echo "Fee: UGX ", number_format(fee($service, $amount)), "\n";
`,
  'php14-statement': php`<?php
function fee($service, $amount) {
    if ($service === "deposit") {
        return 0;
    }
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

function total($service, $amount) {
    return $amount + fee($service, $amount);
}

$n = (int) trim(fgets(STDIN));
$fees = 0;
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $amount = (int) $amount;
    $fees += fee($service, $amount);
    echo $name, ": UGX ", number_format($amount), " + fee UGX ", number_format(fee($service, $amount)), " = UGX ", number_format(total($service, $amount)), "\n";
}
echo "Fees earned: UGX ", number_format($fees), "\n";
`,
  'php14-lowhigh': php`<?php
function lowHigh($list) {
    return [min($list), max($list)];
}

$amounts = [];
foreach (explode(",", trim(fgets(STDIN))) as $part) {
    $amounts[] = (int) $part;
}
[$low, $high] = lowHigh($amounts);
echo "Low: UGX ", number_format($low), "\n";
echo "High: UGX ", number_format($high), "\n";
echo "Gap: UGX ", number_format($high - $low), "\n";
`,
  'php14-discount': php`<?php
function discount($amount, $percent) {
    return intdiv($amount * (100 - $percent), 100);
}

$amount = (int) trim(fgets(STDIN));
$percent = (int) trim(fgets(STDIN));
echo "Pay: UGX ", number_format(discount($amount, $percent)), "\n";
`,
  'php15-parse-amount': php`<?php
declare(strict_types=1);

function parseAmount(string $text): ?int {
    if (!ctype_digit($text)) {
        return null;
    }
    return (int) $text;
}

while (($line = fgets(STDIN)) !== false) {
    $text = trim($line);
    $amount = parseAmount($text);
    if ($amount === null) {
        echo "Invalid: ", $text, "\n";
    } else {
        echo "UGX ", number_format($amount), "\n";
    }
}
`,
  'php15-money-format': php`<?php
function money(int $amount, string $currency = "UGX", bool $commas = true): string {
    $shown = $commas ? number_format($amount) : (string) $amount;
    return $currency . " " . $shown;
}

$amount = (int) trim(fgets(STDIN));
echo money($amount), "\n";
echo money($amount, commas: false), "\n";
echo money($amount, currency: "KES"), "\n";
`,
  'php15-clamp': php`<?php
function clamp(int $value, int $min = 0, int $max = 100): int {
    return min($max, max($min, $value));
}

$v = (int) trim(fgets(STDIN));
echo clamp($v), "\n";
echo clamp($v, max: 50), "\n";
echo clamp($v, 10, 20), "\n";
`,
  'php15-strict-fee': php`<?php
declare(strict_types=1);

function fee(string $service, int $amount): int {
    if ($service === "deposit") {
        return 0;
    }
    if ($amount <= 50000) {
        return 1000;
    }
    if ($amount <= 200000) {
        return 2000;
    }
    return 3500;
}

$service = strtolower(trim(fgets(STDIN)));
$amountText = trim(fgets(STDIN));
$amount = (int) $amountText;
echo "Fee: UGX ", number_format(fee($service, $amount)), "\n";
`,
  'php16-tickets': php`<?php
function nextTicket(string $service): string {
    static $counts = [];
    $counts[$service] = ($counts[$service] ?? 0) + 1;
    return strtoupper($service[0]) . "-" . $counts[$service];
}

while (($line = fgets(STDIN)) !== false) {
    $service = strtolower(trim($line));
    echo nextTicket($service), "\n";
}
`,
  'php16-add-total': php`<?php
function addTo(int $amount, int &$total, int &$count): void {
    $total += $amount;
    $count++;
}

$total = 0;
$count = 0;
while (($line = fgets(STDIN)) !== false) {
    $amount = (int) trim($line);
    addTo($amount, $total, $count);
}
echo "Count: ", $count, "\n";
echo "Total: UGX ", number_format($total), "\n";
`,
  'php16-swap': php`<?php
function swap(&$a, &$b) {
    $temp = $a;
    $a = $b;
    $b = $temp;
}

$x = (int) trim(fgets(STDIN));
$y = (int) trim(fgets(STDIN));
echo "Before: ", $x, " and ", $y, "\n";
swap($x, $y);
echo "After: ", $x, " and ", $y, "\n";
`,
  'php16-total-fees': php`<?php
function totalFees(array $txs): int {
    $sum = 0;
    foreach ($txs as $tx) {
        if ($tx["service"] === "deposit") {
            continue;
        }
        if ($tx["amount"] <= 50000) {
            $sum += 1000;
        } elseif ($tx["amount"] <= 200000) {
            $sum += 2000;
        } else {
            $sum += 3500;
        }
    }
    return $sum;
}

$n = (int) trim(fgets(STDIN));
$txs = [];
for ($i = 0; $i < $n; $i++) {
    [$name, $service, $amount] = explode(",", trim(fgets(STDIN)));
    $txs[] = ["service" => $service, "amount" => (int) $amount];
}
echo "Fees earned: UGX ", number_format(totalFees($txs)), "\n";
`,

  'php17-receipt-lines': php`<?php
$n = (int) trim(fgets(STDIN));
$total = 0;
for ($i = 0; $i < $n; $i++) {
    [$item, $price] = explode(",", trim(fgets(STDIN)));
    $price = (int) $price;
    $total += $price;
    printf("%-14s %10s\n", $item, number_format($price));
}
echo str_repeat("-", 25), "\n";
printf("%-14s %10s\n", "TOTAL", number_format($total));
`,
  'php17-phone-check': php`<?php
while (($line = fgets(STDIN)) !== false) {
    $phone = trim($line);
    if (preg_match('/^0[0-9]{9}$/', $phone) !== 1) {
        echo $phone, ": invalid\n";
        continue;
    }
    $prefix = substr($phone, 0, 3);
    if (in_array($prefix, ["077", "078", "076"], true)) {
        $network = "MTN";
    } elseif (in_array($prefix, ["070", "075", "074"], true)) {
        $network = "Airtel";
    } else {
        $network = "other";
    }
    echo $phone, ": ", $network, "\n";
}
`,
  'php17-normalise': php`<?php
while (($line = fgets(STDIN)) !== false) {
    $digits = preg_replace('/\D/', '', trim($line));
    if (str_starts_with($digits, "0")) {
        $digits = "256" . substr($digits, 1);
    }
    echo $digits, "\n";
}
`,
  'php17-tx-ids': php`<?php
while (($line = fgets(STDIN)) !== false) {
    [$id, $name, $amount] = explode(",", trim($line));
    printf("TX-%06d  %-8s UGX %s\n", (int) $id, $name, number_format((int) $amount));
}
`,
  'php18-send-fee': php`<?php
declare(strict_types=1);

function sendFee(int $amount): int {
    if ($amount <= 5000) {
        return 100;
    }
    if ($amount <= 30000) {
        return 300;
    }
    if ($amount <= 100000) {
        return 700;
    }
    if ($amount <= 500000) {
        return 1500;
    }
    if ($amount <= 2000000) {
        return 2500;
    }
    return 4000;
}

$amount = (int) trim(fgets(STDIN));
echo "Fee: UGX ", number_format(sendFee($amount)), "\n";
`,
  'php18-quote': MOMO_LIB.slice(0, MOMO_LIB.indexOf('function fee(')) + php`function fee(string $type, int $amount): int {
    return match ($type) {
        "send" => sendFee($amount),
        "withdraw" => withdrawFee($amount),
        default => 0,
    };
}

function levy(string $type, int $amount): int {
    return $type === "withdraw" ? (int) ceil($amount * 5 / 1000) : 0;
}

$parts = explode(",", trim(fgets(STDIN)));
$type = strtolower(trim($parts[0]));
$amount = (int) $parts[1];
$fee = fee($type, $amount);
$levy = levy($type, $amount);
echo "Fee: UGX ", number_format($fee), "\n";
echo "Levy: UGX ", number_format($levy), "\n";
echo "Total: UGX ", number_format($amount + $fee + $levy), "\n";
`,
  'php18-statement': MOMO_LIB + php`
printf("%-9s %10s %7s %6s %11s\n", "Type", "Amount", "Fee", "Levy", "Total");
echo str_repeat("-", 47), "\n";
$valid = 0;
$invalid = 0;
$fees = 0;
$levies = 0;
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    $parsed = parseLine($line);
    if ($parsed === null) {
        echo "Invalid: ", $line, "\n";
        $invalid++;
        continue;
    }
    [$type, $amount] = $parsed;
    $fee = fee($type, $amount);
    $levy = levy($type, $amount);
    $valid++;
    $fees += $fee;
    $levies += $levy;
    printf("%-9s %10s %7s %6s %11s\n", ucfirst($type), money($amount), money($fee), money($levy), money($amount + $fee + $levy));
}
echo str_repeat("-", 47), "\n";
echo "Valid: ", $valid, ", invalid: ", $invalid, "\n";
echo "Fees collected : UGX ", money($fees), "\n";
echo "Levy collected : UGX ", money($levies), "\n";
`,

  // Level 4: Objects
  'php19-customer': php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}

    public function deposit(int $amount): void {
        $this->balance += $amount;
    }

    public function describe(): string {
        return $this->name . ": UGX " . number_format($this->balance);
    }
}

$name = trim(fgets(STDIN));
$balance = (int) trim(fgets(STDIN));
$deposit = (int) trim(fgets(STDIN));
$c = new Customer($name, $balance);
$c->deposit($deposit);
echo $c->describe(), "\n";
`,
  'php19-queue': php`<?php
class Customer {
    public function __construct(public string $name, public int $balance = 0) {}
}

$n = (int) trim(fgets(STDIN));
$customers = [];
for ($i = 0; $i < $n; $i++) {
    $parts = explode(",", trim(fgets(STDIN)));
    $customers[] = new Customer($parts[0], (int) $parts[1]);
}
usort($customers, fn($a, $b) => $b->balance <=> $a->balance ?: $a->name <=> $b->name);
foreach ($customers as $c) {
    echo $c->name, ": UGX ", number_format($c->balance), "\n";
}
`,
  'php19-till': php`<?php
class Till {
    private int $total = 0;
    private int $count = 0;

    public function add(int $amount): static {
        $this->total += $amount;
        $this->count++;
        return $this;
    }

    public function total(): int {
        return $this->total;
    }

    public function count(): int {
        return $this->count;
    }
}

$till = new Till();
while (($line = fgets(STDIN)) !== false) {
    $amount = (int) trim($line);
    $till->add($amount);
}
echo "Count: ", $till->count(), "\n";
echo "Total: UGX ", number_format($till->total()), "\n";
`,
  'php20-wallet': php`<?php
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

$wallet = new Wallet();
while (($line = fgets(STDIN)) !== false) {
    [$command, $amount] = explode(" ", trim($line));
    $ok = $command === "deposit" ? $wallet->deposit((int) $amount) : $wallet->withdraw((int) $amount);
    echo $ok ? "OK" : "Rejected", "\n";
}
echo "Balance: UGX ", number_format($wallet->balance()), "\n";
`,
  'php20-receipt': php`<?php
final class Receipt {
    public function __construct(
        public readonly string $name,
        public readonly string $service,
        public readonly int $amount,
    ) {}

    public static function fromLine(string $line): self {
        [$name, $service, $amount] = explode(",", $line);
        return new self(trim($name), trim($service), (int) $amount);
    }

    public function fee(): int {
        if ($this->service === "deposit") {
            return 0;
        }
        if ($this->amount <= 50000) {
            return 1000;
        }
        return $this->amount <= 200000 ? 2000 : 3500;
    }

    public function __toString(): string {
        return $this->name . ": " . $this->service . " UGX " . number_format($this->amount)
            . ", fee UGX " . number_format($this->fee())
            . ", total UGX " . number_format($this->amount + $this->fee());
    }
}

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    echo Receipt::fromLine($line), "\n";
}
`,
  'php20-limit': php`<?php
class DailyLimit {
    private int $used = 0;

    public function __construct(private int $limit) {}

    public function tryUse(int $amount): bool {
        if ($amount <= 0 || $this->used + $amount > $this->limit) {
            return false;
        }
        $this->used += $amount;
        return true;
    }

    public function remaining(): int {
        return $this->limit - $this->used;
    }
}

$limit = (int) trim(fgets(STDIN));
$day = new DailyLimit($limit);
while (($line = fgets(STDIN)) !== false) {
    echo $day->tryUse((int) trim($line)) ? "Approved" : "Declined", "\n";
}
echo "Remaining: UGX ", number_format($day->remaining()), "\n";
`,
  'php21-transactions': php`<?php
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

class Send extends Transaction {
    public function label(): string {
        return "send";
    }
    public function fee(): int {
        if ($this->amount <= 5000) {
            return 100;
        }
        if ($this->amount <= 30000) {
            return 300;
        }
        if ($this->amount <= 100000) {
            return 700;
        }
        if ($this->amount <= 500000) {
            return 1500;
        }
        if ($this->amount <= 2000000) {
            return 2500;
        }
        return 4000;
    }
}

$day = [];
while (($line = fgets(STDIN)) !== false) {
    [$type, $name, $amount] = explode(",", trim($line));
    $day[] = match ($type) {
        "deposit" => new Deposit($name, (int) $amount),
        "withdraw" => new Withdrawal($name, (int) $amount),
        "send" => new Send($name, (int) $amount),
    };
}
$fees = 0;
foreach ($day as $tx) {
    echo $tx->describe(), "\n";
    $fees += $tx->fee();
}
echo "Fees earned: UGX ", number_format($fees), "\n";
`,
  'php21-accounts': php`<?php
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

class Savings extends Account {
    public function rate(): int {
        return 5;
    }
}

class FixedDeposit extends Account {
    public function rate(): int {
        return 12;
    }
}

class Current extends Account {
    public function rate(): int {
        return 0;
    }
}

while (($line = fgets(STDIN)) !== false) {
    [$kind, $balance] = explode(",", trim($line));
    $account = match ($kind) {
        "savings" => new Savings((int) $balance),
        "fixed" => new FixedDeposit((int) $balance),
        "current" => new Current((int) $balance),
    };
    echo ucfirst($kind), ": UGX ", number_format($account->balance()), " earns UGX ", number_format($account->yearlyInterest()), " a year\n";
}
`,
  'php21-vip': php`<?php
class Customer {
    public function __construct(protected string $name) {}

    public function describe(): string {
        return $this->name;
    }
}

class VipCustomer extends Customer {
    public function describe(): string {
        return parent::describe() . " (VIP)";
    }
}

while (($line = fgets(STDIN)) !== false) {
    [$name, $kind] = explode(",", trim($line));
    $c = $kind === "vip" ? new VipCustomer($name) : new Customer($name);
    echo $c->describe(), "\n";
}
`,

  'php22-service': php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
    case Send = "send";

    public function label(): string {
        return ucfirst($this->value);
    }

    public function fee(int $amount): int {
        return match ($this) {
            self::Deposit => 0,
            self::Withdraw => $amount <= 50000 ? 1000 : ($amount <= 200000 ? 2000 : 3500),
            self::Send => max(100, (int) ceil($amount / 100)),
        };
    }
}

while (($line = fgets(STDIN)) !== false) {
    [$name, $amount] = explode(",", trim($line));
    $service = Service::tryFrom($name);
    if ($service === null) {
        echo "Unknown service: ", $name, "\n";
    } else {
        echo $service->label(), ": fee UGX ", number_format($service->fee((int) $amount)), "\n";
    }
}
`,
  'php22-printable': php`<?php
interface Printable {
    public function render(): string;
}

class Slip implements Printable {
    public function __construct(private string $name, private int $amount) {}

    public function render(): string {
        return "RECEIPT " . $this->name . " UGX " . number_format($this->amount);
    }
}

class SmsText implements Printable {
    public function __construct(private string $name, private string $phone, private int $amount) {}

    public function render(): string {
        return "SMS to " . $this->phone . ": " . $this->name . ", you paid UGX " . number_format($this->amount);
    }
}

function show(Printable $p): void {
    echo $p->render(), "\n";
}

while (($line = fgets(STDIN)) !== false) {
    [$name, $phone, $amount] = explode(",", trim($line));
    show(new Slip($name, (int) $amount));
    show(new SmsText($name, $phone, (int) $amount));
}
`,
  'php22-trait': php`<?php
trait Money {
    public function ugx(int $n): string {
        return "UGX " . number_format($n);
    }
}

class Receipt {
    use Money;
    public function __construct(private string $name, private int $amount) {}
    public function line(): string {
        return "Receipt: " . $this->name . " " . $this->ugx($this->amount);
    }
}

class Invoice {
    use Money;
    public function __construct(private string $name, private int $amount) {}
    public function line(): string {
        return "Invoice: " . $this->name . " " . $this->ugx($this->amount) . " due";
    }
}

while (($line = fgets(STDIN)) !== false) {
    [$name, $amount] = explode(",", trim($line));
    echo (new Receipt($name, (int) $amount))->line(), "\n";
    echo (new Invoice($name, (int) $amount))->line(), "\n";
}
`,
  'php22-status': php`<?php
enum Status: string {
    case Pending = "pending";
    case Paid = "paid";
    case Failed = "failed";

    public function isFinal(): bool {
        return match ($this) {
            self::Pending => false,
            self::Paid, self::Failed => true,
        };
    }
}

while (($line = fgets(STDIN)) !== false) {
    $text = strtolower(trim($line));
    $status = Status::tryFrom($text);
    if ($status === null) {
        echo $text, ": unknown status\n";
    } else {
        echo $text, ": ", $status->isFinal() ? "final" : "waiting", "\n";
    }
}
`,
  'php23-handle': php`<?php
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
    try {
        if ($command === "deposit") {
            $wallet->deposit((int) $amount);
        } else {
            $wallet->withdraw((int) $amount);
        }
        echo "OK: balance UGX ", number_format($wallet->balance()), "\n";
    } catch (InvalidArgumentException | InsufficientFundsException $e) {
        echo "Declined: ", $e->getMessage(), "\n";
    } finally {
        $attempts++;
    }
}
echo "Attempts: ", $attempts, "\n";
`,
  'php23-parse-throw': php`<?php
function parseAmount(string $text): int {
    if (!ctype_digit($text)) {
        throw new InvalidArgumentException("Not a whole number: " . $text);
    }
    $n = (int) $text;
    if ($n === 0) {
        throw new InvalidArgumentException("Amount must be above zero");
    }
    return $n;
}

while (($line = fgets(STDIN)) !== false) {
    $text = trim($line);
    try {
        $amount = parseAmount($text);
        echo "UGX ", number_format($amount), "\n";
    } catch (InvalidArgumentException $e) {
        echo "Error: ", $e->getMessage(), "\n";
    }
}
`,
  'php23-custom': php`<?php
class LimitExceededException extends Exception {
    public function __construct(public readonly int $limit) {
        parent::__construct("Limit of UGX " . number_format($limit) . " exceeded");
    }
}

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
    try {
        $atm->pay($amount);
        echo "Approved UGX ", number_format($amount), "\n";
    } catch (LimitExceededException $e) {
        echo "Declined: ", $e->getMessage(), "\n";
    }
}
`,
  'php24-session': WALLET_LIB + walletMain(),
  'php24-summary': WALLET_LIB.replace('    private function requirePositive', php`    public function count(Kind $kind): int {
        $n = 0;
        foreach ($this->history as $tx) {
            if ($tx->kind === $kind) {
                $n++;
            }
        }
        return $n;
    }

    public function feesPaid(): int {
        $sum = 0;
        foreach ($this->history as $tx) {
            $sum += $tx->fee;
        }
        return $sum;
    }

    private function requirePositive`) + php`
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
  'php24-limit': WALLET_LIB.replace(
    'class InsufficientFundsException',
    php`class LimitExceededException extends RuntimeException {
    public function __construct(int $limit) {
        parent::__construct("Limit is UGX " . number_format($limit) . " per withdrawal");
    }
}

class InsufficientFundsException`
  ).replace(
    '        $fee = self::feeFor($amount);\n',
    php`        if ($amount > 1000000) {
            throw new LimitExceededException(1000000);
        }
        $fee = self::feeFor($amount);
`
  ) + walletMain('InvalidAmountException | InsufficientFundsException | LimitExceededException'),
  // Level 5: Market-ready PHP (lessons 25-27)
  'php25-parse-request': php`<?php
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$method, $target] = explode(" ", $line);
    $parts = parse_url($target);
    echo $method, " ", $parts["path"], "\n";
    if (isset($parts["query"])) {
        parse_str($parts["query"], $params);
        foreach ($params as $key => $value) {
            echo "  ", $key, " = ", $value, "\n";
        }
    }
}
`,
  'php25-router': php`<?php
function statusText(int $code): string {
    return match ($code) {
        200 => "OK",
        201 => "Created",
        404 => "Not Found",
        405 => "Method Not Allowed",
    };
}

function route(string $method, string $path): int {
    $routes = [
        "/balance" => ["GET", 200],
        "/deposit" => ["POST", 201],
        "/withdraw" => ["POST", 200],
        "/transactions" => ["GET", 200],
    ];
    if (!isset($routes[$path])) {
        return 404;
    }
    return $routes[$path][0] === $method ? $routes[$path][1] : 405;
}

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$method, $path] = explode(" ", $line);
    $status = route($method, $path);
    echo $method, " ", $path, " -> ", $status, " ", statusText($status), "\n";
}
`,
  'php25-build-url': php`<?php
$base = trim(fgets(STDIN));
$params = [];
while (($line = fgets(STDIN)) !== false) {
    $line = rtrim($line, "\r\n");
    if ($line === "") {
        continue;
    }
    [$key, $value] = explode("=", $line, 2);
    $params[$key] = $value;
}
echo $params === [] ? $base : $base . "?" . http_build_query($params), "\n";
`,
  'php26-validate-deposit': php`<?php
$name = trim(fgets(STDIN));
$amount = trim(fgets(STDIN));
$phone = trim(fgets(STDIN));
$errors = [];
if ($name === "") {
    $errors[] = "name: Name is required";
} elseif (mb_strlen($name) > 40) {
    $errors[] = "name: Name is too long";
}
$n = filter_var($amount, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1000, "max_range" => 5000000]]);
if ($n === false) {
    $errors[] = "amount: Amount must be a whole number from 1,000 to 5,000,000";
}
if (preg_match('/^0[0-9]{9}$/', $phone) !== 1) {
    $errors[] = "phone: Phone must be 10 digits starting with 0";
}
if ($errors === []) {
    echo "OK: ", $name, " deposits UGX ", number_format($n), " from ", $phone, "\n";
} else {
    echo implode("\n", $errors), "\n";
}
`,
  'php26-service-form': php`<?php
enum Service: string {
    case Deposit = "deposit";
    case Withdraw = "withdraw";
    case Send = "send";
}

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$text, $amountText] = array_map("trim", explode(",", $line, 2));
    $service = Service::tryFrom(strtolower($text));
    $amount = filter_var($amountText, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);
    $errors = [];
    if ($service === null) {
        $errors[] = 'service: Unknown service "' . $text . '"';
    }
    if ($amount === false) {
        $errors[] = "amount: Invalid amount";
    }
    if ($errors === []) {
        echo $service->name, " UGX ", number_format($amount), "\n";
    } else {
        echo implode("\n", $errors), "\n";
    }
}
`,
  'php26-form-errors': php`<?php
function required(array $input, array $fields): array {
    $missing = [];
    foreach ($fields as $field) {
        if (trim($input[$field] ?? "") === "") {
            $missing[] = $field;
        }
    }
    return $missing;
}

$fields = explode(",", trim(fgets(STDIN)));
$input = [];
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$key, $value] = explode("=", $line, 2);
    $input[$key] = $value;
}
$missing = required($input, $fields);
echo $missing === [] ? "All fields present" : "Missing: " . implode(", ", $missing), "\n";
`,
  'php27-escape': php`<?php
function e(string $t): string {
    return htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

echo "<ul>\n";
while (($line = fgets(STDIN)) !== false) {
    $name = rtrim($line, "\r\n");
    echo "<li>", e($name), "</li>\n";
}
echo "</ul>\n";
`,
  'php27-login': php`<?php
$users = [];
while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
    if (count($parts) !== 3) {
        continue;
    }
    [$command, $name, $password] = $parts;
    if ($command === "register") {
        if (isset($users[$name])) {
            echo "Name taken\n";
        } else {
            $users[$name] = password_hash($password, PASSWORD_DEFAULT);
            echo "Registered ", $name, "\n";
        }
    } elseif ($command === "login") {
        if (isset($users[$name]) && password_verify($password, $users[$name])) {
            echo "Welcome ", $name, "\n";
        } else {
            echo "Wrong name or password\n";
        }
    }
}
`,
  'php27-token-check': php`<?php
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$expected, $given] = explode(" ", $line);
    echo hash_equals($expected, $given) ? "valid" : "invalid", "\n";
}
`,
  // Level 5 (lessons 28-30)
  'php28-ledger-file': php`<?php
$h = fopen("ledger.csv", "w");
while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
    if (count($parts) === 3) {
        fputcsv($h, [$parts[1], $parts[2]]);
    }
}
fclose($h);

$totals = [];
$h = fopen("ledger.csv", "r");
while (($row = fgetcsv($h)) !== false) {
    $totals[$row[0]] = ($totals[$row[0]] ?? 0) + (int) $row[1];
}
fclose($h);
foreach ($totals as $name => $total) {
    echo $name, ": UGX ", number_format($total), "\n";
}
`,
  'php28-json-statement': php`<?php
$text = trim(stream_get_contents(STDIN));
try {
    $data = json_decode($text, true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    echo "Invalid JSON\n";
    exit;
}
if (!is_array($data)) {
    echo "Invalid JSON\n";
    exit;
}
$net = 0;
echo "Statement for ", $data["name"], "\n";
foreach ($data["transactions"] ?? [] as $t) {
    if ($t["type"] === "deposit") {
        $net += $t["amount"];
        echo "+ ", number_format($t["amount"]), "\n";
    } else {
        $net -= $t["amount"];
        echo "- ", number_format($t["amount"]), "\n";
    }
}
echo "Net: ", number_format($net), "\n";
`,
  'php28-json-out': php`<?php
$customers = [];
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$name, $amount] = explode(",", $line);
    $customers[] = ["name" => $name, "amount" => (int) $amount];
}
echo json_encode([
    "count" => count($customers),
    "total" => array_sum(array_column($customers, "amount")),
    "customers" => $customers,
], JSON_PRETTY_PRINT), "\n";
`,
  'php29-ledger': php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$db->exec("create table tx (id integer primary key autoincrement, name text not null, kind text not null, amount integer not null)");

while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
    if ($parts[0] === "deposit" || $parts[0] === "withdraw") {
        $stmt = $db->prepare("insert into tx (name, kind, amount) values (?, ?, ?)");
        $stmt->execute([$parts[1], $parts[0], (int) $parts[2]]);
    } elseif ($parts[0] === "report") {
        $rows = $db->query("select name, sum(case kind when 'deposit' then amount else -amount end) as balance from tx group by name order by name")->fetchAll();
        if ($rows === []) {
            echo "No transactions\n";
        }
        foreach ($rows as $row) {
            echo $row["name"], ": UGX ", number_format($row["balance"]), "\n";
        }
    }
}
`,
  'php29-transfer': php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$db->exec("create table acct (name text primary key, balance integer not null check (balance >= 0))");

function transfer(PDO $db, string $from, string $to, int $amount): void {
    if ($amount <= 0) {
        throw new InvalidArgumentException("Amount must be above zero");
    }
    $db->beginTransaction();
    try {
        $give = $db->prepare("update acct set balance = balance + ? where name = ?");
        $give->execute([$amount, $to]);
        if ($give->rowCount() !== 1) {
            throw new RuntimeException("No such account: " . $to);
        }
        $take = $db->prepare("update acct set balance = balance - ? where name = ?");
        $take->execute([$amount, $from]);
        if ($take->rowCount() !== 1) {
            throw new RuntimeException("No such account: " . $from);
        }
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        throw $e;
    }
}

while (($line = fgets(STDIN)) !== false) {
    $parts = explode(" ", trim($line));
    if ($parts[0] === "open") {
        $stmt = $db->prepare("insert into acct (name, balance) values (?, ?)");
        $stmt->execute([$parts[1], (int) $parts[2]]);
        echo "Opened ", $parts[1], "\n";
    } elseif ($parts[0] === "transfer") {
        try {
            transfer($db, $parts[1], $parts[2], (int) $parts[3]);
            echo "Transferred UGX ", number_format((int) $parts[3]), " from ", $parts[1], " to ", $parts[2], "\n";
        } catch (Throwable) {
            echo "Transfer refused\n";
        }
    } elseif ($parts[0] === "balances") {
        foreach ($db->query("select name, balance from acct order by name") as $r) {
            echo $r["name"], " ", number_format($r["balance"]), "\n";
        }
    }
}
`,
  'php29-safe-search': php`<?php
$db = new PDO("sqlite::memory:");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("create table customers (name text, town text)");
$db->exec("insert into customers values ('Amina Nakato','Mukono'),('Brian Ssali','Kampala'),('Grace Namukasa','Mukono'),('Dan Okello','Jinja')");

while (($line = fgets(STDIN)) !== false) {
    $term = trim($line);
    if ($term === "") {
        continue;
    }
    $stmt = $db->prepare("select name from customers where name like ? or town like ? order by name");
    $like = "%" . $term . "%";
    $stmt->execute([$like, $like]);
    $names = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo $term, " -> ", $names === [] ? "No match" : implode(", ", $names), "\n";
}
`,
  'php30-services-api': php`<?php
function reply(int $status, array $body, array $headers = []): array {
    return ["status" => $status, "headers" => $headers, "body" => json_encode($body)];
}

function handle(string $method, string $path): array {
    $paths = ["/health", "/services"];
    if (!in_array($path, $paths, true)) {
        return reply(404, ["error" => "Not found"]);
    }
    if ($method !== "GET") {
        return reply(405, ["error" => "Method not allowed"], ["Allow" => "GET"]);
    }
    return $path === "/health"
        ? reply(200, ["status" => "ok"])
        : reply(200, ["services" => ["deposit", "withdraw", "send"]]);
}

while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    [$method, $path] = explode(" ", $line);
    $r = handle($method, $path);
    echo $r["status"], " ", $r["body"], "\n";
    foreach ($r["headers"] as $name => $value) {
        echo "  ", $name, ": ", $value, "\n";
    }
}
`,
  'php30-api-wallet': API_SOLUTION(),
  'php30-paginate': php`<?php
$ids = range(1, 10);
while (($line = fgets(STDIN)) !== false) {
    $line = trim($line);
    if ($line === "") {
        continue;
    }
    $parts = parse_url($line);
    if (($parts["path"] ?? "") !== "/customers") {
        echo "404 ", json_encode(["error" => "Not found"]), "\n";
        continue;
    }
    parse_str($parts["query"] ?? "", $q);
    $page = filter_var($q["page"] ?? "1", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);
    if ($page === false) {
        echo "422 ", json_encode(["error" => "Invalid page"]), "\n";
        continue;
    }
    $perPage = filter_var($q["per_page"] ?? "3", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 5]]);
    if ($perPage === false) {
        echo "422 ", json_encode(["error" => "Invalid per_page"]), "\n";
        continue;
    }
    $items = array_slice($ids, ($page - 1) * $perPage, $perPage);
    echo "200 ", json_encode(["page" => $page, "per_page" => $perPage, "total" => count($ids), "items" => $items]), "\n";
}
`,
};
