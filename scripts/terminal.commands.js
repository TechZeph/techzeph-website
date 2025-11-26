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
 * PROJECTS — UNIFIED SUBCOMMAND SYSTEM
 ****************************/
term.registerCommand("projects", async (args, context) => {
  const sub = args[0];

  /***********************
   * HELP
   ***********************/
  if (!sub || sub === "help") {
    context.term.print([
      "projects — available subcommands:",
      "",
      "  projects help               Show this menu",
      "  projects list               List GitHub repositories",
      "  projects view <id>          Show details for a project",
      "  projects progress           Show progress for each repo",
      "",
      "Examples:",
      "  projects list",
      "  projects view mbm",
      "  projects progress"
    ].join("\n"));
    return;
  }

  /***********************
   * LIST GITHUB REPOS
   ***********************/
  if (sub === "list") {
    context.term.print("Fetching repositories...");

    try {
      const res = await fetch("https://api.github.com/users/TechZeph/repos");
      const repos = await res.json();

      if (!Array.isArray(repos)) {
        context.term.print("Failed to retrieve repository list.");
        return;
      }

      repos.forEach(r => context.term.print(`• ${r.name}`));
    } catch (e) {
      context.term.print("Error fetching GitHub repos.");
    }
    return;
  }

  /***********************
   * VIEW A PROJECT (REPLACES OLD 'project <id>')
   ***********************/
  if (sub === "view") {
    const id = args[1];
    if (!id) {
      context.term.print("Usage: projects view <id>");
      return;
    }

    // Local registry (expand later)
    const registry = {
      mbm: {
        name: "Media Bias Monitor",
        description: "A tool analysing political bias and media framing trends.",
        repo: "media-bias-monitor",
        progress: 55
      }
      // Add more here manually or auto-link via GitHub
    };

    const project = registry[id];

    if (!project) {
      context.term.print(`Project '${id}' not found.`);
      return;
    }

    const barLength = 20;
    const filled = Math.round((project.progress / 100) * barLength);
    const empty = barLength - filled;
    const bar = `[${"█".repeat(filled)}${"-".repeat(empty)}] ${project.progress}%`;

    context.term.print([
      project.name,
      "",
      project.description,
      "",
      "Progress:",
      bar,
      ""
    ].join("\n"));

    return;
  }

  /***********************
   * PROGRESS — READ todo.json FOR EACH REPO
   ***********************/
  if (sub === "progress") {
    context.term.print("Checking progress for each project...");

    try {
      const res = await fetch("https://api.github.com/users/TechZeph/repos");
      const repos = await res.json();

      for (const repo of repos) {
        const url = `https://raw.githubusercontent.com/TechZeph/${repo.name}/main/todo.json`;

        try {
          const todo = await fetch(url);
          if (!todo.ok) {
            context.term.print(`${repo.name}: No todo.json found.`);
            continue;
          }

          const json = await todo.json();

          const total = json.tasks?.length || 0;
          const done = json.tasks?.filter(t => t.done).length || 0;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);

          const barLen = 20;
          const filled = Math.round((pct / 100) * barLen);
          const bar = `[${"█".repeat(filled)}${"-".repeat(barLen - filled)}] ${pct}%`;

          context.term.print(`${repo.name}\n${bar}\n`);
        } catch {
          context.term.print(`${repo.name}: Could not read todo.json`);
        }
      }
    } catch {
      context.term.print("Error loading repos.");
    }
    return;
  }

  /***********************
   * UNKNOWN SUBCOMMAND
   ***********************/
  context.term.print(`Unknown subcommand: ${sub}`);
  context.term.print(`Try: projects help`);
}, {
  description: "List, view and track progress of all projects",
  category: "info"
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
