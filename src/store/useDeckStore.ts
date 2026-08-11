import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SwipeRecord {
  nameId: string;
  liked: boolean;
}

interface DeckState {
  /** Historial de swipes en orden, persistido en AsyncStorage. La fuente de
   * verdad definitiva será Postgres (tabla `swipes`) vía TanStack Query; este
   * array persistido es la cola inicial del sync offline-first. Ojo: aquí
   * `nameId` es el slug local — al conectar Supabase hay que mapear
   * slug → uuid al subir la cola. */
  swiped: SwipeRecord[];
  /** Deshacer es de un solo nivel: solo el último swipe, y solo si no se ha
   * deslizado otra card después de deshacer (ver DESIGN.md). */
  canUndo: boolean;
  swipe: (nameId: string, liked: boolean) => void;
  undo: () => SwipeRecord | undefined;
  hideUndo: () => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      swiped: [],
      canUndo: false,
      swipe: (nameId, liked) =>
        set((s) => ({ swiped: [...s.swiped, { nameId, liked }], canUndo: true })),
      undo: () => {
        const { swiped, canUndo } = get();
        if (!canUndo || swiped.length === 0) return undefined;
        const last = swiped[swiped.length - 1];
        set({ swiped: swiped.slice(0, -1), canUndo: false });
        return last;
      },
      hideUndo: () => set({ canUndo: false }),
    }),
    {
      name: 'deck',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // `canUndo` es efímero: no tiene sentido rehidratar un "deshacer"
      // de una sesión anterior.
      partialize: (s) => ({ swiped: s.swiped }),
    },
  ),
);

export const selectLikedIds = (s: Pick<DeckState, 'swiped'>) =>
  s.swiped.filter((r) => r.liked).map((r) => r.nameId);

export const selectSwipedIds = (s: Pick<DeckState, 'swiped'>) => s.swiped.map((r) => r.nameId);
