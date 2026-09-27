import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckActions } from '@/components/DeckActions';
import { DeckHeader } from '@/components/DeckHeader';
import { EmptyState } from '@/components/EmptyState';
import { SwipeDeck, type SwipeDeckHandle, type SwipeDirection } from '@/components/SwipeDeck';
import { useTabBarClearance } from '@/components/TabBar';
import { Wash } from '@/components/ui/Wash';
import { deckProgress, getDeckStack } from '@/data/deckUtils';
import { decks } from '@/data/decks';
import type { Name } from '@/data/types';
import type { SurfacePalette } from '@/design/chrome';
import { PaletteProvider } from '@/design/PaletteContext';
import { swatchFor, swatchForDeck } from '@/design/swatches';
import { space, withAlpha } from '@/design/tokens';
import { useScheme } from '@/design/useScheme';
import { t } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useDeckStore } from '@/store/useDeckStore';
import { useLibraryStore } from '@/store/useLibraryStore';

const UNDO_VISIBLE_MS = 5000;

export default function SwipeScreen() {
  const router = useRouter();
  const { dark, chrome } = useScheme();
  const clearance = useTabBarClearance();
  const deckRef = useRef<SwipeDeckHandle>(null);

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
  const active = stack[0];

  // La pantalla entera se tiñe con el color de la card activa: el fondo se
  // lava con su swatch y el texto de chrome toma su tinta (pasa AA sobre el
  // lavado; lo verifica scripts/check-design.mjs).
  const activeScheme = active ? swatchFor(active.id)[dark ? 'dark' : 'light'] : null;
  const surface: SurfacePalette = activeScheme
    ? {
        bg: activeScheme.card.bg,
        ink: activeScheme.card.ink,
        inkMuted: activeScheme.card.inkMuted,
        fill: withAlpha(activeScheme.card.ink, 0.12),
      }
    : chrome;
  const wash = activeScheme ? activeScheme.wash : chrome.wash;
  const washId = `${active ? swatchFor(active.id).id : 'chrome'}-${dark ? 'dark' : 'light'}`;

  // Deshacer se deshabilita pasados ~5 s de inactividad.
  useEffect(() => {
    if (!canUndo) return;
    const timer = setTimeout(hideUndo, UNDO_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [canUndo, swiped.length, hideUndo]);

  const handleSwipe = (name: Name, liked: boolean) => {
    if (liked) haptic.like();
    else haptic.pass();
    swipe(name.id, liked);
    setRestored(null);
  };

  const handleUndo = () => {
    const record = undo();
    if (!record) return;
    haptic.undo();
    setRestored({
      id: record.nameId,
      from: record.liked ? 'right' : 'left',
      deckSlug: activeDeckSlug,
      filter: genderFilter,
    });
  };

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
    <View style={styles.screen}>
      <Wash wash={wash} id={washId} />
      <PaletteProvider palette={surface}>
        <SafeAreaView edges={['top']} style={[styles.screen, { paddingBottom: clearance }]}>
          <DeckHeader
            deckTitle={deckTitle}
            deckSwatch={swatchForDeck(activeDeckSlug)}
            filterLabel={
              genderFilter === 'all' ? t('library.filter.all') : t(`gender.${genderFilter}`)
            }
            seen={progress.seen}
            total={progress.total}
            onPress={() => router.push('/decks')}
          />
          {active ? (
            <>
              <View style={styles.deckArea}>
                <SwipeDeck
                  ref={deckRef}
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
              <DeckActions
                cardId={active.id}
                canUndo={canUndo}
                onPass={() => deckRef.current?.swipe('left')}
                onUndo={handleUndo}
                onLike={() => deckRef.current?.swipe('right')}
              />
            </>
          ) : (
            <EmptyState
              title={empty.title}
              subtitle={empty.subtitle}
              ctaLabel={empty.ctaLabel}
              onPress={empty.onPress}
            />
          )}
        </SafeAreaView>
      </PaletteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  deckArea: {
    flex: 1,
    marginHorizontal: space.xl,
    marginTop: space.xl,
  },
});
