// Helpers shared by the Java lessons.
//
// Java code lives in String.raw template literals so that \n stays a backslash-n exactly as the learner types it.
// (Java code in these lessons never uses a backtick or the two characters ${ .)
// The app finds the class that holds main, so every lesson program can simply be called Main.

/** A complete program: `body` goes inside main (indent it by 8 spaces). `imports` is a list of import lines. */
export const prog = (body, imports = '') => `${imports ? `${imports}\n\n` : ''}public class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}\n`;

/** Several import lines, for example imp('java.util.Scanner'). */
export const imp = (...names) => names.map((n) => `import ${n};`).join('\n');

/** The top of every program, as ONE line for reorder blocks (so it cannot be split up). */
export const HEAD = 'public class Main {\n    public static void main(String[] args) {';

/** Same, with the Scanner import (for programs that read input). */
export const HEAD_SCAN = 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {';

/** The two closing lines of main and of the class. */
export const TAIL = ['    }', '}'];
