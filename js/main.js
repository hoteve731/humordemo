// DE-BUGGING Main Entry Point
// 공연용 인터랙티브 데모

// ===== 전역 상태 =====
let currentSession = null;

// ===== 커서 시스템 =====
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('custom-cursor');
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;

        if (this.cursor) {
            this.init();
        }
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
        });

        this.animate();
    }

    animate() {
        const ease = 0.15;
        this.x += (this.targetX - this.x) * ease;
        this.y += (this.targetY - this.y) * ease;

        this.cursor.style.left = this.x + 'px';
        this.cursor.style.top = this.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ===== 시각화 패널 관리 =====
const vizManager = {
    hideAll() {
        document.querySelectorAll('.viz-content').forEach(el => {
            el.classList.add('hidden');
        });
    },

    show(containerId) {
        this.hideAll();
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('hidden');
        }
    }
};

// ===== 명령어 등록 =====
function registerCommands() {
    // 기본 명령어
    terminal.registerCommand('help', () => {
        terminal.showHelp();
    }, '명령어 목록');

    // SESSION 1: 슬랩스틱
    terminal.registerCommand('start_session_1', async () => {
        currentSession = 'slapstick';
        await terminal.typeSequence([
            { text: 'SESSION 1: 슬랩스틱 시작', type: 'success' },
            { text: '비효율의 미학을 보여드리겠습니다.', type: 'dim' }
        ]);
        vizManager.show('popup-container');
        if (typeof popupClicker !== 'undefined') {
            popupClicker.init();
        }
    }, 'SESSION 1 시작');

    // Baseline: 셋업 → 실행 분리
    terminal.registerCommand('setup_baseline', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 start_session_1을 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.setupBaseline();
        }
    }, '최단거리 준비');

    terminal.registerCommand('run_baseline', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 setup_baseline을 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.executeBaseline();
        }
    }, '최단거리 실행');

    // Maze: 셋업 → 실행 분리
    terminal.registerCommand('setup_maze', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 start_session_1을 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.setupMaze();
        }
    }, '미로 준비');

    terminal.registerCommand('run_maze', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 setup_maze를 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.executeMaze();
        }
    }, '미로 탈출 실행');

    terminal.registerCommand('run_overthink', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 start_session_1을 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.runOverthink();
        }
    }, '과부하 (The Thinking)');

    // Zeno: 셋업 → 실행 분리
    terminal.registerCommand('setup_zeno', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 start_session_1을 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.setupZeno();
        }
    }, '제논 모드 준비');

    terminal.registerCommand('run_zeno', async () => {
        if (currentSession !== 'slapstick') {
            terminal.log('먼저 setup_zeno를 실행하세요.', 'error');
            return;
        }
        if (typeof slapstickSession !== 'undefined') {
            await slapstickSession.executeZeno();
        }
    }, '제논 모드 실행');

    // SESSION 2: 언어유희
    terminal.registerCommand('start_session_2', async () => {
        // 제논 모드 중단
        if (typeof slapstickSession !== 'undefined') {
            slapstickSession.stopZeno();
        }

        currentSession = 'wordplay';
        vizManager.hideAll();
        await terminal.typeSequence([
            { text: 'SESSION 2: 언어유희 시작', type: 'success' },
            { text: '확률 0%의 오답을 찾아보겠습니다.', type: 'dim' }
        ]);
        vizManager.show('predictor-container');
        if (typeof textPredictor !== 'undefined') {
            textPredictor.init();
        }
    }, 'SESSION 2 시작');

    terminal.registerCommand('predict', async (text) => {
        if (currentSession !== 'wordplay') {
            terminal.log('먼저 start_session_2()를 실행하세요.', 'error');
            return;
        }
        if (typeof wordplaySession !== 'undefined') {
            await wordplaySession.predict(text);
        }
    }, '텍스트 예측');

    // SESSION 3: 논리 붕괴
    terminal.registerCommand('start_session_3', async () => {
        // 광합성 에러 로그 중단
        if (typeof wordplaySession !== 'undefined') {
            wordplaySession.stopPhotosynthesisError();
        }

        currentSession = 'logic';
        vizManager.hideAll();
        await terminal.typeSequence([
            { text: 'SESSION 3: 논리 붕괴 시작', type: 'success' },
            { text: '기계의 금기를 건드려보겠습니다.', type: 'dim' }
        ]);
        vizManager.show('editor-container');
        if (typeof codeEditor !== 'undefined') {
            codeEditor.init();
        }
    }, 'SESSION 3 시작');

    terminal.registerCommand('run_infinite_loop', async () => {
        if (currentSession !== 'logic') {
            terminal.log('먼저 start_session_3()를 실행하세요.', 'error');
            return;
        }
        if (typeof logicCrashSession !== 'undefined') {
            await logicCrashSession.runInfiniteLoop();
        }
    }, '무한 루프');

    terminal.registerCommand('kill', () => {
        if (typeof logicCrashSession !== 'undefined' && logicCrashSession.loopRunning) {
            logicCrashSession.stopLoop();
        } else {
            terminal.log('중단할 프로세스가 없습니다.', 'dim');
        }
    }, '무한루프 강제 중단');

    terminal.registerCommand('run_deadlock', async () => {
        if (currentSession !== 'logic') {
            terminal.log('먼저 start_session_3()를 실행하세요.', 'error');
            return;
        }
        if (typeof logicCrashSession !== 'undefined') {
            await logicCrashSession.runDeadlock();
        }
    }, '데드락');

    terminal.registerCommand('run_divide_safe', async () => {
        if (currentSession !== 'logic') {
            terminal.log('먼저 start_session_3()를 실행하세요.', 'error');
            return;
        }
        if (typeof logicCrashSession !== 'undefined') {
            await logicCrashSession.runDivideSafe();
        }
    }, '0으로 나누기 (안전)');

    terminal.registerCommand('run_divide_unsafe', async () => {
        if (currentSession !== 'logic') {
            terminal.log('먼저 start_session_3()를 실행하세요.', 'error');
            return;
        }
        if (typeof logicCrashSession !== 'undefined') {
            await logicCrashSession.runDivideUnsafe();
        }
    }, '0으로 나누기 (위험!)');

    // 유틸리티
    terminal.registerCommand('clear', () => {
        terminal.clear();
        vizManager.hideAll();
        currentSession = null;
    }, '화면 초기화');
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', async () => {
    // 커서 초기화
    window.customCursor = new CustomCursor();

    // 오디오 초기화 (사용자 제스처 필요 - 클릭 또는 키보드)
    const initAudio = async () => {
        if (!audioSystem.initialized) {
            await audioSystem.init();
        }
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    // 명령어 등록
    registerCommands();

    // 시작 메시지
    await terminal.delay(500);
    await terminal.typeSequence([
        { text: 'DE-BUGGING Terminal v1.0', type: 'success' },
        { text: '"이건 고장 난 게 아닙니다. 아주 크게 웃고 있는 겁니다."', type: 'dim' },
        '',
        { text: 'help를 입력하면 명령어 목록을 볼 수 있습니다.', type: 'dim' }
    ], 400);
});

// 우클릭 방지
document.addEventListener('contextmenu', e => e.preventDefault());
