// SESSION 3: 코드 에디터 UI
// 논리 붕괴를 위한 코드 편집기

class CodeEditor {
    constructor() {
        this.container = document.getElementById('editor-container');
        this.filenameEl = document.getElementById('editor-filename');
        this.contentEl = document.getElementById('editor-content');
        this.outputEl = document.getElementById('editor-output');
        this.runBtn = document.getElementById('editor-run-btn');
        this.diagramEl = document.getElementById('editor-diagram');
        this.diagramContent = document.getElementById('diagram-content');

        this.lines = [];
        this.currentCode = '';
        this.loopCounter = 0;
    }

    init() {
        this.clear();
        this.outputEl.classList.add('hidden');
        this.hideDiagram();
    }

    clear() {
        this.contentEl.innerHTML = '';
        this.outputEl.innerHTML = '';
        this.outputEl.classList.add('hidden');
        this.outputEl.classList.remove('error');
        this.lines = [];
    }

    setFilename(name) {
        this.filenameEl.textContent = name;
    }

    // 코드 설정 (구문 강조 포함)
    async setCode(code, animate = true) {
        this.currentCode = code;
        this.contentEl.innerHTML = '';
        const lines = code.split('\n');
        this.lines = [];

        for (let i = 0; i < lines.length; i++) {
            const lineEl = document.createElement('div');
            lineEl.className = 'code-line';
            lineEl.dataset.lineNumber = i + 1;

            const lineNum = document.createElement('span');
            lineNum.className = 'line-number';
            lineNum.textContent = i + 1;

            const lineContent = document.createElement('span');
            lineContent.className = 'line-content';
            lineContent.innerHTML = this.highlightSyntax(lines[i]);

            lineEl.appendChild(lineNum);
            lineEl.appendChild(lineContent);

            this.contentEl.appendChild(lineEl);
            this.lines.push(lineEl);

            if (animate) {
                await this.delay(100);
            }
        }
    }

