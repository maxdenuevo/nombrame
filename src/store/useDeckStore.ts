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
      // Idempotente: un nombre se desliza una sola vez (igual que la PK
      // `(user_id, name_id)` de `swipes`). Solo vuelve al stack con deshacer.
      swipe: (nameId, liked) =>
        set((s) =>
          s.swiped.some((r) => r.nameId === nameId)
            ? s
            : { swiped: [...s.swiped, { nameId, liked }], canUndo: true },
        ),
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
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // v1 → v2: el bug del callback de salida guardaba cada swipe dos veces.
      // Se conserva el primer registro de cada nombre, en su orden original.
      migrate: (persisted, version) => {
        const state = persisted as { swiped: SwipeRecord[] };
        if (version < 2) {
          const seen = new Set<string>();
          state.swiped = state.swiped.filter((r) => {
            if (seen.has(r.nameId)) return false;
            seen.add(r.nameId);
            return true;
          });
        }
        return state;
      },
      // `canUndo` es efímero: no tiene sentido rehidratar un "deshacer"
      // de una sesión anterior.
      partialize: (s) => ({ swiped: s.swiped }),
    },
  ),
);

export const selectLikedIds = (s: Pick<DeckState, 'swiped'>) =>
  s.swiped.filter((r) => r.liked).map((r) => r.nameId);

export const selectSwipedIds = (s: Pick<DeckState, 'swiped'>) => s.swiped.map((r) => r.nameId);
