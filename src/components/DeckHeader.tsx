import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Glass } from '@/components/ui/Glass';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Squish } from '@/components/ui/Squish';
import { Text } from '@/components/ui/Text';
import { meshStyle } from '@/design/gradient';
import { usePalette } from '@/design/PaletteContext';
import type { Swatch } from '@/design/swatches';
import { radius, space, touchTarget } from '@/design/tokens';
import { t } from '@/i18n';

interface DeckHeaderProps {
  deckTitle: string;
  /** Color del deck: el punto de la pill lo identifica igual que su cover en la biblioteca. */
  deckSwatch: Swatch;
  filterLabel: string;
  seen: number;
  total: number;
  /** Ambas pills abren la biblioteca, donde se cambia deck y filtro. */
  onPress: () => void;
}

export function DeckHeader({
  deckTitle,
  deckSwatch,
  filterLabel,
  seen,
  total,
  onPress,
}: DeckHeaderProps) {
  const palette = usePalette();
  const dot = deckSwatch.light;
  return (
    <View style={styles.header}>
      <View style={styles.pills}>
        <Squish
          onPress={onPress}
          accessibilityLabel={t('deck.changeDeck', { deck: deckTitle })}
          style={styles.shrink}
        >
          <Glass radius={radius.pill} style={[styles.pill, styles.deckPill]}>
            <View
              style={[
                styles.dot,
                meshStyle(dot.card.bg, [{ color: dot.mesh.blobs[1], at: '30% 30%', reach: '90%' }]),
              ]}
            />
            <Text variant="label" numberOfLines={1} style={styles.shrink}>
              {deckTitle}
            </Text>
            <Ionicons name="chevron-down" size={16} color={palette.ink} />
          </Glass>
        </Squish>
        <Squish
          onPress={onPress}
          accessibilityLabel={t('deck.changeFilter', { filter: filterLabel })}
        >
          <Glass radius={radius.pill} style={styles.pill}>
            <Text variant="caption">{filterLabel}</Text>
          </Glass>
        </Squish>
      </View>
      <ProgressBar
        value={seen}
        total={total}
        label={t('deck.progress', { seen, total })}
        accessibilityLabel={t('deck.progressA11y', { seen, total })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    gap: space.md,
  },
  pills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  shrink: {
    flexShrink: 1,
  },
  pill: {
    minHeight: touchTarget - space.xs,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  deckPill: {
    paddingLeft: space.sm,
  },
  dot: {
    width: space['3xl'] - space.xs,
    height: space['3xl'] - space.xs,
    borderRadius: radius.pill,
  },
});
