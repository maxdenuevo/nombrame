import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Squish } from '@/components/ui/Squish';
import { Text } from '@/components/ui/Text';
import { meshStyle } from '@/design/gradient';
import { PaletteProvider } from '@/design/PaletteContext';
import type { Swatch } from '@/design/swatches';
import { radius, shadow, space } from '@/design/tokens';
import { useSwatchScheme } from '@/design/useScheme';
import { t } from '@/i18n';

interface DeckCoverProps {
  title: string;
  /** "100 nombres" o "12 de 100 vistos". */
  meta: string;
  swatch: Swatch;
  active: boolean;
  /** Ancho completo (el pseudo-deck "Todos los nombres"). */
  wide?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
}

// Cover de deck en la biblioteca: el deck tiene su propio color, igual que un
// nombre, y lo repite en la pill del header del deck. Tocarlo lo activa.
export function DeckCover({
  title,
  meta,
  swatch,
  active,
  wide,
  accessibilityLabel,
  onPress,
}: DeckCoverProps) {
  const scheme = useSwatchScheme(swatch);
  const { card } = scheme;
  return (
    // El envoltorio reparte el ancho de la fila: el presionable no estira solo.
    <View style={wide ? undefined : styles.tile}>
      <Squish
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected: active }}
      >
        <View
          style={[
            styles.cover,
            wide ? styles.wide : styles.square,
            { boxShadow: shadow.soft(scheme.shadow) },
            meshStyle(card.bg, [
              { color: card.blobs[1], at: '100% 0%', reach: '65%' },
              { color: card.blobs[3], at: '0% 100%', reach: '60%' },
            ]),
          ]}
        >
          <PaletteProvider palette={card}>
            {active ? (
              // "Activo" con ícono y texto: el estado no se comunica solo con color.
              <View style={[styles.badge, { backgroundColor: card.ink }]}>
                <Ionicons name="checkmark" size={14} color={card.bg} />
                <Text variant="caption" style={{ color: card.bg }}>
                  {t('library.active')}
                </Text>
              </View>
            ) : null}
            <View style={styles.spacer} />
            <Text variant="name" numberOfLines={2}>
              {title}
            </Text>
            <Text variant="caption" tone="muted">
              {meta}
            </Text>
          </PaletteProvider>
        </View>
      </Squish>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
  },
  cover: {
    borderRadius: radius.cover,
    borderCurve: 'continuous',
    padding: space.lg,
    gap: space.xs,
  },
  square: {
    height: space['4xl'] * 3,
  },
  wide: {
    minHeight: space['4xl'] * 2,
    paddingHorizontal: space.xl,
  },
  spacer: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingLeft: space.sm,
    paddingRight: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
  },
});
