export type Gender = 'f' | 'm' | 'x';

/** Filtro de género transversal a todos los decks. No es un deck: es una
 * preferencia de la persona ("busco nombres de niña") que cruza el catálogo. */
export type GenderFilter = 'all' | Gender;

export interface Name {
  id: string;
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
}

/** Deck temático de nombres. La membresía vive aparte (`deckNames`), igual que
 * en Postgres vivirá en la join table `deck_names` — el deck es metadata.
 * `title`/`description` son contenido de catálogo (como `meaning`), no claves
 * i18n: cuando Supabase sea la fuente de verdad llegarán del servidor. */
export interface Deck {
  slug: string;
  title: string;
  description: string;
  /** Fuente del deck cuando es curado desde datos externos
   * (ej. 'Registro Civil de Chile, inscripciones 2024'). */
  attribution?: string;
}
