// Reference solutions for the Java course (Java track). Every Java exercise must have one here.
import { prog, progM } from '../src/content/java/shared.js';
import { ledgerProgram } from '../src/content/java/ledger-program.js';

const J = (body) => prog(body);
const S = (body) => prog(body, 'import java.util.Scanner;');
const MS = (methods, body) => progM(methods, body, 'import java.util.Scanner;');
const M = (methods, body) => progM(methods, body);

export const javaSolutions = {
  // Level 1, lesson 1: j-what
  'j1-hello': J('        System.out.println("Hello, Uganda!");'),
  'j1-sacco': J('        System.out.println("Village SACCO");\n        System.out.println("Save together, grow together");\n        System.out.println("Karibu!");'),

  // Level 1, lesson 2: j-first
  'j2-notice': J('        System.out.println("NOTICE");\n        System.out.println("Meeting on Saturday at 10am");\n        System.out.println("Bring your passbook");'),
  'j2-quotes': J(String.raw`        System.out.println("The treasurer said \"Karibu\" to everyone.");
        System.out.println("Path: C:\\SACCO\\members");`),
  'j2-oneline': J(String.raw`        System.out.print("Village");
        System.out.print(" ");
        System.out.println("SACCO");`),

  // Level 1, lesson 3: j-variables
  'j3-passbook': J(String.raw`        String name = "Amina Nakato";
        int age = 34;
        int savings = 150000;
        System.out.println("Member: " + name);
        System.out.println("Age: " + age);
        System.out.println("Savings: " + savings);`),
  'j3-swap': J(String.raw`        int a = 100;
        int b = 200;
        int temp = a;
        a = b;
        b = temp;
        System.out.println("a=" + a + " b=" + b);`),
  'j3-update': J(String.raw`        int balance = 100000;
        balance = balance + 25000;
        balance = balance - 10000;
        System.out.println("Balance: " + balance);`),

  // Level 1, lesson 4: j-operators
  'j4-interest': J(String.raw`        double savings = 200000;
        double interest = savings * 5 / 100;
        System.out.println("Interest: " + interest);
        System.out.println("New balance: " + (savings + interest));`),
  'j4-notes': J(String.raw`        int amount = 87500;
        int notes = amount / 10000;
        int rest = amount % 10000;
        System.out.println("Notes: " + notes);
        System.out.println("Rest: " + rest);`),
  'j4-average': J(String.raw`        int first = 71;
        int second = 84;
        double average = (first + second) / 2.0;
        System.out.println("Average: " + average);`),

  // Level 1, lesson 5: j-input
  'j5-deposit': S(String.raw`        Scanner in = new Scanner(System.in);
        String name = in.next();
        int deposit = in.nextInt();
        System.out.println("Received " + deposit + " from " + name);`),
  'j5-change': S(String.raw`        Scanner in = new Scanner(System.in);
        int price = in.nextInt();
        int paid = in.nextInt();
        System.out.println("Change: " + (paid - price));`),
  'j5-average': S(String.raw`        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        int c = in.nextInt();
        double average = (a + b + c) / 3.0;
        System.out.printf("Average: %.2f%n", average);`),
  'j5-fullname': S(String.raw`        Scanner in = new Scanner(System.in);
        String name = in.nextLine();
        int age = in.nextInt();
        System.out.println(name + " is " + age + " years old.");`),

  // Level 1, lesson 6: j-decisions
  'j6-passfail': S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 50) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }`),
  'j6-grade': S(String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        if (marks >= 80) {
            System.out.println("Grade: A");
        } else if (marks >= 70) {
            System.out.println("Grade: B");
        } else if (marks >= 60) {
            System.out.println("Grade: C");
        } else if (marks >= 50) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }`),
  'j6-loan': S(String.raw`        Scanner in = new Scanner(System.in);
        int savings = in.nextInt();
        int months = in.nextInt();
        if (savings >= 100000 && months >= 6) {
            System.out.println("Loan approved");
        } else {
            System.out.println("Loan refused");
        }`),
  'j6-day': S(String.raw`        Scanner in = new Scanner(System.in);
        int day = in.nextInt();
        switch (day) {
            case 1 -> System.out.println("Monday");
            case 2 -> System.out.println("Tuesday");
            case 3 -> System.out.println("Wednesday");
            case 4 -> System.out.println("Thursday");
            case 5 -> System.out.println("Friday");
            case 6 -> System.out.println("Saturday");
            case 7 -> System.out.println("Sunday");
            default -> System.out.println("Invalid day");
        }`),

  // Level 2, lesson 7: j-loops
  'j7-countdown': J(String.raw`        for (int i = 5; i >= 1; i--) {
            System.out.println(i);
        }
        System.out.println("Go!");`),
  'j7-sum-n': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println("Sum: " + sum);`),
  'j7-table': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }`),
  'j7-deposits': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int sum = 0;
        int largest = 0;
        for (int i = 0; i < n; i++) {
            int amount = in.nextInt();
            sum += amount;
            if (amount > largest) {
                largest = amount;
            }
        }
        System.out.println("Total: " + sum);
        System.out.println("Largest: " + largest);`),
  'j7-pin': S(String.raw`        Scanner in = new Scanner(System.in);
        int attempts = 0;
        int pin;
        do {
            pin = in.nextInt();
            attempts++;
        } while (pin != 1234);
        System.out.println("Attempts: " + attempts);`),

  // Level 2, lesson 8: j-nested
  'j8-rectangle': S(String.raw`        Scanner in = new Scanner(System.in);
        int rows = in.nextInt();
        int cols = in.nextInt();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                System.out.print("#");
            }
            System.out.println();
        }`),
  'j8-triangle': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int row = 1; row <= n; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print("*");
            }
            System.out.println();
        }`),
  'j8-table': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                System.out.printf("%3d", i * j);
            }
            System.out.println();
        }`),
  'j8-sacco-totals': S(String.raw`        Scanner in = new Scanner(System.in);
        int members = in.nextInt();
        int months = in.nextInt();
        int groupTotal = 0;
        for (int m = 1; m <= members; m++) {
            int total = 0;
            for (int k = 1; k <= months; k++) {
                total += in.nextInt();
            }
            System.out.println("Member " + m + ": " + total);
            groupTotal += total;
        }
        System.out.println("Group total: " + groupTotal);`),

  // Level 2, lesson 9: j-methods
  'j9-max3': MS(String.raw`    static int largest(int a, int b, int c) {
        int best = a;
        if (b > best) {
            best = b;
        }
        if (c > best) {
            best = c;
        }
        return best;
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        int c = in.nextInt();
        System.out.println("Largest: " + largest(a, b, c));`),
  'j9-leap': MS(String.raw`    static boolean isLeap(int year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int year = in.nextInt();
        if (isLeap(year)) {
            System.out.println("Leap year");
        } else {
            System.out.println("Not a leap year");
        }`),
  'j9-compound': MS(String.raw`    static double compound(double principal, double ratePercent, int years) {
        double balance = principal;
        for (int y = 1; y <= years; y++) {
            balance += balance * ratePercent / 100;
        }
        return balance;
    }`, String.raw`        Scanner in = new Scanner(System.in);
        double principal = in.nextDouble();
        double rate = in.nextDouble();
        int years = in.nextInt();
        System.out.printf("Amount: %.2f%n", compound(principal, rate, years));`),
  'j9-grade-method': MS(String.raw`    static char gradeOf(int marks) {
        if (marks >= 80) {
            return 'A';
        }
        if (marks >= 70) {
            return 'B';
        }
        if (marks >= 60) {
            return 'C';
        }
        if (marks >= 50) {
            return 'D';
        }
        return 'F';
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        System.out.println("Grade: " + gradeOf(marks));`),
  'j9-sum-varargs': M(String.raw`    static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }`, String.raw`        System.out.println(sum(1, 2, 3));
        System.out.println(sum());
        System.out.println(sum(5, 5, 5));`),

  // Level 2, lesson 10: j-recursion
  'j10-sum-rec': MS(String.raw`    static int sumTo(int n) {
        if (n == 0) {
            return 0;
        }
        return n + sumTo(n - 1);
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println("Sum: " + sumTo(n));`),
  'j10-power': MS(String.raw`    static int power(int base, int exp) {
        if (exp == 0) {
            return 1;
        }
        return base * power(base, exp - 1);
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int base = in.nextInt();
        int exp = in.nextInt();
        System.out.println(base + "^" + exp + " = " + power(base, exp));`),
  'j10-digits': MS(String.raw`    static int countDigits(int n) {
        if (n < 10) {
            return 1;
        }
        return 1 + countDigits(n / 10);
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println("Digits: " + countDigits(n));`),
  'j10-fib': MS(String.raw`    static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println("Fib: " + fib(n));`),
  'j10-gcd': MS(String.raw`    static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }`, String.raw`        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        System.out.println("GCD: " + gcd(a, b));`),

  // Level 2, lesson 11: j-arrays
  'j11-marks': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] marks = new int[n];
        for (int i = 0; i < n; i++) {
            marks[i] = in.nextInt();
        }
        int sum = 0;
        int highest = marks[0];
        for (int m : marks) {
            sum += m;
            if (m > highest) {
                highest = m;
            }
        }
        double average = sum / (double) n;
        System.out.printf("Average: %.2f%n", average);
        System.out.println("Highest: " + highest);`),
  'j11-reverse': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = in.nextInt();
        }
        for (int i = n - 1; i >= 0; i--) {
            System.out.print(a[i] + " ");
        }
        System.out.println();`),
  'j11-above-average': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] deposits = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            deposits[i] = in.nextInt();
            sum += deposits[i];
        }
        double avg = sum / (double) n;
        int count = 0;
        for (int d : deposits) {
            if (d > avg) {
                count++;
            }
        }
        System.out.println("Above average: " + count);`),
  'j11-squares': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] squares = new int[n];
        for (int i = 0; i < n; i++) {
            squares[i] = i * i;
        }
        for (int i = 0; i < n; i++) {
            System.out.print(squares[i] + " ");
        }
        System.out.println();`),
  'j11-bonus-method': M(String.raw`    static void addBonus(int[] deposits, int bonus) {
        for (int i = 0; i < deposits.length; i++) {
            deposits[i] += bonus;
        }
    }`, String.raw`        int[] d = {20000, 35000, 15000};
        addBonus(d, 1000);
        System.out.println(d[0] + " " + d[1] + " " + d[2]);`),

  // Level 2, lesson 12: j-array-algos
  'j12-search': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] ids = new int[n];
        for (int i = 0; i < n; i++) {
            ids[i] = in.nextInt();
        }
        int target = in.nextInt();
        int found = -1;
        for (int i = 0; i < n; i++) {
            if (ids[i] == target) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            System.out.println("Found at index " + found);
        } else {
            System.out.println("Not found");
        }`),
  'j12-min-max': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = in.nextInt();
        }
        int min = a[0];
        int max = a[0];
        for (int x : a) {
            if (x < min) {
                min = x;
            }
            if (x > max) {
                max = x;
            }
        }
        System.out.println("Min: " + min);
        System.out.println("Max: " + max);`),
  'j12-sort': prog(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = in.nextInt();
        }
        Arrays.sort(a);
        for (int i = 0; i < n; i++) {
            System.out.print(a[i] + " ");
        }
        System.out.println();`, 'import java.util.Scanner;\nimport java.util.Arrays;'),
  'j12-top3': prog(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = in.nextInt();
        }
        Arrays.sort(a);
        System.out.println("Top 3: " + a[n - 1] + " " + a[n - 2] + " " + a[n - 3]);`, 'import java.util.Scanner;\nimport java.util.Arrays;'),
  'j12-bands': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] counts = new int[5];
        for (int i = 0; i < n; i++) {
            int mark = in.nextInt();
            if (mark >= 80) {
                counts[0]++;
            } else if (mark >= 70) {
                counts[1]++;
            } else if (mark >= 60) {
                counts[2]++;
            } else if (mark >= 50) {
                counts[3]++;
            } else {
                counts[4]++;
            }
        }
        String[] letters = {"A", "B", "C", "D", "F"};
        for (int i = 0; i < 5; i++) {
            System.out.println(letters[i] + ": " + counts[i]);
        }`),

  // Level 2, lesson 13: j-2d
  'j13-grid-total': S(String.raw`        Scanner in = new Scanner(System.in);
        int rows = in.nextInt();
        int cols = in.nextInt();
        int[][] g = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                g[r][c] = in.nextInt();
            }
        }
        int total = 0;
        int largest = g[0][0];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                total += g[r][c];
                if (g[r][c] > largest) {
                    largest = g[r][c];
                }
            }
        }
        System.out.println("Total: " + total);
        System.out.println("Largest: " + largest);`),
  'j13-row-totals': S(String.raw`        Scanner in = new Scanner(System.in);
        int rows = in.nextInt();
        int cols = in.nextInt();
        int bestTotal = -1;
        int bestMember = 0;
        for (int r = 1; r <= rows; r++) {
            int total = 0;
            for (int c = 0; c < cols; c++) {
                total += in.nextInt();
            }
            System.out.println("Member " + r + ": " + total);
            if (total > bestTotal) {
                bestTotal = total;
                bestMember = r;
            }
        }
        System.out.println("Best: Member " + bestMember);`),
  'j13-col-totals': S(String.raw`        Scanner in = new Scanner(System.in);
        int rows = in.nextInt();
        int cols = in.nextInt();
        int[][] g = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                g[r][c] = in.nextInt();
            }
        }
        for (int c = 0; c < cols; c++) {
            int total = 0;
            for (int r = 0; r < rows; r++) {
                total += g[r][c];
            }
            System.out.print(total + " ");
        }
        System.out.println();`),
  'j13-transpose': S(String.raw`        Scanner in = new Scanner(System.in);
        int rows = in.nextInt();
        int cols = in.nextInt();
        int[][] g = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                g[r][c] = in.nextInt();
            }
        }
        for (int c = 0; c < cols; c++) {
            for (int r = 0; r < rows; r++) {
                System.out.print(g[r][c] + " ");
            }
            System.out.println();
        }`),
  'j13-diagonal': S(String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[][] g = new int[n][n];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                g[r][c] = in.nextInt();
            }
        }
        int main = 0;
        int other = 0;
        for (int i = 0; i < n; i++) {
            main += g[i][i];
            other += g[i][n - 1 - i];
        }
        System.out.println("Main: " + main);
        System.out.println("Other: " + other);`),

  // Level 2, lesson 14: j-strings
  'j14-initials': S(String.raw`        Scanner in = new Scanner(System.in);
        String first = in.next();
        String last = in.next();
        System.out.println(Character.toUpperCase(first.charAt(0)) + "." + Character.toUpperCase(last.charAt(0)) + ".");`),
  'j14-vowels': S(String.raw`        Scanner in = new Scanner(System.in);
        String line = in.nextLine();
        int count = 0;
        for (char c : line.toLowerCase().toCharArray()) {
            if ("aeiou".indexOf(c) >= 0) {
                count++;
            }
        }
        System.out.println("Vowels: " + count);`),
  'j14-palindrome': S(String.raw`        Scanner in = new Scanner(System.in);
        String word = in.next();
        String reversed = new StringBuilder(word).reverse().toString();
        if (word.equalsIgnoreCase(reversed)) {
            System.out.println("Palindrome");
        } else {
            System.out.println("Not a palindrome");
        }`),
  'j14-csv': S(String.raw`        Scanner in = new Scanner(System.in);
        String line = in.nextLine();
        String[] parts = line.split(",");
        int savings = Integer.parseInt(parts[1]);
        int months = Integer.parseInt(parts[2]);
        System.out.println(parts[0] + " has saved " + savings + " over " + months + " months (average " + (savings / months) + ")");`),
  'j14-phone': S(String.raw`        Scanner in = new Scanner(System.in);
        String line = in.nextLine();
        String clean = line.replace(" ", "").replace("-", "");
        if (clean.length() == 10 && clean.startsWith("07")) {
            System.out.println("Phone: " + clean + " (valid)");
        } else {
            System.out.println("Phone: " + clean + " (invalid)");
        }`),

  // Level 2, lesson 15: j-ledger
  'j15-interest': ledgerProgram({
    extraCases: String.raw`                case "INTEREST" -> {
                    int rate = in.nextInt();
                    for (int i = 0; i < count; i++) {
                        balances[i] += balances[i] * rate / 100;
                    }
                    System.out.println("Interest applied at " + rate + "%");
                }`,
  }),
  'j15-transfer': ledgerProgram({
    extraCases: String.raw`                case "TRANSFER" -> {
                    String from = in.next();
                    String to = in.next();
                    int amount = in.nextInt();
                    int a = findMember(names, count, from);
                    int b = findMember(names, count, to);
                    if (a < 0) {
                        System.out.println("No such member: " + from);
                    } else if (b < 0) {
                        System.out.println("No such member: " + to);
                    } else if (amount > balances[a]) {
                        System.out.println("Insufficient funds. Balance: " + balances[a]);
                    } else {
                        balances[a] -= amount;
                        balances[b] += amount;
                        System.out.println("Transferred " + amount + " from " + from + " to " + to);
                    }
                }`,
  }),
  'j15-leave': ledgerProgram({
    extraCases: String.raw`                case "LEAVE" -> {
                    String name = in.next();
                    int i = findMember(names, count, name);
                    if (i < 0) {
                        System.out.println("No such member: " + name);
                    } else {
                        System.out.println(names[i] + " has left the SACCO");
                        for (int k = i; k < count - 1; k++) {
                            names[k] = names[k + 1];
                            balances[k] = balances[k + 1];
                        }
                        count--;
                    }
                }`,
  }),
  'j15-stats': ledgerProgram({
    extraCases: String.raw`                case "STATS" -> {
                    if (count == 0) {
                        System.out.println("No members");
                    } else {
                        int hi = 0;
                        int lo = 0;
                        int total = 0;
                        for (int i = 0; i < count; i++) {
                            total += balances[i];
                            if (balances[i] > balances[hi]) {
                                hi = i;
                            }
                            if (balances[i] < balances[lo]) {
                                lo = i;
                            }
                        }
                        System.out.println("Highest: " + names[hi] + " " + balances[hi]);
                        System.out.println("Lowest: " + names[lo] + " " + balances[lo]);
                        System.out.println("Average: " + (total / count));
                    }
                }`,
  }),
};
