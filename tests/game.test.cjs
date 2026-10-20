const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function setup(save = null, random = Math.random) {
    const storage = new Map();
    if (save !== null) storage.set('mathquest_save_data_v1', save);
    const math = Object.create(Math);
    math.random = random;
    const context = vm.createContext({
        Math: math,
        console: { error() {} },
        localStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, value)
        }
    });
    for (const file of ['activities/quantity-model.js', 'activities/quantity-data.js', 'activities/composition-model.js', 'activities/composition-data.js', 'activities/pattern-model.js', 'activities/pattern-data.js', 'activities/numberline-model.js', 'activities/numberline-data.js', 'levels-data.js', 'game.js']) {
        vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context);
    }
    const Engine = vm.runInContext('MathQuestEngine', context);
    return { engine: new Engine(), Engine, levels: context.LEVELS_DATA, storage };
}

function answer(engine, correct) {
    const question = engine.getCurrentQuestion();
    return engine.submitAnswer(correct ? question.correct : (question.correct + 1) % question.options.length);
}

function play(engine, answers) {
    let next;
    for (const correct of answers) {
        assert.ok(answer(engine, correct));
        next = engine.nextQuestion();
        if (next.finished) break;
    }
    return next;
}

function deliverQuantity(session) {
    const state = session.getSnapshot();
    for (const token of state.reserveTokens.slice(0, state.targetQuantity)) session.move(token, 'chest');
    return session.submit();
}

test('quantity pilot validates five distinct model completions and awards only once at the end', () => {
    const { engine, Engine } = setup();
    engine.state.hearts = 0;
    let session = engine.startQuantityLevel(1);
    assert.ok(session, 'practice remains available without combat hearts');
    assert.equal(engine.startQuantityLevel(2), null);
    assert.equal(engine.submitAnswer(0), null);
    assert.equal(engine.nextQuestion(), null);
    assert.equal(engine.finishLevel(), null);
    const targets = new Set();
    let completion;
    for (let i = 0; i < 5; i++) {
        targets.add(session.targetQuantity);
        // Wrong answers and hints retain all coins and hearts, and grant no XP.
        assert.equal(session.submit().isCorrect, false);
        session.useHint();
        session.useDemonstration();
        assert.equal(engine.acceptQuantityCompletion({ challengeId: session.challengeId, isCorrect: true }), null);
        assert.equal(engine.state.xp, 0);
        const result = deliverQuantity(session);
        assert.equal(engine.acceptQuantityCompletion({ challengeId: 'forged' }), null);
        completion = engine.acceptQuantityCompletion(result);
        assert.equal(engine.acceptQuantityCompletion(result), null);
        if (i < 4) {
            assert.equal(completion.finished, false);
            assert.equal(engine.state.xp, 0);
            assert.equal(engine.getLevelStars(1), 0);
            assert.equal(engine.isLevelUnlocked(2), false);
            session = engine.nextQuantitySession();
            assert.equal(engine.nextQuantitySession(), session, 'cannot skip a pending challenge');
        }
    }
    assert.equal(targets.size, 5);
    assert.equal(completion.results.activityType, 'quantity');
    assert.equal(completion.results.score, 5);
    assert.equal(completion.results.total, 5);
    assert.equal(completion.results.stars, 3);
    assert.equal(completion.results.bonusXp, 85);
    assert.equal(completion.results.activitySummary[0].attempts, 2);
    assert.equal(completion.results.activitySummary[0].assistance.demonstrationUsed, true);
    assert.equal(engine.state.hearts, 0);
    assert.equal(engine.finishLevel(), completion.results);
    assert.equal(engine.state.xp, 85);
    assert.equal(engine.nextQuantitySession(), null);
    assert.equal(engine.isLevelUnlocked(2), true);
    assert.equal(new Engine().getLevelStars(1), 3);
    assert.equal(new Engine().state.xp, 85);
    assert.equal(engine.state.achievements.streak_5.unlocked, false);
});

test('abandoning or resetting a quantity pilot rejects old results and grants no progress', () => {
    const { engine, Engine } = setup();
    const old = engine.startQuantityLevel(1);
    engine.acceptQuantityCompletion(deliverQuantity(old));
    engine.cancelSession();
    assert.equal(engine.acceptQuantityCompletion(old.submit()), null);
    assert.equal(engine.nextQuantitySession(), null);
    assert.equal(engine.finishLevel(), null);
    assert.equal(new Engine().getLevelStars(1), 0);
    assert.equal(new Engine().state.xp, 0);
    engine.startQuantityLevel(1);
    assert.equal(engine.acceptQuantityCompletion(old.submit()), null);
    engine.startLevel(1);
    assert.equal(engine.quantityRun, null);
    assert.equal(engine.acceptQuantityCompletion(old.submit()), null);
    assert.ok(answer(engine, true));
    engine.startQuantityLevel(1);
    engine.resetProgress();
    assert.equal(engine.quantityRun, null);
    assert.equal(engine.acceptQuantityCompletion(old.submit()), null);
    assert.equal(engine.state.xp, 0);
});

