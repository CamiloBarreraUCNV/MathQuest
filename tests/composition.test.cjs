const test = require('node:test');
const assert = require('node:assert/strict');
const { CompositionSession, createCompositionChallengeFactory, validateCompositionDefinition, getCompositionHint } = require('../js/activities/composition-model.js');
const { COMPOSITION_PRACTICES } = require('../js/activities/composition-data.js');
function session(mode, total, given = 0, max = 20) {
    return new CompositionSession({ schemaVersion: 1, id: 'test', definition: COMPOSITION_PRACTICES[max][mode], targetQuantity: total, givenLeft: given });
}
function place(s, left, right) {
    s.resetPlacement();
    const state = s.getSnapshot();
    for (const id of state.parts.reserve.slice(0, left)) s.move(id, 'left');
    for (const id of s.getSnapshot().parts.reserve.slice(0, right)) s.move(id, 'right');
}

test('factories vary totals without repeats, keep givens valid and isolate configuration', () => {
    for (const mode of ['compose', 'missing', 'split']) {
        const d = structuredClone(COMPOSITION_PRACTICES[20][mode]);
        const next = createCompositionChallengeFactory(d, () => 0.37); d.maxTarget = 2;
        let previous;
        for (let bag = 0; bag < 4; bag++) {
            const range = 21 - COMPOSITION_PRACTICES[20][mode].minTarget;
            const tasks = Array.from({ length: range }, () => next());
            assert.equal(new Set(tasks.map(t => t.targetQuantity)).size, range);
            assert.notEqual(tasks[0].targetQuantity, previous);
            assert.ok(tasks.every(t => mode === 'split' ? t.givenLeft === 0 : t.givenLeft >= 1 && t.givenLeft < t.targetQuantity));
            previous = tasks.at(-1).targetQuantity;
        }
        const task = next(), active = new CompositionSession(task); task.definition.maxTarget = 1;
        assert.equal(active.definition.maxTarget, 20);
    }
});

test('invalid definitions, totals, givens and random functions fail before starting', () => {
    for (const change of [d => d.mode = 'other', d => d.minTarget = 0, d => d.maxTarget = 21,
        d => d.type = 'quantity', d => d.skillIds = [], d => d.grade = 0, d => d.id = '']) {
        const d = structuredClone(COMPOSITION_PRACTICES[10].compose); change(d);
        assert.throws(() => validateCompositionDefinition(d), TypeError);
    }
    assert.throws(() => session('compose', 21), TypeError);
    assert.throws(() => session('missing', 8, 9), TypeError);
    for (const mode of ['compose', 'missing']) {
        assert.throws(() => session(mode, 8, 0), TypeError);
        assert.throws(() => session(mode, 8, 8), TypeError);
        for (const random of [() => 0, () => 0.999999]) {
            const next = createCompositionChallengeFactory(COMPOSITION_PRACTICES[10][mode], random);
            for (let i = 0; i < 20; i++) {
                const task = next();
                assert.ok(task.givenLeft >= 1 && task.givenLeft < task.targetQuantity);
            }
        }
    }
    for (const mode of ['compose', 'missing', 'split']) {
        const d = structuredClone(COMPOSITION_PRACTICES[10][mode]);
        d.minTarget = mode === 'split' ? 3 : 1;
        assert.throws(() => validateCompositionDefinition(d), TypeError);
    }
    assert.throws(() => session('split', 8, 1), TypeError);
    assert.throws(() => createCompositionChallengeFactory(COMPOSITION_PRACTICES[10].compose, () => 1)(), TypeError);
});

test('composition validates a typed integer total for every positive part pair', () => {
    for (let total = 2; total <= 20; total++) for (let left = 1; left < total; left++) {
        const s = session('compose', total, left);
        assert.equal(s.move(1, 'reserve'), false);
        assert.equal(s.resetPlacement(), false);
        assert.equal(s.submit(total - 1).isCorrect, false);
        assert.equal(s.getSnapshot().parts.left.length, left);
        assert.equal(s.getSnapshot().parts.right.length, total - left);
        assert.equal(s.submit(total).isNewCompletion, true);
        assert.equal(s.submit(total).isNewCompletion, false);
    }
    for (const bad of [null, '', '8', NaN, Infinity, 2.5, -1, 0, 1, 21]) assert.equal(session('compose', 8, 3).submit(bad).invalidAnswer, true);
});

