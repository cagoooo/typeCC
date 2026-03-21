class GameAudio {
    constructor() {
        this.ctx = null;
        this.bgmAudio = new Audio();
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.25; // 背景樂音量適中
        this.tracks = [
            "./bgm/bgm1.mp3",
            "./bgm/bgm2.mp3"
        ];
    }

    playRandomBGM() {
        const randomIndex = Math.floor(Math.random() * this.tracks.length);
        this.bgmAudio.src = this.tracks[randomIndex];
        this.bgmAudio.play().catch(e => console.log('BGM 播放被瀏覽器阻擋: ', e));
    }

    stopBGM() {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // 擊落音效 (清脆的高頻音)
    playHit() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // 倒數音效 (短促的滴答)
    playTick() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // 遊戲結束音效 (下降長音)
    playGameOver() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 1.5);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
}

export const audio = new GameAudio();
