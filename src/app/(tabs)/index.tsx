import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { SwipeDeck, type SwipeDirection } from '@/components/SwipeDeck';
import { UndoButton } from '@/components/UndoButton';
import { names } from '@/data/names';
import type { Name } from '@/data/types';
import { t } from '@/i18n';
import { useDeckStore } from '@/store/useDeckStore';
import { spacing } from '@/theme/tokens';

const UNDO_VISIBLE_MS = 5000;

export default function SwipeScreen() {
  const router = useRouter();
  const swiped = useDeckStore((s) => s.swiped);
  const canUndo = useDeckStore((s) => s.canUndo);
  const swipe = useDeckStore((s) => s.swipe);
  const undo = useDeckStore((s) => s.undo);
  const hideUndo = useDeckStore((s) => s.hideUndo);

  // Card restaurada por deshacer: vuelve a entrar desde el lado por el que salió.
  const [restored, setRestored] = useState<{ id: string; from: SwipeDirection } | null>(null);

  const stack = useMemo(() => {
    const done = new Set(swiped.map((r) => r.nameId));
    return names.filter((n) => !done.has(n.id));
  }, [swiped]);

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
      setRestored({ id: record.nameId, from: record.liked ? 'right' : 'left' });
    }
  };

  if (stack.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState
          title={t('deck.exhausted.title')}
          subtitle={t('deck.exhausted.subtitle')}
          ctaLabel={t('deck.exhausted.ctaFavorites')}
          onPress={() => router.navigate('/favoritos')}
        />
      </SafeAreaView>
    );
  }

  const active = stack[0];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.deckArea}>
        <SwipeDeck
          stack={stack}
          onSwipe={handleSwipe}
          enterFrom={restored && restored.id === active.id ? restored.from : undefined}
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
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  footer: {
    height: spacing['4xl'] + spacing.xl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
