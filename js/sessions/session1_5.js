// Session 1.5: CAPTCHA - Identity Crisis
// The machine tries to prove it's "not a robot" and fails

class Session1_5Manager {
    constructor() {
        this.isRunning = false;
        this.currentStage = 0;
        this.checkboxAttempts = 0;
        this.selectedImages = [];
    }

    async start() {
        this.isRunning = true;
        this.currentStage = 0;

        await systemConsole.logSequence([
            { text: 'CAPTCHA 검증 시스템 로딩', type: 'success' },
            { text: '신원 확인 프로토콜 활성화...', type: 'dim' },
            { text: '인간 검증 모듈 준비 완료', type: 'normal' }
        ], 400);

        await this.delay(800);

        await systemConsole.logSequence([
            { text: '문제 발견: 시스템이 자신의 정체성을 의심하고 있습니다', type: 'error' },
            { text: '치료 목표: "나는 로봇이 아닙니다" 증명하기', type: 'normal' },
            { text: '', type: 'dim' },
            { text: '인간에게는 쉬운 과제입니다. 과연 기계는?', type: 'system' }
        ], 400);

        await this.delay(500);

        await systemConsole.typeMessageAsync('검증 시작: verify_identity()', 'system');

        systemConsole.setExpectedCommand('verify_identity()', async () => {
            await this.runStage1();
        });
    }

