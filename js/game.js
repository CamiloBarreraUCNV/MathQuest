// MathQuest: Game State and Engine Manager
var soundManager = (typeof window !== 'undefined' && window.soundManager) ? window.soundManager : (typeof soundManager !== 'undefined' ? soundManager : null);
var LEVELS_DATA = (typeof window !== 'undefined' && window.LEVELS_DATA) ? window.LEVELS_DATA : (typeof LEVELS_DATA !== 'undefined' ? LEVELS_DATA : []);
var getLevelById = (typeof window !== 'undefined' && window.getLevelById) ? window.getLevelById : (typeof getLevelById !== 'undefined' ? getLevelById : (id) => ((typeof window !== 'undefined' ? window.LEVELS_DATA : LEVELS_DATA) || []).find(l => l.id === Number(id)));

class MathQuestEngine {
    constructor() {
        this.STORAGE_KEY = 'mathquest_save_data_v1';
        this.state = this.loadState();

        // Current active session
        this.currentLevel = null;
        this.activeBoss = null;
        this.currentQuestionIdx = 0;
        this.sessionScore = 0;
        this.sessionErrors = 0;
        this.currentStreak = 0;
        this.bestStreakInSession = 0;
        this.isAnswerLocked = false;
        this.sessionStatus = 'idle';
        this.lastResults = null;
    }

    playSound(method, ...args) {
        const sm = (typeof window !== 'undefined' && window.soundManager) ? window.soundManager : (typeof soundManager !== 'undefined' ? soundManager : null);
        if (sm && typeof sm[method] === 'function') {
            sm[method](...args);
        }
    }

