# 📐 MathQuest: El Camino del Cálculo

**MathQuest** es un juego interactivo de matemáticas para navegador, diseñado con una ruta de aprendizaje progresiva al estilo *Duolingo / Candy Crush*. Guía al jugador paso a paso desde los fundamentos del conteo hasta las reglas del cálculo diferencial (derivadas).

---

## 🗺️ Estructura de los 6 Mundos (30 Niveles)

1. **🌱 Mundo 1: Isla de los Números (4 niveles)**
   - Conteo y reconocimiento de cantidades.
   - Comparación de magnitudes: Mayor ($>$), Menor ($<$) e Igual ($=$).
   - Pares, impares y desplazamiento en la recta numérica.
   - *Desafío del Guardián de los Números*.

2. **🎪 Mundo 2: Circo de las Sumas (5 niveles)**
   - Sumas hasta 20 con ejemplos concretos del circo.
   - Restas hasta 20, sin resultados negativos.
   - Problemas de dos pasos y decenas, con cantidades hasta 50.
   - La Caja Misteriosa: cantidades que faltan, comparaciones y cantidades iniciales.
   - *Jefe: Dragón Globo de Dos Cabezas*, con ocho alternativas por pregunta.

3. **♟️ Mundo 3: Reino del Jaque Dulce (5 niveles)**
   - Multiplicación básica como suma repetida (tablas del 2 al 5).
   - Tablas maestras (6 al 10 y múltiplos de 10).
   - División como reparto exacto e inverso de multiplicar.
   - Jerarquía de operaciones (**PEMDAS**).
   - Peón de Malvavisco, Caballo de Chocolate, Alfil de Caramelo y Torre de Barquillo.
   - *Jefa: Reina de Azúcar*. Cambia la posición de las alternativas cada dos segundos.
   - Temática para 9–12 años. Las preguntas actuales se conservan como contenido provisional para una actualización posterior.

4. **🔮 Mundo 4: Bosque del Álgebra (5 niveles)**
   - La incógnita misteriosa: variables y ecuaciones simples ($x + a = b$).
   - Coeficientes y multiplicación ($ax = b$).
   - Ecuaciones lineales de dos pasos ($ax + b = c$).
   - Potencias ($x^n$) y raíces cuadradas ($\sqrt{x}$).
   - *Jefe: La Esfinge Algebraica*.

5. **🏔️ Mundo 5: Pico de las Funciones (4 niveles)**
   - La máquina de transformar valores: $f(x)$ y evaluación.
   - La pendiente ($m = \frac{\Delta y}{\Delta x}$) y la ecuación de la recta ($y = mx + b$).
   - Polinomios, curvas parabólicas y variación instantánea.
   - *Jefe: El Navegante de Curvas*.

6. **🌌 Mundo 6: Nexo del Cálculo (7 niveles)**
   - La recta tangente y el límite intuitivo ($h \to 0$).
   - Regla de la Potencia: $\frac{d}{dx}[x^n] = n x^{n-1}$.
   - Regla de la Constante ($\frac{d}{dx}[c] = 0$) y Múltiplos Escalares.
   - Derivadas de polinomios término a término.
   - Derivadas trigonométricas ($\sin(x) \to \cos(x)$, $\cos(x) \to -\sin(x)$).
   - Regla de la Cadena y del Producto.
   - *Batalla Final: El Arquitecto del Infinito*.

---

## 🎮 Mecánicas de Juego

- **Mini-Lección Teórica Previa**: Cada nivel incluye un panel explicativo con conceptos ilustrados, metáforas intuitivas y fórmulas matemáticas renderizadas con KaTeX.
- **Vidas y Corazones**: Comienzas con 5 vidas. Si fallas una pregunta pierdes un corazón. ¡Puedes recargarlas en cualquier momento haciendo clic en los corazones!
- **Racha de Fuego (Combo Streak)**: Acertar preguntas seguidas activa multiplicadores de experiencia con un indicador animado de fuego y notas musicales ascendentes.
- **Sistema de Estrellas**: Obtén hasta 3 estrellas por nivel según tu precisión (3 estrellas por una lección 100% perfecta).
- **Rangos de Jugador**: Tu nivel sube a medida que acumulas XP:
  - 🐣 *Novato Numérico*
  - 🌱 *Explorador de Números*
  - 🌊 *Guardián Aritmético*
  - ⚡ *Domador de Factores*
  - 🔮 *Hechicero del Álgebra*
  - 🏔️ *Maestro de Curvas y Límites*
  - 🌌 *Archimago del Cálculo Infinito*
