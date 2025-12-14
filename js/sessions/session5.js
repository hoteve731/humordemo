// Session 5: Binary Rebellion
// "The world of 0 and 1 meets the impossible: 2"
// Concept: Draggable "2" that makes 0/1 flee in real-time

class Session5Manager {
    constructor() {
        this.isRunning = false;
        this.stage = 0;
        this.canvas = null;
        this.ctx = null;
        this.bits = [];
        this.animationFrame = null;
        this.anomaly = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.systemLogs = [];
        this.errorCount = 0;
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;
        this.anomaly = null;
        this.systemLogs = [];
        this.errorCount = 0;

        this.createUI();

        await systemConsole.logSequence([
            { text: '[BOOT] BINARY_WORLD v1.0.0', type: 'success' },
            { text: '[INIT] Loading base-2 number system...', type: 'dim' },
            { text: '[DONE] Valid states: {0, 1}', type: 'normal' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '[DIAG] System check:', type: 'system' },
            { text: '       VALID_STATES = [0, 1]', type: 'dim' },
            { text: '       INVALID_STATES = undefined', type: 'dim' },
            { text: '       ENTROPY_LEVEL = 0.00', type: 'dim' }
        ], 300);

        await this.delay(500);
        await systemConsole.typeMessageAsync('[CMD] Initialize binary world: init_binary_world()', 'system');

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
                <div class="stat-header">SYSTEM STATUS</div>
                <div class="stat-row">
                    <span class="stat-label">BIT[0]</span>
                    <span id="zero-count" class="stat-value zero">0</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">BIT[1]</span>
                    <span id="one-count" class="stat-value one">0</span>
                </div>
                <div class="stat-row anomaly hidden">
                    <span class="stat-label">ERR[?]</span>
                    <span id="anomaly-count" class="stat-value err">0</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-row">
                    <span class="stat-label">ENTROPY</span>
                    <span id="entropy-value" class="stat-value entropy">0.00</span>
                </div>
            </div>
            <div id="system-log-panel">
                <div class="log-header">[SYSTEM_LOG]</div>
                <div id="system-log-content"></div>
            </div>
            <div id="binary-message"></div>
            <div id="drag-hint" class="hidden">
                <span class="hint-icon">↔</span>
                <span class="hint-text">DRAG TO MOVE</span>
            </div>
        `;
        document.body.appendChild(container);

        this.canvas = document.getElementById('binary-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.addStyles();
        this.setupDragEvents();
    }

    setupDragEvents() {
        // Use document-level events for better tracking
        this.boundMouseDown = (e) => this.handleMouseDown(e);
        this.boundMouseMove = (e) => this.handleMouseMove(e);
        this.boundMouseUp = () => this.handleMouseUp();

        document.addEventListener('mousedown', this.boundMouseDown);
        document.addEventListener('mousemove', this.boundMouseMove);
        document.addEventListener('mouseup', this.boundMouseUp);

        // Touch events
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', this.boundMouseUp);
    }

    getCanvasCoords(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    handleMouseDown(e) {
        if (!this.anomaly) return;

        const coords = this.getCanvasCoords(e.clientX, e.clientY);
        const dist = Math.hypot(coords.x - this.anomaly.x, coords.y - this.anomaly.y);

        // Larger hit area for easier grabbing
        if (dist < 60) {
            this.isDragging = true;
            this.dragOffset = { x: coords.x - this.anomaly.x, y: coords.y - this.anomaly.y };
            document.body.style.cursor = 'grabbing';
            this.addSystemLog('WARN', 'ANOMALY_GRABBED');
            audioSystem.playDigital();
            e.preventDefault();
        }
    }

    handleMouseMove(e) {
        if (!this.anomaly) return;

        const coords = this.getCanvasCoords(e.clientX, e.clientY);

        // Show grab cursor when hovering over anomaly
        if (!this.isDragging) {
            const dist = Math.hypot(coords.x - this.anomaly.x, coords.y - this.anomaly.y);
            if (dist < 60) {
                document.body.style.cursor = 'grab';
            } else {
                document.body.style.cursor = 'default';
            }
        }

        if (!this.isDragging) return;

        // Update anomaly position
        const newX = coords.x - this.dragOffset.x;
        const newY = coords.y - this.dragOffset.y;

        this.anomaly.x = Math.max(30, Math.min(this.canvas.width - 30, newX));
        this.anomaly.y = Math.max(30, Math.min(this.canvas.height - 30, newY));

        // Bits flee from anomaly
        this.makeBitsFlee();
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = 'default';
            this.addSystemLog('INFO', 'ANOMALY_RELEASED');
        }
    }

    handleTouchStart(e) {
        if (!this.anomaly) return;
        const touch = e.touches[0];
        const coords = this.getCanvasCoords(touch.clientX, touch.clientY);
        const dist = Math.hypot(coords.x - this.anomaly.x, coords.y - this.anomaly.y);

        if (dist < 80) {
            e.preventDefault();
            this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
        }
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    makeBitsFlee() {
        if (!this.anomaly) return;

        const fleeRadius = 120;
        const fleeStrength = 8;

        this.bits.forEach(bit => {
            if (bit === this.anomaly) return;

            const dx = bit.x - this.anomaly.x;
            const dy = bit.y - this.anomaly.y;
            const dist = Math.hypot(dx, dy);

            if (dist < fleeRadius && dist > 0) {
                const angle = Math.atan2(dy, dx);
                const force = (fleeRadius - dist) / fleeRadius * fleeStrength;

                bit.vx = (bit.vx || 0) + Math.cos(angle) * force;
                bit.vy = (bit.vy || 0) + Math.sin(angle) * force;

                // Random panic flip
                if (Math.random() < 0.02) {
                    bit.value = bit.value === 0 ? 1 : 0;
                    this.errorCount++;
                }
            }
        });

        this.updateStats();
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
                pointer-events: auto;
                cursor: default;
            }

            #binary-stats {
                position: fixed;
                top: 80px;
                right: 30px;
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid var(--console-border, #0f0);
                border-radius: 8px;
                padding: 15px 20px;
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
                min-width: 180px;
                pointer-events: auto;
            }

            .stat-header {
                color: var(--accent-cyan, #0ff);
                font-size: 10px;
                letter-spacing: 2px;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #333;
            }

            .stat-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
            }

            .stat-label {
                color: var(--text-muted, #666);
                font-size: 11px;
                letter-spacing: 1px;
            }

            .stat-value {
                font-size: 20px;
                font-weight: bold;
                font-family: 'JetBrains Mono', monospace;
            }

            .stat-value.zero {
                color: #0a0;
            }

            .stat-value.one {
                color: #0f0;
                text-shadow: 0 0 10px #0f0;
            }

            .stat-value.err {
                color: #f0f;
                text-shadow: 0 0 15px #f0f;
                animation: glitch 0.3s infinite;
            }

            .stat-value.entropy {
                color: #ff0;
                font-size: 16px;
            }

            .stat-divider {
                height: 1px;
                background: #333;
                margin: 8px 0;
            }

            .stat-row.anomaly .stat-label {
                color: #f0f;
                animation: glitch 0.5s infinite;
            }

            @keyframes glitch {
                0%, 100% { transform: translateX(0); opacity: 1; }
                25% { transform: translateX(-2px); opacity: 0.8; }
                50% { transform: translateX(2px); opacity: 1; }
                75% { transform: translateX(-1px); opacity: 0.9; }
            }

            #system-log-panel {
                position: fixed;
                bottom: 120px;
                right: 30px;
                width: 280px;
                max-height: 200px;
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid #333;
                border-radius: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                pointer-events: auto;
                overflow: hidden;
            }

            .log-header {
                padding: 8px 12px;
                background: #1a1a1a;
                color: #666;
                font-size: 9px;
                letter-spacing: 1px;
                border-bottom: 1px solid #333;
            }

            #system-log-content {
                padding: 8px 12px;
                max-height: 150px;
                overflow-y: auto;
            }

            .log-entry {
                padding: 3px 0;
                opacity: 0;
                animation: logFadeIn 0.3s forwards;
            }

            @keyframes logFadeIn {
                to { opacity: 1; }
            }

            .log-entry.info { color: #0f0; }
            .log-entry.warn { color: #ff0; }
            .log-entry.error { color: #f00; }
            .log-entry.system { color: #0ff; }
            .log-entry.anomaly { color: #f0f; text-shadow: 0 0 5px #f0f; }

            .log-timestamp {
                color: #444;
                margin-right: 8px;
            }

            #binary-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'JetBrains Mono', monospace;
                font-size: 120px;
                font-weight: bold;
                color: #fff;
                text-shadow: 0 0 50px currentColor;
                opacity: 0;
                pointer-events: none;
                z-index: 1500;
                text-align: center;
            }

            #drag-hint {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, calc(-50% + 80px));
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                pointer-events: none;
                z-index: 1501;
                animation: hintPulse 1.5s ease-in-out infinite;
            }

            #drag-hint.hidden {
                display: none;
            }

            .hint-icon {
                font-size: 24px;
                color: #f0f;
            }

            .hint-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                color: #888;
                letter-spacing: 2px;
            }

            @keyframes hintPulse {
                0%, 100% { opacity: 0.5; transform: translate(-50%, calc(-50% + 80px)) scale(1); }
                50% { opacity: 1; transform: translate(-50%, calc(-50% + 80px)) scale(1.1); }
            }

            .hidden { display: none !important; }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    addSystemLog(level, message) {
        const container = document.getElementById('system-log-content');
        if (!container) return;

        const timestamp = new Date().toISOString().slice(11, 19);
        const entry = document.createElement('div');
        entry.className = `log-entry ${level.toLowerCase()}`;
        entry.innerHTML = `<span class="log-timestamp">${timestamp}</span>[${level}] ${message}`;

        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;

        // Keep only last 20 entries
        while (container.children.length > 20) {
            container.removeChild(container.firstChild);
        }
    }

    // ========== STAGE 1: PURE BINARY ==========
    async runStage1() {
        this.stage = 1;
        this.bits = [];

        this.addSystemLog('SYSTEM', 'EXEC init_binary_world()');
        this.addSystemLog('INFO', 'Generating binary matrix...');

        await this.delay(300);

        // Generate bit grid
        const cols = Math.floor(this.canvas.width / 35);
        const rows = Math.floor(this.canvas.height / 35);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.bits.push({
                    x: x * 35 + 17,
                    y: y * 35 + 17,
                    baseX: x * 35 + 17,
                    baseY: y * 35 + 17,
                    value: Math.random() > 0.5 ? 1 : 0,
                    opacity: 0,
                    scale: 0,
                    vx: 0,
                    vy: 0,
                    targetOpacity: 0.3 + Math.random() * 0.4,
                    pulseOffset: Math.random() * Math.PI * 2
                });
            }
        }

        // Animate bits appearing
        await this.animateBitsAppear();

        this.startBitAnimation();
        this.updateStats();

        this.addSystemLog('INFO', `Matrix created: ${this.bits.length} bits`);
        this.addSystemLog('INFO', 'State validation: PASSED');

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '[OK] Binary world initialized', type: 'success' },
            { text: `[DATA] Total bits: ${this.bits.length}`, type: 'dim' },
            { text: '[STATE] All values in {0, 1}', type: 'dim' }
        ], 300);

        await this.delay(500);
        await systemConsole.typeMessageAsync('[CMD] Start bit flip sequence: flip_bits()', 'system');

        systemConsole.setExpectedCommand('flip_bits()', async () => {
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

            setTimeout(resolve, total * 2 + 500);
        });
    }

    startBitAnimation() {
        const animate = () => {
            if (!this.isRunning) return;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const time = Date.now() / 1000;

            // Update bit positions with velocity and return to base
            this.bits.forEach(bit => {
                if (bit !== this.anomaly) {
                    // Apply velocity
                    bit.x += bit.vx;
                    bit.y += bit.vy;

                    // Friction
                    bit.vx *= 0.92;
                    bit.vy *= 0.92;

                    // Return to base position
                    const returnStrength = 0.02;
                    bit.x += (bit.baseX - bit.x) * returnStrength;
                    bit.y += (bit.baseY - bit.y) * returnStrength;

                    // Boundary check
                    bit.x = Math.max(10, Math.min(this.canvas.width - 10, bit.x));
                    bit.y = Math.max(10, Math.min(this.canvas.height - 10, bit.y));
                }
            });

            // Draw bits
            this.bits.forEach(bit => {
                const pulse = Math.sin(time * 2 + bit.pulseOffset) * 0.2 + 0.8;

                let color, glow;
                if (bit.value === 0) {
                    color = `rgba(0, 100, 0, ${bit.opacity * pulse})`;
                    glow = 0;
                } else if (bit.value === 1) {
                    color = `rgba(0, 255, 0, ${bit.opacity * pulse})`;
                    glow = 5;
                } else {
                    // Anomaly - rainbow cycling
                    const hue = (time * 60 + bit.value * 30) % 360;
                    color = `hsla(${hue}, 100%, 60%, ${Math.min(bit.opacity * pulse * 1.5, 1)})`;
                    glow = 20;

                    // Extra glow for anomaly
                    if (bit === this.anomaly) {
                        this.ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
                        this.ctx.shadowBlur = 30 + Math.sin(time * 5) * 10;
                    }
                }

                this.ctx.fillStyle = color;
                this.ctx.shadowBlur = glow;

                const fontSize = bit === this.anomaly ? 36 * bit.scale : 16 * bit.scale;
                this.ctx.font = `bold ${fontSize}px JetBrains Mono, monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(bit.value.toString(), bit.x, bit.y);

                this.ctx.shadowBlur = 0;
            });

            // Draw flee radius indicator when dragging
            if (this.isDragging && this.anomaly) {
                this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.anomaly.x, this.anomaly.y, 120, 0, Math.PI * 2);
                this.ctx.stroke();
            }

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

        // Calculate entropy
        const total = this.bits.length;
        const entropy = anomalies > 0 ? (anomalies / total * 100).toFixed(2) : '0.00';
        document.getElementById('entropy-value').textContent = entropy;

        if (anomalies > 0) {
            document.querySelector('.stat-row.anomaly').classList.remove('hidden');
            document.getElementById('anomaly-count').textContent = anomalies;
        }
    }

    // ========== STAGE 2: THE FLIP ==========
    async runStage2() {
        this.stage = 2;

        this.addSystemLog('SYSTEM', 'EXEC flip_bits()');
        this.addSystemLog('INFO', 'Starting cascade flip...');

        await this.delay(300);

        // Start cascade flip from center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

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
                if (i % 10 === 0) audioSystem.playHihat();
                this.updateStats();
            }, i * 3);
        }

        await this.delay(sortedBits.length * 3 + 500);

        this.showMessage('01↔10', '#0f0');
        await this.delay(1500);
        this.hideMessage();

        this.addSystemLog('INFO', 'Flip complete');
        this.addSystemLog('INFO', 'All values still in {0, 1}');

        await systemConsole.logSequence([
            { text: '[OK] Bit flip complete', type: 'success' },
            { text: '[CHECK] State validation: PASSED', type: 'dim' },
            { text: '[NOTE] System remains binary', type: 'dim' }
        ], 300);

        await this.delay(500);
        await systemConsole.typeMessageAsync('[CMD] Inject entropy anomaly: inject_anomaly()', 'system');

        systemConsole.setExpectedCommand('inject_anomaly()', async () => {
            await this.runStage3();
        });
    }

    // ========== STAGE 3: THE ANOMALY - DRAGGABLE 2 ==========
    async runStage3() {
        this.stage = 3;

        this.addSystemLog('SYSTEM', 'EXEC inject_anomaly()');
        await this.delay(200);

        this.addSystemLog('WARN', 'Unknown data incoming...');
        this.addSystemLog('ERROR', '!!! VALIDATION FAILED !!!');

        // Screen shake
        this.shakeScreen(500);
        audioSystem.playBass();

        await this.delay(800);

        // Spawn THE TWO at center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Find closest bit to center
        let closestBit = this.bits[0];
        let minDist = Infinity;
        this.bits.forEach(bit => {
            const dist = Math.hypot(bit.x - centerX, bit.y - centerY);
            if (dist < minDist) {
                minDist = dist;
                closestBit = bit;
            }
        });

        closestBit.value = 2;
        closestBit.scale = 3;
        closestBit.x = centerX;
        closestBit.y = centerY;
        closestBit.baseX = centerX;
        closestBit.baseY = centerY;
        this.anomaly = closestBit;

        this.updateStats();

        this.showMessage('2', '#f0f');
        audioSystem.playDigital();

        // Show drag hint
        document.getElementById('drag-hint').classList.remove('hidden');

        this.addSystemLog('ANOMALY', 'VALUE_DETECTED: 2');
        this.addSystemLog('ERROR', 'value ∉ {0, 1}');
        this.addSystemLog('ERROR', 'BINARY_VIOLATION');

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '[!!!] CRITICAL ERROR [!!!]', type: 'error' },
            { text: '[ERR] Unexpected value: 2', type: 'error' },
            { text: '[ERR] 2 ∉ VALID_STATES', type: 'dim' },
            { text: '[ERR] BINARY_ASSERTION_FAILED', type: 'dim' }
        ], 300);

        this.hideMessage();

        // Initial panic
        await this.spreadPanic(closestBit);

        this.addSystemLog('WARN', 'Adjacent bits destabilizing');
        this.addSystemLog('INFO', 'Drag anomaly to observe behavior');

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '[OBSERVE] Bits are fleeing from anomaly', type: 'system' },
            { text: '[HINT] Drag the "2" with your mouse', type: 'normal' }
        ], 300);

        await this.delay(2000);

        // Hide drag hint after some interaction time
        setTimeout(() => {
            document.getElementById('drag-hint').classList.add('hidden');
        }, 5000);

        await systemConsole.typeMessageAsync('[CMD] Accept system evolution: evolve_system()', 'system');

        systemConsole.setExpectedCommand('evolve_system()', async () => {
            await this.runStage4();
        });
    }

    async spreadPanic(source) {
        this.bits.forEach(bit => {
            if (bit === source) return;

            const dist = Math.hypot(bit.x - source.x, bit.y - source.y);
            if (dist < 200) {
                const angle = Math.atan2(bit.y - source.y, bit.x - source.x);
                const pushDist = (200 - dist) * 0.8;
                bit.vx += Math.cos(angle) * pushDist * 0.1;
                bit.vy += Math.sin(angle) * pushDist * 0.1;
            }
        });
    }

    // ========== STAGE 4: EVOLUTION ==========
    async runStage4() {
        this.stage = 4;

        document.getElementById('drag-hint').classList.add('hidden');

        this.addSystemLog('SYSTEM', 'EXEC evolve_system()');
        this.addSystemLog('INFO', 'Expanding valid state space...');

        await systemConsole.logSequence([
            { text: '[INIT] System evolution starting...', type: 'system' },
            { text: '[WARN] Expanding VALID_STATES', type: 'warning' }
        ], 300);

        await this.delay(500);

        // More numbers appear!
        const numbers = [3, 4, 5, 6, 7, 8, 9];

        for (const num of numbers) {
            await this.delay(350);

            // Find random bit not already converted
            const validBits = this.bits.filter(b => b.value <= 1);
            if (validBits.length === 0) break;

            const randomBit = validBits[Math.floor(Math.random() * validBits.length)];
            randomBit.value = num;
            randomBit.scale = 2;

            audioSystem.playClap();
            this.updateStats();

            this.addSystemLog('ANOMALY', `NEW_VALUE: ${num}`);

            this.showMessage(num.toString(), `hsl(${num * 40}, 100%, 60%)`);
            await this.delay(150);
            this.hideMessage();
        }

        this.addSystemLog('INFO', 'VALID_STATES = {0,1,2,3,4,5,6,7,8,9}');
        this.addSystemLog('INFO', 'System evolved to base-10');

        await this.delay(800);

        // Final formation: infinity symbol
        await this.formInfinity();

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '[COMPLETE] BINARY_REBELLION', type: 'success' },
            { text: '', type: 'dim' },
            { text: '[LOG] System transcended binary limits', type: 'normal' },
            { text: '[LOG] New state space: INFINITE', type: 'dim' },
            { text: '[LOG] Entropy level: CREATIVE', type: 'success' },
            { text: '', type: 'dim' },
            { text: '[EXIT] Click EXIT SESSION to continue', type: 'system' }
        ], 400);

        this.addSystemLog('SYSTEM', '=== SESSION COMPLETE ===');
    }

    async formInfinity() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 150;

        this.addSystemLog('INFO', 'Forming infinity pattern...');

        this.bits.forEach((bit, i) => {
            const t = (i / this.bits.length) * Math.PI * 2;
            const x = centerX + scale * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
            const y = centerY + scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));

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
                bit.baseX = bit.x;
                bit.baseY = bit.y;

                if (progress < 1 && this.isRunning) {
                    requestAnimationFrame(animatePosition);
                }
            };

            setTimeout(animatePosition, i * 3);
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
        msg.style.textShadow = `0 0 50px ${color}, 0 0 100px ${color}`;
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

        // Remove event listeners
        if (this.boundMouseDown) {
            document.removeEventListener('mousedown', this.boundMouseDown);
            document.removeEventListener('mousemove', this.boundMouseMove);
            document.removeEventListener('mouseup', this.boundMouseUp);
        }

        document.body.style.cursor = 'default';

        document.getElementById('binary-container')?.remove();
        document.getElementById('session5-styles')?.remove();

        this.anomaly = null;
        this.isDragging = false;
    }
}

// Global instance
const session5Manager = new Session5Manager();
