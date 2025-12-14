// Session Manager - Controls the flow between Main Menu and individual Sessions

class SessionManager {
    constructor() {
        this.currentSession = null;
        this.sessions = {};
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Cache DOM elements
        this.menuEl = document.getElementById('main-menu');
        this.consoleEl = document.getElementById('console-log');
        this.canvasEl = document.getElementById('canvas-container');
        this.homeBtnEl = document.getElementById('home-btn');

        // Setup session card listeners
        document.querySelectorAll('.session-card').forEach(card => {
            card.addEventListener('click', () => {
                const sessionId = card.dataset.session;
                // Try to parse as number, but keep as string if it includes decimal
                const numericId = parseFloat(sessionId);
                this.startSession(isNaN(numericId) ? sessionId : numericId);
            });
        });

        // Setup home button
        this.homeBtnEl.addEventListener('click', () => {
            this.endSession();
        });
    }

    registerSession(id, sessionInstance) {
        this.sessions[id] = sessionInstance;
    }

    async startSession(id) {
        const session = this.sessions[id];
        if (!session) {
            console.warn(`Session ${id} not registered yet.`);
            // Show a placeholder message for unimplemented sessions
            alert(`Session ${id} is under development.`);
            return;
        }

        this.currentSession = id;

        // Hide menu, show session elements
        this.menuEl.classList.add('hidden');
        this.consoleEl.classList.remove('hidden');
        this.canvasEl.classList.remove('hidden');
        this.homeBtnEl.classList.remove('hidden');

        // Initialize audio (requires user gesture)
        await audioSystem.init();
        audioSystem.playBlip();

        // Start the session
        if (session.start) {
            session.start();
        }
    }

    endSession() {
        // Reload page to fully reset terminal history and all state
        location.reload();
    }
}

// Global session manager
const sessionManager = new SessionManager();
