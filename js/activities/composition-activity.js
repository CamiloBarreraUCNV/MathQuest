// DOM host for two-part activities. Models own validation; this component never writes saves.
(function (root) {
    'use strict';
    const api = root.KalkuActivities;
    const mounted = api._mountedActivities || (api._mountedActivities = new WeakMap());
    let sequence = 0;
    class CompositionActivity {
        constructor(element, options) {
            if (!element || element.nodeType !== 1 || !options) throw new TypeError('Falta contenedor o configuración.');
            for (const key of ['onComplete', 'createSession']) if (options[key] !== undefined && typeof options[key] !== 'function') throw new TypeError(`Configuración ${key} inválida.`);
            this.nextChallenge = api.createCompositionChallengeFactory(options.definition, options.random);
            mounted.get(element)?.destroy();
            this.root = element;
            this.document = element.ownerDocument;
            this.window = this.document.defaultView;
            this.options = options;
            this.events = new this.window.AbortController();
            this.id = `composition-${++sequence}`;
            this.destroyed = false;
            this.counting = false;
            element.classList.add('composition-widget');
            element.innerHTML = markup(this.id);
            this.nodes = Object.fromEntries([...element.querySelectorAll('[data-role]')].map(node => [node.dataset.role, node]));
            this.speech = api.createActivitySpeech(this.window, state => {
                if (this.destroyed) return;
                const busy = ['speaking', 'loading'].includes(state);
                this.nodes.read.textContent = busy ? '⏹ Detener lectura' : '🔊 Escuchar encargo';
                this.nodes.read.setAttribute('aria-pressed', String(busy));
                this.nodes.audio.textContent = state === 'unavailable' ? 'No se pudo leer. Puedes seguir con el texto y el ejemplo.'
                    : state === 'loading' ? 'Preparando la voz…' : state === 'speaking' ? 'Leyendo el encargo…' : '';
            });
            this.bind();
            this.start();
            mounted.set(element, this);
        }
        listen(node, event, fn) { node.addEventListener(event, fn, { signal: this.events.signal }); }
        getSnapshot() { return this.session.getSnapshot(); }
        message(text) { this.nodes.feedback.textContent = text; }
        image() { const fruit = this.document.createElement('span'); fruit.className = 'comp-fruit'; fruit.textContent = '🍎'; fruit.setAttribute('aria-hidden', 'true'); return fruit; }
        start() {
            if (this.destroyed) return;
            this.stopAssistance();
            const session = this.options.createSession ? this.options.createSession() : new api.CompositionSession(this.nextChallenge());
            if (!session) return;
            this.session = session;
            this.session.setCounting(this.counting);
            this.selected = session.definition.mode === 'missing' ? 'right' : 'left';
            this.nodes.answer.value = '';
            this.render();
            this.message('Sin prisa: puedes contar, corregir y pedir una pista.');
        }
        instruction(s) {
            return s.mode === 'compose' ? `Hay ${s.leftQuantity} manzanas en la canasta A y ${s.rightQuantity} en la B. ¿Cuántas hay en total?`
                : s.mode === 'missing' ? `Necesitamos ${s.targetQuantity} manzanas en total. En A ya hay ${s.givenLeft}. Completa la canasta B.`
                    : `Reparte ${s.targetQuantity} manzanas entre A y B de dos formas distintas. Pon al menos una en cada canasta.`;
        }
        renderCoins(side, s) {
            const container = this.nodes[`${side}-coins`]; container.replaceChildren();
            const editable = s.mode !== 'compose' && !(s.mode === 'missing' && side === 'left');
            const size = side === 'reserve' ? s.parts.reserve.length : !editable
                ? Math.max(10, Math.ceil(s.parts[side].length / 10) * 10) : this.session.definition.maxTarget > 10 ? 20 : 10;
            for (let index = 0; index < size; index++) {
                const id = s.parts[side][index], cell = this.document.createElement('div');
                cell.className = 'comp-cell';
                if (side !== 'reserve' && index === 10) cell.classList.add('comp-second-frame');
                if (id !== undefined) {
                    if (editable) {
                        const button = this.document.createElement('button'); button.type = 'button'; button.className = 'comp-object';
                        button.dataset.token = id; button.dataset.location = side; button.disabled = s.status !== 'playing';
                        button.setAttribute('aria-label', `${side === 'reserve' ? 'Enviar a la canasta elegida' : 'Devolver a la cosecha'}: manzana ${index + 1}, ${side === 'reserve' ? 'cosecha' : 'canasta ' + (side === 'left' ? 'A' : 'B')}`);
                        button.setAttribute('aria-describedby', `${this.id}-controls ${this.id}-keyboard`);
                        button.append(this.image()); cell.append(button);
                    } else cell.append(this.image());
                    if (s.counting && side !== 'reserve') {
                        const number = this.document.createElement('span'); number.className = 'comp-number'; number.textContent = index + 1;
                        number.setAttribute('aria-hidden', 'true'); cell.append(number);
                    }
                } else cell.setAttribute('aria-hidden', 'true');
                container.append(cell);
            }
            container.setAttribute('aria-label', `${side === 'reserve' ? 'Cosecha' : 'Canasta ' + (side === 'left' ? 'A' : 'B')}: ${s.parts[side].length} manzanas`);
        }
        render() {
            const s = this.getSnapshot(), playing = s.status === 'playing', done = s.status === 'completed';
            this.nodes.request.textContent = this.instruction(s);
            this.nodes.controls.textContent = s.mode === 'compose' ? 'Cuenta las manzanas de A y B. Escribe cuántas hay entre las dos canastas.'
                : s.mode === 'missing' ? 'La canasta A se conserva. Añade o devuelve manzanas en B hasta formar el total.'
                    : 'Elige A o B para enviar manzanas de la cosecha. Puedes devolverlas o moverlas a la otra canasta arrastrando.';
            this.nodes.target.textContent = s.mode === 'compose' ? '¿Total?' : s.targetQuantity;
            this.nodes['target-label'].textContent = s.mode === 'compose' ? 'Junta las dos partes' : 'Manzanas entre las dos canastas';
            for (const side of ['left', 'right', 'reserve']) this.renderCoins(side, s);
            this.nodes.bank.hidden = s.mode === 'compose';
            this.nodes['destination-controls'].hidden = s.mode !== 'split';
            this.nodes['left-lock'].hidden = s.mode === 'split';
            this.nodes['left-lock'].textContent = 'Esta parte se conserva';
            this.nodes['left-actions'].hidden = s.mode !== 'split';
            this.nodes['right-actions'].hidden = s.mode === 'compose';
            for (const side of ['left', 'right']) {
                this.nodes[`add-${side}`].disabled = !playing || !s.parts.reserve.length;
                this.nodes[`remove-${side}`].disabled = !playing || !s.parts[side].length;
                this.nodes[`send-${side}`].disabled = !playing || side === 'left' && s.mode === 'missing';
                this.nodes[`send-${side}`].setAttribute('aria-pressed', String(this.selected === side));
                this.nodes[`${side}-count`].textContent = `${s.parts[side].length} ${s.parts[side].length === 1 ? 'manzana' : 'manzanas'}`;
            }
            this.nodes.equation.textContent = s.mode === 'compose' ? `${s.leftQuantity} + ${s.rightQuantity} = ${done ? s.answer : '?'}`
                : s.mode === 'missing' ? `${s.givenLeft} + ${done ? s.rightQuantity : '?'} = ${s.targetQuantity}`
                    : `${s.leftQuantity} + ${s.rightQuantity} = ${s.finalQuantity} · Buscamos ${s.targetQuantity}`;
            this.nodes['answer-row'].hidden = s.mode !== 'compose'; this.nodes.answer.disabled = !playing;
            this.nodes.deliver.hidden = !playing;
            this.nodes.another.hidden = s.status !== 'solution-found';
            this.nodes.next.hidden = !done;
            this.nodes.new.hidden = this.options.allowSkip === false || done || s.status === 'solution-found';
            this.nodes.reset.disabled = !playing || s.mode === 'compose';
            this.nodes.hint.disabled = !playing; this.nodes.demo.disabled = !playing;
            this.nodes.count.setAttribute('aria-pressed', String(s.counting));
            this.nodes.count.textContent = s.counting ? '🧮 Ocultar la cuenta' : '🧮 Contemos juntos';
            this.nodes.solutions.hidden = s.mode !== 'split';
            this.nodes.solutions.textContent = `Formas encontradas: ${s.solutions.length} de ${s.requiredSolutions}` +
                (s.solutions.length ? ` · ${s.solutions.map(p => `${p.left} + ${p.right}`).join(' / ')}` : '');
        }
        move(token, destination) {
            if (this.destroyed || !this.session.move(token, destination)) return false;
            this.stopAssistance(); this.render();
            const s = this.getSnapshot(); this.message(`Canasta A: ${s.leftQuantity}. Canasta B: ${s.rightQuantity}. Puedes seguir revisando.`);
            return true;
        }
        submit() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.stopAssistance();
            const raw = this.nodes.answer.value.trim();
            const answer = /^\d{1,2}$/.test(raw) ? Number(raw) : null;
            const result = this.session.submit(answer);
            this.render();
            if (result.isNewCompletion) {
                this.message(result.mode === 'split' && result.requiredSolutions > 1 ? '¡Encontraste dos maneras de formar el mismo total!' : '¡Las dos partes forman el total!');
                this.nodes.next.focus({ preventScroll: true });
                this.root.dispatchEvent(new this.window.CustomEvent('kalku:activity-completed', { detail: JSON.parse(JSON.stringify(result)), bubbles: true }));
                this.options.onComplete?.(JSON.parse(JSON.stringify(result)));
            } else if (result.status === 'solution-found') {
                this.message(`¡${result.leftQuantity} + ${result.rightQuantity} = ${result.targetQuantity}! Ahora busca otra pareja de cantidades.`);
                this.nodes.another.focus({ preventScroll: true });
            } else if (result.duplicate) this.message('Esa pareja ya está encontrada, aunque cambies A por B. Mueve manzanas para usar otras cantidades.');
            else if (result.invalidAnswer) { this.message('Escribe un número entero de 2 a 20 para el total.'); this.nodes.answer.focus({ preventScroll: true }); }
            else if (result.emptyPart) this.message('Pon al menos una manzana en cada canasta antes de comprobar.');
            else this.help();
        }
        help() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.stopAssistance(); this.session.useHint();
            const hint = api.getCompositionHint(this.getSnapshot());
            if (hint.showCounting) this.session.setCounting(true);
            this.render(); this.message(`${hint.title}. ${hint.text}`);
        }
        stopAssistance() { this.cancelDrag(); this.speech?.stop(); if (this.nodes?.example) { this.nodes.example.hidden = true; this.nodes.demo.setAttribute('aria-expanded', 'false'); } }
        bind() {
            this.listen(this.nodes.deliver, 'click', () => this.submit());
            this.listen(this.nodes.answer, 'keydown', e => { if (e.key === 'Enter') { e.preventDefault(); this.submit(); } });
            this.listen(this.nodes.hint, 'click', () => this.help());
            this.listen(this.nodes.count, 'click', () => { this.counting = !this.getSnapshot().counting; this.session.setCounting(this.counting); this.cancelDrag(); this.render(); });
            for (const side of ['left', 'right']) {
                this.listen(this.nodes[`send-${side}`], 'click', () => { this.selected = side; this.render(); });
                this.listen(this.nodes[`add-${side}`], 'click', () => { this.move(this.getSnapshot().parts.reserve[0], side); if (this.nodes[`add-${side}`].disabled) this.nodes.deliver.focus({ preventScroll: true }); });
                this.listen(this.nodes[`remove-${side}`], 'click', () => { this.move(this.getSnapshot().parts[side].at(-1), 'reserve'); if (this.nodes[`remove-${side}`].disabled) this.nodes[`add-${side}`].focus({ preventScroll: true }); });
            }
            this.listen(this.nodes.reset, 'click', () => { if (this.session.resetPlacement()) { this.stopAssistance(); this.render(); this.message('Puedes volver a intentarlo. El total buscado sigue siendo el mismo.'); } });
            this.listen(this.nodes.another, 'click', () => { if (this.session.tryAnother()) { this.render(); this.message('El total sigue siendo el mismo. Busca una pareja de cantidades nueva.'); this.nodes['add-left'].focus({ preventScroll: true }); } });
            for (const name of ['next', 'new']) this.listen(this.nodes[name], 'click', () => { this.start(); this.nodes.request.focus({ preventScroll: true }); });
            this.listen(this.nodes.read, 'click', () => {
                if (['loading', 'speaking'].includes(this.speech.state)) this.speech.stop();
                else { this.nodes.example.hidden = true; this.nodes.demo.setAttribute('aria-expanded', 'false'); this.speech.speak(`${this.nodes.request.textContent} ${this.nodes.controls.textContent}`); }
            });
            this.listen(this.nodes.demo, 'click', () => { const show = this.nodes.example.hidden; this.stopAssistance(); this.nodes.example.hidden = !show; this.nodes.demo.setAttribute('aria-expanded', String(show)); if (show) this.session.useDemonstration(); });
            this.listen(this.root, 'click', e => {
                if (e.detail && this.window.performance.now() < (this.suppressClickUntil || 0)) return;
                const button = e.target.closest('[data-token]'); if (!button || !this.root.contains(button)) return;
                const source = button.dataset.location;
                if (this.move(Number(button.dataset.token), source === 'reserve' ? this.selected : 'reserve') && e.detail === 0)
                    (this.nodes[`${source}-coins`].querySelector('button:not(:disabled)') || this.nodes.deliver).focus({ preventScroll: true });
            });
            this.listen(this.root, 'pointerdown', e => {
                const button = e.target.closest('[data-token]');
                if (!button || button.disabled || !e.isPrimary || e.button !== 0) return;
                this.cancelDrag(); this.cancelledPointer = null;
                this.drag = { token: Number(button.dataset.token), pointer: e.pointerId, x: e.clientX, y: e.clientY };
            });
            this.listen(this.root, 'pointermove', e => {
                const drag = this.drag; if (!drag || drag.pointer !== e.pointerId) return;
                if (!drag.ghost && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
                if (!drag.ghost) { drag.ghost = this.document.createElement('div'); drag.ghost.className = 'comp-ghost'; drag.ghost.setAttribute('aria-hidden', 'true'); drag.ghost.append(this.image()); this.root.append(drag.ghost); this.root.setPointerCapture(e.pointerId); }
                e.preventDefault(); drag.ghost.style.left = `${e.clientX}px`; drag.ghost.style.top = `${e.clientY}px`;
            });
            this.listen(this.window, 'pointerup', e => {
                const drag = this.drag;
                if (!drag && this.cancelledPointer === e.pointerId) { this.suppressClickUntil = this.window.performance.now() + 450; this.cancelledPointer = null; return; }
                if (!drag || drag.pointer !== e.pointerId) return;
                const zone = drag.ghost && this.document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-part]');
                if (drag.ghost) this.suppressClickUntil = this.window.performance.now() + 450;
                this.cancelDrag(false);
                if (zone && this.root.contains(zone)) this.move(drag.token, zone.dataset.part);
            });
            this.listen(this.window, 'pointercancel', () => this.cancelDrag());
            this.listen(this.window, 'blur', () => this.stopAssistance());
            this.listen(this.document, 'visibilitychange', () => { if (this.document.hidden) this.stopAssistance(); });
            this.listen(this.root, 'keydown', e => { if (e.key === 'Escape') this.stopAssistance(); });
        }
        cancelDrag(suppress = true) {
            if (!this.drag) return;
            const drag = this.drag; this.drag = null;
            if (suppress) this.cancelledPointer = drag.pointer;
            drag.ghost?.remove();
            if (this.root.hasPointerCapture(drag.pointer)) this.root.releasePointerCapture(drag.pointer);
        }
        destroy() {
            if (this.destroyed) return;
            this.stopAssistance(); this.speech.destroy(); this.events.abort(); this.destroyed = true;
            this.root.replaceChildren(); this.root.classList.remove('composition-widget'); mounted.delete(this.root);
        }
    }
    function markup(id) {
        const chest = (side, label) => `<section class="comp-basket" data-part="${side}" aria-labelledby="${id}-${side}">
          <h3 id="${id}-${side}"><span class="comp-basket-icon" aria-hidden="true">🧺</span>Canasta ${label}</h3>
          ${side === 'left' ? '<p class="comp-lock" data-role="left-lock"></p>' : ''}
          <div class="comp-coins" data-role="${side}-coins" role="group"></div><p class="comp-count" data-role="${side}-count"></p>
          <div class="comp-actions" data-role="${side}-actions"><button type="button" data-role="add-${side}">＋ Añadir a ${label}</button><button type="button" data-role="remove-${side}">− Devolver de ${label}</button></div></section>`;
        return `<section class="comp-intro"><span class="comp-guide" aria-hidden="true">🌳</span>
          <div><p class="comp-game-label">La Huerta de las Partes</p><h2 data-role="request" tabindex="-1"></h2><p data-role="target-label"></p><strong class="comp-target" data-role="target"></strong></div></section>
          <p class="comp-controls" data-role="controls" id="${id}-controls"></p>
          <p class="comp-sr-only" id="${id}-keyboard">También puedes usar los botones grandes y Tab con Enter o Espacio. Una manzana de una canasta se devuelve a la cosecha al pulsarla. Escape detiene la lectura, el ejemplo y el arrastre.</p>
          <section class="comp-bank" data-role="bank" data-part="reserve" aria-label="Cosecha de manzanas"><h3>Manzanas por repartir</h3><div class="comp-bank-coins" data-role="reserve-coins" role="group"></div>
          <div class="comp-actions" data-role="destination-controls" role="group" aria-label="Elegir canasta para las manzanas de la cosecha"><button type="button" data-role="send-left" aria-pressed="true">Enviar a A</button><button type="button" data-role="send-right" aria-pressed="false">Enviar a B</button></div></section>
          <div class="comp-baskets">${chest('left', 'A')}${chest('right', 'B')}</div>
          <p class="comp-equation" data-role="equation" aria-live="polite"></p>
          <div class="comp-answer" data-role="answer-row"><label for="${id}-answer">¿Cuántas manzanas hay en total?</label><input id="${id}-answer" data-role="answer" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" aria-describedby="${id}-controls"></div>
          <p class="comp-solutions" data-role="solutions"></p>
          <div class="comp-actions"><button type="button" data-role="count" aria-pressed="false">🧮 Contemos juntos</button><button type="button" data-role="hint">💡 Una pista</button><button type="button" data-role="read" aria-pressed="false">🔊 Escuchar encargo</button><button type="button" data-role="demo" aria-expanded="false" aria-controls="${id}-example">👆 Muéstrame cómo</button></div>
          <p data-role="audio" role="status"></p><section class="comp-example" id="${id}-example" data-role="example" hidden><h3>Un ejemplo con otra cosecha</h3><p>Dos manzanas y una manzana forman tres: 2 + 1 = 3.</p><div class="comp-example-coins" aria-hidden="true"><span class="comp-example-fruit" aria-hidden="true">🍎</span><span class="comp-example-fruit" aria-hidden="true">🍎</span><span>+</span><span class="comp-example-fruit" aria-hidden="true">🍎</span></div><p>Si ya hay dos, falta una para tener tres. Con cuatro puedes repartir 1 + 3 o 2 + 2. Cada canasta debe tener al menos una manzana. Este ejemplo no cambia tus canastas.</p></section>
          <p class="comp-feedback" data-role="feedback" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="comp-actions"><button type="button" data-role="deliver" class="comp-primary">Comprobar cosecha ➜</button><button type="button" data-role="another" class="comp-primary" hidden>Buscar otra forma ➜</button><button type="button" data-role="next" class="comp-primary" hidden>Siguiente encargo ➜</button><button type="button" data-role="reset">Volver a empezar</button><button type="button" data-role="new">Otro encargo</button></div>`;
    }
    api.mountCompositionActivity = (element, options) => new CompositionActivity(element, options);
})(globalThis);
