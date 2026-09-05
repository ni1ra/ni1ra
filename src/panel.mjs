import { mono, scanlines, static_, svgOpen } from './parts.mjs';

const W = 1000, H = 250;

// Copland OS panel chrome: a flat window, a hairline border, wide-tracked
// caps. The rows are laid out with an explicit leader rule rather than dot
// characters so the columns line up on a font we do not control.
const ROWS = [
  ['operator', 'Andreas — ni1ra'],
  ['station', 'windows 11 · ubuntu 24.04 (wsl2)'],
  ['languages', 'typescript · rust · c++ · python'],
  ['building', 'learned-structure ai · market systems · interfaces'],
  ['protocol', 'every line of code needs a reason to exist'],
];

const LABEL_X = 28, LEAD_X1 = 132, LEAD_X2 = 206, VALUE_X = 220;
const ROW_Y = 68, ROW_STEP = 30, SIZE = 11.5, TRACK = 8.6;

export function panel(t) {
  const rows = ROWS.map(([label, value], i) => {
    const y = ROW_Y + i * ROW_STEP;
    return `<g>
    ${mono(label, { x: LABEL_X, y, size: SIZE, track: TRACK, fill: t.dim })}
    <line x1="${LEAD_X1}" y1="${y - 4}" x2="${LEAD_X2}" y2="${y - 4}" stroke="${t.rule}" stroke-width="1" stroke-dasharray="1 4"/>
    ${mono(value, { x: VALUE_X, y, size: SIZE, track: TRACK, fill: t.text })}
  </g>`;
  }).join('\n  ');

  const statusY = ROW_Y + ROWS.length * ROW_STEP;

  return `${svgOpen(W, H, 'A system panel listing operator, station, languages, and current work')}
<defs>${scanlines(t, 'scanp')}</defs>

<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="${t.panel}" stroke="${t.rule}"/>
<line x1="0" y1="32.5" x2="${W}" y2="32.5" stroke="${t.rule}"/>
${mono('NAVI://ni1ra', { x: 18, y: 21, size: 10.5, track: 8.2, fill: t.mid })}
<g fill="none" stroke="${t.rule}">
  <rect x="936.5" y="11.5" width="9" height="9"/>
  <rect x="952.5" y="11.5" width="9" height="9"/>
  <rect x="968.5" y="11.5" width="9" height="9"/>
</g>

  ${rows}

<g>
  ${mono('status', { x: LABEL_X, y: statusY, size: SIZE, track: TRACK, fill: t.dim })}
  <line x1="${LEAD_X1}" y1="${statusY - 4}" x2="${LEAD_X2}" y2="${statusY - 4}" stroke="${t.rule}" stroke-width="1" stroke-dasharray="1 4"/>
  <circle cx="${VALUE_X + 4}" cy="${statusY - 4}" r="3.5" fill="${t.amber}">
    <animate attributeName="opacity" values="1;0.2;1" dur="2.6s" repeatCount="indefinite"/>
  </circle>
  ${mono('connected', { x: VALUE_X + 16, y: statusY, size: SIZE, track: TRACK, fill: t.text })}
</g>

${static_(t, { w: W, h: H, count: 6, seed: 44 })}
<rect width="${W}" height="${H}" fill="url(#scanp)"/>
</svg>`;
}
