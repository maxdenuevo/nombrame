import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/TabBar';
import { t } from '@/i18n';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: t('tabs.swipe') }} />
      <Tabs.Screen name="favoritos" options={{ title: t('tabs.favorites') }} />
      <Tabs.Screen name="matches" options={{ title: t('tabs.matches') }} />
    </Tabs>
  );
}
