// Phase System - Controls the flow of all 5 phases with user command input

class PhaseManager {
    constructor() {
        this.currentPhase = 0;
        this.isRunning = false;
        this.beatScheduleId = null;
        this.popupCount = 0;
        this.maxPopups = 30;
    }

    async start() {
        this.isRunning = true;

        // Welcome messages
        await systemConsole.logSequence([
            { text: 'IMPROV System v2.0 초기화 완료', type: 'success' },
            { text: '인터랙티브 데모 모드 활성화', type: 'normal' },
            { text: '명령어를 입력하여 진행하세요.', type: 'dim' }
        ], 500);

        await this.delay(800);

        // Wait for user command to start Phase 1
        systemConsole.setExpectedCommand('close_window()', () => {
            this.runPhase1();
        });
    }

    // ==================== PHASE 1: Baseline ====================
    async runPhase1() {
        this.currentPhase = 1;

        await systemConsole.logSequence([
            { text: '명령 수신: close_window()', type: 'system' },
            { text: '창 인스턴스 생성 중...', type: 'dim' },
            { text: '목표 설정: 닫기 버튼 [X]', type: 'dim' },
            { text: '최적 경로 계산 중...', type: 'dim' }
        ], 400);

        await this.delay(600);

        // Create window in center
        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Window_A.exe'
        );
        await windowManager.animateAppear(win);

        await this.delay(400);

        await systemConsole.typeMessageAsync('직선 경로 확인. 예상 시간: 0.5초', 'dim');

        // Position cursor at random start
        fakeCursor.setPosition(100, 100);

