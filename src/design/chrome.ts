/**
 * Chrome: la paleta neutra de la app, lo que no es de ningún nombre (fondos de
 * pantalla sin card activa, títulos, tab bar, biblioteca). El color vive en los
 * swatches; el chrome se queda callado para que los nombres se luzcan.
 *
 * Sin imports: scripts/check-design.mjs lo carga directo con Node.
 */

/** Lo mínimo que necesita un texto o un ícono para saber de qué color pintarse. */
export interface SurfacePalette {
  bg: string;
  ink: string;
  inkMuted: string;
  fill: string;
}

export interface Glass {
  /** Relleno del vidrio cuando hay blur (iOS 26, web). */
  fill: string;
  /** Relleno sin blur (Android, iOS < 26, reducir transparencia): más opaco. */
  fallback: string;
  border: string;
}

export interface Chrome extends SurfacePalette {
  line: string;
  /** Fondo lavado de pantallas sin card activa: tres blobs suaves de colores de la paleta. */
  wash: { base: string; blobs: readonly [string, string, string] };
  glass: Glass;
}

/** Alfa con que se pintan los blobs de un wash sobre su base. */
export const WASH_ALPHA = 0.6;

export const chrome: Record<'light' | 'dark', Chrome> = {
  light: {
    bg: '#F6F4FA',
    ink: '#231F2B',
    inkMuted: '#5E5670',
    fill: 'rgba(35,31,43,0.08)',
    line: 'rgba(35,31,43,0.12)',
    wash: { base: '#F6F4FA', blobs: ['#F1CBFE', '#B7E1FE', '#F5D69E'] },
    glass: {
      fill: 'rgba(255,255,255,0.5)',
      fallback: 'rgba(255,255,255,0.72)',
      border: 'rgba(255,255,255,0.85)',
    },
  },
  dark: {
    bg: '#131118',
    ink: '#F4F1F8',
    inkMuted: '#ABA3B8',
    fill: 'rgba(244,241,248,0.10)',
    line: 'rgba(244,241,248,0.14)',
    wash: { base: '#131118', blobs: ['#4A2156', '#003A57', '#473100'] },
    glass: {
      fill: 'rgba(255,255,255,0.10)',
      fallback: 'rgba(255,255,255,0.14)',
      border: 'rgba(255,255,255,0.20)',
    },
  },
};
