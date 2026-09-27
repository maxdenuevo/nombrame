import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { NameRow } from '@/components/NameRow';
import { useTabBarClearance } from '@/components/TabBar';
import { Text } from '@/components/ui/Text';
import { Wash } from '@/components/ui/Wash';
import { names } from '@/data/names';
import type { Name } from '@/data/types';
import { usePalette } from '@/design/PaletteContext';
import { radius, space } from '@/design/tokens';
import { useScheme } from '@/design/useScheme';
import { t } from '@/i18n';
import { useDeckStore } from '@/store/useDeckStore';

const namesById = new Map(names.map((n) => [n.id, n]));

export default function FavoritesScreen() {
  const router = useRouter();
  const { dark, chrome } = useScheme();
  const clearance = useTabBarClearance();
  const swiped = useDeckStore((s) => s.swiped);

  // Lo último que te gustó, primero.
  const favorites = useMemo(
    () =>
      swiped
        .filter((r) => r.liked)
        .map((r) => namesById.get(r.nameId))
        .filter((n): n is Name => n != null)
        .reverse(),
    [swiped],
  );

  return (
    <View style={styles.screen}>
      <Wash wash={chrome.wash} id={`chrome-${dark ? 'dark' : 'light'}`} />
      <SafeAreaView edges={['top']} style={styles.screen}>
        {favorites.length === 0 ? (
          <View style={[styles.screen, { paddingBottom: clearance }]}>
            <EmptyState
              title={t('favorites.empty.title')}
              subtitle={t('favorites.empty.subtitle')}
              ctaLabel={t('favorites.empty.cta')}
              onPress={() => router.navigate('/')}
            />
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(n) => n.id}
            contentContainerStyle={[styles.list, { paddingBottom: clearance }]}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={<Header count={favorites.length} />}
            renderItem={({ item }) => <NameRow name={item} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function Header({ count }: { count: number }) {
  const palette = usePalette();
  return (
    <View style={styles.header}>
      <Text variant="title" accessibilityRole="header">
        {t('favorites.title')}
      </Text>
      <View
        style={[styles.count, { backgroundColor: palette.ink }]}
        accessible
        accessibilityLabel={t('favorites.count', { count })}
      >
        <Text variant="label" style={{ color: palette.bg }}>
          {count}
        </Text>
      </View>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingHorizontal: space.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginTop: space.xl,
    marginBottom: space.xl,
  },
  count: {
    minWidth: space['3xl'] + space.xs,
    height: space['3xl'] + space.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: space.md,
  },
});
