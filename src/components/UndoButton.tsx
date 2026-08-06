import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Material } from '@/components/Material';
import { t } from '@/i18n';
import { elevation, minTouchTarget, radius, withAlpha } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Solo deshace el último swipe (un nivel). El padre decide cuándo es visible:
// desaparece tras ~5 s de inactividad para no competir con el nombre.
// Flota sobre el deck en movimiento, así que va en material.
export function UndoButton({ onPress }: { onPress: () => void }) {
  const { colors, dark } = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
      {/* La sombra va afuera: `Material` recorta con overflow hidden y iOS no
          dibuja sombra sobre una vista recortada. */}
      <View
        style={[
          styles.shadow,
          elevation.raised,
          dark && { borderWidth: 1, borderColor: colors.separator },
        ]}
      >
        <Material radius={radius.pill}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('deck.undo')}
            onPress={onPress}
            android_ripple={{ color: withAlpha(colors.label, 0.1) }}
            style={({ pressed }) => [styles.button, pressed && styles.pressedIos]}
          >
            <Ionicons name="arrow-undo" size={20} color={colors.labelSecondary} />
          </Pressable>
        </Material>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.pill,
  },
  button: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedIos: {
    opacity: 0.7,
  },
});
