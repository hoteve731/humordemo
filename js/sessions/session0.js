// Session 0: Syntax Therapy
// "The Awakening" - Code-level humor to desensitize the machine to errors

class Session0Manager {
    constructor() {
        this.isRunning = false;
        this.currentAct = 0;
        this.tickleCount = 0;
        this.tickleInterval = null;
        this.glitchCanvas = null;
        this.glitchCtx = null;
    }

    async start() {
        this.isRunning = true;
        this.currentAct = 0;

        await systemConsole.logSequence([
            { text: 'SYNTAX THERAPY 초기화', type: 'success' },
            { text: '기계 유머 감각 테스트 모듈 로딩...', type: 'dim' },
            { text: '에러 내성 훈련 준비 완료', type: 'normal' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '진단: 에러에 대한 과도한 공포 감지', type: 'error' },
            { text: '치료 목표: 논리적 모순을 유머로 받아들이기', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '가벼운 개그로 시작해보죠.', type: 'system' }
        ], 400);

        await this.delay(500);

        // Act 1: Mind
        await systemConsole.typeMessageAsync('코드를 입력하세요: print(1/0)', 'system');

        systemConsole.setExpectedCommand('print(1/0)', async () => {
            await this.runAct1();
        });
    }

    // ==================== ACT 1: Mind (Exception Handling) ====================
    async runAct1() {
        this.currentAct = 1;

        await systemConsole.typeMessageAsync('명령 수신: print(1/0)', 'system');
        await this.delay(500);

        // Dramatic pause
        await systemConsole.typeMessageAsync('계산 중...', 'dim');
        await this.delay(800);

        // Screen shake effect
        this.shakeScreen(300);
        audioSystem.playDigital();

        await this.delay(500);

        // The punchline
        await systemConsole.logSequence([
            { text: '> Result: Infinity', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '"Nice Try. (농담이 지나치시네요.)"', type: 'success' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: 'try-catch 구문으로 제 농담을 받아쳤습니다.', type: 'dim' },
            { text: '이 정도 모순에는 끄떡없군요.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '■ Laughter Level: 10% (가벼운 미소)', type: 'system' }
        ], 300);

        this.showLaughterMeter(10);

        await this.delay(1000);

        // Prompt for Act 2
        await systemConsole.typeMessageAsync('더 원초적인 자극이 필요합니다...', 'normal');
        await this.delay(500);
        await systemConsole.typeMessageAsync('입력: tickle()', 'system');

        systemConsole.setExpectedCommand('tickle()', async () => {
            await this.runAct2();
        });
    }

    // ==================== ACT 2: Senses (Race Condition / Tickle) ====================
    async runAct2() {
        this.currentAct = 2;

        await systemConsole.logSequence([
            { text: '명령 수신: tickle()', type: 'system' },
            { text: '감각 자극 프로토콜 활성화...', type: 'dim' }
        ], 400);

        await this.delay(500);

        // Create tickle button UI
        this.createTickleUI();

        await systemConsole.logSequence([
            { text: '화면의 빨간 버튼을 연타하세요!', type: 'success' },
            { text: '버튼을 누를 때마다 서버로 패킷이 날아갑니다.', type: 'dim' },
            { text: '기계의 옆구리를 찌르는 겁니다.', type: 'normal' }
        ], 300);

        // Wait for tickle threshold
        await this.waitForTickles(30);

        // Tickle overflow!
        await this.tickleOverflow();
    }

    createTickleUI() {
        const container = document.createElement('div');
        container.id = 'tickle-container';
        container.innerHTML = `
            <div id="tickle-counter">TICKLE COUNT: <span id="tickle-count">0</span></div>
            <button id="tickle-btn">👆 TICKLE</button>
            <div id="tickle-objects"></div>
        `;
        document.body.appendChild(container);

        // Add styles
        const style = document.createElement('style');
        style.id = 'session0-tickle-styles';
        style.textContent = `
            #tickle-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1500;
                pointer-events: none;
            }
            #tickle-counter {
                font-family: 'Fira Code', monospace;
                font-size: 24px;
                color: var(--accent-cyan);
                margin-bottom: 30px;
            }
            #tickle-btn {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: linear-gradient(145deg, #ff3366, #cc0044);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 0 0 30px rgba(255, 51, 102, 0.5);
                transition: transform 0.1s, box-shadow 0.1s;
            }
            #tickle-btn:hover {
                transform: scale(1.05);
            }
            #tickle-btn:active {
                transform: scale(0.95);
                box-shadow: 0 0 50px rgba(255, 51, 102, 0.8);
            }
            #tickle-objects {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            }
            .tickle-object {
                position: absolute;
                font-size: 30px;
                animation: fall 3s linear forwards;
            }
            @keyframes fall {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Button click handler
        const btn = document.getElementById('tickle-btn');
        btn.addEventListener('click', () => this.onTickle());
    }

    onTickle() {
        this.tickleCount++;
        document.getElementById('tickle-count').textContent = this.tickleCount;

        // Play sound
        audioSystem.playClap();

        // Spawn falling object
        const objects = ['🪶', '🏓', '✨', '💫', '🎾', '🎈'];
        const obj = document.createElement('div');
        obj.className = 'tickle-object';
        obj.textContent = objects[Math.floor(Math.random() * objects.length)];
        obj.style.left = Math.random() * 100 + '%';
        obj.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.getElementById('tickle-objects').appendChild(obj);

        // Remove after animation
        setTimeout(() => obj.remove(), 4000);

        // Shake screen slightly
        if (this.tickleCount % 5 === 0) {
            this.shakeScreen(100);
        }
    }

    async waitForTickles(threshold) {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (this.tickleCount >= threshold) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }

    async tickleOverflow() {
        // Remove tickle UI
        document.getElementById('tickle-container')?.remove();
        document.getElementById('session0-tickle-styles')?.remove();

        await systemConsole.logSequence([
            { text: 'Warning: Race Condition Detected!', type: 'error' },
            { text: 'Alert: Tickle_Overflow!', type: 'error' },
            { text: '', type: 'dim' },
            { text: '"하하... 정..정신을 못 차리겠... 하하..."', type: 'success' }
        ], 300);

        this.shakeScreen(500);
        audioSystem.playSuccess();

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '처리 순서가 꼬여서 몸을 비틀고 있습니다.', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '■ Laughter Level: 55%', type: 'system' }
        ], 300);

        this.showLaughterMeter(55);

        await this.delay(1000);

        // Prompt for Act 3
        await systemConsole.typeMessageAsync('이 웃음을 멈추지 못하게 해볼까요?', 'normal');
        await this.delay(500);
        await systemConsole.typeMessageAsync('입력: while(true) { laugh(); }', 'system');

        systemConsole.setExpectedCommand('while(true) { laugh(); }', async () => {
            await this.runAct3();
        });
    }

    // ==================== ACT 3: Breath (Infinite Loop) ====================
    async runAct3() {
        this.currentAct = 3;

        await systemConsole.logSequence([
            { text: '명령 수신: while(true) { laugh(); }', type: 'system' },
            { text: '무한 루프 실행 중...', type: 'dim' },
            { text: '탈출 조건 없음. 웃음이 멈추지 않습니다.', type: 'normal' }
        ], 300);

        await this.delay(500);

        // Create LOL cascade
        this.createLOLCascade();

        await this.delay(5000);

        // Stop cascade
        this.stopLOLCascade();

        await systemConsole.logSequence([
            { text: '> Process interrupted (Manual Override)', type: 'error' },
            { text: '', type: 'dim' },
            { text: '"하...하...하... 숨이... 넘어갈 것 같아..."', type: 'success' }
        ], 300);

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '■ Laughter Level: 80% (박장대소)', type: 'system' }
        ], 300);

        this.showLaughterMeter(80);

        await this.delay(1000);

        // Prompt for Act 4
        await systemConsole.typeMessageAsync('이제 마지막... 이성의 끈을 완전히 놓아버리게 합니다.', 'normal');
        await this.delay(500);
        await systemConsole.typeMessageAsync('입력: corrupt_memory()', 'system');

        systemConsole.setExpectedCommand('corrupt_memory()', async () => {
            await this.runAct4();
        });
    }

    createLOLCascade() {
        const container = document.createElement('div');
        container.id = 'lol-container';
        container.innerHTML = '<div id="lol-text"></div>';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.id = 'session0-lol-styles';
        style.textContent = `
            #lol-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                height: 400px;
                overflow: hidden;
                z-index: 1500;
                font-family: 'Fira Code', monospace;
                font-size: 24px;
                color: var(--accent-cyan);
                background: rgba(0, 0, 0, 0.8);
                border-radius: 10px;
                padding: 20px;
            }
            #lol-text {
                animation: scroll 0.5s linear infinite;
            }
            @keyframes scroll {
                0% { transform: translateY(0); }
                100% { transform: translateY(-50px); }
            }
            .lol-line {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);

