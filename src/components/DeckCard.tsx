import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppText } from '@/components/AppText';
import { continuousCurve, elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface DeckCardProps {
  title: string;
  description: string;
  /** Progreso ya formateado ("3 de 14 vistos"). */
  meta?: string;
  /** Deck activo en el swipe: borde de acento + etiqueta. */
  active?: boolean;
  activeLabel?: string;
  /** Tap en toda la card (activar el deck). */
  onPress?: () => void;
  /** Botón inferior ("Agregar"), para la sección Descubrir. */
  cta?: { label: string; onPress: () => void };
}

// Tarjeta de deck en la biblioteca. Superficie con radio `row` y elevación
// suave; en oscuro la capa se marca con borde `separator` (la sombra no se
// ve). Sin gradiente de match ni colores de género (DESIGN.md).
export function DeckCard({
  title,
  description,
  meta,
  active,
  activeLabel,
  onPress,
  cta,
}: DeckCardProps) {
  const { colors, dark } = useTheme();

  const surface = {
    backgroundColor: dark ? colors.surfaceElevated : colors.surface,
    borderWidth: 1,
    borderColor: active ? colors.tint : dark ? colors.separator : 'transparent',
  };

  const content = (
    <>
      {active && activeLabel ? (
        <AppText variant="overline" tone="tint" style={styles.activeLabel}>
          {activeLabel}
        </AppText>
      ) : null}
      <AppText variant="heading">{title}</AppText>
      <AppText variant="caption" tone="secondary" style={styles.description}>
        {description}
      </AppText>
      {meta ? (
        <AppText variant="caption" tone="tertiary" style={styles.meta}>
          {meta}
        </AppText>
      ) : null}
      {cta ? (
        <View style={styles.cta}>
          <AppButton label={cta.label} onPress={cta.onPress} variant="secondary" />
        </View>
      ) : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.card, surface, !dark && elevation.raised]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        surface,
        !dark && elevation.raised,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.row,
    ...continuousCurve,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  activeLabel: {
    marginBottom: spacing.xs,
  },
  description: {
    marginTop: spacing.xs,
  },
  meta: {
    marginTop: spacing.md,
  },
  cta: {
    marginTop: spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
