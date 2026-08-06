import { useColorScheme } from '@/hooks/useColorScheme';
import { schemes, type Colors } from './theme';

export interface Theme {
  colors: Colors;
  /** Los componentes lo necesitan para el patrón de borde en oscuro, donde la
   * sombra de Android casi no se ve. */
  dark: boolean;
}

export function useTheme(): Theme {
  const dark = useColorScheme() === 'dark';
  return { colors: dark ? schemes.dark : schemes.light, dark };
}
