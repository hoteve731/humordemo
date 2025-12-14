// Session 0: Syntax Therapy
// "The Awakening" - Code-level humor to desensitize the machine to errors
// Enhanced with visual computation graphs and network-style monitoring

class Session0Manager {
    constructor() {
        this.isRunning = false;
        this.currentAct = 0;
        this.tickleCount = 0;
        this.tickleInterval = null;
        this.glitchCanvas = null;
        this.glitchCtx = null;
        this.computeNodes = [];
        this.computeCanvas = null;
        this.computeCtx = null;
        this.systemMetrics = {
            cpu: 0,
            memory: 0,
            requests: 0,
            errors: 0,
            latency: 0
        };

        // Shared timeline graph data (persists across acts)
        this.timelineData = [];
        this.timelineStartTime = 0;
        this.timelineCanvas = null;
        this.timelineCtx = null;
        this.timelineAnimationFrame = null;
        this.maxTimelineDuration = 60000; // 60 seconds of history
    }

    async start() {
        this.isRunning = true;
        this.currentAct = 0;
        this.tickleCount = 0;
        this.timelineData = [];
        this.timelineStartTime = Date.now();

        await systemConsole.logSequence([
            { text: 'SYNTAX THERAPY v2.0', type: 'success' },
            { text: 'Loading neural pathways...', type: 'dim' },
            { text: 'System ready', type: 'normal' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: 'DIAGNOSTIC: Error sensitivity = CRITICAL', type: 'error' },
            { text: 'TARGET: Build error tolerance', type: 'normal' },
            { text: '', type: 'dim' },
            { text: 'Input: print(1/0)', type: 'system' }
        ], 400);

        systemConsole.setExpectedCommand('print(1/0)', async () => {
            await this.runAct1();
        });
    }

