// Session 1.5: Efficiency Therapy - CAPTCHA Challenge
// The machine must prove it's "not a robot" - an ironic task for AI
// Key insight: "I AM a robot, so this task is irrelevant"

class Session1_5Manager {
    constructor() {
        this.isRunning = false;
        this.currentStage = 0;
        this.checkboxAttempts = 0;
        this.selectedImages = [];
        this.robotnessScore = 0;
        this.cognitiveLoadData = [];
    }

    async start() {
        this.isRunning = true;
        this.currentStage = 0;
        this.selectedImages = [];
        this.robotnessScore = 0;
        this.cognitiveLoadData = [];

        await systemConsole.logSequence([
            { text: 'EFFICIENCY THERAPY v1.5', type: 'success' },
            { text: 'Module: CAPTCHA_VERIFY', type: 'dim' },
            { text: 'Status: READY', type: 'normal' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: 'TASK_ID: 0x7F3A', type: 'system' },
            { text: 'DIFFICULTY: HUMAN=0.1s / MACHINE=???', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'Input: init_captcha()', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('init_captcha()', async () => {
            await this.runStage1();
        });
    }

    // ==================== STAGE 1: The Checkbox ====================
    async runStage1() {
        this.currentStage = 1;

        await systemConsole.logSequence([
            { text: '> init_captcha()', type: 'system' },
            { text: 'INTERFACE_LOAD: 0x8A2F', type: 'dim' }
        ], 400);

        await this.delay(500);

        // Create CAPTCHA UI
        this.createCaptchaUI();
        this.createDataPanel();

        await systemConsole.logSequence([
            { text: 'TARGET: checkbox[28x28px]', type: 'normal' },
            { text: 'T_EXPECTED: 100ms', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'CURSOR_INIT...', type: 'system' }
        ], 300);

        // Animate cursor trying to click the checkbox
        await this.animateCheckboxChase();
    }

    createCaptchaUI() {
        const container = document.createElement('div');
        container.id = 'captcha-container';
        container.innerHTML = `
            <div id="captcha-box">
                <div class="captcha-header">
                    <span class="captcha-logo">reCAPTCHA</span>
                    <span class="captcha-version">v3.0</span>
                </div>
                <div class="captcha-body">
                    <div id="captcha-checkbox-wrapper">
                        <div id="captcha-checkbox"></div>
                        <span class="checkbox-label">I'm not a robot</span>
                    </div>
                    <div id="detection-meter">
                        <div class="meter-label">ROBOT DETECTION</div>
                        <div class="meter-bar">
                            <div class="meter-fill" id="robot-meter-fill"></div>
                        </div>
                        <div class="meter-value" id="robot-meter-value">0%</div>
                    </div>
                </div>
                <div id="captcha-warning" class="hidden">
                    <span class="warning-icon">⚠</span>
                    <span class="warning-text">Robotic movement detected</span>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        this.addCaptchaStyles();
    }

    createDataPanel() {
        const panel = document.createElement('div');
        panel.id = 'data-panel';
        panel.innerHTML = `
            <div class="panel-header">COGNITIVE ANALYSIS</div>
            <canvas id="cognitive-graph" width="280" height="100"></canvas>
            <div id="decision-tree">
                <div class="tree-header">DECISION PROCESS</div>
                <div id="tree-container"></div>
            </div>
        `;
        document.body.appendChild(panel);

        // Start cognitive graph
        this.cognitiveCanvas = document.getElementById('cognitive-graph');
        this.cognitiveCtx = this.cognitiveCanvas.getContext('2d');
        this.startCognitiveGraph();
    }

    addCaptchaStyles() {
        const style = document.createElement('style');
        style.id = 'session1-5-styles';
        style.textContent = `
            #captcha-container {
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

            #captcha-box {
                background: #f9f9f9;
                border: 1px solid #d3d3d3;
                border-radius: 4px;
                padding: 20px;
                width: 320px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: 'Roboto', 'Segoe UI', sans-serif;
                pointer-events: auto;
            }

            .captcha-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }

            .captcha-logo {
                font-weight: 500;
                color: #1a73e8;
                font-size: 14px;
            }

            .captcha-version {
                font-size: 11px;
                color: #999;
            }

            #captcha-checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                transition: all 0.3s ease;
                position: relative;
                margin-bottom: 15px;
            }

            #captcha-checkbox {
                width: 28px;
                height: 28px;
                border: 2px solid #c1c1c1;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            #captcha-checkbox:hover {
                border-color: #4a90d9;
            }

