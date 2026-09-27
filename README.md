# nombra.me

App móvil tipo "swipe" para que las parejas elijan de a dos el nombre de su
bebé. Cada persona desliza nombres — izquierda es paso, derecha es me gusta —
y cuando coinciden en un nombre, es un **match**. También hay un modo
individual para armar una lista de favoritos.

## Stack

React Native + Expo (SDK 57) · TypeScript · Expo Router · Zustand ·
TanStack Query · Reanimated · Supabase (Postgres + Auth + Realtime).

## Desarrollo

```bash
npm install
npx expo start        # dev server — escanear el QR con Expo Go
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
```

## Estado

El deck de swipe, los favoritos y el sistema de diseño funcionan con un
catálogo local (`src/data/names.ts`). El backend todavía no está conectado:
el schema vive en `supabase/migrations/` y se aplica cuando exista el
proyecto de Supabase. Matches, vinculación de pareja y push llegan con eso.

## Documentación

- [`CLAUDE.md`](./CLAUDE.md) — cómo se construye: stack, modelo de datos,
  convenciones, estado actual.
- [`DESIGN.md`](./DESIGN.md) — cómo se ve y se siente: color, tipografía,
  componentes, movimiento, voz.
