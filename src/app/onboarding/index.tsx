import { useRouter } from 'expo-router';

import { CardFan } from '@/components/CardFan';
import { OnboardingStep } from '@/components/OnboardingStep';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function WelcomeStep() {
  const router = useRouter();
  const complete = useOnboardingStore((s) => s.complete);
  return (
    <OnboardingStep
      step={1}
      swatch="mandarina"
      title={t('onboarding.welcome.title')}
      body={t('onboarding.welcome.body')}
      hero={<CardFan size="lg" />}
      onSkip={complete}
      actions={
        <Button
          label={t('onboarding.welcome.cta')}
          onPress={() => router.push('/onboarding/swipe')}
        />
      }
    />
  );
}
