import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { maxScaleFor, type, type TypeVariant } from '@/design/tokens';

export type Tone = 'ink' | 'muted';

export interface TextProps extends RNTextProps {
  variant?: TypeVariant;
  /** El color sale de la superficie donde está el texto (card o chrome), nunca de props. */
  tone?: Tone;
}

export function Text({ variant = 'body', tone = 'ink', style, ...rest }: TextProps) {
  const palette = usePalette();
  return (
    <RNText
      // El font scale del sistema se acota por rol: los roles grandes viven en layouts rígidos.
      maxFontSizeMultiplier={maxScaleFor[variant]}
      style={[
        type[variant],
        // Nunito centra mejor en pills sin el padding extra de fuente de Android.
        { color: tone === 'ink' ? palette.ink : palette.inkMuted, includeFontPadding: false },
        style,
      ]}
      {...rest}
    />
  );
}
