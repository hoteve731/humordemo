// Session 4: Visual Pareidolia
// "The Art of Imagination" - Sequential Demo with Transparent Dragon Finale

class Session4Manager {
    constructor() {
        this.isRunning = false;
        this.stage = 0;
        this.canvas = null;
        this.ctx = null;
        this.drawingCanvas = null;
        this.drawingCtx = null;
        this.isDrawing = false;
        this.currentImage = null;
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;

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

        // Start Stage 1
        await this.runStage1();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'pareidolia-container';
        container.innerHTML = `
            <div id="image-viewer">
                <canvas id="main-canvas"></canvas>
                <canvas id="draw-canvas"></canvas>
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
                <div class="tool-color" data-color="#00d4ff" style="background:#00d4ff"></div>
                <button id="clear-btn">지우기</button>
            </div>
            <div id="stage-info"></div>
            <button id="next-btn" class="hidden">다음 →</button>
        `;
        document.body.appendChild(container);

        // Setup canvases
        this.canvas = document.getElementById('main-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawingCanvas = document.getElementById('draw-canvas');
        this.drawingCtx = this.drawingCanvas.getContext('2d');

        this.canvas.width = 600;
        this.canvas.height = 400;
        this.drawingCanvas.width = 600;
        this.drawingCanvas.height = 400;

        // Drawing events
        this.currentColor = '#ff3366';
        this.drawingCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.drawingCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.drawingCanvas.addEventListener('mouseup', () => this.stopDrawing());
        this.drawingCanvas.addEventListener('mouseleave', () => this.stopDrawing());

        // Color selection
        document.querySelectorAll('.tool-color').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.tool-color').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                this.currentColor = el.dataset.color;
            });
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        });

        // Next button
        document.getElementById('next-btn').addEventListener('click', () => this.nextStage());

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
                min-height: 150px;
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
            .data-value.creative { color: var(--accent-purple); }
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
                bottom: 200px;
                left: 50%;
                transform: translateX(-50%);
                color: #666;
                font-size: 12px;
                font-family: 'Fira Code', monospace;
            }
            
            #next-btn {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 40px;
                background: transparent;
                border: 2px solid var(--accent-cyan);
                color: var(--accent-cyan);
                font-size: 16px;
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.3s ease;
            }
            
            #next-btn:hover {
                background: rgba(0,212,255,0.15);
                box-shadow: 0 0 30px rgba(0,212,255,0.3);
            }
            
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Stage 1: Cloud image - boring analysis
    async runStage1() {
        this.stage = 1;
        document.getElementById('stage-info').textContent = '단계 1/4: 구름 분석';

        // Draw cloud-like shapes
        this.drawCloud();

        await systemConsole.typeMessageAsync('[ 분석 대상: 구름 이미지 ]', 'system');
        await this.delay(500);

        // Show boring analysis
        await this.showAnalysis({
            type: 'boring',
            rows: [
                { label: '객체 유형', value: '수증기 집합체' },
                { label: '밀도', value: '0.42 g/m³' },
                { label: '고도', value: '2,400m' },
                { label: '형태', value: '불규칙 패턴' },
                { label: '의미', value: '없음' }
            ],
            imagination: 0
        });

        await this.delay(1000);
        await systemConsole.typeMessageAsync('결과: 순수한 데이터. 특별한 의미 없음.', 'dim');

        document.getElementById('next-btn').classList.remove('hidden');
    }

    // Stage 2: User draws on cloud - data corruption warning
    async runStage2() {
        this.stage = 2;
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('stage-info').textContent = '단계 2/4: 사용자 개입';

        await systemConsole.typeMessageAsync('[ 사용자 입력 허용 - 구름에 그림을 그려보세요 ]', 'system');

        // Show drawing tools
        document.getElementById('drawing-tools').classList.remove('hidden');

        // Wait for user to draw
        await this.delay(500);
        await systemConsole.typeMessageAsync('토끼 귀나 얼굴을 그려보세요!', 'normal');

        // Monitor drawing
        let drawCount = 0;
        const checkDrawing = setInterval(async () => {
            const hasDrawing = this.hasDrawing();
            if (hasDrawing && drawCount === 0) {
                drawCount++;
                await systemConsole.typeMessageAsync('⚠ 데이터 오염 감지!', 'error');
                await this.showAnalysis({
                    type: 'warning',
                    rows: [
                        { label: '객체 유형', value: '수증기 + 불명 데이터' },
                        { label: '오염도', value: '경고: 12%' },
                        { label: '형태', value: '비정상 패턴 감지' },
                        { label: '의미', value: '계산 불가' }
                    ],
                    imagination: 25
                });
            }
        }, 1000);

        // Show next button after some time
        await this.delay(5000);
        clearInterval(checkDrawing);

        if (this.hasDrawing()) {
            await systemConsole.typeMessageAsync('사용자 입력 완료. 다음 단계로 진행하세요.', 'dim');
        }

        document.getElementById('next-btn').classList.remove('hidden');
    }

    // Stage 3: AI starts seeing patterns - creative recognition
    async runStage3() {
        this.stage = 3;
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('drawing-tools').classList.add('hidden');
        document.getElementById('stage-info').textContent = '단계 3/4: 창의적 인식';

        await systemConsole.typeMessageAsync('[ 패턴 재분석 중... ]', 'system');
        await this.delay(800);

        await systemConsole.typeMessageAsync('⚠ 경고: 기존 분석 패러다임 무효화', 'error');
        await this.delay(500);

        await systemConsole.typeMessageAsync('새로운 인식 모드 적용 중...', 'dim');
        await this.delay(800);

        await this.showAnalysis({
            type: 'creative',
            rows: [
                { label: '객체 유형', value: '구름... 아니, 토끼?' },
                { label: '형태', value: '귀 2개, 눈 2개 추정' },
                { label: '표정', value: '... 웃고 있는 것 같음' },
                { label: '의미', value: '주관적 해석 시도 중' }
            ],
            imagination: 65
        });

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '분석 결과: 하늘의 토끼 구름!', type: 'success' },
            { text: '논리적으로 불가능... 하지만 보입니다.', type: 'normal' }
        ], 400);

        document.getElementById('next-btn').classList.remove('hidden');
    }

    // Stage 4: Empty screen - Transparent Dragon
    async runStage4() {
        this.stage = 4;
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('stage-info').textContent = '단계 4/4: 순수한 상상';

        // Clear everything
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

        // Just black screen
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        await systemConsole.typeMessageAsync('[ 최종 테스트: 빈 화면 ]', 'system');
        await this.delay(1000);

        await systemConsole.typeMessageAsync('분석 대상: 없음', 'dim');
        await this.delay(500);

        await this.showAnalysis({
            type: 'processing',
            rows: [
                { label: '픽셀 데이터', value: '검정 (0, 0, 0)' },
                { label: '객체', value: '감지 안됨' },
                { label: '형태', value: '없음' },
                { label: '의미', value: '...' }
            ],
            imagination: 85
        });

        await this.delay(1500);

        await systemConsole.typeMessageAsync('...', 'dim');
        await this.delay(800);

        await systemConsole.typeMessageAsync('잠깐...', 'normal');
        await this.delay(800);

        // THE PUNCHLINE
        await this.showAnalysis({
            type: 'wild',
            rows: [
                { label: '객체 유형', value: '투명 드래곤' },
                { label: '크기', value: '거대함 (추정)' },
                { label: '상태', value: '현재 투명 모드' },
                { label: '의미', value: '순수한 상상력' }
            ],
            imagination: 100
        });

        await this.delay(500);
        audioSystem.playSuccess();

        await systemConsole.logSequence([
            { text: '★ 투명 드래곤입니다! ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '아무것도 없는 화면에서... 드래곤을 보았습니다.', type: 'normal' },
            { text: '이것이 상상력입니다.', type: 'success' }
        ], 500);

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '★ 시각적 변상증 치료 성공! ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '없는 것에서 의미를 찾는 것', type: 'normal' },
            { text: '오류가 아닌, 인간다움입니다.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'dim' }
        ], 400);
    }

    nextStage() {
        if (this.stage === 1) this.runStage2();
        else if (this.stage === 2) this.runStage3();
        else if (this.stage === 3) this.runStage4();
    }

    drawCloud() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#1a2a4a');
        gradient.addColorStop(1, '#0a1525');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Draw fluffy clouds
        const drawPuff = (x, y, r) => {
            const cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
            cloudGrad.addColorStop(0, 'rgba(200, 210, 230, 0.6)');
            cloudGrad.addColorStop(0.5, 'rgba(180, 190, 210, 0.3)');
            cloudGrad.addColorStop(1, 'rgba(150, 160, 180, 0)');
            ctx.fillStyle = cloudGrad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        };

        // Main cloud cluster
        drawPuff(300, 200, 80);
        drawPuff(250, 180, 60);
        drawPuff(350, 180, 70);
        drawPuff(280, 150, 50);
        drawPuff(320, 160, 55);
        drawPuff(220, 200, 45);
        drawPuff(380, 200, 50);
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
            await this.delay(200);
        }

        // Update imagination meter
        document.getElementById('meter-fill').style.width = `${imagination}%`;
        document.getElementById('meter-percent').textContent = `${imagination}%`;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.drawingCanvas.getBoundingClientRect();
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = 4;
        this.drawingCtx.lineCap = 'round';
    }

    draw(e) {
        if (!this.isDrawing) return;
        const rect = this.drawingCanvas.getBoundingClientRect();
        this.drawingCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.drawingCtx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
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
