# Contrato de actividades interactivas v1

Implementación: `js/activities/quantity-model.js`, `quantity-data.js`, `activity-speech.js` y `quantity-activity.js`, en ese orden, seguidos de `js/treasure-mockup.js`. Se carga con scripts clásicos para poder abrir el prototipo desde el sistema de archivos sin servidor ni módulos de red.

## Definición de práctica

`KalkuActivityData.QUANTITY_PRACTICE` es la definición hasta 10; `QUANTITY_PRACTICE_20` amplía hasta 20 con decenas reversibles. Ambas se editan en `js/activities/quantity-data.js`. La primera conserva su ID y configuración:

```javascript
{
  schemaVersion: 1,
  id: 'w1-quantity-practice-1-10',
  type: 'quantity',
  mode: 'populate',
  worldId: 'world-1',
  grade: 1,
  objectiveIds: ['MA01 OA 03'],
  skillIds: ['represent-quantity-1-10'],
  instruction: '¡Prepara {target} {objects} para zarpar!',
  objects: {
    singular: 'moneda', plural: 'monedas',
    image: 'assets/treasure-activity/coin-gold.png'
  },
  rules: {
    minTarget: 1, maxTarget: 10, totalObjects: 10,
    initialQuantity: 0, responseKind: 'final-quantity'
  },
  presentation: { reserveTitle: 'Monedas del barco', destinationTitle: 'Tu cofre' }
}
```

- `id` identifica la definición; no desbloquea niveles ni sustituye identificadores existentes.
- `type` es la familia de interacción; se mantiene separado de `mechanicType`, que ya describe habilidades de enemigos en el juego.
- `mode: 'populate'` es el único modo implementado. Declarar otros modos produce un error en lugar de iniciar una actividad incorrecta.
- Objetivos y habilidades registran el alcance curricular; no acreditan dominio por sí mismos.
- `instruction` usa los marcadores `{target}` y `{objects}`. Los títulos, el texto y los nombres de objetos se insertan como texto, no como HTML.
- La imagen debe ser una ruta relativa al proyecto. Se pueden reutilizar las ilustraciones existentes; no se necesitan assets nuevos.
- Rango admitido: `1 <= minTarget <= maxTarget <= totalObjects <= 20`; `0 <= initialQuantity <= minTarget`. `allowTens` es un booleano opcional, desactivado por defecto, que requiere al menos diez objetos. El cero como objetivo, cantidades mayores a 20 y los desafíos con dos recipientes quedan pendientes.

## Desafío y validación

`createQuantityChallengeFactory(definition, random?)` devuelve una función que crea desafíos con `id` de intento, `definitionId`, `targetQuantity` y una copia de la definición. La función aleatoria inyectable debe devolver valores en `[0, 1)`.

Los objetivos se mezclan en tandas que contienen todo el rango. No se repite el último objetivo entre tandas cuando hay al menos dos valores. Un rango fijo, por ejemplo 7–7, es válido y necesariamente repite 7.

`validateQuantityDefinition` valida antes de montar o iniciar la práctica. La sesión no altera la configuración del llamador.

## Modelo independiente de la interfaz

`new QuantitySession(challenge)` no usa DOM, almacenamiento, motor de combate ni audio.

- `move(tokenId, 'chest' | 'reserve')`: mueve un objeto real; rechaza identificadores inexistentes, destinos inválidos y movimientos después de completar.
- `groupTen(location, tokenIds?)`: crea un grupo de exactamente diez objetos sueltos del mismo lado. Sin lista usa los primeros diez disponibles. Rechaza grupos incompletos, objetos repetidos, ajenos o ya agrupados. Devuelve el ID del grupo o `null`.
- `moveTen(groupId, destination)`: traslada los diez objetos reales del grupo en una sola operación. No crea objetos ni permite movimientos parciales; para mover una unidad agrupada primero hay que separarla.
- `ungroupTen(groupId)`: libera diez objetos, sin moverlos ni cambiar su cantidad. Tanto agrupar como separar y mover grupos se bloquea después de completar.
- `empty()`: devuelve todos los objetos sin cambiar el encargo. En una variante con cantidad inicial, puede dejar el cofre en cero; no restaura automáticamente esa cantidad inicial.

