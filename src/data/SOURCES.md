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

### Clásicos chilenos (`clasicos-chilenos`)

- **Criterio:** nombres que estuvieron entre los 150 más inscritos de Chile
  en 1990–1999 y siguen entre los 250 más inscritos en 2012–2021: dos
  generaciones de uso. Se excluyen los que ya están en el Top 100 Chile.
  Fuente: [guaguas](https://github.com/rivaquiroga/guaguas), capturado el
  27-09-2026.
- **Una grafía por nombre, la más inscrita:** Cristian (no Christian),
  Cristopher (no Christopher). Las otras grafías siguen en el catálogo si
  vienen de otro deck.
- **Sin filtro de gusto:** Kevin, Jonathan, Jean o Génesis entran igual que
  Francisco o Javier. Dejarlos fuera sería un juicio de clase, no de datos.
- **Hay menos clásicos de niña** (19 de 63): los nombres de niña cambian más
  rápido, y los clásicos que siguen vigentes (Catalina, Javiera, Francisca…)
  ya están en el Top 100. El orden intercala niñas y niños por inscripciones
  2012–2021; al acabarse las niñas, siguen los niños.
- **No califican (todavía):** Emilio y Paz, muy inscritos hoy pero poco usados
  en los 90. Están en Clásicos latinos.
- **Significados discutidos:** Gustavo ("bastón de los godos" es la lectura
  más difundida; también se lo deriva del eslavo), Óscar (irlandés, "amigo de
  los ciervos", o germánico, "lanza de los dioses") y César (etimología
  incierta: se muestra el título). Claudia y Claudio dicen "De la familia
  romana Claudia": la glosa anterior de Claudia ("De paso firme y pausado")
  contradecía la raíz (_claudus_, "cojo").

### Hace 100 años (`hace-cien-anos`)

- **Criterio:** nombres de abuelas y abuelos. Se comparan tres generaciones
  en guaguas, como proporción de los nacimientos de cada sexo: la de los
  abuelos (1930–1965), la de los papás (1980–2004) y la de hoy (2015–2021).
  Entran los que en 1930–1965 eran ≥ 1 ‰ de su sexo y en 1980–2004 cayeron a
  menos del 40 % de eso: así quedan fuera los "nombres de mamá" (Sandra,
  Jacqueline, Marisol), que siguieron fuertes hasta los 90. De ese grupo se
  curó una selección. Capturado el 27-09-2026.
- **Tres grupos, en este orden:**
  - _Ya volvieron_: hoy duplican con creces su uso de 1980–2004 (Leonor,
    Amelia, Matilde, Aurora, Domingo, Augusto, Pascual).
  - _Asoman_: siguen casi desaparecidos, pero su proporción de 2019–2021
    supera en un 30 % la de 2010–2014 (Zulema, Aurelio, Flora, Gladys). Son
    números chicos: es la señal con más ruido.
  - _Dormidos_: el resto (Rosa, Olga, Hilda, Uberlinda, Segundo, Rigoberto).
- **Imprescindibles editoriales**, que abren el deck: Ofelia, Wenceslao,
  Cordelia, Enrique, Patricia y Ximena. Patricia y Ximena son más de la
  generación de los papás, y Cordelia casi no se inscribió en Chile: entran
  por decisión editorial, no por datos.
- **Tono:** Uberlinda o Zunilda pueden causar risa, pero fueron las abuelas
  reales de muchas familias. El deck los presenta con cariño, no como chiste.
- **Significados** (27-09-2026, Behind the Name y Wiktionary; Tibón no estaba
  accesible). Casos especiales:
  - _Sin etimología confiable_: Uberlinda ("Clásico de las abuelas
    chilenas"; origen incierto), Luzmira (solo "luz" es seguro) y Zunilda
    (solo la terminación _-hild_, "batalla"). Todo lo que circula sobre ellos
    viene de sitios de nombres o de IA.
  - _Vienen de una obra, no de una palabra_: Fresia (esposa de Caupolicán en
    _La Araucana_; no de la flor, que es posterior), Aída (Verdi), Norma
    (Bellini) y Cordelia (_El rey Lear_; su raíz se discute).
  - _Elba_: quizás variante de Alba; se muestra el río y la isla, que es lo
    único seguro.
  - _Lectura más aceptada, con reservas en las fuentes_: Gladys, Eliana,
    Yolanda, Elvira, Eloísa, Zulema, Nelly, Waldo, Ester.
  - _Familias romanas de raíz etrusca o discutida_: Herminia, Petronila,
    Horacio (este último muestra al poeta).
- **Coherencia de familia:** Pascal pasa a origen latino (_paschalis_), igual
  que Pascual y Pascuala; Margherita queda en "Perla", sin el "del mar" que la
  raíz no dice.

### Pueblos originarios (`pueblos-originarios`)

- **Criterio:** nombres de raíz mapuche (mapudungun), quechua, aymara o
  guaraní con **uso real en Chile**: inscripciones 2010–2021 en
  [guaguas](https://github.com/rivaquiroga/guaguas) (`data-raw/1920-2021.csv`,
  sumando variantes de grafía). El orden del deck es ese conteo. Capturado el
  27-09-2026.
- **Significados de diccionario**, no de sitios de nombres:
  - Mapudungun: Augusta, _Diccionario araucano-español_ (1916),
    [archive.org](https://archive.org/details/diccionarioarauc01fluoft).
  - Quechua: Academia Mayor de la Lengua Quechua, _Simi Taqe_ (2005),
    [archive.org](https://archive.org/details/simi-taqe-diccionario-quechua-espanol-quechua).
    Amancay: RAE, _amancay_ (del quechua _amankay_, "azucena").
  - Aymara: MINEDUC, _Diccionario ilustrado de la lengua aymara_ (2019),
    contrastado con Laime et al.
  - Anahí: la leyenda guaraní del ceibo.
- **Grafía:** la forma con tilde del español cuando marca el acento (Rayén,
  Kuyén, Aukán, Likán). Antü, Ayün y Kallfü llevan la ü del mapudungun, un
  sonido que el español no tiene; Antü y Ayün están entre las grafías más
  inscritas. Variantes que también se inscriben: Rayen, Antu/Antú,
  Kuyen/Küyen, Ayun/Ayún, Aukan/Aucán, Likan/Licán, Kalfu/Kallfu,
  Aylen/Ailén/Aillen, Nawel, Millarai, Suyay, Kimey, Naira, Taiel, Anahi.
- **Género:** con el criterio de "Género", más abajo.
- **Casos discutidos:**
  - _Lautaro_: figura histórica; la etimología se discute ("traro veloz" o
    "traro calvo"), así que se muestra el toqui.
  - _Tahiel_: el vínculo con _tayül_ (canto ceremonial) es derivación
    popular. La glosa "hombre libre" no tiene respaldo.
  - _Eluney_: solo la raíz _elu-_ ("dar") está verificada; "regalo del
    cielo" es adorno.
  - _Anahí_ es guaraní, no andino; la etimología se discute ("la más pequeña
    de la familia" no tiene fuente), así que se muestra la leyenda.
  - _Suyai_ es quechua (_suyay_, "esperar, esperanzar"), aunque suele
    atribuirse al mapudungun.
  - _Nayra_: "ojo" y "tiempo antiguo" en aymara; la grafía Naira puede tener
    otros orígenes.
  - _Quimey_: de _küme_, "bueno" (Augusta). "Lo bello", que se ve en otros
    sitios, no está verificado.
  - _Katari_: "serpiente" en aymara, como en Túpac Katari. Falta confirmarlo
    en el diccionario del MINEDUC.
- **Descartados:**
  - Sayén y Mailén: mucho uso, pero su significado no se pudo verificar en
    diccionario. Lo mismo Ayinray y Aluén.
  - Alen, Luan y Aylin: su uso se confunde con nombres no indígenas (Alan,
    el Luan brasileño, el Aylin turco).
  - Pehuén, Killa, Wayra, Yaku, Wara, Uma y Túpac: casi sin inscripciones.
  - Caupolicán y Galvarino: figuras históricas casi sin uso desde 2010.
  - Fresia, Guacolda, Tegualda y Lincoyán: vienen de _La Araucana_ de
    Ercilla y no se pueden verificar como mapudungun.

### Unisex (`unisex`)

- **Criterio:** los nombres `x` del catálogo (ver "Género"). Primero los que
  más se mezclan en Chile; al final, los que son unisex por el cruce entre
  decks (Andrea, Elia).
- **Lote 10**, nuevos para este deck (niñas / niños; Chile 2012–2021 salvo
  que diga otra cosa, España nacidos 2010–2024):

  | Nombre | Chile               | España     | Significado según                |
  | ------ | ------------------- | ---------- | -------------------------------- |
  | Yael   | 109 / 93            | 86 / 1.246 | Behind the Name (Jael)           |
  | Jael   | 213 / 55            | 89 / 205   | Behind the Name                  |
  | Ari    | 31 / 32             | 94 / 183   | Behind the Name                  |
  | Eden   | 13 / 37             | 182 / 246  | Behind the Name ("posible")      |
  | Sasha  | 54 / 9              | 195 / 307  | Behind the Name (Alexander)      |
  | Akira  | 33 / 19 (2002–2021) | 36 / 75    | Behind the Name                  |
  | Morgan | 18 / 37 (2002–2021) | 29 / 89    | Behind the Name                  |
  | Robin  | 2 / 44              | 55 / 175   | Behind the Name (Robert)         |
  | Taylor | 20 / 58             | 15 % niñas | Behind the Name                  |
  | Marley | 10,5 % niñas        | 49 / 51    | Behind the Name                  |
  | Quimey | 58 / 35 (2002–2021) | —          | Augusta (_küme_)                 |
  | Katari | 47 / 22 (2002–2021) | —          | Túpac Katari                     |
  | Altair | 14 / 38             | 12 % niñas | la estrella (_al-nasr al-ṭāʾir_) |
  | Lur    | —                   | 692 / 185  | Behind the Name                  |
  | Haize  | —                   | 44 / 44    | Euskaltzaindia (epiceno)         |

- **Descartados:**
  - Casi siempre de un sexo: Alex, Alexis, Jordan, Sam, Dani, Luan, Inti y
    Amaru (niños); Cielo, Paz, Sol, Mar, Belén, Consuelo y Dominique (niñas).
    Rosario y Reyes tuvieron uso masculino, pero ya no.
  - Bajo el 20 %: Charlie, Río y Kim.
  - Dos nombres distintos según el sexo: Alen (mapuche, o variante de Alan) y
    Eli (en niñas, diminutivo de Elisa).
  - Sin un significado único y honesto: París, Yuri, Mika, Isa.

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

### Top 100 España (`top-espana`)

- **Fuente:** INE, "Nombres más frecuentes de los recién nacidos", año 2024,
  hoja TOTAL (`https://www.ine.es/daco/daco42/nombyapel/nomnac24.xlsx`,
  capturado el 11-08-2026). Top 100 exacto por sexo, intercalado por posición.
  El XLSX viene sin tildes; se restauraron a mano (Sofía, Lucía, Martín…).

### Top 100 Italia (`top-italia`)

- **Fuente:** ISTAT, clasificación anual de nombres de nacidos 2023 (top 50
  por sexo), transcrita de `periodofertile.it` (capturado el 11-08-2026).
  **Pendiente:** verificar contra la publicación ISTAT original. Las formas
  italianas se conservan tal cual (son el atractivo del deck).

### Top 20 Argentina (`top-argentina`)

- **Fuente:** RENAPER / Dirección Nacional de Población, inscripciones 2025
  (al 01-12-2025), vía Infobae 02-01-2026 (capturado el 11-08-2026). El
  dashboard oficial (`estadisticas.renaper.gob.ar/app_nombres/`) topea en 20
  por año; la nota lista 19 por sexo. "Franchesca" figura así en la fuente.

### Top 10 México (`top-mexico`)

- **Fuente:** INEGI (ENR) / RENAPO, agregado 2017-2021, vía
  `mexicosocial.org/nombres-mas-comunes/` (capturado el 11-08-2026). No hay
  dataset abierto de nombres en México; ampliar requeriría solicitud de
  transparencia (INAI). Incluye compuestos (María José, Miguel Ángel).

## Género

`gender` describe el uso del nombre, no a la persona: `f` o `m` según el sexo
con que se inscribe, `x` si se usa para ambos. El filtro "De niña" muestra
`f` + `x`, y "De niño", `m` + `x`.

**Un nombre es unisex (`x`) si cumple una de estas condiciones:**

1. **Por datos.** En al menos uno de dos registros, el sexo minoritario es
   ≥ 20 % de las inscripciones recientes, con al menos 50 en la ventana.
   - Chile: Registro Civil vía guaguas, 2012–2021 (si hay menos de 50,
     2002–2021).
   - España: INE, residentes al 01-01-2025 nacidos 2010–2024 (la API del
     widget "Nombres y apellidos").
   - Se suman las grafías que solo difieren en tildes, ü o k/qu: Antu, Antü
     y Antú cuentan juntas, igual que Quimey y Kimey.
   - El 20 % ("1 de cada 5") es un corte redondo. FiveThirtyEight usa 1/3,
     que dejaría fuera nombres con uso mixto real (Ariel 28 %, Robin 24 %).
   - Solo cuenta el uso reciente: Rosario tuvo 535 niños en Chile, pero
     ninguno desde 2002.
   - EE.UU. (SSA) e Italia son contexto, no deciden: con EE.UU., Sol o
     Rosario serían unisex, y en Chile no lo son.
2. **Por cruce entre decks.** Si el nombre es de un sexo en un país y del
   otro en otro país con deck en el catálogo, va `x` para que el filtro
   funcione en ambos decks. Hoy: Andrea y Elia (niñas en Chile y España,
   niños en Italia). Pascal no aplica: es de niño en Francia, que no tiene
   deck.

Además:

- **Con datos escasos** se deja `x` provisional si el uso mezcla de verdad:
  Munay (45 inscripciones en 2010–2021) y Relmu (32).
- **Las grafías que convergen no cuentan:** Michele es de niño en Italia; las
  niñas chilenas con ese nombre son una grafía de Michelle.

**Revisados con este criterio (27-09-2026):**

- Pasan a `f`: Noa (12 % niños en Chile, 0,3 % en España), Trinidad y
  Guadalupe (100 % niñas en ambos registros; el José Guadalupe mexicano no se
  puede medir).
- Pasan a `x`: Simone (98 % niñas en Chile, 48 % en España, niño en Italia),
  Ares (25 % niñas en España, aunque va bajando) y Enea (146 niñas y 106 niños en España; el femenino es vasco,
  sinónimo de Nerea).
- Siguen `x`: Ariel (28 % niñas en España), Cruz (44 %), Andrea y Elia.
- Siguen `m`: Kai (8 % niñas en Chile) y Álex (1,5 % niñas en España).

`node scripts/missing-names.mjs` compara el catálogo con los datos chilenos
(solo la condición 1, solo Chile): una diferencia ahí no es necesariamente un
error.

## Significados y orígenes

Los campos `origin` y `meaning` son curaduría propia sobre etimologías
estándar, redactados en español neutro y en tono cálido (no académico). El
`meaning` es una glosa, no una traducción literal. Casos discutidos (etimología
debatida; se eligió la lectura más difundida): Leonor (occitano), Samantha
(arameo), Amaro (latino, glosa popular de _amare_), Diego (vía Santiago),
Pascal (femenino en Chile según los datos de inscripción), Enzo (quizá de
Heinz, "señor de la casa"; también se lo deriva de Lorenzo o Vincenzo),
Camila (los _camilli_ asistían en los ritos romanos; Behind the Name cree que
el nombre es etrusco).

**Sin estereotipos de género.** Las glosas de los sitios de nombres cargan
estereotipos: a los nombres de niña se les agrega pureza, hogar o servicio
que la etimología no dice. El criterio:

- Si la etimología no lo dice, no se agrega.
- Si hay dos lecturas, se elige la que no encasilla.
- El significado no le da género a la persona cuando la raíz no lo tiene:
  "Libre", no "Mujer libre" ni "Hombre libre".

Corregidos con este criterio (27-09-2026, contra
[Behind the Name](https://www.behindthename.com) y Wiktionary):

| Nombre                           | Antes                           | Ahora                                    |
| -------------------------------- | ------------------------------- | ---------------------------------------- |
| Inés                             | Pura, casta                     | Pura, sagrada                            |
| Violeta / Viola                  | …símbolo de modestia            | Como la flor / Violeta, la flor          |
| Marta                            | Señora del hogar                | Señora                                   |
| Camila / Camilla                 | La que sirve con nobleza        | La que asiste en los ritos               |
| Beatrice                         | La que hace felices a los demás | Bienaventurada                           |
| Elsa                             | Noble doncella (germánico)      | Consagrada a Dios (hebreo, de Elisabet)  |
| Cecilia                          | Delicada, patrona de la música  | De linaje romano, patrona de la música   |
| Blanca / Bianca                  | Pura y luminosa / Blanca y pura | Brillante y luminosa / Blanca, brillante |
| Nina                             | Niña tierna (español)           | Diminutivo; en quechua, fuego (italiano) |
| Lara                             | Protectora del hogar            | Ninfa romana, madre de los Lares         |
| Rebecca                          | La que cautiva                  | Lazo, la que une                         |
| Francisca, Francisco y variantes | Mujer libre / Hombre libre      | Libre, del pueblo franco                 |
| Carla, Carlotta, Carlos          | Mujer / Hombre libre y fuerte   | Libre y fuerte                           |

Notas: Beatrice viene probablemente de _Viatrix_ ("viajera"), reinterpretada
como _beatus_; "patrona de la música" en Cecilia es asociación, no
etimología (viene de la familia romana _Caecilius_); Nina es diminutivo
(Antonina, Giannina) y "fuego" en quechua y aymara es una coincidencia que
vale la pena contar.

## Cómo buscar candidatos

```bash
node scripts/missing-names.mjs                      # top 100 que faltan, 2012–2021
node scripts/missing-names.mjs --desde 2019 --top 50 > /tmp/candidatos.md
```

Cruza guaguas con `names.ts` y lista los nombres más inscritos que faltan,
con la tendencia (proporción de nacimientos, no conteo: los nacimientos
cayeron en el período), el reparto por sexo, el género sugerido, las grafías
y si es una variante de un nombre que ya está (Mathias ~ Matías). También
lista los nombres del catálogo cuyo género no calza con los datos chilenos.
La salida son candidatos, no datos para importar: cada uno pasa por los
criterios de este archivo.

Fuentes según la pregunta que responden:

- **¿Se usa?** Registros oficiales, datos abiertos con atribución: guaguas
  (Chile), datos.gob.ar "Nombres" 1922–2015 (Argentina), INE "Nombres y
  apellidos" (España, por sexo y década), API de nombres del IBGE (Brasil),
  SSA (EE.UU.), INSEE "Fichier des prénoms" (Francia), ONS (Reino Unido).
  Para Chile 2022+, solicitud por Ley de Transparencia al Registro Civil.
- **¿Qué significa?** Diccionarios, no sitios de nombres: Tibón, _Diccionario
  etimológico comparado de nombres propios de persona_ (FCE); Faure,
  _Diccionario de nombres propios_ (Espasa); Oxford, _A Dictionary of First
  Names_; Behind the Name y Wiktionary para contrastar. Lenguas originarias:
  los diccionarios del deck Pueblos originarios.
- **¿De qué género?** Los datos de registro por sexo, con el criterio de
  unisex de este archivo.
- **Wikidata** (CC0) sirve para generar candidatos y enlazar variantes
  (Nicolás, Nicolò, Nicholas), no para significados.
- **Licencias:** la glosa se redacta siempre de cero. Wikipedia y Wiktionary
  son CC BY-SA (copiar texto obliga a atribuir y compartir igual) y Behind the
  Name es una base propietaria: se consultan, no se copian.
- **Evitar:** sitios de nombres de bebé, blogs y contenido generado con IA. Se
  copian entre sí e inventan adornos ("noble doncella").

## Estado de la expansión

- **Lote 1** (24 nombres): seed inicial de desarrollo.
- **Lote 2** (13): nombres del top 10 2025 que faltaban.
- **Lote 3** (15): tanda griega para el deck Griegos.
- **Lote 4** (65): resto del top 50 por sexo (guaguas 2021).
- **Lote 5** (148): top 100 por sexo de España (INE 2024).
- **Lote 6** (71): top 50 por sexo de Italia (ISTAT 2023).
- **Lote 7** (10): top 20 de Argentina (RENAPER 2025).
- **Lote 8** (6): top 10 de México (INEGI/RENAPO).
- **Lote 9** (28): pueblos originarios (guaguas 2010–2021).
- **Lote 10** (15): unisex (Registro Civil e INE).
- **Lote 11** (4): clásicos chilenos muy inscritos que faltaban (Constanza,
  Emilio, Belén, Paz; guaguas 2012–2021). Constanza, Emilio y Paz entran a
  Clásicos latinos; Belén queda solo en "Todos los nombres".
- **Lote 12** (27): clásicos chilenos que faltaban, para el deck Clásicos
  chilenos.
- **Lote 13** (81): nombres de abuelas y abuelos para el deck Hace 100
  años.
- **Total: 507 nombres.**
- **Pendiente:**
  - QA de contenido con hablante nativo: los lotes 5 a 8 se curaron en
    tanda grande, y sus significados son glosas estándar sin verificación
    individual. Revisarlos con el criterio "Sin estereotipos de género".
  - Nombres chilenos muy inscritos que faltan (Anaís, Mariano, Dominique,
    Pascale…): `node scripts/missing-names.mjs`.
  - Más decks temáticos.
