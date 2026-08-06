import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { t } from '@/i18n';
import { type as typeTokens } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.labelSecondary,
        // Sólido, no material: dejarlo translúcido exige posicionarlo absoluto
        // y compensar con insets desde `useBottomTabBarHeight`, que en Expo
        // Router 57 solo se alcanza por una ruta interna. Ver DESIGN.md.
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.separator,
        },
        tabBarLabelStyle: {
          fontFamily: typeTokens.overline.fontFamily,
          fontSize: typeTokens.overline.fontSize,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.swipe'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: t('tabs.favorites'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: t('tabs.matches'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
