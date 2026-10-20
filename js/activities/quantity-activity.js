// Kalkú: reusable DOM controller. Requires quantity-model.js and activity-speech.js.
(function (root) {
    'use strict';
    const api = root.KalkuActivities;
    const mounted = api._mountedActivities || (api._mountedActivities = new WeakMap());
    let nextInstanceId = 0;

    class QuantityActivity {
        constructor(element, options) {
            if (!element || element.nodeType !== 1) throw new TypeError('Se necesita un contenedor HTML.');
            if (!options || typeof options.onComplete !== 'undefined' && typeof options.onComplete !== 'function' ||
                options && typeof options.createSession !== 'undefined' && typeof options.createSession !== 'function') {
                throw new TypeError('Configuración de montaje inválida.');
            }
            this.nextChallenge = api.createQuantityChallengeFactory(options.definition, options.random);
            mounted.get(element)?.destroy();
            this.root = element;
            this.document = element.ownerDocument;
            this.window = this.document.defaultView;
            this.events = new this.window.AbortController();
            this.onComplete = options.onComplete;
            this.createSession = options.createSession;
            this.allowSkip = options.allowSkip !== false;
            this.completed = 0;
            this.counting = false;
            this.drag = null;
            this.cancelledPointerId = null;
            this.suppressClickUntil = 0;
            this.destroyed = false;
            const id = `quantity-${++nextInstanceId}`;
            this.instanceId = id;
            element.classList.add('quantity-widget');
            element.innerHTML = createMarkup(id);
            this.nodes = Object.fromEntries([...element.querySelectorAll('[data-role]')].map(node => [node.dataset.role, node]));
            this.speech = api.createActivitySpeech(this.window, state => this.updateSpeech(state));
            this.bindEvents();
            this.start();
            mounted.set(element, this);
        }

        message(title, copy, kind = 'neutral') {
            this.nodes['feedback-title'].textContent = title;
            this.nodes['feedback-copy'].textContent = copy;
            this.nodes.feedback.dataset.state = kind;
        }

        getSnapshot() {
            return this.session.getSnapshot();
        }

        start() {
            if (this.destroyed) return;
            this.cancelDrag();
            this.stopDemonstration();
            this.speech.stop();
            this.suppressClickUntil = 0;
            const session = this.createSession ? this.createSession() : new api.QuantitySession(this.nextChallenge());
            if (!session) return;
            this.session = session;
            this.session.setCounting(this.counting);
            const definition = this.session.definition;
            this.tensEnabled = definition.rules.allowTens === true;
            this.extended = definition.rules.totalObjects > 10 || definition.rules.allowTens === true;
            this.root.classList.toggle('twenty-mode', this.extended);
            this.nodes.target.textContent = this.session.targetQuantity;
            this.nodes['target-unit'].textContent = this.noun(this.session.targetQuantity);
            this.nodes.request.textContent = definition.instruction
                .replaceAll('{target}', this.session.targetQuantity)
                .replaceAll('{objects}', this.noun(this.session.targetQuantity));
            this.nodes['reserve-title'].textContent = definition.presentation.reserveTitle;
            this.nodes['destination-title'].textContent = definition.presentation.destinationTitle;
            this.nodes['demo-object'].replaceChildren(this.objectImage());
            this.nodes['demo-tens'].hidden = !this.tensEnabled;
            this.nodes.instructions.textContent = 'Pulsa un objeto para moverlo al otro lado o arrástralo. También puedes usar los botones Añadir y Devolver, o Tab y Enter o Espacio. ' +
                (this.tensEnabled ? 'Cada marco tiene diez espacios. Agrupa diez objetos en una decena; usa sus botones para mover diez juntos o volver a separarlos. ' : '') +
                'Prepara la cantidad que pidió el capitán y pulsa Entregar tesoro. Escape detiene la lectura y oculta el ejemplo.';
            this.render();
            this.message('¡Vamos a preparar el tesoro!', 'Mueve los objetos y entrega el cofre cuando esté listo.');
            this.nodes.announcer.textContent = this.nodes.request.textContent;
        }

        noun(quantity) {
            return this.session.definition.objects[quantity === 1 ? 'singular' : 'plural'];
        }

        renderTokens(container, ids, location) {
            container.replaceChildren();
            if (this.extended) { this.renderFrames(container, ids, location); return; }
            this.renderCells(container, ids, location);
        }

        renderCells(container, ids, location, offset = 0, grouped = false) {
            const snapshot = this.getSnapshot();
            // Ten visible positions preserve the familiar ten-frame layout, even with a smaller bank.
            for (let index = 0; index < 10; index++) {
                const cell = this.document.createElement('div');
                cell.className = 'coin-cell';
                if (ids[index] !== undefined) {
                    if (grouped) {
                        cell.append(this.objectImage());
                    } else {
                        const button = this.document.createElement('button');
                        button.type = 'button';
                        button.className = 'coin';
                        button.dataset.coin = ids[index];
                        button.dataset.location = location;
                        button.disabled = snapshot.status === 'completed';
                        button.setAttribute('aria-label', `${location === 'reserve' ? 'Añadir al cofre' : 'Devolver a la reserva'}: ${this.noun(1)}, objeto ${offset + index + 1}`);
                        button.setAttribute('aria-describedby', `${this.instanceId}-instructions`);
                        button.append(this.objectImage());
                        cell.append(button);
                    }
                    if (snapshot.counting && location === 'chest') {
                        const number = this.document.createElement('span');
                        number.className = 'coin-number';
                        number.textContent = offset + index + 1;
                        number.setAttribute('aria-hidden', 'true');
                        cell.append(number);
                    }
                } else cell.setAttribute('aria-hidden', 'true');
                container.append(cell);
            }
        }

        renderFrames(container, ids, location) {
            const state = this.getSnapshot();
            const groups = state.groups.filter(group => group.location === location);
            const packed = new Set(groups.flatMap(group => group.tokenIds));
            const loose = ids.filter(id => !packed.has(id));
            const frames = groups.map(group => ({ ids: group.tokenIds, group }));
            while (frames.length < Math.ceil(state.totalObjects / 10)) frames.push({ ids: loose.splice(0, 10) });
            frames.forEach((entry, index) => {
                const frame = this.document.createElement('section');
                frame.className = `ten-frame${entry.group ? ' grouped-frame' : ''}`;
                frame.setAttribute('aria-label', `${location === 'reserve' ? 'Reserva' : 'Cofre'}, marco ${index + 1}: ${entry.group ? '1 decena, 10' : entry.ids.length} ${this.noun(entry.ids.length)}`);
                const label = this.document.createElement('h3');
                label.textContent = entry.group ? `1 decena = 10 ${this.noun(10)}` : `Marco ${index + 1} · 10 espacios`;
                const grid = this.document.createElement('div');
                grid.className = 'ten-frame-grid';
                this.renderCells(grid, entry.ids, location, index * 10, !!entry.group);
                const actions = this.document.createElement('div');
                actions.className = 'ten-frame-actions';
                const addAction = (action, text) => {
                    const button = this.document.createElement('button');
                    button.type = 'button';
                    button.className = 'button ten-button';
                    button.dataset.tenAction = action;
                    button.dataset.location = location;
                    if (entry.group) button.dataset.groupId = entry.group.id;
                    else button.dataset.tokens = entry.ids.join(',');
                    button.textContent = text;
                    button.setAttribute('aria-label', `${text} · ${location === 'reserve' ? 'reserva' : 'cofre'}, marco ${index + 1}`);
                    button.disabled = state.status === 'completed';
                    actions.append(button);
                };
                if (entry.group) {
                    addAction('move', location === 'reserve' ? 'Añadir decena (10)' : 'Devolver decena (10)');
                    addAction('ungroup', `Separar en 10 ${this.noun(10)}`);
                } else if (this.session.definition.rules.allowTens && entry.ids.length === 10) {
                    addAction('group', 'Agrupar 10 en una decena');
                } else {
                    const note = this.document.createElement('p');
                    note.className = 'frame-note';
                    note.textContent = '10 espacios: dos filas de cinco.';
                    actions.append(note);
                }
                frame.append(label, grid, actions);
                container.append(frame);
            });
        }

        manipulateTen(button) {
            if (this.destroyed) return;
            const { tenAction: action, location } = button.dataset;
            const destination = location === 'reserve' ? 'chest' : 'reserve';
            let groupId = button.dataset.groupId;
            let changed = false;
            if (action === 'group') {
                groupId = this.session.groupTen(location, button.dataset.tokens.split(',').map(Number));
                changed = !!groupId;
            } else if (action === 'ungroup') changed = this.session.ungroupTen(groupId);
            else if (action === 'move') changed = this.session.moveTen(groupId, destination);
            if (!changed) return;
            this.stopAssistance();
            this.render();
            const copy = action === 'group' ? `Juntaste 10 ${this.noun(10)}: ahora forman 1 decena. La cantidad no cambió.`
                : action === 'ungroup' ? `Separaste 1 decena en 10 ${this.noun(10)} sin agrupar. La cantidad no cambió.`
                    : `Moviste 1 decena: son 10 ${this.noun(10)} ${destination === 'chest' ? 'más en tu cofre' : 'de vuelta en la reserva'}.`;
            this.message('Una decena vale diez.', copy, 'hint');
            this.nodes.announcer.textContent = copy;
            const nextFocus = action === 'ungroup'
                ? this.nodes[location === 'reserve' ? 'reserve-coins' : 'chest-coins'].querySelector('button[data-coin]:not(:disabled)')
                : [...this.root.querySelectorAll('[data-ten-action="move"]')].find(node => node.dataset.groupId === groupId);
            nextFocus?.focus({ preventScroll: true });
        }

        objectImage() {
            const image = this.document.createElement('img');
            image.src = this.session.definition.objects.image;
            image.alt = '';
            image.draggable = false;
            return image;
        }

        render() {
            const state = this.getSnapshot();
            const solved = state.status === 'completed';
            this.renderTokens(this.nodes['reserve-coins'], state.reserveTokens, 'reserve');
            this.renderTokens(this.nodes['chest-coins'], state.placedTokens, 'chest');
            this.nodes.count.setAttribute('aria-pressed', String(state.counting));
            this.nodes.count.textContent = state.counting ? '🧮 Ocultar la cuenta' : '🧮 Contemos juntos';
            this.nodes['chest-caption'].textContent = state.counting || solved
                ? `En tu cofre: ${state.finalQuantity}` : 'Cuenta tus objetos';
            this.nodes.empty.disabled = solved || state.finalQuantity === 0;
            this.nodes.hint.disabled = solved;
            this.nodes.hint.textContent = state.assistance.hintLevel === 0 ? '💡 Una pista'
                : state.assistance.hintLevel < 3 ? '💡 Otra pista' : '💡 Repetir pista';
            this.nodes.demo.disabled = solved;
            this.nodes.add.disabled = solved || state.looseReserveTokens.length === 0;
            this.nodes.remove.disabled = solved || state.loosePlacedTokens.length === 0;
            this.nodes.add.textContent = `＋ Añadir ${this.noun(1)}`;
            this.nodes.remove.textContent = `− Devolver ${this.noun(1)}`;
            this.nodes.deliver.hidden = solved;
            this.nodes.next.hidden = !solved;
            this.nodes.new.hidden = solved || !this.allowSkip;
            this.nodes.completed.textContent = this.completed;
            this.nodes['chest-open'].hidden = solved;
            this.nodes['chest-closed'].hidden = !solved;
            this.nodes['reserve-coins'].setAttribute('aria-label', `Reserva: ${state.reserveTokens.length} ${this.noun(state.reserveTokens.length)}`);
            this.nodes['chest-coins'].setAttribute('aria-label', `Cofre: ${state.finalQuantity} ${this.noun(state.finalQuantity)}`);
            this.nodes['chest-coins'].classList.toggle('hint-focus', state.assistance.hintLevel >= 2 && !solved);
            this.nodes['place-value'].hidden = !this.extended;
            const tens = state.groups.filter(group => group.location === 'chest').length;
            const looseQuantity = state.loosePlacedTokens.length;
            this.nodes['place-value'].textContent = state.counting || solved || tens
                ? `${tens} decena${tens === 1 ? '' : 's'} agrupada${tens === 1 ? '' : 's'} y ${looseQuantity} ${this.noun(looseQuantity)} sin agrupar = ${state.finalQuantity} ${this.noun(state.finalQuantity)}`
                : '10 monedas forman 1 decena. Dos decenas forman 20.';
            this.nodes.support.textContent = solved ? '¡Tesoro listo para zarpar!' : this.tensEnabled
                ? 'Mueve monedas sueltas o agrupa 10. Puedes separar una decena cuando quieras.'
                : 'Pulsa o arrastra para añadir o devolver objetos';
        }

        move(tokenId, destination) {
            if (this.destroyed || !this.session.move(tokenId, destination)) return;
            this.stopDemonstration();
            this.cancelDrag();
            this.render();
            const state = this.getSnapshot();
            this.message('Puedes seguir preparando tu cofre.', state.counting
                ? `Ahora tienes ${state.finalQuantity} ${this.noun(state.finalQuantity)}. El capitán pidió ${state.targetQuantity}.`
                : 'Añade o devuelve objetos. Después pulsa «Entregar tesoro».');
            this.nodes.announcer.textContent = `Cofre: ${state.finalQuantity} ${this.noun(state.finalQuantity)}. Reserva: ${state.reserveTokens.length}.`;
        }

        help() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.stopDemonstration();
            this.cancelDrag();
            this.session.useHint();
            const hint = api.getQuantityHint(this.getSnapshot(), this.session.definition.objects);
            if (hint.showCounting) this.session.setCounting(true);
            this.render();
            this.message(hint.title, hint.text, 'hint');
            this.nodes.hint.textContent = this.getSnapshot().assistance.hintLevel < 3 ? '💡 Otra pista' : '💡 Repetir pista';
        }

        submit() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.stopDemonstration();
            this.speech.stop();
            const result = this.session.submit();
            if (!result.isCorrect) { this.help(); return; }
            this.completed++;
            this.cancelDrag();
            this.render();
            this.message('🎉 ¡Tesoro preparado!',
                `Entregaste exactamente ${result.finalQuantity} ${this.noun(result.finalQuantity)}. ¡Gracias, tripulante!`, 'success');
            this.nodes.next.focus({ preventScroll: true });
            // The model exposes one completion; no XP or localStorage is touched here.
            this.root.dispatchEvent(new this.window.CustomEvent('kalku:activity-completed', {
                detail: JSON.parse(JSON.stringify(result)), bubbles: true
            }));
            if (this.onComplete) this.onComplete(JSON.parse(JSON.stringify(result)));
        }

        listen(target, name, handler) {
            target.addEventListener(name, handler, { signal: this.events.signal });
        }

        bindEvents() {
            this.listen(this.nodes.deliver, 'click', () => this.submit());
            this.listen(this.nodes.hint, 'click', () => this.help());
            this.listen(this.nodes.add, 'click', () => {
                this.move(this.getSnapshot().looseReserveTokens[0], 'chest');
                if (this.nodes.add.disabled) this.nodes.deliver.focus({ preventScroll: true });
            });
            this.listen(this.nodes.remove, 'click', () => {
                this.move(this.getSnapshot().loosePlacedTokens.at(-1), 'reserve');
                if (this.nodes.remove.disabled) this.nodes.add.focus({ preventScroll: true });
            });
            this.listen(this.nodes.read, 'click', () => {
                this.stopDemonstration();
                if (['loading', 'speaking'].includes(this.speech.state)) this.speech.stop();
                else this.speech.speak(`${this.nodes.request.textContent} Toca un objeto de la reserva para añadirlo al cofre. Toca uno del cofre para devolverlo. ${this.tensEnabled ? 'Cada marco tiene diez espacios. Puedes agrupar diez monedas en una decena, moverla junta o separarla otra vez.' : ''} Cuando esté listo, pulsa Entregar tesoro.`);
            });
            this.listen(this.nodes.demo, 'click', () => {
                if (this.nodes['demo-panel'].hidden) this.showDemonstration();
                else this.stopDemonstration();
            });
            this.listen(this.nodes.count, 'click', () => {
                this.stopDemonstration();
                this.cancelDrag();
                this.counting = !this.getSnapshot().counting;
                this.session.setCounting(this.counting);
                this.render();
                if (this.counting && this.getSnapshot().status === 'playing') {
                    const quantity = this.getSnapshot().finalQuantity;
                    this.message('Contemos juntos.', `Sigue los números de los objetos del cofre: hay ${quantity} ${this.noun(quantity)}.`, 'hint');
                }
            });
            this.listen(this.nodes.empty, 'click', () => {
                if (!this.session.empty()) return;
                this.stopDemonstration();
                this.cancelDrag();
                this.render();
                this.message('El cofre está vacío.', 'Puedes empezar de nuevo con el mismo encargo.');
                this.nodes.announcer.textContent = 'El cofre está vacío. Puedes preparar otra vez la cantidad del encargo.';
                this.nodes.add.focus({ preventScroll: true });
            });
            for (const name of ['new', 'next']) this.listen(this.nodes[name], 'click', () => {
                this.start();
                this.nodes['reserve-coins'].querySelector('button')?.focus({ preventScroll: true });
            });
            this.listen(this.nodes.board, 'click', event => {
                if (event.detail !== 0 && this.window.performance.now() < this.suppressClickUntil) return;
                const tenButton = event.target.closest('button[data-ten-action]');
                if (tenButton && this.nodes.board.contains(tenButton)) { this.manipulateTen(tenButton); return; }
                const button = event.target.closest('button[data-coin]');
                if (!button || !this.nodes.board.contains(button)) return;
                const location = button.dataset.location;
                this.move(Number(button.dataset.coin), location === 'reserve' ? 'chest' : 'reserve');
                if (event.detail === 0) {
                    const source = this.nodes[location === 'reserve' ? 'reserve-coins' : 'chest-coins'];
                    (source.querySelector('button') || this.nodes.board.querySelector('button[data-coin]'))?.focus({ preventScroll: true });
                }
            });
            this.listen(this.nodes.board, 'pointerdown', event => {
                const button = event.target.closest('button[data-coin]');
                if (!button || !event.isPrimary || event.button !== 0 || this.getSnapshot().status !== 'playing') return;
                this.cancelDrag();
                this.cancelledPointerId = null;
                this.drag = { button, id: Number(button.dataset.coin), source: button.dataset.location,
                    pointerId: event.pointerId, x: event.clientX, y: event.clientY, ghost: null };
            });
            this.listen(this.nodes.board, 'pointermove', event => this.dragMove(event));
            // Listening on the window also cleans up a short press released outside the board.
            this.listen(this.window, 'pointerup', event => this.dragEnd(event));
            this.listen(this.window, 'pointercancel', () => this.cancelDrag());
            this.listen(this.window, 'blur', () => this.stopAssistance());
            this.listen(this.document, 'visibilitychange', () => { if (this.document.hidden) this.stopAssistance(); });
            this.listen(this.root, 'keydown', event => {
                if (event.key === 'Escape') {
                    if (this.drag) this.suppressClickUntil = this.window.performance.now() + 450;
                    this.stopAssistance();
                }
            });
        }

        updateSpeech(state) {
            if (this.destroyed) return;
            const busy = state === 'loading' || state === 'speaking';
            this.nodes.read.textContent = busy ? '⏹ Detener lectura' : '🔊 Escuchar encargo';
            this.nodes.read.setAttribute('aria-pressed', String(busy));
            this.nodes['audio-status'].textContent = state === 'unavailable'
                ? 'No se pudo leer el encargo. Puedes seguir con la instrucción escrita o con «Muéstrame cómo».'
                : state === 'loading' ? 'Preparando una voz en español…'
                    : state === 'speaking' ? 'Leyendo el encargo. Puedes detener la lectura.' : '';
        }

        showDemonstration() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.cancelDrag();
            this.speech.stop();
            this.session.useDemonstration();
            this.nodes['demo-panel'].hidden = false;
            this.nodes.demo.setAttribute('aria-expanded', 'true');
            this.nodes.demo.textContent = '👆 Ocultar ejemplo';
            this.nodes['demo-stage'].classList.remove('is-playing');
            void this.nodes['demo-stage'].offsetWidth;
            this.nodes['demo-stage'].classList.add('is-playing');
            this.nodes.announcer.textContent = 'Ejemplo: toca un objeto para moverlo al cofre. Tócalo otra vez para devolverlo. Este ejemplo no cambia tu cofre.';
        }

        stopDemonstration() {
            if (!this.nodes) return;
            this.nodes['demo-panel'].hidden = true;
            this.nodes['demo-stage'].classList.remove('is-playing');
            this.nodes.demo.setAttribute('aria-expanded', 'false');
            this.nodes.demo.textContent = '👆 Muéstrame cómo';
        }

        stopAssistance() {
            this.cancelDrag();
            this.stopDemonstration();
            this.speech.stop();
        }

        dragMove(event) {
            if (!this.drag || event.pointerId !== this.drag.pointerId) return;
            if (!this.drag.ghost && Math.hypot(event.clientX - this.drag.x, event.clientY - this.drag.y) < 8) return;
            if (!this.drag.ghost) {
                this.drag.ghost = this.document.createElement('div');
                this.drag.ghost.className = 'drag-ghost';
                this.drag.ghost.setAttribute('aria-hidden', 'true');
                this.drag.ghost.append(this.objectImage());
                this.root.append(this.drag.ghost);
                this.drag.button.classList.add('dragging');
                this.nodes.board.setPointerCapture(event.pointerId);
            }
            event.preventDefault();
            this.drag.ghost.style.left = `${event.clientX}px`;
            this.drag.ghost.style.top = `${event.clientY}px`;
            const over = this.document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-zone]');
            this.root.querySelectorAll('[data-zone]').forEach(zone => zone.classList.toggle('over',
                zone === over && zone.dataset.zone !== this.drag.source));
        }

        dragEnd(event) {
            if (!this.drag && this.cancelledPointerId === event.pointerId) {
                this.suppressClickUntil = this.window.performance.now() + 450;
                this.cancelledPointerId = null;
                return;
            }
            if (!this.drag || event.pointerId !== this.drag.pointerId) return;
            const current = this.drag;
            const zone = current.ghost && this.document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-zone]');
            const destination = zone && this.root.contains(zone) && zone.dataset.zone;
            if (current.ghost) this.suppressClickUntil = this.window.performance.now() + 450;
            this.cancelDrag(false);
            if (destination && destination !== current.source) this.move(current.id, destination);
        }

        cancelDrag(suppressClick = true) {
            if (!this.drag) return;
            const current = this.drag;
            this.drag = null;
            if (suppressClick) this.cancelledPointerId = current.pointerId;
            current.ghost?.remove();
            current.button.classList.remove('dragging');
            if (this.nodes.board.hasPointerCapture(current.pointerId)) this.nodes.board.releasePointerCapture(current.pointerId);
            this.root.querySelectorAll('.zone.over').forEach(zone => zone.classList.remove('over'));
        }

        destroy() {
            if (this.destroyed) return;
            this.stopAssistance();
            this.speech.destroy();
            this.events.abort();
            this.destroyed = true;
            this.root.replaceChildren();
            this.root.classList.remove('quantity-widget', 'twenty-mode');
            mounted.delete(this.root);
        }
    }

    function createMarkup(id) {
        return `
        <section class="scene" aria-label="El encargo del Capitán Manzana">
          <div class="guide sprite"><img src="assets/treasure-activity/apple-guide.png" alt="El Capitán Manzana te invita a preparar el tesoro" draggable="false"></div>
          <div class="speech"><p data-role="request"></p></div>
          <div class="mission"><div class="sprite scroll-art" aria-hidden="true"><img src="assets/treasure-activity/mission-scroll.png" alt="" draggable="false"></div><div class="mission-copy"><h1>Tu misión</h1><span class="target-number" data-role="target"></span><p data-role="target-unit"></p></div></div>
          <div class="pouch sprite" aria-hidden="true"><img src="assets/treasure-activity/reserve-pouch.png" alt="" draggable="false"></div>
          <div class="chest-prop" aria-hidden="true"><div class="sprite chest-open" data-role="chest-open"><img src="assets/treasure-activity/chest-open.png" alt="" draggable="false"></div><div class="sprite chest-closed" data-role="chest-closed" hidden><img src="assets/treasure-activity/chest-closed.png" alt="" draggable="false"></div></div>
        </section>
        <section class="activity" aria-label="Prepara el tesoro: actividad de cantidades">
          <div class="board" data-role="board">
            <p class="sr-only" data-role="instructions" id="${id}-instructions"></p>
            <div class="zones" aria-describedby="${id}-instructions">
              <section class="zone" data-zone="reserve" aria-labelledby="${id}-reserve-title">
                <div class="sprite tray-art" aria-hidden="true"><img src="assets/treasure-activity/counting-tray.png" alt="" draggable="false"></div>
                <h2 class="zone-heading" id="${id}-reserve-title"><span class="sprite label-art" aria-hidden="true"><img src="assets/treasure-activity/label-navy.png" alt="" draggable="false"></span><span data-role="reserve-title"></span></h2>
                <div class="coins" data-role="reserve-coins" role="group" aria-label="Objetos de la reserva"></div>
              </section>
              <div class="transfer-arrow" aria-hidden="true">➜</div>
              <div class="destination"><section class="zone" data-zone="chest" aria-labelledby="${id}-destination-title">
                <div class="sprite tray-art" aria-hidden="true"><img src="assets/treasure-activity/counting-tray.png" alt="" draggable="false"></div>
                <h2 class="zone-heading" id="${id}-destination-title"><span class="sprite label-art" aria-hidden="true"><img src="assets/treasure-activity/label-navy.png" alt="" draggable="false"></span><span data-role="destination-title"></span></h2>
                <div class="coins" data-role="chest-coins" role="group" aria-label="Objetos colocados en el cofre"></div>
              </section><div class="chest-caption" data-role="chest-caption"></div><p class="place-value" data-role="place-value" hidden></p></div>
            </div>
            <div class="quantity-actions" role="group" aria-label="Mover objetos con botones grandes"><button class="button move-button" data-role="add" type="button"></button><button class="button move-button" data-role="remove" type="button"></button></div>
          </div>
          <p class="support" data-role="support"></p>
          <div class="learning-tools"><button class="button assistance-button" data-role="read" type="button" aria-pressed="false" aria-describedby="${id}-audio-status">🔊 Escuchar encargo</button><button class="button assistance-button" data-role="demo" type="button" aria-expanded="false" aria-controls="${id}-demo-panel">👆 Muéstrame cómo</button></div>
          <p class="audio-status" data-role="audio-status" id="${id}-audio-status" role="status" aria-live="polite"></p>
          <section class="demo-panel" data-role="demo-panel" id="${id}-demo-panel" aria-label="Ejemplo de movimiento sin cambiar tu cofre" hidden>
            <h2>Un ejemplo, sin cambiar tu cofre</h2>
            <div class="demo-stage" data-role="demo-stage" aria-hidden="true"><span class="demo-label demo-from">Reserva</span><span class="demo-label demo-to">Cofre</span><div class="demo-slot demo-left"></div><div class="demo-slot demo-right"></div><div class="demo-mover"><span class="demo-object" data-role="demo-object"></span><span class="demo-hand">👆</span></div></div>
            <ol><li>Toca un objeto de la reserva: va al cofre.</li><li>Tócalo en el cofre: vuelve a la reserva.</li><li data-role="demo-tens" hidden>Un marco lleno tiene 10 monedas. Pulsa «Agrupar 10 en una decena»: puedes mover esas diez juntas o separarlas de nuevo.</li><li>Prepara la cantidad del encargo y pulsa «Entregar tesoro».</li></ol>
          </section>
          <div class="tools"><button class="button count-button" data-role="count" type="button" aria-pressed="false">🧮 Contemos juntos</button><button class="button hint-button" data-role="hint" type="button">💡 Una pista</button><button class="button primary" data-role="deliver" type="button">Entregar tesoro ➜</button><button class="button primary" data-role="next" type="button" hidden>Siguiente encargo ➜</button></div>
          <div class="feedback" data-role="feedback" role="status" aria-live="polite" aria-atomic="true"><p class="feedback-title" data-role="feedback-title"></p><p class="feedback-copy" data-role="feedback-copy"></p></div>
          <p class="sr-only" data-role="announcer" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="utility-bar"><button class="quiet" data-role="empty" type="button">↶ Vaciar cofre</button><button class="quiet" data-role="new" type="button">↻ Otro encargo</button><span class="completed">Entregas de esta sesión: <strong data-role="completed">0</strong></span></div>
        </section>`;
    }

    api.mountQuantityActivity = (element, options) => new QuantityActivity(element, options);
})(globalThis);
