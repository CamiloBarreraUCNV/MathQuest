const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
let browser, server, origin;

before(async () => {
    // Serve only the prototype and its public resources, never .git or arbitrary local files.
    server = http.createServer((request, response) => {
        const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
        const absolute = path.resolve(root, relative);
        if (!(['index.html', 'mockup-tesoro-monedas.html', 'mockup-huerta-partes.html', 'mockup-taller-patrones.html', 'mockup-ruta-saltos.html'].includes(relative) || /^(js|css|assets)\//.test(relative)) ||
            path.relative(root, absolute).startsWith('..') || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
            response.writeHead(404); response.end(); return;
        }
        const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
        response.writeHead(200, { 'Content-Type': `${mime[path.extname(absolute)] || 'application/octet-stream'}; charset=utf-8` });
        fs.createReadStream(absolute).pipe(response);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
});
after(async () => {
    await browser?.close();
    if (server) await new Promise(resolve => server.close(resolve));
});
const role = name => `[data-role="${name}"]`;

async function pageFor(context) {
    const page = await context.newPage();
    await page.goto(`${origin}/mockup-tesoro-monedas.html`);
    return page;
}

test('prototype mounts, uses real assets and supports correction, keyboard and single completion', async () => {
    const context = await browser.newContext();
    try {
        const page = await pageFor(context);
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.evaluate(() => {
            localStorage.setItem('mathquest_save_data_v1', 'untouched');
            window.completions = [];
            const definition = structuredClone(KalkuActivityData.QUANTITY_PRACTICE);
            Object.assign(definition.rules, { minTarget: 2, maxTarget: 2 });
            window.treasureActivity = KalkuActivities.mountQuantityActivity(document.getElementById('treasure-activity'), {
                definition, onComplete: result => window.completions.push(result)
            });
        });
        const reserve = page.locator(`${role('reserve-coins')} button`);
        const chest = page.locator(`${role('chest-coins')} button`);
        assert.equal(await reserve.count(), 10);
        await reserve.first().focus(); await page.keyboard.press('Enter');
        assert.equal(await chest.count(), 1);
        await page.locator(role('deliver')).click();
        assert.equal(await page.locator(role('feedback')).getAttribute('data-state'), 'hint');
        await reserve.first().click(); await reserve.first().click();
        await page.locator(role('deliver')).click();
        assert.equal(await chest.count(), 3);
        await chest.first().click();
        if (await page.locator(role('count')).getAttribute('aria-pressed') === 'false') await page.locator(role('count')).click();
        assert.equal(await page.locator('.coin-number').count(), 2);
        await page.locator(role('deliver')).click();
        assert.equal(await page.locator(role('chest-closed')).isVisible(), true);
        assert.equal(await page.locator(role('completed')).textContent(), '1');
        await page.evaluate(() => treasureActivity.submit());
        assert.equal(await page.evaluate(() => completions.length), 1);
        assert.equal(await page.evaluate(() => completions[0].isNewCompletion), true);
        assert.equal(await page.evaluate(() => completions[0].finalQuantity), 2);
        assert.equal(await page.evaluate(() => localStorage.getItem('mathquest_save_data_v1')), 'untouched');
        await page.locator(role('next')).click();
        assert.equal(await chest.count(), 0);
        assert.equal(await page.locator(role('chest-open')).isVisible(), true);
        assert.ok(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0)));
        assert.deepEqual(errors, []);
    } finally { await context.close(); }
});

test('drag transfers and invalid drops preserve objects; pointer cancellation cleans up', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await pageFor(context);
        const count = () => page.locator(`${role('chest-coins')} button`).count();
        const coin = page.locator(`${role('reserve-coins')} button`).first();
        await coin.dragTo(page.locator('[data-zone="chest"]'));
        assert.equal(await count(), 1);
        await page.waitForTimeout(500);
        await page.locator(`${role('chest-coins')} button`).dragTo(page.locator('[data-zone="reserve"]'));
        assert.equal(await count(), 0);
        await page.waitForTimeout(500);
        await coin.dragTo(page.locator('header'));
        assert.equal(await count(), 0);
        assert.equal(await page.locator('.coin').count(), 10);
        const bounds = await coin.boundingBox();
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await page.mouse.down(); await page.mouse.move(bounds.x + bounds.width, bounds.y + bounds.height, { steps: 4 });
        await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointercancel')));
        assert.equal(await page.locator('.drag-ghost').count(), 0);
        await page.mouse.up();
        await page.waitForTimeout(500);
        const fresh = await coin.boundingBox();
        const x = fresh.x + fresh.width / 2, y = fresh.y + fresh.height / 2;
        await page.mouse.move(x, y); await page.mouse.down();
        await page.mouse.move(x + 12, y + 12, { steps: 3 });
        await page.keyboard.press('Escape'); await page.waitForTimeout(600);
        await page.mouse.up();
        assert.equal(await count(), 0, 'cancelled hold must not turn into a click on release');
    } finally { await context.close(); }
});

test('independent instances, configurable objects and remount/destroy have no stale handlers', async () => {
    const context = await browser.newContext();
    try {
        const page = await pageFor(context);
        await page.evaluate(() => {
            const container = document.createElement('div'); container.id = 'second-activity'; document.body.append(container);
            const definition = structuredClone(KalkuActivityData.QUANTITY_PRACTICE);
            definition.objects = { singular: 'manzana', plural: 'manzanas', image: 'assets/world-1/pirate-apple-80s.png' };
            definition.instruction = 'Prepara {target} {objects}.';
            Object.assign(definition.rules, { minTarget: 3, maxTarget: 3, totalObjects: 5, initialQuantity: 1 });
            window.secondActivity = KalkuActivities.mountQuantityActivity(container, { definition });
        });
        const second = page.locator('#second-activity');
        assert.equal(await second.locator('.coin').count(), 5);
        assert.equal(await second.locator(`${role('chest-coins')} button`).count(), 1);
        assert.match(await second.locator(role('request')).textContent(), /3 manzanas/);
        await second.locator(`${role('reserve-coins')} button`).first().click();
        assert.equal(await page.locator(`#treasure-activity ${role('chest-coins')} button`).count(), 0);
        assert.equal(await second.locator(`${role('chest-coins')} button`).count(), 2);
        assert.equal(await page.evaluate(() => {
            const ids = [...document.querySelectorAll('[id]')].map(node => node.id); return new Set(ids).size === ids.length;
        }), true);
        await page.evaluate(() => {
            window.oldActivity = secondActivity;
            window.secondActivity = KalkuActivities.mountQuantityActivity(document.getElementById('second-activity'), {
                definition: KalkuActivityData.QUANTITY_PRACTICE
            });
            oldActivity.start();
        });
        await second.locator(`${role('reserve-coins')} button`).first().click();
        assert.equal(await second.locator(`${role('chest-coins')} button`).count(), 1);
        await page.evaluate(() => secondActivity.destroy());
        assert.equal(await second.locator('.coin').count(), 0);
        await page.locator(`#treasure-activity ${role('reserve-coins')} button`).first().click();
        assert.equal(await page.locator(`#treasure-activity ${role('chest-coins')} button`).count(), 1);
    } finally { await context.close(); }
});

test('mobile taps, reduced motion and responsive controls work down to 320px', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });
    try {
        const page = await pageFor(context);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const reserve = page.locator(`${role('reserve-coins')} button`);
        await reserve.first().tap();
        assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 1);
        await page.locator(`${role('chest-coins')} button`).tap();
        assert.equal(await reserve.count(), 10);
        for (const width of [320, 390, 640, 768, 1280]) {
            await page.setViewportSize({ width, height: 1100 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
            const sizes = await reserve.evaluateAll(buttons => buttons.map(button => {
                const r = button.getBoundingClientRect(); return { width: r.width, height: r.height };
            }));
            assert.ok(sizes.every(size => size.width >= 44 && size.height >= 44), `touch targets at ${width}`);
            for (const name of ['add', 'remove', 'read', 'demo', 'count', 'hint', 'deliver']) {
                const box = await page.locator(role(name)).boundingBox();
                assert.ok(box.width >= 64 && box.height >= 64, `large ${name} control at ${width}`);
            }
            if (width <= 760) {
                const unit = await page.locator(role('target-unit')).boundingBox();
                const title = await page.locator('.zone-heading').first().boundingBox();
                assert.ok(unit.y + unit.height <= title.y, `mission text not covered at ${width}`);
            }
        }
        if (process.env.KALKU_QA_OUTPUT) {
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-desktop.png'), fullPage: true });
            await page.setViewportSize({ width: 390, height: 900 });
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-mobile.png'), fullPage: true });
        }
    } finally { await context.close(); }
});

