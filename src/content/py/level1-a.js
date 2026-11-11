// Python, Level 1 (Foundations), part A: lessons 0 to 4.
// Prose uses single-quoted strings; Python code uses template literals (no backticks inside the code).

const LEVEL = 'Level 1: Foundations';

export const level1a = [
  // ------------------------------------------------------------------ 0
  {
    id: 'py-zero',
    level: LEVEL,
    minutes: 8,
    title: 'Welcome: what is a program?',
    summary: 'Computers follow instructions exactly, step by step',
    blocks: [
      {
        t: 'story',
        title: 'The boda boda rider who does exactly what you say',
        text: 'Tell a normal rider “Take me to the market” and he asks which market. Now imagine a rider who does EXACTLY what you say and nothing more.\n\nYou must say: “Go straight. Turn left at the petrol station. Stop at the red gate.” If you forget one step, he cannot guess it.\n\nThat rider is a computer. Your instructions are a program.',
      },
      { t: 'p', text: 'A **program** is a list of instructions. A programming language is the words we use to write them. In this course the language is **Python**, one of the friendliest languages in the world. It is used for websites, games, data and artificial intelligence.' },
      { t: 'analogy', text: 'A program is like a recipe for mandazi. The cook (the computer) follows every step in order: mix the flour, add the sugar, heat the oil. If a step is missing, the mandazi come out wrong.' },
      { t: 'h', text: 'How every lesson works' },
      {
        t: 'list',
        items: [
          'Read a short story or picture, then see the idea in code.',
          'Press **Run** on the “Try it yourself” boxes. Change the code and run it again. You cannot break anything.',
          'Answer the quick questions. Wrong answers are fine, they teach you.',
          'Finish the **Practice** exercises. The app checks your answer and gives hints when you are stuck.',
        ],
      },
      { t: 'try', code: `print("My first program")\n`, output: 'My first program' },
      { t: 'p', text: 'Press **Run**. The words appeared because you gave the computer an instruction. Now change the words inside the quotes and run it again.' },
      {
        t: 'quiz',
        question: 'A computer reads your program. What does it do?',
        options: ['It follows your instructions exactly, one step at a time', 'It guesses what you really meant', 'It skips the steps it does not like'],
        answer: 0,
        explain: 'Computers are fast but not clever on their own. They do exactly what the program says, which is why we write instructions carefully.',
      },
      {
        t: 'recap',
        items: ['A program is a list of instructions.', 'A computer follows them exactly, in order.', 'Python is the language we use to write them.'],
        memory: 'Computer = the rider who does exactly what you say.',
      },
    ],
    exercises: [
      {
        id: 'py0-first',
        title: 'Your first instruction',
        prompt: 'Write a program that prints exactly: `I can code!`',
        starter: '# Type your instruction below\n',
        tests: [{ expected: 'I can code!' }],
        hints: [
          'The instruction that shows words on the screen is `print`.',
          'Put the words inside brackets and quotes: `print("...")`. Check the capital I and the exclamation mark.',
          'A similar example: `print("Good morning!")` shows Good morning! on the screen.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 1
  {
    id: 'py-print',
    level: LEVEL,
    minutes: 12,
    title: 'Make the computer talk: print',
    summary: 'print, text in quotes, and order of instructions',
    blocks: [
      {
        t: 'story',
        title: 'The signboard outside the duuka',
        text: 'A shopkeeper paints “Fresh Eggs” on a board and hangs it outside. Everyone walking past can read exactly what she wrote.\n\n`print` is the computer’s paintbrush. Whatever you put in it appears on the screen.',
      },
      { t: 'code', text: `print("Fresh Eggs")`, output: 'Fresh Eggs' },
      { t: 'p', text: 'Three things to notice: the word `print`, the brackets `( )`, and the text inside quotes `" "`. Text inside quotes is called a **string**, because it is a string of letters joined together.' },
      { t: 'h', text: 'One instruction per line' },
      { t: 'p', text: 'Each `print` shows its text on a new line. The computer reads from the top down:' },
      { t: 'code', text: `print("Rice")\nprint("Beans")\nprint("Matooke")`, output: 'Rice\nBeans\nMatooke' },
      { t: 'try', code: `print("Welcome to my shop")\nprint("We sell fresh eggs")\n`, output: 'Welcome to my shop\nWe sell fresh eggs' },
      { t: 'tip', text: 'You can use double quotes `"Hello"` or single quotes `\'Hello\'`. Just finish with the same kind you started with.' },
      {
        t: 'predict',
        code: `print("Hello")\nprint("World")`,
        question: 'What will appear on the screen?',
        options: ['Hello World', 'Hello\nWorld', 'World\nHello'],
        answer: 1,
        explain: 'Every print starts a new line, and the computer goes from top to bottom, so Hello comes first and World comes second.',
      },
      {
        t: 'fill',
        prompt: 'Complete the instruction so the computer shows: Karibu!',
        template: `___("Karibu!")`,
        blanks: [{ options: ['print', 'show', 'say'], answer: 'print' }],
        output: 'Karibu!',
      },
      {
        t: 'reorder',
        prompt: 'Put the morning routine in the right order so the output is: Wake up, Wash, Eat breakfast.',
        lines: [`print("Wake up")`, `print("Wash")`, `print("Eat breakfast")`],
        output: 'Wake up\nWash\nEat breakfast',
      },
      {
        t: 'bug',
        code: `print("Hello)`,
        question: 'This program stops with an error. Why?',
        options: ['The closing quote is missing', 'print is spelled wrong', 'Hello is not allowed in Python'],
        answer: 0,
        explain: 'Every opening quote needs a closing quote. Python reached the end of the line still waiting for it.',
        fixed: `print("Hello")`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `Print("Hi")`, why: 'Python cares about capital letters. `Print` with a big P is not the same word as `print`.', right: `print("Hi")` },
          { wrong: `print(Hi)`, why: 'Without quotes, Python thinks Hi is the name of something it should already know. Words to show need quotes.', right: `print("Hi")` },
        ],
      },
      {
        t: 'recap',
        items: ['`print("text")` shows text on the screen.', 'Text goes inside quotes, and every opening quote needs a closing one.', 'Python reads from top to bottom, one line at a time.'],
        memory: 'print = the computer’s paintbrush. Quotes wrap the words.',
      },
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
        id: 'py1-twolines',
        title: 'Two lines on the signboard',
        prompt: 'Print two lines:\n\n`Welcome to my shop`\n`We sell fresh eggs`',
        starter: '# Two print instructions, one for each line\n',
        tests: [{ expected: 'Welcome to my shop\nWe sell fresh eggs' }],
        hints: [
          'You need two `print` instructions, one under the other.',
          'The first prints `Welcome to my shop` and the second prints `We sell fresh eggs`. Each one has its own brackets and quotes.',
          'A similar example: `print("Rice")` on one line and `print("Beans")` on the next prints two lines.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: 'py-comments',
    level: LEVEL,
    minutes: 8,
    title: 'Notes to yourself: comments',
    summary: 'Comments, and why spaces at the start of a line matter',
    blocks: [
      {
        t: 'story',
        title: 'Notes in the margin of the ledger',
        text: 'A shopkeeper writes “Mukasa owes 2000” in the margin of her ledger. The note is for people reading the book. It is not part of the sales.\n\nPython has the same idea. A **comment** is a note for humans. The computer ignores it.',
      },
      { t: 'code', text: `# This line is a note. Python ignores it.\nprint("Shop is open")  # a note can also sit after an instruction`, output: 'Shop is open' },
      { t: 'p', text: 'A comment starts with `#`. Everything after the `#` on that line is ignored.' },
      { t: 'h', text: 'Two good uses for comments' },
      {
        t: 'list',
        items: ['Explain WHY you wrote something, so you understand it next month.', 'Switch an instruction off for a while without deleting it. Programmers call this “commenting it out”.'],
      },
      { t: 'try', code: `print("A")\n# print("B")\nprint("C")\n`, output: 'A\nC' },
      { t: 'p', text: 'Remove the `#` from the middle line and run again. B comes back.' },
      {
        t: 'predict',
        code: `print("One")\n# print("Two")\nprint("Three")`,
        question: 'What will appear on the screen?',
        options: ['One\nTwo\nThree', 'One\nThree', 'One\nTwo'],
        answer: 1,
        explain: 'The middle line begins with #, so Python ignores it completely. Only One and Three are printed.',
      },
      { t: 'h', text: 'Spaces at the start of a line' },
      { t: 'p', text: 'Python is strict about spaces at the START of a line. For now the rule is simple: unless a lesson tells you otherwise, start every line at the very left edge. You will soon learn the one place where spaces are needed.' },
      {
        t: 'mistakes',
        items: [{ wrong: `print("Hi")\n    print("There")`, why: 'The second line starts with extra spaces. Python expected it to line up with the first one.', right: `print("Hi")\nprint("There")` }],
      },
      {
        t: 'quiz',
        question: 'What does Python do with a line that starts with #?',
        options: ['It ignores the line', 'It prints the line', 'It stops the program'],
        answer: 0,
        explain: 'A # turns the rest of the line into a note for humans.',
      },
      {
        t: 'recap',
        items: ['`#` starts a comment, a note for humans.', 'Python ignores comments.', 'Start lines at the left edge unless a lesson says otherwise.'],
        memory: '# = a note in the margin.',
      },
    ],
    exercises: [
      {
        id: 'py2-comment',
        title: 'Switch a line off',
        prompt: 'The program below prints three lines, but the middle one is only a test. Turn it into a comment by putting `#` at its start, so the program prints only `Welcome` and `Goodbye`.',
        starter: 'print("Welcome")\nprint("Test message, remove me")\nprint("Goodbye")\n',
        tests: [{ expected: 'Welcome\nGoodbye' }],
        hints: [
          'You do not need to delete anything. A comment is ignored by Python.',
          'Add `#` at the very start of the middle line.',
          'A similar example: `# print("Hidden")` is a line Python skips.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: 'py-variables',
    level: LEVEL,
    minutes: 15,
    title: 'Variables: labelled jars',
    summary: 'Storing values with a name, changing them, naming rules',
    blocks: [
      {
        t: 'story',
        title: 'The jars on Mama Rose’s shelf',
        text: 'In Mama Rose’s duuka, every jar has a label. One says SUGAR, another says RICE. She never has to open a jar to remember what is inside. She reads the label.\n\nA **variable** works exactly like that. It is a labelled jar in the computer’s memory.',
      },
      { t: 'analogy', text: 'The label is the variable’s **name**. What is inside the jar is its **value**. The `=` sign means “put this inside the jar”, it does not mean “equals” like in school.' },
      { t: 'code', text: `item = "Sugar"\nprice = 4500\nprint(item)\nprint(price)`, output: 'Sugar\n4500' },
      { t: 'p', text: 'Read the first line as: “Put the text Sugar into the jar labelled item.” Then `print(item)` opens the jar and shows what is inside.' },
      { t: 'p', text: 'You can print several things at once by separating them with commas. Python puts a space between them:' },
      { t: 'code', text: `item = "Sugar"\nprice = 4500\nprint(item, "costs", price)`, output: 'Sugar costs 4500' },
      { t: 'try', code: `shop = "Mama Rose"\nitems_sold = 12\nprint(shop, "sold", items_sold, "items today")\n`, output: 'Mama Rose sold 12 items today' },
      { t: 'h', text: 'Changing what is in the jar' },
      { t: 'p', text: 'You can put a new value in the same jar at any time. The old value is thrown away:' },
      { t: 'code', text: `stock = 10\nprint(stock)\nstock = 7\nprint(stock)`, output: '10\n7' },
      { t: 'h', text: 'Rules for naming jars' },
      {
        t: 'list',
        items: [
          'Use letters, numbers and the underscore `_`. Example: `total_price`.',
          'No spaces. Use `_` instead: `my_age`, not `my age`.',
          'Never start with a number: `stars5` is fine, `5stars` is not.',
          'Capitals matter: `price` and `Price` are two different jars.',
          'Choose names that say what is inside: `price` is better than `x`.',
        ],
      },
      {
        t: 'predict',
        code: `a = 5\nb = a\na = 9\nprint(b)`,
        question: 'What does this print?',
        options: ['5', '9', '14'],
        answer: 0,
        explain: 'The line b = a copies the value 5 into jar b at that moment. Changing a later does not change b.',
      },
      {
        t: 'fill',
        prompt: 'Choose a good name for the jar so the program prints Mama Rose.',
        template: `___ = "Mama Rose"\nprint(shopkeeper)`,
        blanks: [{ options: ['shopkeeper', 'print', '5shop'], answer: 'shopkeeper' }],
        output: 'Mama Rose',
      },
      {
        t: 'reorder',
        prompt: 'Order the lines so the output is: Passion juice, then Mango juice.',
        lines: [`drink = "Passion juice"`, `print(drink)`, `drink = "Mango juice"`, `print(drink)`],
        output: 'Passion juice\nMango juice',
      },
      {
        t: 'bug',
        code: `my age = 20\nprint(my age)`,
        question: 'Python complains about the first line. Why?',
        options: ['A variable name cannot contain a space', '20 is too small a number', 'print cannot show numbers'],
        answer: 0,
        explain: 'A space splits the name into two words, and Python does not know what to do with that. Use an underscore: my_age.',
        fixed: `my_age = 20\nprint(my_age)`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `5stars = 3`, why: 'A variable name cannot start with a number.', right: `stars5 = 3` },
          { wrong: `price = 10\nprint(Price)`, why: 'Capitals matter. The jar is called price, but the program asked for Price, which does not exist.', right: `price = 10\nprint(price)` },
        ],
      },
      {
        t: 'recap',
        items: ['A variable is a labelled jar: `name = value`.', '`=` means “put inside”.', 'You can change the value later.', 'Names: letters, numbers, `_`, no spaces, not starting with a number.'],
        memory: 'Label on the jar = name. Stuff inside = value.',
      },
    ],
    exercises: [
      {
        id: 'py3-jar',
        title: 'Label the jars',
        prompt: 'Make a variable `item` holding `Soap` and a variable `price` holding `2500`. Then print them so the output is:\n\n`Soap costs 2500`',
        starter: '# Create item and price, then print them\n',
        tests: [{ expected: 'Soap costs 2500' }],
        hints: [
          'Two jars: one for the text Soap (needs quotes) and one for the number 2500 (no quotes).',
          '`item = "Soap"` and `price = 2500`. Then print the jars with commas between them and the word costs in quotes.',
          'A similar example: `print(item, "costs", price)` prints the two jars with the word costs between them.',
        ],
      },
      {
        id: 'py3-swap',
        title: 'Change the jar',
        prompt: 'The program prints Water. Add one more instruction so the jar holds `Juice` and print it again. The output must be:\n\n`Water`\n`Juice`',
        starter: 'drink = "Water"\nprint(drink)\n# Now put Juice in the same jar and print it again\n',
        tests: [{ expected: 'Water\nJuice' }],
        hints: [
          'Use the same jar name and give it a new value.',
          'Write `drink = "Juice"` and then `print(drink)` again below it.',
          'A similar example: `stock = 7` after `stock = 10` replaces the old value.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: 'py-types',
    level: LEVEL,
    minutes: 15,
    title: 'Kinds of values: numbers, text, True/False',
    summary: 'int, float, str, bool and converting between them',
    blocks: [
      {
        t: 'story',
        title: 'Containers at the market',
        text: 'At the market, goods come in different containers: eggs in a tray, milk in a jug, cloth in a roll. You would never pour milk into a tray.\n\nPython also keeps different **types** of values, and each type behaves differently.',
      },
      {
        t: 'list',
        items: [
          '**int**: whole numbers like `25` or `-3`.',
          '**float**: numbers with a decimal point like `3.5`.',
          '**str** (string): text in quotes like `"Hello"`.',
          '**bool**: only two values, `True` or `False`.',
        ],
      },
      {
        t: 'code',
        text: `print(type(25))\nprint(type(3.5))\nprint(type("Hello"))\nprint(type(True))`,
        output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
      },
      { t: 'p', text: '`type()` tells you what kind of value something is. Now the surprise: quotes change the type.' },
      { t: 'code', text: `print(25 + 5)\nprint("25" + "5")`, output: '30\n255' },
      { t: 'analogy', text: 'The number 25 is real money you can add up. The text "25" is only the two characters 2 and 5 written on paper. Adding two pieces of paper just puts them side by side: 255.' },
      { t: 'try', code: `print(10 + 5)\nprint("10" + "5")\nprint(type("10"))\n`, output: "15\n105\n<class 'str'>" },
      { t: 'h', text: 'Converting between types' },
      { t: 'p', text: '`int()` turns text into a whole number, `float()` into a decimal, and `str()` turns anything into text.' },
      { t: 'code', text: `n = int("25")\nprint(n + 5)`, output: '30' },
      { t: 'h', text: 'True and False come from questions' },
      { t: 'p', text: 'Compare two values and Python answers with a bool:' },
      { t: 'code', text: `print(5 > 3)\nprint(2 == 3)`, output: 'True\nFalse' },
      {
        t: 'predict',
        code: `print("2" + "3")`,
        question: 'What does this print?',
        options: ['5', '23', '2 3'],
        answer: 1,
        explain: 'Both values are text because of the quotes. Joining text puts the pieces side by side, so you get 23.',
      },
      {
        t: 'bug',
        code: `age = "20"\nprint(age + 5)`,
        question: 'Why does this crash?',
        options: ['"20" is text, and you cannot add a number to text', 'print cannot add things', 'age is a bad variable name'],
        answer: 0,
        explain: 'The quotes make 20 a string. Python refuses to mix text and numbers. Remove the quotes (or use int) to get a number.',
        fixed: `age = 20\nprint(age + 5)`,
      },
      {
        t: 'mistakes',
        items: [
          { wrong: `print("5" + 5)`, why: 'The first 5 is text and the second is a number. Python will not mix them.', right: `print(5 + 5)` },
          { wrong: `print(true)`, why: 'The bool values are written with a capital letter: True and False.', right: `print(True)` },
        ],
      },
      {
        t: 'quiz',
        question: 'Which type can only ever be True or False?',
        options: ['bool', 'int', 'str'],
        answer: 0,
        explain: 'bool is named after George Boole, who worked out the maths of true and false. It has just two possible values.',
      },
      {
        t: 'recap',
        items: ['int = whole number, float = decimal, str = text, bool = True/False.', 'Quotes make something text, even "25".', '`int()`, `float()` and `str()` convert between types.'],
        memory: 'Quotes turn numbers into paper notes: "25" is text, 25 is money.',
      },
    ],
    exercises: [
      {
        id: 'py4-types',
        title: 'Number or text?',
        prompt: 'Print the type of the number `100`, and then the type of the text `"100"`. The output must be:\n\n`<class \'int\'>`\n`<class \'str\'>`',
        starter: '# Use print(type(...)) twice\n',
        tests: [{ expected: "<class 'int'>\n<class 'str'>" }],
        hints: [
          'Wrap a value in `type(...)` to ask Python what kind it is.',
          'The first value has no quotes and the second has quotes. Print `type(100)` and then `type("100")`.',
          'A similar example: `print(type(3.5))` shows the float type.',
        ],
      },
      {
        id: 'py4-total',
        title: 'Fix the total',
        prompt: 'A shopkeeper stored the quantity as text by mistake. Convert it to a number with `int()` so the program prints the total price: `6000`.',
        starter: 'quantity = "3"\nprice = 2000\nprint(quantity * price)\n',
        tests: [{ expected: '6000' }],
        hints: [
          'The quantity is text because of the quotes. Multiply needs a number.',
          'Wrap the text in `int(...)` before multiplying: `int(quantity)`.',
          'A similar example: `int("4") + 1` gives 5.',
        ],
      },
    ],
  },
];
