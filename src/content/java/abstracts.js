// Java, Level 3, lesson 23: Abstract classes.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

const PAYMENT = String.raw`abstract class Payment {
    protected final int amount;

    Payment(int amount) {
        this.amount = amount;
    }

    abstract int fee();

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
        return Math.max(100, amount / 100);
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
}`;

export const abstractsLesson = {
  id: 'j-abstract',
  level: LEVEL,
  minutes: 30,
  title: 'Abstract classes',
  summary: 'Incomplete blueprints: abstract classes and methods, enforcing a contract, and the template method',
  blocks: [
    {
      t: 'story',
      title: 'The form that is never used blank',
      text: 'In the previous lesson, the base class `Payment` charged a fee of 0. But think about it: in the real SACCO there is no such thing as a plain “payment”. Every payment is **mobile money**, or **bank**, or **cash**. A blank “Payment” form is not a real thing. It is only the **shared outline** that the real forms are built from.\n\nThe base class had a second, quieter problem. If a programmer adds a new kind of payment and **forgets** to write its fee, the program still compiles, and the new payments are charged **nothing**, silently. We want Java to say: “You may not create a Payment, and every kind of Payment **must** say what its fee is.” That is exactly what an **abstract class** does.',
    },
    { t: 'h', text: 'abstract class: too incomplete to create' },
    { t: 'p', text: 'Write the word `abstract` before `class`. An abstract class is a blueprint that is **deliberately unfinished**. Java refuses to create an object from it with `new`. It exists only to be extended. Its subclasses are the real things.' },
    { t: 'h', text: 'abstract methods: a promise with no body' },
    { t: 'p', text: 'Inside an abstract class you may declare an **abstract method**: a method with the word `abstract`, a header, **no body** and a semicolon instead of the curly brackets. It says “every real subclass **must** supply this”. If a subclass forgets, the compiler stops. The abstract class can also contain ordinary fields, constructors and fully written methods.' },
    {
      t: 'try',
      code: progC(
        PAYMENT,
        String.raw`        Payment[] list = {new MobileMoney(20000), new Bank(1000)};
        for (Payment p : list) {
            System.out.println(p.fee() + " " + p.total());
        }`,
      ),
      output: '200 20200\n500 1500',
    },
    { t: 'p', text: 'Look at `total()`. It is a complete method, written **once** in the abstract class, and it calls `fee()`, which does not exist yet in `Payment` but will exist in every real subclass. The shared code and the part that differs work together. When Java runs `total()` on a `Bank` object, it uses the Bank’s own `fee()` (polymorphism, from lesson 22).' },
    { t: 'analogy', text: 'An architect’s plan for a SACCO branch says: “every branch has a front door, a counter, and **a safe**. How the safe is built depends on the branch.” The plan itself cannot be walked into: you cannot open an account at a drawing. Each real branch must fill in the missing part, the safe. The abstract class is the plan, the subclasses are the buildings, and the abstract method is the “safe: to be decided”.' },
    { t: 'h', text: 'The template method pattern' },
    { t: 'p', text: 'A very useful design: an abstract class writes the **fixed steps** of a job in one ordinary method, and leaves the **changing steps** abstract. Every report in the SACCO has the same header and footer, and a different body. The shared part is written once.' },
    {
      t: 'try',
      code: progC(
        String.raw`abstract class Report {
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
}`,
        String.raw`        Report[] reports = {new DepositReport(850000), new MemberReport(42)};
        for (Report r : reports) {
            System.out.println(r.render());
        }`,
      ),
      output: '=== Deposits ===\nTotal deposited: 850000\n=== end ===\n=== Members ===\nMembers: 42\n=== end ===',
    },
    {
      t: 'predict',
      code: progC(
        String.raw`abstract class Greeter {
    abstract String name();

    String greet() {
        return "Hello, " + name() + "!";
    }
}

class Amina extends Greeter {
    @Override
    String name() {
        return "Amina";
    }
}

class Joel extends Greeter {
    @Override
    String name() {
        return "Joel";
    }

    @Override
    String greet() {
        return super.greet() + " Karibu.";
    }
}`,
        String.raw`        Greeter a = new Amina();
        Greeter b = new Joel();
        System.out.println(a.greet());
        System.out.println(b.greet());`,
      ),
      question: 'What does this program print?',
      options: ['Hello, Amina!\nHello, Joel! Karibu.', 'Hello, Amina!\nHello, Joel!', 'Hello, !\nHello, !', 'It is an error'],
      answer: 0,
      explain: 'For Amina, greet() is the inherited one, and it calls Amina’s name(). Joel overrides greet() and builds on the parent’s version with super.greet(), then adds Karibu. super.greet() still calls Joel’s own name(), because the object is a Joel.',
    },
    { t: 'h', text: 'The rules of abstract' },
    {
      t: 'list',
      items: [
        'An abstract class **cannot be created** with `new`. You can still have variables and arrays **of** its type, which hold objects of its subclasses.',
        'A class that has even **one** abstract method must itself be declared `abstract`.',
        'A subclass of an abstract class must **implement every abstract method**, or be declared abstract too.',
        'Abstract methods cannot be `private`, `static` or `final`: they exist to be overridden.',
        'An abstract class may have **no** abstract methods at all. It is then just a class that must not be created directly.',
      ],
    },
    {
      t: 'fill',
      prompt: 'Choose the word that declares a method without a body that every subclass must write. The program should print **blue**.',
      template: progC(
        String.raw`abstract class Colour {
    ___ String name();
}

class Blue extends Colour {
    @Override
    String name() {
        return "blue";
    }
}`,
        String.raw`        System.out.println(new Blue().name());`,
      ),
      blanks: [{ options: ['abstract', 'static', 'final'], answer: 'abstract' }],
      output: 'blue',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: an abstract class with an abstract method, a subclass that finishes it, and `main`. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'abstract class Shape {',
        '    abstract int sides();',
        '}',
        'class Triangle extends Shape {',
        '    @Override int sides() { return 3; }',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        System.out.println(new Triangle().sides());',
        '    }',
        '}',
      ],
      output: '3',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`abstract class Payment {
    abstract int fee();
}`,
        String.raw`        Payment p = new Payment();
        System.out.println(p.fee());`,
      ),
      question: 'The compiler says “Payment is abstract; cannot be instantiated”. What should you do?',
      options: ['Create an object of a concrete subclass of Payment', 'Remove the word new', 'Make fee() private', 'Add a constructor to Payment'],
      answer: 0,
      explain: 'An abstract class is unfinished, so no object of exactly that type can exist. Write a subclass that implements fee(), and create that: `Payment p = new Bank();`.',
      fixed: progC(
        String.raw`abstract class Payment {
    abstract int fee();
}

class Bank extends Payment {
    @Override
    int fee() {
        return 500;
    }
}`,
        String.raw`        Payment p = new Bank();
        System.out.println(p.fee());`,
      ),
    },
    {
      t: 'quiz',
      question: 'What happens if a subclass of an abstract class forgets to implement an abstract method?',
      options: ['The compiler refuses to compile it', 'It compiles, and the method returns 0', 'It compiles, and fails when the method is called', 'The parent’s method runs'],
      answer: 0,
      explain: 'This is the great benefit of abstract methods: the mistake is caught at compile time, not discovered later by a surprised user.',
    },
    {
      t: 'quiz',
      question: 'Which of these is allowed?',
      options: ['A variable `Payment p` that holds a Bank object, where Payment is abstract', '`new Payment()` where Payment is abstract', 'An abstract method with a body', 'A private abstract method'],
      answer: 0,
      explain: 'You can never create an abstract class directly, but a variable of its type may hold any concrete subclass. That is exactly how polymorphism uses abstract classes.',
    },
    {
      t: 'quiz',
      question: 'In the template method pattern, which part is written in the abstract class?',
      options: ['The fixed steps, which call abstract methods for the steps that differ', 'Only the abstract methods', 'Nothing. Everything goes in subclasses', 'Only constructors'],
      answer: 0,
      explain: 'The abstract class writes the common outline once, and leaves holes (abstract methods) for each subclass to fill.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`abstract class Payment {
    abstract int fee();
}