test('hints are gradual, preserve the attempt and reset on the next challenge', async () => {
    const context = await browser.newContext();
    try {
        const page = await pageFor(context);
        await page.evaluate(() => {
            const definition = structuredClone(KalkuActivityData.QUANTITY_PRACTICE);
            Object.assign(definition.rules, { minTarget: 3, maxTarget: 3 });
            window.treasureActivity = KalkuActivities.mountQuantityActivity(document.getElementById('treasure-activity'), { definition });
        });
        await page.locator(role('hint')).click();
        assert.match(await page.locator(role('feedback-title')).textContent(), /Pista 1/);
        assert.equal(await page.locator('.coin-number').count(), 0);
        await page.locator(role('add')).click();
        await page.locator(role('hint')).click();
        assert.match(await page.locator(role('feedback-copy')).textContent(), /hay 1 moneda/);
        assert.equal(await page.locator('.coin-number').count(), 1);
        await page.locator(role('hint')).click();
        assert.match(await page.locator(role('feedback-copy')).textContent(), /1 \+ 2 = 3/);
        if (process.env.KALKU_QA_OUTPUT) {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-hint.png'), fullPage: true });
        }
        for (let i = 0; i < 4; i++) await page.locator(role('add')).click();
        await page.locator(role('deliver')).click();
        assert.match(await page.locator(role('feedback-copy')).textContent(), /5 − 2 = 3/);
        assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 5);
        assert.equal(await page.locator(role('completed')).textContent(), '0');
        await page.locator(role('remove')).click(); await page.locator(role('remove')).click();
        await page.locator(role('deliver')).click(); await page.locator(role('next')).click();
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().assistance.hintLevel), 0);
        assert.equal(await page.locator(role('hint')).textContent(), '💡 Una pista');
    } finally { await context.close(); }
});

test('optional demonstration never answers and stops for interaction, Escape and reduced motion', async () => {
    const context = await browser.newContext();
    try {
        const page = await pageFor(context);
        await page.clock.install();
        await page.clock.runFor(10000);
        assert.equal(await page.locator(role('demo-panel')).isVisible(), false, 'no inactivity demonstration');
        const before = await page.evaluate(() => treasureActivity.getSnapshot());
        await page.locator(role('demo')).click();
        const during = await page.evaluate(() => treasureActivity.getSnapshot());
        assert.deepEqual(during.placedTokens, before.placedTokens);
        assert.deepEqual(during.reserveTokens, before.reserveTokens);
        assert.equal(during.attempts, 0);
        assert.equal(during.assistance.demonstrationUsed, true);
        assert.equal(await page.locator(role('completed')).textContent(), '0');
        assert.equal(await page.locator(role('demo')).getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator(role('demo-panel')).isVisible(), false);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator(role('demo')).click();
        assert.equal(await page.locator(role('demo-stage')).evaluate(node => node.getAnimations({ subtree: true }).length), 0);
        if (process.env.KALKU_QA_OUTPUT) {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-demo.png'), fullPage: true });
        }
        await page.locator(role('add')).click();
        assert.equal(await page.locator(role('demo-panel')).isVisible(), false);
        assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 1);
        await page.locator(role('demo')).click(); await page.locator(role('new')).click();
        assert.equal(await page.locator(role('demo-panel')).isVisible(), false);
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().assistance.demonstrationUsed), false);
    } finally { await context.close(); }
});

async function installSpeechMock(context, voices = [{ lang: 'es-ES' }, { lang: 'es-CL' }]) {
    await context.addInitScript(initialVoices => {
        const listeners = new Set();
        const mock = {
            voices: initialVoices, utterances: [], cancelled: 0,
            getVoices() { return this.voices; },
            speak(utterance) { this.utterances.push(utterance); utterance.onstart?.(); },
            cancel() { this.cancelled++; },
            addEventListener(_, handler) { listeners.add(handler); },
            removeEventListener(_, handler) { listeners.delete(handler); },
            voicesChanged() { for (const handler of [...listeners]) handler(); }
        };
        Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: mock });
        window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
        window.speechMock = mock;
    }, voices);
}

test('reading is explicit, selects Spanish and cancels on Escape, new task, hidden page and destroy', async () => {
    const context = await browser.newContext();
    try {
        await installSpeechMock(context);
        const page = await pageFor(context);
        assert.equal(await page.evaluate(() => speechMock.utterances.length), 0);
        await page.locator(role('read')).click();
        assert.equal(await page.evaluate(() => speechMock.utterances[0].voice.lang), 'es-CL');
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'true');
        assert.ok(await page.evaluate(() => speechMock.utterances[0].text.includes(treasureActivity.getSnapshot().targetQuantity)));
        await page.keyboard.press('Escape');
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'false');
        await page.locator(role('read')).click(); await page.locator(role('new')).click();
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'false');
        await page.evaluate(() => { speechMock.utterances[0].onend(); speechMock.utterances[0].onerror(); });
        assert.equal(await page.locator(role('audio-status')).textContent(), '');
        await page.locator(role('read')).click();
        await page.evaluate(() => {
            Object.defineProperty(document, 'hidden', { configurable: true, value: true });
            document.dispatchEvent(new Event('visibilitychange'));
        });
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'false');
        await page.evaluate(() => { delete document.hidden; });
        await page.locator(role('read')).click();
        const cancelled = await page.evaluate(() => speechMock.cancelled);
        await page.evaluate(() => treasureActivity.destroy());
        assert.ok(await page.evaluate(() => speechMock.cancelled) > cancelled);
        assert.equal(await page.locator('.demo-panel').count(), 0);
    } finally { await context.close(); }
});

test('late voices and unavailable speech keep a complete visual, silent alternative', async () => {
    const context = await browser.newContext();
    try {
        await installSpeechMock(context, []);
        const page = await pageFor(context);
        await page.clock.install();
        await page.locator(role('read')).click();
        assert.match(await page.locator(role('audio-status')).textContent(), /Preparando/);
        await page.evaluate(() => { speechMock.voices = [{ lang: 'es-MX' }]; speechMock.voicesChanged(); });
        assert.equal(await page.evaluate(() => speechMock.utterances[0].voice.lang), 'es-MX');
        await page.locator(role('read')).click();
        await page.evaluate(() => { speechMock.voices = []; });
        await page.locator(role('read')).click(); await page.clock.runFor(2000);
        assert.match(await page.locator(role('audio-status')).textContent(), /No se pudo leer/);
        await page.locator(role('demo')).click();
        assert.equal(await page.locator(role('demo-panel')).isVisible(), true);
        await page.locator(role('add')).click();
        assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 1);
        await page.evaluate(() => {
            Object.defineProperty(window, 'speechSynthesis', { value: undefined });
            window.treasureActivity = KalkuActivities.mountQuantityActivity(document.getElementById('treasure-activity'), {
                definition: KalkuActivityData.QUANTITY_PRACTICE
            });
        });
        await page.locator(role('read')).click();
        assert.match(await page.locator(role('audio-status')).textContent(), /No se pudo leer/);
        const target = await page.evaluate(() => treasureActivity.getSnapshot().targetQuantity);
        for (let i = 0; i < target; i++) await page.locator(role('add')).click();
        await page.locator(role('deliver')).click();
        assert.equal(await page.locator(role('completed')).textContent(), '1');
    } finally { await context.close(); }
});