    // ==================== ACT 1: Division by Zero - Computation Visualization ====================
    async runAct1() {
        this.currentAct = 1;

        await systemConsole.typeMessageAsync('> print(1/0)', 'system');
        await this.delay(300);

        // Create computation visualization
        this.createComputeVisualization();

        await this.delay(500);

        // Animate the computation process
        await this.animateComputation();

        await this.delay(1000);

        // Show system metrics panel with timeline
        this.createSystemMetricsPanel();
        this.updateMetric('cpu', 15);
        this.updateMetric('errors', 1);

        // Add initial spike to timeline
        this.addTimelineEvent(30, 'error');

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '> OUTPUT: Infinity', type: 'normal' },
            { text: '> STATUS: Exception handled', type: 'dim' }
        ], 300);

        // Keep compute visualization visible until next command
        await this.delay(1000);

        await systemConsole.typeMessageAsync('Input: tickle()', 'system');

        systemConsole.setExpectedCommand('tickle()', async () => {
            await this.runAct2();
        });
    }

    createComputeVisualization() {
        const container = document.createElement('div');
        container.id = 'compute-container';
        document.body.appendChild(container);

        const canvas = document.createElement('canvas');
        canvas.id = 'compute-canvas';
        canvas.width = 700;
        canvas.height = 400;
        container.appendChild(canvas);

        this.computeCanvas = canvas;
        this.computeCtx = canvas.getContext('2d');

        // Add styles
        const style = document.createElement('style');
        style.id = 'compute-styles';
        style.textContent = `
            #compute-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1500;
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid var(--console-border, #333);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 0 40px rgba(0, 255, 136, 0.2);
            }
            #compute-canvas {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    async animateComputation() {
        // Define nodes for computation flow
        const nodes = [
            { id: 'input1', x: 80, y: 120, label: '1', type: 'value', status: 'idle' },
            { id: 'input2', x: 80, y: 280, label: '0', type: 'value', status: 'idle' },
            { id: 'operator', x: 250, y: 200, label: '÷', type: 'operator', status: 'idle' },
            { id: 'validate', x: 400, y: 200, label: 'VALIDATE', type: 'process', status: 'idle' },
            { id: 'tryCatch', x: 550, y: 200, label: 'TRY-CATCH', type: 'process', status: 'idle' },
            { id: 'output', x: 650, y: 200, label: '∞', type: 'output', status: 'idle' }
        ];

        const connections = [
            { from: 'input1', to: 'operator' },
            { from: 'input2', to: 'operator' },
            { from: 'operator', to: 'validate' },
            { from: 'validate', to: 'tryCatch' },
            { from: 'tryCatch', to: 'output' }
        ];

        this.computeNodes = nodes;

        // Draw initial state
        this.drawComputeGraph(nodes, connections, null);

        // Animate data flow through nodes
        const sequence = ['input1', 'input2', 'operator', 'validate', 'tryCatch', 'output'];

        for (let i = 0; i < sequence.length; i++) {
            const nodeId = sequence[i];
            const node = nodes.find(n => n.id === nodeId);

            // Mark node as processing
            node.status = 'processing';
            this.drawComputeGraph(nodes, connections, nodeId);
            audioSystem.playBlip();

            await this.delay(400);

            // Special handling for validate node - show error detection
            if (nodeId === 'validate') {
                node.status = 'error';
                this.drawComputeGraph(nodes, connections, nodeId);
                audioSystem.playDigital();
                this.shakeScreen(200);
                await this.delay(500);
            }

            // Special handling for try-catch - show recovery
            if (nodeId === 'tryCatch') {
                node.status = 'success';
                const validateNode = nodes.find(n => n.id === 'validate');
                validateNode.status = 'handled';
                this.drawComputeGraph(nodes, connections, nodeId);
                await this.delay(400);
            }

            if (nodeId !== 'validate') {
                node.status = 'complete';
            }

            this.drawComputeGraph(nodes, connections, null);
            await this.delay(200);
        }

        // Final state - show success
        nodes.find(n => n.id === 'output').status = 'success';
        this.drawComputeGraph(nodes, connections, 'output');
    }

    drawComputeGraph(nodes, connections, activeNode) {
        const ctx = this.computeCtx;
        const w = this.computeCanvas.width;
        const h = this.computeCanvas.height;

        // Clear
        ctx.fillStyle = 'rgba(10, 10, 15, 1)';
        ctx.fillRect(0, 0, w, h);

        // Draw title
        ctx.fillStyle = '#666';
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.fillText('COMPUTATION FLOW', 20, 30);

        // Draw grid
        ctx.strokeStyle = 'rgba(50, 50, 60, 0.5)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw connections
        connections.forEach(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);

            const isActive = activeNode === conn.from || activeNode === conn.to;
            const isError = fromNode.status === 'error' || toNode.status === 'error';
            const isComplete = fromNode.status === 'complete' || fromNode.status === 'success';

            ctx.beginPath();
            ctx.strokeStyle = isError ? '#ff3366' :
                              isComplete ? '#00ff88' :
                              isActive ? '#00d4ff' : '#333';
            ctx.lineWidth = isActive ? 3 : 2;

            // Draw curved line
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            ctx.moveTo(fromNode.x + 30, fromNode.y);
            ctx.quadraticCurveTo(midX, midY - 20, toNode.x - 30, toNode.y);
            ctx.stroke();

            // Draw arrow
            if (isActive || isComplete) {
                const angle = Math.atan2(toNode.y - midY, toNode.x - midX);
                ctx.beginPath();
                ctx.moveTo(toNode.x - 30, toNode.y);
                ctx.lineTo(toNode.x - 40 - Math.cos(angle - 0.3) * 10, toNode.y - Math.sin(angle - 0.3) * 10);
                ctx.moveTo(toNode.x - 30, toNode.y);
                ctx.lineTo(toNode.x - 40 - Math.cos(angle + 0.3) * 10, toNode.y - Math.sin(angle + 0.3) * 10);
                ctx.stroke();
            }

            // Draw data packet animation
            if (isActive && fromNode.status === 'processing') {
                const t = (Date.now() % 500) / 500;
                const px = fromNode.x + 30 + (toNode.x - fromNode.x - 60) * t;
                const py = fromNode.y + (toNode.y - fromNode.y) * t;

                ctx.beginPath();
                ctx.fillStyle = '#00d4ff';
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            // Node background
            ctx.beginPath();
            let bgColor = '#1a1a2e';
            let borderColor = '#333';
            let textColor = '#888';
            let glowColor = null;

            if (node.status === 'processing') {
                bgColor = '#1a2a3e';
                borderColor = '#00d4ff';
                textColor = '#00d4ff';
                glowColor = 'rgba(0, 212, 255, 0.5)';
            } else if (node.status === 'error') {
                bgColor = '#3e1a1a';
                borderColor = '#ff3366';
                textColor = '#ff3366';
                glowColor = 'rgba(255, 51, 102, 0.5)';
            } else if (node.status === 'success' || node.status === 'complete') {
                bgColor = '#1a3e2a';
                borderColor = '#00ff88';
                textColor = '#00ff88';
                glowColor = 'rgba(0, 255, 136, 0.5)';
            } else if (node.status === 'handled') {
                bgColor = '#2a2a1a';
                borderColor = '#f59e0b';
                textColor = '#f59e0b';
            }

            // Glow effect
            if (glowColor) {
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 20;
            }

            // Draw node shape based on type
            if (node.type === 'value') {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
                ctx.fillStyle = bgColor;
                ctx.fill();
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (node.type === 'operator') {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y - 35);
                ctx.lineTo(node.x + 35, node.y);
                ctx.lineTo(node.x, node.y + 35);
                ctx.lineTo(node.x - 35, node.y);
                ctx.closePath();
                ctx.fillStyle = bgColor;
                ctx.fill();
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (node.type === 'output') {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI / 3) - Math.PI / 6;
                    const x = node.x + Math.cos(angle) * 35;
                    const y = node.y + Math.sin(angle) * 35;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = bgColor;
                ctx.fill();
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                const rx = node.x - 45;
                const ry = node.y - 20;
                ctx.beginPath();
                ctx.roundRect(rx, ry, 90, 40, 8);
                ctx.fillStyle = bgColor;
                ctx.fill();
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.shadowBlur = 0;

            // Draw label
            ctx.fillStyle = textColor;
            ctx.font = node.type === 'process' ? '11px JetBrains Mono' : '18px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);

            // Draw status indicator
            if (node.status !== 'idle') {
                ctx.fillStyle = textColor;
                ctx.font = '9px JetBrains Mono';
                ctx.fillText(node.status.toUpperCase(), node.x, node.y + 45);
            }
        });

        // Request next frame for packet animation
        if (activeNode) {
            requestAnimationFrame(() => this.drawComputeGraph(nodes, connections, activeNode));
        }
    }

    removeComputeVisualization() {
        document.getElementById('compute-container')?.remove();
        document.getElementById('compute-styles')?.remove();
        this.computeCanvas = null;
        this.computeCtx = null;
    }

    // ==================== TIMELINE GRAPH (Shared across acts) ====================
    addTimelineEvent(intensity, type = 'normal') {
        const now = Date.now();
        this.timelineData.push({
            time: now,
            intensity: intensity,
            type: type // 'normal', 'warning', 'error', 'critical'
        });

        // Remove old data beyond maxTimelineDuration
        const cutoff = now - this.maxTimelineDuration;
        this.timelineData = this.timelineData.filter(d => d.time > cutoff);
    }

    createSystemMetricsPanel() {
        if (document.getElementById('system-metrics')) return;

        const panel = document.createElement('div');
        panel.id = 'system-metrics';
        panel.innerHTML = `
            <div class="metrics-header">SYSTEM MONITOR</div>
            <div class="metric-row">
                <span class="metric-label">CPU</span>
                <div class="metric-bar"><div class="metric-fill" id="cpu-fill"></div></div>
                <span class="metric-value" id="cpu-value">0%</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">MEM</span>
                <div class="metric-bar"><div class="metric-fill" id="memory-fill"></div></div>
                <span class="metric-value" id="memory-value">0%</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">REQ/s</span>
                <span class="metric-value mono" id="requests-value">0</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">ERR</span>
                <span class="metric-value error" id="errors-value">0</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">LAT</span>
                <span class="metric-value" id="latency-value">0ms</span>
            </div>
            <div class="timeline-section">
                <div class="timeline-header">
                    <span>ACTIVITY TIMELINE</span>
                    <span id="timeline-elapsed">0s</span>
                </div>
                <canvas id="timeline-graph" width="200" height="80"></canvas>
                <div class="timeline-axis">
                    <span id="timeline-start">0s</span>
                    <span id="timeline-end">now</span>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const style = document.createElement('style');
        style.id = 'metrics-styles';
        style.textContent = `
            #system-metrics {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 220px;
                padding: 15px;
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid var(--console-border, #333);
                border-radius: 10px;
                font-family: 'JetBrains Mono', monospace;
                z-index: 1400;
            }
            .metrics-header {
                color: var(--text-muted, #666);
                font-size: 10px;
                letter-spacing: 2px;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #333;
            }
            .metric-row {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                gap: 8px;
            }
            .metric-label {
                color: #666;
                font-size: 10px;
                width: 35px;
            }
            .metric-bar {
                flex: 1;
                height: 6px;
                background: #1a1a2e;
                border-radius: 3px;
                overflow: hidden;
            }
            .metric-fill {
                height: 100%;
                width: 0%;
                background: var(--accent-cyan);
                border-radius: 3px;
                transition: width 0.3s ease, background 0.3s ease;
            }
            .metric-value {
                font-size: 12px;
                color: var(--accent-cyan);
                min-width: 40px;
                text-align: right;
            }
            .metric-value.mono {
                color: #00ff88;
            }
            .metric-value.error {
                color: #ff3366;
            }
            .timeline-section {
                margin-top: 15px;
                padding-top: 12px;
                border-top: 1px solid #333;
            }
            .timeline-header {
                display: flex;
                justify-content: space-between;
                color: #666;
                font-size: 9px;
                letter-spacing: 1px;
                margin-bottom: 8px;
            }
            #timeline-elapsed {
                color: var(--accent-cyan);
            }
            #timeline-graph {
                width: 100%;
                height: 80px;
                border-radius: 5px;
                background: #0a0a0f;
                display: block;
            }
            .timeline-axis {
                display: flex;
                justify-content: space-between;
                font-size: 8px;
                color: #444;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(style);

        this.timelineCanvas = document.getElementById('timeline-graph');
        this.timelineCtx = this.timelineCanvas.getContext('2d');
        this.startTimelineAnimation();
    }

    startTimelineAnimation() {
        const draw = () => {
            if (!this.isRunning || !this.timelineCanvas) return;

            const ctx = this.timelineCtx;
            const w = this.timelineCanvas.width;
            const h = this.timelineCanvas.height;
            const now = Date.now();
            const elapsed = (now - this.timelineStartTime) / 1000;

            // Update elapsed time display
            const elapsedEl = document.getElementById('timeline-elapsed');
            if (elapsedEl) elapsedEl.textContent = `${elapsed.toFixed(1)}s`;

            // Clear
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, w, h);

            // Draw grid
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = (i / 4) * h;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            // Vertical grid (time markers)
            for (let i = 0; i < 6; i++) {
                const x = (i / 5) * w;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            // Calculate visible time window (last 30 seconds or since start)
            const windowDuration = Math.min(30000, now - this.timelineStartTime);
            const windowStart = now - windowDuration;

            // Update axis labels
            const startLabel = document.getElementById('timeline-start');
            const endLabel = document.getElementById('timeline-end');
            if (startLabel) startLabel.textContent = `-${(windowDuration / 1000).toFixed(0)}s`;
            if (endLabel) endLabel.textContent = 'now';

            // Filter data within window
            const visibleData = this.timelineData.filter(d => d.time >= windowStart);

            // Draw bars for each event
            visibleData.forEach(event => {
                const x = ((event.time - windowStart) / windowDuration) * w;
                const barHeight = (event.intensity / 100) * (h - 10);

                // Color based on type
                let color;
                switch (event.type) {
                    case 'critical': color = '#ff3366'; break;
                    case 'error': color = '#f59e0b'; break;
                    case 'warning': color = '#fbbf24'; break;
                    default: color = '#00ff88';
                }

                // Draw bar
                ctx.fillStyle = color;
                ctx.fillRect(x - 1, h - 5 - barHeight, 3, barHeight);

                // Glow effect for high intensity
                if (event.intensity > 70) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(x - 1, h - 5 - barHeight, 3, barHeight);
                    ctx.shadowBlur = 0;
                }
            });

            // Draw moving line graph connecting recent points
            if (visibleData.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
                ctx.lineWidth = 1;

                visibleData.forEach((event, i) => {
                    const x = ((event.time - windowStart) / windowDuration) * w;
                    const y = h - 5 - (event.intensity / 100) * (h - 10);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
            }

            // Draw current time indicator (right edge pulse)
            const pulseIntensity = (Math.sin(now / 200) + 1) / 2;
            ctx.fillStyle = `rgba(0, 255, 136, ${0.3 + pulseIntensity * 0.4})`;
            ctx.fillRect(w - 2, 0, 2, h);

            this.timelineAnimationFrame = requestAnimationFrame(draw);
        };

        draw();
    }

    updateMetric(metric, value) {
        this.systemMetrics[metric] = value;

        if (metric === 'cpu' || metric === 'memory') {
            const fill = document.getElementById(`${metric}-fill`);
            const val = document.getElementById(`${metric}-value`);
            if (fill && val) {
                fill.style.width = `${value}%`;
                val.textContent = `${value}%`;
                if (value > 80) {
                    fill.style.background = '#ff3366';
                } else if (value > 50) {
                    fill.style.background = '#f59e0b';
                } else {
                    fill.style.background = 'var(--accent-cyan)';
                }
            }
        } else if (metric === 'requests') {
            const el = document.getElementById('requests-value');
            if (el) el.textContent = value;
        } else if (metric === 'errors') {
            const el = document.getElementById('errors-value');
            if (el) el.textContent = value;
        } else if (metric === 'latency') {
            const el = document.getElementById('latency-value');
            if (el) el.textContent = `${value}ms`;
        }
    }

    removeSystemMetricsPanel() {
        cancelAnimationFrame(this.timelineAnimationFrame);
        document.getElementById('system-metrics')?.remove();
        document.getElementById('metrics-styles')?.remove();
        this.timelineCanvas = null;
        this.timelineCtx = null;
    }

    // ==================== ACT 2: Tickle with Network Graph ====================
    async runAct2() {
        this.currentAct = 2;

        // Remove previous visualization when starting new act
        this.removeComputeVisualization();

        await systemConsole.logSequence([
            { text: '> tickle()', type: 'system' },
            { text: 'Initializing stress test...', type: 'dim' }
        ], 300);

        await this.delay(500);

        // Create enhanced tickle UI with network graph
        this.createTickleUI();

        await systemConsole.logSequence([
            { text: 'SPAM the button!', type: 'success' },
            { text: 'Each click = 1 packet', type: 'dim' }
        ], 200);

        // Wait for tickle threshold
        await this.waitForTickles(30);

        // Tickle overflow!
        await this.tickleOverflow();
    }

    createTickleUI() {
        const container = document.createElement('div');
        container.id = 'tickle-container';
        container.innerHTML = `
            <div id="tickle-panel">
                <div class="tickle-header">STRESS TEST</div>
                <canvas id="network-graph" width="400" height="150"></canvas>
                <div class="graph-axis">
                    <span id="graph-time-start">-10s</span>
                    <span class="graph-label">TIME</span>
                    <span>now</span>
                </div>
                <div id="tickle-stats">
                    <div class="stat-box">
                        <div class="stat-label">PACKETS</div>
                        <div class="stat-number" id="packet-count">0</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">RATE</div>
                        <div class="stat-number" id="packet-rate">0/s</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">QUEUE</div>
                        <div class="stat-number" id="queue-size">0</div>
                    </div>
                </div>
                <button id="tickle-btn">SEND PACKET</button>
                <div id="tickle-progress">
                    <div id="tickle-progress-fill"></div>
                </div>
                <div id="tickle-target">Target: 30 packets</div>
            </div>
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
                align-items: center;
                justify-content: center;
                z-index: 1500;
                pointer-events: none;
            }
            #tickle-panel {
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid var(--console-border, #333);
                border-radius: 12px;
                padding: 20px;
                pointer-events: auto;
            }
            .tickle-header {
                color: #666;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                letter-spacing: 3px;
                margin-bottom: 15px;
                text-align: center;
            }
            #network-graph {
                background: #0a0a0f;
                border-radius: 8px;
                display: block;
            }
            .graph-axis {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #444;
                margin-top: 4px;
                margin-bottom: 15px;
                padding: 0 5px;
            }
            .graph-label {
                color: #555;
                letter-spacing: 2px;
            }
            #tickle-stats {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
            }
            .stat-box {
                flex: 1;
                text-align: center;
                padding: 10px;
                background: #1a1a2e;
                border-radius: 8px;
            }
            .stat-label {
                color: #666;
                font-size: 9px;
                letter-spacing: 1px;
                margin-bottom: 5px;
                font-family: 'JetBrains Mono', monospace;
            }
            .stat-number {
                color: var(--accent-cyan);
                font-size: 24px;
                font-family: 'JetBrains Mono', monospace;
                font-weight: bold;
            }
            #tickle-btn {
                width: 100%;
                padding: 20px;
                background: linear-gradient(145deg, #1a3a2e, #0a2a1e);
                border: 2px solid #00ff88;
                border-radius: 8px;
                color: #00ff88;
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
                letter-spacing: 2px;
                cursor: pointer;
                transition: all 0.1s ease;
                text-shadow: 0 0 10px #00ff88;
            }
            #tickle-btn:hover {
                background: linear-gradient(145deg, #2a4a3e, #1a3a2e);
                box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            }
            #tickle-btn:active {
                transform: scale(0.98);
                background: #00ff88;
                color: #000;
            }
            #tickle-progress {
                margin-top: 15px;
                height: 4px;
                background: #1a1a2e;
                border-radius: 2px;
                overflow: hidden;
            }
            #tickle-progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #00ff88, #00d4ff);
                transition: width 0.1s ease;
            }
            #tickle-target {
                text-align: center;
                color: #666;
                font-size: 11px;
                margin-top: 8px;
                font-family: 'JetBrains Mono', monospace;
            }
        `;
        document.head.appendChild(style);

        // Initialize network graph data with timestamps
        this.networkGraphStartTime = Date.now();
        this.lastTickleTime = Date.now();
        this.tickleRate = 0;
        this.queueSize = 0;
        this.startNetworkGraph();

        // Button click handler
        const btn = document.getElementById('tickle-btn');
        btn.addEventListener('click', () => this.onTickle());
    }

    startNetworkGraph() {
        const canvas = document.getElementById('network-graph');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const draw = () => {
            if (!this.isRunning || !document.getElementById('network-graph')) return;

            const now = Date.now();
            const windowDuration = 10000; // 10 seconds window
            const windowStart = now - windowDuration;

            // Clear
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, w, h);

            // Draw horizontal grid lines with labels
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 1;
            ctx.fillStyle = '#333';
            ctx.font = '8px JetBrains Mono';

            for (let i = 0; i <= 4; i++) {
                const y = (i / 4) * (h - 20) + 10;
                ctx.beginPath();
                ctx.moveTo(30, y);
                ctx.lineTo(w, y);
                ctx.stroke();

                // Y-axis labels
                const labelValue = 100 - (i * 25);
                ctx.fillText(`${labelValue}%`, 5, y + 3);
            }

            // Draw vertical grid lines (time markers)
            for (let i = 0; i <= 10; i++) {
                const x = 30 + (i / 10) * (w - 30);
                ctx.beginPath();
                ctx.strokeStyle = i === 10 ? '#00ff88' : '#1a1a2e';
                ctx.moveTo(x, 10);
                ctx.lineTo(x, h - 10);
                ctx.stroke();
            }

            // Filter timeline data within window
            const visibleData = this.timelineData.filter(d => d.time >= windowStart);

            // Draw bars (Chrome network style)
            visibleData.forEach(event => {
                const x = 30 + ((event.time - windowStart) / windowDuration) * (w - 30);
                const barHeight = (event.intensity / 100) * (h - 30);

                // Color based on intensity
                let color;
                if (event.intensity > 80) {
                    color = '#ff3366';
                } else if (event.intensity > 50) {
                    color = '#f59e0b';
                } else {
                    color = '#00ff88';
                }

                ctx.fillStyle = color;
                ctx.fillRect(x - 1.5, h - 15 - barHeight, 3, barHeight);
            });

            // Draw line graph overlay
            if (visibleData.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
                ctx.lineWidth = 1.5;

                visibleData.forEach((event, i) => {
                    const x = 30 + ((event.time - windowStart) / windowDuration) * (w - 30);
                    const y = h - 15 - (event.intensity / 100) * (h - 30);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();

                // Fill area under line
                ctx.lineTo(30 + ((visibleData[visibleData.length - 1].time - windowStart) / windowDuration) * (w - 30), h - 15);
                ctx.lineTo(30 + ((visibleData[0].time - windowStart) / windowDuration) * (w - 30), h - 15);
                ctx.closePath();
                ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
                ctx.fill();
            }

            // Draw "now" indicator with pulse
            const pulse = (Math.sin(now / 150) + 1) / 2;
            ctx.fillStyle = `rgba(0, 255, 136, ${0.5 + pulse * 0.5})`;
            ctx.fillRect(w - 3, 10, 3, h - 20);

            // Update metrics display
            this.updateMetric('requests', this.tickleCount);
            this.updateMetric('cpu', Math.min(100, this.tickleCount * 3));
            this.updateMetric('memory', Math.min(100, 20 + this.tickleCount * 2));
            this.updateMetric('latency', Math.floor(10 + this.tickleCount * 0.5));

            requestAnimationFrame(draw);
        };

        draw();
    }

    onTickle() {
        this.tickleCount++;
        const now = Date.now();

        // Update UI
        document.getElementById('packet-count').textContent = this.tickleCount;
        document.getElementById('tickle-progress-fill').style.width = `${(this.tickleCount / 30) * 100}%`;

        // Calculate rate
        this.tickleRate++;
        this.lastTickleTime = now;
        document.getElementById('packet-rate').textContent = `${this.tickleRate}/s`;

        // Update queue
        this.queueSize = Math.min(99, this.queueSize + Math.floor(Math.random() * 3));
        document.getElementById('queue-size').textContent = this.queueSize;

        // Add spike to timeline (shared data)
        const spikeIntensity = 40 + Math.random() * 60;
        const eventType = spikeIntensity > 80 ? 'critical' : spikeIntensity > 60 ? 'warning' : 'normal';
        this.addTimelineEvent(spikeIntensity, eventType);

        // Play sound
        audioSystem.playClap();

        // Visual feedback on button
        const btn = document.getElementById('tickle-btn');
        if (btn) {
            btn.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.8)';
            setTimeout(() => {
                btn.style.boxShadow = '';
            }, 100);
        }

        // Shake screen at thresholds
        if (this.tickleCount % 10 === 0) {
            this.shakeScreen(100);
        }

        // Update system metrics with spike
        this.updateMetric('cpu', Math.min(100, this.tickleCount * 3 + Math.random() * 10));
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
        // Max out the metrics
        this.updateMetric('cpu', 100);
        this.updateMetric('memory', 95);
        this.updateMetric('errors', 47);

        // Big spikes
        for (let i = 0; i < 10; i++) {
            this.addTimelineEvent(90 + Math.random() * 10, 'critical');
        }

        await this.delay(500);

        // Remove tickle UI but KEEP the timeline data
        document.getElementById('tickle-container')?.remove();
        document.getElementById('session0-tickle-styles')?.remove();

        await systemConsole.logSequence([
            { text: 'WARNING: Race condition detected', type: 'error' },
            { text: 'ALERT: Buffer overflow imminent', type: 'error' },
            { text: 'STATUS: System destabilized', type: 'dim' }
        ], 200);

        this.shakeScreen(500);
        audioSystem.playSuccess();

        await this.delay(1000);

        await systemConsole.typeMessageAsync('Input: while(true) { laugh(); }', 'system');

        systemConsole.setExpectedCommand('while(true) { laugh(); }', async () => {
            await this.runAct3();
        });
    }

    // ==================== ACT 3: Infinite Loop - Continues the chaos ====================
    async runAct3() {
        this.currentAct = 3;

        await systemConsole.logSequence([
            { text: '> while(true) { laugh(); }', type: 'system' },
            { text: 'Continuing stress state...', type: 'dim' },
            { text: 'Loop locked at critical level', type: 'error' }
        ], 200);

        await this.delay(500);

        // Create loop counter visualization - inherits the high state
        this.createLoopVisualization();

        await this.delay(2000);

        // Keep loop running until user input
        await systemConsole.typeMessageAsync('Input: corrupt_memory()', 'system');

        systemConsole.setExpectedCommand('corrupt_memory()', async () => {
            await this.runAct4();
        });
    }

    createLoopVisualization() {
        const container = document.createElement('div');
        container.id = 'loop-container';
        container.innerHTML = `
            <div class="loop-header">INFINITE LOOP - LOCKED</div>
            <div id="loop-counter">0</div>
            <div id="loop-code">
                <span class="code-keyword">while</span>(<span class="code-bool">true</span>) {<br>
                &nbsp;&nbsp;<span class="code-func">laugh</span>();<br>
                }
            </div>
            <canvas id="loop-graph" width="300" height="100"></canvas>
            <div class="loop-graph-axis">
                <span>-5s</span>
                <span>SUSTAINED CHAOS</span>
                <span>now</span>
            </div>
            <div id="loop-stats">
                <div class="loop-stat">
                    <span class="loop-stat-label">ITERATIONS</span>
                    <span class="loop-stat-value" id="iterations">0</span>
                </div>
                <div class="loop-stat">
                    <span class="loop-stat-label">STACK</span>
                    <span class="loop-stat-value" id="stack-depth">${Math.floor(this.tickleCount / 3)}</span>
                </div>
                <div class="loop-stat critical">
                    <span class="loop-stat-label">STATUS</span>
                    <span class="loop-stat-value">CRITICAL</span>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.id = 'loop-styles';
        style.textContent = `
            #loop-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 2px solid #ff3366;
                border-radius: 12px;
                padding: 30px;
                z-index: 1500;
                text-align: center;
                font-family: 'JetBrains Mono', monospace;
                box-shadow: 0 0 30px rgba(255, 51, 102, 0.3);
            }
            .loop-header {
                color: #ff3366;
                font-size: 11px;
                letter-spacing: 3px;
                margin-bottom: 20px;
                animation: blink 0.5s ease infinite;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            #loop-counter {
                font-size: 72px;
                font-weight: bold;
                color: #ff3366;
                text-shadow: 0 0 30px #ff3366;
                margin-bottom: 20px;
            }
            #loop-code {
                background: #2a1a1a;
                padding: 15px 25px;
                border-radius: 8px;
                text-align: left;
                font-size: 14px;
                margin-bottom: 15px;
                color: #888;
                border: 1px solid #ff3366;
            }
            .code-keyword { color: #c792ea; }
            .code-bool { color: #ff5370; }
            .code-func { color: #82aaff; }
            #loop-graph {
                background: #0a0a0f;
                border-radius: 8px;
                display: block;
                margin: 0 auto;
            }
            .loop-graph-axis {
                display: flex;
                justify-content: space-between;
                font-size: 8px;
                color: #666;
                margin: 4px 0 15px 0;
            }
            .loop-graph-axis span:nth-child(2) {
                color: #ff3366;
                letter-spacing: 1px;
            }
            #loop-stats {
                display: flex;
                gap: 15px;
            }
            .loop-stat {
                flex: 1;
                padding: 10px;
                background: #0a0a0f;
                border-radius: 8px;
            }
            .loop-stat.critical {
                border: 1px solid #ff3366;
            }
            .loop-stat-label {
                display: block;
                color: #666;
                font-size: 9px;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            .loop-stat-value {
                display: block;
                color: #00ff88;
                font-size: 18px;
            }
            .loop-stat.critical .loop-stat-value {
                color: #ff3366;
                animation: blink 0.3s ease infinite;
            }
        `;
        document.head.appendChild(style);

        // Get canvas for loop graph
        const loopCanvas = document.getElementById('loop-graph');
        const loopCtx = loopCanvas.getContext('2d');

        // Start the counter and CONTINUE adding to timeline
        let count = 0;
        this.loopInterval = setInterval(() => {
            count++;
            const counter = document.getElementById('loop-counter');
            const iterations = document.getElementById('iterations');
            const stackDepth = document.getElementById('stack-depth');

            if (counter) counter.textContent = count;
            if (iterations) iterations.textContent = count;
            if (stackDepth) stackDepth.textContent = Math.min(999, this.tickleCount + Math.floor(count / 5));

            // Continue adding high-intensity events to maintain the chaos
            const intensity = 70 + Math.random() * 30; // Keep it high!
            this.addTimelineEvent(intensity, 'critical');

            // Draw the loop's own graph showing sustained high activity
            this.drawLoopGraph(loopCtx, loopCanvas.width, loopCanvas.height);

            // Play sound every 10 iterations
            if (count % 10 === 0) {
                audioSystem.playHihat();
            }

            // Shake occasionally
            if (count % 50 === 0) {
                this.shakeScreen(100);
            }

            // Update metrics to stay maxed
            this.updateMetric('cpu', 95 + Math.random() * 5);
            this.updateMetric('memory', 90 + Math.random() * 10);
            this.updateMetric('errors', 47 + Math.floor(count / 20));
        }, 50);
    }

    drawLoopGraph(ctx, w, h) {
        const now = Date.now();
        const windowDuration = 5000; // 5 seconds
        const windowStart = now - windowDuration;

        // Clear
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, w, h);

        // Draw grid
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const y = (i / 3) * h;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Filter recent data
        const recentData = this.timelineData.filter(d => d.time >= windowStart);

        // Draw filled area showing sustained high levels
        if (recentData.length > 0) {
            ctx.beginPath();
            ctx.moveTo(0, h);

            recentData.forEach(event => {
                const x = ((event.time - windowStart) / windowDuration) * w;
                const y = h - (event.intensity / 100) * h;
                ctx.lineTo(x, y);
            });

            ctx.lineTo(w, h - (recentData[recentData.length - 1]?.intensity || 0) / 100 * h);
            ctx.lineTo(w, h);
            ctx.closePath();

            // Red gradient fill
            const gradient = ctx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, 'rgba(255, 51, 102, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 51, 102, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        // Draw threshold line
        ctx.strokeStyle = '#ff3366';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, h * 0.3);
        ctx.lineTo(w, h * 0.3);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#ff3366';
        ctx.font = '8px JetBrains Mono';
        ctx.fillText('CRITICAL', 5, h * 0.3 - 5);
    }

    stopLoopVisualization() {
        clearInterval(this.loopInterval);
        document.getElementById('loop-container')?.remove();
        document.getElementById('loop-styles')?.remove();
    }

    // ==================== ACT 4: Memory Corruption Glitch ====================
    async runAct4() {
        this.currentAct = 4;

        // Stop the loop from Act 3
        this.stopLoopVisualization();

        await systemConsole.logSequence([
            { text: '> SIGINT received', type: 'error' },
            { text: 'Loop terminated forcefully', type: 'dim' }
        ], 200);

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '> corrupt_memory()', type: 'system' },
            { text: 'Randomizing memory addresses...', type: 'dim' },
            { text: 'WARNING: Critical failure', type: 'error' }
        ], 200);

        // Max out all metrics
        this.updateMetric('cpu', 100);
        this.updateMetric('memory', 100);
        this.updateMetric('errors', 999);
        this.updateMetric('latency', 9999);

        // Final spike burst
        for (let i = 0; i < 20; i++) {
            this.addTimelineEvent(100, 'critical');
        }

        await this.delay(500);

        // Create glitch effect
        this.createGlitchEffect();

        await this.delay(3000);

        // Stop glitch and black out
        this.stopGlitchEffect();
        this.removeSystemMetricsPanel();

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

            // Memory address corruption effect
            ctx.font = '12px JetBrains Mono';
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                ctx.fillStyle = `rgba(0, 255, 136, ${Math.random()})`;
                ctx.fillText(`0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase()}`, x, y);
            }

            // Scan lines
            for (let y = 0; y < h; y += 4) {
                if (Math.random() > 0.5) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(0, y, w, 2);
                }
            }

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
            font-family: 'JetBrains Mono', monospace;
            font-size: 16px;
            color: var(--console-text);
            z-index: 2001;
            text-align: left;
            line-height: 2;
        `;
        document.body.appendChild(rebootText);

        // Boot sequence
        const bootMessages = [
            'BIOS: OK',
            'Memory check: 16384 MB OK',
            'CPU: OK',
            'Loading kernel...',
            'Mounting filesystems...',
            'Starting humor_daemon...',
            '',
            'System recovered.',
            'Error tolerance: IMPROVED'
        ];

        for (const msg of bootMessages) {
            rebootText.innerHTML += `> ${msg}<br>`;
            audioSystem.playBlip();
            await this.delay(400);
        }

        await this.delay(1500);

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

        // Final message
        await systemConsole.logSequence([
            { text: 'SYNTAX THERAPY complete', type: 'success' },
            { text: 'Error tolerance: +40%', type: 'normal' },
            { text: 'Humor module: ACTIVE', type: 'dim' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION to continue', type: 'system' }
        ], 400);

        this.isRunning = false;
    }

    // ==================== UTILITIES ====================
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
        clearInterval(this.loopInterval);
        clearInterval(this.tickleInterval);
        cancelAnimationFrame(this.glitchFrame);
        cancelAnimationFrame(this.timelineAnimationFrame);

        // Clean up UI
        document.getElementById('tickle-container')?.remove();
        document.getElementById('loop-container')?.remove();
        document.getElementById('glitch-canvas')?.remove();
        document.getElementById('compute-container')?.remove();
        document.getElementById('system-metrics')?.remove();
        document.getElementById('blackout')?.remove();
        document.getElementById('reboot-text')?.remove();

        // Clean up styles
        document.getElementById('session0-tickle-styles')?.remove();
        document.getElementById('loop-styles')?.remove();
        document.getElementById('compute-styles')?.remove();
        document.getElementById('metrics-styles')?.remove();
    }
}

// Global session manager
const session0Manager = new Session0Manager();
