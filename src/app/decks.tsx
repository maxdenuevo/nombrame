import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DeckCard } from '@/components/DeckCard';
import { FilterChip } from '@/components/FilterChip';
import { deckProgress } from '@/data/deckUtils';
import { decks } from '@/data/decks';
import type { GenderFilter } from '@/data/types';
import { t } from '@/i18n';
import { useDeckStore } from '@/store/useDeckStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { spacing } from '@/theme/tokens';

const GENDER_FILTERS: GenderFilter[] = ['all', 'f', 'm', 'x'];

// Biblioteca de decks (modal). "Agregar" y "activar" son acciones distintas:
// agregar mete el deck a "Tus decks"; tocar una card lo activa y vuelve al
// swipe.
export default function DecksScreen() {
  const router = useRouter();
  const swiped = useDeckStore((s) => s.swiped);
  const hideUndo = useDeckStore((s) => s.hideUndo);
  const activeDeckSlug = useLibraryStore((s) => s.activeDeckSlug);
  const genderFilter = useLibraryStore((s) => s.genderFilter);
  const addedDeckSlugs = useLibraryStore((s) => s.addedDeckSlugs);
  const setActiveDeck = useLibraryStore((s) => s.setActiveDeck);
  const setGenderFilter = useLibraryStore((s) => s.setGenderFilter);
  const addDeck = useLibraryStore((s) => s.addDeck);

  const swipedIds = useMemo(() => new Set(swiped.map((r) => r.nameId)), [swiped]);

  const added = decks.filter((d) => addedDeckSlugs.includes(d.slug));
  const discoverable = decks.filter((d) => !addedDeckSlugs.includes(d.slug));

  const progressLabel = (slug: string | null) => {
    const { seen, total } = deckProgress(slug, genderFilter, swipedIds);
    return t('library.progress', { seen, total });
  };

  // Cambiar de deck o de filtro invalida el deshacer: la card restaurada
  // podría no estar en el stack visible y "reaparecería" en silencio.
  const activate = (slug: string | null) => {
    setActiveDeck(slug);
    hideUndo();
    router.back();
  };

  const changeFilter = (filter: GenderFilter) => {
    setGenderFilter(filter);
    hideUndo();
  };

  const filterLabel = (f: GenderFilter) =>
    f === 'all' ? t('library.filter.all') : t(`gender.${f}`);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title" style={styles.title}>
          {t('library.title')}
        </AppText>

        <AppText variant="overline" tone="tertiary" style={styles.filterLabel}>
          {t('library.filter.label')}
        </AppText>
        <View style={styles.filters}>
          {GENDER_FILTERS.map((f) => (
            <FilterChip
              key={f}
              label={filterLabel(f)}
              selected={genderFilter === f}
              onPress={() => changeFilter(f)}
            />
          ))}
        </View>

        <View style={styles.cards}>
          <DeckCard
            title={t('library.allNames')}
            description={t('library.allNamesDescription')}
            meta={progressLabel(null)}
            active={activeDeckSlug === null}
            activeLabel={t('library.activeDeck')}
            onPress={() => activate(null)}
          />
          {added.map((deck) => (
            <DeckCard
              key={deck.slug}
              title={deck.title}
              description={deck.description}
              meta={progressLabel(deck.slug)}
              active={activeDeckSlug === deck.slug}
              activeLabel={t('library.activeDeck')}
              onPress={() => activate(deck.slug)}
            />
          ))}
        </View>

        {discoverable.length > 0 ? (
          <>
            <AppText variant="heading" style={styles.discover}>
              {t('library.discover')}
            </AppText>
            <View style={styles.cards}>
              {discoverable.map((deck) => (
                <DeckCard
                  key={deck.slug}
                  title={deck.title}
                  description={deck.description}
                  meta={progressLabel(deck.slug)}
                  cta={{ label: t('library.add'), onPress: () => addDeck(deck.slug) }}
                />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  title: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  filterLabel: {
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  cards: {
    gap: spacing.lg,
  },
  discover: {
    marginTop: spacing['3xl'],
    marginBottom: spacing.xl,
  },
});
