// SESSION 1: 슬랩스틱 (비효율의 미학)
// "굳이 안 해도 될 짓을 하는 것"
// 팝업창 닫기 버튼 클릭 시뮬레이션

const slapstickSession = {
    // ===== Baseline: 최단거리 (자취 남기면서 클릭) =====
    // 1단계: 팝업 소환
    async setupBaseline() {
        await terminal.typeSequence([
            { text: '팝업 닫기 시뮬레이션 시작...', type: 'dim' },
            { text: '목표: X 버튼 클릭', type: 'dim' }
        ], 300);

        popupClicker.init();
        popupClicker.createPopup('알림', '이 창을 닫으세요.');

        await terminal.delay(500);
        terminal.log('팝업 준비 완료. 다음 명령을 기다리는 중...', 'system');
    },

    // 2단계: 커서 이동 및 클릭
    async executeBaseline() {
        // 직선으로 이동 (자취 표시, 0.8초)
        terminal.log('실행: 직선 이동', 'system');
        await popupClicker.clickDirectWithTrail(0.8);

        await terminal.typeSequence([
            { text: 'Task Completed.', type: 'success' },
            { text: '효율성: 100%', type: 'dim' },
            { text: '소요시간: 0.8초', type: 'dim' },
            '',
            { text: '효율적이죠? 근데 재미는 없습니다.', type: 'normal' }
        ], 400);
    },

    // ===== The Rub: 미로 (벽을 피해 경로 찾기) =====
    // 1단계: 미로 및 팝업 소환
    async setupMaze() {
        await terminal.typeSequence([
            { text: '장애물 주입 프로토콜 시작...', type: 'system' },
            { text: '미로 생성 중...', type: 'dim' }
        ], 300);

        popupClicker.init();

        await terminal.delay(300);

        // 팝업을 오른쪽에 생성
        popupClicker.createPopup('알림', '이 창을 닫으세요.', 'right');

        // 미로 생성
        popupClicker.generateFixedMaze();
        popupClicker.drawMaze();

        await terminal.delay(500);
        terminal.log('미로 및 팝업 준비 완료. 다음 명령을 기다리는 중...', 'system');
    },

    // 2단계: 커서 이동 및 클릭
    async executeMaze() {
        terminal.log('실행: 미로 탈출', 'system');

        // 미로를 통과하여 이동 (미로는 이미 생성되어 있음)
        await popupClicker.navigateMaze();

        await terminal.typeSequence([
            { text: '미로 탈출 성공!', type: 'success' },
            { text: '효율성: 35%', type: 'dim' },
            { text: '우회 경로 사용', type: 'dim' },
            '',
            { text: '직선이면 바로 갈 수 있는 길을 빙빙 돌아갑니다.', type: 'normal' }
        ], 400);
    },

    // ===== The Thinking: 과부하 (수학 문제 풀면서 전진) =====
    async runOverthink() {
        await terminal.typeSequence([
            { text: '과부하 모듈 주입 중...', type: 'system' },
            { text: '한 칸 전진할 때마다 수학 문제를 풀어야 합니다.', type: 'dim' }
        ], 300);

        popupClicker.init();
        popupClicker.createPopup('확인', '정말 닫으시겠습니까?');

        await terminal.delay(500);

        terminal.log('실행: 과부하 클릭 모드', 'system');
        terminal.log('문제 풀기 시작...', 'normal');

        await popupClicker.clickWithMathProblems(5);

        await terminal.typeSequence([
            { text: '드디어 클릭!', type: 'success' },
            { text: '효율성: 15%', type: 'dim' },
            { text: '풀이한 문제: 5개', type: 'dim' },
            '',
            { text: '클릭 한 번에 적분까지 해야 하는 상황.', type: 'normal' },
            { text: '과하게 진지한 AI입니다.', type: 'dim' }
        ], 400);
    },

    // ===== The Zeno: 제논의 역설 (멀리서 점점 느려지며 접근) =====
    // 1단계: 셋업 (팝업 생성 및 커서 위치 설정)
    async setupZeno() {
        await terminal.typeSequence([
            { text: '제논의 역설 적용 중...', type: 'system' },
            { text: 'Speed = Distance × 0.008', type: 'dim' },
            { text: '목표에 가까워질수록 속도가 느려집니다.', type: 'dim' }
        ], 300);

        popupClicker.init();
        popupClicker.createPopup('마지막 경고', '이 창은 닫을 수 없습니다.');

        await terminal.delay(500);
        terminal.log('제논 모드 준비 완료. 다음 명령을 기다리는 중...', 'system');
    },

    // 제논 에러 무한 출력 중단 플래그
    zenoErrorRunning: false,

    // 2단계: 커서 이동 시작 (무한 - 세션3 시작 시 중단)
    async executeZeno() {
        terminal.log('실행: 제논 모드', 'system');

        // 제논 이동 시작 (백그라운드에서 무한 실행)
        popupClicker.clickZeno();

        // 중간에 로그 출력
        await terminal.delay(2000);
        terminal.log('절반 왔습니다...', 'dim');

        await terminal.delay(2000);
        terminal.log('거의 다 왔는데...', 'normal');

        await terminal.delay(3000);
        terminal.log('아직도 못 닿았네요.', 'dim');

        await terminal.delay(2000);
        terminal.log('영원히 못 닿습니다.', 'system');

        await terminal.delay(1000);

        // 에러 로그 무한 출력 시작
        this.zenoErrorRunning = true;
        this.runZenoErrorLoop();
    },

    // 제논 에러 로그 무한 출력
    async runZenoErrorLoop() {
        const errorMessages = [
            'ERROR: click() timeout exceeded',
            'WARN: distance approaching Planck length',
            'ERROR: position.x converging to limit',
            'FATAL: infinite loop detected in approach()',
            'ERROR: velocity underflow: 0.0000001px/s',
            'WARN: cursor stuck at 99.9999999%',
            'ERROR: cannot reach target: asymptotic limit',
            'CRITICAL: task completion impossible',
            'ERROR: Zeno paradox triggered',
            'WARN: mathematical impossibility detected',
            'ERROR: remaining distance: 0.00000001px',
            'FATAL: click event unreachable',
            'ERROR: time to completion: ∞',
            'WARN: CPU stuck calculating halves',
            'ERROR: progress halted at boundary',
        ];

        let index = 0;
        while (this.zenoErrorRunning) {
            terminal.log(errorMessages[index % errorMessages.length], 'error');
            audioSystem.playKey();
            index++;
            await terminal.delay(150 + Math.random() * 100);
        }
    },

    // 제논 모드 전체 중단
    stopZeno() {
        this.zenoErrorRunning = false;
        popupClicker.stopZeno();
    }
};