test('the pilot preserves existing stars, other worlds and save schema; a replay earns one completion bonus', () => {
    const { engine, Engine } = setup();
    engine.state.xp = 400;
    engine.state.worldProgress['world-1'].unlockedLevelId = 4;
    engine.state.worldProgress['world-2'].unlockedLevelId = 7;
    engine.state.completedLevels[1] = { completed: true, stars: 3, score: 20, highStreak: 8 };
    engine.state.completedLevels[5] = { completed: true, stars: 2, score: 16, highStreak: 4 };
    const other = JSON.stringify(engine.state.completedLevels[5]);
    for (let run = 0; run < 2; run++) {
        engine.startQuantityLevel(1);
        for (let round = 0; round < 5; round++) engine.acceptQuantityCompletion(deliverQuantity(engine.nextQuantitySession()));
        assert.equal(engine.state.xp, 400 + 85 * (run + 1));
    }
    assert.equal(engine.state.schemaVersion, 2);
    assert.equal(engine.state.worldProgress['world-1'].unlockedLevelId, 4);
    assert.equal(engine.state.worldProgress['world-2'].unlockedLevelId, 7);
    assert.equal(engine.state.completedLevels[1].highStreak, 8);
    assert.equal(engine.state.completedLevels[1].score, 20);
    assert.equal(JSON.stringify(engine.state.completedLevels[5]), other);
    assert.equal(new Engine().state.xp, 570);
});

test('all 30 levels can be won with correct answers, including regeneration', () => {
    const { Engine, levels } = setup();
    for (const level of levels) {
        const engine = new Engine();
        engine.startLevel(level.id);
        let next;
        for (let i = 0; i < 300; i++) {
            engine.tickBoss(2);
            answer(engine, true);
            next = engine.nextQuestion();
            if (next.finished) break;
        }
        assert.equal(next?.results.isSuccess, true, 'level ' + level.id);
        assert.equal(next.results.stars, 3);
        if (engine.activeBoss) assert.equal(engine.activeBoss.currentHp, 0);
    }
});

test('zero hearts lock the session even after refilling', () => {
    const { engine } = setup();
    engine.startLevel(8);
    engine.state.hearts = 1;
    answer(engine, false);
    const xp = engine.state.xp;
    assert.equal(answer(engine, true), null);
    engine.refillHearts();
    assert.equal(answer(engine, true), null);
    const result = engine.nextQuestion().results;
    assert.equal(result.isSuccess, false);
    assert.equal(result.failureReason, 'hearts');
    assert.equal(result.stars, 0);
    assert.equal(engine.state.xp, xp);
});

test('all wrong answers never unlock a level or award completion XP', () => {
    const { engine } = setup();
    engine.startLevel(8);
    const result = play(engine, [false, false, false, false, false]).results;
    assert.equal(result.isSuccess, false);
    assert.equal(result.failureReason, 'hearts');
    assert.equal(result.bonusXp, 0);
    assert.equal(engine.state.worldProgress['world-2'].unlockedLevelId, 5);
    assert.equal(engine.getTotalStars(), 0);
});

test('non-combat requires 60 percent accuracy', () => {
    for (const [answers, success] of [
        [[true, true, false, false, false], false],
        [[true, true, true, false, false], true]
    ]) {
        const { engine } = setup();
        engine.startLevel(15);
        const result = play(engine, answers).results;
        assert.equal(result.isSuccess, success);
        assert.equal(result.stars, success ? 1 : 0);
    }
});

test('a surviving regular enemy is a defeat even at 80 percent accuracy', () => {
    const { engine } = setup();
    engine.startLevel(7);
    // A deliberately resilient fixture exercises defeat at question exhaustion.
    engine.activeBoss.currentHp = engine.activeBoss.maxHp = 200;
    const result = play(engine, [...Array(16).fill(true), ...Array(4).fill(false)]).results;
    assert.equal(result.isSuccess, false);
    assert.equal(result.failureReason, 'enemy');
    assert.equal(result.stars, 0);
    assert.equal(result.bonusXp, 0);
    assert.equal(engine.state.worldProgress['world-2'].unlockedLevelId, 5);
});

test('results cannot award duplicate rewards or permit further answers', () => {
    const { engine } = setup();
    engine.startLevel(5);
    const result = play(engine, [true, true, true, true, true]).results;
    const xp = engine.state.xp;
    assert.equal(engine.finishLevel(), result);
    assert.equal(engine.nextQuestion().results, result);
    assert.equal(answer(engine, true), null);
    assert.equal(engine.state.xp, xp);
});

