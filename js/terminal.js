/**
 * Terminal Functionality
 * Handles command input, output, and basic terminal commands
 */

class Terminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');

    if (!this.output || !this.input) return;

    this.commandHistory = [];
    this.historyIndex = -1;

    this.commands = {
      help: this.cmdHelp.bind(this),
      about: this.cmdAbout.bind(this),
      clear: this.cmdClear.bind(this),
      skills: this.cmdSkills.bind(this),
      contact: this.cmdContact.bind(this),
      github: this.cmdGithub.bind(this),
      pricing: this.cmdPricing.bind(this),
    };

    this.init();
  }

  init() {
    // Welcome message
    this.printWelcome();

    // Event listeners
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Focus input when clicking terminal
    document.querySelector('.terminal')?.addEventListener('click', () => {
      this.input.focus();
    });
  }

  printWelcome() {
    const welcome = [
      '╔═══════════════════════════════════════════════════════════╗',
      '║                                                           ║',
      '║   ████████╗███████╗ ██████╗██╗  ██╗███████╗███████╗██████╗ ║',
      '║   ╚══██╔══╝██╔════╝██╔════╝██║  ██║╚══███╔╝██╔════╝██╔══██╗║',
      '║      ██║   █████╗  ██║     ███████║  ███╔╝ █████╗  ██████╔╝║',
      '║      ██║   ██╔══╝  ██║     ██╔══██║ ███╔╝  ██╔══╝  ██╔═══╝ ║',
      '║      ██║   ███████╗╚██████╗██║  ██║███████╗███████╗██║     ║',
      '║      ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ║',
      '║                                                           ║',
      '╚═══════════════════════════════════════════════════════════╝',
      '',
      'Welcome to TechZeph Terminal v2.0',
      'Type "help" for available commands.',
      ''
    ];

    welcome.forEach((line, index) => {
      setTimeout(() => {
        this.printLine(line, 'response');
      }, index * 50);
    });
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      const cmd = this.input.value.trim().toLowerCase();
      if (cmd) {
        this.commandHistory.push(cmd);
        this.historyIndex = this.commandHistory.length;
        this.executeCommand(cmd);
      }
      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.commandHistory[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.input.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.input.value = '';
      }
    }
  }

  executeCommand(cmd) {
    // Print the command
    this.printLine(`guest@techzeph:~$ ${cmd}`, 'command');

    // Execute command or show error
    const handler = this.commands[cmd];
    if (handler) {
      handler();
    } else {
      this.printLine(`Command not found: ${cmd}. Type "help" for available commands.`, 'error');
    }

    this.scrollToBottom();
  }

  printLine(text, type = 'response') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;

    if (type === 'command') {
      line.innerHTML = `<span class="prompt">guest@techzeph:~$</span> <span class="command">${text.replace('guest@techzeph:~$ ', '')}</span>`;
    } else {
      line.innerHTML = `<span class="${type}">${text}</span>`;
    }

    this.output.appendChild(line);
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  // Commands
  cmdHelp() {
    const helpText = [
      '',
      'Available commands:',
      '  help     - Show this help message',
      '  about    - Learn about me',
      '  skills   - View my technical skills',
      '  github   - Open my GitHub profile',
      '  pricing  - View website pricing',
      '  contact  - Get contact information',
      '  clear    - Clear terminal screen',
      ''
    ];
    helpText.forEach(line => this.printLine(line));
  }

  cmdAbout() {
    const aboutText = [
      '',
      'About TechZeph:',
      '───────────────',
      'Passionate web developer & designer creating',
      'clean, efficient, and visually striking',
      'digital experiences.',
      '',
      'Specializing in modern web technologies',
      'and responsive design.',
      ''
    ];
    aboutText.forEach(line => this.printLine(line));

    // Scroll to about section
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  cmdSkills() {
    const skills = [
      '',
      'Technical Skills:',
      '─────────────────',
      '▓▓▓▓▓▓▓▓▓▓ HTML/CSS',
      '▓▓▓▓▓▓▓▓▓░ JavaScript',
      '▓▓▓▓▓▓▓▓░░ React',
      '▓▓▓▓▓▓▓░░░ Node.js',
      '▓▓▓▓▓▓▓▓░░ Python',
      '▓▓▓▓▓▓▓▓▓░ UI/UX Design',
      ''
    ];
    skills.forEach(line => this.printLine(line));
  }

  cmdGithub() {
    this.printLine('');
    this.printLine('Opening GitHub profile...');
    this.printLine('');
    window.open('https://github.com/TechZeph', '_blank');
  }

  cmdPricing() {
    const pricing = [
      '',
      'Website Pricing:',
      '────────────────',
      '★ Starter      - £299  (Single page)',
      '★ Professional - £599  (Up to 5 pages)',
      '★ Enterprise   - £1,299+ (Custom)',
      '',
      'Scroll down to see full details.',
      ''
    ];
    pricing.forEach(line => this.printLine(line));

    // Scroll to pricing section
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  }

  cmdContact() {
    const contact = [
      '',
      'Contact Information:',
      '────────────────────',
      'GitHub: github.com/TechZeph',
      'Email:  [your-email@example.com]',
      ''
    ];
    contact.forEach(line => this.printLine(line));
  }

  cmdClear() {
    this.output.innerHTML = '';
  }
}

// Export for use in main.js
window.Terminal = Terminal;