class Cash extends Payment {
}`,
            String.raw`        System.out.println("hi");`,
          ),
          why: 'Cash is a normal class, but it did not write the abstract method `fee()` that Payment promised. Java stops at once: that is the safety net. Write `@Override int fee() { return 0; }` in Cash.',
          right: progC(
            String.raw`abstract class Payment {
    abstract int fee();
}

class Cash extends Payment {
    @Override
    int fee() {
        return 0;
    }
}`,
            String.raw`        System.out.println("hi");`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Payment {
    abstract int fee();
}`,
            String.raw`        System.out.println("hi");`,
          ),
          why: 'A class with an abstract method must itself be marked `abstract`, because it is incomplete. Write `abstract class Payment { ... }`.',
          right: progC(
            String.raw`abstract class Payment {
    abstract int fee();
}`,
            String.raw`        System.out.println("hi");`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Payment {
    int fee() {
        return 0;
    }
}

class Bank extends Payment {
}`,
            String.raw`        Payment p = new Bank();
        System.out.println("Fee: " + p.fee());`,
          ),
          why: 'The programmer forgot to write the Bank’s fee, and nothing complained: Bank silently inherits the free default, and charges 0. With an abstract `fee()`, the compiler would have refused to build Bank until the fee was written. Silent wrong defaults are the bugs that cost money.',
          right: progC(
            String.raw`abstract class Payment {
    abstract int fee();
}

class Bank extends Payment {
    @Override
    int fee() {
        return 500;
    }
}`,
            String.raw`        Payment p = new Bank();
        System.out.println("Fee: " + p.fee());`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'An `abstract class` is an unfinished blueprint. You cannot create it with `new`, but variables of its type can hold subclass objects.',
        'An `abstract` method has a header and no body. Every concrete subclass **must** implement it, or the compiler refuses.',
        'An abstract class can hold fields, constructors and ordinary methods, so shared code is written once.',
        'Template method: the abstract class writes the fixed steps and calls abstract methods for the parts that differ.',
        'Use abstract when the parent idea is too general to exist alone (a payment, a shape, a report) and you want the compiler to enforce the contract.',
      ],
      memory: 'The plan cannot be lived in; each building must add its own safe.',
    },
  ],
  exercises: [
    {
      id: 'j23-shapes',
      title: 'Areas of shapes',
      prompt: 'The abstract class `Shape` has the abstract methods `area()` and `name()`, and a finished `describe()` that prints `Circle area 12.57`. Complete `Rectangle` (width and height), `Circle` (radius, use `Math.PI`) and `Triangle` (base and height, area is half of base times height). `main` reads shapes: `R w h`, `C r` or `T b h`.',
      starter: progC(
        String.raw`abstract class Shape {
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

    // Implement area() and name()
}

class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    // Implement area() and name()
}

