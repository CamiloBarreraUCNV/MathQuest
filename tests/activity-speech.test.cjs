const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/activities/activity-speech.js'), 'utf8');

function setup(voices = [{ lang: 'es-ES' }, { lang: 'es-CL' }], supported = true) {
    let nextTimer = 0;
    const timers = new Map(), listeners = new Set(), states = [], spoken = [];
    const synth = {
        voices, cancelled: 0,
        getVoices() { return this.voices; },
        speak(utterance) { spoken.push(utterance); utterance.onstart(); },
        cancel() { this.cancelled++; },
        addEventListener(_, handler) { listeners.add(handler); },
        removeEventListener(_, handler) { listeners.delete(handler); }
    };
    const window = {
        speechSynthesis: supported ? synth : undefined,
        SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
        setTimeout(fn) { const id = ++nextTimer; timers.set(id, fn); return id; },
        clearTimeout(id) { timers.delete(id); }
    };
    const context = { KalkuActivities: {} };
    vm.runInNewContext(source, context);
    const reader = context.KalkuActivities.createActivitySpeech(window, state => states.push(state));
    return { window, synth, reader, spoken, states, timers, listeners, api: context.KalkuActivities };
}

test('speech prefers Chilean Spanish and finishes without lingering handlers or timers', () => {
    const env = setup();
    env.reader.speak('Prepara cuatro monedas.');
    assert.equal(env.spoken[0].voice.lang, 'es-CL');
    assert.equal(env.spoken[0].text, 'Prepara cuatro monedas.');
    assert.equal(env.reader.state, 'speaking');
    env.spoken[0].onend();
    assert.equal(env.reader.state, 'idle');
    assert.equal(env.timers.size, 0);
    assert.equal(env.listeners.size, 0);
});

test('speech falls back to another Spanish voice but never an unrelated language', () => {
    const env = setup([{ lang: 'en-US' }, { lang: 'es-MX' }]);
    env.reader.speak('Hola');
    assert.equal(env.spoken[0].voice.lang, 'es-MX');
    const unavailable = setup([{ lang: 'en-US' }]);
    unavailable.reader.speak('Hola');
    assert.equal(unavailable.spoken.length, 0);
    assert.equal(unavailable.reader.state, 'unavailable');
    assert.equal(unavailable.listeners.size, 0);
});

test('late-loaded voices can start speech; cancellation ignores stale completion events', () => {
    const env = setup([]);
    env.reader.speak('Hola');
    assert.equal(env.reader.state, 'loading');
    env.synth.voices = [{ lang: 'es-CL' }];
    for (const handler of [...env.listeners]) handler();
    assert.equal(env.spoken.length, 1);
    env.reader.stop();
    const states = env.states.length;
    env.spoken[0].onend();
    env.spoken[0].onerror();
    assert.equal(env.states.length, states);
    assert.equal(env.reader.state, 'idle');
    assert.equal(env.timers.size, 0);
});

test('an unavailable API, missing voices or a stalled voice cannot block the task', () => {
    const unavailable = setup([], false);
    unavailable.reader.speak('Hola');
    assert.equal(unavailable.reader.state, 'unavailable');
    const pending = setup([]);
    pending.reader.speak('Hola');
    for (const callback of [...pending.timers.values()]) callback();
    assert.equal(pending.reader.state, 'unavailable');
    assert.equal(pending.listeners.size, 0);
    const stalled = setup();
    stalled.synth.speak = utterance => stalled.spoken.push(utterance);
    stalled.reader.speak('Hola');
    for (const callback of [...stalled.timers.values()]) callback();
    assert.equal(stalled.reader.state, 'unavailable');
    assert.ok(stalled.synth.cancelled > 0);
});

test('a new reader takes ownership; destroying another instance cannot interrupt it', () => {
    const env = setup();
    const other = env.api.createActivitySpeech(env.window);
    env.reader.speak('Primera instrucción');
    other.speak('Otra instrucción');
    assert.equal(env.reader.state, 'idle');
    const cancelled = env.synth.cancelled;
    env.reader.destroy();
    assert.equal(env.synth.cancelled, cancelled);
    assert.equal(other.state, 'speaking');
    other.destroy();
    assert.equal(env.timers.size, 0);
    env.reader.speak('No debe empezar');
    assert.equal(env.spoken.length, 2);
});
