// Helpers shared by the web lessons.
export const HEAD_BASE = '  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mama Rose Rolex</title>';

/** A full page. css/js add the <link> and <script> tags the way a real project does. */
export const fullPage = (body, { css = false, js = false, head = '', title } = {}) =>
  `<!DOCTYPE html>\n<html lang="en">\n<head>\n${title ? HEAD_BASE.replace('Mama Rose Rolex', title) : HEAD_BASE}${head}${css ? '\n  <link rel="stylesheet" href="style.css">' : ''}\n</head>\n<body>\n${body}${js ? '\n  <script src="script.js"></script>' : ''}\n</body>\n</html>\n`;
