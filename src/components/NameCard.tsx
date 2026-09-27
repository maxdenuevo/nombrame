import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Glass } from '@/components/ui/Glass';
import { Text } from '@/components/ui/Text';
import type { Name } from '@/data/types';
import { fitFontSize } from '@/design/fitText';
import { cardBlobPositions, meshStyle } from '@/design/gradient';
import { PaletteProvider } from '@/design/PaletteContext';
import { swatchFor } from '@/design/swatches';
import { nameXlMin, radius, shadow, space, type } from '@/design/tokens';
import { useSwatchScheme } from '@/design/useScheme';
import { t } from '@/i18n';
import { useFullName } from '@/store/useSurnamesStore';

/**
 * La card de swipe: el nombre sobre la malla de su color. Todo lo de adentro
 * (chips, textos, vidrio) toma su tinta del swatch vía `PaletteProvider`.
 * Si la persona configuró apellidos, debajo va el nombre completo: lo que se
 * evalúa es cómo suena todo junto.
 */
export function NameCard({ name }: { name: Name }) {
  const fullName = useFullName(name.name);
  const scheme = useSwatchScheme(swatchFor(name.id));
  const { card } = scheme;
  const { width } = useWindowDimensions();
  // Un nombre compuesto ya ocupa dos líneas; con el nombre completo debajo, en
  // un teléfono chico se montaría sobre el significado. Ahí va al piso.
  const compound = /\s/.test(name.name.trim());
  const size = fitFontSize(
    name.name,
    width - 2 * space.xl - 2 * space['2xl'],
    fullName && compound ? nameXlMin : type.nameXl.fontSize,
    nameXlMin,
  );

  return (
    <View
      style={[
        styles.card,
        { boxShadow: shadow.card(scheme.shadow) },
        meshStyle(
          card.bg,
          card.blobs.map((color, i) => ({ color, at: cardBlobPositions[i], reach: '50%' })),
        ),
      ]}
    >
      <PaletteProvider palette={card}>
        <View style={styles.chips}>
          <Chip label={name.origin} />
          <Chip label={t(`gender.${name.gender}`)} />
        </View>
        <View style={styles.center}>
          <Text
            variant="nameXl"
            numberOfLines={2}
            // Red de seguridad para font scale alto: el tamaño ya viene ajustado.
            adjustsFontSizeToFit
            minimumFontScale={nameXlMin / size}
            style={[styles.centered, { fontSize: size, lineHeight: Math.round(size * 1.08) }]}
          >
            {name.name}
          </Text>
          {fullName ? (
            // Sin numberOfLines: un nombre completo largo pasa a otra línea, nunca se trunca.
            <Text variant="heading" tone="muted" style={[styles.centered, styles.fullName]}>
              {fullName}
            </Text>
          ) : null}
        </View>
        <Glass radius={radius.row} style={styles.meaning}>
          <Text style={styles.centered}>{name.meaning}</Text>
        </Glass>
      </PaletteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    padding: space['2xl'],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  fullName: {
    marginTop: space.sm,
  },
  meaning: {
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
});
