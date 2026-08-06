/**
 * Tokens primitivos. Valores crudos, sin significado semántico.
 *
 * La arquitectura (primitivos → semántico → componentes), la escala de
 * espaciado, los radios y el material vienen del sistema portado de Folium /
 * AntiqueKit. Los valores de color y la tipografía son de nombra.me.
 *
 * NO consumir este archivo desde un componente: usar `theme.ts`.
 * Excepción: `spacing`, `radius` y `type` son primitivos sin variante de
 * esquema, se importan directo (theme.ts los reexporta por comodidad).
 */

// ---------------------------------------------------------------------------
// Rampas de marca. 9 pasos, del más claro (100) al más oscuro (900).
//
// Regla: el paso 500 es el color de modo claro y el 300 el de modo oscuro.
// Los pares de DESIGN.md ya cumplían esa relación (el valor oscuro siempre es
// un paso más luminoso), así que ningún color existente cambió: solo se le
// agregaron vecinos.
//
// Los 7 pasos restantes se interpolaron en OKLCH conservando el hue, no en RGB
// lineal — el salto de luminosidad queda parejo y las rampas sirven para
// tintes y fondos suaves.
// ---------------------------------------------------------------------------

export const brand = {
  coral: [
    '#FEF0EE',
    '#FFBDB5',
    '#FF8378',
    '#FF796D',
    '#FF6F61',
    '#D6584C',
    '#AF4239',
    '#892D26',
    '#651814',
  ],
  violet: [
    '#F2F2FF',
    '#B8B4FF',
    '#8577EC',
    '#786AEA',
    '#6C5CE7',
    '#5D4FC9',
    '#4E42AC',
    '#403590',
    '#322975',
  ],
  success: [
    '#DEFCEB',
    '#93D6B3',
    '#3BB07E',
    '#35A774',
    '#2E9E6B',
    '#228659',
    '#166F49',
    '#095938',
    '#034429',
  ],
  danger: [
    '#FEEFEF',
    '#FCA5A8',
    '#E0606B',
    '#DB535E',
    '#D64550',
    '#B93943',
    '#9C2D36',
    '#80212A',
    '#66161E',
  ],
  warning: [
    '#FFF1DE',
    '#FAD49D',
    '#F0B75C',
    '#ECAD4D',
    '#E8A33D',
    '#C08427',
    '#9A660E',
    '#734A02',
    '#4E3102',
  ],
} as const;

export type BrandRamp = keyof typeof brand;
export type Step = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/** `shade('coral', 700)` → '#AF4239'. Solo para rampas de marca. */
export const shade = (name: BrandRamp, step: Step): string => brand[name][step / 100 - 1];

/**
 * Rampa neutra, del más claro al más oscuro. **10 pasos, no 9:** a diferencia
 * de una rampa de color, la neutra tiene que cubrir desde el texto hasta el
 * fondo más profundo, y en oscuro eso son cuatro superficies apiladas
 * (background → surface → surfaceElevated → separator) más cinco niveles de
 * texto. Con 9 pasos había que inventar un valor fuera de la rampa.
 *
 * Es la única rampa que se indexa directo (no por `shade`), y su único
 * consumidor es `theme.ts`.
 */
export const neutral = {
  light: [
    '#FFFFFF',
    '#F7F6F9',
    '#EFEDF3',
    '#E6E2EC',
    '#CFC9D6',
    '#B9B3C2',
    '#8E8799',
    '#6E6478',
    '#453C50',
    '#2B2233',
  ],
  dark: [
    '#F2EFF6',
    '#D5CEDE',
    '#A79DB3',
    '#8A7F97',
    '#7A7284',
    '#574E64',
    '#352D40',
    '#2C2536',
    '#221C2B',
    '#17131D',
  ],
} as const;

// ---------------------------------------------------------------------------
// Espaciado. Escala de Folium, derivada de sus constraints reales y no de una
// grilla de 4 u 8. La unidad de trabajo es `xl` (20): márgenes de pantalla,
// separación entre secciones, gutter. Ante la duda, `xl`.
//
// Si un layout necesita un valor que no está acá, primero probar el token
// vecino. Si de verdad no alcanza, la pregunta no es qué número poner sino si
// falta un token.
// ---------------------------------------------------------------------------

