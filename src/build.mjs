// Both palettes share geometry. Relative README URLs let GitHub resolve assets
// against the current branch, keeping previews and the live profile consistent.
import { writeFileSync, mkdirSync } from 'node:fs';
import { themes } from './palette.mjs';
import { hero } from './hero.mjs';

const out = new URL('../assets/', import.meta.url);
mkdirSync(out, { recursive: true });

for (const [name, theme] of Object.entries(themes)) {
  const file = new URL(`profile-${name}.svg`, out);
  writeFileSync(file, hero(theme) + '\n');
  console.log('wrote', `assets/profile-${name}.svg`);
}
