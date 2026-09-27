import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { Name } from '@/data/types';
import { fitFontSize } from '@/design/fitText';
import { cardBlobPositions, meshStyle } from '@/design/gradient';
import { PaletteProvider } from '@/design/PaletteContext';
import { swatchFor } from '@/design/swatches';
import { radius, shadow, space, type } from '@/design/tokens';
import { useSwatchScheme } from '@/design/useScheme';

// Proporción de la card de swipe, en chico: ilustra estados vacíos y el onboarding.
const WIDTH = { sm: 88, lg: 150 } as const;
const ASPECT = 1.36;

export function MiniCard({ name, size = 'sm' }: { name: Name; size?: keyof typeof WIDTH }) {
  const scheme = useSwatchScheme(swatchFor(name.id));
  const { card } = scheme;
  const width = WIDTH[size];
  const variant = size === 'lg' ? 'title' : 'heading';
  const max = type[variant].fontSize;
  const fontSize = fitFontSize(name.name, width - 2 * space.sm, max, type.caption.fontSize);
  return (
    <View
      style={[
        styles.card,
        { width, height: width * ASPECT, boxShadow: shadow.soft(scheme.shadow) },
        meshStyle(
          card.bg,
          card.blobs.map((color, i) => ({ color, at: cardBlobPositions[i], reach: '55%' })),
        ),
      ]}
    >
      <PaletteProvider palette={card}>
        <Text
          variant={variant}
          numberOfLines={2}
          style={{ fontSize, lineHeight: Math.round(fontSize * 1.15), textAlign: 'center' }}
        >
          {name.name}
        </Text>
      </PaletteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.row,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
});
