// Java, Level 3, lesson 21: Inheritance, super and overriding.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

const ACCOUNT = String.raw`class Account {
    private final String owner;
    private int balance;

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

    boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
}`;

export const inheritanceLesson = {
  id: 'j-inherit',
  level: LEVEL,
  minutes: 35,
  title: 'Inheritance: building on a class',
  summary: 'extends, super, overriding, protected, constructor order, and when inheritance is the right tool',
  blocks: [
    {
      t: 'story',
      title: 'Different kinds of accounts',
      text: 'The Village SACCO grows. Besides ordinary accounts, it now offers a **Savings account**, which pays interest, and a **Current account**, which lets a member go a little below zero for emergencies. Both still have an owner, a balance, deposits and withdrawals, exactly like the ordinary account. Only a few things are different.\n\nYou could copy the whole `Account` class twice and edit the copies. But then a bug fixed in one copy stays in the other, and every future change must be made three times. Java has a better way: a new class can say **“I am an Account, plus a few extras”**. This is **inheritance**.',
    },
    { t: 'h', text: 'extends: a class that builds on another' },
    { t: 'p', text: 'Write `class Savings extends Account`. `Savings` is the **subclass** (or child class) and `Account` is the **superclass** (or parent class). The subclass automatically **has everything the parent has**: its fields and its methods. Then it adds its own. Here `Savings` receives `deposit`, `getBalance` and the rest for free, and adds an interest rate and one new method.' },
    {
      t: 'try',
      code: progC(
        ACCOUNT +
          String.raw`

class Savings extends Account {
    private final int rate;

    Savings(String owner, int balance, int rate) {
        super(owner, balance);
        this.rate = rate;
    }

    void addInterest() {
        deposit(getBalance() * rate / 100);
    }
}`,
        String.raw`        Savings s = new Savings("Amina", 10000, 5);
        s.deposit(2000);
        s.addInterest();
        System.out.println(s.getOwner() + ": " + s.getBalance());`,
      ),
      output: 'Amina: 12600',
    },
    { t: 'analogy', text: 'A family business passes down its shop. The daughter inherits the building, the stock and the customers (everything in the parent class), and then adds her own idea: a mobile-money counter (new members and methods). She can also change how something is done in her shop (overriding), but she does not start from an empty plot.' },
    { t: 'h', text: 'The “is-a” test' },
    { t: 'p', text: 'Use inheritance only when the sentence **“a Savings account IS an Account”** is true. A Savings account really is a kind of account, so it fits. A member **has** an account, but is not one, so `Member extends Account` would be wrong (that relationship is called **composition**: a Member has a field of type Account). Choosing is-a or has-a correctly is one of the most important skills in object-oriented design.' },
    { t: 'h', text: 'super: talking to the parent' },
    { t: 'p', text: 'The parent’s part of the object must be built too. In the constructor of the child, `super(...)` calls the **parent’s constructor**. It must be the **first line**. If the parent has no constructor without parameters, the child **must** call `super(...)` with the right arguments. Watch the order in which the constructors run: the parent first, then the child.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Account {
    Account() {
        System.out.println("Account created");
    }
}

class Savings extends Account {
    Savings() {
        super();
        System.out.println("Savings created");
    }
}`,
        String.raw`        new Savings();`,
      ),
      output: 'Account created\nSavings created',
    },
    {
      t: 'predict',
      code: progC(
        String.raw`class A {
    A() {
        System.out.println("A");
    }
}

class B extends A {
    B() {
        System.out.println("B");
    }
}

class C extends B {
    C() {
        System.out.println("C");
    }
}`,
        String.raw`        new C();`,
      ),
      question: 'What does this program print? (The call `super()` is added for you when you do not write it.)',
      options: ['A\nB\nC', 'C\nB\nA', 'C', 'A\nC'],
      answer: 0,
      explain: 'Creating a C first builds its parent B, which first builds its parent A. The constructors finish from the top of the family tree downwards: A, then B, then C. If a parent has a no-argument constructor, Java inserts the call `super();` automatically.',
    },
    { t: 'h', text: 'Overriding: doing it differently' },
    { t: 'p', text: 'A subclass can **replace** a method it inherited with its own version, with the same name and parameters. This is called **overriding**, and you mark it with `@Override`. A current account lets a member withdraw up to 500 more than the balance. Inside the new method, `super.withdraw(...)` would call the parent’s version, if you need it.' },
    {
      t: 'try',
      code: progC(
        ACCOUNT +
          String.raw`

class Current extends Account {
    private static final int OVERDRAFT = 500;

    Current(String owner, int balance) {
        super(owner, balance);
    }

    @Override
    boolean withdraw(int amount) {
        if (amount > 0 && amount <= getBalance() + OVERDRAFT) {
            deposit(-amount);
            return true;
        }
        return false;
    }
}`,
        String.raw`        Account plain = new Account("Joel", 100);
        Current current = new Current("Mary", 100);
        System.out.println(plain.withdraw(400));
        System.out.println(current.withdraw(400));
        System.out.println(current.getBalance());`,
      ),
      output: 'false\ntrue\n100',
    },
    { t: 'p', text: 'Look at the last line. The current account said `true` (the withdrawal succeeded), but the balance is still 100! This is a **bug**. The trick `deposit(-amount)` is refused by the parent’s own rule (a deposit must be positive), so nothing was taken out. The child cannot reach the parent’s private balance, and that is the real problem. The next section shows the clean fix.' },
    { t: 'h', text: 'protected: for the family only' },
    { t: 'p', text: 'A `private` field cannot be used even by a subclass. Sometimes a subclass needs direct access, so there is a middle level: **`protected`** means “visible inside the class, in its subclasses (and in the same package)”, but not to the world. It is a good fit for a subclass that must adjust the parent’s data, but use it sparingly: it weakens encapsulation, because every subclass now depends on that field.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Account {
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
}`,
        String.raw`        Current c = new Current(100);
        System.out.println(c.withdraw(400));
        System.out.println(c.balance);
        System.out.println(c.withdraw(400));`,
      ),
      output: 'true\n-300\nfalse',
    },
    { t: 'p', text: 'Since `balance` is protected, `Main` can read `c.balance` here only because `Main` and the account classes sit in the same file and package. In a real program with packages, only the subclass would see it.' },
    { t: 'h', text: 'super.method(): reuse the parent’s version' },
    { t: 'p', text: 'An overriding method often wants to **add to** what the parent does rather than throw it away. `super.describe()` calls the parent’s version. A plain `describe()` inside `describe()` would call itself again and again (try it in the mistakes below).' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    protected String name;

    Member(String name) {
        this.name = name;
    }

    String describe() {
        return "Member " + name;
    }
}

