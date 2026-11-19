// Java, Level 3, lesson 19: static members and constants.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

export const staticsLesson = {
  id: 'j-static',
  level: LEVEL,
  minutes: 30,
  title: 'static: what belongs to the class',
  summary: 'Static fields shared by all objects, static methods, constants with static final, and utility classes',
  blocks: [
    {
      t: 'story',
      title: 'The notice board and the passbooks',
      text: 'Each member’s balance is written in **her own passbook**, because it belongs to her alone. But some facts belong to the **whole SACCO**, not to any one passbook: how many members there are, the price of one share, the interest rate printed on the notice board. There is **one notice board**, and everybody reads the same one.\n\nIn Java, a field normally gets a **fresh copy in every object**, like the balance in each passbook. A field marked **`static`** is different: there is **one copy for the whole class**, shared by every object, like the notice board.',
    },
    { t: 'h', text: 'A static field: one copy for everybody' },
    { t: 'p', text: 'This class counts how many members have been created. Every time a constructor runs, it adds 1 to **the same** `count`. You reach a static field through the **class name**: `Member.count`, because it does not belong to any one object.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    static int count = 0;
    String name;

    Member(String name) {
        this.name = name;
        count++;
    }
}`,
        String.raw`        new Member("Amina");
        new Member("Joel");
        Member m = new Member("Mary");
        System.out.println(Member.count);
        System.out.println(m.name);`,
      ),
      output: '3\nMary',
    },
    { t: 'analogy', text: 'Every member has her own passbook (an instance field, one per object). The SACCO has one notice board with the number of members written on it (a static field, one per class). When a new member joins, her passbook is created, **and** the number on the notice board goes up by one.' },
    {
      t: 'predict',
      code: progC(
        String.raw`class Counter {
    static int shared = 0;
    int own = 0;

    Counter() {
        shared++;
        own++;
    }
}`,
        String.raw`        Counter a = new Counter();
        Counter b = new Counter();
        Counter c = new Counter();
        System.out.println(c.own + " " + Counter.shared);`,
      ),
      question: 'What does this program print?',
      options: ['1 3', '3 3', '1 1', '3 1'],
      answer: 0,
      explain: 'Every object has its own `own`, which starts at 0 and goes up to 1 in its own constructor. So c.own is 1. But `shared` is one single variable. The constructor ran three times, so it is 3.',
    },
    { t: 'h', text: 'A static method: a job that needs no object' },
    { t: 'p', text: 'A **static method** belongs to the class, and is called through the class name. It has **no `this`**, because it runs without any particular object. You have used static methods all along: `Math.max(3, 9)`, `Integer.parseInt("42")`, `String.valueOf(5)`, and the `main` method itself. Use `static` for a job that needs only its arguments, such as a calculation.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    private static int count = 0;
    private String name;

    Member(String name) {
        this.name = name;
        count++;
    }

    static int getCount() {
        return count;
    }
}`,
        String.raw`        new Member("Amina");
        new Member("Joel");
        System.out.println("Members: " + Member.getCount());`,
      ),
      output: 'Members: 2',
    },
    { t: 'p', text: 'Notice that the field `count` is now `private`, and the static method `getCount()` gives access to it. Encapsulation works for static fields exactly as for the others.' },
    { t: 'h', text: 'Static methods cannot use instance data' },
    { t: 'p', text: 'A static method runs with **no object**, so it has no `name` and no `balance` to look at: those belong to individual objects. A static method may use static fields, its own parameters and its own variables. Using an instance field or calling an instance method directly from a static method is a compile error. This is why `main`, which is static, must first create an object (`new Member(...)`) before it can call that object’s methods.' },
    { t: 'h', text: 'Constants: static final' },
    { t: 'p', text: 'A **constant** is a value that is shared and never changes: `static final`. By convention its name is written in **CAPITAL_LETTERS**, with underscores between words. Anyone can read it as `ClassName.NAME`. Constants stop the reader from asking “what does the number 5 mean?”, and they let you change a value in one place.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Sacco {
    static final String NAME = "Village SACCO";
    static final int SHARE_PRICE = 20000;
    static final double INTEREST_RATE = 5.0;

    static int cost(int shares) {
        return shares * SHARE_PRICE;
    }
}`,
        String.raw`        System.out.println(Sacco.NAME);
        System.out.println("Price of 4 shares: " + Sacco.cost(4));
        System.out.println("Rate: " + Sacco.INTEREST_RATE + "%");`,
      ),
      output: 'Village SACCO\nPrice of 4 shares: 80000\nRate: 5.0%',
    },
    { t: 'h', text: 'A very useful pattern: automatic numbers' },
    { t: 'p', text: 'A static counter plus a final field gives every object a **unique number**. The static `nextNumber` lives on the notice board; each new member **takes the next number** for her own `number`, which is `final`, so it never changes.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    private static int nextNumber = 1001;
    private final int number;
    private final String name;

    Member(String name) {
        this.name = name;
        this.number = nextNumber++;
    }

    String describe() {
        return "#" + number + " " + name;
    }
}`,
        String.raw`        Member a = new Member("Amina");
        Member b = new Member("Joel");
        Member c = new Member("Mary");
        System.out.println(a.describe());
        System.out.println(b.describe());
        System.out.println(c.describe());`,
      ),
      output: '#1001 Amina\n#1002 Joel\n#1003 Mary',
    },
    { t: 'h', text: 'Utility classes' },
    { t: 'p', text: 'A class whose methods are all static, with no objects at all, is a **utility class**: a toolbox of helpers. `Math` is one. You can write your own for jobs that belong to no particular object.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Money {
    static String format(int amount) {
        return "UGX " + String.format("%,d", amount);
    }

    static int percent(int amount, int rate) {
        return amount * rate / 100;
    }
}`,
        String.raw`        System.out.println(Money.format(1250000));
        System.out.println(Money.format(Money.percent(200000, 5)));`,
      ),
      output: 'UGX 1,250,000\nUGX 10,000',
    },
    {
      t: 'fill',
      prompt: 'Choose the keyword so that all counters share **one** total. The program should print **2**.',
      template: progC(
        String.raw`class Counter {
    ___ int total = 0;

    Counter() {
        total++;
    }
}`,
        String.raw`        new Counter();
        new Counter();
        System.out.println(Counter.total);`,
      ),
      blanks: [{ options: ['static', 'final', 'private'], answer: 'static' }],
      output: '2',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: a class with a static counter, then `main` creating two objects and printing the counter. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Ticket {',
        '    static int issued = 0;',
        '    Ticket() {',
        '        issued++;',
        '    }',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        new Ticket();',
        '        new Ticket();',
        '        System.out.println(Ticket.issued);',
        '    }',
        '}',
      ],
      output: '2',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`class Member {
    private String name = "Amina";

    String getName() {
        return name;
    }
}`,
        String.raw`        System.out.println(Member.getName());`,
      ),
      question: 'The compiler says “non-static method getName() cannot be referenced from a static context”. What is the mistake?',
      options: ['getName belongs to an object, so you must create one and call it on that object', 'getName must be public', 'The class name must be written in capitals', 'Member needs a constructor'],
      answer: 0,
      explain: 'The method is not static, so it works on a particular member’s name. Writing `Member.getName()` names no member at all. Create an object first: `new Member().getName()`.',
      fixed: progC(
        String.raw`class Member {
    private String name = "Amina";

    String getName() {
        return name;
    }
}`,
        String.raw`        Member m = new Member();
        System.out.println(m.getName());`,
      ),
    },
    {
      t: 'quiz',
      question: 'How many copies of a `static` field exist?',
      options: ['One for the whole class, shared by all objects', 'One for every object', 'None until you call a method', 'Two'],
      answer: 0,
      explain: 'A static field belongs to the class itself. All objects see and change the same single variable.',
    },
    {
      t: 'quiz',
      question: 'Why can `main` not call a normal (non-static) method of its own class directly?',
      options: ['main is static and runs with no object, but a normal method needs an object to work on', 'main is private', 'Normal methods are slower', 'Java does not allow methods in classes with main'],
      answer: 0,
      explain: 'A normal method works on one object’s data. Inside a static method there is no object, so you must create one and call the method on it.',
    },
    {
      t: 'quiz',
      question: 'How is a constant usually declared and named?',
      options: ['static final, in CAPITAL_LETTERS', 'private void, in camelCase', 'final only, in lowercase', 'public, in capitals with spaces'],
      answer: 0,
      explain: 'A constant is shared and never changes: `static final`. The naming convention is capital letters with underscores, like SHARE_PRICE.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Member {
    private String name = "Amina";

    static String show() {
        return name;
    }
}`,
            String.raw`        System.out.println(Member.show());`,
          ),
          why: 'The static method runs without any object, so there is no `name` to return: name belongs to individual members. Make `show` a normal method and call it on an object, or pass the name in as a parameter.',
          right: progC(
            String.raw`class Member {
    private String name = "Amina";

    String show() {
        return name;
    }
}`,
            String.raw`        System.out.println(new Member().show());`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Sacco {
    static final int SHARE_PRICE = 20000;
}`,
            String.raw`        Sacco.SHARE_PRICE = 25000;
        System.out.println(Sacco.SHARE_PRICE);`,
          ),
          why: 'A `final` variable can never be changed, and that is the whole point of a constant. If the price can change during the program, it should not be final.',
          right: progC(
            String.raw`class Sacco {
    static int sharePrice = 20000;
}`,
            String.raw`        Sacco.sharePrice = 25000;
        System.out.println(Sacco.sharePrice);`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    int count = 0;

    Member() {
        count++;
    }
}`,
            String.raw`        Member a = new Member();
        Member b = new Member();
        System.out.println(b.count);`,
          ),
          why: 'The programmer wanted to count the members, but `count` is not static, so each member has her own count, which starts at 0 and becomes 1. This prints 1 instead of 2. A number that belongs to the whole class must be `static`.',
          right: progC(
            String.raw`class Member {
    static int count = 0;

    Member() {
        count++;
    }
}`,
            String.raw`        Member a = new Member();
        Member b = new Member();
        System.out.println(Member.count);`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    static String name;

    Member(String name) {
        Member.name = name;
    }
}`,
            String.raw`        Member a = new Member("Amina");
        Member b = new Member("Joel");
        System.out.println(a.name + " " + b.name);`,
          ),
          why: 'Making `name` static gave all members **one shared name**, so the second constructor overwrote the first, and this prints Joel Joel. Data that is different for each object (name, balance) must stay an instance field.',
          right: progC(
            String.raw`class Member {
    String name;

    Member(String name) {
        this.name = name;
    }
}`,
            String.raw`        Member a = new Member("Amina");
        Member b = new Member("Joel");
        System.out.println(a.name + " " + b.name);`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A `static` field has one copy for the whole class, shared by all objects. Reach it with `ClassName.field`.',
        'A static method needs no object and has no `this`. It cannot use instance fields or instance methods directly.',
        '`static final` with CAPITAL_NAMES makes a constant. `Math`, `Integer.parseInt` and `main` are all static.',
        'A static counter plus a final field gives every object a unique number.',
        'Per-object data (name, balance) stays instance. Shared data (count, rates, prices) is static.',
      ],
      memory: 'One notice board for the SACCO, one passbook for each member.',
    },
  ],
  exercises: [
    {
      id: 'j19-tickets',
      title: 'Numbered tickets',
      prompt: 'Complete the class `Ticket` so that every new ticket gets the next number, starting from 1, and the class remembers how many tickets were issued. `main` reads how many tickets to make and prints `Ticket #1` and so on, and finally `Issued: 3`.',
      starter: progC(
        String.raw`class Ticket {
    // Add a static counter and a final number for each ticket

    Ticket() {
        // Give this ticket its number
    }

    String label() {
        return "Ticket #" + 0;
    }

    static int getIssued() {
        return 0;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            Ticket t = new Ticket();
            System.out.println(t.label());
        }
        System.out.println("Issued: " + Ticket.getIssued());`,
        SCAN,
      ),
      sampleInput: '3',
      usesInput: true,
      tests: [
        { input: '3', expected: 'Ticket #1\nTicket #2\nTicket #3\nIssued: 3' },
        { input: '1', expected: 'Ticket #1\nIssued: 1' },
        { input: '0', expected: 'Issued: 0', hidden: true },
      ],
      hints: [
        'Use a `private static int issued = 0;` for the shared count, and a `private final int number;` for each ticket.',
        'In the constructor: `issued++;` and then `number = issued;`.',
        '`label()` returns `"Ticket #" + number`, and `getIssued()` returns `issued`.',
      ],
    },
    {
      id: 'j19-converter',
      title: 'Currency converter',
      prompt: 'Complete the utility class `Currency`. It has a constant `RATE` of `3700` shillings per dollar, a static method `toUgx(double usd)` and a static method `toUsd(double ugx)`. `main` reads dollars and then shillings and prints both conversions with two decimals: `37000.00` and `2.00` for the input `10 7400`.',
      starter: progC(
        String.raw`class Currency {
    // Add the constant RATE and the two static methods
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        double usd = in.nextDouble();
        double ugx = in.nextDouble();
        System.out.printf("%.2f%n", Currency.toUgx(usd));
        System.out.printf("%.2f%n", Currency.toUsd(ugx));`,
        SCAN,
      ),
      sampleInput: '10 7400',
      usesInput: true,
      tests: [
        { input: '10 7400', expected: '37000.00\n2.00' },
        { input: '1 3700', expected: '3700.00\n1.00' },
        { input: '0.5 100', expected: '1850.00\n0.03', hidden: true },
      ],
      hints: [
        'A constant is `static final`: `static final double RATE = 3700;`',
        'The methods are `static` too, and take one `double` and return a `double`.',
        '`static double toUgx(double usd) { return usd * RATE; }` and `static double toUsd(double ugx) { return ugx / RATE; }`',
      ],
    },
    {
      id: 'j19-mathutil',
      title: 'A toolbox of number tricks',
      prompt: 'Complete the utility class `MathUtil` with two static methods: `isPrime(int n)` (a prime is at least 2 and has no divisor other than 1 and itself) and `gcd(int a, int b)` (the greatest common divisor). `main` reads `n a b` and prints `17 is prime` or `18 is not prime`, then `GCD: 6`.',
      starter: progC(
        String.raw`class MathUtil {
    // Write the static methods isPrime and gcd
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int a = in.nextInt();
        int b = in.nextInt();
        if (MathUtil.isPrime(n)) {
            System.out.println(n + " is prime");
        } else {
            System.out.println(n + " is not prime");
        }
        System.out.println("GCD: " + MathUtil.gcd(a, b));`,
        SCAN,
      ),
      sampleInput: '17 48 18',
      usesInput: true,
      tests: [
        { input: '17 48 18', expected: '17 is prime\nGCD: 6' },
        { input: '18 100 75', expected: '18 is not prime\nGCD: 25' },
        { input: '2 7 0', expected: '2 is prime\nGCD: 7', hidden: true },
        { input: '1 5 5', expected: '1 is not prime\nGCD: 5', hidden: true },
        { input: '97 17 5', expected: '97 is prime\nGCD: 1', hidden: true },
      ],
      hints: [
        '`isPrime`: numbers below 2 are not prime. Try every divisor `i` from 2 while `i * i <= n`. If one divides n, it is not prime.',
        '`gcd` by Euclid’s method (lesson 10): when `b` is 0 the answer is `a`, otherwise it is `gcd(b, a % b)`. A loop or a recursive static method both work.',
        'Both methods are `static`, so main calls them as `MathUtil.isPrime(n)` and `MathUtil.gcd(a, b)`.',
      ],
    },
    {
      id: 'j19-sacco-stats',
      title: 'Statistics of the SACCO',
      prompt: 'Complete the class `Member`. It keeps **static** totals: how many members were created and the sum of all their balances. The static method `average()` returns the total divided by the count (0 when there are no members). `main` reads how many members, then a balance for each, and prints `Members: 3` and `Average: 30000`.',
      starter: progC(
        String.raw`class Member {
    private final int balance;

    Member(int balance) {
        this.balance = balance;
        // Update the shared count and total
    }

    static int average() {
        // Total divided by count, or 0 if there are no members
        return 0;
    }

    static int getCount() {
        return 0;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            new Member(in.nextInt());
        }
        System.out.println("Members: " + Member.getCount());
        System.out.println("Average: " + Member.average());`,
        SCAN,
      ),
      sampleInput: '3\n10000 30000 50000',
      usesInput: true,
      tests: [
        { input: '3\n10000 30000 50000', expected: 'Members: 3\nAverage: 30000' },
        { input: '2\n5 6', expected: 'Members: 2\nAverage: 5' },
        { input: '0', expected: 'Members: 0\nAverage: 0', hidden: true },
      ],
      hints: [
        'You need two `private static int` fields: `count` and `total`.',
        'In the constructor: `count++;` and `total += balance;`.',
        '`static int average() { if (count == 0) { return 0; } return total / count; }` and `getCount()` returns `count`.',
      ],
    },
  ],
};

