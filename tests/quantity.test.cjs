const test = require('node:test');
const assert = require('node:assert/strict');
const { QuantitySession, createQuantityChallengeFactory, validateQuantityDefinition, getQuantityHint } = require('../js/activities/quantity-model.js');
const { QUANTITY_PRACTICE, QUANTITY_PRACTICE_20 } = require('../js/activities/quantity-data.js');
const copy = () => JSON.parse(JSON.stringify(QUANTITY_PRACTICE));
function fixedSession(target, initial = 0) {
    const definition = copy();
    Object.assign(definition.rules, { minTarget: target, maxTarget: target, initialQuantity: initial });
    return new QuantitySession(createQuantityChallengeFactory(definition)());
}

test('random practice covers every amount per bag and avoids immediate repeats across bags', () => {
    let seed = 19;
    const random = () => ((seed = seed * 16807 % 2147483647) / 2147483647);
    const next = createQuantityChallengeFactory(QUANTITY_PRACTICE, random);
    const tasks = Array.from({ length: 1000 }, () => next());
    assert.equal(new Set(tasks.map(task => task.id)).size, 1000);
    for (let i = 0; i < tasks.length; i += 10) {
        assert.deepEqual(tasks.slice(i, i + 10).map(task => task.targetQuantity).sort((a, b) => a - b), [1,2,3,4,5,6,7,8,9,10]);
    }
    assert.ok(tasks.every((task, i) => !i || task.targetQuantity !== tasks[i - 1].targetQuantity));
});

test('a reduced range and a fixed target are valid configurations', () => {
    const definition = copy();
    Object.assign(definition.rules, { minTarget: 3, maxTarget: 5, totalObjects: 5 });
    const next = createQuantityChallengeFactory(definition, () => 0);
    assert.deepEqual(Array.from({ length: 3 }, () => next().targetQuantity).sort(), [3,4,5]);
    Object.assign(definition.rules, { minTarget: 5, maxTarget: 5 });
    const fixed = createQuantityChallengeFactory(definition);
    assert.equal(fixed().targetQuantity, 5);
    assert.equal(fixed().targetQuantity, 5);
});

test('invalid or ambiguous configuration fails before an activity starts', () => {
    for (const change of [
        d => d.schemaVersion = 2,
        d => d.type = 'balance-scale',
        d => d.rules.maxTarget = 11,
        d => d.rules.minTarget = 0,
        d => d.rules.initialQuantity = 2,
        d => d.rules.totalObjects = 21,
        d => d.rules.allowTens = 'yes',
        d => { d.rules.totalObjects = d.rules.maxTarget = 9; d.rules.allowTens = true; },
        d => d.rules.responseKind = 'added-quantity',
        d => d.objects.image = 'javascript:alert(1)',
        d => d.objects.image = '../secret.png',
        d => d.skillIds = [],
        d => d.instruction = 'Sin cantidad ni objetos'
    ]) {
        const definition = copy(); change(definition);
        assert.throws(() => validateQuantityDefinition(definition), TypeError);
    }
    assert.throws(() => createQuantityChallengeFactory(copy(), () => 1)(), TypeError);
    assert.throws(() => new QuantitySession({ schemaVersion: 1, id: 'bad', targetQuantity: 11, definition: copy() }), TypeError);
});

test('editing caller configuration or another challenge does not change an active session', () => {
    const definition = copy();
    const next = createQuantityChallengeFactory(definition, () => 0);
    definition.rules.totalObjects = 1;
    const challenge = next();
    const session = new QuantitySession(challenge);
    challenge.definition.rules.initialQuantity = 9;
    assert.equal(session.getSnapshot().totalObjects, 10);
    assert.equal(session.getSnapshot().initialQuantity, 0);
    assert.equal(next().definition.rules.totalObjects, 10);
});

test('adding, returning and invalid moves conserve distinct real objects', () => {
    const session = fixedSession(4);
    assert.equal(session.move(1, 'chest'), true);
    assert.equal(session.move(1, 'chest'), false);
    assert.equal(session.move(99, 'chest'), false);
    assert.equal(session.move(2, 'ocean'), false);
    for (let i = 0; i < 1000; i++) {
        session.move(i % 10 + 1, i % 3 ? 'chest' : 'reserve');
        const state = session.getSnapshot();
        const combined = [...state.placedTokens, ...state.reserveTokens];
        assert.equal(combined.length, 10);
        assert.equal(new Set(combined).size, 10);
    }
    session.empty();
    assert.equal(session.getSnapshot().finalQuantity, 0);
    assert.equal(session.getSnapshot().targetQuantity, 4);
});

