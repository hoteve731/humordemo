// Audio System using Tone.js

class AudioSystem {
    constructor() {
        this.initialized = false;
        this.bpm = 130;
        this.synths = {};
        this.samples = {};
    }

    async init() {
        if (this.initialized) return;

        await Tone.start();
        Tone.Transport.bpm.value = this.bpm;

        // Create synths for different sounds
        this.synths.blip = new Tone.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();

        this.synths.bass = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 }
        }).toDestination();

        this.synths.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
        }).toDestination();

        this.synths.hihat = new Tone.MetalSynth({
            frequency: 200,
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        this.synths.hihat.volume.value = -10;

        // Digital noise for math puzzle
        this.synths.digital = new Tone.FMSynth({
            harmonicity: 8,
            modulationIndex: 2,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
            modulation: { type: 'square' },
            modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
        }).toDestination();
        this.synths.digital.volume.value = -15;

        // Clap sound for puzzle
        this.synths.clap = new Tone.NoiseSynth({
            noise: { type: 'pink' },
            envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 }
        }).toDestination();

        // Success sound
        this.synths.success = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.5 }
        }).toDestination();

        this.initialized = true;
    }

    // 8-bit blip for maze turns
    playBlip(pitch = 'C5') {
        if (!this.initialized) return;
        const notes = ['C5', 'E5', 'G5', 'B5', 'C6'];
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.synths.blip.triggerAttackRelease(note, '16n');
    }

    // Bass for maze obstacle
    playBass() {
        if (!this.initialized) return;
        this.synths.bass.triggerAttackRelease('C2', '8n');
    }

    // Snare for puzzle
    playSnare() {
        if (!this.initialized) return;
        this.synths.snare.triggerAttackRelease('8n');
    }

    // Hi-hat for math
    playHihat() {
        if (!this.initialized) return;
        this.synths.hihat.triggerAttackRelease('C6', '32n');
    }

    // Digital noise for matrix effect
    playDigital() {
        if (!this.initialized) return;
        const notes = ['C3', 'D#3', 'G3', 'A#3'];
        this.synths.digital.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], '16n');
    }

    // Clap for puzzle pieces
    playClap() {
        if (!this.initialized) return;
        this.synths.clap.triggerAttackRelease('8n');
    }

    // Success fanfare
    playSuccess() {
        if (!this.initialized) return;
        const now = Tone.now();
        this.synths.success.triggerAttackRelease(['C4', 'E4', 'G4'], 0.3, now);
        this.synths.success.triggerAttackRelease(['E4', 'G4', 'C5'], 0.3, now + 0.15);
    }

    // Start transport for sequenced playback
    startTransport() {
        Tone.Transport.start();
    }

    stopTransport() {
        Tone.Transport.stop();
    }

    // Schedule a callback on beat
    scheduleOnBeat(callback, subdivision = '4n') {
        return Tone.Transport.scheduleRepeat(callback, subdivision);
    }

    clearSchedule(id) {
        Tone.Transport.clear(id);
    }
}

// Global audio instance
const audioSystem = new AudioSystem();