- **Efectos de Sonido Sintetizados**: Audio generado en tiempo real con Web Audio API (cero retraso y sin archivos mp3 externos).
- **Celebración con Confetti**: Animación en Canvas al completar cada nivel.
- **Guardado Automático**: Tu progreso, estrellas, niveles desbloqueados y logros se guardan en `localStorage`.

---

## ⌨️ Atajos de Teclado

- Teclas `1`, `2`, `3`, `4`: Seleccionar la opción correspondiente. En la pelea del Dragón Globo (nivel 5 del circo) se usan las teclas `1` a `8`.
- Tecla `Enter` o `Espacio`: Continuar a la siguiente pregunta en la barra de resultados.

---

## 🚀 Cómo Jugar

No requiere instalar Node ni dependencias complejas. Simplemente:

1. Haz doble clic en `index.html` para abrirlo en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).
2. O ejecuta un servidor local sencillo si lo prefieres:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # O con Node.js
   npx serve .
   ```
3. ¡Abre tu navegador y comienza tu viaje desde los números hasta las derivadas!

## Reglas de progreso

- Los combates se superan al derrotar al enemigo y conservar al menos una vida.
- Los niveles sin combate requieren completar las preguntas con un mínimo de 60 % de aciertos y conservar vidas.
- Una victoria otorga 3 estrellas con 100 % de precisión, 2 desde 75 % y 1 por debajo de 75 %. Una derrota no otorga estrellas, bonificación de finalización ni nuevos niveles.
- La XP ganada por cada acierto se guarda inmediatamente, incluso si luego se pierde el combate. El guardado conserva el progreso general; recargar la página reinicia el intento en curso.
- Al perder todas las vidas, el intento termina. Recargar corazones permite iniciar otro intento.
- Las preguntas y sus opciones se mezclan al iniciar cada intento.
- Cada nivel del circo (1 al 5) tiene un banco de 20 preguntas con explicación y pista. Los enemigos normales tienen 8, 10, 12 y 16 HP; el combate termina cuando son derrotados. El nivel 4 presenta al Payaso Sorpresa y su caja misteriosa.
- El mundo 2 usa una progresión sencilla para niños de 6 a 10 años: primero cantidades hasta 20 y después retos hasta 50. No incluye álgebra, números negativos ni paréntesis; el jefe repasa lo aprendido sin introducir conceptos nuevos.
- El Dragón Globo del nivel 5 del circo mezcla las 100 preguntas de ese mundo al iniciar cada intento, sin repetirlas. Solo este combate muestra ocho alternativas únicas por pregunta; los demás niveles mantienen cuatro. Tiene 40 HP y no se regenera, para permitir leer las ocho opciones sin presión de tiempo.
- La Reina de Azúcar (nivel 5 del mundo 3) mezcla sus cuatro alternativas cada dos segundos sin cambiar el ejercicio ni el valor correcto. La mezcla se pausa al responder, pulsar una alternativa, abrir un modal o esconder la pestaña; al abandonar o reiniciar el combate se cancela. Los atajos numéricos corresponden a las posiciones visibles. El reino utiliza el fondo y los cinco personajes de `assets/world-3/`. Los cuatro enemigos normales tienen 8, 9, 10 y 11 HP; la reina tiene 20 HP y no se regenera.

## Selección de mundos y guardado

Los seis mundos están disponibles desde el selector inicial. Cada uno empieza en su nivel 1 y guarda sus niveles desbloqueados y estrellas por separado. Dentro de un mundo los niveles se desbloquean al superar el anterior; completar un jefe no lleva automáticamente a otro mundo. La XP, los logros del perfil y los corazones son compartidos.

El guardado mantiene la clave `mathquest_save_data_v1` para recuperar partidas anteriores, pero usa `schemaVersion: 2` con `worldProgress`. La migración conserva XP, corazones, estrellas y niveles que ya estaban disponibles. Los identificadores internos de niveles siguen siendo únicos (1 a 30), mientras la interfaz muestra números locales dentro de cada mundo.

## Comprobaciones de desarrollo

Con Node.js, ejecuta `node tests/game.test.cjs`. Incluye simulaciones de los 30 niveles, reglas de derrota y victoria, guardado y mezcla de opciones.

La comprobación de interfaz se ejecuta con `node tests/ui.test.cjs` y requiere Playwright y Microsoft Edge. Puede usarse `PLAYWRIGHT_MODULE` para indicar una instalación externa de Playwright y `BROWSER_CHANNEL` para seleccionar otro canal instalado. Usa un navegador aislado y guardado en memoria, sin modificar la partida del jugador.
