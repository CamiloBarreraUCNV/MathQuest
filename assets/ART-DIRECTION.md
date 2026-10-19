# Kalkú — Guía de identidad visual

Esta guía fija la línea gráfica para los próximos personajes, objetos, escenarios e interfaces del proyecto. Se basa en los assets existentes; sus ajustes son criterios para nuevas piezas y revisiones, no una orden de reemplazar el arte actual.

## Identidad

El nombre público del juego es **Kalkú**. El logo aprobado es `kalku-logo/kalku-logo-direction-1-cartoon-transparent.png` (dirección «Aventura Animada»). Usar este archivo en cabeceras y prototipos; no sustituirlo por texto con el antiguo nombre ni por un emoji. La interfaz utiliza un PNG con transparencia real, incluido el borde crema del diseño, sin fondo ni marco claro. Se encuadra mediante `css/branding.css`, conservando las letras y el acento completos. El JPG original permanece como referencia. Las imágenes de referencia anteriores mantienen su marca histórica.

**Caricatura de aventuras de inspiración ochentera, con contornos de tinta, color vivo, volumen sencillo y acabado digital limpio.**

El tono es cálido, fantástico, travieso y teatral. Los rivales tienen carácter y transmiten desafío sin resultar aterradores. El mundo debe despertar curiosidad y acompañar el aprendizaje. La estética puede crecer en complejidad con los mundos sin perder claridad ni convertirse en arte para preescolares.

La referencia a los años 80 orienta el dibujo, las expresiones y la puesta en escena. El resultado admite la limpieza de una ilustración digital actual; no requiere filtros de envejecimiento, grano, VHS ni una reproducción histórica estricta.

## Referencias visuales y prioridad

Observar las imágenes antes de producir una pieza. Seleccionar una referencia principal y, cuando sea necesario, una secundaria de material o escenario.

| Referencia | Qué conservar |
| --- | --- |
| `world-1/pirate-apple-80s.png` | Referencia principal de contorno, expresión, proporciones caricaturescas y claridad de silueta. |
| `world-2/circus-balloon-two-headed-dragon-80s.png` | Construcción con globos, articulaciones y brillo localizado del látex. Su complejidad corresponde a un jefe. |
| `world-3/candy-chess-pawn-80s.png` | Integración de chocolate, vainilla y caramelo en una forma reconocible. |
| `world-3/candy-chess-queen-80s.png` | Jerarquía de jefe, gestualidad y vestuario; moderar los reflejos al trasladar el estilo a objetos simples. |
| `world-1/battle-stage-clean.jpg` y `world-2/circus-battle-background-80s.png` | Escenarios pictóricos, profundidad por planos, luz cálida y espacio para combatir. |
| `world-3/candy-chess-battle-background-80s.png` | Arquitectura y materiales del reino dulce, perspectiva y suelo escénico. |
| `mathquest-battle-mockup.png` y `world-selection-mockup.png` | Referencia de composición e integración con la interfaz; no son fuente vigente de textos, contenido ni progreso. |

El mockup del selector y la lámina `world-thumbnails-80s.png` conservan un Cañón de Factores anterior al Reino del Jaque Dulce. Para el mundo 3, prevalecen los assets de `world-3/` y su guía específica.

## Reglas de dibujo para personajes y objetos

### Contorno y formas

- Contorno exterior oscuro, continuo y de aspecto entintado, con variación moderada de grosor. Las líneas interiores deben ser más ligeras para no fragmentar la figura.
- Formas amplias, curvas y volúmenes comprensibles. Los ángulos pueden identificar coronas, herramientas o piezas de ajedrez, sin volver agresivo todo el diseño.
- Una silueta dominante y pocos detalles secundarios. Debe reconocerse el objeto antes de leer sus adornos.
- En objetos antropomórficos, conservar la anatomía del objeto: una manzana sigue siendo una manzana; una pieza de ajedrez conserva su base y remate característicos.
- Los objetos comunes no necesitan ojos, extremidades ni guantes. Personificarlos solo cuando su función narrativa lo justifique o el usuario lo solicite.