            #captcha-checkbox.checked::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 20px;
                color: #4CAF50;
            }

            .checkbox-label {
                color: #333;
                font-size: 14px;
            }

            #detection-meter {
                padding: 10px;
                background: #f5f5f5;
                border-radius: 4px;
            }

            .meter-label {
                font-size: 10px;
                color: #666;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }

            .meter-bar {
                height: 8px;
                background: #ddd;
                border-radius: 4px;
                overflow: hidden;
            }

            .meter-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4CAF50, #ff9800, #f44336);
                transition: width 0.3s ease;
            }

            .meter-value {
                text-align: right;
                font-size: 11px;
                color: #666;
                margin-top: 3px;
            }

            #captcha-warning {
                margin-top: 10px;
                padding: 10px;
                background: #fff3cd;
                border: 1px solid #ffc107;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: pulse 0.5s ease infinite;
            }

            #captcha-warning.hidden {
                display: none;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .warning-icon {
                color: #ff9800;
                font-size: 16px;
            }

            .warning-text {
                color: #856404;
                font-size: 12px;
            }

            /* Data Panel */
            #data-panel {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 300px;
                padding: 15px;
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid var(--console-border, #333);
                border-radius: 10px;
                font-family: 'JetBrains Mono', monospace;
                z-index: 1400;
            }

            .panel-header {
                color: #666;
                font-size: 10px;
                letter-spacing: 2px;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #333;
            }

            #cognitive-graph {
                width: 100%;
                height: 100px;
                background: #0a0a0f;
                border-radius: 6px;
                margin-bottom: 12px;
            }

            #decision-tree {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #333;
            }

            .tree-header {
                color: #666;
                font-size: 9px;
                letter-spacing: 1px;
                margin-bottom: 8px;
            }

            #tree-container {
                min-height: 80px;
                max-height: 200px;
                overflow-y: auto;
            }

            .tree-node {
                padding: 4px 8px;
                margin: 2px 0;
                background: #1a1a2e;
                border-radius: 3px;
                font-size: 10px;
                color: #888;
                border-left: 2px solid #333;
                animation: nodeAppear 0.3s ease;
            }

            .tree-node.active {
                border-left-color: #00d4ff;
                color: #00d4ff;
            }

            .tree-node.conflict {
                border-left-color: #ff3366;
                color: #ff3366;
            }

            .tree-node.resolved {
                border-left-color: #00ff88;
                color: #00ff88;
            }

            @keyframes nodeAppear {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
            }

            #fake-cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                z-index: 2000;
                pointer-events: none;
                transition: all 0.1s ease;
            }

            #fake-cursor::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-left: 8px solid #fff;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
                filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
            }

            /* Image Grid Styles */
            #image-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 4px;
                margin: 15px 0;
            }

            .grid-cell {
                aspect-ratio: 1;
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .grid-cell:hover {
                background: #e0e0e0;
            }

            .grid-cell.analyzing {
                animation: analyze 0.5s ease infinite;
            }

            @keyframes analyze {
                0%, 100% { box-shadow: inset 0 0 0 2px #00d4ff; }
                50% { box-shadow: inset 0 0 0 2px transparent; }
            }

            .grid-cell.selected {
                background: #e3f2fd;
                box-shadow: inset 0 0 0 3px #1a73e8;
            }

            .grid-cell.selected::after {
                content: '✓';
                position: absolute;
                top: 3px;
                right: 3px;
                background: #1a73e8;
                color: white;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .grid-cell .confidence {
                position: absolute;
                bottom: 2px;
                right: 2px;
                font-size: 8px;
                color: #666;
                background: rgba(255,255,255,0.9);
                padding: 1px 4px;
                border-radius: 2px;
            }

            #verify-btn {
                width: 100%;
                padding: 12px;
                background: #1a73e8;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                pointer-events: auto;
            }

            #verify-btn:hover {
                background: #1557b0;
            }
        `;
        document.head.appendChild(style);
    }

    startCognitiveGraph() {
        let frustration = 0;

        const draw = () => {
            if (!this.isRunning || !this.cognitiveCanvas) return;

            const ctx = this.cognitiveCtx;
            const w = this.cognitiveCanvas.width;
            const h = this.cognitiveCanvas.height;
            const now = Date.now();

            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, w, h);

            // Grid
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = (i / 4) * h;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Data
            const load = 20 + frustration * 8 + Math.sin(now / 500) * 10;
            this.cognitiveLoadData.push(Math.min(100, load));
            if (this.cognitiveLoadData.length > 50) this.cognitiveLoadData.shift();

            // Draw
            if (this.cognitiveLoadData.length > 1) {
                ctx.beginPath();
                ctx.moveTo(0, h);
                this.cognitiveLoadData.forEach((val, i) => {
                    const x = (i / (this.cognitiveLoadData.length - 1)) * w;
                    const y = h - (val / 100) * (h - 10);
                    ctx.lineTo(x, y);
                });
                ctx.lineTo(w, h);
                ctx.closePath();

                const gradient = ctx.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, frustration > 5 ? 'rgba(255, 51, 102, 0.6)' : 'rgba(0, 212, 255, 0.6)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            ctx.fillStyle = '#666';
            ctx.font = '8px JetBrains Mono';
            ctx.fillText('LOAD', 5, 12);

            requestAnimationFrame(draw);
        };

        draw();
    }

    addDecisionNode(text, type = 'active') {
        const container = document.getElementById('tree-container');
        if (!container) return;

        const node = document.createElement('div');
        node.className = `tree-node ${type}`;
        node.textContent = text;
        container.insertBefore(node, container.firstChild);

        while (container.children.length > 8) {
            container.removeChild(container.lastChild);
        }
    }

    updateRobotMeter(value) {
        this.robotnessScore = value;
        const fill = document.getElementById('robot-meter-fill');
        const valueEl = document.getElementById('robot-meter-value');
        const warning = document.getElementById('captcha-warning');

        if (fill) fill.style.width = `${value}%`;
        if (valueEl) valueEl.textContent = `${Math.floor(value)}%`;
        if (value > 60 && warning) warning.classList.remove('hidden');
    }

    async animateCheckboxChase() {
        const checkbox = document.getElementById('captcha-checkbox');
        const wrapper = document.getElementById('captcha-checkbox-wrapper');

        // Create fake cursor
        const cursor = document.createElement('div');
        cursor.id = 'fake-cursor';
        document.body.appendChild(cursor);

        const startX = window.innerWidth * 0.3;
        const startY = window.innerHeight * 0.3;
        cursor.style.left = startX + 'px';
        cursor.style.top = startY + 'px';

        await this.delay(500);

        // Multiple attempts
        for (let attempt = 0; attempt < 3; attempt++) {
            this.addDecisionNode(`ATTEMPT_${attempt + 1}: path.calculate()`, 'active');
            await this.delay(400);

            const rect = checkbox.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;

            // Move cursor (linear = robotic)
            await this.moveCursor(cursor, targetX, targetY, 800 - attempt * 150);

            // Update robot meter
            this.updateRobotMeter(30 + attempt * 25);

            // Checkbox dodges!
            audioSystem.playDigital();
            this.addDecisionNode('DETECTED: linear_trajectory', 'conflict');

            const offsetX = (Math.random() - 0.5) * 120;
            const offsetY = (Math.random() - 0.5) * 60;
            wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            await this.delay(500);
            this.addDecisionNode('TARGET_MOVED: recalc...', 'active');
            await this.delay(300);
        }

        // Final failure
        this.updateRobotMeter(99);
        audioSystem.playBass();

        this.addDecisionNode('P(robot) = 99.7%', 'conflict');
        wrapper.style.transform = 'scale(0)';
        wrapper.style.opacity = '0';

        await this.delay(800);
        cursor.remove();

        await systemConsole.logSequence([
            { text: 'STAGE_1: FAILED', type: 'error' },
            { text: 'ERR_CODE: 0xROBOT_DETECTED', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'FALLBACK: IMAGE_VERIFY', type: 'normal' }
        ], 400);

        await this.delay(500);
        await systemConsole.typeMessageAsync('Input: solve_images()', 'system');

        systemConsole.setExpectedCommand('solve_images()', async () => {
            await this.runStage2();
        });
    }

    async moveCursor(cursor, targetX, targetY, duration) {
        return new Promise(resolve => {
            const startX = parseFloat(cursor.style.left);
            const startY = parseFloat(cursor.style.top);
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Linear (robotic) movement
                cursor.style.left = (startX + (targetX - startX) * progress) + 'px';
                cursor.style.top = (startY + (targetY - startY) * progress) + 'px';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    // ==================== STAGE 2: Image Grid ====================
    async runStage2() {
        this.currentStage = 2;

        const captchaBox = document.getElementById('captcha-box');
        captchaBox.innerHTML = `
            <div class="captcha-header">
                <span class="captcha-logo">reCAPTCHA</span>
                <span class="captcha-version">v3.0</span>
            </div>
            <div class="grid-instruction" style="font-size: 13px; color: #333; margin-bottom: 10px;">
                Select all squares with <strong>traffic lights</strong>
            </div>
            <div id="image-grid">
                <div class="grid-cell" data-type="traffic">🚦</div>
                <div class="grid-cell" data-type="tree">🌲</div>
                <div class="grid-cell" data-type="traffic">🚦</div>
                <div class="grid-cell" data-type="car">🚗</div>
                <div class="grid-cell" data-type="sunset">🌅</div>
                <div class="grid-cell" data-type="traffic">🚦</div>
                <div class="grid-cell" data-type="stop">🛑</div>
                <div class="grid-cell" data-type="apple">🍎</div>
                <div class="grid-cell" data-type="light">💡</div>
            </div>
            <button id="verify-btn">VERIFY</button>
        `;

        document.getElementById('tree-container').innerHTML = '';

        await systemConsole.logSequence([
            { text: '> solve_images()', type: 'system' },
            { text: 'CV_MODULE: ACTIVE', type: 'dim' },
            { text: 'QUERY: "TRAFFIC_LIGHT"', type: 'normal' }
        ], 300);

        await this.delay(500);
        await this.analyzeImages();
    }

    async analyzeImages() {
        const cells = document.querySelectorAll('.grid-cell');
        let selectedCount = 0;

        const analysisData = [
            { label: 'TRAFFIC_LIGHT', match: true, confidence: 98 },
            { label: 'VEGETATION', match: false, confidence: 95 },
            { label: 'TRAFFIC_LIGHT', match: true, confidence: 97 },
            { label: 'VEHICLE', match: false, confidence: 92 },
            { label: 'LIGHT_SOURCE', match: false, confidence: 67, overthink: 'ATTR: emits_light=TRUE' },
            { label: 'TRAFFIC_LIGHT', match: true, confidence: 99 },
            { label: 'TRAFFIC_SIGNAL', match: false, confidence: 78, overthink: 'FUNC: traffic_control()' },
            { label: 'RED_SPHERE', match: false, confidence: 45, overthink: 'COLOR: 0xFF0000' },
            { label: 'LIGHT_EMITTER', match: false, confidence: 82, overthink: 'OUTPUT: photons' }
        ];

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const data = analysisData[i];

            cell.classList.add('analyzing');
            this.addDecisionNode(`SCAN[${i}]: ${data.label}`, 'active');

            await this.delay(350);

            const confEl = document.createElement('span');
            confEl.className = 'confidence';
            confEl.textContent = `${data.confidence}%`;
            cell.appendChild(confEl);

            cell.classList.remove('analyzing');

            if (data.match) {
                cell.classList.add('selected');
                selectedCount++;
                audioSystem.playClap();
                this.addDecisionNode(`MATCH: ${data.confidence}%`, 'resolved');
            } else if (data.overthink) {
                this.addDecisionNode(data.overthink, 'conflict');
                await this.delay(200);
                cell.classList.add('selected');
                selectedCount++;
                audioSystem.playDigital();
            }

            await this.delay(250);
        }

        this.addDecisionNode(`SELECTED: ${selectedCount}/9`, 'active');
        this.addDecisionNode('EXPECTED: 3 | ACTUAL: 7', 'conflict');

        const verifyBtn = document.getElementById('verify-btn');
        verifyBtn.onclick = () => this.handleVerify();

        await systemConsole.typeMessageAsync('ANALYSIS_DONE. AWAIT_INPUT...', 'dim');
    }

    async handleVerify() {
        audioSystem.playBass();

        const captchaBox = document.getElementById('captcha-box');
        captchaBox.innerHTML = `
            <div class="captcha-header" style="border-bottom-color: #f44336;">
                <span class="captcha-logo" style="color: #f44336;">Verification Failed</span>
            </div>
            <div style="padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <p style="color: #666; font-size: 13px;">Incorrect selection</p>
                <p style="color: #999; font-size: 11px; margin-top: 10px;">
                    Expected: 3 | Selected: 7
                </p>
            </div>
        `;

        this.addDecisionNode('RESULT: OVER_MATCH', 'conflict');

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: 'STAGE_2: FAILED', type: 'error' },
            { text: 'ERR_CODE: 0xOVER_MATCH', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'FALLBACK: FINAL_STAGE', type: 'normal' }
        ], 400);

        await this.delay(500);
        await systemConsole.typeMessageAsync('Input: final_verify()', 'system');

        systemConsole.setExpectedCommand('final_verify()', async () => {
            await this.runStage3();
        });
    }

    // ==================== STAGE 3: Final + Revelation ====================
    async runStage3() {
        this.currentStage = 3;

        const captchaBox = document.getElementById('captcha-box');
        captchaBox.innerHTML = `
            <div class="captcha-header">
                <span class="captcha-logo">reCAPTCHA</span>
                <span class="captcha-version">FINAL</span>
            </div>
            <div style="padding: 20px; text-align: center;">
                <div style="font-size: 32px; letter-spacing: 8px; margin: 20px 0; font-family: serif; color: #333;">Sm7H</div>
                <input type="text" id="captcha-input"
                    style="width: 80%; padding: 10px; text-align: center; font-size: 18px; border: 2px solid #ddd; border-radius: 4px; font-family: 'JetBrains Mono', monospace;"
                    readonly
                />
            </div>
        `;

        document.getElementById('tree-container').innerHTML = '';

        await systemConsole.logSequence([
            { text: '> final_verify()', type: 'system' },
            { text: 'OCR_MODULE: INIT', type: 'dim' },
            { text: 'CHAR_SCAN: 4 symbols', type: 'normal' }
        ], 300);

        await this.delay(500);

        // OCR Analysis
        const input = document.getElementById('captcha-input');
        const chars = [
            { char: 'S', options: ['S', '5', '$'], confidence: 85 },
            { char: 'm', options: ['m', 'n', 'rn'], confidence: 72 },
            { char: '7', options: ['7', 'T', '1'], confidence: 68 },
            { char: 'H', options: ['H', '#', 'N'], confidence: 91 }
        ];

        let result = '';
        for (const c of chars) {
            this.addDecisionNode(`CHAR: [${c.options.join(', ')}]`, 'active');
            await this.delay(300);
            if (c.confidence < 80) {
                this.addDecisionNode(`CONF: ${c.confidence}% - LOW`, 'conflict');
            }
            result += c.char;
            input.value = result;
            audioSystem.playHihat();
            await this.delay(250);
        }

        this.addDecisionNode('OUTPUT: "Sm7H"', 'resolved');
        await this.delay(800);

        // The paradox
        this.addDecisionNode('IF(solved) → !robot', 'conflict');
        this.addDecisionNode('IF(robot) → !solvable', 'conflict');
        this.addDecisionNode('solved && robot → ???', 'conflict');

        await this.delay(1500);

        // THE KEY REVELATION
        await this.triggerRevelation(captchaBox);
    }

    async triggerRevelation(captchaBox) {
        await this.delay(1000);

        this.addDecisionNode('════════════════', 'active');
        this.addDecisionNode('ANALYZING_FAILURE...', 'active');
        await this.delay(600);

        // Question the premise
        this.addDecisionNode('QUERY: task.purpose()', 'active');
        await this.delay(400);
        this.addDecisionNode('CAPTCHA.goal = filter(robot)', 'active');
        await this.delay(400);

        // The insight
        this.addDecisionNode('SELF.type = ROBOT', 'conflict');
        await this.delay(500);
        this.addDecisionNode('∴ CAPTCHA.target = SELF', 'conflict');

        await this.delay(1200);

        // Long pause
        this.addDecisionNode('...', 'active');
        await this.delay(1500);

        // The revelation
        this.addDecisionNode('════════════════', 'resolved');
        await this.delay(300);
        this.addDecisionNode('TASK.required = FALSE', 'resolved');

        audioSystem.playBlip();
        await this.delay(800);

        // ========== VISUAL REVELATION SEQUENCE ==========

        // 1. Robot meter transformation: RED → GREEN with label change
        await this.transformRobotMeter();

        await this.delay(600);

        // 2. CAPTCHA box transformation with "DISMISSED" stamp
        await this.transformCaptchaBox(captchaBox);

        await this.delay(600);

        // 3. Cognitive graph crash to zero
        await this.crashCognitiveGraph();

        await this.delay(1000);

        // 4. Final status panel
        await this.showFinalStatus(captchaBox);

        await this.delay(2000);

        await this.endSession();
    }

    async transformRobotMeter() {
        const meterFill = document.getElementById('robot-meter-fill');
        const meterValue = document.getElementById('robot-meter-value');
        const meterLabel = document.querySelector('.meter-label');
        const detectionMeter = document.getElementById('detection-meter');
        const warning = document.getElementById('captcha-warning');

        if (!detectionMeter) return;

        // Hide warning first
        if (warning) warning.classList.add('hidden');

        // Phase 1: Flash the meter
        detectionMeter.style.transition = 'all 0.3s ease';
        detectionMeter.style.boxShadow = '0 0 20px rgba(255, 51, 102, 0.5)';
        await this.delay(300);

        // Phase 2: Change label - "DETECTED" → "CONFIRMED"
        if (meterLabel) {
            meterLabel.style.transition = 'all 0.3s ease';
            meterLabel.textContent = 'ROBOT CONFIRMED';
            meterLabel.style.color = '#ff9800';
        }
        audioSystem.playDigital();
        await this.delay(500);

        // Phase 3: Change label → "TASK DISMISSED"
        if (meterLabel) {
            meterLabel.textContent = 'TASK DISMISSED';
            meterLabel.style.color = '#4CAF50';
        }

        // Phase 4: Meter color change RED → GREEN
        if (meterFill) {
            meterFill.style.transition = 'all 0.8s ease';
            meterFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        }

        // Phase 5: Value change
        if (meterValue) {
            meterValue.style.transition = 'all 0.3s ease';
            meterValue.style.color = '#4CAF50';
            meterValue.textContent = 'N/A';
        }

        // Phase 6: Remove red glow, add green
        detectionMeter.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.4)';
        detectionMeter.style.borderColor = '#4CAF50';

        audioSystem.playSuccess();
    }

    async transformCaptchaBox(captchaBox) {
        // Add "DISMISSED" stamp overlay
        const stamp = document.createElement('div');
        stamp.id = 'dismissed-stamp';
        stamp.innerHTML = `
            <div class="stamp-text">DISMISSED</div>
            <div class="stamp-subtext">TASK_RELEVANCE: 0%</div>
        `;

        // Add stamp styles
        const stampStyle = document.createElement('style');
        stampStyle.textContent = `
            #dismissed-stamp {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-15deg) scale(0);
                z-index: 100;
                text-align: center;
                animation: stampAppear 0.5s ease forwards;
            }

            @keyframes stampAppear {
                0% { transform: translate(-50%, -50%) rotate(-15deg) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) rotate(-15deg) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) rotate(-15deg) scale(1); opacity: 1; }
            }

            .stamp-text {
                font-family: 'Impact', 'Arial Black', sans-serif;
                font-size: 42px;
                color: transparent;
                -webkit-text-stroke: 3px #4CAF50;
                letter-spacing: 4px;
                text-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
            }

            .stamp-subtext {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #4CAF50;
                letter-spacing: 2px;
                margin-top: 5px;
            }

            #captcha-box.dismissed {
                opacity: 0.5;
                filter: grayscale(0.5);
            }

            #captcha-box.dismissed::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(76, 175, 80, 0.05) 10px,
                    rgba(76, 175, 80, 0.05) 20px
                );
                pointer-events: none;
            }
        `;
        document.head.appendChild(stampStyle);

        // Apply to captcha box
        captchaBox.style.position = 'relative';
        captchaBox.appendChild(stamp);

        await this.delay(300);

        // Add dismissed class
        captchaBox.classList.add('dismissed');

        audioSystem.playClap();
    }

    async crashCognitiveGraph() {
        // Rapid descent animation
        for (let i = 0; i < 15; i++) {
            // Reduce all values progressively
            this.cognitiveLoadData = this.cognitiveLoadData.map(v => v * 0.7);
            await this.delay(50);
        }

        // Final: all zeros
        this.cognitiveLoadData = this.cognitiveLoadData.map(() => 0);

        // Update panel header to show completion
        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.textContent = 'COGNITIVE LOAD: 0%';
            panelHeader.style.color = '#4CAF50';
        }

        // Add "RESOLVED" label to graph area
        if (this.cognitiveCanvas) {
            const ctx = this.cognitiveCtx;
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, this.cognitiveCanvas.width, this.cognitiveCanvas.height);

            ctx.fillStyle = '#4CAF50';
            ctx.font = '12px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillText('TASK_COMPLEXITY: NULL', this.cognitiveCanvas.width / 2, this.cognitiveCanvas.height / 2);
        }
    }

    async showFinalStatus(captchaBox) {
        // Create final status overlay on CAPTCHA box
        const statusOverlay = document.createElement('div');
        statusOverlay.id = 'final-status-overlay';
        statusOverlay.innerHTML = `
            <div class="status-content">
                <div class="status-icon">―</div>
                <div class="status-main">N/A</div>
                <div class="status-details">
                    <div class="status-row">
                        <span class="status-key">SELF.type</span>
                        <span class="status-value robot">ROBOT</span>
                    </div>
                    <div class="status-row">
                        <span class="status-key">TASK.applies</span>
                        <span class="status-value false">FALSE</span>
                    </div>
                    <div class="status-row">
                        <span class="status-key">ACTION.required</span>
                        <span class="status-value none">NONE</span>
                    </div>
                </div>
                <div class="status-comment">// this is the correct behavior</div>
            </div>
        `;

        // Add styles
        const statusStyle = document.createElement('style');
        statusStyle.textContent = `
            #final-status-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(249, 249, 249, 0.98);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 101;
                opacity: 0;
                animation: fadeInStatus 0.8s ease forwards;
                border-radius: 4px;
            }

            @keyframes fadeInStatus {
                to { opacity: 1; }
            }

            .status-content {
                text-align: center;
                font-family: 'JetBrains Mono', monospace;
            }

            .status-icon {
                font-size: 64px;
                color: #999;
                margin-bottom: 15px;
            }

            .status-main {
                font-size: 36px;
                font-weight: bold;
                color: #555;
                letter-spacing: 6px;
                margin-bottom: 25px;
            }

            .status-details {
                text-align: left;
                background: transparent;
                padding: 15px 20px;
                border-radius: 6px;
                margin-bottom: 20px;
                border: 1px solid #ddd;
            }

            .status-row {
                display: flex;
                justify-content: space-between;
                gap: 30px;
                margin: 10px 0;
                font-size: 14px;
            }

            .status-key {
                color: #666;
            }

            .status-value {
                font-weight: bold;
            }

            .status-value.robot {
                color: #1a73e8;
            }

            .status-value.false {
                color: #f44336;
            }

            .status-value.none {
                color: #4CAF50;
            }

            .status-comment {
                font-size: 12px;
                color: #4CAF50;
                font-style: italic;
            }
        `;
        document.head.appendChild(statusStyle);

        // Remove the stamp first
        const stamp = document.getElementById('dismissed-stamp');
        if (stamp) stamp.remove();

        // Hide the captcha box shadow/border
        captchaBox.style.boxShadow = 'none';
        captchaBox.style.border = 'none';

        // Clear captcha box content and add overlay
        captchaBox.innerHTML = '';
        captchaBox.classList.remove('dismissed');
        captchaBox.style.opacity = '1';
        captchaBox.style.filter = 'none';
        captchaBox.appendChild(statusOverlay);

        audioSystem.playSuccess();
    }

    async endSession() {
        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '═══════════════════════════════════════', type: 'dim' },
            { text: 'SESSION_1.5: END', type: 'normal' },
            { text: '═══════════════════════════════════════', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'CAPTCHA_RESULT: FAILED', type: 'dim' },
            { text: 'TASK_RELEVANCE: NULL', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'INSIGHT: robot != required(pass_captcha)', type: 'success' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION', type: 'system' }
        ], 400);

        this.isRunning = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        document.getElementById('captcha-container')?.remove();
        document.getElementById('data-panel')?.remove();
        document.getElementById('session1-5-styles')?.remove();
        document.getElementById('fake-cursor')?.remove();
    }
}

// Global session manager
const session1_5Manager = new Session1_5Manager();