class Leader extends Member {
    private final String role;

    Leader(String name, String role) {
        super(name);
        this.role = role;
    }

    @Override
    String describe() {
        return super.describe() + ", " + role;
    }
}`,
        String.raw`        Member m = new Member("Amina");
        Leader l = new Leader("Joel", "Chairperson");
        System.out.println(m.describe());
        System.out.println(l.describe());`,
      ),
      output: 'Member Amina\nMember Joel, Chairperson',
    },
    { t: 'h', text: 'Good to know' },
    {
      t: 'list',
      items: [
        '**A class extends only one class.** Java has single inheritance. (Interfaces, in lesson 24, give you the flexibility of more.)',
        '**Every class extends `Object`** automatically. That is where `toString`, `equals` and `hashCode` come from (lesson 20).',
        '**`final class X`** cannot be extended, and **`final` methods** cannot be overridden. `String` is a final class.',
        '**Do not inherit just to reuse code.** If the “is-a” sentence is false, use a field instead (composition).',
      ],
    },
    {
      t: 'fill',
      prompt: 'Choose the keyword that makes `Savings` a subclass of `Account`. The program should print **ok**.',
      template: progC(
        String.raw`class Account {
    String kind() {
        return "ok";
    }
}

class Savings ___ Account {
}`,
        String.raw`        System.out.println(new Savings().kind());`,
      ),
      blanks: [{ options: ['extends', 'implements', 'inherits'], answer: 'extends' }],
      output: 'ok',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: the parent class, a child that extends it, and `main` that uses the inherited method. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Animal {',
        '    String sound() {',
        '        return "...";',
        '    }',
        '}',
        'class Dog extends Animal {',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        System.out.println(new Dog().sound());',
        '    }',
        '}',
      ],
      output: '...',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`class Account {
    protected String owner;

    Account(String owner) {
        this.owner = owner;
    }
}

class Savings extends Account {
    Savings(String owner) {
        System.out.println("new savings");
    }
}`,
        String.raw`        new Savings("Amina");`,
      ),
      question: 'The compiler says “constructor Account in class Account cannot be applied to given types”. What is missing?',
      options: ['A first line super(owner); in the Savings constructor', 'The word new', 'The word static', 'A second class'],
      answer: 0,
      explain: 'Every constructor must first build the parent part. Account has only a constructor that needs an owner, so Java cannot add the empty `super();` for you. Write `super(owner);` as the first line.',
      fixed: progC(
        String.raw`class Account {
    protected String owner;

    Account(String owner) {
        this.owner = owner;
    }
}

