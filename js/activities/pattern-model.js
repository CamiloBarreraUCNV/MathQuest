// Pattern rules and attempts are independent of the DOM, RPG rewards and storage.
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else Object.assign(root.KalkuActivities = root.KalkuActivities || {}, api);
})(globalThis, function () {
    'use strict';
    const SYMBOLS = ['leaf', 'shell', 'star', 'flower'];
    const SHAPES = { AB: [0, 1], AAB: [0, 0, 1], ABC: [0, 1, 2] };
    const copy = value => JSON.parse(JSON.stringify(value));
    const requireValue = (condition, text) => { if (!condition) throw new TypeError(`Patrones: ${text}`); };
    const stepsFor = max => max === 20 ? [1, 2] : [1, 2, 5, 10];
    function validatePatternDefinition(d) {
        requireValue(d?.schemaVersion === 1 && d.type === 'pattern', 'definición inválida.');
        requireValue(['continue', 'create', 'repair'].includes(d.mode), 'modo inválido.');
        requireValue(['AB', 'AAB', 'ABC', 'number'].includes(d.family), 'familia inválida.');
        requireValue([20, 100].includes(d.maxNumber), 'rango inválido.');
        for (const key of ['id', 'worldId']) requireValue(typeof d[key] === 'string' && d[key].trim(), `falta ${key}.`);
        requireValue(d.grade === 1 && Array.isArray(d.objectiveIds) && d.objectiveIds.length &&
            d.objectiveIds.every(v => typeof v === 'string' && v.trim()) && Array.isArray(d.skillIds) && d.skillIds.length &&
            d.skillIds.every(v => typeof v === 'string' && v.trim()), 'faltan objetivos o habilidades.');
        return d;
    }
    function createPatternChallengeFactory(definition, random = Math.random) {
        const d = copy(validatePatternDefinition(definition));
        requireValue(typeof random === 'function', 'random inválido.');
        const draw = () => { const n = random(); requireValue(Number.isFinite(n) && n >= 0 && n < 1, 'random debe devolver [0, 1).'); return n; };
        // Shuffle a finite bag rather than retrying random draws (also works with constant random).
        const variants = d.family === 'number'
            ? stepsFor(d.maxNumber).flatMap(step => Array.from({ length: d.maxNumber - step * 5 }, (_, i) => [i + 1, step]))
                .flatMap(([start, step]) => [[start, step], [start + step * 5, -step]])
            : SYMBOLS.flatMap(a => SYMBOLS.filter(b => b !== a).flatMap(b => d.family === 'ABC'
                ? SYMBOLS.filter(c => c !== a && c !== b).map(c => [a, b, c]) : [[a, b]]));
        let bag = [], previous = '', sequence = 0;
        return () => {
            if (!bag.length) {
                bag = variants.map(copy);
                for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(draw() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
                if (JSON.stringify(bag.at(-1)) === previous) [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
            }
            const rule = bag.pop(); previous = JSON.stringify(rule);
            const unitLength = d.family === 'number' ? 2 : SHAPES[d.family].length;
            return { schemaVersion: 1, id: `${d.id}:attempt-${++sequence}`, definition: copy(d), rule,
                repairIndex: d.family === 'number' ? 1 + Math.floor(draw() * 4) : unitLength + Math.floor(draw() * unitLength) };
        };
    }
    class PatternSession {
        constructor(challenge) {
            requireValue(challenge?.schemaVersion === 1 && typeof challenge.id === 'string' && challenge.id.trim(), 'reto inválido.');
            this.definition = copy(validatePatternDefinition(challenge.definition));
            const { family, mode, maxNumber } = this.definition;
            const rule = challenge.rule;
            requireValue(Array.isArray(rule), 'regla inválida.');
            if (family === 'number') {
                requireValue(rule.length === 2 && Number.isInteger(rule[0]) && Number.isInteger(rule[1]) && stepsFor(maxNumber).includes(Math.abs(rule[1])), 'salto inválido.');
                this.expected = Array.from({ length: 6 }, (_, i) => rule[0] + i * rule[1]);
                requireValue(this.expected.every(v => v >= 1 && v <= maxNumber), 'serie fuera del rango.');
            } else {
                requireValue(rule.length === (family === 'ABC' ? 3 : 2) && new Set(rule).size === rule.length && rule.every(v => SYMBOLS.includes(v)), 'piezas inválidas.');
                const shape = SHAPES[family];
                this.expected = Array.from({ length: shape.length * 3 }, (_, i) => rule[shape[i % shape.length]]);
            }
            this.challengeId = challenge.id;
            const hidden = family === 'number' ? 2 : SHAPES[family].length;
            this.editable = this.expected.map((_, i) => mode !== 'continue' || i >= this.expected.length - hidden);
            this.initialValues = this.expected.map((value, i) => mode === 'create' || mode === 'continue' && this.editable[i] ? null : value);
            if (mode === 'repair') {
                const index = challenge.repairIndex;
                requireValue(Number.isInteger(index) && index >= (family === 'number' ? 1 : hidden) &&
                    index < (family === 'number' ? 5 : hidden * 2), 'posición a reparar inválida.');
                this.initialValues[index] = family === 'number' ? (this.expected[index] === maxNumber ? maxNumber - 1 : this.expected[index] + 1)
                    : SYMBOLS.find(v => v !== this.expected[index]);
            }
            this.values = [...this.initialValues];
            this.attempts = 0; this.status = 'playing';
            this.assistance = { hintsUsed: 0, hintLevel: 0, demonstrationUsed: false, groupingUsed: false };
        }
        set(index, value) {
            if (this.status !== 'playing' || !Number.isInteger(index) || !this.editable[index]) return false;
            if (value !== null && (this.definition.family === 'number'
                ? !Number.isInteger(value) || value < 1 || value > this.definition.maxNumber : !SYMBOLS.includes(value))) return false;
            this.values[index] = value; return true;
        }
        reset() { if (this.status !== 'playing') return false; this.values = [...this.initialValues]; return true; }
        isCorrect() {
            if (this.values.some(v => v === null)) return false;
            const { mode, family, maxNumber } = this.definition;
            if (mode !== 'create') return this.values.every((v, i) => v === this.expected[i]);
            if (family === 'number') {
                const step = this.values[1] - this.values[0];
                return stepsFor(maxNumber).includes(Math.abs(step)) && this.values.every((v, i) => Number.isInteger(v) && v >= 1 && v <= maxNumber && (!i || v - this.values[i - 1] === step));
            }
            const shape = SHAPES[family], unit = this.values.slice(0, shape.length);
            const symbols = shape.map((group, index) => unit[shape.indexOf(group)]);
            return new Set(shape.map(group => unit[shape.indexOf(group)])).size === Math.max(...shape) + 1 &&
                this.values.every((v, i) => SYMBOLS.includes(v) && v === symbols[i % shape.length]);
        }
        useHint() { if (this.status === 'playing') { this.assistance.hintsUsed++; this.assistance.hintLevel = Math.min(3, this.assistance.hintLevel + 1); } }
        useDemonstration() { if (this.status === 'playing') this.assistance.demonstrationUsed = true; }
        useGrouping() { if (this.status === 'playing') this.assistance.groupingUsed = true; }
        getSnapshot() {
            return { schemaVersion: 1, type: 'pattern', responseKind: 'sequence', challengeId: this.challengeId,
                definitionId: this.definition.id, mode: this.definition.mode, family: this.definition.family, maxNumber: this.definition.maxNumber,
                values: [...this.values], initialValues: [...this.initialValues], editable: [...this.editable], attempts: this.attempts,
                status: this.status, assistance: { ...this.assistance } };
        }
        submit() {
            let isNewCompletion = false;
            if (this.status === 'playing') { this.attempts++; if (this.isCorrect()) { this.status = 'completed'; isNewCompletion = true; } }
            return { ...this.getSnapshot(), isCorrect: this.status === 'completed', isNewCompletion };
        }
        getHint() {
            const { family, mode, maxNumber } = this.definition;
            const level = this.assistance.hintLevel;
            if (level <= 1) return family === 'number' ? 'Lee los números en orden. ¿Cuánto cambia de uno al siguiente? El salto debe ser siempre el mismo.'
                : 'Busca el grupo más pequeño que se repite. Léelo en voz alta y vuelve a empezar el mismo grupo.';
            if (level === 2) return family === 'number'
                ? `Puedes avanzar o retroceder con saltos de ${stepsFor(maxNumber).join(', ')}. No cambies de salto a mitad del camino.`
                : { AB: 'Se alternan dos piezas distintas: A, B; A, B; A, B.', AAB: 'Van dos piezas iguales y una distinta: A, A, B. Repite ese grupo tres veces.', ABC: 'El grupo tiene tres piezas distintas: A, B, C. Conserva su orden en cada grupo.' }[family];
            if (mode === 'create') return family === 'number' ? 'Por ejemplo, puedes empezar en 1 y sumar 2 cada vez: 1, 3, 5… Completa seis números con la misma regla.'
                : `Elige tus propias piezas para ${family}. Cada letra distinta necesita una pieza distinta. Repite el grupo tres veces.`;
            if (family === 'number') return `La serie ${this.expected[1] > this.expected[0] ? 'avanza' : 'retrocede'} de ${Math.abs(this.expected[1] - this.expected[0])} en ${Math.abs(this.expected[1] - this.expected[0])}. Empieza en ${this.expected[0]} y conserva ese salto.`;
            const length = SHAPES[family].length;
            return `Compara cada posición con la que está ${length} lugares antes o después: deben tener la misma pieza. El grupo es ${family}.`;
        }
    }
    return { PATTERN_SYMBOLS: [...SYMBOLS], validatePatternDefinition, createPatternChallengeFactory, PatternSession };
});
