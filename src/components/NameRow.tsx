import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import type { Name } from '@/data/types';
import { meshStyle } from '@/design/gradient';
import { PaletteProvider } from '@/design/PaletteContext';
import { swatchFor } from '@/design/swatches';
import { radius, space } from '@/design/tokens';
import { useSwatchScheme } from '@/design/useScheme';

// Fila de lista (favoritos y, más adelante, matches): el nombre en su color,
// el mismo de su card. Así se reconoce de un vistazo.
export function NameRow({ name }: { name: Name }) {
  const { card } = useSwatchScheme(swatchFor(name.id));
  return (
    <View
      style={[
        styles.row,
        meshStyle(card.bg, [
          { color: card.blobs[1], at: '100% 50%', reach: '45%' },
          { color: card.blobs[3], at: '0% 0%', reach: '60%' },
        ]),
      ]}
    >
      <PaletteProvider palette={card}>
        <View style={styles.text}>
          <Text variant="name" numberOfLines={1}>
            {name.name}
          </Text>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {name.meaning}
          </Text>
        </View>
        <Chip label={name.origin} />
      </PaletteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: space['4xl'] + space['3xl'],
    borderRadius: radius.row,
    borderCurve: 'continuous',
    paddingLeft: space.xl,
    paddingRight: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  text: {
    flex: 1,
    gap: space.xs / 2,
  },
});
