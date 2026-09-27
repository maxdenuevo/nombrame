#!/usr/bin/env node
// Chequeo del design system (Node 24 carga los .ts directo, sin compilar):
//   1. Contraste AA de cada par de texto de cada swatch y del chrome, en claro y oscuro.
//   2. Que el color por nombre se reparta parejo y sin relación con el género.
//   3. Tamaños de los PNG de marca, y que el ícono de iOS sea opaco.
// Uso: node scripts/check-design.mjs   (sale con código 1 si algo falla)
import { existsSync, readFileSync } from 'node:fs';

import { WASH_ALPHA, chrome } from '../src/design/chrome.ts';
import { SWATCHES, swatchFor, swatchForDeck } from '../src/design/swatches.ts';
import { deckNames, decks } from '../src/data/decks.ts';
import { names } from '../src/data/names.ts';

const AA = 4.5;
const failures = [];

// --- color ------------------------------------------------------------------
const parse = (c) => {
  const m = c.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const [r, g, b, a = 1] = m[1].split(',').map(Number);
    return [r, g, b, a];
  }
  const h = c.replace('#', '');
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(a);
};
const over = (fg, bg) => {
  const [r, g, b, a] = parse(fg);
  const [R, G, B] = parse(bg);
  return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a)];
};
const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (c) => {
  const [r, g, b] = parse(c);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** Mezcla `color` con alfa sobre `base` y devuelve hex opaco. */
const tint = (color, alpha, base) =>
  hex(
    over(
      color.slice(0, 7) +
        Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0'),
      base,
    ),
  );

let pairs = 0;
let worst = { ratio: Infinity };
function expect(label, fg, bg, min = AA) {
  pairs++;
  const r = ratio(fg, bg);
  if (r < worst.ratio) worst = { ratio: r, label };
  if (r < min) failures.push(`contraste ${r.toFixed(2)} < ${min}: ${label} (${fg} sobre ${bg})`);
}

for (const s of SWATCHES) {
  for (const mode of ['light', 'dark']) {
    const { card, wash, mesh } = s[mode];
    const g = chrome[mode].glass;
    const tag = `${s.id}/${mode}`;
    expect(`${tag} ink/bg`, card.ink, card.bg);
    expect(`${tag} inkMuted/bg`, card.inkMuted, card.bg);
    expect(`${tag} ink/fill`, card.ink, card.fill);
    card.blobs.forEach((b, i) => expect(`${tag} ink/blob${i}`, card.ink, b));
    // Texto de chrome sobre el fondo lavado con este swatch.
    for (const w of [wash.base, ...wash.blobs.map((b) => tint(b, WASH_ALPHA, wash.base))]) {
      expect(`${tag} ink/wash`, card.ink, w);
      expect(`${tag} inkMuted/wash`, card.inkMuted, w);
    }
    // Texto sobre vidrio encima de la malla. Peor caso: en claro, el vidrio más
    // transparente (con blur); en oscuro, el más blanco (sin blur).
    const glassFill = mode === 'light' ? g.fill : g.fallback;
    for (const m of [mesh.base, ...mesh.blobs]) {
      expect(`${tag} ink/glass-over-mesh`, card.ink, hex(over(glassFill, m)));
    }
  }
}

for (const mode of ['light', 'dark']) {
  const c = chrome[mode];
  expect(`chrome/${mode} ink/bg`, c.ink, c.bg);
  expect(`chrome/${mode} inkMuted/bg`, c.inkMuted, c.bg);
  for (const b of c.wash.blobs) {
    expect(`chrome/${mode} inkMuted/wash`, c.inkMuted, tint(b, WASH_ALPHA, c.wash.base));
  }
  expect(`chrome/${mode} ink/glass`, c.ink, hex(over(c.glass.fallback, c.bg)));
}

// --- distribución -----------------------------------------------------------
const K = SWATCHES.length;
const CHI2_CRIT = 16.92; // df 9, p 0.05
const counts = Object.fromEntries(SWATCHES.map((s) => [s.id, 0]));
const byGender = { f: { ...counts }, m: { ...counts }, x: { ...counts } };
for (const n of names) {
  const id = swatchFor(n.id).id;
  counts[id]++;
  byGender[n.gender][id]++;
}
const expected = names.length / K;
const chiUniform = Object.values(counts).reduce(
  (acc, c) => acc + (c - expected) ** 2 / expected,
  0,
);
if (chiUniform >= CHI2_CRIT) failures.push(`distribución despareja: χ² ${chiUniform.toFixed(2)}`);

// Independencia niña/niño: tabla de contingencia 2×K.
const f = byGender.f;
const m = byGender.m;
const nf = Object.values(f).reduce((a, b) => a + b, 0);
const nm = Object.values(m).reduce((a, b) => a + b, 0);
let chiGender = 0;
for (const id of Object.keys(counts)) {
  const col = f[id] + m[id];
  for (const [obs, rowTotal] of [
    [f[id], nf],
    [m[id], nm],
  ]) {
    const exp = (rowTotal * col) / (nf + nm);
    if (exp > 0) chiGender += (obs - exp) ** 2 / exp;
  }
}
if (chiGender >= CHI2_CRIT)
  failures.push(`el color depende del género: χ² ${chiGender.toFixed(2)}`);

let repeats = 0;
for (let i = 1; i < names.length; i++) {
  if (swatchFor(names[i].id).id === swatchFor(names[i - 1].id).id) repeats++;
}
let deckRepeats = 0;
let deckPairs = 0;
for (const slugs of Object.values(deckNames)) {
  for (let i = 1; i < slugs.length; i++) {
    deckPairs++;
    if (swatchFor(slugs[i]).id === swatchFor(slugs[i - 1]).id) deckRepeats++;
  }
}

// --- PNG de marca -------------------------------------------------------------
const png = (path) => {
  const b = readFileSync(path);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), colorType: b[25] };
};
const brand = [
  ['assets/images/icon.png', 1024, true],
  ['assets/images/android-icon-foreground.png', 1024, false],
  ['assets/images/android-icon-monochrome.png', 1024, false],
  ['assets/images/splash-icon.png', 1024, false],
  ['assets/images/favicon.png', 48, false],
];
for (const [path, size, opaque] of brand) {
  if (!existsSync(path)) {
    failures.push(`falta ${path}`);
    continue;
  }
  const { w, h, colorType } = png(path);
  if (w !== size || h !== size) failures.push(`${path}: ${w}×${h}, se esperaba ${size}×${size}`);
  // colorType 2 = RGB (sin alfa), 6 = RGBA.
  if (opaque && colorType !== 2)
    failures.push(`${path}: el ícono de iOS no puede tener canal alfa`);
}

// --- reporte ------------------------------------------------------------------
console.log(`Contraste: ${pairs} pares; el más bajo ${worst.ratio.toFixed(2)}:1 (${worst.label}).`);
console.log(
  `Colores: ${Object.entries(counts)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ')}` +
    `\n  χ² uniforme ${chiUniform.toFixed(2)} · χ² niña/niño ${chiGender.toFixed(2)} (límite ${CHI2_CRIT})` +
    `\n  neutros: ${Object.entries(byGender.x)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k} ${v}`)
      .join(', ')}` +
    `\n  repite color con la anterior: catálogo ${((100 * repeats) / (names.length - 1)).toFixed(1)} %, dentro de decks ${((100 * deckRepeats) / deckPairs).toFixed(1)} %`,
);
console.log(
  `Decks: ${['Todos', ...decks.map((d) => d.title)].map((t, i) => `${t} ${swatchForDeck(i === 0 ? null : decks[i - 1].slug).id}`).join(' · ')}`,
);
if (failures.length) {
  console.error(`\n${failures.length} problema(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nTodo en orden.');
