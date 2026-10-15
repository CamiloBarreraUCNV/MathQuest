# 📐 MathQuest: El Camino del Cálculo

**MathQuest** es un juego interactivo de matemáticas para navegador, diseñado con una ruta de aprendizaje progresiva al estilo *Duolingo / Candy Crush*. Guía al jugador paso a paso desde los fundamentos del conteo hasta las reglas del cálculo diferencial (derivadas).

---

## 🗺️ Estructura de los 6 Mundos (30 Niveles)

1. **🌱 Mundo 1: Isla de los Números (Niveles 1 al 4)**
   - Conteo y reconocimiento de cantidades.
   - Comparación de magnitudes: Mayor ($>$), Menor ($<$) e Igual ($=$).
   - Pares, impares y desplazamiento en la recta numérica.
   - *Desafío del Guardián de los Números*.

2. **🌊 Mundo 2: Valle Aritmético (Niveles 5 al 9)**
   - Sumas elementales y cálculo mental con reagrupación.
   - Restas y diferencias numéricas.
   - Operaciones combinadas de dos dígitos.
   - El Reino Bajo Cero: Números negativos y ley de signos.
   - *Jefe: El Centinela Aritmético*.

3. **⚡ Mundo 3: Cañón de Factores (Niveles 10 al 14)**
   - Multiplicación básica como suma repetida (tablas del 2 al 5).
   - Tablas maestras (6 al 10 y múltiplos de 10).
   - División como reparto exacto e inverso de multiplicar.
   - Jerarquía de operaciones (**PEMDAS**).
   - *Jefe: El Golem Multiplicador*.

4. **🔮 Mundo 4: Bosque del Álgebra (Niveles 15 al 19)**
   - La incógnita misteriosa: variables y ecuaciones simples ($x + a = b$).
   - Coeficientes y multiplicación ($ax = b$).
   - Ecuaciones lineales de dos pasos ($ax + b = c$).
   - Potencias ($x^n$) y raíces cuadradas ($\sqrt{x}$).
   - *Jefe: La Esfinge Algebraica*.

5. **🏔️ Mundo 5: Pico de las Funciones (Niveles 20 al 23)**
   - La máquina de transformar valores: $f(x)$ y evaluación.
   - La pendiente ($m = \frac{\Delta y}{\Delta x}$) y la ecuación de la recta ($y = mx + b$).
   - Polinomios, curvas parabólicas y variación instantánea.
   - *Jefe: El Navegante de Curvas*.

6. **🌌 Mundo 6: Nexo del Cálculo (Niveles 24 al 30)**
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

- Teclas `1`, `2`, `3`, `4`: Seleccionar la opción correspondiente.
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
