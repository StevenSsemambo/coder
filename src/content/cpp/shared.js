// Helpers shared by the C++ lessons.
//
// C++ code lives in String.raw template literals so that \n stays a backslash-n exactly as the learner
// types it. (C++ code in these lessons never uses a backtick or the two characters ${ .)

/** The include lines that most programs need. */
export const IO = '#include <iostream>';
export const IO_FMT = '#include <iostream>\n#include <iomanip>';

/** A complete program: `body` goes inside main. `inc` is the list of #include lines. */
export const prog = (body, inc = IO) => `${inc}\nusing namespace std;\n\nint main() {\n${body}\n    return 0;\n}\n`;

/** The top of every program, as ONE line for reorder blocks (so it cannot be split up). */
export const HEAD = `${IO}\nusing namespace std;\n\nint main() {`;
export const HEAD_FMT = `${IO_FMT}\nusing namespace std;\n\nint main() {`;

/** A complete program with functions written ABOVE main: `fns` goes before main, `body` inside it. */
export const progFn = (fns, body, inc = IO) => `${inc}\nusing namespace std;\n\n${fns}\n\nint main() {\n${body}\n    return 0;\n}\n`;
