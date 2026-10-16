// MathQuest: UI Renderer, Screen Management, Animations & Confetti
var soundManager = (typeof window !== 'undefined' && window.soundManager) ? window.soundManager : (typeof soundManager !== 'undefined' ? soundManager : null);
var gameEngine = (typeof window !== 'undefined' && window.gameEngine) ? window.gameEngine : (typeof gameEngine !== 'undefined' ? gameEngine : null);
var WORLDS_DATA = (typeof window !== 'undefined' && window.WORLDS_DATA) ? window.WORLDS_DATA : (typeof WORLDS_DATA !== 'undefined' ? WORLDS_DATA : []);
var LEVELS_DATA = (typeof window !== 'undefined' && window.LEVELS_DATA) ? window.LEVELS_DATA : (typeof LEVELS_DATA !== 'undefined' ? LEVELS_DATA : []);
var getLevelsByWorld = (typeof window !== 'undefined' && window.getLevelsByWorld) ? window.getLevelsByWorld : (typeof getLevelsByWorld !== 'undefined' ? getLevelsByWorld : (id) => ((typeof window !== 'undefined' ? window.LEVELS_DATA : LEVELS_DATA) || []).filter(l => l.worldId === id));
var getLevelById = (typeof window !== 'undefined' && window.getLevelById) ? window.getLevelById : (typeof getLevelById !== 'undefined' ? getLevelById : (id) => ((typeof window !== 'undefined' ? window.LEVELS_DATA : LEVELS_DATA) || []).find(l => l.id === Number(id)));
var getWorldById = (typeof window !== 'undefined' && window.getWorldById) ? window.getWorldById : (typeof getWorldById !== 'undefined' ? getWorldById : (id) => ((typeof window !== 'undefined' ? window.WORLDS_DATA : WORLDS_DATA) || []).find(w => w.id === id));

class MathQuestUI {
    constructor() {
        this.currentView = 'map'; // 'map', 'lesson', 'quiz', 'victory', 'gameover'
        this.selectedLevelId = null;
        this.selectedWorldId = null;
        this.bossAnimFrame = null;
        this.lastBossTickTime = 0;
        this.gameOverTimer = null;
        this.answerShuffleElapsed = 0;
        this.answerInteractionPending = false;
    }

    init() {
        soundManager = window.soundManager || soundManager;
        gameEngine = window.gameEngine || gameEngine;
        WORLDS_DATA = window.WORLDS_DATA || WORLDS_DATA;
        LEVELS_DATA = window.LEVELS_DATA || LEVELS_DATA;
        getLevelsByWorld = window.getLevelsByWorld || getLevelsByWorld;
        getLevelById = window.getLevelById || getLevelById;
        getWorldById = window.getWorldById || getWorldById;

        this.bindEvents();
        this.updateHeaderStats();
        this.renderMap();
        this.typesetMath();
    }

