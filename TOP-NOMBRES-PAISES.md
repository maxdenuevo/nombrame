# Investigación: rankings de nombres por país — TEMPORAL, no commitear

> Material para futuros decks tipo "Top España", "Top Italia", etc. Mismo
> criterio que el Top 100 Chile: solo datos con fuente oficial verificable.
> Capturado el 11-08-2026. Cuando un deck se construya, mover su fuente a
> `src/data/SOURCES.md`.

## Resumen de viabilidad

| País | Alcance verificable | Fuente oficial | Datos |
|---|---|---|---|
| España | **Top 100 exacto** por sexo, con cantidades | INE, recién nacidos 2024 | XLSX oficial descargable |
| Italia | **Top 50** por sexo | ISTAT, nacidos 2023 | Publicación anual ISTAT |
| Argentina | **Top 20** por sexo, con cantidades | RENAPER, inscripciones 2025 | Dashboard oficial (tope: 20 por año/provincia) |
| México | **Top 10** por sexo | INEGI (ENR) / RENAPO, 2017-2021 | Solo comunicados de prensa |

Notas de viabilidad:

- **España** es el único con top 100 real: `https://www.ine.es/daco/daco42/nombyapel/nomnac[AA].xlsx`
  (patrón por año, 2002-2024; hoja "TOTAL" = nacional). Un deck "Top 100 España" sale directo.
- **Italia**: ISTAT publica top 50 anual; su "Contanomi" (1999-2023) permite consultar
  nombre por nombre pero no exporta ranking completo. Deck viable: "Top 50 Italia".
- **Argentina**: el dashboard oficial (`estadisticas.renaper.gob.ar/app_nombres/`) muestra
  máximo top 20 por año y provincia, sin API pública ni descarga. El dataset abierto
  histórico (datos.gob.ar, 1922-2015) **no trae sexo**, así que no sirve para deck por
  género sin trabajo extra. Deck viable hoy: "Top 20 Argentina" (o top ~40 sumando
  provincias a mano desde el dashboard).
- **México**: INEGI/RENAPO solo publican top 5-10 en comunicados; no hay dataset abierto
  de nombres. Para un top mayor habría que pedir los datos por transparencia (INAI).
  Deck viable hoy: "Top 10 México" (corto para un deck; quizás esperar).

Ojo curatorial: los cuatro rankings comparten muchos nombres con el catálogo actual
(Mateo, Sofía, Emma, Martina, Lucas, Olivia, Isabella, Valentina…) — el costo real de
cada deck nuevo es menor de lo que parece, porque gran parte ya está curada.

---

## España — INE, recién nacidos 2024 (oficial, completo)

Fuente: INE, "Nombres más frecuentes de los recién nacidos"
(`https://www.ine.es/daco/daco42/nombyapel/nomnac24.xlsx`, hoja TOTAL).
Total 2024: 163.732 niños, 154.273 niñas. Los nombres vienen sin tilde en el
XLSX original (Sofia, Lucia, Martin…) — al curar hay que restaurarlas.

### Niños (top 100)

1. Mateo (3289)
2. Hugo (2734)
3. Martin (2693)
4. Leo (2550)
5. Manuel (2411)
6. Lucas (2228)
7. Pablo (2158)
8. Alejandro (2136)
9. Enzo (2028)
10. Alvaro (1949)
11. Daniel (1945)
12. Thiago (1644)
13. Luca (1533)
14. Gonzalo (1510)
15. Mario (1455)
16. Liam (1399)
17. Adrian (1379)
18. Oliver (1340)
19. Bruno (1333)
20. Diego (1232)
21. Gael (1226)
22. Nicolas (1223)
23. Alex (1182)
24. Marcos (1116)
25. David (1100)
26. Marco (1076)
27. Antonio (1073)
28. Juan (1054)
29. Miguel (1053)
30. Gabriel (1039)
31. Javier (1013)
32. Izan (971)
33. Rodrigo (957)
34. Marc (908)
35. Jose (900)
36. Angel (896)
37. Carlos (886)
38. Dylan (880)
39. Dario (862)
40. Noah (847)
41. Adam (830)
42. Jaime (727)
43. Samuel (696)
44. Nico (686)
45. Santiago (674)
46. Pau (631)
47. Guillermo (625)
48. Jorge (622)
49. Hector (609)
50. Eric (595)
51. Luis (582)
52. Francisco (563)
53. Amir (551)
54. Iker (548)
55. Jesus (545)
56. Victor (545)
57. Sergio (541)
58. Matias (530)
59. Aaron (519)
60. Pedro (509)
61. Rafael (508)
62. Mohamed (500)
63. Ian (495)
64. Julen (490)
65. Biel (485)
66. Unai (471)
67. Nil (458)
68. Saul (456)
69. Marti (445)
70. Ares (437)
71. Isaac (430)
72. Alonso (419)
73. Ruben (413)
74. Ivan (403)
75. Erik (402)
76. Alan (398)
77. Pol (393)
78. Aleix (380)
79. Fernando (379)
80. Rayan (362)
81. Jan (360)
82. Ignacio (359)
83. Joel (358)
84. Alberto (353)
85. Arnau (352)
86. Ander (349)
87. Ismael (346)
88. Luka (345)
89. Fabio (339)
90. Raul (332)
91. Kai (330)
92. Neizan (323)
93. Andres (319)
94. Aday (316)
95. Aran (307)
96. Tomas (306)
97. Maximo (302)
98. Elias (301)
99. Axel (298)
100. Max (281)

