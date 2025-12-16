// DE-BUGGING Terminal System
// 자유 입력 + 명령어 처리 시스템

class Terminal {
    constructor() {
        this.container = document.getElementById('terminal-content');
        this.input = document.getElementById('terminal-input');
        this.placeholder = document.getElementById('input-placeholder');
        this.statusEl = document.getElementById('terminal-status');

        this.commands = {};  // 등록된 명령어들
        this.isTyping = false;
        this.typeSpeed = 20;  // ms per character
        this.inputEnabled = true;

        // 공연 순서에 따른 명령어 시퀀스
        this.commandSequence = [
            'start_session_1()',
            'setup_baseline()',
            'run_baseline()',
            'setup_maze()',
            'run_maze()',
            'run_overthink()',
            'setup_zeno()',
            'run_zeno()',
            'start_session_2()',
            'predict("사과는")',
            'predict("나는 아침에 밥을")',
            'predict("아버지가 방에서")',
            'start_session_3()',
            'run_infinite_loop()',
            'kill()',
            'run_deadlock()',
            'run_divide_safe()',
            'run_divide_unsafe()',
            'reset()'
        ];
        this.currentStep = 0;

        this.init();
    }

    init() {
        // 입력 이벤트
        this.input.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.input.addEventListener('input', () => this.onInput());

        // 포커스 유지
        document.addEventListener('click', () => {
            if (this.inputEnabled) {
                this.input.focus();
            }
        });

        this.input.focus();
        this.input.placeholder = '';  // native placeholder 비활성화
        this.updatePlaceholder();
    }

    // 현재 단계에 맞는 플레이스홀더 업데이트
    updatePlaceholder() {
        const nextCommand = this.commandSequence[this.currentStep] || '';
        const currentInput = this.input.value;

        // 입력값이 다음 명령어의 시작과 일치하면 나머지만 표시
        if (currentInput && nextCommand.startsWith(currentInput)) {
            // 입력한 만큼 공백으로 채우고 나머지 표시
            this.placeholder.textContent = ' '.repeat(currentInput.length) + nextCommand.slice(currentInput.length);
        } else if (!currentInput) {
            this.placeholder.textContent = nextCommand;
        } else {
            // 일치하지 않으면 플레이스홀더 숨김
            this.placeholder.textContent = '';
        }
    }

    // 다음 단계로 진행
    advanceStep() {
        if (this.currentStep < this.commandSequence.length - 1) {
            this.currentStep++;
            this.updatePlaceholder();
        }
    }

    // 명령어 등록
    registerCommand(name, callback, description = '') {
        this.commands[name] = { callback, description };
    }

    // 여러 명령어 한번에 등록
    registerCommands(commandMap) {
        for (const [name, handler] of Object.entries(commandMap)) {
            if (typeof handler === 'function') {
                this.commands[name] = { callback: handler, description: '' };
            } else {
                this.commands[name] = handler;
            }
        }
    }

    // 명령어 처리
    onKeyDown(e) {
        if (!this.inputEnabled) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            const inputValue = this.input.value.trim();

            if (inputValue) {
                this.executeCommand(inputValue);
            }
        }

