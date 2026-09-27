import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Apellidos para ver cada nombre completo ("Leonor Muñoz Soto"). Preferencia
// de visualización de cada persona: vive solo en el dispositivo, nunca en
// Postgres (son datos personales y la app no los necesita en el servidor).
// "Primero" y "segundo", nunca "paterno" y "materno": desde 2021 el orden lo
// eligen los padres, y hay familias de dos mamás, de dos papás o de un solo
// apellido.
interface SurnamesState {
  first: string;
  second: string;
  setFirst: (value: string) => void;
  setSecond: (value: string) => void;
  setSurnames: (first: string, second: string) => void;
  /** Invierte el orden, para probar las dos versiones. */
  swap: () => void;
}

export const useSurnamesStore = create<SurnamesState>()(
  persist(
    (set) => ({
      first: '',
      second: '',
      setFirst: (first) => set({ first }),
      setSecond: (second) => set({ second }),
      setSurnames: (first, second) => set({ first, second }),
      swap: () => set((s) => ({ first: s.second, second: s.first })),
    }),
    {
      name: 'surnames',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Apellidos listos para mostrar, o null si no hay ninguno. Se guardan tal
 * como se escriben (con espacios a medio tipear) y se limpian acá. */
export function formatSurnames(first: string, second: string): string | null {
  const joined = [first, second]
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(' ');
  return joined || null;
}

export function useSurnames(): string | null {
  const first = useSurnamesStore((s) => s.first);
  const second = useSurnamesStore((s) => s.second);
  return formatSurnames(first, second);
}

/** El nombre con los apellidos, o null si la persona no los configuró. */
export function useFullName(name: string): string | null {
  const surnames = useSurnames();
  return surnames ? `${name} ${surnames}` : null;
}