class Triangle extends Shape {
    private final double base;
    private final double height;

    Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    // Implement area() and name()
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        }`,
        SCAN,
      ),
      sampleInput: '3\nC 2\nR 3 4\nT 5 2',
      usesInput: true,
      tests: [
        { input: '3\nC 2\nR 3 4\nT 5 2', expected: 'Circle area 12.57\nRectangle area 12.00\nTriangle area 5.00' },
        { input: '1\nC 1', expected: 'Circle area 3.14' },
        { input: '2\nT 3 3\nR 0.5 4', expected: 'Triangle area 4.50\nRectangle area 2.00', hidden: true },
      ],
      hints: [
        'Each of the three classes must contain both methods, with `@Override`. Until they do, the compiler refuses to build them.',
        '`name()` returns the text: "Rectangle", "Circle" or "Triangle". Rectangle’s area is `width * height`.',
        'Circle: `Math.PI * radius * radius`. Triangle: `0.5 * base * height`.',
      ],
    },
    {
      id: 'j23-report',
      title: 'Two reports, one outline',
      prompt: 'The abstract class `Report` writes the outline in `render()`. Complete `DepositReport` and `MemberReport`: `title()` returns `Deposits` or `Members`, and `body()` returns `Total deposited: N` or `Members: N` using the number each one holds. `main` reads the two numbers and prints both reports.',
      starter: progC(
        String.raw`abstract class Report {
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

    // Implement title() and body()
}

class MemberReport extends Report {
    private final int count;

    MemberReport(int count) {
        this.count = count;
    }

