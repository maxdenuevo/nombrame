# Fuentes y criterio editorial del catálogo

El catálogo (`names.ts`) y los decks (`decks.ts`) son la fuente de verdad hasta
que exista el proyecto de Supabase. El SQL de seed se genera con
`node scripts/generate-seed.mjs` — nunca editarlo a mano.

## Decks

### Top 100 Chile (`top-chile`)

Top 50 de niñas + top 50 de niños más inscritos en Chile, intercalados por
posición (el filtro de género de la app los separa en dos top 50 limpios).
Construido con dos fuentes, ambas del Registro Civil:

- **Posiciones 1–10 de cada sexo:** ranking oficial de inscripciones **2025**,
  anunciado en enero de 2026. Transcrito de la cobertura del anuncio:
  [Cooperativa, 08-01-2026](https://www.cooperativa.cl/noticias/pais/poblacion/registro-civil-revela-los-nombres-mas-inscritos-en-chile-durante-2025/2026-01-08/152231.html)
  (capturado el 11-08-2026).
- **Posiciones 11–50 de cada sexo:** dataset abierto
  [guaguas](https://github.com/rivaquiroga/guaguas) (datos del Registro Civil
  vía Portal de Transparencia, 1920–2021; archivo `data-raw/1920-2021.csv`,
  capturado el 11-08-2026). Se tomó el ranking **2021** (último año disponible)
  por número de inscripciones, excluyendo los nombres ya presentes en el top 10
  de 2025 y la variante duplicada "Mia" (ya está `Mía`).
- **Mezcla de años asumida y divulgada:** el top 10 es 2025; el resto, 2021.
  Cuando el Registro Civil publique (o se consiga por transparencia) el listado
  completo 2025+, reemplazar las posiciones 11–50 y actualizar esta nota. El
  Portal de Datos oficial (`estadisticas.sed.srcei.cl`) no respondía al
  momento de la captura.

### Griegos (`griegos`)

- **Criterio:** nombres de etimología griega documentada, de uso corriente en
  el mundo hispanohablante. Candidatos generados por `origin = 'Griego'` y
  curados a mano; etimologías estándar (Sofía = sabiduría, Nicolás = victoria
  del pueblo, etc.).

### Clásicos latinos (`clasicos-latinos`)

- **Criterio:** nombres de raíz latina (`origin = 'Latino'`) de uso vigente en
  Chile/LatAm, curados a mano. Excluye latinos del catálogo que hoy suenan
  más a apellido o a devoción que a nombre de pila contemporáneo.

### Cortos y sonoros (`cortos-y-sonoros`)

- **Criterio:** ≤ 5 letras, pronunciables igual en español e inglés, sin
  diminutivo posible. Curado a mano.

## Significados y orígenes

Los campos `origin` y `meaning` son curaduría propia sobre etimologías
estándar, redactados en español neutro y en tono cálido (no académico). El
`meaning` es una glosa, no una traducción literal. Casos discutidos (etimología
debatida; se eligió la lectura más difundida): Leonor (occitano), Samantha
(arameo), Amaro (latino, glosa popular de _amare_), Diego (vía Santiago),
Pascal (femenino en Chile según los datos de inscripción).

## Estado de la expansión

- **Lote 1** (24 nombres): seed inicial de desarrollo.
- **Lote 2** (13): nombres del top 10 2025 que faltaban.
- **Lote 3** (15): tanda griega para el deck Griegos.
- **Lote 4** (65): resto del top 50 por sexo (guaguas 2021).
- **Total: 117 nombres.**
- **Pendiente:** seguir hacia ~250 (más orígenes — mapuche, vasco, árabe —,
  más decks temáticos) y QA de contenido (tildes, largos de meaning en la
  card). Es trabajo de curaduría humana, ~40-50 nombres/día con calidad.
