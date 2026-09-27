import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { blob, gradientStyle } from '@/design/gradient';
import type { Mesh } from '@/design/swatches';
import { motion } from '@/design/tokens';

// Centros de los cuatro blobs, relativos a la pantalla. Uno por esquina, como
// la malla de 3×3 de Folium, para que el color llegue a todos los bordes.
const ANCHORS = [
  { x: 0.15, y: 0.12 },
  { x: 0.9, y: 0.26 },
  { x: 0.75, y: 0.9 },
  { x: 0.08, y: 0.78 },
] as const;

/**
 * Malla de color viva para los momentos especiales (onboarding, match): un
 * color base y cuatro blobs de `radial-gradient` que derivan lento, cada uno
 * con su período para que nunca se sincronicen. Solo anima transform, en el
 * hilo de UI. Se detiene fuera de foco y con "reducir movimiento".
 */
export function MeshBackdrop({ mesh }: { mesh: Mesh }) {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const focused = useIsFocused();
  const size = Math.max(width, height) * 0.95;

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.clip, { backgroundColor: mesh.base }]}
    >
      {mesh.blobs.map((color, i) => (
        <Blob
          key={i}
          color={color}
          left={ANCHORS[i].x * width - size / 2}
          top={ANCHORS[i].y * height - size / 2}
          size={size}
          period={motion.drift[i]}
          direction={i % 2 === 0 ? 1 : -1}
          amplitude={width * 0.1}
          animate={focused && !reduced}
        />
      ))}
    </View>
  );
}

interface BlobProps {
  color: string;
  left: number;
  top: number;
  size: number;
  period: number;
  direction: 1 | -1;
  amplitude: number;
  animate: boolean;
}

function Blob({ color, left, top, size, period, direction, amplitude, animate }: BlobProps) {
  const t = useSharedValue(0.5);

  useEffect(() => {
    if (!animate) return;
    t.set(
      withRepeat(withTiming(1, { duration: period, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => cancelAnimation(t);
  }, [animate, period, t]);

  const drift = useAnimatedStyle(() => {
    const p = t.get() - 0.5;
    return {
      transform: [
        { translateX: p * 2 * amplitude * direction },
        { translateY: -p * amplitude },
        { scale: 1 + p * 0.16 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        { position: 'absolute', left, top, width: size, height: size },
        gradientStyle(blob(color, '50% 50%', '50%')),
        drift,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
