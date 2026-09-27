/**
 * Swatches: la familia de color de cada nombre.
 *
 * Cada nombre tiene un color fijo, asignado por hash de su slug: parece
 * aleatorio, viaja con el nombre a favoritos y matches, y los dos miembros de
 * la pareja lo ven igual. El color nunca depende del género del nombre.
 *
 * Receta (OKLCH, mismo tono h por familia; valores ya resueltos a hex):
 *   claro   card.bg L.86 C.13 · ink L.29 · inkMuted L.42 · blobs L.77–.91
 *   oscuro  card.bg L.46 C.12 · ink L.97 · inkMuted L.88 · blobs L.35–.50
 *   wash    fondo de pantalla lavado con el color de la card activa
 *   mesh    malla viva para onboarding y match (base + 4 blobs)
 * Todos los pares de texto pasan AA; lo verifica scripts/check-design.mjs.
 *
 * Sin imports: el script de chequeo carga este archivo directo con Node.
 */

export type SwatchId =
  | 'tomate'
  | 'mandarina'
  | 'mango'
  | 'lima'
  | 'menta'
  | 'turquesa'
  | 'cielo'
  | 'lavanda'
  | 'uva'
  | 'chicle';

/** Colores de una superficie con color propio: la card de un nombre, el cover de un deck. */
export interface CardPalette {
  bg: string;
  /** Texto e íconos sobre `bg` y sobre cualquier blob. */
  ink: string;
  /** Texto secundario sobre `bg`. */
  inkMuted: string;
  /** Relleno sutil sobre `bg`: `ink` al 10–14 %. */
  fill: string;
  /** Blobs de la malla de la card: arriba-izquierda, arriba-derecha, abajo-derecha, abajo-izquierda. */
  blobs: readonly [string, string, string, string];
}

/** Fondo de pantalla lavado con el color de una card. */
export interface Wash {
  base: string;
  blobs: readonly [string, string, string];
}

/** Malla viva de momentos especiales (onboarding, match). */
export interface Mesh {
  base: string;
  blobs: readonly [string, string, string, string];
}

export interface SwatchScheme {
  card: CardPalette;
  wash: Wash;
  mesh: Mesh;
  /** Color de la sombra teñida bajo la card. */
  shadow: string;
}

export interface Swatch {
  id: SwatchId;
  light: SwatchScheme;
  dark: SwatchScheme;
}

