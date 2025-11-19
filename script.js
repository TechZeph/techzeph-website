const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

const glyphs = 'アイウエオカキクケコサシスセソabcdeFGHIJ1234567890';
const matrix = {
    columns: [],
    fontSize: 16,
    hueShift: 0,
};

const resizeCanvas = () => {
    const { innerWidth, innerHeight, devicePixelRatio } = window;
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    matrix.columns = Array.from(
        { length: Math.floor(innerWidth / matrix.fontSize) },
        (_, index) => ({
            x: index * matrix.fontSize,
            y: Math.random() * innerHeight,
            speed: matrix.fontSize * (0.8 + Math.random() * 1.5),
        })
    );
};

const getColorStops = () => {
    const styles = getComputedStyle(document.documentElement);
    return [
        styles.getPropertyValue('--accent-primary').trim(),
        styles.getPropertyValue('--accent-secondary').trim(),
        styles.getPropertyValue('--accent-tertiary').trim()
    ];
};

const drawMatrix = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    ctx.fillStyle = 'rgba(3, 6, 11, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${matrix.fontSize}px 'Space Mono', monospace`;
    const colors = getColorStops();

    matrix.columns.forEach(column => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        ctx.fillText(char, column.x, column.y);

        column.y += column.speed * 0.05;

        if (column.y > height + matrix.fontSize) {
            column.y = -10 - Math.random() * 100;
        }
    });

    requestAnimationFrame(drawMatrix);
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(drawMatrix);

const form = document.querySelector('.command-line');
const input = document.getElementById('commandInput');
const output = document.getElementById('output');
const helperButtons = document.querySelectorAll('[data-command]');
const helperToggle = document.querySelector('.helper-toggle');
const helperSuite = document.getElementById('helperSuite');

const responses = {
    help: {
        title: 'help',
        body: `
            <p>Available commands: <span class="command">about</span>, <span class="command">projects</span>, <span class="command">contact</span>, <span class="command">resume</span>.</p>
            <p>Use helper buttons above or type commands manually. More commands arriving soon.</p>
        `
    },
    about: {
        title: 'about',
        body: `
            <p>Hi, I'm Elliot, an education student in the UK studying cyber security and web design.</p>
            <ul>
                <li>Currently exploring UI design.</li>
                <li>Skills in progress: Security fundamentals, Creative coding, Web design.</li>
            </ul>
        `
    },
    projects: {
        title: 'projects',
        body: `
            <p>Select work:</p>
            <ul>

            </ul>
        `
    },
    contact: {
        title: 'contact',
        body: `
            <p>You can reach me via email:</p>
            <ul>
                <li>Email (Not available yet): <a href="mailto:enter@here.com">enquiry@techzeph.co.uk</a></li>
                <li>Preferred topics: study collaborations, cyber security discussions, web design experiments.</li>
            </ul>
        `
    },
    resume: {
        title: 'resume',
        body: `
            <p>(Not available yet) Download my latest CV <a href="#" target="_blank" rel="noopener">here</a>. It covers coursework highlights, security labs, and ongoing web experiments.</p>
        `
    }
};

const renderEntry = (command, content) => {
    const article = document.createElement('article');

    const heading = document.createElement('p');
    heading.className = 'command-line-text';
    heading.textContent = `> ${command}`;

    const body = document.createElement('div');
    body.innerHTML = content.body;

    article.appendChild(heading);
    article.appendChild(body);
    output.appendChild(article);
    output.scrollTo({ top: output.scrollHeight, behavior: 'smooth' });
};

const handleCommand = (rawCommand) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command.length) return;

    if (!responses[command]) {
        renderEntry(command, {
            body: `<p>Command not recognized. Type <span class="command">help</span> for options.</p>`
        });
        return;
    }

    renderEntry(command, responses[command]);
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleCommand(input.value);
    input.value = '';
});

helperButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cmd = button.getAttribute('data-command');
        handleCommand(cmd);
        input.value = '';
        input.focus();
    });
});

if (helperToggle && helperSuite) {
    helperToggle.addEventListener('click', () => {
        const isHidden = helperSuite.hasAttribute('hidden');
        if (isHidden) {
            helperSuite.removeAttribute('hidden');
        } else {
            helperSuite.setAttribute('hidden', '');
        }
        helperToggle.setAttribute('aria-expanded', String(isHidden));
    });
}

// Provide quick keyboard suggestion
input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        input.blur();
    }
});
