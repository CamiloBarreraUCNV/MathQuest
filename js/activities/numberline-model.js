// Number-line journeys: pure rules, no DOM, storage, animation or RPG rewards.
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else Object.assign(root.KalkuActivities = root.KalkuActivities || {}, api);
})(globalThis, function () {
    'use strict';
    const STEPS = [1, 2, 5, 10];
    const copy = value => JSON.parse(JSON.stringify(value));
    const requireValue = (valid, message) => { if (!valid) throw new TypeError(`Recta numérica: ${message}`); };
    function validateNumberlineDefinition(d) {
        requireValue(d?.schemaVersion === 1 && d.type === 'numberline', 'definición inválida.');
        requireValue(['forward', 'backward', 'mixed'].includes(d.direction), 'dirección inválida.');
        requireValue([20, 100].includes(d.maxNumber) && [0, ...STEPS].includes(d.stepSize), 'rango o salto inválido.');
        for (const key of ['id', 'worldId']) requireValue(typeof d[key] === 'string' && d[key].trim(), `falta ${key}.`);
        requireValue(d.grade === 1, 'curso inválido.');
        for (const key of ['objectiveIds', 'skillIds']) requireValue(Array.isArray(d[key]) && d[key].length &&
            d[key].every(v => typeof v === 'string' && v.trim()), `faltan ${key}.`);
        return d;
    }
    function createNumberlineChallengeFactory(definition, random = Math.random) {
        const d = copy(validateNumberlineDefinition(definition));
        requireValue(typeof random === 'function', 'random inválido.');
        const draw = () => { const value = random(); requireValue(Number.isFinite(value) && value >= 0 && value < 1, 'random debe devolver [0, 1).'); return value; };
        const variants = [];
        for (const stepSize of d.stepSize ? [d.stepSize] : STEPS) for (const direction of d.direction === 'mixed' ? [1, -1] : [d.direction === 'forward' ? 1 : -1]) {
            for (let jumpCount = 1; jumpCount <= 4; jumpCount++) for (let start = 0; start <= d.maxNumber; start++) {
                const target = start + direction * stepSize * jumpCount;
                if (target >= 0 && target <= d.maxNumber) variants.push({ start, direction, stepSize, jumpCount });
            }
        }
        let bag = [], previous = '', sequence = 0;
        return () => {
            if (!bag.length) {
                bag = variants.map(copy);
                for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(draw() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
                if (JSON.stringify(bag.at(-1)) === previous) [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
            }
            const route = bag.pop(); previous = JSON.stringify(route);
            return { schemaVersion: 1, id: `${d.id}:attempt-${++sequence}`, definition: copy(d), ...route };
        };
    }
    class NumberlineSession {
        constructor(challenge) {
            requireValue(challenge?.schemaVersion === 1 && typeof challenge.id === 'string' && challenge.id.trim(), 'reto inválido.');
            this.definition = copy(validateNumberlineDefinition(challenge.definition));
            const { start, direction, stepSize, jumpCount } = challenge, d = this.definition;
            requireValue(Number.isInteger(start) && start >= 0 && start <= d.maxNumber && [1, -1].includes(direction) &&
                STEPS.includes(stepSize) && (!d.stepSize || d.stepSize === stepSize) &&
                (d.direction === 'mixed' || direction === (d.direction === 'forward' ? 1 : -1)) &&
                Number.isInteger(jumpCount) && jumpCount >= 1 && jumpCount <= 4, 'recorrido inválido.');
            const target = start + direction * stepSize * jumpCount;
            requireValue(target >= 0 && target <= d.maxNumber, 'el recorrido sale de la recta.');
            this.challengeId = challenge.id; this.start = start; this.direction = direction; this.stepSize = stepSize;
            this.jumpCount = jumpCount; this.target = target; this.jumps = []; this.attempts = 0; this.status = 'playing';
            this.assistance = { hintsUsed: 0, hintLevel: 0, demonstrationUsed: false };
        }
        get position() { return this.jumps.at(-1)?.to ?? this.start; }
        jump(direction, size) {
            if (this.status !== 'playing' || ![1, -1].includes(direction) || !STEPS.includes(size) || this.jumps.length >= 12) return false;
            const from = this.position, to = from + direction * size;
            if (to < 0 || to > this.definition.maxNumber) return false;
            this.jumps.push({ from, to, direction, size }); return true;
        }
        undo() { if (this.status !== 'playing' || !this.jumps.length) return false; this.jumps.pop(); return true; }
        reset() { if (this.status !== 'playing') return false; this.jumps = []; return true; }
        isCorrect() {
            let position = this.start;
            return this.jumps.length === this.jumpCount && this.jumps.every(jump => {
                const valid = jump.from === position && jump.direction === this.direction && jump.size === this.stepSize &&
                    jump.to === position + this.direction * this.stepSize && jump.to >= 0 && jump.to <= this.definition.maxNumber;
                position = jump.to; return valid;
            }) && position === this.target;
        }
        useHint() { if (this.status === 'playing') { this.assistance.hintsUsed++; this.assistance.hintLevel = Math.min(3, this.assistance.hintLevel + 1); } }
        useDemonstration() { if (this.status === 'playing') this.assistance.demonstrationUsed = true; }
        getSnapshot() {
            return { schemaVersion: 1, type: 'numberline', responseKind: 'jump-route', challengeId: this.challengeId,
                definitionId: this.definition.id, maxNumber: this.definition.maxNumber, start: this.start, direction: this.direction,
                stepSize: this.stepSize, jumpCount: this.jumpCount, target: this.target, position: this.position,
                jumps: copy(this.jumps), attempts: this.attempts, status: this.status, assistance: { ...this.assistance } };
        }
        submit() {
            let isNewCompletion = false;
            if (this.status === 'playing') { this.attempts++; if (this.isCorrect()) { this.status = 'completed'; isNewCompletion = true; } }
            return { ...this.getSnapshot(), isCorrect: this.status === 'completed', isNewCompletion };
        }
        getHint() {
            const direction = this.direction === 1 ? 'adelante, hacia la derecha' : 'atrás, hacia la izquierda';
            if (this.assistance.hintLevel <= 1) return `Empieza en ${this.start}. Ve hacia ${direction}. El número de salida no cuenta como un salto.`;
            if (this.assistance.hintLevel === 2) return `Cada salto cambia ${this.stepSize} ${this.stepSize === 1 ? 'unidad' : 'unidades'}. Necesitas ${this.jumpCount} ${this.jumpCount === 1 ? 'salto' : 'saltos'} del mismo tamaño y dirección. Puedes deshacer los que quieras corregir.`;
            return `Recorrido buscado: ${Array.from({ length: this.jumpCount + 1 }, (_, i) => this.start + i * this.direction * this.stepSize).join(' → ')}. Son ${this.jumpCount} saltos; la salida no es un salto.`;
        }
    }
    return { validateNumberlineDefinition, createNumberlineChallengeFactory, NumberlineSession };
});
