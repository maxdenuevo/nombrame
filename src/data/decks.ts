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
    slug: 'clasicos-chilenos',
    title: 'Clásicos chilenos',
    description: 'Nombres que llevan dos generaciones entre los más inscritos de Chile.',
    attribution: 'Registro Civil de Chile, 1990–1999 y 2012–2021',
  },
  {
    slug: 'hace-cien-anos',
    title: 'Hace 100 años',
    description:
      'Nombres de abuelas y abuelos: los que ya volvieron, los que asoman y los que esperan su turno.',
    attribution: 'Registro Civil de Chile, 1930–1965 y 2015–2021',
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
  {
    slug: 'pueblos-originarios',
    title: 'Pueblos originarios',
    description: 'Nombres mapuche, quechua, aymara y guaraní que ya se inscriben en Chile.',
    attribution: 'Registro Civil de Chile, inscripciones 2010-2021',
  },
  {
    slug: 'unisex',
    title: 'Unisex',
    description: 'Nombres que se usan para niñas y para niños, en Chile o en otros países.',
    attribution: 'Registro Civil de Chile e INE de España',
  },
  {
    slug: 'top-espana',
    title: 'Top 100 España',
    description: 'Los 100 nombres más elegidos para niñas y para niños en España.',
    attribution: 'INE de España, nacidos 2024',
  },
  {
    slug: 'top-italia',
    title: 'Top 100 Italia',
    description: 'Los 50 nombres más elegidos para niñas y para niños en Italia.',
    attribution: 'ISTAT, nacidos 2023',
  },
  {
    slug: 'top-argentina',
    title: 'Top 20 Argentina',
    description: 'Los 20 nombres más inscritos para niñas y para niños en Argentina.',
    attribution: 'RENAPER, inscripciones 2025',
  },
  {
    slug: 'top-mexico',
    title: 'Top 10 México',
    description: 'Los 10 nombres más registrados para niñas y para niños en México.',
    attribution: 'INEGI / RENAPO, 2017-2021',
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
  // Top 150 en 1990–1999 y top 250 en 2012–2021 (guaguas), fuera del Top 100
  // Chile. Niñas y niños intercalados por inscripciones 2012–2021; al acabarse
  // las niñas (hay menos clásicos de niña), siguen los niños. Ver SOURCES.md.
  // prettier-ignore
  'clasicos-chilenos': [
    'constanza', 'francisco', 'belen', 'javier', 'pia', 'carlos', 'rocio', 'fernando', 'daniela', 'david',
    'gabriela', 'pablo', 'mariana', 'cristian', 'elizabeth', 'gustavo', 'isabel', 'esteban', 'genesis', 'jorge',
    'paula', 'manuel', 'ana', 'alejandro', 'angela', 'victor', 'denisse', 'rodrigo', 'barbara', 'elias',
    'carolina', 'miguel', 'alexandra', 'leonardo', 'alejandra', 'eduardo', 'carla', 'andres', 'camilo', 'fabian',
    'alvaro', 'cristopher', 'gonzalo', 'jean', 'ricardo', 'alexis', 'alan', 'hector', 'jesus', 'sergio',
    'oscar', 'kevin', 'claudio', 'guillermo', 'marcelo', 'alex', 'mauricio', 'patricio', 'ivan', 'cesar',
    'jonathan', 'roberto', 'mario',
  ],
  // Abren los imprescindibles editoriales; después, los que ya volvieron, los
  // que asoman y los dormidos, cada grupo por uso en 1930–1965 con niñas y
  // niños intercalados. Criterio en SOURCES.md.
  // prettier-ignore
  'hace-cien-anos': [
    'ofelia', 'wenceslao', 'cordelia', 'enrique', 'patricia', 'ximena', 'elena', 'domingo', 'lucia', 'lorenzo',
    'clara', 'augusto', 'elisa', 'salvador', 'aurora', 'pascual', 'violeta', 'nicanor', 'olivia', 'matilde',
    'leonor', 'amelia', 'amalia', 'dominga', 'eloisa', 'pascuala', 'lorenza', 'juana', 'gregorio', 'alicia',
    'leopoldo', 'gladys', 'benito', 'eliana', 'aurelio', 'luisa', 'horacio', 'julia', 'elsa', 'ines',
    'mercedes', 'luz', 'nora', 'aida', 'ester', 'irene', 'georgina', 'eugenia', 'eva', 'zulema',
    'rita', 'rosalia', 'regina', 'delfina', 'flora', 'rosa', 'hector', 'margarita', 'mario', 'marta',
    'raul', 'carmen', 'guillermo', 'teresa', 'julio', 'olga', 'hugo', 'sonia', 'ramon', 'norma',
    'hernan', 'blanca', 'rene', 'irma', 'segundo', 'gloria', 'osvaldo', 'hilda', 'humberto', 'graciela',
    'orlando', 'berta', 'ernesto', 'raquel', 'alberto', 'yolanda', 'alfredo', 'elba', 'bernardo', 'fresia',
    'armando', 'nelly', 'rolando', 'guillermina', 'eugenio', 'lucila', 'heriberto', 'elvira', 'reinaldo', 'filomena',
    'rigoberto', 'ernestina', 'gilberto', 'zoila', 'octavio', 'zunilda', 'dagoberto', 'hortensia', 'arnoldo', 'uberlinda',
    'waldo', 'luzmira', 'edmundo', 'herminia', 'leontina', 'celia', 'petronila', 'clementina', 'manuela',
  ],
  // Ordenado por inscripciones en Chile 2010-2021 (guaguas). Ver SOURCES.md.
  // prettier-ignore
  'pueblos-originarios': [
    'rayen', 'aylen', 'millaray', 'lautaro', 'amaru', 'ayelen', 'nahuel', 'eluney', 'anahi', 'antu',
    'tahiel', 'inti', 'aukan', 'nayra', 'newen', 'amancay', 'ayun', 'suyai', 'aliwen', 'likan',
    'quimey', 'kallfu', 'liwen', 'kuyen', 'munay', 'maiten', 'illari', 'relmu', 'katari', 'llanka',
  ],
  // Primero los que más se mezclan en Chile; al final los que son unisex por
  // el cruce entre países (Andrea y Elia). Criterio en SOURCES.md, "Género".
  // prettier-ignore
  unisex: [
    'ariel', 'eluney', 'yael', 'antu', 'cruz', 'ari', 'jael', 'simone', 'eden', 'sasha',
    'ayun', 'quimey', 'akira', 'aliwen', 'morgan', 'liwen', 'robin', 'kallfu', 'taylor', 'katari',
    'marley', 'lur', 'haize', 'altair', 'ares', 'enea', 'munay', 'relmu', 'andrea', 'elia',
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
    'ariadna',
    'gaia',
    'iris',
    'angela',
    'helena',
    'maia',
    'chloe',
    'ines',
    'teresa',
    'delfina',
    'enea',
    'jorge',
    'ares',
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
    'constanza',
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
    'emilio',
    'pablo',
    'mario',
    'paula',
    'paz',
    'julia',
    'claudia',
    'adriana',
    'clara',
    'marina',
    'diana',
    'valeria',
    'regina',
    'victor',
    'sergio',
    'benicio',
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
    'leo',
    'luca',
    'marco',
    'alma',
    'luna',
    'kai',
    'max',
    'axel',
    'nil',
    'aria',
    'nina',
  ],
  // Decks país: top de niñas y top de niños intercalados por posición (el
  // filtro de género los separa en dos rankings limpios). Fuentes en SOURCES.md.
  // prettier-ignore
  'top-espana': [
    'sofia', 'mateo', 'lucia', 'hugo', 'martina', 'martin', 'maria', 'leo', 'vega', 'manuel',
    'julia', 'lucas', 'olivia', 'pablo', 'valeria', 'alejandro', 'mia', 'enzo', 'emma', 'alvaro',
    'paula', 'daniel', 'carmen', 'thiago', 'alma', 'luca', 'carla', 'gonzalo', 'lola', 'mario',
    'gala', 'liam', 'lara', 'adrian', 'daniela', 'oliver', 'sara', 'bruno', 'jimena', 'diego',
    'chloe', 'gael', 'valentina', 'nicolas', 'claudia', 'alex', 'noa', 'marcos', 'alba', 'david',
    'laia', 'marco', 'candela', 'antonio', 'manuela', 'juan', 'victoria', 'miguel', 'triana', 'gabriel',
    'alejandra', 'javier', 'vera', 'izan', 'ana', 'rodrigo', 'elena', 'marc', 'aitana', 'jose',
    'carlota', 'angel', 'blanca', 'carlos', 'zoe', 'dylan', 'ines', 'dario', 'adriana', 'noah',
    'lia', 'adam', 'abril', 'jaime', 'nora', 'samuel', 'clara', 'nico', 'marina', 'santiago',
    'luna', 'pau', 'rocio', 'guillermo', 'marta', 'jorge', 'amira', 'hector', 'alicia', 'eric',
    'celia', 'luis', 'gabriela', 'francisco', 'eva', 'amir', 'laura', 'iker', 'leire', 'jesus',
    'ona', 'victor', 'india', 'sergio', 'ariadna', 'matias', 'julieta', 'aaron', 'irene', 'pedro',
    'alaia', 'rafael', 'isabel', 'mohamed', 'catalina', 'ian', 'isabella', 'julen', 'iria', 'biel',
    'iris', 'unai', 'violeta', 'nil', 'angela', 'saul', 'aurora', 'marti', 'mar', 'ares',
    'africa', 'isaac', 'aina', 'alonso', 'diana', 'ruben', 'cataleya', 'ivan', 'nour', 'erik',
    'antonella', 'alan', 'lina', 'pol', 'adara', 'aleix', 'ainara', 'fernando', 'andrea', 'rayan',
    'yasmin', 'jan', 'aya', 'ignacio', 'ainhoa', 'joel', 'alana', 'alberto', 'macarena', 'arnau',
    'naia', 'ander', 'jana', 'ismael', 'elsa', 'luka', 'layan', 'fabio', 'aria', 'raul',
    'elia', 'kai', 'helena', 'neizan', 'camila', 'andres', 'maia', 'aday', 'amelia', 'aran',
    'aroa', 'tomas', 'leyre', 'maximo', 'nerea', 'elias', 'teresa', 'axel', 'fatima', 'max',
  ],
  // prettier-ignore
  'top-italia': [
    'sofia', 'leonardo', 'aurora', 'edoardo', 'ginevra', 'tommaso', 'vittoria', 'francesco', 'giulia', 'alessandro',
    'beatrice', 'mattia', 'ludovica', 'lorenzo', 'alice', 'gabriele', 'emma', 'riccardo', 'matilde', 'andrea',
    'anna', 'diego', 'camilla', 'giuseppe', 'bianca', 'matteo', 'azzurra', 'enea', 'chiara', 'nicolo',
    'nicole', 'antonio', 'giorgia', 'federico', 'isabel', 'giovanni', 'greta', 'filippo', 'noemi', 'samuele',
    'martina', 'pietro', 'arianna', 'giulio', 'gaia', 'gioele', 'sara', 'davide', 'rebecca', 'michele',
    'viola', 'christian', 'elena', 'elia', 'ambra', 'gabriel', 'chloe', 'noah', 'diana', 'marco',
    'adele', 'salvatore', 'francesca', 'liam', 'mia', 'luca', 'margherita', 'vincenzo', 'sole', 'thomas',
    'cecilia', 'emanuele', 'gioia', 'alessio', 'emily', 'nathan', 'marta', 'giorgio', 'elisa', 'samuel',
    'nina', 'jacopo', 'lavinia', 'giacomo', 'anita', 'ettore', 'amelia', 'raffaele', 'eleonora', 'daniele',
    'carlotta', 'simone', 'maria', 'luigi', 'celeste', 'damiano', 'eva', 'domenico', 'giada', 'santiago',
  ],
  // prettier-ignore
  'top-argentina': [
    'isabella', 'benjamin', 'valentina', 'gael', 'olivia', 'mateo', 'sofia', 'valentino', 'jazmin', 'valentin',
    'victoria', 'enzo', 'martina', 'liam', 'emma', 'noah', 'emilia', 'giovanni', 'mia', 'felipe',
    'catalina', 'julian', 'aitana', 'nicolas', 'ambar', 'benicio', 'franchesca', 'bastian', 'zoe', 'eithan',
    'alma', 'lionel', 'delfina', 'gabriel', 'luz', 'agustin', 'abigail', 'ezequiel',
  ],
  // prettier-ignore
  'top-mexico': [
    'sofia', 'santiago', 'maria-jose', 'mateo', 'valentina', 'sebastian', 'ximena', 'leonardo', 'regina', 'matias',
    'camila', 'emiliano', 'maria-fernanda', 'diego', 'valeria', 'miguel-angel', 'renata', 'daniel', 'victoria', 'alexander',
  ],
};
