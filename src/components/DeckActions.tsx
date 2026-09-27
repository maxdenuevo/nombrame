import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { IconButton } from '@/components/ui/IconButton';
import { motion, space } from '@/design/tokens';
import { t } from '@/i18n';

interface DeckActionsProps {
  /** Cambia con cada card nueva: los botones hacen "pop" para acompañarla. */
  cardId: string;
  canUndo: boolean;
  onPass: () => void;
  onUndo: () => void;
  onLike: () => void;
}

// Paso, deshacer y me gusta: la alternativa al gesto, para quien no puede o no
// quiere deslizar. Toman la tinta del color de la card activa (vía la paleta
// de la pantalla). Deshacer no desaparece: queda deshabilitado.
export function DeckActions({ cardId, canUndo, onPass, onUndo, onLike }: DeckActionsProps) {
  const pop = useSharedValue(1);

  useEffect(() => {
    pop.set(withSequence(withTiming(0.86, { duration: 0 }), withSpring(1, motion.bouncy)));
  }, [cardId, pop]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  return (
    <View style={styles.row}>
      <Animated.View style={popStyle}>
        <IconButton icon="close" size="lg" onPress={onPass} accessibilityLabel={t('deck.pass')} />
      </Animated.View>
      <IconButton
        icon="arrow-undo"
        size="sm"
        onPress={onUndo}
        disabled={!canUndo}
        accessibilityLabel={t('deck.undo')}
      />
      <Animated.View style={popStyle}>
        <IconButton
          icon="heart"
          size="lg"
          variant="solid"
          onPress={onLike}
          accessibilityLabel={t('deck.like')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space['2xl'],
    paddingVertical: space.lg,
  },
});
