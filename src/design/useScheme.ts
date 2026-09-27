import { useColorScheme } from '@/hooks/useColorScheme';

import { chrome, type Chrome } from './chrome';
import type { Swatch, SwatchScheme } from './swatches';

export interface Scheme {
  dark: boolean;
  chrome: Chrome;
}

export function useScheme(): Scheme {
  const dark = useColorScheme() === 'dark';
  return { dark, chrome: dark ? chrome.dark : chrome.light };
}

/** La variante de un swatch para el esquema actual. En oscuro, la card es más profunda. */
export function useSwatchScheme(swatch: Swatch): SwatchScheme {
  const { dark } = useScheme();
  return dark ? swatch.dark : swatch.light;
}