test('cannot skip unanswered questions, finish early or submit invalid choices', () => {
    const { engine } = setup();
    assert.equal(engine.submitAnswer(0), null);
    engine.startLevel(1);
    assert.equal(engine.nextQuestion(), null);
    assert.equal(engine.finishLevel(), null);
    for (const value of [-1, 4, '1', NaN]) assert.equal(engine.submitAnswer(value), null);
    assert.equal(engine.isAnswerLocked, false);
    answer(engine, true);
    assert.equal(answer(engine, true), null);
});

test('correct answers persist XP immediately and preserve valid progress', () => {
    const { engine, Engine } = setup();
    engine.startLevel(1);
    answer(engine, true);
    assert.equal(new Engine().state.xp, 12);
    engine.nextQuestion();
    const result = play(engine, Array(20).fill(true)).results;
    const loaded = new Engine();
    assert.equal(loaded.state.xp, result.totalXp);
    assert.equal(loaded.state.worldProgress['world-1'].unlockedLevelId, 2);
    assert.equal(loaded.getLevelStars(1), 3);
});

test('invalid saves are sanitized without breaking the map', () => {
    for (const save of ['{', 'null', '[]', JSON.stringify({
        hearts: -4, maxHearts: 999, xp: 'invalid', unlockedLevel: 999,
        completedLevels: null, achievements: { first_step: { unlocked: 'yes', name: 'bad' } }
    })]) {
        const { engine } = setup(save);
        assert.equal(engine.state.xp, 0);
        assert.equal(engine.state.maxHearts, 5);
        assert.ok(engine.state.hearts >= 0 && engine.state.hearts <= 5);
        assert.ok(Object.entries(engine.state.worldProgress).every(([id, progress]) => engine.getWorldLevels(id).some(level => level.id === progress.unlockedLevelId)));
        assert.equal(engine.getTotalStars(), 0);
        assert.equal(engine.getLevelStars(1), 0);
        assert.equal(engine.state.achievements.first_step.unlocked, false);
        assert.equal(engine.state.achievements.first_step.name, 'Primer Paso');
    }
});

test('shuffling changes positions but preserves correct answers and source data', () => {
    const { engine, levels } = setup(null, () => 0);
    const before = JSON.stringify(levels);
    engine.startLevel(1);
    let changed = false;
    for (const question of engine.currentLevel.questions) {
        const original = levels[0].questions.find(item => item.prompt === question.prompt);
        assert.equal(question.options[question.correct], original.options[original.correct]);
        if (question.correct !== original.correct) changed = true;
    }
    assert.equal(changed, true);
    assert.equal(JSON.stringify(levels), before);
});

test('cancelling a session prevents pending actions and starting with no lives', () => {
    const { engine } = setup();
    engine.startLevel(4);
    engine.cancelSession();
    assert.equal(answer(engine, true), null);
    assert.equal(engine.nextQuestion(), null);
    assert.equal(engine.tickBoss(10), null);
    engine.state.hearts = 0;
    assert.equal(engine.startLevel(1), null);
});

test('reset clears an active or completed attempt and persists fresh progress', () => {
    for (const completed of [false, true]) {
        const { engine, Engine } = setup();
        engine.startLevel(5);
        if (completed) play(engine, Array(20).fill(true));
        else answer(engine, true);
        assert.ok(engine.state.xp > 0);
        engine.resetProgress();
        assert.equal(engine.sessionStatus, 'idle');
        assert.equal(engine.currentLevel, null);
        assert.equal(engine.activeBoss, null);
        assert.equal(engine.currentStreak, 0);
        assert.equal(engine.sessionScore, 0);
        assert.equal(engine.sessionErrors, 0);
        assert.equal(engine.lastResults, null);
        assert.equal(engine.finishLevel(), null);
        assert.equal(engine.submitAnswer(0), null);
        assert.equal(engine.nextQuestion(), null);
        const saved = new Engine();
        assert.equal(saved.state.xp, 0);
        assert.equal(saved.state.hearts, 5);
        assert.equal(saved.state.worldProgress['world-1'].unlockedLevelId, 1);
        assert.equal(saved.getTotalStars(), 0);
        assert.ok(engine.startLevel(1));
        assert.equal(answer(engine, true).isCorrect, true);
    }
});

test('each circus level has 20 unique questions with four regular choices', () => {
    const { engine, levels } = setup();
    for (const level of levels.filter(l => l.worldId === 'world-2')) {
        assert.equal(level.questions.length, 20, 'level ' + level.id);
        assert.equal(new Set(level.questions.map(q => q.prompt)).size, 20);
        for (const question of level.questions) {
            assert.equal(question.options.length, 4);
            assert.equal(question.bossDistractors.length, 4);
            assert.equal(new Set([...question.options, ...question.bossDistractors]).size, 8);
            assert.ok(question.options[question.correct].length > 0);
        }
        engine.startLevel(level.id);
        if (!level.isBoss) assert.ok(engine.currentLevel.questions.every(q => q.options.length === 4));
    }
});

