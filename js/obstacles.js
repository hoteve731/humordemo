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

    // Simple pathfinding through maze
    findPath(startX, startY, endX, endY) {
        const path = [];
        const stepSize = 15;
        let currentX = startX;
        let currentY = startY;

        path.push({ x: currentX, y: currentY });

        // A* simplified - just find way around walls
        const maxIterations = 500;
        let iterations = 0;

        while (iterations < maxIterations) {
            iterations++;

            const distToEnd = Math.sqrt(
                Math.pow(currentX - endX, 2) +
                Math.pow(currentY - endY, 2)
            );

            if (distToEnd < stepSize) {
                path.push({ x: endX, y: endY });
                break;
            }

            // Try to move towards target
            const dirX = (endX - currentX) / distToEnd;
            const dirY = (endY - currentY) / distToEnd;

            let nextX = currentX + dirX * stepSize;
            let nextY = currentY + dirY * stepSize;

            // Check for wall collision
            if (this.checkWallCollision(nextX, nextY)) {
                // Try alternative directions
                const alternatives = [
                    { x: currentX + stepSize, y: currentY },
                    { x: currentX - stepSize, y: currentY },
                    { x: currentX, y: currentY + stepSize },
                    { x: currentX, y: currentY - stepSize },
                    { x: currentX + stepSize, y: currentY + stepSize },
                    { x: currentX - stepSize, y: currentY + stepSize },
                    { x: currentX + stepSize, y: currentY - stepSize },
                    { x: currentX - stepSize, y: currentY - stepSize },
                ];

                // Find best alternative
                let bestAlt = null;
                let bestDist = Infinity;

                for (const alt of alternatives) {
                    if (!this.checkWallCollision(alt.x, alt.y)) {
                        const dist = Math.sqrt(
                            Math.pow(alt.x - endX, 2) +
                            Math.pow(alt.y - endY, 2)
                        );
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestAlt = alt;
                        }
                    }
                }

                if (bestAlt) {
                    nextX = bestAlt.x;
                    nextY = bestAlt.y;
                } else {
                    // Random escape
                    nextX = currentX + (Math.random() - 0.5) * stepSize * 2;
                    nextY = currentY + (Math.random() - 0.5) * stepSize * 2;
                }
            }

            currentX = nextX;
            currentY = nextY;
            path.push({ x: currentX, y: currentY });
        }

        return path;
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
        p.push();
        p.noStroke();

        this.mazeWalls.forEach(wall => {
            // Gradient-like effect
            p.fill(80, 80, 120);
            p.rect(wall.x, wall.y, wall.width, wall.height, 2);

            // Glow
            p.drawingContext.shadowBlur = 10;
            p.drawingContext.shadowColor = '#6366f1';
            p.fill(100, 100, 160);
            p.rect(wall.x + 1, wall.y + 1, wall.width - 2, wall.height - 2, 2);
            p.drawingContext.shadowBlur = 0;
        });

        p.pop();
    }

    clearMaze() {
        this.mazeWalls = [];
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
