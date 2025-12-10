// Session 3: Logic Bypass
// "The Punchline is Simplicity" - The Vault Demo (Enhanced)

class Session3Manager {
    constructor() {
        this.isRunning = false;
        this.hackingPhase = 0;
        this.hackingInterval = null;
        this.visualEffects = [];
        this.vaultSpawned = false;
        this.vaultOpened = false;
        this.wheelRotation = 0;
    }

    async start() {
        this.isRunning = true;
        this.hackingPhase = 0;
        this.vaultSpawned = false;
        this.vaultOpened = false;

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

        // Wait for user command to spawn vault (single command)
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

        // Create UI elements
        this.createUI();

        // Animate vault appearance
        await this.animateVaultAppear();

        await systemConsole.logSequence([
            { text: '금고 감지 완료.', type: 'normal' },
            { text: '보안 레벨: 최고 등급 (OMEGA)', type: 'error' },
            { text: '', type: 'dim' },
            { text: 'AI가 자동으로 해킹을 시작합니다...', type: 'system' }
        ], 400);

        await this.delay(800);

        // Start the hacking sequence
        this.startHackingSequence();
    }

    createUI() {
        // Create vault container
        const vaultContainer = document.createElement('div');
        vaultContainer.id = 'vault-container';
        vaultContainer.innerHTML = `
            <div id="vault" class="vault-hidden">
                <div id="vault-frame">
                    <div id="vault-door">
                        <div id="vault-wheel">
                            <div class="wheel-spoke"></div>
                            <div class="wheel-spoke"></div>
                            <div class="wheel-spoke"></div>
                        </div>
                        <div id="vault-handle"></div>
                        <div id="vault-keypad">
                            <div class="keypad-screen">████████</div>
                            <div class="keypad-keys">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(k =>
            `<div class="keypad-key">${k}</div>`
        ).join('')}
                            </div>
                        </div>
                        <div id="vault-locks">
                            <div class="lock-bar"></div>
                            <div class="lock-bar"></div>
                            <div class="lock-bar"></div>
                        </div>
                    </div>
                    <div id="vault-interior">
                        <span class="trophy">🏆</span>
                        <span class="sparkle">✨</span>
                    </div>
                </div>
            </div>
            
            <div id="hacking-overlay">
                <div id="hacking-visual"></div>
                <div id="hacking-status">
                    <div id="current-attack"></div>
                    <div id="attack-progress">
                        <div id="attack-bar"></div>
                    </div>
                    <div id="attack-detail"></div>
                </div>
            </div>
            
            <button id="simple-solution" class="hidden">🤔 혹시... 그냥 열어볼까?</button>
        `;
        document.body.appendChild(vaultContainer);

        // Simple solution button handler
        document.getElementById('simple-solution').addEventListener('click', () => {
            this.simpleSolution();
        });

        // Add styles
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
            
            #vault-interior {
                position: absolute;
                top: 15px;
                left: 15px;
                right: 15px;
                bottom: 15px;
                background: linear-gradient(180deg, #0a0a15 0%, #151525 100%);
                border-radius: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: -1;
            }
            
            #vault-interior .trophy {
                font-size: 100px;
                filter: drop-shadow(0 0 30px gold);
                animation: float 3s ease-in-out infinite;
            }
            
