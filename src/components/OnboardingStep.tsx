import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MeshBackdrop } from '@/components/ui/MeshBackdrop';
import { Squish } from '@/components/ui/Squish';
import { Text } from '@/components/ui/Text';
import { PaletteProvider } from '@/design/PaletteContext';
import { SWATCHES, type SwatchId } from '@/design/swatches';
import { radius, space, touchTarget } from '@/design/tokens';
import { useScheme } from '@/design/useScheme';
import { t } from '@/i18n';

const TOTAL_STEPS = 3;

interface OnboardingStepProps {
  step: number;
  /** Cada paso tiene su familia de color, como Folium. */
  swatch: SwatchId;
  title: string;
  body: string;
  hero: ReactNode;
  /** Botón(es) al pie. */
  actions: ReactNode;
  onSkip: () => void;
}

/**
 * Un paso del onboarding, con la estructura de Folium: malla de color viva,
 * una capa esmerilada encima, ilustración grande, título bold centrado, una
 * línea de texto y la acción al pie.
 */
export function OnboardingStep({
  step,
  swatch,
  title,
  body,
  hero,
  actions,
  onSkip,
}: OnboardingStepProps) {
  const { dark, chrome } = useScheme();
  const family = SWATCHES.find((s) => s.id === swatch) ?? SWATCHES[0];
  const scheme = dark ? family.dark : family.light;

  // Esmerilado sobre la malla: el mismo relleno que el vidrio. En web suma
  // blur; en nativo la malla ya es suave y el relleno basta. El texto pasa AA
  // sobre este relleno encima de cualquier color de la malla (check-design).
  const frost: ViewStyle =
    Platform.OS === 'web'
      ? ({
          backgroundColor: chrome.glass.fill,
          backdropFilter: 'blur(30px) saturate(1.5)',
        } as ViewStyle)
      : { backgroundColor: chrome.glass.fill };

  return (
    <View style={styles.screen}>
      <MeshBackdrop mesh={scheme.mesh} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, frost]} />
      <PaletteProvider palette={scheme.card}>
        <SafeAreaView style={styles.content}>
          <View style={styles.top}>
            <View
              style={styles.dots}
              accessible
              accessibilityLabel={t('onboarding.step', { step, total: TOTAL_STEPS })}
            >
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: scheme.card.ink },
                    i + 1 === step ? styles.dotActive : styles.dotIdle,
                  ]}
                />
              ))}
            </View>
            <Squish onPress={onSkip} accessibilityLabel={t('onboarding.skip')} style={styles.skip}>
              <Text variant="label">{t('onboarding.skip')}</Text>
            </Squish>
          </View>

          <View style={styles.hero}>{hero}</View>

          <Text variant="title" accessibilityRole="header" style={styles.centered}>
            {title}
          </Text>
          <Text style={[styles.centered, styles.body]}>{body}</Text>

          <View style={styles.spacer} />
          <View style={styles.actions}>{actions}</View>
        </SafeAreaView>
      </PaletteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: space['2xl'],
    paddingBottom: space.lg,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: space.xs + space.xs / 2,
  },
  dot: {
    height: space.sm,
    borderRadius: radius.pill,
  },
  dotActive: {
    width: space['2xl'],
  },
  dotIdle: {
    width: space.sm,
    opacity: 0.3,
  },
  skip: {
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingHorizontal: space.xs,
  },
  hero: {
    height: space['4xl'] * 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  body: {
    marginTop: space.md,
    paddingHorizontal: space.sm,
  },
  spacer: {
    flex: 1,
  },
  actions: {
    gap: space.md,
  },
});
