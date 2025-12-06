// Phase System - Controls the flow of all 5 phases

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
        this.currentPhase = 1;

        await this.runPhase1();
    }

    // ==================== PHASE 1: Baseline ====================
    async runPhase1() {
        systemConsole.log('초기화 중...', 'system');
        await this.delay(500);

        // Create window in center
        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Window A'
        );
        await windowManager.animateAppear(win);

        // Position cursor at random start
        fakeCursor.setPosition(100, 100);

        // Get close button center
        const closeBtn = windowManager.getCloseButtonCenter(win);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);

        // Draw ghost path first
        fakeCursor.ghostStart = { x: fakeCursor.x, y: fakeCursor.y };
        fakeCursor.ghostEnd = { x: closeBtn.x, y: closeBtn.y };
        fakeCursor.showGhost = true;

        systemConsole.log('목표 감지: 닫기 버튼', 'normal');
        await this.delay(500);

        // Move cursor (straight line)
        fakeCursor.setTrailPhase('grey');
        await fakeCursor.moveToTarget(0.3);

        // Close window
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);

        fakeCursor.showGhost = false;
        systemConsole.log('Task Completed.', 'success');

        await this.delay(1000);

        // Proceed to Phase 2
        this.currentPhase = 2;
        await this.runPhase2();
    }

    // ==================== PHASE 2: Maze ====================
    async runPhase2() {
        systemConsole.log('새 창 생성...', 'system');
        fakeCursor.clearTrail();

        // Create new window
        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Window B'
        );
        await windowManager.animateAppear(win);

        const closeBtn = windowManager.getCloseButtonCenter(win);

        // Set cursor position
        fakeCursor.setPosition(100, window.innerHeight - 100);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);

        // Show ghost path
        fakeCursor.ghostStart = { x: fakeCursor.x, y: fakeCursor.y };
        fakeCursor.ghostEnd = { x: closeBtn.x, y: closeBtn.y };
        fakeCursor.showGhost = true;

        await this.delay(500);

        // Generate maze around target
        obstacleManager.generateMaze(closeBtn.x, closeBtn.y, 150);
        systemConsole.log('경로 차단됨. 경로 탐색 알고리즘 가동.', 'error');

        await this.delay(300);

        // Change trail to red
        fakeCursor.setTrailPhase('red');

        // Find path through maze
        const path = obstacleManager.findPath(
            fakeCursor.x, fakeCursor.y,
            closeBtn.x, closeBtn.y
        );

        audioSystem.playBass();

        // Follow path quickly
        await fakeCursor.followPath(path, 0.015);

        // Clear maze and close window
        obstacleManager.clearMaze();
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);

        fakeCursor.showGhost = false;
        systemConsole.log('장애물 통과 완료.', 'success');

        await this.delay(1000);

        // Proceed to Phase 3
        this.currentPhase = 3;
        await this.runPhase3();
    }

    // ==================== PHASE 3: Mini-games ====================
    async runPhase3() {
        systemConsole.log('불필요한 연산 감지...', 'system');
        fakeCursor.clearTrail();

        // Run 3 different obstacles
        await this.runMathObstacle();
        await this.delay(800);
        await this.runPuzzleObstacle();
        await this.delay(800);
        await this.runPhysicsObstacle();

        systemConsole.log('모든 장애물 처리 완료.', 'success');
        await this.delay(1000);

        // Proceed to Phase 4
        this.currentPhase = 4;
        await this.runPhase4();
    }

    async runMathObstacle() {
        systemConsole.log('수학 연산 요구됨...', 'normal');

        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Math.exe'
        );
        await windowManager.animateAppear(win);

        // Create math overlay
        obstacleManager.createMathOverlay(win);

        await this.delay(2000);

        // Solve and close
        await obstacleManager.solveMath();
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);
    }

    async runPuzzleObstacle() {
        systemConsole.log('창 조각 감지...', 'normal');

        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Puzzle.dll'
        );
        await windowManager.animateAppear(win);
        await this.delay(500);

        // Split into pieces
        win.visible = false;
        windowManager.splitIntoPuzzle(win, null);

        await this.delay(1000);

        // Reassemble
        await windowManager.animatePuzzleReassemble(win);
        win.visible = true;

        await this.delay(500);
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);
    }

    async runPhysicsObstacle() {
        systemConsole.log('물리 엔진 활성화...', 'normal');

        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            100,
            300, 200, 'Physics.sys'
        );
        await windowManager.animateAppear(win);

        // Add physics body
        obstacleManager.initPhysics();
        win.physicsBody = obstacleManager.addPhysicsBody(win.x, win.y, win.width, win.height);

        // Wait for physics simulation
        const updatePhysics = () => {
            if (win.physicsBody) {
                win.x = win.physicsBody.position.x - win.width / 2;
                win.y = win.physicsBody.position.y - win.height / 2;
                win.rotation = win.physicsBody.angle;
                windowManager.updateCloseButtonPosition(win);
            }
        };

        // Run physics for a few seconds
        for (let i = 0; i < 120; i++) {
            obstacleManager.updatePhysics();
            updatePhysics();
            await this.delay(16);
        }

        // Close
        await windowManager.animateClose(win);
        windowManager.removeWindow(win.id);
        obstacleManager.clearPhysics();
    }

    // ==================== PHASE 4: Rhythm ====================
    async runPhase4() {
        systemConsole.log('Execute 100_Steps_Combo', 'system');
        systemConsole.log('BPM: 130 - 리듬 시퀀스 시작', 'normal');

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
        }, 2000);
    }

    async rhythmMovement() {
        while (this.currentPhase === 4 && this.popupCount < this.maxPopups) {
            const targetX = Math.random() * (window.innerWidth - 100) + 50;
            const targetY = Math.random() * (window.innerHeight - 100) + 50;

            await fakeCursor.moveToTarget(0.3);
            fakeCursor.setTarget(targetX, targetY);
        }
    }

    async finishPhase4() {
        await this.delay(2000);
        audioSystem.stopTransport();

        systemConsole.log('리듬 시퀀스 완료.', 'success');

        this.currentPhase = 5;
        await this.runPhase5();
    }

    // ==================== PHASE 5: Climax ====================
    async runPhase5() {
        systemConsole.log('목표(창 닫기)는 잊었습니다.', 'system');
        systemConsole.log('과정(플레이)이 만족스럽습니다.', 'normal');
        systemConsole.log('Satisfaction: 100%', 'success');

        // Create floating windows
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (window.innerWidth - 200) + 50;
            const y = Math.random() * (window.innerHeight - 200) + 50;

            const win = windowManager.createWindow(x, y, 150, 100, 'Float_' + i);
            win.glowing = true;
            win.floating = true;
            win.floatSpeed = Math.random() * 0.02 + 0.01;

            await windowManager.animateAppear(win);
            await this.delay(200);
        }

        // Let them float for a while
        await this.delay(8000);

        // Fade out all
        systemConsole.log('시스템 종료...', 'system');

        const allWindows = [...windowManager.windows];
        await Promise.all(allWindows.map(win => windowManager.animateClose(win)));
        windowManager.clearAll();

        fakeCursor.clearTrail();
        fakeCursor.trailPersistent = false;

        await this.delay(1000);
        systemConsole.log('IMPROV 완료. 감사합니다.', 'success');

        this.isRunning = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global phase manager
const phaseManager = new PhaseManager();
