import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { Material } from '@/components/Material';
import type { Name } from '@/data/types';
import { t } from '@/i18n';
import { continuousCurve, elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Piso de auto-shrink: name-xl (44) puede reducirse hasta 32 pt antes de
// permitir wrap a dos líneas. Un nombre nunca se trunca con "…" (DESIGN.md §5).
const MIN_NAME_SCALE = 32 / 44;

/**
 * Componente de referencia del sistema. Estructura concéntrica:
 *
 *   contenedor  radius 40, material, padding 4
 *     interior  radius 36, surface opaca
 *
 * El material del marco difumina la card siguiente, que se asoma detrás con
 * escala 0.96. El interior es opaco para que el nombre no compita con nada.
 */
export function NameCard({ name }: { name: Name }) {
  const { colors, dark } = useTheme();
  return (
    // La sombra va en un contenedor sin `overflow: hidden`, o iOS no la dibuja.
    <View
      style={[
        styles.shadow,
        elevation.floating,
        dark && { borderWidth: 1, borderColor: colors.separator },
      ]}
    >
      <Material radius={radius.cardOuter} style={styles.frame}>
        <View
          style={[
            styles.inner,
            // En oscuro la card se lee "por encima" por el tono, no por la sombra.
            { backgroundColor: dark ? colors.surfaceElevated : colors.surface },
          ]}
        >
          <AppText
            variant="nameXl"
            style={styles.name}
            adjustsFontSizeToFit
            numberOfLines={2}
            minimumFontScale={MIN_NAME_SCALE}
          >
            {name.name}
          </AppText>
          <AppText tone="secondary" style={styles.meaning}>
            {name.meaning}
          </AppText>
          <View style={styles.chips}>
            <Chip label={name.origin} />
            <Chip label={t(`gender.${name.gender}`)} />
          </View>
        </View>
      </Material>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    flex: 1,
    borderRadius: radius.cardOuter,
    ...continuousCurve,
  },
  frame: {
    flex: 1,
    // El interior queda 4 pt adentro: 40 − 4 = 36, curvas concéntricas.
    padding: spacing.xs,
  },
  inner: {
    flex: 1,
    borderRadius: radius.cardInner,
    ...continuousCurve,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
  },
  meaning: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing['2xl'],
  },
});
