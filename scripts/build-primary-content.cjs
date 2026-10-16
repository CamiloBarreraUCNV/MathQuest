// Authoring source for the first three worlds. Run with Node to rebuild levels-data.js.
// Existing world/level IDs, enemies, artwork and later worlds are preserved.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const target = path.join(__dirname, '..', 'js', 'levels-data.js');
const { WORLDS_DATA: worlds, LEVELS_DATA: levels } = require(target);
const N = 'Números y operaciones', P = 'Patrones y álgebra', G = 'Geometría', M = 'Medición', D = 'Datos y probabilidades';
const shapes = ['triángulo', 'cuadrado', 'rectángulo', 'círculo', 'cubo', 'esfera', 'cono', 'cilindro'];
const positions = ['derecha', 'izquierda', 'arriba', 'abajo', 'dentro', 'fuera', 'delante', 'detrás'];
const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo', 'ningún día'];
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto'];
const times = ['2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30'];
const safe = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function table(caption, headers, rows) {
    return `<div class="curriculum-table-wrap"><table class="curriculum-table"><caption>${safe(caption)}</caption><thead><tr>${headers.map(h => `<th scope="col">${safe(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((v, i) => i === 0 ? `<th scope="row">${safe(v)}</th>` : `<td>${safe(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function tiles(rows, columns, filled = rows * columns) {
    return `<span class="curriculum-tiles" role="img" aria-label="${rows} filas de ${columns} casillas; ${filled} coloreadas" style="--tile-columns:${columns}">${Array.from({ length: rows * columns }, (_, i) => `<span aria-hidden="true" class="${i < filled ? 'filled' : ''}"></span>`).join('')}</span>`;
}
let current;
function lesson(id, title, subtitle, sections, questions) {
    current = levels.find(l => l.id === id);
    current.grade = Number(current.worldId.slice(-1));
    current.title = title;
    current.subtitle = `${current.grade}.º básico · ${subtitle}`;
    current.theory = { title, content: `<p><strong>${current.grade}.º básico.</strong> ${subtitle}</p>` + sections.map(([heading, content]) => `<h3>${heading}</h3><p>${content}</p>`).join('') };
    current.questions = [];
    questions();
    assert.equal(current.questions.length, 20, `Level ${id} must contain 20 questions`);
    current.skills = [...new Set(current.questions.map(q => q.skill))];
}
function q(axis, skill, prompt, answer, distractors, explanation, hint, calculation) {
    const needed = current.grade === 2 ? 8 : 4;
    const values = [...new Set([String(answer), ...distractors.map(String)])];
    // Numeric distractors are distinct, nonnegative and separate from the answer.
    if (typeof answer === 'number') {
        for (const offset of [1, -1, 2, -2, 5, -5, 10, -10, 3, 4, 6, 7]) {
            if (values.length >= needed) break;
            const value = answer + offset;
            if (value >= 0 && !values.includes(String(value))) values.push(String(value));
        }
    }
    assert.ok(values.length >= needed, `Missing choices: ${prompt}`);
    const question = {
        id: `w${current.grade}-l${current.id}-q${current.questions.length + 1}`,
        grade: current.grade, axis, skill, prompt,
        options: values.slice(0, 4), correct: 0, explanation, hint
    };
    if (current.grade === 2) question.bossDistractors = values.slice(4, 8);
    if (calculation) question.calculation = calculation;
    current.questions.push(question);
}
function arithmetic(skill, prompt, operation, a, b, hint) {
    const operators = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
    const result = { add: () => a + b, subtract: () => a - b, multiply: () => a * b, divide: () => a / b }[operation]();
    q(N, skill, prompt, result, [], `${a} ${operators[operation]} ${b} = ${result}. ${hint}`, hint, { operation, operands: [a, b] });
}

Object.assign(worlds[0], {
    grade: 1, subtitle: '1.º básico: números, primeras operaciones y exploración de la isla',
    cardTopics: '1.º básico · Números · Formas · Medidas',
    description: 'Cuenta el tesoro de los piratas, resuelve sumas y restas hasta 20 y explora formas, medidas y datos entre manzanos.'
});
Object.assign(worlds[1], {
    grade: 2, subtitle: '2.º básico: operaciones hasta 100, grupos iguales y datos del circo',
    cardTopics: '2.º básico · Sumas · Grupos · Datos',
    description: 'Organiza los globos del circo: trabaja hasta 100, descubre las tablas del 2, 5 y 10 y aprende con figuras, horarios y gráficos.'
});
Object.assign(worlds[2], {
    grade: 3, subtitle: '3.º básico: tablas, división, fracciones y desafíos del reino',
    cardTopics: '3.º básico · Tablas · División · Fracciones',
    description: 'Resuelve operaciones hasta 1.000, reparte golosinas, explora fracciones, mapas y medidas y desafía a la Reina de Azúcar.'
});

lesson(1, 'El tesoro de las decenas', 'Cuenta, compara y organiza las manzanas del pirata.', [
    ['Contar y ordenar', 'Cuenta cada objeto una vez. Para avanzar de 2 en 2 suma 2; de 5 en 5 suma 5; de 10 en 10 suma 10. También puedes retroceder. Practicaremos estos conteos hasta 100. Primero, segundo y tercero indican una posición; décimo es el lugar 10.'],
    ['Decenas y unidades', 'Diez manzanas forman <strong>una decena</strong>. 14 son 1 decena y 4 unidades: 10 + 4. Separar un número de distintas maneras ayuda a calcular: 8 = 5 + 3.'],
    ['Comparar y estimar', 'Entre 8 y 12, el menor es 8. Si ves un grupo parecido a otro de 10 objetos, puedes estimar que tiene cerca de 10 sin contar exactamente.']
], () => {
    q(N, 'conteo', '¿Cuántas manzanas tiene el pirata? 🍎 🍎 🍎 🍎', 4, [3, 5, 6], 'Hay 4: contamos una manzana cada vez.', 'Señala cada manzana una sola vez.');
    q(N, 'cero', 'El cofre del pirata está vacío. ¿Cuántas manzanas contiene?', 0, [1, 2, 3], 'Cero representa que no hay manzanas.', 'Vacío significa que no tiene ninguna.');
    q(N, 'conteo', 'El pirata cuenta 6, 7, 8. ¿Qué número sigue?', 9, [7, 10, 6], 'Al avanzar uno desde 8 llegamos a 9.', 'Avanza un lugar en la cuenta.');
    q(N, 'conteo', 'Retrocede desde 12: 12, 11, 10, __. ¿Qué sigue?', 9, [8, 11, 12], 'Después de 10, al retroceder, viene 9.', 'Quita uno al último número.');
    q(N, 'conteo por saltos', 'Cuenta manzanas de 2 en 2: 2, 4, 6, __.', 8, [7, 9, 10], 'Cada salto suma 2: 6 + 2 = 8.', 'Haz otro salto de dos.');
    q(N, 'conteo por saltos', 'Cuenta sacos de 5 en 5: 5, 10, 15, __.', 20, [16, 18, 19], 'Después de 15, cinco más son 20.', 'Cuenta cinco pasos desde 15.');
    q(N, 'conteo por saltos', 'Cuenta hasta el puerto de 10 en 10: 60, 70, 80, __.', 90, [81, 85, 100], 'Un salto de diez desde 80 llega a 90.', 'Conserva el salto de diez.');
    q(N, 'conteo por saltos', 'El barco retrocede: 100, 90, 80, __.', 70, [60, 79, 90], 'Se retrocede de diez en diez: después de 80 viene 70.', 'Cada paso quita diez.');
    q(N, 'ordinales', 'El capitán llega después del segundo pirata. ¿Qué lugar ocupa?', 'tercero', ['primero', 'cuarto', 'quinto'], 'Después del segundo lugar está el tercero.', 'Cuenta lugares: primero, segundo...');
    q(N, 'ordinales', 'La décima caja ocupa el lugar número…', 10, [1, 9, 20], 'Décima significa que ocupa el lugar 10.', 'Los ordinales indican posiciones.');
    q(N, 'comparación', 'Un pirata tiene 8 manzanas y otro 13. ¿Cuántas tiene el que tiene más?', 13, [8, 5, 12], '13 es mayor que 8.', 'Piensa qué cantidad está más adelante al contar.');
    q(N, 'comparación', 'Entre 17, 12, 9 y 15, ¿cuál es el número menor?', 9, [12, 15, 17], '9 está antes que los otros números al contar.', 'Busca la cantidad más pequeña.');
    q(N, 'valor posicional', '¿Cuántas manzanas forman una decena?', 10, [1, 5, 20], 'Una decena es un grupo de diez unidades.', 'Piensa en un grupo de diez.');
    q(N, 'valor posicional', 'En 14 manzanas hay 1 decena. ¿Cuántas unidades quedan sueltas?', 4, [1, 10, 14], '14 = 10 + 4: hay cuatro unidades sueltas.', 'Separa un grupo de diez.');
    q(N, 'valor posicional', 'Hay 1 decena y 7 manzanas sueltas. ¿Cuántas hay en total?', 17, [7, 10, 18], '10 + 7 = 17 manzanas.', 'Una decena vale diez.');
    q(N, 'composición', 'El tesoro tiene 8 monedas: 5 en una bolsa y __ en otra.', 3, [2, 4, 5], '5 + 3 = 8. Faltan tres monedas.', 'Cuenta desde 5 hasta 8.');
    q(N, 'composición', '¿Qué cantidad forman 10 manzanas y 9 manzanas?', 19, [9, 18, 20], '10 + 9 = 19.', 'Junta la decena con las unidades.');
    q(N, 'representación', '¿Qué número representa la palabra «dieciséis»?', 16, [6, 15, 17], 'Dieciséis se escribe 16.', 'Son diez y seis.');
    q(N, 'estimación', 'Una cesta tiene casi lo mismo que otra de 10 manzanas. ¿Qué estimación es razonable?', 'cerca de 10', ['cerca de 1', 'cerca de 50', 'cerca de 100'], 'Si se parece al grupo de diez, estimamos cerca de diez.', 'Usa como referencia la cesta conocida.');
    q(N, 'orden', 'En la ruta faltó un número: 16, 17, __, 19, 20. ¿Cuál?', 18, [15, 17, 20], '18 está entre 17 y 19.', 'Avanza uno desde 17.');
});

lesson(2, 'Las cuentas del capitán', 'Junta, quita y descubre patrones hasta 20.', [
    ['Juntar y quitar', 'Sumar junta cantidades: 4 + 3 = 7. Restar quita o encuentra lo que falta: 7 − 3 = 4. Son operaciones inversas. Sumar o quitar cero deja la misma cantidad.'],
    ['Estrategias', 'Para 8 + 5, toma 2 del 5 y completa diez: 8 + 2 + 3 = 13. Para 6 + 6 usa un doble. Puedes contar hacia atrás para restar.'],
    ['Patrones y equilibrio', 'En 🍎 🍐 🍎 🍐 se repite manzana, pera. En 2, 4, 6, 8 se suma 2. El signo = indica que ambos lados valen lo mismo, como una balanza equilibrada: 4 + 2 = 6.']
], () => {
    [[4, 3], [5, 0], [6, 6], [8, 5], [9, 7], [10, 8]].forEach(([a, b]) => arithmetic('suma hasta 20', `El capitán junta ${a} manzanas con ${b} más. ¿Cuántas tiene?`, 'add', a, b, 'Junta las cantidades; puedes completar diez.'));
    [[7, 3], [10, 4], [15, 5], [18, 6], [12, 0], [20, 9]].forEach(([a, b]) => arithmetic('resta hasta 20', `De ${a} manzanas del barco se entregan ${b}. ¿Cuántas quedan?`, 'subtract', a, b, 'Quita la cantidad entregada y cuenta lo que queda.'));
    q(N, 'operaciones inversas', 'Si 7 + 5 = 12, ¿cuánto es 12 − 5?', 7, [5, 12, 17], 'Quitar las cinco que agregamos nos devuelve a siete.', 'Deshaz la suma.');
    q(P, 'igualdad', 'La balanza tiene 8 monedas a un lado y 5 al otro. ¿Cuántas agregas al lado de 5 para equilibrarla?', 3, [2, 4, 5], '5 + 3 = 8: los dos lados quedan iguales.', 'Busca cuánto falta desde cinco hasta ocho.');
    q(P, 'igualdad', 'Completa para que ambos lados valgan lo mismo: 6 + __ = 10.', 4, [3, 5, 6], '6 + 4 = 10.', 'Cuenta desde seis hasta diez.');
    q(P, 'patrón repetitivo', 'Continúa las frutas del capitán: 🍎 🍐 🍎 🍐 __.', '🍎', ['🍐', '🍌', '🍇'], 'Se repite manzana, pera; ahora toca manzana.', 'Observa el grupo que vuelve a empezar.');
    q(P, 'patrón repetitivo', 'El tambor suena: fuerte, suave, suave, fuerte, suave, __.', 'suave', ['fuerte', 'silencio', 'dos golpes fuertes'], 'El grupo es fuerte, suave, suave. Falta el segundo suave.', 'Busca el grupo de tres sonidos.');
    q(P, 'patrón numérico', 'Los barcos avanzan: 3, 6, 9, __. ¿Qué número sigue?', 12, [10, 11, 15], 'Se suma tres cada vez: 9 + 3 = 12.', 'Mira cuánto aumenta entre dos números.');
    q(P, 'patrón numérico', 'Las cajas bajan: 20, 18, 16, __.', 14, [12, 15, 18], 'Se resta dos: 16 − 2 = 14.', 'Cada paso baja dos.');
    q(P, 'comparación', 'La balanza tiene 9 monedas a la izquierda y 6 a la derecha. ¿Qué lado tiene más?', 'izquierda', ['derecha', 'ambos por igual', 'ninguno'], 'Nueve es mayor que seis; el lado izquierdo tiene más.', 'Compara las dos cantidades.');
});

const islandData = table('Cosecha de la isla · cada 🍎 representa 1 manzana', ['Pirata', 'Manzanas'], [['Ana', '🍎 🍎 🍎'], ['Leo', '🍎 🍎'], ['Sol', '🍎 🍎 🍎 🍎']]);
lesson(3, 'El mapa de la isla', 'Explora formas, posiciones, medidas y pictogramas.', [
    ['Figuras y posiciones', 'Un triángulo tiene 3 lados rectos; un cuadrado tiene 4 lados iguales; un círculo tiene borde curvo. Una esfera es un cuerpo como una pelota; un cubo es como un dado. Arriba, abajo, dentro y fuera describen posiciones.'],
    ['Comparar y ordenar', 'Para comparar largos, alinea un extremo de los objetos. Puedes usar clips iguales como unidad: 5 clips es más largo que 3. Primero desayunamos, después navegamos. Un día dura más que una hora. Los meses y los días de la semana también tienen un orden: después de marzo viene abril y después del lunes viene el martes.'],
    ['Leer datos', `En un pictograma cada dibujo representa una cantidad. Lee siempre cuánto vale cada dibujo. Aquí Ana tiene 3 manzanas y Sol tiene 4. ${islandData}`]
], () => {
    q(G, 'figuras 2D', '¿Qué figura de la bandera tiene 3 lados rectos?', 'triángulo', ['cuadrado', 'círculo', 'rectángulo'], 'Un triángulo tiene tres lados rectos.', 'Cuenta los lados de cada figura.');
    q(G, 'figuras 2D', '¿Qué figura plana tiene un borde curvo, sin lados rectos?', 'círculo', ['triángulo', 'cuadrado', 'rectángulo'], 'El borde del círculo es una curva cerrada.', 'Piensa en la forma de una moneda vista de frente.');
    q(G, 'figuras 2D', 'Una baldosa plana tiene 4 lados iguales y 4 esquinas como las de una hoja. ¿Qué figura es?', 'cuadrado', ['triángulo', 'círculo', 'rectángulo alargado'], 'El cuadrado tiene cuatro lados iguales y cuatro ángulos rectos.', 'Imagina una baldosa cuadrada.');
    q(G, 'figuras 3D', '¿Qué cuerpo tiene forma de pelota?', 'esfera', ['cubo', 'cono', 'cilindro'], 'Una pelota tiene forma de esfera.', 'Piensa en una forma redonda en todas las direcciones.');
    q(G, 'figuras 3D', 'Un dado del pirata tiene forma de…', 'cubo', ['esfera', 'cono', 'círculo'], 'El dado es un cubo: es un cuerpo con caras cuadradas.', 'Piensa en las caras planas de un dado.');
    q(G, 'líneas', '¿Qué camino no se dobla ni se curva?', 'línea recta', ['línea curva', 'círculo', 'espiral'], 'Una línea recta conserva su dirección.', 'Piensa en el borde de una regla.');
    q(G, 'posiciones', 'En este orden: 🍎 ⭐ 🌳. ¿Dónde está la estrella respecto de la manzana?', 'derecha', ['izquierda', 'arriba', 'abajo'], 'La estrella está a la derecha de la manzana.', 'Lee el orden de izquierda a derecha.');
    q(G, 'posiciones', 'La manzana está guardada en el interior del cofre. ¿Dónde está?', 'dentro', ['fuera', 'arriba', 'debajo'], 'Estar en el interior significa estar dentro.', 'Busca la palabra que significa interior.');
    q(M, 'longitud', 'Una cuerda mide 5 clips iguales y otra 3. ¿Cuál es más larga?', 'la de 5 clips', ['la de 3 clips', 'son iguales', 'no se pueden comparar'], 'Con clips iguales, cinco unidades cubren más largo que tres.', 'Compara cuántas veces cabe la misma unidad.');
    q(M, 'longitud', 'Un palo mide 2 lápices iguales y otro 4. ¿Cuál es más corto?', 'el de 2 lápices', ['el de 4 lápices', 'son iguales', 'ninguno'], 'Dos lápices representan menos longitud que cuatro.', 'Las unidades deben ser iguales.');
    q(M, 'tiempo', '¿Qué dura más: una hora o un día?', 'un día', ['una hora', 'duran igual', 'un instante'], 'Un día contiene muchas horas.', 'Piensa en todo lo que haces durante un día.');
    q(M, 'secuencia temporal', 'Para plantar un manzano: primero haces un hoyo, luego pones la semilla y al final riegas. ¿Qué haces después del hoyo?', 'poner la semilla', ['regar', 'cosechar', 'comer la manzana'], 'La semilla se pone después de hacer el hoyo.', 'Sigue el orden indicado.');
    q(M, 'calendario', 'Si hoy es lunes, ¿qué día será mañana?', 'martes', ['domingo', 'miércoles', 'viernes'], 'Después del lunes viene el martes.', 'Avanza un día en la semana.');
    q(D, 'pictograma', `${islandData}¿Cuántas manzanas recogió Leo?`, 2, [3, 4, 5], 'La fila de Leo tiene dos dibujos; cada uno vale una manzana.', 'Cuenta los dibujos de la fila de Leo.');
    q(D, 'pictograma', `${islandData}¿Cuántas manzanas recogió Sol?`, 4, [2, 3, 5], 'Sol tiene cuatro dibujos de una manzana cada uno.', 'Lee la fila de Sol.');
    q(D, 'comparar datos', `${islandData}¿Quién recogió más manzanas?`, 'Sol', ['Ana', 'Leo', 'todos igual'], 'Sol tiene cuatro, más que tres y dos.', 'Busca la fila con más dibujos.');
    q(D, 'comparar datos', `${islandData}¿Quién recogió menos manzanas?`, 'Leo', ['Ana', 'Sol', 'todos igual'], 'Leo tiene dos, la menor cantidad.', 'Busca la fila con menos dibujos.');
    q(D, 'registro de datos', 'El pirata registra sus monedas con rayitas: | | | | |. ¿Cuántas registró?', 5, [4, 6, 3], 'Cada rayita registra una moneda: hay cinco.', 'Cuenta cada marca una vez.');
    q(D, 'pictograma', `${islandData}¿Cuántas manzanas recogieron Ana y Leo juntos?`, 5, [3, 4, 6], 'Ana tiene 3 y Leo 2; 3 + 2 = 5.', 'Junta los dibujos de ambas filas.');
    q(D, 'recolectar datos', 'Quieres saber la fruta favorita de los piratas. ¿Qué pregunta sirve?', '¿Qué fruta prefieres?', ['¿Cuánto mide el barco?', '¿Qué hora es?', '¿Cuántas velas tiene el barco?'], 'Preguntar por la fruta favorita permite registrar esas preferencias.', 'La pregunta debe tratar sobre lo que quieres averiguar.');
});

lesson(4, 'El desafío del Manzano Ancestral', 'Repasa los tesoros, las cuentas y el mapa de la isla.', [
    ['Prepara tu estrategia', 'Este guardián mezcla lo practicado: números y decenas, sumas y restas hasta 20, patrones, figuras, medidas y datos. Lee la leyenda si aparece un pictograma.'],
    ['Un ejemplo de repaso', 'Si hay 10 manzanas en una caja y 3 sueltas, hay 13. Si entregas 2 de las sueltas quedan 11. Contar, dibujar o deshacer una operación te ayuda a comprobar.']
], () => {
    q(N, 'conteo', 'El general cuenta 13, 14, 15, __. ¿Cómo continúa?', 16, [14, 17, 18], 'Un paso después de 15 es 16.', 'Suma uno.');
    q(N, 'conteo por saltos', 'Las tropas marchan de 5 en 5: 20, 25, 30, __.', 35, [31, 40, 25], '30 más cinco son 35.', 'Conserva el salto de cinco.');
    q(N, 'valor posicional', 'El general reúne 1 decena y 8 unidades. ¿Cuántas manzanas hay?', 18, [8, 10, 19], '10 + 8 = 18.', 'Una decena equivale a diez.');
    q(N, 'ordinales', 'El noveno soldado deja pasar a uno delante de él. ¿Qué lugar ocupa ahora?', 'décimo', ['octavo', 'noveno', 'primero'], 'Al pasar uno delante, su posición pasa de nueve a diez.', 'La posición aumenta en uno.');
    arithmetic('suma hasta 20', 'El manzano tiene 7 manzanas y crecen 6 más. ¿Cuántas hay?', 'add', 7, 6, 'Completa diez con tres de las seis y luego suma las otras tres.');
    arithmetic('resta hasta 20', 'El general guarda 16 manzanas y entrega 7. ¿Cuántas conserva?', 'subtract', 16, 7, 'Quita siete; puedes pasar por diez.');
    arithmetic('suma hasta 20', 'Dos ramas tienen 8 manzanas cada una. ¿Cuántas tienen juntas?', 'add', 8, 8, 'Usa el doble de ocho.');
    q(N, 'comparación', 'Elige la menor cantidad para la cesta pequeña: 11, 7, 15 o 19.', 7, [11, 15, 19], 'Siete es la menor de esas cantidades.', 'Busca la cantidad que aparece antes al contar.');
    q(P, 'patrón repetitivo', 'La guardia sigue: hoja, hoja, manzana, hoja, hoja, __.', 'manzana', ['hoja', 'rama', 'flor'], 'Se repite hoja, hoja, manzana.', 'Busca el grupo de tres.');
    q(P, 'patrón numérico', 'Completa la escalera: 4, 8, 12, __.', 16, [14, 15, 18], 'La escalera suma cuatro en cada paso.', 'Compara dos números vecinos.');
    q(P, 'igualdad', 'La balanza del general debe quedar igual: 9 + __ = 12.', 3, [2, 4, 5], 'Nueve más tres son doce.', 'Cuenta cuánto falta hasta doce.');
    q(G, 'figuras 2D', 'La señal del general tiene 3 lados rectos. ¿Qué figura es?', 'triángulo', ['círculo', 'cuadrado', 'rectángulo'], 'Tres lados rectos forman un triángulo.', 'Cuenta los lados.');
    q(G, 'figuras 3D', 'La pelota del entrenamiento tiene forma de…', 'esfera', ['cubo', 'cono', 'cuadrado'], 'La esfera es redonda como una pelota.', 'Distingue un cuerpo de una figura plana.');
    q(G, 'posiciones', 'En el orden 🌳 🍎 ⭐, ¿dónde queda la manzana respecto de la estrella?', 'izquierda', ['derecha', 'arriba', 'abajo'], 'La manzana aparece a la izquierda de la estrella.', 'Observa qué aparece antes de la estrella.');
    q(M, 'longitud', 'Dos ramas miden 6 y 4 clips iguales. ¿Cuántos clips mide la más larga?', 6, [4, 2, 10], 'La rama de seis clips es más larga.', 'Usa la misma unidad para comparar.');
    q(M, 'secuencia temporal', 'El general desayuna y después entrena. ¿Qué hace primero?', 'desayunar', ['entrenar', 'ambas a la vez', 'ninguna'], 'Desayunar ocurre antes de entrenar.', 'Busca la primera acción.');
    q(M, 'calendario', 'El general celebra su cumpleaños en abril, el mes después de marzo. ¿Qué mes viene después de marzo?', 'abril', ['enero', 'febrero', 'mayo'], 'En el calendario, después de marzo viene abril.', 'Sigue el orden de los meses.');
    q(D, 'pictograma', 'Cada 🍎 vale una manzana. La cesta del general muestra 🍎 🍎 🍎 🍎 🍎 🍎. ¿Cuántas tiene?', 6, [5, 7, 8], 'Seis dibujos representan seis manzanas.', 'Lee cuánto vale cada dibujo.');
    q(D, 'comparar datos', `${table('Cestas del general', ['Cesta', 'Manzanas'], [['Roja', 6], ['Azul', 3], ['Verde', 4]])}¿Qué cesta tiene más?`, 'roja', ['azul', 'verde', 'todas igual'], 'La roja tiene seis, que es la cantidad mayor.', 'Compara las tres cantidades.');
    q(D, 'registro de datos', 'El general registra hojas: | | | |. ¿Cuántas hojas anotó?', 4, [3, 5, 6], 'Hay cuatro marcas; cada una representa una hoja.', 'Cuenta las marcas.');
});

lesson(5, 'La boletería de los globos', 'Trabaja con decenas y sumas y restas hasta 100.', [
    ['Números hasta 100', '63 son 6 decenas y 3 unidades. Puedes comparar decenas y después unidades. Al contar de 100 en 100 llegamos hasta 1.000, aunque aquí las sumas y restas serán hasta 100.'],
    ['Sumar y restar sin reserva', 'Para 23 + 14 junta 2 decenas con 1 decena y 3 unidades con 4: 37. Para 56 − 24 quita decenas y unidades: 32. En estos ejercicios no necesitas cambiar una decena.'],
    ['Comprobar', 'Si 23 + 14 = 37, entonces 37 − 14 = 23. Sumar o restar cero conserva la cantidad. Para calcular mentalmente, usa dobles y completa diez.']
], () => {
    q(N, 'valor posicional', 'La boletería vendió 63 entradas. ¿Cuántas decenas completas son?', 6, [], '63 = 60 + 3: seis decenas y tres unidades.', 'Separa las entradas en grupos de diez.');
    q(N, 'valor posicional', 'El payaso tiene 4 decenas y 7 globos sueltos. ¿Cuántos globos son?', 47, [], '40 + 7 = 47.', 'Cuatro decenas valen cuarenta.');
    q(N, 'comparación', 'Entre 36, 63, 46 y 26 entradas, ¿cuál es la mayor cantidad?', 63, [36, 46, 26], '63 tiene seis decenas, más que las demás cantidades.', 'Compara primero las decenas.');
    q(N, 'conteo por saltos', 'Cuenta puestos de 100 en 100: 600, 700, 800, __.', 900, [1000, 810, 850], 'El siguiente salto de cien llega a 900.', 'Agrega otra centena.');
    q(N, 'conteo por saltos', 'La fila avanza de 10 en 10: 35, 45, 55, __.', 65, [], '55 + 10 = 65.', 'Cambia una decena y conserva las unidades.');
    q(N, 'conteo por saltos', 'Los globos se cuentan de 2 en 2: 82, 84, 86, __.', 88, [], 'El siguiente salto suma dos: 88.', 'Cuenta dos desde 86.');
    q(N, 'estimación', 'Una fila tiene casi lo mismo que otra de 50 personas. ¿Qué estimación usarías?', 50, [5, 10, 100], 'El grupo conocido de cincuenta es la referencia más cercana.', 'Usa la fila de referencia.');
    [[23, 14], [42, 25], [31, 18], [60, 20], [36, 0]].forEach(([a, b]) => arithmetic('suma sin reserva', `El payaso reúne ${a} globos y recibe ${b} más. ¿Cuántos tiene?`, 'add', a, b, 'Suma las decenas y las unidades por separado.'));
    [[56, 24], [87, 35], [69, 17], [90, 20], [48, 0]].forEach(([a, b]) => arithmetic('resta sin reserva', `De ${a} entradas del circo se usan ${b}. ¿Cuántas quedan?`, 'subtract', a, b, 'Resta las unidades y después las decenas.'));
    q(N, 'operaciones inversas', 'Si 24 + 15 = 39, ¿cuánto es 39 − 15?', 24, [], 'Restar las quince que se agregaron devuelve las veinticuatro iniciales.', 'Deshaz la suma.');
    q(N, 'cálculo mental', 'El payaso calcula 9 + 6 completando 10. ¿Qué resultado obtiene?', 15, [], '9 + 1 + 5 = 15.', 'Separa seis en uno y cinco.');
    q(N, 'composición', 'Hay 78 globos: 70 rojos y el resto azules. ¿Cuántos son azules?', 8, [], '78 = 70 + 8.', 'Separa las siete decenas.');
});

lesson(6, 'La pista de las formas', 'Descubre patrones, posiciones y figuras del malabarista.', [
    ['Reglas de secuencias', 'En 10, 15, 20, 25 se suma 5. Puedes completar un término faltante usando la misma regla.'],
    ['Figuras planas y cuerpos', 'Un triángulo tiene 3 lados. Un cuadrado tiene 4 lados iguales y 4 ángulos rectos. El rectángulo tiene 4 ángulos rectos y lados opuestos iguales. Cubo, esfera, cono y cilindro son cuerpos.'],
    ['Posiciones e igualdad', 'Derecha e izquierda dependen de la referencia indicada. En una balanza, 8 y 8 están equilibrados: 8 = 8. El signo &gt; significa mayor que: 8 &gt; 5; el signo &lt; significa menor que: 5 &lt; 8. Para equilibrar, agrega lo que falta al lado menor.']
], () => {
    [[10, 15, 20, 25], [20, 30, 40, 50], [90, 80, 70, 60], [3, 5, 7, 9], [12, 22, 32, 42]].forEach(([a, b, c, d]) => q(P, 'patrón numérico', `El malabarista ordena sus globos: ${a}, ${b}, ${c}, __. ¿Qué sigue?`, d, [], `La regla cambia ${Math.abs(b - a)} cada vez; sigue ${d}.`, 'Encuentra el salto entre dos términos.'));
    q(P, 'igualdad', 'Una balanza tiene 12 globos a un lado y 8 al otro. ¿Cuántos agregas al lado de 8 para igualar?', 4, [], '8 + 4 = 12.', 'Cuenta cuánto falta hasta doce.');
    q(P, 'comparación', 'El malabarista compara sus fichas. ¿Cuál comparación es correcta?', '14 > 9', ['14 < 9', '14 = 9', '9 > 14', '8 > 12', '6 > 10', '7 = 8', '3 > 5'], 'Catorce es mayor que nueve: 14 > 9.', 'La abertura del signo apunta a la cantidad mayor.');
    q(P, 'igualdad', 'El malabarista completa 7 + __ = 15. ¿Qué número falta?', 8, [], '7 + 8 = 15.', 'Usa quince menos siete.');
    q(G, 'posiciones', 'En este orden 🎈 ⭐ 🎪, ¿dónde está la estrella respecto del globo?', 'derecha', positions, 'La estrella aparece a la derecha del globo.', 'Observa el orden desde el globo.');
    q(G, 'posiciones', 'En el orden 🎈 🎪 ⭐, ¿dónde está la carpa respecto de la estrella?', 'izquierda', positions, 'La carpa está a la izquierda de la estrella.', 'Toma la estrella como referencia.');
    q(G, 'posiciones', 'Un globo está guardado en el interior de la carpa. ¿Dónde está?', 'dentro', positions, 'Interior significa dentro.', 'Busca la palabra que significa interior.');
    q(G, 'figuras 2D', '¿Qué figura plana tiene tres lados rectos?', 'triángulo', shapes, 'El triángulo tiene tres lados.', 'Cuenta lados rectos.');
    q(G, 'figuras 2D', 'La pista dibujada en el suelo es redonda y sin lados rectos. ¿Qué figura es?', 'círculo', shapes, 'El círculo tiene un borde curvo cerrado.', 'Piensa en una moneda vista de frente.');
    q(G, 'figuras 2D', 'Una ficha plana tiene cuatro lados iguales y cuatro ángulos rectos. ¿Qué figura es?', 'cuadrado', shapes, 'El cuadrado cumple esas dos condiciones.', 'Busca una figura plana con lados iguales.');
    q(G, 'figuras 2D', 'Una entrada tiene dos lados largos y dos cortos, y cuatro ángulos rectos. ¿Qué figura es?', 'rectángulo', shapes, 'Un rectángulo tiene cuatro ángulos rectos y lados opuestos iguales.', 'Imagina la forma de la entrada.');
    q(G, 'figuras 3D', '¿Qué cuerpo tiene forma de pelota de malabares?', 'esfera', shapes, 'Una pelota tiene forma de esfera.', 'Es un cuerpo redondo en todas las direcciones.');
    q(G, 'figuras 3D', '¿Qué cuerpo tiene seis caras cuadradas como un dado?', 'cubo', shapes, 'El cubo tiene seis caras cuadradas.', 'Imagina un dado.');
    q(G, 'figuras 3D', '¿Qué cuerpo tiene una base circular y una punta, como un gorro de fiesta?', 'cono', shapes, 'El cono tiene una base circular y un vértice.', 'Piensa en el gorro de un payaso.');
    q(G, 'construcción de figuras', 'Un triángulo se arma con una varilla por lado. ¿Cuántas varillas necesitas?', 3, [], 'Un triángulo tiene tres lados, por eso se usan tres varillas.', 'Una varilla representa un lado.');
    q(G, 'construcción de figuras', 'Para armar el borde de un cuadrado con una varilla por lado, ¿cuántas usas?', 4, [], 'El cuadrado tiene cuatro lados.', 'Cuenta un lado cada vez.');
});

const circusGraph = table('Globos vendidos · cada ● representa 2 globos', ['Color', 'Registro'], [['Rojo', '● ● ●'], ['Azul', '● ●'], ['Amarillo', '● ● ● ●']]);
const circusBars = table('Entradas por función · cada █ representa 1 entrada', ['Función', 'Barra'], [['Mañana', '█ █ █ █'], ['Tarde', '█ █ █ █ █ █'], ['Noche', '█ █ █']]);
lesson(7, 'Los horarios del forzudo', 'Lee calendarios, mide y descubre datos del circo.', [
    ['Calendario y reloj', 'Una semana tiene 7 días. En el calendario, el día después del 14 es el 15. En un reloj digital 3:00 son las tres y 3:30 son las tres y media.'],
    ['Medir largos', 'Usa centímetros para objetos pequeños y metros para una carpa. Un metro equivale a 100 centímetros. Coloca el cero de la regla en un extremo para medir.'],
    ['Pictogramas y barras', `Lee la escala antes de contar. Aquí tres puntos representan 6 globos, porque cada punto vale 2. ${circusGraph} Las barras también permiten comparar cantidades. ${circusBars}`]
], () => {
    q(M, 'calendario', '¿Cuántos días tiene una semana de funciones?', 7, [], 'Una semana tiene siete días.', 'Recuerda los días desde lunes hasta domingo.');
    q(M, 'calendario', 'La función es el día después del jueves. ¿Qué día es?', 'viernes', days, 'Después del jueves viene el viernes.', 'Avanza un día en la semana.');
    q(M, 'calendario', 'La entrada dice 14 de mayo. Si vas al día siguiente, ¿qué número de día será?', 15, [], 'Después del día 14 viene el 15.', 'Avanza una fecha.');
    q(M, 'calendario', 'El mes después de marzo es…', 'abril', months, 'Después de marzo viene abril.', 'Revisa el orden de los meses.');
    q(M, 'reloj digital', 'La función comienza a las tres y media. ¿Qué muestra el reloj digital?', '3:30', times, 'Tres y media se escribe 3:30.', 'Media hora son treinta minutos.');
    q(M, 'reloj digital', 'El reloj del forzudo muestra 4:00. ¿A qué hora corresponde?', 'cuatro en punto', ['dos en punto', 'dos y media', 'tres en punto', 'tres y media', 'cuatro y media', 'cinco en punto', 'cinco y media'], '4:00 corresponde a las cuatro en punto.', 'Los minutos en cero indican una hora en punto.');
    q(M, 'longitud', 'Una cinta empieza en 0 de la regla y termina en 8 cm. ¿Cuántos centímetros mide?', 8, [], 'Desde cero hasta ocho hay ocho centímetros.', 'Lee la marca del extremo final.');
    q(M, 'longitud', 'Una cuerda mide 25 cm y otra 18 cm. ¿Cuántos centímetros mide la más larga?', 25, [18, 7, 43], 'Veinticinco centímetros es mayor que dieciocho.', 'Compara las dos medidas.');
    q(M, 'unidades de longitud', '¿Cuántos centímetros tiene un metro de cuerda?', 100, [10, 1, 50], 'Un metro equivale a cien centímetros.', 'Piensa en la equivalencia entre metro y centímetro.');
    q(M, 'unidades de longitud', '¿Qué unidad conviene para medir el ancho de una carpa grande?', 'metros', ['centímetros', 'minutos', 'horas', 'días', 'semanas', 'meses', 'entradas'], 'Los metros son una unidad apropiada para longitudes grandes como una carpa.', 'Primero decide si estás midiendo largo o tiempo.');
    q(D, 'pictograma con escala', `${circusGraph}¿Cuántos globos rojos se vendieron?`, 6, [], 'Tres puntos de dos globos: 2 + 2 + 2 = 6.', 'Cada punto vale dos, no uno.');
    q(D, 'pictograma con escala', `${circusGraph}¿Cuántos globos azules se vendieron?`, 4, [], 'Dos puntos representan cuatro globos.', 'Cuenta de dos en dos.');
    q(D, 'pictograma con escala', `${circusGraph}¿Cuántos globos amarillos se vendieron?`, 8, [], 'Cuatro puntos de dos globos representan ocho.', 'Cuenta la escala de cada punto.');
    q(D, 'comparar datos', `${circusGraph}¿Cuántos globos más se vendieron amarillos que azules?`, 4, [], 'Ocho menos cuatro son cuatro globos de diferencia.', 'Obtén ambas cantidades antes de restar.');
    q(D, 'gráfico de barras', `${circusBars}¿Cuántas entradas se vendieron en la tarde?`, 6, [], 'La barra de la tarde contiene seis unidades.', 'Lee la escala y la fila Tarde.');
    q(D, 'gráfico de barras', `${circusBars}¿Cuántas entradas se vendieron en la noche?`, 3, [], 'La barra de la noche contiene tres unidades.', 'Cuenta las unidades de la fila Noche.');
    q(D, 'comparar datos', `${circusBars}¿Cuántas entradas más hubo en la tarde que en la mañana?`, 2, [], 'Seis menos cuatro son dos.', 'Compara las dos barras.');
    q(D, 'registro de azar', `${table('Resultados de lanzar una moneda', ['Resultado', 'Veces'], [['Cara', 5], ['Sello', 3]])}¿Cuántas veces salió sello?`, 3, [], 'La tabla registra tres sellos.', 'Lee la fila Sello; no necesitas adivinar el próximo lanzamiento.');
    q(D, 'registro de azar', `${table('Resultados de lanzar un dado', ['Número', 'Veces'], [[1, 2], [2, 4], [3, 1]])}¿Qué número salió cuatro veces?`, 2, [], 'La fila del número dos registra cuatro veces.', 'Busca el cuatro en la columna Veces.');
    q(D, 'recolectar datos', 'Quieres saber cuántas personas prefieren cada función. ¿Qué deberías registrar?', 'la función que prefiere cada persona', ['el largo de la carpa', 'el color de tus zapatos', 'la hora de ayer', 'la altura de un árbol', 'el número de ventanas', 'el ancho de la puerta', 'la longitud de una cinta'], 'Registrar la función preferida permite comparar las preferencias.', 'Los datos deben responder a la pregunta que investigas.');
});

lesson(8, 'Los grupos de la caja sorpresa', 'Forma grupos iguales y descubre las tablas del 2, 5 y 10.', [
    ['Multiplicar es juntar grupos iguales', `Tres grupos de dos globos son 2 + 2 + 2 = 6, que escribimos 3 × 2 = 6. Mira tres filas de dos casillas: ${tiles(3, 2)}`],
    ['Tablas iniciales', 'La tabla del 2 cuenta 2, 4, 6, 8…; la del 5 cuenta 5, 10, 15, 20…; la del 10 cuenta 10, 20, 30, 40… Puedes dibujar los grupos para comprobar.'],
    ['Estrategias', 'Para 6 × 5 puedes separar seis grupos en tres y tres: 15 + 15 = 30. Duplicar una cantidad es sumar esa cantidad dos veces.']
], () => {
    [[2, 2], [3, 2], [4, 2], [5, 2], [7, 2], [9, 2], [2, 5], [3, 5], [4, 5], [6, 5], [8, 5], [10, 5], [2, 10], [3, 10], [5, 10], [7, 10]].forEach(([a, b]) => arithmetic('tablas del 2, 5 y 10', `La caja sorpresa tiene ${a} grupos de ${b} globos. ¿Cuántos globos hay?`, 'multiply', a, b, `Cuenta ${a} veces de ${b} en ${b}, o suma grupos iguales.`));
    q(N, 'grupos iguales', `${tiles(4, 2)}Cada casilla es un globo. ¿Cuántos globos hay en estas cuatro filas?`, 8, [], 'Cuatro filas de dos son 2 + 2 + 2 + 2 = 8.', 'Cuenta dos por cada fila.');
    q(N, 'grupos iguales', 'Hay 5 + 5 + 5 globos. ¿Cuántos son en total?', 15, [], 'Tres grupos de cinco son quince.', 'Puedes usar la tabla del cinco.');
    q(N, 'dobles', 'El payaso duplica sus 8 globos. ¿Cuántos tiene ahora?', 16, [], 'Duplicar es 8 + 8 = 16.', 'Usa el doble de ocho.');
    q(N, 'distributividad inicial', 'Seis grupos de 5 se separan en 3 grupos de 5 y otros 3 grupos de 5. ¿Cuántos globos hay?', 30, [], 'Cada mitad tiene 15 globos; 15 + 15 = 30.', 'Calcula tres grupos y luego duplica.');
});

lesson(9, 'El gran repaso del Dragón Globo', 'Usa todas las habilidades del circo con ocho alternativas.', [
    ['Dos cabezas, un repaso', 'El dragón mezcla las preguntas de los cuatro niveles y su propio repaso: números hasta 100, patrones, formas, medidas, gráficos y grupos de 2, 5 y 10.'],
    ['Lee antes de elegir', 'Hay <strong>ocho alternativas</strong> solo en esta pelea. Puedes usar las teclas 1 a 8. El dragón no recupera vida: tienes tiempo para leer la escala de un gráfico o dibujar un grupo.']
], () => {
    arithmetic('suma sin reserva', 'Una cabeza guarda 34 globos y la otra 25. ¿Cuántos guardan juntas?', 'add', 34, 25, 'Suma decenas y unidades sin cambiarlas.');
    arithmetic('resta sin reserva', 'El dragón tenía 78 entradas y usó 36. ¿Cuántas quedan?', 'subtract', 78, 36, 'Resta unidades y decenas.');
    q(N, 'valor posicional', 'El dragón cuenta 8 decenas y 2 unidades. ¿Cuántas fichas son?', 82, [], '80 + 2 = 82.', 'Cada decena vale diez.');
    q(N, 'conteo por saltos', 'El dragón cuenta 300, 400, 500, __. ¿Cómo sigue?', 600, [], 'El salto es de cien: después viene seiscientos.', 'Agrega una centena.');
    q(P, 'patrón numérico', 'Los globos vuelan en grupos: 15, 20, 25, __.', 30, [], 'Cada grupo aumenta cinco: sigue treinta.', 'Busca el salto que se repite.');
    q(P, 'igualdad', 'Para equilibrar las cabezas, completa 9 + __ = 17.', 8, [], 'Nueve más ocho son diecisiete.', 'Cuenta cuánto falta hasta diecisiete.');
    q(G, 'figuras 2D', 'La entrada del dragón tiene tres lados rectos. ¿Qué figura es?', 'triángulo', shapes, 'Una figura plana con tres lados es un triángulo.', 'Cuenta los lados de la entrada.');
    q(G, 'figuras 3D', 'La pelota del dragón tiene forma de…', 'esfera', shapes, 'Una pelota tiene forma de esfera.', 'Distingue cuerpos y figuras planas.');
    q(G, 'posiciones', 'En el orden 🎪 🎈 ⭐, ¿dónde está el globo respecto de la carpa?', 'derecha', positions, 'El globo aparece a la derecha de la carpa.', 'Usa la carpa como referencia.');
    q(M, 'reloj digital', 'La batalla empieza a las dos y media. ¿Qué muestra el reloj?', '2:30', times, 'Dos y media se escribe 2:30.', 'Media hora equivale a treinta minutos.');
    q(M, 'calendario', 'El dragón descansa el día después del viernes. ¿Qué día es?', 'sábado', days, 'Después del viernes viene el sábado.', 'Avanza un día.');
    q(M, 'longitud', 'La cinta del dragón va desde 0 hasta 12 cm en una regla. ¿Cuántos centímetros mide?', 12, [], 'Del cero al doce hay doce centímetros.', 'Lee la marca final.');
    q(M, 'unidades de longitud', 'Un metro de cinta contiene ¿cuántos centímetros?', 100, [10, 1, 50], 'Un metro equivale a cien centímetros.', 'Recuerda la equivalencia.');
    q(D, 'pictograma con escala', 'Cada ● vale 2 globos. La cabeza izquierda muestra ● ● ● ● ●. ¿Cuántos globos representa?', 10, [], 'Cinco grupos de dos son diez globos.', 'Cuenta de dos en dos.');
    q(D, 'gráfico de barras', `${table('Entradas del dragón · cada █ vale 1', ['Cabeza', 'Barra'], [['Izquierda', '█ █ █'], ['Derecha', '█ █ █ █ █']])}¿Cuántas entradas tiene la cabeza derecha?`, 5, [], 'La barra derecha contiene cinco unidades.', 'Cuenta la fila Derecha.');
    q(D, 'registro de azar', `${table('Lanzamientos de la moneda del dragón', ['Resultado', 'Veces'], [['Cara', 4], ['Sello', 6]])}¿Cuántas veces salió cara?`, 4, [], 'La tabla registra cuatro caras.', 'Lee el dato; no predigas el siguiente lanzamiento.');
    [[4, 2], [5, 5], [6, 10]].forEach(([a, b]) => arithmetic('tablas del 2, 5 y 10', `El dragón prepara ${a} paquetes con ${b} globos cada uno. ¿Cuántos prepara?`, 'multiply', a, b, 'Dibuja los grupos o cuenta con la tabla correspondiente.'));
    q(N, 'operaciones inversas', 'Si el dragón junta 32 + 16 = 48, ¿cuánto es 48 − 16?', 32, [], 'Deshacer la suma devuelve treinta y dos.', 'Usa la operación inversa.');
});

lesson(10, 'Las cuentas del peón', 'Organiza centenas y calcula hasta 1.000.', [
    ['Centenas, decenas y unidades', '347 son 3 centenas, 4 decenas y 7 unidades: 300 + 40 + 7. Para comparar, mira centenas, luego decenas y unidades.'],
    ['Sumar con reserva', 'En 248 + 137, 8 + 7 = 15 unidades: cambia diez por una decena. Quedan 5 unidades; las decenas son 4 + 3 + 1 = 8 y las centenas 2 + 1 = 3. Resultado: 385.'],
    ['Restar y comprobar', 'Para 432 − 118, cambia una decena por diez unidades: quedan 12 unidades y 2 decenas. 12 − 8 = 4, 2 − 1 = 1 y 4 − 1 = 3: quedan 314. Comprueba sumando 314 + 118.'],
    ['Patrones y casillas vacías', 'En 125, 150, 175 se agrega 25. En 24 + □ = 40, la casilla vale 16. Puedes usar una resta para encontrarla.']
], () => {
    q(N, 'valor posicional', 'El peón guarda 347 caramelos. ¿Cuántas centenas completas tiene?', 3, [4, 7, 34], '347 contiene tres centenas, cuatro decenas y siete unidades.', 'Una centena es un grupo de cien.');
    q(N, 'valor posicional', 'Hay 5 centenas, 2 decenas y 6 caramelos sueltos. ¿Cuántos hay?', 526, [562, 256, 625], '500 + 20 + 6 = 526.', 'Suma el valor de cada posición.');
    q(N, 'comparación', 'Elige el mayor tesoro: 409, 490, 419 o 450.', 490, [409, 419, 450], 'Todos tienen cuatro centenas; nueve decenas es la mayor cantidad.', 'Compara centenas y luego decenas.');
    q(N, 'orden', '¿Qué número va entre 698 y 700 al contar de uno en uno?', 699, [697, 690, 701], 'La secuencia es 698, 699, 700.', 'Avanza una unidad.');
    q(N, 'conteo por saltos', 'Los peones cuentan de 4 en 4: 12, 16, 20, __.', 24, [22, 25, 28], 'Cada salto suma cuatro; 20 + 4 = 24.', 'Conserva el salto.');
    q(N, 'estimación', 'Un saco tiene casi lo mismo que otro de 100 caramelos. ¿Qué estimación usarías?', 100, [10, 500, 1000], 'La referencia parecida es cien caramelos.', 'Usa el saco conocido para estimar.');
    [[248, 137], [356, 275], [427, 162], [185, 206], [64, 38]].forEach(([a, b]) => arithmetic('suma hasta 1000', `El peón junta ${a} caramelos de fresa y ${b} de limón. ¿Cuántos tiene?`, 'add', a, b, 'Suma por posiciones y cambia diez unidades por una decena si hace falta.'));
    [[432, 118], [700, 245], [563, 231], [306, 128], [100, 46]].forEach(([a, b]) => arithmetic('resta hasta 1000', `De ${a} caramelos del peón se reparten ${b}. ¿Cuántos quedan?`, 'subtract', a, b, 'Resta por posiciones y cambia una decena o centena cuando haga falta.'));
    q(P, 'patrón numérico', 'El camino dulce sigue 125, 150, 175, __.', 200, [180, 195, 225], 'Se agrega veinticinco cada vez: sigue doscientos.', 'Calcula la diferencia entre términos vecinos.');
    q(P, 'ecuación de un paso', 'Completa la caja del peón: 24 + □ = 40.', 16, [14, 24, 64], '40 − 24 = 16, por eso 24 + 16 = 40.', 'Usa la resta para encontrar lo que falta.');
    q(P, 'ecuación de un paso', 'El peón resuelve □ − 18 = 25. ¿Qué valor va en la casilla?', 43, [7, 35, 42], '25 + 18 = 43, y 43 − 18 = 25.', 'Devuelve lo que se había quitado.');
    q(N, 'operaciones inversas', 'Si 235 + 140 = 375, ¿cuánto es 375 − 140?', 235, [140, 375, 515], 'Restar lo agregado devuelve la cantidad inicial, 235.', 'Deshaz la suma.');
});

lesson(11, 'Los repartos del caballo', 'Domina las tablas hasta 10 y sus divisiones.', [
    ['Filas y columnas', `Tres filas de cuatro bombones son 3 × 4 = 12. Girar el arreglo muestra 4 × 3: la cantidad no cambia. ${tiles(3, 4)}`],
    ['Repartir y agrupar', '24 bombones repartidos entre 6 caballos dan 4 a cada uno: 24 ÷ 6 = 4. Si haces grupos de 6, obtienes 4 grupos. La multiplicación comprueba la división: 4 × 6 = 24.'],
    ['Construir las tablas', 'Para 7 × 6, separa cinco grupos y dos grupos: 5 × 6 + 2 × 6 = 30 + 12 = 42. Multiplicar por 1 deja la cantidad; multiplicar por 0 da cero. Aquí todas las divisiones son exactas y el divisor nunca es cero.']
], () => {
    [[3, 4], [6, 6], [7, 8], [8, 9], [9, 7], [6, 9], [7, 6], [10, 10], [8, 1], [5, 0]].forEach(([a, b]) => arithmetic('tablas hasta 10', `El caballo prepara ${a} filas de ${b} bombones. ¿Cuántos bombones prepara?`, 'multiply', a, b, 'Usa grupos iguales, una tabla conocida o separa los grupos.'));
    [[24, 6], [42, 7], [56, 8], [72, 9], [63, 7], [36, 4], [90, 10], [48, 6]].forEach(([a, b]) => arithmetic('división exacta', `El caballo reparte ${a} bombones por igual entre ${b} piezas. ¿Cuántos recibe cada pieza?`, 'divide', a, b, 'Busca qué número multiplicado por la cantidad de piezas da el total.'));
    q(N, 'agrupación', 'Hay 35 bombones. Si guardas 5 en cada bolsa, ¿cuántas bolsas completas obtienes?', 7, [5, 6, 8], '35 ÷ 5 = 7 bolsas.', 'Cuenta cuántos grupos de cinco caben.');
    q(N, 'operaciones inversas', 'Si 8 × 7 = 56, ¿cuánto es 56 ÷ 7?', 8, [7, 9, 49], 'La división deshace la multiplicación: 56 ÷ 7 = 8.', 'Usa la multiplicación que ya conoces.');
});

lesson(12, 'El mapa del alfil', 'Explora fracciones, cuerpos, ángulos y perímetros.', [
    ['Partes iguales', `Una fracción indica cuántas partes iguales tomas. 1/4 es una de cuatro; 3/4 son tres de cuatro. ${tiles(1, 4, 3)} Al comparar partes del mismo entero con igual denominador, tres cuartos son más que un cuarto porque tomas más partes del mismo tamaño. Una de dos partes iguales es 1/2; una de tres es 1/3.`],
    ['Figuras y mapas', 'Los cuerpos tienen caras, aristas y vértices. Un cubo tiene 6 caras, 12 aristas y 8 vértices. Una red de seis cuadrados, colocados para plegarse sin superponerse, puede formar un cubo. En un mapa usa una casilla como referencia y sigue las direcciones indicadas.'],
    ['Giros y bordes', 'Un ángulo recto mide 90°; la mitad, 45°. Una traslación desliza una figura, una rotación la gira y una reflexión la muestra como en un espejo. El perímetro es la suma de los lados: un rectángulo de 5 y 3 cm tiene 5 + 3 + 5 + 3 = 16 cm.']
], () => {
    q(N, 'fracciones', `${tiles(1, 4, 1)}Una tableta tiene cuatro partes iguales y una coloreada. ¿Qué fracción está coloreada?`, '1/4', ['1/2', '3/4', '1/3'], 'Se coloreó una de cuatro partes iguales: un cuarto.', 'El denominador cuenta todas las partes iguales.');
    q(N, 'fracciones', `${tiles(1, 3, 2)}Dos de tres partes iguales de una golosina están coloreadas. ¿Qué fracción representan?`, '2/3', ['1/3', '3/4', '1/2'], 'Son dos partes tomadas de un total de tres.', 'El numerador indica las partes tomadas.');
    q(N, 'fracciones', 'El alfil divide una galleta en dos partes iguales y toma una. ¿Qué fracción toma?', '1/2', ['1/3', '1/4', '3/4'], 'Una de dos partes iguales es una mitad.', 'Primero cuenta todas las partes iguales.');
    q(N, 'comparar fracciones', 'De dos tabletas iguales, ¿qué porción es mayor: 3/4 o 1/4?', '3/4', ['1/4', 'son iguales', 'no se puede comparar'], 'Tres cuartos son más que un cuarto del mismo entero.', 'Las partes tienen el mismo tamaño: compara cuántas tomas.');
    q(N, 'comparar fracciones', 'En una misma tableta, ¿qué porción es menor: 1/3 o 2/3?', '1/3', ['2/3', 'son iguales', 'las dos son el entero'], 'Una de tres partes es menos que dos de esas mismas partes.', 'Ambas porciones usan tercios iguales.');
    q(N, 'fracciones', `${tiles(1, 3, 1)}Una de tres partes iguales de la galleta está coloreada. ¿Qué fracción representa?`, '1/3', ['1/4', '1/2', '2/3'], 'Una parte tomada de tres partes iguales es un tercio.', 'Cuenta todas las partes y luego las coloreadas.');
    q(N, 'fracciones de uso común', `${tiles(1, 4, 3)}Tres partes de una tableta dividida en cuatro partes iguales representan…`, '3/4', ['1/4', '2/3', '1/2'], 'Tres de cuatro partes iguales son tres cuartos.', 'Cuenta las partes coloreadas y el total.');
    q(G, 'mapas', 'En un mapa, el alfil parte en B2 y avanza una columna a la derecha, sin cambiar de fila. ¿Dónde llega?', 'C2', ['A2', 'B3', 'C3'], 'La columna que sigue a B es C; la fila permanece en 2.', 'Solo cambia la columna.');
    q(G, 'mapas', 'Las filas del mapa aumentan hacia arriba. Desde C2, sube dos casillas. ¿Dónde llega?', 'C4', ['C3', 'A2', 'E2'], 'La columna sigue siendo C y la fila aumenta de 2 a 4.', 'No cambies la columna.');
    q(G, 'cuerpos y redes', 'Una red que se pliega para formar un cubo debe tener ¿cuántas caras cuadradas?', 6, [4, 8, 12], 'El cubo tiene seis caras cuadradas.', 'Imagina las caras de un dado.');
    q(G, 'cuerpos y redes', '¿Cuántos vértices tiene la caja cúbica del alfil?', 8, [6, 10, 12], 'Un cubo tiene ocho vértices: cuatro arriba y cuatro abajo.', 'Cuenta las esquinas en ambos niveles.');
    q(G, 'cuerpos y redes', '¿Qué cuerpo tiene dos bases circulares y una superficie curva, como una lata?', 'cilindro', ['cono', 'esfera', 'cubo'], 'El cilindro tiene dos bases circulares paralelas.', 'Piensa en una lata de golosinas.');
    q(G, 'ángulos', 'La esquina recta del tablero sirve de referencia. ¿Cuántos grados mide?', 90, [45, 60, 180], 'Un ángulo recto mide noventa grados.', 'Es la esquina de un cuadrado.');
    q(G, 'ángulos', 'Un giro mide la mitad de un ángulo recto. ¿Cuántos grados son?', 45, [90, 30, 180], 'La mitad de 90 es 45 grados.', 'Divide noventa en dos partes iguales.');
    q(G, 'transformaciones', 'Una ficha se desliza tres casillas sin girar ni voltearse. ¿Qué movimiento hizo?', 'traslación', ['rotación', 'reflexión', 'cambio de tamaño'], 'Deslizar sin cambiar orientación es una traslación.', 'Observa si la ficha gira o solo cambia de lugar.');
    q(G, 'transformaciones', 'El alfil gira una figura alrededor de un punto. ¿Qué transformación realiza?', 'rotación', ['traslación', 'reflexión', 'cambio de tamaño'], 'Girar alrededor de un punto es una rotación.', 'Identifica el movimiento de giro.');
    q(G, 'transformaciones', 'El dibujo de una ficha aparece invertido como en un espejo. ¿Qué transformación es?', 'reflexión', ['rotación', 'traslación', 'cambio de tamaño'], 'La imagen de espejo es una reflexión.', 'Piensa en lo que muestra un espejo.');
    q(M, 'perímetro', 'Un jardín cuadrado de caramelos tiene lados de 4 cm. ¿Cuántos centímetros mide su perímetro?', 16, [8, 12, 20], 'El borde suma 4 + 4 + 4 + 4 = 16 cm.', 'Suma los cuatro lados.');
    q(M, 'perímetro', 'Un tablero rectangular mide 5 cm por 3 cm. ¿Cuántos centímetros mide todo su borde?', 16, [8, 15, 10], 'El perímetro es 5 + 3 + 5 + 3 = 16 cm.', 'Incluye los cuatro lados, no solo dos.');
    q(M, 'perímetro', 'Un sendero triangular tiene lados de 3, 4 y 5 m. ¿Cuántos metros mide su perímetro?', 12, [7, 9, 20], '3 + 4 + 5 = 12 metros.', 'Suma todos los lados del sendero.');
});

const kingdomGraph = table('Golosinas del reino · cada ● representa 5', ['Pieza', 'Registro'], [['Peón', '● ●'], ['Caballo', '● ● ● ●'], ['Alfil', '● ● ●']]);
const linePlot = table('Puntos por cantidad de golosinas · cada × representa 1 bolsa', ['Golosinas en la bolsa', 'Bolsas'], [[2, '× ×'], [3, '× × ×'], [4, '×']]);
lesson(13, 'La torre de los registros', 'Lee horas, compara masas e investiga datos del reino.', [
    ['Tiempo y longitud', 'Un reloj digital 4:15 marca las cuatro y cuarto. En el análogo la aguja corta indica la hora y la larga los minutos; cada salto entre números vale 5 minutos. Entre 3:20 y 3:45 pasan 25 minutos. Para medir largo, alinea el cero de la regla.'],
    ['Masa', 'Usa gramos para una golosina y kilogramos para un saco. 1 kg equivale a 1.000 g. Para comparar, expresa las medidas en la misma unidad.'],
    ['Encuestas y registros', `Una encuesta recoge respuestas a una pregunta. Lee la escala: aquí cada punto vale cinco golosinas. ${kingdomGraph} Un diagrama de puntos registra cuántas veces aparece cada valor. ${linePlot}`],
    ['Experimentos', 'Al lanzar una moneda puedes registrar cara y sello. Los resultados observados no garantizan el siguiente resultado. Aquí leemos y comparamos registros; no necesitamos calcular porcentajes ni probabilidades formales.']
], () => {
    q(M, 'reloj', 'La torre muestra 4:15. ¿Cómo se lee esa hora?', 'cuatro y cuarto', ['cuatro y media', 'cuatro en punto', 'cinco y cuarto'], 'Quince minutos son un cuarto de hora.', 'Lee la hora y luego los minutos.');
    q(M, 'reloj', 'En el reloj de la torre la aguja larga apunta al 6 y la corta está entre 3 y 4. ¿Qué hora marca?', '3:30', ['6:15', '3:00', '4:30'], 'La aguja larga en seis indica treinta minutos; la hora es tres y media.', 'La aguja larga marca los minutos.');
    q(M, 'duración', 'La guardia comienza a las 3:20 y termina a las 3:45. ¿Cuántos minutos dura?', 25, [20, 15, 35], '45 − 20 = 25 minutos; ambas horas son las tres.', 'Compara los minutos dentro de la misma hora.');
    q(M, 'reloj', 'La aguja larga apunta al 3 y la corta está un poco después del 2. ¿Qué hora es?', '2:15', ['3:10', '2:30', '3:00'], 'La aguja larga en tres marca quince minutos: son las dos y cuarto.', 'Cada salto de la aguja larga representa cinco minutos.');
    q(M, 'masa', '¿Cuántos gramos tiene un saco de 1 kg de golosinas?', 1000, [100, 10, 500], 'Un kilogramo equivale a mil gramos.', 'Recuerda la equivalencia entre kilogramo y gramo.');
    q(M, 'masa', 'Una bolsa pesa 750 g y otra 500 g. ¿Cuántos gramos pesa la más pesada?', 750, [500, 250, 700], 'Setecientos cincuenta gramos es mayor que quinientos.', 'Las dos medidas ya usan la misma unidad.');
    q(M, 'masa', 'Una bolsa de azúcar tiene 1 kg y otra 600 g. ¿Cuál tiene mayor masa?', 'la de 1 kg', ['la de 600 g', 'son iguales', 'no se puede comparar'], '1 kg son 1.000 g, más que 600 g.', 'Convierte el kilogramo a gramos.');
    q(M, 'masa', 'El saco tenía 900 g de caramelos y se usaron 250 g. ¿Cuántos gramos quedan?', 650, [750, 550, 850], '900 − 250 = 650 gramos.', 'Resta la masa que se usó.');
    q(D, 'pictograma con escala', `${kingdomGraph}¿Cuántas golosinas tiene el caballo?`, 20, [4, 10, 15], 'Cuatro puntos de cinco representan veinte golosinas.', 'Multiplica la cantidad de puntos por cinco.');
    q(D, 'pictograma con escala', `${kingdomGraph}¿Cuántas golosinas tiene el alfil?`, 15, [3, 10, 20], 'Tres puntos de cinco representan quince.', 'Lee la escala del pictograma.');
    q(D, 'comparar datos', `${kingdomGraph}¿Cuántas golosinas más tiene el caballo que el peón?`, 10, [2, 5, 15], 'El caballo tiene 20 y el peón 10: la diferencia es 10.', 'Convierte los puntos a golosinas antes de restar.');
    q(D, 'gráfico de barras', `${table('Bolsas preparadas · cada █ vale 2 bolsas', ['Turno', 'Barra'], [['Mañana', '█ █ █'], ['Tarde', '█ █ █ █']])}¿Cuántas bolsas se prepararon en la tarde?`, 8, [4, 6, 10], 'Cuatro unidades de dos representan ocho bolsas.', 'Cada bloque vale dos bolsas.');
    q(D, 'diagrama de puntos', `${linePlot}¿Cuántas bolsas tienen 3 golosinas?`, 3, [2, 4, 6], 'En la fila del valor tres hay tres cruces: tres bolsas.', 'Cada cruz cuenta una bolsa, no una golosina.');
    q(D, 'diagrama de puntos', `${linePlot}¿Cuántas bolsas se registraron en total?`, 6, [3, 4, 9], 'Se registraron 2 + 3 + 1 = 6 bolsas.', 'Suma todas las cruces.');
    q(D, 'encuesta', 'La torre quiere saber la golosina favorita de sus guardias. ¿Qué pregunta debe hacer?', '¿Qué golosina prefieres?', ['¿Cuánto mides?', '¿Qué hora es?', '¿Cuántas puertas tiene la torre?'], 'La pregunta recoge la preferencia que se desea investigar.', 'Relaciona la pregunta con la información buscada.');
    q(D, 'encuesta', `${table('Votos de los guardias', ['Golosina', 'Votos'], [['Caramelo', 7], ['Bombón', 4], ['Galleta', 5]])}¿Cuál obtuvo más votos?`, 'caramelo', ['bombón', 'galleta', 'todas igual'], 'Caramelo obtuvo siete votos, la cantidad mayor.', 'Compara las tres frecuencias.');
    q(D, 'registro de azar', `${table('Moneda del reino', ['Resultado', 'Veces'], [['Cara', 6], ['Sello', 4]])}¿Cuántos lanzamientos se registraron?`, 10, [6, 4, 12], 'Seis caras más cuatro sellos suman diez lanzamientos.', 'Suma las dos frecuencias.');
    q(D, 'registro de azar', `${table('Moneda de la torre', ['Resultado', 'Veces'], [['Cara', 3], ['Sello', 7]])}¿Qué resultado ocurrió más veces?`, 'sello', ['cara', 'ambos igual', 'ninguno'], 'Sello ocurrió siete veces, más que tres.', 'Lee los resultados observados.');
    q(D, 'azar', 'Una moneda salió cara tres veces seguidas. ¿Qué puedes afirmar sobre el próximo lanzamiento?', 'puede salir cara o sello', ['saldrá cara con seguridad', 'saldrá sello con seguridad', 'no puede salir cara'], 'Los resultados anteriores no aseguran la próxima cara de la moneda.', 'Un registro no es una garantía del resultado siguiente.');
    q(M, 'longitud', 'Una cinta del reino se extiende desde 0 hasta 24 cm en la regla. ¿Cuántos centímetros mide?', 24, [12, 20, 25], 'Su longitud es de veinticuatro centímetros.', 'Alinea el extremo inicial con el cero.');
});

lesson(14, 'El jaque de la Reina de Azúcar', 'Repasa 3.º básico y sigue la respuesta entre las casillas.', [
    ['Repaso del reino', 'La reina mezcla lo aprendido con el peón, el caballo, el alfil y la torre: números hasta 1.000, tablas y división exacta, fracciones sencillas, mapas, perímetros, tiempo, masa y datos.'],
    ['Jaque de Azúcar', 'Las <strong>cuatro alternativas cambian de posición cada dos segundos</strong>. Sigue el valor o el texto que resuelve la pregunta, no su posición. La mezcla se detiene al responder, mantener pulsada una opción, abrir una lección o el perfil, u ocultar la pestaña. Puedes usar las teclas 1 a 4 según las posiciones visibles. La reina tiene 20 HP y no recupera vida.'],
    ['Comprueba', 'Para una división, comprueba multiplicando. Para un perímetro, suma todos los lados. Para un gráfico, lee primero la escala. Todas estas estrategias ya aparecieron en los niveles anteriores.']
], () => {
    q(N, 'valor posicional', 'El tesoro real tiene 6 centenas, 3 decenas y 2 unidades. ¿Cuántos caramelos son?', 632, [623, 362, 236], '600 + 30 + 2 = 632.', 'Respeta el valor de cada posición.');
    arithmetic('suma hasta 1000', 'La reina reúne 267 caramelos y recibe 158. ¿Cuántos tiene?', 'add', 267, 158, 'Suma por posiciones y cambia diez unidades por una decena cuando haga falta.');
    arithmetic('resta hasta 1000', 'De 600 caramelos reales se entregan 275. ¿Cuántos quedan?', 'subtract', 600, 275, 'Puedes cambiar una centena en decenas y una decena en unidades.');
    arithmetic('tablas hasta 10', 'Hay 7 filas de 9 golosinas en el tablero real. ¿Cuántas golosinas hay?', 'multiply', 7, 9, 'Usa la tabla del nueve o separa cinco filas y dos filas.');
    arithmetic('división exacta', 'La reina reparte 64 bombones entre 8 piezas por igual. ¿Cuántos recibe cada pieza?', 'divide', 64, 8, 'Busca qué número multiplicado por ocho da sesenta y cuatro.');
    q(N, 'agrupación', 'La reina guarda 54 caramelos en bolsas de 6. ¿Cuántas bolsas llena?', 9, [6, 8, 10], '54 ÷ 6 = 9 bolsas.', 'Busca cuántos grupos de seis forman cincuenta y cuatro.');
    q(P, 'patrón numérico', 'La ruta de la reina es 250, 275, 300, __.', 325, [305, 320, 350], 'Se agrega veinticinco cada vez.', 'Conserva el salto.');
    q(P, 'ecuación de un paso', 'Completa el cofre real: 35 + □ = 60.', 25, [15, 35, 95], '60 − 35 = 25.', 'Encuentra lo que falta con una resta.');
    q(N, 'fracciones', `${tiles(1, 4, 3)}¿Qué fracción de la tableta real está coloreada?`, '3/4', ['1/4', '1/2', '2/3'], 'Tres de cuatro partes iguales son tres cuartos.', 'Cuenta partes coloreadas y partes totales.');
    q(N, 'comparar fracciones', 'En dos galletas iguales, ¿qué porción es mayor: 1/3 o 2/3?', '2/3', ['1/3', 'son iguales', 'ninguna representa una porción'], 'Dos tercios son más que un tercio del mismo entero.', 'Las partes tienen el mismo tamaño.');
    q(G, 'cuerpos y redes', '¿Cuántas caras cuadradas tiene el cofre cúbico de la reina?', 6, [4, 8, 12], 'Un cubo tiene seis caras cuadradas.', 'Imagina las caras de un dado.');
    q(G, 'mapas', 'Desde D3, la reina se mueve una columna a la izquierda, sin cambiar de fila. ¿Dónde llega?', 'C3', ['E3', 'D2', 'C2'], 'Antes de D está C; la fila sigue siendo tres.', 'Solo cambia la columna.');
    q(G, 'ángulos', 'Una esquina recta de la corona mide ¿cuántos grados?', 90, [45, 60, 180], 'Un ángulo recto mide noventa grados.', 'Recuerda la esquina de un cuadrado.');
    q(G, 'transformaciones', 'La reina desliza un dibujo sin girarlo ni voltearlo. ¿Qué transformación hace?', 'traslación', ['rotación', 'reflexión', 'cambio de tamaño'], 'Deslizar conservando la orientación es una traslación.', 'Distingue deslizar de girar.');
    q(M, 'perímetro', 'El jardín real es cuadrado y cada lado mide 6 m. ¿Cuántos metros mide su perímetro?', 24, [12, 18, 36], '6 + 6 + 6 + 6 = 24 metros.', 'Suma los cuatro lados.');
    q(M, 'reloj', 'La guardia de la reina empieza a las 5:15. ¿Cómo se lee?', 'cinco y cuarto', ['cinco y media', 'cinco en punto', 'seis y cuarto'], 'Quince minutos son un cuarto de hora.', 'Lee primero la hora.');
    q(M, 'masa', 'La reina compara un saco de 1 kg y otro de 800 g. ¿Cuál tiene mayor masa?', 'el de 1 kg', ['el de 800 g', 'son iguales', 'no se puede comparar'], 'Un kilogramo son mil gramos, más que ochocientos.', 'Expresa ambos en gramos.');
    q(D, 'pictograma con escala', 'Cada ● vale 5 caramelos. El cofre real muestra ● ● ● ● ● ●. ¿Cuántos representa?', 30, [6, 25, 35], 'Seis grupos de cinco representan treinta caramelos.', 'Lee la escala antes de contar.');
    q(D, 'diagrama de puntos', `${table('Bolsas del palacio · cada × representa una bolsa', ['Caramelos por bolsa', 'Bolsas'], [[2, '×'], [3, '× × × ×'], [4, '× ×']])}¿Cuántas bolsas contienen 3 caramelos?`, 4, [3, 7, 12], 'En el valor tres hay cuatro cruces: cuatro bolsas.', 'Cada cruz representa una bolsa.');
    q(D, 'registro de azar', `${table('Moneda de la reina', ['Resultado', 'Veces'], [['Cara', 8], ['Sello', 5]])}¿Cuántos lanzamientos se registraron?`, 13, [8, 5, 3], 'Ocho caras más cinco sellos suman trece lanzamientos.', 'Suma todas las frecuencias.');
});

// Retain artwork, IDs, HP and the dragon/queen abilities. Align combat copy with
// the new lessons and allow first graders to read without the tree healing.
const combatCopy = {
    1: ['¡Arrr! ¡Cuenta mi tesoro con calma, marinero!', '✋ ¡Cuenta y organiza el tesoro para vencer al pirata!'],
    2: ['¡Junta mis manzanas y descubre los patrones de mi barco!', '✋ ¡Resuelve las cuentas y los patrones del capitán!'],
    3: ['¡Sigue el mapa y lee los registros de mi tropa!', '🎖️ ¡Explora formas, medidas y datos para romper la formación!'],
    4: ['¡Firmes! ¡Demuestra todo lo que aprendiste en mi isla!', '🎖️ ¡Repasa la isla con calma! El general no recupera vida.'],
    5: ['¡Bienvenidos a mi boletería de globos y decenas!', '✋ ¡Organiza las entradas y resuelve las cuentas del payaso!'],
    6: ['¡Sigue mis patrones y descubre las formas de la pista!', '✋ ¡Descubre patrones y figuras para desarmar los malabares!'],
    7: ['¡Lee mi horario y los registros del gran espectáculo!', '✋ ¡Lee medidas, horarios y datos para desinflar las pesas!'],
    8: ['¡Mi caja guarda grupos iguales de globos! ¿Cuántos habrá?', '🎁 ¡Forma grupos de 2, 5 y 10 para abrir la caja sorpresa!'],
    10: ['¡Agrupa mis caramelos en centenas, decenas y unidades!', '¡Cada cuenta correcta abre paso entre las filas del peón!'],
    11: ['¡Forma grupos iguales y reparte mis bombones!', '¡Multiplica y reparte para alcanzar al caballo!'],
    12: ['¡Sigue mi mapa y descubre las partes de cada golosina!', '¡Explora fracciones y figuras para encontrar la siguiente casilla!'],
    13: ['¡Lee los registros de mi torre dulce!', '¡Interpreta medidas y datos para derribar mi defensa!']
};
for (const [id, [intro, description]] of Object.entries(combatCopy)) {
    const level = levels.find(l => l.id === Number(id));
    const enemy = level.enemy || level.boss;
    enemy.dialogue.intro = intro;
    enemy.mechanicDesc = description;
}
levels.find(l => l.id === 4).boss.regenRate = 0;
levels.find(l => l.id === 12).enemy.dialogue.defeat = '¡Has encontrado el camino! La siguiente casilla es tuya.';
levels.find(l => l.id === 13).enemy.dialogue.defeat = '¡Has leído mis registros! El palacio de la reina te espera.';

for (const world of worlds.filter(w => w.grade)) {
    const worldLevels = levels.filter(l => l.worldId === world.id);
    const prompts = worldLevels.flatMap(l => l.questions.map(q => q.prompt));
    assert.equal(new Set(prompts).size, prompts.length, `Repeated prompt in ${world.id}`);
    const axes = new Set(worldLevels.flatMap(l => l.questions.map(q => q.axis)));
    assert.equal(axes.size, 5, `Missing curricular axis in ${world.id}`);
}

const original = fs.readFileSync(target, 'utf8');
const laterWorlds = original.indexOf('    // MUNDO 4:');
assert.ok(laterWorlds > 0, 'Missing stable boundary before world 4');
const tailStart = original.lastIndexOf('    // ==========================================', laterWorlds);
const header = '// MathQuest: Base de datos de Mundos, Niveles, Teoría y Preguntas\n' +
    '// Mundos 1–3: contenido de scripts/build-primary-content.cjs.\n' +
    `var WORLDS_DATA = ${JSON.stringify(worlds, null, 4)};\n\nvar LEVELS_DATA = [\n`;
const primary = levels.filter(l => l.grade).map(l => JSON.stringify(l, null, 4).split('\n').map(line => '    ' + line).join('\n')).join(',\n');
fs.writeFileSync(target, header + primary + ',\n\n' + original.slice(tailStart), 'utf8');
console.log('Updated 14 levels: 280 questions, 20 per level; all five axes per world.');