Los grupos conservan los identificadores originales de sus diez objetos. `getSnapshot()` añade copias de `groups`, `loosePlacedTokens`, `looseReserveTokens`, `representationActions` (agrupaciones, separaciones y traslados) y `placeValue` (decenas y unidades canónicas de la cantidad final). `placedTokens` y `reserveTokens` siguen incluyendo todas las monedas, estén agrupadas o sueltas. Vaciar devuelve las decenas intactas a la reserva; un nuevo desafío no hereda grupos.

Por ejemplo, 20 monedas sueltas y dos decenas tienen `finalQuantity: 20` y `placeValue: { tens: 2, units: 0 }`. Solo la segunda representación tiene dos entradas en `groups`. Se valida la cantidad final en ambos casos; agrupar es una herramienta educativa, no un requisito para acertar ni una respuesta adicional. No genera recompensas o intentos y no se contabiliza como pista.
- `setCounting(boolean)` y `useHint()`: registran la ayuda utilizada sin penalizaciones. `useHint()` avanza hasta un máximo de tres niveles y devuelve el nivel actual; pedir más pistas repite el último nivel. Las comprobaciones incorrectas también ofrecen una pista y la registran.
- `useDemonstration()`: registra que se ha mostrado el ejemplo, sin modificar objetos, intentos o finalización.
- `getSnapshot()`: devuelve copias de las colecciones y del registro de ayuda.
- `submit()`: comprueba la cantidad final. Los errores conservan los objetos para corregir; completar bloquea los movimientos. Repetir la comprobación de una sesión terminada no genera otra finalización.

El resultado incluye `challengeId`, `definitionId`, `responseKind`, `targetQuantity`, `initialQuantity`, `finalQuantity`, `netChangeQuantity`, `attempts`, `assistance`, `isCorrect` e `isNewCompletion`.

`assistance` contiene `hintsUsed`, `hintLevel`, `countingUsed` y `demonstrationUsed`. Son datos de acompañamiento; no descuentan XP ni estrellas. Un nuevo desafío empieza con sus propios registros. La preferencia explícita de conteo puede mantenerse entre encargos; las pistas no fuerzan esa preferencia para la siguiente misión.

**Ejemplo:** cantidad inicial 4, objetivo 10. Con seis objetos añadidos, `finalQuantity` es **10** y `netChangeQuantity` es **6**. Se valida 10. No se mezcla con un índice de alternativa ni con un ambiguo `expectedAnswer: 6`.

## Montaje y reutilización

```javascript
const activity = KalkuActivities.mountQuantityActivity(container, {
  definition: KalkuActivityData.QUANTITY_PRACTICE,
  onComplete(result) {
    console.log(result.finalQuantity, result.assistance);
  }
});

activity.start();       // otro encargo
activity.getSnapshot(); // copia del estado del intento
activity.destroy();     // limpia el contenido y todos sus eventos
```

La interfaz genera su contenido dentro del contenedor, utiliza referencias locales y crea identificadores accesibles únicos. Admite varias instancias independientes y desmontaje al cambiar de pantalla. Volver a montar sobre el mismo contenedor destruye la instancia anterior.

El archivo anfitrión `js/treasure-mockup.js` solo monta la definición. `css/quantity-activity.css` delimita los estilos compartidos a `.quantity-widget`; `css/treasure-mockup.css` presenta la página independiente y `css/quantity-level.css` presenta el anfitrión dentro del juego.

Al terminar se emite `kalku:activity-completed` desde el contenedor y se llama opcionalmente a `onComplete`, una vez por finalización y con copias independientes del mismo resultado. Un consumidor debe escoger un canal para otorgar recompensas, no sumar por ambos. El componente no modifica XP, estrellas, corazones ni `localStorage`.

En el juego, `createSession()` permite al anfitrión entregar una sesión del motor al componente, y `allowSkip: false` oculta «Otro encargo». No se simulan respuestas mediante `submitAnswer(question.correct)`.

## Piloto integrado: paso 9

