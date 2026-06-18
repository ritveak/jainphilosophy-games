let animationId = null;
let resizeHandler = null;
let activeCanvas = null;

function startMatrix(canvas, options = {}) {
  if (!canvas) return;
  const crisp = options.crisp !== false;
  stopMatrix();
  activeCanvas = canvas;
  canvas.classList.remove('hidden');

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  canvas.style.opacity = crisp ? '1' : '0.22';
  const fontSize = crisp ? 18 : 16;
  const cols = Math.floor(width / fontSize);
  let drops = new Array(cols).fill(1);
  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプ0123456789';

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const newCols = Math.floor(width / fontSize);
    drops = new Array(newCols).fill(1);
    if (crisp) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    }
  }

  function draw() {
    if (crisp) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#39ff14';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    animationId = requestAnimationFrame(draw);
  }

  if (crisp) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
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
