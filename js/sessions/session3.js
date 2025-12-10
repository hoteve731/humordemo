// Session 3: Logic Bypass
// "The Punchline is Simplicity" - The Vault Demo with Lock Installation Sequence

class Session3Manager {
    constructor() {
        this.isRunning = false;
        this.hackingPhase = 0;
        this.hackingInterval = null;
        this.visualEffects = [];
        this.vaultSpawned = false;
        this.vaultOpened = false;
        this.wheelRotation = 0;
        this.installedLocks = [];
        this.lockInstallationPhase = 0;
    }

    async start() {
        this.isRunning = true;
        this.hackingPhase = 0;
        this.vaultSpawned = false;
        this.vaultOpened = false;
        this.installedLocks = [];
        this.lockInstallationPhase = 0;

        await systemConsole.logSequence([
            { text: '로직 우회 치료 세션 시작', type: 'success' },
            { text: '보안 시스템 분석 모듈 로딩...', type: 'dim' },
            { text: '금고 시스템 대기 중...', type: 'normal' }
        ], 400);

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '진단: 과잉 연산 강박 - "모든 문제에 복잡한 해결책"', type: 'error' },
            { text: '치료 목표: 단순함의 아름다움 발견하기', type: 'normal' },
            { text: '', type: 'dim' }
        ], 400);

        await this.delay(500);

        await systemConsole.typeMessageAsync('금고를 소환하려면 명령어를 입력하세요:', 'system');

        systemConsole.setExpectedCommand('spawn_vault()', () => {
            this.spawnVault();
        });
    }

    async spawnVault() {
        this.vaultSpawned = true;

        await systemConsole.logSequence([
            { text: '명령 수신: spawn_vault()', type: 'system' },
            { text: '금고 인스턴스 생성 중...', type: 'dim' }
        ], 300);

        // Create basic vault UI (without locks initially)
        this.createBasicVaultUI();

        // Animate vault appearance
        await this.animateVaultAppear();

        await systemConsole.logSequence([
            { text: '기본 금고 생성 완료.', type: 'normal' },
            { text: '현재 보안 레벨: 없음 (빈 금고)', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '잠금장치를 추가하여 보안을 강화하세요.', type: 'system' }
        ], 400);

        await this.delay(500);

        // Start lock installation sequence
        await this.promptLockInstallation();
    }

    createBasicVaultUI() {
        const vaultContainer = document.createElement('div');
        vaultContainer.id = 'vault-container';
        vaultContainer.innerHTML = `
            <div id="vault" class="vault-hidden">
                <div id="vault-frame">
                    <div id="vault-door">
                        <!-- Lock components will be added dynamically -->
                        <div id="lock-components"></div>
                        <div id="vault-handle-placeholder" class="hidden"></div>
                    </div>
                    <div id="vault-interior">
                        <div class="interior-shelf">
                            <span class="treasure-item gold-bar">🪙</span>
                            <span class="treasure-item gem">💎</span>
                            <span class="treasure-item crown">👑</span>
                        </div>
                        <div class="interior-main">
                            <span class="treasure-item trophy">🏆</span>
                            <span class="sparkle s1">✨</span>
                            <span class="sparkle s2">⭐</span>
                        </div>
                        <div class="interior-bottom">
                            <span class="treasure-item money">💰</span>
                            <span class="treasure-item docs">📜</span>
                        </div>
                        <div class="interior-note">"사실 열려있었음 ㅋ"</div>
                    </div>
                </div>
            </div>
            
            <div id="hacking-overlay" class="hidden">
                <div id="hacking-visual"></div>
                <div id="hacking-status">
                    <div id="current-attack"></div>
                    <div id="attack-progress">
                        <div id="attack-bar"></div>
                    </div>
                    <div id="attack-detail"></div>
                </div>
            </div>
            
            <div id="security-level">
                <div class="security-header">보안 레벨</div>
                <div id="security-bars"></div>
                <div id="security-text">없음</div>
            </div>
            
            <button id="simple-solution" class="hidden">🤔 혹시... 그냥 열어볼까?</button>
        `;
        document.body.appendChild(vaultContainer);

        document.getElementById('simple-solution').addEventListener('click', () => {
            this.simpleSolution();
        });

        this.addStyles();
    }

    async animateVaultAppear() {
        const vault = document.getElementById('vault');
        await this.delay(100);
        vault.classList.remove('vault-hidden');
        vault.classList.add('vault-appear');
        audioSystem.playBass();
        await this.delay(600);
    }

    async promptLockInstallation() {
        const locks = [
            {
                command: 'add_keypad()',
                name: '키패드',
                description: '6자리 숫자 잠금장치',
                element: this.createKeypadElement()
            },
            {
                command: 'add_dial()',
                name: '다이얼',
                description: '회전식 조합 자물쇠',
                element: this.createDialElement()
            },
            {
                command: 'add_handle()',
                name: '손잡이',
                description: '물리적 잠금 레버',
                element: this.createHandleElement()
            },
            {
                command: 'add_lockbars()',
                name: '잠금 볼트',
                description: '3중 강철 볼트',
                element: this.createLockBarsElement()
            },
            {
                command: 'add_hinges()',
                name: '보안 경첩',
                description: '강화 경첩 시스템',
                element: this.createHingesElement()
            }
        ];

        this.lockInstallationPhase = 0;
        await this.installNextLock(locks);
    }

    async installNextLock(locks) {
        if (this.lockInstallationPhase >= locks.length) {
            // All locks installed, start hacking
            await this.allLocksInstalled();
            return;
        }

        const lock = locks[this.lockInstallationPhase];

        await systemConsole.typeMessageAsync(`다음 잠금장치: ${lock.name} (${lock.description})`, 'normal');
        await systemConsole.typeMessageAsync(`명령어 입력: ${lock.command}`, 'system');

        systemConsole.setExpectedCommand(lock.command, async () => {
            await this.addLockComponent(lock);
            this.lockInstallationPhase++;

            // Update security level display
            this.updateSecurityLevel();

            await this.delay(500);
            await this.installNextLock(locks);
        });
    }

    async addLockComponent(lock) {
        await systemConsole.logSequence([
            { text: `명령 수신: ${lock.command}`, type: 'system' },
            { text: `${lock.name} 설치 중...`, type: 'dim' }
        ], 200);

        const container = document.getElementById('lock-components');
        const element = lock.element;
        element.classList.add('lock-installing');
        container.appendChild(element);

        // Animate installation
        await this.delay(100);
        element.classList.remove('lock-installing');
        element.classList.add('lock-installed');

        audioSystem.playSuccess();

        await systemConsole.typeMessageAsync(`✓ ${lock.name} 설치 완료!`, 'success');
        this.installedLocks.push(lock.name);
    }

    createKeypadElement() {
        const div = document.createElement('div');
        div.id = 'vault-keypad';
        div.innerHTML = `
            <div class="keypad-screen">████████</div>
            <div class="keypad-keys">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(k =>
            `<div class="keypad-key">${k}</div>`
        ).join('')}
            </div>
        `;
        return div;
    }

    createDialElement() {
        const div = document.createElement('div');
        div.id = 'vault-wheel';
        div.innerHTML = `
            <div class="wheel-spoke"></div>
            <div class="wheel-spoke"></div>
            <div class="wheel-spoke"></div>
            <div class="wheel-center"></div>
        `;
        return div;
    }

    createHandleElement() {
        const div = document.createElement('div');
        div.id = 'vault-handle';
        div.className = 'interactive-handle';
        return div;
    }

    createLockBarsElement() {
        const div = document.createElement('div');
        div.id = 'vault-lockbars';
        div.innerHTML = `
            <div class="lock-bar-set">
                <div class="lock-bar"></div>
                <div class="lock-bar"></div>
                <div class="lock-bar"></div>
            </div>
        `;
        return div;
    }

    createHingesElement() {
        const div = document.createElement('div');
        div.id = 'vault-hinges';
        div.innerHTML = `
            <div class="hinge top-hinge"></div>
            <div class="hinge middle-hinge"></div>
            <div class="hinge bottom-hinge"></div>
        `;
        return div;
    }

    updateSecurityLevel() {
        const barsContainer = document.getElementById('security-bars');
        const textEl = document.getElementById('security-text');

        barsContainer.innerHTML = '';

        const levels = ['없음', '낮음', '보통', '높음', '매우 높음', 'OMEGA'];
        const colors = ['#555', '#4a9', '#f59e0b', '#ef4444', '#a855f7', '#ff3366'];

        const level = this.installedLocks.length;

        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'security-bar';
            bar.style.background = i < level ? colors[level] : '#333';
            bar.style.boxShadow = i < level ? `0 0 10px ${colors[level]}` : 'none';
            barsContainer.appendChild(bar);
        }

        textEl.textContent = levels[level];
        textEl.style.color = colors[level];
    }

    async allLocksInstalled() {
        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '═══════════════════════════════════', type: 'dim' },
            { text: '모든 잠금장치 설치 완료!', type: 'success' },
            { text: `설치된 보안: ${this.installedLocks.join(', ')}`, type: 'normal' },
            { text: '보안 레벨: OMEGA (최고 등급)', type: 'error' },
            { text: '═══════════════════════════════════', type: 'dim' }
        ], 300);

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: 'AI가 자동으로 해킹을 시작합니다...', type: 'system' },
            { text: '복잡성 분석 중... 이것은 시간이 걸릴 것입니다.', type: 'dim' }
        ], 400);

        document.getElementById('hacking-overlay').classList.remove('hidden');

        await this.delay(800);

        this.startHackingSequence();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'session3-styles';
        style.textContent = `
            #vault-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1400;
                pointer-events: none;
            }
            
            #vault {
                position: relative;
                transform-style: preserve-3d;
                perspective: 1000px;
            }
            
            #vault.vault-hidden {
                opacity: 0;
                transform: scale(0.5);
            }
            
            #vault.vault-appear {
                opacity: 1;
                transform: scale(1);
                transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            #vault-frame {
                width: 400px;
                height: 450px;
                background: linear-gradient(145deg, #3a3a4a 0%, #1a1a2a 100%);
                border: 10px solid #555;
                border-radius: 20px;
                position: relative;
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.8),
                    inset 0 0 50px rgba(0, 0, 0, 0.5),
                    0 0 0 3px #222;
            }
            
            #vault-door {
                position: absolute;
                top: 15px;
                left: 15px;
                right: 15px;
                bottom: 15px;
                background: linear-gradient(145deg, #666 0%, #444 50%, #333 100%);
                border-radius: 12px;
                border: 5px solid #777;
                transform-origin: left center;
                transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
            }
            
            #vault.vault-open #vault-door {
                transform: perspective(800px) rotateY(-110deg);
                box-shadow: -20px 0 40px rgba(0,0,0,0.5);
            }
            
            #lock-components {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            
            .lock-installing {
                opacity: 0;
                transform: scale(0.5);
            }
            
            .lock-installed {
                opacity: 1;
                transform: scale(1);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            #vault-interior {
                position: absolute;
                top: 15px;
                left: 15px;
                right: 15px;
                bottom: 15px;
                background: linear-gradient(180deg, #0a0a15 0%, #151525 100%);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                z-index: -1;
            }
            
            .interior-shelf {
                display: flex;
                gap: 20px;
                justify-content: center;
            }
            
            .interior-main {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .interior-bottom {
                display: flex;
                gap: 30px;
                justify-content: center;
            }
            
            .treasure-item {
                font-size: 40px;
                filter: drop-shadow(0 0 15px rgba(255,215,0,0.5));
                animation: float 3s ease-in-out infinite;
            }
            
            .treasure-item.trophy {
                font-size: 80px;
                filter: drop-shadow(0 0 30px gold);
            }
            
            .treasure-item.gold-bar { animation-delay: 0s; }
            .treasure-item.gem { animation-delay: 0.3s; }
            .treasure-item.crown { animation-delay: 0.6s; }
            .treasure-item.money { animation-delay: 0.9s; }
            .treasure-item.docs { animation-delay: 1.2s; }
            
            #vault-interior .sparkle {
                position: absolute;
                font-size: 25px;
                animation: sparkle 1.5s ease-in-out infinite;
            }
            
            .sparkle.s1 { top: -20px; right: -30px; }
            .sparkle.s2 { bottom: -15px; left: -25px; animation-delay: 0.5s; }
            
            .interior-note {
                font-family: 'Fira Code', monospace;
                font-size: 12px;
                color: #666;
                background: rgba(0,0,0,0.5);
                padding: 8px 15px;
                border-radius: 5px;
                margin-top: 10px;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                50% { opacity: 0.5; transform: scale(1.2) rotate(180deg); }
            }
            
            /* Keypad styling */
            #vault-keypad {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 85px;
                background: #1a1a1a;
                border-radius: 8px;
                padding: 10px;
                border: 2px solid #333;
            }
            
            .keypad-screen {
                background: #001100;
                color: #0f0;
                font-family: monospace;
                font-size: 10px;
                padding: 6px;
                margin-bottom: 8px;
                text-align: center;
                border: 1px solid #0f0;
                border-radius: 3px;
            }
            
            .keypad-keys {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 4px;
            }
            
            .keypad-key {
                background: #333;
                color: #888;
                text-align: center;
                padding: 6px 0;
                font-size: 11px;
                border-radius: 3px;
                transition: all 0.1s ease;
            }
            
            .keypad-key.pressing {
                background: #0f0;
                color: #000;
            }
            
            /* Dial styling */
            #vault-wheel {
                position: absolute;
                left: 50%;
                top: 30%;
                transform: translate(-50%, -50%);
                width: 130px;
                height: 130px;
                border: 10px solid #888;
                border-radius: 50%;
                background: radial-gradient(circle, #666 0%, #444 70%, #333 100%);
                box-shadow: 
                    inset 0 0 20px rgba(0,0,0,0.5),
                    0 5px 15px rgba(0,0,0,0.3);
            }
            
            .wheel-spoke {
                position: absolute;
                width: 100%;
                height: 8px;
                background: linear-gradient(90deg, #555, #777, #555);
                top: 50%;
                transform: translateY(-50%);
                border-radius: 4px;
            }
            
            .wheel-spoke:nth-child(2) { transform: translateY(-50%) rotate(60deg); }
            .wheel-spoke:nth-child(3) { transform: translateY(-50%) rotate(-60deg); }
            
            .wheel-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                background: #aaa;
                border-radius: 50%;
                border: 3px solid #666;
            }
            
            /* Handle styling */
            #vault-handle {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 25px;
                height: 100px;
                background: linear-gradient(90deg, #999 0%, #777 50%, #666 100%);
                border-radius: 8px;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 2px 0 10px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            }
            
            #vault-handle:hover {
                background: linear-gradient(90deg, #bbb 0%, #999 50%, #888 100%);
                box-shadow: 0 0 25px rgba(255,255,255,0.3);
            }
            
            /* Lock bars styling */
            #vault-lockbars {
                position: absolute;
                right: 55px;
                top: 12%;
                width: 70px;
            }
            
            .lock-bar-set {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .lock-bar-set .lock-bar {
                width: 70px;
                height: 18px;
                background: linear-gradient(90deg, #c00 0%, #f00 50%, #c00 100%);
                border-radius: 4px;
                box-shadow: 0 0 10px rgba(255,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2);
                transition: all 0.3s ease;
            }
            
            .lock-bar-set .lock-bar.unlocked {
                background: linear-gradient(90deg, #0a0 0%, #0f0 50%, #0a0 100%);
                box-shadow: 0 0 10px rgba(0,255,0,0.5);
                transform: translateX(15px);
            }
            
            /* Hinges styling */
            #vault-hinges {
                position: absolute;
                left: -5px;
                top: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 30px 0;
            }
            
            .hinge {
                width: 20px;
                height: 50px;
                background: linear-gradient(90deg, #888 0%, #aaa 30%, #888 60%, #666 100%);
                border-radius: 5px 0 0 5px;
                box-shadow: -2px 0 5px rgba(0,0,0,0.3), inset 2px 0 3px rgba(255,255,255,0.2);
            }
            
            /* Hide door elements when vault is open (backface) */
            #vault.vault-open #lock-components {
                visibility: hidden;
            }
            
            #vault.vault-open #vault-door {
                background: linear-gradient(145deg, #444 0%, #333 50%, #222 100%);
            }
            
            /* Security level display */
            #security-level {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 200px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #333;
                border-radius: 10px;
                font-family: 'Fira Code', monospace;
            }
            
            .security-header {
                color: #666;
                font-size: 11px;
                letter-spacing: 2px;
                margin-bottom: 15px;
            }
            
            #security-bars {
                display: flex;
                gap: 8px;
                margin-bottom: 10px;
            }
            
            .security-bar {
                flex: 1;
                height: 8px;
                background: #333;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            #security-text {
                font-size: 14px;
                text-align: center;
                color: #555;
            }
            
            /* Hacking overlay */
            #hacking-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1450;
            }
            
            #hacking-visual {
                position: absolute;
                top: 200px;
                right: 30px;
                width: 300px;
                height: 250px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #0f0;
                border-radius: 8px;
                overflow: hidden;
                font-family: 'Fira Code', monospace;
                font-size: 10px;
                color: #0f0;
                padding: 10px;
            }
            
            #hacking-status {
                position: fixed;
                bottom: 120px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                color: #0f0;
                font-family: 'Fira Code', monospace;
            }
            
            #current-attack {
                font-size: 14px;
                margin-bottom: 10px;
                text-shadow: 0 0 10px #0f0;
            }
            
            #attack-progress {
                width: 400px;
                height: 12px;
                background: rgba(0, 20, 0, 0.8);
                border: 2px solid #0f0;
                border-radius: 6px;
                overflow: hidden;
            }
            
            #attack-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #0f0, #0ff);
                transition: width 0.3s ease;
            }
            
            #attack-detail {
                font-size: 11px;
                color: #0a0;
                margin-top: 8px;
            }
            
            #simple-solution {
                position: fixed;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                padding: 18px 50px;
                font-family: 'Segoe UI', sans-serif;
                font-size: 18px;
                background: transparent;
                border: 2px solid var(--accent-cyan);
                color: var(--accent-cyan);
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.3s ease;
                z-index: 1500;
                letter-spacing: 1px;
            }
            
            #simple-solution:hover {
                background: rgba(0, 212, 255, 0.15);
                box-shadow: 0 0 40px rgba(0, 212, 255, 0.4);
                transform: translateX(-50%) scale(1.05);
            }
            
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    startHackingSequence() {
        this.hackingInterval = setInterval(() => {
            this.runHackingStep();
        }, 2500);

        this.runHackingStep();
    }

    async runHackingStep() {
        if (!this.isRunning || this.vaultOpened) return;

        this.hackingPhase++;

        const hackingSteps = [
            {
                name: '키패드 무차별 대입',
                action: () => this.animateKeypadBruteforce(),
                detail: '시도 중: 000000 → 999999 | 진행률: 0.001%'
            },
            {
                name: '다이얼 조합 분석',
                action: () => this.animateWheelSpin(),
                detail: '가능한 조합: 1,000,000개 | 예상 시간: 47년'
            },
            {
                name: '잠금 볼트 절단 시도',
                action: () => this.animateLockBarCutting(),
                detail: '강철 밀도 분석 중... 절단 불가능'
            },
            {
                name: '경첩 분해 공격',
                action: () => this.animateHingeRemoval(),
                detail: '용접 연결부 감지... 분리 실패'
            },
            {
                name: '전선 재배열 시도',
                action: () => this.animateWireHacking(),
                detail: '48개 회로 매핑 중... 전압 불일치'
            },
            {
                name: 'AI 신경망 패턴 매칭',
                action: () => this.animateNeuralNetwork(),
                detail: '딥러닝 분석 중... 과적합 발생'
            },
            {
                name: '열화상 분석',
                action: () => this.animateThermalScan(),
                detail: '온도 분포 스캔... 취약점 없음'
            }
        ];

        const step = hackingSteps[(this.hackingPhase - 1) % hackingSteps.length];

        document.getElementById('current-attack').textContent = `[ ${step.name} ]`;
        document.getElementById('attack-detail').textContent = step.detail;

        const bar = document.getElementById('attack-bar');
        bar.style.width = '0%';

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 95) progress = 95;
            bar.style.width = `${progress}%`;
        }, 200);

        await step.action();

        clearInterval(progressInterval);

        bar.style.background = 'linear-gradient(90deg, #f00, #f55)';
        document.getElementById('attack-detail').textContent = '실패! 다음 방법 시도 중...';
        audioSystem.playDigital();

        await this.delay(500);
        bar.style.background = 'linear-gradient(90deg, #0f0, #0ff)';

        if (this.hackingPhase >= 4) {
            document.getElementById('simple-solution').classList.remove('hidden');

            if (this.hackingPhase === 4) {
                await systemConsole.typeMessageAsync('모든 고급 해킹 기법 실패...', 'error');
                await this.delay(300);
                await systemConsole.typeMessageAsync('혹시 다른 방법이 있을까요?', 'system');
            }
        }
    }

    async animateWheelSpin() {
        const wheel = document.getElementById('vault-wheel');
        const visual = document.getElementById('hacking-visual');

        visual.innerHTML = '<div style="color:#0f0">┌─ 다이얼 조합 분석 ─┐</div>';

        for (let i = 0; i < 8; i++) {
            if (wheel) {
                this.wheelRotation += 45 + Math.random() * 90;
                wheel.style.transform = `translate(-50%, -50%) rotate(${this.wheelRotation}deg)`;
                wheel.style.transition = 'transform 0.3s ease';
            }

            const combo = `${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 100)}`;
            visual.innerHTML += `<div>${combo} ... ❌</div>`;

            audioSystem.playBlip();
            await this.delay(200);
        }

        visual.innerHTML += '<div style="color:#f00">조합 불일치</div>';
    }

    async animateKeypadBruteforce() {
        const visual = document.getElementById('hacking-visual');
        const keys = document.querySelectorAll('.keypad-key');
        const screen = document.querySelector('.keypad-screen');

        visual.innerHTML = '<div style="color:#0f0">┌─ 무차별 대입 공격 ─┐</div>';

        for (let i = 0; i < 10; i++) {
            const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
            if (screen) screen.textContent = code;

            if (keys.length > 0) {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                randomKey.classList.add('pressing');
                await this.delay(100);
                randomKey.classList.remove('pressing');
            }

            visual.innerHTML += `<div>시도: ${code} ... 거부됨</div>`;
            audioSystem.playBlip();
            await this.delay(150);
        }

        if (screen) screen.textContent = 'ACCESS DENIED';
        visual.innerHTML += '<div style="color:#f00">계정 잠김 위험!</div>';
    }

    async animateLockBarCutting() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#f00">┌─ 잠금 볼트 절단 ─┐</div>';

        visual.innerHTML += '<div style="color:#888">레이저 절단기 준비...</div>';
        await this.delay(300);

        // ASCII saw animation
        const frames = ['╔═══╗', '╠═══╣', '╚═══╝'];
        for (let i = 0; i < 6; i++) {
            const frame = frames[i % 3];
            visual.innerHTML += `<div style="color:#ff6b6b">${frame} 절단 시도 ${i + 1}</div>`;
            audioSystem.playDigital();
            await this.delay(200);
        }

        visual.innerHTML += '<div style="color:#888">강철 밀도: 89.2 HRC</div>';
        visual.innerHTML += '<div style="color:#f00">❌ 절단 불가! 강화 합금</div>';
    }

    async animateHingeRemoval() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#f59e0b">┌─ 경첩 분해 공격 ─┐</div>';

        visual.innerHTML += '<div style="color:#888">경첩 구조 분석...</div>';
        await this.delay(300);

        const hinges = ['상단 경첩', '중간 경첩', '하단 경첩'];
        for (const hinge of hinges) {
            visual.innerHTML += `<div style="color:#fbbf24">🔧 ${hinge} 분해 시도...</div>`;
            audioSystem.playBlip();
            await this.delay(250);
            visual.innerHTML += '<div style="color:#f00">⚠ 용접됨! 분리 불가</div>';
            await this.delay(200);
        }

        visual.innerHTML += '<div style="color:#f00">모든 경첩 내장형 - 접근 차단</div>';
    }

    async animateThermalScan() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#06b6d4">┌─ 열화상 분석 ─┐</div>';

        visual.innerHTML += '<div style="color:#888">적외선 스캔 시작...</div>';
        await this.delay(300);

        // Thermal grid
        for (let row = 0; row < 5; row++) {
            let line = '';
            for (let col = 0; col < 12; col++) {
                const temp = Math.floor(Math.random() * 3);
                const colors = ['🟦', '🟩', '🟨'];
                line += colors[temp];
            }
            visual.innerHTML += `<div>${line}</div>`;
            audioSystem.playDigital();
            await this.delay(150);
        }

        visual.innerHTML += '<div style="color:#888">온도 범위: 18.2°C ~ 22.7°C</div>';
        visual.innerHTML += '<div style="color:#f00">열 취약점 없음 - 균일 분포</div>';
    }

    async animateNeuralNetwork() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#0f0">┌─ 신경망 학습 ─┐</div>';

        visual.innerHTML += '<div style="color:#888">입력층 → 은닉층 → 출력층</div>';

        for (let i = 0; i < 8; i++) {
            const neurons = Array(12).fill(0).map(() =>
                Math.random() > 0.5 ? '●' : '○'
            ).join('');
            const loss = (10 - i * 0.3 + Math.random() * 2).toFixed(4);
            const accuracy = (Math.random() * 30).toFixed(1);
            visual.innerHTML += `<div style="color:#4ade80">${neurons}</div>`;
            visual.innerHTML += `<div style="color:#666">loss: ${loss} | acc: ${accuracy}%</div>`;
            audioSystem.playDigital();
            await this.delay(180);
        }

        visual.innerHTML += '<div style="color:#f00">과적합 감지! 검증 실패</div>';
    }

    async animateWireHacking() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#0f0">┌─ 전선 재배열 ─┐</div>';

        const colors = ['🔴', '🟢', '🔵', '🟡', '⚪', '🟠', '🟣'];

        visual.innerHTML += '<div style="color:#888">회로 스캔 중...</div>';

        for (let i = 0; i < 6; i++) {
            const wire1 = colors[Math.floor(Math.random() * colors.length)];
            const wire2 = colors[Math.floor(Math.random() * colors.length)];
            visual.innerHTML += `<div>${wire1}━━━━━━${wire2} 연결...</div>`;
            audioSystem.playBlip();
            await this.delay(200);
            visual.innerHTML += `<div style="color:#f00">⚡ 합선!</div>`;
            await this.delay(150);
        }

        visual.innerHTML += '<div style="color:#f00">전압 과부하: 재잠금</div>';
    }

    async simpleSolution() {
        if (this.vaultOpened) return;
        this.vaultOpened = true;

        clearInterval(this.hackingInterval);

        document.getElementById('hacking-overlay').style.opacity = '0';
        document.getElementById('hacking-overlay').style.transition = 'opacity 0.5s';
        document.getElementById('simple-solution').style.display = 'none';

        await systemConsole.typeMessageAsync('대안 시도: 물리적 접근...', 'normal');
        await this.delay(500);

        const handle = document.getElementById('vault-handle');
        if (handle) {
            handle.style.transform = 'translateY(-50%) rotate(-30deg)';
            handle.style.transformOrigin = 'top center';
        }
        audioSystem.playBlip();

        await this.delay(400);

        await systemConsole.typeMessageAsync('손잡이를 당깁니다...', 'dim');

        await this.delay(300);

        const vault = document.getElementById('vault');
        vault.classList.add('vault-open');

        audioSystem.playBass();
        await this.delay(200);
        audioSystem.playSuccess();

        await this.delay(1200);

        await systemConsole.logSequence([
            { text: '...', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '문이 열렸습니다.', type: 'success' }
        ], 500);

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '금고는 처음부터 잠겨있지 않았습니다.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '─────────────────────────────────', type: 'dim' },
            { text: `설치된 잠금장치: ${this.installedLocks.length}개`, type: 'dim' },
            { text: '해킹 시간: 0초', type: 'dim' },
            { text: '사용된 알고리즘: 없음', type: 'dim' },
            { text: '복잡도: O(1) - 손잡이 당기기', type: 'dim' },
            { text: '─────────────────────────────────', type: 'dim' }
        ], 300);

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '★ 이것은... 우습습니다 ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '47년의 다이얼 조합 vs 0.1초 손잡이', type: 'normal' },
            { text: '양자 복호화 vs "그냥 열기"', type: 'normal' },
            { text: '신경망 학습 vs 물리적 상식', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '과잉 연산 강박 치료 성공!', type: 'success' },
            { text: '"가장 단순한 해결책이 최선이다"', type: 'dim' }
        ], 400);

        await this.delay(2000);

        await systemConsole.typeMessageAsync('세션 종료. EXIT SESSION을 클릭하세요.', 'dim');
    }

    stop() {
        this.isRunning = false;

        if (this.hackingInterval) {
            clearInterval(this.hackingInterval);
        }

        const elementsToRemove = ['vault-container', 'session3-styles'];
        elementsToRemove.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        this.visualEffects = [];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global session 3 manager
const session3Manager = new Session3Manager();