### Color, luz y materiales

- Construir cada material con un color base, una sombra principal y un brillo localizado cuando corresponda. Se admite una segunda sombra para separar volúmenes importantes.
- Priorizar sombras con bordes definidos. Los degradados suaves pueden acompañar el volumen, pero no deben dominarlo ni producir aspecto de render 3D.
- Iluminación principal suave desde arriba a la izquierda, salvo que la escena requiera expresamente otra luz.
- Reflejos simples y dibujados. Látex, caramelo y metal pueden brillar más que madera, tela o malvavisco. El acabado común no implica que todos los materiales parezcan plástico.
- Evitar microtexturas, reflejos especulares repetidos y destellos decorativos sobre cada superficie.
- Por pieza, elegir dos o tres colores dominantes, neutros y un acento. Reservar paletas más amplias para jefes o conjuntos que lo necesiten.

### Expresión y jerarquía

- Ojos grandes de blanco cálido y pupila oscura, cejas legibles y gestos claros. Sonrisas pícaras, determinación y sorpresa pertenecen a la misma familia expresiva.
- Guantes crema y manos simplificadas cuando encajen con el personaje. No son obligatorios para criaturas, árboles u objetos inanimados.
- Enemigo básico: forma compacta y un accesorio dominante. Enemigo avanzado: mayor presencia o un rasgo distintivo. Jefe: silueta de mayor autoridad y detalle selectivo.
- Expresar el rango mediante tamaño, postura y formas principales antes de añadir joyas, medallas o adornos pequeños.

## Identidad por mundo

| Mundo | Materiales y motivos | Paleta orientativa |
| --- | --- | --- |
| Isla de los Números | Manzanas, árboles, madera, tela pirata, cuerda y herrajes sencillos. | Rojo manzana, verde hoja, marrón cálido, crema y dorado. |
| Circo de las Sumas | Globos, nudos visibles, tubos inflados, carpas y accesorios circenses. | Turquesa, violeta, amarillo, coral y crema. |
| Reino del Jaque Dulce | Ajedrez, chocolate, malvavisco, barquillo, glaseado y caramelo. | Cacao, vainilla, frambuesa, menta y oro caramelo. |
| Bosque del Álgebra | Vegetación fantástica, piedra, símbolos y luz mágica; referencia de entorno en las miniaturas. | Verde profundo, turquesa y violeta luminoso. |
| Pico de las Funciones | Roca, nieve, senderos y banderines; referencia de entorno en las miniaturas. | Azul cielo, blanco cálido, gris azulado y ocre. |
| Nexo del Cálculo | Ruinas suspendidas, piedra, portales y energía cósmica; referencia de entorno en las miniaturas. | Azul noche, índigo, violeta y cian. |

En los mundos 4–6 las miniaturas orientan el entorno y el color. No constituyen una colección ya definida de personajes u objetos; las piezas nuevas deben heredar el dibujo y el acabado general de esta guía.

## Escenarios

- Pintura digital de fantasía con textura controlada, perspectiva clara y profundidad atmosférica. El fondo puede ser más pictórico que los personajes.
- Primer plano que enmarca, plano medio para la acción y fondo distante más suave. Reducir detalle y contraste detrás del personaje y del texto.
- En fondos de combate, dejar una superficie central continua y despejada, aproximadamente la mitad del ancho, donde apoyar al rival.
- Mantener coherencia entre la perspectiva del suelo y los objetos. Las luces ambientales pueden variar por mundo, conservando la lectura de las figuras.
- Entregar el escenario sin personajes, textos, barras de vida ni interfaz cuando se solicite un fondo reutilizable.

## Interfaz e iconos

- Base azul marino, paneles azul pizarra y texto claro. Dorado para bordes destacados, recompensas y acciones principales; verde para progreso y éxito, rojo para daño y errores.
- Colores existentes de referencia: fondo `#0f172a`, panel `#1e293b`, texto `#f8fafc`, dorado destacado `#facc15` y verde `#10b981`.
- Formas redondeadas, bordes definidos y relieve discreto en botones. Evitar ornamentos que compitan con el ejercicio.
- Títulos gruesos y de aspecto redondeado; instrucciones y fórmulas con máxima legibilidad. Una futura unificación tipográfica debe comprobar la carga real de fuentes y la compatibilidad de símbolos y acentos.
- Los iconos ilustrados nuevos deben simplificar el mismo lenguaje de contorno y color. Los emojis existentes son recursos funcionales; no deben usarse como referencia de dibujo para nuevos assets.

