import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  onPress: () => void;
}

// Estados vacíos: solo tipografía, siempre con una acción (ver DESIGN.md §5).
export function EmptyState({ title, subtitle, ctaLabel, onPress }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="title" style={styles.center}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText tone="secondary" style={[styles.center, styles.subtitle]}>
          {subtitle}
        </AppText>
      ) : null}
      <View style={styles.cta}>
        <AppButton label={ctaLabel} onPress={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  center: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.lg,
  },
  cta: {
    marginTop: spacing['3xl'],
    alignItems: 'center',
  },
});
