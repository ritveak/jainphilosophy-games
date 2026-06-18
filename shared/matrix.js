let animationId = null;
let resizeHandler = null;
let activeCanvas = null;

function startMatrix(canvas) {
  if (!canvas) return;
  stopMatrix();
  activeCanvas = canvas;
  canvas.classList.remove('hidden');

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  canvas.style.opacity = 0.22;
  const cols = Math.floor(width / 16);
  let drops = new Array(cols).fill(1);
  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプ0123456789';

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const newCols = Math.floor(width / 16);
    drops = new Array(newCols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#39ff14';
    ctx.font = '16px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * 16, drops[i] * 16);
      if (drops[i] * 16 > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    animationId = requestAnimationFrame(draw);
  }

  resizeHandler = resize;
  window.addEventListener('resize', resizeHandler);
  draw();
}

function stopMatrix() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  if (activeCanvas) {
    activeCanvas.classList.add('hidden');
    activeCanvas = null;
  }
}