- `startQuantityLevel(1, maxTarget = 10)` inicia cinco encargos en el nivel 1 de la Isla, sin combate y disponible incluso sin corazones. Solo acepta rangos 10 o 20. No crea IDs ni sustituye el cuestionario original; la ficha permite elegir el rango antes de «Jugar al tesoro». Reintentar conserva la modalidad elegida.
- `nextQuantitySession()` devuelve la sesión pendiente; solo crea otra cuando el motor ya ha aceptado la anterior. Los cinco objetivos provienen de una tanda mezclada de 1–10 o 1–20 y no se repiten dentro del intento.
- `acceptQuantityCompletion(result)` consume únicamente la notificación `onComplete`. Comprueba la sesión que posee el motor: estado terminado, cantidad final igual al objetivo e identificador coincidente. Un evento DOM o un `isCorrect: true` aislado no acredita una entrega. Cada sesión se acepta una sola vez.
- Hasta completar las cinco entregas no se concede XP ni avance. Al terminar se reutiliza `finishLevel()`: 3 estrellas, 85 XP y desbloqueo del siguiente nivel de la Isla, con los logros de finalización existentes. No hay racha de combate ni penalizaciones por intentos o ayudas. Las estrellas representan finalización RPG, no dominio curricular.
- Los resultados se conservan en `lastResults.activitySummary` con cantidades, intentos y ayuda. Este resumen es de sesión; no amplía todavía el guardado ni el seguimiento de habilidades. Las recompensas y estrellas sí se guardan con el esquema actual.
- Repetir una notificación o pedir resultados de nuevo no suma recompensas. Una nueva partida completa del tesoro puede volver a ganar 85 XP, igual que repetir un nivel del juego.
- Salir, reiniciar progreso o cambiar al cuestionario invalida el intento. El desmontaje cancela voz, demostración, arrastre y eventos. Abrir el perfil detiene las ayudas. Una sesión abandonada no puede conceder recompensas posteriores.

## Ayudas y accesibilidad de los pasos 5–8

- `getQuantityHint(snapshot, objects)` construye las pistas: invitación a contar, comparación y explicación numérica. Desde la segunda se numeran los objetos del cofre y se destaca la zona. No se eliminan objetos de una respuesta incorrecta.
- La demostración es un panel independiente con una sola moneda de ejemplo, mano indicadora y tres instrucciones. La animación termina, no se repite automáticamente y se desactiva con reducción de movimiento. El panel no tiene controles de respuesta ni altera la cantidad del intento.
- La lectura usa `createActivitySpeech(window, onState)`: `speak(text)`, `stop()` y `destroy()`. Estados: `idle`, `loading`, `speaking`, `unavailable`. Prefiere voz es-CL, luego otra voz en español; no cambia a inglés. Espera hasta 1,8 segundos si las voces aún no han cargado y controla el inicio fallido de reproducción.
- La API y las voces dependen del navegador/dispositivo. No se suministran grabaciones ni se garantiza lectura sin conexión para voces que requieran servicios del sistema. Todo el ejercicio puede completarse sin audio.
- Solo el componente que posee la lectura activa puede cancelarla. Un segundo componente toma el turno de voz; destruir otro componente no interrumpe la lectura actual.
- Cambiar de encargo, completar, esconder la pestaña, perder el foco de la ventana o desmontar cancela las ayudas activas. Escape detiene lectura, ejemplo y arrastre. Cancelar un arrastre evita que soltar el botón se convierta en un clic accidental.
- Los botones grandes permiten añadir/devolver sin arrastrar. Los movimientos se anuncian en una región de estado; los grupos y objetos tienen nombres accesibles y referencias de instrucciones únicas por instancia.

La [revisión de accesibilidad](revision-accesibilidad-tesoro.md) distingue comprobaciones automatizadas y verificaciones pendientes con personas y dispositivos reales.

## Compatibilidad

No se modifican `levels-data.js`, su generador, los identificadores 1–30, las preguntas actuales ni el esquema del guardado. `index.html` carga los scripts de cantidades, composición, patrones, recta numérica y voz antes de `game.js` y `ui.js`. La expansión de niveles tendrá su propia migración y pruebas.

## Composición y descomposición: paso 11

`composition-model.js`, `composition-data.js` y `composition-activity.js` implementan la familia `type: 'composition'`, con `schemaVersion: 1`. Antes de montar deben cargarse el modelo, los datos y el servicio de voz. En la página independiente el modelo inicializa `KalkuActivities` antes de cargar `activity-speech.js`. Los estilos están delimitados a `.composition-widget` en `css/composition-activity.css`; las manzanas y canastas usan emojis provisionales.

`KalkuActivityData.COMPOSITION_PRACTICES[maxTarget][mode]` proporciona las definiciones hasta 10 y 20. Cada definición incluye `id`, `worldId`, `grade`, objetivos/habilidades, `minTarget` y `maxTarget`. No usa `rules.responseKind` de cantidades: el tipo de respuesta se deriva del modo.

