# nombra.me

App móvil tipo "swipe" para que las parejas encuentren juntos el nombre de su bebé.
Cada persona desliza nombres (izquierda = paso, derecha = me gusta). Cuando ambos
dan like al mismo nombre, se genera un **match**. También existe un modo individual
para armar una lista de favoritos.

## Stack

- **App:** React Native + Expo (SDK 57, RN 0.86), Expo Router para navegación
  (file-based). El template trae New Architecture, React Compiler y typedRoutes
  activados. Antes de escribir código con APIs de Expo, ver `AGENTS.md` (apunta
  a los docs versionados de SDK 57).
- **Lenguaje:** TypeScript (strict)
- **Estado de UI / local:** Zustand
- **Estado de servidor / data fetching:** TanStack Query (React Query)
- **Swipe cards (gestos + animación):** react-native-reanimated 4 +
  react-native-gesture-handler. Mutar shared values con `.get()`/`.set()`, no
  con `.value =` — el lint del React Compiler lo exige.
- **Material translúcido:** expo-blur, siempre a través del componente
  `Material` (blur en iOS, sólido en Android). Ver DESIGN.md §4.
- **Backend:** Supabase (Postgres + Auth + Realtime + Row Level Security)
- **Auth:** Google + Apple vía Supabase Auth. Al ofrecer social login, Apple exige
  Sign in with Apple en iOS (política de App Store) — no es opcional. Ambos
  proveedores requieren configuración nativa (no funcionan en Expo Go; usar
  development build).
- **Push:** Expo Notifications. El envío server-side lo hace una Edge Function de
  Supabase (ver "Notificaciones de match") — la única pieza de backend activo
  además de los triggers de Postgres.
- **Builds y OTA:** EAS Build + EAS Update

> Decisión de plataforma: cross-platform (no iOS-first nativo). El público objetivo
> es LatAm, donde Android es mayoritario. Priorizar que la app se sienta bien en
> Android, no solo en el simulador de iOS.

## Idioma y contenido

- **Español primero.** Todo el copy visible va en español neutro (ligeramente chileno
  donde tenga sentido). Inglés solo en código y comentarios técnicos.
- Preparar i18n con claves de traducción desde el inicio, aunque al lanzar solo exista
  español. Nunca hardcodear strings visibles en los componentes.
- El catálogo de nombres es acotado y casi estático. **No usar Algolia** salvo que
  aparezca una necesidad real de búsqueda difusa/multilingüe. Búsqueda por prefijo o
  full-text de Postgres, o filtrado en cliente, es suficiente.

## Modelo de datos (referencia)

- `users`: perfil básico, ligado a Supabase Auth. Guarda además su(s) token(s) de
  Expo Push para las notificaciones de match.
- `couples`: vincula a dos usuarios mediante un código de invitación. Relación 1:1
  (una pareja, dos miembros, sin reemplazo automático). Existe un flujo de
  **desvincular**: al disolver la pareja, los swipes de cada persona se conservan
  (son de la persona) y los matches se soft-borran (son de la pareja). Al crear
  una pareja se ejecuta el **backfill** de matches retroactivos (ver `matches`).
  Se contempla más adelante un acceso de **solo lectura** para terceros (ej. un
  familiar que quiere ver la lista de matches sin poder swipear ni influir en
  ella) — dejar la puerta abierta en RLS, pero no implementarlo todavía.
- `names`: catálogo (nombre, género, origen, significado). Semi-estático; se puede
  seedear/bundlear.
- `swipes`: `(user_id, name_id, liked)`. Un registro por swipe. **Sin
  `couple_id`**: los likes son de la persona, no de la pareja. Así los swipes del
  modo individual valen para el backfill al vincularse, y sobreviven a una
  desvinculación. El trigger de matches resuelve la pareja activa por membresía
  en `couples`.
- `matches`: **tabla real**, mantenida por un trigger/función en Postgres que
  inserta el registro cuando ambos miembros de la pareja tienen `liked = true`
  sobre el mismo `name_id`. Se prefiere sobre una vista computada porque
  necesitamos suscribirnos a ella con Supabase Realtime para notificar el match;
  una tabla materializada es más simple de escuchar que una vista derivada.
  Nada de esta lógica vive en el cliente. Detalles:
  - **Soft delete:** los matches nunca se borran con DELETE; se marcan con
    `deleted_at`. Lo usan el "deshacer swipe" (revierte el match dentro de la
    ventana de gracia del push) y la desvinculación de la pareja. Toda query y
    suscripción filtra `deleted_at IS NULL`.
  - **Backfill retroactivo:** al crearse una pareja, una función compara los
    likes previos de ambos (hechos en modo individual o en parejas anteriores) y
    genera los matches existentes de una vez. El trigger por INSERT solo cubre
    los swipes futuros; sin backfill, los likes previos no coincidirían nunca.

## Notificaciones de match

Dos canales, según el estado de la app de quien recibe:

- **App abierta:** suscripción de Supabase Realtime a los matches propios
  (INSERT y soft-delete). Esta misma suscripción es la que le avisa a **quien
  hizo el swipe** que hubo match — su INSERT a `swipes` no devuelve el match, no
  hace falta consultar después de cada swipe.
- **App cerrada:** Realtime no llega (requiere conexión abierta). Una Edge
  Function de Supabase, disparada por webhook sobre el INSERT en `matches`,
  envía el push vía la API de Expo. Antes de enviar espera la **ventana de
  gracia** (~3–5 s) y re-verifica que el match siga con `deleted_at IS NULL`:
  si el swipe se deshizo en esa ventana, el push nunca sale y la pareja no ve
  un match fantasma.

## Estructura y estado actual

```
src/app/            pantallas (Expo Router): (tabs)/index = deck, favoritos, matches
src/components/     SwipeDeck, NameCard, UndoButton, AppText, AppButton, Chip, Material, …
src/theme/          tokens.ts (primitivos) → theme.ts (semántico) → useTheme
src/i18n/           claves de traducción (solo es por ahora)
src/data/names.ts   catálogo local TEMPORAL (muere cuando se conecte Supabase)
src/store/          useDeckStore (Zustand): swipes en memoria, deshacer de un nivel
supabase/migrations schema completo, SIN APLICAR (no existe el proyecto aún)
```

Funciona hoy: deck de swipe con catálogo local, favoritos, estados vacíos,
modo claro/oscuro, splash hasta cargar fuentes. **Pendiente:** proyecto de
Supabase (aplicar migraciones), auth Google/Apple, wiring de TanStack Query
(hoy el provider existe pero nadie lo usa), vinculación de pareja, MatchModal,
Edge Function de push, persistencia local de swipes.

## Convenciones de código

- TypeScript strict. Evitar `any`; si es inevitable, comentar por qué.
- Componentes funcionales + hooks. Un componente por archivo.
- Archivos de componentes en PascalCase; hooks en `useCamelCase`.
- Estado de servidor **siempre** vía TanStack Query (nada de `fetch` suelto dentro de
  componentes). Estado de UI vía Zustand.
- Nunca guardar tokens ni credenciales en AsyncStorage. Usar `expo-secure-store`.
- Sin secretos en el repo. Variables de entorno de Expo; usar el prefijo
  `EXPO_PUBLIC_` solo para lo que puede ser realmente público.
- Formateo con Prettier + ESLint (config del repo). Correr lint y typecheck antes de
  commitear.

## Comandos

```bash
npm install                  # instalar dependencias
npx expo start               # dev server (Expo Go / dev build)
npm run lint                 # ESLint (expo lint)
npm run typecheck            # tsc --noEmit
npx prettier --write .       # formateo
```

- **Node va vía nvm** (Node 24 LTS). Si `node` no aparece en PATH en una shell
  no interactiva: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"`.
- **EAS todavía no está configurado** (no hay `eas.json`); agregar cuando
  toquen los primeros builds nativos.
- Verificación rápida sin dispositivo: `npx expo export --platform android`
  confirma que el bundle compila; para ver la app, `npx expo start` y Chrome
  headless contra `http://localhost:8081` (ancho mínimo real de ventana
  headless: ~500 px — capturas más angostas salen recortadas, no es un bug).

## Decisiones diferidas (a propósito)

Estas cosas se dejan fuera por ahora, no por olvido. Revisitar cuando el contexto
cambie:

- **Testing:** sin estrategia de tests todavía. Estamos en fase de planificación;
  definir esto (unit, e2e, o ninguno) antes de que el código crezca demasiado.
- **Observabilidad (Sentry o similar):** no hace falta para la escala inicial.
  Es una bazooka para un problema de tamaño matamoscas. Revisitar si crece la
  base de usuarios o empiezan a llegar reportes de bugs que no se pueden
  reproducir.
- **Pre-commit hooks (husky, lint-staged):** no son necesarios mientras el único
  dev sea quien escribe esto. Si se suma alguien más al equipo, agregar.

## Cosas a cuidar

- **Privacidad de swipes:** los likes de una persona no deben ser visibles a su pareja
  hasta que haya match. Reforzar con Row Level Security en Postgres, no solo en el
  cliente.
- **Swipes offline-first:** swipear es en ráfaga y el público está en redes
  irregulares — un INSERT sincrónico por swipe que bloquee el deck se siente
  horrible en 3G. Escritura optimista con cola de reintentos (mutations de
  TanStack Query); el deck nunca espera al servidor. Deshacer un swipe que aún
  no se envió = cancelarlo de la cola, no un DELETE.
- **Realtime con moderación:** usar suscripciones de Supabase solo donde aportan
  (notificar un match). No convertir toda la app en tiempo real.
- **New Architecture:** Expo SDK 55+ trae la New Architecture por defecto. Antes de
  sumar una librería nativa, verificar compatibilidad con `npx expo-doctor`.
- **Android importa:** el público (LatAm/Chile) es mayoritariamente Android. Probar en
  dispositivo/emulador Android de verdad, no asumir paridad con iOS.
