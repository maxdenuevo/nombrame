import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Si la persona ya vio el onboarding. UI state puro: vive en el dispositivo.
interface OnboardingState {
  done: boolean;
  complete: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      done: false,
      complete: () => set({ done: true }),
    }),
    {
      name: 'onboarding',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
