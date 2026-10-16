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
    for (const file of ['levels-data.js', 'game.js']) {
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
            const correct = Number(question.options[question.correct].match(/-?\d+/)[0]);
            if (question.prompt.includes('el MAYOR')) {
                const numbers = [...question.options, ...question.bossDistractors].map(Number);
                assert.equal(Math.max(...numbers), correct);
            }
            const expressions = [...question.prompt.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
            for (const expression of expressions) {
                if (/^[\d\s()+-]+$/.test(expression) && /\d\s*[+-]\s*\(?-?\d/.test(expression)) {
                    assert.equal(vm.runInNewContext(expression), correct, question.prompt);
                }
            }
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

test('circus difficulty uses small nonnegative quantities and familiar operations', () => {
    const { levels } = setup();
    for (const level of levels.filter(l => l.worldId === 'world-2')) {
        const limit = level.id <= 6 ? 20 : 50;
        for (const question of level.questions) {
            assert.ok(question.prompt.length < 200, 'short instruction: ' + question.prompt);
            assert.doesNotMatch(question.prompt, /[()=]|\bnegativ/i);
            for (const math of question.prompt.matchAll(/\$([^$]+)\$/g)) {
                assert.doesNotMatch(math[1], /[a-z]/i);
            }
            const quantities = question.prompt.match(/\d+/g) || [];
            assert.ok(quantities.every(n => Number(n) <= limit), question.prompt);
            assert.ok([...question.options, ...question.bossDistractors].every(option => /^\d+$/.test(option) && Number(option) <= 50));
            assert.ok(Number(question.options[question.correct]) <= limit);
            assert.ok(question.hint.length > 0 && question.explanation.length > 0);
            // Intermediate values must also stay nonnegative in two-step exercises.
            for (const match of question.prompt.matchAll(/\$([\d\s+-]+)\$/g)) {
                const expression = match[1];
                const parts = expression.match(/\d+|[+-]/g);
                let value = Number(parts[0]);
                for (let i = 1; i < parts.length; i += 2) {
                    value += (parts[i] === '+' ? 1 : -1) * Number(parts[i + 1]);
                    assert.ok(value >= 0 && value <= limit, question.prompt);
                }
            }
        }
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