class Savings extends Account {
    Savings(String owner) {
        super(owner);
        System.out.println("new savings");
    }
}`,
        String.raw`        new Savings("Amina");`,
      ),
    },
    {
      t: 'quiz',
      question: 'Which sentence tells you that `Savings extends Account` is a good design?',
      options: ['A Savings account IS an Account', 'A Savings account HAS an Account', 'A Savings account is shorter than an Account', 'An Account is a kind of Savings account'],
      answer: 0,
      explain: 'Inheritance models an is-a relationship. If the sentence “X is a Y” is false, use a field (has-a) instead.',
    },
    {
      t: 'quiz',
      question: 'What does `super(owner);` do as the first line of a constructor?',
      options: ['Calls the parent class’s constructor with owner', 'Creates a second object', 'Calls the child’s other constructor', 'Makes the owner private'],
      answer: 0,
      explain: 'The parent part of the object must be built first. super(...) runs the parent’s constructor with the arguments you give.',
    },
    {
      t: 'quiz',
      question: 'Can a class extend two classes at the same time in Java?',
      options: ['No, only one. (Interfaces give more flexibility.)', 'Yes, any number', 'Yes, but only two', 'Only if both are final'],
      answer: 0,
      explain: 'Java has single inheritance for classes, which avoids a lot of confusion. A class can implement many interfaces, which you will meet in lesson 24.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Account {
    private int balance = 100;
}

class Savings extends Account {
    int doubled() {
        return balance * 2;
    }
}`,
            String.raw`        System.out.println(new Savings().doubled());`,
          ),
          why: 'The field is `private` in Account, so even the subclass may not use it. Give the parent a getter (`getBalance()`), or make the field `protected` if subclasses really need direct access.',
          right: progC(
            String.raw`class Account {
    private int balance = 100;

    int getBalance() {
        return balance;
    }
}

class Savings extends Account {
    int doubled() {
        return getBalance() * 2;
    }
}`,
            String.raw`        System.out.println(new Savings().doubled());`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Account {
    void deposit(int amount) {
    }
}

class Savings extends Account {
    @Override
    void deposit(String amount) {
    }
}`,
            String.raw`        new Savings().deposit("5");`,
          ),
          why: 'To override a method, the name **and the parameter types** must be the same. `deposit(String)` is a different method from `deposit(int)`, so @Override complains that it replaces nothing.',
          right: progC(
            String.raw`class Account {
    void deposit(int amount) {
    }
}

class Savings extends Account {
    @Override
    void deposit(int amount) {
    }
}`,
            String.raw`        new Savings().deposit(5);`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    String describe() {
        return "Member";
    }
}

class Leader extends Member {
    @Override
    String describe() {
        return describe() + ", leader";
    }
}`,
            String.raw`        System.out.println(new Leader().describe());`,
          ),
          why: 'Inside Leader, `describe()` means Leader’s own describe, so the method calls itself again and again until Java runs out of room (a StackOverflowError). To reuse the parent’s version, write `super.describe()`.',
          right: progC(
            String.raw`class Member {
    String describe() {
        return "Member";
    }
}

class Leader extends Member {
    @Override
    String describe() {
        return super.describe() + ", leader";
    }
}`,
            String.raw`        System.out.println(new Leader().describe());`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Account {
    protected int balance = 100;
}

class Savings extends Account {
    protected int balance = 0;

    int parentBalance() {
        return super.balance;
    }
}`,
            String.raw`        Savings s = new Savings();
        System.out.println(s.balance + " " + s.parentBalance());`,
          ),
          why: 'Declaring `balance` again in the child does not replace the parent’s field. It creates a **second, hidden** field with the same name, so the object now holds two balances (0 and 100), and the code that uses one never sees the other. Do not redeclare inherited fields: use the one you inherited.',
          right: progC(
            String.raw`class Account {
    protected int balance = 100;
}

class Savings extends Account {
    int parentBalance() {
        return balance;
    }
}`,
            String.raw`        Savings s = new Savings();
        System.out.println(s.balance + " " + s.parentBalance());`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        '`class Child extends Parent` gives the child every field and method of the parent. Use it only when “Child IS a Parent”.',
        '`super(...)` is the first line of a child constructor and builds the parent part. Constructors run parent first, then child.',
        'Override a method with the same name and parameters, and mark it `@Override`. Use `super.method()` to build on the parent’s version.',
        '`private` stays private even from subclasses. `protected` opens it to the family. Do not redeclare inherited fields.',
        'A class extends one class only, and every class extends `Object`. Use a field (composition) when “is-a” is false.',
      ],
      memory: 'Inherit what you are, add what you do differently.',
    },
  ],
  exercises: [
    {
      id: 'j21-savings',
      title: 'A savings account',
      prompt: 'Complete `Savings extends Account`. Its constructor takes the owner, the balance and a `rate` in percent, and calls `super`. The method `addInterest()` adds `rate` percent of the balance to the balance. `main` reads `owner balance rate`, deposits 1000, adds the interest, and prints for `Amina 5000 10`: `Amina: 6600`.',
      starter: progC(
        String.raw`class Account {
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
        // Call super and store the rate
    }

    void addInterest() {
        // Add rate percent of the balance
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Savings s = new Savings(in.next(), in.nextInt(), in.nextInt());
        s.deposit(1000);
        s.addInterest();
        System.out.println(s.getOwner() + ": " + s.getBalance());`,
        SCAN,
      ),
      sampleInput: 'Amina 5000 10',
      usesInput: true,
      tests: [
        { input: 'Amina 5000 10', expected: 'Amina: 6600' },
        { input: 'Joel 0 50', expected: 'Joel: 1500' },
        { input: 'Mary 1000 0', expected: 'Mary: 2000', hidden: true },
      ],
      hints: [
        'The first line of the constructor must be `super(owner, balance);`. Then `this.rate = rate;`.',
        '`balance` is protected, so the subclass can use it directly.',
        '`balance += balance * rate / 100;` inside `addInterest`.',
      ],
    },
    {
      id: 'j21-current',
      title: 'The current account',
      prompt: 'Complete `Current extends Account`. It overrides `withdraw`: a withdrawal is allowed when the amount is positive and not more than the balance **plus an overdraft of 500**. On success it reduces the balance and returns `true`. `main` reads the starting balance and then withdrawals, printing `OK` and the new balance, or `Refused`.',
      starter: progC(
        String.raw`class Account {
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

    // Override withdraw to allow an overdraft of 500
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Current account = new Current(in.nextInt());
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            if (account.withdraw(in.nextInt())) {
                System.out.println("OK " + account.balance);
            } else {
                System.out.println("Refused");
            }
        }`,
        SCAN,
      ),
      sampleInput: '300 3\n500 400 100',
      usesInput: true,
      tests: [
        { input: '300 3\n500 400 100', expected: 'OK -200\nRefused\nOK -300' },
        { input: '1000 2\n1500 1', expected: 'OK -500\nRefused' },
        { input: '0 2\n0 500', expected: 'Refused\nOK -500', hidden: true },
      ],
      hints: [
        'Write `@Override boolean withdraw(int amount)` in `Current`, with the same header as in `Account`.',
        'Refuse when `amount <= 0 || amount > balance + 500`.',
        'Otherwise `balance -= amount;` and `return true;`.',
      ],
    },
    {
      id: 'j21-staff',
      title: 'Staff pay',
      prompt: 'Complete `Manager extends Employee`. A manager’s `pay()` is the normal pay (use `super.pay()`) plus a `bonus`. The inherited `describe()` already prints `name earns pay`. `main` reads a number of people, then `E name salary` for an employee or `M name salary bonus` for a manager, and prints each description, such as `Joel earns 1500`.',
      starter: progC(
        String.raw`class Employee {
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

    // Override pay() to add the bonus
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        }`,
        SCAN,
      ),
      sampleInput: '2\nE Amina 1000\nM Joel 1000 500',
      usesInput: true,
      tests: [
        { input: '2\nE Amina 1000\nM Joel 1000 500', expected: 'Amina earns 1000\nJoel earns 1500' },
        { input: '1\nM Mary 2000 0', expected: 'Mary earns 2000' },
        { input: '3\nM A 10 1\nE B 20\nM C 30 3', expected: 'A earns 11\nB earns 20\nC earns 33', hidden: true },
      ],
      hints: [
        'Write `@Override int pay()` in `Manager`.',
        'Reuse the parent’s version: `super.pay()` gives the normal salary.',
        '`return super.pay() + bonus;`. The inherited `describe()` calls `pay()` and will automatically use your new version.',
      ],
    },
    {
      id: 'j21-leader',
      title: 'Describe the leader',
      prompt: 'Complete `Leader extends Member`. Its `toString()` returns the member’s own text (use `super.toString()`) followed by a space and the role in square brackets. `main` reads `name balance role` and prints the leader, and then an ordinary member with the same name and balance: `Amina (50000) [Chair]` and `Amina (50000)`.',
      starter: progC(
        String.raw`class Member {
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

    // Override toString and add the role in square brackets
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        String name = in.next();
        int balance = in.nextInt();
        String role = in.next();
        System.out.println(new Leader(name, balance, role));
        System.out.println(new Member(name, balance));`,
        SCAN,
      ),
      sampleInput: 'Amina 50000 Chair',
      usesInput: true,
      tests: [
        { input: 'Amina 50000 Chair', expected: 'Amina (50000) [Chair]\nAmina (50000)' },
        { input: 'Joel 0 Secretary', expected: 'Joel (0) [Secretary]\nJoel (0)' },
        { input: 'Mary 7 Treasurer', expected: 'Mary (7) [Treasurer]\nMary (7)', hidden: true },
      ],
      hints: [
        'The override needs `@Override` and `public`, because the method in Object is public.',
        '`super.toString()` gives the text that Member would produce.',
        '`return super.toString() + " [" + role + "]";`',
      ],
    },
  ],
};
