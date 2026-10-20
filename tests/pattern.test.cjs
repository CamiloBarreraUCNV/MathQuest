const test = require('node:test');
const assert = require('node:assert/strict');
const { PatternSession, createPatternChallengeFactory, validatePatternDefinition } = require('../js/activities/pattern-model.js');
const { PATTERN_PRACTICES } = require('../js/activities/pattern-data.js');
const shapes = { AB: [0, 1], AAB: [0, 0, 1], ABC: [0, 1, 2] };
function fixed(family, mode, maxNumber = 20, rule = family === 'number' ? [2, 2] : family === 'ABC' ? ['leaf', 'shell', 'star'] : ['leaf', 'shell']) {
    const definition = PATTERN_PRACTICES[maxNumber][family][mode];
    const challenge = { schemaVersion: 1, id: 'fixed', definition, rule, repairIndex: family === 'number' ? 2 : shapes[family].length };
    return new PatternSession(challenge);
}
function solve(session, values) { values.forEach((value, i) => session.set(i, value)); return session.submit(); }
function expected(family) { return family === 'number' ? [2, 4, 6, 8, 10, 12] : Array.from({ length: shapes[family].length * 3 }, (_, i) => ['leaf', 'shell', 'star'][shapes[family][i % shapes[family].length]]); }

test('every mode and family produces varied bounded challenges, also with extreme constant random values', () => {
    for (const max of [20, 100]) for (const family of ['AB', 'AAB', 'ABC', 'number']) for (const mode of ['continue', 'create', 'repair']) {
        for (const random of [() => 0, () => 0.999999, Math.random]) {
            const definition = structuredClone(PATTERN_PRACTICES[max][family][mode]);
            const next = createPatternChallengeFactory(definition, random); definition.family = 'bad';
            let previous;
            for (let i = 0; i < 50; i++) {
                const challenge = next();
                assert.notEqual(JSON.stringify(challenge.rule), previous); previous = JSON.stringify(challenge.rule);
                const session = new PatternSession(challenge), state = session.getSnapshot();
                assert.ok(state.values.length >= 6);
                assert.equal(state.status, 'playing');
                if (mode === 'repair') assert.equal(state.values.filter((v, index) => v !== session.expected[index]).length, 1);
                if (family === 'number') assert.ok(session.expected.every(v => v >= 1 && v <= max));
            }
        }
    }
});

test('invalid definitions and malformed rules fail before a session can start', () => {
    for (const mutate of [d => d.mode = 'other', d => d.family = 'AAA', d => d.maxNumber = 10, d => d.grade = 0,
        d => d.type = 'quantity', d => d.id = '', d => d.skillIds = []]) {
        const d = structuredClone(PATTERN_PRACTICES[20].AB.continue); mutate(d);
        assert.throws(() => validatePatternDefinition(d), TypeError);
    }
    for (const rule of [['leaf', 'leaf'], ['other', 'shell'], []]) assert.throws(() => fixed('AB', 'continue', 20, rule), TypeError);
    for (const rule of [[1, 0], [1, 5], [19, 2], [0, 1], [2.5, 1], [20, -10], [1, '2']]) assert.throws(() => fixed('number', 'repair', 20, rule), TypeError);
    for (const random of [() => 1, () => -1, () => NaN]) assert.throws(() => createPatternChallengeFactory(PATTERN_PRACTICES[20].AB.continue, random)(), TypeError);
});

test('continuing requires every missing position and preserves fixed pieces', () => {
    for (const family of ['AB', 'AAB', 'ABC', 'number']) {
        const session = fixed(family, 'continue');
        assert.equal(session.set(0, null), false);
        assert.equal(session.set(-1, 'leaf'), false); assert.equal(session.set(100, 'leaf'), false);
        assert.equal(session.submit().isCorrect, false);
        const state = session.getSnapshot(), target = expected(family), first = state.editable.indexOf(true);
        session.set(first, target[first]);
        assert.equal(session.submit().isCorrect, false);
        const done = solve(session, target); assert.equal(done.isNewCompletion, true);
        assert.equal(session.submit().isNewCompletion, false); assert.equal(session.set(first, null), false); assert.equal(session.reset(), false);
    }
});

