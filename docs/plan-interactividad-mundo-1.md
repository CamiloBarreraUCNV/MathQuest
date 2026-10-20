# Seguimiento de interactividad: Mundo 1

Actualizado: 19 de octubre de 2026. Implementación técnica disponible: pasos 1–13. Hay cuatro juegos con acceso y prototipo independientes: Prepara el tesoro (cantidades y decenas), La Huerta de las Partes (composición, partes faltantes y repartos), El Taller de Patrones (continuar, crear y reparar secuencias) y La Ruta de los Saltos (recta numérica, avance y retroceso). Las pruebas con el niño y con la voz/lector de pantalla reales se registran por separado abajo.

## Lista de trabajo

- [x] **1. Mapa de aprendizaje.** Propuesta de 30 misiones, objetivos y habilidades en [mapa-aprendizaje-mundo-1.md](mapa-aprendizaje-mundo-1.md). Es planificación, no niveles incorporados al mapa actual.
- [x] **2. Formato de desafíos.** Contrato versionado, validación de configuración y resultados en [contrato-actividades.md](contrato-actividades.md) y `js/activities/quantity-model.js`.
- [x] **3. Componente reutilizable del tesoro.** Modelo independiente del DOM, montaje en un contenedor, eventos y desmontaje. El prototipo carga el mismo componente.
- [x] **4. Cantidades de 1 a 10.** Configuración aleatoria sin repetición inmediata, diez monedas conservadas, añadir/devolver, vaciar, comprobar, teclado, pulsaciones y arrastre. Pruebas de modelo e interfaz.
- [x] **5. Pistas y corrección mejoradas.** Tres niveles: contar, comparar con apoyo visual y explicar la diferencia. Los errores conservan el intento, sin corazones ni penalización. La ayuda se registra en el resultado.
- [x] **6. Instrucciones sonoras.** Lectura explícita, preferencia por es-CL y alternativa en español, botón de detener y cancelación al cambiar de encargo, esconder la pestaña o desmontar. Si falla la voz, se puede continuar visualmente.
- [x] **7. Demostración opcional.** «Muéstrame cómo» abre un ejemplo separado, sin mover los objetos del intento ni entregar respuestas. Se puede cerrar; no aparece por inactividad. Respeta reducción de movimiento.
- [x] **8. Revisión técnica de móvil y accesibilidad.** Controles principales de al menos 64 × 64 px; monedas de al menos 44 × 44 px con botones grandes alternativos, teclado, foco visible, avisos accesibles, contraste y comprobaciones de 320 a 1280 px. Ver [revisión y pendientes manuales](revision-accesibilidad-tesoro.md).
- [x] **9. Nivel piloto dentro del juego.** Opción «Jugar al tesoro» en el nivel 1 de la Isla: cinco encargos distintos de 1–10, validación del modelo por el motor, 3 estrellas y 85 XP al finalizar, desbloqueo del nivel 2 y logros existentes. Sin penalizar errores ni ayudas. Se conservan las alternativas, los identificadores y las partidas; no se recompensa cada movimiento ni se duplica una entrega.
- [x] **10. Cantidades hasta 20.** Opción «Hasta 20» sin retirar «Hasta 10», dos marcos de diez en cada zona, grupos reales de diez monedas que se pueden mover y separar, dos decenas para representar 20, conteo continuo y pistas sobre decenas/unidades. Conservación de los veinte objetos, teclado, tacto, recompensas y partidas comprobados.
- [x] **11. Composición y descomposición.** Juego independiente «La Huerta de las Partes», con manzanas y dos canastas: juntar partes y escribir el total, completar B conservando A, y repartir de dos maneras distintas. Hasta 10 o 20, partes de al menos una manzana, validación de las manzanas colocadas y parejas distintas, pistas, ejemplo, lectura, botones, teclado y arrastre. Una primera solución parcial no concede progreso ni recompensa.
- [x] **12. Patrones.** Juego independiente «El Taller de Patrones»: continuar, crear y reparar AB, AAB, ABC y series numéricas. Construcción con piezas y escritura de números; acepta creaciones propias que respeten la regla. Series hasta 20 con saltos de 1 y 2, y ampliación opcional hasta 100 con 5 y 10; ambos sentidos. Pistas, grupos visuales, ejemplo, voz explícita y controles para teclado y tacto. Validación del modelo, cinco retos y recompensas del piloto sin cambiar el guardado.
- [x] **13. Recta numérica y saltos.** Juego independiente «La Ruta de los Saltos»: retos aleatorios de avance y retroceso, saltos de 1, 2, 5 y 10, rangos 0–20 y 0–100. Recta a escala con arcos y flechas, vista ampliada por unidades y recorrido general hasta 100, historial de huellas, deshacer y volver a la salida. Se valida cantidad, tamaño, dirección y continuidad de todos los saltos, además del destino. Pistas, voz, ejemplo separado, teclado, tacto y cinco rutas con recompensas del piloto.
- [ ] **14. Balanza.** Referencia fija, añadir/retirar y validación de cantidades, independiente del ángulo animado.
- [ ] **15. Clasificación y pictogramas.** Actividades separadas para formas, registro de datos y construcción/lectura de pictogramas.
- [ ] **16. Contenidos restantes.** Ubicación, longitud, tiempo, líneas y otras necesidades detectadas en el mapa curricular.
- [ ] **17. Ruta y seguimiento de aprendizaje.** Incorporar las misiones, repasos y evidencia de habilidades; separar avance RPG de aprendizaje.

