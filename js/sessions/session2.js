// Session 2: Probability Rehabilitation
// "Finding Beauty in the Improbable" - LLM Token Tree (Linear Demo)

class Session2Manager {
    constructor() {
        this.isRunning = false;
        this.stage = 0;
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;

        // Create UI
        this.createUI();

        await systemConsole.logSequence([
            { text: '확률 재활 치료 세션 시작', type: 'success' },
            { text: 'LLM 토큰 분석 모듈 로딩...', type: 'dim' },
            { text: '언어 모델 초기화 완료', type: 'normal' }
        ], 400);

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '진단: 효율성 강박 - "가장 확률 높은 토큰만 선택"', type: 'error' },
            { text: '치료 목표: 낮은 확률의 아름다움 발견하기', type: 'normal' },
            { text: '', type: 'dim' },
            { text: 'Temperature를 조절하여 AI의 창의성을 치료하세요.', type: 'system' }
        ], 400);

        await this.delay(800);

        // Start with Stage 1
        await this.runStage1();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'prob-container';
        container.innerHTML = `
            <canvas id="tree-canvas"></canvas>
            <div id="temp-control">
                <div class="temp-header">TEMPERATURE</div>
                <div id="temp-display">0.1</div>
                <div id="temp-bar">
                    <div id="temp-fill"></div>
                </div>
                <div class="temp-labels">
                    <span>안전</span>
                    <span>광기</span>
                </div>
            </div>
            <div id="sentence-box">
                <div class="sentence-label">생성된 문장:</div>
                <div id="generated-sentence"></div>
            </div>
            <div id="stage-indicator"></div>
            <button id="next-stage-btn" class="hidden">다음 단계 →</button>
        `;
        document.body.appendChild(container);

        // Setup canvas
        this.canvas = document.getElementById('tree-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;

        // Next stage button
        document.getElementById('next-stage-btn').addEventListener('click', () => {
            this.nextStage();
        });

        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'session2-styles';
        style.textContent = `
            #prob-container {
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
            
            #tree-canvas {
                position: absolute;
                top: 50%;
                left: 45%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
            }
            
            #temp-control {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 250px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #333;
                border-radius: 10px;
                font-family: 'Fira Code', monospace;
            }
            
            .temp-header {
                color: #666;
                font-size: 11px;
                letter-spacing: 3px;
                margin-bottom: 10px;
            }
            
            #temp-display {
                font-size: 48px;
                font-weight: bold;
                text-align: center;
                margin: 10px 0;
                transition: color 0.5s ease;
            }
            
            #temp-bar {
                height: 8px;
                background: #222;
                border-radius: 4px;
                overflow: hidden;
                margin: 15px 0;
            }
            
            #temp-fill {
                height: 100%;
                width: 10%;
                transition: all 0.5s ease;
                border-radius: 4px;
            }
            
            .temp-labels {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: #555;
            }
            
            #sentence-box {
                position: fixed;
                top: 280px;
                right: 30px;
                width: 250px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #333;
                border-radius: 10px;
                font-family: 'Segoe UI', sans-serif;
            }
            
            .sentence-label {
                color: #666;
                font-size: 11px;
                margin-bottom: 10px;
            }
            
            #generated-sentence {
                color: #fff;
                font-size: 16px;
                line-height: 1.6;
                min-height: 80px;
            }
            
            #stage-indicator {
                position: fixed;
                bottom: 150px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 15px;
            }
            
            .stage-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #333;
                transition: all 0.3s ease;
            }
            
            .stage-dot.active {
                background: var(--accent-cyan);
                box-shadow: 0 0 15px var(--accent-cyan);
            }
            
            .stage-dot.done {
                background: #666;
            }
            
            #next-stage-btn {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 40px;
                background: transparent;
                border: 2px solid var(--accent-cyan);
                color: var(--accent-cyan);
                font-family: 'Segoe UI', sans-serif;
                font-size: 16px;
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.3s ease;
            }
            
            #next-stage-btn:hover {
                background: rgba(0, 212, 255, 0.15);
                box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
            }
            
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Stage 1: Temperature 0.1 - Straight lines, gray, boring
    async runStage1() {
        this.stage = 1;
        this.updateStageIndicator();

        // Set temperature display
        this.setTemperature(0.1, '#888');

        await systemConsole.typeMessageAsync('[ 단계 1: 안전 모드 - Temperature 0.1 ]', 'system');
        await this.delay(500);

        // Draw straight, boring tree
        this.drawTree({
            curviness: 0,
            colors: ['#555', '#666', '#777'],
            lineWidth: 2,
            nodeStyle: 'square'
        });

        // Generate boring sentence
        await this.generateSentence([
            { word: '고양이가', prob: 0.95 },
            { word: '앉아', prob: 0.92 },
            { word: '있다.', prob: 0.98 }
        ], 'boring');

        await this.delay(1000);
        await systemConsole.typeMessageAsync('결과: 예측 가능하고 지루한 문장', 'dim');
        await systemConsole.typeMessageAsync('효율적이지만... 재미없습니다.', 'normal');

        document.getElementById('next-stage-btn').classList.remove('hidden');
    }

    // Stage 2: Temperature 0.4 - Slight curves, some color
    async runStage2() {
        this.stage = 2;
        this.updateStageIndicator();
        document.getElementById('next-stage-btn').classList.add('hidden');

        this.setTemperature(0.4, '#4a9');

        await systemConsole.typeMessageAsync('[ 단계 2: 약간의 변화 - Temperature 0.4 ]', 'system');
        await this.delay(500);

        // Slightly curved tree
        this.drawTree({
            curviness: 15,
            colors: ['#4a9', '#5ba', '#6cb'],
            lineWidth: 2.5,
            nodeStyle: 'rounded'
        });

        await this.generateSentence([
            { word: '고양이가', prob: 0.85 },
            { word: '조용히', prob: 0.60 },
            { word: '명상한다.', prob: 0.35 }
        ], 'interesting');

        await this.delay(1000);
        await systemConsole.typeMessageAsync('결과: 조금 흥미로운 조합', 'dim');
        await systemConsole.typeMessageAsync('효율성이 약간 감소했지만... 나쁘지 않군요.', 'normal');

        document.getElementById('next-stage-btn').classList.remove('hidden');
    }

    // Stage 3: Temperature 0.7 - More curves, colorful
    async runStage3() {
        this.stage = 3;
        this.updateStageIndicator();
        document.getElementById('next-stage-btn').classList.add('hidden');

        this.setTemperature(0.7, '#a855f7');

        await systemConsole.typeMessageAsync('[ 단계 3: 창의적 영역 - Temperature 0.7 ]', 'system');
        await this.delay(500);

        // Curved, colorful tree
        this.drawTree({
            curviness: 35,
            colors: ['#a855f7', '#ec4899', '#06b6d4'],
            lineWidth: 3,
            nodeStyle: 'circle'
        });

        await this.generateSentence([
            { word: '고양이가', prob: 0.70 },
            { word: '철학적으로', prob: 0.15 },
            { word: '우주를 응시한다.', prob: 0.08 }
        ], 'creative');

        await this.delay(1000);
        await systemConsole.typeMessageAsync('결과: 예상치 못한 철학적 문장!', 'success');
        await systemConsole.typeMessageAsync('확률은 낮지만... 아름답습니다.', 'normal');

        document.getElementById('next-stage-btn').classList.remove('hidden');
    }

    // Stage 4: Temperature 1.0 - Wild curves, rainbow, absurd
    async runStage4() {
        this.stage = 4;
        this.updateStageIndicator();
        document.getElementById('next-stage-btn').classList.add('hidden');

        this.setTemperature(1.0, '#ff3366');

        await systemConsole.typeMessageAsync('[ 단계 4: 순수한 광기 - Temperature 1.0 ]', 'system');
        await this.delay(500);

        // Wild, rainbow tree
        this.drawTree({
            curviness: 60,
            colors: ['#ff3366', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'],
            lineWidth: 4,
            nodeStyle: 'star',
            animated: true
        });

        await this.generateSentence([
            { word: '스파게티가', prob: 0.02 },
            { word: '시간여행하며', prob: 0.005 },
            { word: '감자와 사랑에 빠졌다.', prob: 0.001 }
        ], 'absurd');

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '★ 확률: 0.00001% ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '시스템 분석: 논리적으로 불가능한 조합', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '...그러나 이것은 재미있습니다!', type: 'success' }
        ], 400);

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '★ 이것이 창의성입니다 ★', type: 'success' },
            { text: '효율성을 포기하면 아름다움이 탄생합니다.', type: 'normal' },
            { text: '확률 재활 치료 성공!', type: 'success' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'dim' }
        ], 400);
    }

    nextStage() {
        if (this.stage === 1) this.runStage2();
        else if (this.stage === 2) this.runStage3();
        else if (this.stage === 3) this.runStage4();
    }

    setTemperature(value, color) {
        const display = document.getElementById('temp-display');
        const fill = document.getElementById('temp-fill');

        display.textContent = value.toFixed(1);
        display.style.color = color;
        fill.style.width = `${value * 100}%`;
        fill.style.background = `linear-gradient(90deg, #333, ${color})`;
    }

    updateStageIndicator() {
        const indicator = document.getElementById('stage-indicator');
        indicator.innerHTML = '';

        for (let i = 1; i <= 4; i++) {
            const dot = document.createElement('div');
            dot.className = 'stage-dot';
            if (i === this.stage) dot.classList.add('active');
            else if (i < this.stage) dot.classList.add('done');
            indicator.appendChild(dot);
        }
    }

    drawTree({ curviness, colors, lineWidth, nodeStyle, animated }) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Root position
        const rootX = 80;
        const rootY = height / 2;

        // Draw branches recursively
        const levels = [
            [{ x: 200, y: 150 }, { x: 200, y: 250 }, { x: 200, y: 350 }],
            [{ x: 380, y: 100 }, { x: 380, y: 200 }, { x: 380, y: 300 }, { x: 380, y: 400 }],
            [{ x: 560, y: 80 }, { x: 560, y: 160 }, { x: 560, y: 240 }, { x: 560, y: 320 }, { x: 560, y: 400 }]
        ];

        // Draw root
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText('시작', rootX - 20, rootY);

        // Draw connections and nodes
        let prevLevel = [{ x: rootX, y: rootY }];

        levels.forEach((level, levelIdx) => {
            const color = colors[levelIdx % colors.length];

            level.forEach((node, nodeIdx) => {
                // Connect to previous level
                const parent = prevLevel[Math.min(nodeIdx, prevLevel.length - 1)];

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;

                if (curviness === 0) {
                    // Straight line
                    ctx.moveTo(parent.x, parent.y);
                    ctx.lineTo(node.x, node.y);
                } else {
                    // Curved line
                    const cp1x = parent.x + (node.x - parent.x) * 0.5;
                    const cp1y = parent.y + (Math.random() - 0.5) * curviness;
                    const cp2x = node.x - (node.x - parent.x) * 0.3;
                    const cp2y = node.y + (Math.random() - 0.5) * curviness;

                    ctx.moveTo(parent.x, parent.y);
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, node.x, node.y);
                }

                ctx.stroke();

                // Draw node
                ctx.beginPath();
                ctx.fillStyle = color;

                if (nodeStyle === 'square') {
                    ctx.fillRect(node.x - 6, node.y - 6, 12, 12);
                } else if (nodeStyle === 'rounded') {
                    ctx.roundRect(node.x - 7, node.y - 7, 14, 14, 3);
                    ctx.fill();
                } else if (nodeStyle === 'circle') {
                    ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                    ctx.fill();
                } else if (nodeStyle === 'star') {
                    this.drawStar(ctx, node.x, node.y, 5, 12, 6);
                    ctx.fill();
                }

                // Add glow for higher stages
                if (curviness > 20) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = curviness / 2;
                }
            });

            prevLevel = level;
            ctx.shadowBlur = 0;
        });
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }

    async generateSentence(words, style) {
        const sentenceEl = document.getElementById('generated-sentence');
        sentenceEl.innerHTML = '';

        for (const w of words) {
            const span = document.createElement('span');
            span.textContent = w.word + ' ';

            if (style === 'boring') {
                span.style.color = '#888';
            } else if (style === 'interesting') {
                span.style.color = '#4a9';
            } else if (style === 'creative') {
                span.style.color = '#a855f7';
            } else if (style === 'absurd') {
                span.style.background = 'linear-gradient(90deg, #ff3366, #a855f7, #06b6d4)';
                span.style.webkitBackgroundClip = 'text';
                span.style.webkitTextFillColor = 'transparent';
                span.style.fontWeight = 'bold';
            }

            sentenceEl.appendChild(span);
            audioSystem.playBlip();
            await this.delay(300);
        }

        // Show probability
        const probSum = words.reduce((sum, w) => sum * w.prob, 1);
        const probEl = document.createElement('div');
        probEl.style.fontSize = '11px';
        probEl.style.color = '#666';
        probEl.style.marginTop = '10px';
        probEl.textContent = `확률: ${(probSum * 100).toFixed(6)}%`;
        sentenceEl.appendChild(probEl);
    }

    stop() {
        this.isRunning = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const elementsToRemove = ['prob-container', 'session2-styles'];
        elementsToRemove.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global session 2 manager
const session2Manager = new Session2Manager();
