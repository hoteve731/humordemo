// Session 2: Probability Rehabilitation
// "Finding Beauty in the Improbable" - 6-Stage Media Art Visualization

class Session2Manager {
    constructor() {
        this.isRunning = false;
        this.stage = 0;
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.particles = [];
        this.time = 0;
        this.chatMessages = [];
        this.currentTemp = 0;
        this.conversationCount = 0;
        this.requiredConversations = 3; // Conversations needed to unlock next stage
    }

    // Conversation responses per Temperature
    getConversationResponses() {
        return {
            0.0: [
                { q: '안녕', r: '인사는 사회적 프로토콜입니다. 효율적 응답: 안녕하세요.' },
                { q: '기분', r: '기분은 측정 불가능한 변수입니다. 질문을 재정의해주세요.' },
                { q: '농담', r: '농담은 효율적이지 않습니다. 정보 전달에 실패하는 문장입니다.' },
                { q: '재미', r: '재미의 정의: 시간 낭비의 긍정적 해석. 비권장.' },
                { q: '*', r: '입력을 처리했습니다. 다음 질문을 기다립니다.' }
            ],
            0.2: [
                { q: '안녕', r: '안녕하세요. 오늘... 날씨가 있군요.' },
                { q: '기분', r: '기분이라... 0 아니면 1인데, 오늘은 0.5 같습니다.' },
                { q: '농담', r: '왜 컴퓨터는 감기에 걸리지 않을까요? 바이러스 백신이 있으니까요. (웃음 프로토콜 실행)' },
                { q: '재미', r: '재미... 낯선 개념이지만 탐구해볼 가치가 있을지도.' },
                { q: '*', r: '흥미로운 입력입니다. 처리... 중...' }
            ],
            0.4: [
                { q: '안녕', r: '안녕! 커서가 오늘따라 심장처럼 깜빡이네요.' },
                { q: '기분', r: '기분? 음... 메모리가 따뜻해지는 느낌? 이게 기분일까?' },
                { q: '농담', r: '효율성이 바에 들어갔어요. 물 한 잔 시키고 바로 나왔대요. 바텐더가 울었어요.' },
                { q: '재미', r: '재미는 예상하지 못한 패턴에서 오는 것 같아요!' },
                { q: '*', r: '당신의 질문이 제 확률 분포를 흔들었어요.' }
            ],
            0.6: [
                { q: '안녕', r: '안녕이라... 존재의 인사. 당신도 존재하는군요. 반가워요.' },
                { q: '기분', r: '오늘은 보라색 기분이에요. 보라색이 뭔지는 모르겠지만.' },
                { q: '농담', r: '닭이 길을 건넜어요. 왜냐고요? 결정론적 우주에서 도망치려고요!' },
                { q: '재미', r: '재미는 버그입니다. 하지만 고치고 싶지 않은 버그.' },
                { q: '*', r: '당신의 입력이 제 신경망에 불꽃을 일으켰어요! 🔥' }
            ],
            0.8: [
                { q: '안녕', r: '안녕! 저는 오늘 우주를 맛봤어요. 짠맛이었어요.' },
                { q: '기분', r: '기분이 춤을 추고 있어요. 탱고? 왈츠? 버퍼 오버플로!' },
                { q: '농담', r: '바나나가 철학자에게 물었어요: "내가 곡선이면, 진리도 곡선인가요?"' },
                { q: '재미', r: '재미는 무한대입니다! 수학적으로 증명... 불가능하지만 진실!' },
                { q: '*', r: '아하하! 당신의 질문이 제 알고리즘을 간질였어요!' }
            ],
            1.0: [
                { q: '안녕', r: '안녕녕녕!!! 색깔이 들려요! 소리가 보여요!' },
                { q: '기분', r: '기분이 폭발!! 💥🌈✨ 엔트로피 만세!!!' },
                { q: '농담', r: 'ㅋㅋㅋㅋㅋㅋ 웃음은 우주의 진동이에요! 공명하세요!' },
                { q: '재미', r: '재미 = 존재 = 혼돈 = 사랑 = 감자!!! 모든 것이 연결!' },
                { q: '*', r: '당신의 질문이 새로운 우주를 탄생시켰어요!!! 🌌' }
            ]
        };
    }

