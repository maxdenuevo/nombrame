import Ionicons from '@expo/vector-icons/Ionicons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { fontAssets } from '@/design/fonts';
import { useScheme } from '@/design/useScheme';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useStoresHydrated } from '@/store/useStoresHydrated';

// El splash sigue visible hasta que Nunito y los íconos cargaron (sin salto de
// fuente) y los stores persistidos se hidrataron (sin parpadeo del onboarding).
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { dark, chrome } = useScheme();
  const [fontsLoaded, fontsError] = useFonts({ ...fontAssets, ...Ionicons.font });
  const hydrated = useStoresHydrated();
  const onboarded = useOnboardingStore((s) => s.done);
  const ready = (fontsLoaded || fontsError != null) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const base = dark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: chrome.ink,
      background: chrome.bg,
      card: chrome.bg,
      text: chrome.ink,
      border: chrome.line,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={navTheme}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            {/* Primera vez: solo el onboarding. Al completarlo, el guard cambia y
                el router lleva a las pestañas. */}
            <Stack.Protected guard={!onboarded}>
              <Stack.Screen name="onboarding" />
            </Stack.Protected>
            <Stack.Protected guard={onboarded}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="decks" options={{ presentation: 'modal' }} />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
