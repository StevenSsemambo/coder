// Reference solutions for the Java course (Java track). Every Java exercise must have one here.
import { prog } from '../src/content/java/shared.js';

const J = (body) => prog(body);
const S = (body) => prog(body, 'import java.util.Scanner;');

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
};