test('accessible names, live announcements, reference IDs and essential text contrast are present', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await pageFor(context);
        assert.equal(await page.getByRole('button', { name: /Escuchar encargo/ }).count(), 1);
        assert.equal(await page.getByRole('button', { name: /Muéstrame cómo/ }).count(), 1);
        assert.equal(await page.getByRole('group', { name: /Mover objetos/ }).count(), 1);
        await page.locator(role('add')).focus(); await page.keyboard.press('Enter');
        assert.match(await page.locator(role('announcer')).textContent(), /Cofre: 1/);
        await page.locator(role('remove')).focus(); await page.keyboard.press('Space');
        assert.equal(await page.locator(role('add')).evaluate(node => node === document.activeElement), true);
        const broken = await page.evaluate(() => [...document.querySelectorAll('[aria-describedby], [aria-labelledby], [aria-controls]')].flatMap(node =>
            ['aria-describedby', 'aria-labelledby', 'aria-controls'].flatMap(name => (node.getAttribute(name) || '').split(/\s+/).filter(Boolean).filter(id => !document.getElementById(id)))));
        assert.deepEqual(broken, []);
        const colors = await page.locator('.button:not(:disabled)').evaluateAll(nodes => nodes.map(node => {
            const style = getComputedStyle(node);
            return { text: style.color, backgrounds: style.backgroundImage.match(/rgb\([^)]*\)/g) || [style.backgroundColor] };
        }));
        const luminance = color => {
            const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        for (const color of colors) for (const background of color.backgrounds) {
            const a = luminance(color.text), b = luminance(background);
            assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5, `${color.text} on ${background}`);
        }
    } finally { await context.close(); }
});

async function gamePage(context) {
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // The game and all activity resources must work without its optional CDN formula renderer.
    await page.route('https://**/*', route => route.abort());
    await page.goto(`${origin}/index.html`);
    await page.evaluate(() => { soundManager.enabled = false; });
    return page;
}

async function enterPilot(page) {
    await page.locator('[data-world-id="world-1"]').click();
    await page.locator('[data-level-id="1"]').click();
    assert.equal(await page.locator('#quantity-pilot-option').isVisible(), true);
    await page.locator('#start-quantity-btn').click();
    assert.equal(await page.evaluate(() => ui.currentView), 'activity');
}

test('integrated pilot completes five real deliveries, saves rewards once and keeps quiz navigation', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gamePage(context);
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        const originalColor = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
        await enterPilot(page);
        assert.equal(await page.locator(role('new')).isVisible(), false);
        await page.evaluate(() => document.getElementById('quantity-level-activity').dispatchEvent(
            new CustomEvent('kalku:activity-completed', { detail: { isCorrect: true }, bubbles: true })));
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 0);
        await page.locator(role('deliver')).click(); // Incorrect, preserve hearts and allow correction.
        assert.equal(await page.evaluate(() => gameEngine.state.hearts), 5);
        await page.locator(role('count')).click();
        if (process.env.KALKU_QA_OUTPUT) {
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-level-desktop.png'), fullPage: true });
        }
        const targets = new Set();
        for (let round = 0; round < 5; round++) {
            const target = Number(await page.locator(role('target')).textContent());
            targets.add(target);
            for (let coin = 0; coin < target; coin++) await page.locator(role('add')).click();
            await page.locator(role('deliver')).click();
            if (round < 4) {
                assert.equal(await page.evaluate(() => gameEngine.state.xp), 0);
                await page.locator(role('next')).click();
                assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 0);
            }
        }
        assert.equal(targets.size, 5);
        assert.equal(await page.locator('#victory-screen').isVisible(), true);
        assert.match(await page.locator('#victory-score-text').textContent(), /5 cofres/);
        assert.equal(await page.locator('#victory-accuracy-label').textContent(), 'Cofres preparados');
        assert.equal(await page.locator('#victory-xp-earned').textContent(), '+85 XP');
        assert.equal(await page.locator('.victory-star.earned').count(), 3);
        assert.equal(await page.evaluate(() => gameEngine.quantityRun), null);
        assert.equal(await page.evaluate(() => ui.quantityActivity), null);
        assert.equal(await page.locator('#quantity-level-activity').textContent(), '');
        await page.evaluate(() => { gameEngine.finishLevel(); gameEngine.nextQuestion(); });
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), originalColor);
        await page.locator('#victory-retry-btn').click();
        assert.equal(await page.evaluate(() => ui.currentView), 'activity');
        await page.locator('#quit-activity-btn').click();
        assert.equal(await page.locator('[data-level-id="2"]').isDisabled(), false);
        await page.reload();
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.evaluate(() => gameEngine.getLevelStars(1)), 3);
        await page.locator('[data-world-id="world-1"]').click();
        await page.locator('[data-level-id="2"]').click();
        assert.equal(await page.locator('#quantity-pilot-option').isVisible(), false);
        await page.locator('#start-challenge-btn').click();
        assert.equal(await page.evaluate(() => ui.currentView), 'quiz');
        assert.equal(await page.locator('.option-card').count(), 4);
        assert.deepEqual(errors, []);
    } finally { await context.close(); }
});

test('leaving a pilot stops voice and demo, rejects stale completions and preserves saved progress', async () => {
    const context = await browser.newContext();
    try {
        await installSpeechMock(context);
        const page = await gamePage(context);
        await enterPilot(page);
        await page.locator(role('read')).click();
        assert.equal(await page.evaluate(() => speechMock.utterances.length), 1);
        await page.locator('#profile-btn').click();
        assert.ok(await page.evaluate(() => speechMock.cancelled) > 0);
        await page.locator('#close-achievements-btn').click();
        await page.locator(role('demo')).click();
        await page.evaluate(() => {
            window.oldActivity = ui.quantityActivity;
            window.oldSession = ui.quantityActivity.session;
        });
        await page.locator('#quit-activity-btn').click();
        assert.equal(await page.evaluate(() => oldActivity.destroyed), true);
        assert.equal(await page.locator('.demo-panel').count(), 0);
        await page.evaluate(() => {
            for (let token = 1; token <= oldSession.targetQuantity; token++) oldSession.move(token, 'chest');
            gameEngine.acceptQuantityCompletion(oldSession.submit());
            oldActivity.submit();
        });
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 0);
        assert.equal(await page.evaluate(() => gameEngine.getLevelStars(1)), 0);
        assert.equal(await page.locator('[data-level-id="2"]').isDisabled(), true);
        await page.locator('[data-level-id="1"]').click();
        await page.locator('#start-challenge-btn').click();
        assert.equal(await page.evaluate(() => ui.currentView), 'quiz');
        assert.equal(await page.locator('.option-card').count(), 4);
        await page.evaluate(() => ui.showWorldSelector());
        await enterPilot(page);
        await page.locator('#profile-btn').click();
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#reset-progress-btn').click();
        assert.equal(await page.evaluate(() => ui.currentView), 'map');
        assert.equal(await page.evaluate(() => ui.quantityActivity), null);
        assert.equal(await page.evaluate(() => gameEngine.quantityRun), null);
    } finally { await context.close(); }
});

