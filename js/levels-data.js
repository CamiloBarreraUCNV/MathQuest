// Kalkú: Base de datos de Mundos, Niveles, Teoría y Preguntas
// Mundos 1–3: contenido de scripts/build-primary-content.cjs.
var WORLDS_DATA = [
    {
        "id": "world-1",
        "num": 1,
        "title": "Isla de los Números",
        "subtitle": "1.º básico: números, primeras operaciones y exploración de la isla",
        "color": "#10b981",
        "bgGradient": "linear-gradient(135deg, #059669, #10b981)",
        "icon": "🌱",
        "battleBg": "assets/world-1/battle-stage-clean.jpg",
        "cardCharacter": "assets/world-1/pirate-apple-80s.png",
        "cardTopics": "1.º básico · Números · Formas · Medidas",
        "description": "Cuenta el tesoro de los piratas, resuelve sumas y restas hasta 20 y explora formas, medidas y datos entre manzanos.",
        "grade": 1
    },
    {
        "id": "world-2",
        "num": 2,
        "title": "Circo de las Sumas",
        "subtitle": "2.º básico: operaciones hasta 100, grupos iguales y datos del circo",
        "color": "#0284c7",
        "bgGradient": "linear-gradient(135deg, #0369a1, #0ea5e9)",
        "icon": "🎪",
        "battleBg": "assets/world-2/circus-battle-background-80s.png",
        "cardCharacter": "assets/world-2/circus-balloon-two-headed-dragon-80s.png",
        "cardTopics": "2.º básico · Sumas · Grupos · Datos",
        "description": "Organiza los globos del circo: trabaja hasta 100, descubre las tablas del 2, 5 y 10 y aprende con figuras, horarios y gráficos.",
        "grade": 2
    },
    {
        "id": "world-3",
        "num": 3,
        "title": "Reino del Jaque Dulce",
        "subtitle": "3.º básico: tablas, división, fracciones y desafíos del reino",
        "color": "#f59e0b",
        "bgGradient": "linear-gradient(135deg, #9d174d, #db2777)",
        "icon": "♟️",
        "battleBg": "assets/world-3/candy-chess-battle-background-80s.png",
        "cardCharacter": "assets/world-3/candy-chess-queen-80s.png",
        "cardTopics": "3.º básico · Tablas · División · Fracciones",
        "description": "Resuelve operaciones hasta 1.000, reparte golosinas, explora fracciones, mapas y medidas y desafía a la Reina de Azúcar.",
        "grade": 3
    },
    {
        "id": "world-4",
        "num": 4,
        "title": "Bosque del Álgebra",
        "subtitle": "Despeja las incógnitas y descifra el lenguaje de los símbolos",
        "color": "#8b5cf6",
        "bgGradient": "linear-gradient(135deg, #7c3aed, #a855f7)",
        "icon": "🔮",
        "description": "Descubre el misterio de la variable x, resuelve ecuaciones lineales y desbloquea el poder de las potencias."
    },
    {
        "id": "world-5",
        "num": 5,
        "title": "Pico de las Funciones",
        "subtitle": "Conecta entradas con salidas, pendientes y razones de cambio",
        "color": "#06b6d4",
        "bgGradient": "linear-gradient(135deg, #0891b2, #06b6d4)",
        "icon": "🏔️",
        "description": "Explora la máquina de transformar números f(x), gráficas en el plano cartesiano y la inclinación de las rectas."
    },
    {
        "id": "world-6",
        "num": 6,
        "title": "Nexo del Cálculo",
        "subtitle": "La cumbre matemática: La recta tangente y las reglas de derivación",
        "color": "#ec4899",
        "bgGradient": "linear-gradient(135deg, #db2777, #f43f5e)",
        "icon": "🌌",
        "description": "El poder de medir el cambio instantáneo. Domina la regla de la potencia, constantes, polinomios y funciones trigonométricas."
    }
];

