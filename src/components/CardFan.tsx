import { StyleSheet, View } from 'react-native';

import { MiniCard } from '@/components/MiniCard';
import { names } from '@/data/names';
import type { Name } from '@/data/types';
import { space } from '@/design/tokens';

// Tres nombres reales del catálogo, cada uno en su color: la ilustración de la
// app es su propio contenido, no dibujos. Uno de niño, uno de niña y uno
// unisex: lo primero que se ve ya dice que hay nombres para todos.
const FAN_IDS = ['mateo', 'emilia', 'ariel'] as const;
const fan = FAN_IDS.map((id) => names.find((n) => n.id === id)).filter((n): n is Name => n != null);

/** Abanico de mini cards: la de al medio adelante, las otras inclinadas detrás. */
export function CardFan({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const [left, center, right] = fan;
  const spread = size === 'lg' ? space['4xl'] * 2 : space['4xl'] + space.lg;
  return (
    <View
      style={styles.fan}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {left ? (
        <View style={[styles.slot, { transform: [{ translateX: -spread }, { rotate: '-11deg' }] }]}>
          <MiniCard name={left} size={size} />
        </View>
      ) : null}
      {right ? (
        <View style={[styles.slot, { transform: [{ translateX: spread }, { rotate: '10deg' }] }]}>
          <MiniCard name={right} size={size} />
        </View>
      ) : null}
      {center ? (
        <View style={[styles.slot, { transform: [{ translateY: space.lg }, { rotate: '-2deg' }] }]}>
          <MiniCard name={center} size={size} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fan: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    position: 'absolute',
  },
});
