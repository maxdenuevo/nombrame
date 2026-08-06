import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { Name } from '@/data/types';
import { continuousCurve, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Fila de lista (favoritos, matches): surface con `radius.row`, nombre en
// heading, metadatos en caption (DESIGN.md §5).
export function NameListRow({ name }: { name: Name }) {
  const { colors, dark } = useTheme();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: dark ? colors.surfaceElevated : colors.surface },
        dark && { borderWidth: 1, borderColor: colors.separator },
      ]}
    >
      <AppText variant="heading">{name.name}</AppText>
      <AppText variant="caption" tone="secondary" style={styles.meta}>
        {`${name.origin} · ${name.meaning}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius.row,
    ...continuousCurve,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  meta: {
    marginTop: spacing.xs,
  },
});