### Niñas (top 100)

1. Sofia (3325)
2. Lucia (2830)
3. Martina (2364)
4. Maria (2189)
5. Vega (2129)
6. Julia (2071)
7. Olivia (1896)
8. Valeria (1792)
9. Mia (1646)
10. Emma (1618)
11. Paula (1527)
12. Carmen (1518)
13. Alma (1431)
14. Carla (1413)
15. Lola (1378)
16. Gala (1346)
17. Lara (1327)
18. Daniela (1319)
19. Sara (1305)
20. Jimena (1280)
21. Chloe (1198)
22. Valentina (1174)
23. Claudia (1146)
24. Noa (1107)
25. Alba (1073)
26. Laia (1046)
27. Candela (983)
28. Manuela (976)
29. Victoria (960)
30. Triana (957)
31. Alejandra (940)
32. Vera (883)
33. Ana (880)
34. Elena (860)
35. Aitana (847)
36. Carlota (846)
37. Blanca (832)
38. Zoe (815)
39. Ines (803)
40. Adriana (789)
41. Lia (740)
42. Abril (736)
43. Nora (728)
44. Clara (723)
45. Marina (703)
46. Luna (660)
47. Rocio (654)
48. Marta (625)
49. Amira (601)
50. Alicia (586)
51. Celia (564)
52. Gabriela (552)
53. Eva (498)
54. Laura (498)
55. Leire (497)
56. Ona (475)
57. India (472)
58. Ariadna (453)
59. Julieta (442)
60. Irene (437)
61. Alaia (428)
62. Isabel (413)
63. Catalina (408)
64. Isabella (399)
65. Iria (394)
66. Iris (389)
67. Violeta (380)
68. Angela (377)
69. Aurora (375)
70. Mar (371)
71. Africa (366)
72. Aina (363)
73. Diana (359)
74. Cataleya (357)
75. Nour (354)
76. Antonella (353)
77. Lina (342)
78. Adara (340)
79. Ainara (338)
80. Andrea (335)
81. Yasmin (329)
82. Aya (326)
83. Ainhoa (315)
84. Alana (312)
85. Macarena (308)
86. Naia (304)
87. Jana (293)
88. Elsa (291)
89. Layan (289)
90. Aria (283)
91. Elia (282)
92. Helena (282)
93. Camila (281)
94. Maia (273)
95. Amelia (271)
96. Aroa (269)
97. Leyre (268)
98. Nerea (266)
99. Teresa (264)
100. Fatima (263)

---

## Italia — ISTAT, nacidos 2023 (top 50 por sexo)

Fuente: ISTAT (clasifica anual de nombres de neonatos), vía
`periodofertile.it/nomi-bambini/nomi-piu-diffusi-in-italia-maschili-e-femminili-i-primi-50-preferiti`.
Verificar contra la publicación ISTAT original antes de armar el deck.

### Niños (top 50)

