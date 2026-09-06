const SIZE = { width: 1000, height: 300 };
const FORM = { rings: 32, steps: 96, radius: 112, tube: 44, x: 766, y: 148 };

/** Project a tilted filament loop; fixed sampling makes builds reproducible. */
function filament(angle) {
  const points = [];
  for (let step = 0; step <= FORM.steps; step++) {
    const v = (step / FORM.steps) * Math.PI * 2;
    const radius = FORM.radius + FORM.tube * Math.cos(v);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = FORM.tube * Math.sin(v);
    // The oblique projection leaves the centre open and brings the far edge up.
    const px = FORM.x + x * 0.93 + y * 0.28;
    const py = FORM.y + y * 0.57 - x * 0.19 + z * 0.9;
    points.push(`${step ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return points.join(' ') + ' Z';
}

/** One quiet masthead. The introduction and links stay readable outside the SVG. */
export function hero(theme) {
  const rings = Array.from({ length: FORM.rings }, (_, index) => {
    const angle = (index / FORM.rings) * Math.PI * 2;
    const accent = index === 22;
    return `<path d="${filament(angle)}" stroke="${accent ? theme.accent : theme.line}" stroke-width="${accent ? 2 : 0.8}" opacity="${accent ? 1 : 0.55}"${accent ? ' class="accent" pathLength="1"' : ''}/>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE.width} ${SIZE.height}" width="${SIZE.width}" height="${SIZE.height}" role="img" aria-labelledby="title">
<title id="title">ni1ra — a study in connected forms</title>
<style>
  /* Draw once, then settle. Reduced-motion visitors see the complete form. */
  @media (prefers-reduced-motion: no-preference) {
    .accent { stroke-dasharray: 1; animation: trace 2.4s ease-out 1; }
  }
  @keyframes trace { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
</style>
<defs>
  <radialGradient id="glow">
    <stop stop-color="${theme.glow}" stop-opacity="0.12"/>
    <stop offset="1" stop-color="${theme.glow}" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="1000" height="300" rx="8" fill="${theme.bg}"/>
<ellipse cx="766" cy="148" rx="228" ry="148" fill="url(#glow)"/>
<text x="48" y="194" font-family="Arial, Helvetica, sans-serif" font-size="152" font-weight="700" letter-spacing="-9" fill="${theme.text}">ni1ra</text>
<circle cx="392" cy="182" r="7" fill="${theme.accent}"/>
<g fill="none" stroke-linejoin="round">${rings}</g>
</svg>`;
}
