/**
 * Terminal Commands Registry
 * Purpose: Register initial commands (help, about, projects, github, cv)
 * Last updated: 2025-01-27
 */

/**
 * Register all commands with the terminal instance
 * @param {Terminal} term - Terminal instance
 * @param {Object} utils - Utility functions (safeOpen, downloadFile, etc.)
 */
export default function registerCommands(term, utils) {
  // Help command
  term.registerCommand('help', (args, context) => {
    const commands = context.term.availableCommands();
    const helpText = [
      'Available commands:',
      ...commands.map(cmd => `  ${cmd.name.padEnd(12)} — ${cmd.meta.description || 'No description'}`),
      '',
      'Type a command name and press Enter to execute it.'
    ].join('\n');
    context.term.print(helpText);
  }, {
    description: 'List all available commands',
    category: 'system'
  });

  // About command
  term.registerCommand('about', (args, context) => {
    const aboutText = [
      'About Elliot',
      '',
      'Cyber security + Web design student experimenting with website design.',
      'Based in the UK.',
      '',
      'This terminal portfolio showcases a clean, modular architecture',
      'built with vanilla JavaScript, CSS, and HTML.'
    ].join('\n');
    context.term.print(aboutText);
  }, {
    description: 'Display information about the portfolio owner',
    category: 'info'
  });

  // Projects command
  term.registerCommand('projects', (args, context) => {
    const projectsText = [
      'Projects',
      '',
      'Coming soon...',
      '',
      'Check back later for project showcases.'
    ].join('\n');
    context.term.print(projectsText);
  }, {
    description: 'List portfolio projects',
    category: 'info'
  });

  // GitHub command
  term.registerCommand('github', (args, context) => {
    context.term.print('Opening GitHub profile...');
    if (utils && utils.safeOpen) {
      utils.safeOpen('https://github.com/TechZeph'); // Update with actual GitHub URL
    } else {
      context.term.print('GitHub URL not configured. Please update terminal.commands.js');
    }
  }, {
    description: 'Open GitHub profile in new tab',
    category: 'external'
  });

  // CV command
  term.registerCommand('cv', (args, context) => {
    context.term.print('Downloading CV...');
    if (utils && utils.downloadFile) {
      utils.downloadFile('assets/cv.pdf', 'Elliot_CV.pdf');
    } else {
      context.term.print('CV file not found. Please add assets/cv.pdf');
    }
  }, {
    description: 'Download CV/resume',
    category: 'external'
  });

  // Clear command
  term.registerCommand('clear', (args, context) => {
    context.term.clear();
    context.term.print('Terminal cleared.');
  }, {
    description: 'Clear terminal output',
    category: 'system'
  });

  // Home command (alias for clear + welcome)
  term.registerCommand('home', (args, context) => {
    context.term.clear();
    context.term.print('Welcome to TechZeph Terminal. Type "help" for available commands.');
  }, {
    description: 'Return to home/welcome screen',
    category: 'system'
  });
}

