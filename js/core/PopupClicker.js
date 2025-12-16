// SESSION 1: Popup Clicker 시스템
// 팝업창 닫기 버튼 클릭 시뮬레이션 (미로 + 경로찾기)

class PopupClicker {
    constructor() {
        this.container = document.getElementById('popup-container');
        this.cursor = null;
        this.popup = null;
        this.closeBtn = null;
        this.trailCanvas = null;
        this.trailCtx = null;
        this.mazeCanvas = null;
        this.mazeCtx = null;

        // 커서 상태
        this.cursorPos = { x: 50, y: 300 };
        this.isMoving = false;
        this.hitWall = false;

        // 미로 설정
        this.gridSize = 12;
        this.cellSize = 0;
        this.walls = [];

        // 애니메이션 ID
        this.animationId = null;

        // 수학 문제 표시용
        this.mathEl = null;

        // 제논 모드 상태
        this.zenoRunning = false;
        this.zenoResolve = null;
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = '';

        const containerRect = this.container.getBoundingClientRect();
        this.cellSize = Math.floor(Math.min(containerRect.width, containerRect.height) / this.gridSize);

        // 미로 캔버스
        this.mazeCanvas = document.createElement('canvas');
        this.mazeCanvas.className = 'maze-canvas';
        this.mazeCanvas.width = containerRect.width;
        this.mazeCanvas.height = containerRect.height;
        this.container.appendChild(this.mazeCanvas);
        this.mazeCtx = this.mazeCanvas.getContext('2d');

        // 자취 캔버스
        this.trailCanvas = document.createElement('canvas');
        this.trailCanvas.className = 'trail-canvas';
        this.trailCanvas.width = containerRect.width;
        this.trailCanvas.height = containerRect.height;
        this.container.appendChild(this.trailCanvas);
        this.trailCtx = this.trailCanvas.getContext('2d');

        // 커서 생성
        this.cursor = document.createElement('div');
        this.cursor.className = 'fake-cursor';
        this.cursor.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.86a.5.5 0 0 0-.85.35Z"
                      fill="currentColor" stroke="#fff" stroke-width="1"/>
            </svg>
        `;
        this.container.appendChild(this.cursor);

        // 수학 문제 표시 엘리먼트
        this.mathEl = document.createElement('div');
        this.mathEl.className = 'math-problem hidden';
        this.container.appendChild(this.mathEl);

        // 커서 초기 위치
        this.setCursorPos(50, containerRect.height / 2);
    }

    // 커서 위치 설정
    setCursorPos(x, y) {
        this.cursorPos = { x, y };
        if (this.cursor) {
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';
        }
    }

    // CSS 변수에서 색상 가져오기
    getThemeColor(varName, fallback) {
        const style = getComputedStyle(document.body);
        return style.getPropertyValue(varName).trim() || fallback;
    }

    // 자취 그리기
    drawTrail(fromX, fromY, toX, toY) {
        if (!this.trailCtx) return;

        const isLight = document.body.getAttribute('data-theme') === 'light';
        this.trailCtx.strokeStyle = isLight ? 'rgba(0, 100, 60, 0.7)' : 'rgba(0, 255, 136, 0.6)';
        this.trailCtx.lineWidth = 3;
        this.trailCtx.lineCap = 'round';

        this.trailCtx.beginPath();
        this.trailCtx.moveTo(fromX, fromY);
        this.trailCtx.lineTo(toX, toY);
        this.trailCtx.stroke();
    }

    // 자취 지우기
    clearTrail() {
        if (this.trailCtx) {
            this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
        }
    }

    // 포인트로 이동 (자취 포함) - 단순 스텝 기반
    async moveToPoint(targetX, targetY, duration = 0.1) {
        const startX = this.cursorPos.x;
        const startY = this.cursorPos.y;
        const steps = Math.max(5, Math.floor(duration * 30)); // 대략 30fps
        const stepDelay = (duration * 1000) / steps;

        for (let i = 1; i <= steps; i++) {
            const progress = i / steps;
            // easeOutQuad
            const eased = 1 - (1 - progress) * (1 - progress);

            const newX = startX + (targetX - startX) * eased;
            const newY = startY + (targetY - startY) * eased;

            this.drawTrail(this.cursorPos.x, this.cursorPos.y, newX, newY);
            this.setCursorPos(newX, newY);

            await this.delay(stepDelay);
        }
    }

    // 미로 지우기
    clearMaze() {
        if (this.mazeCtx) {
            this.mazeCtx.clearRect(0, 0, this.mazeCanvas.width, this.mazeCanvas.height);
        }
        this.walls = [];
    }

    // 팝업 생성
    createPopup(title = '알림', message = '닫기 버튼을 클릭하세요', position = 'center') {
        if (this.popup) {
            this.popup.remove();
        }

        this.popup = document.createElement('div');
        this.popup.className = 'fake-popup';
        this.popup.innerHTML = `
            <div class="popup-header">
                <span class="popup-title">${title}</span>
                <button class="popup-close-btn">✕</button>
            </div>
            <div class="popup-body">
                <p>${message}</p>
            </div>
        `;

        this.container.appendChild(this.popup);
        this.closeBtn = this.popup.querySelector('.popup-close-btn');

        const containerRect = this.container.getBoundingClientRect();
        const popupRect = this.popup.getBoundingClientRect();

        let posX, posY;
        if (position === 'right') {
            posX = containerRect.width - popupRect.width - 50;
            posY = (containerRect.height - popupRect.height) / 2;
        } else {
            posX = (containerRect.width - popupRect.width) / 2;
            posY = (containerRect.height - popupRect.height) / 2;
        }

        this.popup.style.left = posX + 'px';
        this.popup.style.top = posY + 'px';

        return this.popup;
    }

    // X 버튼 위치 가져오기
    getCloseBtnPos() {
        if (!this.closeBtn || !this.popup) return { x: 0, y: 0 };

        const btnRect = this.closeBtn.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        return {
            x: btnRect.left - containerRect.left + btnRect.width / 2,
            y: btnRect.top - containerRect.top + btnRect.height / 2
        };
    }

    // ===== Baseline: 직선으로 천천히 이동 (자취 표시) =====
    async clickDirectWithTrail(duration = 0.8) {
        const target = this.getCloseBtnPos();
        const startX = this.cursorPos.x;
        const startY = this.cursorPos.y;

        this.clearTrail();

        return new Promise(resolve => {
            const startTime = Date.now();
            const totalDuration = duration * 1000;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / totalDuration, 1);

                // Easing
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                const prevX = this.cursorPos.x;
                const prevY = this.cursorPos.y;

                const newX = startX + (target.x - startX) * easeProgress;
                const newY = startY + (target.y - startY) * easeProgress;

                // 자취 그리기
                this.drawTrail(prevX, prevY, newX, newY);

                this.setCursorPos(newX, newY);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.performClick().then(resolve);
                }
            };

            animate();
        });
    }

    // ===== The Rub: 미로 생성 + 프리셋 경로 =====
    async clickThroughMaze() {
        const containerRect = this.container.getBoundingClientRect();
        const w = containerRect.width;
        const h = containerRect.height;

        // 고정된 미로 벽 생성
        this.generateFixedMaze();
        this.drawMaze();

        await this.delay(500);

        // 프리셋 경로 (비율 기반) - 벽을 피해 아래로 돌아가는 경로
        // 벽 위치: row 6 (y≈0.5)에 col 2-3, row 3 (y≈0.25)에 col 3-4
        const presetPath = [
            { x: 0.08, y: 0.5 },   // 시작
            { x: 0.10, y: 0.58 },  // 약간 아래로 피함
            { x: 0.15, y: 0.65 },  // 왼쪽 벽 아래로 우회
            { x: 0.25, y: 0.70 },
            { x: 0.35, y: 0.75 },
            { x: 0.42, y: 0.80 },  // 아래쪽으로
            { x: 0.50, y: 0.85 },  // 중앙 벽 아래 통과
            { x: 0.58, y: 0.80 },
            { x: 0.65, y: 0.75 },
            { x: 0.70, y: 0.65 },  // 위로 올라감
            { x: 0.75, y: 0.55 },
            { x: 0.80, y: 0.45 },
        ];

        // 경로 따라 이동
        this.clearTrail();

        for (let i = 0; i < presetPath.length; i++) {
            const point = presetPath[i];
            const targetX = point.x * w;
            const targetY = point.y * h;

            await this.moveToPoint(targetX, targetY, 0.12);
            audioSystem.playMove();
        }

        // X 버튼으로 최종 이동
        const closeBtn = this.getCloseBtnPos();
        await this.moveToPoint(closeBtn.x, closeBtn.y, 0.2);

        await this.performClick();
    }

    // 미로 통과 이동만 (미로가 이미 생성된 상태에서 호출)
    async navigateMaze() {
        const containerRect = this.container.getBoundingClientRect();
        const w = containerRect.width;
        const h = containerRect.height;

        // 프리셋 경로 (비율 기반) - 벽을 피해 아래로 돌아가는 경로
        const presetPath = [
            { x: 0.08, y: 0.5 },   // 시작
            { x: 0.10, y: 0.58 },  // 약간 아래로 피함
            { x: 0.15, y: 0.65 },  // 왼쪽 벽 아래로 우회
            { x: 0.25, y: 0.70 },
            { x: 0.35, y: 0.75 },
            { x: 0.42, y: 0.80 },  // 아래쪽으로
            { x: 0.50, y: 0.85 },  // 중앙 벽 아래 통과
            { x: 0.58, y: 0.80 },
            { x: 0.65, y: 0.75 },
            { x: 0.70, y: 0.65 },  // 위로 올라감
            { x: 0.75, y: 0.55 },
            { x: 0.80, y: 0.45 },
        ];

        // 경로 따라 이동
        this.clearTrail();

        for (let i = 0; i < presetPath.length; i++) {
            const point = presetPath[i];
            const targetX = point.x * w;
            const targetY = point.y * h;

            await this.moveToPoint(targetX, targetY, 0.12);
            audioSystem.playMove();
        }

        // X 버튼으로 최종 이동
        const closeBtn = this.getCloseBtnPos();
        await this.moveToPoint(closeBtn.x, closeBtn.y, 0.2);

        await this.performClick();
    }

    // 고정된 미로 생성
    generateFixedMaze() {
        this.walls = [];

        // 중앙 수직 벽 (아래쪽에 통로)
        const midCol = Math.floor(this.gridSize / 2);
        for (let row = 1; row < this.gridSize - 3; row++) {
            this.walls.push({ row, col: midCol });
        }

        // 왼쪽 영역 장애물
        this.walls.push({ row: 3, col: 3 });
        this.walls.push({ row: 3, col: 4 });
        this.walls.push({ row: 6, col: 2 });
        this.walls.push({ row: 6, col: 3 });
    }

    // 미로 그리기
    drawMaze() {
        if (!this.mazeCtx) return;

        const ctx = this.mazeCtx;
        ctx.clearRect(0, 0, this.mazeCanvas.width, this.mazeCanvas.height);

        const isLight = document.body.getAttribute('data-theme') === 'light';

        // 그리드 그리기 (희미하게)
        ctx.strokeStyle = isLight ? 'rgba(0, 100, 60, 0.15)' : 'rgba(0, 255, 136, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * this.cellSize;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, this.mazeCanvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(this.mazeCanvas.width, pos);
            ctx.stroke();
        }

        // 벽 그리기
        ctx.fillStyle = isLight ? 'rgba(200, 40, 80, 0.5)' : 'rgba(255, 51, 102, 0.6)';
        ctx.strokeStyle = isLight ? '#c02850' : '#ff3366';
        ctx.lineWidth = 2;

        for (const wall of this.walls) {
            const x = wall.col * this.cellSize;
            const y = wall.row * this.cellSize;

            ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
            ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        }
    }

    // A* 경로 찾기
    findPath(startCol, startRow, endCol, endRow) {
        const wallSet = new Set(this.walls.map(w => `${w.row},${w.col}`));
        const queue = [{ row: startRow, col: startCol, path: [] }];
        const visited = new Set();
        visited.add(`${startRow},${startCol}`);

        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: -1, dc: 0 }
        ];

        while (queue.length > 0) {
            const current = queue.shift();

            if (current.row === endRow && current.col === endCol) {
                return [...current.path, { row: endRow, col: endCol }];
            }

            for (const dir of directions) {
                const newRow = current.row + dir.dr;
                const newCol = current.col + dir.dc;
                const key = `${newRow},${newCol}`;

                if (newRow >= 0 && newRow < this.gridSize &&
                    newCol >= 0 && newCol < this.gridSize &&
                    !visited.has(key) && !wallSet.has(key)) {

                    visited.add(key);
                    queue.push({
                        row: newRow,
                        col: newCol,
                        path: [...current.path, { row: current.row, col: current.col }]
                    });
                }
            }
        }

        return null;
    }

    // 벽 충돌 체크 - 픽셀 좌표가 벽 안에 있는지 확인
    isCollidingWithWall(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        for (const wall of this.walls) {
            if (wall.row === row && wall.col === col) {
                return true;
            }
        }
        return false;
    }

    // 커서가 X 버튼 위에 있는지 확인
    isCursorOnCloseBtn() {
        if (!this.closeBtn) return false;

        const btnRect = this.closeBtn.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        // 버튼의 컨테이너 기준 좌표
        const btnLeft = btnRect.left - containerRect.left;
        const btnTop = btnRect.top - containerRect.top;
        const btnRight = btnLeft + btnRect.width;
        const btnBottom = btnTop + btnRect.height;

        // 커서 위치가 버튼 영역 안에 있는지 확인 (약간의 여유 포함)
        const margin = 5;
        return this.cursorPos.x >= btnLeft - margin &&
               this.cursorPos.x <= btnRight + margin &&
               this.cursorPos.y >= btnTop - margin &&
               this.cursorPos.y <= btnBottom + margin;
    }

    // ===== The Thinking: 수학 문제 풀면서 전진 (프리셋 경로) =====
    async clickWithMathProblems(steps = 5) {
        const containerRect = this.container.getBoundingClientRect();
        const w = containerRect.width;
        const h = containerRect.height;

        const problems = [
            { q: '2 + 2 = ?', a: '4' },
            { q: '7 × 8 = ?', a: '56' },
            { q: '√144 = ?', a: '12' },
            { q: '15 ÷ 3 = ?', a: '5' },
            { q: '∫2x dx = ?', a: 'x²+C' }
        ];

        // 프리셋 경로 (비율 기반) - 직선에 가깝게
        const presetPath = [
            { x: 0.20, y: 0.50 },
            { x: 0.35, y: 0.48 },
            { x: 0.50, y: 0.46 },
            { x: 0.65, y: 0.44 },
            { x: 0.78, y: 0.42 },
        ];

        this.clearTrail();

        for (let i = 0; i < steps; i++) {
            // 문제 표시
            const problem = problems[i % problems.length];
            await this.showMathProblem(problem.q, problem.a);

            // 프리셋 포인트로 이동
            const point = presetPath[i];
            const targetX = point.x * w;
            const targetY = point.y * h;

            await this.moveToPoint(targetX, targetY, 0.3);
            audioSystem.playMove();
        }

        // X 버튼으로 최종 이동
        const closeBtn = this.getCloseBtnPos();
        await this.moveToPoint(closeBtn.x, closeBtn.y, 0.25);

        await this.performClick();
    }

    // 수학 문제 표시
    async showMathProblem(question, answer) {
        this.mathEl.classList.remove('hidden');
        this.mathEl.style.left = (this.cursorPos.x + 30) + 'px';
        this.mathEl.style.top = (this.cursorPos.y - 20) + 'px';

        // 문제 표시
        this.mathEl.textContent = question;
        this.mathEl.classList.add('thinking');
        audioSystem.playThink();

        await this.delay(1500);

        // 정답 표시
        this.mathEl.textContent = answer;
        this.mathEl.classList.remove('thinking');
        this.mathEl.classList.add('solved');
        audioSystem.playBlip();

        await this.delay(500);

        this.mathEl.classList.add('hidden');
        this.mathEl.classList.remove('solved');
    }

    // ===== The Zeno: 멀리서 시작해서 점점 느려짐 (무한) =====
    async clickZeno() {
        const containerRect = this.container.getBoundingClientRect();

        // 멀리서 시작 (왼쪽 끝)
        this.setCursorPos(30, containerRect.height / 2);
        this.clearTrail();

        const target = this.getCloseBtnPos();
        this.zenoRunning = true;

        return new Promise(resolve => {
            this.zenoResolve = resolve;
            let lastX = this.cursorPos.x;
            let lastY = this.cursorPos.y;

            const moveStep = () => {
                // 중단 체크
                if (!this.zenoRunning) {
                    this.isMoving = false;
                    return;
                }

                const dx = target.x - this.cursorPos.x;
                const dy = target.y - this.cursorPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 자취 그리기
                this.drawTrail(lastX, lastY, this.cursorPos.x, this.cursorPos.y);
                lastX = this.cursorPos.x;
                lastY = this.cursorPos.y;

                if (distance < 5) {
                    // 미세 진동
                    this.cursorPos.x = target.x + (Math.random() - 0.5) * 6;
                    this.cursorPos.y = target.y + (Math.random() - 0.5) * 6;
                } else {
                    // 거리에 반비례하여 느려짐 (제논의 역설)
                    const speed = Math.max(0.3, distance * 0.008);
                    this.cursorPos.x += (dx / distance) * speed;
                    this.cursorPos.y += (dy / distance) * speed;
                }

                this.setCursorPos(this.cursorPos.x, this.cursorPos.y);

                if (Math.random() < 0.02) {
                    audioSystem.playMove();
                }

                this.animationId = requestAnimationFrame(moveStep);
            };

            this.isMoving = true;
            moveStep();
        });
    }

    // 제논 모드 중단
    stopZeno() {
        if (this.zenoRunning && this.zenoResolve) {
            this.zenoRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            this.zenoResolve();
            this.zenoResolve = null;
        }
    }

    // 클릭 수행
    async performClick() {
        this.cursor.classList.add('clicking');
        audioSystem.playBlip();

        await this.delay(100);

        if (this.popup) {
            gsap.to(this.popup, {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    this.popup.remove();
                    this.popup = null;
                }
            });
        }

        await this.delay(150);
        this.cursor.classList.remove('clicking');

        audioSystem.playSuccess();
        return true;
    }

    // 리셋
    reset() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.popup) {
            this.popup.remove();
            this.popup = null;
        }

        this.clearTrail();
        this.clearMaze();

        const containerRect = this.container?.getBoundingClientRect();
        if (containerRect) {
            this.setCursorPos(50, containerRect.height / 2);
        }

        this.isMoving = false;
        this.hitWall = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 전역 인스턴스
const popupClicker = new PopupClicker();