test('integrated pilot stays usable with touch and keyboard from 320px to desktop', async () => {
    const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
    try {
        const page = await gamePage(context);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await enterPilot(page);
        for (const width of [320, 390, 768, 1280]) {
            await page.setViewportSize({ width, height: 1000 });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px overflow`);
            for (const name of ['add', 'remove', 'read', 'demo', 'count', 'hint', 'deliver']) {
                const box = await page.locator(role(name)).boundingBox();
                assert.ok(box.width >= 64 && box.height >= 64, `${name} too small at ${width}px`);
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator(role('add')).tap();
        await page.locator(role('add')).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 2);
        await page.locator(role('remove')).tap();
        assert.equal(await page.locator(`${role('chest-coins')} button`).count(), 1);
        if (process.env.KALKU_QA_OUTPUT) {
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-level-mobile.png'), fullPage: true });
        }
    } finally { await context.close(); }
});

async function mountExtended(page, target = 20) {
    await page.locator('#practice-range').selectOption('20');
    await page.evaluate(target => {
        const definition = structuredClone(KalkuActivityData.QUANTITY_PRACTICE_20);
        Object.assign(definition.rules, { minTarget: target, maxTarget: target });
        window.extendedCompletions = [];
        window.treasureActivity = KalkuActivities.mountQuantityActivity(document.getElementById('treasure-activity'), {
            definition, onComplete: result => extendedCompletions.push(result)
        });
    }, target);
}
const tenAction = (location, action) => `[data-zone="${location}"] [data-ten-action="${action}"]`;

test('extended frames show twenty coins and two reversible tens really equal twenty', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await pageFor(context);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.evaluate(() => localStorage.setItem('mathquest_save_data_v1', 'untouched'));
        await mountExtended(page);
        assert.equal(await page.locator('.ten-frame').count(), 4);
        assert.equal(await page.locator('.coin-cell').count(), 40);
        assert.equal(await page.locator('.coin-cell img').count(), 20);
        await page.locator(tenAction('reserve', 'group')).first().focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.coin-cell img').count(), 20, 'grouping keeps its ten coins visible');
        assert.equal(await page.locator('.grouped-frame').count(), 1);
        assert.equal(await page.evaluate(() => document.activeElement.dataset.tenAction), 'move');
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().finalQuantity), 10);
        await page.locator(role('deliver')).click();
        assert.equal(await page.evaluate(() => extendedCompletions.length), 0);
        await page.locator(tenAction('reserve', 'group')).click();
        await page.locator(tenAction('reserve', 'move')).click();
        assert.match(await page.locator(role('place-value')).textContent(), /2 decenas agrupadas y 0 monedas sin agrupar = 20/);
        assert.equal(await page.locator('[data-zone="chest"] .grouped-frame').count(), 2);
        assert.equal(await page.locator('.coin-cell img').count(), 20);
        assert.equal(await page.locator(role('remove')).isDisabled(), true, 'separate before moving a single grouped coin');
        await page.locator(role('deliver')).click();
        assert.equal(await page.evaluate(() => extendedCompletions.length), 1);
        assert.equal(await page.evaluate(() => extendedCompletions[0].finalQuantity), 20);
        assert.equal(await page.evaluate(() => extendedCompletions[0].groups.length), 2);
        assert.equal(await page.locator('[data-ten-action]:enabled').count(), 0);
        await page.evaluate(() => treasureActivity.submit());
        assert.equal(await page.evaluate(() => extendedCompletions.length), 1);
        await page.locator(role('next')).click();
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().groups.length), 0);
        assert.equal(await page.locator('.coin').count(), 20);
        const old = await page.evaluateHandle(() => treasureActivity);
        await page.locator('#practice-range').selectOption('10');
        assert.equal(await old.evaluate(activity => activity.destroyed), true);
        assert.equal(await page.locator('.ten-frame').count(), 0);
        assert.equal(await page.locator('.coin').count(), 10);
        assert.equal(await page.evaluate(() => localStorage.getItem('mathquest_save_data_v1')), 'untouched');
    } finally { await context.close(); }
});

test('extended corrections separate a ten to reach nineteen and empty returns complete groups', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, hasTouch: true });
    try {
        const page = await pageFor(context);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await mountExtended(page, 19);
        for (let i = 0; i < 2; i++) {
            await page.locator(tenAction('reserve', 'group')).first().tap();
            await page.locator(tenAction('reserve', 'move')).tap();
        }
        await page.locator(role('empty')).tap();
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().finalQuantity), 0);
        assert.equal(await page.locator('[data-zone="reserve"] .grouped-frame').count(), 2);
        for (let i = 0; i < 2; i++) await page.locator(tenAction('reserve', 'move')).first().tap();
        await page.locator(role('deliver')).tap();
        assert.equal(await page.evaluate(() => extendedCompletions.length), 0);
        await page.locator(tenAction('chest', 'ungroup')).last().focus();
        await page.keyboard.press('Space');
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().finalQuantity), 20);
        assert.equal(await page.locator(`${role('chest-coins')} .coin`).count(), 10);
        assert.equal(await page.evaluate(() => document.activeElement.classList.contains('coin')), true);
        await page.locator(role('remove')).tap();
        assert.equal(await page.evaluate(() => treasureActivity.getSnapshot().finalQuantity), 19);
        assert.match(await page.locator(role('place-value')).textContent(), /1 decena agrupada y 9 monedas sin agrupar = 19/);
        await page.locator(role('deliver')).tap();
        assert.equal(await page.evaluate(() => extendedCompletions[0].finalQuantity), 19);
        assert.equal(await page.evaluate(() => extendedCompletions[0].attempts), 2);
        assert.equal(await page.evaluate(() => extendedCompletions[0].representationActions.ungrouped), 1);
    } finally { await context.close(); }
});

test('extended frames keep coins legible, controls accessible and instructions useful on mobile and desktop', async () => {
    const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 900 } });
    try {
        await installSpeechMock(context);
        const page = await pageFor(context);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await mountExtended(page, 14);
        await page.locator(role('read')).tap();
        assert.match(await page.evaluate(() => speechMock.utterances[0].text), /diez monedas en una decena/);
        await page.locator(role('read')).tap();
        await page.locator(role('demo')).tap();
        assert.equal(await page.locator(role('demo-tens')).isVisible(), true);
        await page.locator(role('demo')).tap();
        for (const width of [320, 390, 640, 768, 1280]) {
            await page.setViewportSize({ width, height: 1100 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
            const sizes = await page.locator('.coin').evaluateAll(nodes => nodes.map(node => {
                const r = node.getBoundingClientRect(); return { width: r.width, height: r.height };
            }));
            assert.ok(sizes.every(r => r.width >= 44 && r.height >= 44), `coin sizes at ${width}`);
            for (const button of await page.locator('[data-ten-action]').all()) {
                const r = await button.boundingBox();
                assert.ok(r.width >= 64 && r.height >= 64, `ten control size at ${width}`);
            }
        }
        await page.locator(tenAction('reserve', 'group')).first().tap();
        await page.locator(tenAction('reserve', 'move')).tap();
        for (let i = 0; i < 4; i++) await page.locator(role('add')).tap();
        await page.locator(role('count')).tap();
        assert.deepEqual(await page.evaluate(() => treasureActivity.getSnapshot().placeValue), { tens: 1, units: 4 });
        const ids = await page.evaluate(() => [...document.querySelectorAll('[id]')].map(node => node.id));
        assert.equal(new Set(ids).size, ids.length);
        if (process.env.KALKU_QA_OUTPUT) {
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-twenty-desktop.png'), fullPage: true });
            await page.setViewportSize({ width: 390, height: 1000 });
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'quantity-twenty-mobile.png'), fullPage: true });
        }
    } finally { await context.close(); }
});

test('extended pilot range is selectable, preserves its range on retry and saves the normal rewards', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gamePage(context);
        await page.locator('[data-world-id="world-1"]').click();
        await page.locator('[data-level-id="1"]').click();
        await page.locator('#quantity-level-range').selectOption('20');
        await page.evaluate(() => { Math.random = () => 0; });
        await page.locator('#start-quantity-btn').click();
        assert.match(await page.locator('#quantity-level-title').textContent(), /Hasta 20/);
        const targets = [];
        for (let round = 0; round < 5; round++) {
            const target = Number(await page.locator(role('target')).textContent()); targets.push(target);
            for (let ten = 0; ten < Math.floor(target / 10); ten++) {
                await page.locator(tenAction('reserve', 'group')).first().click();
                await page.locator(tenAction('reserve', 'move')).click();
            }
            for (let unit = 0; unit < target % 10; unit++) await page.locator(role('add')).click();
            await page.locator(role('deliver')).click();
            if (round < 4) await page.locator(role('next')).click();
        }
        assert.ok(targets.includes(20));
        assert.equal(await page.locator('#victory-xp-earned').textContent(), '+85 XP');
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.evaluate(() => gameEngine.lastResults.activitySummary.every(s => s.totalObjects === 20)), true);
        await page.locator('#victory-retry-btn').click();
        assert.equal(await page.locator('.ten-frame').count(), 4);
        assert.equal(await page.evaluate(() => ui.quantityActivity.getSnapshot().totalObjects), 20);
        await page.reload();
        assert.equal(await page.evaluate(() => gameEngine.getLevelStars(1)), 3);
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.evaluate(() => gameEngine.isLevelUnlocked(2)), true);
    } finally { await context.close(); }
});

async function gardenPage(context) {
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${origin}/mockup-huerta-partes.html`);
    return page;
}

async function mountComposition(page, mode, total = 8, givenLeft = 3, maxTarget = 10) {
    await page.locator('#garden-range').selectOption(String(maxTarget));
    await page.locator('#garden-mode').selectOption(mode);
    await page.evaluate(({ mode, total, givenLeft, maxTarget }) => {
        const definition = structuredClone(KalkuActivityData.COMPOSITION_PRACTICES[maxTarget][mode]);
        window.compositionCompletions = [];
        window.gardenActivity = KalkuActivities.mountCompositionActivity(document.getElementById('garden-activity'), {
            definition, createSession: () => new KalkuActivities.CompositionSession({ schemaVersion: 1, id: 'fixed-composition',
                definition, targetQuantity: total, givenLeft: mode === 'split' ? 0 : givenLeft }),
            onComplete: result => compositionCompletions.push(result)
        });
    }, { mode, total, givenLeft, maxTarget });
}
async function addPart(page, side, count) { for (let i = 0; i < count; i++) await page.locator(role(`add-${side}`)).click(); }

test('composition joins two fixed parts with a typed answer, correction and a single completion', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gardenPage(context);
        await mountComposition(page, 'compose');
        assert.equal(await page.locator(role('bank')).isVisible(), false);
        assert.equal(await page.locator(role('equation')).textContent(), '3 + 5 = ?');
        assert.equal(await page.locator('.comp-object').count(), 0);
        await page.locator(role('deliver')).click();
        assert.match(await page.locator(role('feedback')).textContent(), /Escribe un número/);
        await page.locator(role('answer')).fill('7');
        await page.locator(role('answer')).press('Enter');
        assert.equal(await page.evaluate(() => compositionCompletions.length), 0);
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().leftQuantity), 3);
        await page.locator(role('answer')).fill('8'); await page.locator(role('answer')).press('Enter');
        assert.equal(await page.locator(role('equation')).textContent(), '3 + 5 = 8');
        assert.equal(await page.evaluate(() => compositionCompletions.length), 1);
        await page.evaluate(() => gardenActivity.submit());
        assert.equal(await page.evaluate(() => compositionCompletions.length), 1);
        await page.locator(role('next')).click();
        assert.equal(await page.locator(role('answer')).inputValue(), '');
    } finally { await context.close(); }
});

