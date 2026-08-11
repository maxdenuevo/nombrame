import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckHeader } from '@/components/DeckHeader';
import { EmptyState } from '@/components/EmptyState';
import { SwipeDeck, type SwipeDirection } from '@/components/SwipeDeck';
import { UndoButton } from '@/components/UndoButton';
import { deckProgress, getDeckStack } from '@/data/deckUtils';
import { decks } from '@/data/decks';
import type { Name } from '@/data/types';
import { t } from '@/i18n';
import { useDeckStore } from '@/store/useDeckStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { spacing } from '@/theme/tokens';

const UNDO_VISIBLE_MS = 5000;

export default function SwipeScreen() {
  const router = useRouter();
  const swiped = useDeckStore((s) => s.swiped);
  const canUndo = useDeckStore((s) => s.canUndo);
  const swipe = useDeckStore((s) => s.swipe);
  const undo = useDeckStore((s) => s.undo);
  const hideUndo = useDeckStore((s) => s.hideUndo);
  const activeDeckSlug = useLibraryStore((s) => s.activeDeckSlug);
  const genderFilter = useLibraryStore((s) => s.genderFilter);

  // Card restaurada por deshacer: vuelve a entrar desde el lado por el que
  // salió. Lleva el deck y filtro en los que se deshizo: si cambian, la
  // animación de reingreso ya no aplica (la card puede no estar en el stack).
  const [restored, setRestored] = useState<{
    id: string;
    from: SwipeDirection;
    deckSlug: string | null;
    filter: string;
  } | null>(null);

  const swipedIds = useMemo(() => new Set(swiped.map((r) => r.nameId)), [swiped]);
  const stack = useMemo(
    () => getDeckStack(activeDeckSlug, genderFilter, swipedIds),
    [activeDeckSlug, genderFilter, swipedIds],
  );
  const progress = useMemo(
    () => deckProgress(activeDeckSlug, genderFilter, swipedIds),
    [activeDeckSlug, genderFilter, swipedIds],
  );

  const activeDeck = activeDeckSlug ? decks.find((d) => d.slug === activeDeckSlug) : undefined;
  const deckTitle = activeDeck ? activeDeck.title : t('library.allNames');

  // El botón de deshacer desaparece pasados ~5 s de inactividad.
  useEffect(() => {
    if (!canUndo) return;
    const timer = setTimeout(hideUndo, UNDO_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [canUndo, swiped.length, hideUndo]);

  const handleSwipe = (name: Name, liked: boolean) => {
    swipe(name.id, liked);
    setRestored(null);
  };

  const handleUndo = () => {
    const record = undo();
    if (record) {
      setRestored({
        id: record.nameId,
        from: record.liked ? 'right' : 'left',
        deckSlug: activeDeckSlug,
        filter: genderFilter,
      });
    }
  };

  const header = (
    <DeckHeader
      title={deckTitle}
      overline={t('library.activeDeck')}
      progress={t('library.progress', { seen: progress.seen, total: progress.total })}
      filterLabel={genderFilter === 'all' ? null : t(`gender.${genderFilter}`)}
      onPress={() => router.push('/decks')}
    />
  );

  if (stack.length === 0) {
    // Tres finales distintos: deck sin nombres para el filtro actual, deck
    // temático completado, y catálogo completo agotado.
    const empty =
      progress.total === 0
        ? {
            title: t('deck.emptyForFilter.title'),
            subtitle: t('deck.emptyForFilter.subtitle'),
            ctaLabel: t('deck.emptyForFilter.cta'),
            onPress: () => router.push('/decks'),
          }
        : activeDeck
          ? {
              title: t('deck.done.title'),
              subtitle: t('deck.done.subtitle'),
              ctaLabel: t('deck.done.cta'),
              onPress: () => router.push('/decks'),
            }
          : {
              title: t('deck.exhausted.title'),
              subtitle: t('deck.exhausted.subtitle'),
              ctaLabel: t('deck.exhausted.ctaFavorites'),
              onPress: () => router.navigate('/favoritos'),
            };
    return (
      <SafeAreaView style={styles.screen}>
        {header}
        <EmptyState
          title={empty.title}
          subtitle={empty.subtitle}
          ctaLabel={empty.ctaLabel}
          onPress={empty.onPress}
        />
      </SafeAreaView>
    );
  }

  const active = stack[0];

  return (
    <SafeAreaView style={styles.screen}>
      {header}
      <View style={styles.deckArea}>
        <SwipeDeck
          stack={stack}
          onSwipe={handleSwipe}
          enterFrom={
            restored &&
            restored.id === active.id &&
            restored.deckSlug === activeDeckSlug &&
            restored.filter === genderFilter
              ? restored.from
              : undefined
          }
        />
      </View>
      <View style={styles.footer}>{canUndo ? <UndoButton onPress={handleUndo} /> : null}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  deckArea: {
    flex: 1,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  footer: {
    height: spacing['4xl'] + spacing.xl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
