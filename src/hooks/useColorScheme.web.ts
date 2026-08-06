import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

// En web con render estático el esquema debe resolverse en el cliente;
// useSyncExternalStore entrega 'light' en el server snapshot sin cascadas.
export function useColorScheme() {
  return useSyncExternalStore(
    (onChange) => {
      const sub = Appearance.addChangeListener(onChange);
      return () => sub.remove();
    },
    () => Appearance.getColorScheme(),
    () => 'light' as const,
  );
}
