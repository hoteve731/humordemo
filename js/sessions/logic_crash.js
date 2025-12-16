// SESSION 3: 논리 붕괴 (치명적인 폭소)
// "기계가 가장 무서워하는 금기를 건드려서 폭소를 만들어보겠습니다"

const logicCrashSession = {
    // 무한루프 중단 플래그
    loopRunning: false,
    loopResolve: null,

    // ===== 무한 루프 =====
    async runInfiniteLoop() {
        await terminal.typeSequence([
            { text: '무한 루프 코드 로딩...', type: 'dim' }
        ], 300);

        codeEditor.setFilename('infinite_loop.js');

        const code = `while(true) {
    print("ㅋ");
}`;

        await codeEditor.setCode(code);

        await terminal.typeSequence([
            { text: '코드 준비 완료.', type: 'success' },
            { text: '이건 "숨 넘어가기"입니다. 멈출 수가 없는 상태죠.', type: 'normal' },
            { text: 'kill() 명령어로 중단할 수 있습니다.', type: 'dim' }
        ], 400);

        await terminal.delay(500);

        terminal.log('실행 중...', 'system');

        // 실행 흐름 다이어그램 표시
        codeEditor.showLoopDiagram();

        // 무한 루프 실행 (사용자가 kill() 입력할 때까지)
        await this.runInfiniteLoopWithDiagram();

        // 강제 중단 메시지
        terminal.log('kill() - 강제 중단', 'error');
        audioSystem.playError();

        await terminal.typeSequence([
            '',
            { text: '배꼽 빠지게 구르는 겁니다.', type: 'normal' },
            { text: '(숨 못 쉴 정도로)', type: 'dim' }
        ], 400);
    },

    // 무한루프 중단 함수
    stopLoop() {
        if (this.loopRunning && this.loopResolve) {
            this.loopRunning = false;
            codeEditor.deselectAll();
            this.loopResolve();
            this.loopResolve = null;
        }
    },

    // 다이어그램과 함께 무한 루프 실행 (무한 - kill()로 중단)
    async runInfiniteLoopWithDiagram() {
        codeEditor.outputEl.classList.remove('hidden');
        codeEditor.outputEl.innerHTML = '<div class="lol-flood"></div>';
        const floodEl = codeEditor.outputEl.querySelector('.lol-flood');

        let count = 0;
        let currentLine = 1; // 1: while(true), 2: print("ㅋ")

        this.loopRunning = true;

        return new Promise(resolve => {
            this.loopResolve = resolve;

            const addLol = () => {
                // 중단 체크
                if (!this.loopRunning) {
                    return;
                }

                // 코드 라인 강조 (1번과 2번 교대)
                codeEditor.highlightExecuting(currentLine);
                currentLine = currentLine === 1 ? 2 : 1;

                // "ㅋ" 추가 (2번 라인일 때만)
                if (currentLine === 1) { // 방금 2번 라인을 실행했으므로
                    floodEl.textContent += 'ㅋ';
                    count++;

                    // 다이어그램 카운터 업데이트
                    codeEditor.updateLoopCounter();

                    // 사운드
                    if (count % 3 === 0) {
                        audioSystem.playLol();
                    }

                    // 스크롤
                    codeEditor.outputEl.scrollTop = codeEditor.outputEl.scrollHeight;
                }

                // 점점 빨라짐
                const delay = Math.max(30, 80 - Math.floor(count / 2));
                setTimeout(addLol, delay);
            };

            addLol();
        });
    },

    // ===== 데드락 =====
    async runDeadlock() {
        await terminal.typeSequence([
            { text: '데드락 시뮬레이션 로딩...', type: 'dim' }
        ], 300);

        codeEditor.setFilename('deadlock.js');

        const code = `// Process A
lock(resourceB);  // B를 기다림
lock(resourceA);

// Process B
lock(resourceA);  // A를 기다림
lock(resourceB);`;

        await codeEditor.setCode(code);

        await terminal.typeSequence([
            { text: '코드 준비 완료.', type: 'success' },
            { text: '이건 "눈치 게임"입니다.', type: 'normal' },
            { text: '서로 "네가 웃으면 나도 웃을게" 하고 버티는 거죠.', type: 'dim' }
        ], 400);

        await terminal.delay(500);

        terminal.log('실행 중...', 'system');

        await terminal.delay(800);

        // 다이어그램 표시
        codeEditor.showDeadlockDiagram();

        // 데드락 상태 메시지 (하이라이트 없이 - 교착상태이므로 아무것도 움직이지 않음)
        terminal.log(`Process A: resourceB 대기 중...`, 'dim');
        await terminal.delay(500);
        terminal.log(`Process B: resourceA 대기 중...`, 'dim');

        // 정적... (교착상태 - 코드 실행이 멈춤)
        await terminal.delay(3000);

        await terminal.typeSequence([
            '',
            { text: '...', type: 'dim' },
            '',
            { text: '저 정적.', type: 'normal' },
            { text: '속으로는 웃겨 죽겠는데 겉으로는 정색하는,', type: 'dim' },
            { text: '아주 고통스러운 상태입니다.', type: 'normal' }
        ], 600);
    },

    // 데드락 강조 애니메이션
    async animateDeadlockHighlight(iterations) {
        for (let i = 0; i < iterations; i++) {
            // Process A: lock(resourceB) 강조 (2번 라인)
            codeEditor.highlightExecuting(2);
            if (i === 0) terminal.log(`Process A: resourceB 대기 중...`, 'dim');
            await terminal.delay(350);

            // Process B: lock(resourceA) 강조 (6번 라인)
            codeEditor.highlightExecuting(6);
            if (i === 0) terminal.log(`Process B: resourceA 대기 중...`, 'dim');
            await terminal.delay(350);
        }
    },

    // ===== 0으로 나누기 (안전 버전) =====
    async runDivideSafe() {
        await terminal.typeSequence([
            { text: '안전한 나눗셈 코드 로딩...', type: 'dim' }
        ], 300);

        codeEditor.setFilename('joke.js');

        const code = `try {
    int joke = 1 / 0;
} catch {
    print("에러입니다");
}`;

        await codeEditor.setCode(code);

        // try-catch 흐름 다이어그램 표시
        codeEditor.showTryCatchDiagram();

        await terminal.typeSequence([
            { text: '코드 준비 완료.', type: 'success' },
            { text: 'try-catch로 감싸져 있습니다.', type: 'dim' },
            { text: '웃음을 꾹 참는 거죠.', type: 'normal' }
        ], 400);

        await terminal.delay(500);

        terminal.log('실행 중...', 'system');

        // 실행 흐름 강조: try -> 에러 발생 -> catch
        // Line 1: try {
        codeEditor.highlightExecuting(1);
        await terminal.delay(400);

        // Line 2: int joke = 1 / 0; (에러 발생!)
        codeEditor.highlightExecuting(2);
        await terminal.delay(600);

        // Line 3-4: catch -> print
        codeEditor.highlightExecuting(3);
        await terminal.delay(300);
        codeEditor.highlightExecuting(4);
        await terminal.delay(400);

        codeEditor.deselectAll();

        // 점잖은 에러 출력
        codeEditor.showOutput('Error: 계산 불가', true);

        await terminal.typeSequence([
            '',
            { text: '"에러입니다." 끝.', type: 'dim' },
            { text: '너무 점잖죠? 노잼입니다.', type: 'normal' },
            { text: '웃음이 나오려는데 입을 틀어막은 거예요.', type: 'dim' }
        ], 400);
    },

    // ===== 0으로 나누기 (위험 버전) - 블루스크린! =====
    async runDivideUnsafe() {
        await terminal.typeSequence([
            { text: '안전장치를 제거하겠습니다.', type: 'system' }
        ], 300);

        codeEditor.setFilename('joke.js');
        codeEditor.hideOutput();

        const safecode = `try {
    int joke = 1 / 0;
} catch {
    print("에러입니다");
}`;

        await codeEditor.setCode(safecode);

        // try-catch 다이어그램 (아직 안전한 상태)
        codeEditor.showTryCatchDiagram();

        await terminal.delay(800);

        await terminal.typeSequence([
            { text: '억지로 참는 건 건강에 해롭습니다.', type: 'normal' },
            { text: 'try-catch 구문 선택 중...', type: 'dim' }
        ], 400);

        // 라인 선택 애니메이션 (try-catch 부분)
        codeEditor.selectLines(1, 1);  // try {
        await terminal.delay(300);
        codeEditor.selectLines(3, 5);  // } catch { ... }

        await terminal.delay(800);

        terminal.log('Delete 키 입력...', 'dim');

        await terminal.delay(500);

        // 삭제 애니메이션
        await codeEditor.deleteLines(3, 5);  // catch 블록 삭제
        await terminal.delay(300);
        await codeEditor.deleteLines(1, 1);  // try 삭제

        await terminal.delay(500);

        // 남은 코드만 표시
        codeEditor.clear();
        const unsafeCode = `int joke = 1 / 0;`;
        await codeEditor.setCode(unsafeCode);

        // 크래시 다이어그램으로 전환 (안전장치 제거됨)
        codeEditor.showCrashDiagram();

        await terminal.typeSequence([
            { text: '안전장치 제거 완료.', type: 'success' },
            { text: '그냥 터뜨려.', type: 'normal' }
        ], 400);

        await terminal.delay(1000);

        terminal.log('Enter 키 입력...', 'system');
        audioSystem.playBlip();

        await terminal.delay(500);

        // 실행 전 코드 강조 (깜빡임 효과)
        codeEditor.highlightExecuting(1);
        await terminal.delay(300);

        // 블루스크린!
        terminal.log('실행!', 'error');

        await terminal.delay(200);

        // Mac 복구 화면 먼저 표시 (position:fixed로 최상위에 표시됨)
        endingSession.showMacRecovery();

        await terminal.delay(100);

        // main-container 전체를 숨기기 (남색 배경 방지)
        const mainContainer = document.getElementById('main-container');
        mainContainer.style.transition = 'opacity 0.3s';
        mainContainer.style.opacity = '0';

        // 여운 - Mac 복구 화면이 계속 표시됨
        // (호산이 퇴장할 때까지 유지)
    }
};