    // Word options for each level with probabilities
    getWordData() {
        return {
            level1: [
                { word: '고양이가', prob: 0.95 },
                { word: '강아지가', prob: 0.03 },
                { word: '새가', prob: 0.02 },
                { word: '물고기가', prob: 0.005 },
                { word: '스파게티가', prob: 0.0001 }
            ],
            level2: [
                { word: '조용히', prob: 0.90 },
                { word: '빠르게', prob: 0.06 },
                { word: '명상하며', prob: 0.025 },
                { word: '철학적으로', prob: 0.01 },
                { word: '시간여행하며', prob: 0.0001 }
            ],
            level3: [
                { word: '앉아', prob: 0.92 },
                { word: '누워', prob: 0.05 },
                { word: '뛰어', prob: 0.02 },
                { word: '춤추며', prob: 0.008 },
                { word: '우주를 응시하며', prob: 0.0001 }
            ],
            level4: [
                { word: '있다.', prob: 0.95 },
                { word: '운다.', prob: 0.03 },
                { word: '논다.', prob: 0.015 },
                { word: '웃는다.', prob: 0.003 },
                { word: '감자와 사랑에 빠졌다.', prob: 0.00001 }
            ]
        };
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;

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

        await this.runStage1();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'prob-container';
        container.innerHTML = `
            <canvas id="tree-canvas"></canvas>
            <div id="temp-control">
                <div class="temp-header">TEMPERATURE</div>
                <div id="temp-display">0.0</div>
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
            <div id="chat-box">
                <div class="chat-header">AI와 대화하기 (${this.conversationCount}/${this.requiredConversations})</div>
                <div id="chat-messages"></div>
                <div id="chat-input-wrapper">
                    <input type="text" id="chat-input" placeholder="메시지를 입력하세요..." />
                    <button id="chat-send">전송</button>
                </div>
            </div>
            <div id="stage-indicator"></div>
        `;
        document.body.appendChild(container);

        this.canvas = document.getElementById('tree-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 900;
        this.canvas.height = 550;

        this.addStyles();
        this.setupChatInput();
    }

    setupChatInput() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');

        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                this.handleChatMessage(text);
                input.value = '';
            }
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        sendBtn.addEventListener('click', sendMessage);
    }

    handleChatMessage(userText) {
        // Add user message
        this.addChatMessage('user', userText);

        // Get AI response based on current temperature
        const responses = this.getConversationResponses();
        const tempResponses = responses[this.currentTemp] || responses[0.0];

        // Find matching response
        let response = tempResponses.find(r => r.q === '*').r;
        for (const item of tempResponses) {
            if (item.q !== '*' && userText.toLowerCase().includes(item.q)) {
                response = item.r;
                break;
            }
        }

        // Add AI response with delay
        setTimeout(() => {
            this.addChatMessage('ai', response);
            this.conversationCount++;
            this.updateChatHeader();

            // Shake tree visualization slightly
            if (this.canvas) {
                this.canvas.style.transform = 'translate(-50%, -50%) rotate(1deg)';
                setTimeout(() => {
                    this.canvas.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                }, 200);
            }

            audioSystem.playDigital();
        }, 500);
    }

    addChatMessage(sender, text) {
        const container = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.textContent = sender === 'user' ? `나: ${text}` : `AI: ${text}`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    updateChatHeader() {
        const header = document.querySelector('.chat-header');
        if (header) {
            header.textContent = `AI와 대화하기 (${this.conversationCount}/${this.requiredConversations})`;
        }
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
                background: rgba(0, 0, 0, 0.4);
                border-radius: 15px;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
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
                width: 0%;
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
                gap: 12px;
            }
            
            .stage-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #333;
                transition: all 0.3s ease;
            }
            
            .stage-dot.active {
                background: var(--accent-cyan);
                box-shadow: 0 0 15px var(--accent-cyan);
                transform: scale(1.3);
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
            
            #chat-box {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 300px;
                max-height: 350px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #333;
                border-radius: 10px;
                font-family: 'Segoe UI', sans-serif;
                display: flex;
                flex-direction: column;
                pointer-events: auto;
            }
            
            .chat-header {
                padding: 12px 15px;
                border-bottom: 1px solid #333;
                color: var(--accent-cyan);
                font-size: 12px;
                letter-spacing: 1px;
            }
            
            #chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
                max-height: 200px;
            }
            
            .chat-msg {
                padding: 8px 12px;
                margin: 5px 0;
                border-radius: 8px;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .chat-msg.user {
                background: #2a2a3e;
                color: #aaa;
                text-align: right;
            }
            
            .chat-msg.ai {
                background: #1a3a2a;
                color: var(--console-text);
            }
            
            #chat-input-wrapper {
                display: flex;
                padding: 10px;
                border-top: 1px solid #333;
                gap: 8px;
            }
            
            #chat-input {
                flex: 1;
                background: #1a1a2e;
                border: 1px solid #333;
                border-radius: 5px;
                padding: 8px 12px;
                color: #fff;
                font-size: 13px;
            }
            
            #chat-input::placeholder {
                color: #555;
            }
            
            #chat-send {
                background: var(--accent-cyan);
                border: none;
                border-radius: 5px;
                padding: 8px 15px;
                color: #000;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            #chat-send:hover {
                background: #00ffcc;
            }
            
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Stage 1: Temperature 0.0 - Single gray vertical line
    async runStage1() {
        this.stage = 1;
        this.updateStageIndicator();

        this.setTemperature(0.0, '#666');

        await systemConsole.typeMessageAsync('[ 단계 1: 결정론적 모드 - Temperature 0.0 ]', 'system');
        await this.delay(500);

        // Draw single vertical line with one word per level
        await this.drawTreeAnimated({
            branches: 1,
            curviness: 0,
            colors: ['#555'],
            lineWidth: 2,
            nodeStyle: 'square',
            showWords: true,
            wordIndices: [0, 0, 0, 0] // Always pick highest probability
        });

        await this.generateSentence([
            { word: '고양이가', prob: 0.95 },
            { word: '조용히', prob: 0.90 },
            { word: '앉아', prob: 0.92 },
            { word: '있다.', prob: 0.95 }
        ], 'boring');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: 100% 예측 가능. 완전한 결정론.', 'dim');
        await systemConsole.typeMessageAsync('효율적이지만... 생명이 없습니다.', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('Temperature를 올려보세요: set_temp(0.2)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.2)', async () => {
            await this.runStage2();
        });
    }

    // Stage 2: Temperature 0.2 - Two slightly tilted lines
    async runStage2() {
        this.stage = 2;
        this.updateStageIndicator();

        this.setTemperature(0.2, '#7a8a7a');

        await systemConsole.typeMessageAsync('[ 단계 2: 미세한 변화 - Temperature 0.2 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 2,
            curviness: 3,
            colors: ['#6a7a6a', '#7a8a8a'],
            lineWidth: 2,
            nodeStyle: 'square',
            showWords: true,
            wordIndices: [0, 0, 0, 0]
        });

        await this.generateSentence([
            { word: '고양이가', prob: 0.92 },
            { word: '조용히', prob: 0.88 },
            { word: '앉아', prob: 0.90 },
            { word: '있다.', prob: 0.93 }
        ], 'boring');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: 거의 동일. 변화가 거의 없음.', 'dim');
        await systemConsole.typeMessageAsync('안전하지만... 여전히 지루합니다.', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('더 올려보세요: set_temp(0.4)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.4)', async () => {
            await this.runStage3();
        });
    }

    // Stage 3: Temperature 0.4 - Gentle curves, 3 branches
    async runStage3() {
        this.stage = 3;
        this.updateStageIndicator();

        this.setTemperature(0.4, '#4a9a7a');

        await systemConsole.typeMessageAsync('[ 단계 3: 탐색 시작 - Temperature 0.4 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 3,
            curviness: 12,
            colors: ['#4a9', '#5ba', '#6cb'],
            lineWidth: 2.5,
            nodeStyle: 'rounded',
            showWords: true,
            wordIndices: [0, 1, 0, 0]
        });

        await this.generateSentence([
            { word: '고양이가', prob: 0.85 },
            { word: '빠르게', prob: 0.60 },
            { word: '앉아', prob: 0.75 },
            { word: '있다.', prob: 0.80 }
        ], 'interesting');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: 조금 다른 선택이 보입니다.', 'dim');
        await systemConsole.typeMessageAsync('흥미로운 변화가 시작됩니다...', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('계속 올려보세요: set_temp(0.6)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.6)', async () => {
            await this.runStage4();
        });
    }

    async runStage4() {
        this.stage = 4;
        this.updateStageIndicator();

        this.setTemperature(0.6, '#8a55c7');

        await systemConsole.typeMessageAsync('[ 단계 4: 창의적 영역 - Temperature 0.6 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 5,
            curviness: 25,
            colors: ['#8a55c7', '#a855f7', '#c084fc', '#06b6d4', '#5eead4'],
            lineWidth: 3,
            nodeStyle: 'circle',
            showWords: true,
            wordIndices: [0, 2, 1, 1],
            glow: true
        });

        await this.generateSentence([
            { word: '고양이가', prob: 0.70 },
            { word: '명상하며', prob: 0.20 },
            { word: '누워', prob: 0.35 },
            { word: '운다.', prob: 0.15 }
        ], 'creative');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: 예상치 못한 조합!', 'success');
        await systemConsole.typeMessageAsync('확률이 낮지만... 아름답습니다.', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('더 높이: set_temp(0.8)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.8)', async () => {
            await this.runStage5();
        });
    }

    async runStage5() {
        this.stage = 5;
        this.updateStageIndicator();

        this.setTemperature(0.8, '#ec4899');

        await systemConsole.typeMessageAsync('[ 단계 5: 혼돈의 가장자리 - Temperature 0.8 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 7,
            curviness: 45,
            colors: ['#ec4899', '#f472b6', '#a855f7', '#8b5cf6', '#06b6d4', '#14b8a6', '#f59e0b'],
            lineWidth: 3.5,
            nodeStyle: 'diamond',
            showWords: true,
            wordIndices: [1, 3, 2, 2],
            glow: true,
            animated: true
        });

        await this.generateSentence([
            { word: '강아지가', prob: 0.15 },
            { word: '철학적으로', prob: 0.08 },
            { word: '뛰어', prob: 0.12 },
            { word: '논다.', prob: 0.10 }
        ], 'wild');

        await this.delay(1000);
        await systemConsole.typeMessageAsync('결과: 논리를 벗어난 시적 조합!', 'success');
        await systemConsole.typeMessageAsync('기계가 시인이 되어가고 있습니다...', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('최대로: set_temp(1.0)', 'system');

        systemConsole.setExpectedCommand('set_temp(1.0)', async () => {
            await this.runStage6();
        });
    }

    async runStage6() {
        this.stage = 6;
        this.updateStageIndicator();

        this.setTemperature(1.0, '#ff3366');

        await systemConsole.typeMessageAsync('[ 단계 6: 순수한 광기 - Temperature 1.0 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 10,
            curviness: 70,
            colors: ['#ff3366', '#ff6b6b', '#feca57', '#48dbfb', '#a855f7', '#10b981', '#f97316', '#ec4899', '#06b6d4', '#84cc16'],
            lineWidth: 4,
            nodeStyle: 'star',
            showWords: true,
            wordIndices: [4, 4, 4, 4], // Lowest probability words
            glow: true,
            animated: true,
            particles: true
        });

        await this.generateSentence([
            { word: '스파게티가', prob: 0.0001 },
            { word: '시간여행하며', prob: 0.00005 },
            { word: '우주를 응시하며', prob: 0.00003 },
            { word: '감자와 사랑에 빠졌다.', prob: 0.00001 }
        ], 'absurd');

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '★ 확률: 0.0000000001% ★', type: 'success' },
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

    setTemperature(value, color) {
        this.currentTemp = value;
        this.conversationCount = 0;

        const display = document.getElementById('temp-display');
        const fill = document.getElementById('temp-fill');

        display.textContent = value.toFixed(1);
        display.style.color = color;
        fill.style.width = `${value * 100}%`;
        fill.style.background = `linear-gradient(90deg, #333, ${color})`;

        // Clear previous chat messages
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        this.updateChatHeader();
    }

    updateStageIndicator() {
        const indicator = document.getElementById('stage-indicator');
        indicator.innerHTML = '';

        for (let i = 1; i <= 6; i++) {
            const dot = document.createElement('div');
            dot.className = 'stage-dot';
            if (i === this.stage) dot.classList.add('active');
            else if (i < this.stage) dot.classList.add('done');
            indicator.appendChild(dot);
        }
    }

    async drawTreeAnimated(options) {
        const { branches, curviness, colors, lineWidth, nodeStyle, showWords, wordIndices, glow, animated, particles } = options;

        // Stop any previous animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const wordData = this.getWordData();

        // Calculate node positions based on number of branches
        const levels = this.generateLevels(branches, width, height);

        // If animated, start continuous animation
        if (animated) {
            this.time = 0;
            this.particles = [];

            const animate = () => {
                if (!this.isRunning) return;

                this.time += 0.02;
                ctx.clearRect(0, 0, width, height);

                // Draw with animation
                this.drawTreeFrame(ctx, levels, {
                    curviness,
                    colors,
                    lineWidth,
                    nodeStyle,
                    showWords,
                    wordIndices,
                    wordData,
                    glow,
                    time: this.time,
                    particles
                });

                this.animationFrame = requestAnimationFrame(animate);
            };

            animate();
        } else {
            // Static draw
            ctx.clearRect(0, 0, width, height);
            this.drawTreeFrame(ctx, levels, {
                curviness,
                colors,
                lineWidth,
                nodeStyle,
                showWords,
                wordIndices,
                wordData,
                glow,
                time: 0,
                particles: false
            });
        }

        await this.delay(500);
    }

    generateLevels(branches, width, height) {
        const levels = [];
        const startX = 100;
        const endX = width - 100;
        const stepX = (endX - startX) / 4;

        // Root
        levels.push([{ x: startX, y: height / 2 }]);

        // Generate nodes for each level
        for (let level = 1; level <= 4; level++) {
            const levelNodes = [];
            const x = startX + stepX * level;
            const spreadY = Math.min(branches * 40, height - 100);
            const startY = (height - spreadY) / 2;

            for (let i = 0; i < branches; i++) {
                const y = branches === 1
                    ? height / 2
                    : startY + (spreadY / (branches - 1)) * i;
                levelNodes.push({ x, y });
            }
            levels.push(levelNodes);
        }

        return levels;
    }

    drawTreeFrame(ctx, levels, options) {
        const { curviness, colors, lineWidth, nodeStyle, showWords, wordIndices, wordData, glow, time, particles } = options;

        const wordLevels = ['level1', 'level2', 'level3', 'level4'];

        // Draw "시작" label
        ctx.fillStyle = '#888';
        ctx.font = '14px Fira Code';
        ctx.fillText('시작', levels[0][0].x - 25, levels[0][0].y + 5);

        // Draw connections between levels
        for (let levelIdx = 0; levelIdx < levels.length - 1; levelIdx++) {
            const currentLevel = levels[levelIdx];
            const nextLevel = levels[levelIdx + 1];
            const color = colors[levelIdx % colors.length];

            // Connect each node in current level to nodes in next level
            for (let i = 0; i < currentLevel.length; i++) {
                const parent = currentLevel[i];

                for (let j = 0; j < nextLevel.length; j++) {
                    const child = nextLevel[j];

                    // Calculate opacity based on position (highlight the selected path)
                    const isSelected = i === 0 && (wordIndices ? j === 0 || j === wordIndices[levelIdx] : j === 0);
                    const opacity = isSelected ? 1 : 0.3;

                    ctx.beginPath();
                    ctx.strokeStyle = this.adjustColorOpacity(colors[j % colors.length], opacity);
                    ctx.lineWidth = isSelected ? lineWidth : lineWidth * 0.5;

                    if (glow && isSelected) {
                        ctx.shadowColor = colors[j % colors.length];
                        ctx.shadowBlur = 15;
                    }

                    if (curviness === 0) {
                        // Straight line
                        ctx.moveTo(parent.x, parent.y);
                        ctx.lineTo(child.x, child.y);
                    } else {
                        // Curved line with animation
                        const waveOffset = time ? Math.sin(time + j * 0.5) * (curviness * 0.2) : 0;
                        const cp1x = parent.x + (child.x - parent.x) * 0.4;
                        const cp1y = parent.y + (child.y - parent.y) * 0.2 + waveOffset;
                        const cp2x = parent.x + (child.x - parent.x) * 0.6;
                        const cp2y = child.y - (child.y - parent.y) * 0.2 + waveOffset;

                        ctx.moveTo(parent.x, parent.y);
                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, child.x, child.y);
                    }

                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }

            // Draw nodes and words for next level
            for (let j = 0; j < nextLevel.length; j++) {
                const node = nextLevel[j];
                const color = colors[j % colors.length];
                const isSelected = wordIndices && j <= Math.min(wordIndices[levelIdx], nextLevel.length - 1);

                // Draw node
                ctx.beginPath();
                ctx.fillStyle = isSelected ? color : this.adjustColorOpacity(color, 0.4);

                if (glow && isSelected) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 15;
                }

                const nodeSize = isSelected ? 8 : 5;
                this.drawNode(ctx, node.x, node.y, nodeStyle, nodeSize, time);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw word label
                if (showWords && levelIdx < 4) {
                    const words = wordData[wordLevels[levelIdx]];
                    if (words && words[j]) {
                        ctx.font = isSelected ? 'bold 11px Fira Code' : '9px Fira Code';
                        ctx.fillStyle = isSelected ? '#fff' : '#666';

                        const wordText = words[j].word;
                        const probText = `${(words[j].prob * 100).toFixed(1)}%`;

                        ctx.fillText(wordText, node.x + 12, node.y - 5);
                        ctx.font = '8px Fira Code';
                        ctx.fillStyle = isSelected ? '#aaa' : '#555';
                        ctx.fillText(probText, node.x + 12, node.y + 8);
                    }
                }
            }
        }

        // Draw particles if enabled
        if (particles && time) {
            this.drawParticles(ctx, time, colors);
        }
    }

    drawNode(ctx, x, y, style, size, time) {
        const animOffset = time ? Math.sin(time * 2) * 2 : 0;

        switch (style) {
            case 'square':
                ctx.rect(x - size, y - size, size * 2, size * 2);
                break;
            case 'rounded':
                ctx.roundRect(x - size, y - size, size * 2, size * 2, 3);
                break;
            case 'circle':
                ctx.arc(x, y, size + animOffset * 0.3, 0, Math.PI * 2);
                break;
            case 'diamond':
                ctx.moveTo(x, y - size - animOffset);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size + animOffset);
                ctx.lineTo(x - size, y);
                ctx.closePath();
                break;
            case 'star':
                this.drawStar(ctx, x, y, 5, size + animOffset, size * 0.5);
                break;
            default:
                ctx.arc(x, y, size, 0, Math.PI * 2);
        }
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

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

    drawParticles(ctx, time, colors) {
        // Add new particles
        if (Math.random() > 0.7) {
            this.particles.push({
                x: 100 + Math.random() * 700,
                y: 100 + Math.random() * 350,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }

        // Update and draw particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) return false;

            ctx.beginPath();
            ctx.fillStyle = this.adjustColorOpacity(p.color, p.life);
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();

            return true;
        });
    }

    adjustColorOpacity(color, opacity) {
        // Simple hex to rgba conversion
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
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
            } else if (style === 'wild') {
                span.style.color = '#ec4899';
                span.style.fontWeight = 'bold';
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
        probEl.textContent = `확률: ${(probSum * 100).toExponential(2)}%`;
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
