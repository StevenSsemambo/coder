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
};
