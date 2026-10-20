(function (root) {
    'use strict';
    const api = root.KalkuActivities;
    const mounted = api._mountedActivities || (api._mountedActivities = new WeakMap());
    const pieces = { leaf: ['🍃', 'hoja'], shell: ['🐚', 'concha'], star: ['⭐', 'estrella'], flower: ['🌼', 'flor'] };
    let sequence = 0;
    class PatternActivity {
        constructor(element, options) {
            if (!element || element.nodeType !== 1 || !options) throw new TypeError('Falta contenedor o configuración.');
            for (const key of ['onComplete', 'createSession']) if (options[key] !== undefined && typeof options[key] !== 'function') throw new TypeError(`Configuración ${key} inválida.`);
            this.nextChallenge = api.createPatternChallengeFactory(options.definition, options.random);
            mounted.get(element)?.destroy();
            this.root = element; this.options = options; this.document = element.ownerDocument; this.window = this.document.defaultView;
            this.events = new this.window.AbortController(); this.id = `pattern-${++sequence}`;
            element.classList.add('pattern-widget');
            element.innerHTML = markup(this.id);
            this.nodes = Object.fromEntries([...element.querySelectorAll('[data-role]')].map(node => [node.dataset.role, node]));
            this.speech = api.createActivitySpeech(this.window, state => {
                if (this.destroyed) return;
                const busy = ['loading', 'speaking'].includes(state);
                this.nodes.read.textContent = busy ? '⏹ Detener lectura' : '🔊 Escuchar reto';
                this.nodes.read.setAttribute('aria-pressed', String(busy));
                this.nodes.audio.textContent = state === 'unavailable' ? 'La voz no está disponible. Puedes continuar con el texto y el ejemplo.' : '';
            });
            this.bind(); this.start(); mounted.set(element, this);
        }
        listen(node, event, fn) { node.addEventListener(event, fn, { signal: this.events.signal }); }
        getSnapshot() { return this.session.getSnapshot(); }
        message(text) { this.nodes.feedback.textContent = text; }
        start() {
            if (this.destroyed) return;
            this.stopAssistance();
            const session = this.options.createSession ? this.options.createSession() : new api.PatternSession(this.nextChallenge());
            if (!session) return;
            this.session = session; this.grouping = false;
            const s = this.getSnapshot(); this.selected = s.editable.indexOf(true);
            this.buildBoard(s); this.render(); this.message('Sin prisa. Observa, prueba y corrige todas las veces que quieras.');
        }
        instruction(s) {
            const name = s.family === 'number' ? 'numérico' : s.family;
            return s.mode === 'continue' ? `Continúa el patrón ${name}. Completa los espacios que faltan.`
                : s.mode === 'repair' ? `Repara el patrón ${name}. Hay una pieza equivocada: encuéntrala y cámbiala.`
                    : s.family === 'number' ? `Crea una serie de seis números del 1 al ${s.maxNumber}. Mantén un salto de ${s.maxNumber === 20 ? '1 o 2' : '1, 2, 5 o 10'}, avanzando o retrocediendo.`
                        : `Crea tu propio patrón ${name}. Elige tus piezas y repite el grupo tres veces. Cada letra distinta es una pieza distinta.`;
        }
        buildBoard(s) {
            this.nodes.board.replaceChildren();
            this.nodes.board.style.setProperty('--pattern-length', String(s.values.length));
            s.values.forEach((value, index) => {
                const item = this.document.createElement('li');
                const count = this.document.createElement('span'); count.className = 'pattern-position'; count.textContent = String(index + 1); count.setAttribute('aria-hidden', 'true');
                item.append(count);
                const slot = this.document.createElement(s.editable[index] ? s.family === 'number' ? 'input' : 'button' : 'span');
                slot.dataset.slot = index; slot.className = 'pattern-slot';
                if (slot.tagName === 'INPUT') {
                    slot.type = 'text'; slot.inputMode = 'numeric'; slot.maxLength = 3; slot.autocomplete = 'off';
                } else if (slot.tagName === 'BUTTON') slot.type = 'button';
                else slot.classList.add('pattern-fixed');
                slot.setAttribute('aria-describedby', `${this.id}-controls`);
                item.append(slot); this.nodes.board.append(item);
            });
            this.slots = [...this.nodes.board.querySelectorAll('[data-slot]')];
        }
        render() {
            const s = this.getSnapshot(), done = s.status === 'completed';
            this.nodes.request.textContent = this.instruction(s);
            this.nodes.rule.textContent = s.family === 'number' ? `Números del 1 al ${s.maxNumber} · Un salto constante`
                : { AB: 'Dos piezas distintas, una y una', AAB: 'Dos iguales y una distinta', ABC: 'Tres piezas distintas, en el mismo orden' }[s.family];
            this.nodes.controls.textContent = s.family === 'number' ? 'Escribe en los espacios editables. Usa Tab para pasar al siguiente. Los números con candado se conservan.'
                : 'Pulsa un espacio y después una pieza del taller. Puedes reemplazarla o borrarla. Los espacios con candado se conservan.';
            this.nodes.palette.hidden = s.family === 'number';
            const groupLength = { AB: 2, AAB: 3, ABC: 3 }[s.family];
            this.slots.forEach((slot, index) => {
                const value = s.values[index], name = value === null ? 'vacío' : pieces[value]?.[1] || String(value);
                if (slot.tagName === 'INPUT') { slot.value = value === null ? '' : String(value); slot.disabled = done; slot.setAttribute('aria-invalid', 'false'); }
                else { slot.textContent = value === null ? '＋' : pieces[value]?.[0] || String(value); if (slot.tagName === 'BUTTON') slot.disabled = done; }
                slot.setAttribute('aria-label', `Posición ${index + 1}: ${name}${s.editable[index] ? '' : ', fija'}`);
                slot.classList.toggle('pattern-selected', s.editable[index] && s.family !== 'number' && index === this.selected);
                if (slot.tagName === 'BUTTON') slot.setAttribute('aria-pressed', String(index === this.selected));
                slot.parentElement.classList.toggle('pattern-group-even', this.grouping && groupLength && Math.floor(index / groupLength) % 2 === 0);
                slot.parentElement.classList.toggle('pattern-group-odd', this.grouping && groupLength && Math.floor(index / groupLength) % 2 === 1);
            });
            this.nodes.selection.textContent = s.family === 'number' ? 'Completa la serie de izquierda a derecha.' : `Espacio seleccionado: ${this.selected + 1}. Elige una pieza.`;
            this.nodes.deliver.disabled = done; this.nodes.reset.disabled = done; this.nodes.hint.disabled = done;
            for (const button of this.nodes.palette.querySelectorAll('button')) button.disabled = done;
            this.nodes.next.hidden = !done; this.nodes.new.hidden = this.options.allowSkip === false;
            this.nodes.group.hidden = s.family === 'number';
            this.nodes.group.setAttribute('aria-pressed', String(this.grouping));
        }
        submit() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.stopAssistance();
            const result = this.session.submit(); this.render();
            if (result.isNewCompletion) {
                this.message(result.mode === 'create' ? '¡Tu patrón sigue la misma regla de principio a fin!' : '¡Lo lograste! La secuencia mantiene su regla.');
                this.nodes.next.focus({ preventScroll: true });
                this.root.dispatchEvent(new this.window.CustomEvent('kalku:activity-completed', { detail: JSON.parse(JSON.stringify(result)), bubbles: true }));
                this.options.onComplete?.(JSON.parse(JSON.stringify(result)));
            } else this.message(result.values.includes(null) ? 'Quedan espacios por completar. Puedes seguir colocando piezas.'
                : 'Revisa la regla y el orden. Tus piezas se conservan para que puedas corregir. Una pista puede ayudarte.');
            return result;
        }
        place(value) {
            if (!this.session.set(this.selected, value)) return;
            this.stopAssistance();
            const position = this.selected + 1;
            const s = this.getSnapshot();
            if (s.mode !== 'repair' && value !== null) {
                const next = s.editable.findIndex((editable, i) => editable && s.values[i] === null && i > this.selected);
                if (next >= 0) this.selected = next;
            }
            this.render(); this.message(`Espacio ${position}: ${value === null ? 'borrado' : pieces[value][1]}. ${this.nodes.selection.textContent}`);
        }
        stopAssistance() { this.speech?.stop(); if (this.nodes) { this.nodes.example.hidden = true; this.nodes.demo.setAttribute('aria-expanded', 'false'); } }
        bind() {
            this.listen(this.nodes.board, 'click', event => {
                const slot = event.target.closest('button[data-slot]');
                if (slot && !slot.disabled) { this.selected = Number(slot.dataset.slot); this.render(); this.message(this.nodes.selection.textContent); }
            });
            this.listen(this.nodes.board, 'input', event => {
                const input = event.target.closest('input[data-slot]'); if (!input) return;
                this.stopAssistance();
                const raw = input.value.trim(), value = /^\d{1,3}$/.test(raw) ? Number(raw) : null;
                this.session.set(Number(input.dataset.slot), null);
                const valid = value !== null && this.session.set(Number(input.dataset.slot), value);
                input.setAttribute('aria-invalid', String(!valid && raw !== ''));
                input.setAttribute('aria-label', `Posición ${Number(input.dataset.slot) + 1}: ${valid ? value : 'vacío'}`);
                if (!valid && raw !== '') this.message(`Escribe un número entero del 1 al ${this.getSnapshot().maxNumber}.`);
            });
            this.listen(this.nodes.board, 'keydown', event => { if (event.key === 'Enter' && event.target.tagName === 'INPUT') { event.preventDefault(); this.submit(); } });
            this.listen(this.nodes.palette, 'click', event => { const button = event.target.closest('[data-piece]'); if (button) this.place(button.dataset.piece === 'clear' ? null : button.dataset.piece); });
            this.listen(this.nodes.deliver, 'click', () => this.submit());
            this.listen(this.nodes.reset, 'click', () => { if (this.session.reset()) { this.stopAssistance(); this.render(); this.message('Volvemos al inicio del mismo reto. Puedes intentarlo otra vez.'); } });
            for (const key of ['new', 'next']) this.listen(this.nodes[key], 'click', () => { this.start(); this.nodes.request.focus({ preventScroll: true }); });
            this.listen(this.nodes.hint, 'click', () => { this.stopAssistance(); this.session.useHint(); this.message(`Pista ${this.getSnapshot().assistance.hintLevel}. ${this.session.getHint()}`); });
            this.listen(this.nodes.group, 'click', () => { this.grouping = !this.grouping; if (this.grouping) this.session.useGrouping(); this.render(); });
            this.listen(this.nodes.demo, 'click', () => {
                const show = this.nodes.example.hidden; this.stopAssistance();
                if (show) {
                    this.session.useDemonstration(); this.nodes.example.hidden = false; this.nodes.demo.setAttribute('aria-expanded', 'true');
                    this.nodes.example.textContent = this.getSnapshot().family === 'number'
                        ? 'Otro ejemplo: 2, 4, 6, 8, 10, 12. Sumamos 2 cada vez. Si aparece 9 en lugar de 8, lo cambiamos para recuperar el salto de 2. Este ejemplo no cambia tu serie.'
                        : `Otro ejemplo: ${{ AB: 'luna, sol; luna, sol; luna, sol. El grupo luna-sol', AAB: 'luna, luna, sol; luna, luna, sol; luna, luna, sol. El grupo luna-luna-sol', ABC: 'luna, sol, nube; luna, sol, nube; luna, sol, nube. El grupo luna-sol-nube' }[this.getSnapshot().family]} se repite. Si una pieza cambia el orden, la reemplazamos para recuperar el grupo. Para crear, elegimos nuestras propias piezas. Este ejemplo no cambia tu secuencia.`;
                }
            });
            this.listen(this.nodes.read, 'click', () => {
                if (['loading', 'speaking'].includes(this.speech.state)) this.speech.stop();
                else { const s = this.getSnapshot(); this.speech.speak(`${this.instruction(s)}. ${this.nodes.controls.textContent}. Secuencia: ${s.values.map(v => v === null ? 'espacio vacío' : pieces[v]?.[1] || v).join(', ')}.`); }
            });
            this.listen(this.root, 'keydown', event => { if (event.key === 'Escape') this.stopAssistance(); });
            this.listen(this.document, 'visibilitychange', () => { if (this.document.hidden) this.stopAssistance(); });
        }
        destroy() {
            if (this.destroyed) return;
            this.stopAssistance(); this.speech.destroy(); this.events.abort(); this.destroyed = true;
            if (mounted.get(this.root) === this) mounted.delete(this.root);
            this.root.replaceChildren(); this.root.classList.remove('pattern-widget');
        }
    }
    function markup(id) {
        return `<div class="pattern-intro"><span aria-hidden="true">🛠️</span><div><p class="pattern-eyebrow">Observa · descubre · construye</p><h2 data-role="request" tabindex="-1"></h2><p data-role="rule"></p></div></div>
          <p data-role="controls" id="${id}-controls"></p>
          <section class="pattern-workbench" aria-label="Mesa de patrones"><ol class="pattern-board" data-role="board" aria-label="Secuencia de izquierda a derecha"></ol></section>
          <p class="pattern-selection" data-role="selection"></p>
          <div class="pattern-palette" data-role="palette" role="group" aria-label="Piezas del taller">${Object.entries(pieces).map(([key, [emoji, name]]) => `<button type="button" data-piece="${key}"><span aria-hidden="true">${emoji}</span>${name}</button>`).join('')}<button type="button" data-piece="clear">⌫ Borrar pieza</button></div>
          <div class="pattern-actions"><button type="button" data-role="group" aria-pressed="false">🔎 Ver grupos</button><button type="button" data-role="hint">💡 Una pista</button><button type="button" data-role="read" aria-pressed="false">🔊 Escuchar reto</button><button type="button" data-role="demo" aria-expanded="false" aria-controls="${id}-example">👆 Muéstrame cómo</button></div>
          <p data-role="audio" role="status"></p><aside class="pattern-example" data-role="example" id="${id}-example" hidden></aside>
          <p class="pattern-feedback" data-role="feedback" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="pattern-actions"><button type="button" class="pattern-primary" data-role="deliver">Comprobar patrón ➜</button><button type="button" class="pattern-primary" data-role="next" hidden>Siguiente reto ➜</button><button type="button" data-role="reset">Volver a empezar</button><button type="button" data-role="new">Otro reto</button></div>`;
    }
    api.mountPatternActivity = (element, options) => new PatternActivity(element, options);
})(globalThis);
