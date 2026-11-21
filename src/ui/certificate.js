// Draws a certificate as an image (canvas), so it can be saved or shared from the phone. No image files, works offline.
const W = 1200;
const H = 850;

export function certificateCanvas({ name, title, kind, parts = [], date = new Date(), color = '#0b6b4f' }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  if (!g) return canvas;
  g.fillStyle = '#fffdf7';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = color;
  g.lineWidth = 14;
  g.strokeRect(30, 30, W - 60, H - 60);
  g.lineWidth = 3;
  g.strokeRect(52, 52, W - 104, H - 104);
  g.textAlign = 'center';
  g.fillStyle = color;
  g.font = '700 30px system-ui, sans-serif';
  g.fillText('</>  SayMaCoder', W / 2, 130);
  g.fillStyle = '#1c1b18';
  g.font = '700 58px Georgia, serif';
  g.fillText('Certificate of Completion', W / 2, 235);
  g.font = '28px system-ui, sans-serif';
  g.fillStyle = '#5f5c54';
  g.fillText('This is to say that', W / 2, 310);
  g.fillStyle = color;
  g.font = '700 68px Georgia, serif';
  g.fillText(fit(g, name || 'A SayMaCoder learner', 900, 68, 'Georgia, serif'), W / 2, 405);
  g.fillStyle = '#5f5c54';
  g.font = '28px system-ui, sans-serif';
  g.fillText(kind === 'path' ? 'finished the career path' : 'finished the course', W / 2, 475);
  g.fillStyle = '#1c1b18';
  g.font = '700 46px system-ui, sans-serif';
  g.fillText(fit(g, title, 960, 46, 'system-ui, sans-serif'), W / 2, 545);
  if (kind === 'path' && parts.length) {
    g.font = '24px system-ui, sans-serif';
    g.fillStyle = '#5f5c54';
    g.fillText(fit(g, parts.join('  ·  '), 980, 24, 'system-ui, sans-serif', false), W / 2, 600);
  }
  g.fillStyle = '#5f5c54';
  g.font = '26px system-ui, sans-serif';
  g.fillText(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, 690);
  g.font = '20px system-ui, sans-serif';
  g.fillStyle = '#8a877e';
  g.fillText('Self-study certificate from the SayMaCoder app. Every exercise was solved by the learner on their own phone.', W / 2, 760);
  return canvas;
}

/** Shrink the text until it fits the width. */
function fit(g, text, maxWidth, size, family, bold = true) {
  let s = size;
  g.font = `${bold ? '700 ' : ''}${s}px ${family}`;
  while (g.measureText(text).width > maxWidth && s > 14) {
    s -= 2;
    g.font = `${bold ? '700 ' : ''}${s}px ${family}`;
  }
  return text;
}

export const canvasBlob = (canvas) => new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
