// Rule-based error translator.
// Turns raw compiler / runtime messages into plain language, with a likely cause and a fix.
// It is rule based on purpose: instant, deterministic, and it runs on any phone with no AI model.
//
// Languages: en (English), sw (Kiswahili), lg (Luganda).
// Every rule must have English. Other languages are optional and fall back to English.
// NOTE: Luganda ("lg") entries are intentionally empty. They need a native speaker to write
// them so the phrasing sounds natural (see docs/CONTRIBUTING-TRANSLATIONS.md).

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'lg', label: 'Luganda (coming soon)' },
];

const HEADERS = {
  stdio: ['printf', 'scanf', 'puts', 'getchar', 'putchar', 'gets', 'fgets', 'sprintf'],
  math: ['sqrt', 'pow', 'fabs', 'floor', 'ceil', 'sin', 'cos', 'tan', 'log', 'exp'],
  string: ['strlen', 'strcpy', 'strcmp', 'strcat', 'memset', 'memcpy'],
  stdlib: ['malloc', 'free', 'atoi', 'atof', 'rand', 'srand', 'exit', 'abs'],
};
function headerFor(name) {
  for (const [file, names] of Object.entries(HEADERS)) if (names.includes(name)) return `#include <${file}.h>`;
  return null;
}

const CLOSERS = { '(': ')', '[': ']', '{': '}' };

