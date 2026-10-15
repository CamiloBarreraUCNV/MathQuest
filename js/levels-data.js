// MathQuest: Base de datos de Mundos, Niveles, Teoría y Preguntas
var WORLDS_DATA = [
    {
        id: "world-1",
        num: 1,
        title: "Isla de los Números",
        subtitle: "Aprende las bases fundamentales del conteo y comparación",
        color: "#10b981",
        bgGradient: "linear-gradient(135deg, #059669, #10b981)",
        icon: "🌱",
        description: "El punto de partida de todo gran matemático: comprender el valor, el orden y los patrones de los números."
    },
    {
        id: "world-2",
        num: 2,
        title: "Valle Aritmético",
        subtitle: "Domina las sumas, restas y descubre los números negativos",
        color: "#0284c7",
        bgGradient: "linear-gradient(135deg, #0369a1, #0ea5e9)",
        icon: "🌊",
        description: "Aprende a combinar cantidades, calcular diferencias y adentrarte en el mundo bajo cero."
    },
    {
        id: "world-3",
        num: 3,
        title: "Cañón de Factores",
        subtitle: "Multiplicación, división y el orden sagrado de operaciones",
        color: "#f59e0b",
        bgGradient: "linear-gradient(135deg, #d97706, #f59e0b)",
        icon: "⚡",
        description: "Acelera tus cálculos con sumas repetidas, repartos exactos y la jerarquía matemática."
    },
    {
        id: "world-4",
        num: 4,
        title: "Bosque del Álgebra",
        subtitle: "Despeja las incógnitas y descifra el lenguaje de los símbolos",
        color: "#8b5cf6",
        bgGradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
        icon: "🔮",
        description: "Descubre el misterio de la variable x, resuelve ecuaciones lineales y desbloquea el poder de las potencias."
    },
    {
        id: "world-5",
        num: 5,
        title: "Pico de las Funciones",
        subtitle: "Conecta entradas con salidas, pendientes y razones de cambio",
        color: "#06b6d4",
        bgGradient: "linear-gradient(135deg, #0891b2, #06b6d4)",
        icon: "🏔️",
        description: "Explora la máquina de transformar números f(x), gráficas en el plano cartesiano y la inclinación de las rectas."
    },
    {
        id: "world-6",
        num: 6,
        title: "Nexo del Cálculo",
        subtitle: "La cumbre matemática: La recta tangente y las reglas de derivación",
        color: "#ec4899",
        bgGradient: "linear-gradient(135deg, #db2777, #f43f5e)",
        icon: "🌌",
        description: "El poder de medir el cambio instantáneo. Domina la regla de la potencia, constantes, polinomios y funciones trigonométricas."
    }
];

