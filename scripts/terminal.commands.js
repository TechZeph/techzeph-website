/**
 * Terminal Commands Registry
 * Purpose: Register initial commands (help, about, projects, github, cv)
 * Updated: 2025-01-27 - Added project listing + progress bar system
 */

export default function registerCommands(term, utils) {

  /****************************
   * HELP COMMAND
   ****************************/
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



  /****************************
   * ABOUT COMMAND
   ****************************/
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



  /****************************
   * PROJECTS COMMAND — LIST PROJECTS
   ****************************/
  term.registerCommand('projects', (args, context) => {
    const list = [
      'Projects',
      '',
      '1. Media Bias Monitor',
      '   View: project mbm',
      '',
      'More projects will be added soon.'
    ].join('\n');

    context.term.print(list);
  }, {
    description: 'List portfolio projects',
    category: 'info'
  });



  /****************************
   * PROJECT COMMAND — DETAIL VIEW + PROGRESS BAR
   ****************************/
  term.registerCommand('project', (args, context) => {
    const id = args[0];

    if (!id) {
      context.term.print('Usage: project <id>');
      context.term.print('Example: project mbm');
      return;
    }

    // Project registry (expand freely)
    const projects = {
      mbm: {
        name: 'Media Bias Monitor',
        progress: 55,
        description: 'A tool analysing political bias and media framing trends.'
      }
    };

    const project = projects[id];

    if (!project) {
      context.term.print(`Project not found: ${id}`);
      return;
    }

    // Build progress bar
    const barLength = 20;
    const filled = Math.round((project.progress / 100) * barLength);
    const empty = barLength - filled;

    const bar =
      '[' +
      '█'.repeat(filled) +
      '-'.repeat(empty) +
      `] ${project.progress}%`;

    const details = [
      project.name,
      '',
      project.description,
      '',
      'Progress:',
      bar,
      ''
    ].join('\n');

    context.term.print(details);
  }, {
    description: 'View project details + progress bar',
    category: 'info'
  });



  /****************************
   * GITHUB COMMAND
   ****************************/
  term.registerCommand('github', (args, context) => {
    context.term.print('Opening GitHub profile...');
    if (utils && utils.safeOpen) {
      utils.safeOpen('https://github.com/TechZeph');
    } else {
      context.term.print('GitHub URL not configured.');
    }
  }, {
    description: 'Open GitHub profile in new tab',
    category: 'external'
  });



  /****************************
   * CV COMMAND
   ****************************/
  term.registerCommand('cv', (args, context) => {
    const askConfirmation = () => {
      context.term.print('Are you sure you want to download a file? (yes/no)');
      context.term.setPendingHandler((response) => {
        const normalized = response.toLowerCase();
        if (['yes', 'y'].includes(normalized)) {
          context.term.print('Downloading CV...');
          if (utils && utils.downloadFile) {
            utils.downloadFile('assets/cv.pdf', 'Elliot_CV.pdf');
          } else {
            context.term.print('CV file not found. Please add assets/cv.pdf');
          }
        } else if (['no', 'n'].includes(normalized)) {
          context.term.print('Download cancelled.');
        } else {
          context.term.print("Please answer with 'yes' or 'no'.");
          askConfirmation();
        }
      });
    };

    askConfirmation();
  }, {
    description: 'Download CV',
    category: 'external'
  });



  /****************************
   * CLEAR COMMAND
   ****************************/
  term.registerCommand('clear', (args, context) => {
    context.term.clear();
    context.term.print('Terminal cleared.');
  }, {
    description: 'Clear terminal output',
    category: 'system'
  });



  /****************************
   * HOME COMMAND
   ****************************/
  term.registerCommand('home', (args, context) => {
    context.term.clear();
    context.term.print('Welcome to TechZeph Terminal. Type "help" for available commands.');
  }, {
    description: 'Return to home/welcome screen',
    category: 'system'
  });
}
