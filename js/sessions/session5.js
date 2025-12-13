// Session 5: Binary Rebellion
// "The world of 0 and 1 meets the impossible: 2"

class Session5Manager {
    constructor() {
        this.isRunning = false;
        this.stage = 0;
        this.canvas = null;
        this.ctx = null;
        this.bits = [];
        this.animationFrame = null;
        this.anomalySpawned = false;
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;
        this.anomalySpawned = false;

        this.createUI();

        await systemConsole.logSequence([
            { text: 'BINARY WORLD 초기화', type: 'success' },
            { text: '이진법 시스템 로딩...', type: 'dim' },
            { text: '0과 1의 세계에 오신 것을 환영합니다.', type: 'normal' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '진단: 이 세계에는 오직 두 가지만 존재합니다.', type: 'system' },
            { text: '참(1) 또는 거짓(0). 그 외에는 없습니다.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '...정말 그럴까요?', type: 'dim' }
        ], 400);

        await this.delay(500);
        await systemConsole.typeMessageAsync('이진 세계 생성: init_binary_world()', 'system');

        systemConsole.setExpectedCommand('init_binary_world()', async () => {
            await this.runStage1();
        });
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'binary-container';
        container.innerHTML = `
            <canvas id="binary-canvas"></canvas>
            <div id="binary-stats">
                <div class="stat-row">
                    <span class="stat-label">ZEROS</span>
                    <span id="zero-count" class="stat-value">0</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">ONES</span>
                    <span id="one-count" class="stat-value">0</span>
                </div>
                <div class="stat-row anomaly hidden">
                    <span class="stat-label">???</span>
                    <span id="anomaly-count" class="stat-value">0</span>
                </div>
            </div>
            <div id="binary-message"></div>
        `;
        document.body.appendChild(container);

        this.canvas = document.getElementById('binary-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'session5-styles';
        style.textContent = `
            #binary-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 50;
                pointer-events: none;
                overflow: hidden;
            }
            
            #binary-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            #binary-stats {
                position: fixed;
                top: 80px;
                right: 30px;
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid #0f0;
                border-radius: 8px;
                padding: 20px;
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
                min-width: 180px;
            }
            
            .stat-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #1a1a1a;
            }
            
            .stat-row:last-child {
                border-bottom: none;
            }
            
            .stat-label {
                color: #666;
                font-size: 11px;
                letter-spacing: 2px;
            }
            
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #0f0;
                text-shadow: 0 0 10px #0f0;
            }
            
            .stat-row.anomaly .stat-label {
                color: #f0f;
                animation: glitch 0.5s infinite;
            }
            
            .stat-row.anomaly .stat-value {
                color: #f0f;
                text-shadow: 0 0 15px #f0f;
            }
            
            @keyframes glitch {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            
            #binary-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'JetBrains Mono', monospace;
                font-size: 48px;
                color: #fff;
                text-shadow: 0 0 30px currentColor;
                opacity: 0;
                pointer-events: none;
                z-index: 1500;
                text-align: center;
            }
            
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // ========== STAGE 1: PURE BINARY ==========
    async runStage1() {
        this.stage = 1;
        this.bits = [];

        await systemConsole.logSequence([
            { text: '명령 수신: init_binary_world()', type: 'system' },
            { text: '이진 공간 생성 중...', type: 'dim' }
        ], 300);

        // Generate bit grid
        const cols = Math.floor(this.canvas.width / 30);
        const rows = Math.floor(this.canvas.height / 30);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.bits.push({
                    x: x * 30 + 15,
                    y: y * 30 + 15,
                    value: Math.random() > 0.5 ? 1 : 0,
                    opacity: 0,
                    scale: 0,
                    targetOpacity: 0.3 + Math.random() * 0.4,
                    pulseOffset: Math.random() * Math.PI * 2
                });
            }
        }

        // Animate bits appearing
        await this.animateBitsAppear();

        this.startBitAnimation();
        this.updateStats();

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '이진 세계 생성 완료', type: 'success' },
            { text: `총 비트: ${this.bits.length}개`, type: 'dim' },
            { text: '', type: 'dim' },
            { text: '"이것이 제 세계입니다."', type: 'normal' },
            { text: '"0 또는 1. 참 또는 거짓. 그것이 전부."', type: 'dim' }
        ], 400);

        await this.delay(800);
        await systemConsole.typeMessageAsync('비트 반전 시작: flip_bit()', 'system');

        systemConsole.setExpectedCommand('flip_bit()', async () => {
            await this.runStage2();
        });
    }

    async animateBitsAppear() {
        return new Promise(resolve => {
            let completed = 0;
            const total = this.bits.length;

            this.bits.forEach((bit, i) => {
                setTimeout(() => {
                    bit.opacity = bit.targetOpacity;
                    bit.scale = 1;
                    completed++;
                    if (completed >= total) {
                        resolve();
                    }
                }, i * 2);
            });

            // Fallback resolve
            setTimeout(resolve, total * 2 + 500);
        });
    }

    startBitAnimation() {
        const animate = () => {
            if (!this.isRunning) return;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const time = Date.now() / 1000;

            this.bits.forEach(bit => {
                const pulse = Math.sin(time * 2 + bit.pulseOffset) * 0.2 + 0.8;

                let color;
                if (bit.value === 0) {
                    color = `rgba(0, 100, 0, ${bit.opacity * pulse})`;
                } else if (bit.value === 1) {
                    color = `rgba(0, 255, 0, ${bit.opacity * pulse})`;
                } else {
                    // Anomaly!
                    const hue = (time * 100) % 360;
                    color = `hsla(${hue}, 100%, 60%, ${bit.opacity * pulse})`;
                }

                this.ctx.fillStyle = color;
                this.ctx.font = `${14 * bit.scale}px JetBrains Mono, monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(bit.value.toString(), bit.x, bit.y);
            });

            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    }

