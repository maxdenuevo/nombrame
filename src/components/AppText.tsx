import { Text, type TextProps } from 'react-native';

import { maxScaleFor, type as typeTokens, type TypeVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Colors } from '@/theme/theme';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'tint' | 'danger' | 'inverse';

const toneToColor: Record<Exclude<Tone, 'inverse'>, keyof Colors> = {
  primary: 'label',
  secondary: 'labelSecondary',
  tertiary: 'labelTertiary',
  quaternary: 'labelQuaternary',
  tint: 'tint',
  danger: 'danger',
};

interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  tone?: Tone;
}

export function AppText({ variant = 'body', tone = 'primary', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  // `inverse` es texto sobre un relleno de acento; el par correcto lo define
  // la capa semántica, no el componente.
  const color = tone === 'inverse' ? colors.onTintSolid : colors[toneToColor[tone]];

  return (
    <Text
      // El font scale del sistema llega hasta 2× o más; los roles de display
      // viven en layouts rígidos y se acotan a 1.3× (DESIGN.md §3).
      maxFontSizeMultiplier={maxScaleFor[variant]}
      style={[typeTokens[variant], { color }, style]}
      {...rest}
    />
  );
}
