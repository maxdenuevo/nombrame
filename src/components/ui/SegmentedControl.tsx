import { StyleSheet, View } from 'react-native';

import { usePalette } from '@/design/PaletteContext';
import { radius, space, touchTarget } from '@/design/tokens';
import { haptic } from '@/lib/haptics';

import { Glass } from './Glass';
import { Squish } from './Squish';
import { Text } from './Text';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const palette = usePalette();
  return (
    <Glass
      radius={radius.pill}
      style={styles.track}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <View key={o.value} style={styles.cell}>
            <Squish
              accessibilityRole="radio"
              accessibilityLabel={o.label}
              accessibilityState={{ checked: selected }}
              onPress={() => {
                if (selected) return;
                haptic.select();
                onChange(o.value);
              }}
              style={[styles.segment, selected && { backgroundColor: palette.ink }]}
            >
              <Text variant="caption" style={selected ? { color: palette.bg } : undefined}>
                {o.label}
              </Text>
            </Squish>
          </View>
        );
      })}
    </Glass>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: space.xs,
    gap: space.xs / 2,
  },
  cell: {
    flex: 1,
  },
  segment: {
    minHeight: touchTarget - space.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