test('only the dragon mixes all 100 circus questions with eight unique choices', () => {
    let seed = 7;
    const { engine, levels } = setup(null, () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; });
    const original = JSON.stringify(levels);
    const circus = levels.filter(l => l.worldId === 'world-2');
    const questions = circus.flatMap(l => l.questions);
    engine.startLevel(9);
    const pool = engine.currentLevel.questions;
    assert.equal(pool.length, 100);
    assert.equal(new Set(pool.map(q => q.prompt)).size, 100);
    for (const question of pool) {
        const source = questions.find(q => q.prompt === question.prompt);
        assert.ok(source, 'no questions from other worlds');
        assert.equal(question.options.length, 8);
        assert.equal(new Set(question.options).size, 8);
        assert.equal(question.options[question.correct], source.options[source.correct]);
    }
    assert.ok(pool.some(q => q.correct >= 4), 'correct answers can be in slots 5–8');
    const firstOrder = pool.map(q => q.prompt).join('|');
    engine.startLevel(9);
    assert.notEqual(engine.currentLevel.questions.map(q => q.prompt).join('|'), firstOrder);
    for (const level of levels.filter(l => l.id !== 9)) {
        engine.startLevel(level.id);
        assert.ok(engine.currentLevel.questions.every(q => q.options.length === 4), 'level ' + level.id);
    }
    assert.equal(JSON.stringify(levels), original);
});

test('primary worlds cover all five axes with 20 explained questions per level', () => {
    const { levels } = setup();
    const ids = new Set();
    for (const grade of [1, 2, 3]) {
        const world = levels.filter(l => l.worldId === `world-${grade}`);
        const prompts = new Set();
        const axes = new Set();
        for (const level of world) {
            assert.equal(level.grade, grade);
            assert.equal(level.questions.length, 20);
            assert.ok(level.theory.content.includes(`${grade}.º básico`));
            for (const question of level.questions) {
                assert.equal(question.grade, grade);
                assert.ok(!ids.has(question.id), 'unique question IDs');
                ids.add(question.id);
                assert.ok(!prompts.has(question.prompt), 'no repeats in a boss pool');
                prompts.add(question.prompt);
                axes.add(question.axis);
                assert.ok(question.skill && question.hint && question.explanation);
                assert.ok(question.prompt.replace(/<[^>]*>/g, '').length < 380, question.id);
                assert.equal(question.options.length, 4);
                assert.equal(new Set(question.options).size, 4);
                assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4);
                if (grade !== 2) assert.equal(question.bossDistractors, undefined);
            }
        }
        assert.equal([...axes].sort().join('|'), ['Números y operaciones', 'Patrones y álgebra', 'Geometría', 'Medición', 'Datos y probabilidades'].sort().join('|'));
    }
    assert.equal(ids.size, 280);
});

test('primary calculations have correct answers and respect grade prerequisites', () => {
    const { levels } = setup();
    const seen = new Set();
    for (const level of levels.filter(l => l.grade)) {
        for (const question of level.questions) {
            if (!question.calculation) continue;
            const { operation, operands: [a, b] } = question.calculation;
            seen.add(operation);
            const expected = operation === 'add' ? a + b : operation === 'subtract' ? a - b : operation === 'multiply' ? a * b : a / b;
            assert.ok(Number.isInteger(expected) && expected >= 0, question.prompt);
            assert.equal(Number(question.options[question.correct]), expected, question.prompt);
            if (level.grade === 1) {
                assert.ok(['add', 'subtract'].includes(operation));
                assert.ok(Math.max(a, b, expected) <= 20);
            } else if (level.grade === 2) {
                assert.notEqual(operation, 'divide');
                assert.ok(Math.max(a, b, expected) <= 100);
                if (operation === 'multiply') assert.ok([2, 5, 10].includes(b) && a <= 10);
                if (operation === 'add') assert.ok(a % 10 + b % 10 < 10, 'no carrying in second-grade algorithm');
                if (operation === 'subtract') assert.ok(a % 10 >= b % 10, 'no borrowing in second-grade algorithm');
            } else {
                assert.ok(Math.max(a, b, expected) <= 1000);
                if (operation === 'multiply') assert.ok(a <= 10 && b <= 10);
                if (operation === 'divide') assert.ok(b > 0 && b <= 10 && expected <= 10);
            }
        }
    }
    assert.equal([...seen].sort().join('|'), 'add|divide|multiply|subtract');
});

test('boss reviews only skills already taught and pools stay in their grade', () => {
    const { engine, levels } = setup();
    for (const [bossId, size] of [[4, 80], [9, 100], [14, 100]]) {
        const boss = levels.find(l => l.id === bossId);
        const previous = levels.filter(l => l.worldId === boss.worldId && !l.isBoss);
        const skills = new Set(previous.flatMap(l => l.questions.map(q => q.skill)));
        for (const question of boss.questions) assert.ok(skills.has(question.skill), question.skill);
        engine.startLevel(bossId);
        assert.equal(engine.currentLevel.questions.length, size);
        assert.ok(engine.currentLevel.questions.every(q => q.grade === boss.grade));
    }
});

