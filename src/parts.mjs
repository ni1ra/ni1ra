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
 * also happens to give the title its wide tracking.
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

/** CRT line structure: a 3px pattern, dark enough to feel and not to read. */
export function scanlines(t, id = 'scan') {
  return `<pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="1" fill="${t.wash}" opacity="${t.washOpacity}"/>
  </pattern>`;
}

/** The warm blur a CRT throws onto the room around it. */
export function bloom(t, { cx, cy, r, id = 'bloom' }) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${t.amber}" stop-opacity="${t.bloomOpacity}"/>
    <stop offset="1" stop-color="${t.amber}" stop-opacity="0"/>
  </radialGradient>`;
}

export function svgOpen(w, h, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">`;
}
