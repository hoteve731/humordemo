// SESSION 2: 텍스트 예측 UI
// 언어유희를 위한 확률 기반 단어 선택
// 터미널 스타일 UI

class TextPredictor {
    constructor() {
        this.container = document.getElementById('predictor-container');
        this.promptEl = document.getElementById('predictor-prompt');
        this.listEl = document.getElementById('predictor-list');

        this.currentPrompt = '';
        this.predictions = [];
        this.selectedIndex = 0;
        this.isActive = false;
        this.onSelectCallback = null;

        this.boundKeyHandler = this.handleKeyDown.bind(this);
    }

    init() {
        this.clear();
        // 이전 showResult에서 적용된 opacity 리셋
        if (this.listEl) {
            gsap.set(this.listEl, { opacity: 1 });
        }
        document.addEventListener('keydown', this.boundKeyHandler);
    }

    destroy() {
        document.removeEventListener('keydown', this.boundKeyHandler);
        this.clear();
    }

    clear() {
        if (this.promptEl) this.promptEl.innerHTML = '';
        if (this.listEl) this.listEl.innerHTML = '';
        this.predictions = [];
        this.selectedIndex = 0;
        this.isActive = false;
    }

    // 프롬프트 텍스트 타이핑 효과
    async typePrompt(text, speed = 50) {
        this.currentPrompt = text;
        this.promptEl.innerHTML = '';

        for (let i = 0; i < text.length; i++) {
            this.promptEl.innerHTML = `<span class="prompt-symbol">&gt;</span> ${text.substring(0, i + 1)}<span class="cursor-blink">_</span>`;
            if (typeof audioSystem !== 'undefined' && audioSystem.initialized) {
                audioSystem.playKey();
            }
            await this.delay(speed);
        }
    }

    // 예측 단어 리스트 표시
    async showPredictions(predictions) {
        this.predictions = predictions;
        this.selectedIndex = 0;
        this.listEl.innerHTML = '';

        // 확률 순으로 정렬 (내림차순)
        const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
        this.predictions = sorted;

        // 헤더 추가
        const header = document.createElement('div');
        header.className = 'predictor-header';
        header.innerHTML = `
            <span class="header-label">PREDICTION</span>
            <span class="header-label">PROB</span>
        `;
        this.listEl.appendChild(header);

        for (let i = 0; i < sorted.length; i++) {
            const pred = sorted[i];
            const item = document.createElement('div');
            item.className = 'predictor-item';
            item.dataset.index = i;
            item.dataset.word = pred.word;

            // 터미널 스타일 확률 바
            const barLength = Math.max(1, Math.floor(pred.probability / 5));
            const bar = '█'.repeat(barLength) + '░'.repeat(Math.max(0, 20 - barLength));

            // 확률에 따라 적절한 소수점 자리수 결정
            let probStr;
            if (pred.probability >= 1) {
                probStr = pred.probability.toFixed(1);
            } else if (pred.probability >= 0.0001) {
                probStr = pred.probability.toFixed(4);
            } else {
                // 아주 작은 확률은 지수 표기 대신 직접 표시
                probStr = pred.probability.toFixed(7);
            }

            item.innerHTML = `
                <span class="predictor-index">[${i}]</span>
                <span class="predictor-word">${pred.word}</span>
                <span class="predictor-bar">${bar}</span>
                <span class="predictor-percent">${probStr}%</span>
            `;

            this.listEl.appendChild(item);

            // 순차적 등장 애니메이션
            await this.delay(30);
        }

        // 첫 번째 항목 선택
        this.updateSelection();
        this.isActive = true;
    }

    // 키보드 핸들러
    handleKeyDown(e) {
        if (!this.isActive) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.moveSelection(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.moveSelection(-1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            this.confirmSelection();
        }
    }

    // 선택 이동
    moveSelection(delta) {
        const newIndex = this.selectedIndex + delta;
        if (newIndex >= 0 && newIndex < this.predictions.length) {
            this.selectedIndex = newIndex;
            this.updateSelection();
            audioSystem.playSelect();

            // 스크롤 따라가기
            const items = this.listEl.querySelectorAll('.predictor-item');
            if (items[this.selectedIndex]) {
                items[this.selectedIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }

    // 인덱스로 선택
    selectByIndex(index) {
        this.selectedIndex = index;
        this.updateSelection();
    }

    // 선택 UI 업데이트
    updateSelection() {
        const items = this.listEl.querySelectorAll('.predictor-item');
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === this.selectedIndex);
        });
    }

    // 선택 확정
    confirmSelection() {
        if (this.predictions.length === 0) return;

        const selected = this.predictions[this.selectedIndex];
        this.isActive = false;

        audioSystem.playConfirm();

        if (this.onSelectCallback) {
            this.onSelectCallback(selected);
        }
    }

    // 결과 표시 (문장 완성 + 확률 크게 표시)
    async showResult(word, probability) {
        // 확률에 따라 적절한 소수점 자리수 결정
        let probStr;
        if (probability >= 1) {
            probStr = probability.toFixed(1);
        } else if (probability >= 0.0001) {
            probStr = probability.toFixed(4);
        } else {
            // 아주 작은 확률은 직접 표시
            probStr = probability.toFixed(7);
        }

        // 프롬프트 영역에 결과 표시
        this.promptEl.innerHTML = `
            <div class="result-display">
                <div class="result-sentence">
                    <span class="prompt-symbol">&gt;</span> ${this.currentPrompt} <span class="result-word">${word}</span>
                </div>
                <div class="result-probability persistent-prob">
                    <span class="prob-label">PROBABILITY:</span>
                    <span class="prob-value">${probStr}%</span>
                </div>
            </div>
        `;

        // 리스트 선명하게 유지 (모든 세션 동일)
        gsap.to(this.listEl, {
            opacity: 1,
            duration: 0.5
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 전역 인스턴스
const textPredictor = new TextPredictor();