test('missing part protects the given, preserves wrong attempts and always needs a positive part', () => {
    for (let total = 2; total <= 20; total++) for (let given = 1; given < total; given++) {
        const s = session('missing', total, given);
        assert.equal(s.move(1, 'left'), false);
        if (given) assert.equal(s.move(1, 'right'), false);
        assert.equal(s.getSnapshot().parts.left.length, given);
        for (const token of s.getSnapshot().parts.reserve.slice(0, total - given)) s.move(token, 'right');
        assert.equal(s.submit().isNewCompletion, true);
        assert.equal(s.getSnapshot().rightQuantity, total - given);
    }
    const s = session('missing', 8, 3);
    for (const token of s.getSnapshot().parts.reserve.slice(0, 6)) s.move(token, 'right');
    assert.equal(s.submit().isCorrect, false);
    assert.equal(s.getSnapshot().rightQuantity, 6);
    s.move(s.getSnapshot().parts.right.at(-1), 'reserve');
    assert.equal(s.submit().isCorrect, true);
});

test('split needs two genuinely distinct pairs; swapped parts and duplicate submissions cannot finish', () => {
    const s = session('split', 8);
    place(s, 3, 5);
    const first = s.submit();
    assert.equal(first.status, 'solution-found'); assert.equal(first.isCorrect, false);
    assert.equal(s.move(1, 'reserve'), false);
    assert.equal(s.submit().newSolution, false);
    assert.equal(s.tryAnother(), true);
    assert.equal(s.getSnapshot().finalQuantity, 0);
    place(s, 5, 3);
    assert.equal(s.submit().duplicate, true);
    assert.equal(s.getSnapshot().solutions.length, 1);
    place(s, 4, 4);
    const done = s.submit();
    assert.equal(done.isNewCompletion, true);
    assert.deepEqual(done.solutions, [{ left: 3, right: 5 }, { left: 4, right: 4 }]);
    assert.equal(s.isCorrect(), true);
    assert.equal(s.tryAnother(), false);
    assert.equal(s.resetPlacement(), false);
    assert.equal(s.submit().isNewCompletion, false);
});

test('all positive decompositions from four to twenty are accepted with a different pair', () => {
    for (let total = 4; total <= 20; total++) for (let left = 1; left < total; left++) {
        const s = session('split', total);
        place(s, left, total - left); assert.equal(s.submit().newSolution, true); s.tryAnother();
        const other = Math.min(left, total - left) === 1 ? 2 : 1;
        place(s, other, total - other); assert.equal(s.submit().isNewCompletion, true);
    }
});

test('empty baskets cannot record solutions, including after a first valid pair', () => {
    const s = session('split', 4);
    for (const [left, right] of [[0, 4], [4, 0]]) {
        place(s, left, right);
        const result = s.submit();
        assert.equal(result.emptyPart, true);
        assert.equal(result.newSolution, false);
        assert.equal(result.status, 'playing');
        assert.equal(result.solutions.length, 0);
    }
    place(s, 1, 3); s.submit(); s.tryAnother();
    place(s, 0, 4); assert.equal(s.submit().solutions.length, 1);
    s.useHint(); s.useHint(); s.useHint();
    assert.match(getCompositionHint(s.getSnapshot()).text, /2 \+ 2/);
    place(s, 2, 2); assert.equal(s.submit().isNewCompletion, true);
});

test('wrong sums do not enter solution history; reset protects fixed tokens and conservation', () => {
    for (const mode of ['missing', 'split']) {
        const s = session(mode, 10, mode === 'missing' ? 4 : 0);
        for (let i = 0; i < 600; i++) {
            s.move(i % 20 + 1, ['left', 'right', 'reserve'][i % 3]);
            if (i % 13 === 0) s.resetPlacement();
            const snapshot = s.getSnapshot(), tokens = Object.values(snapshot.parts).flat();
            assert.equal(tokens.length, 20); assert.equal(new Set(tokens).size, 20);
            if (mode === 'missing') assert.equal(snapshot.leftQuantity, 4);
        }
    }
    const s = session('split', 8); place(s, 2, 3);
    assert.equal(s.submit().isCorrect, false); assert.equal(s.getSnapshot().solutions.length, 0);
});

test('help and example never solve or move real objects; snapshots are defensive copies', () => {
    const s = session('split', 8); place(s, 3, 5); s.submit(); s.tryAnother();
    s.useHint(); s.useHint(); s.useHint(); s.useDemonstration(); s.setCounting(true);
    const state = s.getSnapshot();
    assert.match(getCompositionHint(state).text, /1 \+ 7/);
    assert.equal(state.finalQuantity, 0); assert.equal(state.status, 'playing');
    state.parts.left.push(99); state.solutions[0].left = 999; state.assistance.hintsUsed = 99;
    assert.equal(s.getSnapshot().parts.left.length, 0);
    assert.equal(s.getSnapshot().solutions[0].left, 3);
    assert.equal(s.getSnapshot().assistance.hintsUsed, 3);
    assert.equal(s.getSnapshot().assistance.demonstrationUsed, true);
    assert.match(getCompositionHint(Object.assign(s.getSnapshot(), { mode: 'missing', givenLeft: 3, targetQuantity: 8 })).text, /3 \+ 5 = 8/);
});
