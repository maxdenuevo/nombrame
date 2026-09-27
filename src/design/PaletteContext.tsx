import { createContext, useContext, type ReactNode } from 'react';

import type { SurfacePalette } from './chrome';
import { useScheme } from './useScheme';

const PaletteContext = createContext<SurfacePalette | null>(null);

/**
 * Declara la paleta de una superficie con color propio (la card de un nombre,
 * el cover de un deck). Textos, chips e íconos adentro toman su tinta de aquí
 * sin recibir colores por props.
 */
export function PaletteProvider({
  palette,
  children,
}: {
  palette: SurfacePalette;
  children: ReactNode;
}) {
  return <PaletteContext.Provider value={palette}>{children}</PaletteContext.Provider>;
}

/** La paleta de la superficie más cercana; fuera de cualquier card, el chrome. */
export function usePalette(): SurfacePalette {
  const surface = useContext(PaletteContext);
  const { chrome } = useScheme();
  return surface ?? chrome;
}