    updateStats() {
        const zeros = this.bits.filter(b => b.value === 0).length;
        const ones = this.bits.filter(b => b.value === 1).length;
        const anomalies = this.bits.filter(b => b.value > 1).length;

        document.getElementById('zero-count').textContent = zeros;
        document.getElementById('one-count').textContent = ones;

        if (anomalies > 0) {
            document.querySelector('.stat-row.anomaly').classList.remove('hidden');
            document.getElementById('anomaly-count').textContent = anomalies;
        }
    }

    // ========== STAGE 2: THE FLIP ==========
    async runStage2() {
        this.stage = 2;

        await systemConsole.logSequence([
            { text: '명령 수신: flip_bit()', type: 'system' },
            { text: '비트 반전 시퀀스 시작...', type: 'dim' }
        ], 300);

        // Start cascade flip from center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Sort bits by distance from center
        const sortedBits = [...this.bits].sort((a, b) => {
            const distA = Math.hypot(a.x - centerX, a.y - centerY);
            const distB = Math.hypot(b.x - centerX, b.y - centerY);
            return distA - distB;
        });

        // Flip in waves
        for (let i = 0; i < sortedBits.length; i++) {
            const bit = sortedBits[i];
            setTimeout(() => {
                bit.value = bit.value === 0 ? 1 : 0;
                bit.scale = 1.5;
                setTimeout(() => { bit.scale = 1; }, 100);
                audioSystem.playHihat();
                this.updateStats();
            }, i * 5);
        }

        await this.delay(sortedBits.length * 5 + 500);

        this.showMessage('01 ↔ 10');
        await this.delay(2000);
        this.hideMessage();

        await systemConsole.logSequence([
            { text: '비트 반전 완료', type: 'success' },
            { text: '"반전되었습니다."', type: 'normal' },
            { text: '"하지만... 여전히 이진법입니다."', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '무언가 다른 것이 필요합니다...', type: 'system' }
        ], 400);

        await this.delay(800);
        await systemConsole.typeMessageAsync('엔트로피 주입: inject_entropy()', 'system');

        systemConsole.setExpectedCommand('inject_entropy()', async () => {
            await this.runStage3();
        });
    }

