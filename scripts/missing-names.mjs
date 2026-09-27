// Candidatos para ampliar el catálogo: cruza el dataset guaguas (Registro
// Civil de Chile, inscripciones 1920–2021) con src/data/names.ts y lista los
// nombres más inscritos que todavía no están. De paso, compara el género de
// cada nombre del catálogo con los datos.
//
// Uso:  node scripts/missing-names.mjs [--desde 2012] [--hasta 2021] [--top 100] [--min 50]
//       node scripts/missing-names.mjs > /tmp/candidatos.md
//
// Es una herramienta de curaduría, no de importación: la salida son
// candidatos. Cada nombre que entra al catálogo pasa por el criterio de
// src/data/SOURCES.md (significado de diccionario, sin estereotipos).
//
// El CSV (~21 MB) se descarga una vez a node_modules/.cache/guaguas/;
// --refrescar lo vuelve a bajar. Requiere Node 24 (importa names.ts directo,
// igual que generate-seed.mjs).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const CSV_URL = 'https://raw.githubusercontent.com/rivaquiroga/guaguas/main/data-raw/1920-2021.csv';
const CSV_PATH = join(root, 'node_modules/.cache/guaguas/1920-2021.csv');
const FIRST_YEAR = 1920;
const LAST_YEAR = 2021;

// Un nombre es unisex (`x`) si el sexo minoritario llega a esta fracción de
// las inscripciones. Es la condición 1 del criterio de SOURCES.md ("Género"),
// solo con Chile; la ventana por defecto (2012–2021) es la misma.
const UNISEX_MIN_SHARE = 0.2;

// --- Argumentos. ------------------------------------------------------------

const opts = { desde: 2012, hasta: LAST_YEAR, top: 100, min: 50, refrescar: false };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const flag = argv[i].replace(/^--/, '');
  if (flag === 'refrescar') {
    opts.refrescar = true;
    continue;
  }
  if (!(flag in opts)) fail(`opción desconocida: ${argv[i]}`);
  const value = Number(argv[++i]);
  if (!Number.isInteger(value)) fail(`--${flag} espera un número entero`);
  opts[flag] = value;
}
if (opts.desde < FIRST_YEAR || opts.hasta > LAST_YEAR || opts.desde > opts.hasta) {
  fail(`el rango debe estar dentro de ${FIRST_YEAR}–${LAST_YEAR}`);
}

function fail(msg) {
  console.error(`missing-names: ${msg}`);
  process.exit(1);
}

// --- Datos. -----------------------------------------------------------------

if (opts.refrescar || !existsSync(CSV_PATH)) {
  console.error(`Descargando guaguas (${CSV_URL})…`);
  const res = await fetch(CSV_URL);
  if (!res.ok) fail(`no se pudo descargar el CSV: HTTP ${res.status}`);
  mkdirSync(dirname(CSV_PATH), { recursive: true });
  writeFileSync(CSV_PATH, await res.text());
}

const { names } = await import(join(root, 'src/data/names.ts'));

/** Clave de comparación: sin tildes ni mayúsculas (Sofia = Sofía, Antu = Antü). */
const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

// El CSV casi no trae comillas; las pocas filas con comillas son nombres
// mal cargados ("Mia,", "Sebastian,Felipe") que la validación descarta.
function parseLine(line) {
  if (!line.includes('"')) return line.split(',');
  const fields = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') field += line[++i];
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      fields.push(field);
      field = '';
    } else field += c;
  }
  fields.push(field);
  return fields;
}

