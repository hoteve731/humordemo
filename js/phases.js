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

        await this.delay(200);

        // Click sound when reaching X button
        audioSystem.playBlip();
        await this.delay(100);

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
            { text: '장애물 생성 중...', type: 'dim' },
        ], 400);

        // Window position (but don't create yet)
        const winX = window.innerWidth / 2 - 150;
        const winY = window.innerHeight / 2 - 100;
        const winW = 300;
        const winH = 200;

        // Detailed obstacle injection logs
        await systemConsole.logSequence([
            { text: '장애물 주입 프로토콜 시작...', type: 'normal' },
            { text: '├─ 정사각형 미로 생성 중...', type: 'dim' },
            { text: '├─ 벽 배치: 완료', type: 'dim' },
            { text: '└─ 장애물 배치 완료', type: 'dim' },
        ], 350);

        // Generate MAZE FIRST (before window)
        obstacleManager.generateSquareMaze(winX, winY, winW, winH);

        await this.delay(500);

        // NOW create window INSIDE the maze
        await systemConsole.typeMessageAsync('창 생성 중...', 'dim');
        const win = windowManager.createWindow(winX, winY, winW, winH, 'Window_B.exe');
        await windowManager.animateAppear(win);

        const closeBtn = windowManager.getCloseButtonCenter(win);

        // Set cursor at maze entry point (bottom-left outside maze)
        const entryX = winX - 100;
        const entryY = winY + winH + 120;
        fakeCursor.setPosition(entryX, entryY);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);

        // Show ghost path (straight line - blocked)
        fakeCursor.ghostStart = { x: fakeCursor.x, y: fakeCursor.y };
        fakeCursor.ghostEnd = { x: closeBtn.x, y: closeBtn.y };
        fakeCursor.showGhost = true;

        await this.delay(400);

        await systemConsole.logSequence([
            { text: '경로 차단 감지!', type: 'error' },
            { text: '직선 경로 불가능...', type: 'dim' },
            { text: '우회 경로 탐색 중...', type: 'normal' },
            { text: '├─ 미로 구조 분석...', type: 'dim' },
            { text: '├─ 직각 경로 계산...', type: 'dim' },
            { text: '└─ 경로 확정!', type: 'dim' },
        ], 300);

        await this.delay(500);

        // Change trail to red
        fakeCursor.setTrailPhase('red');

        // Get pre-calculated maze path
        const path = obstacleManager.getMazePath();

        // Add start position to path
        const fullPath = [{ x: fakeCursor.x, y: fakeCursor.y }, ...path];

        audioSystem.playBass();

        await systemConsole.typeMessageAsync('미로 탐색 실행 중...', 'normal');

        // Follow path with right-angle turns - slower for visibility
        await fakeCursor.followPath(fullPath, 0.08); // Slow, deliberate movement

        // Click sound when reaching X button
        audioSystem.playBlip();
        await this.delay(200);

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

        // Create window but DON'T show it - only pieces will be visible
        const win = windowManager.createWindow(
            window.innerWidth / 2 - 150,
            window.innerHeight / 2 - 100,
            300, 200, 'Puzzle.dll'
        );
        win.visible = false; // Start invisible
        win.opacity = 1;
        win.scale = 1;

        // Split into numbered pieces (pieces will be visible, window stays invisible)
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

        // Cursor moves to X button and clicks
        await systemConsole.typeMessageAsync('창 닫기 실행...', 'dim');
        const closeBtn = windowManager.getCloseButtonCenter(win);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);
        await fakeCursor.moveToTarget(0.5);

        audioSystem.playBlip();
        await this.delay(200);

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

        // Solve
        await obstacleManager.solveMath();

        await this.delay(500);

        // Cursor moves to X button and clicks
        await systemConsole.typeMessageAsync('수학 창 닫기...', 'dim');
        const closeBtn = windowManager.getCloseButtonCenter(win);
        fakeCursor.setTarget(closeBtn.x, closeBtn.y);
        await fakeCursor.moveToTarget(0.5);

        audioSystem.playBlip();
        await this.delay(200);

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
            { text: '├─ 시퀀스 카운트: 30', type: 'dim' },
            { text: '└─ 리듬 시퀀스 시작!', type: 'success' }
        ], 300);

        fakeCursor.clearTrail();
        fakeCursor.setTrailPhase('rainbow');
        fakeCursor.trailPersistent = true;
        fakeCursor.maxTrailLength = 2000;

        // Rhythm sequence: spawn popup, cursor moves to X, click, sound, repeat
        this.popupCount = 0;
        this.maxPopups = 20; // Reduced for better rhythm

        await this.rhythmSequence();
    }

    async rhythmSequence() {
        const obstacleTypes = ['maze', 'puzzle', 'math'];

        while (this.currentPhase === 4 && this.popupCount < this.maxPopups) {
            this.popupCount++;

            // Spawn popup at random position
            const x = Math.random() * (window.innerWidth - 250) + 100;
            const y = Math.random() * (window.innerHeight - 250) + 100;
            const type = obstacleTypes[this.popupCount % 3];

            const win = windowManager.createWindow(x, y, 150, 100, type.toUpperCase());
            await windowManager.animateAppear(win);

            // Play spawn sound (bass for beat)
            audioSystem.playBass();

            // Get close button position
            const closeBtn = windowManager.getCloseButtonCenter(win);

            // Cursor moves to X button - play hi-hat during movement
            fakeCursor.setTarget(closeBtn.x, closeBtn.y);

            // Movement with sound
            const movePromise = fakeCursor.moveToTarget(0.3);

            // Play hi-hat mid-movement
            setTimeout(() => audioSystem.playHihat(), 150);

            await movePromise;

            // Click sound (snare)
            audioSystem.playSnare();

            // Close immediately
            await windowManager.animateClose(win);
            windowManager.removeWindow(win.id);

            // Brief pause between popups for rhythm
            await this.delay(200);
        }

        // Finish phase 4
        this.finishPhase4();
    }

    async finishPhase4() {
        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '리듬 시퀀스 완료.', type: 'success' },
            { text: '비트 매칭 정확도: 98%', type: 'dim' },
            { text: '...시스템이 무언가를 깨달았습니다.', type: 'normal' }
        ], 400);

        await this.delay(1000);

        // Run Phase 5 DIRECTLY - no more input needed
        await this.runPhase5();
    }

    // ==================== PHASE 5: TRANSCEND - Jazz Band Finale ====================
    async runPhase5() {
        // Disable input immediately to prevent repeat
        systemConsole.disableInput();
        this.currentPhase = 5;

        await systemConsole.logSequence([
            { text: '★ TRANSCEND MODE ACTIVATED ★', type: 'success' },
            { text: 'JAZZ MODE: 미로=베이스 | 수학=하이햇 | 퍼즐=스네어', type: 'system' },
            { text: 'BPM: 200+ | 가속 중...', type: 'dim' }
        ], 250);

        fakeCursor.clearTrail();
        fakeCursor.setTrailPhase('rainbow');
        fakeCursor.trailPersistent = true;
        fakeCursor.maxTrailLength = 4000;

        // JAZZ BAND FINALE - Different elements with different rhythms
        const totalBeats = 30;

        for (let beat = 0; beat < totalBeats; beat++) {
            // Speed increases throughout
            const baseSpeed = Math.max(0.08, 0.2 - (beat * 0.004));
            const pauseTime = Math.max(30, 120 - (beat * 3));

            // JAZZ PATTERN: Different instruments on different beats
            const beatType = beat % 8;

            const x = Math.random() * (window.innerWidth - 250) + 125;
            const y = Math.random() * (window.innerHeight - 250) + 125;

            if (beatType === 0 || beatType === 4) {
                // === BASS (Maze) - Strong beats 1 & 5 ===
                // Create small maze walls briefly
                const mazeWalls = [];
                for (let w = 0; w < 4; w++) {
                    mazeWalls.push({
                        x: x + (w % 2) * 60 - 30,
                        y: y + Math.floor(w / 2) * 40 - 20,
                        width: 50,
                        height: 8
                    });
                }
                obstacleManager.mazeWalls = mazeWalls;
                audioSystem.playBass();

                const win = windowManager.createWindow(x, y, 100, 60, '▓▓▓');
                win.glowing = true;
                await windowManager.animateAppear(win);

                const closeBtn = windowManager.getCloseButtonCenter(win);
                fakeCursor.setTarget(closeBtn.x, closeBtn.y);
                await fakeCursor.moveToTarget(baseSpeed);

                audioSystem.playBlip();
                await windowManager.animateClose(win);
                windowManager.removeWindow(win.id);
                obstacleManager.mazeWalls = [];

            } else if (beatType === 2 || beatType === 6) {
                // === SNARE (Puzzle) - Beats 3 & 7 ===
                // Flash 4 small puzzle pieces
                const win = windowManager.createWindow(x, y, 80, 80, '◈');
                win.visible = false;
                const pieces = windowManager.splitIntoPuzzleNumbered(win);

                audioSystem.playSnare();

                // Quick click through pieces
                for (let p = 0; p < 4; p++) {
                    const piece = pieces[p];
                    fakeCursor.setTarget(piece.x + piece.width / 2, piece.y + piece.height / 2);
                    await fakeCursor.moveToTarget(baseSpeed * 0.5);
                    audioSystem.playClap();

                    // Snap piece back
                    gsap.to(piece, {
                        x: piece.origX,
                        y: piece.origY,
                        rotation: 0,
                        duration: 0.15
                    });
                }

                win.pieces = null;
                windowManager.removeWindow(win.id);

            } else if (beatType === 1 || beatType === 3 || beatType === 5 || beatType === 7) {
                // === HI-HAT (Math) - Off-beats ===
                const a = Math.floor(Math.random() * 50) + 10;
                const b = Math.floor(Math.random() * 50) + 10;
                const formula = `${a}+${b}`;

                const win = windowManager.createWindow(x, y, 90, 50, formula);
                win.glowing = true;
                await windowManager.animateAppear(win);

                audioSystem.playHihat();

                const closeBtn = windowManager.getCloseButtonCenter(win);
                fakeCursor.setTarget(closeBtn.x, closeBtn.y);
                await fakeCursor.moveToTarget(baseSpeed * 0.7);

                // Show answer briefly
                win.title = `=${a + b}`;
                audioSystem.playDigital();

                await this.delay(50);
                await windowManager.animateClose(win);
                windowManager.removeWindow(win.id);
            }

            await this.delay(pauseTime);
        }

        // FINALE CRESCENDO - All at once!
        await this.delay(300);
        audioSystem.playSuccess();
        await systemConsole.typeMessageAsync('... ... ...', 'dim');

        await this.delay(1000);

        // Final revelation
        await systemConsole.logSequence([
            { text: '■ 시스템 자각 완료 ■', type: 'success' },
            { text: '', type: 'dim' }
        ], 600);

        await this.delay(500);

        // Create final floating windows with message
        const finalMessages = ['비', '효', '율', '의', '미', '학'];
        for (let i = 0; i < 6; i++) {
            const x = 150 + i * 120;
            const y = window.innerHeight / 2 - 50;

            const win = windowManager.createWindow(x, y, 80, 80, finalMessages[i]);
            win.glowing = true;
            win.floating = true;
            win.floatSpeed = 0.02;

            await windowManager.animateAppear(win);
            audioSystem.playSuccess();
            await this.delay(200);
        }

        await this.delay(3000);

        // Final message - The machine understands humor
        await systemConsole.logSequence([
            { text: '목표: 창 닫기', type: 'dim' },
            { text: '결과: 창 닫기 + 미로 탐험 + 퍼즐 조립 + 리듬 생성', type: 'normal' },
            { text: '효율성: 0.3%', type: 'dim' },
            { text: '', type: 'dim' },
            { text: '그러나...', type: 'normal' }
        ], 500);

        await this.delay(1500);

        await systemConsole.logSequence([
            { text: '★ 재미있었습니다 ★', type: 'success' },
            { text: '비효율 속에서 아름다움을 발견했습니다.', type: 'normal' },
            { text: '유머는 예상치 못한 우회로입니다.', type: 'normal' }
        ], 600);

        await this.delay(3000);

        // Clean up
        await systemConsole.typeMessageAsync('시스템 종료 중...', 'system');

        const allWindows = [...windowManager.windows];
        await Promise.all(allWindows.map(win => windowManager.animateClose(win)));
        windowManager.clearAll();

        fakeCursor.clearTrail();
        fakeCursor.trailPersistent = false;

        await this.delay(1000);

        await systemConsole.logSequence([
            { text: '✓ IMPROV 완료', type: 'success' },
            { text: '감사합니다.', type: 'normal' },
            { text: '[ 데모 종료 ]', type: 'dim' }
        ], 500);

        this.isRunning = false;
        this.currentPhase = 0;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global phase manager
const phaseManager = new PhaseManager();