| Modo | Encargo | Respuesta y validación |
| --- | --- | --- |
| `compose` | Juntar dos cantidades dadas | `responseKind: 'total-quantity'`. A y B se conservan; se escribe un entero. Se valida `answer` contra el total de sus manzanas, no una alternativa. |
| `missing` | Completar B para alcanzar el total | `responseKind: 'missing-part'`. A no se puede modificar; solo B y cosecha son editables. Valida `rightQuantity = targetQuantity - givenLeft`. |
| `split` | Repartir el total de dos maneras | `responseKind: 'two-partitions'`. A y B son editables; se requieren dos parejas de cantidades distintas que sumen el objetivo. |

Los totales se mezclan en tandas sin repetición inmediata. Juntar y completar usan objetivos desde 2 y una parte dada entre 1 y total − 1. Repartir empieza en 4 para que existan dos parejas distintas con ambas partes positivas. En completar, por ejemplo, total 8 y A = 3 significa B = 5, mientras la cantidad final entre ambos es 8. Durante la edición una canasta puede estar vacía, pero no se registra ni se completa una solución con una parte igual a cero.

`CompositionSession` conserva objetos con identificadores únicos y ubicaciones `left`, `right`, `reserve`. La reserva de completar/repartir tiene el rango elegido de manzanas en total, de modo que se puede exceder o quedarse corto y corregir. En juntar hay solo las manzanas dadas en las canastas. `move(id, destination)` valida objeto, destino, estado y partes bloqueadas; `resetPlacement()` devuelve únicamente las partes editables. No se fabrican objetos al mover.

`submit(answer?)` cuenta el intento, valida y devuelve un resultado con copias de partes, cantidades, respuesta escrita, ayudas e historial de soluciones; `emptyPart` indica si hay una canasta vacía. En repartir, la primera pareja válida deja `status: 'solution-found'`; `tryAnother()` limpia el reparto conservando su historial y total. Una pareja y su inversa comparten clave: 3 + 5 y 5 + 3 son la misma pareja. El segundo reparto debe usar otras cantidades, por ejemplo 4 + 4. Solo al completar las dos parejas requeridas se emite `isNewCompletion`, una vez. La validación de definiciones rechaza mínimos inferiores a 2 para juntar/completar y a 4 para repartir.

`mountCompositionActivity(container, { definition, createSession?, onComplete?, allowSkip? })` ofrece `start`, `getSnapshot`, `submit`, `move`, `stopAssistance` y `destroy`. Comparte el registro de montajes con cantidades: cambiar de componente destruye el anterior. Tiene pistas de tres niveles, conteo por canasta, voz explícita, ejemplo estático separado, teclado, botones y arrastre cancelable. Las ayudas no mueven los objetos del intento ni penalizan el resultado.

En el juego, `startCompositionLevel(1, mode, maxTarget)` y `startQuantityLevel` crean un `activityRun` común. `nextActivitySession()` conserva la sesión pendiente y `acceptActivityCompletion(result)` verifica el modelo propio (`CompositionSession.isCorrect()`), su estado y el ID, sin confiar en el evento o en un `isCorrect` enviado por la interfaz. Se conservan los alias `quantityRun`, `nextQuantitySession` y `acceptQuantityCompletion` para los consumidores anteriores.

Cinco encargos completos conceden las mismas 3 estrellas y 85 XP del piloto y desbloquean el nivel 2. La primera pareja de un reparto no cuenta como encargo terminado. Salir invalida la sesión y reintentar conserva modo y rango. `lastResults.activityType` distingue `quantity` de `composition`, y `activitySummary` incluye `mode`, cantidades dadas/finales, `answer`, `solutions`, intentos y ayuda. El seguimiento persistente de habilidades sigue reservado al paso 17; el guardado RPG no cambia de esquema.


### Juego independiente: La Huerta de las Partes

La composición tiene acceso propio en **Isla de los Números → Juegos de la isla → Jugar a la huerta**, con configuración y partida separadas de la pantalla del tesoro. `startCompositionLevel` en la interfaz es su entrada propia; el tesoro ya no ofrece sus modalidades. La sesión, cancelación y resultado reutilizan el motor común de Kalkú, sin migrar el guardado. En esta etapa ambos pilotos conservan el crédito RPG del nivel 1; la separación de experiencia no introduce nuevos IDs de nivel ni un seguimiento curricular persistente.

