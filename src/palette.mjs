// Two colour sets, not one set inverted.
// `night` is the machine lit only by itself: near-black under an amber CRT bloom.
// `day` is the room it sits in: warm bone paper, hard ink, sun through a window.
// Every generated asset ships in both so GitHub's <picture> can switch on
// prefers-color-scheme without either variant looking like a tinted copy.

export const themes = {
  night: {
    id: 'dark',
    bg: '#08080a',
    panel: '#0e0e12',
    rule: '#26262e',
    dim: '#615f6a',
    mid: '#8b8890',
    text: '#d8d4cb',
    amber: '#d9a05b',
    amberSoft: '#8a6535',
    red: '#a03434',
    // Scanline and roll-bar washes read as shadow on dark, so they are black.
    wash: '#000000',
    washOpacity: 0.24,
    rollOpacity: 0.05,
    bloomOpacity: 0.13,
  },
  day: {
    id: 'light',
    bg: '#efece4',
    panel: '#e7e3d9',
    rule: '#cec8ba',
    dim: '#9a9488',
    mid: '#6e6a62',
    text: '#1c1b19',
    amber: '#a9701f',
    amberSoft: '#c2a173',
    red: '#8c2c2c',
    wash: '#3a352c',
    washOpacity: 0.09,
    rollOpacity: 0.035,
    bloomOpacity: 0.10,
  },
};

// No @font-face survives inside an SVG rendered as an <img>, so text is drawn
// with whatever monospace the viewer already has. See mono() in parts.mjs for
// how layout is kept identical anyway.
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, DejaVu Sans Mono, monospace';
