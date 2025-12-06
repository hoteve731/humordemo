// Console Log System - Typewriter effect for system messages

class ConsoleLogger {
    constructor() {
        this.container = document.getElementById('console-content');
        this.queue = [];
        this.isTyping = false;
        this.typeSpeed = 30; // ms per character
    }

    log(message, type = 'normal') {
        this.queue.push({ message, type });
        if (!this.isTyping) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.isTyping = false;
            return;
        }

        this.isTyping = true;
        const { message, type } = this.queue.shift();
        await this.typeMessage(message, type);
        this.processQueue();
    }

    async typeMessage(message, type) {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        this.container.appendChild(line);

        const prefix = this.getPrefix(type);
        const fullMessage = prefix + message;

        for (let i = 0; i < fullMessage.length; i++) {
            line.textContent = fullMessage.substring(0, i + 1);
            if (fullMessage[i] !== ' ') {
                await this.delay(this.typeSpeed);
            }
        }

        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
        await this.delay(200);
    }

    getPrefix(type) {
        switch (type) {
            case 'error': return '⚠ Error: ';
            case 'success': return '✓ ';
            case 'system': return '> System: ';
            default: return '> ';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clear() {
        this.container.innerHTML = '';
        this.queue = [];
    }
}

// Global console logger instance
const systemConsole = new ConsoleLogger();
