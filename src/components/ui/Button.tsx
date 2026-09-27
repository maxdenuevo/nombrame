import { StyleSheet, View } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { radius, space, touchTarget } from '@/design/tokens';

import { Glass } from './Glass';
import { Squish } from './Squish';
import { Text } from './Text';

interface ButtonProps {
  label: string;
  onPress: () => void;
  /** `solid`: relleno de tinta (acción principal). `glass`: vidrio (secundaria). */
  variant?: 'solid' | 'glass';
  disabled?: boolean;
}

// Cápsula grande y gordita. El relleno sólido invierte la paleta de la
// superficie (fondo tinta, texto del color de fondo): mismo contraste que el
// texto normal, en cualquier card y en ambos esquemas.
export function Button({ label, onPress, variant = 'solid', disabled }: ButtonProps) {
  const palette = usePalette();
  const content =
    variant === 'solid' ? (
      <View style={[styles.base, { backgroundColor: palette.ink }]}>
        <Text variant="label" style={{ color: palette.bg }}>
          {label}
        </Text>
      </View>
    ) : (
      <Glass radius={radius.pill} style={styles.base}>
        <Text variant="label">{label}</Text>
      </Glass>
    );

  return (
    <Squish onPress={onPress} disabled={disabled} accessibilityLabel={label} style={styles.stretch}>
      {content}
    </Squish>
  );
}

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
  },
  base: {
    minHeight: touchTarget + space.md,
    borderRadius: radius.pill,
    borderCurve: 'continuous',
    paddingHorizontal: space['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