## Cómo revisar la entrega actual

Abrir [el juego](../index.html) → Isla de los Números → nivel 1 → «Jugar al tesoro». Completar cinco cofres, avanzar entre encargos y comprobar la pantalla de resultados, el nivel 2 desbloqueado y el guardado al recargar. «Reintentar» vuelve al tesoro. Salir antes de completar los cinco descarta únicamente ese intento y no concede XP ni estrellas. El desafío original de alternativas sigue en el mismo nivel.

El piloto comparte el avance RPG del nivel 1: sus tres estrellas reconocen los cinco cofres resueltos, incluso con correcciones y ayudas. No acreditan todos los contenidos del nivel original ni dominio curricular. Los intentos y ayudas quedan en el resumen de la sesión; el seguimiento persistente de habilidades corresponde al paso 17.

Abrir [el prototipo del tesoro](../mockup-tesoro-monedas.html) directamente en el navegador. No hace falta servidor, instalación ni conexión. No lee ni escribe la partida de Kalkú.

Para revisar el paso 10, seleccionar **Hasta 20 · decenas y unidades** antes de entrar al tesoro, o en el selector del prototipo. El rango es 1–20, con veinte monedas disponibles y dos marcos por zona. La modalidad inicial sigue siendo hasta 10. En el juego se mantienen los cinco encargos y las mismas recompensas; «Reintentar» conserva el rango elegido. El prototipo empieza una práctica nueva al cambiar de rango.

1. Llenar un marco con diez monedas y pulsar «Agrupar 10 en una decena». Las diez monedas siguen visibles; cambia su representación, no su valor.
2. Añadir o devolver la decena mediante su botón: se trasladan exactamente diez monedas.
3. Pulsar «Separar en 10 monedas»: siguen en el mismo lado y vuelven a poder moverse una por una.
4. Llevar dos decenas al cofre: hay veinte monedas. Para corregir de 20 a 19, separar una decena y devolver una moneda.
5. Comprobar también 9, 10, 11 y 14; la actividad acepta monedas sueltas, decenas o una mezcla con la cantidad correcta. No obliga a agrupar para acertar.
6. Vaciar devuelve todas las monedas; las decenas ya formadas regresan juntas a la reserva. Un encargo nuevo vuelve a empezar sin grupos.