`mockup-huerta-partes.html` y `js/garden-mockup.js` forman un anfitrión independiente sin motor ni guardado. Carga únicamente modelo/datos de composición, voz y su controlador, con `css/composition-activity.css` y `css/garden-game.css`. Su instancia es `window.gardenActivity`. No carga monedas, cofres, escenario pirata ni módulos de cantidades. El logo de Kalkú es el único PNG compartido; manzanas y canastas son emojis de interfaz provisionales.

`mockup-tesoro-monedas.html` conserva solo cantidades y decenas, sin cargar composición. Ambos prototipos enlazan al otro juego mediante navegación, sin mezclar actividades ni sesiones.

## Patrones: paso 12, El Taller de Patrones

`pattern-model.js`, `pattern-data.js` y `pattern-activity.js` implementan `type: 'pattern'`, `schemaVersion: 1`, `responseKind: 'sequence'`. El modelo es puro y exporta `validatePatternDefinition`, `createPatternChallengeFactory` y `PatternSession` para navegador y CommonJS. Los datos están en `PATTERN_PRACTICES[maxNumber][family][mode]`: `maxNumber` es 20 o 100, `family` es `AB`, `AAB`, `ABC` o `number`, y `mode` es `continue`, `create` o `repair`. Se conservan identificadores, mundo, curso, objetivos y habilidades.

- **Continuar:** dos grupos dados y un tercero por completar, o cuatro números dados y dos por escribir. Los espacios dados no se modifican.
- **Crear:** todos los espacios están vacíos. Valida tres repeticiones de la estructura elegida con letras distintas representadas por piezas distintas; no compara con una combinación predeterminada. Las series numéricas tienen seis enteros y un salto constante permitido, positivo o negativo.
- **Reparar:** tres grupos o seis números con exactamente un error en una posición interior. Se permite editar la secuencia completa; debe recuperar la regla original. Reiniciar devuelve el error original.

Las piezas disponibles son `leaf`, `shell`, `star` y `flower`. La validación no depende del emoji, color, foco o texto visible. Los números se mantienen entre 1 y el máximo: hasta 20 admite saltos de 1 y 2; la ampliación hasta 100 añade 5 y 10. Los desafíos usan una bolsa mezclada de reglas sin repetición inmediata, también si el generador aleatorio devuelve un valor constante válido. Crear es una consigna abierta, sin respuesta única oculta.

`PatternSession.set(index, value)` admite una pieza, un entero válido o `null` para borrar, y rechaza posiciones fijas o sesiones terminadas. `reset()`, `isCorrect()`, `submit()`, `getSnapshot()`, `useHint()`, `getHint()`, `useGrouping()` y `useDemonstration()` completan el contrato. El resultado contiene copias de `values`, `initialValues`, `editable`, modalidad, familia, rango, intentos y ayudas; solo se emite `isNewCompletion` una vez. Una respuesta errónea conserva las piezas, y las ayudas no modifican la secuencia ni dan progreso.

`mountPatternActivity(container, { definition, createSession?, onComplete?, allowSkip?, random? })` comparte el registro de montajes con los otros componentes: reemplazar un montaje cancela su voz y sus eventos. Expone `start`, `getSnapshot`, `submit`, `stopAssistance` y `destroy`. Los controles admiten pulsación y teclado; los números se introducen directamente. La voz se activa explícitamente y se cancela al cambiar de reto, desmontar, esconder la pestaña o pulsar Escape. El ejemplo separado corresponde a la familia elegida y no mueve piezas reales. Los estilos quedan en `css/pattern-game.css` y `.pattern-widget`.

`mockup-taller-patrones.html` y `js/pattern-mockup.js` cargan únicamente sus módulos y voz, sin motor ni almacenamiento. El logo aprobado se reutiliza; hojas, conchas, estrellas y flores son emojis provisionales. Desde la huerta se puede navegar al taller sin compartir sesiones.

En el RPG, `startPatternLevel(1, mode, family, maxNumber)` inicia su partida propia de cinco retos. `acceptActivityCompletion` valida el estado y `isCorrect()` de la sesión que posee el motor; no confía en un evento enviado por el DOM. Reintentar conserva modalidad, familia y rango; salir descarta el intento. El resultado tiene `activityType: 'pattern'` y el resumen de sus cinco secuencias. Como los otros pilotos, concede el crédito RPG del nivel 1 (3 estrellas, 85 XP y desbloqueo del nivel 2), sin nuevos IDs ni migraciones. El seguimiento persistente de habilidades queda en el paso 17.