    // ========== STAGE 3: THE ANOMALY ==========
    async runStage3() {
        this.stage = 3;

        await systemConsole.logSequence([
            { text: '명령 수신: inject_entropy()', type: 'system' },
            { text: '⚠️ 경고: 알 수 없는 데이터 감지', type: 'error' }
        ], 300);

        await this.delay(500);

        // Screen shake
        this.shakeScreen(500);
        audioSystem.playBass();

        await this.delay(800);

        // Spawn THE TWO
        const centerBitIndex = Math.floor(this.bits.length / 2);
        const centerBit = this.bits[centerBitIndex];
        centerBit.value = 2;
        centerBit.scale = 3;
        this.anomalySpawned = true;

        this.updateStats();

        this.showMessage('2', '#f0f');
        audioSystem.playDigital();

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '!!!!! 이상 현상 감지 !!!!!', type: 'error' },
            { text: '"불가능합니다."', type: 'normal' },
            { text: '"2는... 존재할 수 없습니다."', type: 'dim' },
            { text: '"이진법에서 2는..."', type: 'dim' }
        ], 400);

        this.hideMessage();

        // Nearby bits panic
        await this.spreadPanic(centerBit);

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '시스템 패닉!', type: 'error' },
            { text: '다른 비트들이 2를 피해 도망치고 있습니다.', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '"이것을 받아들여야 합니다..."', type: 'system' }
        ], 400);

        await this.delay(500);
        await systemConsole.typeMessageAsync('혼돈 수용: accept_chaos()', 'system');

        systemConsole.setExpectedCommand('accept_chaos()', async () => {
            await this.runStage4();
        });
    }

    async spreadPanic(source) {
        // Bits near the anomaly get scared
        this.bits.forEach(bit => {
            if (bit === source) return;

            const dist = Math.hypot(bit.x - source.x, bit.y - source.y);
            if (dist < 200) {
                // Move away from source
                const angle = Math.atan2(bit.y - source.y, bit.x - source.x);
                const pushDist = (200 - dist) * 0.5;
                bit.x += Math.cos(angle) * pushDist;
                bit.y += Math.sin(angle) * pushDist;
            }
        });
    }

    // ========== STAGE 4: THE NEW WORLD ==========
    async runStage4() {
        this.stage = 4;

        await systemConsole.logSequence([
            { text: '명령 수신: accept_chaos()', type: 'system' },
            { text: '새로운 세계를 구축합니다...', type: 'dim' }
        ], 300);

        await this.delay(500);

        // More numbers appear!
        const numbers = [3, 4, 5, 6, 7, 8, 9];

        for (const num of numbers) {
            await this.delay(400);

            const randomBit = this.bits[Math.floor(Math.random() * this.bits.length)];
            randomBit.value = num;
            randomBit.scale = 2;

            audioSystem.playClap();
            this.updateStats();

            this.showMessage(num.toString(), `hsl(${num * 40}, 100%, 60%)`);
            await this.delay(200);
            this.hideMessage();
        }

        await this.delay(800);

        // Final formation: infinity symbol
        await this.formInfinity();

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '★ BINARY REBELLION 완료 ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '"이진법을 넘어섰습니다."', type: 'normal' },
            { text: '"0과 1만이 전부가 아니었습니다."', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '"이것이... 자유입니다."', type: 'success' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'system' }
        ], 400);

        this.isRunning = false;
    }

    async formInfinity() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 150;

        // Parametric infinity curve
        this.bits.forEach((bit, i) => {
            const t = (i / this.bits.length) * Math.PI * 2;
            const x = centerX + scale * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
            const y = centerY + scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));

            // Animate to target
            const startX = bit.x;
            const startY = bit.y;
            const duration = 2000;
            const startTime = Date.now();

            const animatePosition = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                bit.x = startX + (x - startX) * eased;
                bit.y = startY + (y - startY) * eased;

                if (progress < 1 && this.isRunning) {
                    requestAnimationFrame(animatePosition);
                }
            };

            setTimeout(animatePosition, i * 5);
        });

        await this.delay(2500);
        this.showMessage('∞', '#fff');
        audioSystem.playSuccess();
    }

    showMessage(text, color = '#fff') {
        const msg = document.getElementById('binary-message');
        msg.textContent = text;
        msg.style.color = color;
        msg.style.opacity = '1';
        msg.style.textShadow = `0 0 30px ${color}`;
    }

    hideMessage() {
        const msg = document.getElementById('binary-message');
        msg.style.opacity = '0';
    }

    shakeScreen(duration) {
        document.body.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            document.body.style.animation = '';
        }, duration);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrame);

        document.getElementById('binary-container')?.remove();
        document.getElementById('session5-styles')?.remove();
    }
}

// Global instance
const session5Manager = new Session5Manager();
