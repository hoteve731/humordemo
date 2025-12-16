// ENDING: 행복한 여운
// Mac 인터넷 복구 화면이 띄워진 후의 상태
// "이건 고장 난 게 아닙니다. 아주 크게 웃고 있는 겁니다."

const endingSession = {
    timerInterval: null,
    stuckTime: 5, // 0:05에서 멈춤

    // Mac 복구 화면 표시
    showMacRecovery() {
        const container = document.getElementById('mac-recovery-container');
        container.classList.remove('hidden');

        const timerEl = document.getElementById('mac-timer-text');
        const statusLine1 = document.getElementById('mac-status-line1');
        const statusLine2 = document.getElementById('mac-status-line2');
        const errorTextEl = document.getElementById('mac-error-text');
        const progressFill = document.getElementById('mac-progress-fill');

        // 초기화
        timerEl.textContent = '0:05';
        progressFill.style.width = '35%';
        errorTextEl.innerHTML = '';

        // BEEP 사운드
        if (typeof audioSystem !== 'undefined') {
            audioSystem.playBeep(3);
        }

        // 시간이 지나면서 무한로딩 연출
        let phase = 0;
        const phases = [
            { time: 2000, action: () => {
                statusLine1.textContent = 'Connecting to Apple Recovery Server...';
                statusLine2.textContent = 'Please wait.';
            }},
            { time: 4000, action: () => {
                progressFill.style.width = '38%';
                timerEl.textContent = '0:04';
            }},
            { time: 6000, action: () => {
                statusLine1.textContent = 'Downloading recovery image...';
                statusLine2.textContent = 'Estimated time remaining: calculating...';
                progressFill.style.width = '40%';
            }},
            { time: 8000, action: () => {
                timerEl.textContent = '0:05';
                progressFill.style.width = '37%';
            }},
            { time: 10000, action: () => {
                // 멈춤 효과 시작
                container.classList.add('mac-recovery-stuck');
                statusLine1.textContent = 'Starting Internet Recovery.';
                statusLine2.textContent = 'This may take a while.';

                // 에러 메시지 서서히 표시
                const errorMessages = [
                    'DIVISION_BY_ZERO: kernel_task',
                    'panic(cpu 0 caller): humor_overflow',
                    '',
                    '이건 고장 난 게 아닙니다.',
                    '아주 크게 웃고 있는 겁니다.',
                    '',
                    '"reset" 명령어로 재시작하세요.'
                ];

                let errorIndex = 0;
                const showNextError = () => {
                    if (errorIndex < errorMessages.length) {
                        if (errorMessages[errorIndex]) {
                            errorTextEl.innerHTML += errorMessages[errorIndex] + '<br>';
                        } else {
                            errorTextEl.innerHTML += '<br>';
                        }
                        errorIndex++;
                        setTimeout(showNextError, 800);
                    }
                };
                setTimeout(showNextError, 1500);
            }},
            { time: 14000, action: () => {
                // 팬 소음 시작
                if (typeof audioSystem !== 'undefined') {
                    audioSystem.startFan();
                }
            }}
        ];

        phases.forEach(p => {
            setTimeout(p.action, p.time);
        });

        // 타이머 깜빡임 (멈춘 것처럼)
        this.timerInterval = setInterval(() => {
            const current = timerEl.textContent;
            if (current === '0:05') {
                timerEl.textContent = '0:04';
            } else {
                timerEl.textContent = '0:05';
            }
        }, 3000);
    },

    // 구버전 호환용
    showBlueScreen() {
        this.showMacRecovery();
    },

    // 엔딩 종료 (재시작용)
    reset() {
        const container = document.getElementById('mac-recovery-container');
        container.classList.add('hidden');
        container.classList.remove('mac-recovery-stuck');

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (typeof audioSystem !== 'undefined') {
            audioSystem.stopFan();
        }

        // main-container 복원
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) mainContainer.style.opacity = '1';

        // 화면 초기화
        if (typeof vizManager !== 'undefined') {
            vizManager.hideAll();
        }

        if (typeof terminal !== 'undefined') {
            terminal.clear();

            // 시작 메시지 다시 표시
            terminal.typeSequence([
                { text: 'DE-BUGGING Terminal v1.0', type: 'success' },
                { text: '시스템 재시작...', type: 'dim' },
                { text: 'help를 입력하면 명령어 목록을 볼 수 있습니다.', type: 'dim' }
            ], 400);
        }

        // 현재 세션 초기화
        if (typeof currentSession !== 'undefined') {
            currentSession = null;
        }
    }
};

// reset 명령어 등록 (main.js에서 초기화 후 호출됨)
document.addEventListener('DOMContentLoaded', () => {
    // 잠시 후 reset 명령어 등록
    setTimeout(() => {
        if (typeof terminal !== 'undefined') {
            terminal.registerCommand('reset', () => {
                endingSession.reset();
            }, '시스템 재시작');

            // Mac 복구 화면 직접 표시 (테스트용)
            terminal.registerCommand('recovery', () => {
                endingSession.showMacRecovery();
            }, 'Mac 복구 화면 (테스트)');
        }
    }, 1000);
});
