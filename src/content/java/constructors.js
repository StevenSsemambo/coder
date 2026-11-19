// Java, Level 3, lesson 17: Constructors and this.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

export const constructorsLesson = {
  id: 'j-constructors',
  level: LEVEL,
  minutes: 32,
  title: 'Constructors and this',
  summary: 'Building an object ready to use: constructors, this, several constructors, and final fields',
  blocks: [
    {
      t: 'story',
      title: 'A passbook is never issued blank',
      text: 'When a new member joins, Mama Rose does not hand over an empty passbook and say “write your own name in it, and the starting balance, if you remember”. She **fills in the front page before the book leaves the desk**: the name, the member number, the starting balance. A book that is issued half-filled causes arguments for years.\n\nIn lesson 16 we built a member in two steps: `new Member()` and then `m.name = ...; m.balance = ...;`. In between, the object exists with `null` and `0`, and it is easy to forget a step. A **constructor** lets the class demand the right information **at the moment of creation**, so an object is never half-built.',
    },
    { t: 'h', text: 'A constructor is a method that builds the object' },
    { t: 'p', text: 'A constructor looks like a method, with two differences: it has **exactly the same name as the class**, and it has **no return type**, not even `void`. Java runs it automatically every time you write `new`. The values you put in the brackets of `new Member(...)` are passed to it.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    String name;
    int balance;

    Member(String n, int b) {
        name = n;
        balance = b;
    }

    String describe() {
        return name + " has " + balance;
    }
}`,
        String.raw`        Member a = new Member("Amina", 50000);
        Member b = new Member("Joel", 20000);
        System.out.println(a.describe());
        System.out.println(b.describe());`,
      ),
      output: 'Amina has 50000\nJoel has 20000',
    },
    { t: 'analogy', text: 'The constructor is the desk where passbooks are issued. You cannot walk out of the office with a book unless the form at the desk has been filled in. In the same way, once a class has a constructor that needs a name and a balance, `new Member()` with nothing in the brackets is refused by the compiler.' },
    { t: 'h', text: 'this: the object itself' },
    { t: 'p', text: 'Programmers like to give the constructor’s parameters the **same names as the fields**, because `name` is the best name for a name. Then there are two things called `name`: the **parameter** and the **field**. Inside the constructor the parameter wins, so Java needs a way to talk about the field. That way is **`this`**, a word that means “the object I am working on right now”. `this.name` is the field, and `name` alone is the parameter.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    String name;
    int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }

    String describe() {
        return name + " has " + balance;
    }
}`,
        String.raw`        Member a = new Member("Amina", 50000);
        System.out.println(a.describe());`,
      ),
      output: 'Amina has 50000',
    },
    { t: 'p', text: 'Read `this.name = name;` as: “the field called name of this object gets the value of the parameter called name”. This is the most common line in Java. Now see what happens when you forget the `this.`.' },
    {
      t: 'predict',
      code: progC(
        String.raw`class Member {
    String name;

    Member(String name) {
        name = name;
    }
}`,
        String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
      ),
      question: 'What does this program print?',
      options: ['null', 'Amina', 'An error message', 'An empty line'],
      answer: 0,
      explain: 'Inside the constructor, `name` means the parameter in **both** places, so the line copies the parameter onto itself and does nothing. The field `name` is never set, so it keeps its default value, null. The program compiles and runs without a single warning, which makes this a sneaky bug. Always write `this.name = name;`.',
    },
    { t: 'h', text: 'You always get a constructor' },
    { t: 'p', text: 'In lesson 16 you wrote classes with **no** constructor, and `new Member()` still worked. When a class has no constructor at all, Java quietly provides an empty one with no parameters (the **default constructor**). The moment you write **any** constructor of your own, this free one **disappears**. So after the class above, `new Member()` is an error. If you still want it, write it yourself.' },
    { t: 'h', text: 'Several constructors, and this(...)' },
    { t: 'p', text: 'Like methods, constructors can be **overloaded**: a class can offer several, with different parameters. A new member may join with a starting balance or with nothing. To avoid repeating code, one constructor can call another with `this(...)`. That call must be the **first line**.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
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
}`,
        String.raw`        Member a = new Member("Amina", 50000);
        Member b = new Member("Joel");
        System.out.println(a.describe());
        System.out.println(b.describe());`,
      ),
      output: 'Amina has 50000\nJoel has 0',
    },
    { t: 'h', text: 'Checking the information when the object is born' },
    { t: 'p', text: 'A constructor is the best place to make sure an object **starts in a sensible state**. This one never lets a member start with a negative balance. It also prints a line, so you can see exactly when a constructor runs: once for every `new`.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    String name;
    int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = Math.max(0, balance);
        System.out.println("Created " + name);
    }
}`,
        String.raw`        Member a = new Member("Amina", 50000);
        Member b = new Member("Joel", -300);
        System.out.println(b.balance);`,
      ),
      output: 'Created Amina\nCreated Joel\n0',
    },
    { t: 'h', text: 'final fields: set once, never changed' },
    { t: 'p', text: 'Some information must never change after the object is made: a member’s number does not change when she deposits money. Write `final` before the field. A `final` field must be given its value **once**, in the constructor, and any later attempt to change it is a compile error. This protects the object from accidents.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    final int number;
    String name;

    Member(int number, String name) {
        this.number = number;
        this.name = name;
    }
}`,
        String.raw`        Member a = new Member(1042, "Amina");
        a.name = "Amina Nakato";
        System.out.println(a.number + " " + a.name);`,
      ),
      output: '1042 Amina Nakato',
    },
    {
      t: 'fill',
      prompt: 'Complete the constructor so that the field gets the value of the parameter. The program should print **Amina**.',
      template: progC(
        String.raw`class Member {
    String name;

    Member(String name) {
        this.___ = name;
    }
}`,
        String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
      ),
      blanks: [{ options: ['name', 'balance', 'new'], answer: 'name' }],
      output: 'Amina',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order: the field first, then the constructor, then `main` that uses it. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Member {',
        '    String name;',
        '    Member(String name) {',
        '        this.name = name;',
        '    }',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        System.out.println(new Member("Amina").name);',
        '    }',
        '}',
      ],
      output: 'Amina',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`class Member {
    String name;

    void Member(String name) {
        this.name = name;
    }
}`,
        String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
      ),
      question: 'The compiler says “constructor Member in class Member cannot be applied to given types”. What is the mistake?',
      options: ['The word void makes it an ordinary method. A constructor has no return type', 'The parameter must be called n', 'new must come after the name', 'The class needs the word static'],
      answer: 0,
      explain: 'Because of `void`, this is not a constructor but a normal method that happens to have the same name as the class. Java then supplies the empty default constructor, which takes no arguments, so `new Member("Amina")` does not fit. Remove `void`.',
      fixed: progC(
        String.raw`class Member {
    String name;

    Member(String name) {
        this.name = name;
    }
}`,
        String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
      ),
    },
    {
      t: 'quiz',
      question: 'What are the two rules for the header of a constructor?',
      options: ['It has the same name as the class, and no return type', 'It is called init, and returns void', 'It is static, and returns the object', 'It starts with new'],
      answer: 0,
      explain: 'The name must match the class exactly, and there is no return type at all, not even void. Java runs it when you write `new`.',
    },
    {
      t: 'quiz',
      question: 'In a constructor, what does `this.name` mean?',
      options: ['The field called name of the object being built', 'The parameter called name', 'A new variable called name', 'The name of the class'],
      answer: 0,
      explain: '`this` is the object itself, so `this.name` is its field. A plain `name` is the parameter, which hides the field inside the constructor.',
    },
    {
      t: 'quiz',
      question: 'A class has only the constructor `Member(String name)`. What happens with `new Member()`?',
      options: ['A compile error, because the free empty constructor disappears once you write one', 'It works and name is null', 'It works and name is empty text', 'The program stops when it runs'],
      answer: 0,
      explain: 'Java gives you a default constructor only when the class has none. Once you write any constructor, you must write the empty one yourself if you still want it.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Member {
    String name;

    Member(String name) {
        this.name = name;
    }
}`,
            String.raw`        Member m = new Member();
        System.out.println(m.name);`,
          ),
          why: 'The class defines one constructor, which needs a name. Java will not build a member without it, so `new Member()` is refused. Give the name: `new Member("Amina")`, or add a second constructor with no parameters.',
          right: progC(
            String.raw`class Member {
    String name;

    Member(String name) {
        this.name = name;
    }
}`,
            String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    String name;
    int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }
}`,
            String.raw`        Member m = new Member(5000, "Amina");
        System.out.println(m.name);`,
          ),
          why: 'The arguments are in the wrong order: the constructor expects the name first and the balance second, and Java cannot turn the number 5000 into a name. The order, the number and the types of the arguments must match the constructor.',
          right: progC(
            String.raw`class Member {
    String name;
    int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }
}`,
            String.raw`        Member m = new Member("Amina", 5000);
        System.out.println(m.name);`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    final int number;

    Member(int number) {
        this.number = number;
    }
}`,
            String.raw`        Member m = new Member(1042);
        m.number = 2000;
        System.out.println(m.number);`,
          ),
          why: 'A `final` field can be set only once, by the constructor. Trying to change it later is a compile error: that is exactly the protection `final` gives. If the number really must change, the field should not be final.',
          right: progC(
            String.raw`class Member {
    final int number;

    Member(int number) {
        this.number = number;
    }
}`,
            String.raw`        Member m = new Member(1042);
        System.out.println(m.number);`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    String name;

    Member(String name) {
        name = name;
    }
}`,
            String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
          ),
          why: 'This prints null. Inside the constructor `name = name;` copies the parameter onto itself, and the field is never set. Write `this.name = name;`.',
          right: progC(
            String.raw`class Member {
    String name;

    Member(String name) {
        this.name = name;
    }
}`,
            String.raw`        Member m = new Member("Amina");
        System.out.println(m.name);`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A constructor has the same name as the class and no return type. It runs on every `new` and gives the object its starting values.',
        '`this` means the object itself. Write `this.name = name;` when the parameter and the field have the same name.',
        'With no constructor you get a free empty one. Once you write any constructor, the free one is gone.',
        'Constructors can be overloaded, and one can call another with `this(...)` as its first line.',
        'Validate in the constructor, and mark fields that must never change as `final`.',
      ],
      memory: 'Fill in the form before the passbook leaves the desk.',
    },
  ],
  exercises: [
    {
      id: 'j17-account',
      title: 'A safe account',
      prompt: 'Write the constructor of `Account`. It takes the owner and the starting balance. A starting balance below 0 must become 0. `main` reads an owner and a balance and prints `Amina: 50000`. A negative balance prints `Joel: 0`.',
      starter: progC(
        String.raw`class Account {
    String owner;
    int balance;

    // Write the constructor here

    String describe() {
        return owner + ": " + balance;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        String owner = in.next();
        int start = in.nextInt();
        Account account = new Account(owner, start);
        System.out.println(account.describe());`,
        SCAN,
      ),
      sampleInput: 'Amina 50000',
      usesInput: true,
      tests: [
        { input: 'Amina 50000', expected: 'Amina: 50000' },
        { input: 'Joel -300', expected: 'Joel: 0' },
        { input: 'Mary 0', expected: 'Mary: 0', hidden: true },
      ],
      hints: [
        'The constructor has the name `Account`, takes a `String` and an `int`, and has no return type.',
        'Use `this.owner = owner;` for the name. For the balance, decide: if the start is below 0, store 0.',
        '`Account(String owner, int balance) { this.owner = owner; this.balance = Math.max(0, balance); }`',
      ],
    },
    {
      id: 'j17-overload',
      title: 'Two ways to join',
      prompt: 'A member can join with a starting balance or with nothing. Add a second constructor `Member(String name)` that **calls the first one with `this(...)`** and a balance of 0. `main` reads one name and one name with a balance, and prints `Joel has 0` and `Amina has 50000`.',
      starter: progC(
        String.raw`class Member {
    String name;
    int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }

    // Add the second constructor here

    String describe() {
        return name + " has " + balance;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Member a = new Member(in.next());
        Member b = new Member(in.next(), in.nextInt());
        System.out.println(a.describe());
        System.out.println(b.describe());`,
        SCAN,
      ),
      sampleInput: 'Joel Amina 50000',
      usesInput: true,
      tests: [
        { input: 'Joel Amina 50000', expected: 'Joel has 0\nAmina has 50000' },
        { input: 'Mary Peter 1', expected: 'Mary has 0\nPeter has 1' },
      ],
      hints: [
        'The new constructor takes only a name: `Member(String name) { ... }`.',
        'Inside it, call the other constructor with `this(...)`. It must be the first line.',
        '`Member(String name) { this(name, 0); }`',
      ],
    },
    {
      id: 'j17-duration',
      title: 'Hours and minutes',
      prompt: 'A `Duration` is created from a number of minutes, and splits it into `hours` and `minutes` fields. Write the constructor. `describe()` then prints, for 125, `2h 5m`, and for 45, `0h 45m`.',
      starter: progC(
        String.raw`class Duration {
    int hours;
    int minutes;

    // Write the constructor that takes the total minutes

    String describe() {
        return hours + "h " + minutes + "m";
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Duration d = new Duration(in.nextInt());
        System.out.println(d.describe());`,
        SCAN,
      ),
      sampleInput: '125',
      usesInput: true,
      tests: [
        { input: '125', expected: '2h 5m' },
        { input: '45', expected: '0h 45m' },
        { input: '60', expected: '1h 0m', hidden: true },
        { input: '0', expected: '0h 0m', hidden: true },
      ],
      hints: [
        'The constructor takes one `int`, the total minutes. It must fill **both** fields.',
        'Whole hours: integer division by 60. Minutes left over: the remainder after dividing by 60.',
        '`Duration(int total) { this.hours = total / 60; this.minutes = total % 60; }`',
      ],
    },
    {
      id: 'j17-monthly',
      title: 'The monthly payment',
      prompt: 'A `Loan` is created with the amount borrowed and the number of months. Its constructor works out the `monthly` payment (the amount divided by the months, in whole shillings) and stores it in a field. `main` prints `Monthly: 5000` for `60000 12`.',
      starter: progC(
        String.raw`class Loan {
    int amount;
    int months;
    int monthly;

    // Write the constructor. It must also fill in monthly
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Loan loan = new Loan(in.nextInt(), in.nextInt());
        System.out.println("Monthly: " + loan.monthly);`,
        SCAN,
      ),
      sampleInput: '60000 12',
      usesInput: true,
      tests: [
        { input: '60000 12', expected: 'Monthly: 5000' },
        { input: '100000 8', expected: 'Monthly: 12500' },
        { input: '1000 3', expected: 'Monthly: 333', hidden: true },
      ],
      hints: [
        'The constructor takes two ints: the amount, then the months. Store both in their fields.',
        'The third field is **worked out** from the first two. A constructor can do any calculation.',
        '`Loan(int amount, int months) { this.amount = amount; this.months = months; this.monthly = amount / months; }`',
      ],
    },
  ],
};
