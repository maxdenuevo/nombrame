import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { continuousCurve, radius, spacing, withAlpha } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface ChipProps {
  label: string;
  /** Color base del tinte (10%). Por defecto el `fill` neutro: los chips de
   * género no llevan colores estereotipados (ver DESIGN.md). */
  tint?: string;
}

export function Chip({ label, tint }: ChipProps) {
  const { colors } = useTheme();
  const background = tint ? withAlpha(tint, 0.1) : colors.fill;
  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      <AppText variant="overline" tone="secondary">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    ...continuousCurve,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});