export const spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
  '2xl': 26,
  '3xl': 30,
  '4xl': 46,
} as const;

// ---------------------------------------------------------------------------
// Radios. Grandes: es la firma visual del sistema. La regla de anidamiento es
// que el radio interior sea el exterior menos el padding entre ambos, para que
// las curvas queden concéntricas y no tangentes — de ahí el par 40/36 con
// `spacing.xs` de separación. Si se cambia uno hay que cambiar el otro.
// ---------------------------------------------------------------------------

export const radius = {
  /** Filas de lista. Token propio: los radios de Folium están calibrados para
   * cards de ~300 px y sobre una fila de ~60 px la convierten en píldora. */
  row: 20,
  control: 32,
  panel: 38,
  cardOuter: 40,
  cardInner: 36,
  pill: 999,
} as const;

/**
 * Squircle en iOS. Sin efecto en Android, que dibuja arco circular — la
 * diferencia se nota en radios de 40 y no hay equivalente nativo.
 * Va en todo contenedor con radio.
 */
export const continuousCurve = { borderCurve: 'continuous' } as const;

// ---------------------------------------------------------------------------
// Elevación. Folium no usa sombras porque el material las reemplaza, pero acá
// el material cae a color sólido en Android (que es el público mayoritario) y
// sin sombra las capas se pierden. Dos niveles, nada más. En oscuro la sombra
// casi no se ve: los componentes complementan con borde `separator`.
// ---------------------------------------------------------------------------

export const elevation = {
  raised: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
} as const;

/** Touch target mínimo (estándar Android; cubre el 44 de iOS). */
export const minTouchTarget = 48;

// ---------------------------------------------------------------------------
// Tipografía. Seis roles semánticos, dos familias. Nunca se escribe un tamaño
// de fuente a mano: se pide un rol. Fraunces se reserva para nombres y
// títulos; si aparece en un botón o un párrafo, está mal usada.
// ---------------------------------------------------------------------------

export const type = {
  nameXl: { fontFamily: 'Fraunces_600SemiBold', fontSize: 44, lineHeight: 48 },
  title: { fontFamily: 'Fraunces_600SemiBold', fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: 'Figtree_600SemiBold', fontSize: 20, lineHeight: 26 },
  body: { fontFamily: 'Figtree_400Regular', fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: 'Figtree_500Medium', fontSize: 13, lineHeight: 18 },
  /** Etiquetas y chips. Se llamaba `label`; renombrado para no chocar con el
   * token semántico de color del mismo nombre. */
  overline: {
    fontFamily: 'Figtree_600SemiBold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypeVariant = keyof typeof type;

/**
 * Cap de Dynamic Type / font scale por rol. Los roles de display viven en
 * layouts rígidos (la card de swipe) y se acotan a 1.3×, que es lo que
 * DESIGN.md se compromete a soportar. El resto puede estirarse más.
 * Nunca usar `allowFontScaling={false}`.
 */
export const maxScaleFor: Record<TypeVariant, number> = {
  nameXl: 1.3,
  title: 1.3,
  heading: 1.6,
  body: 1.6,
  caption: 1.6,
  overline: 1.4,
};

// ---------------------------------------------------------------------------
// Material. Blur translúcido en iOS, color sólido en Android: el blur ahí es
// experimental y caro, y Android es el público mayoritario. El fallback usa
// los valores de marca, no los grises de Apple.
//
// `overflow: 'hidden'` es obligatorio en el contenedor, sin eso el radio no
// recorta el blur.
// ---------------------------------------------------------------------------

export const material = {
  tint: 'systemMaterial' as const,
  intensity: 50,
  androidFallback: {
    light: 'rgba(255,255,255,0.94)',
    dark: 'rgba(44,37,54,0.94)',
  },
} as const;

// ---------------------------------------------------------------------------
// Utilidades de producto. No vienen del sistema portado: son de nombra.me.
// ---------------------------------------------------------------------------

/** Tinte de un color sobre superficie: `withAlpha(colors.partnerA, 0.12)`. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}