        // Tab 자동완성
        if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }

    async onInput() {
        // 타이핑 사운드 (초기화 안됐으면 초기화 후 재생)
        if (typeof audioSystem !== 'undefined') {
            if (!audioSystem.initialized) {
                await audioSystem.init();
            }
            audioSystem.playKey();
        }
        // 플레이스홀더 업데이트 (입력에 따라 남은 부분만 표시)
        this.updatePlaceholder();
    }

    // 명령어 실행
    async executeCommand(input) {
        // 입력 내용 로그
        this.log(input, 'command');
        this.input.value = '';
        this.updatePlaceholder();

        // 명령어 파싱 (함수 호출 형태: command() 또는 command("arg"))
        const match = input.match(/^(\w+)\s*\(([^)]*)\)$/);

        if (match) {
            const cmdName = match[1];
            const argsStr = match[2].trim();

            // 인자 파싱
            let args = [];
            if (argsStr) {
                // 문자열 인자 처리 ("..." 또는 '...')
                const argMatch = argsStr.match(/^["'](.*)["']$/);
                if (argMatch) {
                    args = [argMatch[1]];
                } else {
                    args = argsStr.split(',').map(a => a.trim());
                }
            }

            // 명령어 찾기
            if (this.commands[cmdName]) {
                this.setStatus('RUNNING');
                try {
                    await this.commands[cmdName].callback(...args);
                    // 성공 시 다음 단계로
                    this.advanceStep();
                } catch (err) {
                    this.log(`Error: ${err.message}`, 'error');
                }
                this.setStatus('READY');
            } else {
                this.log(`Unknown command: ${cmdName}`, 'error');
                this.suggestCommand(cmdName);
            }
        } else if (input === 'help') {
            this.showHelp();
        } else if (input === 'clear') {
            this.clear();
        } else {
            this.log(`Invalid syntax. Use: command() or command("arg")`, 'error');
        }
    }

    // 자동완성
    autocomplete() {
        const partial = this.input.value.trim();

        // 자동완성 사운드
        if (typeof audioSystem !== 'undefined' && audioSystem.initialized) {
            audioSystem.playBlip();
        }

        // 입력이 비어있으면 현재 플레이스홀더(다음 명령어) 자동완성
        if (!partial) {
            const nextCommand = this.commandSequence[this.currentStep];
            if (nextCommand) {
                this.input.value = nextCommand;
                this.updatePlaceholder();
            }
            return;
        }

        const matches = Object.keys(this.commands).filter(cmd =>
            cmd.startsWith(partial)
        );

        if (matches.length === 1) {
            this.input.value = matches[0] + '()';
            this.updatePlaceholder();
        } else if (matches.length > 1) {
            this.log(`Matches: ${matches.join(', ')}`, 'dim');
        }
    }

    // 유사 명령어 제안
    suggestCommand(input) {
        const cmdNames = Object.keys(this.commands);
        const similar = cmdNames.find(cmd =>
            cmd.includes(input) || input.includes(cmd.substring(0, 3))
        );
        if (similar) {
            this.log(`Did you mean: ${similar}()?`, 'dim');
        }
    }

    // 도움말 표시
    showHelp() {
        this.log('Available commands:', 'system');
        for (const [name, cmd] of Object.entries(this.commands)) {
            const desc = cmd.description || '';
            this.log(`  ${name}()${desc ? ' - ' + desc : ''}`, 'dim');
        }
    }

    // 로그 출력 (즉시)
    log(message, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        const prefix = this.getPrefix(type);
        line.textContent = prefix + message;

        this.container.appendChild(line);
        this.scrollToBottom();
    }

    // 타이핑 효과로 출력
    async type(message, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        this.container.appendChild(line);

        const prefix = this.getPrefix(type);
        const fullMessage = prefix + message;

        for (let i = 0; i < fullMessage.length; i++) {
            line.textContent = fullMessage.substring(0, i + 1);
            if (fullMessage[i] !== ' ') {
                // 타이핑 사운드 (초기화 안됐으면 초기화 후 재생)
                if (typeof audioSystem !== 'undefined') {
                    if (!audioSystem.initialized) {
                        await audioSystem.init();
                    }
                    audioSystem.playKey();
                }
                await this.delay(this.typeSpeed);
            }
        }

        this.scrollToBottom();
    }

    // 여러 줄 순차 출력
    async typeSequence(messages, delayBetween = 300) {
        for (const msg of messages) {
            if (typeof msg === 'string') {
                await this.type(msg, 'normal');
            } else {
                await this.type(msg.text, msg.type || 'normal');
            }
            await this.delay(delayBetween);
        }
    }

    // 프리픽스
    getPrefix(type) {
        switch (type) {
            case 'error': return '⚠ ';
            case 'success': return '✓ ';
            case 'system': return '> ';
            case 'dim': return '  ';
            case 'command': return '$ ';
            default: return '';
        }
    }

    // 상태 변경
    setStatus(status) {
        this.statusEl.textContent = status;

        // 상태에 따른 스타일
        this.statusEl.style.borderColor = status === 'RUNNING'
            ? 'var(--accent-yellow)'
            : 'var(--accent-cyan)';
        this.statusEl.style.color = status === 'RUNNING'
            ? 'var(--accent-yellow)'
            : 'var(--accent-cyan)';
    }

    // 입력 활성화/비활성화
    enableInput() {
        this.inputEnabled = true;
        this.input.disabled = false;
        this.input.focus();
    }

    disableInput() {
        this.inputEnabled = false;
        this.input.disabled = true;
    }

    // 클리어
    clear() {
        this.container.innerHTML = '';
    }

    // 스크롤
    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }

    // 딜레이
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 전역 터미널 인스턴스
const terminal = new Terminal();
