import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { WASH_ALPHA } from '@/design/chrome';
import { meshStyle } from '@/design/gradient';
import { withAlpha } from '@/design/tokens';

const POSITIONS = ['8% 0%', '100% 35%', '40% 100%'] as const;

interface WashProps {
  wash: { base: string; blobs: readonly [string, string, string] };
  /** Cambia cuando cambia el color: dispara el fundido entre el lavado viejo y el nuevo. */
  id: string;
}

/**
 * Fondo de pantalla lavado con un color: base clara y tres blobs suaves. En el
 * deck sigue el color de la card activa y se funde al cambiar de nombre.
 */
export function Wash({ wash, id }: WashProps) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: wash.base }]}>
      <Animated.View
        key={id}
        entering={FadeIn.duration(360)}
        exiting={FadeOut.duration(360)}
        style={[
          StyleSheet.absoluteFill,
          meshStyle(
            wash.base,
            wash.blobs.map((c, i) => ({
              color: withAlpha(c, WASH_ALPHA),
              at: POSITIONS[i],
              reach: '55%',
            })),
          ),
        ]}
      />
    </View>
  );
}
