import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { GenderFilter } from '@/data/types';

// Biblioteca de decks y preferencias de navegación del catálogo. Esto es UI
// state puro: nunca migra a server state (a diferencia de los swipes). Los
// decks "agregados" tampoco van a Postgres — si algún día se sincronizan,
// será una tabla `user_decks` aparte.
interface LibraryState {
  /** Deck activo en la pantalla de swipe. null = "Todos los nombres". */
  activeDeckSlug: string | null;
  /** Filtro de género transversal a todos los decks. */
  genderFilter: GenderFilter;
  /** Decks que la persona "agregó" a su biblioteca, en orden de agregado. */
  addedDeckSlugs: string[];
  setActiveDeck: (slug: string | null) => void;
  setGenderFilter: (filter: GenderFilter) => void;
  addDeck: (slug: string) => void;
  removeDeck: (slug: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      activeDeckSlug: null,
      genderFilter: 'all',
      addedDeckSlugs: [],
      setActiveDeck: (slug) => set({ activeDeckSlug: slug }),
      setGenderFilter: (filter) => set({ genderFilter: filter }),
      addDeck: (slug) =>
        set((s) =>
          s.addedDeckSlugs.includes(slug) ? s : { addedDeckSlugs: [...s.addedDeckSlugs, slug] },
        ),
      removeDeck: (slug) =>
        set((s) => ({
          addedDeckSlugs: s.addedDeckSlugs.filter((d) => d !== slug),
          // Quitar el deck activo de la biblioteca vuelve a "Todos los nombres".
          activeDeckSlug: s.activeDeckSlug === slug ? null : s.activeDeckSlug,
        })),
    }),
    {
      name: 'library',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
