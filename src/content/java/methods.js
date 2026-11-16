// Java, Level 2, lesson 9: Methods.
import { progM, imp } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const M = (methods, body) => progM(methods, body);
const MS = (methods, body) => progM(methods, body, SCAN);

export const methodsLesson = {
  id: 'j-methods',
  level: LEVEL,
  minutes: 32,
  title: 'Methods: your own tools',
  summary: 'Defining and calling methods, parameters, return values, void, scope, overloading and varargs',
  blocks: [
    {
      t: 'story',
      title: 'Mama Rose’s rule cards',
      text: 'Mama Rose has a drawer of small cards. One says **INTEREST**: “multiply the savings by the rate, divide by 100.” Another says **RECEIPT**: “write the member’s name, the amount and the date.” When a new member joins, she does not think the rules up again. She takes out the card, follows it with the numbers of the day, and puts it back.\n\nA **method** is a rule card in Java. You write the steps once, give them a **name**, and then **call** that name whenever you need the job done. You have already used other people’s methods: `println`, `nextInt`, `Math.sqrt`. Now you will write your own.',
    },
    { t: 'h', text: 'Writing and calling a method' },
    { t: 'p', text: 'A method goes **inside the class, outside `main`**. Its first line (the **header**) says what it is called and what it needs. For now, write the word `static` before every method; lesson 19 explains why. This method prints a receipt for a name and an amount. It is **called** twice from `main`, with different values.' },
    {
      t: 'try',
      code: M(
        String.raw`    static void printReceipt(String name, int amount) {
        System.out.println("Receipt: " + name + " paid " + amount);
    }`,
        String.raw`        printReceipt("Amina", 20000);
        printReceipt("Joel", 5000);`,
      ),
      output: 'Receipt: Amina paid 20000\nReceipt: Joel paid 5000',
    },
    { t: 'p', text: 'Read the header `static void printReceipt(String name, int amount)` from left to right:' },
    {
      t: 'list',
      items: [
        '`static`: write this for now.',
        '`void`: the **return type**. `void` means “this method gives nothing back”. It only does something.',
        '`printReceipt`: the **name**. Start with a small letter, use camelCase, and say what it does, usually with a verb.',
        '`(String name, int amount)`: the **parameters**: the empty envelopes the method needs filled. Each has a type and a name. The values you pass in a call, such as `"Amina"` and `20000`, are the **arguments**.',
      ],
    },
    { t: 'h', text: 'Methods that give an answer back' },
    { t: 'p', text: 'Instead of `void`, write the **type of the answer**, and finish the method with `return` and a value of that type. The call then **becomes** that value, so you can print it, store it in a variable, or use it in a calculation.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int square(int x) {
        return x * x;
    }

    static double interest(double savings, double ratePercent) {
        return savings * ratePercent / 100;
    }`,
        String.raw`        System.out.println(square(7));
        double i = interest(200000, 5);
        System.out.println("Interest: " + i);`,
      ),
      output: '49\nInterest: 10000.0',
    },
    { t: 'analogy', text: 'A method is like a mobile-money agent’s kiosk. You walk up with some arguments (a number and an amount), the agent does the work behind the counter without you seeing, and you walk away with an answer (a confirmation). You do not care **how** it was done, only **what** you give and **what** you get back.' },
    { t: 'p', text: 'A method that returns a `boolean` is perfect for a question. Notice that `return` ends the method at once, and that the call can sit right inside an `if`.' },
    {
      t: 'try',
      code: M(
        String.raw`    static boolean isEligible(int savings, int months) {
        return savings >= 100000 && months >= 6;
    }`,
        String.raw`        if (isEligible(150000, 8)) {
            System.out.println("Eligible");
        }
        if (!isEligible(50000, 12)) {
            System.out.println("Not eligible");
        }`,
      ),
      output: 'Eligible\nNot eligible',
    },
    {
      t: 'predict',
      code: M(
        String.raw`    static int twice(int x) {
        return x * 2;
    }`,
        String.raw`        System.out.println(twice(twice(3)));`,
      ),
      question: 'What does this program print?',
      options: ['12', '6', '9', '36'],
      answer: 0,
      explain: 'Java works from the inside out. twice(3) becomes 6, and then twice(6) becomes 12. A call is replaced by its answer, so calls can be nested.',
    },
    { t: 'h', text: 'Parameters are copies' },
    { t: 'p', text: 'When you call a method, Java **copies** each argument into the parameter. The method works on its own copy. Changing the parameter inside the method does **not** change the variable that the caller passed. Predict what is printed.' },
    {
      t: 'predict',
      code: M(
        String.raw`    static void addBonus(int amount) {
        amount = amount + 1000;
        System.out.println("Inside: " + amount);
    }`,
        String.raw`        int savings = 5000;
        addBonus(savings);
        System.out.println("Outside: " + savings);`,
      ),
      question: 'What does this program print?',
      options: ['Inside: 6000\nOutside: 5000', 'Inside: 6000\nOutside: 6000', 'Inside: 5000\nOutside: 5000', 'Inside: 5000\nOutside: 6000'],
      answer: 0,
      explain: 'The method received a copy of 5000. It added 1000 to its copy and printed 6000. The original variable `savings` in main was never touched, so it is still 5000. To get a changed value back, **return** it and store it: `savings = addBonus(savings);`.',
    },
    { t: 'h', text: 'Scope: each method has its own variables' },
    { t: 'p', text: 'A variable created inside a method (including its parameters) is **local**: it exists only while the method runs, and no other method can see it. That is a good thing: two methods can both use a variable called `total` without any confusion. If a method needs a value from `main`, `main` must **pass it as an argument**.' },
    { t: 'h', text: 'Overloading: one name, different parameters' },
    { t: 'p', text: 'Java lets several methods share a name, as long as their parameters differ in number or type. When you call it, Java picks the one that matches your arguments. This is called **overloading**. `System.out.println` itself is overloaded: it has a version for ints, for Strings, for doubles and more.' },
    {
      t: 'try',
      code: M(
        String.raw`    static int add(int a, int b) {
        return a + b;
    }

    static double add(double a, double b) {
        return a + b;
    }

    static int add(int a, int b, int c) {
        return a + b + c;
    }`,
        String.raw`        System.out.println(add(2, 3));
        System.out.println(add(2.5, 1.5));
        System.out.println(add(1, 2, 3));`,
      ),
      output: '5\n4.0\n6',
    },
    { t: 'h', text: 'Any number of arguments: varargs' },
    { t: 'p', text: 'Write `int... numbers` as the last parameter, and the method accepts **any number** of ints, including none. Inside the method, `numbers` behaves like a list that you can loop over (you will meet arrays properly in lesson 11).' },
    {
      t: 'try',
      code: M(
        String.raw`    static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }`,
        String.raw`        System.out.println(sum(1, 2, 3));
        System.out.println(sum());
        System.out.println(sum(10, 20));`,
      ),
      output: '6\n0\n30',
    },
    { t: 'h', text: 'Why bother? Small pieces are easy to get right' },
    { t: 'p', text: 'Methods turn a long program into short, named steps. Each method does **one job**, and you can test it on its own. Here is a grade program where the decision lives in a method and `main` only reads and prints.' },
    {
      t: 'project',
      title: 'Village SACCO, step 3: the receipt as a method',
      text: 'The deposit slip from step 1 becomes a method that returns the text of the slip, and `main` just reads the input and prints. The loan rule from lesson 6 becomes a method too.',
      stdin: 'Amina 1042 150000 8',
      code: MS(
        String.raw`    static String slip(String name, int number, int amount) {
        return "Member: " + name + " (No. " + number + ")\nDeposit: UGX " + amount;
    }

    static boolean canBorrow(int savings, int months) {
        return savings >= 100000 && months >= 6;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        String name = in.next();
        int number = in.nextInt();
        int amount = in.nextInt();
        int months = in.nextInt();
        System.out.println(slip(name, number, amount));
        System.out.println("Can borrow: " + canBorrow(amount, months));`,
      ),
      output: 'Member: Amina (No. 1042)\nDeposit: UGX 150000\nCan borrow: true',
    },
    {
      t: 'fill',
      prompt: 'Choose the return type of the method so that the program prints **36**.',
      template: M(
        String.raw`    static ___ square(int x) {
        return x * x;
    }`,
        String.raw`        System.out.println(square(6));`,
      ),
      blanks: [{ options: ['int', 'void', 'String'], answer: 'int' }],
      output: '36',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to define a method `twice` and call it from `main`. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        'public class Main {',
        '    static int twice(int x) {',
        '        return x * 2;',
        '    }',
        '    public static void main(String[] args) {',
        '        System.out.println(twice(21));',
        '    }',
        '}',
      ],
      output: '42',
    },
    {
      t: 'bug',
      code: M(
        String.raw`    static int twice(int x) {
        int y = x * 2;
    }`,
        String.raw`        System.out.println(twice(4));`,
      ),
      question: 'The compiler says “missing return statement”. What is wrong?',
      options: ['The method promises to give back an int, but never returns one', 'The parameter must be called y', 'main must come before twice', 'println cannot print an int'],
      answer: 0,
      explain: 'The header says the method returns an int, but the body only stores the value in y and then ends. Add `return y;` (or just `return x * 2;`).',
      fixed: M(
        String.raw`    static int twice(int x) {
        int y = x * 2;
        return y;
    }`,
        String.raw`        System.out.println(twice(4));`,
      ),
    },
    {
      t: 'quiz',
      question: 'What does the word `void` in a method header mean?',
      options: ['The method gives no value back', 'The method has no name', 'The method is private', 'The method may be called only once'],
      answer: 0,
      explain: 'void means “returns nothing”. A void method only does something, such as printing. To get an answer back, write a type such as int or String and use return.',
    },
    {
      t: 'quiz',
      question: 'In `printReceipt("Amina", 20000)`, what are `"Amina"` and `20000` called?',
      options: ['Arguments', 'Parameters', 'Return types', 'Labels'],
      answer: 0,
      explain: 'The values you pass in a call are arguments. The names in the method header, such as name and amount, are parameters.',
    },
    {
      t: 'quiz',
      question: 'What does `return` do?',
      options: ['Ends the method and hands a value back to the caller', 'Starts the program again', 'Prints the value', 'Creates a new variable in main'],
      answer: 0,
      explain: 'return stops the method on the spot and sends the value back. The call in the caller is replaced by that value. It does not print anything by itself.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: M(
            String.raw`    static int square(int x) {
        return x * x;
    }`,
            String.raw`        System.out.println(square("5"));`,
          ),
          why: 'The method needs an int, but the argument "5" in quotes is text. Java refuses to pass a String where an int is expected. Pass the number 5 without quotes.',
          right: M(
            String.raw`    static int square(int x) {
        return x * x;
    }`,
            String.raw`        System.out.println(square(5));`,
          ),
        },
        {
          wrong: M(
            String.raw`    static int addFee() {
        return total + 500;
    }`,
            String.raw`        int total = 3000;
        System.out.println(addFee());`,
          ),
          why: 'The variable `total` lives in main. The method addFee cannot see it, so Java cannot find the symbol. Pass the value in as a parameter: `static int addFee(int total)` and call `addFee(total)`.',
          right: M(
            String.raw`    static int addFee(int total) {
        return total + 500;
    }`,
            String.raw`        int total = 3000;
        System.out.println(addFee(total));`,
          ),
        },
        {
          wrong: `public class Main {
    void hello() {
        System.out.println("Hello");
    }

    public static void main(String[] args) {
        hello();
    }
}
`,
          why: 'Without the word `static`, hello belongs to an object, and main (which is static) cannot call it on its own. For now write `static` before every method.',
          right: `public class Main {
    static void hello() {
        System.out.println("Hello");
    }

    public static void main(String[] args) {
        hello();
    }
}
`,
        },
        {
          logic: true,
          wrong: M(
            String.raw`    static void addBonus(int amount) {
        amount = amount + 1000;
    }`,
            String.raw`        int savings = 5000;
        addBonus(savings);
        System.out.println(savings);`,
          ),
          why: 'This prints 5000, not 6000. The method changed its own copy and threw it away. To give the new value back, make the method return it and store the result: `savings = addBonus(savings);`.',
          right: M(
            String.raw`    static int addBonus(int amount) {
        return amount + 1000;
    }`,
            String.raw`        int savings = 5000;
        savings = addBonus(savings);
        System.out.println(savings);`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A method is a named, reusable block: `static returnType name(parameters) { ... }`. Call it by its name with arguments.',
        '`void` gives nothing back. Any other type must be finished with `return value;`, and the call becomes that value.',
        'Parameters are copies, and variables inside a method are local to it. Pass values in, return values out.',
        'Overloading: the same name with different parameters. Varargs: `int... numbers` accepts any number of ints.',
        'Give each method one job and a verb name. Small methods are easy to read, test and reuse.',
      ],
      memory: 'Name the rule card, hand it the numbers, take the answer.',
    },
  ],
  exercises: [
    {
      id: 'j9-max3',
      title: 'The largest of three',
      prompt: 'Complete the method `largest` so that it returns the biggest of three whole numbers. `main` reads three numbers and prints: `Largest: 9`',
      starter: MS(
        String.raw`    static int largest(int a, int b, int c) {
        // Return the biggest of a, b and c
        return 0;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        int c = in.nextInt();
        System.out.println("Largest: " + largest(a, b, c));`,
      ),
      sampleInput: '4 9 2',
      usesInput: true,
      tests: [
        { input: '4 9 2', expected: 'Largest: 9' },
        { input: '10 3 7', expected: 'Largest: 10' },
        { input: '1 2 3', expected: 'Largest: 3', hidden: true },
        { input: '5 5 5', expected: 'Largest: 5', hidden: true },
      ],
      hints: [
        'Start with the first number as the best so far, then compare it with the others.',
        '`int best = a; if (b > best) { best = b; } if (c > best) { best = c; }`',
        'Finish with `return best;`. (`Math.max(a, Math.max(b, c))` also works.)',
      ],
    },
    {
      id: 'j9-leap',
      title: 'Leap year',
      prompt: 'A year is a leap year if it is divisible by 4, except that years divisible by 100 are not, unless they are also divisible by 400. Complete the boolean method `isLeap`. `main` prints `Leap year` or `Not a leap year`.',
      starter: MS(
        String.raw`    static boolean isLeap(int year) {
        // Return true for a leap year
        return false;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int year = in.nextInt();
        if (isLeap(year)) {
            System.out.println("Leap year");
        } else {
            System.out.println("Not a leap year");
        }`,
      ),
      sampleInput: '2024',
      usesInput: true,
      tests: [
        { input: '2024', expected: 'Leap year' },
        { input: '2023', expected: 'Not a leap year' },
        { input: '1900', expected: 'Not a leap year' },
        { input: '2000', expected: 'Leap year' },
        { input: '2100', expected: 'Not a leap year', hidden: true },
        { input: '1996', expected: 'Leap year', hidden: true },
      ],
      hints: [
        'Use the remainder operator: `year % 4 == 0` tells you whether the year is divisible by 4.',
        'The rule in one expression: divisible by 4 AND (not divisible by 100 OR divisible by 400).',
        '`return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);`',
      ],
    },
    {
      id: 'j9-compound',
      title: 'Savings that grow',
      prompt: 'Complete the method `compound` that returns what a savings amount grows to after some years, when the interest rate in percent is added to the balance **every year**. `main` reads the amount, the rate and the years and prints, with two decimals: `Amount: 121000.00`',
      starter: MS(
        String.raw`    static double compound(double principal, double ratePercent, int years) {
        // Grow the balance once for every year
        return 0;
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        double principal = in.nextDouble();
        double rate = in.nextDouble();
        int years = in.nextInt();
        System.out.printf("Amount: %.2f%n", compound(principal, rate, years));`,
      ),
      sampleInput: '100000 10 2',
      usesInput: true,
      tests: [
        { input: '100000 10 2', expected: 'Amount: 121000.00' },
        { input: '50000 5 3', expected: 'Amount: 57881.25' },
        { input: '1000 0 5', expected: 'Amount: 1000.00', hidden: true },
        { input: '2000 10 1', expected: 'Amount: 2200.00', hidden: true },
      ],
      hints: [
        'Each year the balance grows by rate percent: new balance = balance + balance * rate / 100.',
        'Use a loop that runs `years` times and updates a variable `balance`, which starts as `principal`.',
        '`double balance = principal; for (int y = 1; y <= years; y++) { balance += balance * ratePercent / 100; } return balance;`',
      ],
    },
    {
      id: 'j9-grade-method',
      title: 'Grade as a method',
      prompt: 'Complete the method `gradeOf` that returns the grade letter for a mark: 80 or more is `A`, 70 or more `B`, 60 or more `C`, 50 or more `D`, otherwise `F`. `main` prints `Grade: B`.',
      starter: MS(
        String.raw`    static char gradeOf(int marks) {
        // Return 'A', 'B', 'C', 'D' or 'F'
        return 'F';
    }`,
        String.raw`        Scanner in = new Scanner(System.in);
        int marks = in.nextInt();
        System.out.println("Grade: " + gradeOf(marks));`,
      ),
      sampleInput: '72',
      usesInput: true,
      tests: [
        { input: '72', expected: 'Grade: B' },
        { input: '85', expected: 'Grade: A' },
        { input: '61', expected: 'Grade: C' },
        { input: '55', expected: 'Grade: D' },
        { input: '12', expected: 'Grade: F', hidden: true },
        { input: '80', expected: 'Grade: A', hidden: true },
        { input: '50', expected: 'Grade: D', hidden: true },
      ],
      hints: [
        'Ask from the highest mark down, as in lesson 6, but use `return` instead of println.',
        '`if (marks >= 80) { return \'A\'; }` and so on. A `return` ends the method, so you do not need `else`.',
        'After the four `if` statements, the last line is `return \'F\';`',
      ],
    },
    {
      id: 'j9-sum-varargs',
      title: 'Add any numbers',
      prompt: 'Complete the method `sum` so that it adds any number of whole numbers. The method `main` calls it three times and must print `6`, `0` and `15` on separate lines.',
      starter: M(
        String.raw`    static int sum(int... numbers) {
        // Add up every number
        return -1;
    }`,
        String.raw`        System.out.println(sum(1, 2, 3));
        System.out.println(sum());
        System.out.println(sum(5, 5, 5));`,
      ),
      tests: [{ expected: '6\n0\n15' }],
      hints: [
        'Inside the method, `numbers` can be used in a for-each loop: `for (int n : numbers)`.',
        'Keep a running total that starts at 0 before the loop, and add each `n` to it.',
        'Finish with `return total;`. With no arguments the loop does not run and the total stays 0.',
      ],
    },
  ],
};