test('two cofres need distinct decompositions; mirrored pairs are rejected and 4 plus 4 succeeds', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gardenPage(context); await mountComposition(page, 'split');
        await addPart(page, 'left', 3); await addPart(page, 'right', 5); await page.locator(role('deliver')).click();
        assert.equal(await page.evaluate(() => compositionCompletions.length), 0);
        assert.equal(await page.locator(role('another')).isVisible(), true);
        assert.equal(await page.locator(role('deliver')).isVisible(), false);
        await page.locator(role('another')).focus(); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().finalQuantity), 0);
        await addPart(page, 'left', 5); await addPart(page, 'right', 3); await page.locator(role('deliver')).click();
        assert.match(await page.locator(role('feedback')).textContent(), /ya está encontrada/);
        assert.equal(await page.evaluate(() => compositionCompletions.length), 0);
        await page.locator(role('remove-left')).click(); await page.locator(role('add-right')).click();
        await page.locator(role('deliver')).click();
        assert.equal(await page.evaluate(() => compositionCompletions.length), 1);
        assert.deepEqual(await page.evaluate(() => compositionCompletions[0].solutions), [{ left: 3, right: 5 }, { left: 4, right: 4 }]);
    } finally { await context.close(); }
});

test('missing-part activity protects the given, resets only the editable part and requires at least one apple', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 1100 }, hasTouch: true });
    try {
        const page = await gardenPage(context); await mountComposition(page, 'missing');
        assert.equal(await page.locator(role('left-actions')).isVisible(), false);
        assert.equal(await page.locator(`${role('left-coins')} button`).count(), 0);
        await addPart(page, 'right', 4); await page.locator(role('reset')).tap();
        assert.equal(await page.locator(role('left-count')).textContent(), '3 manzanas');
        assert.equal(await page.locator(role('right-count')).textContent(), '0 manzanas');
        await addPart(page, 'right', 6); await page.locator(role('deliver')).tap();
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().rightQuantity), 6);
        await page.locator(role('remove-right')).tap(); await page.locator(role('deliver')).tap();
        assert.equal(await page.evaluate(() => compositionCompletions[0].rightQuantity), 5);
        await mountComposition(page, 'missing', 8, 7);
        await page.locator(role('deliver')).tap();
        assert.equal(await page.evaluate(() => compositionCompletions.length), 0);
        assert.match(await page.locator(role('feedback')).textContent(), /al menos una manzana en cada canasta/);
        await addPart(page, 'right', 1); await page.locator(role('deliver')).tap();
        assert.equal(await page.evaluate(() => compositionCompletions[0].rightQuantity), 1);
    } finally { await context.close(); }
});

test('composition taps, drags, cancelled gestures and voice stay scoped during remounts', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1200 } });
    try {
        await installSpeechMock(context);
        const page = await gardenPage(context); await mountComposition(page, 'split');
        await page.locator(role('send-right')).click();
        await page.locator(`${role('reserve-coins')} button`).first().focus(); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().rightQuantity), 1);
        await addPart(page, 'left', 1);
        const from = page.locator(`${role('left-coins')} button`).first(), to = page.locator(role('right-coins'));
        await from.scrollIntoViewIfNeeded();
        let a = await from.boundingBox(), b = await to.boundingBox();
        await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 5 }); await page.mouse.up();
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().leftQuantity), 0);
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().rightQuantity), 2);
        const coin = page.locator(`${role('right-coins')} button`).first();
        a = await coin.boundingBox();
        await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
        await page.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 + 20);
        await page.keyboard.press('Escape'); await page.waitForTimeout(500); await page.mouse.up();
        assert.equal(await page.evaluate(() => gardenActivity.getSnapshot().rightQuantity), 2);
        assert.equal(await page.locator('.comp-ghost').count(), 0);
        await page.locator(role('read')).click(); assert.equal(await page.evaluate(() => speechMock.utterances.length), 1);
        await page.keyboard.press('Escape'); assert.ok(await page.evaluate(() => speechMock.cancelled) > 0);
        const before = await page.evaluate(() => gardenActivity.getSnapshot().parts);
        await page.locator(role('demo')).click();
        assert.deepEqual(await page.evaluate(() => gardenActivity.getSnapshot().parts), before);
        await page.keyboard.press('Escape'); assert.equal(await page.locator(role('example')).isVisible(), false);
        await page.evaluate(() => { window.oldComposition = gardenActivity; });
        await page.locator('#garden-range').selectOption('20');
        assert.equal(await page.evaluate(() => oldComposition.destroyed), true);
        assert.equal(await page.locator('.composition-widget').count(), 1);
        assert.equal(await page.locator('.quantity-widget').count(), 0);
        assert.equal(await page.evaluate(() => gardenActivity.session.definition.maxTarget), 20);
    } finally { await context.close(); }
});

