const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.join(__dirname, '..');

test('battle results, zero-life lock, saved XP and cancelled defeat transitions', async () => {
    const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
    try {
        const page = await browser.newPage();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<link\b[^>]*>/gi, '');
        await page.setContent(html);
        await page.addStyleTag({ content: fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8') });
        // Isolated in-memory storage: never touches the player's browser save.
        await page.evaluate(() => {
            const saves = new Map();
            Object.defineProperty(window, 'localStorage', { value: {
                getItem: key => saves.get(key) ?? null,
                setItem: (key, value) => saves.set(key, value)
            } });
        });
        for (const file of ['audio', 'levels-data', 'game', 'ui']) {
            await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'js', file + '.js'), 'utf8') });
        }
        assert.equal(await page.locator('.world-enter-btn').count(), 6);
        assert.equal(await page.locator('.level-node').count(), 0);
        await page.locator('[data-world-id="world-2"]').click();
        assert.equal(await page.locator('.world-section').count(), 1);
        assert.equal(await page.locator('.level-node.unlocked').count(), 1);
        assert.equal(await page.locator('.level-node.unlocked').getAttribute('data-level-id'), '5');
        await page.locator('.level-node[data-level-id="5"]').click();
        assert.match(await page.locator('#lesson-level-tag').textContent(), /Nivel 1/);
        await page.locator('#start-challenge-btn').click();
        assert.match(await page.locator('#quiz-level-tag').textContent(), /Nivel 1:/);
        const locked = await page.evaluate(() => {
            soundManager.enabled = false;
            ui.startQuiz(8);
            gameEngine.state.hearts = 1;
            ui.selectAnswer((gameEngine.getCurrentQuestion().correct + 1) % 4);
            ui.handleNextQuestion();
            ui.selectAnswer(gameEngine.getCurrentQuestion().correct);
            return { score: gameEngine.sessionScore, index: gameEngine.currentQuestionIdx,
                disabled: document.getElementById('feedback-continue-btn').disabled };
        });
        assert.deepEqual(locked, { score: 0, index: 0, disabled: true });
        await page.waitForTimeout(1300);
        assert.equal(await page.evaluate(() => ui.currentView), 'gameover');

        const failure = await page.evaluate(() => {
            gameEngine.refillHearts();
            ui.startQuiz(7);
            gameEngine.activeBoss.currentHp = gameEngine.activeBoss.maxHp = 200;
            let celebrations = 0;
            ui.triggerConfetti = () => celebrations++;
            for (const correct of [...Array(16).fill(true), ...Array(4).fill(false)]) {
                const q = gameEngine.getCurrentQuestion();
                ui.selectAnswer(correct ? q.correct : (q.correct + 1) % 4);
                ui.handleNextQuestion();
            }
            return { title: document.getElementById('victory-title').textContent,
                nextHidden: document.getElementById('victory-next-btn').classList.contains('hidden'),
                stars: document.getElementById('victory-stars-container').children.length,
                celebrations };
        });
        assert.match(failure.title, /resistido/);
        assert.equal(failure.nextHidden, true);
        assert.equal(failure.stars, 0);
        assert.equal(failure.celebrations, 0);

        const win = await page.evaluate(() => {
            ui.startQuiz(5);
            while (ui.currentView === 'quiz') {
                const correct = gameEngine.getCurrentQuestion().correct;
                document.querySelectorAll('.option-card')[correct].click();
                ui.handleNextQuestion();
            }
            return { title: document.getElementById('victory-title').textContent,
                nextHidden: document.getElementById('victory-next-btn').classList.contains('hidden'),
                stars: document.querySelectorAll('.victory-star.earned').length,
                hp: gameEngine.activeBoss.currentHp,
                persistedXp: new MathQuestEngine().state.xp === gameEngine.state.xp };
        });
        assert.match(win.title, /Enemigo Derrotado/);
        assert.equal(win.nextHidden, false);
        assert.equal(win.stars, 3);
        assert.equal(win.hp, 0);
        assert.equal(win.persistedXp, true);
        await page.evaluate(() => ui.showWorldSelector());
        assert.match(await page.locator('[data-world-card="world-1"]').textContent(), /0 de 4 niveles/);
        assert.match(await page.locator('[data-world-card="world-2"]').textContent(), /1 de 5 niveles/);
        await page.locator('[data-world-id="world-2"]').click();
        assert.equal(await page.locator('.level-node[data-level-id="6"]').isDisabled(), false);

        await page.evaluate(() => {
            ui.startQuiz(8);
            gameEngine.state.hearts = 1;
            ui.selectAnswer((gameEngine.getCurrentQuestion().correct + 1) % 4);
            ui.showScreen('map');
            gameEngine.refillHearts();
            ui.startQuiz(5);
        });
        await page.waitForTimeout(1300);
        assert.equal(await page.evaluate(() => ui.currentView), 'quiz');
        assert.equal(await page.locator('#feedback-continue-btn').isDisabled(), true);
        // A new valid answer restores the continue button after a prior game over.
        await page.evaluate(() => ui.selectAnswer(gameEngine.getCurrentQuestion().correct));
        assert.equal(await page.locator('#feedback-continue-btn').isDisabled(), false);

        await page.evaluate(() => ui.startQuiz(9));
        assert.equal(await page.locator('.option-card').count(), 8);
        assert.deepEqual(await page.locator('.option-key').allTextContents(), ['1','2','3','4','5','6','7','8']);
        for (const width of [320, 600, 1200]) {
            await page.setViewportSize({ width, height: 1000 });
            const boxes = await page.locator('.option-card').evaluateAll(nodes => nodes.map(n => {
                const r = n.getBoundingClientRect();
                return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
            }));
            assert.ok(boxes.every(r => r.left >= 0 && r.right <= width), 'options fit at ' + width);
            for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i], b = boxes[j];
                assert.ok(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top));
            }
        }
        const correctIndex = await page.evaluate(() => {
            // Put the correct answer in the eighth slot to exercise the new shortcut.
            const q = gameEngine.getCurrentQuestion();
            [q.options[q.correct], q.options[7]] = [q.options[7], q.options[q.correct]];
            q.correct = 7;
            ui.renderCurrentQuestion();
            return q.correct;
        });
        await page.keyboard.press(String(correctIndex + 1));
        assert.equal(await page.locator('.option-card.correct .option-key').textContent(), '8');
        assert.equal(await page.evaluate(() => gameEngine.sessionScore), 1);
        await page.evaluate(() => ui.startQuiz(5));
        assert.equal(await page.locator('.option-card').count(), 4);
        assert.equal(await page.locator('.options-grid-expanded').count(), 0);

        // Cancelling the confirmation preserves the ongoing attempt.
        await page.evaluate(() => {
            ui.selectAnswer(gameEngine.getCurrentQuestion().correct);
            ui.showAchievementsModal();
        });
        const xpBeforeReset = await page.evaluate(() => gameEngine.state.xp);
        page.once('dialog', dialog => dialog.dismiss());
        await page.locator('#reset-progress-btn').click();
        assert.equal(await page.evaluate(() => ui.currentView), 'quiz');
        assert.equal(await page.evaluate(() => gameEngine.state.xp), xpBeforeReset);

        // Confirming reset must return to a usable map with fresh counters.
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#reset-progress-btn').click();
        const reset = await page.evaluate(() => ({
            view: ui.currentView, level: gameEngine.currentLevel, boss: gameEngine.activeBoss,
            selectedLevel: ui.selectedLevelId, xp: gameEngine.state.xp, streak: gameEngine.currentStreak,
            hearts: gameEngine.state.hearts, loop: ui.bossAnimFrame, timer: ui.gameOverTimer
        }));
        assert.deepEqual(reset, { view:'map', level:null, boss:null, selectedLevel:null,
            xp:0, streak:0, hearts:5, loop:null, timer:null });
        assert.equal(await page.locator('#achievements-modal').isVisible(), false);
        await page.locator('[data-world-id="world-1"]').click();
        await page.locator('.level-node[data-level-id="1"]').click();
        await page.locator('#start-challenge-btn').click();
        await page.evaluate(() => ui.selectAnswer(gameEngine.getCurrentQuestion().correct));
        assert.equal(await page.evaluate(() => gameEngine.sessionScore), 1);

        // An old defeat timer cannot replace the map after a reset.
        await page.evaluate(() => {
            ui.startQuiz(1);
            gameEngine.state.hearts = 1;
            ui.selectAnswer((gameEngine.getCurrentQuestion().correct + 1) % 4);
            ui.showAchievementsModal();
        });
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#reset-progress-btn').click();
        await page.waitForTimeout(1300);
        assert.equal(await page.evaluate(() => ui.currentView), 'map');
        await page.evaluate(() => {
            for (const id of [1, 2, 3]) gameEngine.state.completedLevels[id] = { stars: 3 };
            gameEngine.state.worldProgress['world-1'].unlockedLevelId = 4;
            ui.startQuiz(4);
            while (ui.currentView === 'quiz') {
                ui.selectAnswer(gameEngine.getCurrentQuestion().correct);
                ui.handleNextQuestion();
            }
        });
        assert.match(await page.locator('#victory-title').textContent(), /Mundo Completado/);
        assert.equal(await page.locator('#victory-next-btn').isVisible(), false);
        await page.locator('#victory-map-btn').click();
        assert.equal(await page.locator('.world-enter-btn').count(), 6);
        assert.match(await page.locator('[data-world-card="world-1"]').textContent(), /4 de 4 niveles/);
        assert.match(await page.locator('[data-world-card="world-2"]').textContent(), /0 de 5 niveles/);
    } finally {
        await browser.close();
    }
});