test('repair retains a wrong attempt, resets to the original error and validates the entire sequence', () => {
    for (const family of ['AB', 'AAB', 'ABC', 'number']) {
        const session = fixed(family, 'repair'), initial = session.getSnapshot().values;
        assert.equal(session.submit().isCorrect, false);
        session.set(0, family === 'number' ? 3 : 'flower');
        assert.equal(session.submit().isCorrect, false);
        session.reset(); assert.deepEqual(session.getSnapshot().values, initial);
        assert.equal(solve(session, expected(family)).isNewCompletion, true);
    }
});

test('creating accepts student choices and requires genuinely distinct letters in AB, AAB and ABC', () => {
    for (const family of ['AB', 'AAB', 'ABC']) {
        const session = fixed(family, 'create'), length = expected(family).length;
        assert.equal(solve(session, Array(length).fill('leaf')).isCorrect, false);
        const shape = shapes[family], unit = ['flower', 'star', 'shell'];
        const own = Array.from({ length }, (_, i) => unit[shape[i % shape.length]]);
        session.set(length - 1, 'leaf');
        own.slice(0, -1).forEach((v, i) => session.set(i, v));
        assert.equal(session.submit().isCorrect, false);
        assert.equal(solve(session, own).isNewCompletion, true);
        assert.deepEqual(session.getSnapshot().values, own);
    }
    const abc = fixed('ABC', 'create');
    assert.equal(solve(abc, ['leaf', 'shell', 'leaf', 'leaf', 'shell', 'leaf', 'leaf', 'shell', 'leaf']).isCorrect, false);
});

test('numeric creation accepts ascending and descending fixed steps, rejects irregular or out of range series', () => {
    for (const max of [20, 100]) for (const step of max === 20 ? [1, 2] : [1, 2, 5, 10]) for (const direction of [1, -1]) {
        const session = fixed('number', 'create', max);
        const start = direction === 1 ? 1 : max;
        assert.equal(solve(session, Array(6).fill(2)).isCorrect, false);
        assert.equal(session.set(0, max + 1), false); assert.equal(session.set(0, 0), false);
        assert.equal(session.set(0, '2'), false); assert.equal(session.set(0, 1.5), false);
        const own = Array.from({ length: 6 }, (_, i) => start + direction * step * i);
        assert.equal(solve(session, own).isNewCompletion, true);
    }
    assert.equal(solve(fixed('number', 'create'), [1, 2, 3, 5, 6, 7]).isCorrect, false);
    assert.equal(solve(fixed('number', 'create'), [1, 4, 7, 10, 13, 16]).isCorrect, false);
});

test('hints, grouping and examples record help without moving pieces or completing; snapshots are isolated', () => {
    for (const family of ['AB', 'AAB', 'ABC', 'number']) for (const mode of ['continue', 'create', 'repair']) {
        const session = fixed(family, mode), before = session.getSnapshot().values;
        for (let i = 1; i <= 4; i++) { session.useHint(); assert.ok(session.getHint().length > 20); }
        session.useGrouping(); session.useDemonstration();
        const state = session.getSnapshot(); assert.deepEqual(state.values, before); assert.equal(state.status, 'playing');
        assert.equal(state.assistance.hintLevel, 3); assert.equal(state.assistance.hintsUsed, 4);
        assert.equal(state.assistance.demonstrationUsed, true); assert.equal(state.assistance.groupingUsed, true);
        state.values[0] = 'bad'; state.editable[0] = false; state.assistance.hintsUsed = 99;
        assert.deepEqual(session.getSnapshot().values, before); assert.equal(session.getSnapshot().assistance.hintsUsed, 4);
    }
});
