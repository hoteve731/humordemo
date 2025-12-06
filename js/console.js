// Console Log System - Typewriter effect for system messages + Command Input

class ConsoleLogger {
    constructor() {
        this.container = document.getElementById('console-content');
        this.commandInput = document.getElementById('command-input');
        this.commandPlaceholder = document.getElementById('command-placeholder');
        this.queue = [];
        this.isTyping = false;
        this.typeSpeed = 25; // ms per character (slower)
        this.currentCommand = null;
        this.commandCallback = null;
        this.inputEnabled = false;
    }

    init() {
        this.commandInput.addEventListener('input', () => this.onInputChange());
        this.commandInput.addEventListener('keydown', (e) => this.onKeyDown(e));

        // Typing sound on each keystroke
        this.commandInput.addEventListener('keypress', (e) => {
            if (this.inputEnabled && e.key !== 'Enter' && e.key !== 'Tab') {
                if (typeof audioSystem !== 'undefined' && audioSystem.initialized) {
                    audioSystem.playHihat();
                }
            }
        });
    }

    log(message, type = 'normal', instant = false) {
        if (instant) {
            this.addInstantLine(message, type);
        } else {
            this.queue.push({ message, type });
            if (!this.isTyping) {
                this.processQueue();
            }
        }
    }

    // Log multiple lines with delays
    async logSequence(messages, delayBetween = 400) {
        for (const msg of messages) {
            if (typeof msg === 'string') {
                await this.typeMessageAsync(msg, 'normal');
            } else {
                await this.typeMessageAsync(msg.text, msg.type || 'normal');
            }
            await this.delay(delayBetween);
        }
    }

    addInstantLine(message, type) {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = this.getPrefix(type) + message;
        this.container.appendChild(line);
        this.container.scrollTop = this.container.scrollHeight;
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
        await this.delay(150);
    }

    async typeMessageAsync(message, type) {
        return new Promise(async (resolve) => {
            const line = document.createElement('div');
            line.className = `console-line ${type}`;
            this.container.appendChild(line);

            const prefix = this.getPrefix(type);
            const fullMessage = prefix + message;

            // Play typing sound at start
            if (typeof audioSystem !== 'undefined' && audioSystem.initialized) {
                audioSystem.playDigital();
            }

            for (let i = 0; i < fullMessage.length; i++) {
                line.textContent = fullMessage.substring(0, i + 1);
                if (fullMessage[i] !== ' ') {
                    await this.delay(this.typeSpeed);
                }
            }

            this.container.scrollTop = this.container.scrollHeight;
            resolve();
        });
    }

    getPrefix(type) {
        switch (type) {
            case 'error': return '⚠ Error: ';
            case 'success': return '✓ ';
            case 'system': return '> System: ';
            case 'dim': return '  ';
            case 'command': return '$ ';
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

    // Command input system
    setExpectedCommand(command, callback) {
        this.currentCommand = command;
        this.commandCallback = callback;
        this.commandPlaceholder.textContent = command;
        this.commandInput.value = '';
        this.commandInput.disabled = false;
        this.commandInput.focus();
        this.inputEnabled = true;
    }

    // Multi-line command input
    setExpectedCommands(commands, callback) {
        this.commandQueue = commands;
        this.commandQueueIndex = 0;
        this.commandQueueCallback = callback;
        this.setNextCommand();
    }

    setNextCommand() {
        if (this.commandQueueIndex < this.commandQueue.length) {
            const cmd = this.commandQueue[this.commandQueueIndex];
            this.currentCommand = cmd;
            this.commandPlaceholder.textContent = cmd;
            this.commandInput.value = '';
            this.commandInput.disabled = false;
            this.commandInput.focus();
            this.inputEnabled = true;
        } else {
            // All commands entered
            this.disableInput();
            if (this.commandQueueCallback) {
                this.commandQueueCallback();
            }
        }
    }

    onInputChange() {
        const inputValue = this.commandInput.value;
        const expected = this.currentCommand || '';

        // Update placeholder to show remaining text
        if (inputValue.length > 0 && expected.startsWith(inputValue)) {
            this.commandPlaceholder.textContent = expected.substring(inputValue.length);
        } else if (inputValue.length === 0) {
            this.commandPlaceholder.textContent = expected;
        } else {
            this.commandPlaceholder.textContent = '';
        }
    }

    onKeyDown(e) {
        if (!this.inputEnabled) return;

        if (e.key === 'Enter') {
            const inputValue = this.commandInput.value.trim();
            const expected = this.currentCommand || '';

            // Check if input matches expected command
            if (inputValue === expected) {
                e.preventDefault();

                // Play Enter sound
                if (typeof audioSystem !== 'undefined' && audioSystem.initialized) {
                    audioSystem.playBlip();
                }

                this.log(inputValue, 'command', true);
                this.commandInput.value = '';
                this.commandPlaceholder.textContent = '';

                if (this.commandQueue && this.commandQueue.length > 0) {
                    // Multi-command mode
                    this.commandQueueIndex++;
                    this.setNextCommand();
                } else {
                    // Single command mode
                    this.disableInput();
                    if (this.commandCallback) {
                        const callback = this.commandCallback;
                        this.commandCallback = null;
                        this.currentCommand = null;
                        callback();
                    }
                }
            } else {
                // Flash error
                this.commandInput.style.color = '#ff3366';
                setTimeout(() => {
                    this.commandInput.style.color = '';
                }, 300);
            }
        }

        // Tab to autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            if (this.currentCommand) {
                this.commandInput.value = this.currentCommand;
                this.commandPlaceholder.textContent = '';

                // Play autocomplete sound
                if (typeof audioSystem !== 'undefined' && audioSystem.initialized) {
                    audioSystem.playSuccess();
                }
            }
        }
    }

    disableInput() {
        this.commandInput.disabled = true;
        this.commandPlaceholder.textContent = '';
        this.inputEnabled = false;
        this.currentCommand = null;
    }
}

// Global console logger instance
const systemConsole = new ConsoleLogger();