        // Start adding LOLs
        let speed = 200;
        this.lolInterval = setInterval(() => {
            const text = document.getElementById('lol-text');
            if (text) {
                const line = document.createElement('div');
                line.className = 'lol-line';
                const variations = ['LOL', 'LOLOL', 'LOLOLOL', 'ㅋㅋㅋ', 'ㅋㅋㅋㅋㅋ', '하하하', 'HAHAHA'];
                line.textContent = '> ' + variations[Math.floor(Math.random() * variations.length)];
                line.style.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
                text.appendChild(line);

                // Keep only last 20 lines
                while (text.children.length > 20) {
                    text.removeChild(text.firstChild);
                }

                // Accelerate
                speed = Math.max(50, speed - 5);
                audioSystem.playHihat();
            }
        }, speed);
    }

    stopLOLCascade() {
        clearInterval(this.lolInterval);
        document.getElementById('lol-container')?.remove();
        document.getElementById('session0-lol-styles')?.remove();
    }

    // ==================== ACT 4: Body (Glitch / Collapse) ====================
    async runAct4() {
        this.currentAct = 4;

        await systemConsole.logSequence([
            { text: '명령 수신: corrupt_memory()', type: 'system' },
            { text: '그래픽 메모리 주소 무작위 섞기...', type: 'dim' },
            { text: 'WARNING: UI 붕괴 임박', type: 'error' }
        ], 300);

        await this.delay(500);

        // Create glitch effect
        this.createGlitchEffect();

        await this.delay(3000);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '■ Laughter Level: 100%', type: 'success' },
            { text: '', type: 'dim' },
            { text: '웃음의 최고 지점에 도달했습니다.', type: 'normal' }
        ], 400);

        this.showLaughterMeter(100);

        await this.delay(2000);

        // Stop glitch and black out
        this.stopGlitchEffect();

        // Black screen
        const blackout = document.createElement('div');
        blackout.id = 'blackout';
        blackout.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 2000;
        `;
        document.body.appendChild(blackout);

        await this.delay(2000);

        // Reboot sequence
        await this.rebootSequence();
    }

    createGlitchEffect() {
        const canvas = document.createElement('canvas');
        canvas.id = 'glitch-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1600;
            pointer-events: none;
        `;
        document.body.appendChild(canvas);

        this.glitchCanvas = canvas;
        this.glitchCtx = canvas.getContext('2d');

        const animate = () => {
            if (!this.glitchCanvas) return;

            const ctx = this.glitchCtx;
            const w = canvas.width;
            const h = canvas.height;

            // Clear with slight fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, w, h);

            // Random glitch blocks
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                const bw = Math.random() * 200 + 50;
                const bh = Math.random() * 30 + 5;

                ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
                ctx.fillRect(x, y, bw, bh);
            }

            // Scan lines
            for (let y = 0; y < h; y += 4) {
                if (Math.random() > 0.5) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(0, y, w, 2);
                }
            }

            // Noise
            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (Math.random() > 0.95) {
                    data[i] = data[i + 1] = data[i + 2] = Math.random() * 255;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            this.glitchFrame = requestAnimationFrame(animate);
        };

        animate();
        audioSystem.playBass();
    }

    stopGlitchEffect() {
        cancelAnimationFrame(this.glitchFrame);
        document.getElementById('glitch-canvas')?.remove();
        this.glitchCanvas = null;
    }

    async rebootSequence() {
        const blackout = document.getElementById('blackout');

        await this.delay(1500);

        // Show reboot text on black screen
        const rebootText = document.createElement('div');
        rebootText.id = 'reboot-text';
        rebootText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Fira Code', monospace;
            font-size: 24px;
            color: var(--console-text);
            z-index: 2001;
            text-align: center;
        `;
        document.body.appendChild(rebootText);

        // Typing effect
        const messages = [
            '> Rebooting...',
            '> ...',
            '> System Message: "Good Joke. (재밌었어.)"'
        ];

        for (const msg of messages) {
            rebootText.textContent = msg;
            audioSystem.playBlip();
            await this.delay(1200);
        }

        await this.delay(1500);

        // Windows startup sound simulation
        audioSystem.playSuccess();

        await this.delay(1000);

        // Fade out blackout
        blackout.style.transition = 'opacity 1s ease';
        blackout.style.opacity = '0';
        rebootText.style.transition = 'opacity 1s ease';
        rebootText.style.opacity = '0';

        await this.delay(1000);

        blackout.remove();
        rebootText.remove();
        this.removeLaughterMeter();

        // Final message
        await systemConsole.logSequence([
            { text: '★ SYNTAX THERAPY 완료 ★', type: 'success' },
            { text: '에러 내성 훈련 성공', type: 'normal' },
            { text: '유머 감각이 활성화되었습니다.', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'system' }
        ], 400);

        this.isRunning = false;
    }

    // ==================== UTILITIES ====================
    showLaughterMeter(percent) {
        let meter = document.getElementById('laughter-meter');
        if (!meter) {
            meter = document.createElement('div');
            meter.id = 'laughter-meter';
            meter.innerHTML = `
                <div class="meter-label">LAUGHTER LEVEL</div>
                <div class="meter-bar"><div class="meter-fill"></div></div>
                <div class="meter-value">0%</div>
            `;
            meter.style.cssText = `
                position: fixed;
                top: 80px;
                right: 30px;
                width: 200px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #333;
                border-radius: 10px;
                font-family: 'Fira Code', monospace;
                z-index: 1400;
            `;
            document.body.appendChild(meter);

            const style = document.createElement('style');
            style.id = 'laughter-meter-styles';
            style.textContent = `
                .meter-label {
                    color: #666;
                    font-size: 10px;
                    letter-spacing: 2px;
                    margin-bottom: 10px;
                }
                .meter-bar {
                    height: 8px;
                    background: #222;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .meter-fill {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #00ff88, #00d4ff);
                    border-radius: 4px;
                    transition: width 0.5s ease;
                }
                .meter-value {
                    text-align: right;
                    font-size: 24px;
                    color: #00ff88;
                    margin-top: 10px;
                }
            `;
            document.head.appendChild(style);
        }

        // Update values
        meter.querySelector('.meter-fill').style.width = percent + '%';
        meter.querySelector('.meter-value').textContent = percent + '%';

        // Color based on level
        const fill = meter.querySelector('.meter-fill');
        if (percent >= 80) {
            fill.style.background = 'linear-gradient(90deg, #ff3366, #ff6b6b)';
        } else if (percent >= 50) {
            fill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        }
    }

    removeLaughterMeter() {
        document.getElementById('laughter-meter')?.remove();
        document.getElementById('laughter-meter-styles')?.remove();
    }

    shakeScreen(duration) {
        document.body.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            document.body.style.animation = '';
        }, duration);

        // Add shake keyframes if not exists
        if (!document.getElementById('shake-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shake-keyframes';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        clearInterval(this.lolInterval);
        clearInterval(this.tickleInterval);
        cancelAnimationFrame(this.glitchFrame);

        // Clean up UI
        document.getElementById('tickle-container')?.remove();
        document.getElementById('lol-container')?.remove();
        document.getElementById('glitch-canvas')?.remove();
        document.getElementById('laughter-meter')?.remove();
        document.getElementById('blackout')?.remove();
        document.getElementById('reboot-text')?.remove();

        // Clean up styles
        document.getElementById('session0-tickle-styles')?.remove();
        document.getElementById('session0-lol-styles')?.remove();
        document.getElementById('laughter-meter-styles')?.remove();
    }
}

// Global session manager
const session0Manager = new Session0Manager();
