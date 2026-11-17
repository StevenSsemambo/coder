// Reference solutions for the PHP course (see docs/PHP-TRACK.md). Every PHP exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
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
};
