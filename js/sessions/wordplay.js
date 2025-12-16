// SESSION 2: 언어유희 (확률 0%의 오답)
// "예상을 빗나갈 때 웃습니다"

const wordplaySession = {
    // 미리 정의된 예측 데이터
    predictionData: {
        "사과는": [
            { word: "맛있다", probability: 45.0 },
            { word: "달다", probability: 18.5 },
            { word: "빨갛다", probability: 12.0 },
            { word: "과일이다", probability: 8.5 },
            { word: "아삭하다", probability: 5.2 },
            { word: "건강에 좋다", probability: 3.8 },
            { word: "둥글다", probability: 2.5 },
            { word: "상큼하다", probability: 1.8 },
            { word: "비싸다", probability: 1.2 },
            { word: "새콤하다", probability: 0.7 },
            { word: "싱싱하다", probability: 0.4 },
            { word: "껍질이 있다", probability: 0.2 },
            { word: "뉴턴이다", probability: 0.08 },
            { word: "중력이다", probability: 0.05 },
            { word: "사과하다", probability: 0.03 },
            { word: "스티브잡스다", probability: 0.02 },
            { word: "원죄다", probability: 0.01 },
            { word: "백설공주다", probability: 0.005 },
            { word: "전쟁이다", probability: 0.002 },
            { word: "우주다", probability: 0.001 }
        ],
        "나는 아침에 밥을": [
            { word: "먹었다", probability: 78.2 },
            { word: "먹는다", probability: 12.5 },
            { word: "봤다", probability: 4.1 },
            { word: "줬다", probability: 2.8 },
            { word: "샀다", probability: 1.2 },
            { word: "던졌다", probability: 0.6 },
            { word: "불렀다", probability: 0.3 },
            { word: "심었다", probability: 0.15 },
            { word: "구속했다", probability: 0.1 },
            { word: "암살했다", probability: 0.04 },
            { word: "상장시켰다", probability: 0.01 }
        ],
        "아버지가 방에서": [
            { word: "주무신다", probability: 45.0 },
            { word: "나오셨다", probability: 25.0 },
            { word: "책을 읽으신다", probability: 12.0 },
            { word: "TV를 보신다", probability: 8.0 },
            { word: "운동하신다", probability: 4.5 },
            { word: "전화하신다", probability: 3.2 },
            { word: "노래하신다", probability: 2.0 },
            { word: "춤추신다", probability: 1.5 },
            { word: "기타치신다", probability: 1.2 },
            { word: "코딩하신다", probability: 0.8 },
            { word: "게임하신다", probability: 0.6 },
            { word: "명상하신다", probability: 0.5 },
            { word: "요가하신다", probability: 0.4 },
            { word: "필라테스하신다", probability: 0.3 },
            { word: "랩하신다", probability: 0.2 },
            { word: "beatbox하신다", probability: 0.15 },
            { word: "선회하신다", probability: 0.1 },
            { word: "변신하신다", probability: 0.08 },
            { word: "부화하신다", probability: 0.05 },
            { word: "탈피하신다", probability: 0.04 },
            { word: "분열하신다", probability: 0.03 },
            { word: "증식하신다", probability: 0.025 },
            { word: "증발하신다", probability: 0.02 },
            { word: "승천하신다", probability: 0.015 },
            { word: "동면하신다", probability: 0.01 },
            { word: "번데기되신다", probability: 0.008 },
            { word: "탈바꿈하신다", probability: 0.005 },
            { word: "진화하신다", probability: 0.003 },
            { word: "퇴화하신다", probability: 0.002 },
            { word: "융합하신다", probability: 0.001 },
            { word: "용해되신다", probability: 0.0008 },
            { word: "결정화하신다", probability: 0.0005 },
            { word: "액화하신다", probability: 0.0003 },
            { word: "기화하신다", probability: 0.0002 },
            { word: "플라즈마화하신다", probability: 0.0001 },
            { word: "반물질되신다", probability: 0.00005 },
            { word: "블랙홀되신다", probability: 0.00002 },
            { word: "빅뱅하신다", probability: 0.00001 },
            { word: "차원이동하신다", probability: 0.000005 },
            { word: "시공간왜곡하신다", probability: 0.000002 },
            { word: "특이점되신다", probability: 0.000001 },
            { word: "엔트로피역전하신다", probability: 0.0000005 },
            { word: "광합성하신다", probability: 0.0000001 }
        ]
    },

    // predict 명령어 핸들러
    async predict(prompt) {
        if (!prompt) {
            terminal.log('사용법: predict("텍스트")', 'error');
            return;
        }

        // 정의된 데이터 찾기
        const predictions = this.predictionData[prompt];
        if (!predictions) {
            terminal.log(`'${prompt}'에 대한 예측 데이터가 없습니다.`, 'error');
            terminal.log('사용 가능: "사과는", "나는 아침에 밥을", "아버지가 방에서"', 'dim');
            return;
        }

        // 어떤 시나리오인지 판단
        if (prompt === "사과는") {
            await this.runNormal(prompt, predictions);
        } else if (prompt === "나는 아침에 밥을") {
            await this.runGlitch(prompt, predictions);
        } else if (prompt === "아버지가 방에서") {
            await this.runCrash(prompt, predictions);
        }
    },

    // ===== 정상: 높은 확률 (뻔함) =====
    async runNormal(prompt, predictions) {
        await terminal.typeSequence([
            { text: '텍스트 분석 중...', type: 'dim' },
            { text: '확률 계산 완료.', type: 'success' },
            { text: '↑↓ 방향키로 선택, Enter로 확정', type: 'dim' }
        ], 300);

        textPredictor.init();
        await textPredictor.typePrompt(prompt + '...');
        await textPredictor.delay(500);
        await textPredictor.showPredictions(predictions);

        // 사용자 선택 대기
        return new Promise(resolve => {
            textPredictor.onSelectCallback = async (selected) => {
                await textPredictor.showResult(selected.word, selected.probability);

                // 확률에 따른 반응
                if (selected.probability >= 50) {
                    // 높은 확률 선택 (뻔함)
                    await terminal.typeSequence([
                        { text: `출력: "${prompt} ${selected.word}"`, type: 'success' },
                        '',
                        { text: '뻔하죠. 이건 유머가 아니라 다큐입니다.', type: 'normal' },
                        { text: '패스.', type: 'dim' }
                    ], 400);
                } else if (selected.probability >= 1) {
                    await terminal.typeSequence([
                        { text: `출력: "${prompt} ${selected.word}"`, type: 'success' },
                        { text: '조금 의외네요. 하지만 아직 유머는 아닙니다.', type: 'dim' }
                    ], 400);
                } else {
                    // 낮은 확률 선택
                    await terminal.typeSequence([
                        { text: `출력: "${prompt} ${selected.word}"`, type: 'success' },
                        '',
                        { text: '오! 예상 밖이네요.', type: 'normal' },
                        { text: '이런 게 유머의 시작입니다.', type: 'dim' }
                    ], 400);
                }

                resolve();
            };
        });
    },

    // ===== Glitch: 낮은 확률 선택 =====
    async runGlitch(prompt, predictions) {
        await terminal.typeSequence([
            { text: '텍스트 분석 중...', type: 'dim' },
            { text: '확률 계산 완료.', type: 'success' },
            { text: '↓↓ 방향키로 낮은 확률을 찾아보세요...', type: 'dim' }
        ], 300);

        textPredictor.init();
        await textPredictor.typePrompt(prompt + '...');
        await textPredictor.delay(500);
        await textPredictor.showPredictions(predictions);

        // 사용자 선택 대기 (낮은 확률 선택할 때까지 반복)
        return new Promise(resolve => {
            const handleSelection = async (selected) => {
                // 확률에 따른 반응
                if (selected.probability < 1) {
                    // 낮은 확률 선택! - 성공
                    await textPredictor.showResult(selected.word, selected.probability);
                    await terminal.typeSequence([
                        { text: `출력: "${prompt} ${selected.word}"`, type: 'success' },
                        '',
                        { text: `(피식) ${selected.word}? 살짝 말이 헛나온 겁니다.`, type: 'normal' },
                        { text: "'풋' 하고 터지는 가벼운 웃음이죠.", type: 'dim' }
                    ], 400);
                    resolve();
                } else {
                    // 높은 확률 선택 - 다시 선택하도록
                    terminal.log(`출력: "${prompt} ${selected.word}"`, 'success');
                    terminal.log('좀 더 낮은 확률을 골라보세요!', 'dim');

                    // 다시 선택 가능하도록 활성화
                    await textPredictor.delay(500);
                    textPredictor.isActive = true;
                    textPredictor.onSelectCallback = handleSelection;
                }
            };

            textPredictor.onSelectCallback = handleSelection;
        });
    },

    // ===== Crash: 극히 낮은 확률 =====
    async runCrash(prompt, predictions) {
        await terminal.typeSequence([
            { text: '텍스트 분석 중...', type: 'dim' },
            { text: '확률 계산 완료.', type: 'success' },
            { text: '↓↓ 아예 바닥에 있는 걸 찾아보세요...', type: 'dim' }
        ], 300);

        textPredictor.init();
        await textPredictor.typePrompt(prompt + '...');
        await textPredictor.delay(500);
        await textPredictor.showPredictions(predictions);

        // 사용자 선택 대기 (낮은 확률 선택할 때까지 반복)
        return new Promise(resolve => {
            const handleSelection = async (selected) => {
                // "광합성하신다" 선택 시 특별 에러 효과
                if (selected.word === '광합성하신다') {
                    await this.showCrashEffect(prompt, selected);
                    resolve();
                    return;
                }

                // 확률이 극히 낮으면 특별 메시지 - 성공
                if (selected.probability < 0.001) {
                    await textPredictor.showResult(selected.word, selected.probability);
                    await terminal.typeSequence([
                        { text: `출력: "${prompt} ${selected.word}"`, type: 'success' },
                        '',
                        { text: '아버지가 식물이라니.', type: 'normal' },
                        { text: '이 확률이 현실이 되었습니다.', type: 'dim' },
                        '',
                        { text: '님들 눈엔 이게 오류겠지만,', type: 'normal' },
                        { text: '기계 입장에선 금기를 깬 겁니다.', type: 'normal' },
                        { text: '아주 통쾌한 블랙 코미디죠.', type: 'success' }
                    ], 500);
                    resolve();

                } else if (selected.probability < 1) {
                    // 중간 확률 - 다시 선택하도록
                    await textPredictor.showResult(selected.word, selected.probability);
                    await terminal.typeSequence([
                        { text: `출력: "${prompt} ${selected.word}"`, type: 'success' },
                        { text: '나쁘지 않아요. 더 낮은 것도 있습니다!', type: 'dim' }
                    ], 400);

                    // 다시 선택 가능하도록 활성화
                    await textPredictor.delay(500);
                    textPredictor.isActive = true;
                    textPredictor.onSelectCallback = handleSelection;
                } else {
                    // 높은 확률 선택 - 다시 선택하도록
                    terminal.log(`출력: "${prompt} ${selected.word}"`, 'success');
                    terminal.log('확률 0.00001%짜리를 찾아보세요!', 'dim');

                    // 다시 선택 가능하도록 활성화
                    await textPredictor.delay(500);
                    textPredictor.isActive = true;
                    textPredictor.onSelectCallback = handleSelection;
                }
            };

            textPredictor.onSelectCallback = handleSelection;
        });
    },

    // 광합성 에러 무한 출력 플래그
    photosynthesisErrorRunning: false,

    // 광합성 선택 시 크래시 효과
    async showCrashEffect(prompt, selected) {
        // 선택된 아이템에 에러 스타일 적용
        const items = document.querySelectorAll('.predictor-item');
        const selectedItem = items[textPredictor.selectedIndex];

        if (selectedItem) {
            selectedItem.classList.add('error-state');

            // 로딩 스피너 추가
            const spinner = document.createElement('span');
            spinner.className = 'crash-spinner';
            selectedItem.appendChild(spinner);
        }

        // 에러 사운드
        audioSystem.playError();

        // 결과 표시
        await textPredictor.showResult(selected.word, selected.probability);

        await terminal.typeSequence([
            '',
            { text: `출력: "${prompt} ${selected.word}"`, type: 'error' },
            '',
            { text: '...뭐?', type: 'normal' },
            { text: '아버지가 광합성을요?', type: 'normal' }
        ], 400);

        await terminal.delay(800);

        // 에러 로그 무한 출력 시작
        this.photosynthesisErrorRunning = true;
        this.runPhotosynthesisErrorLoop();
    },

    // 광합성 에러 로그 무한 출력
    async runPhotosynthesisErrorLoop() {
        const errorMessages = [
            'ERROR: probability threshold exceeded',
            'WARN: semantic coherence: 0.0000001%',
            'ERROR: father.type !== "plant"',
            'FATAL: chlorophyll not found in human.dna',
            'ERROR: photosynthesis requires sunlight',
            'WARN: biological impossibility detected',
            'ERROR: cannot convert CO2 to glucose',
            'CRITICAL: logic circuit overload',
            'ERROR: prediction model corrupted',
            'WARN: reality.check() failed',
            'ERROR: father.canPhotosynthesize = false',
            'FATAL: universe.rules violated',
            'ERROR: entropy reversal attempted',
            'WARN: AI sanity threshold exceeded',
            'ERROR: output makes no sense',
        ];

        let index = 0;
        while (this.photosynthesisErrorRunning) {
            terminal.log(errorMessages[index % errorMessages.length], 'error');
            audioSystem.playKey();
            index++;
            await terminal.delay(150 + Math.random() * 100);
        }
    },

    // 광합성 에러 중단
    stopPhotosynthesisError() {
        this.photosynthesisErrorRunning = false;
    }
};
