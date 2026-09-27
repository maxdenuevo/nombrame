import { useSyncExternalStore } from 'react';

import { useDeckStore } from './useDeckStore';
import { useLibraryStore } from './useLibraryStore';
import { useOnboardingStore } from './useOnboardingStore';
import { useSurnamesStore } from './useSurnamesStore';

// Los stores persistidos leen AsyncStorage de forma asíncrona. Hasta que
// terminan, `done` vale su default (false) y el gate mostraría el onboarding
// un instante en cada arranque. El layout raíz espera esto antes de ocultar
// el splash.
const stores = [useOnboardingStore, useLibraryStore, useDeckStore, useSurnamesStore];

function subscribe(onChange: () => void) {
  const unsubscribes = stores.map((s) => s.persist.onFinishHydration(onChange));
  return () => unsubscribes.forEach((u) => u());
}

const allHydrated = () => stores.every((s) => s.persist.hasHydrated());

export function useStoresHydrated(): boolean {
  // En el render estático de web no hay storage: se considera no hidratado.
  return useSyncExternalStore(subscribe, allHydrated, () => false);
}