// prettier-ignore
export const SWATCHES: readonly Swatch[] = [
  {
    id: 'tomate',
    light: {
      card: { bg: '#FEBFB5', ink: '#4D1610', inkMuted: '#7A342C', fill: '#ECAEA5',
        blobs: ['#FFB890', '#FE8D9E', '#FE9C8E', '#FFD7D0'] },
      wash: { base: '#FEF0ED', blobs: ['#FFC6A6', '#FEB8C0', '#FFCDC5'] },
      mesh: { base: '#FEE0DB', blobs: ['#FFB5AA', '#FF7A91', '#FEA570', '#E05B4C'] },
      shadow: '#C13D31',
    },
    dark: {
      card: { bg: '#8F382E', ink: '#FEF2F0', inkMuted: '#F7CCC5', fill: '#9F5249',
        blobs: ['#A3394F', '#763500', '#652019', '#7E3028'] },
      wash: { base: '#1B0A08', blobs: ['#5F1B14', '#4C1F00', '#3F121B'] },
      mesh: { base: '#4B1E18', blobs: ['#8C2E25', '#741E32', '#823C01', '#3A0E0A'] },
      shadow: '#000000',
    },
  },
  {
    id: 'mandarina',
    light: {
      card: { bg: '#FFC29A', ink: '#461F00', inkMuted: '#753B07', fill: '#EDB28B',
        blobs: ['#FABF61', '#FF9373', '#FFA15C', '#FFD9C0'] },
      wash: { base: '#FFF0E7', blobs: ['#F9CC88', '#FEBCA8', '#FED0B2'] },
      mesh: { base: '#FEE2CF', blobs: ['#FFB98A', '#FE825E', '#F3AF37', '#D36D02'] },
      shadow: '#AC5701',
    },
    dark: {
      card: { bg: '#874300', ink: '#FFF2EB', inkMuted: '#F3D0B9', fill: '#985C21',
        blobs: ['#A33F20', '#644300', '#5C2B00', '#773A00'] },
      wash: { base: '#190C04', blobs: ['#542700', '#3F2900', '#3F1508'] },
      mesh: { base: '#482304', blobs: ['#7E3F02', '#742307', '#6F4B00', '#351500'] },
      shadow: '#000000',
    },
  },
  {
    id: 'mango',
    light: {
      card: { bg: '#FBC865', ink: '#3A2800', inkMuted: '#644701', fill: '#E8B85B',
        blobs: ['#D9CF63', '#F69D3D', '#E7B140', '#F9DEAD'] },
      wash: { base: '#FBF2E3', blobs: ['#DFD889', '#FFBF83', '#F5D69E'] },
      mesh: { base: '#FFE4B5', blobs: ['#F8C153', '#F19008', '#CEC23A', '#B48300'] },
      shadow: '#926A05',
    },
    dark: {
      card: { bg: '#725202', ink: '#FEF4E3', inkMuted: '#E8D5B3', fill: '#866922',
        blobs: ['#8E5303', '#524C01', '#4D3600', '#644701'] },
      wash: { base: '#160E02', blobs: ['#473100', '#332F00', '#381C00'] },
      mesh: { base: '#3D2A00', blobs: ['#6B4D01', '#613700', '#5B5402', '#2B1C00'] },
      shadow: '#000000',
    },
  },
  {
    id: 'lima',
    light: {
      card: { bg: '#BDE07E', ink: '#233100', inkMuted: '#41560A', fill: '#AECF71',
        blobs: ['#8FE298', '#C0BA31', '#A6CA60', '#D6EAB7'] },
      wash: { base: '#F0F6E6', blobs: ['#A8E7AE', '#D6D37C', '#CEE5AB'] },
      mesh: { base: '#DDF1BE', blobs: ['#B6DA70', '#B7B004', '#76D783', '#769C03'] },
      shadow: '#5F7E01',
    },
    dark: {
      card: { bg: '#496200', ink: '#F1F8E6', inkMuted: '#D0DEBA', fill: '#617720',
        blobs: ['#6B6703', '#135A23', '#304200', '#405600'] },
      wash: { base: '#0C1204', blobs: ['#2C3C00', '#00390F', '#272500'] },
      mesh: { base: '#263305', blobs: ['#455C01', '#484500', '#136327', '#192400'] },
      shadow: '#000000',
    },
  },
  {
    id: 'menta',
    light: {
      card: { bg: '#79ECB7', ink: '#013521', inkMuted: '#005C3D', fill: '#6DDAA8',
        blobs: ['#4BE6D4', '#74CD74', '#55D69F', '#B8F0D3'] },
      wash: { base: '#E7F8EF', blobs: ['#82EADC', '#A1E1A0', '#ABECCB'] },
      mesh: { base: '#BFF7DA', blobs: ['#67E7AE', '#5EC660', '#11DAC8', '#02A671'] },
      shadow: '#03875B',
    },
    dark: {
      card: { bg: '#036946', ink: '#E7FBF0', inkMuted: '#BBE2CD', fill: '#237D5E',
        blobs: ['#227727', '#02574F', '#01462E', '#005C3D'] },
      wash: { base: '#03130B', blobs: ['#01402A', '#003631', '#092C0B'] },
      mesh: { base: '#003823', blobs: ['#016242', '#04510E', '#006057', '#002717'] },
      shadow: '#000000',
    },
  },
  {
    id: 'turquesa',
    light: {
      card: { bg: '#4AEBEB', ink: '#013333', inkMuted: '#005959', fill: '#43D9D9',
        blobs: ['#57DEFF', '#08D1B2', '#09D5D5', '#AAF1F0'] },
      wash: { base: '#E3F8F8', blobs: ['#84E5FE', '#75E5CC', '#9AECEB'] },
      mesh: { base: '#B0F7F6', blobs: ['#1EE6E7', '#0BC6A9', '#0AD3F9', '#09A0A0'] },
      shadow: '#008282',
    },
    dark: {
      card: { bg: '#026565', ink: '#E3FBFA', inkMuted: '#B2E2E2', fill: '#227A7A',
        blobs: ['#037462', '#035464', '#004444', '#005959'] },
      wash: { base: '#001313', blobs: ['#013E3E', '#00343F', '#002B24'] },
      mesh: { base: '#003636', blobs: ['#045F5F', '#014E42', '#025D6E', '#002525'] },
      shadow: '#000000',
    },
  },
  {
    id: 'cielo',
    light: {
      card: { bg: '#A1D9FF', ink: '#002F48', inkMuted: '#035379', fill: '#91C8ED',
        blobs: ['#ADCCFE', '#02C8F1', '#69C5FE', '#C5E7FE'] },
      wash: { base: '#E9F6FE', blobs: ['#BDD6FE', '#74DEFF', '#B7E1FE'] },
      mesh: { base: '#D1ECFF', blobs: ['#92D4FF', '#07BDE5', '#98BFFE', '#0096D7'] },
      shadow: '#007AB0',
    },
    dark: {
      card: { bg: '#005F8A', ink: '#ECF7FE', inkMuted: '#BADDF5', fill: '#21749A',
        blobs: ['#046F87', '#244885', '#003F5E', '#035379'] },
      wash: { base: '#03111B', blobs: ['#003A57', '#102C5A', '#002934'] },
      mesh: { base: '#01324B', blobs: ['#005982', '#034A5B', '#285094', '#002236'] },
      shadow: '#000000',
    },
  },
  {
    id: 'lavanda',
    light: {
      card: { bg: '#C7CDFF', ink: '#242454', inkMuted: '#434582', fill: '#B7BCEE',
        blobs: ['#D6BCFE', '#8BB4FE', '#ADB3FF', '#DBDFFF'] },
      wash: { base: '#F1F3FE', blobs: ['#DDC9FF', '#B4CFFF', '#D3D8FF'] },
      mesh: { base: '#E3E6FF', blobs: ['#C0C5FF', '#7CAAFE', '#CCABFE', '#7A7CF0'] },
      shadow: '#6260D1',
    },
    dark: {
      card: { bg: '#4C4D99', ink: '#F3F4FE', inkMuted: '#D0D5F9', fill: '#6364A7',
        blobs: ['#345FB2', '#56397B', '#32326D', '#434487'] },
      wash: { base: '#0D0E1C', blobs: ['#2D2C67', '#372053', '#102245'] },
      mesh: { base: '#272950', blobs: ['#474698', '#1C3E81', '#5F3F89', '#1A1A3F'] },
      shadow: '#000000',
    },
  },
  {
    id: 'uva',
    light: {
      card: { bg: '#EEBBFE', ink: '#3C1B46', inkMuted: '#633970', fill: '#DCABEC',
        blobs: ['#FEACE3', '#C29FFF', '#E09DF5', '#F4D4FE'] },
      wash: { base: '#FAEFFD', blobs: ['#FFBCE8', '#D6C2FE', '#F1CBFE'] },
      mesh: { base: '#F7DEFF', blobs: ['#ECB1FF', '#BB91FF', '#FD95DC', '#B666CE'] },
      shadow: '#994AB0',
    },
    dark: {
      card: { bg: '#733F83', ink: '#FBF1FF', inkMuted: '#E6CEED', fill: '#865894',
        blobs: ['#714CA6', '#702E5D', '#4F265C', '#653773'] },
      wash: { base: '#150B18', blobs: ['#4A2156', '#4A183C', '#2A1A40'] },
      mesh: { base: '#3C2144', blobs: ['#6F3680', '#4D2F77', '#7C3367', '#2D1234'] },
      shadow: '#000000',
    },
  },
  {
    id: 'chicle',
    light: {
      card: { bg: '#FEBAD9', ink: '#481531', inkMuted: '#743355', fill: '#ECAAC8',
        blobs: ['#FEB3BB', '#EB8EDE', '#FD93C7', '#FFD3E6'] },
      wash: { base: '#FFEEF5', blobs: ['#FFC2C8', '#F9B3EE', '#FFC9E1'] },
      mesh: { base: '#FFDDEC', blobs: ['#FFAFD4', '#E77EDA', '#FF9EAA', '#D4599B'] },
      shadow: '#B53C7F',
    },
    dark: {
      card: { bg: '#873761', ink: '#FFF1F7', inkMuted: '#F2CBDC', fill: '#985176',
        blobs: ['#8F4086', '#7A2B3A', '#5F2042', '#772F55'] },
      wash: { base: '#190A11', blobs: ['#591A3C', '#511522', '#371533'] },
      mesh: { base: '#471D33', blobs: ['#842D5C', '#65245E', '#873041', '#360E24'] },
      shadow: '#000000',
    },
  },
];

/**
 * Sal del hash. Elegida para que los 352 nombres se repartan parejo (32–38
 * por color) y sin relación con el género. **Congelarla al lanzar**: cambiarla
 * recolorea todos los nombres.
 */
export const SWATCH_SALT = 'nombra3973';

/** FNV-1a de 32 bits. Determinista en cualquier dispositivo. */
export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

/** Swatch de un nombre, por su slug (nunca por UUID: el slug es igual en todos los dispositivos). */
export function swatchFor(nameSlug: string): Swatch {
  return SWATCHES[fnv1a(`${SWATCH_SALT}:${nameSlug}`) % SWATCHES.length];
}

/** Swatch de un deck. `null` es el pseudo-deck "Todos los nombres". */
export function swatchForDeck(deckSlug: string | null): Swatch {
  return swatchFor(`deck:${deckSlug ?? 'all'}`);
}
