import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { continuousCurve, material } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface MaterialProps extends ViewProps {
  /** Radio del contenedor. Se recorta el material, así que es obligatorio
   * pasarlo desde los tokens de `radius`. */
  radius: number;
}

/**
 * Superficie translúcida. Concentra en un solo lugar la bifurcación de
 * plataforma: blur nativo en iOS, color sólido en Android — ahí el blur es
 * experimental y caro, y Android es el público mayoritario (CLAUDE.md).
 *
 * Solo tiene sentido donde hay algo detrás que difuminar: la card activa del
 * deck (con la siguiente asomándose), el tab bar y los controles flotantes.
 * Sobre un fondo plano el blur cuesta GPU y no se ve.
 */
export function Material({ radius, style, children, ...rest }: MaterialProps) {
  const { dark } = useTheme();
  // Sin `overflow: 'hidden'` el radio no recorta el blur.
  const shape = { borderRadius: radius, overflow: 'hidden' as const, ...continuousCurve };

  if (Platform.OS !== 'ios') {
    const fallback = dark ? material.androidFallback.dark : material.androidFallback.light;
    return (
      <View {...rest} style={[shape, { backgroundColor: fallback }, style]}>
        {children}
      </View>
    );
  }

  return (
    <View {...rest} style={[shape, style]}>
      <BlurView
        tint={material.tint}
        intensity={material.intensity}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
