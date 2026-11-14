// Helpers shared by the C lessons.
//
// C code lives in String.raw template literals so that \n stays a backslash-n exactly as the learner
// types it. (C code in these lessons never uses a backtick or the two characters ${ .)

/** A complete program: `body` goes inside main. `inc` is the list of #include lines. */
export const prog = (body, inc = '#include <stdio.h>') => `${inc}\n\nint main() {\n${body}\n    return 0;\n}\n`;

/** Same as `prog`, used for the exercise starters (kept under its old name). */
export const skeleton = prog;

/** Several include lines. */
export const inc = (...names) => names.map((n) => `#include <${n}.h>`).join('\n');

/** The top of every program, as ONE line for reorder blocks (so it cannot be split up). */
export const HEAD = '#include <stdio.h>\n\nint main() {';
