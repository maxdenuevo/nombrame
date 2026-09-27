import { useRouter } from 'expo-router';

import { CardFan } from '@/components/CardFan';
import { OnboardingStep } from '@/components/OnboardingStep';
import { Button } from '@/components/ui/Button';
import type { GenderFilter } from '@/data/types';
import { t } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';

// Qué nombres quiere ver la persona, no el sexo del bebé. Quien ya lo sabe
// puede querer ver todo, y hay familias que no asignan género antes de nacer.
// Deja el filtro de género puesto desde el primer nombre. Sin rosa ni celeste.
export default function GenderStep() {
  const router = useRouter();
  const complete = useOnboardingStore((s) => s.complete);
  const setGenderFilter = useLibraryStore((s) => s.setGenderFilter);

  const choose = (filter: GenderFilter) => {
    haptic.select();
    setGenderFilter(filter);
    router.push('/onboarding/surnames');
  };

  return (
    <OnboardingStep
      step={3}
      swatch="uva"
      title={t('onboarding.gender.title')}
      body={t('onboarding.gender.body')}
      hero={<CardFan />}
      onSkip={complete}
      actions={
        <>
          <Button variant="glass" label={t('onboarding.gender.girl')} onPress={() => choose('f')} />
          <Button variant="glass" label={t('onboarding.gender.boy')} onPress={() => choose('m')} />
          <Button label={t('onboarding.gender.all')} onPress={() => choose('all')} />
        </>
      }
    />
  );
}
