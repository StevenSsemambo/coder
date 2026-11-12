/* SayMaCoder web engine.
 *
 * ONE classic script that is used in three places, so the behaviour is identical everywhere:
 *   1. the app (imported as raw text with `?raw`, then evaluated once for buildDocument / lint),
 *   2. inside the sandboxed preview iframe (the text is injected into the page it builds),
 *   3. the Node test-suite (required directly, run against jsdom).
 *
 * Keep it dependency free and mostly ES5. Do not use `import` or `export` in this file.
 */
var SMEngine = (function () {
  'use strict';

  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 };

  function lineAt(text, index) {
    var n = 1;
    for (var i = 0; i < index && i < text.length; i += 1) if (text.charCodeAt(i) === 10) n += 1;
    return n;
  }

  /** How console.log shows a value. Lessons rely on this exact format. */
  function fmt(v) {
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean' || v === null || v === undefined || typeof v === 'bigint') return String(v);
    if (typeof v === 'function') return String(v);
    if (v instanceof Error) return v.name + ': ' + v.message;
    try {
      var s = JSON.stringify(v);
      return s === undefined ? String(v) : s;
    } catch (e) {
      return String(v);
    }
  }

  // ------------------------------------------------------------------------------------------
  // Loop guard: stops a runaway `while (true) {}` from freezing the phone.
  // It adds `__sm_guard();` as the first statement inside every braced for/while/do loop.
  // (Lessons always teach braces. A loop without braces is simply not guarded.)
  // ------------------------------------------------------------------------------------------
  function skipString(src, i) {
    var q = src[i];
    var j = i + 1;
    while (j < src.length) {
      if (src[j] === '\\') j += 2;
      else if (src[j] === q) return j + 1;
      else j += 1;
    }
    return src.length;
  }

  function matchParen(src, open) {
    var depth = 0;
    for (var i = open; i < src.length; i += 1) {
      var c = src[i];
      if (c === '"' || c === "'" || c === '`') {
        i = skipString(src, i) - 1;
      } else if (c === '(') depth += 1;
      else if (c === ')') {
        depth -= 1;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function guardLoops(src) {
    var out = '';
    var i = 0;
    var n = src.length;
    var isId = function (c) { return /[A-Za-z0-9_$]/.test(c); };
    while (i < n) {
      var c = src[i];
      var d = src[i + 1];
      if (c === '/' && d === '/') {
        var e = src.indexOf('\n', i);
        if (e < 0) e = n;
        out += src.slice(i, e);
        i = e;
        continue;
      }
      if (c === '/' && d === '*') {
        var e2 = src.indexOf('*/', i + 2);
        e2 = e2 < 0 ? n : e2 + 2;
        out += src.slice(i, e2);
        i = e2;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') {
        var j = skipString(src, i);
        out += src.slice(i, j);
        i = j;
        continue;
      }
      if (/[A-Za-z_$]/.test(c) && (i === 0 || (!isId(src[i - 1]) && src[i - 1] !== '.'))) {
        var j2 = i;
        while (j2 < n && isId(src[j2])) j2 += 1;
        var w = src.slice(i, j2);
        out += w;
        i = j2;
        var k = i;
        while (k < n && /\s/.test(src[k])) k += 1;
        if (w === 'for' || w === 'while') {
          if (src[k] === '(') {
            var close = matchParen(src, k);
            if (close > 0) {
              var m = close + 1;
              while (m < n && /\s/.test(src[m])) m += 1;
              if (src[m] === '{') {
                out += src.slice(i, m + 1) + '__sm_guard();';
                i = m + 1;
              }
            }
          }
        } else if (w === 'do' && src[k] === '{') {
          out += src.slice(i, k + 1) + '__sm_guard();';
          i = k + 1;
        }
        continue;
      }
      out += c;
      i += 1;
    }
    return out;
  }

  // ------------------------------------------------------------------------------------------
  // The page the student's three files make.
  // ------------------------------------------------------------------------------------------
  var CONFIG_TOKEN = '__SM_' + 'CONFIG__'; // built in two pieces so this file never contains the token itself

  function svgToUri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /** The harness runs INSIDE the preview page. It is turned into text with toString(). */
  function harness(config) {
    var sm = (window.__sm = { logs: [], errors: [], storage: {} });
    var E = window.SMEngine;
    function post(m) {
      if (!config.post) return;
      try {
        m.__sm = true;
        m.id = config.id;
        window.parent.postMessage(m, '*');
      } catch (e) { /* ignore */ }
    }

    ['log', 'info', 'warn', 'error', 'debug', 'table'].forEach(function (level) {
      console[level] = function () {
        var text = Array.prototype.map.call(arguments, E.fmt).join(' ');
        var lv = level === 'table' || level === 'debug' ? 'log' : level;
        sm.logs.push({ level: lv, text: text });
        post({ type: 'log', level: lv, text: text });
      };
    });

    // Which line of the student's script.js is this? Browsers count lines in the whole page, so we subtract
    // the harness. Some engines already count from the script itself: those numbers are accepted too.
    function pickLine(lineno, stack) {
      var off = config.jsOffset || 0;
      var cands = lineno ? [lineno] : [];
      String(stack || '').replace(/:(\d+):\d+/g, function (m, n) { cands.push(Number(n)); return m; });
      var i;
      if (!config.jsLines) return lineno || null;
      for (i = 0; i < cands.length; i += 1) if (cands[i] >= off + 1 && cands[i] <= off + config.jsLines + 1) return cands[i] - off;
      for (i = 0; i < cands.length; i += 1) if (cands[i] >= 1 && cands[i] <= config.jsLines + 1) return cands[i];
      return null;
    }
    function record(message, lineno, stack) {
      var line = pickLine(lineno, stack);
      var raw = String(message || 'Error').replace(/^Uncaught /, '') + (line ? '\n    at script.js:' + line + ':1' : '');
      sm.errors.push(raw);
      post({ type: 'error', raw: raw, line: line });
    }
    window.addEventListener('error', function (e) {
      var named = e.error && e.error.name ? e.error.name + ': ' + e.error.message : e.message;
      record(named, e.lineno, e.error && e.error.stack);
    });
    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason;
      record(r && r.name ? r.name + ': ' + r.message : String(r), 0, r && r.stack);
    });

    var guardN = 0;
    var guardPending = false;
    window.__sm_guard = function () {
      if (!guardPending) {
        guardPending = true;
        Promise.resolve().then(function () { guardN = 0; guardPending = false; });
      }
      guardN += 1;
      if (guardN > 3000000) {
        guardN = 0;
        throw new Error('Time limit exceeded: a loop ran too many times. Is it an infinite loop?');
      }
    };

    // localStorage and sessionStorage do not exist inside a sandboxed page: give it a pretend one.
    function makeStorage(name) {
      var data = {};
      var seed = (config.store && config.store[name]) || {};
      Object.keys(seed).forEach(function (k) { data[k] = seed[k]; });
      var sync = function () { sm.storage[name] = Object.assign({}, data); post({ type: 'storage', name: name, data: sm.storage[name] }); };
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
        setItem: function (k, v) { data[k] = String(v); sync(); },
        removeItem: function (k) { delete data[k]; sync(); },
        clear: function () { data = {}; sync(); },
        key: function (i) { return Object.keys(data)[i] === undefined ? null : Object.keys(data)[i]; },
        get length() { return Object.keys(data).length; },
      };
    }
    ['localStorage', 'sessionStorage'].forEach(function (name) {
      var shim = makeStorage(name);
      try {
        Object.defineProperty(window, name, { configurable: true, get: function () { return shim; } });
      } catch (e) { /* ignore */ }
    });

    // A pretend server: fetch("/api/products") answers from the lesson's `api` table.
    var routes = config.api || {};
    window.fetch = function (url, opts) {
      var key = String(url).replace(/^https?:\/\/[^/]+/, '').split('?')[0];
      var method = ((opts && opts.method) || 'GET').toUpperCase();
      var found = Object.prototype.hasOwnProperty.call(routes, key);
      var body = found ? routes[key] : { error: 'Not found' };
      if (found && method !== 'GET' && opts && opts.body) {
        try { body = { ok: true, received: JSON.parse(opts.body) }; } catch (e) { body = { ok: true }; }
      }
      var status = found ? (method === 'POST' ? 201 : 200) : 404;
      var text = JSON.stringify(body);
      var res = {
        ok: status >= 200 && status < 300,
        status: status,
        statusText: found ? 'OK' : 'Not Found',
        headers: { get: function () { return 'application/json'; } },
        json: function () { return Promise.resolve(JSON.parse(text)); },
        text: function () { return Promise.resolve(text); },
        clone: function () { return res; },
      };
      return new Promise(function (resolve) { setTimeout(function () { resolve(res); }, config.apiDelay || 0); });
    };

    // Pop-ups are blocked in a sandboxed page: show them in the console instead.
    window.alert = function (m) { var t = '[alert] ' + E.fmt(m); sm.logs.push({ level: 'info', text: t }); post({ type: 'log', level: 'info', text: t }); };
    window.confirm = function (m) { window.alert(m); return true; };
    window.prompt = function (m) { window.alert(m); return config.promptAnswer === undefined ? '' : config.promptAnswer; };

    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.__sm_cmd !== 'checks') return;
      Promise.resolve(E.runChecks(window, d.checks, { files: d.files })).then(function (results) {
        post({ type: 'checks', token: d.token, results: results });
      });
    });
    window.addEventListener('load', function () { post({ type: 'ready' }); });
  }

  /**
   * Build the full HTML document for a preview.
   * files: { html, css, js }
   * opts:  { harness (default true), guard (default true), strict (do not add css/js that the HTML does not link), engineSource, post, id, assets, api, apiDelay, store, promptAnswer }
   * Returns { html, jsOffset }.
   */
  function buildDocument(files, opts) {
    opts = opts || {};
    var html = String(files.html || '');
    var css = String(files.css || '');
    var js = String(files.js || '');
    var guard = opts.guard !== false;
    var assets = opts.assets || {};

    if (!/<!doctype|<html[\s>]|<body[\s>]/i.test(html)) {
      html =
        '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Preview</title>\n</head>\n<body>\n' +
        html +
        '\n</body>\n</html>';
    }

    // Files from the lesson's asset library ("img/logo.svg") become real, offline images.
    html = html.replace(/(\s(?:src|href|poster)\s*=\s*)(["'])([^"']+)\2/gi, function (all, pre, q, val) {
      if (!Object.prototype.hasOwnProperty.call(assets, val)) return all;
      var a = assets[val];
      return pre + q + (/^\s*<svg/i.test(a) ? svgToUri(a) : a) + q;
    });

    // <link rel="stylesheet" href="style.css">  ->  the student's CSS file
    var usedCss = false;
    html = html.replace(/<link\b[^>]*rel\s*=\s*["']?stylesheet["']?[^>]*>/gi, function (tag) {
      var href = (tag.match(/href\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || '';
      if (/^(https?:)?\/\//i.test(href) || /^data:/i.test(href)) return tag;
      if (usedCss) return '';
      usedCss = true;
      return '<style>\n' + css + '\n</style>';
    });
    if (!usedCss && css.trim() && !opts.strict) {
      var style = '<style>\n' + css + '\n</style>';
      html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, function () { return style + '\n</head>'; }) : style + html;
    }

    // <script src="script.js"></script>  ->  the student's JavaScript file
    var usedJs = false;
    var safeJs = function (code) { return (guard ? guardLoops(code) : code).replace(/<\/script/gi, '<\\/script'); };
    html = html.replace(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/script>/gi, function (tag, src) {
      if (/^(https?:)?\/\//i.test(src)) return tag;
      if (usedJs) return '';
      usedJs = true;
      return '<script>/*sm-js*/' + safeJs(js) + '\n</script>';
    });
    if (!usedJs && js.trim() && !opts.strict) {
      var script = '<script>/*sm-js*/' + safeJs(js) + '\n</script>';
      html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, function () { return script + '\n</body>'; }) : html + script;
    }
    // Scripts written directly in the HTML file are guarded too.
    if (guard) {
      html = html.replace(/<script\b(?![^>]*\bsrc\b)([^>]*)>([\s\S]*?)<\/script>/gi, function (all, attrs, body) {
        return body.indexOf('/*sm-js*/') === 0 ? all : '<script' + attrs + '>' + guardLoops(body) + '</script>';
      });
    }

    var jsOffset = 0;
    if (opts.harness !== false) {
      var config = { post: !!opts.post, id: opts.id || 0, jsOffset: 0, jsLines: 0, api: opts.api || {}, apiDelay: opts.apiDelay || 0, store: opts.store || {}, promptAnswer: opts.promptAnswer };
      var source = String(opts.engineSource || '') + '\n;window.SMEngine = SMEngine;\n(' + harness.toString() + ')(' + CONFIG_TOKEN + ');';
      source = source.replace(/<\/script/gi, '<\\/script');
      var tag = '<script>' + source + '</script>';
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, function (m) { return m + '\n' + tag; }) : /<html[^>]*>/i.test(html) ? html.replace(/<html[^>]*>/i, function (m) { return m + '\n' + tag; }) : tag + html;
      var marker = html.indexOf('/*sm-js*/');
      jsOffset = marker < 0 ? 0 : lineAt(html, marker) - 1;
      config.jsOffset = jsOffset;
      config.jsLines = marker < 0 ? 0 : js.split('\n').length;
      html = html.replace(CONFIG_TOKEN, function () { return JSON.stringify(config).replace(/</g, '\\u003c'); });
    }
    return { html: html, jsOffset: jsOffset };
  }

  // ------------------------------------------------------------------------------------------
  // Colours: so `red`, `#f00` and `rgb(255,0,0)` are all the same colour to the checker.
  // ------------------------------------------------------------------------------------------
  var NAMED = {
    black: '0,0,0', white: '255,255,255', red: '255,0,0', green: '0,128,0', blue: '0,0,255', yellow: '255,255,0', orange: '255,165,0',
    purple: '128,0,128', pink: '255,192,203', gray: '128,128,128', grey: '128,128,128', brown: '165,42,42', navy: '0,0,128', teal: '0,128,128',
    gold: '255,215,0', tomato: '255,99,71', crimson: '220,20,60', coral: '255,127,80', salmon: '250,128,114', lime: '0,255,0', cyan: '0,255,255',
    magenta: '255,0,255', maroon: '128,0,0', olive: '128,128,0', silver: '192,192,192', ivory: '255,255,240', beige: '245,245,220',
    khaki: '240,230,140', lavender: '230,230,250', indigo: '75,0,130', violet: '238,130,238', turquoise: '64,224,208', skyblue: '135,206,235',
    lightblue: '173,216,230', lightgray: '211,211,211', lightgrey: '211,211,211', darkgreen: '0,100,0', darkblue: '0,0,139', darkred: '139,0,0',
    forestgreen: '34,139,34', royalblue: '65,105,225', steelblue: '70,130,180', orangered: '255,69,0', whitesmoke: '245,245,245', transparent: '0,0,0,0',
  };

  function toRgb(value) {
    var v = String(value).trim().toLowerCase();
    var m;
    if (NAMED[v]) return v === 'transparent' ? 'rgba(0, 0, 0, 0)' : 'rgb(' + NAMED[v].split(',').join(', ') + ')';
    if ((m = v.match(/^#([0-9a-f]{3})$/))) return 'rgb(' + m[1].split('').map(function (h) { return parseInt(h + h, 16); }).join(', ') + ')';
    if ((m = v.match(/^#([0-9a-f]{6})$/))) return 'rgb(' + [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); }).join(', ') + ')';
    if ((m = v.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[,/]\s*([\d.]+)\s*)?\)$/))) {
      return m[4] !== undefined && parseFloat(m[4]) !== 1 ? 'rgba(' + m[1] + ', ' + m[2] + ', ' + m[3] + ', ' + parseFloat(m[4]) + ')' : 'rgb(' + m[1] + ', ' + m[2] + ', ' + m[3] + ')';
    }
    return null;
  }

  function normValue(v) {
    var s = String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, ' ');
    var c = toRgb(s);
    if (c) return c;
    if (/^0(px)?$/.test(s)) return '0px';
    if (s === 'bold') return '700';
    
    return s.replace(/(\d)\.0+(px|em|rem|%)/g, '$1$2').replace(/\s*,\s*/g, ', ');
  }

  function norm(t) {
    return String(t == null ? '' : t).replace(/\s+/g, ' ').trim();
  }

  function nice(sel) {
    return /^[a-z][a-z0-9]*$/i.test(sel) ? '<' + sel + '>' : sel;
  }

  // ------------------------------------------------------------------------------------------
  // The checker: runs a list of checks against a live page (a real window, or a jsdom window).
  // ------------------------------------------------------------------------------------------
  async function runChecks(win, checks, ctx) {
    ctx = ctx || {};
    var files = ctx.files || {};
    var doc = win.document;
    var results = [];
    var qa = function (sel) { return Array.prototype.slice.call(doc.querySelectorAll(sel)); };
    var pause = function (ms) { return new Promise(function (r) { win.setTimeout(r, ms); }); };

    function res(c, label, ok, detail) {
      return { label: c.label || label, passed: !!ok, detail: ok ? '' : detail || '', hidden: !!c.hidden, silent: !!c.silent };
    }
    function missing(c, sel) {
      return res(c, 'The page has a ' + nice(sel), false, 'No ' + nice(sel) + ' found yet.');
    }
    function compare(c, actual, label) {
      // equals / contains / matches against a piece of text.
      var a = norm(actual);
      var ci = c.ci !== false && (c.contains !== undefined || c.matches !== undefined) ? true : !!c.ci;
      var cmp = function (x) { return ci ? String(x).toLowerCase() : String(x); };
      if (c.equals !== undefined) return cmp(a) === cmp(norm(c.equals));
      if (c.contains !== undefined) return cmp(a).indexOf(cmp(norm(c.contains))) >= 0;
      if (c.matches !== undefined) return new RegExp(c.matches, 'i').test(a);
      return a.length > 0;
    }
    var want = function (c) {
      if (c.equals !== undefined) return 'should be "' + norm(c.equals) + '"';
      if (c.contains !== undefined) return 'should include "' + norm(c.contains) + '"';
      if (c.matches !== undefined) return 'should match ' + c.matches;
      return 'should not be empty';
    };

    var RULES = {
      'img-alt': { label: 'Every image has alt text (for screen readers and slow connections)', test: function () { var bad = qa('img').filter(function (i) { return !i.hasAttribute('alt'); }); return bad.length ? bad.length + ' image(s) have no alt attribute.' : ''; } },
      'html-lang': { label: 'The <html> tag says which language the page is in (lang="en")', test: function () { return doc.documentElement.getAttribute('lang') ? '' : 'The <html> tag has no lang attribute.'; } },
      viewport: { label: 'The page has a viewport meta tag, so it fits a phone screen', test: function () { return doc.querySelector('meta[name="viewport"]') ? '' : 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside <head>.'; } },
      title: { label: 'The page has a title', test: function () { return norm(doc.title) ? '' : 'The <title> is missing or empty.'; } },
      'one-h1': { label: 'The page has exactly one <h1>', test: function () { var n = qa('h1').length; return n === 1 ? '' : 'Found ' + n + ' <h1> headings.'; } },
      'form-labels': {
        label: 'Every form field has a label',
        test: function () {
          var bad = qa('input, select, textarea').filter(function (f) {
            var t = (f.getAttribute('type') || 'text').toLowerCase();
            if (t === 'hidden' || t === 'submit' || t === 'button') return false;
            if (f.getAttribute('aria-label')) return false;
            if (f.id && doc.querySelector('label[for="' + f.id + '"]')) return false;
            var p = f.parentElement;
            while (p) { if (p.tagName === 'LABEL') return false; p = p.parentElement; }
            return true;
          });
          return bad.length ? bad.length + ' field(s) have no label.' : '';
        },
      },
      'link-text': { label: 'No link says only "click here"', test: function () { var bad = qa('a').filter(function (a) { return /^(click here|here|link|read more)$/i.test(norm(a.textContent)); }); return bad.length ? 'A link says "' + norm(bad[0].textContent) + '". Say where it goes instead.' : ''; } },
      'buttons-type': { label: 'Every button has some text or a label', test: function () { var bad = qa('button').filter(function (b) { return !norm(b.textContent) && !b.getAttribute('aria-label'); }); return bad.length ? 'A button has no text.' : ''; } },
    };

    async function act(c) {
      var el = qa(c.target)[0];
      var name = nice(c.target);
      var nothing = function (verb) { return res(c, verb + ' ' + name, false, 'Could not find ' + name + '.'); };
      if (c.do === 'wait') { await pause(c.ms || 20); return { label: '', passed: true, detail: '', hidden: true, silent: true }; }
      if (!el) return nothing(c.do === 'click' ? 'Click' : 'Use');
      if (c.do === 'click') el.click();
      else if (c.do === 'type' || c.do === 'select') {
        el.value = String(c.value);
        el.dispatchEvent(new win.Event('input', { bubbles: true }));
        el.dispatchEvent(new win.Event('change', { bubbles: true }));
      } else if (c.do === 'check') {
        el.checked = c.value !== false;
        el.dispatchEvent(new win.Event('input', { bubbles: true }));
        el.dispatchEvent(new win.Event('change', { bubbles: true }));
      } else if (c.do === 'submit') {
        var ev = new win.Event('submit', { bubbles: true, cancelable: true });
        el.dispatchEvent(ev);
      } else if (c.do === 'key') {
        el.dispatchEvent(new win.KeyboardEvent('keydown', { key: c.value, bubbles: true }));
        el.dispatchEvent(new win.KeyboardEvent('keyup', { key: c.value, bubbles: true }));
      }
      await pause(c.ms || 15);
      return { label: '', passed: true, detail: '', hidden: true, silent: true };
    }

    async function one(c) {
      var els;
      var el;
      if (c.do) return act(c);

      if (c.exists !== undefined) {
        els = qa(c.exists);
        return els.length ? res(c, 'The page has a ' + nice(c.exists), true) : missing(c, c.exists);
      }
      if (c.count !== undefined) {
        var n = qa(c.count).length;
        var okc = (c.equals === undefined || n === c.equals) && (c.min === undefined || n >= c.min) && (c.max === undefined || n <= c.max);
        var lab = c.equals !== undefined ? 'Exactly ' + c.equals + ' ' + nice(c.count) : c.min !== undefined ? 'At least ' + c.min + ' ' + nice(c.count) : 'At most ' + c.max + ' ' + nice(c.count);
        return res(c, lab, okc, 'Found ' + n + '.');
      }
      if (c.text !== undefined) {
        els = qa(c.text);
        if (!els.length) return missing(c, c.text);
        var pool = c.index !== undefined ? [els[c.index]].filter(Boolean) : els;
        var hit = pool.some(function (e) { return compare(c, e.textContent); });
        var first = pool[0] ? norm(pool[0].textContent) : '';
        var shown = first.length > 60 ? first.slice(0, 57) + '...' : first;
        return res(c, 'The text in ' + nice(c.text) + ' ' + want(c), hit, 'Your ' + nice(c.text) + ' says "' + shown + '".');
      }
      if (c.value !== undefined && c.do === undefined && c.target === undefined && typeof c.value === 'string' && c.sel === undefined && c.field === undefined) {
        // fallthrough handled below (value of an input uses `field`)
      }
      if (c.field !== undefined) {
        el = qa(c.field)[0];
        if (!el) return missing(c, c.field);
        return res(c, 'The value of ' + nice(c.field) + ' ' + want(c), compare(c, el.value), 'It holds "' + el.value + '".');
      }
      if (c.attr !== undefined) {
        els = qa(c.attr);
        if (!els.length) return missing(c, c.attr);
        var ok = els.some(function (e) {
          var v = e.getAttribute(c.name);
          if (c.present === false) return v === null;
          if (v === null) return false;
          if (c.equals === undefined && c.contains === undefined && c.matches === undefined) return true;
          return compare(c, v);
        });
        var cur = els[0].getAttribute(c.name);
        return res(c, nice(c.attr) + ' has a ' + c.name + ' attribute' + (c.equals !== undefined ? ' of "' + c.equals + '"' : c.contains !== undefined ? ' containing "' + c.contains + '"' : ''), ok, cur === null ? 'It has no ' + c.name + ' attribute.' : 'Its ' + c.name + ' is "' + cur + '".');
      }
      if (c.style !== undefined) {
        el = qa(c.style)[0];
        if (!el) return missing(c, c.style);
        var actual = win.getComputedStyle(el).getPropertyValue(c.prop);
        var a = normValue(actual);
        var okS = true;
        if (c.is !== undefined) okS = [].concat(c.is).some(function (x) { return normValue(x) === a; });
        if (c.not !== undefined) okS = okS && [].concat(c.not).every(function (x) { return normValue(x) !== a; });
        if (c.contains !== undefined) okS = okS && a.indexOf(String(c.contains).toLowerCase()) >= 0;
        if (c.atLeast !== undefined) okS = okS && parseFloat(actual) >= c.atLeast;
        if (c.atMost !== undefined) okS = okS && parseFloat(actual) <= c.atMost;
        var goal = c.is !== undefined ? [].concat(c.is)[0] : c.not !== undefined ? 'not ' + [].concat(c.not)[0] : c.contains !== undefined ? 'containing ' + c.contains : c.atLeast !== undefined ? 'at least ' + c.atLeast : 'at most ' + c.atMost;
        return res(c, nice(c.style) + ' has ' + c.prop + ' ' + goal, okS, 'Right now its ' + c.prop + ' is ' + (a || 'empty') + '.');
      }
      if (c.visible !== undefined) {
        el = qa(c.visible)[0];
        var shownNow = !!el && win.getComputedStyle(el).getPropertyValue('display') !== 'none' && win.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden' && !el.hidden;
        var wantShown = c.is !== false;
        if (!el && wantShown) return missing(c, c.visible);
        return res(c, nice(c.visible) + (wantShown ? ' is visible' : ' is hidden'), !el ? !wantShown : shownNow === wantShown, wantShown ? 'It is hidden right now.' : 'It is still visible.');
      }
      if (c.order !== undefined) {
        var nodes = c.order.map(function (s) { return doc.querySelector(s); });
        var absent = c.order.filter(function (s, i) { return !nodes[i]; });
        if (absent.length) return missing(c, absent[0]);
        var inOrder = nodes.every(function (nd, i) { return i === 0 || (nodes[i - 1].compareDocumentPosition(nd) & 4) !== 0; });
        return res(c, 'In this order from top to bottom: ' + c.order.map(nice).join(', '), inOrder, 'They are in a different order.');
      }
      if (c.uses !== undefined) {
        var src = String(files[c.uses] || '');
        return res(c, 'Your ' + c.uses.toUpperCase() + ' uses ' + c.pattern, new RegExp(c.pattern, c.flags || 'i').test(src), 'Not found in your ' + c.uses.toUpperCase() + ' yet.');
      }
      if (c.lint !== undefined) {
        var probs = (c.lint === 'css' ? lintCss(String(files.css || '')) : lintHtml(String(files.html || ''))).filter(function (p) { return p.kind !== 'tip'; });
        return res(c, 'Your ' + String(c.lint).toUpperCase() + ' has no mistakes (every tag closed, every property spelled right)', probs.length === 0, probs[0] ? probs[0].message : '');
      }
      if (c.rule !== undefined) {
        var r = RULES[c.rule];
        if (!r) return res(c, 'Unknown rule ' + c.rule, false, 'Unknown rule.');
        var why = r.test();
        return res(c, r.label, !why, why);
      }
      if (c.js !== undefined) {
        var value;
        try {
          value = win.eval(c.js);
          if (value && typeof value.then === 'function') value = await value;
        } catch (err) {
          return res(c, c.label || 'Your code works when we run ' + c.js, false, 'Running ' + c.js + ' failed: ' + (err && err.message ? err.message : err));
        }
        var okJ = c.equals !== undefined ? JSON.stringify(value) === JSON.stringify(c.equals) : c.is !== undefined ? value === c.is : !!value;
        var human = c.label || (c.equals !== undefined || c.is !== undefined ? c.js + ' gives ' + fmt(c.equals !== undefined ? c.equals : c.is) : c.js + ' is true');
        return res(c, human, okJ, 'We got ' + fmt(value) + ' instead.');
      }
      if (c.log !== undefined) {
        var logs = ((win.__sm && win.__sm.logs) || []).map(function (l) { return l.text; });
        var okL = logs.some(function (t) { return c.equals !== undefined ? norm(t) === norm(c.log) : norm(t).toLowerCase().indexOf(norm(c.log).toLowerCase()) >= 0; });
        return res(c, 'The console shows "' + c.log + '"', okL, logs.length ? 'The console showed: ' + logs.slice(-3).join(' | ') : 'The console is empty.');
      }
      if (c.logs !== undefined) {
        var all = ((win.__sm && win.__sm.logs) || []).map(function (l) { return l.text; });
        return res(c, 'The console shows ' + c.logs.join(', then '), JSON.stringify(all) === JSON.stringify(c.logs), 'The console showed: ' + (all.join(' | ') || 'nothing'));
      }
      if (c.noErrors !== undefined) {
        var errs = (win.__sm && win.__sm.errors) || [];
        return res(c, 'Your JavaScript runs without errors', errs.length === 0, errs[0] ? String(errs[0]).split('\n')[0] : '');
      }
      return res(c, 'Unknown check', false, 'This check is not understood: ' + JSON.stringify(c));
    }

    for (var i = 0; i < checks.length; i += 1) {
      try {
        results.push(await one(checks[i]));
      } catch (err) {
        results.push({ label: checks[i].label || 'A check could not run', passed: false, detail: String((err && err.message) || err), hidden: !!checks[i].hidden, silent: false });
      }
    }
    return results.filter(function (r) { return !(r.silent && r.passed); });
  }

  // ------------------------------------------------------------------------------------------
  // Friendly linters: catch the mistakes beginners make before the checker even runs.
  // ------------------------------------------------------------------------------------------
  function lintHtml(html) {
    var problems = [];
    var re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
    var stack = [];
    var m;
    while ((m = re.exec(html))) {
      if (m[0].indexOf('<!--') === 0) continue;
      var closing = m[1] === '/';
      var tag = m[2].toLowerCase();
      var line = lineAt(html, m.index);
      if (!closing) {
        if (tag === 'script' || tag === 'style') {
          var end = html.toLowerCase().indexOf('</' + tag, re.lastIndex);
          if (end < 0) { problems.push({ line: line, message: '<' + tag + '> on line ' + line + ' is never closed. Add </' + tag + '>.' }); break; }
          var gt = html.indexOf('>', end);
          re.lastIndex = gt < 0 ? html.length : gt + 1;
          continue;
        }
        if (tag === 'img' && !/\balt\s*=/.test(m[3])) problems.push({ line: line, kind: 'tip', message: 'The <img> on line ' + line + ' has no alt text. Add alt="a short description".' });
        if (VOID[tag] || /\/\s*$/.test(m[3])) continue;
        stack.push({ tag: tag, line: line });
      } else {
        if (VOID[tag]) continue;
        var top = stack[stack.length - 1];
        if (top && top.tag === tag) {
          stack.pop();
          continue;
        }
        var depth = -1;
        for (var i = stack.length - 1; i >= 0; i -= 1) if (stack[i].tag === tag) { depth = i; break; }
        if (depth < 0) {
          problems.push({ line: line, message: '</' + tag + '> on line ' + line + ' closes a tag that was never opened.' });
        } else {
          for (var k = stack.length - 1; k > depth; k -= 1) problems.push({ line: stack[k].line, message: '<' + stack[k].tag + '> on line ' + stack[k].line + ' is never closed. Add </' + stack[k].tag + '> before </' + tag + '> on line ' + line + '.' });
          stack.length = depth;
        }
      }
    }
    stack.forEach(function (s) {
      if (s.tag === 'html' || s.tag === 'body' || s.tag === 'head') return;
      problems.push({ line: s.line, message: '<' + s.tag + '> on line ' + s.line + ' is never closed. Add </' + s.tag + '>.' });
    });
    return problems;
  }

  var PROPS = ('align-content align-items align-self animation animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-timing-function appearance aspect-ratio ' +
    'background background-attachment background-clip background-color background-image background-position background-repeat background-size backdrop-filter border border-bottom border-bottom-color border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width border-collapse border-color border-left border-left-color border-left-style border-left-width border-radius border-right border-right-color border-right-style border-right-width border-spacing border-style border-top border-top-color border-top-left-radius border-top-right-radius border-top-style border-top-width border-width bottom box-shadow box-sizing ' +
    'caret-color clear clip-path color column-gap columns content cursor direction display filter flex flex-basis flex-direction flex-flow flex-grow flex-shrink flex-wrap float font font-family font-size font-style font-variant font-weight gap grid grid-area grid-auto-columns grid-auto-flow grid-auto-rows grid-column grid-column-end grid-column-start grid-gap grid-row grid-row-end grid-row-start grid-template grid-template-areas grid-template-columns grid-template-rows ' +
    'height inset isolation justify-content justify-items justify-self left letter-spacing line-height list-style list-style-image list-style-position list-style-type margin margin-bottom margin-left margin-right margin-top max-height max-width min-height min-width mix-blend-mode object-fit object-position opacity order outline outline-color outline-offset outline-style outline-width overflow overflow-wrap overflow-x overflow-y padding padding-bottom padding-left padding-right padding-top place-content place-items place-self pointer-events position resize right row-gap scroll-behavior scroll-snap-align scroll-snap-type tab-size table-layout text-align text-decoration text-decoration-color text-decoration-line text-decoration-style text-indent text-overflow text-shadow text-transform top transform transform-origin transition transition-delay transition-duration transition-property transition-timing-function user-select vertical-align visibility white-space width word-break word-spacing word-wrap z-index').split(' ');

  function editDistance(a, b) {
    var d = [];
    for (var i = 0; i <= a.length; i += 1) { d[i] = [i]; }
    for (var j = 1; j <= b.length; j += 1) d[0][j] = j;
    for (i = 1; i <= a.length; i += 1) for (j = 1; j <= b.length; j += 1) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }

  function lintCss(css) {
    var problems = [];
    var clean = css.replace(/\/\*[\s\S]*?\*\//g, function (c) { return c.replace(/[^\n]/g, ' '); });
    var open = 0;
    var lastOpen = 0;
    for (var i = 0; i < clean.length; i += 1) {
      if (clean[i] === '{') { open += 1; lastOpen = i; }
      if (clean[i] === '}') {
        open -= 1;
        if (open < 0) { problems.push({ line: lineAt(clean, i), message: 'There is a } on line ' + lineAt(clean, i) + ' with no matching {.' }); open = 0; }
      }
    }
    if (open > 0) problems.push({ line: lineAt(clean, lastOpen), message: 'A { on line ' + lineAt(clean, lastOpen) + ' is never closed. Add a } at the end of that rule.' });

    // Declarations inside { ... } blocks.
    var blockRe = /\{([^{}]*)\}/g;
    var b;
    while ((b = blockRe.exec(clean))) {
      var bodyStart = b.index + 1;
      var decls = b[1].split(';');
      var offset = bodyStart;
      decls.forEach(function (decl) {
        var at = offset;
        offset += decl.length + 1;
        var text = decl.trim();
        if (!text) return;
        var dl = lineAt(clean, at + decl.search(/\S/));
        var two = text.match(/^([-\w]+)\s*:\s*([^\n]*)\n\s*([-\w]+)\s*:/);
        if (two) { problems.push({ line: dl, message: 'Line ' + dl + ': add a ; at the end of "' + two[1] + ': ' + two[2].trim() + '".' }); return; }
        var p = text.match(/^([-\w]+)\s*:/);
        if (!p) return;
        var prop = p[1].toLowerCase();
        if (prop.indexOf('--') === 0 || prop.indexOf('-webkit-') === 0 || prop.indexOf('-moz-') === 0) return;
        if (PROPS.indexOf(prop) < 0) {
          var best = null;
          PROPS.forEach(function (k) { var dist = editDistance(prop, k); if (dist <= 2 && (!best || dist < best.d)) best = { k: k, d: dist }; });
          problems.push({ line: dl, message: 'Line ' + dl + ': "' + prop + '" is not a CSS property' + (best ? '. Did you mean "' + best.k + '"?' : '.') });
        }
      });
    }
    return problems;
  }

  // ------------------------------------------------------------------------------------------
  // Console programs (no page): used for the JavaScript basics in a Web Worker and in the tests.
  // `g` is the global object, `exec(code)` runs the program. Returns { stdout, error }.
  // ------------------------------------------------------------------------------------------
  function consoleRun(code, g, exec, stdin) {
    var out = [];
    var lines = stdin ? String(stdin).replace(/\n$/, '').split('\n') : [];
    var write = function () { out.push(Array.prototype.map.call(arguments, fmt).join(' ')); };
    g.console = { log: write, info: write, warn: write, error: write, debug: write, table: write };
    g.input = function () { return lines.length ? lines.shift() : ''; };
    g.prompt = function (m) { return g.input(m); };
    g.alert = function (m) { write('[alert] ' + fmt(m)); };
    var error = null;
    try {
      exec(code);
    } catch (e) {
      var head = (e && e.name ? e.name : 'Error') + ': ' + (e && e.message ? e.message : e);
      var stack = e && e.stack ? String(e.stack) : '';
      var at = stack.match(/(?:student\.js|<anonymous>):(\d+):(\d+)/) || stack.match(/blob:[^\s:]*:(\d+):(\d+)/);
      error = head + (at ? '\n    at script.js:' + at[1] + ':' + at[2] : '');
    }
    return { stdout: out.length ? out.join('\n') + '\n' : '', error: error };
  }

  return { fmt: fmt, guardLoops: guardLoops, buildDocument: buildDocument, runChecks: runChecks, lintHtml: lintHtml, lintCss: lintCss, consoleRun: consoleRun, normValue: normValue, toRgb: toRgb, svgToUri: svgToUri };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = SMEngine;