    typesetMath(element = document.body) {
        if (window.renderMathInElement) {
            window.renderMathInElement(element, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }
    }

    bindEvents() {
        const releaseAnswer = () => { this.answerInteractionPending = false; };
        window.addEventListener('pointerup', releaseAnswer);
        window.addEventListener('pointercancel', releaseAnswer);
        window.addEventListener('keyup', releaseAnswer);
        window.addEventListener('blur', releaseAnswer);
        document.addEventListener('visibilitychange', () => { this.answerShuffleElapsed = 0; });
        document.getElementById('worlds-home-btn').addEventListener('click', () => {
            soundManager.click();
            if (this.currentView === 'quiz' && !confirm('¿Volver a Mis mundos? Se guardan tus estrellas y XP; este intento terminará.')) return;
            this.showWorldSelector();
        });
        // Sound toggle
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const isEnabled = soundManager.toggle();
                soundBtn.textContent = isEnabled ? '🔊' : '🔇';
                soundBtn.title = isEnabled ? 'Sonido Activado' : 'Sonido Desactivado';
            });
            soundBtn.textContent = soundManager.enabled ? '🔊' : '🔇';
        }

        // Stats / Achievements Modal
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                soundManager.click();
                this.showAchievementsModal();
            });
        }

        const closeAchievementsBtn = document.getElementById('close-achievements-btn');
        if (closeAchievementsBtn) {
            closeAchievementsBtn.addEventListener('click', () => {
                soundManager.click();
                document.getElementById('achievements-modal').classList.add('hidden');
            });
        }

        // Hearts refill
        const heartsDisplay = document.getElementById('hearts-display');
        if (heartsDisplay) {
            heartsDisplay.addEventListener('click', () => {
                if (gameEngine.state.hearts < gameEngine.state.maxHearts) {
                    gameEngine.refillHearts();
                    this.updateHeaderStats();
                    soundManager.star();
                    this.showToast("❤️ ¡Vidas recargadas al máximo!");
                }
            });
        }

        // Lesson modal actions
        const startChallengeBtn = document.getElementById('start-challenge-btn');
        if (startChallengeBtn) {
            startChallengeBtn.addEventListener('click', () => {
                soundManager.click();
                this.closeLessonModal();
                this.startQuiz(this.selectedLevelId);
            });
        }

        const closeLessonBtn = document.getElementById('close-lesson-btn');
        if (closeLessonBtn) {
            closeLessonBtn.addEventListener('click', () => {
                soundManager.click();
                this.closeLessonModal();
            });
        }

        // Quiz actions
        const continueBtn = document.getElementById('feedback-continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                soundManager.click();
                this.handleNextQuestion();
            });
        }

        const quitQuizBtn = document.getElementById('quit-quiz-btn');
        if (quitQuizBtn) {
            quitQuizBtn.addEventListener('click', () => {
                soundManager.click();
                if (confirm("¿Seguro que deseas salir del nivel actual? Se perderá el progreso de esta lección.")) {
                    this.showScreen('map');
                    this.renderMap();
                }
            });
        }

        // Victory screen actions
        const nextLevelBtn = document.getElementById('victory-next-btn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                soundManager.click();
                const nextId = gameEngine.getNextLevelId(this.selectedLevelId);
                this.showScreen('map');
                this.renderMap();
                if (nextId !== null && gameEngine.isLevelUnlocked(nextId)) {
                    this.openLevelPreview(nextId);
                }
            });
        }

        const retryLevelBtn = document.getElementById('victory-retry-btn');
        if (retryLevelBtn) {
            retryLevelBtn.addEventListener('click', () => {
                soundManager.click();
                this.startQuiz(this.selectedLevelId);
            });
        }

        const victoryMapBtn = document.getElementById('victory-map-btn');
        if (victoryMapBtn) {
            victoryMapBtn.addEventListener('click', () => {
                soundManager.click();
                if (gameEngine.getWorldProgress(this.selectedWorldId).completed) {
                    this.showWorldSelector();
                    return;
                }
                this.showScreen('map');
                this.renderMap();
            });
        }

        // Game Over screen actions
        const refillAndRetryBtn = document.getElementById('gameover-retry-btn');
        if (refillAndRetryBtn) {
            refillAndRetryBtn.addEventListener('click', () => {
                soundManager.click();
                gameEngine.refillHearts();
                this.updateHeaderStats();
                this.startQuiz(this.selectedLevelId);
            });
        }

        const gameoverMapBtn = document.getElementById('gameover-map-btn');
        if (gameoverMapBtn) {
            gameoverMapBtn.addEventListener('click', () => {
                soundManager.click();
                gameEngine.refillHearts();
                this.updateHeaderStats();
                this.showScreen('map');
                this.renderMap();
            });
        }

        // Reset progress in profile modal
        const resetProgressBtn = document.getElementById('reset-progress-btn');
        if (resetProgressBtn) {
            resetProgressBtn.addEventListener('click', () => {
                if (confirm("⚠️ ¿Estás seguro de que deseas reiniciar TODO tu progreso? Cada mundo volverá a su primer nivel.")) {
                    gameEngine.resetProgress();
                    this.selectedLevelId = null;
                    this.selectedWorldId = null;
                    this.closeLessonModal();
                    this.showScreen('map');
                    this.updateHeaderStats();
                    this.renderMap();
                    document.getElementById('achievements-modal').classList.add('hidden');
                    this.showToast("🔄 Progreso reiniciado con éxito");
                }
            });
        }

        // Shortcuts follow the number of visible options (up to eight).
        window.addEventListener('keydown', (e) => {
            if (this.currentView !== 'quiz') return;
            if (document.querySelector('.modal-overlay:not(.hidden)')) return;

            const feedbackDrawer = document.getElementById('quiz-feedback-drawer');
            const isDrawerOpen = feedbackDrawer && !feedbackDrawer.classList.contains('hidden');

            if (isDrawerOpen) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleNextQuestion();
                }
                return;
            }

            if (/^[1-8]$/.test(e.key)) {
                const idx = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option-card');
                if (options[idx]) {
                    options[idx].click();
                }
            }
        });
    }

    updateHeaderStats() {
        const heartsEl = document.getElementById('header-hearts');
        if (heartsEl) {
            let heartsStr = '';
            for (let i = 0; i < gameEngine.state.maxHearts; i++) {
                heartsStr += i < gameEngine.state.hearts ? '❤️' : '🖤';
            }
            heartsEl.innerHTML = heartsStr;
        }

        const streakEl = document.getElementById('header-streak');
        if (streakEl) {
            streakEl.textContent = gameEngine.currentStreak;
            const streakContainer = document.getElementById('streak-display');
            if (streakContainer) {
                if (gameEngine.currentStreak > 0) {
                    streakContainer.classList.add('active');
                } else {
                    streakContainer.classList.remove('active');
                }
            }
        }

        const xpEl = document.getElementById('header-xp');
        if (xpEl) {
            xpEl.textContent = `${gameEngine.state.xp} XP`;
        }

        const rank = gameEngine.getPlayerRank();
        const rankEl = document.getElementById('header-rank-badge');
        if (rankEl) {
            rankEl.textContent = rank.badge;
            rankEl.title = rank.title;
        }
    }

    showScreen(screenName) {
        clearTimeout(this.gameOverTimer);
        this.gameOverTimer = null;
        if (screenName !== 'quiz') {
            this.stopBossLoop();
            gameEngine.cancelSession();
        }
        this.currentView = screenName;
        const screens = ['map-screen', 'quiz-screen', 'victory-screen', 'gameover-screen'];
        screens.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === `${screenName}-screen`) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderMap() {
        const container = document.getElementById('worlds-container');
        if (!container) return;
        const world = getWorldById(this.selectedWorldId);
        document.getElementById('map-screen').classList.toggle('world-route-view', !!world);
        if (!world) {
            this.renderWorldSelector(container);
            return;
        }
        const progress = gameEngine.getWorldProgress(world.id);
        const levels = gameEngine.getWorldLevels(world.id);
        container.innerHTML = `
            <div class="world-route-toolbar"><button class="world-back-btn" id="back-to-worlds">‹ Todos los mundos</button>
                <span>Tu avance en este mundo se guarda por separado</span></div>
            <section class="world-section" id="${world.id}">
                <div class="world-header" style="background: ${world.bgGradient}">
                    <div><span class="world-badge">${world.icon} MUNDO ${world.num}</span><h1 class="world-title">${world.title}</h1><p class="world-subtitle">${world.subtitle}</p></div>
                    <div class="world-progress-badge"><span>${progress.completedCount}/${progress.total}</span><small>Niveles</small><small>⭐ ${progress.stars}/${progress.maxStars}</small></div>
                </div>
                <div class="levels-path">${levels.map((level, index) => {
                    const unlocked = gameEngine.isLevelUnlocked(level.id);
                    const stars = gameEngine.getLevelStars(level.id);
                    const current = level.id === progress.nextLevelId;
                    return `<div class="level-node-wrapper ${index % 2 ? 'offset-right' : 'offset-left'}">
                        <button class="level-node ${level.isBoss ? 'boss-node' : ''} ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''} ${stars === 3 ? 'perfect' : ''}"
                            data-level-id="${level.id}" ${unlocked ? '' : 'disabled'} title="Nivel ${index + 1}: ${level.title}">
                            <span class="node-icon">${unlocked ? level.icon : '🔒'}</span>${current ? '<span class="current-indicator">¡Aquí!</span>' : ''}
                        </button><div class="node-info"><span class="node-level-num">${level.isBoss ? '👑 JEFE · ' : ''}Nivel ${index + 1}</span>
                        <span class="node-title">${level.title}</span><span class="node-stars">${unlocked ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : ''}</span></div></div>`;
                }).join('')}</div>
            </section>`;
        document.getElementById('back-to-worlds').addEventListener('click', () => this.showWorldSelector());
        container.querySelectorAll('.level-node.unlocked').forEach(button => button.addEventListener('click', () => {
            soundManager.levelSelect();
            this.openLevelPreview(Number(button.dataset.levelId));
        }));
    }

    showWorldSelector() {
        this.selectedWorldId = null;
        this.closeLessonModal();
        document.getElementById('achievements-modal').classList.add('hidden');
        this.showScreen('map');
        this.renderMap();
    }

    enterWorld(worldId) {
        if (!getWorldById(worldId)) return;
        this.selectedWorldId = worldId;
        this.showScreen('map');
        this.renderMap();
    }

    renderWorldSelector(container) {
        const card = world => {
            const progress = gameEngine.getWorldProgress(world.id);
            const localNext = gameEngine.getLocalLevelNumber(progress.nextLevelId);
            const featured = world.num <= 2;
            const button = progress.completed ? 'Volver a jugar' : progress.completedCount ? (world.num === 1 ? 'Continuar isla' : world.num === 2 ? 'Continuar circo' : 'Continuar') : (world.num === 1 ? 'Comenzar isla' : world.num === 2 ? 'Comenzar circo' : 'Jugar');
            return `<article class="world-card ${featured ? 'world-card-featured' : 'world-card-compact'} ${world.battleBg ? 'world-card-custom-art' : ''} world-card-${world.num}" data-world-card="${world.id}">
                <div class="world-card-scene" style="background-image: ${world.battleBg ? 'url(' + world.battleBg + ')' : ''}">
                    <div class="world-card-copy">${featured ? '<span class="world-card-badge">MUNDO ' + world.num + '</span>' : ''}
                    <h2>${world.title}</h2>${featured ? '<p>' + world.cardTopics + '</p>' : ''}</div>
                    ${world.cardCharacter ? '<img class="world-card-character" src="' + world.cardCharacter + '" alt="" loading="eager">' : ''}
                </div>
                <div class="world-card-summary">
                    <div class="world-card-progress"><strong>${progress.completedCount} de ${progress.total} niveles</strong>
                        <progress value="${progress.completedCount}" max="${progress.total}" aria-label="Niveles completados en ${world.title}"></progress></div>
                    <div class="world-card-stars"><span>⭐ ${progress.stars} / ${progress.maxStars}</span>
                        ${featured ? '<small>' + (progress.completed ? '¡Mundo completado!' : progress.completedCount ? 'Próximo: nivel ' + localNext : 'Empieza en el nivel 1') + '</small>' : ''}</div>
                    <button class="world-enter-btn" data-world-id="${world.id}" aria-label="${button}: ${world.title}">${button} <span aria-hidden="true">›</span></button>
                </div>
            </article>`;
        };
        container.innerHTML = `<div class="world-selector-heading"><h1>Elige tu aventura</h1><p>Cada mundo guarda su propio progreso. ¡Juega el que quieras!</p></div>
            <div class="world-featured-grid">${WORLDS_DATA.filter(world => world.num <= 2).map(card).join('')}</div>
            <h2 class="more-worlds-heading">Más aventuras</h2>
            <div class="world-compact-grid">${WORLDS_DATA.filter(world => world.num > 2).map(card).join('')}</div>
            <p class="world-selector-help">📖 Puedes cambiar de mundo y retomar donde quedaste.</p>`;
        container.querySelectorAll('.world-enter-btn').forEach(button => button.addEventListener('click', () => {
            soundManager.levelSelect();
            this.enterWorld(button.dataset.worldId);
        }));
    }

    openLevelPreview(levelId) {
        const level = getLevelById(levelId);
        if (!level || !gameEngine.isLevelUnlocked(levelId)) return;
        this.selectedLevelId = levelId;
        this.selectedWorldId = level.worldId;

        const modal = document.getElementById('lesson-modal');
        if (!modal) return;

        document.getElementById('lesson-level-tag').textContent = level.isBoss ? `⚔️ BATALLA DE JEFE • ${level.icon}` : `Nivel ${gameEngine.getLocalLevelNumber(level.id)} • ${level.icon}`;
        document.getElementById('lesson-title').textContent = level.title;
        document.getElementById('lesson-subtitle').textContent = level.subtitle;
        document.getElementById('lesson-theory-title').textContent = level.theory.title;

        const contentEl = document.getElementById('lesson-theory-content');
        contentEl.innerHTML = level.theory.content;

        const startBtn = document.getElementById('start-challenge-btn');
        if (startBtn) {
            startBtn.textContent = level.isBoss ? '⚔️ ¡Iniciar Batalla de Jefe!' : (level.hasEnemy ? (level.enemy ? `🏴‍☠️ ¡Desafiar a ${level.enemy.name}!` : '🏴‍☠️ ¡Desafiar al Pirata!') : '¡Comenzar Desafío!');
        }

        modal.classList.remove('hidden');
        this.typesetMath(modal);
    }

    closeLessonModal() {
        const modal = document.getElementById('lesson-modal');
        if (modal) modal.classList.add('hidden');
    }

    startQuiz(levelId) {
        clearTimeout(this.gameOverTimer);
        this.gameOverTimer = null;
        if (gameEngine.state.hearts <= 0) {
            this.showScreen('gameover');
            return;
        }
        this.selectedLevelId = levelId;
        this.selectedWorldId = getLevelById(levelId)?.worldId ?? null;
        const firstQuestion = gameEngine.startLevel(levelId);
        if (!firstQuestion) return;

        this.showScreen('quiz');
        this.updateHeaderStats();
        this.renderCurrentQuestion();

        if (gameEngine.activeBoss) {
            this.startBossLoop();
        }
    }

    renderCurrentQuestion() {
        this.answerShuffleElapsed = 0;
        this.answerInteractionPending = false;
        const question = gameEngine.getCurrentQuestion();
        const level = gameEngine.currentLevel;
        if (!question || !level) return;

        // Reset feedback drawer
        const feedbackDrawer = document.getElementById('quiz-feedback-drawer');
        if (feedbackDrawer) feedbackDrawer.classList.add('hidden');

        // Update progress bar
        const total = level.questions.length;
        const current = gameEngine.currentQuestionIdx + 1;

        // Subbar Level Pill
        const subbarIcon = document.getElementById('subbar-level-icon');
        if (subbarIcon) subbarIcon.textContent = level.icon || '📊';
        const levelTagEl = document.getElementById('quiz-level-tag');
        if (levelTagEl) levelTagEl.textContent = `Nivel ${gameEngine.getLocalLevelNumber(level.id)}: ${level.title}`;

        // Subbar Stepper Dots
        const stepperEl = document.getElementById('subbar-stepper');
        if (stepperEl) {
            stepperEl.innerHTML = '';
            const dotCount = Math.min(total, 20);
            const currentDot = Math.min(dotCount - 1, Math.floor((current - 1) * dotCount / total));
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'stepper-dot';
                if (i < currentDot) dot.classList.add('completed');
                else if (i === currentDot) dot.classList.add('current');
                stepperEl.appendChild(dot);
            }
        }

        // Subbar Mode Badge
        const modeTextEl = document.getElementById('subbar-mode-text');
        if (modeTextEl) {
            modeTextEl.textContent = `Desafío ${current} • ${level.isBoss ? '⚔️ Batalla de Jefe' : (level.hasEnemy ? '⚔️ Combate' : '🧠 Desafío')}${question.options.length === 8 ? ' · 8 alternativas' : ''}`;
        }

        // Boss / Enemy Arena setup
        const bossArena = document.getElementById('boss-arena');
        if (bossArena) {
            if (gameEngine.activeBoss) {
                bossArena.classList.remove('hidden');

                // Dynamic battle stage background by world
                const backdropEl = document.getElementById('battle-stage-backdrop');
                if (backdropEl) {
                    const world = typeof WORLDS_DATA !== 'undefined' ? WORLDS_DATA.find(w => w.id === level.worldId) : null;
                    const bgUrl = level.battleBg || (world && world.battleBg) || 'assets/world-1/battle-stage-clean.jpg';
                    backdropEl.style.backgroundImage = `url('${bgUrl}')`;
                    backdropEl.classList.remove('world-1', 'world-2', 'world-3', 'world-4', 'world-5', 'world-6');
                    if (level.worldId) backdropEl.classList.add(level.worldId);
                }

                const bossNameEl = document.getElementById('boss-name');
                if (bossNameEl) bossNameEl.textContent = gameEngine.activeBoss.name;
                const bossTitleEl = document.getElementById('boss-title');
                if (bossTitleEl) bossTitleEl.textContent = gameEngine.activeBoss.title || 'Guardián';
                
                // Speech Bubble Initial Text
                const speechTextEl = document.getElementById('enemy-speech-text');
                if (speechTextEl) {
                    if (current === 1) {
                        speechTextEl.textContent = gameEngine.activeBoss.dialogue?.intro || "¡A ver si sabes contar!";
                    }
                }

                const bossAvatarEl = document.getElementById('boss-avatar');
                if (bossAvatarEl) {
                    bossAvatarEl.classList.remove('defeated', 'slapped');
                    const oldStars = document.getElementById('defeated-stars');
                    if (oldStars) oldStars.remove();

                    if (gameEngine.activeBoss.avatarImg) {
                        bossAvatarEl.innerHTML = `<img src="${gameEngine.activeBoss.avatarImg}" alt="${gameEngine.activeBoss.name}" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;">`;
                    } else {
                        bossAvatarEl.textContent = gameEngine.activeBoss.avatar || '👾';
                    }
                }
                const bossBadgeEl = document.getElementById('boss-badge');
                if (bossBadgeEl) {
                    const badgeText = gameEngine.activeBoss.badge || (gameEngine.activeBoss.isBoss ? 'JEFE' : 'ENEMIGO');
                    bossBadgeEl.textContent = badgeText;
                    bossBadgeEl.className = `stage-enemy-badge ${gameEngine.activeBoss.badgeClass || (gameEngine.activeBoss.isBoss ? 'boss' : 'enemy')}`;
                }
                const bossMechEl = document.getElementById('boss-mechanic-text');
                if (bossMechEl) bossMechEl.textContent = gameEngine.activeBoss.mechanicDesc || 'Cada acierto debilita al enemigo.';

                this.updateBossHpDisplay(gameEngine.activeBoss.currentHp, gameEngine.activeBoss.maxHp);
            } else {
                bossArena.classList.add('hidden');
            }
        }

        // Prompt
        const promptEl = document.getElementById('quiz-prompt');
        promptEl.innerHTML = question.prompt;

        this.renderAnswerOptions();
        this.typesetMath(document.getElementById('quiz-card'));
    }

    renderAnswerOptions(shuffled = false) {
        const question = gameEngine.getCurrentQuestion();
        if (!question) return;
        const optionsContainer = document.getElementById('quiz-options-container');
        const focused = document.activeElement;
        const focusedIndex = focused?.classList.contains('option-card') ? Number(focused.dataset.optionIndex) : null;
        optionsContainer.innerHTML = '';

        optionsContainer.classList.toggle('options-grid-expanded', question.options.length === 8);
        question.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-card';
            if (shuffled) btn.classList.add('option-shuffled');
            btn.dataset.optionIndex = idx;
            btn.innerHTML = `
                <span class="option-key">${idx + 1}</span>
                <span class="option-text">${optText}</span>
            `;
            btn.addEventListener('click', () => {
                this.selectAnswer(idx, btn);
            });
            btn.addEventListener('pointerdown', () => { this.answerInteractionPending = true; });
            btn.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') this.answerInteractionPending = true;
            });
            optionsContainer.appendChild(btn);
        });
        this.typesetMath(optionsContainer);
        if (focusedIndex !== null) optionsContainer.children[focusedIndex]?.focus({ preventScroll: true });
    }

    updateCombat(deltaSeconds) {
        const paused = document.hidden || this.answerInteractionPending ||
            document.querySelector('.modal-overlay:not(.hidden)');
        if (this.currentView !== 'quiz' || paused || gameEngine.isAnswerLocked) {
            this.answerShuffleElapsed = 0;
            return;
        }
        const state = gameEngine.tickBoss(deltaSeconds);
        if (state) this.updateBossHpDisplay(state.currentHp, state.maxHp);
        if (gameEngine.activeBoss?.mechanicType !== 'answer-shuffle') return;
        this.answerShuffleElapsed += deltaSeconds * 1000;
        if (this.answerShuffleElapsed >= gameEngine.activeBoss.shuffleIntervalMs) {
            this.answerShuffleElapsed = 0;
            if (gameEngine.shuffleCurrentOptions()) this.renderAnswerOptions(true);
        }
    }

    startBossLoop() {
        this.stopBossLoop();
        this.lastBossTickTime = performance.now();

        const loop = (now) => {
            const dt = Math.min((now - this.lastBossTickTime) / 1000, 0.2);
            this.lastBossTickTime = now;

            if (gameEngine.activeBoss && !gameEngine.activeBoss.isDefeated) {
                this.updateCombat(dt);
            }

            if (this.currentView === 'quiz' && gameEngine.activeBoss && !gameEngine.activeBoss.isDefeated) {
                this.bossAnimFrame = requestAnimationFrame(loop);
            }
        };

        this.bossAnimFrame = requestAnimationFrame(loop);
    }

    stopBossLoop() {
        this.answerShuffleElapsed = 0;
        this.answerInteractionPending = false;
        if (this.bossAnimFrame) {
            cancelAnimationFrame(this.bossAnimFrame);
            this.bossAnimFrame = null;
        }
    }

    updateBossHpDisplay(currentHp, maxHp) {
        const hpBar = document.getElementById('boss-hp-bar');
        const hpText = document.getElementById('boss-hp-text');
        if (!hpBar || !hpText) return;

        const safeHp = Math.max(0, currentHp);
        const percent = Math.max(0, Math.min(100, (safeHp / maxHp) * 100));
        hpBar.style.width = `${percent}%`;
        hpText.textContent = `${Math.ceil(safeHp)} / ${Math.round(maxHp)} HP`;

        if (percent <= 25) {
            hpBar.className = 'stage-hp-bar danger';
        } else if (percent <= 55) {
            hpBar.className = 'stage-hp-bar warning';
        } else {
            hpBar.className = 'stage-hp-bar';
        }
    }

    selectAnswer(optionIndex, selectedBtn) {
        if (this.currentView !== 'quiz' || gameEngine.isAnswerLocked) return;

        const result = gameEngine.submitAnswer(optionIndex);
        if (!result) return;

        this.updateHeaderStats();

        // Mark buttons
        const optionButtons = document.querySelectorAll('.option-card');
        optionButtons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === result.correctIndex) {
                btn.classList.add('correct');
            } else if (idx === optionIndex && !result.isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Boss / Enemy visual hit, slap animation & damage popup
        if (result.boss) {
            this.updateBossHpDisplay(result.boss.currentHp, result.boss.maxHp);

            if (result.isCorrect && result.boss.damage > 0) {
                // 1. Play slap sound effect
                if (soundManager && soundManager.slap) {
                    soundManager.slap();
                }

                // 2. Animate slap hand
                const hand = document.getElementById('slap-hand');
                if (hand) {
                    hand.classList.remove('hidden');
                    hand.classList.remove('animate-slap');
                    void hand.offsetWidth; // trigger reflow
                    hand.classList.add('animate-slap');
                    setTimeout(() => hand.classList.add('hidden'), 420);
                }

                // 3. Comic impact bubble "¡ZAS!"
                const impact = document.getElementById('slap-impact');
                if (impact) {
                    const comicTexts = ['💥 ¡ZAS!', '👋 ¡PLAF!', '⚡ ¡TOMA!', '💥 ¡SLAP!'];
                    impact.textContent = comicTexts[Math.floor(Math.random() * comicTexts.length)];
                    impact.classList.remove('hidden');
                    impact.style.animation = 'none';
                    void impact.offsetWidth; // trigger reflow
                    impact.style.animation = '';
                    setTimeout(() => impact.classList.add('hidden'), 500);
                }

                // 4. Enemy avatar slap recoil
                const avatar = document.getElementById('boss-avatar');
                if (avatar) {
                    avatar.classList.remove('slapped');
                    avatar.classList.remove('boss-shake');
                    void avatar.offsetWidth; // trigger reflow
                    avatar.classList.add('slapped');
                    setTimeout(() => avatar.classList.remove('slapped'), 480);

                    // If defeated, show knocked out avatar with fallen pose and dizzy stars
                    if (result.boss.isDefeated) {
                        avatar.classList.add('defeated');
                        let starsEl = document.getElementById('defeated-stars');
                        if (!starsEl) {
                            starsEl = document.createElement('div');
                            starsEl.id = 'defeated-stars';
                            starsEl.className = 'defeated-stars-burst';
                            starsEl.innerHTML = '💫 😵 💫';
                            avatar.parentElement.appendChild(starsEl);
                        }
                    }
                }

                // 5. Damage popup
                const popup = document.getElementById('boss-damage-popup');
                if (popup) {
                    popup.textContent = `-${result.boss.damage.toFixed(1)} HP`;
                    popup.classList.remove('hidden');
                    void popup.offsetWidth; // trigger reflow
                    setTimeout(() => popup.classList.add('hidden'), 900);
                }

                // Comic speech bubble hit reaction
                const speechTextEl = document.getElementById('enemy-speech-text');
                if (speechTextEl) {
                    if (result.boss.isDefeated) {
                        speechTextEl.textContent = (gameEngine.activeBoss && gameEngine.activeBoss.dialogue && gameEngine.activeBoss.dialogue.defeat) || "¡Me rindo, marinero!";
                    } else {
                        speechTextEl.textContent = (gameEngine.activeBoss && gameEngine.activeBoss.dialogue && gameEngine.activeBoss.dialogue.hit) || "¡Rayos y centellas! ¡Menuda bofetada!";
                    }
                }
            }
        }

        // Open feedback drawer
        const drawer = document.getElementById('quiz-feedback-drawer');
        const titleEl = document.getElementById('feedback-title');
        const explanationEl = document.getElementById('feedback-explanation');
        const gainedXpEl = document.getElementById('feedback-xp');
        const continueBtn = document.getElementById('feedback-continue-btn');
        if (continueBtn) {
            continueBtn.disabled = result.heartsRemaining <= 0;
            continueBtn.textContent = (result.boss && result.boss.isDefeated) ? '🏆 ¡Reclamar Victoria!' : 'Continuar';
        }

        if (result.isCorrect) {
            drawer.className = 'feedback-drawer success';
            if (result.boss && result.boss.isDefeated) {
                const defeatTitle = (gameEngine.currentLevel && gameEngine.currentLevel.isBoss) ? '👑 ¡¡JEFE DERROTADO!! 🎉' : '🏴‍☠️ ¡¡ENEMIGO DERROTADO!! 🎉';
                titleEl.innerHTML = defeatTitle;
                gainedXpEl.textContent = `+${result.gainedXp} XP (¡Victoria Épica!)`;
            } else {
                titleEl.innerHTML = '🎉 ¡Excelente! ¡Respuesta Correcta!';
                gainedXpEl.textContent = `+${result.gainedXp} XP ${result.streak > 1 ? `(🔥 Racha x${result.streak})` : ''}`;
            }
        } else {
            drawer.className = 'feedback-drawer error';
            if (result.boss) {
                titleEl.innerHTML = (gameEngine.activeBoss?.regenRate > 0) ? '💔 ¡Casi! Pero el jefe se regenera...' : '💔 ¡Casi! El enemigo sigue en pie...';
                const speechTextEl = document.getElementById('enemy-speech-text');
                if (speechTextEl) {
                    const taunts = [
                        "¡A ver si sabes contar!",
                        "¡Ja, ja! ¡Esa fue fácil!",
                        "¡Nadie me vence tan rápido!",
                        "¡Aún sigo en pie, grumete!"
                    ];
                    speechTextEl.textContent = taunts[Math.floor(Math.random() * taunts.length)];
                }
            } else {
                titleEl.innerHTML = '💡 ¡Casi! Pero no te rindas';
            }
            gainedXpEl.textContent = '0 XP';
        }

        explanationEl.innerHTML = result.explanation;
        this.typesetMath(explanationEl);
        drawer.classList.remove('hidden');

        // Check for Game Over (0 hearts)
        if (result.heartsRemaining <= 0) {
            this.stopBossLoop();
            this.gameOverTimer = setTimeout(() => {
                soundManager.defeat();
                this.showScreen('gameover');
            }, 1200);
        }
    }

    handleNextQuestion() {
        if (this.currentView !== 'quiz') return;
        if (gameEngine.state.hearts <= 0 || gameEngine.sessionStatus === 'defeated') return;
        const next = gameEngine.nextQuestion();
        if (!next) return;
        if (next.finished) {
            this.stopBossLoop();
            this.showVictory(next.results);
        } else {
            this.renderCurrentQuestion();
        }
    }

    showVictory(results) {
        this.stopBossLoop();
        this.selectedLevelId = results.levelId;
        document.getElementById('quiz-feedback-drawer').classList.add('hidden');
        this.showScreen('victory');

        const title = document.getElementById('victory-title');
        const score = document.getElementById('victory-score-text');
        const nextBtn = document.getElementById('victory-next-btn');
        const retryBtn = document.getElementById('victory-retry-btn');
        const stars = document.getElementById('victory-stars-container');
        const accuracy = results.total > 0 ? Math.round(results.score / results.total * 100) : 0;
        document.getElementById('victory-accuracy').textContent = accuracy + '%';
        document.getElementById('victory-level-title').textContent = results.levelTitle;
        document.getElementById('victory-xp-earned').textContent = '+' + results.bonusXp + ' XP';
        nextBtn.classList.toggle('hidden', !results.isSuccess || !results.isNextUnlocked);
        document.getElementById('victory-map-btn').textContent = results.worldCompleted ? '🌐 Elegir otro mundo' : '🗺️ Volver a este mundo';
        retryBtn.textContent = '🔄 Reintentar';
        stars.innerHTML = '';

        if (!results.isSuccess) {
            title.textContent = results.failureReason === 'enemy' ? '🛡️ ¡El enemigo ha resistido!' : '💡 ¡Sigue practicando!';
            score.textContent = results.failureReason === 'enemy'
                ? results.bossName + ' sigue en pie. ¡Mantén la racha para vencerlo!'
                : 'Acertaste ' + results.score + ' de ' + results.total + '. Necesitas al menos un 60 % de aciertos y conservar vidas.';
            this.updateHeaderStats();
            return;
        }

        title.textContent = results.worldCompleted ? '🏆 ¡Mundo Completado!' : results.isBoss ? '👑 ¡Jefe Derrotado!' : results.bossDefeated ? '🏆 ¡Enemigo Derrotado!' : '🎉 ¡Nivel Completado!';
        score.textContent = 'Acertaste ' + results.score + ' de ' + results.total + ' preguntas' +
            (results.bossDefeated ? ' • ¡Venciste a ' + results.bossName + '!' : '');
        nextBtn.textContent = 'Siguiente Nivel (' + gameEngine.getLocalLevelNumber(results.nextLevelId) + ') ➔';
        this.triggerConfetti();
        for (let s = 1; s <= 3; s++) {
            const star = document.createElement('div');
            star.className = 'victory-star ' + (s <= results.stars ? 'earned' : 'empty');
            star.textContent = s <= results.stars ? '⭐' : '☆';
            stars.appendChild(star);
            if (s <= results.stars) setTimeout(() => {
                if (this.currentView === 'victory') soundManager.star();
            }, s * 300);
        }
        this.updateHeaderStats();
    }

    triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#eab308'];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                r: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.8) * 18,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01
            });
        }

        let animationFrame;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeParticles = 0;

            particles.forEach(p => {
                if (p.alpha > 0) {
                    activeParticles++;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.35; // gravity
                    p.alpha -= p.decay;

                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });

            if (activeParticles > 0) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        };

        animate();
    }

    showAchievementsModal() {
        const modal = document.getElementById('achievements-modal');
        if (!modal) return;

        const rank = gameEngine.getPlayerRank();
        document.getElementById('modal-rank-badge').textContent = rank.badge;
        document.getElementById('modal-rank-title').textContent = rank.title;
        document.getElementById('modal-total-xp').textContent = `${gameEngine.state.xp} XP`;
        document.getElementById('modal-total-stars').textContent = `${gameEngine.getTotalStars()} / ${LEVELS_DATA.length * 3}`;

        const achContainer = document.getElementById('achievements-grid');
        achContainer.innerHTML = '';

        Object.values(gameEngine.state.achievements).forEach(ach => {
            const card = document.createElement('div');
            card.className = `achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-details">
                    <h4>${ach.name}</h4>
                    <p>${ach.desc}</p>
                </div>
                <div class="ach-status">${ach.unlocked ? '✅' : '🔒'}</div>
            `;
            achContainer.appendChild(card);
        });

        modal.classList.remove('hidden');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }
}

var ui = new MathQuestUI();

if (typeof window !== 'undefined') {
    window.MathQuestUI = MathQuestUI;
    window.ui = ui;
}

// Auto-boot reliably whether document is already parsed or still loading
function bootGame() {
    if (window.ui) {
        window.ui.init();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootGame);
} else {
    bootGame();
}

// Ensure KaTeX typesetting is triggered once full page resources are loaded
window.addEventListener('load', () => {
    if (window.ui) {
        window.ui.typesetMath();
    }
});

