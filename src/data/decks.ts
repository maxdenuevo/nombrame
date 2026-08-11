import type { Deck } from './types';

// Decks seed locales para desarrollo. En producción viven en Postgres (tablas
// `decks` y `deck_names`) y este archivo es fuente del seed generado
// (scripts/generate-seed.mjs). Fuentes y criterio editorial de cada deck en
// SOURCES.md.
//
// Un deck es una decisión editorial, no un filtro: la membresía es explícita
// y curada, nunca derivada en runtime de `origin` u otro campo.
export const decks: Deck[] = [
  {
    slug: 'top-chile',
    title: 'Top 100 Chile',
    description: 'Los 100 nombres más inscritos en Chile: top 50 de niñas y top 50 de niños.',
    attribution: 'Registro Civil de Chile',
  },
  {
    slug: 'griegos',
    title: 'Griegos',
    description: 'Nombres con historia: dioses, filósofos y héroes del mundo griego.',
  },
  {
    slug: 'clasicos-latinos',
    title: 'Clásicos latinos',
    description: 'Nombres de raíz latina que nunca pasan de moda.',
  },
  {
    slug: 'cortos-y-sonoros',
    title: 'Cortos y sonoros',
    description: 'Nombres de pocas letras que suenan bien en cualquier idioma.',
  },
];

// Membresía de cada deck: listas ordenadas de slugs de `names`.
// El orden del array ES el rank (el generador de seed lo vuelca como
// rank = index + 1 en `deck_names`). Un nombre puede estar en varios decks.
export const deckNames: Record<string, readonly string[]> = {
  // Top 50 de niñas y top 50 de niños, intercalados por posición (el filtro
  // de género de la app los separa en dos top 50 limpios). Posiciones 1-10
  // del ranking 2025; 11-50 del último dataset abierto (2021). Ver SOURCES.md.
  // prettier-ignore
  'top-chile': [
    'emma', 'mateo', 'emilia', 'liam', 'sofia', 'lucas', 'isabella', 'santiago', 'julieta', 'facundo',
    'aurora', 'thiago', 'mia', 'benjamin', 'isidora', 'gael', 'trinidad', 'maximo', 'amanda', 'gaspar',
    'agustina', 'agustin', 'josefa', 'tomas', 'florencia', 'maximiliano', 'martina', 'vicente', 'maria', 'emiliano',
    'antonella', 'joaquin', 'maite', 'martin', 'emily', 'matias', 'valentina', 'alonso', 'antonia', 'luciano',
    'catalina', 'bruno', 'amelia', 'julian', 'renata', 'jose', 'dominga', 'gabriel', 'luciana', 'santino',
    'victoria', 'cristobal', 'amparo', 'dante', 'samantha', 'diego', 'ignacia', 'juan', 'leonor', 'nicolas',
    'amalia', 'sebastian', 'fernanda', 'leon', 'laura', 'simon', 'rafaela', 'ian', 'colomba', 'amaro',
    'elena', 'felipe', 'javiera', 'ignacio', 'pascal', 'noah', 'celeste', 'clemente', 'josefina', 'pedro',
    'lucia', 'rafael', 'matilda', 'samuel', 'olivia', 'valentin', 'francisca', 'renato', 'alice', 'daniel',
    'violeta', 'bastian', 'magdalena', 'dylan', 'camila', 'luis', 'monserrat', 'valentino', 'matilde', 'franco',
  ],
  griegos: [
    'sofia',
    'isidora',
    'catalina',
    'alejandro',
    'elena',
    'nicolas',
    'penelope',
    'sebastian',
    'zoe',
    'andres',
    'irene',
    'hector',
    'melisa',
    'teodoro',
    'ofelia',
    'damian',
    'alejandra',
    'cristobal',
    'felipe',
    'pedro',
  ],
  'clasicos-latinos': [
    'emilia',
    'violeta',
    'leon',
    'vicente',
    'amanda',
    'aurora',
    'valentina',
    'florencia',
    'clemente',
    'antonia',
    'maximo',
    'victoria',
    'salvador',
    'julieta',
    'facundo',
    'agustin',
    'laura',
    'martin',
    'camila',
    'luciano',
    'luciana',
    'julian',
    'renata',
    'valentin',
    'maximiliano',
    'ignacio',
    'amparo',
    'emiliano',
  ],
  'cortos-y-sonoros': [
    'noa',
    'emma',
    'leon',
    'mia',
    'cruz',
    'liam',
    'maite',
    'gael',
    'ariel',
    'zoe',
    'mateo',
    'bruno',
    'dante',
    'ian',
    'noah',
    'lucas',
  ],
};