1. Leonardo · 2. Edoardo · 3. Tommaso · 4. Francesco · 5. Alessandro · 6. Mattia · 7. Lorenzo · 8. Gabriele · 9. Riccardo · 10. Andrea · 11. Diego · 12. Giuseppe · 13. Matteo · 14. Enea · 15. Nicolò · 16. Antonio · 17. Federico · 18. Giovanni · 19. Filippo · 20. Samuele · 21. Pietro · 22. Giulio · 23. Gioele · 24. Davide · 25. Michele · 26. Christian · 27. Elia · 28. Gabriel · 29. Noah · 30. Marco · 31. Salvatore · 32. Liam · 33. Luca · 34. Vincenzo · 35. Thomas · 36. Emanuele · 37. Alessio · 38. Nathan · 39. Giorgio · 40. Samuel · 41. Jacopo · 42. Giacomo · 43. Ettore · 44. Raffaele · 45. Daniele · 46. Simone · 47. Luigi · 48. Damiano · 49. Domenico · 50. Santiago

### Niñas (top 50)

1. Sofia · 2. Aurora · 3. Ginevra · 4. Vittoria · 5. Giulia · 6. Beatrice · 7. Ludovica · 8. Alice · 9. Emma · 10. Matilde · 11. Anna · 12. Camilla · 13. Bianca · 14. Azzurra · 15. Chiara · 16. Nicole · 17. Giorgia · 18. Isabel · 19. Greta · 20. Noemi · 21. Martina · 22. Arianna · 23. Gaia · 24. Sara · 25. Rebecca · 26. Viola · 27. Elena · 28. Ambra · 29. Chloe · 30. Diana · 31. Adele · 32. Francesca · 33. Mia · 34. Margherita · 35. Sole · 36. Cecilia · 37. Gioia · 38. Emily · 39. Marta · 40. Elisa · 41. Nina · 42. Lavinia · 43. Anita · 44. Amelia · 45. Eleonora · 46. Carlotta · 47. Maria · 48. Celeste · 49. Eva · 50. Giada

---

## Argentina — RENAPER, inscripciones 2025 (top ~20 por sexo, con cantidades)

Fuente: RENAPER / Dirección Nacional de Población (al 01-12-2025), vía
`infobae.com/sociedad/2026/01/02/cuales-fueron-los-20-nombres-de-bebes-mas-elegidos-en-argentina-durante-2025/`.
Dashboard oficial para verificar/ampliar por provincia: `estadisticas.renaper.gob.ar/app_nombres/`.

### Niños

1. Benjamín (7.400) · 2. Gael (5.963) · 3. Mateo (5.872) · 4. Valentino (4.212) · 5. Valentín (4.119) · 6. Enzo (3.882) · 7. Liam (3.868) · 8. Noah (3.323) · 9. Giovanni (3.248) · 10. Felipe (3.171) · 11. Julián (3.168) · 12. Nicolás (3.116) · 13. Benicio (2.785) · 14. Bastian (2.584) · 15. Eithan (2.572) · 16. Lionel (2.511) · 17. Gabriel (2.497) · 18. Agustín (2.480) · 19. Ezequiel (2.426)

### Niñas

1. Isabella (6.848) · 2. Valentina (5.766) · 3. Olivia (5.707) · 4. Sofía (5.196) · 5. Jazmín (4.577) · 6. Victoria (4.082) · 7. Martina (3.751) · 8. Emma (3.538) · 9. Emilia (3.507) · 10. Mia (3.422) · 11. Catalina (3.267) · 12. Aitana (3.231) · 13. Ámbar (2.957) · 14. Franschesca (2.422) · 15. Zoe (2.371) · 16. Alma (2.338) · 17. Delfina (2.334) · 18. Luz (2.303) · 19. Abigail (2.283)

(La nota de Infobae lista 19 por sexo pese al título "20".)

---

## México — INEGI (ENR) / RENAPO, 2017-2021 (solo top 10 por sexo)

Fuente: agregado 2017-2021 vía `mexicosocial.org/nombres-mas-comunes/`. Para 2024,
INEGI reportó en prensa: niñas Sofía (5.862), Regina (5.162), Valentina (4.654),
Camila (4.448), María José (4.365); niños Santiago (8.406), Mateo (7.291),
Sebastián (5.928), Leonardo (5.261), Matías (5.158).

### Niños (2017-2021)

1. Santiago · 2. Mateo · 3. Sebastián · 4. Leonardo · 5. Matías · 6. Emiliano · 7. Diego · 8. Miguel Ángel · 9. Daniel · 10. Alexander

### Niñas (2017-2021)

1. Sofía · 2. María José · 3. Valentina · 4. Ximena · 5. Regina · 6. Camila · 7. María Fernanda · 8. Valeria · 9. Renata · 10. Victoria
