import { mono, scanlines, bloom, svgOpen } from './parts.mjs';

const W = 1000, H = 290;

// The wires. Four spans sagging in from off-frame and terminating on the
// insulators of a single pole. Control points sit below both endpoints so the
// span droops instead of arcing, and the widths vary so the bundle reads as
// depth rather than as four copies of one line.
const POLE_X = 886;
const WIRES = [
  { d: 'M -20 30 Q 420 92 842 40', w: 1.3 },
  { d: 'M -20 56 Q 420 118 850 74', w: 1.1 },
  { d: 'M -20 84 Q 440 150 930 40', w: 0.9 },
  { d: 'M -20 110 Q 440 176 922 74', w: 1.0 },
];

const SUBTITLE = 'typescript · rust · c++ · python';

const TITLE_X = 64, TITLE_Y = 196, TITLE_SIZE = 72, TITLE_TRACK = 52;
const RULE_Y = 222, SUB_Y = 254, SUB_SIZE = 15, SUB_TRACK = 11;

export function header(t) {
  return `${svgOpen(W, H, 'ni1ra, written beneath power lines; a single packet travels along one wire')}
<defs>
  ${scanlines(t)}
  ${bloom(t, { cx: 860, cy: 36, r: 520 })}
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2.4"/>
  </filter>
</defs>

<rect width="${W}" height="${H}" fill="${t.bg}"/>
<rect width="${W}" height="${H}" fill="url(#bloom)"/>

<g stroke="${t.dim}" fill="none" opacity="0.8">
  ${WIRES.map((w) => `<path d="${w.d}" stroke-width="${w.w}"/>`).join('\n  ')}
</g>
<g fill="${t.dim}" opacity="0.9">
  <!-- Tapered so it stands rather than floats: wider at the base, running off frame. -->
  <path d="M ${POLE_X - 4} 8 L ${POLE_X + 4} 8 L ${POLE_X + 7} ${H} L ${POLE_X - 7} ${H} Z"/>
  <rect x="838" y="44" width="96" height="3.5"/>
  <rect x="846" y="78" width="80" height="3.5"/>
  <rect x="839" y="37" width="5" height="7"/>
  <rect x="927" y="37" width="5" height="7"/>
  <rect x="847" y="71" width="5" height="7"/>
  <rect x="919" y="71" width="5" height="7"/>
</g>

<!-- One packet crossing the span, left to right: the only motion that repeats. -->
<path d="${WIRES[2].d}" fill="none" stroke="${t.amber}" stroke-width="2" stroke-linecap="round"
      stroke-dasharray="22 4000" filter="url(#glow)" opacity="0.95">
  <animate attributeName="stroke-dashoffset" from="4000" to="0" dur="7s" repeatCount="indefinite"/>
</path>

${mono('ni1ra', { x: TITLE_X, y: TITLE_Y, size: TITLE_SIZE, track: TITLE_TRACK, fill: t.text })}

<line x1="${TITLE_X}" y1="${RULE_Y}" x2="${TITLE_X}" y2="${RULE_Y}" stroke="${t.rule}" stroke-width="1">
  <animate attributeName="x2" from="${TITLE_X}" to="840" begin="0.2s" dur="0.9s" fill="freeze"/>
</line>

<g opacity="0">
  <animate attributeName="opacity" from="0" to="1" begin="0.6s" dur="0.8s" fill="freeze"/>
  ${mono(SUBTITLE, { x: TITLE_X, y: SUB_Y, size: SUB_SIZE, track: SUB_TRACK, fill: t.text, opacity: 0.7 })}
</g>

<rect width="${W}" height="${H}" fill="url(#scan)"/>
</svg>`;
}