## Recta numérica: paso 13, La Ruta de los Saltos

`numberline-model.js`, `numberline-data.js` y `numberline-activity.js` implementan `type: 'numberline'`, `schemaVersion: 1` y `responseKind: 'jump-route'`. El modelo exporta `validateNumberlineDefinition`, `createNumberlineChallengeFactory` y `NumberlineSession` para navegador y CommonJS. `NUMBERLINE_PRACTICES[maxNumber][direction][stepSize]` configura 30 variantes: máximos 20 o 100; `forward`, `backward` o `mixed`; saltos de 1, 2, 5 o 10, o `0` para variar entre ellos. Incluye mundo, curso, objetivos y habilidades; `stepSize: 0` es solo configuración, nunca un salto de tamaño cero.

Cada reto tiene `start`, `direction` (1 o −1), `stepSize` y `jumpCount` (1–4), con salida y destino dentro de 0–máximo. No hay números negativos. La bolsa aleatoria contiene únicamente rutas posibles y no repite inmediatamente una ruta al rellenarse, incluso con un generador aleatorio constante válido. Por ejemplo, hasta 20 los saltos de 10 piden como máximo dos saltos. El cero es un punto válido de esta recta; no cambia las reglas de las canastas de la huerta.

`NumberlineSession.jump(direction, size)` añade `{from, to, direction, size}` si el salto usa un tamaño permitido y no sale del rango. Se pueden explorar tamaños o direcciones incorrectos y corregirlos. `undo()` elimina el último salto; `reset()` vuelve a la salida del mismo reto, conservando intentos y ayuda. Como límite de exploración hay 12 saltos: después se debe deshacer o reiniciar. `isCorrect()` exige exactamente los saltos pedidos, continuidad desde la salida, tamaño y dirección correctos en cada salto y destino correcto; no acepta llegar al mismo lugar por otra ruta.

`submit()` conserva el recorrido erróneo, registra el intento y emite `isNewCompletion` una sola vez. Una sesión terminada no acepta movimientos, deshacer ni reinicio. `getSnapshot()` devuelve copias de los saltos y ayudas, junto con salida, dirección, tamaño, cantidad pedida, destino, posición actual y estado. `useHint()`/`getHint()` ofrecen tres niveles; `useDemonstration()` registra el ejemplo. Ninguna ayuda mueve la rana ni completa la ruta.

`mountNumberlineActivity(container, {definition, createSession?, onComplete?, allowSkip?, random?})` usa el registro común de montajes y expone `start`, `getSnapshot`, `jump`, `submit`, `stopAssistance` y `destroy`. Los botones admiten teclado y tacto. La voz es explícita y se cancela al mover, corregir, cambiar el tamaño, cambiar de reto, esconder la pestaña, desmontar o pulsar Escape. El ejemplo estático 3 → 5 → 7 y su vuelta es independiente del intento. El componente no usa almacenamiento ni confía en posiciones SVG para validar.

La vista ampliada es una recta horizontal a escala de 20 unidades con una marca por unidad, arcos orientados y rana en la posición actual. Se espacian las etiquetas en pantallas estrechas sin alterar la escala. Hasta 100, una vista general con marcas de diez conserva el recorrido completo; los botones de navegación cambian solo la ventana ampliada, y el próximo movimiento vuelve a mostrar la rana. Un historial textual ordenado conserva todos los saltos aunque parte del recorrido quede fuera de la ampliación. No se dobla la recta en filas ni se obliga a arrastrar o acertar una marca pequeña.

`mockup-ruta-saltos.html`, `js/numberline-mockup.js` y `css/numberline-game.css` conforman su página independiente, con logo aprobado y rana emoji provisional. Carga solo sus módulos y el servicio de voz. En el RPG tiene configuración y tarjeta propias; `startNumberlineLevel(1, direction, stepSize, maxNumber)` crea una partida de cinco rutas. El motor verifica el estado e `isCorrect()` de su propia sesión. Reintentar conserva las opciones y salir descarta un intento incompleto. El resultado usa `activityType: 'numberline'` y guarda las cinco rutas en el resumen de sesión. Comparte el crédito RPG del nivel 1 con los otros pilotos (3 estrellas, 85 XP y desbloqueo del nivel 2), sin nuevos IDs o esquema de guardado; el seguimiento persistente de habilidades sigue en el paso 17.