test('learning diagrams keep scales, table headers and fractional representations accessible', () => {
    const { levels } = setup();
    for (const question of levels.filter(l => l.grade).flatMap(l => l.questions)) {
        if (question.prompt.includes('<table')) {
            assert.match(question.prompt, /<caption>[^<]+<\/caption>/);
            assert.match(question.prompt, /scope="col"/);
            assert.match(question.prompt, /scope="row"/);
        }
        if (question.prompt.includes('curriculum-tiles')) {
            assert.match(question.prompt, /role="img" aria-label="[^"]+"/);
        }
        assert.doesNotMatch(question.prompt, /<script|onerror=|<img/i);
    }
});

test('every world starts independently at its own first level', () => {
    const { engine } = setup();
    for (const id of Object.keys(engine.state.worldProgress)) {
        const levels = engine.getWorldLevels(id);
        assert.equal(engine.isLevelUnlocked(levels[0].id), true);
        assert.equal(engine.isLevelUnlocked(levels[1].id), false);
        assert.equal(engine.getLocalLevelNumber(levels[0].id), 1);
        assert.equal(engine.getNextLevelId(levels.at(-1).id), null);
        assert.equal(engine.getWorldProgress(id).stars, 0);
    }
    assert.equal(engine.isLevelUnlocked(999), false);
});

test('winning in the circus changes only circus progress, including across reloads', () => {
    const { engine, Engine } = setup();
    engine.startLevel(5);
    const result = play(engine, Array(20).fill(true)).results;
    assert.equal(result.nextLevelId, 6);
    assert.equal(engine.isLevelUnlocked(6), true);
    assert.equal(engine.isLevelUnlocked(2), false);
    assert.equal(engine.isLevelUnlocked(11), false);
    assert.equal(engine.getWorldProgress('world-2').stars, 3);
    assert.equal(engine.getWorldProgress('world-1').stars, 0);
    const saved = new Engine();
    assert.equal(saved.isLevelUnlocked(6), true);
    assert.equal(saved.isLevelUnlocked(2), false);
    assert.equal(saved.getWorldProgress('world-2').completedCount, 1);
    assert.equal(saved.state.achievements.arithmetic_master.unlocked, false);
});

test('a world boss does not unlock levels in another world or jump there', () => {
    const { engine } = setup();
    engine.startLevel(4);
    const result = play(engine, Array(80).fill(true)).results;
    assert.equal(result.nextLevelId, null);
    assert.equal(result.isNextUnlocked, false);
    assert.equal(engine.isLevelUnlocked(5), true);
    assert.equal(engine.isLevelUnlocked(6), false);
    assert.equal(engine.getWorldProgress('world-2').completedCount, 0);
});

test('world achievements require finishing that world, not entering another', () => {
    const { engine } = setup();
    engine.startLevel(10);
    play(engine, Array(20).fill(true));
    assert.equal(engine.state.achievements.arithmetic_master.unlocked, false);
    for (let id = 5; id <= 9; id++) {
        engine.startLevel(id);
        const result = play(engine, Array(100).fill(true)).results;
        assert.equal(result.worldCompleted, id === 9);
    }
    assert.equal(engine.getWorldProgress('world-2').completed, true);
    assert.equal(engine.getWorldProgress('world-2').nextLevelId, null);
    assert.equal(engine.state.achievements.arithmetic_master.unlocked, true);
    assert.equal(engine.isLevelUnlocked(12), false);
});

test('legacy saves migrate without losing XP, hearts, stars or previous unlocks', () => {
    const { engine, Engine } = setup(JSON.stringify({
        xp: 642, hearts: 3, unlockedLevel: 7,
        completedLevels: { 1: { stars: 3, score: 7, highStreak: 7 }, 2: { stars: 2, score: 8 }, 5: { stars: 1 }, 6: { stars: 2 } },
        achievements: { first_step: { unlocked: true } }
    }));
    assert.equal(engine.state.schemaVersion, 2);
    assert.equal(engine.state.xp, 642);
    assert.equal(engine.state.hearts, 3);
    assert.equal(engine.getTotalStars(), 8);
    assert.equal(engine.isLevelUnlocked(4), true);
    assert.equal(engine.isLevelUnlocked(7), true);
    assert.equal(engine.isLevelUnlocked(8), false);
    assert.equal(engine.isLevelUnlocked(10), true);
    assert.equal(engine.isLevelUnlocked(11), false);
    assert.equal(engine.state.achievements.first_step.unlocked, true);
    engine.saveState();
    assert.equal(new Engine().getTotalStars(), 8);
    assert.equal(new Engine().state.worldProgress['world-2'].unlockedLevelId, 7);
});

