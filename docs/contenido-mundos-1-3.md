# Contenido implementado: mundos 1–3

La Isla de los Números corresponde a 1.º básico, el Circo de las Sumas a 2.º y el Reino del Jaque Dulce a 3.º. Se mantienen los 14 identificadores de nivel, sus enemigos, fondos y personajes. El progreso guardado continúa siendo compatible.

Hay 280 preguntas originales, 20 por nivel. Cada una identifica curso, eje y habilidad, e incluye una pista y una explicación. Las lecciones preparan los temas de su banco. La selección principal muestra los tres mundos.

| Mundo | Nivel local | Nombre | Contenido principal |
| --- | --- | --- | --- |
| Isla · 1.º | 1 | El tesoro de las decenas | Conteo hasta 100; cantidades hasta 20; cero; ordinales; comparación; decenas, unidades y composición; estimación. |
| Isla · 1.º | 2 | Las cuentas del capitán | Sumas y restas hasta 20; dobles, completar diez y operación inversa; patrones repetitivos y numéricos; igualdad y equilibrio. |
| Isla · 1.º | 3 | El mapa de la isla | Figuras planas y cuerpos; líneas y posiciones; comparación de longitudes; orden temporal y días; tablas, pictogramas y recolección de datos. |
| Isla · 1.º | 4 | El desafío del Manzano Ancestral | Repaso de las habilidades de la isla, incluyendo meses del año. |
| Circo · 2.º | 1 | La boletería de los globos | Valor posicional y comparación hasta 100; conteos por saltos hasta 1.000; estimación; sumas y restas sin reserva; cálculo mental. |
| Circo · 2.º | 2 | La pista de las formas | Patrones, igualdad y signos de comparación; posiciones; figuras 2D y cuerpos; lados y construcción con varillas. |
| Circo · 2.º | 3 | Los horarios del forzudo | Calendario; horas y medias horas digitales; longitudes en cm y m; pictogramas con escala y barras; registro de dados y monedas. |
| Circo · 2.º | 4 | Los grupos de la caja sorpresa | Grupos iguales, suma repetida, filas; tablas del 2, 5 y 10; dobles y descomposición de grupos. |
| Circo · 2.º | 5 | El gran repaso del Dragón Globo | Repaso del circo con ocho alternativas, sin habilidades nuevas. |
| Reino · 3.º | 1 | Las cuentas del peón | Naturales hasta 1.000, centenas y estimación; sumas y restas con y sin reserva; patrones y casillas desconocidas. |
| Reino · 3.º | 2 | Los repartos del caballo | Tablas hasta 10 × 10; multiplicación por 0 y 1; división exacta, reparto y agrupación; operación inversa. |
| Reino · 3.º | 3 | El mapa del alfil | Fracciones 1/4, 1/3, 1/2, 2/3 y 3/4; comparación con igual denominador; mapas, cuerpos y redes; ángulos de referencia; transformaciones; perímetro. |
| Reino · 3.º | 4 | La torre de los registros | Relojes análogos descritos y digitales, duración; masa en g y kg; longitudes; encuestas, pictogramas, barras, diagramas de puntos y registros de azar. |
| Reino · 3.º | 5 | El jaque de la Reina de Azúcar | Repaso del reino con alternativas que cambian de posición cada dos segundos. |

Los grupos y las fracciones se representan con casillas de igual tamaño; los datos se muestran en tablas y registros de barras o puntos con escala explícita. Estos elementos son HTML y CSS: no se han reemplazado ni generado assets.

## Jefes y ritmo

- El Manzano Ancestral mezcla 80 preguntas de su mundo. Conserva 20 HP y ya no regenera vida para permitir leer los registros con calma.
- El Dragón Globo mezcla las 100 preguntas del circo. Todas ofrecen ocho alternativas distintas durante esta pelea, incluyendo las preguntas de figuras y calendario. Los niveles normales mantienen cuatro.
- La Reina de Azúcar mezcla las 100 preguntas del reino. Conserva sus cuatro alternativas y su habilidad de cambiarlas de posición cada dos segundos. El valor correcto sigue unido al texto.
- Los combates terminan al vencer al enemigo; los bancos no son cuestionarios obligatorios de veinte respuestas por intento. Volver a jugar permite practicar otras preguntas.

## Fuentes de planificación

Síntesis y ejercicios propios basados en los contenidos publicados por Mineduc:

- [Programa de 1.º básico](https://www.curriculumnacional.cl/docente/629/w3-article-18976.html).
- [Objetivos de 2.º básico](https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/2-basico).
- [Programa de 3.º básico](https://www.curriculumnacional.cl/estudiante/621/w3-article-18978.html).
- [Fracciones de uso común de 3.º básico, MA03 OA 11](https://www.curriculumnacional.cl/614/w3-article-17556.html).

La presencia de los cinco ejes amplía la variedad curricular del juego; no equivale a evaluar exhaustivamente todos los objetivos de un curso ni sustituye actividades de construcción, explicación oral y experimentación.

## Edición y comprobaciones

Editar `scripts/build-primary-content.cjs` y ejecutar `node scripts/build-primary-content.cjs`. El archivo resultante es `js/levels-data.js`; no se necesita ejecutar el generador en el navegador.

La generación comprueba veinte preguntas por nivel, prompts distintos en cada mundo y presencia de los cinco ejes. Las pruebas del motor verifican resultados aritméticos, límites y prerrequisitos por curso, mezcla de respuestas y jefes que solo repasan habilidades previas. La comprobación de interfaz cubre las preguntas visuales y de texto en móvil y escritorio, además de la navegación y la habilidad de la reina.
