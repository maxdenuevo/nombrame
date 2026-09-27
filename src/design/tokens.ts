/**
 * Tokens sin variante de esquema: espaciado, radios, tipografía, movimiento.
 * Los colores viven en `swatches.ts` (los nombres) y `chrome.ts` (la app).
 *
 * La regla: ningún componente escribe un tamaño, radio, espaciado o color
 * literal. Si falta un valor, falta un token.
 */

/** Grilla de 4. Ante la duda, `xl` (20): márgenes de pantalla. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

/** Radios grandes y blandos. La card es lo más redondo de la app. */
export const radius = {
  pill: 999,
  row: 28,
  cover: 32,
  card: 42,
  panel: 44,
} as const;

/** Touch target mínimo (Android; cubre el 44 de iOS). */
export const touchTarget = 48;

/** Una sola familia, Nunito, en tres pesos. Black para nombres y títulos. */
export const font = {
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const type = {
  /** El nombre en la card. Se encoge hasta `nameXlMin` antes de pasar a dos líneas. */
  nameXl: { fontFamily: font.black, fontSize: 72, lineHeight: 78, letterSpacing: -1 },
  title: { fontFamily: font.black, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  /** El nombre en filas y covers. */
  name: { fontFamily: font.black, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  heading: { fontFamily: font.black, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: font.bold, fontSize: 17, lineHeight: 24 },
  label: { fontFamily: font.black, fontSize: 17, lineHeight: 22 },
  caption: { fontFamily: font.extraBold, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: font.black,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypeVariant = keyof typeof type;

/** Piso del auto-shrink del nombre en la card. */
export const nameXlMin = 44;

/**
 * Cap de escalado del font scale del sistema por rol. Los roles grandes viven
 * en layouts rígidos (la card) y se acotan; el texto corrido se estira más.
 * Nunca usar `allowFontScaling={false}`.
 */
export const maxScaleFor: Record<TypeVariant, number> = {
  nameXl: 1.2,
  title: 1.3,
  name: 1.4,
  heading: 1.5,
  body: 1.6,
  label: 1.4,
  caption: 1.6,
  overline: 1.4,
};

/** Física con rebote: la app se siente de goma, no de vidrio rígido. */
export const motion = {
  snappy: { damping: 20, stiffness: 320 },
  bouncy: { damping: 11, stiffness: 240 },
  gentle: { damping: 18, stiffness: 150 },
  /** Escala al presionar un control. */
  pressScale: 0.94,
  /** Salida de la card tras el swipe, en ms. */
  exit: 220,
  /** Períodos de deriva de los blobs de la malla, en ms: distintos para que nunca se sincronicen. */
  drift: [7000, 9000, 11000, 13000],
} as const;

/** `#RRGGBB` + alfa → `#RRGGBBAA`. Para fundidos de gradiente y sombras teñidas. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex.slice(0, 7)}${a}`;
}

/** Sombra teñida del color de la superficie (card, cover, botón). */
export const shadow = {
  card: (color: string) => `0px 30px 60px -24px ${withAlpha(color, 0.6)}`,
  soft: (color: string) => `0px 14px 28px -14px ${withAlpha(color, 0.45)}`,
} as const;