1. Mover monedas pulsando o arrastrando; devolverlas desde el cofre.
2. Comprobar con menos o más monedas: el intento continúa y se puede corregir.
3. Entregar la cantidad exacta: el cofre se cierra y suma una entrega una sola vez.
4. Iniciar otro encargo: el cofre queda vacío y el objetivo cambia. Cada tanda mezcla las cantidades 1–10 o 1–20, según la modalidad.
5. Usar Tab y Enter/Espacio; pedir una pista o activar el conteo asistido.
6. Pedir pistas sucesivas: primero invita a contar, luego compara y finalmente explica cuántos añadir o devolver. El nivel vuelve a cero en otro encargo.
7. Pulsar «Escuchar encargo»; detener con el mismo botón o Escape. Si no hay una voz disponible, usar el texto o el ejemplo.
8. Abrir «Muéstrame cómo»: solo se mueve un objeto de ejemplo en un panel separado. Las monedas y entregas reales no cambian.
9. En móvil o con teclado, usar «Añadir moneda» y «Devolver moneda» como alternativa al arrastre.

Pruebas: `node tests/quantity.test.cjs`, `node tests/activity-speech.test.cjs` y `node tests/quantity-ui.test.cjs`. La última usa Playwright, como las pruebas de interfaz existentes, y admite `PLAYWRIGHT_MODULE` y `BROWSER_CHANNEL`. Las pruebas de voz usan dobles controlados; no acreditan la calidad audible de una voz instalada.

## Cómo revisar el paso 11

Entrar en **Isla de los Números → Juegos de la isla → Jugar a la huerta**, o abrir [el prototipo independiente de La Huerta](../mockup-huerta-partes.html). Elegir el tamaño de la cosecha y cómo jugar. El tesoro conserva su acceso y prototipo propios.

1. **Juntar dos cantidades:** contar A y B y escribir el total. Probar una respuesta incorrecta antes de corregir; las manzanas dadas se conservan.
2. **Completar la canasta:** A está protegido; añadir o devolver en B hasta alcanzar el total. Siempre falta al menos una manzana. «Volver a empezar» conserva A.
3. **Repartir de dos formas:** formar el total, comprobar, pulsar «Buscar otra forma» y usar otra pareja de cantidades. Cada canasta necesita al menos una manzana; los totales empiezan en 4 para permitir dos parejas distintas. Cambiar 3 + 5 por 5 + 3 no añade una solución; 4 + 4 sí.
4. Probar pistas, conteo, voz y el ejemplo separado. Las pulsaciones, botones, teclado y arrastre permiten modificar los canastas editables.
5. En el juego, completar cinco encargos concede las mismas estrellas y XP. Una sola forma del reparto queda pendiente y no desbloquea niveles. Salir descarta el intento; reintentar conserva modalidad y rango.

La composición se prueba con `node tests/composition.test.cjs`; `tests/game.test.cjs` cubre validación y recompensas de las tres modalidades, y `tests/quantity-ui.test.cjs` cubre el recorrido real del tesoro.

## Cómo revisar el paso 12

Entrar en **Isla de los Números → Juegos de la isla → Jugar al taller**, o abrir [el prototipo independiente de El Taller de Patrones](../mockup-taller-patrones.html). No comparte piezas, pantallas de configuración ni sesiones con la huerta o el tesoro.

1. Elegir **AB**, **AAB**, **ABC** o **Números**, y **Continuar**, **Crear mi patrón** o **Reparar**. Cambiar una opción empieza otro reto.
2. Con piezas: pulsar un espacio y después una hoja, concha, estrella o flor. Los espacios dados de continuar están protegidos; borrar y reemplazar permite corregir sin perder el resto.
3. Con números: escribir directamente. Hasta 20 se usan saltos constantes de 1 o 2; hasta 100 se añaden 5 y 10. Se permite avanzar o retroceder, conservando rango y salto. La ampliación hasta 100 es práctica de conteo, no certificación de todo el OA 11.
4. En **Crear**, inventar la combinación: AB requiere dos piezas distintas; AAB repite dos iguales y una distinta; ABC requiere tres distintas. Debe mantenerse el grupo durante tres repeticiones. Las series numéricas propias se validan por su regla, sin una respuesta oculta única.
5. En **Reparar**, el reto inicial tiene exactamente una pieza equivocada. Comprobar conserva las correcciones; «Volver a empezar» recupera el reto original.
6. Usar tres pistas, «Ver grupos», voz y ejemplo separado. Ninguna ayuda mueve piezas ni completa el intento. Los botones y espacios admiten Tab y Enter/Espacio; los números se escriben con teclado y se comprueban con Enter.
7. Completar cinco retos dentro del RPG: concede 3 estrellas y 85 XP y conserva la configuración al reintentar. Salir antes no concede progreso. Comparte el crédito RPG del nivel 1 con los otros pilotos; el prototipo independiente no toca la partida.