const RULES = [
  // ---- both languages ------------------------------------------------------
  {
    id: 'timeout',
    languages: ['python', 'c'],
    match: /Time limit exceeded/i,
    build: () => ({
      en: {
        title: 'Your program ran for too long',
        why: 'It probably has an infinite loop (a loop whose condition never becomes false), or it waits for something that never comes.',
        fix: 'Check your loop condition and make sure the loop variable changes inside the loop, for example with i++. Then run again.',
      },
      sw: {
        title: 'Programu yako imechukua muda mrefu mno',
        why: 'Huenda ina kitanzi kisichoisha (infinite loop), yaani kitanzi ambacho sharti lake halibadiliki kuwa uongo, au inasubiri kitu ambacho hakitakuja.',
        fix: 'Angalia sharti la kitanzi chako na hakikisha kigezo cha kitanzi kinabadilika ndani ya kitanzi, mfano i++. Kisha endesha tena.',
      },
    }),
  },

  // ---- Python ---------------------------------------------------------------
  {
    id: 'py-name-error',
    languages: ['python'],
    match: /NameError: name '([^']+)' is not defined/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not defined`,
        why: `Python does not know the name "${m[1]}". You may have misspelled it, or used it before giving it a value.`,
        fix: `Check the spelling (capital and small letters matter). Make sure you write ${m[1]} = ... before you use it. If you meant text, put it in quotes: "${m[1]}".`,
      },
      sw: {
        title: `"${m[1]}" haijafafanuliwa`,
        why: `Python haijui jina "${m[1]}". Huenda umekosea tahajia, au umelitumia kabla ya kulipa thamani.`,
        fix: `Angalia tahajia (herufi kubwa na ndogo zinajalisha). Hakikisha umeandika ${m[1]} = ... kabla ya kulitumia. Kama ulimaanisha maandishi, yaweke kwenye alama za nukuu: "${m[1]}".`,
      },
    }),
  },
  {
    id: 'py-never-closed',
    languages: ['python'],
    match: /SyntaxError: '([(\[{])' was never closed/,
    build: (m) => ({
      en: {
        title: `A "${m[1]}" was never closed`,
        why: 'You opened a bracket but did not close it.',
        fix: `Find the opening ${m[1]} and add the matching ${CLOSERS[m[1]]}. Every opening bracket needs a closing one.`,
      },
      sw: {
        title: `Mabano "${m[1]}" hayajafungwa`,
        why: 'Ulifungua mabano lakini hukuyafunga.',
        fix: `Tafuta ${m[1]} ya kufungua kisha ongeza ${CLOSERS[m[1]]} inayolingana. Kila ya kufungua inahitaji ya kufunga.`,
      },
    }),
  },
  {
    id: 'py-missing-colon',
    languages: ['python'],
    match: /SyntaxError: expected ':'/,
    build: () => ({
      en: {
        title: 'A colon ":" is missing',
        why: 'Lines that start with if, else, elif, for, while, def or class must end with a colon.',
        fix: 'Add ":" at the end of the line, then indent the next line.',
      },
      sw: {
        title: 'Alama ya nukta mbili ":" haipo',
        why: 'Mistari inayoanza na if, else, elif, for, while, def au class lazima iishie na ":".',
        fix: 'Weka ":" mwishoni mwa mstari, kisha ingiza mstari unaofuata ndani kidogo (indent).',
      },
    }),
  },
  {
    id: 'py-unterminated-string',
    languages: ['python'],
    match: /SyntaxError: (unterminated string literal|unterminated triple-quoted)/,
    build: () => ({
      en: {
        title: 'A piece of text was not closed',
        why: 'You started text with a quote but did not finish it with a matching quote on the same line.',
        fix: 'Add the closing quote (" or \') at the end of the text.',
      },
      sw: {
        title: 'Maandishi hayajafungwa',
        why: 'Ulianza maandishi kwa alama ya nukuu lakini hukuimalizia kwa nukuu inayolingana kwenye mstari huo.',
        fix: 'Ongeza alama ya nukuu ya kufunga (" au \') mwishoni mwa maandishi.',
      },
    }),
  },
  {
    id: 'py-indentation',
    languages: ['python'],
    match: /IndentationError/,
    build: () => ({
      en: {
        title: 'The spacing at the start of a line is wrong',
        why: 'Python uses spaces at the start of a line to group code. After a line ending in ":" the next line must be indented, and lines in the same block must line up.',
        fix: 'Indent the lines inside if, for, while and def by the same number of spaces (use the Tab button). Do not indent lines that are not inside a block.',
      },
      sw: {
        title: 'Nafasi mwanzoni mwa mstari si sahihi',
        why: 'Python hutumia nafasi mwanzoni mwa mstari kupanga msimbo. Baada ya mstari unaoishia na ":" mstari unaofuata lazima uingizwe ndani, na mistari ya kundi moja lazima ilingane.',
        fix: 'Ingiza ndani mistari iliyo ndani ya if, for, while na def kwa nafasi sawa (tumia kitufe cha Tab). Usiingize ndani mistari isiyo kwenye kundi.',
      },
    }),
  },
  {
    id: 'py-syntax',
    languages: ['python'],
    match: /SyntaxError/,
    build: () => ({
      en: {
        title: 'Python cannot understand this line',
        why: 'There is a typing mistake in the code: a missing or extra symbol, or a misspelled keyword.',
        fix: 'Look at the line shown and the line just before it. Check commas, brackets, quotes and colons, and the spelling of words like if, for, while.',
      },
      sw: {
        title: 'Python haielewi mstari huu',
        why: 'Kuna kosa la kuandika: alama imepungua au imezidi, au neno muhimu limekosewa tahajia.',
        fix: 'Angalia mstari unaoonyeshwa na mstari uliotangulia. Kagua koma, mabano, nukuu na nukta mbili, pamoja na tahajia ya maneno kama if, for, while.',
      },
    }),
  },
  {
    id: 'py-zero-division',
    languages: ['python'],
    match: /ZeroDivisionError/,
    build: () => ({
      en: {
        title: 'Division by zero',
        why: 'The program tried to divide a number by 0, which is not possible.',
        fix: 'Check the value you divide by. Use an if statement to avoid dividing when it is 0.',
      },
      sw: {
        title: 'Kugawanya kwa sifuri',
        why: 'Programu ilijaribu kugawanya nambari kwa 0, jambo ambalo haliwezekani.',
        fix: 'Angalia thamani unayogawanyia. Tumia if ili kuepuka kugawanya pale ambapo ni 0.',
      },
    }),
  },
  {
    id: 'py-value-int',
    languages: ['python'],
    match: /ValueError: invalid literal for int\(\) with base 10: (.+)/,
    build: (m) => ({
      en: {
        title: `Cannot turn ${m[1]} into a whole number`,
        why: 'int() only works on text that looks like a whole number, such as "25". Letters, decimals or an empty input fail.',
        fix: 'Check what is typed in the Input box. For decimals use float() instead of int().',
      },
      sw: {
        title: `Haiwezi kubadilisha ${m[1]} kuwa nambari kamili`,
        why: 'int() hufanya kazi tu kwenye maandishi yanayofanana na nambari kamili kama "25". Herufi, desimali au ingizo tupu hushindwa.',
        fix: 'Angalia kilichoandikwa kwenye kisanduku cha Ingizo. Kwa desimali tumia float() badala ya int().',
      },
    }),
  },
  {
    id: 'py-type-operand',
    languages: ['python'],
    match: /TypeError: unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/,
    build: (m) => ({
      en: {
        title: `Cannot mix "${m[2]}" and "${m[3]}" here`,
        why: 'Python cannot combine these two kinds of values with this operator, for example a number with text.',
        fix: 'Convert one of them: int("5") turns text into a number, str(5) turns a number into text.',
      },
      sw: {
        title: `Huwezi kuchanganya "${m[2]}" na "${m[3]}" hapa`,
        why: 'Python haiwezi kuunganisha aina hizi mbili za thamani kwa kitendakazi hiki, kwa mfano nambari na maandishi.',
        fix: 'Badilisha moja yao: int("5") hubadilisha maandishi kuwa nambari, str(5) hubadilisha nambari kuwa maandishi.',
      },
    }),
  },
  {
    id: 'py-type-concat',
    languages: ['python'],
    match: /TypeError: can only concatenate str \(not "(\w+)"\) to str/,
    build: (m) => ({
      en: {
        title: `Cannot join text and "${m[1]}"`,
        why: 'The + sign joins text with text. You tried to join text with a different kind of value.',
        fix: 'Turn the other value into text with str(...), for example "Total: " + str(total).',
      },
      sw: {
        title: `Huwezi kuunganisha maandishi na "${m[1]}"`,
        why: 'Alama ya + huunganisha maandishi na maandishi. Ulijaribu kuunganisha maandishi na aina nyingine ya thamani.',
        fix: 'Badilisha thamani nyingine kuwa maandishi kwa str(...), mfano "Jumla: " + str(jumla).',
      },
    }),
  },
  {
    id: 'py-index',
    languages: ['python'],
    match: /IndexError/,
    build: () => ({
      en: {
        title: 'List position out of range',
        why: 'You asked for a position that does not exist. Lists start at position 0 and the last position is len(list) - 1.',
        fix: 'Check the position number and the length of the list. Loops should stop before the length.',
      },
      sw: {
        title: 'Nafasi iko nje ya orodha',
        why: 'Uliomba nafasi isiyopo. Orodha huanza nafasi 0 na nafasi ya mwisho ni len(orodha) - 1.',
        fix: 'Angalia namba ya nafasi na urefu wa orodha. Vitanzi vinapaswa kusimama kabla ya urefu.',
      },
    }),
  },
  {
    id: 'py-key',
    languages: ['python'],
    match: /KeyError: (.+)/,
    build: (m) => ({
      en: {
        title: `Key ${m[1]} not found`,
        why: 'The dictionary has no item with that key.',
        fix: 'Check the spelling of the key, or test first with "if key in dictionary".',
      },
      sw: {
        title: `Ufunguo ${m[1]} haupatikani`,
        why: 'Kamusi (dictionary) haina kipengele chenye ufunguo huo.',
        fix: 'Angalia tahajia ya ufunguo, au jaribu kwanza kwa "if key in dictionary".',
      },
    }),
  },
  {
    id: 'py-eof',
    languages: ['python'],
    match: /EOFError/,
    build: () => ({
      en: {
        title: 'The program asked for input that was not there',
        why: 'input() tried to read a line, but the Input box has no more lines.',
        fix: 'Type the input values in the Input box, one per line, in the order the program asks for them.',
      },
      sw: {
        title: 'Programu iliomba ingizo ambalo halikuwepo',
        why: 'input() ilijaribu kusoma mstari, lakini kisanduku cha Ingizo hakina mistari zaidi.',
        fix: 'Andika thamani za ingizo kwenye kisanduku cha Ingizo, moja kwa kila mstari, kwa mpangilio ambao programu inaziomba.',
      },
    }),
  },
  {
    id: 'py-attribute',
    languages: ['python'],
    match: /AttributeError: '(\w+)' object has no attribute '(\w+)'/,
    build: (m) => ({
      en: {
        title: `A ${m[1]} has no "${m[2]}"`,
        why: `A value of type ${m[1]} does not have something called "${m[2]}". The name may be misspelled or belong to another type.`,
        fix: 'Check the spelling and capital letters. Print type(value) to see what you really have.',
      },
      sw: {
        title: `${m[1]} haina "${m[2]}"`,
        why: `Thamani ya aina ${m[1]} haina kitu kinachoitwa "${m[2]}". Jina linaweza kuwa limekosewa tahajia au ni la aina nyingine.`,
        fix: 'Angalia tahajia na herufi kubwa na ndogo. Chapisha type(thamani) kuona una nini hasa.',
      },
    }),
  },

  // ---- C ----------------------------------------------------------------------
  {
    id: 'c-missing-include',
    languages: ['c'],
    match: /variable (\w+) does not exist/,
    when: (m) => headerFor(m[1]) !== null,
    build: (m) => {
      const header = headerFor(m[1]);
      return {
        en: {
          title: `Missing ${header} for ${m[1]}`,
          why: `${m[1]}() lives in a library. The compiler only knows it if you include the right header at the top.`,
          fix: `Add ${header} as the first line of your program.`,
        },
        sw: {
          title: `Hakuna ${header} kwa ${m[1]}`,
          why: `${m[1]}() ipo kwenye maktaba. Kikusanyaji kinaijua tu ukijumuisha faili sahihi ya kichwa juu ya programu.`,
          fix: `Ongeza ${header} kama mstari wa kwanza wa programu yako.`,
        },
      };
    },
  },
  {
    id: 'c-undeclared',
    languages: ['c'],
    match: /variable (\w+) does not exist/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not declared`,
        why: `The program uses "${m[1]}" but never created it. It may be misspelled, you may have forgotten to declare it (for example int ${m[1]};), or it is a function that does not exist.`,
        fix: `Check the spelling (C is case-sensitive). Declare the variable before using it: int ${m[1]};`,
      },
      sw: {
        title: `"${m[1]}" haijatangazwa`,
        why: `Programu inatumia "${m[1]}" lakini haikuiunda kamwe. Huenda imekosewa tahajia, umesahau kuitangaza (mfano int ${m[1]};), au ni kitendakazi kisichokuwepo.`,
        fix: `Angalia tahajia (C inatofautisha herufi kubwa na ndogo). Tangaza kigezo kabla ya kukitumia: int ${m[1]};`,
      },
    }),
  },
  {
    id: 'c-parse',
    languages: ['c'],
    match: /Parsing Failure[\s\S]*?line (\d+) \(column (\d+)\)/,
    build: (m) => ({
      en: {
        title: 'The compiler cannot understand the code',
        why: `Something is written incorrectly near line ${m[1]}. Most often a semicolon ";" is missing, a bracket or quote was not closed, or a word is misspelled.`,
        fix: `Check line ${m[1]} and the line before it. Every statement ends with ";". Every "{" needs a "}" and every "(" needs a ")".`,
      },
      sw: {
        title: 'Kikusanyaji hakielewi msimbo',
        why: `Kuna kitu kimeandikwa vibaya karibu na mstari ${m[1]}. Mara nyingi ";" imesahaulika, mabano au nukuu hazijafungwa, au neno limekosewa tahajia.`,
        fix: `Angalia mstari ${m[1]} na mstari uliotangulia. Kila taarifa inaishia na ";". Kila "{" inahitaji "}" na kila "(" inahitaji ")".`,
      },
    }),
  },
  {
    id: 'c-memory',
    languages: ['c'],
    match: /Memory overflow/,
    build: () => ({
      en: {
        title: 'Memory problem',
        why: 'The program tried to read input that was not provided, or used memory it should not (for example outside an array).',
        fix: 'If your program uses scanf, type the numbers in the Input box. If you use arrays, check that every index is between 0 and size - 1.',
      },
      sw: {
        title: 'Tatizo la kumbukumbu',
        why: 'Programu ilijaribu kusoma ingizo ambalo halikutolewa, au ilitumia kumbukumbu isiyostahili (mfano nje ya safu).',
        fix: 'Ukitumia scanf, andika nambari kwenye kisanduku cha Ingizo. Ukitumia safu (arrays), hakikisha kila kielekezi kiko kati ya 0 na ukubwa - 1.',
      },
    }),
  },
  {
    id: 'c-zero-division',
    languages: ['c'],
    match: /overflow of (Infinity|NaN)/,
    build: () => ({
      en: {
        title: 'Division by zero',
        why: 'The program tried to divide a number by 0, which is not possible.',
        fix: 'Check the value you divide by. Use an if statement to avoid dividing when it is 0.',
      },
      sw: {
        title: 'Kugawanya kwa sifuri',
        why: 'Programu ilijaribu kugawanya nambari kwa 0, jambo ambalo haliwezekani.',
        fix: 'Angalia thamani unayogawanyia. Tumia if ili kuepuka kugawanya pale ambapo ni 0.',
      },
    }),
  },
  {
    id: 'c-cast',
    languages: ['c'],
    match: /cast failed from type (.+) to (.+)/,
    build: (m) => ({
      en: {
        title: 'Wrong type of value',
        why: `You tried to put a value of type ${m[1].trim()} where ${m[2].trim()} was expected.`,
        fix: 'Use the right kind of variable: int for whole numbers, float for decimals, char for one character. Text needs a char array.',
      },
      sw: {
        title: 'Aina ya thamani si sahihi',
        why: `Ulijaribu kuweka thamani ya aina ${m[1].trim()} mahali palipotarajiwa ${m[2].trim()}.`,
        fix: 'Tumia aina sahihi ya kigezo: int kwa nambari kamili, float kwa desimali, char kwa herufi moja. Maandishi yanahitaji safu ya char.',
      },
    }),
  },
];

/** Line number mentioned by the raw error, if any. */
export function extractLine(raw, language) {
  if (!raw) return null;
  if (language === 'python') {
    const all = [...raw.matchAll(/File "<exec>", line (\d+)/g)];
    return all.length ? Number(all[all.length - 1][1]) : null;
  }
  const a = raw.match(/^(\d+):\d+/m);
  if (a) return Number(a[1]);
  const b = raw.match(/line (\d+)/);
  return b ? Number(b[1]) : null;
}

/** Keep only the useful part of a raw error (drop internal frames). */
export function cleanRaw(raw, language) {
  if (!raw) return '';
  if (language !== 'python') return raw.trim();
  const lines = raw.trim().split('\n');
  const userFrame = lines.findIndex((l) => /File "<exec>"/.test(l));
  return (userFrame >= 0 ? lines.slice(userFrame) : lines.slice(-3)).join('\n');
}

/**
 * Translate a raw error.
 * @returns { id, title, why, fix, lang, fellBack, line } or null when no rule matches
 */
export function translateError(raw, { language, lang = 'en' }) {
  if (!raw) return null;
  for (const rule of RULES) {
    if (!rule.languages.includes(language)) continue;
    const m = raw.match(rule.match);
    if (!m) continue;
    if (rule.when && !rule.when(m)) continue;
    const entry = rule.build(m);
    const chosen = entry[lang] || entry.en;
    return {
      id: rule.id,
      ...chosen,
      lang: entry[lang] ? lang : 'en',
      fellBack: lang !== 'en' && !entry[lang],
      line: extractLine(raw, language),
    };
  }
  return null;
}
