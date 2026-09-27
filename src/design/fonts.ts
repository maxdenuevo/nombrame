// Import por peso: el índice del paquete hace `require` de las 16 variantes y
// las metería todas en el bundle.
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Nunito_900Black } from '@expo-google-fonts/nunito/900Black';

/** Para `useFonts` en el layout raíz. Las claves coinciden con `font` de tokens.ts. */
export const fontAssets = { Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black };