test('queen shuffles every two seconds, preserves answers and pauses for input and overlays', async () => {
    const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
    try {
        const page = await browser.newPage();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.clock.install();
        const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<link\b[^>]*>/gi, '');
        await page.setContent(html);
        await page.addStyleTag({ content: fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8') });
        await page.evaluate(() => {
            const saves = new Map();
            Object.defineProperty(window, 'localStorage', { value: {
                getItem: key => saves.get(key) ?? null,
                setItem: (key, value) => saves.set(key, value)
            } });
        });
        for (const name of ['audio', 'levels-data', 'game', 'ui']) {
            await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'js', name + '.js'), 'utf8') });
        }
        await page.evaluate(() => { soundManager.enabled = false; ui.startQuiz(14); });
        const order = () => page.locator('.option-text').allTextContents();
        const initial = await order();
        const question = await page.evaluate(() => {
            const q = gameEngine.getCurrentQuestion();
            return { prompt:q.prompt, correct:q.options[q.correct] };
        });
        await page.clock.runFor(1900);
        assert.deepEqual(await order(), initial);
        await page.clock.runFor(200);
        assert.notDeepEqual(await order(), initial);
        assert.equal(await page.evaluate(() => gameEngine.getCurrentQuestion().prompt), question.prompt);
        assert.equal(await page.evaluate(() => {
            const q = gameEngine.getCurrentQuestion(); return q.options[q.correct];
        }), question.correct);
        let correct = await page.evaluate(() => gameEngine.getCurrentQuestion().correct);
        await page.locator('.option-card').nth(correct).click();
        assert.equal(await page.evaluate(() => gameEngine.sessionScore), 1);
        const answered = await order();
        await page.clock.runFor(6000);
        assert.deepEqual(await order(), answered);
        await page.locator('#feedback-continue-btn').click();

        // Holding down a choice protects that choice until the click completes.
        correct = await page.evaluate(() => gameEngine.getCurrentQuestion().correct);
        await page.locator('.option-card').nth(correct).scrollIntoViewIfNeeded();
        const rect = await page.locator('.option-card').nth(correct).boundingBox();
        await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
        await page.mouse.down();
        assert.equal(await page.evaluate(() => ui.answerInteractionPending), true);
        const held = await order();
        await page.clock.runFor(3000);
        assert.deepEqual(await order(), held);
        await page.mouse.up();
        assert.equal(await page.evaluate(() => gameEngine.sessionScore), 2);
        await page.locator('#feedback-continue-btn').click();

        await page.evaluate(() => ui.showAchievementsModal());
        const paused = await order();
        await page.keyboard.press('1');
        assert.equal(await page.evaluate(() => gameEngine.isAnswerLocked), false);
        await page.clock.runFor(5000);
        assert.deepEqual(await order(), paused);
        await page.locator('#close-achievements-btn').click();
        await page.clock.runFor(2100);
        assert.notDeepEqual(await order(), paused);

        const beforeHidden = await order();
        await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable:true, value:true }));
        await page.clock.runFor(5000);
        assert.deepEqual(await order(), beforeHidden);
        await page.evaluate(() => { delete document.hidden; ui.showWorldSelector(); });
        const exited = await page.evaluate(() => gameEngine.getCurrentQuestion().options.join('|'));
        await page.clock.runFor(5000);
        assert.equal(await page.evaluate(() => gameEngine.getCurrentQuestion().options.join('|')), exited);
        assert.equal(await page.evaluate(() => ui.bossAnimFrame), null);

        await page.evaluate(() => { ui.startQuiz(14); ui.startQuiz(10); });
        const pawn = await order();
        await page.clock.runFor(6000);
        assert.deepEqual(await order(), pawn);
        await page.evaluate(() => { ui.startQuiz(14); gameEngine.activeBoss.currentHp = 1; });
        correct = await page.evaluate(() => gameEngine.getCurrentQuestion().correct);
        await page.locator('.option-card').nth(correct).click();
        assert.equal(await page.evaluate(() => gameEngine.activeBoss.isDefeated), true);
        const defeated = await order();
        await page.clock.runFor(5000);
        assert.deepEqual(await order(), defeated);
    } finally {
        await browser.close();
    }
});
