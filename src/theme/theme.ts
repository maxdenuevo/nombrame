/**
 * Capa semántica. Es lo único que deben importar los componentes (vía
 * `useTheme`). Ningún componente toca `brand` ni `neutral` directamente.
 *
 * La jerarquía de tokens (superficies escalonadas, label ×4, fill, separator,
 * placeholder) viene del sistema portado, que a su vez replica los semantic
 * colors de UIKit que React Native no provee. Los valores son de nombra.me:
 * porcelana lavanda y ciruela, nunca `#FFF`/`#000` puros (DESIGN.md §9), y el
 * acento es coral, no el azul del sistema.
 */

import { brand, neutral } from './tokens';

const light = {
  // Superficies, de la más profunda a la más alta.
  background: neutral.light[1], // #F7F6F9  fondo de pantalla
  surfaceSunken: neutral.light[2], // #EFEDF3  hundido sobre el fondo
  surface: neutral.light[0], // #FFFFFF  cards, sheets, filas
  // En claro la profundidad la da la sombra, no un tono más claro: no hay
  // nada por encima del blanco.
  surfaceElevated: neutral.light[0], // #FFFFFF

  // Texto, de más a menos prominente.
  label: neutral.light[9], // #2B2233
  labelSecondary: neutral.light[7], // #6E6478
  labelTertiary: 'rgba(43,34,51,0.30)',
  labelQuaternary: 'rgba(43,34,51,0.18)',
  placeholder: neutral.light[5], // #B9B3C2

  // Divisores y rellenos neutros.
  separator: neutral.light[3], // #E6E2EC
  separatorOpaque: neutral.light[4], // #CFC9D6
  fill: 'rgba(110,100,120,0.10)', // chips, inputs, superficies inertes

  // Acento. `tint` es coral como acento (íconos, tabs, bordes).
  tint: brand.coral[4], // #FF6F61
  // `tintSolid` es el relleno cuando lleva texto encima: coral 500 con blanco
  // da 2.73:1 y no pasa ni AA Large. El paso 600 con blanco da 3.92:1, que sí
  // pasa AA Large (el label del botón es 16 SemiBold). Si algún día se quiere
  // AA completo para texto pequeño sobre coral, subir a `brand.coral[6]`.
  tintSolid: brand.coral[5], // #D6584C
  onTintSolid: '#FFFFFF',

  // Identidad. No son colores de texto: alimentan el gradiente de match y las
  // marcas de "de quién es esto".
  partnerA: brand.coral[4], // #FF6F61
  partnerB: brand.violet[4], // #6C5CE7

  // Estado. Nunca comunicar estado solo con color: siempre con ícono o texto.
  success: brand.success[4],
  danger: brand.danger[4],
  warning: brand.warning[4],
  /** Swipe a la izquierda. Neutro apagado: pasar no es un error. */
  pass: neutral.light[5], // #B9B3C2
};

/**
 * El contrato entre los dos esquemas: mismas claves, valores `string`.
 *
 * No sirve `typeof light` a secas: las rampas son `as const`, así que cada
 * valor llega con su tipo literal y el esquema oscuro tendría que repetir los
 * hex del claro para compilar. Lo que tiene que coincidir es el juego de
 * claves, no el hex — de ahí el mapped type.
 */
export type Colors = { [K in keyof typeof light]: string };

const dark: Colors = {
  background: neutral.dark[9], // #17131D
  surfaceSunken: neutral.dark[9], // #17131D  en oscuro, hundido = el fondo
  surface: neutral.dark[8], // #221C2B
  // En oscuro la sombra casi no se ve: lo que hace que algo se lea "por
  // encima" es un tono más claro, no la elevación.
  surfaceElevated: neutral.dark[7], // #2C2536

  label: neutral.dark[0], // #F2EFF6
  labelSecondary: neutral.dark[2], // #A79DB3
  labelTertiary: 'rgba(242,239,246,0.30)',
  labelQuaternary: 'rgba(242,239,246,0.16)',
  placeholder: neutral.dark[3], // #8A7F97

  separator: neutral.dark[6], // #352D40
  separatorOpaque: neutral.dark[5], // #574E64
  fill: 'rgba(167,157,179,0.14)',

  tint: brand.coral[2], // #FF8378
  // Patrón inverso al de modo claro: relleno claro con texto oscuro. Da
  // 7.64:1, mejor que cualquier combinación con blanco sobre coral.
  tintSolid: brand.coral[2], // #FF8378
  onTintSolid: neutral.dark[9], // #17131D

  partnerA: brand.coral[2], // #FF8378
  partnerB: brand.violet[2], // #8577EC

  success: brand.success[2],
  danger: brand.danger[2],
  warning: brand.warning[2],
  pass: neutral.dark[4], // #7A7284
};

export const schemes: Record<'light' | 'dark', Colors> = { light, dark };
export type ColorScheme = keyof typeof schemes;

/**
 * Gradiente de match. Usar con expo-linear-gradient, ángulo 135° (coral
 * arriba-izquierda). **Solo para matches** — nunca como decoración genérica.
 */
export const gradientMatch = (c: Colors) => [c.partnerA, c.partnerB] as const;

export {
  spacing,
  radius,
  continuousCurve,
  elevation,
  minTouchTarget,
  type,
  maxScaleFor,
  material,
  withAlpha,
  shade,
} from './tokens';
