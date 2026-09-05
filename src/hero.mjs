import { mono, scanlines, bloom, rollGradient, rollRect, static_, rng, svgOpen } from './parts.mjs';

const W = 1000, H = 300;

// The wires. Four spans sagging in from off-frame and terminating on the
// insulators of a single pole — the one Lain image that carries the whole show
// without a character in it. Control points sit below both endpoints so the
// span droops instead of arcing, and the widths vary so the bundle reads as
// depth rather than as four copies of one line.
const POLE_X = 886;
const WIRES = [
  { d: 'M -20 30 Q 420 92 842 40', w: 1.3 },
  { d: 'M -20 56 Q 420 118 850 74', w: 1.1 },
  { d: 'M -20 84 Q 440 150 930 40', w: 0.9 },
  { d: 'M -20 110 Q 440 176 922 74', w: 1.0 },
];

const CMD = '> navi --connect --layer 07';
const ECHO = 'present day. present time.';

const TITLE_X = 64, TITLE_Y = 196, TITLE_SIZE = 72, TITLE_TRACK = 52;
const BOOT_SIZE = 12.5, BOOT_TRACK = 9.2;
const CMD_W = CMD.length * BOOT_TRACK;

export function hero(t) {
  const r = rng(31);

  // Hum meter: the sound of the wires, drawn. Deterministic heights so a
  // rebuild produces a byte-identical file when nothing changed.
  let bars = '';
  for (let i = 0; i < 38; i++) {
    const x = 604 + i * 7;
    const h = 3 + Math.round(r() * 22);
    const live = i % 5 === 2;
    bars += `<line x1="${x}" y1="278" x2="${x}" y2="${278 - h}" stroke="${t.amberSoft}" stroke-width="2" opacity="0.42">`
      + (live
        ? `<animate attributeName="y2" values="${278 - h};${278 - Math.max(3, h - 12)};${278 - h}" dur="${(1.6 + r() * 2.4).toFixed(2)}s" repeatCount="indefinite"/>`
        : '')
      + `</line>`;
  }

  return `${svgOpen(W, H, 'ni1ra — a terminal connecting to the Wired')}
<defs>
  ${scanlines(t)}
  ${bloom(t, { cx: 860, cy: 36, r: 520 })}
  ${rollGradient(t, {})}
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2.4"/>
  </filter>
  <clipPath id="typed">
    <rect x="60" y="238" width="0" height="22">
      <animate attributeName="width" from="0" to="${(CMD_W + 4).toFixed(1)}" begin="0.45s" dur="1.05s" fill="freeze"/>
    </rect>
  </clipPath>
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

<!-- One packet crossing the span, left to right, never arriving twice. -->
<path d="${WIRES[2].d}" fill="none" stroke="${t.amber}" stroke-width="2" stroke-linecap="round"
      stroke-dasharray="22 4000" filter="url(#glow)" opacity="0.95">
  <animate attributeName="stroke-dashoffset" from="4000" to="0" dur="7s" repeatCount="indefinite"/>
</path>

${mono('ni1ra', { x: TITLE_X, y: TITLE_Y, size: TITLE_SIZE, track: TITLE_TRACK, fill: t.text })}
<rect x="${TITLE_X + 5 * TITLE_TRACK + 18}" y="166" width="11" height="11" fill="${t.red}">
  <animate attributeName="opacity" values="0.12;1;0.12" dur="3.4s" repeatCount="indefinite"/>
</rect>

<line x1="${TITLE_X}" y1="222" x2="${TITLE_X}" y2="222" stroke="${t.rule}" stroke-width="1">
  <animate attributeName="x2" from="${TITLE_X}" to="840" begin="0.2s" dur="0.9s" fill="freeze"/>
</line>

<g clip-path="url(#typed)">
  ${mono(CMD, { x: TITLE_X, y: 252, size: BOOT_SIZE, track: BOOT_TRACK, fill: t.mid })}
</g>
<rect x="${TITLE_X}" y="241" width="8" height="14" fill="${t.amber}" opacity="0">
  <animate attributeName="x" from="${TITLE_X}" to="${(TITLE_X + CMD_W).toFixed(1)}" begin="0.45s" dur="1.05s" fill="freeze"/>
  <animate attributeName="opacity" from="0" to="1" begin="0.45s" dur="0.01s" fill="freeze"/>
  <animate attributeName="opacity" values="1;1;0;0" dur="1.06s" begin="1.6s" repeatCount="indefinite"/>
</rect>

<g opacity="0">
  <animate attributeName="opacity" from="0" to="1" begin="1.95s" dur="0.85s" fill="freeze"/>
  ${mono(ECHO, { x: TITLE_X, y: 276, size: BOOT_SIZE, track: BOOT_TRACK, fill: t.amber, opacity: 0.85 })}
</g>

${bars}

${static_(t, { w: W, h: H, count: 12, seed: 19 })}
<rect width="${W}" height="${H}" fill="url(#scan)"/>
${rollRect(W, H, 'roll', 9)}
</svg>`;
}
