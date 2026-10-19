# Assets de la actividad: Prepara el tesoro

El prototipo `mockup-tesoro-monedas.html` integra el [paquete de nueve assets](../assets/treasure-activity/README.md) proporcionado en `assets/mathquest-treasure-assets-v1.zip`, basado en el mockup ilustrado aprobado. Usa los PNG de `assets/treasure-activity/` y la hoja `css/treasure-mockup.css`. No se generaron imágenes nuevas ni se modificaron los originales. No se usan fuentes ni servicios externos.

## Integración del paquete v1

- La bahía es el fondo; el personaje, la bolsa, el pergamino, los paneles, los letreros y el cofre son elementos independientes.
- Los márgenes transparentes se compensan con contenedores CSS según los límites visibles de `manifest.json`; los PNG conservan sus dimensiones y huellas originales.
- Las diez monedas son botones con `coin-gold.png`, también durante el arrastre. La cantidad solicitada, los títulos y las cuadrículas son HTML.
- Los cofres abierto y cerrado se alinean por su anchura visible y base. Una entrega correcta muestra el cerrado; un nuevo encargo vuelve a mostrar el abierto.
- El total del cofre aparece al activar «Contemos juntos» o completar la entrega. En móvil se apilan las zonas y se ocultan la bolsa y el cofre decorativos para priorizar las monedas.
- El mockup aprobado solo es referencia de composición: no se carga como fondo de la pantalla.
- Conservar juntos HTML, CSS y carpeta de assets al mover el prototipo. Se puede abrir directamente sin servidor.

Las dimensiones siguientes son recomendaciones originales. Consultar las resoluciones reales y las áreas seguras en la guía del paquete entregado.

## Dirección visual común

- Aplicar `assets/ART-DIRECTION.md` y usar `assets/world-1/pirate-apple-80s.png` como referencia principal de dibujo; los emojis son placeholders funcionales, no referencias artísticas.
- Aventura de piratas de la Isla de los Números: ilustración de animación de los años 80, colores cálidos, contornos legibles y coherencia con los personajes existentes.
- Interfaz azul marino, acentos dorados y confirmación verde. Los objetos interactivos deben destacar del fondo.
- Entregar originales editables cuando existan y exportaciones PNG o WebP con transparencia real para objetos y personajes.
- Sin texto, números, botones, marcos ni sombras exteriores incrustados: se componen en HTML para adaptar tamaño, accesibilidad y localización.
- Las dimensiones siguientes son recomendaciones de exportación a resolución doble. Mantener márgenes transparentes consistentes, aproximadamente del 8–12 % cuando lo permita la composición; no recortar contornos.

| Asset | Placeholder | Especificación recomendada | Estados y detalles |
| --- | --- | --- | --- |
| Moneda de oro | 🪙 | 256 × 256 px, RGBA, vista frontal o tres cuartos muy leve; objeto centrado, silueta circular | Una única denominación: cada moneda representa exactamente 1. Mismo tamaño y diseño en reserva, cofre y arrastre. Sin símbolos de otras cantidades. Un solo estado base es suficiente; foco y selección se hacen con CSS. |
| Cofre de destino | 🧰 / 🎁 | 768 × 512 px por estado, RGBA, vista frontal con abertura amplia | Dos estados: abierto para preparar y cerrado para entregar. Misma cámara, escala y punto de apoyo. Interior vacío; las monedas se dibujan por separado para reflejar la cantidad real. No incluir tesoro decorativo que pueda contarse como respuesta. |
| Bolsa de la reserva | 💰 | 512 × 512 px, RGBA; bolsa de tela de pirata, apertura visible | Sin monedas dibujadas ni cifras impresas. Funciona como referencia decorativa de la reserva; las 10 monedas interactivas siguen siendo elementos separados. |
| Retrato del Capitán Manzana | 🍎 + 🏴‍☠️ | 512 × 512 px por expresión, RGBA; busto, mirada hacia el área de actividad | Expresiones amable, alentadora y celebrando. Evitar expresiones de burla o enfado ante errores. Revisar primero si el asset existente `assets/world-1/pirate-apple-80s.png` permite un recorte adecuado; reutilizarlo si es suficiente. |
| Escenario de la bahía | Fondo CSS | 1920 × 1080 px, imagen opaca, paisaje de la isla y muelle | Opcional. Centro tranquilo, contraste reducido detrás de las zonas de trabajo. Permitir recorte en móvil. Sin monedas, números ni elementos que parezcan controles. La pantalla debe seguir funcionando sin él. |
| Insignia de entrega | ⭐ | 256 × 256 px, RGBA; estrella o sello de tesoro | Opcional. Un único diseño inicial. No confundir con una moneda ni con las estrellas permanentes del juego: en este prototipo cuenta entregas de la sesión. |

## Audio opcional para una fase posterior

Reutilizar primero `js/audio.js`. Si se necesitan sonidos propios: colocar moneda (80–180 ms), devolver moneda (80–180 ms) y entrega correcta (600–1.200 ms), en OGG y MP3, sin música de fondo mezclada y sin saturación. La actividad debe poder completarse con el sonido desactivado.

## Montaje y comportamiento

- Los números objetivo, contadores, pistas y textos son HTML; no requieren imágenes.
- Conservar un área interactiva mínima de 44 × 44 px aunque el dibujo sea menor.
- No depender de la ilustración para contar: los botones deben conservar sus nombres accesibles.
- El cofre ilustrado no oculta las monedas; se muestran en una cuadrícula independiente debajo del objeto decorativo.
- Se integraron todos los assets del paquete v1. La insignia y expresiones adicionales siguen siendo ampliaciones opcionales.

## Alcance del prototipo

- Archivo independiente que se puede abrir directamente en el navegador, sin instalar dependencias.
- Objetivos de 1 a 10, mezclados en tandas de diez: aparecen todas las cantidades antes de repetir la tanda y no hay repetición consecutiva entre tandas.
- Diez monedas totales; pulsar mueve una moneda y arrastrar la cambia de zona al soltarla en el destino válido.
- Se puede devolver, vaciar, activar el conteo o pedir pistas antes de entregar.
- La comprobación incorrecta conserva el encargo y las monedas para corregir. Una entrega correcta se registra una sola vez y bloquea el cofre hasta iniciar otra misión.
- No hay límite de tiempo, pérdida de vidas ni escritura en el guardado del juego. La sesión se reinicia al recargar.
