import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { NameCard } from '@/components/NameCard';
import { Text } from '@/components/ui/Text';
import type { Name } from '@/data/types';
import { swatchFor } from '@/design/swatches';
import { motion, radius, space } from '@/design/tokens';
import { useSwatchScheme } from '@/design/useScheme';
import { t } from '@/i18n';
import { haptic } from '@/lib/haptics';

export type SwipeDirection = 'left' | 'right';

export interface SwipeDeckHandle {
  /** Lanza la card activa como si se hubiera deslizado (botones, lector de pantalla). */
  swipe: (direction: SwipeDirection) => void;
}

interface SwipeDeckProps {
  /** Nombres restantes; `stack[0]` es la card activa. */
  stack: Name[];
  onSwipe: (name: Name, liked: boolean) => void;
  /** Si la card activa volvió con "deshacer", entra desde el lado por el que salió. */
  enterFrom?: SwipeDirection;
  ref?: Ref<SwipeDeckHandle>;
}

const FLING_DISTANCE_RATIO = 0.3;
const FLING_VELOCITY = 900;
const MAX_ROTATION_DEG = 10;

export function SwipeDeck({ stack, onSwipe, enterFrom, ref }: SwipeDeckProps) {
  const [active, next] = stack;
  const topRef = useRef<SwipeDeckHandle>(null);
  useImperativeHandle(ref, () => ({ swipe: (direction) => topRef.current?.swipe(direction) }), []);

  if (!active) return null;

  return (
    <View style={styles.deck}>
      {next ? (
        // La siguiente card se asoma detrás. No es interactiva ni se anuncia.
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[StyleSheet.absoluteFill, styles.next]}
        >
          <NameCard name={next} />
        </View>
      ) : null}
      <TopCard
        // key: cada card activa parte con gesto y posición frescos.
        key={active.id}
        ref={topRef}
        name={active}
        onSwipe={onSwipe}
        enterFrom={enterFrom}
      />
    </View>
  );
}

interface TopCardProps {
  name: Name;
  onSwipe: (name: Name, liked: boolean) => void;
  enterFrom?: SwipeDirection;
  ref?: Ref<SwipeDeckHandle>;
}

function TopCard({ name, onSwipe, enterFrom, ref }: TopCardProps) {
  const { card } = useSwatchScheme(swatchFor(name.id));
  const { width } = useWindowDimensions();
  const exitX = width * 1.4;
  const threshold = width * FLING_DISTANCE_RATIO;

  const tx = useSharedValue(enterFrom ? (enterFrom === 'right' ? exitX : -exitX) : 0);
  const ty = useSharedValue(0);
  // Lado del umbral en que está la card (-1, 0, 1): para el tick háptico al cruzarlo.
  const armed = useSharedValue(0);
  // Una card que ya sale no acepta otro swipe (botón + gesto a la vez).
  const leaving = useSharedValue(false);

  useEffect(() => {
    if (enterFrom) tx.set(withSpring(0, motion.gentle));
  }, [enterFrom, tx]);

  const finish = (liked: boolean) => onSwipe(name, liked);

  const fling = (liked: boolean, velocityY = 0) => {
    'worklet';
    if (leaving.get()) return;
    leaving.set(true);
    tx.set(
      withTiming((liked ? 1 : -1) * exitX, { duration: motion.exit }, (finished) => {
        // Reanimated vuelve a llamar este callback con `finished = false` cuando
        // la card se desmonta. Sin este guard, cada swipe se registraba dos veces.
        if (finished) scheduleOnRN(finish, liked);
      }),
    );
    ty.set(withTiming(ty.get() + velocityY * 0.05, { duration: motion.exit }));
  };

  useImperativeHandle(ref, () => ({ swipe: (direction) => fling(direction === 'right') }));

  const pan = Gesture.Pan()
    .onChange((e) => {
      if (leaving.get()) return;
      tx.set(tx.get() + e.changeX);
      ty.set(ty.get() + e.changeY);
      const side = tx.get() > threshold ? 1 : tx.get() < -threshold ? -1 : 0;
      if (side !== armed.get()) {
        armed.set(side);
        if (side !== 0) scheduleOnRN(haptic.tick);
      }
    })
    .onEnd((e) => {
      if (leaving.get()) return;
      armed.set(0);
      const reach = tx.get();
      const flung = Math.abs(reach) > threshold || Math.abs(e.velocityX) > FLING_VELOCITY;
      if (flung) {
        fling((Math.abs(reach) > 1 ? reach : e.velocityX) > 0, e.velocityY);
      } else {
        tx.set(withSpring(0, motion.bouncy));
        ty.set(withSpring(0, motion.bouncy));
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.get() },
      { translateY: ty.get() },
      {
        rotate: `${interpolate(tx.get(), [-width, width], [-MAX_ROTATION_DEG, MAX_ROTATION_DEG], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));
  const likeStamp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.get(), [0, threshold * 0.6], [0, 1], Extrapolation.CLAMP),
  }));
  const passStamp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.get(), [-threshold * 0.6, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[StyleSheet.absoluteFill, cardStyle]}
        accessible
        accessibilityLabel={t('deck.a11y.card', {
          name: name.name,
          origin: name.origin,
          gender: t(`gender.${name.gender}`),
          meaning: name.meaning,
        })}
        accessibilityHint={t('deck.a11y.hint')}
        accessibilityActions={[
          { name: 'like', label: t('deck.like') },
          { name: 'pass', label: t('deck.pass') },
        ]}
        onAccessibilityAction={(e) => fling(e.nativeEvent.actionName === 'like')}
      >
        <NameCard name={name} />
        <Animated.View
          pointerEvents="none"
          style={[styles.stamp, styles.stampLike, { backgroundColor: card.ink }, likeStamp]}
        >
          <Ionicons name="heart" size={22} color={card.bg} />
          <Text variant="heading" style={{ color: card.bg }}>
            {t('deck.like')}
          </Text>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[styles.stamp, styles.stampPass, { backgroundColor: card.ink }, passStamp]}
        >
          <Ionicons name="close" size={22} color={card.bg} />
          <Text variant="heading" style={{ color: card.bg }}>
            {t('deck.pass')}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  deck: {
    flex: 1,
  },
  next: {
    transform: [{ translateY: space.md }, { scale: 0.94 }],
    opacity: 0.75,
  },
  stamp: {
    position: 'absolute',
    top: space['4xl'] + space['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
  stampLike: {
    left: space['2xl'],
    transform: [{ rotate: '-14deg' }],
  },
  stampPass: {
    right: space['2xl'],
    transform: [{ rotate: '14deg' }],
  },
});