var LEVELS_DATA = [
    // ==========================================
    // MUNDO 1: ISLA DE LOS NÚMEROS (NIVELES 1 - 4)
    // ==========================================
    {
        id: 1,
        worldId: "world-1",
        title: "Conteo y Cantidades",
        subtitle: "¡Enfrenta a la Manzana Pirata y domina los números!",
        icon: "🔢",
        hasEnemy: true,
        enemy: {
            id: "manzana_pirata",
            name: "Manzana Pirata",
            title: "Pirata de la Bahía Numérica",
            avatar: "🍎🏴‍☠️",
            avatarDefeated: "😵🏴‍☠️",
            avatarImg: "assets/pirate-apple-80s.png",
            badge: "PIRATA",
            badgeClass: "pirate",
            maxHp: 20.0,
            regenRate: 0,
            baseDamage: 1.0,
            streakBonus: 0.5,
            mechanicType: "slap",
            mechanicTitle: "¡Duelo de Cachetadas!",
            mechanicDesc: "✋ ¡Cada acierto le propina una buena cachetada!",
            dialogue: {
                intro: "¡Arrr! ¡Nadie cuenta más rápido que este corsario!",
                hit: "¡Rayos y centellas! ¡Menuda bofetada!",
                defeat: "¡Me rindo, marinero de los números!"
            }
        },
        theory: {
            title: "¡Aprendiendo a Contar!",
            content: `
                <p>¡Bienvenido a la aventura de los números! 🎈</p>
                <p>Los <strong>números</strong> nos sirven para contar cuántas cosas tenemos en el mundo real, como juguetes, frutas o animalitos.</p>
                <div class="theory-visual">
                    <span>🍎 🍎 🍎 = <strong>3 manzanas</strong></span>
                    <span>⭐ ⭐ ⭐ ⭐ ⭐ = <strong>5 estrellas</strong></span>
                </div>
                <p>¡Contar es como subir una escalera, paso a pasito sumando 1! Cada número es una unidad más grande que el anterior.</p>
            `
        },
        questions: [
            {
                prompt: "¿Cuántas manzanas tiene el pirata? 🍎 🍎 🍎",
                options: ["2", "3", "4", "5"],
                correct: 1,
                explanation: "¡Eso es! Contamos juntos: una, dos y tres manzanas (3).",
                hint: "Cuenta las manzanas con tu dedito una por una."
            },
            {
                prompt: "¿Cuántas estrellas brillantes ves aquí? ⭐ ⭐ ⭐ ⭐ ⭐",
                options: ["4", "5", "6", "7"],
                correct: 1,
                explanation: "¡Muy bien! Hay exactamente 5 estrellas brillantes.",
                hint: "Cuenta despacio: 1, 2, 3, 4 y..."
            },
            {
                prompt: "Cuando contamos: 1, 2, 3... ¿qué número viene después del 3?",
                options: ["2", "4", "5", "6"],
                correct: 1,
                explanation: "¡Correcto! Después del 3 viene el número 4.",
                hint: "Di los números en voz alta: 1, 2, 3..."
            },
            {
                prompt: "Si tienes 2 autitos de juguete 🚗 🚗 y te regalan 1 más 🚗, ¿cuántos tienes ahora?",
                options: ["2", "3", "4", "5"],
                correct: 1,
                explanation: "¡Genial! 2 autitos más 1 autito son 3 autitos en total.",
                hint: "Junta los autitos: 2 + 1 = ?"
            },
            {
                prompt: "¿Cuántos dedos tienes en una sola mano? 🖐️",
                options: ["4", "5", "6", "10"],
                correct: 1,
                explanation: "¡Exacto! En una mano tenemos 5 dedos.",
                hint: "Cuenta los deditos de tu mano."
            },
            {
                prompt: "¿Cuántos dedos tienes en tus dos manos juntas? 🖐️ 🖐️",
                options: ["5", "8", "10", "12"],
                correct: 2,
                explanation: "¡Muy bien! 5 dedos en una mano más 5 en la otra suman 10 dedos.",
                hint: "5 en una mano y 5 en la otra: 5 + 5 = 10."
            },
            {
                prompt: "¿Qué número va justo ANTES del 6 cuando contamos hacia atrás?",
                options: ["4", "5", "7", "8"],
                correct: 1,
                explanation: "¡Excelente! Antes del 6 está el número 5.",
                hint: "Piensa: ¿qué número dices justo antes de llegar al 6?"
            },
            {
                prompt: "¿Cuántos patitos nadan en el agua? 🦆 🦆 🦆 🦆",
                options: ["3", "4", "5", "6"],
                correct: 1,
                explanation: "¡Cuac, cuac! Hay 4 patitos nadando felices.",
                hint: "Cuenta cada patito: 1, 2, 3..."
            },
            {
                prompt: "¿Cuál de estos números es el más pequeñito?",
                options: ["8", "2", "6", "9"],
                correct: 1,
                explanation: "¡Bien pensado! El 2 es el número más chiquito de todos estos.",
                hint: "¿Cuál aparece primero cuando empezamos a contar desde el 1?"
            },
            {
                prompt: "Tienes 4 galletas ricas 🍪 y te comes 1. ¿Cuántas galletas te quedan?",
                options: ["2", "3", "4", "5"],
                correct: 1,
                explanation: "¡Rico y correcto! Si a 4 galletas le quitas 1, te quedan 3.",
                hint: "Si tienes 4 y te comes una: 4 menos 1."
            },
            {
                prompt: "¿Cuántos corazones hay en este dibujo? ❤️ ❤️ ❤️ ❤️ ❤️ ❤️",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "¡Perfecto! Hay 6 corazones llenos de cariño.",
                hint: "Cuenta de izquierda a derecha despacito."
            },
            {
                prompt: "¿Qué número falta en el medio?: 6, ___, 8",
                options: ["5", "7", "9", "10"],
                correct: 1,
                explanation: "¡Eso es! El número que va entre el 6 y el 8 es el 7.",
                hint: "Cuenta: 6, luego sigue... y después el 8."
            },
            {
                prompt: "¿Cuántas ruedas tiene una bicicleta normal? 🚲",
                options: ["1", "2", "3", "4"],
                correct: 1,
                explanation: "¡Bip bip! Una bicicleta tiene 2 ruedas, una adelante y otra atrás.",
                hint: "Una rueda adelante y otra atrás."
            },
            {
                prompt: "El pirata encontró 5 monedas de oro 🪙 y luego halló 2 más. ¿Cuántas tiene ahora?",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "¡Arrr, tesoro encontrado! 5 + 2 = 7 monedas de oro.",
                hint: "Empieza en 5 y cuenta dos más: 6, 7."
            },
            {
                prompt: "¿Cuántos globos de fiesta ves aquí? 🎈 🎈 🎈 🎈 🎈 🎈 🎈",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "¡Fiesta total! Hay 7 globos flotando.",
                hint: "Cuenta los globos uno por uno con tu dedo."
            },
            {
                prompt: "Si tu plato está completamente vacío, ¿cuántas manzanas tienes?",
                options: ["0 manzanas", "1 manzana", "5 manzanas", "10 manzanas"],
                correct: 0,
                explanation: "¡Exacto! Cuando no hay nada, el número es el cero (0).",
                hint: "El número que representa 'nada' o 'vacío' es el 0."
            },
            {
                prompt: "¿Qué número viene inmediatamente después del 9?",
                options: ["8", "10", "11", "12"],
                correct: 1,
                explanation: "¡Viva! Al llegar a 9 y sumar 1 llegamos al 10.",
                hint: "Es el número de dedos que tienes en las dos manos."
            },
            {
                prompt: "¿Cuántos gatitos juguetones están aquí? 🐱 🐱 🐱 🐱 🐱 🐱 🐱 🐱",
                options: ["7", "8", "9", "10"],
                correct: 1,
                explanation: "¡Miau! Contamos y son exactamente 8 lindos gatitos.",
                hint: "Hay 4 arriba imaginarios y 4 abajo: 4 + 4 = 8."
            },
            {
                prompt: "Tienes 6 caramelos 🍬 y le regalas 2 a tu mejor amigo. ¿Cuántos caramelos te quedan?",
                options: ["3", "4", "5", "6"],
                correct: 1,
                explanation: "¡Gran amigo! Si a 6 le quitas 2, te quedan 4 caramelos.",
                hint: "Cuenta hacia atrás dos pasos desde el 6: 5, 4."
            },
            {
                prompt: "¿Cuántos pedazos de pizza deliciosos hay? 🍕 🍕 🍕 🍕 🍕 🍕 🍕 🍕 🍕",
                options: ["8", "9", "10", "11"],
                correct: 1,
                explanation: "¡Ñam ñam! Hay 9 rebanadas de pizza.",
                hint: "Casi son 10, pero falta una rebanadita: son 9."
            }
        ]
    },
    {
        id: 2,
        worldId: "world-1",
        title: "Mayor, Menor e Igual",
        subtitle: "¡Desafía al Capitán Manzana y compara magnitudes!",
        icon: "⚖️",
        hasEnemy: true,
        enemy: {
            id: "capitan_manzana",
            name: "Capitán Manzana",
            title: "Comandante del Galeón Mayor y Menor",
            avatar: "🍎⚔️",
            avatarDefeated: "😵⚔️",
            avatarImg: "assets/pirate-apple-captain-80s.png",
            badge: "CAPITÁN",
            badgeClass: "captain",
            maxHp: 20.0,
            regenRate: 0,
            baseDamage: 1.0,
            streakBonus: 0.5,
            mechanicType: "slap",
            mechanicTitle: "¡Duelo de Cachetadas!",
            mechanicDesc: "✋ ¡Cada acierto le propina una bofetada al Capitán!",
            dialogue: {
                intro: "¡Por las barbas de Neptuno! ¡Nadie surca mis aguas sin dominar las comparaciones!",
                hit: "¡Rayos y centellas! ¡Esa bofetada fue MAYOR que mi paciencia!",
                defeat: "¡Mis velas han caído! ¡Has demostrado ser el amo de las magnitudes!"
            }
        },
        theory: {
            title: "¡El Cocodrilo Comilón! (> y <)",
            content: `
                <p>¿Quién tiene más y quién tiene menos? ¡Te presentamos al <strong>cocodrilo comilón</strong> 🐊!</p>
                <ul>
                    <li><strong>> (Mayor que):</strong> La boca abierta del cocodrilo siempre apunta hacia el número más grande porque tiene mucha hambre. Ejemplo: $7 > 2$.</li>
                    <li><strong>< (Menor que):</strong> La colita o punta cerrada apunta hacia el número más chiquitito. Ejemplo: $3 < 8$.</li>
                    <li><strong>= (Igual a):</strong> Ambas partes tienen exactamente la misma cantidad. Ejemplo: $4 = 4$.</li>
                </ul>
                <div class="theory-tip">💡 <em>Truco:</em> ¡El cocodrilo siempre abre su bocaza hacia donde hay más comida!</div>
            `
        },
        questions: [
            {
                prompt: "¿Cuál número es el MÁS GRANDE (mayor)?",
                options: ["3", "9", "5", "2"],
                correct: 1,
                explanation: "¡Eso es! El 9 es el número más grande de todos.",
                hint: "Imagina que son caramelos: ¿con cuál número comes más?"
            },
            {
                prompt: "¿Cuál número es el MÁS PEQUEÑO (menor)?",
                options: ["7", "1", "4", "8"],
                correct: 1,
                explanation: "¡Muy bien! El 1 es el número más chiquitito aquí.",
                hint: "¿Cuál es el primer número que decimos al contar?"
            },
            {
                prompt: "Al cocodrilo comilón le gusta comerse siempre al número más grande. Entre 4 y 7, ¿a cuál se comerá? 🐊",
                options: ["Al 7", "Al 4", "A ninguno", "A los dos"],
                correct: 0,
                explanation: "¡Ñam! El cocodrilo abre su bocaza hacia el 7 porque 7 es mayor que 4.",
                hint: "¿Cuál número es más grande: 4 o 7?"
            },
            {
                prompt: "Si en tu canasta tienes 5 manzanas 🍎 y tu amigo tiene 5 manzanas 🍎, ¿cómo son las canastas?",
                options: ["Tienen igual cantidad (=)", "La tuya tiene más (>)", "La tuya tiene menos (<)", "Están vacías"],
                correct: 0,
                explanation: "¡Exacto! Los dos tienen 5 manzanas, así que son iguales ($5 = 5$).",
                hint: "Los dos números son el mismo: 5 y 5."
            },
            {
                prompt: "¿Cuál de estos números es MAYOR que 10?",
                options: ["6", "8", "14", "9"],
                correct: 2,
                explanation: "¡Súper! El 14 es más grande que el 10.",
                hint: "Cuenta después del 10: 11, 12, 13..."
            },
            {
                prompt: "¿Cuál de estos números es MENOR que 5?",
                options: ["2", "6", "7", "9"],
                correct: 0,
                explanation: "¡Correcto! El 2 es más pequeño que el 5.",
                hint: "Busca un número que venga antes del 5."
            },
            {
                prompt: "¿Qué signo ponemos para decir que 8 es mayor que 3?: 8 ___ 3",
                options: [">", "<", "=", "+"],
                correct: 0,
                explanation: "¡Bravo! Ponemos > con la boca abierta hacia el 8 ($8 > 3$).",
                hint: "Abre la boca del cocodrilo hacia el 8: >."
            },
            {
                prompt: "¿Qué signo ponemos para decir que 2 es menor que 6?: 2 ___ 6",
                options: ["<", ">", "=", "-"],
                correct: 0,
                explanation: "¡Eso es! La puntita apunta al 2 porque es el más chiquito ($2 < 6$).",
                hint: "La boca abierta apunta al 6: <."
            },
            {
                prompt: "En una rama hay 4 pajaritos 🐦 y en otra hay 7 pajaritos 🐦. ¿En qué rama hay MÁS pajaritos?",
                options: ["En la de 7", "En la de 4", "Hay igual en las dos", "En ninguna"],
                correct: 0,
                explanation: "¡Muy bien! 7 es más que 4, así que en la rama de 7 hay más pajaritos.",
                hint: "7 pajaritos son más que 4."
            },
            {
                prompt: "¿Cuál de estas listas está ordenada del más chiquito al más grande?",
                options: ["2, 5, 9", "9, 5, 2", "5, 2, 9", "9, 2, 5"],
                correct: 0,
                explanation: "¡Perfecto! 2 es el más chico, luego 5 y al final el 9.",
                hint: "Empieza por el número más pequeñito."
            },
            {
                prompt: "El Capitán Pirata tiene 8 cofres 🪙 y tú tienes 12 cofres 🪙. ¿Quién tiene MÁS cofres?",
                options: ["Tú (12 cofres)", "El Capitán (8 cofres)", "Tienen igual", "Nadie"],
                correct: 0,
                explanation: "¡Ganaste tú! 12 cofres es una cantidad mayor que 8 cofres.",
                hint: "12 es más grande que 8."
            },
            {
                prompt: "Si tienes 4 lápices y compras 1 más, tienes 5. ¿Cómo es comparado con 5? (4 + 1 ___ 5)",
                options: ["=", ">", "<", "x"],
                correct: 0,
                explanation: "¡Exacto! $4 + 1 = 5$, así que ambos lados son iguales: $5 = 5$.",
                hint: "Suma 4 + 1 y compara con 5."
            },
            {
                prompt: "¿Qué número es más chiquito que el 8 pero más grande que el 5?",
                options: ["3", "6", "9", "10"],
                correct: 1,
                explanation: "¡Genial! El 6 está justo entre el 5 y el 8.",
                hint: "Cuenta: 5, luego viene el... y después 7, 8."
            },
            {
                prompt: "¿Dónde hay MENOS frutas?: 🍌 🍌 o 🍌 🍌 🍌 🍌",
                options: ["Donde hay 2 plátanos", "Donde hay 4 plátanos", "Tienen igual", "No hay plátanos"],
                correct: 0,
                explanation: "¡Correcto! 2 plátanos es una cantidad menor que 4 plátanos.",
                hint: "¿Dónde ves menos cantidad con tus ojos?"
            },
            {
                prompt: "¿Cuál de estos números es el más grande de todos?",
                options: ["11", "15", "19", "13"],
                correct: 2,
                explanation: "¡Excelente! El 19 es el campeón, es el mayor de la lista.",
                hint: "Es el número que está más cerca del 20."
            },
            {
                prompt: "Si tienes 7 años y tu prima tiene 7 años, ¿quién es mayor?",
                options: ["Tienen la misma edad (=)", "Tú eres mayor", "Tu prima es mayor", "Ninguno"],
                correct: 0,
                explanation: "¡Son del mismo año! Los dos tienen 7, por eso tienen la misma edad.",
                hint: "7 y 7 son exactamente iguales."
            },
            {
                prompt: "¿Qué número hace que esto sea verdad: 3 es menor que ___?",
                options: ["1", "2", "8", "0"],
                correct: 2,
                explanation: "¡Bien hecho! El 3 es menor que el 8 ($3 < 8$).",
                hint: "Busca un número que sea más grande que 3."
            },
            {
                prompt: "Compara una bolsa con 15 dulces y otra con 20 dulces. ¿Qué bolsa tiene MÁS dulces?",
                options: ["La bolsa con 20", "La bolsa con 15", "Tienen igual", "Ninguna"],
                correct: 0,
                explanation: "¡Qué rico! La bolsa con 20 dulces tiene más que la de 15.",
                hint: "20 es un número mayor que 15."
            },
            {
                prompt: "¿Qué signo completa la comparación: 10 ___ 10?",
                options: ["=", ">", "<", "-"],
                correct: 0,
                explanation: "¡Eso es! Como son el mismo número, usamos el signo igual ($10 = 10$).",
                hint: "El signo de dos rayitas acostadas: =."
            },
            {
                prompt: "Si ordenas tus juguetes del MÁS CHICO al MÁS GRANDE, ¿cuál pones primero? (Juguetes: 8, 3, 6)",
                options: ["El 3", "El 6", "El 8", "Cualquiera"],
                correct: 0,
                explanation: "¡Perfecto! El 3 es el más chiquito, así que va al principio de la fila.",
                hint: "¿Cuál es el número menor entre 3, 6 y 8?"
            }
        ]
    },
    {
        id: 3,
        worldId: "world-1",
        title: "Pares, Impares y Recta",
        subtitle: "¡Desafía a la Manzana Comandante con pares, impares y posiciones!",
        icon: "📏",
        hasEnemy: true,
        enemy: {
            id: "manzana_comandante",
            name: "Manzana Comandante",
            title: "Comandante de la Guardia del Manzano",
            avatar: "🍎🎖️",
            avatarDefeated: "😵🎖️",
            avatarImg: "assets/pirate-apple-commander-80s.png",
            badge: "COMANDANTE",
            badgeClass: "pirate",
            maxHp: 30.0,
            regenRate: 0,
            baseDamage: 1.0,
            streakBonus: 0.5,
            mechanicType: "slap",
            mechanicTitle: "¡Rompe la formación!",
            mechanicDesc: "🎖️ ¡Acierta pares, impares y posiciones para romper su formación!",
            dialogue: {
                intro: "¡Tropa, formen parejas! ¡Nadie llegará al Manzano sin superar mis filas!",
                hit: "¡Mis filas! ¡Has roto la formación!",
                defeat: "¡Retirada! Has demostrado un dominio impecable de los números."
            }
        },
        theory: {
            title: "¡Pares, Impares y Saltos de Ranita!",
            content: `
                <p>¡Descubre el secreto de los números <strong>pares</strong> e <strong>impares</strong>!</p>
                <ul>
                    <li><strong>Números Pares:</strong> ¡Tienen amigos! Se pueden juntar de a 2 en 2 (como los zapatos 👟👟 o calcetines 🧦🧦) sin que sobre ninguno. Terminan en $0, 2, 4, 6, 8$.</li>
                    <li><strong>Números Impares:</strong> Al juntarlos de a 2, siempre queda uno solito sin pareja. Terminan en $1, 3, 5, 7, 9$.</li>
                </ul>
                <p>En el camino de números (la recta), dar un salto hacia adelante es sumar $+1$ y dar un paso hacia atrás es restar $-1$. 🐸</p>
            `
        },
        questions: [
            {
                prompt: "Los números PARES se pueden juntar de 2 en 2 sin que sobre ninguno (como los zapatos 👟👟). ¿Cuál de estos es PAR?",
                options: ["3", "4", "5", "7"],
                correct: 1,
                explanation: "¡Eso es! 4 se junta en 2 parejitas de 2 y no sobra nada.",
                hint: "Piensa en dos pares de zapatos: 2 y 2 hacen 4."
            },
            {
                prompt: "Si tienes 3 caramelos e intentas hacer parejas de 2, te sobra 1 solito. ¿El 3 es PAR o IMPAR?",
                options: ["Es IMPAR", "Es PAR", "Es los dos", "Ninguno"],
                correct: 0,
                explanation: "¡Muy bien! Como sobra 1 caramelo solito, el 3 es un número IMPAR.",
                hint: "Cuando sobra uno sin pareja, siempre es impar."
            },
            {
                prompt: "Una ranita 🐸 está en el número 2 y salta 1 paso hacia adelante. ¿A qué número llega?",
                options: ["1", "3", "4", "5"],
                correct: 1,
                explanation: "¡Boing! Estaba en el 2 y avanzó 1: $2 + 1 = 3$.",
                hint: "Suma 1 paso al 2: 2 más 1."
            },
            {
                prompt: "¿Cuántos guantes 🧤 forman un par completo de guantes?",
                options: ["1 guante", "2 guantes", "3 guantes", "4 guantes"],
                correct: 1,
                explanation: "¡Exacto! Un par siempre tiene 2 guantes, uno para cada mano.",
                hint: "¿Cuántas manos tienes para ponerte guantes?"
            },
            {
                prompt: "¿Cuál de estos números es IMPAR (siempre queda uno sin pareja)?",
                options: ["2", "4", "6", "7"],
                correct: 3,
                explanation: "¡Genial! 7 es impar porque hacemos 3 parejas y nos queda 1 solito.",
                hint: "Los números impares terminan en 1, 3, 5, 7 o 9."
            },
            {
                prompt: "En el camino de números: 1, 2, 3, 4, 5... ¿qué número está justo después del 5?",
                options: ["4", "6", "7", "3"],
                correct: 1,
                explanation: "¡Correcto! El número que sigue después del 5 es el 6.",
                hint: "Cuenta: 4, 5... y sigue el..."
            },
            {
                prompt: "En el camino de números, si estás en el 8 y das un paso hacia ATRÁS, ¿a qué número vas?",
                options: ["7", "9", "6", "10"],
                correct: 0,
                explanation: "¡Eso es! Al dar un paso atrás le quitamos 1 al 8: $8 - 1 = 7$.",
                hint: "¿Qué número dices antes de llegar al 8?"
            },
            {
                prompt: "Los números pares terminan en 0, 2, 4, 6 u 8. ¿Cuál de estos es un número PAR?",
                options: ["10", "11", "13", "15"],
                correct: 0,
                explanation: "¡Súper! El 10 termina en 0, por lo que es un número par.",
                hint: "10 se reparte en dos manos de 5 dedos cada una."
            },
            {
                prompt: "Tienes 5 cerezas 🍒🍒🍒🍒🍒. Si las juntas de a dos en dos, ¿cuántas cerezas quedan solitas sin pareja?",
                options: ["Ninguna", "1 cereza", "2 cerezas", "3 cerezas"],
                correct: 1,
                explanation: "¡Exacto! Haces 2 parejas (4 cerezas) y queda 1 cereza solita.",
                hint: "2 + 2 = 4, y para llegar a 5 falta..."
            },
            {
                prompt: "La ranita 🐸 está parada en el 4 y da 2 saltos hacia adelante. ¿En qué número cae?",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "¡Gran salto! $4 + 2 = 6$. Aterrizó en el número 6.",
                hint: "Cuenta dos pasos después del 4: 5, 6."
            },
            {
                prompt: "¿Cuál de estos números es PAR?",
                options: ["1", "5", "8", "9"],
                correct: 2,
                explanation: "¡Bien pensado! El 8 es par porque $4 + 4 = 8$ parejas exactas.",
                hint: "El 8 se puede repartir entre dos personas de forma igual."
            },
            {
                prompt: "Si tienes 6 calcetines 🧦, ¿cuántos pares de calcetines completos puedes armar?",
                options: ["2 pares", "3 pares", "4 pares", "6 pares"],
                correct: 1,
                explanation: "¡Qué ordenado! 6 calcetines forman 3 pares de 2 calcetines cada uno.",
                hint: "Cuenta de 2 en 2: 2, 4, 6... son 3 pares."
            },
            {
                prompt: "¿Cuál de estos números es IMPAR?",
                options: ["2", "6", "9", "12"],
                correct: 2,
                explanation: "¡Perfecto! El 9 es impar porque no se puede dividir en dos partes iguales.",
                hint: "Termina en 9, cifra impar."
            },
            {
                prompt: "Si cuentas de dos en dos como un canguro: 2, 4, 6... ¿qué número viene ahora? 🦘",
                options: ["7", "8", "9", "10"],
                correct: 1,
                explanation: "¡Boing boing! Sumando 2 al 6 llegamos al 8.",
                hint: "Suma 2 al 6: 6 + 2 = ?"
            },
            {
                prompt: "¿Qué número está justo en el MEDIO entre el 2 y el 4?",
                options: ["1", "3", "5", "6"],
                correct: 1,
                explanation: "¡Eso es! El número del medio es el 3 (2, 3, 4).",
                hint: "Cuenta: 2, ___, 4."
            },
            {
                prompt: "El número 1 está solito y no tiene pareja. ¿Es par o impar?",
                options: ["Es IMPAR", "Es PAR", "Es mágico", "Ninguno"],
                correct: 0,
                explanation: "¡Exacto! El 1 es el primer número impar porque no tiene compañero.",
                hint: "Para ser par necesita al menos 2."
            },
            {
                prompt: "Un conejito 🐰 está en el 0 y da 3 saltos de 2 números cada uno (0 -> 2 -> 4...). ¿A dónde llega?",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "¡Buen salto, conejito! 2, 4 y luego 6. Llega al número 6.",
                hint: "Cuenta de dos en dos tres veces: 2, 4, 6."
            },
            {
                prompt: "¿Cuál de estas opciones tiene SOLO números pares?",
                options: ["2, 4, 6", "1, 3, 5", "2, 3, 4", "1, 2, 3"],
                correct: 0,
                explanation: "¡Excelente! 2, 4 y 6 son todos números pares.",
                hint: "Ninguno de ellos debe ser impar."
            },
            {
                prompt: "¿Cuál es el número par que viene justo después del 8?",
                options: ["9", "10", "11", "12"],
                correct: 1,
                explanation: "¡Viva! El 9 es impar, así que el siguiente par es el 10.",
                hint: "El 9 es impar, súmale otro pasito."
            },
            {
                prompt: "Si tienes 7 galletas 🍪, ¿puedes repartirlas entre 2 amigos para que tengan exactamente lo mismo sin romper ninguna?",
                options: ["No, porque 7 es impar y sobra 1", "Sí, a cada uno le tocan 4", "Sí, porque 7 es par", "No tienen hambre"],
                correct: 0,
                explanation: "¡Muy inteligente! 7 es impar: a cada amigo le tocan 3 galletas y sobra 1 solita.",
                hint: "3 + 3 = 6, y sobra 1 para llegar a 7."
            }
        ]
    },
    {
        id: 4,
        worldId: "world-1",
        title: "El Manzano Ancestral (Jefe)",
        subtitle: "¡Batalla de Jefe: El Árbol de las Manzanas!",
        icon: "🌳",
        isBoss: true,
        boss: {
            id: "manzano_ancestral",
            name: "El Manzano Ancestral",
            title: "Guardián de la Isla de los Números",
            avatar: "🌳🍎",
            avatarDefeated: "🌳💫",
            badge: "JEFE",
            maxHp: 20.0,
            regenRate: 0.2, // recupera 0.2 HP cada segundo
            baseDamage: 1.0,
            streakBonus: 0.5,
            mechanicType: "regen",
            mechanicTitle: "Fotosíntesis Nutritiva",
            mechanicDesc: "Recupera +0.2 HP por segundo. Cada acierto inflige 1 daño (+0.5 por racha).",
            dialogue: {
                intro: "¡Mis manzanas crecen al compás del tiempo! ¿Podrás contar más rápido que mi cosecha?",
                hit: "¡Auuu! ¡Se han caído mis manzanas!",
                defeat: "¡Increíble rapidez de conteo! Te entrego la Gema de los Números."
            }
        },
        theory: {
            title: "⚔️ Batalla de Jefe: El Manzano Ancestral",
            content: `
                <p>¡Has llegado ante el gran <strong>Manzano Ancestral</strong> 🌳🍎!</p>
                <p>Para vencer a este jefe mágico, usa todo lo que aprendiste:</p>
                <ul>
                    <li>Contar manzanas y frutas muy rápido 🍎</li>
                    <li>Saber qué canasta es más grande con el cocodrilo ($>$ y $<$) 🐊</li>
                    <li>Elegir números pares e impares para hacer combos 🧦</li>
                </ul>
                <div class="theory-tip">
                    🍎 <strong>Mecánica del Jefe:</strong> ¡El árbol recupera vida cada segundo con sus frutos! Responde rápido y mantén la racha para darle fuertes golpes y derrotarlo.
                </div>
            `
        },
        questions: [
            {
                prompt: "El gran Manzano 🌳 tiene 3 manzanas rojas 🍎 y 3 manzanas verdes 🍏. ¿Cuántas manzanas tiene en total?",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "¡Eso es! 3 manzanas rojas más 3 verdes suman 6 manzanas ($3 + 3 = 6$).",
                hint: "Suma: 3 + 3 = ?"
            },
            {
                prompt: "Para lanzarle un ataque al árbol, elige la canasta que tiene un número PAR de manzanas:",
                options: ["Canasta con 5 🍎", "Canasta con 8 🍎", "Canasta con 7 🍎", "Canasta con 3 🍎"],
                correct: 1,
                explanation: "¡Zas! 8 es un número par porque se divide en 4 y 4 parejitas exactas.",
                hint: "Los números pares terminan en 0, 2, 4, 6 u 8."
            },
            {
                prompt: "Un pajarito 🐦 comelón se llevó 2 manzanas de una rama que tenía 6 🍎. ¿Cuántas manzanas quedaron en la rama?",
                options: ["3", "4", "5", "6"],
                correct: 1,
                explanation: "¡Pajarito travieso! Si a 6 le quitamos 2: $6 - 2 = 4$ manzanas.",
                hint: "Cuenta dos pasos hacia atrás desde el 6."
            },
            {
                prompt: "¿Cuál canasta tiene MÁS manzanas para ganar energía?",
                options: ["Canasta con 10 🍎", "Canasta con 8 🍎", "Canasta con 15 🍎", "Canasta con 6 🍎"],
                correct: 2,
                explanation: "¡Súper! 15 es el número más grande de todos.",
                hint: "15 es mayor que 10, 8 y 6."
            },
            {
                prompt: "El árbol sacude sus hojas y caen 5 manzanas 🍎. Si recoges 2, ¿cuántas manzanas quedan en el pasto?",
                options: ["2", "3", "4", "5"],
                correct: 1,
                explanation: "¡Buena recolecta! Si había 5 y recogiste 2, quedan 3 ($5 - 2 = 3$).",
                hint: "A 5 quítale 2 con tus deditos."
            },
            {
                prompt: "¿Cuál de estos números de manzanas es IMPAR (siempre sobra una al juntarlas de a dos)?",
                options: ["4 manzanas", "6 manzanas", "7 manzanas", "8 manzanas"],
                correct: 2,
                explanation: "¡Exacto! El 7 es impar porque hacemos 3 parejas y sobra 1 manzana solita.",
                hint: "Los impares terminan en 1, 3, 5, 7 o 9."
            },
            {
                prompt: "En la rama izquierda hay 5 manzanas y en la derecha hay 9 manzanas. ¿Qué rama tiene MENOS manzanas?",
                options: ["La de 5 manzanas", "La de 9 manzanas", "Tienen igual", "Ninguna"],
                correct: 0,
                explanation: "¡Bien visto! 5 es menor que 9, así que la rama de 5 tiene menos.",
                hint: "5 es más chiquito que 9."
            },
            {
                prompt: "El Manzano te regala 8 semillas mágicas 🌱. Si plantas 3 en la tierra, ¿cuántas semillas te quedan?",
                options: ["4", "5", "6", "7"],
                correct: 1,
                explanation: "¡Qué buen jardinero! $8 - 3 = 5$ semillas mágicas te quedan.",
                hint: "Resta 3 al número 8: 7, 6, 5."
            },
            {
                prompt: "Contando manzanas de una en una: 10, 11, 12... ¿qué número dices a continuación?",
                options: ["13", "14", "9", "15"],
                correct: 0,
                explanation: "¡Perfecto! Después del 12 viene el 13.",
                hint: "Suma 1 paso al 12."
            },
            {
                prompt: "¿Qué canasta tiene la cantidad más pequeñita de manzanas?",
                options: ["Canasta con 2 🍎", "Canasta con 7 🍎", "Canasta con 5 🍎", "Canasta con 9 🍎"],
                correct: 0,
                explanation: "¡Correcto! 2 manzanas es la cantidad menor.",
                hint: "El 2 es el número más chico."
            },
            {
                prompt: "Tienes 2 canastas vacías y recoges 6 manzanas. Si pones la misma cantidad en cada canasta, ¿cuántas pones en cada una?",
                options: ["2 manzanas", "3 manzanas", "4 manzanas", "5 manzanas"],
                correct: 1,
                explanation: "¡Reparto perfecto! 3 manzanas en una canasta y 3 en la otra ($3 + 3 = 6$).",
                hint: "¿Qué número sumado dos veces da 6?"
            },
            {
                prompt: "El árbol tiene 9 manzanas doradas ✨. ¿El número 9 es PAR o IMPAR?",
                options: ["Es IMPAR", "Es PAR", "Es cero", "No se sabe"],
                correct: 0,
                explanation: "¡Genial! El 9 es impar porque no se puede dividir en dos grupos exactos sin romper una manzana.",
                hint: "Si haces parejas de 2, te sobra 1."
            },
            {
                prompt: "Si recoges 7 manzanas en la mañana y 3 en la tarde, ¿cuántas manzanas tienes al final del día?",
                options: ["9", "10", "11", "12"],
                correct: 1,
                explanation: "¡Cosecha abundante! $7 + 3 = 10$ manzanas en total.",
                hint: "Suma 7 + 3: llega al número de dos cifras."
            },
            {
                prompt: "Una oruguita 🐛 camina por el tronco: está en la marca 3 y avanza 4 marcas hacia arriba. ¿A qué marca llega?",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "¡Arriba, oruguita! $3 + 4 = 7$. Llegó a la marca 7.",
                hint: "Cuenta 4 pasos después del 3: 4, 5, 6, 7."
            },
            {
                prompt: "¿Qué signo ponemos entre dos canastas que tienen 6 manzanas cada una: 6 ___ 6?",
                options: ["=", ">", "<", "+"],
                correct: 0,
                explanation: "¡Exacto! Como tienen la misma cantidad, usamos el signo igual ($6 = 6$).",
                hint: "Tienen la misma cantidad."
            },
            {
                prompt: "El Manzano Ancestral te pregunta: '¿Qué número va justo ANTES del 15?'",
                options: ["13", "14", "16", "17"],
                correct: 1,
                explanation: "¡Muy bien! Justo antes del 15 está el 14.",
                hint: "A 15 quítale 1."
            },
            {
                prompt: "En tu bolsa tienes 4 manzanas rojas 🍎 y encuentras 1 manzana verde 🍏. ¿Cuántas frutas tienes en total?",
                options: ["3", "4", "5", "6"],
                correct: 2,
                explanation: "¡Rico postre! 4 más 1 son 5 ricas frutas en total.",
                hint: "4 + 1 = ?"
            },
            {
                prompt: "El árbol pierde 4 hojas 🍃 con el viento y luego caen 2 hojas más. ¿Cuántas hojas cayeron en total?",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "¡Otoño mágico! $4 + 2 = 6$ hojas en total.",
                hint: "Suma 4 + 2."
            },
            {
                prompt: "Para el golpe final, ¿cuál es el número PAR más grande entre 2, 5, 8 y 9?",
                options: ["2", "5", "8", "9"],
                correct: 2,
                explanation: "¡Golpe crítico! 8 es el número par más grande (el 9 es más grande pero es impar).",
                hint: "Recuerda que debe ser par y el más grande."
            },
            {
                prompt: "¡El Manzano se rinde si le dices cuántas manzanas son 10 más 2! ¿Cuántas son?",
                options: ["11", "12", "13", "20"],
                correct: 1,
                explanation: "¡VICTORIA! 10 manzanas más 2 manzanas son 12 manzanas. ¡Has ganado la batalla!",
                hint: "10 más dos: 11, 12."
            }
        ]
    },

    // ==========================================
    // MUNDO 2: VALLE ARITMÉTICO (NIVELES 5 - 9)
    // ==========================================
    {
        id: 5,
        worldId: "world-2",
        title: "El Poder de la Suma",
        subtitle: "Uniendo fuerzas y cantidades",
        icon: "➕",
        theory: {
            title: "La Adición o Suma",
            content: `
                <p>Sumar es juntar dos o más cantidades en una sola. Los números que sumamos se llaman <strong>sumandos</strong> y el resultado se llama <strong>suma</strong> o total.</p>
                <div class="theory-visual">
                    <span>$$a + b = c$$</span>
                    <span>$$7 + 5 = 12$$</span>
                </div>
                <p><strong>Propiedad Conmutativa:</strong> El orden de los sumandos no cambia el resultado ($3 + 8 = 8 + 3 = 11$).</p>
            `
        },
        questions: [
            {
                prompt: "Calcula: $17 + 8$",
                options: ["23", "25", "26", "24"],
                correct: 1,
                explanation: "$17 + 8 = 17 + 3 + 5 = 20 + 5 = 25$.",
                hint: "Suma primero 3 para llegar a 20, luego suma 5."
            },
            {
                prompt: "Si sumamos $45 + 30$, ¿cuál es el total?",
                options: ["70", "75", "85", "65"],
                correct: 1,
                explanation: "Sumando las decenas: $40 + 30 = 70$. Más 5 unidades: $75$.",
                hint: "Suma las decenas (40 + 30) y agrega 5."
            },
            {
                prompt: "¿Qué número falta en la igualdad: $14 + \\_\\_\\_ = 20$?",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "$20 - 14 = 6$, por lo tanto $14 + 6 = 20$.",
                hint: "¿Cuánto le falta a 14 para llegar a 20?"
            },
            {
                prompt: "Calcula mentalmente: $99 + 1$",
                options: ["100", "101", "110", "98"],
                correct: 0,
                explanation: "Al sumar 1 a 99 alcanzamos la primera centena: 100.",
                hint: "El siguiente número después de 99."
            },
            {
                prompt: "En un cofre hay 23 gemas rojas y 19 gemas azules. ¿Cuántas gemas hay en total?",
                options: ["41", "42", "40", "43"],
                correct: 1,
                explanation: "$23 + 19 = 23 + 20 - 1 = 43 - 1 = 42$.",
                hint: "Puedes sumar 20 y luego restar 1."
            }
        ]
    },
    {
        id: 6,
        worldId: "world-2",
        title: "El Arte de la Resta",
        subtitle: "Diferencias y sustracción",
        icon: "➖",
        theory: {
            title: "La Sustracción o Resta",
            content: `
                <p>Restar es quitar una cantidad de otra para encontrar la <strong>diferencia</strong>.</p>
                <div class="theory-visual">
                    <span>$$\\text{Minuendo} - \\text{Sustraendo} = \\text{Diferencia}$$</span>
                    <span>$$15 - 6 = 9$$</span>
                </div>
                <p>La resta es la operación inversa de la suma: si $15 - 6 = 9$, entonces $9 + 6 = 15$.</p>
            `
        },
        questions: [
            {
                prompt: "Calcula: $34 - 12$",
                options: ["22", "24", "18", "20"],
                correct: 0,
                explanation: "Restamos unidades ($4 - 2 = 2$) y decenas ($3 - 1 = 2$), dando 22.",
                hint: "Resta 30 - 10 y luego 4 - 2."
            },
            {
                prompt: "Calcula: $50 - 18$",
                options: ["38", "32", "34", "42"],
                correct: 1,
                explanation: "$50 - 10 = 40$, y $40 - 8 = 32$.",
                hint: "Resta 20 y luego devuelve 2."
            },
            {
                prompt: "Tenías 45 monedas y gastaste 17 en pociones. ¿Cuántas te quedan?",
                options: ["28", "27", "32", "29"],
                correct: 0,
                explanation: "$45 - 17 = 28$. Comprobación: $28 + 17 = 45$.",
                hint: "$45 - 15 = 30$, y $30 - 2 = 28$."
            },
            {
                prompt: "¿Qué número completa la operación: $\\_\\_\\_ - 15 = 30$?",
                options: ["15", "40", "45", "50"],
                correct: 2,
                explanation: "Sumamos la diferencia con el sustraendo: $30 + 15 = 45$.",
                hint: "Aplica la operación inversa: suma 30 + 15."
            },
            {
                prompt: "Calcula: $100 - 37$",
                options: ["67", "63", "73", "53"],
                correct: 1,
                explanation: "$100 - 30 = 70$, y $70 - 7 = 63$.",
                hint: "Lo que le falta a 37 para llegar a 100."
            }
        ]
    },
    {
        id: 7,
        worldId: "world-2",
        title: "Cálculo Combinado",
        subtitle: "Sumas y restas de doble dígito en acción",
        icon: "🧮",
        theory: {
            title: "Combinando Sumas y Restas",
            content: `
                <p>Cuando tenemos sumas y restas juntas en una misma línea, las resolvemos <strong>de izquierda a derecha</strong>:</p>
                <div class="theory-visual">
                    <span>$$25 + 10 - 7 = 35 - 7 = 28$$</span>
                </div>
                <p>¡El secreto es avanzar paso a paso y mantener el orden!</p>
            `
        },
        questions: [
            {
                prompt: "Calcula: $20 + 15 - 8$",
                options: ["25", "27", "29", "23"],
                correct: 1,
                explanation: "Primero $20 + 15 = 35$, luego $35 - 8 = 27$.",
                hint: "Resuelve de izquierda a derecha."
            },
            {
                prompt: "Calcula: $50 - 20 + 14$",
                options: ["44", "34", "54", "16"],
                correct: 0,
                explanation: "$50 - 20 = 30$, y $30 + 14 = 44$.",
                hint: "Primero resta $50 - 20$, luego suma 14."
            },
            {
                prompt: "Calcula: $100 - 40 - 25$",
                options: ["45", "35", "25", "30"],
                correct: 1,
                explanation: "$100 - 40 = 60$, y $60 - 25 = 35$.",
                hint: "$60 - 25$."
            },
            {
                prompt: "Un tren parte con 40 pasajeros. En la estación A suben 18 y bajan 12. ¿Cuántos viajan ahora?",
                options: ["46", "48", "50", "42"],
                correct: 0,
                explanation: "$40 + 18 - 12 = 58 - 12 = 46$ pasajeros.",
                hint: "40 + 18 - 12."
            },
            {
                prompt: "Calcula: $75 + 25 - 50$",
                options: ["100", "0", "50", "75"],
                correct: 2,
                explanation: "$75 + 25 = 100$, y $100 - 50 = 50$.",
                hint: "75 + 25 da una centena."
            }
        ]
    },
    {
        id: 8,
        worldId: "world-2",
        title: "El Reino Bajo Cero",
        subtitle: "Introducción a los números negativos",
        icon: "❄️",
        theory: {
            title: "Los Números Negativos",
            content: `
                <p>¿Qué pasa si a 3 le quitamos 5? ¡Entramos al territorio de los <strong>números negativos</strong>!</p>
                <div class="theory-visual">
                    <span>$$3 - 5 = -2$$</span>
                </div>
                <p>Se usan para representar temperaturas bajo cero, deudas o profundidades. En la recta numérica están <strong>a la izquierda del cero</strong>:</p>
                <div class="theory-visual">
                    <span>$$\\dots -3 < -2 < -1 < 0 < 1 < 2 < 3 \\dots$$</span>
                </div>
                <p>Regla clave: $-(-a) = +a$. Restar un negativo equivale a sumar.</p>
            `
        },
        questions: [
            {
                prompt: "Calcula: $4 - 7$",
                options: ["3", "-3", "-4", "11"],
                correct: 1,
                explanation: "Como 7 es mayor que 4, el resultado es negativo: $4 - 7 = -3$.",
                hint: "Imagina que tienes $4 y compras algo de $7: quedas debiendo $3."
            },
            {
                prompt: "La temperatura era de $2^\\circ\\text{C}$ y bajó $5^\\circ\\text{C}$. ¿Cuál es la nueva temperatura?",
                options: ["$-3^\\circ\\text{C}$", "$3^\\circ\\text{C}$", "$-7^\\circ\\text{C}$", "$0^\\circ\\text{C}$"],
                correct: 0,
                explanation: "$2 - 5 = -3^\\circ\\text{C}$.",
                hint: "Baja 2 grados para llegar a 0, y bajan 3 grados más."
            },
            {
                prompt: "Calcula: $-8 + 10$",
                options: ["-18", "2", "-2", "18"],
                correct: 1,
                explanation: "Debes 8 pero pagas 10, te sobran 2: $-8 + 10 = +2$.",
                hint: "Es lo mismo que $10 - 8$."
            },
            {
                prompt: "Calcula: $-4 - 6$",
                options: ["-2", "2", "-10", "10"],
                correct: 2,
                explanation: "Dos negativos se acumulan: debes 4 y luego debes 6, en total debes 10 ($-10$).",
                hint: "Se suman los valores absolutos con signo negativo."
            },
            {
                prompt: "¿Cuál de estos números es el MAYOR?",
                options: ["-15", "-2", "-8", "-20"],
                correct: 1,
                explanation: "$-2$ es el más cercano al cero por la izquierda, por tanto es el mayor de los negativos.",
                hint: "En los negativos, el que está más cerca del cero es mayor."
            }
        ]
    },
    {
        id: 9,
        worldId: "world-2",
        title: "Centinela Aritmético (Jefe)",
        subtitle: "¡Batalla de Jefe: El Centinela de Piedra Rúnica!",
        icon: "🗿",
        isBoss: true,
        boss: {
            id: "centinela_aritmetico",
            name: "El Centinela Aritmético",
            title: "Guardián de Piedra del Valle",
            avatar: "🗿⚡",
            maxHp: 7.0,
            regenRate: 0.15,
            baseDamage: 1.2,
            streakBonus: 0.5,
            mechanicType: "polarity",
            mechanicTitle: "Escudo de Polaridad (+ / -)",
            mechanicDesc: "Recupera +0.15 HP/s. Aciertos consecutivos rompen su polaridad (+0.5 por racha).",
            dialogue: {
                intro: "¡Mis runas de suma y resta son impenetrables!",
                hit: "¡Mis runas se agrietan!",
                defeat: "El balance de los signos ha sido restaurado..."
            }
        },
        theory: {
            title: "Batalla contra el Centinela",
            content: `
                <p>El Centinela de Piedra protege el paso hacia el Cañón de Factores.</p>
                <p>Combina sumas, restas y números negativos con rapidez para desactivar su escudo rúnico.</p>
                <div class="theory-tip">⚡ <strong>Mecánica:</strong> El Centinela regenera <strong>+0.15 HP/s</strong>. ¡Derrótalo con sumas, restas y ley de signos antes de que se agoten tus turnos!</div>
            `
        },
        questions: [
            {
                prompt: "Calcula: $15 - (-5)$",
                options: ["10", "20", "-10", "-20"],
                correct: 1,
                explanation: "Menos por menos da más: $15 - (-5) = 15 + 5 = 20$.",
                hint: "Restar un negativo es lo mismo que sumar."
            },
            {
                prompt: "Calcula: $-12 + 25 - 8$",
                options: ["5", "13", "-5", "21"],
                correct: 0,
                explanation: "$-12 + 25 = 13$, y $13 - 8 = 5$.",
                hint: "Primero haz $-12 + 25$."
            },
            {
                prompt: "Un submarino está a $-40$ metros y desciende $25$ metros más. ¿A qué profundidad se encuentra?",
                options: ["$-15$ m", "$-65$ m", "$65$ m", "$-55$ m"],
                correct: 1,
                explanation: "Descender es restar: $-40 - 25 = -65$ metros.",
                hint: "Baja aún más en lo negativo: $-40 - 25$."
            },
            {
                prompt: "Resuelve: $100 - (30 + 45)$",
                options: ["25", "35", "115", "15"],
                correct: 0,
                explanation: "Resolvemos primero el paréntesis: $30 + 45 = 75$. Luego: $100 - 75 = 25$.",
                hint: "Primero resuelve lo que está entre paréntesis."
            },
            {
                prompt: "¿Qué valor de $x$ hace cierta la ecuación: $x - 7 = -2$?",
                options: ["-9", "5", "-5", "9"],
                correct: 1,
                explanation: "Sumamos 7 a ambos lados: $x = -2 + 7 = 5$.",
                hint: "Pasa el $-7$ sumando al otro lado: $-2 + 7$."
            }
        ]
    },

    // ==========================================
    // MUNDO 3: CAÑÓN DE FACTORES (NIVELES 10 - 14)
    // ==========================================
    {
        id: 10,
        worldId: "world-3",
        title: "Multiplicación Elemental",
        subtitle: "La suma repetida y tablas iniciales (2 al 5)",
        icon: "✖️",
        theory: {
            title: "¿Qué es Multiplicar?",
            content: `
                <p>Multiplicar es una forma rápida de <strong>sumar el mismo número varias veces</strong>.</p>
                <div class="theory-visual">
                    <span>$$4 \\times 3 = 3 + 3 + 3 + 3 = 12$$</span>
                </div>
                <p>Los números que multiplicamos son los <strong>factores</strong> y el resultado es el <strong>producto</strong>.</p>
                <p>¡Cualquier número multiplicado por $0$ es $0$, y por $1$ se queda igual!</p>
            `
        },
        questions: [
            {
                prompt: "Calcula: $4 \\times 6$",
                options: ["24", "20", "28", "22"],
                correct: 0,
                explanation: "$4 \\times 6 = 24$. Es decir, sumar cuatro veces seis.",
                hint: "Piensa en $6 + 6 + 6 + 6$."
            },
            {
                prompt: "Si hay 5 cofres y cada uno contiene 7 gemas, ¿cuántas gemas hay en total?",
                options: ["30", "35", "40", "42"],
                correct: 1,
                explanation: "$5 \\times 7 = 35$ gemas en total.",
                hint: "Tabla del 5: $5 \\times 7$."
            },
            {
                prompt: "¿Cuánto es cualquier número multiplicado por cero, por ejemplo $482 \\times 0$?",
                options: ["482", "1", "0", "Infinito"],
                correct: 2,
                explanation: "Todo número multiplicado por cero es igual a 0.",
                hint: "Tener 0 grupos de algo significa que no hay nada."
            },
            {
                prompt: "Calcula: $3 \\times 9$",
                options: ["27", "24", "30", "26"],
                correct: 0,
                explanation: "$3 \\times 9 = 27$.",
                hint: "$9 + 9 + 9$."
            },
            {
                prompt: "¿Cuál de estas operaciones da como resultado 20?",
                options: ["$3 \\times 6$", "$4 \\times 5$", "$2 \\times 9$", "$5 \\times 5$"],
                correct: 1,
                explanation: "$4 \\times 5 = 20$.",
                hint: "4 billetes de 5."
            }
        ]
    },
    {
        id: 11,
        worldId: "world-3",
        title: "Tablas Maestras",
        subtitle: "Multiplicaciones avanzadas (6 al 10 y potencias de 10)",
        icon: "✨",
        theory: {
            title: "Las Grandes Tablas",
            content: `
                <p>Multiplicar por números mayores sigue las mismas reglas:</p>
                <div class="theory-visual">
                    <span>$$7 \\times 8 = 56$$</span>
                    <span>$$9 \\times 6 = 54$$</span>
                </div>
                <div class="theory-tip">💡 <strong>Truco del 9:</strong> Los dígitos de los resultados de la tabla del 9 siempre suman 9 ($18 \\to 1+8=9$, $27 \\to 2+7=9$, $54 \\to 5+4=9$).</div>
                <p>Multiplicar por $10$ es simplemente agregar un cero al final ($14 \\times 10 = 140$).</p>
            `
        },
        questions: [
            {
                prompt: "Calcula: $7 \\times 8$",
                options: ["54", "56", "58", "64"],
                correct: 1,
                explanation: "$7 \\times 8 = 56$. ¡Una de las multiplicaciones clásicas!",
                hint: "5, 6, 7, 8 $\\to$ 56 = 7 x 8."
            },
            {
                prompt: "Calcula: $9 \\times 9$",
                options: ["81", "72", "90", "89"],
                correct: 0,
                explanation: "$9 \\times 9 = 81$.",
                hint: "Nueve al cuadrado."
            },
            {
                prompt: "Calcula: $12 \\times 10$",
                options: ["120", "102", "1200", "22"],
                correct: 0,
                explanation: "Al multiplicar por 10 agregamos un cero: $12 \\times 10 = 120$.",
                hint: "Agrega un cero al final del 12."
            },
            {
                prompt: "Calcula: $6 \\times 7$",
                options: ["40", "42", "44", "48"],
                correct: 1,
                explanation: "$6 \\times 7 = 42$.",
                hint: "Seis veces siete."
            },
            {
                prompt: "Calcula: $8 \\times 9$",
                options: ["72", "74", "81", "68"],
                correct: 0,
                explanation: "$8 \\times 9 = 72$.",
                hint: "Uno menos que $9 \\times 9 = 81$."
            }
        ]
    },
    {
        id: 12,
        worldId: "world-3",
        title: "La División: El Reparto",
        subtitle: "Operación inversa de la multiplicación",
        icon: "➗",
        theory: {
            title: "¿Qué es Dividir?",
            content: `
                <p>Dividir es <strong>repartir una cantidad en partes iguales</strong>. Es la operación hermana inversa de multiplicar.</p>
                <div class="theory-visual">
                    <span>$$a \\div b = c \\iff c \\times b = a$$</span>
                    <span>$$24 \\div 6 = 4 \\quad (\\text{porque } 4 \\times 6 = 24)$$</span>
                </div>
                <div class="theory-tip">⚠️ <strong>Regla de oro:</strong> ¡NUNCA se puede dividir entre cero ($x \\div 0$ no está definido)!</div>
            `
        },
        questions: [
            {
                prompt: "Calcula: $36 \\div 6$",
                options: ["5", "6", "7", "8"],
                correct: 1,
                explanation: "$36 \\div 6 = 6$ porque $6 \\times 6 = 36$.",
                hint: "¿Qué número multiplicado por 6 da 36?"
            },
            {
                prompt: "Si repartes 28 pociones entre 4 magos por igual, ¿cuántas recibe cada uno?",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "$28 \\div 4 = 7$ pociones.",
                hint: "$4 \\times 7 = 28$."
            },
            {
                prompt: "Calcula: $45 \\div 5$",
                options: ["8", "9", "10", "7"],
                correct: 1,
                explanation: "$45 \\div 5 = 9$.",
                hint: "¿Cuántas veces cabe 5 en 45?"
            },
            {
                prompt: "¿Cuánto es $0 \\div 8$?",
                options: ["0", "8", "1", "Indefinido"],
                correct: 0,
                explanation: "Si tienes 0 caramelos y los repartes entre 8 amigos, cada uno recibe 0 caramelos.",
                hint: "Cero repartido entre cualquier número distinto de cero es cero."
            },
            {
                prompt: "Calcula: $63 \\div 9$",
                options: ["6", "7", "8", "9"],
                correct: 1,
                explanation: "$63 \\div 9 = 7$ porque $7 \\times 9 = 63$.",
                hint: "Revisa la tabla del 9."
            }
        ]
    },
    {
        id: 13,
        worldId: "world-3",
        title: "Jerarquía de Operaciones",
        subtitle: "El orden estricto de la matemática (PEMDAS)",
        icon: "👑",
        theory: {
            title: "El Orden Sagrado (PEMDAS)",
            content: `
                <p>Cuando varias operaciones conviven, hay una jerarquía estricta que debemos respetar:</p>
                <ol>
                    <li><strong>P</strong>aréntesis: Lo que esté dentro de $( )$ se resuelve primero.</li>
                    <li><strong>E</strong>xponentes y raíces: $x^2, \\sqrt{x}$.</li>
                    <li><strong>M</strong>ultiplicación y <strong>D</strong>ivisión: De izquierda a derecha.</li>
                    <li><strong>A</strong>dición (Suma) y <strong>S</strong>ustracción (Resta): Al final, de izquierda a derecha.</li>
                </ol>
                <div class="theory-visual">
                    <span>$$3 + 4 \\times 2 = 3 + 8 = 11 \\neq 14$$</span>
                </div>
            `
        },
        questions: [
            {
                prompt: "Calcula: $3 + 5 \\times 2$",
                options: ["16", "13", "10", "15"],
                correct: 1,
                explanation: "Primero se multiplica: $5 \\times 2 = 10$. Luego se suma: $3 + 10 = 13$.",
                hint: "La multiplicación tiene prioridad sobre la suma."
            },
            {
                prompt: "Calcula: $(3 + 5) \\times 2$",
                options: ["13", "16", "11", "20"],
                correct: 1,
                explanation: "El paréntesis rompe la prioridad: primero $3 + 5 = 8$, luego $8 \\times 2 = 16$.",
                hint: "Lo que está en paréntesis se resuelve primero."
            },
            {
                prompt: "Calcula: $20 - 4 \\times 3 + 2$",
                options: ["50", "10", "8", "14"],
                correct: 1,
                explanation: "Primero $4 \\times 3 = 12$. Luego de izquierda a derecha: $20 - 12 = 8$, y $8 + 2 = 10$.",
                hint: "Primero calcula $4 \\times 3$."
            },
            {
                prompt: "Calcula: $18 \\div 3 \\times 2$",
                options: ["3", "12", "6", "9"],
                correct: 1,
                explanation: "División y multiplicación tienen igual rango; se resuelven de izquierda a derecha: $18 \\div 3 = 6$, y $6 \\times 2 = 12$.",
                hint: "Al tener el mismo nivel, avanza de izquierda a derecha."
            },
            {
                prompt: "Calcula: $2 + 3 \\times (4 - 1)$",
                options: ["15", "11", "9", "12"],
                correct: 1,
                explanation: "Paréntesis: $4 - 1 = 3$. Multiplicación: $3 \\times 3 = 9$. Suma: $2 + 9 = 11$.",
                hint: "Paréntesis primero, luego multiplica, al final suma."
            }
        ]
    },
    {
        id: 14,
        worldId: "world-3",
        title: "El Golem Multiplicador (Jefe)",
        subtitle: "¡Batalla de Jefe: El Coloso de Factores!",
        icon: "⚡",
        isBoss: true,
        boss: {
            id: "golem_multiplicador",
            name: "El Golem Multiplicador",
            title: "Coloso del Cañón de Factores",
            avatar: "⚡🤖",
            maxHp: 8.0,
            regenRate: 0.1,
            baseDamage: 1.0,
            streakBonus: 0.8,
            mechanicType: "multiplier",
            mechanicTitle: "Sobrecarga de Factores",
            mechanicDesc: "Recupera +0.1 HP/s. Cada acierto en racha potencia el impacto (+0.8 por racha).",
            dialogue: {
                intro: "¡Mis engranajes multiplican tu esfuerzo por cero!",
                hit: "¡Sobrecarga de factores!",
                defeat: "¡El orden de tus operaciones ha sido impecable!"
            }
        },
        theory: {
            title: "Desafío del Golem",
            content: `
                <p>El colosal Golem de Piedra y Rayos custodia la entrada al Bosque del Álgebra.</p>
                <p>Resuelve problemas con multiplicación, división y jerarquía sin titubear para desintegrar su núcleo.</p>
                <div class="theory-tip">⚡ <strong>Mecánica:</strong> El Golem recupera <strong>+0.1 HP/s</strong>. ¡Encadena aciertos para sobrecargar su batería con daño potenciado!</div>
            `
        },
        questions: [
            {
                prompt: "Calcula: $50 - 5 \\times (6 + 2)$",
                options: ["360", "10", "42", "20"],
                correct: 1,
                explanation: "Paréntesis: $6 + 2 = 8$. Multiplicación: $5 \\times 8 = 40$. Resta: $50 - 40 = 10$.",
                hint: "$6 + 2 = 8$, luego $5 \\times 8 = 40$."
            },
            {
                prompt: "Calcula: $8 \\times 7 - 36 \\div 4$",
                options: ["47", "5", "56", "49"],
                correct: 0,
                explanation: "$8 \\times 7 = 56$ y $36 \\div 4 = 9$. Luego $56 - 9 = 47$.",
                hint: "Resuelve las dos operaciones fuertes y luego resta sus resultados."
            },
            {
                prompt: "Un dragón come 6 ovejas al día. ¿Cuántas comerá en 3 semanas (21 días)?",
                options: ["120", "126", "136", "142"],
                correct: 1,
                explanation: "$21 \\times 6 = (20 \\times 6) + (1 \\times 6) = 120 + 6 = 126$.",
                hint: "Multiplica $21 \\times 6$."
            },
            {
                prompt: "Calcula: $(10 + 2 \\times 5) \\div 4$",
                options: ["5", "15", "10", "4"],
                correct: 0,
                explanation: "Dentro del paréntesis: $2 \\times 5 = 10$, y $10 + 10 = 20$. Luego: $20 \\div 4 = 5$.",
                hint: "Dentro del paréntesis primero multiplica y luego suma."
            },
            {
                prompt: "Calcula: $100 - 10 \\times 10$",
                options: ["900", "0", "90", "100"],
                correct: 1,
                explanation: "Primero $10 \\times 10 = 100$. Luego $100 - 100 = 0$.",
                hint: "La multiplicación va primero: $10 \\times 10 = 100$."
            }
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


