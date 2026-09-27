import { useRouter } from 'expo-router';

import { OnboardingStep } from '@/components/OnboardingStep';
import { SwipeDemo } from '@/components/SwipeDemo';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function SwipeStep() {
  const router = useRouter();
  const complete = useOnboardingStore((s) => s.complete);
  return (
    <OnboardingStep
      step={2}
      swatch="cielo"
      title={t('onboarding.swipe.title')}
      body={t('onboarding.swipe.body')}
      hero={<SwipeDemo />}
      onSkip={complete}
      actions={
        <Button
          label={t('onboarding.swipe.cta')}
          onPress={() => router.push('/onboarding/gender')}
        />
      }
    />
  );
}
