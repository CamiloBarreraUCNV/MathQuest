// Kalkú: quantity challenges. Pure model, usable in a browser or Node.js.
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else Object.assign(root.KalkuActivities = root.KalkuActivities || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    function requireValue(condition, message) {
        if (!condition) throw new TypeError(`Actividad de cantidades: ${message}`);
    }

    function validateQuantityDefinition(definition) {
        requireValue(definition && definition.schemaVersion === 1, 'schemaVersion debe ser 1.');
        requireValue(typeof definition.id === 'string' && definition.id.trim(), 'falta un id estable.');
        requireValue(definition.type === 'quantity' && definition.mode === 'populate', 'tipo o modo no implementado.');
        requireValue(typeof definition.worldId === 'string' && definition.worldId.trim(), 'falta worldId.');
        requireValue(Number.isInteger(definition.grade) && definition.grade >= 1, 'grade debe ser un curso válido.');
        for (const key of ['objectiveIds', 'skillIds']) {
            requireValue(Array.isArray(definition[key]) && definition[key].length > 0 &&
                definition[key].every(value => typeof value === 'string' && value.trim()), `falta ${key}.`);
        }
        const rules = definition.rules || {};
        requireValue(Number.isInteger(rules.totalObjects) && rules.totalObjects >= 1 && rules.totalObjects <= 20,
            'esta versión admite entre 1 y 20 objetos totales.');
        requireValue(rules.allowTens === undefined || typeof rules.allowTens === 'boolean', 'allowTens debe ser booleano.');
        requireValue(!rules.allowTens || rules.totalObjects >= 10, 'una decena necesita al menos 10 objetos.');
        requireValue(Number.isInteger(rules.minTarget) && Number.isInteger(rules.maxTarget) &&
            rules.minTarget >= 1 && rules.minTarget <= rules.maxTarget && rules.maxTarget <= rules.totalObjects,
            'rango objetivo inválido.');
        requireValue(Number.isInteger(rules.initialQuantity) && rules.initialQuantity >= 0 &&
            rules.initialQuantity <= rules.minTarget, 'initialQuantity debe estar entre 0 y minTarget.');
        requireValue(rules.responseKind === 'final-quantity', 'la respuesta debe ser la cantidad final.');
        const objects = definition.objects || {};
        for (const key of ['singular', 'plural', 'image']) {
            requireValue(typeof objects[key] === 'string' && objects[key].trim(), `falta objects.${key}.`);
        }
        // An image path is a project-relative URL, never an executable or remote URL.
        requireValue(/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|svg)$/i.test(objects.image),
            'objects.image debe ser una ruta relativa a un asset.');
        requireValue(typeof definition.instruction === 'string' && definition.instruction.includes('{target}') &&
            definition.instruction.includes('{objects}'), 'instruction debe incluir {target} y {objects}.');
        for (const key of ['reserveTitle', 'destinationTitle']) {
            requireValue(typeof definition.presentation?.[key] === 'string' && definition.presentation[key].trim(),
                `falta presentation.${key}.`);
        }
        return definition;
    }

    function copyDefinition(definition) {
        validateQuantityDefinition(definition);
        // A session owns its configuration; editing caller data cannot change an active task.
        return JSON.parse(JSON.stringify(definition));
    }

    function createQuantityChallengeFactory(definition, random = Math.random) {
        const config = copyDefinition(definition);
        requireValue(typeof random === 'function', 'random debe ser una función.');
        const { minTarget, maxTarget } = config.rules;
        let bag = [], previous = null, sequence = 0;
        return function nextChallenge() {
            if (!bag.length) {
                bag = Array.from({ length: maxTarget - minTarget + 1 }, (_, i) => minTarget + i);
                for (let i = bag.length - 1; i > 0; i--) {
                    const value = random();
                    requireValue(Number.isFinite(value) && value >= 0 && value < 1, 'random debe devolver [0, 1).');
                    const j = Math.floor(value * (i + 1));
                    [bag[i], bag[j]] = [bag[j], bag[i]];
                }
                if (bag.length > 1 && bag[bag.length - 1] === previous) {
                    [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
                }
            }
            previous = bag.pop();
            return {
                schemaVersion: 1,
                id: `${config.id}:attempt-${++sequence}`,
                definitionId: config.id,
                targetQuantity: previous,
                definition: JSON.parse(JSON.stringify(config))
            };
        };
    }

    class QuantitySession {
        constructor(challenge) {
            requireValue(challenge && challenge.schemaVersion === 1 && typeof challenge.id === 'string', 'desafío inválido.');
            this.definition = copyDefinition(challenge.definition);
            const rules = this.definition.rules;
            requireValue(Number.isInteger(challenge.targetQuantity) && challenge.targetQuantity >= rules.minTarget &&
                challenge.targetQuantity <= rules.maxTarget, 'cantidad objetivo fuera del rango.');
            this.challengeId = challenge.id;
            this.targetQuantity = challenge.targetQuantity;
            this.tokens = Array.from({ length: rules.totalObjects }, (_, i) => i + 1);
            this.placed = new Set(this.tokens.slice(0, rules.initialQuantity));
            this.status = 'playing';
            this.attempts = 0;
            this.hintsUsed = 0;
            this.hintLevel = 0;
            this.demonstrationUsed = false;
            this.countingUsed = false;
            this.counting = false;
            this.groups = new Map();
            this.groupSequence = 0;
            this.representationActions = { grouped: 0, ungrouped: 0, transferred: 0 };
        }

        move(tokenId, destination) {
            if (this.status !== 'playing' || !this.tokens.includes(tokenId) ||
                !['reserve', 'chest'].includes(destination)) return false;
            if ([...this.groups.values()].some(tokens => tokens.includes(tokenId))) return false;
            const wasPlaced = this.placed.has(tokenId);
            if (wasPlaced === (destination === 'chest')) return false;
            if (destination === 'chest') this.placed.add(tokenId);
            else this.placed.delete(tokenId);
            return true;
        }

        groupTen(location, tokenIds) {
            if (this.status !== 'playing' || !this.definition.rules.allowTens || !['reserve', 'chest'].includes(location)) return null;
            const packed = new Set([...this.groups.values()].flat());
            const available = this.tokens.filter(id => this.placed.has(id) === (location === 'chest') && !packed.has(id));
            const selected = tokenIds === undefined ? available.slice(0, 10) : tokenIds;
            if (!Array.isArray(selected) || selected.length !== 10 || new Set(selected).size !== 10 ||
                !selected.every(id => available.includes(id))) return null;
            const id = `${this.challengeId}:ten-${++this.groupSequence}`;
            this.groups.set(id, [...selected]);
            this.representationActions.grouped++;
            return id;
        }

        ungroupTen(groupId) {
            if (this.status !== 'playing' || !this.groups.has(groupId)) return false;
            this.groups.delete(groupId);
            this.representationActions.ungrouped++;
            return true;
        }

        moveTen(groupId, destination) {
            const tokens = this.groups.get(groupId);
            if (this.status !== 'playing' || !tokens || !['reserve', 'chest'].includes(destination) ||
                this.placed.has(tokens[0]) === (destination === 'chest')) return false;
            for (const token of tokens) {
                if (destination === 'chest') this.placed.add(token);
                else this.placed.delete(token);
            }
            this.representationActions.transferred++;
            return true;
        }

        empty() {
            if (this.status !== 'playing' || this.placed.size === 0) return false;
            this.placed.clear();
            return true;
        }

        setCounting(enabled) {
            this.counting = Boolean(enabled);
            if (this.counting) this.countingUsed = true;
        }

        useHint() {
            if (this.status === 'playing') {
                this.hintsUsed++;
                this.hintLevel = Math.min(3, this.hintLevel + 1);
            }
            return this.hintLevel;
        }

        useDemonstration() {
            if (this.status === 'playing') this.demonstrationUsed = true;
        }

        getSnapshot() {
            const packed = new Set([...this.groups.values()].flat());
            return {
                challengeId: this.challengeId,
                targetQuantity: this.targetQuantity,
                initialQuantity: this.definition.rules.initialQuantity,
                totalObjects: this.tokens.length,
                placedTokens: [...this.placed],
                reserveTokens: this.tokens.filter(id => !this.placed.has(id)),
                loosePlacedTokens: [...this.placed].filter(id => !packed.has(id)),
                looseReserveTokens: this.tokens.filter(id => !this.placed.has(id) && !packed.has(id)),
                groups: [...this.groups].map(([id, tokenIds]) => ({ id, tokenIds: [...tokenIds],
                    location: this.placed.has(tokenIds[0]) ? 'chest' : 'reserve' })),
                placeValue: { tens: Math.floor(this.placed.size / 10), units: this.placed.size % 10 },
                representationActions: { ...this.representationActions },
                finalQuantity: this.placed.size,
                netChangeQuantity: this.placed.size - this.definition.rules.initialQuantity,
                status: this.status,
                attempts: this.attempts,
                counting: this.counting,
                assistance: {
                    hintsUsed: this.hintsUsed,
                    hintLevel: this.hintLevel,
                    countingUsed: this.countingUsed,
                    demonstrationUsed: this.demonstrationUsed
                }
            };
        }

        submit() {
            const firstCompletion = this.status === 'playing' && this.placed.size === this.targetQuantity;
            if (this.status === 'playing') {
                this.attempts++;
                if (firstCompletion) this.status = 'completed';
            }
            return {
                ...this.getSnapshot(),
                definitionId: this.definition.id,
                responseKind: 'final-quantity',
                isCorrect: this.status === 'completed',
                isNewCompletion: firstCompletion
            };
        }
    }

    function getQuantityHint(snapshot, objects) {
        const { finalQuantity: count, targetQuantity: target } = snapshot;
        const level = snapshot.assistance.hintLevel;
        const difference = target - count;
        const noun = value => objects[value === 1 ? 'singular' : 'plural'];
        const tensExplanation = target === 20 ? '20 = 10 + 10: dos decenas.'
            : target < 10 ? `${target} unidad${target === 1 ? '' : 'es'}: todavía no forman una decena.`
                : `${target} = 10 + ${target % 10}: 1 decena y ${target % 10} unidad${target % 10 === 1 ? '' : 'es'}.`;
        if (level <= 1) return {
            title: 'Pista 1 · Cuenta con calma',
            text: 'Cuenta cada objeto del cofre una sola vez. Después mira cuántos pide el capitán.' +
                (snapshot.totalObjects > 10 ? ' Cada marco tiene 10 espacios; un marco lleno puede formar una decena.' : ''),
            showCounting: false
        };
        if (level === 2) return {
            title: 'Pista 2 · Compara las cantidades',
            text: `En tu cofre hay ${count} ${noun(count)} y el capitán pidió ${target}. ` +
                (difference > 0 ? 'Necesitas añadir objetos.' : difference < 0 ? 'Necesitas devolver objetos.' : '¡Las cantidades son iguales! Puedes entregar el tesoro.') +
                (snapshot.totalObjects > 10 ? ' Una decena siempre vale 10, aunque la muevas agrupada.' : ''),
            showCounting: true
        };
        return {
            title: 'Pista 3 · Hagámoslo paso a paso',
            text: (difference > 0
                ? `Tienes ${count} y necesitas ${target}. Añade ${difference} ${noun(difference)}: ${count} + ${difference} = ${target}.`
                : difference < 0
                    ? `Tienes ${count} y necesitas ${target}. Devuelve ${-difference} ${noun(-difference)}: ${count} − ${-difference} = ${target}.`
                    : `Tienes exactamente ${target} ${noun(target)}. No hace falta mover más: pulsa «Entregar tesoro».`) +
                (snapshot.totalObjects > 10 ? ` ${tensExplanation}` : ''),
            showCounting: true
        };
    }

    return { validateQuantityDefinition, createQuantityChallengeFactory, QuantitySession, getQuantityHint };
});
