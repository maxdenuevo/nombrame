import { Platform, type ViewStyle } from 'react-native';

import { withAlpha } from './tokens';

/**
 * Gradientes CSS en una vista. RN 0.86 los dibuja nativo con
 * `experimental_backgroundImage` (New Architecture); react-native-web usa
 * `backgroundImage`, que no está en los tipos de RN.
 */
export function gradientStyle(css: string): ViewStyle {
  if (Platform.OS === 'web') {
    // Cast: `backgroundImage` existe en react-native-web pero no en ViewStyle.
    return { backgroundImage: css } as ViewStyle;
  }
  return { experimental_backgroundImage: css };
}

/**
 * Un blob de malla: círculo de color que se funde a transparente. Funde al
 * mismo color con alfa 0 y no a `transparent`, que deja bordes grises en nativo.
 */
export function blob(color: string, at: string, reach = '60%'): string {
  return `radial-gradient(circle at ${at}, ${color} 0%, ${withAlpha(color, 0)} ${reach})`;
}

/** Varios blobs sobre un color base, en una sola capa estática. */
export function meshStyle(
  base: string,
  blobs: readonly { color: string; at: string; reach?: string }[],
): ViewStyle {
  return {
    backgroundColor: base,
    ...gradientStyle(blobs.map((b) => blob(b.color, b.at, b.reach)).join(', ')),
  };
}

/** Posiciones de los cuatro blobs de una card: esquinas, para dejar el centro limpio para el texto. */
export const cardBlobPositions = ['0% 0%', '100% 0%', '100% 100%', '0% 100%'] as const;