test('composition activities keep responsive controls, labels and zero-visible parts from 320px to desktop', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 1100 }, hasTouch: true });
    try {
        const page = await gardenPage(context);
        for (const mode of ['compose', 'missing', 'split']) {
            await mountComposition(page, mode, 14, 4, 20);
            for (const width of [320, 390, 768, 1280]) {
                await page.setViewportSize({ width, height: 1100 });
                assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${mode} overflow at ${width}`);
                for (const button of await page.locator('.composition-widget button:visible').all()) {
                    const box = await button.boundingBox();
                    const min = await button.evaluate(el => el.classList.contains('comp-object')) ? 44 : 64;
                    assert.ok(box.width >= min && box.height >= min, `${mode} target size at ${width}`);
                }
            }
            const broken = await page.evaluate(() => [...document.querySelectorAll('[aria-describedby],[aria-labelledby],[aria-controls]')].flatMap(node =>
                ['aria-describedby','aria-labelledby','aria-controls'].flatMap(name => (node.getAttribute(name) || '').split(/\s+/).filter(Boolean).filter(id => !document.getElementById(id)))));
            assert.deepEqual(broken, []);
        }
        await addPart(page, 'left', 4); await addPart(page, 'right', 10);
        if (process.env.KALKU_QA_OUTPUT) {
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'garden-desktop.png'), fullPage: true });
            await page.setViewportSize({ width: 390, height: 1100 });
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, 'garden-mobile.png'), fullPage: true });
        }
    } finally { await context.close(); }
});

test('integrated composition saves five real tasks once, retries its mode and discards partial splits on exit', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gamePage(context);
        await page.locator('[data-world-id="world-1"]').click(); await page.locator('#open-garden-game').click();
        await page.locator('#garden-level-mode').selectOption('compose');
        await page.locator('#garden-level-range').selectOption('20'); await page.locator('#start-garden-btn').click();
        for (let i = 0; i < 5; i++) {
            const counts = await page.locator(role('equation')).textContent();
            const parts = counts.match(/\d+/g).map(Number);
            await page.locator(role('answer')).fill(String(parts[0] + parts[1])); await page.locator(role('answer')).press('Enter');
            if (i < 4) { assert.equal(await page.evaluate(() => gameEngine.state.xp), 0); await page.locator(role('next')).click(); }
        }
        assert.match(await page.locator('#victory-score-text').textContent(), /5 retos/);
        assert.equal(await page.locator('#victory-accuracy-label').textContent(), 'Encargos completos');
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.evaluate(() => gameEngine.lastResults.activitySummary.every(s => s.mode === 'compose')), true);
        await page.locator('#victory-retry-btn').click(); assert.match(await page.locator('#quantity-level-title').textContent(), /Junta la cosecha/);
        await page.locator('#quit-activity-btn').click();
        await page.locator('#open-garden-game').click(); await page.locator('#garden-level-mode').selectOption('split');
        await page.locator('#start-garden-btn').click();
        const target = await page.evaluate(() => ui.quantityActivity.getSnapshot().targetQuantity);
        await addPart(page, 'right', target); await page.locator(role('deliver')).click();
        assert.match(await page.locator(role('feedback')).textContent(), /al menos una manzana en cada canasta/);
        assert.equal(await page.evaluate(() => ui.quantityActivity.getSnapshot().solutions.length), 0);
        await page.locator(role('remove-right')).click(); await addPart(page, 'left', 1);
        await page.locator(role('deliver')).click();
        assert.equal(await page.evaluate(() => ui.quantityActivity.getSnapshot().status), 'solution-found');
        assert.equal(await page.evaluate(() => gameEngine.activityRun.completed.length), 0);
        await page.locator('#quit-activity-btn').click();
        assert.equal(await page.evaluate(() => gameEngine.activityRun), null);
        await page.reload(); assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.evaluate(() => gameEngine.getLevelStars(1)), 3);
    } finally { await context.close(); }
});

test('the orchard and treasure are distinct games with separate pages, objects and launchers', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await pageFor(context);
        assert.equal(await page.locator('#practice-mode').count(), 0);
        assert.equal(await page.evaluate(() => typeof KalkuActivities.CompositionSession), 'undefined');
        await page.locator('a[href="mockup-huerta-partes.html"]').click();
        assert.match(await page.title(), /La Huerta de las Partes/);
        assert.equal(await page.evaluate(() => typeof KalkuActivities.QuantitySession), 'undefined');
        assert.equal(await page.locator('img[src*="treasure-activity"]').count(), 0);
        assert.equal(await page.locator('.coin, .quantity-widget').count(), 0);
        await page.evaluate(() => localStorage.setItem('mathquest_save_data_v1', 'untouched'));
        for (const mode of ['compose', 'missing', 'split']) {
            await page.locator('#garden-mode').selectOption(mode);
            assert.doesNotMatch(await page.locator('.composition-widget').innerText(), /cofre|moneda|pirata|capitán|tesoro/i);
            assert.match(await page.locator('.composition-widget').innerText(), /canasta|manzana/i);
            assert.ok(await page.locator('.comp-fruit').count() > 0);
            await page.locator(role('hint')).click();
            assert.doesNotMatch(await page.locator(role('feedback')).innerText(), /cofre|moneda/i);
        }
        assert.equal(await page.evaluate(() => localStorage.getItem('mathquest_save_data_v1')), 'untouched');
        await page.locator('a[href="mockup-tesoro-monedas.html"]').click();
        assert.equal(await page.locator('.coin').count(), 10);
        assert.equal(await page.locator('.composition-widget').count(), 0);
        await page.route('https://**/*', route => route.abort());
        await page.goto(`${origin}/index.html`);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator('[data-world-id="world-1"]').click();
        assert.equal(await page.locator('#open-treasure-game').isVisible(), true);
        assert.equal(await page.locator('#open-garden-game').isVisible(), true);
        await page.locator('#open-garden-game').click();
        assert.equal(await page.locator('#garden-modal').isVisible(), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#garden-modal').isVisible(), false);
        assert.equal(await page.locator('#open-garden-game').evaluate(el => el === document.activeElement), true);
        await page.locator('#open-garden-game').click();
        await page.locator('#start-garden-btn').click();
        assert.equal(await page.locator('#activity-screen').evaluate(el => el.classList.contains('garden-level-screen')), true);
        assert.equal(await page.locator('#activity-screen img[src*="treasure-activity"]').count(), 0);
        await page.locator('#quit-activity-btn').click();
        await page.locator('#open-treasure-game').click();
        assert.equal(await page.locator('#treasure-level-mode').count(), 0);
        await page.locator('#start-quantity-btn').click();
        assert.equal(await page.locator('#activity-screen').evaluate(el => el.classList.contains('garden-level-screen')), false);
        assert.equal(await page.locator('.coin').count(), 10);
    } finally { await context.close(); }
});

async function workshopPage(context) {
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${origin}/mockup-taller-patrones.html`);
    return page;
}
async function mountPattern(page, family, mode) {
    await page.evaluate(({ family, mode }) => {
        const definition = KalkuActivityData.PATTERN_PRACTICES[20][family][mode];
        window.patternCompletions = [];
        window.patternActivity = KalkuActivities.mountPatternActivity(document.getElementById('pattern-activity'), {
            definition,
            createSession: () => new KalkuActivities.PatternSession({ schemaVersion: 1, id: 'fixed', definition,
                rule: family === 'number' ? [2, 2] : family === 'ABC' ? ['leaf', 'shell', 'star'] : ['leaf', 'shell'],
                repairIndex: family === 'number' ? 2 : family === 'AB' ? 2 : 3 }),
            onComplete: result => patternCompletions.push(result)
        });
    }, { family, mode });
}
async function fillPattern(page, values) {
    const state = await page.evaluate(() => patternActivity.getSnapshot());
    for (let i = 0; i < values.length; i++) {
        if (!state.editable[i]) continue;
        const slot = page.locator(`[data-slot="${i}"]`);
        if (state.family === 'number') await slot.fill(String(values[i]));
        else { await slot.click(); await page.locator(`[data-piece="${values[i]}"]`).click(); }
    }
}

test('workshop continues, creates and repairs every symbolic family through real pieces with one completion', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await workshopPage(context), errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.evaluate(() => localStorage.setItem('mathquest_save_data_v1', 'untouched'));
        for (const family of ['AB', 'AAB', 'ABC']) for (const mode of ['continue', 'create', 'repair']) {
            await mountPattern(page, family, mode);
            const before = await page.evaluate(() => patternActivity.getSnapshot().values);
            await page.locator(role('deliver')).click();
            assert.equal(await page.evaluate(() => patternCompletions.length), 0);
            await page.locator(role('hint')).click(); await page.locator(role('demo')).click();
            assert.equal(await page.locator(role('example')).isVisible(), true);
            assert.deepEqual(await page.evaluate(() => patternActivity.getSnapshot().values), before);
            await page.keyboard.press('Escape'); assert.equal(await page.locator(role('example')).isVisible(), false);
            const shape = family === 'AB' ? [0, 1] : family === 'AAB' ? [0, 0, 1] : [0, 1, 2];
            const tokens = mode === 'create' ? ['flower', 'star', 'shell'] : ['leaf', 'shell', 'star'];
            const values = Array.from({ length: shape.length * 3 }, (_, i) => tokens[shape[i % shape.length]]);
            await fillPattern(page, values);
            await page.locator(role('deliver')).click();
            assert.equal(await page.evaluate(() => patternCompletions.length), 1);
            assert.deepEqual(await page.evaluate(() => patternCompletions[0].values), values);
            assert.equal(await page.locator(role('deliver')).isDisabled(), true);
            assert.equal(await page.locator(role('next')).evaluate(el => el === document.activeElement), true);
        }
        assert.equal(await page.evaluate(() => localStorage.getItem('mathquest_save_data_v1')), 'untouched');
        assert.deepEqual(errors, []);
    } finally { await context.close(); }
});

