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
        const session = this.sessions[this.currentSession];

        // Stop the current session if it has a stop method
        if (session && session.stop) {
            session.stop();
        }

        this.currentSession = null;

        // Cleanup
        windowManager.clearAll();
        if (typeof fakeCursor !== 'undefined') {
            fakeCursor.clearTrail();
        }
        systemConsole.clear();

        // Hide session elements, show menu
        this.menuEl.classList.remove('hidden');
        this.consoleEl.classList.add('hidden');
        this.canvasEl.classList.add('hidden');
        this.homeBtnEl.classList.add('hidden');

        // Remove the p5 canvas if it exists
        const canvas = document.querySelector('#canvas-container canvas');
        if (canvas) {
            canvas.remove();
        }
    }
}

// Global session manager
const sessionManager = new SessionManager();
