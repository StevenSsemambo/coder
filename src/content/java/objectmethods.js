// Java, Level 3, lesson 20: toString, equals and hashCode.
import { progC, imp } from './shared.js';

const LEVEL = 'Level 3: Object-oriented Java';
const SCAN = imp('java.util.Scanner');
const UTIL = imp('java.util.Objects', 'java.util.HashSet');
const SCAN_UTIL = imp('java.util.Scanner', 'java.util.HashSet');

export const objectMethodsLesson = {
  id: 'j-object',
  level: LEVEL,
  minutes: 32,
  title: 'toString, equals and hashCode',
  summary: 'Printing an object nicely, asking whether two objects are the same member, and the hashCode rule',
  blocks: [
    {
      t: 'story',
      title: 'Is it the same Amina?',
      text: 'The treasurer finds two passbook cards in the drawer, both for member number 1042. One was written in January, the other in March. “Are these the same member, or two different people?” she asks. She does not compare the **cards** (two pieces of paper are always two pieces of paper). She compares the **member number**, and says: “Same person.”\n\nJava objects have the same problem. When you print one, Java does not know how to show it. And when you ask whether two objects are “equal”, Java compares **which object it is**, not **what it holds**. Three methods that every Java class inherits fix this: `toString`, `equals` and `hashCode`. Every class automatically extends the class `Object`, which supplies plain versions of them, and you **override** them to say what makes sense for your class.',
    },
    { t: 'h', text: 'toString: how an object looks as text' },
    { t: 'p', text: 'When you print an object, or join it to text with `+`, Java calls its `toString()` method. The plain version inherited from `Object` prints the class name and a code, such as `Member@1b6d3586`, which is useless to a reader (and the code changes from run to run). Write your own `toString` to show the object properly.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    private String name;
    private int balance;

    Member(String name, int balance) {
        this.name = name;
        this.balance = balance;
    }

    @Override
    public String toString() {
        return name + " (" + balance + ")";
    }
}`,
        String.raw`        Member a = new Member("Amina", 50000);
        Member b = new Member("Joel", 20000);
        System.out.println(a);
        System.out.println("Members: " + a + " and " + b);
        Member[] list = {a, b};
        System.out.println(java.util.Arrays.toString(list));`,
      ),
      output: 'Amina (50000)\nMembers: Amina (50000) and Joel (20000)\n[Amina (50000), Joel (20000)]',
    },
    { t: 'p', text: 'Three details to copy exactly. The header is `public String toString()` with nothing between the brackets. It must be `public`, because the method it replaces in `Object` is public. And the line above it, **`@Override`**, tells Java “I mean to replace a method I inherited”. If you misspell the name, Java stops you instead of silently creating a different method.' },
    {
      t: 'predict',
      code: progC(
        String.raw`class Member {
    private String name;

    Member(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Member " + name;
    }
}`,
        String.raw`        Member m = new Member("Joel");
        System.out.println(m + "!");
        System.out.println(m.toString().length());`,
      ),
      question: 'What does this program print?',
      options: ['Member Joel!\n11', 'Member@1b6d3586!\n11', 'Joel!\n4', 'Member Joel\n11'],
      answer: 0,
      explain: 'Joining an object to text with + calls toString(), so the first line is “Member Joel!”. The text “Member Joel” has 6 + 1 + 4 = 11 characters.',
    },
    { t: 'h', text: 'equals: same object, or same contents?' },
    { t: 'p', text: 'You know that `==` between two objects asks “is it the very same object?”. The inherited `equals` method does the same. But for a member, two objects with the same member number **are** the same member. So we override `equals` to compare the **contents** that define identity.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    private final int number;
    private String name;

    Member(int number, String name) {
        this.number = number;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Member other)) {
            return false;
        }
        return number == other.number;
    }
}`,
        String.raw`        Member a = new Member(1042, "Amina");
        Member b = new Member(1042, "Amina N.");
        Member c = new Member(2000, "Joel");
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println(a.equals(c));
        System.out.println(a.equals(null));`,
      ),
      output: 'false\ntrue\nfalse\nfalse',
    },
    { t: 'p', text: 'Read the recipe, because every `equals` follows it: **(1)** if it is the same object, return `true`; **(2)** if the other thing is `null` or not a `Member`, return `false` (`o instanceof Member other` is false for `null`, and it also names the converted object `other`); **(3)** compare the fields that define identity. The parameter **must** be `Object`, so that the method truly overrides the inherited one.' },
    { t: 'analogy', text: 'Two bank cards for the same account are different pieces of plastic (`==` is false), but they open the same account (`equals` is true). The bank decides what “same” means: the account number. Your class must decide it too.' },
    { t: 'h', text: 'hashCode: the number that goes with equals' },
    { t: 'p', text: 'Collections such as `HashSet` and `HashMap` (lessons 29 and 30) find objects very quickly by first asking each one for a number, its **hash code**, and then use `equals` only among objects with the same number. This only works if a promise is kept, called the **hashCode contract**:' },
    { t: 'list', items: ['**If two objects are `equals`, they must have the same `hashCode()`.**', 'If you override `equals`, you must override `hashCode` too, using the **same fields**.', 'Objects that are not equal may share a hash code, but it is better if they do not.'] },
    { t: 'p', text: '`Objects.hash(...)` builds a good hash code from the fields you give it, and `Objects.equals(a, b)` compares two values safely, even when one is `null`. Now the member works inside a `HashSet`, a collection that keeps **no duplicates**.' },
    {
      t: 'try',
      code: progC(
        String.raw`class Member {
    private final int number;
    private String name;

    Member(int number, String name) {
        this.number = number;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Member other)) {
            return false;
        }
        return number == other.number;
    }

    @Override
    public int hashCode() {
        return Objects.hash(number);
    }
}`,
        String.raw`        HashSet<Member> set = new HashSet<>();
        set.add(new Member(1042, "Amina"));
        set.add(new Member(1042, "Amina N."));
        set.add(new Member(2000, "Joel"));
        System.out.println(set.size());
        System.out.println(set.contains(new Member(2000, "anyone")));`,
        UTIL,
      ),
      output: '2\ntrue',
    },
    {
      t: 'predict',
      code: progC(
        String.raw`class Point {
    final int x;
    final int y;

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
}`,
        String.raw`        HashSet<Point> set = new HashSet<>();
        set.add(new Point(1, 2));
        set.add(new Point(1, 2));
        set.add(new Point(2, 1));
        System.out.println(set.size());`,
        UTIL,
      ),
      question: 'What does this program print?',
      options: ['2', '3', '1', '0'],
      answer: 0,
      explain: 'The first two points are equal (same x and same y), so the set keeps only one of them. (2, 1) has the same numbers in a different order, so it is a different point. That makes 2 points.',
    },
    { t: 'tip', text: 'Writing these by hand is repetitive, and one slip is a bug. Good news: lesson 26 shows **records**, which write `toString`, `equals` and `hashCode` for you. Even so, you must understand what they do, because most Java code you will read overrides them by hand.' },
    {
      t: 'fill',
      prompt: 'Choose the correct return type of `toString`, so that the program prints **Member Amina**.',
      template: progC(
        String.raw`class Member {
    @Override
    public ___ toString() {
        return "Member Amina";
    }
}`,
        String.raw`        System.out.println(new Member());`,
      ),
      blanks: [{ options: ['String', 'void', 'int'], answer: 'String' }],
      output: 'Member Amina',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to give a class a `toString` and print an object. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'class Pet {',
        '    @Override',
        '    public String toString() {',
        '        return "a pet";',
        '    }',
        '}',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        System.out.println(new Pet());',
        '    }',
        '}',
      ],
      output: 'a pet',
    },
    {
      t: 'bug',
      code: progC(
        String.raw`class Member {
    @Override
    public String tostring() {
        return "Member";
    }
}`,
        String.raw`        System.out.println(new Member());`,
      ),
      question: 'The compiler says “method does not override or implement a method from a supertype”. What is the mistake?',
      options: ['The name is toString with a capital S. tostring replaces nothing', 'The method must be static', 'The class needs a constructor', 'println cannot print objects'],
      answer: 0,
      explain: 'Java is case sensitive, and `tostring` is not the inherited `toString`. Thanks to @Override, Java told you at once. Without @Override this would compile, and the output would be the ugly default.',
      fixed: progC(
        String.raw`class Member {
    @Override
    public String toString() {
        return "Member";
    }
}`,
        String.raw`        System.out.println(new Member());`,
      ),
    },
    {
      t: 'quiz',
      question: 'When does Java call `toString()` for you?',
      options: ['When you print an object, or join it to text with +', 'Only when you write .toString() yourself', 'When the object is created', 'When the program ends'],
      answer: 0,
      explain: 'println(obj) and "text" + obj both turn the object into text by calling its toString().',
    },
    {
      t: 'quiz',
      question: 'Which parameter type must `equals` have, to override the inherited method?',
      options: ['Object', 'The class itself, such as Member', 'String', 'Any type you like'],
      answer: 0,
      explain: 'The inherited method is equals(Object o). A method equals(Member m) is a different method (an overload) and does not replace it, and HashSet would still use the old one.',
    },
    {
      t: 'quiz',
      question: 'You override `equals` in a class. What else must you override?',
      options: ['hashCode, using the same fields', 'toString only', 'Nothing', 'The constructor'],
      answer: 0,
      explain: 'Equal objects must have equal hash codes, or HashSet and HashMap will fail to find them. Always override the two together.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: progC(
            String.raw`class Member {
    String toString() {
        return "Member";
    }
}`,
            String.raw`        System.out.println(new Member());`,
          ),
          why: 'The method in Object is public, and a replacement may not be less visible. Without `public`, the method has the default (package) access, so Java refuses. Write `public String toString()`.',
          right: progC(
            String.raw`class Member {
    @Override
    public String toString() {
        return "Member";
    }
}`,
            String.raw`        System.out.println(new Member());`,
          ),
        },
        {
          wrong: progC(
            String.raw`class Member {
    int number;

    @Override
    public boolean equals(Member other) {
        return number == other.number;
    }
}`,
            String.raw`        System.out.println(new Member().equals(new Member()));`,
          ),
          why: 'The parameter is `Member`, but the inherited method takes `Object`, so this does not override it, and @Override reports the mistake. Use `equals(Object o)` and convert inside, as in the recipe.',
          right: progC(
            String.raw`class Member {
    int number;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Member other)) {
            return false;
        }
        return number == other.number;
    }
}`,
            String.raw`        System.out.println(new Member().equals(new Member()));`,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    private final String name;

    Member(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Member other)) {
            return false;
        }
        return name == other.name;
    }
}`,
            String.raw`        Scanner in = new Scanner(System.in);
        Member a = new Member(in.next());
        Member b = new Member(in.next());
        System.out.println(a.equals(b));`,
            SCAN,
          ),
          why: 'The two names were typed by the user, so they are two different String objects, and `==` between Strings asks whether they are the same object. This prints false for Amina and Amina. Compare Strings with `equals`: `name.equals(other.name)`, or `Objects.equals(name, other.name)`.',
          stdin: 'Amina Amina',
          right: progC(
            String.raw`class Member {
    private final String name;

    Member(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Member other)) {
            return false;
        }
        return name.equals(other.name);
    }
}`,
            String.raw`        Scanner in = new Scanner(System.in);
        Member a = new Member(in.next());
        Member b = new Member(in.next());
        System.out.println(a.equals(b));`,
            SCAN,
          ),
        },
        {
          logic: true,
          wrong: progC(
            String.raw`class Member {
    private final int number;

    Member(int number) {
        this.number = number;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Member other && number == other.number;
    }
}`,
            String.raw`        HashSet<Member> set = new HashSet<>();
        set.add(new Member(1));
        set.add(new Member(1));
        System.out.println(set.size());`,
            imp('java.util.HashSet'),
          ),
          why: 'The class overrides `equals` but not `hashCode`, so the two equal members get different hash codes, and the HashSet may keep both: it can print 2 where you expect 1, and the result can even change from run to run. Whenever you override equals, override hashCode with the same fields: `return Objects.hash(number);`.',
          right: progC(
            String.raw`class Member {
    private final int number;

    Member(int number) {
        this.number = number;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Member other && number == other.number;
    }

    @Override
    public int hashCode() {
        return Objects.hash(number);
    }
}`,
            String.raw`        HashSet<Member> set = new HashSet<>();
        set.add(new Member(1));
        set.add(new Member(1));
        System.out.println(set.size());`,
            UTIL,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'Every class extends `Object`, which gives it `toString`, `equals` and `hashCode`. You override them to say what makes sense.',
        '`public String toString()` is called when you print or join an object. Always mark overrides with `@Override`.',
        '`==` asks “same object?”. Override `public boolean equals(Object o)` to compare the fields that define identity: same object, then null or wrong type, then the fields.',
        'If you override `equals`, override `hashCode` with the same fields (`Objects.hash(...)`). Equal objects must have equal hash codes.',
        'Compare String fields with `equals`, never with `==`.',
      ],
      memory: 'Show it with toString, compare it with equals, and file it with hashCode.',
    },
  ],
  exercises: [
    {
      id: 'j20-book',
      title: 'Describe the book',
      prompt: 'Write `toString` for `Book` so that printing a book gives `Matilda by Dahl (240 pages)`. `main` reads the title, the author and the pages, and prints the book.',
      starter: progC(
        String.raw`class Book {
    private final String title;
    private final String author;
    private final int pages;

    Book(String title, String author, int pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    // Write toString here
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Book book = new Book(in.next(), in.next(), in.nextInt());
        System.out.println(book);`,
        SCAN,
      ),
      sampleInput: 'Matilda Dahl 240',
      usesInput: true,
      tests: [
        { input: 'Matilda Dahl 240', expected: 'Matilda by Dahl (240 pages)' },
        { input: 'Emma Austen 1', expected: 'Emma by Austen (1 pages)' },
        { input: 'Hamlet Shakespeare 342', expected: 'Hamlet by Shakespeare (342 pages)', hidden: true },
      ],
      hints: [
        'Write `@Override` and then `public String toString()`.',
        'Join the pieces with `+`: the title, the text " by ", the author, and so on.',
        '`return title + " by " + author + " (" + pages + " pages)";`',
      ],
    },
    {
      id: 'j20-point',
      title: 'Same point?',
      prompt: 'Override `equals` and `hashCode` in `Point` (two points are equal when both coordinates are equal). `main` reads `x1 y1 x2 y2`, prints `Same` or `Different`, and then how many points a `HashSet` keeps when both are added: `Set size: 1` or `Set size: 2`.',
      starter: progC(
        String.raw`class Point {
    private final int x;
    private final int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Write equals and hashCode here
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Point a = new Point(in.nextInt(), in.nextInt());
        Point b = new Point(in.nextInt(), in.nextInt());
        System.out.println(a.equals(b) ? "Same" : "Different");
        HashSet<Point> set = new HashSet<>();
        set.add(a);
        set.add(b);
        System.out.println("Set size: " + set.size());`,
        imp('java.util.Scanner', 'java.util.HashSet', 'java.util.Objects'),
      ),
      sampleInput: '1 2 1 2',
      usesInput: true,
      tests: [
        { input: '1 2 1 2', expected: 'Same\nSet size: 1' },
        { input: '1 2 2 1', expected: 'Different\nSet size: 2' },
        { input: '0 0 0 0', expected: 'Same\nSet size: 1', hidden: true },
        { input: '5 6 5 7', expected: 'Different\nSet size: 2', hidden: true },
      ],
      hints: [
        'Follow the recipe: same object, then not a Point, then compare both x and y.',
        '`if (!(o instanceof Point p)) { return false; } return x == p.x && y == p.y;`',
        'For `hashCode` use the same two fields: `return Objects.hash(x, y);`',
      ],
    },
    {
      id: 'j20-members',
      title: 'Distinct members',
      prompt: 'Members are identified by their number. Override `equals` and `hashCode` in `Member` so two members with the same number are the same member. `main` reads how many registrations there are, then `number name` for each, and prints how many **distinct** members exist: `Distinct members: 2`.',
      starter: progC(
        String.raw`class Member {
    private final int number;
    private final String name;

    Member(int number, String name) {
        this.number = number;
        this.name = name;
    }

    // Write equals and hashCode. Only the number identifies a member
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        HashSet<Member> members = new HashSet<>();
        for (int i = 0; i < n; i++) {
            members.add(new Member(in.nextInt(), in.next()));
        }
        System.out.println("Distinct members: " + members.size());`,
        imp('java.util.Scanner', 'java.util.HashSet', 'java.util.Objects'),
      ),
      sampleInput: '4\n1042 Amina\n2000 Joel\n1042 Amina\n3000 Mary',
      usesInput: true,
      tests: [
        { input: '4\n1042 Amina\n2000 Joel\n1042 Amina\n3000 Mary', expected: 'Distinct members: 3' },
        { input: '3\n1 A\n1 B\n1 C', expected: 'Distinct members: 1' },
        { input: '2\n1 A\n2 A', expected: 'Distinct members: 2', hidden: true },
      ],
      hints: [
        'Only `number` decides who is the same member, so `equals` and `hashCode` use only `number`.',
        '`equals`: `return o instanceof Member other && number == other.number;`',
        '`hashCode`: `return Objects.hash(number);` or `Integer.hashCode(number)`.',
      ],
    },
    {
      id: 'j20-money',
      title: 'Money that prints and compares',
      prompt: 'Complete `Money`. `toString()` gives the currency, a space and the amount with thousands commas: `UGX 1,250,000`. `equals` is true when both the amount and the currency are equal. `main` reads two amounts with their currencies, prints both, and then `Equal: true` or `Equal: false`.',
      starter: progC(
        String.raw`class Money {
    private final int amount;
    private final String currency;

    Money(int amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    // Write toString and equals here
}`,
        String.raw`        Scanner in = new Scanner(System.in);
        Money a = new Money(in.nextInt(), in.next());
        Money b = new Money(in.nextInt(), in.next());
        System.out.println(a);
        System.out.println(b);
        System.out.println("Equal: " + a.equals(b));`,
        SCAN,
      ),
      sampleInput: '1250000 UGX 1250000 UGX',
      usesInput: true,
      tests: [
        { input: '1250000 UGX 1250000 UGX', expected: 'UGX 1,250,000\nUGX 1,250,000\nEqual: true' },
        { input: '500 UGX 500 USD', expected: 'UGX 500\nUSD 500\nEqual: false' },
        { input: '1000 KES 2000 KES', expected: 'KES 1,000\nKES 2,000\nEqual: false', hidden: true },
      ],
      hints: [
        '`String.format("%,d", amount)` puts the thousands commas in. Join the currency, a space and that text.',
        'In `equals`, compare the amounts with `==` and the currencies with `currency.equals(other.currency)`.',
        '`return o instanceof Money other && amount == other.amount && currency.equals(other.currency);`',
      ],
    },
  ],
};
