import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardFan } from '@/components/CardFan';
import { useTabBarClearance } from '@/components/TabBar';
import { Glass } from '@/components/ui/Glass';
import { MeshBackdrop } from '@/components/ui/MeshBackdrop';
import { Text } from '@/components/ui/Text';
import { PaletteProvider } from '@/design/PaletteContext';
import { SWATCHES } from '@/design/swatches';
import { radius, space } from '@/design/tokens';
import { useScheme } from '@/design/useScheme';
import { t } from '@/i18n';

// Menta: el color del momento match en los mockups. Fijo aquí, no de un nombre.
const MATCH_SWATCH = SWATCHES.find((s) => s.id === 'menta') ?? SWATCHES[0];

// Sin pareja vinculada todavía: la vinculación llega con el backend (Supabase).
// Por ahora la pestaña explica cómo va a funcionar, sin botones que no llevan a nada.
export default function MatchesScreen() {
  const { dark } = useScheme();
  const clearance = useTabBarClearance();
  const scheme = dark ? MATCH_SWATCH.dark : MATCH_SWATCH.light;

  return (
    <View style={styles.screen}>
      <MeshBackdrop mesh={scheme.mesh} />
      <PaletteProvider palette={scheme.card}>
        <SafeAreaView
          edges={['top']}
          style={[styles.screen, styles.center, { paddingBottom: clearance }]}
        >
          <View style={styles.art}>
            <CardFan size="lg" />
          </View>
          <Glass radius={radius.panel} style={styles.panel}>
            <Text variant="title" style={styles.centered} accessibilityRole="header">
              {t('matches.noCouple.title')}
            </Text>
            <Text style={styles.centered}>{t('matches.noCouple.subtitle')}</Text>
            <View style={[styles.soon, { backgroundColor: scheme.card.ink }]}>
              <Text variant="caption" style={{ color: scheme.card.bg }}>
                {t('matches.soon')}
              </Text>
            </View>
          </Glass>
        </SafeAreaView>
      </PaletteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  art: {
    height: space['4xl'] * 5,
    justifyContent: 'center',
  },
  panel: {
    padding: space['2xl'],
    gap: space.md,
    alignItems: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  soon: {
    marginTop: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
});
