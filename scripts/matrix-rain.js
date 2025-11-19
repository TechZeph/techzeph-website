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
let frameCount = 0;

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
    
    // Recalculate columns for rainfall effect (top to bottom, less random)
    const columnCount = Math.floor(innerWidth / fontSize);
    columns = Array.from({ length: columnCount }, (_, i) => ({
      x: i * fontSize,
      y: -Math.random() * 100 - 50, // Start near top (slightly staggered)
      speed: fontSize * (0.3 + Math.random() * 0.5), // More consistent speeds
      gap: Math.random() * 15 + 8, // Smaller, more consistent gaps
      lastY: -1000, // Track last glyph position
      skipChance: Math.random() * 0.2, // Much lower skip chance for consistent streams
    }));
    frameCount = 0; // Reset frame counter on resize
  };

  const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const draw = () => {
    frameCount++;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Much less ghosting - higher opacity fade (0.15 = less ghosting than 0.05)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px monospace`;
    
    columns.forEach(column => {
      // Low random chance to skip (for slight variation, not heavy randomness)
      if (Math.random() < column.skipChance) {
        return;
      }
      
      // Update position
      column.y += column.speed * 0.015; // Slower speed for reduced cycling rate
      
      // Draw glyph more frequently for continuous rainfall streams
      const distanceSinceLast = column.y - column.lastY;
      if (distanceSinceLast >= column.gap || column.lastY < 0) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(char, column.x, column.y);
        column.lastY = column.y;
      }
      
      // Reset when off-screen - return to top for continuous rainfall
      if (column.y > height + fontSize * 2) {
        column.y = -Math.random() * 50 - 20; // Start near top (less random)
        column.lastY = -1000; // Reset gap tracking
        column.gap = Math.random() * 15 + 8; // Maintain consistent gap
        column.speed = fontSize * (0.3 + Math.random() * 0.5); // Maintain consistent speed
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

