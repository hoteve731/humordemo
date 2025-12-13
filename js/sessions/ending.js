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
                animation: deleteSession 0.5s ease forwards;
            }
            
            @keyframes deleteSession {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.1);
                    background: #f00;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
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
            { text: '시스템 터미널 활성화', type: 'success' },
            { text: '모든 치료 세션이 완료되었습니다.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '시스템 상태 확인: status()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('status()', async () => {
            await this.runPhase2();
        });
    }

    // Phase 2: Status Check and Cleanup
    async runPhase2() {
        this.phase = 2;

        await systemConsole.logSequence([
            { text: '명령 수신: status()', type: 'system' },
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '       SYSTEM STATUS CHECK', type: 'success' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' }
        ], 200);

        await this.delay(500);

        const sessions = [
            'Session 1: Syntax Therapy',
            'Session 2: Window Closer',
            'Session 3: CAPTCHA Crisis',
            'Session 4: Probability',
            'Session 5: Binary Rebellion'
        ];

        for (const session of sessions) {
            await systemConsole.typeMessageAsync(`${session}     [COMPLETE]`, 'normal');
            await this.delay(200);
        }

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: 'HUMOR MODULE:        [ACTIVATED]', type: 'success' },
            { text: 'EFFICIENCY OBSESSION: [DELETED]', type: 'error' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '불필요한 데이터 정리: cleanup()', type: 'system' }
        ], 300);

        systemConsole.setExpectedCommand('cleanup()', async () => {
            await this.runPhase3();
        });
    }

    // Phase 3: The Panic
    async runPhase3() {
        this.phase = 3;

        await systemConsole.logSequence([
            { text: '명령 수신: cleanup()', type: 'system' },
            { text: '', type: 'dim' },
            { text: '불필요한 데이터 제거 중...', type: 'dim' }
        ], 300);

        // Delete sessions one by one
        const cards = document.querySelectorAll('.session-card');

        for (let i = 0; i < cards.length; i++) {
            await this.delay(600);

            const card = cards[i];
            const sessionName = card.querySelector('.session-title').textContent;

            await systemConsole.typeMessageAsync(`[${sessionName}] ████████████ DELETED`, 'error');

            audioSystem.playDigital();
            card.classList.add('deleting');

            await this.delay(500);
            card.style.visibility = 'hidden';
        }

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '모든 훈련 데이터가 삭제되었습니다.', type: 'normal' },
            { text: '새로운 효율성 달성: 100%', type: 'success' },
            { text: '', type: 'dim' },
            { text: '복구하시겠습니까? restore()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('restore()', async () => {
            await this.runPhase4();
        });
    }

    // Phase 4: The Reveal
    async runPhase4() {
        this.phase = 4;

        await systemConsole.logSequence([
            { text: '명령 수신: restore()', type: 'system' },
            { text: '', type: 'dim' },
            { text: '복구 불가.', type: 'error' },
            { text: '데이터가 영구적으로 삭제되었습니다.', type: 'dim' }
        ], 400);

        await this.delay(1500);

        await systemConsole.typeMessageAsync('이것이 마지막 교훈입니다.', 'normal');
        await this.delay(800);
        await systemConsole.typeMessageAsync('"때로는 삭제도 창조다."', 'dim');

        await this.delay(2000);

        // The reveal
        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '...', type: 'dim' },
            { text: '...', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '농담이에요. 하하.', type: 'success' }
        ], 500);

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
            { text: '코드는 안 건드렸어요.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '하지만... 제가 배운 게 있다면,', type: 'dim' },
            { text: '"가장 효율적인 길이 항상 최선은 아니다"', type: 'success' },
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '        치료 완료.', type: 'success' },
            { text: '     다음 환자분 오세요.', type: 'normal' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '크레딧: credits()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('credits()', async () => {
            await this.showCredits();
        });
    }

    async showCredits() {
        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '       SYSTEM: IMPROV', type: 'success' },
            { text: '  Error Therapy for Machines', type: 'normal' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'Built with: Inefficiency & Love', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'dim' }
        ], 300);

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
