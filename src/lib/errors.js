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
    languages: ['python', 'c', 'web'],
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


  // ---- JavaScript (web track) -----------------------------------------------
  {
    id: 'js-ref',
    languages: ['web'],
    match: /ReferenceError: (\w+) is not defined/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not defined`,
        why: `JavaScript does not know the name "${m[1]}". You may have misspelled it, used it before creating it with let or const, or forgotten quotes around text.`,
        fix: `Check the spelling (capital and small letters matter). Create it first: const ${m[1]} = ... If you meant text, write "${m[1]}" in quotes.`,
      },
      sw: {
        title: `"${m[1]}" haijafafanuliwa`,
        why: `JavaScript haijui jina "${m[1]}". Huenda umekosea tahajia, umelitumia kabla ya kulitengeneza kwa let au const, au umesahau alama za nukuu kwenye maandishi.`,
        fix: `Angalia tahajia (herufi kubwa na ndogo zinajalisha). Litengeneze kwanza: const ${m[1]} = ... Kama ulimaanisha maandishi, andika "${m[1]}" ndani ya nukuu.`,
      },
    }),
  },
  {
    id: 'js-null-property',
    languages: ['web'],
    match: /Cannot read properties of (null|undefined) \(reading '([^']+)'\)|can't access property "([^"]+)", .+ is (null|undefined)|(null|undefined) is not an object \(evaluating '[^.']+\.([^')]+)'\)/,
    build: (m) => {
      const what = m[1] || m[4] || m[5];
      const prop = m[2] || m[3] || m[6];
      return {
        en: {
          title: `Your code tried to use "${prop}" on something that is ${what}`,
          why: what === 'null' ? 'This almost always means getElementById or querySelector found nothing. The id or selector is spelled differently in your HTML, or your script runs before the page has that element.' : 'You asked for a part of something that does not exist yet, for example the 5th item of a list with 3 items.',
          fix: what === 'null' ? 'Compare the id or selector in your JavaScript with your HTML, letter by letter. Put the script tag at the end of the body, just before </body>.' : 'Print the value with console.log() just before the error line, and check that it holds what you expect.',
        },
        sw: {
          title: `Msimbo wako ulijaribu kutumia "${prop}" kwenye kitu ambacho ni ${what}`,
          why: what === 'null' ? 'Hii karibu kila mara inamaanisha getElementById au querySelector haikupata kitu. Id au selector imeandikwa tofauti kwenye HTML yako, au script yako inaendeshwa kabla ukurasa haujapata kipengele hicho.' : 'Uliomba sehemu ya kitu ambacho bado hakipo, kwa mfano kipengee cha 5 kwenye orodha yenye vipengee 3.',
          fix: what === 'null' ? 'Linganisha id au selector kwenye JavaScript yako na HTML yako, herufi kwa herufi. Weka tagi ya script mwishoni mwa body, kabla ya </body>.' : 'Chapisha thamani kwa console.log() kabla ya mstari wenye hitilafu, kisha hakikisha ina unachotarajia.',
        },
      };
    },
  },
  {
    id: 'js-not-function',
    languages: ['web'],
    match: /TypeError: ([\w.$]+) is not a function/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not a function`,
        why: `You wrote ${m[1]}( ) as if it were a function, but it is something else, or its name is misspelled.`,
        fix: `Check the spelling and capital letters of ${m[1]}. Method names like addEventListener and querySelector are case sensitive.`,
      },
      sw: {
        title: `"${m[1]}" si function`,
        why: `Uliandika ${m[1]}( ) kana kwamba ni function, lakini ni kitu kingine, au jina lake lina makosa ya tahajia.`,
        fix: `Angalia tahajia na herufi kubwa za ${m[1]}. Majina kama addEventListener na querySelector yanajali herufi kubwa na ndogo.`,
      },
    }),
  },
  {
    id: 'js-const',
    languages: ['web'],
    match: /TypeError: Assignment to constant variable/,
    build: () => ({
      en: {
        title: 'You changed a const',
        why: 'A variable made with const can never get a new value.',
        fix: 'Change const to let at the place where the variable is created, if it needs to change.',
      },
      sw: {
        title: 'Umebadilisha const',
        why: 'Kigezo kilichotengenezwa kwa const hakiwezi kupewa thamani mpya.',
        fix: 'Badilisha const kuwa let pale kigezo kinapotengenezwa, kama kinahitaji kubadilika.',
      },
    }),
  },
  {
    id: 'js-redeclared',
    languages: ['web'],
    match: /SyntaxError: Identifier '(\w+)' has already been declared/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" was created twice`,
        why: `You wrote let or const ${m[1]} two times. A name can be created only once.`,
        fix: `Keep the first let or const ${m[1]}. For the second one, write only ${m[1]} = new value (no let or const).`,
      },
      sw: {
        title: `"${m[1]}" imetengenezwa mara mbili`,
        why: `Umeandika let au const ${m[1]} mara mbili. Jina linaweza kutengenezwa mara moja tu.`,
        fix: `Acha let au const ${m[1]} ya kwanza. Kwa ya pili, andika tu ${m[1]} = thamani mpya (bila let au const).`,
      },
    }),
  },
  {
    id: 'js-syntax-eof',
    languages: ['web'],
    match: /SyntaxError: Unexpected end of input|SyntaxError: missing \) after argument list|SyntaxError: Unexpected token '?}'?|SyntaxError: Unexpected token '?\)'?|SyntaxError: Unexpected EOF/,
    build: () => ({
      en: {
        title: 'A bracket is missing or in the wrong place',
        why: 'JavaScript reached a place where the brackets do not match: a ( [ { was opened and never closed, or a closing one has nothing to close.',
        fix: 'Go through the code and count: every ( needs a ), every { needs a }, every [ needs a ]. Look at the line number shown and the lines just above it.',
      },
      sw: {
        title: 'Mabano yamekosekana au yapo mahali pasipofaa',
        why: 'JavaScript imefika mahali ambapo mabano hayalingani: ( [ { ulifunguliwa bila kufungwa, au kuna kifunga kisicho na cha kufunga.',
        fix: 'Pitia msimbo na uhesabu: kila ( inahitaji ), kila { inahitaji }, kila [ inahitaji ]. Angalia mstari ulioonyeshwa na mistari ya juu yake.',
      },
    }),
  },
  {
    id: 'js-syntax',
    languages: ['web'],
    match: /SyntaxError: (Unexpected (?:token|identifier|string|number)[^\n]*|Invalid or unexpected token)/,
    build: (m) => ({
      en: {
        title: 'JavaScript cannot read this line',
        why: `Something is written in a way JavaScript does not understand (${m[1]}). Common causes: a missing comma or quote, a missing bracket on the line above, or a typo in a keyword.`,
        fix: 'Look at the line number shown and the line just before it. Check commas, quotes and brackets.',
      },
      sw: {
        title: 'JavaScript haiwezi kusoma mstari huu',
        why: `Kuna kitu kimeandikwa kwa namna ambayo JavaScript haielewi (${m[1]}). Sababu za kawaida: koma au nukuu iliyokosekana, bano lililokosekana kwenye mstari wa juu, au kosa la tahajia kwenye neno muhimu.`,
        fix: 'Angalia mstari ulioonyeshwa na mstari kabla yake. Kagua koma, nukuu na mabano.',
      },
    }),
  },
  {
    id: 'js-stack',
    languages: ['web'],
    match: /RangeError: Maximum call stack size exceeded/,
    build: () => ({
      en: {
        title: 'A function kept calling itself',
        why: 'A function calls itself (or two functions call each other) and never stops, so the browser ran out of room.',
        fix: 'Make sure there is a condition that makes the function stop (return) before it calls itself again.',
      },
      sw: {
        title: 'Function iliendelea kujiita yenyewe',
        why: 'Function inajiita yenyewe (au function mbili zinaitana) bila kuacha, hivyo kivinjari kimeishiwa nafasi.',
        fix: 'Hakikisha kuna sharti linalofanya function iache (return) kabla ya kujiita tena.',
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
  if (language === 'web') {
    const w = raw.match(/script\.js:(\d+)/);
    return w ? Number(w[1]) : null;
  }
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
