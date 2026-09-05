import { MONO } from './palette.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Draw a run of text at a width we choose rather than a width the viewer's
 * font chooses.
 *
 * This is the whole trick that makes the page survive leaving this machine.
 * An SVG loaded as an <img> gets no webfont, so glyph advances differ on every
 * OS — anything positioned relative to the *end* of a string (a typing cursor,
 * a column, a rule) would land somewhere different for each visitor. Setting
 * textLength with lengthAdjust="spacing" pins the run to exactly `track` pixels
 * per character and lets the renderer absorb the difference in the gaps, which
 * also happens to give the wide tracking the Copland OS panels are built on.
 *
 * `track` must stay comfortably above the natural advance (~0.6em) or the
 * spacing goes negative and glyphs collide.
 */
export function mono(text, { x, y, size, track, fill, opacity = 1, anchor = 'start', extra = '' }) {
  const width = text.length * track;
  const a = anchor === 'start' ? '' : ` text-anchor="${anchor}"`;
  const o = opacity === 1 ? '' : ` opacity="${opacity}"`;
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" fill="${fill}"${o}${a} textLength="${width}" lengthAdjust="spacing"${extra ? ' ' + extra : ''}>${esc(text)}</text>`;
}

/** Width mono() will occupy — needed whenever something must butt against text. */
export const monoWidth = (text, track) => text.length * track;

/** Deterministic noise, so a rebuild with no content change is a no-op diff. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** CRT line structure: a 3px pattern, dark enough to feel and not to read. */
export function scanlines(t, id = 'scan') {
  return `<pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="1" fill="${t.wash}" opacity="${t.washOpacity}"/>
  </pattern>`;
}

/** The warm blur every Lain interior is lit by. */
export function bloom(t, { cx, cy, r, id = 'bloom' }) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${t.amber}" stop-opacity="${t.bloomOpacity}"/>
    <stop offset="1" stop-color="${t.amber}" stop-opacity="0"/>
  </radialGradient>`;
}

/**
 * The vertical sync roll — one band drifting down the frame forever. It is the
 * only animation on the page that never resolves, which is the point: the hum
 * does not stop.
 */
export function rollGradient(t, { id = 'roll' }) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.wash}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${t.wash}" stop-opacity="${t.rollOpacity}"/>
      <stop offset="1" stop-color="${t.wash}" stop-opacity="0"/>
    </linearGradient>`;
}

export function rollRect(w, h, id = 'roll', dur = 9) {
  const band = Math.round(h * 0.45);
  return `<rect x="0" y="0" width="${w}" height="${band}" fill="url(#${id})">
    <animateTransform attributeName="transform" type="translate" from="0 ${-band}" to="0 ${h}" dur="${dur}s" repeatCount="indefinite"/>
  </rect>`;
}

/** Sparse dead pixels. Few enough to be noticed only on the second look. */
export function static_(t, { w, h, count = 14, seed = 7 }) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = Math.round(r() * w);
    const y = Math.round(r() * h);
    const dur = (2 + r() * 5).toFixed(2);
    const begin = (r() * 6).toFixed(2);
    out += `<rect x="${x}" y="${y}" width="2" height="2" fill="${t.mid}" opacity="0">
      <animate attributeName="opacity" values="0;0.55;0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
    </rect>`;
  }
  return out;
}

export function svgOpen(w, h, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">`;
}