        // Get close button center
        const closeBtn = windowManager.getCloseButtonCenter(win);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);

        // Draw ghost path first
        fakeCursor.ghostStart = { x: fakeCursor.x, y: fakeCursor.y };
        fakeCursor.ghostEnd = { x: closeBtn.x, y: closeBtn.y };
        fakeCursor.showGhost = true;

        await this.delay(800);

        // Move cursor (straight line) - slower
        fakeCursor.setTrailPhase('grey');
        await fakeCursor.moveToTarget(0.8);

        await this.delay(300);

        // Close window
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);

        fakeCursor.showGhost = false;

        await systemConsole.logSequence([
            { text: 'Task Completed.', type: 'success' },
            { text: '효율성: 100% | 소요시간: 0.8초', type: 'dim' }
        ], 400);

        await this.delay(1500);

        // Prompt for Phase 2
        await systemConsole.typeMessageAsync('다음 명령을 대기 중...', 'dim');
        await this.delay(500);

        // Multi-line commands for Phase 2
        systemConsole.setExpectedCommands([
            'spawn_window("B")',
            'inject_obstacles(maze)',
            'execute()'
        ], () => {
            this.runPhase2();
        });
    }

    // ==================== PHASE 2: Maze ====================
    async runPhase2() {
        this.currentPhase = 2;
        fakeCursor.clearTrail();

        await systemConsole.logSequence([
            { text: '명령 수신: spawn_window + inject_obstacles', type: 'system' },
            { text: '새 창 생성 중...', type: 'dim' },
        ], 400);

        // Create new window
        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Window_B.exe'
        );
        await windowManager.animateAppear(win);

        const closeBtn = windowManager.getCloseButtonCenter(win);

        // Set cursor position
        fakeCursor.setPosition(80, window.innerHeight - 100);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);

        // Show ghost path
        fakeCursor.ghostStart = { x: fakeCursor.x, y: fakeCursor.y };
        fakeCursor.ghostEnd = { x: closeBtn.x, y: closeBtn.y };
        fakeCursor.showGhost = true;

        await this.delay(600);

        // Detailed obstacle injection logs
        await systemConsole.logSequence([
            { text: '장애물 주입 프로토콜 시작...', type: 'normal' },
            { text: '├─ 미로 구조 생성 중...', type: 'dim' },
            { text: '├─ 벽 밀도: 높음', type: 'dim' },
            { text: '├─ 복잡도 레벨: 7/10', type: 'dim' },
            { text: '└─ 장애물 배치 완료', type: 'dim' },
        ], 350);

        // Generate more complex maze around target
        obstacleManager.generateComplexMaze(closeBtn.x, closeBtn.y, 200);

        await this.delay(400);

        await systemConsole.logSequence([
            { text: '경로 차단 감지!', type: 'error' },
            { text: '직선 경로 불가능...', type: 'dim' },
            { text: 'A* 경로 탐색 알고리즘 가동...', type: 'normal' },
            { text: '├─ 노드 분석 중...', type: 'dim' },
            { text: '├─ 최적 우회 경로 계산...', type: 'dim' },
            { text: '└─ 경로 확정. 예상 시간: 12초', type: 'dim' },
        ], 300);

        await this.delay(500);

        // Change trail to red
        fakeCursor.setTrailPhase('red');

        // Find path through maze - longer path
        const path = obstacleManager.findPath(
            fakeCursor.x, fakeCursor.y,
            closeBtn.x, closeBtn.y
        );

        audioSystem.playBass();

        await systemConsole.typeMessageAsync('경로 탐색 실행 중...', 'normal');

        // Follow path slowly - minimum 10+ seconds
        await fakeCursor.followPath(path, 0.04); // Much slower

        // Clear maze and close window
        obstacleManager.clearMaze();
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);

        fakeCursor.showGhost = false;

        await systemConsole.logSequence([
            { text: '장애물 통과 완료.', type: 'success' },
            { text: '효율성: 23% | 우회 거리: 847px', type: 'dim' }
        ], 400);

        await this.delay(1500);

        // Prompt for Phase 3
        await systemConsole.typeMessageAsync('추가 장애물 감지됨...', 'error');
        await this.delay(500);

        systemConsole.setExpectedCommands([
            'load_puzzle_module()',
            'assemble_fragments()',
            'execute()'
        ], () => {
            this.runPhase3();
        });
    }

    // ==================== PHASE 3: Interactive Puzzle ====================
    async runPhase3() {
        this.currentPhase = 3;
        fakeCursor.clearTrail();

        await systemConsole.logSequence([
            { text: '명령 수신: load_puzzle_module', type: 'system' },
            { text: '퍼즐 모듈 로딩 중...', type: 'dim' },
            { text: '창 조각화 프로토콜 활성화', type: 'dim' }
        ], 400);

        await this.runPuzzleObstacle();

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '퍼즐 조립 완료.', type: 'success' },
            { text: '창 복원율: 100%', type: 'dim' }
        ], 400);

        await this.delay(1000);

        // Math obstacle
        await systemConsole.typeMessageAsync('수학 연산 장벽 감지...', 'error');

        systemConsole.setExpectedCommands([
            'bypass_math_barrier()',
            'solve()'
        ], () => {
            this.runMathObstacle();
        });
    }

    async runPuzzleObstacle() {
        await systemConsole.logSequence([
            { text: '창 분해 시작...', type: 'normal' },
            { text: '├─ 조각 1/4 분리', type: 'dim' },
            { text: '├─ 조각 2/4 분리', type: 'dim' },
            { text: '├─ 조각 3/4 분리', type: 'dim' },
            { text: '└─ 조각 4/4 분리', type: 'dim' },
        ], 300);

        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Puzzle.dll'
        );
        await windowManager.animateAppear(win);
        await this.delay(500);

        // Split into numbered pieces
        win.visible = false;
        const pieces = windowManager.splitIntoPuzzleNumbered(win);

        await this.delay(500);

        await systemConsole.typeMessageAsync('조각을 순서대로 클릭하여 조립하세요 [1→2→3→4]', 'normal');

        // Cursor clicks pieces in order 1-4
        for (let i = 0; i < 4; i++) {
            const piece = pieces[i];
            const targetX = piece.x + piece.width / 2;
            const targetY = piece.y + piece.height / 2;

            fakeCursor.setTarget(targetX, targetY);
            await fakeCursor.moveToTarget(0.4);

            await this.delay(200);

            // Animate piece back to original position
            await new Promise(resolve => {
                gsap.to(piece, {
                    x: piece.origX,
                    y: piece.origY,
                    rotation: 0,
                    duration: 0.4,
                    ease: 'back.out(1.5)',
                    onComplete: () => {
                        audioSystem.playClap();
                        resolve();
                    }
                });
            });

            await systemConsole.typeMessageAsync(`조각 ${i + 1}/4 배치 완료`, 'dim');
            await this.delay(300);
        }

        win.pieces = null;
        win.visible = true;

        await this.delay(500);
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);
    }

    async runMathObstacle() {
        await systemConsole.logSequence([
            { text: '수학 연산 모듈 활성화', type: 'system' },
            { text: '매트릭스 디코딩 시작...', type: 'dim' }
        ], 400);

        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Math.exe'
        );
        await windowManager.animateAppear(win);

        // Create math overlay
        obstacleManager.createMathOverlay(win);

        await this.delay(3000);

        // Solve and close
        await obstacleManager.solveMath();
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);

        await systemConsole.logSequence([
            { text: '수학 장벽 해제 완료.', type: 'success' },
            { text: '연산 정확도: 100%', type: 'dim' }
        ], 400);

        await this.delay(1000);

        // Prompt for Phase 4
        await systemConsole.typeMessageAsync('리듬 시퀀스 대기 중...', 'normal');

        systemConsole.setExpectedCommands([
            'init_rhythm_engine(bpm=130)',
            'spawn_sequence(count=100)',
            'engage()'
        ], () => {
            this.runPhase4();
        });
    }

    // ==================== PHASE 4: Rhythm ====================
    async runPhase4() {
        this.currentPhase = 4;

        await systemConsole.logSequence([
            { text: 'Execute 100_Steps_Combo', type: 'system' },
            { text: '├─ 리듬 엔진 초기화...', type: 'dim' },
            { text: '├─ BPM: 130', type: 'dim' },
            { text: '├─ 시퀀스 카운트: 100', type: 'dim' },
            { text: '└─ 리듬 시퀀스 시작!', type: 'success' }
        ], 300);

        fakeCursor.clearTrail();
        fakeCursor.setTrailPhase('rainbow');
        fakeCursor.trailPersistent = true;
        fakeCursor.maxTrailLength = 2000;

        // Start audio transport
        audioSystem.startTransport();

        // Schedule popups on beat
        this.popupCount = 0;
        const obstacleTypes = ['math', 'puzzle', 'maze'];

        this.beatScheduleId = audioSystem.scheduleOnBeat((time) => {
            if (this.popupCount >= this.maxPopups) {
                audioSystem.clearSchedule(this.beatScheduleId);
                this.finishPhase4();
                return;
            }

            this.popupCount++;
            const type = obstacleTypes[this.popupCount % 3];
            this.spawnRhythmPopup(type);

            // Play corresponding sound
            switch (type) {
                case 'maze': audioSystem.playBass(); break;
                case 'puzzle': audioSystem.playSnare(); break;
                case 'math': audioSystem.playHihat(); break;
            }
        }, '4n');

        // Move cursor randomly
        this.rhythmMovement();
    }

    spawnRhythmPopup(type) {
        const x = Math.random() * (window.innerWidth - 200) + 50;
        const y = Math.random() * (window.innerHeight - 200) + 50;

        const win = windowManager.createWindow(x, y, 150, 100, type.toUpperCase());
        windowManager.animateAppear(win);

        // Auto-close after delay
        setTimeout(() => {
            if (windowManager.getWindow(win.id)) {
                windowManager.animateClose(win).then(() => {
                    windowManager.removeWindow(win.id);
                });
            }
        }, 2500);
    }

    async rhythmMovement() {
        while (this.currentPhase === 4 && this.popupCount < this.maxPopups) {
            const targetX = Math.random() * (window.innerWidth - 100) + 50;
            const targetY = Math.random() * (window.innerHeight - 100) + 50;

            fakeCursor.setTarget(targetX, targetY);
            await fakeCursor.moveToTarget(0.4);
            await this.delay(50);
        }
    }

    async finishPhase4() {
        await this.delay(2500);
        audioSystem.stopTransport();

        await systemConsole.logSequence([
            { text: '리듬 시퀀스 완료.', type: 'success' },
            { text: '비트 매칭 정확도: 98%', type: 'dim' }
        ], 400);

        this.currentPhase = 5;

        await this.delay(1000);

        // Prompt for Phase 5
        systemConsole.setExpectedCommand('transcend()', () => {
            this.runPhase5();
        });
    }

    // ==================== PHASE 5: Climax ====================
    async runPhase5() {
        await systemConsole.logSequence([
            { text: '초월 모드 활성화...', type: 'system' },
            { text: '목표(창 닫기)는 잊었습니다.', type: 'normal' },
            { text: '과정(플레이)이 만족스럽습니다.', type: 'normal' },
            { text: 'Satisfaction: 100%', type: 'success' }
        ], 500);

        // Create floating windows
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (window.innerWidth - 200) + 50;
            const y = Math.random() * (window.innerHeight - 200) + 50;

            const win = windowManager.createWindow(x, y, 150, 100, 'Float_' + i);
            win.glowing = true;
            win.floating = true;
            win.floatSpeed = Math.random() * 0.02 + 0.01;

            await windowManager.animateAppear(win);
            await this.delay(300);
        }

        // Let them float for a while
        await this.delay(10000);

        // Fade out all
        await systemConsole.typeMessageAsync('시스템 종료 중...', 'system');

        const allWindows = [...windowManager.windows];
        await Promise.all(allWindows.map(win => windowManager.animateClose(win)));
        windowManager.clearAll();

        fakeCursor.clearTrail();
        fakeCursor.trailPersistent = false;

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: 'IMPROV 완료.', type: 'success' },
            { text: '감사합니다.', type: 'normal' }
        ], 500);

        this.isRunning = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global phase manager
const phaseManager = new PhaseManager();
