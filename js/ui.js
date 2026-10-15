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
        this.bossAnimFrame = null;
        this.lastBossTickTime = 0;
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
                const nextId = this.selectedLevelId + 1;
                this.showScreen('map');
                this.renderMap();
                if (nextId <= LEVELS_DATA.length && gameEngine.isLevelUnlocked(nextId)) {
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
                if (confirm("⚠️ ¿Estás seguro de que deseas reiniciar TODO tu progreso? Volverás al Nivel 1.")) {
                    gameEngine.resetProgress();
                    this.updateHeaderStats();
                    this.renderMap();
                    document.getElementById('achievements-modal').classList.add('hidden');
                    this.showToast("🔄 Progreso reiniciado con éxito");
                }
            });
        }

        // Keyboard shortcuts for options (1, 2, 3, 4) & Enter
        window.addEventListener('keydown', (e) => {
            if (this.currentView !== 'quiz') return;

            const feedbackDrawer = document.getElementById('quiz-feedback-drawer');
            const isDrawerOpen = feedbackDrawer && !feedbackDrawer.classList.contains('hidden');

            if (isDrawerOpen) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleNextQuestion();
                }
                return;
            }

            if (['1', '2', '3', '4'].includes(e.key)) {
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
        if (screenName !== 'quiz') {
            this.stopBossLoop();
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

        container.innerHTML = '';

        WORLDS_DATA.forEach(world => {
            const worldSection = document.createElement('div');
            worldSection.className = 'world-section';
            worldSection.id = world.id;

            const worldLevels = getLevelsByWorld(world.id);
            const completedCount = worldLevels.filter(lvl => (gameEngine.getLevelStars(lvl.id) > 0)).length;

            const headerHtml = `
                <div class="world-header" style="background: ${world.bgGradient}">
                    <div class="world-header-info">
                        <div class="world-badge">${world.icon} MUNDO ${world.num}</div>
                        <h2 class="world-title">${world.title}</h2>
                        <p class="world-subtitle">${world.subtitle}</p>
                    </div>
                    <div class="world-progress-badge">
                        <span>${completedCount}/${worldLevels.length}</span>
                        <small>Completados</small>
                    </div>
                </div>
            `;

            let nodesHtml = '<div class="levels-path">';
            worldLevels.forEach((level, index) => {
                const isUnlocked = gameEngine.isLevelUnlocked(level.id);
                const stars = gameEngine.getLevelStars(level.id);
                const isCurrent = (level.id === gameEngine.state.unlockedLevel);
                const isBoss = !!level.isBoss;

                let starIcons = '';
                for (let s = 1; s <= 3; s++) {
                    starIcons += s <= stars ? '⭐' : '☆';
                }

                // Node positioning styling: winding snake pattern
                const offsetClass = (index % 2 === 1) ? 'offset-right' : 'offset-left';
                const nodeStyle = (isUnlocked && !isCurrent) ? `style="background: ${world.bgGradient}; box-shadow: 0 6px 0 ${world.color}88, 0 8px 18px rgba(0,0,0,0.3);"` : '';
                const bossClass = isBoss ? 'boss-node' : '';

                nodesHtml += `
                    <div class="level-node-wrapper ${offsetClass}">
                        <button class="level-node ${bossClass} ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''} ${stars === 3 ? 'perfect' : ''}"
                                data-level-id="${level.id}"
                                ${!isUnlocked ? 'disabled' : ''}
                                ${nodeStyle}
                                title="${level.title}">
                            <div class="node-icon">${isUnlocked ? level.icon : '🔒'}</div>
                            ${isCurrent ? '<div class="current-indicator">¡Aquí!</div>' : ''}
                        </button>
                        <div class="node-info">
                            ${isBoss ? '<span class="node-level-num boss-node-tag">👑 JEFE FINAL</span>' : `<span class="node-level-num">Nivel ${level.id}</span>`}
                            <span class="node-title">${level.title}</span>
                            ${isUnlocked ? `<div class="node-stars">${starIcons}</div>` : ''}
                        </div>
                    </div>
                `;
            });
            nodesHtml += '</div>';

            worldSection.innerHTML = headerHtml + nodesHtml;
            container.appendChild(worldSection);
        });

        // Bind clicks to level nodes
        document.querySelectorAll('.level-node.unlocked').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const levelId = parseInt(btn.getAttribute('data-level-id'));
                soundManager.levelSelect();
                this.openLevelPreview(levelId);
            });
        });
    }

    openLevelPreview(levelId) {
        this.selectedLevelId = levelId;
        const level = getLevelById(levelId);
        if (!level) return;

        const modal = document.getElementById('lesson-modal');
        if (!modal) return;

        document.getElementById('lesson-level-tag').textContent = level.isBoss ? `⚔️ BATALLA DE JEFE • ${level.icon}` : `Nivel ${level.id} • ${level.icon}`;
        document.getElementById('lesson-title').textContent = level.title;
        document.getElementById('lesson-subtitle').textContent = level.subtitle;
        document.getElementById('lesson-theory-title').textContent = level.theory.title;

        const contentEl = document.getElementById('lesson-theory-content');
        contentEl.innerHTML = level.theory.content;

        const startBtn = document.getElementById('start-challenge-btn');
        if (startBtn) {
            startBtn.textContent = level.isBoss ? '⚔️ ¡Iniciar Batalla de Jefe!' : '¡Comenzar Desafío!';
        }

        modal.classList.remove('hidden');
        this.typesetMath(modal);
    }

    closeLessonModal() {
        const modal = document.getElementById('lesson-modal');
        if (modal) modal.classList.add('hidden');
    }

    startQuiz(levelId) {
        this.selectedLevelId = levelId;
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
        const question = gameEngine.getCurrentQuestion();
        const level = gameEngine.currentLevel;
        if (!question || !level) return;

        // Reset feedback drawer
        const feedbackDrawer = document.getElementById('quiz-feedback-drawer');
        if (feedbackDrawer) feedbackDrawer.classList.add('hidden');

        // Update progress bar
        const total = level.questions.length;
        const current = gameEngine.currentQuestionIdx + 1;
        const percent = ((current - 1) / total) * 100;
        const barFill = document.getElementById('quiz-progress-bar-fill');
        if (barFill) barFill.style.width = `${percent}%`;

        const counterEl = document.getElementById('quiz-question-counter');
        if (counterEl) {
            if (gameEngine.activeBoss) {
                counterEl.textContent = `Desafío ${current} • ⚔️ Batalla de Jefe`;
            } else {
                counterEl.textContent = `Pregunta ${current} de ${total}`;
            }
        }
        document.getElementById('quiz-level-tag').textContent = `${level.icon} Nivel ${level.id}: ${level.title}`;

        // Boss Arena setup
        const bossArena = document.getElementById('boss-arena');
        if (bossArena) {
            if (gameEngine.activeBoss) {
                bossArena.classList.remove('hidden');
                const bossNameEl = document.getElementById('boss-name');
                if (bossNameEl) bossNameEl.textContent = gameEngine.activeBoss.name;
                const bossTitleEl = document.getElementById('boss-title');
                if (bossTitleEl) bossTitleEl.textContent = gameEngine.activeBoss.title || 'Guardián';
                const bossAvatarEl = document.getElementById('boss-avatar');
                if (bossAvatarEl) bossAvatarEl.textContent = gameEngine.activeBoss.avatar || '👾';
                const bossMechEl = document.getElementById('boss-mechanic-text');
                if (bossMechEl) bossMechEl.textContent = gameEngine.activeBoss.mechanicDesc || 'Mecánica de Jefe';

                this.updateBossHpDisplay(gameEngine.activeBoss.currentHp, gameEngine.activeBoss.maxHp);
            } else {
                bossArena.classList.add('hidden');
            }
        }

        // Prompt
        const promptEl = document.getElementById('quiz-prompt');
        promptEl.innerHTML = question.prompt;

        // Render Options
        const optionsContainer = document.getElementById('quiz-options-container');
        optionsContainer.innerHTML = '';

        const shortcuts = ['1', '2', '3', '4'];
        question.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-card';
            btn.innerHTML = `
                <span class="option-key">${shortcuts[idx]}</span>
                <span class="option-text">${optText}</span>
            `;
            btn.addEventListener('click', () => {
                this.selectAnswer(idx, btn);
            });
            optionsContainer.appendChild(btn);
        });

        // Typeset LaTeX inside the card
        this.typesetMath(document.getElementById('quiz-card'));
    }

    startBossLoop() {
        this.stopBossLoop();
        this.lastBossTickTime = performance.now();

        const loop = (now) => {
            const dt = Math.min((now - this.lastBossTickTime) / 1000, 0.2);
            this.lastBossTickTime = now;

            if (gameEngine.activeBoss && !gameEngine.activeBoss.isDefeated) {
                const bossState = gameEngine.tickBoss(dt);
                if (bossState) {
                    this.updateBossHpDisplay(bossState.currentHp, bossState.maxHp);
                }
            }

            if (this.currentView === 'quiz' && gameEngine.activeBoss && !gameEngine.activeBoss.isDefeated) {
                this.bossAnimFrame = requestAnimationFrame(loop);
            }
        };

        this.bossAnimFrame = requestAnimationFrame(loop);
    }

    stopBossLoop() {
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
        hpText.textContent = `${safeHp.toFixed(1)} / ${maxHp.toFixed(1)} HP`;

        if (percent <= 25) {
            hpBar.className = 'boss-hp-bar danger';
        } else if (percent <= 55) {
            hpBar.className = 'boss-hp-bar warning';
        } else {
            hpBar.className = 'boss-hp-bar';
        }
    }

    selectAnswer(optionIndex, selectedBtn) {
        if (gameEngine.isAnswerLocked) return;

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

        // Boss visual hit & damage popup
        if (result.boss) {
            this.updateBossHpDisplay(result.boss.currentHp, result.boss.maxHp);

            if (result.isCorrect && result.boss.damage > 0) {
                const avatar = document.getElementById('boss-avatar');
                if (avatar) {
                    avatar.classList.remove('boss-shake');
                    void avatar.offsetWidth; // force reflow
                    avatar.classList.add('boss-shake');
                    setTimeout(() => avatar.classList.remove('boss-shake'), 450);
                }

                const popup = document.getElementById('boss-damage-popup');
                if (popup) {
                    popup.textContent = `-${result.boss.damage.toFixed(1)} HP`;
                    popup.classList.remove('hidden');
                    popup.style.animation = 'none';
                    void popup.offsetWidth; // trigger reflow
                    popup.style.animation = '';
                    setTimeout(() => popup.classList.add('hidden'), 850);
                }
            }
        }

        // Open feedback drawer
        const drawer = document.getElementById('quiz-feedback-drawer');
        const titleEl = document.getElementById('feedback-title');
        const explanationEl = document.getElementById('feedback-explanation');
        const gainedXpEl = document.getElementById('feedback-xp');

        if (result.isCorrect) {
            drawer.className = 'feedback-drawer success';
            if (result.boss && result.boss.isDefeated) {
                titleEl.innerHTML = '👑 ¡¡JEFE DERROTADO!! 🎉';
                gainedXpEl.textContent = `+${result.gainedXp} XP (¡Victoria Épica!)`;
            } else {
                titleEl.innerHTML = '🎉 ¡Excelente! ¡Respuesta Correcta!';
                gainedXpEl.textContent = `+${result.gainedXp} XP ${result.streak > 1 ? `(🔥 Racha x${result.streak})` : ''}`;
            }
        } else {
            drawer.className = 'feedback-drawer error';
            if (result.boss) {
                titleEl.innerHTML = '💔 ¡Casi! Pero el jefe se regenera...';
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
            setTimeout(() => {
                this.stopBossLoop();
                soundManager.defeat();
                this.showScreen('gameover');
            }, 1200);
        }
    }

    handleNextQuestion() {
        const next = gameEngine.nextQuestion();
        if (next.finished) {
            this.stopBossLoop();
            this.showVictory(next.results);
        } else {
            this.renderCurrentQuestion();
        }
    }

    showVictory(results) {
        this.stopBossLoop();
        this.showScreen('victory');

        const victoryTitle = document.getElementById('victory-title');
        const scoreText = document.getElementById('victory-score-text');
        const nextBtn = document.getElementById('victory-next-btn');
        const retryBtn = document.getElementById('victory-retry-btn');
        const starsContainer = document.getElementById('victory-stars-container');
        const accuracyEl = document.getElementById('victory-accuracy');

        // Precision
        const accPct = results.total > 0 ? Math.round((results.score / results.total) * 100) : 100;
        if (accuracyEl) accuracyEl.textContent = `${accPct}%`;

        document.getElementById('victory-level-title').textContent = results.levelTitle;
        document.getElementById('victory-xp-earned').textContent = `+${results.bonusXp} XP`;

        // Ensure next button is visible by default
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
        }

        if (results.isBoss) {
            if (results.bossDefeated) {
                // Boss was defeated!
                if (victoryTitle) victoryTitle.innerHTML = '👑 ¡Jefe Derrotado!';
                scoreText.textContent = `Acertaste ${results.score} de ${results.total} preguntas • ¡Venciste a ${results.bossName || 'el Jefe'}! 🍎`;
                if (retryBtn) retryBtn.textContent = '🔄 Repetir Batalla';

                if (nextBtn) {
                    if (results.levelId >= LEVELS_DATA.length) {
                        nextBtn.textContent = '🏆 ¡Aventura Completada!';
                    } else {
                        nextBtn.textContent = `Siguiente Nivel (${results.levelId + 1}) ➔`;
                    }
                }

                this.triggerConfetti();
                starsContainer.innerHTML = '';
                for (let s = 1; s <= 3; s++) {
                    const star = document.createElement('div');
                    star.className = `victory-star ${s <= results.stars ? 'earned' : 'empty'}`;
                    star.innerHTML = s <= results.stars ? '⭐' : '☆';
                    starsContainer.appendChild(star);

                    if (s <= results.stars) {
                        setTimeout(() => soundManager.star(), s * 300);
                    }
                }
            } else {
                // Boss survived!
                if (victoryTitle) victoryTitle.innerHTML = '⏳ ¡El Jefe ha resistido!';
                scoreText.textContent = `${results.bossName || 'El Manzano Ancestral'} recuperó toda su energía. ¡Responde más rápido y mantén la racha para derrotarlo!`;

                // Hide next button because boss wasn't beaten
                if (nextBtn) {
                    nextBtn.classList.add('hidden');
                }
                if (retryBtn) {
                    retryBtn.textContent = '⚔️ Reintentar Batalla';
                }

                starsContainer.innerHTML = `
                    <div style="font-size: 2.5rem; margin: 8px 0; animation: float 2s infinite;">🛡️</div>
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 8px;">El jefe resistió el combate. ¡Prueba otra estrategia!</p>
                `;
            }
        } else {
            // Normal level completed
            if (victoryTitle) victoryTitle.innerHTML = '🎉 ¡Nivel Completado!';
            scoreText.textContent = `Acertaste ${results.score} de ${results.total} preguntas`;
            if (retryBtn) retryBtn.textContent = '🔄 Reintentar';

            if (nextBtn) {
                if (results.levelId >= LEVELS_DATA.length) {
                    nextBtn.textContent = '🏆 ¡Aventura Completada!';
                } else {
                    nextBtn.textContent = `Siguiente Nivel (${results.levelId + 1}) ➔`;
                }
            }

            this.triggerConfetti();
            starsContainer.innerHTML = '';
            for (let s = 1; s <= 3; s++) {
                const star = document.createElement('div');
                star.className = `victory-star ${s <= results.stars ? 'earned' : 'empty'}`;
                star.innerHTML = s <= results.stars ? '⭐' : '☆';
                starsContainer.appendChild(star);

                if (s <= results.stars) {
                    setTimeout(() => soundManager.star(), s * 300);
                }
            }
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
        document.getElementById('modal-total-stars').textContent = `${gameEngine.getTotalStars()} / 90`;

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

