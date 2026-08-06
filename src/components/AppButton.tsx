import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  continuousCurve,
  maxScaleFor,
  minTouchTarget,
  radius,
  spacing,
  withAlpha,
  type as typeTokens,
} from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

export function AppButton({ label, onPress, variant = 'primary', disabled }: AppButtonProps) {
  const { colors } = useTheme();

  const container = {
    // `tintSolid`, no `partnerA`: coral 500 con texto encima no llega al
    // contraste mínimo. La capa semántica ya resuelve el par relleno/texto.
    primary: { backgroundColor: colors.tintSolid },
    secondary: { borderWidth: 1, borderColor: colors.separator },
    ghost: {},
  }[variant];

  const textColor = variant === 'primary' ? colors.onTintSolid : colors.label;

  return (
    <View style={[styles.clip, disabled && styles.disabled]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        android_ripple={{ color: withAlpha(textColor, 0.15) }}
        style={({ pressed }) => [styles.base, container, pressed && styles.pressedIos]}
      >
        <Text
          maxFontSizeMultiplier={maxScaleFor.body}
          style={[typeTokens.body, styles.label, { color: textColor }]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // El ripple de Android necesita un contenedor con overflow hidden para
  // respetar el radio.
  clip: {
    borderRadius: radius.control,
    ...continuousCurve,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  base: {
    minHeight: minTouchTarget,
    borderRadius: radius.control,
    ...continuousCurve,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Figtree_600SemiBold',
  },
  pressedIos: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
