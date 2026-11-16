// C, Part 2, Levels 3 and 4: Files (text files, records in files, binary files) and the capstone.
// Lessons 11 to 14. Runs on picoc (WebAssembly) with a small in-memory file system.
// HONEST NOTE for learners (said in lesson 11): in the app a file lives only while the program runs.
// The commands are exactly the ones a real computer uses; on a laptop the file would stay on the disk.
import { inc } from '../c/shared.js';

const L3 = 'Level 3: Files';
const L4 = 'Level 4: Capstone';
const FIO = inc('stdio', 'string');
const FALL = inc('stdio', 'stdlib', 'string');

/** A whole program: `top` above main, `body` inside main. */
const P = (top, body, incl = FIO) => `${incl}\n\n${top ? top + '\n\n' : ''}int main() {\n${body}\n    return 0;\n}\n`;

const ITEM = String.raw`typedef struct {
    char name[20];
    int price;
    int stock;
} Item;`;

const SAVE = String.raw`void save_items(Item *items, int count, char *filename) {
    FILE *f = fopen(filename, "w");
    int i;
    if (f == NULL) {
        return;
    }
    for (i = 0; i < count; i++) {
        fprintf(f, "%s %d %d\n", items[i].name, items[i].price, items[i].stock);
    }
    fclose(f);
}`;

const LOAD = String.raw`int load_items(Item *items, int max, char *filename) {
    FILE *f = fopen(filename, "r");
    int count = 0;
    if (f == NULL) {
        return 0;
    }
    while (count < max && fscanf(f, "%s %d %d", items[count].name, &items[count].price, &items[count].stock) == 3) {
        count++;
    }
    fclose(f);
    return count;
}`;

const SAVELOAD = `${ITEM}\n\n${SAVE}\n\n${LOAD}`;

