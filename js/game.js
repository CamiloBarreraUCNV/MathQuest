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
    }

    playSound(method, ...args) {
        const sm = (typeof window !== 'undefined' && window.soundManager) ? window.soundManager : (typeof soundManager !== 'undefined' ? soundManager : null);
        if (sm && typeof sm[method] === 'function') {
            sm[method](...args);
        }
    }

    startLevel(levelId) {
        const level = getLevelById(levelId);
        if (!level) return null;

        this.currentLevel = level;
        this.currentQuestionIdx = 0;
        this.sessionScore = 0;
        this.sessionErrors = 0;
        this.currentStreak = 0;
        this.bestStreakInSession = 0;
        this.isAnswerLocked = false;

        // Initialize Boss if level is a boss fight
        if (level.isBoss && level.boss) {
            this.activeBoss = {
                ...level.boss,
                currentHp: level.boss.maxHp,
                isDefeated: false,
                lastDamage: 0
            };

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
            this.activeBoss = null;
            this.currentLevel = level;
        }

        return this.getCurrentQuestion();
    }

    tickBoss(deltaSeconds) {
        if (!this.activeBoss || this.activeBoss.isDefeated || this.isAnswerLocked) {
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
            unlockedLevel: 1,
            completedLevels: {}, // levelId: { stars: 1-3, score: number, highStreak: number }
            achievements: {
                first_step: { id: "first_step", name: "Primer Paso", desc: "Completa tu primer nivel", icon: "🌱", unlocked: false },
                perfect_level: { id: "perfect_level", name: "Perfección Absoluta", desc: "Obtén 3 estrellas en cualquier nivel", icon: "⭐", unlocked: false },
                streak_5: { id: "streak_5", name: "En Racha de Fuego", desc: "Consigue una racha de 5 aciertos seguidos", icon: "🔥", unlocked: false },
                arithmetic_master: { id: "arithmetic_master", name: "Señor de la Aritmética", desc: "Supera el Valle Aritmético (Mundo 2)", icon: "🛡️", unlocked: false },
                algebra_sorcerer: { id: "algebra_sorcerer", name: "Mago del Álgebra", desc: "Supera el Bosque del Álgebra (Mundo 4)", icon: "🔮", unlocked: false },
                calculus_god: { id: "calculus_god", name: "Archimago del Infinito", desc: "Vence al Arquitecto del Infinito (Nivel 30)", icon: "👑", unlocked: false }
            }
        };
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const defaultState = this.getDefaultState();
                return {
                    ...defaultState,
                    ...parsed,
                    achievements: {
                        ...defaultState.achievements,
                        ...(parsed.achievements || {})
                    }
                };
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
        return Number(levelId) <= this.state.unlockedLevel;
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
        if (this.isAnswerLocked) return null;
        this.isAnswerLocked = true;

        const question = this.getCurrentQuestion();
        if (!question) return null;

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
        this.isAnswerLocked = false;
        
        // If boss was defeated, can transition to victory directly
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
        const totalQuestions = this.currentLevel.questions.length;
        const answeredCount = Math.max(1, this.sessionScore + this.sessionErrors);
        const displayTotal = this.activeBoss ? answeredCount : totalQuestions;
        const accuracy = (this.sessionScore / displayTotal);

        let stars = 1;
        let isBossSuccess = true;

        if (this.activeBoss) {
            if (this.activeBoss.isDefeated) {
                // Defeated the boss!
                stars = (this.sessionErrors === 0) ? 3 : 2;
            } else {
                // Boss survived!
                isBossSuccess = false;
                stars = 0;
            }
        } else {
            if (accuracy >= 1.0 && this.sessionErrors === 0) {
                stars = 3;
            } else if (accuracy >= 0.8) {
                stars = 2;
            }
        }

        // Completion XP bonus
        let bonusXp = isBossSuccess ? (40 + (stars * 15)) : 10;
        this.state.xp += bonusXp;

        // Unlock next level only if normal level passed or boss was defeated
        const currentId = this.currentLevel.id;
        if (isBossSuccess && currentId >= this.state.unlockedLevel && currentId < LEVELS_DATA.length) {
            this.state.unlockedLevel = currentId + 1;
        }

        // Record stars if boss defeated or normal level
        if (isBossSuccess) {
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
            if (this.isLevelUnlocked(10)) {
                this.unlockAchievement("arithmetic_master");
            }
            if (this.isLevelUnlocked(20)) {
                this.unlockAchievement("algebra_sorcerer");
            }
            if (currentId === 30 && stars >= 1) {
                this.unlockAchievement("calculus_god");
            }
        }

        this.saveState();

        if (isBossSuccess) {
            this.playSound('victory');
        } else {
            this.playSound('defeat');
        }

        return {
            levelId: currentId,
            levelTitle: this.currentLevel.title,
            score: this.sessionScore,
            total: displayTotal,
            stars,
            bonusXp,
            totalXp: this.state.xp,
            bestStreak: this.bestStreakInSession,
            isNextUnlocked: this.state.unlockedLevel > currentId,
            isBoss: !!this.activeBoss,
            bossDefeated: this.activeBoss ? this.activeBoss.isDefeated : false,
            bossName: this.activeBoss ? this.activeBoss.name : null
        };
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