    // Implement title() and body()
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Report a = new DepositReport(in.nextInt());
        Report b = new MemberReport(in.nextInt());
        System.out.println(a.render());
        System.out.println(b.render());`,
        SCAN,
      ),
      sampleInput: '850000 42',
      usesInput: true,
      tests: [
        { input: '850000 42', expected: '=== Deposits ===\nTotal deposited: 850000\n=== end ===\n=== Members ===\nMembers: 42\n=== end ===' },
        { input: '0 0', expected: '=== Deposits ===\nTotal deposited: 0\n=== end ===\n=== Members ===\nMembers: 0\n=== end ===' },
        { input: '5 7', expected: '=== Deposits ===\nTotal deposited: 5\n=== end ===\n=== Members ===\nMembers: 7\n=== end ===', hidden: true },
      ],
      hints: [
        'Each class needs two methods. They are not `static` and they have `@Override`.',
        '`String title() { return "Deposits"; }` in DepositReport.',
        '`String body() { return "Total deposited: " + total; }`, and the same idea with `"Members: " + count`.',
      ],
    },
    {
      id: 'j23-staff-pay',
      title: 'The monthly salary bill',
      prompt: 'Staff are paid differently. In the abstract class `Staff`, `monthlyPay()` is abstract. A `Teller` earns 500000, a `Manager` earns 900000 plus 100000 for every team led, and a `Volunteer` earns 0. Complete them. `main` reads people (`T name`, `M name teams`, `V name`) and prints `Amina: 500000` for each, and finally `Bill: N`.',
      starter: progC(
        String.raw`abstract class Staff {
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

    // Implement monthlyPay()
}

class Manager extends Staff {
    private final int teams;

    Manager(String name, int teams) {
        super(name);
        this.teams = teams;
    }

    // Implement monthlyPay()
}

class Volunteer extends Staff {
    Volunteer(String name) {
        super(name);
    }

    // Implement monthlyPay()
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        System.out.println("Bill: " + bill);`,
        SCAN,
      ),
      sampleInput: '3\nT Amina\nM Joel 2\nV Mary',
      usesInput: true,
      tests: [
        { input: '3\nT Amina\nM Joel 2\nV Mary', expected: 'Amina: 500000\nJoel: 1100000\nMary: 0\nBill: 1600000' },
        { input: '1\nM Peter 0', expected: 'Peter: 900000\nBill: 900000' },
        { input: '2\nV A\nV B', expected: 'A: 0\nB: 0\nBill: 0', hidden: true },
      ],
      hints: [
        'All three classes must implement `monthlyPay()`, each with `@Override int monthlyPay()`.',
        'Teller returns 500000 and Volunteer returns 0.',
        'The manager uses the field `teams`: `return 900000 + teams * 100000;`',
      ],
    },
    {
      id: 'j23-discount',
      title: 'Discounts',
      prompt: 'The abstract class `Discount` has the abstract method `apply(int price)`, which returns the new price. `Percent` takes off a percentage of the price (use whole-shilling arithmetic: `price * (100 - percent) / 100`). `Flat` takes off a fixed amount but never goes below 0. `main` reads a price, then `P percent` or `F amount` discounts, applying each in turn, and prints the final price: `Final: 16000`.',
      starter: progC(
        String.raw`abstract class Discount {
    abstract int apply(int price);
}

class Percent extends Discount {
    private final int percent;

    Percent(int percent) {
        this.percent = percent;
    }

    // Implement apply
}

class Flat extends Discount {
    private final int amount;

    Flat(int amount) {
        this.amount = amount;
    }

    // Implement apply
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        System.out.println("Final: " + price);`,
        SCAN,
      ),
      sampleInput: '20000 2\nP 10\nF 2000',
      usesInput: true,
      tests: [
        { input: '20000 2\nP 10\nF 2000', expected: 'Final: 16000' },
        { input: '1000 1\nF 5000', expected: 'Final: 0' },
        { input: '500 0', expected: 'Final: 500', hidden: true },
        { input: '1000 2\nP 50\nP 50', expected: 'Final: 250', hidden: true },
      ],
      hints: [
        'Both classes implement `apply` with `@Override int apply(int price)`.',
        'Percent: `return price * (100 - percent) / 100;`',
        'Flat: `return Math.max(0, price - amount);`',
      ],
    },
  ],
};
