// Emits every asset in both themes from one source, so the dark and light
// variants can never drift apart.
import { writeFileSync, mkdirSync } from 'node:fs';
import { themes } from './palette.mjs';
import { hero } from './hero.mjs';
import { panel } from './panel.mjs';
import { map } from './map.mjs';

const out = new URL('../assets/', import.meta.url);
mkdirSync(out, { recursive: true });

const assets = { hero, panel, map };

for (const [name, build] of Object.entries(assets)) {
  for (const theme of Object.values(themes)) {
    const file = new URL(`${name}-${theme.id}.svg`, out);
    writeFileSync(file, build(theme).replace(/\n\s*\n/g, '\n') + '\n');
    console.log('wrote', `assets/${name}-${theme.id}.svg`);
  }
}
