# DESIGN.md — nombra.me

Sistema de diseño para la app. Complementa a `CLAUDE.md`: aquí vive el **cómo se ve
y se siente**, allá el **cómo se construye**.

> **Procedencia.** La _arquitectura_ del sistema —capas primitivos → semántico →
> componentes, rampas de 9 pasos, jerarquía de superficies y texto al estilo de
> los semantic colors de UIKit, escala de espaciado, radios grandes con curvas
> concéntricas, material translúcido— viene de un sistema portado de
> [Folium](https://github.com/folium-app/Folium) y AntiqueKit. Los _valores_ son
> de nombra.me: porcelana lavanda, ciruela, coral y violeta, Fraunces y Figtree.
> No se portaron las paletas crudas de Folium (11 escalas no uniformes, con
> `purple`/`violet` duplicadas), sus fondos blanco/negro puros, su tint azul ni
> su tipografía del sistema.

## 1. Principios

1. **El nombre es el héroe.** Cada pantalla existe para mostrar nombres. La UI
   alrededor es silenciosa: neutra, pequeña, fuera del camino. Si un elemento
   compite visualmente con el nombre, se achica o se elimina.
2. **Dos colores, una historia.** Cada miembro de la pareja tiene un color propio.
   El match es el degradado de ambos. El gradiente **solo** aparece cuando hubo
   coincidencia — nunca como decoración genérica.
3. **Sin rosa/celeste.** El género del nombre se comunica con etiquetas y filtros,
   nunca con código de color rosado/celeste. Es una decisión de producto, no solo
   estética.
4. **Una sola celebración.** La animación grande vive en el momento del match.
   Única excepción: el reveal de matches retroactivos al vincularse — que es,
   en el fondo, el mismo momento (matches que recién se descubren), no una
   celebración nueva. Todo lo demás es física sutil (swipe, press, transición)
   de menos de 300 ms.
5. **Android es primera clase.** El público objetivo es mayoritariamente Android.
   Sombras = `elevation` real, ripple nativo en botones, probar en pantallas
   pequeñas y densidades bajas.

## 2. Color

El sistema tiene dos capas. **Rampas** (primitivos, en `tokens.ts`) y **semánticos**
(en `theme.ts`). Los componentes solo consumen semánticos, vía `useTheme()`. Si un
componente necesita un color que no está en la capa semántica, la pregunta no es
qué hex poner sino qué token falta.

### Rampas

Cada color de marca es una escala de **9 pasos**, del más claro (100) al más
oscuro (900). La regla que las define:

> **El paso 500 es el color de modo claro y el 300 el de modo oscuro.**

Los pasos intermedios se interpolaron en **OKLCH** conservando el hue, no en RGB
lineal — así el salto de luminosidad entre pasos es parejo y las rampas sirven de
verdad para tintes y fondos suaves.

| Rampa     | 100       | 300 (oscuro) | 500 (claro) | 700       | 900       |
| --------- | --------- | ------------ | ----------- | --------- | --------- |
| `coral`   | `#FEF0EE` | `#FF8378`    | `#FF6F61`   | `#AF4239` | `#651814` |
| `violet`  | `#F2F2FF` | `#8577EC`    | `#6C5CE7`   | `#4E42AC` | `#322975` |
| `success` | `#DEFCEB` | `#3BB07E`    | `#2E9E6B`   | `#166F49` | `#034429` |
| `danger`  | `#FEEFEF` | `#E0606B`    | `#D64550`   | `#9C2D36` | `#66161E` |
| `warning` | `#FFF1DE` | `#F0B75C`    | `#E8A33D`   | `#9A660E` | `#4E3102` |

La rampa **neutra** tiene 10 pasos, no 9: a diferencia de una rampa de color tiene
que cubrir desde el texto hasta el fondo más profundo, y en oscuro eso son cuatro
superficies apiladas más cinco niveles de texto.

- `neutral.light`: `#FFFFFF · #F7F6F9 · #EFEDF3 · #E6E2EC · #CFC9D6 · #B9B3C2 · #8E8799 · #6E6478 · #453C50 · #2B2233`
- `neutral.dark`: `#F2EFF6 · #D5CEDE · #A79DB3 · #8A7F97 · #7A7284 · #574E64 · #352D40 · #2C2536 · #221C2B · #17131D`

Las rampas crudas **solo** se usan para definir semánticos o para tintes
deliberados (`shade('coral', 700)`). Nunca directo en un componente.

### Semánticos

| Token                            | Claro      | Oscuro     | Uso                                                                  |
| -------------------------------- | ---------- | ---------- | -------------------------------------------------------------------- |
| `background`                     | `#F7F6F9`  | `#17131D`  | Fondo de pantalla (porcelana fría, tinte lavanda)                    |
| `surfaceSunken`                  | `#EFEDF3`  | `#17131D`  | Superficie hundida sobre el fondo                                    |
| `surface`                        | `#FFFFFF`  | `#221C2B`  | Cards, sheets, filas                                                 |
| `surfaceElevated`                | `#FFFFFF`  | `#2C2536`  | Lo que se lee "por encima"                                           |
| `label`                          | `#2B2233`  | `#F2EFF6`  | Texto principal (ciruela-carbón, no negro puro)                      |
| `labelSecondary`                 | `#6E6478`  | `#A79DB3`  | Texto secundario, metadatos                                          |
| `labelTertiary`                  | 30%        | 30%        | Texto desactivado                                                    |
| `labelQuaternary`                | 18%        | 16%        | Texto apenas presente                                                |
| `placeholder`                    | `#B9B3C2`  | `#8A7F97`  | Texto de sugerencia en inputs                                        |
| `separator`                      | `#E6E2EC`  | `#352D40`  | Bordes, divisores                                                    |
| `separatorOpaque`                | `#CFC9D6`  | `#574E64`  | Divisor sobre superficie translúcida                                 |
| `fill`                           | 10% neutro | 14% neutro | Chips, inputs, superficies inertes                                   |
| `tint`                           | `#FF6F61`  | `#FF8378`  | Acento: íconos, tabs, bordes activos                                 |
| `tintSolid`                      | `#D6584C`  | `#FF8378`  | Relleno de acento **con texto encima**                               |
| `onTintSolid`                    | `#FFFFFF`  | `#17131D`  | El texto que va sobre `tintSolid`                                    |
| `success` / `danger` / `warning` | 500        | 300        | Estado                                                               |
| `pass`                           | `#B9B3C2`  | `#7A7284`  | Swipe a la izquierda (neutro apagado, no rojo: pasar no es un error) |

**Nunca usar `#FFF` ni `#000` puros como fondo.** El acento de acción es coral, no
el azul del sistema.

### Colores de identidad

| Token                | Claro                           | Oscuro    | Significado                                            |
| -------------------- | ------------------------------- | --------- | ------------------------------------------------------ |
| `partnerA` (coral)   | `#FF6F61`                       | `#FF8378` | La persona usuaria. Sus likes, su lista, su lado.      |
| `partnerB` (violeta) | `#6C5CE7`                       | `#8577EC` | Su pareja. Presencia de la pareja en la UI.            |
| `match`              | gradiente `partnerA → partnerB` | igual     | Solo para matches. Badge, pantalla de match, contador. |

Reglas:

- El gradiente de match va siempre en diagonal (135°), coral arriba-izquierda.
- Nunca usar el gradiente en botones genéricos, fondos ni onboarding "porque se ve
  bonito". Su valor es que significa algo.
- `partnerA`/`partnerB` **no son colores de texto ni de relleno de control.**
  Alimentan el gradiente y las marcas de "de quién es esto". Para un control con
  texto encima va `tintSolid`.
- Para fondos suaves usar los pasos 100–200 de la rampa, o un tinte al 10–12%.

### Accesibilidad de color

- Texto sobre `background`/`surface`: mínimo AA (4.5:1). `label` y `labelSecondary`
  ya cumplen.
- **Coral no es un color de texto.** `coral.500` sobre el fondo claro da 2.5:1 y
  blanco sobre coral da 2.73:1 — ninguno pasa AA ni AA Large. Por eso existe el
  par `tintSolid`/`onTintSolid`, que la capa semántica resuelve distinto en cada
  modo: en claro, relleno oscuro (`coral.600`) con texto blanco (3.92:1, pasa AA
  Large); en oscuro, relleno claro (`coral.300`) con texto ciruela (7.64:1, pasa
  AA completo). Si hace falta coral como texto, `coral.700` da 5.3:1.
- Nunca comunicar estado solo con color (ej. like/pass llevan ícono además de tinte).

## 3. Tipografía

| Rol         | Fuente                                           | Dónde                                               |
| ----------- | ------------------------------------------------ | --------------------------------------------------- |
| Display     | **Fraunces** (via `@expo-google-fonts/fraunces`) | Los nombres, títulos de pantalla, número de matches |
| UI / cuerpo | **Figtree** (via `@expo-google-fonts/figtree`)   | Todo lo demás: botones, párrafos, etiquetas         |

Por qué: Fraunces en tamaños grandes tiene calidez humana sin ser infantil — un
nombre en Fraunces se siente como un nombre, no como un dato. Figtree es geométrica
amable, rinde muy bien en español (tildes, ñ) y en pantallas Android de baja densidad.

### Escala

Nunca se escribe un tamaño de fuente a mano: se pide un **rol**.

| Rol        | Fuente / peso                               | Tamaño / interlínea | Cap de escalado | Uso                                   |
| ---------- | ------------------------------------------- | ------------------- | --------------- | ------------------------------------- |
| `nameXl`   | Fraunces SemiBold                           | 44 / 48             | 1.3×            | El nombre en la card de swipe         |
| `title`    | Fraunces SemiBold                           | 28 / 34             | 1.3×            | Títulos de pantalla ("Tus matches")   |
| `heading`  | Figtree SemiBold                            | 20 / 26             | 1.6×            | Secciones, nombre en listas           |
| `body`     | Figtree Regular                             | 16 / 24             | 1.6×            | Texto general                         |
| `caption`  | Figtree Medium                              | 13 / 18             | 1.6×            | Metadatos (origen, significado corto) |
| `overline` | Figtree SemiBold, tracking +0.6, mayúsculas | 11 / 14             | 1.4×            | Etiquetas y chips                     |

Reglas:

- Fraunces se reserva para nombres y títulos. Si aparece en un botón o un párrafo,
  está mal usada.
- El rol se llama `overline`, no `label`: `label` es el token semántico de color
  del texto principal, y tenerlos con el mismo nombre confundía.
- El font scale del sistema puede llegar a 2× o más. Cada rol declara su cap en
  `maxScaleFor` (`tokens.ts`) y `AppText` lo aplica solo: los roles de display
  viven en layouts rígidos y se acotan al 1.3× que la app se compromete a
  soportar. **Nunca usar `allowFontScaling={false}`.**
- **Splash screen hasta que las fuentes estén listas.** El nombre en Fraunces es
  el elemento más importante de la app — no puede haber un salto visible de
  fuente del sistema a Fraunces apenas carga. Mantener el splash screen nativo
  (`expo-splash-screen`) visible hasta que `useFonts` confirme que Fraunces y
  Figtree terminaron de cargar, recién ahí ocultarlo.

## 4. Espaciado, forma y elevación

### Espaciado

No es una grilla de 4 ni de 8. La escala viene del sistema portado de Folium,
derivada de sus constraints reales:

| Token | px     | Uso                                                                               |
| ----- | ------ | --------------------------------------------------------------------------------- |
| `xs`  | 4      | Separación dentro de un ícono con etiqueta; el aro entre card exterior e interior |
| `sm`  | 6      |                                                                                   |
| `md`  | 8      | Entre chips                                                                       |
| `lg`  | 12     | Entre título y subtítulo; separador de filas                                      |
| `xl`  | **20** | **Por defecto.** Márgenes de pantalla, separación entre secciones                 |
| `2xl` | 26     | Padding de cards, controles flotantes                                             |
| `3xl` | 30     |                                                                                   |
| `4xl` | 46     | Respiro vertical grande                                                           |

Ante la duda, `xl`. Si un layout necesita un valor que no está en la tabla,
primero probar el token vecino; si de verdad no alcanza, la pregunta es si falta
un token, no qué número escribir.

### Forma

Radios grandes: es la firma visual del sistema.

| Token       | px  | Uso                                              |
| ----------- | --- | ------------------------------------------------ |
| `row`       | 20  | Filas de lista                                   |
| `control`   | 32  | Botones, inputs                                  |
| `panel`     | 38  | Contenedores de pantalla completa, hojas modales |
| `cardOuter` | 40  | Contenedor de la card de swipe                   |
| `cardInner` | 36  | Interior de la card                              |
| `pill`      | 999 | Chips, badges, botones circulares                |

- **Regla de anidamiento:** el radio interior es el exterior menos el padding
  entre ambos. De ahí el par 40/36 con `xs` (4) de separación: las curvas quedan
  concéntricas en vez de tangentes. Si se cambia uno, se cambia el otro.
- Todo contenedor con radio lleva `continuousCurve` (`borderCurve: 'continuous'`),
  que da la curva squircle en iOS. Android dibuja arco circular y no hay
  equivalente nativo; la diferencia se nota en radios de 40.
- `row` es un token propio, no viene de Folium: sus radios están calibrados para
  cards de ~300 px y sobre una fila de ~60 px la convierten en píldora.
- La card de swipe es el objeto más redondeado de la app; nada la supera.

### Elevación

Dos niveles nada más. El sistema original no usa sombras porque el material las
reemplaza, pero acá el material cae a color sólido en Android — y Android es el
público mayoritario, así que sin sombra las capas se pierden.

- `raised` (filas de lista, botón de deshacer): sombra suave / `elevation: 2`.
- `floating` (card activa del deck, modal de match): `elevation: 8`.
- **Modo oscuro:** `elevation` nativo casi no se ve sobre fondos oscuros en
  Android — no depender solo de la sombra. Complementar con un borde de 1 pt en
  `separator` y usar `surfaceElevated` (más claro que `surface`) para que la card
  se lea como "por encima".
- La sombra va en un contenedor **sin** `overflow: 'hidden'`: iOS no dibuja
  sombra sobre una vista recortada. De ahí el envoltorio extra en `NameCard` y
  `UndoButton`.

Touch targets mínimos: **48×48** (estándar Android; cubre también el 44 de iOS).

### Material

Superficie translúcida, vía el componente `Material`. Concentra en un solo lugar
la bifurcación de plataforma:

- **iOS:** `BlurView` de `expo-blur` con `tint="systemMaterial"`, intensidad 50.
- **Android:** color sólido casi opaco (`material.androidFallback`). El blur ahí
  es experimental y caro, y Android es el público mayoritario.

`overflow: 'hidden'` es obligatorio en el contenedor: sin eso el radio no recorta
el blur (ya lo aplica `Material`).

**Solo tiene sentido donde hay algo detrás que difuminar.** Sobre un fondo plano
el blur cuesta GPU y no se ve. Hoy se usa en:

- La card activa del deck — el marco de 4 pt difumina la card siguiente, que se
  asoma detrás con escala 0.96.
- El botón de deshacer, que flota sobre el deck en movimiento.

**Diferido:** el tab bar. Para que sea translúcido tiene que estar posicionado
absoluto y las pantallas compensar con insets desde `useBottomTabBarHeight`, que
en Expo Router 57 solo se alcanza por una ruta interna (`expo-router/build/…`).
No vale acoplar la app a un path privado por un efecto que en Android cae a
sólido igual. Queda en `surface`.

## 5. Componentes clave

### NameCard (la card de swipe)

Es el componente de referencia del sistema. Estructura concéntrica:

```
┌─ contenedor  radius 40 (cardOuter), material, padding 4 (xs)
│  ┌─ interior radius 36 (cardInner), surface opaca
│  │  nameXl        label          ← el nombre, centrado
│  │  gap 20 (xl)
│  │  body          labelSecondary ← el significado
│  │  gap 26 (2xl)
│  │  overline ×2   chips de origen y género
│  └─
└─  elevación `floating`, en un envoltorio sin overflow hidden
```

- El marco de 4 pt es lo único translúcido: difumina la card siguiente, que se
  asoma detrás. El interior es opaco para que el nombre no compita con nada.
- En oscuro el interior usa `surfaceElevated`, no `surface`.
- **Auto-shrink:** nombres largos ("Maximiliano", "Guadalupe") o font scale del
  sistema alto (hasta el 1.3× que soportamos) no deben desbordar ni cortarse.
  Usar `adjustsFontSizeToFit` con `minimumFontScale` (RN) para que `nameXl`
  reduzca su tamaño hasta un piso de **32 pt** antes de cualquier otra medida.
  Si aun al piso no entra en una línea, permitir wrap a dos líneas (mismo
  `lineHeight` proporcional) en vez de truncar con "…" — un nombre nunca se
  corta. **Validar esto en Android real la primera semana:**
  `adjustsFontSizeToFit` en Android tiene quirks conocidos (exige
  `numberOfLines`, a veces mide mal con fuentes custom como Fraunces); es la
  pieza central de la card y no puede descubrirse rota al final.
- Al arrastrar: la card rota levemente (máx ±8°) y aparece un tinte de borde —
  coral al 12% hacia la derecha (me gusta), `pass` al 12% hacia la izquierda.
  Con ícono además del color.
- Debajo de la activa se asoma la siguiente card (escala 0.96, opacidad 0.7).

### Deshacer swipe

- Botón circular pequeño (ícono de flecha hacia atrás), esquina inferior
  izquierda del deck, `surface` con `elevation: raised`. Solo deshace el
  **último** swipe (un nivel, no historial completo).
- Al presionar: la card anterior vuelve a entrar desde donde salió (misma
  física de spring, en reversa) y vuelve a ser la card activa. El registro en
  `swipes` correspondiente se elimina; si aún estaba en la cola offline sin
  enviarse, simplemente se cancela de la cola.
- Si el swipe deshecho había generado un match, el match se **soft-borra**
  (`deleted_at`), no se elimina. El push a la pareja sale con una ventana de
  gracia de ~3–5 s (ver CLAUDE.md, "Notificaciones de match"): deshacer dentro
  de esa ventana significa que la pareja nunca se entera. Si la pareja tenía la
  app abierta y alcanzó a ver el match por Realtime, el evento de soft-delete
  lo quita de su lista — sin animación ni disculpa, simplemente ya no está.
- El botón solo aparece si hay algo que deshacer (no en la primera card del
  deck) y desaparece automáticamente después de deslizar una card nueva sin
  deshacer, o pasado ~5 s de inactividad — no queda como un control permanente
  que compita con el nombre.

### Botones

- **Primario:** fondo `tintSolid`, texto `onTintSolid`, radio `control` (32),
  Figtree SemiBold 16. Ojo: **no** es `partnerA` — coral a plena saturación con
  texto encima no llega al contraste mínimo (ver §2, Accesibilidad de color).
  Con `minHeight: 48`, el radio 32 se recorta a 24 y el botón se lee como
  píldora; es intencional.
- **Secundario:** borde `separator`, texto `label`.
- **Fantasma:** solo texto, para acciones terciarias.
- Ripple nativo en Android; opacidad 0.7 en press en iOS.
- El gradiente de match **no** es un estilo de botón.

### Chips / etiquetas

- Radio `pill`, texto `overline`. Por defecto el fondo es `fill` (neutro); con
  un `tint` explícito, ese color al 10%.
- Género: `Niña`, `Niño`, `Neutro` — misma jerarquía visual, sin colores
  estereotipados: van con el `fill` neutro.

### MatchModal (el momento firma)

- Pantalla completa, fondo con el gradiente de match.
- El nombre en Fraunces, blanco, tamaño máximo que quepa.
- Texto: "¡A ambos les gustó **Emilia**!" — específico, con el nombre, nunca un
  genérico "¡Es un match!".
- Animación: una sola secuencia orquestada (~1.2 s): el gradiente entra, el nombre
  escala con spring, confeti sutil en coral y violeta. Después, quietud.
- **Confeti: custom, sin librería externa.** Se prefiere reducir dependencias
  antes que sumar una librería de partículas solo para esto. Implementar como un
  puñado (12–20) de vistas pequeñas (círculo/rectángulo) animadas con
  Reanimated — posición y rotación iniciales aleatorias, caída con física simple
  (`withTiming` o `withSpring` + gravedad manual), fade-out al final. Nada de
  Lottie ni motores de partículas para un efecto de ~1.2 s.
- Acciones: "Ver mis matches" (primario invertido: blanco sobre gradiente) y
  "Seguir deslizando" (fantasma blanco).

### Vinculación con matches retroactivos

- Al vincularse la pareja, el backfill (ver CLAUDE.md) puede encontrar
  coincidencias entre los likes que cada quien juntó en modo individual.
- **Si hay matches:** pantalla de reveal con el gradiente de match — es un match
  legítimo, no decoración. Texto: "¡Ya tienen **N** matches!" y la lista de
  nombres en Fraunces. Es la segunda (y única otra) aparición de la celebración
  grande, y puede ser el mejor primer momento de la app: recompensa inmediata
  por haber usado el modo individual.
- **Si no hay:** nada de pantalla vacía ceremonial — pasar directo al deck con
  el estado normal de "sin matches aún".

### Listas (favoritos, matches)

- Filas de `surface` con radio `row` (20), nombre en `heading`, metadatos en
  `caption`. En oscuro, `surfaceElevated` con borde `separator`.
- En la lista de matches, un hilo de gradiente de 3 pt en el borde izquierdo de
  cada fila: la marca del match, discreta.

### Estados vacíos

- Ilustración mínima o solo tipografía. Siempre con acción:
  - Sin matches aún: "Todavía no coinciden. Sigan deslizando — el nombre anda por ahí."
    - botón "Deslizar nombres".
  - Sin pareja vinculada: "nombra.me funciona de a dos." + botón "Invitar a tu pareja".
  - Catálogo agotado (ya deslizaron todos los nombres disponibles): "Ya viste
    todos los nombres que tenemos por ahora. Vuelve más adelante por más."
    - botón "Ver mis favoritos" (o "Ver mis matches" si ya hay alguno). Sin
      ilustración de error — es un fin natural, no una falla.

## 6. Movimiento

| Momento                | Duración                      | Curva                     |
| ---------------------- | ----------------------------- | ------------------------- |
| Press de botón         | 100 ms                        | ease-out                  |
| Swipe (soltar card)    | física de spring (Reanimated) | —                         |
| Transición de pantalla | 250 ms                        | estándar de la plataforma |
| MatchModal             | ~1200 ms, una sola vez        | secuencia orquestada      |

Reglas:

- Todo con Reanimated en el hilo de UI; nada de animar con estado de React.
- Respetar "reducir movimiento" del sistema: el MatchModal pasa a un fade simple
  con el gradiente estático. La celebración se comunica igual, sin confeti.

## 7. Voz y microcopy

- **Español, tuteo, cálido y directo.** Nada de voseo, nada de corporativo.
- A la pareja se le habla en plural cuando la acción es de ambos: "Sigan deslizando",
  "A ambos les gustó".
- Específico gana a genérico: incluir el nombre en los mensajes siempre que se pueda.
- Los errores dicen qué pasó y qué hacer, sin disculpas vagas:
  - Bien: "No pudimos guardar tu like. Revisa tu conexión e intenta de nuevo."
  - Mal: "¡Ups! Algo salió mal."
- Los botones nombran la acción exacta: "Invitar a tu pareja", no "Continuar".
- Sin emojis en la UI (el gradiente y la tipografía ya ponen la emoción).

## 8. Tokens en código

Tres capas, y cada una tiene un solo consumidor legítimo:

```
src/theme/
  tokens.ts    primitivos: rampas, spacing, radius, type, material, elevation
               → lo consume theme.ts (los colores) y los componentes (el resto)
  theme.ts     capa semántica: schemes.light / schemes.dark
               → lo consume useTheme
  useTheme.ts  hook: { colors, dark }
               → lo consumen los componentes
```

**La regla base:** ningún componente escribe un color, un tamaño de fuente, un
radio o un espaciado literal. Si un valor no está en los tokens, la pregunta no es
qué número poner sino si falta el token.

- Los componentes **nunca** importan `brand` ni `neutral`. Los colores llegan por
  `useTheme()`.
- `spacing`, `radius`, `type`, `elevation` y `continuousCurve` no tienen variante
  de esquema, así que se importan directo de `tokens.ts`.

```ts
import { radius, spacing, continuousCurve } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const { colors, dark } = useTheme();

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.cardOuter,
    ...continuousCurve,
    padding: spacing.xs,
  },
});
```

Y en tipografía, siempre por rol, nunca por tamaño:

```tsx
<AppText variant="nameXl">Emilia</AppText>
<AppText variant="caption" tone="secondary">Latín · rival</AppText>
```

## 9. Qué NO hacer

- No usar rosa/celeste para género.
- No usar el gradiente de match como decoración general.
- No mezclar Fraunces en textos de UI ni Figtree en los nombres protagonistas.
- No agregar celebraciones fuera del match (nada de confeti al hacer login).
- No usar negro `#000` ni blanco `#FFF` como fondo de pantalla: siempre
  `background` y `label` de la paleta.
- No introducir un tercer color de acento. Si algo necesita destacar y no es de
  nadie ni de ambos, probablemente no necesita destacar.
- No usar `partnerA`/`partnerB` como relleno de un control con texto encima: para
  eso está `tintSolid`.
- No poner material donde no hay nada detrás que difuminar.
