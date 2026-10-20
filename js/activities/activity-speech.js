// Optional, user-triggered speech. Does not require audio files or write preferences.
(function (root) {
    'use strict';
    const owners = new WeakMap();

    root.KalkuActivities.createActivitySpeech = function (window, onState = () => {}) {
        const synth = window.speechSynthesis;
        const supported = Boolean(synth && typeof synth.speak === 'function' &&
            typeof synth.cancel === 'function' && typeof synth.getVoices === 'function' && window.SpeechSynthesisUtterance);
        let disposed = false, epoch = 0, waiting = null, timeout = null, startTimeout = null;
        let status = 'idle';
        const update = next => {
            status = next;
            if (!disposed) onState(next);
        };
        function cleanup() {
            if (waiting) synth.removeEventListener?.('voiceschanged', waiting);
            waiting = null;
            window.clearTimeout(timeout);
            window.clearTimeout(startTimeout);
            timeout = startTimeout = null;
        }
        function finish(next, cancel = false) {
            epoch++;
            cleanup();
            if (owners.get(window) === controller) {
                owners.delete(window);
                if (cancel) { try { synth.cancel(); } catch (_) { /* Keep the visual task usable. */ } }
            }
            update(next);
        }
        const controller = {
            get state() { return status; },
            get supported() { return supported; },
            stop() { if (!disposed) finish('idle', true); },
            speak(text) {
                if (disposed) return;
                owners.get(window)?.stop();
                controller.stop();
                if (!supported) { update('unavailable'); return; }
                const token = ++epoch;
                owners.set(window, controller);
                update('loading');
                function attempt() {
                    if (disposed || epoch !== token) return;
                    try {
                        const voices = synth.getVoices();
                        if (!voices.length) return;
                        const voice = voices.find(item => /^es[-_]CL$/i.test(item.lang)) ||
                            voices.find(item => /^es(?:[-_]|$)/i.test(item.lang));
                        if (!voice) { finish('unavailable'); return; }
                        cleanup();
                        const utterance = new window.SpeechSynthesisUtterance(text);
                        utterance.voice = voice;
                        utterance.lang = voice.lang;
                        utterance.rate = 0.85;
                        utterance.onstart = () => {
                            if (disposed || epoch !== token) return;
                            window.clearTimeout(startTimeout);
                            update('speaking');
                        };
                        utterance.onend = () => { if (!disposed && epoch === token) finish('idle'); };
                        utterance.onerror = () => { if (!disposed && epoch === token) finish('unavailable', true); };
                        startTimeout = window.setTimeout(() => {
                            if (!disposed && epoch === token) finish('unavailable', true);
                        }, 5000);
                        synth.speak(utterance);
                    } catch (_) {
                        if (!disposed && epoch === token) finish('unavailable', true);
                    }
                }
                waiting = attempt;
                synth.addEventListener?.('voiceschanged', waiting);
                timeout = window.setTimeout(() => {
                    if (!disposed && epoch === token) finish('unavailable', true);
                }, 1800);
                attempt();
            },
            destroy() {
                if (disposed) return;
                controller.stop();
                disposed = true;
            }
        };
        return controller;
    };
})(globalThis);
