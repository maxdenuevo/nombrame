import { CardFan } from '@/components/CardFan';
import { OnboardingStep } from '@/components/OnboardingStep';
import { Button } from '@/components/ui/Button';
import type { GenderFilter } from '@/data/types';
import { t } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';

// Último paso: si ya saben el sexo del bebé, el filtro de género queda puesto
// desde el primer nombre. Las tres opciones pesan lo mismo (sin rosa ni celeste).
export default function GenderStep() {
  const complete = useOnboardingStore((s) => s.complete);
  const setGenderFilter = useLibraryStore((s) => s.setGenderFilter);

  // Completar hace que el gate del layout raíz lleve al deck.
  const choose = (filter: GenderFilter) => {
    haptic.select();
    setGenderFilter(filter);
    complete();
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
          <Button label={t('onboarding.gender.unknown')} onPress={() => choose('all')} />
        </>
      }
    />
  );
}
