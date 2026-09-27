import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { View, type ViewStyle } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { radius, touchTarget } from '@/design/tokens';

import { Glass } from './Glass';
import { Squish } from './Squish';

export type IconName = ComponentProps<typeof Ionicons>['name'];

const SIZES = { lg: 72, md: 56, sm: touchTarget } as const;

interface IconButtonProps {
  icon: IconName;
  /** Obligatorio: un botón de solo ícono no dice nada a un lector de pantalla. */
  accessibilityLabel: string;
  onPress: () => void;
  size?: keyof typeof SIZES;
  variant?: 'solid' | 'glass';
  disabled?: boolean;
}

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = 'md',
  variant = 'glass',
  disabled,
}: IconButtonProps) {
  const palette = usePalette();
  const d = SIZES[size];
  const shape: ViewStyle = {
    width: d,
    height: d,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const glyph = Math.round(d * 0.42);

  return (
    <Squish onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
      {variant === 'solid' ? (
        <View style={[shape, { backgroundColor: palette.ink }]}>
          <Ionicons name={icon} size={glyph} color={palette.bg} />
        </View>
      ) : (
        <Glass radius={radius.pill} style={shape}>
          <Ionicons name={icon} size={glyph} color={palette.ink} />
        </Glass>
      )}
    </Squish>
  );
}
