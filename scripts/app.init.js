/**
 * App Initialization
 * Purpose: Bootstrap application, wire modules together, set up event handlers
 * Last updated: 2025-01-27
 */

import { start as startMatrixRain, stop as stopMatrixRain } from './matrix-rain.js';
import { Terminal } from './terminal.core.js';
import registerCommands from './terminal.commands.js';
import * as utils from './utils.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize matrix rain background
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !utils.isReducedMotion()) {
    startMatrixRain(canvas);
  }

  // Initialize terminal
  const outputEl = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-input');
  const form = document.getElementById('terminal-form');
  const terminal = new Terminal({
    outputEl,
    inputEl,
    commandRegistry: {}
  });

  // Register commands with utils context
  registerCommands(terminal, utils);

  // Wire form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const command = inputEl.value.trim();
    if (command) {
      terminal.executeCommand(command);
      inputEl.value = '';
      terminal.focus();
    }
  });

  // Wire navigation buttons
  const navButtons = document.querySelectorAll('.nav button[data-cmd]');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const cmd = button.getAttribute('data-cmd');
      terminal.executeCommand(cmd);
      terminal.focus();
    });
  });

  // Focus management: clicking terminal focuses input
  const terminalSection = document.getElementById('terminal');
  terminalSection.addEventListener('click', () => {
    terminal.focus();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+L or Cmd+L to clear (when not in input)
    if ((e.ctrlKey || e.metaKey) && e.key === 'l' && document.activeElement !== inputEl) {
      e.preventDefault();
      terminal.executeCommand('clear');
    }
  });

  // Initial welcome message
  terminal.print('Welcome to TechZeph Terminal. Type "help" and press Enter for available commands.');

  // Focus input on load
  terminal.focus();
});

