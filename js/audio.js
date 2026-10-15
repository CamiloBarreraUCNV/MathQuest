// Audio Synthesizer using Web Audio API (Zero external assets required)
class SoundFX {
    constructor() {
        this.ctx = null;
        let storedSound = null;
        try {
            if (typeof localStorage !== 'undefined') {
                storedSound = localStorage.getItem('mathquest_sound');
            }
        } catch (e) {
            console.warn('localStorage not accessible, default sound on');
        }
        this.enabled = storedSound !== 'false';
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('mathquest_sound', this.enabled);
            }
        } catch (e) {
            // Ignored if local storage disabled
        }
        return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, delay = 0) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const startTime = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(gainVal, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    click() {
        this.playTone(600, 'triangle', 0.04, 0.08);
    }

    correct(streak = 1) {
        if (!this.enabled) return;
        // Pitch rises subtly with combo streak
        const baseFreq = 440 + Math.min(streak * 20, 200);
        this.playTone(baseFreq, 'sine', 0.15, 0.12, 0);
        this.playTone(baseFreq * 1.25, 'sine', 0.18, 0.12, 0.08);
        this.playTone(baseFreq * 1.5, 'triangle', 0.25, 0.15, 0.16);
    }

    wrong() {
        if (!this.enabled) return;
        this.playTone(220, 'sawtooth', 0.2, 0.08, 0);
        this.playTone(180, 'sawtooth', 0.3, 0.08, 0.1);
    }

    star() {
        if (!this.enabled) return;
        this.playTone(523.25, 'sine', 0.12, 0.12, 0); // C5
        this.playTone(659.25, 'sine', 0.12, 0.12, 0.08); // E5
        this.playTone(783.99, 'sine', 0.2, 0.14, 0.16); // G5
    }

    victory() {
        if (!this.enabled) return;
        const notes = [440, 554.37, 659.25, 880]; // A major
        notes.forEach((freq, idx) => {
            this.playTone(freq, 'triangle', 0.25, 0.15, idx * 0.1);
        });
        setTimeout(() => {
            this.playTone(880, 'sine', 0.5, 0.2, 0);
            this.playTone(1108.73, 'sine', 0.6, 0.2, 0.08);
        }, 450);
    }

    defeat() {
        if (!this.enabled) return;
        const notes = [330, 311.13, 293.66, 261.63];
        notes.forEach((freq, idx) => {
            this.playTone(freq, 'sawtooth', 0.3, 0.08, idx * 0.15);
        });
    }

    levelSelect() {
        this.playTone(520, 'sine', 0.1, 0.1, 0);
        this.playTone(680, 'sine', 0.15, 0.12, 0.06);
    }
}

var soundManager = new SoundFX();
if (typeof window !== 'undefined') {
    window.SoundFX = SoundFX;
    window.soundManager = soundManager;
}
