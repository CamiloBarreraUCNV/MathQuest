# Revisión técnica de accesibilidad: Prepara el tesoro

Fecha: 19 de octubre de 2026. Alcance: prototipo independiente de los pasos 1–8 y comprobaciones del piloto integrado y su ampliación hasta 20 de los pasos 9–10. No es una certificación global del juego principal.

El paso 11 corresponde ahora al juego independiente La Huerta de las Partes, con dos canastas: respuesta escrita mediante teclado numérico, botones y manzanas con sus nombres por canasta, parte fija sin controles editables, foco al buscar otra solución, arrastre y cancelación con Escape, ejemplo independiente y lectura opcional con el servicio de voz compartido. Se emulan pulsaciones táctiles y se verifican controles de 64 px y monedas de 44 px, referencias ARIA y ausencia de desbordamiento horizontal entre 320 y 1280 px. Se revisaron capturas de escritorio y móvil. Esto no sustituye las pruebas pendientes con personas, voces o lectores de pantalla reales.

El paso 12 añade El Taller de Patrones como juego independiente. Se comprueban las tres modalidades y familias AB/AAB/ABC mediante botones reales, y las series numéricas por escritura, corrección y Enter. Las casillas tienen nombres por posición y pieza, las fijas se anuncian como tales y los emojis se acompañan de texto en el taller. Se verifica ausencia de desbordamiento y controles de al menos 64 × 64 px a 320, 390, 768 y 1280 px; las nueve posiciones se distribuyen en tres columnas en móvil y tableta. Se revisan capturas de móvil y escritorio, foco al completar y al cerrar la configuración, trampa de Tab y cancelación de voz al cambiar de actividad. Las pruebas usan voz simulada; la comprensión del niño y la experiencia con voz, tacto o lector reales siguen pendientes.

El paso 13 añade La Ruta de los Saltos, con botones de tamaño de salto, avance, retroceso, deshacer e inicio. La recta SVG es una representación a escala y no requiere seleccionar marcas pequeñas; el historial ordenado describe cada salto y una región de estado anuncia la posición y la corrección. Se prueban los cuatro tamaños en ambos sentidos, los extremos 0, 20 y 100, teclado, tacto emulado y voz simulada. Se verifica ausencia de desbordamiento, controles de al menos 64 × 64 px y etiquetas numéricas sin superposición en ambas vistas a 320, 390, 768 y 1280 px. Las vistas general y ampliada tienen nombres accesibles y explican el valor de sus marcas. La escala no depende de movimiento animado. Se revisan capturas de móvil/escritorio, cierre de configuración con Escape y retorno de foco, Tab contenido en el diálogo y foco al completar. Las pruebas reales con el niño, voz y lector siguen pendientes.

En el piloto integrado también se comprueban el recorrido desde el mapa, cinco entregas mediante botones reales, corrección sin pérdida de corazones, guardado y desbloqueo, salida y reinicio con cancelación de ayudas, regreso al cuestionario y tamaños de controles de 320 a 1280 px. Se revisaron capturas del nivel en escritorio y móvil. La voz sigue probándose con dobles controlados; las verificaciones humanas indicadas abajo continúan pendientes.

Hasta 20 se verifican dos marcos de diez por zona, monedas de al menos 44 × 44 px y acciones de decena de al menos 64 × 64 px, sin desbordamiento horizontal entre 320 y 1280 px. Los diez objetos agrupados siguen visibles, los controles tienen nombres por zona/marco y el foco pasa al traslado o a una moneda al agrupar/separar. Teclado, pulsaciones táctiles, lectura y texto del ejemplo cubren la decena. La equivalencia 20 = 10 + 10 y la corrección de 20 a 19 se comprueban tanto en el modelo como en interfaz.

## Comprobado en el prototipo

| Área | Comprobación | Resultado |
| --- | --- | --- |
| Reflujo | Anchuras de 320, 390, 640, 768 y 1280 px; texto de misión separado del letrero y sin desbordamiento horizontal | Correcto en Edge de prueba |
| Tacto | Pulsaciones emuladas para añadir/devolver y conservación de diez monedas | Correcto |
| Tamaño | Objetos de al menos 44 × 44 px; botones Añadir, Devolver, lectura, ejemplo, conteo, pista y entrega de al menos 64 × 64 px | Correcto. Las monedas conservan dos filas de cinco; se ofrecen botones grandes alternativos para pantallas estrechas |
| Teclado | Tab, Enter y Espacio; retorno de foco al botón Añadir cuando el cofre queda vacío | Correcto |
| Cancelación | Escape, ocultar pestaña, cambio de encargo y desmontaje; soltar tras un arrastre cancelado no cuenta como respuesta | Correcto |
| Roles y nombres | Botones con nombres, grupos de reserva/cofre, posiciones de objetos, referencias ARIA válidas y anuncio de movimientos | Correcto en las consultas de accesibilidad del navegador |
| Foco | Anillo oscuro con borde exterior claro, visible sobre pergamino y fondos azules | Revisado visualmente |
| Contraste | Texto de botones principales con relación mínima de 4,5:1 en los colores extremos de sus degradados | Correcto; se oscureció el azul del botón de conteo |
| Movimiento | Demostración opcional, finita y sin activación por inactividad; reducción de movimiento evita la animación | Correcto |
| Ayuda | Tres niveles, conservación de intentos y explicación para cantidades menores, mayores o iguales al objetivo | Correcto |
| Voz | Inicio explícito, es-CL preferente, otra voz española, espera de voces, cancelación y alternativa visual si falla | Correcto con dobles controlados de la API |
| Aislamiento | Montaje de varias instancias y desmontaje sin eventos o lectura pendientes; guardado del jugador intacto | Correcto |

Las comprobaciones están en `tests/quantity-ui.test.cjs`, `tests/quantity.test.cjs` y `tests/activity-speech.test.cjs`. Las consultas de roles/nombres prueban la estructura accesible del navegador, no la experiencia oral de un lector de pantalla concreto.

## Pendiente de validación manual

- [ ] Escuchar en el equipo habitual y comprobar pronunciación de cifras, velocidad y volumen. No todas las instalaciones tienen voz chilena; algunas voces del sistema pueden necesitar conexión.
- [ ] Usar el lector de pantalla habitual, si corresponde, para comprobar orden, nombres y ritmo de los anuncios. Ajustar si hay repeticiones incómodas.
- [ ] Comprobar zoom real del navegador y las preferencias de tamaño del sistema en el dispositivo habitual.
- [ ] Probar con el niño y observar si diferencia el panel de ejemplo del cofre real y si puede corregir sin frustración.
- [ ] Comprobar tacto, arrastre y desplazamiento en hardware real. La emulación no acredita por sí sola todas las combinaciones de navegador y dispositivo.

Estos pendientes se mantienen también en el [plan de seguimiento](plan-interactividad-mundo-1.md). No deben marcarse como realizados solo porque pasen las pruebas automatizadas.

La huerta también comprueba navegación entre sus páginas y las del tesoro, ausencia de imágenes/textos de monedas o cofres, acceso propio desde el mapa y retorno del foco al cerrar su configuración con Escape. Sus emojis provisionales llevan nombres accesibles en los controles; los adornos se ocultan al lector. La modalidad matemática y el guardado conservan las validaciones anteriores.
