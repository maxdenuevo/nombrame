// Ancho medio de un carácter de Nunito Black, en em. Conservador: mejor un
// punto más chico que un nombre que no cabe.
const GLYPH_EM = 0.6;

/**
 * Tamaño de fuente para que la palabra más larga de `text` quepa en `width`,
 * entre `min` y `max`. Determinista en toda plataforma: no depende de
 * `adjustsFontSizeToFit`, que no existe en web y en Android mide mal con
 * fuentes propias. Los nombres compuestos pasan a dos líneas; ninguno se trunca.
 */
export function fitFontSize(text: string, width: number, max: number, min: number): number {
  const longest = Math.max(...text.split(/\s+/).map((word) => word.length));
  return Math.max(min, Math.min(max, Math.floor(width / (longest * GLYPH_EM))));
}
