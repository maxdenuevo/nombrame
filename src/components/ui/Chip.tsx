import { StyleSheet, View } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { radius, space } from '@/design/tokens';
import { useScheme } from '@/design/useScheme';

import { Text } from './Text';

// Etiqueta no presionable (origen, género). En claro es un vidrio blanco sobre
// el color; en oscuro, el `fill` opaco de la superficie, que ya pasa AA.
export function Chip({ label }: { label: string }) {
  const { dark, chrome } = useScheme();
  const palette = usePalette();
  const look = dark
    ? { backgroundColor: palette.fill, borderColor: palette.fill }
    : { backgroundColor: chrome.glass.fill, borderColor: chrome.glass.border };

  return (
    <View style={[styles.chip, look]}>
      <Text variant="overline">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: space.md,
    paddingVertical: space.xs * 1.5,
  },
});