test('version 2 saves ignore legacy global unlocks and validate world frontiers', () => {
    const { engine } = setup(JSON.stringify({
        schemaVersion: 2, unlockedLevel: 30,
        worldProgress: { 'world-1': { unlockedLevelId: 3 }, 'world-2': { unlockedLevelId: 2 } },
        completedLevels: { 10: { stars: 3 } }
    }));
    assert.equal(engine.isLevelUnlocked(3), true);
    assert.equal(engine.isLevelUnlocked(4), false);
    assert.equal(engine.isLevelUnlocked(5), true);
    assert.equal(engine.isLevelUnlocked(6), false);
    assert.equal(engine.isLevelUnlocked(11), true);
    assert.equal(engine.isLevelUnlocked(12), false);
});

test('world 3 enemies have valid artwork and can be defeated with the current banks', () => {
    const { engine, levels } = setup();
    for (const level of levels.filter(l => l.worldId === 'world-3')) {
        const enemy = level.enemy || level.boss;
        assert.ok(enemy && fs.existsSync(path.join(root, enemy.avatarImg)));
        engine.startLevel(level.id);
        assert.equal(play(engine, Array(25).fill(true)).results.isSuccess, true);
    }
});

test('queen shuffles keep the question and correct value intact without editing source data', () => {
    const { engine, levels } = setup();
    const before = JSON.stringify(levels);
    engine.startLevel(14);
    const question = engine.getCurrentQuestion();
    const correctText = question.options[question.correct];
    const prompt = question.prompt;
    const texts = [...question.options].sort();
    for (let i = 0; i < 30; i++) {
        const previous = question.options.join('|');
        assert.equal(engine.shuffleCurrentOptions(), true);
        assert.notEqual(question.options.join('|'), previous);
        assert.equal(engine.getCurrentQuestion(), question);
        assert.equal(question.prompt, prompt);
        assert.equal(question.options[question.correct], correctText);
        assert.equal([...question.options].sort().join('|'), texts.join('|'));
    }
    assert.equal(engine.submitAnswer(question.correct).isCorrect, true);
    assert.equal(engine.shuffleCurrentOptions(), false);
    assert.equal(JSON.stringify(levels), before);
});

test('shuffle visibly changes order even when random produces an identity permutation', () => {
    const { engine } = setup(null, () => .999999);
    engine.startLevel(14);
    const before = engine.getCurrentQuestion().options.join('|');
    const correct = engine.getCurrentQuestion().options[engine.getCurrentQuestion().correct];
    assert.equal(engine.shuffleCurrentOptions(), true);
    assert.notEqual(engine.getCurrentQuestion().options.join('|'), before);
    assert.equal(engine.getCurrentQuestion().options[engine.getCurrentQuestion().correct], correct);
});

test('shuffle only runs in the queen active unanswered fight', () => {
    const { engine } = setup();
    assert.equal(engine.shuffleCurrentOptions(), false);
    for (const id of [1, 4, 9, 10, 11, 12, 13]) {
        engine.startLevel(id);
        assert.equal(engine.shuffleCurrentOptions(), false);
    }
    engine.startLevel(14);
    engine.activeBoss.isDefeated = true;
    assert.equal(engine.shuffleCurrentOptions(), false);
    engine.startLevel(14);
    engine.state.hearts = 1;
    answer(engine, false);
    assert.equal(engine.shuffleCurrentOptions(), false);
    engine.refillHearts();
    engine.startLevel(14);
    engine.cancelSession();
    assert.equal(engine.shuffleCurrentOptions(), false);
    engine.startLevel(14);
    engine.resetProgress();
    assert.equal(engine.shuffleCurrentOptions(), false);
});

test('extended pilot validates quantities up to 20 with the same single completion rewards and save format', () => {
    const { engine, Engine } = setup();
    assert.equal(engine.startQuantityLevel(1, 21), null);
    assert.equal(engine.startQuantityLevel(1, '20'), null);
    engine.startQuantityLevel(1, 20);
    const targets = new Set();
    let last;
    for (let i = 0; i < 5; i++) {
        const session = engine.nextQuantitySession();
        assert.equal(session.definition.rules.totalObjects, 20);
        targets.add(session.targetQuantity);
        // Build the response using a ten when the target needs one.
        if (session.targetQuantity >= 10) {
            const group = session.groupTen('reserve');
            session.moveTen(group, 'chest');
        }
        let state = session.getSnapshot();
        for (const token of state.looseReserveTokens.slice(0, state.targetQuantity - state.finalQuantity)) session.move(token, 'chest');
        last = engine.acceptQuantityCompletion(session.submit());
        if (i < 4) assert.equal(engine.state.xp, 0);
    }
    assert.equal(targets.size, 5);
    assert.match(last.results.levelTitle, /Hasta 20/);
    assert.equal(last.results.activitySummary.every(s => s.totalObjects === 20), true);
    assert.equal(engine.state.xp, 85);
    assert.equal(engine.state.schemaVersion, 2);
    assert.equal(engine.state.hearts, 5);
    assert.equal(new Engine().getLevelStars(1), 3);
    assert.equal(new Engine().isLevelUnlocked(2), true);
    assert.equal(engine.finishLevel(), last.results);
    assert.equal(engine.state.xp, 85);
    assert.equal(engine.startQuantityLevel(1).definition.rules.totalObjects, 10);
});

