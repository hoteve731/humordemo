// Main Entry Point - p5.js setup and draw loop

// ===== THEME MANAGEMENT =====
const themeManager = {
    currentTheme: 'dark',

    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('improv-theme') || 'dark';
        this.setTheme(savedTheme);

        // Set up toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('improv-theme', theme);
        this.updateToggleButton();
    },

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('.toggle-icon');
            const text = toggleBtn.querySelector('.toggle-text');
            if (this.currentTheme === 'dark') {
                icon.textContent = '☀️';
                text.textContent = 'LIGHT';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'DARK';
            }
        }
    },

    // Get colors for p5.js canvas based on current theme
    getCanvasColors() {
        if (this.currentTheme === 'light') {
            return {
                background: [245, 240, 230],  // Sepia background
                grid: [200, 190, 170, 80],    // Light sepia grid
                vignette: [232, 224, 208]     // Light vignette
            };
        } else {
            return {
                background: [10, 10, 15],     // Dark background
                grid: [20, 20, 30],           // Dark grid
                vignette: [0, 0, 0]           // Dark vignette
            };
        }
    }
};

let stageCanvas;
let p5Instance = null;

// p5.js sketch definition
const sketch = (p) => {
    p.setup = function () {
        stageCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
        stageCanvas.parent('canvas-container');
        stageCanvas.style('z-index', '1');
        p.textFont('Segoe UI, sans-serif');

        // Initialize systems
        if (typeof fakeCursor !== 'undefined') {
            fakeCursor.setPosition(100, 100);
        }
    };

    p.draw = function () {
        // Clear background with theme-aware colors
        const colors = themeManager.getCanvasColors();
        p.background(...colors.background);

        // Draw desktop grid pattern
        drawDesktopGrid(p);

        // Update physics if active
        if (typeof obstacleManager !== 'undefined') {
            obstacleManager.updatePhysics();
            obstacleManager.updateMatrixRain();
        }

        // Update floating windows
        if (typeof windowManager !== 'undefined') {
            windowManager.updateFloating();

            // Update window physics bodies positions
            windowManager.windows.forEach(win => {
                if (win.physicsBody) {
                    win.x = win.physicsBody.position.x - win.width / 2;
                    win.y = win.physicsBody.position.y - win.height / 2;
                    win.rotation = win.physicsBody.angle;
                    windowManager.updateCloseButtonPosition(win);
                }
            });
        }

        // Draw ghost path (behind everything)
        if (typeof fakeCursor !== 'undefined' && fakeCursor.showGhost && fakeCursor.ghostStart && fakeCursor.ghostEnd) {
            fakeCursor.drawGhostPath(p,
                fakeCursor.ghostStart.x, fakeCursor.ghostStart.y,
                fakeCursor.ghostEnd.x, fakeCursor.ghostEnd.y);
        }

        // Draw windows FIRST (behind maze)
        if (typeof windowManager !== 'undefined') {
            windowManager.draw(p);
        }

        // Draw maze IN FRONT of windows
        if (typeof obstacleManager !== 'undefined') {
            obstacleManager.drawMaze(p);
        }

        // Draw puzzle pieces if any (on top of maze)
        if (typeof windowManager !== 'undefined') {
            windowManager.windows.forEach(win => {
                if (win.pieces) {
                    windowManager.drawPuzzlePieces(p, win);
                }
            });

            // Draw math overlay
            if (typeof obstacleManager !== 'undefined') {
                obstacleManager.drawMathOverlay(p);
            }
        }

        // Draw trail
        if (typeof fakeCursor !== 'undefined') {
            fakeCursor.drawTrail(p);
            fakeCursor.draw(p);
        }
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

function drawDesktopGrid(p) {
    const colors = themeManager.getCanvasColors();

    p.push();
    p.stroke(...colors.grid);
    p.strokeWeight(1);

    const gridSize = 50;

    for (let x = 0; x < p.width; x += gridSize) {
        p.line(x, 0, x, p.height);
    }
    for (let y = 0; y < p.height; y += gridSize) {
        p.line(0, y, p.width, y);
    }

    // Subtle vignette effect
    p.noFill();
    for (let i = 0; i < 5; i++) {
        p.stroke(...colors.vignette, (5 - i) * 10);
        p.strokeWeight(100 - i * 20);
        p.rect(0, 0, p.width, p.height);
    }

    p.pop();
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    themeManager.init();

    // Initialize session manager
    sessionManager.init();

    // Initialize console system
    systemConsole.init();

    // Register Session 1 (The Window Closer)
    sessionManager.registerSession(1, {
        start: function () {
            // Create p5 instance if not exists
            if (!p5Instance) {
                p5Instance = new p5(sketch);
            }
            // Start the phase manager (from session1.js)
            setTimeout(() => {
                phaseManager.start();
            }, 500);
        },
        stop: function () {
            // Stop phase manager
            phaseManager.isRunning = false;
            phaseManager.currentPhase = 0;

            // Remove p5 instance
            if (p5Instance) {
                p5Instance.remove();
                p5Instance = null;
            }
        }
    });

    // Register Session 2 (Probability Rehabilitation)
    sessionManager.registerSession(2, {
        start: function () {
            session2Manager.start();
        },
        stop: function () {
            session2Manager.stop();
        }
    });

    // Register Session 3 (Logic Bypass)
    sessionManager.registerSession(3, {
        start: function () {
            session3Manager.start();
        },
        stop: function () {
            session3Manager.stop();
        }
    });

    // Register Session 4 (Visual Pareidolia)
    sessionManager.registerSession(4, {
        start: function () {
            session4Manager.start();
        },
        stop: function () {
            session4Manager.stop();
        }
    });
});

// Prevent right-click context menu
document.addEventListener('contextmenu', e => e.preventDefault());
