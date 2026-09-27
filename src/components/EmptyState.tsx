import { StyleSheet, View } from 'react-native';

import { CardFan } from '@/components/CardFan';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { space } from '@/design/tokens';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  onPress: () => void;
}

// Estados vacíos: un abanico de nombres reales, el mensaje y siempre una acción.
// Es un fin natural o un comienzo, nunca un error.
export function EmptyState({ title, subtitle, ctaLabel, onPress }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.art}>
        <CardFan />
      </View>
      <Text variant="title" style={styles.center}>
        {title}
      </Text>
      {subtitle ? (
        <Text tone="muted" style={[styles.center, styles.subtitle]}>
          {subtitle}
        </Text>
      ) : null}
      <View style={styles.cta}>
        <Button label={ctaLabel} onPress={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  art: {
    height: space['4xl'] * 3,
    justifyContent: 'center',
    marginBottom: space['3xl'],
  },
  center: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: space.md,
  },
  cta: {
    marginTop: space['3xl'],
  },
});
