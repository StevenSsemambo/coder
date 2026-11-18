// Helpers shared by the C++ Pro lessons (real C++, compiled with -std=c++17 -fno-exceptions).
//
// C++ code lives in String.raw template literals so that \n stays a backslash-n exactly as the learner types it.
// (C++ code in these lessons never uses a backtick or the two characters ${ .)

export const INC_STR = '#include <iostream>\n#include <string>';

/** A complete program: `body` goes inside main. `inc` is the list of #include lines. */
export const progPro = (body, inc = INC_STR) => `${inc}\nusing namespace std;\n\nint main() {\n${body}\n    return 0;\n}\n`;

/** A complete program with functions or types written ABOVE main. */
export const progProFn = (above, body, inc = INC_STR) => `${inc}\nusing namespace std;\n\n${above}\n\nint main() {\n${body}\n    return 0;\n}\n`;
