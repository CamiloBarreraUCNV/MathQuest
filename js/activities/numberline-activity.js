(function (root) {
    'use strict';
    const api = root.KalkuActivities;
    const mounted = api._mountedActivities || (api._mountedActivities = new WeakMap());
    let sequence = 0;
    class NumberlineActivity {
        constructor(element, options) {
            if (!element || element.nodeType !== 1 || !options) throw new TypeError('Falta contenedor o configuración.');
            for (const key of ['onComplete', 'createSession']) if (options[key] !== undefined && typeof options[key] !== 'function') throw new TypeError(`Configuración ${key} inválida.`);
            this.nextChallenge = api.createNumberlineChallengeFactory(options.definition, options.random);
            mounted.get(element)?.destroy();
            this.root = element; this.document = element.ownerDocument; this.window = this.document.defaultView; this.options = options;
            this.events = new this.window.AbortController(); this.id = `numberline-${++sequence}`;
            element.classList.add('numberline-widget'); element.innerHTML = markup(this.id);
            this.nodes = Object.fromEntries([...element.querySelectorAll('[data-role]')].map(node => [node.dataset.role, node]));
            this.speech = api.createActivitySpeech(this.window, state => {
                if (this.destroyed) return;
                const busy = ['loading', 'speaking'].includes(state);
                this.nodes.read.textContent = busy ? '⏹ Detener lectura' : '🔊 Escuchar ruta';
                this.nodes.read.setAttribute('aria-pressed', String(busy));
                this.nodes.audio.textContent = state === 'unavailable' ? 'La voz no está disponible. Puedes seguir con el texto y el ejemplo.' : '';
            });
            this.bind(); this.start(); mounted.set(element, this);
        }
        listen(node, event, fn) { node.addEventListener(event, fn, { signal: this.events.signal }); }
        getSnapshot() { return this.session.getSnapshot(); }
        message(text) { this.nodes.feedback.textContent = text; }
        instruction(s) { return `Empieza en ${s.start}. Da ${s.jumpCount} ${s.jumpCount === 1 ? 'salto' : 'saltos'} de ${s.stepSize} hacia ${s.direction === 1 ? 'adelante' : 'atrás'}. ¿Hasta qué número llegas?`; }
        start() {
            if (this.destroyed) return;
            this.stopAssistance();
            const session = this.options.createSession ? this.options.createSession() : new api.NumberlineSession(this.nextChallenge());
            if (!session) return;
            this.session = session; this.selectedStep = 1; this.followRoute(); this.render();
            this.message('Elige el tamaño de salto y usa las flechas. Puedes probar, deshacer y corregir sin prisa.');
        }
        followRoute() {
            const s = this.getSnapshot(), last = s.jumps.at(-1), lower = Math.min(last?.from ?? s.start, s.position);
            this.windowStart = Math.min(s.maxNumber - 20, Math.floor(lower / 10) * 10);
        }
        render() {
            const s = this.getSnapshot(), done = s.status === 'completed';
            this.nodes.request.textContent = this.instruction(s);
            this.nodes.start.textContent = String(s.start); this.nodes.goal.textContent = `${s.jumpCount} de ${s.stepSize}`;
            this.nodes.direction.textContent = s.direction === 1 ? 'Adelante →' : '← Atrás';
            this.nodes.position.textContent = String(s.position);
            this.nodes.counter.textContent = `Saltos dados: ${s.jumps.length} · Pedidos: ${s.jumpCount}`;
            for (const button of this.nodes.steps.querySelectorAll('[data-step]')) {
                button.setAttribute('aria-pressed', String(Number(button.dataset.step) === this.selectedStep)); button.disabled = done;
            }
            this.nodes.back.textContent = `← Retroceder ${this.selectedStep}`; this.nodes.forward.textContent = `Avanzar ${this.selectedStep} →`;
            this.nodes.back.disabled = done || s.position - this.selectedStep < 0 || s.jumps.length >= 12;
            this.nodes.forward.disabled = done || s.position + this.selectedStep > s.maxNumber || s.jumps.length >= 12;
            this.nodes.undo.disabled = done || !s.jumps.length; this.nodes.reset.disabled = done; this.nodes.deliver.disabled = done; this.nodes.hint.disabled = done;
            this.nodes.next.hidden = !done; this.nodes.new.hidden = this.options.allowSkip === false;
            this.nodes.viewport.textContent = `Vista ampliada: ${this.windowStart} a ${this.windowStart + 20}. Cada rayita vale 1. Los números crecen hacia la derecha.`;
            this.nodes.previous.disabled = this.windowStart === 0;
            this.nodes.following.disabled = this.windowStart + 20 >= s.maxNumber;
            this.nodes.navigation.hidden = s.maxNumber === 20;
            this.nodes.overviewSection.hidden = s.maxNumber === 20;
            this.drawLine(this.nodes.detail, this.windowStart, this.windowStart + 20, false);
            if (s.maxNumber === 100) this.drawLine(this.nodes.overview, 0, 100, true);
            this.nodes.history.replaceChildren();
            for (const [i, jump] of s.jumps.entries()) {
                const item = this.document.createElement('li');
                item.textContent = `${jump.from} → ${jump.to} (${jump.direction === 1 ? '+' : '−'}${jump.size})`;
                item.setAttribute('aria-label', `Salto ${i + 1}: de ${jump.from} a ${jump.to}, ${jump.direction === 1 ? 'avanza' : 'retrocede'} ${jump.size}`);
                this.nodes.history.append(item);
            }
            this.nodes.empty.hidden = s.jumps.length > 0;
            this.nodes.limit.hidden = s.jumps.length < 12;
        }
        drawLine(container, from, to, overview) {
            const s = this.getSnapshot(), width = Math.max(220, container.clientWidth || 300), height = overview ? 170 : 210;
            const svgNS = 'http://www.w3.org/2000/svg';
            const node = (tag, attributes, text) => {
                const element = this.document.createElementNS(svgNS, tag);
                for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
                if (text !== undefined) element.textContent = text;
                return element;
            };
            const axis = overview ? 115 : 150, x = value => 20 + (value - from) / (to - from) * (width - 40);
            const svg = node('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `${overview ? 'Vista general' : 'Recta ampliada'} de ${from} a ${to}. Rana en ${s.position}. Salida en ${s.start}. ${s.jumps.length} saltos dados.` });
            const defs = node('defs', {}), markerId = `${this.id}-${overview ? 'overview' : 'detail'}-arrow`;
            const marker = node('marker', { id: markerId, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto' });
            marker.append(node('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#a9461d' })); defs.append(marker); svg.append(defs);
            svg.append(node('line', { x1: 12, y1: axis, x2: width - 12, y2: axis, stroke: '#29493c', 'stroke-width': 3 }));
            const tickSize = overview ? 10 : 1, labelSize = overview ? width < 600 ? 20 : 10 : width < 600 ? 5 : width < 800 ? 2 : 1;
            for (let value = from; value <= to; value += tickSize) {
                svg.append(node('line', { x1: x(value), y1: axis - 6, x2: x(value), y2: axis + 8, stroke: '#29493c', 'stroke-width': value % 5 === 0 ? 2 : 1 }));
                if (value % labelSize === 0 || value === from || value === to) svg.append(node('text', { x: x(value), y: axis + 29, 'text-anchor': value === from ? 'start' : value === to ? 'end' : 'middle', fill: '#29493c', 'font-size': overview ? 12 : 15, 'font-weight': 700 }, value));
            }
            for (const [index, jump] of s.jumps.entries()) {
                if (jump.from < from || jump.from > to || jump.to < from || jump.to > to) continue;
                const mid = (x(jump.from) + x(jump.to)) / 2, arc = axis - 85 - index % 4 * 12;
                svg.append(node('path', { d: `M ${x(jump.from)} ${axis - 5} Q ${mid} ${arc} ${x(jump.to)} ${axis - 5}`, stroke: '#a9461d', 'stroke-width': overview ? 2 : 3, fill: 'none', 'marker-end': `url(#${markerId})` }));
            }
            if (s.start >= from && s.start <= to) svg.append(node('circle', { cx: x(s.start), cy: axis, r: 5, fill: '#29493c' }));
            if (s.position >= from && s.position <= to) {
                svg.append(node('line', { x1: x(s.position), y1: axis - 34, x2: x(s.position), y2: axis - 10, stroke: '#29493c', 'stroke-width': 2 }));
                svg.append(node('text', { x: x(s.position), y: axis - 38, 'text-anchor': 'middle', 'font-size': overview ? 23 : 30 }, '🐸'));
            }
            container.replaceChildren(svg);
        }
        jump(direction) {
            if (this.destroyed || !this.session.jump(direction, this.selectedStep)) return false;
            this.stopAssistance(); this.followRoute(); this.render();
            const s = this.getSnapshot(); this.message(`Salto ${s.jumps.length}: estás en ${s.position}. ${s.jumps.length === s.jumpCount ? 'Ya diste la cantidad pedida. Revisa la ruta y comprueba.' : 'Puedes seguir o deshacer para corregir.'}`);
            // A boundary may disable the pressed control; preserve a useful keyboard focus.
            const button = direction === 1 ? this.nodes.forward : this.nodes.back;
            if (button.disabled && this.document.activeElement === button) this.nodes.undo.focus({ preventScroll: true });
            return true;
        }
        submit() {
            if (this.destroyed || this.getSnapshot().status !== 'playing') return;
            this.stopAssistance(); const result = this.session.submit(); this.render();
            if (result.isNewCompletion) {
                this.message(`¡Ruta completa! Saliste de ${result.start} y llegaste a ${result.position} con ${result.jumpCount} saltos de ${result.stepSize}.`);
                this.nodes.next.focus({ preventScroll: true });
                this.root.dispatchEvent(new this.window.CustomEvent('kalku:activity-completed', { detail: JSON.parse(JSON.stringify(result)), bubbles: true }));
                this.options.onComplete?.(JSON.parse(JSON.stringify(result)));
            } else {
                const wrong = result.jumps.findIndex(jump => jump.size !== result.stepSize || jump.direction !== result.direction);
                this.message(wrong >= 0 ? `Revisa el salto ${wrong + 1}: necesitamos saltos de ${result.stepSize} hacia ${result.direction === 1 ? 'adelante' : 'atrás'}. Puedes deshacer sin perder el resto de la ruta.`
                    : `Llevas ${result.jumps.length} saltos y necesitamos ${result.jumpCount}. La salida no cuenta como salto. Puedes continuar o deshacer.`);
            }
            return result;
        }
        stopAssistance() { this.speech?.stop(); if (this.nodes) { this.nodes.example.hidden = true; this.nodes.demo.setAttribute('aria-expanded', 'false'); } }
        bind() {
            this.listen(this.nodes.steps, 'click', event => { const button = event.target.closest('[data-step]'); if (button && !button.disabled) { this.stopAssistance(); this.selectedStep = Number(button.dataset.step); this.render(); this.message(`Ahora cada salto será de ${this.selectedStep}. Tu ruta actual se conserva.`); } });
            this.listen(this.nodes.forward, 'click', () => this.jump(1)); this.listen(this.nodes.back, 'click', () => this.jump(-1));
            this.listen(this.nodes.undo, 'click', () => { if (this.session.undo()) { this.stopAssistance(); this.followRoute(); this.render(); this.message(`Deshiciste un salto. Estás en ${this.getSnapshot().position}.`); if (this.nodes.undo.disabled) (this.nodes.forward.disabled ? this.nodes.back : this.nodes.forward).focus({ preventScroll: true }); } });
            this.listen(this.nodes.reset, 'click', () => { if (this.session.reset()) { this.stopAssistance(); this.followRoute(); this.render(); this.message('Volviste al número de salida del mismo reto.'); } });
            this.listen(this.nodes.deliver, 'click', () => this.submit());
            for (const key of ['new', 'next']) this.listen(this.nodes[key], 'click', () => { this.start(); this.nodes.request.focus({ preventScroll: true }); });
            this.listen(this.nodes.hint, 'click', () => { this.stopAssistance(); this.session.useHint(); this.message(`Pista ${this.getSnapshot().assistance.hintLevel}. ${this.session.getHint()}`); });
            this.listen(this.nodes.previous, 'click', () => { this.windowStart = Math.max(0, this.windowStart - 10); this.render(); });
            this.listen(this.nodes.following, 'click', () => { this.windowStart = Math.min(this.getSnapshot().maxNumber - 20, this.windowStart + 10); this.render(); });
            this.listen(this.nodes.locate, 'click', () => { this.followRoute(); this.render(); });
            this.listen(this.nodes.demo, 'click', () => {
                const show = this.nodes.example.hidden; this.stopAssistance(); this.nodes.example.hidden = !show; this.nodes.demo.setAttribute('aria-expanded', String(show));
                if (show) this.session.useDemonstration();
            });
            this.listen(this.nodes.read, 'click', () => {
                if (['loading', 'speaking'].includes(this.speech.state)) this.speech.stop();
                else { const s = this.getSnapshot(); this.speech.speak(`${this.instruction(s)}. Estás en ${s.position}. Llevas ${s.jumps.length} saltos. Elige el tamaño y usa Avanzar o Retroceder. La salida no cuenta como salto.`); }
            });
            this.listen(this.root, 'keydown', event => { if (event.key === 'Escape') this.stopAssistance(); });
            this.listen(this.document, 'visibilitychange', () => { if (this.document.hidden) this.stopAssistance(); });
            this.listen(this.window, 'resize', () => { if (!this.destroyed) this.render(); });
        }
        destroy() {
            if (this.destroyed) return;
            this.stopAssistance(); this.speech.destroy(); this.events.abort(); this.destroyed = true;
            if (mounted.get(this.root) === this) mounted.delete(this.root);
            this.root.replaceChildren(); this.root.classList.remove('numberline-widget');
        }
    }
    function markup(id) {
        return `<div class="route-intro"><span aria-hidden="true">🐸</span><div><p class="route-eyebrow">Observa · salta · descubre</p><h2 data-role="request" tabindex="-1"></h2></div></div>
          <div class="route-mission"><div>Salida<strong data-role="start"></strong></div><div>Saltos pedidos<strong data-role="goal"></strong></div><div>Dirección<strong data-role="direction"></strong></div></div>
          <p id="${id}-controls">Elige cuánto mide cada salto y pulsa una flecha. Cada rayita de la vista ampliada vale 1. La salida no cuenta como salto.</p>
          <div class="route-position">Estás en <strong data-role="position"></strong><span data-role="counter"></span></div>
          <div class="route-steps" role="group" aria-label="Tamaño de cada salto" data-role="steps">${[1, 2, 5, 10].map(size => `<button type="button" data-step="${size}" aria-pressed="false" aria-describedby="${id}-controls">${size}<small>${size === 1 ? 'unidad' : 'unidades'}</small></button>`).join('')}</div>
          <div class="route-actions route-move"><button type="button" data-role="back">← Retroceder</button><button type="button" data-role="forward">Avanzar →</button><button type="button" data-role="undo">↶ Deshacer salto</button></div>
          <p data-role="limit" hidden>Ya hay 12 saltos. Deshaz algunos o vuelve al inicio para corregir.</p>
          <section class="route-map" aria-label="Recta numérica"><p data-role="viewport"></p><div class="route-line" data-role="detail"></div><div class="route-navigation" data-role="navigation"><button type="button" data-role="previous">← Ver tramo anterior</button><button type="button" data-role="locate">🐸 Ver mi posición</button><button type="button" data-role="following">Ver tramo siguiente →</button></div><div class="route-overview" data-role="overviewSection"><h3>Tu recorrido completo · 0 a 100</h3><p>Vista general: cada marca representa 10 unidades.</p><div class="route-line" data-role="overview"></div></div></section>
          <section class="route-history"><h3>Las huellas de tu ruta</h3><p data-role="empty">Todavía no has saltado. La rana está en la salida.</p><ol data-role="history" aria-label="Saltos de tu recorrido"></ol></section>
          <div class="route-actions"><button type="button" data-role="hint">💡 Una pista</button><button type="button" data-role="read" aria-pressed="false">🔊 Escuchar ruta</button><button type="button" data-role="demo" aria-expanded="false" aria-controls="${id}-example">👆 Muéstrame cómo</button></div>
          <p data-role="audio" role="status"></p><aside class="route-example" data-role="example" id="${id}-example" hidden><h3>Otro viaje para aprender</h3><p>Desde 3, dos saltos de 2 hacia adelante: <strong>3 → 5 → 7</strong>. Llegamos a 7. Contamos dos saltos, no tres números.</p><p>Para volver: <strong>7 → 5 → 3</strong>. Son dos saltos de 2 hacia atrás. Cada salto recorre dos unidades de la recta.</p><p>Este ejemplo no mueve tu rana ni completa tu reto.</p></aside>
          <p class="route-feedback" data-role="feedback" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="route-actions"><button type="button" class="route-primary" data-role="deliver">Comprobar ruta ➜</button><button type="button" class="route-primary" data-role="next" hidden>Siguiente ruta ➜</button><button type="button" data-role="reset">Volver a la salida</button><button type="button" data-role="new">Otra ruta</button></div>`;
    }
    api.mountNumberlineActivity = (element, options) => new NumberlineActivity(element, options);
})(globalThis);