var LEVELS_DATA = [
    {
        "id": 1,
        "worldId": "world-1",
        "title": "El tesoro de las decenas",
        "subtitle": "1.º básico · Cuenta, compara y organiza las manzanas del pirata.",
        "icon": "🔢",
        "hasEnemy": true,
        "enemy": {
            "id": "manzana_pirata",
            "name": "Manzana Pirata",
            "title": "Pirata de la Bahía Numérica",
            "avatar": "🍎🏴‍☠️",
            "avatarDefeated": "😵🏴‍☠️",
            "avatarImg": "assets/world-1/pirate-apple-80s.png",
            "badge": "PIRATA",
            "badgeClass": "pirate",
            "maxHp": 20,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡Duelo de Cachetadas!",
            "mechanicDesc": "✋ ¡Cuenta y organiza el tesoro para vencer al pirata!",
            "dialogue": {
                "intro": "¡Arrr! ¡Cuenta mi tesoro con calma, marinero!",
                "hit": "¡Rayos y centellas! ¡Menuda bofetada!",
                "defeat": "¡Me rindo, marinero de los números!"
            }
        },
        "theory": {
            "title": "El tesoro de las decenas",
            "content": "<p><strong>1.º básico.</strong> Cuenta, compara y organiza las manzanas del pirata.</p><h3>Contar y ordenar</h3><p>Cuenta cada objeto una vez. Para avanzar de 2 en 2 suma 2; de 5 en 5 suma 5; de 10 en 10 suma 10. También puedes retroceder. Practicaremos estos conteos hasta 100. Primero, segundo y tercero indican una posición; décimo es el lugar 10.</p><h3>Decenas y unidades</h3><p>Diez manzanas forman <strong>una decena</strong>. 14 son 1 decena y 4 unidades: 10 + 4. Separar un número de distintas maneras ayuda a calcular: 8 = 5 + 3.</p><h3>Comparar y estimar</h3><p>Entre 8 y 12, el menor es 8. Si ves un grupo parecido a otro de 10 objetos, puedes estimar que tiene cerca de 10 sin contar exactamente.</p>"
        },
        "questions": [
            {
                "id": "w1-l1-q1",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo",
                "prompt": "¿Cuántas manzanas tiene el pirata? 🍎 🍎 🍎 🍎",
                "options": [
                    "4",
                    "3",
                    "5",
                    "6"
                ],
                "correct": 0,
                "explanation": "Hay 4: contamos una manzana cada vez.",
                "hint": "Señala cada manzana una sola vez."
            },
            {
                "id": "w1-l1-q2",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "cero",
                "prompt": "El cofre del pirata está vacío. ¿Cuántas manzanas contiene?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                "correct": 0,
                "explanation": "Cero representa que no hay manzanas.",
                "hint": "Vacío significa que no tiene ninguna."
            },
            {
                "id": "w1-l1-q3",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo",
                "prompt": "El pirata cuenta 6, 7, 8. ¿Qué número sigue?",
                "options": [
                    "9",
                    "7",
                    "10",
                    "6"
                ],
                "correct": 0,
                "explanation": "Al avanzar uno desde 8 llegamos a 9.",
                "hint": "Avanza un lugar en la cuenta."
            },
            {
                "id": "w1-l1-q4",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo",
                "prompt": "Retrocede desde 12: 12, 11, 10, __. ¿Qué sigue?",
                "options": [
                    "9",
                    "8",
                    "11",
                    "12"
                ],
                "correct": 0,
                "explanation": "Después de 10, al retroceder, viene 9.",
                "hint": "Quita uno al último número."
            },
            {
                "id": "w1-l1-q5",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Cuenta manzanas de 2 en 2: 2, 4, 6, __.",
                "options": [
                    "8",
                    "7",
                    "9",
                    "10"
                ],
                "correct": 0,
                "explanation": "Cada salto suma 2: 6 + 2 = 8.",
                "hint": "Haz otro salto de dos."
            },
            {
                "id": "w1-l1-q6",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Cuenta sacos de 5 en 5: 5, 10, 15, __.",
                "options": [
                    "20",
                    "16",
                    "18",
                    "19"
                ],
                "correct": 0,
                "explanation": "Después de 15, cinco más son 20.",
                "hint": "Cuenta cinco pasos desde 15."
            },
            {
                "id": "w1-l1-q7",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Cuenta hasta el puerto de 10 en 10: 60, 70, 80, __.",
                "options": [
                    "90",
                    "81",
                    "85",
                    "100"
                ],
                "correct": 0,
                "explanation": "Un salto de diez desde 80 llega a 90.",
                "hint": "Conserva el salto de diez."
            },
            {
                "id": "w1-l1-q8",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "El barco retrocede: 100, 90, 80, __.",
                "options": [
                    "70",
                    "60",
                    "79",
                    "90"
                ],
                "correct": 0,
                "explanation": "Se retrocede de diez en diez: después de 80 viene 70.",
                "hint": "Cada paso quita diez."
            },
            {
                "id": "w1-l1-q9",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "ordinales",
                "prompt": "El capitán llega después del segundo pirata. ¿Qué lugar ocupa?",
                "options": [
                    "tercero",
                    "primero",
                    "cuarto",
                    "quinto"
                ],
                "correct": 0,
                "explanation": "Después del segundo lugar está el tercero.",
                "hint": "Cuenta lugares: primero, segundo..."
            },
            {
                "id": "w1-l1-q10",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "ordinales",
                "prompt": "La décima caja ocupa el lugar número…",
                "options": [
                    "10",
                    "1",
                    "9",
                    "20"
                ],
                "correct": 0,
                "explanation": "Décima significa que ocupa el lugar 10.",
                "hint": "Los ordinales indican posiciones."
            },
            {
                "id": "w1-l1-q11",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "comparación",
                "prompt": "Un pirata tiene 8 manzanas y otro 13. ¿Cuántas tiene el que tiene más?",
                "options": [
                    "13",
                    "8",
                    "5",
                    "12"
                ],
                "correct": 0,
                "explanation": "13 es mayor que 8.",
                "hint": "Piensa qué cantidad está más adelante al contar."
            },
            {
                "id": "w1-l1-q12",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "comparación",
                "prompt": "Entre 17, 12, 9 y 15, ¿cuál es el número menor?",
                "options": [
                    "9",
                    "12",
                    "15",
                    "17"
                ],
                "correct": 0,
                "explanation": "9 está antes que los otros números al contar.",
                "hint": "Busca la cantidad más pequeña."
            },
            {
                "id": "w1-l1-q13",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "¿Cuántas manzanas forman una decena?",
                "options": [
                    "10",
                    "1",
                    "5",
                    "20"
                ],
                "correct": 0,
                "explanation": "Una decena es un grupo de diez unidades.",
                "hint": "Piensa en un grupo de diez."
            },
            {
                "id": "w1-l1-q14",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "En 14 manzanas hay 1 decena. ¿Cuántas unidades quedan sueltas?",
                "options": [
                    "4",
                    "1",
                    "10",
                    "14"
                ],
                "correct": 0,
                "explanation": "14 = 10 + 4: hay cuatro unidades sueltas.",
                "hint": "Separa un grupo de diez."
            },
            {
                "id": "w1-l1-q15",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "Hay 1 decena y 7 manzanas sueltas. ¿Cuántas hay en total?",
                "options": [
                    "17",
                    "7",
                    "10",
                    "18"
                ],
                "correct": 0,
                "explanation": "10 + 7 = 17 manzanas.",
                "hint": "Una decena vale diez."
            },
            {
                "id": "w1-l1-q16",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "composición",
                "prompt": "El tesoro tiene 8 monedas: 5 en una bolsa y __ en otra.",
                "options": [
                    "3",
                    "2",
                    "4",
                    "5"
                ],
                "correct": 0,
                "explanation": "5 + 3 = 8. Faltan tres monedas.",
                "hint": "Cuenta desde 5 hasta 8."
            },
            {
                "id": "w1-l1-q17",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "composición",
                "prompt": "¿Qué cantidad forman 10 manzanas y 9 manzanas?",
                "options": [
                    "19",
                    "9",
                    "18",
                    "20"
                ],
                "correct": 0,
                "explanation": "10 + 9 = 19.",
                "hint": "Junta la decena con las unidades."
            },
            {
                "id": "w1-l1-q18",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "representación",
                "prompt": "¿Qué número representa la palabra «dieciséis»?",
                "options": [
                    "16",
                    "6",
                    "15",
                    "17"
                ],
                "correct": 0,
                "explanation": "Dieciséis se escribe 16.",
                "hint": "Son diez y seis."
            },
            {
                "id": "w1-l1-q19",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "estimación",
                "prompt": "Una cesta tiene casi lo mismo que otra de 10 manzanas. ¿Qué estimación es razonable?",
                "options": [
                    "cerca de 10",
                    "cerca de 1",
                    "cerca de 50",
                    "cerca de 100"
                ],
                "correct": 0,
                "explanation": "Si se parece al grupo de diez, estimamos cerca de diez.",
                "hint": "Usa como referencia la cesta conocida."
            },
            {
                "id": "w1-l1-q20",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "orden",
                "prompt": "En la ruta faltó un número: 16, 17, __, 19, 20. ¿Cuál?",
                "options": [
                    "18",
                    "15",
                    "17",
                    "20"
                ],
                "correct": 0,
                "explanation": "18 está entre 17 y 19.",
                "hint": "Avanza uno desde 17."
            }
        ],
        "grade": 1,
        "skills": [
            "conteo",
            "cero",
            "conteo por saltos",
            "ordinales",
            "comparación",
            "valor posicional",
            "composición",
            "representación",
            "estimación",
            "orden"
        ]
    },
    {
        "id": 2,
        "worldId": "world-1",
        "title": "Las cuentas del capitán",
        "subtitle": "1.º básico · Junta, quita y descubre patrones hasta 20.",
        "icon": "⚖️",
        "hasEnemy": true,
        "enemy": {
            "id": "capitan_manzana",
            "name": "Capitán Manzana",
            "title": "Comandante del Galeón Mayor y Menor",
            "avatar": "🍎⚔️",
            "avatarDefeated": "😵⚔️",
            "avatarImg": "assets/world-1/pirate-apple-captain-80s.png",
            "badge": "CAPITÁN",
            "badgeClass": "captain",
            "maxHp": 20,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡Duelo de Cachetadas!",
            "mechanicDesc": "✋ ¡Resuelve las cuentas y los patrones del capitán!",
            "dialogue": {
                "intro": "¡Junta mis manzanas y descubre los patrones de mi barco!",
                "hit": "¡Rayos y centellas! ¡Esa bofetada fue MAYOR que mi paciencia!",
                "defeat": "¡Mis velas han caído! ¡Has demostrado ser el amo de las magnitudes!"
            }
        },
        "theory": {
            "title": "Las cuentas del capitán",
            "content": "<p><strong>1.º básico.</strong> Junta, quita y descubre patrones hasta 20.</p><h3>Juntar y quitar</h3><p>Sumar junta cantidades: 4 + 3 = 7. Restar quita o encuentra lo que falta: 7 − 3 = 4. Son operaciones inversas. Sumar o quitar cero deja la misma cantidad.</p><h3>Estrategias</h3><p>Para 8 + 5, toma 2 del 5 y completa diez: 8 + 2 + 3 = 13. Para 6 + 6 usa un doble. Puedes contar hacia atrás para restar.</p><h3>Patrones y equilibrio</h3><p>En 🍎 🍐 🍎 🍐 se repite manzana, pera. En 2, 4, 6, 8 se suma 2. El signo = indica que ambos lados valen lo mismo, como una balanza equilibrada: 4 + 2 = 6.</p>"
        },
        "questions": [
            {
                "id": "w1-l2-q1",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El capitán junta 4 manzanas con 3 más. ¿Cuántas tiene?",
                "options": [
                    "7",
                    "8",
                    "6",
                    "9"
                ],
                "correct": 0,
                "explanation": "4 + 3 = 7. Junta las cantidades; puedes completar diez.",
                "hint": "Junta las cantidades; puedes completar diez.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        4,
                        3
                    ]
                }
            },
            {
                "id": "w1-l2-q2",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El capitán junta 5 manzanas con 0 más. ¿Cuántas tiene?",
                "options": [
                    "5",
                    "6",
                    "4",
                    "7"
                ],
                "correct": 0,
                "explanation": "5 + 0 = 5. Junta las cantidades; puedes completar diez.",
                "hint": "Junta las cantidades; puedes completar diez.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        5,
                        0
                    ]
                }
            },
            {
                "id": "w1-l2-q3",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El capitán junta 6 manzanas con 6 más. ¿Cuántas tiene?",
                "options": [
                    "12",
                    "13",
                    "11",
                    "14"
                ],
                "correct": 0,
                "explanation": "6 + 6 = 12. Junta las cantidades; puedes completar diez.",
                "hint": "Junta las cantidades; puedes completar diez.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        6,
                        6
                    ]
                }
            },
            {
                "id": "w1-l2-q4",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El capitán junta 8 manzanas con 5 más. ¿Cuántas tiene?",
                "options": [
                    "13",
                    "14",
                    "12",
                    "15"
                ],
                "correct": 0,
                "explanation": "8 + 5 = 13. Junta las cantidades; puedes completar diez.",
                "hint": "Junta las cantidades; puedes completar diez.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        8,
                        5
                    ]
                }
            },
            {
                "id": "w1-l2-q5",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El capitán junta 9 manzanas con 7 más. ¿Cuántas tiene?",
                "options": [
                    "16",
                    "17",
                    "15",
                    "18"
                ],
                "correct": 0,
                "explanation": "9 + 7 = 16. Junta las cantidades; puedes completar diez.",
                "hint": "Junta las cantidades; puedes completar diez.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        9,
                        7
                    ]
                }
            },
            {
                "id": "w1-l2-q6",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El capitán junta 10 manzanas con 8 más. ¿Cuántas tiene?",
                "options": [
                    "18",
                    "19",
                    "17",
                    "20"
                ],
                "correct": 0,
                "explanation": "10 + 8 = 18. Junta las cantidades; puedes completar diez.",
                "hint": "Junta las cantidades; puedes completar diez.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        10,
                        8
                    ]
                }
            },
            {
                "id": "w1-l2-q7",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "De 7 manzanas del barco se entregan 3. ¿Cuántas quedan?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "7 − 3 = 4. Quita la cantidad entregada y cuenta lo que queda.",
                "hint": "Quita la cantidad entregada y cuenta lo que queda.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        7,
                        3
                    ]
                }
            },
            {
                "id": "w1-l2-q8",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "De 10 manzanas del barco se entregan 4. ¿Cuántas quedan?",
                "options": [
                    "6",
                    "7",
                    "5",
                    "8"
                ],
                "correct": 0,
                "explanation": "10 − 4 = 6. Quita la cantidad entregada y cuenta lo que queda.",
                "hint": "Quita la cantidad entregada y cuenta lo que queda.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        10,
                        4
                    ]
                }
            },
            {
                "id": "w1-l2-q9",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "De 15 manzanas del barco se entregan 5. ¿Cuántas quedan?",
                "options": [
                    "10",
                    "11",
                    "9",
                    "12"
                ],
                "correct": 0,
                "explanation": "15 − 5 = 10. Quita la cantidad entregada y cuenta lo que queda.",
                "hint": "Quita la cantidad entregada y cuenta lo que queda.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        15,
                        5
                    ]
                }
            },
            {
                "id": "w1-l2-q10",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "De 18 manzanas del barco se entregan 6. ¿Cuántas quedan?",
                "options": [
                    "12",
                    "13",
                    "11",
                    "14"
                ],
                "correct": 0,
                "explanation": "18 − 6 = 12. Quita la cantidad entregada y cuenta lo que queda.",
                "hint": "Quita la cantidad entregada y cuenta lo que queda.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        18,
                        6
                    ]
                }
            },
            {
                "id": "w1-l2-q11",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "De 12 manzanas del barco se entregan 0. ¿Cuántas quedan?",
                "options": [
                    "12",
                    "13",
                    "11",
                    "14"
                ],
                "correct": 0,
                "explanation": "12 − 0 = 12. Quita la cantidad entregada y cuenta lo que queda.",
                "hint": "Quita la cantidad entregada y cuenta lo que queda.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        12,
                        0
                    ]
                }
            },
            {
                "id": "w1-l2-q12",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "De 20 manzanas del barco se entregan 9. ¿Cuántas quedan?",
                "options": [
                    "11",
                    "12",
                    "10",
                    "13"
                ],
                "correct": 0,
                "explanation": "20 − 9 = 11. Quita la cantidad entregada y cuenta lo que queda.",
                "hint": "Quita la cantidad entregada y cuenta lo que queda.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        20,
                        9
                    ]
                }
            },
            {
                "id": "w1-l2-q13",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "operaciones inversas",
                "prompt": "Si 7 + 5 = 12, ¿cuánto es 12 − 5?",
                "options": [
                    "7",
                    "5",
                    "12",
                    "17"
                ],
                "correct": 0,
                "explanation": "Quitar las cinco que agregamos nos devuelve a siete.",
                "hint": "Deshaz la suma."
            },
            {
                "id": "w1-l2-q14",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "igualdad",
                "prompt": "La balanza tiene 8 monedas a un lado y 5 al otro. ¿Cuántas agregas al lado de 5 para equilibrarla?",
                "options": [
                    "3",
                    "2",
                    "4",
                    "5"
                ],
                "correct": 0,
                "explanation": "5 + 3 = 8: los dos lados quedan iguales.",
                "hint": "Busca cuánto falta desde cinco hasta ocho."
            },
            {
                "id": "w1-l2-q15",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "igualdad",
                "prompt": "Completa para que ambos lados valgan lo mismo: 6 + __ = 10.",
                "options": [
                    "4",
                    "3",
                    "5",
                    "6"
                ],
                "correct": 0,
                "explanation": "6 + 4 = 10.",
                "hint": "Cuenta desde seis hasta diez."
            },
            {
                "id": "w1-l2-q16",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "patrón repetitivo",
                "prompt": "Continúa las frutas del capitán: 🍎 🍐 🍎 🍐 __.",
                "options": [
                    "🍎",
                    "🍐",
                    "🍌",
                    "🍇"
                ],
                "correct": 0,
                "explanation": "Se repite manzana, pera; ahora toca manzana.",
                "hint": "Observa el grupo que vuelve a empezar."
            },
            {
                "id": "w1-l2-q17",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "patrón repetitivo",
                "prompt": "El tambor suena: fuerte, suave, suave, fuerte, suave, __.",
                "options": [
                    "suave",
                    "fuerte",
                    "silencio",
                    "dos golpes fuertes"
                ],
                "correct": 0,
                "explanation": "El grupo es fuerte, suave, suave. Falta el segundo suave.",
                "hint": "Busca el grupo de tres sonidos."
            },
            {
                "id": "w1-l2-q18",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "Los barcos avanzan: 3, 6, 9, __. ¿Qué número sigue?",
                "options": [
                    "12",
                    "10",
                    "11",
                    "15"
                ],
                "correct": 0,
                "explanation": "Se suma tres cada vez: 9 + 3 = 12.",
                "hint": "Mira cuánto aumenta entre dos números."
            },
            {
                "id": "w1-l2-q19",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "Las cajas bajan: 20, 18, 16, __.",
                "options": [
                    "14",
                    "12",
                    "15",
                    "18"
                ],
                "correct": 0,
                "explanation": "Se resta dos: 16 − 2 = 14.",
                "hint": "Cada paso baja dos."
            },
            {
                "id": "w1-l2-q20",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "comparación",
                "prompt": "La balanza tiene 9 monedas a la izquierda y 6 a la derecha. ¿Qué lado tiene más?",
                "options": [
                    "izquierda",
                    "derecha",
                    "ambos por igual",
                    "ninguno"
                ],
                "correct": 0,
                "explanation": "Nueve es mayor que seis; el lado izquierdo tiene más.",
                "hint": "Compara las dos cantidades."
            }
        ],
        "grade": 1,
        "skills": [
            "suma hasta 20",
            "resta hasta 20",
            "operaciones inversas",
            "igualdad",
            "patrón repetitivo",
            "patrón numérico",
            "comparación"
        ]
    },
    {
        "id": 3,
        "worldId": "world-1",
        "title": "El mapa de la isla",
        "subtitle": "1.º básico · Explora formas, posiciones, medidas y pictogramas.",
        "icon": "📏",
        "hasEnemy": true,
        "enemy": {
            "id": "manzana_comandante",
            "name": "Manzana Comandante",
            "title": "Comandante de la Guardia del Manzano",
            "avatar": "🍎🎖️",
            "avatarDefeated": "😵🎖️",
            "avatarImg": "assets/world-1/pirate-apple-commander-80s.png",
            "badge": "COMANDANTE",
            "badgeClass": "pirate",
            "maxHp": 30,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡Rompe la formación!",
            "mechanicDesc": "🎖️ ¡Explora formas, medidas y datos para romper la formación!",
            "dialogue": {
                "intro": "¡Sigue el mapa y lee los registros de mi tropa!",
                "hit": "¡Mis filas! ¡Has roto la formación!",
                "defeat": "¡Retirada! Has demostrado un dominio impecable de los números."
            }
        },
        "theory": {
            "title": "El mapa de la isla",
            "content": "<p><strong>1.º básico.</strong> Explora formas, posiciones, medidas y pictogramas.</p><h3>Figuras y posiciones</h3><p>Un triángulo tiene 3 lados rectos; un cuadrado tiene 4 lados iguales; un círculo tiene borde curvo. Una esfera es un cuerpo como una pelota; un cubo es como un dado. Arriba, abajo, dentro y fuera describen posiciones.</p><h3>Comparar y ordenar</h3><p>Para comparar largos, alinea un extremo de los objetos. Puedes usar clips iguales como unidad: 5 clips es más largo que 3. Primero desayunamos, después navegamos. Un día dura más que una hora. Los meses y los días de la semana también tienen un orden: después de marzo viene abril y después del lunes viene el martes.</p><h3>Leer datos</h3><p>En un pictograma cada dibujo representa una cantidad. Lee siempre cuánto vale cada dibujo. Aquí Ana tiene 3 manzanas y Sol tiene 4. <div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cosecha de la isla · cada 🍎 representa 1 manzana</caption><thead><tr><th scope=\"col\">Pirata</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Ana</th><td>🍎 🍎 🍎</td></tr><tr><th scope=\"row\">Leo</th><td>🍎 🍎</td></tr><tr><th scope=\"row\">Sol</th><td>🍎 🍎 🍎 🍎</td></tr></tbody></table></div></p>"
        },
        "questions": [
            {
                "id": "w1-l3-q1",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "¿Qué figura de la bandera tiene 3 lados rectos?",
                "options": [
                    "triángulo",
                    "cuadrado",
                    "círculo",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "Un triángulo tiene tres lados rectos.",
                "hint": "Cuenta los lados de cada figura."
            },
            {
                "id": "w1-l3-q2",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "¿Qué figura plana tiene un borde curvo, sin lados rectos?",
                "options": [
                    "círculo",
                    "triángulo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "El borde del círculo es una curva cerrada.",
                "hint": "Piensa en la forma de una moneda vista de frente."
            },
            {
                "id": "w1-l3-q3",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "Una baldosa plana tiene 4 lados iguales y 4 esquinas como las de una hoja. ¿Qué figura es?",
                "options": [
                    "cuadrado",
                    "triángulo",
                    "círculo",
                    "rectángulo alargado"
                ],
                "correct": 0,
                "explanation": "El cuadrado tiene cuatro lados iguales y cuatro ángulos rectos.",
                "hint": "Imagina una baldosa cuadrada."
            },
            {
                "id": "w1-l3-q4",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "¿Qué cuerpo tiene forma de pelota?",
                "options": [
                    "esfera",
                    "cubo",
                    "cono",
                    "cilindro"
                ],
                "correct": 0,
                "explanation": "Una pelota tiene forma de esfera.",
                "hint": "Piensa en una forma redonda en todas las direcciones."
            },
            {
                "id": "w1-l3-q5",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "Un dado del pirata tiene forma de…",
                "options": [
                    "cubo",
                    "esfera",
                    "cono",
                    "círculo"
                ],
                "correct": 0,
                "explanation": "El dado es un cubo: es un cuerpo con caras cuadradas.",
                "hint": "Piensa en las caras planas de un dado."
            },
            {
                "id": "w1-l3-q6",
                "grade": 1,
                "axis": "Geometría",
                "skill": "líneas",
                "prompt": "¿Qué camino no se dobla ni se curva?",
                "options": [
                    "línea recta",
                    "línea curva",
                    "círculo",
                    "espiral"
                ],
                "correct": 0,
                "explanation": "Una línea recta conserva su dirección.",
                "hint": "Piensa en el borde de una regla."
            },
            {
                "id": "w1-l3-q7",
                "grade": 1,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "En este orden: 🍎 ⭐ 🌳. ¿Dónde está la estrella respecto de la manzana?",
                "options": [
                    "derecha",
                    "izquierda",
                    "arriba",
                    "abajo"
                ],
                "correct": 0,
                "explanation": "La estrella está a la derecha de la manzana.",
                "hint": "Lee el orden de izquierda a derecha."
            },
            {
                "id": "w1-l3-q8",
                "grade": 1,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "La manzana está guardada en el interior del cofre. ¿Dónde está?",
                "options": [
                    "dentro",
                    "fuera",
                    "arriba",
                    "debajo"
                ],
                "correct": 0,
                "explanation": "Estar en el interior significa estar dentro.",
                "hint": "Busca la palabra que significa interior."
            },
            {
                "id": "w1-l3-q9",
                "grade": 1,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "Una cuerda mide 5 clips iguales y otra 3. ¿Cuál es más larga?",
                "options": [
                    "la de 5 clips",
                    "la de 3 clips",
                    "son iguales",
                    "no se pueden comparar"
                ],
                "correct": 0,
                "explanation": "Con clips iguales, cinco unidades cubren más largo que tres.",
                "hint": "Compara cuántas veces cabe la misma unidad."
            },
            {
                "id": "w1-l3-q10",
                "grade": 1,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "Un palo mide 2 lápices iguales y otro 4. ¿Cuál es más corto?",
                "options": [
                    "el de 2 lápices",
                    "el de 4 lápices",
                    "son iguales",
                    "ninguno"
                ],
                "correct": 0,
                "explanation": "Dos lápices representan menos longitud que cuatro.",
                "hint": "Las unidades deben ser iguales."
            },
            {
                "id": "w1-l3-q11",
                "grade": 1,
                "axis": "Medición",
                "skill": "tiempo",
                "prompt": "¿Qué dura más: una hora o un día?",
                "options": [
                    "un día",
                    "una hora",
                    "duran igual",
                    "un instante"
                ],
                "correct": 0,
                "explanation": "Un día contiene muchas horas.",
                "hint": "Piensa en todo lo que haces durante un día."
            },
            {
                "id": "w1-l3-q12",
                "grade": 1,
                "axis": "Medición",
                "skill": "secuencia temporal",
                "prompt": "Para plantar un manzano: primero haces un hoyo, luego pones la semilla y al final riegas. ¿Qué haces después del hoyo?",
                "options": [
                    "poner la semilla",
                    "regar",
                    "cosechar",
                    "comer la manzana"
                ],
                "correct": 0,
                "explanation": "La semilla se pone después de hacer el hoyo.",
                "hint": "Sigue el orden indicado."
            },
            {
                "id": "w1-l3-q13",
                "grade": 1,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "Si hoy es lunes, ¿qué día será mañana?",
                "options": [
                    "martes",
                    "domingo",
                    "miércoles",
                    "viernes"
                ],
                "correct": 0,
                "explanation": "Después del lunes viene el martes.",
                "hint": "Avanza un día en la semana."
            },
            {
                "id": "w1-l3-q14",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "pictograma",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cosecha de la isla · cada 🍎 representa 1 manzana</caption><thead><tr><th scope=\"col\">Pirata</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Ana</th><td>🍎 🍎 🍎</td></tr><tr><th scope=\"row\">Leo</th><td>🍎 🍎</td></tr><tr><th scope=\"row\">Sol</th><td>🍎 🍎 🍎 🍎</td></tr></tbody></table></div>¿Cuántas manzanas recogió Leo?",
                "options": [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "correct": 0,
                "explanation": "La fila de Leo tiene dos dibujos; cada uno vale una manzana.",
                "hint": "Cuenta los dibujos de la fila de Leo."
            },
            {
                "id": "w1-l3-q15",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "pictograma",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cosecha de la isla · cada 🍎 representa 1 manzana</caption><thead><tr><th scope=\"col\">Pirata</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Ana</th><td>🍎 🍎 🍎</td></tr><tr><th scope=\"row\">Leo</th><td>🍎 🍎</td></tr><tr><th scope=\"row\">Sol</th><td>🍎 🍎 🍎 🍎</td></tr></tbody></table></div>¿Cuántas manzanas recogió Sol?",
                "options": [
                    "4",
                    "2",
                    "3",
                    "5"
                ],
                "correct": 0,
                "explanation": "Sol tiene cuatro dibujos de una manzana cada uno.",
                "hint": "Lee la fila de Sol."
            },
            {
                "id": "w1-l3-q16",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "comparar datos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cosecha de la isla · cada 🍎 representa 1 manzana</caption><thead><tr><th scope=\"col\">Pirata</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Ana</th><td>🍎 🍎 🍎</td></tr><tr><th scope=\"row\">Leo</th><td>🍎 🍎</td></tr><tr><th scope=\"row\">Sol</th><td>🍎 🍎 🍎 🍎</td></tr></tbody></table></div>¿Quién recogió más manzanas?",
                "options": [
                    "Sol",
                    "Ana",
                    "Leo",
                    "todos igual"
                ],
                "correct": 0,
                "explanation": "Sol tiene cuatro, más que tres y dos.",
                "hint": "Busca la fila con más dibujos."
            },
            {
                "id": "w1-l3-q17",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "comparar datos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cosecha de la isla · cada 🍎 representa 1 manzana</caption><thead><tr><th scope=\"col\">Pirata</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Ana</th><td>🍎 🍎 🍎</td></tr><tr><th scope=\"row\">Leo</th><td>🍎 🍎</td></tr><tr><th scope=\"row\">Sol</th><td>🍎 🍎 🍎 🍎</td></tr></tbody></table></div>¿Quién recogió menos manzanas?",
                "options": [
                    "Leo",
                    "Ana",
                    "Sol",
                    "todos igual"
                ],
                "correct": 0,
                "explanation": "Leo tiene dos, la menor cantidad.",
                "hint": "Busca la fila con menos dibujos."
            },
            {
                "id": "w1-l3-q18",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "registro de datos",
                "prompt": "El pirata registra sus monedas con rayitas: | | | | |. ¿Cuántas registró?",
                "options": [
                    "5",
                    "4",
                    "6",
                    "3"
                ],
                "correct": 0,
                "explanation": "Cada rayita registra una moneda: hay cinco.",
                "hint": "Cuenta cada marca una vez."
            },
            {
                "id": "w1-l3-q19",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "pictograma",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cosecha de la isla · cada 🍎 representa 1 manzana</caption><thead><tr><th scope=\"col\">Pirata</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Ana</th><td>🍎 🍎 🍎</td></tr><tr><th scope=\"row\">Leo</th><td>🍎 🍎</td></tr><tr><th scope=\"row\">Sol</th><td>🍎 🍎 🍎 🍎</td></tr></tbody></table></div>¿Cuántas manzanas recogieron Ana y Leo juntos?",
                "options": [
                    "5",
                    "3",
                    "4",
                    "6"
                ],
                "correct": 0,
                "explanation": "Ana tiene 3 y Leo 2; 3 + 2 = 5.",
                "hint": "Junta los dibujos de ambas filas."
            },
            {
                "id": "w1-l3-q20",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "recolectar datos",
                "prompt": "Quieres saber la fruta favorita de los piratas. ¿Qué pregunta sirve?",
                "options": [
                    "¿Qué fruta prefieres?",
                    "¿Cuánto mide el barco?",
                    "¿Qué hora es?",
                    "¿Cuántas velas tiene el barco?"
                ],
                "correct": 0,
                "explanation": "Preguntar por la fruta favorita permite registrar esas preferencias.",
                "hint": "La pregunta debe tratar sobre lo que quieres averiguar."
            }
        ],
        "grade": 1,
        "skills": [
            "figuras 2D",
            "figuras 3D",
            "líneas",
            "posiciones",
            "longitud",
            "tiempo",
            "secuencia temporal",
            "calendario",
            "pictograma",
            "comparar datos",
            "registro de datos",
            "recolectar datos"
        ]
    },
    {
        "id": 4,
        "worldId": "world-1",
        "title": "El desafío del Manzano Ancestral",
        "subtitle": "1.º básico · Repasa los tesoros, las cuentas y el mapa de la isla.",
        "icon": "🌳",
        "isBoss": true,
        "boss": {
            "id": "general_guardian_ancestral",
            "name": "General Guardián Ancestral",
            "title": "Comandante Supremo del Manzano",
            "avatar": "🌳🎖️",
            "avatarDefeated": "😵🌳",
            "avatarImg": "assets/world-1/island-guardian-general-80s.png",
            "badge": "JEFE",
            "badgeClass": "boss",
            "maxHp": 20,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "regen",
            "mechanicTitle": "Fotosíntesis del General",
            "mechanicDesc": "🎖️ ¡Repasa la isla con calma! El general no recupera vida.",
            "dialogue": {
                "intro": "¡Firmes! ¡Demuestra todo lo que aprendiste en mi isla!",
                "hit": "¡Rayos y ramas rotas! ¡Esa bofetada desordenó mis medallas!",
                "defeat": "¡Sobresaliente disciplina! ¡Te concedo la Medalla de Honor y la Gema de los Números!"
            }
        },
        "theory": {
            "title": "El desafío del Manzano Ancestral",
            "content": "<p><strong>1.º básico.</strong> Repasa los tesoros, las cuentas y el mapa de la isla.</p><h3>Prepara tu estrategia</h3><p>Este guardián mezcla lo practicado: números y decenas, sumas y restas hasta 20, patrones, figuras, medidas y datos. Lee la leyenda si aparece un pictograma.</p><h3>Un ejemplo de repaso</h3><p>Si hay 10 manzanas en una caja y 3 sueltas, hay 13. Si entregas 2 de las sueltas quedan 11. Contar, dibujar o deshacer una operación te ayuda a comprobar.</p>"
        },
        "questions": [
            {
                "id": "w1-l4-q1",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo",
                "prompt": "El general cuenta 13, 14, 15, __. ¿Cómo continúa?",
                "options": [
                    "16",
                    "14",
                    "17",
                    "18"
                ],
                "correct": 0,
                "explanation": "Un paso después de 15 es 16.",
                "hint": "Suma uno."
            },
            {
                "id": "w1-l4-q2",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Las tropas marchan de 5 en 5: 20, 25, 30, __.",
                "options": [
                    "35",
                    "31",
                    "40",
                    "25"
                ],
                "correct": 0,
                "explanation": "30 más cinco son 35.",
                "hint": "Conserva el salto de cinco."
            },
            {
                "id": "w1-l4-q3",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "El general reúne 1 decena y 8 unidades. ¿Cuántas manzanas hay?",
                "options": [
                    "18",
                    "8",
                    "10",
                    "19"
                ],
                "correct": 0,
                "explanation": "10 + 8 = 18.",
                "hint": "Una decena equivale a diez."
            },
            {
                "id": "w1-l4-q4",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "ordinales",
                "prompt": "El noveno soldado deja pasar a uno delante de él. ¿Qué lugar ocupa ahora?",
                "options": [
                    "décimo",
                    "octavo",
                    "noveno",
                    "primero"
                ],
                "correct": 0,
                "explanation": "Al pasar uno delante, su posición pasa de nueve a diez.",
                "hint": "La posición aumenta en uno."
            },
            {
                "id": "w1-l4-q5",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "El manzano tiene 7 manzanas y crecen 6 más. ¿Cuántas hay?",
                "options": [
                    "13",
                    "14",
                    "12",
                    "15"
                ],
                "correct": 0,
                "explanation": "7 + 6 = 13. Completa diez con tres de las seis y luego suma las otras tres.",
                "hint": "Completa diez con tres de las seis y luego suma las otras tres.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        7,
                        6
                    ]
                }
            },
            {
                "id": "w1-l4-q6",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "resta hasta 20",
                "prompt": "El general guarda 16 manzanas y entrega 7. ¿Cuántas conserva?",
                "options": [
                    "9",
                    "10",
                    "8",
                    "11"
                ],
                "correct": 0,
                "explanation": "16 − 7 = 9. Quita siete; puedes pasar por diez.",
                "hint": "Quita siete; puedes pasar por diez.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        16,
                        7
                    ]
                }
            },
            {
                "id": "w1-l4-q7",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "suma hasta 20",
                "prompt": "Dos ramas tienen 8 manzanas cada una. ¿Cuántas tienen juntas?",
                "options": [
                    "16",
                    "17",
                    "15",
                    "18"
                ],
                "correct": 0,
                "explanation": "8 + 8 = 16. Usa el doble de ocho.",
                "hint": "Usa el doble de ocho.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        8,
                        8
                    ]
                }
            },
            {
                "id": "w1-l4-q8",
                "grade": 1,
                "axis": "Números y operaciones",
                "skill": "comparación",
                "prompt": "Elige la menor cantidad para la cesta pequeña: 11, 7, 15 o 19.",
                "options": [
                    "7",
                    "11",
                    "15",
                    "19"
                ],
                "correct": 0,
                "explanation": "Siete es la menor de esas cantidades.",
                "hint": "Busca la cantidad que aparece antes al contar."
            },
            {
                "id": "w1-l4-q9",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "patrón repetitivo",
                "prompt": "La guardia sigue: hoja, hoja, manzana, hoja, hoja, __.",
                "options": [
                    "manzana",
                    "hoja",
                    "rama",
                    "flor"
                ],
                "correct": 0,
                "explanation": "Se repite hoja, hoja, manzana.",
                "hint": "Busca el grupo de tres."
            },
            {
                "id": "w1-l4-q10",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "Completa la escalera: 4, 8, 12, __.",
                "options": [
                    "16",
                    "14",
                    "15",
                    "18"
                ],
                "correct": 0,
                "explanation": "La escalera suma cuatro en cada paso.",
                "hint": "Compara dos números vecinos."
            },
            {
                "id": "w1-l4-q11",
                "grade": 1,
                "axis": "Patrones y álgebra",
                "skill": "igualdad",
                "prompt": "La balanza del general debe quedar igual: 9 + __ = 12.",
                "options": [
                    "3",
                    "2",
                    "4",
                    "5"
                ],
                "correct": 0,
                "explanation": "Nueve más tres son doce.",
                "hint": "Cuenta cuánto falta hasta doce."
            },
            {
                "id": "w1-l4-q12",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "La señal del general tiene 3 lados rectos. ¿Qué figura es?",
                "options": [
                    "triángulo",
                    "círculo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "Tres lados rectos forman un triángulo.",
                "hint": "Cuenta los lados."
            },
            {
                "id": "w1-l4-q13",
                "grade": 1,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "La pelota del entrenamiento tiene forma de…",
                "options": [
                    "esfera",
                    "cubo",
                    "cono",
                    "cuadrado"
                ],
                "correct": 0,
                "explanation": "La esfera es redonda como una pelota.",
                "hint": "Distingue un cuerpo de una figura plana."
            },
            {
                "id": "w1-l4-q14",
                "grade": 1,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "En el orden 🌳 🍎 ⭐, ¿dónde queda la manzana respecto de la estrella?",
                "options": [
                    "izquierda",
                    "derecha",
                    "arriba",
                    "abajo"
                ],
                "correct": 0,
                "explanation": "La manzana aparece a la izquierda de la estrella.",
                "hint": "Observa qué aparece antes de la estrella."
            },
            {
                "id": "w1-l4-q15",
                "grade": 1,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "Dos ramas miden 6 y 4 clips iguales. ¿Cuántos clips mide la más larga?",
                "options": [
                    "6",
                    "4",
                    "2",
                    "10"
                ],
                "correct": 0,
                "explanation": "La rama de seis clips es más larga.",
                "hint": "Usa la misma unidad para comparar."
            },
            {
                "id": "w1-l4-q16",
                "grade": 1,
                "axis": "Medición",
                "skill": "secuencia temporal",
                "prompt": "El general desayuna y después entrena. ¿Qué hace primero?",
                "options": [
                    "desayunar",
                    "entrenar",
                    "ambas a la vez",
                    "ninguna"
                ],
                "correct": 0,
                "explanation": "Desayunar ocurre antes de entrenar.",
                "hint": "Busca la primera acción."
            },
            {
                "id": "w1-l4-q17",
                "grade": 1,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "El general celebra su cumpleaños en abril, el mes después de marzo. ¿Qué mes viene después de marzo?",
                "options": [
                    "abril",
                    "enero",
                    "febrero",
                    "mayo"
                ],
                "correct": 0,
                "explanation": "En el calendario, después de marzo viene abril.",
                "hint": "Sigue el orden de los meses."
            },
            {
                "id": "w1-l4-q18",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "pictograma",
                "prompt": "Cada 🍎 vale una manzana. La cesta del general muestra 🍎 🍎 🍎 🍎 🍎 🍎. ¿Cuántas tiene?",
                "options": [
                    "6",
                    "5",
                    "7",
                    "8"
                ],
                "correct": 0,
                "explanation": "Seis dibujos representan seis manzanas.",
                "hint": "Lee cuánto vale cada dibujo."
            },
            {
                "id": "w1-l4-q19",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "comparar datos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Cestas del general</caption><thead><tr><th scope=\"col\">Cesta</th><th scope=\"col\">Manzanas</th></tr></thead><tbody><tr><th scope=\"row\">Roja</th><td>6</td></tr><tr><th scope=\"row\">Azul</th><td>3</td></tr><tr><th scope=\"row\">Verde</th><td>4</td></tr></tbody></table></div>¿Qué cesta tiene más?",
                "options": [
                    "roja",
                    "azul",
                    "verde",
                    "todas igual"
                ],
                "correct": 0,
                "explanation": "La roja tiene seis, que es la cantidad mayor.",
                "hint": "Compara las tres cantidades."
            },
            {
                "id": "w1-l4-q20",
                "grade": 1,
                "axis": "Datos y probabilidades",
                "skill": "registro de datos",
                "prompt": "El general registra hojas: | | | |. ¿Cuántas hojas anotó?",
                "options": [
                    "4",
                    "3",
                    "5",
                    "6"
                ],
                "correct": 0,
                "explanation": "Hay cuatro marcas; cada una representa una hoja.",
                "hint": "Cuenta las marcas."
            }
        ],
        "grade": 1,
        "skills": [
            "conteo",
            "conteo por saltos",
            "valor posicional",
            "ordinales",
            "suma hasta 20",
            "resta hasta 20",
            "comparación",
            "patrón repetitivo",
            "patrón numérico",
            "igualdad",
            "figuras 2D",
            "figuras 3D",
            "posiciones",
            "longitud",
            "secuencia temporal",
            "calendario",
            "pictograma",
            "comparar datos",
            "registro de datos"
        ]
    },
    {
        "id": 5,
        "worldId": "world-2",
        "title": "La boletería de los globos",
        "subtitle": "2.º básico · Trabaja con decenas y sumas y restas hasta 100.",
        "icon": "➕",
        "hasEnemy": true,
        "enemy": {
            "id": "payaso_globo",
            "name": "Payaso Globo",
            "title": "Acróbata Risueño del Circo",
            "avatar": "🎈🤡",
            "avatarDefeated": "😵🎈",
            "avatarImg": "assets/world-2/circus-balloon-clown-80s.png",
            "badge": "CIRCO",
            "badgeClass": "circus",
            "maxHp": 8,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡Duelo de Cachetadas Inflables!",
            "mechanicDesc": "✋ ¡Organiza las entradas y resuelve las cuentas del payaso!",
            "dialogue": {
                "intro": "¡Bienvenidos a mi boletería de globos y decenas!",
                "hit": "¡Pooop! ¡Casi me desinflas!",
                "defeat": "¡Fiuuuu! ¡Menuda suma, me quedé sin aire!"
            }
        },
        "theory": {
            "title": "La boletería de los globos",
            "content": "<p><strong>2.º básico.</strong> Trabaja con decenas y sumas y restas hasta 100.</p><h3>Números hasta 100</h3><p>63 son 6 decenas y 3 unidades. Puedes comparar decenas y después unidades. Al contar de 100 en 100 llegamos hasta 1.000, aunque aquí las sumas y restas serán hasta 100.</p><h3>Sumar y restar sin reserva</h3><p>Para 23 + 14 junta 2 decenas con 1 decena y 3 unidades con 4: 37. Para 56 − 24 quita decenas y unidades: 32. En estos ejercicios no necesitas cambiar una decena.</p><h3>Comprobar</h3><p>Si 23 + 14 = 37, entonces 37 − 14 = 23. Sumar o restar cero conserva la cantidad. Para calcular mentalmente, usa dobles y completa diez.</p>"
        },
        "questions": [
            {
                "id": "w2-l5-q1",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "La boletería vendió 63 entradas. ¿Cuántas decenas completas son?",
                "options": [
                    "6",
                    "7",
                    "5",
                    "8"
                ],
                "correct": 0,
                "explanation": "63 = 60 + 3: seis decenas y tres unidades.",
                "hint": "Separa las entradas en grupos de diez.",
                "bossDistractors": [
                    "4",
                    "11",
                    "1",
                    "16"
                ]
            },
            {
                "id": "w2-l5-q2",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "El payaso tiene 4 decenas y 7 globos sueltos. ¿Cuántos globos son?",
                "options": [
                    "47",
                    "48",
                    "46",
                    "49"
                ],
                "correct": 0,
                "explanation": "40 + 7 = 47.",
                "hint": "Cuatro decenas valen cuarenta.",
                "bossDistractors": [
                    "45",
                    "52",
                    "42",
                    "57"
                ]
            },
            {
                "id": "w2-l5-q3",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "comparación",
                "prompt": "Entre 36, 63, 46 y 26 entradas, ¿cuál es la mayor cantidad?",
                "options": [
                    "63",
                    "36",
                    "46",
                    "26"
                ],
                "correct": 0,
                "explanation": "63 tiene seis decenas, más que las demás cantidades.",
                "hint": "Compara primero las decenas.",
                "bossDistractors": [
                    "64",
                    "62",
                    "65",
                    "61"
                ]
            },
            {
                "id": "w2-l5-q4",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Cuenta puestos de 100 en 100: 600, 700, 800, __.",
                "options": [
                    "900",
                    "1000",
                    "810",
                    "850"
                ],
                "correct": 0,
                "explanation": "El siguiente salto de cien llega a 900.",
                "hint": "Agrega otra centena.",
                "bossDistractors": [
                    "901",
                    "899",
                    "902",
                    "898"
                ]
            },
            {
                "id": "w2-l5-q5",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "La fila avanza de 10 en 10: 35, 45, 55, __.",
                "options": [
                    "65",
                    "66",
                    "64",
                    "67"
                ],
                "correct": 0,
                "explanation": "55 + 10 = 65.",
                "hint": "Cambia una decena y conserva las unidades.",
                "bossDistractors": [
                    "63",
                    "70",
                    "60",
                    "75"
                ]
            },
            {
                "id": "w2-l5-q6",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Los globos se cuentan de 2 en 2: 82, 84, 86, __.",
                "options": [
                    "88",
                    "89",
                    "87",
                    "90"
                ],
                "correct": 0,
                "explanation": "El siguiente salto suma dos: 88.",
                "hint": "Cuenta dos desde 86.",
                "bossDistractors": [
                    "86",
                    "93",
                    "83",
                    "98"
                ]
            },
            {
                "id": "w2-l5-q7",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "estimación",
                "prompt": "Una fila tiene casi lo mismo que otra de 50 personas. ¿Qué estimación usarías?",
                "options": [
                    "50",
                    "5",
                    "10",
                    "100"
                ],
                "correct": 0,
                "explanation": "El grupo conocido de cincuenta es la referencia más cercana.",
                "hint": "Usa la fila de referencia.",
                "bossDistractors": [
                    "51",
                    "49",
                    "52",
                    "48"
                ]
            },
            {
                "id": "w2-l5-q8",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "suma sin reserva",
                "prompt": "El payaso reúne 23 globos y recibe 14 más. ¿Cuántos tiene?",
                "options": [
                    "37",
                    "38",
                    "36",
                    "39"
                ],
                "correct": 0,
                "explanation": "23 + 14 = 37. Suma las decenas y las unidades por separado.",
                "hint": "Suma las decenas y las unidades por separado.",
                "bossDistractors": [
                    "35",
                    "42",
                    "32",
                    "47"
                ],
                "calculation": {
                    "operation": "add",
                    "operands": [
                        23,
                        14
                    ]
                }
            },
            {
                "id": "w2-l5-q9",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "suma sin reserva",
                "prompt": "El payaso reúne 42 globos y recibe 25 más. ¿Cuántos tiene?",
                "options": [
                    "67",
                    "68",
                    "66",
                    "69"
                ],
                "correct": 0,
                "explanation": "42 + 25 = 67. Suma las decenas y las unidades por separado.",
                "hint": "Suma las decenas y las unidades por separado.",
                "bossDistractors": [
                    "65",
                    "72",
                    "62",
                    "77"
                ],
                "calculation": {
                    "operation": "add",
                    "operands": [
                        42,
                        25
                    ]
                }
            },
            {
                "id": "w2-l5-q10",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "suma sin reserva",
                "prompt": "El payaso reúne 31 globos y recibe 18 más. ¿Cuántos tiene?",
                "options": [
                    "49",
                    "50",
                    "48",
                    "51"
                ],
                "correct": 0,
                "explanation": "31 + 18 = 49. Suma las decenas y las unidades por separado.",
                "hint": "Suma las decenas y las unidades por separado.",
                "bossDistractors": [
                    "47",
                    "54",
                    "44",
                    "59"
                ],
                "calculation": {
                    "operation": "add",
                    "operands": [
                        31,
                        18
                    ]
                }
            },
            {
                "id": "w2-l5-q11",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "suma sin reserva",
                "prompt": "El payaso reúne 60 globos y recibe 20 más. ¿Cuántos tiene?",
                "options": [
                    "80",
                    "81",
                    "79",
                    "82"
                ],
                "correct": 0,
                "explanation": "60 + 20 = 80. Suma las decenas y las unidades por separado.",
                "hint": "Suma las decenas y las unidades por separado.",
                "bossDistractors": [
                    "78",
                    "85",
                    "75",
                    "90"
                ],
                "calculation": {
                    "operation": "add",
                    "operands": [
                        60,
                        20
                    ]
                }
            },
            {
                "id": "w2-l5-q12",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "suma sin reserva",
                "prompt": "El payaso reúne 36 globos y recibe 0 más. ¿Cuántos tiene?",
                "options": [
                    "36",
                    "37",
                    "35",
                    "38"
                ],
                "correct": 0,
                "explanation": "36 + 0 = 36. Suma las decenas y las unidades por separado.",
                "hint": "Suma las decenas y las unidades por separado.",
                "bossDistractors": [
                    "34",
                    "41",
                    "31",
                    "46"
                ],
                "calculation": {
                    "operation": "add",
                    "operands": [
                        36,
                        0
                    ]
                }
            },
            {
                "id": "w2-l5-q13",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "resta sin reserva",
                "prompt": "De 56 entradas del circo se usan 24. ¿Cuántas quedan?",
                "options": [
                    "32",
                    "33",
                    "31",
                    "34"
                ],
                "correct": 0,
                "explanation": "56 − 24 = 32. Resta las unidades y después las decenas.",
                "hint": "Resta las unidades y después las decenas.",
                "bossDistractors": [
                    "30",
                    "37",
                    "27",
                    "42"
                ],
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        56,
                        24
                    ]
                }
            },
            {
                "id": "w2-l5-q14",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "resta sin reserva",
                "prompt": "De 87 entradas del circo se usan 35. ¿Cuántas quedan?",
                "options": [
                    "52",
                    "53",
                    "51",
                    "54"
                ],
                "correct": 0,
                "explanation": "87 − 35 = 52. Resta las unidades y después las decenas.",
                "hint": "Resta las unidades y después las decenas.",
                "bossDistractors": [
                    "50",
                    "57",
                    "47",
                    "62"
                ],
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        87,
                        35
                    ]
                }
            },
            {
                "id": "w2-l5-q15",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "resta sin reserva",
                "prompt": "De 69 entradas del circo se usan 17. ¿Cuántas quedan?",
                "options": [
                    "52",
                    "53",
                    "51",
                    "54"
                ],
                "correct": 0,
                "explanation": "69 − 17 = 52. Resta las unidades y después las decenas.",
                "hint": "Resta las unidades y después las decenas.",
                "bossDistractors": [
                    "50",
                    "57",
                    "47",
                    "62"
                ],
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        69,
                        17
                    ]
                }
            },
            {
                "id": "w2-l5-q16",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "resta sin reserva",
                "prompt": "De 90 entradas del circo se usan 20. ¿Cuántas quedan?",
                "options": [
                    "70",
                    "71",
                    "69",
                    "72"
                ],
                "correct": 0,
                "explanation": "90 − 20 = 70. Resta las unidades y después las decenas.",
                "hint": "Resta las unidades y después las decenas.",
                "bossDistractors": [
                    "68",
                    "75",
                    "65",
                    "80"
                ],
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        90,
                        20
                    ]
                }
            },
            {
                "id": "w2-l5-q17",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "resta sin reserva",
                "prompt": "De 48 entradas del circo se usan 0. ¿Cuántas quedan?",
                "options": [
                    "48",
                    "49",
                    "47",
                    "50"
                ],
                "correct": 0,
                "explanation": "48 − 0 = 48. Resta las unidades y después las decenas.",
                "hint": "Resta las unidades y después las decenas.",
                "bossDistractors": [
                    "46",
                    "53",
                    "43",
                    "58"
                ],
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        48,
                        0
                    ]
                }
            },
            {
                "id": "w2-l5-q18",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "operaciones inversas",
                "prompt": "Si 24 + 15 = 39, ¿cuánto es 39 − 15?",
                "options": [
                    "24",
                    "25",
                    "23",
                    "26"
                ],
                "correct": 0,
                "explanation": "Restar las quince que se agregaron devuelve las veinticuatro iniciales.",
                "hint": "Deshaz la suma.",
                "bossDistractors": [
                    "22",
                    "29",
                    "19",
                    "34"
                ]
            },
            {
                "id": "w2-l5-q19",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "cálculo mental",
                "prompt": "El payaso calcula 9 + 6 completando 10. ¿Qué resultado obtiene?",
                "options": [
                    "15",
                    "16",
                    "14",
                    "17"
                ],
                "correct": 0,
                "explanation": "9 + 1 + 5 = 15.",
                "hint": "Separa seis en uno y cinco.",
                "bossDistractors": [
                    "13",
                    "20",
                    "10",
                    "25"
                ]
            },
            {
                "id": "w2-l5-q20",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "composición",
                "prompt": "Hay 78 globos: 70 rojos y el resto azules. ¿Cuántos son azules?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "78 = 70 + 8.",
                "hint": "Separa las siete decenas.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ]
            }
        ],
        "grade": 2,
        "skills": [
            "valor posicional",
            "comparación",
            "conteo por saltos",
            "estimación",
            "suma sin reserva",
            "resta sin reserva",
            "operaciones inversas",
            "cálculo mental",
            "composición"
        ]
    },
    {
        "id": 6,
        "worldId": "world-2",
        "title": "La pista de las formas",
        "subtitle": "2.º básico · Descubre patrones, posiciones y figuras del malabarista.",
        "icon": "➖",
        "hasEnemy": true,
        "enemy": {
            "id": "malabarista_globo",
            "name": "Malabarista Globo",
            "title": "Estrella del Trapecio Numérico",
            "avatar": "🎈🤹",
            "avatarDefeated": "😵🤹",
            "avatarImg": "assets/world-2/circus-balloon-juggler-80s.png",
            "badge": "CIRCO",
            "badgeClass": "circus",
            "maxHp": 10,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡Malabares en el Aire!",
            "mechanicDesc": "✋ ¡Descubre patrones y figuras para desarmar los malabares!",
            "dialogue": {
                "intro": "¡Sigue mis patrones y descubre las formas de la pista!",
                "hit": "¡Rayos! ¡Se me cayó una pelotita!",
                "defeat": "¡Aplaudo tu precisión! ¡Gran espectáculo de cálculo!"
            }
        },
        "theory": {
            "title": "La pista de las formas",
            "content": "<p><strong>2.º básico.</strong> Descubre patrones, posiciones y figuras del malabarista.</p><h3>Reglas de secuencias</h3><p>En 10, 15, 20, 25 se suma 5. Puedes completar un término faltante usando la misma regla.</p><h3>Figuras planas y cuerpos</h3><p>Un triángulo tiene 3 lados. Un cuadrado tiene 4 lados iguales y 4 ángulos rectos. El rectángulo tiene 4 ángulos rectos y lados opuestos iguales. Cubo, esfera, cono y cilindro son cuerpos.</p><h3>Posiciones e igualdad</h3><p>Derecha e izquierda dependen de la referencia indicada. En una balanza, 8 y 8 están equilibrados: 8 = 8. El signo &gt; significa mayor que: 8 &gt; 5; el signo &lt; significa menor que: 5 &lt; 8. Para equilibrar, agrega lo que falta al lado menor.</p>"
        },
        "questions": [
            {
                "id": "w2-l6-q1",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "El malabarista ordena sus globos: 10, 15, 20, __. ¿Qué sigue?",
                "options": [
                    "25",
                    "26",
                    "24",
                    "27"
                ],
                "correct": 0,
                "explanation": "La regla cambia 5 cada vez; sigue 25.",
                "hint": "Encuentra el salto entre dos términos.",
                "bossDistractors": [
                    "23",
                    "30",
                    "20",
                    "35"
                ]
            },
            {
                "id": "w2-l6-q2",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "El malabarista ordena sus globos: 20, 30, 40, __. ¿Qué sigue?",
                "options": [
                    "50",
                    "51",
                    "49",
                    "52"
                ],
                "correct": 0,
                "explanation": "La regla cambia 10 cada vez; sigue 50.",
                "hint": "Encuentra el salto entre dos términos.",
                "bossDistractors": [
                    "48",
                    "55",
                    "45",
                    "60"
                ]
            },
            {
                "id": "w2-l6-q3",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "El malabarista ordena sus globos: 90, 80, 70, __. ¿Qué sigue?",
                "options": [
                    "60",
                    "61",
                    "59",
                    "62"
                ],
                "correct": 0,
                "explanation": "La regla cambia 10 cada vez; sigue 60.",
                "hint": "Encuentra el salto entre dos términos.",
                "bossDistractors": [
                    "58",
                    "65",
                    "55",
                    "70"
                ]
            },
            {
                "id": "w2-l6-q4",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "El malabarista ordena sus globos: 3, 5, 7, __. ¿Qué sigue?",
                "options": [
                    "9",
                    "10",
                    "8",
                    "11"
                ],
                "correct": 0,
                "explanation": "La regla cambia 2 cada vez; sigue 9.",
                "hint": "Encuentra el salto entre dos términos.",
                "bossDistractors": [
                    "7",
                    "14",
                    "4",
                    "19"
                ]
            },
            {
                "id": "w2-l6-q5",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "El malabarista ordena sus globos: 12, 22, 32, __. ¿Qué sigue?",
                "options": [
                    "42",
                    "43",
                    "41",
                    "44"
                ],
                "correct": 0,
                "explanation": "La regla cambia 10 cada vez; sigue 42.",
                "hint": "Encuentra el salto entre dos términos.",
                "bossDistractors": [
                    "40",
                    "47",
                    "37",
                    "52"
                ]
            },
            {
                "id": "w2-l6-q6",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "igualdad",
                "prompt": "Una balanza tiene 12 globos a un lado y 8 al otro. ¿Cuántos agregas al lado de 8 para igualar?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "8 + 4 = 12.",
                "hint": "Cuenta cuánto falta hasta doce.",
                "bossDistractors": [
                    "2",
                    "9",
                    "14",
                    "7"
                ]
            },
            {
                "id": "w2-l6-q7",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "comparación",
                "prompt": "El malabarista compara sus fichas. ¿Cuál comparación es correcta?",
                "options": [
                    "14 > 9",
                    "14 < 9",
                    "14 = 9",
                    "9 > 14"
                ],
                "correct": 0,
                "explanation": "Catorce es mayor que nueve: 14 > 9.",
                "hint": "La abertura del signo apunta a la cantidad mayor.",
                "bossDistractors": [
                    "8 > 12",
                    "6 > 10",
                    "7 = 8",
                    "3 > 5"
                ]
            },
            {
                "id": "w2-l6-q8",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "igualdad",
                "prompt": "El malabarista completa 7 + __ = 15. ¿Qué número falta?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "7 + 8 = 15.",
                "hint": "Usa quince menos siete.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ]
            },
            {
                "id": "w2-l6-q9",
                "grade": 2,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "En este orden 🎈 ⭐ 🎪, ¿dónde está la estrella respecto del globo?",
                "options": [
                    "derecha",
                    "izquierda",
                    "arriba",
                    "abajo"
                ],
                "correct": 0,
                "explanation": "La estrella aparece a la derecha del globo.",
                "hint": "Observa el orden desde el globo.",
                "bossDistractors": [
                    "dentro",
                    "fuera",
                    "delante",
                    "detrás"
                ]
            },
            {
                "id": "w2-l6-q10",
                "grade": 2,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "En el orden 🎈 🎪 ⭐, ¿dónde está la carpa respecto de la estrella?",
                "options": [
                    "izquierda",
                    "derecha",
                    "arriba",
                    "abajo"
                ],
                "correct": 0,
                "explanation": "La carpa está a la izquierda de la estrella.",
                "hint": "Toma la estrella como referencia.",
                "bossDistractors": [
                    "dentro",
                    "fuera",
                    "delante",
                    "detrás"
                ]
            },
            {
                "id": "w2-l6-q11",
                "grade": 2,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "Un globo está guardado en el interior de la carpa. ¿Dónde está?",
                "options": [
                    "dentro",
                    "derecha",
                    "izquierda",
                    "arriba"
                ],
                "correct": 0,
                "explanation": "Interior significa dentro.",
                "hint": "Busca la palabra que significa interior.",
                "bossDistractors": [
                    "abajo",
                    "fuera",
                    "delante",
                    "detrás"
                ]
            },
            {
                "id": "w2-l6-q12",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "¿Qué figura plana tiene tres lados rectos?",
                "options": [
                    "triángulo",
                    "cuadrado",
                    "rectángulo",
                    "círculo"
                ],
                "correct": 0,
                "explanation": "El triángulo tiene tres lados.",
                "hint": "Cuenta lados rectos.",
                "bossDistractors": [
                    "cubo",
                    "esfera",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q13",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "La pista dibujada en el suelo es redonda y sin lados rectos. ¿Qué figura es?",
                "options": [
                    "círculo",
                    "triángulo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "El círculo tiene un borde curvo cerrado.",
                "hint": "Piensa en una moneda vista de frente.",
                "bossDistractors": [
                    "cubo",
                    "esfera",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q14",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "Una ficha plana tiene cuatro lados iguales y cuatro ángulos rectos. ¿Qué figura es?",
                "options": [
                    "cuadrado",
                    "triángulo",
                    "rectángulo",
                    "círculo"
                ],
                "correct": 0,
                "explanation": "El cuadrado cumple esas dos condiciones.",
                "hint": "Busca una figura plana con lados iguales.",
                "bossDistractors": [
                    "cubo",
                    "esfera",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q15",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "Una entrada tiene dos lados largos y dos cortos, y cuatro ángulos rectos. ¿Qué figura es?",
                "options": [
                    "rectángulo",
                    "triángulo",
                    "cuadrado",
                    "círculo"
                ],
                "correct": 0,
                "explanation": "Un rectángulo tiene cuatro ángulos rectos y lados opuestos iguales.",
                "hint": "Imagina la forma de la entrada.",
                "bossDistractors": [
                    "cubo",
                    "esfera",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q16",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "¿Qué cuerpo tiene forma de pelota de malabares?",
                "options": [
                    "esfera",
                    "triángulo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "Una pelota tiene forma de esfera.",
                "hint": "Es un cuerpo redondo en todas las direcciones.",
                "bossDistractors": [
                    "círculo",
                    "cubo",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q17",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "¿Qué cuerpo tiene seis caras cuadradas como un dado?",
                "options": [
                    "cubo",
                    "triángulo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "El cubo tiene seis caras cuadradas.",
                "hint": "Imagina un dado.",
                "bossDistractors": [
                    "círculo",
                    "esfera",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q18",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "¿Qué cuerpo tiene una base circular y una punta, como un gorro de fiesta?",
                "options": [
                    "cono",
                    "triángulo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "El cono tiene una base circular y un vértice.",
                "hint": "Piensa en el gorro de un payaso.",
                "bossDistractors": [
                    "círculo",
                    "cubo",
                    "esfera",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l6-q19",
                "grade": 2,
                "axis": "Geometría",
                "skill": "construcción de figuras",
                "prompt": "Un triángulo se arma con una varilla por lado. ¿Cuántas varillas necesitas?",
                "options": [
                    "3",
                    "4",
                    "2",
                    "5"
                ],
                "correct": 0,
                "explanation": "Un triángulo tiene tres lados, por eso se usan tres varillas.",
                "hint": "Una varilla representa un lado.",
                "bossDistractors": [
                    "1",
                    "8",
                    "13",
                    "6"
                ]
            },
            {
                "id": "w2-l6-q20",
                "grade": 2,
                "axis": "Geometría",
                "skill": "construcción de figuras",
                "prompt": "Para armar el borde de un cuadrado con una varilla por lado, ¿cuántas usas?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "El cuadrado tiene cuatro lados.",
                "hint": "Cuenta un lado cada vez.",
                "bossDistractors": [
                    "2",
                    "9",
                    "14",
                    "7"
                ]
            }
        ],
        "grade": 2,
        "skills": [
            "patrón numérico",
            "igualdad",
            "comparación",
            "posiciones",
            "figuras 2D",
            "figuras 3D",
            "construcción de figuras"
        ]
    },
    {
        "id": 7,
        "worldId": "world-2",
        "title": "Los horarios del forzudo",
        "subtitle": "2.º básico · Lee calendarios, mide y descubre datos del circo.",
        "icon": "🧮",
        "hasEnemy": true,
        "enemy": {
            "id": "forzudo_globo",
            "name": "Forzudo Globo",
            "title": "Campeón de Peso Inflable",
            "avatar": "🎈💪",
            "avatarDefeated": "😵💪",
            "avatarImg": "assets/world-2/circus-balloon-strongman-80s.png",
            "badge": "CIRCO",
            "badgeClass": "circus",
            "maxHp": 12,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡Fuerza de Globos!",
            "mechanicDesc": "✋ ¡Lee medidas, horarios y datos para desinflar las pesas!",
            "dialogue": {
                "intro": "¡Lee mi horario y los registros del gran espectáculo!",
                "hit": "¡Grrr! ¡Esa bofetada dobló mis barras de globo!",
                "defeat": "¡Me has vencido en fuerza y mente! ¡Eres el verdadero titán!"
            }
        },
        "theory": {
            "title": "Los horarios del forzudo",
            "content": "<p><strong>2.º básico.</strong> Lee calendarios, mide y descubre datos del circo.</p><h3>Calendario y reloj</h3><p>Una semana tiene 7 días. En el calendario, el día después del 14 es el 15. En un reloj digital 3:00 son las tres y 3:30 son las tres y media.</p><h3>Medir largos</h3><p>Usa centímetros para objetos pequeños y metros para una carpa. Un metro equivale a 100 centímetros. Coloca el cero de la regla en un extremo para medir.</p><h3>Pictogramas y barras</h3><p>Lee la escala antes de contar. Aquí tres puntos representan 6 globos, porque cada punto vale 2. <div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Globos vendidos · cada ● representa 2 globos</caption><thead><tr><th scope=\"col\">Color</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Rojo</th><td>● ● ●</td></tr><tr><th scope=\"row\">Azul</th><td>● ●</td></tr><tr><th scope=\"row\">Amarillo</th><td>● ● ● ●</td></tr></tbody></table></div> Las barras también permiten comparar cantidades. <div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Entradas por función · cada █ representa 1 entrada</caption><thead><tr><th scope=\"col\">Función</th><th scope=\"col\">Barra</th></tr></thead><tbody><tr><th scope=\"row\">Mañana</th><td>█ █ █ █</td></tr><tr><th scope=\"row\">Tarde</th><td>█ █ █ █ █ █</td></tr><tr><th scope=\"row\">Noche</th><td>█ █ █</td></tr></tbody></table></div></p>"
        },
        "questions": [
            {
                "id": "w2-l7-q1",
                "grade": 2,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "¿Cuántos días tiene una semana de funciones?",
                "options": [
                    "7",
                    "8",
                    "6",
                    "9"
                ],
                "correct": 0,
                "explanation": "Una semana tiene siete días.",
                "hint": "Recuerda los días desde lunes hasta domingo.",
                "bossDistractors": [
                    "5",
                    "12",
                    "2",
                    "17"
                ]
            },
            {
                "id": "w2-l7-q2",
                "grade": 2,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "La función es el día después del jueves. ¿Qué día es?",
                "options": [
                    "viernes",
                    "lunes",
                    "martes",
                    "miércoles"
                ],
                "correct": 0,
                "explanation": "Después del jueves viene el viernes.",
                "hint": "Avanza un día en la semana.",
                "bossDistractors": [
                    "jueves",
                    "sábado",
                    "domingo",
                    "ningún día"
                ]
            },
            {
                "id": "w2-l7-q3",
                "grade": 2,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "La entrada dice 14 de mayo. Si vas al día siguiente, ¿qué número de día será?",
                "options": [
                    "15",
                    "16",
                    "14",
                    "17"
                ],
                "correct": 0,
                "explanation": "Después del día 14 viene el 15.",
                "hint": "Avanza una fecha.",
                "bossDistractors": [
                    "13",
                    "20",
                    "10",
                    "25"
                ]
            },
            {
                "id": "w2-l7-q4",
                "grade": 2,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "El mes después de marzo es…",
                "options": [
                    "abril",
                    "enero",
                    "febrero",
                    "marzo"
                ],
                "correct": 0,
                "explanation": "Después de marzo viene abril.",
                "hint": "Revisa el orden de los meses.",
                "bossDistractors": [
                    "mayo",
                    "junio",
                    "julio",
                    "agosto"
                ]
            },
            {
                "id": "w2-l7-q5",
                "grade": 2,
                "axis": "Medición",
                "skill": "reloj digital",
                "prompt": "La función comienza a las tres y media. ¿Qué muestra el reloj digital?",
                "options": [
                    "3:30",
                    "2:00",
                    "2:30",
                    "3:00"
                ],
                "correct": 0,
                "explanation": "Tres y media se escribe 3:30.",
                "hint": "Media hora son treinta minutos.",
                "bossDistractors": [
                    "4:00",
                    "4:30",
                    "5:00",
                    "5:30"
                ]
            },
            {
                "id": "w2-l7-q6",
                "grade": 2,
                "axis": "Medición",
                "skill": "reloj digital",
                "prompt": "El reloj del forzudo muestra 4:00. ¿A qué hora corresponde?",
                "options": [
                    "cuatro en punto",
                    "dos en punto",
                    "dos y media",
                    "tres en punto"
                ],
                "correct": 0,
                "explanation": "4:00 corresponde a las cuatro en punto.",
                "hint": "Los minutos en cero indican una hora en punto.",
                "bossDistractors": [
                    "tres y media",
                    "cuatro y media",
                    "cinco en punto",
                    "cinco y media"
                ]
            },
            {
                "id": "w2-l7-q7",
                "grade": 2,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "Una cinta empieza en 0 de la regla y termina en 8 cm. ¿Cuántos centímetros mide?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "Desde cero hasta ocho hay ocho centímetros.",
                "hint": "Lee la marca del extremo final.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ]
            },
            {
                "id": "w2-l7-q8",
                "grade": 2,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "Una cuerda mide 25 cm y otra 18 cm. ¿Cuántos centímetros mide la más larga?",
                "options": [
                    "25",
                    "18",
                    "7",
                    "43"
                ],
                "correct": 0,
                "explanation": "Veinticinco centímetros es mayor que dieciocho.",
                "hint": "Compara las dos medidas.",
                "bossDistractors": [
                    "26",
                    "24",
                    "27",
                    "23"
                ]
            },
            {
                "id": "w2-l7-q9",
                "grade": 2,
                "axis": "Medición",
                "skill": "unidades de longitud",
                "prompt": "¿Cuántos centímetros tiene un metro de cuerda?",
                "options": [
                    "100",
                    "10",
                    "1",
                    "50"
                ],
                "correct": 0,
                "explanation": "Un metro equivale a cien centímetros.",
                "hint": "Piensa en la equivalencia entre metro y centímetro.",
                "bossDistractors": [
                    "101",
                    "99",
                    "102",
                    "98"
                ]
            },
            {
                "id": "w2-l7-q10",
                "grade": 2,
                "axis": "Medición",
                "skill": "unidades de longitud",
                "prompt": "¿Qué unidad conviene para medir el ancho de una carpa grande?",
                "options": [
                    "metros",
                    "centímetros",
                    "minutos",
                    "horas"
                ],
                "correct": 0,
                "explanation": "Los metros son una unidad apropiada para longitudes grandes como una carpa.",
                "hint": "Primero decide si estás midiendo largo o tiempo.",
                "bossDistractors": [
                    "días",
                    "semanas",
                    "meses",
                    "entradas"
                ]
            },
            {
                "id": "w2-l7-q11",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Globos vendidos · cada ● representa 2 globos</caption><thead><tr><th scope=\"col\">Color</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Rojo</th><td>● ● ●</td></tr><tr><th scope=\"row\">Azul</th><td>● ●</td></tr><tr><th scope=\"row\">Amarillo</th><td>● ● ● ●</td></tr></tbody></table></div>¿Cuántos globos rojos se vendieron?",
                "options": [
                    "6",
                    "7",
                    "5",
                    "8"
                ],
                "correct": 0,
                "explanation": "Tres puntos de dos globos: 2 + 2 + 2 = 6.",
                "hint": "Cada punto vale dos, no uno.",
                "bossDistractors": [
                    "4",
                    "11",
                    "1",
                    "16"
                ]
            },
            {
                "id": "w2-l7-q12",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Globos vendidos · cada ● representa 2 globos</caption><thead><tr><th scope=\"col\">Color</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Rojo</th><td>● ● ●</td></tr><tr><th scope=\"row\">Azul</th><td>● ●</td></tr><tr><th scope=\"row\">Amarillo</th><td>● ● ● ●</td></tr></tbody></table></div>¿Cuántos globos azules se vendieron?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "Dos puntos representan cuatro globos.",
                "hint": "Cuenta de dos en dos.",
                "bossDistractors": [
                    "2",
                    "9",
                    "14",
                    "7"
                ]
            },
            {
                "id": "w2-l7-q13",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Globos vendidos · cada ● representa 2 globos</caption><thead><tr><th scope=\"col\">Color</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Rojo</th><td>● ● ●</td></tr><tr><th scope=\"row\">Azul</th><td>● ●</td></tr><tr><th scope=\"row\">Amarillo</th><td>● ● ● ●</td></tr></tbody></table></div>¿Cuántos globos amarillos se vendieron?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "Cuatro puntos de dos globos representan ocho.",
                "hint": "Cuenta la escala de cada punto.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ]
            },
            {
                "id": "w2-l7-q14",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "comparar datos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Globos vendidos · cada ● representa 2 globos</caption><thead><tr><th scope=\"col\">Color</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Rojo</th><td>● ● ●</td></tr><tr><th scope=\"row\">Azul</th><td>● ●</td></tr><tr><th scope=\"row\">Amarillo</th><td>● ● ● ●</td></tr></tbody></table></div>¿Cuántos globos más se vendieron amarillos que azules?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "Ocho menos cuatro son cuatro globos de diferencia.",
                "hint": "Obtén ambas cantidades antes de restar.",
                "bossDistractors": [
                    "2",
                    "9",
                    "14",
                    "7"
                ]
            },
            {
                "id": "w2-l7-q15",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "gráfico de barras",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Entradas por función · cada █ representa 1 entrada</caption><thead><tr><th scope=\"col\">Función</th><th scope=\"col\">Barra</th></tr></thead><tbody><tr><th scope=\"row\">Mañana</th><td>█ █ █ █</td></tr><tr><th scope=\"row\">Tarde</th><td>█ █ █ █ █ █</td></tr><tr><th scope=\"row\">Noche</th><td>█ █ █</td></tr></tbody></table></div>¿Cuántas entradas se vendieron en la tarde?",
                "options": [
                    "6",
                    "7",
                    "5",
                    "8"
                ],
                "correct": 0,
                "explanation": "La barra de la tarde contiene seis unidades.",
                "hint": "Lee la escala y la fila Tarde.",
                "bossDistractors": [
                    "4",
                    "11",
                    "1",
                    "16"
                ]
            },
            {
                "id": "w2-l7-q16",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "gráfico de barras",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Entradas por función · cada █ representa 1 entrada</caption><thead><tr><th scope=\"col\">Función</th><th scope=\"col\">Barra</th></tr></thead><tbody><tr><th scope=\"row\">Mañana</th><td>█ █ █ █</td></tr><tr><th scope=\"row\">Tarde</th><td>█ █ █ █ █ █</td></tr><tr><th scope=\"row\">Noche</th><td>█ █ █</td></tr></tbody></table></div>¿Cuántas entradas se vendieron en la noche?",
                "options": [
                    "3",
                    "4",
                    "2",
                    "5"
                ],
                "correct": 0,
                "explanation": "La barra de la noche contiene tres unidades.",
                "hint": "Cuenta las unidades de la fila Noche.",
                "bossDistractors": [
                    "1",
                    "8",
                    "13",
                    "6"
                ]
            },
            {
                "id": "w2-l7-q17",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "comparar datos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Entradas por función · cada █ representa 1 entrada</caption><thead><tr><th scope=\"col\">Función</th><th scope=\"col\">Barra</th></tr></thead><tbody><tr><th scope=\"row\">Mañana</th><td>█ █ █ █</td></tr><tr><th scope=\"row\">Tarde</th><td>█ █ █ █ █ █</td></tr><tr><th scope=\"row\">Noche</th><td>█ █ █</td></tr></tbody></table></div>¿Cuántas entradas más hubo en la tarde que en la mañana?",
                "options": [
                    "2",
                    "3",
                    "1",
                    "4"
                ],
                "correct": 0,
                "explanation": "Seis menos cuatro son dos.",
                "hint": "Compara las dos barras.",
                "bossDistractors": [
                    "0",
                    "7",
                    "12",
                    "5"
                ]
            },
            {
                "id": "w2-l7-q18",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "registro de azar",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Resultados de lanzar una moneda</caption><thead><tr><th scope=\"col\">Resultado</th><th scope=\"col\">Veces</th></tr></thead><tbody><tr><th scope=\"row\">Cara</th><td>5</td></tr><tr><th scope=\"row\">Sello</th><td>3</td></tr></tbody></table></div>¿Cuántas veces salió sello?",
                "options": [
                    "3",
                    "4",
                    "2",
                    "5"
                ],
                "correct": 0,
                "explanation": "La tabla registra tres sellos.",
                "hint": "Lee la fila Sello; no necesitas adivinar el próximo lanzamiento.",
                "bossDistractors": [
                    "1",
                    "8",
                    "13",
                    "6"
                ]
            },
            {
                "id": "w2-l7-q19",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "registro de azar",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Resultados de lanzar un dado</caption><thead><tr><th scope=\"col\">Número</th><th scope=\"col\">Veces</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>2</td></tr><tr><th scope=\"row\">2</th><td>4</td></tr><tr><th scope=\"row\">3</th><td>1</td></tr></tbody></table></div>¿Qué número salió cuatro veces?",
                "options": [
                    "2",
                    "3",
                    "1",
                    "4"
                ],
                "correct": 0,
                "explanation": "La fila del número dos registra cuatro veces.",
                "hint": "Busca el cuatro en la columna Veces.",
                "bossDistractors": [
                    "0",
                    "7",
                    "12",
                    "5"
                ]
            },
            {
                "id": "w2-l7-q20",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "recolectar datos",
                "prompt": "Quieres saber cuántas personas prefieren cada función. ¿Qué deberías registrar?",
                "options": [
                    "la función que prefiere cada persona",
                    "el largo de la carpa",
                    "el color de tus zapatos",
                    "la hora de ayer"
                ],
                "correct": 0,
                "explanation": "Registrar la función preferida permite comparar las preferencias.",
                "hint": "Los datos deben responder a la pregunta que investigas.",
                "bossDistractors": [
                    "la altura de un árbol",
                    "el número de ventanas",
                    "el ancho de la puerta",
                    "la longitud de una cinta"
                ]
            }
        ],
        "grade": 2,
        "skills": [
            "calendario",
            "reloj digital",
            "longitud",
            "unidades de longitud",
            "pictograma con escala",
            "comparar datos",
            "gráfico de barras",
            "registro de azar",
            "recolectar datos"
        ]
    },
    {
        "id": 8,
        "worldId": "world-2",
        "title": "Los grupos de la caja sorpresa",
        "subtitle": "2.º básico · Forma grupos iguales y descubre las tablas del 2, 5 y 10.",
        "icon": "🎁",
        "hasEnemy": true,
        "enemy": {
            "id": "payaso_sorpresa",
            "name": "Payaso Sorpresa",
            "title": "El Bromista de la Caja Misteriosa",
            "avatar": "🎈🎩",
            "avatarDefeated": "😵🎩",
            "avatarImg": "assets/world-2/circus-balloon-surprise-clown-80s.png",
            "badge": "CIRCO",
            "badgeClass": "circus",
            "maxHp": 16,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "¡La Sorpresa que Falta!",
            "mechanicDesc": "🎁 ¡Forma grupos de 2, 5 y 10 para abrir la caja sorpresa!",
            "dialogue": {
                "intro": "¡Mi caja guarda grupos iguales de globos! ¿Cuántos habrá?",
                "hit": "¡Oh, oh! ¡Has descubierto otro secreto de mi caja!",
                "defeat": "¡Sorpresa! ¡El gran truco era pensar paso a paso!"
            }
        },
        "theory": {
            "title": "Los grupos de la caja sorpresa",
            "content": "<p><strong>2.º básico.</strong> Forma grupos iguales y descubre las tablas del 2, 5 y 10.</p><h3>Multiplicar es juntar grupos iguales</h3><p>Tres grupos de dos globos son 2 + 2 + 2 = 6, que escribimos 3 × 2 = 6. Mira tres filas de dos casillas: <span class=\"curriculum-tiles\" role=\"img\" aria-label=\"3 filas de 2 casillas; 6 coloreadas\" style=\"--tile-columns:2\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span></span></p><h3>Tablas iniciales</h3><p>La tabla del 2 cuenta 2, 4, 6, 8…; la del 5 cuenta 5, 10, 15, 20…; la del 10 cuenta 10, 20, 30, 40… Puedes dibujar los grupos para comprobar.</p><h3>Estrategias</h3><p>Para 6 × 5 puedes separar seis grupos en tres y tres: 15 + 15 = 30. Duplicar una cantidad es sumar esa cantidad dos veces.</p>"
        },
        "questions": [
            {
                "id": "w2-l8-q1",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 2 grupos de 2 globos. ¿Cuántos globos hay?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "2 × 2 = 4. Cuenta 2 veces de 2 en 2, o suma grupos iguales.",
                "hint": "Cuenta 2 veces de 2 en 2, o suma grupos iguales.",
                "bossDistractors": [
                    "2",
                    "9",
                    "14",
                    "7"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        2,
                        2
                    ]
                }
            },
            {
                "id": "w2-l8-q2",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 3 grupos de 2 globos. ¿Cuántos globos hay?",
                "options": [
                    "6",
                    "7",
                    "5",
                    "8"
                ],
                "correct": 0,
                "explanation": "3 × 2 = 6. Cuenta 3 veces de 2 en 2, o suma grupos iguales.",
                "hint": "Cuenta 3 veces de 2 en 2, o suma grupos iguales.",
                "bossDistractors": [
                    "4",
                    "11",
                    "1",
                    "16"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        3,
                        2
                    ]
                }
            },
            {
                "id": "w2-l8-q3",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 4 grupos de 2 globos. ¿Cuántos globos hay?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "4 × 2 = 8. Cuenta 4 veces de 2 en 2, o suma grupos iguales.",
                "hint": "Cuenta 4 veces de 2 en 2, o suma grupos iguales.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        4,
                        2
                    ]
                }
            },
            {
                "id": "w2-l8-q4",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 5 grupos de 2 globos. ¿Cuántos globos hay?",
                "options": [
                    "10",
                    "11",
                    "9",
                    "12"
                ],
                "correct": 0,
                "explanation": "5 × 2 = 10. Cuenta 5 veces de 2 en 2, o suma grupos iguales.",
                "hint": "Cuenta 5 veces de 2 en 2, o suma grupos iguales.",
                "bossDistractors": [
                    "8",
                    "15",
                    "5",
                    "20"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        5,
                        2
                    ]
                }
            },
            {
                "id": "w2-l8-q5",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 7 grupos de 2 globos. ¿Cuántos globos hay?",
                "options": [
                    "14",
                    "15",
                    "13",
                    "16"
                ],
                "correct": 0,
                "explanation": "7 × 2 = 14. Cuenta 7 veces de 2 en 2, o suma grupos iguales.",
                "hint": "Cuenta 7 veces de 2 en 2, o suma grupos iguales.",
                "bossDistractors": [
                    "12",
                    "19",
                    "9",
                    "24"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        7,
                        2
                    ]
                }
            },
            {
                "id": "w2-l8-q6",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 9 grupos de 2 globos. ¿Cuántos globos hay?",
                "options": [
                    "18",
                    "19",
                    "17",
                    "20"
                ],
                "correct": 0,
                "explanation": "9 × 2 = 18. Cuenta 9 veces de 2 en 2, o suma grupos iguales.",
                "hint": "Cuenta 9 veces de 2 en 2, o suma grupos iguales.",
                "bossDistractors": [
                    "16",
                    "23",
                    "13",
                    "28"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        9,
                        2
                    ]
                }
            },
            {
                "id": "w2-l8-q7",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 2 grupos de 5 globos. ¿Cuántos globos hay?",
                "options": [
                    "10",
                    "11",
                    "9",
                    "12"
                ],
                "correct": 0,
                "explanation": "2 × 5 = 10. Cuenta 2 veces de 5 en 5, o suma grupos iguales.",
                "hint": "Cuenta 2 veces de 5 en 5, o suma grupos iguales.",
                "bossDistractors": [
                    "8",
                    "15",
                    "5",
                    "20"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        2,
                        5
                    ]
                }
            },
            {
                "id": "w2-l8-q8",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 3 grupos de 5 globos. ¿Cuántos globos hay?",
                "options": [
                    "15",
                    "16",
                    "14",
                    "17"
                ],
                "correct": 0,
                "explanation": "3 × 5 = 15. Cuenta 3 veces de 5 en 5, o suma grupos iguales.",
                "hint": "Cuenta 3 veces de 5 en 5, o suma grupos iguales.",
                "bossDistractors": [
                    "13",
                    "20",
                    "10",
                    "25"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        3,
                        5
                    ]
                }
            },
            {
                "id": "w2-l8-q9",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 4 grupos de 5 globos. ¿Cuántos globos hay?",
                "options": [
                    "20",
                    "21",
                    "19",
                    "22"
                ],
                "correct": 0,
                "explanation": "4 × 5 = 20. Cuenta 4 veces de 5 en 5, o suma grupos iguales.",
                "hint": "Cuenta 4 veces de 5 en 5, o suma grupos iguales.",
                "bossDistractors": [
                    "18",
                    "25",
                    "15",
                    "30"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        4,
                        5
                    ]
                }
            },
            {
                "id": "w2-l8-q10",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 6 grupos de 5 globos. ¿Cuántos globos hay?",
                "options": [
                    "30",
                    "31",
                    "29",
                    "32"
                ],
                "correct": 0,
                "explanation": "6 × 5 = 30. Cuenta 6 veces de 5 en 5, o suma grupos iguales.",
                "hint": "Cuenta 6 veces de 5 en 5, o suma grupos iguales.",
                "bossDistractors": [
                    "28",
                    "35",
                    "25",
                    "40"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        6,
                        5
                    ]
                }
            },
            {
                "id": "w2-l8-q11",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 8 grupos de 5 globos. ¿Cuántos globos hay?",
                "options": [
                    "40",
                    "41",
                    "39",
                    "42"
                ],
                "correct": 0,
                "explanation": "8 × 5 = 40. Cuenta 8 veces de 5 en 5, o suma grupos iguales.",
                "hint": "Cuenta 8 veces de 5 en 5, o suma grupos iguales.",
                "bossDistractors": [
                    "38",
                    "45",
                    "35",
                    "50"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        8,
                        5
                    ]
                }
            },
            {
                "id": "w2-l8-q12",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 10 grupos de 5 globos. ¿Cuántos globos hay?",
                "options": [
                    "50",
                    "51",
                    "49",
                    "52"
                ],
                "correct": 0,
                "explanation": "10 × 5 = 50. Cuenta 10 veces de 5 en 5, o suma grupos iguales.",
                "hint": "Cuenta 10 veces de 5 en 5, o suma grupos iguales.",
                "bossDistractors": [
                    "48",
                    "55",
                    "45",
                    "60"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        10,
                        5
                    ]
                }
            },
            {
                "id": "w2-l8-q13",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 2 grupos de 10 globos. ¿Cuántos globos hay?",
                "options": [
                    "20",
                    "21",
                    "19",
                    "22"
                ],
                "correct": 0,
                "explanation": "2 × 10 = 20. Cuenta 2 veces de 10 en 10, o suma grupos iguales.",
                "hint": "Cuenta 2 veces de 10 en 10, o suma grupos iguales.",
                "bossDistractors": [
                    "18",
                    "25",
                    "15",
                    "30"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        2,
                        10
                    ]
                }
            },
            {
                "id": "w2-l8-q14",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 3 grupos de 10 globos. ¿Cuántos globos hay?",
                "options": [
                    "30",
                    "31",
                    "29",
                    "32"
                ],
                "correct": 0,
                "explanation": "3 × 10 = 30. Cuenta 3 veces de 10 en 10, o suma grupos iguales.",
                "hint": "Cuenta 3 veces de 10 en 10, o suma grupos iguales.",
                "bossDistractors": [
                    "28",
                    "35",
                    "25",
                    "40"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        3,
                        10
                    ]
                }
            },
            {
                "id": "w2-l8-q15",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 5 grupos de 10 globos. ¿Cuántos globos hay?",
                "options": [
                    "50",
                    "51",
                    "49",
                    "52"
                ],
                "correct": 0,
                "explanation": "5 × 10 = 50. Cuenta 5 veces de 10 en 10, o suma grupos iguales.",
                "hint": "Cuenta 5 veces de 10 en 10, o suma grupos iguales.",
                "bossDistractors": [
                    "48",
                    "55",
                    "45",
                    "60"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        5,
                        10
                    ]
                }
            },
            {
                "id": "w2-l8-q16",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "La caja sorpresa tiene 7 grupos de 10 globos. ¿Cuántos globos hay?",
                "options": [
                    "70",
                    "71",
                    "69",
                    "72"
                ],
                "correct": 0,
                "explanation": "7 × 10 = 70. Cuenta 7 veces de 10 en 10, o suma grupos iguales.",
                "hint": "Cuenta 7 veces de 10 en 10, o suma grupos iguales.",
                "bossDistractors": [
                    "68",
                    "75",
                    "65",
                    "80"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        7,
                        10
                    ]
                }
            },
            {
                "id": "w2-l8-q17",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "grupos iguales",
                "prompt": "<span class=\"curriculum-tiles\" role=\"img\" aria-label=\"4 filas de 2 casillas; 8 coloreadas\" style=\"--tile-columns:2\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span></span>Cada casilla es un globo. ¿Cuántos globos hay en estas cuatro filas?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "Cuatro filas de dos son 2 + 2 + 2 + 2 = 8.",
                "hint": "Cuenta dos por cada fila.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ]
            },
            {
                "id": "w2-l8-q18",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "grupos iguales",
                "prompt": "Hay 5 + 5 + 5 globos. ¿Cuántos son en total?",
                "options": [
                    "15",
                    "16",
                    "14",
                    "17"
                ],
                "correct": 0,
                "explanation": "Tres grupos de cinco son quince.",
                "hint": "Puedes usar la tabla del cinco.",
                "bossDistractors": [
                    "13",
                    "20",
                    "10",
                    "25"
                ]
            },
            {
                "id": "w2-l8-q19",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "dobles",
                "prompt": "El payaso duplica sus 8 globos. ¿Cuántos tiene ahora?",
                "options": [
                    "16",
                    "17",
                    "15",
                    "18"
                ],
                "correct": 0,
                "explanation": "Duplicar es 8 + 8 = 16.",
                "hint": "Usa el doble de ocho.",
                "bossDistractors": [
                    "14",
                    "21",
                    "11",
                    "26"
                ]
            },
            {
                "id": "w2-l8-q20",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "distributividad inicial",
                "prompt": "Seis grupos de 5 se separan en 3 grupos de 5 y otros 3 grupos de 5. ¿Cuántos globos hay?",
                "options": [
                    "30",
                    "31",
                    "29",
                    "32"
                ],
                "correct": 0,
                "explanation": "Cada mitad tiene 15 globos; 15 + 15 = 30.",
                "hint": "Calcula tres grupos y luego duplica.",
                "bossDistractors": [
                    "28",
                    "35",
                    "25",
                    "40"
                ]
            }
        ],
        "grade": 2,
        "skills": [
            "tablas del 2, 5 y 10",
            "grupos iguales",
            "dobles",
            "distributividad inicial"
        ]
    },
    {
        "id": 9,
        "worldId": "world-2",
        "title": "El gran repaso del Dragón Globo",
        "subtitle": "2.º básico · Usa todas las habilidades del circo con ocho alternativas.",
        "icon": "🐲",
        "isBoss": true,
        "answerOptionCount": 8,
        "boss": {
            "id": "dragon_globo_dos_cabezas",
            "name": "Dragón Globo de Dos Cabezas",
            "title": "Gran Final del Circo de las Sumas",
            "avatar": "🐲🎈",
            "avatarImg": "assets/world-2/circus-balloon-two-headed-dragon-80s.png",
            "badge": "JEFE DEL CIRCO",
            "badgeClass": "circus",
            "maxHp": 40,
            "regenRate": 0,
            "baseDamage": 1.2,
            "streakBonus": 0.5,
            "mechanicType": "eight-options",
            "mechanicTitle": "¡Doble Cabeza, Doble Desafío!",
            "mechanicDesc": "🐲 Ocho alternativas. ¡Encadena aciertos para desinflar al dragón!",
            "dialogue": {
                "intro": "¡Dos cabezas, ocho opciones! ¿Podrás con nuestro gran espectáculo?",
                "hit": "¡Fiuuu! ¡Ese cálculo nos ha quitado el aire!",
                "defeat": "¡Nos desinflaste a las dos! ¡El aplauso final es para ti!"
            }
        },
        "theory": {
            "title": "El gran repaso del Dragón Globo",
            "content": "<p><strong>2.º básico.</strong> Usa todas las habilidades del circo con ocho alternativas.</p><h3>Dos cabezas, un repaso</h3><p>El dragón mezcla las preguntas de los cuatro niveles y su propio repaso: números hasta 100, patrones, formas, medidas, gráficos y grupos de 2, 5 y 10.</p><h3>Lee antes de elegir</h3><p>Hay <strong>ocho alternativas</strong> solo en esta pelea. Puedes usar las teclas 1 a 8. El dragón no recupera vida: tienes tiempo para leer la escala de un gráfico o dibujar un grupo.</p>"
        },
        "questions": [
            {
                "id": "w2-l9-q1",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "suma sin reserva",
                "prompt": "Una cabeza guarda 34 globos y la otra 25. ¿Cuántos guardan juntas?",
                "options": [
                    "59",
                    "60",
                    "58",
                    "61"
                ],
                "correct": 0,
                "explanation": "34 + 25 = 59. Suma decenas y unidades sin cambiarlas.",
                "hint": "Suma decenas y unidades sin cambiarlas.",
                "bossDistractors": [
                    "57",
                    "64",
                    "54",
                    "69"
                ],
                "calculation": {
                    "operation": "add",
                    "operands": [
                        34,
                        25
                    ]
                }
            },
            {
                "id": "w2-l9-q2",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "resta sin reserva",
                "prompt": "El dragón tenía 78 entradas y usó 36. ¿Cuántas quedan?",
                "options": [
                    "42",
                    "43",
                    "41",
                    "44"
                ],
                "correct": 0,
                "explanation": "78 − 36 = 42. Resta unidades y decenas.",
                "hint": "Resta unidades y decenas.",
                "bossDistractors": [
                    "40",
                    "47",
                    "37",
                    "52"
                ],
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        78,
                        36
                    ]
                }
            },
            {
                "id": "w2-l9-q3",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "El dragón cuenta 8 decenas y 2 unidades. ¿Cuántas fichas son?",
                "options": [
                    "82",
                    "83",
                    "81",
                    "84"
                ],
                "correct": 0,
                "explanation": "80 + 2 = 82.",
                "hint": "Cada decena vale diez.",
                "bossDistractors": [
                    "80",
                    "87",
                    "77",
                    "92"
                ]
            },
            {
                "id": "w2-l9-q4",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "El dragón cuenta 300, 400, 500, __. ¿Cómo sigue?",
                "options": [
                    "600",
                    "601",
                    "599",
                    "602"
                ],
                "correct": 0,
                "explanation": "El salto es de cien: después viene seiscientos.",
                "hint": "Agrega una centena.",
                "bossDistractors": [
                    "598",
                    "605",
                    "595",
                    "610"
                ]
            },
            {
                "id": "w2-l9-q5",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "Los globos vuelan en grupos: 15, 20, 25, __.",
                "options": [
                    "30",
                    "31",
                    "29",
                    "32"
                ],
                "correct": 0,
                "explanation": "Cada grupo aumenta cinco: sigue treinta.",
                "hint": "Busca el salto que se repite.",
                "bossDistractors": [
                    "28",
                    "35",
                    "25",
                    "40"
                ]
            },
            {
                "id": "w2-l9-q6",
                "grade": 2,
                "axis": "Patrones y álgebra",
                "skill": "igualdad",
                "prompt": "Para equilibrar las cabezas, completa 9 + __ = 17.",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "Nueve más ocho son diecisiete.",
                "hint": "Cuenta cuánto falta hasta diecisiete.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ]
            },
            {
                "id": "w2-l9-q7",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 2D",
                "prompt": "La entrada del dragón tiene tres lados rectos. ¿Qué figura es?",
                "options": [
                    "triángulo",
                    "cuadrado",
                    "rectángulo",
                    "círculo"
                ],
                "correct": 0,
                "explanation": "Una figura plana con tres lados es un triángulo.",
                "hint": "Cuenta los lados de la entrada.",
                "bossDistractors": [
                    "cubo",
                    "esfera",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l9-q8",
                "grade": 2,
                "axis": "Geometría",
                "skill": "figuras 3D",
                "prompt": "La pelota del dragón tiene forma de…",
                "options": [
                    "esfera",
                    "triángulo",
                    "cuadrado",
                    "rectángulo"
                ],
                "correct": 0,
                "explanation": "Una pelota tiene forma de esfera.",
                "hint": "Distingue cuerpos y figuras planas.",
                "bossDistractors": [
                    "círculo",
                    "cubo",
                    "cono",
                    "cilindro"
                ]
            },
            {
                "id": "w2-l9-q9",
                "grade": 2,
                "axis": "Geometría",
                "skill": "posiciones",
                "prompt": "En el orden 🎪 🎈 ⭐, ¿dónde está el globo respecto de la carpa?",
                "options": [
                    "derecha",
                    "izquierda",
                    "arriba",
                    "abajo"
                ],
                "correct": 0,
                "explanation": "El globo aparece a la derecha de la carpa.",
                "hint": "Usa la carpa como referencia.",
                "bossDistractors": [
                    "dentro",
                    "fuera",
                    "delante",
                    "detrás"
                ]
            },
            {
                "id": "w2-l9-q10",
                "grade": 2,
                "axis": "Medición",
                "skill": "reloj digital",
                "prompt": "La batalla empieza a las dos y media. ¿Qué muestra el reloj?",
                "options": [
                    "2:30",
                    "2:00",
                    "3:00",
                    "3:30"
                ],
                "correct": 0,
                "explanation": "Dos y media se escribe 2:30.",
                "hint": "Media hora equivale a treinta minutos.",
                "bossDistractors": [
                    "4:00",
                    "4:30",
                    "5:00",
                    "5:30"
                ]
            },
            {
                "id": "w2-l9-q11",
                "grade": 2,
                "axis": "Medición",
                "skill": "calendario",
                "prompt": "El dragón descansa el día después del viernes. ¿Qué día es?",
                "options": [
                    "sábado",
                    "lunes",
                    "martes",
                    "miércoles"
                ],
                "correct": 0,
                "explanation": "Después del viernes viene el sábado.",
                "hint": "Avanza un día.",
                "bossDistractors": [
                    "jueves",
                    "viernes",
                    "domingo",
                    "ningún día"
                ]
            },
            {
                "id": "w2-l9-q12",
                "grade": 2,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "La cinta del dragón va desde 0 hasta 12 cm en una regla. ¿Cuántos centímetros mide?",
                "options": [
                    "12",
                    "13",
                    "11",
                    "14"
                ],
                "correct": 0,
                "explanation": "Del cero al doce hay doce centímetros.",
                "hint": "Lee la marca final.",
                "bossDistractors": [
                    "10",
                    "17",
                    "7",
                    "22"
                ]
            },
            {
                "id": "w2-l9-q13",
                "grade": 2,
                "axis": "Medición",
                "skill": "unidades de longitud",
                "prompt": "Un metro de cinta contiene ¿cuántos centímetros?",
                "options": [
                    "100",
                    "10",
                    "1",
                    "50"
                ],
                "correct": 0,
                "explanation": "Un metro equivale a cien centímetros.",
                "hint": "Recuerda la equivalencia.",
                "bossDistractors": [
                    "101",
                    "99",
                    "102",
                    "98"
                ]
            },
            {
                "id": "w2-l9-q14",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "Cada ● vale 2 globos. La cabeza izquierda muestra ● ● ● ● ●. ¿Cuántos globos representa?",
                "options": [
                    "10",
                    "11",
                    "9",
                    "12"
                ],
                "correct": 0,
                "explanation": "Cinco grupos de dos son diez globos.",
                "hint": "Cuenta de dos en dos.",
                "bossDistractors": [
                    "8",
                    "15",
                    "5",
                    "20"
                ]
            },
            {
                "id": "w2-l9-q15",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "gráfico de barras",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Entradas del dragón · cada █ vale 1</caption><thead><tr><th scope=\"col\">Cabeza</th><th scope=\"col\">Barra</th></tr></thead><tbody><tr><th scope=\"row\">Izquierda</th><td>█ █ █</td></tr><tr><th scope=\"row\">Derecha</th><td>█ █ █ █ █</td></tr></tbody></table></div>¿Cuántas entradas tiene la cabeza derecha?",
                "options": [
                    "5",
                    "6",
                    "4",
                    "7"
                ],
                "correct": 0,
                "explanation": "La barra derecha contiene cinco unidades.",
                "hint": "Cuenta la fila Derecha.",
                "bossDistractors": [
                    "3",
                    "10",
                    "0",
                    "15"
                ]
            },
            {
                "id": "w2-l9-q16",
                "grade": 2,
                "axis": "Datos y probabilidades",
                "skill": "registro de azar",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Lanzamientos de la moneda del dragón</caption><thead><tr><th scope=\"col\">Resultado</th><th scope=\"col\">Veces</th></tr></thead><tbody><tr><th scope=\"row\">Cara</th><td>4</td></tr><tr><th scope=\"row\">Sello</th><td>6</td></tr></tbody></table></div>¿Cuántas veces salió cara?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "La tabla registra cuatro caras.",
                "hint": "Lee el dato; no predigas el siguiente lanzamiento.",
                "bossDistractors": [
                    "2",
                    "9",
                    "14",
                    "7"
                ]
            },
            {
                "id": "w2-l9-q17",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "El dragón prepara 4 paquetes con 2 globos cada uno. ¿Cuántos prepara?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "4 × 2 = 8. Dibuja los grupos o cuenta con la tabla correspondiente.",
                "hint": "Dibuja los grupos o cuenta con la tabla correspondiente.",
                "bossDistractors": [
                    "6",
                    "13",
                    "3",
                    "18"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        4,
                        2
                    ]
                }
            },
            {
                "id": "w2-l9-q18",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "El dragón prepara 5 paquetes con 5 globos cada uno. ¿Cuántos prepara?",
                "options": [
                    "25",
                    "26",
                    "24",
                    "27"
                ],
                "correct": 0,
                "explanation": "5 × 5 = 25. Dibuja los grupos o cuenta con la tabla correspondiente.",
                "hint": "Dibuja los grupos o cuenta con la tabla correspondiente.",
                "bossDistractors": [
                    "23",
                    "30",
                    "20",
                    "35"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        5,
                        5
                    ]
                }
            },
            {
                "id": "w2-l9-q19",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "tablas del 2, 5 y 10",
                "prompt": "El dragón prepara 6 paquetes con 10 globos cada uno. ¿Cuántos prepara?",
                "options": [
                    "60",
                    "61",
                    "59",
                    "62"
                ],
                "correct": 0,
                "explanation": "6 × 10 = 60. Dibuja los grupos o cuenta con la tabla correspondiente.",
                "hint": "Dibuja los grupos o cuenta con la tabla correspondiente.",
                "bossDistractors": [
                    "58",
                    "65",
                    "55",
                    "70"
                ],
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        6,
                        10
                    ]
                }
            },
            {
                "id": "w2-l9-q20",
                "grade": 2,
                "axis": "Números y operaciones",
                "skill": "operaciones inversas",
                "prompt": "Si el dragón junta 32 + 16 = 48, ¿cuánto es 48 − 16?",
                "options": [
                    "32",
                    "33",
                    "31",
                    "34"
                ],
                "correct": 0,
                "explanation": "Deshacer la suma devuelve treinta y dos.",
                "hint": "Usa la operación inversa.",
                "bossDistractors": [
                    "30",
                    "37",
                    "27",
                    "42"
                ]
            }
        ],
        "grade": 2,
        "skills": [
            "suma sin reserva",
            "resta sin reserva",
            "valor posicional",
            "conteo por saltos",
            "patrón numérico",
            "igualdad",
            "figuras 2D",
            "figuras 3D",
            "posiciones",
            "reloj digital",
            "calendario",
            "longitud",
            "unidades de longitud",
            "pictograma con escala",
            "gráfico de barras",
            "registro de azar",
            "tablas del 2, 5 y 10",
            "operaciones inversas"
        ]
    },
    {
        "id": 10,
        "worldId": "world-3",
        "title": "Las cuentas del peón",
        "subtitle": "3.º básico · Organiza centenas y calcula hasta 1.000.",
        "icon": "♟️",
        "hasEnemy": true,
        "enemy": {
            "id": "peon_malvavisco",
            "name": "Peón de Malvavisco",
            "title": "Guardia de la Primera Casilla",
            "avatar": "♟️",
            "avatarDefeated": "😵",
            "avatarImg": "assets/world-3/candy-chess-pawn-80s.png",
            "badge": "JAQUE DULCE",
            "badgeClass": "candy",
            "maxHp": 8,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "Duelo de Golosinas",
            "mechanicDesc": "¡Cada cuenta correcta abre paso entre las filas del peón!",
            "dialogue": {
                "intro": "¡Agrupa mis caramelos en centenas, decenas y unidades!",
                "hit": "¡Me has quitado una fila de dulces!",
                "defeat": "¡Bien calculado! Puedes pasar a la siguiente casilla."
            }
        },
        "theory": {
            "title": "Las cuentas del peón",
            "content": "<p><strong>3.º básico.</strong> Organiza centenas y calcula hasta 1.000.</p><h3>Centenas, decenas y unidades</h3><p>347 son 3 centenas, 4 decenas y 7 unidades: 300 + 40 + 7. Para comparar, mira centenas, luego decenas y unidades.</p><h3>Sumar con reserva</h3><p>En 248 + 137, 8 + 7 = 15 unidades: cambia diez por una decena. Quedan 5 unidades; las decenas son 4 + 3 + 1 = 8 y las centenas 2 + 1 = 3. Resultado: 385.</p><h3>Restar y comprobar</h3><p>Para 432 − 118, cambia una decena por diez unidades: quedan 12 unidades y 2 decenas. 12 − 8 = 4, 2 − 1 = 1 y 4 − 1 = 3: quedan 314. Comprueba sumando 314 + 118.</p><h3>Patrones y casillas vacías</h3><p>En 125, 150, 175 se agrega 25. En 24 + □ = 40, la casilla vale 16. Puedes usar una resta para encontrarla.</p>"
        },
        "questions": [
            {
                "id": "w3-l10-q1",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "El peón guarda 347 caramelos. ¿Cuántas centenas completas tiene?",
                "options": [
                    "3",
                    "4",
                    "7",
                    "34"
                ],
                "correct": 0,
                "explanation": "347 contiene tres centenas, cuatro decenas y siete unidades.",
                "hint": "Una centena es un grupo de cien."
            },
            {
                "id": "w3-l10-q2",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "Hay 5 centenas, 2 decenas y 6 caramelos sueltos. ¿Cuántos hay?",
                "options": [
                    "526",
                    "562",
                    "256",
                    "625"
                ],
                "correct": 0,
                "explanation": "500 + 20 + 6 = 526.",
                "hint": "Suma el valor de cada posición."
            },
            {
                "id": "w3-l10-q3",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "comparación",
                "prompt": "Elige el mayor tesoro: 409, 490, 419 o 450.",
                "options": [
                    "490",
                    "409",
                    "419",
                    "450"
                ],
                "correct": 0,
                "explanation": "Todos tienen cuatro centenas; nueve decenas es la mayor cantidad.",
                "hint": "Compara centenas y luego decenas."
            },
            {
                "id": "w3-l10-q4",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "orden",
                "prompt": "¿Qué número va entre 698 y 700 al contar de uno en uno?",
                "options": [
                    "699",
                    "697",
                    "690",
                    "701"
                ],
                "correct": 0,
                "explanation": "La secuencia es 698, 699, 700.",
                "hint": "Avanza una unidad."
            },
            {
                "id": "w3-l10-q5",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "conteo por saltos",
                "prompt": "Los peones cuentan de 4 en 4: 12, 16, 20, __.",
                "options": [
                    "24",
                    "22",
                    "25",
                    "28"
                ],
                "correct": 0,
                "explanation": "Cada salto suma cuatro; 20 + 4 = 24.",
                "hint": "Conserva el salto."
            },
            {
                "id": "w3-l10-q6",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "estimación",
                "prompt": "Un saco tiene casi lo mismo que otro de 100 caramelos. ¿Qué estimación usarías?",
                "options": [
                    "100",
                    "10",
                    "500",
                    "1000"
                ],
                "correct": 0,
                "explanation": "La referencia parecida es cien caramelos.",
                "hint": "Usa el saco conocido para estimar."
            },
            {
                "id": "w3-l10-q7",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "suma hasta 1000",
                "prompt": "El peón junta 248 caramelos de fresa y 137 de limón. ¿Cuántos tiene?",
                "options": [
                    "385",
                    "386",
                    "384",
                    "387"
                ],
                "correct": 0,
                "explanation": "248 + 137 = 385. Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "hint": "Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        248,
                        137
                    ]
                }
            },
            {
                "id": "w3-l10-q8",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "suma hasta 1000",
                "prompt": "El peón junta 356 caramelos de fresa y 275 de limón. ¿Cuántos tiene?",
                "options": [
                    "631",
                    "632",
                    "630",
                    "633"
                ],
                "correct": 0,
                "explanation": "356 + 275 = 631. Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "hint": "Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        356,
                        275
                    ]
                }
            },
            {
                "id": "w3-l10-q9",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "suma hasta 1000",
                "prompt": "El peón junta 427 caramelos de fresa y 162 de limón. ¿Cuántos tiene?",
                "options": [
                    "589",
                    "590",
                    "588",
                    "591"
                ],
                "correct": 0,
                "explanation": "427 + 162 = 589. Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "hint": "Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        427,
                        162
                    ]
                }
            },
            {
                "id": "w3-l10-q10",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "suma hasta 1000",
                "prompt": "El peón junta 185 caramelos de fresa y 206 de limón. ¿Cuántos tiene?",
                "options": [
                    "391",
                    "392",
                    "390",
                    "393"
                ],
                "correct": 0,
                "explanation": "185 + 206 = 391. Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "hint": "Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        185,
                        206
                    ]
                }
            },
            {
                "id": "w3-l10-q11",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "suma hasta 1000",
                "prompt": "El peón junta 64 caramelos de fresa y 38 de limón. ¿Cuántos tiene?",
                "options": [
                    "102",
                    "103",
                    "101",
                    "104"
                ],
                "correct": 0,
                "explanation": "64 + 38 = 102. Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "hint": "Suma por posiciones y cambia diez unidades por una decena si hace falta.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        64,
                        38
                    ]
                }
            },
            {
                "id": "w3-l10-q12",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "resta hasta 1000",
                "prompt": "De 432 caramelos del peón se reparten 118. ¿Cuántos quedan?",
                "options": [
                    "314",
                    "315",
                    "313",
                    "316"
                ],
                "correct": 0,
                "explanation": "432 − 118 = 314. Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "hint": "Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        432,
                        118
                    ]
                }
            },
            {
                "id": "w3-l10-q13",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "resta hasta 1000",
                "prompt": "De 700 caramelos del peón se reparten 245. ¿Cuántos quedan?",
                "options": [
                    "455",
                    "456",
                    "454",
                    "457"
                ],
                "correct": 0,
                "explanation": "700 − 245 = 455. Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "hint": "Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        700,
                        245
                    ]
                }
            },
            {
                "id": "w3-l10-q14",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "resta hasta 1000",
                "prompt": "De 563 caramelos del peón se reparten 231. ¿Cuántos quedan?",
                "options": [
                    "332",
                    "333",
                    "331",
                    "334"
                ],
                "correct": 0,
                "explanation": "563 − 231 = 332. Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "hint": "Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        563,
                        231
                    ]
                }
            },
            {
                "id": "w3-l10-q15",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "resta hasta 1000",
                "prompt": "De 306 caramelos del peón se reparten 128. ¿Cuántos quedan?",
                "options": [
                    "178",
                    "179",
                    "177",
                    "180"
                ],
                "correct": 0,
                "explanation": "306 − 128 = 178. Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "hint": "Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        306,
                        128
                    ]
                }
            },
            {
                "id": "w3-l10-q16",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "resta hasta 1000",
                "prompt": "De 100 caramelos del peón se reparten 46. ¿Cuántos quedan?",
                "options": [
                    "54",
                    "55",
                    "53",
                    "56"
                ],
                "correct": 0,
                "explanation": "100 − 46 = 54. Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "hint": "Resta por posiciones y cambia una decena o centena cuando haga falta.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        100,
                        46
                    ]
                }
            },
            {
                "id": "w3-l10-q17",
                "grade": 3,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "El camino dulce sigue 125, 150, 175, __.",
                "options": [
                    "200",
                    "180",
                    "195",
                    "225"
                ],
                "correct": 0,
                "explanation": "Se agrega veinticinco cada vez: sigue doscientos.",
                "hint": "Calcula la diferencia entre términos vecinos."
            },
            {
                "id": "w3-l10-q18",
                "grade": 3,
                "axis": "Patrones y álgebra",
                "skill": "ecuación de un paso",
                "prompt": "Completa la caja del peón: 24 + □ = 40.",
                "options": [
                    "16",
                    "14",
                    "24",
                    "64"
                ],
                "correct": 0,
                "explanation": "40 − 24 = 16, por eso 24 + 16 = 40.",
                "hint": "Usa la resta para encontrar lo que falta."
            },
            {
                "id": "w3-l10-q19",
                "grade": 3,
                "axis": "Patrones y álgebra",
                "skill": "ecuación de un paso",
                "prompt": "El peón resuelve □ − 18 = 25. ¿Qué valor va en la casilla?",
                "options": [
                    "43",
                    "7",
                    "35",
                    "42"
                ],
                "correct": 0,
                "explanation": "25 + 18 = 43, y 43 − 18 = 25.",
                "hint": "Devuelve lo que se había quitado."
            },
            {
                "id": "w3-l10-q20",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "operaciones inversas",
                "prompt": "Si 235 + 140 = 375, ¿cuánto es 375 − 140?",
                "options": [
                    "235",
                    "140",
                    "375",
                    "515"
                ],
                "correct": 0,
                "explanation": "Restar lo agregado devuelve la cantidad inicial, 235.",
                "hint": "Deshaz la suma."
            }
        ],
        "grade": 3,
        "skills": [
            "valor posicional",
            "comparación",
            "orden",
            "conteo por saltos",
            "estimación",
            "suma hasta 1000",
            "resta hasta 1000",
            "patrón numérico",
            "ecuación de un paso",
            "operaciones inversas"
        ]
    },
    {
        "id": 11,
        "worldId": "world-3",
        "title": "Los repartos del caballo",
        "subtitle": "3.º básico · Domina las tablas hasta 10 y sus divisiones.",
        "icon": "♞",
        "hasEnemy": true,
        "enemy": {
            "id": "caballo_chocolate",
            "name": "Caballo de Chocolate",
            "title": "Jinete de las Tablas",
            "avatar": "♞",
            "avatarDefeated": "😵",
            "avatarImg": "assets/world-3/candy-chess-knight-80s.png",
            "badge": "JAQUE DULCE",
            "badgeClass": "candy",
            "maxHp": 9,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "Duelo de Golosinas",
            "mechanicDesc": "¡Multiplica y reparte para alcanzar al caballo!",
            "dialogue": {
                "intro": "¡Forma grupos iguales y reparte mis bombones!",
                "hit": "¡Menudo salto de cálculo!",
                "defeat": "¡Has llegado antes que yo! ¡Buen dominio de las tablas!"
            }
        },
        "theory": {
            "title": "Los repartos del caballo",
            "content": "<p><strong>3.º básico.</strong> Domina las tablas hasta 10 y sus divisiones.</p><h3>Filas y columnas</h3><p>Tres filas de cuatro bombones son 3 × 4 = 12. Girar el arreglo muestra 4 × 3: la cantidad no cambia. <span class=\"curriculum-tiles\" role=\"img\" aria-label=\"3 filas de 4 casillas; 12 coloreadas\" style=\"--tile-columns:4\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span></span></p><h3>Repartir y agrupar</h3><p>24 bombones repartidos entre 6 caballos dan 4 a cada uno: 24 ÷ 6 = 4. Si haces grupos de 6, obtienes 4 grupos. La multiplicación comprueba la división: 4 × 6 = 24.</p><h3>Construir las tablas</h3><p>Para 7 × 6, separa cinco grupos y dos grupos: 5 × 6 + 2 × 6 = 30 + 12 = 42. Multiplicar por 1 deja la cantidad; multiplicar por 0 da cero. Aquí todas las divisiones son exactas y el divisor nunca es cero.</p>"
        },
        "questions": [
            {
                "id": "w3-l11-q1",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 3 filas de 4 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "12",
                    "13",
                    "11",
                    "14"
                ],
                "correct": 0,
                "explanation": "3 × 4 = 12. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        3,
                        4
                    ]
                }
            },
            {
                "id": "w3-l11-q2",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 6 filas de 6 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "36",
                    "37",
                    "35",
                    "38"
                ],
                "correct": 0,
                "explanation": "6 × 6 = 36. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        6,
                        6
                    ]
                }
            },
            {
                "id": "w3-l11-q3",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 7 filas de 8 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "56",
                    "57",
                    "55",
                    "58"
                ],
                "correct": 0,
                "explanation": "7 × 8 = 56. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        7,
                        8
                    ]
                }
            },
            {
                "id": "w3-l11-q4",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 8 filas de 9 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "72",
                    "73",
                    "71",
                    "74"
                ],
                "correct": 0,
                "explanation": "8 × 9 = 72. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        8,
                        9
                    ]
                }
            },
            {
                "id": "w3-l11-q5",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 9 filas de 7 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "63",
                    "64",
                    "62",
                    "65"
                ],
                "correct": 0,
                "explanation": "9 × 7 = 63. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        9,
                        7
                    ]
                }
            },
            {
                "id": "w3-l11-q6",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 6 filas de 9 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "54",
                    "55",
                    "53",
                    "56"
                ],
                "correct": 0,
                "explanation": "6 × 9 = 54. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        6,
                        9
                    ]
                }
            },
            {
                "id": "w3-l11-q7",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 7 filas de 6 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "42",
                    "43",
                    "41",
                    "44"
                ],
                "correct": 0,
                "explanation": "7 × 6 = 42. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        7,
                        6
                    ]
                }
            },
            {
                "id": "w3-l11-q8",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 10 filas de 10 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "100",
                    "101",
                    "99",
                    "102"
                ],
                "correct": 0,
                "explanation": "10 × 10 = 100. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        10,
                        10
                    ]
                }
            },
            {
                "id": "w3-l11-q9",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 8 filas de 1 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "8 × 1 = 8. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        8,
                        1
                    ]
                }
            },
            {
                "id": "w3-l11-q10",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "El caballo prepara 5 filas de 0 bombones. ¿Cuántos bombones prepara?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "5"
                ],
                "correct": 0,
                "explanation": "5 × 0 = 0. Usa grupos iguales, una tabla conocida o separa los grupos.",
                "hint": "Usa grupos iguales, una tabla conocida o separa los grupos.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        5,
                        0
                    ]
                }
            },
            {
                "id": "w3-l11-q11",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 24 bombones por igual entre 6 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "4",
                    "5",
                    "3",
                    "6"
                ],
                "correct": 0,
                "explanation": "24 ÷ 6 = 4. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        24,
                        6
                    ]
                }
            },
            {
                "id": "w3-l11-q12",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 42 bombones por igual entre 7 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "6",
                    "7",
                    "5",
                    "8"
                ],
                "correct": 0,
                "explanation": "42 ÷ 7 = 6. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        42,
                        7
                    ]
                }
            },
            {
                "id": "w3-l11-q13",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 56 bombones por igual entre 8 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "7",
                    "8",
                    "6",
                    "9"
                ],
                "correct": 0,
                "explanation": "56 ÷ 8 = 7. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        56,
                        8
                    ]
                }
            },
            {
                "id": "w3-l11-q14",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 72 bombones por igual entre 9 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "72 ÷ 9 = 8. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        72,
                        9
                    ]
                }
            },
            {
                "id": "w3-l11-q15",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 63 bombones por igual entre 7 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "9",
                    "10",
                    "8",
                    "11"
                ],
                "correct": 0,
                "explanation": "63 ÷ 7 = 9. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        63,
                        7
                    ]
                }
            },
            {
                "id": "w3-l11-q16",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 36 bombones por igual entre 4 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "9",
                    "10",
                    "8",
                    "11"
                ],
                "correct": 0,
                "explanation": "36 ÷ 4 = 9. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        36,
                        4
                    ]
                }
            },
            {
                "id": "w3-l11-q17",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 90 bombones por igual entre 10 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "9",
                    "10",
                    "8",
                    "11"
                ],
                "correct": 0,
                "explanation": "90 ÷ 10 = 9. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        90,
                        10
                    ]
                }
            },
            {
                "id": "w3-l11-q18",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "El caballo reparte 48 bombones por igual entre 6 piezas. ¿Cuántos recibe cada pieza?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "48 ÷ 6 = 8. Busca qué número multiplicado por la cantidad de piezas da el total.",
                "hint": "Busca qué número multiplicado por la cantidad de piezas da el total.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        48,
                        6
                    ]
                }
            },
            {
                "id": "w3-l11-q19",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "agrupación",
                "prompt": "Hay 35 bombones. Si guardas 5 en cada bolsa, ¿cuántas bolsas completas obtienes?",
                "options": [
                    "7",
                    "5",
                    "6",
                    "8"
                ],
                "correct": 0,
                "explanation": "35 ÷ 5 = 7 bolsas.",
                "hint": "Cuenta cuántos grupos de cinco caben."
            },
            {
                "id": "w3-l11-q20",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "operaciones inversas",
                "prompt": "Si 8 × 7 = 56, ¿cuánto es 56 ÷ 7?",
                "options": [
                    "8",
                    "7",
                    "9",
                    "49"
                ],
                "correct": 0,
                "explanation": "La división deshace la multiplicación: 56 ÷ 7 = 8.",
                "hint": "Usa la multiplicación que ya conoces."
            }
        ],
        "grade": 3,
        "skills": [
            "tablas hasta 10",
            "división exacta",
            "agrupación",
            "operaciones inversas"
        ]
    },
    {
        "id": 12,
        "worldId": "world-3",
        "title": "El mapa del alfil",
        "subtitle": "3.º básico · Explora fracciones, cuerpos, ángulos y perímetros.",
        "icon": "♝",
        "hasEnemy": true,
        "enemy": {
            "id": "alfil_caramelo",
            "name": "Alfil de Caramelo",
            "title": "Maestro del Reparto Real",
            "avatar": "♝",
            "avatarDefeated": "😵",
            "avatarImg": "assets/world-3/candy-chess-bishop-80s.png",
            "badge": "JAQUE DULCE",
            "badgeClass": "candy",
            "maxHp": 10,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "Duelo de Golosinas",
            "mechanicDesc": "¡Explora fracciones y figuras para encontrar la siguiente casilla!",
            "dialogue": {
                "intro": "¡Sigue mi mapa y descubre las partes de cada golosina!",
                "hit": "¡Has repartido mis caramelos con precisión!",
                "defeat": "¡Has encontrado el camino! La siguiente casilla es tuya."
            }
        },
        "theory": {
            "title": "El mapa del alfil",
            "content": "<p><strong>3.º básico.</strong> Explora fracciones, cuerpos, ángulos y perímetros.</p><h3>Partes iguales</h3><p>Una fracción indica cuántas partes iguales tomas. 1/4 es una de cuatro; 3/4 son tres de cuatro. <span class=\"curriculum-tiles\" role=\"img\" aria-label=\"1 filas de 4 casillas; 3 coloreadas\" style=\"--tile-columns:4\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"\"></span></span> Al comparar partes del mismo entero con igual denominador, tres cuartos son más que un cuarto porque tomas más partes del mismo tamaño. Una de dos partes iguales es 1/2; una de tres es 1/3.</p><h3>Figuras y mapas</h3><p>Los cuerpos tienen caras, aristas y vértices. Un cubo tiene 6 caras, 12 aristas y 8 vértices. Una red de seis cuadrados, colocados para plegarse sin superponerse, puede formar un cubo. En un mapa usa una casilla como referencia y sigue las direcciones indicadas.</p><h3>Giros y bordes</h3><p>Un ángulo recto mide 90°; la mitad, 45°. Una traslación desliza una figura, una rotación la gira y una reflexión la muestra como en un espejo. El perímetro es la suma de los lados: un rectángulo de 5 y 3 cm tiene 5 + 3 + 5 + 3 = 16 cm.</p>"
        },
        "questions": [
            {
                "id": "w3-l12-q1",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "fracciones",
                "prompt": "<span class=\"curriculum-tiles\" role=\"img\" aria-label=\"1 filas de 4 casillas; 1 coloreadas\" style=\"--tile-columns:4\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"\"></span><span aria-hidden=\"true\" class=\"\"></span><span aria-hidden=\"true\" class=\"\"></span></span>Una tableta tiene cuatro partes iguales y una coloreada. ¿Qué fracción está coloreada?",
                "options": [
                    "1/4",
                    "1/2",
                    "3/4",
                    "1/3"
                ],
                "correct": 0,
                "explanation": "Se coloreó una de cuatro partes iguales: un cuarto.",
                "hint": "El denominador cuenta todas las partes iguales."
            },
            {
                "id": "w3-l12-q2",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "fracciones",
                "prompt": "<span class=\"curriculum-tiles\" role=\"img\" aria-label=\"1 filas de 3 casillas; 2 coloreadas\" style=\"--tile-columns:3\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"\"></span></span>Dos de tres partes iguales de una golosina están coloreadas. ¿Qué fracción representan?",
                "options": [
                    "2/3",
                    "1/3",
                    "3/4",
                    "1/2"
                ],
                "correct": 0,
                "explanation": "Son dos partes tomadas de un total de tres.",
                "hint": "El numerador indica las partes tomadas."
            },
            {
                "id": "w3-l12-q3",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "fracciones",
                "prompt": "El alfil divide una galleta en dos partes iguales y toma una. ¿Qué fracción toma?",
                "options": [
                    "1/2",
                    "1/3",
                    "1/4",
                    "3/4"
                ],
                "correct": 0,
                "explanation": "Una de dos partes iguales es una mitad.",
                "hint": "Primero cuenta todas las partes iguales."
            },
            {
                "id": "w3-l12-q4",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "comparar fracciones",
                "prompt": "De dos tabletas iguales, ¿qué porción es mayor: 3/4 o 1/4?",
                "options": [
                    "3/4",
                    "1/4",
                    "son iguales",
                    "no se puede comparar"
                ],
                "correct": 0,
                "explanation": "Tres cuartos son más que un cuarto del mismo entero.",
                "hint": "Las partes tienen el mismo tamaño: compara cuántas tomas."
            },
            {
                "id": "w3-l12-q5",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "comparar fracciones",
                "prompt": "En una misma tableta, ¿qué porción es menor: 1/3 o 2/3?",
                "options": [
                    "1/3",
                    "2/3",
                    "son iguales",
                    "las dos son el entero"
                ],
                "correct": 0,
                "explanation": "Una de tres partes es menos que dos de esas mismas partes.",
                "hint": "Ambas porciones usan tercios iguales."
            },
            {
                "id": "w3-l12-q6",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "fracciones",
                "prompt": "<span class=\"curriculum-tiles\" role=\"img\" aria-label=\"1 filas de 3 casillas; 1 coloreadas\" style=\"--tile-columns:3\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"\"></span><span aria-hidden=\"true\" class=\"\"></span></span>Una de tres partes iguales de la galleta está coloreada. ¿Qué fracción representa?",
                "options": [
                    "1/3",
                    "1/4",
                    "1/2",
                    "2/3"
                ],
                "correct": 0,
                "explanation": "Una parte tomada de tres partes iguales es un tercio.",
                "hint": "Cuenta todas las partes y luego las coloreadas."
            },
            {
                "id": "w3-l12-q7",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "fracciones de uso común",
                "prompt": "<span class=\"curriculum-tiles\" role=\"img\" aria-label=\"1 filas de 4 casillas; 3 coloreadas\" style=\"--tile-columns:4\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"\"></span></span>Tres partes de una tableta dividida en cuatro partes iguales representan…",
                "options": [
                    "3/4",
                    "1/4",
                    "2/3",
                    "1/2"
                ],
                "correct": 0,
                "explanation": "Tres de cuatro partes iguales son tres cuartos.",
                "hint": "Cuenta las partes coloreadas y el total."
            },
            {
                "id": "w3-l12-q8",
                "grade": 3,
                "axis": "Geometría",
                "skill": "mapas",
                "prompt": "En un mapa, el alfil parte en B2 y avanza una columna a la derecha, sin cambiar de fila. ¿Dónde llega?",
                "options": [
                    "C2",
                    "A2",
                    "B3",
                    "C3"
                ],
                "correct": 0,
                "explanation": "La columna que sigue a B es C; la fila permanece en 2.",
                "hint": "Solo cambia la columna."
            },
            {
                "id": "w3-l12-q9",
                "grade": 3,
                "axis": "Geometría",
                "skill": "mapas",
                "prompt": "Las filas del mapa aumentan hacia arriba. Desde C2, sube dos casillas. ¿Dónde llega?",
                "options": [
                    "C4",
                    "C3",
                    "A2",
                    "E2"
                ],
                "correct": 0,
                "explanation": "La columna sigue siendo C y la fila aumenta de 2 a 4.",
                "hint": "No cambies la columna."
            },
            {
                "id": "w3-l12-q10",
                "grade": 3,
                "axis": "Geometría",
                "skill": "cuerpos y redes",
                "prompt": "Una red que se pliega para formar un cubo debe tener ¿cuántas caras cuadradas?",
                "options": [
                    "6",
                    "4",
                    "8",
                    "12"
                ],
                "correct": 0,
                "explanation": "El cubo tiene seis caras cuadradas.",
                "hint": "Imagina las caras de un dado."
            },
            {
                "id": "w3-l12-q11",
                "grade": 3,
                "axis": "Geometría",
                "skill": "cuerpos y redes",
                "prompt": "¿Cuántos vértices tiene la caja cúbica del alfil?",
                "options": [
                    "8",
                    "6",
                    "10",
                    "12"
                ],
                "correct": 0,
                "explanation": "Un cubo tiene ocho vértices: cuatro arriba y cuatro abajo.",
                "hint": "Cuenta las esquinas en ambos niveles."
            },
            {
                "id": "w3-l12-q12",
                "grade": 3,
                "axis": "Geometría",
                "skill": "cuerpos y redes",
                "prompt": "¿Qué cuerpo tiene dos bases circulares y una superficie curva, como una lata?",
                "options": [
                    "cilindro",
                    "cono",
                    "esfera",
                    "cubo"
                ],
                "correct": 0,
                "explanation": "El cilindro tiene dos bases circulares paralelas.",
                "hint": "Piensa en una lata de golosinas."
            },
            {
                "id": "w3-l12-q13",
                "grade": 3,
                "axis": "Geometría",
                "skill": "ángulos",
                "prompt": "La esquina recta del tablero sirve de referencia. ¿Cuántos grados mide?",
                "options": [
                    "90",
                    "45",
                    "60",
                    "180"
                ],
                "correct": 0,
                "explanation": "Un ángulo recto mide noventa grados.",
                "hint": "Es la esquina de un cuadrado."
            },
            {
                "id": "w3-l12-q14",
                "grade": 3,
                "axis": "Geometría",
                "skill": "ángulos",
                "prompt": "Un giro mide la mitad de un ángulo recto. ¿Cuántos grados son?",
                "options": [
                    "45",
                    "90",
                    "30",
                    "180"
                ],
                "correct": 0,
                "explanation": "La mitad de 90 es 45 grados.",
                "hint": "Divide noventa en dos partes iguales."
            },
            {
                "id": "w3-l12-q15",
                "grade": 3,
                "axis": "Geometría",
                "skill": "transformaciones",
                "prompt": "Una ficha se desliza tres casillas sin girar ni voltearse. ¿Qué movimiento hizo?",
                "options": [
                    "traslación",
                    "rotación",
                    "reflexión",
                    "cambio de tamaño"
                ],
                "correct": 0,
                "explanation": "Deslizar sin cambiar orientación es una traslación.",
                "hint": "Observa si la ficha gira o solo cambia de lugar."
            },
            {
                "id": "w3-l12-q16",
                "grade": 3,
                "axis": "Geometría",
                "skill": "transformaciones",
                "prompt": "El alfil gira una figura alrededor de un punto. ¿Qué transformación realiza?",
                "options": [
                    "rotación",
                    "traslación",
                    "reflexión",
                    "cambio de tamaño"
                ],
                "correct": 0,
                "explanation": "Girar alrededor de un punto es una rotación.",
                "hint": "Identifica el movimiento de giro."
            },
            {
                "id": "w3-l12-q17",
                "grade": 3,
                "axis": "Geometría",
                "skill": "transformaciones",
                "prompt": "El dibujo de una ficha aparece invertido como en un espejo. ¿Qué transformación es?",
                "options": [
                    "reflexión",
                    "rotación",
                    "traslación",
                    "cambio de tamaño"
                ],
                "correct": 0,
                "explanation": "La imagen de espejo es una reflexión.",
                "hint": "Piensa en lo que muestra un espejo."
            },
            {
                "id": "w3-l12-q18",
                "grade": 3,
                "axis": "Medición",
                "skill": "perímetro",
                "prompt": "Un jardín cuadrado de caramelos tiene lados de 4 cm. ¿Cuántos centímetros mide su perímetro?",
                "options": [
                    "16",
                    "8",
                    "12",
                    "20"
                ],
                "correct": 0,
                "explanation": "El borde suma 4 + 4 + 4 + 4 = 16 cm.",
                "hint": "Suma los cuatro lados."
            },
            {
                "id": "w3-l12-q19",
                "grade": 3,
                "axis": "Medición",
                "skill": "perímetro",
                "prompt": "Un tablero rectangular mide 5 cm por 3 cm. ¿Cuántos centímetros mide todo su borde?",
                "options": [
                    "16",
                    "8",
                    "15",
                    "10"
                ],
                "correct": 0,
                "explanation": "El perímetro es 5 + 3 + 5 + 3 = 16 cm.",
                "hint": "Incluye los cuatro lados, no solo dos."
            },
            {
                "id": "w3-l12-q20",
                "grade": 3,
                "axis": "Medición",
                "skill": "perímetro",
                "prompt": "Un sendero triangular tiene lados de 3, 4 y 5 m. ¿Cuántos metros mide su perímetro?",
                "options": [
                    "12",
                    "7",
                    "9",
                    "20"
                ],
                "correct": 0,
                "explanation": "3 + 4 + 5 = 12 metros.",
                "hint": "Suma todos los lados del sendero."
            }
        ],
        "grade": 3,
        "skills": [
            "fracciones",
            "comparar fracciones",
            "fracciones de uso común",
            "mapas",
            "cuerpos y redes",
            "ángulos",
            "transformaciones",
            "perímetro"
        ]
    },
    {
        "id": 13,
        "worldId": "world-3",
        "title": "La torre de los registros",
        "subtitle": "3.º básico · Lee horas, compara masas e investiga datos del reino.",
        "icon": "♜",
        "hasEnemy": true,
        "enemy": {
            "id": "torre_barquillo",
            "name": "Torre de Barquillo",
            "title": "Fortaleza de las Operaciones",
            "avatar": "♜",
            "avatarDefeated": "😵",
            "avatarImg": "assets/world-3/candy-chess-rook-80s.png",
            "badge": "JAQUE DULCE",
            "badgeClass": "candy",
            "maxHp": 11,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "slap",
            "mechanicTitle": "Duelo de Golosinas",
            "mechanicDesc": "¡Interpreta medidas y datos para derribar mi defensa!",
            "dialogue": {
                "intro": "¡Lee los registros de mi torre dulce!",
                "hit": "¡Se ha roto una capa de mi escudo!",
                "defeat": "¡Has leído mis registros! El palacio de la reina te espera."
            }
        },
        "theory": {
            "title": "La torre de los registros",
            "content": "<p><strong>3.º básico.</strong> Lee horas, compara masas e investiga datos del reino.</p><h3>Tiempo y longitud</h3><p>Un reloj digital 4:15 marca las cuatro y cuarto. En el análogo la aguja corta indica la hora y la larga los minutos; cada salto entre números vale 5 minutos. Entre 3:20 y 3:45 pasan 25 minutos. Para medir largo, alinea el cero de la regla.</p><h3>Masa</h3><p>Usa gramos para una golosina y kilogramos para un saco. 1 kg equivale a 1.000 g. Para comparar, expresa las medidas en la misma unidad.</p><h3>Encuestas y registros</h3><p>Una encuesta recoge respuestas a una pregunta. Lee la escala: aquí cada punto vale cinco golosinas. <div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Golosinas del reino · cada ● representa 5</caption><thead><tr><th scope=\"col\">Pieza</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Peón</th><td>● ●</td></tr><tr><th scope=\"row\">Caballo</th><td>● ● ● ●</td></tr><tr><th scope=\"row\">Alfil</th><td>● ● ●</td></tr></tbody></table></div> Un diagrama de puntos registra cuántas veces aparece cada valor. <div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Puntos por cantidad de golosinas · cada × representa 1 bolsa</caption><thead><tr><th scope=\"col\">Golosinas en la bolsa</th><th scope=\"col\">Bolsas</th></tr></thead><tbody><tr><th scope=\"row\">2</th><td>× ×</td></tr><tr><th scope=\"row\">3</th><td>× × ×</td></tr><tr><th scope=\"row\">4</th><td>×</td></tr></tbody></table></div></p><h3>Experimentos</h3><p>Al lanzar una moneda puedes registrar cara y sello. Los resultados observados no garantizan el siguiente resultado. Aquí leemos y comparamos registros; no necesitamos calcular porcentajes ni probabilidades formales.</p>"
        },
        "questions": [
            {
                "id": "w3-l13-q1",
                "grade": 3,
                "axis": "Medición",
                "skill": "reloj",
                "prompt": "La torre muestra 4:15. ¿Cómo se lee esa hora?",
                "options": [
                    "cuatro y cuarto",
                    "cuatro y media",
                    "cuatro en punto",
                    "cinco y cuarto"
                ],
                "correct": 0,
                "explanation": "Quince minutos son un cuarto de hora.",
                "hint": "Lee la hora y luego los minutos."
            },
            {
                "id": "w3-l13-q2",
                "grade": 3,
                "axis": "Medición",
                "skill": "reloj",
                "prompt": "En el reloj de la torre la aguja larga apunta al 6 y la corta está entre 3 y 4. ¿Qué hora marca?",
                "options": [
                    "3:30",
                    "6:15",
                    "3:00",
                    "4:30"
                ],
                "correct": 0,
                "explanation": "La aguja larga en seis indica treinta minutos; la hora es tres y media.",
                "hint": "La aguja larga marca los minutos."
            },
            {
                "id": "w3-l13-q3",
                "grade": 3,
                "axis": "Medición",
                "skill": "duración",
                "prompt": "La guardia comienza a las 3:20 y termina a las 3:45. ¿Cuántos minutos dura?",
                "options": [
                    "25",
                    "20",
                    "15",
                    "35"
                ],
                "correct": 0,
                "explanation": "45 − 20 = 25 minutos; ambas horas son las tres.",
                "hint": "Compara los minutos dentro de la misma hora."
            },
            {
                "id": "w3-l13-q4",
                "grade": 3,
                "axis": "Medición",
                "skill": "reloj",
                "prompt": "La aguja larga apunta al 3 y la corta está un poco después del 2. ¿Qué hora es?",
                "options": [
                    "2:15",
                    "3:10",
                    "2:30",
                    "3:00"
                ],
                "correct": 0,
                "explanation": "La aguja larga en tres marca quince minutos: son las dos y cuarto.",
                "hint": "Cada salto de la aguja larga representa cinco minutos."
            },
            {
                "id": "w3-l13-q5",
                "grade": 3,
                "axis": "Medición",
                "skill": "masa",
                "prompt": "¿Cuántos gramos tiene un saco de 1 kg de golosinas?",
                "options": [
                    "1000",
                    "100",
                    "10",
                    "500"
                ],
                "correct": 0,
                "explanation": "Un kilogramo equivale a mil gramos.",
                "hint": "Recuerda la equivalencia entre kilogramo y gramo."
            },
            {
                "id": "w3-l13-q6",
                "grade": 3,
                "axis": "Medición",
                "skill": "masa",
                "prompt": "Una bolsa pesa 750 g y otra 500 g. ¿Cuántos gramos pesa la más pesada?",
                "options": [
                    "750",
                    "500",
                    "250",
                    "700"
                ],
                "correct": 0,
                "explanation": "Setecientos cincuenta gramos es mayor que quinientos.",
                "hint": "Las dos medidas ya usan la misma unidad."
            },
            {
                "id": "w3-l13-q7",
                "grade": 3,
                "axis": "Medición",
                "skill": "masa",
                "prompt": "Una bolsa de azúcar tiene 1 kg y otra 600 g. ¿Cuál tiene mayor masa?",
                "options": [
                    "la de 1 kg",
                    "la de 600 g",
                    "son iguales",
                    "no se puede comparar"
                ],
                "correct": 0,
                "explanation": "1 kg son 1.000 g, más que 600 g.",
                "hint": "Convierte el kilogramo a gramos."
            },
            {
                "id": "w3-l13-q8",
                "grade": 3,
                "axis": "Medición",
                "skill": "masa",
                "prompt": "El saco tenía 900 g de caramelos y se usaron 250 g. ¿Cuántos gramos quedan?",
                "options": [
                    "650",
                    "750",
                    "550",
                    "850"
                ],
                "correct": 0,
                "explanation": "900 − 250 = 650 gramos.",
                "hint": "Resta la masa que se usó."
            },
            {
                "id": "w3-l13-q9",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Golosinas del reino · cada ● representa 5</caption><thead><tr><th scope=\"col\">Pieza</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Peón</th><td>● ●</td></tr><tr><th scope=\"row\">Caballo</th><td>● ● ● ●</td></tr><tr><th scope=\"row\">Alfil</th><td>● ● ●</td></tr></tbody></table></div>¿Cuántas golosinas tiene el caballo?",
                "options": [
                    "20",
                    "4",
                    "10",
                    "15"
                ],
                "correct": 0,
                "explanation": "Cuatro puntos de cinco representan veinte golosinas.",
                "hint": "Multiplica la cantidad de puntos por cinco."
            },
            {
                "id": "w3-l13-q10",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Golosinas del reino · cada ● representa 5</caption><thead><tr><th scope=\"col\">Pieza</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Peón</th><td>● ●</td></tr><tr><th scope=\"row\">Caballo</th><td>● ● ● ●</td></tr><tr><th scope=\"row\">Alfil</th><td>● ● ●</td></tr></tbody></table></div>¿Cuántas golosinas tiene el alfil?",
                "options": [
                    "15",
                    "3",
                    "10",
                    "20"
                ],
                "correct": 0,
                "explanation": "Tres puntos de cinco representan quince.",
                "hint": "Lee la escala del pictograma."
            },
            {
                "id": "w3-l13-q11",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "comparar datos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Golosinas del reino · cada ● representa 5</caption><thead><tr><th scope=\"col\">Pieza</th><th scope=\"col\">Registro</th></tr></thead><tbody><tr><th scope=\"row\">Peón</th><td>● ●</td></tr><tr><th scope=\"row\">Caballo</th><td>● ● ● ●</td></tr><tr><th scope=\"row\">Alfil</th><td>● ● ●</td></tr></tbody></table></div>¿Cuántas golosinas más tiene el caballo que el peón?",
                "options": [
                    "10",
                    "2",
                    "5",
                    "15"
                ],
                "correct": 0,
                "explanation": "El caballo tiene 20 y el peón 10: la diferencia es 10.",
                "hint": "Convierte los puntos a golosinas antes de restar."
            },
            {
                "id": "w3-l13-q12",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "gráfico de barras",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Bolsas preparadas · cada █ vale 2 bolsas</caption><thead><tr><th scope=\"col\">Turno</th><th scope=\"col\">Barra</th></tr></thead><tbody><tr><th scope=\"row\">Mañana</th><td>█ █ █</td></tr><tr><th scope=\"row\">Tarde</th><td>█ █ █ █</td></tr></tbody></table></div>¿Cuántas bolsas se prepararon en la tarde?",
                "options": [
                    "8",
                    "4",
                    "6",
                    "10"
                ],
                "correct": 0,
                "explanation": "Cuatro unidades de dos representan ocho bolsas.",
                "hint": "Cada bloque vale dos bolsas."
            },
            {
                "id": "w3-l13-q13",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "diagrama de puntos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Puntos por cantidad de golosinas · cada × representa 1 bolsa</caption><thead><tr><th scope=\"col\">Golosinas en la bolsa</th><th scope=\"col\">Bolsas</th></tr></thead><tbody><tr><th scope=\"row\">2</th><td>× ×</td></tr><tr><th scope=\"row\">3</th><td>× × ×</td></tr><tr><th scope=\"row\">4</th><td>×</td></tr></tbody></table></div>¿Cuántas bolsas tienen 3 golosinas?",
                "options": [
                    "3",
                    "2",
                    "4",
                    "6"
                ],
                "correct": 0,
                "explanation": "En la fila del valor tres hay tres cruces: tres bolsas.",
                "hint": "Cada cruz cuenta una bolsa, no una golosina."
            },
            {
                "id": "w3-l13-q14",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "diagrama de puntos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Puntos por cantidad de golosinas · cada × representa 1 bolsa</caption><thead><tr><th scope=\"col\">Golosinas en la bolsa</th><th scope=\"col\">Bolsas</th></tr></thead><tbody><tr><th scope=\"row\">2</th><td>× ×</td></tr><tr><th scope=\"row\">3</th><td>× × ×</td></tr><tr><th scope=\"row\">4</th><td>×</td></tr></tbody></table></div>¿Cuántas bolsas se registraron en total?",
                "options": [
                    "6",
                    "3",
                    "4",
                    "9"
                ],
                "correct": 0,
                "explanation": "Se registraron 2 + 3 + 1 = 6 bolsas.",
                "hint": "Suma todas las cruces."
            },
            {
                "id": "w3-l13-q15",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "encuesta",
                "prompt": "La torre quiere saber la golosina favorita de sus guardias. ¿Qué pregunta debe hacer?",
                "options": [
                    "¿Qué golosina prefieres?",
                    "¿Cuánto mides?",
                    "¿Qué hora es?",
                    "¿Cuántas puertas tiene la torre?"
                ],
                "correct": 0,
                "explanation": "La pregunta recoge la preferencia que se desea investigar.",
                "hint": "Relaciona la pregunta con la información buscada."
            },
            {
                "id": "w3-l13-q16",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "encuesta",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Votos de los guardias</caption><thead><tr><th scope=\"col\">Golosina</th><th scope=\"col\">Votos</th></tr></thead><tbody><tr><th scope=\"row\">Caramelo</th><td>7</td></tr><tr><th scope=\"row\">Bombón</th><td>4</td></tr><tr><th scope=\"row\">Galleta</th><td>5</td></tr></tbody></table></div>¿Cuál obtuvo más votos?",
                "options": [
                    "caramelo",
                    "bombón",
                    "galleta",
                    "todas igual"
                ],
                "correct": 0,
                "explanation": "Caramelo obtuvo siete votos, la cantidad mayor.",
                "hint": "Compara las tres frecuencias."
            },
            {
                "id": "w3-l13-q17",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "registro de azar",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Moneda del reino</caption><thead><tr><th scope=\"col\">Resultado</th><th scope=\"col\">Veces</th></tr></thead><tbody><tr><th scope=\"row\">Cara</th><td>6</td></tr><tr><th scope=\"row\">Sello</th><td>4</td></tr></tbody></table></div>¿Cuántos lanzamientos se registraron?",
                "options": [
                    "10",
                    "6",
                    "4",
                    "12"
                ],
                "correct": 0,
                "explanation": "Seis caras más cuatro sellos suman diez lanzamientos.",
                "hint": "Suma las dos frecuencias."
            },
            {
                "id": "w3-l13-q18",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "registro de azar",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Moneda de la torre</caption><thead><tr><th scope=\"col\">Resultado</th><th scope=\"col\">Veces</th></tr></thead><tbody><tr><th scope=\"row\">Cara</th><td>3</td></tr><tr><th scope=\"row\">Sello</th><td>7</td></tr></tbody></table></div>¿Qué resultado ocurrió más veces?",
                "options": [
                    "sello",
                    "cara",
                    "ambos igual",
                    "ninguno"
                ],
                "correct": 0,
                "explanation": "Sello ocurrió siete veces, más que tres.",
                "hint": "Lee los resultados observados."
            },
            {
                "id": "w3-l13-q19",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "azar",
                "prompt": "Una moneda salió cara tres veces seguidas. ¿Qué puedes afirmar sobre el próximo lanzamiento?",
                "options": [
                    "puede salir cara o sello",
                    "saldrá cara con seguridad",
                    "saldrá sello con seguridad",
                    "no puede salir cara"
                ],
                "correct": 0,
                "explanation": "Los resultados anteriores no aseguran la próxima cara de la moneda.",
                "hint": "Un registro no es una garantía del resultado siguiente."
            },
            {
                "id": "w3-l13-q20",
                "grade": 3,
                "axis": "Medición",
                "skill": "longitud",
                "prompt": "Una cinta del reino se extiende desde 0 hasta 24 cm en la regla. ¿Cuántos centímetros mide?",
                "options": [
                    "24",
                    "12",
                    "20",
                    "25"
                ],
                "correct": 0,
                "explanation": "Su longitud es de veinticuatro centímetros.",
                "hint": "Alinea el extremo inicial con el cero."
            }
        ],
        "grade": 3,
        "skills": [
            "reloj",
            "duración",
            "masa",
            "pictograma con escala",
            "comparar datos",
            "gráfico de barras",
            "diagrama de puntos",
            "encuesta",
            "registro de azar",
            "azar",
            "longitud"
        ]
    },
    {
        "id": 14,
        "worldId": "world-3",
        "title": "El jaque de la Reina de Azúcar",
        "subtitle": "3.º básico · Repasa 3.º básico y sigue la respuesta entre las casillas.",
        "icon": "♛",
        "isBoss": true,
        "boss": {
            "id": "reina_azucar",
            "name": "Reina de Azúcar",
            "title": "Soberana del Reino del Jaque Dulce",
            "avatar": "♛",
            "avatarImg": "assets/world-3/candy-chess-queen-80s.png",
            "badge": "REINA",
            "badgeClass": "candy",
            "maxHp": 20,
            "regenRate": 0,
            "baseDamage": 1,
            "streakBonus": 0.5,
            "mechanicType": "answer-shuffle",
            "shuffleIntervalMs": 2000,
            "mechanicTitle": "¡Jaque de Azúcar!",
            "mechanicDesc": "♛ ¡Las respuestas cambian de casilla cada 2 segundos!",
            "dialogue": {
                "intro": "¡Mis dulces cambian de casilla! Sigue el resultado, no su posición.",
                "hit": "¡Has encontrado tu respuesta entre mis movimientos!",
                "defeat": "¡Jaque mate! Has vencido a la Reina de Azúcar."
            }
        },
        "theory": {
            "title": "El jaque de la Reina de Azúcar",
            "content": "<p><strong>3.º básico.</strong> Repasa 3.º básico y sigue la respuesta entre las casillas.</p><h3>Repaso del reino</h3><p>La reina mezcla lo aprendido con el peón, el caballo, el alfil y la torre: números hasta 1.000, tablas y división exacta, fracciones sencillas, mapas, perímetros, tiempo, masa y datos.</p><h3>Jaque de Azúcar</h3><p>Las <strong>cuatro alternativas cambian de posición cada dos segundos</strong>. Sigue el valor o el texto que resuelve la pregunta, no su posición. La mezcla se detiene al responder, mantener pulsada una opción, abrir una lección o el perfil, u ocultar la pestaña. Puedes usar las teclas 1 a 4 según las posiciones visibles. La reina tiene 20 HP y no recupera vida.</p><h3>Comprueba</h3><p>Para una división, comprueba multiplicando. Para un perímetro, suma todos los lados. Para un gráfico, lee primero la escala. Todas estas estrategias ya aparecieron en los niveles anteriores.</p>"
        },
        "questions": [
            {
                "id": "w3-l14-q1",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "valor posicional",
                "prompt": "El tesoro real tiene 6 centenas, 3 decenas y 2 unidades. ¿Cuántos caramelos son?",
                "options": [
                    "632",
                    "623",
                    "362",
                    "236"
                ],
                "correct": 0,
                "explanation": "600 + 30 + 2 = 632.",
                "hint": "Respeta el valor de cada posición."
            },
            {
                "id": "w3-l14-q2",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "suma hasta 1000",
                "prompt": "La reina reúne 267 caramelos y recibe 158. ¿Cuántos tiene?",
                "options": [
                    "425",
                    "426",
                    "424",
                    "427"
                ],
                "correct": 0,
                "explanation": "267 + 158 = 425. Suma por posiciones y cambia diez unidades por una decena cuando haga falta.",
                "hint": "Suma por posiciones y cambia diez unidades por una decena cuando haga falta.",
                "calculation": {
                    "operation": "add",
                    "operands": [
                        267,
                        158
                    ]
                }
            },
            {
                "id": "w3-l14-q3",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "resta hasta 1000",
                "prompt": "De 600 caramelos reales se entregan 275. ¿Cuántos quedan?",
                "options": [
                    "325",
                    "326",
                    "324",
                    "327"
                ],
                "correct": 0,
                "explanation": "600 − 275 = 325. Puedes cambiar una centena en decenas y una decena en unidades.",
                "hint": "Puedes cambiar una centena en decenas y una decena en unidades.",
                "calculation": {
                    "operation": "subtract",
                    "operands": [
                        600,
                        275
                    ]
                }
            },
            {
                "id": "w3-l14-q4",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "tablas hasta 10",
                "prompt": "Hay 7 filas de 9 golosinas en el tablero real. ¿Cuántas golosinas hay?",
                "options": [
                    "63",
                    "64",
                    "62",
                    "65"
                ],
                "correct": 0,
                "explanation": "7 × 9 = 63. Usa la tabla del nueve o separa cinco filas y dos filas.",
                "hint": "Usa la tabla del nueve o separa cinco filas y dos filas.",
                "calculation": {
                    "operation": "multiply",
                    "operands": [
                        7,
                        9
                    ]
                }
            },
            {
                "id": "w3-l14-q5",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "división exacta",
                "prompt": "La reina reparte 64 bombones entre 8 piezas por igual. ¿Cuántos recibe cada pieza?",
                "options": [
                    "8",
                    "9",
                    "7",
                    "10"
                ],
                "correct": 0,
                "explanation": "64 ÷ 8 = 8. Busca qué número multiplicado por ocho da sesenta y cuatro.",
                "hint": "Busca qué número multiplicado por ocho da sesenta y cuatro.",
                "calculation": {
                    "operation": "divide",
                    "operands": [
                        64,
                        8
                    ]
                }
            },
            {
                "id": "w3-l14-q6",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "agrupación",
                "prompt": "La reina guarda 54 caramelos en bolsas de 6. ¿Cuántas bolsas llena?",
                "options": [
                    "9",
                    "6",
                    "8",
                    "10"
                ],
                "correct": 0,
                "explanation": "54 ÷ 6 = 9 bolsas.",
                "hint": "Busca cuántos grupos de seis forman cincuenta y cuatro."
            },
            {
                "id": "w3-l14-q7",
                "grade": 3,
                "axis": "Patrones y álgebra",
                "skill": "patrón numérico",
                "prompt": "La ruta de la reina es 250, 275, 300, __.",
                "options": [
                    "325",
                    "305",
                    "320",
                    "350"
                ],
                "correct": 0,
                "explanation": "Se agrega veinticinco cada vez.",
                "hint": "Conserva el salto."
            },
            {
                "id": "w3-l14-q8",
                "grade": 3,
                "axis": "Patrones y álgebra",
                "skill": "ecuación de un paso",
                "prompt": "Completa el cofre real: 35 + □ = 60.",
                "options": [
                    "25",
                    "15",
                    "35",
                    "95"
                ],
                "correct": 0,
                "explanation": "60 − 35 = 25.",
                "hint": "Encuentra lo que falta con una resta."
            },
            {
                "id": "w3-l14-q9",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "fracciones",
                "prompt": "<span class=\"curriculum-tiles\" role=\"img\" aria-label=\"1 filas de 4 casillas; 3 coloreadas\" style=\"--tile-columns:4\"><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"filled\"></span><span aria-hidden=\"true\" class=\"\"></span></span>¿Qué fracción de la tableta real está coloreada?",
                "options": [
                    "3/4",
                    "1/4",
                    "1/2",
                    "2/3"
                ],
                "correct": 0,
                "explanation": "Tres de cuatro partes iguales son tres cuartos.",
                "hint": "Cuenta partes coloreadas y partes totales."
            },
            {
                "id": "w3-l14-q10",
                "grade": 3,
                "axis": "Números y operaciones",
                "skill": "comparar fracciones",
                "prompt": "En dos galletas iguales, ¿qué porción es mayor: 1/3 o 2/3?",
                "options": [
                    "2/3",
                    "1/3",
                    "son iguales",
                    "ninguna representa una porción"
                ],
                "correct": 0,
                "explanation": "Dos tercios son más que un tercio del mismo entero.",
                "hint": "Las partes tienen el mismo tamaño."
            },
            {
                "id": "w3-l14-q11",
                "grade": 3,
                "axis": "Geometría",
                "skill": "cuerpos y redes",
                "prompt": "¿Cuántas caras cuadradas tiene el cofre cúbico de la reina?",
                "options": [
                    "6",
                    "4",
                    "8",
                    "12"
                ],
                "correct": 0,
                "explanation": "Un cubo tiene seis caras cuadradas.",
                "hint": "Imagina las caras de un dado."
            },
            {
                "id": "w3-l14-q12",
                "grade": 3,
                "axis": "Geometría",
                "skill": "mapas",
                "prompt": "Desde D3, la reina se mueve una columna a la izquierda, sin cambiar de fila. ¿Dónde llega?",
                "options": [
                    "C3",
                    "E3",
                    "D2",
                    "C2"
                ],
                "correct": 0,
                "explanation": "Antes de D está C; la fila sigue siendo tres.",
                "hint": "Solo cambia la columna."
            },
            {
                "id": "w3-l14-q13",
                "grade": 3,
                "axis": "Geometría",
                "skill": "ángulos",
                "prompt": "Una esquina recta de la corona mide ¿cuántos grados?",
                "options": [
                    "90",
                    "45",
                    "60",
                    "180"
                ],
                "correct": 0,
                "explanation": "Un ángulo recto mide noventa grados.",
                "hint": "Recuerda la esquina de un cuadrado."
            },
            {
                "id": "w3-l14-q14",
                "grade": 3,
                "axis": "Geometría",
                "skill": "transformaciones",
                "prompt": "La reina desliza un dibujo sin girarlo ni voltearlo. ¿Qué transformación hace?",
                "options": [
                    "traslación",
                    "rotación",
                    "reflexión",
                    "cambio de tamaño"
                ],
                "correct": 0,
                "explanation": "Deslizar conservando la orientación es una traslación.",
                "hint": "Distingue deslizar de girar."
            },
            {
                "id": "w3-l14-q15",
                "grade": 3,
                "axis": "Medición",
                "skill": "perímetro",
                "prompt": "El jardín real es cuadrado y cada lado mide 6 m. ¿Cuántos metros mide su perímetro?",
                "options": [
                    "24",
                    "12",
                    "18",
                    "36"
                ],
                "correct": 0,
                "explanation": "6 + 6 + 6 + 6 = 24 metros.",
                "hint": "Suma los cuatro lados."
            },
            {
                "id": "w3-l14-q16",
                "grade": 3,
                "axis": "Medición",
                "skill": "reloj",
                "prompt": "La guardia de la reina empieza a las 5:15. ¿Cómo se lee?",
                "options": [
                    "cinco y cuarto",
                    "cinco y media",
                    "cinco en punto",
                    "seis y cuarto"
                ],
                "correct": 0,
                "explanation": "Quince minutos son un cuarto de hora.",
                "hint": "Lee primero la hora."
            },
            {
                "id": "w3-l14-q17",
                "grade": 3,
                "axis": "Medición",
                "skill": "masa",
                "prompt": "La reina compara un saco de 1 kg y otro de 800 g. ¿Cuál tiene mayor masa?",
                "options": [
                    "el de 1 kg",
                    "el de 800 g",
                    "son iguales",
                    "no se puede comparar"
                ],
                "correct": 0,
                "explanation": "Un kilogramo son mil gramos, más que ochocientos.",
                "hint": "Expresa ambos en gramos."
            },
            {
                "id": "w3-l14-q18",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "pictograma con escala",
                "prompt": "Cada ● vale 5 caramelos. El cofre real muestra ● ● ● ● ● ●. ¿Cuántos representa?",
                "options": [
                    "30",
                    "6",
                    "25",
                    "35"
                ],
                "correct": 0,
                "explanation": "Seis grupos de cinco representan treinta caramelos.",
                "hint": "Lee la escala antes de contar."
            },
            {
                "id": "w3-l14-q19",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "diagrama de puntos",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Bolsas del palacio · cada × representa una bolsa</caption><thead><tr><th scope=\"col\">Caramelos por bolsa</th><th scope=\"col\">Bolsas</th></tr></thead><tbody><tr><th scope=\"row\">2</th><td>×</td></tr><tr><th scope=\"row\">3</th><td>× × × ×</td></tr><tr><th scope=\"row\">4</th><td>× ×</td></tr></tbody></table></div>¿Cuántas bolsas contienen 3 caramelos?",
                "options": [
                    "4",
                    "3",
                    "7",
                    "12"
                ],
                "correct": 0,
                "explanation": "En el valor tres hay cuatro cruces: cuatro bolsas.",
                "hint": "Cada cruz representa una bolsa."
            },
            {
                "id": "w3-l14-q20",
                "grade": 3,
                "axis": "Datos y probabilidades",
                "skill": "registro de azar",
                "prompt": "<div class=\"curriculum-table-wrap\"><table class=\"curriculum-table\"><caption>Moneda de la reina</caption><thead><tr><th scope=\"col\">Resultado</th><th scope=\"col\">Veces</th></tr></thead><tbody><tr><th scope=\"row\">Cara</th><td>8</td></tr><tr><th scope=\"row\">Sello</th><td>5</td></tr></tbody></table></div>¿Cuántos lanzamientos se registraron?",
                "options": [
                    "13",
                    "8",
                    "5",
                    "3"
                ],
                "correct": 0,
                "explanation": "Ocho caras más cinco sellos suman trece lanzamientos.",
                "hint": "Suma todas las frecuencias."
            }
        ],
        "grade": 3,
        "skills": [
            "valor posicional",
            "suma hasta 1000",
            "resta hasta 1000",
            "tablas hasta 10",
            "división exacta",
            "agrupación",
            "patrón numérico",
            "ecuación de un paso",
            "fracciones",
            "comparar fracciones",
            "cuerpos y redes",
            "mapas",
            "ángulos",
            "transformaciones",
            "perímetro",
            "reloj",
            "masa",
            "pictograma con escala",
            "diagrama de puntos",
            "registro de azar"
        ]
    },

    // ==========================================
    // MUNDO 4: BOSQUE DEL ÁLGEBRA (NIVELES 15 - 19)
    // ==========================================
    {
        id: 15,
        worldId: "world-4",
        title: "La Incógnita Misteriosa",
        subtitle: "Bienvenido al mundo de x y las variables",
        icon: "🔮",
        theory: {
            title: "¿Qué es una Variable?",
            content: `
                <p>En álgebra, una letra como <strong>$x$</strong> es simplemente una <em>caja misteriosa</em> que guarda un número desconocido.</p>
                <div class="theory-visual">
                    <span>$$x + 5 = 12$$</span>
                </div>
                <p>Para descubrir qué hay dentro, aplicamos la <strong>operación contraria</strong> a ambos lados de la balanza:</p>
                <div class="theory-visual">
                    <span>$$x = 12 - 5 = 7$$</span>
                </div>
                <p>¡El signo igual es una balanza perfecta que siempre debe mantenerse en equilibrio!</p>
            `
        },
        questions: [
            {
                prompt: "Encuentra el valor de $x$: $x + 8 = 15$",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "Restamos 8 a ambos lados: $x = 15 - 8 = 7$.",
                hint: "¿Qué número sumado a 8 da 15?"
            },
            {
                prompt: "Encuentra el valor de $x$: $x - 9 = 11$",
                options: ["20", "2", "18", "21"],
                correct: 0,
                explanation: "Sumamos 9 a ambos lados: $x = 11 + 9 = 20$.",
                hint: "Pasa el 9 sumando: $11 + 9$."
            },
            {
                prompt: "Encuentra el valor de $y$: $25 - y = 18$",
                options: ["7", "8", "9", "6"],
                correct: 0,
                explanation: "$25 - 18 = y \\implies y = 7$.",
                hint: "¿Cuánto le restas a 25 para que quede 18?"
            },
            {
                prompt: "Si $a + a = 14$, ¿cuánto vale $a$?",
                options: ["6", "7", "8", "14"],
                correct: 1,
                explanation: "$2a = 14 \\implies a = 14 \\div 2 = 7$.",
                hint: "Dos cosas iguales que sumadas den 14."
            },
            {
                prompt: "Encuentra el valor de $x$: $x + (-3) = 10$",
                options: ["7", "13", "-13", "-7"],
                correct: 1,
                explanation: "$x - 3 = 10 \\implies x = 10 + 3 = 13$.",
                hint: "Sumar un negativo es restar: $x - 3 = 10$."
            }
        ]
    },
    {
        id: 16,
        worldId: "world-4",
        title: "Multiplicando la Incógnita",
        subtitle: "Ecuaciones con coeficientes ($ax = b$)",
        icon: "⚖️",
        theory: {
            title: "Coeficientes y Despeje",
            content: `
                <p>Cuando un número está pegado a una letra (como $3x$), significa que <strong>se están multiplicando</strong>:</p>
                <div class="theory-visual">
                    <span>$$3x = 3 \\times x$$</span>
                </div>
                <p>Para despejar $x$, dividimos entre ese número a ambos lados:</p>
                <div class="theory-visual">
                    <span>$$3x = 21 \\implies x = \\frac{21}{3} = 7$$</span>
                </div>
                <p>Si la $x$ está dividida: $\\frac{x}{4} = 5 \\implies x = 5 \\times 4 = 20$.</p>
            `
        },
        questions: [
            {
                prompt: "Resuelve: $4x = 28$",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "Dividimos entre 4: $x = \\frac{28}{4} = 7$.",
                hint: "¿Qué número multiplicado por 4 da 28?"
            },
            {
                prompt: "Resuelve: $\\frac{x}{5} = 6$",
                options: ["30", "11", "25", "1.2"],
                correct: 0,
                explanation: "Multiplicamos por 5: $x = 6 \\times 5 = 30$.",
                hint: "Pasa el 5 multiplicando al 6."
            },
            {
                prompt: "Resuelve: $-3x = 18$",
                options: ["6", "-6", "-5", "54"],
                correct: 1,
                explanation: "Dividimos entre $-3$: $x = \\frac{18}{-3} = -6$.",
                hint: "Positivo entre negativo da negativo."
            },
            {
                prompt: "Resuelve: $7x = 0$",
                options: ["7", "1", "0", "Indefinido"],
                correct: 2,
                explanation: "$x = \\frac{0}{7} = 0$.",
                hint: "Cero dividido por 7 es 0."
            },
            {
                prompt: "Resuelve: $10x = 150$",
                options: ["10", "15", "1500", "25"],
                correct: 1,
                explanation: "$x = \\frac{150}{10} = 15$.",
                hint: "Elimina un cero de 150."
            }
        ]
    },
    {
        id: 17,
        worldId: "world-4",
        title: "Ecuaciones de Dos Pasos",
        subtitle: "Combinando suma y multiplicación ($ax + b = c$)",
        icon: "🗝️",
        theory: {
            title: "El Plan de Dos Pasos",
            content: `
                <p>Para resolver $2x + 5 = 17$, seguimos el orden inverso de operaciones:</p>
                <ol>
                    <li><strong>Paso 1:</strong> Elimina lo que sume o reste (pasa al otro lado):
                        $$2x = 17 - 5 \\implies 2x = 12$$
                    </li>
                    <li><strong>Paso 2:</strong> Divide entre el coeficiente:
                        $$x = \\frac{12}{2} = 6$$
                    </li>
                </ol>
                <div class="theory-tip">💡 Comprobación: $2(6) + 5 = 12 + 5 = 17$. ¡Funciona perfecto!</div>
            `
        },
        questions: [
            {
                prompt: "Resuelve: $2x + 4 = 16$",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "Paso 1: $2x = 16 - 4 = 12$. Paso 2: $x = \\frac{12}{2} = 6$.",
                hint: "Primero resta 4, luego divide entre 2."
            },
            {
                prompt: "Resuelve: $3x - 5 = 16$",
                options: ["7", "6", "8", "9"],
                correct: 0,
                explanation: "$3x = 16 + 5 = 21 \\implies x = \\frac{21}{3} = 7$.",
                hint: "Suma 5 a 16 ($= 21$), luego divide por 3."
            },
            {
                prompt: "Resuelve: $5x + 10 = 35$",
                options: ["4", "5", "6", "7"],
                correct: 1,
                explanation: "$5x = 35 - 10 = 25 \\implies x = 5$.",
                hint: "$35 - 10 = 25$, y $25 \\div 5$."
            },
            {
                prompt: "Resuelve: $4x + 12 = 0$",
                options: ["3", "-3", "4", "-4"],
                correct: 1,
                explanation: "$4x = -12 \\implies x = \\frac{-12}{4} = -3$.",
                hint: "Pasa el 12 como negativo: $4x = -12$."
            },
            {
                prompt: "Un número se multiplica por 2 y luego se le suma 7, dando 25. ¿Cuál es ese número?",
                options: ["8", "9", "10", "11"],
                correct: 1,
                explanation: "Ecuación: $2x + 7 = 25 \\implies 2x = 18 \\implies x = 9$.",
                hint: "$25 - 7 = 18$, y la mitad de 18 es..."
            }
        ]
    },
    {
        id: 18,
        worldId: "world-4",
        title: "Potencias y Raíces",
        subtitle: "El crecimiento exponencial ($x^n$ y $\\sqrt{x}$)",
        icon: "💥",
        theory: {
            title: "Potencias y Raíces",
            content: `
                <p>Una <strong>potencia</strong> representa multiplicar un número por sí mismo varias veces:</p>
                <div class="theory-visual">
                    <span>$$x^n = \\underbrace{x \\times x \\times \\dots \\times x}_{n \\text{ veces}}$$</span>
                    <span>$$3^2 = 3 \\times 3 = 9 \\qquad 2^3 = 2 \\times 2 \\times 2 = 8$$</span>
                </div>
                <p>La <strong>raíz cuadrada</strong> $\\sqrt{x}$ hace lo opuesto: busca qué número multiplicado por sí mismo da $x$:</p>
                <div class="theory-visual">
                    <span>$$\\sqrt{25} = 5 \\quad (\\text{porque } 5^2 = 25)$$</span>
                </div>
            `
        },
        questions: [
            {
                prompt: "Calcula: $4^2$",
                options: ["8", "16", "12", "24"],
                correct: 1,
                explanation: "$4^2 = 4 \\times 4 = 16$. (¡Cuidado: no es $4 \\times 2$!)",
                hint: "Multiplica 4 por sí mismo."
            },
            {
                prompt: "Calcula: $2^4$",
                options: ["8", "16", "32", "12"],
                correct: 1,
                explanation: "$2 \\times 2 \\times 2 \\times 2 = 16$.",
                hint: "Duplica el 2 cuatro veces: 2, 4, 8, 16."
            },
            {
                prompt: "Calcula la raíz cuadrada: $\\sqrt{49}$",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "$\\sqrt{49} = 7$ porque $7 \\times 7 = 49$.",
                hint: "¿Qué número multiplicado por sí mismo da 49?"
            },
            {
                prompt: "Si $x^2 = 64$ y $x > 0$, ¿cuál es el valor de $x$?",
                options: ["6", "7", "8", "16"],
                correct: 2,
                explanation: "$8^2 = 64$, por lo que $x = 8$.",
                hint: "La raíz cuadrada de 64."
            },
            {
                prompt: "¿Cuánto es cualquier número elevado a la potencia cero (por ejemplo, $5^0$)?",
                options: ["0", "5", "1", "Indefinido"],
                correct: 2,
                explanation: "Por definición matemática de las potencias, $a^0 = 1$ para cualquier $a \\neq 0$.",
                hint: "Regla de exponentes: todo número elevado a 0 es 1."
            }
        ]
    },
    {
        id: 19,
        worldId: "world-4",
        title: "La Esfinge Algebraica (Jefe)",
        subtitle: "¡Batalla de Jefe: El Enigma de la Incógnita!",
        icon: "🧝‍♀️",
        isBoss: true,
        boss: {
            id: "esfinge_algebraica",
            name: "La Esfinge Algebraica",
            title: "Mística del Bosque de las Incógnitas",
            avatar: "🧝‍♀️🔮",
            maxHp: 8.0,
            regenRate: 0.15,
            baseDamage: 1.2,
            streakBonus: 0.6,
            mechanicType: "enigma",
            mechanicTitle: "Niebla de la Variable X",
            mechanicDesc: "Recupera +0.15 HP/s. Despeja las incógnitas para disipar su barrera mágica.",
            dialogue: {
                intro: "El valor de X decidirá tu destino...",
                hit: "¡Has despejado mi misterio!",
                defeat: "La incógnita se ha revelado ante ti."
            }
        },
        theory: {
            title: "El Enigma de la Esfinge",
            content: `
                <p>La Esfinge sólo permite el paso al Pico de las Funciones a quienes dominen las incógnitas complejas con paréntesis y potencias.</p>
                <div class="theory-visual">
                    <span>$$a(x + b) = ax + ab$$</span>
                </div>
                <div class="theory-tip">🔮 <strong>Mecánica:</strong> La Esfinge recupera <strong>+0.15 HP/s</strong> de energía mágica. ¡Despeja $x$ rápidamente para disipar su escudo!</div>
            `
        },
        questions: [
            {
                prompt: "Resuelve: $2(x + 3) = 16$",
                options: ["5", "6", "7", "8"],
                correct: 0,
                explanation: "Dividimos entre 2: $x + 3 = 8 \\implies x = 8 - 3 = 5$.",
                hint: "O bien: $2x + 6 = 16 \\implies 2x = 10 \\implies x = 5$."
            },
            {
                prompt: "Resuelve: $3x + 4 = x + 12$",
                options: ["2", "4", "6", "8"],
                correct: 1,
                explanation: "Restamos $x$: $2x + 4 = 12$. Restamos 4: $2x = 8 \\implies x = 4$.",
                hint: "Junta las $x$ a la izquierda y los números a la derecha."
            },
            {
                prompt: "Resuelve: $x^2 - 9 = 0$ (considerando $x > 0$)",
                options: ["3", "-3", "9", "4.5"],
                correct: 0,
                explanation: "$x^2 = 9 \\implies x = \\sqrt{9} = 3$.",
                hint: "Pasa el 9 sumando y saca raíz cuadrada."
            },
            {
                prompt: "Calcula: $\\sqrt{100} + 3^2$",
                options: ["19", "16", "23", "25"],
                correct: 0,
                explanation: "$\\sqrt{100} = 10$ y $3^2 = 9$. Entonces $10 + 9 = 19$.",
                hint: "$10 + 9$."
            },
            {
                prompt: "Si $4(x - 2) = 20$, ¿cuánto vale $x$?",
                options: ["5", "6", "7", "8"],
                correct: 2,
                explanation: "$x - 2 = 20 \\div 4 = 5 \\implies x = 5 + 2 = 7$.",
                hint: "$x - 2 = 5$."
            }
        ]
    },

    // ==========================================
    // MUNDO 5: PICO DE LAS FUNCIONES (NIVELES 20 - 23)
    // ==========================================
    {
        id: 20,
        worldId: "world-5",
        title: "La Máquina de Transformar: f(x)",
        subtitle: "¿Qué es una función y cómo evaluarla?",
        icon: "⚙️",
        theory: {
            title: "Funciones: Entrada y Salida",
            content: `
                <p>Una <strong>función</strong> $f(x)$ es como una máquina mágica: tú introduces un valor para $x$ (la entrada) y la máquina aplica una regla fija para devolver un resultado (la salida).</p>
                <div class="theory-visual">
                    <span>$$x \\longrightarrow \\boxed{f(x) = 2x + 3} \\longrightarrow y$$</span>
                </div>
                <p>Para calcular $f(4)$, simplemente cambiamos cada $x$ por un $4$:</p>
                <div class="theory-visual">
                    <span>$$f(4) = 2(4) + 3 = 8 + 3 = 11$$</span>
                </div>
            `
        },
        questions: [
            {
                prompt: "Dada $f(x) = 3x - 2$, evalúa $f(4)$:",
                options: ["10", "12", "14", "9"],
                correct: 0,
                explanation: "$f(4) = 3(4) - 2 = 12 - 2 = 10$.",
                hint: "Reemplaza $x$ por 4 y haz la operación."
            },
            {
                prompt: "Dada $g(x) = x^2 + 1$, evalúa $g(3)$:",
                options: ["7", "10", "9", "12"],
                correct: 1,
                explanation: "$g(3) = 3^2 + 1 = 9 + 1 = 10$.",
                hint: "Eleva 3 al cuadrado y suma 1."
            },
            {
                prompt: "Dada $f(x) = 5 - 2x$, ¿cuánto vale $f(0)$?",
                options: ["0", "5", "-2", "3"],
                correct: 1,
                explanation: "$f(0) = 5 - 2(0) = 5 - 0 = 5$.",
                hint: "Cualquier término con $x$ se vuelve cero."
            },
            {
                prompt: "Si $h(x) = 2x + 1$ y sabemos que $h(x) = 11$, ¿cuál era la entrada $x$?",
                options: ["4", "5", "6", "10"],
                correct: 1,
                explanation: "$2x + 1 = 11 \\implies 2x = 10 \\implies x = 5$.",
                hint: "Despeja $x$ de la ecuación $2x + 1 = 11$."
            },
            {
                prompt: "Dada $f(x) = x^2$, evalúa $f(-4)$:",
                options: ["-16", "16", "-8", "8"],
                correct: 1,
                explanation: "$f(-4) = (-4)^2 = (-4) \\times (-4) = +16$.",
                hint: "Un número negativo al cuadrado da positivo."
            }
        ]
    },
    {
        id: 21,
        worldId: "world-5",
        title: "Pendiente: La Inclinación",
        subtitle: "Razón de cambio y la ecuación de la recta ($y = mx + b$)",
        icon: "📐",
        theory: {
            title: "La Pendiente: Razón de Cambio",
            content: `
                <p>En una recta $y = mx + b$, la letra <strong>$m$</strong> representa la <strong>pendiente</strong> (qué tan inclinada está):</p>
                <div class="theory-visual">
                    <span>$$m = \\frac{\\Delta y}{\\Delta x} = \\frac{\\text{cambio vertical}}{\\text{cambio horizontal}}$$</span>
                </div>
                <ul>
                    <li>Si $m > 0$: La recta <strong>sube</strong> de izquierda a derecha.</li>
                    <li>Si $m < 0$: La recta <strong>baja</strong> de izquierda a derecha.</li>
                    <li>Si $m = 0$: Es completamente <strong>horizontal</strong> (plana).</li>
                </ul>
                <p>¡La pendiente es el concepto puente hacia las derivadas!</p>
            `
        },
        questions: [
            {
                prompt: "¿Cuál es la pendiente de la recta $y = 5x - 7$?",
                options: ["5", "-7", "x", "7"],
                correct: 0,
                explanation: "En la forma $y = mx + b$, el número que multiplica a la $x$ es la pendiente $m = 5$.",
                hint: "Observa el coeficiente de la $x$."
            },
            {
                prompt: "Si una recta pasa de $(0, 0)$ a $(2, 6)$, ¿cuál es su pendiente $m$?",
                options: ["2", "3", "4", "6"],
                correct: 1,
                explanation: "$m = \\frac{\\Delta y}{\\Delta x} = \\frac{6 - 0}{2 - 0} = \\frac{6}{2} = 3$.",
                hint: "Divide el cambio en $y$ entre el cambio en $x$."
            },
            {
                prompt: "Si la pendiente de una recta es negativa ($m = -2$), la recta:",
                options: ["Sube de izquierda a derecha", "Baja de izquierda a derecha", "Es completamente vertical", "Es curva"],
                correct: 1,
                explanation: "Una pendiente negativa indica que la recta desciende a medida que $x$ avanza.",
                hint: "Pendiente negativa = descenso."
            },
            {
                prompt: "¿Qué pendiente tiene una recta perfectamente horizontal, como $y = 4$?",
                options: ["1", "0", "4", "Infinito"],
                correct: 1,
                explanation: "Una línea horizontal no sube ni baja, por lo que su inclinación o pendiente es $0$.",
                hint: "No hay cambio vertical ($\\Delta y = 0$)."
            },
            {
                prompt: "En la función de posición $s(t) = 60t$ (donde $t$ son horas y $s$ son km), ¿qué representa la pendiente $60$?",
                options: ["La aceleración", "La velocidad constante (60 km/h)", "El punto de partida", "El tiempo total"],
                correct: 1,
                explanation: "La razón de cambio de la posición con respecto al tiempo es la velocidad: 60 km/h.",
                hint: "Cambio de distancia por unidad de tiempo."
            }
        ]
    },
    {
        id: 22,
        worldId: "world-5",
        title: "Curvas y la Ilusión del Cambio",
        subtitle: "Polinomios y pendientes variables",
        icon: "📈",
        theory: {
            title: "¿Qué pasa cuando la línea no es recta?",
            content: `
                <p>En una línea recta la pendiente es siempre la misma. Pero en una curva como $f(x) = x^2$, la inclinación <strong>cambia en cada milímetro</strong>:</p>
                <div class="theory-visual">
                    <span>En $x = 0$: la curva es plana ($m = 0$).</span><br>
                    <span>En $x = 1$: empieza a subir suavemente.</span><br>
                    <span>En $x = 10$: sube casi verticalmente como un cohete.</span>
                </div>
                <p>¿Cómo calculamos la inclinación exacta de una curva en un solo punto instantáneo? ¡Para eso inventamos el <strong>Cálculo Diferencial</strong>!</p>
            `
        },
        questions: [
            {
                prompt: "En la función $f(x) = x^2$, ¿cuál es el valor mínimo de la curva?",
                options: ["-1", "0 (en el origen)", "1", "No tiene mínimo"],
                correct: 1,
                explanation: "Como todo número al cuadrado es $\\ge 0$, el mínimo es $f(0) = 0$.",
                hint: "El vértice de la parábola toca el eje en el origen."
            },
            {
                prompt: "A diferencia de una recta, en una curva parabólica la pendiente es:",
                options: ["Siempre constante", "Variable según el punto", "Siempre cero", "Siempre negativa"],
                correct: 1,
                explanation: "En una curva la inclinación cambia constantemente de un punto a otro.",
                hint: "¿La curva es igual de empinada al inicio que más adelante?"
            },
            {
                prompt: "Para una función cuadrática $f(x) = -x^2 + 4$, ¿su gráfica abre hacia arriba o hacia abajo?",
                options: ["Hacia arriba (como una U)", "Hacia abajo (como una montaña invertida)", "Hacia la derecha", "Es una recta"],
                correct: 1,
                explanation: "El signo negativo frente a $x^2$ hace que la parábola abra hacia abajo con un punto máximo.",
                hint: "El signo negativo del coeficiente principal invierte la parábola."
            },
            {
                prompt: "Si un coche acelera, ¿cómo es su gráfica de distancia contra tiempo?",
                options: ["Una recta horizontal", "Una recta diagonal recta", "Una curva que se inclina cada vez más hacia arriba", "Un círculo"],
                correct: 2,
                explanation: "Al ganar más velocidad por segundo, la curva se vuelve cada vez más empinada.",
                hint: "Cada segundo recorre más distancia que el segundo anterior."
            },
            {
                prompt: "¿Qué rama de la matemática estudia la pendiente instantánea de cualquier curva?",
                options: ["Aritmética básica", "Geometría plana", "Cálculo Diferencial (Derivadas)", "Estadística"],
                correct: 2,
                explanation: "¡El Cálculo Diferencial, formulado por Newton y Leibniz, fue creado precisamente para este propósito!",
                hint: "Es el tema de nuestro próximo y último mundo."
            }
        ]
    },
    {
        id: 23,
        worldId: "world-5",
        title: "El Navegante de Curvas (Jefe)",
        subtitle: "¡Batalla de Jefe: El Señor de las Pendientes!",
        icon: "🦅",
        isBoss: true,
        boss: {
            id: "navegante_curvas",
            name: "El Navegante de Curvas",
            title: "Señor de las Pendientes y el Viento",
            avatar: "🦅📈",
            maxHp: 9.0,
            regenRate: 0.18,
            baseDamage: 1.4,
            streakBonus: 0.7,
            mechanicType: "slope",
            mechanicTitle: "Viento Tangente",
            mechanicDesc: "Gana altitud (+0.18 HP/s). Usa razones de cambio rápidas para derribar su escudo.",
            dialogue: {
                intro: "¡Vuelo a la velocidad de la pendiente máxima!",
                hit: "¡Mi trayectoria se desestabiliza!",
                defeat: "Has calculado mi razón de cambio a la perfección..."
            }
        },
        theory: {
            title: "El Vuelo del Navegante",
            content: `
                <p>El Guardián Alado domina las corrientes de viento y las trayectorias parabólicas.</p>
                <p>Demuestra tu entendimiento de funciones, pendientes y razones de cambio para ganarte el pase a la <strong>Cumbre del Cálculo</strong>.</p>
                <div class="theory-tip">📈 <strong>Mecánica:</strong> El Navegante recupera <strong>+0.18 HP/s</strong> al ascender. ¡Calcula razones de cambio certeras para vencerlo!</div>
            `
        },
        questions: [
            {
                prompt: "Calcula la razón de cambio promedio de $f(x) = x^2$ entre $x = 1$ y $x = 3$:",
                options: ["2", "4", "6", "8"],
                correct: 1,
                explanation: "$\\frac{f(3) - f(1)}{3 - 1} = \\frac{9 - 1}{2} = \\frac{8}{2} = 4$.",
                hint: "Calcula $\\Delta y / \\Delta x = (3^2 - 1^2) / (3 - 1)$."
            },
            {
                prompt: "Dada $f(x) = 2x^2 - 3x + 1$, ¿cuánto vale $f(2)$?",
                options: ["3", "5", "7", "1"],
                correct: 0,
                explanation: "$f(2) = 2(2^2) - 3(2) + 1 = 2(4) - 6 + 1 = 8 - 6 + 1 = 3$.",
                hint: "$2(4) - 6 + 1$."
            },
            {
                prompt: "¿Cuál de estas funciones es una línea recta con pendiente $m = -3$ y cruce por el eje $y$ en $b = 4$?",
                options: ["$y = 4x - 3$", "$y = -3x + 4$", "$y = 3x + 4$", "$y = -3x^2 + 4$"],
                correct: 1,
                explanation: "La ecuación $y = mx + b$ con $m = -3$ y $b = 4$ es $y = -3x + 4$.",
                hint: "Forma $y = mx + b$."
            },
            {
                prompt: "¿Qué significa que la velocidad instantánea de un objeto sea 0 en el punto más alto de su salto?",
                options: ["Que desapareció", "Que la curva de su posición tiene pendiente horizontal en ese instante", "Que nunca volverá a caer", "Que su masa es cero"],
                correct: 1,
                explanation: "En la cima de la trayectoria, la pendiente tangente es 0 (momento exacto de cambio de dirección).",
                hint: "En el punto más alto, la inclinación instantánea es plana."
            },
            {
                prompt: "Si $f(x) = \\frac{1}{x}$, ¿para qué valor de $x$ la función NO está definida?",
                options: ["$x = 1$", "$x = -1$", "$x = 0$", "Está definida para todos los números"],
                correct: 2,
                explanation: "No se puede dividir entre cero, por lo que $f(0) = \\frac{1}{0}$ es una asíntota indefinida.",
                hint: "Recuerda la regla de oro: nunca dividir entre 0."
            }
        ]
    },

    // ==========================================
    // MUNDO 6: NEXO DEL CÁLCULO (NIVELES 24 - 30)
    // ==========================================
    {
        id: 24,
        worldId: "world-6",
        title: "La Recta Tangente y el Límite",
        subtitle: "La pendiente en un instante microscópico",
        icon: "🎯",
        theory: {
            title: "La Derivada: Pendiente Instantánea",
            content: `
                <p>Una recta <strong>secante</strong> cruza una curva por dos puntos separados. Si acercamos esos dos puntos hasta que la distancia $h \\to 0$, la secante se convierte en la <strong>recta tangente</strong>:</p>
                <div class="theory-visual">
                    <span>$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$</span>
                </div>
                <p>La notación de la derivada puede escribirse como:</p>
                <div class="theory-visual">
                    <span>$$f'(x) \\quad \\text{ó} \\quad \\frac{df}{dx} \\quad \\text{ó} \\quad \\frac{d}{dx}[f(x)]$$</span>
                </div>
                <p><strong>Significado intuitivo:</strong> ¡La derivada nos da la velocidad de cambio exacta en cada punto!</p>
            `
        },
        questions: [
            {
                prompt: "Geométricamente, ¿qué representa la derivada $f'(a)$ en un punto $x = a$?",
                options: ["El área bajo la curva", "La pendiente de la recta tangente a la curva en ese punto", "El valor máximo de la función", "El corte con el eje horizontal"],
                correct: 1,
                explanation: "La derivada es exactamente la pendiente de la recta tangente en ese punto.",
                hint: "Piensa en la inclinación de la regla apoyada sobre la curva en ese punto."
            },
            {
                prompt: "¿Cómo se lee comúnmente el símbolo $f'(x)$?",
                options: ["f primo de x", "f prima de x (o derivada de f respecto a x)", "f elevado a 1", "f dividida entre x"],
                correct: 1,
                explanation: "Se lee 'f prima de x' o 'la derivada de f con respecto a x'.",
                hint: "La comilla se pronuncia 'prima'."
            },
            {
                prompt: "Si la derivada de una función es positiva ($f'(x) > 0$) en un intervalo, ¿qué está haciendo la función?",
                options: ["Está disminuyendo", "Está creciendo (subiendo)", "Es completamente constante", "Es igual a cero"],
                correct: 1,
                explanation: "Una pendiente tangente positiva significa que los valores de la función van en aumento.",
                hint: "Pendiente positiva = subida."
            },
            {
                prompt: "¿Qué ocurre con la derivada en la cima de una colina suave (un punto máximo relativo)?",
                options: ["$f'(x) = 0$", "$f'(x) = 100$", "$f'(x)$ es negativa", "$f'(x)$ no existe"],
                correct: 0,
                explanation: "En la cima o punto crítico horizontal, la recta tangente es plana, por lo que $f'(x) = 0$.",
                hint: "La tangente es horizontal en la cima."
            },
            {
                prompt: "Si una función es una recta $f(x) = 4x + 7$, ¿cuál crees que es su derivada $f'(x)$ en cualquier punto?",
                options: ["7", "4", "4x", "0"],
                correct: 1,
                explanation: "Como la pendiente de una recta es constante e igual a 4, su derivada es simplemente 4.",
                hint: "La pendiente de la recta es el coeficiente de $x$."
            }
        ]
    },
    {
        id: 25,
        worldId: "world-6",
        title: "La Regla de la Potencia",
        subtitle: "La fórmula más famosa del cálculo: $\\frac{d}{dx}[x^n] = n x^{n-1}$",
        icon: "⚡",
        theory: {
            title: "La Regla de la Potencia",
            content: `
                <p>Para derivar cualquier término de la forma $x^n$, solo aplicas dos pasos sencillos:</p>
                <div class="theory-visual">
                    <span>$$\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$$</span>
                </div>
                <ol>
                    <li>El exponente original <strong>baja</strong> a multiplicar al frente.</li>
                    <li>Al exponente le <strong>restas 1</strong> unidad.</li>
                </ol>
                <div class="theory-visual">
                    <span>Ejemplo: $\\frac{d}{dx}[x^3] = 3x^{3-1} = 3x^2$</span>
                    <span>Ejemplo: $\\frac{d}{dx}[x^2] = 2x^{2-1} = 2x^1 = 2x$</span>
                </div>
            `
        },
        questions: [
            {
                prompt: "¿Cuál es la derivada de $f(x) = x^4$?",
                options: ["$4x^3$", "$3x^4$", "$4x^5$", "$x^3$"],
                correct: 0,
                explanation: "El 4 baja y el exponente se reduce en uno: $4x^{4-1} = 4x^3$.",
                hint: "Baja el 4 y resta 1 al exponente: $4-1=3$."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = x^2$?",
                options: ["$x$", "$2x$", "$2$", "$x^2$"],
                correct: 1,
                explanation: "$\\frac{d}{dx}[x^2] = 2x^{2-1} = 2x$.",
                hint: "Baja el 2 y queda $x^1 = x$."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = x^7$?",
                options: ["$7x^6$", "$6x^7$", "$7x^8$", "$14x$"],
                correct: 0,
                explanation: "$7 \\cdot x^{7-1} = 7x^6$.",
                hint: "Baja el 7 y réstale 1."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = x$ (es decir, $x^1$)?",
                options: ["0", "1", "$x$", "$2$"],
                correct: 1,
                explanation: "$1 \\cdot x^{1-1} = 1 \\cdot x^0 = 1 \\cdot 1 = 1$. La pendiente de $y = x$ es 1.",
                hint: "Baja el 1 y $x^0 = 1$."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = x^5$?",
                options: ["$5x^4$", "$4x^5$", "$25x$", "$5x^5$"],
                correct: 0,
                explanation: "$\\frac{d}{dx}[x^5] = 5x^4$.",
                hint: "El 5 baja al frente y queda exponente 4."
            }
        ]
    },
    {
        id: 26,
        worldId: "world-6",
        title: "Constantes y Múltiplos",
        subtitle: "$\\frac{d}{dx}[c] = 0$ y $\\frac{d}{dx}[k \\cdot f(x)] = k \\cdot f'(x)$",
        icon: "🛡️",
        theory: {
            title: "Regla de la Constante y Coeficientes",
            content: `
                <p><strong>1. Derivada de una constante pura:</strong> Un número solo no cambia (su inclinación es cero):</p>
                <div class="theory-visual">
                    <span>$$\\frac{d}{dx}[c] = 0 \\quad (\\text{Ejemplo: } \\frac{d}{dx}[9] = 0, \\; \\frac{d}{dx}[100] = 0)$$</span>
                </div>
                <p><strong>2. Coeficiente multiplicador:</strong> Si hay un número multiplicando, se queda esperando y multiplica al resultado:</p>
                <div class="theory-visual">
                    <span>$$\\frac{d}{dx}[5x^3] = 5 \\cdot (3x^2) = 15x^2$$</span>
                </div>
            `
        },
        questions: [
            {
                prompt: "¿Cuál es la derivada de la constante $f(x) = 15$?",
                options: ["15", "1", "0", "$15x$"],
                correct: 2,
                explanation: "Una constante pura no cambia jamás, por lo que su razón de cambio es 0.",
                hint: "La derivada de cualquier número suelto es 0."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = 3x^2$?",
                options: ["$6x$", "$3x$", "$6x^2$", "$5x$"],
                correct: 0,
                explanation: "$3 \\times \\frac{d}{dx}[x^2] = 3 \\times (2x) = 6x$.",
                hint: "Multiplica el exponente 2 por el coeficiente 3."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = 4x^3$?",
                options: ["$12x^2$", "$7x^2$", "$12x^3$", "$4x^2$"],
                correct: 0,
                explanation: "$4 \\times 3x^2 = 12x^2$.",
                hint: "$4 \\times 3 = 12$ y baja un grado a $x^2$."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = 8x$?",
                options: ["0", "8", "$8x^2$", "$8x$"],
                correct: 1,
                explanation: "Como la derivada de $x$ es 1, tenemos $8 \\times 1 = 8$.",
                hint: "La pendiente de una recta $8x$ es 8."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = -2x^4$?",
                options: ["$8x^3$", "$-8x^3$", "$-6x^3$", "$-8x^4$"],
                correct: 1,
                explanation: "$-2 \\times 4x^3 = -8x^3$.",
                hint: "$-2 \\times 4 = -8$."
            }
        ]
    },
    {
        id: 27,
        worldId: "world-6",
        title: "Derivando Polinomios",
        subtitle: "Regla de la suma y resta término a término",
        icon: "📜",
        theory: {
            title: "La Regla de la Suma",
            content: `
                <p>¡Para derivar un polinomio completo, simplemente derivas <strong>cada término por separado</strong> respetando sus signos!</p>
                <div class="theory-visual">
                    <span>$$\\frac{d}{dx}[f(x) \\pm g(x)] = f'(x) \\pm g'(x)$$</span>
                </div>
                <div class="theory-visual">
                    <span>$$f(x) = 4x^3 - 5x^2 + 7x - 9$$</span>
                    <span>$$f'(x) = 12x^2 - 10x + 7 + 0$$</span>
                </div>
                <p>¡Así de elegante y sistemático es el cálculo!</p>
            `
        },
        questions: [
            {
                prompt: "Deriva: $f(x) = x^2 + 5x + 6$",
                options: ["$2x + 5$", "$x + 5$", "$2x + 6$", "$2x^2 + 5$"],
                correct: 0,
                explanation: "Derivada de $x^2$ es $2x$, de $5x$ es $5$, de $6$ es $0$. Total: $2x + 5$.",
                hint: "Deriva término a término: $x^2 \\to 2x$, $5x \\to 5$, $6 \\to 0$."
            },
            {
                prompt: "Deriva: $f(x) = 3x^3 - 2x^2 + 4x - 10$",
                options: ["$9x^2 - 4x + 4$", "$6x^2 - 4x + 4$", "$9x^2 - 4x$", "$9x^3 - 4x^2 + 4$"],
                correct: 0,
                explanation: "$\\frac{d}{dx}[3x^3] = 9x^2$, $\\frac{d}{dx}[-2x^2] = -4x$, $\\frac{d}{dx}[4x] = 4$, $\\frac{d}{dx}[-10] = 0$.",
                hint: "$3(3)x^2 - 2(2)x + 4 - 0$."
            },
            {
                prompt: "Deriva: $f(x) = 5x^4 - 8x$",
                options: ["$20x^3 - 8$", "$20x^3 - 8x$", "$5x^3 - 8$", "$20x^4 - 8$"],
                correct: 0,
                explanation: "$5 \\times 4x^3 - 8 = 20x^3 - 8$.",
                hint: "Recuerda que la derivada de $8x$ es $8$."
            },
            {
                prompt: "Evalúa la derivada de $f(x) = x^2 + 3x$ en el punto $x = 2$ (es decir, $f'(2)$):",
                options: ["7", "10", "4", "5"],
                correct: 0,
                explanation: "Primero derivamos: $f'(x) = 2x + 3$. Luego evaluamos en 2: $f'(2) = 2(2) + 3 = 4 + 3 = 7$.",
                hint: "Primero obtén la derivada $2x + 3$, luego sustituye $x = 2$."
            },
            {
                prompt: "Deriva: $f(x) = -x^3 + 6x^2 - 1$",
                options: ["$-3x^2 + 12x$", "$3x^2 + 12x$", "$-3x^2 + 6x$", "$-3x^2 + 12x - 1$"],
                correct: 0,
                explanation: "$-3x^2 + 6(2)x - 0 = -3x^2 + 12x$.",
                hint: "La constante $-1$ se convierte en 0."
            }
        ]
    },
    {
        id: 28,
        worldId: "world-6",
        title: "El Círculo Trigonométrico",
        subtitle: "Derivadas de $\\sin(x)$ y $\\cos(x)$",
        icon: "🌊",
        theory: {
            title: "Derivadas Trigonométricas",
            content: `
                <p>Las funciones trigonométricas describen ondas, oscilaciones y rotaciones. ¡Sus derivadas tienen un ciclo fascinante!</p>
                <div class="theory-visual">
                    <span>$$\\frac{d}{dx}[\\sin(x)] = \\cos(x)$$</span>
                    <span>$$\\frac{d}{dx}[\\cos(x)] = -\\sin(x)$$</span>
                </div>
                <p>¡El seno se transforma en coseno, y el coseno en seno pero con signo negativo!</p>
                <div class="theory-tip">💡 Al derivar cuatro veces consecutivas $\\sin(x)$, ¡vuelves exactamente al inicio!</div>
            `
        },
        questions: [
            {
                prompt: "¿Cuál es la derivada de $f(x) = \\sin(x)$?",
                options: ["$\\cos(x)$", "$-\\cos(x)$", "$\\sin(x)$", "$-\\sin(x)$"],
                correct: 0,
                explanation: "La derivada de la función seno es el coseno positivo: $\\frac{d}{dx}[\\sin(x)] = \\cos(x)$.",
                hint: "Seno pasa a coseno positivo."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = \\cos(x)$?",
                options: ["$\\sin(x)$", "$-\\sin(x)$", "$\\cos(x)$", "$-\\cos(x)$"],
                correct: 1,
                explanation: "La derivada de coseno incluye un signo negativo: $\\frac{d}{dx}[\\cos(x)] = -\\sin(x)$.",
                hint: "Coseno genera un signo negativo."
            },
            {
                prompt: "Deriva: $f(x) = 3\\sin(x) + 4x$",
                options: ["$3\\cos(x) + 4$", "$-3\\cos(x) + 4$", "$3\\sin(x) + 4$", "$3\\cos(x)$"],
                correct: 0,
                explanation: "$3 \\cdot \\frac{d}{dx}[\\sin(x)] + \\frac{d}{dx}[4x] = 3\\cos(x) + 4$.",
                hint: "Aplica la regla de la suma término a término."
            },
            {
                prompt: "¿Cuál es la segunda derivada de $\\sin(x)$ (derivar dos veces seguidas)?",
                options: ["$\\sin(x)$", "$-\\sin(x)$", "$\\cos(x)$", "$-\\cos(x)$"],
                correct: 1,
                explanation: "Primera derivada: $\\cos(x)$. Segunda derivada: $\\frac{d}{dx}[\\cos(x)] = -\\sin(x)$.",
                hint: "Deriva $\\sin(x) \\to \\cos(x)$, y luego deriva $\\cos(x)$."
            },
            {
                prompt: "Deriva: $f(x) = 5\\cos(x) - x^2$",
                options: ["$-5\\sin(x) - 2x$", "$5\\sin(x) - 2x$", "$-5\\sin(x) + 2x$", "$-5\\cos(x) - 2x$"],
                correct: 0,
                explanation: "$5(-\\sin(x)) - 2x = -5\\sin(x) - 2x$.",
                hint: "Recuerda que la derivada de $\\cos(x)$ lleva signo negativo."
            }
        ]
    },
    {
        id: 29,
        worldId: "world-6",
        title: "Regla del Producto y Cadena",
        subtitle: "Derivando funciones compuestas y multiplicadas",
        icon: "🔗",
        theory: {
            title: "Regla de la Cadena y del Producto",
            content: `
                <p><strong>1. Regla de la Cadena (funciones dentro de funciones):</strong> Deriva lo de afuera dejando lo de adentro igual, y <em>multiplica por la derivada de lo de adentro</em>:</p>
                <div class="theory-visual">
                    <span>$$\\frac{d}{dx}[(g(x))^n] = n(g(x))^{n-1} \\cdot g'(x)$$</span>
                    <span>Ejemplo: $\\frac{d}{dx}[(2x + 1)^3] = 3(2x + 1)^2 \\cdot (2) = 6(2x + 1)^2$</span>
                </div>
                <p><strong>2. Regla del Producto:</strong> $(u \\cdot v)' = u'v + uv'$.</p>
            `
        },
        questions: [
            {
                prompt: "Aplica la regla de la cadena para derivar: $f(x) = (3x + 2)^2$",
                options: ["$2(3x + 2) \\cdot 3 = 6(3x + 2)$", "$2(3x + 2)$", "$6x + 4$", "$9(3x + 2)$"],
                correct: 0,
                explanation: "Derivada exterior: $2(3x + 2)$. Derivada interior de $(3x + 2)$ es $3$. Multiplicando: $6(3x + 2)$.",
                hint: "No olvides multiplicar por la derivada de lo de adentro (3)."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = \\sin(2x)$ usando la regla de la cadena?",
                options: ["$\\cos(2x)$", "$2\\cos(2x)$", "$-2\\cos(2x)$", "$2\\sin(2x)$"],
                correct: 1,
                explanation: "Derivada de seno es coseno: $\\cos(2x)$, multiplicado por la derivada interna de $2x$ que es $2$: $2\\cos(2x)$.",
                hint: "Derivada de $\\sin(u)$ es $\\cos(u) \\cdot u'$."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = (x^2 + 5)^3$?",
                options: ["$3(x^2 + 5)^2 \\cdot 2x = 6x(x^2 + 5)^2$", "$3(x^2 + 5)^2$", "$6(x^2 + 5)^2$", "$3x(x^2 + 5)^2$"],
                correct: 0,
                explanation: "Regla de la cadena: $3(x^2 + 5)^2$ por la derivada interna de $x^2 + 5$ que es $2x$. Resultado: $6x(x^2 + 5)^2$.",
                hint: "Baja el 3, exponente 2, y multiplica por la derivada de $x^2 + 5$ que es $2x$."
            },
            {
                prompt: "Si aplicamos la regla del producto a $f(x) = x \\cdot \\sin(x)$, ¿cuál es su derivada?",
                options: ["$\\sin(x) + x\\cos(x)$", "$x\\cos(x)$", "$\\cos(x)$", "$1 \\cdot \\cos(x)$"],
                correct: 0,
                explanation: "$(u \\cdot v)' = u'v + uv' = (1)\\sin(x) + x(\\cos(x)) = \\sin(x) + x\\cos(x)$.",
                hint: "Derivada del primero por el segundo más el primero por la derivada del segundo."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = \\cos(5x)$?",
                options: ["$-5\\sin(5x)$", "$5\\sin(5x)$", "$-\\sin(5x)$", "$-5\\cos(5x)$"],
                correct: 0,
                explanation: "Derivada de $\\cos(u)$ es $-\\sin(u) \\cdot u'$, por tanto $-\\sin(5x) \\cdot 5 = -5\\sin(5x)$.",
                hint: "Recuerda el signo menos del coseno y la derivada interna de $5x$."
            }
        ]
    },
    {
        id: 30,
        worldId: "world-6",
        title: "El Arquitecto del Infinito (Jefe Final)",
        subtitle: "¡Gran Desafío Final: El Supremo del Cálculo!",
        icon: "👑",
        isBoss: true,
        boss: {
            id: "arquitecto_infinito",
            name: "El Arquitecto del Infinito",
            title: "Supremo Maestro del Cálculo Diferencial",
            avatar: "👑🌌",
            maxHp: 10.0,
            regenRate: 0.22,
            baseDamage: 1.5,
            streakBonus: 0.8,
            mechanicType: "calculus",
            mechanicTitle: "Distorsión Temporal y Derivadas",
            mechanicDesc: "Recupera +0.22 HP/s. Aplica todas las reglas de derivación para vencerlo antes del colapso.",
            dialogue: {
                intro: "El límite de tu comprensión matemática termina aquí...",
                hit: "¡La derivada de mi poder es negativa!",
                defeat: "¡Eres el verdadero Archimago del Cálculo y de los Números!"
            }
        },
        theory: {
            title: "La Gran Prueba del Conocimiento",
            content: `
                <p>¡Has recorrido todo el camino! Desde contar estrellas en la Isla de los Números hasta dominar la tasa de cambio instantáneo en el Nexo del Cálculo.</p>
                <p>El Arquitecto del Infinito evaluará tu maestría completa para otorgarte el título supremo de <strong>Archimago del Cálculo y de los Números</strong>.</p>
                <div class="theory-tip">🌌 <strong>Mecánica Final:</strong> El Arquitecto regenera <strong>+0.22 HP/s</strong>. ¡Encadena derivadas perfectas con racha de fuego para salvar el cosmos matemático!</div>
            `
        },
        questions: [
            {
                prompt: "Calcula la derivada de $f(x) = 5x^3 - 4x^2 + 9x - 12$:",
                options: ["$15x^2 - 8x + 9$", "$15x^3 - 8x^2 + 9$", "$15x^2 - 8x$", "$10x^2 - 4x + 9$"],
                correct: 0,
                explanation: "$\\frac{d}{dx}[5x^3] = 15x^2$, $\\frac{d}{dx}[-4x^2] = -8x$, $\\frac{d}{dx}[9x] = 9$, $\\frac{d}{dx}[-12] = 0$.",
                hint: "Aplica la regla de la potencia a cada término."
            },
            {
                prompt: "Encuentra la pendiente de la recta tangente a $f(x) = x^2 - 3x$ en el punto $x = 4$:",
                options: ["5", "8", "4", "2"],
                correct: 0,
                explanation: "Derivada: $f'(x) = 2x - 3$. Evaluando en $x = 4$: $f'(4) = 2(4) - 3 = 8 - 3 = 5$.",
                hint: "Deriva ($2x - 3$) y sustituye $x = 4$."
            },
            {
                prompt: "¿En qué punto la curva $f(x) = x^2 - 6x + 8$ tiene recta tangente horizontal ($f'(x) = 0$)?",
                options: ["$x = 3$", "$x = 6$", "$x = 0$", "$x = -3$"],
                correct: 0,
                explanation: "$f'(x) = 2x - 6$. Igualando a cero: $2x - 6 = 0 \\implies 2x = 6 \\implies x = 3$.",
                hint: "Deriva a $2x - 6$ e iguálalo a 0."
            },
            {
                prompt: "Si la posición de una nave espacial está dada por $s(t) = t^3 + 2t$, ¿cuál es su velocidad en el tiempo $t = 2$?",
                options: ["14 m/s", "12 m/s", "10 m/s", "16 m/s"],
                correct: 0,
                explanation: "La velocidad es la derivada de la posición: $v(t) = s'(t) = 3t^2 + 2$. Para $t = 2$: $v(2) = 3(2^2) + 2 = 3(4) + 2 = 14$.",
                hint: "La velocidad es la derivada $v(t) = 3t^2 + 2$. Evalúa en $t = 2$."
            },
            {
                prompt: "¿Cuál es la derivada de $f(x) = 4\\sin(x) - 2x^3$?",
                options: ["$4\\cos(x) - 6x^2$", "$-4\\cos(x) - 6x^2$", "$4\\cos(x) - 2x^2$", "$4\\sin(x) - 6x^2$"],
                correct: 0,
                explanation: "$4\\frac{d}{dx}[\\sin(x)] - 2(3x^2) = 4\\cos(x) - 6x^2$.",
                hint: "Derivada de seno es coseno, y $2 \\times 3 = 6$."
            }
        ]
    }
];

// Helper functions for levels
function getWorldById(worldId) {
    return WORLDS_DATA.find(w => w.id === worldId);
}

function getLevelById(levelId) {
    return LEVELS_DATA.find(l => l.id === Number(levelId));
}

function getLevelsByWorld(worldId) {
    return LEVELS_DATA.filter(l => l.worldId === worldId);
}

// Export globally for browser & module compatibility
if (typeof window !== 'undefined') {
    window.WORLDS_DATA = WORLDS_DATA;
    window.LEVELS_DATA = LEVELS_DATA;
    window.getWorldById = getWorldById;
    window.getLevelById = getLevelById;
    window.getLevelsByWorld = getLevelsByWorld;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WORLDS_DATA, LEVELS_DATA, getWorldById, getLevelById, getLevelsByWorld };
}


