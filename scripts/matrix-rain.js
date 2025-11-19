/**
 * Matrix Rain Animation
 * Purpose: Self-contained canvas animation for matrix-style background
 * Public API: start(canvas), stop()
 * Last updated: 2025-01-27
 */

let animationId = null;
let columns = [];
let fontSize = 16;
let canvas = null;
let ctx = null;

/**
 * Initialize and start the matrix rain animation
 * @param {HTMLCanvasElement} canvasElement - Canvas element to draw on
 */
export function start(canvasElement) {
  if (!canvasElement) return;
  
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const resizeCanvas = () => {
    const { innerWidth, innerHeight, devicePixelRatio } = window;
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Recalculate columns
    const columnCount = Math.floor(innerWidth / fontSize);
    columns = Array.from({ length: columnCount }, (_, i) => ({
      x: i * fontSize,
      y: Math.random() * innerHeight,
      speed: fontSize * (0.5 + Math.random() * 1.5),
    }));
  };

  const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const draw = () => {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px monospace`;
    
    columns.forEach(column => {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillText(char, column.x, column.y);
      
      column.y += column.speed * 0.05;
      
      if (column.y > height + fontSize) {
        column.y = -10 - Math.random() * 100;
      }
    });
    
    animationId = requestAnimationFrame(draw);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  draw();
}

/**
 * Stop the matrix rain animation
 */
export function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

