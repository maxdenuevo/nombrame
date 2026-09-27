import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Háptica con intención, no por decoración: cada evento tiene su sensación.
// Android usa `performAndroidHapticsAsync` (la API recomendada, sin permiso
// VIBRATE); iOS usa impact/selection/notification. En web no hace nada.

function android(type: Haptics.AndroidHaptics) {
  Haptics.performAndroidHapticsAsync(type).catch(() => {});
}

function ios(run: () => Promise<void>) {
  run().catch(() => {});
}

function play(onAndroid: Haptics.AndroidHaptics, onIos: () => Promise<void>) {
  if (Platform.OS === 'android') android(onAndroid);
  else if (Platform.OS === 'ios') ios(onIos);
}

export const haptic = {
  /** La card cruza el umbral de swipe mientras se arrastra. */
  tick: () => play(Haptics.AndroidHaptics.Segment_Tick, () => Haptics.selectionAsync()),
  /** Me gusta. */
  like: () =>
    play(Haptics.AndroidHaptics.Confirm, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    ),
  /** Paso. Más suave que el like: pasar no es un error. */
  pass: () =>
    play(Haptics.AndroidHaptics.Gesture_End, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    ),
  /** Deshacer. */
  undo: () =>
    play(Haptics.AndroidHaptics.Context_Click, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
    ),
  /** Elegir una opción (filtro, deck). */
  select: () => play(Haptics.AndroidHaptics.Segment_Tick, () => Haptics.selectionAsync()),
  /** Un match. */
  success: () =>
    play(Haptics.AndroidHaptics.Confirm, () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),
};
