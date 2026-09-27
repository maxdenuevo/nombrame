import type { Ref } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { maxScaleFor, radius, space, touchTarget, type } from '@/design/tokens';

import { Glass } from './Glass';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Obligatorio: el placeholder desaparece al escribir y no sirve de etiqueta. */
  accessibilityLabel: string;
  ref?: Ref<TextInput>;
}

// Campo de texto en cápsula de vidrio, como los botones secundarios. La tinta
// sale de la superficie donde está (usePalette), igual que el texto.
export function TextField({ ref, ...props }: TextFieldProps) {
  const palette = usePalette();
  return (
    <Glass radius={radius.pill} style={styles.field}>
      <TextInput
        ref={ref}
        placeholderTextColor={palette.inkMuted}
        selectionColor={palette.ink}
        cursorColor={palette.ink}
        maxFontSizeMultiplier={maxScaleFor.body}
        style={[styles.input, { color: palette.ink }]}
        {...props}
      />
    </Glass>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  input: {
    // Sin lineHeight: en iOS desalinea el texto dentro de un TextInput.
    fontFamily: type.body.fontFamily,
    fontSize: type.body.fontSize,
    minHeight: touchTarget,
    paddingHorizontal: space.xl,
    paddingVertical: 0,
    includeFontPadding: false,
  },
});
