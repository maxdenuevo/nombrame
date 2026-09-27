import { StyleSheet, View } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { radius, space } from '@/design/tokens';

import { Text } from './Text';

// Barra de progreso con su etiqueta ("12 de 100"). La barra es decorativa: el
// número va como texto y en `accessibilityValue`.
interface ProgressBarProps {
  value: number;
  total: number;
  /** Texto visible junto a la barra ("12 de 100"). */
  label: string;
  /** Lectura completa para lector de pantalla; por defecto, `label`. */
  accessibilityLabel?: string;
}

export function ProgressBar({ value, total, label, accessibilityLabel = label }: ProgressBarProps) {
  const palette = usePalette();
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: total, now: value }}
    >
      <View style={[styles.track, { backgroundColor: palette.fill }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: palette.ink }]} />
      </View>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  track: {
    flex: 1,
    height: space.sm,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