test('both endpoints 1 and 10 can be completed', () => {
    for (const target of [1, 10]) {
        const session = fixedSession(target);
        for (let i = 1; i <= target; i++) session.move(i, 'chest');
        assert.equal(session.submit().isNewCompletion, true);
    }
});

test('too few or too many objects preserve the attempt and allow correction', () => {
    const session = fixedSession(2);
    session.move(1, 'chest');
    assert.equal(session.submit().isCorrect, false);
    session.move(2, 'chest'); session.move(3, 'chest');
    assert.equal(session.submit().isCorrect, false);
    assert.equal(session.getSnapshot().finalQuantity, 3);
    session.move(3, 'reserve');
    const result = session.submit();
    assert.equal(result.isCorrect, true);
    assert.equal(result.attempts, 3);
});

test('initial 4, final 10 and net change 6 remain separate response values', () => {
    const session = fixedSession(10, 4);
    assert.equal(session.getSnapshot().finalQuantity, 4);
    for (let i = 5; i <= 10; i++) session.move(i, 'chest');
    const result = session.submit();
    assert.equal(result.initialQuantity, 4);
    assert.equal(result.finalQuantity, 10);
    assert.equal(result.netChangeQuantity, 6);
    assert.equal(result.responseKind, 'final-quantity');
    assert.equal(result.isCorrect, true);
});

test('completion is emitted once and a finished challenge cannot be altered', () => {
    const session = fixedSession(1);
    session.move(1, 'chest');
    assert.equal(session.submit().isNewCompletion, true);
    assert.equal(session.submit().isNewCompletion, false);
    assert.equal(session.move(1, 'reserve'), false);
    assert.equal(session.empty(), false);
    assert.equal(session.getSnapshot().attempts, 1);
});

test('snapshots cannot mutate the session and assistance survives toggling counting off', () => {
    const session = fixedSession(1);
    session.useHint(); session.setCounting(true); session.setCounting(false);
    const snapshot = session.getSnapshot();
    snapshot.placedTokens.push(100);
    snapshot.reserveTokens.length = 0;
    snapshot.assistance.hintsUsed = 50;
    const current = session.getSnapshot();
    assert.equal(current.finalQuantity, 0);
    assert.equal(current.reserveTokens.length, 10);
    assert.deepEqual(current.assistance, { hintsUsed: 1, hintLevel: 1, countingUsed: true, demonstrationUsed: false });
    assert.equal(current.counting, false);
});

test('hints progress from counting to comparison and an exact explanation, capped at three', () => {
    const session = fixedSession(4);
    session.move(1, 'chest');
    session.useHint();
    let hint = getQuantityHint(session.getSnapshot(), session.definition.objects);
    assert.equal(hint.showCounting, false);
    assert.ok(!hint.text.includes('Añade 3'));
    session.useHint();
    hint = getQuantityHint(session.getSnapshot(), session.definition.objects);
    assert.equal(hint.showCounting, true);
    assert.match(hint.text, /hay 1 moneda/);
    session.useHint();
    hint = getQuantityHint(session.getSnapshot(), session.definition.objects);
    assert.match(hint.text, /Añade 3 monedas: 1 \+ 3 = 4/);
    session.useHint();
    assert.equal(session.getSnapshot().assistance.hintLevel, 3);
    assert.equal(session.getSnapshot().assistance.hintsUsed, 4);
    for (const token of [2, 3, 4, 5]) session.move(token, 'chest');
    hint = getQuantityHint(session.getSnapshot(), session.definition.objects);
    assert.match(hint.text, /Devuelve 1 moneda: 5 − 1 = 4/);
    session.move(5, 'reserve');
    assert.match(getQuantityHint(session.getSnapshot(), session.definition.objects).text, /exactamente 4 monedas/);
    assert.equal(session.getSnapshot().attempts, 0);
});

