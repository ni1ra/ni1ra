import { mono, scanlines, static_, svgOpen } from './parts.mjs';

const W = 1000, H = 360;

// Three bands, deepest first. Named nodes are repositories anyone can open;
// the dark nodes are the private ones — present, countable, unreadable. That
// asymmetry is the honest shape of the account and it is also the point of
// the show, so it is drawn rather than explained.
const BANDS = [
  { label: 'research', y: 118 },
  { label: 'systems', y: 208 },
  { label: 'surface', y: 298 },
];

const NAMED = [
  { name: 'project-x', tag: 'c++', x: 250, y: 118 },
  { name: 'wired', tag: 'rust', x: 330, y: 208 },
  { name: 'navi-ui', tag: 'typescript', x: 290, y: 298 },
  { name: 'dartio', tag: 'typescript', x: 470, y: 298 },
];

const DARK = [
  [400, 118], [530, 118], [660, 118],
  [200, 208], [470, 208], [620, 208], [780, 208],
  [620, 298], [730, 298], [840, 298], [940, 298],
];

// [from, to, control-y offset]
const EDGES = [
  [[250, 118], [330, 208], 40],
  [[330, 208], [290, 298], 40],
  [[290, 298], [470, 298], -34],
  [[400, 118], [470, 208], 36],
  [[470, 208], [620, 298], 30],
  [[530, 118], [620, 208], 34],
  [[780, 208], [840, 298], 34],
  [[660, 118], [780, 208], 30],
];

const curve = ([x1, y1], [x2, y2], bend) =>
  `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + bend} ${x2} ${y2}`;

export function map(t) {
  const edges = EDGES.map(([a, b, bend], i) =>
    `<path id="e${i}" d="${curve(a, b, bend)}" fill="none" stroke="${t.rule}" stroke-width="1"/>`
  ).join('\n  ');

  // Only three edges carry traffic. A network where every line pulses is a
  // screensaver; a network where three do is a network.
  const pulses = [0, 2, 5].map((i, n) =>
    `<circle r="2.6" fill="${t.amber}" opacity="0.9">
    <animateMotion dur="${4.5 + n * 1.3}s" begin="${n * 1.9}s" repeatCount="indefinite" rotate="auto">
      <mpath href="#e${i}" xlink:href="#e${i}"/>
    </animateMotion>
  </circle>`
  ).join('\n  ');

  const named = NAMED.map(({ name, tag, x, y }) => `<g>
    <circle cx="${x}" cy="${y}" r="13" fill="none" stroke="${t.amberSoft}" stroke-width="1" opacity="0.4"/>
    <circle cx="${x}" cy="${y}" r="4.5" fill="${t.amber}"/>
    ${mono(name, { x, y: y + 32, size: 10.5, track: 7.8, fill: t.text, anchor: 'middle' })}
    ${mono(tag, { x, y: y + 46, size: 8.5, track: 6.6, fill: t.dim, anchor: 'middle' })}
  </g>`).join('\n  ');

  const dark = DARK.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="3" fill="${t.dim}" opacity="0.6">`
    + (i % 4 === 1 ? `<animate attributeName="opacity" values="0.6;0.15;0.6" dur="${(3.4 + i * 0.7).toFixed(1)}s" repeatCount="indefinite"/>` : '')
    + `</circle>`
  ).join('\n  ');

  const bands = BANDS.map(({ label, y }) => `<g>
    ${mono(label, { x: 28, y: y + 3, size: 9.5, track: 7.6, fill: t.dim, opacity: 0.75 })}
    <line x1="112" y1="${y}" x2="972" y2="${y}" stroke="${t.rule}" stroke-width="1" stroke-dasharray="1 5" opacity="0.7"/>
  </g>`).join('\n  ');

  return `${svgOpen(W, H, 'A node map of the account: four named public repositories and eleven unlisted private ones, across three layers')}
<defs>${scanlines(t, 'scanm')}</defs>

<rect width="${W}" height="${H}" fill="${t.bg}"/>
${mono('THE WIRED', { x: 28, y: 40, size: 10.5, track: 9, fill: t.mid })}
${mono('04 visible · 11 unlisted', { x: 972, y: 40, size: 10.5, track: 8.2, fill: t.dim, anchor: 'end' })}
<line x1="28" y1="56" x2="972" y2="56" stroke="${t.rule}" stroke-width="1"/>

  ${bands}
  ${edges}
  ${dark}
  ${pulses}
  ${named}

${static_(t, { w: W, h: H, count: 8, seed: 91 })}
<rect width="${W}" height="${H}" fill="url(#scanm)"/>
</svg>`;
}