test('workshop numeric entry rejects invalid text, supports correction, keyboard and independent settings', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 1100 }, hasTouch: true });
    try {
        const page = await workshopPage(context);
        await page.locator('#pattern-family').selectOption('number');
        assert.equal(await page.locator('#pattern-range-setting').isVisible(), true);
        await page.locator('#pattern-range').selectOption('100');
        assert.equal(await page.evaluate(() => patternActivity.getSnapshot().maxNumber), 100);
        for (const mode of ['continue', 'create', 'repair']) {
            await mountPattern(page, 'number', mode);
            const slot = page.locator('input[data-slot]').first();
            await slot.fill('999'); await slot.press('Enter');
            assert.equal(await page.evaluate(() => patternCompletions.length), 0);
            await fillPattern(page, [2, 4, 6, 8, 10, 12]);
            await page.locator(role('reset')).tap();
            assert.equal(await page.evaluate(() => patternActivity.getSnapshot().status), 'playing');
            await fillPattern(page, mode === 'create' ? [20, 18, 16, 14, 12, 10] : [2, 4, 6, 8, 10, 12]);
            await page.locator('input[data-slot]').last().press('Enter');
            assert.equal(await page.evaluate(() => patternCompletions.length), 1);
        }
        assert.equal(await page.locator('.coin,.comp-fruit').count(), 0);
        assert.equal(await page.evaluate(() => typeof KalkuActivities.QuantitySession), 'undefined');
        assert.equal(await page.evaluate(() => typeof KalkuActivities.CompositionSession), 'undefined');
    } finally { await context.close(); }
});

test('workshop remounts stop voice and keep usable responsive controls from 320px to desktop', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        await installSpeechMock(context);
        const page = await workshopPage(context);
        await page.locator(role('read')).click();
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'true');
        await page.locator('#pattern-family').selectOption('ABC');
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'false');
        assert.equal(await page.locator('.pattern-widget').count(), 1);
        await page.locator('#pattern-mode').selectOption('create');
        const first = page.locator('button[data-slot]').first(); await first.focus(); await page.keyboard.press('Enter');
        await page.locator('[data-piece="leaf"]').focus(); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => patternActivity.getSnapshot().values[0]), 'leaf');
        for (const width of [320, 390, 768, 1280]) {
            await page.setViewportSize({ width, height: 1100 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
            for (const button of await page.locator('.pattern-widget button:visible').all()) {
                const box = await button.boundingBox(); assert.ok(box.width >= 64 && box.height >= 64, `small control at ${width}`);
                assert.ok(await button.getAttribute('aria-label') || await button.innerText());
            }
            if (process.env.KALKU_QA_OUTPUT && [390, 1280].includes(width)) await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, `patterns-${width}.png`), fullPage: true });
        }
    } finally { await context.close(); }
});

test('workshop has its own launcher, validates five tasks, retries settings and discards an unfinished attempt', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gamePage(context);
        await page.locator('[data-world-id="world-1"]').click();
        await page.locator('#open-pattern-game').click();
        assert.equal(await page.locator('#pattern-modal').isVisible(), true);
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.locator('#start-pattern-btn').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('#close-pattern-btn').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#open-pattern-game').evaluate(el => el === document.activeElement), true);
        await page.locator('#open-pattern-game').click();
        await page.locator('#pattern-level-family').selectOption('ABC');
        await page.locator('#pattern-level-mode').selectOption('create');
        await page.locator('#start-pattern-btn').click();
        assert.equal(await page.locator('#activity-screen').evaluate(el => el.classList.contains('pattern-level-screen')), true);
        for (let task = 0; task < 5; task++) {
            for (let i = 0; i < 9; i++) { await page.locator(`[data-slot="${i}"]`).click(); await page.locator(`[data-piece="${['leaf', 'shell', 'star'][i % 3]}"]`).click(); }
            await page.locator(role('deliver')).click();
            if (task < 4) { assert.equal(await page.evaluate(() => gameEngine.state.xp), 0); await page.locator(role('next')).click(); }
        }
        assert.match(await page.locator('#victory-score-text').textContent(), /5 retos del taller/);
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        await page.locator('#victory-retry-btn').click();
        assert.deepEqual(await page.evaluate(() => { const s = ui.quantityActivity.getSnapshot(); return [s.family, s.mode]; }), ['ABC', 'create']);
        await page.locator('#quit-activity-btn').click();
        assert.equal(await page.evaluate(() => gameEngine.activityRun), null);
        await page.locator('#open-garden-game').click(); await page.locator('#start-garden-btn').click();
        assert.equal(await page.locator('.pattern-widget').count(), 0);
        assert.equal(await page.locator('#activity-screen').evaluate(el => el.classList.contains('pattern-level-screen')), false);
        await page.locator('#quit-activity-btn').click(); await page.reload();
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
    } finally { await context.close(); }
});

