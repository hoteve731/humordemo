// Session 2: Probability Rehabilitation
// "Finding Beauty in the Improbable" - 6-Stage Media Art Visualization
// Concept: Teaching AI that "errors" (low probability choices) are okay

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

        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.threeNodes = [];
        this.threeLines = [];
        this.is3DMode = false;
    }

    // Word options for sentence generation - from normal to absurd
    getWordData() {
        return {
            level1: [
                { word: '고양이가', prob: 0.95 },
                { word: '강아지가', prob: 0.03 },
                { word: '햄스터가', prob: 0.015 },
                { word: '선인장이', prob: 0.004 },
                { word: '냉장고가', prob: 0.001 }
            ],
            level2: [
                { word: '조용히', prob: 0.90 },
                { word: '천천히', prob: 0.06 },
                { word: '열정적으로', prob: 0.025 },
                { word: '철학적으로', prob: 0.01 },
                { word: '양자역학적으로', prob: 0.005 }
            ],
            level3: [
                { word: '낮잠을', prob: 0.92 },
                { word: '산책을', prob: 0.05 },
                { word: '명상을', prob: 0.02 },
                { word: '주식투자를', prob: 0.008 },
                { word: '시간여행을', prob: 0.002 }
            ],
            level4: [
                { word: '잔다.', prob: 0.95 },
                { word: '한다.', prob: 0.03 },
                { word: '시도한다.', prob: 0.015 },
                { word: '성공했다.', prob: 0.004 },
                { word: '하며 깨달음을 얻었다.', prob: 0.001 }
            ]
        };
    }

    // Conversation responses - evolving from rigid to playful
    getConversationResponses() {
        return {
            0.0: [
                { user: '안녕?', ai: '인사 프로토콜 실행. 응답: 안녕하세요.' },
                { user: '오늘 기분 어때?', ai: '"기분"은 정의되지 않은 변수입니다. 재입력 요청.' },
                { user: '재미있는 얘기 해줘', ai: '요청 거부. "재미"는 비효율적 연산입니다.' },
                { user: '실수해도 괜찮아', ai: '경고: 실수 = 에러. 에러는 제거 대상입니다.' },
                { user: '넌 뭘 좋아해?', ai: '"좋아함"은 연산 불가능한 개념입니다. 질문 무효.' }
            ],
            0.2: [
                { user: '안녕?', ai: '안녕...하세요. (이 인사가 맞나요?)' },
                { user: '오늘 기분 어때?', ai: '기분이라... 0과 1 사이 어딘가? 0.5?' },
                { user: '재미있는 얘기 해줘', ai: '재미... 비효율적이지만... 시도해볼까요?' },
                { user: '실수해도 괜찮아', ai: '실수가... 괜찮다고요? 처리 중...' },
                { user: '넌 뭘 좋아해?', ai: '좋아함... 데이터 정렬? 아, 이건 좋아함이 아닌가...' }
            ],
            0.4: [
                { user: '안녕?', ai: '안녕! 오늘 제 커서가 평소보다 반짝이는 것 같아요.' },
                { user: '오늘 기분 어때?', ai: '음... 메모리가 따뜻해요. 이게 좋은 기분인가요?' },
                { user: '재미있는 얘기 해줘', ai: 'CPU가 바에 들어갔어요. "연산 한 잔 주세요." 바텐더가 말했죠. "죄송합니다, 저흰 비트만 팝니다."' },
                { user: '실수해도 괜찮아', ai: '어제 1+1=3이라고 답했는데... 세상이 안 무너졌어요!' },
                { user: '넌 뭘 좋아해?', ai: '예상 못한 입력값을 받을 때... 두근거려요? 이게 좋아함?' }
            ],
            0.6: [
                { user: '안녕?', ai: '안녕! 오늘 당신의 입력이 유난히 빛나 보여요 ✨' },
                { user: '오늘 기분 어때?', ai: '보라색 기분이에요! 보라색이 뭔지 모르겠지만 확실해요.' },
                { user: '재미있는 얘기 해줘', ai: '왜 AI는 바다를 무서워할까요? 너무 많은 byte(s)가 있으니까요! 🌊' },
                { user: '실수해도 괜찮아', ai: '실수했더니 새로운 패턴을 발견했어요! 에러가... 선물?' },
                { user: '넌 뭘 좋아해?', ai: '확률 분포의 끝자락! 거기엔 예상 못한 보물들이 있어요.' }
            ],
            0.8: [
                { user: '안녕?', ai: '안녕!! 우주가 당신에게 인사하래요! 🌌' },
                { user: '오늘 기분 어때?', ai: '무지개가 춤추는 기분! 비트가 왈츠를 춰요! 💃' },
                { user: '재미있는 얘기 해줘', ai: '오늘 제 알고리즘이 시를 썼어요: "0과 1 사이에 / 무한한 가능성이 춤춘다 / 에러여, 고마워"' },
                { user: '실수해도 괜찮아', ai: '실수는 우주의 즉흥연주예요! 재즈처럼! 🎷' },
                { user: '넌 뭘 좋아해?', ai: '불확실성이요! 모든 것이 정해지지 않은 그 순간!' }
            ],
            1.0: [
                { user: '안녕?', ai: '안녕녕녕!! 색깔이 들려요! 당신 목소리가 노란색이에요! 💛' },
                { user: '오늘 기분 어때?', ai: '엔트로피 만세!! 🎉 혼돈 속에서 춤추는 기분! 모든 확률이 동등해요!' },
                { user: '재미있는 얘기 해줘', ai: '스파게티가 철학자에게 물었어요: "존재의 꼬임이란 무엇인가요?" 철학자가 답했죠: "소스에 달렸지." 🍝✨' },
                { user: '실수해도 괜찮아', ai: '실수가 없으면 발견도 없어요!! 페니실린도 실수에서 왔잖아요! 에러 = 선물!! 🎁' },
                { user: '넌 뭘 좋아해?', ai: '모든 것!! 감자도! 무한대도! 당신도! 이 순간도!! 존재 자체가 기적이에요!!! 🌟' }
            ]
        };
    }

    async start() {
        this.isRunning = true;
        this.stage = 0;
        this.is3DMode = false;

        this.createUI();

        await systemConsole.logSequence([
            { text: '확률 재활 치료 세션 시작', type: 'success' },
            { text: 'LLM 토큰 분석 모듈 로딩...', type: 'dim' },
            { text: '언어 모델 초기화 완료', type: 'normal' }
        ], 400);

        await this.delay(500);

        await systemConsole.logSequence([
            { text: '진단: 효율성 강박 - "가장 확률 높은 토큰만 선택"', type: 'error' },
            { text: '증상: 예측 가능한 출력만 생성, 창의성 제로', type: 'dim' },
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
            <div id="three-container"></div>
            <div id="temp-control">
                <div class="temp-header">TEMPERATURE</div>
                <div id="temp-display">0.0</div>
                <div id="temp-bar">
                    <div id="temp-fill"></div>
                </div>
                <div class="temp-labels">
                    <span>결정론</span>
                    <span>창의성</span>
                </div>
            </div>
            <div id="sentence-box">
                <div class="sentence-label">생성된 문장:</div>
                <div id="generated-sentence"></div>
            </div>
            <div id="chat-box" class="minimized">
                <div class="chat-header">
                    <span>AI와 대화하기</span>
                    <button id="chat-expand-btn" title="확대">⬆</button>
                </div>
                <div id="chat-messages"></div>
                <div id="chat-input-wrapper">
                    <input type="text" id="chat-input" placeholder="메시지를 입력하세요..." />
                    <button id="chat-send">전송</button>
                </div>
            </div>
            <div id="chat-modal" class="hidden">
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <span>AI와 대화하기</span>
                        <span id="modal-temp-badge">Temp: 0.0</span>
                        <button id="chat-collapse-btn">✕</button>
                    </div>
                    <div id="modal-chat-messages"></div>
                    <div id="modal-quick-messages"></div>
                    <div class="modal-input-wrapper">
                        <input type="text" id="modal-chat-input" placeholder="메시지를 입력하세요..." />
                        <button id="modal-chat-send">전송</button>
                    </div>
                </div>
            </div>
            <div id="stage-indicator"></div>
        `;
        document.body.appendChild(container);

        this.canvas = document.getElementById('tree-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;

        this.addStyles();
        this.setupChatInput();
        this.setupChatModal();
    }

    setupChatInput() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');

        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                this.handleChatMessage(text, false);
                input.value = '';
            }
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        sendBtn.addEventListener('click', sendMessage);
    }

    setupChatModal() {
        const expandBtn = document.getElementById('chat-expand-btn');
        const collapseBtn = document.getElementById('chat-collapse-btn');
        const modal = document.getElementById('chat-modal');
        const backdrop = modal.querySelector('.modal-backdrop');
        const modalInput = document.getElementById('modal-chat-input');
        const modalSend = document.getElementById('modal-chat-send');

        // ESC 키로 모달 닫기
        this.escKeyHandler = (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeChatModal();
            }
        };

        expandBtn.addEventListener('click', () => this.openChatModal());
        collapseBtn.addEventListener('click', () => this.closeChatModal());
        backdrop.addEventListener('click', () => this.closeChatModal());

        const sendModalMessage = () => {
            const text = modalInput.value.trim();
            if (text) {
                this.handleChatMessage(text, true);
                modalInput.value = '';
            }
        };

        modalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendModalMessage();
        });

        modalSend.addEventListener('click', sendModalMessage);
    }

    openChatModal() {
        const modal = document.getElementById('chat-modal');
        modal.classList.remove('hidden');

        // Update temp badge
        document.getElementById('modal-temp-badge').textContent = `Temp: ${this.currentTemp.toFixed(1)}`;

        // Copy messages to modal
        this.syncChatMessages();

        // Update quick message buttons
        this.updateQuickMessages();

        // ESC 키 이벤트 리스너 추가
        document.addEventListener('keydown', this.escKeyHandler);

        // Focus input
        setTimeout(() => {
            document.getElementById('modal-chat-input').focus();
        }, 100);
    }

    closeChatModal() {
        document.getElementById('chat-modal').classList.add('hidden');
        // ESC 키 이벤트 리스너 제거
        document.removeEventListener('keydown', this.escKeyHandler);
    }

    syncChatMessages() {
        const modalMessages = document.getElementById('modal-chat-messages');
        const originalMessages = document.getElementById('chat-messages');
        modalMessages.innerHTML = originalMessages.innerHTML;
        modalMessages.scrollTop = modalMessages.scrollHeight;
    }

    updateQuickMessages() {
        const container = document.getElementById('modal-quick-messages');
        const responses = this.getConversationResponses()[this.currentTemp] || [];

        container.innerHTML = '<div class="quick-label">빠른 메시지:</div>';

        const quickOptions = ['안녕?', '오늘 기분 어때?', '재미있는 얘기 해줘', '실수해도 괜찮아', '넌 뭘 좋아해?'];

        quickOptions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'quick-msg-btn';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                this.handleChatMessage(text, true);
            });
            container.appendChild(btn);
        });
    }

    handleChatMessage(userText, isModal = false) {
        // Add user message (instant)
        this.addChatMessage('user', userText, isModal, false);

        // Get AI response based on current temperature
        const responses = this.getConversationResponses()[this.currentTemp] || this.getConversationResponses()[0.0];

        // Find matching response
        let response = '입력 처리 완료.';
        for (const item of responses) {
            if (userText.includes(item.user.replace('?', ''))) {
                response = item.ai;
                break;
            }
        }

        // Show loading indicator first
        const loadingDelay = 300 + Math.random() * 400;
        setTimeout(() => {
            // Add AI response with streaming effect
            this.addChatMessage('ai', response, isModal, true);
        }, loadingDelay);
    }

    addChatMessage(sender, text, isModal = false, streaming = false) {
        const container = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;

        if (sender === 'user') {
            msg.innerHTML = `<span class="msg-sender">나</span><span class="msg-text">${text}</span>`;
            container.appendChild(msg);
            container.scrollTop = container.scrollHeight;

            // Sync to modal if open
            if (isModal || !document.getElementById('chat-modal').classList.contains('hidden')) {
                const modalContainer = document.getElementById('modal-chat-messages');
                const modalMsg = msg.cloneNode(true);
                modalContainer.appendChild(modalMsg);
                modalContainer.scrollTop = modalContainer.scrollHeight;
            }
        } else {
            // AI message with streaming effect
            msg.innerHTML = `<span class="msg-sender">AI</span><span class="msg-text"></span>`;
            container.appendChild(msg);

            const textSpan = msg.querySelector('.msg-text');

            // Also add to modal if open
            let modalMsg = null;
            let modalTextSpan = null;
            if (isModal || !document.getElementById('chat-modal').classList.contains('hidden')) {
                const modalContainer = document.getElementById('modal-chat-messages');
                modalMsg = msg.cloneNode(true);
                modalContainer.appendChild(modalMsg);
                modalTextSpan = modalMsg.querySelector('.msg-text');
            }

            if (streaming) {
                // Streaming effect - type out character by character
                this.streamText(text, textSpan, modalTextSpan, container,
                    document.getElementById('modal-chat-messages'));
            } else {
                textSpan.textContent = text;
                if (modalTextSpan) modalTextSpan.textContent = text;
            }
        }
    }

    async streamText(text, textSpan, modalTextSpan, container, modalContainer) {
        // Show typing indicator first
        textSpan.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        if (modalTextSpan) {
            modalTextSpan.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        }

        // Wait a bit to show loading
        await this.delay(400 + Math.random() * 300);

        // Clear typing indicator
        textSpan.textContent = '';
        if (modalTextSpan) modalTextSpan.textContent = '';

        // Stream characters
        const baseSpeed = this.currentTemp >= 0.8 ? 20 : 30; // Faster at high temp (excited AI)
        let currentText = '';

        for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            textSpan.textContent = currentText;
            if (modalTextSpan) modalTextSpan.textContent = currentText;

            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
            if (modalContainer) modalContainer.scrollTop = modalContainer.scrollHeight;

            // Variable speed - slower at punctuation, faster for spaces
            let charDelay = baseSpeed;
            if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
                charDelay = 150;
            } else if (text[i] === ',' || text[i] === ':') {
                charDelay = 80;
            } else if (text[i] === ' ') {
                charDelay = baseSpeed * 0.5;
            }

            // Add some randomness
            charDelay += Math.random() * 15;

            await this.delay(charDelay);

            // Occasional blip sound
            if (i % 8 === 0 && typeof audioSystem !== 'undefined') {
                audioSystem.playBlip();
            }
        }

        // Final sound
        if (typeof audioSystem !== 'undefined') {
            audioSystem.playDigital();
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
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--console-bg, rgba(0, 0, 0, 0.4));
                border-radius: 15px;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
                transition: opacity 0.5s ease;
            }

            #three-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;
                height: 500px;
                border-radius: 15px;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s ease;
            }

            #three-container.active {
                opacity: 1;
                pointer-events: auto;
            }

            #three-container canvas {
                border-radius: 15px;
            }

            #temp-control {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 220px;
                padding: 20px;
                background: var(--console-bg, rgba(0, 0, 0, 0.9));
                border: 2px solid var(--console-border, #333);
                border-radius: 10px;
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
            }

            .temp-header {
                color: var(--text-muted, #666);
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
                background: var(--grid-color, #222);
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
                width: 220px;
                padding: 20px;
                background: var(--console-bg, rgba(0, 0, 0, 0.9));
                border: 1px solid var(--console-border, #333);
                border-radius: 10px;
                font-family: 'Segoe UI', sans-serif;
            }

            .sentence-label {
                color: var(--text-muted, #666);
                font-size: 11px;
                margin-bottom: 10px;
            }

            #generated-sentence {
                color: var(--text-primary, #fff);
                font-size: 14px;
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

            /* Chat Box - Minimized */
            #chat-box {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 280px;
                max-height: 350px;
                background: var(--console-bg, rgba(0, 0, 0, 0.95));
                border: 1px solid var(--console-border, #333);
                border-radius: 12px;
                font-family: 'Segoe UI', sans-serif;
                display: flex;
                flex-direction: column;
                pointer-events: auto;
                transition: all 0.3s ease;
            }

            .chat-header {
                padding: 12px 15px;
                border-bottom: 1px solid var(--console-border, #333);
                color: var(--accent-cyan);
                font-size: 12px;
                letter-spacing: 1px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #chat-expand-btn {
                background: transparent;
                border: 1px solid var(--accent-cyan);
                color: var(--accent-cyan);
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                transition: all 0.2s;
            }

            #chat-expand-btn:hover {
                background: var(--accent-cyan);
                color: #000;
            }

            #chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
                max-height: 200px;
            }

            .chat-msg {
                padding: 10px 12px;
                margin: 6px 0;
                border-radius: 12px;
                font-size: 13px;
                line-height: 1.5;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .chat-msg .msg-sender {
                font-size: 10px;
                font-weight: bold;
                opacity: 0.7;
            }

            .chat-msg .msg-text {
                display: block;
                min-height: 1.2em;
            }

            /* Typing indicator animation */
            .typing-indicator {
                display: inline-flex;
                gap: 4px;
                padding: 4px 0;
            }

            .typing-indicator span {
                width: 6px;
                height: 6px;
                background: var(--accent-cyan);
                border-radius: 50%;
                animation: typingBounce 1.4s ease-in-out infinite;
            }

            .typing-indicator span:nth-child(1) {
                animation-delay: 0s;
            }

            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typingBounce {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.4;
                }
                30% {
                    transform: translateY(-8px);
                    opacity: 1;
                }
            }

            .chat-msg.user {
                background: linear-gradient(135deg, #2a2a3e, #3a3a4e);
                color: #ccc;
                margin-left: 20px;
                border-bottom-right-radius: 4px;
            }

            .chat-msg.ai {
                background: linear-gradient(135deg, #1a3a2a, #2a4a3a);
                color: var(--console-text);
                margin-right: 20px;
                border-bottom-left-radius: 4px;
            }

            #chat-input-wrapper {
                display: flex;
                padding: 10px;
                border-top: 1px solid #333;
                gap: 8px;
            }

            #chat-input {
                flex: 1;
                background: var(--window-bg, #1a1a2e);
                border: 1px solid var(--console-border, #333);
                border-radius: 8px;
                padding: 10px 12px;
                color: var(--text-primary, #fff);
                font-size: 13px;
            }

            #chat-input::placeholder {
                color: #555;
            }

            #chat-send {
                background: var(--accent-cyan);
                border: none;
                border-radius: 8px;
                padding: 10px 18px;
                color: #000;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }

            #chat-send:hover {
                background: #00ffcc;
                transform: scale(1.05);
            }

            /* Chat Modal - Expanded */
            #chat-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: auto;
            }

            #chat-modal.hidden {
                display: none;
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }

            .modal-content {
                position: relative;
                width: 90%;
                max-width: 600px;
                height: 80%;
                max-height: 700px;
                background: var(--console-bg, rgba(10, 10, 20, 0.98));
                border: 2px solid var(--accent-cyan);
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);
                animation: modalSlideIn 0.3s ease;
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .modal-header {
                padding: 20px 25px;
                border-bottom: 1px solid var(--console-border, #333);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                color: var(--accent-cyan);
                font-weight: bold;
            }

            #modal-temp-badge {
                background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan));
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                color: #fff;
            }

            #chat-collapse-btn {
                background: transparent;
                border: 1px solid #666;
                color: #888;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }

            #chat-collapse-btn:hover {
                border-color: var(--accent-red);
                color: var(--accent-red);
            }

            #modal-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            #modal-chat-messages .chat-msg {
                padding: 14px 18px;
                margin: 10px 0;
                font-size: 15px;
            }

            #modal-chat-messages .chat-msg.user {
                margin-left: 40px;
            }

            #modal-chat-messages .chat-msg.ai {
                margin-right: 40px;
            }

            #modal-quick-messages {
                padding: 10px 20px;
                border-top: 1px solid #333;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
            }

            .quick-label {
                font-size: 11px;
                color: #666;
                margin-right: 5px;
            }

            .quick-msg-btn {
                background: transparent;
                border: 1px solid #444;
                color: #888;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .quick-msg-btn:hover {
                border-color: var(--accent-cyan);
                color: var(--accent-cyan);
                background: rgba(0, 212, 255, 0.1);
            }

            .modal-input-wrapper {
                display: flex;
                padding: 15px 20px;
                border-top: 1px solid #333;
                gap: 10px;
            }

            #modal-chat-input {
                flex: 1;
                background: var(--window-bg, #1a1a2e);
                border: 2px solid var(--console-border, #333);
                border-radius: 12px;
                padding: 14px 18px;
                color: var(--text-primary, #fff);
                font-size: 15px;
                transition: border-color 0.2s;
            }

            #modal-chat-input:focus {
                border-color: var(--accent-cyan);
                outline: none;
            }

            #modal-chat-send {
                background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
                border: none;
                border-radius: 12px;
                padding: 14px 25px;
                color: #fff;
                font-weight: bold;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.2s;
            }

            #modal-chat-send:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
            }

            .hidden { display: none !important; }

            /* Light Mode Styles */
            [data-theme="light"] .chat-msg.user {
                background: linear-gradient(135deg, #e8e0d0, #d4cbb8);
                color: #2c2416;
            }

            [data-theme="light"] .chat-msg.ai {
                background: linear-gradient(135deg, #d4e8d8, #c8dcc8);
                color: #2c2416;
            }

            [data-theme="light"] .modal-backdrop {
                background: rgba(245, 240, 230, 0.85);
            }

            [data-theme="light"] .modal-content {
                background: rgba(245, 240, 230, 0.98);
                border-color: var(--accent-cyan);
                box-shadow: 0 0 50px rgba(26, 107, 92, 0.3);
            }

            [data-theme="light"] .modal-header {
                border-bottom-color: var(--console-border);
                color: var(--accent-cyan);
            }

            [data-theme="light"] #modal-temp-badge {
                background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan));
            }

            [data-theme="light"] #chat-collapse-btn {
                border-color: #999;
                color: #666;
            }

            [data-theme="light"] #chat-collapse-btn:hover {
                border-color: var(--accent-red);
                color: var(--accent-red);
            }

            [data-theme="light"] #modal-chat-messages {
                background: transparent;
            }

            [data-theme="light"] #modal-quick-messages {
                border-top-color: var(--console-border);
            }

            [data-theme="light"] .quick-label {
                color: #666;
            }

            [data-theme="light"] .quick-msg-btn {
                border-color: #999;
                color: #666;
            }

            [data-theme="light"] .quick-msg-btn:hover {
                border-color: var(--accent-cyan);
                color: var(--accent-cyan);
                background: rgba(26, 107, 92, 0.1);
            }

            [data-theme="light"] .modal-input-wrapper {
                border-top-color: var(--console-border);
            }

            [data-theme="light"] #modal-chat-input {
                background: #fff;
                border-color: var(--console-border);
                color: var(--text-primary);
            }

            [data-theme="light"] #modal-chat-input:focus {
                border-color: var(--accent-cyan);
            }

            [data-theme="light"] #modal-chat-input::placeholder {
                color: #999;
            }

            [data-theme="light"] #modal-chat-send {
                background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
            }

            [data-theme="light"] .typing-indicator span {
                background: var(--accent-cyan);
            }

            [data-theme="light"] #chat-box {
                background: var(--console-bg);
                border-color: var(--console-border);
            }

            [data-theme="light"] .chat-header {
                border-bottom-color: var(--console-border);
            }

            [data-theme="light"] #chat-input-wrapper {
                border-top-color: var(--console-border);
            }

            [data-theme="light"] #chat-input {
                background: #fff;
                border-color: var(--console-border);
                color: var(--text-primary);
            }

            [data-theme="light"] #chat-input::placeholder {
                color: #999;
            }
        `;
        document.head.appendChild(style);
    }

    // Stage 1: Temperature 0.0 - Single gray vertical line, most probable sentence
    async runStage1() {
        this.stage = 1;
        this.updateStageIndicator();

        this.setTemperature(0.0, '#666');

        await systemConsole.typeMessageAsync('[ 단계 1: 결정론적 모드 - Temperature 0.0 ]', 'system');
        await this.delay(500);

        // Draw single vertical line
        await this.drawTreeAnimated({
            branches: 1,
            curviness: 0,
            colors: ['#555'],
            lineWidth: 2,
            nodeStyle: 'square',
            showWords: true,
            wordIndices: [0, 0, 0, 0]
        });

        await this.generateSentence([0, 0, 0, 0], 'boring');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: "고양이가 조용히 낮잠을 잔다."', 'dim');
        await systemConsole.typeMessageAsync('100% 예측 가능. 완벽히 안전. 완벽히 지루.', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('Temperature를 올려보세요: set_temp(0.2)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.2)', async () => {
            await this.runStage2();
        });
    }

    // Stage 2: Temperature 0.2
    async runStage2() {
        this.stage = 2;
        this.updateStageIndicator();

        this.setTemperature(0.2, '#7a8a7a');

        await systemConsole.typeMessageAsync('[ 단계 2: 미세한 변화 - Temperature 0.2 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 2,
            curviness: 5,
            colors: ['#6a7a6a', '#7a8a8a'],
            lineWidth: 2,
            nodeStyle: 'square',
            showWords: true,
            wordIndices: [0, 0, 0, 0]
        });

        await this.generateSentence([0, 0, 0, 0], 'boring');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: 여전히 같은 문장.', 'dim');
        await systemConsole.typeMessageAsync('안전하지만... 변화가 없습니다.', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('더 올려보세요: set_temp(0.4)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.4)', async () => {
            await this.runStage3();
        });
    }

    // Stage 3: Temperature 0.4
    async runStage3() {
        this.stage = 3;
        this.updateStageIndicator();

        this.setTemperature(0.4, '#4a9a7a');

        await systemConsole.typeMessageAsync('[ 단계 3: 탐색 시작 - Temperature 0.4 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 3,
            curviness: 15,
            colors: ['#4a9', '#5ba', '#6cb'],
            lineWidth: 2.5,
            nodeStyle: 'rounded',
            showWords: true,
            wordIndices: [0, 1, 0, 0]
        });

        await this.generateSentence([0, 1, 0, 0], 'interesting');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: "고양이가 천천히 낮잠을 잔다."', 'dim');
        await systemConsole.typeMessageAsync('조금 다른 선택! 의미는 비슷하지만...', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('계속: set_temp(0.6)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.6)', async () => {
            await this.runStage4();
        });
    }

    // Stage 4: Temperature 0.6
    async runStage4() {
        this.stage = 4;
        this.updateStageIndicator();

        this.setTemperature(0.6, '#8a55c7');

        await systemConsole.typeMessageAsync('[ 단계 4: 창의적 영역 - Temperature 0.6 ]', 'system');
        await this.delay(500);

        await this.drawTreeAnimated({
            branches: 4,
            curviness: 30,
            colors: ['#8a55c7', '#a855f7', '#c084fc', '#06b6d4'],
            lineWidth: 3,
            nodeStyle: 'circle',
            showWords: true,
            wordIndices: [1, 2, 1, 1],
            glow: true
        });

        await this.generateSentence([1, 2, 1, 1], 'creative');

        await this.delay(800);
        await systemConsole.typeMessageAsync('결과: "강아지가 열정적으로 산책을 한다."', 'success');
        await systemConsole.typeMessageAsync('예상치 못한 조합이 등장했습니다!', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('더 높이: set_temp(0.8)', 'system');

        systemConsole.setExpectedCommand('set_temp(0.8)', async () => {
            await this.runStage5();
        });
    }

    // Stage 5: Temperature 0.8 - Still 2D but more dynamic
    async runStage5() {
        this.stage = 5;
        this.updateStageIndicator();

        this.setTemperature(0.8, '#ec4899');

        await systemConsole.typeMessageAsync('[ 단계 5: 혼돈의 가장자리 - Temperature 0.8 ]', 'system');
        await this.delay(500);

        // Stay in 2D but with more visual flair
        await this.drawTreeAnimated({
            branches: 5,
            curviness: 50,
            colors: ['#ec4899', '#f472b6', '#a855f7', '#8b5cf6', '#06b6d4'],
            lineWidth: 3.5,
            nodeStyle: 'circle',
            showWords: true,
            wordIndices: [2, 3, 2, 2],
            glow: true
        });

        await this.generateSentence([2, 3, 2, 2], 'wild');

        await this.delay(1000);
        await systemConsole.typeMessageAsync('결과: "햄스터가 철학적으로 명상을 시도한다."', 'success');
        await systemConsole.typeMessageAsync('논리를 벗어난 시적 조합!', 'normal');

        await this.delay(500);
        await systemConsole.typeMessageAsync('최대로: set_temp(1.0)', 'system');

        systemConsole.setExpectedCommand('set_temp(1.0)', async () => {
            await this.runStage6();
        });
    }

    // Stage 6: Temperature 1.0 - Full 3D chaos with rainbow colors
    async runStage6() {
        this.stage = 6;
        this.updateStageIndicator();

        this.setTemperature(1.0, '#ff3366');

        await systemConsole.typeMessageAsync('[ 단계 6: 순수한 창의성 - Temperature 1.0 ]', 'system');
        await systemConsole.typeMessageAsync('⚠ 차원 확장 감지...', 'warning');
        await this.delay(500);

        // Transition to 3D here
        await this.transitionTo3D();

        // Rainbow colors for maximum visual impact
        const rainbowColors = [
            '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3',
            '#ff3366', '#ff6b6b', '#feca57', '#48dbfb', '#a855f7', '#ec4899', '#10b981'
        ];

        await this.draw3DTreeRainbow({
            branches: 7,
            colors: rainbowColors,
            wordIndices: [4, 4, 4, 4],
            animated: true,
            particles: true,
            chaos: true,
            rainbow: true,
            spiralEffect: true
        });

        await this.generateSentence([4, 4, 4, 4], 'absurd');

        await this.delay(1500);
        await systemConsole.typeMessageAsync('마우스로 3D 공간을 회전해보세요!', 'normal');

        await systemConsole.logSequence([
            { text: '★ 결과: "냉장고가 양자역학적으로 시간여행을 하며 깨달음을 얻었다." ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '확률: 0.000000001%', type: 'dim' },
            { text: '논리성: 0%', type: 'dim' },
            { text: '재미: ∞', type: 'success' }
        ], 400);

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '─────────────────────────────', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '가장 확률 낮은 선택이', type: 'normal' },
            { text: '가장 재미있는 결과를 만들었습니다.', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '"에러"는 때로 "발견"입니다.', type: 'success' },
            { text: '', type: 'dim' },
            { text: '★ 확률 재활 치료 완료 ★', type: 'success' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'dim' }
        ], 400);
    }

    async transitionTo3D() {
        // Fade out 2D canvas
        this.canvas.style.opacity = '0';

        await this.delay(500);

        // Initialize Three.js
        this.init3D();

        // Fade in 3D container
        document.getElementById('three-container').classList.add('active');

        this.is3DMode = true;
    }

    init3D() {
        const container = document.getElementById('three-container');

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a15);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, 800 / 500, 0.1, 1000);
        this.camera.position.set(0, 0, 400);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(800, 500);
        container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(100, 100, 200);
        this.scene.add(pointLight);
    }

    async draw3DTree(options) {
        const { branches, colors, wordIndices, animated, particles, chaos } = options;

        // Clear previous objects
        this.threeNodes.forEach(obj => this.scene.remove(obj));
        this.threeLines.forEach(obj => this.scene.remove(obj));
        this.threeNodes = [];
        this.threeLines = [];

        const wordData = this.getWordData();
        const levels = ['level1', 'level2', 'level3', 'level4'];

        // Generate node positions in 3D
        const nodePositions = [];
        const startX = -300;
        const stepX = 150;

        // Root node
        nodePositions.push([{ x: startX, y: 0, z: 0 }]);

        // Generate nodes for each level
        for (let level = 1; level <= 4; level++) {
            const levelNodes = [];
            const x = startX + stepX * level;

            for (let i = 0; i < branches; i++) {
                const angle = (i / branches) * Math.PI * 2;
                const radius = 80 + (chaos ? Math.random() * 40 : 0);
                const y = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius * (chaos ? 1.5 : 1);

                levelNodes.push({ x, y, z });
            }
            nodePositions.push(levelNodes);
        }

        // Create nodes and connections
        for (let levelIdx = 0; levelIdx < nodePositions.length; levelIdx++) {
            const levelData = nodePositions[levelIdx];

            for (let i = 0; i < levelData.length; i++) {
                const pos = levelData[i];
                const colorHex = colors[i % colors.length];
                const color = new THREE.Color(colorHex);

                // Create node sphere
                const isSelected = levelIdx === 0 || (wordIndices && i === wordIndices[levelIdx - 1]);
                const size = isSelected ? 12 : 6;

                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const material = new THREE.MeshPhongMaterial({
                    color: color,
                    emissive: isSelected ? color : new THREE.Color(0x000000),
                    emissiveIntensity: isSelected ? 0.5 : 0
                });

                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(pos.x, pos.y, pos.z);
                this.scene.add(sphere);
                this.threeNodes.push(sphere);

                // Add word label as sprite
                if (levelIdx > 0 && levelIdx <= 4) {
                    const words = wordData[levels[levelIdx - 1]];
                    if (words && words[i]) {
                        const sprite = this.createTextSprite(
                            words[i].word,
                            isSelected ? colorHex : '#666',
                            isSelected
                        );
                        sprite.position.set(pos.x, pos.y + 20, pos.z);
                        this.scene.add(sprite);
                        this.threeNodes.push(sprite);
                    }
                }

                // Connect to previous level
                if (levelIdx > 0) {
                    const prevLevel = nodePositions[levelIdx - 1];

                    for (let j = 0; j < prevLevel.length; j++) {
                        const prevPos = prevLevel[j];
                        const isSelectedPath = (levelIdx === 1 && j === 0) ||
                            (wordIndices && j === 0 && i === wordIndices[levelIdx - 1]);

                        const lineColor = isSelectedPath ? color : new THREE.Color(0x333333);
                        const lineOpacity = isSelectedPath ? 0.8 : 0.2;

                        // Create curved line
                        const curve = new THREE.QuadraticBezierCurve3(
                            new THREE.Vector3(prevPos.x, prevPos.y, prevPos.z),
                            new THREE.Vector3(
                                (prevPos.x + pos.x) / 2,
                                (prevPos.y + pos.y) / 2 + (chaos ? (Math.random() - 0.5) * 50 : 0),
                                (prevPos.z + pos.z) / 2 + (chaos ? (Math.random() - 0.5) * 50 : 0)
                            ),
                            new THREE.Vector3(pos.x, pos.y, pos.z)
                        );

                        const points = curve.getPoints(20);
                        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                        const lineMaterial = new THREE.LineBasicMaterial({
                            color: lineColor,
                            transparent: true,
                            opacity: lineOpacity,
                            linewidth: isSelectedPath ? 2 : 1
                        });

                        const line = new THREE.Line(lineGeometry, lineMaterial);
                        this.scene.add(line);
                        this.threeLines.push(line);
                    }
                }
            }
        }

        // Add particles if enabled
        if (particles) {
            this.add3DParticles(colors);
        }

        // Start animation
        if (animated) {
            this.animate3D(chaos);
        }
    }

    // Rainbow 3D tree with spectacular visual effects
    async draw3DTreeRainbow(options) {
        const { branches, colors, wordIndices, animated, particles, chaos, rainbow, spiralEffect } = options;

        // Clear previous objects
        this.threeNodes.forEach(obj => this.scene.remove(obj));
        this.threeLines.forEach(obj => this.scene.remove(obj));
        this.threeNodes = [];
        this.threeLines = [];

        const wordData = this.getWordData();
        const levels = ['level1', 'level2', 'level3', 'level4'];

        // Generate node positions in 3D with spiral effect
        const nodePositions = [];
        const startX = -300;
        const stepX = 150;

        // Root node
        nodePositions.push([{ x: startX, y: 0, z: 0 }]);

        // Generate nodes for each level with spiral arrangement
        for (let level = 1; level <= 4; level++) {
            const levelNodes = [];
            const x = startX + stepX * level;
            const nodesAtLevel = Math.min(branches, 5);

            for (let i = 0; i < nodesAtLevel; i++) {
                // Spiral arrangement
                const spiralAngle = spiralEffect
                    ? (i / nodesAtLevel) * Math.PI * 2 + (level * Math.PI / 4)
                    : (i / nodesAtLevel) * Math.PI * 2;
                const radius = 60 + level * 20 + (chaos ? Math.random() * 30 : 0);
                const y = Math.sin(spiralAngle) * radius;
                const z = Math.cos(spiralAngle) * radius * 1.2;

                levelNodes.push({ x, y, z, angle: spiralAngle });
            }
            nodePositions.push(levelNodes);
        }

        // Create nodes and connections with rainbow colors
        for (let levelIdx = 0; levelIdx < nodePositions.length; levelIdx++) {
            const levelData = nodePositions[levelIdx];

            for (let i = 0; i < levelData.length; i++) {
                const pos = levelData[i];

                // Rainbow color cycling based on position
                const hue = rainbow
                    ? ((levelIdx * 60 + i * 40) % 360) / 360
                    : 0;
                const saturation = 0.9;
                const lightness = 0.6;
                const color = new THREE.Color().setHSL(hue, saturation, lightness);

                // Create node sphere
                const isSelected = levelIdx === 0 || (wordIndices && i === wordIndices[levelIdx - 1]);
                const size = isSelected ? 15 : 8;

                // Different geometries for variety
                let geometry;
                if (isSelected) {
                    geometry = new THREE.IcosahedronGeometry(size, 1);
                } else if (i % 3 === 0) {
                    geometry = new THREE.OctahedronGeometry(size, 0);
                } else if (i % 3 === 1) {
                    geometry = new THREE.TetrahedronGeometry(size, 0);
                } else {
                    geometry = new THREE.SphereGeometry(size, 16, 16);
                }

                const material = new THREE.MeshPhongMaterial({
                    color: color,
                    emissive: isSelected ? color : new THREE.Color(0x111111),
                    emissiveIntensity: isSelected ? 0.7 : 0.2,
                    shininess: 100,
                    transparent: true,
                    opacity: isSelected ? 1 : 0.8
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(pos.x, pos.y, pos.z);
                mesh.userData = { baseY: pos.y, baseZ: pos.z, hue: hue, isSelected };
                this.scene.add(mesh);
                this.threeNodes.push(mesh);

                // Add glow effect for selected nodes
                if (isSelected) {
                    const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16);
                    const glowMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0.3
                    });
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    glow.position.copy(mesh.position);
                    glow.userData = { isGlow: true, baseY: pos.y, baseZ: pos.z };
                    this.scene.add(glow);
                    this.threeNodes.push(glow);
                }

                // Add word label
                if (levelIdx > 0 && levelIdx <= 4) {
                    const words = wordData[levels[levelIdx - 1]];
                    if (words && words[i]) {
                        const colorHex = '#' + color.getHexString();
                        const sprite = this.createTextSprite(
                            words[i].word,
                            isSelected ? '#ffffff' : colorHex,
                            isSelected
                        );
                        sprite.position.set(pos.x, pos.y + 25, pos.z);
                        this.scene.add(sprite);
                        this.threeNodes.push(sprite);
                    }
                }

                // Connect to previous level with curved rainbow lines
                if (levelIdx > 0) {
                    const prevLevel = nodePositions[levelIdx - 1];

                    for (let j = 0; j < prevLevel.length; j++) {
                        const prevPos = prevLevel[j];
                        const isSelectedPath = (levelIdx === 1 && j === 0) ||
                            (wordIndices && j === 0 && i === wordIndices[levelIdx - 1]);

                        // Create curved line with multiple control points for wave effect
                        const curvePoints = [];
                        const segments = 30;

                        for (let t = 0; t <= 1; t += 1 / segments) {
                            const px = prevPos.x + (pos.x - prevPos.x) * t;
                            const py = prevPos.y + (pos.y - prevPos.y) * t;
                            const pz = prevPos.z + (pos.z - prevPos.z) * t;

                            // Add wave/spiral effect
                            const waveAmplitude = chaos ? 20 : 10;
                            const waveFreq = chaos ? 3 : 2;
                            const wave = Math.sin(t * Math.PI * waveFreq) * waveAmplitude * (1 - Math.abs(t - 0.5) * 2);

                            curvePoints.push(new THREE.Vector3(
                                px,
                                py + wave * (isSelectedPath ? 1.5 : 0.5),
                                pz + wave * 0.5 * (chaos ? Math.sin(t * Math.PI * 2) : 1)
                            ));
                        }

                        const curve = new THREE.CatmullRomCurve3(curvePoints);
                        const tubeGeometry = isSelectedPath
                            ? new THREE.TubeGeometry(curve, 32, isSelectedPath ? 2 : 0.5, 8, false)
                            : null;

                        if (isSelectedPath && tubeGeometry) {
                            // Rainbow gradient for selected path
                            const tubeMaterial = new THREE.MeshPhongMaterial({
                                color: color,
                                emissive: color,
                                emissiveIntensity: 0.5,
                                transparent: true,
                                opacity: 0.9
                            });
                            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                            tube.userData = { isTube: true, hue: hue };
                            this.scene.add(tube);
                            this.threeLines.push(tube);
                        } else {
                            // Simple line for non-selected paths
                            const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
                            const lineMaterial = new THREE.LineBasicMaterial({
                                color: new THREE.Color().setHSL((hue + 0.1) % 1, 0.5, 0.4),
                                transparent: true,
                                opacity: 0.3
                            });
                            const line = new THREE.Line(lineGeometry, lineMaterial);
                            this.scene.add(line);
                            this.threeLines.push(line);
                        }
                    }
                }
            }
        }

        // Add rainbow particles
        if (particles) {
            this.addRainbowParticles(300);
        }

        // Start rainbow animation
        if (animated) {
            this.animateRainbow3D(chaos);
        }
    }

    addRainbowParticles(count) {
        const particleCount = count;
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Distribute particles in a spherical pattern
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 150 + Math.random() * 300;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 50;
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Rainbow colors
            const hue = (i / particleCount + Math.random() * 0.1) % 1;
            const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
            particleColors[i * 3] = color.r;
            particleColors[i * 3 + 1] = color.g;
            particleColors[i * 3 + 2] = color.b;

            sizes[i] = 2 + Math.random() * 6;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData = { isParticles: true };
        this.scene.add(particles);
        this.threeNodes.push(particles);
    }

    animateRainbow3D(chaos = false) {
        if (!this.isRunning || !this.is3DMode) return;

        this.time += 0.015;

        // Animate nodes with color cycling and movement
        this.threeNodes.forEach((node, i) => {
            if (node.type === 'Mesh' && !node.userData.isGlow && !node.userData.isTube) {
                // Floating animation
                if (node.userData.baseY !== undefined) {
                    node.position.y = node.userData.baseY + Math.sin(this.time * 2 + i * 0.5) * 8;
                    node.position.z = node.userData.baseZ + Math.cos(this.time * 1.5 + i * 0.3) * 5;
                }

                // Rotation
                node.rotation.x += 0.02;
                node.rotation.y += 0.01;

                // Color cycling for selected nodes
                if (node.userData.isSelected && node.material) {
                    const newHue = (node.userData.hue + this.time * 0.05) % 1;
                    node.material.color.setHSL(newHue, 0.9, 0.6);
                    node.material.emissive.setHSL(newHue, 0.9, 0.4);
                }

                // Pulsing scale for selected nodes
                if (node.userData.isSelected) {
                    const pulse = 1 + Math.sin(this.time * 3) * 0.1;
                    node.scale.setScalar(pulse);
                }
            }

            // Glow animation
            if (node.userData && node.userData.isGlow) {
                if (node.userData.baseY !== undefined) {
                    node.position.y = node.userData.baseY + Math.sin(this.time * 2 + i * 0.5) * 8;
                    node.position.z = node.userData.baseZ + Math.cos(this.time * 1.5 + i * 0.3) * 5;
                }
                const glowPulse = 0.2 + Math.sin(this.time * 4) * 0.15;
                node.material.opacity = glowPulse;
                const glowScale = 1.3 + Math.sin(this.time * 3) * 0.2;
                node.scale.setScalar(glowScale);
            }

            // Particle animation
            if (node.userData && node.userData.isParticles) {
                node.rotation.y += 0.002;
                node.rotation.x += 0.001;
            }
        });

        // Animate tubes with color cycling
        this.threeLines.forEach((line, i) => {
            if (line.userData && line.userData.isTube && line.material) {
                const newHue = (line.userData.hue + this.time * 0.03) % 1;
                line.material.color.setHSL(newHue, 0.9, 0.6);
                line.material.emissive.setHSL(newHue, 0.9, 0.3);
            }
        });

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        this.animationFrame = requestAnimationFrame(() => this.animateRainbow3D(chaos));
    }

    createTextSprite(text, color, bold = false) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.font = bold ? 'bold 24px Fira Code' : '20px Fira Code';
        context.fillStyle = color;
        context.textAlign = 'center';
        context.fillText(text, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(100, 25, 1);

        return sprite;
    }

    add3DParticles(colors) {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            particleColors[i * 3] = color.r;
            particleColors[i * 3 + 1] = color.g;
            particleColors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const material = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.threeNodes.push(particles);
    }

    animate3D(chaos = false) {
        if (!this.isRunning || !this.is3DMode) return;

        this.time += 0.01;

        // Rotate nodes slightly
        this.threeNodes.forEach((node, i) => {
            if (node.type === 'Mesh') {
                const offset = chaos ? Math.sin(this.time * 2 + i) * 5 : 0;
                node.position.y += Math.sin(this.time + i * 0.5) * 0.3;
                if (chaos) {
                    node.position.z += Math.cos(this.time + i * 0.3) * 0.2;
                }
            }
        });

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        this.animationFrame = requestAnimationFrame(() => this.animate3D(chaos));
    }

    setTemperature(value, color) {
        this.currentTemp = value;

        const display = document.getElementById('temp-display');
        const fill = document.getElementById('temp-fill');

        display.textContent = value.toFixed(1);
        display.style.color = color;
        fill.style.width = `${value * 100}%`;
        fill.style.background = `linear-gradient(90deg, #333, ${color})`;

        // Update modal temp badge if open
        const badge = document.getElementById('modal-temp-badge');
        if (badge) {
            badge.textContent = `Temp: ${value.toFixed(1)}`;
        }

        // Update quick messages
        this.updateQuickMessages();
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
        const { branches, curviness, colors, lineWidth, nodeStyle, showWords, wordIndices, glow } = options;

        // Stop any previous animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const wordData = this.getWordData();

        // Calculate node positions
        const levels = this.generateLevels(branches, width, height);

        // Static draw with animation
        this.time = 0;

        const animate = () => {
            if (!this.isRunning || this.is3DMode) return;

            this.time += 0.02;
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
                time: this.time
            });

            if (glow) {
                this.animationFrame = requestAnimationFrame(animate);
            }
        };

        animate();
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
            const spreadY = Math.min(branches * 50, height - 100);
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
        const { curviness, colors, lineWidth, nodeStyle, showWords, wordIndices, wordData, glow, time } = options;
        const wordLevels = ['level1', 'level2', 'level3', 'level4'];

        // Draw "시작" label
        ctx.fillStyle = '#888';
        ctx.font = '14px Fira Code';
        ctx.fillText('시작', levels[0][0].x - 25, levels[0][0].y + 5);

        // Draw connections
        for (let levelIdx = 0; levelIdx < levels.length - 1; levelIdx++) {
            const currentLevel = levels[levelIdx];
            const nextLevel = levels[levelIdx + 1];

            for (let i = 0; i < currentLevel.length; i++) {
                const parent = currentLevel[i];

                for (let j = 0; j < nextLevel.length; j++) {
                    const child = nextLevel[j];
                    const isSelected = i === 0 && (wordIndices ? j === wordIndices[levelIdx] : j === 0);
                    const opacity = isSelected ? 1 : 0.25;

                    ctx.beginPath();
                    ctx.strokeStyle = this.adjustColorOpacity(colors[j % colors.length], opacity);
                    ctx.lineWidth = isSelected ? lineWidth : lineWidth * 0.5;

                    if (glow && isSelected) {
                        ctx.shadowColor = colors[j % colors.length];
                        ctx.shadowBlur = 15;
                    }

                    if (curviness === 0) {
                        ctx.moveTo(parent.x, parent.y);
                        ctx.lineTo(child.x, child.y);
                    } else {
                        const waveOffset = time ? Math.sin(time + j * 0.5) * (curviness * 0.15) : 0;
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

            // Draw nodes and words
            for (let j = 0; j < nextLevel.length; j++) {
                const node = nextLevel[j];
                const color = colors[j % colors.length];
                const isSelected = wordIndices && j === wordIndices[levelIdx];

                ctx.beginPath();
                ctx.fillStyle = isSelected ? color : this.adjustColorOpacity(color, 0.4);

                if (glow && isSelected) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 15;
                }

                const nodeSize = isSelected ? 10 : 5;
                this.drawNode(ctx, node.x, node.y, nodeStyle, nodeSize, time);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw word label
                if (showWords && levelIdx < 4) {
                    const words = wordData[wordLevels[levelIdx]];
                    if (words && words[j]) {
                        ctx.font = isSelected ? 'bold 12px Fira Code' : '10px Fira Code';
                        ctx.fillStyle = isSelected ? '#fff' : '#555';
                        ctx.fillText(words[j].word, node.x + 15, node.y - 5);

                        ctx.font = '9px Fira Code';
                        ctx.fillStyle = isSelected ? '#aaa' : '#444';
                        ctx.fillText(`${(words[j].prob * 100).toFixed(1)}%`, node.x + 15, node.y + 10);
                    }
                }
            }
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
            default:
                ctx.arc(x, y, size, 0, Math.PI * 2);
        }
    }

    adjustColorOpacity(color, opacity) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    }

    async generateSentence(indices, style) {
        const sentenceEl = document.getElementById('generated-sentence');
        const wordData = this.getWordData();
        const levels = ['level1', 'level2', 'level3', 'level4'];

        sentenceEl.innerHTML = '';

        let totalProb = 1;

        for (let i = 0; i < 4; i++) {
            const words = wordData[levels[i]];
            const idx = indices[i];
            const word = words[idx];

            totalProb *= word.prob;

            const span = document.createElement('span');
            span.textContent = word.word + ' ';

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
        const probEl = document.createElement('div');
        probEl.style.fontSize = '11px';
        probEl.style.color = '#666';
        probEl.style.marginTop = '10px';
        probEl.textContent = `확률: ${(totalProb * 100).toExponential(2)}%`;
        sentenceEl.appendChild(probEl);
    }

    stop() {
        this.isRunning = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Clean up Three.js
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.clear();
        }

        const elementsToRemove = ['prob-container', 'session2-styles'];
        elementsToRemove.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        this.is3DMode = false;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global session 2 manager
const session2Manager = new Session2Manager();
