// Genera los seeds SQL del catálogo a partir de src/data (la única fuente de
// verdad hasta que exista el proyecto de Supabase):
//
//   src/data/names.ts  →  supabase/migrations/00002_seed_names.sql
//   src/data/decks.ts  →  supabase/migrations/00004_seed_decks.sql
//
// Uso:  node scripts/generate-seed.mjs
//
// Requiere Node 24 (type stripping nativo: los .ts de datos solo tienen
// imports de tipos, así que se importan directo). Correr a mano tras tocar el
// catálogo y commitear el output — nunca editar esos SQL a mano.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const { names } = await import(join(root, 'src/data/names.ts'));
const { decks, deckNames } = await import(join(root, 'src/data/decks.ts'));

// --- Validaciones: fallar ruidosamente antes de emitir SQL corrupto. -------

const errors = [];

const nameSlugs = new Set();
for (const n of names) {
  if (nameSlugs.has(n.id)) errors.push(`slug de nombre duplicado en names.ts: '${n.id}'`);
  nameSlugs.add(n.id);
}

const deckSlugs = new Set();
for (const d of decks) {
  if (deckSlugs.has(d.slug)) errors.push(`slug de deck duplicado en decks.ts: '${d.slug}'`);
  deckSlugs.add(d.slug);
}

for (const slug of Object.keys(deckNames)) {
  if (!deckSlugs.has(slug)) errors.push(`membresía de un deck que no existe: '${slug}'`);
}

for (const d of decks) {
  const members = deckNames[d.slug];
  if (!members || members.length === 0) {
    errors.push(`deck sin membresía: '${d.slug}'`);
    continue;
  }
  const seen = new Set();
  for (const member of members) {
    if (!nameSlugs.has(member)) {
      errors.push(`'${d.slug}' referencia un nombre que no está en names.ts: '${member}'`);
    }
    if (seen.has(member)) errors.push(`'${d.slug}' repite el nombre '${member}'`);
    seen.add(member);
  }
}

if (errors.length > 0) {
  console.error('Seed NO generado:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// --- Emisión. ---------------------------------------------------------------

/** Literal SQL: comillas simples escapadas por duplicación. */
const q = (s) => `'${String(s).replaceAll("'", "''")}'`;
const qOrNull = (s) => (s == null ? 'null' : q(s));

const namesSql = `-- Seed del catálogo de nombres. GENERADO por scripts/generate-seed.mjs desde
-- src/data/names.ts — no editar a mano. Cuando el backend esté conectado,
-- Postgres es la fuente de verdad y el archivo local desaparece.

insert into public.names (slug, name, gender, origin, meaning) values
${names.map((n) => `  (${q(n.id)}, ${q(n.name)}, ${q(n.gender)}, ${q(n.origin)}, ${q(n.meaning)})`).join(',\n')}
on conflict (slug) do nothing;
`;

const deckRows = decks
  .map(
    (d, i) =>
      `  (${q(d.slug)}, ${q(d.title)}, ${q(d.description)}, ${qOrNull(d.attribution)}, ${i})`,
  )
  .join(',\n');

// El orden del array en deckNames ES el rank (index + 1).
const memberRows = decks
  .flatMap((d) => deckNames[d.slug].map((slug, i) => `  (${q(d.slug)}, ${q(slug)}, ${i + 1})`))
  .join(',\n');

const decksSql = `-- Seed de decks y membresías. GENERADO por scripts/generate-seed.mjs desde
-- src/data/decks.ts — no editar a mano.

insert into public.decks (slug, title, description, attribution, sort_order) values
${deckRows}
on conflict (slug) do nothing;

insert into public.deck_names (deck_id, name_id, rank)
select d.id, n.id, v.rank
from (values
${memberRows}
) as v (deck_slug, name_slug, rank)
join public.decks d on d.slug = v.deck_slug
join public.names n on n.slug = v.name_slug
on conflict do nothing;
`;

const namesPath = join(root, 'supabase/migrations/00002_seed_names.sql');
const decksPath = join(root, 'supabase/migrations/00004_seed_decks.sql');
writeFileSync(namesPath, namesSql);
writeFileSync(decksPath, decksSql);

console.log(`OK: ${names.length} nombres → 00002_seed_names.sql`);
console.log(
  `OK: ${decks.length} decks, ${decks.reduce((acc, d) => acc + deckNames[d.slug].length, 0)} membresías → 00004_seed_decks.sql`,
);