test('demonstration records assistance without moving objects, answering or completing', () => {
    const session = fixedSession(1);
    const before = session.getSnapshot();
    session.useDemonstration();
    const after = session.getSnapshot();
    assert.deepEqual(after.placedTokens, before.placedTokens);
    assert.deepEqual(after.reserveTokens, before.reserveTokens);
    assert.equal(after.attempts, 0);
    assert.equal(after.status, 'playing');
    assert.equal(after.assistance.demonstrationUsed, true);
    assert.equal(fixedSession(1).getSnapshot().assistance.hintLevel, 0);
});

function extendedSession(target = 20, initial = 0) {
    const definition = structuredClone(QUANTITY_PRACTICE_20);
    Object.assign(definition.rules, { minTarget: target, maxTarget: target, initialQuantity: initial });
    return new QuantitySession(createQuantityChallengeFactory(definition)());
}

test('extended random practice covers 1 through 20 and preserves the original definition', () => {
    const next = createQuantityChallengeFactory(QUANTITY_PRACTICE_20, () => 0.4);
    let previous;
    for (let bag = 0; bag < 10; bag++) {
        const targets = Array.from({ length: 20 }, () => next().targetQuantity);
        assert.notEqual(targets[0], previous);
        assert.deepEqual([...targets].sort((a, b) => a - b), Array.from({ length: 20 }, (_, i) => i + 1));
        previous = targets.at(-1);
    }
    assert.equal(QUANTITY_PRACTICE.rules.totalObjects, 10);
    assert.equal(QUANTITY_PRACTICE_20.rules.allowTens, true);
});

test('10 units group into one reversible ten without changing quantity, attempts or assistance', () => {
    const session = extendedSession(14, 14);
    const before = session.getSnapshot();
    const id = session.groupTen('chest');
    assert.ok(id);
    const grouped = session.getSnapshot();
    assert.equal(grouped.finalQuantity, 14);
    assert.equal(grouped.loosePlacedTokens.length, 4);
    assert.equal(grouped.groups[0].tokenIds.length, 10);
    assert.deepEqual(grouped.placeValue, { tens: 1, units: 4 });
    assert.equal(grouped.attempts, before.attempts);
    assert.deepEqual(grouped.assistance, before.assistance);
    assert.equal(session.move(grouped.groups[0].tokenIds[0], 'reserve'), false, 'separate a ten before moving one of its units');
    assert.equal(session.ungroupTen(id), true);
    assert.equal(session.getSnapshot().finalQuantity, 14);
    assert.equal(session.getSnapshot().loosePlacedTokens.length, 14);
    assert.equal(session.ungroupTen(id), false);
    assert.deepEqual(session.getSnapshot().representationActions, { grouped: 1, ungrouped: 1, transferred: 0 });
});

test('grouping rejects incomplete, duplicate, foreign or already grouped units atomically', () => {
    const session = extendedSession(20, 9);
    assert.equal(session.groupTen('chest'), null);
    assert.equal(session.groupTen('sea'), null);
    assert.equal(session.groupTen('reserve', Array(10).fill(10)), null);
    assert.equal(session.groupTen('reserve', [1,2,3,4,5,6,7,8,9,10]), null);
    assert.equal(session.groupTen('reserve', [10,11,12,13,14,15,16,17,18,99]), null);
    const tokens = [10,11,12,13,14,15,16,17,18,19];
    assert.ok(session.groupTen('reserve', tokens));
    tokens[0] = 99;
    assert.equal(session.groupTen('reserve'), null);
    assert.equal(session.getSnapshot().groups[0].tokenIds[0], 10);
    const snapshot = session.getSnapshot();
    snapshot.groups[0].tokenIds[0] = 90;
    snapshot.loosePlacedTokens.length = 0;
    snapshot.representationActions.grouped = 99;
    assert.equal(session.getSnapshot().groups[0].tokenIds[0], 10);
    assert.equal(session.getSnapshot().representationActions.grouped, 1);
    assert.equal(new QuantitySession(createQuantityChallengeFactory(QUANTITY_PRACTICE)()).groupTen('reserve'), null);
});

