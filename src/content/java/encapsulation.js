// Java, Level 3, lesson 18: Encapsulation (private fields, getters and rules in methods).
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

const SAFE_MEMBER = String.raw`class Member {
    private final String name;
    private int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = Math.max(0, balance);
    }

    String getName() {
        return name;
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

export const encapsulationLesson = {
  id: 'j-encapsulation',
  level: LEVEL,
  minutes: 32,
  title: 'Encapsulation: protect your data',
  summary: 'private fields, getters, methods that enforce the rules, and why a class should guard its own data',
  blocks: [
    {
      t: 'story',
      title: 'The cash box and the key',
      text: 'At the SACCO the money is kept in a cash box, and **only the treasurer holds the key**. Members do not reach into the box and take what they like, or put in a figure and write a bigger number in the book. Everything goes **through the treasurer**, who follows the rules: no deposit of nothing, no withdrawal of more than the balance, every change written down.\n\nIn lesson 16, `balance` was a plain field that **any** code could change. Look at how dangerous that is.',
    },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    String name;
    int balance;
}`,
        String.raw`        Member m = new Member();
        m.name = "Amina";
        m.balance = 50000;
        m.balance = -9000000;
        System.out.println(m.name + " has " + m.balance);`,
      ),
      output: 'Amina has -9000000',
    },
    { t: 'p', text: 'Nothing stopped a balance of minus nine million. Worse, the class `Member` cannot do anything about it: every line of every program that uses it can reach in and break it. In a big program with ten programmers, this ends in bugs that nobody can trace.' },
    { t: 'h', text: 'private: only the class itself may touch it' },
    { t: 'p', text: 'The cure is called **encapsulation**: **wrap the data inside the class and control the access**. Mark the fields `private`. A private field can be used only by code **inside the class**. Everything else must use the class’s **public methods**, which follow the rules. The treasurer holds the key.' },
    {
      t: 'list',
      items: [
        '`private`: visible only inside this class.',
        '`public`: visible from anywhere.',
        '(no word): visible to classes in the same package. This is the default, and the one we have used so far.',
        '`protected`: coming in lesson 21, with inheritance.',
      ],
    },
    { t: 'p', text: 'Here is a safe `Member`. Study it: the name is `private final` (set once and read only), the balance is `private`, and **the only ways to change the balance are `deposit` and `withdraw`**, and both enforce the rules.' },
    {
      t: 'try',
      code: progC(
        SAFE_MEMBER,
        String.raw`        Member m = new Member("Amina", 50000);
        m.deposit(10000);
        m.deposit(-500);
        System.out.println(m.getBalance());
        System.out.println(m.withdraw(100000));
        System.out.println(m.withdraw(20000));
        System.out.println(m.getName() + " has " + m.getBalance());`,
      ),
      output: '60000\nfalse\ntrue\nAmina has 40000',
    },
    { t: 'analogy', text: 'The cash box has a slot for money going in and a window for the treasurer to hand money out. You can ask “how much is in the book?” and the treasurer tells you (a **getter**). You can ask to deposit or withdraw (a **method with rules**). But the box itself stays locked, so nobody can simply decide the balance is nine million.' },
    { t: 'h', text: 'Getters, and methods instead of setters' },
    {
      t: 'list',
      items: [
        'A **getter** returns a private field: `int getBalance()`. By convention the name is `get` + the field name with a capital: `getName()`. For a boolean it is `isActive()`.',
        'A **setter** changes a field: `void setName(String name)`. Write one **only when outsiders really should be allowed to change that value**, and put the checks inside it.',
        'Often the best “setter” is **not a setter at all**. We do not have `setBalance(...)`, because a balance should not be set to any number: it should change only by `deposit` and `withdraw`. Name your methods after what happens in the real world.',
      ],
    },
    {
      t: 'predict',
      code: progC(
        SAFE_MEMBER,
        String.raw`        Member m = new Member("Joel", 1000);
        m.withdraw(1500);
        m.deposit(0);
        m.deposit(250);
        System.out.println(m.getBalance());`,
      ),
      question: 'What does this program print?',
      options: ['1250', '2750', '-250', '1000'],
      answer: 0,
      explain: 'The withdrawal of 1500 is refused (it is more than 1000), so the balance stays 1000. The deposit of 0 is ignored (it is not positive). The deposit of 250 works, giving 1250.',
    },
    { t: 'h', text: 'Why this is worth the extra typing' },
    {
      t: 'list',
      items: [
        '**The rules live in one place.** The “balance never goes negative” rule is written once, inside `Member`, and holds for every program that ever uses it. A rule that a class guarantees is called an **invariant**.',
        '**You can change the inside freely.** If tomorrow you store balances in cents, or in a database, only the class changes. Every program that calls `getBalance()` keeps working.',
        '**Bugs have one place to hide.** If a balance is wrong, the culprit can only be code inside `Member`.',
        '**The class documents itself.** Its public methods are a short list of everything an object can do.',
      ],
    },
    { t: 'tip', text: 'A good habit: **make every field private, and open up only what is needed**. It is easy to make something public later, but very hard to take it back once other code depends on it.' },
    {
      t: 'fill',
      prompt: 'The balance is private, so `main` must ask for it with the getter. Choose the right method so that the program prints **500**.',
      template: progC(
        String.raw`class Member {
    private int balance = 500;

    int getBalance() {
        return balance;
    }
}`,
        String.raw`        Member m = new Member();
        System.out.println(m.___());`,
      ),
      blanks: [{ options: ['getBalance', 'balance', 'getbalance'], answer: 'getBalance' }],
      output: '500',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to build a class with a private field and a getter, and to use it. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Box {',
        '    private int items = 7;',
        '    int getItems() {',
        '        return items;',
        '    }',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        System.out.println(new Box().getItems());',
        '    }',
        '}',
      ],
      output: '7',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`class Member {
    private int balance = 500;
}`,
        String.raw`        Member m = new Member();
        System.out.println(m.balance);`,
      ),
      question: 'The compiler says “balance has private access in Member”. What should you do?',
      options: ['Add a getter to Member and call it from main', 'Remove the word Member', 'Write m.Balance with a capital B', 'Make main private'],
      answer: 0,
      explain: 'The field is private, so only code inside Member may use it. Outside code goes through a public method, such as `getBalance()`.',
      fixed: progC(
        String.raw`class Member {
    private int balance = 500;

    int getBalance() {
        return balance;
    }
}`,
        String.raw`        Member m = new Member();
        System.out.println(m.getBalance());`,
      ),
    },
    {
      t: 'quiz',
      question: 'What is encapsulation?',
      options: ['Keeping a class’s data private and letting outsiders use it only through methods that enforce the rules', 'Making every method static', 'Putting all classes in one file', 'Copying an object'],
      answer: 0,
      explain: 'The data is wrapped inside the class and guarded by its methods. Outside code cannot put the object into a state the class does not allow.',
    },
    {
      t: 'quiz',
      question: 'What is the usual name of the getter for a field called `balance`?',
      options: ['getBalance()', 'balance()', 'get_balance()', 'Balance()'],
      answer: 0,
      explain: 'Java programmers write get, followed by the field name with a capital letter, in camelCase: getBalance(). A boolean field called active has isActive().',
    },
    {
      t: 'quiz',
      question: 'Why does the safe `Member` have no `setBalance(int)` method?',
      options: ['A balance should change only through deposit and withdraw, which enforce the rules', 'Java does not allow setters', 'Setters are slow', 'Balances never change'],
      answer: 0,
      explain: 'A setter would let any code store any number. The methods deposit and withdraw describe what really happens to a balance, and they check the rules.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Member {
    private int balance = 500;
}`,
            String.raw`        Member m = new Member();
        m.balance = 99;
        System.out.println("changed");`,
          ),
          why: 'The field is private, so main (outside the class) cannot change it. That is exactly what private is for. Give the class a method that follows the rules, such as `deposit`.',
          right: progC(
            String.raw`class Member {
    private int balance = 500;

    void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}`,
            String.raw`        Member m = new Member();
        m.deposit(99);
        System.out.println("changed");`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    private int balance = 500;

    int getBalance() {
        return balance;
    }
}`,
            String.raw`        Member m = new Member();
        System.out.println(m.getbalance());`,
          ),
          why: 'Java is case sensitive. The method is called `getBalance` with a capital B, and `getbalance` is a different, unknown name. Follow the camelCase naming convention exactly.',
          right: progC(
            String.raw`class Member {
    private int balance = 500;

    int getBalance() {
        return balance;
    }
}`,
            String.raw`        Member m = new Member();
        System.out.println(m.getBalance());`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    private int balance;

    void setBalance(int balance) {
        this.balance = balance;
    }

    int getBalance() {
        return balance;
    }
}`,
            String.raw`        Member m = new Member();
        m.setBalance(-9000000);
        System.out.println(m.getBalance());`,
          ),
          why: 'The field is private, but the setter lets anyone store any number, so the protection is gone: this prints -9000000. A private field with an unchecked setter is hardly better than a public field. Put the rules into the method, or replace the setter with deposit and withdraw.',
          right: progC(
            String.raw`class Member {
    private int balance;

    void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    int getBalance() {
        return balance;
    }
}`,
            String.raw`        Member m = new Member();
        m.deposit(-9000000);
        System.out.println(m.getBalance());`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'Encapsulation: keep the data **private** and let outside code use it only through public methods that follow the rules.',
        '`private` means only inside the class. `public` means anywhere. A `final` field is set once.',
        'A getter reads a field: `getBalance()`. Add a setter only when outsiders really may change a value, and check inside it.',
        'Prefer methods named after real actions (`deposit`, `withdraw`) to bare setters.',
        'Rules that a class guarantees are called invariants. They live in one place, and you can change the inside later without breaking users.',
      ],
      memory: 'Lock the box. The treasurer holds the key.',
    },
  ],
  exercises: [
    {
      id: 'j18-wallet',
      title: 'The wallet',
      prompt: 'Complete the class `Wallet`. `deposit(amount)` adds money only if the amount is positive. `spend(amount)` returns `true` and takes the money if the amount is positive and not more than the cash, otherwise it returns `false`. The first number is how many operations follow; each is `D amount` or `S amount`. Print `OK` or `Refused` for each, and finally `Cash: 300`.',
      starter: progC(
        String.raw`class Wallet {
    private int cash;

    int getCash() {
        return cash;
    }

    // Write deposit(int amount) and boolean spend(int amount)
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        System.out.println("Cash: " + w.getCash());`,
        SCAN,
      ),
      sampleInput: '4\nD 500\nS 200\nS 1000\nS -5',
      usesInput: true,
      tests: [
        { input: '4\nD 500\nS 200\nS 1000\nS -5', expected: 'OK\nOK\nRefused\nRefused\nCash: 300' },
        { input: '2\nS 10\nD 70', expected: 'Refused\nOK\nCash: 70' },
        { input: '3\nD 100\nS 100\nS 1', expected: 'OK\nOK\nRefused\nCash: 0', hidden: true },
      ],
      hints: [
        '`deposit` is a `void` method. Add `cash += amount;` only inside `if (amount > 0)`.',
        '`spend` returns a `boolean`. First check `amount <= 0 || amount > cash` and return `false`.',
        'Otherwise subtract the amount and `return true;`.',
      ],
    },
    {
      id: 'j18-thermometer',
      title: 'A safe thermometer',
      prompt: 'Complete the class `Thermometer`. The method `setCelsius(double c)` accepts a temperature only if it is **not below -273.15** (absolute zero); otherwise it keeps the old value. `getFahrenheit()` returns `celsius * 9 / 5 + 32`. `main` reads two temperatures and prints each Fahrenheit value with one decimal.',
      starter: progC(
        String.raw`class Thermometer {
    private double celsius = 0;

    // Write setCelsius(double c) and getFahrenheit()
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Thermometer t = new Thermometer();
        t.setCelsius(in.nextDouble());
        System.out.printf("%.1f%n", t.getFahrenheit());
        t.setCelsius(in.nextDouble());
        System.out.printf("%.1f%n", t.getFahrenheit());`,
        SCAN,
      ),
      sampleInput: '100 -300',
      usesInput: true,
      tests: [
        { input: '100 -300', expected: '212.0\n212.0' },
        { input: '0 37', expected: '32.0\n98.6' },
        { input: '-273.15 -273.16', expected: '-459.7\n-459.7', hidden: true },
      ],
      hints: [
        'The field is private, so only the methods of the class change it.',
        '`void setCelsius(double c) { if (c >= -273.15) { celsius = c; } }`',
        '`double getFahrenheit() { return celsius * 9 / 5 + 32; }`',
      ],
    },
    {
      id: 'j18-safe',
      title: 'The strongbox',
      prompt: 'Complete the class `Safe`. `open(int attempt)` returns `true` if the attempt equals the code (and the safe is not locked), and resets the failed count. A wrong attempt adds 1 to the failed count and returns `false`. After 3 failed attempts in a row, `isLocked()` is `true`, and a locked safe never opens. The input is the code, the number of attempts, and the attempts. Print `Opened`, `Wrong` or `Locked` for each.',
      starter: progC(
        String.raw`class Safe {
    private final int code;
    private int failed = 0;

    Safe(int code) {
        this.code = code;
    }

    // Write boolean open(int attempt) and boolean isLocked()
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        }`,
        SCAN,
      ),
      sampleInput: '1234 4\n1111 2222 3333 1234',
      usesInput: true,
      tests: [
        { input: '1234 4\n1111 2222 3333 1234', expected: 'Wrong\nWrong\nWrong\nLocked' },
        { input: '1234 2\n1 1234', expected: 'Wrong\nOpened' },
        { input: '77 3\n77 5 77', expected: 'Opened\nWrong\nOpened', hidden: true },
        { input: '9 5\n1 2 9 3 4', expected: 'Wrong\nWrong\nOpened\nWrong\nWrong', hidden: true },
      ],
      hints: [
        '`isLocked()` is simply `failed >= 3`.',
        'In `open`: if the safe is locked, return `false`. If `attempt == code`, set `failed = 0` and return `true`.',
        'Otherwise `failed++;` and `return false;`',
      ],
    },
    {
      id: 'j18-gradebook',
      title: 'A gradebook',
      prompt: 'Complete the class `Gradebook`. It keeps up to 10 marks in a **private** array. `add(int mark)` stores a mark (ignore it when the book is full or the mark is outside 0 to 100). `average()` returns the average as a double (0 if there are no marks) and `highest()` the largest mark (0 if there are none). `main` reads marks until the input ends, and prints `Average: 82.33` and `Highest: 92`.',
      starter: progC(
        String.raw`class Gradebook {
    private int[] marks = new int[10];
    private int count = 0;

    // Write add(int mark), double average() and int highest()
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Gradebook book = new Gradebook();
        while (in.hasNextInt()) {
            book.add(in.nextInt());
        }
        System.out.printf("Average: %.2f%n", book.average());
        System.out.println("Highest: " + book.highest());`,
        SCAN,
      ),
      sampleInput: '70 85 92',
      usesInput: true,
      tests: [
        { input: '70 85 92', expected: 'Average: 82.33\nHighest: 92' },
        { input: '101 -4 50 50', expected: 'Average: 50.00\nHighest: 50' },
        { input: '1 2 3 4 5 6 7 8 9 10 11 12', expected: 'Average: 5.50\nHighest: 10', hidden: true },
        { input: '', expected: 'Average: 0.00\nHighest: 0', hidden: true },
      ],
      hints: [
        '`add`: if `count < marks.length` and the mark is between 0 and 100, then `marks[count] = mark; count++;`',
        '`average`: if `count == 0` return 0. Otherwise add `marks[0]` to `marks[count - 1]` and divide by `(double) count`.',
        '`highest`: start `best` at 0 and compare each of the first `count` marks with it.',
      ],
    },
  ],
};
