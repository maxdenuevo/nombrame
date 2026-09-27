import { deckNames } from './decks';
import { names } from './names';
import type { GenderFilter, Name } from './types';

// Funciones puras sobre el catálogo local. Cuando llegue Supabase, la
// membresía y el orden vendrán de `deck_names` vía TanStack Query, pero el
// filtrado por género y el progreso seguirán calculándose igual en cliente.

/** Preset inclusivo: un nombre unisex es válido para cualquier búsqueda.
 * "Niña" = f + x, "Niño" = m + x, "Unisex" = solo x. */
export function matchesGender(name: Name, filter: GenderFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'x') return name.gender === 'x';
  return name.gender === filter || name.gender === 'x';
}

const namesById = new Map(names.map((n) => [n.id, n]));

/** Miembros de un deck en su orden curado, filtrados por género.
 * `deckSlug` null = pseudo-deck "Todos los nombres" (catálogo completo). */
export function getDeckMembers(deckSlug: string | null, filter: GenderFilter): Name[] {
  const members =
    deckSlug === null
      ? names
      : (deckNames[deckSlug] ?? []).map((slug) => namesById.get(slug)).filter((n) => n != null);
  return members.filter((n) => matchesGender(n, filter));
}

/** Stack a swipear: miembros del deck menos lo ya visto. El historial de
 * swipes es global: un nombre visto en un deck no reaparece en otro. */
export function getDeckStack(
  deckSlug: string | null,
  filter: GenderFilter,
  swipedIds: ReadonlySet<string>,
): Name[] {
  return getDeckMembers(deckSlug, filter).filter((n) => !swipedIds.has(n.id));
}

export interface DeckProgress {
  seen: number;
  total: number;
}

/** Progreso "X de Y vistos". El total es sobre el conjunto filtrado por
 * género: es lo que la persona realmente puede ver con su filtro actual. */
export function deckProgress(
  deckSlug: string | null,
  filter: GenderFilter,
  swipedIds: ReadonlySet<string>,
): DeckProgress {
  const members = getDeckMembers(deckSlug, filter);
  const seen = members.filter((n) => swipedIds.has(n.id)).length;
  return { seen, total: members.length };
}
