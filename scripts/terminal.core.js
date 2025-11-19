/**
 * Terminal Core Engine
 * Purpose: Terminal class to manage terminal UI, command parsing, and output rendering
 * Public API: Terminal class with methods: constructor, print, registerCommand, executeCommand, focus, clear, availableCommands
 * Last updated: 2025-01-27
 */

/**
 * Terminal class to manage terminal UI
 * @param {Object} options
 * @param {HTMLElement} options.outputEl - Container for output lines
 * @param {HTMLInputElement} options.inputEl - Input field element
 * @param {Object} options.commandRegistry - Initial command registry (optional)
 */
export class Terminal {
  constructor({ outputEl, inputEl, commandRegistry = {} }) {
    if (!outputEl || !inputEl) {
      throw new Error('Terminal requires outputEl and inputEl');
    }
    
    this.outputEl = outputEl;
    this.inputEl = inputEl;
    this.commands = new Map();
    this.history = [];
    
    // Register initial commands if provided
    if (commandRegistry) {
      Object.entries(commandRegistry).forEach(([name, { handler, meta }]) => {
        this.registerCommand(name, handler, meta);
      });
    }
  }

  /**
   * Append a line to the terminal output
   * @param {string} line - Text to append
   * @param {Object} opts - Options (className, escapeHtml)
   */
  print(line, opts = {}) {
    const { className = 'line', escapeHtml: shouldEscape = true } = opts;
    const lineEl = document.createElement('div');
    lineEl.className = className;
    
    if (shouldEscape) {
      lineEl.textContent = line;
    } else {
      lineEl.innerHTML = line;
    }
    
    this.outputEl.appendChild(lineEl);
    this.scrollToBottom();
  }

  /**
   * Register a command with the terminal
   * @param {string} name - Command name
   * @param {Function} handler - Command handler function (args, context) => void
   * @param {Object} meta - Metadata (description, category, etc.)
   */
  registerCommand(name, handler, meta = {}) {
    if (typeof handler !== 'function') {
      throw new Error(`Handler for command "${name}" must be a function`);
    }
    this.commands.set(name.toLowerCase(), { handler, meta });
  }

  /**
   * Execute a command from input string
   * @param {string} inputString - Raw input string
   */
  executeCommand(inputString) {
    const trimmed = inputString.trim();
    if (!trimmed) return;

    // Add to history
    this.history.push(trimmed);
    
    // Print the command that was entered
    this.print(`> ${trimmed}`, { className: 'line command-line' });

    // Parse command and args (simple whitespace split)
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Look up command
    const command = this.commands.get(commandName);
    
    if (!command) {
      this.print(`Command not found: ${commandName}. Type 'help' for available commands.`);
      return;
    }

    // Execute command with context
    const context = {
      term: this,
      utils: null, // Will be injected by app.init.js
      env: {}
    };

    try {
      command.handler(args, context);
    } catch (error) {
      this.print(`Error executing command: ${error.message}`);
      console.error('Command execution error:', error);
    }
  }

  /**
   * Focus the input field
   */
  focus() {
    this.inputEl.focus();
  }

  /**
   * Clear the terminal output
   */
  clear() {
    this.outputEl.innerHTML = '';
  }

  /**
   * Get list of available commands with metadata
   * @returns {Array} Array of {name, meta} objects
   */
  availableCommands() {
    return Array.from(this.commands.entries()).map(([name, { meta }]) => ({
      name,
      meta
    }));
  }

  /**
   * Scroll output to bottom
   */
  scrollToBottom() {
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }
}