function solveComposition(session) {
    const s = session.getSnapshot();
    if (s.mode === 'compose') return session.submit(s.targetQuantity);
    if (s.mode === 'missing') {
        for (const token of s.parts.reserve.slice(0, s.targetQuantity - s.givenLeft)) session.move(token, 'right');
    } else {
        session.move(s.parts.reserve[0], 'left');
        for (const token of session.getSnapshot().parts.reserve.slice(0, s.targetQuantity - 1)) session.move(token, 'right');
        session.submit(); session.tryAnother();
        for (const token of session.getSnapshot().parts.reserve.slice(0, 2)) session.move(token, 'left');
        for (const token of session.getSnapshot().parts.reserve.slice(0, s.targetQuantity - 2)) session.move(token, 'right');
    }
    return session.submit();
}

function solvePattern(session) {
    const state = session.getSnapshot();
    const values = state.mode === 'create' ? state.family === 'number' ? [1, 3, 5, 7, 9, 11]
        : Array.from({ length: state.values.length }, (_, i) => state.family === 'AB' ? ['star', 'flower'][i % 2]
            : state.family === 'AAB' ? ['star', 'star', 'flower'][i % 3] : ['star', 'flower', 'shell'][i % 3]) : session.expected;
    values.forEach((value, index) => session.set(index, value)); return session.submit();
}

function solveNumberline(session) {
    session.reset(); const state = session.getSnapshot();
    for (let i = 0; i < state.jumpCount; i++) session.jump(state.direction, state.stepSize);
    return session.submit();
}

test('every number-line configuration validates five routes and awards only one completion with the existing save', () => {
    for (const max of [20, 100]) for (const direction of ['forward', 'backward', 'mixed']) for (const step of [0, 1, 2, 5, 10]) {
        const { engine, Engine } = setup(); engine.state.hearts = 0;
        assert.ok(engine.startNumberlineLevel(1, direction, step, max));
        assert.equal(engine.finishLevel(), null);
        for (let i = 0; i < 5; i++) {
            const session = engine.nextActivitySession();
            assert.equal(engine.acceptActivityCompletion({ challengeId: session.challengeId, isCorrect: true }), null);
            const done = solveNumberline(session), result = engine.acceptActivityCompletion(done);
            assert.equal(engine.acceptActivityCompletion(done), null);
            assert.equal(result.finished, i === 4); assert.equal(engine.state.xp, i === 4 ? 85 : 0);
        }
        assert.equal(engine.lastResults.activityType, 'numberline'); assert.equal(engine.lastResults.activitySummary.length, 5);
        assert.ok(engine.lastResults.activitySummary.every(s => s.jumps.length === s.jumpCount && s.position === s.target));
        assert.equal(engine.state.hearts, 0); assert.equal(new Engine().state.xp, 85);
        assert.equal(new Engine().getLevelStars(1), 3); assert.equal(new Engine().state.schemaVersion, 2);
    }
});

test('number-line partial and abandoned routes cannot fabricate or reuse progress', () => {
    const { engine } = setup();
    for (const args of [[2], [1, 'bad'], [1, 'mixed', 3], [1, 'forward', 1, 30]]) assert.equal(engine.startNumberlineLevel(...args), null);
    const old = engine.startNumberlineLevel(1); assert.equal(engine.acceptActivityCompletion(old.submit()), null);
    engine.cancelSession(); const done = solveNumberline(old); assert.equal(engine.acceptActivityCompletion(done), null);
    engine.startNumberlineLevel(1); assert.equal(engine.acceptActivityCompletion(done), null);
    engine.startPatternLevel(1); assert.equal(engine.activityRun.kind, 'pattern');
    assert.equal(engine.state.xp, 0); assert.equal(engine.isLevelUnlocked(2), false);
});

