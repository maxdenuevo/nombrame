import type { ReactNode } from 'react';
import {
  Pressable,
  type AccessibilityRole,
  type AccessibilityState,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion } from '@/design/tokens';

interface SquishProps {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  hitSlop?: Insets | number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * Presionable que se aplasta y rebota. Es el feedback táctil de toda la app,
 * igual en iOS y Android: la sensación de goma es parte de la marca.
 */
export function Squish({
  onPress,
  disabled,
  accessibilityRole = 'button',
  accessibilityState,
  style,
  children,
  ...a11y
}: SquishProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => scale.set(withSpring(motion.pressScale, motion.snappy))}
      onPressOut={() => scale.set(withSpring(1, motion.bouncy))}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled, ...accessibilityState }}
      {...a11y}
    >
      <Animated.View style={[style, animated, disabled && { opacity: 0.4 }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
