// Matrix effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

// Terminal functionality
const input = document.getElementById('commandInput');
const output = document.getElementById('output');

const commands = {
    help: "Available commands: help, about, projects, contact",
    about: "This will take you to the About page (not implemented yet).",
    projects: "This will take you to the Projects page (not implemented yet).",
    contact: "This will take you to the Contact page (not implemented yet)."
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const value = input.value.trim().toLowerCase();
        const response = commands[value] || `Command not recognized: ${value}`;
        
        const p = document.createElement('p');
        p.innerHTML = `> ${value}<br>${response}`;
        output.appendChild(p);

        input.value = '';
        output.scrollTop = output.scrollHeight;
    }
});
