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
let lastTimestamp = 0;

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
    
    // Recalculate columns for rainfall effect (top to bottom, staggered launch)
    const columnCount = Math.floor(innerWidth / fontSize);
    columns = Array.from({ length: columnCount }, (_, i) => {
      const normalizedIndex = i / columnCount || 0;
      const speedFactor = 1.2 + normalizedIndex * 0.6; // Gradually faster towards the right
      const staggerDelay = i * 60 + Math.random() * 200; // launch waves left → right

      return {
        x: i * fontSize,
        y: -Math.random() * 60 - 40,
        speed: fontSize * speedFactor, // pixels per second (scaled later)
        gap: 10 + (i % 5) * 2, // repeating pattern for spacing
        lastY: -1000,
        delay: staggerDelay, // ms delay before activating
        active: false,
      };
    });
    lastTimestamp = 0; // Reset animation timing on resize
  };

  const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ELIOTCHZP';
  
  const draw = (timestamp = 0) => {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    const delta = timestamp - lastTimestamp || 16;
    lastTimestamp = timestamp;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Fade effect for ~40 second trail duration (higher opacity = faster fade = shorter trails)
    // At 60fps, 40 seconds = 2400 frames. Using 0.25 opacity for faster fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px monospace`;
    
    columns.forEach(column => {
      if (!column.active) {
        column.delay -= delta;
        if (column.delay <= 0) {
          column.active = true;
        } else {
          return;
        }
      }

      // Update position (convert speed to per-frame using delta time)
      const speedPerFrame = column.speed * (delta / 1000); // px this frame
      column.y += speedPerFrame;
      
      // Draw glyph more frequently for continuous rainfall streams
      const distanceSinceLast = column.y - column.lastY;
      if (distanceSinceLast >= column.gap || column.lastY < 0) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(char, column.x, column.y);
        column.lastY = column.y;
      }
      
      // Reset when off-screen - return to top with staggered relaunch
      if (column.y > height + fontSize * 2) {
        column.y = -Math.random() * 60 - 20;
        column.lastY = -1000; // Reset gap tracking
        column.delay = Math.random() * 200; // small pause before next drop
        column.active = false;
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

