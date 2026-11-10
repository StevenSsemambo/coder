// Python course (starter pack).

export const pythonCourse = {
  id: 'py-start',
  language: 'python',
  title: 'Python: First Steps',
  subtitle: 'Starter pack',
  lessons: [
    {
      id: 'py-basics',
      title: 'Print, input and variables',
      summary: 'print, input, int and arithmetic',
      blocks: [
        { t: 'p', text: 'Python is one of the easiest languages to start with. `print` shows text on the screen:' },
        { t: 'code', text: 'print("Hello, world!")' },
        { t: 'p', text: 'A variable stores a value. You do not need to say its type:' },
        { t: 'code', text: 'name = "Amina"\nage = 20\nprint("Hello,", name)\nprint(age + 1)' },
        { t: 'p', text: '`input()` reads one line typed by the user. It always gives you text, so use `int(...)` to turn it into a whole number:' },
        { t: 'code', text: 'a = int(input())\nb = int(input())\nprint(a + b)' },
        {
          t: 'list',
          items: [
            'Text goes in quotes: `"Hello"` or `\'Hello\'`.',
            'Join text with `+`: `"Hello, " + name`.',
            'Operators: `+`, `-`, `*`, `/` (decimal division), `//` (whole division), `%` (remainder).',
          ],
        },
        { t: 'tip', text: 'In these exercises, type the input in the Input box, one value per line.' },
      ],
      exercises: [
        {
          id: 'py1-hello',
          title: 'Hello, Uganda',
          prompt: 'Print exactly: `Hello, Uganda!`',
          starter: '# Print the greeting\n',
          tests: [{ expected: 'Hello, Uganda!' }],
          hints: [
            'Use `print` with the text inside quotes.',
            'The whole line is `print("Hello, Uganda!")`. Check the capital H, the comma and the exclamation mark.',
            'A similar example: `print("Good morning!")` prints Good morning!',
          ],
        },
        {
          id: 'py1-greet',
          title: 'Greet by name',
          prompt: 'Read a name and print a greeting like this: `Hello, Amina!`',
          starter: '# Read the name, then print the greeting\n',
          sampleInput: 'Amina',
          usesInput: true,
          tests: [
            { input: 'Amina', expected: 'Hello, Amina!' },
            { input: 'Okello', expected: 'Hello, Okello!' },
            { input: 'Nakato', expected: 'Hello, Nakato!', hidden: true },
          ],
          hints: [
            'Store what the user types in a variable: `name = input()`.',
            'Join the pieces with `+`: `"Hello, " + name + "!"`.',
            'A similar example: `city = input()` then `print("I live in " + city)`.',
          ],
        },
        {
          id: 'py1-area',
          title: 'Area of a rectangle',
          prompt: 'Read the length and then the width (two whole numbers, one per line) and print `Area: 15`.',
          starter: '# Read length and width, then print the area\n',
          sampleInput: '5\n3',
          usesInput: true,
          tests: [
            { input: '5\n3', expected: 'Area: 15' },
            { input: '10\n10', expected: 'Area: 100' },
            { input: '7\n8', expected: 'Area: 56', hidden: true },
          ],
          hints: [
            '`input()` gives text. Turn each answer into a number with `int(...)`.',
            'Read twice: `length = int(input())` and `width = int(input())`. The area is `length * width`.',
            'A similar example: `print("Total:", a + b)` prints the label, a space, then the value. Use `*` for the area.',
          ],
        },
      ],
    },
    {
      id: 'py-control',
      title: 'Decisions and loops',
      summary: 'if, elif, else, for and range',
      blocks: [
        { t: 'p', text: 'Python groups code by indentation (spaces at the start of the line). A line ending with a colon `:` starts a block, and the next lines must be indented.' },
        { t: 'code', text: 'marks = 65\nif marks >= 50:\n    print("Pass")\nelse:\n    print("Fail")' },
        { t: 'p', text: 'Use `elif` to check more cases in order. A `for` loop with `range` repeats code:' },
        { t: 'code', text: 'for i in range(1, 6):\n    print(i)' },
        {
          t: 'list',
          items: [
            '`range(1, 6)` gives 1, 2, 3, 4, 5. It stops before the second number.',
            'Comparisons: `==`, `!=`, `<`, `>`, `<=`, `>=`. Combine with `and`, `or`, `not`.',
            'Use the Tab button to indent. Keep the same number of spaces inside one block.',
          ],
        },
        { t: 'tip', text: 'Forgetting the colon or the indentation are the two most common beginner errors. The error card will point them out.' },
      ],
      exercises: [
        {
          id: 'py2-passfail',
          title: 'Pass or fail',
          prompt: 'Read a mark. Print `Pass` if it is 50 or more, otherwise print `Fail`.',
          starter: '# Read the mark and decide\n',
          sampleInput: '75',
          usesInput: true,
          tests: [
            { input: '75', expected: 'Pass' },
            { input: '49', expected: 'Fail' },
            { input: '50', expected: 'Pass', name: 'Exactly 50' },
          ],
          hints: [
            'Use `if` and `else`, and do not forget the colons.',
            '`marks = int(input())` then `if marks >= 50:` with an indented `print("Pass")`, and `else:` with `print("Fail")`.',
            'A similar example: `if age >= 18:` then an indented `print("Adult")`, then `else:` and an indented `print("Minor")`.',
          ],
        },
        {
          id: 'py2-sumn',
          title: 'Sum to N',
          prompt: 'Read a number N and print the sum of 1 to N like this: `Sum: 15`',
          starter: '# Read n, add 1 to n, print the total\n',
          sampleInput: '5',
          usesInput: true,
          tests: [
            { input: '5', expected: 'Sum: 15' },
            { input: '10', expected: 'Sum: 55' },
            { input: '100', expected: 'Sum: 5050', hidden: true },
          ],
          hints: [
            'Keep a `total` that starts at 0 and add each number in a loop.',
            'Use `for i in range(1, n + 1):` and inside it `total = total + i`. Print after the loop, not inside it.',
            'A similar example: to add only even numbers, write `if i % 2 == 0:` inside the loop before adding. Yours adds all.',
          ],
        },
        {
          id: 'py2-stars',
          title: 'Star triangle',
          prompt: 'Read a number N and print a triangle with N rows. Row 1 has one star, row 2 has two, and so on. For N = 3:\n\n`*`\n`**`\n`***`',
          starter: '# Read n, then print the triangle\n',
          sampleInput: '3',
          usesInput: true,
          tests: [
            { input: '3', expected: '*\n**\n***' },
            { input: '1', expected: '*' },
            { input: '5', expected: '*\n**\n***\n****\n*****', hidden: true },
          ],
          hints: [
            'You need a loop that runs N times, and each row has as many stars as its row number.',
            'In Python you can repeat text with `*`: `"ab" * 3` gives `ababab`. So row `i` is `"*" * i`.',
            'A similar example: `for i in range(1, 4): print("#" * i)` prints a three-row triangle of # signs.',
          ],
        },
      ],
    },
  ],
};
