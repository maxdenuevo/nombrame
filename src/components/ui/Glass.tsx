import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Platform,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useScheme } from '@/design/useScheme';

const LIQUID_GLASS = Platform.OS === 'ios' && isLiquidGlassAvailable();

function useReduceTransparency() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

interface GlassProps extends ViewProps {
  radius: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Vidrio esmerilado sobre color. Una sola bifurcación de plataforma:
 * - iOS 26+: Liquid Glass nativo (`GlassView`).
 * - Web: `backdropFilter`.
 * - Android, iOS anterior y "reducir transparencia": relleno translúcido más
 *   opaco con borde fino. Android es el público mayoritario y ahí el blur es caro.
 *
 * Ojo: el vidrio de iOS desaparece si él o un padre tiene `opacity: 0`, así
 * que sus entradas se animan con escala o posición, nunca con fade.
 */
export function Glass({ radius, style, children, ...rest }: GlassProps) {
  const { dark, chrome } = useScheme();
  const reduceTransparency = useReduceTransparency();
  const shape: ViewStyle = { borderRadius: radius, borderCurve: 'continuous', overflow: 'hidden' };

  if (LIQUID_GLASS && !reduceTransparency) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={dark ? 'dark' : 'light'}
        style={[shape, style]}
        {...rest}
      >
        {children}
      </GlassView>
    );
  }

  const edge: ViewStyle = { borderWidth: 1, borderColor: chrome.glass.border };
  if (Platform.OS === 'web') {
    // Cast: `backdropFilter` existe en react-native-web pero no en ViewStyle.
    const frosted = {
      backgroundColor: chrome.glass.fill,
      backdropFilter: 'blur(24px) saturate(1.5)',
    } as ViewStyle;
    return (
      <View style={[shape, edge, frosted, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View style={[shape, edge, { backgroundColor: chrome.glass.fallback }, style]} {...rest}>
      {children}
    </View>
  );
}
