import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { continuousCurve, minTouchTarget, radius, spacing, withAlpha } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

// Chip presionable con estado seleccionado, para filtros (género). Es un
// componente aparte de `Chip`, cuyo contrato es explícitamente no presionable.
export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      // El chip mide menos que el touch target mínimo: el hitSlop compensa.
      hitSlop={{ top: spacing.md, bottom: spacing.md }}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: withAlpha(colors.tint, 0.1), borderColor: colors.tint }
          : { backgroundColor: colors.fill, borderColor: 'transparent' },
        pressed && styles.pressed,
      ]}
    >
      <AppText variant="overline" tone={selected ? 'tint' : 'secondary'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    ...continuousCurve,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: minTouchTarget - spacing.lg,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
