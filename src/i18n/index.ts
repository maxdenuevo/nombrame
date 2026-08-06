import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import es from './es';

// Al lanzar solo existe español, pero todo el copy pasa por claves de traducción
// desde el inicio (ver CLAUDE.md, "Idioma y contenido").
export const i18n = new I18n({ es });

i18n.defaultLocale = 'es';
i18n.enableFallback = true;
i18n.locale = getLocales()[0]?.languageCode ?? 'es';

export const t = i18n.t.bind(i18n);
