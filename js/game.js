// MathQuest: Game State and Engine Manager
class MathQuestEngine {
    constructor() {
        this.STORAGE_KEY = 'mathquest_save_data_v1';
        this.state = this.loadState();

        // Current active session
        this.currentLevel = null;
        this.currentQuestionIdx = 0;
        this.sessionScore = 0;
        this.sessionErrors = 0;
        this.currentStreak = 0;
        this.bestStreakInSession = 0;
        this.isAnswerLocked = false;
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

        return this.getCurrentQuestion();
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

        if (isCorrect) {
            this.currentStreak++;
            if (this.currentStreak > this.bestStreakInSession) {
                this.bestStreakInSession = this.currentStreak;
            }

            const streakBonus = Math.min(this.currentStreak * 2, 20);
            const gainedXp = 10 + streakBonus;
            this.state.xp += gainedXp;
            this.sessionScore++;

            // Check streak achievement
            if (this.currentStreak >= 5) {
                this.unlockAchievement("streak_5");
            }

            soundManager.correct(this.currentStreak);

            return {
                isCorrect: true,
                correctIndex: question.correct,
                explanation: question.explanation,
                gainedXp,
                streak: this.currentStreak,
                heartsRemaining: this.state.hearts
            };
        } else {
            this.currentStreak = 0;
            this.sessionErrors++;
            this.state.hearts = Math.max(0, this.state.hearts - 1);
            this.saveState();

            soundManager.wrong();

            return {
                isCorrect: false,
                correctIndex: question.correct,
                explanation: question.explanation,
                gainedXp: 0,
                streak: 0,
                heartsRemaining: this.state.hearts
            };
        }
    }

    nextQuestion() {
        this.isAnswerLocked = false;
        this.currentQuestionIdx++;
        if (this.currentQuestionIdx >= this.currentLevel.questions.length) {
            return { finished: true, results: this.finishLevel() };
        }
        return { finished: false, question: this.getCurrentQuestion() };
    }

    finishLevel() {
        const totalQuestions = this.currentLevel.questions.length;
        const accuracy = (this.sessionScore / totalQuestions);

        let stars = 1;
        if (accuracy >= 1.0 && this.sessionErrors === 0) {
            stars = 3;
        } else if (accuracy >= 0.8) {
            stars = 2;
        }

        // Completion XP bonus
        let bonusXp = 30 + (stars * 10);
        this.state.xp += bonusXp;

        // Unlock next level
        const currentId = this.currentLevel.id;
        if (currentId >= this.state.unlockedLevel && currentId < LEVELS_DATA.length) {
            this.state.unlockedLevel = currentId + 1;
        }

        // Record stars
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

        this.saveState();

        soundManager.victory();

        return {
            levelId: currentId,
            levelTitle: this.currentLevel.title,
            score: this.sessionScore,
            total: totalQuestions,
            stars,
            bonusXp,
            totalXp: this.state.xp,
            bestStreak: this.bestStreakInSession,
            isNextUnlocked: this.state.unlockedLevel > currentId
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

const gameEngine = new MathQuestEngine();
if (typeof window !== 'undefined') {
    window.MathQuestEngine = MathQuestEngine;
    window.gameEngine = gameEngine;
}
