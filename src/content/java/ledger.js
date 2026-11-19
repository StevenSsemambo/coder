// Java, Level 2, lesson 15: Project, the Village SACCO ledger.
import { prog, progM, imp } from './shared.js';
import { ledgerProgram, row } from './ledger-program.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const MS = (methods, body) => progM(methods, body, SCAN);

const SESSION = `JOIN Amina 50000
JOIN Joel 20000
DEPOSIT Amina 20000
WITHDRAW Joel 30000
WITHDRAW Joel 5000
BALANCE amina
DEPOSIT Mary 1000
JOIN Amina 1
FOO
REPORT
QUIT`;

const SESSION_OUTPUT = [
  'Welcome, Amina (balance 50000)',
  'Welcome, Joel (balance 20000)',
  'Deposited 20000. New balance: 70000',
  'Insufficient funds. Balance: 20000',
  'Withdrew 5000. New balance: 15000',
  'Amina: 70000',
  'No such member: Mary',
  'Member already exists: Amina',
  'Unknown command: FOO',
  '=== SACCO REPORT ===',
  row('Amina', 70000),
  row('Joel', 15000),
  'Members: 2',
  'Total: 85000',
  'Top saver: Amina',
  'Goodbye',
].join('\n');

export const ledgerLesson = {
  id: 'j-ledger',
  level: LEVEL,
  minutes: 45,
  title: 'Project: the SACCO ledger',
  summary: 'Put loops, methods, arrays, strings and decisions together in one command-driven program',
  blocks: [
    {
      t: 'story',
      title: 'The ledger goes digital',
      text: 'The Village SACCO committee has had enough of the paper notebook. They want a program that works like this: the treasurer types **commands**, one after another, and the program answers each one.\n\n“JOIN Amina 50000” adds a new member. “DEPOSIT Amina 20000” puts money in. “WITHDRAW”, “BALANCE”, “REPORT”… and finally “QUIT”. Mama Rose says: “If it can refuse a withdrawal when the money is not there, and tell me who saves the most, I will trust it.”\n\nThis is the first **real program** of the course. Nothing in it is new: it uses every idea from this level, and the way they fit together is the lesson.',
    },
    { t: 'h', text: 'What the program must do' },
    {
      t: 'list',
      items: [
        '`JOIN name balance`: add a member with a starting balance. Refuse a name that already exists, or when the SACCO already has 10 members.',
        '`DEPOSIT name amount` and `WITHDRAW name amount`: change a balance. Refuse an unknown member, an amount that is not positive, and a withdrawal bigger than the balance.',
        '`BALANCE name`: show one member’s balance.',
        '`REPORT`: show every member, the number of members, the total, and the top saver.',
        '`QUIT`: say goodbye and stop. Anything else: “Unknown command”. Names are matched ignoring capital letters.',
      ],
    },
    { t: 'h', text: 'Step 1: how do we store the members?' },
    { t: 'p', text: 'We need a name and a balance for each member. With what we know, the tool is **two arrays that run side by side**: `names[i]` and `balances[i]` both describe member number `i`. A separate variable `count` says how many places are really used. We make room for 10 members, so the arrays have size 10, and the members are always the first `count` places.' },
    { t: 'tip', text: 'Two parallel arrays work, but they are fragile: nothing tells Java that `names[3]` and `balances[3]` belong together, and one slip separates them. In Level 3 you will meet **classes**, which let one `Member` object carry its own name and balance. Then we will rewrite this program properly. Feeling this pain now is how you will understand why classes exist.' },
    { t: 'h', text: 'Step 2: finding a member' },
    { t: 'p', text: 'Almost every command starts with “find this member”. So we write that job **once**, as a method, with the linear search from lesson 12. It returns the index, or -1 when the name is not there. We compare with `equalsIgnoreCase` so that `amina` finds `Amina`.' },
    {
      t: 'try',
      code: MS(
        String.raw`    static int findMember(String[] names, int count, String name) {
        for (int i = 0; i < count; i++) {
            if (names[i].equalsIgnoreCase(name)) {
                return i;
            }
        }
        return -1;
    }`,
        String.raw`        String[] names = {"Amina", "Joel", "Mary", null, null};
        System.out.println(findMember(names, 3, "joel"));
        System.out.println(findMember(names, 3, "Peter"));`,
      ),
      output: '1\n-1',
    },
    { t: 'p', text: 'Notice that the search stops at `count`, not at `names.length`. The places after `count` are still `null`, and calling `equalsIgnoreCase` on `null` would crash the program.' },
    { t: 'h', text: 'Step 3: the command loop' },
    { t: 'p', text: 'The program must keep reading commands until `QUIT` (or until the input runs out). `in.hasNext()` is true while there is another word to read, so it makes a perfect loop condition. Inside the loop, read the command word, make it capital letters, and use a `switch` to choose what to do. Try it with the input `hello foo quit`.' },
    {
      t: 'try',
      stdin: 'hello foo quit',
      code: prog(String.raw`        Scanner in = new Scanner(System.in);
        while (in.hasNext()) {
            String command = in.next().toUpperCase();
            switch (command) {
                case "HELLO" -> System.out.println("Hi!");
                case "QUIT" -> {
                    System.out.println("Bye");
                    return;
                }
                default -> System.out.println("Unknown command: " + command);
            }
        }`, SCAN),
      output: 'Hi!\nUnknown command: FOO\nBye',
    },
    { t: 'p', text: 'Here `return;` inside `main` ends the whole program, as a `return` ends any method.' },
    { t: 'h', text: 'Step 4: the whole ledger' },
    { t: 'p', text: 'Here is the complete program. Read it slowly, command by command: you know every line. Notice how the **order of the `if` / `else if` checks** matters: a deposit to an unknown member is refused before the amount is even looked at. The input below is a whole working day. Press **Run**, then change the commands and try to break it.' },
    {
      t: 'project',
      title: 'Village SACCO, step 4: the ledger',
      text: 'The treasurer’s whole day, from the first member joining to the end-of-day report. The output has three kinds of line: confirmations, refusals and the report.',
      stdin: SESSION,
      code: ledgerProgram(),
      output: SESSION_OUTPUT,
    },
    {
      t: 'predict',
      stdin: 'JOIN Amina 100\nWITHDRAW Amina 150\nDEPOSIT Amina 50\nBALANCE Amina\nQUIT',
      code: ledgerProgram(),
      question: 'The input is: JOIN Amina 100, WITHDRAW Amina 150, DEPOSIT Amina 50, BALANCE Amina, QUIT. What does the program print?',
      options: [
        'Welcome, Amina (balance 100)\nInsufficient funds. Balance: 100\nDeposited 50. New balance: 150\nAmina: 150\nGoodbye',
        'Welcome, Amina (balance 100)\nWithdrew 150. New balance: -50\nDeposited 50. New balance: 0\nAmina: 0\nGoodbye',
        'Welcome, Amina (balance 100)\nInsufficient funds. Balance: 100\nDeposited 50. New balance: 50\nAmina: 50\nGoodbye',
        'Welcome, Amina (balance 100)\nDeposited 50. New balance: 150\nAmina: 150\nGoodbye',
      ],
      answer: 0,
      explain: 'The withdrawal of 150 is refused, because it is more than the balance of 100, and the balance stays 100. Then the deposit of 50 brings it to 150, and BALANCE shows 150.',
    },
    { t: 'h', text: 'Reading the design' },
    {
      t: 'list',
      items: [
        '**Two kinds of reuse.** `findMember` and `report` are methods because several commands need them. `DEPOSIT` and `WITHDRAW` share one case, because their first checks are the same.',
        '**Guard first, act last.** Every command checks everything that can go wrong (`i < 0`, `amount <= 0`, not enough money) and does the real work only at the end. This is called a **guard clause** style and it makes a program safe.',
        '**Why `count` is not a method parameter that changes.** A method cannot change the caller’s `int` (lesson 9), so `JOIN` is handled in `main`, where `count` lives.',
        '**Limits you can feel:** 10 members at most, balances only in whole shillings, nothing saved after the program ends, and two arrays that must stay in step. Every one of these is fixed later in the course.',
      ],
    },
    {
      t: 'bug',
      code: prog(String.raw`        int[] balances = new int[10];
        System.out.println(balances.length());`),
      question: 'This line of the ledger does not compile: “cannot find symbol: method length()”. What is the mistake?',
      options: ['An array’s length has no brackets: balances.length', 'The array must be filled first', 'length() belongs only to numbers', 'balances must be a String'],
      answer: 0,
      explain: 'For an array it is `balances.length`, with no brackets. (Strings are the ones with `length()`.) This is the check behind “SACCO is full”: `count == names.length`.',
      fixed: prog(String.raw`        int[] balances = new int[10];
        System.out.println(balances.length);`),
    },
    {
      t: 'quiz',
      question: 'Why does `findMember` loop up to `count` and not up to `names.length`?',
      options: ['The places after count are still null, and using them would crash the program', 'names.length is always 0', 'count is faster to type', 'Java does not allow names.length in a loop'],
      answer: 0,
      explain: 'The array has room for 10 members, but only the first count places hold real names. The rest are null, and calling a method on null stops the program.',
    },
    {
      t: 'quiz',
      question: 'What is the weakness of keeping `names[i]` and `balances[i]` in two separate arrays?',
      options: ['Nothing links them: a slip in one array silently separates a name from its balance', 'Arrays cannot hold both Strings and ints', 'They use too much memory', 'Java forbids two arrays of the same size'],
      answer: 0,
      explain: 'Parallel arrays rely on the programmer keeping them in step. A class that bundles the name and the balance into one object removes the danger. That is what Level 3 is about.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: MS(
            String.raw`    static int findMember(String[] names, int count, String name) {
        for (int i = 0; i < count; i++) {
            if (names[i].equalsIgnoreCase(name)) {
                return i;
            }
        }
        return -1;
    }`,
            String.raw`        String[] names = {"Amina", "Joel"};
        int[] balances = {100, 200};
        Scanner in = new Scanner(System.in);
        int i = findMember(names, 2, in.next());
        balances[i] += 50;
        System.out.println(balances[i]);`,
          ),
          why: 'The member “Peter” does not exist, so findMember returns -1, and `balances[-1]` stops the program with an ArrayIndexOutOfBoundsException. Always check `if (i < 0)` **before** using the index. That is why the real program refuses unknown members first.',
          stdin: 'Peter',
          right: MS(
            String.raw`    static int findMember(String[] names, int count, String name) {
        for (int i = 0; i < count; i++) {
            if (names[i].equalsIgnoreCase(name)) {
                return i;
            }
        }
        return -1;
    }`,
            String.raw`        String[] names = {"Amina", "Joel"};
        int[] balances = {100, 200};
        Scanner in = new Scanner(System.in);
        int i = findMember(names, 2, in.next());
        if (i < 0) {
            System.out.println("No such member");
        } else {
            balances[i] += 50;
            System.out.println(balances[i]);
        }`,
          ),
        },
        {
          logic: true,
          wrong: MS(
            String.raw`    static int findMember(String[] names, int count, String name) {
        for (int i = 0; i < count; i++) {
            if (names[i] == name) {
                return i;
            }
        }
        return -1;
    }`,
            String.raw`        String[] names = {"Amina", "Joel"};
        Scanner in = new Scanner(System.in);
        System.out.println(findMember(names, 2, in.next()));`,
          ),
          why: 'The word typed by the user is a new String object, so `==` is never true, and every member “does not exist”: this prints -1 for Joel. Compare text with `equals` or `equalsIgnoreCase`, as in lesson 6.',
          stdin: 'Joel',
          right: MS(
            String.raw`    static int findMember(String[] names, int count, String name) {
        for (int i = 0; i < count; i++) {
            if (names[i].equalsIgnoreCase(name)) {
                return i;
            }
        }
        return -1;
    }`,
            String.raw`        String[] names = {"Amina", "Joel"};
        Scanner in = new Scanner(System.in);
        System.out.println(findMember(names, 2, in.next()));`,
          ),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A program is a set of small, named pieces: methods for repeated jobs, arrays for the data, a loop and a switch for the commands.',
        'Parallel arrays plus a `count` store a list of records. They work, but they are fragile, which is the reason for classes.',
        'Guard first, act last: check everything that can go wrong before changing anything. Check `-1` before using an index.',
        'Read until the input ends with `while (in.hasNext())`. A method cannot change the caller’s `int`, so `count` stays in `main`.',
        'You now know enough Java to write real, useful console programs. Level 3 teaches you to organise them with objects.',
      ],
      memory: 'Find, check, then change.',
    },
  ],
  exercises: [
    {
      id: 'j15-interest',
      title: 'Add the yearly interest',
      prompt: 'Add a new command `INTEREST rate` to the ledger. It adds `rate` percent to **every** member’s balance (use whole-shilling integer arithmetic: `balance * rate / 100`) and prints `Interest applied at 10%` (with the rate that was typed). The starter reads the rate and prints the message. You must update the balances.',
      starter: ledgerProgram({
        extraCases: String.raw`                case "INTEREST" -> {
                    int rate = in.nextInt();
                    // TODO: add rate percent to the balance of every member
                    System.out.println("Interest applied at " + rate + "%");
                }`,
      }),
      sampleInput: 'JOIN Amina 1000\nJOIN Joel 550\nINTEREST 10\nREPORT\nQUIT',
      usesInput: true,
      tests: [
        {
          input: 'JOIN Amina 1000\nJOIN Joel 550\nINTEREST 10\nREPORT\nQUIT',
          expected: ['Welcome, Amina (balance 1000)', 'Welcome, Joel (balance 550)', 'Interest applied at 10%', '=== SACCO REPORT ===', row('Amina', 1100), row('Joel', 605), 'Members: 2', 'Total: 1705', 'Top saver: Amina', 'Goodbye'].join('\n'),
        },
        {
          input: 'JOIN Mary 200\nINTEREST 50\nBALANCE Mary\nQUIT',
          expected: 'Welcome, Mary (balance 200)\nInterest applied at 50%\nMary: 300\nGoodbye',
        },
        {
          input: 'INTEREST 5\nREPORT\nQUIT',
          expected: ['Interest applied at 5%', '=== SACCO REPORT ===', 'Members: 0', 'Total: 0', 'Goodbye'].join('\n'),
          hidden: true,
        },
      ],
      hints: [
        'Inside the `INTEREST` case you can see the arrays `balances` and the variable `count`. Loop over the members: `for (int i = 0; i < count; i++)`.',
        'The new balance is the old balance plus the interest: `balances[i] += balances[i] * rate / 100;`',
        'Put the loop where the TODO comment is. Do not loop up to `names.length`, only up to `count`.',
      ],
    },
    {
      id: 'j15-transfer',
      title: 'Transfer between members',
      prompt: 'Add a command `TRANSFER from to amount` that moves money from one member to another. Print `Transferred 500 from Amina to Joel` when it works. Refuse with `No such member: X` if either name is unknown (check `from` first, then `to`), and with `Insufficient funds. Balance: N` if `from` has less than the amount (N is the balance of `from`). The starter only reads the three words.',
      starter: ledgerProgram({
        extraCases: String.raw`                case "TRANSFER" -> {
                    String from = in.next();
                    String to = in.next();
                    int amount = in.nextInt();
                    // TODO: find both members, check them, and move the money
                }`,
      }),
      sampleInput: 'JOIN Amina 1000\nJOIN Joel 200\nTRANSFER Amina Joel 500\nREPORT\nQUIT',
      usesInput: true,
      tests: [
        {
          input: 'JOIN Amina 1000\nJOIN Joel 200\nTRANSFER Amina Joel 500\nREPORT\nQUIT',
          expected: ['Welcome, Amina (balance 1000)', 'Welcome, Joel (balance 200)', 'Transferred 500 from Amina to Joel', '=== SACCO REPORT ===', row('Amina', 500), row('Joel', 700), 'Members: 2', 'Total: 1200', 'Top saver: Joel', 'Goodbye'].join('\n'),
        },
        {
          input: 'JOIN Amina 100\nJOIN Joel 200\nTRANSFER Amina Joel 500\nBALANCE Amina\nQUIT',
          expected: 'Welcome, Amina (balance 100)\nWelcome, Joel (balance 200)\nInsufficient funds. Balance: 100\nAmina: 100\nGoodbye',
        },
        {
          input: 'JOIN Amina 100\nTRANSFER Amina Peter 50\nTRANSFER Zed Amina 50\nQUIT',
          expected: 'Welcome, Amina (balance 100)\nNo such member: Peter\nNo such member: Zed\nGoodbye',
          hidden: true,
        },
      ],
      hints: [
        'Find both members first: `int a = findMember(names, count, from);` and `int b = findMember(names, count, to);`',
        'Check `a < 0`, then `b < 0`, then `amount > balances[a]`, each with its own message, and only then move the money with `balances[a] -= amount;` and `balances[b] += amount;`',
        'Use the names as the user typed them for the success message: `"Transferred " + amount + " from " + from + " to " + to`.',
      ],
    },
    {
      id: 'j15-leave',
      title: 'A member leaves',
      prompt: 'Add a command `LEAVE name`. The member is removed: every member after her moves one place to the left in **both** arrays, and `count` goes down by 1. Print `Amina has left the SACCO`, or `No such member: X`. The starter only reads the name.',
      starter: ledgerProgram({
        extraCases: String.raw`                case "LEAVE" -> {
                    String name = in.next();
                    // TODO: remove the member by shifting the others to the left
                }`,
      }),
      sampleInput: 'JOIN Amina 100\nJOIN Joel 200\nJOIN Mary 300\nLEAVE Joel\nREPORT\nQUIT',
      usesInput: true,
      tests: [
        {
          input: 'JOIN Amina 100\nJOIN Joel 200\nJOIN Mary 300\nLEAVE Joel\nREPORT\nQUIT',
          expected: ['Welcome, Amina (balance 100)', 'Welcome, Joel (balance 200)', 'Welcome, Mary (balance 300)', 'Joel has left the SACCO', '=== SACCO REPORT ===', row('Amina', 100), row('Mary', 300), 'Members: 2', 'Total: 400', 'Top saver: Mary', 'Goodbye'].join('\n'),
        },
        {
          input: 'JOIN Amina 100\nLEAVE Peter\nLEAVE Amina\nREPORT\nQUIT',
          expected: ['Welcome, Amina (balance 100)', 'No such member: Peter', 'Amina has left the SACCO', '=== SACCO REPORT ===', 'Members: 0', 'Total: 0', 'Goodbye'].join('\n'),
        },
        {
          input: 'JOIN A 1\nJOIN B 2\nLEAVE B\nJOIN C 3\nREPORT\nQUIT',
          expected: ['Welcome, A (balance 1)', 'Welcome, B (balance 2)', 'B has left the SACCO', 'Welcome, C (balance 3)', '=== SACCO REPORT ===', row('A', 1), row('C', 3), 'Members: 2', 'Total: 4', 'Top saver: C', 'Goodbye'].join('\n'),
          hidden: true,
        },
      ],
      hints: [
        'Find the member with `findMember`. If the answer is -1, print the “No such member” message.',
        'Shift with a loop that copies each place from its right-hand neighbour: for `k` from `i` up to `count - 2`, `names[k] = names[k + 1];` and `balances[k] = balances[k + 1];`',
        'After the loop, do `count--;` and print the message. Use the name stored in the array (`names[i]` before shifting) or the typed name: both give the same text in the tests.',
      ],
    },
    {
      id: 'j15-stats',
      title: 'Statistics',
      prompt: 'Add a command `STATS`. If there are no members print `No members`. Otherwise print three lines: `Highest: Amina 70000`, `Lowest: Joel 15000` and `Average: 42500` (the total divided by the number of members, as whole shillings). The starter prints nothing.',
      starter: ledgerProgram({
        extraCases: String.raw`                case "STATS" -> {
                    // TODO: print the highest, the lowest and the average balance
                }`,
      }),
      sampleInput: 'JOIN Amina 70000\nJOIN Joel 15000\nSTATS\nQUIT',
      usesInput: true,
      tests: [
        {
          input: 'JOIN Amina 70000\nJOIN Joel 15000\nSTATS\nQUIT',
          expected: 'Welcome, Amina (balance 70000)\nWelcome, Joel (balance 15000)\nHighest: Amina 70000\nLowest: Joel 15000\nAverage: 42500\nGoodbye',
        },
        {
          input: 'STATS\nQUIT',
          expected: 'No members\nGoodbye',
        },
        {
          input: 'JOIN A 10\nJOIN B 20\nJOIN C 31\nSTATS\nQUIT',
          expected: 'Welcome, A (balance 10)\nWelcome, B (balance 20)\nWelcome, C (balance 31)\nHighest: C 31\nLowest: A 10\nAverage: 20\nGoodbye',
          hidden: true,
        },
      ],
      hints: [
        'Handle `count == 0` first. Then keep the **index** of the highest and of the lowest, starting both at 0.',
        'In a loop over the members, update `hi` when `balances[i] > balances[hi]` and `lo` when `balances[i] < balances[lo]`. Also add each balance to a `total`.',
        'Print `"Highest: " + names[hi] + " " + balances[hi]`, and the average as `total / count`.',
      ],
    },
  ],
};
