// Java, Level 3, lesson 22: Polymorphism and instanceof.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

const ACCOUNTS = String.raw`class Account {
    protected int balance;

    Account(int balance) {
        this.balance = balance;
    }

    String monthEnd() {
        return "Account: nothing to do";
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

    @Override
    String monthEnd() {
        addInterest();
        return "Savings: interest added, balance " + balance;
    }
}

class Current extends Account {
    Current(int balance) {
        super(balance);
    }

    @Override
    String monthEnd() {
        balance -= 50;
        return "Current: fee taken, balance " + balance;
    }
}`;

export const polymorphismLesson = {
  id: 'j-poly',
  level: LEVEL,
  minutes: 35,
  title: 'Polymorphism: one call, many behaviours',
  summary: 'Parent-typed variables holding child objects, dynamic dispatch, instanceof and safe casting',
  blocks: [
    {
      t: 'story',
      title: 'The end-of-month pile',
      text: 'On the last day of the month the treasurer takes the whole pile of account books and says to each one the same thing: **“month-end!”** A Savings book adds the interest. A Current book takes the monthly fee. An ordinary book does nothing. The treasurer does not look at the cover and decide who to ask for what. She gives **one instruction to everything in the pile**, and each book does **its own** right thing.\n\nThis is one of the most powerful ideas in programming. It has a Greek name, **polymorphism**, which means “many forms”: **one call, and the behaviour depends on the real kind of object**.',
    },
    { t: 'h', text: 'A parent variable can hold a child object' },
    { t: 'p', text: 'Because a Savings account **is an** Account, you may keep it in a variable of the parent type: `Account a = new Savings(...);`. That is allowed automatically (an **upcast**). The variable is declared as an Account, but the object it points to is still a Savings. So an **array of Account** can hold a mix of every kind of account.' },
    { t: 'h', text: 'Dynamic dispatch: the object decides' },
    { t: 'p', text: 'When you call `a.monthEnd()`, Java does **not** look at the declared type of `a`. It looks at the **real object** at the moment the call runs, and uses that object’s own version of the method. This choice made while the program runs is called **dynamic dispatch**. Press **Run** and see the three different results from one loop.' },
    {
      t: 'try',
      code: progC(
        ACCOUNTS,
        String.raw`        Account[] pile = {
            new Account(1000),
            new Savings(2000, 10),
            new Current(300)
        };
        for (Account a : pile) {
            System.out.println(a.monthEnd());
        }`,
      ),
      output: 'Account: nothing to do\nSavings: interest added, balance 2200\nCurrent: fee taken, balance 250',
    },
    { t: 'analogy', text: 'A teacher says “Everybody, perform!” to a class. The singer sings, the dancer dances, and the drummer drums. The teacher uses the **same word** for all of them. If she had to check each child and give a separate instruction, adding a new kind of performer, say a poet, would mean rewriting every instruction. With polymorphism, a new kind of account only needs its own `monthEnd`, and the loop above never changes.' },
    {
      t: 'predict',
      code: progC(
        String.raw`class Animal {
    String sound() {
        return "...";
    }
}

class Cow extends Animal {
    @Override
    String sound() {
        return "Moo";
    }
}

class Hen extends Animal {
}`,
        String.raw`        Animal[] farm = {new Cow(), new Hen(), new Animal()};
        for (Animal a : farm) {
            System.out.print(a.sound() + " ");
        }
        System.out.println();`,
      ),
      question: 'What does this program print?',
      options: ['Moo ... ...', 'Moo Moo Moo', '... ... ...', 'Moo Cluck ...'],
      answer: 0,
      explain: 'The Cow object overrides sound, so it says Moo. The Hen object does not override it, so it uses the inherited version, “...”. The plain Animal also says “...”. The declared type of the loop variable is Animal every time, but each call runs the real object’s method.',
    },
    { t: 'h', text: 'Polymorphic methods' },
    { t: 'p', text: 'Methods get the same power. A method that takes an `Account` parameter accepts **any** kind of account, now and in the future. This is how real programs stay flexible.' },
    {
      t: 'try',
      code: progC(
        ACCOUNTS,
        String.raw`        process(new Savings(1000, 5));
        process(new Current(500));`,
        '',
        String.raw`    static void process(Account a) {
        System.out.println(a.monthEnd());
    }`,
      ),
      output: 'Savings: interest added, balance 1050\nCurrent: fee taken, balance 450',
    },
    { t: 'h', text: 'What can you call? The declared type decides' },
    { t: 'p', text: 'There is one limit. The **compiler** only allows the methods that the **declared type** has. If `a` is declared as an `Account`, the compiler does not know it is a Savings, so `a.addInterest()` is refused, even when the object really is a Savings. The way out is a **cast**: you tell Java “trust me, this one really is a Savings”. A cast to a child type (a **downcast**) is not automatic. You write the type in brackets: `((Savings) a).addInterest()`.' },
    { t: 'h', text: 'instanceof: check before you cast' },
    { t: 'p', text: 'If you are wrong, a cast is a serious error. Java defends against this with `instanceof`, which asks “is this object really of that type?” and gives `true` or `false`. Modern Java lets you combine the check and the cast: `if (a instanceof Savings s)` tests, and if it is true, gives you the variable `s` already of the type Savings.' },
    {
      t: 'try',
      code: progC(
        ACCOUNTS,
        String.raw`        Account[] pile = {new Account(100), new Savings(1000, 10), new Current(50)};
        int interestPaid = 0;
        for (Account a : pile) {
            if (a instanceof Savings s) {
                s.addInterest();
                interestPaid++;
            }
        }
        System.out.println("Savings accounts: " + interestPaid);
        System.out.println(pile[1].balance);
        System.out.println(pile[0] instanceof Savings);
        System.out.println(pile[1] instanceof Account);`,
      ),
      output: 'Savings accounts: 1\n1100\nfalse\ntrue',
    },
    { t: 'tip', text: 'Without the `instanceof` check, a wrong cast would stop a real Java program with a **ClassCastException**. In SayMaCoder the in-browser Java does not report that particular error (a known limit of the app), so the program would just carry on with nonsense. That is one more reason to **always** check with `instanceof` before you downcast, on a phone and on a laptop.' },
    { t: 'p', text: 'Every object also remembers its real class. `getClass().getSimpleName()` gives its name, which shows dynamic dispatch at work.' },
    {
      t: 'try',
      code: progC(
        ACCOUNTS,
        String.raw`        Account a = new Savings(100, 5);
        Account b = new Current(100);
        System.out.println(a.getClass().getSimpleName());
        System.out.println(b.getClass().getSimpleName());
        System.out.println(a instanceof Savings);
        System.out.println(a instanceof Current);`,
      ),
      output: 'Savings\nCurrent\ntrue\nfalse',
    },
    { t: 'h', text: 'A trap: overloading is decided earlier' },
    { t: 'p', text: '**Overriding** is chosen by the real object, while the program runs. But when two methods have the **same name and different parameter types** (**overloading**), Java chooses between them while **compiling**, using the **declared** type of the argument. Predict this carefully.' },
    {
      t: 'predict',
      code: progC(
        String.raw`class Account {
}

class Savings extends Account {
}`,
        String.raw`        Account a = new Savings();
        System.out.println(who(a));
        System.out.println(who(new Savings()));`,
        '',
        String.raw`    static String who(Account a) {
        return "an account";
    }

    static String who(Savings s) {
        return "a savings account";
    }`,
      ),
      question: 'What does this program print?',
      options: ['an account\na savings account', 'a savings account\na savings account', 'an account\nan account', 'a savings account\nan account'],
      answer: 0,
      explain: 'The variable a is **declared** as Account, so the compiler picks the version for Account, even though the object is a Savings. In the second call, the argument is a Savings expression, so the Savings version is chosen. Rule: overriding follows the object, overloading follows the declared type.',
    },
    {
      t: 'fill',
      prompt: 'Choose the keyword that checks the real type, so that the program prints **yes**.',
      template: progC(
        String.raw`class Account {
}

class Savings extends Account {
}`,
        String.raw`        Account a = new Savings();
        if (a ___ Savings) {
            System.out.println("yes");
        }`,
      ),
      blanks: [{ options: ['instanceof', 'extends', 'implements'], answer: 'instanceof' }],
      output: 'yes',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: a parent, a child that overrides, and a loop over a parent-typed array. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Pet {',
        '    String speak() { return "..."; }',
        '}',
        'class Dog extends Pet {',
        '    @Override String speak() { return "Woof"; }',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        Pet p = new Dog();',
        '        System.out.println(p.speak());',
        '    }',
        '}',
      ],
      output: 'Woof',
    },
    {
      t: 'bug',
      code: progC(
        ACCOUNTS,
        String.raw`        Account a = new Savings(1000, 10);
        a.addInterest();
        System.out.println(a.balance);`,
      ),
      question: 'The compiler says “cannot find symbol: method addInterest()”, but the object really is a Savings. Why?',
      options: ['The variable is declared as Account, and Account has no addInterest. A cast is needed', 'addInterest is private', 'Savings has no constructor', 'balance must be public'],
      answer: 0,
      explain: 'The compiler only knows the declared type, Account. Check and convert: `if (a instanceof Savings s) { s.addInterest(); }`, or declare the variable as `Savings a`.',
      fixed: progC(
        ACCOUNTS,
        String.raw`        Account a = new Savings(1000, 10);
        if (a instanceof Savings s) {
            s.addInterest();
        }
        System.out.println(a.balance);`,
      ),
    },
    {
      t: 'quiz',
      question: 'What is polymorphism?',
      options: ['One call to a method whose behaviour depends on the real type of the object', 'Having many variables', 'Writing many classes in one file', 'Copying methods into every class'],
      answer: 0,
      explain: 'The same call, such as a.monthEnd(), behaves differently for different kinds of objects. The caller does not need to know which kind it is.',
    },
    {
      t: 'quiz',
      question: '`Account a = new Savings(100, 5);` Which method runs on `a.monthEnd()`?',
      options: ['Savings’s own monthEnd, because the object is a Savings', 'Account’s monthEnd, because a is declared as Account', 'Neither. It is an error', 'Both, one after the other'],
      answer: 0,
      explain: 'For overridden methods Java uses the real object at run time (dynamic dispatch).',
    },
    {
      t: 'quiz',
      question: 'Why should you test with `instanceof` before a downcast?',
      options: ['A wrong cast is an error. instanceof proves the object really is that type', 'instanceof makes the program faster', 'A cast does not work without it', 'It converts the object for you in every case'],
      answer: 0,
      explain: 'The test makes the cast safe. In `if (a instanceof Savings s)`, the variable s exists only when the check succeeded.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Account {
}

class Savings extends Account {
}`,
            String.raw`        Savings s = new Account();
        System.out.println("made");`,
          ),
          why: 'An Account is not necessarily a Savings account, so Java refuses to put an Account into a Savings variable. The “is-a” arrow only points one way: a Savings IS an Account, but an Account is not always a Savings. Create a `new Savings()`, or declare the variable as `Account`.',
          right: progC(
            String.raw`class Account {
}

class Savings extends Account {
}`,
            String.raw`        Account s = new Savings();
        System.out.println("made");`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Account {
}

class Savings extends Account {
    int rate = 5;
}`,
            String.raw`        Account a = new Savings();
        System.out.println(a.rate);`,
          ),
          why: 'The field `rate` belongs to Savings, but the variable is declared as Account, and Account has no `rate`. Convert first, safely: `if (a instanceof Savings s) { System.out.println(s.rate); }`.',
          right: progC(
            String.raw`class Account {
}

class Savings extends Account {
    int rate = 5;
}`,
            String.raw`        Account a = new Savings();
        if (a instanceof Savings s) {
            System.out.println(s.rate);
        }`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Account {
}

class Savings extends Account {
}`,
            String.raw`        Account a = new Savings();
        if (a instanceof Account) {
            System.out.println("account");
        } else if (a instanceof Savings) {
            System.out.println("savings");
        }`,
          ),
          why: 'A Savings IS an Account, so the first test is already true, and the more specific test is never reached: this prints account. When you test several types in a chain, put the **most specific** (child) type first and the general (parent) type last.',
          right: progC(
            String.raw`class Account {
}

class Savings extends Account {
}`,
            String.raw`        Account a = new Savings();
        if (a instanceof Savings) {
            System.out.println("savings");
        } else if (a instanceof Account) {
            System.out.println("account");
        }`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Account {
    String kind() {
        return "account";
    }
}

class Savings extends Account {
    String kind(int level) {
        return "savings";
    }
}`,
            String.raw`        Account a = new Savings();
        System.out.println(a.kind());`,
          ),
          why: 'The programmer expected “savings”. But `kind(int level)` has a different parameter list, so it is a new overloaded method, not an override of `kind()`. The call runs the parent’s version and prints account. Writing `@Override` would have caught this at once.',
          right: progC(
            String.raw`class Account {
    String kind() {
        return "account";
    }
}

class Savings extends Account {
    @Override
    String kind() {
        return "savings";
    }
}`,
            String.raw`        Account a = new Savings();
        System.out.println(a.kind());`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A variable of a parent type can hold any child object (an upcast, automatic). An array of the parent type can hold a mix.',
        '**Polymorphism / dynamic dispatch:** for an overridden method, the real object decides which version runs. The caller does not need to know the kind.',
        'The compiler allows only the methods of the **declared** type. To use a child-only method, check with `instanceof` and cast: `if (a instanceof Savings s)`.',
        'Overriding follows the object at run time. Overloading follows the declared types at compile time.',
        'Test the most specific type first in an `instanceof` chain.',
      ],
      memory: 'Same instruction to everyone, and each does its own thing.',
    },
  ],
  exercises: [
    {
      id: 'j22-payments',
      title: 'Fees for every kind of payment',
      prompt: 'Complete the fees. `MobileMoney` charges 1% of the amount but at least 100. `Bank` charges a flat 500. `Cash` is free (already done). Each payment shows `fee()` and `total()` (amount plus fee). `main` reads the number of payments, then `M amount`, `B amount` or `C amount`, and prints `Fee: 200 Total: 20200` for each, then `Total fees: N`.',
      starter: progC(
        String.raw`class Payment {
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

    // Override fee(): 1 percent, at least 100
}

class Bank extends Payment {
    Bank(int amount) {
        super(amount);
    }

    // Override fee(): flat 500
}

class Cash extends Payment {
    Cash(int amount) {
        super(amount);
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        System.out.println("Total fees: " + fees);`,
        SCAN,
      ),
      sampleInput: '3\nM 20000\nB 1000\nC 700',
      usesInput: true,
      tests: [
        { input: '3\nM 20000\nB 1000\nC 700', expected: 'Fee: 200 Total: 20200\nFee: 500 Total: 1500\nFee: 0 Total: 700\nTotal fees: 700' },
        { input: '2\nM 5000\nM 100000', expected: 'Fee: 100 Total: 5100\nFee: 1000 Total: 101000\nTotal fees: 1100' },
        { input: '1\nC 5', expected: 'Fee: 0 Total: 5\nTotal fees: 0', hidden: true },
      ],
      hints: [
        'Each subclass overrides `fee()` with `@Override int fee()`. The loop in `main` already calls `p.fee()` on a `Payment` variable, so your versions will be used automatically.',
        'For mobile money: `int percent = amount / 100; return Math.max(100, percent);`',
        'For the bank, simply `return 500;`',
      ],
    },
    {
      id: 'j22-count-managers',
      title: 'How many managers?',
      prompt: 'The classes `Teller`, `Cashier` and `Manager` all extend `Staff`. `main` reads the number of people and a letter for each (`T`, `C` or `M`) and puts them in an array of `Staff`. Count the managers **with `instanceof`** and print `Managers: 2 of 5`.',
      starter: progC(
        String.raw`class Staff {
}

class Teller extends Staff {
}

class Cashier extends Staff {
}

class Manager extends Staff {
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        // Count the managers with instanceof
        System.out.println("Managers: " + managers + " of " + n);`,
        SCAN,
      ),
      sampleInput: '5\nT M C M T',
      usesInput: true,
      tests: [
        { input: '5\nT M C M T', expected: 'Managers: 2 of 5' },
        { input: '3\nT T C', expected: 'Managers: 0 of 3' },
        { input: '1\nM', expected: 'Managers: 1 of 1', hidden: true },
      ],
      hints: [
        'Go through the team with a for-each loop: `for (Staff s : team)`.',
        '`if (s instanceof Manager) { managers++; }`',
        'Replace the comment line with the loop. Keep the final println as it is.',
      ],
    },
    {
      id: 'j22-interest-all',
      title: 'Interest for the savers only',
      prompt: 'The array holds a mix of `Account` and `Savings` objects. For every account that really is a `Savings`, call `addInterest()` (use `instanceof`). Then print every balance, one per line. The input has the number of accounts, then `A balance` or `S balance rate`.',
      starter: progC(
        String.raw`class Account {
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
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        // Add interest to every Savings account
        for (Account a : accounts) {
            System.out.println(a.balance);
        }`,
        SCAN,
      ),
      sampleInput: '3\nA 1000\nS 2000 10\nS 500 50',
      usesInput: true,
      tests: [
        { input: '3\nA 1000\nS 2000 10\nS 500 50', expected: '1000\n2200\n750' },
        { input: '1\nA 5', expected: '5' },
        { input: '2\nS 100 0\nS 100 100', expected: '100\n200', hidden: true },
      ],
      hints: [
        'Loop over the array before the printing loop. An `Account` variable cannot call `addInterest()` directly.',
        '`for (Account a : accounts) { if (a instanceof Savings s) { s.addInterest(); } }`',
        'The variable `s` from the pattern is the same object, now typed as Savings, so `s.addInterest()` is allowed.',
      ],
    },
    {
      id: 'j22-names',
      title: 'What am I really?',
      prompt: 'A `Pet` array holds `Dog`, `Cat` and `Pet` objects, made from the letters `D`, `C` and `P`. Print the real class name of every object, one per line, with `getClass().getSimpleName()`, and then call `sound()` on it: `Dog says Woof`. The `sound` methods of `Dog` and `Cat` are missing.',
      starter: progC(
        String.raw`class Pet {
    String sound() {
        return "...";
    }
}

class Dog extends Pet {
    // Override sound() to return "Woof"
}

class Cat extends Pet {
    // Override sound() to return "Meow"
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        }`,
        SCAN,
      ),
      sampleInput: '3\nD C P',
      usesInput: true,
      tests: [
        { input: '3\nD C P', expected: 'Dog says Woof\nCat says Meow\nPet says ...' },
        { input: '1\nC', expected: 'Cat says Meow' },
        { input: '2\nP D', expected: 'Pet says ...\nDog says Woof', hidden: true },
      ],
      hints: [
        'Add one method to each subclass, with the same header as in `Pet`.',
        '`@Override String sound() { return "Woof"; }` in `Dog`, and the same with "Meow" in `Cat`.',
        'The loop in main already uses a `Pet` variable, so each object will use its own `sound`.',
      ],
    },
  ],
};