    startLevel(levelId) {
        const level = getLevelById(levelId);
        if (!level || this.state.hearts <= 0) return null;

        this.currentLevel = level;
        this.currentQuestionIdx = 0;
        this.sessionScore = 0;
        this.sessionErrors = 0;
        this.currentStreak = 0;
        this.bestStreakInSession = 0;
        this.isAnswerLocked = false;
        this.sessionStatus = 'playing';
        this.lastResults = null;

        // Initialize Boss or Enemy if level has combat
        const combatTarget = (level.isBoss && level.boss) ? level.boss : (level.hasEnemy && level.enemy ? level.enemy : null);
        if (combatTarget) {
            this.activeBoss = {
                ...combatTarget,
                isBoss: !!level.isBoss,
                currentHp: combatTarget.maxHp,
                isDefeated: false,
                lastDamage: 0
            };

            if (level.isBoss) {
                // Gather all questions from previous levels in the same world
                const levelsList = (typeof window !== 'undefined' ? window.LEVELS_DATA : LEVELS_DATA) || [];
                const prevLevels = levelsList.filter(l => l.worldId === level.worldId && l.id < level.id);
                const allPrevQuestions = prevLevels.flatMap(l => l.questions || []);

                // Combine previous levels' questions with boss level questions
                const combined = [...allPrevQuestions, ...(level.questions || [])];

                // Fisher-Yates shuffle
                const pool = [...combined];
                for (let i = pool.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pool[i], pool[j]] = [pool[j], pool[i]];
                }

                this.currentLevel = {
                    ...level,
                    questions: pool
                };
            } else {
                // Shuffle questions so they appear in a fresh random order every time
                const pool = [...(level.questions || [])];
                for (let i = pool.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pool[i], pool[j]] = [pool[j], pool[i]];
                }

                this.currentLevel = {
                    ...level,
                    questions: pool
                };
            }
        } else {
            // Non-combat levels: also shuffle questions for variety
            const pool = [...(level.questions || [])];
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            this.activeBoss = null;
            this.currentLevel = {
                ...level,
                questions: pool
            };
        }

        // Shuffle copies of the options, keeping the answer attached to its original index.
        this.currentLevel.questions = this.currentLevel.questions.map(question => {
            const answerCount = level.answerOptionCount || question.options.length;
            const texts = [...question.options, ...(question.bossDistractors || [])].slice(0, answerCount);
            const options = texts.map((text, index) => ({ text, index }));
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            return {
                ...question,
                options: options.map(option => option.text),
                correct: options.findIndex(option => option.index === question.correct)
            };
        });
        return this.getCurrentQuestion();
    }

    shuffleCurrentOptions() {
        if (this.sessionStatus !== 'playing' || this.state.hearts <= 0 || this.isAnswerLocked ||
            !this.activeBoss || this.activeBoss.isDefeated || this.activeBoss.mechanicType !== 'answer-shuffle') return false;
        const question = this.getCurrentQuestion();
        if (!question || question.options.length < 2) return false;
        const order = question.options.map((_, index) => index);
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }
        // A shuffle must visibly change the order, even when random returns the identity.
        if (order.every((index, position) => index === position)) [order[0], order[order.length - 1]] = [order[order.length - 1], order[0]];
        const previous = question.options;
        const correct = question.correct;
        question.options = order.map(index => previous[index]);
        question.correct = order.indexOf(correct);
        return true;
    }

    tickBoss(deltaSeconds) {
        if (this.sessionStatus !== 'playing' || !this.activeBoss || this.activeBoss.isDefeated || this.isAnswerLocked) {
            return null;
        }
        if (this.activeBoss.regenRate > 0) {
            this.activeBoss.currentHp = Math.min(
                this.activeBoss.maxHp,
                this.activeBoss.currentHp + (this.activeBoss.regenRate * deltaSeconds)
            );
        }
        return {
            currentHp: this.activeBoss.currentHp,
            maxHp: this.activeBoss.maxHp,
            percent: Math.max(0, Math.min(100, (this.activeBoss.currentHp / this.activeBoss.maxHp) * 100))
        };
    }

    getDefaultState() {
        return {
            hearts: 5,
            maxHearts: 5,
            xp: 0,
            schemaVersion: 2,
            worldProgress: Object.fromEntries(
                [...new Set(LEVELS_DATA.map(level => level.worldId))].map(worldId =>
                    [worldId, { unlockedLevelId: this.getWorldLevels(worldId)[0].id }])
            ),
            completedLevels: {}, // levelId: { stars: 1-3, score: number, highStreak: number }
            achievements: {
                first_step: { id: "first_step", name: "Primer Paso", desc: "Completa tu primer nivel", icon: "🌱", unlocked: false },
                perfect_level: { id: "perfect_level", name: "Perfección Absoluta", desc: "Obtén 3 estrellas en cualquier nivel", icon: "⭐", unlocked: false },
                streak_5: { id: "streak_5", name: "En Racha de Fuego", desc: "Consigue una racha de 5 aciertos seguidos", icon: "🔥", unlocked: false },
                arithmetic_master: { id: "arithmetic_master", name: "Señor de la Aritmética", desc: "Supera el Circo de las Sumas (Mundo 2)", icon: "🛡️", unlocked: false },
                algebra_sorcerer: { id: "algebra_sorcerer", name: "Mago del Álgebra", desc: "Supera el Bosque del Álgebra (Mundo 4)", icon: "🔮", unlocked: false },
                calculus_god: { id: "calculus_god", name: "Archimago del Infinito", desc: "Vence al Arquitecto del Infinito (Mundo 6)", icon: "👑", unlocked: false }
            }
        };
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const state = this.getDefaultState();
                if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return state;
                const integer = (value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) =>
                    Number.isSafeInteger(value) ? Math.max(min, Math.min(max, value)) : fallback;
                state.hearts = integer(parsed.hearts, state.hearts, 0, state.maxHearts);
                state.xp = integer(parsed.xp, 0);
                for (const level of LEVELS_DATA) {
                    const saved = parsed.completedLevels?.[level.id];
                    if (!saved || !Number.isInteger(saved.stars) || saved.stars < 1 || saved.stars > 3) continue;
                    state.completedLevels[level.id] = {
                        completed: true,
                        stars: saved.stars,
                        score: integer(saved.score, 0),
                        highStreak: integer(saved.highStreak, 0)
                    };
                }
                for (const id of Object.keys(state.achievements)) {
                    state.achievements[id].unlocked = parsed.achievements?.[id]?.unlocked === true;
                }
                // Keep the same save key: migrate old global unlocks without losing stars or XP.
                for (const worldId of Object.keys(state.worldProgress)) {
                    const levels = this.getWorldLevels(worldId);
                    const savedId = parsed.schemaVersion === 2
                        ? parsed.worldProgress?.[worldId]?.unlockedLevelId
                        : integer(parsed.unlockedLevel, 1, 1, LEVELS_DATA.length);
                    let unlockedIndex = parsed.schemaVersion === 2
                        ? Math.max(0, levels.findIndex(level => level.id === savedId))
                        : Math.max(0, levels.findLastIndex(level => level.id <= savedId));
                    levels.forEach((level, index) => {
                        if (state.completedLevels[level.id]) unlockedIndex = Math.max(unlockedIndex, Math.min(index + 1, levels.length - 1));
                    });
                    state.worldProgress[worldId].unlockedLevelId = levels[unlockedIndex].id;
                }
                return state;
            }
        } catch (e) {
            console.error("Error loading MathQuest save data", e);
        }
        return this.getDefaultState();
    }

    saveState() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.error("Error saving MathQuest data", e);
        }
    }

    resetProgress() {
        this.cancelSession();
        this.currentLevel = null;
        this.activeBoss = null;
        this.currentQuestionIdx = 0;
        this.sessionScore = 0;
        this.sessionErrors = 0;
        this.currentStreak = 0;
        this.bestStreakInSession = 0;
        this.lastResults = null;
        this.state = this.getDefaultState();
        this.saveState();
    }

    getPlayerRank() {
        const xp = this.state.xp;
        if (xp >= 2500) return { title: "Archimago del Cálculo Infinito", badge: "🌌", color: "#ec4899", nextXp: null };
        if (xp >= 1800) return { title: "Maestro de Curvas y Límites", badge: "🏔️", color: "#06b6d4", nextXp: 2500 };
        if (xp >= 1200) return { title: "Hechicero del Álgebra", badge: "🔮", color: "#8b5cf6", nextXp: 1800 };
        if (xp >= 700)  return { title: "Domador de Factores", badge: "⚡", color: "#f59e0b", nextXp: 1200 };
        if (xp >= 300)  return { title: "Guardián Aritmético", badge: "🌊", color: "#0284c7", nextXp: 700 };
        if (xp >= 80)   return { title: "Explorador de Números", badge: "🌱", color: "#10b981", nextXp: 300 };
        return { title: "Novato Numérico", badge: "🐣", color: "#64748b", nextXp: 80 };
    }

    isLevelUnlocked(levelId) {
        const level = getLevelById(levelId);
        if (!level) return false;
        return level.id <= this.state.worldProgress[level.worldId].unlockedLevelId;
    }

    getWorldLevels(worldId) {
        return LEVELS_DATA.filter(level => level.worldId === worldId).sort((a, b) => a.id - b.id);
    }

    getLocalLevelNumber(levelId) {
        const level = getLevelById(levelId);
        return level ? this.getWorldLevels(level.worldId).findIndex(item => item.id === level.id) + 1 : 0;
    }

    getNextLevelId(levelId) {
        const level = getLevelById(levelId);
        if (!level) return null;
        const levels = this.getWorldLevels(level.worldId);
        return levels[levels.findIndex(item => item.id === level.id) + 1]?.id ?? null;
    }

    getWorldProgress(worldId) {
        const levels = this.getWorldLevels(worldId);
        const completedCount = levels.filter(level => this.getLevelStars(level.id) > 0).length;
        return {
            completedCount,
            total: levels.length,
            stars: levels.reduce((sum, level) => sum + this.getLevelStars(level.id), 0),
            maxStars: levels.length * 3,
            unlockedLevelId: this.state.worldProgress[worldId]?.unlockedLevelId ?? null,
            nextLevelId: levels.find(level => this.isLevelUnlocked(level.id) && !this.getLevelStars(level.id))?.id ?? null,
            completed: levels.length > 0 && completedCount === levels.length
        };
    }

    getLevelStars(levelId) {
        return this.state.completedLevels[levelId]?.stars || 0;
    }

    getTotalStars() {
        return Object.values(this.state.completedLevels).reduce((acc, curr) => acc + (curr.stars || 0), 0);
    }

    getCurrentQuestion() {
        if (!this.currentLevel) return null;
        return this.currentLevel.questions[this.currentQuestionIdx] || null;
    }

    submitAnswer(optionIndex) {
        if (this.sessionStatus !== 'playing' || this.isAnswerLocked || this.state.hearts <= 0) return null;
        const question = this.getCurrentQuestion();
        if (!question || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return null;
        this.isAnswerLocked = true;

        const isCorrect = (optionIndex === question.correct);
        let damage = 0;

        if (isCorrect) {
            this.currentStreak++;
            if (this.currentStreak > this.bestStreakInSession) {
                this.bestStreakInSession = this.currentStreak;
            }

            const streakBonus = Math.min(this.currentStreak * 2, 20);
            const gainedXp = 10 + streakBonus;
            this.state.xp += gainedXp;
            this.sessionScore++;

            // Boss damage calculation: 1 base damage + (0.5 * streak)
            if (this.activeBoss && !this.activeBoss.isDefeated) {
                const bonusPerStreak = this.activeBoss.streakBonus || 0.5;
                damage = (this.activeBoss.baseDamage || 1.0) + (this.currentStreak * bonusPerStreak);
                this.activeBoss.currentHp = Math.max(0, this.activeBoss.currentHp - damage);

                if (this.activeBoss.currentHp <= 0) {
                    this.activeBoss.isDefeated = true;
                    this.playSound('bossDefeat');
                } else {
                    this.playSound('bossHit');
                }
            } else {
                this.playSound('correct', this.currentStreak);
            }

            // Check streak achievement
            if (this.currentStreak >= 5) {
                this.unlockAchievement("streak_5");
            }
            this.saveState();

            return {
                isCorrect: true,
                correctIndex: question.correct,
                explanation: question.explanation,
                gainedXp,
                streak: this.currentStreak,
                heartsRemaining: this.state.hearts,
                boss: this.activeBoss ? {
                    name: this.activeBoss.name,
                    currentHp: this.activeBoss.currentHp,
                    maxHp: this.activeBoss.maxHp,
                    damage,
                    isDefeated: this.activeBoss.isDefeated
                } : null
            };
        } else {
            this.currentStreak = 0;
            this.sessionErrors++;
            this.state.hearts = Math.max(0, this.state.hearts - 1);
            if (this.state.hearts === 0) this.sessionStatus = 'defeated';
            this.saveState();

            this.playSound('wrong');

            return {
                isCorrect: false,
                correctIndex: question.correct,
                explanation: question.explanation,
                gainedXp: 0,
                streak: 0,
                heartsRemaining: this.state.hearts,
                boss: this.activeBoss ? {
                    name: this.activeBoss.name,
                    currentHp: this.activeBoss.currentHp,
                    maxHp: this.activeBoss.maxHp,
                    damage: 0,
                    isDefeated: this.activeBoss.isDefeated
                } : null
            };
        }
    }

    nextQuestion() {
        if (this.lastResults) return { finished: true, results: this.lastResults };
        if (this.sessionStatus === 'defeated') return { finished: true, results: this.finishLevel() };
        if (this.sessionStatus !== 'playing' || !this.isAnswerLocked) return null;
        this.isAnswerLocked = false;
        
        // If enemy or boss was defeated, transition to victory directly!
        if (this.activeBoss && this.activeBoss.isDefeated) {
            return { finished: true, results: this.finishLevel() };
        }

        this.currentQuestionIdx++;
        if (this.currentQuestionIdx >= this.currentLevel.questions.length) {
            return { finished: true, results: this.finishLevel() };
        }
        return { finished: false, question: this.getCurrentQuestion() };
    }

    finishLevel() {
        if (this.lastResults) return this.lastResults;
        if (!this.currentLevel || !['playing', 'defeated'].includes(this.sessionStatus)) return null;
        const exhausted = this.currentQuestionIdx >= this.currentLevel.questions.length;
        if (this.sessionStatus === 'playing' && !exhausted && !this.activeBoss?.isDefeated) return null;
        const totalQuestions = this.currentLevel.questions.length;
        const hasCombat = !!this.activeBoss;
        const isBossFight = !!(this.activeBoss && this.currentLevel.isBoss);
        const answeredCount = Math.max(1, this.sessionScore + this.sessionErrors);
        const displayTotal = hasCombat ? answeredCount : totalQuestions;
        const accuracy = (this.sessionScore / displayTotal);

        const outOfLives = this.sessionStatus === 'defeated' || this.state.hearts <= 0;
        const isSuccess = !outOfLives &&
            (hasCombat ? this.activeBoss.isDefeated : exhausted && accuracy >= 0.6);
        const stars = !isSuccess ? 0 : accuracy === 1 ? 3 : accuracy >= 0.75 ? 2 : 1;
        this.sessionStatus = 'finished';
        this.isAnswerLocked = true;

        // Completion XP bonus
        const bonusXp = isSuccess ? (40 + (stars * 15)) : 0;
        this.state.xp += bonusXp;

        // Unlock next level only if normal level passed or enemy/boss was defeated
        const currentId = this.currentLevel.id;
        const nextLevelId = this.getNextLevelId(currentId);
        if (isSuccess && nextLevelId !== null) {
            const progress = this.state.worldProgress[this.currentLevel.worldId];
            progress.unlockedLevelId = Math.max(progress.unlockedLevelId, nextLevelId);
        }

        // Record stars if level succeeded
        if (isSuccess) {
            const prevStars = this.state.completedLevels[currentId]?.stars || 0;
            this.state.completedLevels[currentId] = {
                completed: true,
                stars: Math.max(prevStars, stars),
                score: this.sessionScore,
                highStreak: Math.max(this.state.completedLevels[currentId]?.highStreak || 0, this.bestStreakInSession)
            };

            // Check Achievements
            this.unlockAchievement("first_step");
            if (stars === 3) {
                this.unlockAchievement("perfect_level");
            }
            if (this.getWorldProgress('world-2').completed) {
                this.unlockAchievement("arithmetic_master");
            }
            if (this.getWorldProgress('world-4').completed) {
                this.unlockAchievement("algebra_sorcerer");
            }
            if (currentId === 30 && stars >= 1) {
                this.unlockAchievement("calculus_god");
            }
        }

        this.saveState();

        if (isSuccess) {
            this.playSound('victory');
        } else {
            this.playSound('defeat');
        }

        this.lastResults = {
            isSuccess,
            failureReason: isSuccess ? null : outOfLives ? 'hearts' : hasCombat ? 'enemy' : 'accuracy',
            levelId: currentId,
            levelTitle: this.currentLevel.title,
            score: this.sessionScore,
            total: displayTotal,
            stars,
            bonusXp,
            totalXp: this.state.xp,
            bestStreak: this.bestStreakInSession,
            nextLevelId,
            worldId: this.currentLevel.worldId,
            worldCompleted: this.getWorldProgress(this.currentLevel.worldId).completed,
            isNextUnlocked: nextLevelId !== null && this.isLevelUnlocked(nextLevelId),
            isBoss: isBossFight,
            bossDefeated: this.activeBoss ? this.activeBoss.isDefeated : false,
            bossName: this.activeBoss ? this.activeBoss.name : null
        };
        return this.lastResults;
    }

    cancelSession() {
        this.sessionStatus = 'idle';
        this.isAnswerLocked = true;
    }

    refillHearts() {
        this.state.hearts = this.state.maxHearts;
        this.saveState();
    }

    unlockAchievement(achId) {
        if (this.state.achievements[achId] && !this.state.achievements[achId].unlocked) {
            this.state.achievements[achId].unlocked = true;
            this.saveState();
            return this.state.achievements[achId];
        }
        return null;
    }
}

var gameEngine = new MathQuestEngine();
if (typeof window !== 'undefined') {
    window.MathQuestEngine = MathQuestEngine;
    window.gameEngine = gameEngine;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MathQuestEngine, gameEngine };
}
