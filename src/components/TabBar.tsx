import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/ui/Glass';
import type { IconName } from '@/components/ui/IconButton';
import { Squish } from '@/components/ui/Squish';
import { Text } from '@/components/ui/Text';
import { usePalette } from '@/design/PaletteContext';
import { radius, space } from '@/design/tokens';
import { haptic } from '@/lib/haptics';

export const TAB_BAR_HEIGHT = 64;

/** Espacio que cada pantalla deja abajo para que el tab bar flotante no tape contenido. */
export function useTabBarClearance(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, space.lg) + space.md;
}

// Ícono activo (relleno) e inactivo (contorno) por ruta.
const ICONS: Record<string, readonly [IconName, IconName]> = {
  index: ['albums', 'albums-outline'],
  favoritos: ['heart', 'heart-outline'],
  matches: ['sparkles', 'sparkles-outline'],
};

/**
 * Tab bar flotante de vidrio. La pestaña activa es una pill de tinta con su
 * nombre; las otras, solo ícono. Flota sobre el contenido: las pantallas
 * compensan con `useTabBarClearance`.
 */
export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const palette = usePalette();
  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: Math.max(insets.bottom, space.lg) }]}
    >
      <Glass radius={radius.pill} style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = typeof options.title === 'string' ? options.title : route.name;
          const [on, off] = ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              haptic.select();
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <Squish
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={[styles.tab, focused && { backgroundColor: palette.ink }]}
            >
              <Ionicons
                name={focused ? on : off}
                size={20}
                color={focused ? palette.bg : palette.ink}
              />
              {focused ? (
                <Text variant="caption" style={{ color: palette.bg }}>
                  {label}
                </Text>
              ) : null}
            </Squish>
          );
        })}
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: space.sm,
  },
  tab: {
    minWidth: space['4xl'],
    height: TAB_BAR_HEIGHT - space.lg,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
});