async function numberlinePage(context) {
    const page = await context.newPage(); await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${origin}/mockup-ruta-saltos.html`); return page;
}
async function mountNumberline(page, options = {}) {
    await page.evaluate(options => {
        const { max = 20, start = 4, direction = 1, stepSize = 2, jumpCount = 3 } = options;
        const definition = KalkuActivityData.NUMBERLINE_PRACTICES[max].mixed[0];
        window.routeCompletions = [];
        window.numberlineActivity = KalkuActivities.mountNumberlineActivity(document.getElementById('numberline-activity'), {
            definition, createSession: () => new KalkuActivities.NumberlineSession({ schemaVersion: 1, id: 'fixed-route', definition, start, direction, stepSize, jumpCount }),
            onComplete: result => routeCompletions.push(result)
        });
    }, options);
}

test('number-line route uses real buttons for every step and direction, including zero and twenty endpoints', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await numberlinePage(context), errors = []; page.on('pageerror', error => errors.push(error.message));
        for (const step of [1, 2, 5, 10]) for (const direction of [1, -1]) {
            const start = direction === 1 ? 0 : 20;
            await mountNumberline(page, { start, direction, stepSize: step, jumpCount: 2 });
            await page.locator(role('deliver')).click(); assert.equal(await page.evaluate(() => routeCompletions.length), 0);
            await page.locator(`[data-step="${step}"]`).click();
            const movement = page.locator(role(direction === 1 ? 'forward' : 'back'));
            await movement.focus(); await page.keyboard.press('Enter');
            await page.locator(role('deliver')).click(); assert.equal(await page.evaluate(() => routeCompletions.length), 0);
            await movement.click(); await page.locator(role('deliver')).click();
            assert.equal(await page.evaluate(() => routeCompletions.length), 1);
            assert.equal(await page.locator(role('position')).textContent(), String(start + direction * step * 2));
            assert.equal(await page.locator(`${role('history')} li`).count(), 2);
            assert.equal(await page.locator(`${role('detail')} path[marker-end]`).count(), 2);
            assert.equal(await page.locator(role('next')).evaluate(el => el === document.activeElement), true);
            await page.evaluate(() => numberlineActivity.submit()); assert.equal(await page.evaluate(() => routeCompletions.length), 1);
        }
        assert.deepEqual(errors, []);
    } finally { await context.close(); }
});

test('number-line route preserves wrong paths, undoes and resets without help moving the frog or touching a save', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 1100 }, hasTouch: true });
    try {
        const page = await numberlinePage(context); await mountNumberline(page, { start: 0, jumpCount: 4 });
        await page.evaluate(() => localStorage.setItem('mathquest_save_data_v1', 'untouched'));
        for (let i = 0; i < 3; i++) await page.locator(role('forward')).tap();
        await page.locator('[data-step="5"]').tap(); await page.locator(role('forward')).tap();
        await page.locator(role('deliver')).tap();
        assert.equal(await page.locator(role('position')).textContent(), '8');
        assert.equal(await page.evaluate(() => routeCompletions.length), 0);
        assert.match(await page.locator(role('feedback')).textContent(), /Revisa el salto 1/);
        const before = await page.evaluate(() => numberlineActivity.getSnapshot().jumps);
        for (let i = 0; i < 3; i++) await page.locator(role('hint')).tap();
        await page.locator(role('demo')).tap(); assert.equal(await page.locator(role('example')).isVisible(), true);
        assert.deepEqual(await page.evaluate(() => numberlineActivity.getSnapshot().jumps), before);
        await page.keyboard.press('Escape'); assert.equal(await page.locator(role('example')).isVisible(), false);
        await page.locator(role('undo')).tap(); assert.equal(await page.locator(role('position')).textContent(), '3');
        await page.locator(role('reset')).tap(); assert.equal(await page.locator(role('position')).textContent(), '0');
        await page.locator('[data-step="2"]').tap();
        for (let i = 0; i < 4; i++) await page.locator(role('forward')).tap();
        await page.locator(role('deliver')).tap(); assert.equal(await page.evaluate(() => routeCompletions.length), 1);
        assert.equal(await page.evaluate(() => localStorage.getItem('mathquest_save_data_v1')), 'untouched');
        assert.equal(await page.evaluate(() => typeof KalkuActivities.QuantitySession), 'undefined');
        assert.equal(await page.evaluate(() => typeof KalkuActivities.CompositionSession), 'undefined');
        assert.equal(await page.evaluate(() => typeof KalkuActivities.PatternSession), 'undefined');
    } finally { await context.close(); }
});

test('number-line overview, unit scale and controls remain readable on mobile and desktop; remount cancels voice', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        await installSpeechMock(context);
        const page = await numberlinePage(context);
        await page.locator(role('read')).click(); assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'true');
        await page.locator('#route-range').selectOption('100');
        assert.equal(await page.locator(role('read')).getAttribute('aria-pressed'), 'false');
        assert.equal(await page.locator('.numberline-widget').count(), 1);
        await mountNumberline(page, { max: 100, start: 80, stepSize: 10, jumpCount: 2 });
        await page.locator('[data-step="10"]').click();
        await page.locator(role('forward')).click(); await page.locator(role('forward')).click();
        assert.equal(await page.locator(role('position')).textContent(), '100');
        assert.equal(await page.locator(role('forward')).isDisabled(), true);
        assert.equal(await page.locator(`${role('overview')} path[marker-end]`).count(), 2);
        await page.locator(role('previous')).click(); assert.match(await page.locator(role('viewport')).textContent(), /70 a 90/);
        await page.locator(role('locate')).click(); assert.match(await page.locator(role('viewport')).textContent(), /80 a 100/);
        for (const width of [320, 390, 768, 1280]) {
            await page.setViewportSize({ width, height: 1100 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
            for (const button of await page.locator('.numberline-widget button:visible').all()) {
                const box = await button.boundingBox(); assert.ok(box.width >= 64 && box.height >= 64, `small button at ${width}`);
                assert.ok(await button.getAttribute('aria-label') || await button.innerText());
            }
            for (const part of ['detail', 'overview']) {
                const ticks = await page.locator(`${role(part)} svg text`).evaluateAll(nodes => nodes.filter(n => /^\d+$/.test(n.textContent)).map(n => {
                    const box = n.getBoundingClientRect(); return { left: box.left, right: box.right };
                }));
                for (let i = 1; i < ticks.length; i++) assert.ok(ticks[i].left >= ticks[i - 1].right, `overlapping ${part} numbers at ${width}`);
            }
            if (process.env.KALKU_QA_OUTPUT && [390, 1280].includes(width)) await page.screenshot({ path: path.join(process.env.KALKU_QA_OUTPUT, `numberline-${width}.png`), fullPage: true });
        }
        await page.locator(role('deliver')).click(); assert.equal(await page.evaluate(() => routeCompletions.length), 1);
    } finally { await context.close(); }
});

test('number-line independent launcher completes five routes, retries settings and discards unfinished journeys', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
    try {
        const page = await gamePage(context);
        await page.locator('[data-world-id="world-1"]').click(); await page.locator('#open-numberline-game').click();
        assert.equal(await page.locator('#numberline-modal').isVisible(), true);
        await page.keyboard.press('Shift+Tab'); assert.equal(await page.locator('#start-numberline-btn').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Tab'); assert.equal(await page.locator('#close-numberline-btn').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Escape'); assert.equal(await page.locator('#open-numberline-game').evaluate(el => el === document.activeElement), true);
        await page.locator('#open-numberline-game').click();
        await page.locator('#route-level-range').selectOption('100'); await page.locator('#route-level-direction').selectOption('backward');
        await page.locator('#route-level-step').selectOption('10'); await page.locator('#start-numberline-btn').click();
        assert.equal(await page.locator('#activity-screen').evaluate(el => el.classList.contains('numberline-level-screen')), true);
        for (let task = 0; task < 5; task++) {
            const s = await page.evaluate(() => ui.quantityActivity.getSnapshot());
            await page.locator(`[data-step="${s.stepSize}"]`).click();
            for (let jump = 0; jump < s.jumpCount; jump++) await page.locator(role('back')).click();
            await page.locator(role('deliver')).click();
            if (task < 4) { assert.equal(await page.evaluate(() => gameEngine.state.xp), 0); await page.locator(role('next')).click(); }
        }
        assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
        assert.equal(await page.locator('#victory-accuracy-label').textContent(), 'Rutas completas');
        await page.locator('#victory-retry-btn').click();
        assert.deepEqual(await page.evaluate(() => [gameEngine.activityRun.kind, ui.numberlineDirection, ui.numberlineStep, ui.numberlineMax]), ['numberline', 'backward', 10, 100]);
        await page.locator(role('back')).click(); await page.locator('#quit-activity-btn').click();
        assert.equal(await page.evaluate(() => gameEngine.activityRun), null);
        await page.locator('#open-pattern-game').click(); await page.locator('#start-pattern-btn').click();
        assert.equal(await page.locator('.numberline-widget').count(), 0);
        assert.equal(await page.locator('#activity-screen').evaluate(el => el.classList.contains('numberline-level-screen')), false);
        await page.locator('#quit-activity-btn').click(); await page.reload(); assert.equal(await page.evaluate(() => gameEngine.state.xp), 85);
    } finally { await context.close(); }
});
