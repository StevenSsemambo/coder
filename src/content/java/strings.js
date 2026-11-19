// Java, Level 2, lesson 14: Strings in depth, StringBuilder and formatted text.
import { prog, imp, HEAD, TAIL } from './shared.js';

const LEVEL = 'Level 2: Loops, methods and arrays';
const SCAN = imp('java.util.Scanner');
const P = (body) => prog(body);
const S = (body) => prog(body, SCAN);

export const stringsLesson = {
  id: 'j-strings',
  level: LEVEL,
  minutes: 35,
  title: 'Strings in depth',
  summary: 'Characters and indexes, the String toolbox, immutability, split and join, StringBuilder, and printf',
  blocks: [
    {
      t: 'story',
      title: 'Cleaning the member register',
      text: 'Over the years the SACCO’s register has become a mess. One member is written **AMINA nakato**, another **joel OKELLO**, a phone number has spaces and dashes in the wrong places, and a line from a spreadsheet reads **Mary,100000,6** all in one piece.\n\nAll of this is **text**, and cleaning it up is a job for the Java `String`. A String is a **row of characters**, much like an array of `char`, and Java gives it a big toolbox for cutting, searching, comparing and joining. Almost every real program, from a login form to a receipt, spends a good part of its time working with text.',
    },
    { t: 'h', text: 'A String is a row of characters' },
    { t: 'p', text: 'Like an array, the characters of a String have indexes that start at **0**. `length()` gives how many there are, and `charAt(i)` gives the character at index `i`. Notice the brackets: for a **String**, `length` is a **method** and needs `()`, unlike an array’s `length`.' },
    {
      t: 'try',
      code: P(String.raw`        String name = "Amina Nakato";
        System.out.println(name.length());
        System.out.println(name.charAt(0));
        System.out.println(name.charAt(name.length() - 1));
        System.out.println(name.indexOf("Nakato"));
        System.out.println(name.indexOf('z'));`),
      output: '12\nA\no\n6\n-1',
    },
    { t: 'h', text: 'Strings never change: they are immutable' },
    { t: 'p', text: 'Once a String is made, its characters can **never be changed**. Every method that seems to change a String actually **returns a new one** and leaves the old one untouched. So if you want the result, you must **store it** (or print it).' },
    {
      t: 'predict',
      code: P(String.raw`        String name = "amina";
        name.toUpperCase();
        System.out.println(name);`),
      question: 'What does this program print?',
      options: ['amina', 'AMINA', 'Amina', 'It is an error'],
      answer: 0,
      explain: 'toUpperCase() builds a new String "AMINA" and returns it, but the program throws the new String away. The variable name still refers to the old, unchanged "amina". Write `name = name.toUpperCase();` to keep the result.',
    },
    { t: 'h', text: 'The String toolbox' },
    {
      t: 'list',
      items: [
        '`s.substring(a)` from index a to the end. `s.substring(a, b)` from a up to, but **not including**, b.',
        '`s.indexOf("x")` the first position of x, or -1. `s.lastIndexOf("x")` the last position. `s.contains("x")` is true or false.',
        '`s.startsWith("x")` and `s.endsWith("x")` give true or false.',
        '`s.toUpperCase()`, `s.toLowerCase()` and `s.trim()` (removes spaces at both ends).',
        '`s.replace("old", "new")` replaces every occurrence. `s.isEmpty()` is true for "". `"ab".repeat(3)` gives "ababab".',
      ],
    },
    {
      t: 'try',
      code: P(String.raw`        String s = "  Amina Nakato  ";
        String t = s.trim();
        System.out.println("[" + t + "]");
        System.out.println(t.substring(6) + "|" + t.substring(0, 5));
        System.out.println(t.toUpperCase() + " " + t.toLowerCase());
        System.out.println(t.contains("kat") + " " + t.startsWith("Am") + " " + t.endsWith("x"));
        System.out.println(t.replace("Amina", "Mary"));
        System.out.println("ab".repeat(3));`),
      output: '[Amina Nakato]\nNakato|Amina\nAMINA NAKATO amina nakato\ntrue true false\nMary Nakato\nababab',
    },
    {
      t: 'predict',
      code: P(String.raw`        String town = "Kampala";
        System.out.println(town.substring(2, 5));`),
      question: 'What does this program print? Remember: the end index is NOT included.',
      options: ['mpa', 'mpal', 'amp', 'ampa'],
      answer: 0,
      explain: 'K is at 0, a at 1, m at 2, p at 3, a at 4. substring(2, 5) takes the characters at indexes 2, 3 and 4, which are m, p and a. The character at index 5 is not included.',
    },
    { t: 'h', text: 'Comparing text' },
    { t: 'p', text: 'You learned in lesson 6 that `==` is the wrong way to compare Strings. Use `equals` for exactly the same letters, `equalsIgnoreCase` to ignore capitals, and `compareTo` to find out **which comes first in the alphabet**. `compareTo` returns a negative number if the first String comes first, 0 if they are equal, and a positive number if it comes after.' },
    {
      t: 'try',
      code: P(String.raw`        System.out.println("Amina".equals("amina"));
        System.out.println("Amina".equalsIgnoreCase("amina"));
        System.out.println("apple".compareTo("banana") < 0);
        System.out.println("b".compareTo("a") > 0);
        System.out.println("abc".compareTo("abc"));`),
      output: 'false\ntrue\ntrue\ntrue\n0',
    },
    { t: 'h', text: 'Splitting and joining' },
    { t: 'p', text: '`split` cuts a String at every separator and returns an **array** of pieces. `String.join` does the opposite. This is how you read a line such as `Mary,100000,6` that comes from a spreadsheet, and turn the pieces into numbers with `Integer.parseInt` and `Double.parseDouble`.' },
    {
      t: 'try',
      code: prog(String.raw`        String line = "Mary,100000,6";
        String[] parts = line.split(",");
        String name = parts[0];
        int savings = Integer.parseInt(parts[1]);
        int months = Integer.parseInt(parts[2]);
        System.out.println(name + " saved " + savings + " in " + months + " months");
        System.out.println(parts.length + " " + String.join(" | ", parts));`),
      output: 'Mary saved 100000 in 6 months\n3 Mary | 100000 | 6',
    },
    { t: 'h', text: 'Going through the characters' },
    { t: 'p', text: '`toCharArray()` turns a String into an array of `char`, ready for a for-each loop. The `Character` class has tools to ask questions about one character: `isDigit`, `isLetter`, `isUpperCase`, and `toUpperCase`. Remember that a `char` is written in **single** quotes.' },
    {
      t: 'try',
      code: P(String.raw`        String code = "UG2026Kampala";
        int letters = 0;
        int digits = 0;
        for (char c : code.toCharArray()) {
            if (Character.isLetter(c)) {
                letters++;
            } else if (Character.isDigit(c)) {
                digits++;
            }
        }
        System.out.println("Letters: " + letters + " Digits: " + digits);`),
      output: 'Letters: 9 Digits: 4',
    },
    { t: 'h', text: 'StringBuilder: text that can be edited' },
    { t: 'p', text: 'Because a String never changes, building a long text by adding pieces again and again (`text = text + piece`) makes a brand-new String every time, and that is slow. A `StringBuilder` is a **text you can edit in place**: `append` adds to the end, `insert` puts text in the middle, `reverse` turns it round, `setCharAt` and `deleteCharAt` change single characters, and `toString()` gives the finished String.' },
    {
      t: 'try',
      code: P(String.raw`        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            sb.append(i);
            if (i < 5) {
                sb.append(",");
            }
        }
        System.out.println(sb);
        System.out.println(sb.length());
        sb.insert(0, "IDs: ");
        System.out.println(sb.toString());
        System.out.println(new StringBuilder("Kampala").reverse());`),
      output: '1,2,3,4,5\n9\nIDs: 1,2,3,4,5\nalapmaK',
    },
    { t: 'h', text: 'Numbers to text and back, and neat output' },
    { t: 'p', text: '`Integer.parseInt("42")` makes the number 42 from text, `String.valueOf(42)` makes the text "42" from a number. `String.format` works like `printf` but **returns** the text instead of printing it, so you can store it. Widths such as `%-8s` and `%6.2f` line up the columns of a receipt.' },
    {
      t: 'try',
      code: P(String.raw`        String[] items = {"Rice", "Beans", "Sugar"};
        int[] prices = {3500, 2800, 4500};
        for (int i = 0; i < items.length; i++) {
            System.out.println(String.format("%-8s|%7d", items[i], prices[i]));
        }
        System.out.println(Integer.parseInt("42") + 1);
        System.out.println(String.valueOf(42) + 1);`),
      output: 'Rice    |   3500\nBeans   |   2800\nSugar   |   4500\n43\n421',
    },
    {
      t: 'fill',
      prompt: 'Choose the method that takes the first three letters, so the program prints **Kam**.',
      template: P(String.raw`        String town = "Kampala";
        System.out.println(town.___(0, 3));`),
      blanks: [{ options: ['substring', 'charAt', 'indexOf'], answer: 'substring' }],
      output: 'Kam',
    },
    {
      t: 'reorder',
      prompt: 'Put the lines in the right order to turn `amina` into `Amina`. Each line needs the one before it. Tap the lines in order, from the first line of the file to the last closing bracket.',
      lines: [
        HEAD,
        String.raw`        String name = "amina";`,
        String.raw`        String first = name.substring(0, 1).toUpperCase();`,
        String.raw`        String result = first + name.substring(1);`,
        String.raw`        System.out.println(result);`,
        ...TAIL,
      ],
      output: 'Amina',
    },
    {
      t: 'bug',
      code: P(String.raw`        String name = "Amina";
        System.out.println(name.length);`),
      question: 'The compiler says “cannot find symbol: variable length”. What is the mistake?',
      options: ['For a String, length is a method and needs brackets: name.length()', 'name must be an array', 'length needs a capital L', 'println cannot print a length'],
      answer: 0,
      explain: 'This is the opposite of an array. An array has a value called length (no brackets), but a String has a method called length(), so it needs the brackets. It is one of the most common little mistakes in Java.',
      fixed: P(String.raw`        String name = "Amina";
        System.out.println(name.length());`),
    },
    {
      t: 'quiz',
      question: 'What is the value of `"Kampala".length()`?',
      options: ['7', '6', '8', '0'],
      answer: 0,
      explain: 'K, a, m, p, a, l, a: seven characters. The last one is at index 6, which is length() - 1.',
    },
    {
      t: 'quiz',
      question: 'Why does `name.toUpperCase();` on a line by itself change nothing?',
      options: ['Strings are immutable. The method returns a new String that must be stored', 'toUpperCase only works on char', 'The semicolon is not allowed', 'It works, but println must be called twice'],
      answer: 0,
      explain: 'A String can never be edited. Every method that looks like an edit returns a new String. Store it: name = name.toUpperCase();',
    },
    {
      t: 'quiz',
      question: '`"apple".compareTo("banana")` gives…',
      options: ['A negative number, because apple comes first', 'A positive number', '0', 'true'],
      answer: 0,
      explain: 'compareTo compares alphabetically. a comes before b, so apple is “less than” banana and the answer is negative.',
    },
    {
      t: 'mistakes',
      items: [
        {
          wrong: P(String.raw`        char c = "A";
        System.out.println(c);`),
          why: 'Double quotes make a String, and single quotes make a char. A char variable holds exactly one character, written in single quotes: `\'A\'`.',
          right: P(String.raw`        char c = 'A';
        System.out.println(c);`),
        },
        {
          wrong: P(String.raw`        String s = "abc";
        System.out.println(s.charAt(5));`),
          why: 'The String has only three characters, at indexes 0, 1 and 2. Asking for index 5 stops the program with a StringIndexOutOfBoundsException. Check `i < s.length()` before using an index.',
          right: P(String.raw`        String s = "abc";
        System.out.println(s.charAt(2));`),
        },
        {
          wrong: P(String.raw`        int n = Integer.parseInt("12abc");
        System.out.println(n);`),
          why: 'The text contains letters, so it is not a number, and Integer.parseInt stops the program with a NumberFormatException. Check or clean the text first (for example with `Character.isDigit`), or read the number with a Scanner.',
          right: P(String.raw`        int n = Integer.parseInt("12");
        System.out.println(n);`),
        },
        {
          logic: true,
          wrong: P(String.raw`        String name = "amina";
        name.toUpperCase();
        System.out.println(name);`),
          why: 'This prints amina, not AMINA. Strings never change, and the new String that toUpperCase returned was thrown away. Store it: `name = name.toUpperCase();`.',
          right: P(String.raw`        String name = "amina";
        name = name.toUpperCase();
        System.out.println(name);`),
        },
      ],
    },
    {
      t: 'recap',
      items: [
        'A String is a row of characters with indexes from 0. `length()` and `charAt(i)` use brackets.',
        'Strings are immutable: methods return a new String, so store the result.',
        'Toolbox: `substring` (end not included), `indexOf`, `contains`, `startsWith`, `endsWith`, `trim`, `replace`, `toUpperCase`, `toLowerCase`.',
        'Compare with `equals`, `equalsIgnoreCase` and `compareTo`. `split` makes an array and `String.join` joins one.',
        'Use `StringBuilder` to build or edit text, and `String.format` or `printf` for neat columns.',
      ],
      memory: 'A String is a row of characters you can read but never edit.',
    },
  ],
  exercises: [
    {
      id: 'j14-initials',
      title: 'Initials',
      prompt: 'Read a first name and a last name (in any mix of capital and small letters). Print the initials in capitals, each followed by a dot: `A.N.`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        // Read the two names, then print the initials\n', SCAN),
      sampleInput: 'amina nakato',
      usesInput: true,
      tests: [
        { input: 'amina nakato', expected: 'A.N.' },
        { input: 'Joel OKELLO', expected: 'J.O.' },
        { input: 'x y', expected: 'X.Y.', hidden: true },
      ],
      hints: [
        'Read each name with `in.next()`. The first letter of a name is `name.charAt(0)`.',
        'Make a letter a capital with `Character.toUpperCase(letter)`.',
        '`System.out.println(Character.toUpperCase(first.charAt(0)) + "." + Character.toUpperCase(last.charAt(0)) + ".");` (the first part is a char, so the dot makes it join as text).',
      ],
    },
    {
      id: 'j14-vowels',
      title: 'Count the vowels',
      prompt: 'Read one whole line of text and count its vowels (a, e, i, o, u), capital or small. Print `Vowels: 5`.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        String line = in.nextLine();\n        // Count the vowels in line\n', SCAN),
      sampleInput: 'The quick brown fox',
      usesInput: true,
      tests: [
        { input: 'The quick brown fox', expected: 'Vowels: 5' },
        { input: 'SACCO', expected: 'Vowels: 2' },
        { input: 'rhythm', expected: 'Vowels: 0', hidden: true },
        { input: 'Aeiou AEIOU', expected: 'Vowels: 10', hidden: true },
      ],
      hints: [
        'Make the line lower case first, so that you only have to check small letters.',
        'Go through the characters with `for (char c : line.toLowerCase().toCharArray())`.',
        '`if ("aeiou".indexOf(c) >= 0) { count++; }`. The text "aeiou" contains c only if c is a vowel.',
      ],
    },
    {
      id: 'j14-palindrome',
      title: 'Palindrome',
      prompt: 'A palindrome reads the same forwards and backwards. Read one word and print `Palindrome` or `Not a palindrome`. Ignore the difference between capital and small letters.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        String word = in.next();\n        // Compare the word with its reverse\n', SCAN),
      sampleInput: 'Level',
      usesInput: true,
      tests: [
        { input: 'Level', expected: 'Palindrome' },
        { input: 'Kampala', expected: 'Not a palindrome' },
        { input: 'Racecar', expected: 'Palindrome' },
        { input: 'a', expected: 'Palindrome', hidden: true },
        { input: 'ab', expected: 'Not a palindrome', hidden: true },
      ],
      hints: [
        'A StringBuilder can reverse a text: `new StringBuilder(word).reverse().toString()`.',
        'Compare the word with its reverse using `equalsIgnoreCase`, which ignores capital letters.',
        '`if (word.equalsIgnoreCase(reversed)) { ... } else { ... }`',
      ],
    },
    {
      id: 'j14-csv',
      title: 'A spreadsheet line',
      prompt: 'A line from a spreadsheet has the name, the savings and the number of months, separated by commas, for example `Mary,100000,6`. Read the line and print: `Mary has saved 100000 over 6 months (average 16666)`. The average is the savings divided by the months, as whole shillings.',
      starter: prog('        Scanner in = new Scanner(System.in);\n        String line = in.nextLine();\n        // Split the line at the commas and use the three parts\n', SCAN),
      sampleInput: 'Mary,100000,6',
      usesInput: true,
      tests: [
        { input: 'Mary,100000,6', expected: 'Mary has saved 100000 over 6 months (average 16666)' },
        { input: 'Joel,90000,3', expected: 'Joel has saved 90000 over 3 months (average 30000)' },
        { input: 'Amina,100,3', expected: 'Amina has saved 100 over 3 months (average 33)', hidden: true },
      ],
      hints: [
        '`String[] parts = line.split(",");` gives you three pieces: the name, the savings and the months, as text.',
        'Turn the two number pieces into ints with `Integer.parseInt(parts[1])` and `Integer.parseInt(parts[2])`.',
        'The average is `savings / months` (integer division). Join everything with `+` into one println.',
      ],
    },
    {
      id: 'j14-phone',
      title: 'Clean the phone number',
      prompt: 'Members write their phone numbers in many ways: `0772 123-456`. Read one line, **remove all the spaces and dashes**, and print the clean number. Then say whether it is valid: a valid number has exactly 10 characters and starts with `07`.\n\nPrint: `Phone: 0772123456 (valid)` or `Phone: 0772123 (invalid)`',
      starter: prog('        Scanner in = new Scanner(System.in);\n        String line = in.nextLine();\n        // Remove spaces and dashes, then check the length and the start\n', SCAN),
      sampleInput: '0772 123-456',
      usesInput: true,
      tests: [
        { input: '0772 123-456', expected: 'Phone: 0772123456 (valid)' },
        { input: '077-2123', expected: 'Phone: 0772123 (invalid)' },
        { input: '0414 555 555', expected: 'Phone: 0414555555 (invalid)' },
        { input: '0701234567', expected: 'Phone: 0701234567 (valid)', hidden: true },
        { input: '07 01 23 45 678', expected: 'Phone: 07012345678 (invalid)', hidden: true },
      ],
      hints: [
        '`replace(" ", "")` removes the spaces: it replaces them with nothing. Do the same for `"-"`. Store the result, because Strings never change.',
        '`String clean = line.replace(" ", "").replace("-", "");`',
        'Valid means `clean.length() == 10 && clean.startsWith("07")`. Print with `"Phone: " + clean + " (valid)"`.',
      ],
    },
  ],
};
