// Main Entry Point - p5.js setup and draw loop

let stageCanvas;
let cursorCanvas;

function setup() {
    // Create stage canvas
    stageCanvas = createCanvas(windowWidth, windowHeight);
    stageCanvas.parent('canvas-container');
    stageCanvas.style('z-index', '1');

    // Set up text
    textFont('Segoe UI, sans-serif');

    // Initialize cursor position
    fakeCursor.setPosition(100, 100);

    // Start button handler
    document.getElementById('start-btn').addEventListener('click', async () => {
        document.getElementById('start-overlay').classList.add('hidden');

        // Initialize audio (requires user gesture)
        await audioSystem.init();

        // Start the demo
        setTimeout(() => {
            phaseManager.start();
        }, 500);
    });
}

function draw() {
    // Clear background
    background(10, 10, 15);

    // Draw desktop grid pattern
    drawDesktopGrid();

    // Update physics if active
    obstacleManager.updatePhysics();
    obstacleManager.updateMatrixRain();

    // Update floating windows
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

    // Draw maze
    obstacleManager.drawMaze(this);

    // Draw windows
    windowManager.draw(this);

    // Draw puzzle pieces if any
    windowManager.windows.forEach(win => {
        if (win.pieces) {
            windowManager.drawPuzzlePieces(this, win);
        }
    });

    // Draw math overlay
    obstacleManager.drawMathOverlay(this);

    // Draw ghost path
    if (fakeCursor.showGhost && fakeCursor.ghostStart && fakeCursor.ghostEnd) {
        fakeCursor.drawGhostPath(this,
            fakeCursor.ghostStart.x, fakeCursor.ghostStart.y,
            fakeCursor.ghostEnd.x, fakeCursor.ghostEnd.y);
    }

    // Draw trail
    fakeCursor.drawTrail(this);

    // Draw cursor
    fakeCursor.draw(this);
}

function drawDesktopGrid() {
    push();
    stroke(20, 20, 30);
    strokeWeight(1);

    const gridSize = 50;

    for (let x = 0; x < width; x += gridSize) {
        line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
        line(0, y, width, y);
    }

    // Subtle vignette effect
    noFill();
    for (let i = 0; i < 5; i++) {
        stroke(0, 0, 0, (5 - i) * 10);
        strokeWeight(100 - i * 20);
        rect(0, 0, width, height);
    }

    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Prevent right-click context menu
document.addEventListener('contextmenu', e => e.preventDefault());
