// Window System - Canvas-based window rendering

class WindowManager {
    constructor() {
        this.windows = [];
        this.windowIdCounter = 0;
    }

    createWindow(x, y, width = 300, height = 200, title = 'Window') {
        const win = {
            id: this.windowIdCounter++,
            x: x,
            y: y,
            width: width,
            height: height,
            title: title,
            visible: true,
            opacity: 1,
            scale: 1,
            rotation: 0,
            glowing: false,
            floating: false,
            floatOffset: 0,
            floatSpeed: Math.random() * 0.02 + 0.01,
            pieces: null, // For puzzle effect
            physicsBody: null, // For Matter.js
            closeButton: {
                x: x + width - 35,
                y: y + 8,
                width: 25,
                height: 20
            }
        };

        this.windows.push(win);
        return win;
    }

    removeWindow(id) {
        const index = this.windows.findIndex(w => w.id === id);
        if (index !== -1) {
            this.windows.splice(index, 1);
        }
    }

    getWindow(id) {
        return this.windows.find(w => w.id === id);
    }

    updateCloseButtonPosition(win) {
        win.closeButton.x = win.x + win.width - 35;
        win.closeButton.y = win.y + 8;
    }

    getCloseButtonCenter(win) {
        return {
            x: win.closeButton.x + win.closeButton.width / 2,
            y: win.closeButton.y + win.closeButton.height / 2
        };
    }

    isPointInCloseButton(win, px, py) {
        const btn = win.closeButton;
        return px >= btn.x && px <= btn.x + btn.width &&
            py >= btn.y && py <= btn.y + btn.height;
    }

    clearAll() {
        this.windows = [];
    }

    // Floating effect for Phase 5
    updateFloating() {
        this.windows.forEach(win => {
            if (win.floating) {
                win.floatOffset += win.floatSpeed;
                win.y += Math.sin(win.floatOffset) * 0.5;
                win.x += Math.cos(win.floatOffset * 0.7) * 0.3;
                this.updateCloseButtonPosition(win);
            }
        });
    }

    draw(p) {
        this.windows.forEach(win => {
            if (!win.visible) return;
            this.drawWindow(p, win);
        });
    }

    drawWindow(p, win) {
        p.push();

        // Apply transformations
        p.translate(win.x + win.width / 2, win.y + win.height / 2);
        p.rotate(win.rotation);
        p.scale(win.scale);
        p.translate(-win.width / 2, -win.height / 2);

        // Glow effect
        if (win.glowing) {
            p.drawingContext.shadowBlur = 30;
            p.drawingContext.shadowColor = '#00d4ff';
        }

        // Window body
        p.fill(26, 26, 46, win.opacity * 255);
        p.stroke(60, 60, 100);
        p.strokeWeight(2);
        p.rect(0, 0, win.width, win.height, 8);

        // Title bar
        p.fill(22, 33, 62);
        p.noStroke();
        p.rect(0, 0, win.width, 35, 8, 8, 0, 0);

        // Title text
        p.fill(255, 255, 255, win.opacity * 200);
        p.textSize(14);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(win.title, 15, 17);

        // Close button
        const btnX = win.width - 35;
        const btnY = 8;

        p.fill(255, 51, 102);
        p.noStroke();
        p.rect(btnX, btnY, 25, 20, 4);

        // X mark
        p.stroke(255);
        p.strokeWeight(2);
        p.line(btnX + 7, btnY + 5, btnX + 18, btnY + 15);
        p.line(btnX + 18, btnY + 5, btnX + 7, btnY + 15);

        // Window content area
        p.fill(15, 15, 25, win.opacity * 255);
        p.noStroke();
        p.rect(10, 45, win.width - 20, win.height - 55, 4);

        // Content text
        p.fill(100, 100, 130);
        p.textSize(12);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('[ Window Content ]', win.width / 2, win.height / 2 + 10);

        p.drawingContext.shadowBlur = 0;
        p.pop();
    }

    // Animate window close
    async animateClose(win) {
        return new Promise(resolve => {
            gsap.to(win, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'back.in(2)',
                onComplete: () => {
                    win.visible = false;
                    resolve();
                }
            });
        });
    }

    // Animate window appear
    async animateAppear(win) {
        win.scale = 0;
        win.opacity = 0;
        win.visible = true;

        return new Promise(resolve => {
            gsap.to(win, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: 'back.out(1.5)',
                onComplete: resolve
            });
        });
    }

    // Split window into pieces for puzzle effect
    splitIntoPuzzle(win, p) {
        const pieces = [];
        const cols = 2;
        const rows = 2;
        const pieceW = win.width / cols;
        const pieceH = win.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                pieces.push({
                    origX: win.x + c * pieceW,
                    origY: win.y + r * pieceH,
                    x: win.x + c * pieceW + (Math.random() - 0.5) * 200,
                    y: win.y + r * pieceH + (Math.random() - 0.5) * 200,
                    width: pieceW,
                    height: pieceH,
                    rotation: (Math.random() - 0.5) * 0.5
                });
            }
        }

        win.pieces = pieces;
        return pieces;
    }

    // Animate puzzle pieces back together
    async animatePuzzleReassemble(win) {
        if (!win.pieces) return;

        const promises = win.pieces.map((piece, i) => {
            return new Promise(resolve => {
                gsap.to(piece, {
                    x: piece.origX,
                    y: piece.origY,
                    rotation: 0,
                    duration: 0.3,
                    delay: i * 0.1,
                    ease: 'back.out(1.2)',
                    onComplete: () => {
                        audioSystem.playClap();
                        resolve();
                    }
                });
            });
        });

        await Promise.all(promises);
        win.pieces = null;
    }

    drawPuzzlePieces(p, win) {
        if (!win.pieces) return;

        win.pieces.forEach(piece => {
            p.push();
            p.translate(piece.x + piece.width / 2, piece.y + piece.height / 2);
            p.rotate(piece.rotation);

            p.fill(26, 26, 46);
            p.stroke(60, 60, 100);
            p.strokeWeight(2);
            p.rect(-piece.width / 2, -piece.height / 2, piece.width, piece.height, 4);

            p.pop();
        });
    }
}

// Global window manager
const windowManager = new WindowManager();
