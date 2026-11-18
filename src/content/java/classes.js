// Java, Level 3, lesson 16: Classes and objects.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');

const MEMBER = String.raw`class Member {
    String name;
    int balance;

    void deposit(int amount) {
        balance += amount;
    }

    String describe() {
        return name + " has " + balance;
    }
}`;

export const classesLesson = {
  id: 'j-classes',
  level: LEVEL,
  minutes: 35,
  title: 'Classes and objects',
  summary: 'Blueprints and things: fields, methods, new, the dot, references, null, and objects in arrays',
  blocks: [
    {
      t: 'story',
      title: 'One passbook, not two arrays',
      text: 'In the ledger of lesson 15, a member was split in two: her name lived in one array and her balance in another, and only the number `i` tied them together. One slip and Amina’s name pointed at Joel’s money.\n\nThe real passbook is better: **one small book that holds the member’s name and her balance together**, and the SACCO prints thousands of them from the **same template**. Java lets you do exactly this. The template is called a **class**. Each passbook printed from it is called an **object**.',
    },
    { t: 'h', text: 'A class is a blueprint, an object is the thing' },
    { t: 'p', text: 'A **class** describes a kind of thing: what information it holds (its **fields**) and what it can do (its **methods**). It is a plan, like the printed template of a passbook or an architect’s drawing of a house. A class by itself holds no real data. An **object** (also called an **instance**) is one real thing built from the plan, with its own values. You make as many objects from one class as you like.' },
    { t: 'analogy', text: 'The class `Member` is the blank passbook template at the printer. Each object is one passbook with a name written in it and a balance of its own. Writing in Amina’s passbook does not change Joel’s. Both books have the same shape, because they came from the same template, but each one keeps its own values.' },
    { t: 'h', text: 'Your first class' },
    { t: 'p', text: 'Here is a class with two **fields**. It goes **outside** `Main`, above it. `new Member()` builds a new object, and a variable can point to it. The **dot** reaches inside an object: `a.name` means “the name field of the object a”.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    String name;
    int balance;
}`,
        String.raw`        Member a = new Member();
        a.name = "Amina";
        a.balance = 50000;

        Member b = new Member();
        b.name = "Joel";
        b.balance = 20000;

        System.out.println(a.name + " has " + a.balance);
        System.out.println(b.name + " has " + b.balance);`,
      ),
      output: 'Amina has 50000\nJoel has 20000',
    },
    { t: 'h', text: 'Methods: what an object can do' },
    { t: 'p', text: 'A method inside a class works **on the object it is called on**. It can read and change that object’s fields by their plain names. Notice that these methods do **not** say `static`: they belong to the objects. Calling `a.deposit(5000)` changes only `a`, and `b` is untouched.' },
    {
      t: 'try',
      code: progC(
        MEMBER,
        String.raw`        Member a = new Member();
        a.name = "Amina";
        a.balance = 50000;
        a.deposit(5000);
        System.out.println(a.describe());

        Member b = new Member();
        b.name = "Joel";
        System.out.println(b.describe());`,
      ),
      output: 'Amina has 55000\nJoel has 0',
    },
    { t: 'p', text: 'Joel’s balance is 0 because nobody set it. **Fields get default values** when the object is made: `0` for numbers, `false` for booleans, and `null` for text and other objects, exactly like the boxes of a new array.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    String name;
    int balance;
    boolean active;
}`,
        String.raw`        Member m = new Member();
        System.out.println(m.name + " " + m.balance + " " + m.active);`,
      ),
      output: 'null 0 false',
    },
    { t: 'h', text: 'A variable holds a reference, not the object' },
    { t: 'p', text: 'This is the same surprise as with arrays. The variable `a` does not contain the passbook. It contains the **address** of the passbook, called a **reference**. Writing `Member c = a;` copies the address, so `c` and `a` now point to the **same** object. Predict what is printed.' },
    {
      t: 'predict',
      code: progC(
        String.raw`class Member {
    int balance;
}`,
        String.raw`        Member a = new Member();
        a.balance = 100;
        Member c = a;
        c.balance = 999;
        System.out.println(a.balance);`,
      ),
      question: 'What does this program print?',
      options: ['999', '100', '0', 'It is an error'],
      answer: 0,
      explain: '`Member c = a;` does not make a second passbook. It gives the same passbook a second name. So when c.balance becomes 999, a.balance shows 999 as well. To get two separate objects you must write `new` twice.',
    },
    {
      t: 'predict',
      code: progC(
        String.raw`class Member {
    int balance;
}`,
        String.raw`        Member x = new Member();
        Member y = new Member();
        Member z = x;
        System.out.println(x == y);
        System.out.println(x == z);`,
      ),
      question: 'What does this program print? For objects, `==` asks “is it the very same object?”.',
      options: ['false\ntrue', 'true\ntrue', 'false\nfalse', 'true\nfalse'],
      answer: 0,
      explain: 'x and y are two different objects, even though they look alike, so x == y is false. z is another name for the same object as x, so x == z is true. (Lesson 20 shows how to ask “do they hold the same data?”.)',
    },
    { t: 'h', text: 'null: a reference that points at nothing' },
    { t: 'p', text: 'A reference can also point to **nothing**. That is the special value `null`. It is what an object variable holds before you give it an object. You can store and compare `null`, but you must never use a dot on it: there is no object there, so the program stops with a **NullPointerException**.' },
    { t: 'h', text: 'Objects in an array' },
    { t: 'p', text: 'You can keep many objects in an array. **Careful:** `new Member[3]` makes three **empty slots**, all `null`. It does not make three members. You must build each object yourself, usually in a loop.' },
    {
      t: 'try',
      code: progC(
        MEMBER,
        String.raw`        Member[] members = new Member[3];
        String[] names = {"Amina", "Joel", "Mary"};
        for (int i = 0; i < members.length; i++) {
            members[i] = new Member();
            members[i].name = names[i];
            members[i].balance = (i + 1) * 10000;
        }
        int total = 0;
        for (Member m : members) {
            total += m.balance;
        }
        System.out.println("Total: " + total);
        System.out.println(members[1].describe());`,
      ),
      output: 'Total: 60000\nJoel has 20000',
    },
    { t: 'p', text: 'Because a method receives the **reference**, it can change the object the caller passed. This is the opposite of a plain `int` (lesson 9), and the same as an array (lesson 11).' },
    {
      t: 'try',
      code: progC(
        MEMBER,
        String.raw`        Member a = new Member();
        a.name = "Amina";
        a.balance = 1000;
        addBonus(a);
        System.out.println(a.describe());`,
        '',
        String.raw`    static void addBonus(Member m) {
        m.balance += 500;
    }`,
      ),
      output: 'Amina has 1500',
    },
    {
      t: 'fill',
      prompt: 'Choose the word that creates a new object, so the program prints **Amina**.',
      template: progC(
        String.raw`class Member {
    String name;
}`,
        String.raw`        Member m = ___ Member();
        m.name = "Amina";
        System.out.println(m.name);`,
      ),
      blanks: [{ options: ['new', 'create', 'make'], answer: 'new' }],
      output: 'Amina',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to define a class and use one object of it. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Member {',
        '    int balance;',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        Member m = new Member();',
        '        m.balance = 700;',
        '        System.out.println(m.balance);',
        '    }',
        '}',
      ],
      output: '700',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`class Member {
    String name;
}`,
        String.raw`        Member m = Member();
        m.name = "Amina";
        System.out.println(m.name);`,
      ),
      question: 'The compiler says “cannot find symbol: method Member()”. What is missing?',
      options: ['The word new: an object is made with new Member()', 'A semicolon after the class', 'The word static', 'The name must be in capitals'],
      answer: 0,
      explain: 'Without `new`, Java reads `Member()` as a call to a method called Member, and there is none. The word `new` is what builds an object from the class.',
      fixed: progC(
        String.raw`class Member {
    String name;
}`,
        String.raw`        Member m = new Member();
        m.name = "Amina";
        System.out.println(m.name);`,
      ),
    },
    {
      t: 'quiz',
      question: 'What is the difference between a class and an object?',
      options: ['A class is the plan, an object is one real thing built from it', 'They are the same thing', 'A class is a variable, an object is a method', 'An object is the plan, a class is one real thing'],
      answer: 0,
      explain: 'One class (the passbook template) can produce many objects (the individual passbooks), each with its own values.',
    },
    {
      t: 'quiz',
      question: 'What does `new Member[5]` create?',
      options: ['An array of 5 empty slots, all null', 'Five Member objects', 'One Member object', 'An error'],
      answer: 0,
      explain: 'It makes the array only. Each slot is null until you put a new Member() into it.',
    },
    {
      t: 'quiz',
      question: '`Member c = a;` where a is a Member. How many Member objects are there now?',
      options: ['One, with two names', 'Two, with the same data', 'Zero', 'It depends on the fields'],
      answer: 0,
      explain: 'The assignment copies the reference, not the object. Only `new` makes an object.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Member {
    int balance;

    void deposit(int amount) {
        balance += amount;
    }
}`,
            String.raw`        Member m = null;
        m.deposit(500);
        System.out.println("done");`,
          ),
          why: 'The variable m points at nothing (null), so there is no object to call deposit on. The program stops with a NullPointerException. Give it an object first: `Member m = new Member();`.',
          right: progC(
            String.raw`class Member {
    int balance;

    void deposit(int amount) {
        balance += amount;
    }
}`,
            String.raw`        Member m = new Member();
        m.deposit(500);
        System.out.println("done");`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    String name;
}`,
            String.raw`        Member[] members = new Member[2];
        members[0].name = "Amina";
        System.out.println(members[0].name);`,
          ),
          why: 'The array slots are all null. `members[0]` is null, so `.name` crashes with a NullPointerException. Build the object first: `members[0] = new Member();`.',
          right: progC(
            String.raw`class Member {
    String name;
}`,
            String.raw`        Member[] members = new Member[2];
        members[0] = new Member();
        members[0].name = "Amina";
        System.out.println(members[0].name);`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    int balance;
}`,
            String.raw`        Member m = new Member();
        m.age = 30;
        System.out.println(m.age);`,
          ),
          why: 'The class Member has no field called age, so the compiler cannot find the symbol. An object has exactly the fields its class declares. Add `int age;` to the class if members should have one.',
          right: progC(
            String.raw`class Member {
    int balance;
    int age;
}`,
            String.raw`        Member m = new Member();
        m.age = 30;
        System.out.println(m.age);`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    String name;
}`,
            String.raw`        Member a = new Member();
        a.name = "Amina";
        Member b = a;
        b.name = "Joel";
        System.out.println(a.name);`,
          ),
          why: 'The programmer thought b was a copy of Amina’s passbook. But `b = a` only gives the same object a second name, so renaming b renames a too, and the program prints Joel. For two members, write `new Member()` twice.',
          right: progC(
            String.raw`class Member {
    String name;
}`,
            String.raw`        Member a = new Member();
        a.name = "Amina";
        Member b = new Member();
        b.name = "Joel";
        System.out.println(a.name);`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A class is a blueprint with **fields** (data) and **methods** (actions). An object is one real thing built with `new`.',
        'Reach into an object with the dot: `a.name`, `a.deposit(500)`. Each object has its own copy of the fields.',
        'Fields start as 0, false or null. A variable holds a **reference**: `Member c = a;` copies the address, not the object.',
        '`==` on objects asks “same object?”. Using a dot on `null` stops the program with a NullPointerException.',
        '`new Member[3]` makes empty slots. Build each object yourself. A method can change the object it is given.',
      ],
      memory: 'Class is the template, object is the filled-in passbook.',
    },
  ],
  exercises: [
    {
      id: 'j16-member-card',
      title: 'The member card',
      prompt: 'The class `Member` has a name and a balance. Add a method `summary()` to it that **returns** the text `Name: Amina, Balance: 50000` (with the member’s own values). `main` already creates a member and prints the summary.',
      starter: progC(
        String.raw`class Member {
    String name;
    int balance;

    // Add the method summary() here
}`,
        String.raw`        Member m = new Member();
        m.name = "Amina";
        m.balance = 50000;
        System.out.println(m.summary());`,
      ),
      tests: [{ expected: 'Name: Amina, Balance: 50000' }],
      hints: [
        'A method that gives text back has the return type `String`. It does not say `static`.',
        'Inside the method you can use the fields `name` and `balance` by their plain names.',
        '`String summary() { return "Name: " + name + ", Balance: " + balance; }`',
      ],
    },
    {
      id: 'j16-loan',
      title: 'A loan',
      prompt: 'Complete the class `Loan`: the method `pay(int amount)` reduces the `remaining` amount, and the method `isCleared()` returns `true` when nothing remains (remaining is 0 or less). `main` reads the loan amount and two payments and prints `Remaining: 400` and `Cleared: false`.',
      starter: progC(
        String.raw`class Loan {
    int remaining;

    void pay(int amount) {
        // Reduce remaining by amount
    }

    boolean isCleared() {
        // Return true when remaining is 0 or less
        return false;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Loan loan = new Loan();
        loan.remaining = in.nextInt();
        loan.pay(in.nextInt());
        loan.pay(in.nextInt());
        System.out.println("Remaining: " + loan.remaining);
        System.out.println("Cleared: " + loan.isCleared());`,
        SCAN,
      ),
      sampleInput: '1000 400 200',
      usesInput: true,
      tests: [
        { input: '1000 400 200', expected: 'Remaining: 400\nCleared: false' },
        { input: '500 300 200', expected: 'Remaining: 0\nCleared: true' },
        { input: '300 300 100', expected: 'Remaining: -100\nCleared: true', hidden: true },
      ],
      hints: [
        '`pay` works on the object’s own field: write `remaining` with no dot.',
        '`remaining -= amount;` inside `pay`.',
        '`return remaining <= 0;` inside `isCleared`.',
      ],
    },
    {
      id: 'j16-items',
      title: 'The shop till',
      prompt: 'The class `Item` has a `price` and a `quantity`. Write the method `total()` that returns price times quantity. `main` reads how many items there are, then the price and quantity of each, and prints the sum of all the totals, for example `Total: 24000`.',
      starter: progC(
        String.raw`class Item {
    int price;
    int quantity;

    int total() {
        // Return price times quantity
        return 0;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
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
        System.out.println("Total: " + sum);`,
        SCAN,
      ),
      sampleInput: '2\n3500 4\n5000 2',
      usesInput: true,
      tests: [
        { input: '2\n3500 4\n5000 2', expected: 'Total: 24000' },
        { input: '1\n100 1', expected: 'Total: 100' },
        { input: '3\n10 1\n20 2\n30 3', expected: 'Total: 140', hidden: true },
      ],
      hints: [
        'The method uses the two fields of its own object.',
        '`return price * quantity;`',
        'The loop in main already creates every object with `new Item()`. You only have to finish `total()`.',
      ],
    },
    {
      id: 'j16-rectangle',
      title: 'A rectangle',
      prompt: 'Complete the class `Rectangle` with the methods `area()` and `isSquare()`. `main` reads the width and the height and prints `Area: 12` and `Square: false`.',
      starter: progC(
        String.raw`class Rectangle {
    int width;
    int height;

    int area() {
        // Return width times height
        return 0;
    }

    boolean isSquare() {
        // Return true when width equals height
        return false;
    }
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Rectangle r = new Rectangle();
        r.width = in.nextInt();
        r.height = in.nextInt();
        System.out.println("Area: " + r.area());
        System.out.println("Square: " + r.isSquare());`,
        SCAN,
      ),
      sampleInput: '3 4',
      usesInput: true,
      tests: [
        { input: '3 4', expected: 'Area: 12\nSquare: false' },
        { input: '5 5', expected: 'Area: 25\nSquare: true' },
        { input: '1 9', expected: 'Area: 9\nSquare: false', hidden: true },
      ],
      hints: [
        'Both methods use the two fields `width` and `height` of their own object.',
        '`return width * height;`',
        '`return width == height;`. Remember: two equals signs ask the question.',
      ],
    },
  ],
};