    // 간단한 구문 강조
    highlightSyntax(line) {
        let result = line;

        // 키워드
        const keywords = ['while', 'true', 'false', 'if', 'else', 'try', 'catch', 'int', 'let', 'const', 'var', 'function', 'return'];
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'g');
            result = result.replace(regex, '<span class="keyword">$1</span>');
        });

        // 함수 호출
        result = result.replace(/(\w+)\(/g, '<span class="function">$1</span>(');

        // 문자열
        result = result.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        result = result.replace(/'([^']*)'/g, "<span class='string'>'$1'</span>");

        // 숫자
        result = result.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

        // 연산자
        result = result.replace(/([=+\-*/])/g, '<span class="operator">$1</span>');

        // 주석
        result = result.replace(/(\/\/.*)$/g, '<span class="comment">$1</span>');

        return result;
    }

    // 출력 표시
    showOutput(text, isError = false) {
        this.outputEl.classList.remove('hidden');
        this.outputEl.classList.toggle('error', isError);
        this.outputEl.innerHTML = text;
    }

    // 출력 숨기기
    hideOutput() {
        this.outputEl.classList.add('hidden');
    }

    // 무한 루프 "ㅋ" 출력
    async runInfiniteLoop(duration = 5) {
        this.outputEl.classList.remove('hidden');
        this.outputEl.innerHTML = '<div class="lol-flood"></div>';
        const floodEl = this.outputEl.querySelector('.lol-flood');

        const startTime = Date.now();
        let count = 0;

        return new Promise(resolve => {
            const addLol = () => {
                if (Date.now() - startTime > duration * 1000) {
                    resolve();
                    return;
                }

                // "ㅋ" 추가
                floodEl.textContent += 'ㅋ';
                count++;

                // 사운드
                if (count % 3 === 0) {
                    audioSystem.playLol();
                }

                // 스크롤
                this.outputEl.scrollTop = this.outputEl.scrollHeight;

                // 점점 빨라짐
                const delay = Math.max(20, 100 - count);
                setTimeout(addLol, delay);
            };

            addLol();
        });
    }

    // 데드락 시각화
    showDeadlock() {
        this.contentEl.innerHTML = `
            <div class="deadlock-viz">
                <div class="process-box">
                    <h3>Process A</h3>
                    <div class="status">Waiting for B...</div>
                </div>
                <div class="process-box">
                    <h3>Process B</h3>
                    <div class="status">Waiting for A...</div>
                </div>
            </div>
        `;
    }

    // 라인 선택 애니메이션
    selectLines(startLine, endLine) {
        for (let i = startLine - 1; i < endLine && i < this.lines.length; i++) {
            this.lines[i].classList.add('selected');
        }
    }

    // 선택 해제
    deselectAll() {
        this.lines.forEach(line => line.classList.remove('selected', 'executing'));
    }

    // 실행 중인 라인 강조 (깜빡임 효과)
    highlightExecuting(lineNum) {
        // 기존 강조 제거
        this.lines.forEach(line => line.classList.remove('executing'));

        // 해당 라인 강조
        if (lineNum >= 1 && lineNum <= this.lines.length) {
            this.lines[lineNum - 1].classList.add('executing');
        }
    }

    // 여러 라인 순차 강조 (무한루프용)
    async animateLoopExecution() {
        // 1번 라인 (while) 강조
        this.highlightExecuting(1);
        await this.delay(150);

        // 2번 라인 (print) 강조
        this.highlightExecuting(2);
        await this.delay(100);
    }

    // 라인 삭제 애니메이션
    async deleteLines(startLine, endLine) {
        // 먼저 선택
        this.selectLines(startLine, endLine);
        await this.delay(500);

        // 삭제 애니메이션
        for (let i = startLine - 1; i < endLine && i < this.lines.length; i++) {
            this.lines[i].classList.remove('selected');
            this.lines[i].classList.add('deleting');
        }

        await this.delay(600);

        // DOM에서 제거
        for (let i = endLine - 1; i >= startLine - 1; i--) {
            if (this.lines[i]) {
                this.lines[i].remove();
                this.lines.splice(i, 1);
            }
        }

        // 라인 번호 재정렬
        this.lines.forEach((line, idx) => {
            const numEl = line.querySelector('.line-number');
            if (numEl) numEl.textContent = idx + 1;
        });
    }

    // Mac 인터넷 복구 화면 표시
    showBlueScreen() {
        // endingSession의 Mac 복구 화면 사용
        if (typeof endingSession !== 'undefined') {
            endingSession.showMacRecovery();
        }
    }

    // ===== DIAGRAM METHODS =====

    // 다이어그램 표시
    showDiagram() {
        if (this.diagramEl) {
            this.diagramEl.classList.remove('hidden');
        }
    }

    // 다이어그램 숨기기
    hideDiagram() {
        if (this.diagramEl) {
            this.diagramEl.classList.add('hidden');
        }
        if (this.diagramContent) {
            this.diagramContent.innerHTML = '';
        }
    }

    // 무한 루프 다이어그램
    showLoopDiagram() {
        this.showDiagram();
        this.loopCounter = 0;
        this.diagramContent.innerHTML = `
            <div class="loop-diagram">
                <div class="loop-circle">
                    <svg class="loop-arrow-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="35"/>
                        <polygon class="arrow-head" points="85,50 75,45 75,55"/>
                    </svg>
                    <div class="loop-label" id="loop-output">ㅋ</div>
                </div>
                <div class="loop-counter">
                    <div>iteration: <span id="loop-count">0</span></div>
                    <div style="color: var(--accent-red); margin-top: 5px;">while(true) = NEVER ENDS</div>
                </div>
            </div>
        `;
    }

    // 루프 카운터 업데이트
    updateLoopCounter() {
        this.loopCounter++;
        const countEl = document.getElementById('loop-count');
        if (countEl) {
            countEl.textContent = this.loopCounter;
        }
    }

    // 데드락 다이어그램
    showDeadlockDiagram() {
        this.showDiagram();
        this.diagramContent.innerHTML = `
            <div class="deadlock-diagram">
                <div class="deadlock-process">
                    <div class="deadlock-box">Process A</div>
                    <div class="deadlock-status">lock(B) 대기중...</div>
                </div>
                <div class="deadlock-arrows">
                    <span>→ B 필요</span>
                    <span>← A 필요</span>
                </div>
                <div class="deadlock-process">
                    <div class="deadlock-box">Process B</div>
                    <div class="deadlock-status">lock(A) 대기중...</div>
                </div>
            </div>
        `;
    }

    // Try-Catch vs Crash 다이어그램
    showTryCatchDiagram() {
        this.showDiagram();
        this.diagramContent.innerHTML = `
            <div class="trycatch-diagram">
                <div class="flow-path safe">
                    <div class="path-label">WITH TRY-CATCH</div>
                    <div class="flow-node try">try { 1/0 }</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-node catch">catch → "에러"</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-node" style="background: rgba(0,255,136,0.2); border: 1px solid var(--accent-green); color: var(--accent-green);">계속 실행</div>
                </div>
                <div class="flow-path unsafe" style="opacity: 0.5;">
                    <div class="path-label">WITHOUT TRY-CATCH</div>
                    <div class="flow-node try">1/0</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-node crash">CRASH!</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-node" style="background: rgba(255,51,102,0.2); border: 1px solid var(--accent-red); color: var(--accent-red);">시스템 다운</div>
                </div>
            </div>
        `;
    }

    // Crash 다이어그램 (안전장치 제거 후)
    showCrashDiagram() {
        this.showDiagram();
        this.diagramContent.innerHTML = `
            <div class="trycatch-diagram">
                <div class="flow-path safe" style="opacity: 0.3;">
                    <div class="path-label">WITH TRY-CATCH</div>
                    <div class="flow-node try" style="text-decoration: line-through;">try { 1/0 }</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-node catch" style="text-decoration: line-through;">catch → "에러"</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-node" style="text-decoration: line-through; background: rgba(0,255,136,0.1); border: 1px solid var(--accent-green); color: var(--accent-green);">계속 실행</div>
                </div>
                <div class="flow-path unsafe">
                    <div class="path-label">CURRENT PATH</div>
                    <div class="flow-node try active">1/0</div>
                    <div class="flow-arrow active">↓</div>
                    <div class="flow-node crash">CRASH!</div>
                    <div class="flow-arrow active">↓</div>
                    <div class="flow-node" style="background: rgba(255,51,102,0.2); border: 1px solid var(--accent-red); color: var(--accent-red);">시스템 다운</div>
                </div>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 전역 인스턴스
const codeEditor = new CodeEditor();
