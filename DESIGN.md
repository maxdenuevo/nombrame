# DESIGN.md — nombra.me

Sistema de diseño de la app. Complementa a `CLAUDE.md`: aquí vive el **cómo se ve
y se siente**, allá el **cómo se construye**.

> **Procedencia.** Rediseñado de cero en septiembre de 2026. Se exploraron tres
> variantes (Sticker, Gomita, Malla) y se eligió **Malla**: gradientes de malla,
> vidrio esmerilado y Nunito Black, con el onboarding de
> [Folium](https://github.com/folium-app/Folium) (su OnboardingKit) como
> referencia. En oscuro, las cards son profundas, no vívidas.

## 1. Principios

1. **Cada nombre tiene su color.** El color es del nombre, no de la app: su card,
   su fila en favoritos y su match comparten el mismo swatch. La interfaz
   alrededor es neutra para que los nombres se luzcan.
2. **Juguetón, no infantil.** Tipografía redonda y gruesa, botones gorditos,
   física con rebote. Todo se aplasta al tocarlo y vuelve con resorte.
3. **El color nunca dice género.** El swatch sale de un hash del nombre, sin
   relación con si es de niña o niño. Nada de rosa para niñas ni celeste para
   niños: el género se comunica con texto.
4. **Contraste AA siempre.** Todo par de texto sobre color pasa 4.5:1, en claro
   y en oscuro. No se juzga a ojo: lo verifica `npm run check:design`.
5. **Android es primera clase.** El público es mayoritariamente Android. Nada
   depende del blur: el vidrio cae a translúcido y la malla es gradiente nativo.
6. **La malla es para los momentos.** El gradiente vivo aparece en el
   onboarding y el match. En el día a día, el color vive en las cards.

## 2. Color

### Swatches: el color de cada nombre

Diez familias en `src/design/swatches.ts`: tomate, mandarina, mango, lima,
menta, turquesa, cielo, lavanda, uva y chicle. Cada una tiene variante clara y
oscura, con cuatro piezas:

| Pieza    | Qué es                                                 | Dónde                            |
| -------- | ------------------------------------------------------ | -------------------------------- |
| `card`   | `bg`, `ink`, `inkMuted`, `fill` y 4 `blobs` de esquina | Card, cover de deck, fila, chips |
| `wash`   | Base casi blanca (o casi negra) y 3 blobs suaves       | Fondo del deck con esa card      |
| `mesh`   | Base y 4 blobs vivos                                   | Onboarding, match                |
| `shadow` | Color de la sombra teñida (negro en oscuro)            | Bajo la card y los covers        |

**Asignación:** `swatchFor(slug)` = FNV-1a de `"<sal>:<slug>"` módulo 10.

- Se usa el **slug**, nunca el UUID. El slug es igual en todos los
  dispositivos, así que los dos miembros de la pareja ven el mismo color.
- **La sal (`SWATCH_SALT`) se congela al lanzar.** Cambiarla recolorea todo
  el catálogo.
- Los decks también tienen color: `swatchForDeck(slug)`. El color se repite
  en su cover y en la pill del header del deck.
- Con 10 colores, alrededor de 1 de cada 13 cards repite el color de la
  anterior. Es inherente al hash y no se corrige: la card siguiente se ve
  distinta igual, por el nombre y el desplazamiento del stack.

**Receta.** Los valores se generaron en OKLCH, con el mismo tono por familia, y
están resueltos a hex en el archivo:

| Rol             | Claro         | Oscuro        |
| --------------- | ------------- | ------------- |
| `card.bg`       | L .86 · C .13 | L .46 · C .12 |
| `card.ink`      | L .29         | L .97         |
| `card.inkMuted` | L .42         | L .88         |
| `card.blobs`    | L .77 – .91   | L .35 – .50   |

Para agregar o ajustar una familia, se regeneran sus valores con la misma
receta y se corre `npm run check:design`. Si un blob no pasa AA contra la
tinta, se baja su luminosidad; nunca se aclara la tinta.

### Chrome: la app neutra

`src/design/chrome.ts` define la paleta de lo que no es de ningún nombre:
fondos sin card, títulos, biblioteca y tab bar.

| Token      | Claro                                         | Oscuro    |
| ---------- | --------------------------------------------- | --------- |
| `bg`       | `#F6F4FA`                                     | `#131118` |
| `ink`      | `#231F2B`                                     | `#F4F1F8` |
| `inkMuted` | `#5E5670`                                     | `#ABA3B8` |
| `wash`     | 3 blobs: uva, cielo, mango al 60 % sobre `bg` |           |

**En el deck, el chrome toma la tinta de la card activa.** La pantalla se lava
con el `wash` de ese swatch y el header y los botones usan su `ink`. Al pasar
de card, el lavado se funde en 360 ms.

### Paleta de superficie

Un componente no recibe colores por props: los pide con `usePalette()`, que
devuelve la paleta de la superficie más cercana. Una card declara la suya con
`PaletteProvider`; fuera de cualquier card, rige el chrome. Así el mismo
`Chip`, `Text` o `Button` funciona dentro de cualquier color.

- `Text tone="ink" | "muted"`: no hay tono terciario. El único texto de bajo
  contraste es el deshabilitado.
- **Botón sólido = paleta invertida:** fondo `ink` y texto `bg`. Tiene el mismo
  contraste que el texto normal, en cualquier swatch y en ambos esquemas.

## 3. Tipografía

Una sola familia, **Nunito**, en tres pesos: 700, 800 y 900 (Black). Se importa
por peso (`src/design/fonts.ts`): el índice del paquete cargaría las 16
variantes.

| Rol        | Peso | Tamaño / interlínea  | Uso                             |
| ---------- | ---- | -------------------- | ------------------------------- |
| `nameXl`   | 900  | 72 / 78, −1          | El nombre en la card            |
| `title`    | 900  | 34 / 40, −0.5        | Títulos de pantalla, onboarding |
| `name`     | 900  | 24 / 30              | Nombre en filas y covers        |
| `heading`  | 900  | 20 / 26              | Secciones, sellos               |
| `body`     | 700  | 17 / 24              | Texto corrido, significados     |
| `label`    | 900  | 17 / 22              | Botones                         |
| `caption`  | 800  | 13 / 18              | Metadatos, progreso             |
| `overline` | 900  | 12 / 16, +1.2, MAYÚS | Chips                           |

- **El nombre nunca se trunca.** `fitFontSize` (`src/design/fitText.ts`) calcula el
  tamaño para que la palabra más larga quepa, con un piso de 44. Los nombres
  compuestos pasan a dos líneas. Es determinista: no depende de
  `adjustsFontSizeToFit`, que no existe en web y en Android mide mal con
  fuentes propias.
- Cada rol tiene su cap de font scale (`maxScaleFor`). Nunca usar
  `allowFontScaling={false}`.
- El splash sigue visible hasta que Nunito y los íconos cargaron, y hasta que
  los stores persistidos se hidrataron.

## 4. Espaciado, forma, sombra y vidrio

**Espaciado:** grilla de 4, con estos tokens:

| Token | xs  | sm  | md  | lg  | xl  | 2xl | 3xl | 4xl |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- |
| px    | 4   | 8   | 12  | 16  | 20  | 24  | 32  | 48  |

Ante la duda, `xl`, que es el margen de pantalla.

**Radios:** grandes y blandos. La card es lo más redondo de la app.

| Token | pill | row | cover | card | panel |
| ----- | ---- | --- | ----- | ---- | ----- |
| px    | 999  | 28  | 32    | 42   | 44    |

**Sombra:** es `boxShadow` teñida del color de la superficie. `shadow.card` va
bajo la card de swipe y `shadow.soft` bajo covers y mini cards. En oscuro la
sombra es negra.

**Vidrio (`Glass`):** una sola bifurcación de plataforma.

- **iOS 26+:** Liquid Glass nativo (`GlassView` de expo-glass-effect).
- **Web:** `backdropFilter`.
- **Android, iOS anterior y "reducir transparencia":** relleno translúcido
  más opaco con borde fino. En Android el blur es caro, y Android es el
  público mayoritario.

Se usa en pills del header, botones secundarios, el significado en la card,
el control segmentado y el tab bar.

**Regla del vidrio:** el vidrio de iOS desaparece si él o un padre tiene
`opacity: 0`. Sus entradas se animan con escala o posición, nunca con fade.

**Malla (`MeshBackdrop`):** un color base y 4 blobs de `radial-gradient`. React
Native 0.86 los dibuja de forma nativa con `experimental_backgroundImage`, y
`gradientStyle()` usa `backgroundImage` en web.

- Los blobs derivan lento, en períodos de 7, 9, 11 y 13 s. Solo se anima
  `transform`, en el hilo de UI.
- La malla se pausa fuera de foco y con "reducir movimiento".
- Cada blob se funde al mismo color con alfa 0, nunca a `transparent`, que
  deja bordes grises en nativo.

## 5. Movimiento y háptica

| Resorte  | damping / stiffness | Uso                              |
| -------- | ------------------- | -------------------------------- |
| `snappy` | 20 / 320            | Presionar (escala a 0.94)        |
| `bouncy` | 11 / 240            | Soltar, volver al centro, "pop"  |
| `gentle` | 18 / 150            | Reingreso de la card al deshacer |

- **`Squish`** es el feedback táctil de toda la app, igual en iOS y Android:
  aplasta al presionar y rebota al soltar.
- **La salida de la card dura 220 ms.** Su callback solo registra el swipe si
  `finished`: Reanimated lo vuelve a llamar con `false` al desmontar la card.
- **Todo corre con Reanimated en el hilo de UI.** Para volver a JS se usa
  `scheduleOnRN` (react-native-worklets). `runOnJS` está deprecado.
- **"Reducir movimiento":** la malla y la demo del onboarding quedan quietas.

**Háptica** (`src/lib/haptics.ts`): cada evento tiene su sensación. Android usa
`performAndroidHapticsAsync`, que no necesita el permiso VIBRATE. iOS usa
impact, selection y notification. En web no hace nada.

| Evento                    | Android         | iOS                  |
| ------------------------- | --------------- | -------------------- |
| La card cruza el umbral   | `Segment_Tick`  | selection            |
| Me gusta                  | `Confirm`       | impact medium        |
| Paso                      | `Gesture_End`   | impact light         |
| Deshacer                  | `Context_Click` | impact soft          |
| Elegir filtro, deck o tab | `Segment_Tick`  | selection            |
| Match                     | `Confirm`       | notification success |

## 6. Componentes

Primitivos en `src/components/ui/`, piezas de producto en `src/components/`.

### NameCard y SwipeDeck

- **La card** es el mesh de su swatch: `bg` con 4 blobs en las esquinas, que
  dejan el centro limpio para el nombre.
  - Arriba van los chips de origen y género.
  - Al centro, el nombre en `nameXl`.
  - Si la persona configuró apellidos, debajo va el nombre completo
    ("Leonor Muñoz Soto") en `heading` y tinta suave. Siempre visible, sin
    tap: lo que se evalúa es cómo suena todo junto, de un vistazo. Nunca se
    trunca; si el nombre es compuesto, el nombre grande baja a `nameXlMin`
    para que ambos quepan en 360×640.
  - Abajo, el significado en un panel de vidrio.
  - Todo lo de adentro toma su tinta del swatch.
- **La card siguiente** se asoma detrás, a escala 0.94, desplazada 12 px y con
  opacidad 0.75. Es invisible para el lector de pantalla.
- **Al arrastrar** aparecen los sellos "Me gusta" o "Paso": una pill de tinta
  con ícono, inclinada 14°.
  - La card rota como máximo 10°.
  - Al cruzar el umbral, que es el 30 % del ancho, suena un tick háptico.
- **Accesibilidad:** la card es un elemento con etiqueta completa (nombre,
  origen, género y significado) y acciones `like` y `pass`. Con VoiceOver o
  TalkBack se decide sin gesto.
- **`SwipeDeck` expone `swipe(dir)`** para los botones. Una card que ya sale
  no acepta otro swipe.

### DeckActions

- **Paso:** 72, vidrio.
- **Deshacer:** 48, vidrio.
- **Me gusta:** 72, tinta sólida.

Los tres toman la paleta de la card activa. Con cada card nueva hacen "pop".
Deshacer no desaparece: queda deshabilitado pasados 5 s, o si no hay nada que
deshacer.

### DeckHeader

- **Pill del deck:** un punto con el color del deck, su nombre y un chevron.
- **Pill del filtro de género.**
- **Barra de progreso:** muestra "12 de 100" y se anuncia completa.

Ambas pills abren la biblioteca.

### Biblioteca

- **Arriba:** título y botón de cerrar, y debajo el filtro de género como
  control segmentado.
- **"Probar con apellidos":** dos campos (primer y segundo apellido; el
  segundo es opcional) y un botón para invertir el orden. Se guardan al
  escribir; borrar ambos apaga el nombre completo.
- **"Todos los nombres":** va en un cover ancho.
- **Grilla de dos columnas:** primero "Tus decks" y después "Descubrir". Cada
  cover va en el color de su deck.
- **Tocar un cover lo activa y lo agrega:** un solo toque.
- **El deck activo** lleva el badge "Activo" con ícono de check. El estado
  nunca se comunica solo con color.

### Listas

`NameRow` es una fila en el color del nombre, con el nombre en `name`, el
significado en `caption` y el origen en un chip. Con apellidos configurados,
los apellidos siguen al nombre en `heading` y tinta suave, y la fila puede
pasar a dos líneas. Favoritos muestra primero lo
último que te gustó, con el conteo junto al título.

### Tab bar

Pill de vidrio flotante:

- **La pestaña activa** es una pill de tinta con ícono relleno y nombre.
- **Las demás** muestran solo el ícono de contorno.

Las pantallas compensan su alto con `useTabBarClearance()`.

### Estados vacíos

`CardFan` muestra tres nombres reales del catálogo en abanico, cada uno en su
color. Debajo van el mensaje y siempre una acción. Es un fin natural o un
comienzo, nunca un error.

### Onboarding

Cuatro pasos con la estructura de Folium:

- **Fondo:** malla viva de una familia de color, con una capa esmerilada
  encima.
- **Contenido:** ilustración grande, título bold centrado, una línea de texto
  y la acción al pie.
- **Arriba:** puntos de progreso y "Saltar".

| Paso                      | Familia   | Acción                                    |
| ------------------------- | --------- | ----------------------------------------- |
| Elijan el nombre de a dos | mandarina | Empezar                                   |
| Desliza para decidir      | cielo     | Entendido (con card demo que se balancea) |
| ¿Qué nombres quieres ver? | uva       | De niña / De niño / Todos → filtro        |
| ¿Cómo suena con apellido? | menta     | Apellidos opcionales → nombre completo    |

- **El gate** usa `Stack.Protected` en el layout raíz: se muestra hasta que la
  persona termina el último paso o salta.
- **El paso de apellidos** es opt-in. La ilustración es una MiniCard de Leonor
  que muestra el nombre completo a medida que se escribe. Tiene un solo botón
  que cambia: "Ahora no" con los campos vacíos, "Ver con apellidos" con algo
  escrito (en 360×640 no caben dos). Con el teclado abierto se esconden la
  ilustración y el texto.
- **Alto de la ilustración:** 34 % del alto de pantalla, con tope de 288. Si
  con font scale alto igual no cabe, el paso scrollea.
- **Invitar a la pareja** no es un paso todavía: llega con el backend.

### MatchModal (spec, sin implementar: requiere backend)

- **Fondo:** pantalla completa con `MeshBackdrop` en la familia del nombre que
  hizo match. El color del nombre llega hasta su celebración.
- **Contenido:** la card del nombre en vidrio y "¡Tú y Cami eligieron
  **Emilia**!", con el nombre de la pareja. Específico, nunca "¡Es un
  match!", y sin género gramatical (ver §7).
- **Animación:** una sola secuencia de ~1.2 s con confeti de 12–20 vistas de
  Reanimated en los colores del swatch, sin librería. Suena `haptic.success`.
- **Acciones:** "Ver matches" (sólido) y "Seguir deslizando" (vidrio).
- **Con "reducir movimiento":** malla quieta y fade simple, sin confeti.
- **Reveal retroactivo al vincularse:** el mismo lenguaje, con "¡Ya tienen
  **N** matches!" y la lista de nombres.

## 7. Voz y microcopy

- **Registro:** español, tuteo, cálido y directo. Nada de voseo ni de tono
  corporativo.
- **Plural para la pareja:** se usa cuando la acción es de las dos
  personas, como "Sigan deslizando" o "Coincidieron en Emilia".
- **Específico gana a genérico:** incluir el nombre siempre que se pueda.
- **Los errores dicen qué pasó y qué hacer.** Por ejemplo: "No pudimos
  guardar tu like. Revisa tu conexión e intenta de nuevo."
- **Los botones nombran la acción exacta:** "Invitar a tu pareja", no
  "Continuar".
- **Sin emojis en la UI:** el color y la tipografía ya ponen la emoción.
- **Todo pasa por i18n** (`src/i18n/es.ts`), incluidas las etiquetas de
  accesibilidad.

### Lenguaje inclusivo

La app no sabe (ni pregunta) el género de quien la usa ni el de su pareja:
pueden ser dos mujeres, dos hombres o personas no binarias.

- **Reescribir, no marcar.** Se arma la frase para que no haya adjetivo con
  género, en vez de usar x, @ o e: los lectores de pantalla las leen mal y a un
  público amplio le chocan.

  | Evitar                             | Preferir                             |
  | ---------------------------------- | ------------------------------------ |
  | juntos, cada uno, los dos, ambos   | de a dos, cada persona, coincidieron |
  | ¿Estás listo? · Bienvenido         | ¿Empezamos? · Te damos la bienvenida |
  | mamá y papá · tu esposo, tu esposa | tu pareja · tu familia               |
  | ¡A ambos les gustó Emilia!         | ¡Tú y Cami eligieron Emilia!         |

- **A la pareja se le dice por su nombre,** nunca por pronombre ni por rol:
  "A Cami también le gustó", no "A ella también".
- **"Pareja" no presupone nada:** ni romance ni dos géneros. Es la persona con
  quien se elige.
- **"El nombre" antes que "tu bebé".** Buscar un nombre no siempre es esperar
  una guagua: hay adopciones de niñas y niños más grandes, y personas trans o
  no binarias que eligen el propio. El copy habla del nombre; "bebé" o "guagua"
  solo donde no haya alternativa.
- **El modo individual es de primera clase.** Los matches son de a dos, los
  favoritos no: nada de "la app funciona solo en pareja".

### Temas sensibles

- **Pérdida gestacional.** Entre un 10 y un 20 % de los embarazos confirmados
  terminan en pérdida, y la app no se entera. Por eso:
  - No hay push de reenganche ("¿Ya eligieron?", "¡Sigan deslizando!"). El
    único push es el de match.
  - No hay cuenta regresiva a la fecha de parto ni "semana X".
  - Pausar las notificaciones o borrar la cuenta se hace en pocos toques y sin
    pedir motivo.
- **Desvincular** es neutro y sin culpa: "Desvincular", nunca "terminar" ni
  "romper", y la confirmación nombra a la persona ("¿Desvincularte de Cami?")
  sin reproche. Antes de confirmar se explica qué se conserva (los favoritos
  de cada persona) y qué se pierde (los matches). La otra persona no recibe un
  aviso alegre.
- **Push discretos.** La pantalla bloqueada la ve cualquiera: el push nunca
  lleva el nombre de la pareja. Detalle en `CLAUDE.md`, "Notificaciones de
  match".
- **Tu nombre lo eliges tú.** El nombre que da Google o Apple puede ser uno que
  la persona ya no usa, y es el que ve su pareja. Al entrar por primera vez se
  pregunta "¿Cómo quieres que te llamemos?", con el primer nombre del
  proveedor como sugerencia editable.
- **Significados sin estereotipos de género.** Si la etimología no lo dice, no
  se agrega ("pura", "del hogar" o "la que sirve" como adorno); si hay dos
  lecturas, se elige la que no encasilla. Criterio completo en
  `src/data/SOURCES.md`.
- **Tienda y marketing:** "para familias" o "en pareja", nunca "para mamá y
  papá". Las capturas muestran nombres de niña, de niño y unisex; si aparecen
  personas, las parejas son diversas.

## 8. Marca

- **La marca** es una card de vidrio inclinada −8° con una "n" en Nunito Black,
  sobre una malla con un color de cada familia principal.
- **El ícono de iOS** es opaco y sin esquinas.
- **El adaptive icon de Android** tiene malla de fondo y la card translúcida
  dentro del círculo seguro. El monocromo es la misma forma en blanco.
- **El splash** es la card con malla propia sobre `chrome.bg`.
- **El wordmark en la app** es texto en Nunito Black, no una imagen.

Los PNG se generan con `node scripts/brand/render.mjs`, que usa Chrome headless
con la fuente embebida. `npm run check:design` verifica sus tamaños y que el
ícono de iOS no tenga alfa.

## 9. Tokens en código

```
src/design/
  swatches.ts        los 10 swatches, la sal y el hash (sin imports: lo lee el script)
  chrome.ts          paleta neutra, vidrio, WASH_ALPHA (sin imports)
  tokens.ts          space, radius, font, type, maxScaleFor, motion, shadow, withAlpha
  fonts.ts           Nunito por peso, para useFonts
  fitText.ts         fitFontSize: nombres que nunca se truncan
  gradient.ts        gradientStyle, blob, meshStyle
  PaletteContext.tsx PaletteProvider / usePalette
  useScheme.ts       useScheme() → { dark, chrome }; useSwatchScheme(swatch)
src/lib/haptics.ts   háptica por evento
scripts/check-design.mjs   AA de todos los pares, distribución del hash, PNG de marca
```

**La regla base:** ningún componente escribe un color, tamaño, radio o
espaciado literal. Si falta un valor, falta un token.

## 10. Qué NO hacer

- No asignar color por género, ni a mano: el color de un nombre es su hash.
- No darle género gramatical a quien usa la app (ni con x, @ o e), ni asumir
  que la pareja es un hombre y una mujer. Ver §7.
- No poner el nombre de la pareja en un push.
- No aclarar la tinta para "arreglar" un contraste: se oscurece el fondo o el
  blob, y se corre el chequeo.
- No usar la malla viva como fondo del día a día: es para onboarding y match.
- No depender del blur: todo debe verse bien con el fallback translúcido de
  Android.
- No animar con `opacity` un padre de `Glass`.
- No importar el índice de `@expo-google-fonts/nunito`.
- No cambiar `SWATCH_SALT` después de lanzar.
- No agregar un color de acento de la app: el color es de los nombres.
