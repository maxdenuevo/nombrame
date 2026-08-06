import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { NameCard } from '@/components/NameCard';
import type { Name } from '@/data/types';
import { continuousCurve, radius, spacing, withAlpha } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type SwipeDirection = 'left' | 'right';

interface SwipeDeckProps {
  /** Nombres restantes; `stack[0]` es la card activa. */
  stack: Name[];
  onSwipe: (name: Name, liked: boolean) => void;
  /** Si la card activa fue restaurada con "deshacer", vuelve a entrar desde el
   * lado por el que salió (misma física de spring, en reversa). */
  enterFrom?: SwipeDirection;
}

const FLING_DISTANCE_RATIO = 0.35;
const FLING_VELOCITY = 900;
const EXIT_DURATION = 200;
const MAX_ROTATION_DEG = 8;
const SPRING = { damping: 18, stiffness: 180 };

export function SwipeDeck({ stack, onSwipe, enterFrom }: SwipeDeckProps) {
  const [active, next] = stack;
  if (!active) return null;

  return (
    <View style={styles.deck}>
      {next ? (
        // La siguiente card se asoma detrás (escala 0.96, opacidad 0.7).
        <View style={[StyleSheet.absoluteFill, styles.nextCard]} pointerEvents="none">
          <NameCard name={next} />
        </View>
      ) : null}
      <TopCard
        // key: cada card activa parte con gesto y posición frescos.
        key={active.id}
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
}

function TopCard({ name, onSwipe, enterFrom }: TopCardProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const exitX = width * 1.4;

  const tx = useSharedValue(enterFrom ? (enterFrom === 'right' ? exitX : -exitX) : 0);
  const ty = useSharedValue(0);

  useEffect(() => {
    if (enterFrom) {
      tx.set(withSpring(0, SPRING));
    }
  }, [enterFrom, tx]);

  const finishSwipe = (liked: boolean) => onSwipe(name, liked);

  const pan = Gesture.Pan()
    .onChange((e) => {
      tx.set(tx.get() + e.changeX);
      ty.set(ty.get() + e.changeY);
    })
    .onEnd((e) => {
      const reachTx = tx.get();
      const flung =
        Math.abs(reachTx) > width * FLING_DISTANCE_RATIO || Math.abs(e.velocityX) > FLING_VELOCITY;
      if (flung) {
        const liked = (Math.abs(reachTx) > 1 ? reachTx : e.velocityX) > 0;
        tx.set(
          withTiming((liked ? 1 : -1) * exitX, { duration: EXIT_DURATION }, () => {
            runOnJS(finishSwipe)(liked);
          }),
        );
        ty.set(withTiming(ty.get() + e.velocityY * 0.05, { duration: EXIT_DURATION }));
      } else {
        tx.set(withSpring(0, SPRING));
        ty.set(withSpring(0, SPRING));
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      {
        rotate: `${interpolate(
          tx.value,
          [-width, width],
          [-MAX_ROTATION_DEG, MAX_ROTATION_DEG],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  // Tinte de borde al arrastrar: coral hacia la derecha (me gusta), `pass`
  // hacia la izquierda. Siempre con ícono además del color.
  const likeTint = withAlpha(colors.partnerA, 0.12);
  const passTint = withAlpha(colors.pass, 0.12);
  const reach = width * 0.25;

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      tx.value,
      [-reach, 0, reach],
      [passTint, 'transparent', likeTint],
    ),
  }));

  const likeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [0, reach], [0, 1], Extrapolation.CLAMP),
  }));

  const passIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-reach, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
        <NameCard name={name} />
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.border, borderStyle]}
        />
        <Animated.View pointerEvents="none" style={[styles.icon, likeIconStyle]}>
          <Ionicons name="heart" size={40} color={colors.partnerA} />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.icon, passIconStyle]}>
          <Ionicons name="close" size={40} color={colors.pass} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  deck: {
    flex: 1,
  },
  nextCard: {
    transform: [{ scale: 0.96 }],
    opacity: 0.7,
  },
  border: {
    borderRadius: radius.cardOuter,
    ...continuousCurve,
    borderWidth: 3,
  },
  icon: {
    position: 'absolute',
    top: spacing['2xl'],
    alignSelf: 'center',
  },
});