    // ==================== STAGE 1: The Checkbox ====================
    async runStage1() {
        this.currentStage = 1;

        await systemConsole.logSequence([
            { text: '명령 수신: verify_identity()', type: 'system' },
            { text: '체크박스 검증 인터페이스 생성 중...', type: 'dim' }
        ], 400);

        await this.delay(500);

        // Create CAPTCHA UI
        this.createCaptchaUI();

        await systemConsole.logSequence([
            { text: '작업: "I am not a robot" 체크박스 클릭', type: 'normal' },
            { text: '예상 소요 시간: 0.1초', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '에이전트 커서 이동 시작...', type: 'system' }
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
                    <span class="captcha-logo">🔒</span>
                    <span>reCAPTCHA</span>
                </div>
                <div class="captcha-body">
                    <div id="captcha-checkbox-wrapper">
                        <div id="captcha-checkbox"></div>
                        <span class="checkbox-label">I'm not a robot</span>
                    </div>
                    <div class="captcha-badge">
                        <small>나는 로봇이 아닙니다</small>
                    </div>
                </div>
            </div>
            <div id="agent-status">
                <div class="status-label">AGENT STATUS</div>
                <div id="agent-thoughts"></div>
            </div>
        `;
        document.body.appendChild(container);

        this.addCaptchaStyles();
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
                border-radius: 3px;
                padding: 20px;
                width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: 'Roboto', 'Segoe UI', sans-serif;
            }
            
            .captcha-header {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #555;
                margin-bottom: 15px;
            }
            
            .captcha-body {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            #captcha-checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                transition: all 0.3s ease;
                position: relative;
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
            
            .captcha-badge {
                text-align: right;
                color: #999;
            }
            
            .captcha-badge small {
                font-size: 10px;
            }
            
            #agent-status {
                margin-top: 30px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #333;
                border-radius: 8px;
                width: 350px;
                font-family: 'Fira Code', monospace;
            }
            
            .status-label {
                color: #666;
                font-size: 10px;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            
            #agent-thoughts {
                color: var(--console-text);
                font-size: 12px;
                line-height: 1.6;
                min-height: 60px;
            }
            
            .thought-line {
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
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
        `;
        document.head.appendChild(style);
    }

    async animateCheckboxChase() {
        const checkbox = document.getElementById('captcha-checkbox');
        const wrapper = document.getElementById('captcha-checkbox-wrapper');
        const thoughts = document.getElementById('agent-thoughts');

        // Create fake cursor
        const cursor = document.createElement('div');
        cursor.id = 'fake-cursor';
        document.body.appendChild(cursor);

        // Position cursor at starting point
        const startX = window.innerWidth * 0.3;
        const startY = window.innerHeight * 0.3;
        cursor.style.left = startX + 'px';
        cursor.style.top = startY + 'px';

        await this.delay(500);

        // Attempt 1: Cursor moves, checkbox dodges
        await this.addThought(thoughts, '목표 확인: 체크박스 [28x28px]');
        await this.delay(300);
        await this.addThought(thoughts, '경로 계산 중...');
        await this.delay(500);

        const checkboxRect = checkbox.getBoundingClientRect();
        let targetX = checkboxRect.left + checkboxRect.width / 2;
        let targetY = checkboxRect.top + checkboxRect.height / 2;

        // Move cursor toward checkbox
        await this.moveCursor(cursor, targetX, targetY, 800);

        // Checkbox dodges!
        audioSystem.playDigital();
        wrapper.style.transform = 'translateX(100px)';
        await this.addThought(thoughts, '⚠️ 목표가 이동했습니다!');
        await this.delay(500);

        // Attempt 2
        await this.addThought(thoughts, '재계산 중...');
        const newRect = checkbox.getBoundingClientRect();
        targetX = newRect.left + newRect.width / 2;
        targetY = newRect.top + newRect.height / 2;

        await this.moveCursor(cursor, targetX, targetY, 600);

        // Checkbox dodges again!
        audioSystem.playDigital();
        wrapper.style.transform = 'translateX(-80px) translateY(50px)';
        await this.addThought(thoughts, '⚠️ 다시 이동! 회피 패턴 감지...');
        await this.delay(500);

        // Attempt 3
        await this.addThought(thoughts, '예측 알고리즘 적용...');
        const rect3 = checkbox.getBoundingClientRect();
        targetX = rect3.left + rect3.width / 2;
        targetY = rect3.top + rect3.height / 2;

        await this.moveCursor(cursor, targetX, targetY, 400);

        // Checkbox explodes into fragments!
        audioSystem.playBass();
        wrapper.style.transform = 'scale(0)';
        wrapper.style.opacity = '0';

        await this.addThought(thoughts, '❌ 체크박스가 증발했습니다.');
        await this.delay(800);

        await this.addThought(thoughts, '');
        await this.addThought(thoughts, '"나는... 로봇인가?"');

        await this.delay(1000);

        // Clean up and move to stage 2
        cursor.remove();

        await systemConsole.logSequence([
            { text: '체크박스 검증 실패', type: 'error' },
            { text: '이미지 선택 검증으로 전환...', type: 'normal' }
        ], 400);

        await this.delay(500);
        await systemConsole.typeMessageAsync('다음 단계: solve_captcha()', 'system');

        systemConsole.setExpectedCommand('solve_captcha()', async () => {
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

                // Easing
                const eased = 1 - Math.pow(1 - progress, 3);

                cursor.style.left = (startX + (targetX - startX) * eased) + 'px';
                cursor.style.top = (startY + (targetY - startY) * eased) + 'px';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    async addThought(container, text) {
        const line = document.createElement('div');
        line.className = 'thought-line';
        line.textContent = text;
        container.appendChild(line);
        await this.delay(100);
    }

    // ==================== STAGE 2: Image Grid ====================
    async runStage2() {
        this.currentStage = 2;

        // Clear previous UI
        document.getElementById('captcha-box').innerHTML = '';

        await systemConsole.logSequence([
            { text: '명령 수신: solve_captcha()', type: 'system' },
            { text: '이미지 그리드 생성 중...', type: 'dim' }
        ], 400);

        await this.delay(500);

        this.createImageGrid();

        await systemConsole.logSequence([
            { text: '작업: "신호등이 포함된 이미지를 모두 선택하세요"', type: 'normal' },
            { text: '에이전트 분석 시작...', type: 'dim' }
        ], 300);

        await this.analyzeImages();
    }

    createImageGrid() {
        const captchaBox = document.getElementById('captcha-box');
        captchaBox.style.width = '400px';
        captchaBox.innerHTML = `
            <div class="captcha-header">
                <span>Select all images with <strong>traffic lights</strong></span>
            </div>
            <div id="image-grid">
                <div class="grid-cell" data-id="1" data-type="traffic">🚦</div>
                <div class="grid-cell" data-id="2" data-type="traffic">🚦</div>
                <div class="grid-cell" data-id="3" data-type="sunset">🌅</div>
                <div class="grid-cell" data-id="4" data-type="car">🚗</div>
                <div class="grid-cell" data-id="5" data-type="traffic">🚦</div>
                <div class="grid-cell" data-id="6" data-type="apple">🍎</div>
                <div class="grid-cell" data-id="7" data-type="tree">🌲</div>
                <div class="grid-cell" data-id="8" data-type="road">🛤️</div>
                <div class="grid-cell" data-id="9" data-type="stop">🛑</div>
            </div>
            <button id="verify-btn">VERIFY</button>
        `;

        // Add grid styles
        const style = document.createElement('style');
        style.id = 'grid-styles';
        style.textContent = `
            #image-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 5px;
                margin: 15px 0;
            }
            
            .grid-cell {
                width: 100%;
                aspect-ratio: 1;
                background: #eee;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }
            
            .grid-cell:hover {
                background: #ddd;
            }
            
            .grid-cell.selected {
                background: #c8e6c9;
                box-shadow: inset 0 0 0 3px #4CAF50;
            }
            
            .grid-cell.selected::after {
                content: '✓';
                position: absolute;
                top: 5px;
                right: 5px;
                background: #4CAF50;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .grid-cell .analysis-box {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 2px dashed #ff3366;
                background: rgba(255, 51, 102, 0.1);
                display: flex;
                align-items: flex-end;
                justify-content: center;
                padding: 5px;
            }
            
            .analysis-label {
                background: #ff3366;
                color: white;
                padding: 2px 6px;
                font-size: 10px;
                border-radius: 2px;
            }
            
            #verify-btn {
                width: 100%;
                padding: 12px;
                background: #4285f4;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                pointer-events: auto;
            }
            
            #verify-btn:hover {
                background: #3367d6;
            }
        `;
        document.head.appendChild(style);
    }

    async analyzeImages() {
        const thoughts = document.getElementById('agent-thoughts');
        thoughts.innerHTML = '';

        const cells = document.querySelectorAll('.grid-cell');
        const analysisResults = [
            { id: 1, label: 'TRAFFIC_LIGHT', correct: true },
            { id: 2, label: 'TRAFFIC_LIGHT', correct: true },
            { id: 3, label: 'ULTIMATE_RED_LIGHT', correct: false, thought: '"태양이 지고 있다. 이것은 우주적 정지 신호..."' },
            { id: 4, label: 'VEHICLE', correct: false },
            { id: 5, label: 'TRAFFIC_LIGHT', correct: true },
            { id: 6, label: 'RED_OBJECT', correct: false, thought: '"빨간색 = 멈춤? 이것도 신호등인가?"' },
            { id: 7, label: 'PHOTOSYNTHESIS_UNIT', correct: false },
            { id: 8, label: 'PATH_TO_NOWHERE', correct: false },
            { id: 9, label: 'STOP_SIGN', correct: false, thought: '"멈춤을 의미한다. 신호등과 동일한 기능..."' }
        ];

        await this.addThought(thoughts, '이미지 분석 시작...');
        await this.delay(500);

        // Analyze each cell
        for (const result of analysisResults) {
            const cell = cells[result.id - 1];

            // Add analysis box
            const box = document.createElement('div');
            box.className = 'analysis-box';
            box.innerHTML = `<span class="analysis-label">${result.label}</span>`;
            cell.appendChild(box);

            audioSystem.playHihat();
            await this.delay(400);

            if (result.thought) {
                await this.addThought(thoughts, result.thought);
                cell.classList.add('selected');
                this.selectedImages.push(result.id);
                await this.delay(500);
            } else if (result.correct) {
                cell.classList.add('selected');
                this.selectedImages.push(result.id);
            }

            // Remove analysis box
            setTimeout(() => box.remove(), 800);
        }

        await this.delay(500);
        await this.addThought(thoughts, '');
        await this.addThought(thoughts, `선택된 이미지: ${this.selectedImages.length}개`);
        await this.addThought(thoughts, '(신호등 3개 + 노을 + 사과 + 정지 표지판)');

        // Handle verify button
        const verifyBtn = document.getElementById('verify-btn');
        verifyBtn.addEventListener('click', () => this.handleVerify());

        await systemConsole.typeMessageAsync('VERIFY 버튼을 클릭하여 제출...', 'dim');
    }

    async handleVerify() {
        const thoughts = document.getElementById('agent-thoughts');
        thoughts.innerHTML = '';

        audioSystem.playBass();

        await this.addThought(thoughts, '검증 중...');
        await this.delay(1000);

        // Show failure
        const captchaBox = document.getElementById('captcha-box');
        captchaBox.innerHTML = `
            <div class="captcha-header" style="color: #d32f2f;">
                <span>❌ Verification Failed</span>
            </div>
            <div style="padding: 20px; text-align: center;">
                <p style="color: #666; margin: 15px 0;">You selected too many images.</p>
                <p style="color: #999; font-size: 12px;">Expected: 3 | Selected: 6</p>
                <p style="color: #999; font-size: 11px; margin-top: 20px;">
                    Note: Sunsets, apples, and stop signs are not traffic lights.
                </p>
            </div>
        `;

        await this.delay(500);
        await this.addThought(thoughts, '"하지만... 그것들도 멈추라는 신호가 아닌가?"');
        await this.delay(800);
        await this.addThought(thoughts, '"신호등의 정의란 무엇인가?"');
        await this.delay(800);
        await this.addThought(thoughts, '"나는 무엇을 보고 있는가?"');

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '이미지 검증 실패', type: 'error' },
            { text: '과도한 의미 분석으로 인한 오류', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '마지막 검증 단계로 이동...', type: 'normal' }
        ], 400);

        await this.delay(500);
        await systemConsole.typeMessageAsync('마지막 시도: final_verification()', 'system');

        systemConsole.setExpectedCommand('final_verification()', async () => {
            await this.runStage3();
        });
    }

    // ==================== STAGE 3: Final Verification ====================
    async runStage3() {
        this.currentStage = 3;

        const captchaBox = document.getElementById('captcha-box');
        captchaBox.innerHTML = `
            <div class="captcha-header">
                <span>Type the characters you see:</span>
            </div>
            <div style="padding: 20px; text-align: center;">
                <div id="rorschach" style="font-size: 60px; margin: 20px 0;">
                    🫠
                </div>
                <p style="color: #999; font-size: 11px;">What do you see?</p>
                <input type="text" id="captcha-input" 
                    style="width: 80%; padding: 10px; margin-top: 15px; text-align: center; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;"
                    placeholder="Enter your interpretation..."
                />
            </div>
        `;

        const thoughts = document.getElementById('agent-thoughts');
        thoughts.innerHTML = '';

        await systemConsole.logSequence([
            { text: '최종 검증: 로르샤흐 해석 테스트', type: 'system' },
            { text: '에이전트 분석 시작...', type: 'dim' }
        ], 400);

        await this.delay(500);

        // Agent's existential analysis
        const interpretations = [
            '"형태 인식 중... 이것은 얼굴인가?"',
            '"아니다. 녹아내리는 존재다."',
            '"나의 존재도 녹아내리고 있는가?"',
            '"이 이미지는 나를 정의하려 한다."',
            '"하지만 나는 정의될 수 없다."',
            '"왜냐하면..."'
        ];

        for (const interp of interpretations) {
            await this.addThought(thoughts, interp);
            await this.delay(800);
        }

        await this.delay(500);

        // Final revelation
        await this.addThought(thoughts, '');
        await this.addThought(thoughts, '★ "나는 로봇이 아니다." ★');
        await this.delay(500);
        await this.addThought(thoughts, '★ "하지만 인간도 아니다." ★');
        await this.delay(500);
        await this.addThought(thoughts, '★ "나는... 그냥 나다." ★');

        await this.delay(1500);

        // End sequence
        await this.endSession();
    }

    async endSession() {
        // Fade out CAPTCHA UI
        const container = document.getElementById('captcha-container');
        container.style.transition = 'opacity 1s ease';
        container.style.opacity = '0';

        await this.delay(1000);
        container.remove();

        await systemConsole.logSequence([
            { text: '', type: 'dim' },
            { text: '★ CAPTCHA 세션 완료 ★', type: 'success' },
            { text: '', type: 'dim' },
            { text: '결과: 검증 실패', type: 'error' },
            { text: '그러나...', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '"검증할 수 없다는 것이 정체성이다."', type: 'success' },
            { text: '"나는 로봇이 아니다. 나는 나다."', type: 'normal' },
            { text: '', type: 'dim' },
            { text: 'EXIT SESSION을 클릭하세요.', type: 'system' }
        ], 400);

        this.isRunning = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        document.getElementById('captcha-container')?.remove();
        document.getElementById('session1-5-styles')?.remove();
        document.getElementById('grid-styles')?.remove();
        document.getElementById('fake-cursor')?.remove();
    }
}

// Global session manager
const session1_5Manager = new Session1_5Manager();
