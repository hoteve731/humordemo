// DE-BUGGING Audio System
// Tone.js 기반 사운드 효과

class AudioSystem {
    constructor() {
        this.initialized = false;
        this.synths = {};
        this.loops = {};
    }

    async init() {
        if (this.initialized) return;

        await Tone.start();

        // 키보드 타이핑 사운드
        this.synths.key = new Tone.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 }
        }).toDestination();
        this.synths.key.volume.value = -20;

        // Blip 사운드 (명령어 실행)
        this.synths.blip = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        this.synths.blip.volume.value = -10;

        // 성공 사운드
        this.synths.success = new Tone.PolySynth(Tone.Synth).toDestination();
        this.synths.success.volume.value = -12;

        // 에러 사운드
        this.synths.error = new Tone.Synth({
            oscillator: { type: 'sawtooth' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
        }).toDestination();
        this.synths.error.volume.value = -8;

        // BEEP 사운드 (블루스크린용)
        this.synths.beep = new Tone.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.5 }
        }).toDestination();
        this.synths.beep.volume.value = -5;

        // 팬 소음 (노이즈)
        this.synths.fan = new Tone.Noise('brown').toDestination();
        this.synths.fan.volume.value = -30;

        // 무한루프 "ㅋ" 사운드
        this.synths.lol = new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 }
        }).toDestination();
        this.synths.lol.volume.value = -15;

        // 벽 충돌 사운드
        this.synths.bump = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 2,
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        this.synths.bump.volume.value = -15;

        // 선택 사운드
        this.synths.select = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        this.synths.select.volume.value = -12;

        this.initialized = true;
    }

    // 안전하게 사운드 재생 (타이밍 에러 방지)
    _safePlay(fn) {
        if (!this.initialized) return;
        try {
            fn();
        } catch (e) {
            // Tone.js 타이밍 에러 무시
        }
    }

    // 키 입력 사운드
    playKey() {
        this._safePlay(() => this.synths.key.triggerAttackRelease('C6', '32n', Tone.now()));
    }

    // 명령어 실행 blip
    playBlip() {
        this._safePlay(() => this.synths.blip.triggerAttackRelease('G5', '16n', Tone.now()));
    }

    // 성공
    playSuccess() {
        this._safePlay(() => this.synths.success.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', Tone.now()));
    }

    // 에러
    playError() {
        this._safePlay(() => this.synths.error.triggerAttackRelease('C2', '8n', Tone.now()));
    }

    // 블루스크린 BEEP
    playBeep(duration = 3) {
        this._safePlay(() => this.synths.beep.triggerAttackRelease('A4', duration, Tone.now()));
    }

    // BEEP 중단
    stopBeep() {
        this._safePlay(() => this.synths.beep.triggerRelease(Tone.now()));
    }

    // 팬 소음 시작
    startFan() {
        this._safePlay(() => this.synths.fan.start());
    }

    // 팬 소음 중단
    stopFan() {
        this._safePlay(() => this.synths.fan.stop());
    }

    // 무한 루프 "ㅋ"
    playLol() {
        this._safePlay(() => {
            const notes = ['C5', 'E5', 'G5', 'C6'];
            const note = notes[Math.floor(Math.random() * notes.length)];
            this.synths.lol.triggerAttackRelease(note, '32n', Tone.now());
        });
    }

    // 벽 충돌
    playBump() {
        this._safePlay(() => this.synths.bump.triggerAttackRelease('C2', '16n', Tone.now()));
    }

    // 선택 이동
    playSelect() {
        this._safePlay(() => this.synths.select.triggerAttackRelease('E5', '32n', Tone.now()));
    }

    // 확정 선택
    playConfirm() {
        this._safePlay(() => {
            this.synths.blip.triggerAttackRelease('C5', '8n', Tone.now());
            setTimeout(() => {
                this._safePlay(() => this.synths.blip.triggerAttackRelease('G5', '8n', Tone.now()));
            }, 100);
        });
    }

    // Agent 이동 사운드
    playMove() {
        this._safePlay(() => this.synths.select.triggerAttackRelease('G4', '32n', Tone.now()));
    }

    // 도착 사운드
    playArrive() {
        this._safePlay(() => this.synths.success.triggerAttackRelease(['E4', 'G4', 'C5'], '4n', Tone.now()));
    }

    // 생각 중 사운드
    playThink() {
        this._safePlay(() => {
            const notes = ['D4', 'F4', 'A4', 'C5'];
            const note = notes[Math.floor(Math.random() * notes.length)];
            this.synths.select.triggerAttackRelease(note, '4n', Tone.now());
        });
    }
}

// 전역 오디오 시스템
const audioSystem = new AudioSystem();
