/**
 * Matrix Rain Background Effect
 * Creates the iconic falling characters animation
 */

class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];

    this.init();
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.init());
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);

    // Initialize drops at random positions
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }

  draw() {
    // Semi-transparent black to create trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Green text
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      // Random character
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));

      // Draw character
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Varying brightness for depth effect
      const brightness = Math.random();
      if (brightness > 0.95) {
        this.ctx.fillStyle = '#ffffff'; // Occasional white flash
      } else if (brightness > 0.8) {
        this.ctx.fillStyle = '#00ff00'; // Bright green
      } else {
        this.ctx.fillStyle = '#006600'; // Darker green
      }

      this.ctx.fillText(char, x, y);

      // Reset color for next iteration
      this.ctx.fillStyle = '#00ff00';

      // Reset drop when it reaches bottom
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      this.drops[i]++;
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MatrixRain('matrix-bg');
});