test('two tens make twenty, transfer as ten real coins each and lock after completion', () => {
    const session = extendedSession();
    const first = session.groupTen('reserve');
    const second = session.groupTen('reserve');
    assert.ok(first && second && first !== second);
    assert.equal(session.moveTen('forged', 'chest'), false);
    assert.equal(session.moveTen(first, 'sea'), false);
    assert.equal(session.moveTen(first, 'reserve'), false);
    assert.equal(session.moveTen(first, 'chest'), true);
    assert.equal(session.getSnapshot().finalQuantity, 10);
    assert.equal(session.submit().isCorrect, false);
    assert.equal(session.moveTen(first, 'reserve'), true);
    assert.equal(session.getSnapshot().finalQuantity, 0);
    session.moveTen(first, 'chest'); session.moveTen(second, 'chest');
    assert.equal(session.getSnapshot().finalQuantity, 20);
    assert.equal(session.getSnapshot().groups.filter(g => g.location === 'chest').length, 2);
    assert.deepEqual(session.getSnapshot().placeValue, { tens: 2, units: 0 });
    assert.equal(session.submit().isNewCompletion, true);
    assert.equal(session.submit().isNewCompletion, false);
    assert.equal(session.ungroupTen(first), false);
    assert.equal(session.moveTen(first, 'reserve'), false);
    assert.equal(session.groupTen('chest'), null);
});

test('correcting 20 to 19 requires returning one unit; grouping never becomes an answer', () => {
    const session = extendedSession(19);
    const first = session.groupTen('reserve'), second = session.groupTen('reserve');
    session.moveTen(first, 'chest'); session.moveTen(second, 'chest');
    assert.equal(session.submit().isCorrect, false);
    session.ungroupTen(second);
    const token = session.getSnapshot().loosePlacedTokens.at(-1);
    session.move(token, 'reserve');
    const result = session.submit();
    assert.equal(result.isCorrect, true);
    assert.equal(result.finalQuantity, 19);
    assert.equal(result.netChangeQuantity, 19);
    assert.deepEqual(result.placeValue, { tens: 1, units: 9 });
});

test('mixed individual moves, grouping, transfers and emptying always conserve exactly twenty objects', () => {
    const session = extendedSession();
    for (let i = 0; i < 800; i++) {
        const location = i % 3 ? 'reserve' : 'chest';
        session.groupTen(location);
        const group = session.getSnapshot().groups[0];
        if (group) {
            if (i % 4) session.moveTen(group.id, location);
            else session.ungroupTen(group.id);
        }
        session.move(i % 20 + 1, location);
        if (i % 29 === 0) session.empty();
        const state = session.getSnapshot();
        assert.equal(state.placedTokens.length + state.reserveTokens.length, 20);
        assert.equal(new Set([...state.placedTokens, ...state.reserveTokens]).size, 20);
        const grouped = state.groups.flatMap(g => g.tokenIds);
        assert.equal(new Set(grouped).size, grouped.length);
        assert.equal(state.loosePlacedTokens.length + state.looseReserveTokens.length + grouped.length, 20);
        for (const g of state.groups) assert.ok(g.tokenIds.every(id => (g.location === 'chest' ? state.placedTokens : state.reserveTokens).includes(id)));
    }
    session.empty();
    assert.equal(session.getSnapshot().finalQuantity, 0);
    assert.ok(session.getSnapshot().groups.every(g => g.location === 'reserve'));
});

test('extended hints explain tens, including 20 as 10 plus 10', () => {
    const session = extendedSession(20);
    session.useHint();
    assert.match(getQuantityHint(session.getSnapshot(), session.definition.objects).text, /10 espacios/);
    session.useHint(); session.useHint();
    assert.match(getQuantityHint(session.getSnapshot(), session.definition.objects).text, /20 = 10 \+ 10: dos decenas/);
});

test('boundaries 9, 10 and 11 and endpoints accept both loose and grouped representations', () => {
    for (const target of [1, 9, 10, 11, 19, 20]) for (const group of [false, true]) {
        const session = extendedSession(target);
        if (group) for (let i = 0; i < Math.floor(target / 10); i++) session.moveTen(session.groupTen('reserve'), 'chest');
        const before = session.getSnapshot();
        for (const token of before.looseReserveTokens.slice(0, target - before.finalQuantity)) session.move(token, 'chest');
        const result = session.submit();
        assert.equal(result.isNewCompletion, true, `${target}, grouping ${group}`);
        assert.equal(result.finalQuantity, target);
        assert.equal(result.placeValue.tens * 10 + result.placeValue.units, target);
        assert.equal(result.groups.length, group ? Math.floor(target / 10) : 0);
    }
});
