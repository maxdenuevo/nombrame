import { create } from 'zustand';

export interface SwipeRecord {
  nameId: string;
  liked: boolean;
}

interface DeckState {
  /** Historial de swipes en orden. Por ahora solo en memoria: la fuente de
   * verdad definitiva será Postgres (tabla `swipes`) vía TanStack Query. */
  swiped: SwipeRecord[];
  /** Deshacer es de un solo nivel: solo el último swipe, y solo si no se ha
   * deslizado otra card después de deshacer (ver DESIGN.md). */
  canUndo: boolean;
  swipe: (nameId: string, liked: boolean) => void;
  undo: () => SwipeRecord | undefined;
  hideUndo: () => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
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
}));

export const selectLikedIds = (s: Pick<DeckState, 'swiped'>) =>
  s.swiped.filter((r) => r.liked).map((r) => r.nameId);

export const selectSwipedIds = (s: Pick<DeckState, 'swiped'>) => s.swiped.map((r) => r.nameId);
