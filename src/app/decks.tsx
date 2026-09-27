import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckCover } from '@/components/DeckCover';
import { IconButton } from '@/components/ui/IconButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Text } from '@/components/ui/Text';
import { Wash } from '@/components/ui/Wash';
import { deckProgress } from '@/data/deckUtils';
import { decks } from '@/data/decks';
import type { Deck, GenderFilter } from '@/data/types';
import { swatchForDeck } from '@/design/swatches';
import { space } from '@/design/tokens';
import { useScheme } from '@/design/useScheme';
import { t } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useDeckStore } from '@/store/useDeckStore';
import { useLibraryStore } from '@/store/useLibraryStore';

const GENDER_FILTERS: GenderFilter[] = ['all', 'f', 'm', 'x'];

/** Pares de decks para la grilla de dos columnas. */
function pairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

// Biblioteca de decks (modal). Tocar un cover lo activa, lo suma a "Tus decks"
// y vuelve al swipe: un solo toque, sin paso de "agregar".
export default function DecksScreen() {
  const router = useRouter();
  const { dark, chrome } = useScheme();
  const swiped = useDeckStore((s) => s.swiped);
  const hideUndo = useDeckStore((s) => s.hideUndo);
  const activeDeckSlug = useLibraryStore((s) => s.activeDeckSlug);
  const genderFilter = useLibraryStore((s) => s.genderFilter);
  const addedDeckSlugs = useLibraryStore((s) => s.addedDeckSlugs);
  const activateDeck = useLibraryStore((s) => s.activateDeck);
  const setGenderFilter = useLibraryStore((s) => s.setGenderFilter);

  const swipedIds = useMemo(() => new Set(swiped.map((r) => r.nameId)), [swiped]);
  const added = decks.filter((d) => addedDeckSlugs.includes(d.slug));
  const discoverable = decks.filter((d) => !addedDeckSlugs.includes(d.slug));

  const meta = (slug: string | null) => {
    const { seen, total } = deckProgress(slug, genderFilter, swipedIds);
    return seen > 0 ? t('library.progress', { seen, total }) : t('library.count', { count: total });
  };

  // Abierta por link directo (web, deep link) no hay pantalla a la cual volver.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  // Cambiar de deck o de filtro invalida el deshacer: la card restaurada
  // podría no estar en el stack visible y "reaparecería" en silencio.
  const activate = (slug: string | null) => {
    haptic.select();
    activateDeck(slug);
    hideUndo();
    close();
  };

  const changeFilter = (filter: GenderFilter) => {
    setGenderFilter(filter);
    hideUndo();
  };

  const cover = (deck: Deck) => {
    const active = activeDeckSlug === deck.slug;
    const progress = meta(deck.slug);
    return (
      <DeckCover
        key={deck.slug}
        title={deck.title}
        meta={progress}
        swatch={swatchForDeck(deck.slug)}
        active={active}
        accessibilityLabel={t(active ? 'library.activeA11y' : 'library.deckA11y', {
          deck: deck.title,
          progress,
        })}
        onPress={() => activate(deck.slug)}
      />
    );
  };

  const grid = (list: Deck[]) => (
    <View style={styles.grid}>
      {pairs(list).map((row) => (
        <View key={row.map((d) => d.slug).join()} style={styles.row}>
          {row.map(cover)}
          {row.length === 1 ? <View style={styles.filler} /> : null}
        </View>
      ))}
    </View>
  );

  const allProgress = meta(null);
  const allActive = activeDeckSlug === null;

  return (
    <View style={styles.screen}>
      <Wash wash={chrome.wash} id={`chrome-${dark ? 'dark' : 'light'}`} />
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text variant="title">{t('library.title')}</Text>
            <IconButton
              icon="close"
              size="sm"
              onPress={close}
              accessibilityLabel={t('library.close')}
            />
          </View>

          <View style={styles.filter}>
            <Text variant="overline" tone="muted">
              {t('library.filter.label')}
            </Text>
            <SegmentedControl
              accessibilityLabel={t('library.filter.label')}
              options={GENDER_FILTERS.map((f) => ({
                value: f,
                label: f === 'all' ? t('library.filter.all') : t(`gender.${f}`),
              }))}
              value={genderFilter}
              onChange={changeFilter}
            />
          </View>

          <DeckCover
            wide
            title={t('library.allNames')}
            meta={allProgress}
            swatch={swatchForDeck(null)}
            active={allActive}
            accessibilityLabel={t(allActive ? 'library.activeA11y' : 'library.deckA11y', {
              deck: t('library.allNames'),
              progress: allProgress,
            })}
            onPress={() => activate(null)}
          />

          {added.length > 0 ? grid(added) : null}

          {discoverable.length > 0 ? (
            <>
              {added.length > 0 ? (
                <Text variant="heading" style={styles.section}>
                  {t('library.discover')}
                </Text>
              ) : null}
              {grid(discoverable)}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingBottom: space['4xl'],
    gap: space.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.xl,
  },
  filter: {
    gap: space.sm,
  },
  grid: {
    gap: space.md,
  },
  row: {
    flexDirection: 'row',
    gap: space.md,
  },
  filler: {
    flex: 1,
  },
  section: {
    marginTop: space.lg,
  },
});