const VALID_NAME = /^\p{L}[\p{L}' -]*$/u;

/** key → { f, m, byYear: Map<año, n>, spellings: Map<grafía, n> } */
const stats = new Map();
/** Inscripciones totales por año: la tendencia se mide en proporción, porque
 * los nacimientos en Chile cayeron fuerte en el período. */
const yearTotals = new Map();
const lines = readFileSync(CSV_PATH, 'utf8').split('\n');
for (const line of lines.slice(1)) {
  if (!line) continue;
  const [yearRaw, name, sex, nRaw] = parseLine(line);
  const year = Number(yearRaw);
  const n = Number(nRaw);
  // "I" (sexo indeterminado) son ~300 filas: no aportan al reparto por sexo.
  if (year < opts.desde || year > opts.hasta || (sex !== 'F' && sex !== 'M')) continue;
  if (!VALID_NAME.test(name) || !Number.isFinite(n)) continue;

  const key = norm(name);
  let s = stats.get(key);
  if (!s) {
    s = { f: 0, m: 0, byYear: new Map(), spellings: new Map() };
    stats.set(key, s);
  }
  if (sex === 'F') s.f += n;
  else s.m += n;
  yearTotals.set(year, (yearTotals.get(year) ?? 0) + n);
  s.byYear.set(year, (s.byYear.get(year) ?? 0) + n);
  s.spellings.set(name, (s.spellings.get(name) ?? 0) + n);
}

// --- Cálculos. --------------------------------------------------------------

const total = (s) => s.f + s.m;
const femShare = (s) => s.f / total(s);

function suggestedGender(s) {
  const share = femShare(s);
  if (Math.min(share, 1 - share) >= UNISEX_MIN_SHARE) return 'x';
  return share > 0.5 ? 'f' : 'm';
}

const sumYears = (byYear, from, to) => {
  let acc = 0;
  for (let y = from; y <= to; y++) acc += byYear.get(y) ?? 0;
  return acc;
};

/** Proporción de los nacimientos en los últimos 3 años del rango contra los
 * 3 anteriores. */
function trend(s) {
  if (opts.hasta - opts.desde < 5) return '—';
  const recent = sumYears(s.byYear, opts.hasta - 2, opts.hasta);
  const before = sumYears(s.byYear, opts.hasta - 5, opts.hasta - 3);
  if (before === 0) return recent > 0 ? '↑ nuevo' : '—';
  const ratio =
    recent /
    sumYears(yearTotals, opts.hasta - 2, opts.hasta) /
    (before / sumYears(yearTotals, opts.hasta - 5, opts.hasta - 3));
  if (ratio >= 1.25) return `↑ ${Math.round((ratio - 1) * 100)} %`;
  if (ratio <= 0.8) return `↓ ${Math.round((1 - ratio) * 100)} %`;
  return '→';
}

const bySpelling = (s) => [...s.spellings].sort((a, b) => b[1] - a[1]);
const fmt = new Intl.NumberFormat('es-CL');
const pct = (x) => `${Math.round(x * 100)} %`;

const catalogKeys = new Set(names.map((n) => norm(n.name)));

/** Esqueleto fonético grueso para detectar grafías de un nombre que ya está
 * (Mathias ~ Matías, Lukas ~ Lucas, Mayte ~ Maite, Ema ~ Emma). */
const skeleton = (s) =>
  norm(s)
    .replace(/ph/g, 'f')
    .replace(/th/g, 't')
    .replace(/(?<!c)h/g, '')
    .replace(/k/g, 'c')
    .replace(/y/g, 'i')
    .replace(/z/g, 's')
    .replace(/v/g, 'b')
    .replace(/(.)\1+/g, '$1');
const catalogBySkeleton = new Map(names.map((n) => [skeleton(n.name), n.name]));
const ranked = [...stats].sort((a, b) => total(b[1]) - total(a[1]));
const missing = ranked.filter(([key]) => !catalogKeys.has(key)).slice(0, opts.top);

const COVERAGE_TOP = 200;
const covered = ranked.slice(0, COVERAGE_TOP).filter(([key]) => catalogKeys.has(key)).length;

// Nombres del catálogo cuyo género no calza con los datos chilenos.
const genderMismatches = names
  .map((n) => ({ n, s: stats.get(norm(n.name)) }))
  .filter(({ s }) => s && total(s) >= opts.min)
  .filter(({ n, s }) => n.gender !== suggestedGender(s))
  .sort((a, b) => total(b.s) - total(a.s));

// --- Salida (Markdown por stdout). ------------------------------------------

const range = `${opts.desde}–${opts.hasta}`;
const out = [];
out.push(`# Candidatos desde guaguas (${range})`);
out.push('');
out.push(
  `Registro Civil de Chile vía [guaguas](https://github.com/rivaquiroga/guaguas). ` +
    `Grafías sin tildes agrupadas (Sofia = Sofía). Unisex = sexo minoritario ≥ ${pct(UNISEX_MIN_SHARE)}. ` +
    `El catálogo cubre ${covered} de los ${COVERAGE_TOP} nombres más inscritos del rango.`,
);
out.push('');
out.push(`## Faltan en el catálogo (top ${missing.length})`);
out.push('');
out.push(
  '| # | Nombre | Inscripciones | Tendencia | Niñas | Género | Otras grafías | Variante de |',
);
out.push(
  '| -: | ------ | ------------: | --------- | ----: | :----: | ------------- | ----------- |',
);
missing.forEach(([key, s], i) => {
  const [[display], ...others] = bySpelling(s);
  // Grafías con al menos 1 % del total: el resto son errores de tipeo (Bélén).
  const variants = others
    .filter(([, n]) => n >= total(s) * 0.01)
    .map(([sp, n]) => `${sp} (${fmt.format(n)})`)
    .join(', ');
  const variantOf = catalogBySkeleton.get(skeleton(key)) ?? '';
  out.push(
    `| ${i + 1} | ${display} | ${fmt.format(total(s))} | ${trend(s)} | ${pct(femShare(s))} | ${suggestedGender(s)} | ${variants} | ${variantOf} |`,
  );
});
out.push('');
out.push(`## Género del catálogo vs. datos (≥ ${opts.min} inscripciones)`);
out.push('');
if (genderMismatches.length === 0) {
  out.push('Sin diferencias.');
} else {
  out.push(
    'Una diferencia no es necesariamente un error: algunos nombres son `x` por ' +
      'los datos de España o por el cruce entre decks (ver SOURCES.md, "Género").',
  );
  out.push('');
  out.push('| Nombre | Catálogo | Inscripciones | Niñas | Según datos |');
  out.push('| ------ | :------: | ------------: | ----: | :---------: |');
  for (const { n, s } of genderMismatches) {
    out.push(
      `| ${n.name} | ${n.gender} | ${fmt.format(total(s))} | ${pct(femShare(s))} | ${suggestedGender(s)} |`,
    );
  }
}

console.log(out.join('\n'));
