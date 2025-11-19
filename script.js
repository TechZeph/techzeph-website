// Minimal UI-only behaviour so you can test the look & feel.
// (We'll expand this later to emulate history, real terminal editing, etc.)
document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('term-output');
    const form = document.getElementById('term-form');
    const cmd = document.getElementById('cmd');
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = cmd.value.trim();
      if (!v) return;
      const lineReq = document.createElement('div');
      lineReq.className = 'line';
      lineReq.textContent = `> ${v}`;
      output.appendChild(lineReq);
      const lineResp = document.createElement('div');
      lineResp.className = 'line';
      // simple mock response table
      lineResp.textContent = (v.toLowerCase() === 'help')
        ? 'help — available commands: help, ping, clear'
        : `${v}: command not found`;
      output.appendChild(lineResp);
      cmd.value = '';
      // keep latest visible
      output.scrollTop = output.scrollHeight;
    });
  
    // small helper: focus terminal container on click so keyboard opens on mobile
    const term = document.getElementById('term');
    term.addEventListener('click', () => cmd.focus());
  });
  