export const fileLessons = [
  // ================================================================== 11
  {
    id: 'cx-files',
    level: L3,
    minutes: 30,
    title: 'Text files: fopen, fprintf, fgets',
    summary: 'Write lines to a file and read them back, the way real programs keep their data',
    blocks: [
      {
        t: 'story',
        title: 'The notebook that remembers',
        text: 'Nakato runs a small shop. Every evening she types the day’s sales into her program. In the morning, when she opens it again, everything is **gone**: the variables lived only in memory, and memory is cleared when the program ends.\n\nTo keep data, a program writes it to a **file**, a named place on the disk. The next run opens the same file and reads the data back. Files are how every real program remembers: contacts, scores, settings, saved games.\n\n**A note about this app:** your program runs inside the browser, so a file you create lives **only for that one run**. The commands you learn here are exactly the ones used on a laptop or a server, where the file stays on the disk. You will write a file and read it back in the same program, which proves the code works.',
      },
      { t: 'h', text: 'Open, use, close' },
      { t: 'p', text: 'A file is always used in three steps: **open** it with `fopen(name, mode)`, **use** it, then **close** it with `fclose`. `fopen` gives you a `FILE *` (a pointer you keep and pass to the other file functions). The mode says what you want to do: `"w"` write (creates the file, or **empties** it if it exists), `"r"` read, `"a"` append (add at the end).' },
      {
        t: 'try',
        code: P('', String.raw`    FILE *f = fopen("notes.txt", "w");
    if (f == NULL) {
        printf("Cannot open the file\n");
        return 1;
    }
    fprintf(f, "Monday 4500\n");
    fprintf(f, "Tuesday 3200\n");
    fclose(f);
    printf("Saved\n");`),
        output: 'Saved',
      },
      { t: 'p', text: '`fprintf(f, ...)` is `printf` that writes into the file instead of the screen. Notice the check for `NULL`: `fopen` returns `NULL` when it cannot open the file (a file you asked to read does not exist, the disk is full, no permission). **Always check.**' },
      { t: 'h', text: 'Reading it back' },
      { t: 'p', text: '`fgets(line, size, f)` reads one **line** (including the `\\n` at its end) into a text variable and returns `NULL` when there is nothing more. A `while` loop on `fgets` reads a whole file.' },
      {
        t: 'try',
        code: P('', String.raw`    FILE *f = fopen("notes.txt", "w");
    char line[80];
    fprintf(f, "Monday 4500\n");
    fprintf(f, "Tuesday 3200\n");
    fclose(f);

    f = fopen("notes.txt", "r");
    while (fgets(line, 80, f) != NULL) {
        printf("Read: %s", line);
    }
    fclose(f);`),
        output: 'Read: Monday 4500\nRead: Tuesday 3200',
      },
      { t: 'tip', text: 'The line already ends with `\\n`, so the program prints `"%s"` with **no** extra `\\n`. If you add one you get a blank line after each line.' },
      { t: 'h', text: 'Reading numbers: fscanf' },
      { t: 'p', text: '`fscanf(f, ...)` is `scanf` reading from the file. It returns how many values it read, so `fscanf(...) == 2` means “both values were there”, and it returns less (or `EOF`) at the end of the file. That makes a tidy loop for lines made of a word and a number.' },
      {
        t: 'try',
        code: P('', String.raw`    FILE *f = fopen("sales.txt", "w");
    char day[20];
    int amount, total = 0;
    fprintf(f, "Monday 4500\nTuesday 3200\nWednesday 5100\n");
    fclose(f);

    f = fopen("sales.txt", "r");
    while (fscanf(f, "%s %d", day, &amount) == 2) {
        total = total + amount;
    }
    fclose(f);
    printf("Total: %d\n", total);`),
        output: 'Total: 12800',
      },
      { t: 'h', text: 'Adding to a file' },
      { t: 'p', text: 'Mode `"a"` opens the file and keeps what is inside; new text goes at the **end**. Mode `"w"` would erase the old content first. Choosing the wrong one is the classic way to lose data.' },
      {
        t: 'try',
        code: P('', String.raw`    FILE *f = fopen("log.txt", "w");
    char line[40];
    int count = 0;
    fprintf(f, "start\n");
    fclose(f);

    f = fopen("log.txt", "a");
    fprintf(f, "sale 1\n");
    fprintf(f, "sale 2\n");
    fclose(f);

    f = fopen("log.txt", "r");
    while (fgets(line, 40, f) != NULL) {
        count++;
    }
    fclose(f);
    printf("Lines: %d\n", count);`),
        output: 'Lines: 3',
      },
      { t: 'analogy', text: 'A file is a **notebook**. `"w"` takes a fresh page after tearing out the old ones, `"a"` turns to the last page and keeps writing, `"r"` only lets you read. `fclose` is closing the notebook: until you do, the last lines may not be saved.' },
      {
        t: 'predict',
        code: P('', String.raw`    FILE *f = fopen("a.txt", "w");
    char line[40];
    fprintf(f, "one\n");
    fclose(f);

    f = fopen("a.txt", "w");
    fprintf(f, "two\n");
    fclose(f);

    f = fopen("a.txt", "r");
    while (fgets(line, 40, f) != NULL) {
        printf("%s", line);
    }
    fclose(f);`),
        question: 'What does this program print?',
        options: ['two', 'one', 'one\ntwo', 'Nothing'],
        answer: 0,
        explain: 'The second `fopen` uses mode `"w"`, which **empties** the file first. Only `two` is left. To keep `one`, the second open should use `"a"`.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap with the mode that **adds** to the end of the file without erasing it.',
        template: P('', String.raw`    FILE *f = fopen("log.txt", "w");
    char line[40];
    fprintf(f, "first\n");
    fclose(f);
    f = fopen("log.txt", "___");
    fprintf(f, "second\n");
    fclose(f);
    f = fopen("log.txt", "r");
    while (fgets(line, 40, f) != NULL) {
        printf("%s", line);
    }
    fclose(f);`),
        blanks: [{ options: ['a', 'w', 'r'], answer: 'a' }],
        output: 'first\nsecond',
      },
      {
        t: 'bug',
        code: P('', String.raw`    FILE *f = fopen("notes.txt", "w");
    fprintf(file, "hello\n");
    fclose(f);
    printf("done\n");`),
        question: 'The program stops with an error. What is wrong?',
        options: ['`file` does not exist: the file pointer is called `f`', '`fopen` needs three arguments', 'You cannot write to a file with fprintf', 'The mode must be "r"'],
        answer: 0,
        explain: 'The name after `fprintf(` must be the pointer you got from `fopen`. The program named `file`, which was never declared. Always write to the same variable you opened.',
        fixed: P('', String.raw`    FILE *f = fopen("notes.txt", "w");
    fprintf(f, "hello\n");
    fclose(f);
    printf("done\n");`),
      },
      {
        t: 'mistakes',
        items: [
          {
            wrong: String.raw`int main() {
    FILE *f = fopen("a.txt", "w");
    fprintf(f, "hi\n");
    fclose(f);
    return 0;
}
`,
            why: '`FILE`, `fopen`, `fprintf` and `fclose` belong to `stdio.h`, and the program did not include it. Add `#include <stdio.h>` at the top.',
            right: String.raw`#include <stdio.h>

int main() {
    FILE *f = fopen("a.txt", "w");
    fprintf(f, "hi\n");
    fclose(f);
    return 0;
}
`,
          },
          {
            logic: true,
            wrong: P('', String.raw`    FILE *f = fopen("scores.txt", "w");
    fprintf(f, "10\n");
    fclose(f);
    f = fopen("scores.txt", "w");
    fprintf(f, "20\n");
    fclose(f);
    f = fopen("scores.txt", "r");
    int a;
    int n = 0;
    while (fscanf(f, "%d", &a) == 1) {
        n++;
    }
    fclose(f);
    printf("%d score(s) saved\n", n);`),
            why: 'The program wanted to keep **two** scores, but it opened the file with `"w"` both times, and each `"w"` erases the file. Only one score survives. Use `"a"` the second time.',
            right: P('', String.raw`    FILE *f = fopen("scores.txt", "w");
    fprintf(f, "10\n");
    fclose(f);
    f = fopen("scores.txt", "a");
    fprintf(f, "20\n");
    fclose(f);
    f = fopen("scores.txt", "r");
    int a;
    int n = 0;
    while (fscanf(f, "%d", &a) == 1) {
        n++;
    }
    fclose(f);
    printf("%d score(s) saved\n", n);`),
          },
        ],
      },
      { t: 'quiz', question: 'Which mode opens a file for writing and **erases** what was in it?', options: ['"w"', '"a"', '"r"', '"x"'], answer: 0, explain: '`"w"` creates the file or empties it. `"a"` keeps the old content and adds at the end, `"r"` only reads.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 11): the daily sales book',
        text: 'The program reads the number of sales and the amount of each, **writes** them to `sales.txt`, then **reads the file back** to print the total and the biggest sale, which proves the file holds the data. Try `4` then `4500 3200 5100 2800`.',
        stdin: '4\n4500 3200 5100 2800',
        code: String.raw`#include <stdio.h>

int main() {
    FILE *f;
    int n, i, amount, total = 0, biggest = 0;
    scanf("%d", &n);

    f = fopen("sales.txt", "w");
    if (f == NULL) {
        printf("Cannot open the file\n");
        return 1;
    }
    for (i = 0; i < n; i++) {
        scanf("%d", &amount);
        fprintf(f, "%d\n", amount);
    }
    fclose(f);

    f = fopen("sales.txt", "r");
    while (fscanf(f, "%d", &amount) == 1) {
        total = total + amount;
        if (amount > biggest) {
            biggest = amount;
        }
    }
    fclose(f);
    printf("Total: %d\n", total);
    printf("Biggest: %d\n", biggest);
    return 0;
}
`,
        output: 'Total: 15600\nBiggest: 5100',
      },
      {
        t: 'recap',
        items: ['`FILE *f = fopen("name", mode);` then use it, then `fclose(f);`.', 'Modes: `"r"` read, `"w"` write (erases), `"a"` append.', 'Always check `f == NULL` after `fopen`.', '`fprintf(f, ...)` writes, `fgets(line, size, f)` reads a line, `fscanf(f, ...)` reads values.', 'In this app a file lasts for one run; on a real computer it stays on the disk.'],
        memory: 'Open, use, close.',
      },
    ],
    exercises: [
      {
        id: 'cx11-numbers',
        title: 'Save and total',
        prompt: 'Read `n`, then `n` whole numbers. Write each number on its own line to the file `nums.txt`, close it, open it again for reading and add the numbers up. Print `Sum: 60` for `10 20 30`.',
        starter: P('', String.raw`    int n, i, x, sum = 0;
    FILE *f;
    scanf("%d", &n);
    // write the numbers to nums.txt, read them back, add them up
    printf("Sum: %d\n", sum);`),
        sampleInput: '3\n10 20 30',
        usesInput: true,
        tests: [
          { input: '3\n10 20 30', expected: 'Sum: 60' },
          { input: '1\n7', expected: 'Sum: 7' },
          { input: '4\n5 -2 8 1', expected: 'Sum: 12', hidden: true },
        ],
        hints: [
          '`f = fopen("nums.txt", "w");` then `fprintf(f, "%d\\n", x);` inside a loop, then `fclose(f);`.',
          'Open again with `"r"` and loop `while (fscanf(f, "%d", &x) == 1) { sum = sum + x; }`.',
          'A similar example: the sales-book project in this lesson.',
        ],
      },
      {
        id: 'cx11-numbered',
        title: 'Numbered lines',
        prompt: 'Read `n`, then `n` words. Write them to `words.txt`, one per line. Read the file back with `fgets` and print each line with its number, like `1. Kato`. (The line read by `fgets` ends with a newline, so print it with `%s` and no extra `\\n`; print the number part first.)',
        starter: P('', String.raw`    int n, i, number = 0;
    char word[40];
    char line[80];
    FILE *f;
    scanf("%d", &n);
    // write the words to words.txt, read them back with fgets and print "1. word"`),
        sampleInput: '3\nKato\nAmina\nBob',
        usesInput: true,
        tests: [
          { input: '3\nKato\nAmina\nBob', expected: '1. Kato\n2. Amina\n3. Bob' },
          { input: '1\nZi', expected: '1. Zi' },
          { input: '2\nTea\nSugar', expected: '1. Tea\n2. Sugar', hidden: true },
        ],
        hints: [
          'Write each word with `fprintf(f, "%s\\n", word);`.',
          'Read back with `while (fgets(line, 80, f) != NULL) { number++; printf("%d. %s", number, line); }`.',
          'The line from `fgets` already carries its `\\n`, so the format has no `\\n` at the end.',
        ],
      },
      {
        id: 'cx11-log',
        title: 'Append to the log',
        prompt: 'The file `log.txt` first holds the single line `start`. Then the program reads `n` events (single words) and **appends** each as a line. Finally it reads the whole file and prints the **number of lines**, as `Lines: 4` for 3 events.',
        starter: P('', String.raw`    int n, i, lines = 0;
    char word[40];
    char line[80];
    FILE *f = fopen("log.txt", "w");
    fprintf(f, "start\n");
    fclose(f);
    scanf("%d", &n);
    // append the events, then count the lines in the file
    printf("Lines: %d\n", lines);`),
        sampleInput: '3\nlogin\nsale\nlogout',
        usesInput: true,
        tests: [
          { input: '3\nlogin\nsale\nlogout', expected: 'Lines: 4' },
          { input: '1\nopen', expected: 'Lines: 2' },
          { input: '5\na\nb\nc\nd\ne', expected: 'Lines: 6', hidden: true },
        ],
        hints: [
          'Open with the **append** mode: `f = fopen("log.txt", "a");`.',
          'Write each event with `fprintf(f, "%s\\n", word);` and close the file.',
          'Open with `"r"` and count with `while (fgets(line, 80, f) != NULL) { lines++; }`.',
        ],
      },
    ],
  },

  // ================================================================== 12
  {
    id: 'cx-file-records',
    level: L3,
    minutes: 35,
    title: 'Saving and loading records',
    summary: 'Write a whole array of structs to a file, load it back, and change one record',
    blocks: [
      {
        t: 'story',
        title: 'The shop that never forgets',
        text: 'Last lesson you saved numbers and words. Real data is made of **records**: an item has a name, a price and a stock. You already know how to hold records in a struct and many records in an array. Now we teach the program to **save the whole array** to a file and **load it again** next time.\n\nThe simplest way is a **text file with one record per line**: `Sugar 5000 12`. It is easy to write, easy to read, and you can even open it in a notepad and see the data.',
      },
      { t: 'h', text: 'Save: one line per record' },
      { t: 'p', text: 'A function that takes the array, how many records it holds and the file name. It loops and writes one line for each record.' },
      {
        t: 'try',
        code: P(SAVELOAD, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    char line[80];
    FILE *f;
    save_items(shop, 2, "shop.txt");
    f = fopen("shop.txt", "r");
    while (fgets(line, 80, f) != NULL) {
        printf("%s", line);
    }
    fclose(f);`),
        output: 'Sugar 5000 12\nTea 800 40',
      },
      { t: 'h', text: 'Load: read until the lines run out' },
      { t: 'p', text: '`load_items` opens the file for reading and uses `fscanf` in a loop: each successful read of three values (`== 3`) fills the next record. It also stops at `max`, so a long file cannot overflow the array. It returns how many records it loaded. If the file does not exist yet (the very first run of a program), it simply returns 0 and the program starts empty.' },
      {
        t: 'try',
        code: P(SAVELOAD, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    Item again[10];
    int count, i;
    save_items(shop, 2, "shop.txt");
    count = load_items(again, 10, "shop.txt");
    printf("Loaded %d\n", count);
    for (i = 0; i < count; i++) {
        printf("%s %d\n", again[i].name, again[i].stock);
    }`),
        output: 'Loaded 2\nSugar 12\nTea 40',
      },
      { t: 'tip', text: 'Save and load are a **pair**. If you change what `save` writes (say you add a member), change `load` in the same way. Keep the two functions next to each other in your program so you do not forget.' },
      { t: 'h', text: 'Changing a record: load, change, save' },
      { t: 'p', text: 'A text file has no “change line 2” command. The usual way is **read-modify-write**: load everything into the array, change the record in memory, and save the whole array again over the old file (mode `"w"` is right here, because the new file holds everything).' },
      {
        t: 'try',
        code: P(SAVELOAD, String.raw`    Item shop[10];
    int count, i;
    FILE *f = fopen("shop.txt", "w");
    fprintf(f, "Sugar 5000 12\nTea 800 40\n");
    fclose(f);

    count = load_items(shop, 10, "shop.txt");
    for (i = 0; i < count; i++) {
        if (strcmp(shop[i].name, "Tea") == 0) {
            shop[i].stock = shop[i].stock - 5;
        }
    }
    save_items(shop, count, "shop.txt");

    count = load_items(shop, 10, "shop.txt");
    for (i = 0; i < count; i++) {
        printf("%s %d\n", shop[i].name, shop[i].stock);
    }`),
        output: 'Sugar 12\nTea 35',
      },
      { t: 'analogy', text: 'It is like a **register book** you copy out by hand: to correct one name you copy the whole page again with the fix. The computer is fast, so copying the whole file is fine for a shop-sized list.' },
      {
        t: 'predict',
        code: P(SAVELOAD, String.raw`    Item a[3] = {{"Pen", 500, 10}, {"Book", 2000, 5}, {"Bag", 15000, 2}};
    Item b[3];
    int count;
    save_items(a, 2, "x.txt");
    count = load_items(b, 3, "x.txt");
    printf("%d %s\n", count, b[count - 1].name);`),
        question: 'What does this program print?',
        options: ['2 Book', '3 Bag', '2 Pen', '3 Book'],
        answer: 0,
        explain: 'The program saved only the **first 2** records (`count` argument is 2), so the file has Pen and Book. Loading reads 2, and the last one is Book.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap: the loop must continue **while three values were read** from the line.',
        template: P('', String.raw`    FILE *f = fopen("p.txt", "w");
    char name[20];
    int price, stock, n = 0;
    fprintf(f, "Pen 500 10\nBook 2000 5\n");
    fclose(f);
    f = fopen("p.txt", "r");
    while (fscanf(f, "%s %d %d", name, &price, &stock) == ___) {
        n++;
    }
    fclose(f);
    printf("%d records\n", n);`),
        blanks: [{ options: ['3', '1', '0'], answer: '3' }],
        output: '2 records',
      },
      {
        t: 'bug',
        code: P(SAVELOAD, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    save_items(shop, 2, "shop.txt");
    printf("%d\n", load_item(shop, 2, "shop.txt"));`),
        question: 'The program stops with an error. What is wrong?',
        options: ['The function is called `load_items`, not `load_item`', 'The array has no size', 'The file name must end in .dat', 'You cannot save and load in one program'],
        answer: 0,
        explain: 'The program calls a function named `load_item`, which does not exist. A single missing letter in a name is enough: check the name against the function definition.',
        fixed: P(SAVELOAD, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    save_items(shop, 2, "shop.txt");
    printf("%d\n", load_items(shop, 2, "shop.txt"));`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(SAVELOAD, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    Item loaded[2];
    int count;
    save_items(shop, 2, "shop.txt");
    shop[0].stock = 99;
    count = load_items(loaded, 2, "shop.txt");
    printf("%d\n", loaded[0].stock);`),
            why: 'The stock was changed **after** saving, and the file was not saved again, so the file still holds the old 12. A change in memory is not in the file until you call `save_items` again.',
            right: P(SAVELOAD, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    Item loaded[2];
    int count;
    shop[0].stock = 99;
    save_items(shop, 2, "shop.txt");
    count = load_items(loaded, 2, "shop.txt");
    printf("%d\n", loaded[0].stock);`),
          },
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    char name[20];
} Person;`, String.raw`    Person p = {"Mary Ann"};
    Person q;
    FILE *f = fopen("p.txt", "w");
    fprintf(f, "%s\n", p.name);
    fclose(f);
    f = fopen("p.txt", "r");
    fscanf(f, "%s", q.name);
    fclose(f);
    printf("%s\n", q.name);`),
            why: '`%s` stops at the first **space**, so `Mary Ann` comes back as just `Mary`. For names with spaces use `fgets` for the line, or store names with an underscore (`Mary_Ann`).',
            right: P(String.raw`typedef struct {
    char name[20];
} Person;`, String.raw`    Person p = {"Mary_Ann"};
    Person q;
    FILE *f = fopen("p.txt", "w");
    fprintf(f, "%s\n", p.name);
    fclose(f);
    f = fopen("p.txt", "r");
    fscanf(f, "%s", q.name);
    fclose(f);
    printf("%s\n", q.name);`),
          },
        ],
      },
      { t: 'quiz', question: 'To change one record in a text file, the usual method is…', options: ['Load all, change in memory, save all', 'Overwrite one line with fprintf', 'Delete the file and hope', 'Use fclose twice'], answer: 0, explain: 'A text file has no “replace line 2” operation. Load into an array, change the record, and save the whole array again.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 12): the stock register',
        text: 'Type three items (name price stock). The program saves them to `stock.txt`, loads them into a **different** array to prove the file works, and prints a report with the total value of the stock. Try `Sugar 5000 12`, `Tea 800 40`, `Rice 4200 6`.',
        stdin: 'Sugar 5000 12\nTea 800 40\nRice 4200 6',
        code: String.raw`#include <stdio.h>

${SAVELOAD}

int main() {
    Item shop[3];
    Item loaded[10];
    int i, count, total = 0;
    for (i = 0; i < 3; i++) {
        scanf("%s %d %d", shop[i].name, &shop[i].price, &shop[i].stock);
    }
    save_items(shop, 3, "stock.txt");

    count = load_items(loaded, 10, "stock.txt");
    printf("Loaded %d items\n", count);
    for (i = 0; i < count; i++) {
        printf("%s: %d x %d\n", loaded[i].name, loaded[i].price, loaded[i].stock);
        total = total + loaded[i].price * loaded[i].stock;
    }
    printf("Stock value: %d\n", total);
    return 0;
}
`.replace('#include <stdio.h>', '#include <stdio.h>\n#include <string.h>'),
        output: 'Loaded 3 items\nSugar: 5000 x 12\nTea: 800 x 40\nRice: 4200 x 6\nStock value: 117200',
      },
      {
        t: 'recap',
        items: ['One record per line: `fprintf(f, "%s %d %d\\n", ...)` saves, `fscanf(...) == 3` loads.', 'A `load` function returns how many records it read, and 0 if the file is missing.', 'Stop at `max` so a long file cannot overflow the array.', 'Change one record: load all, change in memory, save all (mode `"w"`).', '`%s` stops at a space: use `_` in names or `fgets`.'],
        memory: 'Save and load are a pair.',
      },
    ],
    exercises: [
      {
        id: 'cx12-roundtrip',
        title: 'Save, load, total',
        prompt: 'The `Item` struct and the functions `save_items` and `load_items` are written for you. Read 3 items (name, price, stock), save them to `shop.txt`, load them into a **new** array and print the **stock value** of each as `Sugar 60000` (price times stock), one per line.',
        starter: P(SAVELOAD, String.raw`    Item shop[3];
    Item loaded[3];
    int i, count;
    for (i = 0; i < 3; i++) {
        scanf("%s %d %d", shop[i].name, &shop[i].price, &shop[i].stock);
    }
    // save, load into the new array, print each name and its stock value`),
        sampleInput: 'Sugar 5000 12\nTea 800 40\nRice 4200 6',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12\nTea 800 40\nRice 4200 6', expected: 'Sugar 60000\nTea 32000\nRice 25200' },
          { input: 'A 1 1\nB 2 2\nC 3 3', expected: 'A 1\nB 4\nC 9' },
          { input: 'Pen 500 10\nBook 2000 5\nBag 15000 2', expected: 'Pen 5000\nBook 10000\nBag 30000', hidden: true },
        ],
        hints: [
          '`save_items(shop, 3, "shop.txt");` then `count = load_items(loaded, 3, "shop.txt");`.',
          'Loop `for (i = 0; i < count; i++)` over `loaded`, not `shop`.',
          'Print `loaded[i].name` and `loaded[i].price * loaded[i].stock`.',
        ],
      },
      {
        id: 'cx12-update',
        title: 'Sell some stock',
        prompt: 'Read 3 items and save them to `shop.txt`. Then read a name and a quantity sold. **Load** the file, subtract the quantity from that item’s stock, **save** again, load once more and print every item as `Tea 35`. (The name is always in the list and the stock is large enough.)',
        starter: P(SAVELOAD, String.raw`    Item shop[10];
    char wanted[20];
    int qty, i, count;
    for (i = 0; i < 3; i++) {
        scanf("%s %d %d", shop[i].name, &shop[i].price, &shop[i].stock);
    }
    scanf("%s %d", wanted, &qty);
    save_items(shop, 3, "shop.txt");
    // load, change the wanted item, save, load again, print name and stock`),
        sampleInput: 'Sugar 5000 12\nTea 800 40\nRice 4200 6\nTea 5',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000 12\nTea 800 40\nRice 4200 6\nTea 5', expected: 'Sugar 12\nTea 35\nRice 6' },
          { input: 'A 1 10\nB 2 20\nC 3 30\nC 30', expected: 'A 10\nB 20\nC 0' },
          { input: 'Pen 500 10\nBook 2000 5\nBag 15000 2\nPen 1', expected: 'Pen 9\nBook 5\nBag 2', hidden: true },
        ],
        hints: [
          '`count = load_items(shop, 10, "shop.txt");` then loop over the records.',
          'When `strcmp(shop[i].name, wanted) == 0`, do `shop[i].stock = shop[i].stock - qty;`.',
          'Call `save_items(shop, count, "shop.txt");`, then `load_items` again and print `name` and `stock` in a loop.',
        ],
      },
      {
        id: 'cx12-dearest',
        title: 'The dearest item in the file',
        prompt: 'Read `n` items (name, price, stock; at most 10) and save them with `save_items`. Then open the file yourself, read the lines with `fscanf` (do not use `load_items` here) and print the name and price of the **most expensive** item, like `Most expensive: Rice 4200`.',
        starter: P(ITEM + '\n\n' + SAVE, String.raw`    Item shop[10];
    int n, i, price, stock, bestPrice = -1;
    char name[20];
    char bestName[20];
    FILE *f;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%s %d %d", shop[i].name, &shop[i].price, &shop[i].stock);
    }
    save_items(shop, n, "shop.txt");
    // read the file with fscanf, keep the most expensive item
    printf("Most expensive: %s %d\n", bestName, bestPrice);`),
        sampleInput: '3\nSugar 5000 12\nTea 800 40\nRice 4200 6',
        usesInput: true,
        tests: [
          { input: '3\nSugar 5000 12\nTea 800 40\nRice 4200 6', expected: 'Most expensive: Sugar 5000' },
          { input: '1\nSoap 1500 3', expected: 'Most expensive: Soap 1500' },
          { input: '4\nPen 500 10\nBook 2000 5\nBag 15000 2\nCap 3000 4', expected: 'Most expensive: Bag 15000', hidden: true },
        ],
        hints: [
          '`f = fopen("shop.txt", "r");` and a loop `while (fscanf(f, "%s %d %d", name, &price, &stock) == 3)`.',
          'If `price > bestPrice`, set `bestPrice = price;` and `strcpy(bestName, name);`.',
          'Close the file with `fclose(f);` before the final `printf`.',
        ],
      },
    ],
  },

  // ================================================================== 13
  {
    id: 'cx-binary',
    level: L3,
    minutes: 35,
    title: 'Binary files: fwrite, fread and fseek',
    summary: 'Save whole structs in one call and jump straight to record number k',
    blocks: [
      {
        t: 'story',
        title: 'Page 42, please',
        text: 'A text file is read from the top, line after line. To find record 500 you must read 499 lines first. Imagine a book where you must read every page to reach page 500!\n\nA **binary file** stores each record in exactly the same number of bytes, the same bytes it uses in memory. Then record `k` starts at byte `k * size`, and the program can **jump** straight there with `fseek`. Banks, game saves and databases use this idea.\n\nThe trade-off: a binary file is not readable in a notepad, and it depends on the struct’s layout. Use text when people must read it, binary when speed and exact size matter.',
      },
      { t: 'h', text: 'fwrite and fread: whole records at once' },
      { t: 'p', text: '`fwrite(&item, sizeof(Item), 1, f)` writes **one** `Item` (the address of the record, the size of one, how many, the file). `fread` has the same shape and loads records back. For an array, pass the array name and the count. Open with `"wb"` and `"rb"` (the `b` means binary). Both functions return how many records they handled.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[2] = {{"Sugar", 5000}, {"Tea", 800}};
    Item back[2];
    FILE *f = fopen("items.dat", "wb");
    int got, i;
    fwrite(shelf, sizeof(Item), 2, f);
    fclose(f);

    f = fopen("items.dat", "rb");
    got = fread(back, sizeof(Item), 2, f);
    fclose(f);
    printf("Read %d\n", got);
    for (i = 0; i < got; i++) {
        printf("%s %d\n", back[i].name, back[i].price);
    }`),
        output: 'Read 2\nSugar 5000\nTea 800',
      },
      { t: 'h', text: 'Reading until the end' },
      { t: 'p', text: 'When you do not know how many records the file holds, read **one at a time** and stop when `fread` returns less than 1.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[3] = {{"Sugar", 5000}, {"Tea", 800}, {"Rice", 4200}};
    Item one;
    FILE *f = fopen("items.dat", "wb");
    int total = 0;
    fwrite(shelf, sizeof(Item), 3, f);
    fclose(f);

    f = fopen("items.dat", "rb");
    while (fread(&one, sizeof(Item), 1, f) == 1) {
        total = total + one.price;
    }
    fclose(f);
    printf("Total: %d\n", total);`),
        output: 'Total: 10000',
      },
      { t: 'h', text: 'Jumping: fseek, ftell, rewind' },
      { t: 'p', text: '`fseek(f, offset, SEEK_SET)` moves to `offset` bytes from the **start**; `SEEK_END` counts from the end. `ftell(f)` tells the current position in bytes, and `rewind(f)` goes back to the start. To reach record number `k` (counting from 0), jump to `k * sizeof(Item)`.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[4] = {{"Sugar", 5000}, {"Tea", 800}, {"Rice", 4200}, {"Soap", 1500}};
    Item one;
    FILE *f = fopen("items.dat", "wb");
    fwrite(shelf, sizeof(Item), 4, f);
    fclose(f);

    f = fopen("items.dat", "rb");
    fseek(f, 2 * sizeof(Item), SEEK_SET);
    fread(&one, sizeof(Item), 1, f);
    printf("Record 2: %s %d\n", one.name, one.price);

    fseek(f, 0, SEEK_END);
    printf("Records: %d\n", (int)(ftell(f) / sizeof(Item)));
    fclose(f);`),
        output: 'Record 2: Rice 4200\nRecords: 4',
      },
      { t: 'tip', text: 'File size divided by `sizeof(Item)` gives the **number of records**: seek to the end, ask `ftell`, divide. No need to count anything while saving.' },
      { t: 'h', text: 'Changing a record in place' },
      { t: 'p', text: 'Mode `"r+b"` opens an existing binary file for reading **and** writing without erasing it. Seek to the record, `fwrite` the new version over the old one, and the other records are untouched. No full rewrite needed, which is the big advantage over a text file.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[3] = {{"Sugar", 5000}, {"Tea", 800}, {"Rice", 4200}};
    Item one;
    FILE *f = fopen("items.dat", "wb");
    fwrite(shelf, sizeof(Item), 3, f);
    fclose(f);

    f = fopen("items.dat", "r+b");
    fseek(f, sizeof(Item), SEEK_SET);
    fread(&one, sizeof(Item), 1, f);
    one.price = 900;
    fseek(f, sizeof(Item), SEEK_SET);
    fwrite(&one, sizeof(Item), 1, f);
    fclose(f);

    f = fopen("items.dat", "rb");
    while (fread(&one, sizeof(Item), 1, f) == 1) {
        printf("%s %d\n", one.name, one.price);
    }
    fclose(f);`),
        output: 'Sugar 5000\nTea 900\nRice 4200',
      },
      { t: 'analogy', text: 'A text file is a **scroll**: you unroll it from the top. A binary file of equal-sized records is a **drawer of numbered cards**: you go straight to card 42. Notice in the last example that the program had to seek **again** before writing: after `fread` the position had moved to the next record.' },
      {
        t: 'predict',
        code: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r[3] = {{1, 50}, {2, 70}, {3, 90}};
    Rec x;
    FILE *f = fopen("r.dat", "wb");
    fwrite(r, sizeof(Rec), 3, f);
    fclose(f);
    f = fopen("r.dat", "rb");
    fseek(f, sizeof(Rec), SEEK_SET);
    fread(&x, sizeof(Rec), 1, f);
    fclose(f);
    printf("%d %d\n", x.id, x.score);`),
        question: 'What does this program print?',
        options: ['2 70', '1 50', '3 90', '2 50'],
        answer: 0,
        explain: 'The program jumps over one record (record 0) and reads the next one, which is record 1: id 2 with score 70.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap: the **mode** that opens an existing binary file for reading and writing without erasing it.',
        template: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r = {1, 50};
    FILE *f = fopen("r.dat", "wb");
    fwrite(&r, sizeof(Rec), 1, f);
    fclose(f);
    f = fopen("r.dat", "___");
    fread(&r, sizeof(Rec), 1, f);
    r.score = 99;
    fseek(f, 0, SEEK_SET);
    fwrite(&r, sizeof(Rec), 1, f);
    fclose(f);
    f = fopen("r.dat", "rb");
    fread(&r, sizeof(Rec), 1, f);
    fclose(f);
    printf("%d\n", r.score);`),
        blanks: [{ options: ['r+b', 'rb', 'ab'], answer: 'r+b' }],
        output: '99',
      },
      {
        t: 'bug',
        code: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r = {1, 50};
    FILE *f = fopen("r.dat", "wb");
    fwrite(&r, sizeof(Rec), 1, fp);
    fclose(f);
    printf("saved\n");`),
        question: 'The program stops with an error. What is wrong?',
        options: ['`fwrite` names `fp`, but the file pointer is called `f`', 'The mode "wb" does not exist', 'fwrite needs the array name', 'sizeof cannot be used with a struct'],
        answer: 0,
        explain: 'The last argument of `fwrite` must be the pointer you got from `fopen`. The program wrote `fp`, which was never declared.',
        fixed: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r = {1, 50};
    FILE *f = fopen("r.dat", "wb");
    fwrite(&r, sizeof(Rec), 1, f);
    fclose(f);
    printf("saved\n");`),
      },
      {
        t: 'mistakes',
        items: [
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r[2] = {{1, 10}, {2, 20}};
    Rec x;
    FILE *f = fopen("r.dat", "wb");
    fwrite(r, sizeof(Rec), 2, f);
    fclose(f);
    f = fopen("r.dat", "rb");
    fseek(f, 2, SEEK_SET);
    fread(&x, sizeof(Rec), 1, f);
    fclose(f);
    printf("%d\n", x.id);`),
            why: 'The program wanted record 1 but jumped **2 bytes**, which lands in the middle of the first record, so the data read is garbage. Jump in whole records: `fseek(f, 1 * sizeof(Rec), SEEK_SET);`.',
            right: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r[2] = {{1, 10}, {2, 20}};
    Rec x;
    FILE *f = fopen("r.dat", "wb");
    fwrite(r, sizeof(Rec), 2, f);
    fclose(f);
    f = fopen("r.dat", "rb");
    fseek(f, 1 * sizeof(Rec), SEEK_SET);
    fread(&x, sizeof(Rec), 1, f);
    fclose(f);
    printf("%d\n", x.id);`),
          },
          {
            logic: true,
            wrong: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r = {7, 70};
    Rec x = {0, 0};
    FILE *f = fopen("r.dat", "wb");
    fwrite(&r, sizeof(Rec), 1, f);
    fclose(f);
    f = fopen("r.dat", "wb");
    fread(&x, sizeof(Rec), 1, f);
    fclose(f);
    printf("%d\n", x.id);`),
            why: 'Opening with `"wb"` **empties** the file, so there is nothing to read and `x` stays 0. To read, open with `"rb"`. Always check the mode matches what you do next.',
            right: P(String.raw`typedef struct {
    int id;
    int score;
} Rec;`, String.raw`    Rec r = {7, 70};
    Rec x = {0, 0};
    FILE *f = fopen("r.dat", "wb");
    fwrite(&r, sizeof(Rec), 1, f);
    fclose(f);
    f = fopen("r.dat", "rb");
    fread(&x, sizeof(Rec), 1, f);
    fclose(f);
    printf("%d\n", x.id);`),
          },
        ],
      },
      { t: 'quiz', question: 'How do you find how many records a binary file holds?', options: ['Seek to the end, take `ftell`, divide by the record size', 'Count the lines', 'Call `fcount`', 'It is not possible'], answer: 0, explain: 'The file size in bytes (`ftell` after `SEEK_END`) divided by `sizeof(record)` is the number of records.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 13): the record cabinet',
        text: 'The program saves 4 items in a binary file, asks for a **record number** (from 0) and shows that one card **without reading the others**. It also prints how many records the file holds. Try `2`, then `0`, then `3`.',
        stdin: '2',
        code: String.raw`#include <stdio.h>

typedef struct {
    char name[20];
    int price;
} Item;

int main() {
    Item shelf[4] = {{"Sugar", 5000}, {"Tea", 800}, {"Rice", 4200}, {"Soap", 1500}};
    Item one;
    FILE *f;
    int k, records;
    scanf("%d", &k);

    f = fopen("cabinet.dat", "wb");
    fwrite(shelf, sizeof(Item), 4, f);
    fclose(f);

    f = fopen("cabinet.dat", "rb");
    fseek(f, 0, SEEK_END);
    records = (int)(ftell(f) / sizeof(Item));
    printf("Records: %d\n", records);
    if (k < 0 || k >= records) {
        printf("No such record\n");
    } else {
        fseek(f, k * sizeof(Item), SEEK_SET);
        fread(&one, sizeof(Item), 1, f);
        printf("Record %d: %s %d\n", k, one.name, one.price);
    }
    fclose(f);
    return 0;
}
`,
        output: 'Records: 4\nRecord 2: Rice 4200',
      },
      {
        t: 'recap',
        items: ['`"wb"`, `"rb"`, `"r+b"`: binary modes (write, read, read and write).', '`fwrite(&rec, sizeof(Rec), n, f)` and `fread(...)` move whole records.', '`fseek(f, k * sizeof(Rec), SEEK_SET)` jumps to record k; `ftell` and `rewind` report and reset the position.', 'Records in file = size in bytes / `sizeof(Rec)`.', 'Do not use `f` after `fclose(f)`.'],
        memory: 'Equal-sized cards, jump by number.',
      },
    ],
    exercises: [
      {
        id: 'cx13-save-names',
        title: 'Binary round trip',
        prompt: 'Read 3 items (name, price) into an array. Write the array to `items.dat` with **one** `fwrite`, read it back into a second array with **one** `fread`, and print the names in **reverse** order, one per line.',
        starter: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item a[3];
    Item b[3];
    int i;
    FILE *f;
    for (i = 0; i < 3; i++) {
        scanf("%s %d", a[i].name, &a[i].price);
    }
    // fwrite the array, fread it into b, print the names backwards`),
        sampleInput: 'Sugar 5000\nTea 800\nRice 4200',
        usesInput: true,
        tests: [
          { input: 'Sugar 5000\nTea 800\nRice 4200', expected: 'Rice\nTea\nSugar' },
          { input: 'A 1\nB 2\nC 3', expected: 'C\nB\nA' },
          { input: 'Pen 500\nBook 2000\nBag 15000', expected: 'Bag\nBook\nPen', hidden: true },
        ],
        hints: [
          '`f = fopen("items.dat", "wb"); fwrite(a, sizeof(Item), 3, f); fclose(f);`',
          '`f = fopen("items.dat", "rb"); fread(b, sizeof(Item), 3, f); fclose(f);`',
          'Print `b[i].name` with `i` from 2 down to 0.',
        ],
      },
      {
        id: 'cx13-record-k',
        title: 'Go to record k',
        prompt: 'The program saves 4 items to `items.dat` for you. Read a record number `k` (0 to 3) and print only that item as `Rice 4200`, using `fseek` and **one** `fread`.',
        starter: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[4] = {{"Sugar", 5000}, {"Tea", 800}, {"Rice", 4200}, {"Soap", 1500}};
    Item one;
    int k;
    FILE *f = fopen("items.dat", "wb");
    fwrite(shelf, sizeof(Item), 4, f);
    fclose(f);
    scanf("%d", &k);
    // open for reading, jump to record k, read one item, print it`),
        sampleInput: '2',
        usesInput: true,
        tests: [
          { input: '2', expected: 'Rice 4200' },
          { input: '0', expected: 'Sugar 5000' },
          { input: '3', expected: 'Soap 1500', hidden: true },
        ],
        hints: [
          '`f = fopen("items.dat", "rb");`',
          '`fseek(f, k * sizeof(Item), SEEK_SET);` then `fread(&one, sizeof(Item), 1, f);`',
          'Print with `printf("%s %d\\n", one.name, one.price);` and close the file.',
        ],
      },
      {
        id: 'cx13-edit',
        title: 'Edit in place',
        prompt: 'The program saves 3 items to `items.dat`. Read a record number `k` and a new price. Open the file with `"r+b"`, read record `k`, set its price, **write it back** to the same place, then read the whole file and print every item as `Tea 900`.',
        starter: P(String.raw`typedef struct {
    char name[20];
    int price;
} Item;`, String.raw`    Item shelf[3] = {{"Sugar", 5000}, {"Tea", 800}, {"Rice", 4200}};
    Item one;
    int k, newPrice;
    FILE *f = fopen("items.dat", "wb");
    fwrite(shelf, sizeof(Item), 3, f);
    fclose(f);
    scanf("%d %d", &k, &newPrice);
    // open with r+b, read record k, change the price, write it back, then print all items`),
        sampleInput: '1 900',
        usesInput: true,
        tests: [
          { input: '1 900', expected: 'Sugar 5000\nTea 900\nRice 4200' },
          { input: '0 1', expected: 'Sugar 1\nTea 800\nRice 4200' },
          { input: '2 7000', expected: 'Sugar 5000\nTea 800\nRice 7000', hidden: true },
        ],
        hints: [
          '`f = fopen("items.dat", "r+b");` then `fseek(f, k * sizeof(Item), SEEK_SET);` and `fread(&one, ...)`.',
          'After changing `one.price`, **seek again** to the same place before `fwrite(&one, sizeof(Item), 1, f);`.',
          'Close, reopen with `"rb"` and print with `while (fread(&one, sizeof(Item), 1, f) == 1)`.',
        ],
      },
    ],
  },

  // ================================================================== 14
  {
    id: 'cx-capstone',
    level: L4,
    minutes: 45,
    title: 'Capstone: the stock system with a saved file',
    summary: 'Bring structs, memory, lists of records and files together in one working program',
    blocks: [
      {
        t: 'story',
        title: 'Everything together',
        text: 'You can now define your own types (`struct`, `enum`), reserve memory while the program runs (`malloc`), and keep data in files (text and binary). This lesson puts it all in one program, the kind of program a real shop could use: a **stock system** that loads the stock from a file when it starts, accepts commands (add an item, sell some, list), and saves the stock when it finishes.\n\nThe program is built from small, named functions, so each part can be understood and tested alone. That is how larger programs are made.',
      },
      { t: 'h', text: 'The plan' },
      { t: 'p', text: 'Four parts, each a function: **load** (file → array), **save** (array → file), **add** an item, **sell** some of an item. `sell` returns a **code**: 1 for success, 0 for unknown item, -1 for not enough stock, so the caller decides what to print. Returning a code instead of printing inside the function makes the function reusable.' },
      {
        t: 'try',
        code: P(String.raw`typedef struct {
    char name[20];
    int price;
    int stock;
} Item;

int sell(Item *items, int count, char *name, int qty) {
    int i;
    for (i = 0; i < count; i++) {
        if (strcmp(items[i].name, name) == 0) {
            if (items[i].stock < qty) {
                return -1;
            }
            items[i].stock = items[i].stock - qty;
            return 1;
        }
    }
    return 0;
}`, String.raw`    Item shop[2] = {{"Sugar", 5000, 12}, {"Tea", 800, 40}};
    printf("%d\n", sell(shop, 2, "Tea", 5));
    printf("%d\n", sell(shop, 2, "Tea", 100));
    printf("%d\n", sell(shop, 2, "Milk", 1));
    printf("Tea left: %d\n", shop[1].stock);`),
        output: '1\n-1\n0\nTea left: 35',
      },
      { t: 'h', text: 'The command loop' },
      { t: 'p', text: 'The program reads a **command word** and acts on it: `add`, `sell`, `list`, `quit`. A `while` loop with `scanf("%s", cmd)` and a chain of `strcmp` tests is the classic shape of a small menu-driven program. It reads from the keyboard (here, from the input box) until it sees `quit`.' },
      {
        t: 'predict',
        code: P('', String.raw`    char commands[] = "aasqa";
    int total = 0, i;
    for (i = 0; commands[i] != '\0'; i++) {
        if (commands[i] == 'a') {
            total = total + 5;
        } else if (commands[i] == 's') {
            total = total - 3;
        } else if (commands[i] == 'q') {
            break;
        }
    }
    printf("%d\n", total);`),
        question: 'Each letter is a command: `a` adds 5, `s` subtracts 3, `q` quits the loop with `break`. What does this program print?',
        options: ['7', '12', '10', '9'],
        answer: 0,
        explain: '`a` and `a` give 10, `s` makes 7, then `q` stops the loop. The last `a` is never read. A real command loop works the same way, but reads whole words.',
      },
      {
        t: 'fill',
        prompt: 'Fill the gap: the **return code** that means “not enough stock”.',
        template: P(String.raw`typedef struct {
    int stock;
} Box;

int take(Box *b, int qty) {
    if (b->stock < qty) {
        return ___;
    }
    b->stock = b->stock - qty;
    return 1;
}`, String.raw`    Box b = {5};
    printf("%d\n", take(&b, 9));`),
        blanks: [{ options: ['-1', '1', '5'], answer: '-1' }],
        output: '-1',
      },
      { t: 'quiz', question: 'Why does `sell` **return a code** instead of printing a message itself?', options: ['The caller can decide what to show, and the function can be reused', 'printf is not allowed in functions', 'Codes use less memory', 'A function must return something'], answer: 0, explain: 'A function that only does the work and reports the result can be used by a text menu today and a graphical screen tomorrow. The printing belongs to the caller.' },
      {
        t: 'project',
        title: 'The Campus Duuka, part 2 (step 14): the stock system',
        text: 'Commands (one per line): `add name price stock`, `sell name qty`, `list` and `quit`. On `quit` the program **saves** the stock to `stock.txt`, then **loads it into a fresh array** and prints it, to prove the file holds the data. Try the sample, then your own commands.',
        stdin: 'add Sugar 5000 12\nadd Tea 800 40\nsell Tea 5\nsell Milk 1\nsell Sugar 99\nlist\nquit',
        code: String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int price;
    int stock;
} Item;

${SAVE}

${LOAD}

int sell(Item *items, int count, char *name, int qty) {
    int i;
    for (i = 0; i < count; i++) {
        if (strcmp(items[i].name, name) == 0) {
            if (items[i].stock < qty) {
                return -1;
            }
            items[i].stock = items[i].stock - qty;
            return 1;
        }
    }
    return 0;
}

void show(Item *items, int count) {
    int i;
    for (i = 0; i < count; i++) {
        printf("%-8s %6d %4d\n", items[i].name, items[i].price, items[i].stock);
    }
}

int main() {
    Item shop[20];
    Item again[20];
    char cmd[20];
    char name[20];
    int count = 0, price, stock, qty, code;

    while (scanf("%s", cmd) == 1) {
        if (strcmp(cmd, "add") == 0) {
            scanf("%s %d %d", name, &price, &stock);
            if (count < 20) {
                strcpy(shop[count].name, name);
                shop[count].price = price;
                shop[count].stock = stock;
                count++;
            }
        } else if (strcmp(cmd, "sell") == 0) {
            scanf("%s %d", name, &qty);
            code = sell(shop, count, name, qty);
            if (code == 1) {
                printf("Sold %d %s\n", qty, name);
            } else if (code == 0) {
                printf("No such item: %s\n", name);
            } else {
                printf("Not enough %s\n", name);
            }
        } else if (strcmp(cmd, "list") == 0) {
            show(shop, count);
        } else if (strcmp(cmd, "quit") == 0) {
            break;
        }
    }

    save_items(shop, count, "stock.txt");
    count = load_items(again, 20, "stock.txt");
    printf("Saved and loaded %d items\n", count);
    show(again, count);
    return 0;
}
`,
        output: 'Sold 5 Tea\nNo such item: Milk\nNot enough Sugar\nSugar      5000   12\nTea         800   35\nSaved and loaded 2 items\nSugar      5000   12\nTea         800   35',
      },
      {
        t: 'recap',
        items: ['Split a program into small functions with one job each (load, save, add, sell, show).', 'Return a **code** from a function and let the caller print.', 'A `while (scanf("%s", cmd) == 1)` loop with `strcmp` tests is a command loop.', 'Save on exit and load on start: that is how programs remember.', 'You now know the whole path: types, memory, files. Next comes writing programs of your own.'],
        memory: 'Small functions, one job each.',
      },
    ],
    exercises: [
      {
        id: 'cx14-restock',
        title: 'Write restock',
        prompt: 'Complete `restock`, which adds `qty` to the stock of the item with that name and returns `1`, or returns `0` when no item has that name. The main program is written for you.',
        starter: String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int stock;
} Item;

int restock(Item *items, int count, char *name, int qty) {
    // find the item by name, add qty, return 1; return 0 if not found
}

int main() {
    Item shop[3] = {{"Sugar", 12}, {"Tea", 40}, {"Rice", 6}};
    char name[20];
    int qty, i;
    scanf("%s %d", name, &qty);
    if (restock(shop, 3, name, qty)) {
        for (i = 0; i < 3; i++) {
            if (strcmp(shop[i].name, name) == 0) {
                printf("%s now %d\n", name, shop[i].stock);
            }
        }
    } else {
        printf("Unknown\n");
    }
    return 0;
}
`,
        sampleInput: 'Tea 10',
        usesInput: true,
        tests: [
          { input: 'Tea 10', expected: 'Tea now 50' },
          { input: 'Rice 4', expected: 'Rice now 10' },
          { input: 'Milk 3', expected: 'Unknown', hidden: true },
        ],
        hints: [
          'Loop `for (i = 0; i < count; i++)` and compare `strcmp(items[i].name, name) == 0`.',
          'When it matches, do `items[i].stock = items[i].stock + qty;` and `return 1;`.',
          'After the loop, `return 0;`. Declare `int i;` at the top of the function.',
        ],
      },
      {
        id: 'cx14-lowstock',
        title: 'Low stock report',
        prompt: 'Read 4 items (name, stock). Save them to `stock.txt`, load them, and print every item whose stock is **below 10** as `Rice: 6`. If none is low, print `All stocked`.',
        starter: String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int stock;
} Item;

int main() {
    Item shop[4];
    Item back[4];
    int i, count = 0, low = 0;
    FILE *f;
    for (i = 0; i < 4; i++) {
        scanf("%s %d", shop[i].name, &shop[i].stock);
    }
    // write the items to stock.txt, read them back into back, print the low ones
    return 0;
}
`,
        sampleInput: 'Sugar 12\nTea 40\nRice 6\nSoap 3',
        usesInput: true,
        tests: [
          { input: 'Sugar 12\nTea 40\nRice 6\nSoap 3', expected: 'Rice: 6\nSoap: 3' },
          { input: 'A 10\nB 20\nC 30\nD 40', expected: 'All stocked' },
          { input: 'A 0\nB 9\nC 10\nD 11', expected: 'A: 0\nB: 9', hidden: true },
        ],
        hints: [
          'Write with `fprintf(f, "%s %d\\n", shop[i].name, shop[i].stock);` and read back with `fscanf(f, "%s %d", back[count].name, &back[count].stock) == 2`.',
          'Loop over `back` for `count` records; if `stock < 10` print it and add one to `low`.',
          'After the loop, `if (low == 0) printf("All stocked\\n");`.',
        ],
      },
      {
        id: 'cx14-binary-count',
        title: 'Records in the file',
        prompt: 'Read `n` (1 to 10) then `n` prices. Store each as a record `{id, price}` (id from 1) and write them all to `shop.dat` as binary. Then work out from the **file size** how many records it holds and print `Records: 4` and the **total** of all prices read back (`Total: 9500`).',
        starter: String.raw`#include <stdio.h>

typedef struct {
    int id;
    int price;
} Rec;

int main() {
    Rec r[10];
    Rec x;
    int n, i, total = 0, records;
    FILE *f;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        r[i].id = i + 1;
        scanf("%d", &r[i].price);
    }
    // write n records, find the record count from the file size, read them back and total the prices
    printf("Records: %d\n", records);
    printf("Total: %d\n", total);
    return 0;
}
`,
        sampleInput: '4\n5000 800 2200 1500',
        usesInput: true,
        tests: [
          { input: '4\n5000 800 2200 1500', expected: 'Records: 4\nTotal: 9500' },
          { input: '1\n700', expected: 'Records: 1\nTotal: 700' },
          { input: '3\n10 20 30', expected: 'Records: 3\nTotal: 60', hidden: true },
        ],
        hints: [
          '`f = fopen("shop.dat", "wb"); fwrite(r, sizeof(Rec), n, f); fclose(f);`',
          'Open with `"rb"`, `fseek(f, 0, SEEK_END);` and `records = (int)(ftell(f) / sizeof(Rec));`, then `rewind(f);`.',
          'Read with `while (fread(&x, sizeof(Rec), 1, f) == 1) { total = total + x.price; }`.',
        ],
      },
    ],
  },
];