## Encuadre y entrega

- Personajes: cuerpo completo, pose clara de reposo o combate y vista de tres cuartos. Para enemigos, mantener la orientación de la referencia principal de su serie.
- Objetos: vista de tres cuartos por defecto, salvo iconos frontales, elementos de suelo u otra función que requiera una proyección distinta.
- Mantener todos los accesorios dentro del encuadre y un margen libre aproximado del 8–12 % cuando sea compatible con la composición.
- Personajes y objetos aislados: PNG con canal alfa real, sin escenario, suelo ni sombra proyectada incorporada. El apoyo y la sombra pueden componerse en el juego. Verificar sobre fondo claro y oscuro; el damero no debe formar parte de los píxeles.
- Fondos: imagen opaca horizontal, normalmente 16:9. Para sustituciones, respetar el formato y las necesidades del recurso existente.
- No incluir textos, marcas de agua o interfaz en ilustraciones reutilizables. Las letras necesarias deben incorporarse en la interfaz.
- Verificar las piezas a su tamaño real de uso. Para iconos, revisar también una reducción a 64–96 px: eliminar detalle que se convierta en ruido.
- Conservar el original y registrar el prompt y los archivos de referencia en un `.prompt.txt` o en el archivo de prompts de la serie. Registrar el texto efectivo, evitando entradas vacías o `undefined`.

## Ajustes acordados para dar continuidad

1. Usar la claridad de la Manzana Pirata como base de dibujo para futuras piezas.
2. Reducir el exceso de brillo y detalle en nuevos objetos comunes; conservar los reflejos que explican el material.
3. Reservar la complejidad del guardián, el dragón y la reina para personajes de rango comparable.
4. Mantener la diferencia deliberada entre figuras entintadas y fondos pictóricos, cuidando que contraste, perspectiva y luz los integren.

Evitar cambios hacia fotorrealismo, render 3D, pixel art, minimalismo plano sin volumen, anime de proporciones realistas o estilos con textura envejecida dominante, salvo petición explícita del usuario.

## Base de prompt para próximas piezas

Adaptar este texto al objeto y adjuntar las referencias visuales pertinentes. No repetir atributos de personaje si se está creando un objeto inanimado.

> Crear [objeto o personaje] para Kalkú, [mundo y función]. Usar [archivo] como referencia principal de dibujo y [archivo opcional] como referencia de material. Mantener caricatura de aventuras de inspiración ochentera con acabado digital limpio: contorno exterior oscuro y orgánico, líneas interiores más ligeras, formas amplias, silueta reconocible, colores vivos y cálidos, sombras sencillas con bordes definidos y brillos dibujados localizados según el material. [Materiales, paleta, expresión si corresponde y accesorio principal]. Complejidad [básica, avanzada o jefe]. Vista [proyección], orientación coherente con la serie, figura completa y margen libre alrededor. [PNG aislado con transparencia real / escenario opaco horizontal con espacio central libre]. Sin textos, marcas de agua ni interfaz. Comprobar coherencia con las referencias y legibilidad al tamaño de uso.

## Revisión visual antes de dar por terminada una pieza

- ¿Parece parte del mismo juego al colocarla junto a la referencia principal?
- ¿Se identifica su función o su objeto base por la silueta?
- ¿Contorno, sombras y brillo mantienen el acabado común y explican su material?
- ¿La paleta y los motivos corresponden al mundo elegido?
- ¿Se lee bien a su tamaño de uso y deja espacio para el ejercicio o la interfaz?
- ¿El encuadre conserva accesorios, márgenes y transparencia correcta cuando corresponde?

Si una pieza falla, corregir el rasgo concreto antes de añadir más decoración.