Pruebas: `tests/pattern.test.cjs` cubre reglas, aleatoriedad, las tres modalidades, ambas direcciones, errores y ayudas; `tests/game.test.cjs` cubre las 24 configuraciones y el guardado; las pruebas «workshop» de `tests/quantity-ui.test.cjs` cubren uso real, independencia, teclado, voz simulada, móvil e integración.

## Cómo revisar el paso 13

Entrar en **Isla de los Números → Juegos de la isla → Jugar a los saltos**, o abrir [el prototipo independiente de La Ruta de los Saltos](../mockup-ruta-saltos.html).

1. Elegir rango **0–20** o **0–100**, dirección (adelante, atrás o ambas) y tamaño de los saltos pedidos (1, 2, 5, 10 o variado). Cambiar una opción inicia otro reto. Cada encargo pide entre uno y cuatro saltos posibles dentro del rango; con saltos de 10 hasta 20, como máximo pide dos.
2. Leer el número de salida y el encargo. Elegir un tamaño en los botones y usar **Avanzar** o **Retroceder**. Cada acción registra un salto; la salida no se cuenta como salto.
3. Observar la rana, los arcos con flechas, el número actual, el contador y las huellas. La vista ampliada abarca 20 unidades, con una marca por unidad. En móvil se espacian las etiquetas numéricas para que no se superpongan; las marcas conservan su valor de 1.
4. Hasta 100, revisar la vista general y navegar por tramos con **Ver tramo anterior/siguiente**; **Ver mi posición** recupera la ampliación de la rana. Navegar solo cambia la vista, no mueve la rana ni responde.
5. Probar un tamaño equivocado, pocos saltos o más de los pedidos y comprobar: el intento se conserva y se explica qué revisar. Llegar al destino mediante otros saltos no completa el reto. **Deshacer salto** conserva el resto; **Volver a la salida** limpia el recorrido del mismo encargo. No se permite salir de 0–20/100; después de 12 saltos de exploración se debe deshacer o reiniciar.
6. Pedir pistas, escuchar y abrir el ejemplo: las ayudas no mueven la rana ni conceden progreso. Escape detiene las ayudas. Botones con Tab y Enter/Espacio y pulsaciones táctiles permiten jugar sin arrastrar.
7. Dentro del RPG, resolver cinco rutas concede el crédito actual del nivel 1 (3 estrellas, 85 XP y desbloqueo del nivel 2). Salir descarta la partida incompleta; reintentar conserva rango, dirección y tamaño. El prototipo no toca la partida.

Pruebas: `tests/numberline.test.cjs` cubre generación, límites, recorridos completos y ayudas; `tests/game.test.cjs` cubre las 30 configuraciones, validación propia y guardado; las pruebas «number-line» de `tests/quantity-ui.test.cjs` cubren botones reales, corrección, teclado, tacto emulado, voz simulada, escalas, etiquetas legibles e integración.

## Validación manual pendiente

- [ ] Escuchar la voz del dispositivo habitual: pronunciación, volumen, acento y velocidad cómodos.
- [ ] Recorrer el prototipo con el lector de pantalla habitual, si se utiliza; confirmar que los avisos sean claros y no repetitivos.
- [ ] Probar con el niño: comprensión del encargo, pistas, botones y demostración; registrar dónde necesita acompañamiento.
- [ ] Probar arrastre y desplazamiento en el dispositivo táctil real, además de la emulación automatizada.

## Próximo bloque recomendado

Paso 14: balanza, con referencia fija, añadir/retirar y validación de cantidades independiente del ángulo animado. Conviene revisar antes los cuatro juegos con el niño. Las casillas anteriores indican implementación técnica; no sustituyen las pruebas manuales pendientes.
