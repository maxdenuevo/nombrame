import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { t } from '@/i18n';

// Sin pareja vinculada todavía: la vinculación llega con el backend (Supabase).
export default function MatchesScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <EmptyState
        title={t('matches.noCouple.title')}
        subtitle={t('matches.noCouple.subtitle')}
        ctaLabel={t('matches.noCouple.cta')}
        onPress={() => Alert.alert(t('matches.noCouple.comingSoon'))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
