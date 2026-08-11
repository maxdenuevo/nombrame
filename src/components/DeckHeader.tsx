import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { minTouchTarget, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface DeckHeaderProps {
  /** Nombre del deck activo ("Top 100 Chile" o "Todos los nombres"). */
  title: string;
  /** Etiqueta pequeña sobre el título ("Deck activo"). */
  overline: string;
  /** Progreso ya formateado ("12 de 100 vistos"). */
  progress: string;
  /** Filtro de género activo, o null con filtro "Todos" (sin chip: es el
   * estado por defecto y no necesita anunciarse). */
  filterLabel: string | null;
  onPress: () => void;
}

// Cabecera del deck en la pantalla de swipe. Todo el header es presionable y
// lleva a la biblioteca. UI silenciosa: el nombre de la card sigue siendo el
// héroe — esto es chrome, tonos secundarios y tamaños contenidos (DESIGN §1).
export function DeckHeader({ title, overline, progress, filterLabel, onPress }: DeckHeaderProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${overline}: ${title}. ${progress}`}
      onPress={onPress}
      style={({ pressed }) => [styles.header, pressed && styles.pressed]}
    >
      <View style={styles.info}>
        <AppText variant="overline" tone="tertiary">
          {overline}
        </AppText>
        <View style={styles.titleRow}>
          <AppText variant="heading" numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
          <Ionicons name="chevron-down" size={16} color={colors.labelSecondary} />
        </View>
        <AppText variant="caption" tone="secondary">
          {progress}
        </AppText>
      </View>
      {filterLabel ? <Chip label={filterLabel} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
