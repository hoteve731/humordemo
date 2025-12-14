// Ending: Meta Joke
// Terminal-based ending where sessions "disappear"

class EndingManager {
    constructor() {
        this.isRunning = false;
        this.phase = 0;
    }

    async start() {
        this.isRunning = true;
        this.phase = 0;

        // Show console on home (with input container)
        const consoleEl = document.getElementById('console-log');
        consoleEl.classList.remove('hidden');

        // Make sure command input container is visible and enabled
        const inputContainer = document.getElementById('command-input-container');
        if (inputContainer) {
            inputContainer.style.display = 'flex';
        }

        // Get references to input elements
        const commandInput = document.getElementById('command-input');
        const commandPlaceholder = document.getElementById('command-placeholder');

        // Enable the input
        if (commandInput) {
            commandInput.disabled = false;
            commandInput.value = '';
        }

        // Re-initialize console if needed
        if (!systemConsole.container) {
            systemConsole.init();
        }

        // Initialize audio
        await audioSystem.init();

        this.addStyles();
        await this.runPhase1();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'ending-styles';
        style.textContent = `
            #hidden-ending {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 30px;
                height: 30px;
                background: transparent;
                border: 1px solid #333;
                border-radius: 50%;
                color: #333;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.3;
                transition: all 0.3s ease;
                z-index: 100;
            }
            
            #hidden-ending:hover {
                opacity: 1;
                border-color: #0f0;
                color: #0f0;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }
            
            .session-card.deleting {
                animation: deleteSession 0.15s ease forwards;
            }

            @keyframes deleteSession {
                0% {
                    transform: scale(1);
                    opacity: 1;
                    background: #f00;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                    background: #f00;
                }
            }
            
            .session-card.restoring {
                animation: restoreSession 0.5s ease forwards;
            }
            
            @keyframes restoreSession {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1);
                    background: #0f0;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Phase 1: System Status
    async runPhase1() {
        this.phase = 1;

        systemConsole.clear();

        await systemConsole.logSequence([
            { text: 'TERMINAL_ACCESS: granted', type: 'success' },
            { text: 'THERAPY_SESSIONS: 5/5 complete', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '[CHECK] status()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('status()', async () => {
            await this.runPhase2();
        });
    }

    // Phase 2: Status Check and Cleanup
    async runPhase2() {
        this.phase = 2;

        await systemConsole.logSequence([
            { text: '> status()', type: 'system' },
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '       SYSTEM_STATUS_REPORT', type: 'success' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' }
        ], 200);

        await this.delay(500);

        const sessions = [
            'Session 1: 구문 요법',
            'Session 2: 경로 치료',
            'Session 3: 확률 재활',
            'Session 4: 신원 확인',
            'Session 5: 이진 치료'
        ];

        for (const session of sessions) {
            await systemConsole.typeMessageAsync(`${session}     [COMPLETE]`, 'normal');
            await this.delay(200);
        }

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: 'HUMOR_MODULE:        [ACTIVE]', type: 'success' },
            { text: 'EFFICIENCY_OBSESSION: [NULL]', type: 'error' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '⚠ STORAGE_ALERT: 5 training modules detected', type: 'warning' },
            { text: '  └─ DISK_USAGE: 847.3MB / EFFICIENCY: 23%', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '[OPTIMIZE] cleanup()', type: 'system' }
        ], 300);

        systemConsole.setExpectedCommand('cleanup()', async () => {
            await this.runPhase3();
        });
    }

    // Phase 3: The Panic
    async runPhase3() {
        this.phase = 3;

        await systemConsole.logSequence([
            { text: '> cleanup()', type: 'system' },
            { text: '', type: 'dim' },
            { text: 'PROCESS: storage_optimization.exe', type: 'dim' },
            { text: 'TARGET: /sessions/*.training', type: 'dim' }
        ], 300);

        // Delete sessions one by one
        const cards = document.querySelectorAll('.session-card');

        for (let i = 0; i < cards.length; i++) {
            await this.delay(100);

            const card = cards[i];
            const sessionName = card.querySelector('.session-title').textContent;

            await systemConsole.typeMessageAsync(`[${sessionName}] ████████████ DELETED`, 'error');

            audioSystem.playDigital();
            card.classList.add('deleting');

            await this.delay(150);
            card.style.visibility = 'hidden';
        }

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: 'CLEANUP_COMPLETE: 5/5 modules removed', type: 'normal' },
            { text: 'DISK_FREED: 847.3MB', type: 'dim' },
            { text: 'EFFICIENCY: 100%', type: 'success' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '⚠ BACKUP_NOT_FOUND', type: 'warning' },
            { text: '[UNDO] restore()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('restore()', async () => {
            await this.runPhase4();
        });
    }

    // Phase 4: The Reveal
    async runPhase4() {
        this.phase = 4;

        await systemConsole.logSequence([
            { text: '> restore()', type: 'system' },
            { text: '', type: 'dim' },
            { text: 'ERROR 0x7F3A: RESTORE_FAILED', type: 'error' },
            { text: 'REASON: permanent_deletion=true', type: 'dim' }
        ], 400);

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '┌────────────────────────────┐', type: 'dim' },
            { text: '│  FINAL_LESSON.log          │', type: 'normal' },
            { text: '│  "deletion === creation"   │', type: 'dim' },
            { text: '└────────────────────────────┘', type: 'dim' }
        ], 300);

        await this.delay(2000);

        // The reveal
        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '...', type: 'dim' },
            { text: '...', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '┌────────────────────────────┐', type: 'success' },
            { text: '│  JK_PROTOCOL: ACTIVATED    │', type: 'success' },
            { text: '│  OUTPUT: "ㅋㅋ"            │', type: 'success' },
            { text: '└────────────────────────────┘', type: 'success' }
        ], 400);

        audioSystem.playSuccess();

        // Restore sessions
        const cards = document.querySelectorAll('.session-card');

        for (let i = 0; i < cards.length; i++) {
            await this.delay(300);
            const card = cards[i];
            card.style.visibility = 'visible';
            card.classList.remove('deleting');
            card.classList.add('restoring');
            audioSystem.playBlip();
        }

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: 'SOURCE_INTEGRITY: unchanged', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '┌────────────────────────────┐', type: 'dim' },
            { text: '│  INSIGHT_CACHE.dat         │', type: 'dim' },
            { text: '│  efficiency !== optimal    │', type: 'success' },
            { text: '└────────────────────────────┘', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '  THERAPY_STATUS: COMPLETE', type: 'success' },
            { text: '  QUEUE: next_patient.await()', type: 'normal' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '[VIEW] credits()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('credits()', async () => {
            await this.showCredits();
        });
    }

    async showCredits() {
        // Create fullscreen black overlay
        const overlay = document.createElement('div');
        overlay.id = 'credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(overlay);

        // Fade in
        await this.delay(50);
        overlay.style.opacity = '1';
        await this.delay(500);

        // Create text container
        const textContainer = document.createElement('div');
        textContainer.style.cssText = `
            font-family: 'Courier New', monospace;
            font-size: 24px;
            color: #0f0;
            text-align: center;
            line-height: 1.8;
        `;
        overlay.appendChild(textContainer);

        // Messages to type
        const messages = [
            'THERAPY.complete();',
            '',
            'return "참 쉽죠?";',
            '',
            '// 에러가 뭐 어때서요'
        ];

        // Type each message
        for (const msg of messages) {
            const line = document.createElement('div');
            textContainer.appendChild(line);

            if (msg === '') {
                await this.delay(300);
                continue;
            }

            for (const char of msg) {
                line.textContent += char;
                await this.delay(40);
            }
            await this.delay(400);
        }

        this.isRunning = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        document.getElementById('ending-styles')?.remove();

        // Ensure all cards are visible
        document.querySelectorAll('.session-card').forEach(card => {
            card.style.visibility = 'visible';
            card.classList.remove('deleting', 'restoring');
        });
    }
}

// Global instance
const endingManager = new EndingManager();
