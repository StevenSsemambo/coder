// Reference solutions for the Java course (Java track). Every Java exercise must have one here.
import { prog, progM, progC } from '../src/content/java/shared.js';
import { ledgerProgram } from '../src/content/java/ledger-program.js';

const J = (body) => prog(body);
const S = (body) => prog(body, 'import java.util.Scanner;');
const MS = (methods, body) => progM(methods, body, 'import java.util.Scanner;');
const M = (methods, body) => progM(methods, body);
const C = (classes, body, imports = '', methods = '') => progC(classes, body, imports, methods);
const SCAN = 'import java.util.Scanner;';

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

  // Level 3, lesson 16: j-classes
  'j16-member-card': C(String.raw`class Member {
    String name;
    int balance;

    String summary() {
        return "Name: " + name + ", Balance: " + balance;
    }
}`, String.raw`        Member m = new Member();
        m.name = "Amina";
        m.balance = 50000;
        System.out.println(m.summary());`),
  'j16-loan': C(String.raw`class Loan {
    int remaining;

    void pay(int amount) {
        remaining -= amount;
    }

    boolean isCleared() {
        return remaining <= 0;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Loan loan = new Loan();
        loan.remaining = in.nextInt();
        loan.pay(in.nextInt());
        loan.pay(in.nextInt());
        System.out.println("Remaining: " + loan.remaining);
        System.out.println("Cleared: " + loan.isCleared());`, SCAN),
  'j16-items': C(String.raw`class Item {
    int price;
    int quantity;

    int total() {
        return price * quantity;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Item[] items = new Item[n];
        for (int i = 0; i < n; i++) {
            items[i] = new Item();
            items[i].price = in.nextInt();
            items[i].quantity = in.nextInt();
        }
        int sum = 0;
        for (Item item : items) {
            sum += item.total();
        }
        System.out.println("Total: " + sum);`, SCAN),
  'j16-rectangle': C(String.raw`class Rectangle {
    int width;
    int height;

    int area() {
        return width * height;
    }

    boolean isSquare() {
        return width == height;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Rectangle r = new Rectangle();
        r.width = in.nextInt();
        r.height = in.nextInt();
        System.out.println("Area: " + r.area());
        System.out.println("Square: " + r.isSquare());`, SCAN),

  // Level 3, lesson 17: j-constructors
  'j17-account': C(String.raw`class Account {
    String owner;
    int balance;

    Account(String owner, int balance) {
        this.owner = owner;
        this.balance = Math.max(0, balance);
    }

    String describe() {
        return owner + ": " + balance;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        String owner = in.next();
        int start = in.nextInt();
        Account account = new Account(owner, start);
        System.out.println(account.describe());`, SCAN),
  'j17-overload': C(String.raw`class Member {
    String name;
    int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }

    Member(String name) {
        this(name, 0);
    }

    String describe() {
        return name + " has " + balance;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Member a = new Member(in.next());
        Member b = new Member(in.next(), in.nextInt());
        System.out.println(a.describe());
        System.out.println(b.describe());`, SCAN),
  'j17-duration': C(String.raw`class Duration {
    int hours;
    int minutes;

    Duration(int total) {
        this.hours = total / 60;
        this.minutes = total % 60;
    }

    String describe() {
        return hours + "h " + minutes + "m";
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Duration d = new Duration(in.nextInt());
        System.out.println(d.describe());`, SCAN),
  'j17-monthly': C(String.raw`class Loan {
    int amount;
    int months;
    int monthly;

    Loan(int amount, int months) {
        this.amount = amount;
        this.months = months;
        this.monthly = amount / months;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Loan loan = new Loan(in.nextInt(), in.nextInt());
        System.out.println("Monthly: " + loan.monthly);`, SCAN),

  // Level 3, lesson 18: j-encapsulation
  'j18-wallet': C(String.raw`class Wallet {
    private int cash;

    int getCash() {
        return cash;
    }

    void deposit(int amount) {
        if (amount > 0) {
            cash += amount;
        }
    }

    boolean spend(int amount) {
        if (amount <= 0 || amount > cash) {
            return false;
        }
        cash -= amount;
        return true;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Wallet w = new Wallet();
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            String op = in.next();
            int amount = in.nextInt();
            if (op.equals("D")) {
                w.deposit(amount);
                System.out.println("OK");
            } else if (w.spend(amount)) {
                System.out.println("OK");
            } else {
                System.out.println("Refused");
            }
        }
        System.out.println("Cash: " + w.getCash());`, SCAN),
  'j18-thermometer': C(String.raw`class Thermometer {
    private double celsius = 0;

    void setCelsius(double c) {
        if (c >= -273.15) {
            celsius = c;
        }
    }

    double getFahrenheit() {
        return celsius * 9 / 5 + 32;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Thermometer t = new Thermometer();
        t.setCelsius(in.nextDouble());
        System.out.printf("%.1f%n", t.getFahrenheit());
        t.setCelsius(in.nextDouble());
        System.out.printf("%.1f%n", t.getFahrenheit());`, SCAN),
  'j18-safe': C(String.raw`class Safe {
    private final int code;
    private int failed = 0;

    Safe(int code) {
        this.code = code;
    }

    boolean isLocked() {
        return failed >= 3;
    }

    boolean open(int attempt) {
        if (isLocked()) {
            return false;
        }
        if (attempt == code) {
            failed = 0;
            return true;
        }
        failed++;
        return false;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Safe safe = new Safe(in.nextInt());
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            int attempt = in.nextInt();
            if (safe.isLocked()) {
                System.out.println("Locked");
            } else if (safe.open(attempt)) {
                System.out.println("Opened");
            } else {
                System.out.println("Wrong");
            }
        }`, SCAN),
  'j18-gradebook': C(String.raw`class Gradebook {
    private int[] marks = new int[10];
    private int count = 0;

    void add(int mark) {
        if (count < marks.length && mark >= 0 && mark <= 100) {
            marks[count] = mark;
            count++;
        }
    }

    double average() {
        if (count == 0) {
            return 0;
        }
        int sum = 0;
        for (int i = 0; i < count; i++) {
            sum += marks[i];
        }
        return sum / (double) count;
    }

    int highest() {
        int best = 0;
        for (int i = 0; i < count; i++) {
            if (marks[i] > best) {
                best = marks[i];
            }
        }
        return best;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Gradebook book = new Gradebook();
        while (in.hasNextInt()) {
            book.add(in.nextInt());
        }
        System.out.printf("Average: %.2f%n", book.average());
        System.out.println("Highest: " + book.highest());`, SCAN),

  // Level 3, lesson 19: j-static
  'j19-tickets': C(String.raw`class Ticket {
    private static int issued = 0;
    private final int number;

    Ticket() {
        issued++;
        number = issued;
    }

    String label() {
        return "Ticket #" + number;
    }

    static int getIssued() {
        return issued;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            Ticket t = new Ticket();
            System.out.println(t.label());
        }
        System.out.println("Issued: " + Ticket.getIssued());`, SCAN),
  'j19-converter': C(String.raw`class Currency {
    static final double RATE = 3700;

    static double toUgx(double usd) {
        return usd * RATE;
    }

    static double toUsd(double ugx) {
        return ugx / RATE;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        double usd = in.nextDouble();
        double ugx = in.nextDouble();
        System.out.printf("%.2f%n", Currency.toUgx(usd));
        System.out.printf("%.2f%n", Currency.toUsd(ugx));`, SCAN),
  'j19-mathutil': C(String.raw`class MathUtil {
    static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }

    static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int a = in.nextInt();
        int b = in.nextInt();
        if (MathUtil.isPrime(n)) {
            System.out.println(n + " is prime");
        } else {
            System.out.println(n + " is not prime");
        }
        System.out.println("GCD: " + MathUtil.gcd(a, b));`, SCAN),
  'j19-sacco-stats': C(String.raw`class Member {
    private static int count = 0;
    private static int total = 0;
    private final int balance;

    Member(int balance) {
        this.balance = balance;
        count++;
        total += balance;
    }

    static int average() {
        if (count == 0) {
            return 0;
        }
        return total / count;
    }

    static int getCount() {
        return count;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            new Member(in.nextInt());
        }
        System.out.println("Members: " + Member.getCount());
        System.out.println("Average: " + Member.average());`, SCAN),

  // Level 3, lesson 20: j-object
  'j20-book': C(String.raw`class Book {
    private final String title;
    private final String author;
    private final int pages;

    Book(String title, String author, int pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    @Override
    public String toString() {
        return title + " by " + author + " (" + pages + " pages)";
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Book book = new Book(in.next(), in.next(), in.nextInt());
        System.out.println(book);`, SCAN),
  'j20-point': C(String.raw`class Point {
    private final int x;
    private final int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point p)) {
            return false;
        }
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Point a = new Point(in.nextInt(), in.nextInt());
        Point b = new Point(in.nextInt(), in.nextInt());
        System.out.println(a.equals(b) ? "Same" : "Different");
        HashSet<Point> set = new HashSet<>();
        set.add(a);
        set.add(b);
        System.out.println("Set size: " + set.size());`, 'import java.util.Scanner;\nimport java.util.HashSet;\nimport java.util.Objects;'),
  'j20-members': C(String.raw`class Member {
    private final int number;
    private final String name;

    Member(int number, String name) {
        this.number = number;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Member other && number == other.number;
    }

    @Override
    public int hashCode() {
        return Objects.hash(number);
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        HashSet<Member> members = new HashSet<>();
        for (int i = 0; i < n; i++) {
            members.add(new Member(in.nextInt(), in.next()));
        }
        System.out.println("Distinct members: " + members.size());`, 'import java.util.Scanner;\nimport java.util.HashSet;\nimport java.util.Objects;'),
  'j20-money': C(String.raw`class Money {
    private final int amount;
    private final String currency;

    Money(int amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    @Override
    public String toString() {
        return currency + " " + String.format("%,d", amount);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Money other && amount == other.amount && currency.equals(other.currency);
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Money a = new Money(in.nextInt(), in.next());
        Money b = new Money(in.nextInt(), in.next());
        System.out.println(a);
        System.out.println(b);
        System.out.println("Equal: " + a.equals(b));`, SCAN),

  // Level 3, lesson 21: j-inherit
  'j21-savings': C(String.raw`class Account {
    private final String owner;
    protected int balance;

    Account(String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
    }

    String getOwner() {
        return owner;
    }

    int getBalance() {
        return balance;
    }

    void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}

class Savings extends Account {
    private final int rate;

    Savings(String owner, int balance, int rate) {
        super(owner, balance);
        this.rate = rate;
    }

    void addInterest() {
        balance += balance * rate / 100;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Savings s = new Savings(in.next(), in.nextInt(), in.nextInt());
        s.deposit(1000);
        s.addInterest();
        System.out.println(s.getOwner() + ": " + s.getBalance());`, SCAN),
  'j21-current': C(String.raw`class Account {
    protected int balance;

    Account(int balance) {
        this.balance = balance;
    }

    boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
}

class Current extends Account {
    Current(int balance) {
        super(balance);
    }

    @Override
    boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance + 500) {
            return false;
        }
        balance -= amount;
        return true;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Current account = new Current(in.nextInt());
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            if (account.withdraw(in.nextInt())) {
                System.out.println("OK " + account.balance);
            } else {
                System.out.println("Refused");
            }
        }`, SCAN),
  'j21-staff': C(String.raw`class Employee {
    protected final String name;
    protected final int salary;

    Employee(String name, int salary) {
        this.name = name;
        this.salary = salary;
    }

    int pay() {
        return salary;
    }

    String describe() {
        return name + " earns " + pay();
    }
}

class Manager extends Employee {
    private final int bonus;

    Manager(String name, int salary, int bonus) {
        super(name, salary);
        this.bonus = bonus;
    }

    @Override
    int pay() {
        return super.pay() + bonus;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            String name = in.next();
            int salary = in.nextInt();
            Employee e;
            if (kind.equals("M")) {
                e = new Manager(name, salary, in.nextInt());
            } else {
                e = new Employee(name, salary);
            }
            System.out.println(e.describe());
        }`, SCAN),
  'j21-leader': C(String.raw`class Member {
    private final String name;
    private final int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }

    @Override
    public String toString() {
        return name + " (" + balance + ")";
    }
}

class Leader extends Member {
    private final String role;

    Leader(String name, int balance, String role) {
        super(name, balance);
        this.role = role;
    }

    @Override
    public String toString() {
        return super.toString() + " [" + role + "]";
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        String name = in.next();
        int balance = in.nextInt();
        String role = in.next();
        System.out.println(new Leader(name, balance, role));
        System.out.println(new Member(name, balance));`, SCAN),

  // Level 3, lesson 22: j-poly
  'j22-payments': C(String.raw`class Payment {
    protected final int amount;

    Payment(int amount) {
        this.amount = amount;
    }

    int fee() {
        return 0;
    }

    int total() {
        return amount + fee();
    }
}

class MobileMoney extends Payment {
    MobileMoney(int amount) {
        super(amount);
    }

    @Override
    int fee() {
        int percent = amount / 100;
        return Math.max(100, percent);
    }
}

class Bank extends Payment {
    Bank(int amount) {
        super(amount);
    }

    @Override
    int fee() {
        return 500;
    }
}

class Cash extends Payment {
    Cash(int amount) {
        super(amount);
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Payment[] list = new Payment[n];
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            int amount = in.nextInt();
            if (kind.equals("M")) {
                list[i] = new MobileMoney(amount);
            } else if (kind.equals("B")) {
                list[i] = new Bank(amount);
            } else {
                list[i] = new Cash(amount);
            }
        }
        int fees = 0;
        for (Payment p : list) {
            System.out.println("Fee: " + p.fee() + " Total: " + p.total());
            fees += p.fee();
        }
        System.out.println("Total fees: " + fees);`, SCAN),
  'j22-count-managers': C(String.raw`class Staff {
}

class Teller extends Staff {
}

class Cashier extends Staff {
}

class Manager extends Staff {
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Staff[] team = new Staff[n];
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            if (kind.equals("M")) {
                team[i] = new Manager();
            } else if (kind.equals("C")) {
                team[i] = new Cashier();
            } else {
                team[i] = new Teller();
            }
        }
        int managers = 0;
        for (Staff s : team) {
            if (s instanceof Manager) {
                managers++;
            }
        }
        System.out.println("Managers: " + managers + " of " + n);`, SCAN),
  'j22-interest-all': C(String.raw`class Account {
    protected int balance;

    Account(int balance) {
        this.balance = balance;
    }
}

class Savings extends Account {
    private final int rate;

    Savings(int balance, int rate) {
        super(balance);
        this.rate = rate;
    }

    void addInterest() {
        balance += balance * rate / 100;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Account[] accounts = new Account[n];
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            int balance = in.nextInt();
            if (kind.equals("S")) {
                accounts[i] = new Savings(balance, in.nextInt());
            } else {
                accounts[i] = new Account(balance);
            }
        }
        for (Account a : accounts) {
            if (a instanceof Savings s) {
                s.addInterest();
            }
        }
        for (Account a : accounts) {
            System.out.println(a.balance);
        }`, SCAN),
  'j22-names': C(String.raw`class Pet {
    String sound() {
        return "...";
    }
}

class Dog extends Pet {
    @Override
    String sound() {
        return "Woof";
    }
}

class Cat extends Pet {
    @Override
    String sound() {
        return "Meow";
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            Pet p;
            if (kind.equals("D")) {
                p = new Dog();
            } else if (kind.equals("C")) {
                p = new Cat();
            } else {
                p = new Pet();
            }
            System.out.println(p.getClass().getSimpleName() + " says " + p.sound());
        }`, SCAN),

  // Level 3, lesson 23: j-abstract
  'j23-shapes': C(String.raw`abstract class Shape {
    abstract double area();

    abstract String name();

    String describe() {
        return String.format("%s area %.2f", name(), area());
    }
}

class Rectangle extends Shape {
    private final double width;
    private final double height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double area() {
        return width * height;
    }

    @Override
    String name() {
        return "Rectangle";
    }
}

class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }

    @Override
    String name() {
        return "Circle";
    }
}

class Triangle extends Shape {
    private final double base;
    private final double height;

    Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    double area() {
        return 0.5 * base * height;
    }

    @Override
    String name() {
        return "Triangle";
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            Shape s;
            if (kind.equals("R")) {
                s = new Rectangle(in.nextDouble(), in.nextDouble());
            } else if (kind.equals("C")) {
                s = new Circle(in.nextDouble());
            } else {
                s = new Triangle(in.nextDouble(), in.nextDouble());
            }
            System.out.println(s.describe());
        }`, SCAN),
  'j23-report': C(String.raw`abstract class Report {
    abstract String title();

    abstract String body();

    String render() {
        return "=== " + title() + " ===\n" + body() + "\n=== end ===";
    }
}

class DepositReport extends Report {
    private final int total;

    DepositReport(int total) {
        this.total = total;
    }

    @Override
    String title() {
        return "Deposits";
    }

    @Override
    String body() {
        return "Total deposited: " + total;
    }
}

class MemberReport extends Report {
    private final int count;

    MemberReport(int count) {
        this.count = count;
    }

    @Override
    String title() {
        return "Members";
    }

    @Override
    String body() {
        return "Members: " + count;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        Report a = new DepositReport(in.nextInt());
        Report b = new MemberReport(in.nextInt());
        System.out.println(a.render());
        System.out.println(b.render());`, SCAN),
  'j23-staff-pay': C(String.raw`abstract class Staff {
    protected final String name;

    Staff(String name) {
        this.name = name;
    }

    abstract int monthlyPay();

    String line() {
        return name + ": " + monthlyPay();
    }
}

class Teller extends Staff {
    Teller(String name) {
        super(name);
    }

    @Override
    int monthlyPay() {
        return 500000;
    }
}

class Manager extends Staff {
    private final int teams;

    Manager(String name, int teams) {
        super(name);
        this.teams = teams;
    }

    @Override
    int monthlyPay() {
        return 900000 + teams * 100000;
    }
}

class Volunteer extends Staff {
    Volunteer(String name) {
        super(name);
    }

    @Override
    int monthlyPay() {
        return 0;
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int bill = 0;
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            String name = in.next();
            Staff s;
            if (kind.equals("M")) {
                s = new Manager(name, in.nextInt());
            } else if (kind.equals("V")) {
                s = new Volunteer(name);
            } else {
                s = new Teller(name);
            }
            System.out.println(s.line());
            bill += s.monthlyPay();
        }
        System.out.println("Bill: " + bill);`, SCAN),
  'j23-discount': C(String.raw`abstract class Discount {
    abstract int apply(int price);
}

class Percent extends Discount {
    private final int percent;

    Percent(int percent) {
        this.percent = percent;
    }

    @Override
    int apply(int price) {
        return price * (100 - percent) / 100;
    }
}

class Flat extends Discount {
    private final int amount;

    Flat(int amount) {
        this.amount = amount;
    }

    @Override
    int apply(int price) {
        return Math.max(0, price - amount);
    }
}`, String.raw`        Scanner in = new Scanner(System.in);
        int price = in.nextInt();
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            String kind = in.next();
            Discount d;
            if (kind.equals("P")) {
                d = new Percent(in.nextInt());
            } else {
                d = new Flat(in.nextInt());
            }
            price = d.apply(price);
        }
        System.out.println("Final: " + price);`, SCAN),
};