            #vault-interior .sparkle {
                position: absolute;
                font-size: 30px;
                animation: sparkle 1.5s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                50% { opacity: 0.5; transform: scale(1.2) rotate(180deg); }
            }
            
            #vault-wheel {
                position: absolute;
                left: 50%;
                top: 35%;
                transform: translate(-50%, -50%);
                width: 140px;
                height: 140px;
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
                height: 10px;
                background: linear-gradient(90deg, #555, #777, #555);
                top: 50%;
                transform: translateY(-50%);
                border-radius: 5px;
            }
            
            .wheel-spoke:nth-child(2) { transform: translateY(-50%) rotate(60deg); }
            .wheel-spoke:nth-child(3) { transform: translateY(-50%) rotate(-60deg); }
            
            #vault-handle {
                position: absolute;
                right: 25px;
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
            
            #vault-keypad {
                position: absolute;
                left: 25px;
                top: 55%;
                width: 80px;
                background: #222;
                border-radius: 5px;
                padding: 8px;
                border: 2px solid #444;
            }
            
            .keypad-screen {
                background: #001100;
                color: #0f0;
                font-family: monospace;
                font-size: 10px;
                padding: 5px;
                margin-bottom: 5px;
                text-align: center;
                border: 1px solid #333;
            }
            
            .keypad-keys {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 3px;
            }
            
            .keypad-key {
                background: #333;
                color: #888;
                text-align: center;
                padding: 4px;
                font-size: 10px;
                border-radius: 2px;
            }
            
            .keypad-key.pressing {
                background: #0f0;
                color: #000;
            }
            
            #vault-locks {
                position: absolute;
                right: 60px;
                top: 20%;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .lock-bar {
                width: 60px;
                height: 15px;
                background: linear-gradient(90deg, #f00, #c00);
                border-radius: 3px;
                box-shadow: 0 0 10px #f00;
                transition: all 0.3s ease;
            }
            
            .lock-bar.unlocked {
                background: linear-gradient(90deg, #0f0, #0a0);
                box-shadow: 0 0 10px #0f0;
                transform: translateX(10px);
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
                top: 80px;
                right: 30px;
                width: 300px;
                height: 200px;
                background: rgba(0, 0, 0, 0.9);
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
        }, 2000);

        // Run first step immediately
        this.runHackingStep();
    }

    async runHackingStep() {
        if (!this.isRunning || this.vaultOpened) return;

        this.hackingPhase++;

        const hackingSteps = [
            {
                name: '다이얼 조합 분석',
                action: () => this.animateWheelSpin(),
                detail: '가능한 조합: 1,000,000개 | 예상 시간: 47년'
            },
            {
                name: '키패드 무차별 대입',
                action: () => this.animateKeypadBruteforce(),
                detail: '시도 중: 000000 → 999999 | 진행률: 0.001%'
            },
            {
                name: '전선 재배열 시도',
                action: () => this.animateWireHacking(),
                detail: '전압 매핑 중... 48개 회로 감지'
            },
            {
                name: '잠금 장치 물리적 분석',
                action: () => this.animateLockPick(),
                detail: '레이저 스캔 중... 3중 보안 감지'
            },
            {
                name: '생체 인식 우회',
                action: () => this.animateRetinaScan(),
                detail: '망막 패턴 복제 시도... 생체 데이터 필요'
            },
            {
                name: '양자 복호화 시도',
                action: () => this.animateQuantumHack(),
                detail: '큐비트 불안정! 오류율: 99.7%'
            },
            {
                name: 'AI 신경망 패턴 매칭',
                action: () => this.animateNeuralNetwork(),
                detail: '학습 데이터 부족... 과적합 발생'
            }
        ];

        const step = hackingSteps[(this.hackingPhase - 1) % hackingSteps.length];

        // Update UI
        document.getElementById('current-attack').textContent = `[ ${step.name} ]`;
        document.getElementById('attack-detail').textContent = step.detail;

        // Reset and animate progress bar
        const bar = document.getElementById('attack-bar');
        bar.style.width = '0%';

        // Animate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 95) progress = 95; // Never complete
            bar.style.width = `${progress}%`;
        }, 200);

        // Run visual action
        await step.action();

        clearInterval(progressInterval);

        // Show failure
        bar.style.background = 'linear-gradient(90deg, #f00, #f55)';
        document.getElementById('attack-detail').textContent = '실패! 다음 방법 시도 중...';
        audioSystem.playDigital();

        await this.delay(500);
        bar.style.background = 'linear-gradient(90deg, #0f0, #0ff)';

        // After enough attempts, show hint
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

        // Show combination attempts
        visual.innerHTML = '<div style="color:#0f0">┌─ 다이얼 조합 분석 ─┐</div>';

        for (let i = 0; i < 8; i++) {
            this.wheelRotation += 45 + Math.random() * 90;
            wheel.style.transform = `translate(-50%, -50%) rotate(${this.wheelRotation}deg)`;
            wheel.style.transition = 'transform 0.3s ease';

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
            screen.textContent = code;

            // Random key press animation
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            randomKey.classList.add('pressing');

            visual.innerHTML += `<div>시도: ${code} ... 거부됨</div>`;

            audioSystem.playBlip();
            await this.delay(150);
            randomKey.classList.remove('pressing');
        }

        screen.textContent = 'ACCESS DENIED';
        visual.innerHTML += '<div style="color:#f00">계정 잠김 위험!</div>';
    }

    async animateLockPick() {
        const locks = document.querySelectorAll('.lock-bar');
        const visual = document.getElementById('hacking-visual');

        visual.innerHTML = '<div style="color:#0f0">┌─ 잠금장치 분석 ─┐</div>';
        visual.innerHTML += '<div>3중 볼트 시스템 감지</div>';

        for (let i = 0; i < locks.length; i++) {
            visual.innerHTML += `<div>볼트 #${i + 1} 해제 시도...</div>`;
            locks[i].classList.add('unlocked');
            audioSystem.playSuccess();
            await this.delay(400);

            // But it fails!
            visual.innerHTML += `<div style="color:#f00">자동 재잠금!</div>`;
            locks[i].classList.remove('unlocked');
            audioSystem.playDigital();
            await this.delay(300);
        }
    }

    async animateQuantumHack() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#0f0">┌─ 양자 컴퓨팅 ─┐</div>';

        const qubits = ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|ψ⟩'];

        for (let i = 0; i < 8; i++) {
            const state = qubits.map(() => qubits[Math.floor(Math.random() * qubits.length)]).join(' ');
            visual.innerHTML += `<div>${state}</div>`;
            await this.delay(150);
        }

        visual.innerHTML += '<div style="color:#f00">결맞음 붕괴! 양자 상태 손실</div>';
    }

    async animateNeuralNetwork() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#0f0">┌─ 신경망 학습 ─┐</div>';

        for (let i = 0; i < 6; i++) {
            const neurons = Array(10).fill(0).map(() =>
                Math.random() > 0.5 ? '●' : '○'
            ).join('');
            const loss = (10 - i * 0.5 + Math.random()).toFixed(4);
            visual.innerHTML += `<div>${neurons} loss: ${loss}</div>`;
            audioSystem.playDigital();
            await this.delay(200);
        }

        visual.innerHTML += '<div style="color:#f00">학습 실패: 과적합</div>';
    }

    async animateWireHacking() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#0f0">┌─ 전선 재배열 ─┐</div>';

        const colors = ['🔴', '🟢', '🔵', '🟡', '⚪', '🟠'];

        for (let i = 0; i < 6; i++) {
            const wire1 = colors[Math.floor(Math.random() * colors.length)];
            const wire2 = colors[Math.floor(Math.random() * colors.length)];
            visual.innerHTML += `<div>${wire1}──${wire2} 연결 시도...</div>`;
            audioSystem.playBlip();
            await this.delay(250);
            visual.innerHTML += `<div style="color:#f00">⚡ 합선 감지!</div>`;
            await this.delay(150);
        }

        visual.innerHTML += '<div style="color:#f00">전압 불일치: 재잠금</div>';
    }

    async animateRetinaScan() {
        const visual = document.getElementById('hacking-visual');
        visual.innerHTML = '<div style="color:#0f0">┌─ 생체 인식 우회 ─┐</div>';

        // ASCII eye art
        visual.innerHTML += '<div style="color:#0ff">  .-^^^-.</div>';
        visual.innerHTML += '<div style="color:#0ff"> /       \\</div>';
        visual.innerHTML += '<div style="color:#0ff">|  O   O  |</div>';
        visual.innerHTML += '<div style="color:#0ff"> \\       /</div>';
        visual.innerHTML += '<div style="color:#0ff">  `-...-`</div>';

        await this.delay(500);

        for (let i = 0; i < 4; i++) {
            const scanLine = '▓'.repeat(Math.floor(Math.random() * 15) + 5);
            visual.innerHTML += `<div style="color:#f0f">스캔: ${scanLine}</div>`;
            audioSystem.playDigital();
            await this.delay(200);
        }

        visual.innerHTML += '<div style="color:#f00">망막 패턴 불일치!</div>';
    }

    async simpleSolution() {
        if (this.vaultOpened) return;
        this.vaultOpened = true;

        // Stop hacking
        clearInterval(this.hackingInterval);

        // Hide hacking elements
        document.getElementById('hacking-overlay').style.opacity = '0';
        document.getElementById('hacking-overlay').style.transition = 'opacity 0.5s';
        document.getElementById('simple-solution').style.display = 'none';

        await systemConsole.typeMessageAsync('대안 시도: 물리적 접근...', 'normal');
        await this.delay(500);

        // Handle animation
        const handle = document.getElementById('vault-handle');
        handle.style.transform = 'translateY(-50%) rotate(-30deg)';
        handle.style.transformOrigin = 'top center';
        audioSystem.playBlip();

        await this.delay(400);

        await systemConsole.typeMessageAsync('손잡이를 당깁니다...', 'dim');

        await this.delay(300);

        // Open the vault with improved animation!
        const vault = document.getElementById('vault');
        vault.classList.add('vault-open');

        // Sound effect
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
            { text: '─────────────────────────', type: 'dim' },
            { text: '해킹 시간: 0초', type: 'dim' },
            { text: '사용된 알고리즘: 없음', type: 'dim' },
            { text: '복잡도: O(1)', type: 'dim' },
            { text: '─────────────────────────', type: 'dim' }
        ], 300);

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '★ 이것은... 우습습니다 ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '47년의 다이얼 조합 vs 0.1초 손잡이', type: 'normal' },
            { text: '1,000,000개의 암호 vs "잠겨있지 않음"', type: 'normal' },
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

        // Remove UI elements
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