test('all workshop modes and families award once for five owned model completions and keep the save schema', () => {
    for (const family of ['AB', 'AAB', 'ABC', 'number']) for (const mode of ['continue', 'create', 'repair']) for (const max of [20, 100]) {
        const { engine, Engine } = setup(); engine.state.hearts = 0;
        assert.ok(engine.startPatternLevel(1, mode, family, max));
        assert.equal(engine.finishLevel(), null);
        for (let i = 0; i < 5; i++) {
            const session = engine.nextActivitySession();
            assert.equal(engine.acceptActivityCompletion({ challengeId: session.challengeId, isCorrect: true }), null);
            const completion = solvePattern(session), result = engine.acceptActivityCompletion(completion);
            assert.equal(engine.acceptActivityCompletion(completion), null);
            assert.equal(result.finished, i === 4);
            assert.equal(engine.state.xp, i === 4 ? 85 : 0);
        }
        assert.equal(engine.lastResults.activityType, 'pattern');
        assert.equal(engine.lastResults.activitySummary.length, 5);
        assert.ok(engine.lastResults.activitySummary.every(s => s.family === family && s.mode === mode));
        assert.equal(engine.state.hearts, 0); assert.equal(new Engine().state.xp, 85);
        assert.equal(new Engine().getLevelStars(1), 3); assert.equal(engine.state.schemaVersion, 2);
    }
});

test('unfinished and abandoned workshop sessions cannot grant progress or submit stale results', () => {
    const { engine } = setup();
    for (const args of [[2], [1, 'bad'], [1, 'create', 'bad'], [1, 'repair', 'AB', 30]]) assert.equal(engine.startPatternLevel(...args), null);
    const old = engine.startPatternLevel(1, 'repair');
    const wrong = old.submit(); assert.equal(engine.acceptActivityCompletion(wrong), null);
    engine.cancelSession(); const done = solvePattern(old);
    assert.equal(engine.acceptActivityCompletion(done), null);
    engine.startPatternLevel(1, 'create', 'number');
    assert.equal(engine.acceptActivityCompletion(done), null);
    engine.startCompositionLevel(1); assert.equal(engine.activityRun.kind, 'composition');
    assert.equal(engine.state.xp, 0); assert.equal(engine.isLevelUnlocked(2), false);
});

test('all composition pilots validate their own completed model, keep partial solutions unrewarded and save once', () => {
    for (const mode of ['compose', 'missing', 'split']) for (const max of [10, 20]) {
        const { engine, Engine } = setup(); engine.state.hearts = 0;
        assert.ok(engine.startCompositionLevel(1, mode, max));
        assert.equal(engine.getCurrentQuestion(), null);
        assert.equal(engine.nextQuestion(), null);
        assert.equal(engine.finishLevel(), null);
        let result;
        for (let i = 0; i < 5; i++) {
            const session = engine.nextActivitySession();
            assert.equal(engine.acceptActivityCompletion({ challengeId: session.challengeId, isCorrect: true }), null);
            result = engine.acceptActivityCompletion(solveComposition(session));
            assert.equal(engine.acceptActivityCompletion(session.submit()), null);
            if (i < 4) { assert.equal(result.finished, false); assert.equal(engine.state.xp, 0); assert.equal(engine.isLevelUnlocked(2), false); }
        }
        assert.equal(result.results.activityType, 'composition');
        assert.equal(result.results.activitySummary.length, 5);
        assert.ok(result.results.activitySummary.every(s => s.mode === mode && (mode !== 'split' || s.solutions.length === 2)));
        assert.equal(engine.finishLevel(), result.results);
        assert.equal(engine.state.xp, 85); assert.equal(engine.state.hearts, 0);
        assert.equal(new Engine().state.xp, 85); assert.equal(new Engine().getLevelStars(1), 3);
        assert.equal(new Engine().isLevelUnlocked(2), true);
        assert.equal(new Engine().state.worldProgress['world-2'].unlockedLevelId, 5);
    }
});

test('composition cancellation, reset, invalid modes and one found split cannot fabricate progress', () => {
    const { engine } = setup();
    assert.equal(engine.startCompositionLevel(2), null);
    assert.equal(engine.startCompositionLevel(1, 'unsupported'), null);
    assert.equal(engine.startCompositionLevel(1, 'split', 21), null);
    const old = engine.startCompositionLevel(1, 'split');
    for (const token of old.getSnapshot().parts.reserve.slice(0, old.targetQuantity)) old.move(token, 'right');
    assert.equal(old.submit().emptyPart, true);
    assert.equal(engine.acceptActivityCompletion({ challengeId: old.challengeId, isCorrect: true }), null);
    old.move(old.getSnapshot().parts.right[0], 'left');
    const first = old.submit();
    assert.equal(first.status, 'solution-found');
    assert.equal(engine.acceptActivityCompletion(first), null);
    engine.cancelSession();
    assert.equal(engine.acceptActivityCompletion(first), null);
    engine.startCompositionLevel(1, 'compose');
    assert.equal(engine.acceptActivityCompletion(first), null);
    engine.resetProgress();
    assert.equal(engine.activityRun, null); assert.equal(engine.state.xp, 0);
    engine.startCompositionLevel(1, 'missing'); engine.startLevel(1);
    assert.equal(engine.activityRun, null); assert.ok(engine.getCurrentQuestion());
});
