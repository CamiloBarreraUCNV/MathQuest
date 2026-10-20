const test = require('node:test');
const assert = require('node:assert/strict');
const { NumberlineSession, createNumberlineChallengeFactory, validateNumberlineDefinition } = require('../js/activities/numberline-model.js');
const { NUMBERLINE_PRACTICES } = require('../js/activities/numberline-data.js');
function session({ start = 4, direction = 1, stepSize = 2, jumpCount = 3, max = 20 } = {}) {
    return new NumberlineSession({ schemaVersion: 1, id: 'fixed', definition: NUMBERLINE_PRACTICES[max].mixed[0], start, direction, stepSize, jumpCount });
}
test('every configuration produces bounded routes, allowed directions and steps without immediate repeats', () => {
    for (const max of [20, 100]) for (const direction of ['forward', 'backward', 'mixed']) for (const step of [0, 1, 2, 5, 10]) {
        for (const random of [() => 0, () => 0.999999, Math.random]) {
            const definition = structuredClone(NUMBERLINE_PRACTICES[max][direction][step]);
            const next = createNumberlineChallengeFactory(definition, random); definition.maxNumber = 1;
            let previous;
            for (let i = 0; i < 40; i++) {
                const challenge = next(), s = new NumberlineSession(challenge), state = s.getSnapshot();
                const route = JSON.stringify([state.start, state.direction, state.stepSize, state.jumpCount]);
                assert.notEqual(route, previous); previous = route;
                assert.ok(state.target >= 0 && state.target <= max); assert.ok(state.jumpCount >= 1 && state.jumpCount <= 4);
                if (step) assert.equal(state.stepSize, step);
                if (direction !== 'mixed') assert.equal(state.direction, direction === 'forward' ? 1 : -1);
                for (let j = 0; j < state.jumpCount; j++) assert.equal(s.jump(state.direction, state.stepSize), true);
                assert.equal(s.submit().isNewCompletion, true);
            }
        }
    }
});
test('small bags exhaust unique routes and refill without an immediate repeat', () => {
    const next = createNumberlineChallengeFactory(NUMBERLINE_PRACTICES[20].forward[10], () => 0);
    let previous;
    for (let i = 0; i < 4; i++) {
        const bag = Array.from({ length: 12 }, () => next());
        const keys = bag.map(c => `${c.start}:${c.jumpCount}`);
        assert.equal(new Set(keys).size, 12); assert.notEqual(keys[0], previous); previous = keys.at(-1);
    }
});
test('invalid definitions, out-of-range routes and malformed numbers fail before starting', () => {
    for (const mutate of [d => d.type = 'pattern', d => d.direction = 'sideways', d => d.stepSize = 3,
        d => d.maxNumber = 10, d => d.grade = 0, d => d.id = '', d => d.objectiveIds = []]) {
        const definition = structuredClone(NUMBERLINE_PRACTICES[20].mixed[0]); mutate(definition);
        assert.throws(() => validateNumberlineDefinition(definition), TypeError);
    }
    for (const options of [{ start: -1 }, { start: 20 }, { start: 0, direction: -1 }, { direction: 0 },
        { stepSize: '2' }, { stepSize: 3 }, { jumpCount: 0 }, { jumpCount: 5 }, { start: 1.5 }]) assert.throws(() => session(options), TypeError);
    for (const random of [() => 1, () => -1, () => NaN]) assert.throws(() => createNumberlineChallengeFactory(NUMBERLINE_PRACTICES[20].forward[1], random)(), TypeError);
});
test('the complete route is required: reaching the target with other sizes or direction is not sufficient', () => {
    const s = session({ start: 0, jumpCount: 4 });
    for (const size of [1, 1, 1, 5]) s.jump(1, size);
    assert.equal(s.getSnapshot().position, 8); assert.equal(s.submit().isCorrect, false);
    assert.equal(s.getSnapshot().jumps.length, 4);
    s.reset(); for (let i = 0; i < 4; i++) s.jump(1, 2);
    assert.equal(s.submit().isNewCompletion, true);
    const other = session({ start: 5, jumpCount: 2 });
    other.jump(1, 5); other.jump(-1, 1);
    assert.equal(other.getSnapshot().position, 9); assert.equal(other.submit().isCorrect, false);
});
test('undo, reset and bounds preserve continuous routes, including endpoints zero and one hundred', () => {
    for (const start of [0, 100]) {
        const s = session({ start, max: 100, direction: start ? -1 : 1, stepSize: 10, jumpCount: 2 });
        assert.equal(s.jump(start ? 1 : -1, 1), false); assert.deepEqual(s.getSnapshot().jumps, []);
        s.jump(start ? -1 : 1, 10); const state = s.getSnapshot();
        assert.equal(s.jump(0, 10), false); assert.equal(s.jump(1, '1'), false);
        assert.deepEqual(s.getSnapshot().jumps, state.jumps);
        assert.equal(s.undo(), true); assert.equal(s.getSnapshot().position, start); assert.equal(s.undo(), false);
        s.jump(start ? -1 : 1, 10); s.reset(); assert.equal(s.getSnapshot().position, start);
    }
    const toZero = session({ start: 20, direction: -1, stepSize: 10, jumpCount: 2 });
    toZero.jump(-1, 10); toZero.jump(-1, 10); assert.equal(toZero.submit().position, 0); assert.equal(toZero.isCorrect(), true);
    const toHundred = session({ start: 80, max: 100, stepSize: 10, jumpCount: 2 });
    toHundred.jump(1, 10); toHundred.jump(1, 10); assert.equal(toHundred.submit().position, 100); assert.equal(toHundred.isCorrect(), true);
});
test('partial routes never finish and completion locks movements and only emits once', () => {
    const s = session(); assert.equal(s.submit().isCorrect, false);
    s.jump(1, 2); s.jump(1, 2); assert.equal(s.submit().isCorrect, false);
    s.jump(1, 2); assert.equal(s.submit().isNewCompletion, true);
    assert.equal(s.submit().isNewCompletion, false);
    assert.equal(s.jump(-1, 2), false); assert.equal(s.undo(), false); assert.equal(s.reset(), false);
});
test('hints and demonstration record assistance without moving, answering or mutating snapshots', () => {
    const s = session(); s.jump(1, 1);
    const before = s.getSnapshot().jumps;
    for (let i = 0; i < 4; i++) { s.useHint(); assert.ok(s.getHint().length > 20); }
    s.useDemonstration(); const snapshot = s.getSnapshot();
    assert.equal(snapshot.status, 'playing'); assert.equal(snapshot.assistance.hintLevel, 3);
    assert.equal(snapshot.assistance.hintsUsed, 4); assert.equal(snapshot.assistance.demonstrationUsed, true);
    assert.deepEqual(snapshot.jumps, before); assert.match(s.getHint(), /4 → 6 → 8 → 10/);
    snapshot.jumps[0].to = 999; snapshot.assistance.hintsUsed = 99;
    assert.deepEqual(s.getSnapshot().jumps, before); assert.equal(s.getSnapshot().assistance.hintsUsed, 4);
});
test('exploration remains bounded to twelve jumps and undo reopens space without changing the goal', () => {
    const s = session();
    for (let i = 0; i < 12; i++) assert.equal(s.jump(i % 2 ? -1 : 1, 1), true);
    assert.equal(s.jump(1, 1), false); assert.equal(s.getSnapshot().jumps.length, 12);
    s.undo(); assert.equal(s.jump(-1, 1), true); assert.equal(s.getSnapshot().target, 10);
});
