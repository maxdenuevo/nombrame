import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { NameListRow } from '@/components/NameListRow';
import { names } from '@/data/names';
import { t } from '@/i18n';
import { selectLikedIds, useDeckStore } from '@/store/useDeckStore';
import { spacing } from '@/theme/tokens';

export default function FavoritesScreen() {
  const router = useRouter();
  const swiped = useDeckStore((s) => s.swiped);

  const favorites = useMemo(() => {
    const liked = new Set(selectLikedIds({ swiped }));
    return names.filter((n) => liked.has(n.id));
  }, [swiped]);

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState
          title={t('favorites.empty.title')}
          subtitle={t('favorites.empty.subtitle')}
          ctaLabel={t('favorites.empty.cta')}
          onPress={() => router.navigate('/')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={favorites}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <AppText variant="title" style={styles.title}>
            {t('favorites.title')}
          </AppText>
        }
        renderItem={({ item }) => <NameListRow name={item} />}
      />
    </SafeAreaView>
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
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  title: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  separator: {
    height: spacing.lg,
  },
});
