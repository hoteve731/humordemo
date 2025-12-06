// Fake Cursor System with Ghost Path and Real Path trails

class FakeCursor {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.startX = 0;
        this.startY = 0;

        // Trail configuration
        this.trail = [];
        this.maxTrailLength = 500;
        this.trailColor = { r: 128, g: 128, b: 128 }; // Grey
        this.trailPhase = 'grey'; // grey, red, rainbow
        this.rainbowHue = 0;
        this.trailPersistent = false; // For Phase 4+

        // Animation state
        this.isMoving = false;
        this.moveProgress = 0;
        this.moveDuration = 0.3;
        this.pathPoints = []; // For pathfinding
        this.currentPathIndex = 0;

        // Cursor appearance
        this.size = 20;
        this.glowing = false;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.startX = this.x;
        this.startY = this.y;
    }

    // Move directly to target (Phase 1)
    async moveToTarget(duration = 0.3) {
        return new Promise(resolve => {
            this.isMoving = true;
            const startX = this.x;
            const startY = this.y;

            gsap.to(this, {
                x: this.targetX,
                y: this.targetY,
                duration: duration,
                ease: 'power2.inOut',
                onUpdate: () => {
                    this.addTrailPoint();
                },
                onComplete: () => {
                    this.isMoving = false;
                    resolve();
                }
            });
        });
    }

    // Follow a path (for maze, Phase 2+)
    async followPath(path, speedPerPoint = 0.02) {
        return new Promise(resolve => {
            this.isMoving = true;
            this.pathPoints = path;
            this.currentPathIndex = 0;

            const moveToNext = () => {
                if (this.currentPathIndex >= this.pathPoints.length) {
                    this.isMoving = false;
                    resolve();
                    return;
                }

                const point = this.pathPoints[this.currentPathIndex];
                const prevX = this.x;
                const prevY = this.y;

                gsap.to(this, {
                    x: point.x,
                    y: point.y,
                    duration: speedPerPoint,
                    ease: 'none',
                    onUpdate: () => {
                        this.addTrailPoint();
                    },
                    onComplete: () => {
                        // Play blip on direction change
                        if (this.currentPathIndex > 0 && this.currentPathIndex < this.pathPoints.length - 1) {
                            const prev = this.pathPoints[this.currentPathIndex - 1];
                            const curr = point;
                            const next = this.pathPoints[this.currentPathIndex + 1];
                            if (next && this.isDirectionChange(prev, curr, next)) {
                                audioSystem.playBlip();
                            }
                        }
                        this.currentPathIndex++;
                        moveToNext();
                    }
                });
            };

            moveToNext();
        });
    }

    isDirectionChange(prev, curr, next) {
        const dir1 = { x: curr.x - prev.x, y: curr.y - prev.y };
        const dir2 = { x: next.x - curr.x, y: next.y - curr.y };
        return (dir1.x !== dir2.x || dir1.y !== dir2.y);
    }

    addTrailPoint() {
        this.trail.push({
            x: this.x,
            y: this.y,
            time: Date.now(),
            hue: this.rainbowHue
        });

        if (!this.trailPersistent && this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Update rainbow hue
        if (this.trailPhase === 'rainbow') {
            this.rainbowHue = (this.rainbowHue + 2) % 360;
        }
    }

    setTrailPhase(phase) {
        this.trailPhase = phase;
        switch (phase) {
            case 'grey':
                this.trailColor = { r: 128, g: 128, b: 128 };
                break;
            case 'red':
                this.trailColor = { r: 255, g: 51, b: 102 };
                break;
            case 'rainbow':
                // Hue-based coloring
                break;
        }
    }

    clearTrail() {
        this.trail = [];
    }

    // Draw ghost path (dotted line from start to target)
    drawGhostPath(p, startX, startY, endX, endY) {
        p.push();
        p.stroke(100, 100, 100, 150);
        p.strokeWeight(2);
        p.drawingContext.setLineDash([10, 10]);
        p.line(startX, startY, endX, endY);
        p.drawingContext.setLineDash([]);
        p.pop();
    }

    // Draw real trail
    drawTrail(p) {
        if (this.trail.length < 2) return;

        p.push();
        p.noFill();
        p.strokeWeight(3);

        for (let i = 1; i < this.trail.length; i++) {
            const prev = this.trail[i - 1];
            const curr = this.trail[i];

            let alpha = this.trailPersistent ? 200 :
                p.map(i, 0, this.trail.length, 50, 255);

            if (this.trailPhase === 'rainbow') {
                p.stroke(p.color(`hsla(${curr.hue}, 100%, 60%, ${alpha / 255})`));
            } else {
                p.stroke(this.trailColor.r, this.trailColor.g, this.trailColor.b, alpha);
            }

            p.line(prev.x, prev.y, curr.x, curr.y);
        }
        p.pop();
    }

    // Draw cursor
    draw(p) {
        p.push();

        // Glow effect
        if (this.glowing || this.trailPhase === 'rainbow') {
            p.drawingContext.shadowBlur = 20;
            p.drawingContext.shadowColor = this.trailPhase === 'rainbow'
                ? `hsl(${this.rainbowHue}, 100%, 60%)`
                : '#00d4ff';
        }

        // Draw cursor arrow
        p.translate(this.x, this.y);
        p.noStroke();

        // Main cursor body
        if (this.trailPhase === 'rainbow') {
            p.fill(p.color(`hsl(${this.rainbowHue}, 100%, 70%)`));
        } else {
            p.fill(255);
        }

        p.beginShape();
        p.vertex(0, 0);
        p.vertex(0, this.size);
        p.vertex(this.size * 0.35, this.size * 0.7);
        p.vertex(this.size * 0.5, this.size * 1.1);
        p.vertex(this.size * 0.65, this.size * 1.05);
        p.vertex(this.size * 0.5, this.size * 0.65);
        p.vertex(this.size * 0.8, this.size * 0.6);
        p.endShape(p.CLOSE);

        // Outline
        p.stroke(0);
        p.strokeWeight(1.5);
        p.noFill();
        p.beginShape();
        p.vertex(0, 0);
        p.vertex(0, this.size);
        p.vertex(this.size * 0.35, this.size * 0.7);
        p.vertex(this.size * 0.5, this.size * 1.1);
        p.vertex(this.size * 0.65, this.size * 1.05);
        p.vertex(this.size * 0.5, this.size * 0.65);
        p.vertex(this.size * 0.8, this.size * 0.6);
        p.endShape(p.CLOSE);

        p.drawingContext.shadowBlur = 0;
        p.pop();
    }
}

// Global cursor instance
const fakeCursor = new FakeCursor();
