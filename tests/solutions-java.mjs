// Reference solutions for the Java course (Java track). Every Java exercise must have one here.
import { prog, progM } from '../src/content/java/shared.js';

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
};
