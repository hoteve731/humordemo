// Obstacles System - Maze, Math Puzzle, Physics

class ObstacleManager {
    constructor() {
        this.mazeWalls = [];
        this.mathOverlay = null;
        this.matrixChars = [];
        this.physicsEngine = null;
        this.physicsBodies = [];
    }

    // ==================== MAZE SYSTEM ====================
    generateMaze(targetX, targetY, radius = 150) {
        this.mazeWalls = [];

        // Create maze walls around target
        const cellSize = 30;
        const cols = Math.floor(radius * 2 / cellSize);
        const rows = Math.floor(radius * 2 / cellSize);
        const startX = targetX - radius;
        const startY = targetY - radius;

        // Simple maze pattern
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = startX + i * cellSize;
                const y = startY + j * cellSize;

                // Skip center area (target zone)
                const distToCenter = Math.sqrt(
                    Math.pow(x + cellSize / 2 - targetX, 2) +
                    Math.pow(y + cellSize / 2 - targetY, 2)
                );
                if (distToCenter < 40) continue;

                // Create walls with pattern
                if ((i + j) % 3 === 0 && Math.random() > 0.3) {
                    // Horizontal wall
                    if (Math.random() > 0.5) {
                        this.mazeWalls.push({
                            x: x,
                            y: y,
                            width: cellSize,
                            height: 8
                        });
                    } else {
                        // Vertical wall
                        this.mazeWalls.push({
                            x: x,
                            y: y,
                            width: 8,
                            height: cellSize
                        });
                    }
                }
            }
        }

        return this.mazeWalls;
    }

    // Simple SQUARE maze for Phase 2 with pre-calculated path
    generateSquareMaze(windowX, windowY, windowW, windowH) {
        this.mazeWalls = [];
        this.mazePath = []; // Pre-calculated path

        const cellSize = 40;
        const padding = 30;

        // Maze boundaries (square around the window)
        const mazeLeft = windowX - 150;
        const mazeTop = windowY - 100;
        const mazeRight = windowX + windowW + 150;
        const mazeBottom = windowY + windowH + 100;
        const mazeWidth = mazeRight - mazeLeft;
        const mazeHeight = mazeBottom - mazeTop;

        // Close button position
        const targetX = windowX + windowW - 22;
        const targetY = windowY + 18;

        // Entry point (bottom left)
        const entryX = mazeLeft + 50;
        const entryY = mazeBottom;

        // === BUILD MAZE WALLS ===

        // Outer walls with gaps
        // Top wall
        this.mazeWalls.push({ x: mazeLeft, y: mazeTop, width: mazeWidth, height: 8 });
        // Bottom wall with entry gap
        this.mazeWalls.push({ x: mazeLeft + 100, y: mazeBottom, width: mazeWidth - 100, height: 8 });
        // Left wall with gap at bottom
        this.mazeWalls.push({ x: mazeLeft, y: mazeTop, width: 8, height: mazeHeight - 80 });
        // Right wall
        this.mazeWalls.push({ x: mazeRight - 8, y: mazeTop, width: 8, height: mazeHeight });

        // Internal walls creating a path
        const w = 8; // wall thickness

        // Row 1 - horizontal barrier with gap on right
        this.mazeWalls.push({
            x: mazeLeft,
            y: mazeTop + cellSize * 2,
            width: mazeWidth - cellSize * 3,
            height: w
        });

        // Row 2 - vertical barrier on right side
        this.mazeWalls.push({
            x: mazeRight - cellSize * 3,
            y: mazeTop + cellSize * 2,
            width: w,
            height: cellSize * 2
        });

        // Row 3 - horizontal barrier with gap on left
        this.mazeWalls.push({
            x: mazeLeft + cellSize * 2,
            y: mazeTop + cellSize * 4,
            width: mazeWidth - cellSize * 2,
            height: w
        });

        // Row 4 - vertical barrier on left
        this.mazeWalls.push({
            x: mazeLeft + cellSize * 2,
            y: mazeTop + cellSize * 4,
            width: w,
            height: cellSize * 2
        });

        // Row 5 - horizontal barrier with gap on right
        this.mazeWalls.push({
            x: mazeLeft,
            y: mazeTop + cellSize * 6,
            width: mazeWidth - cellSize * 2,
            height: w
        });

        // === PRE-CALCULATED PATH (right-angle turns) ===
        // This path navigates through the maze with clear L-shaped turns

        this.mazePath = [
            // Start at entry
            { x: entryX, y: entryY + 20 },
            // Move up into maze
            { x: entryX, y: mazeBottom - 30 },
            // Continue up
            { x: entryX, y: mazeTop + cellSize * 6 + 30 },
            // Turn right
            { x: mazeRight - cellSize * 1.5, y: mazeTop + cellSize * 6 + 30 },
            // Turn up
            { x: mazeRight - cellSize * 1.5, y: mazeTop + cellSize * 4 + 30 },
            // Turn left
            { x: mazeLeft + cellSize * 2 + 30, y: mazeTop + cellSize * 4 + 30 },
            // Turn up
            { x: mazeLeft + cellSize * 2 + 30, y: mazeTop + cellSize * 2 + 30 },
            // Turn right
            { x: mazeRight - cellSize * 2.5, y: mazeTop + cellSize * 2 + 30 },
            // Turn up
            { x: mazeRight - cellSize * 2.5, y: mazeTop + cellSize + 20 },
            // Turn left towards target
            { x: targetX, y: mazeTop + cellSize + 20 },
            // Final approach - move down to target
            { x: targetX, y: targetY }
        ];

        return this.mazeWalls;
    }

    // Get the pre-calculated maze path
    getMazePath() {
        return this.mazePath || [];
    }

    // Simplified pathfinding - just return pre-calculated path
    findPath(startX, startY, endX, endY) {
        // If we have a pre-calculated path, use it
        if (this.mazePath && this.mazePath.length > 0) {
            // Prepend start position
            return [{ x: startX, y: startY }, ...this.mazePath];
        }

        // Fallback: simple direct path with one turn
        return [
            { x: startX, y: startY },
            { x: startX, y: endY },
            { x: endX, y: endY }
        ];
    }

    checkWallCollision(x, y, padding = 10) {
        for (const wall of this.mazeWalls) {
            if (x >= wall.x - padding && x <= wall.x + wall.width + padding &&
                y >= wall.y - padding && y <= wall.y + wall.height + padding) {
                return true;
            }
        }
        return false;
    }

    drawMaze(p) {
        if (this.mazeWalls.length === 0) return;

        p.push();
        p.noStroke();

        this.mazeWalls.forEach(wall => {
            // Main wall
            p.fill(60, 70, 120);
            p.rect(wall.x, wall.y, wall.width, wall.height, 2);

            // Glow effect
            p.drawingContext.shadowBlur = 15;
            p.drawingContext.shadowColor = '#6366f1';
            p.fill(80, 90, 160);
            p.rect(wall.x + 1, wall.y + 1, wall.width - 2, wall.height - 2, 2);
            p.drawingContext.shadowBlur = 0;
        });

        p.pop();
    }

    clearMaze() {
        this.mazeWalls = [];
        this.mazePath = [];
    }

    // ==================== MATH PUZZLE ====================
    createMathOverlay(win) {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;

        this.mathOverlay = {
            active: true,
            expression: `${a} + ${b} = ?`,
            answer: a + b,
            x: win.x,
            y: win.y,
            width: win.width,
            height: win.height
        };

        // Create matrix rain characters
        this.matrixChars = [];
        for (let i = 0; i < 50; i++) {
            this.matrixChars.push({
                x: win.x + Math.random() * win.width,
                y: win.y - Math.random() * 100,
                speed: Math.random() * 5 + 3,
                char: String.fromCharCode(0x30A0 + Math.random() * 96),
                opacity: Math.random()
            });
        }

        return this.mathOverlay;
    }

    updateMatrixRain() {
        if (!this.mathOverlay || !this.mathOverlay.active) return;

        this.matrixChars.forEach(char => {
            char.y += char.speed;
            if (char.y > this.mathOverlay.y + this.mathOverlay.height) {
                char.y = this.mathOverlay.y - 20;
                char.x = this.mathOverlay.x + Math.random() * this.mathOverlay.width;
                char.char = String.fromCharCode(0x30A0 + Math.random() * 96);
            }
            char.opacity = Math.sin(Date.now() / 200 + char.x) * 0.5 + 0.5;

            // Play digital sound occasionally
            if (Math.random() < 0.02) {
                audioSystem.playDigital();
            }
        });
    }

    drawMathOverlay(p) {
        if (!this.mathOverlay || !this.mathOverlay.active) return;

        p.push();

        // Dark overlay
        p.fill(0, 0, 0, 200);
        p.rect(this.mathOverlay.x, this.mathOverlay.y,
            this.mathOverlay.width, this.mathOverlay.height, 8);

        // Matrix rain
        p.textFont('monospace');
        p.textSize(14);
        this.matrixChars.forEach(char => {
            p.fill(0, 255, 136, char.opacity * 255);
            p.text(char.char, char.x, char.y);
        });

        // Math expression
        p.fill(255);
        p.textSize(32);
        p.textAlign(p.CENTER, p.CENTER);

        p.drawingContext.shadowBlur = 20;
        p.drawingContext.shadowColor = '#00ff88';
        p.text(this.mathOverlay.expression,
            this.mathOverlay.x + this.mathOverlay.width / 2,
            this.mathOverlay.y + this.mathOverlay.height / 2);
        p.drawingContext.shadowBlur = 0;

        p.pop();
    }

    async solveMath() {
        if (!this.mathOverlay) return;

        // Show answer
        this.mathOverlay.expression = `= ${this.mathOverlay.answer}`;
        audioSystem.playSuccess();

        await new Promise(r => setTimeout(r, 800));
        this.mathOverlay.active = false;
        this.mathOverlay = null;
        this.matrixChars = [];
    }

    // ==================== PHYSICS SYSTEM ====================
    initPhysics() {
        const Engine = Matter.Engine;
        const World = Matter.World;
        const Bodies = Matter.Bodies;

        this.physicsEngine = Engine.create();
        this.physicsEngine.world.gravity.y = 0.5;

        // Ground
        const ground = Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight + 25,
            window.innerWidth,
            50,
            { isStatic: true }
        );

        // Walls
        const leftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
        const rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });

        World.add(this.physicsEngine.world, [ground, leftWall, rightWall]);
    }

    addPhysicsBody(x, y, width, height) {
        if (!this.physicsEngine) this.initPhysics();

        const body = Matter.Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
            restitution: 0.6,
            friction: 0.1,
            frictionAir: 0.01
        });

        Matter.World.add(this.physicsEngine.world, body);
        this.physicsBodies.push(body);
        return body;
    }

    addCursorPhysicsBody(x, y) {
        if (!this.physicsEngine) this.initPhysics();

        const body = Matter.Bodies.circle(x, y, 15, {
            restitution: 0.8,
            friction: 0.05,
            frictionAir: 0.02
        });

        Matter.World.add(this.physicsEngine.world, body);
        return body;
    }

    updatePhysics() {
        if (this.physicsEngine) {
            Matter.Engine.update(this.physicsEngine, 1000 / 60);
        }
    }

    clearPhysics() {
        if (this.physicsEngine) {
            Matter.World.clear(this.physicsEngine.world);
            Matter.Engine.clear(this.physicsEngine);
            this.physicsEngine = null;
            this.physicsBodies = [];
        }
    }

    // Make bodies float (Phase 5)
    setFloatingMode() {
        if (this.physicsEngine) {
            this.physicsEngine.world.gravity.y = 0;
            this.physicsBodies.forEach(body => {
                Matter.Body.setVelocity(body, {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                });
            });
        }
    }
}

// Global obstacle manager
const obstacleManager = new ObstacleManager();
