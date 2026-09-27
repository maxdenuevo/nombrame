import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MiniCard } from '@/components/MiniCard';
import { Glass } from '@/components/ui/Glass';
import { names } from '@/data/names';
import { usePalette } from '@/design/PaletteContext';
import { radius, space } from '@/design/tokens';

const DEMO = names.find((n) => n.id === 'emilia') ?? names[0];
const SWAY_MS = 1600;

/** Card de muestra que se balancea entre "paso" y "me gusta", para enseñar el gesto. */
export function SwipeDemo() {
  const palette = usePalette();
  const reduced = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    t.set(
      withRepeat(withTiming(1, { duration: SWAY_MS, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => cancelAnimation(t);
  }, [reduced, t]);

  const sway = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(t.get(), [0, 1], [-space['3xl'], space['3xl']]) },
      { rotate: `${interpolate(t.get(), [0, 1], [-8, 8])}deg` },
    ],
  }));

  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Glass radius={radius.pill} style={styles.hint}>
        <Ionicons name="close" size={24} color={palette.ink} />
      </Glass>
      <Animated.View style={sway}>
        <MiniCard name={DEMO} size="lg" />
      </Animated.View>
      <View style={[styles.hint, { backgroundColor: palette.ink }]}>
        <Ionicons name="heart" size={24} color={palette.bg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xl,
  },
  hint: {
    width: space['4xl'],
    height: space['4xl'],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
