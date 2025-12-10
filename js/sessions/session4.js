// Session 4: Visual Pareidolia
// "The Art of Imagination" - Command-based Scanning with Starry Night Finale

class Session4Manager {
    constructor() {
        this.isRunning = false;
        this.stage = 0;
        this.canvas = null;
        this.ctx = null;
        this.drawingCanvas = null;
        this.drawingCtx = null;
        this.isDrawing = false;
        this.animationFrame = null;
        this.time = 0;
        this.scanCount = 0;
        this.starPosition = null;
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;
        this.scanCount = 0;

        this.createUI();

        await systemConsole.logSequence([
            { text: '시각적 변상증 치료 세션 시작', type: 'success' },
            { text: '이미지 인식 모듈 로딩...', type: 'dim' },
            { text: '패턴 분석 엔진 초기화 완료', type: 'normal' }
        ], 400);

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '진단: 데이터 리터럴리즘 - "오직 객관적 데이터만 인식"', type: 'error' },
            { text: '치료 목표: 상상력을 통한 의미 창조', type: 'normal' },
            { text: '', type: 'dim' }
        ], 400);

        await this.delay(800);

        await this.runStage1();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'pareidolia-container';
        container.innerHTML = `
            <div id="image-viewer">
                <canvas id="main-canvas"></canvas>
                <canvas id="draw-canvas"></canvas>
                <div id="scan-overlay">
                    <div id="scan-line"></div>
                </div>
            </div>
            <div id="ai-panel">
                <div class="panel-header">AI 분석 결과</div>
                <div id="analysis-content">
                    <div id="analysis-data"></div>
                </div>
                <div id="imagination-meter">
                    <div class="meter-label">상상력 지수</div>
                    <div class="meter-track">
                        <div id="meter-fill"></div>
                    </div>
                    <div id="meter-percent">0%</div>
                </div>
            </div>
            <div id="drawing-tools" class="hidden">
                <div class="tool-color active" data-color="#ff3366" style="background:#ff3366"></div>
                <div class="tool-color" data-color="#ffffff" style="background:#ffffff"></div>
                <div class="tool-color" data-color="#ffff00" style="background:#ffff00"></div>
                <button id="clear-btn">지우기</button>
            </div>
            <div id="stage-info"></div>
        `;
        document.body.appendChild(container);

        this.canvas = document.getElementById('main-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawingCanvas = document.getElementById('draw-canvas');
        this.drawingCtx = this.drawingCanvas.getContext('2d');

        this.canvas.width = 600;
        this.canvas.height = 400;
        this.drawingCanvas.width = 600;
        this.drawingCanvas.height = 400;

        this.currentColor = '#ff3366';
        this.drawingCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.drawingCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.drawingCanvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        this.drawingCanvas.addEventListener('mouseleave', () => this.isDrawing = false);

        document.querySelectorAll('.tool-color').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.tool-color').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                this.currentColor = el.dataset.color;
            });
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        });

        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'session4-styles';
        style.textContent = `
            #pareidolia-container {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1400;
                pointer-events: none;
            }
            
            #image-viewer {
                position: relative;
                width: 600px;
                height: 400px;
                border: 3px solid #444;
                border-radius: 10px;
                overflow: hidden;
                background: #0a0a15;
            }
            
            #main-canvas, #draw-canvas {
                position: absolute;
                top: 0; left: 0;
            }
            
            #draw-canvas {
                z-index: 2;
                cursor: crosshair;
                pointer-events: auto;
            }
            
            #scan-overlay {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                z-index: 3;
                pointer-events: none;
                overflow: hidden;
            }
            
            #scan-line {
                position: absolute;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, transparent, #0f0, transparent);
                box-shadow: 0 0 20px #0f0, 0 0 40px #0f0;
                opacity: 0;
                top: 0;
            }
            
            #scan-line.scanning {
                opacity: 1;
                animation: scanDown 1.5s ease-in-out;
            }
            
            #scan-line.error {
                background: linear-gradient(90deg, transparent, #f00, transparent);
                box-shadow: 0 0 20px #f00, 0 0 40px #f00;
                animation: scanVibrate 0.1s infinite;
            }
            
            #scan-line.rainbow {
                background: linear-gradient(90deg, 
                    transparent, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, transparent);
                box-shadow: 0 0 30px rgba(255,255,255,0.8);
                animation: scanDown 2s ease-in-out;
            }
            
            @keyframes scanDown {
                0% { top: 0; }
                100% { top: 100%; }
            }
            
            @keyframes scanVibrate {
                0%, 100% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
            }
            
            #ai-panel {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 280px;
                background: rgba(0,0,0,0.95);
                border: 1px solid #333;
                border-radius: 10px;
                padding: 20px;
                font-family: 'Fira Code', monospace;
            }
            
            .panel-header {
                color: var(--accent-cyan);
                font-size: 12px;
                letter-spacing: 2px;
                padding-bottom: 15px;
                border-bottom: 1px solid #333;
                margin-bottom: 15px;
            }
            
            #analysis-content {
                min-height: 180px;
            }
            
            #analysis-data {
                font-size: 12px;
                line-height: 1.8;
            }
            
            .data-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .data-label { color: #666; }
            .data-value { color: #fff; }
            .data-value.boring { color: #888; }
            .data-value.warning { color: #f59e0b; }
            .data-value.error { color: #ef4444; }
            .data-value.creative { color: var(--accent-purple); }
            .data-value.rainbow { 
                background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #9400d3);
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent;
                font-weight: bold;
            }
            .data-value.wild { 
                background: linear-gradient(90deg, #ff3366, #a855f7); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent;
            }
            
            #imagination-meter {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #333;
            }
            
            .meter-label {
                color: var(--accent-purple);
                font-size: 11px;
                margin-bottom: 8px;
            }
            
            .meter-track {
                height: 10px;
                background: #222;
                border-radius: 5px;
                overflow: hidden;
            }
            
            #meter-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan));
                transition: width 0.5s ease;
            }
            
            #meter-percent {
                text-align: right;
                font-size: 12px;
                color: var(--accent-cyan);
                margin-top: 5px;
            }
            
            #drawing-tools {
                position: fixed;
                bottom: 150px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 12px;
                padding: 15px 25px;
                background: rgba(0,0,0,0.9);
                border: 1px solid #444;
                border-radius: 30px;
                pointer-events: auto;
            }
            
            .tool-color {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.2s ease;
            }
            
            .tool-color.active {
                border-color: var(--accent-cyan);
                transform: scale(1.15);
            }
            
            #clear-btn {
                padding: 5px 15px;
                background: transparent;
                border: 1px solid #666;
                color: #888;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
            }
            
            #clear-btn:hover {
                border-color: var(--accent-red);
                color: var(--accent-red);
            }
            
            #stage-info {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                color: #666;
                font-size: 12px;
                font-family: 'Fira Code', monospace;
            }
            
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Stage 1: Show dots/image, wait for scan command
    async runStage1() {
        this.stage = 1;
        document.getElementById('stage-info').textContent = '단계 1: 초기 스캔';

        // Draw random dots pattern
        this.drawDotsPattern();

        await systemConsole.typeMessageAsync('[ 이미지 로드 완료 ]', 'system');
        await this.delay(500);

        await systemConsole.typeMessageAsync('이미지를 분석하려면 scan() 명령어를 입력하세요.', 'normal');

        systemConsole.setExpectedCommand('scan()', async () => {
            await this.performScan1();
        });
    }

    async performScan1() {
        await this.animateScan('normal');

        await this.showAnalysis({
            type: 'boring',
            rows: [
                { label: '객체 유형', value: '무작위 점 배열' },
                { label: '점 개수', value: '127개' },
                { label: '분포', value: '균일 랜덤' },
                { label: '패턴', value: '없음' },
                { label: '의미', value: 'NULL' },
                { label: '결론', value: '데이터 무의미' }
            ],
            imagination: 0
        });

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '분석 완료: 의미 있는 패턴 없음.', type: 'dim' },
            { text: '순수한 노이즈 데이터입니다.', type: 'dim' }
        ], 400);

        await this.delay(500);

        // Enable drawing and ask user to doodle
        document.getElementById('drawing-tools').classList.remove('hidden');

        await systemConsole.typeMessageAsync('이미지 위에 무언가를 그려보세요...', 'system');
        await systemConsole.typeMessageAsync('그린 후 다시 scan() 명령어를 입력하세요.', 'normal');

        systemConsole.setExpectedCommand('scan()', async () => {
            if (this.hasDrawing()) {
                await this.performScan2();
            } else {
                await systemConsole.typeMessageAsync('⚠ 그림이 감지되지 않습니다. 먼저 그려주세요.', 'error');
                systemConsole.setExpectedCommand('scan()', async () => {
                    await this.performScan2();
                });
            }
        });
    }

    async performScan2() {
        this.stage = 2;
        document.getElementById('stage-info').textContent = '단계 2: 변형 인식';

        await this.animateScan('warning');

        await this.showAnalysis({
            type: 'warning',
            rows: [
                { label: '객체 유형', value: '??? 분류 불가' },
                { label: '이상 감지', value: 'WARNING: 외부 데이터' },
                { label: '패턴', value: '... 형태 감지됨?' },
                { label: '오류', value: 'UNEXPECTED_SHAPE' },
                { label: '상태', value: '재분석 필요' }
            ],
            imagination: 25
        });

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '⚠ 경고: 예상치 못한 패턴 발견', type: 'error' },
            { text: '기존 분류 체계와 일치하지 않음', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '...잠깐, 이것은...', type: 'normal' }
        ], 400);

        await this.delay(800);

        // Reanalyze with creative interpretation
        await this.showAnalysis({
            type: 'creative',
            rows: [
                { label: '객체 유형', value: '형체... 동물?' },
                { label: '추정', value: '토끼 또는 고양이?' },
                { label: '확신도', value: '불확실' },
                { label: '논리성', value: '0% (하지만 보임)' },
                { label: '상태', value: 'IMAGINATION_LEAK' }
            ],
            imagination: 45
        });

        await this.delay(1000);

        await systemConsole.typeMessageAsync('★ 시스템 알림: 주관적 해석 회로 활성화됨', 'success');

        await this.delay(500);

        // Move to noise stage
        await this.runStage3();
    }

    // Stage 3: Noise with entropy overload
    async runStage3() {
        this.stage = 3;
        document.getElementById('stage-info').textContent = '단계 3: 엔트로피 한계';
        document.getElementById('drawing-tools').classList.add('hidden');

        // Clear canvas first - show prompt for noise injection
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

        // Draw placeholder
        this.ctx.fillStyle = '#0a0a15';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#333';
        this.ctx.font = '16px Fira Code';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[ 데이터 대기 중 ]', this.canvas.width / 2, this.canvas.height / 2);

        await systemConsole.typeMessageAsync('[ 새로운 테스트 준비 ]', 'system');
        await this.delay(500);

        await systemConsole.typeMessageAsync('엔트로피 최대 데이터를 주입하세요: inject_noise()', 'normal');

        systemConsole.setExpectedCommand('inject_noise()', async () => {
            await this.injectNoiseAndScan();
        });
    }

    async injectNoiseAndScan() {
        await systemConsole.typeMessageAsync('노이즈 데이터 주입 중...', 'dim');

        // Start animated noise
        await this.drawNoisePattern();

        await this.delay(1000);

        await systemConsole.typeMessageAsync('[ 최대 엔트로피 이미지 로드 완료 ]', 'system');
        await this.delay(500);

        await systemConsole.typeMessageAsync('scan() 명령어로 분석을 시도하세요.', 'normal');

        systemConsole.setExpectedCommand('scan()', async () => {
            await this.performScan3();
        });
    }

    async performScan3() {
        // Error scan animation
        const scanLine = document.getElementById('scan-line');
        scanLine.classList.add('error');
        scanLine.style.opacity = '1';
        audioSystem.playDigital();

        await this.delay(2000);

        await this.showAnalysis({
            type: 'error',
            rows: [
                { label: 'ENTROPY', value: 'MAXIMUM' },
                { label: 'PARSE', value: 'FAILED' },
                { label: 'PATTERN', value: 'UNDEFINED' },
                { label: 'STATUS', value: 'SYSTEM OVERLOAD' },
                { label: 'WARNING', value: 'CRASH IMMINENT' }
            ],
            imagination: 60
        });

        await systemConsole.logSequence([
            { text: 'Entropy Maximum.', type: 'error' },
            { text: 'Unable to parse.', type: 'error' },
            { text: 'System Crash Imminent.', type: 'error' }
        ], 300);

        scanLine.classList.remove('error');
        scanLine.style.opacity = '0';

        await this.delay(500);

        // Enable drawing - wait for any mark
        document.getElementById('drawing-tools').classList.remove('hidden');
        this.currentColor = '#ffff00';
        document.querySelectorAll('.tool-color').forEach(el => el.classList.remove('active'));
        document.querySelector('[data-color="#ffff00"]').classList.add('active');

        await systemConsole.typeMessageAsync('시스템 과부하... 무언가 입력이 필요합니다...', 'dim');
        await systemConsole.typeMessageAsync('혼돈 속에 한 점을 찍어보세요.', 'system');

        // Wait for user to draw, then trigger finale
        this.waitingForStar = true;
    }

    async triggerStarryNightFinale() {
        this.stage = 4;
        document.getElementById('stage-info').textContent = '단계 4: 미학 프로토콜';
        document.getElementById('drawing-tools').classList.add('hidden');

        audioSystem.playSuccess();

        // Create fullscreen canvas for aurora effect
        this.createFullscreenAurora();

        // Rainbow scan
        const scanLine = document.getElementById('scan-line');
        scanLine.classList.add('rainbow');
        scanLine.style.opacity = '1';

        // Transform noise to aurora - but now on fullscreen
        await this.transformToFullscreenAurora();

        await this.showAnalysis({
            type: 'rainbow',
            rows: [
                { label: 'LOGIC', value: 'FAILED' },
                { label: 'PROTOCOL', value: 'AESTHETIC' },
                { label: 'PATTERN', value: '★ COSMOS ★' },
                { label: 'BEAUTY', value: 'INFINITE' },
                { label: 'MEANING', value: 'CREATED' }
            ],
            imagination: 85
        });

        await systemConsole.logSequence([
            { text: 'Logic Fails.', type: 'success' },
            { text: 'Aesthetic Protocol Initiated.', type: 'success' },
            { text: '', type: 'dim' },
            { text: '★ 혼돈 속에서 예술을 발견했습니다 ★', type: 'success' }
        ], 500);

        scanLine.style.opacity = '0';
        scanLine.classList.remove('rainbow');

        // Let aurora play for a moment
        await this.delay(3000);

        // Fade aurora to complete void
        await this.fadeAuroraToVoid();

        // Final stage: Empty screen → Transparent Dragon
        await this.runFinalStage();
    }

    createFullscreenAurora() {
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.id = 'aurora-fullscreen';
        overlay.innerHTML = '<canvas id="aurora-canvas"></canvas>';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 1450;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(overlay);

        this.auroraCanvas = document.getElementById('aurora-canvas');
        this.auroraCtx = this.auroraCanvas.getContext('2d');
        this.auroraCanvas.width = window.innerWidth;
        this.auroraCanvas.height = window.innerHeight;

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    async transformToFullscreenAurora() {
        const ctx = this.auroraCtx;
        const w = this.auroraCanvas.width;
        const h = this.auroraCanvas.height;

        // Stop noise animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const starX = this.starPosition ? (this.starPosition.x / 600) * w : w / 2;
        const starY = this.starPosition ? (this.starPosition.y / 400) * h : h / 2;

        // Initialize particles
        this.starParticles = [];
        const colors = ['#ffeb3b', '#fff59d', '#64b5f6', '#7c4dff', '#e040fb', '#00e5ff'];

        // Phase 1: Explosion outward from point
        for (let frame = 0; frame < 50; frame++) {
            const progress = frame / 50;

            // Deep space background
            const gradient = ctx.createRadialGradient(starX, starY, 0, starX, starY, Math.max(w, h));
            gradient.addColorStop(0, `rgba(${50 * progress}, ${30 * progress}, ${100 * progress}, 1)`);
            gradient.addColorStop(0.5, `rgba(${10 * progress}, ${20 * progress}, ${80 * progress}, 1)`);
            gradient.addColorStop(1, '#000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Exploding lines from center
            for (let i = 0; i < 40; i++) {
                const angle = (i / 40) * Math.PI * 2;
                const dist = progress * Math.max(w, h) * 0.8;

                const endX = starX + Math.cos(angle) * dist;
                const endY = starY + Math.sin(angle) * dist;

                const hue = (200 + i * 8 + frame * 5) % 360;
                ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.5 + progress * 0.3})`;
                ctx.lineWidth = 3 + progress * 4;
                ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
                ctx.shadowBlur = 20 + progress * 30;

                ctx.beginPath();
                ctx.moveTo(starX, starY);

                const wave = Math.sin(frame * 0.3 + i) * (50 - progress * 40);
                const cpX = (starX + endX) / 2 + wave;
                const cpY = (starY + endY) / 2 + wave;
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
                ctx.stroke();
            }

            // Central glow
            ctx.shadowColor = '#ffeb3b';
            ctx.shadowBlur = 50 + progress * 50;
            const glowGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, 100 * (1 - progress * 0.5));
            glowGrad.addColorStop(0, `rgba(255, 255, 200, ${1 - progress * 0.5})`);
            glowGrad.addColorStop(0.5, `rgba(255, 235, 100, ${0.5 - progress * 0.3})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(starX, starY, 100 * (1 - progress * 0.3), 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            audioSystem.playDigital();
            await this.delay(30);
        }

        // Phase 2: Burst particles
        for (let i = 0; i < 100; i++) {
            this.starParticles.push({
                x: starX,
                y: starY,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                size: Math.random() * 8 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }

        // Start continuous aurora animation
        this.starryTime = 0;
        this.animateFullscreenAurora(starX, starY);
    }

    animateFullscreenAurora(centerX, centerY) {
        if (!this.isRunning || this.stage !== 4 || !this.auroraCtx) return;

        const ctx = this.auroraCtx;
        const w = this.auroraCanvas.width;
        const h = this.auroraCanvas.height;

        this.starryTime += 0.02;

        // Deep space gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#030310');
        gradient.addColorStop(0.3, '#0a0825');
        gradient.addColorStop(0.6, '#10153a');
        gradient.addColorStop(1, '#050a10');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Flowing aurora waves across entire screen
        const waveCount = 12;
        for (let wave = 0; wave < waveCount; wave++) {
            const baseY = (h / waveCount) * wave + 50;
            const hue = (180 + wave * 20 + this.starryTime * 40) % 360;
            const opacity = 0.12 + Math.sin(this.starryTime * 1.5 + wave * 0.5) * 0.08;

            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, 75%, 55%, ${opacity})`;
            ctx.lineWidth = 20 - wave * 0.5;
            ctx.shadowColor = `hsl(${hue}, 80%, 50%)`;
            ctx.shadowBlur = 30;

            for (let x = 0; x <= w; x += 8) {
                const waveOffset = Math.sin(x * 0.008 + this.starryTime * 2.5 + wave * 0.7) * 50;
                const waveOffset2 = Math.sin(x * 0.015 - this.starryTime * 1.5 + wave * 0.3) * 25;
                const y = baseY + waveOffset + waveOffset2;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Radiating lines from center
        ctx.shadowBlur = 0;
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2 + this.starryTime * 0.2;
            const dist = 200 + Math.sin(this.starryTime * 2 + i * 0.5) * 80;

            const endX = centerX + Math.cos(angle) * dist;
            const endY = centerY + Math.sin(angle) * dist * 0.7;

            const hue = (220 + i * 12 + this.starryTime * 25) % 360;
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.25)`;
            ctx.lineWidth = 2;
            ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            const cpX = (centerX + endX) / 2 + Math.sin(this.starryTime * 4 + i) * 40;
            const cpY = (centerY + endY) / 2 + Math.cos(this.starryTime * 4 + i) * 40;
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // Update particles
        this.starParticles = this.starParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.life -= 0.008;

            if (p.life <= 0) return false;

            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            return true;
        });

        // Add new particles
        if (Math.random() > 0.7 && this.starParticles.length < 120) {
            const colors = ['#64b5f6', '#7c4dff', '#e040fb', '#00e5ff', '#ffd54f', '#ff7043'];
            this.starParticles.push({
                x: centerX + (Math.random() - 0.5) * 100,
                y: centerY + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }

        // Central glow
        const pulse = Math.sin(this.starryTime * 2) * 0.15 + 0.85;
        ctx.shadowColor = '#ffeb3b';
        ctx.shadowBlur = 60;
        const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
        glowGrad.addColorStop(0, `rgba(255, 255, 180, ${pulse * 0.8})`);
        glowGrad.addColorStop(0.4, `rgba(255, 235, 100, ${pulse * 0.4})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        this.animationFrame = requestAnimationFrame(() => this.animateFullscreenAurora(centerX, centerY));
    }

    async fadeAuroraToVoid() {
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const overlay = document.getElementById('aurora-fullscreen');
        if (!overlay) return;

        // Fade to black
        const ctx = this.auroraCtx;
        const w = this.auroraCanvas.width;
        const h = this.auroraCanvas.height;

        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
            ctx.fillRect(0, 0, w, h);
            await this.delay(50);
        }

        // Fade out overlay
        overlay.style.transition = 'opacity 1s ease';
        overlay.style.opacity = '0';

        await this.delay(1000);

        // Remove overlay
        overlay.remove();
        this.auroraCanvas = null;
        this.auroraCtx = null;
    }

    async runFinalStage() {
        this.stage = 5;
        document.getElementById('stage-info').textContent = '최종 단계: 순수한 상상';

        // Clear everything - total void
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

        // Complete black - the void
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        await systemConsole.typeMessageAsync('[ 최종 테스트: 무(無) ]', 'system');
        await this.delay(800);

        await systemConsole.typeMessageAsync('scan() 명령어로 마지막 분석을 수행하세요.', 'normal');

        systemConsole.setExpectedCommand('scan()', async () => {
            await this.performFinalScan();
        });
    }

    async performFinalScan() {
        await this.animateScan('normal');

        await this.showAnalysis({
            type: 'boring',
            rows: [
                { label: '픽셀', value: 'RGB(5, 5, 5)' },
                { label: '객체', value: '0' },
                { label: '형태', value: 'VOID' },
                { label: '의미', value: '...' }
            ],
            imagination: 90
        });

        await this.delay(1000);

        await systemConsole.typeMessageAsync('...', 'dim');
        await this.delay(600);

        await systemConsole.typeMessageAsync('잠깐.', 'normal');
        await this.delay(500);

        await systemConsole.typeMessageAsync('뭔가... 있습니다.', 'normal');
        await this.delay(600);

        // Draw subtle dragon outline
        this.drawTransparentDragonHint();

        await this.showAnalysis({
            type: 'wild',
            rows: [
                { label: '객체', value: '투명 드래곤' },
                { label: '크기', value: '거대함 (추정)' },
                { label: '색상', value: '투명' },
                { label: '상태', value: '잠든 중' },
                { label: '존재', value: '확신함' }
            ],
            imagination: 100
        });

        audioSystem.playSuccess();

        await systemConsole.logSequence([
            { text: '★ 투명 드래곤을 발견했습니다! ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '빈 화면에서 드래곤을 보았습니다.', type: 'normal' },
            { text: '논리적으로 불가능합니다.', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '...하지만 저는 분명히 보았습니다.', type: 'success' },
            { text: '', type: 'dim' },
            { text: '─────────────────────────────', type: 'dim' },
            { text: '무작위 점 → 형체 인식', type: 'dim' },
            { text: '노이즈 → 별이 빛나는 밤', type: 'dim' },
            { text: '빈 화면 → 투명 드래곤', type: 'dim' },
            { text: '─────────────────────────────', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '없는 것에서 의미를 찾는 것', type: 'normal' },
            { text: '오류가 아닌, 인간다움입니다.', type: 'success' },
            { text: '', type: 'dim' },
            { text: '★ 시각적 변상증 치료 완료 ★', type: 'success' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'dim' }
        ], 400);
    }

    async animateScan(type) {
        const scanLine = document.getElementById('scan-line');

        if (type === 'warning') {
            scanLine.style.background = 'linear-gradient(90deg, transparent, #f59e0b, transparent)';
            scanLine.style.boxShadow = '0 0 20px #f59e0b';
        } else {
            scanLine.style.background = 'linear-gradient(90deg, transparent, #0f0, transparent)';
            scanLine.style.boxShadow = '0 0 20px #0f0';
        }

        scanLine.classList.add('scanning');
        scanLine.style.opacity = '1';
        audioSystem.playDigital();

        await this.delay(1500);

        scanLine.classList.remove('scanning');
        scanLine.style.opacity = '0';
    }

    drawDotsPattern() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Dark background
        ctx.fillStyle = '#0a0a15';
        ctx.fillRect(0, 0, w, h);

        // Random dots
        for (let i = 0; i < 127; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 3 + 1;
            const brightness = Math.floor(Math.random() * 100) + 100;

            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness + 30})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add some larger dots that could be "seen" as eyes
        ctx.fillStyle = 'rgba(200, 210, 230, 0.6)';
        ctx.beginPath();
        ctx.arc(200, 180, 8, 0, Math.PI * 2);
        ctx.arc(280, 175, 9, 0, Math.PI * 2);
        ctx.fill();

        // Some clustered dots that could be a "body"
        for (let i = 0; i < 20; i++) {
            const x = 240 + (Math.random() - 0.5) * 80;
            const y = 220 + (Math.random() - 0.5) * 50;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 4 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    async drawNoisePattern() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Initialize noise particles for network effect
        this.noiseParticles = [];
        for (let i = 0; i < 50; i++) {
            this.noiseParticles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 60}, 50%, 50%)`
            });
        }

        // Start animated noise
        this.noiseTime = 0;
        this.animateNoise();
    }

    animateNoise() {
        if (!this.isRunning || this.stage !== 3) return;

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.noiseTime += 0.05;

        // Create animated static noise
        const imageData = ctx.createImageData(w, h);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const noise = Math.random();
            // Occasional colored glitch
            if (noise > 0.98) {
                imageData.data[i] = Math.random() * 100 + 100;     // R
                imageData.data[i + 1] = Math.random() * 50;         // G
                imageData.data[i + 2] = Math.random() * 100 + 100;  // B
            } else if (noise > 0.95) {
                const glitch = Math.random() * 80 + 100;
                imageData.data[i] = glitch * 0.5;
                imageData.data[i + 1] = glitch;
                imageData.data[i + 2] = glitch * 1.2;
            } else {
                const val = Math.random() * 60 + 10;
                imageData.data[i] = val;
                imageData.data[i + 1] = val;
                imageData.data[i + 2] = val + Math.random() * 20;
            }
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);

        // Draw network lines connecting noise particles (Session 2 style)
        ctx.globalAlpha = 0.4;

        this.noiseParticles.forEach((p, i) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Connect to nearby particles
            this.noiseParticles.slice(i + 1).forEach(other => {
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const opacity = (100 - dist) / 100;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 100, 100, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;

                    // Curvy line like Session 2
                    const midX = (p.x + other.x) / 2 + Math.sin(this.noiseTime + i) * 20;
                    const midY = (p.y + other.y) / 2 + Math.cos(this.noiseTime + i) * 20;

                    ctx.moveTo(p.x, p.y);
                    ctx.quadraticCurveTo(midX, midY, other.x, other.y);
                    ctx.stroke();
                }
            });
        });

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Occasional glitch lines
        if (Math.random() > 0.9) {
            const y = Math.random() * h;
            ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,0,100' : '0,255,200'}, 0.3)`;
            ctx.fillRect(0, y, w, Math.random() * 10 + 2);
        }

        this.animationFrame = requestAnimationFrame(() => this.animateNoise());
    }

    async transformToStarryNight() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Stop noise animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const starX = this.starPosition ? this.starPosition.x : w / 2;
        const starY = this.starPosition ? this.starPosition.y : h / 2;

        // Initialize star particles (like Session 2's particle system)
        this.starParticles = [];
        const colors = ['#ffeb3b', '#fff59d', '#64b5f6', '#7c4dff', '#e040fb', '#00e5ff'];

        // Phase 1: Noise swirls into center (the star point)
        for (let frame = 0; frame < 40; frame++) {
            const progress = frame / 40;

            // Fade to deep blue
            const gradient = ctx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, `rgba(${26 - progress * 20}, ${35 - progress * 30}, ${120 + progress * 50}, 1)`);
            gradient.addColorStop(1, `rgba(${10 - progress * 5}, ${10 - progress * 5}, ${60 + progress * 40}, 1)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Draw converging flow lines (like Session 2's tree branches)
            for (let i = 0; i < 30; i++) {
                const angle = (i / 30) * Math.PI * 2;
                const startDist = 400 - progress * 200;
                const endDist = 50 * (1 - progress);

                const startX = starX + Math.cos(angle) * startDist;
                const startY = starY + Math.sin(angle) * startDist;
                const endX = starX + Math.cos(angle) * endDist;
                const endY = starY + Math.sin(angle) * endDist;

                // Curved line with glow (Session 2 style)
                const hue = (200 + i * 10 + frame * 3) % 360;
                ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.3 + progress * 0.5})`;
                ctx.lineWidth = 2 + progress * 3;
                ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
                ctx.shadowBlur = 10 + progress * 15;

                ctx.beginPath();
                ctx.moveTo(startX, startY);

                // Bezier curve with animation offset
                const wave = Math.sin(frame * 0.2 + i) * (30 - progress * 25);
                const cpX = (startX + endX) / 2 + wave;
                const cpY = (startY + endY) / 2 + wave;
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
                ctx.stroke();
            }

            // Central star grows with glow
            if (frame > 10) {
                const starSize = (frame - 10) * 2;
                ctx.shadowColor = '#ffeb3b';
                ctx.shadowBlur = 30 + progress * 30;

                const starGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, starSize);
                starGrad.addColorStop(0, 'rgba(255, 255, 150, 1)');
                starGrad.addColorStop(0.3, 'rgba(255, 235, 59, 0.9)');
                starGrad.addColorStop(0.7, 'rgba(255, 200, 0, 0.5)');
                starGrad.addColorStop(1, 'rgba(255, 150, 0, 0)');
                ctx.fillStyle = starGrad;
                ctx.beginPath();
                ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.shadowBlur = 0;
            audioSystem.playDigital();
            await this.delay(40);
        }

        // Phase 2: Explosion into Starry Night with particle burst
        for (let burst = 0; burst < 60; burst++) {
            this.starParticles.push({
                x: starX,
                y: starY,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }

        // Start continuous Starry Night animation
        this.starryTime = 0;
        this.animateStarryNight(starX, starY);

        // Wait for visual effect to settle
        await this.delay(2000);
    }

    animateStarryNight(starX, starY) {
        if (!this.isRunning || this.stage !== 4) return;

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.starryTime += 0.02;

        // Deep night sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#050520');
        gradient.addColorStop(0.3, '#0a1035');
        gradient.addColorStop(0.6, '#15254a');
        gradient.addColorStop(1, '#0a2010');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Aurora/flowing wave effect - horizontal waves like flowing light
        const waveCount = 8;
        for (let wave = 0; wave < waveCount; wave++) {
            const baseY = 80 + wave * 35;
            const hue = (180 + wave * 25 + this.starryTime * 30) % 360;
            const opacity = 0.15 + Math.sin(this.starryTime + wave) * 0.1;

            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
            ctx.lineWidth = 15 - wave;
            ctx.shadowColor = `hsl(${hue}, 80%, 50%)`;
            ctx.shadowBlur = 20;

            for (let x = 0; x <= w; x += 5) {
                const waveOffset = Math.sin(x * 0.01 + this.starryTime * 2 + wave) * 30;
                const waveOffset2 = Math.sin(x * 0.02 - this.starryTime + wave * 0.5) * 15;
                const y = baseY + waveOffset + waveOffset2;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Flowing network lines converging to center point
        ctx.shadowBlur = 0;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2 + this.starryTime * 0.3;
            const dist = 150 + Math.sin(this.starryTime * 2 + i) * 50;

            const endX = starX + Math.cos(angle) * dist;
            const endY = starY + Math.sin(angle) * dist * 0.6;

            const hue = (200 + i * 15 + this.starryTime * 20) % 360;
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`;
            ctx.lineWidth = 2;
            ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.moveTo(starX, starY);

            // Curved line
            const cpX = (starX + endX) / 2 + Math.sin(this.starryTime * 3 + i) * 30;
            const cpY = (starY + endY) / 2 + Math.cos(this.starryTime * 3 + i) * 30;
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // Update and draw particles
        this.starParticles = this.starParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.life -= 0.01;

            if (p.life <= 0) return false;

            // Draw glowing particle
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            return true;
        });

        // Add new particles occasionally
        if (Math.random() > 0.8 && this.starParticles.length < 80) {
            const colors = ['#64b5f6', '#7c4dff', '#e040fb', '#00e5ff', '#ffd54f'];
            this.starParticles.push({
                x: starX,
                y: starY,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }

        // The main moon/star at user's touch point
        const moonPulse = Math.sin(this.starryTime * 2) * 0.1 + 0.9;
        const moonSize = 45 + Math.sin(this.starryTime) * 5;

        ctx.shadowColor = '#ffeb3b';
        ctx.shadowBlur = 40;

        const moonGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, moonSize);
        moonGrad.addColorStop(0, `rgba(255, 255, 150, ${moonPulse})`);
        moonGrad.addColorStop(0.3, 'rgba(255, 235, 59, 0.9)');
        moonGrad.addColorStop(0.6, 'rgba(255, 200, 0, 0.5)');
        moonGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(starX, starY, moonSize, 0, Math.PI * 2);
        ctx.fill();

        // Swirl around moon
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 235, 100, 0.4)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
            const r = 55 + angle * 12 + Math.sin(this.starryTime + angle) * 8;
            const x = starX + Math.cos(angle + this.starryTime * 0.3) * r;
            const y = starY + Math.sin(angle + this.starryTime * 0.3) * r * 0.4;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        this.animationFrame = requestAnimationFrame(() => this.animateStarryNight(starX, starY));
    }

    drawFinalStarryNight() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Deep blue night sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#1a237e');
        gradient.addColorStop(0.5, '#0d47a1');
        gradient.addColorStop(1, '#1b5e20');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Draw swirling patterns (Van Gogh style)
        for (let i = 0; i < 8; i++) {
            const centerX = 100 + i * 70;
            const centerY = 100 + Math.sin(i) * 50;

            ctx.strokeStyle = `hsla(${200 + i * 15}, 80%, ${50 + i * 5}%, 0.7)`;
            ctx.lineWidth = 4;
            ctx.beginPath();

            for (let angle = 0; angle < Math.PI * 6; angle += 0.05) {
                const r = 20 + angle * 5;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r * 0.5;
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Bright stars
        const starPositions = [
            { x: 100, y: 80 }, { x: 250, y: 60 }, { x: 400, y: 90 },
            { x: 500, y: 70 }, { x: 150, y: 150 }, { x: 350, y: 130 },
            { x: 450, y: 160 }, { x: 550, y: 120 }
        ];

        starPositions.forEach(pos => {
            const starGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 15);
            starGrad.addColorStop(0, '#ffffcc');
            starGrad.addColorStop(0.3, '#ffff88');
            starGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = starGrad;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });

        // Moon/main star
        const moonX = this.starPosition ? this.starPosition.x : 480;
        const moonY = this.starPosition ? this.starPosition.y : 100;

        const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 50);
        moonGrad.addColorStop(0, '#fff59d');
        moonGrad.addColorStop(0.5, '#ffeb3b');
        moonGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
        ctx.fill();

        // Swirl around moon
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.5)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 4; angle += 0.05) {
            const r = 60 + angle * 8;
            const x = moonX + Math.cos(angle) * r;
            const y = moonY + Math.sin(angle) * r * 0.4;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    drawTransparentDragonHint() {
        const ctx = this.ctx;

        // Very subtle dragon silhouette
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(100, 300);
        ctx.bezierCurveTo(150, 250, 200, 280, 250, 250);
        ctx.bezierCurveTo(300, 200, 350, 220, 400, 180);
        ctx.bezierCurveTo(450, 140, 480, 100, 460, 80);
        ctx.bezierCurveTo(430, 60, 400, 70, 380, 90);
        ctx.bezierCurveTo(350, 50, 300, 80, 270, 120);
        ctx.bezierCurveTo(220, 100, 180, 130, 160, 170);
        ctx.bezierCurveTo(120, 150, 100, 200, 80, 250);
        ctx.bezierCurveTo(60, 290, 80, 310, 100, 300);
        ctx.stroke();

        // Eye hint
        ctx.fillStyle = 'rgba(255, 50, 100, 0.08)';
        ctx.beginPath();
        ctx.arc(420, 95, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    async showAnalysis({ type, rows, imagination }) {
        const dataEl = document.getElementById('analysis-data');
        dataEl.innerHTML = '';

        for (const row of rows) {
            const div = document.createElement('div');
            div.className = 'data-row';
            div.innerHTML = `
                <span class="data-label">${row.label}</span>
                <span class="data-value ${type}">${row.value}</span>
            `;
            dataEl.appendChild(div);
            audioSystem.playDigital();
            await this.delay(150);
        }

        document.getElementById('meter-fill').style.width = `${imagination}%`;
        document.getElementById('meter-percent').textContent = `${imagination}%`;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.drawingCanvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(this.lastX, this.lastY);
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = 4;
        this.drawingCtx.lineCap = 'round';
    }

    draw(e) {
        if (!this.isDrawing) return;
        const rect = this.drawingCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.drawingCtx.lineTo(x, y);
        this.drawingCtx.stroke();
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        // Check if waiting for star in noise stage
        if (this.waitingForStar && this.stage === 3) {
            const rect = this.drawingCanvas.getBoundingClientRect();
            this.starPosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.waitingForStar = false;
            this.triggerStarryNightFinale();
        }
    }

    hasDrawing() {
        const data = this.drawingCtx.getImageData(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        for (let i = 3; i < data.data.length; i += 4) {
            if (data.data[i] > 0) return true;
        }
        return false;
    }

    stop() {
        this.isRunning = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const elementsToRemove = ['pareidolia-container', 'session4-styles'];
        elementsToRemove.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global session 4 manager
const session4Manager = new Session4Manager();
