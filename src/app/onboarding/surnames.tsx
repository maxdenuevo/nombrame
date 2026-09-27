import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { MiniCard } from '@/components/MiniCard';
import { OnboardingStep } from '@/components/OnboardingStep';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { names } from '@/data/names';
import { t } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { formatSurnames, useSurnamesStore } from '@/store/useSurnamesStore';

// Nombre de muestra para la vista previa: uno que volvió de hace 100 años.
const PREVIEW = names.find((n) => n.id === 'leonor') ?? names[0];

// Último paso, opcional: apellidos para ver cada nombre completo en la card.
// Se guardan solo al confirmar; "Ahora no" y "Saltar" terminan sin guardar.
// Se pueden cambiar o borrar después en la biblioteca.
export default function SurnamesStep() {
  const complete = useOnboardingStore((s) => s.complete);
  const setSurnames = useSurnamesStore((s) => s.setSurnames);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const secondRef = useRef<TextInput>(null);
  const surnames = formatSurnames(first, second);

  const confirm = () => {
    if (!surnames) return;
    haptic.select();
    setSurnames(first, second);
    complete();
  };

  return (
    <OnboardingStep
      step={4}
      swatch="menta"
      title={t('onboarding.surnames.title')}
      body={t('onboarding.surnames.body')}
      hero={
        <MiniCard
          name={PREVIEW}
          size="lg"
          subtitle={surnames ? `${PREVIEW.name} ${surnames}` : null}
        />
      }
      onSkip={complete}
      actions={
        <>
          <TextField
            value={first}
            onChangeText={setFirst}
            placeholder={t('surnames.first')}
            accessibilityLabel={t('surnames.first')}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => secondRef.current?.focus()}
          />
          <TextField
            ref={secondRef}
            value={second}
            onChangeText={setSecond}
            placeholder={t('surnames.secondOptional')}
            accessibilityLabel={t('surnames.second')}
            autoCapitalize="words"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="done"
            onSubmitEditing={confirm}
          />
          {/* Un solo botón que cambia: sin apellidos es "Ahora no" y termina sin
              guardar; con apellidos confirma. En 360×640 no caben dos. */}
          {surnames ? (
            <Button label={t('onboarding.surnames.cta')} onPress={confirm} />
          ) : (
            <Button variant="glass" label={t('onboarding.surnames.later')} onPress={complete} />
          )}
        </>
      }
    />
  );
}
