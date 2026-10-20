// Two-part composition: pure model, independent of the DOM, rewards and storage.
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else Object.assign(root.KalkuActivities = root.KalkuActivities || {}, api);
})(globalThis, function () {
    'use strict';
    const requireValue = (condition, message) => { if (!condition) throw new TypeError(`Composición: ${message}`); };
    const clone = value => JSON.parse(JSON.stringify(value));
    const keyFor = (left, right) => [left, right].sort((a, b) => a - b).join('+');

    function validateCompositionDefinition(d) {
        requireValue(d?.schemaVersion === 1 && d.type === 'composition', 'definición inválida.');
        requireValue(['compose', 'missing', 'split'].includes(d.mode), 'modo no implementado.');
        requireValue(typeof d.id === 'string' && d.id.trim() && typeof d.worldId === 'string' && d.worldId.trim(), 'faltan identificadores.');
        requireValue(Number.isInteger(d.grade) && d.grade >= 1, 'curso inválido.');
        for (const field of ['objectiveIds', 'skillIds']) requireValue(Array.isArray(d[field]) && d[field].length > 0 &&
            d[field].every(v => typeof v === 'string' && v.trim()), `falta ${field}.`);
        requireValue(Number.isInteger(d.minTarget) && Number.isInteger(d.maxTarget) && d.minTarget >= (d.mode === 'split' ? 4 : 2) &&
            d.maxTarget <= 20 && d.minTarget <= d.maxTarget, 'el total mínimo es 2; repartir de dos formas necesita al menos 4. Máximo 20.');
        return d;
    }

    function createCompositionChallengeFactory(definition, random = Math.random) {
        const d = clone(validateCompositionDefinition(definition));
        requireValue(typeof random === 'function', 'random inválido.');
        const draw = () => { const v = random(); requireValue(Number.isFinite(v) && v >= 0 && v < 1, 'random debe devolver [0, 1).'); return v; };
        let bag = [], previous, sequence = 0;
        return () => {
            if (!bag.length) {
                bag = Array.from({ length: d.maxTarget - d.minTarget + 1 }, (_, i) => d.minTarget + i);
                for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(draw() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
                if (bag.length > 1 && bag.at(-1) === previous) [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
            }
            previous = bag.pop();
            return { schemaVersion: 1, id: `${d.id}:attempt-${++sequence}`, definition: clone(d),
                targetQuantity: previous, givenLeft: d.mode === 'split' ? 0 : 1 + Math.floor(draw() * (previous - 1)) };
        };
    }

    class CompositionSession {
        constructor(challenge) {
            requireValue(challenge?.schemaVersion === 1 && typeof challenge.id === 'string' && challenge.id.trim(), 'desafío inválido.');
            this.definition = clone(validateCompositionDefinition(challenge.definition));
            const { targetQuantity: total, givenLeft } = challenge;
            requireValue(Number.isInteger(total) && total >= this.definition.minTarget && total <= this.definition.maxTarget,
                'total fuera del rango.');
            requireValue(Number.isInteger(givenLeft) && (this.definition.mode === 'split'
                ? givenLeft === 0 : givenLeft >= 1 && givenLeft < total), 'cada parte dada debe ser positiva y menor que el total.');
            this.challengeId = challenge.id;
            this.targetQuantity = total;
            this.givenLeft = givenLeft;
            this.tokens = Array.from({ length: this.definition.mode === 'compose' ? total : this.definition.maxTarget }, (_, i) => i + 1);
            this.locations = new Map(this.tokens.map(id => [id, this.definition.mode === 'compose'
                ? id <= givenLeft ? 'left' : 'right' : id <= givenLeft ? 'left' : 'reserve']));
            this.status = 'playing';
            this.answer = null;
            this.attempts = 0;
            this.solutions = [];
            this.requiredSolutions = this.definition.mode === 'split' ? 2 : 1;
            this.assistance = { hintsUsed: 0, hintLevel: 0, countingUsed: false, demonstrationUsed: false };
            this.counting = false;
        }

        move(token, destination) {
            const source = this.locations.get(token);
            if (this.status !== 'playing' || !source || !['left', 'right', 'reserve'].includes(destination) || source === destination ||
                this.definition.mode === 'compose' || this.definition.mode === 'missing' && (source === 'left' || destination === 'left')) return false;
            this.locations.set(token, destination);
            return true;
        }

        resetPlacement() {
            if (this.status !== 'playing' || this.definition.mode === 'compose') return false;
            for (const token of this.tokens) if (this.definition.mode !== 'missing' || this.locations.get(token) !== 'left') this.locations.set(token, 'reserve');
            return true;
        }

        tryAnother() {
            if (this.definition.mode !== 'split' || this.status !== 'solution-found') return false;
            this.status = 'playing';
            this.resetPlacement();
            return true;
        }

        setCounting(enabled) { this.counting = Boolean(enabled); if (this.counting) this.assistance.countingUsed = true; }
        useHint() { if (this.status === 'playing') { this.assistance.hintsUsed++; this.assistance.hintLevel = Math.min(3, this.assistance.hintLevel + 1); } }
        useDemonstration() { if (this.status === 'playing') this.assistance.demonstrationUsed = true; }

        getSnapshot() {
            const parts = Object.fromEntries(['left', 'right', 'reserve'].map(side => [side, this.tokens.filter(id => this.locations.get(id) === side)]));
            return { schemaVersion: 1, type: 'composition', responseKind: { compose: 'total-quantity', missing: 'missing-part', split: 'two-partitions' }[this.definition.mode],
                challengeId: this.challengeId, definitionId: this.definition.id, mode: this.definition.mode,
                targetQuantity: this.targetQuantity, givenLeft: this.givenLeft, parts, leftQuantity: parts.left.length,
                rightQuantity: parts.right.length, finalQuantity: parts.left.length + parts.right.length,
                totalObjects: this.tokens.length, answer: this.answer, attempts: this.attempts, status: this.status,
                requiredSolutions: this.requiredSolutions, solutions: clone(this.solutions), counting: this.counting, assistance: { ...this.assistance } };
        }

        isCorrect() {
            const s = this.getSnapshot();
            if (s.leftQuantity < 1 || s.rightQuantity < 1) return false;
            if (s.mode === 'compose') return s.finalQuantity === s.targetQuantity && this.answer === s.targetQuantity;
            if (s.mode === 'missing') return s.leftQuantity === s.givenLeft && s.rightQuantity === s.targetQuantity - s.givenLeft;
            return s.finalQuantity === s.targetQuantity && s.solutions.length >= s.requiredSolutions &&
                s.solutions.every(p => p.left >= 1 && p.right >= 1 && p.left + p.right === s.targetQuantity) &&
                new Set(s.solutions.map(p => keyFor(p.left, p.right))).size === s.solutions.length;
        }

        submit(answer) {
            let newSolution = false, duplicate = false, isNewCompletion = false, invalidAnswer = false;
            if (this.status === 'playing') {
                this.attempts++;
                if (this.definition.mode === 'compose') {
                    invalidAnswer = !Number.isInteger(answer) || answer < 2 || answer > 20;
                    this.answer = invalidAnswer ? null : answer;
                }
                const s = this.getSnapshot();
                if (s.mode === 'split' && s.leftQuantity >= 1 && s.rightQuantity >= 1 && s.finalQuantity === s.targetQuantity) {
                    duplicate = this.solutions.some(p => keyFor(p.left, p.right) === keyFor(s.leftQuantity, s.rightQuantity));
                    if (!duplicate) { this.solutions.push({ left: s.leftQuantity, right: s.rightQuantity }); newSolution = true; }
                    if (newSolution && this.solutions.length < this.requiredSolutions) this.status = 'solution-found';
                }
                if (this.isCorrect()) { this.status = 'completed'; isNewCompletion = true; }
            }
            const snapshot = this.getSnapshot();
            return { ...snapshot, isCorrect: this.status === 'completed', isNewCompletion, newSolution, duplicate, invalidAnswer,
                emptyPart: snapshot.leftQuantity === 0 || snapshot.rightQuantity === 0 };
        }
    }

    function getCompositionHint(s) {
        const level = s.assistance.hintLevel;
        if (level <= 1) return { title: 'Pista 1 · Mira las dos canastas', text: s.mode === 'compose'
            ? 'Cuenta la primera canasta. Después sigue contando en la segunda; no empieces otra vez desde uno.'
            : s.mode === 'missing' ? 'La canasta A se conserva. Cuenta desde esa cantidad hasta llegar al total.'
                : 'Reparte el total entre las dos canastas, con al menos una manzana en cada una. Después busca otra pareja de cantidades.', showCounting: false };
        if (level === 2) return { title: 'Pista 2 · Relaciona las partes', text: s.mode === 'compose'
            ? `Hay ${s.leftQuantity} en A y ${s.rightQuantity} en B. Sumar es juntar ambas cantidades.`
            : s.mode === 'missing' ? `Ya hay ${s.givenLeft} en A. Buscamos ${s.targetQuantity} entre las dos canastas; solo cambia B.`
                : `Ahora hay ${s.leftQuantity} + ${s.rightQuantity} = ${s.finalQuantity}. Buscamos ${s.targetQuantity}. Cambiar las canastas de lugar no crea otra pareja.`, showCounting: true };
        let text;
        if (s.mode === 'compose') text = `${s.leftQuantity} + ${s.rightQuantity} = ${s.targetQuantity}. Juntos tienen ${s.targetQuantity} manzanas.`;
        else if (s.mode === 'missing') text = `${s.givenLeft} + ${s.targetQuantity - s.givenLeft} = ${s.targetQuantity}. En B necesitas ${s.targetQuantity - s.givenLeft} manzanas; ahora hay ${s.rightQuantity}.`;
        else {
            const example = Array.from({ length: Math.floor(s.targetQuantity / 2) }, (_, i) => ({ left: i + 1, right: s.targetQuantity - i - 1 }))
                .find(p => !s.solutions.some(found => keyFor(found.left, found.right) === keyFor(p.left, p.right)));
            text = example ? `Una pareja nueva es ${example.left} + ${example.right} = ${s.targetQuantity}. Ambas canastas tienen manzanas.`
                : 'Ya encontraste todas las parejas de cantidades para este total.';
        }
        return { title: 'Pista 3 · Paso a paso', text, showCounting: true };
    }

    return { validateCompositionDefinition, createCompositionChallengeFactory, CompositionSession, getCompositionHint };
});
